import { G as e, Mt as t, N as n, R as r, Tt as i, U as a, W as o, bt as s, g as c, i as l, jt as u, lt as d, q as f, r as p, tt as m, ut as h, wt as g } from "./index-client-57Odq85c.js";
import { et as _, o as v, st as y } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { g as b } from "./useDialogHistory.svelte-BddVYV4P.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/dialog/components/dialog-close.svelte
var x = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"disabled"
]), S = e("<button><!></button>");
function C(e, C) {
	let w = f();
	i(C, !0);
	let T = p(C, "id", 19, () => v(w)), E = p(C, "ref", 15, null), D = p(C, "disabled", 3, !1), O = l(C, x), k = b.create({
		variant: y(() => "close"),
		id: y(() => T()),
		ref: y(() => E(), (e) => E(e)),
		disabled: y(() => !!D())
	}), A = s(() => _(O, k.props));
	var j = o(), M = h(j), N = (e) => {
		var t = o(), r = h(t);
		n(r, () => C.child, () => ({ props: m(A) })), a(e, t);
	}, P = (e) => {
		var r = S();
		c(r, () => ({ ...m(A) }));
		var i = d(r);
		n(i, () => C.children ?? t), u(r), a(e, r);
	};
	r(M, (e) => {
		C.child ? e(N) : e(P, -1);
	}), a(e, j), g();
}
export { C as t };
