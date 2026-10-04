import { H as E, I as a, b3 as r, ca as H, cb as R, cc as S, aX as X, cd as q } from "./App-C8cvgCUG.js";
import { b0 as G, bl as J, b1 as P, b2 as x, b3 as o, b4 as K, b5 as s, bf as M, n as N, b8 as k, ba as b, b6 as Q, b9 as w } from "./entry-B5mD5NTa.js";
var U = b('<div class="info-icon svg-icon svelte-7gepox"></div>'), V = b('<div class="popover-body svelte-7gepox"><div class="popover-children svelte-7gepox"><!></div></div>'), W = b("<!> <!>", 1);
const Y = {
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
function Z(m, t) {
  G(t, !0), E(m, Y);
  let i = a(t, "side", 7, "top"), p = a(t, "sideOffset", 7, 0), d = a(t, "ariaLabel", 7, "情報を表示"), l = a(t, "children", 7);
  const O = J().overlayTarget;
  var L = {
    get side() {
      return i();
    },
    set side(e = "top") {
      i(e), s();
    },
    get sideOffset() {
      return p();
    },
    set sideOffset(e = 0) {
      p(e), s();
    },
    get ariaLabel() {
      return d();
    },
    set ariaLabel(e = "情報を表示") {
      d(e), s();
    },
    get children() {
      return l();
    },
    set children(e) {
      l(e), s();
    }
  }, h = P(), I = x(h);
  return r(I, () => q, (e, z) => {
    z(e, {
      children: (A, ee) => {
        var _ = W(), y = x(_);
        r(y, () => H, (c, v) => {
          v(c, {
            class: "info-trigger",
            get "aria-label"() {
              return d();
            },
            children: (f, T) => {
              var n = U();
              o(f, n);
            },
            $$slots: { default: !0 }
          });
        });
        var F = M(y, 2);
        r(F, () => R, (c, v) => {
          v(c, {
            get to() {
              return O;
            },
            children: (f, T) => {
              var n = P(), j = x(n);
              r(j, () => S, (B, C) => {
                C(B, {
                  get side() {
                    return i();
                  },
                  get sideOffset() {
                    return p();
                  },
                  class: "popover-content",
                  trapFocus: !1,
                  onCloseAutoFocus: (g) => g.preventDefault(),
                  children: (g, te) => {
                    var u = V(), $ = k(u), D = k($);
                    X(D, () => l() ?? N), w($), w(u), o(g, u);
                  },
                  $$slots: { default: !0 }
                });
              }), o(f, n);
            },
            $$slots: { default: !0 }
          });
        }), o(A, _);
      },
      $$slots: { default: !0 }
    });
  }), o(m, h), K(L);
}
Q(Z, { side: {}, sideOffset: {}, ariaLabel: {}, children: {} }, [], [], { mode: "open" });
export {
  Z as I
};
