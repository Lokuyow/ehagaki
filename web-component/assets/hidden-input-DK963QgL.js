import { a8 as _, aa as c, bf as g, e1 as h, be as u, bg as y } from "./App-1qWol-Cs.js";
import { a_ as $, a$ as x, b0 as P, a as s, b1 as i, b2 as k, aP as H, b3 as S, b8 as n, b4 as O } from "./entry-De5pG27L.js";
import { b as j } from "./input-C3JkTJyC.js";
var q = n("<input/>"), w = n("<input/>");
function z(l, r) {
  $(r, !0);
  let t = _(r, "value", 15), p = y(r, ["$$slots", "$$events", "$$legacy", "$$host", "value"]);
  const o = H(() => g(p, {
    "aria-hidden": "true",
    tabindex: -1,
    style: { ...h, position: "absolute", top: "0", left: "0" }
  }));
  var d = {
    get value() {
      return t();
    },
    set value(e) {
      t(e), S();
    }
  }, v = x(), b = P(v);
  {
    var m = (e) => {
      var a = q();
      u(a, () => ({ ...s(o), value: t() }), void 0, void 0, void 0, void 0, !0), i(e, a);
    }, f = (e) => {
      var a = w();
      u(a, () => ({ ...s(o) }), void 0, void 0, void 0, void 0, !0), j(a, t), i(e, a);
    };
    c(b, (e) => {
      s(o).type === "checkbox" ? e(m) : e(f, -1);
    });
  }
  return i(l, v), k(d);
}
O(z, { value: {} }, [], [], { mode: "open" });
export {
  z as H
};
