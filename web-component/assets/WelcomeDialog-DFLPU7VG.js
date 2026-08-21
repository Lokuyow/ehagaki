import { a7 as H, a8 as j, bj as I, ac as L, bm as N, ae as O, bl as S, bp as Z, aj as G, ak as J } from "./App-1qWol-Cs.js";
import { bi as K, a_ as M, Z as q, b1 as b, a as D, b2 as Q, b3 as C, a$ as T, b0 as V, aP as y, bd as _, bh as v, b6 as g, b8 as X, bg as Y, b4 as ee, bf as te, b7 as d } from "./entry-De5pG27L.js";
import { D as se, a as ae } from "./DialogWrapper-DhZEVMtT.js";
function oe(r) {
  const t = K().assetBase;
  return t ? new URL(r, t).href : `./${r}`;
}
var le = X('<div class="welcome-content svelte-10qljse"><div class="title-section svelte-10qljse"><img alt="ehagaki icon" class="site-icon svelte-10qljse"/> <h2 class="svelte-10qljse"> </h2></div> <p class="svelte-10qljse"> </p> <pre class="features svelte-10qljse"> </pre></div>');
const re = {
  hash: "svelte-10qljse",
  code: ".welcome-content.svelte-10qljse {text-align:center;}.title-section.svelte-10qljse {display:flex;align-items:center;justify-content:center;gap:8px;margin:20px 0 38px 0;}.site-icon.svelte-10qljse {width:38px;height:38px;}h2.svelte-10qljse {color:var(--text-light);margin-bottom:1rem;margin:0;}p.svelte-10qljse {font-size:1.0625rem;margin-bottom:1.5rem;line-height:1.6;}.features.svelte-10qljse {text-align:start;white-space:pre-line;margin-bottom:1rem;padding-inline-start:1rem;border-radius:8px;line-height:1.6;}.welcome-dialog .get-started-btn {width:100%;height:50px;font-size:1.0625rem;}.welcome-dialog .get-started-btn:active {scale:1;}"
};
function ie(r, t) {
  M(t, !0), H(r, re);
  const s = () => G(J, "$_", k), [k, A] = L();
  let a = j(t, "show", 15, !1), u = j(t, "onClose", 7);
  const B = oe("ehagaki_icon.svg");
  function $() {
    a(!1), u()?.();
  }
  I(() => a(), $, !0);
  var P = {
    get show() {
      return a();
    },
    set show(i = !1) {
      a(i), C();
    },
    get onClose() {
      return u();
    },
    set onClose(i) {
      u(i), C();
    }
  };
  {
    const i = (e) => {
      var h = T(), n = V(h);
      {
        const c = (o, l) => {
          S(o, Z(() => l?.().props, {
            variant: "primary",
            shape: "square",
            className: "get-started-btn",
            children: (p, x) => {
              te();
              var m = Y();
              q((f) => v(m, f), [() => s()("welcomeDialog.get_started")]), b(p, m);
            },
            $$slots: { default: !0 }
          }));
        };
        N(n, () => ae, (o, l) => {
          l(o, { child: c, $$slots: { child: !0 } });
        });
      }
      b(e, h);
    };
    let z = y(() => s()("welcomeDialog.title")), R = y(() => s()("welcomeDialog.description"));
    se(r, {
      onOpenChange: (e) => !e && $(),
      get title() {
        return D(z);
      },
      get description() {
        return D(R);
      },
      contentClass: "welcome-dialog",
      initialFocus: "content",
      get open() {
        return a();
      },
      set open(e) {
        a(e);
      },
      footer: i,
      children: (e, h) => {
        var n = le(), c = g(n), o = g(c), l = _(o, 2), w = g(l, !0);
        d(l), d(c);
        var p = _(c, 2), x = g(p, !0);
        d(p);
        var m = _(p, 2), f = g(m, !0);
        d(m), d(n), q(
          (W, E, F) => {
            O(o, "src", B), v(w, W), v(x, E), v(f, F);
          },
          [
            () => s()("welcomeDialog.title"),
            () => s()("welcomeDialog.description"),
            () => s()("welcomeDialog.features")
          ]
        ), b(e, n);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var U = Q(P);
  return A(), U;
}
ee(ie, { show: {}, onClose: {} }, [], [], { mode: "open" });
export {
  ie as default
};
