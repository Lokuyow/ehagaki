import { A as e, Et as t, G as n, K as r, Mt as i, N as a, Nt as o, P as s, Tt as c, W as l, dt as u, pt as d, r as f, ut as p } from "./index-client-XkLzkVYC.js";
import { v as m } from "./relayConfigUtils-B4Q_AO1M.js";
import "./LoadingPlaceholder-lit91akO.js";
import { l as h } from "./appUtils-BRia-Jm6.js";
import { ht as g, mt as _, pt as v } from "./App-B2GhfviI.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/InfoPopoverButton.svelte
var y = r("<div class=\"info-icon svg-icon svelte-7gepox\"></div>"), b = r("<div class=\"popover-body svelte-7gepox\"><div class=\"popover-children svelte-7gepox\"><!></div></div>"), x = r("<!> <!>", 1), S = {
	hash: "svelte-7gepox",
	code: "button.info-trigger {display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;min-width:44px;min-height:44px;padding:0;box-sizing:border-box;flex-shrink:0;--btn-bg: transparent;border-radius:50%;}.info-icon.svelte-7gepox {display:block;mask-image:var(--ehagaki-icon-696e666f5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;}.popover-content {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:8px;box-shadow:0 6px 20px rgba(0, 0, 0, 0.18);padding:10px 12px;max-width:320px;z-index:100001;outline:none;}.popover-content[data-state=\"open\"] {\n        animation: svelte-7gepox-popover-in 150ms ease-out;}.popover-content[data-state=\"closed\"] {\n        animation: svelte-7gepox-popover-out 100ms ease-in;}\n\n    @keyframes svelte-7gepox-popover-in {\n        from {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n        to {\n            opacity: 1;\n            translate: 0 0;\n        }\n    }\n\n    @keyframes svelte-7gepox-popover-out {\n        from {\n            opacity: 1;\n            translate: 0 0;\n        }\n        to {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n    }\n\n    @media (prefers-reduced-motion: reduce) {.popover-content[data-state=\"open\"],\n        .popover-content[data-state=\"closed\"] {\n            animation: none;}\n    }.popover-body.svelte-7gepox {display:inline-flex;align-items:center;gap:4px;width:100%;}.popover-children.svelte-7gepox {padding:0 2px;line-height:1.4;}"
};
function C(r, C) {
	t(C, !0), e(r, S);
	let w = f(C, "side", 3, "top"), T = f(C, "sideOffset", 3, 0), E = f(C, "ariaLabel", 3, "情報を表示"), D = m().overlayTarget;
	var O = n(), k = u(O);
	a(k, () => v, (e, t) => {
		t(e, {
			children: (e, t) => {
				var r = x(), c = u(r);
				a(c, () => _, (e, t) => {
					t(e, {
						class: "info-trigger",
						get "aria-label"() {
							return E();
						},
						children: (e, t) => {
							var n = y();
							l(e, n);
						},
						$$slots: { default: !0 }
					});
				});
				var f = d(c, 2);
				a(f, () => h, (e, t) => {
					t(e, {
						get to() {
							return D;
						},
						children: (e, t) => {
							var r = n(), c = u(r);
							a(c, () => g, (e, t) => {
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
										var n = b(), r = p(n), a = p(r);
										s(a, () => C.children ?? o), i(r), i(n), l(e, n);
									},
									$$slots: { default: !0 }
								});
							}), l(e, r);
						},
						$$slots: { default: !0 }
					});
				}), l(e, r);
			},
			$$slots: { default: !0 }
		});
	}), l(r, O), c();
}
export { C as t };
