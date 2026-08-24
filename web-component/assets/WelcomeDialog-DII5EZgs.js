import { H as W, I as j, aX as Z, Q as E, a_ as F, N as L, aZ as O, b1 as Q, V as S, $ as V } from "./App-B15rbX3S.js";
import { bi as X, a_ as G, Z as q, b1 as _, a as D, b2 as J, b3 as C, a$ as K, b0 as M, aP as y, bd as b, bg as v, b6 as m, b8 as T, bf as Y, b4 as ee, bh as te, b7 as d } from "./entry-B_zlOICe.js";
import { D as se, a as ae } from "./DialogWrapper-aQdoiq6H.js";
function oe(r) {
  const t = X().assetBase;
  return t ? new URL(r, t).href : `./${r}`;
}
var le = T('<div class="welcome-content svelte-10qljse"><div class="title-section svelte-10qljse"><img alt="ehagaki icon" class="site-icon svelte-10qljse"/> <h2 class="svelte-10qljse"> </h2></div> <p class="svelte-10qljse"> </p> <pre class="features svelte-10qljse"> </pre></div>');
const re = {
  hash: "svelte-10qljse",
  code: ".welcome-content.svelte-10qljse {text-align:center;}.title-section.svelte-10qljse {display:flex;align-items:center;justify-content:center;gap:8px;margin:20px 0 38px 0;}.site-icon.svelte-10qljse {width:38px;height:38px;}h2.svelte-10qljse {color:var(--text-light);margin-bottom:1rem;margin:0;}p.svelte-10qljse {font-size:1.0625rem;margin-bottom:1.5rem;line-height:1.6;}.features.svelte-10qljse {text-align:start;white-space:pre-line;margin-bottom:1rem;padding-inline-start:1rem;border-radius:8px;line-height:1.6;}.welcome-dialog .get-started-btn {width:100%;height:50px;font-size:1.0625rem;}.welcome-dialog .get-started-btn:active {scale:1;}"
};
function ie(r, t) {
  G(t, !0), W(r, re);
  const s = () => S(V, "$_", k), [k, A] = E();
  let a = j(t, "show", 15, !1), u = j(t, "onClose", 7);
  const B = oe("ehagaki_icon.svg");
  function $() {
    a(!1), u()?.();
  }
  Z(() => a(), $, !0);
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
      var h = K(), n = M(h);
      {
        const c = (o, l) => {
          O(o, Q(() => l?.().props, {
            variant: "primary",
            shape: "square",
            className: "get-started-btn",
            children: (p, x) => {
              te();
              var g = Y();
              q((f) => v(g, f), [() => s()("welcomeDialog.get_started")]), _(p, g);
            },
            $$slots: { default: !0 }
          }));
        };
        F(n, () => ae, (o, l) => {
          l(o, { child: c, $$slots: { child: !0 } });
        });
      }
      _(e, h);
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
        var n = le(), c = m(n), o = m(c), l = b(o, 2), w = m(l, !0);
        d(l), d(c);
        var p = b(c, 2), x = m(p, !0);
        d(p);
        var g = b(p, 2), f = m(g, !0);
        d(g), d(n), q(
          (I, N, R) => {
            L(o, "src", B), v(w, I), v(x, N), v(f, R);
          },
          [
            () => s()("welcomeDialog.title"),
            () => s()("welcomeDialog.description"),
            () => s()("welcomeDialog.features")
          ]
        ), _(e, n);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var U = J(P);
  return A(), U;
}
ee(ie, { show: {}, onClose: {} }, [], [], { mode: "open" });
export {
  ie as default
};
