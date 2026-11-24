import { B as e, Dt as t, Et as n, G as r, K as i, St as a, ft as o, i as s, q as c, r as l, rt as u, v as d } from "./index-client-DEFG3Gqk.js";
import { R as f } from "./LoadingPlaceholder-YrD8D_td.js";
import { t as p } from "./sr-only-styles-C-S1Yy1T.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/hidden-input.svelte
var m = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"value"
]), h = c("<input/>");
function g(c, g) {
	t(g, !0);
	let _ = l(g, "value", 15), v = s(g, m), y = a(() => f(v, {
		"aria-hidden": "true",
		tabindex: -1,
		style: {
			...p,
			position: "absolute",
			top: "0",
			left: "0"
		}
	}));
	var b = i(), x = o(b), S = (e) => {
		var t = h();
		d(t, () => ({
			...u(y),
			value: _(),
			defaultChecked: u(y).checked
		})), r(e, t);
	}, C = (e) => {
		var t = h(), n = (e) => _(e.currentTarget.value);
		d(t, () => ({
			...u(y),
			value: _(),
			defaultValue: _() ?? "",
			oninput: n
		})), r(e, t);
	};
	e(x, (e) => {
		u(y).type === "checkbox" ? e(S) : e(C, -1);
	}), r(c, b), n();
}
export { g as t };
