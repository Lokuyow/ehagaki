import { aJ as _t, aK as ft, ck as Dt, aM as vt, dB as Z, aO as Ft, aN as Ht, dC as gt, aQ as It, dD as Tt, dE as nt, dF as Nt, dG as xt, dH as ht, aU as h, aT as St, I as n, K as X, aV as A, aW as j, dI as Et, b6 as pt, dJ as kt, aZ as Y, a_ as yt, aX as E, aY as J, dK as dt } from "./App-BBD-wmht.js";
import { aS as _, b as p, a as o, aR as g, b7 as mt, b0 as Ct, b1 as N, b2 as x, b3 as v, b4 as bt, b5 as s, b6 as wt, b8 as q, n as st, b9 as G, ba as at } from "./entry-BhDgNuDQ.js";
import { F as Kt } from "./floating-layer-anchor-DqH77l2m.js";
const it = St({
  component: "popover",
  parts: ["root", "trigger", "content", "close", "overlay"]
}), lt = new _t("Popover.Root");
class Ot {
  static create(t) {
    return lt.set(new Ot(t));
  }
  opts;
  #t = _(null);
  get contentNode() {
    return o(this.#t);
  }
  set contentNode(t) {
    p(this.#t, t, !0);
  }
  contentPresence;
  #e = _(null);
  get triggerNode() {
    return o(this.#e);
  }
  set triggerNode(t) {
    p(this.#e, t, !0);
  }
  #r = _(null);
  get overlayNode() {
    return o(this.#r);
  }
  set overlayNode(t) {
    p(this.#r, t, !0);
  }
  overlayPresence;
  #s = _(!1);
  get openedViaHover() {
    return o(this.#s);
  }
  set openedViaHover(t) {
    p(this.#s, t, !0);
  }
  #i = _(!1);
  get hasInteractedWithContent() {
    return o(this.#i);
  }
  set hasInteractedWithContent(t) {
    p(this.#i, t, !0);
  }
  #a = _(!1);
  get hoverCooldown() {
    return o(this.#a);
  }
  set hoverCooldown(t) {
    p(this.#a, t, !0);
  }
  #c = _(0);
  get closeDelay() {
    return o(this.#c);
  }
  set closeDelay(t) {
    p(this.#c, t, !0);
  }
  #o = null;
  #l = null;
  constructor(t) {
    this.opts = t, this.contentPresence = new ht({
      ref: h(() => this.contentNode),
      open: this.opts.open,
      onComplete: () => {
        this.opts.onOpenChangeComplete.current(this.opts.open.current);
      }
    }), this.overlayPresence = new ht({ ref: h(() => this.overlayNode), open: this.opts.open }), vt(() => this.opts.open.current, (i) => {
      i || (this.openedViaHover = !1, this.hasInteractedWithContent = !1, this.#n());
    });
  }
  setDomContext(t) {
    this.#l = t;
  }
  #n() {
    this.#o !== null && this.#l && (this.#l.clearTimeout(this.#o), this.#o = null);
  }
  toggleOpen() {
    this.#n(), this.opts.open.current = !this.opts.open.current;
  }
  handleClose() {
    this.#n(), this.opts.open.current && (this.opts.open.current = !1);
  }
  handleHoverOpen() {
    this.#n(), !this.opts.open.current && (this.openedViaHover = !0, this.opts.open.current = !0);
  }
  handleHoverClose() {
    this.opts.open.current && this.openedViaHover && !this.hasInteractedWithContent && (this.opts.open.current = !1);
  }
  handleDelayedHoverClose() {
    this.opts.open.current && (!this.openedViaHover || this.hasInteractedWithContent || (this.#n(), this.closeDelay <= 0 ? this.opts.open.current = !1 : this.#l && (this.#o = this.#l.setTimeout(
      () => {
        this.openedViaHover && !this.hasInteractedWithContent && (this.opts.open.current = !1), this.#o = null;
      },
      this.closeDelay
    ))));
  }
  cancelDelayedClose() {
    this.#n();
  }
  markInteraction() {
    this.hasInteractedWithContent = !0, this.#n();
  }
}
class ct {
  static create(t) {
    return new ct(t, lt.get());
  }
  opts;
  root;
  attachment;
  domContext;
  #t = null;
  #e = null;
  #r = _(!1);
  constructor(t, i) {
    this.opts = t, this.root = i, this.attachment = ft(this.opts.ref, (a) => this.root.triggerNode = a), this.domContext = new Dt(t.ref), this.root.setDomContext(this.domContext), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this), vt(() => this.opts.closeDelay.current, (a) => {
      this.root.closeDelay = a;
    });
  }
  #s() {
    this.#t !== null && (this.domContext.clearTimeout(this.#t), this.#t = null);
  }
  #i() {
    this.#e !== null && (this.domContext.clearTimeout(this.#e), this.#e = null);
  }
  #a() {
    this.#s(), this.#i();
  }
  onpointerenter(t) {
    if (this.opts.disabled.current || !this.opts.openOnHover.current || Z(t) || (p(this.#r, !0), this.#i(), this.root.cancelDelayedClose(), this.root.opts.open.current || this.root.hoverCooldown)) return;
    const i = this.opts.openDelay.current;
    i <= 0 ? this.root.handleHoverOpen() : this.#t = this.domContext.setTimeout(
      () => {
        this.root.handleHoverOpen(), this.#t = null;
      },
      i
    );
  }
  onpointerleave(t) {
    this.opts.disabled.current || this.opts.openOnHover.current && (Z(t) || (p(this.#r, !1), this.#s(), this.root.hoverCooldown = !1));
  }
  onclick(t) {
    if (!this.opts.disabled.current && t.button === 0) {
      if (this.#a(), o(this.#r) && this.root.opts.open.current && this.root.openedViaHover) {
        this.root.openedViaHover = !1, this.root.hasInteractedWithContent = !0;
        return;
      }
      o(this.#r) && this.opts.openOnHover.current && this.root.opts.open.current && (this.root.hoverCooldown = !0), this.root.hoverCooldown && !this.root.opts.open.current && (this.root.hoverCooldown = !1), this.root.toggleOpen();
    }
  }
  onkeydown(t) {
    this.opts.disabled.current || (t.key === Ft || t.key === Ht) && (t.preventDefault(), this.#a(), this.root.toggleOpen());
  }
  #c() {
    if (this.root.opts.open.current && this.root.contentNode?.id)
      return this.root.contentNode?.id;
  }
  #o = g(() => ({
    id: this.opts.id.current,
    "aria-haspopup": "dialog",
    "aria-expanded": It(this.root.opts.open.current),
    "data-state": gt(this.root.opts.open.current),
    "aria-controls": this.#c(),
    [it.trigger]: "",
    disabled: this.opts.disabled.current,
    //
    onkeydown: this.onkeydown,
    onclick: this.onclick,
    onpointerenter: this.onpointerenter,
    onpointerleave: this.onpointerleave,
    ...this.attachment
  }));
  get props() {
    return o(this.#o);
  }
  set props(t) {
    p(this.#o, t);
  }
}
class ut {
  static create(t) {
    return new ut(t, lt.get());
  }
  opts;
  root;
  attachment;
  constructor(t, i) {
    this.opts = t, this.root = i, this.attachment = ft(this.opts.ref, (a) => this.root.contentNode = a), this.onpointerdown = this.onpointerdown.bind(this), this.onfocusin = this.onfocusin.bind(this), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this), new Tt({
      triggerNode: () => this.root.triggerNode,
      contentNode: () => this.root.contentNode,
      enabled: () => this.root.opts.open.current && this.root.openedViaHover && !this.root.hasInteractedWithContent,
      onPointerExit: () => {
        this.root.handleDelayedHoverClose();
      }
    });
  }
  onpointerdown(t) {
    this.root.markInteraction();
  }
  onfocusin(t) {
    const i = t.target;
    nt(i) && Nt(i) && this.root.markInteraction();
  }
  onpointerenter(t) {
    Z(t) || this.root.cancelDelayedClose();
  }
  onpointerleave(t) {
    Z(t);
  }
  onInteractOutside = (t) => {
    if (this.opts.onInteractOutside.current(t), t.defaultPrevented || !nt(t.target)) return;
    const i = t.target.closest(it.selector("trigger"));
    if (!(i && i === this.root.triggerNode)) {
      if (this.opts.customAnchor.current) {
        if (nt(this.opts.customAnchor.current)) {
          if (this.opts.customAnchor.current.contains(t.target)) return;
        } else if (typeof this.opts.customAnchor.current == "string") {
          const a = document.querySelector(this.opts.customAnchor.current);
          if (a && a.contains(t.target)) return;
        }
      }
      this.root.handleClose();
    }
  };
  onEscapeKeydown = (t) => {
    this.opts.onEscapeKeydown.current(t), !t.defaultPrevented && this.root.handleClose();
  };
  get shouldRender() {
    return this.root.contentPresence.shouldRender;
  }
  get shouldTrapFocus() {
    return !(this.root.openedViaHover && !this.root.hasInteractedWithContent);
  }
  #t = g(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return o(this.#t);
  }
  set snippetProps(t) {
    p(this.#t, t);
  }
  #e = g(() => ({
    id: this.opts.id.current,
    tabindex: -1,
    "data-state": gt(this.root.opts.open.current),
    ...xt(this.root.contentPresence.transitionStatus),
    [it.content]: "",
    style: { pointerEvents: "auto", contain: "layout style" },
    onpointerdown: this.onpointerdown,
    onfocusin: this.onfocusin,
    onpointerenter: this.onpointerenter,
    onpointerleave: this.onpointerleave,
    ...this.attachment
  }));
  get props() {
    return o(this.#e);
  }
  set props(t) {
    p(this.#e, t);
  }
  popperProps = {
    onInteractOutside: this.onInteractOutside,
    onEscapeKeydown: this.onEscapeKeydown
  };
}
var Vt = at("<div><div><!></div></div>"), Wt = at("<div><div><!></div></div>");
function Mt(z, t) {
  const i = mt();
  Ct(t, !0);
  let a = n(t, "child", 7), y = n(t, "children", 7), m = n(t, "ref", 15, null), f = n(t, "id", 23, () => j(i)), w = n(t, "forceMount", 7, !1), D = n(t, "onOpenAutoFocus", 7, A), O = n(t, "onCloseAutoFocus", 7, A), F = n(t, "onEscapeKeydown", 7, A), H = n(t, "onInteractOutside", 7, A), k = n(t, "trapFocus", 7, !0), I = n(t, "preventScroll", 7, !1), P = n(t, "customAnchor", 7, null), S = n(t, "style", 7), r = yt(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "child",
    "children",
    "ref",
    "id",
    "forceMount",
    "onOpenAutoFocus",
    "onCloseAutoFocus",
    "onEscapeKeydown",
    "onInteractOutside",
    "trapFocus",
    "preventScroll",
    "customAnchor",
    "style"
  ]);
  const c = ut.create({
    id: h(() => f()),
    ref: h(() => m(), (e) => m(e)),
    onInteractOutside: h(() => H()),
    onEscapeKeydown: h(() => F()),
    customAnchor: h(() => P())
  }), K = g(() => Y(r, c.props)), Q = g(() => k() && c.shouldTrapFocus);
  function U(e) {
    c.shouldTrapFocus || e.preventDefault(), D()(e);
  }
  var L = {
    get child() {
      return a();
    },
    set child(e) {
      a(e), s();
    },
    get children() {
      return y();
    },
    set children(e) {
      y(e), s();
    },
    get ref() {
      return m();
    },
    set ref(e = null) {
      m(e), s();
    },
    get id() {
      return f();
    },
    set id(e = j(i)) {
      f(e), s();
    },
    get forceMount() {
      return w();
    },
    set forceMount(e = !1) {
      w(e), s();
    },
    get onOpenAutoFocus() {
      return D();
    },
    set onOpenAutoFocus(e = A) {
      D(e), s();
    },
    get onCloseAutoFocus() {
      return O();
    },
    set onCloseAutoFocus(e = A) {
      O(e), s();
    },
    get onEscapeKeydown() {
      return F();
    },
    set onEscapeKeydown(e = A) {
      F(e), s();
    },
    get onInteractOutside() {
      return H();
    },
    set onInteractOutside(e = A) {
      H(e), s();
    },
    get trapFocus() {
      return k();
    },
    set trapFocus(e = !0) {
      k(e), s();
    },
    get preventScroll() {
      return I();
    },
    set preventScroll(e = !1) {
      I(e), s();
    },
    get customAnchor() {
      return P();
    },
    set customAnchor(e = null) {
      P(e), s();
    },
    get style() {
      return S();
    },
    set style(e) {
      S(e), s();
    }
  }, C = N(), b = x(C);
  {
    var V = (e) => {
      Et(e, pt(() => o(K), () => c.popperProps, {
        get ref() {
          return c.opts.ref;
        },
        get enabled() {
          return c.root.opts.open.current;
        },
        get id() {
          return f();
        },
        get trapFocus() {
          return o(Q);
        },
        get preventScroll() {
          return I();
        },
        loop: !0,
        forceMount: !0,
        get customAnchor() {
          return P();
        },
        onOpenAutoFocus: U,
        get onCloseAutoFocus() {
          return O();
        },
        get shouldRender() {
          return c.shouldRender;
        },
        popper: ($, W) => {
          let tt = () => W?.().props, M = () => W?.().wrapperProps;
          const R = g(() => Y(tt(), { style: dt("popover") }, { style: S() }));
          var B = N(), et = x(B);
          {
            var ot = (u) => {
              var l = N(), d = x(l);
              {
                let T = g(() => ({
                  props: o(R),
                  wrapperProps: M(),
                  ...c.snippetProps
                }));
                E(d, a, () => o(T));
              }
              v(u, l);
            }, rt = (u) => {
              var l = Vt();
              J(l, () => ({ ...M() }));
              var d = q(l);
              J(d, () => ({ ...o(R) }));
              var T = q(d);
              E(T, () => y() ?? st), G(d), G(l), v(u, l);
            };
            X(et, (u) => {
              a() ? u(ot) : u(rt, -1);
            });
          }
          v($, B);
        },
        $$slots: { popper: !0 }
      }));
    }, Pt = (e) => {
      kt(e, pt(() => o(K), () => c.popperProps, {
        get ref() {
          return c.opts.ref;
        },
        get open() {
          return c.root.opts.open.current;
        },
        get id() {
          return f();
        },
        get trapFocus() {
          return o(Q);
        },
        get preventScroll() {
          return I();
        },
        loop: !0,
        forceMount: !1,
        get customAnchor() {
          return P();
        },
        onOpenAutoFocus: U,
        get onCloseAutoFocus() {
          return O();
        },
        get shouldRender() {
          return c.shouldRender;
        },
        popper: ($, W) => {
          let tt = () => W?.().props, M = () => W?.().wrapperProps;
          const R = g(() => Y(tt(), { style: dt("popover") }, { style: S() }));
          var B = N(), et = x(B);
          {
            var ot = (u) => {
              var l = N(), d = x(l);
              {
                let T = g(() => ({
                  props: o(R),
                  wrapperProps: M(),
                  ...c.snippetProps
                }));
                E(d, a, () => o(T));
              }
              v(u, l);
            }, rt = (u) => {
              var l = Wt();
              J(l, () => ({ ...M() }));
              var d = q(l);
              J(d, () => ({ ...o(R) }));
              var T = q(d);
              E(T, () => y() ?? st), G(d), G(l), v(u, l);
            };
            X(et, (u) => {
              a() ? u(ot) : u(rt, -1);
            });
          }
          v($, B);
        },
        $$slots: { popper: !0 }
      }));
    };
    X(b, (e) => {
      w() ? e(V) : w() || e(Pt, 1);
    });
  }
  return v(z, C), bt(L);
}
wt(
  Mt,
  {
    child: {},
    children: {},
    ref: {},
    id: {},
    forceMount: {},
    onOpenAutoFocus: {},
    onCloseAutoFocus: {},
    onEscapeKeydown: {},
    onInteractOutside: {},
    trapFocus: {},
    preventScroll: {},
    customAnchor: {},
    style: {}
  },
  [],
  [],
  { mode: "open" }
);
var Rt = at("<button><!></button>");
function Bt(z, t) {
  const i = mt();
  Ct(t, !0);
  let a = n(t, "children", 7), y = n(t, "child", 7), m = n(t, "id", 23, () => j(i)), f = n(t, "ref", 15, null), w = n(t, "type", 7, "button"), D = n(t, "disabled", 7, !1), O = n(t, "openOnHover", 7, !1), F = n(t, "openDelay", 7, 700), H = n(t, "closeDelay", 7, 300), k = yt(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "id",
    "ref",
    "type",
    "disabled",
    "openOnHover",
    "openDelay",
    "closeDelay"
  ]);
  const I = ct.create({
    id: h(() => m()),
    ref: h(() => f(), (r) => f(r)),
    disabled: h(() => !!D()),
    openOnHover: h(() => O()),
    openDelay: h(() => F()),
    closeDelay: h(() => H())
  }), P = g(() => Y(k, I.props, { type: w() }));
  var S = {
    get children() {
      return a();
    },
    set children(r) {
      a(r), s();
    },
    get child() {
      return y();
    },
    set child(r) {
      y(r), s();
    },
    get id() {
      return m();
    },
    set id(r = j(i)) {
      m(r), s();
    },
    get ref() {
      return f();
    },
    set ref(r = null) {
      f(r), s();
    },
    get type() {
      return w();
    },
    set type(r = "button") {
      w(r), s();
    },
    get disabled() {
      return D();
    },
    set disabled(r = !1) {
      D(r), s();
    },
    get openOnHover() {
      return O();
    },
    set openOnHover(r = !1) {
      O(r), s();
    },
    get openDelay() {
      return F();
    },
    set openDelay(r = 700) {
      F(r), s();
    },
    get closeDelay() {
      return H();
    },
    set closeDelay(r = 300) {
      H(r), s();
    }
  };
  return Kt(z, {
    get id() {
      return m();
    },
    get ref() {
      return I.opts.ref;
    },
    children: (r, c) => {
      var K = N(), Q = x(K);
      {
        var U = (C) => {
          var b = N(), V = x(b);
          E(V, y, () => ({ props: o(P) })), v(C, b);
        }, L = (C) => {
          var b = Rt();
          J(b, () => ({ ...o(P) }));
          var V = q(b);
          E(V, () => a() ?? st), G(b), v(C, b);
        };
        X(Q, (C) => {
          y() ? C(U) : C(L, -1);
        });
      }
      v(r, K);
    },
    $$slots: { default: !0 }
  }), bt(S);
}
wt(
  Bt,
  {
    children: {},
    child: {},
    id: {},
    ref: {},
    type: {},
    disabled: {},
    openOnHover: {},
    openDelay: {},
    closeDelay: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  Ot as P,
  Bt as a,
  Mt as b
};
