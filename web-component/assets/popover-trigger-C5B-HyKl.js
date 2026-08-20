import { aX as At, aY as ft, cG as Dt, a_ as vt, e4 as J, b0 as Ft, a$ as Ht, e5 as gt, b2 as It, e6 as Tt, e7 as nt, e8 as Nt, e9 as xt, ea as ht, b6 as h, b5 as St, a8 as n, aa as j, b7 as _, b8 as L, eb as Et, bl as pt, ec as kt, bb as z, bc as yt, b9 as E, ba as q, ed as dt } from "./App-B-vAJu8d.js";
import { aQ as A, b as p, a as o, aP as g, b5 as mt, a_ as bt, a$ as N, b0 as x, b1 as v, b2 as Ct, b3 as s, b4 as wt, b6 as G, n as st, b7 as Q, b8 as at } from "./entry-y-09yyZ0.js";
import { F as Vt } from "./floating-layer-anchor-CJNFt9R8.js";
const it = St({
  component: "popover",
  parts: ["root", "trigger", "content", "close", "overlay"]
}), lt = new At("Popover.Root");
class Pt {
  static create(t) {
    return lt.set(new Pt(t));
  }
  opts;
  #t = A(null);
  get contentNode() {
    return o(this.#t);
  }
  set contentNode(t) {
    p(this.#t, t, !0);
  }
  contentPresence;
  #e = A(null);
  get triggerNode() {
    return o(this.#e);
  }
  set triggerNode(t) {
    p(this.#e, t, !0);
  }
  #r = A(null);
  get overlayNode() {
    return o(this.#r);
  }
  set overlayNode(t) {
    p(this.#r, t, !0);
  }
  overlayPresence;
  #s = A(!1);
  get openedViaHover() {
    return o(this.#s);
  }
  set openedViaHover(t) {
    p(this.#s, t, !0);
  }
  #i = A(!1);
  get hasInteractedWithContent() {
    return o(this.#i);
  }
  set hasInteractedWithContent(t) {
    p(this.#i, t, !0);
  }
  #a = A(!1);
  get hoverCooldown() {
    return o(this.#a);
  }
  set hoverCooldown(t) {
    p(this.#a, t, !0);
  }
  #c = A(0);
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
  #r = A(!1);
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
    if (this.opts.disabled.current || !this.opts.openOnHover.current || J(t) || (p(this.#r, !0), this.#i(), this.root.cancelDelayedClose(), this.root.opts.open.current || this.root.hoverCooldown)) return;
    const i = this.opts.openDelay.current;
    i <= 0 ? this.root.handleHoverOpen() : this.#t = this.domContext.setTimeout(
      () => {
        this.root.handleHoverOpen(), this.#t = null;
      },
      i
    );
  }
  onpointerleave(t) {
    this.opts.disabled.current || this.opts.openOnHover.current && (J(t) || (p(this.#r, !1), this.#s(), this.root.hoverCooldown = !1));
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
    J(t) || this.root.cancelDelayedClose();
  }
  onpointerleave(t) {
    J(t);
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
var Wt = at("<div><div><!></div></div>"), Kt = at("<div><div><!></div></div>");
function Mt(U, t) {
  const i = mt();
  bt(t, !0);
  let a = n(t, "child", 7), y = n(t, "children", 7), m = n(t, "ref", 15, null), f = n(t, "id", 23, () => L(i)), w = n(t, "forceMount", 7, !1), D = n(t, "onOpenAutoFocus", 7, _), P = n(t, "onCloseAutoFocus", 7, _), F = n(t, "onEscapeKeydown", 7, _), H = n(t, "onInteractOutside", 7, _), k = n(t, "trapFocus", 7, !0), I = n(t, "preventScroll", 7, !1), O = n(t, "customAnchor", 7, null), S = n(t, "style", 7), r = yt(t, [
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
    customAnchor: h(() => O())
  }), V = g(() => z(r, c.props)), X = g(() => k() && c.shouldTrapFocus);
  function Y(e) {
    c.shouldTrapFocus || e.preventDefault(), D()(e);
  }
  var Z = {
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
    set id(e = L(i)) {
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
    set onOpenAutoFocus(e = _) {
      D(e), s();
    },
    get onCloseAutoFocus() {
      return P();
    },
    set onCloseAutoFocus(e = _) {
      P(e), s();
    },
    get onEscapeKeydown() {
      return F();
    },
    set onEscapeKeydown(e = _) {
      F(e), s();
    },
    get onInteractOutside() {
      return H();
    },
    set onInteractOutside(e = _) {
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
      return O();
    },
    set customAnchor(e = null) {
      O(e), s();
    },
    get style() {
      return S();
    },
    set style(e) {
      S(e), s();
    }
  }, b = N(), C = x(b);
  {
    var W = (e) => {
      Et(e, pt(() => o(V), () => c.popperProps, {
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
          return o(X);
        },
        get preventScroll() {
          return I();
        },
        loop: !0,
        forceMount: !0,
        get customAnchor() {
          return O();
        },
        onOpenAutoFocus: Y,
        get onCloseAutoFocus() {
          return P();
        },
        get shouldRender() {
          return c.shouldRender;
        },
        popper: ($, K) => {
          let tt = () => K?.().props, M = () => K?.().wrapperProps;
          const R = g(() => z(tt(), { style: dt("popover") }, { style: S() }));
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
              q(l, () => ({ ...M() }));
              var d = G(l);
              q(d, () => ({ ...o(R) }));
              var T = G(d);
              E(T, () => y() ?? st), Q(d), Q(l), v(u, l);
            };
            j(et, (u) => {
              a() ? u(ot) : u(rt, -1);
            });
          }
          v($, B);
        },
        $$slots: { popper: !0 }
      }));
    }, Ot = (e) => {
      kt(e, pt(() => o(V), () => c.popperProps, {
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
          return o(X);
        },
        get preventScroll() {
          return I();
        },
        loop: !0,
        forceMount: !1,
        get customAnchor() {
          return O();
        },
        onOpenAutoFocus: Y,
        get onCloseAutoFocus() {
          return P();
        },
        get shouldRender() {
          return c.shouldRender;
        },
        popper: ($, K) => {
          let tt = () => K?.().props, M = () => K?.().wrapperProps;
          const R = g(() => z(tt(), { style: dt("popover") }, { style: S() }));
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
              var l = Kt();
              q(l, () => ({ ...M() }));
              var d = G(l);
              q(d, () => ({ ...o(R) }));
              var T = G(d);
              E(T, () => y() ?? st), Q(d), Q(l), v(u, l);
            };
            j(et, (u) => {
              a() ? u(ot) : u(rt, -1);
            });
          }
          v($, B);
        },
        $$slots: { popper: !0 }
      }));
    };
    j(C, (e) => {
      w() ? e(W) : w() || e(Ot, 1);
    });
  }
  return v(U, b), Ct(Z);
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
function Bt(U, t) {
  const i = mt();
  bt(t, !0);
  let a = n(t, "children", 7), y = n(t, "child", 7), m = n(t, "id", 23, () => L(i)), f = n(t, "ref", 15, null), w = n(t, "type", 7, "button"), D = n(t, "disabled", 7, !1), P = n(t, "openOnHover", 7, !1), F = n(t, "openDelay", 7, 700), H = n(t, "closeDelay", 7, 300), k = yt(t, [
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
    openOnHover: h(() => P()),
    openDelay: h(() => F()),
    closeDelay: h(() => H())
  }), O = g(() => z(k, I.props, { type: w() }));
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
    set id(r = L(i)) {
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
      return P();
    },
    set openOnHover(r = !1) {
      P(r), s();
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
  return Vt(U, {
    get id() {
      return m();
    },
    get ref() {
      return I.opts.ref;
    },
    children: (r, c) => {
      var V = N(), X = x(V);
      {
        var Y = (b) => {
          var C = N(), W = x(C);
          E(W, y, () => ({ props: o(O) })), v(b, C);
        }, Z = (b) => {
          var C = Rt();
          q(C, () => ({ ...o(O) }));
          var W = G(C);
          E(W, () => a() ?? st), Q(C), v(b, C);
        };
        j(X, (b) => {
          y() ? b(Y) : b(Z, -1);
        });
      }
      v(r, V);
    },
    $$slots: { default: !0 }
  }), Ct(S);
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
  Pt as P,
  Bt as a,
  Mt as b
};
