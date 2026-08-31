import { I as a, aP as L, bZ as G, aS as S, aQ as v, H as J, a_ as f, b_ as K } from "./App-CGgJsLME.js";
import { b0 as z, b1 as O, b2 as h, n as A, b3 as l, b4 as R, b5 as r, b6 as T, bl as M, bf as N, b8 as F, ba as P, b9 as I } from "./entry-B5mUKSYb.js";
import { P as U, a as V, b as X } from "./popover-trigger-3XRRkvMa.js";
function j(d, n) {
  z(n, !0);
  let o = a(n, "open", 15, !1), s = a(n, "onOpenChange", 7, v), i = a(n, "onOpenChangeComplete", 7, v), p = a(n, "children", 7);
  U.create({
    open: L(() => o(), (e) => {
      o(e), s()(e);
    }),
    onOpenChangeComplete: L(() => i())
  });
  var u = {
    get open() {
      return o();
    },
    set open(e = !1) {
      o(e), r();
    },
    get onOpenChange() {
      return s();
    },
    set onOpenChange(e = v) {
      s(e), r();
    },
    get onOpenChangeComplete() {
      return i();
    },
    set onOpenChangeComplete(e = v) {
      i(e), r();
    },
    get children() {
      return p();
    },
    set children(e) {
      p(e), r();
    }
  };
  return G(d, {
    children: (e, m) => {
      var c = O(), t = h(c);
      S(t, () => p() ?? A), l(e, c);
    },
    $$slots: { default: !0 }
  }), R(u);
}
T(
  j,
  {
    open: {},
    onOpenChange: {},
    onOpenChangeComplete: {},
    children: {}
  },
  [],
  [],
  { mode: "open" }
);
var Y = P('<div class="info-icon svg-icon svelte-7gepox"></div>'), ee = P('<div class="popover-body svelte-7gepox"><div class="popover-children svelte-7gepox"><!></div></div>'), ne = P("<!> <!>", 1);
const te = {
  hash: "svelte-7gepox",
  code: `button.info-trigger {display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;min-width:44px;min-height:44px;padding:0;box-sizing:border-box;flex-shrink:0;--btn-bg: transparent;border-radius:50%;}.info-icon.svelte-7gepox {display:block;mask-image:var(--ehagaki-icon-696e666f5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;}.popover-content {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:8px;box-shadow:0 6px 20px rgba(0, 0, 0, 0.18);padding:10px 12px;max-width:320px;z-index:100001;outline:none;}.popover-content[data-state="open"] {
        animation: svelte-7gepox-popover-in 150ms ease-out;}.popover-content[data-state="closed"] {
        animation: svelte-7gepox-popover-out 100ms ease-in;}

    @keyframes svelte-7gepox-popover-in {
        from {
            opacity: 0;
            translate: 0 -4px;
        }
        to {
            opacity: 1;
            translate: 0 0;
        }
    }

    @keyframes svelte-7gepox-popover-out {
        from {
            opacity: 1;
            translate: 0 0;
        }
        to {
            opacity: 0;
            translate: 0 -4px;
        }
    }

    @media (prefers-reduced-motion: reduce) {.popover-content[data-state="open"],
        .popover-content[data-state="closed"] {
            animation: none;}
    }.popover-body.svelte-7gepox {display:inline-flex;align-items:center;gap:4px;width:100%;}.popover-children.svelte-7gepox {padding:0 2px;line-height:1.4;}`
};
function oe(d, n) {
  z(n, !0), J(d, te);
  let o = a(n, "side", 7, "top"), s = a(n, "sideOffset", 7, 0), i = a(n, "ariaLabel", 7, "情報を表示"), p = a(n, "children", 7);
  const u = M().overlayTarget;
  var e = {
    get side() {
      return o();
    },
    set side(t = "top") {
      o(t), r();
    },
    get sideOffset() {
      return s();
    },
    set sideOffset(t = 0) {
      s(t), r();
    },
    get ariaLabel() {
      return i();
    },
    set ariaLabel(t = "情報を表示") {
      i(t), r();
    },
    get children() {
      return p();
    },
    set children(t) {
      p(t), r();
    }
  }, m = O(), c = h(m);
  return f(c, () => j, (t, B) => {
    B(t, {
      children: (D, ae) => {
        var $ = ne(), k = h($);
        f(k, () => V, (x, b) => {
          b(x, {
            class: "info-trigger",
            get "aria-label"() {
              return i();
            },
            children: (_, H) => {
              var g = Y();
              l(_, g);
            },
            $$slots: { default: !0 }
          });
        });
        var E = N(k, 2);
        f(E, () => K, (x, b) => {
          b(x, {
            get to() {
              return u;
            },
            children: (_, H) => {
              var g = O(), Q = h(g);
              f(Q, () => X, (W, Z) => {
                Z(W, {
                  get side() {
                    return o();
                  },
                  get sideOffset() {
                    return s();
                  },
                  class: "popover-content",
                  trapFocus: !1,
                  onCloseAutoFocus: (C) => C.preventDefault(),
                  children: (C, re) => {
                    var y = ee(), w = F(y), q = F(w);
                    S(q, () => p() ?? A), I(w), I(y), l(C, y);
                  },
                  $$slots: { default: !0 }
                });
              }), l(_, g);
            },
            $$slots: { default: !0 }
          });
        }), l(D, $);
      },
      $$slots: { default: !0 }
    });
  }), l(d, m), R(e);
}
T(oe, { side: {}, sideOffset: {}, ariaLabel: {}, children: {} }, [], [], { mode: "open" });
export {
  oe as I
};
