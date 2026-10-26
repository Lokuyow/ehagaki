import { At as e, Ct as t, G as n, M as r, N as i, U as a, W as o, ct as s, dt as c, jt as l, k as u, lt as d, r as f, wt as p } from "./index-client-Bdka-Daw.js";
import { n as m } from "./appRuntimeEnvironment-BvtUCHcA.js";
import "./LoadingPlaceholder-j1_vRYno.js";
import { u as h } from "./appUtils-C7IXsQBk.js";
import { ht as g, mt as _, pt as v } from "./App-CxNETzG6.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/InfoPopoverButton.svelte
var y = n("<div class=\"info-icon svg-icon svelte-7gepox\"></div>"), b = n("<div class=\"popover-body svelte-7gepox\"><div class=\"popover-children svelte-7gepox\"><!></div></div>"), x = n("<!> <!>", 1), S = {
	hash: "svelte-7gepox",
	code: "button.info-trigger {display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;min-width:44px;min-height:44px;padding:0;box-sizing:border-box;flex-shrink:0;--btn-bg: transparent;border-radius:50%;}.info-icon.svelte-7gepox {display:block;mask-image:var(--ehagaki-icon-696e666f5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;}.popover-content {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:8px;box-shadow:0 6px 20px rgba(0, 0, 0, 0.18);padding:10px 12px;max-width:320px;z-index:100001;outline:none;}.popover-content[data-state=\"open\"] {\n        animation: svelte-7gepox-popover-in 150ms ease-out;}.popover-content[data-state=\"closed\"] {\n        animation: svelte-7gepox-popover-out 100ms ease-in;}\n\n    @keyframes svelte-7gepox-popover-in {\n        from {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n        to {\n            opacity: 1;\n            translate: 0 0;\n        }\n    }\n\n    @keyframes svelte-7gepox-popover-out {\n        from {\n            opacity: 1;\n            translate: 0 0;\n        }\n        to {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n    }\n\n    @media (prefers-reduced-motion: reduce) {.popover-content[data-state=\"open\"],\n        .popover-content[data-state=\"closed\"] {\n            animation: none;}\n    }.popover-body.svelte-7gepox {display:inline-flex;align-items:center;gap:4px;width:100%;}.popover-children.svelte-7gepox {padding:0 2px;line-height:1.4;}"
};
function C(n, C) {
	p(C, !0), u(n, S);
	let w = f(C, "side", 3, "top"), T = f(C, "sideOffset", 3, 0), E = f(C, "ariaLabel", 3, "情報を表示"), D = m().overlayTarget;
	var O = o(), k = d(O);
	r(k, () => v, (t, n) => {
		n(t, {
			children: (t, n) => {
				var u = x(), f = d(u);
				r(f, () => _, (e, t) => {
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
				var p = c(f, 2);
				r(p, () => h, (t, n) => {
					n(t, {
						get to() {
							return D;
						},
						children: (t, n) => {
							var c = o(), u = d(c);
							r(u, () => g, (t, n) => {
								n(t, {
									get side() {
										return w();
									},
									get sideOffset() {
										return T();
									},
									class: "popover-content",
									trapFocus: !1,
									onCloseAutoFocus: (e) => e.preventDefault(),
									children: (t, n) => {
										var r = b(), o = s(r), c = s(o);
										i(c, () => C.children ?? l), e(o), e(r), a(t, r);
									},
									$$slots: { default: !0 }
								});
							}), a(t, c);
						},
						$$slots: { default: !0 }
					});
				}), a(t, u);
			},
			$$slots: { default: !0 }
		});
	}), a(n, O), t();
}
export { C as t };
