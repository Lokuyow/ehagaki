import { I as s, dS as Ge, aO as I, K as ae, aP as X, aQ as ie, aR as z, aS as ue, aT as he, aU as we, dT as Ye, dU as et, dV as tt, b_ as rt, dW as nt, dN as ot, b1 as _e, dO as st, dP as He, dX as at, H as Pe, a_ as N, b$ as Fe, cz as Ie, cw as Ne, cx as je, cy as ze, cA as it, M as lt, Q as Le, aZ as Me, N as dt, V as Ke, $ as qe, bU as ct, ct as ut, w as Ue, i as pt, k as vt, a as gt, ag as ft, ah as ht, y as mt, z as yt, A as bt, P as Be, x as _t, R as Je } from "./App-B15rbX3S.js";
import { b5 as ke, a_ as Y, a$ as O, b0 as k, b1 as y, b2 as ee, b3 as a, b4 as te, a as S, b6 as D, n as G, b7 as T, aP as j, b8 as L, bi as We, bd as oe, bf as De, Z as pe, bg as ve, bh as Te, aQ as be, aJ as Re, b as U, aN as Ee, aZ as wt } from "./entry-B_zlOICe.js";
import { F as xt } from "./floating-layer-anchor-C66nRQbn.js";
import { D as St, a as Ct } from "./DialogWrapper-aQdoiq6H.js";
var Pt = L("<div><!></div>");
function kt(d, e) {
  const t = ke();
  Y(e, !0);
  let l = s(e, "child", 7), o = s(e, "children", 7), i = s(e, "ref", 15, null), p = s(e, "id", 23, () => ie(t)), g = s(e, "disabled", 7, !1), _ = s(e, "onSelect", 7, X), h = s(e, "closeOnSelect", 7, !0), w = we(e, [
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
  const n = Ge.create({
    id: I(() => p()),
    disabled: I(() => g()),
    onSelect: I(() => _()),
    ref: I(() => i(), (r) => i(r)),
    closeOnSelect: I(() => h())
  }), u = j(() => he(w, n.props));
  var m = {
    get child() {
      return l();
    },
    set child(r) {
      l(r), a();
    },
    get children() {
      return o();
    },
    set children(r) {
      o(r), a();
    },
    get ref() {
      return i();
    },
    set ref(r = null) {
      i(r), a();
    },
    get id() {
      return p();
    },
    set id(r = ie(t)) {
      p(r), a();
    },
    get disabled() {
      return g();
    },
    set disabled(r = !1) {
      g(r), a();
    },
    get onSelect() {
      return _();
    },
    set onSelect(r = X) {
      _(r), a();
    },
    get closeOnSelect() {
      return h();
    },
    set closeOnSelect(r = !0) {
      h(r), a();
    }
  }, C = O(), c = k(C);
  {
    var f = (r) => {
      var x = O(), P = k(x);
      z(P, l, () => ({ props: S(u) })), y(r, x);
    }, b = (r) => {
      var x = Pt();
      ue(x, () => ({ ...S(u) }));
      var P = D(x);
      z(P, () => o() ?? G), T(x), y(r, x);
    };
    ae(c, (r) => {
      l() ? r(f) : r(b, -1);
    });
  }
  return y(d, C), ee(m);
}
te(
  kt,
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
var Ot = L("<div><!></div>");
function Ve(d, e) {
  const t = ke();
  Y(e, !0);
  let l = s(e, "ref", 15, null), o = s(e, "id", 23, () => ie(t)), i = s(e, "child", 7), p = s(e, "children", 7), g = we(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "id",
    "child",
    "children"
  ]);
  const _ = Ye.create({
    id: I(() => o()),
    ref: I(() => l(), (c) => l(c))
  }), h = j(() => he(g, _.props));
  var w = {
    get ref() {
      return l();
    },
    set ref(c = null) {
      l(c), a();
    },
    get id() {
      return o();
    },
    set id(c = ie(t)) {
      o(c), a();
    },
    get child() {
      return i();
    },
    set child(c) {
      i(c), a();
    },
    get children() {
      return p();
    },
    set children(c) {
      p(c), a();
    }
  }, n = O(), u = k(n);
  {
    var m = (c) => {
      var f = O(), b = k(f);
      z(b, i, () => ({ props: S(h) })), y(c, f);
    }, C = (c) => {
      var f = Ot();
      ue(f, () => ({ ...S(h) }));
      var b = D(f);
      z(b, () => p() ?? G), T(f), y(c, f);
    };
    ae(u, (c) => {
      i() ? c(m) : c(C, -1);
    });
  }
  return y(d, n), ee(w);
}
te(Ve, { ref: {}, id: {}, child: {}, children: {} }, [], [], { mode: "open" });
function Qe(d, e) {
  Y(e, !0);
  let t = s(e, "open", 15, !1), l = s(e, "dir", 7, "ltr"), o = s(e, "onOpenChange", 7, X), i = s(e, "onOpenChangeComplete", 7, X), p = s(e, "_internal_variant", 7, "dropdown-menu"), g = s(e, "_internal_should_skip_exit_animation", 7, void 0), _ = s(e, "children", 7);
  const h = et.create({
    variant: I(() => p()),
    dir: I(() => l()),
    // debugMode: boxWith(() => debugMode),
    onClose: () => {
      t(!1), o()(!1);
    },
    shouldSkipExitAnimation: () => g()?.() ?? !1
  });
  tt.create(
    {
      open: I(() => t(), (n) => {
        t(n), o()(n);
      }),
      onOpenChangeComplete: I(() => i())
    },
    h
  );
  var w = {
    get open() {
      return t();
    },
    set open(n = !1) {
      t(n), a();
    },
    get dir() {
      return l();
    },
    set dir(n = "ltr") {
      l(n), a();
    },
    get onOpenChange() {
      return o();
    },
    set onOpenChange(n = X) {
      o(n), a();
    },
    get onOpenChangeComplete() {
      return i();
    },
    set onOpenChangeComplete(n = X) {
      i(n), a();
    },
    get _internal_variant() {
      return p();
    },
    set _internal_variant(n = "dropdown-menu") {
      p(n), a();
    },
    get _internal_should_skip_exit_animation() {
      return g();
    },
    set _internal_should_skip_exit_animation(n = void 0) {
      g(n), a();
    },
    get children() {
      return _();
    },
    set children(n) {
      _(n), a();
    }
  };
  return rt(d, {
    children: (n, u) => {
      var m = O(), C = k(m);
      z(C, () => _() ?? G), y(n, m);
    },
    $$slots: { default: !0 }
  }), ee(w);
}
te(
  Qe,
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
var Et = L("<div><div><!></div></div>"), Ft = L("<div><div><!></div></div>");
function Ze(d, e) {
  const t = ke();
  Y(e, !0);
  let l = s(e, "id", 23, () => ie(t)), o = s(e, "child", 7), i = s(e, "children", 7), p = s(e, "ref", 15, null), g = s(e, "loop", 7, !0), _ = s(e, "onInteractOutside", 7, X), h = s(e, "onEscapeKeydown", 7, X), w = s(e, "onCloseAutoFocus", 7, X), n = s(e, "forceMount", 7, !1), u = s(e, "trapFocus", 7, !1), m = s(e, "style", 7), C = we(e, [
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
  const c = nt.create({
    id: I(() => l()),
    loop: I(() => g()),
    ref: I(() => p(), (v) => p(v)),
    onCloseAutoFocus: I(() => w())
  }), f = j(() => he(C, c.props));
  function b(v) {
    if (c.handleInteractOutside(v), !v.defaultPrevented && (_()(v), !v.defaultPrevented)) {
      if (v.target && v.target instanceof Element) {
        const E = `[${c.parentMenu.root.getBitsAttr("sub-content")}]`;
        if (v.target.closest(E)) return;
      }
      c.parentMenu.onClose();
    }
  }
  function r(v) {
    h()(v), !v.defaultPrevented && c.parentMenu.onClose();
  }
  var x = {
    get id() {
      return l();
    },
    set id(v = ie(t)) {
      l(v), a();
    },
    get child() {
      return o();
    },
    set child(v) {
      o(v), a();
    },
    get children() {
      return i();
    },
    set children(v) {
      i(v), a();
    },
    get ref() {
      return p();
    },
    set ref(v = null) {
      p(v), a();
    },
    get loop() {
      return g();
    },
    set loop(v = !0) {
      g(v), a();
    },
    get onInteractOutside() {
      return _();
    },
    set onInteractOutside(v = X) {
      _(v), a();
    },
    get onEscapeKeydown() {
      return h();
    },
    set onEscapeKeydown(v = X) {
      h(v), a();
    },
    get onCloseAutoFocus() {
      return w();
    },
    set onCloseAutoFocus(v = X) {
      w(v), a();
    },
    get forceMount() {
      return n();
    },
    set forceMount(v = !1) {
      n(v), a();
    },
    get trapFocus() {
      return u();
    },
    set trapFocus(v = !1) {
      u(v), a();
    },
    get style() {
      return m();
    },
    set style(v) {
      m(v), a();
    }
  }, P = O(), A = k(P);
  {
    var W = (v) => {
      ot(v, _e(() => S(f), () => c.popperProps, {
        get ref() {
          return c.opts.ref;
        },
        get enabled() {
          return c.parentMenu.opts.open.current;
        },
        onInteractOutside: b,
        onEscapeKeydown: r,
        get trapFocus() {
          return u();
        },
        get loop() {
          return g();
        },
        forceMount: !0,
        get id() {
          return l();
        },
        get shouldRender() {
          return c.shouldRender;
        },
        popper: ($, B) => {
          let K = () => B?.().props, F = () => B?.().wrapperProps;
          const H = j(() => he(K(), { style: He("dropdown-menu") }, { style: m() }));
          var q = O(), V = k(q);
          {
            var Q = (M) => {
              var R = O(), J = k(R);
              {
                let Z = j(() => ({
                  props: S(H),
                  wrapperProps: F(),
                  ...c.snippetProps
                }));
                z(J, o, () => S(Z));
              }
              y(M, R);
            }, ne = (M) => {
              var R = Et();
              ue(R, () => ({ ...F() }));
              var J = D(R);
              ue(J, () => ({ ...S(H) }));
              var Z = D(J);
              z(Z, () => i() ?? G), T(J), T(R), y(M, R);
            };
            ae(V, (M) => {
              o() ? M(Q) : M(ne, -1);
            });
          }
          y($, q);
        },
        $$slots: { popper: !0 }
      }));
    }, re = (v) => {
      st(v, _e(() => S(f), () => c.popperProps, {
        get ref() {
          return c.opts.ref;
        },
        get open() {
          return c.parentMenu.opts.open.current;
        },
        onInteractOutside: b,
        onEscapeKeydown: r,
        get trapFocus() {
          return u();
        },
        get loop() {
          return g();
        },
        forceMount: !1,
        get id() {
          return l();
        },
        get shouldRender() {
          return c.shouldRender;
        },
        popper: ($, B) => {
          let K = () => B?.().props, F = () => B?.().wrapperProps;
          const H = j(() => he(K(), { style: He("dropdown-menu") }, { style: m() }));
          var q = O(), V = k(q);
          {
            var Q = (M) => {
              var R = O(), J = k(R);
              {
                let Z = j(() => ({
                  props: S(H),
                  wrapperProps: F(),
                  ...c.snippetProps
                }));
                z(J, o, () => S(Z));
              }
              y(M, R);
            }, ne = (M) => {
              var R = Ft();
              ue(R, () => ({ ...F() }));
              var J = D(R);
              ue(J, () => ({ ...S(H) }));
              var Z = D(J);
              z(Z, () => i() ?? G), T(J), T(R), y(M, R);
            };
            ae(V, (M) => {
              o() ? M(Q) : M(ne, -1);
            });
          }
          y($, q);
        },
        $$slots: { popper: !0 }
      }));
    };
    ae(A, (v) => {
      n() ? v(W) : n() || v(re, 1);
    });
  }
  return y(d, P), ee(x);
}
te(
  Ze,
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
var Rt = L("<button><!></button>");
function $e(d, e) {
  const t = ke();
  Y(e, !0);
  let l = s(e, "id", 23, () => ie(t)), o = s(e, "ref", 15, null), i = s(e, "child", 7), p = s(e, "children", 7), g = s(e, "disabled", 7, !1), _ = s(e, "type", 7, "button"), h = we(e, [
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
  const w = at.create({
    id: I(() => l()),
    disabled: I(() => g() ?? !1),
    ref: I(() => o(), (m) => o(m))
  }), n = j(() => he(h, w.props, { type: _() }));
  var u = {
    get id() {
      return l();
    },
    set id(m = ie(t)) {
      l(m), a();
    },
    get ref() {
      return o();
    },
    set ref(m = null) {
      o(m), a();
    },
    get child() {
      return i();
    },
    set child(m) {
      i(m), a();
    },
    get children() {
      return p();
    },
    set children(m) {
      p(m), a();
    },
    get disabled() {
      return g();
    },
    set disabled(m = !1) {
      g(m), a();
    },
    get type() {
      return _();
    },
    set type(m = "button") {
      _(m), a();
    }
  };
  return xt(d, {
    get id() {
      return l();
    },
    get ref() {
      return w.opts.ref;
    },
    children: (m, C) => {
      var c = O(), f = k(c);
      {
        var b = (x) => {
          var P = O(), A = k(P);
          z(A, i, () => ({ props: S(n) })), y(x, P);
        }, r = (x) => {
          var P = Rt();
          ue(P, () => ({ ...S(n) }));
          var A = D(P);
          z(A, () => p() ?? G), T(P), y(x, P);
        };
        ae(f, (x) => {
          i() ? x(b) : x(r, -1);
        });
      }
      y(m, c);
    },
    $$slots: { default: !0 }
  }), ee(u);
}
te(
  $e,
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
var $t = L('<div class="more-icon svg-icon"></div>'), Mt = L("<!> <!>", 1), Dt = L('<div class="more-icon svg-icon"></div>'), Tt = L('<div class="post-history-menu-timestamp"> </div> <!>', 1), At = L('<div class="post-history-menu-body"><!> <!></div>'), Ht = L("<!> <!>", 1);
const It = {
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
function Nt(d, e) {
  Y(e, !0), Pe(d, It);
  let t = s(e, "open", 7, !1), l = s(e, "onOpenChange", 7, void 0), o = s(e, "triggerAriaLabel", 7), i = s(e, "triggerClassName", 7, ""), p = s(e, "align", 7, "start"), g = s(e, "timestamp", 7, void 0), _ = s(e, "items", 7, void 0), h = s(e, "tooltipContent", 7, void 0), w = s(e, "enableTooltip", 7, !1);
  const n = We().overlayTarget;
  function u(f) {
    l()?.(f);
  }
  var m = {
    get open() {
      return t();
    },
    set open(f = !1) {
      t(f), a();
    },
    get onOpenChange() {
      return l();
    },
    set onOpenChange(f = void 0) {
      l(f), a();
    },
    get triggerAriaLabel() {
      return o();
    },
    set triggerAriaLabel(f) {
      o(f), a();
    },
    get triggerClassName() {
      return i();
    },
    set triggerClassName(f = "") {
      i(f), a();
    },
    get align() {
      return p();
    },
    set align(f = "start") {
      p(f), a();
    },
    get timestamp() {
      return g();
    },
    set timestamp(f = void 0) {
      g(f), a();
    },
    get items() {
      return _();
    },
    set items(f = void 0) {
      _(f), a();
    },
    get tooltipContent() {
      return h();
    },
    set tooltipContent(f = void 0) {
      h(f), a();
    },
    get enableTooltip() {
      return w();
    },
    set enableTooltip(f = !1) {
      w(f), a();
    }
  }, C = O(), c = k(C);
  return N(c, () => Qe, (f, b) => {
    b(f, {
      get open() {
        return t();
      },
      onOpenChange: u,
      children: (r, x) => {
        var P = Ht(), A = k(P);
        {
          var W = (E) => {
            var $ = O(), B = k($);
            N(B, () => Ie, (K, F) => {
              F(K, {
                children: (H, q) => {
                  var V = O(), Q = k(V);
                  N(Q, () => Ne, (ne, M) => {
                    M(ne, {
                      delayDuration: 500,
                      children: (R, J) => {
                        var Z = Mt(), ge = k(Z);
                        {
                          const le = (de, ce) => {
                            let Se = () => ce?.().props;
                            const se = j(() => {
                              const { onclick: me, ...ye } = Se();
                              return { tooltipOnclick: me, restProps: ye };
                            });
                            var Ce = O(), Oe = k(Ce);
                            {
                              let me = j(() => `menu-trigger post-history-menu-trigger ${i()} ${t() ? "is-open" : ""}`.trim());
                              N(Oe, () => $e, (ye, Ae) => {
                                Ae(ye, _e(
                                  {
                                    get class() {
                                      return S(me);
                                    },
                                    get "aria-label"() {
                                      return o();
                                    }
                                  },
                                  () => S(se).restProps,
                                  {
                                    onclick: (fe) => {
                                      typeof S(se).tooltipOnclick == "function" && S(se).tooltipOnclick(fe);
                                    },
                                    children: (fe, ar) => {
                                      var Xe = $t();
                                      y(fe, Xe);
                                    },
                                    $$slots: { default: !0 }
                                  }
                                ));
                              });
                            }
                            y(de, Ce);
                          };
                          N(ge, () => je, (de, ce) => {
                            ce(de, { child: le, $$slots: { child: !0 } });
                          });
                        }
                        var xe = oe(ge, 2);
                        N(xe, () => Fe, (le, de) => {
                          de(le, {
                            get to() {
                              return n;
                            },
                            children: (ce, Se) => {
                              var se = O(), Ce = k(se);
                              N(Ce, () => ze, (Oe, me) => {
                                me(Oe, {
                                  sideOffset: 8,
                                  class: "tooltip-content post-preview-tooltip-content",
                                  children: (ye, Ae) => {
                                    Te();
                                    var fe = De();
                                    pe(() => ve(fe, h())), y(ye, fe);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), y(ce, se);
                            },
                            $$slots: { default: !0 }
                          });
                        }), y(R, Z);
                      },
                      $$slots: { default: !0 }
                    });
                  }), y(H, V);
                },
                $$slots: { default: !0 }
              });
            }), y(E, $);
          }, re = (E) => {
            var $ = O(), B = k($);
            {
              let K = j(() => `menu-trigger post-history-menu-trigger ${i()} ${t() ? "is-open" : ""}`.trim());
              N(B, () => $e, (F, H) => {
                H(F, {
                  get class() {
                    return S(K);
                  },
                  get "aria-label"() {
                    return o();
                  },
                  children: (q, V) => {
                    var Q = Dt();
                    y(q, Q);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            y(E, $);
          };
          ae(A, (E) => {
            w() && h() ? E(W) : E(re, -1);
          });
        }
        var v = oe(A, 2);
        N(v, () => Fe, (E, $) => {
          $(E, {
            get to() {
              return n;
            },
            children: (B, K) => {
              var F = O(), H = k(F);
              N(H, () => Ze, (q, V) => {
                V(q, {
                  side: "bottom",
                  get align() {
                    return p();
                  },
                  sideOffset: 8,
                  class: "post-history-menu-content",
                  trapFocus: !1,
                  preventScroll: !1,
                  onCloseAutoFocus: (Q) => Q.preventDefault(),
                  children: (Q, ne) => {
                    var M = At(), R = D(M);
                    {
                      var J = (ge) => {
                        var xe = Tt(), le = k(xe), de = D(le, !0);
                        T(le);
                        var ce = oe(le, 2);
                        N(ce, () => Ve, (Se, se) => {
                          se(Se, { class: "post-history-menu-separator" });
                        }), pe(() => ve(de, g())), y(ge, xe);
                      };
                      ae(R, (ge) => {
                        g() && ge(J);
                      });
                    }
                    var Z = oe(R, 2);
                    z(Z, () => _() ?? G), T(M), y(Q, M);
                  },
                  $$slots: { default: !0 }
                });
              }), y(B, F);
            },
            $$slots: { default: !0 }
          });
        }), y(r, P);
      },
      $$slots: { default: !0 }
    });
  }), y(d, C), ee(m);
}
te(
  Nt,
  {
    open: {},
    onOpenChange: {},
    triggerAriaLabel: {},
    triggerClassName: {},
    align: {},
    timestamp: {},
    items: {},
    tooltipContent: {},
    enableTooltip: {}
  },
  [],
  [],
  { mode: "open" }
);
var jt = L('<div><div class="post-preview-footer-left svelte-r1d5vb"><span class="post-preview-date svelte-r1d5vb"> </span> <!></div> <div class="post-preview-footer-actions svelte-r1d5vb"><!></div> <div class="post-preview-footer-right svelte-r1d5vb"><!></div></div>');
const zt = {
  hash: "svelte-r1d5vb",
  code: `.post-preview-footer.svelte-r1d5vb {display:flex;align-items:stretch;justify-content:space-between;height:var(--post-history-preview-footer-height);color:var(--btn-post-preview-action);--post-history-preview-footer-surface: var(--dialog-bg);}.post-preview-footer-regular.svelte-r1d5vb {--post-history-preview-footer-height: 36px;padding-inline-start:1rem;}.post-preview-footer-compact.svelte-r1d5vb {--post-history-preview-footer-height: 28px;--post-history-preview-footer-surface: var(\r
            --post-history-related-card-bg,\r
            var(--dialog-bg)\r
        );}.post-preview-footer.is-dimmed.svelte-r1d5vb {opacity:0.65;}.post-preview-footer-left.svelte-r1d5vb,\r
    .post-preview-footer-actions.svelte-r1d5vb,\r
    .post-preview-footer-right.svelte-r1d5vb {display:flex;align-items:stretch;}.post-preview-footer-left.svelte-r1d5vb {align-items:center;justify-content:flex-start;min-width:0;}.post-preview-footer-regular.svelte-r1d5vb .post-preview-footer-left:where(.svelte-r1d5vb) {min-width:80px;}.post-preview-footer-actions.svelte-r1d5vb {justify-content:center;flex:1 1 auto;min-width:0;}.post-preview-footer-regular.svelte-r1d5vb .post-preview-footer-actions:where(.svelte-r1d5vb) {justify-content:space-around;}.post-preview-footer-right.svelte-r1d5vb {align-items:center;justify-content:flex-end;flex:0 0 auto;}.post-preview-date.svelte-r1d5vb {overflow:hidden;color:var(--text-muted);font-size:0.875rem;text-overflow:ellipsis;white-space:nowrap;}.post-preview-footer-regular.svelte-r1d5vb .post-preview-date:where(.svelte-r1d5vb) {font-size:0.9375rem;}.post-preview-footer-replies-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-footer-reaction-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 70px;min-width:70px;}.post-history-action-button,
    .post-preview-reactions-button {min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface);background-color:var(--post-history-preview-footer-surface);}.post-preview-action-buttons-group {display:flex;align-items:stretch;}.post-preview-action-button {position:relative;}.post-history-action-button {color:var(--btn-post-preview-action);}.post-history-action-button .svg-icon {--svg: currentColor;}.post-preview-footer .reply-icon.svg-icon {width:20px;height:20px;margin-top:2px;mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-preview-footer .quote-icon.svg-icon {width:24px;height:24px;mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}`
};
function Lt(d, e) {
  Y(e, !0), Pe(d, zt);
  let t = s(e, "formattedDate", 7), l = s(e, "density", 7, "regular"), o = s(e, "dimmed", 7, !1), i = s(e, "leftExtras", 7, void 0), p = s(e, "actions", 7, void 0), g = s(e, "trailing", 7, void 0);
  var _ = {
    get formattedDate() {
      return t();
    },
    set formattedDate(r) {
      t(r), a();
    },
    get density() {
      return l();
    },
    set density(r = "regular") {
      l(r), a();
    },
    get dimmed() {
      return o();
    },
    set dimmed(r = !1) {
      o(r), a();
    },
    get leftExtras() {
      return i();
    },
    set leftExtras(r = void 0) {
      i(r), a();
    },
    get actions() {
      return p();
    },
    set actions(r = void 0) {
      p(r), a();
    },
    get trailing() {
      return g();
    },
    set trailing(r = void 0) {
      g(r), a();
    }
  }, h = jt(), w = D(h), n = D(w), u = D(n, !0);
  T(n);
  var m = oe(n, 2);
  z(m, () => i() ?? G), T(w);
  var C = oe(w, 2), c = D(C);
  z(c, () => p() ?? G), T(C);
  var f = oe(C, 2), b = D(f);
  return z(b, () => g() ?? G), T(f), T(h), pe(
    (r) => {
      lt(h, 1, r, "svelte-r1d5vb"), ve(u, t());
    },
    [
      () => it(`post-preview-footer post-preview-footer-${l()} ${o() ? "is-dimmed" : ""}`.trim())
    ]
  ), y(d, h), ee(_);
}
te(
  Lt,
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
var Kt = L('<div class="xmark-icon svg-icon svelte-10wau4w"></div>'), qt = L('<div class="raw-json-heading svelte-10wau4w"><h2 class="svelte-10wau4w"> </h2></div> <pre class="raw-json-content svelte-10wau4w"><code> </code></pre>', 1);
const Ut = {
  hash: "svelte-10wau4w",
  code: `.xmark-icon.svelte-10wau4w {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-raw-json-dialog .dialog-content {padding:8px;}.raw-json-heading.svelte-10wau4w {width:100%;}.raw-json-heading.svelte-10wau4w h2:where(.svelte-10wau4w) {margin:0;font-size:1.1rem;}.raw-json-content.svelte-10wau4w {width:100%;height:100%;margin:10px 0 0;padding:8px;overflow:auto;border:1px solid var(--border-hr);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--text) 4%);color:var(--text);font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,\r
            "Liberation Mono", monospace;font-size:0.82rem;line-height:1.45;text-align:left;white-space:pre;}.post-history-raw-json-dialog {max-width:min(760px, calc(100% - 10px));}`
};
function Bt(d, e) {
  Y(e, !0), Pe(d, Ut);
  const t = () => Ke(qe, "$_", l), [l, o] = Le();
  let i = s(e, "open", 15, !1), p = s(e, "rawEvent", 7), g = s(e, "onOpenChange", 7, void 0), _ = j(() => JSON.stringify(p(), null, 2) ?? "");
  function h(u) {
    u || g()?.(!1);
  }
  var w = {
    get open() {
      return i();
    },
    set open(u = !1) {
      i(u), a();
    },
    get rawEvent() {
      return p();
    },
    set rawEvent(u) {
      p(u), a();
    },
    get onOpenChange() {
      return g();
    },
    set onOpenChange(u = void 0) {
      g(u), a();
    }
  };
  {
    const u = (c) => {
      var f = O(), b = k(f);
      {
        const r = (x, P) => {
          let A = () => P?.().props;
          {
            let W = j(() => t()("global.close"));
            Me(x, _e(A, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return S(W);
              },
              children: (re, v) => {
                var E = Kt();
                pe(($) => dt(E, "aria-label", $), [() => t()("global.close")]), y(re, E);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        N(b, () => Ct, (x, P) => {
          P(x, { child: r, $$slots: { child: !0 } });
        });
      }
      y(c, f);
    };
    let m = j(() => t()("postHistory.rawJsonTitle")), C = j(() => t()("postHistory.rawJsonDescription"));
    St(d, {
      onOpenChange: h,
      get title() {
        return S(m);
      },
      get description() {
        return S(C);
      },
      contentClass: "post-history-raw-json-dialog",
      footerVariant: "close-button",
      initialFocus: "content",
      get open() {
        return i();
      },
      set open(c) {
        i(c);
      },
      footer: u,
      children: (c, f) => {
        var b = qt(), r = k(b), x = D(r), P = D(x, !0);
        T(x), T(r);
        var A = oe(r, 2), W = D(A), re = D(W, !0);
        T(W), T(A), pe(
          (v) => {
            ve(P, v), ve(re, S(_));
          },
          [() => t()("postHistory.rawJsonTitle")]
        ), y(c, b);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var n = ee(w);
  return o(), n;
}
te(Bt, { open: {}, rawEvent: {}, onOpenChange: {} }, [], [], { mode: "open" });
var Jt = L("<!> <!>", 1);
function Wt(d, e) {
  Y(e, !0);
  let t = s(e, "tooltipContent", 7), l = s(e, "children", 7), o = s(e, "onClick", 7, void 0), i = s(e, "ariaLabel", 7, ""), p = we(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "tooltipContent",
    "children",
    "onClick",
    "ariaLabel"
  ]);
  const g = We().overlayTarget;
  var _ = {
    get tooltipContent() {
      return t();
    },
    set tooltipContent(n) {
      t(n), a();
    },
    get children() {
      return l();
    },
    set children(n) {
      l(n), a();
    },
    get onClick() {
      return o();
    },
    set onClick(n = void 0) {
      o(n), a();
    },
    get ariaLabel() {
      return i();
    },
    set ariaLabel(n = "") {
      i(n), a();
    }
  }, h = O(), w = k(h);
  return N(w, () => Ie, (n, u) => {
    u(n, {
      children: (m, C) => {
        var c = O(), f = k(c);
        N(f, () => Ne, (b, r) => {
          r(b, {
            delayDuration: 500,
            children: (x, P) => {
              var A = Jt(), W = k(A);
              {
                const v = (E, $) => {
                  let B = () => $?.().props;
                  const K = j(() => {
                    const { onclick: F, ...H } = B();
                    return { tooltipOnclick: F, restProps: H };
                  });
                  Me(E, _e(() => p, () => S(K).restProps, {
                    get ariaLabel() {
                      return i();
                    },
                    onClick: (F) => {
                      const H = o()?.(F);
                      return typeof S(K).tooltipOnclick == "function" && S(K).tooltipOnclick(F), H;
                    },
                    children: (F, H) => {
                      var q = O(), V = k(q);
                      z(V, () => l() ?? G), y(F, q);
                    },
                    $$slots: { default: !0 }
                  }));
                };
                N(W, () => je, (E, $) => {
                  $(E, { child: v, $$slots: { child: !0 } });
                });
              }
              var re = oe(W, 2);
              N(re, () => Fe, (v, E) => {
                E(v, {
                  get to() {
                    return g;
                  },
                  children: ($, B) => {
                    var K = O(), F = k(K);
                    N(F, () => ze, (H, q) => {
                      q(H, {
                        sideOffset: 8,
                        class: "tooltip-content post-preview-tooltip-content",
                        children: (V, Q) => {
                          Te();
                          var ne = De();
                          pe(() => ve(ne, t())), y(V, ne);
                        },
                        $$slots: { default: !0 }
                      });
                    }), y($, K);
                  },
                  $$slots: { default: !0 }
                });
              }), y(x, A);
            },
            $$slots: { default: !0 }
          });
        }), y(m, c);
      },
      $$slots: { default: !0 }
    });
  }), y(d, h), ee(_);
}
te(Wt, { tooltipContent: {}, children: {}, onClick: {}, ariaLabel: {} }, [], [], { mode: "open" });
var Vt = L('<div class="post-preview-toggle-row svelte-1yd56n0"><!></div>');
const Qt = {
  hash: "svelte-1yd56n0",
  code: `.post-preview-toggle-row.svelte-1yd56n0 {display:flex;.ehagaki-app-root & button.post-preview-toggle-button,
        .ehagaki-app-root & button.post-preview-toggle-button:hover {color:var(--text-muted);font-size:0.875rem;font-weight:normal;min-height:24px;padding:0;background:transparent;}

        @media (hover: hover) and (pointer: fine) {.ehagaki-app-root & button.post-preview-toggle-button:hover {text-decoration:underline;}
        }}`
};
function Zt(d, e) {
  Y(e, !0), Pe(d, Qt);
  const t = () => Ke(qe, "$_", l), [l, o] = Le();
  let i = s(e, "expanded", 7), p = s(e, "controls", 7), g = s(e, "onToggle", 7);
  var _ = {
    get expanded() {
      return i();
    },
    set expanded(u) {
      i(u), a();
    },
    get controls() {
      return p();
    },
    set controls(u) {
      p(u), a();
    },
    get onToggle() {
      return g();
    },
    set onToggle(u) {
      g(u), a();
    }
  }, h = Vt(), w = D(h);
  Me(w, {
    type: "button",
    class: "post-preview-action-button post-preview-toggle-button",
    get "aria-expanded"() {
      return i();
    },
    get "aria-controls"() {
      return p();
    },
    get onClick() {
      return g();
    },
    children: (u, m) => {
      Te();
      var C = De();
      pe((c) => ve(C, c), [
        () => i() ? t()("postHistory.collapse") : t()("postHistory.expand")
      ]), y(u, C);
    },
    $$slots: { default: !0 }
  }), T(h), y(d, h);
  var n = ee(_);
  return o(), n;
}
te(Zt, { expanded: {}, controls: {}, onToggle: {} }, [], [], { mode: "open" });
function ur() {
  let d = be(Re({})), e = be(!1), t = be(null);
  function l(u) {
    return S(d)[u] ?? !1;
  }
  function o(u, m) {
    U(d, { ...S(d), [u]: m }, !0);
  }
  function i() {
    Object.keys(S(d)).length > 0 && U(d, {}, !0);
  }
  function p(u) {
    U(e, u, !0), u || U(t, null);
  }
  function g(u) {
    i(), U(t, u, !0), U(e, !0);
  }
  function _() {
    p(!1);
  }
  function h() {
    U(t, null);
  }
  function w() {
    U(e, !1), U(t, null);
  }
  function n() {
    U(d, {}, !0), w();
  }
  return {
    get deleteConfirmOpen() {
      return S(e);
    },
    get deleteTargetPost() {
      return S(t);
    },
    isPostMenuOpen: l,
    setPostMenuOpen: o,
    closeAllPostItemMenus: i,
    setDeleteConfirmOpen: p,
    openDeleteConfirm: g,
    cancelDeleteConfirm: _,
    clearDeleteTarget: h,
    resetDeleteConfirmation: w,
    reset: n
  };
}
function pr({ getShow: d, getPosts: e, getContainer: t, maxLines: l = 5 }) {
  let o = be(Re({})), i = be(Re({})), p = {}, g = null;
  function _(b) {
    const r = getComputedStyle(b), x = parseFloat(r.lineHeight);
    if (!x || Number.isNaN(x)) {
      const P = parseFloat(r.fontSize);
      return P && !Number.isNaN(P) ? P * 1.5 : 24;
    }
    return x;
  }
  function h(b, r) {
    return p[r] = b, w(), {
      destroy() {
        p[r] === b && delete p[r];
      }
    };
  }
  async function w() {
    if (await wt(), !d()) {
      U(o, {}, !0);
      return;
    }
    const b = {};
    for (const r of e()) {
      if (r.forceCollapsible)
        continue;
      const x = p[r.eventId];
      if (!x)
        continue;
      const A = _(x) * l, W = x.scrollHeight > 0;
      b[r.eventId] = W ? x.scrollHeight > A + 0.5 : r.content.split(`
`).length > l;
    }
    U(o, b, !0);
  }
  function n() {
    const b = t();
    typeof ResizeObserver > "u" || !b || g || (g = new ResizeObserver(() => {
      w();
    }), g.observe(b));
  }
  function u() {
    g?.disconnect(), g = null;
  }
  function m() {
    U(o, {}, !0), U(i, {}, !0), p = {}, u();
  }
  function C(b) {
    return S(i)[b.eventId] ?? !1;
  }
  function c(b) {
    U(
      i,
      {
        ...S(i),
        [b]: !S(i)[b]
      },
      !0
    );
  }
  function f(b) {
    return b.forceCollapsible === !0 || (S(o)[b.eventId] ?? !1);
  }
  return Ee(() => {
    d() || m();
  }), Ee(() => {
    d() && (e(), w());
  }), Ee(() => {
    if (!(!d() || !t()))
      return n(), () => {
        u();
      };
  }), ct(() => {
    u();
  }), {
    previewRef: h,
    isPostExpanded: C,
    remeasure: w,
    togglePostExpanded: c,
    shouldCollapsePost: f
  };
}
const Xt = [1, 42];
function Gt() {
  return {
    log: () => {
    },
    warn: () => {
    },
    error: () => {
    }
  };
}
function Yt(d, e) {
  return !e || d.pubkeyHex !== e || typeof d.deletedAt == "number" ? !1 : Xt.includes(d.kind) && typeof d.eventId == "string" && d.eventId.length > 0;
}
function er(d, e = Math.floor(Date.now() / 1e3)) {
  return {
    kind: 5,
    pubkey: d.pubkeyHex,
    content: "",
    tags: [["e", d.eventId], ["k", String(d.kind)]],
    created_at: e
  };
}
function tr(d, e) {
  return Je.sanitizeExternalRelayUrls([
    ...d.acceptedRelays ?? [],
    ...d.fetchedRelays ?? [],
    ...d.relayHints ?? [],
    ...d.kind === 42 ? d.channelRelayHints ?? [] : [],
    ...e
  ]);
}
class rr {
  deps;
  constructor(e = {}) {
    this.deps = {
      authStateStore: e.authStateStore ?? gt,
      keyManager: e.keyManager ?? vt,
      window: e.window ?? (typeof window < "u" ? window : {}),
      console: e.console ?? (typeof globalThis.console < "u" ? globalThis.console : Gt()),
      seckeySignerFn: e.seckeySignerFn ?? pt,
      getNip46SignerForSessionFn: e.getNip46SignerForSessionFn ?? ((t) => ht.getSignerForSession(t)),
      getParentClientSignerFn: e.getParentClientSignerFn ?? (() => ft.getSigner()),
      writeRelaysStore: e.writeRelaysStore ?? Ue,
      postHistoryDeletionRequestsRepository: e.postHistoryDeletionRequestsRepository ?? ut,
      eventSenderFactory: e.eventSenderFactory,
      now: e.now ?? Date.now
    };
  }
  async requestDeletion(e) {
    const t = this.deps.authStateStore.value, l = t.pubkey || null;
    if (!e.rxNostr)
      return { success: !1, error: "nostr_not_ready" };
    if (!t.isAuthenticated || !l)
      return { success: !1, error: "pubkey_not_found" };
    const o = () => _t(
      this.deps.authStateStore,
      l
    );
    if (!Yt(e.post, l))
      return { success: !1, error: "deletion_request_not_allowed" };
    let i;
    if (t.type === "nip46")
      try {
        o(), i = await this.deps.getNip46SignerForSessionFn(
          l
        );
        const C = this.deps.authStateStore.value;
        if (!i || !C.isAuthenticated || C.type !== "nip46" || C.pubkey !== l)
          return { success: !1, error: "nip46_signer_not_available" };
      } catch {
        return this.deps.console.error("post_deletion_nip46_signer_failed", {
          stage: "resolve-signer",
          reason: "unexpected"
        }), { success: !1, error: "post_error" };
      }
    const p = this.resolveSigner(t, i);
    if (p.error)
      return { success: !1, error: p.error };
    try {
      o();
    } catch {
      return { success: !1, error: "post_error" };
    }
    const g = er(
      e.post,
      Math.floor(this.deps.now() / 1e3)
    );
    let _;
    try {
      o();
      const C = mt(g);
      _ = await p.signEvent(C.signerTemplate), o(), _ = yt(
        C.expectedTemplate,
        _,
        l
      ), o();
    } catch {
      return this.deps.console.error("post_deletion_sign_failed", {
        stage: "sign-event",
        reason: "unexpected"
      }), { success: !1, error: "post_error" };
    }
    const h = bt(
      _
    );
    if (!h)
      return { success: !1, error: "post_error" };
    const w = tr(
      e.post,
      this.deps.writeRelaysStore.value
    );
    let n;
    try {
      o(), n = await this.createEventSender(e.rxNostr).sendEvent(
        h.event,
        {
          targetRelays: w,
          includeDefaultWriteRelays: !0
        }
      );
    } catch {
      return this.deps.console.error("post_deletion_send_failed", {
        stage: "publish",
        reason: "unexpected"
      }), { success: !1, error: "post_error" };
    }
    if (!n.success)
      return n;
    const u = h.event.id ?? n.eventId;
    if (!u)
      return { success: !1, error: "post_error" };
    const m = this.deps.now();
    try {
      await this.deps.postHistoryDeletionRequestsRepository.saveLocalDeletion({
        targetEventId: e.post.eventId,
        deletionEvent: h.event,
        attestation: h.attestation,
        deletedAt: m,
        relayUrls: w
      });
    } catch {
      this.deps.console.warn("post_history_local_deletion_save_failed", {
        stage: "post-history",
        reason: "unexpected"
      });
    }
    return {
      ...n,
      eventId: u,
      deletionEventId: u,
      deletionEvent: h.event,
      deletionEventAttestation: h.attestation,
      deletedAt: m
    };
  }
  createEventSender(e) {
    return this.deps.eventSenderFactory ? this.deps.eventSenderFactory(e, this.deps.console) : new Be(e, this.deps.console);
  }
  resolveSigner(e, t) {
    if (e.type === "nip07") {
      const o = this.deps.window.nostr?.signEvent;
      return typeof o == "function" ? { signEvent: o.bind(this.deps.window.nostr) } : { error: "nostr_sign_event_not_supported" };
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
    const l = this.deps.keyManager.getFromStore() || this.deps.keyManager.loadFromStorage(e.pubkey);
    return l ? this.resolveExternalSigner(
      this.deps.seckeySignerFn(l),
      "nostr_sign_event_not_supported"
    ) : { error: "key_not_found" };
  }
  resolveExternalSigner(e, t) {
    return e ? typeof e.signEvent == "function" ? { signEvent: e.signEvent.bind(e) } : { error: "nostr_sign_event_not_supported" } : { error: t };
  }
}
const vr = new rr();
function nr() {
  return {
    log: () => {
    },
    warn: () => {
    },
    error: () => {
    }
  };
}
function or(d) {
  const e = d.rawEvent;
  if (!e || typeof e != "object")
    return null;
  const t = e;
  return typeof t.id != "string" || typeof t.pubkey != "string" || typeof t.created_at != "number" || typeof t.kind != "number" || !Array.isArray(t.tags) || typeof t.content != "string" || typeof t.sig != "string" ? null : t;
}
class sr {
  deps;
  constructor(e = {}) {
    this.deps = {
      writeRelaysStore: e.writeRelaysStore ?? Ue,
      console: e.console ?? (typeof globalThis.console < "u" ? globalThis.console : nr())
    };
  }
  async broadcast(e) {
    if (!e.rxNostr)
      return { success: !1, error: "nostr_not_ready" };
    const t = e.rxNostr, l = or(e.post);
    if (!l)
      return { success: !1, error: "invalid_event" };
    const o = Je.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore.value
    );
    return o.length === 0 ? { success: !1, error: "no_write_relays" } : new Be(t, this.deps.console).sendEvent(l, {
      targetRelays: o,
      includeDefaultWriteRelays: !1
    });
  }
}
const gr = new sr();
export {
  Ze as D,
  kt as M,
  Lt as P,
  Ve as a,
  Nt as b,
  pr as c,
  Bt as d,
  $e as e,
  Qe as f,
  Yt as g,
  Zt as h,
  gr as i,
  Wt as j,
  vr as p,
  or as r,
  ur as u
};
