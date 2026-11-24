import { Dt as e, Et as t, F as n, G as r, K as i, Nt as a, P as o, Pt as s, dt as c, ft as l, j as u, mt as d, q as f, r as p } from "./index-client-DEFG3Gqk.js";
import { n as m } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import "./LoadingPlaceholder-YrD8D_td.js";
import { r as h } from "./Button-Cqrg0_jX.js";
import { dt as g, ft as _, ut as v } from "./App-CW2Ynbk9.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/InfoPopoverButton.svelte
var y = f("<div class=\"info-icon svg-icon svelte-7gepox\"></div>"), b = f("<div class=\"popover-body svelte-7gepox\"><div class=\"popover-children svelte-7gepox\"><!></div></div>"), x = f("<!> <!>", 1), S = {
	hash: "svelte-7gepox",
	code: "button.info-trigger {display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;min-width:44px;min-height:44px;padding:0;box-sizing:border-box;flex-shrink:0;--btn-bg: transparent;border-radius:50%;}.info-icon.svelte-7gepox {display:block;mask-image:var(--ehagaki-icon-696e666f5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;}.popover-content {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:8px;box-shadow:0 6px 20px rgba(0, 0, 0, 0.18);padding:10px 12px;max-width:320px;z-index:100001;outline:none;}.popover-content[data-state=\"open\"] {\n        animation: svelte-7gepox-popover-in 150ms ease-out;}.popover-content[data-state=\"closed\"] {\n        animation: svelte-7gepox-popover-out 100ms ease-in;}\n\n    @keyframes svelte-7gepox-popover-in {\n        from {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n        to {\n            opacity: 1;\n            translate: 0 0;\n        }\n    }\n\n    @keyframes svelte-7gepox-popover-out {\n        from {\n            opacity: 1;\n            translate: 0 0;\n        }\n        to {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n    }\n\n    @media (prefers-reduced-motion: reduce) {.popover-content[data-state=\"open\"],\n        .popover-content[data-state=\"closed\"] {\n            animation: none;}\n    }.popover-body.svelte-7gepox {display:inline-flex;align-items:center;gap:4px;width:100%;}.popover-children.svelte-7gepox {padding:0 2px;line-height:1.4;}"
};
function C(f, C) {
	e(C, !0), u(f, S);
	let w = p(C, "side", 3, "top"), T = p(C, "sideOffset", 3, 0), E = p(C, "ariaLabel", 3, "情報を表示"), D = m().overlayTarget;
	var O = i(), k = l(O);
	o(k, () => v, (e, t) => {
		t(e, {
			children: (e, t) => {
				var u = x(), f = l(u);
				o(f, () => g, (e, t) => {
					t(e, {
						class: "info-trigger",
						get "aria-label"() {
							return E();
						},
						children: (e, t) => {
							var n = y();
							r(e, n);
						},
						$$slots: { default: !0 }
					});
				});
				var p = d(f, 2);
				o(p, () => h, (e, t) => {
					t(e, {
						get to() {
							return D;
						},
						children: (e, t) => {
							var u = i(), d = l(u);
							o(d, () => _, (e, t) => {
								t(e, {
									get side() {
										return w();
									},
									get sideOffset() {
										return T();
									},
									class: "popover-content",
									trapFocus: !1,
									onCloseAutoFocus: (e) => e.preventDefault(),
									children: (e, t) => {
										var i = b(), o = c(i), l = c(o);
										n(l, () => C.children ?? s), a(o), a(i), r(e, i);
									},
									$$slots: { default: !0 }
								});
							}), r(e, u);
						},
						$$slots: { default: !0 }
					});
				}), r(e, u);
			},
			$$slots: { default: !0 }
		});
	}), r(f, O), t();
}
export { C as t };
