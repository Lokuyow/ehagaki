import { Et as e, G as t, J as n, K as r, Mt as i, Nt as a, P as o, Tt as s, W as c, _ as l, dt as u, i as d, nt as f, r as p, ut as m, xt as h, z as g } from "./index-client-XkLzkVYC.js";
import { et as _, o as v, st as y } from "./LoadingPlaceholder-lit91akO.js";
import { y as b } from "./useDialogHistory.svelte-BgJftJRE.js";
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
]), S = r("<button><!></button>");
function C(r, C) {
	let w = n();
	e(C, !0);
	let T = p(C, "id", 19, () => v(w)), E = p(C, "ref", 15, null), D = p(C, "disabled", 3, !1), O = d(C, x), k = b.create({
		variant: y(() => "close"),
		id: y(() => T()),
		ref: y(() => E(), (e) => E(e)),
		disabled: y(() => !!D())
	}), A = h(() => _(O, k.props));
	var j = t(), M = u(j), N = (e) => {
		var n = t(), r = u(n);
		o(r, () => C.child, () => ({ props: f(A) })), c(e, n);
	}, P = (e) => {
		var t = S();
		l(t, () => ({ ...f(A) }));
		var n = m(t);
		o(n, () => C.children ?? a), i(t), c(e, t);
	};
	g(M, (e) => {
		C.child ? e(N) : e(P, -1);
	}), c(r, j), s();
}
export { C as t };
