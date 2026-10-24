import { Ct as e, G as t, R as n, U as r, W as i, et as a, g as o, i as s, lt as c, r as l, wt as u, yt as d } from "./index-client-Bdka-Daw.js";
import { et as f } from "./LoadingPlaceholder-j1_vRYno.js";
import { t as p } from "./sr-only-styles-BjSIU7_G.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/hidden-input.svelte
var m = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"value"
]), h = t("<input/>");
function g(t, g) {
	u(g, !0);
	let _ = l(g, "value", 15), v = s(g, m), y = d(() => f(v, {
		"aria-hidden": "true",
		tabindex: -1,
		style: {
			...p,
			position: "absolute",
			top: "0",
			left: "0"
		}
	}));
	var b = i(), x = c(b), S = (e) => {
		var t = h();
		o(t, () => ({
			...a(y),
			value: _(),
			defaultChecked: a(y).checked
		})), r(e, t);
	}, C = (e) => {
		var t = h(), n = (e) => _(e.currentTarget.value);
		o(t, () => ({
			...a(y),
			value: _(),
			defaultValue: _() ?? "",
			oninput: n
		})), r(e, t);
	};
	n(x, (e) => {
		a(y).type === "checkbox" ? e(S) : e(C, -1);
	}), r(t, b), e();
}
export { g as t };
