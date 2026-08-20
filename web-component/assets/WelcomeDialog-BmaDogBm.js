import { a7 as N, a8 as j, cc as O, bf as S, ac as Z, bi as E, ae as G, bh as J, bl as K, aj as L, ak as M } from "./App-Cyoa6Q_G.js";
import { a_ as Q, Z as q, b1 as f, a as D, b2 as R, b3 as C, a$ as T, b0 as V, aP as y, bd as b, bh as m, b6 as p, b8 as X, bg as Y, b4 as ee, bf as te, b7 as g } from "./entry-kEWtxODC.js";
import { D as se, a as ae } from "./DialogWrapper-C1cagKHZ.js";
var oe = X('<div class="welcome-content svelte-10qljse"><div class="title-section svelte-10qljse"><img alt="ehagaki icon" class="site-icon svelte-10qljse"/> <h2 class="svelte-10qljse"> </h2></div> <p class="svelte-10qljse"> </p> <pre class="features svelte-10qljse"> </pre></div>');
const le = {
  hash: "svelte-10qljse",
  code: ".welcome-content.svelte-10qljse {text-align:center;}.title-section.svelte-10qljse {display:flex;align-items:center;justify-content:center;gap:8px;margin:20px 0 38px 0;}.site-icon.svelte-10qljse {width:38px;height:38px;}h2.svelte-10qljse {color:var(--text-light);margin-bottom:1rem;margin:0;}p.svelte-10qljse {font-size:1.0625rem;margin-bottom:1.5rem;line-height:1.6;}.features.svelte-10qljse {text-align:start;white-space:pre-line;margin-bottom:1rem;padding-inline-start:1rem;border-radius:8px;line-height:1.6;}.welcome-dialog .get-started-btn {width:100%;height:50px;font-size:1.0625rem;}.welcome-dialog .get-started-btn:active {scale:1;}"
};
function re(_, d) {
  Q(d, !0), N(_, le);
  const t = () => L(M, "$_", k), [k, P] = Z();
  let s = j(d, "show", 15, !1), v = j(d, "onClose", 7);
  const z = O("ehagaki_icon.svg");
  function $() {
    s(!1), v()?.();
  }
  S(() => s(), $, !0);
  var A = {
    get show() {
      return s();
    },
    set show(l = !1) {
      s(l), C();
    },
    get onClose() {
      return v();
    },
    set onClose(l) {
      v(l), C();
    }
  };
  {
    const l = (e) => {
      var h = T(), r = V(h);
      {
        const i = (a, o) => {
          J(a, K(() => o?.().props, {
            variant: "primary",
            shape: "square",
            className: "get-started-btn",
            children: (n, w) => {
              te();
              var c = Y();
              q((u) => m(c, u), [() => t()("welcomeDialog.get_started")]), f(n, c);
            },
            $$slots: { default: !0 }
          }));
        };
        E(r, () => ae, (a, o) => {
          o(a, { child: i, $$slots: { child: !0 } });
        });
      }
      f(e, h);
    };
    let W = y(() => t()("welcomeDialog.title")), B = y(() => t()("welcomeDialog.description"));
    se(_, {
      onOpenChange: (e) => !e && $(),
      get title() {
        return D(W);
      },
      get description() {
        return D(B);
      },
      contentClass: "welcome-dialog",
      initialFocus: "content",
      get open() {
        return s();
      },
      set open(e) {
        s(e);
      },
      footer: l,
      children: (e, h) => {
        var r = oe(), i = p(r), a = p(i), o = b(a, 2), x = p(o, !0);
        g(o), g(i);
        var n = b(i, 2), w = p(n, !0);
        g(n);
        var c = b(n, 2), u = p(c, !0);
        g(c), g(r), q(
          (F, H, I) => {
            G(a, "src", z), m(x, F), m(w, H), m(u, I);
          },
          [
            () => t()("welcomeDialog.title"),
            () => t()("welcomeDialog.description"),
            () => t()("welcomeDialog.features")
          ]
        ), f(e, r);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var U = R(A);
  return P(), U;
}
ee(re, { show: {}, onClose: {} }, [], [], { mode: "open" });
export {
  re as default
};
