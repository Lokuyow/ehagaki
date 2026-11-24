import { B as e, Dt as t, Et as n, F as r, G as i, K as a, Nt as o, Pt as s, St as c, Y as l, dt as u, ft as d, i as f, q as p, r as m, rt as h, v as g } from "./index-client-DEFG3Gqk.js";
import { G as _, R as v, r as y } from "./LoadingPlaceholder-YrD8D_td.js";
import { y as b } from "./useDialogHistory.svelte-pVteCIez.js";
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
]), S = p("<button><!></button>");
function C(p, C) {
	let w = l();
	t(C, !0);
	let T = m(C, "id", 19, () => y(w)), E = m(C, "ref", 15, null), D = m(C, "disabled", 3, !1), O = f(C, x), k = b.create({
		variant: _(() => "close"),
		id: _(() => T()),
		ref: _(() => E(), (e) => E(e)),
		disabled: _(() => !!D())
	}), A = c(() => v(O, k.props));
	var j = a(), M = d(j), N = (e) => {
		var t = a(), n = d(t);
		r(n, () => C.child, () => ({ props: h(A) })), i(e, t);
	}, P = (e) => {
		var t = S();
		g(t, () => ({ ...h(A) }));
		var n = u(t);
		r(n, () => C.children ?? s), o(t), i(e, t);
	};
	e(M, (e) => {
		C.child ? e(N) : e(P, -1);
	}), i(p, j), n();
}
export { C as t };
