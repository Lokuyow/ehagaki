import { Et as e, G as t, K as n, Tt as r, W as i, _ as a, dt as o, i as s, nt as c, r as l, xt as u, z as d } from "./index-client-XkLzkVYC.js";
import { et as f } from "./LoadingPlaceholder-lit91akO.js";
import { t as p } from "./sr-only-styles-CUOVv6Ud.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/hidden-input.svelte
var m = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"value"
]), h = n("<input/>");
function g(n, g) {
	e(g, !0);
	let _ = l(g, "value", 15), v = s(g, m), y = u(() => f(v, {
		"aria-hidden": "true",
		tabindex: -1,
		style: {
			...p,
			position: "absolute",
			top: "0",
			left: "0"
		}
	}));
	var b = t(), x = o(b), S = (e) => {
		var t = h();
		a(t, () => ({
			...c(y),
			value: _(),
			defaultChecked: c(y).checked
		})), i(e, t);
	}, C = (e) => {
		var t = h(), n = (e) => _(e.currentTarget.value);
		a(t, () => ({
			...c(y),
			value: _(),
			defaultValue: _() ?? "",
			oninput: n
		})), i(e, t);
	};
	d(x, (e) => {
		c(y).type === "checkbox" ? e(S) : e(C, -1);
	}), i(n, b), r();
}
export { g as t };
