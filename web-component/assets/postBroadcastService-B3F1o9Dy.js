import { N as R, dV as Vt, bh as se, Q as de, bi as Ie, bj as Me, bk as ae, bl as De, bm as $e, bn as Qe, dW as Wt, dX as Qt, dY as Yt, cH as Jt, dZ as Zt, d_ as Xt, aV as We, d$ as Gt, e0 as ht, e1 as en, e2 as tn, M as ze, aS as Q, cc as Ye, cQ as tt, cN as nt, cO as rt, cP as ot, cR as At, T as ct, U as Te, c5 as dt, W as ut, aK as pt, _ as vt, $ as ft, e3 as st, e4 as nn, dx as Ht, dy as rn, dz as on, dB as Ae, b5 as sn, b4 as an, a0 as yt, aI as ln, V as mt, dE as cn, c$ as dn, cL as Ot, dC as Dt, dD as un, dv as pn, dt as vn, du as fn, e5 as gn, dw as hn, e6 as bt, v as Ge, w as Mt, i as yn, k as mn, a as bn, c_ as wt, al as wn, am as _n, d2 as _t, H as Rn, I as xn, J as In, P as Ft, bQ as Pn, d3 as Rt, K as Cn, L as Sn } from "./App-B2pbRRzr.js";
import { b7 as Xe, b0 as ye, b1 as V, b2 as U, b3 as P, b4 as me, b5 as x, b6 as be, a as u, b8 as z, n as he, b9 as $, aS as W, ba as q, aq as En, bl as Ut, aO as je, b as N, aT as ve, bf as ne, bh as Le, Z as te, bi as fe, ap as xt, ay as $t, bj as Ne, aK as at, bk as ce, bS as kn, b$ as Tn, c4 as An, bI as Hn } from "./entry-DeBeimY8.js";
import { D as On, a as Dn } from "./DialogWrapper-QD3vI8wE.js";
import { T as Mn, a as It, c as Pt, b as Fn } from "./tabs-trigger-D5kXxk46.js";
var Un = q("<div><!></div>");
function $n(o, e) {
  const t = Xe();
  ye(e, !0);
  let r = R(e, "child", 7), n = R(e, "children", 7), s = R(e, "ref", 15, null), c = R(e, "id", 23, () => Me(t)), a = R(e, "disabled", 7, !1), p = R(e, "onSelect", 7, Ie), v = R(e, "closeOnSelect", 7, !0), f = Qe(e, [
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
  const i = Vt.create({
    id: se(() => c()),
    disabled: se(() => a()),
    onSelect: se(() => p()),
    ref: se(() => s(), (y) => s(y)),
    closeOnSelect: se(() => v())
  }), C = W(() => $e(f, i.props));
  var l = {
    get child() {
      return r();
    },
    set child(y) {
      r(y), x();
    },
    get children() {
      return n();
    },
    set children(y) {
      n(y), x();
    },
    get ref() {
      return s();
    },
    set ref(y = null) {
      s(y), x();
    },
    get id() {
      return c();
    },
    set id(y = Me(t)) {
      c(y), x();
    },
    get disabled() {
      return a();
    },
    set disabled(y = !1) {
      a(y), x();
    },
    get onSelect() {
      return p();
    },
    set onSelect(y = Ie) {
      p(y), x();
    },
    get closeOnSelect() {
      return v();
    },
    set closeOnSelect(y = !0) {
      v(y), x();
    }
  }, S = V(), d = U(S);
  {
    var w = (y) => {
      var D = V(), F = U(D);
      ae(F, r, () => ({ props: u(C) })), P(y, D);
    }, H = (y) => {
      var D = Un();
      De(D, () => ({ ...u(C) }));
      var F = z(D);
      ae(F, () => n() ?? he), $(D), P(y, D);
    };
    de(d, (y) => {
      r() ? y(w) : y(H, -1);
    });
  }
  return P(o, S), me(l);
}
be(
  $n,
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
var jn = q("<div><!></div>");
function jt(o, e) {
  const t = Xe();
  ye(e, !0);
  let r = R(e, "ref", 15, null), n = R(e, "id", 23, () => Me(t)), s = R(e, "child", 7), c = R(e, "children", 7), a = Qe(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "id",
    "child",
    "children"
  ]);
  const p = Wt.create({
    id: se(() => n()),
    ref: se(() => r(), (d) => r(d))
  }), v = W(() => $e(a, p.props));
  var f = {
    get ref() {
      return r();
    },
    set ref(d = null) {
      r(d), x();
    },
    get id() {
      return n();
    },
    set id(d = Me(t)) {
      n(d), x();
    },
    get child() {
      return s();
    },
    set child(d) {
      s(d), x();
    },
    get children() {
      return c();
    },
    set children(d) {
      c(d), x();
    }
  }, i = V(), C = U(i);
  {
    var l = (d) => {
      var w = V(), H = U(w);
      ae(H, s, () => ({ props: u(v) })), P(d, w);
    }, S = (d) => {
      var w = jn();
      De(w, () => ({ ...u(v) }));
      var H = z(w);
      ae(H, () => c() ?? he), $(w), P(d, w);
    };
    de(C, (d) => {
      s() ? d(l) : d(S, -1);
    });
  }
  return P(o, i), me(f);
}
be(jt, { ref: {}, id: {}, child: {}, children: {} }, [], [], { mode: "open" });
function Lt(o, e) {
  ye(e, !0);
  let t = R(e, "open", 15, !1), r = R(e, "dir", 7, "ltr"), n = R(e, "onOpenChange", 7, Ie), s = R(e, "onOpenChangeComplete", 7, Ie), c = R(e, "_internal_variant", 7, "dropdown-menu"), a = R(e, "_internal_should_skip_exit_animation", 7, void 0), p = R(e, "children", 7);
  const v = Qt.create({
    variant: se(() => c()),
    dir: se(() => r()),
    // debugMode: boxWith(() => debugMode),
    onClose: () => {
      t(!1), n()(!1);
    },
    shouldSkipExitAnimation: () => a()?.() ?? !1
  });
  Yt.create(
    {
      open: se(() => t(), (i) => {
        t(i), n()(i);
      }),
      onOpenChangeComplete: se(() => s())
    },
    v
  );
  var f = {
    get open() {
      return t();
    },
    set open(i = !1) {
      t(i), x();
    },
    get dir() {
      return r();
    },
    set dir(i = "ltr") {
      r(i), x();
    },
    get onOpenChange() {
      return n();
    },
    set onOpenChange(i = Ie) {
      n(i), x();
    },
    get onOpenChangeComplete() {
      return s();
    },
    set onOpenChangeComplete(i = Ie) {
      s(i), x();
    },
    get _internal_variant() {
      return c();
    },
    set _internal_variant(i = "dropdown-menu") {
      c(i), x();
    },
    get _internal_should_skip_exit_animation() {
      return a();
    },
    set _internal_should_skip_exit_animation(i = void 0) {
      a(i), x();
    },
    get children() {
      return p();
    },
    set children(i) {
      p(i), x();
    }
  };
  return Jt(o, {
    children: (i, C) => {
      var l = V(), S = U(l);
      ae(S, () => p() ?? he), P(i, l);
    },
    $$slots: { default: !0 }
  }), me(f);
}
be(
  Lt,
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
var Ln = q("<div><div><!></div></div>"), Nn = q("<div><div><!></div></div>");
function Nt(o, e) {
  const t = Xe();
  ye(e, !0);
  let r = R(e, "id", 23, () => Me(t)), n = R(e, "child", 7), s = R(e, "children", 7), c = R(e, "ref", 15, null), a = R(e, "loop", 7, !0), p = R(e, "onInteractOutside", 7, Ie), v = R(e, "onEscapeKeydown", 7, Ie), f = R(e, "onCloseAutoFocus", 7, Ie), i = R(e, "forceMount", 7, !1), C = R(e, "trapFocus", 7, !1), l = R(e, "style", 7), S = Qe(e, [
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
  const d = Zt.create({
    id: se(() => r()),
    loop: se(() => a()),
    ref: se(() => c(), (_) => c(_)),
    onCloseAutoFocus: se(() => f())
  }), w = W(() => $e(S, d.props));
  function H(_) {
    if (d.handleInteractOutside(_), !_.defaultPrevented && (p()(_), !_.defaultPrevented)) {
      if (_.target && _.target instanceof Element) {
        const h = `[${d.parentMenu.root.getBitsAttr("sub-content")}]`;
        if (_.target.closest(h)) return;
      }
      d.parentMenu.onClose();
    }
  }
  function y(_) {
    v()(_), !_.defaultPrevented && d.parentMenu.onClose();
  }
  var D = {
    get id() {
      return r();
    },
    set id(_ = Me(t)) {
      r(_), x();
    },
    get child() {
      return n();
    },
    set child(_) {
      n(_), x();
    },
    get children() {
      return s();
    },
    set children(_) {
      s(_), x();
    },
    get ref() {
      return c();
    },
    set ref(_ = null) {
      c(_), x();
    },
    get loop() {
      return a();
    },
    set loop(_ = !0) {
      a(_), x();
    },
    get onInteractOutside() {
      return p();
    },
    set onInteractOutside(_ = Ie) {
      p(_), x();
    },
    get onEscapeKeydown() {
      return v();
    },
    set onEscapeKeydown(_ = Ie) {
      v(_), x();
    },
    get onCloseAutoFocus() {
      return f();
    },
    set onCloseAutoFocus(_ = Ie) {
      f(_), x();
    },
    get forceMount() {
      return i();
    },
    set forceMount(_ = !1) {
      i(_), x();
    },
    get trapFocus() {
      return C();
    },
    set trapFocus(_ = !1) {
      C(_), x();
    },
    get style() {
      return l();
    },
    set style(_) {
      l(_), x();
    }
  }, F = V(), L = U(F);
  {
    var Y = (_) => {
      Xt(_, We(() => u(w), () => d.popperProps, {
        get ref() {
          return d.opts.ref;
        },
        get enabled() {
          return d.parentMenu.opts.open.current;
        },
        onInteractOutside: H,
        onEscapeKeydown: y,
        get trapFocus() {
          return C();
        },
        get loop() {
          return a();
        },
        forceMount: !0,
        get id() {
          return r();
        },
        get shouldRender() {
          return d.shouldRender;
        },
        popper: (b, g) => {
          let m = () => g?.().props, T = () => g?.().wrapperProps;
          const E = W(() => $e(m(), { style: ht("dropdown-menu") }, { style: l() }));
          var M = V(), B = U(M);
          {
            var I = (O) => {
              var K = V(), X = U(K);
              {
                let ee = W(() => ({
                  props: u(E),
                  wrapperProps: T(),
                  ...d.snippetProps
                }));
                ae(X, n, () => u(ee));
              }
              P(O, K);
            }, k = (O) => {
              var K = Ln();
              De(K, () => ({ ...T() }));
              var X = z(K);
              De(X, () => ({ ...u(E) }));
              var ee = z(X);
              ae(ee, () => s() ?? he), $(X), $(K), P(O, K);
            };
            de(B, (O) => {
              n() ? O(I) : O(k, -1);
            });
          }
          P(b, M);
        },
        $$slots: { popper: !0 }
      }));
    }, J = (_) => {
      Gt(_, We(() => u(w), () => d.popperProps, {
        get ref() {
          return d.opts.ref;
        },
        get open() {
          return d.parentMenu.opts.open.current;
        },
        onInteractOutside: H,
        onEscapeKeydown: y,
        get trapFocus() {
          return C();
        },
        get loop() {
          return a();
        },
        forceMount: !1,
        get id() {
          return r();
        },
        get shouldRender() {
          return d.shouldRender;
        },
        popper: (b, g) => {
          let m = () => g?.().props, T = () => g?.().wrapperProps;
          const E = W(() => $e(m(), { style: ht("dropdown-menu") }, { style: l() }));
          var M = V(), B = U(M);
          {
            var I = (O) => {
              var K = V(), X = U(K);
              {
                let ee = W(() => ({
                  props: u(E),
                  wrapperProps: T(),
                  ...d.snippetProps
                }));
                ae(X, n, () => u(ee));
              }
              P(O, K);
            }, k = (O) => {
              var K = Nn();
              De(K, () => ({ ...T() }));
              var X = z(K);
              De(X, () => ({ ...u(E) }));
              var ee = z(X);
              ae(ee, () => s() ?? he), $(X), $(K), P(O, K);
            };
            de(B, (O) => {
              n() ? O(I) : O(k, -1);
            });
          }
          P(b, M);
        },
        $$slots: { popper: !0 }
      }));
    };
    de(L, (_) => {
      i() ? _(Y) : i() || _(J, 1);
    });
  }
  return P(o, F), me(D);
}
be(
  Nt,
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
var zn = q("<button><!></button>");
function it(o, e) {
  const t = Xe();
  ye(e, !0);
  let r = R(e, "id", 23, () => Me(t)), n = R(e, "ref", 15, null), s = R(e, "child", 7), c = R(e, "children", 7), a = R(e, "disabled", 7, !1), p = R(e, "type", 7, "button"), v = Qe(e, [
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
  const f = en.create({
    id: se(() => r()),
    disabled: se(() => a() ?? !1),
    ref: se(() => n(), (l) => n(l))
  }), i = W(() => $e(v, f.props, { type: p() }));
  var C = {
    get id() {
      return r();
    },
    set id(l = Me(t)) {
      r(l), x();
    },
    get ref() {
      return n();
    },
    set ref(l = null) {
      n(l), x();
    },
    get child() {
      return s();
    },
    set child(l) {
      s(l), x();
    },
    get children() {
      return c();
    },
    set children(l) {
      c(l), x();
    },
    get disabled() {
      return a();
    },
    set disabled(l = !1) {
      a(l), x();
    },
    get type() {
      return p();
    },
    set type(l = "button") {
      p(l), x();
    }
  };
  return tn(o, {
    get id() {
      return r();
    },
    get ref() {
      return f.opts.ref;
    },
    children: (l, S) => {
      var d = V(), w = U(d);
      {
        var H = (D) => {
          var F = V(), L = U(F);
          ae(L, s, () => ({ props: u(i) })), P(D, F);
        }, y = (D) => {
          var F = zn();
          De(F, () => ({ ...u(i) }));
          var L = z(F);
          ae(L, () => c() ?? he), $(F), P(D, F);
        };
        de(w, (D) => {
          s() ? D(H) : D(y, -1);
        });
      }
      P(l, d);
    },
    $$slots: { default: !0 }
  }), me(C);
}
be(
  it,
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
var qn = q('<div class="more-icon svg-icon"></div>'), Kn = q("<!> <!>", 1), Bn = q('<div class="more-icon svg-icon"></div>'), Vn = q('<div class="post-history-menu-timestamp"> </div> <!>', 1), Wn = q('<div class="post-history-menu-body"><!> <!></div>'), Qn = q("<!> <!>", 1), Yn = q('<button><div class="more-icon svg-icon"></div></button>'), Jn = q("<!> <!>", 1), Zn = q('<button type="button" aria-haspopup="menu"><div class="more-icon svg-icon"></div></button>');
const Xn = {
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
function Gn(o, e) {
  ye(e, !0), ze(o, Xn);
  let t = R(e, "open", 7, !1), r = R(e, "onOpenChange", 7, void 0), n = R(e, "triggerAriaLabel", 7), s = R(e, "triggerClassName", 7, ""), c = R(e, "align", 7, "start"), a = R(e, "timestamp", 7, void 0), p = R(e, "items", 7, void 0), v = R(e, "tooltipContent", 7, void 0), f = R(e, "enableTooltip", 7, !1), i = R(e, "lazy", 7, !1);
  const C = Ut().overlayTarget;
  let l = ve(!1), S = ve(!1), d = ve(null), w = W(() => !i() || u(l) || t()), H = !1;
  je(() => {
    t() !== H && (H = t(), N(S, t()));
  });
  function y(g) {
    N(S, g, !0), r()?.(g);
  }
  async function D(g, m) {
    typeof m == "function" && m(g);
    const T = typeof r() == "function";
    N(l, !0), await $t(), T && (N(S, !0), r()(!0)), u(d) && (u(d).focus({ preventScroll: !0 }), T || u(d).click());
  }
  function F(g) {
    g.key === "ArrowDown" && (g.preventDefault(), D(g));
  }
  var L = {
    get open() {
      return t();
    },
    set open(g = !1) {
      t(g), x();
    },
    get onOpenChange() {
      return r();
    },
    set onOpenChange(g = void 0) {
      r(g), x();
    },
    get triggerAriaLabel() {
      return n();
    },
    set triggerAriaLabel(g) {
      n(g), x();
    },
    get triggerClassName() {
      return s();
    },
    set triggerClassName(g = "") {
      s(g), x();
    },
    get align() {
      return c();
    },
    set align(g = "start") {
      c(g), x();
    },
    get timestamp() {
      return a();
    },
    set timestamp(g = void 0) {
      a(g), x();
    },
    get items() {
      return p();
    },
    set items(g = void 0) {
      p(g), x();
    },
    get tooltipContent() {
      return v();
    },
    set tooltipContent(g = void 0) {
      v(g), x();
    },
    get enableTooltip() {
      return f();
    },
    set enableTooltip(g = !1) {
      f(g), x();
    },
    get lazy() {
      return i();
    },
    set lazy(g = !1) {
      i(g), x();
    }
  }, Y = V(), J = U(Y);
  {
    var _ = (g) => {
      var m = V(), T = U(m);
      Q(T, () => Lt, (E, M) => {
        M(E, {
          get open() {
            return u(S);
          },
          onOpenChange: y,
          children: (B, I) => {
            var k = Qn(), O = U(k);
            {
              var K = (G) => {
                var Z = V(), re = U(Z);
                Q(re, () => tt, (we, A) => {
                  A(we, {
                    children: (j, ue) => {
                      var Pe = V(), ie = U(Pe);
                      Q(ie, () => nt, (ke, Ce) => {
                        Ce(ke, {
                          delayDuration: 500,
                          children: (oe, _e) => {
                            var Se = Kn(), Re = U(Se);
                            {
                              const le = (ge, Ee) => {
                                let He = () => Ee?.().props;
                                const xe = W(() => {
                                  const { onclick: qe, ...Ke } = He();
                                  return { tooltipOnclick: qe, restProps: Ke };
                                });
                                var Ue = V(), Fe = U(Ue);
                                {
                                  let qe = W(() => `menu-trigger post-history-menu-trigger ${s()} ${u(S) ? "is-open" : ""}`.trim());
                                  Q(Fe, () => it, (Ke, gt) => {
                                    gt(Ke, We(
                                      {
                                        get class() {
                                          return u(qe);
                                        },
                                        get "aria-label"() {
                                          return n();
                                        }
                                      },
                                      () => u(xe).restProps,
                                      {
                                        onclick: (Oe) => {
                                          typeof u(xe).tooltipOnclick == "function" && u(xe).tooltipOnclick(Oe);
                                        },
                                        get ref() {
                                          return u(d);
                                        },
                                        set ref(Oe) {
                                          N(d, Oe, !0);
                                        },
                                        children: (Oe, po) => {
                                          var Bt = qn();
                                          P(Oe, Bt);
                                        },
                                        $$slots: { default: !0 }
                                      }
                                    ));
                                  });
                                }
                                P(ge, Ue);
                              };
                              Q(Re, () => rt, (ge, Ee) => {
                                Ee(ge, { child: le, $$slots: { child: !0 } });
                              });
                            }
                            var pe = ne(Re, 2);
                            Q(pe, () => Ye, (le, ge) => {
                              ge(le, {
                                get to() {
                                  return C;
                                },
                                children: (Ee, He) => {
                                  var xe = V(), Ue = U(xe);
                                  Q(Ue, () => ot, (Fe, qe) => {
                                    qe(Fe, {
                                      sideOffset: 8,
                                      class: "tooltip-content post-preview-tooltip-content",
                                      children: (Ke, gt) => {
                                        Ne();
                                        var Oe = Le();
                                        te(() => fe(Oe, v())), P(Ke, Oe);
                                      },
                                      $$slots: { default: !0 }
                                    });
                                  }), P(Ee, xe);
                                },
                                $$slots: { default: !0 }
                              });
                            }), P(oe, Se);
                          },
                          $$slots: { default: !0 }
                        });
                      }), P(j, Pe);
                    },
                    $$slots: { default: !0 }
                  });
                }), P(G, Z);
              }, X = (G) => {
                var Z = V(), re = U(Z);
                {
                  let we = W(() => `menu-trigger post-history-menu-trigger ${s()} ${u(S) ? "is-open" : ""}`.trim());
                  Q(re, () => it, (A, j) => {
                    j(A, {
                      get class() {
                        return u(we);
                      },
                      get "aria-label"() {
                        return n();
                      },
                      get ref() {
                        return u(d);
                      },
                      set ref(ue) {
                        N(d, ue, !0);
                      },
                      children: (ue, Pe) => {
                        var ie = Bn();
                        P(ue, ie);
                      },
                      $$slots: { default: !0 }
                    });
                  });
                }
                P(G, Z);
              };
              de(O, (G) => {
                f() && v() ? G(K) : G(X, -1);
              });
            }
            var ee = ne(O, 2);
            Q(ee, () => Ye, (G, Z) => {
              Z(G, {
                get to() {
                  return C;
                },
                children: (re, we) => {
                  var A = V(), j = U(A);
                  Q(j, () => Nt, (ue, Pe) => {
                    Pe(ue, {
                      side: "bottom",
                      get align() {
                        return c();
                      },
                      sideOffset: 8,
                      class: "post-history-menu-content",
                      trapFocus: !1,
                      preventScroll: !1,
                      onCloseAutoFocus: (ie) => ie.preventDefault(),
                      children: (ie, ke) => {
                        var Ce = Wn(), oe = z(Ce);
                        {
                          var _e = (Re) => {
                            var pe = Vn(), le = U(pe), ge = z(le, !0);
                            $(le);
                            var Ee = ne(le, 2);
                            Q(Ee, () => jt, (He, xe) => {
                              xe(He, { class: "post-history-menu-separator" });
                            }), te(() => fe(ge, a())), P(Re, pe);
                          };
                          de(oe, (Re) => {
                            a() && Re(_e);
                          });
                        }
                        var Se = ne(oe, 2);
                        ae(Se, () => p() ?? he), $(Ce), P(ie, Ce);
                      },
                      $$slots: { default: !0 }
                    });
                  }), P(re, A);
                },
                $$slots: { default: !0 }
              });
            }), P(B, k);
          },
          $$slots: { default: !0 }
        });
      }), P(g, m);
    }, h = (g) => {
      var m = V(), T = U(m);
      Q(T, () => tt, (E, M) => {
        M(E, {
          children: (B, I) => {
            var k = V(), O = U(k);
            Q(O, () => nt, (K, X) => {
              X(K, {
                delayDuration: 500,
                children: (ee, G) => {
                  var Z = Jn(), re = U(Z);
                  {
                    const A = (j, ue) => {
                      let Pe = () => ue?.().props;
                      const ie = W(() => {
                        const { onclick: oe, ..._e } = Pe();
                        return { tooltipOnclick: oe, restProps: _e };
                      });
                      var ke = Yn(), Ce = (oe) => void D(oe, u(ie).tooltipOnclick);
                      De(
                        ke,
                        (oe) => ({
                          type: "button",
                          class: oe,
                          "aria-label": n(),
                          "aria-haspopup": "menu",
                          "aria-expanded": u(S),
                          ...u(ie).restProps,
                          onclick: Ce,
                          onkeydown: F
                        }),
                        [
                          () => `menu-trigger post-history-menu-trigger ${s()}`.trim()
                        ]
                      ), P(j, ke);
                    };
                    Q(re, () => rt, (j, ue) => {
                      ue(j, { child: A, $$slots: { child: !0 } });
                    });
                  }
                  var we = ne(re, 2);
                  Q(we, () => Ye, (A, j) => {
                    j(A, {
                      get to() {
                        return C;
                      },
                      children: (ue, Pe) => {
                        var ie = V(), ke = U(ie);
                        Q(ke, () => ot, (Ce, oe) => {
                          oe(Ce, {
                            sideOffset: 8,
                            class: "tooltip-content post-preview-tooltip-content",
                            children: (_e, Se) => {
                              Ne();
                              var Re = Le();
                              te(() => fe(Re, v())), P(_e, Re);
                            },
                            $$slots: { default: !0 }
                          });
                        }), P(ue, ie);
                      },
                      $$slots: { default: !0 }
                    });
                  }), P(ee, Z);
                },
                $$slots: { default: !0 }
              });
            }), P(B, k);
          },
          $$slots: { default: !0 }
        });
      }), P(g, m);
    }, b = (g) => {
      var m = Zn();
      te(
        (T) => {
          ct(m, 1, T), Te(m, "aria-label", n()), Te(m, "aria-expanded", u(S));
        },
        [
          () => At(`menu-trigger post-history-menu-trigger ${s()}`.trim())
        ]
      ), xt("click", m, (T) => void D(T)), xt("keydown", m, F), P(g, m);
    };
    de(J, (g) => {
      u(w) ? g(_) : f() && v() ? g(h, 1) : g(b, -1);
    });
  }
  return P(o, Y), me(L);
}
En(["click", "keydown"]);
be(
  Gn,
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
var er = q('<div><div class="post-preview-footer-left svelte-r1d5vb"><span class="post-preview-date svelte-r1d5vb"> </span> <!></div> <div class="post-preview-footer-actions svelte-r1d5vb"><!></div> <div class="post-preview-footer-right svelte-r1d5vb"><!></div></div>');
const tr = {
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
function nr(o, e) {
  ye(e, !0), ze(o, tr);
  let t = R(e, "formattedDate", 7), r = R(e, "density", 7, "regular"), n = R(e, "dimmed", 7, !1), s = R(e, "leftExtras", 7, void 0), c = R(e, "actions", 7, void 0), a = R(e, "trailing", 7, void 0);
  var p = {
    get formattedDate() {
      return t();
    },
    set formattedDate(y) {
      t(y), x();
    },
    get density() {
      return r();
    },
    set density(y = "regular") {
      r(y), x();
    },
    get dimmed() {
      return n();
    },
    set dimmed(y = !1) {
      n(y), x();
    },
    get leftExtras() {
      return s();
    },
    set leftExtras(y = void 0) {
      s(y), x();
    },
    get actions() {
      return c();
    },
    set actions(y = void 0) {
      c(y), x();
    },
    get trailing() {
      return a();
    },
    set trailing(y = void 0) {
      a(y), x();
    }
  }, v = er(), f = z(v), i = z(f), C = z(i, !0);
  $(i);
  var l = ne(i, 2);
  ae(l, () => s() ?? he), $(f);
  var S = ne(f, 2), d = z(S);
  ae(d, () => c() ?? he), $(S);
  var w = ne(S, 2), H = z(w);
  return ae(H, () => a() ?? he), $(w), $(v), te(
    (y) => {
      ct(v, 1, y, "svelte-r1d5vb"), fe(C, t());
    },
    [
      () => At(`post-preview-footer post-preview-footer-${r()} ${n() ? "is-dimmed" : ""}`.trim())
    ]
  ), P(o, v), me(p);
}
be(
  nr,
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
var rr = q('<div class="xmark-icon svg-icon svelte-10wau4w"></div>'), or = q("<!> <!>", 1), sr = q('<pre class="raw-json-content svelte-10wau4w"><code> </code></pre>'), ar = q('<pre class="raw-json-content svelte-10wau4w"><code> </code></pre>'), ir = q("<!> <!> <!>", 1), lr = q('<pre class="raw-json-content svelte-10wau4w"><code> </code></pre>'), cr = q('<div class="raw-json-heading svelte-10wau4w"><h2 class="svelte-10wau4w"> </h2></div> <!>', 1);
const dr = {
  hash: "svelte-10wau4w",
  code: `.xmark-icon.svelte-10wau4w {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-raw-json-dialog .dialog-content {padding:8px;}.post-history-raw-json-dialog--tabs {height:min(80svh, 720px);max-height:calc(100svh - 24px);}.post-history-raw-json-dialog--tabs .dialog-content {flex:1 1 0;min-height:0;max-height:none;overflow:hidden;box-sizing:border-box;align-items:stretch;}.raw-json-heading.svelte-10wau4w {width:100%;flex:0 0 auto;}.raw-json-heading.svelte-10wau4w h2:where(.svelte-10wau4w) {margin:0;font-size:1.1rem;}.raw-json-tabs {display:flex;width:100%;box-sizing:border-box;gap:4px;margin-top:8px;border-bottom:1px solid var(--border-hr);}.raw-json-tabs-root,
    .raw-json-panel {width:100%;min-width:0;}.raw-json-tabs-root {display:flex;flex:1 1 0;flex-direction:column;min-height:0;overflow:hidden;}.raw-json-panel[data-state="active"] {display:flex;flex:1 1 0;min-height:0;overflow:hidden;}.post-history-raw-json-dialog--tabs .raw-json-content {flex:1 1 0;min-height:0;height:auto;}.raw-json-tabs button {border:0;border-bottom:2px solid transparent;padding:6px 10px;background:transparent;color:var(--text);font:inherit;cursor:pointer;}.raw-json-tabs button[data-state="active"] {border-bottom-color:var(--accent-color);}.raw-json-content.svelte-10wau4w {width:100%;min-width:0;box-sizing:border-box;height:100%;margin:10px 0 0;padding:8px;overflow:auto;border:1px solid var(--border-hr);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--text) 4%);color:var(--text);font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", monospace;font-size:0.82rem;line-height:1.45;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere;}.post-history-raw-json-dialog {max-width:min(760px, calc(100% - 10px));}`
};
function ur(o, e) {
  ye(e, !0), ze(o, dr);
  const t = () => vt(ft, "$_", r), [r, n] = ut();
  let s = R(e, "open", 15, !1), c = R(e, "rawEvent", 7), a = R(e, "resetKey", 7, 0), p = R(e, "loadPayloadEvent", 7, void 0), v = R(e, "observePayloadStatus", 7, void 0), f = R(e, "onOpenChange", 7, void 0), i = ve("structure"), C = ve(void 0), l, S, d = 0, w = -1, H = W(() => st(c()) && nn(c()) ? c() : null), y = W(() => p() !== void 0 && u(H) !== null), D = W(() => JSON.stringify(c(), null, 2) ?? ""), F = W(() => u(C) ? JSON.stringify(u(C), null, 2) ?? "" : "");
  function L() {
    d += 1, l?.abort(), l = void 0, S?.(), S = void 0, N(i, "structure"), N(C, void 0);
  }
  dt(L), je(() => {
    const b = a();
    b !== w && L(), w = b;
  });
  async function Y(b) {
    if (N(i, b, !0), b !== "payload" || u(C) !== void 0 || !u(H) || !p())
      return;
    const g = new AbortController();
    l?.abort(), l = g;
    const m = ++d, T = u(H).id;
    S?.(), S = v()?.(u(H), (E) => {
      (E === "deleted" || E === "invalid") && s() && u(H)?.id === T && N(C, null);
    });
    try {
      const E = await p()(u(H), g.signal);
      !g.signal.aborted && m === d && N(C, E, !0);
    } catch {
      !g.signal.aborted && m === d && N(C, null);
    } finally {
      m === d && (l = void 0);
    }
  }
  function J(b) {
    b || (L(), f()?.(!1));
  }
  var _ = {
    get open() {
      return s();
    },
    set open(b = !1) {
      s(b), x();
    },
    get rawEvent() {
      return c();
    },
    set rawEvent(b) {
      c(b), x();
    },
    get resetKey() {
      return a();
    },
    set resetKey(b = 0) {
      a(b), x();
    },
    get loadPayloadEvent() {
      return p();
    },
    set loadPayloadEvent(b = void 0) {
      p(b), x();
    },
    get observePayloadStatus() {
      return v();
    },
    set observePayloadStatus(b = void 0) {
      v(b), x();
    },
    get onOpenChange() {
      return f();
    },
    set onOpenChange(b = void 0) {
      f(b), x();
    }
  };
  {
    const b = (E) => {
      var M = V(), B = U(M);
      {
        const I = (k, O) => {
          let K = () => O?.().props;
          {
            let X = W(() => t()("global.close"));
            pt(k, We(K, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return u(X);
              },
              children: (ee, G) => {
                var Z = rr();
                te((re) => Te(Z, "aria-label", re), [() => t()("global.close")]), P(ee, Z);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        Q(B, () => Dn, (k, O) => {
          O(k, { child: I, $$slots: { child: !0 } });
        });
      }
      P(E, M);
    };
    let g = W(() => t()("postHistory.rawJsonTitle")), m = W(() => t()("postHistory.rawJsonDescription")), T = W(() => u(y) ? "post-history-raw-json-dialog post-history-raw-json-dialog--tabs" : "post-history-raw-json-dialog");
    On(o, {
      onOpenChange: J,
      get title() {
        return u(g);
      },
      get description() {
        return u(m);
      },
      get contentClass() {
        return u(T);
      },
      footerVariant: "close-button",
      initialFocus: "content",
      get open() {
        return s();
      },
      set open(E) {
        s(E);
      },
      footer: b,
      children: (E, M) => {
        var B = cr(), I = U(B), k = z(I), O = z(k, !0);
        $(k), $(I);
        var K = ne(I, 2);
        {
          var X = (G) => {
            var Z = V(), re = U(Z);
            Q(re, () => Fn, (we, A) => {
              A(we, {
                get value() {
                  return u(i);
                },
                onValueChange: (j) => void Y(j),
                class: "raw-json-tabs-root",
                children: (j, ue) => {
                  var Pe = ir(), ie = U(Pe);
                  Q(ie, () => Mn, (oe, _e) => {
                    _e(oe, {
                      class: "raw-json-tabs",
                      children: (Se, Re) => {
                        var pe = or(), le = U(pe);
                        Q(le, () => It, (Ee, He) => {
                          He(Ee, {
                            value: "structure",
                            children: (xe, Ue) => {
                              Ne();
                              var Fe = Le("Structure");
                              P(xe, Fe);
                            },
                            $$slots: { default: !0 }
                          });
                        });
                        var ge = ne(le, 2);
                        Q(ge, () => It, (Ee, He) => {
                          He(Ee, {
                            value: "payload",
                            children: (xe, Ue) => {
                              Ne();
                              var Fe = Le("Payload");
                              P(xe, Fe);
                            },
                            $$slots: { default: !0 }
                          });
                        }), P(Se, pe);
                      },
                      $$slots: { default: !0 }
                    });
                  });
                  var ke = ne(ie, 2);
                  Q(ke, () => Pt, (oe, _e) => {
                    _e(oe, {
                      value: "structure",
                      class: "raw-json-panel",
                      children: (Se, Re) => {
                        var pe = sr(), le = z(pe), ge = z(le, !0);
                        $(le), $(pe), te(() => fe(ge, u(D))), P(Se, pe);
                      },
                      $$slots: { default: !0 }
                    });
                  });
                  var Ce = ne(ke, 2);
                  Q(Ce, () => Pt, (oe, _e) => {
                    _e(oe, {
                      value: "payload",
                      class: "raw-json-panel",
                      children: (Se, Re) => {
                        var pe = ar(), le = z(pe), ge = z(le, !0);
                        $(le), $(pe), te(() => fe(ge, u(F))), P(Se, pe);
                      },
                      $$slots: { default: !0 }
                    });
                  }), P(j, Pe);
                },
                $$slots: { default: !0 }
              });
            }), P(G, Z);
          }, ee = (G) => {
            var Z = lr(), re = z(Z), we = z(re, !0);
            $(re), $(Z), te(() => fe(we, u(D))), P(G, Z);
          };
          de(K, (G) => {
            u(y) ? G(X) : G(ee, -1);
          });
        }
        te((G) => fe(O, G), [() => t()("postHistory.rawJsonTitle")]), P(E, B);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var h = me(_);
  return n(), h;
}
be(
  ur,
  {
    open: {},
    rawEvent: {},
    resetKey: {},
    loadPayloadEvent: {},
    observePayloadStatus: {},
    onOpenChange: {}
  },
  [],
  [],
  { mode: "open" }
);
var pr = q("<!> <!>", 1);
function Je(o, e) {
  ye(e, !0);
  let t = R(e, "tooltipContent", 7), r = R(e, "children", 7), n = R(e, "onClick", 7, void 0), s = R(e, "ariaLabel", 7, ""), c = Qe(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "tooltipContent",
    "children",
    "onClick",
    "ariaLabel"
  ]);
  const a = Ut().overlayTarget;
  var p = {
    get tooltipContent() {
      return t();
    },
    set tooltipContent(i) {
      t(i), x();
    },
    get children() {
      return r();
    },
    set children(i) {
      r(i), x();
    },
    get onClick() {
      return n();
    },
    set onClick(i = void 0) {
      n(i), x();
    },
    get ariaLabel() {
      return s();
    },
    set ariaLabel(i = "") {
      s(i), x();
    }
  }, v = V(), f = U(v);
  return Q(f, () => tt, (i, C) => {
    C(i, {
      children: (l, S) => {
        var d = V(), w = U(d);
        Q(w, () => nt, (H, y) => {
          y(H, {
            delayDuration: 500,
            children: (D, F) => {
              var L = pr(), Y = U(L);
              {
                const _ = (h, b) => {
                  let g = () => b?.().props;
                  const m = W(() => {
                    const { onclick: T, ...E } = g();
                    return { tooltipOnclick: T, restProps: E };
                  });
                  pt(h, We(() => c, () => u(m).restProps, {
                    get ariaLabel() {
                      return s();
                    },
                    onClick: (T) => {
                      const E = n()?.(T);
                      return typeof u(m).tooltipOnclick == "function" && u(m).tooltipOnclick(T), E;
                    },
                    children: (T, E) => {
                      var M = V(), B = U(M);
                      ae(B, () => r() ?? he), P(T, M);
                    },
                    $$slots: { default: !0 }
                  }));
                };
                Q(Y, () => rt, (h, b) => {
                  b(h, { child: _, $$slots: { child: !0 } });
                });
              }
              var J = ne(Y, 2);
              Q(J, () => Ye, (_, h) => {
                h(_, {
                  get to() {
                    return a;
                  },
                  children: (b, g) => {
                    var m = V(), T = U(m);
                    Q(T, () => ot, (E, M) => {
                      M(E, {
                        sideOffset: 8,
                        class: "tooltip-content post-preview-tooltip-content",
                        children: (B, I) => {
                          Ne();
                          var k = Le();
                          te(() => fe(k, t())), P(B, k);
                        },
                        $$slots: { default: !0 }
                      });
                    }), P(b, m);
                  },
                  $$slots: { default: !0 }
                });
              }), P(D, L);
            },
            $$slots: { default: !0 }
          });
        }), P(l, d);
      },
      $$slots: { default: !0 }
    });
  }), P(o, v), me(p);
}
be(Je, { tooltipContent: {}, children: {}, onClick: {}, ariaLabel: {} }, [], [], { mode: "open" });
var vr = q('<div class="reply-icon svg-icon" aria-hidden="true"></div>'), fr = q('<div class="quote-icon svg-icon" aria-hidden="true"></div>'), gr = q('<div class="post-preview-action-buttons-group"><div class="post-preview-action-cell post-preview-reply-action-cell"><div class="post-preview-reply-button-slot"><!></div> <div class="post-preview-footer-replies-slot"><!></div></div> <div class="post-preview-action-cell post-preview-quote-action-cell"><!></div> <div class="post-preview-action-cell post-preview-reaction-action-cell"><div class="post-preview-footer-reaction-slot"><!></div></div></div>');
function hr(o, e) {
  ye(e, !0);
  const t = () => vt(ft, "$_", r), [r, n] = ut();
  let s = R(e, "post", 7), c = R(e, "onReplyPost", 7, void 0), a = R(e, "onQuotePost", 7, void 0), p = R(e, "replyExtras", 7, void 0), v = R(e, "reactionExtras", 7, void 0);
  var f = {
    get post() {
      return s();
    },
    set post(h) {
      s(h), x();
    },
    get onReplyPost() {
      return c();
    },
    set onReplyPost(h = void 0) {
      c(h), x();
    },
    get onQuotePost() {
      return a();
    },
    set onQuotePost(h = void 0) {
      a(h), x();
    },
    get replyExtras() {
      return p();
    },
    set replyExtras(h = void 0) {
      p(h), x();
    },
    get reactionExtras() {
      return v();
    },
    set reactionExtras(h = void 0) {
      v(h), x();
    }
  }, i = gr(), C = z(i), l = z(C), S = z(l);
  {
    var d = (h) => {
      {
        let b = W(() => t()("replyQuote.reply_label")), g = W(() => t()("replyQuote.reply_label"));
        Je(h, {
          type: "button",
          className: "post-preview-action-button post-history-action-button",
          get ariaLabel() {
            return u(b);
          },
          contentLayout: "icon",
          shape: "circle",
          onClick: () => c()?.(s()),
          get tooltipContent() {
            return u(g);
          },
          children: (m, T) => {
            var E = vr();
            P(m, E);
          },
          $$slots: { default: !0 }
        });
      }
    };
    de(S, (h) => {
      c() && h(d);
    });
  }
  $(l);
  var w = ne(l, 2), H = z(w);
  ae(H, () => p() ?? he), $(w), $(C);
  var y = ne(C, 2), D = z(y);
  {
    var F = (h) => {
      {
        let b = W(() => t()("replyQuote.quote_label")), g = W(() => t()("replyQuote.quote_label"));
        Je(h, {
          type: "button",
          className: "post-preview-action-button post-history-action-button",
          get ariaLabel() {
            return u(b);
          },
          contentLayout: "icon",
          shape: "circle",
          onClick: () => a()?.(s()),
          get tooltipContent() {
            return u(g);
          },
          children: (m, T) => {
            var E = fr();
            P(m, E);
          },
          $$slots: { default: !0 }
        });
      }
    };
    de(D, (h) => {
      a() && h(F);
    });
  }
  $(y);
  var L = ne(y, 2), Y = z(L), J = z(Y);
  ae(J, () => v() ?? he), $(Y), $(L), $(i), P(o, i);
  var _ = me(f);
  return n(), _;
}
be(
  hr,
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
function yo(o) {
  return o.isSearchMode ? o.totalCountKnown === !1 ? {
    key: o.totalCountStatus === "failed" ? "postHistory.countUnavailable" : "postHistory.countLoading"
  } : o.totalCount <= 0 ? null : {
    key: "postHistory.searchCountSummary",
    values: {
      total: o.totalCount
    }
  } : o.totalCountKnown ? {
    key: "postHistory.visibleCountSummary",
    values: {
      total: o.totalCount
    }
  } : o.totalCountStatus === "failed" ? { key: "postHistory.countUnavailable" } : { key: "postHistory.countLoading" };
}
function mo(o) {
  return o.direction === "older" ? o.isSearchMode ? "postHistory.loadOlderSearchResults" : "postHistory.loadOlder" : o.isSearchMode ? "postHistory.loadNewerSearchResults" : "postHistory.loadNewer";
}
function bo(o) {
  return o.status === "loading" ? { key: "postHistory.checkingReplies" } : o.status === "failed" ? { key: "postHistory.recheckReplies" } : o.status === "loaded" ? o.replyCount === 0 ? { key: "postHistory.recheckReplies" } : o.visible ? { key: "postHistory.hideReplies" } : {
    key: "postHistory.showRepliesWithCount",
    values: {
      count: o.replyCount
    }
  } : { key: "postHistory.checkReplies" };
}
function wo(o) {
  return o.visible ? { key: "postHistory.hideReactions" } : {
    key: "postHistory.showReactionsWithCount",
    values: {
      count: o.reactionCount
    }
  };
}
function yr(o) {
  return o === "+";
}
const Ct = {
  totalCount: 0,
  groups: []
}, mr = new Intl.Segmenter(void 0, {
  granularity: "grapheme"
});
function br(o) {
  if (!Ht(o.content))
    return;
  const e = rn(o.content);
  if (e)
    return on(o.tags ?? []).get(e)?.url;
}
function wr(o) {
  const e = o.trim();
  if (!e)
    return "+";
  if (Ht(e))
    return e;
  const t = mr.segment(e)[Symbol.iterator]().next();
  return t.done ? "" : t.value.segment;
}
function _r(o, e) {
  return o ? o instanceof Map ? o.get(e) ?? null : o[e] ?? null : null;
}
function Rr(o) {
  try {
    return sn(an(o), 9, 4);
  } catch {
    return o.slice(0, 12);
  }
}
function xr(o) {
  return o.profile?.displayName?.trim() || o.profile?.name?.trim() || Rr(o.pubkey);
}
async function _o(o, e = Ae) {
  return o ? e.getReactionRecords(o) : [];
}
function Ir(o, e) {
  if (o.length === 0)
    return Ct;
  const t = [], r = /* @__PURE__ */ new Map();
  let n = 0;
  for (const s of o) {
    if (s.kind !== 7)
      continue;
    n += 1;
    const c = wr(s.content);
    if (!c)
      continue;
    const a = {
      eventId: s.eventId,
      pubkey: s.authorPubkey,
      profile: _r(e, s.authorPubkey),
      createdAt: s.createdAt
    }, p = r.get(c), v = br(s);
    if (p === void 0) {
      r.set(c, t.length), t.push({
        content: c,
        count: 1,
        ...v ? { emojiUrl: v } : {},
        reactors: [a]
      });
      continue;
    }
    const f = t[p], i = f.emojiUrl ?? v;
    t[p] = {
      ...f,
      count: f.count + 1,
      ...i ? { emojiUrl: i } : {},
      reactors: [...f.reactors, a]
    };
  }
  return n === 0 ? Ct : {
    totalCount: n,
    groups: t
  };
}
var Pr = q('<div class="favorite-icon svg-icon post-preview-reaction-symbol" aria-hidden="true"></div>'), Cr = q('<span class="post-preview-reaction-emoji-slot post-preview-reaction-emoji-failed" role="img" tabindex="0"> </span>'), Sr = q('<img class="post-preview-reaction-emoji" draggable="false" loading="lazy" decoding="async"/>'), Er = q('<span class="post-preview-reaction-emoji-placeholder" aria-hidden="true"></span>'), kr = q('<span class="post-preview-reaction-emoji-slot"><!></span>'), Tr = q('<span class="post-preview-reaction-content"> </span>'), Ar = q('<span class="post-preview-reaction-actor"><!></span>'), Hr = q('<div class="post-preview-reaction-chip"><div class="post-preview-reaction-summary"><!> <span class="post-preview-reaction-count"> </span></div> <div class="post-preview-reaction-actors"></div></div>'), Or = q('<div class="post-preview-reactions-panel"></div>');
const Dr = {
  hash: "svelte-j0ansb",
  code: `.post-preview-reactions-panel {display:flex;flex-wrap:wrap;gap:4px;padding:0 16px;}.post-preview-reaction-chip {display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:4px 8px;border-radius:18px;background:color-mix(in srgb, var(--btn-bg), transparent 40%);color:var(--text);}.post-preview-reaction-summary {display:inline-flex;align-items:center;justify-content:center;gap:2px;row-gap:4px;flex-wrap:wrap;}.post-preview-reaction-content {font-size:20px;line-height:1;}.post-preview-reaction-count {font-size:1rem;line-height:1;color:var(--text-muted);}.post-preview-reaction-emoji-slot {display:inline-grid;margin:0;padding:0;}.post-preview-reaction-emoji,
    .post-preview-reaction-emoji-placeholder {width:100%;height:100%;}.post-preview-reaction-emoji {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-preview-reaction-emoji-placeholder {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}.post-preview-reaction-emoji-failed {display:inline-grid;place-items:center;overflow:hidden;border-radius:4px;background:rgba(127, 127, 127, 0.18);font-size:0.45em;line-height:1;white-space:nowrap;cursor:help;}.post-preview-reaction-actors {display:inline-flex;flex-wrap:wrap;gap:2px;align-items:center;}.post-preview-reaction-actor {display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:999px;overflow:hidden;flex:0 0 auto;}.post-preview-reaction-avatar,
    .post-preview-reaction-avatar-image,
    .post-preview-reaction-avatar-fallback {width:100%;height:100%;}.post-preview-reaction-avatar-image {object-fit:cover;}.post-preview-reaction-symbol {width:18px;height:18px;background-color:rgb(249, 24, 128);mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}`
};
function Mr(o, e) {
  ye(e, !0), ze(o, Dr);
  let t = R(e, "readModel", 7), r = R(e, "emojiLoadStateByUrl", 23, () => ({})), n = R(e, "emojiImageMetaByUrl", 23, () => ({}));
  function s(f) {
    const i = n()[f]?.aspectRatio;
    return `width:${typeof i == "number" && Number.isFinite(i) && i > 0 ? 18 * i : 18}px;height:18px;vertical-align:bottom;`;
  }
  var c = {
    get readModel() {
      return t();
    },
    set readModel(f) {
      t(f), x();
    },
    get emojiLoadStateByUrl() {
      return r();
    },
    set emojiLoadStateByUrl(f = {}) {
      r(f), x();
    },
    get emojiImageMetaByUrl() {
      return n();
    },
    set emojiImageMetaByUrl(f = {}) {
      n(f), x();
    }
  }, a = V(), p = U(a);
  {
    var v = (f) => {
      var i = Or();
      yt(i, 21, () => t().groups, (C) => C.content, (C, l) => {
        var S = Hr(), d = z(S), w = z(d);
        {
          var H = (_) => {
            var h = Pr();
            P(_, h);
          }, y = W(() => yr(u(l).content)), D = (_) => {
            var h = V(), b = U(h);
            {
              var g = (T) => {
                var E = Cr(), M = z(E, !0);
                $(E), te(
                  (B) => {
                    mt(E, B), Te(E, "aria-label", u(l).content), Te(E, "title", u(l).content), fe(M, u(l).content);
                  },
                  [() => s(u(l).emojiUrl)]
                ), P(T, E);
              }, m = (T) => {
                var E = kr(), M = z(E);
                {
                  var B = (k) => {
                    var O = Sr();
                    te(() => {
                      Te(O, "src", u(l).emojiUrl), Te(O, "alt", u(l).content), Te(O, "title", u(l).content);
                    }), P(k, O);
                  }, I = (k) => {
                    var O = Er();
                    P(k, O);
                  };
                  de(M, (k) => {
                    r()[u(l).emojiUrl] === "ready" ? k(B) : k(I, -1);
                  });
                }
                $(E), te((k) => mt(E, k), [() => s(u(l).emojiUrl)]), P(T, E);
              };
              de(b, (T) => {
                r()[u(l).emojiUrl] === "failed" ? T(g) : T(m, -1);
              });
            }
            P(_, h);
          }, F = (_) => {
            var h = Tr(), b = z(h, !0);
            $(h), te(() => fe(b, u(l).content)), P(_, h);
          };
          de(w, (_) => {
            u(y) ? _(H) : u(l).emojiUrl ? _(D, 1) : _(F, -1);
          });
        }
        var L = ne(w, 2), Y = z(L, !0);
        $(L), $(d);
        var J = ne(d, 2);
        yt(J, 21, () => u(l).reactors, (_) => _.eventId, (_, h) => {
          const b = W(() => xr(u(h)));
          var g = Ar(), m = z(g);
          {
            let T = W(() => u(h).profile?.picture || "");
            ln(m, {
              get src() {
                return u(T);
              },
              get alt() {
                return u(b);
              },
              rootClassName: "post-preview-reaction-avatar",
              imageClassName: "post-preview-reaction-avatar-image",
              fallbackClassName: "post-preview-reaction-avatar-fallback",
              get fallbackAriaLabel() {
                return u(b);
              },
              fallbackDelayMs: 0
            });
          }
          $(g), te(() => {
            Te(g, "title", u(b)), Te(g, "aria-label", u(b));
          }), P(_, g);
        }), $(J), $(S), te(() => fe(Y, u(l).count)), P(C, S);
      }), $(i), P(f, i);
    };
    de(p, (f) => {
      t().totalCount > 0 && f(v);
    });
  }
  return P(o, a), me(c);
}
be(
  Mr,
  {
    readModel: {},
    emojiLoadStateByUrl: {},
    emojiImageMetaByUrl: {}
  },
  [],
  [],
  { mode: "open" }
);
var Fr = q('<div class="favorite-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1);
const Ur = {
  hash: "svelte-8bdn3n",
  code: ".post-preview-reactions-button {display:flex;align-items:center;gap:4px;padding:0;padding-inline:6px;}.post-preview-reactions-button .favorite-icon {mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-preview-reactions-button span {flex:0 0 auto;line-height:20px;}.post-preview-reactions-button .svg-icon {width:var(--post-history-preview-action-icon-size, 20px);height:var(--post-history-preview-action-icon-size, 20px);--svg: currentColor;}.post-preview-reactions-button.selected {--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));color:var(--text-light);}"
};
function $r(o, e) {
  ye(e, !0), ze(o, Ur);
  let t = R(e, "count", 7), r = R(e, "expanded", 7), n = R(e, "ariaLabel", 7), s = R(e, "onToggle", 7);
  var c = {
    get count() {
      return t();
    },
    set count(a) {
      t(a), x();
    },
    get expanded() {
      return r();
    },
    set expanded(a) {
      r(a), x();
    },
    get ariaLabel() {
      return n();
    },
    set ariaLabel(a) {
      n(a), x();
    },
    get onToggle() {
      return s();
    },
    set onToggle(a) {
      s(a), x();
    }
  };
  return Je(o, {
    type: "button",
    className: "post-preview-reactions-button",
    get ariaLabel() {
      return n();
    },
    shape: "pill",
    get selected() {
      return r();
    },
    get onClick() {
      return s();
    },
    get tooltipContent() {
      return n();
    },
    children: (a, p) => {
      var v = Fr(), f = ne(U(v), 2), i = z(f, !0);
      $(f), te(() => fe(i, t())), P(a, v);
    },
    $$slots: { default: !0 }
  }), me(c);
}
be($r, { count: {}, expanded: {}, ariaLabel: {}, onToggle: {} }, [], [], { mode: "open" });
var jr = q("<div><!></div>");
const Lr = {
  hash: "svelte-1yd56n0",
  code: `.post-preview-toggle-row.svelte-1yd56n0 {display:flex;&.post-preview-toggle-hidden {visibility:hidden;pointer-events:none;}&.post-preview-toggle-overlay {position:absolute;inset-inline-end:0;inset-block-end:0;z-index:1;padding-inline-start:12px;background:linear-gradient(90deg, transparent, var(--dialog-bg) 18%);}&.post-preview-toggle-flow {position:static;align-self:flex-end;padding:0;background:none;}.ehagaki-app-root & button.post-preview-toggle-button,
        .ehagaki-app-root & button.post-preview-toggle-button:hover {color:var(--text-muted);font-size:0.875rem;font-weight:normal;min-height:24px;padding:0;background:transparent;}

        @media (hover: hover) and (pointer: fine) {.ehagaki-app-root & button.post-preview-toggle-button:hover {text-decoration:underline;}
        }}`
};
function Nr(o, e) {
  ye(e, !0), ze(o, Lr);
  const t = () => vt(ft, "$_", r), [r, n] = ut();
  let s = R(e, "expanded", 7), c = R(e, "controls", 7), a = R(e, "visible", 7, !0), p = R(e, "placement", 7, "inline"), v = R(e, "onToggle", 7);
  var f = {
    get expanded() {
      return s();
    },
    set expanded(d) {
      s(d), x();
    },
    get controls() {
      return c();
    },
    set controls(d) {
      c(d), x();
    },
    get visible() {
      return a();
    },
    set visible(d = !0) {
      a(d), x();
    },
    get placement() {
      return p();
    },
    set placement(d = "inline") {
      p(d), x();
    },
    get onToggle() {
      return v();
    },
    set onToggle(d) {
      v(d), x();
    }
  }, i = jr();
  let C;
  var l = z(i);
  {
    let d = W(() => !a());
    pt(l, {
      type: "button",
      class: "post-preview-action-button post-preview-toggle-button",
      get "aria-expanded"() {
        return s();
      },
      get "aria-controls"() {
        return c();
      },
      get disabled() {
        return u(d);
      },
      get onClick() {
        return v();
      },
      children: (w, H) => {
        Ne();
        var y = Le();
        te((D) => fe(y, D), [
          () => s() ? t()("postHistory.collapse") : t()("postHistory.expand")
        ]), P(w, y);
      },
      $$slots: { default: !0 }
    });
  }
  $(i), te(() => C = ct(i, 1, "post-preview-toggle-row svelte-1yd56n0", null, C, {
    "post-preview-toggle-overlay": p() === "overlay" && (!s() || !a()),
    "post-preview-toggle-flow": p() === "overlay" && s() && a(),
    "post-preview-toggle-hidden": !a()
  })), P(o, i);
  var S = me(f);
  return n(), S;
}
be(
  Nr,
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
function Ro() {
  let o = ve(at({})), e = ve(!1), t = ve(null);
  function r(C) {
    return u(o)[C] ?? !1;
  }
  function n(C, l) {
    N(o, { ...u(o), [C]: l }, !0);
  }
  function s() {
    Object.keys(u(o)).length > 0 && N(o, {}, !0);
  }
  function c(C) {
    N(e, C, !0), C || N(t, null);
  }
  function a(C) {
    s(), N(t, C, !0), N(e, !0);
  }
  function p() {
    c(!1);
  }
  function v() {
    N(t, null);
  }
  function f() {
    N(e, !1), N(t, null);
  }
  function i() {
    N(o, {}, !0), f();
  }
  return {
    get deleteConfirmOpen() {
      return u(e);
    },
    get deleteTargetPost() {
      return u(t);
    },
    isPostMenuOpen: r,
    setPostMenuOpen: n,
    closeAllPostItemMenus: s,
    setDeleteConfirmOpen: c,
    openDeleteConfirm: a,
    cancelDeleteConfirm: p,
    clearDeleteTarget: v,
    resetDeleteConfirmation: f,
    reset: i
  };
}
function zr(o, e) {
  return o.length === e.length && o.every((t, r) => t === e[r]);
}
function xo({
  getShow: o,
  getRxNostr: e,
  profileCache: t = cn,
  logger: r = console
}) {
  const n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let c = !1;
  const a = (l, S) => {
    if (!(c || l.disposed || n.get(l.pubkey) !== l || !o() || !S || l.lastProfile === S)) {
      l.lastProfile = S;
      for (const d of s)
        d(l.pubkey, S);
    }
  }, p = (l, S) => {
    if (l.pending || l.disposed || c)
      return;
    const d = l.relayHints;
    l.pending = t.getProfile(l.pubkey, {
      rxNostr: e(),
      additionalRelays: d,
      forceRefresh: S,
      allowBackgroundRefresh: !0
    }).then((w) => {
      a(l, w);
    }).catch((w) => {
      r.error("投稿履歴プロフィールの取得に失敗:", w);
    }).finally(() => {
      n.get(l.pubkey) === l && (l.pending = null, l.refreshQueued && (l.refreshQueued = !1, p(l, !0)));
    });
  }, v = (l, S = []) => {
    if (!l || c)
      return null;
    const d = ce.sanitizeExternalRelayUrls(S), w = n.get(l);
    if (w) {
      const y = ce.mergeRelayConfigs(
        w.relayHints,
        d
      );
      return zr(w.relayHints, y) || (w.relayHints = y, w.pending ? w.refreshQueued = !0 : p(w, !0)), w.lastProfile;
    }
    const H = {
      pubkey: l,
      relayHints: d,
      lastProfile: null,
      unsubscribe: () => {
      },
      pending: null,
      refreshQueued: !1,
      disposed: !1
    };
    return n.set(l, H), H.unsubscribe = t.subscribe(l, (y) => {
      a(H, y);
    }), p(H, !1), null;
  }, f = (l) => {
    if (c)
      return () => {
      };
    s.add(l);
    for (const S of n.values())
      S.lastProfile && l(S.pubkey, S.lastProfile);
    return () => s.delete(l);
  }, i = () => {
    for (const l of n.values())
      l.disposed = !0, l.unsubscribe();
    n.clear();
  };
  return {
    ensureProfile: v,
    subscribe: f,
    reset: i,
    dispose: () => {
      c || (i(), s.clear(), c = !0);
    }
  };
}
const zt = [
  "reply",
  "reaction",
  "quote"
];
function qt(o) {
  const e = o ?? zt;
  return Array.from(new Set(e.filter(
    (t) => t === "reply" || t === "reaction" || t === "quote"
  )));
}
function Io(o, e) {
  const t = qt(
    e.relationKinds
  );
  return {
    source: o,
    relationKinds: t,
    parentEventIds: Array.from(new Set(e.savedParentEventIds)),
    shouldRefreshQuotePreviews: t.includes("quote") && e.quoteRepairApplied
  };
}
const Be = {
  status: "saved",
  savedParentEventIds: [],
  savedDirectReplyCount: 0,
  deletedEventIds: [],
  deletionConfirmationIncomplete: !1
};
function qr(o) {
  const e = /* @__PURE__ */ new Map();
  for (const t of o) {
    if (!t.parentEventId || !t.event?.id || !t.event.pubkey || ![1, 42, 1111].includes(t.event.kind))
      continue;
    const r = e.get(t.event.id);
    e.set(t.event.id, {
      parentEventId: t.parentEventId,
      event: t.event,
      relayUrls: Array.from(/* @__PURE__ */ new Set([
        ...r?.relayUrls ?? [],
        ...t.relayUrls ?? []
      ]))
    });
  }
  return Array.from(e.values());
}
function Kr(o, e) {
  return o.filter((t) => e.get(t.event.pubkey)?.has(t.event.id)).map((t) => t.event.id);
}
function Ve(o) {
  return {
    ...o,
    status: "cancelled",
    savedParentEventIds: [],
    savedDirectReplyCount: 0
  };
}
class Br {
  deletionFetchService;
  deletionRequestsRepository;
  childInteractionsRepository;
  now;
  constructor(e = {}) {
    this.deletionFetchService = e.deletionFetchService ?? dn, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Ot, this.childInteractionsRepository = e.childInteractionsRepository ?? Dt, this.now = e.now ?? Date.now;
  }
  saveRepairDirectReplies(e, t) {
    let r = !0, n = null;
    const s = () => r && t.isActive?.() !== !1;
    return {
      promise: (async () => {
        const a = qr(t.items);
        if (a.length === 0)
          return Be;
        const p = await this.filterKnownDeletedDirectReplies(a);
        let v = p.deletedEventIds;
        if (!s())
          return Ve({
            ...Be,
            deletedEventIds: v
          });
        let f = p.visibleItems, i = !1;
        if (f.length > 0) {
          n = this.deletionFetchService.fetchDeletionRequests(e, {
            targets: f.map((d) => ({
              event: d.event,
              relayUrls: d.relayUrls
            })),
            relayHints: t.relayHints,
            relayConfig: t.relayConfig
          });
          const l = await n.promise;
          if (n = null, !s() || l.status === "cancelled")
            return Ve({
              ...Be,
              deletedEventIds: v,
              deletionConfirmationIncomplete: i || l.status !== "success"
            });
          if (i = l.status !== "success", l.events.length > 0 && await this.deletionRequestsRepository.upsertValidDeletionRequests({
            targetEvents: f.map((d) => d.event),
            deletionEvents: l.events,
            fetchedAt: l.fetchedAt
          }), !s())
            return Ve({
              ...Be,
              deletedEventIds: v,
              deletionConfirmationIncomplete: i
            });
          const S = await this.filterKnownDeletedDirectReplies(f);
          f = S.visibleItems, v = Array.from(/* @__PURE__ */ new Set([
            ...v,
            ...S.deletedEventIds
          ]));
        }
        if (!s())
          return Ve({
            ...Be,
            deletedEventIds: v,
            deletionConfirmationIncomplete: i
          });
        const C = await this.saveVisibleDirectReplies(
          f,
          t.fetchedAt ?? this.now(),
          s
        );
        return s() ? {
          ...C,
          status: "saved",
          deletedEventIds: v,
          deletionConfirmationIncomplete: i
        } : Ve({
          ...C,
          deletedEventIds: v,
          deletionConfirmationIncomplete: i
        });
      })(),
      cancel: () => {
        r = !1, n?.cancel();
      }
    };
  }
  async filterKnownDeletedDirectReplies(e) {
    const t = await this.deletionRequestsRepository.getDeletedTargets(
      e.map((s) => ({
        targetAuthorPubkey: s.event.pubkey,
        targetEventId: s.event.id
      }))
    ), r = Kr(e, t);
    await this.purgeDeletedReplyCache(r);
    const n = new Set(r);
    return {
      visibleItems: e.filter((s) => !n.has(s.event.id)),
      deletedEventIds: r
    };
  }
  async purgeDeletedReplyCache(e) {
    for (const t of new Set(e))
      await this.childInteractionsRepository.deleteChildInteractionByEventId(t);
  }
  async saveVisibleDirectReplies(e, t, r) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e) {
      const p = n.get(a.parentEventId) ?? [];
      p.push({
        event: a.event,
        ...a.relayUrls ? { relayUrls: a.relayUrls } : {}
      }), n.set(a.parentEventId, p);
    }
    const s = [];
    let c = 0;
    for (const [a, p] of n.entries()) {
      if (!r())
        break;
      const v = await this.childInteractionsRepository.upsertChildInteractions({
        parentEventId: a,
        events: p,
        fetchedAt: t
      }), f = v.insertedCount + v.updatedCount;
      f > 0 && (s.push(a), c += f);
    }
    return {
      status: "saved",
      savedParentEventIds: s,
      savedDirectReplyCount: c
    };
  }
}
const Vr = new Br(), Kt = 150, Ze = 30, et = 10, St = 2, Et = 250, Wr = 6e3, kt = 8, Qr = 6e4, Yr = zt, Tt = {
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
function Jr() {
  const o = Math.random().toString(36).slice(2, 10);
  return `post-history-visible-relation-repair-${Date.now().toString(36)}-${o}`;
}
function Zr(o, e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    if (!(![1, 42, 1111].includes(r.kind) || r.pubkeyHex !== o || !r.eventId || t.has(r.eventId)) && (t.set(r.eventId, r), t.size >= Kt))
      break;
  return Array.from(t.values());
}
function lt(o, e) {
  const t = [];
  for (let r = 0; r < o.length; r += e)
    t.push(o.slice(r, r + e));
  return t;
}
function Xr(o, e) {
  return e.includeDirectReplies ? [1, 42, 1111].flatMap(
    (t) => lt(
      o.filter((r) => r.kind === t),
      Ze
    ).map((r) => ({ posts: r, depth: 0 }))
  ) : lt(
    o,
    Ze
  ).map((t) => ({ posts: t, depth: 0 }));
}
function Gr(o) {
  return Array.from(o.values()).map((e) => ({
    event: e.event,
    relayUrls: Array.from(e.relayUrls).sort((t, r) => t.localeCompare(r))
  })).sort((e, t) => e.event.created_at !== t.event.created_at ? t.event.created_at - e.event.created_at : e.event.id.localeCompare(t.event.id));
}
class eo {
  directReplySaveService;
  childInteractionsRepository;
  quoteVisibleRangeRepairExecutor;
  console;
  setTimeoutFn;
  clearTimeoutFn;
  now;
  lastFetchTimeoutWarnAt = 0;
  constructor(e = {}) {
    this.directReplySaveService = e.directReplySaveService ?? Vr, this.childInteractionsRepository = e.childInteractionsRepository ?? Dt, this.quoteVisibleRangeRepairExecutor = e.quoteVisibleRangeRepairExecutor, this.console = e.console ?? (typeof globalThis.console < "u" ? globalThis.console : { warn: () => {
    }, error: () => {
    } }), this.setTimeoutFn = e.setTimeoutFn ?? ((t, r) => setTimeout(t, r)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((t) => clearTimeout(t)), this.now = e.now ?? Date.now;
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
    let r = !0;
    const n = /* @__PURE__ */ new Set(), s = () => r && t.isActive?.() !== !1, c = /* @__PURE__ */ new Map();
    for (const f of t.targets) {
      if (!f.eventId) continue;
      const i = c.get(f.eventId);
      c.set(f.eventId, {
        eventId: f.eventId,
        relayHints: ce.sanitizeExternalRelayUrls([
          ...i?.relayHints ?? [],
          ...f.relayHints
        ])
      });
    }
    const a = Array.from(c.values()).slice(
      0,
      Kt
    ), p = a.map((f) => f.eventId);
    return {
      promise: (async () => {
        if (a.length === 0)
          return { status: "success", targetEventIds: p };
        let f = !1;
        const i = [];
        for (let d = 0; d < a.length; d += Ze)
          i.push(a.slice(d, d + Ze).map((w) => ({
            eventId: w.eventId,
            kind: 1,
            relayHints: w.relayHints
          })));
        let C = 0;
        const l = async (d, w) => {
          if (!s()) return;
          const H = this.fetchCandidates(e, d, t.relayConfig, {
            includeDirectReplies: !1,
            includeReactions: !0
          });
          n.add(H);
          const y = await H.promise;
          if (n.delete(H), !s() || y.status === "cancelled") return;
          const D = w === 0 && y.requiresFallback;
          y.status !== "success" && !D && (f = !0);
          const F = this.toReactionItems(d, y.items);
          if (F.length > 0 && await this.saveReactionInteractions(F, y.fetchedAt, s), y.requiresFallback)
            if (w === 0)
              for (let L = 0; L < d.length; L += et)
                await l(d.slice(L, L + et), 1);
            else y.coverageSaturated && (f = !0);
        }, S = async () => {
          for (; s(); ) {
            const d = i[C++];
            if (!d) return;
            await l(d, 0);
          }
        };
        return await Promise.all(Array.from({
          length: Math.min(St, i.length)
        }, () => S())), {
          status: s() ? f ? "partial" : "success" : "cancelled",
          targetEventIds: p
        };
      })(),
      cancel: () => {
        r = !1, n.forEach((f) => f.cancel());
      }
    };
  }
  repairVisibleRangeRelations(e, t) {
    const r = qt(
      t.relationKinds ?? Yr
    ), n = this.repairVisibleRangeChildInteractionsInternal(
      e,
      t,
      {
        includeDirectReplies: r.includes("reply"),
        includeReactions: r.includes("reaction")
      }
    );
    return {
      promise: (async () => {
        const c = await n.promise;
        let a = !1;
        const p = t.quoteVisibleRangeRepairExecutor ?? this.quoteVisibleRangeRepairExecutor;
        return r.includes("quote") && c.status !== "cancelled" && t.isActive?.() !== !1 && p && (await p(e, t), a = !0), {
          ...c,
          relationKinds: r,
          quoteRepairApplied: a
        };
      })(),
      cancel: () => n.cancel()
    };
  }
  repairVisibleRangeChildInteractionsInternal(e, t, r) {
    let n = !0;
    const s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), a = () => n && t.isActive?.() !== !1, p = Zr(t.ownerPubkeyHex, t.visiblePosts), v = p.map((i) => i.eventId);
    return {
      promise: (async () => {
        if (p.length === 0)
          return {
            ...Tt,
            targetParentEventIds: v
          };
        const i = /* @__PURE__ */ new Set(), C = /* @__PURE__ */ new Set();
        let l = 0, S = 0, d = 0, w = !1, H = !1;
        const y = async (L) => {
          const Y = [];
          let J = 0;
          const _ = Math.min(
            St,
            L.length
          ), h = async () => {
            for (; a(); ) {
              const b = L[J++];
              if (!b)
                return;
              S += 1;
              const g = this.fetchCandidates(
                e,
                b.posts,
                t.relayConfig,
                r
              );
              s.add(g);
              const m = await g.promise;
              if (s.delete(g), !a() || m.status === "cancelled")
                return;
              const T = b.depth === 0 && m.requiresFallback;
              m.status !== "success" && !T && (H = !0), m.requiresFallback && (d += 1, b.depth === 0 ? Y.push(
                ...lt(
                  b.posts,
                  et
                ).map((I) => ({ posts: I, depth: 1 }))
              ) : m.coverageSaturated && (H = !0));
              const E = r.includeDirectReplies ? this.toDirectReplyItems(
                b.posts,
                m.items
              ) : [], M = r.includeReactions ? this.toReactionItems(
                b.posts,
                m.items
              ) : [], B = m.status === "success" && !m.coverageSaturated && !(b.depth === 0 && m.requiresFallback);
              if (E.length === 0 && M.length === 0) {
                B && b.posts.forEach((I) => C.add(I.eventId));
                continue;
              }
              if (E.length > 0) {
                const I = this.directReplySaveService.saveRepairDirectReplies(e, {
                  items: E,
                  relayHints: [
                    ...this.collectParentRelayHints(b.posts),
                    ...m.relayUrls
                  ],
                  relayConfig: t.relayConfig,
                  fetchedAt: m.fetchedAt,
                  isActive: a
                });
                c.add(I);
                const k = await I.promise;
                if (c.delete(I), !a() || k.status === "cancelled")
                  return;
                k.savedParentEventIds.forEach(
                  (O) => i.add(O)
                ), l += k.savedDirectReplyCount, w = w || k.deletionConfirmationIncomplete;
              }
              if (M.length > 0) {
                const I = await this.saveReactionInteractions(
                  M,
                  m.fetchedAt,
                  a
                );
                if (!a())
                  return;
                I.savedParentEventIds.forEach(
                  (k) => i.add(k)
                );
              }
              B && b.posts.forEach((I) => C.add(I.eventId));
            }
          };
          return await Promise.all(Array.from({ length: _ }, () => h())), Y;
        }, D = await y(Xr(p, r));
        if (a() && D.length > 0 && await y(D), !a())
          return {
            ...Tt,
            status: "cancelled",
            targetParentEventIds: v,
            attemptedChunkCount: S,
            saturatedChunkCount: d,
            deletionConfirmationIncomplete: w
          };
        const F = v.filter(
          (L) => !C.has(L)
        );
        return {
          status: H || F.length > 0 ? "partial" : "success",
          targetParentEventIds: v,
          checkedParentEventIds: Array.from(C),
          savedParentEventIds: Array.from(i),
          savedDirectReplyCount: l,
          attemptedChunkCount: S,
          saturatedChunkCount: d,
          incompleteParentEventIds: F,
          deletionConfirmationIncomplete: w
        };
      })(),
      cancel: () => {
        n = !1, s.forEach((i) => i.cancel()), c.forEach((i) => i.cancel());
      }
    };
  }
  toDirectReplyItems(e, t) {
    const r = new Map(e.flatMap((n) => {
      const s = un({
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
      const s = kn(n.event).parentId, c = s ? r.get(s) : null;
      return !s || !c || !pn({ child: n.event, parent: c }).valid ? [] : [{
        parentEventId: s,
        event: n.event,
        relayUrls: n.relayUrls
      }];
    });
  }
  toReactionItems(e, t) {
    const r = new Set(e.map((n) => n.eventId));
    return t.flatMap((n) => {
      if (n.event.kind !== 7)
        return [];
      const s = Tn(n.event);
      return !s || !r.has(s) || n.event.id === s ? [] : [{
        parentEventId: s,
        event: n.event,
        relayUrls: n.relayUrls
      }];
    });
  }
  async saveReactionInteractions(e, t, r) {
    const n = /* @__PURE__ */ new Map();
    for (const c of e) {
      const a = n.get(c.parentEventId) ?? [];
      a.push({
        event: c.event,
        relayUrls: c.relayUrls
      }), n.set(c.parentEventId, a);
    }
    const s = [];
    for (const [c, a] of n.entries()) {
      if (!r())
        break;
      const p = await this.childInteractionsRepository.upsertChildInteractions({
        parentEventId: c,
        events: a,
        fetchedAt: t
      });
      p.insertedCount + p.updatedCount > 0 && s.push(c);
    }
    return {
      savedParentEventIds: s
    };
  }
  fetchCandidates(e, t, r, n) {
    const s = this.resolveRelayPlan(t, r), { destinationRelayUrls: c, coverageRelayUrls: a } = s, p = t.map((T) => T.eventId), v = Jr(), f = `${v}:0`, i = vn(v), C = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Set(), H = /* @__PURE__ */ new Set();
    let y = 0, D = !1, F, L, Y, J, _, h;
    const b = () => {
      _ !== void 0 && (this.clearTimeoutFn(_), _ = void 0), F?.unsubscribe?.(), F = void 0, L?.unsubscribe?.(), L = void 0, Y?.unsubscribe?.(), Y = void 0, J?.unsubscribe?.(), J = void 0;
    }, g = (T) => {
      const E = Gr(C), M = new Set(
        Array.from(l.entries()).filter(([, O]) => O >= Et).map(([O]) => O)
      ), B = a.some(
        (O) => M.has(O)
      ), I = a.length > 0 && a.every((O) => S.has(O));
      return {
        status: T === "cancelled" ? "cancelled" : T === "error" ? "error" : I ? "success" : "partial",
        items: E,
        rawCount: y,
        requiresFallback: M.size > 0,
        coverageSaturated: B,
        fetchedAt: this.now(),
        relayUrls: c,
        eoseRelayUrls: Array.from(S).sort(),
        closedRelayUrls: Array.from(d).sort(),
        errorRelayUrls: Array.from(w).sort(),
        downRelayUrls: Array.from(H).sort(),
        perRelayRawCounts: Array.from(l.entries()).map(([O, K]) => ({ relayUrl: O, rawCount: K })).sort((O, K) => O.relayUrl.localeCompare(K.relayUrl))
      };
    };
    return {
      promise: new Promise((T) => {
        const E = (M) => {
          D || (D = !0, b(), T(g(M)));
        };
        h = E;
        try {
          if (p.length === 0) {
            E("complete");
            return;
          }
          L = e.createAllMessageObservable?.().subscribe({
            next: (I) => {
              this.handleCandidateMessagePacket({
                packet: I,
                targetSubId: f,
                destinationRelayUrls: c,
                eoseRelayUrls: S,
                closedRelayUrls: d,
                perRelayRawCounts: l
              });
            }
          }), Y = e.createAllErrorObservable?.().subscribe({
            next: (I) => {
              const k = this.sanitizeCandidateRelayUrl(I.from, c);
              k && w.add(k);
            }
          }), J = e.createConnectionStateObservable?.().subscribe({
            next: (I) => {
              const k = this.sanitizeCandidateRelayUrl(I.from, c);
              k && (I.state === "error" || I.state === "rejected" || I.state === "terminated") && H.add(k);
            }
          }), F = fn(e, i, {
            on: c.length > 0 ? { relays: c } : { defaultReadRelays: !0 }
          }).subscribe({
            next: (I) => {
              y += 1;
              const k = this.sanitizeCandidateRelayUrl(
                I.from,
                c
              );
              this.handleCandidatePacket(C, I, k);
            },
            complete: () => E("complete"),
            error: (I) => {
              this.console.error("post_history_visible_child_interaction_repair_fetch_error", I), E("error");
            }
          });
          const M = n.includeDirectReplies ? t.flatMap((I) => I.kind === 1 ? [1, 1111] : I.kind === 42 ? [42] : I.kind === 1111 ? [1111] : []) : [], B = Array.from(/* @__PURE__ */ new Set([
            ...M,
            ...n.includeReactions ? [7] : []
          ])).sort((I, k) => I - k);
          i.emit({
            kinds: B,
            "#e": p,
            limit: Et
          }), i.over(), _ = this.setTimeoutFn(() => {
            a.length > 0 && a.every((k) => S.has(k)) || this.warnCandidateFetchTimeout(), E("timeout");
          }, Wr);
        } catch (M) {
          this.console.error("post_history_visible_child_interaction_repair_request_error", M), E("error");
        }
      }),
      cancel: () => h?.("cancelled")
    };
  }
  warnCandidateFetchTimeout() {
    const e = this.now();
    e - this.lastFetchTimeoutWarnAt < Qr || (this.lastFetchTimeoutWarnAt = e, this.console.warn("post_history_visible_child_interaction_repair_fetch_timeout"));
  }
  handleCandidatePacket(e, t, r) {
    const n = t.event;
    if (!n?.id || ![1, 7, 42, 1111].includes(n.kind))
      return;
    const s = e.get(n.id);
    if (!s) {
      e.set(n.id, {
        event: n,
        relayUrls: new Set(r ? [r] : [])
      });
      return;
    }
    if (!An(s.event, n)) {
      this.console.warn("post_history_visible_child_interaction_repair_packet_conflict");
      return;
    }
    r && s.relayUrls.add(r);
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
    const r = ce.sanitizeExternalRelayUrls(
      typeof e == "string" ? [e] : [],
      { limit: 1 }
    )[0] ?? null;
    return r && t.includes(r) ? r : null;
  }
  resolveRelayPlan(e, t) {
    const r = this.collectParentRelayHints(e), n = hn(
      r,
      kt
    );
    if (n !== null)
      return {
        destinationRelayUrls: n,
        coverageRelayUrls: gn()
      };
    const s = t ? ce.sanitizeExternalRelayUrls(
      ce.extractReadRelays(t)
    ) : [], c = t ? ce.sanitizeExternalRelayUrls(
      ce.extractWriteRelays(t)
    ) : [], a = ce.sanitizeExternalRelayUrls(Hn), p = s.length > 0 ? s : c.length > 0 ? c : a, v = s.length > 0 ? c.filter((i) => !p.includes(i)) : [], f = ce.sanitizeExternalRelayUrls(
      r,
      { limit: kt }
    );
    return {
      coverageRelayUrls: p,
      destinationRelayUrls: ce.sanitizeExternalRelayUrls([
        ...p,
        ...v,
        ...f
      ])
    };
  }
}
const to = new eo();
function Po({ getShow: o, getPosts: e, getContainer: t, maxLines: r = 5 }) {
  let n = ve(at({})), s = ve(at({})), c = {}, a = null, p = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Set(), f = !1, i = null, C = 0;
  function l(h) {
    const b = getComputedStyle(h), g = parseFloat(b.lineHeight);
    if (!g || Number.isNaN(g)) {
      const m = parseFloat(b.fontSize);
      return m && !Number.isNaN(m) ? m * 1.5 : 24;
    }
    return g;
  }
  function S(h, b) {
    return c[b] = h, y(b), {
      destroy() {
        c[b] === h && delete c[b];
      }
    };
  }
  function d(h) {
    const b = Object.keys(u(n)), g = Object.keys(h);
    b.length === g.length && b.every((m) => u(n)[m] === h[m]) || N(n, h, !0);
  }
  function w() {
    if (!o()) {
      v.clear(), f = !1, d({});
      return;
    }
    const h = e(), b = v, g = f;
    v = /* @__PURE__ */ new Set(), f = !1;
    const m = {};
    let T;
    for (const E of h) {
      if (E.forceCollapsible)
        continue;
      if (!g && !b.has(E.eventId)) {
        const k = u(n)[E.eventId];
        k !== void 0 && (m[E.eventId] = k);
        continue;
      }
      const M = c[E.eventId];
      if (!M)
        continue;
      T ??= l(M);
      const B = T * r, I = M.scrollHeight > 0;
      m[E.eventId] = I ? M.scrollHeight > B + 0.5 : E.content.split(`
`).length > r;
    }
    d(m);
  }
  function H() {
    if (i)
      return i;
    const h = ++C, b = $t().then(() => {
      h === C && (i = null, w());
    });
    return i = b, b;
  }
  function y(h) {
    return h ? v.add(h) : f = !0, H();
  }
  function D() {
    const h = t();
    typeof ResizeObserver > "u" || !h || a || (a = new ResizeObserver(() => {
      y();
    }), a.observe(h));
  }
  function F() {
    a?.disconnect(), a = null;
  }
  function L() {
    d({}), N(s, {}, !0), c = {}, p.clear(), v.clear(), f = !1, F();
  }
  function Y(h) {
    return u(s)[h.eventId] ?? !1;
  }
  function J(h) {
    N(
      s,
      {
        ...u(s),
        [h]: !u(s)[h]
      },
      !0
    );
  }
  function _(h) {
    return h.forceCollapsible === !0 || (u(n)[h.eventId] ?? !1);
  }
  return je(() => {
    o() || L();
  }), je(() => {
    if (!o())
      return;
    const h = e(), b = /* @__PURE__ */ new Map();
    for (const g of h) {
      const m = {
        content: g.content,
        forceCollapsible: g.forceCollapsible
      }, T = p.get(g.eventId);
      (T?.content !== m.content || T.forceCollapsible !== m.forceCollapsible) && v.add(g.eventId), b.set(g.eventId, m);
    }
    p = b, H();
  }), je(() => {
    if (!(!o() || !t()))
      return D(), () => {
        F();
      };
  }), dt(() => {
    F();
  }), {
    previewRef: S,
    isPostExpanded: Y,
    remeasure: () => y(),
    togglePostExpanded: J,
    shouldCollapsePost: _
  };
}
function Co(o) {
  let e = ve({}), t = ve({}), r = ve({}), n = ve(0), s = 0;
  const c = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Map();
  let v = null;
  const f = o.source ?? "related-card-display", i = o.profileSync.subscribe((w, H) => {
    N(t, { ...u(t), [w]: H });
  }), C = () => {
    N(n, u(n) + 1);
  }, l = () => {
    document.visibilityState === "visible" && N(n, u(n) + 1);
  };
  typeof window < "u" && (window.addEventListener("online", C), document.addEventListener("visibilitychange", l)), dt(() => {
    s += 1, v?.cancel(), typeof window < "u" && (window.removeEventListener("online", C), document.removeEventListener("visibilitychange", l)), i();
  });
  function S(w) {
    return u(r)[w] ? Ir(u(e)[w] ?? [], u(t)) : null;
  }
  function d(w) {
    return !!u(r)[w];
  }
  return je(() => {
    const w = o.getShow(), H = o.getPubkeyHex() ?? "", y = o.getRxNostr(), D = o.getRelayConfig(), F = o.getTargets(), L = u(n);
    if (!w) {
      s += 1, v?.cancel(), v = null, c.clear(), p.clear(), N(e, {}), N(r, {});
      return;
    }
    const Y = ++s;
    let J = !0, _ = null;
    const h = () => J && Y === s && o.getShow() && (o.getPubkeyHex() ?? "") === H && o.getRxNostr() === y, b = /* @__PURE__ */ new Map();
    for (const I of F) {
      if (!I.eventId) continue;
      const k = b.get(I.eventId);
      b.set(I.eventId, {
        eventId: I.eventId,
        relayHints: Array.from(/* @__PURE__ */ new Set([...k?.relayHints ?? [], ...I.relayHints])).sort()
      });
    }
    const g = Array.from(b.values()), m = g.map((I) => I.eventId), T = JSON.stringify(Object.entries(D ?? {}).sort(([I], [k]) => I.localeCompare(k))), E = (I) => JSON.stringify([I.eventId, I.relayHints, T]), M = (I) => JSON.stringify([E(I), L]), B = new Set(g.map((I) => I.eventId));
    for (const I of p.keys())
      B.has(I) || p.delete(I);
    return g.forEach((I) => p.set(I.eventId, M(I))), (async () => {
      const I = await Ae.getReactionRecordsForParents?.(m) ?? (await Promise.all(m.map((A) => Ae.getReactionRecords(A)))).flat();
      if (!h())
        return;
      const k = {};
      for (const A of m)
        k[A] = I.filter((j) => j.parentEventId === A);
      N(e, { ...u(e), ...k }), N(r, {
        ...u(r),
        ...Object.fromEntries(m.map((A) => [A, !0]))
      });
      for (const A of I) {
        const j = o.profileSync.ensureProfile(A.authorPubkey, A.relayUrls);
        j && N(t, { ...u(t), [A.authorPubkey]: j });
      }
      if (!y || m.length === 0 || (await bt({
        source: f,
        parentEventIds: m,
        rxNostr: y,
        relayConfig: D,
        isActive: h
      }), !h()))
        return;
      const O = await Ae.getReactionRecordsForParents?.(m) ?? (await Promise.all(m.map((A) => Ae.getReactionRecords(A)))).flat();
      if (!h())
        return;
      for (const A of m)
        k[A] = O.filter((j) => j.parentEventId === A);
      N(e, { ...u(e), ...k });
      const K = g.filter((A) => !c.has(E(A)) && !a.has(A.eventId));
      if (!K.length)
        return;
      K.forEach((A) => a.add(A.eventId));
      const X = new Map(K.map((A) => [A.eventId, M(A)]));
      _ = to.repairRelatedCardReactions(y, { targets: K, relayConfig: D, isActive: h }), v = _;
      const ee = await _.promise.catch(() => ({
        status: "partial",
        targetEventIds: K.map((A) => A.eventId)
      }));
      v === _ && (v = null), _ = null, K.forEach((A) => a.delete(A.eventId));
      const G = o.getShow() && (o.getPubkeyHex() ?? "") === H && o.getRxNostr() === y, Z = K.some((A) => {
        const j = p.get(A.eventId);
        return j !== void 0 && (ee.status === "cancelled" || j !== X.get(A.eventId));
      });
      if (G && Z && N(n, u(n) + 1), !h() || ee.status === "cancelled")
        return;
      if (ee.status === "success") {
        const A = new Set(ee.targetEventIds);
        K.filter((j) => A.has(j.eventId)).forEach((j) => c.add(E(j)));
      }
      const re = await Ae.getReactionRecordsForParents?.(m) ?? (await Promise.all(m.map((A) => Ae.getReactionRecords(A)))).flat();
      if (!h())
        return;
      for (const A of m)
        k[A] = re.filter((j) => j.parentEventId === A);
      N(e, { ...u(e), ...k });
      for (const A of re) {
        const j = o.profileSync.ensureProfile(A.authorPubkey, A.relayUrls);
        j && N(t, { ...u(t), [A.authorPubkey]: j });
      }
      const we = await bt({
        source: f,
        parentEventIds: m,
        rxNostr: y,
        relayConfig: D,
        isActive: h
      });
      if (h() && we.deletedReactionEventIds.length > 0) {
        const A = await Ae.getReactionRecordsForParents?.(m) ?? (await Promise.all(m.map((j) => Ae.getReactionRecords(j)))).flat();
        if (!h())
          return;
        for (const j of m)
          k[j] = A.filter((ue) => ue.parentEventId === j);
        N(e, { ...u(e), ...k });
      }
    })().catch(() => {
    }), () => {
      J = !1, _?.cancel(), v === _ && (v = null);
    };
  }), { getReadModel: S, isLoaded: d };
}
const no = [1, 42, 1111];
function ro() {
  return {
    log: () => {
    },
    warn: () => {
    },
    error: () => {
    }
  };
}
function oo(o, e) {
  return !e || o.pubkeyHex !== e || typeof o.deletedAt == "number" ? !1 : no.includes(o.kind) && typeof o.eventId == "string" && o.eventId.length > 0;
}
function so(o, e = Math.floor(Date.now() / 1e3), t) {
  const r = [["e", o.eventId], ["k", String(o.kind)]];
  return t && r.push(["e", t], ["k", "36"]), {
    kind: 5,
    pubkey: o.pubkeyHex,
    content: "",
    tags: r,
    created_at: e
  };
}
function ao(o, e, t) {
  return ce.sanitizeExternalRelayUrls([
    ...o.acceptedRelays ?? [],
    ...o.fetchedRelays ?? [],
    ...o.relayHints ?? [],
    ...o.kind === 42 ? o.channelRelayHints ?? [] : [],
    ...t?.acceptedRelays ?? [],
    ...t?.fetchedRelays ?? [],
    ...e
  ]);
}
class io {
  deps;
  constructor(e = {}) {
    this.deps = {
      authStateStore: e.authStateStore ?? bn,
      keyManager: e.keyManager ?? mn,
      window: e.window ?? (typeof window < "u" ? window : {}),
      console: e.console ?? (typeof globalThis.console < "u" ? globalThis.console : ro()),
      seckeySignerFn: e.seckeySignerFn ?? yn,
      getNip46SignerForSessionFn: e.getNip46SignerForSessionFn ?? ((t) => _n.getSignerForSession(t)),
      getParentClientSignerFn: e.getParentClientSignerFn ?? (() => wn.getSigner()),
      writeRelaysStore: e.writeRelaysStore ?? Mt,
      postHistoryDeletionRequestsRepository: e.postHistoryDeletionRequestsRepository ?? Ot,
      eventSenderFactory: e.eventSenderFactory,
      sensitivePayloadRepository: e.sensitivePayloadRepository ?? Ge,
      fetchPayloadFn: e.fetchPayloadFn ?? wt.fetchEventById.bind(wt),
      saveSensitivePayloadFn: e.saveSensitivePayloadFn ?? Ge.putCandidate.bind(Ge),
      now: e.now ?? Date.now
    };
  }
  async requestDeletion(e) {
    const t = this.deps.authStateStore.value, r = t.pubkey || null;
    if (!e.rxNostr)
      return { success: !1, error: "nostr_not_ready" };
    if (!t.isAuthenticated || !r)
      return { success: !1, error: "pubkey_not_found" };
    if (Sn() && ce.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore.value
    ).length === 0)
      return { success: !1, error: "no_write_relays" };
    const n = () => Cn(
      this.deps.authStateStore,
      r
    );
    if (!oo(e.post, r))
      return { success: !1, error: "deletion_request_not_allowed" };
    let s;
    if (t.type === "nip46")
      try {
        n(), s = await this.deps.getNip46SignerForSessionFn(
          r
        );
        const w = this.deps.authStateStore.value;
        if (!s || !w.isAuthenticated || w.type !== "nip46" || w.pubkey !== r)
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
    const a = await this.resolveAssociatedPayload(e.post, e.rxNostr), p = st(e.post.rawEvent) && !!_t(e.post.rawEvent) && !a, v = so(
      e.post,
      Math.floor(this.deps.now() / 1e3),
      a?.id
    );
    let f;
    try {
      n();
      const w = Rn(v);
      f = await c.signEvent(w.signerTemplate), n(), f = xn(
        w.expectedTemplate,
        f,
        r
      ), n();
    } catch {
      return this.deps.console.error("post_deletion_sign_failed", {
        stage: "sign-event",
        reason: "unexpected"
      }), { success: !1, error: "post_error" };
    }
    const i = In(
      f
    );
    if (!i)
      return { success: !1, error: "post_error" };
    const C = ao(
      e.post,
      this.deps.writeRelaysStore.value,
      a
    );
    let l;
    try {
      n(), l = await this.createEventSender(e.rxNostr).sendEvent(
        i.event,
        {
          targetRelays: C,
          includeDefaultWriteRelays: !0
        }
      );
    } catch {
      return this.deps.console.error("post_deletion_send_failed", {
        stage: "publish",
        reason: "unexpected"
      }), { success: !1, error: "post_error" };
    }
    if (!l.success)
      return l;
    const S = i.event.id ?? l.eventId;
    if (!S)
      return { success: !1, error: "post_error" };
    const d = this.deps.now();
    try {
      await this.deps.postHistoryDeletionRequestsRepository.saveLocalDeletion({
        targetEventIds: v.tags.filter((w) => w[0] === "e").map((w) => w[1]),
        deletionEvent: i.event,
        attestation: i.attestation,
        deletedAt: d,
        relayUrls: C
      });
    } catch {
      this.deps.console.warn("post_history_local_deletion_save_failed", {
        stage: "post-history",
        reason: "unexpected"
      });
    }
    return {
      ...l,
      eventId: S,
      deletionEventId: S,
      deletionEvent: i.event,
      deletionEventAttestation: i.attestation,
      deletedAt: d,
      ...p ? { sensitivePayloadOmitted: !0 } : {}
    };
  }
  createEventSender(e) {
    return this.deps.eventSenderFactory ? this.deps.eventSenderFactory(e, this.deps.console) : new Ft(e, this.deps.console);
  }
  async resolveAssociatedPayload(e, t) {
    const r = e.rawEvent;
    if (!st(r)) return;
    const n = _t(r);
    if (!n || r.id !== e.eventId || r.pubkey !== e.pubkeyHex)
      return;
    let s;
    try {
      [s] = await this.deps.sensitivePayloadRepository.getByIds([n.eventId]);
    } catch {
      return;
    }
    if (s?.deletedAt !== void 0) return;
    if (!s) {
      const a = this.deps.fetchPayloadFn(t, {
        eventId: n.eventId,
        relayHints: ce.sanitizeExternalRelayUrls([
          ...n.relayHint ? [n.relayHint] : [],
          ...e.acceptedRelays ?? [],
          ...e.fetchedRelays ?? [],
          ...e.relayHints ?? []
        ]),
        relayConfig: Pn.value
      });
      try {
        const p = await a.promise;
        if (!p.event || !Rt(r, p.event, n.eventId)) return;
        const v = ce.sanitizeExternalRelayUrls(p.relayUrl ? [p.relayUrl] : []);
        try {
          await this.deps.saveSensitivePayloadFn({ event: p.event, fetchedRelays: v });
        } catch {
          this.deps.console.warn("sensitive_payload_cache_save_failed", { stage: "deletion", reason: "storage" });
        }
        if ([s] = await this.deps.sensitivePayloadRepository.getByIds([n.eventId]), s?.deletedAt !== void 0) return;
        if (!s) return { id: p.event.id, fetchedRelays: v };
      } catch {
        return;
      } finally {
        a.cancel();
      }
    }
    const c = s.rawEvent;
    if (Rt(r, c, n.eventId))
      return {
        id: n.eventId,
        acceptedRelays: s.acceptedRelays,
        fetchedRelays: s.fetchedRelays
      };
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
    const r = this.deps.keyManager.getFromStore() || this.deps.keyManager.loadFromStorage(e.pubkey);
    return r ? this.resolveExternalSigner(
      this.deps.seckeySignerFn(r),
      "nostr_sign_event_not_supported"
    ) : { error: "key_not_found" };
  }
  resolveExternalSigner(e, t) {
    return e ? typeof e.signEvent == "function" ? { signEvent: e.signEvent.bind(e) } : { error: "nostr_sign_event_not_supported" } : { error: t };
  }
}
const So = new io();
function lo() {
  return {
    log: () => {
    },
    warn: () => {
    },
    error: () => {
    }
  };
}
function co(o) {
  const e = o.rawEvent;
  if (!e || typeof e != "object")
    return null;
  const t = e;
  return typeof t.id != "string" || typeof t.pubkey != "string" || typeof t.created_at != "number" || typeof t.kind != "number" || !Array.isArray(t.tags) || typeof t.content != "string" || typeof t.sig != "string" ? null : t;
}
class uo {
  deps;
  constructor(e = {}) {
    this.deps = {
      writeRelaysStore: e.writeRelaysStore ?? Mt,
      console: e.console ?? (typeof globalThis.console < "u" ? globalThis.console : lo())
    };
  }
  async broadcast(e) {
    if (!e.rxNostr)
      return { success: !1, error: "nostr_not_ready" };
    const t = e.rxNostr, r = co(e.post);
    if (!r)
      return { success: !1, error: "invalid_event" };
    const n = ce.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore.value
    );
    return n.length === 0 ? { success: !1, error: "no_write_relays" } : new Ft(t, this.deps.console).sendEvent(r, {
      targetRelays: n,
      includeDefaultWriteRelays: !1
    });
  }
}
const Eo = new uo();
export {
  Je as A,
  Nt as D,
  Ct as E,
  $n as M,
  nr as P,
  jt as a,
  Gn as b,
  hr as c,
  Mr as d,
  $r as e,
  xo as f,
  zt as g,
  Ir as h,
  Ro as i,
  Po as j,
  ur as k,
  So as l,
  it as m,
  Lt as n,
  Nr as o,
  to as p,
  yo as q,
  Io as r,
  _o as s,
  oo as t,
  Co as u,
  wo as v,
  Eo as w,
  bo as x,
  co as y,
  mo as z
};
