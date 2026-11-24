import { B as e, Dt as t, E as n, Et as r, G as i, H as a, K as o, L as ee, Mt as s, Nt as c, P as l, R as te, St as u, T as d, X as ne, _t as f, a as p, at as m, b as h, bt as g, ct as _, dt as v, f as re, ft as y, i as b, j as x, lt as S, mt as C, o as w, pt as ie, q as T, r as E, rt as D, s as ae, t as oe, ut as se, yt as O, z as ce } from "./index-client-DEFG3Gqk.js";
import { Z as le } from "./LoadingPlaceholder-YrD8D_td.js";
import { t as k } from "./Button-Cqrg0_jX.js";
import { t as ue } from "./useDialogHistory.svelte-pVteCIez.js";
import { t as de } from "./DialogWrapper-DlNV_DwH.js";
import { t as A } from "./appAssetUrl-B5sJnZLv.js";
import { _ as j, g as M } from "./App-CW2Ynbk9.js";
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
]), P = T("<span class=\"svg-icon\" aria-hidden=\"true\"></span>"), F = T("<p role=\"status\"> </p> <!>", 1), I = T("<div class=\"placeholder-entry svelte-1mnlykx\"><div class=\"placeholder-heading svelte-1mnlykx\"><span class=\"placeholder-avatar svelte-1mnlykx\"></span><span class=\"placeholder-chip svelte-1mnlykx\"></span></div> <div class=\"placeholder-card svelte-1mnlykx\"><span class=\"placeholder-avatar svelte-1mnlykx\"></span><span class=\"placeholder-line svelte-1mnlykx\"></span><span class=\"placeholder-line short svelte-1mnlykx\"></span></div></div>"), L = T("<div class=\"notification-opening-placeholder svelte-1mnlykx\" aria-hidden=\"true\"></div>"), R = T("<div class=\"notification-viewport svelte-1mnlykx\"><div><!></div> <!></div>"), z = {
	hash: "svelte-1mnlykx",
	code: ".notification-dialog {width:min(800px, calc(100% - 16px));min-width:0;}.notification-dialog.dialog {top:0;translate:-50% 0;height:100svh;max-height:100svh;}.notification-dialog.dialog.dialog-container-layout {height:100%;max-height:100%;}.notification-dialog .dialog-content {flex:1;min-height:0;max-height:none;overflow-anchor:none;}.notification-dialog .dialog-footer {flex:none;}.notification-dialog.dialog[data-state=\"open\"] { animation: svelte-1mnlykx-notification-open 250ms ease-out;}\n    @keyframes svelte-1mnlykx-notification-open { from { opacity: 0; } to { opacity: 1; } }\n    @media (prefers-reduced-motion: reduce) {.notification-dialog.dialog[data-state=\"open\"] { animation: none;} }.notification-viewport.svelte-1mnlykx {position:relative;width:100%;min-width:0;}.hidden.svelte-1mnlykx {visibility:hidden;}.notification-opening-placeholder.svelte-1mnlykx {position:absolute;inset:0;min-height:420px;overflow:hidden;pointer-events:none;}.notification-viewport[aria-busy=\"true\"].svelte-1mnlykx {min-height:420px;}.placeholder-entry.svelte-1mnlykx {padding-block:12px;border-bottom:1px solid var(--border-hr);}.placeholder-heading.svelte-1mnlykx {display:flex;gap:8px;align-items:center;margin-bottom:8px;}.placeholder-avatar.svelte-1mnlykx, .placeholder-chip.svelte-1mnlykx, .placeholder-line.svelte-1mnlykx {display:block;background:var(--text);opacity:.07;border-radius:4px;}.placeholder-avatar.svelte-1mnlykx {width:24px;height:24px;border-radius:50%;}.placeholder-chip.svelte-1mnlykx {width:70px;height:24px;border-radius:20px;}.placeholder-card.svelte-1mnlykx {display:grid;gap:12px;padding:8px;background:var(--bg-input);}.placeholder-line.svelte-1mnlykx {width:90%;height:12px;}.placeholder-line.short.svelte-1mnlykx {width:55%;}"
};
function B(T, B) {
	t(B, !0), x(T, z);
	let V = () => ae(le, "$_", H), [H, fe] = w(), U = E(B, "show", 15, !1), pe = E(B, "returnFocus", 3, null), me = E(B, "isStaleAssetReloadRequired", 3, () => !1), he = b(B, N), W = O(!0), ge = A("icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), G = O(null), K = O(null), q = O(!1), J = O(!1), Y = O(!1), X = O(0), Z = !1, _e = M("notifications-content", j, { isStale: () => Z || me()() });
	function Q() {
		D(K)?.invalidateSession(), f(Y, !0), g(X), f(q, !1);
	}
	function $(e = !0) {
		return !D(K)?.isFullscreen() && (U() && f(W, e, !0), Q(), U(!1), B.onClose(), !0);
	}
	ue(() => U(), () => $());
	let ve = u(() => ({
		owner: B.pubkeyHex,
		runtime: B.rxNostr,
		relays: B.relayConfig
	}));
	se(() => {
		D(ve), m(() => {
			D(K)?.invalidateSession(), g(X), f(q, !1), f(Y, !1), f(J, !1);
		});
	}), S(() => {
		if (!U() || D(Y)) return;
		let e = D(X);
		_e().then((t) => {
			Z || !U() || D(Y) || e !== D(X) || (t.status === "loaded" ? f(G, t.component, !0) : (f(J, !0), B.onLoadFailure?.(t)));
		});
	}), oe(() => {
		Z = !0, Q();
	});
	var ye = { invalidateSession: Q };
	{
		let t = (e) => {
			{
				let t = u(() => V()("global.close"));
				k(e, {
					className: "modal-close",
					shape: "square",
					get ariaLabel() {
						return D(t);
					},
					onClick: () => $(),
					children: (e, t) => {
						var n = P();
						let r;
						_(() => r = d(n, "", r, { "mask-image": `url("${ge}")` })), i(e, n);
					},
					$$slots: { default: !0 }
				});
			}
		}, r = u(() => V()("notifications.title")), m = u(() => V()("notifications.description"));
		de(T, {
			onOpenChange: (e) => {
				e || $();
			},
			get title() {
				return D(r);
			},
			get description() {
				return D(m);
			},
			contentClass: "notification-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			trapFocus: !1,
			onEscapeKeydown: (e) => {
				D(K)?.isFullscreen() && e.preventDefault();
			},
			onInteractOutside: (e) => {
				D(K)?.isFullscreen() && e.preventDefault();
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
				return D(W);
			},
			set restoreFocusOnClose(e) {
				f(W, e, !0);
			},
			footer: t,
			children: (t, r) => {
				var u = R(), d = v(u);
				let m;
				var b = v(d);
				ce(b, () => D(X), (t) => {
					var n = o(), r = y(n), a = (e) => {
						var t = o(), n = y(t);
						l(n, () => D(G), (e, t) => {
							re(t(e, p(() => he, {
								show: !0,
								get presentationReady() {
									return D(q);
								},
								onClose: () => $(!1),
								onInitialReady: () => f(q, !0)
							})), (e) => f(K, e, !0), () => D(K));
						}), i(e, t);
					};
					e(r, (e) => {
						D(G) && U() && !D(Y) && e(a);
					}), i(t, n);
				}), c(d);
				var x = C(d, 2), S = (e) => {
					var t = F(), n = y(t), r = ie(n, !0), o = C(n, 2);
					k(o, {
						onClick: () => {
							f(J, !1), g(X);
						},
						children: (e, t) => {
							s();
							var n = ne();
							_((e) => a(n, e), [() => V()("notifications.retry")]), i(e, n);
						},
						$$slots: { default: !0 }
					}), _((e) => a(r, e), [() => V()("notifications.partialFailure")]), i(e, t);
				}, w = (e) => {
					var t = L();
					ee(t, 20, () => [
						0,
						1,
						2
					], te, (e, t) => {
						var n = I();
						i(e, n);
					}), c(t), i(e, t);
				};
				e(x, (e) => {
					D(J) ? e(S) : D(q) || e(w, 1);
				}), c(u), _(() => {
					h(u, "aria-busy", !D(q) && !D(J)), d.inert = !D(q), h(d, "aria-hidden", D(q) ? void 0 : "true"), m = n(d, 1, "svelte-1mnlykx", null, m, { hidden: !D(q) });
				}), i(t, u);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var be = r(ye);
	return fe(), be;
}
export { B as default };
