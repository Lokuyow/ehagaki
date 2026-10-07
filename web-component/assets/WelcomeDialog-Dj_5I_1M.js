import { M as F, N as j, bM as H, aQ as I, W as K, aS as O, U as Q, aK as V, aV as Z, _ as E, $ as G } from "./App-B2pbRRzr.js";
import { b0 as J, Z as q, b3 as f, a as D, b4 as L, b5 as C, b1 as R, b2 as T, aS as y, bf as b, bi as m, b8 as p, ba as X, bh as Y, b6 as ee, bj as te, b9 as g } from "./entry-DeBeimY8.js";
import { D as se, a as ae } from "./DialogWrapper-QD3vI8wE.js";
var oe = X('<div class="welcome-content svelte-10qljse"><div class="title-section svelte-10qljse"><img alt="ehagaki icon" class="site-icon svelte-10qljse"/> <h2 class="svelte-10qljse"> </h2></div> <p class="svelte-10qljse"> </p> <pre class="features svelte-10qljse"> </pre></div>');
const le = {
  hash: "svelte-10qljse",
  code: ".welcome-content.svelte-10qljse {text-align:center;}.title-section.svelte-10qljse {display:flex;align-items:center;justify-content:center;gap:8px;margin:20px 0 38px 0;}.site-icon.svelte-10qljse {width:38px;height:38px;}h2.svelte-10qljse {color:var(--text-light);margin-bottom:1rem;margin:0;}p.svelte-10qljse {font-size:1.0625rem;margin-bottom:1.5rem;line-height:1.6;}.features.svelte-10qljse {text-align:start;white-space:pre-line;margin-bottom:1rem;padding-inline-start:1rem;border-radius:8px;line-height:1.6;}.welcome-dialog .get-started-btn {width:100%;height:50px;font-size:1.0625rem;}.welcome-dialog .get-started-btn:active {scale:1;}"
};
function re(_, d) {
  J(d, !0), F(_, le);
  const t = () => E(G, "$_", k), [k, S] = K();
  let s = j(d, "show", 15, !1), v = j(d, "onClose", 7);
  const U = H("ehagaki_icon.svg");
  function $() {
    s(!1), v()?.();
  }
  I(() => s(), $, !0);
  var W = {
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
      var h = R(), r = T(h);
      {
        const i = (a, o) => {
          V(a, Z(() => o?.().props, {
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
        O(r, () => ae, (a, o) => {
          o(a, { child: i, $$slots: { child: !0 } });
        });
      }
      f(e, h);
    };
    let A = y(() => t()("welcomeDialog.title")), M = y(() => t()("welcomeDialog.description"));
    se(_, {
      onOpenChange: (e) => !e && $(),
      get title() {
        return D(A);
      },
      get description() {
        return D(M);
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
          (N, P, B) => {
            Q(a, "src", U), m(x, N), m(w, P), m(u, B);
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
  var z = L(W);
  return S(), z;
}
ee(re, { show: {}, onClose: {} }, [], [], { mode: "open" });
export {
  re as default
};
