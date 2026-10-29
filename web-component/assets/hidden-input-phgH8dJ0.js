import { G as e, R as t, Tt as n, U as r, W as i, bt as a, g as o, i as s, r as c, tt as l, ut as u, wt as d } from "./index-client-57Odq85c.js";
import { et as f } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { t as p } from "./sr-only-styles-6jsaWJLL.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/hidden-input.svelte
var m = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"value"
]), h = e("<input/>");
function g(e, g) {
	n(g, !0);
	let _ = c(g, "value", 15), v = s(g, m), y = a(() => f(v, {
		"aria-hidden": "true",
		tabindex: -1,
		style: {
			...p,
			position: "absolute",
			top: "0",
			left: "0"
		}
	}));
	var b = i(), x = u(b), S = (e) => {
		var t = h();
		o(t, () => ({
			...l(y),
			value: _(),
			defaultChecked: l(y).checked
		})), r(e, t);
	}, C = (e) => {
		var t = h(), n = (e) => _(e.currentTarget.value);
		o(t, () => ({
			...l(y),
			value: _(),
			defaultValue: _() ?? "",
			oninput: n
		})), r(e, t);
	};
	t(x, (e) => {
		l(y).type === "checkbox" ? e(S) : e(C, -1);
	}), r(e, b), d();
}
export { g as t };
