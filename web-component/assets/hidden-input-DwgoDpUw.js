import { I as _, K as c, aU as h, dv as g, aT as u, aV as y } from "./App-BmKERuNr.js";
import { b0 as x, b1 as $, b2 as P, a as s, b3 as i, b4 as k, aR as H, b5 as S, ba as n, b6 as I } from "./entry-COr0Xz6m.js";
import { b as K } from "./input-jxEk8QB_.js";
var O = n("<input/>"), R = n("<input/>");
function T(l, r) {
  x(r, !0);
  let t = _(r, "value", 15), p = y(r, ["$$slots", "$$events", "$$legacy", "$$host", "value"]);
  const o = H(() => h(p, {
    "aria-hidden": "true",
    tabindex: -1,
    style: { ...g, position: "absolute", top: "0", left: "0" }
  }));
  var d = {
    get value() {
      return t();
    },
    set value(e) {
      t(e), S();
    }
  }, v = $(), m = P(v);
  {
    var b = (e) => {
      var a = O();
      u(a, () => ({ ...s(o), value: t() }), void 0, void 0, void 0, void 0, !0), i(e, a);
    }, f = (e) => {
      var a = R();
      u(a, () => ({ ...s(o) }), void 0, void 0, void 0, void 0, !0), K(a, t), i(e, a);
    };
    c(m, (e) => {
      s(o).type === "checkbox" ? e(b) : e(f, -1);
    });
  }
  return i(l, v), k(d);
}
I(T, { value: {} }, [], [], { mode: "open" });
export {
  T as H
};
