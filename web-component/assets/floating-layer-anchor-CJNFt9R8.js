import { a8 as r, em as m, b6 as d, b9 as p } from "./App-B-vAJu8d.js";
import { a_ as v, a$ as b, b0 as g, b1 as E, b2 as _, b3 as a, n as x, b4 as F } from "./entry-y-09yyZ0.js";
function y(c, e) {
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
F(y, { id: {}, children: {}, virtualEl: {}, ref: {}, tooltip: {} }, [], [], { mode: "open" });
export {
  y as F
};
