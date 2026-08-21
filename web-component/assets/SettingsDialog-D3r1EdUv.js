import { a$ as sd, b0 as mo, b2 as Dp, b3 as id, bB as od, b1 as js, b8 as Op, b6 as za, b9 as ad, aa as vt, bp as yo, a8 as Me, ba as Ft, bb as lo, bc as hs, bd as Hr, be as wo, bf as xo, bg as _o, b4 as Np, bC as Mp, b5 as Rp, bD as _c, a7 as Eo, bl as Bt, ac as $o, ae as wr, aj as as, ak as ko, R as Ec, al as Mr, ad as Ha, bu as Rr, bw as Bp, bm as en, bE as Us, bF as xa, bG as _a, bH as Ea, aG as ld, bI as sr, b as is, bJ as cd, bs as ls, ab as Up, bK as dd, bL as Pp, bM as zp, bN as Hp, bO as qp, bP as jp, bQ as $c, bR as Fp, bv as kc, bj as Zp, s as rt, bS as ro, bT as kn, bU as Ac, bV as $a, bW as Sc, bX as Vp, bY as Gp, bZ as Wp, b_ as Cc, b$ as Kp, c0 as Ic, c1 as Qp, ag as Yp, c2 as mi, bt as yi, c3 as Xp, c4 as Jp, c5 as eg, c6 as tg, c7 as Tc, c8 as ng, c9 as rg, ca as sg } from "./App-1qWol-Cs.js";
import { aP as Ee, a as y, b as me, aQ as Ut, aN as Nn, a_ as or, a$ as Pt, b0 as at, b1 as ce, b2 as ar, b4 as lr, b5 as Ao, bd as se, b3 as Re, b8 as Ze, b6 as R, n as Oi, b7 as N, Z as Be, bh as fe, bg as $t, bf as jt, aJ as yr, aq as ud, ap as xr, aZ as ig, bj as Lc } from "./entry-De5pG27L.js";
import { D as og, a as ag } from "./DialogWrapper-DhZEVMtT.js";
import { I as Or } from "./InfoPopoverButton-BgGPXuZK.js";
import { H as hd } from "./hidden-input-DK963QgL.js";
import { b as lg, a as Dc } from "./input-C3JkTJyC.js";
const qa = ad({ component: "radio-group", parts: ["root", "item"] }), nl = new sd("RadioGroup.Root");
class rl {
  static create(e) {
    return nl.set(new rl(e));
  }
  opts;
  #e = Ee(() => this.opts.value.current !== "");
  get hasValue() {
    return y(this.#e);
  }
  set hasValue(e) {
    me(this.#e, e);
  }
  rovingFocusGroup;
  attachment;
  constructor(e) {
    this.opts = e, this.attachment = mo(this.opts.ref), this.rovingFocusGroup = new Op({
      rootNode: this.opts.ref,
      candidateAttr: qa.item,
      loop: this.opts.loop,
      orientation: this.opts.orientation
    });
  }
  isChecked(e) {
    return this.opts.value.current === e;
  }
  setValue(e) {
    this.opts.value.current = e;
  }
  #t = Ee(() => ({
    id: this.opts.id.current,
    role: "radiogroup",
    "aria-required": za(this.opts.required.current),
    "aria-disabled": za(this.opts.disabled.current),
    "aria-readonly": this.opts.readonly.current ? "true" : void 0,
    "data-disabled": js(this.opts.disabled.current),
    "data-readonly": js(this.opts.readonly.current),
    "data-orientation": this.opts.orientation.current,
    [qa.root]: "",
    ...this.attachment
  }));
  get props() {
    return y(this.#t);
  }
  set props(e) {
    me(this.#t, e);
  }
}
class sl {
  static create(e) {
    return new sl(e, nl.get());
  }
  opts;
  root;
  attachment;
  #e = Ee(() => this.root.opts.value.current === this.opts.value.current);
  get checked() {
    return y(this.#e);
  }
  set checked(e) {
    me(this.#e, e);
  }
  #t = Ee(() => this.opts.disabled.current || this.root.opts.disabled.current);
  #n = Ee(() => this.root.opts.readonly.current);
  #r = Ee(() => this.root.isChecked(this.opts.value.current));
  #s = Ut(-1);
  constructor(e, t) {
    this.opts = e, this.root = t, this.attachment = mo(this.opts.ref), this.opts.value.current === this.root.opts.value.current ? (this.root.rovingFocusGroup.setCurrentTabStopId(this.opts.id.current), me(this.#s, 0)) : this.root.opts.value.current || me(this.#s, 0), Nn(() => {
      me(this.#s, this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current), !0);
    }), Dp(
      [
        () => this.opts.value.current,
        () => this.root.opts.value.current
      ],
      () => {
        this.opts.value.current === this.root.opts.value.current && (this.root.rovingFocusGroup.setCurrentTabStopId(this.opts.id.current), me(this.#s, 0));
      }
    ), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this), this.onfocus = this.onfocus.bind(this);
  }
  onclick(e) {
    this.opts.disabled.current || y(this.#n) || this.root.setValue(this.opts.value.current);
  }
  onfocus(e) {
    !this.root.hasValue || y(this.#n) || this.root.setValue(this.opts.value.current);
  }
  onkeydown(e) {
    if (!y(this.#t)) {
      if (e.key === id) {
        e.preventDefault(), y(this.#n) || this.root.setValue(this.opts.value.current);
        return;
      }
      this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e, !0);
    }
  }
  #o = Ee(() => ({ checked: y(this.#r) }));
  get snippetProps() {
    return y(this.#o);
  }
  set snippetProps(e) {
    me(this.#o, e);
  }
  #a = Ee(() => ({
    id: this.opts.id.current,
    disabled: y(this.#t) ? !0 : void 0,
    "data-value": this.opts.value.current,
    "data-orientation": this.root.opts.orientation.current,
    "data-disabled": js(y(this.#t)),
    "data-readonly": js(y(this.#n)),
    "data-state": y(this.#r) ? "checked" : "unchecked",
    "aria-checked": od(y(this.#r)),
    [qa.item]: "",
    type: "button",
    role: "radio",
    tabindex: y(this.#s),
    onkeydown: this.onkeydown,
    onfocus: this.onfocus,
    onclick: this.onclick,
    ...this.attachment
  }));
  get props() {
    return y(this.#a);
  }
  set props(e) {
    me(this.#a, e);
  }
}
class il {
  static create() {
    return new il(nl.get());
  }
  root;
  #e = Ee(() => this.root.opts.name.current !== void 0);
  get shouldRender() {
    return y(this.#e);
  }
  set shouldRender(e) {
    me(this.#e, e);
  }
  constructor(e) {
    this.root = e, this.onfocus = this.onfocus.bind(this);
  }
  onfocus(e) {
    this.root.rovingFocusGroup.focusCurrentTabStop();
  }
  #t = Ee(() => ({
    name: this.root.opts.name.current,
    value: this.root.opts.value.current,
    required: this.root.opts.required.current,
    disabled: this.root.opts.disabled.current,
    onfocus: this.onfocus
  }));
  get props() {
    return y(this.#t);
  }
  set props(e) {
    me(this.#t, e);
  }
}
function fd(n, e) {
  or(e, !0);
  const t = il.create();
  var r = Pt(), i = at(r);
  {
    var a = (c) => {
      hd(c, yo(() => t.props));
    };
    vt(i, (c) => {
      t.shouldRender && c(a);
    });
  }
  ce(n, r), ar();
}
lr(fd, {}, [], [], { mode: "open" });
var cg = Ze("<div><!></div>"), dg = Ze("<!> <!>", 1);
function co(n, e) {
  const t = Ao();
  or(e, !0);
  let r = Me(e, "disabled", 7, !1), i = Me(e, "children", 7), a = Me(e, "child", 7), c = Me(e, "value", 15, ""), d = Me(e, "ref", 15, null), h = Me(e, "orientation", 7, "vertical"), g = Me(e, "loop", 7, !0), b = Me(e, "name", 7, void 0), m = Me(e, "required", 7, !1), v = Me(e, "readonly", 7, !1), T = Me(e, "id", 23, () => hs(t)), A = Me(e, "onValueChange", 7, lo), E = _o(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "disabled",
    "children",
    "child",
    "value",
    "ref",
    "orientation",
    "loop",
    "name",
    "required",
    "readonly",
    "id",
    "onValueChange"
  ]);
  const L = rl.create({
    orientation: Ft(() => h()),
    disabled: Ft(() => r()),
    loop: Ft(() => g()),
    name: Ft(() => b()),
    required: Ft(() => m()),
    readonly: Ft(() => v()),
    id: Ft(() => T()),
    value: Ft(() => c(), (O) => {
      O !== c() && (c(O), A()?.(O));
    }),
    ref: Ft(() => d(), (O) => d(O))
  }), U = Ee(() => xo(E, L.props));
  var P = {
    get disabled() {
      return r();
    },
    set disabled(O = !1) {
      r(O), Re();
    },
    get children() {
      return i();
    },
    set children(O) {
      i(O), Re();
    },
    get child() {
      return a();
    },
    set child(O) {
      a(O), Re();
    },
    get value() {
      return c();
    },
    set value(O = "") {
      c(O), Re();
    },
    get ref() {
      return d();
    },
    set ref(O = null) {
      d(O), Re();
    },
    get orientation() {
      return h();
    },
    set orientation(O = "vertical") {
      h(O), Re();
    },
    get loop() {
      return g();
    },
    set loop(O = !0) {
      g(O), Re();
    },
    get name() {
      return b();
    },
    set name(O = void 0) {
      b(O), Re();
    },
    get required() {
      return m();
    },
    set required(O = !1) {
      m(O), Re();
    },
    get readonly() {
      return v();
    },
    set readonly(O = !1) {
      v(O), Re();
    },
    get id() {
      return T();
    },
    set id(O = hs(t)) {
      T(O), Re();
    },
    get onValueChange() {
      return A();
    },
    set onValueChange(O = lo) {
      A(O), Re();
    }
  }, J = dg(), ie = at(J);
  {
    var te = (O) => {
      var k = Pt(), $ = at(k);
      Hr($, a, () => ({ props: y(U) })), ce(O, k);
    }, ee = (O) => {
      var k = cg();
      wo(k, () => ({ ...y(U) }));
      var $ = R(k);
      Hr($, () => i() ?? Oi), N(k), ce(O, k);
    };
    vt(ie, (O) => {
      a() ? O(te) : O(ee, -1);
    });
  }
  var F = se(ie, 2);
  return fd(F, {}), ce(n, J), ar(P);
}
lr(
  co,
  {
    disabled: {},
    children: {},
    child: {},
    value: {},
    ref: {},
    orientation: {},
    loop: {},
    name: {},
    required: {},
    readonly: {},
    id: {},
    onValueChange: {}
  },
  [],
  [],
  { mode: "open" }
);
var ug = Ze("<button><!></button>");
function pd(n, e) {
  const t = Ao();
  or(e, !0);
  let r = Me(e, "id", 23, () => hs(t)), i = Me(e, "children", 7), a = Me(e, "child", 7), c = Me(e, "value", 7), d = Me(e, "disabled", 7, !1), h = Me(e, "ref", 15, null), g = _o(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "id",
    "children",
    "child",
    "value",
    "disabled",
    "ref"
  ]);
  const b = sl.create({
    value: Ft(() => c()),
    disabled: Ft(() => d() ?? !1),
    id: Ft(() => r()),
    ref: Ft(() => h(), (U) => h(U))
  }), m = Ee(() => xo(g, b.props));
  var v = {
    get id() {
      return r();
    },
    set id(U = hs(t)) {
      r(U), Re();
    },
    get children() {
      return i();
    },
    set children(U) {
      i(U), Re();
    },
    get child() {
      return a();
    },
    set child(U) {
      a(U), Re();
    },
    get value() {
      return c();
    },
    set value(U) {
      c(U), Re();
    },
    get disabled() {
      return d();
    },
    set disabled(U = !1) {
      d(U), Re();
    },
    get ref() {
      return h();
    },
    set ref(U = null) {
      h(U), Re();
    }
  }, T = Pt(), A = at(T);
  {
    var E = (U) => {
      var P = Pt(), J = at(P);
      {
        let ie = Ee(() => ({ props: y(m), ...b.snippetProps }));
        Hr(J, a, () => y(ie));
      }
      ce(U, P);
    }, L = (U) => {
      var P = ug();
      wo(P, () => ({ ...y(m) }));
      var J = R(P);
      Hr(J, () => i() ?? Oi, () => b.snippetProps), N(P), ce(U, P);
    };
    vt(A, (U) => {
      a() ? U(E) : U(L, -1);
    });
  }
  return ce(n, T), ar(v);
}
lr(
  pd,
  {
    id: {},
    children: {},
    child: {},
    value: {},
    disabled: {},
    ref: {}
  },
  [],
  [],
  { mode: "open" }
);
const gd = ad({ component: "switch", parts: ["root", "thumb"] }), ol = new sd("Switch.Root");
class al {
  static create(e) {
    return ol.set(new al(e));
  }
  opts;
  attachment;
  constructor(e) {
    this.opts = e, this.attachment = mo(e.ref), this.onkeydown = this.onkeydown.bind(this), this.onclick = this.onclick.bind(this);
  }
  #e() {
    this.opts.checked.current = !this.opts.checked.current;
  }
  onkeydown(e) {
    !(e.key === Np || e.key === id) || this.opts.disabled.current || (e.preventDefault(), this.#e());
  }
  onclick(e) {
    this.opts.disabled.current || this.#e();
  }
  #t = Ee(() => ({
    "data-disabled": js(this.opts.disabled.current),
    "data-state": Mp(this.opts.checked.current),
    "data-required": js(this.opts.required.current)
  }));
  get sharedProps() {
    return y(this.#t);
  }
  set sharedProps(e) {
    me(this.#t, e);
  }
  #n = Ee(() => ({ checked: this.opts.checked.current }));
  get snippetProps() {
    return y(this.#n);
  }
  set snippetProps(e) {
    me(this.#n, e);
  }
  #r = Ee(() => ({
    ...this.sharedProps,
    id: this.opts.id.current,
    role: "switch",
    disabled: Rp(this.opts.disabled.current),
    "aria-checked": od(this.opts.checked.current),
    "aria-required": za(this.opts.required.current),
    [gd.root]: "",
    onclick: this.onclick,
    onkeydown: this.onkeydown,
    ...this.attachment
  }));
  get props() {
    return y(this.#r);
  }
  set props(e) {
    me(this.#r, e);
  }
}
class ll {
  static create() {
    return new ll(ol.get());
  }
  root;
  #e = Ee(() => this.root.opts.name.current !== void 0);
  get shouldRender() {
    return y(this.#e);
  }
  set shouldRender(e) {
    me(this.#e, e);
  }
  constructor(e) {
    this.root = e;
  }
  #t = Ee(() => ({
    type: "checkbox",
    name: this.root.opts.name.current,
    value: this.root.opts.value.current,
    checked: this.root.opts.checked.current,
    disabled: this.root.opts.disabled.current,
    required: this.root.opts.required.current
  }));
  get props() {
    return y(this.#t);
  }
  set props(e) {
    me(this.#t, e);
  }
}
class cl {
  static create(e) {
    return new cl(e, ol.get());
  }
  opts;
  root;
  attachment;
  constructor(e, t) {
    this.opts = e, this.root = t, this.attachment = mo(e.ref);
  }
  #e = Ee(() => ({ checked: this.root.opts.checked.current }));
  get snippetProps() {
    return y(this.#e);
  }
  set snippetProps(e) {
    me(this.#e, e);
  }
  #t = Ee(() => ({
    ...this.root.sharedProps,
    id: this.opts.id.current,
    [gd.thumb]: "",
    ...this.attachment
  }));
  get props() {
    return y(this.#t);
  }
  set props(e) {
    me(this.#t, e);
  }
}
function vd(n, e) {
  or(e, !0);
  const t = ll.create();
  var r = Pt(), i = at(r);
  {
    var a = (c) => {
      hd(c, yo(() => t.props));
    };
    vt(i, (c) => {
      t.shouldRender && c(a);
    });
  }
  ce(n, r), ar();
}
lr(vd, {}, [], [], { mode: "open" });
var hg = Ze("<button><!></button>"), fg = Ze("<!> <!>", 1);
function rs(n, e) {
  const t = Ao();
  or(e, !0);
  let r = Me(e, "child", 7), i = Me(e, "children", 7), a = Me(e, "ref", 15, null), c = Me(e, "id", 23, () => hs(t)), d = Me(e, "disabled", 7, !1), h = Me(e, "required", 7, !1), g = Me(e, "checked", 15, !1), b = Me(e, "value", 7, "on"), m = Me(e, "name", 7, void 0), v = Me(e, "type", 7, "button"), T = Me(e, "onCheckedChange", 7, lo), A = _o(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "child",
    "children",
    "ref",
    "id",
    "disabled",
    "required",
    "checked",
    "value",
    "name",
    "type",
    "onCheckedChange"
  ]);
  const E = al.create({
    checked: Ft(() => g(), (F) => {
      g(F), T()?.(F);
    }),
    disabled: Ft(() => d() ?? !1),
    required: Ft(() => h()),
    value: Ft(() => b()),
    name: Ft(() => m()),
    id: Ft(() => c()),
    ref: Ft(() => a(), (F) => a(F))
  }), L = Ee(() => xo(A, E.props, { type: v() }));
  var U = {
    get child() {
      return r();
    },
    set child(F) {
      r(F), Re();
    },
    get children() {
      return i();
    },
    set children(F) {
      i(F), Re();
    },
    get ref() {
      return a();
    },
    set ref(F = null) {
      a(F), Re();
    },
    get id() {
      return c();
    },
    set id(F = hs(t)) {
      c(F), Re();
    },
    get disabled() {
      return d();
    },
    set disabled(F = !1) {
      d(F), Re();
    },
    get required() {
      return h();
    },
    set required(F = !1) {
      h(F), Re();
    },
    get checked() {
      return g();
    },
    set checked(F = !1) {
      g(F), Re();
    },
    get value() {
      return b();
    },
    set value(F = "on") {
      b(F), Re();
    },
    get name() {
      return m();
    },
    set name(F = void 0) {
      m(F), Re();
    },
    get type() {
      return v();
    },
    set type(F = "button") {
      v(F), Re();
    },
    get onCheckedChange() {
      return T();
    },
    set onCheckedChange(F = lo) {
      T(F), Re();
    }
  }, P = fg(), J = at(P);
  {
    var ie = (F) => {
      var O = Pt(), k = at(O);
      {
        let $ = Ee(() => ({ props: y(L), ...E.snippetProps }));
        Hr(k, r, () => y($));
      }
      ce(F, O);
    }, te = (F) => {
      var O = hg();
      wo(O, () => ({ ...y(L) }));
      var k = R(O);
      Hr(k, () => i() ?? Oi, () => E.snippetProps), N(O), ce(F, O);
    };
    vt(J, (F) => {
      r() ? F(ie) : F(te, -1);
    });
  }
  var ee = se(J, 2);
  return vd(ee, {}), ce(n, P), ar(U);
}
lr(
  rs,
  {
    child: {},
    children: {},
    ref: {},
    id: {},
    disabled: {},
    required: {},
    checked: {},
    value: {},
    name: {},
    type: {},
    onCheckedChange: {}
  },
  [],
  [],
  { mode: "open" }
);
var pg = Ze("<span><!></span>");
function ss(n, e) {
  const t = Ao();
  or(e, !0);
  let r = Me(e, "child", 7), i = Me(e, "children", 7), a = Me(e, "ref", 15, null), c = Me(e, "id", 23, () => hs(t)), d = _o(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "child",
    "children",
    "ref",
    "id"
  ]);
  const h = cl.create({
    id: Ft(() => c()),
    ref: Ft(() => a(), (E) => a(E))
  }), g = Ee(() => xo(d, h.props));
  var b = {
    get child() {
      return r();
    },
    set child(E) {
      r(E), Re();
    },
    get children() {
      return i();
    },
    set children(E) {
      i(E), Re();
    },
    get ref() {
      return a();
    },
    set ref(E = null) {
      a(E), Re();
    },
    get id() {
      return c();
    },
    set id(E = hs(t)) {
      c(E), Re();
    }
  }, m = Pt(), v = at(m);
  {
    var T = (E) => {
      var L = Pt(), U = at(L);
      {
        let P = Ee(() => ({ props: y(g), ...h.snippetProps }));
        Hr(U, r, () => y(P));
      }
      ce(E, L);
    }, A = (E) => {
      var L = pg();
      wo(L, () => ({ ...y(g) }));
      var U = R(L);
      Hr(U, () => i() ?? Oi, () => h.snippetProps), N(L), ce(E, L);
    };
    vt(v, (E) => {
      r() ? E(T) : E(A, -1);
    });
  }
  return ce(n, m), ar(b);
}
lr(ss, { child: {}, children: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var gg = { 203: (n, e) => {
  function t(k) {
    if (!Number.isSafeInteger(k)) throw new Error(`Wrong integer: ${k}`);
  }
  function r(...k) {
    const $ = (V, Y) => (W) => V(Y(W)), S = Array.from(k).reverse().reduce(((V, Y) => V ? $(V, Y.encode) : Y.encode), void 0), j = k.reduce(((V, Y) => V ? $(V, Y.decode) : Y.decode), void 0);
    return { encode: S, decode: j };
  }
  function i(k) {
    return { encode: ($) => {
      if (!Array.isArray($) || $.length && typeof $[0] != "number") throw new Error("alphabet.encode input should be an array of numbers");
      return $.map(((S) => {
        if (t(S), S < 0 || S >= k.length) throw new Error(`Digit index outside alphabet: ${S} (alphabet: ${k.length})`);
        return k[S];
      }));
    }, decode: ($) => {
      if (!Array.isArray($) || $.length && typeof $[0] != "string") throw new Error("alphabet.decode input should be array of strings");
      return $.map(((S) => {
        if (typeof S != "string") throw new Error(`alphabet.decode: not string element=${S}`);
        const j = k.indexOf(S);
        if (j === -1) throw new Error(`Unknown letter: "${S}". Allowed: ${k}`);
        return j;
      }));
    } };
  }
  function a(k = "") {
    if (typeof k != "string") throw new Error("join separator should be string");
    return { encode: ($) => {
      if (!Array.isArray($) || $.length && typeof $[0] != "string") throw new Error("join.encode input should be array of strings");
      for (let S of $) if (typeof S != "string") throw new Error(`join.encode: non-string input=${S}`);
      return $.join(k);
    }, decode: ($) => {
      if (typeof $ != "string") throw new Error("join.decode input should be string");
      return $.split(k);
    } };
  }
  function c(k, $ = "=") {
    if (t(k), typeof $ != "string") throw new Error("padding chr should be string");
    return { encode(S) {
      if (!Array.isArray(S) || S.length && typeof S[0] != "string") throw new Error("padding.encode input should be array of strings");
      for (let j of S) if (typeof j != "string") throw new Error(`padding.encode: non-string input=${j}`);
      for (; S.length * k % 8; ) S.push($);
      return S;
    }, decode(S) {
      if (!Array.isArray(S) || S.length && typeof S[0] != "string") throw new Error("padding.encode input should be array of strings");
      for (let V of S) if (typeof V != "string") throw new Error(`padding.decode: non-string input=${V}`);
      let j = S.length;
      if (j * k % 8) throw new Error("Invalid padding: string should have whole number of bytes");
      for (; j > 0 && S[j - 1] === $; j--) if (!((j - 1) * k % 8)) throw new Error("Invalid padding: string has too much padding");
      return S.slice(0, j);
    } };
  }
  function d(k) {
    if (typeof k != "function") throw new Error("normalize fn should be function");
    return { encode: ($) => $, decode: ($) => k($) };
  }
  function h(k, $, S) {
    if ($ < 2) throw new Error(`convertRadix: wrong from=${$}, base cannot be less than 2`);
    if (S < 2) throw new Error(`convertRadix: wrong to=${S}, base cannot be less than 2`);
    if (!Array.isArray(k)) throw new Error("convertRadix: data should be array");
    if (!k.length) return [];
    let j = 0;
    const V = [], Y = Array.from(k);
    for (Y.forEach(((W) => {
      if (t(W), W < 0 || W >= $) throw new Error(`Wrong integer: ${W}`);
    })); ; ) {
      let W = 0, re = !0;
      for (let ue = j; ue < Y.length; ue++) {
        const be = Y[ue], pe = $ * W + be;
        if (!Number.isSafeInteger(pe) || $ * W / $ !== W || pe - be != $ * W) throw new Error("convertRadix: carry overflow");
        if (W = pe % S, Y[ue] = Math.floor(pe / S), !Number.isSafeInteger(Y[ue]) || Y[ue] * S + W !== pe) throw new Error("convertRadix: carry overflow");
        re && (Y[ue] ? re = !1 : j = ue);
      }
      if (V.push(W), re) break;
    }
    for (let W = 0; W < k.length - 1 && k[W] === 0; W++) V.push(0);
    return V.reverse();
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), e.bytes = e.stringToBytes = e.str = e.bytesToString = e.hex = e.utf8 = e.bech32m = e.bech32 = e.base58check = e.base58xmr = e.base58xrp = e.base58flickr = e.base58 = e.base64url = e.base64 = e.base32crockford = e.base32hex = e.base32 = e.base16 = e.utils = e.assertNumber = void 0, e.assertNumber = t;
  const g = (k, $) => $ ? g($, k % $) : k, b = (k, $) => k + ($ - g(k, $));
  function m(k, $, S, j) {
    if (!Array.isArray(k)) throw new Error("convertRadix2: data should be array");
    if ($ <= 0 || $ > 32) throw new Error(`convertRadix2: wrong from=${$}`);
    if (S <= 0 || S > 32) throw new Error(`convertRadix2: wrong to=${S}`);
    if (b($, S) > 32) throw new Error(`convertRadix2: carry overflow from=${$} to=${S} carryBits=${b($, S)}`);
    let V = 0, Y = 0;
    const W = 2 ** S - 1, re = [];
    for (const ue of k) {
      if (t(ue), ue >= 2 ** $) throw new Error(`convertRadix2: invalid data word=${ue} from=${$}`);
      if (V = V << $ | ue, Y + $ > 32) throw new Error(`convertRadix2: carry overflow pos=${Y} from=${$}`);
      for (Y += $; Y >= S; Y -= S) re.push((V >> Y - S & W) >>> 0);
      V &= 2 ** Y - 1;
    }
    if (V = V << S - Y & W, !j && Y >= $) throw new Error("Excess padding");
    if (!j && V) throw new Error(`Non-zero padding: ${V}`);
    return j && Y > 0 && re.push(V >>> 0), re;
  }
  function v(k) {
    return t(k), { encode: ($) => {
      if (!($ instanceof Uint8Array)) throw new Error("radix.encode input should be Uint8Array");
      return h(Array.from($), 256, k);
    }, decode: ($) => {
      if (!Array.isArray($) || $.length && typeof $[0] != "number") throw new Error("radix.decode input should be array of strings");
      return Uint8Array.from(h($, k, 256));
    } };
  }
  function T(k, $ = !1) {
    if (t(k), k <= 0 || k > 32) throw new Error("radix2: bits should be in (0..32]");
    if (b(8, k) > 32 || b(k, 8) > 32) throw new Error("radix2: carry overflow");
    return { encode: (S) => {
      if (!(S instanceof Uint8Array)) throw new Error("radix2.encode input should be Uint8Array");
      return m(Array.from(S), 8, k, !$);
    }, decode: (S) => {
      if (!Array.isArray(S) || S.length && typeof S[0] != "number") throw new Error("radix2.decode input should be array of strings");
      return Uint8Array.from(m(S, k, 8, $));
    } };
  }
  function A(k) {
    if (typeof k != "function") throw new Error("unsafeWrapper fn should be function");
    return function(...$) {
      try {
        return k.apply(null, $);
      } catch {
      }
    };
  }
  function E(k, $) {
    if (t(k), typeof $ != "function") throw new Error("checksum fn should be function");
    return { encode(S) {
      if (!(S instanceof Uint8Array)) throw new Error("checksum.encode: input should be Uint8Array");
      const j = $(S).slice(0, k), V = new Uint8Array(S.length + k);
      return V.set(S), V.set(j, S.length), V;
    }, decode(S) {
      if (!(S instanceof Uint8Array)) throw new Error("checksum.decode: input should be Uint8Array");
      const j = S.slice(0, -k), V = $(j).slice(0, k), Y = S.slice(-k);
      for (let W = 0; W < k; W++) if (V[W] !== Y[W]) throw new Error("Invalid checksum");
      return j;
    } };
  }
  e.utils = { alphabet: i, chain: r, checksum: E, radix: v, radix2: T, join: a, padding: c }, e.base16 = r(T(4), i("0123456789ABCDEF"), a("")), e.base32 = r(T(5), i("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), c(5), a("")), e.base32hex = r(T(5), i("0123456789ABCDEFGHIJKLMNOPQRSTUV"), c(5), a("")), e.base32crockford = r(T(5), i("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), a(""), d(((k) => k.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")))), e.base64 = r(T(6), i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), c(6), a("")), e.base64url = r(T(6), i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), c(6), a(""));
  const L = (k) => r(v(58), i(k), a(""));
  e.base58 = L("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"), e.base58flickr = L("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), e.base58xrp = L("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
  const U = [0, 2, 3, 5, 6, 7, 9, 10, 11];
  e.base58xmr = { encode(k) {
    let $ = "";
    for (let S = 0; S < k.length; S += 8) {
      const j = k.subarray(S, S + 8);
      $ += e.base58.encode(j).padStart(U[j.length], "1");
    }
    return $;
  }, decode(k) {
    let $ = [];
    for (let S = 0; S < k.length; S += 11) {
      const j = k.slice(S, S + 11), V = U.indexOf(j.length), Y = e.base58.decode(j);
      for (let W = 0; W < Y.length - V; W++) if (Y[W] !== 0) throw new Error("base58xmr: wrong padding");
      $ = $.concat(Array.from(Y.slice(Y.length - V)));
    }
    return Uint8Array.from($);
  } }, e.base58check = (k) => r(E(4, (($) => k(k($)))), e.base58);
  const P = r(i("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), a("")), J = [996825010, 642813549, 513874426, 1027748829, 705979059];
  function ie(k) {
    const $ = k >> 25;
    let S = (33554431 & k) << 5;
    for (let j = 0; j < J.length; j++) ($ >> j & 1) == 1 && (S ^= J[j]);
    return S;
  }
  function te(k, $, S = 1) {
    const j = k.length;
    let V = 1;
    for (let Y = 0; Y < j; Y++) {
      const W = k.charCodeAt(Y);
      if (W < 33 || W > 126) throw new Error(`Invalid prefix (${k})`);
      V = ie(V) ^ W >> 5;
    }
    V = ie(V);
    for (let Y = 0; Y < j; Y++) V = ie(V) ^ 31 & k.charCodeAt(Y);
    for (let Y of $) V = ie(V) ^ Y;
    for (let Y = 0; Y < 6; Y++) V = ie(V);
    return V ^= S, P.encode(m([V % 2 ** 30], 30, 5, !1));
  }
  function ee(k) {
    const $ = k === "bech32" ? 1 : 734539939, S = T(5), j = S.decode, V = S.encode, Y = A(j);
    function W(re, ue = 90) {
      if (typeof re != "string") throw new Error("bech32.decode input should be string, not " + typeof re);
      if (re.length < 8 || ue !== !1 && re.length > ue) throw new TypeError(`Wrong string length: ${re.length} (${re}). Expected (8..${ue})`);
      const be = re.toLowerCase();
      if (re !== be && re !== re.toUpperCase()) throw new Error("String must be lowercase or uppercase");
      const pe = (re = be).lastIndexOf("1");
      if (pe === 0 || pe === -1) throw new Error('Letter "1" must be present between prefix and data only');
      const Ie = re.slice(0, pe), $e = re.slice(pe + 1);
      if ($e.length < 6) throw new Error("Data must be at least 6 characters long");
      const Ce = P.decode($e).slice(0, -6), Ve = te(Ie, Ce, $);
      if (!$e.endsWith(Ve)) throw new Error(`Invalid checksum in ${re}: expected "${Ve}"`);
      return { prefix: Ie, words: Ce };
    }
    return { encode: function(re, ue, be = 90) {
      if (typeof re != "string") throw new Error("bech32.encode prefix should be string, not " + typeof re);
      if (!Array.isArray(ue) || ue.length && typeof ue[0] != "number") throw new Error("bech32.encode words should be array of numbers, not " + typeof ue);
      const pe = re.length + 7 + ue.length;
      if (be !== !1 && pe > be) throw new TypeError(`Length ${pe} exceeds limit ${be}`);
      return `${re = re.toLowerCase()}1${P.encode(ue)}${te(re, ue, $)}`;
    }, decode: W, decodeToBytes: function(re) {
      const { prefix: ue, words: be } = W(re, !1);
      return { prefix: ue, words: be, bytes: j(be) };
    }, decodeUnsafe: A(W), fromWords: j, fromWordsUnsafe: Y, toWords: V };
  }
  e.bech32 = ee("bech32"), e.bech32m = ee("bech32m"), e.utf8 = { encode: (k) => new TextDecoder().decode(k), decode: (k) => new TextEncoder().encode(k) }, e.hex = r(T(4), i("0123456789abcdef"), a(""), d(((k) => {
    if (typeof k != "string" || k.length % 2) throw new TypeError(`hex.decode: expected string, got ${typeof k} with length ${k.length}`);
    return k.toLowerCase();
  })));
  const F = { utf8: e.utf8, hex: e.hex, base16: e.base16, base32: e.base32, base64: e.base64, base64url: e.base64url, base58: e.base58, base58xmr: e.base58xmr }, O = `Invalid encoding type. Available types: ${Object.keys(F).join(", ")}`;
  e.bytesToString = (k, $) => {
    if (typeof k != "string" || !F.hasOwnProperty(k)) throw new TypeError(O);
    if (!($ instanceof Uint8Array)) throw new TypeError("bytesToString() expects Uint8Array");
    return F[k].encode($);
  }, e.str = e.bytesToString, e.stringToBytes = (k, $) => {
    if (!F.hasOwnProperty(k)) throw new TypeError(O);
    if (typeof $ != "string") throw new TypeError("stringToBytes() expects string");
    return F[k].decode($);
  }, e.bytes = e.stringToBytes;
}, 806: (n, e, t) => {
  t.d(e, { A: () => d });
  var r = t(601), i = t.n(r), a = t(314), c = t.n(a)()(i());
  c.push([n.id, `.zap-sender.with-comment {
  border-radius: 6px 6px 0 0;
}

/* Color Classes Generator */
[class*="zap-amount-"] .zap-sender {
  border-radius: 6px;
}

[class*="zap-amount-"] .zap-sender.with-comment {
  border-radius: 6px 6px 0 0;
}

[class*="zap-amount-"] .zap-details {
  padding-top: 8px;
  padding-bottom: 8px;
}

/* Amount-based Styles */
.zap-amount-100 .zap-sender {
  background-color: var(--zap-100);
}

.zap-amount-200 .zap-sender {
  background-color: var(--zap-200);
}

.zap-amount-500 .zap-sender {
  background-color: var(--zap-500);
}

.zap-amount-1k .zap-sender {
  background-color: var(--zap-1k);
}

.zap-amount-2k .zap-sender {
  background-color: var(--zap-2k);
}

.zap-amount-5k .zap-sender {
  background-color: var(--zap-5k);
}

.zap-amount-10k .zap-sender {
  background-color: var(--zap-10k);
}

/* Details Background Colors */
.zap-amount-100 .zap-details {
  background-color: var(--zap-100-light);
}

.zap-amount-200 .zap-details {
  background-color: var(--zap-200-light);
}

.zap-amount-500 .zap-details {
  background-color: var(--zap-500-light);
}

.zap-amount-1k .zap-details {
  background-color: var(--zap-1k-light);
}

.zap-amount-2k .zap-details {
  background-color: var(--zap-2k-light);
}

.zap-amount-5k .zap-details {
  background-color: var(--zap-5k-light);
}

.zap-amount-10k .zap-details {
  background-color: var(--zap-10k-light);
}

/* Dark Text Colors */
.zap-amount-100,
.zap-amount-2k,
.zap-amount-5k,
.zap-amount-10k {
  .zap-amount {
    color: var(--text-light);
  }

  .sender-name {
    color: var(--text-light-secondary);
  }

  .sender-pubkey {
    color: var(--text-light-tertiary);
  }

  .zap-comment {
    color: var(--text-light);
  }
}

/* Light Text Colors */
.zap-amount-200,
.zap-amount-500,
.zap-amount-1k {
  .zap-amount {
    color: var(--text-dark);
  }

  .sender-name {
    color: var(--text-dark-secondary);
  }

  .sender-pubkey {
    color: var(--text-dark-tertiary);
  }

  .zap-comment {
    color: var(--text-dark);
  }
}`, ""]);
  const d = c;
}, 540: (n, e, t) => {
  t.r(e), t.d(e, { default: () => g });
  var r = t(601), i = t.n(r), a = t(314), c = t.n(a), d = t(806), h = c()(i());
  h.i(d.A), h.push([n.id, `/* styles.css */

:host {
  --main-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  --main-text: Black;
  --pubkey-text: #888;
  --custom-title-text: #555;
  --stats-item-text: #333;
  --name-text: #444;
  --dialog-bg: #ffffff;
  --zap-stats-bg: #edf2f7;
  --hover-bg: #edf2f7;
  --border: #ddd;
  --skeleton: #fdfdfd;
  --skeleton2: #e2e5ec;
  --zap-stats-skeleton-bg: #bbc5cf;
  --new-mark: #22c55e;

  /* Zap Amount Colors */
  --zap-100: #1565c0;
  --zap-200: #00b8d4;
  --zap-500: #00bfa5;
  --zap-1k: #ffb300;
  --zap-2k: #e65100;
  --zap-5k: #c2185b;
  --zap-10k: #d00000;

  /* Light Variants */
  --zap-100-light: #1e88e5;
  --zap-200-light: #00e5ff;
  --zap-500-light: #1de9b6;
  --zap-1k-light: #ffca28;
  --zap-2k-light: #f57c00;
  --zap-5k-light: #e91e63;
  --zap-10k-light: #e62117;

  /* Text Colors */
  --text-light: #ffffff;
  --text-light-secondary: rgba(255, 255, 255, 0.9);
  --text-light-tertiary: rgba(255, 255, 255, 0.5);
  --text-dark: #000000;
  --text-dark-secondary: rgba(0, 0, 0, 0.7);
  --text-dark-tertiary: rgba(0, 0, 0, 0.5);
}

* {
  box-sizing: border-box;
}

button {
  color: var(--main-text);
  background: none;
  border: none;
  cursor: pointer;
}

.dialog {
  font-family: var(--main-font);
  color: var(--main-text);
  font-size: medium;
  font-weight: normal;
  max-height: 700px;
  height: 100dvh;
  width: 360px;
  margin: auto;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: var(--dialog-bg);
  display: flex;
  flex-direction: column;
}

.close-dialog-button {
  color: var(--custom-title-text);
  font-size: 16px;
  font-weight: 500;
  position: absolute;
  right: 0;
  width: 2.625rem;
  height: 2.625rem;
  border: none;
  border-radius: 50%;
  background: none;
  cursor: pointer;
  padding: 10px;
  text-align: center;
}

.close-dialog-button:hover {
  background-color: var(--hover-bg);
}

.dialog-title {
  height: 42px;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  & a {
    font-size: 0.9rem;
    font-weight: normal;
    color: var(--pubkey-text);
    text-decoration: none;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }

  & a:hover {
    text-decoration: underline;
  }
}

.dialog-title.custom-title a {
  color: var(--custom-title-text);
  font-weight: 600;
  font-size: 1rem;
}

.zap-stats {
  min-height: 80px;
  padding: 6px 14px;
  background: var(--zap-stats-bg);
  border-radius: 6px;
  display: grid;
  grid-template-columns: 90px 1fr 40px;
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  margin: 0 8px;

  .stats-item {
    height: 23px;
    color: var(--stats-item-text);
    font-size: 0.9rem;

    .number {
      font-size: 1.1rem;
      font-weight: 500;
    }

    .number.skeleton {
      width: 100%;
      background: linear-gradient(90deg,
          var(--skeleton) 0%,
          var(--zap-stats-skeleton-bg) 50%,
          var(--skeleton) 100%);
      background-size: 200% 100%;
    }
  }
}

.stats-item:nth-child(3n + 1) {
  justify-content: flex-start;
}

.stats-item:nth-child(3n + 2),
.stats-item:nth-child(3n + 3) {
  justify-content: flex-end;
}

.text-muted {
  margin-right: 16px;
  opacity: 0.4;
}

.dialog-zap-list {
  list-style-type: none;
  margin: 10px 0;
  padding: 0 6px;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-behavior: smooth;

  /* スクロールバーのスタイリング */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    transition: background 0.2s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  /* Firefox用のスクロールバースタイル */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

.zap-list-item {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);
  padding: 4px 0;
}

.zap-content {
  display: flex;
  flex-direction: column;
}

.reference-container {
  display: flex;
  flex-direction: column;
}

.zap-sender {
  gap: 12px;
  height: 46px;
  justify-content: space-between;
  padding: 6px;
}

.sender-icon {
  flex-shrink: 0;

  & img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
    object-position: center;
  }
}

.sender-icon.is-new::before {
  content: "";
  position: absolute;
  top: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  background-color: var(--new-mark);
  border: 1px solid #fff;
  border-radius: 50%;
  z-index: 1;
  animation: pulse 2500ms cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}

.sender-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
  min-width: 0;
}

.sender-name {
  font-size: 0.9375rem;
  font-weight: bold;
  color: var(--name-text);
}

.sender-pubkey {
  font-size: 0.625rem;
  color: var(--pubkey-text);
  margin-top: -1px;
}

.zap-amount {
  font-size: 0.8rem;
  white-space: nowrap;
  flex-shrink: 0;

  .number {
    font-size: 1.4rem;
    font-weight: 500;
    text-align: right;
  }
}

.zap-details {
  padding: 2px 8px;
  border-radius: 0 0 6px 6px;
  margin: 0;
}

.zap-comment {
  font-size: 0.9375rem;
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  max-width: 100%;
}

.no-zaps-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.no-zaps-message {
  text-align: center;
  color: var(--pubkey-text);
  font-size: 1.8rem;
  font-weight: 700;
}

.zap-reference {
  padding: 2px 0 2px 12px;
  margin: 0;
  font-size: 0.875rem;
  color: var(--pubkey-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reference-arrow {
  flex-shrink: 0;

  img {
    height: 16px;
    width: auto;
  }
}

.reference-text {
  font-size: 0.75rem;
  margin: 0 2px;
  flex-grow: 1;
}

.reference-link {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.5rem;
  width: 2.6rem;
  text-decoration: none;
  border-left: 1px solid var(--border);
  flex-shrink: 0;

  & img {
    height: 20px;
    width: auto;
  }
}

.zap-placeholder-name {
  height: 30px;
  width: 140px;
}

.zap-placeholder-name.skeleton {
  width: 120px;
  height: 19px;
  margin: 2px 0;
}

.skeleton {
  color: transparent;
  border-radius: 2px;
  background: linear-gradient(90deg,
      var(--skeleton) 0%,
      var(--skeleton2) 50%,
      var(--skeleton) 100%);
  background-size: 200% 100%;
  animation: loading-animation 3.5s infinite;
  opacity: 0.7;
}

@keyframes loading-animation {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* 共通のテキストオーバーフロー処理 */
.dialog-title,
.sender-name,
.sender-pubkey,
.reference-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 共通のフレックスボックス設定 */
.zap-sender,
.stats-item,
.zap-details,
.reference-link,
.zap-reference {
  display: flex;
  align-items: center;
}

/* 共通のアイコンサイズ */
.zap-placeholder-icon,
.sender-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  position: relative;
}

.load-more-trigger {
  height: 40px;
  margin: 10px 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--zap-stats-bg);
  border-top: 3px solid var(--pubkey-text);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}`, ""]);
  const g = h;
}, 314: (n) => {
  n.exports = function(e) {
    var t = [];
    return t.toString = function() {
      return this.map((function(r) {
        var i = "", a = r[5] !== void 0;
        return r[4] && (i += "@supports (".concat(r[4], ") {")), r[2] && (i += "@media ".concat(r[2], " {")), a && (i += "@layer".concat(r[5].length > 0 ? " ".concat(r[5]) : "", " {")), i += e(r), a && (i += "}"), r[2] && (i += "}"), r[4] && (i += "}"), i;
      })).join("");
    }, t.i = function(r, i, a, c, d) {
      typeof r == "string" && (r = [[null, r, void 0]]);
      var h = {};
      if (a) for (var g = 0; g < this.length; g++) {
        var b = this[g][0];
        b != null && (h[b] = !0);
      }
      for (var m = 0; m < r.length; m++) {
        var v = [].concat(r[m]);
        a && h[v[0]] || (d !== void 0 && (v[5] === void 0 || (v[1] = "@layer".concat(v[5].length > 0 ? " ".concat(v[5]) : "", " {").concat(v[1], "}")), v[5] = d), i && (v[2] && (v[1] = "@media ".concat(v[2], " {").concat(v[1], "}")), v[2] = i), c && (v[4] ? (v[1] = "@supports (".concat(v[4], ") {").concat(v[1], "}"), v[4] = c) : v[4] = "".concat(c)), t.push(v));
      }
    }, t;
  };
}, 601: (n) => {
  n.exports = function(e) {
    return e[1];
  };
}, 705: (n, e, t) => {
  const { bech32: r, hex: i, utf8: a } = t(203), c = { bech32: "bc", pubKeyHash: 0, scriptHash: 5, validWitnessVersions: [0] }, d = { bech32: "tb", pubKeyHash: 111, scriptHash: 196, validWitnessVersions: [0] }, h = { bech32: "tbs", pubKeyHash: 111, scriptHash: 196, validWitnessVersions: [0] }, g = { bech32: "bcrt", pubKeyHash: 111, scriptHash: 196, validWitnessVersions: [0] }, b = { bech32: "sb", pubKeyHash: 63, scriptHash: 123, validWitnessVersions: [0] }, m = ["option_data_loss_protect", "initial_routing_sync", "option_upfront_shutdown_script", "gossip_queries", "var_onion_optin", "gossip_queries_ex", "option_static_remotekey", "payment_secret", "basic_mpp", "option_support_large_channel"], v = { m: BigInt(1e3), u: BigInt(1e6), n: BigInt(1e9), p: BigInt(1e12) }, T = BigInt("2100000000000000000"), A = BigInt(1e11), E = { payment_hash: 1, payment_secret: 16, description: 13, payee: 19, description_hash: 23, expiry: 6, min_final_cltv_expiry: 24, fallback_address: 9, route_hint: 3, feature_bits: 5, metadata: 27 }, L = {};
  for (let te = 0, ee = Object.keys(E); te < ee.length; te++) {
    const F = ee[te], O = E[ee[te]].toString();
    L[O] = F;
  }
  const U = { 1: (te) => i.encode(r.fromWordsUnsafe(te)), 16: (te) => i.encode(r.fromWordsUnsafe(te)), 13: (te) => a.encode(r.fromWordsUnsafe(te)), 19: (te) => i.encode(r.fromWordsUnsafe(te)), 23: (te) => i.encode(r.fromWordsUnsafe(te)), 27: (te) => i.encode(r.fromWordsUnsafe(te)), 6: J, 24: J, 3: function(te) {
    const ee = [];
    let F, O, k, $, S, j = r.fromWordsUnsafe(te);
    for (; j.length > 0; ) F = i.encode(j.slice(0, 33)), O = i.encode(j.slice(33, 41)), k = parseInt(i.encode(j.slice(41, 45)), 16), $ = parseInt(i.encode(j.slice(45, 49)), 16), S = parseInt(i.encode(j.slice(49, 51)), 16), j = j.slice(51), ee.push({ pubkey: F, short_channel_id: O, fee_base_msat: k, fee_proportional_millionths: $, cltv_expiry_delta: S });
    return ee;
  }, 5: function(te) {
    const ee = te.slice().reverse().map(((k) => [!!(1 & k), !!(2 & k), !!(4 & k), !!(8 & k), !!(16 & k)])).reduce(((k, $) => k.concat($)), []);
    for (; ee.length < 2 * m.length; ) ee.push(!1);
    const F = {};
    m.forEach(((k, $) => {
      let S;
      S = ee[2 * $] ? "required" : ee[2 * $ + 1] ? "supported" : "unsupported", F[k] = S;
    }));
    const O = ee.slice(2 * m.length);
    return F.extra_bits = { start_bit: 2 * m.length, bits: O, has_required: O.reduce(((k, $, S) => S % 2 != 0 ? k || !1 : k || $), !1) }, F;
  } };
  function P(te) {
    return (ee) => ({ tagCode: parseInt(te), words: r.encode("unknown", ee, Number.MAX_SAFE_INTEGER) });
  }
  function J(te) {
    return te.reverse().reduce(((ee, F, O) => ee + F * Math.pow(32, O)), 0);
  }
  function ie(te, ee) {
    let F, O;
    if (te.slice(-1).match(/^[munp]$/)) F = te.slice(-1), O = te.slice(0, -1);
    else {
      if (te.slice(-1).match(/^[^munp0-9]$/)) throw new Error("Not a valid multiplier for the amount");
      O = te;
    }
    if (!O.match(/^\d+$/)) throw new Error("Not a valid human readable amount");
    const k = BigInt(O), $ = F ? k * A / v[F] : k * A;
    if (F === "p" && k % BigInt(10) !== BigInt(0) || $ > T) throw new Error("Amount is outside of valid range");
    return ee ? $.toString() : $;
  }
  n.exports = { decode: function(te, ee) {
    if (typeof te != "string") throw new Error("Lightning Payment Request must be string");
    if (te.slice(0, 2).toLowerCase() !== "ln") throw new Error("Not a proper lightning payment request");
    const F = [], O = r.decode(te, Number.MAX_SAFE_INTEGER);
    te = te.toLowerCase();
    const k = O.prefix;
    let $ = O.words, S = te.slice(k.length + 1), j = $.slice(-104);
    $ = $.slice(0, -104);
    let V = k.match(/^ln(\S+?)(\d*)([a-zA-Z]?)$/);
    if (V && !V[2] && (V = k.match(/^ln(\S+)$/)), !V) throw new Error("Not a proper lightning payment request");
    F.push({ name: "lightning_network", letters: "ln" });
    const Y = V[1];
    let W;
    if (ee) {
      if (ee.bech32 === void 0 || ee.pubKeyHash === void 0 || ee.scriptHash === void 0 || !Array.isArray(ee.validWitnessVersions)) throw new Error("Invalid network");
      W = ee;
    } else switch (Y) {
      case c.bech32:
        W = c;
        break;
      case d.bech32:
        W = d;
        break;
      case h.bech32:
        W = h;
        break;
      case g.bech32:
        W = g;
        break;
      case b.bech32:
        W = b;
    }
    if (!W || W.bech32 !== Y) throw new Error("Unknown coin bech32 prefix");
    F.push({ name: "coin_network", letters: Y, value: W });
    const re = V[2];
    let ue;
    re ? (ue = ie(re + V[3], !0), F.push({ name: "amount", letters: V[2] + V[3], value: ue })) : ue = null, F.push({ name: "separator", letters: "1" });
    const be = J($.slice(0, 7));
    let pe, Ie, $e, Ce;
    for ($ = $.slice(7), F.push({ name: "timestamp", letters: S.slice(0, 7), value: be }), S = S.slice(7); $.length > 0; ) {
      const ke = $[0].toString();
      pe = L[ke] || "unknown_tag", Ie = U[ke] || P(ke), $ = $.slice(1), $e = J($.slice(0, 2)), $ = $.slice(2), Ce = $.slice(0, $e), $ = $.slice($e), F.push({ name: pe, tag: S[0], letters: S.slice(0, 3 + $e), value: Ie(Ce) }), S = S.slice(3 + $e);
    }
    F.push({ name: "signature", letters: S.slice(0, 104), value: i.encode(r.fromWordsUnsafe(j)) }), S = S.slice(104), F.push({ name: "checksum", letters: S });
    let Ve = { paymentRequest: te, sections: F, get expiry() {
      let ke = F.find(((We) => We.name === "expiry"));
      if (ke) return Ge("timestamp") + ke.value;
    }, get route_hints() {
      return F.filter(((ke) => ke.name === "route_hint")).map(((ke) => ke.value));
    } };
    for (let ke in E) ke !== "route_hint" && Object.defineProperty(Ve, ke, { get: () => Ge(ke) });
    return Ve;
    function Ge(ke) {
      let We = F.find(((bt) => bt.name === ke));
      return We ? We.value : void 0;
    }
  }, hrpToMillisat: ie };
}, 0: (n, e, t) => {
  var r = t(540);
  r && r.__esModule && (r = r.default), n.exports = typeof r == "string" ? r : r.toString();
} }, Oc = {};
function wn(n) {
  var e = Oc[n];
  if (e !== void 0) return e.exports;
  var t = Oc[n] = { id: n, exports: {} };
  return gg[n](t, t.exports, wn), t.exports;
}
wn.n = (n) => {
  var e = n && n.__esModule ? () => n.default : () => n;
  return wn.d(e, { a: e }), e;
}, wn.d = (n, e) => {
  for (var t in e) wn.o(e, t) && !wn.o(n, t) && Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
}, wn.o = (n, e) => Object.prototype.hasOwnProperty.call(n, e), wn.r = (n) => {
  typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
};
var Sr = {};
wn.d(Sr, { vQ: () => Xe, ZM: () => Ti, yk: () => Ne, h0: () => _s, n_: () => Lh, Xz: () => c1, Uv: () => Li, fU: () => Di, Dw: () => $r });
var ja = {};
wn.r(ja), wn.d(ja, { OG: () => fl, My: () => Fs, Ph: () => Rn, lX: () => ul, Id: () => Es, fg: () => _d, qj: () => yn, aT: () => Ai, lq: () => ds, z: () => hl, Q5: () => Si });
var Fa = {};
wn.r(Fa), wn.d(Fa, { Relay: () => Du, SimplePool: () => Lv, finalizeEvent: () => cr, fj: () => ku, generateSecretKey: () => du, getEventHash: () => Ei, getFilterLimit: () => Ev, getPublicKey: () => $l, kinds: () => uu, matchFilter: () => Eu, matchFilters: () => $u, mergeFilters: () => _v, nip04: () => Mu, nip05: () => Uu, nip10: () => zu, nip11: () => Hu, nip13: () => qu, nip18: () => Zu, nip19: () => Ou, nip21: () => Gu, nip25: () => Wu, nip27: () => Ku, nip28: () => Qu, nip30: () => Yu, nip39: () => Ju, nip42: () => Cu, nip44: () => eh, nip47: () => ih, nip57: () => oh, nip59: () => ah, nip98: () => vh, parseReferences: () => zv, serializeEvent: () => cu, sortEvents: () => o0, utils: () => ou, validateEvent: () => Oo, verifiedSymbol: () => os, verifyEvent: () => Js });
var vg = wn(705);
function Nc(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`Wrong positive integer: ${n}`);
}
function bd(n, ...e) {
  if (!(n instanceof Uint8Array)) throw new Error("Expected Uint8Array");
  if (e.length > 0 && !e.includes(n.length)) throw new Error(`Expected Uint8Array of length ${e}, not of length=${n.length}`);
}
function bg(n) {
  if (typeof n != "function" || typeof n.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Nc(n.outputLen), Nc(n.blockLen);
}
function uo(n, e = !0) {
  if (n.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && n.finished) throw new Error("Hash#digest() has already been called");
}
function mg(n, e) {
  bd(n);
  const t = e.outputLen;
  if (n.length < t) throw new Error(`digestInto() expects output buffer of length at least ${t}`);
}
const ka = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0, md = (n) => n instanceof Uint8Array, Aa = (n) => new DataView(n.buffer, n.byteOffset, n.byteLength), br = (n, e) => n << 32 - e | n >>> e;
if (new Uint8Array(new Uint32Array([287454020]).buffer)[0] !== 68) throw new Error("Non little-endian hardware is not supported");
function dl(n) {
  if (typeof n == "string" && (n = (function(e) {
    if (typeof e != "string") throw new Error("utf8ToBytes expected string, got " + typeof e);
    return new Uint8Array(new TextEncoder().encode(e));
  })(n)), !md(n)) throw new Error("expected Uint8Array, got " + typeof n);
  return n;
}
class yd {
  clone() {
    return this._cloneInto();
  }
}
function yg(n) {
  const e = (r) => n().update(dl(r)).digest(), t = n();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n(), e;
}
function wd(n = 32) {
  if (ka && typeof ka.getRandomValues == "function") return ka.getRandomValues(new Uint8Array(n));
  throw new Error("crypto.getRandomValues must be defined");
}
class wg extends yd {
  constructor(e, t, r, i) {
    super(), this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Aa(this.buffer);
  }
  update(e) {
    uo(this);
    const { view: t, buffer: r, blockLen: i } = this, a = (e = dl(e)).length;
    for (let c = 0; c < a; ) {
      const d = Math.min(i - this.pos, a - c);
      if (d !== i) r.set(e.subarray(c, c + d), this.pos), this.pos += d, c += d, this.pos === i && (this.process(t, 0), this.pos = 0);
      else {
        const h = Aa(e);
        for (; i <= a - c; c += i) this.process(h, c);
      }
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    uo(this), mg(e, this), this.finished = !0;
    const { buffer: t, view: r, blockLen: i, isLE: a } = this;
    let { pos: c } = this;
    t[c++] = 128, this.buffer.subarray(c).fill(0), this.padOffset > i - c && (this.process(r, 0), c = 0);
    for (let m = c; m < i; m++) t[m] = 0;
    (function(m, v, T, A) {
      if (typeof m.setBigUint64 == "function") return m.setBigUint64(v, T, A);
      const E = BigInt(32), L = BigInt(4294967295), U = Number(T >> E & L), P = Number(T & L), J = A ? 4 : 0, ie = A ? 0 : 4;
      m.setUint32(v + J, U, A), m.setUint32(v + ie, P, A);
    })(r, i - 8, BigInt(8 * this.length), a), this.process(r, 0);
    const d = Aa(e), h = this.outputLen;
    if (h % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    const g = h / 4, b = this.get();
    if (g > b.length) throw new Error("_sha2: outputLen bigger than state");
    for (let m = 0; m < g; m++) d.setUint32(4 * m, b[m], a);
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const r = e.slice(0, t);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: t, buffer: r, length: i, finished: a, destroyed: c, pos: d } = this;
    return e.length = i, e.pos = d, e.finished = a, e.destroyed = c, i % t && e.buffer.set(r), e;
  }
}
const xg = (n, e, t) => n & e ^ n & t ^ e & t, _g = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), Jr = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), es = new Uint32Array(64);
class Eg extends wg {
  constructor() {
    super(64, 32, 8, !1), this.A = 0 | Jr[0], this.B = 0 | Jr[1], this.C = 0 | Jr[2], this.D = 0 | Jr[3], this.E = 0 | Jr[4], this.F = 0 | Jr[5], this.G = 0 | Jr[6], this.H = 0 | Jr[7];
  }
  get() {
    const { A: e, B: t, C: r, D: i, E: a, F: c, G: d, H: h } = this;
    return [e, t, r, i, a, c, d, h];
  }
  set(e, t, r, i, a, c, d, h) {
    this.A = 0 | e, this.B = 0 | t, this.C = 0 | r, this.D = 0 | i, this.E = 0 | a, this.F = 0 | c, this.G = 0 | d, this.H = 0 | h;
  }
  process(e, t) {
    for (let v = 0; v < 16; v++, t += 4) es[v] = e.getUint32(t, !1);
    for (let v = 16; v < 64; v++) {
      const T = es[v - 15], A = es[v - 2], E = br(T, 7) ^ br(T, 18) ^ T >>> 3, L = br(A, 17) ^ br(A, 19) ^ A >>> 10;
      es[v] = L + es[v - 7] + E + es[v - 16] | 0;
    }
    let { A: r, B: i, C: a, D: c, E: d, F: h, G: g, H: b } = this;
    for (let v = 0; v < 64; v++) {
      const T = b + (br(d, 6) ^ br(d, 11) ^ br(d, 25)) + ((m = d) & h ^ ~m & g) + _g[v] + es[v] | 0, A = (br(r, 2) ^ br(r, 13) ^ br(r, 22)) + xg(r, i, a) | 0;
      b = g, g = h, h = d, d = c + T | 0, c = a, a = i, i = r, r = T + A | 0;
    }
    var m;
    r = r + this.A | 0, i = i + this.B | 0, a = a + this.C | 0, c = c + this.D | 0, d = d + this.E | 0, h = h + this.F | 0, g = g + this.G | 0, b = b + this.H | 0, this.set(r, i, a, c, d, h, g, b);
  }
  roundClean() {
    es.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
const Za = yg((() => new Eg())), $g = (BigInt(0), BigInt(1)), kg = BigInt(2), So = (n) => n instanceof Uint8Array, Ag = Array.from({ length: 256 }, ((n, e) => e.toString(16).padStart(2, "0")));
function Fs(n) {
  if (!So(n)) throw new Error("Uint8Array expected");
  let e = "";
  for (let t = 0; t < n.length; t++) e += Ag[n[t]];
  return e;
}
function xd(n) {
  if (typeof n != "string") throw new Error("hex string expected, got " + typeof n);
  return BigInt(n === "" ? "0" : `0x${n}`);
}
function Ai(n) {
  if (typeof n != "string") throw new Error("hex string expected, got " + typeof n);
  const e = n.length;
  if (e % 2) throw new Error("padded hex string expected, got unpadded hex of length " + e);
  const t = new Uint8Array(e / 2);
  for (let r = 0; r < t.length; r++) {
    const i = 2 * r, a = n.slice(i, i + 2), c = Number.parseInt(a, 16);
    if (Number.isNaN(c) || c < 0) throw new Error("Invalid byte sequence");
    t[r] = c;
  }
  return t;
}
function Rn(n) {
  return xd(Fs(n));
}
function ul(n) {
  if (!So(n)) throw new Error("Uint8Array expected");
  return xd(Fs(Uint8Array.from(n).reverse()));
}
function ds(n, e) {
  return Ai(n.toString(16).padStart(2 * e, "0"));
}
function hl(n, e) {
  return ds(n, e).reverse();
}
function yn(n, e, t) {
  let r;
  if (typeof e == "string") try {
    r = Ai(e);
  } catch (a) {
    throw new Error(`${n} must be valid hex string, got "${e}". Cause: ${a}`);
  }
  else {
    if (!So(e)) throw new Error(`${n} must be hex string or Uint8Array`);
    r = Uint8Array.from(e);
  }
  const i = r.length;
  if (typeof t == "number" && i !== t) throw new Error(`${n} expected ${t} bytes, got ${i}`);
  return r;
}
function Es(...n) {
  const e = new Uint8Array(n.reduce(((r, i) => r + i.length), 0));
  let t = 0;
  return n.forEach(((r) => {
    if (!So(r)) throw new Error("Uint8Array expected");
    e.set(r, t), t += r.length;
  })), e;
}
const fl = (n) => (kg << BigInt(n - 1)) - $g, Sa = (n) => new Uint8Array(n), Mc = (n) => Uint8Array.from(n);
function _d(n, e, t) {
  if (typeof n != "number" || n < 2) throw new Error("hashLen must be a number");
  if (typeof e != "number" || e < 2) throw new Error("qByteLen must be a number");
  if (typeof t != "function") throw new Error("hmacFn must be a function");
  let r = Sa(n), i = Sa(n), a = 0;
  const c = () => {
    r.fill(1), i.fill(0), a = 0;
  }, d = (...b) => t(i, r, ...b), h = (b = Sa()) => {
    i = d(Mc([0]), b), r = d(), b.length !== 0 && (i = d(Mc([1]), b), r = d());
  }, g = () => {
    if (a++ >= 1e3) throw new Error("drbg: tried 1000 values");
    let b = 0;
    const m = [];
    for (; b < e; ) {
      r = d();
      const v = r.slice();
      m.push(v), b += r.length;
    }
    return Es(...m);
  };
  return (b, m) => {
    let v;
    for (c(), h(b); !(v = m(g())); ) h();
    return c(), v;
  };
}
const Sg = { bigint: (n) => typeof n == "bigint", function: (n) => typeof n == "function", boolean: (n) => typeof n == "boolean", string: (n) => typeof n == "string", stringOrUint8Array: (n) => typeof n == "string" || n instanceof Uint8Array, isSafeInteger: (n) => Number.isSafeInteger(n), array: (n) => Array.isArray(n), field: (n, e) => e.Fp.isValid(n), hash: (n) => typeof n == "function" && Number.isSafeInteger(n.outputLen) };
function Si(n, e, t = {}) {
  const r = (i, a, c) => {
    const d = Sg[a];
    if (typeof d != "function") throw new Error(`Invalid validator "${a}", expected function`);
    const h = n[i];
    if (!(c && h === void 0 || d(h, n))) throw new Error(`Invalid param ${String(i)}=${h} (${typeof h}), expected ${a}`);
  };
  for (const [i, a] of Object.entries(e)) r(i, a, !1);
  for (const [i, a] of Object.entries(t)) r(i, a, !0);
  return n;
}
const an = BigInt(0), Kt = BigInt(1), ys = BigInt(2), Cg = BigInt(3), Ca = BigInt(4), Rc = BigInt(5), Bc = BigInt(8);
BigInt(9), BigInt(16);
function fn(n, e) {
  const t = n % e;
  return t >= an ? t : e + t;
}
function Ig(n, e, t) {
  if (t <= an || e < an) throw new Error("Expected power/modulo > 0");
  if (t === Kt) return an;
  let r = Kt;
  for (; e > an; ) e & Kt && (r = r * n % t), n = n * n % t, e >>= Kt;
  return r;
}
function Wn(n, e, t) {
  let r = n;
  for (; e-- > an; ) r *= r, r %= t;
  return r;
}
function Va(n, e) {
  if (n === an || e <= an) throw new Error(`invert: expected positive integers, got n=${n} mod=${e}`);
  let t = fn(n, e), r = e, i = an, a = Kt;
  for (; t !== an; ) {
    const c = r / t, d = r % t, h = i - a * c;
    r = t, t = d, i = a, a = h;
  }
  if (r !== Kt) throw new Error("invert: does not exist");
  return fn(i, e);
}
function Tg(n) {
  if (n % Ca === Cg) {
    const e = (n + Kt) / Ca;
    return function(t, r) {
      const i = t.pow(r, e);
      if (!t.eql(t.sqr(i), r)) throw new Error("Cannot find square root");
      return i;
    };
  }
  if (n % Bc === Rc) {
    const e = (n - Rc) / Bc;
    return function(t, r) {
      const i = t.mul(r, ys), a = t.pow(i, e), c = t.mul(r, a), d = t.mul(t.mul(c, ys), a), h = t.mul(c, t.sub(d, t.ONE));
      if (!t.eql(t.sqr(h), r)) throw new Error("Cannot find square root");
      return h;
    };
  }
  return (function(e) {
    const t = (e - Kt) / ys;
    let r, i, a;
    for (r = e - Kt, i = 0; r % ys === an; r /= ys, i++) ;
    for (a = ys; a < e && Ig(a, t, e) !== e - Kt; a++) ;
    if (i === 1) {
      const d = (e + Kt) / Ca;
      return function(h, g) {
        const b = h.pow(g, d);
        if (!h.eql(h.sqr(b), g)) throw new Error("Cannot find square root");
        return b;
      };
    }
    const c = (r + Kt) / ys;
    return function(d, h) {
      if (d.pow(h, t) === d.neg(d.ONE)) throw new Error("Cannot find square root");
      let g = i, b = d.pow(d.mul(d.ONE, a), r), m = d.pow(h, c), v = d.pow(h, r);
      for (; !d.eql(v, d.ONE); ) {
        if (d.eql(v, d.ZERO)) return d.ZERO;
        let T = 1;
        for (let E = d.sqr(v); T < g && !d.eql(E, d.ONE); T++) E = d.sqr(E);
        const A = d.pow(b, Kt << BigInt(g - T - 1));
        b = d.sqr(A), m = d.mul(m, A), v = d.mul(v, b), g = T;
      }
      return m;
    };
  })(n);
}
const Lg = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];
function Ed(n, e) {
  const t = e !== void 0 ? e : n.toString(2).length;
  return { nBitLength: t, nByteLength: Math.ceil(t / 8) };
}
function $d(n) {
  if (typeof n != "bigint") throw new Error("field order must be bigint");
  const e = n.toString(2).length;
  return Math.ceil(e / 8);
}
function Uc(n) {
  const e = $d(n);
  return e + Math.ceil(e / 2);
}
class kd extends yd {
  constructor(e, t) {
    super(), this.finished = !1, this.destroyed = !1, bg(e);
    const r = dl(t);
    if (this.iHash = e.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, a = new Uint8Array(i);
    a.set(r.length > i ? e.create().update(r).digest() : r);
    for (let c = 0; c < a.length; c++) a[c] ^= 54;
    this.iHash.update(a), this.oHash = e.create();
    for (let c = 0; c < a.length; c++) a[c] ^= 106;
    this.oHash.update(a), a.fill(0);
  }
  update(e) {
    return uo(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    uo(this), bd(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: t, iHash: r, finished: i, destroyed: a, blockLen: c, outputLen: d } = this;
    return e.finished = i, e.destroyed = a, e.blockLen = c, e.outputLen = d, e.oHash = t._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Ad = (n, e, t) => new kd(n, e).update(t).digest();
Ad.create = (n, e) => new kd(n, e);
const Dg = BigInt(0), Ia = BigInt(1);
function Sd(n) {
  return Si(n.Fp, Lg.reduce(((e, t) => (e[t] = "function", e)), { ORDER: "bigint", MASK: "bigint", BYTES: "isSafeInteger", BITS: "isSafeInteger" })), Si(n, { n: "bigint", h: "bigint", Gx: "field", Gy: "field" }, { nBitLength: "isSafeInteger", nByteLength: "isSafeInteger" }), Object.freeze({ ...Ed(n.n, n.nBitLength), ...n, p: n.Fp.ORDER });
}
const { Ph: Og, aT: Ng } = ja, xs = { Err: class extends Error {
  constructor(n = "") {
    super(n);
  }
}, _parseInt(n) {
  const { Err: e } = xs;
  if (n.length < 2 || n[0] !== 2) throw new e("Invalid signature integer tag");
  const t = n[1], r = n.subarray(2, t + 2);
  if (!t || r.length !== t) throw new e("Invalid signature integer: wrong length");
  if (128 & r[0]) throw new e("Invalid signature integer: negative");
  if (r[0] === 0 && !(128 & r[1])) throw new e("Invalid signature integer: unnecessary leading zero");
  return { d: Og(r), l: n.subarray(t + 2) };
}, toSig(n) {
  const { Err: e } = xs, t = typeof n == "string" ? Ng(n) : n;
  if (!(t instanceof Uint8Array)) throw new Error("ui8a expected");
  let r = t.length;
  if (r < 2 || t[0] != 48) throw new e("Invalid signature tag");
  if (t[1] !== r - 2) throw new e("Invalid signature: incorrect length");
  const { d: i, l: a } = xs._parseInt(t.subarray(2)), { d: c, l: d } = xs._parseInt(a);
  if (d.length) throw new e("Invalid signature: left bytes after parsing");
  return { r: i, s: c };
}, hexFromSig(n) {
  const e = (g) => 8 & Number.parseInt(g[0], 16) ? "00" + g : g, t = (g) => {
    const b = g.toString(16);
    return 1 & b.length ? `0${b}` : b;
  }, r = e(t(n.s)), i = e(t(n.r)), a = r.length / 2, c = i.length / 2, d = t(a), h = t(c);
  return `30${t(c + a + 4)}02${h}${i}02${d}${r}`;
} }, Nr = BigInt(0), Kn = BigInt(1), Pc = (BigInt(2), BigInt(3));
BigInt(4);
function Mg(n) {
  const e = (function(A) {
    const E = Sd(A);
    Si(E, { a: "field", b: "field" }, { allowedPrivateKeyLengths: "array", wrapPrivateKey: "boolean", isTorsionFree: "function", clearCofactor: "function", allowInfinityPoint: "boolean", fromBytes: "function", toBytes: "function" });
    const { endo: L, Fp: U, a: P } = E;
    if (L) {
      if (!U.eql(P, U.ZERO)) throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
      if (typeof L != "object" || typeof L.beta != "bigint" || typeof L.splitScalar != "function") throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
    }
    return Object.freeze({ ...E });
  })(n), { Fp: t } = e, r = e.toBytes || ((A, E, L) => {
    const U = E.toAffine();
    return Es(Uint8Array.from([4]), t.toBytes(U.x), t.toBytes(U.y));
  }), i = e.fromBytes || ((A) => {
    const E = A.subarray(1);
    return { x: t.fromBytes(E.subarray(0, t.BYTES)), y: t.fromBytes(E.subarray(t.BYTES, 2 * t.BYTES)) };
  });
  function a(A) {
    const { a: E, b: L } = e, U = t.sqr(A), P = t.mul(U, A);
    return t.add(t.add(P, t.mul(A, E)), L);
  }
  if (!t.eql(t.sqr(e.Gy), a(e.Gx))) throw new Error("bad generator point: equation left != right");
  function c(A) {
    return typeof A == "bigint" && Nr < A && A < e.n;
  }
  function d(A) {
    if (!c(A)) throw new Error("Expected valid bigint: 0 < bigint < curve.n");
  }
  function h(A) {
    const { allowedPrivateKeyLengths: E, nByteLength: L, wrapPrivateKey: U, n: P } = e;
    if (E && typeof A != "bigint") {
      if (A instanceof Uint8Array && (A = Fs(A)), typeof A != "string" || !E.includes(A.length)) throw new Error("Invalid key");
      A = A.padStart(2 * L, "0");
    }
    let J;
    try {
      J = typeof A == "bigint" ? A : Rn(yn("private key", A, L));
    } catch {
      throw new Error(`private key must be ${L} bytes, hex or bigint, not ${typeof A}`);
    }
    return U && (J = fn(J, P)), d(J), J;
  }
  const g = /* @__PURE__ */ new Map();
  function b(A) {
    if (!(A instanceof m)) throw new Error("ProjectivePoint expected");
  }
  class m {
    constructor(E, L, U) {
      if (this.px = E, this.py = L, this.pz = U, E == null || !t.isValid(E)) throw new Error("x required");
      if (L == null || !t.isValid(L)) throw new Error("y required");
      if (U == null || !t.isValid(U)) throw new Error("z required");
    }
    static fromAffine(E) {
      const { x: L, y: U } = E || {};
      if (!E || !t.isValid(L) || !t.isValid(U)) throw new Error("invalid affine point");
      if (E instanceof m) throw new Error("projective point not allowed");
      const P = (J) => t.eql(J, t.ZERO);
      return P(L) && P(U) ? m.ZERO : new m(L, U, t.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static normalizeZ(E) {
      const L = t.invertBatch(E.map(((U) => U.pz)));
      return E.map(((U, P) => U.toAffine(L[P]))).map(m.fromAffine);
    }
    static fromHex(E) {
      const L = m.fromAffine(i(yn("pointHex", E)));
      return L.assertValidity(), L;
    }
    static fromPrivateKey(E) {
      return m.BASE.multiply(h(E));
    }
    _setWindowSize(E) {
      this._WINDOW_SIZE = E, g.delete(this);
    }
    assertValidity() {
      if (this.is0()) {
        if (e.allowInfinityPoint && !t.is0(this.py)) return;
        throw new Error("bad point: ZERO");
      }
      const { x: E, y: L } = this.toAffine();
      if (!t.isValid(E) || !t.isValid(L)) throw new Error("bad point: x or y not FE");
      const U = t.sqr(L), P = a(E);
      if (!t.eql(U, P)) throw new Error("bad point: equation left != right");
      if (!this.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
    }
    hasEvenY() {
      const { y: E } = this.toAffine();
      if (t.isOdd) return !t.isOdd(E);
      throw new Error("Field doesn't support isOdd");
    }
    equals(E) {
      b(E);
      const { px: L, py: U, pz: P } = this, { px: J, py: ie, pz: te } = E, ee = t.eql(t.mul(L, te), t.mul(J, P)), F = t.eql(t.mul(U, te), t.mul(ie, P));
      return ee && F;
    }
    negate() {
      return new m(this.px, t.neg(this.py), this.pz);
    }
    double() {
      const { a: E, b: L } = e, U = t.mul(L, Pc), { px: P, py: J, pz: ie } = this;
      let te = t.ZERO, ee = t.ZERO, F = t.ZERO, O = t.mul(P, P), k = t.mul(J, J), $ = t.mul(ie, ie), S = t.mul(P, J);
      return S = t.add(S, S), F = t.mul(P, ie), F = t.add(F, F), te = t.mul(E, F), ee = t.mul(U, $), ee = t.add(te, ee), te = t.sub(k, ee), ee = t.add(k, ee), ee = t.mul(te, ee), te = t.mul(S, te), F = t.mul(U, F), $ = t.mul(E, $), S = t.sub(O, $), S = t.mul(E, S), S = t.add(S, F), F = t.add(O, O), O = t.add(F, O), O = t.add(O, $), O = t.mul(O, S), ee = t.add(ee, O), $ = t.mul(J, ie), $ = t.add($, $), O = t.mul($, S), te = t.sub(te, O), F = t.mul($, k), F = t.add(F, F), F = t.add(F, F), new m(te, ee, F);
    }
    add(E) {
      b(E);
      const { px: L, py: U, pz: P } = this, { px: J, py: ie, pz: te } = E;
      let ee = t.ZERO, F = t.ZERO, O = t.ZERO;
      const k = e.a, $ = t.mul(e.b, Pc);
      let S = t.mul(L, J), j = t.mul(U, ie), V = t.mul(P, te), Y = t.add(L, U), W = t.add(J, ie);
      Y = t.mul(Y, W), W = t.add(S, j), Y = t.sub(Y, W), W = t.add(L, P);
      let re = t.add(J, te);
      return W = t.mul(W, re), re = t.add(S, V), W = t.sub(W, re), re = t.add(U, P), ee = t.add(ie, te), re = t.mul(re, ee), ee = t.add(j, V), re = t.sub(re, ee), O = t.mul(k, W), ee = t.mul($, V), O = t.add(ee, O), ee = t.sub(j, O), O = t.add(j, O), F = t.mul(ee, O), j = t.add(S, S), j = t.add(j, S), V = t.mul(k, V), W = t.mul($, W), j = t.add(j, V), V = t.sub(S, V), V = t.mul(k, V), W = t.add(W, V), S = t.mul(j, W), F = t.add(F, S), S = t.mul(re, W), ee = t.mul(Y, ee), ee = t.sub(ee, S), S = t.mul(Y, j), O = t.mul(re, O), O = t.add(O, S), new m(ee, F, O);
    }
    subtract(E) {
      return this.add(E.negate());
    }
    is0() {
      return this.equals(m.ZERO);
    }
    wNAF(E) {
      return T.wNAFCached(this, g, E, ((L) => {
        const U = t.invertBatch(L.map(((P) => P.pz)));
        return L.map(((P, J) => P.toAffine(U[J]))).map(m.fromAffine);
      }));
    }
    multiplyUnsafe(E) {
      const L = m.ZERO;
      if (E === Nr) return L;
      if (d(E), E === Kn) return this;
      const { endo: U } = e;
      if (!U) return T.unsafeLadder(this, E);
      let { k1neg: P, k1: J, k2neg: ie, k2: te } = U.splitScalar(E), ee = L, F = L, O = this;
      for (; J > Nr || te > Nr; ) J & Kn && (ee = ee.add(O)), te & Kn && (F = F.add(O)), O = O.double(), J >>= Kn, te >>= Kn;
      return P && (ee = ee.negate()), ie && (F = F.negate()), F = new m(t.mul(F.px, U.beta), F.py, F.pz), ee.add(F);
    }
    multiply(E) {
      d(E);
      let L, U, P = E;
      const { endo: J } = e;
      if (J) {
        const { k1neg: ie, k1: te, k2neg: ee, k2: F } = J.splitScalar(P);
        let { p: O, f: k } = this.wNAF(te), { p: $, f: S } = this.wNAF(F);
        O = T.constTimeNegate(ie, O), $ = T.constTimeNegate(ee, $), $ = new m(t.mul($.px, J.beta), $.py, $.pz), L = O.add($), U = k.add(S);
      } else {
        const { p: ie, f: te } = this.wNAF(P);
        L = ie, U = te;
      }
      return m.normalizeZ([L, U])[0];
    }
    multiplyAndAddUnsafe(E, L, U) {
      const P = m.BASE, J = (te, ee) => ee !== Nr && ee !== Kn && te.equals(P) ? te.multiply(ee) : te.multiplyUnsafe(ee), ie = J(this, L).add(J(E, U));
      return ie.is0() ? void 0 : ie;
    }
    toAffine(E) {
      const { px: L, py: U, pz: P } = this, J = this.is0();
      E == null && (E = J ? t.ONE : t.inv(P));
      const ie = t.mul(L, E), te = t.mul(U, E), ee = t.mul(P, E);
      if (J) return { x: t.ZERO, y: t.ZERO };
      if (!t.eql(ee, t.ONE)) throw new Error("invZ was invalid");
      return { x: ie, y: te };
    }
    isTorsionFree() {
      const { h: E, isTorsionFree: L } = e;
      if (E === Kn) return !0;
      if (L) return L(m, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: E, clearCofactor: L } = e;
      return E === Kn ? this : L ? L(m, this) : this.multiplyUnsafe(e.h);
    }
    toRawBytes(E = !0) {
      return this.assertValidity(), r(m, this, E);
    }
    toHex(E = !0) {
      return Fs(this.toRawBytes(E));
    }
  }
  m.BASE = new m(e.Gx, e.Gy, t.ONE), m.ZERO = new m(t.ZERO, t.ONE, t.ZERO);
  const v = e.nBitLength, T = /* @__PURE__ */ (function(A, E) {
    const L = (P, J) => {
      const ie = J.negate();
      return P ? ie : J;
    }, U = (P) => ({ windows: Math.ceil(E / P) + 1, windowSize: 2 ** (P - 1) });
    return { constTimeNegate: L, unsafeLadder(P, J) {
      let ie = A.ZERO, te = P;
      for (; J > Dg; ) J & Ia && (ie = ie.add(te)), te = te.double(), J >>= Ia;
      return ie;
    }, precomputeWindow(P, J) {
      const { windows: ie, windowSize: te } = U(J), ee = [];
      let F = P, O = F;
      for (let k = 0; k < ie; k++) {
        O = F, ee.push(O);
        for (let $ = 1; $ < te; $++) O = O.add(F), ee.push(O);
        F = O.double();
      }
      return ee;
    }, wNAF(P, J, ie) {
      const { windows: te, windowSize: ee } = U(P);
      let F = A.ZERO, O = A.BASE;
      const k = BigInt(2 ** P - 1), $ = 2 ** P, S = BigInt(P);
      for (let j = 0; j < te; j++) {
        const V = j * ee;
        let Y = Number(ie & k);
        ie >>= S, Y > ee && (Y -= $, ie += Ia);
        const W = V, re = V + Math.abs(Y) - 1, ue = j % 2 != 0, be = Y < 0;
        Y === 0 ? O = O.add(L(ue, J[W])) : F = F.add(L(be, J[re]));
      }
      return { p: F, f: O };
    }, wNAFCached(P, J, ie, te) {
      const ee = P._WINDOW_SIZE || 1;
      let F = J.get(P);
      return F || (F = this.precomputeWindow(P, ee), ee !== 1 && J.set(P, te(F))), this.wNAF(ee, F, ie);
    } };
  })(m, e.endo ? Math.ceil(v / 2) : v);
  return { CURVE: e, ProjectivePoint: m, normPrivateKeyToScalar: h, weierstrassEquation: a, isWithinCurveOrder: c };
}
function Rg(n) {
  const e = (function(k) {
    const $ = Sd(k);
    return Si($, { hash: "hash", hmac: "function", randomBytes: "function" }, { bits2int: "function", bits2int_modN: "function", lowS: "boolean" }), Object.freeze({ lowS: !0, ...$ });
  })(n), { Fp: t, n: r } = e, i = t.BYTES + 1, a = 2 * t.BYTES + 1;
  function c(k) {
    return fn(k, r);
  }
  function d(k) {
    return Va(k, r);
  }
  const { ProjectivePoint: h, normPrivateKeyToScalar: g, weierstrassEquation: b, isWithinCurveOrder: m } = Mg({ ...e, toBytes(k, $, S) {
    const j = $.toAffine(), V = t.toBytes(j.x), Y = Es;
    return S ? Y(Uint8Array.from([$.hasEvenY() ? 2 : 3]), V) : Y(Uint8Array.from([4]), V, t.toBytes(j.y));
  }, fromBytes(k) {
    const $ = k.length, S = k[0], j = k.subarray(1);
    if ($ !== i || S !== 2 && S !== 3) {
      if ($ === a && S === 4)
        return { x: t.fromBytes(j.subarray(0, t.BYTES)), y: t.fromBytes(j.subarray(t.BYTES, 2 * t.BYTES)) };
      throw new Error(`Point of length ${$} was invalid. Expected ${i} compressed bytes or ${a} uncompressed bytes`);
    }
    {
      const Y = Rn(j);
      if (!(Nr < (V = Y) && V < t.ORDER)) throw new Error("Point is not on curve");
      const W = b(Y);
      let re = t.sqrt(W);
      return !(1 & ~S) != ((re & Kn) === Kn) && (re = t.neg(re)), { x: Y, y: re };
    }
    var V;
  } }), v = (k) => Fs(ds(k, e.nByteLength));
  function T(k) {
    return k > r >> Kn;
  }
  const A = (k, $, S) => Rn(k.slice($, S));
  class E {
    constructor($, S, j) {
      this.r = $, this.s = S, this.recovery = j, this.assertValidity();
    }
    static fromCompact($) {
      const S = e.nByteLength;
      return $ = yn("compactSignature", $, 2 * S), new E(A($, 0, S), A($, S, 2 * S));
    }
    static fromDER($) {
      const { r: S, s: j } = xs.toSig(yn("DER", $));
      return new E(S, j);
    }
    assertValidity() {
      if (!m(this.r)) throw new Error("r must be 0 < r < CURVE.n");
      if (!m(this.s)) throw new Error("s must be 0 < s < CURVE.n");
    }
    addRecoveryBit($) {
      return new E(this.r, this.s, $);
    }
    recoverPublicKey($) {
      const { r: S, s: j, recovery: V } = this, Y = J(yn("msgHash", $));
      if (V == null || ![0, 1, 2, 3].includes(V)) throw new Error("recovery id invalid");
      const W = V === 2 || V === 3 ? S + e.n : S;
      if (W >= t.ORDER) throw new Error("recovery id 2 or 3 invalid");
      const re = 1 & V ? "03" : "02", ue = h.fromHex(re + v(W)), be = d(W), pe = c(-Y * be), Ie = c(j * be), $e = h.BASE.multiplyAndAddUnsafe(ue, pe, Ie);
      if (!$e) throw new Error("point at infinify");
      return $e.assertValidity(), $e;
    }
    hasHighS() {
      return T(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new E(this.r, c(-this.s), this.recovery) : this;
    }
    toDERRawBytes() {
      return Ai(this.toDERHex());
    }
    toDERHex() {
      return xs.hexFromSig({ r: this.r, s: this.s });
    }
    toCompactRawBytes() {
      return Ai(this.toCompactHex());
    }
    toCompactHex() {
      return v(this.r) + v(this.s);
    }
  }
  const L = { isValidPrivateKey(k) {
    try {
      return g(k), !0;
    } catch {
      return !1;
    }
  }, normPrivateKeyToScalar: g, randomPrivateKey: () => {
    const k = Uc(e.n);
    return (function($, S, j = !1) {
      const V = $.length, Y = $d(S), W = Uc(S);
      if (V < 16 || V < W || V > 1024) throw new Error(`expected ${W}-1024 bytes of input, got ${V}`);
      const re = fn(j ? Rn($) : ul($), S - Kt) + Kt;
      return j ? hl(re, Y) : ds(re, Y);
    })(e.randomBytes(k), e.n);
  }, precompute: (k = 8, $ = h.BASE) => ($._setWindowSize(k), $.multiply(BigInt(3)), $) };
  function U(k) {
    const $ = k instanceof Uint8Array, S = typeof k == "string", j = ($ || S) && k.length;
    return $ ? j === i || j === a : S ? j === 2 * i || j === 2 * a : k instanceof h;
  }
  const P = e.bits2int || function(k) {
    const $ = Rn(k), S = 8 * k.length - e.nBitLength;
    return S > 0 ? $ >> BigInt(S) : $;
  }, J = e.bits2int_modN || function(k) {
    return c(P(k));
  }, ie = fl(e.nBitLength);
  function te(k) {
    if (typeof k != "bigint") throw new Error("bigint expected");
    if (!(Nr <= k && k < ie)) throw new Error(`bigint expected < 2^${e.nBitLength}`);
    return ds(k, e.nByteLength);
  }
  function ee(k, $, S = F) {
    if (["recovered", "canonical"].some(((Ce) => Ce in S))) throw new Error("sign() legacy options not supported");
    const { hash: j, randomBytes: V } = e;
    let { lowS: Y, prehash: W, extraEntropy: re } = S;
    Y == null && (Y = !0), k = yn("msgHash", k), W && (k = yn("prehashed msgHash", j(k)));
    const ue = J(k), be = g($), pe = [te(be), te(ue)];
    if (re != null) {
      const Ce = re === !0 ? V(t.BYTES) : re;
      pe.push(yn("extraEntropy", Ce));
    }
    const Ie = Es(...pe), $e = ue;
    return { seed: Ie, k2sig: function(Ce) {
      const Ve = P(Ce);
      if (!m(Ve)) return;
      const Ge = d(Ve), ke = h.BASE.multiply(Ve).toAffine(), We = c(ke.x);
      if (We === Nr) return;
      const bt = c(Ge * c($e + We * be));
      if (bt === Nr) return;
      let ge = (ke.x === We ? 0 : 2) | Number(ke.y & Kn), it = bt;
      return Y && T(bt) && (it = (function(pn) {
        return T(pn) ? c(-pn) : pn;
      })(bt), ge ^= 1), new E(We, it, ge);
    } };
  }
  const F = { lowS: e.lowS, prehash: !1 }, O = { lowS: e.lowS, prehash: !1 };
  return h.BASE._setWindowSize(8), { CURVE: e, getPublicKey: function(k, $ = !0) {
    return h.fromPrivateKey(k).toRawBytes($);
  }, getSharedSecret: function(k, $, S = !0) {
    if (U(k)) throw new Error("first arg must be private key");
    if (!U($)) throw new Error("second arg must be public key");
    return h.fromHex($).multiply(g(k)).toRawBytes(S);
  }, sign: function(k, $, S = F) {
    const { seed: j, k2sig: V } = ee(k, $, S), Y = e;
    return _d(Y.hash.outputLen, Y.nByteLength, Y.hmac)(j, V);
  }, verify: function(k, $, S, j = O) {
    const V = k;
    if ($ = yn("msgHash", $), S = yn("publicKey", S), "strict" in j) throw new Error("options.strict was renamed to lowS");
    const { lowS: Y, prehash: W } = j;
    let re, ue;
    try {
      if (typeof V == "string" || V instanceof Uint8Array) try {
        re = E.fromDER(V);
      } catch (ke) {
        if (!(ke instanceof xs.Err)) throw ke;
        re = E.fromCompact(V);
      }
      else {
        if (typeof V != "object" || typeof V.r != "bigint" || typeof V.s != "bigint") throw new Error("PARSE");
        {
          const { r: ke, s: We } = V;
          re = new E(ke, We);
        }
      }
      ue = h.fromHex(S);
    } catch (ke) {
      if (ke.message === "PARSE") throw new Error("signature must be Signature instance, Uint8Array or hex string");
      return !1;
    }
    if (Y && re.hasHighS()) return !1;
    W && ($ = e.hash($));
    const { r: be, s: pe } = re, Ie = J($), $e = d(pe), Ce = c(Ie * $e), Ve = c(be * $e), Ge = h.BASE.multiplyAndAddUnsafe(ue, Ce, Ve)?.toAffine();
    return !!Ge && c(Ge.x) === be;
  }, ProjectivePoint: h, Signature: E, utils: L };
}
function Bg(n) {
  return { hash: n, hmac: (e, ...t) => Ad(n, e, (function(...r) {
    const i = new Uint8Array(r.reduce(((c, d) => c + d.length), 0));
    let a = 0;
    return r.forEach(((c) => {
      if (!md(c)) throw new Error("Uint8Array expected");
      i.set(c, a), a += c.length;
    })), i;
  })(...t)), randomBytes: wd };
}
const Co = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"), ho = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), Cd = BigInt(1), fo = BigInt(2), zc = (n, e) => (n + e / fo) / e;
function Id(n) {
  const e = Co, t = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), c = BigInt(23), d = BigInt(44), h = BigInt(88), g = n * n * n % e, b = g * g * n % e, m = Wn(b, t, e) * b % e, v = Wn(m, t, e) * b % e, T = Wn(v, fo, e) * g % e, A = Wn(T, i, e) * T % e, E = Wn(A, a, e) * A % e, L = Wn(E, d, e) * E % e, U = Wn(L, h, e) * L % e, P = Wn(U, d, e) * E % e, J = Wn(P, t, e) * b % e, ie = Wn(J, c, e) * A % e, te = Wn(ie, r, e) * g % e, ee = Wn(te, fo, e);
  if (!Ga.eql(Ga.sqr(ee), n)) throw new Error("Cannot find square root");
  return ee;
}
const Ga = (function(n, e, t = !1, r = {}) {
  if (n <= an) throw new Error(`Expected Field ORDER > 0, got ${n}`);
  const { nBitLength: i, nByteLength: a } = Ed(n, e);
  if (a > 2048) throw new Error("Field lengths over 2048 bytes are not supported");
  const c = Tg(n), d = Object.freeze({ ORDER: n, BITS: i, BYTES: a, MASK: fl(i), ZERO: an, ONE: Kt, create: (h) => fn(h, n), isValid: (h) => {
    if (typeof h != "bigint") throw new Error("Invalid field element: expected bigint, got " + typeof h);
    return an <= h && h < n;
  }, is0: (h) => h === an, isOdd: (h) => (h & Kt) === Kt, neg: (h) => fn(-h, n), eql: (h, g) => h === g, sqr: (h) => fn(h * h, n), add: (h, g) => fn(h + g, n), sub: (h, g) => fn(h - g, n), mul: (h, g) => fn(h * g, n), pow: (h, g) => (function(b, m, v) {
    if (v < an) throw new Error("Expected power > 0");
    if (v === an) return b.ONE;
    if (v === Kt) return m;
    let T = b.ONE, A = m;
    for (; v > an; ) v & Kt && (T = b.mul(T, A)), A = b.sqr(A), v >>= Kt;
    return T;
  })(d, h, g), div: (h, g) => fn(h * Va(g, n), n), sqrN: (h) => h * h, addN: (h, g) => h + g, subN: (h, g) => h - g, mulN: (h, g) => h * g, inv: (h) => Va(h, n), sqrt: r.sqrt || ((h) => c(d, h)), invertBatch: (h) => (function(g, b) {
    const m = new Array(b.length), v = b.reduce(((A, E, L) => g.is0(E) ? A : (m[L] = A, g.mul(A, E))), g.ONE), T = g.inv(v);
    return b.reduceRight(((A, E, L) => g.is0(E) ? A : (m[L] = g.mul(A, m[L]), g.mul(A, E))), T), m;
  })(d, h), cmov: (h, g, b) => b ? g : h, toBytes: (h) => t ? hl(h, a) : ds(h, a), fromBytes: (h) => {
    if (h.length !== a) throw new Error(`Fp.fromBytes: expected ${a}, got ${h.length}`);
    return t ? ul(h) : Rn(h);
  } });
  return Object.freeze(d);
})(Co, void 0, void 0, { sqrt: Id }), Ks = (function(n, e) {
  const t = (r) => Rg({ ...n, ...Bg(r) });
  return Object.freeze({ ...t(e), create: t });
})({ a: BigInt(0), b: BigInt(7), Fp: Ga, n: ho, Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"), Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"), h: BigInt(1), lowS: !0, endo: { beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"), splitScalar: (n) => {
  const e = ho, t = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Cd * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), a = t, c = BigInt("0x100000000000000000000000000000000"), d = zc(a * n, e), h = zc(-r * n, e);
  let g = fn(n - d * t - h * i, e), b = fn(-d * r - h * a, e);
  const m = g > c, v = b > c;
  if (m && (g = e - g), v && (b = e - b), g > c || b > c) throw new Error("splitScalar: Endomorphism failed, k=" + n);
  return { k1neg: m, k1: g, k2neg: v, k2: b };
} } }, Za), Io = BigInt(0), Td = (n) => typeof n == "bigint" && Io < n && n < Co, Hc = {};
function po(n, ...e) {
  let t = Hc[n];
  if (t === void 0) {
    const r = Za(Uint8Array.from(n, ((i) => i.charCodeAt(0))));
    t = Es(r, r), Hc[n] = t;
  }
  return Za(Es(t, ...e));
}
const pl = (n) => n.toRawBytes(!0).slice(1), Wa = (n) => ds(n, 32), Ta = (n) => fn(n, Co), Ci = (n) => fn(n, ho), gl = Ks.ProjectivePoint;
function Ka(n) {
  let e = Ks.utils.normPrivateKeyToScalar(n), t = gl.fromPrivateKey(e);
  return { scalar: t.hasEvenY() ? e : Ci(-e), bytes: pl(t) };
}
function Ld(n) {
  if (!Td(n)) throw new Error("bad x: need 0 < x < p");
  const e = Ta(n * n);
  let t = Id(Ta(e * n + BigInt(7)));
  t % fo !== Io && (t = Ta(-t));
  const r = new gl(n, t, Cd);
  return r.assertValidity(), r;
}
function Dd(...n) {
  return Ci(Rn(po("BIP0340/challenge", ...n)));
}
function Ug(n) {
  return Ka(n).bytes;
}
function Pg(n, e, t = wd(32)) {
  const r = yn("message", n), { bytes: i, scalar: a } = Ka(e), c = yn("auxRand", t, 32), d = Wa(a ^ Rn(po("BIP0340/aux", c))), h = po("BIP0340/nonce", d, i, r), g = Ci(Rn(h));
  if (g === Io) throw new Error("sign failed: k is zero");
  const { bytes: b, scalar: m } = Ka(g), v = Dd(b, i, r), T = new Uint8Array(64);
  if (T.set(b, 0), T.set(Wa(Ci(m + v * a)), 32), !Od(T, r, i)) throw new Error("sign: Invalid signature produced");
  return T;
}
function Od(n, e, t) {
  const r = yn("signature", n, 64), i = yn("message", e), a = yn("publicKey", t, 32);
  try {
    const b = Ld(Rn(a)), m = Rn(r.subarray(0, 32));
    if (!Td(m)) return !1;
    const v = Rn(r.subarray(32, 64));
    if (!(typeof (g = v) == "bigint" && Io < g && g < ho)) return !1;
    const T = Dd(Wa(m), pl(b), i), A = (c = b, d = v, h = Ci(-T), gl.BASE.multiplyAndAddUnsafe(c, d, h));
    return !(!A || !A.hasEvenY() || A.toAffine().x !== m);
  } catch {
    return !1;
  }
  var c, d, h, g;
}
const _r = { getPublicKey: Ug, sign: Pg, verify: Od, utils: { randomPrivateKey: Ks.utils.randomPrivateKey, lift_x: Ld, pointToBytes: pl, numberToBytesBE: ds, bytesToNumberBE: Rn, taggedHash: po, mod: fn } }, La = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0, vl = (n) => n instanceof Uint8Array, Da = (n) => new DataView(n.buffer, n.byteOffset, n.byteLength), mr = (n, e) => n << 32 - e | n >>> e;
if (new Uint8Array(new Uint32Array([287454020]).buffer)[0] !== 68) throw new Error("Non little-endian hardware is not supported");
const zg = Array.from({ length: 256 }, ((n, e) => e.toString(16).padStart(2, "0")));
function tn(n) {
  if (!vl(n)) throw new Error("Uint8Array expected");
  let e = "";
  for (let t = 0; t < n.length; t++) e += zg[n[t]];
  return e;
}
function Zs(n) {
  if (typeof n != "string") throw new Error("hex string expected, got " + typeof n);
  const e = n.length;
  if (e % 2) throw new Error("padded hex string expected, got unpadded hex of length " + e);
  const t = new Uint8Array(e / 2);
  for (let r = 0; r < t.length; r++) {
    const i = 2 * r, a = n.slice(i, i + 2), c = Number.parseInt(a, 16);
    if (Number.isNaN(c) || c < 0) throw new Error("Invalid byte sequence");
    t[r] = c;
  }
  return t;
}
function Ii(n) {
  if (typeof n == "string" && (n = (function(e) {
    if (typeof e != "string") throw new Error("utf8ToBytes expected string, got " + typeof e);
    return new Uint8Array(new TextEncoder().encode(e));
  })(n)), !vl(n)) throw new Error("expected Uint8Array, got " + typeof n);
  return n;
}
function To(...n) {
  const e = new Uint8Array(n.reduce(((r, i) => r + i.length), 0));
  let t = 0;
  return n.forEach(((r) => {
    if (!vl(r)) throw new Error("Uint8Array expected");
    e.set(r, t), t += r.length;
  })), e;
}
class Nd {
  clone() {
    return this._cloneInto();
  }
}
function Md(n) {
  const e = (r) => n().update(Ii(r)).digest(), t = n();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n(), e;
}
function Rd(n = 32) {
  if (La && typeof La.getRandomValues == "function") return La.getRandomValues(new Uint8Array(n));
  throw new Error("crypto.getRandomValues must be defined");
}
function Oa(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`Wrong positive integer: ${n}`);
}
function qc(n, ...e) {
  if (!(n instanceof Uint8Array)) throw new Error("Expected Uint8Array");
  if (e.length > 0 && !e.includes(n.length)) throw new Error(`Expected Uint8Array of length ${e}, not of length=${n.length}`);
}
const Hg = { number: Oa, bool: function(n) {
  if (typeof n != "boolean") throw new Error(`Expected boolean, not ${n}`);
}, bytes: qc, hash: function(n) {
  if (typeof n != "function" || typeof n.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Oa(n.outputLen), Oa(n.blockLen);
}, exists: function(n, e = !0) {
  if (n.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && n.finished) throw new Error("Hash#digest() has already been called");
}, output: function(n, e) {
  qc(n);
  const t = e.outputLen;
  if (n.length < t) throw new Error(`digestInto() expects output buffer of length at least ${t}`);
} }, kr = Hg;
class qg extends Nd {
  constructor(e, t, r, i) {
    super(), this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Da(this.buffer);
  }
  update(e) {
    kr.exists(this);
    const { view: t, buffer: r, blockLen: i } = this, a = (e = Ii(e)).length;
    for (let c = 0; c < a; ) {
      const d = Math.min(i - this.pos, a - c);
      if (d !== i) r.set(e.subarray(c, c + d), this.pos), this.pos += d, c += d, this.pos === i && (this.process(t, 0), this.pos = 0);
      else {
        const h = Da(e);
        for (; i <= a - c; c += i) this.process(h, c);
      }
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    kr.exists(this), kr.output(e, this), this.finished = !0;
    const { buffer: t, view: r, blockLen: i, isLE: a } = this;
    let { pos: c } = this;
    t[c++] = 128, this.buffer.subarray(c).fill(0), this.padOffset > i - c && (this.process(r, 0), c = 0);
    for (let m = c; m < i; m++) t[m] = 0;
    (function(m, v, T, A) {
      if (typeof m.setBigUint64 == "function") return m.setBigUint64(v, T, A);
      const E = BigInt(32), L = BigInt(4294967295), U = Number(T >> E & L), P = Number(T & L), J = A ? 4 : 0, ie = A ? 0 : 4;
      m.setUint32(v + J, U, A), m.setUint32(v + ie, P, A);
    })(r, i - 8, BigInt(8 * this.length), a), this.process(r, 0);
    const d = Da(e), h = this.outputLen;
    if (h % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    const g = h / 4, b = this.get();
    if (g > b.length) throw new Error("_sha2: outputLen bigger than state");
    for (let m = 0; m < g; m++) d.setUint32(4 * m, b[m], a);
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const r = e.slice(0, t);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: t, buffer: r, length: i, finished: a, destroyed: c, pos: d } = this;
    return e.length = i, e.pos = d, e.finished = a, e.destroyed = c, i % t && e.buffer.set(r), e;
  }
}
const jg = (n, e, t) => n & e ^ n & t ^ e & t, Fg = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), ts = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), ns = new Uint32Array(64);
class Bd extends qg {
  constructor() {
    super(64, 32, 8, !1), this.A = 0 | ts[0], this.B = 0 | ts[1], this.C = 0 | ts[2], this.D = 0 | ts[3], this.E = 0 | ts[4], this.F = 0 | ts[5], this.G = 0 | ts[6], this.H = 0 | ts[7];
  }
  get() {
    const { A: e, B: t, C: r, D: i, E: a, F: c, G: d, H: h } = this;
    return [e, t, r, i, a, c, d, h];
  }
  set(e, t, r, i, a, c, d, h) {
    this.A = 0 | e, this.B = 0 | t, this.C = 0 | r, this.D = 0 | i, this.E = 0 | a, this.F = 0 | c, this.G = 0 | d, this.H = 0 | h;
  }
  process(e, t) {
    for (let v = 0; v < 16; v++, t += 4) ns[v] = e.getUint32(t, !1);
    for (let v = 16; v < 64; v++) {
      const T = ns[v - 15], A = ns[v - 2], E = mr(T, 7) ^ mr(T, 18) ^ T >>> 3, L = mr(A, 17) ^ mr(A, 19) ^ A >>> 10;
      ns[v] = L + ns[v - 7] + E + ns[v - 16] | 0;
    }
    let { A: r, B: i, C: a, D: c, E: d, F: h, G: g, H: b } = this;
    for (let v = 0; v < 64; v++) {
      const T = b + (mr(d, 6) ^ mr(d, 11) ^ mr(d, 25)) + ((m = d) & h ^ ~m & g) + Fg[v] + ns[v] | 0, A = (mr(r, 2) ^ mr(r, 13) ^ mr(r, 22)) + jg(r, i, a) | 0;
      b = g, g = h, h = d, d = c + T | 0, c = a, a = i, i = r, r = T + A | 0;
    }
    var m;
    r = r + this.A | 0, i = i + this.B | 0, a = a + this.C | 0, c = c + this.D | 0, d = d + this.E | 0, h = h + this.F | 0, g = g + this.G | 0, b = b + this.H | 0, this.set(r, i, a, c, d, h, g, b);
  }
  roundClean() {
    ns.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Zg extends Bd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const $s = Md((() => new Bd()));
Md((() => new Zg()));
function Qs(n) {
  if (!Number.isSafeInteger(n)) throw new Error(`Wrong integer: ${n}`);
}
function Ur(...n) {
  const e = (i, a) => (c) => i(a(c)), t = Array.from(n).reverse().reduce(((i, a) => i ? e(i, a.encode) : a.encode), void 0), r = n.reduce(((i, a) => i ? e(i, a.decode) : a.decode), void 0);
  return { encode: t, decode: r };
}
function Pr(n) {
  return { encode: (e) => {
    if (!Array.isArray(e) || e.length && typeof e[0] != "number") throw new Error("alphabet.encode input should be an array of numbers");
    return e.map(((t) => {
      if (Qs(t), t < 0 || t >= n.length) throw new Error(`Digit index outside alphabet: ${t} (alphabet: ${n.length})`);
      return n[t];
    }));
  }, decode: (e) => {
    if (!Array.isArray(e) || e.length && typeof e[0] != "string") throw new Error("alphabet.decode input should be array of strings");
    return e.map(((t) => {
      if (typeof t != "string") throw new Error(`alphabet.decode: not string element=${t}`);
      const r = n.indexOf(t);
      if (r === -1) throw new Error(`Unknown letter: "${t}". Allowed: ${n}`);
      return r;
    }));
  } };
}
function zr(n = "") {
  if (typeof n != "string") throw new Error("join separator should be string");
  return { encode: (e) => {
    if (!Array.isArray(e) || e.length && typeof e[0] != "string") throw new Error("join.encode input should be array of strings");
    for (let t of e) if (typeof t != "string") throw new Error(`join.encode: non-string input=${t}`);
    return e.join(n);
  }, decode: (e) => {
    if (typeof e != "string") throw new Error("join.decode input should be string");
    return e.split(n);
  } };
}
function go(n, e = "=") {
  if (Qs(n), typeof e != "string") throw new Error("padding chr should be string");
  return { encode(t) {
    if (!Array.isArray(t) || t.length && typeof t[0] != "string") throw new Error("padding.encode input should be array of strings");
    for (let r of t) if (typeof r != "string") throw new Error(`padding.encode: non-string input=${r}`);
    for (; t.length * n % 8; ) t.push(e);
    return t;
  }, decode(t) {
    if (!Array.isArray(t) || t.length && typeof t[0] != "string") throw new Error("padding.encode input should be array of strings");
    for (let i of t) if (typeof i != "string") throw new Error(`padding.decode: non-string input=${i}`);
    let r = t.length;
    if (r * n % 8) throw new Error("Invalid padding: string should have whole number of bytes");
    for (; r > 0 && t[r - 1] === e; r--) if (!((r - 1) * n % 8)) throw new Error("Invalid padding: string has too much padding");
    return t.slice(0, r);
  } };
}
function Ud(n) {
  if (typeof n != "function") throw new Error("normalize fn should be function");
  return { encode: (e) => e, decode: (e) => n(e) };
}
function jc(n, e, t) {
  if (e < 2) throw new Error(`convertRadix: wrong from=${e}, base cannot be less than 2`);
  if (t < 2) throw new Error(`convertRadix: wrong to=${t}, base cannot be less than 2`);
  if (!Array.isArray(n)) throw new Error("convertRadix: data should be array");
  if (!n.length) return [];
  let r = 0;
  const i = [], a = Array.from(n);
  for (a.forEach(((c) => {
    if (Qs(c), c < 0 || c >= e) throw new Error(`Wrong integer: ${c}`);
  })); ; ) {
    let c = 0, d = !0;
    for (let h = r; h < a.length; h++) {
      const g = a[h], b = e * c + g;
      if (!Number.isSafeInteger(b) || e * c / e !== c || b - g != e * c) throw new Error("convertRadix: carry overflow");
      if (c = b % t, a[h] = Math.floor(b / t), !Number.isSafeInteger(a[h]) || a[h] * t + c !== b) throw new Error("convertRadix: carry overflow");
      d && (a[h] ? d = !1 : r = h);
    }
    if (i.push(c), d) break;
  }
  for (let c = 0; c < n.length - 1 && n[c] === 0; c++) i.push(0);
  return i.reverse();
}
const Pd = (n, e) => e ? Pd(e, n % e) : n, vo = (n, e) => n + (e - Pd(n, e));
function Qa(n, e, t, r) {
  if (!Array.isArray(n)) throw new Error("convertRadix2: data should be array");
  if (e <= 0 || e > 32) throw new Error(`convertRadix2: wrong from=${e}`);
  if (t <= 0 || t > 32) throw new Error(`convertRadix2: wrong to=${t}`);
  if (vo(e, t) > 32) throw new Error(`convertRadix2: carry overflow from=${e} to=${t} carryBits=${vo(e, t)}`);
  let i = 0, a = 0;
  const c = 2 ** t - 1, d = [];
  for (const h of n) {
    if (Qs(h), h >= 2 ** e) throw new Error(`convertRadix2: invalid data word=${h} from=${e}`);
    if (i = i << e | h, a + e > 32) throw new Error(`convertRadix2: carry overflow pos=${a} from=${e}`);
    for (a += e; a >= t; a -= t) d.push((i >> a - t & c) >>> 0);
    i &= 2 ** a - 1;
  }
  if (i = i << t - a & c, !r && a >= e) throw new Error("Excess padding");
  if (!r && i) throw new Error(`Non-zero padding: ${i}`);
  return r && a > 0 && d.push(i >>> 0), d;
}
function Vg(n) {
  return Qs(n), { encode: (e) => {
    if (!(e instanceof Uint8Array)) throw new Error("radix.encode input should be Uint8Array");
    return jc(Array.from(e), 256, n);
  }, decode: (e) => {
    if (!Array.isArray(e) || e.length && typeof e[0] != "number") throw new Error("radix.decode input should be array of strings");
    return Uint8Array.from(jc(e, n, 256));
  } };
}
function us(n, e = !1) {
  if (Qs(n), n <= 0 || n > 32) throw new Error("radix2: bits should be in (0..32]");
  if (vo(8, n) > 32 || vo(n, 8) > 32) throw new Error("radix2: carry overflow");
  return { encode: (t) => {
    if (!(t instanceof Uint8Array)) throw new Error("radix2.encode input should be Uint8Array");
    return Qa(Array.from(t), 8, n, !e);
  }, decode: (t) => {
    if (!Array.isArray(t) || t.length && typeof t[0] != "number") throw new Error("radix2.decode input should be array of strings");
    return Uint8Array.from(Qa(t, n, 8, e));
  } };
}
function Fc(n) {
  if (typeof n != "function") throw new Error("unsafeWrapper fn should be function");
  return function(...e) {
    try {
      return n.apply(null, e);
    } catch {
    }
  };
}
Ur(us(4), Pr("0123456789ABCDEF"), zr(""));
Ur(us(5), Pr("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), go(5), zr(""));
const fs = (Ur(us(5), Pr("0123456789ABCDEFGHIJKLMNOPQRSTUV"), go(5), zr("")), Ur(us(5), Pr("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), zr(""), Ud(((n) => n.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")))), Ur(us(6), Pr("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), go(6), zr("")));
Ur(us(6), Pr("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), go(6), zr(""));
const Ya = (n) => Ur(Vg(58), Pr(n), zr(""));
Ya("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
Ya("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), Ya("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
const Xa = Ur(Pr("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), zr("")), Zc = [996825010, 642813549, 513874426, 1027748829, 705979059];
function wi(n) {
  const e = n >> 25;
  let t = (33554431 & n) << 5;
  for (let r = 0; r < Zc.length; r++) (e >> r & 1) == 1 && (t ^= Zc[r]);
  return t;
}
function Vc(n, e, t = 1) {
  const r = n.length;
  let i = 1;
  for (let a = 0; a < r; a++) {
    const c = n.charCodeAt(a);
    if (c < 33 || c > 126) throw new Error(`Invalid prefix (${n})`);
    i = wi(i) ^ c >> 5;
  }
  i = wi(i);
  for (let a = 0; a < r; a++) i = wi(i) ^ 31 & n.charCodeAt(a);
  for (let a of e) i = wi(i) ^ a;
  for (let a = 0; a < 6; a++) i = wi(i);
  return i ^= t, Xa.encode(Qa([i % 2 ** 30], 30, 5, !1));
}
function zd(n) {
  const e = n === "bech32" ? 1 : 734539939, t = us(5), r = t.decode, i = t.encode, a = Fc(r);
  function c(d, h = 90) {
    if (typeof d != "string") throw new Error("bech32.decode input should be string, not " + typeof d);
    if (d.length < 8 || h !== !1 && d.length > h) throw new TypeError(`Wrong string length: ${d.length} (${d}). Expected (8..${h})`);
    const g = d.toLowerCase();
    if (d !== g && d !== d.toUpperCase()) throw new Error("String must be lowercase or uppercase");
    const b = (d = g).lastIndexOf("1");
    if (b === 0 || b === -1) throw new Error('Letter "1" must be present between prefix and data only');
    const m = d.slice(0, b), v = d.slice(b + 1);
    if (v.length < 6) throw new Error("Data must be at least 6 characters long");
    const T = Xa.decode(v).slice(0, -6), A = Vc(m, T, e);
    if (!v.endsWith(A)) throw new Error(`Invalid checksum in ${d}: expected "${A}"`);
    return { prefix: m, words: T };
  }
  return { encode: function(d, h, g = 90) {
    if (typeof d != "string") throw new Error("bech32.encode prefix should be string, not " + typeof d);
    if (!Array.isArray(h) || h.length && typeof h[0] != "number") throw new Error("bech32.encode words should be array of numbers, not " + typeof h);
    const b = d.length + 7 + h.length;
    if (g !== !1 && b > g) throw new TypeError(`Length ${b} exceeds limit ${g}`);
    return `${d = d.toLowerCase()}1${Xa.encode(h)}${Vc(d, h, e)}`;
  }, decode: c, decodeToBytes: function(d) {
    const { prefix: h, words: g } = c(d, !1);
    return { prefix: h, words: g, bytes: r(g) };
  }, decodeUnsafe: Fc(c), fromWords: r, fromWordsUnsafe: a, toWords: i };
}
const Vs = zd("bech32");
zd("bech32m");
Ur(us(4), Pr("0123456789abcdef"), zr(""), Ud(((n) => {
  if (typeof n != "string" || n.length % 2) throw new TypeError(`hex.decode: expected string, got ${typeof n} with length ${n.length}`);
  return n.toLowerCase();
})));
function Na(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`positive integer expected, not ${n}`);
}
function Gc(n) {
  if (typeof n != "boolean") throw new Error(`boolean expected, not ${n}`);
}
function Hd(n) {
  return n instanceof Uint8Array || n != null && typeof n == "object" && n.constructor.name === "Uint8Array";
}
function _t(n, ...e) {
  if (!Hd(n)) throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(n.length)) throw new Error(`Uint8Array expected of length ${e}, not of length=${n.length}`);
}
function Gs(n, e = !0) {
  if (n.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && n.finished) throw new Error("Hash#digest() has already been called");
}
function bl(n, e) {
  _t(n);
  const t = e.outputLen;
  if (n.length < t) throw new Error(`digestInto() expects output buffer of length at least ${t}`);
}
const ml = (n) => new Uint8Array(n.buffer, n.byteOffset, n.byteLength), ct = (n) => new Uint32Array(n.buffer, n.byteOffset, Math.floor(n.byteLength / 4)), Lo = (n) => new DataView(n.buffer, n.byteOffset, n.byteLength);
if (new Uint8Array(new Uint32Array([287454020]).buffer)[0] !== 68) throw new Error("Non little-endian hardware is not supported");
function ps(n) {
  if (typeof n == "string") n = (function(e) {
    if (typeof e != "string") throw new Error("string expected, got " + typeof e);
    return new Uint8Array(new TextEncoder().encode(e));
  })(n);
  else {
    if (!Hd(n)) throw new Error("Uint8Array expected, got " + typeof n);
    n = n.slice();
  }
  return n;
}
function yl(n, e) {
  if (n.length !== e.length) return !1;
  let t = 0;
  for (let r = 0; r < n.length; r++) t |= n[r] ^ e[r];
  return t === 0;
}
const Ys = (n, e) => (Object.assign(e, n), e);
function Ja(n, e, t, r) {
  if (typeof n.setBigUint64 == "function") return n.setBigUint64(e, t, r);
  const i = BigInt(32), a = BigInt(4294967295), c = Number(t >> i & a), d = Number(t & a), h = r ? 4 : 0, g = r ? 0 : 4;
  n.setUint32(e + h, c, r), n.setUint32(e + g, d, r);
}
const Dr = 16, wl = new Uint8Array(16), Er = ct(wl), Qn = (n) => (n >>> 0 & 255) << 24 | (n >>> 8 & 255) << 16 | (n >>> 16 & 255) << 8 | n >>> 24 & 255;
class qd {
  constructor(e, t) {
    this.blockLen = Dr, this.outputLen = Dr, this.s0 = 0, this.s1 = 0, this.s2 = 0, this.s3 = 0, this.finished = !1, _t(e = ps(e), 16);
    const r = Lo(e);
    let i = r.getUint32(0, !1), a = r.getUint32(4, !1), c = r.getUint32(8, !1), d = r.getUint32(12, !1);
    const h = [];
    for (let U = 0; U < 128; U++) h.push({ s0: Qn(i), s1: Qn(a), s2: Qn(c), s3: Qn(d) }), { s0: i, s1: a, s2: c, s3: d } = { s3: (m = c) << 31 | (v = d) >>> 1, s2: (b = a) << 31 | m >>> 1, s1: (g = i) << 31 | b >>> 1, s0: g >>> 1 ^ 225 << 24 & -(1 & v) };
    var g, b, m, v;
    const T = ((U) => U > 65536 ? 8 : U > 1024 ? 4 : 2)(t || 1024);
    if (![1, 2, 4, 8].includes(T)) throw new Error(`ghash: wrong window size=${T}, should be 2, 4 or 8`);
    this.W = T;
    const A = 128 / T, E = this.windowSize = 2 ** T, L = [];
    for (let U = 0; U < A; U++) for (let P = 0; P < E; P++) {
      let J = 0, ie = 0, te = 0, ee = 0;
      for (let F = 0; F < T; F++) {
        if (!(P >>> T - F - 1 & 1)) continue;
        const { s0: O, s1: k, s2: $, s3: S } = h[T * U + F];
        J ^= O, ie ^= k, te ^= $, ee ^= S;
      }
      L.push({ s0: J, s1: ie, s2: te, s3: ee });
    }
    this.t = L;
  }
  _updateBlock(e, t, r, i) {
    e ^= this.s0, t ^= this.s1, r ^= this.s2, i ^= this.s3;
    const { W: a, t: c, windowSize: d } = this;
    let h = 0, g = 0, b = 0, m = 0;
    const v = (1 << a) - 1;
    let T = 0;
    for (const A of [e, t, r, i]) for (let E = 0; E < 4; E++) {
      const L = A >>> 8 * E & 255;
      for (let U = 8 / a - 1; U >= 0; U--) {
        const P = L >>> a * U & v, { s0: J, s1: ie, s2: te, s3: ee } = c[T * d + P];
        h ^= J, g ^= ie, b ^= te, m ^= ee, T += 1;
      }
    }
    this.s0 = h, this.s1 = g, this.s2 = b, this.s3 = m;
  }
  update(e) {
    e = ps(e), Gs(this);
    const t = ct(e), r = Math.floor(e.length / Dr), i = e.length % Dr;
    for (let a = 0; a < r; a++) this._updateBlock(t[4 * a + 0], t[4 * a + 1], t[4 * a + 2], t[4 * a + 3]);
    return i && (wl.set(e.subarray(r * Dr)), this._updateBlock(Er[0], Er[1], Er[2], Er[3]), Er.fill(0)), this;
  }
  destroy() {
    const { t: e } = this;
    for (const t of e) t.s0 = 0, t.s1 = 0, t.s2 = 0, t.s3 = 0;
  }
  digestInto(e) {
    Gs(this), bl(e, this), this.finished = !0;
    const { s0: t, s1: r, s2: i, s3: a } = this, c = ct(e);
    return c[0] = t, c[1] = r, c[2] = i, c[3] = a, e;
  }
  digest() {
    const e = new Uint8Array(Dr);
    return this.digestInto(e), this.destroy(), e;
  }
}
class Gg extends qd {
  constructor(e, t) {
    const r = (function(i) {
      i.reverse();
      const a = 1 & i[15];
      let c = 0;
      for (let d = 0; d < i.length; d++) {
        const h = i[d];
        i[d] = h >>> 1 | c, c = (1 & h) << 7;
      }
      return i[0] ^= 225 & -a, i;
    })((e = ps(e)).slice());
    super(r, t), r.fill(0);
  }
  update(e) {
    e = ps(e), Gs(this);
    const t = ct(e), r = e.length % Dr, i = Math.floor(e.length / Dr);
    for (let a = 0; a < i; a++) this._updateBlock(Qn(t[4 * a + 3]), Qn(t[4 * a + 2]), Qn(t[4 * a + 1]), Qn(t[4 * a + 0]));
    return r && (wl.set(e.subarray(i * Dr)), this._updateBlock(Qn(Er[3]), Qn(Er[2]), Qn(Er[1]), Qn(Er[0])), Er.fill(0)), this;
  }
  digestInto(e) {
    Gs(this), bl(e, this), this.finished = !0;
    const { s0: t, s1: r, s2: i, s3: a } = this, c = ct(e);
    return c[0] = t, c[1] = r, c[2] = i, c[3] = a, e.reverse();
  }
}
function jd(n) {
  const e = (r, i) => n(i, r.length).update(ps(r)).digest(), t = n(new Uint8Array(16), 0);
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (r, i) => n(r, i), e;
}
const Wc = jd(((n, e) => new qd(n, e))), Wg = jd(((n, e) => new Gg(n, e))), Bn = 16, so = new Uint8Array(Bn);
function xl(n) {
  return n << 1 ^ 283 & -(n >> 7);
}
function Ps(n, e) {
  let t = 0;
  for (; e > 0; e >>= 1) t ^= n & -(1 & e), n = xl(n);
  return t;
}
const el = (() => {
  let n = new Uint8Array(256);
  for (let t = 0, r = 1; t < 256; t++, r ^= xl(r)) n[t] = r;
  const e = new Uint8Array(256);
  e[0] = 99;
  for (let t = 0; t < 255; t++) {
    let r = n[255 - t];
    r |= r << 8, e[n[t]] = 255 & (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99);
  }
  return e;
})(), Kg = el.map(((n, e) => el.indexOf(e))), Ma = (n) => n << 8 | n >>> 24;
function Fd(n, e) {
  if (n.length !== 256) throw new Error("Wrong sbox length");
  const t = new Uint32Array(256).map(((g, b) => e(n[b]))), r = t.map(Ma), i = r.map(Ma), a = i.map(Ma), c = new Uint32Array(65536), d = new Uint32Array(65536), h = new Uint16Array(65536);
  for (let g = 0; g < 256; g++) for (let b = 0; b < 256; b++) {
    const m = 256 * g + b;
    c[m] = t[g] ^ r[b], d[m] = i[g] ^ a[b], h[m] = n[g] << 8 | n[b];
  }
  return { sbox: n, sbox2: h, T0: t, T1: r, T2: i, T3: a, T01: c, T23: d };
}
const _l = Fd(el, ((n) => Ps(n, 3) << 24 | n << 16 | n << 8 | Ps(n, 2))), Zd = Fd(Kg, ((n) => Ps(n, 11) << 24 | Ps(n, 13) << 16 | Ps(n, 9) << 8 | Ps(n, 14))), Qg = (() => {
  const n = new Uint8Array(16);
  for (let e = 0, t = 1; e < 16; e++, t = xl(t)) n[e] = t;
  return n;
})();
function gs(n) {
  _t(n);
  const e = n.length;
  if (![16, 24, 32].includes(e)) throw new Error(`aes: wrong key size: should be 16, 24 or 32, got: ${e}`);
  const { sbox2: t } = _l, r = ct(n), i = r.length, a = (h) => Ar(t, h, h, h, h), c = new Uint32Array(e + 28);
  c.set(r);
  for (let h = i; h < c.length; h++) {
    let g = c[h - 1];
    h % i == 0 ? g = a((d = g) << 24 | d >>> 8) ^ Qg[h / i - 1] : i > 6 && h % i == 4 && (g = a(g)), c[h] = c[h - i] ^ g;
  }
  var d;
  return c;
}
function Vd(n) {
  const e = gs(n), t = e.slice(), r = e.length, { sbox2: i } = _l, { T0: a, T1: c, T2: d, T3: h } = Zd;
  for (let g = 0; g < r; g += 4) for (let b = 0; b < 4; b++) t[g + b] = e[r - g - 4 + b];
  e.fill(0);
  for (let g = 4; g < r - 4; g++) {
    const b = t[g], m = Ar(i, b, b, b, b);
    t[g] = a[255 & m] ^ c[m >>> 8 & 255] ^ d[m >>> 16 & 255] ^ h[m >>> 24];
  }
  return t;
}
function cs(n, e, t, r, i, a) {
  return n[t << 8 & 65280 | r >>> 8 & 255] ^ e[i >>> 8 & 65280 | a >>> 24 & 255];
}
function Ar(n, e, t, r, i) {
  return n[255 & e | 65280 & t] | n[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function Yn(n, e, t, r, i) {
  const { sbox2: a, T01: c, T23: d } = _l;
  let h = 0;
  e ^= n[h++], t ^= n[h++], r ^= n[h++], i ^= n[h++];
  const g = n.length / 4 - 2;
  for (let b = 0; b < g; b++) {
    const m = n[h++] ^ cs(c, d, e, t, r, i), v = n[h++] ^ cs(c, d, t, r, i, e), T = n[h++] ^ cs(c, d, r, i, e, t), A = n[h++] ^ cs(c, d, i, e, t, r);
    e = m, t = v, r = T, i = A;
  }
  return { s0: n[h++] ^ Ar(a, e, t, r, i), s1: n[h++] ^ Ar(a, t, r, i, e), s2: n[h++] ^ Ar(a, r, i, e, t), s3: n[h++] ^ Ar(a, i, e, t, r) };
}
function Gd(n, e, t, r, i) {
  const { sbox2: a, T01: c, T23: d } = Zd;
  let h = 0;
  e ^= n[h++], t ^= n[h++], r ^= n[h++], i ^= n[h++];
  const g = n.length / 4 - 2;
  for (let b = 0; b < g; b++) {
    const m = n[h++] ^ cs(c, d, e, i, r, t), v = n[h++] ^ cs(c, d, t, e, i, r), T = n[h++] ^ cs(c, d, r, t, e, i), A = n[h++] ^ cs(c, d, i, r, t, e);
    e = m, t = v, r = T, i = A;
  }
  return { s0: n[h++] ^ Ar(a, e, i, r, t), s1: n[h++] ^ Ar(a, t, e, i, r), s2: n[h++] ^ Ar(a, r, t, e, i), s3: n[h++] ^ Ar(a, i, r, t, e) };
}
function Xs(n, e) {
  if (!e) return new Uint8Array(n);
  if (_t(e), e.length < n) throw new Error(`aes: wrong destination length, expected at least ${n}, got: ${e.length}`);
  return e;
}
function Yg(n, e, t, r) {
  _t(e, Bn), _t(t);
  const i = t.length;
  r = Xs(i, r);
  const a = e, c = ct(a);
  let { s0: d, s1: h, s2: g, s3: b } = Yn(n, c[0], c[1], c[2], c[3]);
  const m = ct(t), v = ct(r);
  for (let A = 0; A + 4 <= m.length; A += 4) {
    v[A + 0] = m[A + 0] ^ d, v[A + 1] = m[A + 1] ^ h, v[A + 2] = m[A + 2] ^ g, v[A + 3] = m[A + 3] ^ b;
    let E = 1;
    for (let L = a.length - 1; L >= 0; L--) E = E + (255 & a[L]) | 0, a[L] = 255 & E, E >>>= 8;
    ({ s0: d, s1: h, s2: g, s3: b } = Yn(n, c[0], c[1], c[2], c[3]));
  }
  const T = Bn * Math.floor(m.length / 4);
  if (T < i) {
    const A = new Uint32Array([d, h, g, b]), E = ml(A);
    for (let L = T, U = 0; L < i; L++, U++) r[L] = t[L] ^ E[U];
  }
  return r;
}
function xi(n, e, t, r, i) {
  _t(t, Bn), _t(r), i = Xs(r.length, i);
  const a = t, c = ct(a), d = Lo(a), h = ct(r), g = ct(i), b = e ? 0 : 12, m = r.length;
  let v = d.getUint32(b, e), { s0: T, s1: A, s2: E, s3: L } = Yn(n, c[0], c[1], c[2], c[3]);
  for (let P = 0; P + 4 <= h.length; P += 4) g[P + 0] = h[P + 0] ^ T, g[P + 1] = h[P + 1] ^ A, g[P + 2] = h[P + 2] ^ E, g[P + 3] = h[P + 3] ^ L, v = v + 1 >>> 0, d.setUint32(b, v, e), { s0: T, s1: A, s2: E, s3: L } = Yn(n, c[0], c[1], c[2], c[3]);
  const U = Bn * Math.floor(h.length / 4);
  if (U < m) {
    const P = new Uint32Array([T, A, E, L]), J = ml(P);
    for (let ie = U, te = 0; ie < m; ie++, te++) i[ie] = r[ie] ^ J[te];
  }
  return i;
}
Ys({ blockSize: 16, nonceLength: 16 }, (function(n, e) {
  function t(r, i) {
    const a = gs(n), c = e.slice(), d = Yg(a, c, r, i);
    return a.fill(0), c.fill(0), d;
  }
  return _t(n), _t(e, Bn), { encrypt: (r, i) => t(r, i), decrypt: (r, i) => t(r, i) };
}));
function Wd(n) {
  if (_t(n), n.length % Bn != 0) throw new Error("aes/(cbc-ecb).decrypt ciphertext should consist of blocks with size 16");
}
function Kd(n, e, t) {
  let r = n.length;
  const i = r % Bn;
  if (!e && i !== 0) throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
  const a = ct(n);
  if (e) {
    let d = Bn - i;
    d || (d = Bn), r += d;
  }
  const c = Xs(r, t);
  return { b: a, o: ct(c), out: c };
}
function Qd(n, e) {
  if (!e) return n;
  const t = n.length;
  if (!t) throw new Error("aes/pcks5: empty ciphertext not allowed");
  const r = n[t - 1];
  if (r <= 0 || r > 16) throw new Error(`aes/pcks5: wrong padding byte: ${r}`);
  const i = n.subarray(0, -r);
  for (let a = 0; a < r; a++) if (n[t - a - 1] !== r) throw new Error("aes/pcks5: wrong padding");
  return i;
}
function Yd(n) {
  const e = new Uint8Array(16), t = ct(e);
  e.set(n);
  const r = Bn - n.length;
  for (let i = Bn - r; i < Bn; i++) e[i] = r;
  return t;
}
Ys({ blockSize: 16 }, (function(n, e = {}) {
  _t(n);
  const t = !e.disablePadding;
  return { encrypt: (r, i) => {
    _t(r);
    const { b: a, o: c, out: d } = Kd(r, t, i), h = gs(n);
    let g = 0;
    for (; g + 4 <= a.length; ) {
      const { s0: b, s1: m, s2: v, s3: T } = Yn(h, a[g + 0], a[g + 1], a[g + 2], a[g + 3]);
      c[g++] = b, c[g++] = m, c[g++] = v, c[g++] = T;
    }
    if (t) {
      const b = Yd(r.subarray(4 * g)), { s0: m, s1: v, s2: T, s3: A } = Yn(h, b[0], b[1], b[2], b[3]);
      c[g++] = m, c[g++] = v, c[g++] = T, c[g++] = A;
    }
    return h.fill(0), d;
  }, decrypt: (r, i) => {
    Wd(r);
    const a = Vd(n), c = Xs(r.length, i), d = ct(r), h = ct(c);
    for (let g = 0; g + 4 <= d.length; ) {
      const { s0: b, s1: m, s2: v, s3: T } = Gd(a, d[g + 0], d[g + 1], d[g + 2], d[g + 3]);
      h[g++] = b, h[g++] = m, h[g++] = v, h[g++] = T;
    }
    return a.fill(0), Qd(c, t);
  } };
}));
const Xd = Ys({ blockSize: 16, nonceLength: 16 }, (function(n, e, t = {}) {
  _t(n), _t(e, 16);
  const r = !t.disablePadding;
  return { encrypt: (i, a) => {
    const c = gs(n), { b: d, o: h, out: g } = Kd(i, r, a), b = ct(e);
    let m = b[0], v = b[1], T = b[2], A = b[3], E = 0;
    for (; E + 4 <= d.length; ) m ^= d[E + 0], v ^= d[E + 1], T ^= d[E + 2], A ^= d[E + 3], { s0: m, s1: v, s2: T, s3: A } = Yn(c, m, v, T, A), h[E++] = m, h[E++] = v, h[E++] = T, h[E++] = A;
    if (r) {
      const L = Yd(i.subarray(4 * E));
      m ^= L[0], v ^= L[1], T ^= L[2], A ^= L[3], { s0: m, s1: v, s2: T, s3: A } = Yn(c, m, v, T, A), h[E++] = m, h[E++] = v, h[E++] = T, h[E++] = A;
    }
    return c.fill(0), g;
  }, decrypt: (i, a) => {
    Wd(i);
    const c = Vd(n), d = ct(e), h = Xs(i.length, a), g = ct(i), b = ct(h);
    let m = d[0], v = d[1], T = d[2], A = d[3];
    for (let E = 0; E + 4 <= g.length; ) {
      const L = m, U = v, P = T, J = A;
      m = g[E + 0], v = g[E + 1], T = g[E + 2], A = g[E + 3];
      const { s0: ie, s1: te, s2: ee, s3: F } = Gd(c, m, v, T, A);
      b[E++] = ie ^ L, b[E++] = te ^ U, b[E++] = ee ^ P, b[E++] = F ^ J;
    }
    return c.fill(0), Qd(h, r);
  } };
}));
Ys({ blockSize: 16, nonceLength: 16 }, (function(n, e) {
  function t(r, i, a) {
    const c = gs(n), d = r.length;
    a = Xs(d, a);
    const h = ct(r), g = ct(a), b = i ? g : h, m = ct(e);
    let v = m[0], T = m[1], A = m[2], E = m[3];
    for (let U = 0; U + 4 <= h.length; ) {
      const { s0: P, s1: J, s2: ie, s3: te } = Yn(c, v, T, A, E);
      g[U + 0] = h[U + 0] ^ P, g[U + 1] = h[U + 1] ^ J, g[U + 2] = h[U + 2] ^ ie, g[U + 3] = h[U + 3] ^ te, v = b[U++], T = b[U++], A = b[U++], E = b[U++];
    }
    const L = Bn * Math.floor(h.length / 4);
    if (L < d) {
      ({ s0: v, s1: T, s2: A, s3: E } = Yn(c, v, T, A, E));
      const U = ml(new Uint32Array([v, T, A, E]));
      for (let P = L, J = 0; P < d; P++, J++) a[P] = r[P] ^ U[J];
      U.fill(0);
    }
    return c.fill(0), a;
  }
  return _t(n), _t(e, 16), { encrypt: (r, i) => t(r, !0, i), decrypt: (r, i) => t(r, !1, i) };
}));
function Jd(n, e, t, r, i) {
  const a = n.create(t, r.length + (i?.length || 0));
  i && a.update(i), a.update(r);
  const c = new Uint8Array(16), d = Lo(c);
  return i && Ja(d, 0, BigInt(8 * i.length), e), Ja(d, 8, BigInt(8 * r.length), e), a.update(c), a.digest();
}
Ys({ blockSize: 16, nonceLength: 12, tagLength: 16 }, (function(n, e, t) {
  if (_t(e), e.length === 0) throw new Error("aes/gcm: empty nonce");
  const r = 16;
  function i(c, d, h) {
    const g = Jd(Wc, !1, c, h, t);
    for (let b = 0; b < d.length; b++) g[b] ^= d[b];
    return g;
  }
  function a() {
    const c = gs(n), d = so.slice(), h = so.slice();
    if (xi(c, !1, h, h, d), e.length === 12) h.set(e);
    else {
      const g = so.slice();
      Ja(Lo(g), 8, BigInt(8 * e.length), !1), Wc.create(d).update(e).update(g).digestInto(h);
    }
    return { xk: c, authKey: d, counter: h, tagMask: xi(c, !1, h, so) };
  }
  return { encrypt: (c) => {
    _t(c);
    const { xk: d, authKey: h, counter: g, tagMask: b } = a(), m = new Uint8Array(c.length + r);
    xi(d, !1, g, c, m);
    const v = i(h, b, m.subarray(0, m.length - r));
    return m.set(v, c.length), d.fill(0), m;
  }, decrypt: (c) => {
    if (_t(c), c.length < r) throw new Error("aes/gcm: ciphertext less than tagLen (16)");
    const { xk: d, authKey: h, counter: g, tagMask: b } = a(), m = c.subarray(0, -16), v = c.subarray(-16);
    if (!yl(i(h, b, m), v)) throw new Error("aes/gcm: invalid ghash tag");
    const T = xi(d, !1, g, m);
    return h.fill(0), b.fill(0), d.fill(0), T;
  } };
}));
const io = (n, e, t) => (r) => {
  if (!Number.isSafeInteger(r) || e > r || r > t) throw new Error(`${n}: invalid value=${r}, must be [${e}..${t}]`);
};
Ys({ blockSize: 16, nonceLength: 12, tagLength: 16 }, (function(n, e, t) {
  const r = io("AAD", 0, 68719476736), i = io("plaintext", 0, 2 ** 36), a = io("nonce", 12, 12), c = io("ciphertext", 16, 2 ** 36 + 16);
  function d() {
    const b = n.length;
    if (b !== 16 && b !== 24 && b !== 32) throw new Error(`key length must be 16, 24 or 32 bytes, got: ${b} bytes`);
    const m = gs(n), v = new Uint8Array(b), T = new Uint8Array(16), A = ct(e);
    let E = 0, L = A[0], U = A[1], P = A[2], J = 0;
    for (const ie of [T, v].map(ct)) {
      const te = ct(ie);
      for (let ee = 0; ee < te.length; ee += 2) {
        const { s0: F, s1: O } = Yn(m, E, L, U, P);
        te[ee + 0] = F, te[ee + 1] = O, E = ++J;
      }
    }
    return m.fill(0), { authKey: T, encKey: gs(v) };
  }
  function h(b, m, v) {
    const T = Jd(Wg, !0, m, v, t);
    for (let J = 0; J < 12; J++) T[J] ^= e[J];
    T[15] &= 127;
    const A = ct(T);
    let E = A[0], L = A[1], U = A[2], P = A[3];
    return { s0: E, s1: L, s2: U, s3: P } = Yn(b, E, L, U, P), A[0] = E, A[1] = L, A[2] = U, A[3] = P, T;
  }
  function g(b, m, v) {
    let T = m.slice();
    return T[15] |= 128, xi(b, !0, T, v);
  }
  return _t(e), a(e.length), t && (_t(t), r(t.length)), { encrypt: (b) => {
    _t(b), i(b.length);
    const { encKey: m, authKey: v } = d(), T = h(m, v, b), A = new Uint8Array(b.length + 16);
    return A.set(T, b.length), A.set(g(m, T, b)), m.fill(0), v.fill(0), A;
  }, decrypt: (b) => {
    _t(b), c(b.length);
    const m = b.subarray(-16), { encKey: v, authKey: T } = d(), A = g(v, m, b.subarray(0, -16)), E = h(v, T, A);
    if (v.fill(0), T.fill(0), !yl(m, E)) throw new Error("invalid polyval tag");
    return A;
  } };
}));
const hn = (n, e) => 255 & n[e++] | (255 & n[e++]) << 8;
class Xg {
  constructor(e) {
    this.blockLen = 16, this.outputLen = 16, this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.pos = 0, this.finished = !1, _t(e = ps(e), 32);
    const t = hn(e, 0), r = hn(e, 2), i = hn(e, 4), a = hn(e, 6), c = hn(e, 8), d = hn(e, 10), h = hn(e, 12), g = hn(e, 14);
    this.r[0] = 8191 & t, this.r[1] = 8191 & (t >>> 13 | r << 3), this.r[2] = 7939 & (r >>> 10 | i << 6), this.r[3] = 8191 & (i >>> 7 | a << 9), this.r[4] = 255 & (a >>> 4 | c << 12), this.r[5] = c >>> 1 & 8190, this.r[6] = 8191 & (c >>> 14 | d << 2), this.r[7] = 8065 & (d >>> 11 | h << 5), this.r[8] = 8191 & (h >>> 8 | g << 8), this.r[9] = g >>> 5 & 127;
    for (let b = 0; b < 8; b++) this.pad[b] = hn(e, 16 + 2 * b);
  }
  process(e, t, r = !1) {
    const i = r ? 0 : 2048, { h: a, r: c } = this, d = c[0], h = c[1], g = c[2], b = c[3], m = c[4], v = c[5], T = c[6], A = c[7], E = c[8], L = c[9], U = hn(e, t + 0), P = hn(e, t + 2), J = hn(e, t + 4), ie = hn(e, t + 6), te = hn(e, t + 8), ee = hn(e, t + 10), F = hn(e, t + 12), O = hn(e, t + 14);
    let k = a[0] + (8191 & U), $ = a[1] + (8191 & (U >>> 13 | P << 3)), S = a[2] + (8191 & (P >>> 10 | J << 6)), j = a[3] + (8191 & (J >>> 7 | ie << 9)), V = a[4] + (8191 & (ie >>> 4 | te << 12)), Y = a[5] + (te >>> 1 & 8191), W = a[6] + (8191 & (te >>> 14 | ee << 2)), re = a[7] + (8191 & (ee >>> 11 | F << 5)), ue = a[8] + (8191 & (F >>> 8 | O << 8)), be = a[9] + (O >>> 5 | i), pe = 0, Ie = pe + k * d + $ * (5 * L) + S * (5 * E) + j * (5 * A) + V * (5 * T);
    pe = Ie >>> 13, Ie &= 8191, Ie += Y * (5 * v) + W * (5 * m) + re * (5 * b) + ue * (5 * g) + be * (5 * h), pe += Ie >>> 13, Ie &= 8191;
    let $e = pe + k * h + $ * d + S * (5 * L) + j * (5 * E) + V * (5 * A);
    pe = $e >>> 13, $e &= 8191, $e += Y * (5 * T) + W * (5 * v) + re * (5 * m) + ue * (5 * b) + be * (5 * g), pe += $e >>> 13, $e &= 8191;
    let Ce = pe + k * g + $ * h + S * d + j * (5 * L) + V * (5 * E);
    pe = Ce >>> 13, Ce &= 8191, Ce += Y * (5 * A) + W * (5 * T) + re * (5 * v) + ue * (5 * m) + be * (5 * b), pe += Ce >>> 13, Ce &= 8191;
    let Ve = pe + k * b + $ * g + S * h + j * d + V * (5 * L);
    pe = Ve >>> 13, Ve &= 8191, Ve += Y * (5 * E) + W * (5 * A) + re * (5 * T) + ue * (5 * v) + be * (5 * m), pe += Ve >>> 13, Ve &= 8191;
    let Ge = pe + k * m + $ * b + S * g + j * h + V * d;
    pe = Ge >>> 13, Ge &= 8191, Ge += Y * (5 * L) + W * (5 * E) + re * (5 * A) + ue * (5 * T) + be * (5 * v), pe += Ge >>> 13, Ge &= 8191;
    let ke = pe + k * v + $ * m + S * b + j * g + V * h;
    pe = ke >>> 13, ke &= 8191, ke += Y * d + W * (5 * L) + re * (5 * E) + ue * (5 * A) + be * (5 * T), pe += ke >>> 13, ke &= 8191;
    let We = pe + k * T + $ * v + S * m + j * b + V * g;
    pe = We >>> 13, We &= 8191, We += Y * h + W * d + re * (5 * L) + ue * (5 * E) + be * (5 * A), pe += We >>> 13, We &= 8191;
    let bt = pe + k * A + $ * T + S * v + j * m + V * b;
    pe = bt >>> 13, bt &= 8191, bt += Y * g + W * h + re * d + ue * (5 * L) + be * (5 * E), pe += bt >>> 13, bt &= 8191;
    let ge = pe + k * E + $ * A + S * T + j * v + V * m;
    pe = ge >>> 13, ge &= 8191, ge += Y * b + W * g + re * h + ue * d + be * (5 * L), pe += ge >>> 13, ge &= 8191;
    let it = pe + k * L + $ * E + S * A + j * T + V * v;
    pe = it >>> 13, it &= 8191, it += Y * m + W * b + re * g + ue * h + be * d, pe += it >>> 13, it &= 8191, pe = (pe << 2) + pe | 0, pe = pe + Ie | 0, Ie = 8191 & pe, pe >>>= 13, $e += pe, a[0] = Ie, a[1] = $e, a[2] = Ce, a[3] = Ve, a[4] = Ge, a[5] = ke, a[6] = We, a[7] = bt, a[8] = ge, a[9] = it;
  }
  finalize() {
    const { h: e, pad: t } = this, r = new Uint16Array(10);
    let i = e[1] >>> 13;
    e[1] &= 8191;
    for (let d = 2; d < 10; d++) e[d] += i, i = e[d] >>> 13, e[d] &= 8191;
    e[0] += 5 * i, i = e[0] >>> 13, e[0] &= 8191, e[1] += i, i = e[1] >>> 13, e[1] &= 8191, e[2] += i, r[0] = e[0] + 5, i = r[0] >>> 13, r[0] &= 8191;
    for (let d = 1; d < 10; d++) r[d] = e[d] + i, i = r[d] >>> 13, r[d] &= 8191;
    r[9] -= 8192;
    let a = (1 ^ i) - 1;
    for (let d = 0; d < 10; d++) r[d] &= a;
    a = ~a;
    for (let d = 0; d < 10; d++) e[d] = e[d] & a | r[d];
    e[0] = 65535 & (e[0] | e[1] << 13), e[1] = 65535 & (e[1] >>> 3 | e[2] << 10), e[2] = 65535 & (e[2] >>> 6 | e[3] << 7), e[3] = 65535 & (e[3] >>> 9 | e[4] << 4), e[4] = 65535 & (e[4] >>> 12 | e[5] << 1 | e[6] << 14), e[5] = 65535 & (e[6] >>> 2 | e[7] << 11), e[6] = 65535 & (e[7] >>> 5 | e[8] << 8), e[7] = 65535 & (e[8] >>> 8 | e[9] << 5);
    let c = e[0] + t[0];
    e[0] = 65535 & c;
    for (let d = 1; d < 8; d++) c = (e[d] + t[d] | 0) + (c >>> 16) | 0, e[d] = 65535 & c;
  }
  update(e) {
    Gs(this);
    const { buffer: t, blockLen: r } = this, i = (e = ps(e)).length;
    for (let a = 0; a < i; ) {
      const c = Math.min(r - this.pos, i - a);
      if (c !== r) t.set(e.subarray(a, a + c), this.pos), this.pos += c, a += c, this.pos === r && (this.process(t, 0, !1), this.pos = 0);
      else for (; r <= i - a; a += r) this.process(e, a);
    }
    return this;
  }
  destroy() {
    this.h.fill(0), this.r.fill(0), this.buffer.fill(0), this.pad.fill(0);
  }
  digestInto(e) {
    Gs(this), bl(e, this), this.finished = !0;
    const { buffer: t, h: r } = this;
    let { pos: i } = this;
    if (i) {
      for (t[i++] = 1; i < 16; i++) t[i] = 0;
      this.process(t, 0, !0);
    }
    this.finalize();
    let a = 0;
    for (let c = 0; c < 8; c++) e[a++] = r[c] >>> 0, e[a++] = r[c] >>> 8;
    return e;
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const r = e.slice(0, t);
    return this.destroy(), r;
  }
}
(function(n) {
  const e = (r, i) => n(i).update(ps(r)).digest(), t = n(new Uint8Array(32));
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (r) => n(r), e;
})(((n) => new Xg(n)));
const eu = (n) => Uint8Array.from(n.split("").map(((e) => e.charCodeAt(0)))), Jg = eu("expand 16-byte k"), e0 = eu("expand 32-byte k"), t0 = ct(Jg), tu = ct(e0);
tu.slice();
function Te(n, e) {
  return n << e | n >>> 32 - e;
}
function Ra(n) {
  return n.byteOffset % 4 == 0;
}
const Kc = 2 ** 32 - 1, Qc = new Uint32Array();
function nu(n, e) {
  const { allowShortKeys: t, extendNonceFn: r, counterLength: i, counterRight: a, rounds: c } = (function(d, h) {
    if (h == null || typeof h != "object") throw new Error("options must be defined");
    return Object.assign(d, h);
  })({ allowShortKeys: !1, counterLength: 8, counterRight: !1, rounds: 20 }, e);
  if (typeof n != "function") throw new Error("core must be a function");
  return Na(i), Na(c), Gc(a), Gc(t), (d, h, g, b, m = 0) => {
    _t(d), _t(h), _t(g);
    const v = g.length;
    if (b || (b = new Uint8Array(v)), _t(b), Na(m), m < 0 || m >= Kc) throw new Error("arx: counter overflow");
    if (b.length < v) throw new Error(`arx: output (${b.length}) is shorter than data (${v})`);
    const T = [];
    let A, E, L = d.length;
    if (L === 32) A = d.slice(), T.push(A), E = tu;
    else {
      if (L !== 16 || !t) throw new Error(`arx: invalid 32-byte key, got length=${L}`);
      A = new Uint8Array(32), A.set(d), A.set(d, 16), E = t0, T.push(A);
    }
    Ra(h) || (h = h.slice(), T.push(h));
    const U = ct(A);
    if (r) {
      if (h.length !== 24) throw new Error("arx: extended nonce must be 24 bytes");
      r(E, U, ct(h.subarray(0, 16)), U), h = h.subarray(16);
    }
    const P = 16 - i;
    if (P !== h.length) throw new Error(`arx: nonce must be ${P} or 16 bytes`);
    if (P !== 12) {
      const ie = new Uint8Array(12);
      ie.set(h, a ? 0 : 12 - h.length), h = ie, T.push(h);
    }
    const J = ct(h);
    for (!(function(ie, te, ee, F, O, k, $, S) {
      const j = O.length, V = new Uint8Array(64), Y = ct(V), W = Ra(O) && Ra(k), re = W ? ct(O) : Qc, ue = W ? ct(k) : Qc;
      for (let be = 0; be < j; $++) {
        if (ie(te, ee, F, Y, $, S), $ >= Kc) throw new Error("arx: counter overflow");
        const pe = Math.min(64, j - be);
        if (W && pe === 64) {
          const Ie = be / 4;
          if (be % 4 != 0) throw new Error("arx: invalid block position");
          for (let $e, Ce = 0; Ce < 16; Ce++) $e = Ie + Ce, ue[$e] = re[$e] ^ Y[Ce];
          be += 64;
        } else {
          for (let Ie, $e = 0; $e < pe; $e++) Ie = be + $e, k[Ie] = O[Ie] ^ V[$e];
          be += pe;
        }
      }
    })(n, E, U, J, g, b, m, c); T.length > 0; ) T.pop().fill(0);
    return b;
  };
}
function ru(n, e, t, r, i, a = 20) {
  let c = n[0], d = n[1], h = n[2], g = n[3], b = e[0], m = e[1], v = e[2], T = e[3], A = e[4], E = e[5], L = e[6], U = e[7], P = i, J = t[0], ie = t[1], te = t[2], ee = c, F = d, O = h, k = g, $ = b, S = m, j = v, V = T, Y = A, W = E, re = L, ue = U, be = P, pe = J, Ie = ie, $e = te;
  for (let Ve = 0; Ve < a; Ve += 2) ee = ee + $ | 0, be = Te(be ^ ee, 16), Y = Y + be | 0, $ = Te($ ^ Y, 12), ee = ee + $ | 0, be = Te(be ^ ee, 8), Y = Y + be | 0, $ = Te($ ^ Y, 7), F = F + S | 0, pe = Te(pe ^ F, 16), W = W + pe | 0, S = Te(S ^ W, 12), F = F + S | 0, pe = Te(pe ^ F, 8), W = W + pe | 0, S = Te(S ^ W, 7), O = O + j | 0, Ie = Te(Ie ^ O, 16), re = re + Ie | 0, j = Te(j ^ re, 12), O = O + j | 0, Ie = Te(Ie ^ O, 8), re = re + Ie | 0, j = Te(j ^ re, 7), k = k + V | 0, $e = Te($e ^ k, 16), ue = ue + $e | 0, V = Te(V ^ ue, 12), k = k + V | 0, $e = Te($e ^ k, 8), ue = ue + $e | 0, V = Te(V ^ ue, 7), ee = ee + S | 0, $e = Te($e ^ ee, 16), re = re + $e | 0, S = Te(S ^ re, 12), ee = ee + S | 0, $e = Te($e ^ ee, 8), re = re + $e | 0, S = Te(S ^ re, 7), F = F + j | 0, be = Te(be ^ F, 16), ue = ue + be | 0, j = Te(j ^ ue, 12), F = F + j | 0, be = Te(be ^ F, 8), ue = ue + be | 0, j = Te(j ^ ue, 7), O = O + V | 0, pe = Te(pe ^ O, 16), Y = Y + pe | 0, V = Te(V ^ Y, 12), O = O + V | 0, pe = Te(pe ^ O, 8), Y = Y + pe | 0, V = Te(V ^ Y, 7), k = k + $ | 0, Ie = Te(Ie ^ k, 16), W = W + Ie | 0, $ = Te($ ^ W, 12), k = k + $ | 0, Ie = Te(Ie ^ k, 8), W = W + Ie | 0, $ = Te($ ^ W, 7);
  let Ce = 0;
  r[Ce++] = c + ee | 0, r[Ce++] = d + F | 0, r[Ce++] = h + O | 0, r[Ce++] = g + k | 0, r[Ce++] = b + $ | 0, r[Ce++] = m + S | 0, r[Ce++] = v + j | 0, r[Ce++] = T + V | 0, r[Ce++] = A + Y | 0, r[Ce++] = E + W | 0, r[Ce++] = L + re | 0, r[Ce++] = U + ue | 0, r[Ce++] = P + be | 0, r[Ce++] = J + pe | 0, r[Ce++] = ie + Ie | 0, r[Ce++] = te + $e | 0;
}
const su = nu(ru, { counterRight: !1, counterLength: 4, allowShortKeys: !1 });
nu(ru, { counterRight: !1, counterLength: 8, extendNonceFn: function(n, e, t, r) {
  let i = n[0], a = n[1], c = n[2], d = n[3], h = e[0], g = e[1], b = e[2], m = e[3], v = e[4], T = e[5], A = e[6], E = e[7], L = t[0], U = t[1], P = t[2], J = t[3];
  for (let te = 0; te < 20; te += 2) i = i + h | 0, L = Te(L ^ i, 16), v = v + L | 0, h = Te(h ^ v, 12), i = i + h | 0, L = Te(L ^ i, 8), v = v + L | 0, h = Te(h ^ v, 7), a = a + g | 0, U = Te(U ^ a, 16), T = T + U | 0, g = Te(g ^ T, 12), a = a + g | 0, U = Te(U ^ a, 8), T = T + U | 0, g = Te(g ^ T, 7), c = c + b | 0, P = Te(P ^ c, 16), A = A + P | 0, b = Te(b ^ A, 12), c = c + b | 0, P = Te(P ^ c, 8), A = A + P | 0, b = Te(b ^ A, 7), d = d + m | 0, J = Te(J ^ d, 16), E = E + J | 0, m = Te(m ^ E, 12), d = d + m | 0, J = Te(J ^ d, 8), E = E + J | 0, m = Te(m ^ E, 7), i = i + g | 0, J = Te(J ^ i, 16), A = A + J | 0, g = Te(g ^ A, 12), i = i + g | 0, J = Te(J ^ i, 8), A = A + J | 0, g = Te(g ^ A, 7), a = a + b | 0, L = Te(L ^ a, 16), E = E + L | 0, b = Te(b ^ E, 12), a = a + b | 0, L = Te(L ^ a, 8), E = E + L | 0, b = Te(b ^ E, 7), c = c + m | 0, U = Te(U ^ c, 16), v = v + U | 0, m = Te(m ^ v, 12), c = c + m | 0, U = Te(U ^ c, 8), v = v + U | 0, m = Te(m ^ v, 7), d = d + h | 0, P = Te(P ^ d, 16), T = T + P | 0, h = Te(h ^ T, 12), d = d + h | 0, P = Te(P ^ d, 8), T = T + P | 0, h = Te(h ^ T, 7);
  let ie = 0;
  r[ie++] = i, r[ie++] = a, r[ie++] = c, r[ie++] = d, r[ie++] = L, r[ie++] = U, r[ie++] = P, r[ie++] = J;
}, allowShortKeys: !1 });
class iu extends Nd {
  constructor(e, t) {
    super(), this.finished = !1, this.destroyed = !1, kr.hash(e);
    const r = Ii(t);
    if (this.iHash = e.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, a = new Uint8Array(i);
    a.set(r.length > i ? e.create().update(r).digest() : r);
    for (let c = 0; c < a.length; c++) a[c] ^= 54;
    this.iHash.update(a), this.oHash = e.create();
    for (let c = 0; c < a.length; c++) a[c] ^= 106;
    this.oHash.update(a), a.fill(0);
  }
  update(e) {
    return kr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    kr.exists(this), kr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: t, iHash: r, finished: i, destroyed: a, blockLen: c, outputLen: d } = this;
    return e.finished = i, e.destroyed = a, e.blockLen = c, e.outputLen = d, e.oHash = t._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Do = (n, e, t) => new iu(n, e).update(t).digest();
function n0(n, e, t) {
  return kr.hash(n), Do(n, Ii(t), Ii(e));
}
Do.create = (n, e) => new iu(n, e);
const Ba = new Uint8Array([0]), Yc = new Uint8Array();
function r0(n, e, t, r = 32) {
  if (kr.hash(n), kr.number(r), r > 255 * n.outputLen) throw new Error("Length should be <= 255*HashLen");
  const i = Math.ceil(r / n.outputLen);
  t === void 0 && (t = Yc);
  const a = new Uint8Array(i * n.outputLen), c = Do.create(n, e), d = c._cloneInto(), h = new Uint8Array(c.outputLen);
  for (let g = 0; g < i; g++) Ba[0] = g + 1, d.update(g === 0 ? Yc : h).update(t).update(Ba).digestInto(h), a.set(h, n.outputLen * g), c._cloneInto(d);
  return c.destroy(), d.destroy(), h.fill(0), Ba.fill(0), a.slice(0, r);
}
var s0 = Object.defineProperty, Zt = (n, e) => {
  for (var t in e) s0(n, t, { get: e[t], enumerable: !0 });
}, os = Symbol("verified"), i0 = (n) => n instanceof Object;
function Oo(n) {
  if (!i0(n) || typeof n.kind != "number" || typeof n.content != "string" || typeof n.created_at != "number" || typeof n.pubkey != "string" || !n.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(n.tags)) return !1;
  for (let e = 0; e < n.tags.length; e++) {
    let t = n.tags[e];
    if (!Array.isArray(t)) return !1;
    for (let r = 0; r < t.length; r++) if (typeof t[r] == "object") return !1;
  }
  return !0;
}
function o0(n) {
  return n.sort(((e, t) => e.created_at !== t.created_at ? t.created_at - e.created_at : e.id.localeCompare(t.id)));
}
var ou = {};
Zt(ou, { Queue: () => lu, QueueNode: () => au, binarySearch: () => El, insertEventIntoAscendingList: () => l0, insertEventIntoDescendingList: () => a0, normalizeURL: () => zs, utf8Decoder: () => Br, utf8Encoder: () => ir });
var Br = new TextDecoder("utf-8"), ir = new TextEncoder();
function zs(n) {
  n.indexOf("://") === -1 && (n = "wss://" + n);
  let e = new URL(n);
  return e.pathname = e.pathname.replace(/\/+/g, "/"), e.pathname.endsWith("/") && (e.pathname = e.pathname.slice(0, -1)), (e.port === "80" && e.protocol === "ws:" || e.port === "443" && e.protocol === "wss:") && (e.port = ""), e.searchParams.sort(), e.hash = "", e.toString();
}
function a0(n, e) {
  const [t, r] = El(n, ((i) => e.id === i.id ? 0 : e.created_at === i.created_at ? -1 : i.created_at - e.created_at));
  return r || n.splice(t, 0, e), n;
}
function l0(n, e) {
  const [t, r] = El(n, ((i) => e.id === i.id ? 0 : e.created_at === i.created_at ? -1 : e.created_at - i.created_at));
  return r || n.splice(t, 0, e), n;
}
function El(n, e) {
  let t = 0, r = n.length - 1;
  for (; t <= r; ) {
    const i = Math.floor((t + r) / 2), a = e(n[i]);
    if (a === 0) return [i, !0];
    a < 0 ? r = i - 1 : t = i + 1;
  }
  return [t, !1];
}
var au = class {
  value;
  next = null;
  prev = null;
  constructor(n) {
    this.value = n;
  }
}, lu = class {
  first;
  last;
  constructor() {
    this.first = null, this.last = null;
  }
  enqueue(n) {
    const e = new au(n);
    return this.last ? this.last === this.first ? (this.last = e, this.last.prev = this.first, this.first.next = e) : (e.prev = this.last, this.last.next = e, this.last = e) : (this.first = e, this.last = e), !0;
  }
  dequeue() {
    if (!this.first) return null;
    if (this.first === this.last) {
      const e = this.first;
      return this.first = null, this.last = null, e.value;
    }
    const n = this.first;
    return this.first = n.next, n.value;
  }
};
function cu(n) {
  if (!Oo(n)) throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, n.pubkey, n.created_at, n.kind, n.tags, n.content]);
}
function Ei(n) {
  return tn($s(ir.encode(cu(n))));
}
var No = new class {
  generateSecretKey() {
    return _r.utils.randomPrivateKey();
  }
  getPublicKey(n) {
    return tn(_r.getPublicKey(n));
  }
  finalizeEvent(n, e) {
    const t = n;
    return t.pubkey = tn(_r.getPublicKey(e)), t.id = Ei(t), t.sig = tn(_r.sign(Ei(t), e)), t[os] = !0, t;
  }
  verifyEvent(n) {
    if (typeof n[os] == "boolean") return n[os];
    const e = Ei(n);
    if (e !== n.id) return n[os] = !1, !1;
    try {
      const t = _r.verify(n.sig, e, n.pubkey);
      return n[os] = t, t;
    } catch {
      return n[os] = !1, !1;
    }
  }
}(), du = No.generateSecretKey, $l = No.getPublicKey, cr = No.finalizeEvent, Js = No.verifyEvent, uu = {};
function hu(n) {
  return 1e3 <= n && n < 1e4 || [1, 2, 4, 5, 6, 7, 8, 16, 40, 41, 42, 43, 44].includes(n);
}
function kl(n) {
  return [0, 3].includes(n) || 1e4 <= n && n < 2e4;
}
function fu(n) {
  return 2e4 <= n && n < 3e4;
}
function Al(n) {
  return 3e4 <= n && n < 4e4;
}
function c0(n) {
  return hu(n) ? "regular" : kl(n) ? "replaceable" : fu(n) ? "ephemeral" : Al(n) ? "parameterized" : "unknown";
}
function d0(n, e) {
  const t = e instanceof Array ? e : [e];
  return Oo(n) && t.includes(n.kind) || !1;
}
Zt(uu, { Application: () => dv, BadgeAward: () => b0, BadgeDefinition: () => rv, BlockedRelaysList: () => H0, BookmarkList: () => U0, Bookmarksets: () => ev, Calendar: () => bv, CalendarEventRSVP: () => mv, ChannelCreation: () => gu, ChannelHideMessage: () => mu, ChannelMessage: () => bu, ChannelMetadata: () => vu, ChannelMuteUser: () => yu, ClassifiedListing: () => fv, ClientAuth: () => xu, CommunitiesList: () => P0, CommunityDefinition: () => xv, CommunityPostApproval: () => S0, Contacts: () => p0, CreateOrUpdateProduct: () => ov, CreateOrUpdateStall: () => iv, Curationsets: () => tv, Date: () => gv, DirectMessageRelaysList: () => Z0, DraftClassifiedListing: () => pv, DraftLong: () => lv, Emojisets: () => cv, EncryptedDirectMessage: () => g0, EventDeletion: () => v0, FileMetadata: () => x0, FileServerPreference: () => V0, Followsets: () => Y0, GenericRepost: () => y0, Genericlists: () => X0, GiftWrap: () => wu, HTTPAuth: () => Il, Handlerinformation: () => wv, Handlerrecommendation: () => yv, Highlights: () => N0, InterestsList: () => j0, Interestsets: () => sv, JobFeedback: () => T0, JobRequest: () => C0, JobResult: () => I0, Label: () => A0, LightningPubRPC: () => W0, LiveChatMessage: () => _0, LiveEvent: () => uv, LongFormArticle: () => av, Metadata: () => u0, Mutelist: () => M0, NWCWalletInfo: () => G0, NWCWalletRequest: () => _u, NWCWalletResponse: () => K0, NostrConnect: () => Q0, OpenTimestamps: () => w0, Pinlist: () => R0, PrivateDirectMessage: () => m0, ProblemTracker: () => E0, ProfileBadges: () => nv, PublicChatsList: () => z0, Reaction: () => Cl, RecommendRelay: () => f0, RelayList: () => B0, Relaysets: () => J0, Report: () => $0, Reporting: () => k0, Repost: () => Sl, Seal: () => pu, SearchRelaysList: () => q0, ShortTextNote: () => h0, Time: () => vv, UserEmojiList: () => F0, UserStatuses: () => hv, Zap: () => O0, ZapGoal: () => L0, ZapRequest: () => D0, classifyKind: () => c0, isEphemeralKind: () => fu, isKind: () => d0, isParameterizedReplaceableKind: () => Al, isRegularKind: () => hu, isReplaceableKind: () => kl });
var u0 = 0, h0 = 1, f0 = 2, p0 = 3, g0 = 4, v0 = 5, Sl = 6, Cl = 7, b0 = 8, pu = 13, m0 = 14, y0 = 16, gu = 40, vu = 41, bu = 42, mu = 43, yu = 44, w0 = 1040, wu = 1059, x0 = 1063, _0 = 1311, E0 = 1971, $0 = 1984, k0 = 1984, A0 = 1985, S0 = 4550, C0 = 5999, I0 = 6999, T0 = 7e3, L0 = 9041, D0 = 9734, O0 = 9735, N0 = 9802, M0 = 1e4, R0 = 10001, B0 = 10002, U0 = 10003, P0 = 10004, z0 = 10005, H0 = 10006, q0 = 10007, j0 = 10015, F0 = 10030, Z0 = 10050, V0 = 10096, G0 = 13194, W0 = 21e3, xu = 22242, _u = 23194, K0 = 23195, Q0 = 24133, Il = 27235, Y0 = 3e4, X0 = 30001, J0 = 30002, ev = 30003, tv = 30004, nv = 30008, rv = 30009, sv = 30015, iv = 30017, ov = 30018, av = 30023, lv = 30024, cv = 30030, dv = 30078, uv = 30311, hv = 30315, fv = 30402, pv = 30403, gv = 31922, vv = 31923, bv = 31924, mv = 31925, yv = 31989, wv = 31990, xv = 34550;
function Eu(n, e) {
  if (n.ids && n.ids.indexOf(e.id) === -1 || n.kinds && n.kinds.indexOf(e.kind) === -1 || n.authors && n.authors.indexOf(e.pubkey) === -1) return !1;
  for (let t in n) if (t[0] === "#") {
    let r = n[`#${t.slice(1)}`];
    if (r && !e.tags.find((([i, a]) => i === t.slice(1) && r.indexOf(a) !== -1))) return !1;
  }
  return !(n.since && e.created_at < n.since) && !(n.until && e.created_at > n.until);
}
function $u(n, e) {
  for (let t = 0; t < n.length; t++) if (Eu(n[t], e)) return !0;
  return !1;
}
function _v(...n) {
  let e = {};
  for (let t = 0; t < n.length; t++) {
    let r = n[t];
    Object.entries(r).forEach((([i, a]) => {
      if (i === "kinds" || i === "ids" || i === "authors" || i[0] === "#") {
        e[i] = e[i] || [];
        for (let c = 0; c < a.length; c++) {
          let d = a[c];
          e[i].includes(d) || e[i].push(d);
        }
      }
    })), r.limit && (!e.limit || r.limit > e.limit) && (e.limit = r.limit), r.until && (!e.until || r.until > e.until) && (e.until = r.until), r.since && (!e.since || r.since < e.since) && (e.since = r.since);
  }
  return e;
}
function Ev(n) {
  if (n.ids && !n.ids.length || n.kinds && !n.kinds.length || n.authors && !n.authors.length) return 0;
  for (const [e, t] of Object.entries(n)) if (e[0] === "#" && Array.isArray(t) && !t.length) return 0;
  return Math.min(Math.max(0, n.limit ?? 1 / 0), n.ids?.length ?? 1 / 0, n.authors?.length && n.kinds?.every(((e) => kl(e))) ? n.authors.length * n.kinds.length : 1 / 0, n.authors?.length && n.kinds?.every(((e) => Al(e))) && n["#d"]?.length ? n.authors.length * n.kinds.length * n["#d"].length : 1 / 0);
}
var ku = {};
function Mo(n, e) {
  let t = e.length + 3, r = n.indexOf(`"${e}":`) + t, i = n.slice(r).indexOf('"') + r + 1;
  return n.slice(i, i + 64);
}
function Au(n, e) {
  let t = e.length, r = n.indexOf(`"${e}":`) + t + 3, i = n.slice(r), a = Math.min(i.indexOf(","), i.indexOf("}"));
  return parseInt(i.slice(0, a), 10);
}
function Su(n) {
  let e = n.slice(0, 22).indexOf('"EVENT"');
  if (e === -1) return null;
  let t = n.slice(e + 7 + 1).indexOf('"');
  if (t === -1) return null;
  let r = e + 7 + 1 + t, i = n.slice(r + 1, 80).indexOf('"');
  if (i === -1) return null;
  let a = r + 1 + i;
  return n.slice(r + 1, a);
}
function $v(n, e) {
  return e === Mo(n, "id");
}
function kv(n, e) {
  return e === Mo(n, "pubkey");
}
function Av(n, e) {
  return e === Au(n, "kind");
}
Zt(ku, { getHex64: () => Mo, getInt: () => Au, getSubscriptionId: () => Su, matchEventId: () => $v, matchEventKind: () => Av, matchEventPubkey: () => kv });
var Cu = {};
function Iu(n, e) {
  return { kind: xu, created_at: Math.floor(Date.now() / 1e3), tags: [["relay", n], ["challenge", e]], content: "" };
}
async function Sv() {
  return new Promise(((n) => {
    const e = new MessageChannel(), t = () => {
      e.port1.removeEventListener("message", t), n();
    };
    e.port1.addEventListener("message", t), e.port2.postMessage(0), e.port1.start();
  }));
}
Zt(Cu, { makeAuthEvent: () => Iu });
var Tu, Cv = (n) => (n[os] = !0, !0), Tl = class {
  url;
  _connected = !1;
  onclose = null;
  onnotice = (n) => {
  };
  _onauth = null;
  baseEoseTimeout = 4400;
  connectionTimeout = 4400;
  publishTimeout = 4400;
  openSubs = /* @__PURE__ */ new Map();
  connectionTimeoutHandle;
  connectionPromise;
  openCountRequests = /* @__PURE__ */ new Map();
  openEventPublishes = /* @__PURE__ */ new Map();
  ws;
  incomingMessageQueue = new lu();
  queueRunning = !1;
  challenge;
  serial = 0;
  verifyEvent;
  _WebSocket;
  constructor(n, e) {
    this.url = zs(n), this.verifyEvent = e.verifyEvent, this._WebSocket = e.websocketImplementation || WebSocket;
  }
  static async connect(n, e) {
    const t = new Tl(n, e);
    return await t.connect(), t;
  }
  closeAllSubscriptions(n) {
    for (let [e, t] of this.openSubs) t.close(n);
    this.openSubs.clear();
    for (let [e, t] of this.openEventPublishes) t.reject(new Error(n));
    this.openEventPublishes.clear();
    for (let [e, t] of this.openCountRequests) t.reject(new Error(n));
    this.openCountRequests.clear();
  }
  get connected() {
    return this._connected;
  }
  async connect() {
    return this.connectionPromise || (this.challenge = void 0, this.connectionPromise = new Promise(((n, e) => {
      this.connectionTimeoutHandle = setTimeout((() => {
        e("connection timed out"), this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection timed out");
      }), this.connectionTimeout);
      try {
        this.ws = new this._WebSocket(this.url);
      } catch (t) {
        return void e(t);
      }
      this.ws.onopen = () => {
        clearTimeout(this.connectionTimeoutHandle), this._connected = !0, n();
      }, this.ws.onerror = (t) => {
        e(t.message || "websocket error"), this._connected && (this._connected = !1, this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection errored"));
      }, this.ws.onclose = async () => {
        this._connected && (this._connected = !1, this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection closed"));
      }, this.ws.onmessage = this._onmessage.bind(this);
    }))), this.connectionPromise;
  }
  async runQueue() {
    for (this.queueRunning = !0; this.handleNext() !== !1; ) await Sv();
    this.queueRunning = !1;
  }
  handleNext() {
    const n = this.incomingMessageQueue.dequeue();
    if (!n) return !1;
    const e = Su(n);
    if (e) {
      const t = this.openSubs.get(e);
      if (!t) return;
      const r = Mo(n, "id"), i = t.alreadyHaveEvent?.(r);
      if (t.receivedEvent?.(this, r), i) return;
    }
    try {
      let t = JSON.parse(n);
      switch (t[0]) {
        case "EVENT": {
          const r = this.openSubs.get(t[1]), i = t[2];
          return void (this.verifyEvent(i) && $u(r.filters, i) && r.onevent(i));
        }
        case "COUNT": {
          const r = t[1], i = t[2], a = this.openCountRequests.get(r);
          return void (a && (a.resolve(i.count), this.openCountRequests.delete(r)));
        }
        case "EOSE": {
          const r = this.openSubs.get(t[1]);
          return r ? void r.receivedEose() : void 0;
        }
        case "OK": {
          const r = t[1], i = t[2], a = t[3], c = this.openEventPublishes.get(r);
          return void (c && (i ? c.resolve(a) : c.reject(new Error(a)), this.openEventPublishes.delete(r)));
        }
        case "CLOSED": {
          const r = t[1], i = this.openSubs.get(r);
          return i ? (i.closed = !0, void i.close(t[2])) : void 0;
        }
        case "NOTICE":
          return void this.onnotice(t[1]);
        case "AUTH":
          return this.challenge = t[1], void this._onauth?.(t[1]);
      }
    } catch {
      return;
    }
  }
  async send(n) {
    if (!this.connectionPromise) throw new Error("sending on closed connection");
    this.connectionPromise.then((() => {
      this.ws?.send(n);
    }));
  }
  async auth(n) {
    if (!this.challenge) throw new Error("can't perform auth, no challenge was received");
    const e = await n(Iu(this.url, this.challenge)), t = new Promise(((r, i) => {
      this.openEventPublishes.set(e.id, { resolve: r, reject: i });
    }));
    return this.send('["AUTH",' + JSON.stringify(e) + "]"), t;
  }
  async publish(n) {
    const e = new Promise(((t, r) => {
      this.openEventPublishes.set(n.id, { resolve: t, reject: r });
    }));
    return this.send('["EVENT",' + JSON.stringify(n) + "]"), setTimeout((() => {
      const t = this.openEventPublishes.get(n.id);
      t && (t.reject(new Error("publish timed out")), this.openEventPublishes.delete(n.id));
    }), this.publishTimeout), e;
  }
  async count(n, e) {
    this.serial++;
    const t = e?.id || "count:" + this.serial, r = new Promise(((i, a) => {
      this.openCountRequests.set(t, { resolve: i, reject: a });
    }));
    return this.send('["COUNT","' + t + '",' + JSON.stringify(n).substring(1)), r;
  }
  subscribe(n, e) {
    const t = this.prepareSubscription(n, e);
    return t.fire(), t;
  }
  prepareSubscription(n, e) {
    this.serial++;
    const t = e.id || "sub:" + this.serial, r = new Iv(this, t, n, e);
    return this.openSubs.set(t, r), r;
  }
  close() {
    this.closeAllSubscriptions("relay connection closed by us"), this._connected = !1, this.ws?.close();
  }
  _onmessage(n) {
    this.incomingMessageQueue.enqueue(n.data), this.queueRunning || this.runQueue();
  }
}, Iv = class {
  relay;
  id;
  closed = !1;
  eosed = !1;
  filters;
  alreadyHaveEvent;
  receivedEvent;
  onevent;
  oneose;
  onclose;
  eoseTimeout;
  eoseTimeoutHandle;
  constructor(n, e, t, r) {
    this.relay = n, this.filters = t, this.id = e, this.alreadyHaveEvent = r.alreadyHaveEvent, this.receivedEvent = r.receivedEvent, this.eoseTimeout = r.eoseTimeout || n.baseEoseTimeout, this.oneose = r.oneose, this.onclose = r.onclose, this.onevent = r.onevent || ((i) => {
    });
  }
  fire() {
    this.relay.send('["REQ","' + this.id + '",' + JSON.stringify(this.filters).substring(1)), this.eoseTimeoutHandle = setTimeout(this.receivedEose.bind(this), this.eoseTimeout);
  }
  receivedEose() {
    this.eosed || (clearTimeout(this.eoseTimeoutHandle), this.eosed = !0, this.oneose?.());
  }
  close(n = "closed by caller") {
    !this.closed && this.relay.connected && (this.relay.send('["CLOSE",' + JSON.stringify(this.id) + "]"), this.closed = !0), this.relay.openSubs.delete(this.id), this.onclose?.(n);
  }
};
try {
  Tu = WebSocket;
} catch {
}
var Lu, Du = class extends Tl {
  constructor(n) {
    super(n, { verifyEvent: Js, websocketImplementation: Tu });
  }
  static async connect(n) {
    const e = new Du(n);
    return await e.connect(), e;
  }
}, Tv = class {
  relays = /* @__PURE__ */ new Map();
  seenOn = /* @__PURE__ */ new Map();
  trackRelays = !1;
  verifyEvent;
  trustedRelayURLs = /* @__PURE__ */ new Set();
  _WebSocket;
  constructor(n) {
    this.verifyEvent = n.verifyEvent, this._WebSocket = n.websocketImplementation;
  }
  async ensureRelay(n, e) {
    n = zs(n);
    let t = this.relays.get(n);
    return t || (t = new Tl(n, { verifyEvent: this.trustedRelayURLs.has(n) ? Cv : this.verifyEvent, websocketImplementation: this._WebSocket }), e?.connectionTimeout && (t.connectionTimeout = e.connectionTimeout), this.relays.set(n, t)), await t.connect(), t;
  }
  close(n) {
    n.map(zs).forEach(((e) => {
      this.relays.get(e)?.close();
    }));
  }
  subscribeMany(n, e, t) {
    return this.subscribeManyMap(Object.fromEntries(n.map(((r) => [r, e]))), t);
  }
  subscribeManyMap(n, e) {
    this.trackRelays && (e.receivedEvent = (m, v) => {
      let T = this.seenOn.get(v);
      T || (T = /* @__PURE__ */ new Set(), this.seenOn.set(v, T)), T.add(m);
    });
    const t = /* @__PURE__ */ new Set(), r = [], i = Object.keys(n).length, a = [];
    let c = (m) => {
      a[m] = !0, a.filter(((v) => v)).length === i && (e.oneose?.(), c = () => {
      });
    };
    const d = [];
    let h = (m, v) => {
      c(m), d[m] = v, d.filter(((T) => T)).length === i && (e.onclose?.(d), h = () => {
      });
    };
    const g = (m) => {
      if (e.alreadyHaveEvent?.(m)) return !0;
      const v = t.has(m);
      return t.add(m), v;
    }, b = Promise.all(Object.entries(n).map((async (m, v, T) => {
      if (T.indexOf(m) !== v) return void h(v, "duplicate url");
      let A, [E, L] = m;
      E = zs(E);
      try {
        A = await this.ensureRelay(E, { connectionTimeout: e.maxWait ? Math.max(0.8 * e.maxWait, e.maxWait - 1e3) : void 0 });
      } catch (P) {
        return void h(v, P?.message || String(P));
      }
      let U = A.subscribe(L, { ...e, oneose: () => c(v), onclose: (P) => h(v, P), alreadyHaveEvent: g, eoseTimeout: e.maxWait });
      r.push(U);
    })));
    return { async close() {
      await b, r.forEach(((m) => {
        m.close();
      }));
    } };
  }
  subscribeManyEose(n, e, t) {
    const r = this.subscribeMany(n, e, { ...t, oneose() {
      r.close();
    } });
    return r;
  }
  async querySync(n, e, t) {
    return new Promise((async (r) => {
      const i = [];
      this.subscribeManyEose(n, [e], { ...t, onevent(a) {
        i.push(a);
      }, onclose(a) {
        r(i);
      } });
    }));
  }
  async get(n, e, t) {
    e.limit = 1;
    const r = await this.querySync(n, e, t);
    return r.sort(((i, a) => a.created_at - i.created_at)), r[0] || null;
  }
  publish(n, e) {
    return n.map(zs).map((async (t, r, i) => {
      if (i.indexOf(t) !== r) return Promise.reject("duplicate url");
      let a = await this.ensureRelay(t);
      return a.publish(e).then(((c) => {
        if (this.trackRelays) {
          let d = this.seenOn.get(e.id);
          d || (d = /* @__PURE__ */ new Set(), this.seenOn.set(e.id, d)), d.add(a);
        }
        return c;
      }));
    }));
  }
  listConnectionStatus() {
    const n = /* @__PURE__ */ new Map();
    return this.relays.forEach(((e, t) => n.set(t, e.connected))), n;
  }
  destroy() {
    this.relays.forEach(((n) => n.close())), this.relays = /* @__PURE__ */ new Map();
  }
};
try {
  Lu = WebSocket;
} catch {
}
var Lv = class extends Tv {
  constructor() {
    super({ verifyEvent: Js, websocketImplementation: Lu });
  }
}, Ou = {};
Zt(Ou, { BECH32_REGEX: () => Nu, Bech32MaxSize: () => Ll, NostrTypeGuard: () => Dv, decode: () => Ni, encodeBytes: () => Bo, naddrEncode: () => Uv, neventEncode: () => Bv, noteEncode: () => Mv, nprofileEncode: () => Rv, npubEncode: () => Nv, nsecEncode: () => Ov });
var Dv = { isNProfile: (n) => /^nprofile1[a-z\d]+$/.test(n || ""), isNEvent: (n) => /^nevent1[a-z\d]+$/.test(n || ""), isNAddr: (n) => /^naddr1[a-z\d]+$/.test(n || ""), isNSec: (n) => /^nsec1[a-z\d]{58}$/.test(n || ""), isNPub: (n) => /^npub1[a-z\d]{58}$/.test(n || ""), isNote: (n) => /^note1[a-z\d]+$/.test(n || ""), isNcryptsec: (n) => /^ncryptsec1[a-z\d]+$/.test(n || "") }, Ll = 5e3, Nu = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function Ni(n) {
  let { prefix: e, words: t } = Vs.decode(n, Ll), r = new Uint8Array(Vs.fromWords(t));
  switch (e) {
    case "nprofile": {
      let i = Ua(r);
      if (!i[0]?.[0]) throw new Error("missing TLV 0 for nprofile");
      if (i[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
      return { type: "nprofile", data: { pubkey: tn(i[0][0]), relays: i[1] ? i[1].map(((a) => Br.decode(a))) : [] } };
    }
    case "nevent": {
      let i = Ua(r);
      if (!i[0]?.[0]) throw new Error("missing TLV 0 for nevent");
      if (i[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
      if (i[2] && i[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
      if (i[3] && i[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
      return { type: "nevent", data: { id: tn(i[0][0]), relays: i[1] ? i[1].map(((a) => Br.decode(a))) : [], author: i[2]?.[0] ? tn(i[2][0]) : void 0, kind: i[3]?.[0] ? parseInt(tn(i[3][0]), 16) : void 0 } };
    }
    case "naddr": {
      let i = Ua(r);
      if (!i[0]?.[0]) throw new Error("missing TLV 0 for naddr");
      if (!i[2]?.[0]) throw new Error("missing TLV 2 for naddr");
      if (i[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
      if (!i[3]?.[0]) throw new Error("missing TLV 3 for naddr");
      if (i[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
      return { type: "naddr", data: { identifier: Br.decode(i[0][0]), pubkey: tn(i[2][0]), kind: parseInt(tn(i[3][0]), 16), relays: i[1] ? i[1].map(((a) => Br.decode(a))) : [] } };
    }
    case "nsec":
      return { type: e, data: r };
    case "npub":
    case "note":
      return { type: e, data: tn(r) };
    default:
      throw new Error(`unknown prefix ${e}`);
  }
}
function Ua(n) {
  let e = {}, t = n;
  for (; t.length > 0; ) {
    let r = t[0], i = t[1], a = t.slice(2, 2 + i);
    if (t = t.slice(2 + i), a.length < i) throw new Error(`not enough data to read on TLV ${r}`);
    e[r] = e[r] || [], e[r].push(a);
  }
  return e;
}
function Ov(n) {
  return Bo("nsec", n);
}
function Nv(n) {
  return Bo("npub", Zs(n));
}
function Mv(n) {
  return Bo("note", Zs(n));
}
function Ro(n, e) {
  let t = Vs.toWords(e);
  return Vs.encode(n, t, Ll);
}
function Bo(n, e) {
  return Ro(n, e);
}
function Rv(n) {
  return Ro("nprofile", Dl({ 0: [Zs(n.pubkey)], 1: (n.relays || []).map(((e) => ir.encode(e))) }));
}
function Bv(n) {
  let e;
  return n.kind !== void 0 && (e = (function(t) {
    const r = new Uint8Array(4);
    return r[0] = t >> 24 & 255, r[1] = t >> 16 & 255, r[2] = t >> 8 & 255, r[3] = 255 & t, r;
  })(n.kind)), Ro("nevent", Dl({ 0: [Zs(n.id)], 1: (n.relays || []).map(((t) => ir.encode(t))), 2: n.author ? [Zs(n.author)] : [], 3: e ? [new Uint8Array(e)] : [] }));
}
function Uv(n) {
  let e = new ArrayBuffer(4);
  return new DataView(e).setUint32(0, n.kind, !1), Ro("naddr", Dl({ 0: [ir.encode(n.identifier)], 1: (n.relays || []).map(((t) => ir.encode(t))), 2: [Zs(n.pubkey)], 3: [new Uint8Array(e)] }));
}
function Dl(n) {
  let e = [];
  return Object.entries(n).reverse().forEach((([t, r]) => {
    r.forEach(((i) => {
      let a = new Uint8Array(i.length + 2);
      a.set([parseInt(t)], 0), a.set([i.length], 1), a.set(i, 2), e.push(a);
    }));
  })), To(...e);
}
var Pv = /\bnostr:((note|npub|naddr|nevent|nprofile)1\w+)\b|#\[(\d+)\]/g;
function zv(n) {
  let e = [];
  for (let t of n.content.matchAll(Pv)) if (t[2]) try {
    let { type: r, data: i } = Ni(t[1]);
    switch (r) {
      case "npub":
        e.push({ text: t[0], profile: { pubkey: i, relays: [] } });
        break;
      case "nprofile":
        e.push({ text: t[0], profile: i });
        break;
      case "note":
        e.push({ text: t[0], event: { id: i, relays: [] } });
        break;
      case "nevent":
        e.push({ text: t[0], event: i });
        break;
      case "naddr":
        e.push({ text: t[0], address: i });
    }
  } catch {
  }
  else if (t[3]) {
    let r = parseInt(t[3], 10), i = n.tags[r];
    if (!i) continue;
    switch (i[0]) {
      case "p":
        e.push({ text: t[0], profile: { pubkey: i[1], relays: i[2] ? [i[2]] : [] } });
        break;
      case "e":
        e.push({ text: t[0], event: { id: i[1], relays: i[2] ? [i[2]] : [] } });
        break;
      case "a":
        try {
          let [a, c, d] = i[1].split(":");
          e.push({ text: t[0], address: { identifier: d, pubkey: c, kind: parseInt(a, 10), relays: i[2] ? [i[2]] : [] } });
        } catch {
        }
    }
  }
  return e;
}
var Mu = {};
async function Ru(n, e, t) {
  const r = n instanceof Uint8Array ? tn(n) : n, i = Bu(Ks.getSharedSecret(r, "02" + e));
  let a = Uint8Array.from(Rd(16)), c = ir.encode(t), d = Xd(i, a).encrypt(c);
  return `${fs.encode(new Uint8Array(d))}?iv=${fs.encode(new Uint8Array(a.buffer))}`;
}
async function Hv(n, e, t) {
  const r = n instanceof Uint8Array ? tn(n) : n;
  let [i, a] = t.split("?iv="), c = Bu(Ks.getSharedSecret(r, "02" + e)), d = fs.decode(a), h = fs.decode(i), g = Xd(c, d).decrypt(h);
  return Br.decode(g);
}
function Bu(n) {
  return n.slice(1, 33);
}
Zt(Mu, { decrypt: () => Hv, encrypt: () => Ru });
var Uu = {};
Zt(Uu, { NIP05_REGEX: () => Ol, isNip05: () => qv, isValid: () => Zv, queryProfile: () => Pu, searchDomain: () => Fv, useFetchImplementation: () => jv });
var Uo, Ol = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, qv = (n) => Ol.test(n || "");
try {
  Uo = fetch;
} catch {
}
function jv(n) {
  Uo = n;
}
async function Fv(n, e = "") {
  try {
    const t = `https://${n}/.well-known/nostr.json?name=${e}`, r = await Uo(t, { redirect: "manual" });
    if (r.status !== 200) throw Error("Wrong response code");
    return (await r.json()).names;
  } catch {
    return {};
  }
}
async function Pu(n) {
  const e = n.match(Ol);
  if (!e) return null;
  const [, t = "_", r] = e;
  try {
    const i = `https://${r}/.well-known/nostr.json?name=${t}`, a = await Uo(i, { redirect: "manual" });
    if (a.status !== 200) throw Error("Wrong response code");
    const c = await a.json(), d = c.names[t];
    return d ? { pubkey: d, relays: c.relays?.[d] } : null;
  } catch {
    return null;
  }
}
async function Zv(n, e) {
  const t = await Pu(e);
  return !!t && t.pubkey === n;
}
var zu = {};
function Vv(n) {
  const e = { reply: void 0, root: void 0, mentions: [], profiles: [], quotes: [] };
  let t, r;
  for (let i = n.tags.length - 1; i >= 0; i--) {
    const a = n.tags[i];
    if (a[0] === "e" && a[1]) {
      const [c, d, h, g, b] = a, m = { id: d, relays: h ? [h] : [], author: b };
      if (g === "root") {
        e.root = m;
        continue;
      }
      if (g === "reply") {
        e.reply = m;
        continue;
      }
      if (g === "mention") {
        e.mentions.push(m);
        continue;
      }
      t ? r = m : t = m, e.mentions.push(m);
    } else {
      if (a[0] === "q" && a[1]) {
        const [c, d, h] = a;
        e.quotes.push({ id: d, relays: h ? [h] : [] });
      }
      a[0] === "p" && a[1] && e.profiles.push({ pubkey: a[1], relays: a[2] ? [a[2]] : [] });
    }
  }
  return e.root || (e.root = r || t || e.reply), e.reply || (e.reply = t || e.root), [e.reply, e.root].forEach(((i) => {
    if (!i) return;
    let a = e.mentions.indexOf(i);
    if (a !== -1 && e.mentions.splice(a, 1), i.author) {
      let c = e.profiles.find(((d) => d.pubkey === i.author));
      c && c.relays && (i.relays || (i.relays = []), c.relays.forEach(((d) => {
        i.relays?.indexOf(d) === -1 && i.relays.push(d);
      })), c.relays = i.relays);
    }
  })), e.mentions.forEach(((i) => {
    if (i.author) {
      let a = e.profiles.find(((c) => c.pubkey === i.author));
      a && a.relays && (i.relays || (i.relays = []), a.relays.forEach(((c) => {
        i.relays.indexOf(c) === -1 && i.relays.push(c);
      })), a.relays = i.relays);
    }
  })), e;
}
Zt(zu, { parse: () => Vv });
var Hu = {};
Zt(Hu, { fetchRelayInformation: () => Wv, useFetchImplementation: () => Gv });
function Gv(n) {
}
async function Wv(n) {
  return await (await fetch(n.replace("ws://", "http://").replace("wss://", "https://"), { headers: { Accept: "application/nostr+json" } })).json();
}
var qu = {};
function ju(n) {
  let e = 0;
  for (let t = 0; t < 64; t += 8) {
    const r = parseInt(n.substring(t, t + 8), 16);
    if (r !== 0) {
      e += Math.clz32(r);
      break;
    }
    e += 32;
  }
  return e;
}
function Kv(n, e) {
  let t = 0;
  const r = n, i = ["nonce", t.toString(), e.toString()];
  for (r.tags.push(i); ; ) {
    const a = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
    if (a !== r.created_at && (t = 0, r.created_at = a), i[1] = (++t).toString(), r.id = Fu(r), ju(r.id) >= e) break;
  }
  return r;
}
function Fu(n) {
  return tn($s(ir.encode(JSON.stringify([0, n.pubkey, n.created_at, n.kind, n.tags, n.content]))));
}
Zt(qu, { fastEventHash: () => Fu, getPow: () => ju, minePow: () => Kv });
var Zu = {};
function Qv(n, e, t, r) {
  return cr({ kind: Sl, tags: [...n.tags ?? [], ["e", e.id, t], ["p", e.pubkey]], content: n.content === "" ? "" : JSON.stringify(e), created_at: n.created_at }, r);
}
function Vu(n) {
  if (n.kind !== Sl) return;
  let e, t;
  for (let r = n.tags.length - 1; r >= 0 && (e === void 0 || t === void 0); r--) {
    const i = n.tags[r];
    i.length >= 2 && (i[0] === "e" && e === void 0 ? e = i : i[0] === "p" && t === void 0 && (t = i));
  }
  return e !== void 0 ? { id: e[1], relays: [e[2], t?.[2]].filter(((r) => typeof r == "string")), author: t?.[1] } : void 0;
}
function Yv(n, { skipVerification: e } = {}) {
  const t = Vu(n);
  if (t === void 0 || n.content === "") return;
  let r;
  try {
    r = JSON.parse(n.content);
  } catch {
    return;
  }
  return r.id === t.id && (e || Js(r)) ? r : void 0;
}
Zt(Zu, { finishRepostEvent: () => Qv, getRepostedEvent: () => Yv, getRepostedEventPointer: () => Vu });
var Gu = {};
Zt(Gu, { NOSTR_URI_REGEX: () => Po, parse: () => Jv, test: () => Xv });
var Po = new RegExp(`nostr:(${Nu.source})`);
function Xv(n) {
  return typeof n == "string" && new RegExp(`^${Po.source}$`).test(n);
}
function Jv(n) {
  const e = n.match(new RegExp(`^${Po.source}$`));
  if (!e) throw new Error(`Invalid Nostr URI: ${n}`);
  return { uri: e[0], value: e[1], decoded: Ni(e[1]) };
}
var Wu = {};
function eb(n, e, t) {
  const r = e.tags.filter(((i) => i.length >= 2 && (i[0] === "e" || i[0] === "p")));
  return cr({ ...n, kind: Cl, tags: [...n.tags ?? [], ...r, ["e", e.id], ["p", e.pubkey]], content: n.content ?? "+" }, t);
}
function tb(n) {
  if (n.kind !== Cl) return;
  let e, t;
  for (let r = n.tags.length - 1; r >= 0 && (e === void 0 || t === void 0); r--) {
    const i = n.tags[r];
    i.length >= 2 && (i[0] === "e" && e === void 0 ? e = i : i[0] === "p" && t === void 0 && (t = i));
  }
  return e !== void 0 && t !== void 0 ? { id: e[1], relays: [e[2], t[2]].filter(((r) => r !== void 0)), author: t[1] } : void 0;
}
Zt(Wu, { finishReactionEvent: () => eb, getReactedEventPointer: () => tb });
var Ku = {};
Zt(Ku, { matchAll: () => nb, regex: () => Nl, replaceAll: () => rb });
var Nl = () => new RegExp(`\\b${Po.source}\\b`, "g");
function* nb(n) {
  const e = n.matchAll(Nl());
  for (const t of e) try {
    const [r, i] = t;
    yield { uri: r, value: i, decoded: Ni(i), start: t.index, end: t.index + r.length };
  } catch {
  }
}
function rb(n, e) {
  return n.replaceAll(Nl(), ((t, r) => e({ uri: t, value: r, decoded: Ni(r) })));
}
var Qu = {};
Zt(Qu, { channelCreateEvent: () => sb, channelHideMessageEvent: () => ab, channelMessageEvent: () => ob, channelMetadataEvent: () => ib, channelMuteUserEvent: () => lb });
var sb = (n, e) => {
  let t;
  if (typeof n.content == "object") t = JSON.stringify(n.content);
  else {
    if (typeof n.content != "string") return;
    t = n.content;
  }
  return cr({ kind: gu, tags: [...n.tags ?? []], content: t, created_at: n.created_at }, e);
}, ib = (n, e) => {
  let t;
  if (typeof n.content == "object") t = JSON.stringify(n.content);
  else {
    if (typeof n.content != "string") return;
    t = n.content;
  }
  return cr({ kind: vu, tags: [["e", n.channel_create_event_id], ...n.tags ?? []], content: t, created_at: n.created_at }, e);
}, ob = (n, e) => {
  const t = [["e", n.channel_create_event_id, n.relay_url, "root"]];
  return n.reply_to_channel_message_event_id && t.push(["e", n.reply_to_channel_message_event_id, n.relay_url, "reply"]), cr({ kind: bu, tags: [...t, ...n.tags ?? []], content: n.content, created_at: n.created_at }, e);
}, ab = (n, e) => {
  let t;
  if (typeof n.content == "object") t = JSON.stringify(n.content);
  else {
    if (typeof n.content != "string") return;
    t = n.content;
  }
  return cr({ kind: mu, tags: [["e", n.channel_message_event_id], ...n.tags ?? []], content: t, created_at: n.created_at }, e);
}, lb = (n, e) => {
  let t;
  if (typeof n.content == "object") t = JSON.stringify(n.content);
  else {
    if (typeof n.content != "string") return;
    t = n.content;
  }
  return cr({ kind: yu, tags: [["p", n.pubkey_to_mute], ...n.tags ?? []], content: t, created_at: n.created_at }, e);
}, Yu = {};
Zt(Yu, { EMOJI_SHORTCODE_REGEX: () => Xu, matchAll: () => cb, regex: () => Ml, replaceAll: () => db });
var Xu = /:(\w+):/, Ml = () => new RegExp(`\\B${Xu.source}\\B`, "g");
function* cb(n) {
  const e = n.matchAll(Ml());
  for (const t of e) try {
    const [r, i] = t;
    yield { shortcode: r, name: i, start: t.index, end: t.index + r.length };
  } catch {
  }
}
function db(n, e) {
  return n.replaceAll(Ml(), ((t, r) => e({ shortcode: t, name: r })));
}
var Rl, Ju = {};
Zt(Ju, { useFetchImplementation: () => ub, validateGithub: () => hb });
try {
  Rl = fetch;
} catch {
}
function ub(n) {
  Rl = n;
}
async function hb(n, e, t) {
  try {
    return await (await Rl(`https://gist.github.com/${e}/${t}/raw`)).text() === `Verifying that I control the following Nostr public key: ${n}`;
  } catch {
    return !1;
  }
}
var eh = {};
Zt(eh, { decrypt: () => zl, encrypt: () => Pl, getConversationKey: () => Bl, v2: () => pb });
var th = 1, nh = 65535;
function Bl(n, e) {
  const t = Ks.getSharedSecret(n, "02" + e).subarray(1, 33);
  return n0($s, t, "nip44-v2");
}
function rh(n, e) {
  const t = r0($s, n, e, 76);
  return { chacha_key: t.subarray(0, 32), chacha_nonce: t.subarray(32, 44), hmac_key: t.subarray(44, 76) };
}
function Ul(n) {
  if (!Number.isSafeInteger(n) || n < 1) throw new Error("expected positive integer");
  if (n <= 32) return 32;
  const e = 1 << Math.floor(Math.log2(n - 1)) + 1, t = e <= 256 ? 32 : e / 8;
  return t * (Math.floor((n - 1) / t) + 1);
}
function fb(n) {
  const e = ir.encode(n), t = e.length;
  return To((function(r) {
    if (!Number.isSafeInteger(r) || r < th || r > nh) throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
    const i = new Uint8Array(2);
    return new DataView(i.buffer).setUint16(0, r, !1), i;
  })(t), e, new Uint8Array(Ul(t) - t));
}
function sh(n, e, t) {
  if (t.length !== 32) throw new Error("AAD associated data must be 32 bytes");
  const r = To(t, e);
  return Do($s, n, r);
}
function Pl(n, e, t = Rd(32)) {
  const { chacha_key: r, chacha_nonce: i, hmac_key: a } = rh(e, t), c = fb(n), d = su(r, i, c), h = sh(a, d, t);
  return fs.encode(To(new Uint8Array([2]), t, d, h));
}
function zl(n, e) {
  const { nonce: t, ciphertext: r, mac: i } = (function(h) {
    if (typeof h != "string") throw new Error("payload must be a valid string");
    const g = h.length;
    if (g < 132 || g > 87472) throw new Error("invalid payload length: " + g);
    if (h[0] === "#") throw new Error("unknown encryption version");
    let b;
    try {
      b = fs.decode(h);
    } catch (T) {
      throw new Error("invalid base64: " + T.message);
    }
    const m = b.length;
    if (m < 99 || m > 65603) throw new Error("invalid data length: " + m);
    const v = b[0];
    if (v !== 2) throw new Error("unknown encryption version " + v);
    return { nonce: b.subarray(1, 33), ciphertext: b.subarray(33, -32), mac: b.subarray(-32) };
  })(n), { chacha_key: a, chacha_nonce: c, hmac_key: d } = rh(e, t);
  if (!yl(sh(d, r, t), i)) throw new Error("invalid MAC");
  return (function(h) {
    const g = new DataView(h.buffer).getUint16(0), b = h.subarray(2, 2 + g);
    if (g < th || g > nh || b.length !== g || h.length !== 2 + Ul(g)) throw new Error("invalid padding");
    return Br.decode(b);
  })(su(a, c, r));
}
var pb = { utils: { getConversationKey: Bl, calcPaddedLen: Ul }, encrypt: Pl, decrypt: zl }, ih = {};
function gb(n) {
  const { pathname: e, searchParams: t } = new URL(n), r = e, i = t.get("relay"), a = t.get("secret");
  if (!r || !i || !a) throw new Error("invalid connection string");
  return { pubkey: r, relay: i, secret: a };
}
async function vb(n, e, t) {
  const r = { method: "pay_invoice", params: { invoice: t } }, i = await Ru(e, n, JSON.stringify(r)), a = { kind: _u, created_at: Math.round(Date.now() / 1e3), content: i, tags: [["p", n]] };
  return cr(a, e);
}
Zt(ih, { makeNwcRequestEvent: () => vb, parseConnectionString: () => gb });
var Hl, oh = {};
Zt(oh, { getZapEndpoint: () => mb, makeZapReceipt: () => xb, makeZapRequest: () => yb, useFetchImplementation: () => bb, validateZapRequest: () => wb });
try {
  Hl = fetch;
} catch {
}
function bb(n) {
  Hl = n;
}
async function mb(n) {
  try {
    let e = "", { lud06: t, lud16: r } = JSON.parse(n.content);
    if (t) {
      let { words: c } = Vs.decode(t, 1e3), d = Vs.fromWords(c);
      e = Br.decode(d);
    } else {
      if (!r) return null;
      {
        let [c, d] = r.split("@");
        e = new URL(`/.well-known/lnurlp/${c}`, `https://${d}`).toString();
      }
    }
    let i = await Hl(e), a = await i.json();
    if (a.allowsNostr && a.nostrPubkey) return a.callback;
  } catch {
  }
  return null;
}
function yb({ profile: n, event: e, amount: t, relays: r, comment: i = "" }) {
  if (!t) throw new Error("amount not given");
  if (!n) throw new Error("profile not given");
  let a = { kind: 9734, created_at: Math.round(Date.now() / 1e3), content: i, tags: [["p", n], ["amount", t.toString()], ["relays", ...r]] };
  return e && a.tags.push(["e", e]), a;
}
function wb(n) {
  let e;
  try {
    e = JSON.parse(n);
  } catch {
    return "Invalid zap request JSON.";
  }
  if (!Oo(e)) return "Zap request is not a valid Nostr event.";
  if (!Js(e)) return "Invalid signature on zap request.";
  let t = e.tags.find((([i, a]) => i === "p" && a));
  if (!t) return "Zap request doesn't have a 'p' tag.";
  if (!t[1].match(/^[a-f0-9]{64}$/)) return "Zap request 'p' tag is not valid hex.";
  let r = e.tags.find((([i, a]) => i === "e" && a));
  return r && !r[1].match(/^[a-f0-9]{64}$/) ? "Zap request 'e' tag is not valid hex." : e.tags.find((([i, a]) => i === "relays" && a)) ? null : "Zap request doesn't have a 'relays' tag.";
}
function xb({ zapRequest: n, preimage: e, bolt11: t, paidAt: r }) {
  let i = JSON.parse(n), a = i.tags.filter((([d]) => d === "e" || d === "p" || d === "a")), c = { kind: 9735, created_at: Math.round(r.getTime() / 1e3), content: "", tags: [...a, ["P", i.pubkey], ["bolt11", t], ["description", n]] };
  return e && c.tags.push(["preimage", e]), c;
}
var ah = {};
Zt(ah, { createRumor: () => hh, createSeal: () => fh, createWrap: () => ph, unwrapEvent: () => gh, unwrapManyEvents: () => Eb, wrapEvent: () => tl, wrapManyEvents: () => _b });
var lh = () => Math.round(Date.now() / 1e3), ch = () => Math.round(lh() - 172800 * Math.random()), dh = (n, e) => Bl(n, e), uh = (n, e, t) => Pl(JSON.stringify(n), dh(e, t)), Xc = (n, e) => JSON.parse(zl(n.content, dh(e, n.pubkey)));
function hh(n, e) {
  const t = { created_at: lh(), content: "", tags: [], ...n, pubkey: $l(e) };
  return t.id = Ei(t), t;
}
function fh(n, e, t) {
  return cr({ kind: pu, content: uh(n, e, t), created_at: ch(), tags: [] }, e);
}
function ph(n, e) {
  const t = du();
  return cr({ kind: wu, content: uh(n, t, e), created_at: ch(), tags: [["p", e]] }, t);
}
function tl(n, e, t) {
  return ph(fh(hh(n, e), e, t), t);
}
function _b(n, e, t) {
  if (!t || t.length === 0) throw new Error("At least one recipient is required.");
  const r = $l(e), i = [tl(n, e, r)];
  return t.forEach(((a) => {
    i.push(tl(n, e, a));
  })), i;
}
function gh(n, e) {
  const t = Xc(n, e);
  return Xc(t, e);
}
function Eb(n, e) {
  let t = [];
  return n.forEach(((r) => {
    t.push(gh(r, e));
  })), t.sort(((r, i) => r.created_at - i.created_at)), t;
}
var vh = {};
Zt(vh, { getToken: () => $b, hashPayload: () => ql, unpackEventFromToken: () => mh, validateEvent: () => $h, validateEventKind: () => wh, validateEventMethodTag: () => _h, validateEventPayloadTag: () => Eh, validateEventTimestamp: () => yh, validateEventUrlTag: () => xh, validateToken: () => kb });
var bh = "Nostr ";
async function $b(n, e, t, r = !1, i) {
  const a = { kind: Il, tags: [["u", n], ["method", e]], created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3), content: "" };
  i && a.tags.push(["payload", ql(i)]);
  const c = await t(a);
  return (r ? bh : "") + fs.encode(ir.encode(JSON.stringify(c)));
}
async function kb(n, e, t) {
  const r = await mh(n).catch(((i) => {
    throw i;
  }));
  return await $h(r, e, t).catch(((i) => {
    throw i;
  }));
}
async function mh(n) {
  if (!n) throw new Error("Missing token");
  n = n.replace(bh, "");
  const e = Br.decode(fs.decode(n));
  if (!e || e.length === 0 || !e.startsWith("{")) throw new Error("Invalid token");
  return JSON.parse(e);
}
function yh(n) {
  return !!n.created_at && Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - n.created_at < 60;
}
function wh(n) {
  return n.kind === Il;
}
function xh(n, e) {
  const t = n.tags.find(((r) => r[0] === "u"));
  return !!t && t.length > 0 && t[1] === e;
}
function _h(n, e) {
  const t = n.tags.find(((r) => r[0] === "method"));
  return !!t && t.length > 0 && t[1].toLowerCase() === e.toLowerCase();
}
function ql(n) {
  return tn($s(ir.encode(JSON.stringify(n))));
}
function Eh(n, e) {
  const t = n.tags.find(((i) => i[0] === "payload"));
  if (!t) return !1;
  const r = ql(e);
  return t.length > 0 && t[1] === r;
}
async function $h(n, e, t, r) {
  if (!Js(n)) throw new Error("Invalid nostr event, signature invalid");
  if (!wh(n)) throw new Error("Invalid nostr event, kind invalid");
  if (!yh(n)) throw new Error("Invalid nostr event, created_at timestamp invalid");
  if (!xh(n, e)) throw new Error("Invalid nostr event, url tag invalid");
  if (!_h(n, t)) throw new Error("Invalid nostr event, method tag invalid");
  if (r && typeof r == "object" && Object.keys(r).length > 0 && !Eh(n, r)) throw new Error("Invalid nostr event, payload tag does not match request body hash");
  return !0;
}
const Xe = { LIBRARIES: { decodeBolt11: vg.decode, NostrTools: Fa }, DEFAULT_OPTIONS: { theme: "light", colorMode: !0 }, BATCH_SIZE: 5, REQ_CONFIG: { INITIAL_LOAD_COUNT: 15, ADDITIONAL_LOAD_COUNT: 20 }, LOAD_TIMEOUT: 1e4, BUFFER_INTERVAL: 500, BUFFER_MIN_INTERVAL: 100, INFINITE_SCROLL: { ROOT_MARGIN: "400px", THRESHOLD: 0.1, DEBOUNCE_TIME: 500, RETRY_DELAY: 500 }, ZAP_CONFIG: { DEFAULT_LIMIT: 1, DEFAULT_COLOR_MODE: !0, ERRORS: { DIALOG_NOT_FOUND: "Zap dialog not found", BUTTON_NOT_FOUND: "Fetch button not found", DECODE_FAILED: "Failed to decode identifier" } }, ZAP_AMOUNT_CONFIG: { DEFAULT_COLOR_MODE: !0, THRESHOLDS: [{ value: 1e4, className: "zap-amount-10k" }, { value: 5e3, className: "zap-amount-5k" }, { value: 2e3, className: "zap-amount-2k" }, { value: 1e3, className: "zap-amount-1k" }, { value: 500, className: "zap-amount-500" }, { value: 200, className: "zap-amount-200" }, { value: 100, className: "zap-amount-100" }], DEFAULT_CLASS: "default-color", DISABLED_CLASS: "" }, DIALOG_CONFIG: { DEFAULT_TITLE: "To ", NO_ZAPS_MESSAGE: "No Zaps yet!<br>Send the first Zap!", DEFAULT_NO_ZAPS_DELAY: 1500, ZAP_LIST: { INITIAL_BATCH: 30, REMAINING_BATCH: 30, PROFILE_BATCH: 30, MIN_HEIGHT: "100px" } }, REQUEST_CONFIG: { METADATA_TIMEOUT: 2e4, REQUEST_TIMEOUT: 2e3, CACHE_DURATION: 3e5 }, PROFILE_CONFIG: { BATCH_SIZE: 20, BATCH_DELAY: 100, RELAYS: ["wss://relay.nostr.band", "wss://purplepag.es", "wss://relay.damus.io", "wss://nostr.wine", "wss://directory.yabu.me"] }, BATCH_CONFIG: { REFERENCE_PROCESSOR: { BATCH_SIZE: 20, BATCH_DELAY: 100 }, SUPPORTED_EVENT_KINDS: [1, 30023, 30030, 30009, 40, 42, 31990] }, BATCH_PROCESSOR_CONFIG: { DEFAULT_BATCH_SIZE: 20, DEFAULT_BATCH_DELAY: 100, DEFAULT_MAX_CACHE_AGE: 18e5, DEFAULT_RELAY_URLS: [], TIMEOUT_DURATION: 500 } };
class Ti {
  constructor(e, t, r = null) {
    this.identifier = e, this.relayUrls = t, this.isColorModeEnabled = r === null ? Xe.ZAP_CONFIG.DEFAULT_COLOR_MODE : String(r).toLowerCase() === "true";
  }
  static determineColorMode(e) {
    if (!e || !e.hasAttribute("data-zap-color-mode")) return Xe.ZAP_CONFIG.DEFAULT_COLOR_MODE;
    const t = e.getAttribute("data-zap-color-mode");
    return t.toLowerCase() !== "true" && t.toLowerCase() !== "false" || t.toLowerCase() === "true";
  }
  static fromButton(e) {
    if (!e) throw new Error(Xe.ZAP_CONFIG.ERRORS.BUTTON_NOT_FOUND);
    const t = Ti.determineColorMode(e);
    return new Ti(e.getAttribute("data-nzv-id"), e.getAttribute("data-relay-urls").split(","), t);
  }
}
class qr {
  constructor(e = 1e3) {
    this.cache = /* @__PURE__ */ new Map(), this.maxSize = e, this.accessOrder = /* @__PURE__ */ new Map();
  }
  set(e, t) {
    if (this.cache.size >= this.maxSize && !this.cache.has(e)) {
      const r = this.accessOrder.keys().next().value;
      this.cache.delete(r), this.accessOrder.delete(r);
    }
    return this.cache.set(e, t), this.accessOrder.delete(e), this.accessOrder.set(e, Date.now()), t;
  }
  get(e) {
    if (!this.cache.has(e)) return;
    const t = this.cache.get(e);
    return this.accessOrder.set(e, Date.now()), t;
  }
  has(e) {
    return this.cache.has(e);
  }
  delete(e) {
    this.cache.delete(e);
  }
  clear() {
    this.cache.clear();
  }
}
class jl extends qr {
  #e = /* @__PURE__ */ new Map();
  setProfile(e, t) {
    if (!e || !t) return;
    const r = this.get(e);
    r && r._eventCreatedAt && t._eventCreatedAt && !(t._eventCreatedAt > r._eventCreatedAt) || (this.set(e, t), this.#t(e, t));
  }
  #t(e, t) {
    this.#e.forEach(((r) => {
      try {
        r(e, t);
      } catch {
      }
    }));
  }
  subscribe(e) {
    if (typeof e != "function") return null;
    const t = Math.random().toString(36).substr(2, 9);
    return this.#e.set(t, e), () => this.#e.delete(t);
  }
  clearSubscriptions() {
    this.#e.clear();
  }
}
class Ab extends qr {
  #e = /* @__PURE__ */ new Map();
  initializeView(e) {
    this.#e.set(e, { isInitialFetchComplete: !1, lastEventTime: null, isLoading: !1, batchProcessing: !1 });
  }
  getViewState(e) {
    return this.#e.get(e) || this.initializeView(e);
  }
  updateViewState(e, t) {
    const r = this.getViewState(e);
    return this.#e.set(e, { ...r, ...t }), this.#e.get(e);
  }
  getEvents(e) {
    return this.get(e) || [];
  }
  setEvents(e, t, r = !1) {
    const i = r ? this.getEvents(e) : [], a = new Map(t.map(((d) => [d.id, d]))), c = [...i.filter(((d) => !a.has(d.id))), ...t];
    this.set(e, c);
  }
  addEvent(e, t) {
    if (!t?.id) return !1;
    const r = this.getEvents(e);
    return !this.#t(r, t) && (r.push(t), r.sort(((i, a) => a.created_at - i.created_at)), this.setEvents(e, r, !0), !0);
  }
  #t(e, t) {
    return e.some(((r) => r.id === t.id || r.kind === t.kind && r.pubkey === t.pubkey && r.content === t.content && r.created_at === t.created_at));
  }
}
class Sb extends qr {
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Map();
  async getOrFetch(e, t) {
    const r = this.get(e);
    if (r) return r;
    const i = this.#e.get(e);
    if (i) return i;
    const a = t().then(((c) => (c && this.set(e, c), this.#e.delete(e), c))).catch(((c) => (this.#e.delete(e), null)));
    return this.#e.set(e, a), a;
  }
  clearPendingFetches() {
    this.#e.clear();
  }
  setComponent(e, t) {
    this.#t.set(e, t);
  }
  getComponent(e) {
    return this.#t.get(e);
  }
  clearComponents() {
    this.#t.clear();
  }
  clear() {
    super.clear(), this.clearPendingFetches(), this.clearComponents();
  }
}
class Cb extends qr {
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Map();
  setCached(e, t, r) {
    const i = `${e}:${t}`;
    this.set(i, { stats: r, timestamp: Date.now() }), this.updateViewStats(e, r);
  }
  getCached(e, t) {
    const r = `${e}:${t}`;
    return this.get(r);
  }
  updateViewStats(e, t) {
    t && this.#e.set(e, { ...t, lastUpdate: Date.now() });
  }
  getViewStats(e) {
    return this.#e.get(e);
  }
  clearViewStats(e) {
    this.#e.delete(e);
  }
  setNoZapsState(e, t) {
    this.#t.set(e, t);
  }
  hasNoZaps(e) {
    return this.#t.get(e) || !1;
  }
  clearNoZapsState(e) {
    this.#t.delete(e);
  }
  clear() {
    super.clear(), this.#e.clear(), this.#t.clear();
  }
}
class Ib extends qr {
  hasDecoded(e) {
    return this.has(e);
  }
  setDecoded(e, t) {
    this.set(e, t);
  }
  getDecoded(e) {
    return this.get(e);
  }
}
class Tb extends qr {
  initializeLoadState(e) {
    const t = { isInitialFetchComplete: !1, lastEventTime: null, isLoading: !1, currentCount: 0 };
    return this.set(e, t), t;
  }
  getLoadState(e) {
    return this.has(e) ? this.get(e) : this.initializeLoadState(e);
  }
  updateLoadState(e, t) {
    const r = { ...this.getLoadState(e), ...t };
    return this.set(e, r), r;
  }
  canLoadMore(e) {
    const t = this.getLoadState(e);
    return t && !t.isLoading && t.lastEventTime;
  }
  updateLoadProgress(e, t) {
    const r = this.getLoadState(e);
    return r.currentCount += t, this.updateLoadState(e, { currentCount: r.currentCount }), r.currentCount;
  }
}
class Lb extends qr {
  setZapInfo(e, t) {
    this.set(e, t);
  }
  getZapInfo(e) {
    return this.get(e);
  }
  clearZapInfo(e) {
    this.delete(e);
  }
}
class Db extends jl {
  setImage(e, t) {
    e && t && this.set(e, { image: t, timestamp: Date.now() });
  }
  getImage(e) {
    return this.get(e)?.image;
  }
  hasImage(e) {
    return this.has(e);
  }
  clearExpired(e = 36e5) {
    const t = Date.now();
    for (const [r, i] of this.cache.entries()) t - i.timestamp > e && this.delete(r);
  }
}
class Ob extends jl {
  #e = /* @__PURE__ */ new Map();
  setNip05(e, t) {
    e && this.set(e, { value: t, timestamp: Date.now(), verified: !0 });
  }
  getNip05(e) {
    return this.get(e)?.value;
  }
  setPendingVerification(e, t) {
    this.#e.set(e, t);
  }
  getPendingVerification(e) {
    return this.#e.get(e);
  }
  deletePendingVerification(e) {
    this.#e.delete(e);
  }
  clearPendingVerifications() {
    this.#e.clear();
  }
  clear() {
    super.clear(), this.clearPendingVerifications();
  }
}
class $i {
  static #e = null;
  #t = null;
  #n = {};
  constructor() {
    if ($i.#e) return $i.#e;
    this.profileCache = new jl(), this.zapEventCache = new Ab(), this.referenceCache = new Sb(), this.statsCache = new Cb(), this.decodedCache = new Ib(), this.loadStateCache = new Tb(), this.zapInfoCache = new Lb(), this.imageCache = new Db(), this.nip05Cache = new Ob(), this.nip05PendingCache = new qr(), this.#n = ["zapInfo", "uiComponent", "decoded", "nip05", "nip05PendingFetches", "zapLoadStates", "imageCache", "isEventIdentifier"].reduce(((e, t) => (e[t] = new qr(), e)), {}), this.viewStats = /* @__PURE__ */ new Map(), this.viewStates = /* @__PURE__ */ new Map(), $i.#e = this;
  }
  setProfile(e, t) {
    return this.profileCache.setProfile(e, t);
  }
  getProfile(e) {
    return this.profileCache.get(e);
  }
  subscribeToProfileUpdates(e) {
    return this.profileCache.subscribe(e);
  }
  initializeZapView(e) {
    return this.zapEventCache.initializeView(e);
  }
  getZapEvents(e) {
    return this.zapEventCache.getEvents(e);
  }
  setZapEvents(e, t, r) {
    return this.zapEventCache.setEvents(e, t, r);
  }
  addZapEvent(e, t) {
    return this.zapEventCache.addEvent(e, t);
  }
  getZapViewState(e) {
    return this.zapEventCache.getViewState(e);
  }
  updateZapViewState(e, t) {
    return this.zapEventCache.updateViewState(e, t);
  }
  setReference(e, t) {
    return this.referenceCache.set(e, t);
  }
  getReference(e) {
    return this.referenceCache.get(e);
  }
  getOrFetchReference(e, t) {
    return this.referenceCache.getOrFetch(e, t);
  }
  getReferenceComponent(e) {
    return this.referenceCache.getComponent(e);
  }
  setReferenceComponent(e, t) {
    return this.referenceCache.setComponent(e, t);
  }
  getCachedStats(e, t) {
    return this.statsCache.getCached(e, t);
  }
  updateStatsCache(e, t, r) {
    this.statsCache.setCached(e, t, r), this.statsCache.updateViewStats(e, r);
  }
  getViewStats(e) {
    return this.statsCache.getViewStats(e);
  }
  setNoZapsState(e, t) {
    return this.statsCache.setNoZapsState(e, t);
  }
  hasNoZaps(e) {
    return this.statsCache.hasNoZaps(e);
  }
  async processCachedData(e, t) {
    this.setRelayUrls(t.relayUrls);
    const r = this.getZapEvents(e), i = r.some(((a) => this.getReference(a.id)));
    return { stats: (await Promise.all([this.getCachedStats(e, t.identifier)]))[0], hasEnoughCachedEvents: r.length >= Xe.REQ_CONFIG.INITIAL_LOAD_COUNT, hasReferences: i };
  }
  hasDecoded(e) {
    return this.decodedCache.hasDecoded(e);
  }
  setDecoded(e, t) {
    return this.decodedCache.setDecoded(e, t);
  }
  getDecoded(e) {
    return this.decodedCache.getDecoded(e);
  }
  initializeLoadState(e) {
    return this.loadStateCache.initializeLoadState(e);
  }
  getLoadState(e) {
    return this.loadStateCache.getLoadState(e);
  }
  updateLoadState(e, t) {
    return this.loadStateCache.updateLoadState(e, t);
  }
  canLoadMore(e) {
    return this.loadStateCache.canLoadMore(e);
  }
  updateLoadProgress(e, t) {
    return this.loadStateCache.updateLoadProgress(e, t);
  }
  setZapInfo(e, t) {
    return this.zapInfoCache.setZapInfo(e, t);
  }
  getZapInfo(e) {
    return this.zapInfoCache.getZapInfo(e);
  }
  clearZapInfo(e) {
    return this.zapInfoCache.clearZapInfo(e);
  }
  setImageCache(e, t) {
    return this.imageCache.setImage(e, t);
  }
  getImageCache(e) {
    return this.imageCache.getImage(e);
  }
  hasImageCache(e) {
    return this.imageCache.hasImage(e);
  }
  setNip05(e, t) {
    return this.nip05Cache.setNip05(e, t);
  }
  getNip05(e) {
    return this.nip05Cache.getNip05(e);
  }
  setNip05PendingFetch(e, t) {
    this.nip05Cache.setPendingVerification(e, t);
  }
  getNip05PendingFetch(e) {
    return this.nip05Cache.getPendingVerification(e);
  }
  deleteNip05PendingFetch(e) {
    this.nip05Cache.deletePendingVerification(e);
  }
  getOrCreateViewState(e, t = {}) {
    return this.viewStates.has(e) || this.viewStates.set(e, { currentStats: null, ...t }), this.viewStates.get(e);
  }
  getViewState(e) {
    return this.getOrCreateViewState(e);
  }
  updateViewState(e, t) {
    const r = this.getOrCreateViewState(e);
    return this.viewStates.set(e, { ...r, ...t }), this.viewStates.get(e);
  }
  setCacheItem(e, t, r) {
    const i = this.#n[e];
    return i && t !== void 0 ? i.set(t, r) : null;
  }
  getCacheItem(e, t) {
    const r = this.#n[e];
    return r && t !== void 0 ? r.get(t) : null;
  }
  setRelayUrls(e) {
    this.#t = e;
  }
  getRelayUrls() {
    return this.#t;
  }
  clearAll() {
    this.profileCache.clear(), this.profileCache.clearSubscriptions(), this.zapEventCache.clear(), this.referenceCache.clear(), this.referenceCache.clearPendingFetches(), this.referenceCache.clearComponents(), this.statsCache.clear(), this.decodedCache.clear(), this.loadStateCache.clear(), this.zapInfoCache.clear(), this.imageCache.clear(), this.nip05Cache.clear(), this.nip05Cache.clearPendingVerifications(), Object.values(this.#n).forEach(((e) => e.clear())), this.viewStats.clear(), this.viewStates.clear();
  }
}
const Ne = new $i(), Jc = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMDYuMzMgMjA2LjMzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICA8ZGVmcz4KICAgICAgPHN0eWxlPgogICAgICAgICAuY2xzLTEgewogICAgICAgICAgICBmaWxsOiBub25lOwogICAgICAgICB9CgogICAgICAgICAuY2xzLTIgewogICAgICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgICB9CgogICAgICAgICAuY2xzLTMgewogICAgICAgICAgICBmaWxsOiAjNjY2OwogICAgICAgICB9CiAgICAgIDwvc3R5bGU+CiAgIDwvZGVmcz4KICAgPHBhdGggY2xhc3M9ImNscy0yIgogICAgICBkPSJtMjA2LjMzIDEzNC4zOWMwIDIwLjcxIDAgMzEuMDctMy41MyA0Mi4yMi00LjQzIDEyLjE3LTE0LjAyIDIxLjc2LTI2LjE5IDI2LjE5LTExLjE1IDMuNTMtMjEuNSAzLjUzLTQyLjIyIDMuNTNoLTYyLjQ2Yy0yMC43MSAwLTMxLjA2IDAtNDIuMjEtMy41My0xMi4xNy00LjQzLTIxLjc2LTE0LjAyLTI2LjE5LTI2LjE5LTMuNTMtMTEuMTUtMy41My0yMS41LTMuNTMtNDIuMjJ2LTYyLjQ2YzAtMjAuNzEgMC0zMS4wNyAzLjUzLTQyLjIyIDQuNDMtMTIuMTcgMTQuMDItMjEuNzYgMjYuMTktMjYuMTkgMTEuMTUtMy41MiAyMS41LTMuNTIgNDIuMjEtMy41Mmg2Mi40NmMyMC43MSAwIDMxLjA3IDAgNDIuMjIgMy41MiAxMi4xNyA0LjQzIDIxLjc2IDE0LjAyIDI2LjE5IDI2LjE5IDMuNTMgMTEuMTUgMy41MyAyMS41IDMuNTMgNDIuMjJ6IiAvPgogICA8cGF0aCBjbGFzcz0iY2xzLTMiCiAgICAgIGQ9Im0xODUuOTggOTEuMXY4My4yM2MwIDMuMTMtMi41NCA1LjY3LTUuNjcgNS42N2gtNjguMDRjLTMuMTMgMC01LjY3LTIuNTQtNS42Ny01LjY3di0xNS41YzAuMzEtMTkgMi4zMi0zNy4yIDYuNTQtNDUuNDggMi41My00Ljk4IDYuNy03LjY5IDExLjQ5LTkuMTQgOS4wNS0yLjcyIDI0LjkzLTAuODYgMzEuNjctMS4xOCAwIDAgMjAuMzYgMC44MSAyMC4zNi0xMC43MiAwLTkuMjgtOS4xLTguNTUtOS4xLTguNTUtMTAuMDMgMC4yNi0xNy42Ny0wLjQyLTIyLjYyLTIuMzctOC4yOS0zLjI2LTguNTctOS4yNC04LjYtMTEuMjQtMC40MS0yMy4xLTM0LjQ3LTI1Ljg3LTY0LjQ4LTIwLjE0LTMyLjgxIDYuMjQgMC4zNiA1My4yNyAwLjM2IDExNi4wNXY4LjM4Yy0wLjA2IDMuMDgtMi41NSA1LjU3LTUuNjUgNS41N2gtMzMuNjljLTMuMTMgMC01LjY3LTIuNTQtNS42Ny01LjY3di0xNDMuOTVjMC0zLjEzIDIuNTQtNS42NyA1LjY3LTUuNjdoMzEuNjdjMy4xMyAwIDUuNjcgMi41NCA1LjY3IDUuNjcgMCA0LjY1IDUuMjMgNy4yNCA5LjAxIDQuNTMgMTEuMzktOC4xNiAyNi4wMS0xMi41MSA0Mi4zNy0xMi41MSAzNi42NSAwIDY0LjM2IDIxLjM2IDY0LjM2IDY4LjY5em0tNjAuODQtMTYuODljMC02LjctNS40My0xMi4xMy0xMi4xMy0xMi4xM3MtMTIuMTMgNS40My0xMi4xMyAxMi4xMyA1LjQzIDEyLjEzIDEyLjEzIDEyLjEzIDEyLjEzLTUuNDMgMTIuMTMtMTIuMTN6IiAvPgo8L3N2Zz4=", Nb = (n) => typeof n == "string" && n.length > 0, Mb = (n) => {
  try {
    return window.NostrTools.nip19.decode(n);
  } catch {
    return null;
  }
}, Rb = (n, e, t) => {
  const r = { npub: () => ({ kinds: [9735], "#p": [e] }), note: () => ({ kinds: [9735], "#e": [e] }), nprofile: () => ({ kinds: [9735], "#p": [e.pubkey] }), nevent: () => ({ kinds: [9735], "#e": [e.id] }), naddr: () => ({ kinds: [9735], "#a": [`${e.kind}:${e.pubkey}:${e.identifier}`] }) }[n];
  if (!r) return null;
  const i = r();
  return i.limit = t ? Xe.REQ_CONFIG.ADDITIONAL_LOAD_COUNT : Xe.REQ_CONFIG.INITIAL_LOAD_COUNT, t && (i.until = t), { req: i };
};
function ed(n, e = null) {
  const t = `${n}:${e}`;
  if (Ne.hasDecoded(t)) return Ne.getDecoded(t);
  if (!Nb(n)) throw new Error(Xe.ZAP_CONFIG.ERRORS.DECODE_FAILED);
  const r = Mb(n);
  if (!r) return null;
  const i = Rb(r.type, r.data, e);
  return i && Ne.setDecoded(t, i), i;
}
function kh(n) {
  return n?.display_name || n?.name || "nameless";
}
async function Bb(n, e) {
  if (!n || !e) return null;
  try {
    return (await window.NostrTools.nip05.queryProfile(n))?.pubkey === e ? n : null;
  } catch {
    return null;
  }
}
function ao(n) {
  return new Intl.NumberFormat().format(n);
}
function Ah(n) {
  if (!n || typeof n != "string") return "unknown";
  try {
    return `${window.NostrTools.nip19.decode(n).type.toLowerCase()}1${n.slice(5, 11)}...${n.slice(-4)}`;
  } catch {
    return "unknown";
  }
}
function Hs(n) {
  const e = document.createElement("div");
  return e.textContent = n, e.innerHTML;
}
function Ub(n) {
  try {
    return window.NostrTools.nip19.npubEncode(n);
  } catch {
    return null;
  }
}
function Ws(n) {
  if (!n || typeof n != "string") return !1;
  const e = `isEventIdentifier:${n}`, t = Ne.getCacheItem("isEventIdentifier", e);
  if (t !== void 0) return t;
  const r = n.startsWith("note1") || n.startsWith("nevent1") || n.startsWith("naddr1");
  return Ne.setCacheItem("isEventIdentifier", e, r), r;
}
async function Pb(n) {
  const { pubkey: e, content: t } = (function(i) {
    const a = i.tags.find(((c) => c[0] === "description"))?.[1];
    if (!a) return { pubkey: null, content: "" };
    try {
      const c = zb(a);
      let d;
      try {
        d = JSON.parse(c);
      } catch {
        const g = c.match(/"pubkey"\s*:\s*"([^"]+)"|"content"\s*:\s*"([^"]+)"/g);
        if (!g) throw new Error("Invalid JSON structure");
        d = {}, g.forEach(((b) => {
          const [m, v] = b.split(":").map(((T) => T.trim().replace(/"/g, "")));
          d[m] = v;
        }));
      }
      let h = null;
      return d.pubkey && (h = typeof d.pubkey == "string" ? d.pubkey : String(d.pubkey)), { pubkey: h, content: typeof d.content == "string" ? d.content.trim() : "" };
    } catch {
      return { pubkey: null, content: "" };
    }
  })(n), r = await (async function(i) {
    const a = i.tags.find(((c) => c[0].toLowerCase() === "bolt11"))?.[1];
    if (!a) return "Amount: Unknown";
    try {
      const c = window.decodeBolt11(a), d = c.sections.find(((h) => h.name === "amount"))?.value;
      return d ? `${ao(Math.floor(d / 1e3))} sats` : "Amount: Unknown";
    } catch {
      return "Amount: Unknown";
    }
  })(n);
  return { pubkey: e, content: t, satsText: r };
}
function td(n) {
  try {
    return window.NostrTools.nip19.decode(n);
  } catch {
    return null;
  }
}
function zb(n) {
  return n.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").replace(/\\\\/g, "\\").replace(/\\(?!(["\\\/bfnrt]|u[0-9a-fA-F]{4}))/g, "").replace(/\\+(["\\/bfnrt])/g, "\\$1").replace(/\\u(?![0-9a-fA-F]{4})/g, "");
}
class Hb {
  constructor(e) {
    this.root = e;
  }
  displayStats(e) {
    requestAnimationFrame((() => {
      const t = this.root?.querySelector(".zap-stats");
      if (t) try {
        let r;
        r = e ? e.skeleton ? this.#e() : e.error ? this.createTimeoutStats() : this.createNormalStats(e) : this.createTimeoutStats(), t.innerHTML = r;
      } catch {
        t.innerHTML = this.createTimeoutStats();
      }
    }));
  }
  #e() {
    return `
      <div class="stats-item">Total Count</div>
      <div class="stats-item"><span class="number skeleton">...</span></div>
      <div class="stats-item">times</div>
      <div class="stats-item">Total Amount</div>
      <div class="stats-item"><span class="number skeleton">...</span></div>
      <div class="stats-item">sats</div>
      <div class="stats-item">Max Amount</div>
      <div class="stats-item"><span class="number skeleton">...</span></div>
      <div class="stats-item">sats</div>
    `;
  }
  createTimeoutStats() {
    return `
      <div class="stats-item">Total Count</div>
      <div class="stats-item"><span class="number text-muted">nostr.band</span></div>
      <div class="stats-item">times</div>
      <div class="stats-item">Total Amount</div>
      <div class="stats-item"><span class="number text-muted">Stats</span></div>
      <div class="stats-item">sats</div>
      <div class="stats-item">Max Amount</div>
      <div class="stats-item"><span class="number text-muted">Unavailable</span></div>
      <div class="stats-item">sats</div>
    `;
  }
  createNormalStats(e) {
    return `
      <div class="stats-item">Total Count</div>
      <div class="stats-item"><span class="number">${ao(e.count)}</span></div>
      <div class="stats-item">times</div>
      <div class="stats-item">Total Amount</div>
      <div class="stats-item"><span class="number">${ao(Math.floor(e.msats / 1e3))}</span></div>
      <div class="stats-item">sats</div>
      <div class="stats-item">Max Amount</div>
      <div class="stats-item"><span class="number">${ao(Math.floor(e.maxMsats / 1e3))}</span></div>
      <div class="stats-item">sats</div>
    `;
  }
}
class Fl {
  constructor(e = {}) {
    this._validateOptions(e), this._initializeProperties(e);
  }
  _validateOptions(e) {
    if (!e.pool?.ensureRelay) throw new Error("Invalid pool object: ensureRelay method is required");
  }
  _initializeProperties(e) {
    this.pool = e.pool, this.batchSize = e.batchSize || Xe.BATCH_PROCESSOR_CONFIG.DEFAULT_BATCH_SIZE, this.batchDelay = e.batchDelay || Xe.BATCH_PROCESSOR_CONFIG.DEFAULT_BATCH_DELAY, this.relayUrls = e.relayUrls || Xe.BATCH_PROCESSOR_CONFIG.DEFAULT_RELAY_URLS, this.batchQueue = /* @__PURE__ */ new Set(), this.pendingFetches = /* @__PURE__ */ new Map(), this.resolvers = /* @__PURE__ */ new Map(), this.processingItems = /* @__PURE__ */ new Set(), this.batchTimer = null, this.eventCache = /* @__PURE__ */ new Map(), this.maxCacheAge = e.maxCacheAge || Xe.BATCH_PROCESSOR_CONFIG.DEFAULT_MAX_CACHE_AGE;
  }
  getOrCreateFetchPromise(e) {
    if (this.pendingFetches.has(e)) return this.pendingFetches.get(e);
    const t = new Promise(((r) => {
      this.resolvers.set(e, r);
    }));
    return this.pendingFetches.set(e, t), this.batchQueue.add(e), this._scheduleBatchProcess(), t;
  }
  _scheduleBatchProcess() {
    this.batchTimer || (this.batchTimer = setTimeout((() => {
      this.batchTimer = null, this._processBatchQueue();
    }), this.batchDelay));
  }
  async _processBatchQueue() {
    if (this.batchQueue.size === 0) return;
    const e = this._getBatchItems();
    await this._processBatch(e), this.batchQueue.size > 0 && this._scheduleBatchProcess();
  }
  _getBatchItems() {
    const e = Array.from(this.batchQueue).slice(0, this.batchSize);
    return e.forEach(((t) => {
      this.batchQueue.delete(t), this.processingItems.add(t);
    })), e;
  }
  async _processBatch(e) {
    try {
      await this.onBatchProcess(e);
    } catch (t) {
      this._handleBatchError(e, t);
    } finally {
      this._cleanupBatchItems(e);
    }
  }
  _handleBatchError(e, t) {
    e.forEach(((r) => this.resolveItem(r, null)));
  }
  _cleanupBatchItems(e) {
    e.forEach(((t) => {
      this.processingItems.delete(t), this.pendingFetches.delete(t), this.resolvers.delete(t);
    }));
  }
  resolveItem(e, t) {
    const r = this.resolvers.get(e);
    r && (r(t), this.resolvers.delete(e));
  }
  async onBatchProcess(e) {
    throw new Error("onBatchProcess must be implemented by derived class");
  }
  onBatchError(e, t) {
    e.forEach(((r) => this.resolveItem(r, null)));
  }
  _cleanup(e, t, r, i) {
    clearTimeout(e), t && t.close(), r.forEach(((a) => {
      !i.has(a) && this.resolvers.has(a) && this.resolveItem(a, null);
    }));
  }
  _getSubscriptionPool() {
    return this.pool;
  }
  async _createSubscriptionPromise(e, t, r, i) {
    if (t?.length) return new Promise(((a) => {
      const c = /* @__PURE__ */ new Set(), d = Xe.BATCH_PROCESSOR_CONFIG.TIMEOUT_DURATION;
      let h, g, b = !1;
      const m = () => {
        b || (b = !0, h && clearTimeout(h), g && g.close(), e.forEach(((v) => {
          c.has(v) || this.resolveItem(v, null);
        })), a());
      };
      g = this.pool.subscribeMany(t, r, { onevent: (v) => {
        try {
          b || (i(v, c), c.size === e.length && m());
        } catch {
        }
      }, oneose: () => {
        setTimeout(m, 100);
      }, onerror: (v) => {
      } }), h = setTimeout((() => {
        b || m();
      }), d);
    }));
    e.forEach(((a) => this.resolveItem(a, null)));
  }
  setRelayUrls(e) {
    this.relayUrls = Array.isArray(e) ? e : [];
  }
  getCachedItem(e) {
    const t = this.eventCache.get(e);
    return this._isValidCache(t) ? t.event : (this.eventCache.delete(e), null);
  }
  _isValidCache(e) {
    return !!e && Date.now() - e.timestamp <= this.maxCacheAge;
  }
  setCachedItem(e, t) {
    this.eventCache.set(e, { event: t, timestamp: Date.now() });
  }
}
class qb extends Fl {
  constructor(e = {}) {
    super(e);
  }
  async onBatchProcess(e) {
    if (!e?.length) return;
    const t = [{ ids: e.slice(0, this.batchSize) }];
    await this._createSubscriptionPromise(e, this.relayUrls, t, ((r, i) => {
      if (e.includes(r.id)) {
        const a = this.getCachedItem(r.id);
        (!a || r.created_at > a.created_at) && (this.setCachedItem(r.id, r), this.resolveItem(r.id, r), i.add(r.id));
      }
    }));
  }
}
class jb extends Fl {
  constructor(e = {}) {
    super(e);
  }
  _parseAtagValue(e) {
    const t = e.split(":");
    return t.length !== 3 ? null : { kind: parseInt(t[0]), pubkey: t[1], identifier: t[2] };
  }
  async onBatchProcess(e) {
    if (!e?.length) return;
    const t = [], r = { kinds: [], authors: [], "#d": [] };
    if (e.slice(0, this.batchSize).forEach(((a) => {
      const c = this._parseAtagValue(a);
      c ? (r.kinds.push(c.kind), r.authors.push(c.pubkey), r["#d"].push(c.identifier), t.push(a)) : this.resolveItem(a, null);
    })), t.length === 0) return;
    const i = [r];
    await this._createSubscriptionPromise(t, this.relayUrls, i, ((a, c) => {
      const d = t.find(((h) => {
        const g = this._parseAtagValue(h);
        return g && a.kind === g.kind && a.pubkey === g.pubkey && a.tags.some(((b) => b[0] === "d" && b[1] === g.identifier));
      }));
      if (d) {
        const h = this.getCachedItem(d);
        (!h || a.created_at > h.created_at) && (this.setCachedItem(d, a), this.resolveItem(d, a), c.add(d));
      }
    }));
  }
}
class Fb extends Fl {
  constructor(e = {}) {
    const { simplePool: t, config: r } = e;
    super({ pool: t, batchSize: r.BATCH_SIZE || Xe.PROFILE_CONFIG.BATCH_SIZE, batchDelay: r.BATCH_DELAY || Xe.PROFILE_CONFIG.BATCH_DELAY, relayUrls: r.RELAYS || Xe.PROFILE_CONFIG.RELAYS, maxCacheAge: Xe.BATCH_PROCESSOR_CONFIG.DEFAULT_MAX_CACHE_AGE }), this.config = r;
  }
  async onBatchProcess(e) {
    if (!this.config.RELAYS?.length) throw new Error("No relays configured for profile fetch");
    const t = e.filter(((c) => {
      const d = this.getCachedItem(c);
      return !d || (this.resolveItem(c, d), !1);
    }));
    if (t.length === 0) return;
    const r = [{ kinds: [0], authors: t }], i = /* @__PURE__ */ new Map(), a = (c, d) => {
      const h = i.get(c.pubkey);
      (!h || c.created_at > h.created_at) && (i.set(c.pubkey, c), this.setCachedItem(c.pubkey, c)), d.add(c.pubkey);
    };
    try {
      await this._createSubscriptionPromise(t, this.config.RELAYS, r, a), t.forEach(((c) => {
        const d = i.get(c);
        this.resolveItem(c, d || null);
      }));
    } catch (c) {
      this.onBatchError(e, c);
    }
  }
}
var ws = Symbol("verified");
function Zb(n) {
  if (!(n instanceof Object) || typeof n.kind != "number" || typeof n.content != "string" || typeof n.created_at != "number" || typeof n.pubkey != "string" || !n.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(n.tags)) return !1;
  for (let e = 0; e < n.tags.length; e++) {
    let t = n.tags[e];
    if (!Array.isArray(t)) return !1;
    for (let r = 0; r < t.length; r++) if (typeof t[r] == "object") return !1;
  }
  return !0;
}
new TextDecoder("utf-8");
var Vb = new TextEncoder();
function _i(n) {
  n.indexOf("://") === -1 && (n = "wss://" + n);
  let e = new URL(n);
  return e.pathname = e.pathname.replace(/\/+/g, "/"), e.pathname.endsWith("/") && (e.pathname = e.pathname.slice(0, -1)), (e.port === "80" && e.protocol === "ws:" || e.port === "443" && e.protocol === "wss:") && (e.port = ""), e.searchParams.sort(), e.hash = "", e.toString();
}
var Gb = class {
  value;
  next = null;
  prev = null;
  constructor(n) {
    this.value = n;
  }
}, Wb = class {
  first;
  last;
  constructor() {
    this.first = null, this.last = null;
  }
  enqueue(n) {
    const e = new Gb(n);
    return this.last ? this.last === this.first ? (this.last = e, this.last.prev = this.first, this.first.next = e) : (e.prev = this.last, this.last.next = e, this.last = e) : (this.first = e, this.last = e), !0;
  }
  dequeue() {
    if (!this.first) return null;
    if (this.first === this.last) {
      const e = this.first;
      return this.first = null, this.last = null, e.value;
    }
    const n = this.first;
    return this.first = n.next, n.value;
  }
};
function Pa(n) {
  return tn($s(Vb.encode((function(e) {
    if (!Zb(e)) throw new Error("can't serialize event with wrong or missing properties");
    return JSON.stringify([0, e.pubkey, e.created_at, e.kind, e.tags, e.content]);
  })(n))));
}
var oo = new class {
  generateSecretKey() {
    return _r.utils.randomPrivateKey();
  }
  getPublicKey(n) {
    return tn(_r.getPublicKey(n));
  }
  finalizeEvent(n, e) {
    const t = n;
    return t.pubkey = tn(_r.getPublicKey(e)), t.id = Pa(t), t.sig = tn(_r.sign(Pa(t), e)), t[ws] = !0, t;
  }
  verifyEvent(n) {
    if (typeof n[ws] == "boolean") return n[ws];
    const e = Pa(n);
    if (e !== n.id) return n[ws] = !1, !1;
    try {
      const t = _r.verify(n.sig, e, n.pubkey);
      return n[ws] = t, t;
    } catch {
      return n[ws] = !1, !1;
    }
  }
}(), Kb = (oo.generateSecretKey, oo.getPublicKey, oo.finalizeEvent, oo.verifyEvent);
function Qb(n, e) {
  if (n.ids && n.ids.indexOf(e.id) === -1 || n.kinds && n.kinds.indexOf(e.kind) === -1 || n.authors && n.authors.indexOf(e.pubkey) === -1) return !1;
  for (let t in n) if (t[0] === "#") {
    let r = n[`#${t.slice(1)}`];
    if (r && !e.tags.find((([i, a]) => i === t.slice(1) && r.indexOf(a) !== -1))) return !1;
  }
  return !(n.since && e.created_at < n.since) && !(n.until && e.created_at > n.until);
}
async function Yb() {
  return new Promise(((n) => {
    const e = new MessageChannel(), t = () => {
      e.port1.removeEventListener("message", t), n();
    };
    e.port1.addEventListener("message", t), e.port2.postMessage(0), e.port1.start();
  }));
}
var Sh, Xb = (n) => (n[ws] = !0, !0), Ch = class {
  url;
  _connected = !1;
  onclose = null;
  onnotice = (n) => {
  };
  _onauth = null;
  baseEoseTimeout = 4400;
  connectionTimeout = 4400;
  publishTimeout = 4400;
  openSubs = /* @__PURE__ */ new Map();
  connectionTimeoutHandle;
  connectionPromise;
  openCountRequests = /* @__PURE__ */ new Map();
  openEventPublishes = /* @__PURE__ */ new Map();
  ws;
  incomingMessageQueue = new Wb();
  queueRunning = !1;
  challenge;
  serial = 0;
  verifyEvent;
  _WebSocket;
  constructor(n, e) {
    this.url = _i(n), this.verifyEvent = e.verifyEvent, this._WebSocket = e.websocketImplementation || WebSocket;
  }
  static async connect(n, e) {
    const t = new Ch(n, e);
    return await t.connect(), t;
  }
  closeAllSubscriptions(n) {
    for (let [e, t] of this.openSubs) t.close(n);
    this.openSubs.clear();
    for (let [e, t] of this.openEventPublishes) t.reject(new Error(n));
    this.openEventPublishes.clear();
    for (let [e, t] of this.openCountRequests) t.reject(new Error(n));
    this.openCountRequests.clear();
  }
  get connected() {
    return this._connected;
  }
  async connect() {
    return this.connectionPromise || (this.challenge = void 0, this.connectionPromise = new Promise(((n, e) => {
      this.connectionTimeoutHandle = setTimeout((() => {
        e("connection timed out"), this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection timed out");
      }), this.connectionTimeout);
      try {
        this.ws = new this._WebSocket(this.url);
      } catch (t) {
        return void e(t);
      }
      this.ws.onopen = () => {
        clearTimeout(this.connectionTimeoutHandle), this._connected = !0, n();
      }, this.ws.onerror = (t) => {
        e(t.message || "websocket error"), this._connected && (this._connected = !1, this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection errored"));
      }, this.ws.onclose = async () => {
        this._connected && (this._connected = !1, this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection closed"));
      }, this.ws.onmessage = this._onmessage.bind(this);
    }))), this.connectionPromise;
  }
  async runQueue() {
    for (this.queueRunning = !0; this.handleNext() !== !1; ) await Yb();
    this.queueRunning = !1;
  }
  handleNext() {
    const n = this.incomingMessageQueue.dequeue();
    if (!n) return !1;
    const e = (function(t) {
      let r = t.slice(0, 22).indexOf('"EVENT"');
      if (r === -1) return null;
      let i = t.slice(r + 7 + 1).indexOf('"');
      if (i === -1) return null;
      let a = r + 7 + 1 + i, c = t.slice(a + 1, 80).indexOf('"');
      if (c === -1) return null;
      let d = a + 1 + c;
      return t.slice(a + 1, d);
    })(n);
    if (e) {
      const t = this.openSubs.get(e);
      if (!t) return;
      const r = (function(a, c) {
        let d = c.length + 3, h = a.indexOf(`"${c}":`) + d, g = a.slice(h).indexOf('"') + h + 1;
        return a.slice(g, g + 64);
      })(n, "id"), i = t.alreadyHaveEvent?.(r);
      if (t.receivedEvent?.(this, r), i) return;
    }
    try {
      let t = JSON.parse(n);
      switch (t[0]) {
        case "EVENT": {
          const r = this.openSubs.get(t[1]), i = t[2];
          return void (this.verifyEvent(i) && (function(a, c) {
            for (let d = 0; d < a.length; d++) if (Qb(a[d], c)) return !0;
            return !1;
          })(r.filters, i) && r.onevent(i));
        }
        case "COUNT": {
          const r = t[1], i = t[2], a = this.openCountRequests.get(r);
          return void (a && (a.resolve(i.count), this.openCountRequests.delete(r)));
        }
        case "EOSE": {
          const r = this.openSubs.get(t[1]);
          return r ? void r.receivedEose() : void 0;
        }
        case "OK": {
          const r = t[1], i = t[2], a = t[3], c = this.openEventPublishes.get(r);
          return void (c && (i ? c.resolve(a) : c.reject(new Error(a)), this.openEventPublishes.delete(r)));
        }
        case "CLOSED": {
          const r = t[1], i = this.openSubs.get(r);
          return i ? (i.closed = !0, void i.close(t[2])) : void 0;
        }
        case "NOTICE":
          return void this.onnotice(t[1]);
        case "AUTH":
          return this.challenge = t[1], void this._onauth?.(t[1]);
      }
    } catch {
      return;
    }
  }
  async send(n) {
    if (!this.connectionPromise) throw new Error("sending on closed connection");
    this.connectionPromise.then((() => {
      this.ws?.send(n);
    }));
  }
  async auth(n) {
    if (!this.challenge) throw new Error("can't perform auth, no challenge was received");
    const e = await n((function(r, i) {
      return { kind: 22242, created_at: Math.floor(Date.now() / 1e3), tags: [["relay", r], ["challenge", i]], content: "" };
    })(this.url, this.challenge)), t = new Promise(((r, i) => {
      this.openEventPublishes.set(e.id, { resolve: r, reject: i });
    }));
    return this.send('["AUTH",' + JSON.stringify(e) + "]"), t;
  }
  async publish(n) {
    const e = new Promise(((t, r) => {
      this.openEventPublishes.set(n.id, { resolve: t, reject: r });
    }));
    return this.send('["EVENT",' + JSON.stringify(n) + "]"), setTimeout((() => {
      const t = this.openEventPublishes.get(n.id);
      t && (t.reject(new Error("publish timed out")), this.openEventPublishes.delete(n.id));
    }), this.publishTimeout), e;
  }
  async count(n, e) {
    this.serial++;
    const t = e?.id || "count:" + this.serial, r = new Promise(((i, a) => {
      this.openCountRequests.set(t, { resolve: i, reject: a });
    }));
    return this.send('["COUNT","' + t + '",' + JSON.stringify(n).substring(1)), r;
  }
  subscribe(n, e) {
    const t = this.prepareSubscription(n, e);
    return t.fire(), t;
  }
  prepareSubscription(n, e) {
    this.serial++;
    const t = e.id || "sub:" + this.serial, r = new Jb(this, t, n, e);
    return this.openSubs.set(t, r), r;
  }
  close() {
    this.closeAllSubscriptions("relay connection closed by us"), this._connected = !1, this.ws?.close();
  }
  _onmessage(n) {
    this.incomingMessageQueue.enqueue(n.data), this.queueRunning || this.runQueue();
  }
}, Jb = class {
  relay;
  id;
  closed = !1;
  eosed = !1;
  filters;
  alreadyHaveEvent;
  receivedEvent;
  onevent;
  oneose;
  onclose;
  eoseTimeout;
  eoseTimeoutHandle;
  constructor(n, e, t, r) {
    this.relay = n, this.filters = t, this.id = e, this.alreadyHaveEvent = r.alreadyHaveEvent, this.receivedEvent = r.receivedEvent, this.eoseTimeout = r.eoseTimeout || n.baseEoseTimeout, this.oneose = r.oneose, this.onclose = r.onclose, this.onevent = r.onevent || ((i) => {
    });
  }
  fire() {
    this.relay.send('["REQ","' + this.id + '",' + JSON.stringify(this.filters).substring(1)), this.eoseTimeoutHandle = setTimeout(this.receivedEose.bind(this), this.eoseTimeout);
  }
  receivedEose() {
    this.eosed || (clearTimeout(this.eoseTimeoutHandle), this.eosed = !0, this.oneose?.());
  }
  close(n = "closed by caller") {
    !this.closed && this.relay.connected && (this.relay.send('["CLOSE",' + JSON.stringify(this.id) + "]"), this.closed = !0), this.relay.openSubs.delete(this.id), this.onclose?.(n);
  }
}, e1 = class {
  relays = /* @__PURE__ */ new Map();
  seenOn = /* @__PURE__ */ new Map();
  trackRelays = !1;
  verifyEvent;
  trustedRelayURLs = /* @__PURE__ */ new Set();
  _WebSocket;
  constructor(n) {
    this.verifyEvent = n.verifyEvent, this._WebSocket = n.websocketImplementation;
  }
  async ensureRelay(n, e) {
    n = _i(n);
    let t = this.relays.get(n);
    return t || (t = new Ch(n, { verifyEvent: this.trustedRelayURLs.has(n) ? Xb : this.verifyEvent, websocketImplementation: this._WebSocket }), e?.connectionTimeout && (t.connectionTimeout = e.connectionTimeout), this.relays.set(n, t)), await t.connect(), t;
  }
  close(n) {
    n.map(_i).forEach(((e) => {
      this.relays.get(e)?.close();
    }));
  }
  subscribeMany(n, e, t) {
    return this.subscribeManyMap(Object.fromEntries(n.map(((r) => [r, e]))), t);
  }
  subscribeManyMap(n, e) {
    this.trackRelays && (e.receivedEvent = (m, v) => {
      let T = this.seenOn.get(v);
      T || (T = /* @__PURE__ */ new Set(), this.seenOn.set(v, T)), T.add(m);
    });
    const t = /* @__PURE__ */ new Set(), r = [], i = Object.keys(n).length, a = [];
    let c = (m) => {
      a[m] = !0, a.filter(((v) => v)).length === i && (e.oneose?.(), c = () => {
      });
    };
    const d = [];
    let h = (m, v) => {
      c(m), d[m] = v, d.filter(((T) => T)).length === i && (e.onclose?.(d), h = () => {
      });
    };
    const g = (m) => {
      if (e.alreadyHaveEvent?.(m)) return !0;
      const v = t.has(m);
      return t.add(m), v;
    }, b = Promise.all(Object.entries(n).map((async (m, v, T) => {
      if (T.indexOf(m) !== v) return void h(v, "duplicate url");
      let A, [E, L] = m;
      E = _i(E);
      try {
        A = await this.ensureRelay(E, { connectionTimeout: e.maxWait ? Math.max(0.8 * e.maxWait, e.maxWait - 1e3) : void 0 });
      } catch (P) {
        return void h(v, P?.message || String(P));
      }
      let U = A.subscribe(L, { ...e, oneose: () => c(v), onclose: (P) => h(v, P), alreadyHaveEvent: g, eoseTimeout: e.maxWait });
      r.push(U);
    })));
    return { async close() {
      await b, r.forEach(((m) => {
        m.close();
      }));
    } };
  }
  subscribeManyEose(n, e, t) {
    const r = this.subscribeMany(n, e, { ...t, oneose() {
      r.close();
    } });
    return r;
  }
  async querySync(n, e, t) {
    return new Promise((async (r) => {
      const i = [];
      this.subscribeManyEose(n, [e], { ...t, onevent(a) {
        i.push(a);
      }, onclose(a) {
        r(i);
      } });
    }));
  }
  async get(n, e, t) {
    e.limit = 1;
    const r = await this.querySync(n, e, t);
    return r.sort(((i, a) => a.created_at - i.created_at)), r[0] || null;
  }
  publish(n, e) {
    return n.map(_i).map((async (t, r, i) => {
      if (i.indexOf(t) !== r) return Promise.reject("duplicate url");
      let a = await this.ensureRelay(t);
      return a.publish(e).then(((c) => {
        if (this.trackRelays) {
          let d = this.seenOn.get(e.id);
          d || (d = /* @__PURE__ */ new Set(), this.seenOn.set(e.id, d)), d.add(a);
        }
        return c;
      }));
    }));
  }
  listConnectionStatus() {
    const n = /* @__PURE__ */ new Map();
    return this.relays.forEach(((e, t) => n.set(t, e.connected))), n;
  }
  destroy() {
    this.relays.forEach(((n) => n.close())), this.relays = /* @__PURE__ */ new Map();
  }
};
try {
  Sh = WebSocket;
} catch {
}
var Ih = class extends e1 {
  constructor() {
    super({ verifyEvent: Kb, websocketImplementation: Sh });
  }
};
class ki {
  static instance = null;
  #e;
  #t;
  #n = !0;
  #r;
  constructor() {
    return ki.instance ? ki.instance : (this.#s(), ki.instance = this, this);
  }
  #s() {
    if (this.#e = Xe.PROFILE_CONFIG, this.#t = new Ih(), !this.#t?.ensureRelay) throw new Error("Failed to initialize SimplePool");
    this.#r = new Fb({ simplePool: this.#t, config: { ...this.#e, RELAYS: this.#e.RELAYS || [] } });
  }
  get isInitialized() {
    return this.#n;
  }
  async fetchProfiles(e) {
    if (!Array.isArray(e) || e.length === 0) return [];
    const t = Date.now(), r = new Array(e.length), i = e.reduce(((a, c, d) => {
      const h = Ne.getProfile(c);
      return this.#o(h, t) ? r[d] = h : a.push({ index: d, pubkey: c }), a;
    }), []);
    return i.length > 0 && await this.#i(i, r, e), r;
  }
  async processBatchProfiles(e) {
    const t = this.#a(e);
    if (t.length !== 0) try {
      await Promise.all([this.fetchProfiles(t), ...t.map(((r) => this.verifyNip05Async(r)))]);
    } catch {
    }
  }
  async verifyNip05Async(e) {
    const t = Ne.getNip05(e);
    if (t !== void 0) return t;
    const r = Ne.getNip05PendingFetch(e);
    if (r) return r;
    const i = this.#h(e);
    return Ne.setNip05PendingFetch(e, i), i;
  }
  getNip05(e) {
    return Ne.getNip05(e);
  }
  clearCache() {
    Ne.clearAll(), this.#r.clearPendingFetches();
  }
  #o(e, t) {
    return e && e._lastUpdated && t - e._lastUpdated < 18e5;
  }
  #a(e) {
    return [...new Set(e?.map(((t) => t?.pubkey))?.filter(((t) => t && typeof t == "string" && t.length === 64)))];
  }
  async #i(e, t, r) {
    if (!e.length) return;
    const i = Date.now(), a = e.filter((({ pubkey: d }) => d && typeof d == "string" && d.length === 64));
    if (a.length === 0) return;
    const c = await Promise.all(a.map((({ pubkey: d }) => this.#l(d, i))));
    a.forEach((({ index: d }, h) => {
      d >= 0 && d < t.length && (t[d] = c[h], r[d] && Ne.setProfile(r[d], c[h]));
    }));
  }
  async #l(e, t) {
    if (!e || typeof e != "string" || e.length !== 64) return this.#c();
    try {
      const r = { kinds: [0], authors: [e], limit: 1 }, i = await this.#r.getOrCreateFetchPromise(e, r);
      if (!i?.content) return this.#c();
      let a;
      try {
        a = JSON.parse(i.content);
      } catch {
        return this.#c();
      }
      return { ...a, name: kh(a) || "nameless", _lastUpdated: t, _eventCreatedAt: i.created_at };
    } catch {
      return this.#c();
    }
  }
  async #h(e) {
    try {
      const [t] = await this.fetchProfiles([e]);
      if (!t?.nip05) return Ne.setNip05(e, null), null;
      const r = await Promise.race([Bb(t.nip05, e), new Promise(((a, c) => setTimeout((() => c(new Error("NIP-05 timeout"))), 5e3)))]);
      if (!r) return Ne.setNip05(e, null), null;
      const i = Hs(r.startsWith("_@") ? r.slice(1) : r);
      return Ne.setNip05(e, i), i;
    } catch {
      return Ne.setNip05(e, null), null;
    } finally {
      Ne.deleteNip05PendingFetch(e);
    }
  }
  #c() {
    return { name: "anonymous", display_name: "anonymous" };
  }
}
const Li = new ki();
class t1 {
  async loadAndUpdate(e, t) {
    if (e) try {
      const r = t.querySelector(".sender-name"), i = t.querySelector(".zap-placeholder-name"), a = t.querySelector(".sender-icon"), c = a?.querySelector(".zap-placeholder-icon"), d = t.querySelector(".sender-pubkey");
      let h = Ne.getProfile(e);
      const g = h ? kh(h) || "nameless" : "anonymous", b = h?.picture ? (function(m) {
        if (!m || typeof m != "string") return null;
        try {
          const v = new URL(m);
          return ["http:", "https:"].includes(v.protocol) ? v.href : null;
        } catch {
          return null;
        }
      })(h.picture) : null;
      this.#e(i, r, g), this.#n(c, a, b, g), this.#r(d, e);
    } catch {
      this.#s(t);
    }
  }
  #e(e, t, r) {
    e ? e.replaceWith(Object.assign(document.createElement("span"), { className: "sender-name", textContent: r })) : t && (t.textContent = r);
  }
  #t(e, t = "anonymous user's icon") {
    const r = `https://robohash.org/${e}.png?set=set5&bgset=bg2&size=128x128`, i = Ne.getImageCache(r), a = Object.assign(document.createElement("img"), { alt: t, loading: "lazy", className: "profile-icon" });
    if (i) return a.src = r, a;
    const c = new Image();
    return c.onerror = () => {
      a.src = Jc, Ne.setImageCache(r, Jc);
    }, c.onload = () => {
      Ne.setImageCache(r, c);
    }, c.src = r, a.src = r, a;
  }
  #n(e, t, r, i) {
    if (e && t) {
      const a = (c) => {
        e.remove();
        const d = t.querySelector("img"), h = t.querySelector("a");
        d && d.remove(), h && h.remove();
        const g = c === "robohash" ? this.#t(t.closest("[data-pubkey]")?.dataset.pubkey, `${Hs(i)}'s icon`) : Object.assign(document.createElement("img"), { src: c, alt: `${Hs(i)}'s icon`, loading: "lazy", className: "profile-icon" }), b = t.closest("[data-pubkey]")?.dataset.pubkey;
        if (b) {
          const m = (function(T, A = []) {
            try {
              return window.NostrTools.nip19.nprofileEncode({ pubkey: T, relays: A });
            } catch {
              return null;
            }
          })(b), v = Object.assign(document.createElement("a"), { href: `https://njump.me/${m}`, target: "_blank", rel: "noopener noreferrer" });
          v.appendChild(g), t.appendChild(v);
        } else t.appendChild(g);
      };
      if (r) {
        const c = new Image();
        c.onload = () => {
          Ne.setImageCache(r, c), a(r);
        }, c.onerror = () => {
          a("robohash");
        }, c.src = r;
      } else a("robohash");
    }
  }
  #r(e, t) {
    if (e && !e.getAttribute("data-nip05-updated")) {
      const r = Li.getNip05(t);
      r ? (e.textContent = r, e.setAttribute("data-nip05-updated", "true")) : Li.verifyNip05Async(t).then(((i) => {
        i && (e.textContent = i, e.setAttribute("data-nip05-updated", "true"));
      }));
    }
  }
  #s(e) {
    const t = e.querySelector(".zap-placeholder-icon");
    if (t) {
      const r = t.parentElement, i = e.closest("[data-pubkey]")?.dataset.pubkey;
      t.remove(), r.appendChild(this.#t(i));
    }
  }
  async updateProfileElement(e, t) {
    if (!e || !t) return;
    const r = e.querySelector(".sender-icon img, .zap-placeholder-icon");
    if (r) if (t.picture) {
      const a = document.createElement("img");
      a.alt = t.name || "Profile Picture", a.width = 32, a.height = 32, a.className = "profile-icon", a.onerror = () => {
        const c = e.getAttribute("data-pubkey");
        if (c) {
          const d = this.#t(c, t.name || "anonymous user");
          a.parentElement && a.parentElement.replaceChild(d, a);
        }
      }, a.src = t.picture, r.parentElement && r.parentElement.replaceChild(a, r);
    } else {
      const a = e.getAttribute("data-pubkey");
      if (a) {
        const c = this.#t(a, t.name || "anonymous user");
        r.parentElement && r.parentElement.replaceChild(c, r);
      }
    }
    const i = e.querySelector(".sender-name, .zap-placeholder-name");
    if (i && (i.textContent = t.display_name || t.name || "anonymous", i.className = "sender-name"), t.nip05) {
      const a = e.getAttribute("data-pubkey");
      if (a) {
        const c = e.querySelector('[data-nip05-target="true"]');
        c && await this.updateNip05Display(a, c);
      }
    }
  }
}
class Mn {
  static #e = { 1: "content", 30023: "title", 30030: "title", 30009: "name", 40: "content", 42: "name", 31990: "alt" };
  static #t = { UI_COMPONENTS: "Failed to create UI components:", ZAP_ITEM: "Failed to create zap item HTML:", REFERENCE: "Reference component creation failed:" };
  static createUIComponents(e, t, r) {
    try {
      const i = this.viewConfigs?.get(t), a = r || i?.identifier, c = Ws(a) ? null : this.#i(e);
      return { iconComponent: this.#n(), nameComponent: this.#h(e), pubkeyComponent: this.#c(e, a), referenceComponent: this.#f(c) };
    } catch {
      return this.#r();
    }
  }
  static #n() {
    return '<div class="zap-placeholder-icon skeleton"></div>';
  }
  static #r() {
    return { iconComponent: '<div class="zap-placeholder-icon skeleton"></div>', nameComponent: '<div class="zap-placeholder-name skeleton"></div>', pubkeyComponent: "", referenceComponent: "" };
  }
  static createReferenceComponent(e) {
    return this.#f(this.#i({ reference: e }));
  }
  static addReferenceToElement(e, t) {
    if (!this.#s(e, t)) return;
    const r = e.querySelector(".zap-content");
    this.#o(r, t);
  }
  static #s(e, t) {
    return e && t && e.querySelector(".zap-content");
  }
  static #o(e, t) {
    e.querySelectorAll(".zap-reference").forEach(((i) => i.remove()));
    const r = this.createReferenceComponent({ reference: t });
    e.insertAdjacentHTML("beforeend", r);
  }
  static getDialogTemplate() {
    return `
      <dialog class="dialog">
        <h2 class="dialog-title"><a href="#" target="_blank"></a></h2>
        <button class="close-dialog-button">X</button>
        <div class="zap-stats"></div>
        <ul class="dialog-zap-list"></ul>
      </dialog>
    `;
  }
  static createZapItemHTML(e, t, r, i) {
    try {
      const a = this.createUIComponents(e, r, i);
      return this.#a(e, t, a);
    } catch {
      return "";
    }
  }
  static createNoZapsMessageHTML(e) {
    return `
      <div class="no-zaps-container">
        <div class="no-zaps-message">${e}</div>
      </div>
    `;
  }
  static #a(e, t, r) {
    const [i, a] = e.satsText.split(" "), c = (d = e.created_at, Math.floor(Date.now() / 1e3) - d < 86400);
    var d;
    return `
      <div class="zap-content">
        <div class="zap-sender${e.comment ? " with-comment" : ""}" data-pubkey="${e.pubkey}">
          <div class="sender-icon${c ? " is-new" : ""}">
            ${r.iconComponent}
          </div>
          <div class="sender-info">
            ${r.nameComponent}
            ${r.pubkeyComponent}
          </div>
          <div class="zap-amount ${t}"><span class="number">${i}</span> ${a}</div>
        </div>
        ${e.comment ? `<div class="zap-details"><span class="zap-comment">${Hs(e.comment)}</span></div>` : ""}
        ${r.referenceComponent}
      </div>
    `;
  }
  static #i(e) {
    if (!e) return null;
    if (this.#l(e)) return e;
    if (e.reference && typeof e.reference == "object") {
      if (e.reference.reference && this.#l(e.reference.reference)) return e.reference.reference;
      if (this.#l(e.reference)) return e.reference;
    }
    return null;
  }
  static #l(e) {
    return e && typeof e == "object" && "id" in e && "tags" in e && Array.isArray(e.tags) && "content" in e && "kind" in e;
  }
  static #h({ senderName: e }) {
    return e ? `<span class="sender-name">${Hs(e)}</span>` : '<div class="zap-placeholder-name skeleton"></div>';
  }
  static #c({ pubkey: e, displayIdentifier: t, reference: r }, i) {
    const a = !Ws(i), c = `class="sender-pubkey" data-pubkey="${e}"`;
    return r && a ? `<span ${c}>${t}</span>` : `<span ${c} data-nip05-target="true">${t}</span>`;
  }
  static #f(e) {
    if (!this.#l(e)) return "";
    const t = e.id, r = Ne.getReferenceComponent(t);
    if (r) return r;
    try {
      const i = this.#g(e), a = this.#p(e), c = this.#d(i, a);
      return Ne.setReferenceComponent(t, c), c;
    } catch {
      return "";
    }
  }
  static #g(e) {
    if (!e?.tags) return "";
    if (e.kind === 31990) return this.#v(e) || "";
    const t = Array.isArray(e.tags) ? e.tags.find(((r) => Array.isArray(r) && r[0] === "d")) : null;
    return t ? `https://njump.me/${(function(r, i, a, c = []) {
      try {
        return window.NostrTools.nip19.naddrEncode({ kind: r, pubkey: i, identifier: a, relays: c });
      } catch {
        return null;
      }
    })(e.kind, e.pubkey, t[1])}` : e.id ? `https://njump.me/${(function(r, i, a, c = []) {
      try {
        return window.NostrTools.nip19.neventEncode({ id: r, kind: i, pubkey: a, relays: c });
      } catch {
        return null;
      }
    })(e.id, e.kind, e.pubkey)}` : "";
  }
  static #v(e) {
    const t = e.tags.filter(((i) => i[0] === "r"));
    return (t.find(((i) => !i.includes("source"))) || t[0])?.[1];
  }
  static #p(e) {
    if (!e) return "";
    const t = Mn.#e[e.kind];
    if (t) {
      const r = e.tags.find(((i) => Array.isArray(i) && i[0] === t));
      if (r && r[1]) return r[1];
    }
    if (e.kind === 40) try {
      return JSON.parse(e.content).name || e.content;
    } catch {
    }
    return e.content || "";
  }
  static #d(e, t) {
    return `
      <div class="zap-reference">
        <div class="reference-arrow">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjODg4Ij4NCiAgICA8cGF0aCBkPSJtNTYwLTEyMC01Ny01NyAxNDQtMTQzSDIwMHYtNDgwaDgwdjQwMGgzNjdMNTAzLTU0NGw1Ni01NyAyNDEgMjQxLTI0MCAyNDBaIiAvPg0KPC9zdmc+" alt="Reference" width="18" height="18" />
        </div>
        <div class="reference-text">${Hs(t)}</div>
        <a href="${e}" target="_blank" class="reference-link">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjODg4Ij4NCiAgICA8cGF0aA0KICAgICAgICBkPSJNNDQwLTI4MEgyODBxLTgzIDAtMTQxLjUtNTguNVQ4MC00ODBxMC04MyA1OC41LTE0MS41VDI4MC02ODBoMTYwdjgwSDI4MHEtNTAgMC04NSAzNXQtMzUgODVxMCA1MCAzNSA4NXQ4NSAzNWgxNjB2ODBaTTMyMC00NDB2LTgwaDMyMHY4MEgzMjBabTIwMCAxNjB2LTgwaDE2MHE1MCAwIDg1LTM1dDM1LTg1cTAtNTAtMzUtODV0LTg1LTM1SDUyMHYtODBoMTYwcTgzIDAgMTQxLjUgNTguNVQ4ODAtNDgwcTAgODMtNTguNSAxNDEuNVQ2ODAtMjgwSDUyMFoiIC8+DQo8L3N2Zz4=" alt="Quick Reference" width="16" height="16" />
        </a>
      </div>
    `;
  }
  static ZapInfo = class {
    #u;
    constructor(e) {
      this.#u = e;
    }
    static async createFromEvent(e, t = {}) {
      return await new Mn.ZapInfo(e).extractInfo(t);
    }
    static getAmountColorClass(e, t) {
      return (t === void 0 ? Xe.ZAP_AMOUNT_CONFIG.DEFAULT_COLOR_MODE : t) ? this.#b(e) : Xe.ZAP_AMOUNT_CONFIG.DISABLED_CLASS;
    }
    static #b(e) {
      const { THRESHOLDS: t, DEFAULT_CLASS: r } = Xe.ZAP_AMOUNT_CONFIG;
      return t.find(((i) => e >= i.value))?.className || r;
    }
    async extractInfo(e = {}) {
      const t = this.#u.id, r = Ne.getZapInfo(t);
      if (r) return r.colorClass = Mn.ZapInfo.getAmountColorClass(r.satsAmount, e.isColorModeEnabled), r;
      try {
        const { pubkey: a, content: c, satsText: d } = await Pb(this.#u), h = parseInt(d.replace(/,/g, "").split(" ")[0], 10), g = typeof a == "string" ? a : null, b = this.#u.reference || null, m = { satsText: d, satsAmount: h, comment: c || "", pubkey: g || "", created_at: this.#u.created_at, displayIdentifier: g ? Ah(Ub(g)) : "anonymous", senderName: null, senderIcon: null, reference: b, colorClass: Mn.ZapInfo.getAmountColorClass(h, e?.isColorModeEnabled) };
        return Ne.setZapInfo(t, m), m;
      } catch {
        const c = { satsText: "Amount: Unknown", satsAmount: 0, comment: "", pubkey: "", created_at: this.#u.created_at, displayIdentifier: "anonymous", senderName: "anonymous", senderIcon: i, reference: null };
        return Ne.setZapInfo(t, c), c;
      }
      var i;
    }
    static async batchExtractInfo(e, t = !0) {
      const r = /* @__PURE__ */ new Map();
      return await Promise.all(e.map((async (i) => {
        const a = new Mn.ZapInfo(i), c = await a.extractInfo({ isColorModeEnabled: t });
        r.set(i.id, c);
      }))), r;
    }
  };
  static viewConfigs = /* @__PURE__ */ new Map();
}
class n1 {
  constructor(e, t) {
    this.viewId = e, this.config = t;
  }
  async createListItem(e) {
    const t = await Mn.ZapInfo.createFromEvent(e, { isColorModeEnabled: this.config?.isColorModeEnabled }), r = document.createElement("li");
    return r.className = `zap-list-item ${t.colorClass}${t.comment ? " with-comment" : ""}`, r.setAttribute("data-pubkey", t.pubkey), e?.id && r.setAttribute("data-event-id", e.id), r.innerHTML = Mn.createZapItemHTML(t, t.colorClass, this.viewId), r.setAttribute("data-timestamp", e.created_at.toString()), { li: r, zapInfo: t };
  }
}
class r1 {
  constructor(e, t, r, i) {
    if (!e) throw new Error("shadowRoot is required");
    if (!i) throw new Error("config is required");
    this.shadowRoot = e, this.profileUI = t, this.viewId = r, this.config = i, this.itemBuilder = new n1(r, this.config), this.profileUpdateUnsubscribe = null, this.#g();
  }
  destroy() {
    this.profileUpdateUnsubscribe && (this.profileUpdateUnsubscribe(), this.profileUpdateUnsubscribe = null);
    const e = this.#e(".dialog-zap-list");
    e && (e.innerHTML = "");
  }
  #e(e) {
    return this.shadowRoot.querySelector(e);
  }
  getElementByEventId(e) {
    return this.#e(`.zap-list-item[data-event-id="${e}"]`);
  }
  async #t(e) {
    const t = this.#e(".dialog-zap-list");
    if (t) try {
      return this.#r(t), await e(t);
    } catch {
      t.children.length === 0 && this.showNoZapsMessage();
    }
  }
  #n(e, t) {
    const r = e.querySelector(".load-more-trigger");
    r && r.remove(), Array.from(t.children).forEach(((i) => {
      const a = i.getAttribute("data-event-id"), c = parseInt(i.getAttribute("data-timestamp"));
      let d = null;
      const h = Array.from(e.children);
      for (let g = 0; g < h.length; g++)
        if (c > parseInt(h[g].getAttribute("data-timestamp"))) {
          d = h[g];
          break;
        }
      e.querySelector(`.zap-list-item[data-event-id="${a}"]`) || (d ? e.insertBefore(i, d) : e.appendChild(i));
    })), r && e.appendChild(r);
  }
  #r(e) {
    const t = e.querySelector(".no-zaps-message");
    t && t.remove();
  }
  async #s(e, t) {
    return this.#t((async (r) => {
      const { li: i, zapInfo: a } = await this.itemBuilder.createListItem(e);
      return t(r, i), await this.#d(a.pubkey, i), { li: i, zapInfo: a };
    }));
  }
  async renderZapListFromCache(e) {
    if (!e?.length) return Ne.setNoZapsState(this.viewId, !1), this.showNoZapsMessage();
    await this.#t((async (t) => {
      const { initialBatch: r, remainingBatch: i } = this.#o(e), { fragment: a, profileUpdates: c } = await this.#a(r);
      this.#n(t, a), i.length > 0 ? this.#i(i, t, c) : await this.#p(c);
    }));
  }
  #o(e) {
    const t = this.#b(e), r = Xe.DIALOG_CONFIG.ZAP_LIST.INITIAL_BATCH;
    return { initialBatch: t.slice(0, r), remainingBatch: t.slice(r) };
  }
  async #a(e) {
    const t = document.createDocumentFragment(), r = [];
    for (const i of e) {
      const { li: a, zapInfo: c } = await this.itemBuilder.createListItem(i);
      this.#m(i.id, a), t.appendChild(a), c.pubkey && r.push({ pubkey: c.pubkey, element: a });
    }
    return { fragment: t, profileUpdates: r };
  }
  #i(e, t, r) {
    if (!e.length) return;
    const i = Xe.DIALOG_CONFIG.ZAP_LIST.REMAINING_BATCH;
    let a = 0;
    const c = async () => {
      if (a >= e.length) return void await this.#p(r);
      const d = e.slice(a, a + i);
      await this.#l(d, t, r), a += i, setTimeout((() => c()), 0);
    };
    requestIdleCallback((() => c()));
  }
  async #l(e, t, r) {
    const i = document.createDocumentFragment();
    await Promise.all(e.map((async (c) => {
      const { li: d, zapInfo: h } = await this.itemBuilder.createListItem(c);
      this.#m(c.id, d), i.appendChild(d), h.pubkey && r.push({ pubkey: h.pubkey, element: d });
    })));
    const a = t.querySelector(".load-more-trigger");
    a && a.remove(), t.appendChild(i), a && t.appendChild(a), await new Promise(((c) => requestAnimationFrame(c)));
  }
  async prependZap(e) {
    return this.#s(e, ((t, r) => t.prepend(r)));
  }
  async appendZap(e) {
    return this.#s(e, ((t, r) => {
      const i = this.#f(t, e.created_at);
      i ? t.insertBefore(r, i) : t.appendChild(r);
    }));
  }
  async replacePlaceholderWithZap(e, t) {
    const r = this.#e(`[data-index="${t}"]`);
    if (this.#y(r)) try {
      const { zapInfo: i } = await this.itemBuilder.createListItem(e);
      this.#w(r, i, e.id), await this.#d(i.pubkey, r);
    } catch {
      r.remove();
    }
  }
  async showNoZapsMessage() {
    const e = this.#e(".dialog-zap-list");
    if (e) {
      if (Ne.hasNoZaps(this.viewId)) return void this.#c(e);
      await this.#h() || (this.#c(e), Ne.setNoZapsState(this.viewId, !0));
    }
  }
  async #h() {
    const e = this.config.noZapsDelay || Xe.DIALOG_CONFIG.DEFAULT_NO_ZAPS_DELAY;
    await new Promise(((r) => setTimeout(r, e)));
    const t = Ne.getZapEvents(this.viewId);
    return !!t?.length && (await this.renderZapListFromCache(t), !0);
  }
  #c(e) {
    const t = this.config.noZapsMessage || Xe.DIALOG_CONFIG.NO_ZAPS_MESSAGE;
    e.innerHTML = Mn.createNoZapsMessageHTML(t), e.style.minHeight = Xe.DIALOG_CONFIG.ZAP_LIST.MIN_HEIGHT;
  }
  async batchUpdate(e, t = {}) {
    const r = this.#e(".dialog-zap-list");
    if (r) try {
      const i = new Map(Array.from(r.querySelectorAll(".zap-list-item")).map(((g) => [g.getAttribute("data-event-id"), g]))), a = this.#b(e), c = Ws(this.config.identifier), d = a.filter(((g) => {
        const b = i.get(g.id);
        return c ? !b : !b || g.reference && !b.querySelector(".zap-reference");
      }));
      if (d.length === 0 && !t.isFullUpdate) return;
      const h = document.createDocumentFragment();
      for (const g of d) {
        const { li: b, zapInfo: m } = await this.itemBuilder.createListItem(g);
        !c && g.reference && this.updateZapReference(g), h.appendChild(b), m.pubkey && await this.#d(m.pubkey, b);
      }
      this.#n(r, h);
    } catch {
    }
  }
  #f(e, t) {
    return Array.from(e.children).find(((r) => {
      const i = parseInt(r.getAttribute("data-timestamp") || "0");
      return t > i;
    }));
  }
  updateZapReference(e) {
    if (e?.id && e?.reference) try {
      const t = this.getElementByEventId(e.id);
      if (!t) return;
      Mn.addReferenceToElement(t, e.reference), Ne.setReference(e.id, e.reference);
    } catch {
    }
  }
  #g() {
    this.profileUpdateUnsubscribe = Ne.subscribeToProfileUpdates(this.#v.bind(this));
  }
  async #v(e, t) {
    const r = this.shadowRoot.querySelectorAll(`[data-pubkey="${e}"]`);
    await Promise.allSettled(Array.from(r).map(((i) => this.profileUI.updateProfileElement(i, t))));
  }
  async #p(e) {
    const t = Xe.DIALOG_CONFIG.ZAP_LIST.PROFILE_BATCH;
    for (let r = 0; r < e.length; r += t) {
      const i = e.slice(r, r + t);
      await Promise.all(i.map((({ pubkey: a, element: c }) => this.#d(a, c)))), await new Promise(((a) => requestAnimationFrame(a)));
    }
  }
  async #d(e, t) {
    e && await this.#u(e, t);
  }
  async #u(e, t) {
    if (e && t) try {
      await this.profileUI.loadAndUpdate(e, t);
    } catch {
    }
  }
  #b(e) {
    return [...new Map(e.map(((t) => [t.id, t]))).values()].sort(((t, r) => r.created_at - t.created_at));
  }
  #m(e, t) {
    if (Ws(this.config.identifier)) return;
    const r = Ne.getReference(e);
    r && Mn.addReferenceToElement(t, r);
  }
  #y(e) {
    return e && e.classList.contains("placeholder");
  }
  #w(e, t, r) {
    const i = this.itemBuilder.getAmountColorClass(t.satsAmount);
    e.className = `zap-list-item ${i}${t.comment ? " with-comment" : ""}`, e.setAttribute("data-pubkey", t.pubkey), e.setAttribute("data-event-id", r), e.innerHTML = Mn.createZapItemHTML(t, i, this.viewId), e.removeAttribute("data-index");
  }
}
var s1 = wn(0), i1 = wn.n(s1);
const Di = new class {
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Map();
  constructor() {
  }
  async getZapStats(n, e) {
    const t = await this.#n(e, n);
    if (t) return t;
    const r = await this.fetchStats(n);
    return r && Ne.updateStatsCache(e, n, r), r;
  }
  async fetchStats(n) {
    try {
      const e = await this._fetchFromApi(n);
      return this._formatStats(e) || this.createTimeoutError();
    } catch (e) {
      return this.handleFetchError(e);
    }
  }
  createTimeoutError() {
    return { error: !0, timeout: !0 };
  }
  handleFetchError(n) {
    return { error: !0, timeout: n.message === "STATS_TIMEOUT" };
  }
  async _fetchFromApi(n) {
    const e = td(n);
    if (!e) return null;
    const t = `https://api.nostr.band/v0/stats/${e.type === "npub" || e.type === "nprofile" ? "profile" : "event"}/${n}`, r = new AbortController(), i = setTimeout((() => r.abort()), Xe.REQUEST_CONFIG.REQUEST_TIMEOUT);
    try {
      return await (await fetch(t, { signal: r.signal })).json();
    } catch (a) {
      throw a.name === "AbortError" ? new Error("STATS_TIMEOUT") : a;
    } finally {
      clearTimeout(i);
    }
  }
  _formatStats(n) {
    if (!n?.stats) return null;
    const e = Object.values(n.stats)[0];
    return e ? { count: parseInt(e.zaps_received?.count || e.zaps?.count || 0, 10), msats: parseInt(e.zaps_received?.msats || e.zaps?.msats || 0, 10), maxMsats: parseInt(e.zaps_received?.max_msats || e.zaps?.max_msats || 0, 10) } : null;
  }
  async initializeStats(n, e, t = !1) {
    if (t && this.displayStats({ skeleton: !0 }, e), this.#t.has(e)) return this.#t.get(e);
    if (td(n)?.type === "naddr") {
      const a = this.createTimeoutError();
      return this.displayStats(a, e), this.#e.set(e, a), a;
    }
    const i = (async () => {
      try {
        const a = await this.getZapStats(n, e);
        return a && (this.displayStats(a, e), this.#e.set(e, a)), a;
      } catch {
        return null;
      } finally {
        this.#t.delete(e);
      }
    })();
    return this.#t.set(e, i), i;
  }
  async #n(n, e) {
    const t = Ne.getCachedStats(n, e), r = Date.now();
    return t && r - t.timestamp < Xe.REQUEST_CONFIG.CACHE_DURATION ? t.stats : null;
  }
  getCurrentStats(n) {
    return this.#e.get(n);
  }
  async handleZapEvent(n, e, t) {
    if (n?.isRealTimeEvent) try {
      const r = n.tags.find(((h) => h[0].toLowerCase() === "bolt11"))?.[1], i = this.extractAmountFromBolt11(r);
      if (i <= 0) return;
      const a = Ne.getViewStats(e), c = { count: a?.count || 0, msats: a?.msats || 0, maxMsats: a?.maxMsats || 0 }, d = { count: c.count + 1, msats: c.msats + i, maxMsats: Math.max(c.maxMsats, i) };
      Ne.updateStatsCache(e, t, d), this.#e.set(e, d), await this.displayStats(d, e), n.isStatsCalculated = !0, n.amountMsats = i;
    } catch {
    }
  }
  extractAmountFromBolt11(n) {
    try {
      const e = window.decodeBolt11(n);
      return parseInt(e.sections.find(((t) => t.name === "amount"))?.value ?? "0", 10);
    } catch {
      return 0;
    }
  }
  async displayStats(n, e) {
    try {
      await a1(n, e);
    } catch {
    }
  }
}(), _s = new class {
  #e;
  #t;
  #n;
  #r;
  #s;
  #o;
  #a;
  constructor() {
    this.#e = new Ih(), this.#i(), this.#l();
  }
  #i() {
    this.#n = /* @__PURE__ */ new Map(), this.#r = /* @__PURE__ */ new Map(), this.#s = /* @__PURE__ */ new Map(), this.#t = !1;
  }
  #l() {
    const n = { pool: this.#e, batchSize: Xe.BATCH_CONFIG.REFERENCE_PROCESSOR.BATCH_SIZE, batchDelay: Xe.BATCH_CONFIG.REFERENCE_PROCESSOR.BATCH_DELAY };
    this.#o = new qb(n), this.#a = new jb(n);
  }
  #h(n) {
    this.#n.has(n) || this.#n.set(n, { zap: null }), this.#r.has(n) || this.#r.set(n, { isZapClosed: !1 });
  }
  #c(n, e, t, r) {
    this.#n.get(n).zap = this.#e.subscribeMany(e.relayUrls, [t.req], r);
  }
  #f(n) {
    return n && n.id && Array.isArray(n.tags);
  }
  #g(n, e) {
    return n && this.#s.delete(n), null;
  }
  async connectToRelays(n) {
    this.#t || ([this.#o, this.#a].forEach(((e) => e.setRelayUrls(n))), this.#t = !0);
  }
  subscribeToZaps(n, e, t, r) {
    try {
      this.#v(t), this.#h(n), this.#r.get(n).isZapClosed = !1, this.#c(n, e, t, this.#p(r));
    } catch (i) {
      this.#d("Subscription error", i);
    }
  }
  #v(n) {
    if (!n?.req?.kinds || !Array.isArray(n.req.kinds)) throw new Error("Invalid subscription settings");
  }
  async fetchReference(n, e, t) {
    try {
      if (!this.#f(e)) return null;
      const r = e.tags.find(((h) => Array.isArray(h) && h[0] === t));
      if (!r) return null;
      const i = t === "e" ? r[1] : `${r[1]}`, a = Ne.getReference(i);
      if (a) return a;
      const c = this.#s.get(i);
      if (c) return c;
      const d = t === "e" ? this.#o : this.#a;
      try {
        const h = await d.getOrCreateFetchPromise(i);
        return h && Ne.setReference(i, h), this.#s.delete(i), h;
      } finally {
        this.#s.delete(i);
      }
    } catch (r) {
      return this.#g(e?.id, r);
    }
  }
  #p(n) {
    const e = Math.floor(Date.now() / 1e3);
    return { ...n, onevent: (t) => {
      t.isRealTimeEvent = t.created_at >= e, n.onevent(t);
    }, oneose: n.oneose };
  }
  #d(n, e) {
    throw e;
  }
  get zapPool() {
    return this.#e;
  }
}(), { zapPool: mm } = _s, $r = new class {
  constructor() {
    this.viewConfigs = /* @__PURE__ */ new Map(), this.configStore = /* @__PURE__ */ new Map(), this.observers = /* @__PURE__ */ new Map(), this.#e = /* @__PURE__ */ new Map(), this.#t = /* @__PURE__ */ new Map();
  }
  #e;
  #t;
  setZapListUI(n) {
    this.zapListUI = n;
  }
  setViewConfig(n, e) {
    this.viewConfigs.set(n, e), Mn.viewConfigs.set(n, e), Ne.initializeZapView(n);
  }
  getViewConfig(n) {
    return this.viewConfigs.get(n);
  }
  async updateEventReference(n, e) {
    try {
      const t = this.getViewConfig(e);
      if (!t?.relayUrls?.length || Ws(t?.identifier || "")) return !1;
      const r = await this._fetchEventReference(n, t);
      return !!r && (n.reference = r, !0);
    } catch {
      return !1;
    }
  }
  async _fetchEventReference(n, e) {
    const t = async () => {
      if (!n?.tags || !Array.isArray(n.tags)) return null;
      try {
        if (n.tags.find(((a) => Array.isArray(a) && a[0] === "a"))?.[1]) return await _s.fetchReference(e.relayUrls, n, "a");
        const i = n.tags.find(((a) => Array.isArray(a) && a[0] === "e"));
        return i?.[1] && /^[0-9a-f]{64}$/.test(i[1].toLowerCase()) ? await _s.fetchReference(e.relayUrls, n, "e") : null;
      } catch {
        return null;
      }
    };
    try {
      return await Ne.getOrFetchReference(n.id, t);
    } catch {
      return null;
    }
  }
  async updateEventReferenceBatch(n, e) {
    const t = this.getViewConfig(e);
    if (!t?.relayUrls?.length || Ws(t?.identifier || "")) return;
    const r = n.map(((i) => this.updateEventReference(i, e)));
    await Promise.allSettled(r);
  }
  updateUIReferences(n) {
    this.zapListUI && n.forEach(((e) => {
      e.reference && this.zapListUI.updateZapReference(e);
    }));
  }
  async initializeSubscriptions(n, e) {
    try {
      if (!this._isValidFilter(n)) throw new Error("Invalid filter settings");
      const t = ed(n.identifier);
      if (!t) throw new Error(Xe.ZAP_CONFIG.ERRORS.DECODE_FAILED);
      this._initializeLoadState(e), this._showInitialLoadingSpinner(e);
      const { batchEvents: r, lastEventTime: i } = await this._collectInitialEvents(e, n, t);
      r?.length > 0 && this._processBatchEvents(r, e).catch(console.error), await this.finalizeInitialization(e, i);
    } catch (t) {
      throw t;
    }
  }
  _showInitialLoadingSpinner(n) {
    const e = this._getListElement(n);
    if (e) {
      const t = this._createLoadTrigger();
      e.appendChild(t);
    }
  }
  async finalizeInitialization(n, e) {
    const t = Ne.getZapEvents(n), r = this._getListElement(n), i = Ne.updateLoadState(n, { isInitialFetchComplete: !0, lastEventTime: e });
    await Promise.all([i, t.length === 0 ? this.zapListUI?.showNoZapsMessage() : null, t.length >= Xe.REQ_CONFIG.INITIAL_LOAD_COUNT ? this.setupInfiniteScroll(n) : null]), r?.querySelector(".load-more-trigger")?.remove();
  }
  _initializeLoadState(n) {
    Ne.updateLoadState(n, { isInitialFetchComplete: !1, lastEventTime: null, isLoading: !1 });
  }
  _isValidFilter(n) {
    return n && n.relayUrls && Array.isArray(n.relayUrls) && n.relayUrls.length > 0 && n.identifier;
  }
  setupInfiniteScroll(n) {
    try {
      this._cleanupInfiniteScroll(n);
      const e = this._getListElement(n);
      if (!e) return;
      const t = this._createLoadTrigger();
      e.appendChild(t), this._observeLoadTrigger(t, n, e);
    } catch {
    }
  }
  _createLoadTrigger() {
    const n = document.createElement("div");
    n.className = "load-more-trigger";
    const e = document.createElement("div");
    return e.className = "loading-spinner", n.appendChild(e), n;
  }
  _observeLoadTrigger(n, e, t) {
    const r = new IntersectionObserver(((i) => this._handleIntersection(i[0], e)), { root: t, rootMargin: Xe.INFINITE_SCROLL.ROOT_MARGIN, threshold: Xe.INFINITE_SCROLL.THRESHOLD });
    r.observe(n), this.observers.set(e, r);
  }
  async _handleIntersection(n, e) {
    n.isIntersecting && (Ne.getLoadState(e).isLoading ? setTimeout((() => {
      n.isIntersecting && this._handleIntersection(n, e);
    }), Xe.INFINITE_SCROLL.RETRY_DELAY) : this.loadMoreZaps(e).then(((t) => {
      t === 0 && this._cleanupInfiniteScroll(e);
    })).catch(((t) => {
      this._cleanupInfiniteScroll(e);
    })));
  }
  _cleanupInfiniteScroll(n) {
    const e = this.observers.get(n);
    if (!e) return;
    e.disconnect(), this._getListElement(n)?.querySelector(".load-more-trigger")?.remove(), this.observers.delete(n);
  }
  _getListElement(n) {
    return document.querySelector(`nzv-dialog[data-view-id="${n}"]`)?.shadowRoot?.querySelector(".dialog-zap-list");
  }
  async loadMoreZaps(n) {
    const e = Ne.getLoadState(n), t = this.getViewConfig(n);
    if (!this._canLoadMore(e, t)) return 0;
    e.isLoading = !0;
    try {
      const r = await this._executeLoadMore(n, e, t);
      if (r > 0) {
        const i = Ne.getZapEvents(n).slice(-r);
        await this.updateEventReferenceBatch(i, n), this.updateUIReferences(i);
      }
      return r;
    } finally {
      e.isLoading = !1;
    }
  }
  async _executeLoadMore(n, e, t) {
    const r = ed(t.identifier, e.lastEventTime);
    if (!r) return 0;
    const i = [], a = setTimeout((() => {
      i.length === 0 && this._cleanupInfiniteScroll(n);
    }), Xe.LOAD_TIMEOUT);
    try {
      return await this._collectEvents(n, t, r, i, Xe.REQ_CONFIG.ADDITIONAL_LOAD_COUNT, e), i.length > 0 && await this._processBatchEvents(i, n), i.length;
    } catch {
      return 0;
    } finally {
      clearTimeout(a);
    }
  }
  async _collectEvents(n, e, t, r, i, a) {
    return new Promise(((c, d) => {
      const h = setTimeout((() => d(new Error("Load timeout"))), Xe.LOAD_TIMEOUT);
      _s.subscribeToZaps(n, e, t, { onevent: (g) => {
        g.created_at < a.lastEventTime && (r.push(g), a.lastEventTime = Math.min(a.lastEventTime, g.created_at), r.length >= i && (clearTimeout(h), c()));
      }, oneose: () => {
        clearTimeout(h), c();
      } });
    }));
  }
  async _collectInitialEvents(n, e, t) {
    const r = [];
    let i = null;
    return new Promise(((a) => {
      const c = this._setupBufferInterval(r, n), d = _s.subscribeToZaps(n, e, t, { onevent: (h) => {
        const g = this._handleInitialEvent(h, r, i, n);
        g !== null && (i = g);
      }, oneose: () => {
        clearInterval(c), a({ batchEvents: [...r], lastEventTime: i });
      } });
      this.#e.set(n, { zap: d });
    }));
  }
  _handleInitialEvent(n, e, t, r) {
    const i = Math.min(t || n.created_at, n.created_at);
    if (Ne.addZapEvent(r, n)) {
      if (e.push(n), this.updateEventReference(n, r).then(((a) => {
        a && this.zapListUI && n.reference && this.zapListUI.updateZapReference(n);
      })), n.isRealTimeEvent) {
        const a = this.getViewConfig(r);
        Di.handleZapEvent(n, r, a?.identifier), this.zapListUI && this.zapListUI.prependZap(n).catch(console.error);
      }
      e.length >= Xe.BATCH_SIZE && this.zapListUI && this.zapListUI.batchUpdate(Ne.getZapEvents(r)).catch(console.error);
    }
    return i;
  }
  async _processBatchEvents(n, e) {
    if (n?.length) {
      n.sort(((t, r) => r.created_at - t.created_at)), n.forEach(((t) => Ne.addZapEvent(e, t)));
      try {
        await Promise.all([Li.processBatchProfiles(n)]);
      } catch {
      }
      await this._updateUI(n, e);
    }
  }
  async _updateUI(n, e) {
    this.zapListUI && await this.zapListUI.batchUpdate(n, { isFullUpdate: !0 });
  }
  _setupBufferInterval(n, e) {
    let t = 0;
    const r = Xe.BUFFER_MIN_INTERVAL;
    return setInterval((() => {
      const i = Date.now();
      n.length > 0 && i - t >= r && this.zapListUI && (this.zapListUI.batchUpdate(Ne.getZapEvents(e), { isBufferUpdate: !0 }).catch(console.error), t = i);
    }), Xe.BUFFER_INTERVAL);
  }
  _canLoadMore(n, e) {
    return e && !n.isLoading && n.lastEventTime;
  }
  unsubscribe(n) {
    try {
      const e = this.#e.get(n);
      e?.zap && (e.zap(), e.zap = null), this.#t.set(n, { isZapClosed: !0 }), this._cleanupInfiniteScroll(n);
    } catch {
    }
  }
}();
class o1 extends HTMLElement {
  #e;
  #t;
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.#e = { isInitialized: !1, theme: Xe.DEFAULT_OPTIONS.theme }, this.popStateHandler = (e) => {
      e.preventDefault(), this.#i(".dialog")?.open && this.closeDialog();
    };
  }
  async connectedCallback() {
    if (this.viewId = this.getAttribute("data-view-id"), this.viewId) {
      this.#t = this.#n();
      try {
        await this.#t, this.#e.isInitialized = !0;
        const e = $r.getViewConfig(this.viewId);
        if (!e) throw new Error("Config is required for initialization");
        if (await this.#r(e), this.getAttribute("data-nzv-id")) {
          const t = await Di.getCurrentStats(this.viewId);
          t && this.statsUI.displayStats(t);
        }
        this.#e.isInitialized = !0, this.dispatchEvent(new CustomEvent("dialog-initialized", { detail: { viewId: this.viewId } }));
      } catch {
      }
    }
  }
  async #n() {
    return new Promise(((e) => {
      const t = document.createElement("template");
      t.innerHTML = Mn.getDialogTemplate(), this.shadowRoot.appendChild(t.content.cloneNode(!0)), this.#s(), queueMicrotask((() => e()));
    }));
  }
  async #r(e) {
    const t = document.createElement("style");
    t.textContent = i1(), this.shadowRoot.appendChild(t), this.statsUI = new Hb(this.shadowRoot), this.profileUI = new t1(), this.zapListUI = new r1(this.shadowRoot, this.profileUI, this.viewId, e), $r.setZapListUI(this.zapListUI);
    const r = Ne.getZapEvents(this.viewId);
    r?.length ? await this.zapListUI.renderZapListFromCache(r) : this.zapListUI.showNoZapsMessage();
    const i = this.getAttribute("data-nzv-id");
    if (i) {
      const a = await Ne.getCachedStats(this.viewId, i);
      if (a?.stats) this.statsUI.displayStats(a.stats);
      else {
        const c = await Di.getCurrentStats(this.viewId);
        c && this.statsUI.displayStats(c);
      }
    }
  }
  static get observedAttributes() {
    return ["data-theme"];
  }
  #s() {
    const e = this.#i(".dialog");
    this.#i(".close-dialog-button").addEventListener("click", (() => this.closeDialog())), e.addEventListener("click", ((t) => {
      t.target === e && this.closeDialog();
    })), e.addEventListener("cancel", ((t) => {
      t.preventDefault(), this.closeDialog();
    })), document.addEventListener("keydown", ((t) => {
      if (e?.open) {
        if (t.key === "Escape") this.closeDialog();
        else if (t.key === " ") {
          t.preventDefault();
          const r = this.#i(".dialog-zap-list");
          r && (r.scrollTop += 0.8 * r.clientHeight);
        }
      }
    }));
  }
  attributeChangedCallback(e, t, r) {
    t !== r && e === "data-theme" && this.#o(r);
  }
  #o(e) {
    Ne.updateThemeState(this.viewId, { theme: e }).isInitialized && this.#a();
  }
  #a() {
    const e = Ne.getThemeState(this.viewId).theme === "dark" ? "dark-theme" : "light-theme";
    this.shadowRoot.host.classList.add(e);
  }
  async showDialog() {
    await this.#t;
    const e = this.#i(".dialog");
    e && !e.open && this.#e.isInitialized && (window.addEventListener("popstate", this.popStateHandler), e.showModal(), queueMicrotask((() => {
      document.activeElement && document.activeElement.blur();
    })), this.#l());
  }
  closeDialog() {
    const e = this.#i(".dialog");
    e?.open && (this.zapListUI?.destroy(), $r.unsubscribe(this.viewId), e.close(), this.remove(), window.removeEventListener("popstate", this.popStateHandler));
  }
  displayZapStats(e) {
    this.statsUI.displayStats(e);
  }
  #i(e) {
    return this.shadowRoot.querySelector(e);
  }
  #l() {
    const e = this.getAttribute("data-view-id"), t = document.querySelector(`button[data-zap-view-id="${e}"]`);
    if (!t) return;
    const r = this.#i(".dialog-title"), i = this.#i(".dialog-title a");
    if (!i || !r) return;
    const a = t.getAttribute("data-title"), c = t.getAttribute("data-nzv-id");
    i.href = c ? `https://njump.me/${c}` : "#", a?.trim() ? (i.textContent = a, r.classList.add("custom-title")) : (i.textContent = Xe.DIALOG_CONFIG.DEFAULT_TITLE + Ah(c), r.classList.remove("custom-title"));
  }
  getOperations() {
    if (!this.#e.isInitialized) return null;
    const e = { closeDialog: () => this.closeDialog(), showDialog: () => this.showDialog() };
    return this.#e.isInitialized && Object.assign(e, { prependZap: (t) => this.zapListUI?.prependZap(t), displayZapStats: (t) => this.statsUI?.displayStats(t), showNoZapsMessage: () => this.zapListUI?.showNoZapsMessage() }), e;
  }
  async waitForInitialization() {
    return this.#t;
  }
}
customElements.define("nzv-dialog", o1);
const bo = { create: async (n, e) => {
  if (!n || !e) return Promise.reject(new Error("Invalid viewId or config"));
  $r.setViewConfig(n, e);
  const t = document.querySelector(`nzv-dialog[data-view-id="${n}"]`);
  if (t) return t;
  const r = document.createElement("nzv-dialog");
  r.setAttribute("data-view-id", n), r.setAttribute("data-config", JSON.stringify(e));
  const i = document.querySelector(`button[data-zap-view-id="${n}"]`);
  return i?.getAttribute("data-nzv-id") && r.setAttribute("data-nzv-id", i.getAttribute("data-nzv-id")), document.body.appendChild(r), await r.waitForInitialization(), r;
}, get: (n) => document.querySelector(`nzv-dialog[data-view-id="${n}"]`), execute: (n, e, ...t) => {
  const r = bo.get(n), i = r?.getOperations();
  return i ? i[e]?.(...t) ?? null : null;
} }, a1 = (n, e) => bo.execute(e, "displayZapStats", n);
async function l1(n, e) {
  try {
    const t = Ti.fromButton(n);
    if (!t) throw new Error("Failed to create config from button");
    if ($r.setViewConfig(e, t), !await (async function(i) {
      try {
        const a = $r.getViewConfig(i);
        if (!a) throw new Error(`View configuration not found for viewId: ${i}`);
        return $r.setViewConfig(i, a), await bo.create(i, a);
      } catch {
        return null;
      }
    })(e)) throw new Error(Xe.ZAP_CONFIG.ERRORS.DIALOG_NOT_FOUND);
    await (async function(i) {
      try {
        const a = bo.get(i);
        if (!a) throw new Error("Dialog not found");
        await a.waitForInitialization();
        const c = a.getOperations();
        if (!c?.showDialog) throw new Error("Basic dialog operations not available");
        c.showDialog();
      } catch {
      }
    })(e), setTimeout((async () => {
      if (await (async function(i, a) {
        const c = Ne.getZapEvents(i);
        if (c.length > 0) {
          const h = [...new Set(c.map(((g) => g.pubkey)))];
          Li.fetchProfiles(h);
        }
        const { hasEnoughCachedEvents: d } = await Ne.processCachedData(i, a);
        return d && $r.setupInfiniteScroll(i), d;
      })(e, t), !n.hasAttribute("data-initialized")) {
        const i = n.getAttribute("data-nzv-id");
        await Promise.all([_s.connectToRelays(t.relayUrls), $r.initializeSubscriptions(t, e), i ? Di.initializeStats(i, e, !0) : Promise.resolve()]), n.setAttribute("data-initialized", "true");
      }
    }), 0);
  } catch {
  }
}
function Th() {
  Object.entries(Xe.LIBRARIES).forEach((([n, e]) => {
    window[n] = e;
  })), document.querySelectorAll("button[data-nzv-id]").forEach(((n, e) => {
    if (n.hasAttribute("data-zap-view-id")) return;
    const t = `nostr-zap-view-${e}`;
    n.setAttribute("data-zap-view-id", t), n.hasAttribute("data-zap-color-mode") || n.setAttribute("data-zap-color-mode", Xe.ZAP_CONFIG.DEFAULT_COLOR_MODE), n.addEventListener("click", (() => l1(n, t)));
  }));
}
function Lh(n = {}) {
  Object.assign(Xe, n), typeof window < "u" && Th();
}
function c1(n = {}) {
  return Lh(n);
}
typeof window < "u" && document.addEventListener("DOMContentLoaded", Th);
Sr.vQ;
Sr.ZM;
Sr.yk;
Sr.h0;
Sr.n_;
var d1 = Sr.Xz;
Sr.Uv;
Sr.fU;
Sr.Dw;
var nd = {}, rd;
function u1() {
  if (rd) return nd;
  rd = 1;
  var n = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof _c < "u" ? _c : {};
  function e(o) {
    return o && o.__esModule ? o.default : o;
  }
  var t = {}, r = {}, i = n.parcelRequire1faa;
  i == null && (i = function(o) {
    if (o in t)
      return t[o].exports;
    if (o in r) {
      var s = r[o];
      delete r[o];
      var l = { id: o, exports: {} };
      return t[o] = l, s.call(l.exports, l, l.exports), l.exports;
    }
    var u = new Error("Cannot find module '" + o + "'");
    throw u.code = "MODULE_NOT_FOUND", u;
  }, i.register = function(s, l) {
    r[s] = l;
  }, n.parcelRequire1faa = i), i.register("58QMB", function(o, s) {
    (function() {
      function l(x, C) {
        var B, G = Object.keys(C);
        for (B = 0; B < G.length; B++) x = x.replace(new RegExp("\\{" + G[B] + "\\}", "gi"), C[G[B]]);
        return x;
      }
      function u(x) {
        var C, B, G;
        if (!x) throw new Error("cannot create a random attribute name for an undefined object");
        C = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", B = "";
        do
          for (B = "", G = 0; G < 12; G++) B += C[Math.floor(Math.random() * C.length)];
        while (x[B]);
        return B;
      }
      function f(x) {
        var C = {
          left: "start",
          right: "end",
          center: "middle",
          start: "start",
          end: "end"
        };
        return C[x] || C.start;
      }
      function p(x) {
        var C = {
          alphabetic: "alphabetic",
          hanging: "hanging",
          top: "text-before-edge",
          bottom: "text-after-edge",
          middle: "central"
        };
        return C[x] || C.alphabetic;
      }
      var _, w, H, Q, q;
      q = (function(x, C) {
        var B, G, ne, oe = {};
        for (x = x.split(","), C = C || 10, B = 0; B < x.length; B += 2) G = "&" + x[B + 1] + ";", ne = parseInt(x[B], C), oe[G] = "&#" + ne + ";";
        return oe["\\xa0"] = "&#160;", oe;
      })("50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,t9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro", 32), _ = {
        strokeStyle: {
          svgAttr: "stroke",
          canvas: "#000000",
          svg: "none",
          apply: "stroke"
        },
        fillStyle: {
          svgAttr: "fill",
          canvas: "#000000",
          svg: null,
          apply: "fill"
        },
        lineCap: {
          svgAttr: "stroke-linecap",
          canvas: "butt",
          svg: "butt",
          apply: "stroke"
        },
        lineJoin: {
          svgAttr: "stroke-linejoin",
          canvas: "miter",
          svg: "miter",
          apply: "stroke"
        },
        miterLimit: {
          svgAttr: "stroke-miterlimit",
          canvas: 10,
          svg: 4,
          apply: "stroke"
        },
        lineWidth: {
          svgAttr: "stroke-width",
          canvas: 1,
          svg: 1,
          apply: "stroke"
        },
        globalAlpha: {
          svgAttr: "opacity",
          canvas: 1,
          svg: 1,
          apply: "fill stroke"
        },
        font: {
          canvas: "10px sans-serif"
        },
        shadowColor: {
          canvas: "#000000"
        },
        shadowOffsetX: {
          canvas: 0
        },
        shadowOffsetY: {
          canvas: 0
        },
        shadowBlur: {
          canvas: 0
        },
        textAlign: {
          canvas: "start"
        },
        textBaseline: {
          canvas: "alphabetic"
        },
        lineDash: {
          svgAttr: "stroke-dasharray",
          canvas: [],
          svg: null,
          apply: "stroke"
        }
      }, H = function(x, C) {
        this.__root = x, this.__ctx = C;
      }, H.prototype.addColorStop = function(x, C) {
        var B, G, ne = this.__ctx.__createElement("stop");
        ne.setAttribute("offset", x), C.indexOf("rgba") !== -1 ? (B = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi, G = B.exec(C), ne.setAttribute("stop-color", l("rgb({r},{g},{b})", {
          r: G[1],
          g: G[2],
          b: G[3]
        })), ne.setAttribute("stop-opacity", G[4])) : ne.setAttribute("stop-color", C), this.__root.appendChild(ne);
      }, Q = function(x, C) {
        this.__root = x, this.__ctx = C;
      }, w = function(x) {
        var C, B = {
          width: 500,
          height: 500,
          enableMirroring: !1
        };
        if (arguments.length > 1 ? (C = B, C.width = arguments[0], C.height = arguments[1]) : C = x || B, !(this instanceof w)) return new w(C);
        this.width = C.width || B.width, this.height = C.height || B.height, this.enableMirroring = C.enableMirroring !== void 0 ? C.enableMirroring : B.enableMirroring, this.canvas = this, this.__document = C.document || document, C.ctx ? this.__ctx = C.ctx : (this.__canvas = this.__document.createElement("canvas"), this.__ctx = this.__canvas.getContext("2d")), this.__setDefaultStyles(), this.__stack = [
          this.__getStyleState()
        ], this.__groupStack = [], this.__root = this.__document.createElementNS("http://www.w3.org/2000/svg", "svg"), this.__root.setAttribute("version", 1.1), this.__root.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.__root.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), this.__root.setAttribute("width", this.width), this.__root.setAttribute("height", this.height), this.__ids = {}, this.__defs = this.__document.createElementNS("http://www.w3.org/2000/svg", "defs"), this.__root.appendChild(this.__defs), this.__currentElement = this.__document.createElementNS("http://www.w3.org/2000/svg", "g"), this.__root.appendChild(this.__currentElement);
      }, w.prototype.__createElement = function(x, C, B) {
        C === void 0 && (C = {});
        var G, ne, oe = this.__document.createElementNS("http://www.w3.org/2000/svg", x), ye = Object.keys(C);
        for (B && (oe.setAttribute("fill", "none"), oe.setAttribute("stroke", "none")), G = 0; G < ye.length; G++) ne = ye[G], oe.setAttribute(ne, C[ne]);
        return oe;
      }, w.prototype.__setDefaultStyles = function() {
        var x, C, B = Object.keys(_);
        for (x = 0; x < B.length; x++) C = B[x], this[C] = _[C].canvas;
      }, w.prototype.__applyStyleState = function(x) {
        var C, B, G = Object.keys(x);
        for (C = 0; C < G.length; C++) B = G[C], this[B] = x[B];
      }, w.prototype.__getStyleState = function() {
        var x, C, B = {}, G = Object.keys(_);
        for (x = 0; x < G.length; x++) C = G[x], B[C] = this[C];
        return B;
      }, w.prototype.__applyStyleToCurrentElement = function(x) {
        var C = this.__currentElement, B = this.__currentElementsToStyle;
        B && (C.setAttribute(x, ""), C = B.element, B.children.forEach(function(yt) {
          yt.setAttribute(x, "");
        }));
        var G, ne, oe, ye, he, Ae, _e = Object.keys(_);
        for (G = 0; G < _e.length; G++) if (ne = _[_e[G]], oe = this[_e[G]], ne.apply) {
          if (oe instanceof Q) {
            if (oe.__ctx) for (; oe.__ctx.__defs.childNodes.length; ) ye = oe.__ctx.__defs.childNodes[0].getAttribute("id"), this.__ids[ye] = ye, this.__defs.appendChild(oe.__ctx.__defs.childNodes[0]);
            C.setAttribute(ne.apply, l("url(#{id})", {
              id: oe.__root.getAttribute("id")
            }));
          } else if (oe instanceof H) C.setAttribute(ne.apply, l("url(#{id})", {
            id: oe.__root.getAttribute("id")
          }));
          else if (ne.apply.indexOf(x) !== -1 && ne.svg !== oe)
            if (ne.svgAttr !== "stroke" && ne.svgAttr !== "fill" || oe.indexOf("rgba") === -1) {
              var xe = ne.svgAttr;
              if (_e[G] === "globalAlpha" && (xe = x + "-" + ne.svgAttr, C.getAttribute(xe))) continue;
              C.setAttribute(xe, oe);
            } else {
              he = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi, Ae = he.exec(oe), C.setAttribute(ne.svgAttr, l("rgb({r},{g},{b})", {
                r: Ae[1],
                g: Ae[2],
                b: Ae[3]
              }));
              var Se = Ae[4], Oe = this.globalAlpha;
              Oe != null && (Se *= Oe), C.setAttribute(ne.svgAttr + "-opacity", Se);
            }
        }
      }, w.prototype.__closestGroupOrSvg = function(x) {
        return x = x || this.__currentElement, x.nodeName === "g" || x.nodeName === "svg" ? x : this.__closestGroupOrSvg(x.parentNode);
      }, w.prototype.getSerializedSvg = function(x) {
        var C, B, G, ne, oe, ye, he = new XMLSerializer().serializeToString(this.__root);
        if (ye = /xmlns="http:\/\/www\.w3\.org\/2000\/svg".+xmlns="http:\/\/www\.w3\.org\/2000\/svg/gi, ye.test(he) && (he = he.replace('xmlns="http://www.w3.org/2000/svg', 'xmlns:xlink="http://www.w3.org/1999/xlink')), x) for (C = Object.keys(q), B = 0; B < C.length; B++) G = C[B], ne = q[G], oe = new RegExp(G, "gi"), oe.test(he) && (he = he.replace(oe, ne));
        return he;
      }, w.prototype.getSvg = function() {
        return this.__root;
      }, w.prototype.save = function() {
        var x = this.__createElement("g"), C = this.__closestGroupOrSvg();
        this.__groupStack.push(C), C.appendChild(x), this.__currentElement = x, this.__stack.push(this.__getStyleState());
      }, w.prototype.restore = function() {
        this.__currentElement = this.__groupStack.pop(), this.__currentElementsToStyle = null, this.__currentElement || (this.__currentElement = this.__root.childNodes[1]);
        var x = this.__stack.pop();
        this.__applyStyleState(x);
      }, w.prototype.__addTransform = function(x) {
        var C = this.__closestGroupOrSvg();
        if (C.childNodes.length > 0) {
          this.__currentElement.nodeName === "path" && (this.__currentElementsToStyle || (this.__currentElementsToStyle = {
            element: C,
            children: []
          }), this.__currentElementsToStyle.children.push(this.__currentElement), this.__applyCurrentDefaultPath());
          var B = this.__createElement("g");
          C.appendChild(B), this.__currentElement = B;
        }
        var G = this.__currentElement.getAttribute("transform");
        G ? G += " " : G = "", G += x, this.__currentElement.setAttribute("transform", G);
      }, w.prototype.scale = function(x, C) {
        C === void 0 && (C = x), this.__addTransform(l("scale({x},{y})", {
          x,
          y: C
        }));
      }, w.prototype.rotate = function(x) {
        var C = 180 * x / Math.PI;
        this.__addTransform(l("rotate({angle},{cx},{cy})", {
          angle: C,
          cx: 0,
          cy: 0
        }));
      }, w.prototype.translate = function(x, C) {
        this.__addTransform(l("translate({x},{y})", {
          x,
          y: C
        }));
      }, w.prototype.transform = function(x, C, B, G, ne, oe) {
        this.__addTransform(l("matrix({a},{b},{c},{d},{e},{f})", {
          a: x,
          b: C,
          c: B,
          d: G,
          e: ne,
          f: oe
        }));
      }, w.prototype.beginPath = function() {
        var x, C;
        this.__currentDefaultPath = "", this.__currentPosition = {}, x = this.__createElement("path", {}, !0), C = this.__closestGroupOrSvg(), C.appendChild(x), this.__currentElement = x;
      }, w.prototype.__applyCurrentDefaultPath = function() {
        var x = this.__currentElement;
        x.nodeName === "path" ? x.setAttribute("d", this.__currentDefaultPath) : console.error("Attempted to apply path command to node", x.nodeName);
      }, w.prototype.__addPathCommand = function(x) {
        this.__currentDefaultPath += " ", this.__currentDefaultPath += x;
      }, w.prototype.moveTo = function(x, C) {
        this.__currentElement.nodeName !== "path" && this.beginPath(), this.__currentPosition = {
          x,
          y: C
        }, this.__addPathCommand(l("M {x} {y}", {
          x,
          y: C
        }));
      }, w.prototype.closePath = function() {
        this.__currentDefaultPath && this.__addPathCommand("Z");
      }, w.prototype.lineTo = function(x, C) {
        this.__currentPosition = {
          x,
          y: C
        }, this.__currentDefaultPath.indexOf("M") > -1 ? this.__addPathCommand(l("L {x} {y}", {
          x,
          y: C
        })) : this.__addPathCommand(l("M {x} {y}", {
          x,
          y: C
        }));
      }, w.prototype.bezierCurveTo = function(x, C, B, G, ne, oe) {
        this.__currentPosition = {
          x: ne,
          y: oe
        }, this.__addPathCommand(l("C {cp1x} {cp1y} {cp2x} {cp2y} {x} {y}", {
          cp1x: x,
          cp1y: C,
          cp2x: B,
          cp2y: G,
          x: ne,
          y: oe
        }));
      }, w.prototype.quadraticCurveTo = function(x, C, B, G) {
        this.__currentPosition = {
          x: B,
          y: G
        }, this.__addPathCommand(l("Q {cpx} {cpy} {x} {y}", {
          cpx: x,
          cpy: C,
          x: B,
          y: G
        }));
      };
      var K = function(x) {
        var C = Math.sqrt(x[0] * x[0] + x[1] * x[1]);
        return [
          x[0] / C,
          x[1] / C
        ];
      };
      w.prototype.arcTo = function(x, C, B, G, ne) {
        var oe = this.__currentPosition && this.__currentPosition.x, ye = this.__currentPosition && this.__currentPosition.y;
        if (oe !== void 0 && ye !== void 0) {
          if (ne < 0) throw new Error("IndexSizeError: The radius provided (" + ne + ") is negative.");
          if (oe === x && ye === C || x === B && C === G || ne === 0) return void this.lineTo(x, C);
          var he = K([
            oe - x,
            ye - C
          ]), Ae = K([
            B - x,
            G - C
          ]);
          if (he[0] * Ae[1] == he[1] * Ae[0]) return void this.lineTo(x, C);
          var _e = he[0] * Ae[0] + he[1] * Ae[1], xe = Math.acos(Math.abs(_e)), Se = K([
            he[0] + Ae[0],
            he[1] + Ae[1]
          ]), Oe = ne / Math.sin(xe / 2), yt = x + Oe * Se[0], D = C + Oe * Se[1], M = [
            -he[1],
            he[0]
          ], I = [
            Ae[1],
            -Ae[0]
          ], Z = function(we) {
            var ae = we[0];
            return we[1] >= 0 ? Math.acos(ae) : -Math.acos(ae);
          }, X = Z(M), le = Z(I);
          this.lineTo(yt + M[0] * ne, D + M[1] * ne), this.arc(yt, D, ne, X, le);
        }
      }, w.prototype.stroke = function() {
        this.__currentElement.nodeName === "path" && this.__currentElement.setAttribute("paint-order", "fill stroke markers"), this.__applyCurrentDefaultPath(), this.__applyStyleToCurrentElement("stroke");
      }, w.prototype.fill = function() {
        this.__currentElement.nodeName === "path" && this.__currentElement.setAttribute("paint-order", "stroke fill markers"), this.__applyCurrentDefaultPath(), this.__applyStyleToCurrentElement("fill");
      }, w.prototype.rect = function(x, C, B, G) {
        this.__currentElement.nodeName !== "path" && this.beginPath(), this.moveTo(x, C), this.lineTo(x + B, C), this.lineTo(x + B, C + G), this.lineTo(x, C + G), this.lineTo(x, C), this.closePath();
      }, w.prototype.fillRect = function(x, C, B, G) {
        var ne, oe;
        ne = this.__createElement("rect", {
          x,
          y: C,
          width: B,
          height: G,
          "shape-rendering": "crispEdges"
        }, !0), oe = this.__closestGroupOrSvg(), oe.appendChild(ne), this.__currentElement = ne, this.__applyStyleToCurrentElement("fill");
      }, w.prototype.strokeRect = function(x, C, B, G) {
        var ne, oe;
        ne = this.__createElement("rect", {
          x,
          y: C,
          width: B,
          height: G
        }, !0), oe = this.__closestGroupOrSvg(), oe.appendChild(ne), this.__currentElement = ne, this.__applyStyleToCurrentElement("stroke");
      }, w.prototype.__clearCanvas = function() {
        for (var x = this.__closestGroupOrSvg(), C = x.getAttribute("transform"), B = this.__root.childNodes[1], G = B.childNodes, ne = G.length - 1; ne >= 0; ne--) G[ne] && B.removeChild(G[ne]);
        this.__currentElement = B, this.__groupStack = [], C && this.__addTransform(C);
      }, w.prototype.clearRect = function(x, C, B, G) {
        if (x === 0 && C === 0 && B === this.width && G === this.height) return void this.__clearCanvas();
        var ne, oe = this.__closestGroupOrSvg();
        ne = this.__createElement("rect", {
          x,
          y: C,
          width: B,
          height: G,
          fill: "#FFFFFF"
        }, !0), oe.appendChild(ne);
      }, w.prototype.createLinearGradient = function(x, C, B, G) {
        var ne = this.__createElement("linearGradient", {
          id: u(this.__ids),
          x1: x + "px",
          x2: B + "px",
          y1: C + "px",
          y2: G + "px",
          gradientUnits: "userSpaceOnUse"
        }, !1);
        return this.__defs.appendChild(ne), new H(ne, this);
      }, w.prototype.createRadialGradient = function(x, C, B, G, ne, oe) {
        var ye = this.__createElement("radialGradient", {
          id: u(this.__ids),
          cx: G + "px",
          cy: ne + "px",
          r: oe + "px",
          fx: x + "px",
          fy: C + "px",
          gradientUnits: "userSpaceOnUse"
        }, !1);
        return this.__defs.appendChild(ye), new H(ye, this);
      }, w.prototype.__parseFont = function() {
        var x = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\'\"\sa-z0-9]+?)\s*$/i, C = x.exec(this.font), B = {
          style: C[1] || "normal",
          size: C[4] || "10px",
          family: C[6] || "sans-serif",
          weight: C[3] || "normal",
          decoration: C[2] || "normal",
          href: null
        };
        return this.__fontUnderline === "underline" && (B.decoration = "underline"), this.__fontHref && (B.href = this.__fontHref), B;
      }, w.prototype.__wrapTextLink = function(x, C) {
        if (x.href) {
          var B = this.__createElement("a");
          return B.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", x.href), B.appendChild(C), B;
        }
        return C;
      }, w.prototype.__applyText = function(x, C, B, G) {
        var ne = this.__parseFont(), oe = this.__closestGroupOrSvg(), ye = this.__createElement("text", {
          "font-family": ne.family,
          "font-size": ne.size,
          "font-style": ne.style,
          "font-weight": ne.weight,
          "text-decoration": ne.decoration,
          x: C,
          y: B,
          "text-anchor": f(this.textAlign),
          "dominant-baseline": p(this.textBaseline)
        }, !0);
        ye.appendChild(this.__document.createTextNode(x)), this.__currentElement = ye, this.__applyStyleToCurrentElement(G), oe.appendChild(this.__wrapTextLink(ne, ye));
      }, w.prototype.fillText = function(x, C, B) {
        this.__applyText(x, C, B, "fill");
      }, w.prototype.strokeText = function(x, C, B) {
        this.__applyText(x, C, B, "stroke");
      }, w.prototype.measureText = function(x) {
        return this.__ctx.font = this.font, this.__ctx.measureText(x);
      }, w.prototype.arc = function(x, C, B, G, ne, oe) {
        if (G !== ne) {
          G %= 2 * Math.PI, ne %= 2 * Math.PI, G === ne && (ne = (ne + 2 * Math.PI - 1e-3 * (oe ? -1 : 1)) % (2 * Math.PI));
          var ye = x + B * Math.cos(ne), he = C + B * Math.sin(ne), Ae = x + B * Math.cos(G), _e = C + B * Math.sin(G), xe = oe ? 0 : 1, Se = 0, Oe = ne - G;
          Oe < 0 && (Oe += 2 * Math.PI), Se = oe ? Oe > Math.PI ? 0 : 1 : Oe > Math.PI ? 1 : 0, this.lineTo(Ae, _e), this.__addPathCommand(l("A {rx} {ry} {xAxisRotation} {largeArcFlag} {sweepFlag} {endX} {endY}", {
            rx: B,
            ry: B,
            xAxisRotation: 0,
            largeArcFlag: Se,
            sweepFlag: xe,
            endX: ye,
            endY: he
          })), this.__currentPosition = {
            x: ye,
            y: he
          };
        }
      }, w.prototype.clip = function() {
        var x = this.__closestGroupOrSvg(), C = this.__createElement("clipPath"), B = u(this.__ids), G = this.__createElement("g");
        this.__applyCurrentDefaultPath(), x.removeChild(this.__currentElement), C.setAttribute("id", B), C.appendChild(this.__currentElement), this.__defs.appendChild(C), x.setAttribute("clip-path", l("url(#{id})", {
          id: B
        })), x.appendChild(G), this.__currentElement = G;
      }, w.prototype.drawImage = function() {
        var x, C, B, G, ne, oe, ye, he, Ae, _e, xe, Se, Oe, yt, D = Array.prototype.slice.call(arguments), M = D[0], I = 0, Z = 0;
        if (D.length === 3) x = D[1], C = D[2], ne = M.width, oe = M.height, B = ne, G = oe;
        else if (D.length === 5) x = D[1], C = D[2], B = D[3], G = D[4], ne = M.width, oe = M.height;
        else {
          if (D.length !== 9) throw new Error("Invalid number of arguments passed to drawImage: " + arguments.length);
          I = D[1], Z = D[2], ne = D[3], oe = D[4], x = D[5], C = D[6], B = D[7], G = D[8];
        }
        ye = this.__closestGroupOrSvg(), this.__currentElement;
        var X = "translate(" + x + ", " + C + ")";
        if (M instanceof w) {
          if (he = M.getSvg().cloneNode(!0), he.childNodes && he.childNodes.length > 1) {
            for (Ae = he.childNodes[0]; Ae.childNodes.length; ) yt = Ae.childNodes[0].getAttribute("id"), this.__ids[yt] = yt, this.__defs.appendChild(Ae.childNodes[0]);
            if (_e = he.childNodes[1]) {
              var le, we = _e.getAttribute("transform");
              le = we ? we + " " + X : X, _e.setAttribute("transform", le), ye.appendChild(_e);
            }
          }
        } else M.nodeName !== "CANVAS" && M.nodeName !== "IMG" || (xe = this.__createElement("image"), xe.setAttribute("width", B), xe.setAttribute("height", G), xe.setAttribute("preserveAspectRatio", "none"), xe.setAttribute("opacity", this.globalAlpha), (I || Z || ne !== M.width || oe !== M.height) && (Se = this.__document.createElement("canvas"), Se.width = B, Se.height = G, Oe = Se.getContext("2d"), Oe.drawImage(M, I, Z, ne, oe, 0, 0, B, G), M = Se), xe.setAttribute("transform", X), xe.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", M.nodeName === "CANVAS" ? M.toDataURL() : M.originalSrc), ye.appendChild(xe));
      }, w.prototype.createPattern = function(x, C) {
        var B, G = this.__document.createElementNS("http://www.w3.org/2000/svg", "pattern"), ne = u(this.__ids);
        return G.setAttribute("id", ne), G.setAttribute("width", x.width), G.setAttribute("height", x.height), x.nodeName === "CANVAS" || x.nodeName === "IMG" ? (B = this.__document.createElementNS("http://www.w3.org/2000/svg", "image"), B.setAttribute("width", x.width), B.setAttribute("height", x.height), B.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", x.nodeName === "CANVAS" ? x.toDataURL() : x.getAttribute("src")), G.appendChild(B), this.__defs.appendChild(G)) : x instanceof w && (G.appendChild(x.__root.childNodes[1]), this.__defs.appendChild(G)), new Q(G, this);
      }, w.prototype.setLineDash = function(x) {
        x && x.length > 0 ? this.lineDash = x.join(",") : this.lineDash = null;
      }, w.prototype.drawFocusRing = function() {
      }, w.prototype.createImageData = function() {
      }, w.prototype.getImageData = function() {
      }, w.prototype.putImageData = function() {
      }, w.prototype.globalCompositeOperation = function() {
      }, w.prototype.setTransform = function() {
      }, typeof window == "object" && (window.C2S = w), typeof o.exports == "object" && (o.exports = w);
    })(), (function() {
      function l(D, M, I) {
        this.mode = ye.MODE_8BIT_BYTE, this.data = D, this.parsedData = [];
        for (var Z = 0, X = this.data.length; Z < X; Z++) {
          var le = [], we = this.data.charCodeAt(Z);
          M ? le[0] = we : we > 65536 ? (le[0] = 240 | (1835008 & we) >>> 18, le[1] = 128 | (258048 & we) >>> 12, le[2] = 128 | (4032 & we) >>> 6, le[3] = 128 | 63 & we) : we > 2048 ? (le[0] = 224 | (61440 & we) >>> 12, le[1] = 128 | (4032 & we) >>> 6, le[2] = 128 | 63 & we) : we > 128 ? (le[0] = 192 | (1984 & we) >>> 6, le[1] = 128 | 63 & we) : le[0] = we, this.parsedData.push(le);
        }
        this.parsedData = Array.prototype.concat.apply([], this.parsedData), I || this.parsedData.length == this.data.length || (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239));
      }
      function u(D, M) {
        this.typeNumber = D, this.errorCorrectLevel = M, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = [];
      }
      function f(D, M) {
        if (D.length == q) throw new Error(D.length + "/" + M);
        for (var I = 0; I < D.length && D[I] == 0; ) I++;
        this.num = new Array(D.length - I + M);
        for (var Z = 0; Z < D.length - I; Z++) this.num[Z] = D[Z + I];
      }
      function p(D, M) {
        this.totalCount = D, this.dataCount = M;
      }
      function _() {
        this.buffer = [], this.length = 0;
      }
      function w() {
        var D = !1, M = navigator.userAgent;
        if (/android/i.test(M)) {
          D = !0;
          var I = M.toString().match(/android ([0-9]\.[0-9])/i);
          I && I[1] && (D = parseFloat(I[1]));
        }
        return D;
      }
      function H(D, M) {
        for (var I = M.correctLevel, Z = 1, X = Q(D), le = 0, we = Oe.length; le < we; le++) {
          var ae = 0;
          switch (I) {
            case he.L:
              ae = Oe[le][0];
              break;
            case he.M:
              ae = Oe[le][1];
              break;
            case he.Q:
              ae = Oe[le][2];
              break;
            case he.H:
              ae = Oe[le][3];
          }
          if (X <= ae) break;
          Z++;
        }
        if (Z > Oe.length) throw new Error("Too long data. the CorrectLevel." + [
          "M",
          "L",
          "H",
          "Q"
        ][I] + " limit length is " + ae);
        return M.version != 0 && (Z <= M.version ? (Z = M.version, M.runVersion = Z) : (console.warn("QR Code version " + M.version + " too small, run version use " + Z), M.runVersion = Z)), Z;
      }
      function Q(D) {
        var M = encodeURI(D).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
        return M.length + (M.length != D.length ? 3 : 0);
      }
      var q, K, x = typeof n == "object" && n && n.Object === Object && n, C = typeof self == "object" && self && self.Object === Object && self, B = x || C || Function("return this")(), G = s && !s.nodeType && s, ne = G && !0 && o && !o.nodeType && o, oe = B.QRCode;
      l.prototype = {
        getLength: function(D) {
          return this.parsedData.length;
        },
        write: function(D) {
          for (var M = 0, I = this.parsedData.length; M < I; M++) D.put(this.parsedData[M], 8);
        }
      }, u.prototype = {
        addData: function(D, M, I) {
          var Z = new l(D, M, I);
          this.dataList.push(Z), this.dataCache = null;
        },
        isDark: function(D, M) {
          if (D < 0 || this.moduleCount <= D || M < 0 || this.moduleCount <= M) throw new Error(D + "," + M);
          return this.modules[D][M][0];
        },
        getEye: function(D, M) {
          if (D < 0 || this.moduleCount <= D || M < 0 || this.moduleCount <= M) throw new Error(D + "," + M);
          var I = this.modules[D][M];
          if (I[1]) {
            var Z = "P" + I[1] + "_" + I[2];
            return I[2] == "A" && (Z = "A" + I[1]), {
              isDark: I[0],
              type: Z
            };
          }
          return null;
        },
        getModuleCount: function() {
          return this.moduleCount;
        },
        make: function() {
          this.makeImpl(!1, this.getBestMaskPattern());
        },
        makeImpl: function(D, M) {
          this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount);
          for (var I = 0; I < this.moduleCount; I++) {
            this.modules[I] = new Array(this.moduleCount);
            for (var Z = 0; Z < this.moduleCount; Z++) this.modules[I][Z] = [];
          }
          this.setupPositionProbePattern(0, 0, "TL"), this.setupPositionProbePattern(this.moduleCount - 7, 0, "BL"), this.setupPositionProbePattern(0, this.moduleCount - 7, "TR"), this.setupPositionAdjustPattern("A"), this.setupTimingPattern(), this.setupTypeInfo(D, M), this.typeNumber >= 7 && this.setupTypeNumber(D), this.dataCache == null && (this.dataCache = u.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, M);
        },
        setupPositionProbePattern: function(D, M, I) {
          for (var Z = -1; Z <= 7; Z++) if (!(D + Z <= -1 || this.moduleCount <= D + Z)) for (var X = -1; X <= 7; X++) M + X <= -1 || this.moduleCount <= M + X || (0 <= Z && Z <= 6 && (X == 0 || X == 6) || 0 <= X && X <= 6 && (Z == 0 || Z == 6) || 2 <= Z && Z <= 4 && 2 <= X && X <= 4 ? (this.modules[D + Z][M + X][0] = !0, this.modules[D + Z][M + X][2] = I, this.modules[D + Z][M + X][1] = Z == -0 || X == -0 || Z == 6 || X == 6 ? "O" : "I") : this.modules[D + Z][M + X][0] = !1);
        },
        getBestMaskPattern: function() {
          for (var D = 0, M = 0, I = 0; I < 8; I++) {
            this.makeImpl(!0, I);
            var Z = _e.getLostPoint(this);
            (I == 0 || D > Z) && (D = Z, M = I);
          }
          return M;
        },
        createMovieClip: function(D, M, I) {
          var Z = D.createEmptyMovieClip(M, I);
          this.make();
          for (var X = 0; X < this.modules.length; X++) for (var le = 1 * X, we = 0; we < this.modules[X].length; we++) {
            var ae = 1 * we, z = this.modules[X][we][0];
            z && (Z.beginFill(0, 100), Z.moveTo(ae, le), Z.lineTo(ae + 1, le), Z.lineTo(ae + 1, le + 1), Z.lineTo(ae, le + 1), Z.endFill());
          }
          return Z;
        },
        setupTimingPattern: function() {
          for (var D = 8; D < this.moduleCount - 8; D++) this.modules[D][6][0] == null && (this.modules[D][6][0] = D % 2 == 0);
          for (var M = 8; M < this.moduleCount - 8; M++) this.modules[6][M][0] == null && (this.modules[6][M][0] = M % 2 == 0);
        },
        setupPositionAdjustPattern: function(D) {
          for (var M = _e.getPatternPosition(this.typeNumber), I = 0; I < M.length; I++) for (var Z = 0; Z < M.length; Z++) {
            var X = M[I], le = M[Z];
            if (this.modules[X][le][0] == null) for (var we = -2; we <= 2; we++) for (var ae = -2; ae <= 2; ae++) we == -2 || we == 2 || ae == -2 || ae == 2 || we == 0 && ae == 0 ? (this.modules[X + we][le + ae][0] = !0, this.modules[X + we][le + ae][2] = D, this.modules[X + we][le + ae][1] = we == -2 || ae == -2 || we == 2 || ae == 2 ? "O" : "I") : this.modules[X + we][le + ae][0] = !1;
          }
        },
        setupTypeNumber: function(D) {
          for (var M = _e.getBCHTypeNumber(this.typeNumber), I = 0; I < 18; I++) {
            var Z = !D && (M >> I & 1) == 1;
            this.modules[Math.floor(I / 3)][I % 3 + this.moduleCount - 8 - 3][0] = Z;
          }
          for (var I = 0; I < 18; I++) {
            var Z = !D && (M >> I & 1) == 1;
            this.modules[I % 3 + this.moduleCount - 8 - 3][Math.floor(I / 3)][0] = Z;
          }
        },
        setupTypeInfo: function(D, M) {
          for (var I = this.errorCorrectLevel << 3 | M, Z = _e.getBCHTypeInfo(I), X = 0; X < 15; X++) {
            var le = !D && (Z >> X & 1) == 1;
            X < 6 ? this.modules[X][8][0] = le : X < 8 ? this.modules[X + 1][8][0] = le : this.modules[this.moduleCount - 15 + X][8][0] = le;
          }
          for (var X = 0; X < 15; X++) {
            var le = !D && (Z >> X & 1) == 1;
            X < 8 ? this.modules[8][this.moduleCount - X - 1][0] = le : X < 9 ? this.modules[8][15 - X - 1 + 1][0] = le : this.modules[8][15 - X - 1][0] = le;
          }
          this.modules[this.moduleCount - 8][8][0] = !D;
        },
        mapData: function(D, M) {
          for (var I = -1, Z = this.moduleCount - 1, X = 7, le = 0, we = this.moduleCount - 1; we > 0; we -= 2) for (we == 6 && we--; ; ) {
            for (var ae = 0; ae < 2; ae++) if (this.modules[Z][we - ae][0] == null) {
              var z = !1;
              le < D.length && (z = (D[le] >>> X & 1) == 1);
              var xt = _e.getMask(M, Z, we - ae);
              xt && (z = !z), this.modules[Z][we - ae][0] = z, X--, X == -1 && (le++, X = 7);
            }
            if ((Z += I) < 0 || this.moduleCount <= Z) {
              Z -= I, I = -I;
              break;
            }
          }
        }
      }, u.PAD0 = 236, u.PAD1 = 17, u.createData = function(D, M, I) {
        for (var Z = p.getRSBlocks(D, M), X = new _(), le = 0; le < I.length; le++) {
          var we = I[le];
          X.put(we.mode, 4), X.put(we.getLength(), _e.getLengthInBits(we.mode, D)), we.write(X);
        }
        for (var ae = 0, le = 0; le < Z.length; le++) ae += Z[le].dataCount;
        if (X.getLengthInBits() > 8 * ae) throw new Error("code length overflow. (" + X.getLengthInBits() + ">" + 8 * ae + ")");
        for (X.getLengthInBits() + 4 <= 8 * ae && X.put(0, 4); X.getLengthInBits() % 8 != 0; ) X.putBit(!1);
        for (; !(X.getLengthInBits() >= 8 * ae || (X.put(u.PAD0, 8), X.getLengthInBits() >= 8 * ae)); )
          X.put(u.PAD1, 8);
        return u.createBytes(X, Z);
      }, u.createBytes = function(D, M) {
        for (var I = 0, Z = 0, X = 0, le = new Array(M.length), we = new Array(M.length), ae = 0; ae < M.length; ae++) {
          var z = M[ae].dataCount, xt = M[ae].totalCount - z;
          Z = Math.max(Z, z), X = Math.max(X, xt), le[ae] = new Array(z);
          for (var et = 0; et < le[ae].length; et++) le[ae][et] = 255 & D.buffer[et + I];
          I += z;
          var Wt = _e.getErrorCorrectPolynomial(xt), Fe = new f(le[ae], Wt.getLength() - 1), Ln = Fe.mod(Wt);
          we[ae] = new Array(Wt.getLength() - 1);
          for (var et = 0; et < we[ae].length; et++) {
            var $n = et + Ln.getLength() - we[ae].length;
            we[ae][et] = $n >= 0 ? Ln.get($n) : 0;
          }
        }
        for (var Tr = 0, et = 0; et < M.length; et++) Tr += M[et].totalCount;
        for (var zn = new Array(Tr), dn = 0, et = 0; et < Z; et++) for (var ae = 0; ae < M.length; ae++) et < le[ae].length && (zn[dn++] = le[ae][et]);
        for (var et = 0; et < X; et++) for (var ae = 0; ae < M.length; ae++) et < we[ae].length && (zn[dn++] = we[ae][et]);
        return zn;
      };
      for (var ye = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8
      }, he = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
      }, Ae = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      }, _e = {
        PATTERN_POSITION_TABLE: [
          [],
          [
            6,
            18
          ],
          [
            6,
            22
          ],
          [
            6,
            26
          ],
          [
            6,
            30
          ],
          [
            6,
            34
          ],
          [
            6,
            22,
            38
          ],
          [
            6,
            24,
            42
          ],
          [
            6,
            26,
            46
          ],
          [
            6,
            28,
            50
          ],
          [
            6,
            30,
            54
          ],
          [
            6,
            32,
            58
          ],
          [
            6,
            34,
            62
          ],
          [
            6,
            26,
            46,
            66
          ],
          [
            6,
            26,
            48,
            70
          ],
          [
            6,
            26,
            50,
            74
          ],
          [
            6,
            30,
            54,
            78
          ],
          [
            6,
            30,
            56,
            82
          ],
          [
            6,
            30,
            58,
            86
          ],
          [
            6,
            34,
            62,
            90
          ],
          [
            6,
            28,
            50,
            72,
            94
          ],
          [
            6,
            26,
            50,
            74,
            98
          ],
          [
            6,
            30,
            54,
            78,
            102
          ],
          [
            6,
            28,
            54,
            80,
            106
          ],
          [
            6,
            32,
            58,
            84,
            110
          ],
          [
            6,
            30,
            58,
            86,
            114
          ],
          [
            6,
            34,
            62,
            90,
            118
          ],
          [
            6,
            26,
            50,
            74,
            98,
            122
          ],
          [
            6,
            30,
            54,
            78,
            102,
            126
          ],
          [
            6,
            26,
            52,
            78,
            104,
            130
          ],
          [
            6,
            30,
            56,
            82,
            108,
            134
          ],
          [
            6,
            34,
            60,
            86,
            112,
            138
          ],
          [
            6,
            30,
            58,
            86,
            114,
            142
          ],
          [
            6,
            34,
            62,
            90,
            118,
            146
          ],
          [
            6,
            30,
            54,
            78,
            102,
            126,
            150
          ],
          [
            6,
            24,
            50,
            76,
            102,
            128,
            154
          ],
          [
            6,
            28,
            54,
            80,
            106,
            132,
            158
          ],
          [
            6,
            32,
            58,
            84,
            110,
            136,
            162
          ],
          [
            6,
            26,
            54,
            82,
            110,
            138,
            166
          ],
          [
            6,
            30,
            58,
            86,
            114,
            142,
            170
          ]
        ],
        G15: 1335,
        G18: 7973,
        G15_MASK: 21522,
        getBCHTypeInfo: function(D) {
          for (var M = D << 10; _e.getBCHDigit(M) - _e.getBCHDigit(_e.G15) >= 0; ) M ^= _e.G15 << _e.getBCHDigit(M) - _e.getBCHDigit(_e.G15);
          return (D << 10 | M) ^ _e.G15_MASK;
        },
        getBCHTypeNumber: function(D) {
          for (var M = D << 12; _e.getBCHDigit(M) - _e.getBCHDigit(_e.G18) >= 0; ) M ^= _e.G18 << _e.getBCHDigit(M) - _e.getBCHDigit(_e.G18);
          return D << 12 | M;
        },
        getBCHDigit: function(D) {
          for (var M = 0; D != 0; ) M++, D >>>= 1;
          return M;
        },
        getPatternPosition: function(D) {
          return _e.PATTERN_POSITION_TABLE[D - 1];
        },
        getMask: function(D, M, I) {
          switch (D) {
            case Ae.PATTERN000:
              return (M + I) % 2 == 0;
            case Ae.PATTERN001:
              return M % 2 == 0;
            case Ae.PATTERN010:
              return I % 3 == 0;
            case Ae.PATTERN011:
              return (M + I) % 3 == 0;
            case Ae.PATTERN100:
              return (Math.floor(M / 2) + Math.floor(I / 3)) % 2 == 0;
            case Ae.PATTERN101:
              return M * I % 2 + M * I % 3 == 0;
            case Ae.PATTERN110:
              return (M * I % 2 + M * I % 3) % 2 == 0;
            case Ae.PATTERN111:
              return (M * I % 3 + (M + I) % 2) % 2 == 0;
            default:
              throw new Error("bad maskPattern:" + D);
          }
        },
        getErrorCorrectPolynomial: function(D) {
          for (var M = new f([
            1
          ], 0), I = 0; I < D; I++) M = M.multiply(new f([
            1,
            xe.gexp(I)
          ], 0));
          return M;
        },
        getLengthInBits: function(D, M) {
          if (1 <= M && M < 10) switch (D) {
            case ye.MODE_NUMBER:
              return 10;
            case ye.MODE_ALPHA_NUM:
              return 9;
            case ye.MODE_8BIT_BYTE:
            case ye.MODE_KANJI:
              return 8;
            default:
              throw new Error("mode:" + D);
          }
          else if (M < 27) switch (D) {
            case ye.MODE_NUMBER:
              return 12;
            case ye.MODE_ALPHA_NUM:
              return 11;
            case ye.MODE_8BIT_BYTE:
              return 16;
            case ye.MODE_KANJI:
              return 10;
            default:
              throw new Error("mode:" + D);
          }
          else {
            if (!(M < 41)) throw new Error("type:" + M);
            switch (D) {
              case ye.MODE_NUMBER:
                return 14;
              case ye.MODE_ALPHA_NUM:
                return 13;
              case ye.MODE_8BIT_BYTE:
                return 16;
              case ye.MODE_KANJI:
                return 12;
              default:
                throw new Error("mode:" + D);
            }
          }
        },
        getLostPoint: function(D) {
          for (var M = D.getModuleCount(), I = 0, Z = 0; Z < M; Z++) for (var X = 0; X < M; X++) {
            for (var le = 0, we = D.isDark(Z, X), ae = -1; ae <= 1; ae++) if (!(Z + ae < 0 || M <= Z + ae)) for (var z = -1; z <= 1; z++) X + z < 0 || M <= X + z || ae == 0 && z == 0 || we == D.isDark(Z + ae, X + z) && le++;
            le > 5 && (I += 3 + le - 5);
          }
          for (var Z = 0; Z < M - 1; Z++) for (var X = 0; X < M - 1; X++) {
            var xt = 0;
            D.isDark(Z, X) && xt++, D.isDark(Z + 1, X) && xt++, D.isDark(Z, X + 1) && xt++, D.isDark(Z + 1, X + 1) && xt++, xt != 0 && xt != 4 || (I += 3);
          }
          for (var Z = 0; Z < M; Z++) for (var X = 0; X < M - 6; X++) D.isDark(Z, X) && !D.isDark(Z, X + 1) && D.isDark(Z, X + 2) && D.isDark(Z, X + 3) && D.isDark(Z, X + 4) && !D.isDark(Z, X + 5) && D.isDark(Z, X + 6) && (I += 40);
          for (var X = 0; X < M; X++) for (var Z = 0; Z < M - 6; Z++) D.isDark(Z, X) && !D.isDark(Z + 1, X) && D.isDark(Z + 2, X) && D.isDark(Z + 3, X) && D.isDark(Z + 4, X) && !D.isDark(Z + 5, X) && D.isDark(Z + 6, X) && (I += 40);
          for (var et = 0, X = 0; X < M; X++) for (var Z = 0; Z < M; Z++) D.isDark(Z, X) && et++;
          return I += Math.abs(100 * et / M / M - 50) / 5 * 10;
        }
      }, xe = {
        glog: function(D) {
          if (D < 1) throw new Error("glog(" + D + ")");
          return xe.LOG_TABLE[D];
        },
        gexp: function(D) {
          for (; D < 0; ) D += 255;
          for (; D >= 256; ) D -= 255;
          return xe.EXP_TABLE[D];
        },
        EXP_TABLE: new Array(256),
        LOG_TABLE: new Array(256)
      }, Se = 0; Se < 8; Se++) xe.EXP_TABLE[Se] = 1 << Se;
      for (var Se = 8; Se < 256; Se++) xe.EXP_TABLE[Se] = xe.EXP_TABLE[Se - 4] ^ xe.EXP_TABLE[Se - 5] ^ xe.EXP_TABLE[Se - 6] ^ xe.EXP_TABLE[Se - 8];
      for (var Se = 0; Se < 255; Se++) xe.LOG_TABLE[xe.EXP_TABLE[Se]] = Se;
      f.prototype = {
        get: function(D) {
          return this.num[D];
        },
        getLength: function() {
          return this.num.length;
        },
        multiply: function(D) {
          for (var M = new Array(this.getLength() + D.getLength() - 1), I = 0; I < this.getLength(); I++) for (var Z = 0; Z < D.getLength(); Z++) M[I + Z] ^= xe.gexp(xe.glog(this.get(I)) + xe.glog(D.get(Z)));
          return new f(M, 0);
        },
        mod: function(D) {
          if (this.getLength() - D.getLength() < 0) return this;
          for (var M = xe.glog(this.get(0)) - xe.glog(D.get(0)), I = new Array(this.getLength()), Z = 0; Z < this.getLength(); Z++) I[Z] = this.get(Z);
          for (var Z = 0; Z < D.getLength(); Z++) I[Z] ^= xe.gexp(xe.glog(D.get(Z)) + M);
          return new f(I, 0).mod(D);
        }
      }, p.RS_BLOCK_TABLE = [
        [
          1,
          26,
          19
        ],
        [
          1,
          26,
          16
        ],
        [
          1,
          26,
          13
        ],
        [
          1,
          26,
          9
        ],
        [
          1,
          44,
          34
        ],
        [
          1,
          44,
          28
        ],
        [
          1,
          44,
          22
        ],
        [
          1,
          44,
          16
        ],
        [
          1,
          70,
          55
        ],
        [
          1,
          70,
          44
        ],
        [
          2,
          35,
          17
        ],
        [
          2,
          35,
          13
        ],
        [
          1,
          100,
          80
        ],
        [
          2,
          50,
          32
        ],
        [
          2,
          50,
          24
        ],
        [
          4,
          25,
          9
        ],
        [
          1,
          134,
          108
        ],
        [
          2,
          67,
          43
        ],
        [
          2,
          33,
          15,
          2,
          34,
          16
        ],
        [
          2,
          33,
          11,
          2,
          34,
          12
        ],
        [
          2,
          86,
          68
        ],
        [
          4,
          43,
          27
        ],
        [
          4,
          43,
          19
        ],
        [
          4,
          43,
          15
        ],
        [
          2,
          98,
          78
        ],
        [
          4,
          49,
          31
        ],
        [
          2,
          32,
          14,
          4,
          33,
          15
        ],
        [
          4,
          39,
          13,
          1,
          40,
          14
        ],
        [
          2,
          121,
          97
        ],
        [
          2,
          60,
          38,
          2,
          61,
          39
        ],
        [
          4,
          40,
          18,
          2,
          41,
          19
        ],
        [
          4,
          40,
          14,
          2,
          41,
          15
        ],
        [
          2,
          146,
          116
        ],
        [
          3,
          58,
          36,
          2,
          59,
          37
        ],
        [
          4,
          36,
          16,
          4,
          37,
          17
        ],
        [
          4,
          36,
          12,
          4,
          37,
          13
        ],
        [
          2,
          86,
          68,
          2,
          87,
          69
        ],
        [
          4,
          69,
          43,
          1,
          70,
          44
        ],
        [
          6,
          43,
          19,
          2,
          44,
          20
        ],
        [
          6,
          43,
          15,
          2,
          44,
          16
        ],
        [
          4,
          101,
          81
        ],
        [
          1,
          80,
          50,
          4,
          81,
          51
        ],
        [
          4,
          50,
          22,
          4,
          51,
          23
        ],
        [
          3,
          36,
          12,
          8,
          37,
          13
        ],
        [
          2,
          116,
          92,
          2,
          117,
          93
        ],
        [
          6,
          58,
          36,
          2,
          59,
          37
        ],
        [
          4,
          46,
          20,
          6,
          47,
          21
        ],
        [
          7,
          42,
          14,
          4,
          43,
          15
        ],
        [
          4,
          133,
          107
        ],
        [
          8,
          59,
          37,
          1,
          60,
          38
        ],
        [
          8,
          44,
          20,
          4,
          45,
          21
        ],
        [
          12,
          33,
          11,
          4,
          34,
          12
        ],
        [
          3,
          145,
          115,
          1,
          146,
          116
        ],
        [
          4,
          64,
          40,
          5,
          65,
          41
        ],
        [
          11,
          36,
          16,
          5,
          37,
          17
        ],
        [
          11,
          36,
          12,
          5,
          37,
          13
        ],
        [
          5,
          109,
          87,
          1,
          110,
          88
        ],
        [
          5,
          65,
          41,
          5,
          66,
          42
        ],
        [
          5,
          54,
          24,
          7,
          55,
          25
        ],
        [
          11,
          36,
          12,
          7,
          37,
          13
        ],
        [
          5,
          122,
          98,
          1,
          123,
          99
        ],
        [
          7,
          73,
          45,
          3,
          74,
          46
        ],
        [
          15,
          43,
          19,
          2,
          44,
          20
        ],
        [
          3,
          45,
          15,
          13,
          46,
          16
        ],
        [
          1,
          135,
          107,
          5,
          136,
          108
        ],
        [
          10,
          74,
          46,
          1,
          75,
          47
        ],
        [
          1,
          50,
          22,
          15,
          51,
          23
        ],
        [
          2,
          42,
          14,
          17,
          43,
          15
        ],
        [
          5,
          150,
          120,
          1,
          151,
          121
        ],
        [
          9,
          69,
          43,
          4,
          70,
          44
        ],
        [
          17,
          50,
          22,
          1,
          51,
          23
        ],
        [
          2,
          42,
          14,
          19,
          43,
          15
        ],
        [
          3,
          141,
          113,
          4,
          142,
          114
        ],
        [
          3,
          70,
          44,
          11,
          71,
          45
        ],
        [
          17,
          47,
          21,
          4,
          48,
          22
        ],
        [
          9,
          39,
          13,
          16,
          40,
          14
        ],
        [
          3,
          135,
          107,
          5,
          136,
          108
        ],
        [
          3,
          67,
          41,
          13,
          68,
          42
        ],
        [
          15,
          54,
          24,
          5,
          55,
          25
        ],
        [
          15,
          43,
          15,
          10,
          44,
          16
        ],
        [
          4,
          144,
          116,
          4,
          145,
          117
        ],
        [
          17,
          68,
          42
        ],
        [
          17,
          50,
          22,
          6,
          51,
          23
        ],
        [
          19,
          46,
          16,
          6,
          47,
          17
        ],
        [
          2,
          139,
          111,
          7,
          140,
          112
        ],
        [
          17,
          74,
          46
        ],
        [
          7,
          54,
          24,
          16,
          55,
          25
        ],
        [
          34,
          37,
          13
        ],
        [
          4,
          151,
          121,
          5,
          152,
          122
        ],
        [
          4,
          75,
          47,
          14,
          76,
          48
        ],
        [
          11,
          54,
          24,
          14,
          55,
          25
        ],
        [
          16,
          45,
          15,
          14,
          46,
          16
        ],
        [
          6,
          147,
          117,
          4,
          148,
          118
        ],
        [
          6,
          73,
          45,
          14,
          74,
          46
        ],
        [
          11,
          54,
          24,
          16,
          55,
          25
        ],
        [
          30,
          46,
          16,
          2,
          47,
          17
        ],
        [
          8,
          132,
          106,
          4,
          133,
          107
        ],
        [
          8,
          75,
          47,
          13,
          76,
          48
        ],
        [
          7,
          54,
          24,
          22,
          55,
          25
        ],
        [
          22,
          45,
          15,
          13,
          46,
          16
        ],
        [
          10,
          142,
          114,
          2,
          143,
          115
        ],
        [
          19,
          74,
          46,
          4,
          75,
          47
        ],
        [
          28,
          50,
          22,
          6,
          51,
          23
        ],
        [
          33,
          46,
          16,
          4,
          47,
          17
        ],
        [
          8,
          152,
          122,
          4,
          153,
          123
        ],
        [
          22,
          73,
          45,
          3,
          74,
          46
        ],
        [
          8,
          53,
          23,
          26,
          54,
          24
        ],
        [
          12,
          45,
          15,
          28,
          46,
          16
        ],
        [
          3,
          147,
          117,
          10,
          148,
          118
        ],
        [
          3,
          73,
          45,
          23,
          74,
          46
        ],
        [
          4,
          54,
          24,
          31,
          55,
          25
        ],
        [
          11,
          45,
          15,
          31,
          46,
          16
        ],
        [
          7,
          146,
          116,
          7,
          147,
          117
        ],
        [
          21,
          73,
          45,
          7,
          74,
          46
        ],
        [
          1,
          53,
          23,
          37,
          54,
          24
        ],
        [
          19,
          45,
          15,
          26,
          46,
          16
        ],
        [
          5,
          145,
          115,
          10,
          146,
          116
        ],
        [
          19,
          75,
          47,
          10,
          76,
          48
        ],
        [
          15,
          54,
          24,
          25,
          55,
          25
        ],
        [
          23,
          45,
          15,
          25,
          46,
          16
        ],
        [
          13,
          145,
          115,
          3,
          146,
          116
        ],
        [
          2,
          74,
          46,
          29,
          75,
          47
        ],
        [
          42,
          54,
          24,
          1,
          55,
          25
        ],
        [
          23,
          45,
          15,
          28,
          46,
          16
        ],
        [
          17,
          145,
          115
        ],
        [
          10,
          74,
          46,
          23,
          75,
          47
        ],
        [
          10,
          54,
          24,
          35,
          55,
          25
        ],
        [
          19,
          45,
          15,
          35,
          46,
          16
        ],
        [
          17,
          145,
          115,
          1,
          146,
          116
        ],
        [
          14,
          74,
          46,
          21,
          75,
          47
        ],
        [
          29,
          54,
          24,
          19,
          55,
          25
        ],
        [
          11,
          45,
          15,
          46,
          46,
          16
        ],
        [
          13,
          145,
          115,
          6,
          146,
          116
        ],
        [
          14,
          74,
          46,
          23,
          75,
          47
        ],
        [
          44,
          54,
          24,
          7,
          55,
          25
        ],
        [
          59,
          46,
          16,
          1,
          47,
          17
        ],
        [
          12,
          151,
          121,
          7,
          152,
          122
        ],
        [
          12,
          75,
          47,
          26,
          76,
          48
        ],
        [
          39,
          54,
          24,
          14,
          55,
          25
        ],
        [
          22,
          45,
          15,
          41,
          46,
          16
        ],
        [
          6,
          151,
          121,
          14,
          152,
          122
        ],
        [
          6,
          75,
          47,
          34,
          76,
          48
        ],
        [
          46,
          54,
          24,
          10,
          55,
          25
        ],
        [
          2,
          45,
          15,
          64,
          46,
          16
        ],
        [
          17,
          152,
          122,
          4,
          153,
          123
        ],
        [
          29,
          74,
          46,
          14,
          75,
          47
        ],
        [
          49,
          54,
          24,
          10,
          55,
          25
        ],
        [
          24,
          45,
          15,
          46,
          46,
          16
        ],
        [
          4,
          152,
          122,
          18,
          153,
          123
        ],
        [
          13,
          74,
          46,
          32,
          75,
          47
        ],
        [
          48,
          54,
          24,
          14,
          55,
          25
        ],
        [
          42,
          45,
          15,
          32,
          46,
          16
        ],
        [
          20,
          147,
          117,
          4,
          148,
          118
        ],
        [
          40,
          75,
          47,
          7,
          76,
          48
        ],
        [
          43,
          54,
          24,
          22,
          55,
          25
        ],
        [
          10,
          45,
          15,
          67,
          46,
          16
        ],
        [
          19,
          148,
          118,
          6,
          149,
          119
        ],
        [
          18,
          75,
          47,
          31,
          76,
          48
        ],
        [
          34,
          54,
          24,
          34,
          55,
          25
        ],
        [
          20,
          45,
          15,
          61,
          46,
          16
        ]
      ], p.getRSBlocks = function(D, M) {
        var I = p.getRsBlockTable(D, M);
        if (I == q) throw new Error("bad rs block @ typeNumber:" + D + "/errorCorrectLevel:" + M);
        for (var Z = I.length / 3, X = [], le = 0; le < Z; le++) for (var we = I[3 * le + 0], ae = I[3 * le + 1], z = I[3 * le + 2], xt = 0; xt < we; xt++) X.push(new p(ae, z));
        return X;
      }, p.getRsBlockTable = function(D, M) {
        switch (M) {
          case he.L:
            return p.RS_BLOCK_TABLE[4 * (D - 1) + 0];
          case he.M:
            return p.RS_BLOCK_TABLE[4 * (D - 1) + 1];
          case he.Q:
            return p.RS_BLOCK_TABLE[4 * (D - 1) + 2];
          case he.H:
            return p.RS_BLOCK_TABLE[4 * (D - 1) + 3];
          default:
            return q;
        }
      }, _.prototype = {
        get: function(D) {
          var M = Math.floor(D / 8);
          return (this.buffer[M] >>> 7 - D % 8 & 1) == 1;
        },
        put: function(D, M) {
          for (var I = 0; I < M; I++) this.putBit((D >>> M - I - 1 & 1) == 1);
        },
        getLengthInBits: function() {
          return this.length;
        },
        putBit: function(D) {
          var M = Math.floor(this.length / 8);
          this.buffer.length <= M && this.buffer.push(0), D && (this.buffer[M] |= 128 >>> this.length % 8), this.length++;
        }
      };
      var Oe = [
        [
          17,
          14,
          11,
          7
        ],
        [
          32,
          26,
          20,
          14
        ],
        [
          53,
          42,
          32,
          24
        ],
        [
          78,
          62,
          46,
          34
        ],
        [
          106,
          84,
          60,
          44
        ],
        [
          134,
          106,
          74,
          58
        ],
        [
          154,
          122,
          86,
          64
        ],
        [
          192,
          152,
          108,
          84
        ],
        [
          230,
          180,
          130,
          98
        ],
        [
          271,
          213,
          151,
          119
        ],
        [
          321,
          251,
          177,
          137
        ],
        [
          367,
          287,
          203,
          155
        ],
        [
          425,
          331,
          241,
          177
        ],
        [
          458,
          362,
          258,
          194
        ],
        [
          520,
          412,
          292,
          220
        ],
        [
          586,
          450,
          322,
          250
        ],
        [
          644,
          504,
          364,
          280
        ],
        [
          718,
          560,
          394,
          310
        ],
        [
          792,
          624,
          442,
          338
        ],
        [
          858,
          666,
          482,
          382
        ],
        [
          929,
          711,
          509,
          403
        ],
        [
          1003,
          779,
          565,
          439
        ],
        [
          1091,
          857,
          611,
          461
        ],
        [
          1171,
          911,
          661,
          511
        ],
        [
          1273,
          997,
          715,
          535
        ],
        [
          1367,
          1059,
          751,
          593
        ],
        [
          1465,
          1125,
          805,
          625
        ],
        [
          1528,
          1190,
          868,
          658
        ],
        [
          1628,
          1264,
          908,
          698
        ],
        [
          1732,
          1370,
          982,
          742
        ],
        [
          1840,
          1452,
          1030,
          790
        ],
        [
          1952,
          1538,
          1112,
          842
        ],
        [
          2068,
          1628,
          1168,
          898
        ],
        [
          2188,
          1722,
          1228,
          958
        ],
        [
          2303,
          1809,
          1283,
          983
        ],
        [
          2431,
          1911,
          1351,
          1051
        ],
        [
          2563,
          1989,
          1423,
          1093
        ],
        [
          2699,
          2099,
          1499,
          1139
        ],
        [
          2809,
          2213,
          1579,
          1219
        ],
        [
          2953,
          2331,
          1663,
          1273
        ]
      ], yt = /* @__PURE__ */ (function() {
        return typeof CanvasRenderingContext2D < "u";
      })() ? (function() {
        function D() {
          if (this._htOption.drawer == "svg") {
            var le = this._oContext.getSerializedSvg(!0);
            this.dataURL = le, this._el.innerHTML = le;
          } else try {
            var we = this._elCanvas.toDataURL("image/png");
            this.dataURL = we;
          } catch (ae) {
            console.error(ae);
          }
          this._htOption.onRenderingEnd && (this.dataURL || console.error("Can not get base64 data, please check: 1. Published the page and image to the server 2. The image request support CORS 3. Configured `crossOrigin:'anonymous'` option"), this._htOption.onRenderingEnd(this._htOption, this.dataURL));
        }
        function M(le, we) {
          var ae = this;
          if (ae._fFail = we, ae._fSuccess = le, ae._bSupportDataURI === null) {
            var z = document.createElement("img"), xt = function() {
              ae._bSupportDataURI = !1, ae._fFail && ae._fFail.call(ae);
            }, et = function() {
              ae._bSupportDataURI = !0, ae._fSuccess && ae._fSuccess.call(ae);
            };
            return z.onabort = xt, z.onerror = xt, z.onload = et, void (z.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==");
          }
          ae._bSupportDataURI === !0 && ae._fSuccess ? ae._fSuccess.call(ae) : ae._bSupportDataURI === !1 && ae._fFail && ae._fFail.call(ae);
        }
        if (B._android && B._android <= 2.1) {
          var I = 1 / window.devicePixelRatio, Z = CanvasRenderingContext2D.prototype.drawImage;
          CanvasRenderingContext2D.prototype.drawImage = function(le, we, ae, z, xt, et, Wt, Fe, Ln) {
            if ("nodeName" in le && /img/i.test(le.nodeName)) for (var $n = arguments.length - 1; $n >= 1; $n--) arguments[$n] = arguments[$n] * I;
            else Fe === void 0 && (arguments[1] *= I, arguments[2] *= I, arguments[3] *= I, arguments[4] *= I);
            Z.apply(this, arguments);
          };
        }
        var X = function(le, we) {
          this._bIsPainted = !1, this._android = w(), this._el = le, this._htOption = we, this._htOption.drawer == "svg" ? (this._oContext = {}, this._elCanvas = {}) : (this._elCanvas = document.createElement("canvas"), this._el.appendChild(this._elCanvas), this._oContext = this._elCanvas.getContext("2d")), this._bSupportDataURI = null, this.dataURL = null;
        };
        return X.prototype.draw = function(le) {
          function we() {
            z.quietZone > 0 && z.quietZoneColor && (Fe.lineWidth = 0, Fe.fillStyle = z.quietZoneColor, Fe.fillRect(0, 0, Ln._elCanvas.width, z.quietZone), Fe.fillRect(0, z.quietZone, z.quietZone, Ln._elCanvas.height - 2 * z.quietZone), Fe.fillRect(Ln._elCanvas.width - z.quietZone, z.quietZone, z.quietZone, Ln._elCanvas.height - 2 * z.quietZone), Fe.fillRect(0, Ln._elCanvas.height - z.quietZone, Ln._elCanvas.width, z.quietZone));
          }
          function ae(Tr) {
            function zn(rr) {
              var un = Math.round(z.width / 3.5), On = Math.round(z.height / 3.5);
              un !== On && (un = On), z.logoMaxWidth ? un = Math.round(z.logoMaxWidth) : z.logoWidth && (un = Math.round(z.logoWidth)), z.logoMaxHeight ? On = Math.round(z.logoMaxHeight) : z.logoHeight && (On = Math.round(z.logoHeight));
              var Yr, Xr;
              rr.naturalWidth === void 0 ? (Yr = rr.width, Xr = rr.height) : (Yr = rr.naturalWidth, Xr = rr.naturalHeight), (z.logoMaxWidth || z.logoMaxHeight) && (z.logoMaxWidth && Yr <= un && (un = Yr), z.logoMaxHeight && Xr <= On && (On = Xr), Yr <= un && Xr <= On && (un = Yr, On = Xr));
              var ba = (z.width + 2 * z.quietZone - un) / 2, ma = (z.height + z.titleHeight + 2 * z.quietZone - On) / 2, xc = Math.min(un / Yr, On / Xr), ya = Yr * xc, wa = Xr * xc;
              (z.logoMaxWidth || z.logoMaxHeight) && (un = ya, On = wa, ba = (z.width + 2 * z.quietZone - un) / 2, ma = (z.height + z.titleHeight + 2 * z.quietZone - On) / 2), z.logoBackgroundTransparent || (Fe.fillStyle = z.logoBackgroundColor, Fe.fillRect(ba, ma, un, On));
              var Tp = Fe.imageSmoothingQuality, Lp = Fe.imageSmoothingEnabled;
              Fe.imageSmoothingEnabled = !0, Fe.imageSmoothingQuality = "high", Fe.drawImage(rr, ba + (un - ya) / 2, ma + (On - wa) / 2, ya, wa), Fe.imageSmoothingEnabled = Lp, Fe.imageSmoothingQuality = Tp, we(), Bs._bIsPainted = !0, Bs.makeImage();
            }
            z.onRenderingStart && z.onRenderingStart(z);
            for (var dn = 0; dn < xt; dn++) for (var Dn = 0; Dn < xt; Dn++) {
              var Qr = Dn * et + z.quietZone, ms = dn * Wt + z.quietZone, bi = Tr.isDark(dn, Dn), bn = Tr.getEye(dn, Dn), qt = z.dotScale;
              Fe.lineWidth = 0;
              var Jt, mn;
              bn ? (Jt = z[bn.type] || z[bn.type.substring(0, 2)] || z.colorDark, mn = z.colorLight) : z.backgroundImage ? (mn = "rgba(0,0,0,0)", dn == 6 ? z.autoColor ? (Jt = z.timing_H || z.timing || z.autoColorDark, mn = z.autoColorLight) : Jt = z.timing_H || z.timing || z.colorDark : Dn == 6 ? z.autoColor ? (Jt = z.timing_V || z.timing || z.autoColorDark, mn = z.autoColorLight) : Jt = z.timing_V || z.timing || z.colorDark : z.autoColor ? (Jt = z.autoColorDark, mn = z.autoColorLight) : Jt = z.colorDark) : (Jt = dn == 6 ? z.timing_H || z.timing || z.colorDark : Dn == 6 && (z.timing_V || z.timing) || z.colorDark, mn = z.colorLight), Fe.strokeStyle = bi ? Jt : mn, Fe.fillStyle = bi ? Jt : mn, bn ? (qt = bn.type == "AO" ? z.dotScaleAO : bn.type == "AI" ? z.dotScaleAI : 1, z.backgroundImage && z.autoColor ? (Jt = (bn.type == "AO" ? z.AI : z.AO) || z.autoColorDark, mn = z.autoColorLight) : Jt = (bn.type == "AO" ? z.AI : z.AO) || Jt, bi = bn.isDark, Fe.fillRect(Qr + et * (1 - qt) / 2, z.titleHeight + ms + Wt * (1 - qt) / 2, et * qt, Wt * qt)) : dn == 6 ? (qt = z.dotScaleTiming_H, Fe.fillRect(Qr + et * (1 - qt) / 2, z.titleHeight + ms + Wt * (1 - qt) / 2, et * qt, Wt * qt)) : Dn == 6 ? (qt = z.dotScaleTiming_V, Fe.fillRect(Qr + et * (1 - qt) / 2, z.titleHeight + ms + Wt * (1 - qt) / 2, et * qt, Wt * qt)) : (z.backgroundImage, Fe.fillRect(Qr + et * (1 - qt) / 2, z.titleHeight + ms + Wt * (1 - qt) / 2, et * qt, Wt * qt)), z.dotScale == 1 || bn || (Fe.strokeStyle = z.colorLight);
            }
            if (z.title && (Fe.fillStyle = z.titleBackgroundColor, Fe.fillRect(z.quietZone, z.quietZone, z.width, z.titleHeight), Fe.font = z.titleFont, Fe.fillStyle = z.titleColor, Fe.textAlign = "center", Fe.fillText(z.title, this._elCanvas.width / 2, +z.quietZone + z.titleTop)), z.subTitle && (Fe.font = z.subTitleFont, Fe.fillStyle = z.subTitleColor, Fe.fillText(z.subTitle, this._elCanvas.width / 2, +z.quietZone + z.subTitleTop)), z.logo) {
              var Lr = new Image(), Bs = this;
              Lr.onload = function() {
                zn(Lr);
              }, Lr.onerror = function(rr) {
                console.error(rr);
              }, z.crossOrigin != null && (Lr.crossOrigin = z.crossOrigin), Lr.originalSrc = z.logo, Lr.src = z.logo;
            } else we(), this._bIsPainted = !0, this.makeImage();
          }
          var z = this._htOption, xt = le.getModuleCount(), et = Math.round(z.width / xt), Wt = Math.round((z.height - z.titleHeight) / xt);
          et <= 1 && (et = 1), Wt <= 1 && (Wt = 1), z.width = et * xt, z.height = Wt * xt + z.titleHeight, z.quietZone = Math.round(z.quietZone), this._elCanvas.width = z.width + 2 * z.quietZone, this._elCanvas.height = z.height + 2 * z.quietZone, this._htOption.drawer != "canvas" && (this._oContext = new C2S(this._elCanvas.width, this._elCanvas.height)), this.clear();
          var Fe = this._oContext;
          Fe.lineWidth = 0, Fe.fillStyle = z.colorLight, Fe.fillRect(0, 0, this._elCanvas.width, this._elCanvas.height), Fe.clearRect(z.quietZone, z.quietZone, z.width, z.titleHeight);
          var Ln = this;
          if (z.backgroundImage) {
            var $n = new Image();
            $n.onload = function() {
              Fe.globalAlpha = 1, Fe.globalAlpha = z.backgroundImageAlpha;
              var Tr = Fe.imageSmoothingQuality, zn = Fe.imageSmoothingEnabled;
              Fe.imageSmoothingEnabled = !0, Fe.imageSmoothingQuality = "high", Fe.drawImage($n, 0, z.titleHeight, z.width + 2 * z.quietZone, z.height + 2 * z.quietZone - z.titleHeight), Fe.imageSmoothingEnabled = zn, Fe.imageSmoothingQuality = Tr, Fe.globalAlpha = 1, ae.call(Ln, le);
            }, z.crossOrigin != null && ($n.crossOrigin = z.crossOrigin), $n.originalSrc = z.backgroundImage, $n.src = z.backgroundImage;
          } else ae.call(Ln, le);
        }, X.prototype.makeImage = function() {
          this._bIsPainted && M.call(this, D);
        }, X.prototype.isPainted = function() {
          return this._bIsPainted;
        }, X.prototype.clear = function() {
          this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1;
        }, X.prototype.remove = function() {
          this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1, this._el.innerHTML = "";
        }, X.prototype.round = function(le) {
          return le && Math.floor(1e3 * le) / 1e3;
        }, X;
      })() : (function() {
        var D = function(M, I) {
          this._el = M, this._htOption = I;
        };
        return D.prototype.draw = function(M) {
          var I = this._htOption, Z = this._el, X = M.getModuleCount(), le = Math.round(I.width / X), we = Math.round((I.height - I.titleHeight) / X);
          le <= 1 && (le = 1), we <= 1 && (we = 1), this._htOption.width = le * X, this._htOption.height = we * X + I.titleHeight, this._htOption.quietZone = Math.round(this._htOption.quietZone);
          var ae = [], z = "", xt = Math.round(le * I.dotScale), et = Math.round(we * I.dotScale);
          xt < 4 && (xt = 4, et = 4);
          var Wt = I.colorDark, Fe = I.colorLight;
          if (I.backgroundImage) {
            I.autoColor ? (I.colorDark = "rgba(0, 0, 0, .6);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#99000000', EndColorStr='#99000000');", I.colorLight = "rgba(255, 255, 255, .7);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#B2FFFFFF', EndColorStr='#B2FFFFFF');") : I.colorLight = "rgba(0,0,0,0)";
            var Ln = '<div style="display:inline-block; z-index:-10;position:absolute;"><img src="' + I.backgroundImage + '" widht="' + (I.width + 2 * I.quietZone) + '" height="' + (I.height + 2 * I.quietZone) + '" style="opacity:' + I.backgroundImageAlpha + ";filter:alpha(opacity=" + 100 * I.backgroundImageAlpha + '); "/></div>';
            ae.push(Ln);
          }
          if (I.quietZone && (z = "display:inline-block; width:" + (I.width + 2 * I.quietZone) + "px; height:" + (I.width + 2 * I.quietZone) + "px;background:" + I.quietZoneColor + "; text-align:center;"), ae.push('<div style="font-size:0;' + z + '">'), ae.push('<table  style="font-size:0;border:0;border-collapse:collapse; margin-top:' + I.quietZone + 'px;" border="0" cellspacing="0" cellspadding="0" align="center" valign="middle">'), ae.push('<tr height="' + I.titleHeight + '" align="center"><td style="border:0;border-collapse:collapse;margin:0;padding:0" colspan="' + X + '">'), I.title) {
            var $n = I.titleColor, Tr = I.titleFont;
            ae.push('<div style="width:100%;margin-top:' + I.titleTop + "px;color:" + $n + ";font:" + Tr + ";background:" + I.titleBackgroundColor + '">' + I.title + "</div>");
          }
          I.subTitle && ae.push('<div style="width:100%;margin-top:' + (I.subTitleTop - I.titleTop) + "px;color:" + I.subTitleColor + "; font:" + I.subTitleFont + '">' + I.subTitle + "</div>"), ae.push("</td></tr>");
          for (var zn = 0; zn < X; zn++) {
            ae.push('<tr style="border:0; padding:0; margin:0;" height="7">');
            for (var dn = 0; dn < X; dn++) {
              var Dn = M.isDark(zn, dn), Qr = M.getEye(zn, dn);
              if (Qr) {
                Dn = Qr.isDark;
                var ms = Qr.type, bi = I[ms] || I[ms.substring(0, 2)] || Wt;
                ae.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + le + "px;height:" + we + 'px;"><span style="width:' + le + "px;height:" + we + "px;background-color:" + (Dn ? bi : Fe) + ';display:inline-block"></span></td>');
              } else {
                var bn = I.colorDark;
                zn == 6 ? (bn = I.timing_H || I.timing || Wt, ae.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + le + "px;height:" + we + "px;background-color:" + (Dn ? bn : Fe) + ';"></td>')) : dn == 6 ? (bn = I.timing_V || I.timing || Wt, ae.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + le + "px;height:" + we + "px;background-color:" + (Dn ? bn : Fe) + ';"></td>')) : ae.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + le + "px;height:" + we + 'px;"><div style="display:inline-block;width:' + xt + "px;height:" + et + "px;background-color:" + (Dn ? bn : I.colorLight) + ';"></div></td>');
              }
            }
            ae.push("</tr>");
          }
          if (ae.push("</table>"), ae.push("</div>"), I.logo) {
            var qt = new Image();
            I.crossOrigin != null && (qt.crossOrigin = I.crossOrigin), qt.src = I.logo;
            var Jt = I.width / 3.5, mn = I.height / 3.5;
            Jt != mn && (Jt = mn), I.logoWidth && (Jt = I.logoWidth), I.logoHeight && (mn = I.logoHeight);
            var Lr = "position:relative; z-index:1;display:table-cell;top:-" + ((I.height - I.titleHeight) / 2 + mn / 2 + I.quietZone) + "px;text-align:center; width:" + Jt + "px; height:" + mn + "px;line-height:" + Jt + "px; vertical-align: middle;";
            I.logoBackgroundTransparent || (Lr += "background:" + I.logoBackgroundColor), ae.push('<div style="' + Lr + '"><img  src="' + I.logo + '"  style="max-width: ' + Jt + "px; max-height: " + mn + 'px;" /> <div style=" display: none; width:1px;margin-left: -1px;"></div></div>');
          }
          I.onRenderingStart && I.onRenderingStart(I), Z.innerHTML = ae.join("");
          var Bs = Z.childNodes[0], rr = (I.width - Bs.offsetWidth) / 2, un = (I.height - Bs.offsetHeight) / 2;
          rr > 0 && un > 0 && (Bs.style.margin = un + "px " + rr + "px"), this._htOption.onRenderingEnd && this._htOption.onRenderingEnd(this._htOption, null);
        }, D.prototype.clear = function() {
          this._el.innerHTML = "";
        }, D;
      })();
      K = function(D, M) {
        if (this._htOption = {
          width: 256,
          height: 256,
          typeNumber: 4,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: he.H,
          dotScale: 1,
          dotScaleTiming: 1,
          dotScaleTiming_H: q,
          dotScaleTiming_V: q,
          dotScaleA: 1,
          dotScaleAO: q,
          dotScaleAI: q,
          quietZone: 0,
          quietZoneColor: "rgba(0,0,0,0)",
          title: "",
          titleFont: "normal normal bold 16px Arial",
          titleColor: "#000000",
          titleBackgroundColor: "#ffffff",
          titleHeight: 0,
          titleTop: 30,
          subTitle: "",
          subTitleFont: "normal normal normal 14px Arial",
          subTitleColor: "#4F4F4F",
          subTitleTop: 60,
          logo: q,
          logoWidth: q,
          logoHeight: q,
          logoMaxWidth: q,
          logoMaxHeight: q,
          logoBackgroundColor: "#ffffff",
          logoBackgroundTransparent: !1,
          PO: q,
          PI: q,
          PO_TL: q,
          PI_TL: q,
          PO_TR: q,
          PI_TR: q,
          PO_BL: q,
          PI_BL: q,
          AO: q,
          AI: q,
          timing: q,
          timing_H: q,
          timing_V: q,
          backgroundImage: q,
          backgroundImageAlpha: 1,
          autoColor: !1,
          autoColorDark: "rgba(0, 0, 0, .6)",
          autoColorLight: "rgba(255, 255, 255, .7)",
          onRenderingStart: q,
          onRenderingEnd: q,
          version: 0,
          tooltip: !1,
          binary: !1,
          drawer: "canvas",
          crossOrigin: null,
          utf8WithoutBOM: !0
        }, typeof M == "string" && (M = {
          text: M
        }), M) for (var I in M) this._htOption[I] = M[I];
        this._htOption.title || this._htOption.subTitle || (this._htOption.titleHeight = 0), (this._htOption.version < 0 || this._htOption.version > 40) && (console.warn("QR Code version '" + this._htOption.version + "' is invalidate, reset to 0"), this._htOption.version = 0), (this._htOption.dotScale < 0 || this._htOption.dotScale > 1) && (console.warn(this._htOption.dotScale + " , is invalidate, dotScale must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScale = 1), (this._htOption.dotScaleTiming < 0 || this._htOption.dotScaleTiming > 1) && (console.warn(this._htOption.dotScaleTiming + " , is invalidate, dotScaleTiming must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleTiming = 1), this._htOption.dotScaleTiming_H ? (this._htOption.dotScaleTiming_H < 0 || this._htOption.dotScaleTiming_H > 1) && (console.warn(this._htOption.dotScaleTiming_H + " , is invalidate, dotScaleTiming_H must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleTiming_H = 1) : this._htOption.dotScaleTiming_H = this._htOption.dotScaleTiming, this._htOption.dotScaleTiming_V ? (this._htOption.dotScaleTiming_V < 0 || this._htOption.dotScaleTiming_V > 1) && (console.warn(this._htOption.dotScaleTiming_V + " , is invalidate, dotScaleTiming_V must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleTiming_V = 1) : this._htOption.dotScaleTiming_V = this._htOption.dotScaleTiming, (this._htOption.dotScaleA < 0 || this._htOption.dotScaleA > 1) && (console.warn(this._htOption.dotScaleA + " , is invalidate, dotScaleA must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleA = 1), this._htOption.dotScaleAO ? (this._htOption.dotScaleAO < 0 || this._htOption.dotScaleAO > 1) && (console.warn(this._htOption.dotScaleAO + " , is invalidate, dotScaleAO must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleAO = 1) : this._htOption.dotScaleAO = this._htOption.dotScaleA, this._htOption.dotScaleAI ? (this._htOption.dotScaleAI < 0 || this._htOption.dotScaleAI > 1) && (console.warn(this._htOption.dotScaleAI + " , is invalidate, dotScaleAI must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleAI = 1) : this._htOption.dotScaleAI = this._htOption.dotScaleA, (this._htOption.backgroundImageAlpha < 0 || this._htOption.backgroundImageAlpha > 1) && (console.warn(this._htOption.backgroundImageAlpha + " , is invalidate, backgroundImageAlpha must between 0 and 1, now reset to 1. "), this._htOption.backgroundImageAlpha = 1), this._htOption.height = this._htOption.height + this._htOption.titleHeight, typeof D == "string" && (D = document.getElementById(D)), (!this._htOption.drawer || this._htOption.drawer != "svg" && this._htOption.drawer != "canvas") && (this._htOption.drawer = "canvas"), this._android = w(), this._el = D, this._oQRCode = null, this._htOption._element = D;
        var Z = {};
        for (var I in this._htOption) Z[I] = this._htOption[I];
        this._oDrawing = new yt(this._el, Z), this._htOption.text && this.makeCode(this._htOption.text);
      }, K.prototype.makeCode = function(D) {
        this._oQRCode = new u(H(D, this._htOption), this._htOption.correctLevel), this._oQRCode.addData(D, this._htOption.binary, this._htOption.utf8WithoutBOM), this._oQRCode.make(), this._htOption.tooltip && (this._el.title = D), this._oDrawing.draw(this._oQRCode);
      }, K.prototype.makeImage = function() {
        typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3) && this._oDrawing.makeImage();
      }, K.prototype.clear = function() {
        this._oDrawing.remove();
      }, K.prototype.resize = function(D, M) {
        this._oDrawing._htOption.width = D, this._oDrawing._htOption.height = M, this._oDrawing.draw(this._oQRCode);
      }, K.prototype.noConflict = function() {
        return B.QRCode === this && (B.QRCode = oe), K;
      }, K.CorrectLevel = he, ne ? ((ne.exports = K).QRCode = K, G.QRCode = K) : B.QRCode = K;
    }).call(this);
  });
  var a = i("58QMB");
  var c = {};
  const d = BigInt(0), h = BigInt(1), g = BigInt(2), b = BigInt(3), m = BigInt(8), v = Object.freeze({
    a: d,
    b: BigInt(7),
    P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
    n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
    h,
    Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
    Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
  }), T = (o, s) => (o + s / g) / s, A = {
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    splitScalar(o) {
      const { n: s } = v, l = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), u = -h * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), f = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), p = l, _ = BigInt("0x100000000000000000000000000000000"), w = T(p * o, s), H = T(-u * o, s);
      let Q = ge(o - w * l - H * f, s), q = ge(-w * u - H * p, s);
      const K = Q > _, x = q > _;
      if (K && (Q = s - Q), x && (q = s - q), Q > _ || q > _) throw new Error("splitScalarEndo: Endomorphism failed, k=" + o);
      return {
        k1neg: K,
        k1: Q,
        k2neg: x,
        k2: q
      };
    }
  }, E = 32, L = 32, U = 32, P = E + 1, J = 2 * E + 1;
  function ie(o) {
    const { a: s, b: l } = v, u = ge(o * o), f = ge(u * o);
    return ge(f + s * o + l);
  }
  const te = v.a === d;
  class ee extends Error {
    constructor(s) {
      super(s);
    }
  }
  function F(o) {
    if (!(o instanceof O)) throw new TypeError("JacobianPoint expected");
  }
  class O {
    constructor(s, l, u) {
      this.x = s, this.y = l, this.z = u;
    }
    static fromAffine(s) {
      if (!(s instanceof S)) throw new TypeError("JacobianPoint#fromAffine: expected Point");
      return s.equals(S.ZERO) ? O.ZERO : new O(s.x, s.y, h);
    }
    static toAffineBatch(s) {
      const l = Hn(s.map((u) => u.z));
      return s.map((u, f) => u.toAffine(l[f]));
    }
    static normalizeZ(s) {
      return O.toAffineBatch(s).map(O.fromAffine);
    }
    equals(s) {
      F(s);
      const { x: l, y: u, z: f } = this, { x: p, y: _, z: w } = s, H = ge(f * f), Q = ge(w * w), q = ge(l * Q), K = ge(p * H), x = ge(ge(u * w) * Q), C = ge(ge(_ * f) * H);
      return q === K && x === C;
    }
    negate() {
      return new O(this.x, ge(-this.y), this.z);
    }
    double() {
      const { x: s, y: l, z: u } = this, f = ge(s * s), p = ge(l * l), _ = ge(p * p), w = s + p, H = ge(g * (ge(w * w) - f - _)), Q = ge(b * f), q = ge(Q * Q), K = ge(q - g * H), x = ge(Q * (H - K) - m * _), C = ge(g * l * u);
      return new O(K, x, C);
    }
    add(s) {
      F(s);
      const { x: l, y: u, z: f } = this, { x: p, y: _, z: w } = s;
      if (p === d || _ === d) return this;
      if (l === d || u === d) return s;
      const H = ge(f * f), Q = ge(w * w), q = ge(l * Q), K = ge(p * H), x = ge(ge(u * w) * Q), C = ge(ge(_ * f) * H), B = ge(K - q), G = ge(C - x);
      if (B === d)
        return G === d ? this.double() : O.ZERO;
      const ne = ge(B * B), oe = ge(B * ne), ye = ge(q * ne), he = ge(G * G - oe - g * ye), Ae = ge(G * (ye - he) - x * oe), _e = ge(f * w * B);
      return new O(he, Ae, _e);
    }
    subtract(s) {
      return this.add(s.negate());
    }
    multiplyUnsafe(s) {
      const l = O.ZERO;
      if (typeof s == "bigint" && s === d) return l;
      let u = bt(s);
      if (u === h) return this;
      if (!te) {
        let K = l, x = this;
        for (; u > d; )
          u & h && (K = K.add(x)), x = x.double(), u >>= h;
        return K;
      }
      let { k1neg: f, k1: p, k2neg: _, k2: w } = A.splitScalar(u), H = l, Q = l, q = this;
      for (; p > d || w > d; )
        p & h && (H = H.add(q)), w & h && (Q = Q.add(q)), q = q.double(), p >>= h, w >>= h;
      return f && (H = H.negate()), _ && (Q = Q.negate()), Q = new O(ge(Q.x * A.beta), Q.y, Q.z), H.add(Q);
    }
    precomputeWindow(s) {
      const l = te ? 128 / s + 1 : 256 / s + 1, u = [];
      let f = this, p = f;
      for (let _ = 0; _ < l; _++) {
        p = f, u.push(p);
        for (let w = 1; w < 2 ** (s - 1); w++)
          p = p.add(f), u.push(p);
        f = p.double();
      }
      return u;
    }
    wNAF(s, l) {
      !l && this.equals(O.BASE) && (l = S.BASE);
      const u = l && l._WINDOW_SIZE || 1;
      if (256 % u) throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
      let f = l && $.get(l);
      f || (f = this.precomputeWindow(u), l && u !== 1 && (f = O.normalizeZ(f), $.set(l, f)));
      let p = O.ZERO, _ = O.BASE;
      const w = 1 + (te ? 128 / u : 256 / u), H = 2 ** (u - 1), Q = BigInt(2 ** u - 1), q = 2 ** u, K = BigInt(u);
      for (let x = 0; x < w; x++) {
        const C = x * H;
        let B = Number(s & Q);
        s >>= K, B > H && (B -= q, s += h);
        const G = C, ne = C + Math.abs(B) - 1, oe = x % 2 !== 0, ye = B < 0;
        B === 0 ? _ = _.add(k(oe, f[G])) : p = p.add(k(ye, f[ne]));
      }
      return {
        p,
        f: _
      };
    }
    multiply(s, l) {
      let u = bt(s), f, p;
      if (te) {
        const { k1neg: _, k1: w, k2neg: H, k2: Q } = A.splitScalar(u);
        let { p: q, f: K } = this.wNAF(w, l), { p: x, f: C } = this.wNAF(Q, l);
        q = k(_, q), x = k(H, x), x = new O(ge(x.x * A.beta), x.y, x.z), f = q.add(x), p = K.add(C);
      } else {
        const { p: _, f: w } = this.wNAF(u, l);
        f = _, p = w;
      }
      return O.normalizeZ([
        f,
        p
      ])[0];
    }
    toAffine(s) {
      const { x: l, y: u, z: f } = this, p = this.equals(O.ZERO);
      s == null && (s = p ? m : Qt(f));
      const _ = s, w = ge(_ * _), H = ge(w * _), Q = ge(l * w), q = ge(u * H), K = ge(f * _);
      if (p) return S.ZERO;
      if (K !== h) throw new Error("invZ was invalid");
      return new S(Q, q);
    }
  }
  O.BASE = new O(v.Gx, v.Gy, h), O.ZERO = new O(d, h, d);
  function k(o, s) {
    const l = s.negate();
    return o ? l : s;
  }
  const $ = /* @__PURE__ */ new WeakMap();
  class S {
    constructor(s, l) {
      this.x = s, this.y = l;
    }
    _setWindowSize(s) {
      this._WINDOW_SIZE = s, $.delete(this);
    }
    hasEvenY() {
      return this.y % g === d;
    }
    static fromCompressedHex(s) {
      const l = s.length === 32, u = ke(l ? s : s.subarray(1));
      if (!lt(u)) throw new Error("Point is not on curve");
      const f = ie(u);
      let p = pn(f);
      const _ = (p & h) === h;
      l ? _ && (p = ge(-p)) : (s[0] & 1) === 1 !== _ && (p = ge(-p));
      const w = new S(u, p);
      return w.assertValidity(), w;
    }
    static fromUncompressedHex(s) {
      const l = ke(s.subarray(1, E + 1)), u = ke(s.subarray(E + 1, E * 2 + 1)), f = new S(l, u);
      return f.assertValidity(), f;
    }
    static fromHex(s) {
      const l = We(s), u = l.length, f = l[0];
      if (u === E) return this.fromCompressedHex(l);
      if (u === P && (f === 2 || f === 3)) return this.fromCompressedHex(l);
      if (u === J && f === 4) return this.fromUncompressedHex(l);
      throw new Error(`Point.fromHex: received invalid point. Expected 32-${P} compressed bytes or ${J} uncompressed bytes, not ${u}`);
    }
    static fromPrivateKey(s) {
      return S.BASE.multiply(Je(s));
    }
    static fromSignature(s, l, u) {
      const { r: f, s: p } = Pe(l);
      if (![
        0,
        1,
        2,
        3
      ].includes(u)) throw new Error("Cannot recover: invalid recovery bit");
      const _ = rn(We(s)), { n: w } = v, H = u === 2 || u === 3 ? f + w : f, Q = Qt(H, w), q = ge(-_ * Q, w), K = ge(p * Q, w), x = u & 1 ? "03" : "02", C = S.fromHex(x + Ie(H)), B = S.BASE.multiplyAndAddUnsafe(C, q, K);
      if (!B) throw new Error("Cannot recover signature: point at infinify");
      return B.assertValidity(), B;
    }
    toRawBytes(s = !1) {
      return Ge(this.toHex(s));
    }
    toHex(s = !1) {
      const l = Ie(this.x);
      return s ? `${this.hasEvenY() ? "02" : "03"}${l}` : `04${l}${Ie(this.y)}`;
    }
    toHexX() {
      return this.toHex(!0).slice(2);
    }
    toRawX() {
      return this.toRawBytes(!0).slice(1);
    }
    assertValidity() {
      const s = "Point is not on elliptic curve", { x: l, y: u } = this;
      if (!lt(l) || !lt(u)) throw new Error(s);
      const f = ge(u * u), p = ie(l);
      if (ge(f - p) !== d) throw new Error(s);
    }
    equals(s) {
      return this.x === s.x && this.y === s.y;
    }
    negate() {
      return new S(this.x, ge(-this.y));
    }
    double() {
      return O.fromAffine(this).double().toAffine();
    }
    add(s) {
      return O.fromAffine(this).add(O.fromAffine(s)).toAffine();
    }
    subtract(s) {
      return this.add(s.negate());
    }
    multiply(s) {
      return O.fromAffine(this).multiply(s, this).toAffine();
    }
    multiplyAndAddUnsafe(s, l, u) {
      const f = O.fromAffine(this), p = l === d || l === h || this !== S.BASE ? f.multiplyUnsafe(l) : f.multiply(l), _ = O.fromAffine(s).multiplyUnsafe(u), w = p.add(_);
      return w.equals(O.ZERO) ? void 0 : w.toAffine();
    }
  }
  S.BASE = new S(v.Gx, v.Gy), S.ZERO = new S(d, d);
  function j(o) {
    return Number.parseInt(o[0], 16) >= 8 ? "00" + o : o;
  }
  function V(o) {
    if (o.length < 2 || o[0] !== 2) throw new Error(`Invalid signature integer tag: ${be(o)}`);
    const s = o[1], l = o.subarray(2, s + 2);
    if (!s || l.length !== s) throw new Error("Invalid signature integer: wrong length");
    if (l[0] === 0 && l[1] <= 127) throw new Error("Invalid signature integer: trailing length");
    return {
      data: ke(l),
      left: o.subarray(s + 2)
    };
  }
  function Y(o) {
    if (o.length < 2 || o[0] != 48) throw new Error(`Invalid signature tag: ${be(o)}`);
    if (o[1] !== o.length - 2) throw new Error("Invalid signature: incorrect length");
    const { data: s, left: l } = V(o.subarray(2)), { data: u, left: f } = V(l);
    if (f.length) throw new Error(`Invalid signature: left bytes after parsing: ${be(f)}`);
    return {
      r: s,
      s: u
    };
  }
  class W {
    constructor(s, l) {
      this.r = s, this.s = l, this.assertValidity();
    }
    static fromCompact(s) {
      const l = s instanceof Uint8Array, u = "Signature.fromCompact";
      if (typeof s != "string" && !l) throw new TypeError(`${u}: Expected string or Uint8Array`);
      const f = l ? be(s) : s;
      if (f.length !== 128) throw new Error(`${u}: Expected 64-byte hex`);
      return new W(Ve(f.slice(0, 64)), Ve(f.slice(64, 128)));
    }
    static fromDER(s) {
      const l = s instanceof Uint8Array;
      if (typeof s != "string" && !l) throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
      const { r: u, s: f } = Y(l ? s : Ge(s));
      return new W(u, f);
    }
    static fromHex(s) {
      return this.fromDER(s);
    }
    assertValidity() {
      const { r: s, s: l } = this;
      if (!Ye(s)) throw new Error("Invalid Signature: r must be 0 < r < n");
      if (!Ye(l)) throw new Error("Invalid Signature: s must be 0 < s < n");
    }
    hasHighS() {
      const s = v.n >> h;
      return this.s > s;
    }
    normalizeS() {
      return this.hasHighS() ? new W(this.r, ge(-this.s, v.n)) : this;
    }
    toDERRawBytes() {
      return Ge(this.toDERHex());
    }
    toDERHex() {
      const s = j(Ce(this.s)), l = j(Ce(this.r)), u = s.length / 2, f = l.length / 2, p = Ce(u), _ = Ce(f);
      return `30${Ce(f + u + 4)}02${_}${l}02${p}${s}`;
    }
    toRawBytes() {
      return this.toDERRawBytes();
    }
    toHex() {
      return this.toDERHex();
    }
    toCompactRawBytes() {
      return Ge(this.toCompactHex());
    }
    toCompactHex() {
      return Ie(this.r) + Ie(this.s);
    }
  }
  function re(...o) {
    if (!o.every((u) => u instanceof Uint8Array)) throw new Error("Uint8Array list expected");
    if (o.length === 1) return o[0];
    const s = o.reduce((u, f) => u + f.length, 0), l = new Uint8Array(s);
    for (let u = 0, f = 0; u < o.length; u++) {
      const p = o[u];
      l.set(p, f), f += p.length;
    }
    return l;
  }
  const ue = Array.from({
    length: 256
  }, (o, s) => s.toString(16).padStart(2, "0"));
  function be(o) {
    if (!(o instanceof Uint8Array)) throw new Error("Expected Uint8Array");
    let s = "";
    for (let l = 0; l < o.length; l++) s += ue[o[l]];
    return s;
  }
  const pe = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
  function Ie(o) {
    if (typeof o != "bigint") throw new Error("Expected bigint");
    if (!(d <= o && o < pe)) throw new Error("Expected number 0 <= n < 2^256");
    return o.toString(16).padStart(64, "0");
  }
  function $e(o) {
    const s = Ge(Ie(o));
    if (s.length !== 32) throw new Error("Error: expected 32 bytes");
    return s;
  }
  function Ce(o) {
    const s = o.toString(16);
    return s.length & 1 ? `0${s}` : s;
  }
  function Ve(o) {
    if (typeof o != "string") throw new TypeError("hexToNumber: expected string, got " + typeof o);
    return BigInt(`0x${o}`);
  }
  function Ge(o) {
    if (typeof o != "string") throw new TypeError("hexToBytes: expected string, got " + typeof o);
    if (o.length % 2) throw new Error("hexToBytes: received invalid unpadded hex" + o.length);
    const s = new Uint8Array(o.length / 2);
    for (let l = 0; l < s.length; l++) {
      const u = l * 2, f = o.slice(u, u + 2), p = Number.parseInt(f, 16);
      if (Number.isNaN(p) || p < 0) throw new Error("Invalid byte sequence");
      s[l] = p;
    }
    return s;
  }
  function ke(o) {
    return Ve(be(o));
  }
  function We(o) {
    return o instanceof Uint8Array ? Uint8Array.from(o) : Ge(o);
  }
  function bt(o) {
    if (typeof o == "number" && Number.isSafeInteger(o) && o > 0) return BigInt(o);
    if (typeof o == "bigint" && Ye(o)) return o;
    throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
  }
  function ge(o, s = v.P) {
    const l = o % s;
    return l >= d ? l : s + l;
  }
  function it(o, s) {
    const { P: l } = v;
    let u = o;
    for (; s-- > d; )
      u *= u, u %= l;
    return u;
  }
  function pn(o) {
    const { P: s } = v, l = BigInt(6), u = BigInt(11), f = BigInt(22), p = BigInt(23), _ = BigInt(44), w = BigInt(88), H = o * o * o % s, Q = H * H * o % s, q = it(Q, b) * Q % s, K = it(q, b) * Q % s, x = it(K, g) * H % s, C = it(x, u) * x % s, B = it(C, f) * C % s, G = it(B, _) * B % s, ne = it(G, w) * G % s, oe = it(ne, _) * B % s, ye = it(oe, b) * Q % s, he = it(ye, p) * C % s, Ae = it(he, l) * H % s, _e = it(Ae, g);
    if (_e * _e % s !== o) throw new Error("Cannot find square root");
    return _e;
  }
  function Qt(o, s = v.P) {
    if (o === d || s <= d) throw new Error(`invert: expected positive integers, got n=${o} mod=${s}`);
    let l = ge(o, s), u = s, f = d, p = h;
    for (; l !== d; ) {
      const w = u / l, H = u % l, Q = f - p * w;
      u = l, l = H, f = p, p = Q;
    }
    if (u !== h) throw new Error("invert: does not exist");
    return ge(f, s);
  }
  function Hn(o, s = v.P) {
    const l = new Array(o.length), u = o.reduce((p, _, w) => _ === d ? p : (l[w] = p, ge(p * _, s)), h), f = Qt(u, s);
    return o.reduceRight((p, _, w) => _ === d ? p : (l[w] = ge(p * l[w], s), ge(p * _, s)), f), l;
  }
  function nn(o) {
    const s = o.length * 8 - L * 8, l = ke(o);
    return s > 0 ? l >> BigInt(s) : l;
  }
  function rn(o, s = !1) {
    const l = nn(o);
    if (s) return l;
    const { n: u } = v;
    return l >= u ? l - u : l;
  }
  let gn, ve;
  class Ue {
    constructor(s, l) {
      if (this.hashLen = s, this.qByteLen = l, typeof s != "number" || s < 2) throw new Error("hashLen must be a number");
      if (typeof l != "number" || l < 2) throw new Error("qByteLen must be a number");
      this.v = new Uint8Array(s).fill(1), this.k = new Uint8Array(s).fill(0), this.counter = 0;
    }
    hmac(...s) {
      return Ke.hmacSha256(this.k, ...s);
    }
    hmacSync(...s) {
      return ve(this.k, ...s);
    }
    checkSync() {
      if (typeof ve != "function") throw new ee("hmacSha256Sync needs to be set");
    }
    incr() {
      if (this.counter >= 1e3) throw new Error("Tried 1,000 k values for sign(), all were invalid");
      this.counter += 1;
    }
    async reseed(s = new Uint8Array()) {
      this.k = await this.hmac(this.v, Uint8Array.from([
        0
      ]), s), this.v = await this.hmac(this.v), s.length !== 0 && (this.k = await this.hmac(this.v, Uint8Array.from([
        1
      ]), s), this.v = await this.hmac(this.v));
    }
    reseedSync(s = new Uint8Array()) {
      this.checkSync(), this.k = this.hmacSync(this.v, Uint8Array.from([
        0
      ]), s), this.v = this.hmacSync(this.v), s.length !== 0 && (this.k = this.hmacSync(this.v, Uint8Array.from([
        1
      ]), s), this.v = this.hmacSync(this.v));
    }
    async generate() {
      this.incr();
      let s = 0;
      const l = [];
      for (; s < this.qByteLen; ) {
        this.v = await this.hmac(this.v);
        const u = this.v.slice();
        l.push(u), s += this.v.length;
      }
      return re(...l);
    }
    generateSync() {
      this.checkSync(), this.incr();
      let s = 0;
      const l = [];
      for (; s < this.qByteLen; ) {
        this.v = this.hmacSync(this.v);
        const u = this.v.slice();
        l.push(u), s += this.v.length;
      }
      return re(...l);
    }
  }
  function Ye(o) {
    return d < o && o < v.n;
  }
  function lt(o) {
    return d < o && o < v.P;
  }
  function tt(o, s, l, u = !0) {
    const { n: f } = v, p = rn(o, !0);
    if (!Ye(p)) return;
    const _ = Qt(p, f), w = S.BASE.multiply(p), H = ge(w.x, f);
    if (H === d) return;
    const Q = ge(_ * ge(s + l * H, f), f);
    if (Q === d) return;
    let q = new W(H, Q), K = (w.x === q.r ? 0 : 2) | Number(w.y & h);
    return u && q.hasHighS() && (q = q.normalizeS(), K ^= 1), {
      sig: q,
      recovery: K
    };
  }
  function Je(o) {
    let s;
    if (typeof o == "bigint") s = o;
    else if (typeof o == "number" && Number.isSafeInteger(o) && o > 0) s = BigInt(o);
    else if (typeof o == "string") {
      if (o.length !== 2 * L) throw new Error("Expected 32 bytes of private key");
      s = Ve(o);
    } else if (o instanceof Uint8Array) {
      if (o.length !== L) throw new Error("Expected 32 bytes of private key");
      s = ke(o);
    } else throw new TypeError("Expected valid private key");
    if (!Ye(s)) throw new Error("Expected private key: 0 < key < n");
    return s;
  }
  function ft(o) {
    return o instanceof S ? (o.assertValidity(), o) : S.fromHex(o);
  }
  function Pe(o) {
    if (o instanceof W)
      return o.assertValidity(), o;
    try {
      return W.fromDER(o);
    } catch {
      return W.fromCompact(o);
    }
  }
  function kt(o, s = !1) {
    return S.fromPrivateKey(o).toRawBytes(s);
  }
  function zt(o) {
    const s = o instanceof Uint8Array, l = typeof o == "string", u = (s || l) && o.length;
    return s ? u === P || u === J : l ? u === P * 2 || u === J * 2 : o instanceof S;
  }
  function Yt(o, s, l = !1) {
    if (zt(o)) throw new TypeError("getSharedSecret: first arg must be private key");
    if (!zt(s)) throw new TypeError("getSharedSecret: second arg must be public key");
    const u = ft(s);
    return u.assertValidity(), u.multiply(Je(o)).toRawBytes(l);
  }
  function Nt(o) {
    const s = o.length > E ? o.slice(0, E) : o;
    return ke(s);
  }
  function sn(o) {
    const s = Nt(o), l = ge(s, v.n);
    return Mt(l < d ? s : l);
  }
  function Mt(o) {
    return $e(o);
  }
  function An(o, s, l) {
    if (o == null) throw new Error(`sign: expected valid message hash, not "${o}"`);
    const u = We(o), f = Je(s), p = [
      Mt(f),
      sn(u)
    ];
    if (l != null) {
      l === !0 && (l = Ke.randomBytes(E));
      const H = We(l);
      if (H.length !== E) throw new Error(`sign: Expected ${E} bytes of extra data`);
      p.push(H);
    }
    const _ = re(...p), w = Nt(u);
    return {
      seed: _,
      m: w,
      d: f
    };
  }
  function Lt(o, s) {
    const { sig: l, recovery: u } = o, { der: f, recovered: p } = Object.assign({
      canonical: !0,
      der: !0
    }, s), _ = f ? l.toDERRawBytes() : l.toCompactRawBytes();
    return p ? [
      _,
      u
    ] : _;
  }
  function It(o, s, l = {}) {
    const { seed: u, m: f, d: p } = An(o, s, l.extraEntropy), _ = new Ue(U, L);
    _.reseedSync(u);
    let w;
    for (; !(w = tt(_.generateSync(), f, p, l.canonical)); ) _.reseedSync();
    return Lt(w, l);
  }
  const Xt = {
    strict: !0
  };
  function Rt(o, s, l, u = Xt) {
    let f;
    try {
      f = Pe(o), s = We(s);
    } catch {
      return !1;
    }
    const { r: p, s: _ } = f;
    if (u.strict && f.hasHighS()) return !1;
    const w = rn(s);
    let H;
    try {
      H = ft(l);
    } catch {
      return !1;
    }
    const { n: Q } = v, q = Qt(_, Q), K = ge(w * q, Q), x = ge(p * q, Q), C = S.BASE.multiplyAndAddUnsafe(H, K, x);
    return C ? ge(C.x, Q) === p : !1;
  }
  function At(o) {
    return ge(ke(o), v.n);
  }
  class ln {
    constructor(s, l) {
      this.r = s, this.s = l, this.assertValidity();
    }
    static fromHex(s) {
      const l = We(s);
      if (l.length !== 64) throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${l.length}`);
      const u = ke(l.subarray(0, 32)), f = ke(l.subarray(32, 64));
      return new ln(u, f);
    }
    assertValidity() {
      const { r: s, s: l } = this;
      if (!lt(s) || !Ye(l)) throw new Error("Invalid signature");
    }
    toHex() {
      return Ie(this.r) + Ie(this.s);
    }
    toRawBytes() {
      return Ge(this.toHex());
    }
  }
  function Sn(o) {
    return S.fromPrivateKey(o).toRawX();
  }
  class vn {
    constructor(s, l, u = Ke.randomBytes()) {
      if (s == null) throw new TypeError(`sign: Expected valid message, not "${s}"`);
      this.m = We(s);
      const { x: f, scalar: p } = this.getScalar(Je(l));
      if (this.px = f, this.d = p, this.rand = We(u), this.rand.length !== 32) throw new TypeError("sign: Expected 32 bytes of aux randomness");
    }
    getScalar(s) {
      const l = S.fromPrivateKey(s), u = l.hasEvenY() ? s : v.n - s;
      return {
        point: l,
        scalar: u,
        x: l.toRawX()
      };
    }
    initNonce(s, l) {
      return $e(s ^ ke(l));
    }
    finalizeNonce(s) {
      const l = ge(ke(s), v.n);
      if (l === d) throw new Error("sign: Creation of signature failed. k is zero");
      const { point: u, x: f, scalar: p } = this.getScalar(l);
      return {
        R: u,
        rx: f,
        k: p
      };
    }
    finalizeSig(s, l, u, f) {
      return new ln(s.x, ge(l + u * f, v.n)).toRawBytes();
    }
    error() {
      throw new Error("sign: Invalid signature produced");
    }
    async calc() {
      const { m: s, d: l, px: u, rand: f } = this, p = Ke.taggedHash, _ = this.initNonce(l, await p(cn.aux, f)), { R: w, rx: H, k: Q } = this.finalizeNonce(await p(cn.nonce, _, u, s)), q = At(await p(cn.challenge, H, u, s)), K = this.finalizeSig(w, Q, q, l);
      return await Cn(K, s, u) || this.error(), K;
    }
    calcSync() {
      const { m: s, d: l, px: u, rand: f } = this, p = Ke.taggedHashSync, _ = this.initNonce(l, p(cn.aux, f)), { R: w, rx: H, k: Q } = this.finalizeNonce(p(cn.nonce, _, u, s)), q = At(p(cn.challenge, H, u, s)), K = this.finalizeSig(w, Q, q, l);
      return jn(K, s, u) || this.error(), K;
    }
  }
  async function Xn(o, s, l) {
    return new vn(o, s, l).calc();
  }
  function dr(o, s, l) {
    return new vn(o, s, l).calcSync();
  }
  function qn(o, s, l) {
    const u = o instanceof ln, f = u ? o : ln.fromHex(o);
    return u && f.assertValidity(), {
      ...f,
      m: We(s),
      P: ft(l)
    };
  }
  function Un(o, s, l, u) {
    const f = S.BASE.multiplyAndAddUnsafe(s, Je(l), ge(-u, v.n));
    return !(!f || !f.hasEvenY() || f.x !== o);
  }
  async function Cn(o, s, l) {
    try {
      const { r: u, s: f, m: p, P: _ } = qn(o, s, l), w = At(await Ke.taggedHash(cn.challenge, $e(u), _.toRawX(), p));
      return Un(u, _, f, w);
    } catch {
      return !1;
    }
  }
  function jn(o, s, l) {
    try {
      const { r: u, s: f, m: p, P: _ } = qn(o, s, l), w = At(Ke.taggedHashSync(cn.challenge, $e(u), _.toRawX(), p));
      return Un(u, _, f, w);
    } catch (u) {
      if (u instanceof ee) throw u;
      return !1;
    }
  }
  const Fn = {
    Signature: ln,
    getPublicKey: Sn,
    sign: Xn,
    verify: Cn,
    signSync: dr,
    verifySync: jn
  };
  S.BASE._setWindowSize(8);
  const Dt = {
    node: c,
    web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
  }, cn = {
    challenge: "BIP0340/challenge",
    aux: "BIP0340/aux",
    nonce: "BIP0340/nonce"
  }, Zn = {}, Ke = {
    bytesToHex: be,
    hexToBytes: Ge,
    concatBytes: re,
    mod: ge,
    invert: Qt,
    isValidPrivateKey(o) {
      try {
        return Je(o), !0;
      } catch {
        return !1;
      }
    },
    _bigintTo32Bytes: $e,
    _normalizePrivateKey: Je,
    hashToPrivateKey: (o) => {
      o = We(o);
      const s = L + 8;
      if (o.length < s || o.length > 1024) throw new Error("Expected valid bytes of private key as per FIPS 186");
      const l = ge(ke(o), v.n - h) + h;
      return $e(l);
    },
    randomBytes: (o = 32) => {
      if (Dt.web) return Dt.web.getRandomValues(new Uint8Array(o));
      if (Dt.node) {
        const { randomBytes: s } = Dt.node;
        return Uint8Array.from(s(o));
      } else throw new Error("The environment doesn't have randomBytes function");
    },
    randomPrivateKey: () => Ke.hashToPrivateKey(Ke.randomBytes(L + 8)),
    precompute(o = 8, s = S.BASE) {
      const l = s === S.BASE ? s : new S(s.x, s.y);
      return l._setWindowSize(o), l.multiply(b), l;
    },
    sha256: async (...o) => {
      if (Dt.web) {
        const s = await Dt.web.subtle.digest("SHA-256", re(...o));
        return new Uint8Array(s);
      } else if (Dt.node) {
        const { createHash: s } = Dt.node, l = s("sha256");
        return o.forEach((u) => l.update(u)), Uint8Array.from(l.digest());
      } else throw new Error("The environment doesn't have sha256 function");
    },
    hmacSha256: async (o, ...s) => {
      if (Dt.web) {
        const l = await Dt.web.subtle.importKey("raw", o, {
          name: "HMAC",
          hash: {
            name: "SHA-256"
          }
        }, !1, [
          "sign"
        ]), u = re(...s), f = await Dt.web.subtle.sign("HMAC", l, u);
        return new Uint8Array(f);
      } else if (Dt.node) {
        const { createHmac: l } = Dt.node, u = l("sha256", o);
        return s.forEach((f) => u.update(f)), Uint8Array.from(u.digest());
      } else throw new Error("The environment doesn't have hmac-sha256 function");
    },
    sha256Sync: void 0,
    hmacSha256Sync: void 0,
    taggedHash: async (o, ...s) => {
      let l = Zn[o];
      if (l === void 0) {
        const u = await Ke.sha256(Uint8Array.from(o, (f) => f.charCodeAt(0)));
        l = re(u, u), Zn[o] = l;
      }
      return Ke.sha256(l, ...s);
    },
    taggedHashSync: (o, ...s) => {
      if (typeof gn != "function") throw new ee("sha256Sync is undefined, you need to set it");
      let l = Zn[o];
      if (l === void 0) {
        const u = gn(Uint8Array.from(o, (f) => f.charCodeAt(0)));
        l = re(u, u), Zn[o] = l;
      }
      return gn(l, ...s);
    },
    _JacobianPoint: O
  };
  Object.defineProperties(Ke, {
    sha256Sync: {
      configurable: !1,
      get() {
        return gn;
      },
      set(o) {
        gn || (gn = o);
      }
    },
    hmacSha256Sync: {
      configurable: !1,
      get() {
        return ve;
      },
      set(o) {
        ve || (ve = o);
      }
    }
  });
  var Ht = {};
  Object.defineProperty(Ht, "__esModule", {
    value: !0
  }), Ht.sha224 = Ht.sha256 = void 0;
  var xn = {};
  Object.defineProperty(xn, "__esModule", {
    value: !0
  }), xn.SHA2 = void 0;
  var st = {};
  Object.defineProperty(st, "__esModule", {
    value: !0
  }), st.output = st.exists = st.hash = st.bytes = st.bool = st.number = void 0;
  function nt(o) {
    if (!Number.isSafeInteger(o) || o < 0) throw new Error(`Wrong positive integer: ${o}`);
  }
  st.number = nt;
  function Tt(o) {
    if (typeof o != "boolean") throw new Error(`Expected boolean, not ${o}`);
  }
  st.bool = Tt;
  function mt(o, ...s) {
    if (!(o instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
    if (s.length > 0 && !s.includes(o.length)) throw new TypeError(`Expected Uint8Array of length ${s}, not of length=${o.length}`);
  }
  st.bytes = mt;
  function on(o) {
    if (typeof o != "function" || typeof o.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
    nt(o.outputLen), nt(o.blockLen);
  }
  st.hash = on;
  function qe(o, s = !0) {
    if (o.destroyed) throw new Error("Hash instance has been destroyed");
    if (s && o.finished) throw new Error("Hash#digest() has already been called");
  }
  st.exists = qe;
  function ot(o, s) {
    mt(o);
    const l = s.outputLen;
    if (o.length < l) throw new Error(`digestInto() expects output buffer of length at least ${l}`);
  }
  st.output = ot;
  const St = {
    number: nt,
    bool: Tt,
    bytes: mt,
    hash: on,
    exists: qe,
    output: ot
  };
  st.default = St;
  var de = {};
  Object.defineProperty(de, "__esModule", {
    value: !0
  }), de.randomBytes = de.wrapConstructorWithOpts = de.wrapConstructor = de.checkOpts = de.Hash = de.concatBytes = de.toBytes = de.utf8ToBytes = de.asyncLoop = de.nextTick = de.hexToBytes = de.bytesToHex = de.isLE = de.rotr = de.createView = de.u32 = de.u8 = void 0;
  var Ot = {};
  Object.defineProperty(Ot, "__esModule", {
    value: !0
  }), Ot.crypto = void 0, Ot.crypto = {
    node: void 0,
    web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
  };
  const Cr = (o) => new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  de.u8 = Cr;
  const ei = (o) => new Uint32Array(o.buffer, o.byteOffset, Math.floor(o.byteLength / 4));
  de.u32 = ei;
  const ks = (o) => new DataView(o.buffer, o.byteOffset, o.byteLength);
  de.createView = ks;
  const As = (o, s) => o << 32 - s | o >>> s;
  if (de.rotr = As, de.isLE = new Uint8Array(new Uint32Array([
    287454020
  ]).buffer)[0] === 68, !de.isLE) throw new Error("Non little-endian hardware is not supported");
  const ti = Array.from({
    length: 256
  }, (o, s) => s.toString(16).padStart(2, "0"));
  function Ss(o) {
    if (!(o instanceof Uint8Array)) throw new Error("Uint8Array expected");
    let s = "";
    for (let l = 0; l < o.length; l++) s += ti[o[l]];
    return s;
  }
  de.bytesToHex = Ss;
  function Mi(o) {
    if (typeof o != "string") throw new TypeError("hexToBytes: expected string, got " + typeof o);
    if (o.length % 2) throw new Error("hexToBytes: received invalid unpadded hex");
    const s = new Uint8Array(o.length / 2);
    for (let l = 0; l < s.length; l++) {
      const u = l * 2, f = o.slice(u, u + 2), p = Number.parseInt(f, 16);
      if (Number.isNaN(p) || p < 0) throw new Error("Invalid byte sequence");
      s[l] = p;
    }
    return s;
  }
  de.hexToBytes = Mi;
  const ni = async () => {
  };
  de.nextTick = ni;
  async function Ri(o, s, l) {
    let u = Date.now();
    for (let f = 0; f < o; f++) {
      l(f);
      const p = Date.now() - u;
      p >= 0 && p < s || (await (0, de.nextTick)(), u += p);
    }
  }
  de.asyncLoop = Ri;
  function Cs(o) {
    if (typeof o != "string") throw new TypeError(`utf8ToBytes expected string, got ${typeof o}`);
    return new TextEncoder().encode(o);
  }
  de.utf8ToBytes = Cs;
  function ri(o) {
    if (typeof o == "string" && (o = Cs(o)), !(o instanceof Uint8Array)) throw new TypeError(`Expected input type is Uint8Array (got ${typeof o})`);
    return o;
  }
  de.toBytes = ri;
  function zo(...o) {
    if (!o.every((u) => u instanceof Uint8Array)) throw new Error("Uint8Array list expected");
    if (o.length === 1) return o[0];
    const s = o.reduce((u, f) => u + f.length, 0), l = new Uint8Array(s);
    for (let u = 0, f = 0; u < o.length; u++) {
      const p = o[u];
      l.set(p, f), f += p.length;
    }
    return l;
  }
  de.concatBytes = zo;
  class Bi {
    // Safe version that clones internal state
    clone() {
      return this._cloneInto();
    }
  }
  de.Hash = Bi;
  const Ho = (o) => Object.prototype.toString.call(o) === "[object Object]" && o.constructor === Object;
  function qo(o, s) {
    if (s !== void 0 && (typeof s != "object" || !Ho(s))) throw new TypeError("Options should be object or undefined");
    return Object.assign(o, s);
  }
  de.checkOpts = qo;
  function jo(o) {
    const s = (u) => o().update(ri(u)).digest(), l = o();
    return s.outputLen = l.outputLen, s.blockLen = l.blockLen, s.create = () => o(), s;
  }
  de.wrapConstructor = jo;
  function si(o) {
    const s = (u, f) => o(f).update(ri(u)).digest(), l = o({});
    return s.outputLen = l.outputLen, s.blockLen = l.blockLen, s.create = (u) => o(u), s;
  }
  de.wrapConstructorWithOpts = si;
  function ii(o = 32) {
    if (Ot.crypto.web) return Ot.crypto.web.getRandomValues(new Uint8Array(o));
    if (Ot.crypto.node) return new Uint8Array(Ot.crypto.node.randomBytes(o).buffer);
    throw new Error("The environment doesn't have randomBytes function");
  }
  de.randomBytes = ii;
  function Ui(o, s, l, u) {
    if (typeof o.setBigUint64 == "function") return o.setBigUint64(s, l, u);
    const f = BigInt(32), p = BigInt(4294967295), _ = Number(l >> f & p), w = Number(l & p), H = u ? 4 : 0, Q = u ? 0 : 4;
    o.setUint32(s + H, _, u), o.setUint32(s + Q, w, u);
  }
  class oi extends de.Hash {
    constructor(s, l, u, f) {
      super(), this.blockLen = s, this.outputLen = l, this.padOffset = u, this.isLE = f, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(s), this.view = (0, de.createView)(this.buffer);
    }
    update(s) {
      st.default.exists(this);
      const { view: l, buffer: u, blockLen: f } = this;
      s = (0, de.toBytes)(s);
      const p = s.length;
      for (let _ = 0; _ < p; ) {
        const w = Math.min(f - this.pos, p - _);
        if (w === f) {
          const H = (0, de.createView)(s);
          for (; f <= p - _; _ += f) this.process(H, _);
          continue;
        }
        u.set(s.subarray(_, _ + w), this.pos), this.pos += w, _ += w, this.pos === f && (this.process(l, 0), this.pos = 0);
      }
      return this.length += s.length, this.roundClean(), this;
    }
    digestInto(s) {
      st.default.exists(this), st.default.output(s, this), this.finished = !0;
      const { buffer: l, view: u, blockLen: f, isLE: p } = this;
      let { pos: _ } = this;
      l[_++] = 128, this.buffer.subarray(_).fill(0), this.padOffset > f - _ && (this.process(u, 0), _ = 0);
      for (let K = _; K < f; K++) l[K] = 0;
      Ui(u, f - 8, BigInt(this.length * 8), p), this.process(u, 0);
      const w = (0, de.createView)(s), H = this.outputLen;
      if (H % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
      const Q = H / 4, q = this.get();
      if (Q > q.length) throw new Error("_sha2: outputLen bigger than state");
      for (let K = 0; K < Q; K++) w.setUint32(4 * K, q[K], p);
    }
    digest() {
      const { buffer: s, outputLen: l } = this;
      this.digestInto(s);
      const u = s.slice(0, l);
      return this.destroy(), u;
    }
    _cloneInto(s) {
      s || (s = new this.constructor()), s.set(...this.get());
      const { blockLen: l, buffer: u, length: f, finished: p, destroyed: _, pos: w } = this;
      return s.length = f, s.pos = w, s.finished = p, s.destroyed = _, f % l && s.buffer.set(u), s;
    }
  }
  xn.SHA2 = oi;
  const Pi = (o, s, l) => o & s ^ ~o & l, ai = (o, s, l) => o & s ^ o & l ^ s & l, Fo = new Uint32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]), ur = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]), Jn = new Uint32Array(64);
  class zi extends xn.SHA2 {
    constructor() {
      super(64, 32, 8, !1), this.A = ur[0] | 0, this.B = ur[1] | 0, this.C = ur[2] | 0, this.D = ur[3] | 0, this.E = ur[4] | 0, this.F = ur[5] | 0, this.G = ur[6] | 0, this.H = ur[7] | 0;
    }
    get() {
      const { A: s, B: l, C: u, D: f, E: p, F: _, G: w, H } = this;
      return [
        s,
        l,
        u,
        f,
        p,
        _,
        w,
        H
      ];
    }
    // prettier-ignore
    set(s, l, u, f, p, _, w, H) {
      this.A = s | 0, this.B = l | 0, this.C = u | 0, this.D = f | 0, this.E = p | 0, this.F = _ | 0, this.G = w | 0, this.H = H | 0;
    }
    process(s, l) {
      for (let K = 0; K < 16; K++, l += 4) Jn[K] = s.getUint32(l, !1);
      for (let K = 16; K < 64; K++) {
        const x = Jn[K - 15], C = Jn[K - 2], B = (0, de.rotr)(x, 7) ^ (0, de.rotr)(x, 18) ^ x >>> 3, G = (0, de.rotr)(C, 17) ^ (0, de.rotr)(C, 19) ^ C >>> 10;
        Jn[K] = G + Jn[K - 7] + B + Jn[K - 16] | 0;
      }
      let { A: u, B: f, C: p, D: _, E: w, F: H, G: Q, H: q } = this;
      for (let K = 0; K < 64; K++) {
        const x = (0, de.rotr)(w, 6) ^ (0, de.rotr)(w, 11) ^ (0, de.rotr)(w, 25), C = q + x + Pi(w, H, Q) + Fo[K] + Jn[K] | 0, G = ((0, de.rotr)(u, 2) ^ (0, de.rotr)(u, 13) ^ (0, de.rotr)(u, 22)) + ai(u, f, p) | 0;
        q = Q, Q = H, H = w, w = _ + C | 0, _ = p, p = f, f = u, u = C + G | 0;
      }
      u = u + this.A | 0, f = f + this.B | 0, p = p + this.C | 0, _ = _ + this.D | 0, w = w + this.E | 0, H = H + this.F | 0, Q = Q + this.G | 0, q = q + this.H | 0, this.set(u, f, p, _, w, H, Q, q);
    }
    roundClean() {
      Jn.fill(0);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
    }
  }
  class Hi extends zi {
    constructor() {
      super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
    }
  }
  Ht.sha256 = (0, de.wrapConstructor)(() => new zi()), Ht.sha224 = (0, de.wrapConstructor)(() => new Hi());
  function hr(o) {
    if (!Number.isSafeInteger(o)) throw new Error(`Wrong integer: ${o}`);
  }
  function _n(...o) {
    const s = (f, p) => (_) => f(p(_)), l = Array.from(o).reverse().reduce((f, p) => f ? s(f, p.encode) : p.encode, void 0), u = o.reduce((f, p) => f ? s(f, p.decode) : p.decode, void 0);
    return {
      encode: l,
      decode: u
    };
  }
  function Pn(o) {
    return {
      encode: (s) => {
        if (!Array.isArray(s) || s.length && typeof s[0] != "number") throw new Error("alphabet.encode input should be an array of numbers");
        return s.map((l) => {
          if (hr(l), l < 0 || l >= o.length) throw new Error(`Digit index outside alphabet: ${l} (alphabet: ${o.length})`);
          return o[l];
        });
      },
      decode: (s) => {
        if (!Array.isArray(s) || s.length && typeof s[0] != "string") throw new Error("alphabet.decode input should be array of strings");
        return s.map((l) => {
          if (typeof l != "string") throw new Error(`alphabet.decode: not string element=${l}`);
          const u = o.indexOf(l);
          if (u === -1) throw new Error(`Unknown letter: "${l}". Allowed: ${o}`);
          return u;
        });
      }
    };
  }
  function In(o = "") {
    if (typeof o != "string") throw new Error("join separator should be string");
    return {
      encode: (s) => {
        if (!Array.isArray(s) || s.length && typeof s[0] != "string") throw new Error("join.encode input should be array of strings");
        for (let l of s) if (typeof l != "string") throw new Error(`join.encode: non-string input=${l}`);
        return s.join(o);
      },
      decode: (s) => {
        if (typeof s != "string") throw new Error("join.decode input should be string");
        return s.split(o);
      }
    };
  }
  function vs(o, s = "=") {
    if (hr(o), typeof s != "string") throw new Error("padding chr should be string");
    return {
      encode(l) {
        if (!Array.isArray(l) || l.length && typeof l[0] != "string") throw new Error("padding.encode input should be array of strings");
        for (let u of l) if (typeof u != "string") throw new Error(`padding.encode: non-string input=${u}`);
        for (; l.length * o % 8; ) l.push(s);
        return l;
      },
      decode(l) {
        if (!Array.isArray(l) || l.length && typeof l[0] != "string") throw new Error("padding.encode input should be array of strings");
        for (let f of l) if (typeof f != "string") throw new Error(`padding.decode: non-string input=${f}`);
        let u = l.length;
        if (u * o % 8) throw new Error("Invalid padding: string should have whole number of bytes");
        for (; u > 0 && l[u - 1] === s; u--)
          if (!((u - 1) * o % 8)) throw new Error("Invalid padding: string has too much padding");
        return l.slice(0, u);
      }
    };
  }
  function qi(o) {
    if (typeof o != "function") throw new Error("normalize fn should be function");
    return {
      encode: (s) => s,
      decode: (s) => o(s)
    };
  }
  function li(o, s, l) {
    if (s < 2) throw new Error(`convertRadix: wrong from=${s}, base cannot be less than 2`);
    if (l < 2) throw new Error(`convertRadix: wrong to=${l}, base cannot be less than 2`);
    if (!Array.isArray(o)) throw new Error("convertRadix: data should be array");
    if (!o.length) return [];
    let u = 0;
    const f = [], p = Array.from(o);
    for (p.forEach((_) => {
      if (hr(_), _ < 0 || _ >= s) throw new Error(`Wrong integer: ${_}`);
    }); ; ) {
      let _ = 0, w = !0;
      for (let H = u; H < p.length; H++) {
        const Q = p[H], q = s * _ + Q;
        if (!Number.isSafeInteger(q) || s * _ / s !== _ || q - Q !== s * _) throw new Error("convertRadix: carry overflow");
        if (_ = q % l, p[H] = Math.floor(q / l), !Number.isSafeInteger(p[H]) || p[H] * l + _ !== q) throw new Error("convertRadix: carry overflow");
        if (w) p[H] ? w = !1 : u = H;
        else continue;
      }
      if (f.push(_), w) break;
    }
    for (let _ = 0; _ < o.length - 1 && o[_] === 0; _++) f.push(0);
    return f.reverse();
  }
  const ji = (o, s) => s ? ji(s, o % s) : o, jr = (o, s) => o + (s - ji(o, s));
  function Is(o, s, l, u) {
    if (!Array.isArray(o)) throw new Error("convertRadix2: data should be array");
    if (s <= 0 || s > 32) throw new Error(`convertRadix2: wrong from=${s}`);
    if (l <= 0 || l > 32) throw new Error(`convertRadix2: wrong to=${l}`);
    if (jr(s, l) > 32) throw new Error(`convertRadix2: carry overflow from=${s} to=${l} carryBits=${jr(s, l)}`);
    let f = 0, p = 0;
    const _ = 2 ** l - 1, w = [];
    for (const H of o) {
      if (hr(H), H >= 2 ** s) throw new Error(`convertRadix2: invalid data word=${H} from=${s}`);
      if (f = f << s | H, p + s > 32) throw new Error(`convertRadix2: carry overflow pos=${p} from=${s}`);
      for (p += s; p >= l; p -= l) w.push((f >> p - l & _) >>> 0);
      f &= 2 ** p - 1;
    }
    if (f = f << l - p & _, !u && p >= s) throw new Error("Excess padding");
    if (!u && f) throw new Error(`Non-zero padding: ${f}`);
    return u && p > 0 && w.push(f >>> 0), w;
  }
  function Ts(o) {
    return hr(o), {
      encode: (s) => {
        if (!(s instanceof Uint8Array)) throw new Error("radix.encode input should be Uint8Array");
        return li(Array.from(s), 256, o);
      },
      decode: (s) => {
        if (!Array.isArray(s) || s.length && typeof s[0] != "number") throw new Error("radix.decode input should be array of strings");
        return Uint8Array.from(li(s, o, 256));
      }
    };
  }
  function er(o, s = !1) {
    if (hr(o), o <= 0 || o > 32) throw new Error("radix2: bits should be in (0..32]");
    if (jr(8, o) > 32 || jr(o, 8) > 32) throw new Error("radix2: carry overflow");
    return {
      encode: (l) => {
        if (!(l instanceof Uint8Array)) throw new Error("radix2.encode input should be Uint8Array");
        return Is(Array.from(l), 8, o, !s);
      },
      decode: (l) => {
        if (!Array.isArray(l) || l.length && typeof l[0] != "number") throw new Error("radix2.decode input should be array of strings");
        return Uint8Array.from(Is(l, o, 8, s));
      }
    };
  }
  function ci(o) {
    if (typeof o != "function") throw new Error("unsafeWrapper fn should be function");
    return function(...s) {
      try {
        return o.apply(null, s);
      } catch {
      }
    };
  }
  function Fi(o, s) {
    if (hr(o), typeof s != "function") throw new Error("checksum fn should be function");
    return {
      encode(l) {
        if (!(l instanceof Uint8Array)) throw new Error("checksum.encode: input should be Uint8Array");
        const u = s(l).slice(0, o), f = new Uint8Array(l.length + o);
        return f.set(l), f.set(u, l.length), f;
      },
      decode(l) {
        if (!(l instanceof Uint8Array)) throw new Error("checksum.decode: input should be Uint8Array");
        const u = l.slice(0, -o), f = s(u).slice(0, o), p = l.slice(-o);
        for (let _ = 0; _ < o; _++) if (f[_] !== p[_]) throw new Error("Invalid checksum");
        return u;
      }
    };
  }
  const Fr = {
    alphabet: Pn,
    chain: _n,
    checksum: Fi,
    radix: Ts,
    radix2: er,
    join: In,
    padding: vs
  }, di = _n(er(4), Pn("0123456789ABCDEF"), In("")), ui = _n(er(5), Pn("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), vs(5), In(""));
  _n(er(5), Pn("0123456789ABCDEFGHIJKLMNOPQRSTUV"), vs(5), In("")), _n(er(5), Pn("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), In(""), qi((o) => o.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
  const Zr = _n(er(6), Pn("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), vs(6), In("")), hi = _n(er(6), Pn("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), vs(6), In("")), fi = (o) => _n(Ts(58), Pn(o), In("")), Ls = fi("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
  fi("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), fi("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
  const fr = [
    0,
    2,
    3,
    5,
    6,
    7,
    9,
    10,
    11
  ], Zi = {
    encode(o) {
      let s = "";
      for (let l = 0; l < o.length; l += 8) {
        const u = o.subarray(l, l + 8);
        s += Ls.encode(u).padStart(fr[u.length], "1");
      }
      return s;
    },
    decode(o) {
      let s = [];
      for (let l = 0; l < o.length; l += 11) {
        const u = o.slice(l, l + 11), f = fr.indexOf(u.length), p = Ls.decode(u);
        for (let _ = 0; _ < p.length - f; _++)
          if (p[_] !== 0) throw new Error("base58xmr: wrong padding");
        s = s.concat(Array.from(p.slice(p.length - f)));
      }
      return Uint8Array.from(s);
    }
  }, Zo = (o) => _n(Fi(4, (s) => o(o(s))), Ls), pi = _n(Pn("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), In("")), Vi = [
    996825010,
    642813549,
    513874426,
    1027748829,
    705979059
  ];
  function Le(o) {
    const s = o >> 25;
    let l = (o & 33554431) << 5;
    for (let u = 0; u < Vi.length; u++) (s >> u & 1) === 1 && (l ^= Vi[u]);
    return l;
  }
  function ze(o, s, l = 1) {
    const u = o.length;
    let f = 1;
    for (let p = 0; p < u; p++) {
      const _ = o.charCodeAt(p);
      if (_ < 33 || _ > 126) throw new Error(`Invalid prefix (${o})`);
      f = Le(f) ^ _ >> 5;
    }
    f = Le(f);
    for (let p = 0; p < u; p++) f = Le(f) ^ o.charCodeAt(p) & 31;
    for (let p of s) f = Le(f) ^ p;
    for (let p = 0; p < 6; p++) f = Le(f);
    return f ^= l, pi.encode(Is([
      f % 2 ** 30
    ], 30, 5, !1));
  }
  function De(o) {
    const s = o === "bech32" ? 1 : 734539939, l = er(5), u = l.decode, f = l.encode, p = ci(u);
    function _(q, K, x = 90) {
      if (typeof q != "string") throw new Error(`bech32.encode prefix should be string, not ${typeof q}`);
      if (!Array.isArray(K) || K.length && typeof K[0] != "number") throw new Error(`bech32.encode words should be array of numbers, not ${typeof K}`);
      const C = q.length + 7 + K.length;
      if (x !== !1 && C > x) throw new TypeError(`Length ${C} exceeds limit ${x}`);
      return q = q.toLowerCase(), `${q}1${pi.encode(K)}${ze(q, K, s)}`;
    }
    function w(q, K = 90) {
      if (typeof q != "string") throw new Error(`bech32.decode input should be string, not ${typeof q}`);
      if (q.length < 8 || K !== !1 && q.length > K) throw new TypeError(`Wrong string length: ${q.length} (${q}). Expected (8..${K})`);
      const x = q.toLowerCase();
      if (q !== x && q !== q.toUpperCase()) throw new Error("String must be lowercase or uppercase");
      q = x;
      const C = q.lastIndexOf("1");
      if (C === 0 || C === -1) throw new Error('Letter "1" must be present between prefix and data only');
      const B = q.slice(0, C), G = q.slice(C + 1);
      if (G.length < 6) throw new Error("Data must be at least 6 characters long");
      const ne = pi.decode(G).slice(0, -6), oe = ze(B, ne, s);
      if (!G.endsWith(oe)) throw new Error(`Invalid checksum in ${q}: expected "${oe}"`);
      return {
        prefix: B,
        words: ne
      };
    }
    const H = ci(w);
    function Q(q) {
      const { prefix: K, words: x } = w(q, !1);
      return {
        prefix: K,
        words: x,
        bytes: u(x)
      };
    }
    return {
      encode: _,
      decode: w,
      decodeToBytes: Q,
      decodeUnsafe: H,
      fromWords: u,
      fromWordsUnsafe: p,
      toWords: f
    };
  }
  const je = De("bech32");
  De("bech32m");
  const Qe = {
    encode: (o) => new TextDecoder().decode(o),
    decode: (o) => new TextEncoder().encode(o)
  }, ut = _n(er(4), Pn("0123456789abcdef"), In(""), qi((o) => {
    if (typeof o != "string" || o.length % 2) throw new TypeError(`hex.decode: expected string, got ${typeof o} with length ${o.length}`);
    return o.toLowerCase();
  }));
  `${Object.keys({
    utf8: Qe,
    hex: ut,
    base16: di,
    base32: ui,
    base64: Zr,
    base64url: hi,
    base58: Ls,
    base58xmr: Zi
  }).join(", ")}`;
  var gt = {};
  Object.defineProperty(gt, "__esModule", {
    value: !0
  }), gt.wordlist = void 0, gt.wordlist = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split(`
`);
  var dt = {};
  Object.defineProperty(dt, "__esModule", {
    value: !0
  }), dt.mnemonicToSeedSync = dt.mnemonicToSeed = dt.validateMnemonic = dt.entropyToMnemonic = dt.mnemonicToEntropy = dt.generateMnemonic = void 0;
  var pt = {};
  Object.defineProperty(pt, "__esModule", {
    value: !0
  }), pt.pbkdf2Async = pt.pbkdf2 = void 0;
  var Ct = {};
  Object.defineProperty(Ct, "__esModule", {
    value: !0
  }), Ct.hmac = void 0;
  class ht extends de.Hash {
    constructor(s, l) {
      super(), this.finished = !1, this.destroyed = !1, st.default.hash(s);
      const u = (0, de.toBytes)(l);
      if (this.iHash = s.create(), typeof this.iHash.update != "function") throw new TypeError("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const f = this.blockLen, p = new Uint8Array(f);
      p.set(u.length > f ? s.create().update(u).digest() : u);
      for (let _ = 0; _ < p.length; _++) p[_] ^= 54;
      this.iHash.update(p), this.oHash = s.create();
      for (let _ = 0; _ < p.length; _++) p[_] ^= 106;
      this.oHash.update(p), p.fill(0);
    }
    update(s) {
      return st.default.exists(this), this.iHash.update(s), this;
    }
    digestInto(s) {
      st.default.exists(this), st.default.bytes(s, this.outputLen), this.finished = !0, this.iHash.digestInto(s), this.oHash.update(s), this.oHash.digestInto(s), this.destroy();
    }
    digest() {
      const s = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(s), s;
    }
    _cloneInto(s) {
      s || (s = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: l, iHash: u, finished: f, destroyed: p, blockLen: _, outputLen: w } = this;
      return s.finished = f, s.destroyed = p, s.blockLen = _, s.outputLen = w, s.oHash = l._cloneInto(s.oHash), s.iHash = u._cloneInto(s.iHash), s;
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  const Et = (o, s, l) => new ht(o, s).update(l).digest();
  Ct.hmac = Et, Ct.hmac.create = (o, s) => new ht(o, s);
  function En(o, s, l, u) {
    st.default.hash(o);
    const f = (0, de.checkOpts)({
      dkLen: 32,
      asyncTick: 10
    }, u), { c: p, dkLen: _, asyncTick: w } = f;
    if (st.default.number(p), st.default.number(_), st.default.number(w), p < 1) throw new Error("PBKDF2: iterations (c) should be >= 1");
    const H = (0, de.toBytes)(s), Q = (0, de.toBytes)(l), q = new Uint8Array(_), K = Ct.hmac.create(o, H), x = K._cloneInto().update(Q);
    return {
      c: p,
      dkLen: _,
      asyncTick: w,
      DK: q,
      PRF: K,
      PRFSalt: x
    };
  }
  function Ds(o, s, l, u, f) {
    return o.destroy(), s.destroy(), u && u.destroy(), f.fill(0), l;
  }
  function Os(o, s, l, u) {
    const { c: f, dkLen: p, DK: _, PRF: w, PRFSalt: H } = En(o, s, l, u);
    let Q;
    const q = new Uint8Array(4), K = (0, de.createView)(q), x = new Uint8Array(w.outputLen);
    for (let C = 1, B = 0; B < p; C++, B += w.outputLen) {
      const G = _.subarray(B, B + w.outputLen);
      K.setInt32(0, C, !1), (Q = H._cloneInto(Q)).update(q).digestInto(x), G.set(x.subarray(0, G.length));
      for (let ne = 1; ne < f; ne++) {
        w._cloneInto(Q).update(x).digestInto(x);
        for (let oe = 0; oe < G.length; oe++) G[oe] ^= x[oe];
      }
    }
    return Ds(w, H, _, Q, x);
  }
  pt.pbkdf2 = Os;
  async function Vr(o, s, l, u) {
    const { c: f, dkLen: p, asyncTick: _, DK: w, PRF: H, PRFSalt: Q } = En(o, s, l, u);
    let q;
    const K = new Uint8Array(4), x = (0, de.createView)(K), C = new Uint8Array(H.outputLen);
    for (let B = 1, G = 0; G < p; B++, G += H.outputLen) {
      const ne = w.subarray(G, G + H.outputLen);
      x.setInt32(0, B, !1), (q = Q._cloneInto(q)).update(K).digestInto(C), ne.set(C.subarray(0, ne.length)), await (0, de.asyncLoop)(f - 1, _, (oe) => {
        H._cloneInto(q).update(C).digestInto(C);
        for (let ye = 0; ye < ne.length; ye++) ne[ye] ^= C[ye];
      });
    }
    return Ds(H, Q, w, q, C);
  }
  pt.pbkdf2Async = Vr;
  var Vt = {};
  Object.defineProperty(Vt, "__esModule", {
    value: !0
  }), Vt.sha384 = Vt.sha512_256 = Vt.sha512_224 = Vt.sha512 = Vt.SHA512 = void 0;
  var He = {};
  Object.defineProperty(He, "__esModule", {
    value: !0
  }), He.add = He.toBig = He.split = He.fromBig = void 0;
  const Ir = BigInt(2 ** 32 - 1), Vn = BigInt(32);
  function tr(o, s = !1) {
    return s ? {
      h: Number(o & Ir),
      l: Number(o >> Vn & Ir)
    } : {
      h: Number(o >> Vn & Ir) | 0,
      l: Number(o & Ir) | 0
    };
  }
  He.fromBig = tr;
  function nr(o, s = !1) {
    let l = new Uint32Array(o.length), u = new Uint32Array(o.length);
    for (let f = 0; f < o.length; f++) {
      const { h: p, l: _ } = tr(o[f], s);
      [l[f], u[f]] = [
        p,
        _
      ];
    }
    return [
      l,
      u
    ];
  }
  He.split = nr;
  const pr = (o, s) => BigInt(o >>> 0) << Vn | BigInt(s >>> 0);
  He.toBig = pr;
  const Ns = (o, s, l) => o >>> l, Vo = (o, s, l) => o << 32 - l | s >>> l, Go = (o, s, l) => o >>> l | s << 32 - l, Gt = (o, s, l) => o << 32 - l | s >>> l, Gn = (o, s, l) => o << 64 - l | s >>> l - 32, gr = (o, s, l) => o >>> l - 32 | s << 64 - l, gi = (o, s) => s, Wo = (o, s) => o, Ko = (o, s, l) => o << l | s >>> 32 - l, Qo = (o, s, l) => s << l | o >>> 32 - l, Yo = (o, s, l) => s << l - 32 | o >>> 64 - l, Xo = (o, s, l) => o << l - 32 | s >>> 64 - l;
  function Gi(o, s, l, u) {
    const f = (s >>> 0) + (u >>> 0);
    return {
      h: o + l + (f / 2 ** 32 | 0) | 0,
      l: f | 0
    };
  }
  He.add = Gi;
  const Jo = (o, s, l) => (o >>> 0) + (s >>> 0) + (l >>> 0), Mh = (o, s, l, u) => s + l + u + (o / 2 ** 32 | 0) | 0, Rh = (o, s, l, u) => (o >>> 0) + (s >>> 0) + (l >>> 0) + (u >>> 0), Bh = (o, s, l, u, f) => s + l + u + f + (o / 2 ** 32 | 0) | 0, Uh = (o, s, l, u, f) => (o >>> 0) + (s >>> 0) + (l >>> 0) + (u >>> 0) + (f >>> 0), Ph = (o, s, l, u, f, p) => s + l + u + f + p + (o / 2 ** 32 | 0) | 0, zh = {
    fromBig: tr,
    split: nr,
    toBig: He.toBig,
    shrSH: Ns,
    shrSL: Vo,
    rotrSH: Go,
    rotrSL: Gt,
    rotrBH: Gn,
    rotrBL: gr,
    rotr32H: gi,
    rotr32L: Wo,
    rotlSH: Ko,
    rotlSL: Qo,
    rotlBH: Yo,
    rotlBL: Xo,
    add: Gi,
    add3L: Jo,
    add3H: Mh,
    add4L: Rh,
    add4H: Bh,
    add5H: Ph,
    add5L: Uh
  };
  He.default = zh;
  const [Hh, qh] = He.default.split([
    "0x428a2f98d728ae22",
    "0x7137449123ef65cd",
    "0xb5c0fbcfec4d3b2f",
    "0xe9b5dba58189dbbc",
    "0x3956c25bf348b538",
    "0x59f111f1b605d019",
    "0x923f82a4af194f9b",
    "0xab1c5ed5da6d8118",
    "0xd807aa98a3030242",
    "0x12835b0145706fbe",
    "0x243185be4ee4b28c",
    "0x550c7dc3d5ffb4e2",
    "0x72be5d74f27b896f",
    "0x80deb1fe3b1696b1",
    "0x9bdc06a725c71235",
    "0xc19bf174cf692694",
    "0xe49b69c19ef14ad2",
    "0xefbe4786384f25e3",
    "0x0fc19dc68b8cd5b5",
    "0x240ca1cc77ac9c65",
    "0x2de92c6f592b0275",
    "0x4a7484aa6ea6e483",
    "0x5cb0a9dcbd41fbd4",
    "0x76f988da831153b5",
    "0x983e5152ee66dfab",
    "0xa831c66d2db43210",
    "0xb00327c898fb213f",
    "0xbf597fc7beef0ee4",
    "0xc6e00bf33da88fc2",
    "0xd5a79147930aa725",
    "0x06ca6351e003826f",
    "0x142929670a0e6e70",
    "0x27b70a8546d22ffc",
    "0x2e1b21385c26c926",
    "0x4d2c6dfc5ac42aed",
    "0x53380d139d95b3df",
    "0x650a73548baf63de",
    "0x766a0abb3c77b2a8",
    "0x81c2c92e47edaee6",
    "0x92722c851482353b",
    "0xa2bfe8a14cf10364",
    "0xa81a664bbc423001",
    "0xc24b8b70d0f89791",
    "0xc76c51a30654be30",
    "0xd192e819d6ef5218",
    "0xd69906245565a910",
    "0xf40e35855771202a",
    "0x106aa07032bbd1b8",
    "0x19a4c116b8d2d0c8",
    "0x1e376c085141ab53",
    "0x2748774cdf8eeb99",
    "0x34b0bcb5e19b48a8",
    "0x391c0cb3c5c95a63",
    "0x4ed8aa4ae3418acb",
    "0x5b9cca4f7763e373",
    "0x682e6ff3d6b2b8a3",
    "0x748f82ee5defb2fc",
    "0x78a5636f43172f60",
    "0x84c87814a1f0ab72",
    "0x8cc702081a6439ec",
    "0x90befffa23631e28",
    "0xa4506cebde82bde9",
    "0xbef9a3f7b2c67915",
    "0xc67178f2e372532b",
    "0xca273eceea26619c",
    "0xd186b8c721c0c207",
    "0xeada7dd6cde0eb1e",
    "0xf57d4f7fee6ed178",
    "0x06f067aa72176fba",
    "0x0a637dc5a2c898a6",
    "0x113f9804bef90dae",
    "0x1b710b35131c471b",
    "0x28db77f523047d84",
    "0x32caab7b40c72493",
    "0x3c9ebe0a15c9bebc",
    "0x431d67c49c100d4c",
    "0x4cc5d4becb3e42b6",
    "0x597f299cfc657e2a",
    "0x5fcb6fab3ad6faec",
    "0x6c44198c4a475817"
  ].map((o) => BigInt(o))), Gr = new Uint32Array(80), Wr = new Uint32Array(80);
  class vi extends xn.SHA2 {
    constructor() {
      super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
    }
    // prettier-ignore
    get() {
      const { Ah: s, Al: l, Bh: u, Bl: f, Ch: p, Cl: _, Dh: w, Dl: H, Eh: Q, El: q, Fh: K, Fl: x, Gh: C, Gl: B, Hh: G, Hl: ne } = this;
      return [
        s,
        l,
        u,
        f,
        p,
        _,
        w,
        H,
        Q,
        q,
        K,
        x,
        C,
        B,
        G,
        ne
      ];
    }
    // prettier-ignore
    set(s, l, u, f, p, _, w, H, Q, q, K, x, C, B, G, ne) {
      this.Ah = s | 0, this.Al = l | 0, this.Bh = u | 0, this.Bl = f | 0, this.Ch = p | 0, this.Cl = _ | 0, this.Dh = w | 0, this.Dl = H | 0, this.Eh = Q | 0, this.El = q | 0, this.Fh = K | 0, this.Fl = x | 0, this.Gh = C | 0, this.Gl = B | 0, this.Hh = G | 0, this.Hl = ne | 0;
    }
    process(s, l) {
      for (let he = 0; he < 16; he++, l += 4)
        Gr[he] = s.getUint32(l), Wr[he] = s.getUint32(l += 4);
      for (let he = 16; he < 80; he++) {
        const Ae = Gr[he - 15] | 0, _e = Wr[he - 15] | 0, xe = He.default.rotrSH(Ae, _e, 1) ^ He.default.rotrSH(Ae, _e, 8) ^ He.default.shrSH(Ae, _e, 7), Se = He.default.rotrSL(Ae, _e, 1) ^ He.default.rotrSL(Ae, _e, 8) ^ He.default.shrSL(Ae, _e, 7), Oe = Gr[he - 2] | 0, yt = Wr[he - 2] | 0, D = He.default.rotrSH(Oe, yt, 19) ^ He.default.rotrBH(Oe, yt, 61) ^ He.default.shrSH(Oe, yt, 6), M = He.default.rotrSL(Oe, yt, 19) ^ He.default.rotrBL(Oe, yt, 61) ^ He.default.shrSL(Oe, yt, 6), I = He.default.add4L(Se, M, Wr[he - 7], Wr[he - 16]), Z = He.default.add4H(I, xe, D, Gr[he - 7], Gr[he - 16]);
        Gr[he] = Z | 0, Wr[he] = I | 0;
      }
      let { Ah: u, Al: f, Bh: p, Bl: _, Ch: w, Cl: H, Dh: Q, Dl: q, Eh: K, El: x, Fh: C, Fl: B, Gh: G, Gl: ne, Hh: oe, Hl: ye } = this;
      for (let he = 0; he < 80; he++) {
        const Ae = He.default.rotrSH(K, x, 14) ^ He.default.rotrSH(K, x, 18) ^ He.default.rotrBH(K, x, 41), _e = He.default.rotrSL(K, x, 14) ^ He.default.rotrSL(K, x, 18) ^ He.default.rotrBL(K, x, 41), xe = K & C ^ ~K & G, Se = x & B ^ ~x & ne, Oe = He.default.add5L(ye, _e, Se, qh[he], Wr[he]), yt = He.default.add5H(Oe, oe, Ae, xe, Hh[he], Gr[he]), D = Oe | 0, M = He.default.rotrSH(u, f, 28) ^ He.default.rotrBH(u, f, 34) ^ He.default.rotrBH(u, f, 39), I = He.default.rotrSL(u, f, 28) ^ He.default.rotrBL(u, f, 34) ^ He.default.rotrBL(u, f, 39), Z = u & p ^ u & w ^ p & w, X = f & _ ^ f & H ^ _ & H;
        oe = G | 0, ye = ne | 0, G = C | 0, ne = B | 0, C = K | 0, B = x | 0, { h: K, l: x } = He.default.add(Q | 0, q | 0, yt | 0, D | 0), Q = w | 0, q = H | 0, w = p | 0, H = _ | 0, p = u | 0, _ = f | 0;
        const le = He.default.add3L(D, I, X);
        u = He.default.add3H(le, yt, M, Z), f = le | 0;
      }
      ({ h: u, l: f } = He.default.add(this.Ah | 0, this.Al | 0, u | 0, f | 0)), { h: p, l: _ } = He.default.add(this.Bh | 0, this.Bl | 0, p | 0, _ | 0), { h: w, l: H } = He.default.add(this.Ch | 0, this.Cl | 0, w | 0, H | 0), { h: Q, l: q } = He.default.add(this.Dh | 0, this.Dl | 0, Q | 0, q | 0), { h: K, l: x } = He.default.add(this.Eh | 0, this.El | 0, K | 0, x | 0), { h: C, l: B } = He.default.add(this.Fh | 0, this.Fl | 0, C | 0, B | 0), { h: G, l: ne } = He.default.add(this.Gh | 0, this.Gl | 0, G | 0, ne | 0), { h: oe, l: ye } = He.default.add(this.Hh | 0, this.Hl | 0, oe | 0, ye | 0), this.set(u, f, p, _, w, H, Q, q, K, x, C, B, G, ne, oe, ye);
    }
    roundClean() {
      Gr.fill(0), Wr.fill(0);
    }
    destroy() {
      this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  }
  Vt.SHA512 = vi;
  class jh extends vi {
    constructor() {
      super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
    }
  }
  class Fh extends vi {
    constructor() {
      super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
    }
  }
  class Zh extends vi {
    constructor() {
      super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
    }
  }
  Vt.sha512 = (0, de.wrapConstructor)(() => new vi()), Vt.sha512_224 = (0, de.wrapConstructor)(() => new jh()), Vt.sha512_256 = (0, de.wrapConstructor)(() => new Fh()), Vt.sha384 = (0, de.wrapConstructor)(() => new Zh());
  const Vh = (o) => o[0] === "あいこくしん";
  function Zl(o) {
    if (typeof o != "string") throw new TypeError(`Invalid mnemonic type: ${typeof o}`);
    return o.normalize("NFKD");
  }
  function ea(o) {
    const s = Zl(o), l = s.split(" ");
    if (![
      12,
      15,
      18,
      21,
      24
    ].includes(l.length)) throw new Error("Invalid mnemonic");
    return {
      nfkd: s,
      words: l
    };
  }
  function Vl(o) {
    st.default.bytes(o, 16, 20, 24, 28, 32);
  }
  function Gh(o, s = 128) {
    if (st.default.number(s), s % 32 !== 0 || s > 256) throw new TypeError("Invalid entropy");
    return Kl((0, de.randomBytes)(s / 8), o);
  }
  dt.generateMnemonic = Gh;
  const Wh = (o) => {
    const s = 8 - o.length / 4;
    return new Uint8Array([
      (0, Ht.sha256)(o)[0] >> s << s
    ]);
  };
  function Gl(o) {
    if (!Array.isArray(o) || o.length !== 2048 || typeof o[0] != "string") throw new Error("Worlist: expected array of 2048 strings");
    return o.forEach((s) => {
      if (typeof s != "string") throw new Error(`Wordlist: non-string element: ${s}`);
    }), Fr.chain(Fr.checksum(1, Wh), Fr.radix2(11, !0), Fr.alphabet(o));
  }
  function Wl(o, s) {
    const { words: l } = ea(o), u = Gl(s).decode(l);
    return Vl(u), u;
  }
  dt.mnemonicToEntropy = Wl;
  function Kl(o, s) {
    return Vl(o), Gl(s).encode(o).join(Vh(s) ? "　" : " ");
  }
  dt.entropyToMnemonic = Kl;
  function Kh(o, s) {
    try {
      Wl(o, s);
    } catch {
      return !1;
    }
    return !0;
  }
  dt.validateMnemonic = Kh;
  const Ql = (o) => Zl(`mnemonic${o}`);
  function Qh(o, s = "") {
    return (0, pt.pbkdf2Async)(Vt.sha512, ea(o).nfkd, Ql(s), {
      c: 2048,
      dkLen: 64
    });
  }
  dt.mnemonicToSeed = Qh;
  function Yh(o, s = "") {
    return (0, pt.pbkdf2)(Vt.sha512, ea(o).nfkd, Ql(s), {
      c: 2048,
      dkLen: 64
    });
  }
  dt.mnemonicToSeedSync = Yh;
  var Ms = {};
  Object.defineProperty(Ms, "__esModule", {
    value: !0
  }), Ms.ripemd160 = Ms.RIPEMD160 = void 0;
  const Xh = new Uint8Array([
    7,
    4,
    13,
    1,
    10,
    6,
    15,
    3,
    12,
    0,
    9,
    5,
    2,
    14,
    11,
    8
  ]), Yl = Uint8Array.from({
    length: 16
  }, (o, s) => s), Jh = Yl.map((o) => (9 * o + 5) % 16);
  let ta = [
    Yl
  ], na = [
    Jh
  ];
  for (let o = 0; o < 4; o++) for (let s of [
    ta,
    na
  ]) s.push(s[o].map((l) => Xh[l]));
  const Xl = [
    [
      11,
      14,
      15,
      12,
      5,
      8,
      7,
      9,
      11,
      13,
      14,
      15,
      6,
      7,
      9,
      8
    ],
    [
      12,
      13,
      11,
      15,
      6,
      9,
      9,
      7,
      12,
      15,
      11,
      13,
      7,
      8,
      7,
      7
    ],
    [
      13,
      15,
      14,
      11,
      7,
      7,
      6,
      8,
      13,
      14,
      13,
      12,
      5,
      5,
      6,
      9
    ],
    [
      14,
      11,
      12,
      14,
      8,
      6,
      5,
      5,
      15,
      12,
      15,
      14,
      9,
      9,
      8,
      6
    ],
    [
      15,
      12,
      13,
      13,
      9,
      5,
      8,
      6,
      14,
      11,
      12,
      11,
      8,
      6,
      5,
      5
    ]
  ].map((o) => new Uint8Array(o)), ef = ta.map((o, s) => o.map((l) => Xl[s][l])), tf = na.map((o, s) => o.map((l) => Xl[s][l])), nf = new Uint32Array([
    0,
    1518500249,
    1859775393,
    2400959708,
    2840853838
  ]), rf = new Uint32Array([
    1352829926,
    1548603684,
    1836072691,
    2053994217,
    0
  ]), Wi = (o, s) => o << s | o >>> 32 - s;
  function Jl(o, s, l, u) {
    return o === 0 ? s ^ l ^ u : o === 1 ? s & l | ~s & u : o === 2 ? (s | ~l) ^ u : o === 3 ? s & u | l & ~u : s ^ (l | ~u);
  }
  const Ki = new Uint32Array(16);
  class ec extends xn.SHA2 {
    constructor() {
      super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
    }
    get() {
      const { h0: s, h1: l, h2: u, h3: f, h4: p } = this;
      return [
        s,
        l,
        u,
        f,
        p
      ];
    }
    set(s, l, u, f, p) {
      this.h0 = s | 0, this.h1 = l | 0, this.h2 = u | 0, this.h3 = f | 0, this.h4 = p | 0;
    }
    process(s, l) {
      for (let C = 0; C < 16; C++, l += 4) Ki[C] = s.getUint32(l, !0);
      let u = this.h0 | 0, f = u, p = this.h1 | 0, _ = p, w = this.h2 | 0, H = w, Q = this.h3 | 0, q = Q, K = this.h4 | 0, x = K;
      for (let C = 0; C < 5; C++) {
        const B = 4 - C, G = nf[C], ne = rf[C], oe = ta[C], ye = na[C], he = ef[C], Ae = tf[C];
        for (let _e = 0; _e < 16; _e++) {
          const xe = Wi(u + Jl(C, p, w, Q) + Ki[oe[_e]] + G, he[_e]) + K | 0;
          u = K, K = Q, Q = Wi(w, 10) | 0, w = p, p = xe;
        }
        for (let _e = 0; _e < 16; _e++) {
          const xe = Wi(f + Jl(B, _, H, q) + Ki[ye[_e]] + ne, Ae[_e]) + x | 0;
          f = x, x = q, q = Wi(H, 10) | 0, H = _, _ = xe;
        }
      }
      this.set(this.h1 + w + q | 0, this.h2 + Q + x | 0, this.h3 + K + f | 0, this.h4 + u + _ | 0, this.h0 + p + H | 0);
    }
    roundClean() {
      Ki.fill(0);
    }
    destroy() {
      this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
    }
  }
  Ms.RIPEMD160 = ec, Ms.ripemd160 = (0, de.wrapConstructor)(() => new ec()), Ke.hmacSha256Sync = (o, ...s) => (0, Ct.hmac)(Ht.sha256, o, Ke.concatBytes(...s));
  const ra = Zo(Ht.sha256);
  function tc(o) {
    return BigInt(`0x${(0, de.bytesToHex)(o)}`);
  }
  function sf(o) {
    return (0, de.hexToBytes)(o.toString(16).padStart(64, "0"));
  }
  const of = (0, de.utf8ToBytes)("Bitcoin seed"), sa = {
    private: 76066276,
    public: 76067358
  }, ia = 2147483648, af = (o) => (0, Ms.ripemd160)((0, Ht.sha256)(o)), lf = (o) => (0, de.createView)(o).getUint32(0, !1), Qi = (o) => {
    if (!Number.isSafeInteger(o) || o < 0 || o > 2 ** 32 - 1) throw new Error(`Invalid number=${o}. Should be from 0 to 2 ** 32 - 1`);
    const s = new Uint8Array(4);
    return (0, de.createView)(s).setUint32(0, o, !1), s;
  };
  class bs {
    constructor(s) {
      if (this.depth = 0, this.index = 0, this.chainCode = null, this.parentFingerprint = 0, !s || typeof s != "object") throw new Error("HDKey.constructor must not be called directly");
      if (this.versions = s.versions || sa, this.depth = s.depth || 0, this.chainCode = s.chainCode, this.index = s.index || 0, this.parentFingerprint = s.parentFingerprint || 0, !this.depth && (this.parentFingerprint || this.index))
        throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
      if (s.publicKey && s.privateKey) throw new Error("HDKey: publicKey and privateKey at same time.");
      if (s.privateKey) {
        if (!Ke.isValidPrivateKey(s.privateKey)) throw new Error("Invalid private key");
        this.privKey = typeof s.privateKey == "bigint" ? s.privateKey : tc(s.privateKey), this.privKeyBytes = sf(this.privKey), this.pubKey = kt(s.privateKey, !0);
      } else if (s.publicKey) this.pubKey = S.fromHex(s.publicKey).toRawBytes(!0);
      else throw new Error("HDKey: no public or private key provided");
      this.pubHash = af(this.pubKey);
    }
    get fingerprint() {
      if (!this.pubHash) throw new Error("No publicKey set!");
      return lf(this.pubHash);
    }
    get identifier() {
      return this.pubHash;
    }
    get pubKeyHash() {
      return this.pubHash;
    }
    get privateKey() {
      return this.privKeyBytes || null;
    }
    get publicKey() {
      return this.pubKey || null;
    }
    get privateExtendedKey() {
      const s = this.privateKey;
      if (!s) throw new Error("No private key");
      return ra.encode(this.serialize(this.versions.private, (0, de.concatBytes)(new Uint8Array([
        0
      ]), s)));
    }
    get publicExtendedKey() {
      if (!this.pubKey) throw new Error("No public key");
      return ra.encode(this.serialize(this.versions.public, this.pubKey));
    }
    static fromMasterSeed(s, l = sa) {
      if ((0, st.bytes)(s), 8 * s.length < 128 || 8 * s.length > 512) throw new Error(`HDKey: wrong seed length=${s.length}. Should be between 128 and 512 bits; 256 bits is advised)`);
      const u = (0, Ct.hmac)(Vt.sha512, of, s);
      return new bs({
        versions: l,
        chainCode: u.slice(32),
        privateKey: u.slice(0, 32)
      });
    }
    static fromExtendedKey(s, l = sa) {
      const u = ra.decode(s), f = (0, de.createView)(u), p = f.getUint32(0, !1), _ = {
        versions: l,
        depth: u[4],
        parentFingerprint: f.getUint32(5, !1),
        index: f.getUint32(9, !1),
        chainCode: u.slice(13, 45)
      }, w = u.slice(45), H = w[0] === 0;
      if (p !== l[H ? "private" : "public"]) throw new Error("Version mismatch");
      return H ? new bs({
        ..._,
        privateKey: w.slice(1)
      }) : new bs({
        ..._,
        publicKey: w
      });
    }
    static fromJSON(s) {
      return bs.fromExtendedKey(s.xpriv);
    }
    derive(s) {
      if (!/^[mM]'?/.test(s)) throw new Error('Path must start with "m" or "M"');
      if (/^[mM]'?$/.test(s)) return this;
      const l = s.replace(/^[mM]'?\//, "").split("/");
      let u = this;
      for (const f of l) {
        const p = /^(\d+)('?)$/.exec(f);
        if (!p || p.length !== 3) throw new Error(`Invalid child index: ${f}`);
        let _ = +p[1];
        if (!Number.isSafeInteger(_) || _ >= ia) throw new Error("Invalid index");
        p[2] === "'" && (_ += ia), u = u.deriveChild(_);
      }
      return u;
    }
    deriveChild(s) {
      if (!this.pubKey || !this.chainCode) throw new Error("No publicKey or chainCode set");
      let l = Qi(s);
      if (s >= ia) {
        const w = this.privateKey;
        if (!w) throw new Error("Could not derive hardened child key");
        l = (0, de.concatBytes)(new Uint8Array([
          0
        ]), w, l);
      } else l = (0, de.concatBytes)(this.pubKey, l);
      const u = (0, Ct.hmac)(Vt.sha512, this.chainCode, l), f = tc(u.slice(0, 32)), p = u.slice(32);
      if (!Ke.isValidPrivateKey(f)) throw new Error("Tweak bigger than curve order");
      const _ = {
        versions: this.versions,
        chainCode: p,
        depth: this.depth + 1,
        parentFingerprint: this.fingerprint,
        index: s
      };
      try {
        if (this.privateKey) {
          const w = Ke.mod(this.privKey + f, v.n);
          if (!Ke.isValidPrivateKey(w)) throw new Error("The tweak was out of range or the resulted private key is invalid");
          _.privateKey = w;
        } else {
          const w = S.fromHex(this.pubKey).add(S.fromPrivateKey(f));
          if (w.equals(S.ZERO)) throw new Error("The tweak was equal to negative P, which made the result key invalid");
          _.publicKey = w.toRawBytes(!0);
        }
        return new bs(_);
      } catch {
        return this.deriveChild(s + 1);
      }
    }
    sign(s) {
      if (!this.privateKey) throw new Error("No privateKey set!");
      return (0, st.bytes)(s, 32), It(s, this.privKey, {
        canonical: !0,
        der: !1
      });
    }
    verify(s, l) {
      if ((0, st.bytes)(s, 32), (0, st.bytes)(l, 64), !this.publicKey) throw new Error("No publicKey set!");
      let u;
      try {
        u = W.fromCompact(l);
      } catch {
        return !1;
      }
      return Rt(u, s, this.publicKey);
    }
    wipePrivateData() {
      return this.privKey = void 0, this.privKeyBytes && (this.privKeyBytes.fill(0), this.privKeyBytes = void 0), this;
    }
    toJSON() {
      return {
        xpriv: this.privateExtendedKey,
        xpub: this.publicExtendedKey
      };
    }
    serialize(s, l) {
      if (!this.chainCode) throw new Error("No chainCode set");
      return (0, st.bytes)(l, 33), (0, de.concatBytes)(Qi(s), new Uint8Array([
        this.depth
      ]), Qi(this.parentFingerprint), Qi(this.index), this.chainCode, l);
    }
  }
  var cf = Object.defineProperty, Tn = (o, s) => {
    for (var l in s) cf(o, l, {
      get: s[l],
      enumerable: !0
    });
  };
  function df() {
    return Ke.bytesToHex(Ke.randomPrivateKey());
  }
  function nc(o) {
    return Ke.bytesToHex(Fn.getPublicKey(o));
  }
  var uf = {};
  Tn(uf, {
    insertEventIntoAscendingList: () => ff,
    insertEventIntoDescendingList: () => hf,
    normalizeURL: () => oa,
    utf8Decoder: () => Kr,
    utf8Encoder: () => vr
  });
  var Kr = new TextDecoder("utf-8"), vr = new TextEncoder();
  function oa(o) {
    let s = new URL(o);
    return s.pathname = s.pathname.replace(/\/+/g, "/"), s.pathname.endsWith("/") && (s.pathname = s.pathname.slice(0, -1)), (s.port === "80" && s.protocol === "ws:" || s.port === "443" && s.protocol === "wss:") && (s.port = ""), s.searchParams.sort(), s.hash = "", s.toString();
  }
  function hf(o, s) {
    let l = 0, u = o.length - 1, f, p = l;
    if (u < 0) p = 0;
    else if (s.created_at < o[u].created_at) p = u + 1;
    else if (s.created_at >= o[l].created_at) p = l;
    else for (; ; ) {
      if (u <= l + 1) {
        p = u;
        break;
      }
      if (f = Math.floor(l + (u - l) / 2), o[f].created_at > s.created_at) l = f;
      else if (o[f].created_at < s.created_at) u = f;
      else {
        p = f;
        break;
      }
    }
    return o[p]?.id !== s.id ? [
      ...o.slice(0, p),
      s,
      ...o.slice(p)
    ] : o;
  }
  function ff(o, s) {
    let l = 0, u = o.length - 1, f, p = l;
    if (u < 0) p = 0;
    else if (s.created_at > o[u].created_at) p = u + 1;
    else if (s.created_at <= o[l].created_at) p = l;
    else for (; ; ) {
      if (u <= l + 1) {
        p = u;
        break;
      }
      if (f = Math.floor(l + (u - l) / 2), o[f].created_at < s.created_at) l = f;
      else if (o[f].created_at > s.created_at) u = f;
      else {
        p = f;
        break;
      }
    }
    return o[p]?.id !== s.id ? [
      ...o.slice(0, p),
      s,
      ...o.slice(p)
    ] : o;
  }
  function pf(o, s) {
    let l = o;
    return l.pubkey = nc(s), l.id = aa(l), l.sig = bf(l, s), l;
  }
  function gf(o) {
    if (!la(o)) throw new Error("can't serialize event with wrong or missing properties");
    return JSON.stringify([
      0,
      o.pubkey,
      o.created_at,
      o.kind,
      o.tags,
      o.content
    ]);
  }
  function aa(o) {
    let s = (0, Ht.sha256)(vr.encode(gf(o)));
    return Ke.bytesToHex(s);
  }
  var vf = (o) => o instanceof Object;
  function la(o) {
    if (!vf(o) || typeof o.kind != "number" || typeof o.content != "string" || typeof o.created_at != "number" || typeof o.pubkey != "string" || !o.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(o.tags)) return !1;
    for (let s = 0; s < o.tags.length; s++) {
      let l = o.tags[s];
      if (!Array.isArray(l)) return !1;
      for (let u = 0; u < l.length; u++)
        if (typeof l[u] == "object") return !1;
    }
    return !0;
  }
  function rc(o) {
    return Fn.verifySync(o.sig, aa(o), o.pubkey);
  }
  function bf(o, s) {
    return Ke.bytesToHex(Fn.signSync(aa(o), s));
  }
  function mf(o, s) {
    if (o.ids && o.ids.indexOf(s.id) === -1 && !o.ids.some((l) => s.id.startsWith(l)) || o.kinds && o.kinds.indexOf(s.kind) === -1 || o.authors && o.authors.indexOf(s.pubkey) === -1 && !o.authors.some((l) => s.pubkey.startsWith(l)))
      return !1;
    for (let l in o) if (l[0] === "#") {
      let u = l.slice(1), f = o[`#${u}`];
      if (f && !s.tags.find(([p, _]) => p === l.slice(1) && f.indexOf(_) !== -1)) return !1;
    }
    return !(o.since && s.created_at < o.since || o.until && s.created_at >= o.until);
  }
  function yf(o, s) {
    for (let l = 0; l < o.length; l++)
      if (mf(o[l], s)) return !0;
    return !1;
  }
  var wf = {};
  Tn(wf, {
    getHex64: () => Yi,
    getInt: () => sc,
    getSubscriptionId: () => ic,
    matchEventId: () => xf,
    matchEventKind: () => Ef,
    matchEventPubkey: () => _f
  });
  function Yi(o, s) {
    let l = s.length + 3, u = o.indexOf(`"${s}":`) + l, f = o.slice(u).indexOf('"') + u + 1;
    return o.slice(f, f + 64);
  }
  function sc(o, s) {
    let l = s.length, u = o.indexOf(`"${s}":`) + l + 3, f = o.slice(u), p = Math.min(f.indexOf(","), f.indexOf("}"));
    return parseInt(f.slice(0, p), 10);
  }
  function ic(o) {
    let s = o.slice(0, 22).indexOf('"EVENT"');
    if (s === -1) return null;
    let l = o.slice(s + 7 + 1).indexOf('"');
    if (l === -1) return null;
    let u = s + 7 + 1 + l, f = o.slice(u + 1, 80).indexOf('"');
    if (f === -1) return null;
    let p = u + 1 + f;
    return o.slice(u + 1, p);
  }
  function xf(o, s) {
    return s === Yi(o, "id");
  }
  function _f(o, s) {
    return s === Yi(o, "pubkey");
  }
  function Ef(o, s) {
    return s === sc(o, "kind");
  }
  var oc = () => ({
    connect: [],
    disconnect: [],
    error: [],
    notice: [],
    auth: []
  });
  function $f(o, s = {}) {
    let { listTimeout: l = 3e3, getTimeout: u = 3e3, countTimeout: f = 3e3 } = s;
    var p, _ = {}, w = oc(), H = {}, Q = {}, q;
    async function K() {
      return q || (q = new Promise((oe, ye) => {
        try {
          p = new WebSocket(o);
        } catch (xe) {
          ye(xe);
        }
        p.onopen = () => {
          w.connect.forEach((xe) => xe()), oe();
        }, p.onerror = () => {
          q = void 0, w.error.forEach((xe) => xe()), ye();
        }, p.onclose = async () => {
          q = void 0, w.disconnect.forEach((xe) => xe());
        };
        let he = [], Ae;
        p.onmessage = (xe) => {
          he.push(xe.data), Ae || (Ae = setInterval(_e, 0));
        };
        function _e() {
          if (he.length === 0) {
            clearInterval(Ae), Ae = null;
            return;
          }
          var xe = he.shift();
          if (!xe) return;
          let Se = ic(xe);
          if (Se) {
            let Oe = _[Se];
            if (Oe && Oe.alreadyHaveEvent && Oe.alreadyHaveEvent(Yi(xe, "id"), o)) return;
          }
          try {
            let Oe = JSON.parse(xe);
            switch (Oe[0]) {
              case "EVENT": {
                let I = Oe[1], Z = Oe[2];
                la(Z) && _[I] && (_[I].skipVerification || rc(Z)) && yf(_[I].filters, Z) && (_[I], (H[I]?.event || []).forEach((X) => X(Z)));
                return;
              }
              case "COUNT":
                let yt = Oe[1], D = Oe[2];
                _[yt] && (H[yt]?.count || []).forEach((I) => I(D));
                return;
              case "EOSE": {
                let I = Oe[1];
                I in H && (H[I].eose.forEach((Z) => Z()), H[I].eose = []);
                return;
              }
              case "OK": {
                let I = Oe[1], Z = Oe[2], X = Oe[3] || "";
                I in Q && (Z ? Q[I].ok.forEach((le) => le()) : Q[I].failed.forEach((le) => le(X)), Q[I].ok = [], Q[I].failed = []);
                return;
              }
              case "NOTICE":
                let M = Oe[1];
                w.notice.forEach((I) => I(M));
                return;
              case "AUTH": {
                let I = Oe[1];
                w.auth?.forEach((Z) => Z(I));
                return;
              }
            }
          } catch {
            return;
          }
        }
      }), q);
    }
    function x() {
      return p?.readyState === 1;
    }
    async function C() {
      x() || await K();
    }
    async function B(oe) {
      let ye = JSON.stringify(oe);
      if (!(!x() && (await new Promise((he) => setTimeout(he, 1e3)), !x())))
        try {
          p.send(ye);
        } catch (he) {
          console.log(he);
        }
    }
    const G = (oe, { verb: ye = "REQ", skipVerification: he = !1, alreadyHaveEvent: Ae = null, id: _e = Math.random().toString().slice(2) } = {}) => {
      let xe = _e;
      return _[xe] = {
        id: xe,
        filters: oe,
        skipVerification: he,
        alreadyHaveEvent: Ae
      }, B([
        ye,
        xe,
        ...oe
      ]), {
        sub: (Se, Oe = {}) => G(Se || oe, {
          skipVerification: Oe.skipVerification || he,
          alreadyHaveEvent: Oe.alreadyHaveEvent || Ae,
          id: xe
        }),
        unsub: () => {
          delete _[xe], delete H[xe], B([
            "CLOSE",
            xe
          ]);
        },
        on: (Se, Oe) => {
          H[xe] = H[xe] || {
            event: [],
            count: [],
            eose: []
          }, H[xe][Se].push(Oe);
        },
        off: (Se, Oe) => {
          let yt = H[xe], D = yt[Se].indexOf(Oe);
          D >= 0 && yt[Se].splice(D, 1);
        }
      };
    };
    function ne(oe, ye) {
      if (!oe.id) throw new Error(`event ${oe} has no id`);
      let he = oe.id;
      return B([
        ye,
        oe
      ]), {
        on: (Ae, _e) => {
          Q[he] = Q[he] || {
            ok: [],
            failed: []
          }, Q[he][Ae].push(_e);
        },
        off: (Ae, _e) => {
          let xe = Q[he];
          if (!xe) return;
          let Se = xe[Ae].indexOf(_e);
          Se >= 0 && xe[Ae].splice(Se, 1);
        }
      };
    }
    return {
      url: o,
      sub: G,
      on: (oe, ye) => {
        w[oe].push(ye), oe === "connect" && p?.readyState === 1 && ye();
      },
      off: (oe, ye) => {
        let he = w[oe].indexOf(ye);
        he !== -1 && w[oe].splice(he, 1);
      },
      list: (oe, ye) => new Promise((he) => {
        let Ae = G(oe, ye), _e = [], xe = setTimeout(() => {
          Ae.unsub(), he(_e);
        }, l);
        Ae.on("eose", () => {
          Ae.unsub(), clearTimeout(xe), he(_e);
        }), Ae.on("event", (Se) => {
          _e.push(Se);
        });
      }),
      get: (oe, ye) => new Promise((he) => {
        let Ae = G([
          oe
        ], ye), _e = setTimeout(() => {
          Ae.unsub(), he(null);
        }, u);
        Ae.on("event", (xe) => {
          Ae.unsub(), clearTimeout(_e), he(xe);
        });
      }),
      count: (oe) => new Promise((ye) => {
        let he = G(oe, {
          ...G,
          verb: "COUNT"
        }), Ae = setTimeout(() => {
          he.unsub(), ye(null);
        }, f);
        he.on("count", (_e) => {
          he.unsub(), clearTimeout(Ae), ye(_e);
        });
      }),
      publish(oe) {
        return ne(oe, "EVENT");
      },
      auth(oe) {
        return ne(oe, "AUTH");
      },
      connect: C,
      close() {
        w = oc(), H = {}, Q = {}, p.readyState === WebSocket.OPEN && p?.close();
      },
      get status() {
        return p?.readyState ?? 3;
      }
    };
  }
  var ac = class {
    _conn;
    _seenOn = {};
    eoseSubTimeout;
    getTimeout;
    constructor(o = {}) {
      this._conn = {}, this.eoseSubTimeout = o.eoseSubTimeout || 3400, this.getTimeout = o.getTimeout || 3400;
    }
    close(o) {
      o.forEach((s) => {
        let l = this._conn[oa(s)];
        l && l.close();
      });
    }
    async ensureRelay(o) {
      const s = oa(o);
      this._conn[s] || (this._conn[s] = $f(s, {
        getTimeout: this.getTimeout * 0.9,
        listTimeout: this.getTimeout * 0.9
      }));
      const l = this._conn[s];
      return await l.connect(), l;
    }
    sub(o, s, l) {
      let u = /* @__PURE__ */ new Set(), f = {
        ...l || {}
      };
      f.alreadyHaveEvent = (x, C) => {
        if (l?.alreadyHaveEvent?.(x, C)) return !0;
        let B = this._seenOn[x] || /* @__PURE__ */ new Set();
        return B.add(C), this._seenOn[x] = B, u.has(x);
      };
      let p = [], _ = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Set(), H = o.length, Q = !1, q = setTimeout(() => {
        Q = !0;
        for (let x of w.values()) x();
      }, this.eoseSubTimeout);
      o.forEach(async (x) => {
        let C;
        try {
          C = await this.ensureRelay(x);
        } catch {
          G();
          return;
        }
        if (!C) return;
        let B = C.sub(s, f);
        B.on("event", (ne) => {
          u.add(ne.id);
          for (let oe of _.values()) oe(ne);
        }), B.on("eose", () => {
          Q || G();
        }), p.push(B);
        function G() {
          if (H--, H === 0) {
            clearTimeout(q);
            for (let ne of w.values()) ne();
          }
        }
      });
      let K = {
        sub(x, C) {
          return p.forEach((B) => B.sub(x, C)), K;
        },
        unsub() {
          p.forEach((x) => x.unsub());
        },
        on(x, C) {
          x === "event" ? _.add(C) : x === "eose" && w.add(C);
        },
        off(x, C) {
          x === "event" ? _.delete(C) : x === "eose" && w.delete(C);
        }
      };
      return K;
    }
    get(o, s, l) {
      return new Promise((u) => {
        let f = this.sub(o, [
          s
        ], l), p = setTimeout(() => {
          f.unsub(), u(null);
        }, this.getTimeout);
        f.on("event", (_) => {
          u(_), clearTimeout(p), f.unsub();
        });
      });
    }
    list(o, s, l) {
      return new Promise((u) => {
        let f = [], p = this.sub(o, s, l);
        p.on("event", (_) => {
          f.push(_);
        }), p.on("eose", () => {
          p.unsub(), u(f);
        });
      });
    }
    publish(o, s) {
      const l = o.map(async (f) => {
        let p;
        try {
          return p = await this.ensureRelay(f), p.publish(s);
        } catch {
          return {
            on() {
            },
            off() {
            }
          };
        }
      }), u = /* @__PURE__ */ new Map();
      return {
        on(f, p) {
          o.forEach(async (_, w) => {
            let H = await l[w], Q = () => p(_);
            u.set(p, Q), H.on(f, Q);
          });
        },
        off(f, p) {
          o.forEach(async (_, w) => {
            let H = u.get(p);
            H && (await l[w]).off(f, H);
          });
        }
      };
    }
    seenOn(o) {
      return Array.from(this._seenOn[o]?.values?.() || []);
    }
  }, ca = {};
  Tn(ca, {
    decode: () => Xi,
    naddrEncode: () => Tf,
    neventEncode: () => If,
    noteEncode: () => Sf,
    nprofileEncode: () => Cf,
    npubEncode: () => Af,
    nrelayEncode: () => Lf,
    nsecEncode: () => kf
  });
  var Rs = 5e3;
  function Xi(o) {
    let { prefix: s, words: l } = je.decode(o, Rs), u = new Uint8Array(je.fromWords(l));
    switch (s) {
      case "nprofile": {
        let f = Ji(u);
        if (!f[0]?.[0]) throw new Error("missing TLV 0 for nprofile");
        if (f[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
        return {
          type: "nprofile",
          data: {
            pubkey: Ke.bytesToHex(f[0][0]),
            relays: f[1] ? f[1].map((p) => Kr.decode(p)) : []
          }
        };
      }
      case "nevent": {
        let f = Ji(u);
        if (!f[0]?.[0]) throw new Error("missing TLV 0 for nevent");
        if (f[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
        if (f[2] && f[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
        return {
          type: "nevent",
          data: {
            id: Ke.bytesToHex(f[0][0]),
            relays: f[1] ? f[1].map((p) => Kr.decode(p)) : [],
            author: f[2]?.[0] ? Ke.bytesToHex(f[2][0]) : void 0
          }
        };
      }
      case "naddr": {
        let f = Ji(u);
        if (!f[0]?.[0]) throw new Error("missing TLV 0 for naddr");
        if (!f[2]?.[0]) throw new Error("missing TLV 2 for naddr");
        if (f[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
        if (!f[3]?.[0]) throw new Error("missing TLV 3 for naddr");
        if (f[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
        return {
          type: "naddr",
          data: {
            identifier: Kr.decode(f[0][0]),
            pubkey: Ke.bytesToHex(f[2][0]),
            kind: parseInt(Ke.bytesToHex(f[3][0]), 16),
            relays: f[1] ? f[1].map((p) => Kr.decode(p)) : []
          }
        };
      }
      case "nrelay": {
        let f = Ji(u);
        if (!f[0]?.[0]) throw new Error("missing TLV 0 for nrelay");
        return {
          type: "nrelay",
          data: Kr.decode(f[0][0])
        };
      }
      case "nsec":
      case "npub":
      case "note":
        return {
          type: s,
          data: Ke.bytesToHex(u)
        };
      default:
        throw new Error(`unknown prefix ${s}`);
    }
  }
  function Ji(o) {
    let s = {}, l = o;
    for (; l.length > 0; ) {
      let u = l[0], f = l[1], p = l.slice(2, 2 + f);
      l = l.slice(2 + f), !(p.length < f) && (s[u] = s[u] || [], s[u].push(p));
    }
    return s;
  }
  function kf(o) {
    return da("nsec", o);
  }
  function Af(o) {
    return da("npub", o);
  }
  function Sf(o) {
    return da("note", o);
  }
  function da(o, s) {
    let l = Ke.hexToBytes(s), u = je.toWords(l);
    return je.encode(o, u, Rs);
  }
  function Cf(o) {
    let s = eo({
      0: [
        Ke.hexToBytes(o.pubkey)
      ],
      1: (o.relays || []).map((u) => vr.encode(u))
    }), l = je.toWords(s);
    return je.encode("nprofile", l, Rs);
  }
  function If(o) {
    let s = eo({
      0: [
        Ke.hexToBytes(o.id)
      ],
      1: (o.relays || []).map((u) => vr.encode(u)),
      2: o.author ? [
        Ke.hexToBytes(o.author)
      ] : []
    }), l = je.toWords(s);
    return je.encode("nevent", l, Rs);
  }
  function Tf(o) {
    let s = new ArrayBuffer(4);
    new DataView(s).setUint32(0, o.kind, !1);
    let l = eo({
      0: [
        vr.encode(o.identifier)
      ],
      1: (o.relays || []).map((f) => vr.encode(f)),
      2: [
        Ke.hexToBytes(o.pubkey)
      ],
      3: [
        new Uint8Array(s)
      ]
    }), u = je.toWords(l);
    return je.encode("naddr", u, Rs);
  }
  function Lf(o) {
    let s = eo({
      0: [
        vr.encode(o)
      ]
    }), l = je.toWords(s);
    return je.encode("nrelay", l, Rs);
  }
  function eo(o) {
    let s = [];
    return Object.entries(o).forEach(([l, u]) => {
      u.forEach((f) => {
        let p = new Uint8Array(f.length + 2);
        p.set([
          parseInt(l)
        ], 0), p.set([
          f.length
        ], 1), p.set(f, 2), s.push(p);
      });
    }), Ke.concatBytes(...s);
  }
  var Df = {};
  Tn(Df, {
    decrypt: () => Nf,
    encrypt: () => Of
  });
  async function Of(o, s, l) {
    const u = Yt(o, "02" + s), f = lc(u);
    let p = Uint8Array.from((0, de.randomBytes)(16)), _ = vr.encode(l), w = await crypto.subtle.importKey("raw", f, {
      name: "AES-CBC"
    }, !1, [
      "encrypt"
    ]), H = await crypto.subtle.encrypt({
      name: "AES-CBC",
      iv: p
    }, w, _), Q = Zr.encode(new Uint8Array(H)), q = Zr.encode(new Uint8Array(p.buffer));
    return `${Q}?iv=${q}`;
  }
  async function Nf(o, s, l) {
    let [u, f] = l.split("?iv="), p = Yt(o, "02" + s), _ = lc(p), w = await crypto.subtle.importKey("raw", _, {
      name: "AES-CBC"
    }, !1, [
      "decrypt"
    ]), H = Zr.decode(u), Q = Zr.decode(f), q = await crypto.subtle.decrypt({
      name: "AES-CBC",
      iv: Q
    }, w, H);
    return Kr.decode(q);
  }
  function lc(o) {
    return o.slice(1, 33);
  }
  var Mf = {};
  Tn(Mf, {
    queryProfile: () => Uf,
    searchDomain: () => Bf,
    useFetchImplementation: () => Rf
  });
  var to;
  try {
    to = fetch;
  } catch {
  }
  function Rf(o) {
    to = o;
  }
  async function Bf(o, s = "") {
    try {
      return (await (await to(`https://${o}/.well-known/nostr.json?name=${s}`)).json()).names;
    } catch {
      return {};
    }
  }
  async function Uf(o) {
    let [s, l] = o.split("@");
    if (l || (l = s, s = "_"), !s.match(/^[A-Za-z0-9-_.]+$/) || !l.includes(".")) return null;
    let u;
    try {
      u = await (await to(`https://${l}/.well-known/nostr.json?name=${s}`)).json();
    } catch {
      return null;
    }
    if (!u?.names?.[s]) return null;
    let f = u.names[s], p = u.relays?.[f] || [];
    return {
      pubkey: f,
      relays: p
    };
  }
  var Pf = {};
  Tn(Pf, {
    generateSeedWords: () => Hf,
    privateKeyFromSeedWords: () => zf,
    validateWords: () => qf
  });
  function zf(o, s) {
    let u = bs.fromMasterSeed((0, dt.mnemonicToSeedSync)(o, s)).derive("m/44'/1237'/0'/0/0").privateKey;
    if (!u) throw new Error("could not derive private key");
    return Ke.bytesToHex(u);
  }
  function Hf() {
    return (0, dt.generateMnemonic)(gt.wordlist);
  }
  function qf(o) {
    return (0, dt.validateMnemonic)(o, gt.wordlist);
  }
  var jf = {};
  Tn(jf, {
    parse: () => Ff
  });
  function Ff(o) {
    const s = {
      reply: void 0,
      root: void 0,
      mentions: [],
      profiles: []
    }, l = [];
    for (const u of o.tags)
      u[0] === "e" && u[1] && l.push(u), u[0] === "p" && u[1] && s.profiles.push({
        pubkey: u[1],
        relays: u[2] ? [
          u[2]
        ] : []
      });
    for (let u = 0; u < l.length; u++) {
      const f = l[u], [p, _, w, H] = f, Q = {
        id: _,
        relays: w ? [
          w
        ] : []
      }, q = u === 0, K = u === l.length - 1;
      if (H === "root") {
        s.root = Q;
        continue;
      }
      if (H === "reply") {
        s.reply = Q;
        continue;
      }
      if (H === "mention") {
        s.mentions.push(Q);
        continue;
      }
      if (q) {
        s.root = Q;
        continue;
      }
      if (K) {
        s.reply = Q;
        continue;
      }
      s.mentions.push(Q);
    }
    return s;
  }
  var Zf = {};
  Tn(Zf, {
    getPow: () => Vf
  });
  function Vf(o) {
    return Gf(Ke.hexToBytes(o));
  }
  function Gf(o) {
    let s, l, u;
    for (l = 0, s = 0; l < o.length && (u = Wf(o[l]), s += u, u === 8); l++)
      ;
    return s;
  }
  function Wf(o) {
    let s = 0;
    if (o === 0) return 8;
    for (; o >>= 1; ) s++;
    return 7 - s;
  }
  var Kf = {};
  Tn(Kf, {
    BECH32_REGEX: () => cc,
    NOSTR_URI_REGEX: () => no,
    parse: () => Yf,
    test: () => Qf
  });
  var cc = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/, no = new RegExp(`nostr:(${cc.source})`);
  function Qf(o) {
    return typeof o == "string" && new RegExp(`^${no.source}$`).test(o);
  }
  function Yf(o) {
    const s = o.match(new RegExp(`^${no.source}$`));
    if (!s) throw new Error(`Invalid Nostr URI: ${o}`);
    return {
      uri: s[0],
      value: s[1],
      decoded: Xi(s[1])
    };
  }
  var Xf = {};
  Tn(Xf, {
    createDelegation: () => Jf,
    getDelegator: () => ep
  });
  function Jf(o, s) {
    let l = [];
    (s.kind || -1) >= 0 && l.push(`kind=${s.kind}`), s.until && l.push(`created_at<${s.until}`), s.since && l.push(`created_at>${s.since}`);
    let u = l.join("&");
    if (u === "") throw new Error("refusing to create a delegation without any conditions");
    let f = (0, Ht.sha256)(vr.encode(`nostr:delegation:${s.pubkey}:${u}`)), p = Ke.bytesToHex(Fn.signSync(f, o));
    return {
      from: nc(o),
      to: s.pubkey,
      cond: u,
      sig: p
    };
  }
  function ep(o) {
    let s = o.tags.find((w) => w[0] === "delegation" && w.length >= 4);
    if (!s) return null;
    let l = s[1], u = s[2], f = s[3], p = u.split("&");
    for (let w = 0; w < p.length; w++) {
      let [H, Q, q] = p[w].split(/\b/);
      if (!(H === "kind" && Q === "=" && o.kind === parseInt(q))) {
        if (H === "created_at" && Q === "<" && o.created_at < parseInt(q)) continue;
        if (H === "created_at" && Q === ">" && o.created_at > parseInt(q)) continue;
        return null;
      }
    }
    let _ = (0, Ht.sha256)(vr.encode(`nostr:delegation:${o.pubkey}:${u}`));
    return Fn.verifySync(f, _, l) ? l : null;
  }
  var tp = {};
  Tn(tp, {
    matchAll: () => np,
    regex: () => ua,
    replaceAll: () => rp
  });
  var ua = () => new RegExp(`\\b${no.source}\\b`, "g");
  function* np(o) {
    const s = o.matchAll(ua());
    for (const l of s) {
      const [u, f] = l;
      yield {
        uri: u,
        value: f,
        decoded: Xi(f),
        start: l.index,
        end: l.index + u.length
      };
    }
  }
  function rp(o, s) {
    return o.replaceAll(ua(), (l, u) => s({
      uri: l,
      value: u,
      decoded: Xi(u)
    }));
  }
  var sp = {};
  Tn(sp, {
    useFetchImplementation: () => ip,
    validateGithub: () => op
  });
  var ha;
  try {
    ha = fetch;
  } catch {
  }
  function ip(o) {
    ha = o;
  }
  async function op(o, s, l) {
    try {
      return await (await ha(`https://gist.github.com/${s}/${l}/raw`)).text() === `Verifying that I control the following Nostr public key: ${o}`;
    } catch {
      return !1;
    }
  }
  var ap = {};
  Tn(ap, {
    authenticate: () => lp
  });
  var lp = async ({ challenge: o, relay: s, sign: l }) => {
    const u = {
      kind: 22242,
      created_at: Math.floor(Date.now() / 1e3),
      tags: [
        [
          "relay",
          s.url
        ],
        [
          "challenge",
          o
        ]
      ],
      content: ""
    }, f = s.auth(await l(u));
    return new Promise((p, _) => {
      f.on("ok", function w() {
        f.off("ok", w), p();
      }), f.on("failed", function w(H) {
        f.off("failed", w), _(H);
      });
    });
  }, fa = {};
  Tn(fa, {
    getZapEndpoint: () => dp,
    makeZapReceipt: () => fp,
    makeZapRequest: () => up,
    useFetchImplementation: () => cp,
    validateZapRequest: () => hp
  });
  var pa;
  try {
    pa = fetch;
  } catch {
  }
  function cp(o) {
    pa = o;
  }
  async function dp(o) {
    try {
      let s = "", { lud06: l, lud16: u } = JSON.parse(o.content);
      if (l) {
        let { words: _ } = je.decode(l, 1e3), w = je.fromWords(_);
        s = Kr.decode(w);
      } else if (u) {
        let [_, w] = u.split("@");
        s = `https://${w}/.well-known/lnurlp/${_}`;
      } else return null;
      let p = await (await pa(s)).json();
      if (p.allowsNostr && p.nostrPubkey) return p.callback;
    } catch {
    }
    return null;
  }
  function up({ profile: o, event: s, amount: l, relays: u, comment: f = "" }) {
    if (!l) throw new Error("amount not given");
    if (!o) throw new Error("profile not given");
    let p = {
      kind: 9734,
      created_at: Math.round(Date.now() / 1e3),
      content: f,
      tags: [
        [
          "p",
          o
        ],
        [
          "amount",
          l.toString()
        ],
        [
          "relays",
          ...u
        ]
      ]
    };
    return s && p.tags.push([
      "e",
      s
    ]), p;
  }
  function hp(o) {
    let s;
    try {
      s = JSON.parse(o);
    } catch {
      return "Invalid zap request JSON.";
    }
    if (!la(s)) return "Zap request is not a valid Nostr event.";
    if (!rc(s)) return "Invalid signature on zap request.";
    let l = s.tags.find(([p, _]) => p === "p" && _);
    if (!l) return "Zap request doesn't have a 'p' tag.";
    if (!l[1].match(/^[a-f0-9]{64}$/)) return "Zap request 'p' tag is not valid hex.";
    let u = s.tags.find(([p, _]) => p === "e" && _);
    return u && !u[1].match(/^[a-f0-9]{64}$/) ? "Zap request 'e' tag is not valid hex." : s.tags.find(([p, _]) => p === "relays" && _) ? null : "Zap request doesn't have a 'relays' tag.";
  }
  function fp({ zapRequest: o, preimage: s, bolt11: l, paidAt: u }) {
    let p = JSON.parse(o).tags.filter(([w]) => w === "e" || w === "p" || w === "a"), _ = {
      kind: 9735,
      created_at: Math.round(u.getTime() / 1e3),
      content: "",
      tags: [
        ...p,
        [
          "bolt11",
          l
        ],
        [
          "description",
          o
        ]
      ]
    };
    return s && _.tags.push([
      "preimage",
      s
    ]), _;
  }
  Ke.hmacSha256Sync = (o, ...s) => (0, Ct.hmac)(Ht.sha256, o, Ke.concatBytes(...s)), Ke.sha256Sync = (...o) => (0, Ht.sha256)(Ke.concatBytes(...o));
  const pp = (o) => ca.decode(o).data, dc = (o) => ca.decode(o).data;
  let uc = {};
  const gp = async (o) => {
    if (uc[o]) return uc[o];
    const s = new ac(), l = [
      "wss://relay.nostr.band",
      "wss://purplepag.es",
      "wss://relay.damus.io",
      "wss://nostr.wine"
    ];
    try {
      return await s.get(l, {
        authors: [
          o
        ],
        kinds: [
          0
        ]
      });
    } catch {
      throw new Error("failed to fetch user profile :(");
    } finally {
      s.close(l);
    }
  }, vp = (o) => JSON.parse(o.content), bp = async (o) => {
    const s = await fa.getZapEndpoint(o);
    if (!s) throw new Error("failed to retrieve zap endpoint :(");
    return s;
  }, mp = async (o, s) => {
    if (hc() && !s) try {
      return await window.nostr.signEvent(o);
    } catch {
    }
    return pf(o, df());
  }, yp = async ({ profile: o, nip19Target: s, amount: l, relays: u, comment: f, anon: p }) => {
    const _ = fa.makeZapRequest({
      profile: o,
      event: s && s.startsWith("note") ? dc(s) : void 0,
      amount: l,
      relays: u,
      comment: f
    }), w = s && s.startsWith("naddr") ? dc(s) : void 0;
    if (w) {
      const H = w.relays ? w.relays.reduce((Q, q) => `${q},${Q}`, "") : "";
      _.tags.push([
        "a",
        `${w.kind}:${w.pubkey}:${w.identifier}`,
        H
      ]);
    }
    return (!hc() || p) && _.tags.push([
      "anon"
    ]), mp(_, p);
  }, wp = async ({ zapEndpoint: o, amount: s, comment: l, authorId: u, nip19Target: f, normalizedRelays: p, anon: _ }) => {
    const w = await yp({
      profile: u,
      nip19Target: f,
      amount: s,
      relays: p,
      comment: l,
      anon: _
    });
    let H = `${o}?amount=${s}&nostr=${encodeURIComponent(JSON.stringify(w))}`;
    l && (H = `${H}&comment=${encodeURIComponent(l)}`);
    const Q = await fetch(H), { pr: q, reason: K, status: x } = await Q.json();
    if (q) return q;
    throw x === "ERROR" ? new Error(K ?? "Unable to fetch invoice") : new Error("Unable to fetch invoice");
  }, hc = () => window !== void 0 && window.nostr !== void 0, xp = ({ relays: o, invoice: s, onSuccess: l }) => {
    const u = new ac(), f = Array.from(/* @__PURE__ */ new Set([
      ...o,
      "wss://relay.nostr.band"
    ])), p = () => {
      u && u.close(f);
    }, _ = Math.round(Date.now() / 1e3), w = setInterval(() => {
      u.sub(f, [
        {
          kinds: [
            9735
          ],
          since: _
        }
      ]).on("event", (Q) => {
        Q.tags.find((q) => q[0] === "bolt11" && q[1] === s) && (l(), p(), clearInterval(w));
      });
    }, 5e3);
    return () => {
      p(), clearInterval(w);
    };
  }, fc = "nostrZap.", pc = "lightningUri", gc = () => typeof localStorage < "u", _p = (o) => {
    if (gc())
      return localStorage.getItem(`${fc}${o}`);
  }, Ep = (o, s) => {
    gc() && localStorage.setItem(`${fc}${o}`, s);
  }, $p = () => _p(pc), kp = (o) => Ep(pc, o);
  let ga = null;
  const Ap = (o) => {
    o = o.replace(/^#/, ""), o.length === 3 && (o = o.split("").map((p) => p + p).join(""));
    const s = parseInt(o, 16), l = s >> 16 & 255, u = s >> 8 & 255, f = s & 255;
    return {
      r: l,
      g: u,
      b: f
    };
  }, Sp = ({ r: o, g: s, b: l }) => (o * 299 + s * 587 + l * 114) / 1e3, vc = (o) => {
    const s = Ap(o);
    return Sp(s) < 128 ? "#fff" : "#000";
  }, va = (o) => {
    const s = document.createElement("dialog");
    return s.classList.add("nostr-zap-dialog"), s.innerHTML = o, s.addEventListener("click", function({ clientX: l, clientY: u }) {
      const { left: f, right: p, top: _, bottom: w } = s.getBoundingClientRect();
      l === 0 && u === 0 || (l < f || l > p || u < _ || u > w) && s.close();
    }), ga.appendChild(s), s;
  }, Cp = ({ dialogHeader: o, invoice: s, relays: l, buttonColor: u }) => {
    const f = $p(), _ = va(`
        <button class="close-button">X</button>
        ${o}
        <div class="qrcode">
          <div class="overlay">copied invoice to clipboard</div>
        </div>
        <p>click QR code to copy invoice</p>
        <select name="lightning-wallet">
          ${[
      {
        label: "Default Wallet",
        value: "lightning:"
      },
      {
        label: "Strike",
        value: "strike:lightning:"
      },
      {
        label: "Cash App",
        value: "https://cash.app/launch/lightning/"
      },
      {
        label: "Muun",
        value: "muun:"
      },
      {
        label: "Blue Wallet",
        value: "bluewallet:lightning:"
      },
      {
        label: "Wallet of Satoshi",
        value: "walletofsatoshi:lightning:"
      },
      {
        label: "Zebedee",
        value: "zebedee:lightning:"
      },
      {
        label: "Zeus LN",
        value: "zeusln:lightning:"
      },
      {
        label: "Phoenix",
        value: "phoenix://"
      },
      {
        label: "Breez",
        value: "breez:"
      },
      {
        label: "Bitcoin Beach",
        value: "bitcoinbeach://"
      },
      {
        label: "Blixt",
        value: "blixtwallet:lightning:"
      },
      {
        label: "River",
        value: "river://"
      }
    ].map(({ label: x, value: C }) => `<option value="${C}" ${f === C ? "selected" : ""}>${x}</option>`).join("")}
        </select>
        <button class="cta-button"
          ${u ? `style="background-color: ${u}; color: ${vc(u)}"` : ""} 
        >Open Wallet</button>
      `), w = _.querySelector(".qrcode"), H = _.querySelector('select[name="lightning-wallet"]'), Q = _.querySelector(".cta-button"), q = w.querySelector(".overlay"), K = xp({
      relays: l,
      invoice: s,
      onSuccess: () => {
        _.close();
      }
    });
    return new (/* @__PURE__ */ e(a))(w, {
      text: s,
      quietZone: 10
    }), w.addEventListener("click", function() {
      navigator.clipboard.writeText(s), q.classList.add("show"), setTimeout(() => q.classList.remove("show"), 2e3);
    }), Q.addEventListener("click", function() {
      kp(H.value), window.location.href = `${H.value}${s}`;
    }), _.addEventListener("close", function() {
      K(), _.remove();
    }), _.querySelector(".close-button").addEventListener("click", function() {
      _.close();
    }), _;
  }, Ip = async ({ npub: o, nip19Target: s, relays: l, buttonColor: u, anon: f }) => {
    const p = (Se) => `${Se.substring(0, 12)}...${Se.substring(Se.length - 12)}`, _ = l ? l.split(",") : [
      "wss://relay.nostr.band",
      "wss://relay.damus.io",
      "wss://nos.lol"
    ], w = pp(o), H = gp(w), Q = "https://pbs.twimg.com/profile_images/1604195803748306944/LxHDoJ7P_400x400.jpg", q = async () => {
      const { picture: Se, display_name: Oe, name: yt } = vp(await H);
      return `
      <h2>${Oe || yt}</h2>
        <img
          src="${Se || Q}"
          width="80"
          height="80"
          alt="nostr user avatar"
        />
      <p>${p(s || o)}</p>
    `;
    }, K = va(`
      <button class="close-button">X</button>
      <div class="dialog-header-container">
        <h2 class="skeleton-placeholder"></h2>
          <img
            src="${Q}"
            width="80"
            height="80"
            alt="placeholder avatar"
          />
        <p class="skeleton-placeholder"></p>
      </div>
      <div class="preset-zap-options-container">
        <button data-value="21">21 ⚡️</button>
        <button data-value="69">69 ⚡️</button>
        <button data-value="420">420 ⚡️</button>
        <button data-value="1337">1337 ⚡️</button>
        <button data-value="5000">5k ⚡️</button>
        <button data-value="10000">10k ⚡️</button>
        <button data-value="21000">21k ⚡️</button>
        <button data-value="1000000">1M ⚡️</button>
      </div>
      <form>
        <input name="amount" type="number" placeholder="amount in sats" required />
        <input name="comment" placeholder="optional comment" />
        <button class="cta-button" 
          ${u ? `style="background-color: ${u}; color: ${vc(u)}"` : ""} 
          type="submit" disabled>Zap</button>
      </form>
    `), x = K.querySelector(".preset-zap-options-container"), C = K.querySelector("form"), B = K.querySelector('input[name="amount"]'), G = K.querySelector('input[name="comment"]'), ne = K.querySelector('button[type="submit"]'), oe = K.querySelector(".dialog-header-container"), ye = (Se) => {
      K.close(), bc(Se, o).showModal();
    };
    q().then((Se) => {
      oe.innerHTML = Se, ne.disabled = !1;
    }).catch(ye);
    const he = () => {
      ne.disabled = !0, ne.innerHTML = '<div class="spinner">Loading</div>';
    }, Ae = () => {
      ne.disabled = !1, ne.innerHTML = "Zap";
    }, _e = (Se) => {
      B.value = Se;
    };
    K.addEventListener("close", function() {
      Ae(), C.reset();
    }), K.querySelector(".close-button").addEventListener("click", function() {
      K.close();
    }), x.addEventListener("click", function(Se) {
      Se.target.matches("button") && (_e(Se.target.getAttribute("data-value")), B.focus());
    });
    const xe = H.then(bp);
    return C.addEventListener("submit", async function(Se) {
      Se.preventDefault(), he();
      const Oe = Number(B.value) * 1e3, yt = G.value;
      try {
        const D = await wp({
          zapEndpoint: await xe,
          amount: Oe,
          comment: yt,
          authorId: w,
          nip19Target: s,
          normalizedRelays: _,
          anon: f
        }), M = async () => {
          const I = Cp({
            dialogHeader: await q(),
            invoice: D,
            relays: _,
            buttonColor: u
          }), Z = I.querySelector(".cta-button");
          K.close(), I.showModal(), Z.focus();
        };
        if (window.webln) try {
          await window.webln.enable(), await window.webln.sendPayment(D), K.close();
        } catch {
          M();
        }
        else M();
      } catch (D) {
        ye(D);
      }
    }), K;
  }, bc = (o, s) => {
    const l = va(`
    <button class="close-button">X</button>
    <p class="error-message">${o}</p>
    <a href="https://nosta.me/${s}" target="_blank">
      <button class="cta-button">View Nostr Profile</button>
    </a>
  `);
    return l.addEventListener("close", function() {
      l.remove();
    }), l.querySelector(".close-button").addEventListener("click", function() {
      l.close();
    }), l;
  }, mc = async ({ npub: o, noteId: s, naddr: l, relays: u, cachedAmountDialog: f, buttonColor: p, anon: _ }) => {
    let w = f;
    try {
      return w || (w = await Ip({
        npub: o,
        nip19Target: l || s,
        relays: u,
        buttonColor: p,
        anon: _
      })), w.showModal(), window.matchMedia("(max-height: 932px)").matches || w.querySelector('input[name="amount"]').focus(), w;
    } catch (H) {
      w && w.close(), bc(H, o).showModal();
    }
  }, yc = (o) => {
    let s = null, l = null;
    o.addEventListener("click", async function() {
      const u = o.getAttribute("data-npub"), f = o.getAttribute("data-note-id"), p = o.getAttribute("data-naddr"), _ = o.getAttribute("data-relays"), w = o.getAttribute("data-button-color"), H = o.getAttribute("data-anon") === "true";
      l && (l.npub !== u || l.noteId !== f || l.naddr !== p || l.relays !== _ || l.buttonColor !== w || l.anon !== H) && (s = null), l = {
        npub: u,
        noteId: f,
        naddr: p,
        relays: _,
        buttonColor: w,
        anon: H
      }, s = await mc({
        npub: u,
        noteId: f,
        naddr: p,
        relays: _,
        cachedAmountDialog: s,
        buttonColor: w,
        anon: H
      });
    });
  }, wc = (o) => {
    document.querySelectorAll(o || "[data-npub]").forEach(yc);
  };
  return (() => {
    const o = document.createElement("style");
    o.innerHTML = `
      .nostr-zap-dialog {
        width: 424px;
        min-width: 376px;
        margin: auto;
        box-sizing: content-box;
        border: none;
        border-radius: 10px;
        padding: 36px;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        background-color: white;
      }
      .nostr-zap-dialog[open],
      .nostr-zap-dialog form {
        display: block;
        max-width: fit-content;
      }
      .nostr-zap-dialog form {
        padding: 0;
        width: 100%;
      }
      .nostr-zap-dialog img {
        display: inline;
        border-radius: 50%;
      }
      .nostr-zap-dialog h2 {
        font-size: 1.5em;
        font-weight: bold;
        color: black;
      }
      .nostr-zap-dialog p {
        font-size: 1em;
        font-weight: normal;
        color: black;
      }
      .nostr-zap-dialog h2,
      .nostr-zap-dialog p,
      .nostr-zap-dialog .skeleton-placeholder {
        margin: 4px;
        word-wrap: break-word;
      }
      .nostr-zap-dialog button {
        background-color: inherit;
        padding: 12px 0;
        border-radius: 5px;
        border: none;
        font-size: 16px;
        cursor: pointer;
        border: 1px solid rgb(226, 232, 240);
        width: 100px;
        max-width: 100px;
        max-height: 52px;
        white-space: nowrap;
        color: black;
        box-sizing: border-box;
      }
      .nostr-zap-dialog button:hover {
        background-color: #edf2f7;
      }
      .nostr-zap-dialog button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .nostr-zap-dialog .cta-button {
        background-color: #7f00ff;
        color: #fff;
        width: 100%;
        max-width: 100%;
        margin-top: 16px;
      }
      .nostr-zap-dialog .cta-button:hover {
        background-color: indigo;
      }
      .nostr-zap-dialog .close-button {
        background-color: inherit;
        color: black;
        border-radius: 50%;
        width: 42px;
        height: 42px;
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 12px;
        border: none;
      }
      .nostr-zap-dialog .preset-zap-options-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 24px 0 8px 0;
        height: 120px;
      }
      .nostr-zap-dialog input {
        padding: 12px;
        border-radius: 5px;
        border: none;
        font-size: 16px;
        width: 100%;
        max-width: 100%;
        background-color: #f7fafc;
        color: #1a202c;
        box-shadow: none;
        box-sizing: border-box;
        margin-bottom: 16px;
        border: 1px solid lightgray;
      }
      .nostr-zap-dialog .spinner {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .nostr-zap-dialog .spinner:after {
        content: " ";
        display: block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 4px solid #fff;
        border-color: #fff transparent #fff transparent;
        animation: nostr-zap-dialog-spinner 1.2s linear infinite;
        margin-left: 8px;
      }
      .nostr-zap-dialog .error-message {
        text-align: left;
        color: red;
        margin-top: 8px;
      }
      .nostr-zap-dialog .qrcode {
        position: relative;
        display: inline-block;
        margin-top: 24px;
      }
      .nostr-zap-dialog .qrcode .overlay {
        position: absolute;
        color: white;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(127, 17, 224, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
      }
      .nostr-zap-dialog .qrcode .overlay.show {
        opacity: 1;
      }
      @keyframes nostr-zap-dialog-spinner {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      @keyframes nostr-zap-dialog-skeleton-pulse {
        0% {
          opacity: 0.6;
        }
        50% {
          opacity: 0.8;
        }
        100% {
          opacity: 0.6;
        }
      }
      .nostr-zap-dialog .skeleton-placeholder {
        animation-name: nostr-zap-dialog-skeleton-pulse;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        background-color: #e8e8e8;
        border-radius: 4px;
        margin: 4px auto;
      }
      .nostr-zap-dialog p.skeleton-placeholder {
        height: 20px;
        width: 200px;
      }
      .nostr-zap-dialog h2.skeleton-placeholder {
        height: 28px;
        width: 300px;
      }
      .nostr-zap-dialog select[name="lightning-wallet"] {
        appearance: none;
        background-color: white;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%232D3748" width="24" height="24" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /></svg>');
        background-repeat: no-repeat;
        background-position: right 0.7rem center;
        background-size: 16px;
        border: 1px solid #CBD5E0;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border-radius: 0.25rem;
        width: 100%;
        margin-top: 24px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        cursor: pointer;
      }
      .nostr-zap-dialog select[name="lightning-wallet"]:focus {
        outline: none;
        border-color: #4FD1C5;
        box-shadow: 0 0 0 2px #4FD1C5;
      }
      @media only screen and (max-width: 480px) {
        .nostr-zap-dialog {
          padding: 18px;
        }

        .nostr-zap-dialog button {
          width: 92px;
          max-width: 92px;
        }
      }
      @media only screen and (max-width: 413px) {
        .nostr-zap-dialog {
          min-width: 324px;
        }
        .nostr-zap-dialog button {
          width: 78px;
          max-width: 78px;
        }
      }
  `;
    const s = document.createElement("div");
    document.body.appendChild(s), ga = s.attachShadow({
      mode: "open"
    }), ga.appendChild(o);
  })(), wc(), window.nostrZap = {
    init: mc,
    initTarget: yc,
    initTargets: wc
  }, nd;
}
u1();
var h1 = Ze('<div class="rotate-right-icon svg-icon svelte-1x7qm6n"></div> <span class="btn-text"> </span>', 1), f1 = Ze('<span class="relay-toggle-icon svelte-1x7qm6n" aria-label="toggle"><!></span> ', 1), p1 = Ze('<span class="relay-check-icon svg-icon svelte-1x7qm6n" aria-hidden="true"></span>'), g1 = Ze('<span class="relay-check-icon svg-icon svelte-1x7qm6n" aria-hidden="true"></span>'), v1 = Ze('<div class="relay-copy-icon svg-icon svelte-1x7qm6n" aria-hidden="true"></div>'), b1 = Ze('<li class="svelte-1x7qm6n"><span class="relay-url svelte-1x7qm6n"> </span> <span><!></span> <span><!></span> <div class="relay-copy-cell svelte-1x7qm6n"><!></div></li>'), m1 = Ze('<div class="relay-list-header svelte-1x7qm6n" aria-hidden="true"><span> </span> <span> </span> <span> </span> <span class="relay-copy-column" aria-hidden="true"></span></div> <ul class="svelte-1x7qm6n"></ul>', 1), y1 = Ze('<span style="color: #888;"> </span>'), w1 = Ze('<div class="relay-list svelte-1x7qm6n"><!></div>'), x1 = Ze('<div class="setting-section"><div class="setting-row"><span class="setting-label"> </span> <div class="setting-control"><!></div></div> <div class="setting-info svelte-1x7qm6n"><!> <!></div></div>');
const _1 = {
  hash: "svelte-1x7qm6n",
  code: `.setting-info.svelte-1x7qm6n {margin-inline-start:10px;.relay-toggle-label {min-height:44px;padding:10px;--btn-bg: transparent;}}.rotate-right-icon.svelte-1x7qm6n {mask-image:var(--ehagaki-icon-726566726573685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.relay-list.svelte-1x7qm6n {margin-inline-start:10px;.relay-list-header:where(.svelte-1x7qm6n),
        li:where(.svelte-1x7qm6n) {display:grid;grid-template-columns:minmax(0, 1fr) 48px 52px 44px;align-items:center;column-gap:8px;}.relay-list-header:where(.svelte-1x7qm6n) {margin-top:6px;padding-bottom:4px;border-bottom:1px solid var(--border-hr);color:var(--text-light);font-size:0.8125rem;font-weight:600;}ul:where(.svelte-1x7qm6n) {margin:0;padding-inline-start:0;font-size:0.9375rem;list-style:none;}li:where(.svelte-1x7qm6n) {color:var(--text-light);padding:6px 0;border-bottom:1px solid var(--border-hr);}li:where(.svelte-1x7qm6n):last-child {border-bottom:none;}.relay-url:where(.svelte-1x7qm6n) {min-width:0;overflow-wrap:anywhere;}.relay-copy-cell:where(.svelte-1x7qm6n) {display:flex;justify-content:flex-end;min-width:0;}button.relay-copy-btn.copy {width:44px;height:44px;min-width:44px;min-height:44px;padding:0;}.relay-copy-icon:where(.svelte-1x7qm6n) {width:20px;height:20px;}.relay-capability:where(.svelte-1x7qm6n) {color:var(--text-light);font-weight:700;text-align:center;}.relay-capability.enabled:where(.svelte-1x7qm6n) {color:var(--theme);}.relay-check-icon:where(.svelte-1x7qm6n) {display:inline-block;width:20px;height:20px;vertical-align:middle;mask-image:var(--ehagaki-icon-636865636b5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}}.relay-toggle-icon.svelte-1x7qm6n {font-size:1.2rem;color:gray;}`
};
function Dh(n, e) {
  or(e, !0), Eo(n, _1);
  const t = () => as(ko, "$_", r), [r, i] = $o();
  let a = Me(e, "relayConfig", 7), c = Me(e, "showRelays", 7), d = Me(e, "onToggleShowRelays", 7), h = Me(e, "onRefreshRelaysAndProfile", 7);
  function g(O) {
    return O ? Array.isArray(O) ? O.map((k) => ({
      url: Ec.normalizeRelayUrl(k),
      read: !0,
      write: !0
    })) : Object.entries(O).map(([k, $]) => ({
      url: Ec.normalizeRelayUrl(k),
      read: $.read,
      write: $.write
    })) : [];
  }
  let b = Ee(() => g(a()));
  async function m(O, k) {
    return k.stopPropagation(), Bp(O, "URL", navigator, window);
  }
  var v = {
    get relayConfig() {
      return a();
    },
    set relayConfig(O) {
      a(O), Re();
    },
    get showRelays() {
      return c();
    },
    set showRelays(O) {
      c(O), Re();
    },
    get onToggleShowRelays() {
      return d();
    },
    set onToggleShowRelays(O) {
      d(O), Re();
    },
    get onRefreshRelaysAndProfile() {
      return h();
    },
    set onRefreshRelaysAndProfile(O) {
      h(O), Re();
    }
  }, T = x1(), A = R(T), E = R(A), L = R(E, !0);
  N(E);
  var U = se(E, 2), P = R(U);
  {
    let O = Ee(() => t()("settingsDialog.refresh_relays_and_profile") || "再取得");
    Bt(P, {
      variant: "default",
      shape: "rounded",
      contentLayout: "iconText",
      className: "refresh-relays-profile-btn",
      onClick: () => h()?.(),
      get ariaLabel() {
        return y(O);
      },
      children: (k, $) => {
        var S = h1(), j = at(S), V = se(j, 2), Y = R(V, !0);
        N(V), Be(
          (W, re) => {
            wr(j, "aria-label", W), fe(Y, re);
          },
          [
            () => t()("settingsDialog.refresh") || "更新",
            () => t()("settingsDialog.refresh") || "更新"
          ]
        ), ce(k, S);
      },
      $$slots: { default: !0 }
    });
  }
  N(U), N(A);
  var J = se(A, 2), ie = R(J);
  {
    let O = Ee(() => t()("settingsDialog.toggle_relay_list") || "リレーリストの表示切替");
    Bt(ie, {
      variant: "default",
      shape: "rounded",
      className: "relay-toggle-label",
      get onClick() {
        return d();
      },
      get "aria-pressed"() {
        return c();
      },
      get ariaLabel() {
        return y(O);
      },
      children: (k, $) => {
        var S = f1(), j = at(S), V = R(j);
        {
          var Y = (ue) => {
            var be = $t("▼");
            ce(ue, be);
          }, W = (ue) => {
            var be = $t("▶");
            ce(ue, be);
          };
          vt(V, (ue) => {
            c() ? ue(Y) : ue(W, -1);
          });
        }
        N(j);
        var re = se(j);
        Be((ue) => fe(re, ` ${ue ?? ""}`), [() => t()("settingsDialog.relay_list") || "リレーリスト"]), ce(k, S);
      },
      $$slots: { default: !0 }
    });
  }
  var te = se(ie, 2);
  {
    var ee = (O) => {
      var k = w1(), $ = R(k);
      {
        var S = (V) => {
          var Y = m1(), W = at(Y), re = R(W), ue = R(re, !0);
          N(re);
          var be = se(re, 2), pe = R(be, !0);
          N(be);
          var Ie = se(be, 2), $e = R(Ie, !0);
          N(Ie), jt(2), N(W);
          var Ce = se(W, 2);
          Mr(Ce, 21, () => y(b), Rr, (Ve, Ge) => {
            var ke = b1(), We = R(ke), bt = R(We, !0);
            N(We);
            var ge = se(We, 2);
            let it;
            var pn = R(ge);
            {
              var Qt = (tt) => {
                var Je = p1();
                ce(tt, Je);
              }, Hn = (tt) => {
                var Je = $t("–");
                ce(tt, Je);
              };
              vt(pn, (tt) => {
                y(Ge).read ? tt(Qt) : tt(Hn, -1);
              });
            }
            N(ge);
            var nn = se(ge, 2);
            let rn;
            var gn = R(nn);
            {
              var ve = (tt) => {
                var Je = g1();
                ce(tt, Je);
              }, Ue = (tt) => {
                var Je = $t("–");
                ce(tt, Je);
              };
              vt(gn, (tt) => {
                y(Ge).write ? tt(ve) : tt(Ue, -1);
              });
            }
            N(nn);
            var Ye = se(nn, 2), lt = R(Ye);
            {
              let tt = Ee(() => `${t()("settingsDialog.copy_relay_url") || "リレーURLをコピー"}: ${y(Ge).url}`), Je = Ee(() => t()("common.copySuccess"));
              Bt(lt, {
                variant: "copy",
                shape: "circle",
                className: "relay-copy-btn",
                get ariaLabel() {
                  return y(tt);
                },
                onClick: (ft) => m(y(Ge).url, ft),
                get floatingMessage() {
                  return y(Je);
                },
                children: (ft, Pe) => {
                  var kt = v1();
                  ce(ft, kt);
                },
                $$slots: { default: !0 }
              });
            }
            N(Ye), N(ke), Be(
              (tt, Je) => {
                fe(bt, y(Ge).url), it = Ha(ge, 1, "relay-capability svelte-1x7qm6n", null, it, { enabled: y(Ge).read }), wr(ge, "aria-label", tt), rn = Ha(nn, 1, "relay-capability svelte-1x7qm6n", null, rn, { enabled: y(Ge).write }), wr(nn, "aria-label", Je);
              },
              [
                () => y(Ge).read ? t()("settingsDialog.relay_read_enabled") || "Read enabled" : t()("settingsDialog.relay_read_disabled") || "Read disabled",
                () => y(Ge).write ? t()("settingsDialog.relay_write_enabled") || "Write enabled" : t()("settingsDialog.relay_write_disabled") || "Write disabled"
              ]
            ), ce(Ve, ke);
          }), N(Ce), Be(
            (Ve, Ge, ke) => {
              fe(ue, Ve), fe(pe, Ge), fe($e, ke);
            },
            [
              () => t()("settingsDialog.relay") || "リレー",
              () => t()("settingsDialog.relay_read") || "Read",
              () => t()("settingsDialog.relay_write") || "Write"
            ]
          ), ce(V, Y);
        }, j = (V) => {
          var Y = y1(), W = R(Y, !0);
          N(Y), Be((re) => fe(W, re), [() => t()("settingsDialog.no_relay_info") || "リレー情報なし"]), ce(V, Y);
        };
        vt($, (V) => {
          y(b).length > 0 ? V(S) : V(j, -1);
        });
      }
      N(k), ce(O, k);
    };
    vt(te, (O) => {
      c() && O(ee);
    });
  }
  N(J), N(T), Be((O) => fe(L, O), [
    () => t()("settingsDialog.refresh_relays_and_profile") || "リレーリスト・プロフィール再取得"
  ]), ce(n, T);
  var F = ar(v);
  return i(), F;
}
lr(
  Dh,
  {
    relayConfig: {},
    showRelays: {},
    onToggleShowRelays: {},
    onRefreshRelaysAndProfile: {}
  },
  [],
  [],
  { mode: "open" }
);
function qs(n, e) {
  or(e, !0);
  let t = Me(e, "value", 7), r = Me(e, "disabled", 7, !1), i = Me(e, "variant", 7, "default"), a = Me(e, "shape", 7, "rounded"), c = Me(e, "contentLayout", 7, void 0), d = Me(e, "className", 7, ""), h = Me(e, "ariaLabel", 7, ""), g = Me(e, "style", 7, ""), b = Me(e, "children", 7);
  var m = {
    get value() {
      return t();
    },
    set value(A) {
      t(A), Re();
    },
    get disabled() {
      return r();
    },
    set disabled(A = !1) {
      r(A), Re();
    },
    get variant() {
      return i();
    },
    set variant(A = "default") {
      i(A), Re();
    },
    get shape() {
      return a();
    },
    set shape(A = "rounded") {
      a(A), Re();
    },
    get contentLayout() {
      return c();
    },
    set contentLayout(A = void 0) {
      c(A), Re();
    },
    get className() {
      return d();
    },
    set className(A = "") {
      d(A), Re();
    },
    get ariaLabel() {
      return h();
    },
    set ariaLabel(A = "") {
      h(A), Re();
    },
    get style() {
      return g();
    },
    set style(A = "") {
      g(A), Re();
    },
    get children() {
      return b();
    },
    set children(A) {
      b(A), Re();
    }
  }, v = Pt(), T = at(v);
  {
    const A = (E, L) => {
      let U = () => L?.().props, P = () => L?.().checked;
      Bt(E, yo(U, {
        get variant() {
          return i();
        },
        get shape() {
          return a();
        },
        get contentLayout() {
          return c();
        },
        get className() {
          return d();
        },
        get ariaLabel() {
          return h();
        },
        get style() {
          return g();
        },
        get disabled() {
          return r();
        },
        get selected() {
          return P();
        },
        children: (J, ie) => {
          var te = Pt(), ee = at(te);
          Hr(ee, () => b() ?? Oi), ce(J, te);
        },
        $$slots: { default: !0 }
      }));
    };
    en(T, () => pd, (E, L) => {
      L(E, {
        get value() {
          return t();
        },
        get disabled() {
          return r();
        },
        get "aria-label"() {
          return h();
        },
        child: A,
        $$slots: { child: !0 }
      });
    });
  }
  return ce(n, v), ar(m);
}
lr(
  qs,
  {
    value: {},
    disabled: {},
    variant: {},
    shape: {},
    contentLayout: {},
    className: {},
    ariaLabel: {},
    style: {},
    children: {}
  },
  [],
  [],
  { mode: "open" }
);
var E1 = Ze('<table class="popover-table svelte-7juqqk"><thead class="svelte-7juqqk"><tr class="svelte-7juqqk"><th class="svelte-7juqqk"> </th><th class="svelte-7juqqk"> </th><th class="svelte-7juqqk"> </th></tr></thead><tbody class="svelte-7juqqk"><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr></tbody></table> <p class="popover-note svelte-7juqqk"> </p>', 1), $1 = Ze('<div class="radio-pair svelte-7juqqk"></div>'), k1 = Ze('<table class="popover-table svelte-7juqqk"><thead class="svelte-7juqqk"><tr class="svelte-7juqqk"><th class="svelte-7juqqk"> </th><th class="svelte-7juqqk"> </th></tr></thead><tbody class="svelte-7juqqk"><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr></tbody></table>'), A1 = Ze('<div class="radio-pair svelte-7juqqk"></div>'), S1 = Ze('<div class="setting-section svelte-7juqqk"><div class="setting-row svelte-7juqqk"><div class="setting-label-wrapper svelte-7juqqk"><span class="setting-label"> </span> <!></div> <!></div></div> <div class="setting-section svelte-7juqqk"><div class="setting-row svelte-7juqqk"><div class="setting-label-wrapper svelte-7juqqk"><span class="setting-label"> </span> <!></div> <!></div></div>', 1);
const C1 = {
  hash: "svelte-7juqqk",
  code: `.setting-label-wrapper.svelte-7juqqk {display:inline-flex;align-items:center;gap:4px;flex-wrap:wrap;flex-shrink:0;}.popover-table {border-collapse:collapse;font-size:1rem;th.svelte-7juqqk,\r
        td.svelte-7juqqk {padding:4px 8px;text-align:start;}th.svelte-7juqqk {font-weight:600;border-bottom:1px solid var(--border);}td.svelte-7juqqk {font-weight:normal;}}.popover-note.svelte-7juqqk {max-width:320px;margin:8px 0 0;color:var(--text-secondary);font-size:0.875rem;line-height:1.5;}.radio-group {display:flex;gap:4px;flex-wrap:wrap;button {font-size:0.875rem;padding:10px;min-height:50px;min-width:50px;font-weight:normal;}}.radio-pair.svelte-7juqqk {display:flex;gap:4px;}`
};
function Oh(n, e) {
  or(e, !0), Eo(n, C1);
  const t = () => as(ko, "$_", r), [r, i] = $o();
  let a = Me(e, "compressionPairs", 7), c = Me(e, "selectedCompression", 7), d = Me(e, "onCompressionChange", 7), h = Me(e, "videoCompressionPairs", 7), g = Me(e, "selectedVideoCompression", 7), b = Me(e, "onVideoCompressionChange", 7);
  var m = {
    get compressionPairs() {
      return a();
    },
    set compressionPairs(j) {
      a(j), Re();
    },
    get selectedCompression() {
      return c();
    },
    set selectedCompression(j) {
      c(j), Re();
    },
    get onCompressionChange() {
      return d();
    },
    set onCompressionChange(j) {
      d(j), Re();
    },
    get videoCompressionPairs() {
      return h();
    },
    set videoCompressionPairs(j) {
      h(j), Re();
    },
    get selectedVideoCompression() {
      return g();
    },
    set selectedVideoCompression(j) {
      g(j), Re();
    },
    get onVideoCompressionChange() {
      return b();
    },
    set onVideoCompressionChange(j) {
      b(j), Re();
    }
  }, v = S1(), T = at(v), A = R(T), E = R(A), L = R(E), U = R(L, !0);
  N(L);
  var P = se(L, 2);
  {
    let j = Ee(() => t()("settingsDialog.image_compression_settings_description"));
    Or(P, {
      side: "top",
      get ariaLabel() {
        return y(j);
      },
      children: (V, Y) => {
        var W = E1(), re = at(W), ue = R(re), be = R(ue), pe = R(be), Ie = R(pe, !0);
        N(pe);
        var $e = se(pe), Ce = R($e, !0);
        N($e);
        var Ve = se($e), Ge = R(Ve, !0);
        N(Ve), N(be), N(ue);
        var ke = se(ue), We = R(ke), bt = R(We), ge = R(bt, !0);
        N(bt);
        var it = se(bt), pn = R(it);
        N(it);
        var Qt = se(it), Hn = R(Qt);
        N(Qt), N(We);
        var nn = se(We), rn = R(nn), gn = R(rn, !0);
        N(rn);
        var ve = se(rn), Ue = R(ve);
        N(ve);
        var Ye = se(ve), lt = R(Ye);
        N(Ye), N(nn);
        var tt = se(nn), Je = R(tt), ft = R(Je, !0);
        N(Je);
        var Pe = se(Je), kt = R(Pe);
        N(Pe);
        var zt = se(Pe), Yt = R(zt);
        N(zt), N(tt), N(ke), N(re);
        var Nt = se(re, 2), sn = R(Nt, !0);
        N(Nt), Be(
          (Mt, An, Lt, It, Xt, Rt, At, ln, Sn, vn) => {
            fe(Ie, Mt), fe(Ce, An), fe(Ge, Lt), fe(ge, It), fe(pn, `${Us.high.maxWidthOrHeight}px`), fe(Hn, `${Xt ?? ""}%`), fe(gn, Rt), fe(Ue, `${Us.medium.maxWidthOrHeight}px`), fe(lt, `${At ?? ""}%`), fe(ft, ln), fe(kt, `${Us.low.maxWidthOrHeight}px`), fe(Yt, `${Sn ?? ""}%`), fe(sn, vn);
          },
          [
            () => t()("settingsDialog.info_header_setting"),
            () => t()("settingsDialog.info_header_pixels"),
            () => t()("settingsDialog.info_header_quality"),
            () => t()("settingsDialog.quality_high"),
            () => Math.round(Us.high.initialQuality * 100),
            () => t()("settingsDialog.quality_medium"),
            () => Math.round(Us.medium.initialQuality * 100),
            () => t()("settingsDialog.quality_low"),
            () => Math.round(Us.low.initialQuality * 100),
            () => t()("settingsDialog.image_short_edge_protection_note", {
              values: {
                aspectRatio: xa.aspectRatioThreshold,
                pixels: xa.minShortEdge,
                megapixels: xa.maxMegapixels
              }
            })
          ]
        ), ce(V, W);
      },
      $$slots: { default: !0 }
    });
  }
  N(E);
  var J = se(E, 2);
  {
    let j = Ee(() => t()("settingsDialog.image_quality_setting"));
    en(J, () => co, (V, Y) => {
      Y(V, {
        class: "setting-control radio-group",
        name: "compression",
        orientation: "horizontal",
        get value() {
          return c();
        },
        get "aria-label"() {
          return y(j);
        },
        get onValueChange() {
          return d();
        },
        children: (W, re) => {
          var ue = Pt(), be = at(ue);
          Mr(be, 17, a, Rr, (pe, Ie) => {
            var $e = $1();
            Mr($e, 21, () => y(Ie), Rr, (Ce, Ve) => {
              qs(Ce, {
                get value() {
                  return y(Ve).value;
                },
                variant: "default",
                shape: "rounded",
                get ariaLabel() {
                  return y(Ve).label;
                },
                children: (Ge, ke) => {
                  jt();
                  var We = $t();
                  Be(() => fe(We, y(Ve).label)), ce(Ge, We);
                },
                $$slots: { default: !0 }
              });
            }), N($e), ce(pe, $e);
          }), ce(W, ue);
        },
        $$slots: { default: !0 }
      });
    });
  }
  N(A), N(T);
  var ie = se(T, 2), te = R(ie), ee = R(te), F = R(ee), O = R(F, !0);
  N(F);
  var k = se(F, 2);
  {
    let j = Ee(() => t()("settingsDialog.video_compression_settings_description"));
    Or(k, {
      side: "top",
      get ariaLabel() {
        return y(j);
      },
      children: (V, Y) => {
        var W = k1(), re = R(W), ue = R(re), be = R(ue), pe = R(be, !0);
        N(be);
        var Ie = se(be), $e = R(Ie, !0);
        N(Ie), N(ue), N(re);
        var Ce = se(re), Ve = R(Ce), Ge = R(Ve), ke = R(Ge, !0);
        N(Ge);
        var We = se(Ge), bt = R(We);
        N(We), N(Ve);
        var ge = se(Ve), it = R(ge), pn = R(it, !0);
        N(it);
        var Qt = se(it), Hn = R(Qt);
        N(Qt), N(ge);
        var nn = se(ge), rn = R(nn), gn = R(rn, !0);
        N(rn);
        var ve = se(rn), Ue = R(ve);
        N(ve), N(nn), N(Ce), N(W), Be(
          (Ye, lt, tt, Je, ft) => {
            fe(pe, Ye), fe($e, lt), fe(ke, tt), fe(bt, `${_a.high.maxSize ?? ""}px`), fe(pn, Je), fe(Hn, `${_a.medium.maxSize ?? ""}px`), fe(gn, ft), fe(Ue, `${_a.low.maxSize ?? ""}px`);
          },
          [
            () => t()("settingsDialog.info_header_setting"),
            () => t()("settingsDialog.info_header_pixels"),
            () => t()("settingsDialog.quality_high"),
            () => t()("settingsDialog.quality_medium"),
            () => t()("settingsDialog.quality_low")
          ]
        ), ce(V, W);
      },
      $$slots: { default: !0 }
    });
  }
  N(ee);
  var $ = se(ee, 2);
  {
    let j = Ee(() => t()("settingsDialog.video_quality_setting"));
    en($, () => co, (V, Y) => {
      Y(V, {
        class: "setting-control radio-group",
        name: "videoCompression",
        orientation: "horizontal",
        get value() {
          return g();
        },
        get "aria-label"() {
          return y(j);
        },
        get onValueChange() {
          return b();
        },
        children: (W, re) => {
          var ue = Pt(), be = at(ue);
          Mr(be, 17, h, Rr, (pe, Ie) => {
            var $e = A1();
            Mr($e, 21, () => y(Ie), Rr, (Ce, Ve) => {
              qs(Ce, {
                get value() {
                  return y(Ve).value;
                },
                variant: "default",
                shape: "rounded",
                get ariaLabel() {
                  return y(Ve).label;
                },
                children: (Ge, ke) => {
                  jt();
                  var We = $t();
                  Be(() => fe(We, y(Ve).label)), ce(Ge, We);
                },
                $$slots: { default: !0 }
              });
            }), N($e), ce(pe, $e);
          }), ce(W, ue);
        },
        $$slots: { default: !0 }
      });
    });
  }
  N(te), N(ie), Be(
    (j, V) => {
      fe(U, j), fe(O, V);
    },
    [
      () => t()("settingsDialog.image_quality_setting"),
      () => t()("settingsDialog.video_quality_setting")
    ]
  ), ce(n, v);
  var S = ar(m);
  return i(), S;
}
lr(
  Oh,
  {
    compressionPairs: {},
    selectedCompression: {},
    onCompressionChange: {},
    videoCompressionPairs: {},
    selectedVideoCompression: {},
    onVideoCompressionChange: {}
  },
  [],
  [],
  { mode: "open" }
);
var I1 = Ze("<option> </option>"), T1 = Ze("<option> </option>"), L1 = Ze('<div class="url-clear-input-icon svg-icon svelte-odrb59" aria-hidden="true"></div>'), D1 = Ze('<span class="form-error svelte-odrb59" role="alert"> </span>'), O1 = Ze('<div class="destination-form svelte-odrb59"><label class="svelte-odrb59"><span> </span> <select class="svelte-odrb59"><option>custom</option><optgroup label="Blossom"></optgroup><optgroup label="NIP-96"></optgroup></select></label> <label class="svelte-odrb59"><span> </span> <select class="svelte-odrb59"><option>Blossom</option><option>NIP-96 legacy</option><option>Custom HTTP</option></select></label> <div class="url-field svelte-odrb59"><label for="upload-destination-url-input" class="svelte-odrb59"><span>URL</span></label> <div class="url-input-shell svelte-odrb59"><input id="upload-destination-url-input" class="upload-destination-url-input svelte-odrb59" inputmode="url"/> <!></div> <!></div> <div class="checkbox-group svelte-odrb59"><label class="checkbox-row svelte-odrb59"><input type="checkbox" class="svelte-odrb59"/> <span> </span></label> <label class="checkbox-row svelte-odrb59"><input type="checkbox" class="svelte-odrb59"/> <span> </span></label></div> <div class="form-actions svelte-odrb59"><!> <!></div></div>'), N1 = Ze('<div class="server-cog-icon svg-icon svelte-odrb59" aria-hidden="true"></div> <span class="btn-text"> </span>', 1), M1 = Ze('<span class="badge default-badge svelte-odrb59"> </span>'), R1 = Ze('<span class="badge muted svelte-odrb59"> </span>'), B1 = Ze('<button type="button" class="mime-toggle svelte-odrb59"> </button>'), U1 = Ze('<span class="arrow-up-icon svg-icon svelte-odrb59"></span>'), P1 = Ze('<span class="arrow-down-icon svg-icon svelte-odrb59"></span>'), z1 = Ze('<div class="blossom-test-popover svelte-odrb59"><p class="svelte-odrb59"> </p> <p class="svelte-odrb59"> </p></div>'), H1 = Ze("<div> </div>"), q1 = Ze('<div class="destination-row svelte-odrb59"><div class="destination-main svelte-odrb59"><div class="destination-content svelte-odrb59"><div class="destination-title svelte-odrb59"><span> </span> <!> <!></div> <div class="destination-meta svelte-odrb59"> </div> <div class="destination-meta mime-meta svelte-odrb59"><span> </span> <!></div></div> <div class="destination-order-actions svelte-odrb59"><!> <!></div></div> <div class="destination-actions svelte-odrb59"><!> <!> <!> <!> <!></div> <!></div> <!>', 1), j1 = Ze('<div class="bud03-popover svelte-odrb59"><p class="svelte-odrb59"> </p> <p class="svelte-odrb59"> </p> <p class="svelte-odrb59"> </p></div>'), F1 = Ze('<div class="test-result svelte-odrb59"> </div>'), Z1 = Ze('<div class="panel-actions svelte-odrb59"><!> <!> <!> <!></div> <!>', 1), V1 = Ze('<div class="upload-panel svelte-odrb59"><!> <!></div>'), G1 = Ze('<div class="setting-section upload-destination-section svelte-odrb59"><div class="setting-row"><div class="setting-label-group"><span class="setting-label"> </span> <span class="upload-summary svelte-odrb59"> </span></div> <div class="setting-control"><!></div></div> <!></div>');
const W1 = {
  hash: "svelte-odrb59",
  code: `.upload-destination-section.svelte-odrb59 {display:flex;flex-direction:column;gap:12px;.upload-destination-manage-btn {.svg-icon {width:26px;height:26px;}}}.server-cog-icon.svelte-odrb59 {mask-image:var(--ehagaki-icon-636c6f75645f75706c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.upload-summary.svelte-odrb59,
    .destination-meta.svelte-odrb59 {color:var(--text-light);font-size:0.875rem;}.mime-meta.svelte-odrb59 {display:flex;align-items:baseline;flex-wrap:wrap;gap:6px;overflow-wrap:anywhere;}.mime-toggle.svelte-odrb59 {border:none;background:transparent;color:var(--link);cursor:pointer;font:inherit;padding:0;text-decoration:underline;}.upload-panel.svelte-odrb59 {display:flex;flex-direction:column;gap:12px;}.destination-row.svelte-odrb59,
    .destination-form.svelte-odrb59 {border:1px solid var(--border);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px;}.destination-title.svelte-odrb59 {display:flex;align-items:center;flex-wrap:wrap;gap:6px;font-weight:600;}.destination-main.svelte-odrb59 {display:flex;align-items:flex-start;justify-content:space-between;gap:8px;flex-wrap:wrap;}.destination-content.svelte-odrb59 {min-width:0;display:flex;flex:1 1 220px;flex-direction:column;gap:4px;}.destination-order-actions.svelte-odrb59 {display:flex;flex-shrink:0;gap:4px;.destination-order-button {display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:0;}}.arrow-up-icon.svelte-odrb59 {mask-image:var(--ehagaki-icon-6172726f775f64726f705f75705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.arrow-down-icon.svelte-odrb59 {mask-image:var(--ehagaki-icon-6172726f775f64726f705f646f776e5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.badge.svelte-odrb59 {border:1px solid var(--border);border-radius:999px;padding:2px 7px;font-size:0.75rem;font-weight:400;}.badge.default-badge.svelte-odrb59 {background-color:var(--theme);border-color:var(--theme);color:white;font-weight:500;}.badge.muted.svelte-odrb59 {opacity:0.6;}.destination-actions.svelte-odrb59,
    .form-actions.svelte-odrb59,
    .panel-actions.svelte-odrb59 {display:flex;align-items:center;flex-wrap:wrap;gap:6px;}.test-result.svelte-odrb59 {font-size:0.875rem;color:var(--text-light);}.test-result.error.svelte-odrb59 {color:#c62828;}.form-error.svelte-odrb59 {color:#c62828;font-size:0.875rem;}.bud03-popover.svelte-odrb59 {display:flex;flex-direction:column;gap:8px;font-size:0.875rem;line-height:1.5;}.bud03-popover.svelte-odrb59 p:where(.svelte-odrb59) {margin:0;}.blossom-test-popover.svelte-odrb59 {display:flex;flex-direction:column;gap:8px;font-size:0.875rem;line-height:1.5;}.blossom-test-popover.svelte-odrb59 p:where(.svelte-odrb59) {margin:0;}label.svelte-odrb59 {display:flex;flex-direction:column;gap:4px;font-size:0.875rem;}.url-field.svelte-odrb59 {display:flex;flex-direction:column;gap:4px;font-size:0.875rem;}.url-input-shell.svelte-odrb59 {position:relative;display:flex;align-items:center;min-width:0;}.upload-destination-url-input.svelte-odrb59 {flex:1 1 auto;min-width:0;min-height:46px;padding:8px 47px 8px 10px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text);font:inherit;outline:none;}.upload-destination-url-input.svelte-odrb59:focus-visible {outline:2px solid var(--theme);outline-offset:-1px;}.ehagaki-app-root button.upload-destination-url-clear-button {position:absolute;inset-block:50%;inset-inline-end:2px;transform:translateY(-50%);display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;padding:0;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);z-index:1;}.ehagaki-app-root button.upload-destination-url-clear-button:hover:not(:disabled),
    .ehagaki-app-root button.upload-destination-url-clear-button:active:not(:disabled),
    .ehagaki-app-root button.upload-destination-url-clear-button:focus-visible,
    .ehagaki-app-root button.upload-destination-url-clear-button:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.upload-destination-url-clear-button:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.upload-destination-url-clear-button .svg-icon {--svg: currentColor;width:24px;height:24px;}.url-clear-input-icon.svelte-odrb59 {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.checkbox-group.svelte-odrb59 {display:flex;align-items:center;flex-wrap:wrap;gap:16px;}.checkbox-row.svelte-odrb59 {flex-direction:row;align-items:center;gap:8px;min-height:32px;}.checkbox-row.svelte-odrb59 input[type="checkbox"]:where(.svelte-odrb59) {width:24px;height:24px;min-height:24px;margin:0;padding:0;accent-color:var(--theme);}input.svelte-odrb59,
    select.svelte-odrb59 {width:100%;min-height:42px;padding:8px 10px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text);font:inherit;font-size:1rem;}input.svelte-odrb59:focus-visible,
    select.svelte-odrb59:focus-visible {outline:2px solid var(--theme);outline-offset:-1px;}`
};
function Nh(n, e) {
  or(e, !0), Eo(n, W1);
  const t = () => as(ko, "$_", r), [r, i] = $o(), a = (ve) => {
    var Ue = O1(), Ye = R(Ue), lt = R(Ye), tt = R(lt, !0);
    N(lt);
    var Je = se(lt, 2), ft = R(Je);
    ft.value = ft.__value = "custom";
    var Pe = se(ft);
    Mr(Pe, 21, () => F, Rr, (nt, Tt) => {
      var mt = I1(), on = R(mt, !0);
      N(mt);
      var qe = {};
      Be(() => {
        fe(on, y(Tt).name), qe !== (qe = y(Tt).id) && (mt.value = (mt.__value = y(Tt).id) ?? "");
      }), ce(nt, mt);
    }), N(Pe);
    var kt = se(Pe);
    Mr(kt, 21, () => O, Rr, (nt, Tt) => {
      var mt = T1(), on = R(mt, !0);
      N(mt);
      var qe = {};
      Be(() => {
        fe(on, y(Tt).name), qe !== (qe = y(Tt).id) && (mt.value = (mt.__value = y(Tt).id) ?? "");
      }), ce(nt, mt);
    }), N(kt), N(Je);
    var zt;
    cd(Je), N(Ye);
    var Yt = se(Ye, 2), Nt = R(Yt), sn = R(Nt, !0);
    N(Nt);
    var Mt = se(Nt, 2), An = R(Mt);
    An.value = An.__value = "blossom";
    var Lt = se(An);
    Lt.value = Lt.__value = "nip96";
    var It = se(Lt);
    It.value = It.__value = "custom-http", N(Mt), N(Yt);
    var Xt = se(Yt, 2), Rt = se(R(Xt), 2), At = R(Rt);
    ls(At), Up(At, (nt) => me(m, nt), () => y(m));
    var ln = se(At, 2);
    {
      var Sn = (nt) => {
        {
          let Tt = Ee(() => t()("clearInput") || "入力内容を消去");
          Bt(nt, {
            type: "button",
            className: "upload-destination-url-clear-button",
            variant: "default",
            shape: "square",
            contentLayout: "icon",
            get ariaLabel() {
              return y(Tt);
            },
            onClick: ue,
            get onmousedown() {
              return kc;
            },
            get ontouchstart() {
              return kc;
            },
            children: (mt, on) => {
              var qe = L1();
              ce(mt, qe);
            },
            $$slots: { default: !0 }
          });
        }
      }, vn = Ee(() => y(v).serverUrl.trim().length > 0);
      vt(ln, (nt) => {
        y(vn) && nt(Sn);
      });
    }
    N(Rt);
    var Xn = se(Rt, 2);
    {
      var dr = (nt) => {
        var Tt = D1(), mt = R(Tt, !0);
        N(Tt), Be(() => fe(mt, y(A))), ce(nt, Tt);
      };
      vt(Xn, (nt) => {
        y(A) && nt(dr);
      });
    }
    N(Xt);
    var qn = se(Xt, 2), Un = R(qn), Cn = R(Un);
    ls(Cn);
    var jn = se(Cn, 2), Fn = R(jn, !0);
    N(jn), N(Un);
    var Dt = se(Un, 2), cn = R(Dt);
    ls(cn);
    var Zn = se(cn, 2), Ke = R(Zn, !0);
    N(Zn), N(Dt), N(qn);
    var Ht = se(qn, 2), xn = R(Ht);
    {
      let nt = Ee(() => !y(v).serverUrl.trim());
      Bt(xn, {
        variant: "primary",
        shape: "rounded",
        onClick: be,
        get disabled() {
          return y(nt);
        },
        children: (Tt, mt) => {
          jt();
          var on = $t();
          Be((qe) => fe(on, qe), [() => t()("settingsDialog.uploadDestinationSave") || "保存"]), ce(Tt, on);
        },
        $$slots: { default: !0 }
      });
    }
    var st = se(xn, 2);
    Bt(st, {
      variant: "default",
      shape: "rounded",
      onClick: Y,
      children: (nt, Tt) => {
        jt();
        var mt = $t();
        Be((on) => fe(mt, on), [() => t()("postComponent.cancel") || "キャンセル"]), ce(nt, mt);
      },
      $$slots: { default: !0 }
    }), N(Ht), N(Ue), Be(
      (nt, Tt, mt, on) => {
        fe(tt, nt), zt !== (zt = y(v).presetId) && (Je.value = (Je.__value = y(v).presetId) ?? "", dd(Je, y(v).presetId)), fe(sn, Tt), fe(Fn, mt), fe(Ke, on);
      },
      [
        () => t()("settingsDialog.uploadDestinationPreset") || "プリセット",
        () => t()("settingsDialog.uploadDestinationProtocol") || "Protocol",
        () => t()("settingsDialog.uploadDestinationEnabled") || "有効",
        () => t()("settingsDialog.uploadDestinationDefault") || "既定"
      ]
    ), xr("change", Je, (nt) => re(nt.currentTarget.value)), xr("change", Mt, () => me(A, null)), Pp(Mt, () => y(v).protocol, (nt) => y(v).protocol = nt), xr("input", At, () => me(A, null)), lg(At, () => y(v).serverUrl, (nt) => y(v).serverUrl = nt), Dc(Cn, () => y(v).enabled, (nt) => y(v).enabled = nt), Dc(cn, () => y(v).isDefault, (nt) => y(v).isDefault = nt), ce(ve, Ue);
  };
  let c = Me(e, "rxNostr", 7, null);
  const d = {
    id: "",
    protocol: "blossom",
    serverUrl: "",
    presetId: "custom",
    enabled: !0,
    isDefault: !0
  };
  let h = Ut(!1), g = Ut(!1), b = Ut(null), m = Ut(null), v = Ut(yr({ ...d })), T = Ut(null), A = Ut(null), E = Ut(yr({})), L = Ee(() => sr.value), U = Ut(null), P = Ee(() => is.value.isAuthenticated && is.value.pubkey || null), J = Ee(() => !!(c() && y(P)));
  const ie = new Map(Ea.map((ve) => [ve.id, ve])), te = [
    "blossom-band",
    "cdn-nostrcheck-me",
    "nostr-download",
    "blossom-primal-net"
  ], ee = [
    "nostr-build",
    "nostrcheck-me",
    "share-yabu-me",
    "nostpic-com",
    "files-sovbit-host"
  ], F = te.map((ve) => ie.get(ve)), O = ee.map((ve) => ie.get(ve));
  ld(() => {
    me(U, y(P), !0), sr.load(y(U));
  }), Nn(() => {
    y(U) !== y(P) && (me(U, y(P), !0), sr.load(y(U)));
  });
  function k(ve) {
    if (!ve) return t()("settingsDialog.uploadDestinationUnknown") || "未確認";
    const Ue = ["B", "KB", "MB", "GB"];
    let Ye = ve, lt = 0;
    for (; Ye >= 1024 && lt < Ue.length - 1; )
      Ye /= 1024, lt += 1;
    return `${Ye.toFixed(Ye >= 10 || lt === 0 ? 0 : 1)} ${Ue[lt]}`;
  }
  function $(ve) {
    const Ue = ve.capabilities.supportedMimeTypes;
    return Ue.length ? y(E)[ve.id] || Ue.length <= 3 ? Ue.join(", ") : `${Ue.slice(0, 3).join(", ")} +${Ue.length - 3}` : t()("settingsDialog.uploadDestinationUnknown") || "未確認";
  }
  function S(ve) {
    return ve.capabilities.supportedMimeTypes.length > 3;
  }
  function j(ve) {
    me(
      E,
      {
        ...y(E),
        [ve]: !y(E)[ve]
      },
      !0
    );
  }
  function V() {
    me(v, { ...d }, !0), me(A, null), me(g, !0), me(b, null), me(h, !0);
  }
  function Y() {
    me(g, !1), me(b, null), me(A, null);
  }
  function W(ve) {
    if (y(b) === ve.id) {
      Y();
      return;
    }
    me(
      v,
      {
        id: ve.id,
        protocol: ve.protocol,
        serverUrl: ve.serverUrl,
        presetId: ve.presetId ?? "custom",
        enabled: ve.enabled,
        isDefault: ve.isDefault
      },
      !0
    ), me(A, null), me(g, !0), me(b, ve.id, !0), me(h, !0);
  }
  function re(ve) {
    if (y(v).presetId = ve, me(A, null), ve === "custom") {
      y(v).serverUrl = "";
      return;
    }
    const Ue = Ea.find((Ye) => Ye.id === ve);
    Ue && (y(v).protocol = Ue.protocol, y(v).serverUrl = Ue.serverUrl);
  }
  function ue() {
    y(v).serverUrl = "", y(v).presetId = "custom", me(A, null), setTimeout(
      () => {
        y(m)?.focus({ preventScroll: !0 });
      },
      0
    );
  }
  async function be() {
    const ve = Date.now(), Ue = Ea.find((Mt) => Mt.id === y(v).presetId), Ye = y(L).destinations.find((Mt) => Mt.id === y(v).id), lt = y(v).serverUrl || Ue?.serverUrl || "", tt = y(v).protocol;
    let Je = zp(lt);
    if (tt === "nip96")
      try {
        Je = Hp(lt).url;
      } catch {
        me(A, t()("settingsDialog.uploadDestinationInvalidNip96Url") || "有効な絶対 HTTP(S) URL を入力してください", !0);
        return;
      }
    me(A, null);
    const ft = qp({ protocol: tt, presetId: y(v).presetId, serverUrl: Je }), Pe = tt === "nip96" ? ft?.resolvedUploadUrl ?? null : null, kt = jp({
      serverUrl: Je,
      resolvedUploadUrl: Pe,
      fallbackName: Ue?.name ?? Ye?.name ?? "Custom NIP-96",
      protocol: tt,
      presetId: y(v).presetId
    }), zt = Ue && !Ye ? {
      ...$c({
        preset: Ue,
        pubkeyHex: y(P),
        isDefault: y(v).isDefault || y(L).destinations.length === 0,
        now: ve
      }),
      name: kt,
      serverUrl: Je,
      enabled: y(v).enabled
    } : Ye ?? $c({
      preset: Ue ?? {
        id: "custom",
        name: kt,
        protocol: y(v).protocol,
        serverUrl: y(v).serverUrl,
        capabilities: Fp
      },
      pubkeyHex: y(P),
      isDefault: y(v).isDefault || y(L).destinations.length === 0,
      now: ve
    }), {
      resolvedUploadUrl: Yt,
      ...Nt
    } = zt, sn = {
      ...Nt,
      name: kt,
      protocol: tt,
      serverUrl: Je,
      presetId: y(v).presetId,
      enabled: y(v).enabled,
      isDefault: y(v).isDefault,
      updatedAt: ve,
      ...Pe ? { resolvedUploadUrl: Pe } : {}
    };
    await sr.save(sn), me(g, !1), me(b, null);
  }
  async function pe(ve) {
    me(T, ve.id, !0);
    try {
      await sr.test(ve);
    } finally {
      me(T, null);
    }
  }
  async function Ie(ve) {
    y(b) === ve.id && (me(g, !1), me(b, null)), await sr.delete(ve.id, y(P));
  }
  async function $e() {
    !c() || !y(P) || await sr.fetchBud03(c(), y(P));
  }
  async function Ce() {
    !c() || !y(P) || await sr.publishBud03(c(), y(P));
  }
  var Ve = {
    get rxNostr() {
      return c();
    },
    set rxNostr(ve = null) {
      c(ve), Re();
    }
  }, Ge = G1(), ke = R(Ge), We = R(ke), bt = R(We), ge = R(bt, !0);
  N(bt);
  var it = se(bt, 2), pn = R(it, !0);
  N(it), N(We);
  var Qt = se(We, 2), Hn = R(Qt);
  Bt(Hn, {
    variant: "default",
    shape: "rounded",
    contentLayout: "iconText",
    className: "upload-destination-manage-btn",
    onClick: () => me(h, !y(h)),
    children: (ve, Ue) => {
      var Ye = N1(), lt = se(at(Ye), 2), tt = R(lt, !0);
      N(lt), Be((Je) => fe(tt, Je), [
        () => y(h) ? t()("settingsDialog.uploadDestinationClose") || "閉じる" : t()("settingsDialog.uploadDestinationManage") || "管理"
      ]), ce(ve, Ye);
    },
    $$slots: { default: !0 }
  }), N(Qt), N(ke);
  var nn = se(ke, 2);
  {
    var rn = (ve) => {
      var Ue = V1(), Ye = R(Ue);
      Mr(Ye, 17, () => y(L).destinations, Rr, (ft, Pe) => {
        var kt = q1(), zt = at(kt), Yt = R(zt), Nt = R(Yt), sn = R(Nt), Mt = R(sn), An = R(Mt, !0);
        N(Mt);
        var Lt = se(Mt, 2);
        {
          var It = (qe) => {
            var ot = M1(), St = R(ot, !0);
            N(ot), Be((de) => fe(St, de), [
              () => t()("settingsDialog.uploadDestinationDefault") || "既定"
            ]), ce(qe, ot);
          };
          vt(Lt, (qe) => {
            y(Pe).isDefault && qe(It);
          });
        }
        var Xt = se(Lt, 2);
        {
          var Rt = (qe) => {
            var ot = R1(), St = R(ot, !0);
            N(ot), Be((de) => fe(St, de), [
              () => t()("settingsDialog.uploadDestinationDisabled") || "無効"
            ]), ce(qe, ot);
          };
          vt(Xt, (qe) => {
            y(Pe).enabled || qe(Rt);
          });
        }
        N(sn);
        var At = se(sn, 2), ln = R(At);
        N(At);
        var Sn = se(At, 2), vn = R(Sn), Xn = R(vn, !0);
        N(vn);
        var dr = se(vn, 2);
        {
          var qn = (qe) => {
            var ot = B1(), St = R(ot, !0);
            N(ot), Be((de) => fe(St, de), [
              () => y(E)[y(Pe).id] ? t()("settingsDialog.uploadDestinationMimeCollapse") || "折りたたむ" : t()("settingsDialog.uploadDestinationMimeExpand") || "すべて表示"
            ]), xr("click", ot, () => j(y(Pe).id)), ce(qe, ot);
          }, Un = Ee(() => S(y(Pe)));
          vt(dr, (qe) => {
            y(Un) && qe(qn);
          });
        }
        N(Sn), N(Nt);
        var Cn = se(Nt, 2), jn = R(Cn);
        {
          let qe = Ee(() => t()("settingsDialog.uploadDestinationMoveUp") || "Up"), ot = Ee(() => y(L).destinations[0]?.id === y(Pe).id);
          Bt(jn, {
            variant: "default",
            shape: "rounded",
            className: "destination-order-button",
            get ariaLabel() {
              return y(qe);
            },
            onClick: () => sr.move(y(Pe).id, "up", y(P)),
            get disabled() {
              return y(ot);
            },
            children: (St, de) => {
              var Ot = U1();
              ce(St, Ot);
            },
            $$slots: { default: !0 }
          });
        }
        var Fn = se(jn, 2);
        {
          let qe = Ee(() => t()("settingsDialog.uploadDestinationMoveDown") || "Down"), ot = Ee(() => y(L).destinations[y(L).destinations.length - 1]?.id === y(Pe).id);
          Bt(Fn, {
            variant: "default",
            shape: "rounded",
            className: "destination-order-button",
            get ariaLabel() {
              return y(qe);
            },
            onClick: () => sr.move(y(Pe).id, "down", y(P)),
            get disabled() {
              return y(ot);
            },
            children: (St, de) => {
              var Ot = P1();
              ce(St, Ot);
            },
            $$slots: { default: !0 }
          });
        }
        N(Cn), N(Yt);
        var Dt = se(Yt, 2), cn = R(Dt);
        Bt(cn, {
          variant: "default",
          shape: "rounded",
          onClick: () => sr.setDefault(y(Pe).id, y(P)),
          get disabled() {
            return y(Pe).isDefault;
          },
          children: (qe, ot) => {
            jt();
            var St = $t();
            Be((de) => fe(St, de), [
              () => t()("settingsDialog.uploadDestinationSetDefault") || "既定"
            ]), ce(qe, St);
          },
          $$slots: { default: !0 }
        });
        var Zn = se(cn, 2);
        Bt(Zn, {
          variant: "default",
          shape: "rounded",
          onClick: () => W(y(Pe)),
          children: (qe, ot) => {
            jt();
            var St = $t();
            Be((de) => fe(St, de), [
              () => y(g) && y(b) === y(Pe).id ? t()("settingsDialog.uploadDestinationClose") || "閉じる" : t()("settingsDialog.uploadDestinationEdit") || "編集"
            ]), ce(qe, St);
          },
          $$slots: { default: !0 }
        });
        var Ke = se(Zn, 2);
        {
          let qe = Ee(() => y(T) === y(Pe).id);
          Bt(Ke, {
            variant: "default",
            shape: "rounded",
            onClick: () => pe(y(Pe)),
            get disabled() {
              return y(qe);
            },
            children: (ot, St) => {
              jt();
              var de = $t();
              Be((Ot) => fe(de, Ot), [
                () => y(T) === y(Pe).id ? t()("settingsDialog.uploadDestinationTesting") || "確認中" : t()("settingsDialog.uploadDestinationTest") || "接続テスト"
              ]), ce(ot, de);
            },
            $$slots: { default: !0 }
          });
        }
        var Ht = se(Ke, 2);
        {
          let qe = Ee(() => y(L).destinations.length <= 1);
          Bt(Ht, {
            variant: "default",
            shape: "rounded",
            onClick: () => Ie(y(Pe)),
            get disabled() {
              return y(qe);
            },
            children: (ot, St) => {
              jt();
              var de = $t();
              Be((Ot) => fe(de, Ot), [() => t()("settingsDialog.uploadDestinationDelete") || "削除"]), ce(ot, de);
            },
            $$slots: { default: !0 }
          });
        }
        var xn = se(Ht, 2);
        {
          var st = (qe) => {
            {
              let ot = Ee(() => t()("settingsDialog.uploadDestinationBlossomTestInfoLabel") || "Blossom 接続テストの説明");
              Or(qe, {
                side: "top",
                sideOffset: 4,
                get ariaLabel() {
                  return y(ot);
                },
                children: (St, de) => {
                  var Ot = z1(), Cr = R(Ot), ei = R(Cr, !0);
                  N(Cr);
                  var ks = se(Cr, 2), As = R(ks, !0);
                  N(ks), N(Ot), Be(
                    (ti, Ss) => {
                      fe(ei, ti), fe(As, Ss);
                    },
                    [
                      () => t()("settingsDialog.uploadDestinationBlossomTestInfoNoUpload") || "このテストでは実際のファイルをアップロードせず、HEAD /upload でアップロード可否を確認します。",
                      () => t()("settingsDialog.uploadDestinationBlossomTestInfoAuthorization") || "Blossom の仕様上、確認に必要な署名で upload 権限が要求される場合があります。"
                    ]
                  ), ce(St, Ot);
                },
                $$slots: { default: !0 }
              });
            }
          };
          vt(xn, (qe) => {
            y(Pe).protocol === "blossom" && qe(st);
          });
        }
        N(Dt);
        var nt = se(Dt, 2);
        {
          var Tt = (qe) => {
            var ot = H1();
            let St;
            var de = R(ot, !0);
            N(ot), Be(
              (Ot) => {
                St = Ha(ot, 1, "test-result svelte-odrb59", null, St, {
                  error: !y(L).testResults[y(Pe).id].success
                }), fe(de, Ot);
              },
              [
                () => y(L).testResults[y(Pe).id].message || (y(L).testResults[y(Pe).id].success ? t()("settingsDialog.uploadDestinationTestSuccess") || "接続テストに成功しました" : "")
              ]
            ), ce(qe, ot);
          };
          vt(nt, (qe) => {
            (y(L).testResults[y(Pe).id]?.message || y(L).testResults[y(Pe).id]?.success) && qe(Tt);
          });
        }
        N(zt);
        var mt = se(zt, 2);
        {
          var on = (qe) => {
            a(qe);
          };
          vt(mt, (qe) => {
            y(g) && y(b) === y(Pe).id && qe(on);
          });
        }
        Be(
          (qe, ot) => {
            fe(An, y(Pe).name), fe(ln, `${y(Pe).protocol ?? ""} / ${qe ?? ""}`), fe(Xn, ot);
          },
          [
            () => k(y(Pe).capabilities.maxUploadSize),
            () => $(y(Pe))
          ]
        ), ce(ft, kt);
      });
      var lt = se(Ye, 2);
      {
        var tt = (ft) => {
          a(ft);
        }, Je = (ft) => {
          var Pe = Z1(), kt = at(Pe), zt = R(kt);
          Bt(zt, {
            variant: "default",
            shape: "rounded",
            onClick: V,
            children: (Lt, It) => {
              jt();
              var Xt = $t();
              Be((Rt) => fe(Xt, Rt), [() => t()("settingsDialog.uploadDestinationAdd") || "追加"]), ce(Lt, Xt);
            },
            $$slots: { default: !0 }
          });
          var Yt = se(zt, 2);
          {
            let Lt = Ee(() => !y(J) || y(L).bud03Fetching);
            Bt(Yt, {
              variant: "default",
              shape: "rounded",
              onClick: $e,
              get disabled() {
                return y(Lt);
              },
              children: (It, Xt) => {
                jt();
                var Rt = $t();
                Be((At) => fe(Rt, At), [
                  () => y(L).bud03Fetching ? t()("settingsDialog.uploadDestinationBud03Fetching") || "BUD-03 取得中" : t()("settingsDialog.uploadDestinationBud03Fetch") || "BUD-03 から取得"
                ]), ce(It, Rt);
              },
              $$slots: { default: !0 }
            });
          }
          var Nt = se(Yt, 2);
          {
            let Lt = Ee(() => !y(J) || y(L).bud03Publishing || !y(L).destinations.some((It) => It.protocol === "blossom" && It.enabled));
            Bt(Nt, {
              variant: "default",
              shape: "rounded",
              onClick: Ce,
              get disabled() {
                return y(Lt);
              },
              children: (It, Xt) => {
                jt();
                var Rt = $t();
                Be((At) => fe(Rt, At), [
                  () => y(L).bud03Publishing ? t()("settingsDialog.uploadDestinationBud03Publishing") || "BUD-03 publish 中" : t()("settingsDialog.uploadDestinationBud03Publish") || "BUD-03 へ publish"
                ]), ce(It, Rt);
              },
              $$slots: { default: !0 }
            });
          }
          var sn = se(Nt, 2);
          {
            let Lt = Ee(() => t()("settingsDialog.uploadDestinationBud03InfoLabel") || "BUD-03 の説明");
            Or(sn, {
              side: "top",
              get ariaLabel() {
                return y(Lt);
              },
              children: (It, Xt) => {
                var Rt = j1(), At = R(Rt), ln = R(At, !0);
                N(At);
                var Sn = se(At, 2), vn = R(Sn, !0);
                N(Sn);
                var Xn = se(Sn, 2), dr = R(Xn, !0);
                N(Xn), N(Rt), Be(
                  (qn, Un, Cn) => {
                    fe(ln, qn), fe(vn, Un), fe(dr, Cn);
                  },
                  [
                    () => t()("settingsDialog.uploadDestinationBud03InfoScope") || "BUD-03 は Blossom のアップロード先だけを kind 10063 の server tag として保存します。NIP-96 と Custom HTTP は publish 対象外です。",
                    () => t()("settingsDialog.uploadDestinationBud03InfoOrder") || "publish 時は有効な Blossom アップロード先をこの一覧の順番で保存し、先頭のアップロード先が優先されます。",
                    () => t()("settingsDialog.uploadDestinationBud03InfoFetch") || "BUD-03 から取得すると、Blossom のアップロード先だけを取得結果で置き換えます。"
                  ]
                ), ce(It, Rt);
              },
              $$slots: { default: !0 }
            });
          }
          N(kt);
          var Mt = se(kt, 2);
          {
            var An = (Lt) => {
              var It = F1(), Xt = R(It, !0);
              N(It), Be(() => fe(Xt, y(L).bud03Status)), ce(Lt, It);
            };
            vt(Mt, (Lt) => {
              y(L).bud03Status && Lt(An);
            });
          }
          ce(ft, Pe);
        };
        vt(lt, (ft) => {
          y(g) && !y(b) ? ft(tt) : y(g) || ft(Je, 1);
        });
      }
      N(Ue), ce(ve, Ue);
    };
    vt(nn, (ve) => {
      y(h) && ve(rn);
    });
  }
  N(Ge), Be(
    (ve, Ue) => {
      fe(ge, ve), fe(pn, Ue);
    },
    [
      () => t()("settingsDialog.upload_destination") || "アップロード先",
      () => y(L).defaultDestination?.name || t()("settingsDialog.uploadDestinationNone") || "未設定"
    ]
  ), ce(n, Ge);
  var gn = ar(Ve);
  return i(), gn;
}
ud(["change", "input", "click"]);
lr(Nh, { rxNostr: {} }, [], [], { mode: "open" });
var K1 = Ze('<div class="xmark-icon svg-icon svelte-1ud3sov" aria-hidden="true"></div>'), Q1 = Ze('<div class="help-icon svg-icon svelte-1ud3sov" aria-hidden="true"></div>'), Y1 = Ze('<div class="github-icon svg-icon svelte-1ud3sov" aria-hidden="true"></div>'), X1 = Ze('<div class="rotate-right-icon svg-icon svelte-1ud3sov" aria-hidden="true"></div> <span class="btn-text svelte-1ud3sov"> </span>', 1), J1 = Ze('<div class="setting-section sw-update-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><span class="setting-label sw-update-label svelte-1ud3sov"><!></span> <div class="setting-control svelte-1ud3sov"><!></div></div></div>'), em = Ze('<div class="lang-icon-btn svg-icon svelte-1ud3sov" aria-hidden="true"></div> <span class="btn-text svelte-1ud3sov"> </span>', 1), tm = Ze("<!> <!> <!>", 1), nm = Ze('<span class="form-error svelte-1ud3sov" role="alert"> </span>'), rm = Ze('<span class="form-error svelte-1ud3sov" role="alert"> </span>'), sm = Ze('<div class="setting-section color-settings-section svelte-1ud3sov"><span class="setting-label color-settings-heading svelte-1ud3sov"> </span> <div class="color-setting-row svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><label class="setting-label svelte-1ud3sov" for="accent-color-input"> </label> <span class="setting-description svelte-1ud3sov"> </span></div> <div class="color-setting-controls svelte-1ud3sov"><input type="color" class="svelte-1ud3sov"/> <input id="accent-color-input" class="color-hex-input svelte-1ud3sov" type="text" inputmode="text" autocomplete="off"/></div></div> <!> <div class="color-setting-row svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><label class="setting-label svelte-1ud3sov" for="base-color-input"> </label> <span class="setting-description svelte-1ud3sov"> </span></div> <div class="color-setting-controls svelte-1ud3sov"><input type="color" class="svelte-1ud3sov"/> <input id="base-color-input" class="color-hex-input svelte-1ud3sov" type="text" inputmode="text" autocomplete="off" placeholder="#RRGGBB"/></div></div> <!> <!></div>'), im = Ze('<option class="svelte-1ud3sov"> </option>'), om = Ze('<span class="form-error svelte-1ud3sov" role="alert"> </span>'), am = Ze('<div class="external-nostr-client-custom-url svelte-1ud3sov"><label for="external-nostr-client-custom-url-input" class="setting-label svelte-1ud3sov"> </label> <span id="external-nostr-client-custom-url-description" class="setting-description svelte-1ud3sov"> </span> <input id="external-nostr-client-custom-url-input" type="url" inputmode="url" aria-describedby="external-nostr-client-custom-url-description" class="svelte-1ud3sov"/> <!></div>'), lm = Ze('<div class="settings-header svelte-1ud3sov"><div class="first-row svelte-1ud3sov"><div class="site-title svelte-1ud3sov"><span class="site-name svelte-1ud3sov">eHagaki</span> <span class="cache-version svelte-1ud3sov"> </span></div> <div class="author-info svelte-1ud3sov"><span class="svelte-1ud3sov"> </span><a href="https://lokuyow.github.io/" target="_blank" rel="noopener noreferrer" class="svelte-1ud3sov"> </a></div></div> <div class="second-row svelte-1ud3sov"><!> <!> <div class="svelte-1ud3sov"><div class="zap-view-btn-group svelte-1ud3sov"><button class="zap-btn svelte-1ud3sov" data-npub="npub1a3pvwe2p3v7mnjz6hle63r628wl9w567aw7u23fzqs062v5vqcqqu3sgh3" data-note-id="naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30" data-relays="wss://relay.damus.io,wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me">Support</button> <span class="divider svelte-1ud3sov"></span> <button class="view-btn svelte-1ud3sov" data-title="Thanks for the Support!" data-nzv-id="naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30" data-zap-color-mode="true" data-relay-urls="wss://relay.damus.io,wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me">View</button></div></div></div></div> <div class="modal-body svelte-1ud3sov"><!> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><span class="setting-label svelte-1ud3sov">Language/言語</span> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <!> <!> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><span id="theme-mode-label" class="setting-label svelte-1ud3sov"> </span> <!></div></div> <!> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><span id="media-free-placement-label" class="setting-label svelte-1ud3sov"> </span> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="hide-mascot-flavor-group svelte-1ud3sov"><div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><span id="hide-mascot-label" class="setting-label svelte-1ud3sov"> </span> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><span id="hide-flavor-text-label" class="setting-label svelte-1ud3sov"> </span> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div></div> <div class="notification-group svelte-1ud3sov"><div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><span id="quote-notification-label" class="setting-label svelte-1ud3sov"> </span> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><span id="reply-notification-label" class="setting-label svelte-1ud3sov"> </span> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><span id="client-tag-label" class="setting-label svelte-1ud3sov"> </span> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><span id="external-nostr-client-label" class="setting-label svelte-1ud3sov"> </span> <!></div></div> <select class="setting-control external-nostr-client-select svelte-1ud3sov" id="external-nostr-client-select" aria-labelledby="external-nostr-client-label"></select></div> <!></div> <!></div>', 1);
const cm = {
  hash: "svelte-1ud3sov",
  code: `
    /* SettingsDialog固有: paddingなしのdialog-content */.settings-dialog .dialog-content {padding:0;}.xmark-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.settings-header.svelte-1ud3sov {display:flex;flex-direction:column;align-items:center;justify-content:space-between;font-weight:bold;font-size:1.3rem;width:100%;padding:8px 12px;gap:2px;border-bottom:1px solid var(--border-hr);}.first-row.svelte-1ud3sov,
    .second-row.svelte-1ud3sov {display:flex;align-items:center;}.first-row.svelte-1ud3sov {justify-content:space-between;width:100%;gap:10px;}.second-row.svelte-1ud3sov {justify-content:flex-end;width:100%;gap:4px;}.site-title.svelte-1ud3sov {display:flex;align-items:baseline;gap:8px;.site-name:where(.svelte-1ud3sov) {font-size:1.5rem;font-weight:bold;letter-spacing:0.5px;}.cache-version:where(.svelte-1ud3sov) {font-size:1rem;color:var(--text-light);}}.github-link-btn.circle,
    .help-btn.circle {width:44px;height:44px;min-width:44px;min-height:44px;--btn-bg: var(--dialog-bg);}.github-link-btn.circle {.github-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-6769746875622d6d61726b2e737667);width:26px;height:26px;}}.help-btn.circle {.help-icon {mask-image:var(--ehagaki-icon-68656c705f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:30px;height:30px;}}.zap-view-btn-group.svelte-1ud3sov {display:inline-flex;height:44px;min-height:44px;.zap-btn:where(.svelte-1ud3sov),
        .view-btn:where(.svelte-1ud3sov) {min-width:70px;min-height:44px;height:44px;background:var(--btn-bg);}.zap-btn:where(.svelte-1ud3sov) {border-radius:6px 0 0 6px;border-right-color:transparent;padding:0 10px 0 13px;}.divider:where(.svelte-1ud3sov) {width:1px;background-color:var(--border);}.view-btn:where(.svelte-1ud3sov) {border-radius:0 6px 6px 0;border-left-color:transparent;padding:0 14px 0 12px;}}.author-info.svelte-1ud3sov {display:flex;align-items:center;font-size:0.9375rem;color:var(--text-light);gap:4px;}.author-info.svelte-1ud3sov a:where(.svelte-1ud3sov) {color:var(--text-light);text-decoration:underline;}.modal-body.svelte-1ud3sov {padding:16px;display:flex;flex-direction:column;gap:20px;width:100%;overflow-y:auto;}.lang-icon-btn.svelte-1ud3sov {mask-image:var(--ehagaki-icon-7472616e736c6174655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.setting-row-with-note.svelte-1ud3sov {align-items:flex-start;}.setting-label-group.svelte-1ud3sov,
    .hide-mascot-flavor-group.svelte-1ud3sov,
    .notification-group.svelte-1ud3sov {display:flex;flex-direction:column;}.setting-label-group.svelte-1ud3sov {gap:4px;min-width:0;margin-block:auto;}.external-nostr-client-select.svelte-1ud3sov {min-width:160px;min-height:44px;padding:8px 32px 8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.external-nostr-client-custom-url.svelte-1ud3sov {display:flex;flex-direction:column;gap:6px;margin-top:12px;}.external-nostr-client-custom-url.svelte-1ud3sov input:where(.svelte-1ud3sov) {width:100%;min-height:44px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.external-nostr-client-custom-url.svelte-1ud3sov input[aria-invalid="true"]:where(.svelte-1ud3sov) {border-color:var(--danger);}.setting-description.svelte-1ud3sov {color:var(--text-muted);font-size:0.875rem;line-height:1.4;}.form-error.svelte-1ud3sov {color:var(--danger);font-size:0.875rem;line-height:1.4;}.setting-label-row.svelte-1ud3sov {display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;}.rotate-right-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-726566726573685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.bui-switch {position:relative;display:inline-block;width:90px;height:44px;--btn-bg: var(--toggle-bg);background-color:var(--btn-bg);opacity:0.2;border-radius:50px;border:none;padding:0;cursor:pointer;transition:opacity 0.2s;flex-shrink:0;

        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {opacity:0.15;background:var(--btn-bg);transition:none;}
        }}button.bui-switch[data-state="checked"] {opacity:1;

        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {opacity:0.9;}
        }}.bui-switch[data-disabled] {cursor:not-allowed;opacity:0.5;}.bui-switch-thumb {position:absolute;display:block;height:38px;width:38px;left:3px;bottom:3px;background-color:var(--toggle-circle);translate:0 0;transition:translate 0.2s cubic-bezier(0, 1, 0.5, 1);border-radius:50%;}.bui-switch[data-state="checked"] .bui-switch-thumb {translate:46px 0;}

    @media (prefers-reduced-motion: reduce) {.bui-switch {transition:none;}.bui-switch-thumb {transition:none;}
    }.sw-update-section.svelte-1ud3sov {border-radius:8px;background:color-mix(in srgb, var(--theme) 5%, transparent);}.sw-update-label.svelte-1ud3sov {color:var(--theme);font-weight:600;}.sw-update-btn.primary {height:54px;width:auto;padding:12px 10px 12px 8px;flex-shrink:0;}.sw-update-btn:disabled {opacity:0.6;}.theme-mode-group {display:flex;gap:4px;flex-wrap:nowrap;button {min-width:74px;min-height:50px;padding:8px 10px;font-size:0.875rem;font-weight:normal;}}.color-settings-section.svelte-1ud3sov {gap:10px;}.color-settings-heading.svelte-1ud3sov {margin-bottom:2px;}.color-setting-row.svelte-1ud3sov,
    .color-setting-controls.svelte-1ud3sov {display:flex;gap:10px;}.color-setting-row.svelte-1ud3sov {align-items:center;justify-content:space-between;}.color-setting-controls.svelte-1ud3sov {align-items:center;flex-shrink:0;}.color-setting-controls.svelte-1ud3sov input[type="color"]:where(.svelte-1ud3sov) {width:44px;height:44px;padding:2px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);cursor:pointer;}.color-hex-input.svelte-1ud3sov {width:104px;min-height:44px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.color-hex-input[aria-invalid="true"].svelte-1ud3sov {border-color:var(--danger);}.reset-theme-colors-btn.rounded {align-self:flex-end;min-height:44px;}

    @media (max-width: 430px) {.color-setting-row.svelte-1ud3sov {align-items:flex-start;flex-direction:column;}.color-setting-controls.svelte-1ud3sov {align-self:flex-end;}
    }`
};
function dm(n, e) {
  or(e, !0), Eo(n, cm);
  const t = () => as(ko, "$_", d), r = () => as(rg, "$swUpdateStatus", d), i = () => as(ng, "$dbUpgradeBlocked", d), a = () => as(Wp, "$locale", d), c = () => as(Xp, "$swNeedRefresh", d), [d, h] = $o();
  let g = Me(e, "show", 15, !1), b = Me(e, "onClose", 7), m = Me(e, "onRefreshRelaysAndProfile", 7, () => {
  }), v = Me(e, "onOpenWelcomeDialog", 7, void 0), T = Me(e, "rxNostr", 7, null);
  function A() {
    g(!1), b()?.();
  }
  Zp(() => g(), A, !0);
  let E = Ee(() => Ic(t())), L = Ee(() => Ic(t())), U = Ee(() => Cc(y(E), 2)), P = Ee(() => Cc(y(L), 2)), J = Ut(yr(rt.clientTagEnabled)), ie = Ut(yr(rt.externalNostrClient)), te = Ut(yr(rt.externalNostrClientCustomUrl)), ee = Ut(null), F = Ut(yr(rt.quoteNotificationEnabled)), O = Ut(yr(rt.replyNotificationEnabled)), k = Ut(yr(ro.value));
  const $ = "#1dbf73", S = "#808080";
  let j = Ut(yr(kn.accentColor ?? $)), V = Ut(yr(kn.baseColor ?? "")), Y = Ut(null), W = Ut(null), re = Ut(!rt.showMascot), ue = Ut(!rt.showFlavorText), be = Ee(() => y(re) || y(ue)), pe = Ee(() => Gp.value), Ie = Ee(() => Kp.value), $e = Ee(() => $a.value), Ce = Ee(() => Tc.value), Ve = Ee(() => r() === "installing"), Ge = Ee(i), ke = Ee(() => Jp.required), We = Ee(() => y(ke) || r() === "ready" && !y(Ge));
  Nn(() => {
    y(k) !== ro.value && ro.set(y(k));
  });
  function bt() {
    if (y(ke)) {
      eg();
      return;
    }
    tg(sg, (ve) => Tc.set(ve));
  }
  ld(() => {
    rt.reload(), me(J, rt.clientTagEnabled, !0), me(ie, rt.externalNostrClient, !0), me(te, rt.externalNostrClientCustomUrl, !0), me(F, rt.quoteNotificationEnabled, !0), me(O, rt.replyNotificationEnabled, !0), me(k, ro.value, !0), kn.reload(), me(j, kn.accentColor ?? $, !0), me(V, kn.baseColor ?? "", !0), me(re, !rt.showMascot), me(ue, !rt.showFlavorText), Vp(), is.value?.pubkey && is.value?.isAuthenticated && Sc(is.value.pubkey);
  }), Nn(() => {
    me(J, rt.clientTagEnabled, !0);
  }), Nn(() => {
    y(ie) !== rt.externalNostrClient && (rt.externalNostrClient = y(ie));
  }), Nn(() => {
    if (y(te) !== rt.externalNostrClientCustomUrl) {
      const ve = Ac(y(te));
      ve && (rt.externalNostrClientCustomUrl = ve);
    }
  }), Nn(() => {
    me(F, rt.quoteNotificationEnabled, !0);
  }), Nn(() => {
    me(O, rt.replyNotificationEnabled, !0);
  }), Nn(() => {
    y(J) !== rt.clientTagEnabled && (rt.clientTagEnabled = y(J));
  }), Nn(() => {
    y(O) !== rt.replyNotificationEnabled && (rt.replyNotificationEnabled = y(O));
  }), Nn(() => {
    y(F) !== rt.quoteNotificationEnabled && (rt.quoteNotificationEnabled = y(F));
  }), Nn(() => {
    !y(re) !== rt.showMascot && (rt.showMascot = !y(re));
  }), Nn(() => {
    !y(ue) !== rt.showFlavorText && (rt.showFlavorText = !y(ue));
  }), Nn(() => {
    if (!g()) {
      $a.set(!1);
      return;
    }
    is.value?.pubkey && is.value?.isAuthenticated && Sc(is.value.pubkey), (async () => (await ig(), d1(), window.nostrZap?.initTargets()))();
  });
  function ge() {
    rt.locale = a() === "ja" ? "en" : "ja";
  }
  function it(ve) {
    me(te, ve, !0);
    const Ue = Ac(ve);
    me(
      ee,
      Ue ? null : t()("settingsDialog.external_nostr_client_invalid_url"),
      !0
    ), Ue && (rt.externalNostrClientCustomUrl = Ue);
  }
  function pn(ve, Ue) {
    ve === "accent" ? me(j, Ue, !0) : me(V, Ue, !0);
    const Ye = mi(Ue);
    Ye && (ve === "accent" ? (me(j, kn.setAccentColor(Ye) ?? Ue, !0), me(Y, null)) : (me(V, kn.setBaseColor(Ye) ?? Ue, !0), me(W, null)));
  }
  function Qt(ve) {
    const Ue = ve === "accent" ? y(j) : y(V), Ye = ve === "accent" ? kn.accentColor : kn.baseColor, tt = ve === "base" && !Ue && !Ye || mi(Ue) ? null : t()("settingsDialog.invalid_hex_color");
    ve === "accent" ? me(Y, tt, !0) : me(W, tt, !0);
  }
  function Hn(ve, Ue) {
    const Ye = mi(Ue);
    Ye && (ve === "accent" ? (me(j, kn.setAccentColor(Ye) ?? Ye, !0), me(Y, null)) : (me(V, kn.setBaseColor(Ye) ?? Ye, !0), me(W, null)));
  }
  function nn() {
    kn.reset(), me(j, $), me(V, ""), me(Y, null), me(W, null);
  }
  var rn = {
    get show() {
      return g();
    },
    set show(ve = !1) {
      g(ve), Re();
    },
    get onClose() {
      return b();
    },
    set onClose(ve) {
      b(ve), Re();
    },
    get onRefreshRelaysAndProfile() {
      return m();
    },
    set onRefreshRelaysAndProfile(ve = () => {
    }) {
      m(ve), Re();
    },
    get onOpenWelcomeDialog() {
      return v();
    },
    set onOpenWelcomeDialog(ve = void 0) {
      v(ve), Re();
    },
    get rxNostr() {
      return T();
    },
    set rxNostr(ve = null) {
      T(ve), Re();
    }
  };
  {
    const ve = (lt) => {
      var tt = Pt(), Je = at(tt);
      {
        const ft = (Pe, kt) => {
          let zt = () => kt?.().props;
          {
            let Yt = Ee(() => t()("global.close"));
            Bt(Pe, yo(zt, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return y(Yt);
              },
              children: (Nt, sn) => {
                var Mt = K1();
                ce(Nt, Mt);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        en(Je, () => ag, (Pe, kt) => {
          kt(Pe, { child: ft, $$slots: { child: !0 } });
        });
      }
      ce(lt, tt);
    };
    let Ue = Ee(() => t()("settings") || "設定"), Ye = Ee(() => t()("settingsDialog.image_quality_setting"));
    og(n, {
      onOpenChange: (lt) => !lt && A(),
      get title() {
        return y(Ue);
      },
      get description() {
        return y(Ye);
      },
      contentClass: "settings-dialog",
      footerVariant: "close-button",
      get open() {
        return g();
      },
      set open(lt) {
        g(lt);
      },
      footer: ve,
      children: (lt, tt) => {
        var Je = lm(), ft = at(Je), Pe = R(ft), kt = R(Pe), zt = se(R(kt), 2), Yt = R(zt, !0);
        N(zt), N(kt);
        var Nt = se(kt, 2), sn = R(Nt), Mt = R(sn, !0);
        N(sn);
        var An = se(sn), Lt = R(An, !0);
        N(An), N(Nt), N(Pe);
        var It = se(Pe, 2), Xt = R(It);
        Bt(Xt, {
          shape: "circle",
          variant: "default",
          className: "help-btn",
          onClick: () => {
            A(), v()?.();
          },
          ariaLabel: "Help",
          children: (Le, ze) => {
            var De = Q1();
            ce(Le, De);
          },
          $$slots: { default: !0 }
        });
        var Rt = se(Xt, 2);
        Bt(Rt, {
          shape: "circle",
          variant: "default",
          className: "github-link-btn",
          onClick: () => window.open("https://github.com/Lokuyow/ehagaki", "_blank", "noopener"),
          ariaLabel: "GitHub Repository",
          children: (Le, ze) => {
            var De = Y1();
            ce(Le, De);
          },
          $$slots: { default: !0 }
        }), jt(2), N(It), N(ft);
        var At = se(ft, 2), ln = R(At);
        {
          var Sn = (Le) => {
            var ze = J1(), De = R(ze), je = R(De), Qe = R(je);
            {
              var ut = (ht) => {
                var Et = $t();
                Be((En) => fe(Et, En), [() => t()("settingsDialog.reload_required")]), ce(ht, Et);
              }, wt = (ht) => {
                var Et = $t();
                Be((En) => fe(Et, En), [
                  () => t()("settingsDialog.db_upgrade_blocked") || "ほかのeHagakiタブを閉じるか再読み込みしてください"
                ]), ce(ht, Et);
              }, gt = (ht) => {
                var Et = $t();
                Be((En) => fe(Et, En), [
                  () => t()("settingsDialog.sw_update_installing") || "アプリの更新をインストール中です"
                ]), ce(ht, Et);
              }, dt = (ht) => {
                var Et = $t();
                Be((En) => fe(Et, En), [
                  () => t()("settingsDialog.sw_update_available") || "アプリの更新があります"
                ]), ce(ht, Et);
              };
              vt(Qe, (ht) => {
                y(ke) ? ht(ut) : y(Ge) ? ht(wt, 1) : y(Ve) ? ht(gt, 2) : ht(dt, -1);
              });
            }
            N(je);
            var pt = se(je, 2), Ct = R(pt);
            {
              let ht = Ee(() => y(Ce) || y(Ve) && !y(ke) ? "loading" : ""), Et = Ee(() => y(Ce) || !y(We)), En = Ee(() => y(ke) ? t()("staleAsset.reload") : t()("settingsDialog.update_app") || "アプリを更新");
              Bt(Ct, {
                variant: "primary",
                shape: "rounded",
                contentLayout: "iconText",
                get className() {
                  return `sw-update-btn ${y(ht) ?? ""}`;
                },
                onClick: bt,
                get disabled() {
                  return y(Et);
                },
                get ariaLabel() {
                  return y(En);
                },
                children: (Ds, Os) => {
                  var Vr = Pt(), Vt = at(Vr);
                  {
                    var He = (Vn) => {
                      {
                        let tr = Ee(() => y(Ve) ? t()("settingsDialog.sw_update_installing_short") || "インストール中..." : t()("settingsDialog.updating") || "更新中...");
                        Yp(Vn, {
                          showLoader: !0,
                          loaderSize: 32,
                          get text() {
                            return y(tr);
                          }
                        });
                      }
                    }, Ir = (Vn) => {
                      var tr = X1(), nr = se(at(tr), 2), pr = R(nr, !0);
                      N(nr), Be((Ns) => fe(pr, Ns), [
                        () => y(ke) ? t()("staleAsset.reload") : t()("settingsDialog.update_app") || "更新"
                      ]), ce(Vn, tr);
                    };
                    vt(Vt, (Vn) => {
                      y(Ce) || y(Ve) && !y(ke) ? Vn(He) : Vn(Ir, -1);
                    });
                  }
                  ce(Ds, Vr);
                },
                $$slots: { default: !0 }
              });
            }
            N(pt), N(De), N(ze), ce(Le, ze);
          };
          vt(ln, (Le) => {
            (c() || y(ke)) && Le(Sn);
          });
        }
        var vn = se(ln, 2), Xn = R(vn), dr = se(R(Xn), 2), qn = R(dr);
        Bt(qn, {
          variant: "default",
          shape: "rounded",
          contentLayout: "iconText",
          className: "lang-btn",
          onClick: ge,
          children: (Le, ze) => {
            var De = em(), je = se(at(De), 2), Qe = R(je, !0);
            N(je), Be((ut) => fe(Qe, ut), [() => t()("settingsDialog.change") || "変更"]), ce(Le, De);
          },
          $$slots: { default: !0 }
        }), N(dr), N(Xn), N(vn);
        var Un = se(vn, 2);
        Oh(Un, {
          get compressionPairs() {
            return y(U);
          },
          get selectedCompression() {
            return rt.imageQualityLevel;
          },
          onCompressionChange: (Le) => rt.imageQualityLevel = Le,
          get videoCompressionPairs() {
            return y(P);
          },
          get selectedVideoCompression() {
            return rt.videoQualityLevel;
          },
          onVideoCompressionChange: (Le) => rt.videoQualityLevel = Le
        });
        var Cn = se(Un, 2);
        Nh(Cn, {
          get rxNostr() {
            return T();
          }
        });
        var jn = se(Cn, 2), Fn = R(jn), Dt = R(Fn), cn = R(Dt, !0);
        N(Dt);
        var Zn = se(Dt, 2);
        en(Zn, () => co, (Le, ze) => {
          ze(Le, {
            class: "setting-control theme-mode-group",
            name: "themeMode",
            orientation: "horizontal",
            get value() {
              return y(k);
            },
            "aria-labelledby": "theme-mode-label",
            onValueChange: (De) => {
              me(k, De, !0);
            },
            children: (De, je) => {
              var Qe = tm(), ut = at(Qe);
              {
                let dt = Ee(() => t()("settingsDialog.theme_system") || "システム");
                qs(ut, {
                  value: "system",
                  variant: "default",
                  shape: "rounded",
                  get ariaLabel() {
                    return y(dt);
                  },
                  children: (pt, Ct) => {
                    jt();
                    var ht = $t();
                    Be((Et) => fe(ht, Et), [() => t()("settingsDialog.theme_system") || "システム"]), ce(pt, ht);
                  },
                  $$slots: { default: !0 }
                });
              }
              var wt = se(ut, 2);
              {
                let dt = Ee(() => t()("settingsDialog.theme_light") || "ライト");
                qs(wt, {
                  value: "light",
                  variant: "default",
                  shape: "rounded",
                  get ariaLabel() {
                    return y(dt);
                  },
                  children: (pt, Ct) => {
                    jt();
                    var ht = $t();
                    Be((Et) => fe(ht, Et), [() => t()("settingsDialog.theme_light") || "ライト"]), ce(pt, ht);
                  },
                  $$slots: { default: !0 }
                });
              }
              var gt = se(wt, 2);
              {
                let dt = Ee(() => t()("settingsDialog.theme_dark") || "ダーク");
                qs(gt, {
                  value: "dark",
                  variant: "default",
                  shape: "rounded",
                  get ariaLabel() {
                    return y(dt);
                  },
                  children: (pt, Ct) => {
                    jt();
                    var ht = $t();
                    Be((Et) => fe(ht, Et), [() => t()("settingsDialog.theme_dark") || "ダーク"]), ce(pt, ht);
                  },
                  $$slots: { default: !0 }
                });
              }
              ce(De, Qe);
            },
            $$slots: { default: !0 }
          });
        }), N(Fn), N(jn);
        var Ke = se(jn, 2);
        {
          var Ht = (Le) => {
            var ze = sm(), De = R(ze), je = R(De, !0);
            N(De);
            var Qe = se(De, 2), ut = R(Qe), wt = R(ut), gt = R(wt, !0);
            N(wt);
            var dt = se(wt, 2), pt = R(dt, !0);
            N(dt), N(ut);
            var Ct = se(ut, 2), ht = R(Ct);
            ls(ht);
            var Et = se(ht, 2);
            ls(Et), N(Ct), N(Qe);
            var En = se(Qe, 2);
            {
              var Ds = (Gt) => {
                var Gn = nm(), gr = R(Gn, !0);
                N(Gn), Be(() => fe(gr, y(Y))), ce(Gt, Gn);
              };
              vt(En, (Gt) => {
                y(Y) && Gt(Ds);
              });
            }
            var Os = se(En, 2), Vr = R(Os), Vt = R(Vr), He = R(Vt, !0);
            N(Vt);
            var Ir = se(Vt, 2), Vn = R(Ir, !0);
            N(Ir), N(Vr);
            var tr = se(Vr, 2), nr = R(tr);
            ls(nr);
            var pr = se(nr, 2);
            ls(pr), N(tr), N(Os);
            var Ns = se(Os, 2);
            {
              var Vo = (Gt) => {
                var Gn = rm(), gr = R(Gn, !0);
                N(Gn), Be(() => fe(gr, y(W))), ce(Gt, Gn);
              };
              vt(Ns, (Gt) => {
                y(W) && Gt(Vo);
              });
            }
            var Go = se(Ns, 2);
            Bt(Go, {
              variant: "default",
              shape: "rounded",
              className: "reset-theme-colors-btn",
              onClick: nn,
              children: (Gt, Gn) => {
                jt();
                var gr = $t();
                Be((gi) => fe(gr, gi), [() => t()("settingsDialog.reset_colors")]), ce(Gt, gr);
              },
              $$slots: { default: !0 }
            }), N(ze), Be(
              (Gt, Gn, gr, gi, Wo, Ko, Qo, Yo, Xo, Gi, Jo) => {
                fe(je, Gt), fe(gt, Gn), fe(pt, gr), wr(ht, "aria-label", gi), yi(ht, Wo), wr(Et, "aria-label", Ko), yi(Et, y(j)), wr(Et, "aria-invalid", y(Y) ? "true" : "false"), fe(He, Qo), fe(Vn, Yo), wr(nr, "aria-label", Xo), yi(nr, Gi), wr(pr, "aria-label", Jo), yi(pr, y(V)), wr(pr, "aria-invalid", y(W) ? "true" : "false");
              },
              [
                () => t()("settingsDialog.color"),
                () => t()("settingsDialog.accent_color"),
                () => t()("settingsDialog.accent_color_description"),
                () => t()("settingsDialog.accent_color_picker"),
                () => mi(kn.accentColor) ?? $,
                () => t()("settingsDialog.accent_color_hex"),
                () => t()("settingsDialog.base_color"),
                () => t()("settingsDialog.base_color_description"),
                () => t()("settingsDialog.base_color_picker"),
                () => mi(kn.baseColor) ?? S,
                () => t()("settingsDialog.base_color_hex")
              ]
            ), xr("input", ht, (Gt) => Hn("accent", Gt.currentTarget.value)), xr("input", Et, (Gt) => pn("accent", Gt.currentTarget.value)), Lc("blur", Et, () => Qt("accent")), xr("input", nr, (Gt) => Hn("base", Gt.currentTarget.value)), xr("input", pr, (Gt) => pn("base", Gt.currentTarget.value)), Lc("blur", pr, () => Qt("base")), ce(Le, ze);
          };
          vt(Ke, (Le) => {
            kn.isAvailable && Le(Ht);
          });
        }
        var xn = se(Ke, 2), st = R(xn), nt = R(st), Tt = R(nt, !0);
        N(nt);
        var mt = se(nt, 2), on = R(mt);
        en(on, () => rs, (Le, ze) => {
          ze(Le, {
            class: "bui-switch",
            "aria-labelledby": "media-free-placement-label",
            get checked() {
              return rt.mediaFreePlacement;
            },
            set checked(De) {
              rt.mediaFreePlacement = De;
            },
            children: (De, je) => {
              var Qe = Pt(), ut = at(Qe);
              en(ut, () => ss, (wt, gt) => {
                gt(wt, { class: "bui-switch-thumb" });
              }), ce(De, Qe);
            },
            $$slots: { default: !0 }
          });
        }), N(mt), N(st), N(xn);
        var qe = se(xn, 2), ot = R(qe), St = R(ot), de = R(St), Ot = R(de), Cr = R(Ot), ei = R(Cr, !0);
        N(Cr);
        var ks = se(Cr, 2);
        {
          let Le = Ee(() => t()("settingsDialog.hide_mascot_description"));
          Or(ks, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return y(Le);
            },
            children: (ze, De) => {
              jt();
              var je = $t();
              Be((Qe) => fe(je, Qe), [
                () => t()("settingsDialog.hide_mascot_note") || "オンにすると左上のマスコットを隠し、フレーバーテキストもあわせて非表示にします。"
              ]), ce(ze, je);
            },
            $$slots: { default: !0 }
          });
        }
        N(Ot), N(de);
        var As = se(de, 2), ti = R(As);
        en(ti, () => rs, (Le, ze) => {
          ze(Le, {
            class: "bui-switch",
            "aria-labelledby": "hide-mascot-label",
            get checked() {
              return y(re);
            },
            set checked(De) {
              me(re, De, !0);
            },
            children: (De, je) => {
              var Qe = Pt(), ut = at(Qe);
              en(ut, () => ss, (wt, gt) => {
                gt(wt, { class: "bui-switch-thumb" });
              }), ce(De, Qe);
            },
            $$slots: { default: !0 }
          });
        }), N(As), N(St), N(ot);
        var Ss = se(ot, 2), Mi = R(Ss), ni = R(Mi), Ri = R(ni), Cs = R(Ri), ri = R(Cs, !0);
        N(Cs);
        var zo = se(Cs, 2);
        {
          let Le = Ee(() => t()("settingsDialog.hide_flavor_text_description"));
          Or(zo, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return y(Le);
            },
            children: (ze, De) => {
              jt();
              var je = $t();
              Be((Qe) => fe(je, Qe), [
                () => y(re) ? t()("settingsDialog.hide_flavor_text_note_included") || "マスコットを非表示にしている間は、この設定も自動でオンになります。" : t()("settingsDialog.hide_flavor_text_note") || "オンにすると info のフレーバーテキストだけを隠します。success / error / tips は簡素な表示で残ります。"
              ]), ce(ze, je);
            },
            $$slots: { default: !0 }
          });
        }
        N(Ri), N(ni);
        var Bi = se(ni, 2), Ho = R(Bi);
        {
          var qo = (Le) => {
            var ze = Pt(), De = at(ze);
            en(De, () => rs, (je, Qe) => {
              Qe(je, {
                class: "bui-switch",
                get checked() {
                  return y(be);
                },
                disabled: !0,
                "aria-labelledby": "hide-flavor-text-label",
                children: (ut, wt) => {
                  var gt = Pt(), dt = at(gt);
                  en(dt, () => ss, (pt, Ct) => {
                    Ct(pt, { class: "bui-switch-thumb" });
                  }), ce(ut, gt);
                },
                $$slots: { default: !0 }
              });
            }), ce(Le, ze);
          }, jo = (Le) => {
            var ze = Pt(), De = at(ze);
            en(De, () => rs, (je, Qe) => {
              Qe(je, {
                class: "bui-switch",
                "aria-labelledby": "hide-flavor-text-label",
                get checked() {
                  return y(ue);
                },
                set checked(ut) {
                  me(ue, ut, !0);
                },
                children: (ut, wt) => {
                  var gt = Pt(), dt = at(gt);
                  en(dt, () => ss, (pt, Ct) => {
                    Ct(pt, { class: "bui-switch-thumb" });
                  }), ce(ut, gt);
                },
                $$slots: { default: !0 }
              });
            }), ce(Le, ze);
          };
          vt(Ho, (Le) => {
            y(re) ? Le(qo) : Le(jo, -1);
          });
        }
        N(Bi), N(Mi), N(Ss), N(qe);
        var si = se(qe, 2), ii = R(si), Ui = R(ii), oi = R(Ui), Pi = R(oi), ai = R(Pi), Fo = R(ai, !0);
        N(ai);
        var ur = se(ai, 2);
        {
          let Le = Ee(() => t()("settingsDialog.quote_notification_description"));
          Or(ur, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return y(Le);
            },
            children: (ze, De) => {
              jt();
              var je = $t();
              Be((Qe) => fe(je, Qe), [
                () => t()("settingsDialog.quote_notification_note") || "引用投稿時、引用元の投稿者への通知をデフォルトで有効にします"
              ]), ce(ze, je);
            },
            $$slots: { default: !0 }
          });
        }
        N(Pi), N(oi);
        var Jn = se(oi, 2), zi = R(Jn);
        en(zi, () => rs, (Le, ze) => {
          ze(Le, {
            class: "bui-switch",
            "aria-labelledby": "quote-notification-label",
            get checked() {
              return y(F);
            },
            set checked(De) {
              me(F, De, !0);
            },
            children: (De, je) => {
              var Qe = Pt(), ut = at(Qe);
              en(ut, () => ss, (wt, gt) => {
                gt(wt, { class: "bui-switch-thumb" });
              }), ce(De, Qe);
            },
            $$slots: { default: !0 }
          });
        }), N(Jn), N(Ui), N(ii);
        var Hi = se(ii, 2), hr = R(Hi), _n = R(hr), Pn = R(_n), In = R(Pn), vs = R(In, !0);
        N(In);
        var qi = se(In, 2);
        {
          let Le = Ee(() => t()("settingsDialog.reply_notification_description"));
          Or(qi, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return y(Le);
            },
            children: (ze, De) => {
              jt();
              var je = $t();
              Be((Qe) => fe(je, Qe), [
                () => t()("settingsDialog.reply_notification_note") || "リプライ時にリプライツリー内のほかの参加者をデフォルトで通知対象に含めます"
              ]), ce(ze, je);
            },
            $$slots: { default: !0 }
          });
        }
        N(Pn), N(_n);
        var li = se(_n, 2), ji = R(li);
        en(ji, () => rs, (Le, ze) => {
          ze(Le, {
            class: "bui-switch",
            "aria-labelledby": "reply-notification-label",
            get checked() {
              return y(O);
            },
            set checked(De) {
              me(O, De, !0);
            },
            children: (De, je) => {
              var Qe = Pt(), ut = at(Qe);
              en(ut, () => ss, (wt, gt) => {
                gt(wt, { class: "bui-switch-thumb" });
              }), ce(De, Qe);
            },
            $$slots: { default: !0 }
          });
        }), N(li), N(hr), N(Hi), N(si);
        var jr = se(si, 2), Is = R(jr), Ts = R(Is), er = R(Ts, !0);
        N(Ts);
        var ci = se(Ts, 2), Fi = R(ci);
        en(Fi, () => rs, (Le, ze) => {
          ze(Le, {
            class: "bui-switch",
            "aria-labelledby": "client-tag-label",
            get checked() {
              return y(J);
            },
            set checked(De) {
              me(J, De, !0);
            },
            children: (De, je) => {
              var Qe = Pt(), ut = at(Qe);
              en(ut, () => ss, (wt, gt) => {
                gt(wt, { class: "bui-switch-thumb" });
              }), ce(De, Qe);
            },
            $$slots: { default: !0 }
          });
        }), N(ci), N(Is), N(jr);
        var Fr = se(jr, 2), di = R(Fr), ui = R(di), Zr = R(ui), hi = R(Zr), fi = R(hi, !0);
        N(hi);
        var Ls = se(hi, 2);
        {
          let Le = Ee(() => t()("settingsDialog.external_nostr_client_description"));
          Or(Ls, {
            get ariaLabel() {
              return y(Le);
            },
            children: (ze, De) => {
              jt();
              var je = $t();
              Be((Qe) => fe(je, Qe), [
                () => t()("settingsDialog.external_nostr_client_description")
              ]), ce(ze, je);
            },
            $$slots: { default: !0 }
          });
        }
        N(Zr), N(ui);
        var fr = se(ui, 2);
        Mr(fr, 21, () => Qp, Rr, (Le, ze) => {
          var De = im(), je = R(De, !0);
          N(De);
          var Qe = {};
          Be(
            (ut) => {
              fe(je, ut), Qe !== (Qe = y(ze)) && (De.value = (De.__value = y(ze)) ?? "");
            },
            [
              () => y(ze) === "custom" ? t()("settingsDialog.external_nostr_client_custom") : y(ze) === "nostter" ? "nostter" : y(ze) === "njump" ? "njump" : y(ze)[0].toUpperCase() + y(ze).slice(1)
            ]
          ), ce(Le, De);
        }), N(fr);
        var Zi;
        cd(fr), N(di);
        var Zo = se(di, 2);
        {
          var pi = (Le) => {
            var ze = am(), De = R(ze), je = R(De, !0);
            N(De);
            var Qe = se(De, 2), ut = R(Qe, !0);
            N(Qe);
            var wt = se(Qe, 2);
            ls(wt);
            var gt = se(wt, 2);
            {
              var dt = (pt) => {
                var Ct = om(), ht = R(Ct, !0);
                N(Ct), Be(() => fe(ht, y(ee))), ce(pt, Ct);
              };
              vt(gt, (pt) => {
                y(ee) && pt(dt);
              });
            }
            N(ze), Be(
              (pt, Ct) => {
                fe(je, pt), fe(ut, Ct), yi(wt, y(te)), wr(wt, "aria-invalid", y(ee) ? "true" : "false");
              },
              [
                () => t()("settingsDialog.external_nostr_client_custom_url"),
                () => t()("settingsDialog.external_nostr_client_custom_url_description")
              ]
            ), xr("input", wt, (pt) => it(pt.currentTarget.value)), ce(Le, ze);
          };
          vt(Zo, (Le) => {
            y(ie) === "custom" && Le(pi);
          });
        }
        N(Fr);
        var Vi = se(Fr, 2);
        Dh(Vi, {
          get relayConfig() {
            return y(Ie);
          },
          get showRelays() {
            return y($e);
          },
          onToggleShowRelays: () => $a.set(!y($e)),
          get onRefreshRelaysAndProfile() {
            return m();
          }
        }), N(At), Be(
          (Le, ze, De, je, Qe, ut, wt, gt, dt, pt) => {
            fe(Yt, y(pe) ? `v${y(pe)}` : ""), fe(Mt, Le), fe(Lt, ze), fe(cn, De), fe(Tt, je), fe(ei, Qe), fe(ri, ut), fe(Fo, wt), fe(vs, gt), fe(er, dt), fe(fi, pt), Zi !== (Zi = y(ie)) && (fr.value = (fr.__value = y(ie)) ?? "", dd(fr, y(ie)));
          },
          [
            () => t()("settingsDialog.author_info") || "制作：",
            () => t()("settingsDialog.author_name") || " Lokuyow",
            () => t()("settingsDialog.theme_mode") || "カラーテーマ",
            () => t()("settingsDialog.media_bottom_mode") || "メディア自由配置モード",
            () => t()("settingsDialog.hide_mascot_label") || "左上マスコットを非表示",
            () => t()("settingsDialog.hide_flavor_text_label") || "フレーバーテキストを非表示",
            () => t()("settingsDialog.quote_notification_label") || "引用元の投稿者に通知",
            () => t()("settingsDialog.reply_notification_label") || "返信先以外にも通知",
            () => t()("settingsDialog.client_tag_label") || "投稿詳細にクライアント名をつける（Client tag）",
            () => t()("settingsDialog.external_nostr_client")
          ]
        ), xr("change", fr, (Le) => {
          me(ie, Le.currentTarget.value, !0), me(ee, null);
        }), ce(lt, Je);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var gn = ar(rn);
  return h(), gn;
}
ud(["input", "change"]);
lr(
  dm,
  {
    show: {},
    onClose: {},
    onRefreshRelaysAndProfile: {},
    onOpenWelcomeDialog: {},
    rxNostr: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  dm as default
};
