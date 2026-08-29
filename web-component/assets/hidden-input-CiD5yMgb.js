import { I as _, K as c, aT as h, dC as g, aS as u, aU as y } from "./App-GbqYleiC.js";
import { b0 as x, b1 as $, b2 as P, a as s, b3 as i, b4 as S, aR as k, b5 as H, ba as n, b6 as C } from "./entry-BQ9RlsLv.js";
import { b as I } from "./input-ChTBsLhu.js";
var K = n("<input/>"), O = n("<input/>");
function R(l, r) {
  x(r, !0);
  let t = _(r, "value", 15), p = y(r, ["$$slots", "$$events", "$$legacy", "$$host", "value"]);
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
  return i(l, v), S(d);
}
C(R, { value: {} }, [], [], { mode: "open" });
export {
  R as H
};
