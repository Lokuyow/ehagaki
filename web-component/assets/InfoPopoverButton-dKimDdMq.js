import { G as e, M as t, Mt as n, N as r, Tt as i, U as a, W as o, ft as s, jt as c, k as l, lt as u, r as d, ut as f, wt as p } from "./index-client-57Odq85c.js";
import { n as m } from "./appRuntimeEnvironment-BvtUCHcA.js";
import "./LoadingPlaceholder-DK5Hrsgb.js";
import { u as h } from "./appUtils-CwuZyofa.js";
import { ht as g, mt as _, pt as v } from "./App-BWEIk7fu.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/InfoPopoverButton.svelte
var y = e("<div class=\"info-icon svg-icon svelte-7gepox\"></div>"), b = e("<div class=\"popover-body svelte-7gepox\"><div class=\"popover-children svelte-7gepox\"><!></div></div>"), x = e("<!> <!>", 1), S = {
	hash: "svelte-7gepox",
	code: "button.info-trigger {display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;min-width:44px;min-height:44px;padding:0;box-sizing:border-box;flex-shrink:0;--btn-bg: transparent;border-radius:50%;}.info-icon.svelte-7gepox {display:block;mask-image:var(--ehagaki-icon-696e666f5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;}.popover-content {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:8px;box-shadow:0 6px 20px rgba(0, 0, 0, 0.18);padding:10px 12px;max-width:320px;z-index:100001;outline:none;}.popover-content[data-state=\"open\"] {\n        animation: svelte-7gepox-popover-in 150ms ease-out;}.popover-content[data-state=\"closed\"] {\n        animation: svelte-7gepox-popover-out 100ms ease-in;}\n\n    @keyframes svelte-7gepox-popover-in {\n        from {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n        to {\n            opacity: 1;\n            translate: 0 0;\n        }\n    }\n\n    @keyframes svelte-7gepox-popover-out {\n        from {\n            opacity: 1;\n            translate: 0 0;\n        }\n        to {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n    }\n\n    @media (prefers-reduced-motion: reduce) {.popover-content[data-state=\"open\"],\n        .popover-content[data-state=\"closed\"] {\n            animation: none;}\n    }.popover-body.svelte-7gepox {display:inline-flex;align-items:center;gap:4px;width:100%;}.popover-children.svelte-7gepox {padding:0 2px;line-height:1.4;}"
};
function C(e, C) {
	i(C, !0), l(e, S);
	let w = d(C, "side", 3, "top"), T = d(C, "sideOffset", 3, 0), E = d(C, "ariaLabel", 3, "情報を表示"), D = m().overlayTarget;
	var O = o(), k = f(O);
	t(k, () => v, (e, i) => {
		i(e, {
			children: (e, i) => {
				var l = x(), d = f(l);
				t(d, () => _, (e, t) => {
					t(e, {
						class: "info-trigger",
						get "aria-label"() {
							return E();
						},
						children: (e, t) => {
							var n = y();
							a(e, n);
						},
						$$slots: { default: !0 }
					});
				});
				var p = s(d, 2);
				t(p, () => h, (e, i) => {
					i(e, {
						get to() {
							return D;
						},
						children: (e, i) => {
							var s = o(), l = f(s);
							t(l, () => g, (e, t) => {
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
										var i = b(), o = u(i), s = u(o);
										r(s, () => C.children ?? n), c(o), c(i), a(e, i);
									},
									$$slots: { default: !0 }
								});
							}), a(e, s);
						},
						$$slots: { default: !0 }
					});
				}), a(e, l);
			},
			$$slots: { default: !0 }
		});
	}), a(e, O), p();
}
export { C as t };
