import { I as o, dP as Ye, aO as j, K as ie, aP as X, aQ as ae, aR as q, aS as ue, aT as he, aU as we, dQ as et, dR as tt, dS as rt, bZ as nt, dT as ot, dK as st, b1 as _e, dL as it, dM as He, dU as at, H as Pe, a_ as z, b_ as Re, cx as je, cu as ze, cv as Le, cw as Ke, cy as lt, M as dt, Q as qe, aZ as $e, N as ct, V as Ue, $ as Be, bT as ut, cs as pt, w as Je, i as vt, k as gt, a as ft, ag as ht, ah as mt, y as yt, z as bt, A as _t, P as Ve, x as wt, G as xt } from "./App-UP5voPz2.js";
import { b7 as ke, b0 as te, b1 as $, b2 as O, b3 as b, b4 as re, b5 as s, b6 as ne, a as x, b8 as A, n as ee, b9 as H, aR as K, ba as U, bl as We, bf as oe, bh as De, Z as pe, bi as ve, bj as Te, aS as be, aJ as Fe, b as Q, aN as Ee, a$ as Ne, bk as Ie } from "./entry-jZ4F5rmU.js";
import { F as St } from "./floating-layer-anchor-Cr-GvakT.js";
import { D as Ct, a as Pt } from "./DialogWrapper-CpJ85Ejw.js";
var kt = U("<div><!></div>");
function Ot(l, e) {
  const t = ke();
  te(e, !0);
  let a = o(e, "child", 7), n = o(e, "children", 7), i = o(e, "ref", 15, null), p = o(e, "id", 23, () => ae(t)), h = o(e, "disabled", 7, !1), _ = o(e, "onSelect", 7, X), f = o(e, "closeOnSelect", 7, !0), w = we(e, [
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
  const r = Ye.create({
    id: j(() => p()),
    disabled: j(() => h()),
    onSelect: j(() => _()),
    ref: j(() => i(), (c) => i(c)),
    closeOnSelect: j(() => f())
  }), v = K(() => he(w, r.props));
  var y = {
    get child() {
      return a();
    },
    set child(c) {
      a(c), s();
    },
    get children() {
      return n();
    },
    set children(c) {
      n(c), s();
    },
    get ref() {
      return i();
    },
    set ref(c = null) {
      i(c), s();
    },
    get id() {
      return p();
    },
    set id(c = ae(t)) {
      p(c), s();
    },
    get disabled() {
      return h();
    },
    set disabled(c = !1) {
      h(c), s();
    },
    get onSelect() {
      return _();
    },
    set onSelect(c = X) {
      _(c), s();
    },
    get closeOnSelect() {
      return f();
    },
    set closeOnSelect(c = !0) {
      f(c), s();
    }
  }, C = $(), d = O(C);
  {
    var m = (c) => {
      var E = $(), R = O(E);
      q(R, a, () => ({ props: x(v) })), b(c, E);
    }, M = (c) => {
      var E = kt();
      ue(E, () => ({ ...x(v) }));
      var R = A(E);
      q(R, () => n() ?? ee), H(E), b(c, E);
    };
    ie(d, (c) => {
      a() ? c(m) : c(M, -1);
    });
  }
  return b(l, C), re(y);
}
ne(
  Ot,
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
var Et = U("<div><!></div>");
function Qe(l, e) {
  const t = ke();
  te(e, !0);
  let a = o(e, "ref", 15, null), n = o(e, "id", 23, () => ae(t)), i = o(e, "child", 7), p = o(e, "children", 7), h = we(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "id",
    "child",
    "children"
  ]);
  const _ = et.create({
    id: j(() => n()),
    ref: j(() => a(), (d) => a(d))
  }), f = K(() => he(h, _.props));
  var w = {
    get ref() {
      return a();
    },
    set ref(d = null) {
      a(d), s();
    },
    get id() {
      return n();
    },
    set id(d = ae(t)) {
      n(d), s();
    },
    get child() {
      return i();
    },
    set child(d) {
      i(d), s();
    },
    get children() {
      return p();
    },
    set children(d) {
      p(d), s();
    }
  }, r = $(), v = O(r);
  {
    var y = (d) => {
      var m = $(), M = O(m);
      q(M, i, () => ({ props: x(f) })), b(d, m);
    }, C = (d) => {
      var m = Et();
      ue(m, () => ({ ...x(f) }));
      var M = A(m);
      q(M, () => p() ?? ee), H(m), b(d, m);
    };
    ie(v, (d) => {
      i() ? d(y) : d(C, -1);
    });
  }
  return b(l, r), re(w);
}
ne(Qe, { ref: {}, id: {}, child: {}, children: {} }, [], [], { mode: "open" });
function Ze(l, e) {
  te(e, !0);
  let t = o(e, "open", 15, !1), a = o(e, "dir", 7, "ltr"), n = o(e, "onOpenChange", 7, X), i = o(e, "onOpenChangeComplete", 7, X), p = o(e, "_internal_variant", 7, "dropdown-menu"), h = o(e, "_internal_should_skip_exit_animation", 7, void 0), _ = o(e, "children", 7);
  const f = tt.create({
    variant: j(() => p()),
    dir: j(() => a()),
    // debugMode: boxWith(() => debugMode),
    onClose: () => {
      t(!1), n()(!1);
    },
    shouldSkipExitAnimation: () => h()?.() ?? !1
  });
  rt.create(
    {
      open: j(() => t(), (r) => {
        t(r), n()(r);
      }),
      onOpenChangeComplete: j(() => i())
    },
    f
  );
  var w = {
    get open() {
      return t();
    },
    set open(r = !1) {
      t(r), s();
    },
    get dir() {
      return a();
    },
    set dir(r = "ltr") {
      a(r), s();
    },
    get onOpenChange() {
      return n();
    },
    set onOpenChange(r = X) {
      n(r), s();
    },
    get onOpenChangeComplete() {
      return i();
    },
    set onOpenChangeComplete(r = X) {
      i(r), s();
    },
    get _internal_variant() {
      return p();
    },
    set _internal_variant(r = "dropdown-menu") {
      p(r), s();
    },
    get _internal_should_skip_exit_animation() {
      return h();
    },
    set _internal_should_skip_exit_animation(r = void 0) {
      h(r), s();
    },
    get children() {
      return _();
    },
    set children(r) {
      _(r), s();
    }
  };
  return nt(l, {
    children: (r, v) => {
      var y = $(), C = O(y);
      q(C, () => _() ?? ee), b(r, y);
    },
    $$slots: { default: !0 }
  }), re(w);
}
ne(
  Ze,
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
var Rt = U("<div><div><!></div></div>"), Ft = U("<div><div><!></div></div>");
function Ge(l, e) {
  const t = ke();
  te(e, !0);
  let a = o(e, "id", 23, () => ae(t)), n = o(e, "child", 7), i = o(e, "children", 7), p = o(e, "ref", 15, null), h = o(e, "loop", 7, !0), _ = o(e, "onInteractOutside", 7, X), f = o(e, "onEscapeKeydown", 7, X), w = o(e, "onCloseAutoFocus", 7, X), r = o(e, "forceMount", 7, !1), v = o(e, "trapFocus", 7, !1), y = o(e, "style", 7), C = we(e, [
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
  const d = ot.create({
    id: j(() => a()),
    loop: j(() => h()),
    ref: j(() => p(), (u) => p(u)),
    onCloseAutoFocus: j(() => w())
  }), m = K(() => he(C, d.props));
  function M(u) {
    if (d.handleInteractOutside(u), !u.defaultPrevented && (_()(u), !u.defaultPrevented)) {
      if (u.target && u.target instanceof Element) {
        const g = `[${d.parentMenu.root.getBitsAttr("sub-content")}]`;
        if (u.target.closest(g)) return;
      }
      d.parentMenu.onClose();
    }
  }
  function c(u) {
    f()(u), !u.defaultPrevented && d.parentMenu.onClose();
  }
  var E = {
    get id() {
      return a();
    },
    set id(u = ae(t)) {
      a(u), s();
    },
    get child() {
      return n();
    },
    set child(u) {
      n(u), s();
    },
    get children() {
      return i();
    },
    set children(u) {
      i(u), s();
    },
    get ref() {
      return p();
    },
    set ref(u = null) {
      p(u), s();
    },
    get loop() {
      return h();
    },
    set loop(u = !0) {
      h(u), s();
    },
    get onInteractOutside() {
      return _();
    },
    set onInteractOutside(u = X) {
      _(u), s();
    },
    get onEscapeKeydown() {
      return f();
    },
    set onEscapeKeydown(u = X) {
      f(u), s();
    },
    get onCloseAutoFocus() {
      return w();
    },
    set onCloseAutoFocus(u = X) {
      w(u), s();
    },
    get forceMount() {
      return r();
    },
    set forceMount(u = !1) {
      r(u), s();
    },
    get trapFocus() {
      return v();
    },
    set trapFocus(u = !1) {
      v(u), s();
    },
    get style() {
      return y();
    },
    set style(u) {
      y(u), s();
    }
  }, R = $(), N = O(R);
  {
    var W = (u) => {
      st(u, _e(() => x(m), () => d.popperProps, {
        get ref() {
          return d.opts.ref;
        },
        get enabled() {
          return d.parentMenu.opts.open.current;
        },
        onInteractOutside: M,
        onEscapeKeydown: c,
        get trapFocus() {
          return v();
        },
        get loop() {
          return h();
        },
        forceMount: !0,
        get id() {
          return a();
        },
        get shouldRender() {
          return d.shouldRender;
        },
        popper: (S, F) => {
          let k = () => F?.().props, P = () => F?.().wrapperProps;
          const D = K(() => he(k(), { style: He("dropdown-menu") }, { style: y() }));
          var L = $(), B = O(L);
          {
            var J = (I) => {
              var T = $(), V = O(T);
              {
                let G = K(() => ({
                  props: x(D),
                  wrapperProps: P(),
                  ...d.snippetProps
                }));
                q(V, n, () => x(G));
              }
              b(I, T);
            }, Z = (I) => {
              var T = Rt();
              ue(T, () => ({ ...P() }));
              var V = A(T);
              ue(V, () => ({ ...x(D) }));
              var G = A(V);
              q(G, () => i() ?? ee), H(V), H(T), b(I, T);
            };
            ie(B, (I) => {
              n() ? I(J) : I(Z, -1);
            });
          }
          b(S, L);
        },
        $$slots: { popper: !0 }
      }));
    }, Y = (u) => {
      it(u, _e(() => x(m), () => d.popperProps, {
        get ref() {
          return d.opts.ref;
        },
        get open() {
          return d.parentMenu.opts.open.current;
        },
        onInteractOutside: M,
        onEscapeKeydown: c,
        get trapFocus() {
          return v();
        },
        get loop() {
          return h();
        },
        forceMount: !1,
        get id() {
          return a();
        },
        get shouldRender() {
          return d.shouldRender;
        },
        popper: (S, F) => {
          let k = () => F?.().props, P = () => F?.().wrapperProps;
          const D = K(() => he(k(), { style: He("dropdown-menu") }, { style: y() }));
          var L = $(), B = O(L);
          {
            var J = (I) => {
              var T = $(), V = O(T);
              {
                let G = K(() => ({
                  props: x(D),
                  wrapperProps: P(),
                  ...d.snippetProps
                }));
                q(V, n, () => x(G));
              }
              b(I, T);
            }, Z = (I) => {
              var T = Ft();
              ue(T, () => ({ ...P() }));
              var V = A(T);
              ue(V, () => ({ ...x(D) }));
              var G = A(V);
              q(G, () => i() ?? ee), H(V), H(T), b(I, T);
            };
            ie(B, (I) => {
              n() ? I(J) : I(Z, -1);
            });
          }
          b(S, L);
        },
        $$slots: { popper: !0 }
      }));
    };
    ie(N, (u) => {
      r() ? u(W) : r() || u(Y, 1);
    });
  }
  return b(l, R), re(E);
}
ne(
  Ge,
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
var Mt = U("<button><!></button>");
function Me(l, e) {
  const t = ke();
  te(e, !0);
  let a = o(e, "id", 23, () => ae(t)), n = o(e, "ref", 15, null), i = o(e, "child", 7), p = o(e, "children", 7), h = o(e, "disabled", 7, !1), _ = o(e, "type", 7, "button"), f = we(e, [
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
    id: j(() => a()),
    disabled: j(() => h() ?? !1),
    ref: j(() => n(), (y) => n(y))
  }), r = K(() => he(f, w.props, { type: _() }));
  var v = {
    get id() {
      return a();
    },
    set id(y = ae(t)) {
      a(y), s();
    },
    get ref() {
      return n();
    },
    set ref(y = null) {
      n(y), s();
    },
    get child() {
      return i();
    },
    set child(y) {
      i(y), s();
    },
    get children() {
      return p();
    },
    set children(y) {
      p(y), s();
    },
    get disabled() {
      return h();
    },
    set disabled(y = !1) {
      h(y), s();
    },
    get type() {
      return _();
    },
    set type(y = "button") {
      _(y), s();
    }
  };
  return St(l, {
    get id() {
      return a();
    },
    get ref() {
      return w.opts.ref;
    },
    children: (y, C) => {
      var d = $(), m = O(d);
      {
        var M = (E) => {
          var R = $(), N = O(R);
          q(N, i, () => ({ props: x(r) })), b(E, R);
        }, c = (E) => {
          var R = Mt();
          ue(R, () => ({ ...x(r) }));
          var N = A(R);
          q(N, () => p() ?? ee), H(R), b(E, R);
        };
        ie(m, (E) => {
          i() ? E(M) : E(c, -1);
        });
      }
      b(y, d);
    },
    $$slots: { default: !0 }
  }), re(v);
}
ne(
  Me,
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
var $t = U('<div class="more-icon svg-icon"></div>'), Dt = U("<!> <!>", 1), Tt = U('<div class="more-icon svg-icon"></div>'), It = U('<div class="post-history-menu-timestamp"> </div> <!>', 1), At = U('<div class="post-history-menu-body"><!> <!></div>'), Ht = U("<!> <!>", 1);
const Nt = {
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
function jt(l, e) {
  te(e, !0), Pe(l, Nt);
  let t = o(e, "open", 7, !1), a = o(e, "onOpenChange", 7, void 0), n = o(e, "triggerAriaLabel", 7), i = o(e, "triggerClassName", 7, ""), p = o(e, "align", 7, "start"), h = o(e, "timestamp", 7, void 0), _ = o(e, "items", 7, void 0), f = o(e, "tooltipContent", 7, void 0), w = o(e, "enableTooltip", 7, !1);
  const r = We().overlayTarget;
  function v(m) {
    a()?.(m);
  }
  var y = {
    get open() {
      return t();
    },
    set open(m = !1) {
      t(m), s();
    },
    get onOpenChange() {
      return a();
    },
    set onOpenChange(m = void 0) {
      a(m), s();
    },
    get triggerAriaLabel() {
      return n();
    },
    set triggerAriaLabel(m) {
      n(m), s();
    },
    get triggerClassName() {
      return i();
    },
    set triggerClassName(m = "") {
      i(m), s();
    },
    get align() {
      return p();
    },
    set align(m = "start") {
      p(m), s();
    },
    get timestamp() {
      return h();
    },
    set timestamp(m = void 0) {
      h(m), s();
    },
    get items() {
      return _();
    },
    set items(m = void 0) {
      _(m), s();
    },
    get tooltipContent() {
      return f();
    },
    set tooltipContent(m = void 0) {
      f(m), s();
    },
    get enableTooltip() {
      return w();
    },
    set enableTooltip(m = !1) {
      w(m), s();
    }
  }, C = $(), d = O(C);
  return z(d, () => Ze, (m, M) => {
    M(m, {
      get open() {
        return t();
      },
      onOpenChange: v,
      children: (c, E) => {
        var R = Ht(), N = O(R);
        {
          var W = (g) => {
            var S = $(), F = O(S);
            z(F, () => je, (k, P) => {
              P(k, {
                children: (D, L) => {
                  var B = $(), J = O(B);
                  z(J, () => ze, (Z, I) => {
                    I(Z, {
                      delayDuration: 500,
                      children: (T, V) => {
                        var G = Dt(), ge = O(G);
                        {
                          const le = (de, ce) => {
                            let Se = () => ce?.().props;
                            const se = K(() => {
                              const { onclick: me, ...ye } = Se();
                              return { tooltipOnclick: me, restProps: ye };
                            });
                            var Ce = $(), Oe = O(Ce);
                            {
                              let me = K(() => `menu-trigger post-history-menu-trigger ${i()} ${t() ? "is-open" : ""}`.trim());
                              z(Oe, () => Me, (ye, Ae) => {
                                Ae(ye, _e(
                                  {
                                    get class() {
                                      return x(me);
                                    },
                                    get "aria-label"() {
                                      return n();
                                    }
                                  },
                                  () => x(se).restProps,
                                  {
                                    onclick: (fe) => {
                                      typeof x(se).tooltipOnclick == "function" && x(se).tooltipOnclick(fe);
                                    },
                                    children: (fe, ar) => {
                                      var Xe = $t();
                                      b(fe, Xe);
                                    },
                                    $$slots: { default: !0 }
                                  }
                                ));
                              });
                            }
                            b(de, Ce);
                          };
                          z(ge, () => Le, (de, ce) => {
                            ce(de, { child: le, $$slots: { child: !0 } });
                          });
                        }
                        var xe = oe(ge, 2);
                        z(xe, () => Re, (le, de) => {
                          de(le, {
                            get to() {
                              return r;
                            },
                            children: (ce, Se) => {
                              var se = $(), Ce = O(se);
                              z(Ce, () => Ke, (Oe, me) => {
                                me(Oe, {
                                  sideOffset: 8,
                                  class: "tooltip-content post-preview-tooltip-content",
                                  children: (ye, Ae) => {
                                    Te();
                                    var fe = De();
                                    pe(() => ve(fe, f())), b(ye, fe);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), b(ce, se);
                            },
                            $$slots: { default: !0 }
                          });
                        }), b(T, G);
                      },
                      $$slots: { default: !0 }
                    });
                  }), b(D, B);
                },
                $$slots: { default: !0 }
              });
            }), b(g, S);
          }, Y = (g) => {
            var S = $(), F = O(S);
            {
              let k = K(() => `menu-trigger post-history-menu-trigger ${i()} ${t() ? "is-open" : ""}`.trim());
              z(F, () => Me, (P, D) => {
                D(P, {
                  get class() {
                    return x(k);
                  },
                  get "aria-label"() {
                    return n();
                  },
                  children: (L, B) => {
                    var J = Tt();
                    b(L, J);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            b(g, S);
          };
          ie(N, (g) => {
            w() && f() ? g(W) : g(Y, -1);
          });
        }
        var u = oe(N, 2);
        z(u, () => Re, (g, S) => {
          S(g, {
            get to() {
              return r;
            },
            children: (F, k) => {
              var P = $(), D = O(P);
              z(D, () => Ge, (L, B) => {
                B(L, {
                  side: "bottom",
                  get align() {
                    return p();
                  },
                  sideOffset: 8,
                  class: "post-history-menu-content",
                  trapFocus: !1,
                  preventScroll: !1,
                  onCloseAutoFocus: (J) => J.preventDefault(),
                  children: (J, Z) => {
                    var I = At(), T = A(I);
                    {
                      var V = (ge) => {
                        var xe = It(), le = O(xe), de = A(le, !0);
                        H(le);
                        var ce = oe(le, 2);
                        z(ce, () => Qe, (Se, se) => {
                          se(Se, { class: "post-history-menu-separator" });
                        }), pe(() => ve(de, h())), b(ge, xe);
                      };
                      ie(T, (ge) => {
                        h() && ge(V);
                      });
                    }
                    var G = oe(T, 2);
                    q(G, () => _() ?? ee), H(I), b(J, I);
                  },
                  $$slots: { default: !0 }
                });
              }), b(F, P);
            },
            $$slots: { default: !0 }
          });
        }), b(c, R);
      },
      $$slots: { default: !0 }
    });
  }), b(l, C), re(y);
}
ne(
  jt,
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
var zt = U('<div><div class="post-preview-footer-left svelte-r1d5vb"><span class="post-preview-date svelte-r1d5vb"> </span> <!></div> <div class="post-preview-footer-actions svelte-r1d5vb"><!></div> <div class="post-preview-footer-right svelte-r1d5vb"><!></div></div>');
const Lt = {
  hash: "svelte-r1d5vb",
  code: `.post-preview-footer.svelte-r1d5vb {display:flex;align-items:stretch;justify-content:space-between;height:var(--post-history-preview-footer-height);color:var(--btn-post-preview-action);--post-history-preview-footer-surface: var(--dialog-bg);}.post-preview-footer-regular.svelte-r1d5vb {--post-history-preview-footer-height: 36px;padding-inline-start:1rem;}.post-preview-footer-compact.svelte-r1d5vb {--post-history-preview-footer-height: 28px;--post-history-preview-footer-surface: var(\r
            --post-history-related-card-bg,\r
            var(--dialog-bg)\r
        );}.post-preview-footer.is-dimmed.svelte-r1d5vb {opacity:0.65;}.post-preview-footer-left.svelte-r1d5vb,\r
    .post-preview-footer-actions.svelte-r1d5vb,\r
    .post-preview-footer-right.svelte-r1d5vb {display:flex;align-items:stretch;}.post-preview-footer-left.svelte-r1d5vb {align-items:center;justify-content:flex-start;min-width:0;}.post-preview-footer-regular.svelte-r1d5vb .post-preview-footer-left:where(.svelte-r1d5vb) {min-width:80px;}.post-preview-footer-actions.svelte-r1d5vb {justify-content:center;flex:1 1 auto;min-width:0;}.post-preview-footer-regular.svelte-r1d5vb .post-preview-footer-actions:where(.svelte-r1d5vb) {justify-content:space-around;}.post-preview-footer-right.svelte-r1d5vb {align-items:center;justify-content:flex-end;flex:0 0 auto;}.post-preview-date.svelte-r1d5vb {overflow:hidden;color:var(--text-muted);font-size:0.875rem;text-overflow:ellipsis;white-space:nowrap;}.post-preview-footer-regular.svelte-r1d5vb .post-preview-date:where(.svelte-r1d5vb) {font-size:0.9375rem;}.post-preview-footer-replies-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-footer-reaction-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 70px;min-width:70px;}.post-history-action-button,
    .post-preview-reactions-button {min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface);background-color:var(--post-history-preview-footer-surface);}.post-preview-action-buttons-group {display:flex;align-items:stretch;}.post-preview-action-button {position:relative;}.post-history-action-button {color:var(--btn-post-preview-action);}.post-history-action-button .svg-icon {--svg: currentColor;}.post-preview-footer .reply-icon.svg-icon {width:20px;height:20px;margin-top:2px;mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-preview-footer .quote-icon.svg-icon {width:24px;height:24px;mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}`
};
function Kt(l, e) {
  te(e, !0), Pe(l, Lt);
  let t = o(e, "formattedDate", 7), a = o(e, "density", 7, "regular"), n = o(e, "dimmed", 7, !1), i = o(e, "leftExtras", 7, void 0), p = o(e, "actions", 7, void 0), h = o(e, "trailing", 7, void 0);
  var _ = {
    get formattedDate() {
      return t();
    },
    set formattedDate(c) {
      t(c), s();
    },
    get density() {
      return a();
    },
    set density(c = "regular") {
      a(c), s();
    },
    get dimmed() {
      return n();
    },
    set dimmed(c = !1) {
      n(c), s();
    },
    get leftExtras() {
      return i();
    },
    set leftExtras(c = void 0) {
      i(c), s();
    },
    get actions() {
      return p();
    },
    set actions(c = void 0) {
      p(c), s();
    },
    get trailing() {
      return h();
    },
    set trailing(c = void 0) {
      h(c), s();
    }
  }, f = zt(), w = A(f), r = A(w), v = A(r, !0);
  H(r);
  var y = oe(r, 2);
  q(y, () => i() ?? ee), H(w);
  var C = oe(w, 2), d = A(C);
  q(d, () => p() ?? ee), H(C);
  var m = oe(C, 2), M = A(m);
  return q(M, () => h() ?? ee), H(m), H(f), pe(
    (c) => {
      dt(f, 1, c, "svelte-r1d5vb"), ve(v, t());
    },
    [
      () => lt(`post-preview-footer post-preview-footer-${a()} ${n() ? "is-dimmed" : ""}`.trim())
    ]
  ), b(l, f), re(_);
}
ne(
  Kt,
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
var qt = U('<div class="xmark-icon svg-icon svelte-10wau4w"></div>'), Ut = U('<div class="raw-json-heading svelte-10wau4w"><h2 class="svelte-10wau4w"> </h2></div> <pre class="raw-json-content svelte-10wau4w"><code> </code></pre>', 1);
const Bt = {
  hash: "svelte-10wau4w",
  code: `.xmark-icon.svelte-10wau4w {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-raw-json-dialog .dialog-content {padding:8px;}.raw-json-heading.svelte-10wau4w {width:100%;}.raw-json-heading.svelte-10wau4w h2:where(.svelte-10wau4w) {margin:0;font-size:1.1rem;}.raw-json-content.svelte-10wau4w {width:100%;height:100%;margin:10px 0 0;padding:8px;overflow:auto;border:1px solid var(--border-hr);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--text) 4%);color:var(--text);font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,\r
            "Liberation Mono", monospace;font-size:0.82rem;line-height:1.45;text-align:left;white-space:pre;}.post-history-raw-json-dialog {max-width:min(760px, calc(100% - 10px));}`
};
function Jt(l, e) {
  te(e, !0), Pe(l, Bt);
  const t = () => Ue(Be, "$_", a), [a, n] = qe();
  let i = o(e, "open", 15, !1), p = o(e, "rawEvent", 7), h = o(e, "onOpenChange", 7, void 0), _ = K(() => JSON.stringify(p(), null, 2) ?? "");
  function f(v) {
    v || h()?.(!1);
  }
  var w = {
    get open() {
      return i();
    },
    set open(v = !1) {
      i(v), s();
    },
    get rawEvent() {
      return p();
    },
    set rawEvent(v) {
      p(v), s();
    },
    get onOpenChange() {
      return h();
    },
    set onOpenChange(v = void 0) {
      h(v), s();
    }
  };
  {
    const v = (d) => {
      var m = $(), M = O(m);
      {
        const c = (E, R) => {
          let N = () => R?.().props;
          {
            let W = K(() => t()("global.close"));
            $e(E, _e(N, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return x(W);
              },
              children: (Y, u) => {
                var g = qt();
                pe((S) => ct(g, "aria-label", S), [() => t()("global.close")]), b(Y, g);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        z(M, () => Pt, (E, R) => {
          R(E, { child: c, $$slots: { child: !0 } });
        });
      }
      b(d, m);
    };
    let y = K(() => t()("postHistory.rawJsonTitle")), C = K(() => t()("postHistory.rawJsonDescription"));
    Ct(l, {
      onOpenChange: f,
      get title() {
        return x(y);
      },
      get description() {
        return x(C);
      },
      contentClass: "post-history-raw-json-dialog",
      footerVariant: "close-button",
      initialFocus: "content",
      get open() {
        return i();
      },
      set open(d) {
        i(d);
      },
      footer: v,
      children: (d, m) => {
        var M = Ut(), c = O(M), E = A(c), R = A(E, !0);
        H(E), H(c);
        var N = oe(c, 2), W = A(N), Y = A(W, !0);
        H(W), H(N), pe(
          (u) => {
            ve(R, u), ve(Y, x(_));
          },
          [() => t()("postHistory.rawJsonTitle")]
        ), b(d, M);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var r = re(w);
  return n(), r;
}
ne(Jt, { open: {}, rawEvent: {}, onOpenChange: {} }, [], [], { mode: "open" });
var Vt = U("<!> <!>", 1);
function Wt(l, e) {
  te(e, !0);
  let t = o(e, "tooltipContent", 7), a = o(e, "children", 7), n = o(e, "onClick", 7, void 0), i = o(e, "ariaLabel", 7, ""), p = we(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "tooltipContent",
    "children",
    "onClick",
    "ariaLabel"
  ]);
  const h = We().overlayTarget;
  var _ = {
    get tooltipContent() {
      return t();
    },
    set tooltipContent(r) {
      t(r), s();
    },
    get children() {
      return a();
    },
    set children(r) {
      a(r), s();
    },
    get onClick() {
      return n();
    },
    set onClick(r = void 0) {
      n(r), s();
    },
    get ariaLabel() {
      return i();
    },
    set ariaLabel(r = "") {
      i(r), s();
    }
  }, f = $(), w = O(f);
  return z(w, () => je, (r, v) => {
    v(r, {
      children: (y, C) => {
        var d = $(), m = O(d);
        z(m, () => ze, (M, c) => {
          c(M, {
            delayDuration: 500,
            children: (E, R) => {
              var N = Vt(), W = O(N);
              {
                const u = (g, S) => {
                  let F = () => S?.().props;
                  const k = K(() => {
                    const { onclick: P, ...D } = F();
                    return { tooltipOnclick: P, restProps: D };
                  });
                  $e(g, _e(() => p, () => x(k).restProps, {
                    get ariaLabel() {
                      return i();
                    },
                    onClick: (P) => {
                      const D = n()?.(P);
                      return typeof x(k).tooltipOnclick == "function" && x(k).tooltipOnclick(P), D;
                    },
                    children: (P, D) => {
                      var L = $(), B = O(L);
                      q(B, () => a() ?? ee), b(P, L);
                    },
                    $$slots: { default: !0 }
                  }));
                };
                z(W, () => Le, (g, S) => {
                  S(g, { child: u, $$slots: { child: !0 } });
                });
              }
              var Y = oe(W, 2);
              z(Y, () => Re, (u, g) => {
                g(u, {
                  get to() {
                    return h;
                  },
                  children: (S, F) => {
                    var k = $(), P = O(k);
                    z(P, () => Ke, (D, L) => {
                      L(D, {
                        sideOffset: 8,
                        class: "tooltip-content post-preview-tooltip-content",
                        children: (B, J) => {
                          Te();
                          var Z = De();
                          pe(() => ve(Z, t())), b(B, Z);
                        },
                        $$slots: { default: !0 }
                      });
                    }), b(S, k);
                  },
                  $$slots: { default: !0 }
                });
              }), b(E, N);
            },
            $$slots: { default: !0 }
          });
        }), b(y, d);
      },
      $$slots: { default: !0 }
    });
  }), b(l, f), re(_);
}
ne(Wt, { tooltipContent: {}, children: {}, onClick: {}, ariaLabel: {} }, [], [], { mode: "open" });
var Qt = U('<div class="post-preview-toggle-row svelte-1yd56n0"><!></div>');
const Zt = {
  hash: "svelte-1yd56n0",
  code: `.post-preview-toggle-row.svelte-1yd56n0 {display:flex;.ehagaki-app-root & button.post-preview-toggle-button,
        .ehagaki-app-root & button.post-preview-toggle-button:hover {color:var(--text-muted);font-size:0.875rem;font-weight:normal;min-height:24px;padding:0;background:transparent;}

        @media (hover: hover) and (pointer: fine) {.ehagaki-app-root & button.post-preview-toggle-button:hover {text-decoration:underline;}
        }}`
};
function Gt(l, e) {
  te(e, !0), Pe(l, Zt);
  const t = () => Ue(Be, "$_", a), [a, n] = qe();
  let i = o(e, "expanded", 7), p = o(e, "controls", 7), h = o(e, "onToggle", 7);
  var _ = {
    get expanded() {
      return i();
    },
    set expanded(v) {
      i(v), s();
    },
    get controls() {
      return p();
    },
    set controls(v) {
      p(v), s();
    },
    get onToggle() {
      return h();
    },
    set onToggle(v) {
      h(v), s();
    }
  }, f = Qt(), w = A(f);
  $e(w, {
    type: "button",
    class: "post-preview-action-button post-preview-toggle-button",
    get "aria-expanded"() {
      return i();
    },
    get "aria-controls"() {
      return p();
    },
    get onClick() {
      return h();
    },
    children: (v, y) => {
      Te();
      var C = De();
      pe((d) => ve(C, d), [
        () => i() ? t()("postHistory.collapse") : t()("postHistory.expand")
      ]), b(v, C);
    },
    $$slots: { default: !0 }
  }), H(f), b(l, f);
  var r = re(_);
  return n(), r;
}
ne(Gt, { expanded: {}, controls: {}, onToggle: {} }, [], [], { mode: "open" });
function pr() {
  let l = be(Fe({})), e = be(!1), t = be(null);
  function a(v) {
    return x(l)[v] ?? !1;
  }
  function n(v, y) {
    Q(l, { ...x(l), [v]: y }, !0);
  }
  function i() {
    Object.keys(x(l)).length > 0 && Q(l, {}, !0);
  }
  function p(v) {
    Q(e, v, !0), v || Q(t, null);
  }
  function h(v) {
    i(), Q(t, v, !0), Q(e, !0);
  }
  function _() {
    p(!1);
  }
  function f() {
    Q(t, null);
  }
  function w() {
    Q(e, !1), Q(t, null);
  }
  function r() {
    Q(l, {}, !0), w();
  }
  return {
    get deleteConfirmOpen() {
      return x(e);
    },
    get deleteTargetPost() {
      return x(t);
    },
    isPostMenuOpen: a,
    setPostMenuOpen: n,
    closeAllPostItemMenus: i,
    setDeleteConfirmOpen: p,
    openDeleteConfirm: h,
    cancelDeleteConfirm: _,
    clearDeleteTarget: f,
    resetDeleteConfirmation: w,
    reset: r
  };
}
function vr({ getShow: l, getPosts: e, getContainer: t, maxLines: a = 5 }) {
  let n = be(Fe({})), i = be(Fe({})), p = {}, h = null, _ = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set(), w = !1, r = null;
  function v(g) {
    const S = getComputedStyle(g), F = parseFloat(S.lineHeight);
    if (!F || Number.isNaN(F)) {
      const k = parseFloat(S.fontSize);
      return k && !Number.isNaN(k) ? k * 1.5 : 24;
    }
    return F;
  }
  function y(g, S) {
    return p[S] = g, M(S), {
      destroy() {
        p[S] === g && delete p[S];
      }
    };
  }
  function C(g) {
    const S = Object.keys(x(n)), F = Object.keys(g);
    S.length === F.length && S.every((k) => x(n)[k] === g[k]) || Q(n, g, !0);
  }
  function d() {
    if (!l()) {
      f.clear(), w = !1, C({});
      return;
    }
    const g = e(), S = f, F = w;
    f = /* @__PURE__ */ new Set(), w = !1;
    const k = {};
    for (const P of g) {
      if (P.forceCollapsible)
        continue;
      if (!F && !S.has(P.eventId)) {
        const Z = x(n)[P.eventId];
        Z !== void 0 && (k[P.eventId] = Z);
        continue;
      }
      const D = p[P.eventId];
      if (!D)
        continue;
      const B = v(D) * a, J = D.scrollHeight > 0;
      k[P.eventId] = J ? D.scrollHeight > B + 0.5 : P.content.split(`
`).length > a;
    }
    C(k);
  }
  function m() {
    return r || (r = Ne().then(() => {
      r = null, d();
    }), r);
  }
  function M(g) {
    return g ? f.add(g) : w = !0, m();
  }
  async function c() {
    const g = r;
    g && (await g, await Ne());
  }
  function E() {
    const g = t();
    typeof ResizeObserver > "u" || !g || h || (h = new ResizeObserver(() => {
      M();
    }), h.observe(g));
  }
  function R() {
    h?.disconnect(), h = null;
  }
  function N() {
    C({}), Q(i, {}, !0), p = {}, _.clear(), f.clear(), w = !1, R();
  }
  function W(g) {
    return x(i)[g.eventId] ?? !1;
  }
  function Y(g) {
    Q(
      i,
      {
        ...x(i),
        [g]: !x(i)[g]
      },
      !0
    );
  }
  function u(g) {
    return g.forceCollapsible === !0 || (x(n)[g.eventId] ?? !1);
  }
  return Ee(() => {
    l() || N();
  }), Ee(() => {
    if (!l())
      return;
    const g = e(), S = /* @__PURE__ */ new Map();
    for (const F of g) {
      const k = {
        content: F.content,
        forceCollapsible: F.forceCollapsible
      }, P = _.get(F.eventId);
      (P?.content !== k.content || P.forceCollapsible !== k.forceCollapsible) && f.add(F.eventId), S.set(F.eventId, k);
    }
    _ = S, m();
  }), Ee(() => {
    if (!(!l() || !t()))
      return E(), () => {
        R();
      };
  }), ut(() => {
    R();
  }), {
    previewRef: y,
    flushPendingMeasurements: c,
    isPostExpanded: W,
    remeasure: () => M(),
    togglePostExpanded: Y,
    shouldCollapsePost: u
  };
}
const Xt = [1, 42];
function Yt() {
  return {
    log: () => {
    },
    warn: () => {
    },
    error: () => {
    }
  };
}
function er(l, e) {
  return !e || l.pubkeyHex !== e || typeof l.deletedAt == "number" ? !1 : Xt.includes(l.kind) && typeof l.eventId == "string" && l.eventId.length > 0;
}
function tr(l, e = Math.floor(Date.now() / 1e3)) {
  return {
    kind: 5,
    pubkey: l.pubkeyHex,
    content: "",
    tags: [["e", l.eventId], ["k", String(l.kind)]],
    created_at: e
  };
}
function rr(l, e) {
  return Ie.sanitizeExternalRelayUrls([
    ...l.acceptedRelays ?? [],
    ...l.fetchedRelays ?? [],
    ...l.relayHints ?? [],
    ...l.kind === 42 ? l.channelRelayHints ?? [] : [],
    ...e
  ]);
}
class nr {
  deps;
  constructor(e = {}) {
    this.deps = {
      authStateStore: e.authStateStore ?? ft,
      keyManager: e.keyManager ?? gt,
      window: e.window ?? (typeof window < "u" ? window : {}),
      console: e.console ?? (typeof globalThis.console < "u" ? globalThis.console : Yt()),
      seckeySignerFn: e.seckeySignerFn ?? vt,
      getNip46SignerForSessionFn: e.getNip46SignerForSessionFn ?? ((t) => mt.getSignerForSession(t)),
      getParentClientSignerFn: e.getParentClientSignerFn ?? (() => ht.getSigner()),
      writeRelaysStore: e.writeRelaysStore ?? Je,
      postHistoryDeletionRequestsRepository: e.postHistoryDeletionRequestsRepository ?? pt,
      eventSenderFactory: e.eventSenderFactory,
      now: e.now ?? Date.now
    };
  }
  async requestDeletion(e) {
    const t = this.deps.authStateStore.value, a = t.pubkey || null;
    if (!e.rxNostr)
      return { success: !1, error: "nostr_not_ready" };
    if (!t.isAuthenticated || !a)
      return { success: !1, error: "pubkey_not_found" };
    if (xt() && Ie.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore.value
    ).length === 0)
      return { success: !1, error: "no_write_relays" };
    const n = () => wt(
      this.deps.authStateStore,
      a
    );
    if (!er(e.post, a))
      return { success: !1, error: "deletion_request_not_allowed" };
    let i;
    if (t.type === "nip46")
      try {
        n(), i = await this.deps.getNip46SignerForSessionFn(
          a
        );
        const C = this.deps.authStateStore.value;
        if (!i || !C.isAuthenticated || C.type !== "nip46" || C.pubkey !== a)
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
      n();
    } catch {
      return { success: !1, error: "post_error" };
    }
    const h = tr(
      e.post,
      Math.floor(this.deps.now() / 1e3)
    );
    let _;
    try {
      n();
      const C = yt(h);
      _ = await p.signEvent(C.signerTemplate), n(), _ = bt(
        C.expectedTemplate,
        _,
        a
      ), n();
    } catch {
      return this.deps.console.error("post_deletion_sign_failed", {
        stage: "sign-event",
        reason: "unexpected"
      }), { success: !1, error: "post_error" };
    }
    const f = _t(
      _
    );
    if (!f)
      return { success: !1, error: "post_error" };
    const w = rr(
      e.post,
      this.deps.writeRelaysStore.value
    );
    let r;
    try {
      n(), r = await this.createEventSender(e.rxNostr).sendEvent(
        f.event,
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
    if (!r.success)
      return r;
    const v = f.event.id ?? r.eventId;
    if (!v)
      return { success: !1, error: "post_error" };
    const y = this.deps.now();
    try {
      await this.deps.postHistoryDeletionRequestsRepository.saveLocalDeletion({
        targetEventId: e.post.eventId,
        deletionEvent: f.event,
        attestation: f.attestation,
        deletedAt: y,
        relayUrls: w
      });
    } catch {
      this.deps.console.warn("post_history_local_deletion_save_failed", {
        stage: "post-history",
        reason: "unexpected"
      });
    }
    return {
      ...r,
      eventId: v,
      deletionEventId: v,
      deletionEvent: f.event,
      deletionEventAttestation: f.attestation,
      deletedAt: y
    };
  }
  createEventSender(e) {
    return this.deps.eventSenderFactory ? this.deps.eventSenderFactory(e, this.deps.console) : new Ve(e, this.deps.console);
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
    const a = this.deps.keyManager.getFromStore() || this.deps.keyManager.loadFromStorage(e.pubkey);
    return a ? this.resolveExternalSigner(
      this.deps.seckeySignerFn(a),
      "nostr_sign_event_not_supported"
    ) : { error: "key_not_found" };
  }
  resolveExternalSigner(e, t) {
    return e ? typeof e.signEvent == "function" ? { signEvent: e.signEvent.bind(e) } : { error: "nostr_sign_event_not_supported" } : { error: t };
  }
}
const gr = new nr();
function or() {
  return {
    log: () => {
    },
    warn: () => {
    },
    error: () => {
    }
  };
}
function sr(l) {
  const e = l.rawEvent;
  if (!e || typeof e != "object")
    return null;
  const t = e;
  return typeof t.id != "string" || typeof t.pubkey != "string" || typeof t.created_at != "number" || typeof t.kind != "number" || !Array.isArray(t.tags) || typeof t.content != "string" || typeof t.sig != "string" ? null : t;
}
class ir {
  deps;
  constructor(e = {}) {
    this.deps = {
      writeRelaysStore: e.writeRelaysStore ?? Je,
      console: e.console ?? (typeof globalThis.console < "u" ? globalThis.console : or())
    };
  }
  async broadcast(e) {
    if (!e.rxNostr)
      return { success: !1, error: "nostr_not_ready" };
    const t = e.rxNostr, a = sr(e.post);
    if (!a)
      return { success: !1, error: "invalid_event" };
    const n = Ie.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore.value
    );
    return n.length === 0 ? { success: !1, error: "no_write_relays" } : new Ve(t, this.deps.console).sendEvent(a, {
      targetRelays: n,
      includeDefaultWriteRelays: !1
    });
  }
}
const fr = new ir();
export {
  Ge as D,
  Ot as M,
  Kt as P,
  Qe as a,
  jt as b,
  vr as c,
  Jt as d,
  Me as e,
  Ze as f,
  er as g,
  Gt as h,
  fr as i,
  Wt as j,
  gr as p,
  sr as r,
  pr as u
};
