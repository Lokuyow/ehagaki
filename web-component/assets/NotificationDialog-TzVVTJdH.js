import { A as e, Et as t, G as n, I as r, K as i, L as ee, Mt as a, N as te, R as ne, T as o, Tt as s, V as c, W as l, Y as re, a as u, ct as d, dt as f, f as p, ft as ie, gt as m, i as h, it as g, jt as ae, lt as _, nt as v, o as y, pt as b, r as x, s as oe, st as S, t as se, ut as C, vt as w, w as ce, xt as T, y as E, yt as D, z as O } from "./index-client-XkLzkVYC.js";
import { pt as le } from "./LoadingPlaceholder-lit91akO.js";
import { s as k } from "./appUtils-BRia-Jm6.js";
import { t as ue } from "./useDialogHistory.svelte-BgJftJRE.js";
import { t as de } from "./DialogWrapper-DOH4rn3S.js";
import { _ as A, nt as j, v as M } from "./App-B2GhfviI.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/NotificationDialog.svelte
var N = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"show",
	"onClose",
	"returnFocus",
	"isStaleAssetReloadRequired",
	"onLoadFailure"
]), P = i("<span class=\"svg-icon\" aria-hidden=\"true\"></span>"), F = i("<p role=\"status\"> </p> <!>", 1), I = i("<div class=\"placeholder-entry svelte-1mnlykx\"><div class=\"placeholder-heading svelte-1mnlykx\"><span class=\"placeholder-avatar svelte-1mnlykx\"></span><span class=\"placeholder-chip svelte-1mnlykx\"></span></div> <div class=\"placeholder-card svelte-1mnlykx\"><span class=\"placeholder-avatar svelte-1mnlykx\"></span><span class=\"placeholder-line svelte-1mnlykx\"></span><span class=\"placeholder-line short svelte-1mnlykx\"></span></div></div>"), L = i("<div class=\"notification-opening-placeholder svelte-1mnlykx\" aria-hidden=\"true\"></div>"), R = i("<div class=\"notification-viewport svelte-1mnlykx\"><div><!></div> <!></div>"), z = {
	hash: "svelte-1mnlykx",
	code: ".notification-dialog {width:min(800px, calc(100% - 16px));min-width:0;}.notification-dialog.dialog {top:0;translate:-50% 0;height:100svh;max-height:100svh;}.notification-dialog.dialog.dialog-container-layout {height:100%;max-height:100%;}.notification-dialog .dialog-content {flex:1;min-height:0;max-height:none;overflow-anchor:none;}.notification-dialog .dialog-footer {flex:none;}.notification-dialog.dialog[data-state=\"open\"] { animation: svelte-1mnlykx-notification-open 250ms ease-out;}\n    @keyframes svelte-1mnlykx-notification-open { from { opacity: 0; } to { opacity: 1; } }\n    @media (prefers-reduced-motion: reduce) {.notification-dialog.dialog[data-state=\"open\"] { animation: none;} }.notification-viewport.svelte-1mnlykx {position:relative;width:100%;min-width:0;}.hidden.svelte-1mnlykx {visibility:hidden;}.notification-opening-placeholder.svelte-1mnlykx {position:absolute;inset:0;min-height:420px;overflow:hidden;pointer-events:none;}.notification-viewport[aria-busy=\"true\"].svelte-1mnlykx {min-height:420px;}.placeholder-entry.svelte-1mnlykx {padding-block:12px;border-bottom:1px solid var(--border-hr);}.placeholder-heading.svelte-1mnlykx {display:flex;gap:8px;align-items:center;margin-bottom:8px;}.placeholder-avatar.svelte-1mnlykx, .placeholder-chip.svelte-1mnlykx, .placeholder-line.svelte-1mnlykx {display:block;background:var(--text);opacity:.07;border-radius:4px;}.placeholder-avatar.svelte-1mnlykx {width:24px;height:24px;border-radius:50%;}.placeholder-chip.svelte-1mnlykx {width:70px;height:24px;border-radius:20px;}.placeholder-card.svelte-1mnlykx {display:grid;gap:12px;padding:8px;background:var(--bg-input);}.placeholder-line.svelte-1mnlykx {width:90%;height:12px;}.placeholder-line.short.svelte-1mnlykx {width:55%;}"
};
function B(i, B) {
	t(B, !0), e(i, z);
	let V = () => oe(le, "$_", H), [H, fe] = y(), U = x(B, "show", 15, !1), pe = x(B, "returnFocus", 3, null), me = x(B, "isStaleAssetReloadRequired", 3, () => !1), he = h(B, N), W = w(!0), ge = j("icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), G = w(null), K = w(null), q = w(!1), J = w(!1), Y = w(!1), X = w(0), Z = !1, _e = A("notifications-content", M, { isStale: () => Z || me()() });
	function Q() {
		v(K)?.invalidateSession(), m(Y, !0), D(X), m(q, !1);
	}
	function $(e = !0) {
		return !v(K)?.isFullscreen() && (U() && m(W, e, !0), Q(), U(!1), B.onClose(), !0);
	}
	ue(() => U(), () => $());
	let ve = T(() => ({
		owner: B.pubkeyHex,
		runtime: B.rxNostr,
		relays: B.relayConfig
	}));
	_(() => {
		v(ve), g(() => {
			v(K)?.invalidateSession(), D(X), m(q, !1), m(Y, !1), m(J, !1);
		});
	}), d(() => {
		if (!U() || v(Y)) return;
		let e = v(X);
		_e().then((t) => {
			Z || !U() || v(Y) || e !== v(X) || (t.status === "loaded" ? m(G, t.component, !0) : (m(J, !0), B.onLoadFailure?.(t)));
		});
	}), se(() => {
		Z = !0, Q();
	});
	var ye = { invalidateSession: Q };
	{
		let e = (e) => {
			{
				let t = T(() => V()("global.close"));
				k(e, {
					className: "modal-close",
					shape: "square",
					get ariaLabel() {
						return v(t);
					},
					onClick: () => $(),
					children: (e, t) => {
						var n = P();
						let r;
						S(() => r = ce(n, "", r, { "mask-image": `url("${ge}")` })), l(e, n);
					},
					$$slots: { default: !0 }
				});
			}
		}, t = T(() => V()("notifications.title")), s = T(() => V()("notifications.description"));
		de(i, {
			onOpenChange: (e) => {
				e || $();
			},
			get title() {
				return v(t);
			},
			get description() {
				return v(s);
			},
			contentClass: "notification-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			trapFocus: !1,
			onEscapeKeydown: (e) => {
				v(K)?.isFullscreen() && e.preventDefault();
			},
			onInteractOutside: (e) => {
				v(K)?.isFullscreen() && e.preventDefault();
			},
			get returnFocus() {
				return pe();
			},
			get open() {
				return U();
			},
			set open(e) {
				U(e);
			},
			get restoreFocusOnClose() {
				return v(W);
			},
			set restoreFocusOnClose(e) {
				m(W, e, !0);
			},
			footer: e,
			children: (e, t) => {
				var i = R(), s = C(i);
				let d;
				var h = C(s);
				ne(h, () => v(X), (e) => {
					var t = n(), r = f(t), i = (e) => {
						var t = n(), r = f(t);
						te(r, () => v(G), (e, t) => {
							p(t(e, u(() => he, {
								show: !0,
								get presentationReady() {
									return v(q);
								},
								onClose: () => $(!1),
								onInitialReady: () => m(q, !0)
							})), (e) => m(K, e, !0), () => v(K));
						}), l(e, t);
					};
					O(r, (e) => {
						v(G) && U() && !v(Y) && e(i);
					}), l(e, t);
				}), a(s);
				var g = b(s, 2), _ = (e) => {
					var t = F(), n = f(t), r = ie(n, !0), i = b(n, 2);
					k(i, {
						onClick: () => {
							m(J, !1), D(X);
						},
						children: (e, t) => {
							ae();
							var n = re();
							S((e) => c(n, e), [() => V()("notifications.retry")]), l(e, n);
						},
						$$slots: { default: !0 }
					}), S((e) => c(r, e), [() => V()("notifications.partialFailure")]), l(e, t);
				}, y = (e) => {
					var t = L();
					r(t, 20, () => [
						0,
						1,
						2
					], ee, (e, t) => {
						var n = I();
						l(e, n);
					}), a(t), l(e, t);
				};
				O(g, (e) => {
					v(J) ? e(_) : v(q) || e(y, 1);
				}), a(i), S(() => {
					E(i, "aria-busy", !v(q) && !v(J)), s.inert = !v(q), E(s, "aria-hidden", v(q) ? void 0 : "true"), d = o(s, 1, "svelte-1mnlykx", null, d, { hidden: !v(q) });
				}), l(e, i);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var be = s(ye);
	return fe(), be;
}
export { B as default };
