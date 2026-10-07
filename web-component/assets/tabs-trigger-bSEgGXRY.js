import { b6 as nt, b7 as F, ba as rt, cr as it, b9 as dt, b8 as lt, be as st, bc as ct, e7 as tt, e8 as ht, bf as ut, N as o, bh as g, Q as G, bi as et, bj as x, bk as S, bl as N, bm as O, bn as z } from "./App-Ck79ufzA.js";
import { aS as f, a as s, b as R, aT as ot, aO as vt, aK as gt, b7 as B, b0 as K, b1 as P, b2 as M, b3 as T, b4 as U, b5 as a, b6 as j, b8 as L, n as Q, b9 as W, ba as q } from "./entry-CLkZn30j.js";
const E = ut({
  component: "tabs",
  parts: ["root", "list", "trigger", "content"]
}), H = new nt("Tabs.Root");
class X {
  static create(t) {
    return H.set(new X(t));
  }
  opts;
  attachment;
  rovingFocusGroup;
  #t = ot(gt([]));
  get triggerIds() {
    return s(this.#t);
  }
  set triggerIds(t) {
    R(this.#t, t, !0);
  }
  valueToTriggerId = new tt();
  valueToContentId = new tt();
  constructor(t) {
    this.opts = t, this.attachment = F(t.ref), this.rovingFocusGroup = new ht({
      candidateAttr: E.trigger,
      rootNode: this.opts.ref,
      loop: this.opts.loop,
      orientation: this.opts.orientation
    });
  }
  registerTrigger(t, n) {
    return this.triggerIds.push(t), this.valueToTriggerId.set(n, t), () => {
      this.triggerIds = this.triggerIds.filter((d) => d !== t), this.valueToTriggerId.delete(n);
    };
  }
  registerContent(t, n) {
    return this.valueToContentId.set(n, t), () => {
      this.valueToContentId.delete(n);
    };
  }
  setValue(t) {
    this.opts.value.current = t;
  }
  #e = f(() => ({
    id: this.opts.id.current,
    "data-orientation": this.opts.orientation.current,
    [E.root]: "",
    ...this.attachment
  }));
  get props() {
    return s(this.#e);
  }
  set props(t) {
    R(this.#e, t);
  }
}
class Y {
  static create(t) {
    return new Y(t, H.get());
  }
  opts;
  root;
  attachment;
  #t = f(() => this.root.opts.disabled.current);
  constructor(t, n) {
    this.opts = t, this.root = n, this.attachment = F(t.ref);
  }
  #e = f(() => ({
    id: this.opts.id.current,
    role: "tablist",
    "aria-orientation": this.root.opts.orientation.current,
    "data-orientation": this.root.opts.orientation.current,
    [E.list]: "",
    "data-disabled": rt(s(this.#t)),
    ...this.attachment
  }));
  get props() {
    return s(this.#e);
  }
  set props(t) {
    R(this.#e, t);
  }
}
class Z {
  static create(t) {
    return new Z(t, H.get());
  }
  opts;
  root;
  attachment;
  #t = ot(0);
  #e = f(() => this.root.opts.value.current === this.opts.value.current);
  #r = f(() => this.opts.disabled.current || this.root.opts.disabled.current);
  #o = f(() => this.root.valueToContentId.get(this.opts.value.current));
  constructor(t, n) {
    this.opts = t, this.root = n, this.attachment = F(t.ref), it([() => this.opts.id.current, () => this.opts.value.current], ([d, c]) => this.root.registerTrigger(d, c)), vt(() => {
      this.root.triggerIds.length, s(this.#e) || !this.root.opts.value.current ? R(this.#t, 0) : R(this.#t, -1);
    }), this.onfocus = this.onfocus.bind(this), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this);
  }
  #i() {
    this.root.opts.value.current !== this.opts.value.current && this.root.setValue(this.opts.value.current);
  }
  onfocus(t) {
    this.root.opts.activationMode.current !== "automatic" || s(this.#r) || this.#i();
  }
  onclick(t) {
    s(this.#r) || this.#i();
  }
  onkeydown(t) {
    if (!s(this.#r)) {
      if (t.key === dt || t.key === lt) {
        t.preventDefault(), this.#i();
        return;
      }
      this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, t);
    }
  }
  #s = f(() => ({
    id: this.opts.id.current,
    role: "tab",
    "data-state": at(s(this.#e)),
    "data-value": this.opts.value.current,
    "data-orientation": this.root.opts.orientation.current,
    "data-disabled": rt(s(this.#r)),
    "aria-selected": ct(s(this.#e)),
    "aria-controls": s(this.#o),
    [E.trigger]: "",
    disabled: st(s(this.#r)),
    tabindex: s(this.#t),
    //
    onclick: this.onclick,
    onfocus: this.onfocus,
    onkeydown: this.onkeydown,
    ...this.attachment
  }));
  get props() {
    return s(this.#s);
  }
  set props(t) {
    R(this.#s, t);
  }
}
class $ {
  static create(t) {
    return new $(t, H.get());
  }
  opts;
  root;
  attachment;
  #t = f(() => this.root.opts.value.current === this.opts.value.current);
  #e = f(() => this.root.valueToTriggerId.get(this.opts.value.current));
  constructor(t, n) {
    this.opts = t, this.root = n, this.attachment = F(t.ref), it([() => this.opts.id.current, () => this.opts.value.current], ([d, c]) => this.root.registerContent(d, c));
  }
  #r = f(() => ({
    id: this.opts.id.current,
    role: "tabpanel",
    hidden: st(!s(this.#t)),
    tabindex: 0,
    "data-value": this.opts.value.current,
    "data-state": at(s(this.#t)),
    "aria-labelledby": s(this.#e),
    "data-orientation": this.root.opts.orientation.current,
    [E.content]: "",
    ...this.attachment
  }));
  get props() {
    return s(this.#r);
  }
  set props(t) {
    R(this.#r, t);
  }
}
function at(C) {
  return C ? "active" : "inactive";
}
var ft = q("<div><!></div>");
function bt(C, t) {
  const n = B();
  K(t, !0);
  let d = o(t, "id", 23, () => x(n)), c = o(t, "ref", 15, null), u = o(t, "value", 15, ""), h = o(t, "onValueChange", 7, et), b = o(t, "orientation", 7, "horizontal"), _ = o(t, "loop", 7, !0), p = o(t, "activationMode", 7, "automatic"), y = o(t, "disabled", 7, !1), I = o(t, "children", 7), m = o(t, "child", 7), V = z(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "id",
    "ref",
    "value",
    "onValueChange",
    "orientation",
    "loop",
    "activationMode",
    "disabled",
    "children",
    "child"
  ]);
  const k = X.create({
    id: g(() => d()),
    value: g(() => u(), (e) => {
      u(e), h()(e);
    }),
    orientation: g(() => b()),
    loop: g(() => _()),
    activationMode: g(() => p()),
    disabled: g(() => y()),
    ref: g(() => c(), (e) => c(e))
  }), l = f(() => O(V, k.props));
  var r = {
    get id() {
      return d();
    },
    set id(e = x(n)) {
      d(e), a();
    },
    get ref() {
      return c();
    },
    set ref(e = null) {
      c(e), a();
    },
    get value() {
      return u();
    },
    set value(e = "") {
      u(e), a();
    },
    get onValueChange() {
      return h();
    },
    set onValueChange(e = et) {
      h(e), a();
    },
    get orientation() {
      return b();
    },
    set orientation(e = "horizontal") {
      b(e), a();
    },
    get loop() {
      return _();
    },
    set loop(e = !0) {
      _(e), a();
    },
    get activationMode() {
      return p();
    },
    set activationMode(e = "automatic") {
      p(e), a();
    },
    get disabled() {
      return y();
    },
    set disabled(e = !1) {
      y(e), a();
    },
    get children() {
      return I();
    },
    set children(e) {
      I(e), a();
    },
    get child() {
      return m();
    },
    set child(e) {
      m(e), a();
    }
  }, v = P(), i = M(v);
  {
    var w = (e) => {
      var A = P(), J = M(A);
      S(J, m, () => ({ props: s(l) })), T(e, A);
    }, D = (e) => {
      var A = ft();
      N(A, () => ({ ...s(l) }));
      var J = L(A);
      S(J, () => I() ?? Q), W(A), T(e, A);
    };
    G(i, (e) => {
      m() ? e(w) : e(D, -1);
    });
  }
  return T(C, v), U(r);
}
j(
  bt,
  {
    id: {},
    ref: {},
    value: {},
    onValueChange: {},
    orientation: {},
    loop: {},
    activationMode: {},
    disabled: {},
    children: {},
    child: {}
  },
  [],
  [],
  { mode: "open" }
);
var pt = q("<div><!></div>");
function mt(C, t) {
  const n = B();
  K(t, !0);
  let d = o(t, "children", 7), c = o(t, "child", 7), u = o(t, "id", 23, () => x(n)), h = o(t, "ref", 15, null), b = o(t, "value", 7), _ = z(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "id",
    "ref",
    "value"
  ]);
  const p = $.create({
    value: g(() => b()),
    id: g(() => u()),
    ref: g(() => h(), (r) => h(r))
  }), y = f(() => O(_, p.props));
  var I = {
    get children() {
      return d();
    },
    set children(r) {
      d(r), a();
    },
    get child() {
      return c();
    },
    set child(r) {
      c(r), a();
    },
    get id() {
      return u();
    },
    set id(r = x(n)) {
      u(r), a();
    },
    get ref() {
      return h();
    },
    set ref(r = null) {
      h(r), a();
    },
    get value() {
      return b();
    },
    set value(r) {
      b(r), a();
    }
  }, m = P(), V = M(m);
  {
    var k = (r) => {
      var v = P(), i = M(v);
      S(i, c, () => ({ props: s(y) })), T(r, v);
    }, l = (r) => {
      var v = pt();
      N(v, () => ({ ...s(y) }));
      var i = L(v);
      S(i, () => d() ?? Q), W(v), T(r, v);
    };
    G(V, (r) => {
      c() ? r(k) : r(l, -1);
    });
  }
  return T(C, m), U(I);
}
j(mt, { children: {}, child: {}, id: {}, ref: {}, value: {} }, [], [], { mode: "open" });
var Tt = q("<div><!></div>");
function _t(C, t) {
  const n = B();
  K(t, !0);
  let d = o(t, "child", 7), c = o(t, "children", 7), u = o(t, "id", 23, () => x(n)), h = o(t, "ref", 15, null), b = z(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "child",
    "children",
    "id",
    "ref"
  ]);
  const _ = Y.create({
    id: g(() => u()),
    ref: g(() => h(), (l) => h(l))
  }), p = f(() => O(b, _.props));
  var y = {
    get child() {
      return d();
    },
    set child(l) {
      d(l), a();
    },
    get children() {
      return c();
    },
    set children(l) {
      c(l), a();
    },
    get id() {
      return u();
    },
    set id(l = x(n)) {
      u(l), a();
    },
    get ref() {
      return h();
    },
    set ref(l = null) {
      h(l), a();
    }
  }, I = P(), m = M(I);
  {
    var V = (l) => {
      var r = P(), v = M(r);
      S(v, d, () => ({ props: s(p) })), T(l, r);
    }, k = (l) => {
      var r = Tt();
      N(r, () => ({ ...s(p) }));
      var v = L(r);
      S(v, () => c() ?? Q), W(r), T(l, r);
    };
    G(m, (l) => {
      d() ? l(V) : l(k, -1);
    });
  }
  return T(C, I), U(y);
}
j(_t, { child: {}, children: {}, id: {}, ref: {} }, [], [], { mode: "open" });
var yt = q("<button><!></button>");
function It(C, t) {
  const n = B();
  K(t, !0);
  let d = o(t, "child", 7), c = o(t, "children", 7), u = o(t, "disabled", 7, !1), h = o(t, "id", 23, () => x(n)), b = o(t, "type", 7, "button"), _ = o(t, "value", 7), p = o(t, "ref", 15, null), y = z(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "child",
    "children",
    "disabled",
    "id",
    "type",
    "value",
    "ref"
  ]);
  const I = Z.create({
    id: g(() => h()),
    disabled: g(() => u() ?? !1),
    value: g(() => _()),
    ref: g(() => p(), (i) => p(i))
  }), m = f(() => O(y, I.props, { type: b() }));
  var V = {
    get child() {
      return d();
    },
    set child(i) {
      d(i), a();
    },
    get children() {
      return c();
    },
    set children(i) {
      c(i), a();
    },
    get disabled() {
      return u();
    },
    set disabled(i = !1) {
      u(i), a();
    },
    get id() {
      return h();
    },
    set id(i = x(n)) {
      h(i), a();
    },
    get type() {
      return b();
    },
    set type(i = "button") {
      b(i), a();
    },
    get value() {
      return _();
    },
    set value(i) {
      _(i), a();
    },
    get ref() {
      return p();
    },
    set ref(i = null) {
      p(i), a();
    }
  }, k = P(), l = M(k);
  {
    var r = (i) => {
      var w = P(), D = M(w);
      S(D, d, () => ({ props: s(m) })), T(i, w);
    }, v = (i) => {
      var w = yt();
      N(w, () => ({ ...s(m) }));
      var D = L(w);
      S(D, () => c() ?? Q), W(w), T(i, w);
    };
    G(l, (i) => {
      d() ? i(r) : i(v, -1);
    });
  }
  return T(C, k), U(V);
}
j(
  It,
  {
    child: {},
    children: {},
    disabled: {},
    id: {},
    type: {},
    value: {},
    ref: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  _t as T,
  It as a,
  bt as b,
  mt as c
};
