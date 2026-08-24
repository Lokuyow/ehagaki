import { I as f, K as c, aT as h, dF as g, aS as u, aU as y } from "./App-2yO7FIhW.js";
import { a_ as $, a$ as x, b0 as P, a as s, b1 as i, b2 as S, aP as k, b3 as H, b8 as n, b4 as F } from "./entry-tn6az_XN.js";
import { b as I } from "./input-MkVV3LeH.js";
var K = n("<input/>"), O = n("<input/>");
function T(l, r) {
  $(r, !0);
  let t = f(r, "value", 15), p = y(r, ["$$slots", "$$events", "$$legacy", "$$host", "value"]);
  const o = k(() => h(p, {
    "aria-hidden": "true",
    tabindex: -1,
    style: { ...g, position: "absolute", top: "0", left: "0" }
  }));
  var d = {
    get value() {
      return t();
    },
    set value(e) {
      t(e), H();
    }
  }, v = x(), m = P(v);
  {
    var _ = (e) => {
      var a = K();
      u(a, () => ({ ...s(o), value: t() }), void 0, void 0, void 0, void 0, !0), i(e, a);
    }, b = (e) => {
      var a = O();
      u(a, () => ({ ...s(o) }), void 0, void 0, void 0, void 0, !0), I(a, t), i(e, a);
    };
    c(m, (e) => {
      s(o).type === "checkbox" ? e(_) : e(b, -1);
    });
  }
  return i(l, v), S(d);
}
F(T, { value: {} }, [], [], { mode: "open" });
export {
  T as H
};
