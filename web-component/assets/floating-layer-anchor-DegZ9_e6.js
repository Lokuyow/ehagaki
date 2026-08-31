import { I as r, dV as m, aP as d, aS as p } from "./App-CBRbsegU.js";
import { b0 as v, b1 as b, b2 as g, b3 as E, b4 as _, b5 as a, n as x, b6 as F } from "./entry-wxgtzGEF.js";
function S(c, e) {
  v(e, !0);
  let i = r(e, "id", 7), l = r(e, "children", 7), n = r(e, "virtualEl", 7), o = r(e, "ref", 7), s = r(e, "tooltip", 7, !1);
  m.create(
    {
      id: d(() => i()),
      virtualEl: d(() => n()),
      ref: o()
    },
    s()
  );
  var f = {
    get id() {
      return i();
    },
    set id(t) {
      i(t), a();
    },
    get children() {
      return l();
    },
    set children(t) {
      l(t), a();
    },
    get virtualEl() {
      return n();
    },
    set virtualEl(t) {
      n(t), a();
    },
    get ref() {
      return o();
    },
    set ref(t) {
      o(t), a();
    },
    get tooltip() {
      return s();
    },
    set tooltip(t = !1) {
      s(t), a();
    }
  }, u = b(), h = g(u);
  return p(h, () => l() ?? x), E(c, u), _(f);
}
F(S, { id: {}, children: {}, virtualEl: {}, ref: {}, tooltip: {} }, [], [], { mode: "open" });
export {
  S as F
};
