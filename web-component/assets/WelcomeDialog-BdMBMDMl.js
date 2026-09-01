import { H as W, I as j, aY as E, Q as F, a_ as L, N as O, aA as Q, b1 as S, V, $ as Y } from "./App-0-rBUlwf.js";
import { bl as Z, b0 as G, Z as q, b3 as b, a as D, b4 as J, b5 as C, b1 as K, b2 as M, aR as y, bf as _, bi as v, b8 as g, ba as T, bh as X, b6 as ee, bj as te, b9 as d } from "./entry-vGGuKCM6.js";
import { D as se, a as ae } from "./DialogWrapper-DECiyYAZ.js";
function oe(r) {
  const t = Z().assetBase;
  return t ? new URL(r, t).href : `./${r}`;
}
var le = T('<div class="welcome-content svelte-10qljse"><div class="title-section svelte-10qljse"><img alt="ehagaki icon" class="site-icon svelte-10qljse"/> <h2 class="svelte-10qljse"> </h2></div> <p class="svelte-10qljse"> </p> <pre class="features svelte-10qljse"> </pre></div>');
const re = {
  hash: "svelte-10qljse",
  code: ".welcome-content.svelte-10qljse {text-align:center;}.title-section.svelte-10qljse {display:flex;align-items:center;justify-content:center;gap:8px;margin:20px 0 38px 0;}.site-icon.svelte-10qljse {width:38px;height:38px;}h2.svelte-10qljse {color:var(--text-light);margin-bottom:1rem;margin:0;}p.svelte-10qljse {font-size:1.0625rem;margin-bottom:1.5rem;line-height:1.6;}.features.svelte-10qljse {text-align:start;white-space:pre-line;margin-bottom:1rem;padding-inline-start:1rem;border-radius:8px;line-height:1.6;}.welcome-dialog .get-started-btn {width:100%;height:50px;font-size:1.0625rem;}.welcome-dialog .get-started-btn:active {scale:1;}"
};
function ie(r, t) {
  G(t, !0), W(r, re);
  const s = () => V(Y, "$_", A), [A, k] = F();
  let a = j(t, "show", 15, !1), u = j(t, "onClose", 7);
  const B = oe("ehagaki_icon.svg");
  function $() {
    a(!1), u()?.();
  }
  E(() => a(), $, !0);
  var R = {
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
      var h = K(), n = M(h);
      {
        const c = (o, l) => {
          Q(o, S(() => l?.().props, {
            variant: "primary",
            shape: "square",
            className: "get-started-btn",
            children: (p, x) => {
              te();
              var m = X();
              q((f) => v(m, f), [() => s()("welcomeDialog.get_started")]), b(p, m);
            },
            $$slots: { default: !0 }
          }));
        };
        L(n, () => ae, (o, l) => {
          l(o, { child: c, $$slots: { child: !0 } });
        });
      }
      b(e, h);
    };
    let z = y(() => s()("welcomeDialog.title")), H = y(() => s()("welcomeDialog.description"));
    se(r, {
      onOpenChange: (e) => !e && $(),
      get title() {
        return D(z);
      },
      get description() {
        return D(H);
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
          (I, N, P) => {
            O(o, "src", B), v(w, I), v(x, N), v(f, P);
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
  var U = J(R);
  return k(), U;
}
ee(ie, { show: {}, onClose: {} }, [], [], { mode: "open" });
export {
  ie as default
};
