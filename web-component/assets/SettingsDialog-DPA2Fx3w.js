import { aE as id, aF as yo, aH as Dp, aI as od, bd as ad, aG as Hs, aN as Op, aL as Ha, aO as ld, K as gt, b1 as wo, I as Ne, aP as Ft, aQ as co, aR as ls, aS as Ur, aT as xo, aU as _o, aV as Eo, aJ as Np, be as Rp, aK as Mp, bf as Ec, H as $o, aA as Bt, Q as ko, N as vr, V as rs, $ as Ao, W as Dr, M as qa, b5 as Or, b7 as Bp, a_ as tn, bg as Ms, bh as _a, bi as Ea, bj as $a, ai as cd, bk as Jn, a as ts, bl as dd, ba as ss, L as Up, bm as ud, bn as Pp, bo as zp, bp as Hp, bq as qp, br as jp, bs as $c, bt as Fp, b6 as kc, aY as Zp, s as it, bu as so, bv as Ln, bw as Ac, bx as ka, by as Sc, bz as Vp, bA as Gp, bB as Wp, bC as Cc, bD as Kp, bE as Qp, S as Yp, bF as mi, b4 as yi, bG as Ic, bH as Xp, bI as Jp, bJ as eg, bK as tg, bL as Tc, bM as ng, bN as rg, bO as sg } from "./App-CBRbsegU.js";
import { aR as Ee, a as y, b as be, aS as Ut, aN as Dn, b0 as tr, b1 as Pt, b2 as dt, b3 as fe, b4 as nr, b6 as rr, b7 as So, bf as se, b5 as Re, ba as qe, b8 as R, n as Oi, b9 as O, Z as Fe, bi as ge, bh as Nt, bk as Lc, bj as jt, aJ as gr, aq as hd, ap as br, a$ as ig, bC as Dc } from "./entry-wxgtzGEF.js";
import { D as og, a as ag } from "./DialogWrapper-BRiQEO8D.js";
import { I as Tr } from "./InfoPopoverButton-4jx5UI7G.js";
import { H as fd } from "./hidden-input-wj7hXzb3.js";
import { b as lg, a as Oc } from "./input-BDR009Ra.js";
const ja = ld({ component: "radio-group", parts: ["root", "item"] }), rl = new id("RadioGroup.Root");
class sl {
  static create(e) {
    return rl.set(new sl(e));
  }
  opts;
  #e = Ee(() => this.opts.value.current !== "");
  get hasValue() {
    return y(this.#e);
  }
  set hasValue(e) {
    be(this.#e, e);
  }
  rovingFocusGroup;
  attachment;
  constructor(e) {
    this.opts = e, this.attachment = yo(this.opts.ref), this.rovingFocusGroup = new Op({
      rootNode: this.opts.ref,
      candidateAttr: ja.item,
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
    "aria-required": Ha(this.opts.required.current),
    "aria-disabled": Ha(this.opts.disabled.current),
    "aria-readonly": this.opts.readonly.current ? "true" : void 0,
    "data-disabled": Hs(this.opts.disabled.current),
    "data-readonly": Hs(this.opts.readonly.current),
    "data-orientation": this.opts.orientation.current,
    [ja.root]: "",
    ...this.attachment
  }));
  get props() {
    return y(this.#t);
  }
  set props(e) {
    be(this.#t, e);
  }
}
class il {
  static create(e) {
    return new il(e, rl.get());
  }
  opts;
  root;
  attachment;
  #e = Ee(() => this.root.opts.value.current === this.opts.value.current);
  get checked() {
    return y(this.#e);
  }
  set checked(e) {
    be(this.#e, e);
  }
  #t = Ee(() => this.opts.disabled.current || this.root.opts.disabled.current);
  #n = Ee(() => this.root.opts.readonly.current);
  #r = Ee(() => this.root.isChecked(this.opts.value.current));
  #s = Ut(-1);
  constructor(e, t) {
    this.opts = e, this.root = t, this.attachment = yo(this.opts.ref), this.opts.value.current === this.root.opts.value.current ? (this.root.rovingFocusGroup.setCurrentTabStopId(this.opts.id.current), be(this.#s, 0)) : this.root.opts.value.current || be(this.#s, 0), Dn(() => {
      be(this.#s, this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current), !0);
    }), Dp(
      [
        () => this.opts.value.current,
        () => this.root.opts.value.current
      ],
      () => {
        this.opts.value.current === this.root.opts.value.current && (this.root.rovingFocusGroup.setCurrentTabStopId(this.opts.id.current), be(this.#s, 0));
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
      if (e.key === od) {
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
    be(this.#o, e);
  }
  #a = Ee(() => ({
    id: this.opts.id.current,
    disabled: y(this.#t) ? !0 : void 0,
    "data-value": this.opts.value.current,
    "data-orientation": this.root.opts.orientation.current,
    "data-disabled": Hs(y(this.#t)),
    "data-readonly": Hs(y(this.#n)),
    "data-state": y(this.#r) ? "checked" : "unchecked",
    "aria-checked": ad(y(this.#r)),
    [ja.item]: "",
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
    be(this.#a, e);
  }
}
class ol {
  static create() {
    return new ol(rl.get());
  }
  root;
  #e = Ee(() => this.root.opts.name.current !== void 0);
  get shouldRender() {
    return y(this.#e);
  }
  set shouldRender(e) {
    be(this.#e, e);
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
    be(this.#t, e);
  }
}
function pd(n, e) {
  tr(e, !0);
  const t = ol.create();
  var r = Pt(), i = dt(r);
  {
    var a = (c) => {
      fd(c, wo(() => t.props));
    };
    gt(i, (c) => {
      t.shouldRender && c(a);
    });
  }
  fe(n, r), nr();
}
rr(pd, {}, [], [], { mode: "open" });
var cg = qe("<div><!></div>"), dg = qe("<!> <!>", 1);
function uo(n, e) {
  const t = So();
  tr(e, !0);
  let r = Ne(e, "disabled", 7, !1), i = Ne(e, "children", 7), a = Ne(e, "child", 7), c = Ne(e, "value", 15, ""), d = Ne(e, "ref", 15, null), h = Ne(e, "orientation", 7, "vertical"), p = Ne(e, "loop", 7, !0), b = Ne(e, "name", 7, void 0), m = Ne(e, "required", 7, !1), v = Ne(e, "readonly", 7, !1), T = Ne(e, "id", 23, () => ls(t)), A = Ne(e, "onValueChange", 7, co), $ = Eo(e, [
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
  const L = sl.create({
    orientation: Ft(() => h()),
    disabled: Ft(() => r()),
    loop: Ft(() => p()),
    name: Ft(() => b()),
    required: Ft(() => m()),
    readonly: Ft(() => v()),
    id: Ft(() => T()),
    value: Ft(() => c(), (U) => {
      U !== c() && (c(U), A()?.(U));
    }),
    ref: Ft(() => d(), (U) => d(U))
  }), P = Ee(() => _o($, L.props));
  var B = {
    get disabled() {
      return r();
    },
    set disabled(U = !1) {
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
    set value(U = "") {
      c(U), Re();
    },
    get ref() {
      return d();
    },
    set ref(U = null) {
      d(U), Re();
    },
    get orientation() {
      return h();
    },
    set orientation(U = "vertical") {
      h(U), Re();
    },
    get loop() {
      return p();
    },
    set loop(U = !0) {
      p(U), Re();
    },
    get name() {
      return b();
    },
    set name(U = void 0) {
      b(U), Re();
    },
    get required() {
      return m();
    },
    set required(U = !1) {
      m(U), Re();
    },
    get readonly() {
      return v();
    },
    set readonly(U = !1) {
      v(U), Re();
    },
    get id() {
      return T();
    },
    set id(U = ls(t)) {
      T(U), Re();
    },
    get onValueChange() {
      return A();
    },
    set onValueChange(U = co) {
      A(U), Re();
    }
  }, te = dg(), oe = dt(te);
  {
    var Y = (U) => {
      var S = Pt(), k = dt(S);
      Ur(k, a, () => ({ props: y(P) })), fe(U, S);
    }, ee = (U) => {
      var S = cg();
      xo(S, () => ({ ...y(P) }));
      var k = R(S);
      Ur(k, () => i() ?? Oi), O(S), fe(U, S);
    };
    gt(oe, (U) => {
      a() ? U(Y) : U(ee, -1);
    });
  }
  var F = se(oe, 2);
  return pd(F, {}), fe(n, te), nr(B);
}
rr(
  uo,
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
var ug = qe("<button><!></button>");
function gd(n, e) {
  const t = So();
  tr(e, !0);
  let r = Ne(e, "id", 23, () => ls(t)), i = Ne(e, "children", 7), a = Ne(e, "child", 7), c = Ne(e, "value", 7), d = Ne(e, "disabled", 7, !1), h = Ne(e, "ref", 15, null), p = Eo(e, [
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
  const b = il.create({
    value: Ft(() => c()),
    disabled: Ft(() => d() ?? !1),
    id: Ft(() => r()),
    ref: Ft(() => h(), (P) => h(P))
  }), m = Ee(() => _o(p, b.props));
  var v = {
    get id() {
      return r();
    },
    set id(P = ls(t)) {
      r(P), Re();
    },
    get children() {
      return i();
    },
    set children(P) {
      i(P), Re();
    },
    get child() {
      return a();
    },
    set child(P) {
      a(P), Re();
    },
    get value() {
      return c();
    },
    set value(P) {
      c(P), Re();
    },
    get disabled() {
      return d();
    },
    set disabled(P = !1) {
      d(P), Re();
    },
    get ref() {
      return h();
    },
    set ref(P = null) {
      h(P), Re();
    }
  }, T = Pt(), A = dt(T);
  {
    var $ = (P) => {
      var B = Pt(), te = dt(B);
      {
        let oe = Ee(() => ({ props: y(m), ...b.snippetProps }));
        Ur(te, a, () => y(oe));
      }
      fe(P, B);
    }, L = (P) => {
      var B = ug();
      xo(B, () => ({ ...y(m) }));
      var te = R(B);
      Ur(te, () => i() ?? Oi, () => b.snippetProps), O(B), fe(P, B);
    };
    gt(A, (P) => {
      a() ? P($) : P(L, -1);
    });
  }
  return fe(n, T), nr(v);
}
rr(
  gd,
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
const vd = ld({ component: "switch", parts: ["root", "thumb"] }), al = new id("Switch.Root");
class ll {
  static create(e) {
    return al.set(new ll(e));
  }
  opts;
  attachment;
  constructor(e) {
    this.opts = e, this.attachment = yo(e.ref), this.onkeydown = this.onkeydown.bind(this), this.onclick = this.onclick.bind(this);
  }
  #e() {
    this.opts.checked.current = !this.opts.checked.current;
  }
  onkeydown(e) {
    !(e.key === Np || e.key === od) || this.opts.disabled.current || (e.preventDefault(), this.#e());
  }
  onclick(e) {
    this.opts.disabled.current || this.#e();
  }
  #t = Ee(() => ({
    "data-disabled": Hs(this.opts.disabled.current),
    "data-state": Rp(this.opts.checked.current),
    "data-required": Hs(this.opts.required.current)
  }));
  get sharedProps() {
    return y(this.#t);
  }
  set sharedProps(e) {
    be(this.#t, e);
  }
  #n = Ee(() => ({ checked: this.opts.checked.current }));
  get snippetProps() {
    return y(this.#n);
  }
  set snippetProps(e) {
    be(this.#n, e);
  }
  #r = Ee(() => ({
    ...this.sharedProps,
    id: this.opts.id.current,
    role: "switch",
    disabled: Mp(this.opts.disabled.current),
    "aria-checked": ad(this.opts.checked.current),
    "aria-required": Ha(this.opts.required.current),
    [vd.root]: "",
    onclick: this.onclick,
    onkeydown: this.onkeydown,
    ...this.attachment
  }));
  get props() {
    return y(this.#r);
  }
  set props(e) {
    be(this.#r, e);
  }
}
class cl {
  static create() {
    return new cl(al.get());
  }
  root;
  #e = Ee(() => this.root.opts.name.current !== void 0);
  get shouldRender() {
    return y(this.#e);
  }
  set shouldRender(e) {
    be(this.#e, e);
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
    be(this.#t, e);
  }
}
class dl {
  static create(e) {
    return new dl(e, al.get());
  }
  opts;
  root;
  attachment;
  constructor(e, t) {
    this.opts = e, this.root = t, this.attachment = yo(e.ref);
  }
  #e = Ee(() => ({ checked: this.root.opts.checked.current }));
  get snippetProps() {
    return y(this.#e);
  }
  set snippetProps(e) {
    be(this.#e, e);
  }
  #t = Ee(() => ({
    ...this.root.sharedProps,
    id: this.opts.id.current,
    [vd.thumb]: "",
    ...this.attachment
  }));
  get props() {
    return y(this.#t);
  }
  set props(e) {
    be(this.#t, e);
  }
}
function bd(n, e) {
  tr(e, !0);
  const t = cl.create();
  var r = Pt(), i = dt(r);
  {
    var a = (c) => {
      fd(c, wo(() => t.props));
    };
    gt(i, (c) => {
      t.shouldRender && c(a);
    });
  }
  fe(n, r), nr();
}
rr(bd, {}, [], [], { mode: "open" });
var hg = qe("<button><!></button>"), fg = qe("<!> <!>", 1);
function Jr(n, e) {
  const t = So();
  tr(e, !0);
  let r = Ne(e, "child", 7), i = Ne(e, "children", 7), a = Ne(e, "ref", 15, null), c = Ne(e, "id", 23, () => ls(t)), d = Ne(e, "disabled", 7, !1), h = Ne(e, "required", 7, !1), p = Ne(e, "checked", 15, !1), b = Ne(e, "value", 7, "on"), m = Ne(e, "name", 7, void 0), v = Ne(e, "type", 7, "button"), T = Ne(e, "onCheckedChange", 7, co), A = Eo(e, [
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
  const $ = ll.create({
    checked: Ft(() => p(), (F) => {
      p(F), T()?.(F);
    }),
    disabled: Ft(() => d() ?? !1),
    required: Ft(() => h()),
    value: Ft(() => b()),
    name: Ft(() => m()),
    id: Ft(() => c()),
    ref: Ft(() => a(), (F) => a(F))
  }), L = Ee(() => _o(A, $.props, { type: v() }));
  var P = {
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
    set id(F = ls(t)) {
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
      return p();
    },
    set checked(F = !1) {
      p(F), Re();
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
    set onCheckedChange(F = co) {
      T(F), Re();
    }
  }, B = fg(), te = dt(B);
  {
    var oe = (F) => {
      var U = Pt(), S = dt(U);
      {
        let k = Ee(() => ({ props: y(L), ...$.snippetProps }));
        Ur(S, r, () => y(k));
      }
      fe(F, U);
    }, Y = (F) => {
      var U = hg();
      xo(U, () => ({ ...y(L) }));
      var S = R(U);
      Ur(S, () => i() ?? Oi, () => $.snippetProps), O(U), fe(F, U);
    };
    gt(te, (F) => {
      r() ? F(oe) : F(Y, -1);
    });
  }
  var ee = se(te, 2);
  return bd(ee, {}), fe(n, B), nr(P);
}
rr(
  Jr,
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
var pg = qe("<span><!></span>");
function es(n, e) {
  const t = So();
  tr(e, !0);
  let r = Ne(e, "child", 7), i = Ne(e, "children", 7), a = Ne(e, "ref", 15, null), c = Ne(e, "id", 23, () => ls(t)), d = Eo(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "child",
    "children",
    "ref",
    "id"
  ]);
  const h = dl.create({
    id: Ft(() => c()),
    ref: Ft(() => a(), ($) => a($))
  }), p = Ee(() => _o(d, h.props));
  var b = {
    get child() {
      return r();
    },
    set child($) {
      r($), Re();
    },
    get children() {
      return i();
    },
    set children($) {
      i($), Re();
    },
    get ref() {
      return a();
    },
    set ref($ = null) {
      a($), Re();
    },
    get id() {
      return c();
    },
    set id($ = ls(t)) {
      c($), Re();
    }
  }, m = Pt(), v = dt(m);
  {
    var T = ($) => {
      var L = Pt(), P = dt(L);
      {
        let B = Ee(() => ({ props: y(p), ...h.snippetProps }));
        Ur(P, r, () => y(B));
      }
      fe($, L);
    }, A = ($) => {
      var L = pg();
      xo(L, () => ({ ...y(p) }));
      var P = R(L);
      Ur(P, () => i() ?? Oi, () => h.snippetProps), O(L), fe($, L);
    };
    gt(v, ($) => {
      r() ? $(T) : $(A, -1);
    });
  }
  return fe(n, m), nr(b);
}
rr(es, { child: {}, children: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var gg = { 203: (n, e) => {
  function t(S) {
    if (!Number.isSafeInteger(S)) throw new Error(`Wrong integer: ${S}`);
  }
  function r(...S) {
    const k = (V, X) => (K) => V(X(K)), x = Array.from(S).reverse().reduce(((V, X) => V ? k(V, X.encode) : X.encode), void 0), H = S.reduce(((V, X) => V ? k(V, X.decode) : X.decode), void 0);
    return { encode: x, decode: H };
  }
  function i(S) {
    return { encode: (k) => {
      if (!Array.isArray(k) || k.length && typeof k[0] != "number") throw new Error("alphabet.encode input should be an array of numbers");
      return k.map(((x) => {
        if (t(x), x < 0 || x >= S.length) throw new Error(`Digit index outside alphabet: ${x} (alphabet: ${S.length})`);
        return S[x];
      }));
    }, decode: (k) => {
      if (!Array.isArray(k) || k.length && typeof k[0] != "string") throw new Error("alphabet.decode input should be array of strings");
      return k.map(((x) => {
        if (typeof x != "string") throw new Error(`alphabet.decode: not string element=${x}`);
        const H = S.indexOf(x);
        if (H === -1) throw new Error(`Unknown letter: "${x}". Allowed: ${S}`);
        return H;
      }));
    } };
  }
  function a(S = "") {
    if (typeof S != "string") throw new Error("join separator should be string");
    return { encode: (k) => {
      if (!Array.isArray(k) || k.length && typeof k[0] != "string") throw new Error("join.encode input should be array of strings");
      for (let x of k) if (typeof x != "string") throw new Error(`join.encode: non-string input=${x}`);
      return k.join(S);
    }, decode: (k) => {
      if (typeof k != "string") throw new Error("join.decode input should be string");
      return k.split(S);
    } };
  }
  function c(S, k = "=") {
    if (t(S), typeof k != "string") throw new Error("padding chr should be string");
    return { encode(x) {
      if (!Array.isArray(x) || x.length && typeof x[0] != "string") throw new Error("padding.encode input should be array of strings");
      for (let H of x) if (typeof H != "string") throw new Error(`padding.encode: non-string input=${H}`);
      for (; x.length * S % 8; ) x.push(k);
      return x;
    }, decode(x) {
      if (!Array.isArray(x) || x.length && typeof x[0] != "string") throw new Error("padding.encode input should be array of strings");
      for (let V of x) if (typeof V != "string") throw new Error(`padding.decode: non-string input=${V}`);
      let H = x.length;
      if (H * S % 8) throw new Error("Invalid padding: string should have whole number of bytes");
      for (; H > 0 && x[H - 1] === k; H--) if (!((H - 1) * S % 8)) throw new Error("Invalid padding: string has too much padding");
      return x.slice(0, H);
    } };
  }
  function d(S) {
    if (typeof S != "function") throw new Error("normalize fn should be function");
    return { encode: (k) => k, decode: (k) => S(k) };
  }
  function h(S, k, x) {
    if (k < 2) throw new Error(`convertRadix: wrong from=${k}, base cannot be less than 2`);
    if (x < 2) throw new Error(`convertRadix: wrong to=${x}, base cannot be less than 2`);
    if (!Array.isArray(S)) throw new Error("convertRadix: data should be array");
    if (!S.length) return [];
    let H = 0;
    const V = [], X = Array.from(S);
    for (X.forEach(((K) => {
      if (t(K), K < 0 || K >= k) throw new Error(`Wrong integer: ${K}`);
    })); ; ) {
      let K = 0, re = !0;
      for (let de = H; de < X.length; de++) {
        const ve = X[de], ce = k * K + ve;
        if (!Number.isSafeInteger(ce) || k * K / k !== K || ce - ve != k * K) throw new Error("convertRadix: carry overflow");
        if (K = ce % x, X[de] = Math.floor(ce / x), !Number.isSafeInteger(X[de]) || X[de] * x + K !== ce) throw new Error("convertRadix: carry overflow");
        re && (X[de] ? re = !1 : H = de);
      }
      if (V.push(K), re) break;
    }
    for (let K = 0; K < S.length - 1 && S[K] === 0; K++) V.push(0);
    return V.reverse();
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), e.bytes = e.stringToBytes = e.str = e.bytesToString = e.hex = e.utf8 = e.bech32m = e.bech32 = e.base58check = e.base58xmr = e.base58xrp = e.base58flickr = e.base58 = e.base64url = e.base64 = e.base32crockford = e.base32hex = e.base32 = e.base16 = e.utils = e.assertNumber = void 0, e.assertNumber = t;
  const p = (S, k) => k ? p(k, S % k) : S, b = (S, k) => S + (k - p(S, k));
  function m(S, k, x, H) {
    if (!Array.isArray(S)) throw new Error("convertRadix2: data should be array");
    if (k <= 0 || k > 32) throw new Error(`convertRadix2: wrong from=${k}`);
    if (x <= 0 || x > 32) throw new Error(`convertRadix2: wrong to=${x}`);
    if (b(k, x) > 32) throw new Error(`convertRadix2: carry overflow from=${k} to=${x} carryBits=${b(k, x)}`);
    let V = 0, X = 0;
    const K = 2 ** x - 1, re = [];
    for (const de of S) {
      if (t(de), de >= 2 ** k) throw new Error(`convertRadix2: invalid data word=${de} from=${k}`);
      if (V = V << k | de, X + k > 32) throw new Error(`convertRadix2: carry overflow pos=${X} from=${k}`);
      for (X += k; X >= x; X -= x) re.push((V >> X - x & K) >>> 0);
      V &= 2 ** X - 1;
    }
    if (V = V << x - X & K, !H && X >= k) throw new Error("Excess padding");
    if (!H && V) throw new Error(`Non-zero padding: ${V}`);
    return H && X > 0 && re.push(V >>> 0), re;
  }
  function v(S) {
    return t(S), { encode: (k) => {
      if (!(k instanceof Uint8Array)) throw new Error("radix.encode input should be Uint8Array");
      return h(Array.from(k), 256, S);
    }, decode: (k) => {
      if (!Array.isArray(k) || k.length && typeof k[0] != "number") throw new Error("radix.decode input should be array of strings");
      return Uint8Array.from(h(k, S, 256));
    } };
  }
  function T(S, k = !1) {
    if (t(S), S <= 0 || S > 32) throw new Error("radix2: bits should be in (0..32]");
    if (b(8, S) > 32 || b(S, 8) > 32) throw new Error("radix2: carry overflow");
    return { encode: (x) => {
      if (!(x instanceof Uint8Array)) throw new Error("radix2.encode input should be Uint8Array");
      return m(Array.from(x), 8, S, !k);
    }, decode: (x) => {
      if (!Array.isArray(x) || x.length && typeof x[0] != "number") throw new Error("radix2.decode input should be array of strings");
      return Uint8Array.from(m(x, S, 8, k));
    } };
  }
  function A(S) {
    if (typeof S != "function") throw new Error("unsafeWrapper fn should be function");
    return function(...k) {
      try {
        return S.apply(null, k);
      } catch {
      }
    };
  }
  function $(S, k) {
    if (t(S), typeof k != "function") throw new Error("checksum fn should be function");
    return { encode(x) {
      if (!(x instanceof Uint8Array)) throw new Error("checksum.encode: input should be Uint8Array");
      const H = k(x).slice(0, S), V = new Uint8Array(x.length + S);
      return V.set(x), V.set(H, x.length), V;
    }, decode(x) {
      if (!(x instanceof Uint8Array)) throw new Error("checksum.decode: input should be Uint8Array");
      const H = x.slice(0, -S), V = k(H).slice(0, S), X = x.slice(-S);
      for (let K = 0; K < S; K++) if (V[K] !== X[K]) throw new Error("Invalid checksum");
      return H;
    } };
  }
  e.utils = { alphabet: i, chain: r, checksum: $, radix: v, radix2: T, join: a, padding: c }, e.base16 = r(T(4), i("0123456789ABCDEF"), a("")), e.base32 = r(T(5), i("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), c(5), a("")), e.base32hex = r(T(5), i("0123456789ABCDEFGHIJKLMNOPQRSTUV"), c(5), a("")), e.base32crockford = r(T(5), i("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), a(""), d(((S) => S.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")))), e.base64 = r(T(6), i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), c(6), a("")), e.base64url = r(T(6), i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), c(6), a(""));
  const L = (S) => r(v(58), i(S), a(""));
  e.base58 = L("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"), e.base58flickr = L("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), e.base58xrp = L("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
  const P = [0, 2, 3, 5, 6, 7, 9, 10, 11];
  e.base58xmr = { encode(S) {
    let k = "";
    for (let x = 0; x < S.length; x += 8) {
      const H = S.subarray(x, x + 8);
      k += e.base58.encode(H).padStart(P[H.length], "1");
    }
    return k;
  }, decode(S) {
    let k = [];
    for (let x = 0; x < S.length; x += 11) {
      const H = S.slice(x, x + 11), V = P.indexOf(H.length), X = e.base58.decode(H);
      for (let K = 0; K < X.length - V; K++) if (X[K] !== 0) throw new Error("base58xmr: wrong padding");
      k = k.concat(Array.from(X.slice(X.length - V)));
    }
    return Uint8Array.from(k);
  } }, e.base58check = (S) => r($(4, ((k) => S(S(k)))), e.base58);
  const B = r(i("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), a("")), te = [996825010, 642813549, 513874426, 1027748829, 705979059];
  function oe(S) {
    const k = S >> 25;
    let x = (33554431 & S) << 5;
    for (let H = 0; H < te.length; H++) (k >> H & 1) == 1 && (x ^= te[H]);
    return x;
  }
  function Y(S, k, x = 1) {
    const H = S.length;
    let V = 1;
    for (let X = 0; X < H; X++) {
      const K = S.charCodeAt(X);
      if (K < 33 || K > 126) throw new Error(`Invalid prefix (${S})`);
      V = oe(V) ^ K >> 5;
    }
    V = oe(V);
    for (let X = 0; X < H; X++) V = oe(V) ^ 31 & S.charCodeAt(X);
    for (let X of k) V = oe(V) ^ X;
    for (let X = 0; X < 6; X++) V = oe(V);
    return V ^= x, B.encode(m([V % 2 ** 30], 30, 5, !1));
  }
  function ee(S) {
    const k = S === "bech32" ? 1 : 734539939, x = T(5), H = x.decode, V = x.encode, X = A(H);
    function K(re, de = 90) {
      if (typeof re != "string") throw new Error("bech32.decode input should be string, not " + typeof re);
      if (re.length < 8 || de !== !1 && re.length > de) throw new TypeError(`Wrong string length: ${re.length} (${re}). Expected (8..${de})`);
      const ve = re.toLowerCase();
      if (re !== ve && re !== re.toUpperCase()) throw new Error("String must be lowercase or uppercase");
      const ce = (re = ve).lastIndexOf("1");
      if (ce === 0 || ce === -1) throw new Error('Letter "1" must be present between prefix and data only');
      const $e = re.slice(0, ce), we = re.slice(ce + 1);
      if (we.length < 6) throw new Error("Data must be at least 6 characters long");
      const Le = B.decode(we).slice(0, -6), Ge = Y($e, Le, k);
      if (!we.endsWith(Ge)) throw new Error(`Invalid checksum in ${re}: expected "${Ge}"`);
      return { prefix: $e, words: Le };
    }
    return { encode: function(re, de, ve = 90) {
      if (typeof re != "string") throw new Error("bech32.encode prefix should be string, not " + typeof re);
      if (!Array.isArray(de) || de.length && typeof de[0] != "number") throw new Error("bech32.encode words should be array of numbers, not " + typeof de);
      const ce = re.length + 7 + de.length;
      if (ve !== !1 && ce > ve) throw new TypeError(`Length ${ce} exceeds limit ${ve}`);
      return `${re = re.toLowerCase()}1${B.encode(de)}${Y(re, de, k)}`;
    }, decode: K, decodeToBytes: function(re) {
      const { prefix: de, words: ve } = K(re, !1);
      return { prefix: de, words: ve, bytes: H(ve) };
    }, decodeUnsafe: A(K), fromWords: H, fromWordsUnsafe: X, toWords: V };
  }
  e.bech32 = ee("bech32"), e.bech32m = ee("bech32m"), e.utf8 = { encode: (S) => new TextDecoder().decode(S), decode: (S) => new TextEncoder().encode(S) }, e.hex = r(T(4), i("0123456789abcdef"), a(""), d(((S) => {
    if (typeof S != "string" || S.length % 2) throw new TypeError(`hex.decode: expected string, got ${typeof S} with length ${S.length}`);
    return S.toLowerCase();
  })));
  const F = { utf8: e.utf8, hex: e.hex, base16: e.base16, base32: e.base32, base64: e.base64, base64url: e.base64url, base58: e.base58, base58xmr: e.base58xmr }, U = `Invalid encoding type. Available types: ${Object.keys(F).join(", ")}`;
  e.bytesToString = (S, k) => {
    if (typeof S != "string" || !F.hasOwnProperty(S)) throw new TypeError(U);
    if (!(k instanceof Uint8Array)) throw new TypeError("bytesToString() expects Uint8Array");
    return F[S].encode(k);
  }, e.str = e.bytesToString, e.stringToBytes = (S, k) => {
    if (!F.hasOwnProperty(S)) throw new TypeError(U);
    if (typeof k != "string") throw new TypeError("stringToBytes() expects string");
    return F[S].decode(k);
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
  t.r(e), t.d(e, { default: () => p });
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
  const p = h;
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
      if (a) for (var p = 0; p < this.length; p++) {
        var b = this[p][0];
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
  const { bech32: r, hex: i, utf8: a } = t(203), c = { bech32: "bc", pubKeyHash: 0, scriptHash: 5, validWitnessVersions: [0] }, d = { bech32: "tb", pubKeyHash: 111, scriptHash: 196, validWitnessVersions: [0] }, h = { bech32: "tbs", pubKeyHash: 111, scriptHash: 196, validWitnessVersions: [0] }, p = { bech32: "bcrt", pubKeyHash: 111, scriptHash: 196, validWitnessVersions: [0] }, b = { bech32: "sb", pubKeyHash: 63, scriptHash: 123, validWitnessVersions: [0] }, m = ["option_data_loss_protect", "initial_routing_sync", "option_upfront_shutdown_script", "gossip_queries", "var_onion_optin", "gossip_queries_ex", "option_static_remotekey", "payment_secret", "basic_mpp", "option_support_large_channel"], v = { m: BigInt(1e3), u: BigInt(1e6), n: BigInt(1e9), p: BigInt(1e12) }, T = BigInt("2100000000000000000"), A = BigInt(1e11), $ = { payment_hash: 1, payment_secret: 16, description: 13, payee: 19, description_hash: 23, expiry: 6, min_final_cltv_expiry: 24, fallback_address: 9, route_hint: 3, feature_bits: 5, metadata: 27 }, L = {};
  for (let Y = 0, ee = Object.keys($); Y < ee.length; Y++) {
    const F = ee[Y], U = $[ee[Y]].toString();
    L[U] = F;
  }
  const P = { 1: (Y) => i.encode(r.fromWordsUnsafe(Y)), 16: (Y) => i.encode(r.fromWordsUnsafe(Y)), 13: (Y) => a.encode(r.fromWordsUnsafe(Y)), 19: (Y) => i.encode(r.fromWordsUnsafe(Y)), 23: (Y) => i.encode(r.fromWordsUnsafe(Y)), 27: (Y) => i.encode(r.fromWordsUnsafe(Y)), 6: te, 24: te, 3: function(Y) {
    const ee = [];
    let F, U, S, k, x, H = r.fromWordsUnsafe(Y);
    for (; H.length > 0; ) F = i.encode(H.slice(0, 33)), U = i.encode(H.slice(33, 41)), S = parseInt(i.encode(H.slice(41, 45)), 16), k = parseInt(i.encode(H.slice(45, 49)), 16), x = parseInt(i.encode(H.slice(49, 51)), 16), H = H.slice(51), ee.push({ pubkey: F, short_channel_id: U, fee_base_msat: S, fee_proportional_millionths: k, cltv_expiry_delta: x });
    return ee;
  }, 5: function(Y) {
    const ee = Y.slice().reverse().map(((S) => [!!(1 & S), !!(2 & S), !!(4 & S), !!(8 & S), !!(16 & S)])).reduce(((S, k) => S.concat(k)), []);
    for (; ee.length < 2 * m.length; ) ee.push(!1);
    const F = {};
    m.forEach(((S, k) => {
      let x;
      x = ee[2 * k] ? "required" : ee[2 * k + 1] ? "supported" : "unsupported", F[S] = x;
    }));
    const U = ee.slice(2 * m.length);
    return F.extra_bits = { start_bit: 2 * m.length, bits: U, has_required: U.reduce(((S, k, x) => x % 2 != 0 ? S || !1 : S || k), !1) }, F;
  } };
  function B(Y) {
    return (ee) => ({ tagCode: parseInt(Y), words: r.encode("unknown", ee, Number.MAX_SAFE_INTEGER) });
  }
  function te(Y) {
    return Y.reverse().reduce(((ee, F, U) => ee + F * Math.pow(32, U)), 0);
  }
  function oe(Y, ee) {
    let F, U;
    if (Y.slice(-1).match(/^[munp]$/)) F = Y.slice(-1), U = Y.slice(0, -1);
    else {
      if (Y.slice(-1).match(/^[^munp0-9]$/)) throw new Error("Not a valid multiplier for the amount");
      U = Y;
    }
    if (!U.match(/^\d+$/)) throw new Error("Not a valid human readable amount");
    const S = BigInt(U), k = F ? S * A / v[F] : S * A;
    if (F === "p" && S % BigInt(10) !== BigInt(0) || k > T) throw new Error("Amount is outside of valid range");
    return ee ? k.toString() : k;
  }
  n.exports = { decode: function(Y, ee) {
    if (typeof Y != "string") throw new Error("Lightning Payment Request must be string");
    if (Y.slice(0, 2).toLowerCase() !== "ln") throw new Error("Not a proper lightning payment request");
    const F = [], U = r.decode(Y, Number.MAX_SAFE_INTEGER);
    Y = Y.toLowerCase();
    const S = U.prefix;
    let k = U.words, x = Y.slice(S.length + 1), H = k.slice(-104);
    k = k.slice(0, -104);
    let V = S.match(/^ln(\S+?)(\d*)([a-zA-Z]?)$/);
    if (V && !V[2] && (V = S.match(/^ln(\S+)$/)), !V) throw new Error("Not a proper lightning payment request");
    F.push({ name: "lightning_network", letters: "ln" });
    const X = V[1];
    let K;
    if (ee) {
      if (ee.bech32 === void 0 || ee.pubKeyHash === void 0 || ee.scriptHash === void 0 || !Array.isArray(ee.validWitnessVersions)) throw new Error("Invalid network");
      K = ee;
    } else switch (X) {
      case c.bech32:
        K = c;
        break;
      case d.bech32:
        K = d;
        break;
      case h.bech32:
        K = h;
        break;
      case p.bech32:
        K = p;
        break;
      case b.bech32:
        K = b;
    }
    if (!K || K.bech32 !== X) throw new Error("Unknown coin bech32 prefix");
    F.push({ name: "coin_network", letters: X, value: K });
    const re = V[2];
    let de;
    re ? (de = oe(re + V[3], !0), F.push({ name: "amount", letters: V[2] + V[3], value: de })) : de = null, F.push({ name: "separator", letters: "1" });
    const ve = te(k.slice(0, 7));
    let ce, $e, we, Le;
    for (k = k.slice(7), F.push({ name: "timestamp", letters: x.slice(0, 7), value: ve }), x = x.slice(7); k.length > 0; ) {
      const De = k[0].toString();
      ce = L[De] || "unknown_tag", $e = P[De] || B(De), k = k.slice(1), we = te(k.slice(0, 2)), k = k.slice(2), Le = k.slice(0, we), k = k.slice(we), F.push({ name: ce, tag: x[0], letters: x.slice(0, 3 + we), value: $e(Le) }), x = x.slice(3 + we);
    }
    F.push({ name: "signature", letters: x.slice(0, 104), value: i.encode(r.fromWordsUnsafe(H)) }), x = x.slice(104), F.push({ name: "checksum", letters: x });
    let Ge = { paymentRequest: Y, sections: F, get expiry() {
      let De = F.find(((Pe) => Pe.name === "expiry"));
      if (De) return Xe("timestamp") + De.value;
    }, get route_hints() {
      return F.filter(((De) => De.name === "route_hint")).map(((De) => De.value));
    } };
    for (let De in $) De !== "route_hint" && Object.defineProperty(Ge, De, { get: () => Xe(De) });
    return Ge;
    function Xe(De) {
      let Pe = F.find(((nt) => nt.name === De));
      return Pe ? Pe.value : void 0;
    }
  }, hrpToMillisat: oe };
}, 0: (n, e, t) => {
  var r = t(540);
  r && r.__esModule && (r = r.default), n.exports = typeof r == "string" ? r : r.toString();
} }, Nc = {};
function bn(n) {
  var e = Nc[n];
  if (e !== void 0) return e.exports;
  var t = Nc[n] = { id: n, exports: {} };
  return gg[n](t, t.exports, bn), t.exports;
}
bn.n = (n) => {
  var e = n && n.__esModule ? () => n.default : () => n;
  return bn.d(e, { a: e }), e;
}, bn.d = (n, e) => {
  for (var t in e) bn.o(e, t) && !bn.o(n, t) && Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
}, bn.o = (n, e) => Object.prototype.hasOwnProperty.call(n, e), bn.r = (n) => {
  typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
};
var Er = {};
bn.d(Er, { vQ: () => Qe, ZM: () => Ti, yk: () => Ue, h0: () => $s, n_: () => Dh, Xz: () => c1, Uv: () => Li, fU: () => Di, Dw: () => wr });
var Fa = {};
bn.r(Fa), bn.d(Fa, { OG: () => pl, My: () => qs, Ph: () => Nn, lX: () => hl, Id: () => ks, fg: () => Ed, qj: () => vn, aT: () => Ai, lq: () => os, z: () => fl, Q5: () => Si });
var Za = {};
bn.r(Za), bn.d(Za, { Relay: () => Ou, SimplePool: () => Lv, finalizeEvent: () => sr, fj: () => Au, generateSecretKey: () => uu, getEventHash: () => Ei, getFilterLimit: () => Ev, getPublicKey: () => kl, kinds: () => hu, matchFilter: () => $u, matchFilters: () => ku, mergeFilters: () => _v, nip04: () => Mu, nip05: () => Pu, nip10: () => Hu, nip11: () => qu, nip13: () => ju, nip18: () => Vu, nip19: () => Nu, nip21: () => Wu, nip25: () => Ku, nip27: () => Qu, nip28: () => Yu, nip30: () => Xu, nip39: () => eh, nip42: () => Iu, nip44: () => th, nip47: () => oh, nip57: () => ah, nip59: () => lh, nip98: () => bh, parseReferences: () => zv, serializeEvent: () => du, sortEvents: () => o0, utils: () => au, validateEvent: () => No, verifiedSymbol: () => ns, verifyEvent: () => Ys });
var vg = bn(705);
function Rc(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`Wrong positive integer: ${n}`);
}
function md(n, ...e) {
  if (!(n instanceof Uint8Array)) throw new Error("Expected Uint8Array");
  if (e.length > 0 && !e.includes(n.length)) throw new Error(`Expected Uint8Array of length ${e}, not of length=${n.length}`);
}
function bg(n) {
  if (typeof n != "function" || typeof n.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Rc(n.outputLen), Rc(n.blockLen);
}
function ho(n, e = !0) {
  if (n.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && n.finished) throw new Error("Hash#digest() has already been called");
}
function mg(n, e) {
  md(n);
  const t = e.outputLen;
  if (n.length < t) throw new Error(`digestInto() expects output buffer of length at least ${t}`);
}
const Aa = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0, yd = (n) => n instanceof Uint8Array, Sa = (n) => new DataView(n.buffer, n.byteOffset, n.byteLength), fr = (n, e) => n << 32 - e | n >>> e;
if (new Uint8Array(new Uint32Array([287454020]).buffer)[0] !== 68) throw new Error("Non little-endian hardware is not supported");
function ul(n) {
  if (typeof n == "string" && (n = (function(e) {
    if (typeof e != "string") throw new Error("utf8ToBytes expected string, got " + typeof e);
    return new Uint8Array(new TextEncoder().encode(e));
  })(n)), !yd(n)) throw new Error("expected Uint8Array, got " + typeof n);
  return n;
}
class wd {
  clone() {
    return this._cloneInto();
  }
}
function yg(n) {
  const e = (r) => n().update(ul(r)).digest(), t = n();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n(), e;
}
function xd(n = 32) {
  if (Aa && typeof Aa.getRandomValues == "function") return Aa.getRandomValues(new Uint8Array(n));
  throw new Error("crypto.getRandomValues must be defined");
}
class wg extends wd {
  constructor(e, t, r, i) {
    super(), this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Sa(this.buffer);
  }
  update(e) {
    ho(this);
    const { view: t, buffer: r, blockLen: i } = this, a = (e = ul(e)).length;
    for (let c = 0; c < a; ) {
      const d = Math.min(i - this.pos, a - c);
      if (d !== i) r.set(e.subarray(c, c + d), this.pos), this.pos += d, c += d, this.pos === i && (this.process(t, 0), this.pos = 0);
      else {
        const h = Sa(e);
        for (; i <= a - c; c += i) this.process(h, c);
      }
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ho(this), mg(e, this), this.finished = !0;
    const { buffer: t, view: r, blockLen: i, isLE: a } = this;
    let { pos: c } = this;
    t[c++] = 128, this.buffer.subarray(c).fill(0), this.padOffset > i - c && (this.process(r, 0), c = 0);
    for (let m = c; m < i; m++) t[m] = 0;
    (function(m, v, T, A) {
      if (typeof m.setBigUint64 == "function") return m.setBigUint64(v, T, A);
      const $ = BigInt(32), L = BigInt(4294967295), P = Number(T >> $ & L), B = Number(T & L), te = A ? 4 : 0, oe = A ? 0 : 4;
      m.setUint32(v + te, P, A), m.setUint32(v + oe, B, A);
    })(r, i - 8, BigInt(8 * this.length), a), this.process(r, 0);
    const d = Sa(e), h = this.outputLen;
    if (h % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = h / 4, b = this.get();
    if (p > b.length) throw new Error("_sha2: outputLen bigger than state");
    for (let m = 0; m < p; m++) d.setUint32(4 * m, b[m], a);
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
const xg = (n, e, t) => n & e ^ n & t ^ e & t, _g = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), Kr = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), Qr = new Uint32Array(64);
class Eg extends wg {
  constructor() {
    super(64, 32, 8, !1), this.A = 0 | Kr[0], this.B = 0 | Kr[1], this.C = 0 | Kr[2], this.D = 0 | Kr[3], this.E = 0 | Kr[4], this.F = 0 | Kr[5], this.G = 0 | Kr[6], this.H = 0 | Kr[7];
  }
  get() {
    const { A: e, B: t, C: r, D: i, E: a, F: c, G: d, H: h } = this;
    return [e, t, r, i, a, c, d, h];
  }
  set(e, t, r, i, a, c, d, h) {
    this.A = 0 | e, this.B = 0 | t, this.C = 0 | r, this.D = 0 | i, this.E = 0 | a, this.F = 0 | c, this.G = 0 | d, this.H = 0 | h;
  }
  process(e, t) {
    for (let v = 0; v < 16; v++, t += 4) Qr[v] = e.getUint32(t, !1);
    for (let v = 16; v < 64; v++) {
      const T = Qr[v - 15], A = Qr[v - 2], $ = fr(T, 7) ^ fr(T, 18) ^ T >>> 3, L = fr(A, 17) ^ fr(A, 19) ^ A >>> 10;
      Qr[v] = L + Qr[v - 7] + $ + Qr[v - 16] | 0;
    }
    let { A: r, B: i, C: a, D: c, E: d, F: h, G: p, H: b } = this;
    for (let v = 0; v < 64; v++) {
      const T = b + (fr(d, 6) ^ fr(d, 11) ^ fr(d, 25)) + ((m = d) & h ^ ~m & p) + _g[v] + Qr[v] | 0, A = (fr(r, 2) ^ fr(r, 13) ^ fr(r, 22)) + xg(r, i, a) | 0;
      b = p, p = h, h = d, d = c + T | 0, c = a, a = i, i = r, r = T + A | 0;
    }
    var m;
    r = r + this.A | 0, i = i + this.B | 0, a = a + this.C | 0, c = c + this.D | 0, d = d + this.E | 0, h = h + this.F | 0, p = p + this.G | 0, b = b + this.H | 0, this.set(r, i, a, c, d, h, p, b);
  }
  roundClean() {
    Qr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
const Va = yg((() => new Eg())), $g = (BigInt(0), BigInt(1)), kg = BigInt(2), Co = (n) => n instanceof Uint8Array, Ag = Array.from({ length: 256 }, ((n, e) => e.toString(16).padStart(2, "0")));
function qs(n) {
  if (!Co(n)) throw new Error("Uint8Array expected");
  let e = "";
  for (let t = 0; t < n.length; t++) e += Ag[n[t]];
  return e;
}
function _d(n) {
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
function Nn(n) {
  return _d(qs(n));
}
function hl(n) {
  if (!Co(n)) throw new Error("Uint8Array expected");
  return _d(qs(Uint8Array.from(n).reverse()));
}
function os(n, e) {
  return Ai(n.toString(16).padStart(2 * e, "0"));
}
function fl(n, e) {
  return os(n, e).reverse();
}
function vn(n, e, t) {
  let r;
  if (typeof e == "string") try {
    r = Ai(e);
  } catch (a) {
    throw new Error(`${n} must be valid hex string, got "${e}". Cause: ${a}`);
  }
  else {
    if (!Co(e)) throw new Error(`${n} must be hex string or Uint8Array`);
    r = Uint8Array.from(e);
  }
  const i = r.length;
  if (typeof t == "number" && i !== t) throw new Error(`${n} expected ${t} bytes, got ${i}`);
  return r;
}
function ks(...n) {
  const e = new Uint8Array(n.reduce(((r, i) => r + i.length), 0));
  let t = 0;
  return n.forEach(((r) => {
    if (!Co(r)) throw new Error("Uint8Array expected");
    e.set(r, t), t += r.length;
  })), e;
}
const pl = (n) => (kg << BigInt(n - 1)) - $g, Ca = (n) => new Uint8Array(n), Mc = (n) => Uint8Array.from(n);
function Ed(n, e, t) {
  if (typeof n != "number" || n < 2) throw new Error("hashLen must be a number");
  if (typeof e != "number" || e < 2) throw new Error("qByteLen must be a number");
  if (typeof t != "function") throw new Error("hmacFn must be a function");
  let r = Ca(n), i = Ca(n), a = 0;
  const c = () => {
    r.fill(1), i.fill(0), a = 0;
  }, d = (...b) => t(i, r, ...b), h = (b = Ca()) => {
    i = d(Mc([0]), b), r = d(), b.length !== 0 && (i = d(Mc([1]), b), r = d());
  }, p = () => {
    if (a++ >= 1e3) throw new Error("drbg: tried 1000 values");
    let b = 0;
    const m = [];
    for (; b < e; ) {
      r = d();
      const v = r.slice();
      m.push(v), b += r.length;
    }
    return ks(...m);
  };
  return (b, m) => {
    let v;
    for (c(), h(b); !(v = m(p())); ) h();
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
const sn = BigInt(0), Kt = BigInt(1), xs = BigInt(2), Cg = BigInt(3), Ia = BigInt(4), Bc = BigInt(5), Uc = BigInt(8);
BigInt(9), BigInt(16);
function hn(n, e) {
  const t = n % e;
  return t >= sn ? t : e + t;
}
function Ig(n, e, t) {
  if (t <= sn || e < sn) throw new Error("Expected power/modulo > 0");
  if (t === Kt) return sn;
  let r = Kt;
  for (; e > sn; ) e & Kt && (r = r * n % t), n = n * n % t, e >>= Kt;
  return r;
}
function Gn(n, e, t) {
  let r = n;
  for (; e-- > sn; ) r *= r, r %= t;
  return r;
}
function Ga(n, e) {
  if (n === sn || e <= sn) throw new Error(`invert: expected positive integers, got n=${n} mod=${e}`);
  let t = hn(n, e), r = e, i = sn, a = Kt;
  for (; t !== sn; ) {
    const c = r / t, d = r % t, h = i - a * c;
    r = t, t = d, i = a, a = h;
  }
  if (r !== Kt) throw new Error("invert: does not exist");
  return hn(i, e);
}
function Tg(n) {
  if (n % Ia === Cg) {
    const e = (n + Kt) / Ia;
    return function(t, r) {
      const i = t.pow(r, e);
      if (!t.eql(t.sqr(i), r)) throw new Error("Cannot find square root");
      return i;
    };
  }
  if (n % Uc === Bc) {
    const e = (n - Bc) / Uc;
    return function(t, r) {
      const i = t.mul(r, xs), a = t.pow(i, e), c = t.mul(r, a), d = t.mul(t.mul(c, xs), a), h = t.mul(c, t.sub(d, t.ONE));
      if (!t.eql(t.sqr(h), r)) throw new Error("Cannot find square root");
      return h;
    };
  }
  return (function(e) {
    const t = (e - Kt) / xs;
    let r, i, a;
    for (r = e - Kt, i = 0; r % xs === sn; r /= xs, i++) ;
    for (a = xs; a < e && Ig(a, t, e) !== e - Kt; a++) ;
    if (i === 1) {
      const d = (e + Kt) / Ia;
      return function(h, p) {
        const b = h.pow(p, d);
        if (!h.eql(h.sqr(b), p)) throw new Error("Cannot find square root");
        return b;
      };
    }
    const c = (r + Kt) / xs;
    return function(d, h) {
      if (d.pow(h, t) === d.neg(d.ONE)) throw new Error("Cannot find square root");
      let p = i, b = d.pow(d.mul(d.ONE, a), r), m = d.pow(h, c), v = d.pow(h, r);
      for (; !d.eql(v, d.ONE); ) {
        if (d.eql(v, d.ZERO)) return d.ZERO;
        let T = 1;
        for (let $ = d.sqr(v); T < p && !d.eql($, d.ONE); T++) $ = d.sqr($);
        const A = d.pow(b, Kt << BigInt(p - T - 1));
        b = d.sqr(A), m = d.mul(m, A), v = d.mul(v, b), p = T;
      }
      return m;
    };
  })(n);
}
const Lg = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];
function $d(n, e) {
  const t = e !== void 0 ? e : n.toString(2).length;
  return { nBitLength: t, nByteLength: Math.ceil(t / 8) };
}
function kd(n) {
  if (typeof n != "bigint") throw new Error("field order must be bigint");
  const e = n.toString(2).length;
  return Math.ceil(e / 8);
}
function Pc(n) {
  const e = kd(n);
  return e + Math.ceil(e / 2);
}
class Ad extends wd {
  constructor(e, t) {
    super(), this.finished = !1, this.destroyed = !1, bg(e);
    const r = ul(t);
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
    return ho(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ho(this), md(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Sd = (n, e, t) => new Ad(n, e).update(t).digest();
Sd.create = (n, e) => new Ad(n, e);
const Dg = BigInt(0), Ta = BigInt(1);
function Cd(n) {
  return Si(n.Fp, Lg.reduce(((e, t) => (e[t] = "function", e)), { ORDER: "bigint", MASK: "bigint", BYTES: "isSafeInteger", BITS: "isSafeInteger" })), Si(n, { n: "bigint", h: "bigint", Gx: "field", Gy: "field" }, { nBitLength: "isSafeInteger", nByteLength: "isSafeInteger" }), Object.freeze({ ...$d(n.n, n.nBitLength), ...n, p: n.Fp.ORDER });
}
const { Ph: Og, aT: Ng } = Fa, Es = { Err: class extends Error {
  constructor(n = "") {
    super(n);
  }
}, _parseInt(n) {
  const { Err: e } = Es;
  if (n.length < 2 || n[0] !== 2) throw new e("Invalid signature integer tag");
  const t = n[1], r = n.subarray(2, t + 2);
  if (!t || r.length !== t) throw new e("Invalid signature integer: wrong length");
  if (128 & r[0]) throw new e("Invalid signature integer: negative");
  if (r[0] === 0 && !(128 & r[1])) throw new e("Invalid signature integer: unnecessary leading zero");
  return { d: Og(r), l: n.subarray(t + 2) };
}, toSig(n) {
  const { Err: e } = Es, t = typeof n == "string" ? Ng(n) : n;
  if (!(t instanceof Uint8Array)) throw new Error("ui8a expected");
  let r = t.length;
  if (r < 2 || t[0] != 48) throw new e("Invalid signature tag");
  if (t[1] !== r - 2) throw new e("Invalid signature: incorrect length");
  const { d: i, l: a } = Es._parseInt(t.subarray(2)), { d: c, l: d } = Es._parseInt(a);
  if (d.length) throw new e("Invalid signature: left bytes after parsing");
  return { r: i, s: c };
}, hexFromSig(n) {
  const e = (p) => 8 & Number.parseInt(p[0], 16) ? "00" + p : p, t = (p) => {
    const b = p.toString(16);
    return 1 & b.length ? `0${b}` : b;
  }, r = e(t(n.s)), i = e(t(n.r)), a = r.length / 2, c = i.length / 2, d = t(a), h = t(c);
  return `30${t(c + a + 4)}02${h}${i}02${d}${r}`;
} }, Lr = BigInt(0), Wn = BigInt(1), zc = (BigInt(2), BigInt(3));
BigInt(4);
function Rg(n) {
  const e = (function(A) {
    const $ = Cd(A);
    Si($, { a: "field", b: "field" }, { allowedPrivateKeyLengths: "array", wrapPrivateKey: "boolean", isTorsionFree: "function", clearCofactor: "function", allowInfinityPoint: "boolean", fromBytes: "function", toBytes: "function" });
    const { endo: L, Fp: P, a: B } = $;
    if (L) {
      if (!P.eql(B, P.ZERO)) throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
      if (typeof L != "object" || typeof L.beta != "bigint" || typeof L.splitScalar != "function") throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
    }
    return Object.freeze({ ...$ });
  })(n), { Fp: t } = e, r = e.toBytes || ((A, $, L) => {
    const P = $.toAffine();
    return ks(Uint8Array.from([4]), t.toBytes(P.x), t.toBytes(P.y));
  }), i = e.fromBytes || ((A) => {
    const $ = A.subarray(1);
    return { x: t.fromBytes($.subarray(0, t.BYTES)), y: t.fromBytes($.subarray(t.BYTES, 2 * t.BYTES)) };
  });
  function a(A) {
    const { a: $, b: L } = e, P = t.sqr(A), B = t.mul(P, A);
    return t.add(t.add(B, t.mul(A, $)), L);
  }
  if (!t.eql(t.sqr(e.Gy), a(e.Gx))) throw new Error("bad generator point: equation left != right");
  function c(A) {
    return typeof A == "bigint" && Lr < A && A < e.n;
  }
  function d(A) {
    if (!c(A)) throw new Error("Expected valid bigint: 0 < bigint < curve.n");
  }
  function h(A) {
    const { allowedPrivateKeyLengths: $, nByteLength: L, wrapPrivateKey: P, n: B } = e;
    if ($ && typeof A != "bigint") {
      if (A instanceof Uint8Array && (A = qs(A)), typeof A != "string" || !$.includes(A.length)) throw new Error("Invalid key");
      A = A.padStart(2 * L, "0");
    }
    let te;
    try {
      te = typeof A == "bigint" ? A : Nn(vn("private key", A, L));
    } catch {
      throw new Error(`private key must be ${L} bytes, hex or bigint, not ${typeof A}`);
    }
    return P && (te = hn(te, B)), d(te), te;
  }
  const p = /* @__PURE__ */ new Map();
  function b(A) {
    if (!(A instanceof m)) throw new Error("ProjectivePoint expected");
  }
  class m {
    constructor($, L, P) {
      if (this.px = $, this.py = L, this.pz = P, $ == null || !t.isValid($)) throw new Error("x required");
      if (L == null || !t.isValid(L)) throw new Error("y required");
      if (P == null || !t.isValid(P)) throw new Error("z required");
    }
    static fromAffine($) {
      const { x: L, y: P } = $ || {};
      if (!$ || !t.isValid(L) || !t.isValid(P)) throw new Error("invalid affine point");
      if ($ instanceof m) throw new Error("projective point not allowed");
      const B = (te) => t.eql(te, t.ZERO);
      return B(L) && B(P) ? m.ZERO : new m(L, P, t.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static normalizeZ($) {
      const L = t.invertBatch($.map(((P) => P.pz)));
      return $.map(((P, B) => P.toAffine(L[B]))).map(m.fromAffine);
    }
    static fromHex($) {
      const L = m.fromAffine(i(vn("pointHex", $)));
      return L.assertValidity(), L;
    }
    static fromPrivateKey($) {
      return m.BASE.multiply(h($));
    }
    _setWindowSize($) {
      this._WINDOW_SIZE = $, p.delete(this);
    }
    assertValidity() {
      if (this.is0()) {
        if (e.allowInfinityPoint && !t.is0(this.py)) return;
        throw new Error("bad point: ZERO");
      }
      const { x: $, y: L } = this.toAffine();
      if (!t.isValid($) || !t.isValid(L)) throw new Error("bad point: x or y not FE");
      const P = t.sqr(L), B = a($);
      if (!t.eql(P, B)) throw new Error("bad point: equation left != right");
      if (!this.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
    }
    hasEvenY() {
      const { y: $ } = this.toAffine();
      if (t.isOdd) return !t.isOdd($);
      throw new Error("Field doesn't support isOdd");
    }
    equals($) {
      b($);
      const { px: L, py: P, pz: B } = this, { px: te, py: oe, pz: Y } = $, ee = t.eql(t.mul(L, Y), t.mul(te, B)), F = t.eql(t.mul(P, Y), t.mul(oe, B));
      return ee && F;
    }
    negate() {
      return new m(this.px, t.neg(this.py), this.pz);
    }
    double() {
      const { a: $, b: L } = e, P = t.mul(L, zc), { px: B, py: te, pz: oe } = this;
      let Y = t.ZERO, ee = t.ZERO, F = t.ZERO, U = t.mul(B, B), S = t.mul(te, te), k = t.mul(oe, oe), x = t.mul(B, te);
      return x = t.add(x, x), F = t.mul(B, oe), F = t.add(F, F), Y = t.mul($, F), ee = t.mul(P, k), ee = t.add(Y, ee), Y = t.sub(S, ee), ee = t.add(S, ee), ee = t.mul(Y, ee), Y = t.mul(x, Y), F = t.mul(P, F), k = t.mul($, k), x = t.sub(U, k), x = t.mul($, x), x = t.add(x, F), F = t.add(U, U), U = t.add(F, U), U = t.add(U, k), U = t.mul(U, x), ee = t.add(ee, U), k = t.mul(te, oe), k = t.add(k, k), U = t.mul(k, x), Y = t.sub(Y, U), F = t.mul(k, S), F = t.add(F, F), F = t.add(F, F), new m(Y, ee, F);
    }
    add($) {
      b($);
      const { px: L, py: P, pz: B } = this, { px: te, py: oe, pz: Y } = $;
      let ee = t.ZERO, F = t.ZERO, U = t.ZERO;
      const S = e.a, k = t.mul(e.b, zc);
      let x = t.mul(L, te), H = t.mul(P, oe), V = t.mul(B, Y), X = t.add(L, P), K = t.add(te, oe);
      X = t.mul(X, K), K = t.add(x, H), X = t.sub(X, K), K = t.add(L, B);
      let re = t.add(te, Y);
      return K = t.mul(K, re), re = t.add(x, V), K = t.sub(K, re), re = t.add(P, B), ee = t.add(oe, Y), re = t.mul(re, ee), ee = t.add(H, V), re = t.sub(re, ee), U = t.mul(S, K), ee = t.mul(k, V), U = t.add(ee, U), ee = t.sub(H, U), U = t.add(H, U), F = t.mul(ee, U), H = t.add(x, x), H = t.add(H, x), V = t.mul(S, V), K = t.mul(k, K), H = t.add(H, V), V = t.sub(x, V), V = t.mul(S, V), K = t.add(K, V), x = t.mul(H, K), F = t.add(F, x), x = t.mul(re, K), ee = t.mul(X, ee), ee = t.sub(ee, x), x = t.mul(X, H), U = t.mul(re, U), U = t.add(U, x), new m(ee, F, U);
    }
    subtract($) {
      return this.add($.negate());
    }
    is0() {
      return this.equals(m.ZERO);
    }
    wNAF($) {
      return T.wNAFCached(this, p, $, ((L) => {
        const P = t.invertBatch(L.map(((B) => B.pz)));
        return L.map(((B, te) => B.toAffine(P[te]))).map(m.fromAffine);
      }));
    }
    multiplyUnsafe($) {
      const L = m.ZERO;
      if ($ === Lr) return L;
      if (d($), $ === Wn) return this;
      const { endo: P } = e;
      if (!P) return T.unsafeLadder(this, $);
      let { k1neg: B, k1: te, k2neg: oe, k2: Y } = P.splitScalar($), ee = L, F = L, U = this;
      for (; te > Lr || Y > Lr; ) te & Wn && (ee = ee.add(U)), Y & Wn && (F = F.add(U)), U = U.double(), te >>= Wn, Y >>= Wn;
      return B && (ee = ee.negate()), oe && (F = F.negate()), F = new m(t.mul(F.px, P.beta), F.py, F.pz), ee.add(F);
    }
    multiply($) {
      d($);
      let L, P, B = $;
      const { endo: te } = e;
      if (te) {
        const { k1neg: oe, k1: Y, k2neg: ee, k2: F } = te.splitScalar(B);
        let { p: U, f: S } = this.wNAF(Y), { p: k, f: x } = this.wNAF(F);
        U = T.constTimeNegate(oe, U), k = T.constTimeNegate(ee, k), k = new m(t.mul(k.px, te.beta), k.py, k.pz), L = U.add(k), P = S.add(x);
      } else {
        const { p: oe, f: Y } = this.wNAF(B);
        L = oe, P = Y;
      }
      return m.normalizeZ([L, P])[0];
    }
    multiplyAndAddUnsafe($, L, P) {
      const B = m.BASE, te = (Y, ee) => ee !== Lr && ee !== Wn && Y.equals(B) ? Y.multiply(ee) : Y.multiplyUnsafe(ee), oe = te(this, L).add(te($, P));
      return oe.is0() ? void 0 : oe;
    }
    toAffine($) {
      const { px: L, py: P, pz: B } = this, te = this.is0();
      $ == null && ($ = te ? t.ONE : t.inv(B));
      const oe = t.mul(L, $), Y = t.mul(P, $), ee = t.mul(B, $);
      if (te) return { x: t.ZERO, y: t.ZERO };
      if (!t.eql(ee, t.ONE)) throw new Error("invZ was invalid");
      return { x: oe, y: Y };
    }
    isTorsionFree() {
      const { h: $, isTorsionFree: L } = e;
      if ($ === Wn) return !0;
      if (L) return L(m, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: $, clearCofactor: L } = e;
      return $ === Wn ? this : L ? L(m, this) : this.multiplyUnsafe(e.h);
    }
    toRawBytes($ = !0) {
      return this.assertValidity(), r(m, this, $);
    }
    toHex($ = !0) {
      return qs(this.toRawBytes($));
    }
  }
  m.BASE = new m(e.Gx, e.Gy, t.ONE), m.ZERO = new m(t.ZERO, t.ONE, t.ZERO);
  const v = e.nBitLength, T = /* @__PURE__ */ (function(A, $) {
    const L = (B, te) => {
      const oe = te.negate();
      return B ? oe : te;
    }, P = (B) => ({ windows: Math.ceil($ / B) + 1, windowSize: 2 ** (B - 1) });
    return { constTimeNegate: L, unsafeLadder(B, te) {
      let oe = A.ZERO, Y = B;
      for (; te > Dg; ) te & Ta && (oe = oe.add(Y)), Y = Y.double(), te >>= Ta;
      return oe;
    }, precomputeWindow(B, te) {
      const { windows: oe, windowSize: Y } = P(te), ee = [];
      let F = B, U = F;
      for (let S = 0; S < oe; S++) {
        U = F, ee.push(U);
        for (let k = 1; k < Y; k++) U = U.add(F), ee.push(U);
        F = U.double();
      }
      return ee;
    }, wNAF(B, te, oe) {
      const { windows: Y, windowSize: ee } = P(B);
      let F = A.ZERO, U = A.BASE;
      const S = BigInt(2 ** B - 1), k = 2 ** B, x = BigInt(B);
      for (let H = 0; H < Y; H++) {
        const V = H * ee;
        let X = Number(oe & S);
        oe >>= x, X > ee && (X -= k, oe += Ta);
        const K = V, re = V + Math.abs(X) - 1, de = H % 2 != 0, ve = X < 0;
        X === 0 ? U = U.add(L(de, te[K])) : F = F.add(L(ve, te[re]));
      }
      return { p: F, f: U };
    }, wNAFCached(B, te, oe, Y) {
      const ee = B._WINDOW_SIZE || 1;
      let F = te.get(B);
      return F || (F = this.precomputeWindow(B, ee), ee !== 1 && te.set(B, Y(F))), this.wNAF(ee, F, oe);
    } };
  })(m, e.endo ? Math.ceil(v / 2) : v);
  return { CURVE: e, ProjectivePoint: m, normPrivateKeyToScalar: h, weierstrassEquation: a, isWithinCurveOrder: c };
}
function Mg(n) {
  const e = (function(S) {
    const k = Cd(S);
    return Si(k, { hash: "hash", hmac: "function", randomBytes: "function" }, { bits2int: "function", bits2int_modN: "function", lowS: "boolean" }), Object.freeze({ lowS: !0, ...k });
  })(n), { Fp: t, n: r } = e, i = t.BYTES + 1, a = 2 * t.BYTES + 1;
  function c(S) {
    return hn(S, r);
  }
  function d(S) {
    return Ga(S, r);
  }
  const { ProjectivePoint: h, normPrivateKeyToScalar: p, weierstrassEquation: b, isWithinCurveOrder: m } = Rg({ ...e, toBytes(S, k, x) {
    const H = k.toAffine(), V = t.toBytes(H.x), X = ks;
    return x ? X(Uint8Array.from([k.hasEvenY() ? 2 : 3]), V) : X(Uint8Array.from([4]), V, t.toBytes(H.y));
  }, fromBytes(S) {
    const k = S.length, x = S[0], H = S.subarray(1);
    if (k !== i || x !== 2 && x !== 3) {
      if (k === a && x === 4)
        return { x: t.fromBytes(H.subarray(0, t.BYTES)), y: t.fromBytes(H.subarray(t.BYTES, 2 * t.BYTES)) };
      throw new Error(`Point of length ${k} was invalid. Expected ${i} compressed bytes or ${a} uncompressed bytes`);
    }
    {
      const X = Nn(H);
      if (!(Lr < (V = X) && V < t.ORDER)) throw new Error("Point is not on curve");
      const K = b(X);
      let re = t.sqrt(K);
      return !(1 & ~x) != ((re & Wn) === Wn) && (re = t.neg(re)), { x: X, y: re };
    }
    var V;
  } }), v = (S) => qs(os(S, e.nByteLength));
  function T(S) {
    return S > r >> Wn;
  }
  const A = (S, k, x) => Nn(S.slice(k, x));
  class $ {
    constructor(k, x, H) {
      this.r = k, this.s = x, this.recovery = H, this.assertValidity();
    }
    static fromCompact(k) {
      const x = e.nByteLength;
      return k = vn("compactSignature", k, 2 * x), new $(A(k, 0, x), A(k, x, 2 * x));
    }
    static fromDER(k) {
      const { r: x, s: H } = Es.toSig(vn("DER", k));
      return new $(x, H);
    }
    assertValidity() {
      if (!m(this.r)) throw new Error("r must be 0 < r < CURVE.n");
      if (!m(this.s)) throw new Error("s must be 0 < s < CURVE.n");
    }
    addRecoveryBit(k) {
      return new $(this.r, this.s, k);
    }
    recoverPublicKey(k) {
      const { r: x, s: H, recovery: V } = this, X = te(vn("msgHash", k));
      if (V == null || ![0, 1, 2, 3].includes(V)) throw new Error("recovery id invalid");
      const K = V === 2 || V === 3 ? x + e.n : x;
      if (K >= t.ORDER) throw new Error("recovery id 2 or 3 invalid");
      const re = 1 & V ? "03" : "02", de = h.fromHex(re + v(K)), ve = d(K), ce = c(-X * ve), $e = c(H * ve), we = h.BASE.multiplyAndAddUnsafe(de, ce, $e);
      if (!we) throw new Error("point at infinify");
      return we.assertValidity(), we;
    }
    hasHighS() {
      return T(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new $(this.r, c(-this.s), this.recovery) : this;
    }
    toDERRawBytes() {
      return Ai(this.toDERHex());
    }
    toDERHex() {
      return Es.hexFromSig({ r: this.r, s: this.s });
    }
    toCompactRawBytes() {
      return Ai(this.toCompactHex());
    }
    toCompactHex() {
      return v(this.r) + v(this.s);
    }
  }
  const L = { isValidPrivateKey(S) {
    try {
      return p(S), !0;
    } catch {
      return !1;
    }
  }, normPrivateKeyToScalar: p, randomPrivateKey: () => {
    const S = Pc(e.n);
    return (function(k, x, H = !1) {
      const V = k.length, X = kd(x), K = Pc(x);
      if (V < 16 || V < K || V > 1024) throw new Error(`expected ${K}-1024 bytes of input, got ${V}`);
      const re = hn(H ? Nn(k) : hl(k), x - Kt) + Kt;
      return H ? fl(re, X) : os(re, X);
    })(e.randomBytes(S), e.n);
  }, precompute: (S = 8, k = h.BASE) => (k._setWindowSize(S), k.multiply(BigInt(3)), k) };
  function P(S) {
    const k = S instanceof Uint8Array, x = typeof S == "string", H = (k || x) && S.length;
    return k ? H === i || H === a : x ? H === 2 * i || H === 2 * a : S instanceof h;
  }
  const B = e.bits2int || function(S) {
    const k = Nn(S), x = 8 * S.length - e.nBitLength;
    return x > 0 ? k >> BigInt(x) : k;
  }, te = e.bits2int_modN || function(S) {
    return c(B(S));
  }, oe = pl(e.nBitLength);
  function Y(S) {
    if (typeof S != "bigint") throw new Error("bigint expected");
    if (!(Lr <= S && S < oe)) throw new Error(`bigint expected < 2^${e.nBitLength}`);
    return os(S, e.nByteLength);
  }
  function ee(S, k, x = F) {
    if (["recovered", "canonical"].some(((Le) => Le in x))) throw new Error("sign() legacy options not supported");
    const { hash: H, randomBytes: V } = e;
    let { lowS: X, prehash: K, extraEntropy: re } = x;
    X == null && (X = !0), S = vn("msgHash", S), K && (S = vn("prehashed msgHash", H(S)));
    const de = te(S), ve = p(k), ce = [Y(ve), Y(de)];
    if (re != null) {
      const Le = re === !0 ? V(t.BYTES) : re;
      ce.push(vn("extraEntropy", Le));
    }
    const $e = ks(...ce), we = de;
    return { seed: $e, k2sig: function(Le) {
      const Ge = B(Le);
      if (!m(Ge)) return;
      const Xe = d(Ge), De = h.BASE.multiply(Ge).toAffine(), Pe = c(De.x);
      if (Pe === Lr) return;
      const nt = c(Xe * c(we + Pe * ve));
      if (nt === Lr) return;
      let pe = (De.x === Pe ? 0 : 2) | Number(De.y & Wn), ot = nt;
      return X && T(nt) && (ot = (function(mn) {
        return T(mn) ? c(-mn) : mn;
      })(nt), pe ^= 1), new $(Pe, ot, pe);
    } };
  }
  const F = { lowS: e.lowS, prehash: !1 }, U = { lowS: e.lowS, prehash: !1 };
  return h.BASE._setWindowSize(8), { CURVE: e, getPublicKey: function(S, k = !0) {
    return h.fromPrivateKey(S).toRawBytes(k);
  }, getSharedSecret: function(S, k, x = !0) {
    if (P(S)) throw new Error("first arg must be private key");
    if (!P(k)) throw new Error("second arg must be public key");
    return h.fromHex(k).multiply(p(S)).toRawBytes(x);
  }, sign: function(S, k, x = F) {
    const { seed: H, k2sig: V } = ee(S, k, x), X = e;
    return Ed(X.hash.outputLen, X.nByteLength, X.hmac)(H, V);
  }, verify: function(S, k, x, H = U) {
    const V = S;
    if (k = vn("msgHash", k), x = vn("publicKey", x), "strict" in H) throw new Error("options.strict was renamed to lowS");
    const { lowS: X, prehash: K } = H;
    let re, de;
    try {
      if (typeof V == "string" || V instanceof Uint8Array) try {
        re = $.fromDER(V);
      } catch (De) {
        if (!(De instanceof Es.Err)) throw De;
        re = $.fromCompact(V);
      }
      else {
        if (typeof V != "object" || typeof V.r != "bigint" || typeof V.s != "bigint") throw new Error("PARSE");
        {
          const { r: De, s: Pe } = V;
          re = new $(De, Pe);
        }
      }
      de = h.fromHex(x);
    } catch (De) {
      if (De.message === "PARSE") throw new Error("signature must be Signature instance, Uint8Array or hex string");
      return !1;
    }
    if (X && re.hasHighS()) return !1;
    K && (k = e.hash(k));
    const { r: ve, s: ce } = re, $e = te(k), we = d(ce), Le = c($e * we), Ge = c(ve * we), Xe = h.BASE.multiplyAndAddUnsafe(de, Le, Ge)?.toAffine();
    return !!Xe && c(Xe.x) === ve;
  }, ProjectivePoint: h, Signature: $, utils: L };
}
function Bg(n) {
  return { hash: n, hmac: (e, ...t) => Sd(n, e, (function(...r) {
    const i = new Uint8Array(r.reduce(((c, d) => c + d.length), 0));
    let a = 0;
    return r.forEach(((c) => {
      if (!yd(c)) throw new Error("Uint8Array expected");
      i.set(c, a), a += c.length;
    })), i;
  })(...t)), randomBytes: xd };
}
const Io = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"), fo = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), Id = BigInt(1), po = BigInt(2), Hc = (n, e) => (n + e / po) / e;
function Td(n) {
  const e = Io, t = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), c = BigInt(23), d = BigInt(44), h = BigInt(88), p = n * n * n % e, b = p * p * n % e, m = Gn(b, t, e) * b % e, v = Gn(m, t, e) * b % e, T = Gn(v, po, e) * p % e, A = Gn(T, i, e) * T % e, $ = Gn(A, a, e) * A % e, L = Gn($, d, e) * $ % e, P = Gn(L, h, e) * L % e, B = Gn(P, d, e) * $ % e, te = Gn(B, t, e) * b % e, oe = Gn(te, c, e) * A % e, Y = Gn(oe, r, e) * p % e, ee = Gn(Y, po, e);
  if (!Wa.eql(Wa.sqr(ee), n)) throw new Error("Cannot find square root");
  return ee;
}
const Wa = (function(n, e, t = !1, r = {}) {
  if (n <= sn) throw new Error(`Expected Field ORDER > 0, got ${n}`);
  const { nBitLength: i, nByteLength: a } = $d(n, e);
  if (a > 2048) throw new Error("Field lengths over 2048 bytes are not supported");
  const c = Tg(n), d = Object.freeze({ ORDER: n, BITS: i, BYTES: a, MASK: pl(i), ZERO: sn, ONE: Kt, create: (h) => hn(h, n), isValid: (h) => {
    if (typeof h != "bigint") throw new Error("Invalid field element: expected bigint, got " + typeof h);
    return sn <= h && h < n;
  }, is0: (h) => h === sn, isOdd: (h) => (h & Kt) === Kt, neg: (h) => hn(-h, n), eql: (h, p) => h === p, sqr: (h) => hn(h * h, n), add: (h, p) => hn(h + p, n), sub: (h, p) => hn(h - p, n), mul: (h, p) => hn(h * p, n), pow: (h, p) => (function(b, m, v) {
    if (v < sn) throw new Error("Expected power > 0");
    if (v === sn) return b.ONE;
    if (v === Kt) return m;
    let T = b.ONE, A = m;
    for (; v > sn; ) v & Kt && (T = b.mul(T, A)), A = b.sqr(A), v >>= Kt;
    return T;
  })(d, h, p), div: (h, p) => hn(h * Ga(p, n), n), sqrN: (h) => h * h, addN: (h, p) => h + p, subN: (h, p) => h - p, mulN: (h, p) => h * p, inv: (h) => Ga(h, n), sqrt: r.sqrt || ((h) => c(d, h)), invertBatch: (h) => (function(p, b) {
    const m = new Array(b.length), v = b.reduce(((A, $, L) => p.is0($) ? A : (m[L] = A, p.mul(A, $))), p.ONE), T = p.inv(v);
    return b.reduceRight(((A, $, L) => p.is0($) ? A : (m[L] = p.mul(A, m[L]), p.mul(A, $))), T), m;
  })(d, h), cmov: (h, p, b) => b ? p : h, toBytes: (h) => t ? fl(h, a) : os(h, a), fromBytes: (h) => {
    if (h.length !== a) throw new Error(`Fp.fromBytes: expected ${a}, got ${h.length}`);
    return t ? hl(h) : Nn(h);
  } });
  return Object.freeze(d);
})(Io, void 0, void 0, { sqrt: Td }), Gs = (function(n, e) {
  const t = (r) => Mg({ ...n, ...Bg(r) });
  return Object.freeze({ ...t(e), create: t });
})({ a: BigInt(0), b: BigInt(7), Fp: Wa, n: fo, Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"), Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"), h: BigInt(1), lowS: !0, endo: { beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"), splitScalar: (n) => {
  const e = fo, t = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Id * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), a = t, c = BigInt("0x100000000000000000000000000000000"), d = Hc(a * n, e), h = Hc(-r * n, e);
  let p = hn(n - d * t - h * i, e), b = hn(-d * r - h * a, e);
  const m = p > c, v = b > c;
  if (m && (p = e - p), v && (b = e - b), p > c || b > c) throw new Error("splitScalar: Endomorphism failed, k=" + n);
  return { k1neg: m, k1: p, k2neg: v, k2: b };
} } }, Va), To = BigInt(0), Ld = (n) => typeof n == "bigint" && To < n && n < Io, qc = {};
function go(n, ...e) {
  let t = qc[n];
  if (t === void 0) {
    const r = Va(Uint8Array.from(n, ((i) => i.charCodeAt(0))));
    t = ks(r, r), qc[n] = t;
  }
  return Va(ks(t, ...e));
}
const gl = (n) => n.toRawBytes(!0).slice(1), Ka = (n) => os(n, 32), La = (n) => hn(n, Io), Ci = (n) => hn(n, fo), vl = Gs.ProjectivePoint;
function Qa(n) {
  let e = Gs.utils.normPrivateKeyToScalar(n), t = vl.fromPrivateKey(e);
  return { scalar: t.hasEvenY() ? e : Ci(-e), bytes: gl(t) };
}
function Dd(n) {
  if (!Ld(n)) throw new Error("bad x: need 0 < x < p");
  const e = La(n * n);
  let t = Td(La(e * n + BigInt(7)));
  t % po !== To && (t = La(-t));
  const r = new vl(n, t, Id);
  return r.assertValidity(), r;
}
function Od(...n) {
  return Ci(Nn(go("BIP0340/challenge", ...n)));
}
function Ug(n) {
  return Qa(n).bytes;
}
function Pg(n, e, t = xd(32)) {
  const r = vn("message", n), { bytes: i, scalar: a } = Qa(e), c = vn("auxRand", t, 32), d = Ka(a ^ Nn(go("BIP0340/aux", c))), h = go("BIP0340/nonce", d, i, r), p = Ci(Nn(h));
  if (p === To) throw new Error("sign failed: k is zero");
  const { bytes: b, scalar: m } = Qa(p), v = Od(b, i, r), T = new Uint8Array(64);
  if (T.set(b, 0), T.set(Ka(Ci(m + v * a)), 32), !Nd(T, r, i)) throw new Error("sign: Invalid signature produced");
  return T;
}
function Nd(n, e, t) {
  const r = vn("signature", n, 64), i = vn("message", e), a = vn("publicKey", t, 32);
  try {
    const b = Dd(Nn(a)), m = Nn(r.subarray(0, 32));
    if (!Ld(m)) return !1;
    const v = Nn(r.subarray(32, 64));
    if (!(typeof (p = v) == "bigint" && To < p && p < fo)) return !1;
    const T = Od(Ka(m), gl(b), i), A = (c = b, d = v, h = Ci(-T), vl.BASE.multiplyAndAddUnsafe(c, d, h));
    return !(!A || !A.hasEvenY() || A.toAffine().x !== m);
  } catch {
    return !1;
  }
  var c, d, h, p;
}
const mr = { getPublicKey: Ug, sign: Pg, verify: Nd, utils: { randomPrivateKey: Gs.utils.randomPrivateKey, lift_x: Dd, pointToBytes: gl, numberToBytesBE: os, bytesToNumberBE: Nn, taggedHash: go, mod: hn } }, Da = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0, bl = (n) => n instanceof Uint8Array, Oa = (n) => new DataView(n.buffer, n.byteOffset, n.byteLength), pr = (n, e) => n << 32 - e | n >>> e;
if (new Uint8Array(new Uint32Array([287454020]).buffer)[0] !== 68) throw new Error("Non little-endian hardware is not supported");
const zg = Array.from({ length: 256 }, ((n, e) => e.toString(16).padStart(2, "0")));
function nn(n) {
  if (!bl(n)) throw new Error("Uint8Array expected");
  let e = "";
  for (let t = 0; t < n.length; t++) e += zg[n[t]];
  return e;
}
function js(n) {
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
  })(n)), !bl(n)) throw new Error("expected Uint8Array, got " + typeof n);
  return n;
}
function Lo(...n) {
  const e = new Uint8Array(n.reduce(((r, i) => r + i.length), 0));
  let t = 0;
  return n.forEach(((r) => {
    if (!bl(r)) throw new Error("Uint8Array expected");
    e.set(r, t), t += r.length;
  })), e;
}
class Rd {
  clone() {
    return this._cloneInto();
  }
}
function Md(n) {
  const e = (r) => n().update(Ii(r)).digest(), t = n();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n(), e;
}
function Bd(n = 32) {
  if (Da && typeof Da.getRandomValues == "function") return Da.getRandomValues(new Uint8Array(n));
  throw new Error("crypto.getRandomValues must be defined");
}
function Na(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`Wrong positive integer: ${n}`);
}
function jc(n, ...e) {
  if (!(n instanceof Uint8Array)) throw new Error("Expected Uint8Array");
  if (e.length > 0 && !e.includes(n.length)) throw new Error(`Expected Uint8Array of length ${e}, not of length=${n.length}`);
}
const Hg = { number: Na, bool: function(n) {
  if (typeof n != "boolean") throw new Error(`Expected boolean, not ${n}`);
}, bytes: jc, hash: function(n) {
  if (typeof n != "function" || typeof n.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Na(n.outputLen), Na(n.blockLen);
}, exists: function(n, e = !0) {
  if (n.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && n.finished) throw new Error("Hash#digest() has already been called");
}, output: function(n, e) {
  jc(n);
  const t = e.outputLen;
  if (n.length < t) throw new Error(`digestInto() expects output buffer of length at least ${t}`);
} }, xr = Hg;
class qg extends Rd {
  constructor(e, t, r, i) {
    super(), this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Oa(this.buffer);
  }
  update(e) {
    xr.exists(this);
    const { view: t, buffer: r, blockLen: i } = this, a = (e = Ii(e)).length;
    for (let c = 0; c < a; ) {
      const d = Math.min(i - this.pos, a - c);
      if (d !== i) r.set(e.subarray(c, c + d), this.pos), this.pos += d, c += d, this.pos === i && (this.process(t, 0), this.pos = 0);
      else {
        const h = Oa(e);
        for (; i <= a - c; c += i) this.process(h, c);
      }
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    xr.exists(this), xr.output(e, this), this.finished = !0;
    const { buffer: t, view: r, blockLen: i, isLE: a } = this;
    let { pos: c } = this;
    t[c++] = 128, this.buffer.subarray(c).fill(0), this.padOffset > i - c && (this.process(r, 0), c = 0);
    for (let m = c; m < i; m++) t[m] = 0;
    (function(m, v, T, A) {
      if (typeof m.setBigUint64 == "function") return m.setBigUint64(v, T, A);
      const $ = BigInt(32), L = BigInt(4294967295), P = Number(T >> $ & L), B = Number(T & L), te = A ? 4 : 0, oe = A ? 0 : 4;
      m.setUint32(v + te, P, A), m.setUint32(v + oe, B, A);
    })(r, i - 8, BigInt(8 * this.length), a), this.process(r, 0);
    const d = Oa(e), h = this.outputLen;
    if (h % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = h / 4, b = this.get();
    if (p > b.length) throw new Error("_sha2: outputLen bigger than state");
    for (let m = 0; m < p; m++) d.setUint32(4 * m, b[m], a);
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
const jg = (n, e, t) => n & e ^ n & t ^ e & t, Fg = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), Yr = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), Xr = new Uint32Array(64);
class Ud extends qg {
  constructor() {
    super(64, 32, 8, !1), this.A = 0 | Yr[0], this.B = 0 | Yr[1], this.C = 0 | Yr[2], this.D = 0 | Yr[3], this.E = 0 | Yr[4], this.F = 0 | Yr[5], this.G = 0 | Yr[6], this.H = 0 | Yr[7];
  }
  get() {
    const { A: e, B: t, C: r, D: i, E: a, F: c, G: d, H: h } = this;
    return [e, t, r, i, a, c, d, h];
  }
  set(e, t, r, i, a, c, d, h) {
    this.A = 0 | e, this.B = 0 | t, this.C = 0 | r, this.D = 0 | i, this.E = 0 | a, this.F = 0 | c, this.G = 0 | d, this.H = 0 | h;
  }
  process(e, t) {
    for (let v = 0; v < 16; v++, t += 4) Xr[v] = e.getUint32(t, !1);
    for (let v = 16; v < 64; v++) {
      const T = Xr[v - 15], A = Xr[v - 2], $ = pr(T, 7) ^ pr(T, 18) ^ T >>> 3, L = pr(A, 17) ^ pr(A, 19) ^ A >>> 10;
      Xr[v] = L + Xr[v - 7] + $ + Xr[v - 16] | 0;
    }
    let { A: r, B: i, C: a, D: c, E: d, F: h, G: p, H: b } = this;
    for (let v = 0; v < 64; v++) {
      const T = b + (pr(d, 6) ^ pr(d, 11) ^ pr(d, 25)) + ((m = d) & h ^ ~m & p) + Fg[v] + Xr[v] | 0, A = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + jg(r, i, a) | 0;
      b = p, p = h, h = d, d = c + T | 0, c = a, a = i, i = r, r = T + A | 0;
    }
    var m;
    r = r + this.A | 0, i = i + this.B | 0, a = a + this.C | 0, c = c + this.D | 0, d = d + this.E | 0, h = h + this.F | 0, p = p + this.G | 0, b = b + this.H | 0, this.set(r, i, a, c, d, h, p, b);
  }
  roundClean() {
    Xr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Zg extends Ud {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const As = Md((() => new Ud()));
Md((() => new Zg()));
function Ws(n) {
  if (!Number.isSafeInteger(n)) throw new Error(`Wrong integer: ${n}`);
}
function Rr(...n) {
  const e = (i, a) => (c) => i(a(c)), t = Array.from(n).reverse().reduce(((i, a) => i ? e(i, a.encode) : a.encode), void 0), r = n.reduce(((i, a) => i ? e(i, a.decode) : a.decode), void 0);
  return { encode: t, decode: r };
}
function Mr(n) {
  return { encode: (e) => {
    if (!Array.isArray(e) || e.length && typeof e[0] != "number") throw new Error("alphabet.encode input should be an array of numbers");
    return e.map(((t) => {
      if (Ws(t), t < 0 || t >= n.length) throw new Error(`Digit index outside alphabet: ${t} (alphabet: ${n.length})`);
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
function Br(n = "") {
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
function vo(n, e = "=") {
  if (Ws(n), typeof e != "string") throw new Error("padding chr should be string");
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
function Pd(n) {
  if (typeof n != "function") throw new Error("normalize fn should be function");
  return { encode: (e) => e, decode: (e) => n(e) };
}
function Fc(n, e, t) {
  if (e < 2) throw new Error(`convertRadix: wrong from=${e}, base cannot be less than 2`);
  if (t < 2) throw new Error(`convertRadix: wrong to=${t}, base cannot be less than 2`);
  if (!Array.isArray(n)) throw new Error("convertRadix: data should be array");
  if (!n.length) return [];
  let r = 0;
  const i = [], a = Array.from(n);
  for (a.forEach(((c) => {
    if (Ws(c), c < 0 || c >= e) throw new Error(`Wrong integer: ${c}`);
  })); ; ) {
    let c = 0, d = !0;
    for (let h = r; h < a.length; h++) {
      const p = a[h], b = e * c + p;
      if (!Number.isSafeInteger(b) || e * c / e !== c || b - p != e * c) throw new Error("convertRadix: carry overflow");
      if (c = b % t, a[h] = Math.floor(b / t), !Number.isSafeInteger(a[h]) || a[h] * t + c !== b) throw new Error("convertRadix: carry overflow");
      d && (a[h] ? d = !1 : r = h);
    }
    if (i.push(c), d) break;
  }
  for (let c = 0; c < n.length - 1 && n[c] === 0; c++) i.push(0);
  return i.reverse();
}
const zd = (n, e) => e ? zd(e, n % e) : n, bo = (n, e) => n + (e - zd(n, e));
function Ya(n, e, t, r) {
  if (!Array.isArray(n)) throw new Error("convertRadix2: data should be array");
  if (e <= 0 || e > 32) throw new Error(`convertRadix2: wrong from=${e}`);
  if (t <= 0 || t > 32) throw new Error(`convertRadix2: wrong to=${t}`);
  if (bo(e, t) > 32) throw new Error(`convertRadix2: carry overflow from=${e} to=${t} carryBits=${bo(e, t)}`);
  let i = 0, a = 0;
  const c = 2 ** t - 1, d = [];
  for (const h of n) {
    if (Ws(h), h >= 2 ** e) throw new Error(`convertRadix2: invalid data word=${h} from=${e}`);
    if (i = i << e | h, a + e > 32) throw new Error(`convertRadix2: carry overflow pos=${a} from=${e}`);
    for (a += e; a >= t; a -= t) d.push((i >> a - t & c) >>> 0);
    i &= 2 ** a - 1;
  }
  if (i = i << t - a & c, !r && a >= e) throw new Error("Excess padding");
  if (!r && i) throw new Error(`Non-zero padding: ${i}`);
  return r && a > 0 && d.push(i >>> 0), d;
}
function Vg(n) {
  return Ws(n), { encode: (e) => {
    if (!(e instanceof Uint8Array)) throw new Error("radix.encode input should be Uint8Array");
    return Fc(Array.from(e), 256, n);
  }, decode: (e) => {
    if (!Array.isArray(e) || e.length && typeof e[0] != "number") throw new Error("radix.decode input should be array of strings");
    return Uint8Array.from(Fc(e, n, 256));
  } };
}
function as(n, e = !1) {
  if (Ws(n), n <= 0 || n > 32) throw new Error("radix2: bits should be in (0..32]");
  if (bo(8, n) > 32 || bo(n, 8) > 32) throw new Error("radix2: carry overflow");
  return { encode: (t) => {
    if (!(t instanceof Uint8Array)) throw new Error("radix2.encode input should be Uint8Array");
    return Ya(Array.from(t), 8, n, !e);
  }, decode: (t) => {
    if (!Array.isArray(t) || t.length && typeof t[0] != "number") throw new Error("radix2.decode input should be array of strings");
    return Uint8Array.from(Ya(t, n, 8, e));
  } };
}
function Zc(n) {
  if (typeof n != "function") throw new Error("unsafeWrapper fn should be function");
  return function(...e) {
    try {
      return n.apply(null, e);
    } catch {
    }
  };
}
Rr(as(4), Mr("0123456789ABCDEF"), Br(""));
Rr(as(5), Mr("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), vo(5), Br(""));
const cs = (Rr(as(5), Mr("0123456789ABCDEFGHIJKLMNOPQRSTUV"), vo(5), Br("")), Rr(as(5), Mr("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), Br(""), Pd(((n) => n.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")))), Rr(as(6), Mr("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), vo(6), Br("")));
Rr(as(6), Mr("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), vo(6), Br(""));
const Xa = (n) => Rr(Vg(58), Mr(n), Br(""));
Xa("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
Xa("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), Xa("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
const Ja = Rr(Mr("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), Br("")), Vc = [996825010, 642813549, 513874426, 1027748829, 705979059];
function wi(n) {
  const e = n >> 25;
  let t = (33554431 & n) << 5;
  for (let r = 0; r < Vc.length; r++) (e >> r & 1) == 1 && (t ^= Vc[r]);
  return t;
}
function Gc(n, e, t = 1) {
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
  return i ^= t, Ja.encode(Ya([i % 2 ** 30], 30, 5, !1));
}
function Hd(n) {
  const e = n === "bech32" ? 1 : 734539939, t = as(5), r = t.decode, i = t.encode, a = Zc(r);
  function c(d, h = 90) {
    if (typeof d != "string") throw new Error("bech32.decode input should be string, not " + typeof d);
    if (d.length < 8 || h !== !1 && d.length > h) throw new TypeError(`Wrong string length: ${d.length} (${d}). Expected (8..${h})`);
    const p = d.toLowerCase();
    if (d !== p && d !== d.toUpperCase()) throw new Error("String must be lowercase or uppercase");
    const b = (d = p).lastIndexOf("1");
    if (b === 0 || b === -1) throw new Error('Letter "1" must be present between prefix and data only');
    const m = d.slice(0, b), v = d.slice(b + 1);
    if (v.length < 6) throw new Error("Data must be at least 6 characters long");
    const T = Ja.decode(v).slice(0, -6), A = Gc(m, T, e);
    if (!v.endsWith(A)) throw new Error(`Invalid checksum in ${d}: expected "${A}"`);
    return { prefix: m, words: T };
  }
  return { encode: function(d, h, p = 90) {
    if (typeof d != "string") throw new Error("bech32.encode prefix should be string, not " + typeof d);
    if (!Array.isArray(h) || h.length && typeof h[0] != "number") throw new Error("bech32.encode words should be array of numbers, not " + typeof h);
    const b = d.length + 7 + h.length;
    if (p !== !1 && b > p) throw new TypeError(`Length ${b} exceeds limit ${p}`);
    return `${d = d.toLowerCase()}1${Ja.encode(h)}${Gc(d, h, e)}`;
  }, decode: c, decodeToBytes: function(d) {
    const { prefix: h, words: p } = c(d, !1);
    return { prefix: h, words: p, bytes: r(p) };
  }, decodeUnsafe: Zc(c), fromWords: r, fromWordsUnsafe: a, toWords: i };
}
const Fs = Hd("bech32");
Hd("bech32m");
Rr(as(4), Mr("0123456789abcdef"), Br(""), Pd(((n) => {
  if (typeof n != "string" || n.length % 2) throw new TypeError(`hex.decode: expected string, got ${typeof n} with length ${n.length}`);
  return n.toLowerCase();
})));
function Ra(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`positive integer expected, not ${n}`);
}
function Wc(n) {
  if (typeof n != "boolean") throw new Error(`boolean expected, not ${n}`);
}
function qd(n) {
  return n instanceof Uint8Array || n != null && typeof n == "object" && n.constructor.name === "Uint8Array";
}
function _t(n, ...e) {
  if (!qd(n)) throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(n.length)) throw new Error(`Uint8Array expected of length ${e}, not of length=${n.length}`);
}
function Zs(n, e = !0) {
  if (n.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && n.finished) throw new Error("Hash#digest() has already been called");
}
function ml(n, e) {
  _t(n);
  const t = e.outputLen;
  if (n.length < t) throw new Error(`digestInto() expects output buffer of length at least ${t}`);
}
const yl = (n) => new Uint8Array(n.buffer, n.byteOffset, n.byteLength), ut = (n) => new Uint32Array(n.buffer, n.byteOffset, Math.floor(n.byteLength / 4)), Do = (n) => new DataView(n.buffer, n.byteOffset, n.byteLength);
if (new Uint8Array(new Uint32Array([287454020]).buffer)[0] !== 68) throw new Error("Non little-endian hardware is not supported");
function ds(n) {
  if (typeof n == "string") n = (function(e) {
    if (typeof e != "string") throw new Error("string expected, got " + typeof e);
    return new Uint8Array(new TextEncoder().encode(e));
  })(n);
  else {
    if (!qd(n)) throw new Error("Uint8Array expected, got " + typeof n);
    n = n.slice();
  }
  return n;
}
function wl(n, e) {
  if (n.length !== e.length) return !1;
  let t = 0;
  for (let r = 0; r < n.length; r++) t |= n[r] ^ e[r];
  return t === 0;
}
const Ks = (n, e) => (Object.assign(e, n), e);
function el(n, e, t, r) {
  if (typeof n.setBigUint64 == "function") return n.setBigUint64(e, t, r);
  const i = BigInt(32), a = BigInt(4294967295), c = Number(t >> i & a), d = Number(t & a), h = r ? 4 : 0, p = r ? 0 : 4;
  n.setUint32(e + h, c, r), n.setUint32(e + p, d, r);
}
const Ir = 16, xl = new Uint8Array(16), yr = ut(xl), Kn = (n) => (n >>> 0 & 255) << 24 | (n >>> 8 & 255) << 16 | (n >>> 16 & 255) << 8 | n >>> 24 & 255;
class jd {
  constructor(e, t) {
    this.blockLen = Ir, this.outputLen = Ir, this.s0 = 0, this.s1 = 0, this.s2 = 0, this.s3 = 0, this.finished = !1, _t(e = ds(e), 16);
    const r = Do(e);
    let i = r.getUint32(0, !1), a = r.getUint32(4, !1), c = r.getUint32(8, !1), d = r.getUint32(12, !1);
    const h = [];
    for (let P = 0; P < 128; P++) h.push({ s0: Kn(i), s1: Kn(a), s2: Kn(c), s3: Kn(d) }), { s0: i, s1: a, s2: c, s3: d } = { s3: (m = c) << 31 | (v = d) >>> 1, s2: (b = a) << 31 | m >>> 1, s1: (p = i) << 31 | b >>> 1, s0: p >>> 1 ^ 225 << 24 & -(1 & v) };
    var p, b, m, v;
    const T = ((P) => P > 65536 ? 8 : P > 1024 ? 4 : 2)(t || 1024);
    if (![1, 2, 4, 8].includes(T)) throw new Error(`ghash: wrong window size=${T}, should be 2, 4 or 8`);
    this.W = T;
    const A = 128 / T, $ = this.windowSize = 2 ** T, L = [];
    for (let P = 0; P < A; P++) for (let B = 0; B < $; B++) {
      let te = 0, oe = 0, Y = 0, ee = 0;
      for (let F = 0; F < T; F++) {
        if (!(B >>> T - F - 1 & 1)) continue;
        const { s0: U, s1: S, s2: k, s3: x } = h[T * P + F];
        te ^= U, oe ^= S, Y ^= k, ee ^= x;
      }
      L.push({ s0: te, s1: oe, s2: Y, s3: ee });
    }
    this.t = L;
  }
  _updateBlock(e, t, r, i) {
    e ^= this.s0, t ^= this.s1, r ^= this.s2, i ^= this.s3;
    const { W: a, t: c, windowSize: d } = this;
    let h = 0, p = 0, b = 0, m = 0;
    const v = (1 << a) - 1;
    let T = 0;
    for (const A of [e, t, r, i]) for (let $ = 0; $ < 4; $++) {
      const L = A >>> 8 * $ & 255;
      for (let P = 8 / a - 1; P >= 0; P--) {
        const B = L >>> a * P & v, { s0: te, s1: oe, s2: Y, s3: ee } = c[T * d + B];
        h ^= te, p ^= oe, b ^= Y, m ^= ee, T += 1;
      }
    }
    this.s0 = h, this.s1 = p, this.s2 = b, this.s3 = m;
  }
  update(e) {
    e = ds(e), Zs(this);
    const t = ut(e), r = Math.floor(e.length / Ir), i = e.length % Ir;
    for (let a = 0; a < r; a++) this._updateBlock(t[4 * a + 0], t[4 * a + 1], t[4 * a + 2], t[4 * a + 3]);
    return i && (xl.set(e.subarray(r * Ir)), this._updateBlock(yr[0], yr[1], yr[2], yr[3]), yr.fill(0)), this;
  }
  destroy() {
    const { t: e } = this;
    for (const t of e) t.s0 = 0, t.s1 = 0, t.s2 = 0, t.s3 = 0;
  }
  digestInto(e) {
    Zs(this), ml(e, this), this.finished = !0;
    const { s0: t, s1: r, s2: i, s3: a } = this, c = ut(e);
    return c[0] = t, c[1] = r, c[2] = i, c[3] = a, e;
  }
  digest() {
    const e = new Uint8Array(Ir);
    return this.digestInto(e), this.destroy(), e;
  }
}
class Gg extends jd {
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
    })((e = ds(e)).slice());
    super(r, t), r.fill(0);
  }
  update(e) {
    e = ds(e), Zs(this);
    const t = ut(e), r = e.length % Ir, i = Math.floor(e.length / Ir);
    for (let a = 0; a < i; a++) this._updateBlock(Kn(t[4 * a + 3]), Kn(t[4 * a + 2]), Kn(t[4 * a + 1]), Kn(t[4 * a + 0]));
    return r && (xl.set(e.subarray(i * Ir)), this._updateBlock(Kn(yr[3]), Kn(yr[2]), Kn(yr[1]), Kn(yr[0])), yr.fill(0)), this;
  }
  digestInto(e) {
    Zs(this), ml(e, this), this.finished = !0;
    const { s0: t, s1: r, s2: i, s3: a } = this, c = ut(e);
    return c[0] = t, c[1] = r, c[2] = i, c[3] = a, e.reverse();
  }
}
function Fd(n) {
  const e = (r, i) => n(i, r.length).update(ds(r)).digest(), t = n(new Uint8Array(16), 0);
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (r, i) => n(r, i), e;
}
const Kc = Fd(((n, e) => new jd(n, e))), Wg = Fd(((n, e) => new Gg(n, e))), Rn = 16, io = new Uint8Array(Rn);
function _l(n) {
  return n << 1 ^ 283 & -(n >> 7);
}
function Bs(n, e) {
  let t = 0;
  for (; e > 0; e >>= 1) t ^= n & -(1 & e), n = _l(n);
  return t;
}
const tl = (() => {
  let n = new Uint8Array(256);
  for (let t = 0, r = 1; t < 256; t++, r ^= _l(r)) n[t] = r;
  const e = new Uint8Array(256);
  e[0] = 99;
  for (let t = 0; t < 255; t++) {
    let r = n[255 - t];
    r |= r << 8, e[n[t]] = 255 & (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99);
  }
  return e;
})(), Kg = tl.map(((n, e) => tl.indexOf(e))), Ma = (n) => n << 8 | n >>> 24;
function Zd(n, e) {
  if (n.length !== 256) throw new Error("Wrong sbox length");
  const t = new Uint32Array(256).map(((p, b) => e(n[b]))), r = t.map(Ma), i = r.map(Ma), a = i.map(Ma), c = new Uint32Array(65536), d = new Uint32Array(65536), h = new Uint16Array(65536);
  for (let p = 0; p < 256; p++) for (let b = 0; b < 256; b++) {
    const m = 256 * p + b;
    c[m] = t[p] ^ r[b], d[m] = i[p] ^ a[b], h[m] = n[p] << 8 | n[b];
  }
  return { sbox: n, sbox2: h, T0: t, T1: r, T2: i, T3: a, T01: c, T23: d };
}
const El = Zd(tl, ((n) => Bs(n, 3) << 24 | n << 16 | n << 8 | Bs(n, 2))), Vd = Zd(Kg, ((n) => Bs(n, 11) << 24 | Bs(n, 13) << 16 | Bs(n, 9) << 8 | Bs(n, 14))), Qg = (() => {
  const n = new Uint8Array(16);
  for (let e = 0, t = 1; e < 16; e++, t = _l(t)) n[e] = t;
  return n;
})();
function us(n) {
  _t(n);
  const e = n.length;
  if (![16, 24, 32].includes(e)) throw new Error(`aes: wrong key size: should be 16, 24 or 32, got: ${e}`);
  const { sbox2: t } = El, r = ut(n), i = r.length, a = (h) => _r(t, h, h, h, h), c = new Uint32Array(e + 28);
  c.set(r);
  for (let h = i; h < c.length; h++) {
    let p = c[h - 1];
    h % i == 0 ? p = a((d = p) << 24 | d >>> 8) ^ Qg[h / i - 1] : i > 6 && h % i == 4 && (p = a(p)), c[h] = c[h - i] ^ p;
  }
  var d;
  return c;
}
function Gd(n) {
  const e = us(n), t = e.slice(), r = e.length, { sbox2: i } = El, { T0: a, T1: c, T2: d, T3: h } = Vd;
  for (let p = 0; p < r; p += 4) for (let b = 0; b < 4; b++) t[p + b] = e[r - p - 4 + b];
  e.fill(0);
  for (let p = 4; p < r - 4; p++) {
    const b = t[p], m = _r(i, b, b, b, b);
    t[p] = a[255 & m] ^ c[m >>> 8 & 255] ^ d[m >>> 16 & 255] ^ h[m >>> 24];
  }
  return t;
}
function is(n, e, t, r, i, a) {
  return n[t << 8 & 65280 | r >>> 8 & 255] ^ e[i >>> 8 & 65280 | a >>> 24 & 255];
}
function _r(n, e, t, r, i) {
  return n[255 & e | 65280 & t] | n[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function Qn(n, e, t, r, i) {
  const { sbox2: a, T01: c, T23: d } = El;
  let h = 0;
  e ^= n[h++], t ^= n[h++], r ^= n[h++], i ^= n[h++];
  const p = n.length / 4 - 2;
  for (let b = 0; b < p; b++) {
    const m = n[h++] ^ is(c, d, e, t, r, i), v = n[h++] ^ is(c, d, t, r, i, e), T = n[h++] ^ is(c, d, r, i, e, t), A = n[h++] ^ is(c, d, i, e, t, r);
    e = m, t = v, r = T, i = A;
  }
  return { s0: n[h++] ^ _r(a, e, t, r, i), s1: n[h++] ^ _r(a, t, r, i, e), s2: n[h++] ^ _r(a, r, i, e, t), s3: n[h++] ^ _r(a, i, e, t, r) };
}
function Wd(n, e, t, r, i) {
  const { sbox2: a, T01: c, T23: d } = Vd;
  let h = 0;
  e ^= n[h++], t ^= n[h++], r ^= n[h++], i ^= n[h++];
  const p = n.length / 4 - 2;
  for (let b = 0; b < p; b++) {
    const m = n[h++] ^ is(c, d, e, i, r, t), v = n[h++] ^ is(c, d, t, e, i, r), T = n[h++] ^ is(c, d, r, t, e, i), A = n[h++] ^ is(c, d, i, r, t, e);
    e = m, t = v, r = T, i = A;
  }
  return { s0: n[h++] ^ _r(a, e, i, r, t), s1: n[h++] ^ _r(a, t, e, i, r), s2: n[h++] ^ _r(a, r, t, e, i), s3: n[h++] ^ _r(a, i, r, t, e) };
}
function Qs(n, e) {
  if (!e) return new Uint8Array(n);
  if (_t(e), e.length < n) throw new Error(`aes: wrong destination length, expected at least ${n}, got: ${e.length}`);
  return e;
}
function Yg(n, e, t, r) {
  _t(e, Rn), _t(t);
  const i = t.length;
  r = Qs(i, r);
  const a = e, c = ut(a);
  let { s0: d, s1: h, s2: p, s3: b } = Qn(n, c[0], c[1], c[2], c[3]);
  const m = ut(t), v = ut(r);
  for (let A = 0; A + 4 <= m.length; A += 4) {
    v[A + 0] = m[A + 0] ^ d, v[A + 1] = m[A + 1] ^ h, v[A + 2] = m[A + 2] ^ p, v[A + 3] = m[A + 3] ^ b;
    let $ = 1;
    for (let L = a.length - 1; L >= 0; L--) $ = $ + (255 & a[L]) | 0, a[L] = 255 & $, $ >>>= 8;
    ({ s0: d, s1: h, s2: p, s3: b } = Qn(n, c[0], c[1], c[2], c[3]));
  }
  const T = Rn * Math.floor(m.length / 4);
  if (T < i) {
    const A = new Uint32Array([d, h, p, b]), $ = yl(A);
    for (let L = T, P = 0; L < i; L++, P++) r[L] = t[L] ^ $[P];
  }
  return r;
}
function xi(n, e, t, r, i) {
  _t(t, Rn), _t(r), i = Qs(r.length, i);
  const a = t, c = ut(a), d = Do(a), h = ut(r), p = ut(i), b = e ? 0 : 12, m = r.length;
  let v = d.getUint32(b, e), { s0: T, s1: A, s2: $, s3: L } = Qn(n, c[0], c[1], c[2], c[3]);
  for (let B = 0; B + 4 <= h.length; B += 4) p[B + 0] = h[B + 0] ^ T, p[B + 1] = h[B + 1] ^ A, p[B + 2] = h[B + 2] ^ $, p[B + 3] = h[B + 3] ^ L, v = v + 1 >>> 0, d.setUint32(b, v, e), { s0: T, s1: A, s2: $, s3: L } = Qn(n, c[0], c[1], c[2], c[3]);
  const P = Rn * Math.floor(h.length / 4);
  if (P < m) {
    const B = new Uint32Array([T, A, $, L]), te = yl(B);
    for (let oe = P, Y = 0; oe < m; oe++, Y++) i[oe] = r[oe] ^ te[Y];
  }
  return i;
}
Ks({ blockSize: 16, nonceLength: 16 }, (function(n, e) {
  function t(r, i) {
    const a = us(n), c = e.slice(), d = Yg(a, c, r, i);
    return a.fill(0), c.fill(0), d;
  }
  return _t(n), _t(e, Rn), { encrypt: (r, i) => t(r, i), decrypt: (r, i) => t(r, i) };
}));
function Kd(n) {
  if (_t(n), n.length % Rn != 0) throw new Error("aes/(cbc-ecb).decrypt ciphertext should consist of blocks with size 16");
}
function Qd(n, e, t) {
  let r = n.length;
  const i = r % Rn;
  if (!e && i !== 0) throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
  const a = ut(n);
  if (e) {
    let d = Rn - i;
    d || (d = Rn), r += d;
  }
  const c = Qs(r, t);
  return { b: a, o: ut(c), out: c };
}
function Yd(n, e) {
  if (!e) return n;
  const t = n.length;
  if (!t) throw new Error("aes/pcks5: empty ciphertext not allowed");
  const r = n[t - 1];
  if (r <= 0 || r > 16) throw new Error(`aes/pcks5: wrong padding byte: ${r}`);
  const i = n.subarray(0, -r);
  for (let a = 0; a < r; a++) if (n[t - a - 1] !== r) throw new Error("aes/pcks5: wrong padding");
  return i;
}
function Xd(n) {
  const e = new Uint8Array(16), t = ut(e);
  e.set(n);
  const r = Rn - n.length;
  for (let i = Rn - r; i < Rn; i++) e[i] = r;
  return t;
}
Ks({ blockSize: 16 }, (function(n, e = {}) {
  _t(n);
  const t = !e.disablePadding;
  return { encrypt: (r, i) => {
    _t(r);
    const { b: a, o: c, out: d } = Qd(r, t, i), h = us(n);
    let p = 0;
    for (; p + 4 <= a.length; ) {
      const { s0: b, s1: m, s2: v, s3: T } = Qn(h, a[p + 0], a[p + 1], a[p + 2], a[p + 3]);
      c[p++] = b, c[p++] = m, c[p++] = v, c[p++] = T;
    }
    if (t) {
      const b = Xd(r.subarray(4 * p)), { s0: m, s1: v, s2: T, s3: A } = Qn(h, b[0], b[1], b[2], b[3]);
      c[p++] = m, c[p++] = v, c[p++] = T, c[p++] = A;
    }
    return h.fill(0), d;
  }, decrypt: (r, i) => {
    Kd(r);
    const a = Gd(n), c = Qs(r.length, i), d = ut(r), h = ut(c);
    for (let p = 0; p + 4 <= d.length; ) {
      const { s0: b, s1: m, s2: v, s3: T } = Wd(a, d[p + 0], d[p + 1], d[p + 2], d[p + 3]);
      h[p++] = b, h[p++] = m, h[p++] = v, h[p++] = T;
    }
    return a.fill(0), Yd(c, t);
  } };
}));
const Jd = Ks({ blockSize: 16, nonceLength: 16 }, (function(n, e, t = {}) {
  _t(n), _t(e, 16);
  const r = !t.disablePadding;
  return { encrypt: (i, a) => {
    const c = us(n), { b: d, o: h, out: p } = Qd(i, r, a), b = ut(e);
    let m = b[0], v = b[1], T = b[2], A = b[3], $ = 0;
    for (; $ + 4 <= d.length; ) m ^= d[$ + 0], v ^= d[$ + 1], T ^= d[$ + 2], A ^= d[$ + 3], { s0: m, s1: v, s2: T, s3: A } = Qn(c, m, v, T, A), h[$++] = m, h[$++] = v, h[$++] = T, h[$++] = A;
    if (r) {
      const L = Xd(i.subarray(4 * $));
      m ^= L[0], v ^= L[1], T ^= L[2], A ^= L[3], { s0: m, s1: v, s2: T, s3: A } = Qn(c, m, v, T, A), h[$++] = m, h[$++] = v, h[$++] = T, h[$++] = A;
    }
    return c.fill(0), p;
  }, decrypt: (i, a) => {
    Kd(i);
    const c = Gd(n), d = ut(e), h = Qs(i.length, a), p = ut(i), b = ut(h);
    let m = d[0], v = d[1], T = d[2], A = d[3];
    for (let $ = 0; $ + 4 <= p.length; ) {
      const L = m, P = v, B = T, te = A;
      m = p[$ + 0], v = p[$ + 1], T = p[$ + 2], A = p[$ + 3];
      const { s0: oe, s1: Y, s2: ee, s3: F } = Wd(c, m, v, T, A);
      b[$++] = oe ^ L, b[$++] = Y ^ P, b[$++] = ee ^ B, b[$++] = F ^ te;
    }
    return c.fill(0), Yd(h, r);
  } };
}));
Ks({ blockSize: 16, nonceLength: 16 }, (function(n, e) {
  function t(r, i, a) {
    const c = us(n), d = r.length;
    a = Qs(d, a);
    const h = ut(r), p = ut(a), b = i ? p : h, m = ut(e);
    let v = m[0], T = m[1], A = m[2], $ = m[3];
    for (let P = 0; P + 4 <= h.length; ) {
      const { s0: B, s1: te, s2: oe, s3: Y } = Qn(c, v, T, A, $);
      p[P + 0] = h[P + 0] ^ B, p[P + 1] = h[P + 1] ^ te, p[P + 2] = h[P + 2] ^ oe, p[P + 3] = h[P + 3] ^ Y, v = b[P++], T = b[P++], A = b[P++], $ = b[P++];
    }
    const L = Rn * Math.floor(h.length / 4);
    if (L < d) {
      ({ s0: v, s1: T, s2: A, s3: $ } = Qn(c, v, T, A, $));
      const P = yl(new Uint32Array([v, T, A, $]));
      for (let B = L, te = 0; B < d; B++, te++) a[B] = r[B] ^ P[te];
      P.fill(0);
    }
    return c.fill(0), a;
  }
  return _t(n), _t(e, 16), { encrypt: (r, i) => t(r, !0, i), decrypt: (r, i) => t(r, !1, i) };
}));
function eu(n, e, t, r, i) {
  const a = n.create(t, r.length + (i?.length || 0));
  i && a.update(i), a.update(r);
  const c = new Uint8Array(16), d = Do(c);
  return i && el(d, 0, BigInt(8 * i.length), e), el(d, 8, BigInt(8 * r.length), e), a.update(c), a.digest();
}
Ks({ blockSize: 16, nonceLength: 12, tagLength: 16 }, (function(n, e, t) {
  if (_t(e), e.length === 0) throw new Error("aes/gcm: empty nonce");
  const r = 16;
  function i(c, d, h) {
    const p = eu(Kc, !1, c, h, t);
    for (let b = 0; b < d.length; b++) p[b] ^= d[b];
    return p;
  }
  function a() {
    const c = us(n), d = io.slice(), h = io.slice();
    if (xi(c, !1, h, h, d), e.length === 12) h.set(e);
    else {
      const p = io.slice();
      el(Do(p), 8, BigInt(8 * e.length), !1), Kc.create(d).update(e).update(p).digestInto(h);
    }
    return { xk: c, authKey: d, counter: h, tagMask: xi(c, !1, h, io) };
  }
  return { encrypt: (c) => {
    _t(c);
    const { xk: d, authKey: h, counter: p, tagMask: b } = a(), m = new Uint8Array(c.length + r);
    xi(d, !1, p, c, m);
    const v = i(h, b, m.subarray(0, m.length - r));
    return m.set(v, c.length), d.fill(0), m;
  }, decrypt: (c) => {
    if (_t(c), c.length < r) throw new Error("aes/gcm: ciphertext less than tagLen (16)");
    const { xk: d, authKey: h, counter: p, tagMask: b } = a(), m = c.subarray(0, -16), v = c.subarray(-16);
    if (!wl(i(h, b, m), v)) throw new Error("aes/gcm: invalid ghash tag");
    const T = xi(d, !1, p, m);
    return h.fill(0), b.fill(0), d.fill(0), T;
  } };
}));
const oo = (n, e, t) => (r) => {
  if (!Number.isSafeInteger(r) || e > r || r > t) throw new Error(`${n}: invalid value=${r}, must be [${e}..${t}]`);
};
Ks({ blockSize: 16, nonceLength: 12, tagLength: 16 }, (function(n, e, t) {
  const r = oo("AAD", 0, 68719476736), i = oo("plaintext", 0, 2 ** 36), a = oo("nonce", 12, 12), c = oo("ciphertext", 16, 2 ** 36 + 16);
  function d() {
    const b = n.length;
    if (b !== 16 && b !== 24 && b !== 32) throw new Error(`key length must be 16, 24 or 32 bytes, got: ${b} bytes`);
    const m = us(n), v = new Uint8Array(b), T = new Uint8Array(16), A = ut(e);
    let $ = 0, L = A[0], P = A[1], B = A[2], te = 0;
    for (const oe of [T, v].map(ut)) {
      const Y = ut(oe);
      for (let ee = 0; ee < Y.length; ee += 2) {
        const { s0: F, s1: U } = Qn(m, $, L, P, B);
        Y[ee + 0] = F, Y[ee + 1] = U, $ = ++te;
      }
    }
    return m.fill(0), { authKey: T, encKey: us(v) };
  }
  function h(b, m, v) {
    const T = eu(Wg, !0, m, v, t);
    for (let te = 0; te < 12; te++) T[te] ^= e[te];
    T[15] &= 127;
    const A = ut(T);
    let $ = A[0], L = A[1], P = A[2], B = A[3];
    return { s0: $, s1: L, s2: P, s3: B } = Qn(b, $, L, P, B), A[0] = $, A[1] = L, A[2] = P, A[3] = B, T;
  }
  function p(b, m, v) {
    let T = m.slice();
    return T[15] |= 128, xi(b, !0, T, v);
  }
  return _t(e), a(e.length), t && (_t(t), r(t.length)), { encrypt: (b) => {
    _t(b), i(b.length);
    const { encKey: m, authKey: v } = d(), T = h(m, v, b), A = new Uint8Array(b.length + 16);
    return A.set(T, b.length), A.set(p(m, T, b)), m.fill(0), v.fill(0), A;
  }, decrypt: (b) => {
    _t(b), c(b.length);
    const m = b.subarray(-16), { encKey: v, authKey: T } = d(), A = p(v, m, b.subarray(0, -16)), $ = h(v, T, A);
    if (v.fill(0), T.fill(0), !wl(m, $)) throw new Error("invalid polyval tag");
    return A;
  } };
}));
const un = (n, e) => 255 & n[e++] | (255 & n[e++]) << 8;
class Xg {
  constructor(e) {
    this.blockLen = 16, this.outputLen = 16, this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.pos = 0, this.finished = !1, _t(e = ds(e), 32);
    const t = un(e, 0), r = un(e, 2), i = un(e, 4), a = un(e, 6), c = un(e, 8), d = un(e, 10), h = un(e, 12), p = un(e, 14);
    this.r[0] = 8191 & t, this.r[1] = 8191 & (t >>> 13 | r << 3), this.r[2] = 7939 & (r >>> 10 | i << 6), this.r[3] = 8191 & (i >>> 7 | a << 9), this.r[4] = 255 & (a >>> 4 | c << 12), this.r[5] = c >>> 1 & 8190, this.r[6] = 8191 & (c >>> 14 | d << 2), this.r[7] = 8065 & (d >>> 11 | h << 5), this.r[8] = 8191 & (h >>> 8 | p << 8), this.r[9] = p >>> 5 & 127;
    for (let b = 0; b < 8; b++) this.pad[b] = un(e, 16 + 2 * b);
  }
  process(e, t, r = !1) {
    const i = r ? 0 : 2048, { h: a, r: c } = this, d = c[0], h = c[1], p = c[2], b = c[3], m = c[4], v = c[5], T = c[6], A = c[7], $ = c[8], L = c[9], P = un(e, t + 0), B = un(e, t + 2), te = un(e, t + 4), oe = un(e, t + 6), Y = un(e, t + 8), ee = un(e, t + 10), F = un(e, t + 12), U = un(e, t + 14);
    let S = a[0] + (8191 & P), k = a[1] + (8191 & (P >>> 13 | B << 3)), x = a[2] + (8191 & (B >>> 10 | te << 6)), H = a[3] + (8191 & (te >>> 7 | oe << 9)), V = a[4] + (8191 & (oe >>> 4 | Y << 12)), X = a[5] + (Y >>> 1 & 8191), K = a[6] + (8191 & (Y >>> 14 | ee << 2)), re = a[7] + (8191 & (ee >>> 11 | F << 5)), de = a[8] + (8191 & (F >>> 8 | U << 8)), ve = a[9] + (U >>> 5 | i), ce = 0, $e = ce + S * d + k * (5 * L) + x * (5 * $) + H * (5 * A) + V * (5 * T);
    ce = $e >>> 13, $e &= 8191, $e += X * (5 * v) + K * (5 * m) + re * (5 * b) + de * (5 * p) + ve * (5 * h), ce += $e >>> 13, $e &= 8191;
    let we = ce + S * h + k * d + x * (5 * L) + H * (5 * $) + V * (5 * A);
    ce = we >>> 13, we &= 8191, we += X * (5 * T) + K * (5 * v) + re * (5 * m) + de * (5 * b) + ve * (5 * p), ce += we >>> 13, we &= 8191;
    let Le = ce + S * p + k * h + x * d + H * (5 * L) + V * (5 * $);
    ce = Le >>> 13, Le &= 8191, Le += X * (5 * A) + K * (5 * T) + re * (5 * v) + de * (5 * m) + ve * (5 * b), ce += Le >>> 13, Le &= 8191;
    let Ge = ce + S * b + k * p + x * h + H * d + V * (5 * L);
    ce = Ge >>> 13, Ge &= 8191, Ge += X * (5 * $) + K * (5 * A) + re * (5 * T) + de * (5 * v) + ve * (5 * m), ce += Ge >>> 13, Ge &= 8191;
    let Xe = ce + S * m + k * b + x * p + H * h + V * d;
    ce = Xe >>> 13, Xe &= 8191, Xe += X * (5 * L) + K * (5 * $) + re * (5 * A) + de * (5 * T) + ve * (5 * v), ce += Xe >>> 13, Xe &= 8191;
    let De = ce + S * v + k * m + x * b + H * p + V * h;
    ce = De >>> 13, De &= 8191, De += X * d + K * (5 * L) + re * (5 * $) + de * (5 * A) + ve * (5 * T), ce += De >>> 13, De &= 8191;
    let Pe = ce + S * T + k * v + x * m + H * b + V * p;
    ce = Pe >>> 13, Pe &= 8191, Pe += X * h + K * d + re * (5 * L) + de * (5 * $) + ve * (5 * A), ce += Pe >>> 13, Pe &= 8191;
    let nt = ce + S * A + k * T + x * v + H * m + V * b;
    ce = nt >>> 13, nt &= 8191, nt += X * p + K * h + re * d + de * (5 * L) + ve * (5 * $), ce += nt >>> 13, nt &= 8191;
    let pe = ce + S * $ + k * A + x * T + H * v + V * m;
    ce = pe >>> 13, pe &= 8191, pe += X * b + K * p + re * h + de * d + ve * (5 * L), ce += pe >>> 13, pe &= 8191;
    let ot = ce + S * L + k * $ + x * A + H * T + V * v;
    ce = ot >>> 13, ot &= 8191, ot += X * m + K * b + re * p + de * h + ve * d, ce += ot >>> 13, ot &= 8191, ce = (ce << 2) + ce | 0, ce = ce + $e | 0, $e = 8191 & ce, ce >>>= 13, we += ce, a[0] = $e, a[1] = we, a[2] = Le, a[3] = Ge, a[4] = Xe, a[5] = De, a[6] = Pe, a[7] = nt, a[8] = pe, a[9] = ot;
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
    Zs(this);
    const { buffer: t, blockLen: r } = this, i = (e = ds(e)).length;
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
    Zs(this), ml(e, this), this.finished = !0;
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
  const e = (r, i) => n(i).update(ds(r)).digest(), t = n(new Uint8Array(32));
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (r) => n(r), e;
})(((n) => new Xg(n)));
const tu = (n) => Uint8Array.from(n.split("").map(((e) => e.charCodeAt(0)))), Jg = tu("expand 16-byte k"), e0 = tu("expand 32-byte k"), t0 = ut(Jg), nu = ut(e0);
nu.slice();
function Oe(n, e) {
  return n << e | n >>> 32 - e;
}
function Ba(n) {
  return n.byteOffset % 4 == 0;
}
const Qc = 2 ** 32 - 1, Yc = new Uint32Array();
function ru(n, e) {
  const { allowShortKeys: t, extendNonceFn: r, counterLength: i, counterRight: a, rounds: c } = (function(d, h) {
    if (h == null || typeof h != "object") throw new Error("options must be defined");
    return Object.assign(d, h);
  })({ allowShortKeys: !1, counterLength: 8, counterRight: !1, rounds: 20 }, e);
  if (typeof n != "function") throw new Error("core must be a function");
  return Ra(i), Ra(c), Wc(a), Wc(t), (d, h, p, b, m = 0) => {
    _t(d), _t(h), _t(p);
    const v = p.length;
    if (b || (b = new Uint8Array(v)), _t(b), Ra(m), m < 0 || m >= Qc) throw new Error("arx: counter overflow");
    if (b.length < v) throw new Error(`arx: output (${b.length}) is shorter than data (${v})`);
    const T = [];
    let A, $, L = d.length;
    if (L === 32) A = d.slice(), T.push(A), $ = nu;
    else {
      if (L !== 16 || !t) throw new Error(`arx: invalid 32-byte key, got length=${L}`);
      A = new Uint8Array(32), A.set(d), A.set(d, 16), $ = t0, T.push(A);
    }
    Ba(h) || (h = h.slice(), T.push(h));
    const P = ut(A);
    if (r) {
      if (h.length !== 24) throw new Error("arx: extended nonce must be 24 bytes");
      r($, P, ut(h.subarray(0, 16)), P), h = h.subarray(16);
    }
    const B = 16 - i;
    if (B !== h.length) throw new Error(`arx: nonce must be ${B} or 16 bytes`);
    if (B !== 12) {
      const oe = new Uint8Array(12);
      oe.set(h, a ? 0 : 12 - h.length), h = oe, T.push(h);
    }
    const te = ut(h);
    for (!(function(oe, Y, ee, F, U, S, k, x) {
      const H = U.length, V = new Uint8Array(64), X = ut(V), K = Ba(U) && Ba(S), re = K ? ut(U) : Yc, de = K ? ut(S) : Yc;
      for (let ve = 0; ve < H; k++) {
        if (oe(Y, ee, F, X, k, x), k >= Qc) throw new Error("arx: counter overflow");
        const ce = Math.min(64, H - ve);
        if (K && ce === 64) {
          const $e = ve / 4;
          if (ve % 4 != 0) throw new Error("arx: invalid block position");
          for (let we, Le = 0; Le < 16; Le++) we = $e + Le, de[we] = re[we] ^ X[Le];
          ve += 64;
        } else {
          for (let $e, we = 0; we < ce; we++) $e = ve + we, S[$e] = U[$e] ^ V[we];
          ve += ce;
        }
      }
    })(n, $, P, te, p, b, m, c); T.length > 0; ) T.pop().fill(0);
    return b;
  };
}
function su(n, e, t, r, i, a = 20) {
  let c = n[0], d = n[1], h = n[2], p = n[3], b = e[0], m = e[1], v = e[2], T = e[3], A = e[4], $ = e[5], L = e[6], P = e[7], B = i, te = t[0], oe = t[1], Y = t[2], ee = c, F = d, U = h, S = p, k = b, x = m, H = v, V = T, X = A, K = $, re = L, de = P, ve = B, ce = te, $e = oe, we = Y;
  for (let Ge = 0; Ge < a; Ge += 2) ee = ee + k | 0, ve = Oe(ve ^ ee, 16), X = X + ve | 0, k = Oe(k ^ X, 12), ee = ee + k | 0, ve = Oe(ve ^ ee, 8), X = X + ve | 0, k = Oe(k ^ X, 7), F = F + x | 0, ce = Oe(ce ^ F, 16), K = K + ce | 0, x = Oe(x ^ K, 12), F = F + x | 0, ce = Oe(ce ^ F, 8), K = K + ce | 0, x = Oe(x ^ K, 7), U = U + H | 0, $e = Oe($e ^ U, 16), re = re + $e | 0, H = Oe(H ^ re, 12), U = U + H | 0, $e = Oe($e ^ U, 8), re = re + $e | 0, H = Oe(H ^ re, 7), S = S + V | 0, we = Oe(we ^ S, 16), de = de + we | 0, V = Oe(V ^ de, 12), S = S + V | 0, we = Oe(we ^ S, 8), de = de + we | 0, V = Oe(V ^ de, 7), ee = ee + x | 0, we = Oe(we ^ ee, 16), re = re + we | 0, x = Oe(x ^ re, 12), ee = ee + x | 0, we = Oe(we ^ ee, 8), re = re + we | 0, x = Oe(x ^ re, 7), F = F + H | 0, ve = Oe(ve ^ F, 16), de = de + ve | 0, H = Oe(H ^ de, 12), F = F + H | 0, ve = Oe(ve ^ F, 8), de = de + ve | 0, H = Oe(H ^ de, 7), U = U + V | 0, ce = Oe(ce ^ U, 16), X = X + ce | 0, V = Oe(V ^ X, 12), U = U + V | 0, ce = Oe(ce ^ U, 8), X = X + ce | 0, V = Oe(V ^ X, 7), S = S + k | 0, $e = Oe($e ^ S, 16), K = K + $e | 0, k = Oe(k ^ K, 12), S = S + k | 0, $e = Oe($e ^ S, 8), K = K + $e | 0, k = Oe(k ^ K, 7);
  let Le = 0;
  r[Le++] = c + ee | 0, r[Le++] = d + F | 0, r[Le++] = h + U | 0, r[Le++] = p + S | 0, r[Le++] = b + k | 0, r[Le++] = m + x | 0, r[Le++] = v + H | 0, r[Le++] = T + V | 0, r[Le++] = A + X | 0, r[Le++] = $ + K | 0, r[Le++] = L + re | 0, r[Le++] = P + de | 0, r[Le++] = B + ve | 0, r[Le++] = te + ce | 0, r[Le++] = oe + $e | 0, r[Le++] = Y + we | 0;
}
const iu = ru(su, { counterRight: !1, counterLength: 4, allowShortKeys: !1 });
ru(su, { counterRight: !1, counterLength: 8, extendNonceFn: function(n, e, t, r) {
  let i = n[0], a = n[1], c = n[2], d = n[3], h = e[0], p = e[1], b = e[2], m = e[3], v = e[4], T = e[5], A = e[6], $ = e[7], L = t[0], P = t[1], B = t[2], te = t[3];
  for (let Y = 0; Y < 20; Y += 2) i = i + h | 0, L = Oe(L ^ i, 16), v = v + L | 0, h = Oe(h ^ v, 12), i = i + h | 0, L = Oe(L ^ i, 8), v = v + L | 0, h = Oe(h ^ v, 7), a = a + p | 0, P = Oe(P ^ a, 16), T = T + P | 0, p = Oe(p ^ T, 12), a = a + p | 0, P = Oe(P ^ a, 8), T = T + P | 0, p = Oe(p ^ T, 7), c = c + b | 0, B = Oe(B ^ c, 16), A = A + B | 0, b = Oe(b ^ A, 12), c = c + b | 0, B = Oe(B ^ c, 8), A = A + B | 0, b = Oe(b ^ A, 7), d = d + m | 0, te = Oe(te ^ d, 16), $ = $ + te | 0, m = Oe(m ^ $, 12), d = d + m | 0, te = Oe(te ^ d, 8), $ = $ + te | 0, m = Oe(m ^ $, 7), i = i + p | 0, te = Oe(te ^ i, 16), A = A + te | 0, p = Oe(p ^ A, 12), i = i + p | 0, te = Oe(te ^ i, 8), A = A + te | 0, p = Oe(p ^ A, 7), a = a + b | 0, L = Oe(L ^ a, 16), $ = $ + L | 0, b = Oe(b ^ $, 12), a = a + b | 0, L = Oe(L ^ a, 8), $ = $ + L | 0, b = Oe(b ^ $, 7), c = c + m | 0, P = Oe(P ^ c, 16), v = v + P | 0, m = Oe(m ^ v, 12), c = c + m | 0, P = Oe(P ^ c, 8), v = v + P | 0, m = Oe(m ^ v, 7), d = d + h | 0, B = Oe(B ^ d, 16), T = T + B | 0, h = Oe(h ^ T, 12), d = d + h | 0, B = Oe(B ^ d, 8), T = T + B | 0, h = Oe(h ^ T, 7);
  let oe = 0;
  r[oe++] = i, r[oe++] = a, r[oe++] = c, r[oe++] = d, r[oe++] = L, r[oe++] = P, r[oe++] = B, r[oe++] = te;
}, allowShortKeys: !1 });
class ou extends Rd {
  constructor(e, t) {
    super(), this.finished = !1, this.destroyed = !1, xr.hash(e);
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
    return xr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    xr.exists(this), xr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Oo = (n, e, t) => new ou(n, e).update(t).digest();
function n0(n, e, t) {
  return xr.hash(n), Oo(n, Ii(t), Ii(e));
}
Oo.create = (n, e) => new ou(n, e);
const Ua = new Uint8Array([0]), Xc = new Uint8Array();
function r0(n, e, t, r = 32) {
  if (xr.hash(n), xr.number(r), r > 255 * n.outputLen) throw new Error("Length should be <= 255*HashLen");
  const i = Math.ceil(r / n.outputLen);
  t === void 0 && (t = Xc);
  const a = new Uint8Array(i * n.outputLen), c = Oo.create(n, e), d = c._cloneInto(), h = new Uint8Array(c.outputLen);
  for (let p = 0; p < i; p++) Ua[0] = p + 1, d.update(p === 0 ? Xc : h).update(t).update(Ua).digestInto(h), a.set(h, n.outputLen * p), c._cloneInto(d);
  return c.destroy(), d.destroy(), h.fill(0), Ua.fill(0), a.slice(0, r);
}
var s0 = Object.defineProperty, Zt = (n, e) => {
  for (var t in e) s0(n, t, { get: e[t], enumerable: !0 });
}, ns = Symbol("verified"), i0 = (n) => n instanceof Object;
function No(n) {
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
var au = {};
Zt(au, { Queue: () => cu, QueueNode: () => lu, binarySearch: () => $l, insertEventIntoAscendingList: () => l0, insertEventIntoDescendingList: () => a0, normalizeURL: () => Us, utf8Decoder: () => Nr, utf8Encoder: () => er });
var Nr = new TextDecoder("utf-8"), er = new TextEncoder();
function Us(n) {
  n.indexOf("://") === -1 && (n = "wss://" + n);
  let e = new URL(n);
  return e.pathname = e.pathname.replace(/\/+/g, "/"), e.pathname.endsWith("/") && (e.pathname = e.pathname.slice(0, -1)), (e.port === "80" && e.protocol === "ws:" || e.port === "443" && e.protocol === "wss:") && (e.port = ""), e.searchParams.sort(), e.hash = "", e.toString();
}
function a0(n, e) {
  const [t, r] = $l(n, ((i) => e.id === i.id ? 0 : e.created_at === i.created_at ? -1 : i.created_at - e.created_at));
  return r || n.splice(t, 0, e), n;
}
function l0(n, e) {
  const [t, r] = $l(n, ((i) => e.id === i.id ? 0 : e.created_at === i.created_at ? -1 : e.created_at - i.created_at));
  return r || n.splice(t, 0, e), n;
}
function $l(n, e) {
  let t = 0, r = n.length - 1;
  for (; t <= r; ) {
    const i = Math.floor((t + r) / 2), a = e(n[i]);
    if (a === 0) return [i, !0];
    a < 0 ? r = i - 1 : t = i + 1;
  }
  return [t, !1];
}
var lu = class {
  value;
  next = null;
  prev = null;
  constructor(n) {
    this.value = n;
  }
}, cu = class {
  first;
  last;
  constructor() {
    this.first = null, this.last = null;
  }
  enqueue(n) {
    const e = new lu(n);
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
function du(n) {
  if (!No(n)) throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, n.pubkey, n.created_at, n.kind, n.tags, n.content]);
}
function Ei(n) {
  return nn(As(er.encode(du(n))));
}
var Ro = new class {
  generateSecretKey() {
    return mr.utils.randomPrivateKey();
  }
  getPublicKey(n) {
    return nn(mr.getPublicKey(n));
  }
  finalizeEvent(n, e) {
    const t = n;
    return t.pubkey = nn(mr.getPublicKey(e)), t.id = Ei(t), t.sig = nn(mr.sign(Ei(t), e)), t[ns] = !0, t;
  }
  verifyEvent(n) {
    if (typeof n[ns] == "boolean") return n[ns];
    const e = Ei(n);
    if (e !== n.id) return n[ns] = !1, !1;
    try {
      const t = mr.verify(n.sig, e, n.pubkey);
      return n[ns] = t, t;
    } catch {
      return n[ns] = !1, !1;
    }
  }
}(), uu = Ro.generateSecretKey, kl = Ro.getPublicKey, sr = Ro.finalizeEvent, Ys = Ro.verifyEvent, hu = {};
function fu(n) {
  return 1e3 <= n && n < 1e4 || [1, 2, 4, 5, 6, 7, 8, 16, 40, 41, 42, 43, 44].includes(n);
}
function Al(n) {
  return [0, 3].includes(n) || 1e4 <= n && n < 2e4;
}
function pu(n) {
  return 2e4 <= n && n < 3e4;
}
function Sl(n) {
  return 3e4 <= n && n < 4e4;
}
function c0(n) {
  return fu(n) ? "regular" : Al(n) ? "replaceable" : pu(n) ? "ephemeral" : Sl(n) ? "parameterized" : "unknown";
}
function d0(n, e) {
  const t = e instanceof Array ? e : [e];
  return No(n) && t.includes(n.kind) || !1;
}
Zt(hu, { Application: () => dv, BadgeAward: () => b0, BadgeDefinition: () => rv, BlockedRelaysList: () => H0, BookmarkList: () => U0, Bookmarksets: () => ev, Calendar: () => bv, CalendarEventRSVP: () => mv, ChannelCreation: () => vu, ChannelHideMessage: () => yu, ChannelMessage: () => mu, ChannelMetadata: () => bu, ChannelMuteUser: () => wu, ClassifiedListing: () => fv, ClientAuth: () => _u, CommunitiesList: () => P0, CommunityDefinition: () => xv, CommunityPostApproval: () => S0, Contacts: () => p0, CreateOrUpdateProduct: () => ov, CreateOrUpdateStall: () => iv, Curationsets: () => tv, Date: () => gv, DirectMessageRelaysList: () => Z0, DraftClassifiedListing: () => pv, DraftLong: () => lv, Emojisets: () => cv, EncryptedDirectMessage: () => g0, EventDeletion: () => v0, FileMetadata: () => x0, FileServerPreference: () => V0, Followsets: () => Y0, GenericRepost: () => y0, Genericlists: () => X0, GiftWrap: () => xu, HTTPAuth: () => Tl, Handlerinformation: () => wv, Handlerrecommendation: () => yv, Highlights: () => N0, InterestsList: () => j0, Interestsets: () => sv, JobFeedback: () => T0, JobRequest: () => C0, JobResult: () => I0, Label: () => A0, LightningPubRPC: () => W0, LiveChatMessage: () => _0, LiveEvent: () => uv, LongFormArticle: () => av, Metadata: () => u0, Mutelist: () => R0, NWCWalletInfo: () => G0, NWCWalletRequest: () => Eu, NWCWalletResponse: () => K0, NostrConnect: () => Q0, OpenTimestamps: () => w0, Pinlist: () => M0, PrivateDirectMessage: () => m0, ProblemTracker: () => E0, ProfileBadges: () => nv, PublicChatsList: () => z0, Reaction: () => Il, RecommendRelay: () => f0, RelayList: () => B0, Relaysets: () => J0, Report: () => $0, Reporting: () => k0, Repost: () => Cl, Seal: () => gu, SearchRelaysList: () => q0, ShortTextNote: () => h0, Time: () => vv, UserEmojiList: () => F0, UserStatuses: () => hv, Zap: () => O0, ZapGoal: () => L0, ZapRequest: () => D0, classifyKind: () => c0, isEphemeralKind: () => pu, isKind: () => d0, isParameterizedReplaceableKind: () => Sl, isRegularKind: () => fu, isReplaceableKind: () => Al });
var u0 = 0, h0 = 1, f0 = 2, p0 = 3, g0 = 4, v0 = 5, Cl = 6, Il = 7, b0 = 8, gu = 13, m0 = 14, y0 = 16, vu = 40, bu = 41, mu = 42, yu = 43, wu = 44, w0 = 1040, xu = 1059, x0 = 1063, _0 = 1311, E0 = 1971, $0 = 1984, k0 = 1984, A0 = 1985, S0 = 4550, C0 = 5999, I0 = 6999, T0 = 7e3, L0 = 9041, D0 = 9734, O0 = 9735, N0 = 9802, R0 = 1e4, M0 = 10001, B0 = 10002, U0 = 10003, P0 = 10004, z0 = 10005, H0 = 10006, q0 = 10007, j0 = 10015, F0 = 10030, Z0 = 10050, V0 = 10096, G0 = 13194, W0 = 21e3, _u = 22242, Eu = 23194, K0 = 23195, Q0 = 24133, Tl = 27235, Y0 = 3e4, X0 = 30001, J0 = 30002, ev = 30003, tv = 30004, nv = 30008, rv = 30009, sv = 30015, iv = 30017, ov = 30018, av = 30023, lv = 30024, cv = 30030, dv = 30078, uv = 30311, hv = 30315, fv = 30402, pv = 30403, gv = 31922, vv = 31923, bv = 31924, mv = 31925, yv = 31989, wv = 31990, xv = 34550;
function $u(n, e) {
  if (n.ids && n.ids.indexOf(e.id) === -1 || n.kinds && n.kinds.indexOf(e.kind) === -1 || n.authors && n.authors.indexOf(e.pubkey) === -1) return !1;
  for (let t in n) if (t[0] === "#") {
    let r = n[`#${t.slice(1)}`];
    if (r && !e.tags.find((([i, a]) => i === t.slice(1) && r.indexOf(a) !== -1))) return !1;
  }
  return !(n.since && e.created_at < n.since) && !(n.until && e.created_at > n.until);
}
function ku(n, e) {
  for (let t = 0; t < n.length; t++) if ($u(n[t], e)) return !0;
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
  return Math.min(Math.max(0, n.limit ?? 1 / 0), n.ids?.length ?? 1 / 0, n.authors?.length && n.kinds?.every(((e) => Al(e))) ? n.authors.length * n.kinds.length : 1 / 0, n.authors?.length && n.kinds?.every(((e) => Sl(e))) && n["#d"]?.length ? n.authors.length * n.kinds.length * n["#d"].length : 1 / 0);
}
var Au = {};
function Mo(n, e) {
  let t = e.length + 3, r = n.indexOf(`"${e}":`) + t, i = n.slice(r).indexOf('"') + r + 1;
  return n.slice(i, i + 64);
}
function Su(n, e) {
  let t = e.length, r = n.indexOf(`"${e}":`) + t + 3, i = n.slice(r), a = Math.min(i.indexOf(","), i.indexOf("}"));
  return parseInt(i.slice(0, a), 10);
}
function Cu(n) {
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
  return e === Su(n, "kind");
}
Zt(Au, { getHex64: () => Mo, getInt: () => Su, getSubscriptionId: () => Cu, matchEventId: () => $v, matchEventKind: () => Av, matchEventPubkey: () => kv });
var Iu = {};
function Tu(n, e) {
  return { kind: _u, created_at: Math.floor(Date.now() / 1e3), tags: [["relay", n], ["challenge", e]], content: "" };
}
async function Sv() {
  return new Promise(((n) => {
    const e = new MessageChannel(), t = () => {
      e.port1.removeEventListener("message", t), n();
    };
    e.port1.addEventListener("message", t), e.port2.postMessage(0), e.port1.start();
  }));
}
Zt(Iu, { makeAuthEvent: () => Tu });
var Lu, Cv = (n) => (n[ns] = !0, !0), Ll = class {
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
  incomingMessageQueue = new cu();
  queueRunning = !1;
  challenge;
  serial = 0;
  verifyEvent;
  _WebSocket;
  constructor(n, e) {
    this.url = Us(n), this.verifyEvent = e.verifyEvent, this._WebSocket = e.websocketImplementation || WebSocket;
  }
  static async connect(n, e) {
    const t = new Ll(n, e);
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
    const e = Cu(n);
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
          return void (this.verifyEvent(i) && ku(r.filters, i) && r.onevent(i));
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
    const e = await n(Tu(this.url, this.challenge)), t = new Promise(((r, i) => {
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
  Lu = WebSocket;
} catch {
}
var Du, Ou = class extends Ll {
  constructor(n) {
    super(n, { verifyEvent: Ys, websocketImplementation: Lu });
  }
  static async connect(n) {
    const e = new Ou(n);
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
    n = Us(n);
    let t = this.relays.get(n);
    return t || (t = new Ll(n, { verifyEvent: this.trustedRelayURLs.has(n) ? Cv : this.verifyEvent, websocketImplementation: this._WebSocket }), e?.connectionTimeout && (t.connectionTimeout = e.connectionTimeout), this.relays.set(n, t)), await t.connect(), t;
  }
  close(n) {
    n.map(Us).forEach(((e) => {
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
    const p = (m) => {
      if (e.alreadyHaveEvent?.(m)) return !0;
      const v = t.has(m);
      return t.add(m), v;
    }, b = Promise.all(Object.entries(n).map((async (m, v, T) => {
      if (T.indexOf(m) !== v) return void h(v, "duplicate url");
      let A, [$, L] = m;
      $ = Us($);
      try {
        A = await this.ensureRelay($, { connectionTimeout: e.maxWait ? Math.max(0.8 * e.maxWait, e.maxWait - 1e3) : void 0 });
      } catch (B) {
        return void h(v, B?.message || String(B));
      }
      let P = A.subscribe(L, { ...e, oneose: () => c(v), onclose: (B) => h(v, B), alreadyHaveEvent: p, eoseTimeout: e.maxWait });
      r.push(P);
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
    return n.map(Us).map((async (t, r, i) => {
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
  Du = WebSocket;
} catch {
}
var Lv = class extends Tv {
  constructor() {
    super({ verifyEvent: Ys, websocketImplementation: Du });
  }
}, Nu = {};
Zt(Nu, { BECH32_REGEX: () => Ru, Bech32MaxSize: () => Dl, NostrTypeGuard: () => Dv, decode: () => Ni, encodeBytes: () => Uo, naddrEncode: () => Uv, neventEncode: () => Bv, noteEncode: () => Rv, nprofileEncode: () => Mv, npubEncode: () => Nv, nsecEncode: () => Ov });
var Dv = { isNProfile: (n) => /^nprofile1[a-z\d]+$/.test(n || ""), isNEvent: (n) => /^nevent1[a-z\d]+$/.test(n || ""), isNAddr: (n) => /^naddr1[a-z\d]+$/.test(n || ""), isNSec: (n) => /^nsec1[a-z\d]{58}$/.test(n || ""), isNPub: (n) => /^npub1[a-z\d]{58}$/.test(n || ""), isNote: (n) => /^note1[a-z\d]+$/.test(n || ""), isNcryptsec: (n) => /^ncryptsec1[a-z\d]+$/.test(n || "") }, Dl = 5e3, Ru = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function Ni(n) {
  let { prefix: e, words: t } = Fs.decode(n, Dl), r = new Uint8Array(Fs.fromWords(t));
  switch (e) {
    case "nprofile": {
      let i = Pa(r);
      if (!i[0]?.[0]) throw new Error("missing TLV 0 for nprofile");
      if (i[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
      return { type: "nprofile", data: { pubkey: nn(i[0][0]), relays: i[1] ? i[1].map(((a) => Nr.decode(a))) : [] } };
    }
    case "nevent": {
      let i = Pa(r);
      if (!i[0]?.[0]) throw new Error("missing TLV 0 for nevent");
      if (i[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
      if (i[2] && i[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
      if (i[3] && i[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
      return { type: "nevent", data: { id: nn(i[0][0]), relays: i[1] ? i[1].map(((a) => Nr.decode(a))) : [], author: i[2]?.[0] ? nn(i[2][0]) : void 0, kind: i[3]?.[0] ? parseInt(nn(i[3][0]), 16) : void 0 } };
    }
    case "naddr": {
      let i = Pa(r);
      if (!i[0]?.[0]) throw new Error("missing TLV 0 for naddr");
      if (!i[2]?.[0]) throw new Error("missing TLV 2 for naddr");
      if (i[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
      if (!i[3]?.[0]) throw new Error("missing TLV 3 for naddr");
      if (i[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
      return { type: "naddr", data: { identifier: Nr.decode(i[0][0]), pubkey: nn(i[2][0]), kind: parseInt(nn(i[3][0]), 16), relays: i[1] ? i[1].map(((a) => Nr.decode(a))) : [] } };
    }
    case "nsec":
      return { type: e, data: r };
    case "npub":
    case "note":
      return { type: e, data: nn(r) };
    default:
      throw new Error(`unknown prefix ${e}`);
  }
}
function Pa(n) {
  let e = {}, t = n;
  for (; t.length > 0; ) {
    let r = t[0], i = t[1], a = t.slice(2, 2 + i);
    if (t = t.slice(2 + i), a.length < i) throw new Error(`not enough data to read on TLV ${r}`);
    e[r] = e[r] || [], e[r].push(a);
  }
  return e;
}
function Ov(n) {
  return Uo("nsec", n);
}
function Nv(n) {
  return Uo("npub", js(n));
}
function Rv(n) {
  return Uo("note", js(n));
}
function Bo(n, e) {
  let t = Fs.toWords(e);
  return Fs.encode(n, t, Dl);
}
function Uo(n, e) {
  return Bo(n, e);
}
function Mv(n) {
  return Bo("nprofile", Ol({ 0: [js(n.pubkey)], 1: (n.relays || []).map(((e) => er.encode(e))) }));
}
function Bv(n) {
  let e;
  return n.kind !== void 0 && (e = (function(t) {
    const r = new Uint8Array(4);
    return r[0] = t >> 24 & 255, r[1] = t >> 16 & 255, r[2] = t >> 8 & 255, r[3] = 255 & t, r;
  })(n.kind)), Bo("nevent", Ol({ 0: [js(n.id)], 1: (n.relays || []).map(((t) => er.encode(t))), 2: n.author ? [js(n.author)] : [], 3: e ? [new Uint8Array(e)] : [] }));
}
function Uv(n) {
  let e = new ArrayBuffer(4);
  return new DataView(e).setUint32(0, n.kind, !1), Bo("naddr", Ol({ 0: [er.encode(n.identifier)], 1: (n.relays || []).map(((t) => er.encode(t))), 2: [js(n.pubkey)], 3: [new Uint8Array(e)] }));
}
function Ol(n) {
  let e = [];
  return Object.entries(n).reverse().forEach((([t, r]) => {
    r.forEach(((i) => {
      let a = new Uint8Array(i.length + 2);
      a.set([parseInt(t)], 0), a.set([i.length], 1), a.set(i, 2), e.push(a);
    }));
  })), Lo(...e);
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
async function Bu(n, e, t) {
  const r = n instanceof Uint8Array ? nn(n) : n, i = Uu(Gs.getSharedSecret(r, "02" + e));
  let a = Uint8Array.from(Bd(16)), c = er.encode(t), d = Jd(i, a).encrypt(c);
  return `${cs.encode(new Uint8Array(d))}?iv=${cs.encode(new Uint8Array(a.buffer))}`;
}
async function Hv(n, e, t) {
  const r = n instanceof Uint8Array ? nn(n) : n;
  let [i, a] = t.split("?iv="), c = Uu(Gs.getSharedSecret(r, "02" + e)), d = cs.decode(a), h = cs.decode(i), p = Jd(c, d).decrypt(h);
  return Nr.decode(p);
}
function Uu(n) {
  return n.slice(1, 33);
}
Zt(Mu, { decrypt: () => Hv, encrypt: () => Bu });
var Pu = {};
Zt(Pu, { NIP05_REGEX: () => Nl, isNip05: () => qv, isValid: () => Zv, queryProfile: () => zu, searchDomain: () => Fv, useFetchImplementation: () => jv });
var Po, Nl = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, qv = (n) => Nl.test(n || "");
try {
  Po = fetch;
} catch {
}
function jv(n) {
  Po = n;
}
async function Fv(n, e = "") {
  try {
    const t = `https://${n}/.well-known/nostr.json?name=${e}`, r = await Po(t, { redirect: "manual" });
    if (r.status !== 200) throw Error("Wrong response code");
    return (await r.json()).names;
  } catch {
    return {};
  }
}
async function zu(n) {
  const e = n.match(Nl);
  if (!e) return null;
  const [, t = "_", r] = e;
  try {
    const i = `https://${r}/.well-known/nostr.json?name=${t}`, a = await Po(i, { redirect: "manual" });
    if (a.status !== 200) throw Error("Wrong response code");
    const c = await a.json(), d = c.names[t];
    return d ? { pubkey: d, relays: c.relays?.[d] } : null;
  } catch {
    return null;
  }
}
async function Zv(n, e) {
  const t = await zu(e);
  return !!t && t.pubkey === n;
}
var Hu = {};
function Vv(n) {
  const e = { reply: void 0, root: void 0, mentions: [], profiles: [], quotes: [] };
  let t, r;
  for (let i = n.tags.length - 1; i >= 0; i--) {
    const a = n.tags[i];
    if (a[0] === "e" && a[1]) {
      const [c, d, h, p, b] = a, m = { id: d, relays: h ? [h] : [], author: b };
      if (p === "root") {
        e.root = m;
        continue;
      }
      if (p === "reply") {
        e.reply = m;
        continue;
      }
      if (p === "mention") {
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
Zt(Hu, { parse: () => Vv });
var qu = {};
Zt(qu, { fetchRelayInformation: () => Wv, useFetchImplementation: () => Gv });
function Gv(n) {
}
async function Wv(n) {
  return await (await fetch(n.replace("ws://", "http://").replace("wss://", "https://"), { headers: { Accept: "application/nostr+json" } })).json();
}
var ju = {};
function Fu(n) {
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
    if (a !== r.created_at && (t = 0, r.created_at = a), i[1] = (++t).toString(), r.id = Zu(r), Fu(r.id) >= e) break;
  }
  return r;
}
function Zu(n) {
  return nn(As(er.encode(JSON.stringify([0, n.pubkey, n.created_at, n.kind, n.tags, n.content]))));
}
Zt(ju, { fastEventHash: () => Zu, getPow: () => Fu, minePow: () => Kv });
var Vu = {};
function Qv(n, e, t, r) {
  return sr({ kind: Cl, tags: [...n.tags ?? [], ["e", e.id, t], ["p", e.pubkey]], content: n.content === "" ? "" : JSON.stringify(e), created_at: n.created_at }, r);
}
function Gu(n) {
  if (n.kind !== Cl) return;
  let e, t;
  for (let r = n.tags.length - 1; r >= 0 && (e === void 0 || t === void 0); r--) {
    const i = n.tags[r];
    i.length >= 2 && (i[0] === "e" && e === void 0 ? e = i : i[0] === "p" && t === void 0 && (t = i));
  }
  return e !== void 0 ? { id: e[1], relays: [e[2], t?.[2]].filter(((r) => typeof r == "string")), author: t?.[1] } : void 0;
}
function Yv(n, { skipVerification: e } = {}) {
  const t = Gu(n);
  if (t === void 0 || n.content === "") return;
  let r;
  try {
    r = JSON.parse(n.content);
  } catch {
    return;
  }
  return r.id === t.id && (e || Ys(r)) ? r : void 0;
}
Zt(Vu, { finishRepostEvent: () => Qv, getRepostedEvent: () => Yv, getRepostedEventPointer: () => Gu });
var Wu = {};
Zt(Wu, { NOSTR_URI_REGEX: () => zo, parse: () => Jv, test: () => Xv });
var zo = new RegExp(`nostr:(${Ru.source})`);
function Xv(n) {
  return typeof n == "string" && new RegExp(`^${zo.source}$`).test(n);
}
function Jv(n) {
  const e = n.match(new RegExp(`^${zo.source}$`));
  if (!e) throw new Error(`Invalid Nostr URI: ${n}`);
  return { uri: e[0], value: e[1], decoded: Ni(e[1]) };
}
var Ku = {};
function eb(n, e, t) {
  const r = e.tags.filter(((i) => i.length >= 2 && (i[0] === "e" || i[0] === "p")));
  return sr({ ...n, kind: Il, tags: [...n.tags ?? [], ...r, ["e", e.id], ["p", e.pubkey]], content: n.content ?? "+" }, t);
}
function tb(n) {
  if (n.kind !== Il) return;
  let e, t;
  for (let r = n.tags.length - 1; r >= 0 && (e === void 0 || t === void 0); r--) {
    const i = n.tags[r];
    i.length >= 2 && (i[0] === "e" && e === void 0 ? e = i : i[0] === "p" && t === void 0 && (t = i));
  }
  return e !== void 0 && t !== void 0 ? { id: e[1], relays: [e[2], t[2]].filter(((r) => r !== void 0)), author: t[1] } : void 0;
}
Zt(Ku, { finishReactionEvent: () => eb, getReactedEventPointer: () => tb });
var Qu = {};
Zt(Qu, { matchAll: () => nb, regex: () => Rl, replaceAll: () => rb });
var Rl = () => new RegExp(`\\b${zo.source}\\b`, "g");
function* nb(n) {
  const e = n.matchAll(Rl());
  for (const t of e) try {
    const [r, i] = t;
    yield { uri: r, value: i, decoded: Ni(i), start: t.index, end: t.index + r.length };
  } catch {
  }
}
function rb(n, e) {
  return n.replaceAll(Rl(), ((t, r) => e({ uri: t, value: r, decoded: Ni(r) })));
}
var Yu = {};
Zt(Yu, { channelCreateEvent: () => sb, channelHideMessageEvent: () => ab, channelMessageEvent: () => ob, channelMetadataEvent: () => ib, channelMuteUserEvent: () => lb });
var sb = (n, e) => {
  let t;
  if (typeof n.content == "object") t = JSON.stringify(n.content);
  else {
    if (typeof n.content != "string") return;
    t = n.content;
  }
  return sr({ kind: vu, tags: [...n.tags ?? []], content: t, created_at: n.created_at }, e);
}, ib = (n, e) => {
  let t;
  if (typeof n.content == "object") t = JSON.stringify(n.content);
  else {
    if (typeof n.content != "string") return;
    t = n.content;
  }
  return sr({ kind: bu, tags: [["e", n.channel_create_event_id], ...n.tags ?? []], content: t, created_at: n.created_at }, e);
}, ob = (n, e) => {
  const t = [["e", n.channel_create_event_id, n.relay_url, "root"]];
  return n.reply_to_channel_message_event_id && t.push(["e", n.reply_to_channel_message_event_id, n.relay_url, "reply"]), sr({ kind: mu, tags: [...t, ...n.tags ?? []], content: n.content, created_at: n.created_at }, e);
}, ab = (n, e) => {
  let t;
  if (typeof n.content == "object") t = JSON.stringify(n.content);
  else {
    if (typeof n.content != "string") return;
    t = n.content;
  }
  return sr({ kind: yu, tags: [["e", n.channel_message_event_id], ...n.tags ?? []], content: t, created_at: n.created_at }, e);
}, lb = (n, e) => {
  let t;
  if (typeof n.content == "object") t = JSON.stringify(n.content);
  else {
    if (typeof n.content != "string") return;
    t = n.content;
  }
  return sr({ kind: wu, tags: [["p", n.pubkey_to_mute], ...n.tags ?? []], content: t, created_at: n.created_at }, e);
}, Xu = {};
Zt(Xu, { EMOJI_SHORTCODE_REGEX: () => Ju, matchAll: () => cb, regex: () => Ml, replaceAll: () => db });
var Ju = /:(\w+):/, Ml = () => new RegExp(`\\B${Ju.source}\\B`, "g");
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
var Bl, eh = {};
Zt(eh, { useFetchImplementation: () => ub, validateGithub: () => hb });
try {
  Bl = fetch;
} catch {
}
function ub(n) {
  Bl = n;
}
async function hb(n, e, t) {
  try {
    return await (await Bl(`https://gist.github.com/${e}/${t}/raw`)).text() === `Verifying that I control the following Nostr public key: ${n}`;
  } catch {
    return !1;
  }
}
var th = {};
Zt(th, { decrypt: () => Hl, encrypt: () => zl, getConversationKey: () => Ul, v2: () => pb });
var nh = 1, rh = 65535;
function Ul(n, e) {
  const t = Gs.getSharedSecret(n, "02" + e).subarray(1, 33);
  return n0(As, t, "nip44-v2");
}
function sh(n, e) {
  const t = r0(As, n, e, 76);
  return { chacha_key: t.subarray(0, 32), chacha_nonce: t.subarray(32, 44), hmac_key: t.subarray(44, 76) };
}
function Pl(n) {
  if (!Number.isSafeInteger(n) || n < 1) throw new Error("expected positive integer");
  if (n <= 32) return 32;
  const e = 1 << Math.floor(Math.log2(n - 1)) + 1, t = e <= 256 ? 32 : e / 8;
  return t * (Math.floor((n - 1) / t) + 1);
}
function fb(n) {
  const e = er.encode(n), t = e.length;
  return Lo((function(r) {
    if (!Number.isSafeInteger(r) || r < nh || r > rh) throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
    const i = new Uint8Array(2);
    return new DataView(i.buffer).setUint16(0, r, !1), i;
  })(t), e, new Uint8Array(Pl(t) - t));
}
function ih(n, e, t) {
  if (t.length !== 32) throw new Error("AAD associated data must be 32 bytes");
  const r = Lo(t, e);
  return Oo(As, n, r);
}
function zl(n, e, t = Bd(32)) {
  const { chacha_key: r, chacha_nonce: i, hmac_key: a } = sh(e, t), c = fb(n), d = iu(r, i, c), h = ih(a, d, t);
  return cs.encode(Lo(new Uint8Array([2]), t, d, h));
}
function Hl(n, e) {
  const { nonce: t, ciphertext: r, mac: i } = (function(h) {
    if (typeof h != "string") throw new Error("payload must be a valid string");
    const p = h.length;
    if (p < 132 || p > 87472) throw new Error("invalid payload length: " + p);
    if (h[0] === "#") throw new Error("unknown encryption version");
    let b;
    try {
      b = cs.decode(h);
    } catch (T) {
      throw new Error("invalid base64: " + T.message);
    }
    const m = b.length;
    if (m < 99 || m > 65603) throw new Error("invalid data length: " + m);
    const v = b[0];
    if (v !== 2) throw new Error("unknown encryption version " + v);
    return { nonce: b.subarray(1, 33), ciphertext: b.subarray(33, -32), mac: b.subarray(-32) };
  })(n), { chacha_key: a, chacha_nonce: c, hmac_key: d } = sh(e, t);
  if (!wl(ih(d, r, t), i)) throw new Error("invalid MAC");
  return (function(h) {
    const p = new DataView(h.buffer).getUint16(0), b = h.subarray(2, 2 + p);
    if (p < nh || p > rh || b.length !== p || h.length !== 2 + Pl(p)) throw new Error("invalid padding");
    return Nr.decode(b);
  })(iu(a, c, r));
}
var pb = { utils: { getConversationKey: Ul, calcPaddedLen: Pl }, encrypt: zl, decrypt: Hl }, oh = {};
function gb(n) {
  const { pathname: e, searchParams: t } = new URL(n), r = e, i = t.get("relay"), a = t.get("secret");
  if (!r || !i || !a) throw new Error("invalid connection string");
  return { pubkey: r, relay: i, secret: a };
}
async function vb(n, e, t) {
  const r = { method: "pay_invoice", params: { invoice: t } }, i = await Bu(e, n, JSON.stringify(r)), a = { kind: Eu, created_at: Math.round(Date.now() / 1e3), content: i, tags: [["p", n]] };
  return sr(a, e);
}
Zt(oh, { makeNwcRequestEvent: () => vb, parseConnectionString: () => gb });
var ql, ah = {};
Zt(ah, { getZapEndpoint: () => mb, makeZapReceipt: () => xb, makeZapRequest: () => yb, useFetchImplementation: () => bb, validateZapRequest: () => wb });
try {
  ql = fetch;
} catch {
}
function bb(n) {
  ql = n;
}
async function mb(n) {
  try {
    let e = "", { lud06: t, lud16: r } = JSON.parse(n.content);
    if (t) {
      let { words: c } = Fs.decode(t, 1e3), d = Fs.fromWords(c);
      e = Nr.decode(d);
    } else {
      if (!r) return null;
      {
        let [c, d] = r.split("@");
        e = new URL(`/.well-known/lnurlp/${c}`, `https://${d}`).toString();
      }
    }
    let i = await ql(e), a = await i.json();
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
  if (!No(e)) return "Zap request is not a valid Nostr event.";
  if (!Ys(e)) return "Invalid signature on zap request.";
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
var lh = {};
Zt(lh, { createRumor: () => fh, createSeal: () => ph, createWrap: () => gh, unwrapEvent: () => vh, unwrapManyEvents: () => Eb, wrapEvent: () => nl, wrapManyEvents: () => _b });
var ch = () => Math.round(Date.now() / 1e3), dh = () => Math.round(ch() - 172800 * Math.random()), uh = (n, e) => Ul(n, e), hh = (n, e, t) => zl(JSON.stringify(n), uh(e, t)), Jc = (n, e) => JSON.parse(Hl(n.content, uh(e, n.pubkey)));
function fh(n, e) {
  const t = { created_at: ch(), content: "", tags: [], ...n, pubkey: kl(e) };
  return t.id = Ei(t), t;
}
function ph(n, e, t) {
  return sr({ kind: gu, content: hh(n, e, t), created_at: dh(), tags: [] }, e);
}
function gh(n, e) {
  const t = uu();
  return sr({ kind: xu, content: hh(n, t, e), created_at: dh(), tags: [["p", e]] }, t);
}
function nl(n, e, t) {
  return gh(ph(fh(n, e), e, t), t);
}
function _b(n, e, t) {
  if (!t || t.length === 0) throw new Error("At least one recipient is required.");
  const r = kl(e), i = [nl(n, e, r)];
  return t.forEach(((a) => {
    i.push(nl(n, e, a));
  })), i;
}
function vh(n, e) {
  const t = Jc(n, e);
  return Jc(t, e);
}
function Eb(n, e) {
  let t = [];
  return n.forEach(((r) => {
    t.push(vh(r, e));
  })), t.sort(((r, i) => r.created_at - i.created_at)), t;
}
var bh = {};
Zt(bh, { getToken: () => $b, hashPayload: () => jl, unpackEventFromToken: () => yh, validateEvent: () => kh, validateEventKind: () => xh, validateEventMethodTag: () => Eh, validateEventPayloadTag: () => $h, validateEventTimestamp: () => wh, validateEventUrlTag: () => _h, validateToken: () => kb });
var mh = "Nostr ";
async function $b(n, e, t, r = !1, i) {
  const a = { kind: Tl, tags: [["u", n], ["method", e]], created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3), content: "" };
  i && a.tags.push(["payload", jl(i)]);
  const c = await t(a);
  return (r ? mh : "") + cs.encode(er.encode(JSON.stringify(c)));
}
async function kb(n, e, t) {
  const r = await yh(n).catch(((i) => {
    throw i;
  }));
  return await kh(r, e, t).catch(((i) => {
    throw i;
  }));
}
async function yh(n) {
  if (!n) throw new Error("Missing token");
  n = n.replace(mh, "");
  const e = Nr.decode(cs.decode(n));
  if (!e || e.length === 0 || !e.startsWith("{")) throw new Error("Invalid token");
  return JSON.parse(e);
}
function wh(n) {
  return !!n.created_at && Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - n.created_at < 60;
}
function xh(n) {
  return n.kind === Tl;
}
function _h(n, e) {
  const t = n.tags.find(((r) => r[0] === "u"));
  return !!t && t.length > 0 && t[1] === e;
}
function Eh(n, e) {
  const t = n.tags.find(((r) => r[0] === "method"));
  return !!t && t.length > 0 && t[1].toLowerCase() === e.toLowerCase();
}
function jl(n) {
  return nn(As(er.encode(JSON.stringify(n))));
}
function $h(n, e) {
  const t = n.tags.find(((i) => i[0] === "payload"));
  if (!t) return !1;
  const r = jl(e);
  return t.length > 0 && t[1] === r;
}
async function kh(n, e, t, r) {
  if (!Ys(n)) throw new Error("Invalid nostr event, signature invalid");
  if (!xh(n)) throw new Error("Invalid nostr event, kind invalid");
  if (!wh(n)) throw new Error("Invalid nostr event, created_at timestamp invalid");
  if (!_h(n, e)) throw new Error("Invalid nostr event, url tag invalid");
  if (!Eh(n, t)) throw new Error("Invalid nostr event, method tag invalid");
  if (r && typeof r == "object" && Object.keys(r).length > 0 && !$h(n, r)) throw new Error("Invalid nostr event, payload tag does not match request body hash");
  return !0;
}
const Qe = { LIBRARIES: { decodeBolt11: vg.decode, NostrTools: Za }, DEFAULT_OPTIONS: { theme: "light", colorMode: !0 }, BATCH_SIZE: 5, REQ_CONFIG: { INITIAL_LOAD_COUNT: 15, ADDITIONAL_LOAD_COUNT: 20 }, LOAD_TIMEOUT: 1e4, BUFFER_INTERVAL: 500, BUFFER_MIN_INTERVAL: 100, INFINITE_SCROLL: { ROOT_MARGIN: "400px", THRESHOLD: 0.1, DEBOUNCE_TIME: 500, RETRY_DELAY: 500 }, ZAP_CONFIG: { DEFAULT_LIMIT: 1, DEFAULT_COLOR_MODE: !0, ERRORS: { DIALOG_NOT_FOUND: "Zap dialog not found", BUTTON_NOT_FOUND: "Fetch button not found", DECODE_FAILED: "Failed to decode identifier" } }, ZAP_AMOUNT_CONFIG: { DEFAULT_COLOR_MODE: !0, THRESHOLDS: [{ value: 1e4, className: "zap-amount-10k" }, { value: 5e3, className: "zap-amount-5k" }, { value: 2e3, className: "zap-amount-2k" }, { value: 1e3, className: "zap-amount-1k" }, { value: 500, className: "zap-amount-500" }, { value: 200, className: "zap-amount-200" }, { value: 100, className: "zap-amount-100" }], DEFAULT_CLASS: "default-color", DISABLED_CLASS: "" }, DIALOG_CONFIG: { DEFAULT_TITLE: "To ", NO_ZAPS_MESSAGE: "No Zaps yet!<br>Send the first Zap!", DEFAULT_NO_ZAPS_DELAY: 1500, ZAP_LIST: { INITIAL_BATCH: 30, REMAINING_BATCH: 30, PROFILE_BATCH: 30, MIN_HEIGHT: "100px" } }, REQUEST_CONFIG: { METADATA_TIMEOUT: 2e4, REQUEST_TIMEOUT: 2e3, CACHE_DURATION: 3e5 }, PROFILE_CONFIG: { BATCH_SIZE: 20, BATCH_DELAY: 100, RELAYS: ["wss://relay.nostr.band", "wss://purplepag.es", "wss://relay.damus.io", "wss://nostr.wine", "wss://directory.yabu.me"] }, BATCH_CONFIG: { REFERENCE_PROCESSOR: { BATCH_SIZE: 20, BATCH_DELAY: 100 }, SUPPORTED_EVENT_KINDS: [1, 30023, 30030, 30009, 40, 42, 31990] }, BATCH_PROCESSOR_CONFIG: { DEFAULT_BATCH_SIZE: 20, DEFAULT_BATCH_DELAY: 100, DEFAULT_MAX_CACHE_AGE: 18e5, DEFAULT_RELAY_URLS: [], TIMEOUT_DURATION: 500 } };
class Ti {
  constructor(e, t, r = null) {
    this.identifier = e, this.relayUrls = t, this.isColorModeEnabled = r === null ? Qe.ZAP_CONFIG.DEFAULT_COLOR_MODE : String(r).toLowerCase() === "true";
  }
  static determineColorMode(e) {
    if (!e || !e.hasAttribute("data-zap-color-mode")) return Qe.ZAP_CONFIG.DEFAULT_COLOR_MODE;
    const t = e.getAttribute("data-zap-color-mode");
    return t.toLowerCase() !== "true" && t.toLowerCase() !== "false" || t.toLowerCase() === "true";
  }
  static fromButton(e) {
    if (!e) throw new Error(Qe.ZAP_CONFIG.ERRORS.BUTTON_NOT_FOUND);
    const t = Ti.determineColorMode(e);
    return new Ti(e.getAttribute("data-nzv-id"), e.getAttribute("data-relay-urls").split(","), t);
  }
}
class Pr {
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
class Fl extends Pr {
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
class Ab extends Pr {
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
class Sb extends Pr {
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
class Cb extends Pr {
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
class Ib extends Pr {
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
class Tb extends Pr {
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
class Lb extends Pr {
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
class Db extends Fl {
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
class Ob extends Fl {
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
    this.profileCache = new Fl(), this.zapEventCache = new Ab(), this.referenceCache = new Sb(), this.statsCache = new Cb(), this.decodedCache = new Ib(), this.loadStateCache = new Tb(), this.zapInfoCache = new Lb(), this.imageCache = new Db(), this.nip05Cache = new Ob(), this.nip05PendingCache = new Pr(), this.#n = ["zapInfo", "uiComponent", "decoded", "nip05", "nip05PendingFetches", "zapLoadStates", "imageCache", "isEventIdentifier"].reduce(((e, t) => (e[t] = new Pr(), e)), {}), this.viewStats = /* @__PURE__ */ new Map(), this.viewStates = /* @__PURE__ */ new Map(), $i.#e = this;
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
    return { stats: (await Promise.all([this.getCachedStats(e, t.identifier)]))[0], hasEnoughCachedEvents: r.length >= Qe.REQ_CONFIG.INITIAL_LOAD_COUNT, hasReferences: i };
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
const Ue = new $i(), ed = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMDYuMzMgMjA2LjMzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICA8ZGVmcz4KICAgICAgPHN0eWxlPgogICAgICAgICAuY2xzLTEgewogICAgICAgICAgICBmaWxsOiBub25lOwogICAgICAgICB9CgogICAgICAgICAuY2xzLTIgewogICAgICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgICB9CgogICAgICAgICAuY2xzLTMgewogICAgICAgICAgICBmaWxsOiAjNjY2OwogICAgICAgICB9CiAgICAgIDwvc3R5bGU+CiAgIDwvZGVmcz4KICAgPHBhdGggY2xhc3M9ImNscy0yIgogICAgICBkPSJtMjA2LjMzIDEzNC4zOWMwIDIwLjcxIDAgMzEuMDctMy41MyA0Mi4yMi00LjQzIDEyLjE3LTE0LjAyIDIxLjc2LTI2LjE5IDI2LjE5LTExLjE1IDMuNTMtMjEuNSAzLjUzLTQyLjIyIDMuNTNoLTYyLjQ2Yy0yMC43MSAwLTMxLjA2IDAtNDIuMjEtMy41My0xMi4xNy00LjQzLTIxLjc2LTE0LjAyLTI2LjE5LTI2LjE5LTMuNTMtMTEuMTUtMy41My0yMS41LTMuNTMtNDIuMjJ2LTYyLjQ2YzAtMjAuNzEgMC0zMS4wNyAzLjUzLTQyLjIyIDQuNDMtMTIuMTcgMTQuMDItMjEuNzYgMjYuMTktMjYuMTkgMTEuMTUtMy41MiAyMS41LTMuNTIgNDIuMjEtMy41Mmg2Mi40NmMyMC43MSAwIDMxLjA3IDAgNDIuMjIgMy41MiAxMi4xNyA0LjQzIDIxLjc2IDE0LjAyIDI2LjE5IDI2LjE5IDMuNTMgMTEuMTUgMy41MyAyMS41IDMuNTMgNDIuMjJ6IiAvPgogICA8cGF0aCBjbGFzcz0iY2xzLTMiCiAgICAgIGQ9Im0xODUuOTggOTEuMXY4My4yM2MwIDMuMTMtMi41NCA1LjY3LTUuNjcgNS42N2gtNjguMDRjLTMuMTMgMC01LjY3LTIuNTQtNS42Ny01LjY3di0xNS41YzAuMzEtMTkgMi4zMi0zNy4yIDYuNTQtNDUuNDggMi41My00Ljk4IDYuNy03LjY5IDExLjQ5LTkuMTQgOS4wNS0yLjcyIDI0LjkzLTAuODYgMzEuNjctMS4xOCAwIDAgMjAuMzYgMC44MSAyMC4zNi0xMC43MiAwLTkuMjgtOS4xLTguNTUtOS4xLTguNTUtMTAuMDMgMC4yNi0xNy42Ny0wLjQyLTIyLjYyLTIuMzctOC4yOS0zLjI2LTguNTctOS4yNC04LjYtMTEuMjQtMC40MS0yMy4xLTM0LjQ3LTI1Ljg3LTY0LjQ4LTIwLjE0LTMyLjgxIDYuMjQgMC4zNiA1My4yNyAwLjM2IDExNi4wNXY4LjM4Yy0wLjA2IDMuMDgtMi41NSA1LjU3LTUuNjUgNS41N2gtMzMuNjljLTMuMTMgMC01LjY3LTIuNTQtNS42Ny01LjY3di0xNDMuOTVjMC0zLjEzIDIuNTQtNS42NyA1LjY3LTUuNjdoMzEuNjdjMy4xMyAwIDUuNjcgMi41NCA1LjY3IDUuNjcgMCA0LjY1IDUuMjMgNy4yNCA5LjAxIDQuNTMgMTEuMzktOC4xNiAyNi4wMS0xMi41MSA0Mi4zNy0xMi41MSAzNi42NSAwIDY0LjM2IDIxLjM2IDY0LjM2IDY4LjY5em0tNjAuODQtMTYuODljMC02LjctNS40My0xMi4xMy0xMi4xMy0xMi4xM3MtMTIuMTMgNS40My0xMi4xMyAxMi4xMyA1LjQzIDEyLjEzIDEyLjEzIDEyLjEzIDEyLjEzLTUuNDMgMTIuMTMtMTIuMTN6IiAvPgo8L3N2Zz4=", Nb = (n) => typeof n == "string" && n.length > 0, Rb = (n) => {
  try {
    return window.NostrTools.nip19.decode(n);
  } catch {
    return null;
  }
}, Mb = (n, e, t) => {
  const r = { npub: () => ({ kinds: [9735], "#p": [e] }), note: () => ({ kinds: [9735], "#e": [e] }), nprofile: () => ({ kinds: [9735], "#p": [e.pubkey] }), nevent: () => ({ kinds: [9735], "#e": [e.id] }), naddr: () => ({ kinds: [9735], "#a": [`${e.kind}:${e.pubkey}:${e.identifier}`] }) }[n];
  if (!r) return null;
  const i = r();
  return i.limit = t ? Qe.REQ_CONFIG.ADDITIONAL_LOAD_COUNT : Qe.REQ_CONFIG.INITIAL_LOAD_COUNT, t && (i.until = t), { req: i };
};
function td(n, e = null) {
  const t = `${n}:${e}`;
  if (Ue.hasDecoded(t)) return Ue.getDecoded(t);
  if (!Nb(n)) throw new Error(Qe.ZAP_CONFIG.ERRORS.DECODE_FAILED);
  const r = Rb(n);
  if (!r) return null;
  const i = Mb(r.type, r.data, e);
  return i && Ue.setDecoded(t, i), i;
}
function Ah(n) {
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
function lo(n) {
  return new Intl.NumberFormat().format(n);
}
function Sh(n) {
  if (!n || typeof n != "string") return "unknown";
  try {
    return `${window.NostrTools.nip19.decode(n).type.toLowerCase()}1${n.slice(5, 11)}...${n.slice(-4)}`;
  } catch {
    return "unknown";
  }
}
function Ps(n) {
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
function Vs(n) {
  if (!n || typeof n != "string") return !1;
  const e = `isEventIdentifier:${n}`, t = Ue.getCacheItem("isEventIdentifier", e);
  if (t !== void 0) return t;
  const r = n.startsWith("note1") || n.startsWith("nevent1") || n.startsWith("naddr1");
  return Ue.setCacheItem("isEventIdentifier", e, r), r;
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
        const p = c.match(/"pubkey"\s*:\s*"([^"]+)"|"content"\s*:\s*"([^"]+)"/g);
        if (!p) throw new Error("Invalid JSON structure");
        d = {}, p.forEach(((b) => {
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
      return d ? `${lo(Math.floor(d / 1e3))} sats` : "Amount: Unknown";
    } catch {
      return "Amount: Unknown";
    }
  })(n);
  return { pubkey: e, content: t, satsText: r };
}
function nd(n) {
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
      <div class="stats-item"><span class="number">${lo(e.count)}</span></div>
      <div class="stats-item">times</div>
      <div class="stats-item">Total Amount</div>
      <div class="stats-item"><span class="number">${lo(Math.floor(e.msats / 1e3))}</span></div>
      <div class="stats-item">sats</div>
      <div class="stats-item">Max Amount</div>
      <div class="stats-item"><span class="number">${lo(Math.floor(e.maxMsats / 1e3))}</span></div>
      <div class="stats-item">sats</div>
    `;
  }
}
class Zl {
  constructor(e = {}) {
    this._validateOptions(e), this._initializeProperties(e);
  }
  _validateOptions(e) {
    if (!e.pool?.ensureRelay) throw new Error("Invalid pool object: ensureRelay method is required");
  }
  _initializeProperties(e) {
    this.pool = e.pool, this.batchSize = e.batchSize || Qe.BATCH_PROCESSOR_CONFIG.DEFAULT_BATCH_SIZE, this.batchDelay = e.batchDelay || Qe.BATCH_PROCESSOR_CONFIG.DEFAULT_BATCH_DELAY, this.relayUrls = e.relayUrls || Qe.BATCH_PROCESSOR_CONFIG.DEFAULT_RELAY_URLS, this.batchQueue = /* @__PURE__ */ new Set(), this.pendingFetches = /* @__PURE__ */ new Map(), this.resolvers = /* @__PURE__ */ new Map(), this.processingItems = /* @__PURE__ */ new Set(), this.batchTimer = null, this.eventCache = /* @__PURE__ */ new Map(), this.maxCacheAge = e.maxCacheAge || Qe.BATCH_PROCESSOR_CONFIG.DEFAULT_MAX_CACHE_AGE;
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
      const c = /* @__PURE__ */ new Set(), d = Qe.BATCH_PROCESSOR_CONFIG.TIMEOUT_DURATION;
      let h, p, b = !1;
      const m = () => {
        b || (b = !0, h && clearTimeout(h), p && p.close(), e.forEach(((v) => {
          c.has(v) || this.resolveItem(v, null);
        })), a());
      };
      p = this.pool.subscribeMany(t, r, { onevent: (v) => {
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
class qb extends Zl {
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
class jb extends Zl {
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
        const p = this._parseAtagValue(h);
        return p && a.kind === p.kind && a.pubkey === p.pubkey && a.tags.some(((b) => b[0] === "d" && b[1] === p.identifier));
      }));
      if (d) {
        const h = this.getCachedItem(d);
        (!h || a.created_at > h.created_at) && (this.setCachedItem(d, a), this.resolveItem(d, a), c.add(d));
      }
    }));
  }
}
class Fb extends Zl {
  constructor(e = {}) {
    const { simplePool: t, config: r } = e;
    super({ pool: t, batchSize: r.BATCH_SIZE || Qe.PROFILE_CONFIG.BATCH_SIZE, batchDelay: r.BATCH_DELAY || Qe.PROFILE_CONFIG.BATCH_DELAY, relayUrls: r.RELAYS || Qe.PROFILE_CONFIG.RELAYS, maxCacheAge: Qe.BATCH_PROCESSOR_CONFIG.DEFAULT_MAX_CACHE_AGE }), this.config = r;
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
var _s = Symbol("verified");
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
function za(n) {
  return nn(As(Vb.encode((function(e) {
    if (!Zb(e)) throw new Error("can't serialize event with wrong or missing properties");
    return JSON.stringify([0, e.pubkey, e.created_at, e.kind, e.tags, e.content]);
  })(n))));
}
var ao = new class {
  generateSecretKey() {
    return mr.utils.randomPrivateKey();
  }
  getPublicKey(n) {
    return nn(mr.getPublicKey(n));
  }
  finalizeEvent(n, e) {
    const t = n;
    return t.pubkey = nn(mr.getPublicKey(e)), t.id = za(t), t.sig = nn(mr.sign(za(t), e)), t[_s] = !0, t;
  }
  verifyEvent(n) {
    if (typeof n[_s] == "boolean") return n[_s];
    const e = za(n);
    if (e !== n.id) return n[_s] = !1, !1;
    try {
      const t = mr.verify(n.sig, e, n.pubkey);
      return n[_s] = t, t;
    } catch {
      return n[_s] = !1, !1;
    }
  }
}(), Kb = (ao.generateSecretKey, ao.getPublicKey, ao.finalizeEvent, ao.verifyEvent);
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
var Ch, Xb = (n) => (n[_s] = !0, !0), Ih = class {
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
    const t = new Ih(n, e);
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
        let d = c.length + 3, h = a.indexOf(`"${c}":`) + d, p = a.slice(h).indexOf('"') + h + 1;
        return a.slice(p, p + 64);
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
    return t || (t = new Ih(n, { verifyEvent: this.trustedRelayURLs.has(n) ? Xb : this.verifyEvent, websocketImplementation: this._WebSocket }), e?.connectionTimeout && (t.connectionTimeout = e.connectionTimeout), this.relays.set(n, t)), await t.connect(), t;
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
    const p = (m) => {
      if (e.alreadyHaveEvent?.(m)) return !0;
      const v = t.has(m);
      return t.add(m), v;
    }, b = Promise.all(Object.entries(n).map((async (m, v, T) => {
      if (T.indexOf(m) !== v) return void h(v, "duplicate url");
      let A, [$, L] = m;
      $ = _i($);
      try {
        A = await this.ensureRelay($, { connectionTimeout: e.maxWait ? Math.max(0.8 * e.maxWait, e.maxWait - 1e3) : void 0 });
      } catch (B) {
        return void h(v, B?.message || String(B));
      }
      let P = A.subscribe(L, { ...e, oneose: () => c(v), onclose: (B) => h(v, B), alreadyHaveEvent: p, eoseTimeout: e.maxWait });
      r.push(P);
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
  Ch = WebSocket;
} catch {
}
var Th = class extends e1 {
  constructor() {
    super({ verifyEvent: Kb, websocketImplementation: Ch });
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
    if (this.#e = Qe.PROFILE_CONFIG, this.#t = new Th(), !this.#t?.ensureRelay) throw new Error("Failed to initialize SimplePool");
    this.#r = new Fb({ simplePool: this.#t, config: { ...this.#e, RELAYS: this.#e.RELAYS || [] } });
  }
  get isInitialized() {
    return this.#n;
  }
  async fetchProfiles(e) {
    if (!Array.isArray(e) || e.length === 0) return [];
    const t = Date.now(), r = new Array(e.length), i = e.reduce(((a, c, d) => {
      const h = Ue.getProfile(c);
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
    const t = Ue.getNip05(e);
    if (t !== void 0) return t;
    const r = Ue.getNip05PendingFetch(e);
    if (r) return r;
    const i = this.#h(e);
    return Ue.setNip05PendingFetch(e, i), i;
  }
  getNip05(e) {
    return Ue.getNip05(e);
  }
  clearCache() {
    Ue.clearAll(), this.#r.clearPendingFetches();
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
      d >= 0 && d < t.length && (t[d] = c[h], r[d] && Ue.setProfile(r[d], c[h]));
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
      return { ...a, name: Ah(a) || "nameless", _lastUpdated: t, _eventCreatedAt: i.created_at };
    } catch {
      return this.#c();
    }
  }
  async #h(e) {
    try {
      const [t] = await this.fetchProfiles([e]);
      if (!t?.nip05) return Ue.setNip05(e, null), null;
      const r = await Promise.race([Bb(t.nip05, e), new Promise(((a, c) => setTimeout((() => c(new Error("NIP-05 timeout"))), 5e3)))]);
      if (!r) return Ue.setNip05(e, null), null;
      const i = Ps(r.startsWith("_@") ? r.slice(1) : r);
      return Ue.setNip05(e, i), i;
    } catch {
      return Ue.setNip05(e, null), null;
    } finally {
      Ue.deleteNip05PendingFetch(e);
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
      let h = Ue.getProfile(e);
      const p = h ? Ah(h) || "nameless" : "anonymous", b = h?.picture ? (function(m) {
        if (!m || typeof m != "string") return null;
        try {
          const v = new URL(m);
          return ["http:", "https:"].includes(v.protocol) ? v.href : null;
        } catch {
          return null;
        }
      })(h.picture) : null;
      this.#e(i, r, p), this.#n(c, a, b, p), this.#r(d, e);
    } catch {
      this.#s(t);
    }
  }
  #e(e, t, r) {
    e ? e.replaceWith(Object.assign(document.createElement("span"), { className: "sender-name", textContent: r })) : t && (t.textContent = r);
  }
  #t(e, t = "anonymous user's icon") {
    const r = `https://robohash.org/${e}.png?set=set5&bgset=bg2&size=128x128`, i = Ue.getImageCache(r), a = Object.assign(document.createElement("img"), { alt: t, loading: "lazy", className: "profile-icon" });
    if (i) return a.src = r, a;
    const c = new Image();
    return c.onerror = () => {
      a.src = ed, Ue.setImageCache(r, ed);
    }, c.onload = () => {
      Ue.setImageCache(r, c);
    }, c.src = r, a.src = r, a;
  }
  #n(e, t, r, i) {
    if (e && t) {
      const a = (c) => {
        e.remove();
        const d = t.querySelector("img"), h = t.querySelector("a");
        d && d.remove(), h && h.remove();
        const p = c === "robohash" ? this.#t(t.closest("[data-pubkey]")?.dataset.pubkey, `${Ps(i)}'s icon`) : Object.assign(document.createElement("img"), { src: c, alt: `${Ps(i)}'s icon`, loading: "lazy", className: "profile-icon" }), b = t.closest("[data-pubkey]")?.dataset.pubkey;
        if (b) {
          const m = (function(T, A = []) {
            try {
              return window.NostrTools.nip19.nprofileEncode({ pubkey: T, relays: A });
            } catch {
              return null;
            }
          })(b), v = Object.assign(document.createElement("a"), { href: `https://njump.me/${m}`, target: "_blank", rel: "noopener noreferrer" });
          v.appendChild(p), t.appendChild(v);
        } else t.appendChild(p);
      };
      if (r) {
        const c = new Image();
        c.onload = () => {
          Ue.setImageCache(r, c), a(r);
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
class On {
  static #e = { 1: "content", 30023: "title", 30030: "title", 30009: "name", 40: "content", 42: "name", 31990: "alt" };
  static #t = { UI_COMPONENTS: "Failed to create UI components:", ZAP_ITEM: "Failed to create zap item HTML:", REFERENCE: "Reference component creation failed:" };
  static createUIComponents(e, t, r) {
    try {
      const i = this.viewConfigs?.get(t), a = r || i?.identifier, c = Vs(a) ? null : this.#i(e);
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
        ${e.comment ? `<div class="zap-details"><span class="zap-comment">${Ps(e.comment)}</span></div>` : ""}
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
    return e ? `<span class="sender-name">${Ps(e)}</span>` : '<div class="zap-placeholder-name skeleton"></div>';
  }
  static #c({ pubkey: e, displayIdentifier: t, reference: r }, i) {
    const a = !Vs(i), c = `class="sender-pubkey" data-pubkey="${e}"`;
    return r && a ? `<span ${c}>${t}</span>` : `<span ${c} data-nip05-target="true">${t}</span>`;
  }
  static #f(e) {
    if (!this.#l(e)) return "";
    const t = e.id, r = Ue.getReferenceComponent(t);
    if (r) return r;
    try {
      const i = this.#g(e), a = this.#p(e), c = this.#d(i, a);
      return Ue.setReferenceComponent(t, c), c;
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
    const t = On.#e[e.kind];
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
        <div class="reference-text">${Ps(t)}</div>
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
      return await new On.ZapInfo(e).extractInfo(t);
    }
    static getAmountColorClass(e, t) {
      return (t === void 0 ? Qe.ZAP_AMOUNT_CONFIG.DEFAULT_COLOR_MODE : t) ? this.#b(e) : Qe.ZAP_AMOUNT_CONFIG.DISABLED_CLASS;
    }
    static #b(e) {
      const { THRESHOLDS: t, DEFAULT_CLASS: r } = Qe.ZAP_AMOUNT_CONFIG;
      return t.find(((i) => e >= i.value))?.className || r;
    }
    async extractInfo(e = {}) {
      const t = this.#u.id, r = Ue.getZapInfo(t);
      if (r) return r.colorClass = On.ZapInfo.getAmountColorClass(r.satsAmount, e.isColorModeEnabled), r;
      try {
        const { pubkey: a, content: c, satsText: d } = await Pb(this.#u), h = parseInt(d.replace(/,/g, "").split(" ")[0], 10), p = typeof a == "string" ? a : null, b = this.#u.reference || null, m = { satsText: d, satsAmount: h, comment: c || "", pubkey: p || "", created_at: this.#u.created_at, displayIdentifier: p ? Sh(Ub(p)) : "anonymous", senderName: null, senderIcon: null, reference: b, colorClass: On.ZapInfo.getAmountColorClass(h, e?.isColorModeEnabled) };
        return Ue.setZapInfo(t, m), m;
      } catch {
        const c = { satsText: "Amount: Unknown", satsAmount: 0, comment: "", pubkey: "", created_at: this.#u.created_at, displayIdentifier: "anonymous", senderName: "anonymous", senderIcon: i, reference: null };
        return Ue.setZapInfo(t, c), c;
      }
      var i;
    }
    static async batchExtractInfo(e, t = !0) {
      const r = /* @__PURE__ */ new Map();
      return await Promise.all(e.map((async (i) => {
        const a = new On.ZapInfo(i), c = await a.extractInfo({ isColorModeEnabled: t });
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
    const t = await On.ZapInfo.createFromEvent(e, { isColorModeEnabled: this.config?.isColorModeEnabled }), r = document.createElement("li");
    return r.className = `zap-list-item ${t.colorClass}${t.comment ? " with-comment" : ""}`, r.setAttribute("data-pubkey", t.pubkey), e?.id && r.setAttribute("data-event-id", e.id), r.innerHTML = On.createZapItemHTML(t, t.colorClass, this.viewId), r.setAttribute("data-timestamp", e.created_at.toString()), { li: r, zapInfo: t };
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
      for (let p = 0; p < h.length; p++)
        if (c > parseInt(h[p].getAttribute("data-timestamp"))) {
          d = h[p];
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
    if (!e?.length) return Ue.setNoZapsState(this.viewId, !1), this.showNoZapsMessage();
    await this.#t((async (t) => {
      const { initialBatch: r, remainingBatch: i } = this.#o(e), { fragment: a, profileUpdates: c } = await this.#a(r);
      this.#n(t, a), i.length > 0 ? this.#i(i, t, c) : await this.#p(c);
    }));
  }
  #o(e) {
    const t = this.#b(e), r = Qe.DIALOG_CONFIG.ZAP_LIST.INITIAL_BATCH;
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
    const i = Qe.DIALOG_CONFIG.ZAP_LIST.REMAINING_BATCH;
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
      if (Ue.hasNoZaps(this.viewId)) return void this.#c(e);
      await this.#h() || (this.#c(e), Ue.setNoZapsState(this.viewId, !0));
    }
  }
  async #h() {
    const e = this.config.noZapsDelay || Qe.DIALOG_CONFIG.DEFAULT_NO_ZAPS_DELAY;
    await new Promise(((r) => setTimeout(r, e)));
    const t = Ue.getZapEvents(this.viewId);
    return !!t?.length && (await this.renderZapListFromCache(t), !0);
  }
  #c(e) {
    const t = this.config.noZapsMessage || Qe.DIALOG_CONFIG.NO_ZAPS_MESSAGE;
    e.innerHTML = On.createNoZapsMessageHTML(t), e.style.minHeight = Qe.DIALOG_CONFIG.ZAP_LIST.MIN_HEIGHT;
  }
  async batchUpdate(e, t = {}) {
    const r = this.#e(".dialog-zap-list");
    if (r) try {
      const i = new Map(Array.from(r.querySelectorAll(".zap-list-item")).map(((p) => [p.getAttribute("data-event-id"), p]))), a = this.#b(e), c = Vs(this.config.identifier), d = a.filter(((p) => {
        const b = i.get(p.id);
        return c ? !b : !b || p.reference && !b.querySelector(".zap-reference");
      }));
      if (d.length === 0 && !t.isFullUpdate) return;
      const h = document.createDocumentFragment();
      for (const p of d) {
        const { li: b, zapInfo: m } = await this.itemBuilder.createListItem(p);
        !c && p.reference && this.updateZapReference(p), h.appendChild(b), m.pubkey && await this.#d(m.pubkey, b);
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
      On.addReferenceToElement(t, e.reference), Ue.setReference(e.id, e.reference);
    } catch {
    }
  }
  #g() {
    this.profileUpdateUnsubscribe = Ue.subscribeToProfileUpdates(this.#v.bind(this));
  }
  async #v(e, t) {
    const r = this.shadowRoot.querySelectorAll(`[data-pubkey="${e}"]`);
    await Promise.allSettled(Array.from(r).map(((i) => this.profileUI.updateProfileElement(i, t))));
  }
  async #p(e) {
    const t = Qe.DIALOG_CONFIG.ZAP_LIST.PROFILE_BATCH;
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
    if (Vs(this.config.identifier)) return;
    const r = Ue.getReference(e);
    r && On.addReferenceToElement(t, r);
  }
  #y(e) {
    return e && e.classList.contains("placeholder");
  }
  #w(e, t, r) {
    const i = this.itemBuilder.getAmountColorClass(t.satsAmount);
    e.className = `zap-list-item ${i}${t.comment ? " with-comment" : ""}`, e.setAttribute("data-pubkey", t.pubkey), e.setAttribute("data-event-id", r), e.innerHTML = On.createZapItemHTML(t, i, this.viewId), e.removeAttribute("data-index");
  }
}
var s1 = bn(0), i1 = bn.n(s1);
const Di = new class {
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Map();
  constructor() {
  }
  async getZapStats(n, e) {
    const t = await this.#n(e, n);
    if (t) return t;
    const r = await this.fetchStats(n);
    return r && Ue.updateStatsCache(e, n, r), r;
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
    const e = nd(n);
    if (!e) return null;
    const t = `https://api.nostr.band/v0/stats/${e.type === "npub" || e.type === "nprofile" ? "profile" : "event"}/${n}`, r = new AbortController(), i = setTimeout((() => r.abort()), Qe.REQUEST_CONFIG.REQUEST_TIMEOUT);
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
    if (nd(n)?.type === "naddr") {
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
    const t = Ue.getCachedStats(n, e), r = Date.now();
    return t && r - t.timestamp < Qe.REQUEST_CONFIG.CACHE_DURATION ? t.stats : null;
  }
  getCurrentStats(n) {
    return this.#e.get(n);
  }
  async handleZapEvent(n, e, t) {
    if (n?.isRealTimeEvent) try {
      const r = n.tags.find(((h) => h[0].toLowerCase() === "bolt11"))?.[1], i = this.extractAmountFromBolt11(r);
      if (i <= 0) return;
      const a = Ue.getViewStats(e), c = { count: a?.count || 0, msats: a?.msats || 0, maxMsats: a?.maxMsats || 0 }, d = { count: c.count + 1, msats: c.msats + i, maxMsats: Math.max(c.maxMsats, i) };
      Ue.updateStatsCache(e, t, d), this.#e.set(e, d), await this.displayStats(d, e), n.isStatsCalculated = !0, n.amountMsats = i;
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
}(), $s = new class {
  #e;
  #t;
  #n;
  #r;
  #s;
  #o;
  #a;
  constructor() {
    this.#e = new Th(), this.#i(), this.#l();
  }
  #i() {
    this.#n = /* @__PURE__ */ new Map(), this.#r = /* @__PURE__ */ new Map(), this.#s = /* @__PURE__ */ new Map(), this.#t = !1;
  }
  #l() {
    const n = { pool: this.#e, batchSize: Qe.BATCH_CONFIG.REFERENCE_PROCESSOR.BATCH_SIZE, batchDelay: Qe.BATCH_CONFIG.REFERENCE_PROCESSOR.BATCH_DELAY };
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
      const i = t === "e" ? r[1] : `${r[1]}`, a = Ue.getReference(i);
      if (a) return a;
      const c = this.#s.get(i);
      if (c) return c;
      const d = t === "e" ? this.#o : this.#a;
      try {
        const h = await d.getOrCreateFetchPromise(i);
        return h && Ue.setReference(i, h), this.#s.delete(i), h;
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
}(), { zapPool: ym } = $s, wr = new class {
  constructor() {
    this.viewConfigs = /* @__PURE__ */ new Map(), this.configStore = /* @__PURE__ */ new Map(), this.observers = /* @__PURE__ */ new Map(), this.#e = /* @__PURE__ */ new Map(), this.#t = /* @__PURE__ */ new Map();
  }
  #e;
  #t;
  setZapListUI(n) {
    this.zapListUI = n;
  }
  setViewConfig(n, e) {
    this.viewConfigs.set(n, e), On.viewConfigs.set(n, e), Ue.initializeZapView(n);
  }
  getViewConfig(n) {
    return this.viewConfigs.get(n);
  }
  async updateEventReference(n, e) {
    try {
      const t = this.getViewConfig(e);
      if (!t?.relayUrls?.length || Vs(t?.identifier || "")) return !1;
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
        if (n.tags.find(((a) => Array.isArray(a) && a[0] === "a"))?.[1]) return await $s.fetchReference(e.relayUrls, n, "a");
        const i = n.tags.find(((a) => Array.isArray(a) && a[0] === "e"));
        return i?.[1] && /^[0-9a-f]{64}$/.test(i[1].toLowerCase()) ? await $s.fetchReference(e.relayUrls, n, "e") : null;
      } catch {
        return null;
      }
    };
    try {
      return await Ue.getOrFetchReference(n.id, t);
    } catch {
      return null;
    }
  }
  async updateEventReferenceBatch(n, e) {
    const t = this.getViewConfig(e);
    if (!t?.relayUrls?.length || Vs(t?.identifier || "")) return;
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
      const t = td(n.identifier);
      if (!t) throw new Error(Qe.ZAP_CONFIG.ERRORS.DECODE_FAILED);
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
    const t = Ue.getZapEvents(n), r = this._getListElement(n), i = Ue.updateLoadState(n, { isInitialFetchComplete: !0, lastEventTime: e });
    await Promise.all([i, t.length === 0 ? this.zapListUI?.showNoZapsMessage() : null, t.length >= Qe.REQ_CONFIG.INITIAL_LOAD_COUNT ? this.setupInfiniteScroll(n) : null]), r?.querySelector(".load-more-trigger")?.remove();
  }
  _initializeLoadState(n) {
    Ue.updateLoadState(n, { isInitialFetchComplete: !1, lastEventTime: null, isLoading: !1 });
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
    const r = new IntersectionObserver(((i) => this._handleIntersection(i[0], e)), { root: t, rootMargin: Qe.INFINITE_SCROLL.ROOT_MARGIN, threshold: Qe.INFINITE_SCROLL.THRESHOLD });
    r.observe(n), this.observers.set(e, r);
  }
  async _handleIntersection(n, e) {
    n.isIntersecting && (Ue.getLoadState(e).isLoading ? setTimeout((() => {
      n.isIntersecting && this._handleIntersection(n, e);
    }), Qe.INFINITE_SCROLL.RETRY_DELAY) : this.loadMoreZaps(e).then(((t) => {
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
    const e = Ue.getLoadState(n), t = this.getViewConfig(n);
    if (!this._canLoadMore(e, t)) return 0;
    e.isLoading = !0;
    try {
      const r = await this._executeLoadMore(n, e, t);
      if (r > 0) {
        const i = Ue.getZapEvents(n).slice(-r);
        await this.updateEventReferenceBatch(i, n), this.updateUIReferences(i);
      }
      return r;
    } finally {
      e.isLoading = !1;
    }
  }
  async _executeLoadMore(n, e, t) {
    const r = td(t.identifier, e.lastEventTime);
    if (!r) return 0;
    const i = [], a = setTimeout((() => {
      i.length === 0 && this._cleanupInfiniteScroll(n);
    }), Qe.LOAD_TIMEOUT);
    try {
      return await this._collectEvents(n, t, r, i, Qe.REQ_CONFIG.ADDITIONAL_LOAD_COUNT, e), i.length > 0 && await this._processBatchEvents(i, n), i.length;
    } catch {
      return 0;
    } finally {
      clearTimeout(a);
    }
  }
  async _collectEvents(n, e, t, r, i, a) {
    return new Promise(((c, d) => {
      const h = setTimeout((() => d(new Error("Load timeout"))), Qe.LOAD_TIMEOUT);
      $s.subscribeToZaps(n, e, t, { onevent: (p) => {
        p.created_at < a.lastEventTime && (r.push(p), a.lastEventTime = Math.min(a.lastEventTime, p.created_at), r.length >= i && (clearTimeout(h), c()));
      }, oneose: () => {
        clearTimeout(h), c();
      } });
    }));
  }
  async _collectInitialEvents(n, e, t) {
    const r = [];
    let i = null;
    return new Promise(((a) => {
      const c = this._setupBufferInterval(r, n), d = $s.subscribeToZaps(n, e, t, { onevent: (h) => {
        const p = this._handleInitialEvent(h, r, i, n);
        p !== null && (i = p);
      }, oneose: () => {
        clearInterval(c), a({ batchEvents: [...r], lastEventTime: i });
      } });
      this.#e.set(n, { zap: d });
    }));
  }
  _handleInitialEvent(n, e, t, r) {
    const i = Math.min(t || n.created_at, n.created_at);
    if (Ue.addZapEvent(r, n)) {
      if (e.push(n), this.updateEventReference(n, r).then(((a) => {
        a && this.zapListUI && n.reference && this.zapListUI.updateZapReference(n);
      })), n.isRealTimeEvent) {
        const a = this.getViewConfig(r);
        Di.handleZapEvent(n, r, a?.identifier), this.zapListUI && this.zapListUI.prependZap(n).catch(console.error);
      }
      e.length >= Qe.BATCH_SIZE && this.zapListUI && this.zapListUI.batchUpdate(Ue.getZapEvents(r)).catch(console.error);
    }
    return i;
  }
  async _processBatchEvents(n, e) {
    if (n?.length) {
      n.sort(((t, r) => r.created_at - t.created_at)), n.forEach(((t) => Ue.addZapEvent(e, t)));
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
    const r = Qe.BUFFER_MIN_INTERVAL;
    return setInterval((() => {
      const i = Date.now();
      n.length > 0 && i - t >= r && this.zapListUI && (this.zapListUI.batchUpdate(Ue.getZapEvents(e), { isBufferUpdate: !0 }).catch(console.error), t = i);
    }), Qe.BUFFER_INTERVAL);
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
    super(), this.attachShadow({ mode: "open" }), this.#e = { isInitialized: !1, theme: Qe.DEFAULT_OPTIONS.theme }, this.popStateHandler = (e) => {
      e.preventDefault(), this.#i(".dialog")?.open && this.closeDialog();
    };
  }
  async connectedCallback() {
    if (this.viewId = this.getAttribute("data-view-id"), this.viewId) {
      this.#t = this.#n();
      try {
        await this.#t, this.#e.isInitialized = !0;
        const e = wr.getViewConfig(this.viewId);
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
      t.innerHTML = On.getDialogTemplate(), this.shadowRoot.appendChild(t.content.cloneNode(!0)), this.#s(), queueMicrotask((() => e()));
    }));
  }
  async #r(e) {
    const t = document.createElement("style");
    t.textContent = i1(), this.shadowRoot.appendChild(t), this.statsUI = new Hb(this.shadowRoot), this.profileUI = new t1(), this.zapListUI = new r1(this.shadowRoot, this.profileUI, this.viewId, e), wr.setZapListUI(this.zapListUI);
    const r = Ue.getZapEvents(this.viewId);
    r?.length ? await this.zapListUI.renderZapListFromCache(r) : this.zapListUI.showNoZapsMessage();
    const i = this.getAttribute("data-nzv-id");
    if (i) {
      const a = await Ue.getCachedStats(this.viewId, i);
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
    Ue.updateThemeState(this.viewId, { theme: e }).isInitialized && this.#a();
  }
  #a() {
    const e = Ue.getThemeState(this.viewId).theme === "dark" ? "dark-theme" : "light-theme";
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
    e?.open && (this.zapListUI?.destroy(), wr.unsubscribe(this.viewId), e.close(), this.remove(), window.removeEventListener("popstate", this.popStateHandler));
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
    i.href = c ? `https://njump.me/${c}` : "#", a?.trim() ? (i.textContent = a, r.classList.add("custom-title")) : (i.textContent = Qe.DIALOG_CONFIG.DEFAULT_TITLE + Sh(c), r.classList.remove("custom-title"));
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
const mo = { create: async (n, e) => {
  if (!n || !e) return Promise.reject(new Error("Invalid viewId or config"));
  wr.setViewConfig(n, e);
  const t = document.querySelector(`nzv-dialog[data-view-id="${n}"]`);
  if (t) return t;
  const r = document.createElement("nzv-dialog");
  r.setAttribute("data-view-id", n), r.setAttribute("data-config", JSON.stringify(e));
  const i = document.querySelector(`button[data-zap-view-id="${n}"]`);
  return i?.getAttribute("data-nzv-id") && r.setAttribute("data-nzv-id", i.getAttribute("data-nzv-id")), document.body.appendChild(r), await r.waitForInitialization(), r;
}, get: (n) => document.querySelector(`nzv-dialog[data-view-id="${n}"]`), execute: (n, e, ...t) => {
  const r = mo.get(n), i = r?.getOperations();
  return i ? i[e]?.(...t) ?? null : null;
} }, a1 = (n, e) => mo.execute(e, "displayZapStats", n);
async function l1(n, e) {
  try {
    const t = Ti.fromButton(n);
    if (!t) throw new Error("Failed to create config from button");
    if (wr.setViewConfig(e, t), !await (async function(i) {
      try {
        const a = wr.getViewConfig(i);
        if (!a) throw new Error(`View configuration not found for viewId: ${i}`);
        return wr.setViewConfig(i, a), await mo.create(i, a);
      } catch {
        return null;
      }
    })(e)) throw new Error(Qe.ZAP_CONFIG.ERRORS.DIALOG_NOT_FOUND);
    await (async function(i) {
      try {
        const a = mo.get(i);
        if (!a) throw new Error("Dialog not found");
        await a.waitForInitialization();
        const c = a.getOperations();
        if (!c?.showDialog) throw new Error("Basic dialog operations not available");
        c.showDialog();
      } catch {
      }
    })(e), setTimeout((async () => {
      if (await (async function(i, a) {
        const c = Ue.getZapEvents(i);
        if (c.length > 0) {
          const h = [...new Set(c.map(((p) => p.pubkey)))];
          Li.fetchProfiles(h);
        }
        const { hasEnoughCachedEvents: d } = await Ue.processCachedData(i, a);
        return d && wr.setupInfiniteScroll(i), d;
      })(e, t), !n.hasAttribute("data-initialized")) {
        const i = n.getAttribute("data-nzv-id");
        await Promise.all([$s.connectToRelays(t.relayUrls), wr.initializeSubscriptions(t, e), i ? Di.initializeStats(i, e, !0) : Promise.resolve()]), n.setAttribute("data-initialized", "true");
      }
    }), 0);
  } catch {
  }
}
function Lh() {
  Object.entries(Qe.LIBRARIES).forEach((([n, e]) => {
    window[n] = e;
  })), document.querySelectorAll("button[data-nzv-id]").forEach(((n, e) => {
    if (n.hasAttribute("data-zap-view-id")) return;
    const t = `nostr-zap-view-${e}`;
    n.setAttribute("data-zap-view-id", t), n.hasAttribute("data-zap-color-mode") || n.setAttribute("data-zap-color-mode", Qe.ZAP_CONFIG.DEFAULT_COLOR_MODE), n.addEventListener("click", (() => l1(n, t)));
  }));
}
function Dh(n = {}) {
  Object.assign(Qe, n), typeof window < "u" && Lh();
}
function c1(n = {}) {
  return Dh(n);
}
typeof window < "u" && document.addEventListener("DOMContentLoaded", Lh);
Er.vQ;
Er.ZM;
Er.yk;
Er.h0;
Er.n_;
var d1 = Er.Xz;
Er.Uv;
Er.fU;
Er.Dw;
var rd = {}, sd;
function u1() {
  if (sd) return rd;
  sd = 1;
  var n = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof Ec < "u" ? Ec : {};
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
      function l(_, C) {
        var M, G = Object.keys(C);
        for (M = 0; M < G.length; M++) _ = _.replace(new RegExp("\\{" + G[M] + "\\}", "gi"), C[G[M]]);
        return _;
      }
      function u(_) {
        var C, M, G;
        if (!_) throw new Error("cannot create a random attribute name for an undefined object");
        C = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", M = "";
        do
          for (M = "", G = 0; G < 12; G++) M += C[Math.floor(Math.random() * C.length)];
        while (_[M]);
        return M;
      }
      function f(_) {
        var C = {
          left: "start",
          right: "end",
          center: "middle",
          start: "start",
          end: "end"
        };
        return C[_] || C.start;
      }
      function g(_) {
        var C = {
          alphabetic: "alphabetic",
          hanging: "hanging",
          top: "text-before-edge",
          bottom: "text-after-edge",
          middle: "central"
        };
        return C[_] || C.alphabetic;
      }
      var E, w, q, Q, j;
      j = (function(_, C) {
        var M, G, ne, ie = {};
        for (_ = _.split(","), C = C || 10, M = 0; M < _.length; M += 2) G = "&" + _[M + 1] + ";", ne = parseInt(_[M], C), ie[G] = "&#" + ne + ";";
        return ie["\\xa0"] = "&#160;", ie;
      })("50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,t9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro", 32), E = {
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
      }, q = function(_, C) {
        this.__root = _, this.__ctx = C;
      }, q.prototype.addColorStop = function(_, C) {
        var M, G, ne = this.__ctx.__createElement("stop");
        ne.setAttribute("offset", _), C.indexOf("rgba") !== -1 ? (M = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi, G = M.exec(C), ne.setAttribute("stop-color", l("rgb({r},{g},{b})", {
          r: G[1],
          g: G[2],
          b: G[3]
        })), ne.setAttribute("stop-opacity", G[4])) : ne.setAttribute("stop-color", C), this.__root.appendChild(ne);
      }, Q = function(_, C) {
        this.__root = _, this.__ctx = C;
      }, w = function(_) {
        var C, M = {
          width: 500,
          height: 500,
          enableMirroring: !1
        };
        if (arguments.length > 1 ? (C = M, C.width = arguments[0], C.height = arguments[1]) : C = _ || M, !(this instanceof w)) return new w(C);
        this.width = C.width || M.width, this.height = C.height || M.height, this.enableMirroring = C.enableMirroring !== void 0 ? C.enableMirroring : M.enableMirroring, this.canvas = this, this.__document = C.document || document, C.ctx ? this.__ctx = C.ctx : (this.__canvas = this.__document.createElement("canvas"), this.__ctx = this.__canvas.getContext("2d")), this.__setDefaultStyles(), this.__stack = [
          this.__getStyleState()
        ], this.__groupStack = [], this.__root = this.__document.createElementNS("http://www.w3.org/2000/svg", "svg"), this.__root.setAttribute("version", 1.1), this.__root.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.__root.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), this.__root.setAttribute("width", this.width), this.__root.setAttribute("height", this.height), this.__ids = {}, this.__defs = this.__document.createElementNS("http://www.w3.org/2000/svg", "defs"), this.__root.appendChild(this.__defs), this.__currentElement = this.__document.createElementNS("http://www.w3.org/2000/svg", "g"), this.__root.appendChild(this.__currentElement);
      }, w.prototype.__createElement = function(_, C, M) {
        C === void 0 && (C = {});
        var G, ne, ie = this.__document.createElementNS("http://www.w3.org/2000/svg", _), me = Object.keys(C);
        for (M && (ie.setAttribute("fill", "none"), ie.setAttribute("stroke", "none")), G = 0; G < me.length; G++) ne = me[G], ie.setAttribute(ne, C[ne]);
        return ie;
      }, w.prototype.__setDefaultStyles = function() {
        var _, C, M = Object.keys(E);
        for (_ = 0; _ < M.length; _++) C = M[_], this[C] = E[C].canvas;
      }, w.prototype.__applyStyleState = function(_) {
        var C, M, G = Object.keys(_);
        for (C = 0; C < G.length; C++) M = G[C], this[M] = _[M];
      }, w.prototype.__getStyleState = function() {
        var _, C, M = {}, G = Object.keys(E);
        for (_ = 0; _ < G.length; _++) C = G[_], M[C] = this[C];
        return M;
      }, w.prototype.__applyStyleToCurrentElement = function(_) {
        var C = this.__currentElement, M = this.__currentElementsToStyle;
        M && (C.setAttribute(_, ""), C = M.element, M.children.forEach(function(vt) {
          vt.setAttribute(_, "");
        }));
        var G, ne, ie, me, he, Ce, _e = Object.keys(E);
        for (G = 0; G < _e.length; G++) if (ne = E[_e[G]], ie = this[_e[G]], ne.apply) {
          if (ie instanceof Q) {
            if (ie.__ctx) for (; ie.__ctx.__defs.childNodes.length; ) me = ie.__ctx.__defs.childNodes[0].getAttribute("id"), this.__ids[me] = me, this.__defs.appendChild(ie.__ctx.__defs.childNodes[0]);
            C.setAttribute(ne.apply, l("url(#{id})", {
              id: ie.__root.getAttribute("id")
            }));
          } else if (ie instanceof q) C.setAttribute(ne.apply, l("url(#{id})", {
            id: ie.__root.getAttribute("id")
          }));
          else if (ne.apply.indexOf(_) !== -1 && ne.svg !== ie)
            if (ne.svgAttr !== "stroke" && ne.svgAttr !== "fill" || ie.indexOf("rgba") === -1) {
              var xe = ne.svgAttr;
              if (_e[G] === "globalAlpha" && (xe = _ + "-" + ne.svgAttr, C.getAttribute(xe))) continue;
              C.setAttribute(xe, ie);
            } else {
              he = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi, Ce = he.exec(ie), C.setAttribute(ne.svgAttr, l("rgb({r},{g},{b})", {
                r: Ce[1],
                g: Ce[2],
                b: Ce[3]
              }));
              var Te = Ce[4], Be = this.globalAlpha;
              Be != null && (Te *= Be), C.setAttribute(ne.svgAttr + "-opacity", Te);
            }
        }
      }, w.prototype.__closestGroupOrSvg = function(_) {
        return _ = _ || this.__currentElement, _.nodeName === "g" || _.nodeName === "svg" ? _ : this.__closestGroupOrSvg(_.parentNode);
      }, w.prototype.getSerializedSvg = function(_) {
        var C, M, G, ne, ie, me, he = new XMLSerializer().serializeToString(this.__root);
        if (me = /xmlns="http:\/\/www\.w3\.org\/2000\/svg".+xmlns="http:\/\/www\.w3\.org\/2000\/svg/gi, me.test(he) && (he = he.replace('xmlns="http://www.w3.org/2000/svg', 'xmlns:xlink="http://www.w3.org/1999/xlink')), _) for (C = Object.keys(j), M = 0; M < C.length; M++) G = C[M], ne = j[G], ie = new RegExp(G, "gi"), ie.test(he) && (he = he.replace(ie, ne));
        return he;
      }, w.prototype.getSvg = function() {
        return this.__root;
      }, w.prototype.save = function() {
        var _ = this.__createElement("g"), C = this.__closestGroupOrSvg();
        this.__groupStack.push(C), C.appendChild(_), this.__currentElement = _, this.__stack.push(this.__getStyleState());
      }, w.prototype.restore = function() {
        this.__currentElement = this.__groupStack.pop(), this.__currentElementsToStyle = null, this.__currentElement || (this.__currentElement = this.__root.childNodes[1]);
        var _ = this.__stack.pop();
        this.__applyStyleState(_);
      }, w.prototype.__addTransform = function(_) {
        var C = this.__closestGroupOrSvg();
        if (C.childNodes.length > 0) {
          this.__currentElement.nodeName === "path" && (this.__currentElementsToStyle || (this.__currentElementsToStyle = {
            element: C,
            children: []
          }), this.__currentElementsToStyle.children.push(this.__currentElement), this.__applyCurrentDefaultPath());
          var M = this.__createElement("g");
          C.appendChild(M), this.__currentElement = M;
        }
        var G = this.__currentElement.getAttribute("transform");
        G ? G += " " : G = "", G += _, this.__currentElement.setAttribute("transform", G);
      }, w.prototype.scale = function(_, C) {
        C === void 0 && (C = _), this.__addTransform(l("scale({x},{y})", {
          x: _,
          y: C
        }));
      }, w.prototype.rotate = function(_) {
        var C = 180 * _ / Math.PI;
        this.__addTransform(l("rotate({angle},{cx},{cy})", {
          angle: C,
          cx: 0,
          cy: 0
        }));
      }, w.prototype.translate = function(_, C) {
        this.__addTransform(l("translate({x},{y})", {
          x: _,
          y: C
        }));
      }, w.prototype.transform = function(_, C, M, G, ne, ie) {
        this.__addTransform(l("matrix({a},{b},{c},{d},{e},{f})", {
          a: _,
          b: C,
          c: M,
          d: G,
          e: ne,
          f: ie
        }));
      }, w.prototype.beginPath = function() {
        var _, C;
        this.__currentDefaultPath = "", this.__currentPosition = {}, _ = this.__createElement("path", {}, !0), C = this.__closestGroupOrSvg(), C.appendChild(_), this.__currentElement = _;
      }, w.prototype.__applyCurrentDefaultPath = function() {
        var _ = this.__currentElement;
        _.nodeName === "path" ? _.setAttribute("d", this.__currentDefaultPath) : console.error("Attempted to apply path command to node", _.nodeName);
      }, w.prototype.__addPathCommand = function(_) {
        this.__currentDefaultPath += " ", this.__currentDefaultPath += _;
      }, w.prototype.moveTo = function(_, C) {
        this.__currentElement.nodeName !== "path" && this.beginPath(), this.__currentPosition = {
          x: _,
          y: C
        }, this.__addPathCommand(l("M {x} {y}", {
          x: _,
          y: C
        }));
      }, w.prototype.closePath = function() {
        this.__currentDefaultPath && this.__addPathCommand("Z");
      }, w.prototype.lineTo = function(_, C) {
        this.__currentPosition = {
          x: _,
          y: C
        }, this.__currentDefaultPath.indexOf("M") > -1 ? this.__addPathCommand(l("L {x} {y}", {
          x: _,
          y: C
        })) : this.__addPathCommand(l("M {x} {y}", {
          x: _,
          y: C
        }));
      }, w.prototype.bezierCurveTo = function(_, C, M, G, ne, ie) {
        this.__currentPosition = {
          x: ne,
          y: ie
        }, this.__addPathCommand(l("C {cp1x} {cp1y} {cp2x} {cp2y} {x} {y}", {
          cp1x: _,
          cp1y: C,
          cp2x: M,
          cp2y: G,
          x: ne,
          y: ie
        }));
      }, w.prototype.quadraticCurveTo = function(_, C, M, G) {
        this.__currentPosition = {
          x: M,
          y: G
        }, this.__addPathCommand(l("Q {cpx} {cpy} {x} {y}", {
          cpx: _,
          cpy: C,
          x: M,
          y: G
        }));
      };
      var W = function(_) {
        var C = Math.sqrt(_[0] * _[0] + _[1] * _[1]);
        return [
          _[0] / C,
          _[1] / C
        ];
      };
      w.prototype.arcTo = function(_, C, M, G, ne) {
        var ie = this.__currentPosition && this.__currentPosition.x, me = this.__currentPosition && this.__currentPosition.y;
        if (ie !== void 0 && me !== void 0) {
          if (ne < 0) throw new Error("IndexSizeError: The radius provided (" + ne + ") is negative.");
          if (ie === _ && me === C || _ === M && C === G || ne === 0) return void this.lineTo(_, C);
          var he = W([
            ie - _,
            me - C
          ]), Ce = W([
            M - _,
            G - C
          ]);
          if (he[0] * Ce[1] == he[1] * Ce[0]) return void this.lineTo(_, C);
          var _e = he[0] * Ce[0] + he[1] * Ce[1], xe = Math.acos(Math.abs(_e)), Te = W([
            he[0] + Ce[0],
            he[1] + Ce[1]
          ]), Be = ne / Math.sin(xe / 2), vt = _ + Be * Te[0], D = C + Be * Te[1], N = [
            -he[1],
            he[0]
          ], I = [
            Ce[1],
            -Ce[0]
          ], Z = function(ye) {
            var ae = ye[0];
            return ye[1] >= 0 ? Math.acos(ae) : -Math.acos(ae);
          }, J = Z(N), le = Z(I);
          this.lineTo(vt + N[0] * ne, D + N[1] * ne), this.arc(vt, D, ne, J, le);
        }
      }, w.prototype.stroke = function() {
        this.__currentElement.nodeName === "path" && this.__currentElement.setAttribute("paint-order", "fill stroke markers"), this.__applyCurrentDefaultPath(), this.__applyStyleToCurrentElement("stroke");
      }, w.prototype.fill = function() {
        this.__currentElement.nodeName === "path" && this.__currentElement.setAttribute("paint-order", "stroke fill markers"), this.__applyCurrentDefaultPath(), this.__applyStyleToCurrentElement("fill");
      }, w.prototype.rect = function(_, C, M, G) {
        this.__currentElement.nodeName !== "path" && this.beginPath(), this.moveTo(_, C), this.lineTo(_ + M, C), this.lineTo(_ + M, C + G), this.lineTo(_, C + G), this.lineTo(_, C), this.closePath();
      }, w.prototype.fillRect = function(_, C, M, G) {
        var ne, ie;
        ne = this.__createElement("rect", {
          x: _,
          y: C,
          width: M,
          height: G,
          "shape-rendering": "crispEdges"
        }, !0), ie = this.__closestGroupOrSvg(), ie.appendChild(ne), this.__currentElement = ne, this.__applyStyleToCurrentElement("fill");
      }, w.prototype.strokeRect = function(_, C, M, G) {
        var ne, ie;
        ne = this.__createElement("rect", {
          x: _,
          y: C,
          width: M,
          height: G
        }, !0), ie = this.__closestGroupOrSvg(), ie.appendChild(ne), this.__currentElement = ne, this.__applyStyleToCurrentElement("stroke");
      }, w.prototype.__clearCanvas = function() {
        for (var _ = this.__closestGroupOrSvg(), C = _.getAttribute("transform"), M = this.__root.childNodes[1], G = M.childNodes, ne = G.length - 1; ne >= 0; ne--) G[ne] && M.removeChild(G[ne]);
        this.__currentElement = M, this.__groupStack = [], C && this.__addTransform(C);
      }, w.prototype.clearRect = function(_, C, M, G) {
        if (_ === 0 && C === 0 && M === this.width && G === this.height) return void this.__clearCanvas();
        var ne, ie = this.__closestGroupOrSvg();
        ne = this.__createElement("rect", {
          x: _,
          y: C,
          width: M,
          height: G,
          fill: "#FFFFFF"
        }, !0), ie.appendChild(ne);
      }, w.prototype.createLinearGradient = function(_, C, M, G) {
        var ne = this.__createElement("linearGradient", {
          id: u(this.__ids),
          x1: _ + "px",
          x2: M + "px",
          y1: C + "px",
          y2: G + "px",
          gradientUnits: "userSpaceOnUse"
        }, !1);
        return this.__defs.appendChild(ne), new q(ne, this);
      }, w.prototype.createRadialGradient = function(_, C, M, G, ne, ie) {
        var me = this.__createElement("radialGradient", {
          id: u(this.__ids),
          cx: G + "px",
          cy: ne + "px",
          r: ie + "px",
          fx: _ + "px",
          fy: C + "px",
          gradientUnits: "userSpaceOnUse"
        }, !1);
        return this.__defs.appendChild(me), new q(me, this);
      }, w.prototype.__parseFont = function() {
        var _ = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\'\"\sa-z0-9]+?)\s*$/i, C = _.exec(this.font), M = {
          style: C[1] || "normal",
          size: C[4] || "10px",
          family: C[6] || "sans-serif",
          weight: C[3] || "normal",
          decoration: C[2] || "normal",
          href: null
        };
        return this.__fontUnderline === "underline" && (M.decoration = "underline"), this.__fontHref && (M.href = this.__fontHref), M;
      }, w.prototype.__wrapTextLink = function(_, C) {
        if (_.href) {
          var M = this.__createElement("a");
          return M.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", _.href), M.appendChild(C), M;
        }
        return C;
      }, w.prototype.__applyText = function(_, C, M, G) {
        var ne = this.__parseFont(), ie = this.__closestGroupOrSvg(), me = this.__createElement("text", {
          "font-family": ne.family,
          "font-size": ne.size,
          "font-style": ne.style,
          "font-weight": ne.weight,
          "text-decoration": ne.decoration,
          x: C,
          y: M,
          "text-anchor": f(this.textAlign),
          "dominant-baseline": g(this.textBaseline)
        }, !0);
        me.appendChild(this.__document.createTextNode(_)), this.__currentElement = me, this.__applyStyleToCurrentElement(G), ie.appendChild(this.__wrapTextLink(ne, me));
      }, w.prototype.fillText = function(_, C, M) {
        this.__applyText(_, C, M, "fill");
      }, w.prototype.strokeText = function(_, C, M) {
        this.__applyText(_, C, M, "stroke");
      }, w.prototype.measureText = function(_) {
        return this.__ctx.font = this.font, this.__ctx.measureText(_);
      }, w.prototype.arc = function(_, C, M, G, ne, ie) {
        if (G !== ne) {
          G %= 2 * Math.PI, ne %= 2 * Math.PI, G === ne && (ne = (ne + 2 * Math.PI - 1e-3 * (ie ? -1 : 1)) % (2 * Math.PI));
          var me = _ + M * Math.cos(ne), he = C + M * Math.sin(ne), Ce = _ + M * Math.cos(G), _e = C + M * Math.sin(G), xe = ie ? 0 : 1, Te = 0, Be = ne - G;
          Be < 0 && (Be += 2 * Math.PI), Te = ie ? Be > Math.PI ? 0 : 1 : Be > Math.PI ? 1 : 0, this.lineTo(Ce, _e), this.__addPathCommand(l("A {rx} {ry} {xAxisRotation} {largeArcFlag} {sweepFlag} {endX} {endY}", {
            rx: M,
            ry: M,
            xAxisRotation: 0,
            largeArcFlag: Te,
            sweepFlag: xe,
            endX: me,
            endY: he
          })), this.__currentPosition = {
            x: me,
            y: he
          };
        }
      }, w.prototype.clip = function() {
        var _ = this.__closestGroupOrSvg(), C = this.__createElement("clipPath"), M = u(this.__ids), G = this.__createElement("g");
        this.__applyCurrentDefaultPath(), _.removeChild(this.__currentElement), C.setAttribute("id", M), C.appendChild(this.__currentElement), this.__defs.appendChild(C), _.setAttribute("clip-path", l("url(#{id})", {
          id: M
        })), _.appendChild(G), this.__currentElement = G;
      }, w.prototype.drawImage = function() {
        var _, C, M, G, ne, ie, me, he, Ce, _e, xe, Te, Be, vt, D = Array.prototype.slice.call(arguments), N = D[0], I = 0, Z = 0;
        if (D.length === 3) _ = D[1], C = D[2], ne = N.width, ie = N.height, M = ne, G = ie;
        else if (D.length === 5) _ = D[1], C = D[2], M = D[3], G = D[4], ne = N.width, ie = N.height;
        else {
          if (D.length !== 9) throw new Error("Invalid number of arguments passed to drawImage: " + arguments.length);
          I = D[1], Z = D[2], ne = D[3], ie = D[4], _ = D[5], C = D[6], M = D[7], G = D[8];
        }
        me = this.__closestGroupOrSvg(), this.__currentElement;
        var J = "translate(" + _ + ", " + C + ")";
        if (N instanceof w) {
          if (he = N.getSvg().cloneNode(!0), he.childNodes && he.childNodes.length > 1) {
            for (Ce = he.childNodes[0]; Ce.childNodes.length; ) vt = Ce.childNodes[0].getAttribute("id"), this.__ids[vt] = vt, this.__defs.appendChild(Ce.childNodes[0]);
            if (_e = he.childNodes[1]) {
              var le, ye = _e.getAttribute("transform");
              le = ye ? ye + " " + J : J, _e.setAttribute("transform", le), me.appendChild(_e);
            }
          }
        } else N.nodeName !== "CANVAS" && N.nodeName !== "IMG" || (xe = this.__createElement("image"), xe.setAttribute("width", M), xe.setAttribute("height", G), xe.setAttribute("preserveAspectRatio", "none"), xe.setAttribute("opacity", this.globalAlpha), (I || Z || ne !== N.width || ie !== N.height) && (Te = this.__document.createElement("canvas"), Te.width = M, Te.height = G, Be = Te.getContext("2d"), Be.drawImage(N, I, Z, ne, ie, 0, 0, M, G), N = Te), xe.setAttribute("transform", J), xe.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", N.nodeName === "CANVAS" ? N.toDataURL() : N.originalSrc), me.appendChild(xe));
      }, w.prototype.createPattern = function(_, C) {
        var M, G = this.__document.createElementNS("http://www.w3.org/2000/svg", "pattern"), ne = u(this.__ids);
        return G.setAttribute("id", ne), G.setAttribute("width", _.width), G.setAttribute("height", _.height), _.nodeName === "CANVAS" || _.nodeName === "IMG" ? (M = this.__document.createElementNS("http://www.w3.org/2000/svg", "image"), M.setAttribute("width", _.width), M.setAttribute("height", _.height), M.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", _.nodeName === "CANVAS" ? _.toDataURL() : _.getAttribute("src")), G.appendChild(M), this.__defs.appendChild(G)) : _ instanceof w && (G.appendChild(_.__root.childNodes[1]), this.__defs.appendChild(G)), new Q(G, this);
      }, w.prototype.setLineDash = function(_) {
        _ && _.length > 0 ? this.lineDash = _.join(",") : this.lineDash = null;
      }, w.prototype.drawFocusRing = function() {
      }, w.prototype.createImageData = function() {
      }, w.prototype.getImageData = function() {
      }, w.prototype.putImageData = function() {
      }, w.prototype.globalCompositeOperation = function() {
      }, w.prototype.setTransform = function() {
      }, typeof window == "object" && (window.C2S = w), typeof o.exports == "object" && (o.exports = w);
    })(), (function() {
      function l(D, N, I) {
        this.mode = me.MODE_8BIT_BYTE, this.data = D, this.parsedData = [];
        for (var Z = 0, J = this.data.length; Z < J; Z++) {
          var le = [], ye = this.data.charCodeAt(Z);
          N ? le[0] = ye : ye > 65536 ? (le[0] = 240 | (1835008 & ye) >>> 18, le[1] = 128 | (258048 & ye) >>> 12, le[2] = 128 | (4032 & ye) >>> 6, le[3] = 128 | 63 & ye) : ye > 2048 ? (le[0] = 224 | (61440 & ye) >>> 12, le[1] = 128 | (4032 & ye) >>> 6, le[2] = 128 | 63 & ye) : ye > 128 ? (le[0] = 192 | (1984 & ye) >>> 6, le[1] = 128 | 63 & ye) : le[0] = ye, this.parsedData.push(le);
        }
        this.parsedData = Array.prototype.concat.apply([], this.parsedData), I || this.parsedData.length == this.data.length || (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239));
      }
      function u(D, N) {
        this.typeNumber = D, this.errorCorrectLevel = N, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = [];
      }
      function f(D, N) {
        if (D.length == j) throw new Error(D.length + "/" + N);
        for (var I = 0; I < D.length && D[I] == 0; ) I++;
        this.num = new Array(D.length - I + N);
        for (var Z = 0; Z < D.length - I; Z++) this.num[Z] = D[Z + I];
      }
      function g(D, N) {
        this.totalCount = D, this.dataCount = N;
      }
      function E() {
        this.buffer = [], this.length = 0;
      }
      function w() {
        var D = !1, N = navigator.userAgent;
        if (/android/i.test(N)) {
          D = !0;
          var I = N.toString().match(/android ([0-9]\.[0-9])/i);
          I && I[1] && (D = parseFloat(I[1]));
        }
        return D;
      }
      function q(D, N) {
        for (var I = N.correctLevel, Z = 1, J = Q(D), le = 0, ye = Be.length; le < ye; le++) {
          var ae = 0;
          switch (I) {
            case he.L:
              ae = Be[le][0];
              break;
            case he.M:
              ae = Be[le][1];
              break;
            case he.Q:
              ae = Be[le][2];
              break;
            case he.H:
              ae = Be[le][3];
          }
          if (J <= ae) break;
          Z++;
        }
        if (Z > Be.length) throw new Error("Too long data. the CorrectLevel." + [
          "M",
          "L",
          "H",
          "Q"
        ][I] + " limit length is " + ae);
        return N.version != 0 && (Z <= N.version ? (Z = N.version, N.runVersion = Z) : (console.warn("QR Code version " + N.version + " too small, run version use " + Z), N.runVersion = Z)), Z;
      }
      function Q(D) {
        var N = encodeURI(D).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
        return N.length + (N.length != D.length ? 3 : 0);
      }
      var j, W, _ = typeof n == "object" && n && n.Object === Object && n, C = typeof self == "object" && self && self.Object === Object && self, M = _ || C || Function("return this")(), G = s && !s.nodeType && s, ne = G && !0 && o && !o.nodeType && o, ie = M.QRCode;
      l.prototype = {
        getLength: function(D) {
          return this.parsedData.length;
        },
        write: function(D) {
          for (var N = 0, I = this.parsedData.length; N < I; N++) D.put(this.parsedData[N], 8);
        }
      }, u.prototype = {
        addData: function(D, N, I) {
          var Z = new l(D, N, I);
          this.dataList.push(Z), this.dataCache = null;
        },
        isDark: function(D, N) {
          if (D < 0 || this.moduleCount <= D || N < 0 || this.moduleCount <= N) throw new Error(D + "," + N);
          return this.modules[D][N][0];
        },
        getEye: function(D, N) {
          if (D < 0 || this.moduleCount <= D || N < 0 || this.moduleCount <= N) throw new Error(D + "," + N);
          var I = this.modules[D][N];
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
        makeImpl: function(D, N) {
          this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount);
          for (var I = 0; I < this.moduleCount; I++) {
            this.modules[I] = new Array(this.moduleCount);
            for (var Z = 0; Z < this.moduleCount; Z++) this.modules[I][Z] = [];
          }
          this.setupPositionProbePattern(0, 0, "TL"), this.setupPositionProbePattern(this.moduleCount - 7, 0, "BL"), this.setupPositionProbePattern(0, this.moduleCount - 7, "TR"), this.setupPositionAdjustPattern("A"), this.setupTimingPattern(), this.setupTypeInfo(D, N), this.typeNumber >= 7 && this.setupTypeNumber(D), this.dataCache == null && (this.dataCache = u.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, N);
        },
        setupPositionProbePattern: function(D, N, I) {
          for (var Z = -1; Z <= 7; Z++) if (!(D + Z <= -1 || this.moduleCount <= D + Z)) for (var J = -1; J <= 7; J++) N + J <= -1 || this.moduleCount <= N + J || (0 <= Z && Z <= 6 && (J == 0 || J == 6) || 0 <= J && J <= 6 && (Z == 0 || Z == 6) || 2 <= Z && Z <= 4 && 2 <= J && J <= 4 ? (this.modules[D + Z][N + J][0] = !0, this.modules[D + Z][N + J][2] = I, this.modules[D + Z][N + J][1] = Z == -0 || J == -0 || Z == 6 || J == 6 ? "O" : "I") : this.modules[D + Z][N + J][0] = !1);
        },
        getBestMaskPattern: function() {
          for (var D = 0, N = 0, I = 0; I < 8; I++) {
            this.makeImpl(!0, I);
            var Z = _e.getLostPoint(this);
            (I == 0 || D > Z) && (D = Z, N = I);
          }
          return N;
        },
        createMovieClip: function(D, N, I) {
          var Z = D.createEmptyMovieClip(N, I);
          this.make();
          for (var J = 0; J < this.modules.length; J++) for (var le = 1 * J, ye = 0; ye < this.modules[J].length; ye++) {
            var ae = 1 * ye, z = this.modules[J][ye][0];
            z && (Z.beginFill(0, 100), Z.moveTo(ae, le), Z.lineTo(ae + 1, le), Z.lineTo(ae + 1, le + 1), Z.lineTo(ae, le + 1), Z.endFill());
          }
          return Z;
        },
        setupTimingPattern: function() {
          for (var D = 8; D < this.moduleCount - 8; D++) this.modules[D][6][0] == null && (this.modules[D][6][0] = D % 2 == 0);
          for (var N = 8; N < this.moduleCount - 8; N++) this.modules[6][N][0] == null && (this.modules[6][N][0] = N % 2 == 0);
        },
        setupPositionAdjustPattern: function(D) {
          for (var N = _e.getPatternPosition(this.typeNumber), I = 0; I < N.length; I++) for (var Z = 0; Z < N.length; Z++) {
            var J = N[I], le = N[Z];
            if (this.modules[J][le][0] == null) for (var ye = -2; ye <= 2; ye++) for (var ae = -2; ae <= 2; ae++) ye == -2 || ye == 2 || ae == -2 || ae == 2 || ye == 0 && ae == 0 ? (this.modules[J + ye][le + ae][0] = !0, this.modules[J + ye][le + ae][2] = D, this.modules[J + ye][le + ae][1] = ye == -2 || ae == -2 || ye == 2 || ae == 2 ? "O" : "I") : this.modules[J + ye][le + ae][0] = !1;
          }
        },
        setupTypeNumber: function(D) {
          for (var N = _e.getBCHTypeNumber(this.typeNumber), I = 0; I < 18; I++) {
            var Z = !D && (N >> I & 1) == 1;
            this.modules[Math.floor(I / 3)][I % 3 + this.moduleCount - 8 - 3][0] = Z;
          }
          for (var I = 0; I < 18; I++) {
            var Z = !D && (N >> I & 1) == 1;
            this.modules[I % 3 + this.moduleCount - 8 - 3][Math.floor(I / 3)][0] = Z;
          }
        },
        setupTypeInfo: function(D, N) {
          for (var I = this.errorCorrectLevel << 3 | N, Z = _e.getBCHTypeInfo(I), J = 0; J < 15; J++) {
            var le = !D && (Z >> J & 1) == 1;
            J < 6 ? this.modules[J][8][0] = le : J < 8 ? this.modules[J + 1][8][0] = le : this.modules[this.moduleCount - 15 + J][8][0] = le;
          }
          for (var J = 0; J < 15; J++) {
            var le = !D && (Z >> J & 1) == 1;
            J < 8 ? this.modules[8][this.moduleCount - J - 1][0] = le : J < 9 ? this.modules[8][15 - J - 1 + 1][0] = le : this.modules[8][15 - J - 1][0] = le;
          }
          this.modules[this.moduleCount - 8][8][0] = !D;
        },
        mapData: function(D, N) {
          for (var I = -1, Z = this.moduleCount - 1, J = 7, le = 0, ye = this.moduleCount - 1; ye > 0; ye -= 2) for (ye == 6 && ye--; ; ) {
            for (var ae = 0; ae < 2; ae++) if (this.modules[Z][ye - ae][0] == null) {
              var z = !1;
              le < D.length && (z = (D[le] >>> J & 1) == 1);
              var xt = _e.getMask(N, Z, ye - ae);
              xt && (z = !z), this.modules[Z][ye - ae][0] = z, J--, J == -1 && (le++, J = 7);
            }
            if ((Z += I) < 0 || this.moduleCount <= Z) {
              Z -= I, I = -I;
              break;
            }
          }
        }
      }, u.PAD0 = 236, u.PAD1 = 17, u.createData = function(D, N, I) {
        for (var Z = g.getRSBlocks(D, N), J = new E(), le = 0; le < I.length; le++) {
          var ye = I[le];
          J.put(ye.mode, 4), J.put(ye.getLength(), _e.getLengthInBits(ye.mode, D)), ye.write(J);
        }
        for (var ae = 0, le = 0; le < Z.length; le++) ae += Z[le].dataCount;
        if (J.getLengthInBits() > 8 * ae) throw new Error("code length overflow. (" + J.getLengthInBits() + ">" + 8 * ae + ")");
        for (J.getLengthInBits() + 4 <= 8 * ae && J.put(0, 4); J.getLengthInBits() % 8 != 0; ) J.putBit(!1);
        for (; !(J.getLengthInBits() >= 8 * ae || (J.put(u.PAD0, 8), J.getLengthInBits() >= 8 * ae)); )
          J.put(u.PAD1, 8);
        return u.createBytes(J, Z);
      }, u.createBytes = function(D, N) {
        for (var I = 0, Z = 0, J = 0, le = new Array(N.length), ye = new Array(N.length), ae = 0; ae < N.length; ae++) {
          var z = N[ae].dataCount, xt = N[ae].totalCount - z;
          Z = Math.max(Z, z), J = Math.max(J, xt), le[ae] = new Array(z);
          for (var Ye = 0; Ye < le[ae].length; Ye++) le[ae][Ye] = 255 & D.buffer[Ye + I];
          I += z;
          var Wt = _e.getErrorCorrectPolynomial(xt), je = new f(le[ae], Wt.getLength() - 1), Cn = je.mod(Wt);
          ye[ae] = new Array(Wt.getLength() - 1);
          for (var Ye = 0; Ye < ye[ae].length; Ye++) {
            var _n = Ye + Cn.getLength() - ye[ae].length;
            ye[ae][Ye] = _n >= 0 ? Cn.get(_n) : 0;
          }
        }
        for (var Sr = 0, Ye = 0; Ye < N.length; Ye++) Sr += N[Ye].totalCount;
        for (var qn = new Array(Sr), cn = 0, Ye = 0; Ye < Z; Ye++) for (var ae = 0; ae < N.length; ae++) Ye < le[ae].length && (qn[cn++] = le[ae][Ye]);
        for (var Ye = 0; Ye < J; Ye++) for (var ae = 0; ae < N.length; ae++) Ye < ye[ae].length && (qn[cn++] = ye[ae][Ye]);
        return qn;
      };
      for (var me = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8
      }, he = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
      }, Ce = {
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
          for (var N = D << 10; _e.getBCHDigit(N) - _e.getBCHDigit(_e.G15) >= 0; ) N ^= _e.G15 << _e.getBCHDigit(N) - _e.getBCHDigit(_e.G15);
          return (D << 10 | N) ^ _e.G15_MASK;
        },
        getBCHTypeNumber: function(D) {
          for (var N = D << 12; _e.getBCHDigit(N) - _e.getBCHDigit(_e.G18) >= 0; ) N ^= _e.G18 << _e.getBCHDigit(N) - _e.getBCHDigit(_e.G18);
          return D << 12 | N;
        },
        getBCHDigit: function(D) {
          for (var N = 0; D != 0; ) N++, D >>>= 1;
          return N;
        },
        getPatternPosition: function(D) {
          return _e.PATTERN_POSITION_TABLE[D - 1];
        },
        getMask: function(D, N, I) {
          switch (D) {
            case Ce.PATTERN000:
              return (N + I) % 2 == 0;
            case Ce.PATTERN001:
              return N % 2 == 0;
            case Ce.PATTERN010:
              return I % 3 == 0;
            case Ce.PATTERN011:
              return (N + I) % 3 == 0;
            case Ce.PATTERN100:
              return (Math.floor(N / 2) + Math.floor(I / 3)) % 2 == 0;
            case Ce.PATTERN101:
              return N * I % 2 + N * I % 3 == 0;
            case Ce.PATTERN110:
              return (N * I % 2 + N * I % 3) % 2 == 0;
            case Ce.PATTERN111:
              return (N * I % 3 + (N + I) % 2) % 2 == 0;
            default:
              throw new Error("bad maskPattern:" + D);
          }
        },
        getErrorCorrectPolynomial: function(D) {
          for (var N = new f([
            1
          ], 0), I = 0; I < D; I++) N = N.multiply(new f([
            1,
            xe.gexp(I)
          ], 0));
          return N;
        },
        getLengthInBits: function(D, N) {
          if (1 <= N && N < 10) switch (D) {
            case me.MODE_NUMBER:
              return 10;
            case me.MODE_ALPHA_NUM:
              return 9;
            case me.MODE_8BIT_BYTE:
            case me.MODE_KANJI:
              return 8;
            default:
              throw new Error("mode:" + D);
          }
          else if (N < 27) switch (D) {
            case me.MODE_NUMBER:
              return 12;
            case me.MODE_ALPHA_NUM:
              return 11;
            case me.MODE_8BIT_BYTE:
              return 16;
            case me.MODE_KANJI:
              return 10;
            default:
              throw new Error("mode:" + D);
          }
          else {
            if (!(N < 41)) throw new Error("type:" + N);
            switch (D) {
              case me.MODE_NUMBER:
                return 14;
              case me.MODE_ALPHA_NUM:
                return 13;
              case me.MODE_8BIT_BYTE:
                return 16;
              case me.MODE_KANJI:
                return 12;
              default:
                throw new Error("mode:" + D);
            }
          }
        },
        getLostPoint: function(D) {
          for (var N = D.getModuleCount(), I = 0, Z = 0; Z < N; Z++) for (var J = 0; J < N; J++) {
            for (var le = 0, ye = D.isDark(Z, J), ae = -1; ae <= 1; ae++) if (!(Z + ae < 0 || N <= Z + ae)) for (var z = -1; z <= 1; z++) J + z < 0 || N <= J + z || ae == 0 && z == 0 || ye == D.isDark(Z + ae, J + z) && le++;
            le > 5 && (I += 3 + le - 5);
          }
          for (var Z = 0; Z < N - 1; Z++) for (var J = 0; J < N - 1; J++) {
            var xt = 0;
            D.isDark(Z, J) && xt++, D.isDark(Z + 1, J) && xt++, D.isDark(Z, J + 1) && xt++, D.isDark(Z + 1, J + 1) && xt++, xt != 0 && xt != 4 || (I += 3);
          }
          for (var Z = 0; Z < N; Z++) for (var J = 0; J < N - 6; J++) D.isDark(Z, J) && !D.isDark(Z, J + 1) && D.isDark(Z, J + 2) && D.isDark(Z, J + 3) && D.isDark(Z, J + 4) && !D.isDark(Z, J + 5) && D.isDark(Z, J + 6) && (I += 40);
          for (var J = 0; J < N; J++) for (var Z = 0; Z < N - 6; Z++) D.isDark(Z, J) && !D.isDark(Z + 1, J) && D.isDark(Z + 2, J) && D.isDark(Z + 3, J) && D.isDark(Z + 4, J) && !D.isDark(Z + 5, J) && D.isDark(Z + 6, J) && (I += 40);
          for (var Ye = 0, J = 0; J < N; J++) for (var Z = 0; Z < N; Z++) D.isDark(Z, J) && Ye++;
          return I += Math.abs(100 * Ye / N / N - 50) / 5 * 10;
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
      }, Te = 0; Te < 8; Te++) xe.EXP_TABLE[Te] = 1 << Te;
      for (var Te = 8; Te < 256; Te++) xe.EXP_TABLE[Te] = xe.EXP_TABLE[Te - 4] ^ xe.EXP_TABLE[Te - 5] ^ xe.EXP_TABLE[Te - 6] ^ xe.EXP_TABLE[Te - 8];
      for (var Te = 0; Te < 255; Te++) xe.LOG_TABLE[xe.EXP_TABLE[Te]] = Te;
      f.prototype = {
        get: function(D) {
          return this.num[D];
        },
        getLength: function() {
          return this.num.length;
        },
        multiply: function(D) {
          for (var N = new Array(this.getLength() + D.getLength() - 1), I = 0; I < this.getLength(); I++) for (var Z = 0; Z < D.getLength(); Z++) N[I + Z] ^= xe.gexp(xe.glog(this.get(I)) + xe.glog(D.get(Z)));
          return new f(N, 0);
        },
        mod: function(D) {
          if (this.getLength() - D.getLength() < 0) return this;
          for (var N = xe.glog(this.get(0)) - xe.glog(D.get(0)), I = new Array(this.getLength()), Z = 0; Z < this.getLength(); Z++) I[Z] = this.get(Z);
          for (var Z = 0; Z < D.getLength(); Z++) I[Z] ^= xe.gexp(xe.glog(D.get(Z)) + N);
          return new f(I, 0).mod(D);
        }
      }, g.RS_BLOCK_TABLE = [
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
      ], g.getRSBlocks = function(D, N) {
        var I = g.getRsBlockTable(D, N);
        if (I == j) throw new Error("bad rs block @ typeNumber:" + D + "/errorCorrectLevel:" + N);
        for (var Z = I.length / 3, J = [], le = 0; le < Z; le++) for (var ye = I[3 * le + 0], ae = I[3 * le + 1], z = I[3 * le + 2], xt = 0; xt < ye; xt++) J.push(new g(ae, z));
        return J;
      }, g.getRsBlockTable = function(D, N) {
        switch (N) {
          case he.L:
            return g.RS_BLOCK_TABLE[4 * (D - 1) + 0];
          case he.M:
            return g.RS_BLOCK_TABLE[4 * (D - 1) + 1];
          case he.Q:
            return g.RS_BLOCK_TABLE[4 * (D - 1) + 2];
          case he.H:
            return g.RS_BLOCK_TABLE[4 * (D - 1) + 3];
          default:
            return j;
        }
      }, E.prototype = {
        get: function(D) {
          var N = Math.floor(D / 8);
          return (this.buffer[N] >>> 7 - D % 8 & 1) == 1;
        },
        put: function(D, N) {
          for (var I = 0; I < N; I++) this.putBit((D >>> N - I - 1 & 1) == 1);
        },
        getLengthInBits: function() {
          return this.length;
        },
        putBit: function(D) {
          var N = Math.floor(this.length / 8);
          this.buffer.length <= N && this.buffer.push(0), D && (this.buffer[N] |= 128 >>> this.length % 8), this.length++;
        }
      };
      var Be = [
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
      ], vt = /* @__PURE__ */ (function() {
        return typeof CanvasRenderingContext2D < "u";
      })() ? (function() {
        function D() {
          if (this._htOption.drawer == "svg") {
            var le = this._oContext.getSerializedSvg(!0);
            this.dataURL = le, this._el.innerHTML = le;
          } else try {
            var ye = this._elCanvas.toDataURL("image/png");
            this.dataURL = ye;
          } catch (ae) {
            console.error(ae);
          }
          this._htOption.onRenderingEnd && (this.dataURL || console.error("Can not get base64 data, please check: 1. Published the page and image to the server 2. The image request support CORS 3. Configured `crossOrigin:'anonymous'` option"), this._htOption.onRenderingEnd(this._htOption, this.dataURL));
        }
        function N(le, ye) {
          var ae = this;
          if (ae._fFail = ye, ae._fSuccess = le, ae._bSupportDataURI === null) {
            var z = document.createElement("img"), xt = function() {
              ae._bSupportDataURI = !1, ae._fFail && ae._fFail.call(ae);
            }, Ye = function() {
              ae._bSupportDataURI = !0, ae._fSuccess && ae._fSuccess.call(ae);
            };
            return z.onabort = xt, z.onerror = xt, z.onload = Ye, void (z.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==");
          }
          ae._bSupportDataURI === !0 && ae._fSuccess ? ae._fSuccess.call(ae) : ae._bSupportDataURI === !1 && ae._fFail && ae._fFail.call(ae);
        }
        if (M._android && M._android <= 2.1) {
          var I = 1 / window.devicePixelRatio, Z = CanvasRenderingContext2D.prototype.drawImage;
          CanvasRenderingContext2D.prototype.drawImage = function(le, ye, ae, z, xt, Ye, Wt, je, Cn) {
            if ("nodeName" in le && /img/i.test(le.nodeName)) for (var _n = arguments.length - 1; _n >= 1; _n--) arguments[_n] = arguments[_n] * I;
            else je === void 0 && (arguments[1] *= I, arguments[2] *= I, arguments[3] *= I, arguments[4] *= I);
            Z.apply(this, arguments);
          };
        }
        var J = function(le, ye) {
          this._bIsPainted = !1, this._android = w(), this._el = le, this._htOption = ye, this._htOption.drawer == "svg" ? (this._oContext = {}, this._elCanvas = {}) : (this._elCanvas = document.createElement("canvas"), this._el.appendChild(this._elCanvas), this._oContext = this._elCanvas.getContext("2d")), this._bSupportDataURI = null, this.dataURL = null;
        };
        return J.prototype.draw = function(le) {
          function ye() {
            z.quietZone > 0 && z.quietZoneColor && (je.lineWidth = 0, je.fillStyle = z.quietZoneColor, je.fillRect(0, 0, Cn._elCanvas.width, z.quietZone), je.fillRect(0, z.quietZone, z.quietZone, Cn._elCanvas.height - 2 * z.quietZone), je.fillRect(Cn._elCanvas.width - z.quietZone, z.quietZone, z.quietZone, Cn._elCanvas.height - 2 * z.quietZone), je.fillRect(0, Cn._elCanvas.height - z.quietZone, Cn._elCanvas.width, z.quietZone));
          }
          function ae(Sr) {
            function qn(Xn) {
              var dn = Math.round(z.width / 3.5), Tn = Math.round(z.height / 3.5);
              dn !== Tn && (dn = Tn), z.logoMaxWidth ? dn = Math.round(z.logoMaxWidth) : z.logoWidth && (dn = Math.round(z.logoWidth)), z.logoMaxHeight ? Tn = Math.round(z.logoMaxHeight) : z.logoHeight && (Tn = Math.round(z.logoHeight));
              var Gr, Wr;
              Xn.naturalWidth === void 0 ? (Gr = Xn.width, Wr = Xn.height) : (Gr = Xn.naturalWidth, Wr = Xn.naturalHeight), (z.logoMaxWidth || z.logoMaxHeight) && (z.logoMaxWidth && Gr <= dn && (dn = Gr), z.logoMaxHeight && Wr <= Tn && (Tn = Wr), Gr <= dn && Wr <= Tn && (dn = Gr, Tn = Wr));
              var ma = (z.width + 2 * z.quietZone - dn) / 2, ya = (z.height + z.titleHeight + 2 * z.quietZone - Tn) / 2, _c = Math.min(dn / Gr, Tn / Wr), wa = Gr * _c, xa = Wr * _c;
              (z.logoMaxWidth || z.logoMaxHeight) && (dn = wa, Tn = xa, ma = (z.width + 2 * z.quietZone - dn) / 2, ya = (z.height + z.titleHeight + 2 * z.quietZone - Tn) / 2), z.logoBackgroundTransparent || (je.fillStyle = z.logoBackgroundColor, je.fillRect(ma, ya, dn, Tn));
              var Tp = je.imageSmoothingQuality, Lp = je.imageSmoothingEnabled;
              je.imageSmoothingEnabled = !0, je.imageSmoothingQuality = "high", je.drawImage(Xn, ma + (dn - wa) / 2, ya + (Tn - xa) / 2, wa, xa), je.imageSmoothingEnabled = Lp, je.imageSmoothingQuality = Tp, ye(), Rs._bIsPainted = !0, Rs.makeImage();
            }
            z.onRenderingStart && z.onRenderingStart(z);
            for (var cn = 0; cn < xt; cn++) for (var In = 0; In < xt; In++) {
              var Vr = In * Ye + z.quietZone, ws = cn * Wt + z.quietZone, bi = Sr.isDark(cn, In), pn = Sr.getEye(cn, In), qt = z.dotScale;
              je.lineWidth = 0;
              var Xt, gn;
              pn ? (Xt = z[pn.type] || z[pn.type.substring(0, 2)] || z.colorDark, gn = z.colorLight) : z.backgroundImage ? (gn = "rgba(0,0,0,0)", cn == 6 ? z.autoColor ? (Xt = z.timing_H || z.timing || z.autoColorDark, gn = z.autoColorLight) : Xt = z.timing_H || z.timing || z.colorDark : In == 6 ? z.autoColor ? (Xt = z.timing_V || z.timing || z.autoColorDark, gn = z.autoColorLight) : Xt = z.timing_V || z.timing || z.colorDark : z.autoColor ? (Xt = z.autoColorDark, gn = z.autoColorLight) : Xt = z.colorDark) : (Xt = cn == 6 ? z.timing_H || z.timing || z.colorDark : In == 6 && (z.timing_V || z.timing) || z.colorDark, gn = z.colorLight), je.strokeStyle = bi ? Xt : gn, je.fillStyle = bi ? Xt : gn, pn ? (qt = pn.type == "AO" ? z.dotScaleAO : pn.type == "AI" ? z.dotScaleAI : 1, z.backgroundImage && z.autoColor ? (Xt = (pn.type == "AO" ? z.AI : z.AO) || z.autoColorDark, gn = z.autoColorLight) : Xt = (pn.type == "AO" ? z.AI : z.AO) || Xt, bi = pn.isDark, je.fillRect(Vr + Ye * (1 - qt) / 2, z.titleHeight + ws + Wt * (1 - qt) / 2, Ye * qt, Wt * qt)) : cn == 6 ? (qt = z.dotScaleTiming_H, je.fillRect(Vr + Ye * (1 - qt) / 2, z.titleHeight + ws + Wt * (1 - qt) / 2, Ye * qt, Wt * qt)) : In == 6 ? (qt = z.dotScaleTiming_V, je.fillRect(Vr + Ye * (1 - qt) / 2, z.titleHeight + ws + Wt * (1 - qt) / 2, Ye * qt, Wt * qt)) : (z.backgroundImage, je.fillRect(Vr + Ye * (1 - qt) / 2, z.titleHeight + ws + Wt * (1 - qt) / 2, Ye * qt, Wt * qt)), z.dotScale == 1 || pn || (je.strokeStyle = z.colorLight);
            }
            if (z.title && (je.fillStyle = z.titleBackgroundColor, je.fillRect(z.quietZone, z.quietZone, z.width, z.titleHeight), je.font = z.titleFont, je.fillStyle = z.titleColor, je.textAlign = "center", je.fillText(z.title, this._elCanvas.width / 2, +z.quietZone + z.titleTop)), z.subTitle && (je.font = z.subTitleFont, je.fillStyle = z.subTitleColor, je.fillText(z.subTitle, this._elCanvas.width / 2, +z.quietZone + z.subTitleTop)), z.logo) {
              var Cr = new Image(), Rs = this;
              Cr.onload = function() {
                qn(Cr);
              }, Cr.onerror = function(Xn) {
                console.error(Xn);
              }, z.crossOrigin != null && (Cr.crossOrigin = z.crossOrigin), Cr.originalSrc = z.logo, Cr.src = z.logo;
            } else ye(), this._bIsPainted = !0, this.makeImage();
          }
          var z = this._htOption, xt = le.getModuleCount(), Ye = Math.round(z.width / xt), Wt = Math.round((z.height - z.titleHeight) / xt);
          Ye <= 1 && (Ye = 1), Wt <= 1 && (Wt = 1), z.width = Ye * xt, z.height = Wt * xt + z.titleHeight, z.quietZone = Math.round(z.quietZone), this._elCanvas.width = z.width + 2 * z.quietZone, this._elCanvas.height = z.height + 2 * z.quietZone, this._htOption.drawer != "canvas" && (this._oContext = new C2S(this._elCanvas.width, this._elCanvas.height)), this.clear();
          var je = this._oContext;
          je.lineWidth = 0, je.fillStyle = z.colorLight, je.fillRect(0, 0, this._elCanvas.width, this._elCanvas.height), je.clearRect(z.quietZone, z.quietZone, z.width, z.titleHeight);
          var Cn = this;
          if (z.backgroundImage) {
            var _n = new Image();
            _n.onload = function() {
              je.globalAlpha = 1, je.globalAlpha = z.backgroundImageAlpha;
              var Sr = je.imageSmoothingQuality, qn = je.imageSmoothingEnabled;
              je.imageSmoothingEnabled = !0, je.imageSmoothingQuality = "high", je.drawImage(_n, 0, z.titleHeight, z.width + 2 * z.quietZone, z.height + 2 * z.quietZone - z.titleHeight), je.imageSmoothingEnabled = qn, je.imageSmoothingQuality = Sr, je.globalAlpha = 1, ae.call(Cn, le);
            }, z.crossOrigin != null && (_n.crossOrigin = z.crossOrigin), _n.originalSrc = z.backgroundImage, _n.src = z.backgroundImage;
          } else ae.call(Cn, le);
        }, J.prototype.makeImage = function() {
          this._bIsPainted && N.call(this, D);
        }, J.prototype.isPainted = function() {
          return this._bIsPainted;
        }, J.prototype.clear = function() {
          this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1;
        }, J.prototype.remove = function() {
          this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1, this._el.innerHTML = "";
        }, J.prototype.round = function(le) {
          return le && Math.floor(1e3 * le) / 1e3;
        }, J;
      })() : (function() {
        var D = function(N, I) {
          this._el = N, this._htOption = I;
        };
        return D.prototype.draw = function(N) {
          var I = this._htOption, Z = this._el, J = N.getModuleCount(), le = Math.round(I.width / J), ye = Math.round((I.height - I.titleHeight) / J);
          le <= 1 && (le = 1), ye <= 1 && (ye = 1), this._htOption.width = le * J, this._htOption.height = ye * J + I.titleHeight, this._htOption.quietZone = Math.round(this._htOption.quietZone);
          var ae = [], z = "", xt = Math.round(le * I.dotScale), Ye = Math.round(ye * I.dotScale);
          xt < 4 && (xt = 4, Ye = 4);
          var Wt = I.colorDark, je = I.colorLight;
          if (I.backgroundImage) {
            I.autoColor ? (I.colorDark = "rgba(0, 0, 0, .6);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#99000000', EndColorStr='#99000000');", I.colorLight = "rgba(255, 255, 255, .7);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#B2FFFFFF', EndColorStr='#B2FFFFFF');") : I.colorLight = "rgba(0,0,0,0)";
            var Cn = '<div style="display:inline-block; z-index:-10;position:absolute;"><img src="' + I.backgroundImage + '" widht="' + (I.width + 2 * I.quietZone) + '" height="' + (I.height + 2 * I.quietZone) + '" style="opacity:' + I.backgroundImageAlpha + ";filter:alpha(opacity=" + 100 * I.backgroundImageAlpha + '); "/></div>';
            ae.push(Cn);
          }
          if (I.quietZone && (z = "display:inline-block; width:" + (I.width + 2 * I.quietZone) + "px; height:" + (I.width + 2 * I.quietZone) + "px;background:" + I.quietZoneColor + "; text-align:center;"), ae.push('<div style="font-size:0;' + z + '">'), ae.push('<table  style="font-size:0;border:0;border-collapse:collapse; margin-top:' + I.quietZone + 'px;" border="0" cellspacing="0" cellspadding="0" align="center" valign="middle">'), ae.push('<tr height="' + I.titleHeight + '" align="center"><td style="border:0;border-collapse:collapse;margin:0;padding:0" colspan="' + J + '">'), I.title) {
            var _n = I.titleColor, Sr = I.titleFont;
            ae.push('<div style="width:100%;margin-top:' + I.titleTop + "px;color:" + _n + ";font:" + Sr + ";background:" + I.titleBackgroundColor + '">' + I.title + "</div>");
          }
          I.subTitle && ae.push('<div style="width:100%;margin-top:' + (I.subTitleTop - I.titleTop) + "px;color:" + I.subTitleColor + "; font:" + I.subTitleFont + '">' + I.subTitle + "</div>"), ae.push("</td></tr>");
          for (var qn = 0; qn < J; qn++) {
            ae.push('<tr style="border:0; padding:0; margin:0;" height="7">');
            for (var cn = 0; cn < J; cn++) {
              var In = N.isDark(qn, cn), Vr = N.getEye(qn, cn);
              if (Vr) {
                In = Vr.isDark;
                var ws = Vr.type, bi = I[ws] || I[ws.substring(0, 2)] || Wt;
                ae.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + le + "px;height:" + ye + 'px;"><span style="width:' + le + "px;height:" + ye + "px;background-color:" + (In ? bi : je) + ';display:inline-block"></span></td>');
              } else {
                var pn = I.colorDark;
                qn == 6 ? (pn = I.timing_H || I.timing || Wt, ae.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + le + "px;height:" + ye + "px;background-color:" + (In ? pn : je) + ';"></td>')) : cn == 6 ? (pn = I.timing_V || I.timing || Wt, ae.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + le + "px;height:" + ye + "px;background-color:" + (In ? pn : je) + ';"></td>')) : ae.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + le + "px;height:" + ye + 'px;"><div style="display:inline-block;width:' + xt + "px;height:" + Ye + "px;background-color:" + (In ? pn : I.colorLight) + ';"></div></td>');
              }
            }
            ae.push("</tr>");
          }
          if (ae.push("</table>"), ae.push("</div>"), I.logo) {
            var qt = new Image();
            I.crossOrigin != null && (qt.crossOrigin = I.crossOrigin), qt.src = I.logo;
            var Xt = I.width / 3.5, gn = I.height / 3.5;
            Xt != gn && (Xt = gn), I.logoWidth && (Xt = I.logoWidth), I.logoHeight && (gn = I.logoHeight);
            var Cr = "position:relative; z-index:1;display:table-cell;top:-" + ((I.height - I.titleHeight) / 2 + gn / 2 + I.quietZone) + "px;text-align:center; width:" + Xt + "px; height:" + gn + "px;line-height:" + Xt + "px; vertical-align: middle;";
            I.logoBackgroundTransparent || (Cr += "background:" + I.logoBackgroundColor), ae.push('<div style="' + Cr + '"><img  src="' + I.logo + '"  style="max-width: ' + Xt + "px; max-height: " + gn + 'px;" /> <div style=" display: none; width:1px;margin-left: -1px;"></div></div>');
          }
          I.onRenderingStart && I.onRenderingStart(I), Z.innerHTML = ae.join("");
          var Rs = Z.childNodes[0], Xn = (I.width - Rs.offsetWidth) / 2, dn = (I.height - Rs.offsetHeight) / 2;
          Xn > 0 && dn > 0 && (Rs.style.margin = dn + "px " + Xn + "px"), this._htOption.onRenderingEnd && this._htOption.onRenderingEnd(this._htOption, null);
        }, D.prototype.clear = function() {
          this._el.innerHTML = "";
        }, D;
      })();
      W = function(D, N) {
        if (this._htOption = {
          width: 256,
          height: 256,
          typeNumber: 4,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: he.H,
          dotScale: 1,
          dotScaleTiming: 1,
          dotScaleTiming_H: j,
          dotScaleTiming_V: j,
          dotScaleA: 1,
          dotScaleAO: j,
          dotScaleAI: j,
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
          logo: j,
          logoWidth: j,
          logoHeight: j,
          logoMaxWidth: j,
          logoMaxHeight: j,
          logoBackgroundColor: "#ffffff",
          logoBackgroundTransparent: !1,
          PO: j,
          PI: j,
          PO_TL: j,
          PI_TL: j,
          PO_TR: j,
          PI_TR: j,
          PO_BL: j,
          PI_BL: j,
          AO: j,
          AI: j,
          timing: j,
          timing_H: j,
          timing_V: j,
          backgroundImage: j,
          backgroundImageAlpha: 1,
          autoColor: !1,
          autoColorDark: "rgba(0, 0, 0, .6)",
          autoColorLight: "rgba(255, 255, 255, .7)",
          onRenderingStart: j,
          onRenderingEnd: j,
          version: 0,
          tooltip: !1,
          binary: !1,
          drawer: "canvas",
          crossOrigin: null,
          utf8WithoutBOM: !0
        }, typeof N == "string" && (N = {
          text: N
        }), N) for (var I in N) this._htOption[I] = N[I];
        this._htOption.title || this._htOption.subTitle || (this._htOption.titleHeight = 0), (this._htOption.version < 0 || this._htOption.version > 40) && (console.warn("QR Code version '" + this._htOption.version + "' is invalidate, reset to 0"), this._htOption.version = 0), (this._htOption.dotScale < 0 || this._htOption.dotScale > 1) && (console.warn(this._htOption.dotScale + " , is invalidate, dotScale must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScale = 1), (this._htOption.dotScaleTiming < 0 || this._htOption.dotScaleTiming > 1) && (console.warn(this._htOption.dotScaleTiming + " , is invalidate, dotScaleTiming must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleTiming = 1), this._htOption.dotScaleTiming_H ? (this._htOption.dotScaleTiming_H < 0 || this._htOption.dotScaleTiming_H > 1) && (console.warn(this._htOption.dotScaleTiming_H + " , is invalidate, dotScaleTiming_H must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleTiming_H = 1) : this._htOption.dotScaleTiming_H = this._htOption.dotScaleTiming, this._htOption.dotScaleTiming_V ? (this._htOption.dotScaleTiming_V < 0 || this._htOption.dotScaleTiming_V > 1) && (console.warn(this._htOption.dotScaleTiming_V + " , is invalidate, dotScaleTiming_V must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleTiming_V = 1) : this._htOption.dotScaleTiming_V = this._htOption.dotScaleTiming, (this._htOption.dotScaleA < 0 || this._htOption.dotScaleA > 1) && (console.warn(this._htOption.dotScaleA + " , is invalidate, dotScaleA must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleA = 1), this._htOption.dotScaleAO ? (this._htOption.dotScaleAO < 0 || this._htOption.dotScaleAO > 1) && (console.warn(this._htOption.dotScaleAO + " , is invalidate, dotScaleAO must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleAO = 1) : this._htOption.dotScaleAO = this._htOption.dotScaleA, this._htOption.dotScaleAI ? (this._htOption.dotScaleAI < 0 || this._htOption.dotScaleAI > 1) && (console.warn(this._htOption.dotScaleAI + " , is invalidate, dotScaleAI must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleAI = 1) : this._htOption.dotScaleAI = this._htOption.dotScaleA, (this._htOption.backgroundImageAlpha < 0 || this._htOption.backgroundImageAlpha > 1) && (console.warn(this._htOption.backgroundImageAlpha + " , is invalidate, backgroundImageAlpha must between 0 and 1, now reset to 1. "), this._htOption.backgroundImageAlpha = 1), this._htOption.height = this._htOption.height + this._htOption.titleHeight, typeof D == "string" && (D = document.getElementById(D)), (!this._htOption.drawer || this._htOption.drawer != "svg" && this._htOption.drawer != "canvas") && (this._htOption.drawer = "canvas"), this._android = w(), this._el = D, this._oQRCode = null, this._htOption._element = D;
        var Z = {};
        for (var I in this._htOption) Z[I] = this._htOption[I];
        this._oDrawing = new vt(this._el, Z), this._htOption.text && this.makeCode(this._htOption.text);
      }, W.prototype.makeCode = function(D) {
        this._oQRCode = new u(q(D, this._htOption), this._htOption.correctLevel), this._oQRCode.addData(D, this._htOption.binary, this._htOption.utf8WithoutBOM), this._oQRCode.make(), this._htOption.tooltip && (this._el.title = D), this._oDrawing.draw(this._oQRCode);
      }, W.prototype.makeImage = function() {
        typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3) && this._oDrawing.makeImage();
      }, W.prototype.clear = function() {
        this._oDrawing.remove();
      }, W.prototype.resize = function(D, N) {
        this._oDrawing._htOption.width = D, this._oDrawing._htOption.height = N, this._oDrawing.draw(this._oQRCode);
      }, W.prototype.noConflict = function() {
        return M.QRCode === this && (M.QRCode = ie), W;
      }, W.CorrectLevel = he, ne ? ((ne.exports = W).QRCode = W, G.QRCode = W) : M.QRCode = W;
    }).call(this);
  });
  var a = i("58QMB");
  var c = {};
  const d = BigInt(0), h = BigInt(1), p = BigInt(2), b = BigInt(3), m = BigInt(8), v = Object.freeze({
    a: d,
    b: BigInt(7),
    P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
    n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
    h,
    Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
    Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
  }), T = (o, s) => (o + s / p) / s, A = {
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    splitScalar(o) {
      const { n: s } = v, l = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), u = -h * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), f = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), g = l, E = BigInt("0x100000000000000000000000000000000"), w = T(g * o, s), q = T(-u * o, s);
      let Q = pe(o - w * l - q * f, s), j = pe(-w * u - q * g, s);
      const W = Q > E, _ = j > E;
      if (W && (Q = s - Q), _ && (j = s - j), Q > E || j > E) throw new Error("splitScalarEndo: Endomorphism failed, k=" + o);
      return {
        k1neg: W,
        k1: Q,
        k2neg: _,
        k2: j
      };
    }
  }, $ = 32, L = 32, P = 32, B = $ + 1, te = 2 * $ + 1;
  function oe(o) {
    const { a: s, b: l } = v, u = pe(o * o), f = pe(u * o);
    return pe(f + s * o + l);
  }
  const Y = v.a === d;
  class ee extends Error {
    constructor(s) {
      super(s);
    }
  }
  function F(o) {
    if (!(o instanceof U)) throw new TypeError("JacobianPoint expected");
  }
  class U {
    constructor(s, l, u) {
      this.x = s, this.y = l, this.z = u;
    }
    static fromAffine(s) {
      if (!(s instanceof x)) throw new TypeError("JacobianPoint#fromAffine: expected Point");
      return s.equals(x.ZERO) ? U.ZERO : new U(s.x, s.y, h);
    }
    static toAffineBatch(s) {
      const l = Mn(s.map((u) => u.z));
      return s.map((u, f) => u.toAffine(l[f]));
    }
    static normalizeZ(s) {
      return U.toAffineBatch(s).map(U.fromAffine);
    }
    equals(s) {
      F(s);
      const { x: l, y: u, z: f } = this, { x: g, y: E, z: w } = s, q = pe(f * f), Q = pe(w * w), j = pe(l * Q), W = pe(g * q), _ = pe(pe(u * w) * Q), C = pe(pe(E * f) * q);
      return j === W && _ === C;
    }
    negate() {
      return new U(this.x, pe(-this.y), this.z);
    }
    double() {
      const { x: s, y: l, z: u } = this, f = pe(s * s), g = pe(l * l), E = pe(g * g), w = s + g, q = pe(p * (pe(w * w) - f - E)), Q = pe(b * f), j = pe(Q * Q), W = pe(j - p * q), _ = pe(Q * (q - W) - m * E), C = pe(p * l * u);
      return new U(W, _, C);
    }
    add(s) {
      F(s);
      const { x: l, y: u, z: f } = this, { x: g, y: E, z: w } = s;
      if (g === d || E === d) return this;
      if (l === d || u === d) return s;
      const q = pe(f * f), Q = pe(w * w), j = pe(l * Q), W = pe(g * q), _ = pe(pe(u * w) * Q), C = pe(pe(E * f) * q), M = pe(W - j), G = pe(C - _);
      if (M === d)
        return G === d ? this.double() : U.ZERO;
      const ne = pe(M * M), ie = pe(M * ne), me = pe(j * ne), he = pe(G * G - ie - p * me), Ce = pe(G * (me - he) - _ * ie), _e = pe(f * w * M);
      return new U(he, Ce, _e);
    }
    subtract(s) {
      return this.add(s.negate());
    }
    multiplyUnsafe(s) {
      const l = U.ZERO;
      if (typeof s == "bigint" && s === d) return l;
      let u = nt(s);
      if (u === h) return this;
      if (!Y) {
        let W = l, _ = this;
        for (; u > d; )
          u & h && (W = W.add(_)), _ = _.double(), u >>= h;
        return W;
      }
      let { k1neg: f, k1: g, k2neg: E, k2: w } = A.splitScalar(u), q = l, Q = l, j = this;
      for (; g > d || w > d; )
        g & h && (q = q.add(j)), w & h && (Q = Q.add(j)), j = j.double(), g >>= h, w >>= h;
      return f && (q = q.negate()), E && (Q = Q.negate()), Q = new U(pe(Q.x * A.beta), Q.y, Q.z), q.add(Q);
    }
    precomputeWindow(s) {
      const l = Y ? 128 / s + 1 : 256 / s + 1, u = [];
      let f = this, g = f;
      for (let E = 0; E < l; E++) {
        g = f, u.push(g);
        for (let w = 1; w < 2 ** (s - 1); w++)
          g = g.add(f), u.push(g);
        f = g.double();
      }
      return u;
    }
    wNAF(s, l) {
      !l && this.equals(U.BASE) && (l = x.BASE);
      const u = l && l._WINDOW_SIZE || 1;
      if (256 % u) throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
      let f = l && k.get(l);
      f || (f = this.precomputeWindow(u), l && u !== 1 && (f = U.normalizeZ(f), k.set(l, f)));
      let g = U.ZERO, E = U.BASE;
      const w = 1 + (Y ? 128 / u : 256 / u), q = 2 ** (u - 1), Q = BigInt(2 ** u - 1), j = 2 ** u, W = BigInt(u);
      for (let _ = 0; _ < w; _++) {
        const C = _ * q;
        let M = Number(s & Q);
        s >>= W, M > q && (M -= j, s += h);
        const G = C, ne = C + Math.abs(M) - 1, ie = _ % 2 !== 0, me = M < 0;
        M === 0 ? E = E.add(S(ie, f[G])) : g = g.add(S(me, f[ne]));
      }
      return {
        p: g,
        f: E
      };
    }
    multiply(s, l) {
      let u = nt(s), f, g;
      if (Y) {
        const { k1neg: E, k1: w, k2neg: q, k2: Q } = A.splitScalar(u);
        let { p: j, f: W } = this.wNAF(w, l), { p: _, f: C } = this.wNAF(Q, l);
        j = S(E, j), _ = S(q, _), _ = new U(pe(_.x * A.beta), _.y, _.z), f = j.add(_), g = W.add(C);
      } else {
        const { p: E, f: w } = this.wNAF(u, l);
        f = E, g = w;
      }
      return U.normalizeZ([
        f,
        g
      ])[0];
    }
    toAffine(s) {
      const { x: l, y: u, z: f } = this, g = this.equals(U.ZERO);
      s == null && (s = g ? m : It(f));
      const E = s, w = pe(E * E), q = pe(w * E), Q = pe(l * w), j = pe(u * q), W = pe(f * E);
      if (g) return x.ZERO;
      if (W !== h) throw new Error("invZ was invalid");
      return new x(Q, j);
    }
  }
  U.BASE = new U(v.Gx, v.Gy, h), U.ZERO = new U(d, h, d);
  function S(o, s) {
    const l = s.negate();
    return o ? l : s;
  }
  const k = /* @__PURE__ */ new WeakMap();
  class x {
    constructor(s, l) {
      this.x = s, this.y = l;
    }
    _setWindowSize(s) {
      this._WINDOW_SIZE = s, k.delete(this);
    }
    hasEvenY() {
      return this.y % p === d;
    }
    static fromCompressedHex(s) {
      const l = s.length === 32, u = De(l ? s : s.subarray(1));
      if (!et(u)) throw new Error("Point is not on curve");
      const f = oe(u);
      let g = mn(f);
      const E = (g & h) === h;
      l ? E && (g = pe(-g)) : (s[0] & 1) === 1 !== E && (g = pe(-g));
      const w = new x(u, g);
      return w.assertValidity(), w;
    }
    static fromUncompressedHex(s) {
      const l = De(s.subarray(1, $ + 1)), u = De(s.subarray($ + 1, $ * 2 + 1)), f = new x(l, u);
      return f.assertValidity(), f;
    }
    static fromHex(s) {
      const l = Pe(s), u = l.length, f = l[0];
      if (u === $) return this.fromCompressedHex(l);
      if (u === B && (f === 2 || f === 3)) return this.fromCompressedHex(l);
      if (u === te && f === 4) return this.fromUncompressedHex(l);
      throw new Error(`Point.fromHex: received invalid point. Expected 32-${B} compressed bytes or ${te} uncompressed bytes, not ${u}`);
    }
    static fromPrivateKey(s) {
      return x.BASE.multiply(tt(s));
    }
    static fromSignature(s, l, u) {
      const { r: f, s: g } = Ie(l);
      if (![
        0,
        1,
        2,
        3
      ].includes(u)) throw new Error("Cannot recover: invalid recovery bit");
      const E = on(Pe(s)), { n: w } = v, q = u === 2 || u === 3 ? f + w : f, Q = It(q, w), j = pe(-E * Q, w), W = pe(g * Q, w), _ = u & 1 ? "03" : "02", C = x.fromHex(_ + $e(q)), M = x.BASE.multiplyAndAddUnsafe(C, j, W);
      if (!M) throw new Error("Cannot recover signature: point at infinify");
      return M.assertValidity(), M;
    }
    toRawBytes(s = !1) {
      return Xe(this.toHex(s));
    }
    toHex(s = !1) {
      const l = $e(this.x);
      return s ? `${this.hasEvenY() ? "02" : "03"}${l}` : `04${l}${$e(this.y)}`;
    }
    toHexX() {
      return this.toHex(!0).slice(2);
    }
    toRawX() {
      return this.toRawBytes(!0).slice(1);
    }
    assertValidity() {
      const s = "Point is not on elliptic curve", { x: l, y: u } = this;
      if (!et(l) || !et(u)) throw new Error(s);
      const f = pe(u * u), g = oe(l);
      if (pe(f - g) !== d) throw new Error(s);
    }
    equals(s) {
      return this.x === s.x && this.y === s.y;
    }
    negate() {
      return new x(this.x, pe(-this.y));
    }
    double() {
      return U.fromAffine(this).double().toAffine();
    }
    add(s) {
      return U.fromAffine(this).add(U.fromAffine(s)).toAffine();
    }
    subtract(s) {
      return this.add(s.negate());
    }
    multiply(s) {
      return U.fromAffine(this).multiply(s, this).toAffine();
    }
    multiplyAndAddUnsafe(s, l, u) {
      const f = U.fromAffine(this), g = l === d || l === h || this !== x.BASE ? f.multiplyUnsafe(l) : f.multiply(l), E = U.fromAffine(s).multiplyUnsafe(u), w = g.add(E);
      return w.equals(U.ZERO) ? void 0 : w.toAffine();
    }
  }
  x.BASE = new x(v.Gx, v.Gy), x.ZERO = new x(d, d);
  function H(o) {
    return Number.parseInt(o[0], 16) >= 8 ? "00" + o : o;
  }
  function V(o) {
    if (o.length < 2 || o[0] !== 2) throw new Error(`Invalid signature integer tag: ${ve(o)}`);
    const s = o[1], l = o.subarray(2, s + 2);
    if (!s || l.length !== s) throw new Error("Invalid signature integer: wrong length");
    if (l[0] === 0 && l[1] <= 127) throw new Error("Invalid signature integer: trailing length");
    return {
      data: De(l),
      left: o.subarray(s + 2)
    };
  }
  function X(o) {
    if (o.length < 2 || o[0] != 48) throw new Error(`Invalid signature tag: ${ve(o)}`);
    if (o[1] !== o.length - 2) throw new Error("Invalid signature: incorrect length");
    const { data: s, left: l } = V(o.subarray(2)), { data: u, left: f } = V(l);
    if (f.length) throw new Error(`Invalid signature: left bytes after parsing: ${ve(f)}`);
    return {
      r: s,
      s: u
    };
  }
  class K {
    constructor(s, l) {
      this.r = s, this.s = l, this.assertValidity();
    }
    static fromCompact(s) {
      const l = s instanceof Uint8Array, u = "Signature.fromCompact";
      if (typeof s != "string" && !l) throw new TypeError(`${u}: Expected string or Uint8Array`);
      const f = l ? ve(s) : s;
      if (f.length !== 128) throw new Error(`${u}: Expected 64-byte hex`);
      return new K(Ge(f.slice(0, 64)), Ge(f.slice(64, 128)));
    }
    static fromDER(s) {
      const l = s instanceof Uint8Array;
      if (typeof s != "string" && !l) throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
      const { r: u, s: f } = X(l ? s : Xe(s));
      return new K(u, f);
    }
    static fromHex(s) {
      return this.fromDER(s);
    }
    assertValidity() {
      const { r: s, s: l } = this;
      if (!Ve(s)) throw new Error("Invalid Signature: r must be 0 < r < n");
      if (!Ve(l)) throw new Error("Invalid Signature: s must be 0 < s < n");
    }
    hasHighS() {
      const s = v.n >> h;
      return this.s > s;
    }
    normalizeS() {
      return this.hasHighS() ? new K(this.r, pe(-this.s, v.n)) : this;
    }
    toDERRawBytes() {
      return Xe(this.toDERHex());
    }
    toDERHex() {
      const s = H(Le(this.s)), l = H(Le(this.r)), u = s.length / 2, f = l.length / 2, g = Le(u), E = Le(f);
      return `30${Le(f + u + 4)}02${E}${l}02${g}${s}`;
    }
    toRawBytes() {
      return this.toDERRawBytes();
    }
    toHex() {
      return this.toDERHex();
    }
    toCompactRawBytes() {
      return Xe(this.toCompactHex());
    }
    toCompactHex() {
      return $e(this.r) + $e(this.s);
    }
  }
  function re(...o) {
    if (!o.every((u) => u instanceof Uint8Array)) throw new Error("Uint8Array list expected");
    if (o.length === 1) return o[0];
    const s = o.reduce((u, f) => u + f.length, 0), l = new Uint8Array(s);
    for (let u = 0, f = 0; u < o.length; u++) {
      const g = o[u];
      l.set(g, f), f += g.length;
    }
    return l;
  }
  const de = Array.from({
    length: 256
  }, (o, s) => s.toString(16).padStart(2, "0"));
  function ve(o) {
    if (!(o instanceof Uint8Array)) throw new Error("Expected Uint8Array");
    let s = "";
    for (let l = 0; l < o.length; l++) s += de[o[l]];
    return s;
  }
  const ce = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
  function $e(o) {
    if (typeof o != "bigint") throw new Error("Expected bigint");
    if (!(d <= o && o < ce)) throw new Error("Expected number 0 <= n < 2^256");
    return o.toString(16).padStart(64, "0");
  }
  function we(o) {
    const s = Xe($e(o));
    if (s.length !== 32) throw new Error("Error: expected 32 bytes");
    return s;
  }
  function Le(o) {
    const s = o.toString(16);
    return s.length & 1 ? `0${s}` : s;
  }
  function Ge(o) {
    if (typeof o != "string") throw new TypeError("hexToNumber: expected string, got " + typeof o);
    return BigInt(`0x${o}`);
  }
  function Xe(o) {
    if (typeof o != "string") throw new TypeError("hexToBytes: expected string, got " + typeof o);
    if (o.length % 2) throw new Error("hexToBytes: received invalid unpadded hex" + o.length);
    const s = new Uint8Array(o.length / 2);
    for (let l = 0; l < s.length; l++) {
      const u = l * 2, f = o.slice(u, u + 2), g = Number.parseInt(f, 16);
      if (Number.isNaN(g) || g < 0) throw new Error("Invalid byte sequence");
      s[l] = g;
    }
    return s;
  }
  function De(o) {
    return Ge(ve(o));
  }
  function Pe(o) {
    return o instanceof Uint8Array ? Uint8Array.from(o) : Xe(o);
  }
  function nt(o) {
    if (typeof o == "number" && Number.isSafeInteger(o) && o > 0) return BigInt(o);
    if (typeof o == "bigint" && Ve(o)) return o;
    throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
  }
  function pe(o, s = v.P) {
    const l = o % s;
    return l >= d ? l : s + l;
  }
  function ot(o, s) {
    const { P: l } = v;
    let u = o;
    for (; s-- > d; )
      u *= u, u %= l;
    return u;
  }
  function mn(o) {
    const { P: s } = v, l = BigInt(6), u = BigInt(11), f = BigInt(22), g = BigInt(23), E = BigInt(44), w = BigInt(88), q = o * o * o % s, Q = q * q * o % s, j = ot(Q, b) * Q % s, W = ot(j, b) * Q % s, _ = ot(W, p) * q % s, C = ot(_, u) * _ % s, M = ot(C, f) * C % s, G = ot(M, E) * M % s, ne = ot(G, w) * G % s, ie = ot(ne, E) * M % s, me = ot(ie, b) * Q % s, he = ot(me, g) * C % s, Ce = ot(he, l) * q % s, _e = ot(Ce, p);
    if (_e * _e % s !== o) throw new Error("Cannot find square root");
    return _e;
  }
  function It(o, s = v.P) {
    if (o === d || s <= d) throw new Error(`invert: expected positive integers, got n=${o} mod=${s}`);
    let l = pe(o, s), u = s, f = d, g = h;
    for (; l !== d; ) {
      const w = u / l, q = u % l, Q = f - g * w;
      u = l, l = q, f = g, g = Q;
    }
    if (u !== h) throw new Error("invert: does not exist");
    return pe(f, s);
  }
  function Mn(o, s = v.P) {
    const l = new Array(o.length), u = o.reduce((g, E, w) => E === d ? g : (l[w] = g, pe(g * E, s)), h), f = It(u, s);
    return o.reduceRight((g, E, w) => E === d ? g : (l[w] = pe(g * l[w], s), pe(g * E, s)), f), l;
  }
  function yn(o) {
    const s = o.length * 8 - L * 8, l = De(o);
    return s > 0 ? l >> BigInt(s) : l;
  }
  function on(o, s = !1) {
    const l = yn(o);
    if (s) return l;
    const { n: u } = v;
    return l >= u ? l - u : l;
  }
  let fn, ke;
  class Se {
    constructor(s, l) {
      if (this.hashLen = s, this.qByteLen = l, typeof s != "number" || s < 2) throw new Error("hashLen must be a number");
      if (typeof l != "number" || l < 2) throw new Error("qByteLen must be a number");
      this.v = new Uint8Array(s).fill(1), this.k = new Uint8Array(s).fill(0), this.counter = 0;
    }
    hmac(...s) {
      return Ke.hmacSha256(this.k, ...s);
    }
    hmacSync(...s) {
      return ke(this.k, ...s);
    }
    checkSync() {
      if (typeof ke != "function") throw new ee("hmacSha256Sync needs to be set");
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
  function Ve(o) {
    return d < o && o < v.n;
  }
  function et(o) {
    return d < o && o < v.P;
  }
  function bt(o, s, l, u = !0) {
    const { n: f } = v, g = on(o, !0);
    if (!Ve(g)) return;
    const E = It(g, f), w = x.BASE.multiply(g), q = pe(w.x, f);
    if (q === d) return;
    const Q = pe(E * pe(s + l * q, f), f);
    if (Q === d) return;
    let j = new K(q, Q), W = (w.x === j.r ? 0 : 2) | Number(w.y & h);
    return u && j.hasHighS() && (j = j.normalizeS(), W ^= 1), {
      sig: j,
      recovery: W
    };
  }
  function tt(o) {
    let s;
    if (typeof o == "bigint") s = o;
    else if (typeof o == "number" && Number.isSafeInteger(o) && o > 0) s = BigInt(o);
    else if (typeof o == "string") {
      if (o.length !== 2 * L) throw new Error("Expected 32 bytes of private key");
      s = Ge(o);
    } else if (o instanceof Uint8Array) {
      if (o.length !== L) throw new Error("Expected 32 bytes of private key");
      s = De(o);
    } else throw new TypeError("Expected valid private key");
    if (!Ve(s)) throw new Error("Expected private key: 0 < key < n");
    return s;
  }
  function mt(o) {
    return o instanceof x ? (o.assertValidity(), o) : x.fromHex(o);
  }
  function Ie(o) {
    if (o instanceof K)
      return o.assertValidity(), o;
    try {
      return K.fromDER(o);
    } catch {
      return K.fromCompact(o);
    }
  }
  function ct(o, s = !1) {
    return x.fromPrivateKey(o).toRawBytes(s);
  }
  function yt(o) {
    const s = o instanceof Uint8Array, l = typeof o == "string", u = (s || l) && o.length;
    return s ? u === B || u === te : l ? u === B * 2 || u === te * 2 : o instanceof x;
  }
  function zt(o, s, l = !1) {
    if (yt(o)) throw new TypeError("getSharedSecret: first arg must be private key");
    if (!yt(s)) throw new TypeError("getSharedSecret: second arg must be public key");
    const u = mt(s);
    return u.assertValidity(), u.multiply(tt(o)).toRawBytes(l);
  }
  function Tt(o) {
    const s = o.length > $ ? o.slice(0, $) : o;
    return De(s);
  }
  function rn(o) {
    const s = Tt(o), l = pe(s, v.n);
    return Lt(l < d ? s : l);
  }
  function Lt(o) {
    return we(o);
  }
  function wn(o, s, l) {
    if (o == null) throw new Error(`sign: expected valid message hash, not "${o}"`);
    const u = Pe(o), f = tt(s), g = [
      Lt(f),
      rn(u)
    ];
    if (l != null) {
      l === !0 && (l = Ke.randomBytes($));
      const q = Pe(l);
      if (q.length !== $) throw new Error(`sign: Expected ${$} bytes of extra data`);
      g.push(q);
    }
    const E = re(...g), w = Tt(u);
    return {
      seed: E,
      m: w,
      d: f
    };
  }
  function St(o, s) {
    const { sig: l, recovery: u } = o, { der: f, recovered: g } = Object.assign({
      canonical: !0,
      der: !0
    }, s), E = f ? l.toDERRawBytes() : l.toCompactRawBytes();
    return g ? [
      E,
      u
    ] : E;
  }
  function Dt(o, s, l = {}) {
    const { seed: u, m: f, d: g } = wn(o, s, l.extraEntropy), E = new Se(P, L);
    E.reseedSync(u);
    let w;
    for (; !(w = bt(E.generateSync(), f, g, l.canonical)); ) E.reseedSync();
    return St(w, l);
  }
  const Qt = {
    strict: !0
  };
  function Ot(o, s, l, u = Qt) {
    let f;
    try {
      f = Ie(o), s = Pe(s);
    } catch {
      return !1;
    }
    const { r: g, s: E } = f;
    if (u.strict && f.hasHighS()) return !1;
    const w = on(s);
    let q;
    try {
      q = mt(l);
    } catch {
      return !1;
    }
    const { n: Q } = v, j = It(E, Q), W = pe(w * j, Q), _ = pe(g * j, Q), C = x.BASE.multiplyAndAddUnsafe(q, W, _);
    return C ? pe(C.x, Q) === g : !1;
  }
  function kt(o) {
    return pe(De(o), v.n);
  }
  class an {
    constructor(s, l) {
      this.r = s, this.s = l, this.assertValidity();
    }
    static fromHex(s) {
      const l = Pe(s);
      if (l.length !== 64) throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${l.length}`);
      const u = De(l.subarray(0, 32)), f = De(l.subarray(32, 64));
      return new an(u, f);
    }
    assertValidity() {
      const { r: s, s: l } = this;
      if (!et(s) || !Ve(l)) throw new Error("Invalid signature");
    }
    toHex() {
      return $e(this.r) + $e(this.s);
    }
    toRawBytes() {
      return Xe(this.toHex());
    }
  }
  function xn(o) {
    return x.fromPrivateKey(o).toRawX();
  }
  class En {
    constructor(s, l, u = Ke.randomBytes()) {
      if (s == null) throw new TypeError(`sign: Expected valid message, not "${s}"`);
      this.m = Pe(s);
      const { x: f, scalar: g } = this.getScalar(tt(l));
      if (this.px = f, this.d = g, this.rand = Pe(u), this.rand.length !== 32) throw new TypeError("sign: Expected 32 bytes of aux randomness");
    }
    getScalar(s) {
      const l = x.fromPrivateKey(s), u = l.hasEvenY() ? s : v.n - s;
      return {
        point: l,
        scalar: u,
        x: l.toRawX()
      };
    }
    initNonce(s, l) {
      return we(s ^ De(l));
    }
    finalizeNonce(s) {
      const l = pe(De(s), v.n);
      if (l === d) throw new Error("sign: Creation of signature failed. k is zero");
      const { point: u, x: f, scalar: g } = this.getScalar(l);
      return {
        R: u,
        rx: f,
        k: g
      };
    }
    finalizeSig(s, l, u, f) {
      return new an(s.x, pe(l + u * f, v.n)).toRawBytes();
    }
    error() {
      throw new Error("sign: Invalid signature produced");
    }
    async calc() {
      const { m: s, d: l, px: u, rand: f } = this, g = Ke.taggedHash, E = this.initNonce(l, await g(Jt.aux, f)), { R: w, rx: q, k: Q } = this.finalizeNonce(await g(Jt.nonce, E, u, s)), j = kt(await g(Jt.challenge, q, u, s)), W = this.finalizeSig(w, Q, j, l);
      return await $n(W, s, u) || this.error(), W;
    }
    calcSync() {
      const { m: s, d: l, px: u, rand: f } = this, g = Ke.taggedHashSync, E = this.initNonce(l, g(Jt.aux, f)), { R: w, rx: q, k: Q } = this.finalizeNonce(g(Jt.nonce, E, u, s)), j = kt(g(Jt.challenge, q, u, s)), W = this.finalizeSig(w, Q, j, l);
      return Yn(W, s, u) || this.error(), W;
    }
  }
  async function jn(o, s, l) {
    return new En(o, s, l).calc();
  }
  function ir(o, s, l) {
    return new En(o, s, l).calcSync();
  }
  function Bn(o, s, l) {
    const u = o instanceof an, f = u ? o : an.fromHex(o);
    return u && f.assertValidity(), {
      ...f,
      m: Pe(s),
      P: mt(l)
    };
  }
  function Fn(o, s, l, u) {
    const f = x.BASE.multiplyAndAddUnsafe(s, tt(l), pe(-u, v.n));
    return !(!f || !f.hasEvenY() || f.x !== o);
  }
  async function $n(o, s, l) {
    try {
      const { r: u, s: f, m: g, P: E } = Bn(o, s, l), w = kt(await Ke.taggedHash(Jt.challenge, we(u), E.toRawX(), g));
      return Fn(u, E, f, w);
    } catch {
      return !1;
    }
  }
  function Yn(o, s, l) {
    try {
      const { r: u, s: f, m: g, P: E } = Bn(o, s, l), w = kt(Ke.taggedHashSync(Jt.challenge, we(u), E.toRawX(), g));
      return Fn(u, E, f, w);
    } catch (u) {
      if (u instanceof ee) throw u;
      return !1;
    }
  }
  const Un = {
    Signature: an,
    getPublicKey: xn,
    sign: jn,
    verify: $n,
    signSync: ir,
    verifySync: Yn
  };
  x.BASE._setWindowSize(8);
  const Rt = {
    node: c,
    web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
  }, Jt = {
    challenge: "BIP0340/challenge",
    aux: "BIP0340/aux",
    nonce: "BIP0340/nonce"
  }, Zn = {}, Ke = {
    bytesToHex: ve,
    hexToBytes: Xe,
    concatBytes: re,
    mod: pe,
    invert: It,
    isValidPrivateKey(o) {
      try {
        return tt(o), !0;
      } catch {
        return !1;
      }
    },
    _bigintTo32Bytes: we,
    _normalizePrivateKey: tt,
    hashToPrivateKey: (o) => {
      o = Pe(o);
      const s = L + 8;
      if (o.length < s || o.length > 1024) throw new Error("Expected valid bytes of private key as per FIPS 186");
      const l = pe(De(o), v.n - h) + h;
      return we(l);
    },
    randomBytes: (o = 32) => {
      if (Rt.web) return Rt.web.getRandomValues(new Uint8Array(o));
      if (Rt.node) {
        const { randomBytes: s } = Rt.node;
        return Uint8Array.from(s(o));
      } else throw new Error("The environment doesn't have randomBytes function");
    },
    randomPrivateKey: () => Ke.hashToPrivateKey(Ke.randomBytes(L + 8)),
    precompute(o = 8, s = x.BASE) {
      const l = s === x.BASE ? s : new x(s.x, s.y);
      return l._setWindowSize(o), l.multiply(b), l;
    },
    sha256: async (...o) => {
      if (Rt.web) {
        const s = await Rt.web.subtle.digest("SHA-256", re(...o));
        return new Uint8Array(s);
      } else if (Rt.node) {
        const { createHash: s } = Rt.node, l = s("sha256");
        return o.forEach((u) => l.update(u)), Uint8Array.from(l.digest());
      } else throw new Error("The environment doesn't have sha256 function");
    },
    hmacSha256: async (o, ...s) => {
      if (Rt.web) {
        const l = await Rt.web.subtle.importKey("raw", o, {
          name: "HMAC",
          hash: {
            name: "SHA-256"
          }
        }, !1, [
          "sign"
        ]), u = re(...s), f = await Rt.web.subtle.sign("HMAC", l, u);
        return new Uint8Array(f);
      } else if (Rt.node) {
        const { createHmac: l } = Rt.node, u = l("sha256", o);
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
      if (typeof fn != "function") throw new ee("sha256Sync is undefined, you need to set it");
      let l = Zn[o];
      if (l === void 0) {
        const u = fn(Uint8Array.from(o, (f) => f.charCodeAt(0)));
        l = re(u, u), Zn[o] = l;
      }
      return fn(l, ...s);
    },
    _JacobianPoint: U
  };
  Object.defineProperties(Ke, {
    sha256Sync: {
      configurable: !1,
      get() {
        return fn;
      },
      set(o) {
        fn || (fn = o);
      }
    },
    hmacSha256Sync: {
      configurable: !1,
      get() {
        return ke;
      },
      set(o) {
        ke || (ke = o);
      }
    }
  });
  var Mt = {};
  Object.defineProperty(Mt, "__esModule", {
    value: !0
  }), Mt.sha224 = Mt.sha256 = void 0;
  var Pn = {};
  Object.defineProperty(Pn, "__esModule", {
    value: !0
  }), Pn.SHA2 = void 0;
  var rt = {};
  Object.defineProperty(rt, "__esModule", {
    value: !0
  }), rt.output = rt.exists = rt.hash = rt.bytes = rt.bool = rt.number = void 0;
  function at(o) {
    if (!Number.isSafeInteger(o) || o < 0) throw new Error(`Wrong positive integer: ${o}`);
  }
  rt.number = at;
  function $t(o) {
    if (typeof o != "boolean") throw new Error(`Expected boolean, not ${o}`);
  }
  rt.bool = $t;
  function wt(o, ...s) {
    if (!(o instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
    if (s.length > 0 && !s.includes(o.length)) throw new TypeError(`Expected Uint8Array of length ${s}, not of length=${o.length}`);
  }
  rt.bytes = wt;
  function en(o) {
    if (typeof o != "function" || typeof o.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
    at(o.outputLen), at(o.blockLen);
  }
  rt.hash = en;
  function Ze(o, s = !0) {
    if (o.destroyed) throw new Error("Hash instance has been destroyed");
    if (s && o.finished) throw new Error("Hash#digest() has already been called");
  }
  rt.exists = Ze;
  function lt(o, s) {
    wt(o);
    const l = s.outputLen;
    if (o.length < l) throw new Error(`digestInto() expects output buffer of length at least ${l}`);
  }
  rt.output = lt;
  const Et = {
    number: at,
    bool: $t,
    bytes: wt,
    hash: en,
    exists: Ze,
    output: lt
  };
  rt.default = Et;
  var ue = {};
  Object.defineProperty(ue, "__esModule", {
    value: !0
  }), ue.randomBytes = ue.wrapConstructorWithOpts = ue.wrapConstructor = ue.checkOpts = ue.Hash = ue.concatBytes = ue.toBytes = ue.utf8ToBytes = ue.asyncLoop = ue.nextTick = ue.hexToBytes = ue.bytesToHex = ue.isLE = ue.rotr = ue.createView = ue.u32 = ue.u8 = void 0;
  var Ct = {};
  Object.defineProperty(Ct, "__esModule", {
    value: !0
  }), Ct.crypto = void 0, Ct.crypto = {
    node: void 0,
    web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
  };
  const zr = (o) => new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  ue.u8 = zr;
  const hs = (o) => new Uint32Array(o.buffer, o.byteOffset, Math.floor(o.byteLength / 4));
  ue.u32 = hs;
  const Ss = (o) => new DataView(o.buffer, o.byteOffset, o.byteLength);
  ue.createView = Ss;
  const Xs = (o, s) => o << 32 - s | o >>> s;
  if (ue.rotr = Xs, ue.isLE = new Uint8Array(new Uint32Array([
    287454020
  ]).buffer)[0] === 68, !ue.isLE) throw new Error("Non little-endian hardware is not supported");
  const Cs = Array.from({
    length: 256
  }, (o, s) => s.toString(16).padStart(2, "0"));
  function Js(o) {
    if (!(o instanceof Uint8Array)) throw new Error("Uint8Array expected");
    let s = "";
    for (let l = 0; l < o.length; l++) s += Cs[o[l]];
    return s;
  }
  ue.bytesToHex = Js;
  function Ri(o) {
    if (typeof o != "string") throw new TypeError("hexToBytes: expected string, got " + typeof o);
    if (o.length % 2) throw new Error("hexToBytes: received invalid unpadded hex");
    const s = new Uint8Array(o.length / 2);
    for (let l = 0; l < s.length; l++) {
      const u = l * 2, f = o.slice(u, u + 2), g = Number.parseInt(f, 16);
      if (Number.isNaN(g) || g < 0) throw new Error("Invalid byte sequence");
      s[l] = g;
    }
    return s;
  }
  ue.hexToBytes = Ri;
  const Mi = async () => {
  };
  ue.nextTick = Mi;
  async function ei(o, s, l) {
    let u = Date.now();
    for (let f = 0; f < o; f++) {
      l(f);
      const g = Date.now() - u;
      g >= 0 && g < s || (await (0, ue.nextTick)(), u += g);
    }
  }
  ue.asyncLoop = ei;
  function ti(o) {
    if (typeof o != "string") throw new TypeError(`utf8ToBytes expected string, got ${typeof o}`);
    return new TextEncoder().encode(o);
  }
  ue.utf8ToBytes = ti;
  function fs(o) {
    if (typeof o == "string" && (o = ti(o)), !(o instanceof Uint8Array)) throw new TypeError(`Expected input type is Uint8Array (got ${typeof o})`);
    return o;
  }
  ue.toBytes = fs;
  function Ho(...o) {
    if (!o.every((u) => u instanceof Uint8Array)) throw new Error("Uint8Array list expected");
    if (o.length === 1) return o[0];
    const s = o.reduce((u, f) => u + f.length, 0), l = new Uint8Array(s);
    for (let u = 0, f = 0; u < o.length; u++) {
      const g = o[u];
      l.set(g, f), f += g.length;
    }
    return l;
  }
  ue.concatBytes = Ho;
  class qo {
    // Safe version that clones internal state
    clone() {
      return this._cloneInto();
    }
  }
  ue.Hash = qo;
  const Bi = (o) => Object.prototype.toString.call(o) === "[object Object]" && o.constructor === Object;
  function jo(o, s) {
    if (s !== void 0 && (typeof s != "object" || !Bi(s))) throw new TypeError("Options should be object or undefined");
    return Object.assign(o, s);
  }
  ue.checkOpts = jo;
  function Fo(o) {
    const s = (u) => o().update(fs(u)).digest(), l = o();
    return s.outputLen = l.outputLen, s.blockLen = l.blockLen, s.create = () => o(), s;
  }
  ue.wrapConstructor = Fo;
  function Zo(o) {
    const s = (u, f) => o(f).update(fs(u)).digest(), l = o({});
    return s.outputLen = l.outputLen, s.blockLen = l.blockLen, s.create = (u) => o(u), s;
  }
  ue.wrapConstructorWithOpts = Zo;
  function ni(o = 32) {
    if (Ct.crypto.web) return Ct.crypto.web.getRandomValues(new Uint8Array(o));
    if (Ct.crypto.node) return new Uint8Array(Ct.crypto.node.randomBytes(o).buffer);
    throw new Error("The environment doesn't have randomBytes function");
  }
  ue.randomBytes = ni;
  function ri(o, s, l, u) {
    if (typeof o.setBigUint64 == "function") return o.setBigUint64(s, l, u);
    const f = BigInt(32), g = BigInt(4294967295), E = Number(l >> f & g), w = Number(l & g), q = u ? 4 : 0, Q = u ? 0 : 4;
    o.setUint32(s + q, E, u), o.setUint32(s + Q, w, u);
  }
  class Ui extends ue.Hash {
    constructor(s, l, u, f) {
      super(), this.blockLen = s, this.outputLen = l, this.padOffset = u, this.isLE = f, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(s), this.view = (0, ue.createView)(this.buffer);
    }
    update(s) {
      rt.default.exists(this);
      const { view: l, buffer: u, blockLen: f } = this;
      s = (0, ue.toBytes)(s);
      const g = s.length;
      for (let E = 0; E < g; ) {
        const w = Math.min(f - this.pos, g - E);
        if (w === f) {
          const q = (0, ue.createView)(s);
          for (; f <= g - E; E += f) this.process(q, E);
          continue;
        }
        u.set(s.subarray(E, E + w), this.pos), this.pos += w, E += w, this.pos === f && (this.process(l, 0), this.pos = 0);
      }
      return this.length += s.length, this.roundClean(), this;
    }
    digestInto(s) {
      rt.default.exists(this), rt.default.output(s, this), this.finished = !0;
      const { buffer: l, view: u, blockLen: f, isLE: g } = this;
      let { pos: E } = this;
      l[E++] = 128, this.buffer.subarray(E).fill(0), this.padOffset > f - E && (this.process(u, 0), E = 0);
      for (let W = E; W < f; W++) l[W] = 0;
      ri(u, f - 8, BigInt(this.length * 8), g), this.process(u, 0);
      const w = (0, ue.createView)(s), q = this.outputLen;
      if (q % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
      const Q = q / 4, j = this.get();
      if (Q > j.length) throw new Error("_sha2: outputLen bigger than state");
      for (let W = 0; W < Q; W++) w.setUint32(4 * W, j[W], g);
    }
    digest() {
      const { buffer: s, outputLen: l } = this;
      this.digestInto(s);
      const u = s.slice(0, l);
      return this.destroy(), u;
    }
    _cloneInto(s) {
      s || (s = new this.constructor()), s.set(...this.get());
      const { blockLen: l, buffer: u, length: f, finished: g, destroyed: E, pos: w } = this;
      return s.length = f, s.pos = w, s.finished = g, s.destroyed = E, f % l && s.buffer.set(u), s;
    }
  }
  Pn.SHA2 = Ui;
  const si = (o, s, l) => o & s ^ ~o & l, Pi = (o, s, l) => o & s ^ o & l ^ s & l, ii = new Uint32Array([
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
  ]), or = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]), ar = new Uint32Array(64);
  class oi extends Pn.SHA2 {
    constructor() {
      super(64, 32, 8, !1), this.A = or[0] | 0, this.B = or[1] | 0, this.C = or[2] | 0, this.D = or[3] | 0, this.E = or[4] | 0, this.F = or[5] | 0, this.G = or[6] | 0, this.H = or[7] | 0;
    }
    get() {
      const { A: s, B: l, C: u, D: f, E: g, F: E, G: w, H: q } = this;
      return [
        s,
        l,
        u,
        f,
        g,
        E,
        w,
        q
      ];
    }
    // prettier-ignore
    set(s, l, u, f, g, E, w, q) {
      this.A = s | 0, this.B = l | 0, this.C = u | 0, this.D = f | 0, this.E = g | 0, this.F = E | 0, this.G = w | 0, this.H = q | 0;
    }
    process(s, l) {
      for (let W = 0; W < 16; W++, l += 4) ar[W] = s.getUint32(l, !1);
      for (let W = 16; W < 64; W++) {
        const _ = ar[W - 15], C = ar[W - 2], M = (0, ue.rotr)(_, 7) ^ (0, ue.rotr)(_, 18) ^ _ >>> 3, G = (0, ue.rotr)(C, 17) ^ (0, ue.rotr)(C, 19) ^ C >>> 10;
        ar[W] = G + ar[W - 7] + M + ar[W - 16] | 0;
      }
      let { A: u, B: f, C: g, D: E, E: w, F: q, G: Q, H: j } = this;
      for (let W = 0; W < 64; W++) {
        const _ = (0, ue.rotr)(w, 6) ^ (0, ue.rotr)(w, 11) ^ (0, ue.rotr)(w, 25), C = j + _ + si(w, q, Q) + ii[W] + ar[W] | 0, G = ((0, ue.rotr)(u, 2) ^ (0, ue.rotr)(u, 13) ^ (0, ue.rotr)(u, 22)) + Pi(u, f, g) | 0;
        j = Q, Q = q, q = w, w = E + C | 0, E = g, g = f, f = u, u = C + G | 0;
      }
      u = u + this.A | 0, f = f + this.B | 0, g = g + this.C | 0, E = E + this.D | 0, w = w + this.E | 0, q = q + this.F | 0, Q = Q + this.G | 0, j = j + this.H | 0, this.set(u, f, g, E, w, q, Q, j);
    }
    roundClean() {
      ar.fill(0);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
    }
  }
  class Vo extends oi {
    constructor() {
      super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
    }
  }
  Mt.sha256 = (0, ue.wrapConstructor)(() => new oi()), Mt.sha224 = (0, ue.wrapConstructor)(() => new Vo());
  function lr(o) {
    if (!Number.isSafeInteger(o)) throw new Error(`Wrong integer: ${o}`);
  }
  function kn(...o) {
    const s = (f, g) => (E) => f(g(E)), l = Array.from(o).reverse().reduce((f, g) => f ? s(f, g.encode) : g.encode, void 0), u = o.reduce((f, g) => f ? s(f, g.decode) : g.decode, void 0);
    return {
      encode: l,
      decode: u
    };
  }
  function An(o) {
    return {
      encode: (s) => {
        if (!Array.isArray(s) || s.length && typeof s[0] != "number") throw new Error("alphabet.encode input should be an array of numbers");
        return s.map((l) => {
          if (lr(l), l < 0 || l >= o.length) throw new Error(`Digit index outside alphabet: ${l} (alphabet: ${o.length})`);
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
  function zn(o = "") {
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
  function $r(o, s = "=") {
    if (lr(o), typeof s != "string") throw new Error("padding chr should be string");
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
  function zi(o) {
    if (typeof o != "function") throw new Error("normalize fn should be function");
    return {
      encode: (s) => s,
      decode: (s) => o(s)
    };
  }
  function Hi(o, s, l) {
    if (s < 2) throw new Error(`convertRadix: wrong from=${s}, base cannot be less than 2`);
    if (l < 2) throw new Error(`convertRadix: wrong to=${l}, base cannot be less than 2`);
    if (!Array.isArray(o)) throw new Error("convertRadix: data should be array");
    if (!o.length) return [];
    let u = 0;
    const f = [], g = Array.from(o);
    for (g.forEach((E) => {
      if (lr(E), E < 0 || E >= s) throw new Error(`Wrong integer: ${E}`);
    }); ; ) {
      let E = 0, w = !0;
      for (let q = u; q < g.length; q++) {
        const Q = g[q], j = s * E + Q;
        if (!Number.isSafeInteger(j) || s * E / s !== E || j - Q !== s * E) throw new Error("convertRadix: carry overflow");
        if (E = j % l, g[q] = Math.floor(j / l), !Number.isSafeInteger(g[q]) || g[q] * l + E !== j) throw new Error("convertRadix: carry overflow");
        if (w) g[q] ? w = !1 : u = q;
        else continue;
      }
      if (f.push(E), w) break;
    }
    for (let E = 0; E < o.length - 1 && o[E] === 0; E++) f.push(0);
    return f.reverse();
  }
  const ai = (o, s) => s ? ai(s, o % s) : o, Is = (o, s) => o + (s - ai(o, s));
  function ps(o, s, l, u) {
    if (!Array.isArray(o)) throw new Error("convertRadix2: data should be array");
    if (s <= 0 || s > 32) throw new Error(`convertRadix2: wrong from=${s}`);
    if (l <= 0 || l > 32) throw new Error(`convertRadix2: wrong to=${l}`);
    if (Is(s, l) > 32) throw new Error(`convertRadix2: carry overflow from=${s} to=${l} carryBits=${Is(s, l)}`);
    let f = 0, g = 0;
    const E = 2 ** l - 1, w = [];
    for (const q of o) {
      if (lr(q), q >= 2 ** s) throw new Error(`convertRadix2: invalid data word=${q} from=${s}`);
      if (f = f << s | q, g + s > 32) throw new Error(`convertRadix2: carry overflow pos=${g} from=${s}`);
      for (g += s; g >= l; g -= l) w.push((f >> g - l & E) >>> 0);
      f &= 2 ** g - 1;
    }
    if (f = f << l - g & E, !u && g >= s) throw new Error("Excess padding");
    if (!u && f) throw new Error(`Non-zero padding: ${f}`);
    return u && g > 0 && w.push(f >>> 0), w;
  }
  function li(o) {
    return lr(o), {
      encode: (s) => {
        if (!(s instanceof Uint8Array)) throw new Error("radix.encode input should be Uint8Array");
        return Hi(Array.from(s), 256, o);
      },
      decode: (s) => {
        if (!Array.isArray(s) || s.length && typeof s[0] != "number") throw new Error("radix.decode input should be array of strings");
        return Uint8Array.from(Hi(s, o, 256));
      }
    };
  }
  function Hn(o, s = !1) {
    if (lr(o), o <= 0 || o > 32) throw new Error("radix2: bits should be in (0..32]");
    if (Is(8, o) > 32 || Is(o, 8) > 32) throw new Error("radix2: carry overflow");
    return {
      encode: (l) => {
        if (!(l instanceof Uint8Array)) throw new Error("radix2.encode input should be Uint8Array");
        return ps(Array.from(l), 8, o, !s);
      },
      decode: (l) => {
        if (!Array.isArray(l) || l.length && typeof l[0] != "number") throw new Error("radix2.decode input should be array of strings");
        return Uint8Array.from(ps(l, o, 8, s));
      }
    };
  }
  function qi(o) {
    if (typeof o != "function") throw new Error("unsafeWrapper fn should be function");
    return function(...s) {
      try {
        return o.apply(null, s);
      } catch {
      }
    };
  }
  function ci(o, s) {
    if (lr(o), typeof s != "function") throw new Error("checksum fn should be function");
    return {
      encode(l) {
        if (!(l instanceof Uint8Array)) throw new Error("checksum.encode: input should be Uint8Array");
        const u = s(l).slice(0, o), f = new Uint8Array(l.length + o);
        return f.set(l), f.set(u, l.length), f;
      },
      decode(l) {
        if (!(l instanceof Uint8Array)) throw new Error("checksum.decode: input should be Uint8Array");
        const u = l.slice(0, -o), f = s(u).slice(0, o), g = l.slice(-o);
        for (let E = 0; E < o; E++) if (f[E] !== g[E]) throw new Error("Invalid checksum");
        return u;
      }
    };
  }
  const Ts = {
    alphabet: An,
    chain: kn,
    checksum: ci,
    radix: li,
    radix2: Hn,
    join: zn,
    padding: $r
  }, di = kn(Hn(4), An("0123456789ABCDEF"), zn("")), ui = kn(Hn(5), An("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), $r(5), zn(""));
  kn(Hn(5), An("0123456789ABCDEFGHIJKLMNOPQRSTUV"), $r(5), zn("")), kn(Hn(5), An("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), zn(""), zi((o) => o.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
  const kr = kn(Hn(6), An("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), $r(6), zn("")), ji = kn(Hn(6), An("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), $r(6), zn("")), gs = (o) => kn(li(58), An(o), zn("")), Ls = gs("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
  gs("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), gs("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
  const Fi = [
    0,
    2,
    3,
    5,
    6,
    7,
    9,
    10,
    11
  ], Ar = {
    encode(o) {
      let s = "";
      for (let l = 0; l < o.length; l += 8) {
        const u = o.subarray(l, l + 8);
        s += Ls.encode(u).padStart(Fi[u.length], "1");
      }
      return s;
    },
    decode(o) {
      let s = [];
      for (let l = 0; l < o.length; l += 11) {
        const u = o.slice(l, l + 11), f = Fi.indexOf(u.length), g = Ls.decode(u);
        for (let E = 0; E < g.length - f; E++)
          if (g[E] !== 0) throw new Error("base58xmr: wrong padding");
        s = s.concat(Array.from(g.slice(g.length - f)));
      }
      return Uint8Array.from(s);
    }
  }, Zi = (o) => kn(ci(4, (s) => o(o(s))), Ls), hi = kn(An("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), zn("")), Vi = [
    996825010,
    642813549,
    513874426,
    1027748829,
    705979059
  ];
  function vs(o) {
    const s = o >> 25;
    let l = (o & 33554431) << 5;
    for (let u = 0; u < Vi.length; u++) (s >> u & 1) === 1 && (l ^= Vi[u]);
    return l;
  }
  function Me(o, s, l = 1) {
    const u = o.length;
    let f = 1;
    for (let g = 0; g < u; g++) {
      const E = o.charCodeAt(g);
      if (E < 33 || E > 126) throw new Error(`Invalid prefix (${o})`);
      f = vs(f) ^ E >> 5;
    }
    f = vs(f);
    for (let g = 0; g < u; g++) f = vs(f) ^ o.charCodeAt(g) & 31;
    for (let g of s) f = vs(f) ^ g;
    for (let g = 0; g < 6; g++) f = vs(f);
    return f ^= l, hi.encode(ps([
      f % 2 ** 30
    ], 30, 5, !1));
  }
  function He(o) {
    const s = o === "bech32" ? 1 : 734539939, l = Hn(5), u = l.decode, f = l.encode, g = qi(u);
    function E(j, W, _ = 90) {
      if (typeof j != "string") throw new Error(`bech32.encode prefix should be string, not ${typeof j}`);
      if (!Array.isArray(W) || W.length && typeof W[0] != "number") throw new Error(`bech32.encode words should be array of numbers, not ${typeof W}`);
      const C = j.length + 7 + W.length;
      if (_ !== !1 && C > _) throw new TypeError(`Length ${C} exceeds limit ${_}`);
      return j = j.toLowerCase(), `${j}1${hi.encode(W)}${Me(j, W, s)}`;
    }
    function w(j, W = 90) {
      if (typeof j != "string") throw new Error(`bech32.decode input should be string, not ${typeof j}`);
      if (j.length < 8 || W !== !1 && j.length > W) throw new TypeError(`Wrong string length: ${j.length} (${j}). Expected (8..${W})`);
      const _ = j.toLowerCase();
      if (j !== _ && j !== j.toUpperCase()) throw new Error("String must be lowercase or uppercase");
      j = _;
      const C = j.lastIndexOf("1");
      if (C === 0 || C === -1) throw new Error('Letter "1" must be present between prefix and data only');
      const M = j.slice(0, C), G = j.slice(C + 1);
      if (G.length < 6) throw new Error("Data must be at least 6 characters long");
      const ne = hi.decode(G).slice(0, -6), ie = Me(M, ne, s);
      if (!G.endsWith(ie)) throw new Error(`Invalid checksum in ${j}: expected "${ie}"`);
      return {
        prefix: M,
        words: ne
      };
    }
    const q = qi(w);
    function Q(j) {
      const { prefix: W, words: _ } = w(j, !1);
      return {
        prefix: W,
        words: _,
        bytes: u(_)
      };
    }
    return {
      encode: E,
      decode: w,
      decodeToBytes: Q,
      decodeUnsafe: q,
      fromWords: u,
      fromWordsUnsafe: g,
      toWords: f
    };
  }
  const Ae = He("bech32");
  He("bech32m");
  const st = {
    encode: (o) => new TextDecoder().decode(o),
    decode: (o) => new TextEncoder().encode(o)
  }, We = kn(Hn(4), An("0123456789abcdef"), zn(""), zi((o) => {
    if (typeof o != "string" || o.length % 2) throw new TypeError(`hex.decode: expected string, got ${typeof o} with length ${o.length}`);
    return o.toLowerCase();
  }));
  `${Object.keys({
    utf8: st,
    hex: We,
    base16: di,
    base32: ui,
    base64: kr,
    base64url: ji,
    base58: Ls,
    base58xmr: Ar
  }).join(", ")}`;
  var ht = {};
  Object.defineProperty(ht, "__esModule", {
    value: !0
  }), ht.wordlist = void 0, ht.wordlist = `abandon
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
  var Je = {};
  Object.defineProperty(Je, "__esModule", {
    value: !0
  }), Je.mnemonicToSeedSync = Je.mnemonicToSeed = Je.validateMnemonic = Je.entropyToMnemonic = Je.mnemonicToEntropy = Je.generateMnemonic = void 0;
  var At = {};
  Object.defineProperty(At, "__esModule", {
    value: !0
  }), At.pbkdf2Async = At.pbkdf2 = void 0;
  var pt = {};
  Object.defineProperty(pt, "__esModule", {
    value: !0
  }), pt.hmac = void 0;
  class Vt extends ue.Hash {
    constructor(s, l) {
      super(), this.finished = !1, this.destroyed = !1, rt.default.hash(s);
      const u = (0, ue.toBytes)(l);
      if (this.iHash = s.create(), typeof this.iHash.update != "function") throw new TypeError("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const f = this.blockLen, g = new Uint8Array(f);
      g.set(u.length > f ? s.create().update(u).digest() : u);
      for (let E = 0; E < g.length; E++) g[E] ^= 54;
      this.iHash.update(g), this.oHash = s.create();
      for (let E = 0; E < g.length; E++) g[E] ^= 106;
      this.oHash.update(g), g.fill(0);
    }
    update(s) {
      return rt.default.exists(this), this.iHash.update(s), this;
    }
    digestInto(s) {
      rt.default.exists(this), rt.default.bytes(s, this.outputLen), this.finished = !0, this.iHash.digestInto(s), this.oHash.update(s), this.oHash.digestInto(s), this.destroy();
    }
    digest() {
      const s = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(s), s;
    }
    _cloneInto(s) {
      s || (s = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: l, iHash: u, finished: f, destroyed: g, blockLen: E, outputLen: w } = this;
      return s.finished = f, s.destroyed = g, s.blockLen = E, s.outputLen = w, s.oHash = l._cloneInto(s.oHash), s.iHash = u._cloneInto(s.iHash), s;
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  const Yt = (o, s, l) => new Vt(o, s).update(l).digest();
  pt.hmac = Yt, pt.hmac.create = (o, s) => new Vt(o, s);
  function ln(o, s, l, u) {
    rt.default.hash(o);
    const f = (0, ue.checkOpts)({
      dkLen: 32,
      asyncTick: 10
    }, u), { c: g, dkLen: E, asyncTick: w } = f;
    if (rt.default.number(g), rt.default.number(E), rt.default.number(w), g < 1) throw new Error("PBKDF2: iterations (c) should be >= 1");
    const q = (0, ue.toBytes)(s), Q = (0, ue.toBytes)(l), j = new Uint8Array(E), W = pt.hmac.create(o, q), _ = W._cloneInto().update(Q);
    return {
      c: g,
      dkLen: E,
      asyncTick: w,
      DK: j,
      PRF: W,
      PRFSalt: _
    };
  }
  function bs(o, s, l, u, f) {
    return o.destroy(), s.destroy(), u && u.destroy(), f.fill(0), l;
  }
  function cr(o, s, l, u) {
    const { c: f, dkLen: g, DK: E, PRF: w, PRFSalt: q } = ln(o, s, l, u);
    let Q;
    const j = new Uint8Array(4), W = (0, ue.createView)(j), _ = new Uint8Array(w.outputLen);
    for (let C = 1, M = 0; M < g; C++, M += w.outputLen) {
      const G = E.subarray(M, M + w.outputLen);
      W.setInt32(0, C, !1), (Q = q._cloneInto(Q)).update(j).digestInto(_), G.set(_.subarray(0, G.length));
      for (let ne = 1; ne < f; ne++) {
        w._cloneInto(Q).update(_).digestInto(_);
        for (let ie = 0; ie < G.length; ie++) G[ie] ^= _[ie];
      }
    }
    return bs(w, q, E, Q, _);
  }
  At.pbkdf2 = cr;
  async function dr(o, s, l, u) {
    const { c: f, dkLen: g, asyncTick: E, DK: w, PRF: q, PRFSalt: Q } = ln(o, s, l, u);
    let j;
    const W = new Uint8Array(4), _ = (0, ue.createView)(W), C = new Uint8Array(q.outputLen);
    for (let M = 1, G = 0; G < g; M++, G += q.outputLen) {
      const ne = w.subarray(G, G + q.outputLen);
      _.setInt32(0, M, !1), (j = Q._cloneInto(j)).update(W).digestInto(C), ne.set(C.subarray(0, ne.length)), await (0, ue.asyncLoop)(f - 1, E, (ie) => {
        q._cloneInto(j).update(C).digestInto(C);
        for (let me = 0; me < ne.length; me++) ne[me] ^= C[me];
      });
    }
    return bs(q, Q, w, j, C);
  }
  At.pbkdf2Async = dr;
  var Ht = {};
  Object.defineProperty(Ht, "__esModule", {
    value: !0
  }), Ht.sha384 = Ht.sha512_256 = Ht.sha512_224 = Ht.sha512 = Ht.SHA512 = void 0;
  var ze = {};
  Object.defineProperty(ze, "__esModule", {
    value: !0
  }), ze.add = ze.toBig = ze.split = ze.fromBig = void 0;
  const Hr = BigInt(2 ** 32 - 1), Ds = BigInt(32);
  function fi(o, s = !1) {
    return s ? {
      h: Number(o & Hr),
      l: Number(o >> Ds & Hr)
    } : {
      h: Number(o >> Ds & Hr) | 0,
      l: Number(o & Hr) | 0
    };
  }
  ze.fromBig = fi;
  function pi(o, s = !1) {
    let l = new Uint32Array(o.length), u = new Uint32Array(o.length);
    for (let f = 0; f < o.length; f++) {
      const { h: g, l: E } = fi(o[f], s);
      [l[f], u[f]] = [
        g,
        E
      ];
    }
    return [
      l,
      u
    ];
  }
  ze.split = pi;
  const ms = (o, s) => BigInt(o >>> 0) << Ds | BigInt(s >>> 0);
  ze.toBig = ms;
  const qr = (o, s, l) => o >>> l, Gi = (o, s, l) => o << 32 - l | s >>> l, Go = (o, s, l) => o >>> l | s << 32 - l, Wo = (o, s, l) => o << 32 - l | s >>> l, Gt = (o, s, l) => o << 64 - l | s >>> l - 32, Vn = (o, s, l) => o >>> l - 32 | s << 64 - l, ur = (o, s) => s, gi = (o, s) => o, Ko = (o, s, l) => o << l | s >>> 32 - l, Qo = (o, s, l) => s << l | o >>> 32 - l, Yo = (o, s, l) => s << l - 32 | o >>> 64 - l, Xo = (o, s, l) => o << l - 32 | s >>> 64 - l;
  function Wi(o, s, l, u) {
    const f = (s >>> 0) + (u >>> 0);
    return {
      h: o + l + (f / 2 ** 32 | 0) | 0,
      l: f | 0
    };
  }
  ze.add = Wi;
  const Jo = (o, s, l) => (o >>> 0) + (s >>> 0) + (l >>> 0), ea = (o, s, l, u) => s + l + u + (o / 2 ** 32 | 0) | 0, Mh = (o, s, l, u) => (o >>> 0) + (s >>> 0) + (l >>> 0) + (u >>> 0), Bh = (o, s, l, u, f) => s + l + u + f + (o / 2 ** 32 | 0) | 0, Uh = (o, s, l, u, f) => (o >>> 0) + (s >>> 0) + (l >>> 0) + (u >>> 0) + (f >>> 0), Ph = (o, s, l, u, f, g) => s + l + u + f + g + (o / 2 ** 32 | 0) | 0, zh = {
    fromBig: fi,
    split: pi,
    toBig: ze.toBig,
    shrSH: qr,
    shrSL: Gi,
    rotrSH: Go,
    rotrSL: Wo,
    rotrBH: Gt,
    rotrBL: Vn,
    rotr32H: ur,
    rotr32L: gi,
    rotlSH: Ko,
    rotlSL: Qo,
    rotlBH: Yo,
    rotlBL: Xo,
    add: Wi,
    add3L: Jo,
    add3H: ea,
    add4L: Mh,
    add4H: Bh,
    add5H: Ph,
    add5L: Uh
  };
  ze.default = zh;
  const [Hh, qh] = ze.default.split([
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
  ].map((o) => BigInt(o))), jr = new Uint32Array(80), Fr = new Uint32Array(80);
  class vi extends Pn.SHA2 {
    constructor() {
      super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
    }
    // prettier-ignore
    get() {
      const { Ah: s, Al: l, Bh: u, Bl: f, Ch: g, Cl: E, Dh: w, Dl: q, Eh: Q, El: j, Fh: W, Fl: _, Gh: C, Gl: M, Hh: G, Hl: ne } = this;
      return [
        s,
        l,
        u,
        f,
        g,
        E,
        w,
        q,
        Q,
        j,
        W,
        _,
        C,
        M,
        G,
        ne
      ];
    }
    // prettier-ignore
    set(s, l, u, f, g, E, w, q, Q, j, W, _, C, M, G, ne) {
      this.Ah = s | 0, this.Al = l | 0, this.Bh = u | 0, this.Bl = f | 0, this.Ch = g | 0, this.Cl = E | 0, this.Dh = w | 0, this.Dl = q | 0, this.Eh = Q | 0, this.El = j | 0, this.Fh = W | 0, this.Fl = _ | 0, this.Gh = C | 0, this.Gl = M | 0, this.Hh = G | 0, this.Hl = ne | 0;
    }
    process(s, l) {
      for (let he = 0; he < 16; he++, l += 4)
        jr[he] = s.getUint32(l), Fr[he] = s.getUint32(l += 4);
      for (let he = 16; he < 80; he++) {
        const Ce = jr[he - 15] | 0, _e = Fr[he - 15] | 0, xe = ze.default.rotrSH(Ce, _e, 1) ^ ze.default.rotrSH(Ce, _e, 8) ^ ze.default.shrSH(Ce, _e, 7), Te = ze.default.rotrSL(Ce, _e, 1) ^ ze.default.rotrSL(Ce, _e, 8) ^ ze.default.shrSL(Ce, _e, 7), Be = jr[he - 2] | 0, vt = Fr[he - 2] | 0, D = ze.default.rotrSH(Be, vt, 19) ^ ze.default.rotrBH(Be, vt, 61) ^ ze.default.shrSH(Be, vt, 6), N = ze.default.rotrSL(Be, vt, 19) ^ ze.default.rotrBL(Be, vt, 61) ^ ze.default.shrSL(Be, vt, 6), I = ze.default.add4L(Te, N, Fr[he - 7], Fr[he - 16]), Z = ze.default.add4H(I, xe, D, jr[he - 7], jr[he - 16]);
        jr[he] = Z | 0, Fr[he] = I | 0;
      }
      let { Ah: u, Al: f, Bh: g, Bl: E, Ch: w, Cl: q, Dh: Q, Dl: j, Eh: W, El: _, Fh: C, Fl: M, Gh: G, Gl: ne, Hh: ie, Hl: me } = this;
      for (let he = 0; he < 80; he++) {
        const Ce = ze.default.rotrSH(W, _, 14) ^ ze.default.rotrSH(W, _, 18) ^ ze.default.rotrBH(W, _, 41), _e = ze.default.rotrSL(W, _, 14) ^ ze.default.rotrSL(W, _, 18) ^ ze.default.rotrBL(W, _, 41), xe = W & C ^ ~W & G, Te = _ & M ^ ~_ & ne, Be = ze.default.add5L(me, _e, Te, qh[he], Fr[he]), vt = ze.default.add5H(Be, ie, Ce, xe, Hh[he], jr[he]), D = Be | 0, N = ze.default.rotrSH(u, f, 28) ^ ze.default.rotrBH(u, f, 34) ^ ze.default.rotrBH(u, f, 39), I = ze.default.rotrSL(u, f, 28) ^ ze.default.rotrBL(u, f, 34) ^ ze.default.rotrBL(u, f, 39), Z = u & g ^ u & w ^ g & w, J = f & E ^ f & q ^ E & q;
        ie = G | 0, me = ne | 0, G = C | 0, ne = M | 0, C = W | 0, M = _ | 0, { h: W, l: _ } = ze.default.add(Q | 0, j | 0, vt | 0, D | 0), Q = w | 0, j = q | 0, w = g | 0, q = E | 0, g = u | 0, E = f | 0;
        const le = ze.default.add3L(D, I, J);
        u = ze.default.add3H(le, vt, N, Z), f = le | 0;
      }
      ({ h: u, l: f } = ze.default.add(this.Ah | 0, this.Al | 0, u | 0, f | 0)), { h: g, l: E } = ze.default.add(this.Bh | 0, this.Bl | 0, g | 0, E | 0), { h: w, l: q } = ze.default.add(this.Ch | 0, this.Cl | 0, w | 0, q | 0), { h: Q, l: j } = ze.default.add(this.Dh | 0, this.Dl | 0, Q | 0, j | 0), { h: W, l: _ } = ze.default.add(this.Eh | 0, this.El | 0, W | 0, _ | 0), { h: C, l: M } = ze.default.add(this.Fh | 0, this.Fl | 0, C | 0, M | 0), { h: G, l: ne } = ze.default.add(this.Gh | 0, this.Gl | 0, G | 0, ne | 0), { h: ie, l: me } = ze.default.add(this.Hh | 0, this.Hl | 0, ie | 0, me | 0), this.set(u, f, g, E, w, q, Q, j, W, _, C, M, G, ne, ie, me);
    }
    roundClean() {
      jr.fill(0), Fr.fill(0);
    }
    destroy() {
      this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  }
  Ht.SHA512 = vi;
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
  Ht.sha512 = (0, ue.wrapConstructor)(() => new vi()), Ht.sha512_224 = (0, ue.wrapConstructor)(() => new jh()), Ht.sha512_256 = (0, ue.wrapConstructor)(() => new Fh()), Ht.sha384 = (0, ue.wrapConstructor)(() => new Zh());
  const Vh = (o) => o[0] === "あいこくしん";
  function Vl(o) {
    if (typeof o != "string") throw new TypeError(`Invalid mnemonic type: ${typeof o}`);
    return o.normalize("NFKD");
  }
  function ta(o) {
    const s = Vl(o), l = s.split(" ");
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
  function Gl(o) {
    rt.default.bytes(o, 16, 20, 24, 28, 32);
  }
  function Gh(o, s = 128) {
    if (rt.default.number(s), s % 32 !== 0 || s > 256) throw new TypeError("Invalid entropy");
    return Ql((0, ue.randomBytes)(s / 8), o);
  }
  Je.generateMnemonic = Gh;
  const Wh = (o) => {
    const s = 8 - o.length / 4;
    return new Uint8Array([
      (0, Mt.sha256)(o)[0] >> s << s
    ]);
  };
  function Wl(o) {
    if (!Array.isArray(o) || o.length !== 2048 || typeof o[0] != "string") throw new Error("Worlist: expected array of 2048 strings");
    return o.forEach((s) => {
      if (typeof s != "string") throw new Error(`Wordlist: non-string element: ${s}`);
    }), Ts.chain(Ts.checksum(1, Wh), Ts.radix2(11, !0), Ts.alphabet(o));
  }
  function Kl(o, s) {
    const { words: l } = ta(o), u = Wl(s).decode(l);
    return Gl(u), u;
  }
  Je.mnemonicToEntropy = Kl;
  function Ql(o, s) {
    return Gl(o), Wl(s).encode(o).join(Vh(s) ? "　" : " ");
  }
  Je.entropyToMnemonic = Ql;
  function Kh(o, s) {
    try {
      Kl(o, s);
    } catch {
      return !1;
    }
    return !0;
  }
  Je.validateMnemonic = Kh;
  const Yl = (o) => Vl(`mnemonic${o}`);
  function Qh(o, s = "") {
    return (0, At.pbkdf2Async)(Ht.sha512, ta(o).nfkd, Yl(s), {
      c: 2048,
      dkLen: 64
    });
  }
  Je.mnemonicToSeed = Qh;
  function Yh(o, s = "") {
    return (0, At.pbkdf2)(Ht.sha512, ta(o).nfkd, Yl(s), {
      c: 2048,
      dkLen: 64
    });
  }
  Je.mnemonicToSeedSync = Yh;
  var Os = {};
  Object.defineProperty(Os, "__esModule", {
    value: !0
  }), Os.ripemd160 = Os.RIPEMD160 = void 0;
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
  ]), Xl = Uint8Array.from({
    length: 16
  }, (o, s) => s), Jh = Xl.map((o) => (9 * o + 5) % 16);
  let na = [
    Xl
  ], ra = [
    Jh
  ];
  for (let o = 0; o < 4; o++) for (let s of [
    na,
    ra
  ]) s.push(s[o].map((l) => Xh[l]));
  const Jl = [
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
  ].map((o) => new Uint8Array(o)), ef = na.map((o, s) => o.map((l) => Jl[s][l])), tf = ra.map((o, s) => o.map((l) => Jl[s][l])), nf = new Uint32Array([
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
  ]), Ki = (o, s) => o << s | o >>> 32 - s;
  function ec(o, s, l, u) {
    return o === 0 ? s ^ l ^ u : o === 1 ? s & l | ~s & u : o === 2 ? (s | ~l) ^ u : o === 3 ? s & u | l & ~u : s ^ (l | ~u);
  }
  const Qi = new Uint32Array(16);
  class tc extends Pn.SHA2 {
    constructor() {
      super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
    }
    get() {
      const { h0: s, h1: l, h2: u, h3: f, h4: g } = this;
      return [
        s,
        l,
        u,
        f,
        g
      ];
    }
    set(s, l, u, f, g) {
      this.h0 = s | 0, this.h1 = l | 0, this.h2 = u | 0, this.h3 = f | 0, this.h4 = g | 0;
    }
    process(s, l) {
      for (let C = 0; C < 16; C++, l += 4) Qi[C] = s.getUint32(l, !0);
      let u = this.h0 | 0, f = u, g = this.h1 | 0, E = g, w = this.h2 | 0, q = w, Q = this.h3 | 0, j = Q, W = this.h4 | 0, _ = W;
      for (let C = 0; C < 5; C++) {
        const M = 4 - C, G = nf[C], ne = rf[C], ie = na[C], me = ra[C], he = ef[C], Ce = tf[C];
        for (let _e = 0; _e < 16; _e++) {
          const xe = Ki(u + ec(C, g, w, Q) + Qi[ie[_e]] + G, he[_e]) + W | 0;
          u = W, W = Q, Q = Ki(w, 10) | 0, w = g, g = xe;
        }
        for (let _e = 0; _e < 16; _e++) {
          const xe = Ki(f + ec(M, E, q, j) + Qi[me[_e]] + ne, Ce[_e]) + _ | 0;
          f = _, _ = j, j = Ki(q, 10) | 0, q = E, E = xe;
        }
      }
      this.set(this.h1 + w + j | 0, this.h2 + Q + _ | 0, this.h3 + W + f | 0, this.h4 + u + E | 0, this.h0 + g + q | 0);
    }
    roundClean() {
      Qi.fill(0);
    }
    destroy() {
      this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
    }
  }
  Os.RIPEMD160 = tc, Os.ripemd160 = (0, ue.wrapConstructor)(() => new tc()), Ke.hmacSha256Sync = (o, ...s) => (0, pt.hmac)(Mt.sha256, o, Ke.concatBytes(...s));
  const sa = Zi(Mt.sha256);
  function nc(o) {
    return BigInt(`0x${(0, ue.bytesToHex)(o)}`);
  }
  function sf(o) {
    return (0, ue.hexToBytes)(o.toString(16).padStart(64, "0"));
  }
  const of = (0, ue.utf8ToBytes)("Bitcoin seed"), ia = {
    private: 76066276,
    public: 76067358
  }, oa = 2147483648, af = (o) => (0, Os.ripemd160)((0, Mt.sha256)(o)), lf = (o) => (0, ue.createView)(o).getUint32(0, !1), Yi = (o) => {
    if (!Number.isSafeInteger(o) || o < 0 || o > 2 ** 32 - 1) throw new Error(`Invalid number=${o}. Should be from 0 to 2 ** 32 - 1`);
    const s = new Uint8Array(4);
    return (0, ue.createView)(s).setUint32(0, o, !1), s;
  };
  class ys {
    constructor(s) {
      if (this.depth = 0, this.index = 0, this.chainCode = null, this.parentFingerprint = 0, !s || typeof s != "object") throw new Error("HDKey.constructor must not be called directly");
      if (this.versions = s.versions || ia, this.depth = s.depth || 0, this.chainCode = s.chainCode, this.index = s.index || 0, this.parentFingerprint = s.parentFingerprint || 0, !this.depth && (this.parentFingerprint || this.index))
        throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
      if (s.publicKey && s.privateKey) throw new Error("HDKey: publicKey and privateKey at same time.");
      if (s.privateKey) {
        if (!Ke.isValidPrivateKey(s.privateKey)) throw new Error("Invalid private key");
        this.privKey = typeof s.privateKey == "bigint" ? s.privateKey : nc(s.privateKey), this.privKeyBytes = sf(this.privKey), this.pubKey = ct(s.privateKey, !0);
      } else if (s.publicKey) this.pubKey = x.fromHex(s.publicKey).toRawBytes(!0);
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
      return sa.encode(this.serialize(this.versions.private, (0, ue.concatBytes)(new Uint8Array([
        0
      ]), s)));
    }
    get publicExtendedKey() {
      if (!this.pubKey) throw new Error("No public key");
      return sa.encode(this.serialize(this.versions.public, this.pubKey));
    }
    static fromMasterSeed(s, l = ia) {
      if ((0, rt.bytes)(s), 8 * s.length < 128 || 8 * s.length > 512) throw new Error(`HDKey: wrong seed length=${s.length}. Should be between 128 and 512 bits; 256 bits is advised)`);
      const u = (0, pt.hmac)(Ht.sha512, of, s);
      return new ys({
        versions: l,
        chainCode: u.slice(32),
        privateKey: u.slice(0, 32)
      });
    }
    static fromExtendedKey(s, l = ia) {
      const u = sa.decode(s), f = (0, ue.createView)(u), g = f.getUint32(0, !1), E = {
        versions: l,
        depth: u[4],
        parentFingerprint: f.getUint32(5, !1),
        index: f.getUint32(9, !1),
        chainCode: u.slice(13, 45)
      }, w = u.slice(45), q = w[0] === 0;
      if (g !== l[q ? "private" : "public"]) throw new Error("Version mismatch");
      return q ? new ys({
        ...E,
        privateKey: w.slice(1)
      }) : new ys({
        ...E,
        publicKey: w
      });
    }
    static fromJSON(s) {
      return ys.fromExtendedKey(s.xpriv);
    }
    derive(s) {
      if (!/^[mM]'?/.test(s)) throw new Error('Path must start with "m" or "M"');
      if (/^[mM]'?$/.test(s)) return this;
      const l = s.replace(/^[mM]'?\//, "").split("/");
      let u = this;
      for (const f of l) {
        const g = /^(\d+)('?)$/.exec(f);
        if (!g || g.length !== 3) throw new Error(`Invalid child index: ${f}`);
        let E = +g[1];
        if (!Number.isSafeInteger(E) || E >= oa) throw new Error("Invalid index");
        g[2] === "'" && (E += oa), u = u.deriveChild(E);
      }
      return u;
    }
    deriveChild(s) {
      if (!this.pubKey || !this.chainCode) throw new Error("No publicKey or chainCode set");
      let l = Yi(s);
      if (s >= oa) {
        const w = this.privateKey;
        if (!w) throw new Error("Could not derive hardened child key");
        l = (0, ue.concatBytes)(new Uint8Array([
          0
        ]), w, l);
      } else l = (0, ue.concatBytes)(this.pubKey, l);
      const u = (0, pt.hmac)(Ht.sha512, this.chainCode, l), f = nc(u.slice(0, 32)), g = u.slice(32);
      if (!Ke.isValidPrivateKey(f)) throw new Error("Tweak bigger than curve order");
      const E = {
        versions: this.versions,
        chainCode: g,
        depth: this.depth + 1,
        parentFingerprint: this.fingerprint,
        index: s
      };
      try {
        if (this.privateKey) {
          const w = Ke.mod(this.privKey + f, v.n);
          if (!Ke.isValidPrivateKey(w)) throw new Error("The tweak was out of range or the resulted private key is invalid");
          E.privateKey = w;
        } else {
          const w = x.fromHex(this.pubKey).add(x.fromPrivateKey(f));
          if (w.equals(x.ZERO)) throw new Error("The tweak was equal to negative P, which made the result key invalid");
          E.publicKey = w.toRawBytes(!0);
        }
        return new ys(E);
      } catch {
        return this.deriveChild(s + 1);
      }
    }
    sign(s) {
      if (!this.privateKey) throw new Error("No privateKey set!");
      return (0, rt.bytes)(s, 32), Dt(s, this.privKey, {
        canonical: !0,
        der: !1
      });
    }
    verify(s, l) {
      if ((0, rt.bytes)(s, 32), (0, rt.bytes)(l, 64), !this.publicKey) throw new Error("No publicKey set!");
      let u;
      try {
        u = K.fromCompact(l);
      } catch {
        return !1;
      }
      return Ot(u, s, this.publicKey);
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
      return (0, rt.bytes)(l, 33), (0, ue.concatBytes)(Yi(s), new Uint8Array([
        this.depth
      ]), Yi(this.parentFingerprint), Yi(this.index), this.chainCode, l);
    }
  }
  var cf = Object.defineProperty, Sn = (o, s) => {
    for (var l in s) cf(o, l, {
      get: s[l],
      enumerable: !0
    });
  };
  function df() {
    return Ke.bytesToHex(Ke.randomPrivateKey());
  }
  function rc(o) {
    return Ke.bytesToHex(Un.getPublicKey(o));
  }
  var uf = {};
  Sn(uf, {
    insertEventIntoAscendingList: () => ff,
    insertEventIntoDescendingList: () => hf,
    normalizeURL: () => aa,
    utf8Decoder: () => Zr,
    utf8Encoder: () => hr
  });
  var Zr = new TextDecoder("utf-8"), hr = new TextEncoder();
  function aa(o) {
    let s = new URL(o);
    return s.pathname = s.pathname.replace(/\/+/g, "/"), s.pathname.endsWith("/") && (s.pathname = s.pathname.slice(0, -1)), (s.port === "80" && s.protocol === "ws:" || s.port === "443" && s.protocol === "wss:") && (s.port = ""), s.searchParams.sort(), s.hash = "", s.toString();
  }
  function hf(o, s) {
    let l = 0, u = o.length - 1, f, g = l;
    if (u < 0) g = 0;
    else if (s.created_at < o[u].created_at) g = u + 1;
    else if (s.created_at >= o[l].created_at) g = l;
    else for (; ; ) {
      if (u <= l + 1) {
        g = u;
        break;
      }
      if (f = Math.floor(l + (u - l) / 2), o[f].created_at > s.created_at) l = f;
      else if (o[f].created_at < s.created_at) u = f;
      else {
        g = f;
        break;
      }
    }
    return o[g]?.id !== s.id ? [
      ...o.slice(0, g),
      s,
      ...o.slice(g)
    ] : o;
  }
  function ff(o, s) {
    let l = 0, u = o.length - 1, f, g = l;
    if (u < 0) g = 0;
    else if (s.created_at > o[u].created_at) g = u + 1;
    else if (s.created_at <= o[l].created_at) g = l;
    else for (; ; ) {
      if (u <= l + 1) {
        g = u;
        break;
      }
      if (f = Math.floor(l + (u - l) / 2), o[f].created_at < s.created_at) l = f;
      else if (o[f].created_at > s.created_at) u = f;
      else {
        g = f;
        break;
      }
    }
    return o[g]?.id !== s.id ? [
      ...o.slice(0, g),
      s,
      ...o.slice(g)
    ] : o;
  }
  function pf(o, s) {
    let l = o;
    return l.pubkey = rc(s), l.id = la(l), l.sig = bf(l, s), l;
  }
  function gf(o) {
    if (!ca(o)) throw new Error("can't serialize event with wrong or missing properties");
    return JSON.stringify([
      0,
      o.pubkey,
      o.created_at,
      o.kind,
      o.tags,
      o.content
    ]);
  }
  function la(o) {
    let s = (0, Mt.sha256)(hr.encode(gf(o)));
    return Ke.bytesToHex(s);
  }
  var vf = (o) => o instanceof Object;
  function ca(o) {
    if (!vf(o) || typeof o.kind != "number" || typeof o.content != "string" || typeof o.created_at != "number" || typeof o.pubkey != "string" || !o.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(o.tags)) return !1;
    for (let s = 0; s < o.tags.length; s++) {
      let l = o.tags[s];
      if (!Array.isArray(l)) return !1;
      for (let u = 0; u < l.length; u++)
        if (typeof l[u] == "object") return !1;
    }
    return !0;
  }
  function sc(o) {
    return Un.verifySync(o.sig, la(o), o.pubkey);
  }
  function bf(o, s) {
    return Ke.bytesToHex(Un.signSync(la(o), s));
  }
  function mf(o, s) {
    if (o.ids && o.ids.indexOf(s.id) === -1 && !o.ids.some((l) => s.id.startsWith(l)) || o.kinds && o.kinds.indexOf(s.kind) === -1 || o.authors && o.authors.indexOf(s.pubkey) === -1 && !o.authors.some((l) => s.pubkey.startsWith(l)))
      return !1;
    for (let l in o) if (l[0] === "#") {
      let u = l.slice(1), f = o[`#${u}`];
      if (f && !s.tags.find(([g, E]) => g === l.slice(1) && f.indexOf(E) !== -1)) return !1;
    }
    return !(o.since && s.created_at < o.since || o.until && s.created_at >= o.until);
  }
  function yf(o, s) {
    for (let l = 0; l < o.length; l++)
      if (mf(o[l], s)) return !0;
    return !1;
  }
  var wf = {};
  Sn(wf, {
    getHex64: () => Xi,
    getInt: () => ic,
    getSubscriptionId: () => oc,
    matchEventId: () => xf,
    matchEventKind: () => Ef,
    matchEventPubkey: () => _f
  });
  function Xi(o, s) {
    let l = s.length + 3, u = o.indexOf(`"${s}":`) + l, f = o.slice(u).indexOf('"') + u + 1;
    return o.slice(f, f + 64);
  }
  function ic(o, s) {
    let l = s.length, u = o.indexOf(`"${s}":`) + l + 3, f = o.slice(u), g = Math.min(f.indexOf(","), f.indexOf("}"));
    return parseInt(f.slice(0, g), 10);
  }
  function oc(o) {
    let s = o.slice(0, 22).indexOf('"EVENT"');
    if (s === -1) return null;
    let l = o.slice(s + 7 + 1).indexOf('"');
    if (l === -1) return null;
    let u = s + 7 + 1 + l, f = o.slice(u + 1, 80).indexOf('"');
    if (f === -1) return null;
    let g = u + 1 + f;
    return o.slice(u + 1, g);
  }
  function xf(o, s) {
    return s === Xi(o, "id");
  }
  function _f(o, s) {
    return s === Xi(o, "pubkey");
  }
  function Ef(o, s) {
    return s === ic(o, "kind");
  }
  var ac = () => ({
    connect: [],
    disconnect: [],
    error: [],
    notice: [],
    auth: []
  });
  function $f(o, s = {}) {
    let { listTimeout: l = 3e3, getTimeout: u = 3e3, countTimeout: f = 3e3 } = s;
    var g, E = {}, w = ac(), q = {}, Q = {}, j;
    async function W() {
      return j || (j = new Promise((ie, me) => {
        try {
          g = new WebSocket(o);
        } catch (xe) {
          me(xe);
        }
        g.onopen = () => {
          w.connect.forEach((xe) => xe()), ie();
        }, g.onerror = () => {
          j = void 0, w.error.forEach((xe) => xe()), me();
        }, g.onclose = async () => {
          j = void 0, w.disconnect.forEach((xe) => xe());
        };
        let he = [], Ce;
        g.onmessage = (xe) => {
          he.push(xe.data), Ce || (Ce = setInterval(_e, 0));
        };
        function _e() {
          if (he.length === 0) {
            clearInterval(Ce), Ce = null;
            return;
          }
          var xe = he.shift();
          if (!xe) return;
          let Te = oc(xe);
          if (Te) {
            let Be = E[Te];
            if (Be && Be.alreadyHaveEvent && Be.alreadyHaveEvent(Xi(xe, "id"), o)) return;
          }
          try {
            let Be = JSON.parse(xe);
            switch (Be[0]) {
              case "EVENT": {
                let I = Be[1], Z = Be[2];
                ca(Z) && E[I] && (E[I].skipVerification || sc(Z)) && yf(E[I].filters, Z) && (E[I], (q[I]?.event || []).forEach((J) => J(Z)));
                return;
              }
              case "COUNT":
                let vt = Be[1], D = Be[2];
                E[vt] && (q[vt]?.count || []).forEach((I) => I(D));
                return;
              case "EOSE": {
                let I = Be[1];
                I in q && (q[I].eose.forEach((Z) => Z()), q[I].eose = []);
                return;
              }
              case "OK": {
                let I = Be[1], Z = Be[2], J = Be[3] || "";
                I in Q && (Z ? Q[I].ok.forEach((le) => le()) : Q[I].failed.forEach((le) => le(J)), Q[I].ok = [], Q[I].failed = []);
                return;
              }
              case "NOTICE":
                let N = Be[1];
                w.notice.forEach((I) => I(N));
                return;
              case "AUTH": {
                let I = Be[1];
                w.auth?.forEach((Z) => Z(I));
                return;
              }
            }
          } catch {
            return;
          }
        }
      }), j);
    }
    function _() {
      return g?.readyState === 1;
    }
    async function C() {
      _() || await W();
    }
    async function M(ie) {
      let me = JSON.stringify(ie);
      if (!(!_() && (await new Promise((he) => setTimeout(he, 1e3)), !_())))
        try {
          g.send(me);
        } catch (he) {
          console.log(he);
        }
    }
    const G = (ie, { verb: me = "REQ", skipVerification: he = !1, alreadyHaveEvent: Ce = null, id: _e = Math.random().toString().slice(2) } = {}) => {
      let xe = _e;
      return E[xe] = {
        id: xe,
        filters: ie,
        skipVerification: he,
        alreadyHaveEvent: Ce
      }, M([
        me,
        xe,
        ...ie
      ]), {
        sub: (Te, Be = {}) => G(Te || ie, {
          skipVerification: Be.skipVerification || he,
          alreadyHaveEvent: Be.alreadyHaveEvent || Ce,
          id: xe
        }),
        unsub: () => {
          delete E[xe], delete q[xe], M([
            "CLOSE",
            xe
          ]);
        },
        on: (Te, Be) => {
          q[xe] = q[xe] || {
            event: [],
            count: [],
            eose: []
          }, q[xe][Te].push(Be);
        },
        off: (Te, Be) => {
          let vt = q[xe], D = vt[Te].indexOf(Be);
          D >= 0 && vt[Te].splice(D, 1);
        }
      };
    };
    function ne(ie, me) {
      if (!ie.id) throw new Error(`event ${ie} has no id`);
      let he = ie.id;
      return M([
        me,
        ie
      ]), {
        on: (Ce, _e) => {
          Q[he] = Q[he] || {
            ok: [],
            failed: []
          }, Q[he][Ce].push(_e);
        },
        off: (Ce, _e) => {
          let xe = Q[he];
          if (!xe) return;
          let Te = xe[Ce].indexOf(_e);
          Te >= 0 && xe[Ce].splice(Te, 1);
        }
      };
    }
    return {
      url: o,
      sub: G,
      on: (ie, me) => {
        w[ie].push(me), ie === "connect" && g?.readyState === 1 && me();
      },
      off: (ie, me) => {
        let he = w[ie].indexOf(me);
        he !== -1 && w[ie].splice(he, 1);
      },
      list: (ie, me) => new Promise((he) => {
        let Ce = G(ie, me), _e = [], xe = setTimeout(() => {
          Ce.unsub(), he(_e);
        }, l);
        Ce.on("eose", () => {
          Ce.unsub(), clearTimeout(xe), he(_e);
        }), Ce.on("event", (Te) => {
          _e.push(Te);
        });
      }),
      get: (ie, me) => new Promise((he) => {
        let Ce = G([
          ie
        ], me), _e = setTimeout(() => {
          Ce.unsub(), he(null);
        }, u);
        Ce.on("event", (xe) => {
          Ce.unsub(), clearTimeout(_e), he(xe);
        });
      }),
      count: (ie) => new Promise((me) => {
        let he = G(ie, {
          ...G,
          verb: "COUNT"
        }), Ce = setTimeout(() => {
          he.unsub(), me(null);
        }, f);
        he.on("count", (_e) => {
          he.unsub(), clearTimeout(Ce), me(_e);
        });
      }),
      publish(ie) {
        return ne(ie, "EVENT");
      },
      auth(ie) {
        return ne(ie, "AUTH");
      },
      connect: C,
      close() {
        w = ac(), q = {}, Q = {}, g.readyState === WebSocket.OPEN && g?.close();
      },
      get status() {
        return g?.readyState ?? 3;
      }
    };
  }
  var lc = class {
    _conn;
    _seenOn = {};
    eoseSubTimeout;
    getTimeout;
    constructor(o = {}) {
      this._conn = {}, this.eoseSubTimeout = o.eoseSubTimeout || 3400, this.getTimeout = o.getTimeout || 3400;
    }
    close(o) {
      o.forEach((s) => {
        let l = this._conn[aa(s)];
        l && l.close();
      });
    }
    async ensureRelay(o) {
      const s = aa(o);
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
      f.alreadyHaveEvent = (_, C) => {
        if (l?.alreadyHaveEvent?.(_, C)) return !0;
        let M = this._seenOn[_] || /* @__PURE__ */ new Set();
        return M.add(C), this._seenOn[_] = M, u.has(_);
      };
      let g = [], E = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Set(), q = o.length, Q = !1, j = setTimeout(() => {
        Q = !0;
        for (let _ of w.values()) _();
      }, this.eoseSubTimeout);
      o.forEach(async (_) => {
        let C;
        try {
          C = await this.ensureRelay(_);
        } catch {
          G();
          return;
        }
        if (!C) return;
        let M = C.sub(s, f);
        M.on("event", (ne) => {
          u.add(ne.id);
          for (let ie of E.values()) ie(ne);
        }), M.on("eose", () => {
          Q || G();
        }), g.push(M);
        function G() {
          if (q--, q === 0) {
            clearTimeout(j);
            for (let ne of w.values()) ne();
          }
        }
      });
      let W = {
        sub(_, C) {
          return g.forEach((M) => M.sub(_, C)), W;
        },
        unsub() {
          g.forEach((_) => _.unsub());
        },
        on(_, C) {
          _ === "event" ? E.add(C) : _ === "eose" && w.add(C);
        },
        off(_, C) {
          _ === "event" ? E.delete(C) : _ === "eose" && w.delete(C);
        }
      };
      return W;
    }
    get(o, s, l) {
      return new Promise((u) => {
        let f = this.sub(o, [
          s
        ], l), g = setTimeout(() => {
          f.unsub(), u(null);
        }, this.getTimeout);
        f.on("event", (E) => {
          u(E), clearTimeout(g), f.unsub();
        });
      });
    }
    list(o, s, l) {
      return new Promise((u) => {
        let f = [], g = this.sub(o, s, l);
        g.on("event", (E) => {
          f.push(E);
        }), g.on("eose", () => {
          g.unsub(), u(f);
        });
      });
    }
    publish(o, s) {
      const l = o.map(async (f) => {
        let g;
        try {
          return g = await this.ensureRelay(f), g.publish(s);
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
        on(f, g) {
          o.forEach(async (E, w) => {
            let q = await l[w], Q = () => g(E);
            u.set(g, Q), q.on(f, Q);
          });
        },
        off(f, g) {
          o.forEach(async (E, w) => {
            let q = u.get(g);
            q && (await l[w]).off(f, q);
          });
        }
      };
    }
    seenOn(o) {
      return Array.from(this._seenOn[o]?.values?.() || []);
    }
  }, da = {};
  Sn(da, {
    decode: () => Ji,
    naddrEncode: () => Tf,
    neventEncode: () => If,
    noteEncode: () => Sf,
    nprofileEncode: () => Cf,
    npubEncode: () => Af,
    nrelayEncode: () => Lf,
    nsecEncode: () => kf
  });
  var Ns = 5e3;
  function Ji(o) {
    let { prefix: s, words: l } = Ae.decode(o, Ns), u = new Uint8Array(Ae.fromWords(l));
    switch (s) {
      case "nprofile": {
        let f = eo(u);
        if (!f[0]?.[0]) throw new Error("missing TLV 0 for nprofile");
        if (f[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
        return {
          type: "nprofile",
          data: {
            pubkey: Ke.bytesToHex(f[0][0]),
            relays: f[1] ? f[1].map((g) => Zr.decode(g)) : []
          }
        };
      }
      case "nevent": {
        let f = eo(u);
        if (!f[0]?.[0]) throw new Error("missing TLV 0 for nevent");
        if (f[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
        if (f[2] && f[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
        return {
          type: "nevent",
          data: {
            id: Ke.bytesToHex(f[0][0]),
            relays: f[1] ? f[1].map((g) => Zr.decode(g)) : [],
            author: f[2]?.[0] ? Ke.bytesToHex(f[2][0]) : void 0
          }
        };
      }
      case "naddr": {
        let f = eo(u);
        if (!f[0]?.[0]) throw new Error("missing TLV 0 for naddr");
        if (!f[2]?.[0]) throw new Error("missing TLV 2 for naddr");
        if (f[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
        if (!f[3]?.[0]) throw new Error("missing TLV 3 for naddr");
        if (f[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
        return {
          type: "naddr",
          data: {
            identifier: Zr.decode(f[0][0]),
            pubkey: Ke.bytesToHex(f[2][0]),
            kind: parseInt(Ke.bytesToHex(f[3][0]), 16),
            relays: f[1] ? f[1].map((g) => Zr.decode(g)) : []
          }
        };
      }
      case "nrelay": {
        let f = eo(u);
        if (!f[0]?.[0]) throw new Error("missing TLV 0 for nrelay");
        return {
          type: "nrelay",
          data: Zr.decode(f[0][0])
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
  function eo(o) {
    let s = {}, l = o;
    for (; l.length > 0; ) {
      let u = l[0], f = l[1], g = l.slice(2, 2 + f);
      l = l.slice(2 + f), !(g.length < f) && (s[u] = s[u] || [], s[u].push(g));
    }
    return s;
  }
  function kf(o) {
    return ua("nsec", o);
  }
  function Af(o) {
    return ua("npub", o);
  }
  function Sf(o) {
    return ua("note", o);
  }
  function ua(o, s) {
    let l = Ke.hexToBytes(s), u = Ae.toWords(l);
    return Ae.encode(o, u, Ns);
  }
  function Cf(o) {
    let s = to({
      0: [
        Ke.hexToBytes(o.pubkey)
      ],
      1: (o.relays || []).map((u) => hr.encode(u))
    }), l = Ae.toWords(s);
    return Ae.encode("nprofile", l, Ns);
  }
  function If(o) {
    let s = to({
      0: [
        Ke.hexToBytes(o.id)
      ],
      1: (o.relays || []).map((u) => hr.encode(u)),
      2: o.author ? [
        Ke.hexToBytes(o.author)
      ] : []
    }), l = Ae.toWords(s);
    return Ae.encode("nevent", l, Ns);
  }
  function Tf(o) {
    let s = new ArrayBuffer(4);
    new DataView(s).setUint32(0, o.kind, !1);
    let l = to({
      0: [
        hr.encode(o.identifier)
      ],
      1: (o.relays || []).map((f) => hr.encode(f)),
      2: [
        Ke.hexToBytes(o.pubkey)
      ],
      3: [
        new Uint8Array(s)
      ]
    }), u = Ae.toWords(l);
    return Ae.encode("naddr", u, Ns);
  }
  function Lf(o) {
    let s = to({
      0: [
        hr.encode(o)
      ]
    }), l = Ae.toWords(s);
    return Ae.encode("nrelay", l, Ns);
  }
  function to(o) {
    let s = [];
    return Object.entries(o).forEach(([l, u]) => {
      u.forEach((f) => {
        let g = new Uint8Array(f.length + 2);
        g.set([
          parseInt(l)
        ], 0), g.set([
          f.length
        ], 1), g.set(f, 2), s.push(g);
      });
    }), Ke.concatBytes(...s);
  }
  var Df = {};
  Sn(Df, {
    decrypt: () => Nf,
    encrypt: () => Of
  });
  async function Of(o, s, l) {
    const u = zt(o, "02" + s), f = cc(u);
    let g = Uint8Array.from((0, ue.randomBytes)(16)), E = hr.encode(l), w = await crypto.subtle.importKey("raw", f, {
      name: "AES-CBC"
    }, !1, [
      "encrypt"
    ]), q = await crypto.subtle.encrypt({
      name: "AES-CBC",
      iv: g
    }, w, E), Q = kr.encode(new Uint8Array(q)), j = kr.encode(new Uint8Array(g.buffer));
    return `${Q}?iv=${j}`;
  }
  async function Nf(o, s, l) {
    let [u, f] = l.split("?iv="), g = zt(o, "02" + s), E = cc(g), w = await crypto.subtle.importKey("raw", E, {
      name: "AES-CBC"
    }, !1, [
      "decrypt"
    ]), q = kr.decode(u), Q = kr.decode(f), j = await crypto.subtle.decrypt({
      name: "AES-CBC",
      iv: Q
    }, w, q);
    return Zr.decode(j);
  }
  function cc(o) {
    return o.slice(1, 33);
  }
  var Rf = {};
  Sn(Rf, {
    queryProfile: () => Uf,
    searchDomain: () => Bf,
    useFetchImplementation: () => Mf
  });
  var no;
  try {
    no = fetch;
  } catch {
  }
  function Mf(o) {
    no = o;
  }
  async function Bf(o, s = "") {
    try {
      return (await (await no(`https://${o}/.well-known/nostr.json?name=${s}`)).json()).names;
    } catch {
      return {};
    }
  }
  async function Uf(o) {
    let [s, l] = o.split("@");
    if (l || (l = s, s = "_"), !s.match(/^[A-Za-z0-9-_.]+$/) || !l.includes(".")) return null;
    let u;
    try {
      u = await (await no(`https://${l}/.well-known/nostr.json?name=${s}`)).json();
    } catch {
      return null;
    }
    if (!u?.names?.[s]) return null;
    let f = u.names[s], g = u.relays?.[f] || [];
    return {
      pubkey: f,
      relays: g
    };
  }
  var Pf = {};
  Sn(Pf, {
    generateSeedWords: () => Hf,
    privateKeyFromSeedWords: () => zf,
    validateWords: () => qf
  });
  function zf(o, s) {
    let u = ys.fromMasterSeed((0, Je.mnemonicToSeedSync)(o, s)).derive("m/44'/1237'/0'/0/0").privateKey;
    if (!u) throw new Error("could not derive private key");
    return Ke.bytesToHex(u);
  }
  function Hf() {
    return (0, Je.generateMnemonic)(ht.wordlist);
  }
  function qf(o) {
    return (0, Je.validateMnemonic)(o, ht.wordlist);
  }
  var jf = {};
  Sn(jf, {
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
      const f = l[u], [g, E, w, q] = f, Q = {
        id: E,
        relays: w ? [
          w
        ] : []
      }, j = u === 0, W = u === l.length - 1;
      if (q === "root") {
        s.root = Q;
        continue;
      }
      if (q === "reply") {
        s.reply = Q;
        continue;
      }
      if (q === "mention") {
        s.mentions.push(Q);
        continue;
      }
      if (j) {
        s.root = Q;
        continue;
      }
      if (W) {
        s.reply = Q;
        continue;
      }
      s.mentions.push(Q);
    }
    return s;
  }
  var Zf = {};
  Sn(Zf, {
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
  Sn(Kf, {
    BECH32_REGEX: () => dc,
    NOSTR_URI_REGEX: () => ro,
    parse: () => Yf,
    test: () => Qf
  });
  var dc = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/, ro = new RegExp(`nostr:(${dc.source})`);
  function Qf(o) {
    return typeof o == "string" && new RegExp(`^${ro.source}$`).test(o);
  }
  function Yf(o) {
    const s = o.match(new RegExp(`^${ro.source}$`));
    if (!s) throw new Error(`Invalid Nostr URI: ${o}`);
    return {
      uri: s[0],
      value: s[1],
      decoded: Ji(s[1])
    };
  }
  var Xf = {};
  Sn(Xf, {
    createDelegation: () => Jf,
    getDelegator: () => ep
  });
  function Jf(o, s) {
    let l = [];
    (s.kind || -1) >= 0 && l.push(`kind=${s.kind}`), s.until && l.push(`created_at<${s.until}`), s.since && l.push(`created_at>${s.since}`);
    let u = l.join("&");
    if (u === "") throw new Error("refusing to create a delegation without any conditions");
    let f = (0, Mt.sha256)(hr.encode(`nostr:delegation:${s.pubkey}:${u}`)), g = Ke.bytesToHex(Un.signSync(f, o));
    return {
      from: rc(o),
      to: s.pubkey,
      cond: u,
      sig: g
    };
  }
  function ep(o) {
    let s = o.tags.find((w) => w[0] === "delegation" && w.length >= 4);
    if (!s) return null;
    let l = s[1], u = s[2], f = s[3], g = u.split("&");
    for (let w = 0; w < g.length; w++) {
      let [q, Q, j] = g[w].split(/\b/);
      if (!(q === "kind" && Q === "=" && o.kind === parseInt(j))) {
        if (q === "created_at" && Q === "<" && o.created_at < parseInt(j)) continue;
        if (q === "created_at" && Q === ">" && o.created_at > parseInt(j)) continue;
        return null;
      }
    }
    let E = (0, Mt.sha256)(hr.encode(`nostr:delegation:${o.pubkey}:${u}`));
    return Un.verifySync(f, E, l) ? l : null;
  }
  var tp = {};
  Sn(tp, {
    matchAll: () => np,
    regex: () => ha,
    replaceAll: () => rp
  });
  var ha = () => new RegExp(`\\b${ro.source}\\b`, "g");
  function* np(o) {
    const s = o.matchAll(ha());
    for (const l of s) {
      const [u, f] = l;
      yield {
        uri: u,
        value: f,
        decoded: Ji(f),
        start: l.index,
        end: l.index + u.length
      };
    }
  }
  function rp(o, s) {
    return o.replaceAll(ha(), (l, u) => s({
      uri: l,
      value: u,
      decoded: Ji(u)
    }));
  }
  var sp = {};
  Sn(sp, {
    useFetchImplementation: () => ip,
    validateGithub: () => op
  });
  var fa;
  try {
    fa = fetch;
  } catch {
  }
  function ip(o) {
    fa = o;
  }
  async function op(o, s, l) {
    try {
      return await (await fa(`https://gist.github.com/${s}/${l}/raw`)).text() === `Verifying that I control the following Nostr public key: ${o}`;
    } catch {
      return !1;
    }
  }
  var ap = {};
  Sn(ap, {
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
    return new Promise((g, E) => {
      f.on("ok", function w() {
        f.off("ok", w), g();
      }), f.on("failed", function w(q) {
        f.off("failed", w), E(q);
      });
    });
  }, pa = {};
  Sn(pa, {
    getZapEndpoint: () => dp,
    makeZapReceipt: () => fp,
    makeZapRequest: () => up,
    useFetchImplementation: () => cp,
    validateZapRequest: () => hp
  });
  var ga;
  try {
    ga = fetch;
  } catch {
  }
  function cp(o) {
    ga = o;
  }
  async function dp(o) {
    try {
      let s = "", { lud06: l, lud16: u } = JSON.parse(o.content);
      if (l) {
        let { words: E } = Ae.decode(l, 1e3), w = Ae.fromWords(E);
        s = Zr.decode(w);
      } else if (u) {
        let [E, w] = u.split("@");
        s = `https://${w}/.well-known/lnurlp/${E}`;
      } else return null;
      let g = await (await ga(s)).json();
      if (g.allowsNostr && g.nostrPubkey) return g.callback;
    } catch {
    }
    return null;
  }
  function up({ profile: o, event: s, amount: l, relays: u, comment: f = "" }) {
    if (!l) throw new Error("amount not given");
    if (!o) throw new Error("profile not given");
    let g = {
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
    return s && g.tags.push([
      "e",
      s
    ]), g;
  }
  function hp(o) {
    let s;
    try {
      s = JSON.parse(o);
    } catch {
      return "Invalid zap request JSON.";
    }
    if (!ca(s)) return "Zap request is not a valid Nostr event.";
    if (!sc(s)) return "Invalid signature on zap request.";
    let l = s.tags.find(([g, E]) => g === "p" && E);
    if (!l) return "Zap request doesn't have a 'p' tag.";
    if (!l[1].match(/^[a-f0-9]{64}$/)) return "Zap request 'p' tag is not valid hex.";
    let u = s.tags.find(([g, E]) => g === "e" && E);
    return u && !u[1].match(/^[a-f0-9]{64}$/) ? "Zap request 'e' tag is not valid hex." : s.tags.find(([g, E]) => g === "relays" && E) ? null : "Zap request doesn't have a 'relays' tag.";
  }
  function fp({ zapRequest: o, preimage: s, bolt11: l, paidAt: u }) {
    let g = JSON.parse(o).tags.filter(([w]) => w === "e" || w === "p" || w === "a"), E = {
      kind: 9735,
      created_at: Math.round(u.getTime() / 1e3),
      content: "",
      tags: [
        ...g,
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
    return s && E.tags.push([
      "preimage",
      s
    ]), E;
  }
  Ke.hmacSha256Sync = (o, ...s) => (0, pt.hmac)(Mt.sha256, o, Ke.concatBytes(...s)), Ke.sha256Sync = (...o) => (0, Mt.sha256)(Ke.concatBytes(...o));
  const pp = (o) => da.decode(o).data, uc = (o) => da.decode(o).data;
  let hc = {};
  const gp = async (o) => {
    if (hc[o]) return hc[o];
    const s = new lc(), l = [
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
    const s = await pa.getZapEndpoint(o);
    if (!s) throw new Error("failed to retrieve zap endpoint :(");
    return s;
  }, mp = async (o, s) => {
    if (fc() && !s) try {
      return await window.nostr.signEvent(o);
    } catch {
    }
    return pf(o, df());
  }, yp = async ({ profile: o, nip19Target: s, amount: l, relays: u, comment: f, anon: g }) => {
    const E = pa.makeZapRequest({
      profile: o,
      event: s && s.startsWith("note") ? uc(s) : void 0,
      amount: l,
      relays: u,
      comment: f
    }), w = s && s.startsWith("naddr") ? uc(s) : void 0;
    if (w) {
      const q = w.relays ? w.relays.reduce((Q, j) => `${j},${Q}`, "") : "";
      E.tags.push([
        "a",
        `${w.kind}:${w.pubkey}:${w.identifier}`,
        q
      ]);
    }
    return (!fc() || g) && E.tags.push([
      "anon"
    ]), mp(E, g);
  }, wp = async ({ zapEndpoint: o, amount: s, comment: l, authorId: u, nip19Target: f, normalizedRelays: g, anon: E }) => {
    const w = await yp({
      profile: u,
      nip19Target: f,
      amount: s,
      relays: g,
      comment: l,
      anon: E
    });
    let q = `${o}?amount=${s}&nostr=${encodeURIComponent(JSON.stringify(w))}`;
    l && (q = `${q}&comment=${encodeURIComponent(l)}`);
    const Q = await fetch(q), { pr: j, reason: W, status: _ } = await Q.json();
    if (j) return j;
    throw _ === "ERROR" ? new Error(W ?? "Unable to fetch invoice") : new Error("Unable to fetch invoice");
  }, fc = () => window !== void 0 && window.nostr !== void 0, xp = ({ relays: o, invoice: s, onSuccess: l }) => {
    const u = new lc(), f = Array.from(/* @__PURE__ */ new Set([
      ...o,
      "wss://relay.nostr.band"
    ])), g = () => {
      u && u.close(f);
    }, E = Math.round(Date.now() / 1e3), w = setInterval(() => {
      u.sub(f, [
        {
          kinds: [
            9735
          ],
          since: E
        }
      ]).on("event", (Q) => {
        Q.tags.find((j) => j[0] === "bolt11" && j[1] === s) && (l(), g(), clearInterval(w));
      });
    }, 5e3);
    return () => {
      g(), clearInterval(w);
    };
  }, pc = "nostrZap.", gc = "lightningUri", vc = () => typeof localStorage < "u", _p = (o) => {
    if (vc())
      return localStorage.getItem(`${pc}${o}`);
  }, Ep = (o, s) => {
    vc() && localStorage.setItem(`${pc}${o}`, s);
  }, $p = () => _p(gc), kp = (o) => Ep(gc, o);
  let va = null;
  const Ap = (o) => {
    o = o.replace(/^#/, ""), o.length === 3 && (o = o.split("").map((g) => g + g).join(""));
    const s = parseInt(o, 16), l = s >> 16 & 255, u = s >> 8 & 255, f = s & 255;
    return {
      r: l,
      g: u,
      b: f
    };
  }, Sp = ({ r: o, g: s, b: l }) => (o * 299 + s * 587 + l * 114) / 1e3, bc = (o) => {
    const s = Ap(o);
    return Sp(s) < 128 ? "#fff" : "#000";
  }, ba = (o) => {
    const s = document.createElement("dialog");
    return s.classList.add("nostr-zap-dialog"), s.innerHTML = o, s.addEventListener("click", function({ clientX: l, clientY: u }) {
      const { left: f, right: g, top: E, bottom: w } = s.getBoundingClientRect();
      l === 0 && u === 0 || (l < f || l > g || u < E || u > w) && s.close();
    }), va.appendChild(s), s;
  }, Cp = ({ dialogHeader: o, invoice: s, relays: l, buttonColor: u }) => {
    const f = $p(), E = ba(`
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
    ].map(({ label: _, value: C }) => `<option value="${C}" ${f === C ? "selected" : ""}>${_}</option>`).join("")}
        </select>
        <button class="cta-button"
          ${u ? `style="background-color: ${u}; color: ${bc(u)}"` : ""} 
        >Open Wallet</button>
      `), w = E.querySelector(".qrcode"), q = E.querySelector('select[name="lightning-wallet"]'), Q = E.querySelector(".cta-button"), j = w.querySelector(".overlay"), W = xp({
      relays: l,
      invoice: s,
      onSuccess: () => {
        E.close();
      }
    });
    return new (/* @__PURE__ */ e(a))(w, {
      text: s,
      quietZone: 10
    }), w.addEventListener("click", function() {
      navigator.clipboard.writeText(s), j.classList.add("show"), setTimeout(() => j.classList.remove("show"), 2e3);
    }), Q.addEventListener("click", function() {
      kp(q.value), window.location.href = `${q.value}${s}`;
    }), E.addEventListener("close", function() {
      W(), E.remove();
    }), E.querySelector(".close-button").addEventListener("click", function() {
      E.close();
    }), E;
  }, Ip = async ({ npub: o, nip19Target: s, relays: l, buttonColor: u, anon: f }) => {
    const g = (Te) => `${Te.substring(0, 12)}...${Te.substring(Te.length - 12)}`, E = l ? l.split(",") : [
      "wss://relay.nostr.band",
      "wss://relay.damus.io",
      "wss://nos.lol"
    ], w = pp(o), q = gp(w), Q = "https://pbs.twimg.com/profile_images/1604195803748306944/LxHDoJ7P_400x400.jpg", j = async () => {
      const { picture: Te, display_name: Be, name: vt } = vp(await q);
      return `
      <h2>${Be || vt}</h2>
        <img
          src="${Te || Q}"
          width="80"
          height="80"
          alt="nostr user avatar"
        />
      <p>${g(s || o)}</p>
    `;
    }, W = ba(`
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
          ${u ? `style="background-color: ${u}; color: ${bc(u)}"` : ""} 
          type="submit" disabled>Zap</button>
      </form>
    `), _ = W.querySelector(".preset-zap-options-container"), C = W.querySelector("form"), M = W.querySelector('input[name="amount"]'), G = W.querySelector('input[name="comment"]'), ne = W.querySelector('button[type="submit"]'), ie = W.querySelector(".dialog-header-container"), me = (Te) => {
      W.close(), mc(Te, o).showModal();
    };
    j().then((Te) => {
      ie.innerHTML = Te, ne.disabled = !1;
    }).catch(me);
    const he = () => {
      ne.disabled = !0, ne.innerHTML = '<div class="spinner">Loading</div>';
    }, Ce = () => {
      ne.disabled = !1, ne.innerHTML = "Zap";
    }, _e = (Te) => {
      M.value = Te;
    };
    W.addEventListener("close", function() {
      Ce(), C.reset();
    }), W.querySelector(".close-button").addEventListener("click", function() {
      W.close();
    }), _.addEventListener("click", function(Te) {
      Te.target.matches("button") && (_e(Te.target.getAttribute("data-value")), M.focus());
    });
    const xe = q.then(bp);
    return C.addEventListener("submit", async function(Te) {
      Te.preventDefault(), he();
      const Be = Number(M.value) * 1e3, vt = G.value;
      try {
        const D = await wp({
          zapEndpoint: await xe,
          amount: Be,
          comment: vt,
          authorId: w,
          nip19Target: s,
          normalizedRelays: E,
          anon: f
        }), N = async () => {
          const I = Cp({
            dialogHeader: await j(),
            invoice: D,
            relays: E,
            buttonColor: u
          }), Z = I.querySelector(".cta-button");
          W.close(), I.showModal(), Z.focus();
        };
        if (window.webln) try {
          await window.webln.enable(), await window.webln.sendPayment(D), W.close();
        } catch {
          N();
        }
        else N();
      } catch (D) {
        me(D);
      }
    }), W;
  }, mc = (o, s) => {
    const l = ba(`
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
  }, yc = async ({ npub: o, noteId: s, naddr: l, relays: u, cachedAmountDialog: f, buttonColor: g, anon: E }) => {
    let w = f;
    try {
      return w || (w = await Ip({
        npub: o,
        nip19Target: l || s,
        relays: u,
        buttonColor: g,
        anon: E
      })), w.showModal(), window.matchMedia("(max-height: 932px)").matches || w.querySelector('input[name="amount"]').focus(), w;
    } catch (q) {
      w && w.close(), mc(q, o).showModal();
    }
  }, wc = (o) => {
    let s = null, l = null;
    o.addEventListener("click", async function() {
      const u = o.getAttribute("data-npub"), f = o.getAttribute("data-note-id"), g = o.getAttribute("data-naddr"), E = o.getAttribute("data-relays"), w = o.getAttribute("data-button-color"), q = o.getAttribute("data-anon") === "true";
      l && (l.npub !== u || l.noteId !== f || l.naddr !== g || l.relays !== E || l.buttonColor !== w || l.anon !== q) && (s = null), l = {
        npub: u,
        noteId: f,
        naddr: g,
        relays: E,
        buttonColor: w,
        anon: q
      }, s = await yc({
        npub: u,
        noteId: f,
        naddr: g,
        relays: E,
        cachedAmountDialog: s,
        buttonColor: w,
        anon: q
      });
    });
  }, xc = (o) => {
    document.querySelectorAll(o || "[data-npub]").forEach(wc);
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
    document.body.appendChild(s), va = s.attachShadow({
      mode: "open"
    }), va.appendChild(o);
  })(), xc(), window.nostrZap = {
    init: yc,
    initTarget: wc,
    initTargets: xc
  }, rd;
}
u1();
var h1 = qe('<div class="rotate-right-icon svg-icon svelte-1x7qm6n"></div> <span class="btn-text"> </span>', 1), f1 = qe('<span class="host-relay-note svelte-1x7qm6n"> </span>'), p1 = qe('<span class="relay-toggle-icon svelte-1x7qm6n" aria-label="toggle"><!></span> ', 1), g1 = qe('<span class="relay-check-icon svg-icon svelte-1x7qm6n" aria-hidden="true"></span>'), v1 = qe('<span class="relay-check-icon svg-icon svelte-1x7qm6n" aria-hidden="true"></span>'), b1 = qe('<div class="relay-copy-icon svg-icon svelte-1x7qm6n" aria-hidden="true"></div>'), m1 = qe('<li class="svelte-1x7qm6n"><span class="relay-url svelte-1x7qm6n"> </span> <span><!></span> <span><!></span> <div class="relay-copy-cell svelte-1x7qm6n"><!></div></li>'), y1 = qe('<div class="relay-list-header svelte-1x7qm6n" aria-hidden="true"><span> </span> <span> </span> <span> </span> <span class="relay-copy-column" aria-hidden="true"></span></div> <ul class="svelte-1x7qm6n"></ul>', 1), w1 = qe('<span style="color: #888;"> </span>'), x1 = qe('<div class="relay-list svelte-1x7qm6n"><!></div>'), _1 = qe('<div class="setting-section"><div class="setting-row"><span class="setting-label"> </span> <div class="setting-control"><!></div></div> <div class="setting-info svelte-1x7qm6n"><!> <!> <!></div></div>');
const E1 = {
  hash: "svelte-1x7qm6n",
  code: `.setting-info.svelte-1x7qm6n {margin-inline-start:10px;.relay-toggle-label {min-height:44px;padding:10px;--btn-bg: transparent;}}.host-relay-note.svelte-1x7qm6n {display:block;margin:0 10px 4px;color:var(--text-light);font-size:0.8125rem;}.rotate-right-icon.svelte-1x7qm6n {mask-image:var(--ehagaki-icon-726566726573685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.relay-list.svelte-1x7qm6n {margin-inline-start:10px;.relay-list-header:where(.svelte-1x7qm6n),
        li:where(.svelte-1x7qm6n) {display:grid;grid-template-columns:minmax(0, 1fr) 48px 52px 44px;align-items:center;column-gap:8px;}.relay-list-header:where(.svelte-1x7qm6n) {margin-top:6px;padding-bottom:4px;border-bottom:1px solid var(--border-hr);color:var(--text-light);font-size:0.8125rem;font-weight:600;}ul:where(.svelte-1x7qm6n) {margin:0;padding-inline-start:0;font-size:0.9375rem;list-style:none;}li:where(.svelte-1x7qm6n) {color:var(--text-light);padding:6px 0;border-bottom:1px solid var(--border-hr);}li:where(.svelte-1x7qm6n):last-child {border-bottom:none;}.relay-url:where(.svelte-1x7qm6n) {min-width:0;overflow-wrap:anywhere;}.relay-copy-cell:where(.svelte-1x7qm6n) {display:flex;justify-content:flex-end;min-width:0;}button.relay-copy-btn.copy {width:44px;height:44px;min-width:44px;min-height:44px;padding:0;}.relay-copy-icon:where(.svelte-1x7qm6n) {width:20px;height:20px;}.relay-capability:where(.svelte-1x7qm6n) {color:var(--text-light);font-weight:700;text-align:center;}.relay-capability.enabled:where(.svelte-1x7qm6n) {color:var(--theme);}.relay-check-icon:where(.svelte-1x7qm6n) {display:inline-block;width:20px;height:20px;vertical-align:middle;mask-image:var(--ehagaki-icon-636865636b5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}}.relay-toggle-icon.svelte-1x7qm6n {font-size:1.2rem;color:gray;}`
};
function Oh(n, e) {
  tr(e, !0), $o(n, E1);
  const t = () => rs(Ao, "$_", r), [r, i] = ko();
  let a = Ne(e, "relayConfig", 7), c = Ne(e, "showRelays", 7), d = Ne(e, "onToggleShowRelays", 7), h = Ne(e, "onRefreshRelaysAndProfile", 7), p = Ne(e, "hostRelayConfigActive", 7, !1);
  function b(x) {
    return x ? Array.isArray(x) ? x.map((H) => ({
      url: Lc.normalizeRelayUrl(H),
      read: !0,
      write: !0
    })) : Object.entries(x).map(([H, V]) => ({
      url: Lc.normalizeRelayUrl(H),
      read: V.read,
      write: V.write
    })) : [];
  }
  let m = Ee(() => b(a()));
  async function v(x, H) {
    return H.stopPropagation(), Bp(x, "URL", navigator, window);
  }
  var T = {
    get relayConfig() {
      return a();
    },
    set relayConfig(x) {
      a(x), Re();
    },
    get showRelays() {
      return c();
    },
    set showRelays(x) {
      c(x), Re();
    },
    get onToggleShowRelays() {
      return d();
    },
    set onToggleShowRelays(x) {
      d(x), Re();
    },
    get onRefreshRelaysAndProfile() {
      return h();
    },
    set onRefreshRelaysAndProfile(x) {
      h(x), Re();
    },
    get hostRelayConfigActive() {
      return p();
    },
    set hostRelayConfigActive(x = !1) {
      p(x), Re();
    }
  }, A = _1(), $ = R(A), L = R($), P = R(L, !0);
  O(L);
  var B = se(L, 2), te = R(B);
  {
    let x = Ee(() => p() ? t()("settingsDialog.refresh_profile") || "プロフィール再取得" : t()("settingsDialog.refresh_relays_and_profile") || "再取得");
    Bt(te, {
      variant: "default",
      shape: "rounded",
      contentLayout: "iconText",
      className: "refresh-relays-profile-btn",
      onClick: () => h()?.(),
      get ariaLabel() {
        return y(x);
      },
      children: (H, V) => {
        var X = h1(), K = dt(X), re = se(K, 2), de = R(re, !0);
        O(re), Fe(
          (ve, ce) => {
            vr(K, "aria-label", ve), ge(de, ce);
          },
          [
            () => p() ? t()("settingsDialog.refresh_profile") || "プロフィール再取得" : t()("settingsDialog.refresh") || "更新",
            () => p() ? t()("settingsDialog.refresh_profile") || "プロフィール再取得" : t()("settingsDialog.refresh") || "更新"
          ]
        ), fe(H, X);
      },
      $$slots: { default: !0 }
    });
  }
  O(B), O($);
  var oe = se($, 2), Y = R(oe);
  {
    var ee = (x) => {
      var H = f1(), V = R(H, !0);
      O(H), Fe((X) => ge(V, X), [
        () => t()("settingsDialog.host_relay_config") || "ホストから一時的に指定されています"
      ]), fe(x, H);
    };
    gt(Y, (x) => {
      p() && x(ee);
    });
  }
  var F = se(Y, 2);
  {
    let x = Ee(() => t()("settingsDialog.toggle_relay_list") || "リレーリストの表示切替");
    Bt(F, {
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
        return y(x);
      },
      children: (H, V) => {
        var X = p1(), K = dt(X), re = R(K);
        {
          var de = ($e) => {
            var we = Nt("▼");
            fe($e, we);
          }, ve = ($e) => {
            var we = Nt("▶");
            fe($e, we);
          };
          gt(re, ($e) => {
            c() ? $e(de) : $e(ve, -1);
          });
        }
        O(K);
        var ce = se(K);
        Fe(($e) => ge(ce, ` ${$e ?? ""}`), [() => t()("settingsDialog.relay_list") || "リレーリスト"]), fe(H, X);
      },
      $$slots: { default: !0 }
    });
  }
  var U = se(F, 2);
  {
    var S = (x) => {
      var H = x1(), V = R(H);
      {
        var X = (re) => {
          var de = y1(), ve = dt(de), ce = R(ve), $e = R(ce, !0);
          O(ce);
          var we = se(ce, 2), Le = R(we, !0);
          O(we);
          var Ge = se(we, 2), Xe = R(Ge, !0);
          O(Ge), jt(2), O(ve);
          var De = se(ve, 2);
          Dr(De, 21, () => y(m), Or, (Pe, nt) => {
            var pe = m1(), ot = R(pe), mn = R(ot, !0);
            O(ot);
            var It = se(ot, 2);
            let Mn;
            var yn = R(It);
            {
              var on = (Ie) => {
                var ct = g1();
                fe(Ie, ct);
              }, fn = (Ie) => {
                var ct = Nt("–");
                fe(Ie, ct);
              };
              gt(yn, (Ie) => {
                y(nt).read ? Ie(on) : Ie(fn, -1);
              });
            }
            O(It);
            var ke = se(It, 2);
            let Se;
            var Ve = R(ke);
            {
              var et = (Ie) => {
                var ct = v1();
                fe(Ie, ct);
              }, bt = (Ie) => {
                var ct = Nt("–");
                fe(Ie, ct);
              };
              gt(Ve, (Ie) => {
                y(nt).write ? Ie(et) : Ie(bt, -1);
              });
            }
            O(ke);
            var tt = se(ke, 2), mt = R(tt);
            {
              let Ie = Ee(() => `${t()("settingsDialog.copy_relay_url") || "リレーURLをコピー"}: ${y(nt).url}`), ct = Ee(() => t()("common.copySuccess"));
              Bt(mt, {
                variant: "copy",
                shape: "circle",
                className: "relay-copy-btn",
                get ariaLabel() {
                  return y(Ie);
                },
                onClick: (yt) => v(y(nt).url, yt),
                get floatingMessage() {
                  return y(ct);
                },
                children: (yt, zt) => {
                  var Tt = b1();
                  fe(yt, Tt);
                },
                $$slots: { default: !0 }
              });
            }
            O(tt), O(pe), Fe(
              (Ie, ct) => {
                ge(mn, y(nt).url), Mn = qa(It, 1, "relay-capability svelte-1x7qm6n", null, Mn, { enabled: y(nt).read }), vr(It, "aria-label", Ie), Se = qa(ke, 1, "relay-capability svelte-1x7qm6n", null, Se, { enabled: y(nt).write }), vr(ke, "aria-label", ct);
              },
              [
                () => y(nt).read ? t()("settingsDialog.relay_read_enabled") || "Read enabled" : t()("settingsDialog.relay_read_disabled") || "Read disabled",
                () => y(nt).write ? t()("settingsDialog.relay_write_enabled") || "Write enabled" : t()("settingsDialog.relay_write_disabled") || "Write disabled"
              ]
            ), fe(Pe, pe);
          }), O(De), Fe(
            (Pe, nt, pe) => {
              ge($e, Pe), ge(Le, nt), ge(Xe, pe);
            },
            [
              () => t()("settingsDialog.relay") || "リレー",
              () => t()("settingsDialog.relay_read") || "Read",
              () => t()("settingsDialog.relay_write") || "Write"
            ]
          ), fe(re, de);
        }, K = (re) => {
          var de = w1(), ve = R(de, !0);
          O(de), Fe((ce) => ge(ve, ce), [() => t()("settingsDialog.no_relay_info") || "リレー情報なし"]), fe(re, de);
        };
        gt(V, (re) => {
          y(m).length > 0 ? re(X) : re(K, -1);
        });
      }
      O(H), fe(x, H);
    };
    gt(U, (x) => {
      c() && x(S);
    });
  }
  O(oe), O(A), Fe((x) => ge(P, x), [
    () => p() ? t()("settingsDialog.refresh_profile") || "プロフィール再取得" : t()("settingsDialog.refresh_relays_and_profile") || "リレーリスト・プロフィール再取得"
  ]), fe(n, A);
  var k = nr(T);
  return i(), k;
}
rr(
  Oh,
  {
    relayConfig: {},
    showRelays: {},
    onToggleShowRelays: {},
    onRefreshRelaysAndProfile: {},
    hostRelayConfigActive: {}
  },
  [],
  [],
  { mode: "open" }
);
function zs(n, e) {
  tr(e, !0);
  let t = Ne(e, "value", 7), r = Ne(e, "disabled", 7, !1), i = Ne(e, "variant", 7, "default"), a = Ne(e, "shape", 7, "rounded"), c = Ne(e, "contentLayout", 7, void 0), d = Ne(e, "className", 7, ""), h = Ne(e, "ariaLabel", 7, ""), p = Ne(e, "style", 7, ""), b = Ne(e, "children", 7);
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
      return p();
    },
    set style(A = "") {
      p(A), Re();
    },
    get children() {
      return b();
    },
    set children(A) {
      b(A), Re();
    }
  }, v = Pt(), T = dt(v);
  {
    const A = ($, L) => {
      let P = () => L?.().props, B = () => L?.().checked;
      Bt($, wo(P, {
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
          return p();
        },
        get disabled() {
          return r();
        },
        get selected() {
          return B();
        },
        children: (te, oe) => {
          var Y = Pt(), ee = dt(Y);
          Ur(ee, () => b() ?? Oi), fe(te, Y);
        },
        $$slots: { default: !0 }
      }));
    };
    tn(T, () => gd, ($, L) => {
      L($, {
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
  return fe(n, v), nr(m);
}
rr(
  zs,
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
var $1 = qe('<table class="popover-table svelte-7juqqk"><thead class="svelte-7juqqk"><tr class="svelte-7juqqk"><th class="svelte-7juqqk"> </th><th class="svelte-7juqqk"> </th><th class="svelte-7juqqk"> </th></tr></thead><tbody class="svelte-7juqqk"><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr></tbody></table> <p class="popover-note svelte-7juqqk"> </p>', 1), k1 = qe('<div class="radio-pair svelte-7juqqk"></div>'), A1 = qe('<table class="popover-table svelte-7juqqk"><thead class="svelte-7juqqk"><tr class="svelte-7juqqk"><th class="svelte-7juqqk"> </th><th class="svelte-7juqqk"> </th></tr></thead><tbody class="svelte-7juqqk"><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr><tr class="svelte-7juqqk"><td class="svelte-7juqqk"> </td><td class="svelte-7juqqk"> </td></tr></tbody></table>'), S1 = qe('<div class="radio-pair svelte-7juqqk"></div>'), C1 = qe('<div class="setting-section svelte-7juqqk"><div class="setting-row svelte-7juqqk"><div class="setting-label-wrapper svelte-7juqqk"><span class="setting-label"> </span> <!></div> <!></div></div> <div class="setting-section svelte-7juqqk"><div class="setting-row svelte-7juqqk"><div class="setting-label-wrapper svelte-7juqqk"><span class="setting-label"> </span> <!></div> <!></div></div>', 1);
const I1 = {
  hash: "svelte-7juqqk",
  code: `.setting-label-wrapper.svelte-7juqqk {display:inline-flex;align-items:center;gap:4px;flex-wrap:wrap;flex-shrink:0;}.popover-table {border-collapse:collapse;font-size:1rem;th.svelte-7juqqk,\r
        td.svelte-7juqqk {padding:4px 8px;text-align:start;}th.svelte-7juqqk {font-weight:600;border-bottom:1px solid var(--border);}td.svelte-7juqqk {font-weight:normal;}}.popover-note.svelte-7juqqk {max-width:320px;margin:8px 0 0;color:var(--text-secondary);font-size:0.875rem;line-height:1.5;}.radio-group {display:flex;gap:4px;flex-wrap:wrap;button {font-size:0.875rem;padding:10px;min-height:50px;min-width:50px;font-weight:normal;}}.radio-pair.svelte-7juqqk {display:flex;gap:4px;}`
};
function Nh(n, e) {
  tr(e, !0), $o(n, I1);
  const t = () => rs(Ao, "$_", r), [r, i] = ko();
  let a = Ne(e, "compressionPairs", 7), c = Ne(e, "selectedCompression", 7), d = Ne(e, "onCompressionChange", 7), h = Ne(e, "videoCompressionPairs", 7), p = Ne(e, "selectedVideoCompression", 7), b = Ne(e, "onVideoCompressionChange", 7);
  var m = {
    get compressionPairs() {
      return a();
    },
    set compressionPairs(H) {
      a(H), Re();
    },
    get selectedCompression() {
      return c();
    },
    set selectedCompression(H) {
      c(H), Re();
    },
    get onCompressionChange() {
      return d();
    },
    set onCompressionChange(H) {
      d(H), Re();
    },
    get videoCompressionPairs() {
      return h();
    },
    set videoCompressionPairs(H) {
      h(H), Re();
    },
    get selectedVideoCompression() {
      return p();
    },
    set selectedVideoCompression(H) {
      p(H), Re();
    },
    get onVideoCompressionChange() {
      return b();
    },
    set onVideoCompressionChange(H) {
      b(H), Re();
    }
  }, v = C1(), T = dt(v), A = R(T), $ = R(A), L = R($), P = R(L, !0);
  O(L);
  var B = se(L, 2);
  {
    let H = Ee(() => t()("settingsDialog.image_compression_settings_description"));
    Tr(B, {
      side: "top",
      get ariaLabel() {
        return y(H);
      },
      children: (V, X) => {
        var K = $1(), re = dt(K), de = R(re), ve = R(de), ce = R(ve), $e = R(ce, !0);
        O(ce);
        var we = se(ce), Le = R(we, !0);
        O(we);
        var Ge = se(we), Xe = R(Ge, !0);
        O(Ge), O(ve), O(de);
        var De = se(de), Pe = R(De), nt = R(Pe), pe = R(nt, !0);
        O(nt);
        var ot = se(nt), mn = R(ot);
        O(ot);
        var It = se(ot), Mn = R(It);
        O(It), O(Pe);
        var yn = se(Pe), on = R(yn), fn = R(on, !0);
        O(on);
        var ke = se(on), Se = R(ke);
        O(ke);
        var Ve = se(ke), et = R(Ve);
        O(Ve), O(yn);
        var bt = se(yn), tt = R(bt), mt = R(tt, !0);
        O(tt);
        var Ie = se(tt), ct = R(Ie);
        O(Ie);
        var yt = se(Ie), zt = R(yt);
        O(yt), O(bt), O(De), O(re);
        var Tt = se(re, 2), rn = R(Tt, !0);
        O(Tt), Fe(
          (Lt, wn, St, Dt, Qt, Ot, kt, an, xn, En) => {
            ge($e, Lt), ge(Le, wn), ge(Xe, St), ge(pe, Dt), ge(mn, `${Ms.high.maxWidthOrHeight}px`), ge(Mn, `${Qt ?? ""}%`), ge(fn, Ot), ge(Se, `${Ms.medium.maxWidthOrHeight}px`), ge(et, `${kt ?? ""}%`), ge(mt, an), ge(ct, `${Ms.low.maxWidthOrHeight}px`), ge(zt, `${xn ?? ""}%`), ge(rn, En);
          },
          [
            () => t()("settingsDialog.info_header_setting"),
            () => t()("settingsDialog.info_header_pixels"),
            () => t()("settingsDialog.info_header_quality"),
            () => t()("settingsDialog.quality_high"),
            () => Math.round(Ms.high.initialQuality * 100),
            () => t()("settingsDialog.quality_medium"),
            () => Math.round(Ms.medium.initialQuality * 100),
            () => t()("settingsDialog.quality_low"),
            () => Math.round(Ms.low.initialQuality * 100),
            () => t()("settingsDialog.image_short_edge_protection_note", {
              values: {
                aspectRatio: _a.aspectRatioThreshold,
                pixels: _a.minShortEdge,
                megapixels: _a.maxMegapixels
              }
            })
          ]
        ), fe(V, K);
      },
      $$slots: { default: !0 }
    });
  }
  O($);
  var te = se($, 2);
  {
    let H = Ee(() => t()("settingsDialog.image_quality_setting"));
    tn(te, () => uo, (V, X) => {
      X(V, {
        class: "setting-control radio-group",
        name: "compression",
        orientation: "horizontal",
        get value() {
          return c();
        },
        get "aria-label"() {
          return y(H);
        },
        get onValueChange() {
          return d();
        },
        children: (K, re) => {
          var de = Pt(), ve = dt(de);
          Dr(ve, 17, a, Or, (ce, $e) => {
            var we = k1();
            Dr(we, 21, () => y($e), Or, (Le, Ge) => {
              zs(Le, {
                get value() {
                  return y(Ge).value;
                },
                variant: "default",
                shape: "rounded",
                get ariaLabel() {
                  return y(Ge).label;
                },
                children: (Xe, De) => {
                  jt();
                  var Pe = Nt();
                  Fe(() => ge(Pe, y(Ge).label)), fe(Xe, Pe);
                },
                $$slots: { default: !0 }
              });
            }), O(we), fe(ce, we);
          }), fe(K, de);
        },
        $$slots: { default: !0 }
      });
    });
  }
  O(A), O(T);
  var oe = se(T, 2), Y = R(oe), ee = R(Y), F = R(ee), U = R(F, !0);
  O(F);
  var S = se(F, 2);
  {
    let H = Ee(() => t()("settingsDialog.video_compression_settings_description"));
    Tr(S, {
      side: "top",
      get ariaLabel() {
        return y(H);
      },
      children: (V, X) => {
        var K = A1(), re = R(K), de = R(re), ve = R(de), ce = R(ve, !0);
        O(ve);
        var $e = se(ve), we = R($e, !0);
        O($e), O(de), O(re);
        var Le = se(re), Ge = R(Le), Xe = R(Ge), De = R(Xe, !0);
        O(Xe);
        var Pe = se(Xe), nt = R(Pe);
        O(Pe), O(Ge);
        var pe = se(Ge), ot = R(pe), mn = R(ot, !0);
        O(ot);
        var It = se(ot), Mn = R(It);
        O(It), O(pe);
        var yn = se(pe), on = R(yn), fn = R(on, !0);
        O(on);
        var ke = se(on), Se = R(ke);
        O(ke), O(yn), O(Le), O(K), Fe(
          (Ve, et, bt, tt, mt) => {
            ge(ce, Ve), ge(we, et), ge(De, bt), ge(nt, `${Ea.high.maxSize ?? ""}px`), ge(mn, tt), ge(Mn, `${Ea.medium.maxSize ?? ""}px`), ge(fn, mt), ge(Se, `${Ea.low.maxSize ?? ""}px`);
          },
          [
            () => t()("settingsDialog.info_header_setting"),
            () => t()("settingsDialog.info_header_pixels"),
            () => t()("settingsDialog.quality_high"),
            () => t()("settingsDialog.quality_medium"),
            () => t()("settingsDialog.quality_low")
          ]
        ), fe(V, K);
      },
      $$slots: { default: !0 }
    });
  }
  O(ee);
  var k = se(ee, 2);
  {
    let H = Ee(() => t()("settingsDialog.video_quality_setting"));
    tn(k, () => uo, (V, X) => {
      X(V, {
        class: "setting-control radio-group",
        name: "videoCompression",
        orientation: "horizontal",
        get value() {
          return p();
        },
        get "aria-label"() {
          return y(H);
        },
        get onValueChange() {
          return b();
        },
        children: (K, re) => {
          var de = Pt(), ve = dt(de);
          Dr(ve, 17, h, Or, (ce, $e) => {
            var we = S1();
            Dr(we, 21, () => y($e), Or, (Le, Ge) => {
              zs(Le, {
                get value() {
                  return y(Ge).value;
                },
                variant: "default",
                shape: "rounded",
                get ariaLabel() {
                  return y(Ge).label;
                },
                children: (Xe, De) => {
                  jt();
                  var Pe = Nt();
                  Fe(() => ge(Pe, y(Ge).label)), fe(Xe, Pe);
                },
                $$slots: { default: !0 }
              });
            }), O(we), fe(ce, we);
          }), fe(K, de);
        },
        $$slots: { default: !0 }
      });
    });
  }
  O(Y), O(oe), Fe(
    (H, V) => {
      ge(P, H), ge(U, V);
    },
    [
      () => t()("settingsDialog.image_quality_setting"),
      () => t()("settingsDialog.video_quality_setting")
    ]
  ), fe(n, v);
  var x = nr(m);
  return i(), x;
}
rr(
  Nh,
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
var T1 = qe("<option> </option>"), L1 = qe("<option> </option>"), D1 = qe('<div class="url-clear-input-icon svg-icon svelte-odrb59" aria-hidden="true"></div>'), O1 = qe('<span class="form-error svelte-odrb59" role="alert"> </span>'), N1 = qe('<div class="destination-form svelte-odrb59"><label class="svelte-odrb59"><span> </span> <select class="svelte-odrb59"><option>custom</option><optgroup label="Blossom"></optgroup><optgroup label="NIP-96"></optgroup></select></label> <label class="svelte-odrb59"><span> </span> <select class="svelte-odrb59"><option>Blossom</option><option>NIP-96 legacy</option><option>Custom HTTP</option></select></label> <div class="url-field svelte-odrb59"><label for="upload-destination-url-input" class="svelte-odrb59"><span>URL</span></label> <div class="url-input-shell svelte-odrb59"><input id="upload-destination-url-input" class="upload-destination-url-input svelte-odrb59" inputmode="url"/> <!></div> <!></div> <div class="checkbox-group svelte-odrb59"><label class="checkbox-row svelte-odrb59"><input type="checkbox" class="svelte-odrb59"/> <span> </span></label> <label class="checkbox-row svelte-odrb59"><input type="checkbox" class="svelte-odrb59"/> <span> </span></label></div> <div class="form-actions svelte-odrb59"><!> <!></div></div>'), R1 = qe('<div class="server-cog-icon svg-icon svelte-odrb59" aria-hidden="true"></div> <span class="btn-text"> </span>', 1), M1 = qe('<span class="badge default-badge svelte-odrb59"> </span>'), B1 = qe('<span class="badge muted svelte-odrb59"> </span>'), U1 = qe('<button type="button" class="mime-toggle svelte-odrb59"> </button>'), P1 = qe('<span class="arrow-up-icon svg-icon svelte-odrb59"></span>'), z1 = qe('<span class="arrow-down-icon svg-icon svelte-odrb59"></span>'), H1 = qe('<div class="blossom-test-popover svelte-odrb59"><p class="svelte-odrb59"> </p> <p class="svelte-odrb59"> </p></div>'), q1 = qe("<div> </div>"), j1 = qe('<div class="destination-row svelte-odrb59"><div class="destination-main svelte-odrb59"><div class="destination-content svelte-odrb59"><div class="destination-title svelte-odrb59"><span> </span> <!> <!></div> <div class="destination-meta svelte-odrb59"> </div> <div class="destination-meta mime-meta svelte-odrb59"><span> </span> <!></div></div> <div class="destination-order-actions svelte-odrb59"><!> <!></div></div> <div class="destination-actions svelte-odrb59"><!> <!> <!> <!> <!></div> <!></div> <!>', 1), F1 = qe('<div class="bud03-popover svelte-odrb59"><p class="svelte-odrb59"> </p> <p class="svelte-odrb59"> </p> <p class="svelte-odrb59"> </p></div>'), Z1 = qe('<div class="test-result svelte-odrb59"> </div>'), V1 = qe('<div class="panel-actions svelte-odrb59"><!> <!> <!> <!></div> <!>', 1), G1 = qe('<div class="upload-panel svelte-odrb59"><!> <!></div>'), W1 = qe('<div class="setting-section upload-destination-section svelte-odrb59"><div class="setting-row"><div class="setting-label-group"><span class="setting-label"> </span> <span class="upload-summary svelte-odrb59"> </span></div> <div class="setting-control"><!></div></div> <!></div>');
const K1 = {
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
function Rh(n, e) {
  tr(e, !0), $o(n, K1);
  const t = () => rs(Ao, "$_", r), [r, i] = ko(), a = (ke) => {
    var Se = N1(), Ve = R(Se), et = R(Ve), bt = R(et, !0);
    O(et);
    var tt = se(et, 2), mt = R(tt);
    mt.value = mt.__value = "custom";
    var Ie = se(mt);
    Dr(Ie, 21, () => F, Or, (at, $t) => {
      var wt = T1(), en = R(wt, !0);
      O(wt);
      var Ze = {};
      Fe(() => {
        ge(en, y($t).name), Ze !== (Ze = y($t).id) && (wt.value = (wt.__value = y($t).id) ?? "");
      }), fe(at, wt);
    }), O(Ie);
    var ct = se(Ie);
    Dr(ct, 21, () => U, Or, (at, $t) => {
      var wt = L1(), en = R(wt, !0);
      O(wt);
      var Ze = {};
      Fe(() => {
        ge(en, y($t).name), Ze !== (Ze = y($t).id) && (wt.value = (wt.__value = y($t).id) ?? "");
      }), fe(at, wt);
    }), O(ct), O(tt);
    var yt;
    dd(tt), O(Ve);
    var zt = se(Ve, 2), Tt = R(zt), rn = R(Tt, !0);
    O(Tt);
    var Lt = se(Tt, 2), wn = R(Lt);
    wn.value = wn.__value = "blossom";
    var St = se(wn);
    St.value = St.__value = "nip96";
    var Dt = se(St);
    Dt.value = Dt.__value = "custom-http", O(Lt), O(zt);
    var Qt = se(zt, 2), Ot = se(R(Qt), 2), kt = R(Ot);
    ss(kt), Up(kt, (at) => be(m, at), () => y(m));
    var an = se(kt, 2);
    {
      var xn = (at) => {
        {
          let $t = Ee(() => t()("clearInput") || "入力内容を消去");
          Bt(at, {
            type: "button",
            className: "upload-destination-url-clear-button",
            variant: "default",
            shape: "square",
            contentLayout: "icon",
            get ariaLabel() {
              return y($t);
            },
            onClick: de,
            get onmousedown() {
              return kc;
            },
            get ontouchstart() {
              return kc;
            },
            children: (wt, en) => {
              var Ze = D1();
              fe(wt, Ze);
            },
            $$slots: { default: !0 }
          });
        }
      }, En = Ee(() => y(v).serverUrl.trim().length > 0);
      gt(an, (at) => {
        y(En) && at(xn);
      });
    }
    O(Ot);
    var jn = se(Ot, 2);
    {
      var ir = (at) => {
        var $t = O1(), wt = R($t, !0);
        O($t), Fe(() => ge(wt, y(A))), fe(at, $t);
      };
      gt(jn, (at) => {
        y(A) && at(ir);
      });
    }
    O(Qt);
    var Bn = se(Qt, 2), Fn = R(Bn), $n = R(Fn);
    ss($n);
    var Yn = se($n, 2), Un = R(Yn, !0);
    O(Yn), O(Fn);
    var Rt = se(Fn, 2), Jt = R(Rt);
    ss(Jt);
    var Zn = se(Jt, 2), Ke = R(Zn, !0);
    O(Zn), O(Rt), O(Bn);
    var Mt = se(Bn, 2), Pn = R(Mt);
    {
      let at = Ee(() => !y(v).serverUrl.trim());
      Bt(Pn, {
        variant: "primary",
        shape: "rounded",
        onClick: ve,
        get disabled() {
          return y(at);
        },
        children: ($t, wt) => {
          jt();
          var en = Nt();
          Fe((Ze) => ge(en, Ze), [() => t()("settingsDialog.uploadDestinationSave") || "保存"]), fe($t, en);
        },
        $$slots: { default: !0 }
      });
    }
    var rt = se(Pn, 2);
    Bt(rt, {
      variant: "default",
      shape: "rounded",
      onClick: X,
      children: (at, $t) => {
        jt();
        var wt = Nt();
        Fe((en) => ge(wt, en), [() => t()("postComponent.cancel") || "キャンセル"]), fe(at, wt);
      },
      $$slots: { default: !0 }
    }), O(Mt), O(Se), Fe(
      (at, $t, wt, en) => {
        ge(bt, at), yt !== (yt = y(v).presetId) && (tt.value = (tt.__value = y(v).presetId) ?? "", ud(tt, y(v).presetId)), ge(rn, $t), ge(Un, wt), ge(Ke, en);
      },
      [
        () => t()("settingsDialog.uploadDestinationPreset") || "プリセット",
        () => t()("settingsDialog.uploadDestinationProtocol") || "Protocol",
        () => t()("settingsDialog.uploadDestinationEnabled") || "有効",
        () => t()("settingsDialog.uploadDestinationDefault") || "既定"
      ]
    ), br("change", tt, (at) => re(at.currentTarget.value)), br("change", Lt, () => be(A, null)), Pp(Lt, () => y(v).protocol, (at) => y(v).protocol = at), br("input", kt, () => be(A, null)), lg(kt, () => y(v).serverUrl, (at) => y(v).serverUrl = at), Oc($n, () => y(v).enabled, (at) => y(v).enabled = at), Oc(Jt, () => y(v).isDefault, (at) => y(v).isDefault = at), fe(ke, Se);
  };
  let c = Ne(e, "rxNostr", 7, null);
  const d = {
    id: "",
    protocol: "blossom",
    serverUrl: "",
    presetId: "custom",
    enabled: !0,
    isDefault: !0
  };
  let h = Ut(!1), p = Ut(!1), b = Ut(null), m = Ut(null), v = Ut(gr({ ...d })), T = Ut(null), A = Ut(null), $ = Ut(gr({})), L = Ee(() => Jn.value), P = Ut(null), B = Ee(() => ts.value.isAuthenticated && ts.value.pubkey || null), te = Ee(() => !!(c() && y(B)));
  const oe = new Map($a.map((ke) => [ke.id, ke])), Y = [
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
  ], F = Y.map((ke) => oe.get(ke)), U = ee.map((ke) => oe.get(ke));
  cd(() => {
    be(P, y(B), !0), Jn.load(y(P));
  }), Dn(() => {
    y(P) !== y(B) && (be(P, y(B), !0), Jn.load(y(P)));
  });
  function S(ke) {
    if (!ke) return t()("settingsDialog.uploadDestinationUnknown") || "未確認";
    const Se = ["B", "KB", "MB", "GB"];
    let Ve = ke, et = 0;
    for (; Ve >= 1024 && et < Se.length - 1; )
      Ve /= 1024, et += 1;
    return `${Ve.toFixed(Ve >= 10 || et === 0 ? 0 : 1)} ${Se[et]}`;
  }
  function k(ke) {
    const Se = ke.capabilities.supportedMimeTypes;
    return Se.length ? y($)[ke.id] || Se.length <= 3 ? Se.join(", ") : `${Se.slice(0, 3).join(", ")} +${Se.length - 3}` : t()("settingsDialog.uploadDestinationUnknown") || "未確認";
  }
  function x(ke) {
    return ke.capabilities.supportedMimeTypes.length > 3;
  }
  function H(ke) {
    be(
      $,
      {
        ...y($),
        [ke]: !y($)[ke]
      },
      !0
    );
  }
  function V() {
    be(v, { ...d }, !0), be(A, null), be(p, !0), be(b, null), be(h, !0);
  }
  function X() {
    be(p, !1), be(b, null), be(A, null);
  }
  function K(ke) {
    if (y(b) === ke.id) {
      X();
      return;
    }
    be(
      v,
      {
        id: ke.id,
        protocol: ke.protocol,
        serverUrl: ke.serverUrl,
        presetId: ke.presetId ?? "custom",
        enabled: ke.enabled,
        isDefault: ke.isDefault
      },
      !0
    ), be(A, null), be(p, !0), be(b, ke.id, !0), be(h, !0);
  }
  function re(ke) {
    if (y(v).presetId = ke, be(A, null), ke === "custom") {
      y(v).serverUrl = "";
      return;
    }
    const Se = $a.find((Ve) => Ve.id === ke);
    Se && (y(v).protocol = Se.protocol, y(v).serverUrl = Se.serverUrl);
  }
  function de() {
    y(v).serverUrl = "", y(v).presetId = "custom", be(A, null), setTimeout(
      () => {
        y(m)?.focus({ preventScroll: !0 });
      },
      0
    );
  }
  async function ve() {
    const ke = Date.now(), Se = $a.find((Lt) => Lt.id === y(v).presetId), Ve = y(L).destinations.find((Lt) => Lt.id === y(v).id), et = y(v).serverUrl || Se?.serverUrl || "", bt = y(v).protocol;
    let tt = zp(et);
    if (bt === "nip96")
      try {
        tt = Hp(et).url;
      } catch {
        be(A, t()("settingsDialog.uploadDestinationInvalidNip96Url") || "有効な絶対 HTTP(S) URL を入力してください", !0);
        return;
      }
    be(A, null);
    const mt = qp({ protocol: bt, presetId: y(v).presetId, serverUrl: tt }), Ie = bt === "nip96" ? mt?.resolvedUploadUrl ?? null : null, ct = jp({
      serverUrl: tt,
      resolvedUploadUrl: Ie,
      fallbackName: Se?.name ?? Ve?.name ?? "Custom NIP-96",
      protocol: bt,
      presetId: y(v).presetId
    }), yt = Se && !Ve ? {
      ...$c({
        preset: Se,
        pubkeyHex: y(B),
        isDefault: y(v).isDefault || y(L).destinations.length === 0,
        now: ke
      }),
      name: ct,
      serverUrl: tt,
      enabled: y(v).enabled
    } : Ve ?? $c({
      preset: Se ?? {
        id: "custom",
        name: ct,
        protocol: y(v).protocol,
        serverUrl: y(v).serverUrl,
        capabilities: Fp
      },
      pubkeyHex: y(B),
      isDefault: y(v).isDefault || y(L).destinations.length === 0,
      now: ke
    }), {
      resolvedUploadUrl: zt,
      ...Tt
    } = yt, rn = {
      ...Tt,
      name: ct,
      protocol: bt,
      serverUrl: tt,
      presetId: y(v).presetId,
      enabled: y(v).enabled,
      isDefault: y(v).isDefault,
      updatedAt: ke,
      ...Ie ? { resolvedUploadUrl: Ie } : {}
    };
    await Jn.save(rn), be(p, !1), be(b, null);
  }
  async function ce(ke) {
    be(T, ke.id, !0);
    try {
      await Jn.test(ke);
    } finally {
      be(T, null);
    }
  }
  async function $e(ke) {
    y(b) === ke.id && (be(p, !1), be(b, null)), await Jn.delete(ke.id, y(B));
  }
  async function we() {
    !c() || !y(B) || await Jn.fetchBud03(c(), y(B));
  }
  async function Le() {
    !c() || !y(B) || await Jn.publishBud03(c(), y(B));
  }
  var Ge = {
    get rxNostr() {
      return c();
    },
    set rxNostr(ke = null) {
      c(ke), Re();
    }
  }, Xe = W1(), De = R(Xe), Pe = R(De), nt = R(Pe), pe = R(nt, !0);
  O(nt);
  var ot = se(nt, 2), mn = R(ot, !0);
  O(ot), O(Pe);
  var It = se(Pe, 2), Mn = R(It);
  Bt(Mn, {
    variant: "default",
    shape: "rounded",
    contentLayout: "iconText",
    className: "upload-destination-manage-btn",
    onClick: () => be(h, !y(h)),
    children: (ke, Se) => {
      var Ve = R1(), et = se(dt(Ve), 2), bt = R(et, !0);
      O(et), Fe((tt) => ge(bt, tt), [
        () => y(h) ? t()("settingsDialog.uploadDestinationClose") || "閉じる" : t()("settingsDialog.uploadDestinationManage") || "管理"
      ]), fe(ke, Ve);
    },
    $$slots: { default: !0 }
  }), O(It), O(De);
  var yn = se(De, 2);
  {
    var on = (ke) => {
      var Se = G1(), Ve = R(Se);
      Dr(Ve, 17, () => y(L).destinations, Or, (mt, Ie) => {
        var ct = j1(), yt = dt(ct), zt = R(yt), Tt = R(zt), rn = R(Tt), Lt = R(rn), wn = R(Lt, !0);
        O(Lt);
        var St = se(Lt, 2);
        {
          var Dt = (Ze) => {
            var lt = M1(), Et = R(lt, !0);
            O(lt), Fe((ue) => ge(Et, ue), [
              () => t()("settingsDialog.uploadDestinationDefault") || "既定"
            ]), fe(Ze, lt);
          };
          gt(St, (Ze) => {
            y(Ie).isDefault && Ze(Dt);
          });
        }
        var Qt = se(St, 2);
        {
          var Ot = (Ze) => {
            var lt = B1(), Et = R(lt, !0);
            O(lt), Fe((ue) => ge(Et, ue), [
              () => t()("settingsDialog.uploadDestinationDisabled") || "無効"
            ]), fe(Ze, lt);
          };
          gt(Qt, (Ze) => {
            y(Ie).enabled || Ze(Ot);
          });
        }
        O(rn);
        var kt = se(rn, 2), an = R(kt);
        O(kt);
        var xn = se(kt, 2), En = R(xn), jn = R(En, !0);
        O(En);
        var ir = se(En, 2);
        {
          var Bn = (Ze) => {
            var lt = U1(), Et = R(lt, !0);
            O(lt), Fe((ue) => ge(Et, ue), [
              () => y($)[y(Ie).id] ? t()("settingsDialog.uploadDestinationMimeCollapse") || "折りたたむ" : t()("settingsDialog.uploadDestinationMimeExpand") || "すべて表示"
            ]), br("click", lt, () => H(y(Ie).id)), fe(Ze, lt);
          }, Fn = Ee(() => x(y(Ie)));
          gt(ir, (Ze) => {
            y(Fn) && Ze(Bn);
          });
        }
        O(xn), O(Tt);
        var $n = se(Tt, 2), Yn = R($n);
        {
          let Ze = Ee(() => t()("settingsDialog.uploadDestinationMoveUp") || "Up"), lt = Ee(() => y(L).destinations[0]?.id === y(Ie).id);
          Bt(Yn, {
            variant: "default",
            shape: "rounded",
            className: "destination-order-button",
            get ariaLabel() {
              return y(Ze);
            },
            onClick: () => Jn.move(y(Ie).id, "up", y(B)),
            get disabled() {
              return y(lt);
            },
            children: (Et, ue) => {
              var Ct = P1();
              fe(Et, Ct);
            },
            $$slots: { default: !0 }
          });
        }
        var Un = se(Yn, 2);
        {
          let Ze = Ee(() => t()("settingsDialog.uploadDestinationMoveDown") || "Down"), lt = Ee(() => y(L).destinations[y(L).destinations.length - 1]?.id === y(Ie).id);
          Bt(Un, {
            variant: "default",
            shape: "rounded",
            className: "destination-order-button",
            get ariaLabel() {
              return y(Ze);
            },
            onClick: () => Jn.move(y(Ie).id, "down", y(B)),
            get disabled() {
              return y(lt);
            },
            children: (Et, ue) => {
              var Ct = z1();
              fe(Et, Ct);
            },
            $$slots: { default: !0 }
          });
        }
        O($n), O(zt);
        var Rt = se(zt, 2), Jt = R(Rt);
        Bt(Jt, {
          variant: "default",
          shape: "rounded",
          onClick: () => Jn.setDefault(y(Ie).id, y(B)),
          get disabled() {
            return y(Ie).isDefault;
          },
          children: (Ze, lt) => {
            jt();
            var Et = Nt();
            Fe((ue) => ge(Et, ue), [
              () => t()("settingsDialog.uploadDestinationSetDefault") || "既定"
            ]), fe(Ze, Et);
          },
          $$slots: { default: !0 }
        });
        var Zn = se(Jt, 2);
        Bt(Zn, {
          variant: "default",
          shape: "rounded",
          onClick: () => K(y(Ie)),
          children: (Ze, lt) => {
            jt();
            var Et = Nt();
            Fe((ue) => ge(Et, ue), [
              () => y(p) && y(b) === y(Ie).id ? t()("settingsDialog.uploadDestinationClose") || "閉じる" : t()("settingsDialog.uploadDestinationEdit") || "編集"
            ]), fe(Ze, Et);
          },
          $$slots: { default: !0 }
        });
        var Ke = se(Zn, 2);
        {
          let Ze = Ee(() => y(T) === y(Ie).id);
          Bt(Ke, {
            variant: "default",
            shape: "rounded",
            onClick: () => ce(y(Ie)),
            get disabled() {
              return y(Ze);
            },
            children: (lt, Et) => {
              jt();
              var ue = Nt();
              Fe((Ct) => ge(ue, Ct), [
                () => y(T) === y(Ie).id ? t()("settingsDialog.uploadDestinationTesting") || "確認中" : t()("settingsDialog.uploadDestinationTest") || "接続テスト"
              ]), fe(lt, ue);
            },
            $$slots: { default: !0 }
          });
        }
        var Mt = se(Ke, 2);
        {
          let Ze = Ee(() => y(L).destinations.length <= 1);
          Bt(Mt, {
            variant: "default",
            shape: "rounded",
            onClick: () => $e(y(Ie)),
            get disabled() {
              return y(Ze);
            },
            children: (lt, Et) => {
              jt();
              var ue = Nt();
              Fe((Ct) => ge(ue, Ct), [() => t()("settingsDialog.uploadDestinationDelete") || "削除"]), fe(lt, ue);
            },
            $$slots: { default: !0 }
          });
        }
        var Pn = se(Mt, 2);
        {
          var rt = (Ze) => {
            {
              let lt = Ee(() => t()("settingsDialog.uploadDestinationBlossomTestInfoLabel") || "Blossom 接続テストの説明");
              Tr(Ze, {
                side: "top",
                sideOffset: 4,
                get ariaLabel() {
                  return y(lt);
                },
                children: (Et, ue) => {
                  var Ct = H1(), zr = R(Ct), hs = R(zr, !0);
                  O(zr);
                  var Ss = se(zr, 2), Xs = R(Ss, !0);
                  O(Ss), O(Ct), Fe(
                    (Cs, Js) => {
                      ge(hs, Cs), ge(Xs, Js);
                    },
                    [
                      () => t()("settingsDialog.uploadDestinationBlossomTestInfoNoUpload") || "このテストでは実際のファイルをアップロードせず、HEAD /upload でアップロード可否を確認します。",
                      () => t()("settingsDialog.uploadDestinationBlossomTestInfoAuthorization") || "Blossom の仕様上、確認に必要な署名で upload 権限が要求される場合があります。"
                    ]
                  ), fe(Et, Ct);
                },
                $$slots: { default: !0 }
              });
            }
          };
          gt(Pn, (Ze) => {
            y(Ie).protocol === "blossom" && Ze(rt);
          });
        }
        O(Rt);
        var at = se(Rt, 2);
        {
          var $t = (Ze) => {
            var lt = q1();
            let Et;
            var ue = R(lt, !0);
            O(lt), Fe(
              (Ct) => {
                Et = qa(lt, 1, "test-result svelte-odrb59", null, Et, {
                  error: !y(L).testResults[y(Ie).id].success
                }), ge(ue, Ct);
              },
              [
                () => y(L).testResults[y(Ie).id].message || (y(L).testResults[y(Ie).id].success ? t()("settingsDialog.uploadDestinationTestSuccess") || "接続テストに成功しました" : "")
              ]
            ), fe(Ze, lt);
          };
          gt(at, (Ze) => {
            (y(L).testResults[y(Ie).id]?.message || y(L).testResults[y(Ie).id]?.success) && Ze($t);
          });
        }
        O(yt);
        var wt = se(yt, 2);
        {
          var en = (Ze) => {
            a(Ze);
          };
          gt(wt, (Ze) => {
            y(p) && y(b) === y(Ie).id && Ze(en);
          });
        }
        Fe(
          (Ze, lt) => {
            ge(wn, y(Ie).name), ge(an, `${y(Ie).protocol ?? ""} / ${Ze ?? ""}`), ge(jn, lt);
          },
          [
            () => S(y(Ie).capabilities.maxUploadSize),
            () => k(y(Ie))
          ]
        ), fe(mt, ct);
      });
      var et = se(Ve, 2);
      {
        var bt = (mt) => {
          a(mt);
        }, tt = (mt) => {
          var Ie = V1(), ct = dt(Ie), yt = R(ct);
          Bt(yt, {
            variant: "default",
            shape: "rounded",
            onClick: V,
            children: (St, Dt) => {
              jt();
              var Qt = Nt();
              Fe((Ot) => ge(Qt, Ot), [() => t()("settingsDialog.uploadDestinationAdd") || "追加"]), fe(St, Qt);
            },
            $$slots: { default: !0 }
          });
          var zt = se(yt, 2);
          {
            let St = Ee(() => !y(te) || y(L).bud03Fetching);
            Bt(zt, {
              variant: "default",
              shape: "rounded",
              onClick: we,
              get disabled() {
                return y(St);
              },
              children: (Dt, Qt) => {
                jt();
                var Ot = Nt();
                Fe((kt) => ge(Ot, kt), [
                  () => y(L).bud03Fetching ? t()("settingsDialog.uploadDestinationBud03Fetching") || "BUD-03 取得中" : t()("settingsDialog.uploadDestinationBud03Fetch") || "BUD-03 から取得"
                ]), fe(Dt, Ot);
              },
              $$slots: { default: !0 }
            });
          }
          var Tt = se(zt, 2);
          {
            let St = Ee(() => !y(te) || y(L).bud03Publishing || !y(L).destinations.some((Dt) => Dt.protocol === "blossom" && Dt.enabled));
            Bt(Tt, {
              variant: "default",
              shape: "rounded",
              onClick: Le,
              get disabled() {
                return y(St);
              },
              children: (Dt, Qt) => {
                jt();
                var Ot = Nt();
                Fe((kt) => ge(Ot, kt), [
                  () => y(L).bud03Publishing ? t()("settingsDialog.uploadDestinationBud03Publishing") || "BUD-03 publish 中" : t()("settingsDialog.uploadDestinationBud03Publish") || "BUD-03 へ publish"
                ]), fe(Dt, Ot);
              },
              $$slots: { default: !0 }
            });
          }
          var rn = se(Tt, 2);
          {
            let St = Ee(() => t()("settingsDialog.uploadDestinationBud03InfoLabel") || "BUD-03 の説明");
            Tr(rn, {
              side: "top",
              get ariaLabel() {
                return y(St);
              },
              children: (Dt, Qt) => {
                var Ot = F1(), kt = R(Ot), an = R(kt, !0);
                O(kt);
                var xn = se(kt, 2), En = R(xn, !0);
                O(xn);
                var jn = se(xn, 2), ir = R(jn, !0);
                O(jn), O(Ot), Fe(
                  (Bn, Fn, $n) => {
                    ge(an, Bn), ge(En, Fn), ge(ir, $n);
                  },
                  [
                    () => t()("settingsDialog.uploadDestinationBud03InfoScope") || "BUD-03 は Blossom のアップロード先だけを kind 10063 の server tag として保存します。NIP-96 と Custom HTTP は publish 対象外です。",
                    () => t()("settingsDialog.uploadDestinationBud03InfoOrder") || "publish 時は有効な Blossom アップロード先をこの一覧の順番で保存し、先頭のアップロード先が優先されます。",
                    () => t()("settingsDialog.uploadDestinationBud03InfoFetch") || "BUD-03 から取得すると、Blossom のアップロード先だけを取得結果で置き換えます。"
                  ]
                ), fe(Dt, Ot);
              },
              $$slots: { default: !0 }
            });
          }
          O(ct);
          var Lt = se(ct, 2);
          {
            var wn = (St) => {
              var Dt = Z1(), Qt = R(Dt, !0);
              O(Dt), Fe(() => ge(Qt, y(L).bud03Status)), fe(St, Dt);
            };
            gt(Lt, (St) => {
              y(L).bud03Status && St(wn);
            });
          }
          fe(mt, Ie);
        };
        gt(et, (mt) => {
          y(p) && !y(b) ? mt(bt) : y(p) || mt(tt, 1);
        });
      }
      O(Se), fe(ke, Se);
    };
    gt(yn, (ke) => {
      y(h) && ke(on);
    });
  }
  O(Xe), Fe(
    (ke, Se) => {
      ge(pe, ke), ge(mn, Se);
    },
    [
      () => t()("settingsDialog.upload_destination") || "アップロード先",
      () => y(L).defaultDestination?.name || t()("settingsDialog.uploadDestinationNone") || "未設定"
    ]
  ), fe(n, Xe);
  var fn = nr(Ge);
  return i(), fn;
}
hd(["change", "input", "click"]);
rr(Rh, { rxNostr: {} }, [], [], { mode: "open" });
var Q1 = qe('<div class="xmark-icon svg-icon svelte-1ud3sov" aria-hidden="true"></div>'), Y1 = qe('<div class="help-icon svg-icon svelte-1ud3sov" aria-hidden="true"></div>'), X1 = qe('<div class="github-icon svg-icon svelte-1ud3sov" aria-hidden="true"></div>'), J1 = qe('<div class="rotate-right-icon svg-icon svelte-1ud3sov" aria-hidden="true"></div> <span class="btn-text svelte-1ud3sov"> </span>', 1), em = qe('<div class="setting-section svelte-1ud3sov"><div class="setting-row sw-update-row svelte-1ud3sov"><div class="setting-control svelte-1ud3sov"><!></div></div></div>'), tm = qe('<div class="lang-icon-btn svg-icon svelte-1ud3sov" aria-hidden="true"></div> <span class="btn-text svelte-1ud3sov"> </span>', 1), nm = qe("<!> <!> <!>", 1), rm = qe('<span class="form-error svelte-1ud3sov" role="alert"> </span>'), sm = qe('<span class="form-error svelte-1ud3sov" role="alert"> </span>'), im = qe('<div class="setting-section color-settings-section svelte-1ud3sov"><span class="setting-label color-settings-heading svelte-1ud3sov"> </span> <div class="color-setting-row svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><label class="setting-label svelte-1ud3sov" for="accent-color-input"> </label> <span class="setting-description svelte-1ud3sov"> </span></div> <div class="color-setting-controls svelte-1ud3sov"><input type="color" class="svelte-1ud3sov"/> <input id="accent-color-input" class="color-hex-input svelte-1ud3sov" type="text" inputmode="text" autocomplete="off"/></div></div> <!> <div class="color-setting-row svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><label class="setting-label svelte-1ud3sov" for="base-color-input"> </label> <span class="setting-description svelte-1ud3sov"> </span></div> <div class="color-setting-controls svelte-1ud3sov"><input type="color" class="svelte-1ud3sov"/> <input id="base-color-input" class="color-hex-input svelte-1ud3sov" type="text" inputmode="text" autocomplete="off" placeholder="#RRGGBB"/></div></div> <!> <!></div>'), om = qe('<option class="svelte-1ud3sov"> </option>'), am = qe('<span class="form-error svelte-1ud3sov" role="alert"> </span>'), lm = qe('<div class="external-nostr-client-custom-url svelte-1ud3sov"><label for="external-nostr-client-custom-url-input" class="setting-label svelte-1ud3sov"> </label> <span id="external-nostr-client-custom-url-description" class="setting-description svelte-1ud3sov"> </span> <input id="external-nostr-client-custom-url-input" type="url" inputmode="url" aria-describedby="external-nostr-client-custom-url-description" class="svelte-1ud3sov"/> <!></div>'), cm = qe('<div class="settings-header svelte-1ud3sov"><div class="first-row svelte-1ud3sov"><div class="site-title svelte-1ud3sov"><span class="site-name svelte-1ud3sov">eHagaki</span> <span class="cache-version svelte-1ud3sov"> </span></div> <div class="author-info svelte-1ud3sov"><span class="svelte-1ud3sov"> </span><a href="https://lokuyow.github.io/" target="_blank" rel="noopener noreferrer" class="svelte-1ud3sov"> </a></div></div> <div class="second-row svelte-1ud3sov"><!> <!> <div class="svelte-1ud3sov"><div class="zap-view-btn-group svelte-1ud3sov"><button class="zap-btn svelte-1ud3sov" data-npub="npub1a3pvwe2p3v7mnjz6hle63r628wl9w567aw7u23fzqs062v5vqcqqu3sgh3" data-note-id="naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30" data-relays="wss://relay.damus.io,wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me">Support</button> <span class="divider svelte-1ud3sov"></span> <button class="view-btn svelte-1ud3sov" data-title="Thanks for the Support!" data-nzv-id="naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30" data-zap-color-mode="true" data-relay-urls="wss://relay.damus.io,wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me">View</button></div></div></div></div> <div class="modal-body svelte-1ud3sov"><!> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><span class="setting-label svelte-1ud3sov">Language/言語</span> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <!> <!> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><span id="theme-mode-label" class="setting-label svelte-1ud3sov"> </span> <!></div></div> <!> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><span id="media-free-placement-label" class="setting-label svelte-1ud3sov"> </span> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="hide-mascot-flavor-group svelte-1ud3sov"><div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><span id="hide-mascot-label" class="setting-label svelte-1ud3sov"> </span> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><span id="hide-flavor-text-label" class="setting-label svelte-1ud3sov"> </span> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div></div> <div class="notification-group svelte-1ud3sov"><div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><span id="quote-notification-label" class="setting-label svelte-1ud3sov"> </span> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><span id="reply-notification-label" class="setting-label svelte-1ud3sov"> </span> <!></div></div> <div class="setting-control svelte-1ud3sov"><!></div></div></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row svelte-1ud3sov"><span id="client-tag-label" class="setting-label svelte-1ud3sov"> </span> <div class="setting-control svelte-1ud3sov"><!></div></div></div> <div class="setting-section svelte-1ud3sov"><div class="setting-row setting-row-with-note svelte-1ud3sov"><div class="setting-label-group svelte-1ud3sov"><div class="setting-label-row svelte-1ud3sov"><span id="external-nostr-client-label" class="setting-label svelte-1ud3sov"> </span> <!></div></div> <select class="setting-control external-nostr-client-select svelte-1ud3sov" id="external-nostr-client-select" aria-labelledby="external-nostr-client-label"></select></div> <!></div> <!></div>', 1);
const dm = {
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
    }.sw-update-btn.primary {height:54px;width:auto;padding:12px 10px 12px 8px;flex-shrink:0;}.sw-update-row.svelte-1ud3sov {justify-content:flex-end;}.sw-update-btn:disabled {opacity:0.6;}.theme-mode-group {display:flex;gap:4px;flex-wrap:nowrap;button {min-width:74px;min-height:50px;padding:8px 10px;font-size:0.875rem;font-weight:normal;}}.color-settings-section.svelte-1ud3sov {gap:10px;}.color-settings-heading.svelte-1ud3sov {margin-bottom:2px;}.color-setting-row.svelte-1ud3sov,
    .color-setting-controls.svelte-1ud3sov {display:flex;gap:10px;}.color-setting-row.svelte-1ud3sov {align-items:center;justify-content:space-between;}.color-setting-controls.svelte-1ud3sov {align-items:center;flex-shrink:0;}.color-setting-controls.svelte-1ud3sov input[type="color"]:where(.svelte-1ud3sov) {width:44px;height:44px;padding:2px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);cursor:pointer;}.color-hex-input.svelte-1ud3sov {width:104px;min-height:44px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.color-hex-input[aria-invalid="true"].svelte-1ud3sov {border-color:var(--danger);}.reset-theme-colors-btn.rounded {align-self:flex-end;min-height:44px;}

    @media (max-width: 430px) {.color-setting-row.svelte-1ud3sov {align-items:flex-start;flex-direction:column;}.color-setting-controls.svelte-1ud3sov {align-self:flex-end;}
    }`
};
function um(n, e) {
  tr(e, !0), $o(n, dm);
  const t = () => rs(Ao, "$_", d), r = () => rs(ng, "$swUpdateStatus", d), i = () => rs(rg, "$dbUpgradeBlocked", d), a = () => rs(Wp, "$locale", d), c = () => rs(Xp, "$swNeedRefresh", d), [d, h] = ko();
  let p = Ne(e, "show", 15, !1), b = Ne(e, "onClose", 7), m = Ne(e, "onRefreshRelaysAndProfile", 7, () => {
  }), v = Ne(e, "hostRelayConfigActive", 7, !1), T = Ne(e, "onOpenWelcomeDialog", 7, void 0), A = Ne(e, "rxNostr", 7, null);
  function $() {
    p(!1), b()?.();
  }
  Zp(() => p(), $, !0);
  let L = Ee(() => Ic(t())), P = Ee(() => Ic(t())), B = Ee(() => Cc(y(L), 2)), te = Ee(() => Cc(y(P), 2)), oe = Ut(gr(it.clientTagEnabled)), Y = Ut(gr(it.externalNostrClient)), ee = Ut(gr(it.externalNostrClientCustomUrl)), F = Ut(null), U = Ut(gr(it.quoteNotificationEnabled)), S = Ut(gr(it.replyNotificationEnabled)), k = Ut(gr(so.value));
  const x = "#1dbf73", H = "#808080";
  let V = Ut(gr(Ln.accentColor ?? x)), X = Ut(gr(Ln.baseColor ?? "")), K = Ut(null), re = Ut(null), de = Ut(!it.showMascot), ve = Ut(!it.showFlavorText), ce = Ee(() => y(de) || y(ve)), $e = Ee(() => Gp.value), we = Ee(() => Kp.value), Le = Ee(() => ka.value), Ge = Ee(() => Tc.value), Xe = Ee(() => r() === "installing"), De = Ee(i), Pe = Ee(() => Jp.required), nt = Ee(() => y(Pe) || r() === "ready" && !y(De));
  Dn(() => {
    y(k) !== so.value && so.set(y(k));
  });
  function pe() {
    if (y(Pe)) {
      eg();
      return;
    }
    tg(sg, (Se) => Tc.set(Se));
  }
  cd(() => {
    it.reload(), be(oe, it.clientTagEnabled, !0), be(Y, it.externalNostrClient, !0), be(ee, it.externalNostrClientCustomUrl, !0), be(U, it.quoteNotificationEnabled, !0), be(S, it.replyNotificationEnabled, !0), be(k, so.value, !0), Ln.reload(), be(V, Ln.accentColor ?? x, !0), be(X, Ln.baseColor ?? "", !0), be(de, !it.showMascot), be(ve, !it.showFlavorText), Vp(), !v() && ts.value?.pubkey && ts.value?.isAuthenticated && Sc(ts.value.pubkey);
  }), Dn(() => {
    be(oe, it.clientTagEnabled, !0);
  }), Dn(() => {
    y(Y) !== it.externalNostrClient && (it.externalNostrClient = y(Y));
  }), Dn(() => {
    if (y(ee) !== it.externalNostrClientCustomUrl) {
      const Se = Ac(y(ee));
      Se && (it.externalNostrClientCustomUrl = Se);
    }
  }), Dn(() => {
    be(U, it.quoteNotificationEnabled, !0);
  }), Dn(() => {
    be(S, it.replyNotificationEnabled, !0);
  }), Dn(() => {
    y(oe) !== it.clientTagEnabled && (it.clientTagEnabled = y(oe));
  }), Dn(() => {
    y(S) !== it.replyNotificationEnabled && (it.replyNotificationEnabled = y(S));
  }), Dn(() => {
    y(U) !== it.quoteNotificationEnabled && (it.quoteNotificationEnabled = y(U));
  }), Dn(() => {
    !y(de) !== it.showMascot && (it.showMascot = !y(de));
  }), Dn(() => {
    !y(ve) !== it.showFlavorText && (it.showFlavorText = !y(ve));
  }), Dn(() => {
    if (!p()) {
      ka.set(!1);
      return;
    }
    ts.value?.pubkey && ts.value?.isAuthenticated && Sc(ts.value.pubkey), (async () => (await ig(), d1(), window.nostrZap?.initTargets()))();
  });
  function ot() {
    it.locale = a() === "ja" ? "en" : "ja";
  }
  function mn(Se) {
    be(ee, Se, !0);
    const Ve = Ac(Se);
    be(
      F,
      Ve ? null : t()("settingsDialog.external_nostr_client_invalid_url"),
      !0
    ), Ve && (it.externalNostrClientCustomUrl = Ve);
  }
  function It(Se, Ve) {
    Se === "accent" ? be(V, Ve, !0) : be(X, Ve, !0);
    const et = mi(Ve);
    et && (Se === "accent" ? (be(V, Ln.setAccentColor(et) ?? Ve, !0), be(K, null)) : (be(X, Ln.setBaseColor(et) ?? Ve, !0), be(re, null)));
  }
  function Mn(Se) {
    const Ve = Se === "accent" ? y(V) : y(X), et = Se === "accent" ? Ln.accentColor : Ln.baseColor, tt = Se === "base" && !Ve && !et || mi(Ve) ? null : t()("settingsDialog.invalid_hex_color");
    Se === "accent" ? be(K, tt, !0) : be(re, tt, !0);
  }
  function yn(Se, Ve) {
    const et = mi(Ve);
    et && (Se === "accent" ? (be(V, Ln.setAccentColor(et) ?? et, !0), be(K, null)) : (be(X, Ln.setBaseColor(et) ?? et, !0), be(re, null)));
  }
  function on() {
    Ln.reset(), be(V, x), be(X, ""), be(K, null), be(re, null);
  }
  var fn = {
    get show() {
      return p();
    },
    set show(Se = !1) {
      p(Se), Re();
    },
    get onClose() {
      return b();
    },
    set onClose(Se) {
      b(Se), Re();
    },
    get onRefreshRelaysAndProfile() {
      return m();
    },
    set onRefreshRelaysAndProfile(Se = () => {
    }) {
      m(Se), Re();
    },
    get hostRelayConfigActive() {
      return v();
    },
    set hostRelayConfigActive(Se = !1) {
      v(Se), Re();
    },
    get onOpenWelcomeDialog() {
      return T();
    },
    set onOpenWelcomeDialog(Se = void 0) {
      T(Se), Re();
    },
    get rxNostr() {
      return A();
    },
    set rxNostr(Se = null) {
      A(Se), Re();
    }
  };
  {
    const Se = (bt) => {
      var tt = Pt(), mt = dt(tt);
      {
        const Ie = (ct, yt) => {
          let zt = () => yt?.().props;
          {
            let Tt = Ee(() => t()("global.close"));
            Bt(ct, wo(zt, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return y(Tt);
              },
              children: (rn, Lt) => {
                var wn = Q1();
                fe(rn, wn);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        tn(mt, () => ag, (ct, yt) => {
          yt(ct, { child: Ie, $$slots: { child: !0 } });
        });
      }
      fe(bt, tt);
    };
    let Ve = Ee(() => t()("settings") || "設定"), et = Ee(() => t()("settingsDialog.image_quality_setting"));
    og(n, {
      onOpenChange: (bt) => !bt && $(),
      get title() {
        return y(Ve);
      },
      get description() {
        return y(et);
      },
      contentClass: "settings-dialog",
      footerVariant: "close-button",
      get open() {
        return p();
      },
      set open(bt) {
        p(bt);
      },
      footer: Se,
      children: (bt, tt) => {
        var mt = cm(), Ie = dt(mt), ct = R(Ie), yt = R(ct), zt = se(R(yt), 2), Tt = R(zt, !0);
        O(zt), O(yt);
        var rn = se(yt, 2), Lt = R(rn), wn = R(Lt, !0);
        O(Lt);
        var St = se(Lt), Dt = R(St, !0);
        O(St), O(rn), O(ct);
        var Qt = se(ct, 2), Ot = R(Qt);
        Bt(Ot, {
          shape: "circle",
          variant: "default",
          className: "help-btn",
          onClick: () => {
            $(), T()?.();
          },
          ariaLabel: "Help",
          children: (Me, He) => {
            var Ae = Y1();
            fe(Me, Ae);
          },
          $$slots: { default: !0 }
        });
        var kt = se(Ot, 2);
        Bt(kt, {
          shape: "circle",
          variant: "default",
          className: "github-link-btn",
          onClick: () => window.open("https://github.com/Lokuyow/ehagaki", "_blank", "noopener"),
          ariaLabel: "GitHub Repository",
          children: (Me, He) => {
            var Ae = X1();
            fe(Me, Ae);
          },
          $$slots: { default: !0 }
        }), jt(2), O(Qt), O(Ie);
        var an = se(Ie, 2), xn = R(an);
        {
          var En = (Me) => {
            var He = em(), Ae = R(He), st = R(Ae), We = R(st);
            {
              let ft = Ee(() => y(Ge) || y(Xe) && !y(Pe) ? "loading" : ""), ht = Ee(() => y(Ge) || !y(nt)), Je = Ee(() => y(Pe) ? t()("staleAsset.reload") : t()("settingsDialog.update_app") || "アプリを更新");
              Bt(We, {
                variant: "primary",
                shape: "rounded",
                contentLayout: "iconText",
                get className() {
                  return `sw-update-btn ${y(ft) ?? ""}`;
                },
                onClick: pe,
                get disabled() {
                  return y(ht);
                },
                get ariaLabel() {
                  return y(Je);
                },
                children: (At, pt) => {
                  var Vt = Pt(), Yt = dt(Vt);
                  {
                    var ln = (cr) => {
                      {
                        let dr = Ee(() => y(Xe) ? t()("settingsDialog.sw_update_installing_short") || "インストール中..." : t()("settingsDialog.updating") || "更新中...");
                        Yp(cr, {
                          showLoader: !0,
                          loaderSize: 32,
                          get text() {
                            return y(dr);
                          }
                        });
                      }
                    }, bs = (cr) => {
                      var dr = J1(), Ht = se(dt(dr), 2), ze = R(Ht, !0);
                      O(Ht), Fe((Hr) => ge(ze, Hr), [
                        () => y(Pe) ? t()("staleAsset.reload") : t()("settingsDialog.update_app") || "更新"
                      ]), fe(cr, dr);
                    };
                    gt(Yt, (cr) => {
                      y(Ge) || y(Xe) && !y(Pe) ? cr(ln) : cr(bs, -1);
                    });
                  }
                  fe(At, Vt);
                },
                $$slots: { default: !0 }
              });
            }
            O(st), O(Ae), O(He), fe(Me, He);
          };
          gt(xn, (Me) => {
            (c() || y(Pe)) && Me(En);
          });
        }
        var jn = se(xn, 2), ir = R(jn), Bn = se(R(ir), 2), Fn = R(Bn);
        Bt(Fn, {
          variant: "default",
          shape: "rounded",
          contentLayout: "iconText",
          className: "lang-btn",
          onClick: ot,
          children: (Me, He) => {
            var Ae = tm(), st = se(dt(Ae), 2), We = R(st, !0);
            O(st), Fe((ft) => ge(We, ft), [() => t()("settingsDialog.change") || "変更"]), fe(Me, Ae);
          },
          $$slots: { default: !0 }
        }), O(Bn), O(ir), O(jn);
        var $n = se(jn, 2);
        Nh($n, {
          get compressionPairs() {
            return y(B);
          },
          get selectedCompression() {
            return it.imageQualityLevel;
          },
          onCompressionChange: (Me) => it.imageQualityLevel = Me,
          get videoCompressionPairs() {
            return y(te);
          },
          get selectedVideoCompression() {
            return it.videoQualityLevel;
          },
          onVideoCompressionChange: (Me) => it.videoQualityLevel = Me
        });
        var Yn = se($n, 2);
        Rh(Yn, {
          get rxNostr() {
            return A();
          }
        });
        var Un = se(Yn, 2), Rt = R(Un), Jt = R(Rt), Zn = R(Jt, !0);
        O(Jt);
        var Ke = se(Jt, 2);
        tn(Ke, () => uo, (Me, He) => {
          He(Me, {
            class: "setting-control theme-mode-group",
            name: "themeMode",
            orientation: "horizontal",
            get value() {
              return y(k);
            },
            "aria-labelledby": "theme-mode-label",
            onValueChange: (Ae) => {
              be(k, Ae, !0);
            },
            children: (Ae, st) => {
              var We = nm(), ft = dt(We);
              {
                let At = Ee(() => t()("settingsDialog.theme_system") || "システム");
                zs(ft, {
                  value: "system",
                  variant: "default",
                  shape: "rounded",
                  get ariaLabel() {
                    return y(At);
                  },
                  children: (pt, Vt) => {
                    jt();
                    var Yt = Nt();
                    Fe((ln) => ge(Yt, ln), [() => t()("settingsDialog.theme_system") || "システム"]), fe(pt, Yt);
                  },
                  $$slots: { default: !0 }
                });
              }
              var ht = se(ft, 2);
              {
                let At = Ee(() => t()("settingsDialog.theme_light") || "ライト");
                zs(ht, {
                  value: "light",
                  variant: "default",
                  shape: "rounded",
                  get ariaLabel() {
                    return y(At);
                  },
                  children: (pt, Vt) => {
                    jt();
                    var Yt = Nt();
                    Fe((ln) => ge(Yt, ln), [() => t()("settingsDialog.theme_light") || "ライト"]), fe(pt, Yt);
                  },
                  $$slots: { default: !0 }
                });
              }
              var Je = se(ht, 2);
              {
                let At = Ee(() => t()("settingsDialog.theme_dark") || "ダーク");
                zs(Je, {
                  value: "dark",
                  variant: "default",
                  shape: "rounded",
                  get ariaLabel() {
                    return y(At);
                  },
                  children: (pt, Vt) => {
                    jt();
                    var Yt = Nt();
                    Fe((ln) => ge(Yt, ln), [() => t()("settingsDialog.theme_dark") || "ダーク"]), fe(pt, Yt);
                  },
                  $$slots: { default: !0 }
                });
              }
              fe(Ae, We);
            },
            $$slots: { default: !0 }
          });
        }), O(Rt), O(Un);
        var Mt = se(Un, 2);
        {
          var Pn = (Me) => {
            var He = im(), Ae = R(He), st = R(Ae, !0);
            O(Ae);
            var We = se(Ae, 2), ft = R(We), ht = R(ft), Je = R(ht, !0);
            O(ht);
            var At = se(ht, 2), pt = R(At, !0);
            O(At), O(ft);
            var Vt = se(ft, 2), Yt = R(Vt);
            ss(Yt);
            var ln = se(Yt, 2);
            ss(ln), O(Vt), O(We);
            var bs = se(We, 2);
            {
              var cr = (Gt) => {
                var Vn = rm(), ur = R(Vn, !0);
                O(Vn), Fe(() => ge(ur, y(K))), fe(Gt, Vn);
              };
              gt(bs, (Gt) => {
                y(K) && Gt(cr);
              });
            }
            var dr = se(bs, 2), Ht = R(dr), ze = R(Ht), Hr = R(ze, !0);
            O(ze);
            var Ds = se(ze, 2), fi = R(Ds, !0);
            O(Ds), O(Ht);
            var pi = se(Ht, 2), ms = R(pi);
            ss(ms);
            var qr = se(ms, 2);
            ss(qr), O(pi), O(dr);
            var Gi = se(dr, 2);
            {
              var Go = (Gt) => {
                var Vn = sm(), ur = R(Vn, !0);
                O(Vn), Fe(() => ge(ur, y(re))), fe(Gt, Vn);
              };
              gt(Gi, (Gt) => {
                y(re) && Gt(Go);
              });
            }
            var Wo = se(Gi, 2);
            Bt(Wo, {
              variant: "default",
              shape: "rounded",
              className: "reset-theme-colors-btn",
              onClick: on,
              children: (Gt, Vn) => {
                jt();
                var ur = Nt();
                Fe((gi) => ge(ur, gi), [() => t()("settingsDialog.reset_colors")]), fe(Gt, ur);
              },
              $$slots: { default: !0 }
            }), O(He), Fe(
              (Gt, Vn, ur, gi, Ko, Qo, Yo, Xo, Wi, Jo, ea) => {
                ge(st, Gt), ge(Je, Vn), ge(pt, ur), vr(Yt, "aria-label", gi), yi(Yt, Ko), vr(ln, "aria-label", Qo), yi(ln, y(V)), vr(ln, "aria-invalid", y(K) ? "true" : "false"), ge(Hr, Yo), ge(fi, Xo), vr(ms, "aria-label", Wi), yi(ms, Jo), vr(qr, "aria-label", ea), yi(qr, y(X)), vr(qr, "aria-invalid", y(re) ? "true" : "false");
              },
              [
                () => t()("settingsDialog.color"),
                () => t()("settingsDialog.accent_color"),
                () => t()("settingsDialog.accent_color_description"),
                () => t()("settingsDialog.accent_color_picker"),
                () => mi(Ln.accentColor) ?? x,
                () => t()("settingsDialog.accent_color_hex"),
                () => t()("settingsDialog.base_color"),
                () => t()("settingsDialog.base_color_description"),
                () => t()("settingsDialog.base_color_picker"),
                () => mi(Ln.baseColor) ?? H,
                () => t()("settingsDialog.base_color_hex")
              ]
            ), br("input", Yt, (Gt) => yn("accent", Gt.currentTarget.value)), br("input", ln, (Gt) => It("accent", Gt.currentTarget.value)), Dc("blur", ln, () => Mn("accent")), br("input", ms, (Gt) => yn("base", Gt.currentTarget.value)), br("input", qr, (Gt) => It("base", Gt.currentTarget.value)), Dc("blur", qr, () => Mn("base")), fe(Me, He);
          };
          gt(Mt, (Me) => {
            Me(Pn);
          });
        }
        var rt = se(Mt, 2), at = R(rt), $t = R(at), wt = R($t, !0);
        O($t);
        var en = se($t, 2), Ze = R(en);
        tn(Ze, () => Jr, (Me, He) => {
          He(Me, {
            class: "bui-switch",
            "aria-labelledby": "media-free-placement-label",
            get checked() {
              return it.mediaFreePlacement;
            },
            set checked(Ae) {
              it.mediaFreePlacement = Ae;
            },
            children: (Ae, st) => {
              var We = Pt(), ft = dt(We);
              tn(ft, () => es, (ht, Je) => {
                Je(ht, { class: "bui-switch-thumb" });
              }), fe(Ae, We);
            },
            $$slots: { default: !0 }
          });
        }), O(en), O(at), O(rt);
        var lt = se(rt, 2), Et = R(lt), ue = R(Et), Ct = R(ue), zr = R(Ct), hs = R(zr), Ss = R(hs, !0);
        O(hs);
        var Xs = se(hs, 2);
        {
          let Me = Ee(() => t()("settingsDialog.hide_mascot_description"));
          Tr(Xs, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return y(Me);
            },
            children: (He, Ae) => {
              jt();
              var st = Nt();
              Fe((We) => ge(st, We), [
                () => t()("settingsDialog.hide_mascot_note") || "オンにすると左上のマスコットを隠し、フレーバーテキストもあわせて非表示にします。"
              ]), fe(He, st);
            },
            $$slots: { default: !0 }
          });
        }
        O(zr), O(Ct);
        var Cs = se(Ct, 2), Js = R(Cs);
        tn(Js, () => Jr, (Me, He) => {
          He(Me, {
            class: "bui-switch",
            "aria-labelledby": "hide-mascot-label",
            get checked() {
              return y(de);
            },
            set checked(Ae) {
              be(de, Ae, !0);
            },
            children: (Ae, st) => {
              var We = Pt(), ft = dt(We);
              tn(ft, () => es, (ht, Je) => {
                Je(ht, { class: "bui-switch-thumb" });
              }), fe(Ae, We);
            },
            $$slots: { default: !0 }
          });
        }), O(Cs), O(ue), O(Et);
        var Ri = se(Et, 2), Mi = R(Ri), ei = R(Mi), ti = R(ei), fs = R(ti), Ho = R(fs, !0);
        O(fs);
        var qo = se(fs, 2);
        {
          let Me = Ee(() => t()("settingsDialog.hide_flavor_text_description"));
          Tr(qo, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return y(Me);
            },
            children: (He, Ae) => {
              jt();
              var st = Nt();
              Fe((We) => ge(st, We), [
                () => y(de) ? t()("settingsDialog.hide_flavor_text_note_included") || "マスコットを非表示にしている間は、この設定も自動でオンになります。" : t()("settingsDialog.hide_flavor_text_note") || "オンにすると info のフレーバーテキストだけを隠します。success / error / tips は簡素な表示で残ります。"
              ]), fe(He, st);
            },
            $$slots: { default: !0 }
          });
        }
        O(ti), O(ei);
        var Bi = se(ei, 2), jo = R(Bi);
        {
          var Fo = (Me) => {
            var He = Pt(), Ae = dt(He);
            tn(Ae, () => Jr, (st, We) => {
              We(st, {
                class: "bui-switch",
                get checked() {
                  return y(ce);
                },
                disabled: !0,
                "aria-labelledby": "hide-flavor-text-label",
                children: (ft, ht) => {
                  var Je = Pt(), At = dt(Je);
                  tn(At, () => es, (pt, Vt) => {
                    Vt(pt, { class: "bui-switch-thumb" });
                  }), fe(ft, Je);
                },
                $$slots: { default: !0 }
              });
            }), fe(Me, He);
          }, Zo = (Me) => {
            var He = Pt(), Ae = dt(He);
            tn(Ae, () => Jr, (st, We) => {
              We(st, {
                class: "bui-switch",
                "aria-labelledby": "hide-flavor-text-label",
                get checked() {
                  return y(ve);
                },
                set checked(ft) {
                  be(ve, ft, !0);
                },
                children: (ft, ht) => {
                  var Je = Pt(), At = dt(Je);
                  tn(At, () => es, (pt, Vt) => {
                    Vt(pt, { class: "bui-switch-thumb" });
                  }), fe(ft, Je);
                },
                $$slots: { default: !0 }
              });
            }), fe(Me, He);
          };
          gt(jo, (Me) => {
            y(de) ? Me(Fo) : Me(Zo, -1);
          });
        }
        O(Bi), O(Mi), O(Ri), O(lt);
        var ni = se(lt, 2), ri = R(ni), Ui = R(ri), si = R(Ui), Pi = R(si), ii = R(Pi), or = R(ii, !0);
        O(ii);
        var ar = se(ii, 2);
        {
          let Me = Ee(() => t()("settingsDialog.quote_notification_description"));
          Tr(ar, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return y(Me);
            },
            children: (He, Ae) => {
              jt();
              var st = Nt();
              Fe((We) => ge(st, We), [
                () => t()("settingsDialog.quote_notification_note") || "引用投稿時、引用元の投稿者への通知をデフォルトで有効にします"
              ]), fe(He, st);
            },
            $$slots: { default: !0 }
          });
        }
        O(Pi), O(si);
        var oi = se(si, 2), Vo = R(oi);
        tn(Vo, () => Jr, (Me, He) => {
          He(Me, {
            class: "bui-switch",
            "aria-labelledby": "quote-notification-label",
            get checked() {
              return y(U);
            },
            set checked(Ae) {
              be(U, Ae, !0);
            },
            children: (Ae, st) => {
              var We = Pt(), ft = dt(We);
              tn(ft, () => es, (ht, Je) => {
                Je(ht, { class: "bui-switch-thumb" });
              }), fe(Ae, We);
            },
            $$slots: { default: !0 }
          });
        }), O(oi), O(Ui), O(ri);
        var lr = se(ri, 2), kn = R(lr), An = R(kn), zn = R(An), $r = R(zn), zi = R($r, !0);
        O($r);
        var Hi = se($r, 2);
        {
          let Me = Ee(() => t()("settingsDialog.reply_notification_description"));
          Tr(Hi, {
            side: "top",
            sideOffset: 8,
            get ariaLabel() {
              return y(Me);
            },
            children: (He, Ae) => {
              jt();
              var st = Nt();
              Fe((We) => ge(st, We), [
                () => t()("settingsDialog.reply_notification_note") || "リプライ時にリプライツリー内のほかの参加者をデフォルトで通知対象に含めます"
              ]), fe(He, st);
            },
            $$slots: { default: !0 }
          });
        }
        O(zn), O(An);
        var ai = se(An, 2), Is = R(ai);
        tn(Is, () => Jr, (Me, He) => {
          He(Me, {
            class: "bui-switch",
            "aria-labelledby": "reply-notification-label",
            get checked() {
              return y(S);
            },
            set checked(Ae) {
              be(S, Ae, !0);
            },
            children: (Ae, st) => {
              var We = Pt(), ft = dt(We);
              tn(ft, () => es, (ht, Je) => {
                Je(ht, { class: "bui-switch-thumb" });
              }), fe(Ae, We);
            },
            $$slots: { default: !0 }
          });
        }), O(ai), O(kn), O(lr), O(ni);
        var ps = se(ni, 2), li = R(ps), Hn = R(li), qi = R(Hn, !0);
        O(Hn);
        var ci = se(Hn, 2), Ts = R(ci);
        tn(Ts, () => Jr, (Me, He) => {
          He(Me, {
            class: "bui-switch",
            "aria-labelledby": "client-tag-label",
            get checked() {
              return y(oe);
            },
            set checked(Ae) {
              be(oe, Ae, !0);
            },
            children: (Ae, st) => {
              var We = Pt(), ft = dt(We);
              tn(ft, () => es, (ht, Je) => {
                Je(ht, { class: "bui-switch-thumb" });
              }), fe(Ae, We);
            },
            $$slots: { default: !0 }
          });
        }), O(ci), O(li), O(ps);
        var di = se(ps, 2), ui = R(di), kr = R(ui), ji = R(kr), gs = R(ji), Ls = R(gs, !0);
        O(gs);
        var Fi = se(gs, 2);
        {
          let Me = Ee(() => t()("settingsDialog.external_nostr_client_description"));
          Tr(Fi, {
            get ariaLabel() {
              return y(Me);
            },
            children: (He, Ae) => {
              jt();
              var st = Nt();
              Fe((We) => ge(st, We), [
                () => t()("settingsDialog.external_nostr_client_description")
              ]), fe(He, st);
            },
            $$slots: { default: !0 }
          });
        }
        O(ji), O(kr);
        var Ar = se(kr, 2);
        Dr(Ar, 21, () => Qp, Or, (Me, He) => {
          var Ae = om(), st = R(Ae, !0);
          O(Ae);
          var We = {};
          Fe(
            (ft) => {
              ge(st, ft), We !== (We = y(He)) && (Ae.value = (Ae.__value = y(He)) ?? "");
            },
            [
              () => y(He) === "custom" ? t()("settingsDialog.external_nostr_client_custom") : y(He) === "nostter" ? "nostter" : y(He) === "njump" ? "njump" : y(He)[0].toUpperCase() + y(He).slice(1)
            ]
          ), fe(Me, Ae);
        }), O(Ar);
        var Zi;
        dd(Ar), O(ui);
        var hi = se(ui, 2);
        {
          var Vi = (Me) => {
            var He = lm(), Ae = R(He), st = R(Ae, !0);
            O(Ae);
            var We = se(Ae, 2), ft = R(We, !0);
            O(We);
            var ht = se(We, 2);
            ss(ht);
            var Je = se(ht, 2);
            {
              var At = (pt) => {
                var Vt = am(), Yt = R(Vt, !0);
                O(Vt), Fe(() => ge(Yt, y(F))), fe(pt, Vt);
              };
              gt(Je, (pt) => {
                y(F) && pt(At);
              });
            }
            O(He), Fe(
              (pt, Vt) => {
                ge(st, pt), ge(ft, Vt), yi(ht, y(ee)), vr(ht, "aria-invalid", y(F) ? "true" : "false");
              },
              [
                () => t()("settingsDialog.external_nostr_client_custom_url"),
                () => t()("settingsDialog.external_nostr_client_custom_url_description")
              ]
            ), br("input", ht, (pt) => mn(pt.currentTarget.value)), fe(Me, He);
          };
          gt(hi, (Me) => {
            y(Y) === "custom" && Me(Vi);
          });
        }
        O(di);
        var vs = se(di, 2);
        Oh(vs, {
          get relayConfig() {
            return y(we);
          },
          get showRelays() {
            return y(Le);
          },
          onToggleShowRelays: () => ka.set(!y(Le)),
          get onRefreshRelaysAndProfile() {
            return m();
          },
          get hostRelayConfigActive() {
            return v();
          }
        }), O(an), Fe(
          (Me, He, Ae, st, We, ft, ht, Je, At, pt) => {
            ge(Tt, y($e) ? `v${y($e)}` : ""), ge(wn, Me), ge(Dt, He), ge(Zn, Ae), ge(wt, st), ge(Ss, We), ge(Ho, ft), ge(or, ht), ge(zi, Je), ge(qi, At), ge(Ls, pt), Zi !== (Zi = y(Y)) && (Ar.value = (Ar.__value = y(Y)) ?? "", ud(Ar, y(Y)));
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
        ), br("change", Ar, (Me) => {
          be(Y, Me.currentTarget.value, !0), be(F, null);
        }), fe(bt, mt);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var ke = nr(fn);
  return h(), ke;
}
hd(["input", "change"]);
rr(
  um,
  {
    show: {},
    onClose: {},
    onRefreshRelaysAndProfile: {},
    hostRelayConfigActive: {},
    onOpenWelcomeDialog: {},
    rxNostr: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  um as default
};
