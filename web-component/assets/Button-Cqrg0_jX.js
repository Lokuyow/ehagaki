import { B as e, Ct as t, Dt as n, E as r, Et as i, F as a, G as o, H as s, K as c, N as l, Nt as u, Pt as d, St as f, T as p, U as m, V as h, _t as g, b as _, ct as v, dt as y, f as b, ft as x, i as S, it as C, j as w, lt as T, mt as E, pt as D, q as O, r as k, rt as A, t as j, v as M, yt as N, z as P } from "./index-client-DEFG3Gqk.js";
import { n as F } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { F as I, G as L, N as R, i as z } from "./LoadingPlaceholder-YrD8D_td.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/transition/index.js
var B = (e) => e;
function V(e, { delay: t = 0, duration: n = 400, easing: r = B } = {}) {
	let i = +getComputedStyle(e).opacity;
	return {
		delay: t,
		duration: n,
		easing: r,
		css: (e) => `opacity: ${e * i}`
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/portal/portal-consumer.svelte
function H(e, t) {
	var n = c(), r = x(n);
	P(r, () => t.children, (e) => {
		var n = c(), r = x(n);
		a(r, () => t.children ?? d), o(e, n);
	}), o(e, n);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/config/bits-config.js
var U = new I("BitsConfig");
function W() {
	let e = new G(null, {});
	return U.getOr(e).opts;
}
var G = class {
	opts;
	constructor(e, t) {
		let n = K(e, t);
		this.opts = {
			defaultPortalTo: n((e) => e.defaultPortalTo),
			defaultLocale: n((e) => e.defaultLocale)
		};
	}
};
function K(e, t) {
	return (n) => L(() => {
		let r = n(t)?.current;
		if (r !== void 0) return r;
		if (e !== null) return n(e.opts)?.current;
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/config/prop-resolvers.js
function q(e, t) {
	return (n) => {
		let r = W();
		return L(() => {
			let i = n();
			if (i !== void 0) return i;
			let a = e(r).current;
			return a === void 0 ? t : a;
		});
	};
}
var J = q((e) => e.defaultLocale, "en"), Y = q((e) => e.defaultPortalTo, "body");
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/portal/portal.svelte
function X(r, s) {
	n(s, !0);
	let l = Y(() => s.to), u = t(), p = f(g);
	function g() {
		if (!z || s.disabled) return null;
		let e = null;
		return e = typeof l.current == "string" ? document.querySelector(l.current) : l.current, e;
	}
	let _;
	function v() {
		_ &&= (m(_), null);
	}
	R([() => A(p), () => s.disabled], ([e, t]) => {
		if (!e || t) v();
		else return _ = h(H, {
			target: e,
			props: { children: s.children },
			context: u
		}), () => {
			v();
		};
	});
	var y = c(), b = x(y), S = (e) => {
		var t = c(), n = x(t);
		a(n, () => s.children ?? d), o(e, t);
	};
	e(b, (e) => {
		s.disabled && e(S);
	}), o(r, y), i();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/FloatingMessage.svelte
var Z = O("<span class=\"info-icon svg-icon svelte-1226wk1\" aria-hidden=\"true\"></span>"), ee = O("<div aria-atomic=\"true\"><div class=\"floating-message-body svelte-1226wk1\"><!> <div class=\"floating-message-content svelte-1226wk1\"><!></div></div></div>"), Q = {
	hash: "svelte-1226wk1",
	code: ".floating-message.svelte-1226wk1 {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:8px;box-shadow:0 6px 20px rgba(0, 0, 0, 0.18);padding:10px 12px;max-width:320px;position:fixed;z-index:100001;display:inline-flex;align-items:flex-start;white-space:nowrap;pointer-events:none;}.floating-message.top-right.svelte-1226wk1 {top:16px;right:16px;max-width:min(360px, calc(100vw - 32px));max-height:calc(100dvh - 32px);box-sizing:border-box;overflow:clip;contain:paint;white-space:normal;}\n\n    /* The positioned parent owns these coordinates from the first render. */.floating-message.parent-top.svelte-1226wk1 {position:absolute;top:12px;left:50%;translate:-50% 0;max-width:min(360px, calc(100% - 24px));max-height:calc(100% - 24px);box-sizing:border-box;overflow:clip;contain:paint;white-space:normal;}.floating-message.top-right.svelte-1226wk1 .floating-message-body:where(.svelte-1226wk1),\n    .floating-message.top-right.svelte-1226wk1 .floating-message-content:where(.svelte-1226wk1),\n    .floating-message.parent-top.svelte-1226wk1 .floating-message-body:where(.svelte-1226wk1),\n    .floating-message.parent-top.svelte-1226wk1 .floating-message-content:where(.svelte-1226wk1) {min-width:0;overflow-wrap:anywhere;}.floating-message.container-top-right.svelte-1226wk1 {top:auto;right:auto;box-sizing:border-box;white-space:normal;}.floating-message.anchor-bottom-right.svelte-1226wk1,\n    .floating-message.anchor-center.svelte-1226wk1 {top:auto;right:auto;box-sizing:border-box;white-space:normal;}.floating-message-body.svelte-1226wk1 {display:inline-flex;align-items:center;gap:4px;width:100%;}.floating-message-content.svelte-1226wk1 {padding:0 2px;font-size:1rem;font-weight:bold;color:var(--text);text-align:center;}.info-icon.svelte-1226wk1 {mask-image:var(--ehagaki-icon-696e666f5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;min-width:24px;}"
};
function te(t, s) {
	n(s, !0), w(t, Q);
	let m = k(s, "show", 3, !1), h = k(s, "x", 3, 0), S = k(s, "y", 3, 0), D = k(s, "variant", 3, "pointer"), O = k(s, "anchor", 3, null), j = k(s, "anchorRightOffset", 3, 0), M = k(s, "showInfoIcon", 3, !0), P = k(s, "fadeOutDuration", 3, 0), I = k(s, "role", 3, "status"), L = k(s, "children", 3, void 0), R = N(void 0), z = N(0), B = N(0), H = N(320), U = N(!1), { overlayTarget: W, layoutTarget: G } = F();
	T(() => {
		D() === "pointer" && (g(z, h()), g(B, S()));
	}), T(() => {
		m() && A(R) && D() === "pointer" && (async () => {
			if (await C(), !A(R)) return;
			let e = A(R).getBoundingClientRect(), t = window.innerWidth, n = window.innerHeight, r = h(), i = S();
			r + e.width + 10 > t && (r = t - e.width - 10), r - 10 < 0 && (r = 10), i + e.height + 10 > n && (i = n - e.height - 10), i - 10 < 0 && (i = 10), g(z, r, !0), g(B, i, !0);
		})();
	}), T(() => {
		m() && A(R) && D() === "container-top-right" && (async () => {
			if (await C(), !A(R)) return;
			let e = G.getBoundingClientRect();
			if (g(H, Math.min(320, Math.max(0, e.width - 20)), !0), await C(), !A(R)) return;
			let t = A(R).getBoundingClientRect();
			g(z, Math.max(e.left + 10, e.right - t.width - 10), !0), g(B, e.top + 10);
		})();
	}), T(() => {
		if (D() !== "anchor-bottom-right" && D() !== "anchor-center" || !m()) return;
		if (!A(R) || !O()) {
			g(U, !1);
			return;
		}
		let e = !1;
		g(U, !1);
		let t = async () => {
			if (await C(), e || !A(R) || !O()) return;
			let t = O().getBoundingClientRect(), n = window.innerWidth, r = window.innerHeight, i = Math.max(0, n - 20), a = Math.min(320, i);
			if (A(H) !== a && (g(H, a, !0), await C(), e || !A(R))) return;
			let o = A(R).getBoundingClientRect(), s = D() === "anchor-center" ? t.left + (t.width - o.width) / 2 : t.right - o.width - j(), c = D() === "anchor-center" ? t.top + (t.height - o.height) / 2 : t.bottom + 8;
			g(z, Math.max(10, Math.min(s, n - o.width - 10)), !0), g(B, Math.max(10, Math.min(c, r - o.height - 10)), !0), g(U, !0);
		}, n = 0, r = () => {
			n || e || (n = requestAnimationFrame(() => {
				n = 0, t();
			}));
		};
		window.addEventListener("resize", r), window.addEventListener("scroll", r, {
			capture: !0,
			passive: !0
		});
		let i = typeof ResizeObserver > "u" ? null : new ResizeObserver(() => void t());
		return i?.observe(O()), i?.observe(A(R)), t(), () => {
			e = !0, n && cancelAnimationFrame(n), window.removeEventListener("resize", r), window.removeEventListener("scroll", r, !0), i?.disconnect();
		};
	});
	var K = c(), q = x(K), J = (t) => {
		{
			let n = f(() => D() === "parent-top");
			X(t, {
				get to() {
					return W;
				},
				get disabled() {
					return A(n);
				},
				children: (t, n) => {
					var i = c(), s = x(i), f = (t) => {
						var n = ee(), i = y(n), s = y(i), c = (e) => {
							var t = Z();
							o(e, t);
						};
						e(s, (e) => {
							M() && e(c);
						});
						var f = E(s, 2), m = y(f);
						a(m, () => L() ?? d), u(f), u(i), u(n), b(n, (e) => g(R, e), () => A(R)), v(() => {
							r(n, 1, `floating-message ${D() ?? ""}`, "svelte-1226wk1"), p(n, D() === "container-top-right" ? `left: ${A(z)}px; top: ${A(B)}px; width: ${A(H)}px;` : D() === "anchor-bottom-right" || D() === "anchor-center" ? `left: ${A(z)}px; top: ${A(B)}px; max-width: ${A(H)}px; visibility: ${A(U) ? "visible" : "hidden"};` : D() === "pointer" ? `left: ${A(z)}px; top: ${A(B)}px;` : void 0), _(n, "role", I()), _(n, "aria-live", I() === "alert" ? "assertive" : "polite");
						}), l(2, n, () => V, () => ({ duration: P() })), o(t, n);
					};
					e(s, (e) => {
						m() && e(f);
					}), o(t, i);
				},
				$$slots: { default: !0 }
			});
		}
	};
	e(q, (e) => {
		(m() || P() > 0) && e(J);
	}), o(t, K), i();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/Button.svelte
var ne = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"className",
	"class",
	"disabled",
	"type",
	"ariaLabel",
	"style",
	"variant",
	"shape",
	"contentLayout",
	"children",
	"ref",
	"onClick",
	"selected",
	"floatingMessage",
	"floatingMessageDuration",
	"floatingMessageVariant"
]), re = O("<div class=\"svelte-1kbd9s6\"> </div>"), ie = O("<button><!></button> <!>", 1), ae = {
	hash: "svelte-1kbd9s6",
	code: "button.svelte-1kbd9s6 {background-color:var(--btn-bg);}\n    /* --- Variant Styles --- */.ehagaki-app-root :where(.default, .primary, .secondary) {padding:8px 12px;}.ehagaki-app-root :where(.default) {:where(.svg-icon) {width:24px;height:24px;}.btn-text {font-size:1rem;font-weight:500;}}.ehagaki-app-root :where(.primary) {--btn-bg: var(--theme);--text: white;font-weight:500;gap:8px;border:none;.svg-icon {--svg: white;width:28px;height:28px;}.btn-text {color:white;font-size:1rem;font-weight:500;}\n                .loading-placeholder.post-button-loading\n                    .loader-container\n                    .square\n             {background-color:white;}\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {color:light-dark(\n                    color-mix(in srgb, white, black 6%),\n                    color-mix(in srgb, white, black 10%)\n                );background-color:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 4%),\n                    color-mix(in srgb, var(--btn-bg), black 7%)\n                );.btn-text {color:currentColor;}}\n        }}:root.light .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon,\n    :root.dark .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon,\n    :host(.light) .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon,\n    :host(.dark) .ehagaki-app-root button.primary.svelte-1kbd9s6:hover:not(:disabled) .svg-icon {background-color:currentColor;}.ehagaki-app-root :where(.secondary) {border:1px solid var(--btn-border);--btn-bg: white;--text: var(--text-black);--border: var(--light-gray);\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 3%),\n                    color-mix(in srgb, var(--btn-bg), black 8%)\n                );color:light-dark(\n                    color-mix(in srgb, var(--text), black 6%),\n                    black\n                );}\n        }}.header.svelte-1kbd9s6 {border:1px solid var(--accent-color-custom, var(--hagaki));\n        @media (hover: hover) and (pointer: fine) {:root.light &,\n            :host(.light) & {&:hover:not(:disabled) {border-color:color-mix(\n                        in srgb,\n                        var(--accent-color-custom, var(--hagaki)),\n                        black 3%\n                    );}}\n        }:root.light &,\n        :host(.light) & {--btn-bg: var(--base-color-surface-button, var(--surface-editor));}}.danger.svelte-1kbd9s6 {--btn-bg: var(--danger);--text: white;border:none;\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background-color:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 8%),\n                    color-mix(in srgb, var(--btn-bg), black 12%)\n                );color:light-dark(\n                    color-mix(in srgb, white, black 8%),\n                    color-mix(in srgb, white, black 12%)\n                );}\n        }}.warning.svelte-1kbd9s6 {--btn-bg: hsl(58, 99%, 74%);--text: var(--text-black);border:none;\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background:light-dark(\n                    color-mix(in srgb, var(--btn-bg), black 8%),\n                    color-mix(in srgb, var(--btn-bg), black 12%)\n                );}\n        }}.footer.svelte-1kbd9s6 {max-width:100px;flex:1 1 0;--btn-bg: transparent;}button.svelte-1kbd9s6:is(.close:where(.svelte-1kbd9s6), .copy:where(.svelte-1kbd9s6)) {--btn-bg: rgb(0 0 0 / var(--overlay-opacity));--svg: whitesmoke;width:50px;height:50px;padding:0;border:none;opacity:0.8;backdrop-filter:blur(4px);transition:background 0.2s ease;background:var(--btn-bg);.svg-icon {width:var(--icon-size);height:var(--icon-size);mask-image:var(--icon-mask);}\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {--btn-bg: rgb(25 25 25 / var(--hover-overlay-opacity));background:var(--btn-bg);}\n        }}button.close.svelte-1kbd9s6 {--overlay-opacity: 0.5;--hover-overlay-opacity: 0.5;--icon-size: 32px;--icon-mask: var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}button.copy.svelte-1kbd9s6 {--overlay-opacity: 0.45;--hover-overlay-opacity: 0.45;--icon-size: 20px;--icon-mask: var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}\n\n    /* --- Shape Styles --- */.square.svelte-1kbd9s6,\n    .circle.svelte-1kbd9s6 {padding:0;}.square.svelte-1kbd9s6 {border-radius:0;:where(.svg-icon) {width:30px;height:30px;}}.rounded.svelte-1kbd9s6 {border-radius:6px;}.pill.svelte-1kbd9s6 {border-radius:50px;}.circle.svelte-1kbd9s6 {border-radius:50%;display:flex;align-items:center;justify-content:center;aspect-ratio:1;.svg-icon {width:28px;height:28px;}}\n\n    /* --- Content Layout Styles --- */.ehagaki-app-root :where(.content-iconText) {gap:8px;padding:12px 18px 12px 14px;}.content-icon.svelte-1kbd9s6 {padding:0;:where(.svg-icon) {width:30px;height:30px;}}"
};
function $(t, r) {
	n(r, !0), w(t, ae);
	let c = k(r, "className", 3, ""), l = k(r, "class", 3, ""), p = k(r, "disabled", 3, !1), m = k(r, "type", 3, "button"), h = k(r, "ariaLabel", 3, void 0), _ = k(r, "style", 3, ""), C = k(r, "variant", 3, void 0), T = k(r, "shape", 3, void 0), O = k(r, "contentLayout", 3, void 0), P = k(r, "ref", 15, null), F = k(r, "onClick", 3, void 0), I = k(r, "selected", 3, !1), L = k(r, "floatingMessage", 3, ""), R = k(r, "floatingMessageDuration", 3, 1800), z = k(r, "floatingMessageVariant", 3, "pointer"), B = S(r, ne), V = N(!1), H = N(0), U = N(0), W, G = f(() => C() ?? ""), K = f(() => O() ? `content-${O()}` : ""), q = f(() => `${l()} ${c()}`.trim()), J = f(() => T() ?? "");
	function Y() {
		W !== void 0 && (clearTimeout(W), W = void 0);
	}
	function X(e) {
		if (e.detail !== 0) return {
			x: e.clientX,
			y: e.clientY
		};
		let t = e.currentTarget.getBoundingClientRect();
		return {
			x: t.left + t.width / 2,
			y: t.bottom + 8
		};
	}
	function Z(e) {
		L() && (Y(), g(H, e.x, !0), g(U, e.y, !0), g(V, !0), W = setTimeout(() => {
			g(V, !1), W = void 0;
		}, R()));
	}
	async function ee(e) {
		let t = L() ? X(e) : null;
		(F() ? await F()(e) : void 0) !== !1 && t && Z(t);
	}
	j(Y);
	var Q = ie(), $ = x(Q);
	M($, () => ({
		type: m(),
		class: `${A(q)} ${A(G)} ${A(J)} ${A(K)} ${I() ? "selected" : ""}`,
		disabled: p(),
		"aria-label": h() || void 0,
		style: _(),
		onclick: ee,
		...B
	}), void 0, void 0, void 0, "svelte-1kbd9s6");
	var oe = y($);
	a(oe, () => r.children ?? d), u($), b($, (e) => P(e), () => P());
	var se = E($, 2), ce = (e) => {
		te(e, {
			get show() {
				return A(V);
			},
			get x() {
				return A(H);
			},
			get y() {
				return A(U);
			},
			get variant() {
				return z();
			},
			children: (e, t) => {
				var n = re(), r = D(n, !0);
				v(() => s(r, L())), o(e, n);
			},
			$$slots: { default: !0 }
		});
	};
	e(se, (e) => {
		L() && e(ce);
	}), o(t, Q), i();
}
export { J as i, te as n, X as r, $ as t };
