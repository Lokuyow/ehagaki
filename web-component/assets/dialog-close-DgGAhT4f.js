import { At as e, Ct as t, G as n, K as r, N as i, R as a, U as o, W as s, ct as c, et as l, g as u, i as d, jt as f, lt as p, r as m, wt as h, yt as g } from "./index-client-Bdka-Daw.js";
import { et as _, o as v, st as y } from "./LoadingPlaceholder-j1_vRYno.js";
import { g as b } from "./useDialogHistory.svelte-C49eZejL.js";
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
]), S = n("<button><!></button>");
function C(n, C) {
	let w = r();
	h(C, !0);
	let T = m(C, "id", 19, () => v(w)), E = m(C, "ref", 15, null), D = m(C, "disabled", 3, !1), O = d(C, x), k = b.create({
		variant: y(() => "close"),
		id: y(() => T()),
		ref: y(() => E(), (e) => E(e)),
		disabled: y(() => !!D())
	}), A = g(() => _(O, k.props));
	var j = s(), M = p(j), N = (e) => {
		var t = s(), n = p(t);
		i(n, () => C.child, () => ({ props: l(A) })), o(e, t);
	}, P = (t) => {
		var n = S();
		u(n, () => ({ ...l(A) }));
		var r = c(n);
		i(r, () => C.children ?? f), e(n), o(t, n);
	};
	a(M, (e) => {
		C.child ? e(N) : e(P, -1);
	}), o(n, j), t();
}
export { C as t };
