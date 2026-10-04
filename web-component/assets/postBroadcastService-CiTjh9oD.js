import { I as _, dN as Nt, aU as Z, K as re, aV as ve, aW as Ee, aX as X, aY as Se, aZ as Oe, a_ as ze, dO as $t, dP as jt, dQ as zt, cF as qt, dR as Bt, dS as Kt, b6 as je, dT as Vt, dU as vt, dV as Wt, dW as Yt, H as De, b3 as J, cb as Ve, cO as et, cL as tt, cM as nt, cN as rt, cP as It, M as at, N as me, Q as lt, aF as ct, V as dt, $ as ut, ds as xt, dt as Qt, du as Jt, dw as _e, bi as Zt, bh as Xt, W as ft, aD as Gt, O as gt, dz as en, c$ as tn, cJ as Ct, dx as St, dy as nn, dr as rn, cY as on, cZ as sn, dX as an, c_ as ln, c4 as Et, dY as ht, w as Pt, i as cn, k as dn, a as un, ag as pn, ah as vn, y as fn, z as gn, A as hn, P as kt, x as yn, G as mn } from "./App-C8cvgCUG.js";
import { b7 as Ze, b0 as le, b1 as V, b2 as N, b3 as C, b4 as ce, b5 as R, b6 as de, a as p, b8 as z, n as ae, b9 as $, aS as Y, ba as K, aq as bn, bl as At, aO as $e, b as B, aT as fe, bf as ne, bh as We, Z as ee, bi as ge, ap as yt, ay as Tt, bj as Ye, aK as ot, bk as se, bQ as wn, bX as _n, b$ as Rn, bI as In } from "./entry-B5mD5NTa.js";
import { D as xn, a as Cn } from "./DialogWrapper-BFdSo4_O.js";
var Sn = K("<div><!></div>");
function En(r, e) {
  const t = Ze();
  le(e, !0);
  let o = _(e, "child", 7), n = _(e, "children", 7), s = _(e, "ref", 15, null), c = _(e, "id", 23, () => Ee(t)), i = _(e, "disabled", 7, !1), f = _(e, "onSelect", 7, ve), u = _(e, "closeOnSelect", 7, !0), v = ze(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "child",
    "children",
    "ref",
    "id",
    "disabled",
    "onSelect",
    "closeOnSelect"
  ]);
  const a = Nt.create({
    id: Z(() => c()),
    disabled: Z(() => i()),
    onSelect: Z(() => f()),
    ref: Z(() => s(), (g) => s(g)),
    closeOnSelect: Z(() => u())
  }), w = Y(() => Oe(v, a.props));
  var l = {
    get child() {
      return o();
    },
    set child(g) {
      o(g), R();
    },
    get children() {
      return n();
    },
    set children(g) {
      n(g), R();
    },
    get ref() {
      return s();
    },
    set ref(g = null) {
      s(g), R();
    },
    get id() {
      return c();
    },
    set id(g = Ee(t)) {
      c(g), R();
    },
    get disabled() {
      return i();
    },
    set disabled(g = !1) {
      i(g), R();
    },
    get onSelect() {
      return f();
    },
    set onSelect(g = ve) {
      f(g), R();
    },
    get closeOnSelect() {
      return u();
    },
    set closeOnSelect(g = !0) {
      u(g), R();
    }
  }, x = V(), d = N(x);
  {
    var I = (g) => {
      var H = V(), M = N(H);
      X(M, o, () => ({ props: p(w) })), C(g, H);
    }, T = (g) => {
      var H = Sn();
      Se(H, () => ({ ...p(w) }));
      var M = z(H);
      X(M, () => n() ?? ae), $(H), C(g, H);
    };
    re(d, (g) => {
      o() ? g(I) : g(T, -1);
    });
  }
  return C(r, x), ce(l);
}
de(
  En,
  {
    child: {},
    children: {},
    ref: {},
    id: {},
    disabled: {},
    onSelect: {},
    closeOnSelect: {}
  },
  [],
  [],
  { mode: "open" }
);
var Pn = K("<div><!></div>");
function Ht(r, e) {
  const t = Ze();
  le(e, !0);
  let o = _(e, "ref", 15, null), n = _(e, "id", 23, () => Ee(t)), s = _(e, "child", 7), c = _(e, "children", 7), i = ze(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "id",
    "child",
    "children"
  ]);
  const f = $t.create({
    id: Z(() => n()),
    ref: Z(() => o(), (d) => o(d))
  }), u = Y(() => Oe(i, f.props));
  var v = {
    get ref() {
      return o();
    },
    set ref(d = null) {
      o(d), R();
    },
    get id() {
      return n();
    },
    set id(d = Ee(t)) {
      n(d), R();
    },
    get child() {
      return s();
    },
    set child(d) {
      s(d), R();
    },
    get children() {
      return c();
    },
    set children(d) {
      c(d), R();
    }
  }, a = V(), w = N(a);
  {
    var l = (d) => {
      var I = V(), T = N(I);
      X(T, s, () => ({ props: p(u) })), C(d, I);
    }, x = (d) => {
      var I = Pn();
      Se(I, () => ({ ...p(u) }));
      var T = z(I);
      X(T, () => c() ?? ae), $(I), C(d, I);
    };
    re(w, (d) => {
      s() ? d(l) : d(x, -1);
    });
  }
  return C(r, a), ce(v);
}
de(Ht, { ref: {}, id: {}, child: {}, children: {} }, [], [], { mode: "open" });
function Ot(r, e) {
  le(e, !0);
  let t = _(e, "open", 15, !1), o = _(e, "dir", 7, "ltr"), n = _(e, "onOpenChange", 7, ve), s = _(e, "onOpenChangeComplete", 7, ve), c = _(e, "_internal_variant", 7, "dropdown-menu"), i = _(e, "_internal_should_skip_exit_animation", 7, void 0), f = _(e, "children", 7);
  const u = jt.create({
    variant: Z(() => c()),
    dir: Z(() => o()),
    // debugMode: boxWith(() => debugMode),
    onClose: () => {
      t(!1), n()(!1);
    },
    shouldSkipExitAnimation: () => i()?.() ?? !1
  });
  zt.create(
    {
      open: Z(() => t(), (a) => {
        t(a), n()(a);
      }),
      onOpenChangeComplete: Z(() => s())
    },
    u
  );
  var v = {
    get open() {
      return t();
    },
    set open(a = !1) {
      t(a), R();
    },
    get dir() {
      return o();
    },
    set dir(a = "ltr") {
      o(a), R();
    },
    get onOpenChange() {
      return n();
    },
    set onOpenChange(a = ve) {
      n(a), R();
    },
    get onOpenChangeComplete() {
      return s();
    },
    set onOpenChangeComplete(a = ve) {
      s(a), R();
    },
    get _internal_variant() {
      return c();
    },
    set _internal_variant(a = "dropdown-menu") {
      c(a), R();
    },
    get _internal_should_skip_exit_animation() {
      return i();
    },
    set _internal_should_skip_exit_animation(a = void 0) {
      i(a), R();
    },
    get children() {
      return f();
    },
    set children(a) {
      f(a), R();
    }
  };
  return qt(r, {
    children: (a, w) => {
      var l = V(), x = N(l);
      X(x, () => f() ?? ae), C(a, l);
    },
    $$slots: { default: !0 }
  }), ce(v);
}
de(
  Ot,
  {
    open: {},
    dir: {},
    onOpenChange: {},
    onOpenChangeComplete: {},
    _internal_variant: {},
    _internal_should_skip_exit_animation: {},
    children: {}
  },
  [],
  [],
  { mode: "open" }
);
var kn = K("<div><div><!></div></div>"), An = K("<div><div><!></div></div>");
function Dt(r, e) {
  const t = Ze();
  le(e, !0);
  let o = _(e, "id", 23, () => Ee(t)), n = _(e, "child", 7), s = _(e, "children", 7), c = _(e, "ref", 15, null), i = _(e, "loop", 7, !0), f = _(e, "onInteractOutside", 7, ve), u = _(e, "onEscapeKeydown", 7, ve), v = _(e, "onCloseAutoFocus", 7, ve), a = _(e, "forceMount", 7, !1), w = _(e, "trapFocus", 7, !1), l = _(e, "style", 7), x = ze(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "id",
    "child",
    "children",
    "ref",
    "loop",
    "onInteractOutside",
    "onEscapeKeydown",
    "onCloseAutoFocus",
    "forceMount",
    "trapFocus",
    "style"
  ]);
  const d = Bt.create({
    id: Z(() => o()),
    loop: Z(() => i()),
    ref: Z(() => c(), (m) => c(m)),
    onCloseAutoFocus: Z(() => v())
  }), I = Y(() => Oe(x, d.props));
  function T(m) {
    if (d.handleInteractOutside(m), !m.defaultPrevented && (f()(m), !m.defaultPrevented)) {
      if (m.target && m.target instanceof Element) {
        const h = `[${d.parentMenu.root.getBitsAttr("sub-content")}]`;
        if (m.target.closest(h)) return;
      }
      d.parentMenu.onClose();
    }
  }
  function g(m) {
    u()(m), !m.defaultPrevented && d.parentMenu.onClose();
  }
  var H = {
    get id() {
      return o();
    },
    set id(m = Ee(t)) {
      o(m), R();
    },
    get child() {
      return n();
    },
    set child(m) {
      n(m), R();
    },
    get children() {
      return s();
    },
    set children(m) {
      s(m), R();
    },
    get ref() {
      return c();
    },
    set ref(m = null) {
      c(m), R();
    },
    get loop() {
      return i();
    },
    set loop(m = !0) {
      i(m), R();
    },
    get onInteractOutside() {
      return f();
    },
    set onInteractOutside(m = ve) {
      f(m), R();
    },
    get onEscapeKeydown() {
      return u();
    },
    set onEscapeKeydown(m = ve) {
      u(m), R();
    },
    get onCloseAutoFocus() {
      return v();
    },
    set onCloseAutoFocus(m = ve) {
      v(m), R();
    },
    get forceMount() {
      return a();
    },
    set forceMount(m = !1) {
      a(m), R();
    },
    get trapFocus() {
      return w();
    },
    set trapFocus(m = !1) {
      w(m), R();
    },
    get style() {
      return l();
    },
    set style(m) {
      l(m), R();
    }
  }, M = V(), F = N(M);
  {
    var W = (m) => {
      Kt(m, je(() => p(I), () => d.popperProps, {
        get ref() {
          return d.opts.ref;
        },
        get enabled() {
          return d.parentMenu.opts.open.current;
        },
        onInteractOutside: T,
        onEscapeKeydown: g,
        get trapFocus() {
          return w();
        },
        get loop() {
          return i();
        },
        forceMount: !0,
        get id() {
          return o();
        },
        get shouldRender() {
          return d.shouldRender;
        },
        popper: (S, y) => {
          let b = () => y?.().props, A = () => y?.().wrapperProps;
          const P = Y(() => Oe(b(), { style: vt("dropdown-menu") }, { style: l() }));
          var L = V(), O = N(L);
          {
            var E = (U) => {
              var q = V(), G = N(q);
              {
                let te = Y(() => ({
                  props: p(P),
                  wrapperProps: A(),
                  ...d.snippetProps
                }));
                X(G, n, () => p(te));
              }
              C(U, q);
            }, D = (U) => {
              var q = kn();
              Se(q, () => ({ ...A() }));
              var G = z(q);
              Se(G, () => ({ ...p(P) }));
              var te = z(G);
              X(te, () => s() ?? ae), $(G), $(q), C(U, q);
            };
            re(O, (U) => {
              n() ? U(E) : U(D, -1);
            });
          }
          C(S, L);
        },
        $$slots: { popper: !0 }
      }));
    }, Q = (m) => {
      Vt(m, je(() => p(I), () => d.popperProps, {
        get ref() {
          return d.opts.ref;
        },
        get open() {
          return d.parentMenu.opts.open.current;
        },
        onInteractOutside: T,
        onEscapeKeydown: g,
        get trapFocus() {
          return w();
        },
        get loop() {
          return i();
        },
        forceMount: !1,
        get id() {
          return o();
        },
        get shouldRender() {
          return d.shouldRender;
        },
        popper: (S, y) => {
          let b = () => y?.().props, A = () => y?.().wrapperProps;
          const P = Y(() => Oe(b(), { style: vt("dropdown-menu") }, { style: l() }));
          var L = V(), O = N(L);
          {
            var E = (U) => {
              var q = V(), G = N(q);
              {
                let te = Y(() => ({
                  props: p(P),
                  wrapperProps: A(),
                  ...d.snippetProps
                }));
                X(G, n, () => p(te));
              }
              C(U, q);
            }, D = (U) => {
              var q = An();
              Se(q, () => ({ ...A() }));
              var G = z(q);
              Se(G, () => ({ ...p(P) }));
              var te = z(G);
              X(te, () => s() ?? ae), $(G), $(q), C(U, q);
            };
            re(O, (U) => {
              n() ? U(E) : U(D, -1);
            });
          }
          C(S, L);
        },
        $$slots: { popper: !0 }
      }));
    };
    re(F, (m) => {
      a() ? m(W) : a() || m(Q, 1);
    });
  }
  return C(r, M), ce(H);
}
de(
  Dt,
  {
    id: {},
    child: {},
    children: {},
    ref: {},
    loop: {},
    onInteractOutside: {},
    onEscapeKeydown: {},
    onCloseAutoFocus: {},
    forceMount: {},
    trapFocus: {},
    style: {}
  },
  [],
  [],
  { mode: "open" }
);
var Tn = K("<button><!></button>");
function st(r, e) {
  const t = Ze();
  le(e, !0);
  let o = _(e, "id", 23, () => Ee(t)), n = _(e, "ref", 15, null), s = _(e, "child", 7), c = _(e, "children", 7), i = _(e, "disabled", 7, !1), f = _(e, "type", 7, "button"), u = ze(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "id",
    "ref",
    "child",
    "children",
    "disabled",
    "type"
  ]);
  const v = Wt.create({
    id: Z(() => o()),
    disabled: Z(() => i() ?? !1),
    ref: Z(() => n(), (l) => n(l))
  }), a = Y(() => Oe(u, v.props, { type: f() }));
  var w = {
    get id() {
      return o();
    },
    set id(l = Ee(t)) {
      o(l), R();
    },
    get ref() {
      return n();
    },
    set ref(l = null) {
      n(l), R();
    },
    get child() {
      return s();
    },
    set child(l) {
      s(l), R();
    },
    get children() {
      return c();
    },
    set children(l) {
      c(l), R();
    },
    get disabled() {
      return i();
    },
    set disabled(l = !1) {
      i(l), R();
    },
    get type() {
      return f();
    },
    set type(l = "button") {
      f(l), R();
    }
  };
  return Yt(r, {
    get id() {
      return o();
    },
    get ref() {
      return v.opts.ref;
    },
    children: (l, x) => {
      var d = V(), I = N(d);
      {
        var T = (H) => {
          var M = V(), F = N(M);
          X(F, s, () => ({ props: p(a) })), C(H, M);
        }, g = (H) => {
          var M = Tn();
          Se(M, () => ({ ...p(a) }));
          var F = z(M);
          X(F, () => c() ?? ae), $(M), C(H, M);
        };
        re(I, (H) => {
          s() ? H(T) : H(g, -1);
        });
      }
      C(l, d);
    },
    $$slots: { default: !0 }
  }), ce(w);
}
de(
  st,
  {
    id: {},
    ref: {},
    child: {},
    children: {},
    disabled: {},
    type: {}
  },
  [],
  [],
  { mode: "open" }
);
var Hn = K('<div class="more-icon svg-icon"></div>'), On = K("<!> <!>", 1), Dn = K('<div class="more-icon svg-icon"></div>'), Mn = K('<div class="post-history-menu-timestamp"> </div> <!>', 1), Un = K('<div class="post-history-menu-body"><!> <!></div>'), Fn = K("<!> <!>", 1), Ln = K('<button><div class="more-icon svg-icon"></div></button>'), Nn = K("<!> <!>", 1), $n = K('<button type="button" aria-haspopup="menu"><div class="more-icon svg-icon"></div></button>');
const jn = {
  hash: "svelte-ea4c9b",
  code: `.post-history-menu-trigger {aspect-ratio:1;border-radius:50%;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));background-color:var(
            --post-history-preview-footer-surface,
            var(--dialog-bg)
        );}.post-history-menu-trigger .more-icon {width:22px;height:22px;mask-image:var(--ehagaki-icon-6d6f72655f766572745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);--svg: currentColor;}.post-history-menu-trigger.post-history-heading-menu-trigger {min-height:50px;padding:0;border-radius:0;--btn-bg: var(--dialog-bg);background-color:var(--dialog-bg);color:var(--text-muted);}
            .post-history-menu-trigger.post-history-heading-menu-trigger
                .more-icon
         {width:28px;height:28px;}.post-history-menu-content {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:10px;box-shadow:0 8px 24px rgba(0, 0, 0, 0.16);padding:8px;min-width:180px;z-index:102;outline:none;--post-history-menu-action-hover-bg: light-dark(
            color-mix(in srgb, var(--dialog-bg), black 6%),
            color-mix(in srgb, var(--dialog-bg), white 10%)
        );--post-history-menu-action-hover-color: light-dark(
            color-mix(in srgb, var(--text), black 6%),
            color-mix(in srgb, var(--text), white 10%)
        );--post-history-menu-action-danger-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            var(--danger) 12%
        );}.post-history-menu-body {display:flex;flex-direction:column;align-items:stretch;gap:2px;}.post-history-menu-timestamp {width:fit-content;margin-inline:auto;color:var(--text-muted);font-size:0.875rem;line-height:1.35;user-select:text;white-space:nowrap;}.post-history-menu-content[data-state="open"] {
        animation: svelte-ea4c9b-post-history-menu-popover-in 150ms ease-out;}.post-history-menu-content[data-state="closed"] {
        animation: svelte-ea4c9b-post-history-menu-popover-out 100ms ease-in;}

    @media (prefers-reduced-motion: reduce) {.post-history-menu-content[data-state="open"],
        .post-history-menu-content[data-state="closed"] {
            animation: none;}
    }.post-history-menu-content .post-history-menu-separator {height:1px;margin:4px 0;background:var(--border-hr);}.post-history-menu-content .menu-action-button {display:flex;align-items:center;justify-content:flex-start;gap:10px;width:100%;min-height:44px;padding:10px 12px;border:none;border-radius:6px;background-color:transparent;color:inherit;font:inherit;text-align:start;cursor:pointer;}.post-history-menu-content .menu-action-button-danger {color:var(--danger);--svg: currentColor;}
            .post-history-menu-content
                .menu-action-button[data-highlighted]:not([data-disabled])
         {background-color:var(--post-history-menu-action-hover-bg);color:var(--post-history-menu-action-hover-color);--svg: currentColor;}
            .post-history-menu-content
                .menu-action-button-danger[data-highlighted]:not(
                    [data-disabled]
                )
         {background-color:var(--post-history-menu-action-danger-hover-bg);color:var(--danger);--svg: currentColor;}

    @media (hover: hover) and (pointer: fine) {
                .post-history-menu-content
                    .menu-action-button:hover:not([data-disabled])
             {background-color:var(--post-history-menu-action-hover-bg);color:var(--post-history-menu-action-hover-color);--svg: currentColor;}
                .post-history-menu-content
                    .menu-action-button-danger:hover:not([data-disabled])
             {background-color:var(--post-history-menu-action-danger-hover-bg);color:var(--danger);--svg: currentColor;}
    }.post-history-menu-content .menu-action-button[data-disabled] {opacity:0.55;cursor:not-allowed;}.post-history-menu-content .menu-action-button .svg-icon {display:inline-flex;align-items:center;justify-content:center;--icon-size: 20px;}

    @keyframes svelte-ea4c9b-post-history-menu-popover-in {
        from {
            opacity: 0;
            translate: 0 -4px;
        }
        to {
            opacity: 1;
            translate: 0 0;
        }
    }

    @keyframes svelte-ea4c9b-post-history-menu-popover-out {
        from {
            opacity: 1;
            translate: 0 0;
        }
        to {
            opacity: 0;
            translate: 0 -4px;
        }
    }`
};
function zn(r, e) {
  le(e, !0), De(r, jn);
  let t = _(e, "open", 7, !1), o = _(e, "onOpenChange", 7, void 0), n = _(e, "triggerAriaLabel", 7), s = _(e, "triggerClassName", 7, ""), c = _(e, "align", 7, "start"), i = _(e, "timestamp", 7, void 0), f = _(e, "items", 7, void 0), u = _(e, "tooltipContent", 7, void 0), v = _(e, "enableTooltip", 7, !1), a = _(e, "lazy", 7, !1);
  const w = At().overlayTarget;
  let l = fe(!1), x = fe(!1), d = fe(null), I = Y(() => !a() || p(l) || t()), T = !1;
  $e(() => {
    t() !== T && (T = t(), B(x, t()));
  });
  function g(y) {
    B(x, y, !0), o()?.(y);
  }
  async function H(y, b) {
    typeof b == "function" && b(y);
    const A = typeof o() == "function";
    B(l, !0), await Tt(), A && (B(x, !0), o()(!0)), p(d) && (p(d).focus({ preventScroll: !0 }), A || p(d).click());
  }
  function M(y) {
    y.key === "ArrowDown" && (y.preventDefault(), H(y));
  }
  var F = {
    get open() {
      return t();
    },
    set open(y = !1) {
      t(y), R();
    },
    get onOpenChange() {
      return o();
    },
    set onOpenChange(y = void 0) {
      o(y), R();
    },
    get triggerAriaLabel() {
      return n();
    },
    set triggerAriaLabel(y) {
      n(y), R();
    },
    get triggerClassName() {
      return s();
    },
    set triggerClassName(y = "") {
      s(y), R();
    },
    get align() {
      return c();
    },
    set align(y = "start") {
      c(y), R();
    },
    get timestamp() {
      return i();
    },
    set timestamp(y = void 0) {
      i(y), R();
    },
    get items() {
      return f();
    },
    set items(y = void 0) {
      f(y), R();
    },
    get tooltipContent() {
      return u();
    },
    set tooltipContent(y = void 0) {
      u(y), R();
    },
    get enableTooltip() {
      return v();
    },
    set enableTooltip(y = !1) {
      v(y), R();
    },
    get lazy() {
      return a();
    },
    set lazy(y = !1) {
      a(y), R();
    }
  }, W = V(), Q = N(W);
  {
    var m = (y) => {
      var b = V(), A = N(b);
      J(A, () => Ot, (P, L) => {
        L(P, {
          get open() {
            return p(x);
          },
          onOpenChange: g,
          children: (O, E) => {
            var D = Fn(), U = N(D);
            {
              var q = (he) => {
                var ue = V(), ye = N(ue);
                J(ye, () => et, (Re, k) => {
                  k(Re, {
                    children: (j, oe) => {
                      var Ie = V(), ie = N(Ie);
                      J(ie, () => tt, (Pe, be) => {
                        be(Pe, {
                          delayDuration: 500,
                          children: (pe, He) => {
                            var Me = On(), we = N(Me);
                            {
                              const ke = (Ae, Te) => {
                                let Be = () => Te?.().props;
                                const xe = Y(() => {
                                  const { onclick: Ue, ...Fe } = Be();
                                  return { tooltipOnclick: Ue, restProps: Fe };
                                });
                                var Ke = V(), Xe = N(Ke);
                                {
                                  let Ue = Y(() => `menu-trigger post-history-menu-trigger ${s()} ${p(x) ? "is-open" : ""}`.trim());
                                  J(Xe, () => st, (Fe, pt) => {
                                    pt(Fe, je(
                                      {
                                        get class() {
                                          return p(Ue);
                                        },
                                        get "aria-label"() {
                                          return n();
                                        }
                                      },
                                      () => p(xe).restProps,
                                      {
                                        onclick: (Ce) => {
                                          typeof p(xe).tooltipOnclick == "function" && p(xe).tooltipOnclick(Ce);
                                        },
                                        get ref() {
                                          return p(d);
                                        },
                                        set ref(Ce) {
                                          B(d, Ce, !0);
                                        },
                                        children: (Ce, Qr) => {
                                          var Lt = Hn();
                                          C(Ce, Lt);
                                        },
                                        $$slots: { default: !0 }
                                      }
                                    ));
                                  });
                                }
                                C(Ae, Ke);
                              };
                              J(we, () => nt, (Ae, Te) => {
                                Te(Ae, { child: ke, $$slots: { child: !0 } });
                              });
                            }
                            var qe = ne(we, 2);
                            J(qe, () => Ve, (ke, Ae) => {
                              Ae(ke, {
                                get to() {
                                  return w;
                                },
                                children: (Te, Be) => {
                                  var xe = V(), Ke = N(xe);
                                  J(Ke, () => rt, (Xe, Ue) => {
                                    Ue(Xe, {
                                      sideOffset: 8,
                                      class: "tooltip-content post-preview-tooltip-content",
                                      children: (Fe, pt) => {
                                        Ye();
                                        var Ce = We();
                                        ee(() => ge(Ce, u())), C(Fe, Ce);
                                      },
                                      $$slots: { default: !0 }
                                    });
                                  }), C(Te, xe);
                                },
                                $$slots: { default: !0 }
                              });
                            }), C(pe, Me);
                          },
                          $$slots: { default: !0 }
                        });
                      }), C(j, Ie);
                    },
                    $$slots: { default: !0 }
                  });
                }), C(he, ue);
              }, G = (he) => {
                var ue = V(), ye = N(ue);
                {
                  let Re = Y(() => `menu-trigger post-history-menu-trigger ${s()} ${p(x) ? "is-open" : ""}`.trim());
                  J(ye, () => st, (k, j) => {
                    j(k, {
                      get class() {
                        return p(Re);
                      },
                      get "aria-label"() {
                        return n();
                      },
                      get ref() {
                        return p(d);
                      },
                      set ref(oe) {
                        B(d, oe, !0);
                      },
                      children: (oe, Ie) => {
                        var ie = Dn();
                        C(oe, ie);
                      },
                      $$slots: { default: !0 }
                    });
                  });
                }
                C(he, ue);
              };
              re(U, (he) => {
                v() && u() ? he(q) : he(G, -1);
              });
            }
            var te = ne(U, 2);
            J(te, () => Ve, (he, ue) => {
              ue(he, {
                get to() {
                  return w;
                },
                children: (ye, Re) => {
                  var k = V(), j = N(k);
                  J(j, () => Dt, (oe, Ie) => {
                    Ie(oe, {
                      side: "bottom",
                      get align() {
                        return c();
                      },
                      sideOffset: 8,
                      class: "post-history-menu-content",
                      trapFocus: !1,
                      preventScroll: !1,
                      onCloseAutoFocus: (ie) => ie.preventDefault(),
                      children: (ie, Pe) => {
                        var be = Un(), pe = z(be);
                        {
                          var He = (we) => {
                            var qe = Mn(), ke = N(qe), Ae = z(ke, !0);
                            $(ke);
                            var Te = ne(ke, 2);
                            J(Te, () => Ht, (Be, xe) => {
                              xe(Be, { class: "post-history-menu-separator" });
                            }), ee(() => ge(Ae, i())), C(we, qe);
                          };
                          re(pe, (we) => {
                            i() && we(He);
                          });
                        }
                        var Me = ne(pe, 2);
                        X(Me, () => f() ?? ae), $(be), C(ie, be);
                      },
                      $$slots: { default: !0 }
                    });
                  }), C(ye, k);
                },
                $$slots: { default: !0 }
              });
            }), C(O, D);
          },
          $$slots: { default: !0 }
        });
      }), C(y, b);
    }, h = (y) => {
      var b = V(), A = N(b);
      J(A, () => et, (P, L) => {
        L(P, {
          children: (O, E) => {
            var D = V(), U = N(D);
            J(U, () => tt, (q, G) => {
              G(q, {
                delayDuration: 500,
                children: (te, he) => {
                  var ue = Nn(), ye = N(ue);
                  {
                    const k = (j, oe) => {
                      let Ie = () => oe?.().props;
                      const ie = Y(() => {
                        const { onclick: pe, ...He } = Ie();
                        return { tooltipOnclick: pe, restProps: He };
                      });
                      var Pe = Ln(), be = (pe) => void H(pe, p(ie).tooltipOnclick);
                      Se(
                        Pe,
                        (pe) => ({
                          type: "button",
                          class: pe,
                          "aria-label": n(),
                          "aria-haspopup": "menu",
                          "aria-expanded": p(x),
                          ...p(ie).restProps,
                          onclick: be,
                          onkeydown: M
                        }),
                        [
                          () => `menu-trigger post-history-menu-trigger ${s()}`.trim()
                        ]
                      ), C(j, Pe);
                    };
                    J(ye, () => nt, (j, oe) => {
                      oe(j, { child: k, $$slots: { child: !0 } });
                    });
                  }
                  var Re = ne(ye, 2);
                  J(Re, () => Ve, (k, j) => {
                    j(k, {
                      get to() {
                        return w;
                      },
                      children: (oe, Ie) => {
                        var ie = V(), Pe = N(ie);
                        J(Pe, () => rt, (be, pe) => {
                          pe(be, {
                            sideOffset: 8,
                            class: "tooltip-content post-preview-tooltip-content",
                            children: (He, Me) => {
                              Ye();
                              var we = We();
                              ee(() => ge(we, u())), C(He, we);
                            },
                            $$slots: { default: !0 }
                          });
                        }), C(oe, ie);
                      },
                      $$slots: { default: !0 }
                    });
                  }), C(te, ue);
                },
                $$slots: { default: !0 }
              });
            }), C(O, D);
          },
          $$slots: { default: !0 }
        });
      }), C(y, b);
    }, S = (y) => {
      var b = $n();
      ee(
        (A) => {
          at(b, 1, A), me(b, "aria-label", n()), me(b, "aria-expanded", p(x));
        },
        [
          () => It(`menu-trigger post-history-menu-trigger ${s()}`.trim())
        ]
      ), yt("click", b, (A) => void H(A)), yt("keydown", b, M), C(y, b);
    };
    re(Q, (y) => {
      p(I) ? y(m) : v() && u() ? y(h, 1) : y(S, -1);
    });
  }
  return C(r, W), ce(F);
}
bn(["click", "keydown"]);
de(
  zn,
  {
    open: {},
    onOpenChange: {},
    triggerAriaLabel: {},
    triggerClassName: {},
    align: {},
    timestamp: {},
    items: {},
    tooltipContent: {},
    enableTooltip: {},
    lazy: {}
  },
  [],
  [],
  { mode: "open" }
);
var qn = K('<div><div class="post-preview-footer-left svelte-r1d5vb"><span class="post-preview-date svelte-r1d5vb"> </span> <!></div> <div class="post-preview-footer-actions svelte-r1d5vb"><!></div> <div class="post-preview-footer-right svelte-r1d5vb"><!></div></div>');
const Bn = {
  hash: "svelte-r1d5vb",
  code: `.post-preview-footer.svelte-r1d5vb {display:grid;grid-template-columns:minmax(0, 120px) minmax(144px, 1fr) 36px;align-items:stretch;height:36px;--post-history-preview-action-icon-size: 20px;color:var(--btn-post-preview-action);--post-history-preview-footer-surface: var(--dialog-bg);}.post-preview-footer-regular.svelte-r1d5vb {padding-inline-start:1rem;}.post-preview-footer-compact.svelte-r1d5vb {padding-inline-start:1rem;--post-history-preview-footer-surface: var(
            --post-history-related-card-bg,
            var(--dialog-bg)
        );}.post-preview-footer.is-dimmed.svelte-r1d5vb {opacity:0.65;}.post-preview-footer-left.svelte-r1d5vb,
    .post-preview-footer-actions.svelte-r1d5vb,
    .post-preview-footer-right.svelte-r1d5vb {display:flex;align-items:stretch;}.post-preview-footer-left.svelte-r1d5vb {align-items:center;justify-content:flex-start;min-width:0;}.post-preview-footer-actions.svelte-r1d5vb {justify-content:stretch;min-width:0;}.post-preview-footer-right.svelte-r1d5vb {align-items:center;justify-content:flex-end;min-width:0;}.post-preview-date.svelte-r1d5vb {overflow:hidden;color:var(--text-muted);font-size:0.875rem;text-overflow:ellipsis;white-space:nowrap;}.post-preview-footer-regular.svelte-r1d5vb .post-preview-date:where(.svelte-r1d5vb) {font-size:0.9375rem;}.post-preview-footer-replies-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-reply-button-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-footer-reaction-slot {display:flex;align-items:stretch;justify-content:center;flex:0 1 auto;min-width:0;max-width:100%;}.post-history-action-button,
    .post-preview-reactions-button {min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface);background-color:var(--post-history-preview-footer-surface);}.post-preview-action-buttons-group {display:grid;grid-template-columns:minmax(72px, 1fr) repeat(2, minmax(36px, 1fr));align-items:stretch;width:100%;min-width:0;}.post-preview-action-cell {display:flex;align-items:stretch;justify-content:center;min-width:0;}.post-preview-reply-action-cell {display:grid;grid-template-columns:36px 36px;justify-content:center;}.post-preview-quote-action-cell,
    .post-preview-reaction-action-cell {justify-content:center;}.post-preview-reaction-action-cell .post-preview-footer-reaction-slot {max-width:100%;}.post-preview-action-button {position:relative;}.post-history-action-button {color:var(--btn-post-preview-action);}.post-history-action-button .svg-icon {--svg: currentColor;}.post-preview-footer .reply-icon.svg-icon {width:var(--post-history-preview-action-icon-size);height:var(--post-history-preview-action-icon-size);mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-preview-footer .quote-icon.svg-icon {width:var(--post-history-preview-action-icon-size);height:var(--post-history-preview-action-icon-size);mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}`
};
function Kn(r, e) {
  le(e, !0), De(r, Bn);
  let t = _(e, "formattedDate", 7), o = _(e, "density", 7, "regular"), n = _(e, "dimmed", 7, !1), s = _(e, "leftExtras", 7, void 0), c = _(e, "actions", 7, void 0), i = _(e, "trailing", 7, void 0);
  var f = {
    get formattedDate() {
      return t();
    },
    set formattedDate(g) {
      t(g), R();
    },
    get density() {
      return o();
    },
    set density(g = "regular") {
      o(g), R();
    },
    get dimmed() {
      return n();
    },
    set dimmed(g = !1) {
      n(g), R();
    },
    get leftExtras() {
      return s();
    },
    set leftExtras(g = void 0) {
      s(g), R();
    },
    get actions() {
      return c();
    },
    set actions(g = void 0) {
      c(g), R();
    },
    get trailing() {
      return i();
    },
    set trailing(g = void 0) {
      i(g), R();
    }
  }, u = qn(), v = z(u), a = z(v), w = z(a, !0);
  $(a);
  var l = ne(a, 2);
  X(l, () => s() ?? ae), $(v);
  var x = ne(v, 2), d = z(x);
  X(d, () => c() ?? ae), $(x);
  var I = ne(x, 2), T = z(I);
  return X(T, () => i() ?? ae), $(I), $(u), ee(
    (g) => {
      at(u, 1, g, "svelte-r1d5vb"), ge(w, t());
    },
    [
      () => It(`post-preview-footer post-preview-footer-${o()} ${n() ? "is-dimmed" : ""}`.trim())
    ]
  ), C(r, u), ce(f);
}
de(
  Kn,
  {
    formattedDate: {},
    density: {},
    dimmed: {},
    leftExtras: {},
    actions: {},
    trailing: {}
  },
  [],
  [],
  { mode: "open" }
);
var Vn = K('<div class="xmark-icon svg-icon svelte-10wau4w"></div>'), Wn = K('<div class="raw-json-heading svelte-10wau4w"><h2 class="svelte-10wau4w"> </h2></div> <pre class="raw-json-content svelte-10wau4w"><code> </code></pre>', 1);
const Yn = {
  hash: "svelte-10wau4w",
  code: `.xmark-icon.svelte-10wau4w {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-raw-json-dialog .dialog-content {padding:8px;}.raw-json-heading.svelte-10wau4w {width:100%;}.raw-json-heading.svelte-10wau4w h2:where(.svelte-10wau4w) {margin:0;font-size:1.1rem;}.raw-json-content.svelte-10wau4w {width:100%;height:100%;margin:10px 0 0;padding:8px;overflow:auto;border:1px solid var(--border-hr);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--text) 4%);color:var(--text);font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,\r
            "Liberation Mono", monospace;font-size:0.82rem;line-height:1.45;text-align:left;white-space:pre;}.post-history-raw-json-dialog {max-width:min(760px, calc(100% - 10px));}`
};
function Qn(r, e) {
  le(e, !0), De(r, Yn);
  const t = () => dt(ut, "$_", o), [o, n] = lt();
  let s = _(e, "open", 15, !1), c = _(e, "rawEvent", 7), i = _(e, "onOpenChange", 7, void 0), f = Y(() => JSON.stringify(c(), null, 2) ?? "");
  function u(w) {
    w || i()?.(!1);
  }
  var v = {
    get open() {
      return s();
    },
    set open(w = !1) {
      s(w), R();
    },
    get rawEvent() {
      return c();
    },
    set rawEvent(w) {
      c(w), R();
    },
    get onOpenChange() {
      return i();
    },
    set onOpenChange(w = void 0) {
      i(w), R();
    }
  };
  {
    const w = (d) => {
      var I = V(), T = N(I);
      {
        const g = (H, M) => {
          let F = () => M?.().props;
          {
            let W = Y(() => t()("global.close"));
            ct(H, je(F, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return p(W);
              },
              children: (Q, m) => {
                var h = Vn();
                ee((S) => me(h, "aria-label", S), [() => t()("global.close")]), C(Q, h);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        J(T, () => Cn, (H, M) => {
          M(H, { child: g, $$slots: { child: !0 } });
        });
      }
      C(d, I);
    };
    let l = Y(() => t()("postHistory.rawJsonTitle")), x = Y(() => t()("postHistory.rawJsonDescription"));
    xn(r, {
      onOpenChange: u,
      get title() {
        return p(l);
      },
      get description() {
        return p(x);
      },
      contentClass: "post-history-raw-json-dialog",
      footerVariant: "close-button",
      initialFocus: "content",
      get open() {
        return s();
      },
      set open(d) {
        s(d);
      },
      footer: w,
      children: (d, I) => {
        var T = Wn(), g = N(T), H = z(g), M = z(H, !0);
        $(H), $(g);
        var F = ne(g, 2), W = z(F), Q = z(W, !0);
        $(W), $(F), ee(
          (m) => {
            ge(M, m), ge(Q, p(f));
          },
          [() => t()("postHistory.rawJsonTitle")]
        ), C(d, T);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var a = ce(v);
  return n(), a;
}
de(Qn, { open: {}, rawEvent: {}, onOpenChange: {} }, [], [], { mode: "open" });
var Jn = K("<!> <!>", 1);
function Qe(r, e) {
  le(e, !0);
  let t = _(e, "tooltipContent", 7), o = _(e, "children", 7), n = _(e, "onClick", 7, void 0), s = _(e, "ariaLabel", 7, ""), c = ze(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "tooltipContent",
    "children",
    "onClick",
    "ariaLabel"
  ]);
  const i = At().overlayTarget;
  var f = {
    get tooltipContent() {
      return t();
    },
    set tooltipContent(a) {
      t(a), R();
    },
    get children() {
      return o();
    },
    set children(a) {
      o(a), R();
    },
    get onClick() {
      return n();
    },
    set onClick(a = void 0) {
      n(a), R();
    },
    get ariaLabel() {
      return s();
    },
    set ariaLabel(a = "") {
      s(a), R();
    }
  }, u = V(), v = N(u);
  return J(v, () => et, (a, w) => {
    w(a, {
      children: (l, x) => {
        var d = V(), I = N(d);
        J(I, () => tt, (T, g) => {
          g(T, {
            delayDuration: 500,
            children: (H, M) => {
              var F = Jn(), W = N(F);
              {
                const m = (h, S) => {
                  let y = () => S?.().props;
                  const b = Y(() => {
                    const { onclick: A, ...P } = y();
                    return { tooltipOnclick: A, restProps: P };
                  });
                  ct(h, je(() => c, () => p(b).restProps, {
                    get ariaLabel() {
                      return s();
                    },
                    onClick: (A) => {
                      const P = n()?.(A);
                      return typeof p(b).tooltipOnclick == "function" && p(b).tooltipOnclick(A), P;
                    },
                    children: (A, P) => {
                      var L = V(), O = N(L);
                      X(O, () => o() ?? ae), C(A, L);
                    },
                    $$slots: { default: !0 }
                  }));
                };
                J(W, () => nt, (h, S) => {
                  S(h, { child: m, $$slots: { child: !0 } });
                });
              }
              var Q = ne(W, 2);
              J(Q, () => Ve, (m, h) => {
                h(m, {
                  get to() {
                    return i;
                  },
                  children: (S, y) => {
                    var b = V(), A = N(b);
                    J(A, () => rt, (P, L) => {
                      L(P, {
                        sideOffset: 8,
                        class: "tooltip-content post-preview-tooltip-content",
                        children: (O, E) => {
                          Ye();
                          var D = We();
                          ee(() => ge(D, t())), C(O, D);
                        },
                        $$slots: { default: !0 }
                      });
                    }), C(S, b);
                  },
                  $$slots: { default: !0 }
                });
              }), C(H, F);
            },
            $$slots: { default: !0 }
          });
        }), C(l, d);
      },
      $$slots: { default: !0 }
    });
  }), C(r, u), ce(f);
}
de(Qe, { tooltipContent: {}, children: {}, onClick: {}, ariaLabel: {} }, [], [], { mode: "open" });
var Zn = K('<div class="reply-icon svg-icon" aria-hidden="true"></div>'), Xn = K('<div class="quote-icon svg-icon" aria-hidden="true"></div>'), Gn = K('<div class="post-preview-action-buttons-group"><div class="post-preview-action-cell post-preview-reply-action-cell"><div class="post-preview-reply-button-slot"><!></div> <div class="post-preview-footer-replies-slot"><!></div></div> <div class="post-preview-action-cell post-preview-quote-action-cell"><!></div> <div class="post-preview-action-cell post-preview-reaction-action-cell"><div class="post-preview-footer-reaction-slot"><!></div></div></div>');
function er(r, e) {
  le(e, !0);
  const t = () => dt(ut, "$_", o), [o, n] = lt();
  let s = _(e, "post", 7), c = _(e, "onReplyPost", 7, void 0), i = _(e, "onQuotePost", 7, void 0), f = _(e, "replyExtras", 7, void 0), u = _(e, "reactionExtras", 7, void 0);
  var v = {
    get post() {
      return s();
    },
    set post(h) {
      s(h), R();
    },
    get onReplyPost() {
      return c();
    },
    set onReplyPost(h = void 0) {
      c(h), R();
    },
    get onQuotePost() {
      return i();
    },
    set onQuotePost(h = void 0) {
      i(h), R();
    },
    get replyExtras() {
      return f();
    },
    set replyExtras(h = void 0) {
      f(h), R();
    },
    get reactionExtras() {
      return u();
    },
    set reactionExtras(h = void 0) {
      u(h), R();
    }
  }, a = Gn(), w = z(a), l = z(w), x = z(l);
  {
    var d = (h) => {
      {
        let S = Y(() => t()("replyQuote.reply_label")), y = Y(() => t()("replyQuote.reply_label"));
        Qe(h, {
          type: "button",
          className: "post-preview-action-button post-history-action-button",
          get ariaLabel() {
            return p(S);
          },
          contentLayout: "icon",
          shape: "circle",
          onClick: () => c()?.(s()),
          get tooltipContent() {
            return p(y);
          },
          children: (b, A) => {
            var P = Zn();
            C(b, P);
          },
          $$slots: { default: !0 }
        });
      }
    };
    re(x, (h) => {
      c() && h(d);
    });
  }
  $(l);
  var I = ne(l, 2), T = z(I);
  X(T, () => f() ?? ae), $(I), $(w);
  var g = ne(w, 2), H = z(g);
  {
    var M = (h) => {
      {
        let S = Y(() => t()("replyQuote.quote_label")), y = Y(() => t()("replyQuote.quote_label"));
        Qe(h, {
          type: "button",
          className: "post-preview-action-button post-history-action-button",
          get ariaLabel() {
            return p(S);
          },
          contentLayout: "icon",
          shape: "circle",
          onClick: () => i()?.(s()),
          get tooltipContent() {
            return p(y);
          },
          children: (b, A) => {
            var P = Xn();
            C(b, P);
          },
          $$slots: { default: !0 }
        });
      }
    };
    re(H, (h) => {
      i() && h(M);
    });
  }
  $(g);
  var F = ne(g, 2), W = z(F), Q = z(W);
  X(Q, () => u() ?? ae), $(W), $(F), $(a), C(r, a);
  var m = ce(v);
  return n(), m;
}
de(
  er,
  {
    post: {},
    onReplyPost: {},
    onQuotePost: {},
    replyExtras: {},
    reactionExtras: {}
  },
  [],
  [],
  { mode: "open" }
);
function Gr(r) {
  return r.isSearchMode ? r.totalCount <= 0 ? null : {
    key: "postHistory.searchCountSummary",
    values: {
      total: r.totalCount
    }
  } : r.totalCountKnown ? {
    key: "postHistory.visibleCountSummary",
    values: {
      total: r.totalCount
    }
  } : r.totalCountStatus === "failed" ? { key: "postHistory.countUnavailable" } : { key: "postHistory.countLoading" };
}
function eo(r) {
  return r.direction === "older" ? r.isSearchMode ? "postHistory.loadOlderSearchResults" : "postHistory.loadOlder" : r.isSearchMode ? "postHistory.loadNewerSearchResults" : "postHistory.loadNewer";
}
function to(r) {
  return r.status === "loading" ? { key: "postHistory.checkingReplies" } : r.status === "failed" ? { key: "postHistory.recheckReplies" } : r.status === "loaded" ? r.replyCount === 0 ? { key: "postHistory.recheckReplies" } : r.visible ? { key: "postHistory.hideReplies" } : {
    key: "postHistory.showRepliesWithCount",
    values: {
      count: r.replyCount
    }
  } : { key: "postHistory.checkReplies" };
}
function no(r) {
  return r.visible ? { key: "postHistory.hideReactions" } : {
    key: "postHistory.showReactionsWithCount",
    values: {
      count: r.reactionCount
    }
  };
}
function tr(r) {
  return r === "+";
}
const mt = {
  totalCount: 0,
  groups: []
}, nr = new Intl.Segmenter(void 0, {
  granularity: "grapheme"
});
function rr(r) {
  if (!xt(r.content))
    return;
  const e = Qt(r.content);
  if (e)
    return Jt(r.tags ?? []).get(e)?.url;
}
function or(r) {
  const e = r.trim();
  if (!e)
    return "+";
  if (xt(e))
    return e;
  const t = nr.segment(e)[Symbol.iterator]().next();
  return t.done ? "" : t.value.segment;
}
function sr(r, e) {
  return r ? r instanceof Map ? r.get(e) ?? null : r[e] ?? null : null;
}
function ir(r) {
  try {
    return Zt(Xt(r), 9, 4);
  } catch {
    return r.slice(0, 12);
  }
}
function ar(r) {
  return r.profile?.displayName?.trim() || r.profile?.name?.trim() || ir(r.pubkey);
}
async function ro(r, e = _e) {
  return r ? e.getReactionRecords(r) : [];
}
function lr(r, e) {
  if (r.length === 0)
    return mt;
  const t = [], o = /* @__PURE__ */ new Map();
  let n = 0;
  for (const s of r) {
    if (s.kind !== 7)
      continue;
    n += 1;
    const c = or(s.content);
    if (!c)
      continue;
    const i = {
      eventId: s.eventId,
      pubkey: s.authorPubkey,
      profile: sr(e, s.authorPubkey),
      createdAt: s.createdAt
    }, f = o.get(c), u = rr(s);
    if (f === void 0) {
      o.set(c, t.length), t.push({
        content: c,
        count: 1,
        ...u ? { emojiUrl: u } : {},
        reactors: [i]
      });
      continue;
    }
    const v = t[f], a = v.emojiUrl ?? u;
    t[f] = {
      ...v,
      count: v.count + 1,
      ...a ? { emojiUrl: a } : {},
      reactors: [...v.reactors, i]
    };
  }
  return n === 0 ? mt : {
    totalCount: n,
    groups: t
  };
}
var cr = K('<div class="favorite-icon svg-icon post-preview-reaction-symbol" aria-hidden="true"></div>'), dr = K('<span class="post-preview-reaction-emoji-slot post-preview-reaction-emoji-failed" role="img" tabindex="0"> </span>'), ur = K('<img class="post-preview-reaction-emoji" draggable="false" loading="lazy" decoding="async"/>'), pr = K('<span class="post-preview-reaction-emoji-placeholder" aria-hidden="true"></span>'), vr = K('<span class="post-preview-reaction-emoji-slot"><!></span>'), fr = K('<span class="post-preview-reaction-content"> </span>'), gr = K('<span class="post-preview-reaction-actor"><!></span>'), hr = K('<div class="post-preview-reaction-chip"><div class="post-preview-reaction-summary"><!> <span class="post-preview-reaction-count"> </span></div> <div class="post-preview-reaction-actors"></div></div>'), yr = K('<div class="post-preview-reactions-panel"></div>');
const mr = {
  hash: "svelte-j0ansb",
  code: `.post-preview-reactions-panel {display:flex;flex-wrap:wrap;gap:4px;padding:0 16px;}.post-preview-reaction-chip {display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:4px 8px;border-radius:18px;background:color-mix(in srgb, var(--btn-bg), transparent 40%);color:var(--text);}.post-preview-reaction-summary {display:inline-flex;align-items:center;justify-content:center;gap:2px;row-gap:4px;flex-wrap:wrap;}.post-preview-reaction-content {font-size:20px;line-height:1;}.post-preview-reaction-count {font-size:1rem;line-height:1;color:var(--text-muted);}.post-preview-reaction-emoji-slot {display:inline-grid;margin:0;padding:0;}.post-preview-reaction-emoji,
    .post-preview-reaction-emoji-placeholder {width:100%;height:100%;}.post-preview-reaction-emoji {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-preview-reaction-emoji-placeholder {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}.post-preview-reaction-emoji-failed {display:inline-grid;place-items:center;overflow:hidden;border-radius:4px;background:rgba(127, 127, 127, 0.18);font-size:0.45em;line-height:1;white-space:nowrap;cursor:help;}.post-preview-reaction-actors {display:inline-flex;flex-wrap:wrap;gap:2px;align-items:center;}.post-preview-reaction-actor {display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:999px;overflow:hidden;flex:0 0 auto;}.post-preview-reaction-avatar,
    .post-preview-reaction-avatar-image,
    .post-preview-reaction-avatar-fallback {width:100%;height:100%;}.post-preview-reaction-avatar-image {object-fit:cover;}.post-preview-reaction-symbol {width:18px;height:18px;background-color:rgb(249, 24, 128);mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}`
};
function br(r, e) {
  le(e, !0), De(r, mr);
  let t = _(e, "readModel", 7), o = _(e, "emojiLoadStateByUrl", 23, () => ({})), n = _(e, "emojiImageMetaByUrl", 23, () => ({}));
  function s(v) {
    const a = n()[v]?.aspectRatio;
    return `width:${typeof a == "number" && Number.isFinite(a) && a > 0 ? 18 * a : 18}px;height:18px;vertical-align:bottom;`;
  }
  var c = {
    get readModel() {
      return t();
    },
    set readModel(v) {
      t(v), R();
    },
    get emojiLoadStateByUrl() {
      return o();
    },
    set emojiLoadStateByUrl(v = {}) {
      o(v), R();
    },
    get emojiImageMetaByUrl() {
      return n();
    },
    set emojiImageMetaByUrl(v = {}) {
      n(v), R();
    }
  }, i = V(), f = N(i);
  {
    var u = (v) => {
      var a = yr();
      ft(a, 21, () => t().groups, (w) => w.content, (w, l) => {
        var x = hr(), d = z(x), I = z(d);
        {
          var T = (m) => {
            var h = cr();
            C(m, h);
          }, g = Y(() => tr(p(l).content)), H = (m) => {
            var h = V(), S = N(h);
            {
              var y = (A) => {
                var P = dr(), L = z(P, !0);
                $(P), ee(
                  (O) => {
                    gt(P, O), me(P, "aria-label", p(l).content), me(P, "title", p(l).content), ge(L, p(l).content);
                  },
                  [() => s(p(l).emojiUrl)]
                ), C(A, P);
              }, b = (A) => {
                var P = vr(), L = z(P);
                {
                  var O = (D) => {
                    var U = ur();
                    ee(() => {
                      me(U, "src", p(l).emojiUrl), me(U, "alt", p(l).content), me(U, "title", p(l).content);
                    }), C(D, U);
                  }, E = (D) => {
                    var U = pr();
                    C(D, U);
                  };
                  re(L, (D) => {
                    o()[p(l).emojiUrl] === "ready" ? D(O) : D(E, -1);
                  });
                }
                $(P), ee((D) => gt(P, D), [() => s(p(l).emojiUrl)]), C(A, P);
              };
              re(S, (A) => {
                o()[p(l).emojiUrl] === "failed" ? A(y) : A(b, -1);
              });
            }
            C(m, h);
          }, M = (m) => {
            var h = fr(), S = z(h, !0);
            $(h), ee(() => ge(S, p(l).content)), C(m, h);
          };
          re(I, (m) => {
            p(g) ? m(T) : p(l).emojiUrl ? m(H, 1) : m(M, -1);
          });
        }
        var F = ne(I, 2), W = z(F, !0);
        $(F), $(d);
        var Q = ne(d, 2);
        ft(Q, 21, () => p(l).reactors, (m) => m.eventId, (m, h) => {
          const S = Y(() => ar(p(h)));
          var y = gr(), b = z(y);
          {
            let A = Y(() => p(h).profile?.picture || "");
            Gt(b, {
              get src() {
                return p(A);
              },
              get alt() {
                return p(S);
              },
              rootClassName: "post-preview-reaction-avatar",
              imageClassName: "post-preview-reaction-avatar-image",
              fallbackClassName: "post-preview-reaction-avatar-fallback",
              get fallbackAriaLabel() {
                return p(S);
              },
              fallbackDelayMs: 0
            });
          }
          $(y), ee(() => {
            me(y, "title", p(S)), me(y, "aria-label", p(S));
          }), C(m, y);
        }), $(Q), $(x), ee(() => ge(W, p(l).count)), C(w, x);
      }), $(a), C(v, a);
    };
    re(f, (v) => {
      t().totalCount > 0 && v(u);
    });
  }
  return C(r, i), ce(c);
}
de(
  br,
  {
    readModel: {},
    emojiLoadStateByUrl: {},
    emojiImageMetaByUrl: {}
  },
  [],
  [],
  { mode: "open" }
);
var wr = K('<div class="favorite-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1);
const _r = {
  hash: "svelte-8bdn3n",
  code: ".post-preview-reactions-button {display:flex;align-items:center;gap:4px;padding:0;padding-inline:6px;}.post-preview-reactions-button .favorite-icon {mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-preview-reactions-button span {flex:0 0 auto;line-height:20px;}.post-preview-reactions-button .svg-icon {width:var(--post-history-preview-action-icon-size, 20px);height:var(--post-history-preview-action-icon-size, 20px);--svg: currentColor;}.post-preview-reactions-button.selected {--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));color:var(--text-light);}"
};
function Rr(r, e) {
  le(e, !0), De(r, _r);
  let t = _(e, "count", 7), o = _(e, "expanded", 7), n = _(e, "ariaLabel", 7), s = _(e, "onToggle", 7);
  var c = {
    get count() {
      return t();
    },
    set count(i) {
      t(i), R();
    },
    get expanded() {
      return o();
    },
    set expanded(i) {
      o(i), R();
    },
    get ariaLabel() {
      return n();
    },
    set ariaLabel(i) {
      n(i), R();
    },
    get onToggle() {
      return s();
    },
    set onToggle(i) {
      s(i), R();
    }
  };
  return Qe(r, {
    type: "button",
    className: "post-preview-reactions-button",
    get ariaLabel() {
      return n();
    },
    shape: "pill",
    get selected() {
      return o();
    },
    get onClick() {
      return s();
    },
    get tooltipContent() {
      return n();
    },
    children: (i, f) => {
      var u = wr(), v = ne(N(u), 2), a = z(v, !0);
      $(v), ee(() => ge(a, t())), C(i, u);
    },
    $$slots: { default: !0 }
  }), ce(c);
}
de(Rr, { count: {}, expanded: {}, ariaLabel: {}, onToggle: {} }, [], [], { mode: "open" });
var Ir = K("<div><!></div>");
const xr = {
  hash: "svelte-1yd56n0",
  code: `.post-preview-toggle-row.svelte-1yd56n0 {display:flex;&.post-preview-toggle-hidden {visibility:hidden;pointer-events:none;}&.post-preview-toggle-overlay {position:absolute;inset-inline-end:0;inset-block-end:0;z-index:1;padding-inline-start:12px;background:linear-gradient(90deg, transparent, var(--dialog-bg) 18%);}&.post-preview-toggle-flow {position:static;align-self:flex-end;padding:0;background:none;}.ehagaki-app-root & button.post-preview-toggle-button,
        .ehagaki-app-root & button.post-preview-toggle-button:hover {color:var(--text-muted);font-size:0.875rem;font-weight:normal;min-height:24px;padding:0;background:transparent;}

        @media (hover: hover) and (pointer: fine) {.ehagaki-app-root & button.post-preview-toggle-button:hover {text-decoration:underline;}
        }}`
};
function Cr(r, e) {
  le(e, !0), De(r, xr);
  const t = () => dt(ut, "$_", o), [o, n] = lt();
  let s = _(e, "expanded", 7), c = _(e, "controls", 7), i = _(e, "visible", 7, !0), f = _(e, "placement", 7, "inline"), u = _(e, "onToggle", 7);
  var v = {
    get expanded() {
      return s();
    },
    set expanded(d) {
      s(d), R();
    },
    get controls() {
      return c();
    },
    set controls(d) {
      c(d), R();
    },
    get visible() {
      return i();
    },
    set visible(d = !0) {
      i(d), R();
    },
    get placement() {
      return f();
    },
    set placement(d = "inline") {
      f(d), R();
    },
    get onToggle() {
      return u();
    },
    set onToggle(d) {
      u(d), R();
    }
  }, a = Ir();
  let w;
  var l = z(a);
  {
    let d = Y(() => !i());
    ct(l, {
      type: "button",
      class: "post-preview-action-button post-preview-toggle-button",
      get "aria-expanded"() {
        return s();
      },
      get "aria-controls"() {
        return c();
      },
      get disabled() {
        return p(d);
      },
      get onClick() {
        return u();
      },
      children: (I, T) => {
        Ye();
        var g = We();
        ee((H) => ge(g, H), [
          () => s() ? t()("postHistory.collapse") : t()("postHistory.expand")
        ]), C(I, g);
      },
      $$slots: { default: !0 }
    });
  }
  $(a), ee(() => w = at(a, 1, "post-preview-toggle-row svelte-1yd56n0", null, w, {
    "post-preview-toggle-overlay": f() === "overlay" && (!s() || !i()),
    "post-preview-toggle-flow": f() === "overlay" && s() && i(),
    "post-preview-toggle-hidden": !i()
  })), C(r, a);
  var x = ce(v);
  return n(), x;
}
de(
  Cr,
  {
    expanded: {},
    controls: {},
    visible: {},
    placement: {},
    onToggle: {}
  },
  [],
  [],
  { mode: "open" }
);
function oo() {
  let r = fe(ot({})), e = fe(!1), t = fe(null);
  function o(w) {
    return p(r)[w] ?? !1;
  }
  function n(w, l) {
    B(r, { ...p(r), [w]: l }, !0);
  }
  function s() {
    Object.keys(p(r)).length > 0 && B(r, {}, !0);
  }
  function c(w) {
    B(e, w, !0), w || B(t, null);
  }
  function i(w) {
    s(), B(t, w, !0), B(e, !0);
  }
  function f() {
    c(!1);
  }
  function u() {
    B(t, null);
  }
  function v() {
    B(e, !1), B(t, null);
  }
  function a() {
    B(r, {}, !0), v();
  }
  return {
    get deleteConfirmOpen() {
      return p(e);
    },
    get deleteTargetPost() {
      return p(t);
    },
    isPostMenuOpen: o,
    setPostMenuOpen: n,
    closeAllPostItemMenus: s,
    setDeleteConfirmOpen: c,
    openDeleteConfirm: i,
    cancelDeleteConfirm: f,
    clearDeleteTarget: u,
    resetDeleteConfirmation: v,
    reset: a
  };
}
function Sr(r, e) {
  return r.length === e.length && r.every((t, o) => t === e[o]);
}
function so({
  getShow: r,
  getRxNostr: e,
  profileCache: t = en,
  logger: o = console
}) {
  const n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let c = !1;
  const i = (l, x) => {
    if (!(c || l.disposed || n.get(l.pubkey) !== l || !r() || !x || l.lastProfile === x)) {
      l.lastProfile = x;
      for (const d of s)
        d(l.pubkey, x);
    }
  }, f = (l, x) => {
    if (l.pending || l.disposed || c)
      return;
    const d = l.relayHints;
    l.pending = t.getProfile(l.pubkey, {
      rxNostr: e(),
      additionalRelays: d,
      forceRefresh: x,
      allowBackgroundRefresh: !0
    }).then((I) => {
      i(l, I);
    }).catch((I) => {
      o.error("投稿履歴プロフィールの取得に失敗:", I);
    }).finally(() => {
      n.get(l.pubkey) === l && (l.pending = null, l.refreshQueued && (l.refreshQueued = !1, f(l, !0)));
    });
  }, u = (l, x = []) => {
    if (!l || c)
      return null;
    const d = se.sanitizeExternalRelayUrls(x), I = n.get(l);
    if (I) {
      const g = se.mergeRelayConfigs(
        I.relayHints,
        d
      );
      return Sr(I.relayHints, g) || (I.relayHints = g, I.pending ? I.refreshQueued = !0 : f(I, !0)), I.lastProfile;
    }
    const T = {
      pubkey: l,
      relayHints: d,
      lastProfile: null,
      unsubscribe: () => {
      },
      pending: null,
      refreshQueued: !1,
      disposed: !1
    };
    return n.set(l, T), T.unsubscribe = t.subscribe(l, (g) => {
      i(T, g);
    }), f(T, !1), null;
  }, v = (l) => {
    if (c)
      return () => {
      };
    s.add(l);
    for (const x of n.values())
      x.lastProfile && l(x.pubkey, x.lastProfile);
    return () => s.delete(l);
  }, a = () => {
    for (const l of n.values())
      l.disposed = !0, l.unsubscribe();
    n.clear();
  };
  return {
    ensureProfile: u,
    subscribe: v,
    reset: a,
    dispose: () => {
      c || (a(), s.clear(), c = !0);
    }
  };
}
const Mt = [
  "reply",
  "reaction",
  "quote"
];
function Ut(r) {
  const e = r ?? Mt;
  return Array.from(new Set(e.filter(
    (t) => t === "reply" || t === "reaction" || t === "quote"
  )));
}
function io(r, e) {
  const t = Ut(
    e.relationKinds
  );
  return {
    source: r,
    relationKinds: t,
    parentEventIds: Array.from(new Set(e.savedParentEventIds)),
    shouldRefreshQuotePreviews: t.includes("quote") && e.quoteRepairApplied
  };
}
const Le = {
  status: "saved",
  savedParentEventIds: [],
  savedDirectReplyCount: 0,
  deletedEventIds: [],
  deletionConfirmationIncomplete: !1
};
function Er(r) {
  const e = /* @__PURE__ */ new Map();
  for (const t of r) {
    if (!t.parentEventId || !t.event?.id || !t.event.pubkey || t.event.kind !== 1 && t.event.kind !== 42)
      continue;
    const o = e.get(t.event.id);
    e.set(t.event.id, {
      parentEventId: t.parentEventId,
      event: t.event,
      relayUrls: Array.from(/* @__PURE__ */ new Set([
        ...o?.relayUrls ?? [],
        ...t.relayUrls ?? []
      ]))
    });
  }
  return Array.from(e.values());
}
function Pr(r, e) {
  return r.filter((t) => e.get(t.event.pubkey)?.has(t.event.id)).map((t) => t.event.id);
}
function Ne(r) {
  return {
    ...r,
    status: "cancelled",
    savedParentEventIds: [],
    savedDirectReplyCount: 0
  };
}
class kr {
  deletionFetchService;
  deletionRequestsRepository;
  childInteractionsRepository;
  now;
  constructor(e = {}) {
    this.deletionFetchService = e.deletionFetchService ?? tn, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Ct, this.childInteractionsRepository = e.childInteractionsRepository ?? St, this.now = e.now ?? Date.now;
  }
  saveRepairDirectReplies(e, t) {
    let o = !0, n = null;
    const s = () => o && t.isActive?.() !== !1;
    return {
      promise: (async () => {
        const i = Er(t.items);
        if (i.length === 0)
          return Le;
        const f = await this.filterKnownDeletedDirectReplies(i);
        let u = f.deletedEventIds;
        if (!s())
          return Ne({
            ...Le,
            deletedEventIds: u
          });
        let v = f.visibleItems, a = !1;
        if (v.length > 0) {
          n = this.deletionFetchService.fetchDeletionRequests(e, {
            targets: v.map((d) => ({
              event: d.event,
              relayUrls: d.relayUrls
            })),
            relayHints: t.relayHints,
            relayConfig: t.relayConfig
          });
          const l = await n.promise;
          if (n = null, !s() || l.status === "cancelled")
            return Ne({
              ...Le,
              deletedEventIds: u,
              deletionConfirmationIncomplete: a || l.status !== "success"
            });
          if (a = l.status !== "success", l.events.length > 0 && await this.deletionRequestsRepository.upsertValidDeletionRequests({
            targetEvents: v.map((d) => d.event),
            deletionEvents: l.events,
            fetchedAt: l.fetchedAt
          }), !s())
            return Ne({
              ...Le,
              deletedEventIds: u,
              deletionConfirmationIncomplete: a
            });
          const x = await this.filterKnownDeletedDirectReplies(v);
          v = x.visibleItems, u = Array.from(/* @__PURE__ */ new Set([
            ...u,
            ...x.deletedEventIds
          ]));
        }
        if (!s())
          return Ne({
            ...Le,
            deletedEventIds: u,
            deletionConfirmationIncomplete: a
          });
        const w = await this.saveVisibleDirectReplies(
          v,
          t.fetchedAt ?? this.now(),
          s
        );
        return s() ? {
          ...w,
          status: "saved",
          deletedEventIds: u,
          deletionConfirmationIncomplete: a
        } : Ne({
          ...w,
          deletedEventIds: u,
          deletionConfirmationIncomplete: a
        });
      })(),
      cancel: () => {
        o = !1, n?.cancel();
      }
    };
  }
  async filterKnownDeletedDirectReplies(e) {
    const t = await this.deletionRequestsRepository.getDeletedTargets(
      e.map((s) => ({
        targetAuthorPubkey: s.event.pubkey,
        targetEventId: s.event.id
      }))
    ), o = Pr(e, t);
    await this.purgeDeletedReplyCache(o);
    const n = new Set(o);
    return {
      visibleItems: e.filter((s) => !n.has(s.event.id)),
      deletedEventIds: o
    };
  }
  async purgeDeletedReplyCache(e) {
    for (const t of new Set(e))
      await this.childInteractionsRepository.deleteChildInteractionByEventId(t);
  }
  async saveVisibleDirectReplies(e, t, o) {
    const n = /* @__PURE__ */ new Map();
    for (const i of e) {
      const f = n.get(i.parentEventId) ?? [];
      f.push({
        event: i.event,
        ...i.relayUrls ? { relayUrls: i.relayUrls } : {}
      }), n.set(i.parentEventId, f);
    }
    const s = [];
    let c = 0;
    for (const [i, f] of n.entries()) {
      if (!o())
        break;
      const u = await this.childInteractionsRepository.upsertChildInteractions({
        parentEventId: i,
        events: f,
        fetchedAt: t
      }), v = u.insertedCount + u.updatedCount;
      v > 0 && (s.push(i), c += v);
    }
    return {
      status: "saved",
      savedParentEventIds: s,
      savedDirectReplyCount: c
    };
  }
}
const Ar = new kr(), Ft = 150, Je = 30, Ge = 10, bt = 2, wt = 250, Tr = 6e3, _t = 8, Hr = 6e4, Or = Mt, Rt = {
  status: "success",
  targetParentEventIds: [],
  checkedParentEventIds: [],
  savedParentEventIds: [],
  savedDirectReplyCount: 0,
  attemptedChunkCount: 0,
  saturatedChunkCount: 0,
  incompleteParentEventIds: [],
  deletionConfirmationIncomplete: !1
};
function Dr() {
  const r = Math.random().toString(36).slice(2, 10);
  return `post-history-visible-relation-repair-${Date.now().toString(36)}-${r}`;
}
function Mr(r, e) {
  const t = /* @__PURE__ */ new Map();
  for (const o of e)
    if (!(o.kind !== 1 && o.kind !== 42 || o.pubkeyHex !== r || !o.eventId || t.has(o.eventId)) && (t.set(o.eventId, o), t.size >= Ft))
      break;
  return Array.from(t.values());
}
function it(r, e) {
  const t = [];
  for (let o = 0; o < r.length; o += e)
    t.push(r.slice(o, o + e));
  return t;
}
function Ur(r, e) {
  return e.includeDirectReplies ? [1, 42].flatMap(
    (t) => it(
      r.filter((o) => o.kind === t),
      Je
    ).map((o) => ({ posts: o, depth: 0 }))
  ) : it(
    r,
    Je
  ).map((t) => ({ posts: t, depth: 0 }));
}
function Fr(r) {
  return Array.from(r.values()).map((e) => ({
    event: e.event,
    relayUrls: Array.from(e.relayUrls).sort((t, o) => t.localeCompare(o))
  })).sort((e, t) => e.event.created_at !== t.event.created_at ? t.event.created_at - e.event.created_at : e.event.id.localeCompare(t.event.id));
}
class Lr {
  directReplySaveService;
  childInteractionsRepository;
  quoteVisibleRangeRepairExecutor;
  console;
  setTimeoutFn;
  clearTimeoutFn;
  now;
  lastFetchTimeoutWarnAt = 0;
  constructor(e = {}) {
    this.directReplySaveService = e.directReplySaveService ?? Ar, this.childInteractionsRepository = e.childInteractionsRepository ?? St, this.quoteVisibleRangeRepairExecutor = e.quoteVisibleRangeRepairExecutor, this.console = e.console ?? (typeof globalThis.console < "u" ? globalThis.console : { warn: () => {
    }, error: () => {
    } }), this.setTimeoutFn = e.setTimeoutFn ?? ((t, o) => setTimeout(t, o)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((t) => clearTimeout(t)), this.now = e.now ?? Date.now;
  }
  repairVisibleRangeChildInteractions(e, t) {
    return this.repairVisibleRangeChildInteractionsInternal(
      e,
      t,
      {
        includeDirectReplies: !0,
        includeReactions: !0
      }
    );
  }
  repairRelatedCardReactions(e, t) {
    let o = !0;
    const n = /* @__PURE__ */ new Set(), s = () => o && t.isActive?.() !== !1, c = /* @__PURE__ */ new Map();
    for (const v of t.targets) {
      if (!v.eventId) continue;
      const a = c.get(v.eventId);
      c.set(v.eventId, {
        eventId: v.eventId,
        relayHints: se.sanitizeExternalRelayUrls([
          ...a?.relayHints ?? [],
          ...v.relayHints
        ])
      });
    }
    const i = Array.from(c.values()).slice(
      0,
      Ft
    ), f = i.map((v) => v.eventId);
    return {
      promise: (async () => {
        if (i.length === 0)
          return { status: "success", targetEventIds: f };
        let v = !1;
        const a = [];
        for (let d = 0; d < i.length; d += Je)
          a.push(i.slice(d, d + Je).map((I) => ({
            eventId: I.eventId,
            kind: 1,
            relayHints: I.relayHints
          })));
        let w = 0;
        const l = async (d, I) => {
          if (!s()) return;
          const T = this.fetchCandidates(e, d, t.relayConfig, {
            includeDirectReplies: !1,
            includeReactions: !0
          });
          n.add(T);
          const g = await T.promise;
          if (n.delete(T), !s() || g.status === "cancelled") return;
          const H = I === 0 && g.requiresFallback;
          g.status !== "success" && !H && (v = !0);
          const M = this.toReactionItems(d, g.items);
          if (M.length > 0 && await this.saveReactionInteractions(M, g.fetchedAt, s), g.requiresFallback)
            if (I === 0)
              for (let F = 0; F < d.length; F += Ge)
                await l(d.slice(F, F + Ge), 1);
            else g.coverageSaturated && (v = !0);
        }, x = async () => {
          for (; s(); ) {
            const d = a[w++];
            if (!d) return;
            await l(d, 0);
          }
        };
        return await Promise.all(Array.from({
          length: Math.min(bt, a.length)
        }, () => x())), {
          status: s() ? v ? "partial" : "success" : "cancelled",
          targetEventIds: f
        };
      })(),
      cancel: () => {
        o = !1, n.forEach((v) => v.cancel());
      }
    };
  }
  repairVisibleRangeRelations(e, t) {
    const o = Ut(
      t.relationKinds ?? Or
    ), n = this.repairVisibleRangeChildInteractionsInternal(
      e,
      t,
      {
        includeDirectReplies: o.includes("reply"),
        includeReactions: o.includes("reaction")
      }
    );
    return {
      promise: (async () => {
        const c = await n.promise;
        let i = !1;
        const f = t.quoteVisibleRangeRepairExecutor ?? this.quoteVisibleRangeRepairExecutor;
        return o.includes("quote") && c.status !== "cancelled" && t.isActive?.() !== !1 && f && (await f(e, t), i = !0), {
          ...c,
          relationKinds: o,
          quoteRepairApplied: i
        };
      })(),
      cancel: () => n.cancel()
    };
  }
  repairVisibleRangeChildInteractionsInternal(e, t, o) {
    let n = !0;
    const s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), i = () => n && t.isActive?.() !== !1, f = Mr(t.ownerPubkeyHex, t.visiblePosts), u = f.map((a) => a.eventId);
    return {
      promise: (async () => {
        if (f.length === 0)
          return {
            ...Rt,
            targetParentEventIds: u
          };
        const a = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Set();
        let l = 0, x = 0, d = 0, I = !1, T = !1;
        const g = async (F) => {
          const W = [];
          let Q = 0;
          const m = Math.min(
            bt,
            F.length
          ), h = async () => {
            for (; i(); ) {
              const S = F[Q++];
              if (!S)
                return;
              x += 1;
              const y = this.fetchCandidates(
                e,
                S.posts,
                t.relayConfig,
                o
              );
              s.add(y);
              const b = await y.promise;
              if (s.delete(y), !i() || b.status === "cancelled")
                return;
              const A = S.depth === 0 && b.requiresFallback;
              b.status !== "success" && !A && (T = !0), b.requiresFallback && (d += 1, S.depth === 0 ? W.push(
                ...it(
                  S.posts,
                  Ge
                ).map((E) => ({ posts: E, depth: 1 }))
              ) : b.coverageSaturated && (T = !0));
              const P = o.includeDirectReplies ? this.toDirectReplyItems(
                S.posts,
                b.items
              ) : [], L = o.includeReactions ? this.toReactionItems(
                S.posts,
                b.items
              ) : [], O = b.status === "success" && !b.coverageSaturated && !(S.depth === 0 && b.requiresFallback);
              if (P.length === 0 && L.length === 0) {
                O && S.posts.forEach((E) => w.add(E.eventId));
                continue;
              }
              if (P.length > 0) {
                const E = this.directReplySaveService.saveRepairDirectReplies(e, {
                  items: P,
                  relayHints: [
                    ...this.collectParentRelayHints(S.posts),
                    ...b.relayUrls
                  ],
                  relayConfig: t.relayConfig,
                  fetchedAt: b.fetchedAt,
                  isActive: i
                });
                c.add(E);
                const D = await E.promise;
                if (c.delete(E), !i() || D.status === "cancelled")
                  return;
                D.savedParentEventIds.forEach(
                  (U) => a.add(U)
                ), l += D.savedDirectReplyCount, I = I || D.deletionConfirmationIncomplete;
              }
              if (L.length > 0) {
                const E = await this.saveReactionInteractions(
                  L,
                  b.fetchedAt,
                  i
                );
                if (!i())
                  return;
                E.savedParentEventIds.forEach(
                  (D) => a.add(D)
                );
              }
              O && S.posts.forEach((E) => w.add(E.eventId));
            }
          };
          return await Promise.all(Array.from({ length: m }, () => h())), W;
        }, H = await g(Ur(f, o));
        if (i() && H.length > 0 && await g(H), !i())
          return {
            ...Rt,
            status: "cancelled",
            targetParentEventIds: u,
            attemptedChunkCount: x,
            saturatedChunkCount: d,
            deletionConfirmationIncomplete: I
          };
        const M = u.filter(
          (F) => !w.has(F)
        );
        return {
          status: T || M.length > 0 ? "partial" : "success",
          targetParentEventIds: u,
          checkedParentEventIds: Array.from(w),
          savedParentEventIds: Array.from(a),
          savedDirectReplyCount: l,
          attemptedChunkCount: x,
          saturatedChunkCount: d,
          incompleteParentEventIds: M,
          deletionConfirmationIncomplete: I
        };
      })(),
      cancel: () => {
        n = !1, s.forEach((a) => a.cancel()), c.forEach((a) => a.cancel());
      }
    };
  }
  toDirectReplyItems(e, t) {
    const o = new Map(e.flatMap((n) => {
      const s = nn({
        event: {
          id: n.eventId,
          kind: n.kind,
          tags: n.tags,
          created_at: n.createdAt
        },
        relayHints: [
          ...n.relayHints,
          ...n.acceptedRelays,
          ...n.fetchedRelays ?? []
        ]
      });
      return s ? [[n.eventId, s]] : [];
    }));
    return t.flatMap((n) => {
      const s = wn(n.event).parentId, c = s ? o.get(s) : null;
      return !s || !c || !rn({ child: n.event, parent: c }).valid ? [] : [{
        parentEventId: s,
        event: n.event,
        relayUrls: n.relayUrls
      }];
    });
  }
  toReactionItems(e, t) {
    const o = new Set(e.map((n) => n.eventId));
    return t.flatMap((n) => {
      if (n.event.kind !== 7)
        return [];
      const s = _n(n.event);
      return !s || !o.has(s) || n.event.id === s ? [] : [{
        parentEventId: s,
        event: n.event,
        relayUrls: n.relayUrls
      }];
    });
  }
  async saveReactionInteractions(e, t, o) {
    const n = /* @__PURE__ */ new Map();
    for (const c of e) {
      const i = n.get(c.parentEventId) ?? [];
      i.push({
        event: c.event,
        relayUrls: c.relayUrls
      }), n.set(c.parentEventId, i);
    }
    const s = [];
    for (const [c, i] of n.entries()) {
      if (!o())
        break;
      const f = await this.childInteractionsRepository.upsertChildInteractions({
        parentEventId: c,
        events: i,
        fetchedAt: t
      });
      f.insertedCount + f.updatedCount > 0 && s.push(c);
    }
    return {
      savedParentEventIds: s
    };
  }
  fetchCandidates(e, t, o, n) {
    const s = this.resolveRelayPlan(t, o), { destinationRelayUrls: c, coverageRelayUrls: i } = s, f = t.map((A) => A.eventId), u = Dr(), v = `${u}:0`, a = on(u), w = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Set();
    let g = 0, H = !1, M, F, W, Q, m, h;
    const S = () => {
      m !== void 0 && (this.clearTimeoutFn(m), m = void 0), M?.unsubscribe?.(), M = void 0, F?.unsubscribe?.(), F = void 0, W?.unsubscribe?.(), W = void 0, Q?.unsubscribe?.(), Q = void 0;
    }, y = (A) => {
      const P = Fr(w), L = new Set(
        Array.from(l.entries()).filter(([, U]) => U >= wt).map(([U]) => U)
      ), O = i.some(
        (U) => L.has(U)
      ), E = i.length > 0 && i.every((U) => x.has(U));
      return {
        status: A === "cancelled" ? "cancelled" : A === "error" ? "error" : E ? "success" : "partial",
        items: P,
        rawCount: g,
        requiresFallback: L.size > 0,
        coverageSaturated: O,
        fetchedAt: this.now(),
        relayUrls: c,
        eoseRelayUrls: Array.from(x).sort(),
        closedRelayUrls: Array.from(d).sort(),
        errorRelayUrls: Array.from(I).sort(),
        downRelayUrls: Array.from(T).sort(),
        perRelayRawCounts: Array.from(l.entries()).map(([U, q]) => ({ relayUrl: U, rawCount: q })).sort((U, q) => U.relayUrl.localeCompare(q.relayUrl))
      };
    };
    return {
      promise: new Promise((A) => {
        const P = (L) => {
          H || (H = !0, S(), A(y(L)));
        };
        h = P;
        try {
          if (f.length === 0) {
            P("complete");
            return;
          }
          F = e.createAllMessageObservable?.().subscribe({
            next: (O) => {
              this.handleCandidateMessagePacket({
                packet: O,
                targetSubId: v,
                destinationRelayUrls: c,
                eoseRelayUrls: x,
                closedRelayUrls: d,
                perRelayRawCounts: l
              });
            }
          }), W = e.createAllErrorObservable?.().subscribe({
            next: (O) => {
              const E = this.sanitizeCandidateRelayUrl(O.from, c);
              E && I.add(E);
            }
          }), Q = e.createConnectionStateObservable?.().subscribe({
            next: (O) => {
              const E = this.sanitizeCandidateRelayUrl(O.from, c);
              E && (O.state === "error" || O.state === "rejected" || O.state === "terminated") && T.add(E);
            }
          }), M = sn(e, a, {
            on: c.length > 0 ? { relays: c } : { defaultReadRelays: !0 }
          }).subscribe({
            next: (O) => {
              g += 1;
              const E = this.sanitizeCandidateRelayUrl(
                O.from,
                c
              );
              this.handleCandidatePacket(w, O, E);
            },
            complete: () => P("complete"),
            error: (O) => {
              this.console.error("post_history_visible_child_interaction_repair_fetch_error", O), P("error");
            }
          });
          const L = Array.from(/* @__PURE__ */ new Set([
            ...n.includeDirectReplies ? t.map((O) => O.kind) : [],
            ...n.includeReactions ? [7] : []
          ])).filter((O) => O === 1 || O === 7 || O === 42);
          a.emit({
            kinds: L,
            "#e": f,
            limit: wt
          }), a.over(), m = this.setTimeoutFn(() => {
            i.length > 0 && i.every((E) => x.has(E)) || this.warnCandidateFetchTimeout(), P("timeout");
          }, Tr);
        } catch (L) {
          this.console.error("post_history_visible_child_interaction_repair_request_error", L), P("error");
        }
      }),
      cancel: () => h?.("cancelled")
    };
  }
  warnCandidateFetchTimeout() {
    const e = this.now();
    e - this.lastFetchTimeoutWarnAt < Hr || (this.lastFetchTimeoutWarnAt = e, this.console.warn("post_history_visible_child_interaction_repair_fetch_timeout"));
  }
  handleCandidatePacket(e, t, o) {
    const n = t.event;
    if (!n?.id || n.kind !== 1 && n.kind !== 7 && n.kind !== 42)
      return;
    const s = e.get(n.id);
    if (!s) {
      e.set(n.id, {
        event: n,
        relayUrls: new Set(o ? [o] : [])
      });
      return;
    }
    if (!Rn(s.event, n)) {
      this.console.warn("post_history_visible_child_interaction_repair_packet_conflict");
      return;
    }
    o && s.relayUrls.add(o);
  }
  collectParentRelayHints(e) {
    return e.flatMap((t) => [
      ...t.relayHints ?? [],
      ...t.acceptedRelays ?? [],
      ...t.fetchedRelays ?? []
    ]);
  }
  handleCandidateMessagePacket(e) {
    const t = this.sanitizeCandidateRelayUrl(
      e.packet.from,
      e.destinationRelayUrls
    );
    if (t) {
      if (e.packet.type === "EVENT" && e.packet.subId === e.targetSubId) {
        e.perRelayRawCounts.set(
          t,
          (e.perRelayRawCounts.get(t) ?? 0) + 1
        );
        return;
      }
      if (e.packet.type === "EOSE" && e.packet.subId === e.targetSubId) {
        e.eoseRelayUrls.add(t);
        return;
      }
      e.packet.type === "CLOSED" && e.packet.subId === e.targetSubId && e.closedRelayUrls.add(t);
    }
  }
  sanitizeCandidateRelayUrl(e, t) {
    const o = se.sanitizeExternalRelayUrls(
      typeof e == "string" ? [e] : [],
      { limit: 1 }
    )[0] ?? null;
    return o && t.includes(o) ? o : null;
  }
  resolveRelayPlan(e, t) {
    const o = this.collectParentRelayHints(e), n = ln(
      o,
      _t
    );
    if (n !== null)
      return {
        destinationRelayUrls: n,
        coverageRelayUrls: an()
      };
    const s = t ? se.sanitizeExternalRelayUrls(
      se.extractReadRelays(t)
    ) : [], c = t ? se.sanitizeExternalRelayUrls(
      se.extractWriteRelays(t)
    ) : [], i = se.sanitizeExternalRelayUrls(In), f = s.length > 0 ? s : c.length > 0 ? c : i, u = s.length > 0 ? c.filter((a) => !f.includes(a)) : [], v = se.sanitizeExternalRelayUrls(
      o,
      { limit: _t }
    );
    return {
      coverageRelayUrls: f,
      destinationRelayUrls: se.sanitizeExternalRelayUrls([
        ...f,
        ...u,
        ...v
      ])
    };
  }
}
const Nr = new Lr();
function ao({ getShow: r, getPosts: e, getContainer: t, maxLines: o = 5 }) {
  let n = fe(ot({})), s = fe(ot({})), c = {}, i = null, f = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set(), v = !1, a = null, w = 0;
  function l(h) {
    const S = getComputedStyle(h), y = parseFloat(S.lineHeight);
    if (!y || Number.isNaN(y)) {
      const b = parseFloat(S.fontSize);
      return b && !Number.isNaN(b) ? b * 1.5 : 24;
    }
    return y;
  }
  function x(h, S) {
    return c[S] = h, g(S), {
      destroy() {
        c[S] === h && delete c[S];
      }
    };
  }
  function d(h) {
    const S = Object.keys(p(n)), y = Object.keys(h);
    S.length === y.length && S.every((b) => p(n)[b] === h[b]) || B(n, h, !0);
  }
  function I() {
    if (!r()) {
      u.clear(), v = !1, d({});
      return;
    }
    const h = e(), S = u, y = v;
    u = /* @__PURE__ */ new Set(), v = !1;
    const b = {};
    let A;
    for (const P of h) {
      if (P.forceCollapsible)
        continue;
      if (!y && !S.has(P.eventId)) {
        const D = p(n)[P.eventId];
        D !== void 0 && (b[P.eventId] = D);
        continue;
      }
      const L = c[P.eventId];
      if (!L)
        continue;
      A ??= l(L);
      const O = A * o, E = L.scrollHeight > 0;
      b[P.eventId] = E ? L.scrollHeight > O + 0.5 : P.content.split(`
`).length > o;
    }
    d(b);
  }
  function T() {
    if (a)
      return a;
    const h = ++w, S = Tt().then(() => {
      h === w && (a = null, I());
    });
    return a = S, S;
  }
  function g(h) {
    return h ? u.add(h) : v = !0, T();
  }
  function H() {
    const h = t();
    typeof ResizeObserver > "u" || !h || i || (i = new ResizeObserver(() => {
      g();
    }), i.observe(h));
  }
  function M() {
    i?.disconnect(), i = null;
  }
  function F() {
    d({}), B(s, {}, !0), c = {}, f.clear(), u.clear(), v = !1, M();
  }
  function W(h) {
    return p(s)[h.eventId] ?? !1;
  }
  function Q(h) {
    B(
      s,
      {
        ...p(s),
        [h]: !p(s)[h]
      },
      !0
    );
  }
  function m(h) {
    return h.forceCollapsible === !0 || (p(n)[h.eventId] ?? !1);
  }
  return $e(() => {
    r() || F();
  }), $e(() => {
    if (!r())
      return;
    const h = e(), S = /* @__PURE__ */ new Map();
    for (const y of h) {
      const b = {
        content: y.content,
        forceCollapsible: y.forceCollapsible
      }, A = f.get(y.eventId);
      (A?.content !== b.content || A.forceCollapsible !== b.forceCollapsible) && u.add(y.eventId), S.set(y.eventId, b);
    }
    f = S, T();
  }), $e(() => {
    if (!(!r() || !t()))
      return H(), () => {
        M();
      };
  }), Et(() => {
    M();
  }), {
    previewRef: x,
    isPostExpanded: W,
    remeasure: () => g(),
    togglePostExpanded: Q,
    shouldCollapsePost: m
  };
}
function lo(r) {
  let e = fe({}), t = fe({}), o = fe({}), n = fe(0), s = 0;
  const c = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Map();
  let u = null;
  const v = r.source ?? "related-card-display", a = r.profileSync.subscribe((I, T) => {
    B(t, { ...p(t), [I]: T });
  }), w = () => {
    B(n, p(n) + 1);
  }, l = () => {
    document.visibilityState === "visible" && B(n, p(n) + 1);
  };
  typeof window < "u" && (window.addEventListener("online", w), document.addEventListener("visibilitychange", l)), Et(() => {
    s += 1, u?.cancel(), typeof window < "u" && (window.removeEventListener("online", w), document.removeEventListener("visibilitychange", l)), a();
  });
  function x(I) {
    return p(o)[I] ? lr(p(e)[I] ?? [], p(t)) : null;
  }
  function d(I) {
    return !!p(o)[I];
  }
  return $e(() => {
    const I = r.getShow(), T = r.getPubkeyHex() ?? "", g = r.getRxNostr(), H = r.getRelayConfig(), M = r.getTargets(), F = p(n);
    if (!I) {
      s += 1, u?.cancel(), u = null, c.clear(), f.clear(), B(e, {}), B(o, {});
      return;
    }
    const W = ++s;
    let Q = !0, m = null;
    const h = () => Q && W === s && r.getShow() && (r.getPubkeyHex() ?? "") === T && r.getRxNostr() === g, S = /* @__PURE__ */ new Map();
    for (const E of M) {
      if (!E.eventId) continue;
      const D = S.get(E.eventId);
      S.set(E.eventId, {
        eventId: E.eventId,
        relayHints: Array.from(/* @__PURE__ */ new Set([...D?.relayHints ?? [], ...E.relayHints])).sort()
      });
    }
    const y = Array.from(S.values()), b = y.map((E) => E.eventId), A = JSON.stringify(Object.entries(H ?? {}).sort(([E], [D]) => E.localeCompare(D))), P = (E) => JSON.stringify([E.eventId, E.relayHints, A]), L = (E) => JSON.stringify([P(E), F]), O = new Set(y.map((E) => E.eventId));
    for (const E of f.keys())
      O.has(E) || f.delete(E);
    return y.forEach((E) => f.set(E.eventId, L(E))), (async () => {
      const E = await _e.getReactionRecordsForParents?.(b) ?? (await Promise.all(b.map((k) => _e.getReactionRecords(k)))).flat();
      if (!h())
        return;
      const D = {};
      for (const k of b)
        D[k] = E.filter((j) => j.parentEventId === k);
      B(e, { ...p(e), ...D }), B(o, {
        ...p(o),
        ...Object.fromEntries(b.map((k) => [k, !0]))
      });
      for (const k of E) {
        const j = r.profileSync.ensureProfile(k.authorPubkey, k.relayUrls);
        j && B(t, { ...p(t), [k.authorPubkey]: j });
      }
      if (!g || b.length === 0 || (await ht({
        source: v,
        parentEventIds: b,
        rxNostr: g,
        relayConfig: H,
        isActive: h
      }), !h()))
        return;
      const U = await _e.getReactionRecordsForParents?.(b) ?? (await Promise.all(b.map((k) => _e.getReactionRecords(k)))).flat();
      if (!h())
        return;
      for (const k of b)
        D[k] = U.filter((j) => j.parentEventId === k);
      B(e, { ...p(e), ...D });
      const q = y.filter((k) => !c.has(P(k)) && !i.has(k.eventId));
      if (!q.length)
        return;
      q.forEach((k) => i.add(k.eventId));
      const G = new Map(q.map((k) => [k.eventId, L(k)]));
      m = Nr.repairRelatedCardReactions(g, { targets: q, relayConfig: H, isActive: h }), u = m;
      const te = await m.promise.catch(() => ({
        status: "partial",
        targetEventIds: q.map((k) => k.eventId)
      }));
      u === m && (u = null), m = null, q.forEach((k) => i.delete(k.eventId));
      const he = r.getShow() && (r.getPubkeyHex() ?? "") === T && r.getRxNostr() === g, ue = q.some((k) => {
        const j = f.get(k.eventId);
        return j !== void 0 && (te.status === "cancelled" || j !== G.get(k.eventId));
      });
      if (he && ue && B(n, p(n) + 1), !h() || te.status === "cancelled")
        return;
      if (te.status === "success") {
        const k = new Set(te.targetEventIds);
        q.filter((j) => k.has(j.eventId)).forEach((j) => c.add(P(j)));
      }
      const ye = await _e.getReactionRecordsForParents?.(b) ?? (await Promise.all(b.map((k) => _e.getReactionRecords(k)))).flat();
      if (!h())
        return;
      for (const k of b)
        D[k] = ye.filter((j) => j.parentEventId === k);
      B(e, { ...p(e), ...D });
      for (const k of ye) {
        const j = r.profileSync.ensureProfile(k.authorPubkey, k.relayUrls);
        j && B(t, { ...p(t), [k.authorPubkey]: j });
      }
      const Re = await ht({
        source: v,
        parentEventIds: b,
        rxNostr: g,
        relayConfig: H,
        isActive: h
      });
      if (h() && Re.deletedReactionEventIds.length > 0) {
        const k = await _e.getReactionRecordsForParents?.(b) ?? (await Promise.all(b.map((j) => _e.getReactionRecords(j)))).flat();
        if (!h())
          return;
        for (const j of b)
          D[j] = k.filter((oe) => oe.parentEventId === j);
        B(e, { ...p(e), ...D });
      }
    })().catch(() => {
    }), () => {
      Q = !1, m?.cancel(), u === m && (u = null);
    };
  }), { getReadModel: x, isLoaded: d };
}
const $r = [1, 42];
function jr() {
  return {
    log: () => {
    },
    warn: () => {
    },
    error: () => {
    }
  };
}
function zr(r, e) {
  return !e || r.pubkeyHex !== e || typeof r.deletedAt == "number" ? !1 : $r.includes(r.kind) && typeof r.eventId == "string" && r.eventId.length > 0;
}
function qr(r, e = Math.floor(Date.now() / 1e3)) {
  return {
    kind: 5,
    pubkey: r.pubkeyHex,
    content: "",
    tags: [["e", r.eventId], ["k", String(r.kind)]],
    created_at: e
  };
}
function Br(r, e) {
  return se.sanitizeExternalRelayUrls([
    ...r.acceptedRelays ?? [],
    ...r.fetchedRelays ?? [],
    ...r.relayHints ?? [],
    ...r.kind === 42 ? r.channelRelayHints ?? [] : [],
    ...e
  ]);
}
class Kr {
  deps;
  constructor(e = {}) {
    this.deps = {
      authStateStore: e.authStateStore ?? un,
      keyManager: e.keyManager ?? dn,
      window: e.window ?? (typeof window < "u" ? window : {}),
      console: e.console ?? (typeof globalThis.console < "u" ? globalThis.console : jr()),
      seckeySignerFn: e.seckeySignerFn ?? cn,
      getNip46SignerForSessionFn: e.getNip46SignerForSessionFn ?? ((t) => vn.getSignerForSession(t)),
      getParentClientSignerFn: e.getParentClientSignerFn ?? (() => pn.getSigner()),
      writeRelaysStore: e.writeRelaysStore ?? Pt,
      postHistoryDeletionRequestsRepository: e.postHistoryDeletionRequestsRepository ?? Ct,
      eventSenderFactory: e.eventSenderFactory,
      now: e.now ?? Date.now
    };
  }
  async requestDeletion(e) {
    const t = this.deps.authStateStore.value, o = t.pubkey || null;
    if (!e.rxNostr)
      return { success: !1, error: "nostr_not_ready" };
    if (!t.isAuthenticated || !o)
      return { success: !1, error: "pubkey_not_found" };
    if (mn() && se.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore.value
    ).length === 0)
      return { success: !1, error: "no_write_relays" };
    const n = () => yn(
      this.deps.authStateStore,
      o
    );
    if (!zr(e.post, o))
      return { success: !1, error: "deletion_request_not_allowed" };
    let s;
    if (t.type === "nip46")
      try {
        n(), s = await this.deps.getNip46SignerForSessionFn(
          o
        );
        const x = this.deps.authStateStore.value;
        if (!s || !x.isAuthenticated || x.type !== "nip46" || x.pubkey !== o)
          return { success: !1, error: "nip46_signer_not_available" };
      } catch {
        return this.deps.console.error("post_deletion_nip46_signer_failed", {
          stage: "resolve-signer",
          reason: "unexpected"
        }), { success: !1, error: "post_error" };
      }
    const c = this.resolveSigner(t, s);
    if (c.error)
      return { success: !1, error: c.error };
    try {
      n();
    } catch {
      return { success: !1, error: "post_error" };
    }
    const i = qr(
      e.post,
      Math.floor(this.deps.now() / 1e3)
    );
    let f;
    try {
      n();
      const x = fn(i);
      f = await c.signEvent(x.signerTemplate), n(), f = gn(
        x.expectedTemplate,
        f,
        o
      ), n();
    } catch {
      return this.deps.console.error("post_deletion_sign_failed", {
        stage: "sign-event",
        reason: "unexpected"
      }), { success: !1, error: "post_error" };
    }
    const u = hn(
      f
    );
    if (!u)
      return { success: !1, error: "post_error" };
    const v = Br(
      e.post,
      this.deps.writeRelaysStore.value
    );
    let a;
    try {
      n(), a = await this.createEventSender(e.rxNostr).sendEvent(
        u.event,
        {
          targetRelays: v,
          includeDefaultWriteRelays: !0
        }
      );
    } catch {
      return this.deps.console.error("post_deletion_send_failed", {
        stage: "publish",
        reason: "unexpected"
      }), { success: !1, error: "post_error" };
    }
    if (!a.success)
      return a;
    const w = u.event.id ?? a.eventId;
    if (!w)
      return { success: !1, error: "post_error" };
    const l = this.deps.now();
    try {
      await this.deps.postHistoryDeletionRequestsRepository.saveLocalDeletion({
        targetEventId: e.post.eventId,
        deletionEvent: u.event,
        attestation: u.attestation,
        deletedAt: l,
        relayUrls: v
      });
    } catch {
      this.deps.console.warn("post_history_local_deletion_save_failed", {
        stage: "post-history",
        reason: "unexpected"
      });
    }
    return {
      ...a,
      eventId: w,
      deletionEventId: w,
      deletionEvent: u.event,
      deletionEventAttestation: u.attestation,
      deletedAt: l
    };
  }
  createEventSender(e) {
    return this.deps.eventSenderFactory ? this.deps.eventSenderFactory(e, this.deps.console) : new kt(e, this.deps.console);
  }
  resolveSigner(e, t) {
    if (e.type === "nip07") {
      const n = this.deps.window.nostr?.signEvent;
      return typeof n == "function" ? { signEvent: n.bind(this.deps.window.nostr) } : { error: "nostr_sign_event_not_supported" };
    }
    if (e.type === "nip46")
      return this.resolveExternalSigner(
        t,
        "nip46_signer_not_available"
      );
    if (e.type === "parentClient")
      return this.resolveExternalSigner(
        this.deps.getParentClientSignerFn(),
        "parent_client_signer_not_available"
      );
    const o = this.deps.keyManager.getFromStore() || this.deps.keyManager.loadFromStorage(e.pubkey);
    return o ? this.resolveExternalSigner(
      this.deps.seckeySignerFn(o),
      "nostr_sign_event_not_supported"
    ) : { error: "key_not_found" };
  }
  resolveExternalSigner(e, t) {
    return e ? typeof e.signEvent == "function" ? { signEvent: e.signEvent.bind(e) } : { error: "nostr_sign_event_not_supported" } : { error: t };
  }
}
const co = new Kr();
function Vr() {
  return {
    log: () => {
    },
    warn: () => {
    },
    error: () => {
    }
  };
}
function Wr(r) {
  const e = r.rawEvent;
  if (!e || typeof e != "object")
    return null;
  const t = e;
  return typeof t.id != "string" || typeof t.pubkey != "string" || typeof t.created_at != "number" || typeof t.kind != "number" || !Array.isArray(t.tags) || typeof t.content != "string" || typeof t.sig != "string" ? null : t;
}
class Yr {
  deps;
  constructor(e = {}) {
    this.deps = {
      writeRelaysStore: e.writeRelaysStore ?? Pt,
      console: e.console ?? (typeof globalThis.console < "u" ? globalThis.console : Vr())
    };
  }
  async broadcast(e) {
    if (!e.rxNostr)
      return { success: !1, error: "nostr_not_ready" };
    const t = e.rxNostr, o = Wr(e.post);
    if (!o)
      return { success: !1, error: "invalid_event" };
    const n = se.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore.value
    );
    return n.length === 0 ? { success: !1, error: "no_write_relays" } : new kt(t, this.deps.console).sendEvent(o, {
      targetRelays: n,
      includeDefaultWriteRelays: !1
    });
  }
}
const uo = new Yr();
export {
  Qe as A,
  Dt as D,
  mt as E,
  En as M,
  Kn as P,
  Ht as a,
  zn as b,
  er as c,
  br as d,
  Rr as e,
  so as f,
  Mt as g,
  lr as h,
  oo as i,
  ao as j,
  Qn as k,
  co as l,
  st as m,
  Ot as n,
  Cr as o,
  Nr as p,
  Gr as q,
  io as r,
  ro as s,
  zr as t,
  lo as u,
  no as v,
  uo as w,
  to as x,
  Wr as y,
  eo as z
};
