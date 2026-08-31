import { I as _, K as c, aU as h, dC as g, aT as u, aV as y } from "./App-CGgJsLME.js";
import { b0 as x, b1 as $, b2 as P, a as s, b3 as i, b4 as k, aR as H, b5 as S, ba as n, b6 as C } from "./entry-B5mUKSYb.js";
import { b as I } from "./input-CyipTdDB.js";
var K = n("<input/>"), O = n("<input/>");
function R(l, r) {
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
      var a = K();
      u(a, () => ({ ...s(o), value: t() }), void 0, void 0, void 0, void 0, !0), i(e, a);
    }, f = (e) => {
      var a = O();
      u(a, () => ({ ...s(o) }), void 0, void 0, void 0, void 0, !0), I(a, t), i(e, a);
    };
    c(m, (e) => {
      s(o).type === "checkbox" ? e(b) : e(f, -1);
    });
  }
  return i(l, v), k(d);
}
C(R, { value: {} }, [], [], { mode: "open" });
export {
  R as H
};
