import { $ as e, B as t, D as n, Dt as r, E as i, Et as a, F as o, G as s, H as c, K as l, L as u, M as d, Mt as f, Nt as p, P as m, Pt as h, Q as g, St as _, T as v, X as y, Z as b, _t as x, a as S, at as C, b as w, ct as T, dt as E, f as D, ft as O, g as k, ht as A, i as j, it as M, j as N, lt as P, mt as F, o as I, pt as L, q as R, r as z, rt as B, s as V, t as H, v as U, yt as W } from "./index-client-DEFG3Gqk.js";
import { n as G } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { n as K } from "./relayConfigUtils-56ujWwKF.js";
import { a as q, i as J, s as Y, t as X, u as ee } from "./postHistoryEventUtils-iuP8QpIA.js";
import { Z } from "./LoadingPlaceholder-YrD8D_td.js";
import { l as te, n as ne } from "./ehagakiDb-DuXS0XPm.js";
import { $ as re, L as ie, R as ae, S as Q, V as oe, b as $, et as se, g as ce, rt as le, s as ue, t as de, z as fe } from "./postHistoryRepository-Bu2z041i.js";
import { r as pe } from "./authStore.svelte-DkMZvUSe.js";
import { i as me } from "./hostRelayRuntime-SryW0auD.js";
import { p as he, v as ge } from "./settingsStore.svelte-CAa8Vn5a.js";
import { i as _e, n as ve, s as ye, t as be } from "./signedEventResultValidator-7WV1YEyT.js";
import { C as xe, S as Se, g as Ce } from "./clipboardUtils-CSGkJuUA.js";
import { n as we, u as Te } from "./nip46Service-ChjpWe9u.js";
import { n as Ee } from "./postEventBuilder-CW5VH1nr.js";
import { n as De, r as Oe, t as ke, u as Ae } from "./postHistoryContextFetchService-DB7akfzB.js";
import { n as je } from "./nip65RelayDirectory-B7gmBLn_.js";
import { n as Me, r as Ne, t as Pe } from "./Button-Cqrg0_jX.js";
import { A as Fe, O as Ie, a as Le, d as Re, f as ze, i as Be, j as Ve, k as He, n as Ue, v as We, w as Ge } from "./usePostHistoryEmojiState.svelte-_Y95EyLM.js";
import { a as Ke, i as qe, n as Je, r as Ye, t as Xe } from "./menu-trigger-DqitoevE.js";
import { t as Ze } from "./ProfileAvatar-eo19xgt6.js";
import { t as Qe } from "./DialogWrapper-DlNV_DwH.js";
import { t as $e } from "./dialog-close-DFGIFxm7.js";
import { i as et, n as tt, r as nt, t as rt } from "./tabs-trigger-CnepqnT4.js";
import { t as it } from "./graphemeUtils-D37rBdTG.js";
import { c as at, d as ot, t as st } from "./customEmoji-C4nd4cTR.js";
import { h as ct } from "./mediaNodeUtils-CzHZhHXE.js";
import { n as lt } from "./postReactionUtils-C8gCaYhG.js";
import { t as ut } from "./appAssetUrl-B5sJnZLv.js";
import { t as dt } from "./postSignerResolver-yBV52Cz4.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPreviewFooter.svelte
var ft = R("<div class=\"post-preview-footer-container svelte-r1d5vb\"><div><div class=\"post-preview-footer-left svelte-r1d5vb\"><span class=\"post-preview-date svelte-r1d5vb\"> </span> <!></div> <div class=\"post-preview-footer-actions svelte-r1d5vb\"><!></div> <div class=\"post-preview-footer-right svelte-r1d5vb\"><!></div></div></div>"), pt = {
	hash: "svelte-r1d5vb",
	code: ".post-preview-footer.svelte-r1d5vb {display:grid;grid-template-columns:minmax(0, 120px) minmax(144px, 1fr) 36px;align-items:stretch;height:36px;--post-history-preview-action-icon-size: 20px;color:var(--btn-post-preview-action);--post-history-preview-footer-surface: var(--dialog-bg);}.post-preview-footer-container.svelte-r1d5vb {container:post-footer / inline-size;width:100%;min-width:0;}\n    @container post-footer (width < 320px) {.post-preview-footer.svelte-r1d5vb:is(.post-preview-footer-compact:where(.svelte-r1d5vb), .post-preview-footer-regular:where(.svelte-r1d5vb)) {height:72px;padding-inline-start:0;grid-template-columns:minmax(0, 1fr) 36px;grid-template-rows:36px 36px;}.post-preview-footer.svelte-r1d5vb .post-preview-footer-left:where(.svelte-r1d5vb) {grid-column:1 / -1;}.post-preview-footer.svelte-r1d5vb .post-preview-footer-actions:where(.svelte-r1d5vb) {grid-column:1;min-width:0;}.post-preview-footer.svelte-r1d5vb .post-preview-footer-right:where(.svelte-r1d5vb) {grid-column:2;}.post-preview-footer.svelte-r1d5vb .post-preview-action-buttons-group {grid-template-columns:minmax(0, 1fr) 36px minmax(0, 1fr);}.post-preview-footer.svelte-r1d5vb .post-preview-reply-action-cell, .post-preview-footer.svelte-r1d5vb .post-preview-reaction-action-cell:has(.reaction-compose-button) {grid-template-columns:36px minmax(0, 36px);}\n    }.post-preview-footer-regular.svelte-r1d5vb {padding-inline-start:1rem;}\n\n    /* React and the count share one cell. Reserve their intrinsic width before shrinking the date. */.post-preview-footer:has(.reaction-compose-button) {grid-template-columns:minmax(0, 120px) minmax(min-content, 1fr) 36px;}.post-preview-action-buttons-group:has(.reaction-compose-button) {grid-template-columns:minmax(72px, 1fr) minmax(36px, 1fr) minmax(72px, 1fr);}.post-preview-footer-compact.svelte-r1d5vb {padding-inline-start:1rem;--post-history-preview-footer-surface: var(\n            --post-history-related-card-bg,\n            var(--dialog-bg)\n        );}.post-preview-footer.is-dimmed.svelte-r1d5vb {opacity:0.65;}.post-preview-footer-left.svelte-r1d5vb,\n    .post-preview-footer-actions.svelte-r1d5vb,\n    .post-preview-footer-right.svelte-r1d5vb {display:flex;align-items:stretch;}.post-preview-footer-left.svelte-r1d5vb {align-items:center;justify-content:flex-start;min-width:0;}.post-preview-footer-actions.svelte-r1d5vb {justify-content:stretch;min-width:0;}.post-preview-footer-right.svelte-r1d5vb {align-items:center;justify-content:flex-end;min-width:0;}.post-preview-date.svelte-r1d5vb {overflow:hidden;color:var(--text-muted);font-size:0.875rem;text-overflow:ellipsis;white-space:nowrap;}.post-preview-footer-regular.svelte-r1d5vb .post-preview-date:where(.svelte-r1d5vb) {font-size:0.9375rem;}.post-preview-footer-replies-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-reply-button-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-footer-reaction-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;max-width:100%;}.post-history-action-button,\n    .post-preview-reactions-button {min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface);background-color:var(--post-history-preview-footer-surface);}.post-preview-action-buttons-group {display:grid;grid-template-columns:minmax(72px, 1fr) repeat(2, minmax(36px, 1fr));align-items:stretch;width:100%;min-width:0;}.post-preview-action-cell {display:flex;align-items:stretch;justify-content:center;min-width:0;}.post-preview-reply-action-cell {display:grid;grid-template-columns:36px 36px;justify-content:center;}.post-preview-reaction-action-cell:has(.reaction-compose-button) {display:grid;grid-template-columns:36px 36px;justify-content:center;}.post-preview-quote-action-cell,\n    .post-preview-reaction-action-cell {justify-content:center;}.post-preview-reaction-action-cell .post-preview-footer-reaction-slot {max-width:100%;}.post-preview-action-button {position:relative;}.post-history-action-button {width:36px;min-width:36px;color:var(--btn-post-preview-action);}.post-history-action-button .svg-icon {--svg: currentColor;}.post-preview-footer :is(.reply-icon, .quote-icon, .reaction-compose-icon).svg-icon {width:var(--post-history-preview-action-icon-size);height:var(--post-history-preview-action-icon-size);}.post-preview-footer .reply-icon.svg-icon {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-preview-footer .quote-icon.svg-icon {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function mt(e, t) {
	r(t, !0), N(e, pt);
	let l = z(t, "density", 3, "regular"), u = z(t, "dimmed", 3, !1), d = z(t, "leftExtras", 3, void 0), f = z(t, "actions", 3, void 0), m = z(t, "trailing", 3, void 0);
	var g = ft(), _ = E(g), v = E(_), y = E(v), b = L(y, !0), x = F(y, 2);
	o(x, () => d() ?? h), p(v);
	var S = F(v, 2), C = E(S);
	o(C, () => f() ?? h), p(S);
	var w = F(S, 2), D = E(w);
	o(D, () => m() ?? h), p(w), p(_), p(g), T((e) => {
		i(_, 1, e, "svelte-r1d5vb"), c(b, t.formattedDate);
	}, [() => n(`post-preview-footer post-preview-footer-${l()} ${u() ? "is-dimmed" : ""}`.trim())]), s(e, g), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRelatedEventCard.svelte
var ht = R("<article class=\"post-history-related-card svelte-1g9bqtt\"><!> <div class=\"post-history-related-card-body svelte-1g9bqtt\"><div class=\"post-history-related-author svelte-1g9bqtt\"><!> <span class=\"post-history-related-author-name svelte-1g9bqtt\"> </span></div> <!> <!> <!></div></article>"), gt = {
	hash: "svelte-1g9bqtt",
	code: ".post-history-related-card.svelte-1g9bqtt {display:grid;margin-inline-start:-2px;--post-history-related-card-bg: color-mix(\n            in srgb,\n            var(--dialog-bg),\n            var(--border-hr) 24%\n        );border-inline-start:2px solid\n            color-mix(in srgb, var(--theme), transparent 45%);background:var(--post-history-related-card-bg);color:var(--text);font-size:0.9rem;}.post-history-related-card-body.svelte-1g9bqtt {display:grid;grid-template-columns:minmax(0, 1fr);min-width:0;gap:2px;padding:2px 10px 0 8px;}.post-history-related-card .post-preview-footer {margin-inline:-8px -10px;}.post-history-related-author.svelte-1g9bqtt {display:flex;align-items:center;min-width:0;gap:8px;}.post-history-related-avatar {display:block;width:24px;height:24px;flex:0 0 auto;border-radius:50%;overflow:hidden;}.post-history-related-avatar-image {width:100%;height:100%;object-fit:cover;}.post-history-related-author-name.svelte-1g9bqtt {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.post-history-related-card .post-history-related-content {margin:0;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}"
};
function _t(e, t) {
	r(t, !0), N(e, gt);
	let n = z(t, "profile", 3, null), i = z(t, "media", 3, void 0), l = z(t, "model", 3, void 0), u = z(t, "loadSensitiveBody", 3, void 0), d = z(t, "emojiLoadStateByUrl", 19, () => ({})), f = z(t, "emojiImageMetaByUrl", 19, () => ({})), m = z(t, "scrollRoot", 3, null), g = z(t, "isTextCollapsed", 3, !1), v = z(t, "previewCollapseAction", 3, void 0), y = z(t, "previewCollapseEventId", 3, void 0), b = z(t, "previewContentId", 3, void 0), x = z(t, "textOverlay", 3, void 0), S = z(t, "onImageOpen", 3, void 0), C = z(t, "topActions", 3, void 0), w = z(t, "footerLeftExtras", 3, void 0), D = z(t, "footerActions", 3, void 0), O = z(t, "footerDetails", 3, void 0), k = z(t, "footerMenu", 3, void 0), A = _(() => n()?.displayName?.trim() || n()?.name?.trim() || Ce(t.event.pubkey)), j = _(() => l() ?? ze({
		kind: t.event.kind,
		sourceContent: t.event.content,
		tags: t.event.tags,
		media: i()
	})), M = _(() => We(t.event.created_at * 1e3));
	var P = ht(), I = E(P);
	o(I, () => C() ?? h);
	var R = F(I, 2), V = E(R), H = E(V);
	{
		let e = _(() => n()?.displayName), r = _(() => n()?.name), i = _(() => n()?.picture);
		Ze(H, {
			get pubkeyHex() {
				return t.event.pubkey;
			},
			get displayName() {
				return B(e);
			},
			get name() {
				return B(r);
			},
			get src() {
				return B(i);
			},
			get alt() {
				return B(A);
			},
			get fallbackAriaLabel() {
				return B(A);
			},
			rootClassName: "post-history-related-avatar",
			imageClassName: "post-history-related-avatar-image"
		});
	}
	var U = F(H, 2), W = L(U, !0);
	p(V);
	var G = F(V, 2);
	Re(G, {
		get model() {
			return B(j);
		},
		get loadSensitiveBody() {
			return u();
		},
		get contentWarningEventId() {
			return t.event.id;
		},
		density: "compact",
		contentClass: "post-history-related-content",
		get emojiLoadStateByUrl() {
			return d();
		},
		get emojiImageMetaByUrl() {
			return f();
		},
		get scrollRoot() {
			return m();
		},
		get onImageOpen() {
			return S();
		},
		get isTextCollapsed() {
			return g();
		},
		get previewCollapseAction() {
			return v();
		},
		get previewCollapseEventId() {
			return y();
		},
		get previewContentId() {
			return b();
		},
		get textOverlay() {
			return x();
		}
	});
	var K = F(G, 2);
	mt(K, {
		get formattedDate() {
			return B(M);
		},
		density: "compact",
		get leftExtras() {
			return w();
		},
		get actions() {
			return D();
		},
		get trailing() {
			return k();
		}
	});
	var q = F(K, 2);
	o(q, () => O() ?? h), p(R), p(P), T(() => c(W, B(A))), s(e, P), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useLazyTooltipActivation.svelte.ts
var vt = 1e3;
function yt(e) {
	let t = W(!1), n = !1;
	function r(e) {
		let t = {
			bubbles: !1,
			cancelable: !1,
			clientX: e.clientX,
			clientY: e.clientY,
			pointerType: e.pointerType,
			pointerId: e.pointerId,
			isPrimary: e.isPrimary
		};
		if (typeof PointerEvent == "function") return new PointerEvent("pointerenter", t);
		let n = new MouseEvent("pointerenter", t);
		return Object.defineProperty(n, "pointerType", { value: e.pointerType }), n;
	}
	async function i(n, r) {
		let i = n !== null && ct() === n;
		x(t, !0), await M();
		let a = e();
		a && a !== n && (r(a), i && ct() !== a && a.focus({ preventScroll: !0 }));
	}
	function a(e) {
		B(t) || e.pointerType === "touch" || i(e.currentTarget, (t) => {
			t.dispatchEvent(r(e));
		});
	}
	function o(e) {
		if (B(t)) return;
		n = !0;
		let r = e.currentTarget, i = (r instanceof Node ? r.ownerDocument : null) ?? document, a = () => {
			n = !1, clearTimeout(o), i.removeEventListener("click", a, !0), i.removeEventListener("pointercancel", a, !0);
		}, o = setTimeout(a, vt);
		i.addEventListener("click", a, !0), i.addEventListener("pointercancel", a, !0);
	}
	function s(e) {
		B(t) || n || i(e.currentTarget, (e) => {
			e.focus({ preventScroll: !0 });
		});
	}
	return {
		get active() {
			return B(t);
		},
		onpointerenter: a,
		onpointerdown: o,
		onfocus: s
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostPreviewFooterActionButton.svelte
var bt = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"tooltipContent",
	"children",
	"onClick",
	"ariaLabel"
]), xt = R("<!> <!>", 1);
function St(e, n) {
	r(n, !0);
	let i = z(n, "onClick", 3, void 0), u = z(n, "ariaLabel", 3, ""), d = j(n, bt), p = G().overlayTarget, g = W(null), v = yt(() => B(g));
	var b = l(), C = O(b), w = (e) => {
		var t = l(), r = O(t);
		m(r, () => Ie, (e, t) => {
			t(e, {
				children: (e, t) => {
					var r = l(), a = O(r);
					m(a, () => Ve, (e, t) => {
						t(e, {
							delayDuration: 500,
							children: (e, t) => {
								var r = xt(), a = O(r);
								{
									let e = (e, t) => {
										let r = () => (t?.()).props, a = _(() => {
											let { onclick: e, ...t } = r();
											return {
												tooltipOnclick: e,
												restProps: t
											};
										});
										Pe(e, S(() => d, () => B(a).restProps, {
											get ariaLabel() {
												return u();
											},
											onClick: (e) => {
												let t = i()?.(e);
												return typeof B(a).tooltipOnclick == "function" && B(a).tooltipOnclick(e), t;
											},
											get ref() {
												return B(g);
											},
											set ref(e) {
												x(g, e, !0);
											},
											children: (e, t) => {
												var r = l(), i = O(r);
												o(i, () => n.children ?? h), s(e, r);
											},
											$$slots: { default: !0 }
										}));
									};
									m(a, () => He, (t, n) => {
										n(t, {
											child: e,
											$$slots: { child: !0 }
										});
									});
								}
								var v = F(a, 2);
								m(v, () => Ne, (e, t) => {
									t(e, {
										get to() {
											return p;
										},
										children: (e, t) => {
											var r = l(), i = O(r);
											m(i, () => Fe, (e, t) => {
												t(e, {
													sideOffset: 8,
													class: "tooltip-content post-preview-tooltip-content",
													children: (e, t) => {
														f();
														var r = y();
														T(() => c(r, n.tooltipContent)), s(e, r);
													},
													$$slots: { default: !0 }
												});
											}), s(e, r);
										},
										$$slots: { default: !0 }
									});
								}), s(e, r);
							},
							$$slots: { default: !0 }
						});
					}), s(e, r);
				},
				$$slots: { default: !0 }
			});
		}), s(e, t);
	}, E = (e) => {
		Pe(e, S(() => d, {
			get ariaLabel() {
				return u();
			},
			get onClick() {
				return i();
			},
			get onpointerenter() {
				return v.onpointerenter;
			},
			get onpointerdown() {
				return v.onpointerdown;
			},
			get onfocus() {
				return v.onfocus;
			},
			get ref() {
				return B(g);
			},
			set ref(e) {
				x(g, e, !0);
			},
			children: (e, t) => {
				var r = l(), i = O(r);
				o(i, () => n.children ?? h), s(e, r);
			},
			$$slots: { default: !0 }
		}));
	};
	t(C, (e) => {
		v.active ? e(w) : e(E, -1);
	}), s(e, b), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostReactionActionButton.svelte
var Ct = R("<div aria-hidden=\"true\"></div>"), wt = R("<span class=\"reaction-action-error svelte-kvh7jt\" role=\"alert\"> </span>"), Tt = R("<!> <!>", 1), Et = {
	hash: "svelte-kvh7jt",
	code: ".reaction-compose-icon.svelte-kvh7jt {--svg: currentColor;mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.failed.svelte-kvh7jt {color:var(--danger);}.reaction-action-error.svelte-kvh7jt {position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);}"
};
function Dt(e, n) {
	r(n, !0), N(e, Et);
	let o = () => V(Z, "$_", l), [l, u] = I(), d = W(!1), f = W(!1);
	async function p() {
		if (!B(d)) {
			x(d, !0), x(f, !1);
			try {
				x(f, await n.onReact() === !1);
			} catch {
				x(f, !0);
			} finally {
				x(d, !1);
			}
		}
	}
	var m = Tt(), h = O(m);
	{
		let e = _(() => o()("reaction.action")), t = _(() => o()(B(f) ? "reaction.targetFailed" : "reaction.action"));
		St(h, {
			type: "button",
			className: "post-history-action-button post-preview-action-button reaction-compose-button",
			get ariaLabel() {
				return B(e);
			},
			get tooltipContent() {
				return B(t);
			},
			shape: "circle",
			contentLayout: "icon",
			get disabled() {
				return B(d);
			},
			onClick: p,
			children: (e, t) => {
				var n = Ct();
				let r;
				T(() => r = i(n, 1, "reaction-compose-icon svg-icon svelte-kvh7jt", null, r, { failed: B(f) })), s(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	var g = F(h, 2), v = (e) => {
		var t = wt(), n = L(t, !0);
		T((e) => c(n, e), [() => o()("reaction.targetFailed")]), s(e, t);
	};
	t(g, (e) => {
		B(f) && e(v);
	}), s(e, m), a(), u();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPostActions.svelte
var Ot = R("<div class=\"reply-icon svg-icon\" aria-hidden=\"true\"></div>"), kt = R("<span class=\"count-kind-icon svg-icon svelte-120z4bl\" aria-hidden=\"true\"></span>"), At = R("<div class=\"quote-icon svg-icon\" aria-hidden=\"true\"></div>"), jt = R("<div class=\"post-preview-action-buttons-group\"><div class=\"post-preview-action-cell post-preview-reply-action-cell svelte-120z4bl\"><div class=\"post-preview-reply-button-slot\"><!></div> <div class=\"post-preview-footer-replies-slot svelte-120z4bl\"><!></div></div> <div class=\"post-preview-action-cell post-preview-quote-action-cell\"><!></div> <div class=\"post-preview-action-cell post-preview-reaction-action-cell svelte-120z4bl\"><!> <div class=\"post-preview-footer-reaction-slot svelte-120z4bl\"><!></div></div></div>"), Mt = {
	hash: "svelte-120z4bl",
	code: ".count-kind-icon.svelte-120z4bl {display:none;align-self:center;justify-self:center;inline-size:18px;block-size:18px;--svg: var(--text-muted);pointer-events:none;}.post-preview-reply-action-cell.svelte-120z4bl:has(.post-preview-footer-replies-slot:where(.svelte-120z4bl) > .post-preview-replies-badge-button)\n        .count-kind-icon:where(.svelte-120z4bl),\n    .post-preview-reaction-action-cell.svelte-120z4bl:has(.post-preview-footer-reaction-slot:where(.svelte-120z4bl) > .post-preview-reactions-button)\n        .count-kind-icon:where(.svelte-120z4bl) {display:block;}.post-preview-reaction-action-cell.svelte-120z4bl:has(> .count-kind-icon:where(.svelte-120z4bl)):has(.post-preview-footer-reaction-slot:where(.svelte-120z4bl) > .post-preview-reactions-button) {display:grid;grid-template-columns:minmax(0, 36px) 36px;}"
};
function Nt(e, n) {
	r(n, !0), N(e, Mt);
	let i = () => V(Z, "$_", c), [c, l] = I(), u = z(n, "onReactionPost", 3, void 0), d = z(n, "onReplyPost", 3, void 0), f = z(n, "onQuotePost", 3, void 0), m = z(n, "replyExtras", 3, void 0), g = z(n, "reactionExtras", 3, void 0), y = _(() => pe.value.type === "npub"), b = ut("icons/chat_bubble_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), x = ut("icons/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"), S = _(() => n.post.deletedAt === void 0 && (n.post.kind !== 42 || !!n.resolvedChannelEventId || !!J(n.post).channelEventId));
	var C = jt(), w = E(C), D = E(w), O = E(D), k = (e) => {
		{
			let t = _(() => i()("replyQuote.reply_label")), r = _(() => i()("replyQuote.reply_label"));
			St(e, {
				type: "button",
				className: "post-preview-action-button post-history-action-button",
				get ariaLabel() {
					return B(t);
				},
				contentLayout: "icon",
				shape: "circle",
				onClick: () => d()?.(n.post),
				get tooltipContent() {
					return B(r);
				},
				children: (e, t) => {
					var n = Ot();
					s(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	}, A = (e) => {
		var t = kt();
		let n;
		T(() => n = v(t, "", n, { "mask-image": `url("${b}")` })), s(e, t);
	};
	t(O, (e) => {
		d() && B(S) ? e(k) : B(y) && m() && e(A, 1);
	}), p(D);
	var j = F(D, 2), M = E(j);
	o(M, () => m() ?? h), p(j), p(w);
	var P = F(w, 2), L = E(P), R = (e) => {
		{
			let t = _(() => i()("replyQuote.quote_label")), r = _(() => i()("replyQuote.quote_label"));
			St(e, {
				type: "button",
				className: "post-preview-action-button post-history-action-button",
				get ariaLabel() {
					return B(t);
				},
				contentLayout: "icon",
				shape: "circle",
				onClick: () => f()?.(n.post),
				get tooltipContent() {
					return B(r);
				},
				children: (e, t) => {
					var n = At();
					s(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	};
	t(L, (e) => {
		f() && B(S) && e(R);
	}), p(P);
	var H = F(P, 2), U = E(H), W = (e) => {
		Dt(e, { onReact: () => u()(n.post) });
	}, G = _(() => u() && n.post.deletedAt === void 0 && lt(n.post.kind)), K = (e) => {
		var t = kt();
		let n;
		T(() => n = v(t, "", n, { "mask-image": `url("${x}")` })), s(e, t);
	};
	t(U, (e) => {
		B(G) ? e(W) : B(y) && g() && e(K, 1);
	});
	var q = F(U, 2), Y = E(q);
	o(Y, () => g() ?? h), p(q), p(H), p(C), s(e, C), a(), l();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphUtils.ts
var Pt = 5, Ft = .5, It = 2.5;
function Lt(e, t) {
	return `${e}:${t}`;
}
function Rt(e) {
	return e < 0 ? Math.max(0, Pt + e) : e;
}
function zt(e) {
	return Math.min(Rt(e) * Ft, It);
}
function Bt() {
	return {
		loadedParent: !1,
		visibleParent: !1,
		loadingParent: !1,
		parentError: null,
		parentMissing: !1,
		parentDeleted: !1,
		showParentLoadingIndicator: !1,
		revalidatingParent: !1,
		loadedChildren: !1,
		visibleChildren: !1,
		loadingChildren: !1,
		revalidatingChildren: !1,
		childrenError: null,
		lastFetchedParentAt: null,
		lastFetchedChildrenAt: null
	};
}
function Vt(e) {
	return q(e.rawEvent, e) ? X(e.rawEvent) : {
		id: e.eventId,
		pubkey: e.pubkeyHex,
		kind: e.kind,
		content: e.content,
		tags: e.tags.map((e) => [...e]),
		created_at: e.createdAt,
		sig: ""
	};
}
function Ht(e) {
	let t = {
		id: e.eventId,
		pubkey: e.authorPubkey,
		kind: e.kind,
		content: e.content,
		tags: e.tags.map((e) => [...e]),
		created_at: e.createdAt,
		sig: ""
	};
	return Y(e.rawEvent) && e.rawEvent.id === t.id && e.rawEvent.pubkey === t.pubkey && e.rawEvent.kind === t.kind && e.rawEvent.content === t.content && e.rawEvent.created_at === t.created_at && JSON.stringify(e.rawEvent.tags) === JSON.stringify(t.tags) ? X(e.rawEvent) : t;
}
function Ut(e) {
	let t = ee(e.event);
	return {
		eventId: e.event.id,
		event: X(e.event),
		authorPubkey: e.event.pubkey,
		rootEventId: t.rootId,
		parentEventId: t.parentId,
		profile: e.profile ?? null,
		relayUrls: [...e.relayUrls ?? []],
		sources: [...e.sources]
	};
}
function Wt(e, t) {
	if (!e) return t;
	let n = Array.from(/* @__PURE__ */ new Set([...e.relayUrls, ...t.relayUrls])).sort((e, t) => e.localeCompare(t)), r = Array.from(/* @__PURE__ */ new Set([...e.sources, ...t.sources]));
	return {
		...e,
		event: t.event,
		authorPubkey: t.authorPubkey,
		rootEventId: t.rootEventId,
		parentEventId: t.parentEventId,
		profile: t.profile ?? e.profile,
		relayUrls: n,
		sources: r
	};
}
function Gt(e, t) {
	return [...e].sort((e, n) => {
		let r = t[e]?.event, i = t[n]?.event;
		return !r || !i ? e.localeCompare(n) : r.created_at === i.created_at ? r.id.localeCompare(i.id) : r.created_at - i.created_at;
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/notificationTargetQueue.ts
function Kt(e, t) {
	let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map(), a = 0;
	async function o(e, i) {
		r.add(e);
		let o = a;
		for (; o === a && t() && i.length;) {
			let e = i.shift();
			try {
				let n = await e.run();
				e.finish(o === a && t() ? n : null);
			} catch (t) {
				e.fail(t);
			}
		}
		if (o === a) {
			for (let e of i) e.finish(null);
			n.delete(e), r.delete(e);
		}
	}
	function s(e, a, s = "") {
		if (!t()) return Promise.resolve(null);
		let c = JSON.stringify([e, s]), l = i.get(c);
		if (l) return l.task;
		let u = new Promise((t, i) => {
			let s = n.get(e.targetEventId) ?? [];
			s.push({
				scope: e.scopeKey,
				run: a,
				finish: t,
				fail: i
			}), n.set(e.targetEventId, s), r.has(e.targetEventId) || o(e.targetEventId, s);
		});
		i.set(c, {
			scope: e.scopeKey,
			task: u
		});
		let d = () => {
			i.get(c)?.task === u && i.delete(c);
		};
		return u.then(d, d), u;
	}
	let c = (t, n) => s(t, () => e.ensureTarget(t, n), JSON.stringify(n));
	return {
		...e,
		ensureTarget: c,
		ensureTargets: (e, t) => Promise.all(e.map((e) => c(e, t))),
		retryTarget: (t, n) => s(t, () => e.retryTarget(t, n), `retry:${JSON.stringify(n)}`),
		prepareRepostTarget: (t, n) => s(t, () => e.prepareRepostTarget(t, n), "prepare"),
		invalidateScope(t) {
			for (let [e, n] of i) n.scope === t && i.delete(e);
			for (let e of n.values()) for (let n = e.length - 1; n >= 0; n--) {
				let r = e[n];
				r.scope === t && (e.splice(n, 1), r.finish(null));
			}
			e.invalidateScope(t);
		},
		reset() {
			a++;
			for (let e of n.values()) for (let t of e) t.finish(null);
			n.clear(), r.clear(), i.clear(), e.reset();
		}
	};
}
function qt() {
	let e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set();
	function n() {
		for (let r of e) {
			if (t.size >= 4) break;
			e.delete(r), t.add(r), r.start().finally(() => {
				t.delete(r) && n();
			});
		}
	}
	return {
		run(t, r) {
			return new Promise((i, a) => {
				e.add({
					id: t,
					async start() {
						try {
							i(await r());
						} catch (e) {
							a(e);
						}
					},
					cancel: () => i(null)
				}), n();
			});
		},
		cancel(t) {
			for (let n of e) n.id === t && (e.delete(n), n.cancel());
		},
		reset() {
			for (let t of e) t.cancel();
			e.clear(), t.clear();
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelatedTargetResolver.svelte.ts
var Jt = 8;
function Yt(e) {
	return K.sanitizeExternalRelayUrls(e, { limit: Jt });
}
function Xt(e, t) {
	return {
		id: e,
		pubkey: t,
		kind: 1,
		content: "",
		tags: [],
		created_at: 0,
		sig: ""
	};
}
function Zt(e) {
	return {
		targetEventId: e.targetEventId,
		status: "loading",
		event: null,
		profile: null,
		authorPubkey: e.authorHint ?? null,
		relayHints: Yt(e.relayHints ?? []),
		errorCode: null,
		updatedAt: null
	};
}
function Qt({ getShow: e, getRxNostr: t, getRelayConfig: n, postHistoryRepositoryImpl: r = de, contextFetchService: i = ke, deletionRequestsRepositoryImpl: a = Oe, deletionFetchService: o = Ue, profileSyncCoordinator: s = void 0, loadRepostTarget: c = void 0, requireFullVerification: l = !1, notificationPreviews: u = !1, getOwner: d = () => void 0, eventRepositoryImpl: f = r === de ? new se(ne) : void 0 }) {
	let p = l || u, m = s ?? Ge({
		getShow: e,
		getRxNostr: t
	}), h = !s, g = W({}), _ = W(A({})), v = W(A({})), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new WeakSet(), O = u ? {
		local: qt(),
		fetch: qt(),
		deletion: qt()
	} : null, k = /* @__PURE__ */ new Map(), j = 0;
	function M(e) {
		x(_, {
			...B(_),
			[e]: (B(_)[e] ?? 0) + 1
		}, !0);
	}
	function N(e) {
		let t = b.get(e);
		if (t) for (let e of t) M(e);
	}
	function P(e, t) {
		let n = B(g)[e], r = t(n);
		return n && n.status === r.status && n.event === r.event && n.profile === r.profile && n.authorPubkey === r.authorPubkey && n.errorCode === r.errorCode && n.updatedAt === r.updatedAt && ue(n.relayHints, r.relayHints) ? n : (x(g, {
			...B(g),
			[e]: r
		}), N(e), r);
	}
	function F(e, t) {
		return P(e, (n) => {
			let r = n ?? Zt({
				targetEventId: e,
				relationKind: "related-target",
				scopeKey: ""
			});
			return {
				targetEventId: e,
				status: t.status ?? r.status,
				event: t.event === void 0 ? r.event : t.event,
				profile: t.profile === void 0 ? r.profile : t.profile,
				authorPubkey: t.authorPubkey === void 0 ? r.authorPubkey : t.authorPubkey,
				relayHints: t.relayHints ? Yt(t.relayHints) : r.relayHints,
				errorCode: t.errorCode === void 0 ? r.errorCode : t.errorCode,
				updatedAt: t.updatedAt === void 0 ? r.updatedAt : t.updatedAt
			};
		});
	}
	function I(e) {
		let t = B(g)[e.targetEventId], n = Yt([...t?.relayHints ?? [], ...e.relayHints ?? []]), r = t?.authorPubkey ?? e.authorHint ?? null, i = !t || t.authorPubkey !== r || !ue(t.relayHints, n);
		return F(e.targetEventId, {
			authorPubkey: r,
			relayHints: n
		}), i;
	}
	function L(e) {
		let t = y.get(e.scopeKey) ?? /* @__PURE__ */ new Set();
		t.add(e.targetEventId), y.set(e.scopeKey, t);
		let n = b.get(e.targetEventId) ?? /* @__PURE__ */ new Set();
		n.add(e.scopeKey), b.set(e.targetEventId, n), e.scopeKey in B(v) || x(v, {
			...B(v),
			[e.scopeKey]: 0
		}, !0), e.scopeKey in B(_) || x(_, {
			...B(_),
			[e.scopeKey]: 0
		}, !0);
	}
	async function R(e, t) {
		return (await a.getDeletedTargets([{
			targetAuthorPubkey: e,
			targetEventId: t
		}])).get(e)?.has(t) ?? !1;
	}
	function z(e, t) {
		return !!Q(e, {
			eventId: t.targetEventId,
			authorHint: p ? null : t.authorHint ?? null,
			authorHints: p ? void 0 : t.authorHints,
			targetKindHint: p ? void 0 : t.targetKindHint,
			relayHints: []
		}) && (p || !t.excludedKinds?.includes(e.kind));
	}
	async function V(e, t) {
		if (!f?.getMany || !e.length || !t()) return;
		let n = /* @__PURE__ */ new Map();
		for (let t of e) {
			let e = t.targetEventId;
			if (B(g)[e]?.status === "deleted") continue;
			let r = n.get(e);
			r ? r.push(t) : n.set(e, [t]);
		}
		if (!n.size) return;
		let r = new Map([...n.keys()].map((e) => [e, B(g)[e]])), i = (await f.getMany([...n.keys()])).filter((e) => n.get(e.id)?.some((t) => z(e.rawEvent, t)));
		if (!i.length || !t()) return;
		let o = await a.getDeletedTargets(i.map((e) => ({
			targetAuthorPubkey: e.rawEvent.pubkey,
			targetEventId: e.id
		})));
		if (t()) return () => {
			if (t()) for (let e of i) {
				if (B(g)[e.id] !== r.get(e.id)) continue;
				let t = e.rawEvent, n = e.deletedAt !== void 0 || o.get(t.pubkey)?.has(e.id);
				(n || r.get(e.id)?.status !== "resolved") && (n || D.add(t), F(e.id, {
					status: n ? "deleted" : "resolved",
					event: n ? null : t,
					authorPubkey: t.pubkey,
					relayHints: Yt([...e.relayUrls, ...r.get(e.id)?.relayHints ?? []]),
					errorCode: null,
					updatedAt: Date.now()
				}));
			}
		};
	}
	function H(e, t) {
		if (e && t) for (let [n, r] of Object.entries(B(g))) r.authorPubkey === e && F(n, { profile: t });
	}
	function U(e, t) {
		H(e, m.ensureProfile(e, t));
	}
	m.subscribe((t, n) => {
		e() && H(t, n);
	});
	async function G(r, i, s = {}) {
		if (!r.pubkey || !r.id) return !1;
		let c = b.get(r.id), l = t(), u = d(), f = Ae(n()), p = () => e() && t() === l && d() === u && Ae(n()) === f && c === b.get(r.id) && !!c?.size, m = await R(r.pubkey, r.id);
		if (!p()) return !1;
		if (m) return F(r.id, {
			status: "deleted",
			event: null,
			authorPubkey: r.pubkey,
			relayHints: i,
			errorCode: null,
			updatedAt: Date.now()
		}), !0;
		let h = t();
		if (!h) return !1;
		let g = `${r.pubkey}:${r.id}`, _ = w.get(g) ?? Promise.resolve().then(async () => {
			try {
				if (!p()) return !1;
				let e = re(ne, r.pubkey), t = o.fetchDeletionRequests(h, {
					targets: [{
						event: r,
						relayUrls: i
					}],
					relayHints: i,
					relayConfig: n()
				});
				T.set(g, t);
				let s = await t.promise;
				if (!p()) return !1;
				if (s.events.length > 0) {
					if (await a.upsertValidDeletionRequests({
						targetEvents: [r],
						deletionEvents: s.events,
						fetchedAt: s.fetchedAt
					}), !p()) return !1;
					De.archiveAdoptedAuthored([{ event: r }], {
						ownerPubkeyHex: r.pubkey,
						expectedRevision: await e,
						isActive: p
					});
				}
				let c = await R(r.pubkey, r.id);
				return p() ? (c && F(r.id, {
					status: "deleted",
					event: null,
					authorPubkey: r.pubkey,
					relayHints: i,
					errorCode: null,
					updatedAt: Date.now()
				}), c) : !1;
			} catch {
				return !1;
			} finally {
				w.get(g) === _ && (T.delete(g), w.delete(g));
			}
		});
		return w.set(g, _), !s.background && await _;
	}
	function K(e, n) {
		let r = b.get(e.id);
		if (!O || !r?.size || !t() || k.has(e.id)) return;
		let i = { completed: !1 };
		k.set(e.id, i), O.deletion.run(e.id, () => G(e, n)).then(() => {
			i.completed = !0;
		}, () => {
			k.get(e.id) === i && k.delete(e.id);
		});
	}
	async function q(e, t, n, r) {
		if (!n()) return null;
		let i = await R(e.pubkey, e.id);
		if (!n() || !i && r && (await r(), !n() || (i = await R(e.pubkey, e.id), !n()))) return null;
		let a = F(e.id, {
			status: i ? "deleted" : "resolved",
			event: i ? null : e,
			authorPubkey: e.pubkey,
			relayHints: t,
			errorCode: null,
			updatedAt: Date.now()
		});
		return i || (U(e.pubkey, t), K(e, t)), a;
	}
	function J(e, t) {
		return E.get(e) === t;
	}
	async function Y(a, o = {}, s) {
		L(a);
		let l = B(g)[a.targetEventId], u = I(a), m = B(g)[a.targetEventId] ?? Zt(a), h = s ? null : O, _ = !!o.background && l?.status === "resolved";
		if (p && l?.status === "resolved") {
			if (!Q(l.event, {
				eventId: a.targetEventId,
				authorHint: null,
				relayHints: []
			})) o = {
				...o,
				force: !0
			};
			else if (ie(l, a)?.status === "error") return l;
		}
		if ((a.relationKind === "repost" || p) && l?.status === "resolved") {
			let t = le(l.event)?.event;
			if (t?.id === a.targetEventId && (p || !a.excludedKinds?.includes(t.kind))) {
				let n = B(v)[a.scopeKey], r = b.get(t.id), i = () => e() && n === B(v)[a.scopeKey] && r === b.get(t.id) && r?.has(a.scopeKey), o = () => i() ? R(t.pubkey, t.id) : Promise.resolve(!1), s = await (h ? h.local.run(t.id, o) : o());
				if (!i()) return null;
				if (s) return F(t.id, {
					status: "deleted",
					event: null,
					authorPubkey: t.pubkey,
					errorCode: null,
					updatedAt: Date.now()
				});
			}
		}
		if (!o.force && l && (!o.requireRelayHint || l.relayHints.length > 0)) {
			if (l.status === "resolved" || l.status === "deleted") {
				if (a.relationKind === "repost" && l.status === "resolved" && !$(l.event, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				})) return await Y(a, {
					...o,
					force: !0
				}, s);
				if (l.status === "resolved" && l.authorPubkey) {
					U(l.authorPubkey, B(g)[a.targetEventId]?.relayHints ?? l.relayHints);
					let n = l.event, r = !!n && D.has(n);
					if (n && !s) {
						let e = B(g)[a.targetEventId]?.relayHints ?? l.relayHints;
						h ? K(n, e) : (a.relationKind === "repost" || r) && G(n, e, { background: !0 });
					}
					if (r && a.sourceEventId && f) {
						let r = B(v)[a.scopeKey], i = d(), o = t();
						f.link(a.sourceEventId, n.id, () => e() && i === d() && o === t() && r === B(v)[a.scopeKey]).catch(() => void 0);
					}
				}
				return B(g)[a.targetEventId] ?? l;
			}
			if (l.status === "loading" && !s && S.has(a.targetEventId)) return await S.get(a.targetEventId) ?? B(g)[a.targetEventId] ?? l;
			if (!u && !s && (l.status === "not-found" || l.status === "error")) return B(g)[a.targetEventId] ?? l;
		}
		if (!o.force && !s && S.has(a.targetEventId)) return await S.get(a.targetEventId) ?? B(g)[a.targetEventId] ?? m;
		o.force && (h && k.get(a.targetEventId)?.completed && k.delete(a.targetEventId), C.get(a.targetEventId)?.cancel(), C.delete(a.targetEventId), S.delete(a.targetEventId));
		let y = ++j;
		E.set(a.targetEventId, y);
		let x = d(), w = t(), T = Ae(n()), A = () => e() && J(a.targetEventId, y) && d() === x && t() === w && Ae(n()) === T;
		async function M() {
			if (!A()) return null;
			let e = await f?.get(a.targetEventId);
			if (!A()) return null;
			if (e && (!o.requireRelayHint || e.relayUrls.length) && z(e.rawEvent, a)) {
				let t = Yt([...e.relayUrls, ...m.relayHints]);
				if (e.deletedAt !== void 0) return F(a.targetEventId, {
					status: "deleted",
					event: null,
					relayHints: t,
					updatedAt: Date.now()
				});
				if (a.sourceEventId && await f.link(a.sourceEventId, e.id, A), !A()) return null;
				if (h) return q(e.rawEvent, t, A);
				let n = F(a.targetEventId, {
					status: "resolved",
					event: e.rawEvent,
					authorPubkey: e.rawEvent.pubkey,
					relayHints: t,
					errorCode: null,
					updatedAt: Date.now()
				});
				return U(e.rawEvent.pubkey, t), s || G(e.rawEvent, t, { background: !0 }), n;
			}
			let t = s ? {
				event: s.target,
				relayHints: m.relayHints
			} : a.relationKind === "repost" ? await c?.(a) : null;
			if (!A()) return null;
			let n = t && $(t.event, {
				eventId: a.targetEventId,
				authorHint: null,
				relayHints: a.relayHints ?? []
			});
			if (n && (!o.requireRelayHint || t.relayHints.length > 0)) {
				let e = Yt([...t.relayHints, ...m.relayHints]);
				if (h) return q(n.event, e, A);
				let r = F(a.targetEventId, {
					status: "resolved",
					event: n.event,
					authorPubkey: n.event.pubkey,
					relayHints: e,
					errorCode: null,
					updatedAt: Date.now()
				});
				return U(n.event.pubkey, e), s || G(n.event, e, { background: !0 }), r;
			}
			let i = await r.getByEventId(a.targetEventId);
			if (!A()) return B(g)[a.targetEventId] ?? null;
			let l = p && i ? Q(i.rawEvent, {
				eventId: a.targetEventId,
				authorHint: null,
				relayHints: []
			}) : null;
			if (i && (!p || l) && (!o.requireRelayHint || [
				...i.relayHints,
				...i.acceptedRelays,
				...i.fetchedRelays ?? []
			].length > 0) && (a.relationKind !== "repost" || $(i.rawEvent, {
				eventId: a.targetEventId,
				authorHint: null,
				relayHints: []
			}))) {
				let e = Yt([
					...m.relayHints,
					...i.relayHints,
					...i.acceptedRelays,
					...i.fetchedRelays ?? []
				]);
				if (typeof i.deletedAt == "number") return F(a.targetEventId, {
					status: "deleted",
					event: null,
					authorPubkey: l?.event.pubkey ?? i.pubkeyHex,
					relayHints: e,
					errorCode: null,
					updatedAt: Date.now()
				});
				let t = l?.event ?? (a.relationKind === "repost" ? $(i.rawEvent).event : Vt(i)), n = e;
				if (h) return q(t, n, A);
				let r = F(a.targetEventId, {
					status: "resolved",
					event: t,
					authorPubkey: t.pubkey,
					relayHints: n,
					errorCode: null,
					updatedAt: Date.now()
				});
				return U(t.pubkey, n), s || G(t, n, { background: !0 }), B(g)[a.targetEventId] ?? r;
			}
			return null;
		}
		let N = (async () => {
			try {
				_ || F(a.targetEventId, {
					status: "loading",
					errorCode: null
				});
				let r = await (h ? h.local.run(a.targetEventId, M) : M());
				if (r || !A()) return r;
				if (!p && a.authorHint && a.relationKind !== "repost") {
					let e = await G(Xt(a.targetEventId, a.authorHint), m.relayHints);
					if (!A() || e) return B(g)[a.targetEventId] ?? null;
				}
				let o = t();
				if (!o || !e()) return _ ? B(g)[a.targetEventId] ?? m : F(a.targetEventId, {
					status: "error",
					event: null,
					authorPubkey: m.authorPubkey,
					relayHints: m.relayHints,
					errorCode: "nostr_not_ready",
					updatedAt: Date.now()
				});
				let c = async () => {
					if (!A()) return null;
					let e = (s ? C.get(a.targetEventId) : void 0) ?? i.fetchEventById(o, {
						eventId: a.targetEventId,
						authorHint: a.authorHint,
						relayHints: m.relayHints,
						relayConfig: n()
					});
					return C.set(a.targetEventId, e), e.promise;
				}, l = await (h ? h.fetch.run(a.targetEventId, c) : c());
				if (!A() || !l) return B(g)[a.targetEventId] ?? null;
				if (C.delete(a.targetEventId), !l.event) {
					if (!p && a.authorHint && a.relationKind !== "repost") {
						let e = await G(Xt(a.targetEventId, a.authorHint), m.relayHints);
						if (!A() || e) return B(g)[a.targetEventId] ?? null;
					}
					return _ ? B(g)[a.targetEventId] ?? m : F(a.targetEventId, {
						status: "not-found",
						event: null,
						authorPubkey: m.authorPubkey,
						relayHints: m.relayHints,
						errorCode: null,
						updatedAt: Date.now()
					});
				}
				let u = Yt([...l.relayUrl ? [l.relayUrl] : [], ...m.relayHints]), d = p ? Q(l.event, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				}) : null;
				if (p && !d) return F(a.targetEventId, {
					status: "error",
					event: null,
					errorCode: "invalid_event",
					updatedAt: Date.now()
				});
				let v = d?.event ?? l.event;
				if (!p && a.excludedKinds?.includes(v.kind)) return F(a.targetEventId, {
					status: "error",
					event: null,
					errorCode: "invalid_event",
					updatedAt: Date.now()
				});
				if (a.relationKind === "repost" && !$(v, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				})) throw Error("invalid_repost_target");
				let y = u;
				if (h) {
					let e = f ? () => f.save(v, y, A, a.sourceEventId) : void 0;
					return await h.local.run(a.targetEventId, () => q(v, y, A, e));
				}
				let b = !s && await G(v, y, { background: a.relationKind === "repost" });
				if (!A()) return B(g)[a.targetEventId] ?? null;
				if (b) return v.id !== a.targetEventId && F(a.targetEventId, {
					status: "deleted",
					event: null,
					authorPubkey: v.pubkey,
					relayHints: y,
					errorCode: null,
					updatedAt: Date.now()
				}), B(g)[a.targetEventId] ?? null;
				if (f) {
					let e = Q(v, {
						eventId: a.targetEventId,
						authorHint: p ? null : a.authorHint ?? null,
						authorHints: p ? void 0 : a.authorHints,
						targetKindHint: p ? void 0 : a.targetKindHint,
						relayHints: []
					});
					if (!e && p) throw Error("invalid_related_event");
					if (e && await f.save(e.event, y, A, a.sourceEventId), !A()) return null;
				}
				let x = F(a.targetEventId, {
					status: "resolved",
					event: v,
					authorPubkey: v.pubkey,
					relayHints: y,
					errorCode: null,
					updatedAt: Date.now()
				});
				return U(v.pubkey, y), B(g)[a.targetEventId] ?? x;
			} catch {
				return A() ? _ ? B(g)[a.targetEventId] ?? m : F(a.targetEventId, {
					status: "error",
					event: null,
					authorPubkey: m.authorPubkey,
					relayHints: m.relayHints,
					errorCode: "fetch_failed",
					updatedAt: Date.now()
				}) : B(g)[a.targetEventId] ?? null;
			} finally {
				J(a.targetEventId, y) && (C.delete(a.targetEventId), S.delete(a.targetEventId));
			}
		})();
		return S.set(a.targetEventId, N), await N;
	}
	async function X(e, t = {}) {
		return ie(await Y(e, t), e);
	}
	async function ee(n, r) {
		let i = $(r, {
			eventId: n.targetEventId,
			authorHint: n.authorHint ?? null,
			relayHints: n.relayHints ?? []
		});
		if (n.relationKind !== "repost" || !i || !ce(i.event.kind) || !e() || !t()) return null;
		L(n);
		let a = b.get(n.targetEventId), o = B(v)[n.scopeKey], s = t(), c = () => e() && t() === s && a === b.get(n.targetEventId) && a?.has(n.scopeKey) && o === B(v)[n.scopeKey], l = await Y(n, { requireRelayHint: !0 }, { target: i.event });
		if (!c() || l?.status !== "resolved" || !$(l.event, {
			eventId: i.event.id,
			authorHint: i.event.pubkey,
			relayHints: []
		})) return null;
		let u = await R(i.event.pubkey, i.event.id);
		return c() ? u ? F(i.event.id, {
			status: "deleted",
			event: null,
			authorPubkey: i.event.pubkey,
			errorCode: null,
			updatedAt: Date.now()
		}) : l : null;
	}
	async function Z(e, t = {}) {
		return await Promise.all(e.map((e) => X(e, t)));
	}
	async function te(e, t = {}) {
		return await X(e, {
			...t,
			force: !0
		});
	}
	function ie(e, t) {
		return !t || !e?.event || !p && !D.has(e.event) ? e : !Q(e.event, {
			eventId: e.targetEventId,
			authorHint: t.authorHint ?? null,
			authorHints: t.authorHints,
			targetKindHint: t.targetKindHint,
			relayHints: []
		}) || t.excludedKinds?.includes(e.event.kind) ? {
			...e,
			status: "error",
			event: null,
			errorCode: "invalid_event"
		} : e;
	}
	function ae(e, t) {
		return ie(B(g)[e] ?? null, t);
	}
	function oe(e) {
		return B(_)[e] ?? 0;
	}
	function fe(e) {
		let t = y.get(e);
		if (t) for (let n of t) {
			let t = b.get(n);
			if (t && (t.delete(e), !(t.size > 0))) {
				b.delete(n), k.delete(n), O?.local.cancel(n), O?.fetch.cancel(n), O?.deletion.cancel(n), E.delete(n), C.get(n)?.cancel(), C.delete(n);
				for (let e of w.keys()) e.endsWith(`:${n}`) && (T.get(e)?.cancel(), T.delete(e), w.delete(e));
				S.delete(n);
			}
		}
		y.delete(e), x(v, {
			...B(v),
			[e]: (B(v)[e] ?? 0) + 1
		}, !0), M(e);
	}
	function pe() {
		O?.local.reset(), O?.fetch.reset(), O?.deletion.reset(), k.clear(), C.forEach((e) => e.cancel()), T.forEach((e) => e.cancel()), C.clear(), T.clear(), S.clear(), w.clear(), y.clear(), b.clear(), h && m.reset(), E.clear(), x(g, {}), x(_, {}, !0), x(v, {}, !0);
	}
	return {
		ensureTarget: X,
		prepareLocalTargets: V,
		prepareRepostTarget: ee,
		ensureTargets: Z,
		retryTarget: te,
		getTargetSnapshot: ae,
		getScopeRevision: oe,
		invalidateScope: fe,
		reset: pe
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostRepostMenuItem.svelte
var $t = R("<div class=\"repost-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), en = {
	hash: "svelte-1s9x7c7",
	code: ".repost-icon {mask-image:var(--ehagaki-icon-7265706f73742e737667);}"
};
function tn(e, t) {
	r(t, !0), N(e, en);
	let n = () => V(Z, "$_", i), [i, o] = I(), u = z(t, "pending", 3, !1);
	var d = l(), f = O(d);
	m(f, () => Ke, (e, r) => {
		r(e, {
			class: "menu-action-button",
			get disabled() {
				return u();
			},
			get onSelect() {
				return t.onSelect;
			},
			children: (e, t) => {
				var r = $t(), i = F(O(r), 2), a = L(i, !0);
				T((e) => c(a, e), [() => n()(u() ? "repost.sending" : "repost.action")]), s(e, r);
			},
			$$slots: { default: !0 }
		});
	}), s(e, d), a(), o();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostRepostFeedback.svelte
var nn = R("<div class=\"repost-save-feedback svelte-rif0a0\" role=\"status\"><span> </span> <!></div>"), rn = R("<div class=\"repost-message svelte-rif0a0\"> </div>"), an = R("<!> <!>", 1), on = {
	hash: "svelte-rif0a0",
	code: ".repost-message.svelte-rif0a0 {white-space:normal;overflow-wrap:anywhere;}.repost-save-feedback.svelte-rif0a0 {display:flex;flex:0 0 auto;flex-wrap:wrap;align-items:center;gap:8px;min-width:0;width:100%;padding:8px 12px;box-sizing:border-box;}.repost-save-feedback.svelte-rif0a0 .repost-retry-save {height:auto;min-height:44px;padding:8px 12px;}"
};
function sn(e, n) {
	r(n, !0), N(e, on);
	let i = () => V(Z, "$_", o), [o, l] = I(), u = z(n, "saveFailure", 3, null), d = z(n, "pending", 3, !1), m = z(n, "anchor", 3, null), h = z(n, "anchorRightOffset", 3, 0), g = W(!1), v = W(!1), b = W(null), S = _(() => u() ?? (n.result?.retryInput ? n.result : null));
	P(() => {
		if (x(g, d() || !!n.result && n.result !== B(b) && n.result.error !== "repost_stale", !0), d() || !n.result || n.result.retryInput) return;
		let e = setTimeout(() => {
			x(g, !1);
		}, 4e3);
		return () => clearTimeout(e);
	});
	let C = _(() => d() ? "repost.sending" : n.result?.success ? n.result.historySaved === !1 ? "repost.saveFailed" : "repost.sent" : n.result?.error === "repost_relay_missing" ? "repost.relayMissing" : "repost.failed");
	async function w() {
		if (!B(S) || !n.onRetrySave || B(v)) return;
		let e = B(S);
		x(v, !0);
		try {
			await n.onRetrySave(e) && (x(b, e), n.result === e && x(g, !1));
		} finally {
			x(v, !1);
		}
	}
	var D = an(), k = O(D), A = (e) => {
		var t = nn(), n = E(t), r = L(n, !0), a = F(n, 2);
		{
			let e = _(() => d() || B(v));
			Pe(a, {
				className: "repost-retry-save",
				variant: "default",
				shape: "rounded",
				get disabled() {
					return B(e);
				},
				onClick: () => void w(),
				children: (e, t) => {
					f();
					var n = y();
					T((e) => c(n, e), [() => i()("repost.retrySave")]), s(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		p(t), T((e) => c(r, e), [() => i()("repost.saveFailed")]), s(e, t);
	};
	t(k, (e) => {
		B(S) && B(S) !== B(b) && n.onRetrySave && e(A);
	});
	var j = F(k, 2);
	{
		let e = _(() => B(g) && (d() || !n.result?.retryInput)), t = _(() => m() ? "anchor-bottom-right" : "top-right");
		Me(j, {
			get show() {
				return B(e);
			},
			get variant() {
				return B(t);
			},
			get anchor() {
				return m();
			},
			get anchorRightOffset() {
				return h();
			},
			children: (e, t) => {
				var n = rn(), r = L(n, !0);
				T((e) => c(r, e), [() => i()(B(C))]), s(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	s(e, D), a(), l();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryActionMenu.svelte
var cn = R("<div class=\"more-icon svg-icon\"></div>"), ln = R("<!> <!>", 1), un = R("<div class=\"post-history-menu-timestamp\"> </div> <!>", 1), dn = R("<div class=\"post-history-menu-body\"><!> <!></div>"), fn = R("<button><div class=\"more-icon svg-icon\"></div></button>"), pn = R("<button type=\"button\" aria-haspopup=\"menu\"><div class=\"more-icon svg-icon\"></div></button>"), mn = {
	hash: "svelte-ea4c9b",
	code: ".post-history-menu-trigger {aspect-ratio:1;border-radius:50%;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));background-color:var(\n            --post-history-preview-footer-surface,\n            var(--dialog-bg)\n        );}.post-history-menu-trigger .more-icon {width:22px;height:22px;mask-image:var(--ehagaki-icon-6d6f72655f766572745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);--svg: currentColor;}.post-history-menu-trigger.post-history-heading-menu-trigger {min-height:50px;padding:0;border-radius:0;--btn-bg: var(--dialog-bg);background-color:var(--dialog-bg);color:var(--text-muted);}\n            .post-history-menu-trigger.post-history-heading-menu-trigger\n                .more-icon\n         {width:28px;height:28px;}.post-history-menu-content {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:10px;box-shadow:0 8px 24px rgba(0, 0, 0, 0.16);padding:8px;min-width:180px;z-index:102;outline:none;--post-history-menu-action-hover-bg: light-dark(\n            color-mix(in srgb, var(--dialog-bg), black 6%),\n            color-mix(in srgb, var(--dialog-bg), white 10%)\n        );--post-history-menu-action-hover-color: light-dark(\n            color-mix(in srgb, var(--text), black 6%),\n            color-mix(in srgb, var(--text), white 10%)\n        );--post-history-menu-action-danger-hover-bg: color-mix(\n            in srgb,\n            var(--dialog-bg),\n            var(--danger) 12%\n        );}.post-history-menu-body {display:flex;flex-direction:column;align-items:stretch;gap:2px;}.post-history-menu-timestamp {width:fit-content;margin-inline:auto;color:var(--text-muted);font-size:0.875rem;line-height:1.35;user-select:text;white-space:nowrap;}.post-history-menu-content[data-state=\"open\"] {\n        animation: svelte-ea4c9b-post-history-menu-popover-in 150ms ease-out;}.post-history-menu-content[data-state=\"closed\"] {\n        animation: svelte-ea4c9b-post-history-menu-popover-out 100ms ease-in;}\n\n    @media (prefers-reduced-motion: reduce) {.post-history-menu-content[data-state=\"open\"],\n        .post-history-menu-content[data-state=\"closed\"] {\n            animation: none;}\n    }.post-history-menu-content .post-history-menu-separator {height:1px;margin:4px 0;background:var(--border-hr);}.post-history-menu-content .menu-action-button {display:flex;align-items:center;justify-content:flex-start;gap:10px;width:100%;min-height:44px;padding:10px 12px;border:none;border-radius:6px;background-color:transparent;color:inherit;font:inherit;text-align:start;cursor:pointer;}.post-history-menu-content .menu-action-button-danger {color:var(--danger);--svg: currentColor;}\n            .post-history-menu-content\n                .menu-action-button[data-highlighted]:not([data-disabled])\n         {background-color:var(--post-history-menu-action-hover-bg);color:var(--post-history-menu-action-hover-color);--svg: currentColor;}\n            .post-history-menu-content\n                .menu-action-button-danger[data-highlighted]:not(\n                    [data-disabled]\n                )\n         {background-color:var(--post-history-menu-action-danger-hover-bg);color:var(--danger);--svg: currentColor;}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-history-menu-content\n                    .menu-action-button:hover:not([data-disabled])\n             {background-color:var(--post-history-menu-action-hover-bg);color:var(--post-history-menu-action-hover-color);--svg: currentColor;}\n                .post-history-menu-content\n                    .menu-action-button-danger:hover:not([data-disabled])\n             {background-color:var(--post-history-menu-action-danger-hover-bg);color:var(--danger);--svg: currentColor;}\n    }.post-history-menu-content .menu-action-button[data-disabled] {opacity:0.55;cursor:not-allowed;}.post-history-menu-content .menu-action-button .svg-icon {display:inline-flex;align-items:center;justify-content:center;--icon-size: 20px;}\n\n    @keyframes svelte-ea4c9b-post-history-menu-popover-in {\n        from {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n        to {\n            opacity: 1;\n            translate: 0 0;\n        }\n    }\n\n    @keyframes svelte-ea4c9b-post-history-menu-popover-out {\n        from {\n            opacity: 1;\n            translate: 0 0;\n        }\n        to {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n    }"
};
function hn(u, d) {
	r(d, !0), N(u, mn);
	let v = z(d, "open", 3, !1), b = z(d, "onOpenChange", 3, void 0), C = z(d, "triggerClassName", 3, ""), k = z(d, "align", 3, "start"), A = z(d, "timestamp", 3, void 0), j = z(d, "items", 3, void 0), I = z(d, "tooltipContent", 3, void 0), R = z(d, "enableTooltip", 3, !1), V = z(d, "lazy", 3, !1), H = z(d, "restoreFocusOnClose", 3, !1), K = G().overlayTarget, q = W(!1), J = W(!1), Y = W(!1), X = W(null), ee = _(() => !V() || B(q) || v()), Z = W(null), te = yt(() => B(Z)), ne = _(() => R() && !!I()), re = !1;
	P(() => {
		v() !== re && (re = v(), x(J, v()), v() && x(Y, !1));
	});
	function ie(e) {
		x(J, e, !0), e && x(Y, !1), b()?.(e);
	}
	function ae() {
		return B(Y) && !B(J);
	}
	function Q(e) {
		x(Y, e && !B(J), !0);
	}
	async function oe(e, t) {
		typeof t == "function" && t(e);
		let n = typeof b() == "function";
		x(Y, !1), x(q, !0), await M(), n && (x(J, !0), x(Y, !1), b()(!0)), B(X) && (B(X).focus({ preventScroll: !0 }), n || B(X).click());
	}
	function $(e) {
		e.key === "ArrowDown" && (e.preventDefault(), oe(e));
	}
	var se = l(), ce = O(se), le = (e) => {
		var n = l(), r = O(n);
		m(r, () => Ye, (e, n) => {
			n(e, {
				get open() {
					return B(J);
				},
				onOpenChange: ie,
				children: (e, n) => {
					var r = ln(), i = O(r), a = (e) => {
						var t = l(), n = O(t);
						m(n, () => Ie, (e, t) => {
							t(e, {
								children: (e, t) => {
									var n = l(), r = O(n), i = ae, a = Q;
									m(r, () => Ve, (e, t) => {
										t(e, {
											get open() {
												return i();
											},
											set open(e) {
												a(e);
											},
											delayDuration: 500,
											get disabled() {
												return B(J);
											},
											children: (e, t) => {
												var n = ln(), r = O(n);
												{
													let e = (e, t) => {
														let n = () => (t?.()).props, r = _(() => {
															let { onclick: e, ...t } = n();
															return {
																tooltipOnclick: e,
																restProps: t
															};
														});
														var i = l(), a = O(i);
														{
															let e = _(() => `menu-trigger post-history-menu-trigger ${C()} ${B(J) ? "is-open" : ""}`.trim());
															m(a, () => Xe, (t, n) => {
																n(t, S({
																	get class() {
																		return B(e);
																	},
																	get "aria-label"() {
																		return d.triggerAriaLabel;
																	}
																}, () => B(r).restProps, {
																	onclick: (e) => {
																		typeof B(r).tooltipOnclick == "function" && B(r).tooltipOnclick(e);
																	},
																	get ref() {
																		return B(X);
																	},
																	set ref(e) {
																		x(X, e, !0);
																	},
																	children: (e, t) => {
																		var n = cn();
																		s(e, n);
																	},
																	$$slots: { default: !0 }
																}));
															});
														}
														s(e, i);
													};
													m(r, () => He, (t, n) => {
														n(t, {
															child: e,
															$$slots: { child: !0 }
														});
													});
												}
												var i = F(r, 2);
												m(i, () => Ne, (e, t) => {
													t(e, {
														get to() {
															return K;
														},
														children: (e, t) => {
															var n = l(), r = O(n);
															m(r, () => Fe, (e, t) => {
																t(e, {
																	sideOffset: 8,
																	class: "tooltip-content post-preview-tooltip-content",
																	children: (e, t) => {
																		f();
																		var n = y();
																		T(() => c(n, I())), s(e, n);
																	},
																	$$slots: { default: !0 }
																});
															}), s(e, n);
														},
														$$slots: { default: !0 }
													});
												}), s(e, n);
											},
											$$slots: { default: !0 }
										});
									}), s(e, n);
								},
								$$slots: { default: !0 }
							});
						}), s(e, t);
					}, u = (e) => {
						var t = l(), n = O(t);
						{
							let e = _(() => `menu-trigger post-history-menu-trigger ${C()} ${B(J) ? "is-open" : ""}`.trim());
							m(n, () => Xe, (t, n) => {
								n(t, {
									get class() {
										return B(e);
									},
									get "aria-label"() {
										return d.triggerAriaLabel;
									},
									get ref() {
										return B(X);
									},
									set ref(e) {
										x(X, e, !0);
									},
									children: (e, t) => {
										var n = cn();
										s(e, n);
									},
									$$slots: { default: !0 }
								});
							});
						}
						s(e, t);
					};
					t(i, (e) => {
						R() && I() ? e(a) : e(u, -1);
					});
					var g = F(i, 2);
					m(g, () => Ne, (e, n) => {
						n(e, {
							get to() {
								return K;
							},
							children: (e, n) => {
								var r = l(), i = O(r);
								m(i, () => Je, (e, n) => {
									n(e, {
										side: "bottom",
										get align() {
											return k();
										},
										sideOffset: 8,
										class: "post-history-menu-content",
										trapFocus: !1,
										preventScroll: !1,
										onCloseAutoFocus: (e) => {
											e.preventDefault(), H() && B(X)?.focus({ preventScroll: !0 });
										},
										children: (e, n) => {
											var r = dn(), i = E(r), a = (e) => {
												var t = un(), n = O(t), r = L(n, !0), i = F(n, 2);
												m(i, () => qe, (e, t) => {
													t(e, { class: "post-history-menu-separator" });
												}), T(() => c(r, A())), s(e, t);
											};
											t(i, (e) => {
												A() && e(a);
											});
											var l = F(i, 2);
											o(l, () => j() ?? h), p(r), s(e, r);
										},
										$$slots: { default: !0 }
									});
								}), s(e, r);
							},
							$$slots: { default: !0 }
						});
					}), s(e, r);
				},
				$$slots: { default: !0 }
			});
		}), s(e, n);
	}, ue = (e) => {
		var t = l(), n = O(t);
		m(n, () => Ie, (e, t) => {
			t(e, {
				children: (e, t) => {
					var n = l(), r = O(n), i = ae, a = Q;
					m(r, () => Ve, (e, t) => {
						t(e, {
							get open() {
								return i();
							},
							set open(e) {
								a(e);
							},
							delayDuration: 500,
							get disabled() {
								return B(J);
							},
							children: (e, t) => {
								var n = ln(), r = O(n);
								{
									let e = (e, t) => {
										let n = () => (t?.()).props, r = _(() => {
											let { onclick: e, ...t } = n();
											return {
												tooltipOnclick: e,
												restProps: t
											};
										});
										var i = fn(), a = (e) => void oe(e, B(r).tooltipOnclick);
										U(i, (e) => ({
											type: "button",
											class: e,
											"aria-label": d.triggerAriaLabel,
											"aria-haspopup": "menu",
											"aria-expanded": B(J),
											...B(r).restProps,
											onclick: a,
											onkeydown: $
										}), [() => `menu-trigger post-history-menu-trigger ${C()}`.trim()]), D(i, (e) => x(Z, e), () => B(Z)), s(e, i);
									};
									m(r, () => He, (t, n) => {
										n(t, {
											child: e,
											$$slots: { child: !0 }
										});
									});
								}
								var i = F(r, 2);
								m(i, () => Ne, (e, t) => {
									t(e, {
										get to() {
											return K;
										},
										children: (e, t) => {
											var n = l(), r = O(n);
											m(r, () => Fe, (e, t) => {
												t(e, {
													sideOffset: 8,
													class: "tooltip-content post-preview-tooltip-content",
													children: (e, t) => {
														f();
														var n = y();
														T(() => c(n, I())), s(e, n);
													},
													$$slots: { default: !0 }
												});
											}), s(e, n);
										},
										$$slots: { default: !0 }
									});
								}), s(e, n);
							},
							$$slots: { default: !0 }
						});
					}), s(e, n);
				},
				$$slots: { default: !0 }
			});
		}), s(e, t);
	}, de = (t) => {
		var r = pn();
		D(r, (e) => x(Z, e), () => B(Z)), T((e) => {
			i(r, 1, e), w(r, "aria-label", d.triggerAriaLabel), w(r, "aria-expanded", B(J));
		}, [() => n(`menu-trigger post-history-menu-trigger ${C()}`.trim())]), g("click", r, (e) => void oe(e)), g("keydown", r, $), e("pointerenter", r, function(...e) {
			(B(ne) ? te.onpointerenter : void 0)?.apply(this, e);
		}), g("pointerdown", r, function(...e) {
			(B(ne) ? te.onpointerdown : void 0)?.apply(this, e);
		}), e("focus", r, function(...e) {
			(B(ne) ? te.onfocus : void 0)?.apply(this, e);
		}), s(t, r);
	};
	t(ce, (e) => {
		B(ee) ? e(le) : B(ne) && te.active ? e(ue, 1) : e(de, -1);
	}), s(u, se), a();
}
b([
	"click",
	"keydown",
	"pointerdown"
]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryReactionReadModel.ts
var gn = {
	totalCount: 0,
	groups: []
};
function _n(e) {
	if (!at(e.content)) return;
	let t = ot(e.content);
	if (t) return st(e.tags ?? []).get(t)?.url;
}
function vn(e) {
	let t = e.trim();
	return t ? at(t) ? t : it(t) : "+";
}
function yn(e, t) {
	return e ? e instanceof Map ? e.get(t) ?? null : e[t] ?? null : null;
}
function bn(e) {
	try {
		return xe(Se(e), 9, 4);
	} catch {
		return e.slice(0, 12);
	}
}
function xn(e) {
	return e.profile?.displayName?.trim() || e.profile?.name?.trim() || bn(e.pubkey);
}
async function Sn(e, t = Be) {
	return e ? t.getReactionRecords(e) : [];
}
function Cn(e, t) {
	if (e.length === 0) return gn;
	let n = [], r = /* @__PURE__ */ new Map(), i = 0;
	for (let a of e) {
		if (a.kind !== 7) continue;
		i += 1;
		let e = vn(a.content);
		if (!e) continue;
		let o = {
			eventId: a.eventId,
			pubkey: a.authorPubkey,
			profile: yn(t, a.authorPubkey),
			createdAt: a.createdAt
		}, s = r.get(e), c = _n(a);
		if (s === void 0) {
			r.set(e, n.length), n.push({
				content: e,
				count: 1,
				...c ? { emojiUrl: c } : {},
				reactors: [o]
			});
			continue;
		}
		let l = n[s], u = l.emojiUrl ?? c;
		n[s] = {
			...l,
			count: l.count + 1,
			...u ? { emojiUrl: u } : {},
			reactors: [...l.reactors, o]
		};
	}
	return i === 0 ? gn : {
		totalCount: i,
		groups: n
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryReactionDetails.svelte
var wn = R("<div class=\"favorite-icon svg-icon post-preview-reaction-symbol\" aria-hidden=\"true\"></div>"), Tn = R("<span class=\"post-preview-reaction-emoji-slot post-preview-reaction-emoji-failed\" role=\"img\" tabindex=\"0\"> </span>"), En = R("<img class=\"post-preview-reaction-emoji\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), Dn = R("<span class=\"post-preview-reaction-emoji-placeholder\" aria-hidden=\"true\"></span>"), On = R("<span class=\"post-preview-reaction-emoji-slot\"><!></span>"), kn = R("<span class=\"post-preview-reaction-content\"> </span>"), An = R("<span class=\"post-preview-reaction-count\"> </span>"), jn = R("<span class=\"single-actor-name svelte-j0ansb\"> </span>"), Mn = R("<div class=\"post-preview-reaction-summary svelte-j0ansb\"><!> <!></div> <div class=\"post-preview-reaction-actors svelte-j0ansb\"></div> <!>", 1), Nn = R("<div></div>"), Pn = {
	hash: "svelte-j0ansb",
	code: ".selectable.svelte-j0ansb {font:inherit;text-align:start;max-width:100%;min-width:0;}.has-named-actor.svelte-j0ansb {min-width:0;max-width:100%;}.selectable.svelte-j0ansb .post-preview-reaction-summary:where(.svelte-j0ansb),\n    .selectable.svelte-j0ansb .post-preview-reaction-actors:where(.svelte-j0ansb) {flex-shrink:0;}.single-actor-name.svelte-j0ansb {min-width:0;max-inline-size:16ch;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.actor-selectable.svelte-j0ansb {padding:0;min-height:0;border:0;background:transparent;color:inherit;}.post-preview-reactions-panel {display:flex;flex-wrap:wrap;gap:4px;padding:0 16px;}.post-preview-reaction-chip {display:inline-flex;align-items:center;gap:8px;min-height:32px;padding:4px 8px;border-radius:18px;background:color-mix(in srgb, var(--btn-bg), transparent 40%);color:var(--text);}.post-preview-reaction-summary {display:inline-flex;align-items:center;justify-content:center;gap:4px;row-gap:4px;flex-wrap:wrap;}.post-preview-reaction-content {font-size:20px;line-height:1;}.post-preview-reaction-count {font-size:1rem;line-height:1;color:var(--text-muted);}.post-preview-reaction-emoji-slot {display:inline-grid;margin:0;padding:0;}.post-preview-reaction-emoji,\n    .post-preview-reaction-emoji-placeholder {width:100%;height:100%;}.post-preview-reaction-emoji {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-preview-reaction-emoji-placeholder {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}.post-preview-reaction-emoji-failed {display:inline-grid;place-items:center;overflow:hidden;border-radius:4px;background:rgba(127, 127, 127, 0.18);font-size:0.45em;line-height:1;white-space:nowrap;cursor:help;}.post-preview-reaction-actors {display:inline-flex;flex-wrap:wrap;gap:2px;align-items:center;}.post-preview-reaction-actor {display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:999px;overflow:hidden;flex:0 0 auto;}.post-preview-reaction-avatar,\n    .post-preview-reaction-avatar-image,\n    .post-preview-reaction-avatar-fallback {width:100%;height:100%;}.post-preview-reaction-avatar-image {object-fit:cover;}.post-preview-reaction-symbol {width:18px;height:18px;background-color:rgb(249, 24, 128);mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}"
};
function Fn(e, n) {
	r(n, !0), N(e, Pn);
	let o = z(n, "emojiLoadStateByUrl", 19, () => ({})), f = z(n, "emojiImageMetaByUrl", 19, () => ({})), m = z(n, "showCount", 3, !0), h = z(n, "showSingleCount", 3, !1), g = z(n, "showSingleActorName", 3, !1);
	function y(e) {
		let t = f()[e]?.aspectRatio;
		return `width:${typeof t == "number" && Number.isFinite(t) && t > 0 ? 18 * t : 18}px;height:18px;vertical-align:bottom;`;
	}
	var b = l(), x = O(b), S = (e) => {
		var r = Nn();
		let a;
		u(r, 21, () => n.readModel.groups, (e) => e.content, (e, r) => {
			let i = _(() => B(r).reactors.length === 1 ? B(r).reactors[0] : null);
			var a = l(), f = O(a);
			d(f, () => n.onSelectActor && B(i) ? "button" : "div", !1, (e, a) => {
				U(e, (e, t) => ({
					type: n.onSelectActor && B(i) ? "button" : void 0,
					role: n.onSelectActor && B(i) ? "button" : void 0,
					"data-notification-event": B(i)?.eventId,
					class: "post-preview-reaction-chip",
					title: e,
					"aria-label": t,
					onclick: n.onSelectActor && B(i) ? () => n.onSelectActor?.(B(i).eventId) : void 0,
					[k]: { selectable: !!n.onSelectActor && !!B(i) }
				}), [() => B(i) ? xn(B(i)) : void 0, () => n.onSelectActor && B(i) ? xn(B(i)) : void 0], void 0, void 0, "svelte-j0ansb");
				var f = Mn(), b = O(f), x = E(b), S = (e) => {
					var t = wn();
					s(e, t);
				}, C = _(() => Le(B(r).content)), D = (e) => {
					var n = l(), i = O(n), a = (e) => {
						var t = Tn(), n = L(t, !0);
						T((e) => {
							v(t, e), w(t, "aria-label", B(r).content), w(t, "title", B(r).content), c(n, B(r).content);
						}, [() => y(B(r).emojiUrl)]), s(e, t);
					}, u = (e) => {
						var n = On(), i = E(n), a = (e) => {
							var t = En();
							T(() => {
								w(t, "src", B(r).emojiUrl), w(t, "alt", B(r).content), w(t, "title", B(r).content);
							}), s(e, t);
						}, c = (e) => {
							var t = Dn();
							s(e, t);
						};
						t(i, (e) => {
							o()[B(r).emojiUrl] === "ready" ? e(a) : e(c, -1);
						}), p(n), T((e) => v(n, e), [() => y(B(r).emojiUrl)]), s(e, n);
					};
					t(i, (e) => {
						o()[B(r).emojiUrl] === "failed" ? e(a) : e(u, -1);
					}), s(e, n);
				}, A = (e) => {
					var t = kn(), n = L(t, !0);
					T(() => c(n, B(r).content)), s(e, t);
				};
				t(x, (e) => {
					B(C) ? e(S) : B(r).emojiUrl ? e(D, 1) : e(A, -1);
				});
				var j = F(x, 2), M = (e) => {
					var t = An(), n = L(t, !0);
					T(() => c(n, B(r).count)), s(e, t);
				};
				t(j, (e) => {
					m() && (h() || B(r).count > 1) && e(M);
				}), p(b);
				var N = F(b, 2);
				u(N, 21, () => B(r).reactors, (e) => e.eventId, (e, t) => {
					let r = _(() => xn(B(t)));
					var a = l(), o = O(a);
					d(o, () => n.onSelectActor && !B(i) ? "button" : "span", !1, (e, a) => {
						U(e, () => ({
							type: n.onSelectActor && !B(i) ? "button" : void 0,
							role: n.onSelectActor && !B(i) ? "button" : void 0,
							"data-notification-event": B(t).eventId,
							class: "post-preview-reaction-actor",
							title: B(r),
							"aria-label": B(r),
							onclick: n.onSelectActor && !B(i) ? () => n.onSelectActor?.(B(t).eventId) : void 0,
							[k]: { "actor-selectable": !!n.onSelectActor && !B(i) }
						}), void 0, void 0, void 0, "svelte-j0ansb");
						{
							let e = _(() => B(t).profile?.displayName), n = _(() => B(t).profile?.name), i = _(() => B(t).profile?.picture || "");
							Ze(a, {
								get pubkeyHex() {
									return B(t).pubkey;
								},
								get displayName() {
									return B(e);
								},
								get name() {
									return B(n);
								},
								get src() {
									return B(i);
								},
								get alt() {
									return B(r);
								},
								rootClassName: "post-preview-reaction-avatar",
								imageClassName: "post-preview-reaction-avatar-image",
								fallbackClassName: "post-preview-reaction-avatar-fallback",
								get fallbackAriaLabel() {
									return B(r);
								},
								fallbackDelayMs: 0
							});
						}
					}), s(e, a);
				}), p(N);
				var P = F(N, 2), I = (e) => {
					var t = jn(), n = L(t, !0);
					T((e, r) => {
						w(t, "title", e), c(n, r);
					}, [() => xn(B(i)), () => xn(B(i))]), s(e, t);
				};
				t(P, (e) => {
					B(i) && g() && e(I);
				}), s(a, f);
			}), s(e, a);
		}), p(r), T(() => a = i(r, 1, "post-preview-reactions-panel svelte-j0ansb", null, a, { "has-named-actor": g() })), s(e, r);
	};
	t(x, (e) => {
		n.readModel.totalCount > 0 && e(S);
	}), s(e, b), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRawJsonDialog.svelte
var In = R("<div class=\"xmark-icon svg-icon svelte-10wau4w\"></div>"), Ln = R("<!> <!>", 1), Rn = R("<pre class=\"raw-json-content svelte-10wau4w\"><code> </code></pre>"), zn = R("<!> <!> <!>", 1), Bn = R("<div class=\"raw-json-heading svelte-10wau4w\"><h2 class=\"svelte-10wau4w\"> </h2></div> <!>", 1), Vn = {
	hash: "svelte-10wau4w",
	code: ".xmark-icon.svelte-10wau4w {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-raw-json-dialog .dialog-content {padding:8px;}.post-history-raw-json-dialog--tabs {height:min(80svh, 720px);max-height:calc(100svh - 24px);}.post-history-raw-json-dialog--tabs .dialog-content {flex:1 1 0;min-height:0;max-height:none;overflow:hidden;box-sizing:border-box;align-items:stretch;}.raw-json-heading.svelte-10wau4w {width:100%;flex:0 0 auto;}.raw-json-heading.svelte-10wau4w h2:where(.svelte-10wau4w) {margin:0;font-size:1.1rem;}.raw-json-tabs {display:flex;width:100%;box-sizing:border-box;gap:4px;margin-top:8px;border-bottom:1px solid var(--border-hr);}.raw-json-tabs-root,\n    .raw-json-panel {width:100%;min-width:0;}.raw-json-tabs-root {display:flex;flex:1 1 0;flex-direction:column;min-height:0;overflow:hidden;}.raw-json-panel[data-state=\"active\"] {display:flex;flex:1 1 0;min-height:0;overflow:hidden;}.post-history-raw-json-dialog--tabs .raw-json-content {flex:1 1 0;min-height:0;height:auto;}.raw-json-tabs button {border:0;border-bottom:2px solid transparent;padding:6px 10px;background:transparent;color:var(--text);font:inherit;cursor:pointer;}.raw-json-tabs button[data-state=\"active\"] {border-bottom-color:var(--accent-color);}.raw-json-content.svelte-10wau4w {width:100%;min-width:0;box-sizing:border-box;height:100%;margin:10px 0 0;padding:8px;overflow:auto;border:1px solid var(--border-hr);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--text) 4%);color:var(--text);font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,\n            \"Liberation Mono\", monospace;font-size:0.82rem;line-height:1.45;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere;}.post-history-raw-json-dialog {max-width:min(760px, calc(100% - 10px));}"
};
function Hn(e, n) {
	r(n, !0), N(e, Vn);
	let i = () => V(Z, "$_", o), [o, u] = I(), d = z(n, "open", 15, !1), h = z(n, "resetKey", 3, 0), g = z(n, "loadPayloadEvent", 3, void 0), v = z(n, "observePayloadStatus", 3, void 0), b = z(n, "onOpenChange", 3, void 0), C = W("structure"), D = W(void 0), k, A, j = 0, M = -1, R = _(() => oe(n.rawEvent) && ae(n.rawEvent) ? n.rawEvent : null), U = _(() => g() !== void 0 && B(R) !== null), G = _(() => JSON.stringify(n.rawEvent, null, 2) ?? ""), K = _(() => B(D) ? JSON.stringify(B(D), null, 2) ?? "" : "");
	function q() {
		j += 1, k?.abort(), k = void 0, A?.(), A = void 0, x(C, "structure"), x(D, void 0);
	}
	H(q), P(() => {
		let e = h();
		e !== M && q(), M = e;
	});
	async function J(e) {
		if (x(C, e, !0), e !== "payload" || B(D) !== void 0 || !B(R) || !g()) return;
		let t = new AbortController();
		k?.abort(), k = t;
		let n = ++j, r = B(R).id;
		A?.(), A = v()?.(B(R), (e) => {
			(e === "deleted" || e === "invalid") && d() && B(R)?.id === r && x(D, null);
		});
		try {
			let e = await g()(B(R), t.signal);
			!t.signal.aborted && n === j && x(D, e, !0);
		} catch {
			!t.signal.aborted && n === j && x(D, null);
		} finally {
			n === j && (k = void 0);
		}
	}
	function Y(e) {
		e || (q(), b()?.(!1));
	}
	{
		let n = (e) => {
			var t = l(), n = O(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = _(() => i()("global.close"));
						Pe(e, S(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return B(t);
							},
							children: (e, t) => {
								var n = In();
								T((e) => w(n, "aria-label", e), [() => i()("global.close")]), s(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				m(n, () => $e, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			s(e, t);
		}, r = _(() => i()("postHistory.rawJsonTitle")), a = _(() => i()("postHistory.rawJsonDescription")), o = _(() => B(U) ? "post-history-raw-json-dialog post-history-raw-json-dialog--tabs" : "post-history-raw-json-dialog");
		Qe(e, {
			onOpenChange: Y,
			get title() {
				return B(r);
			},
			get description() {
				return B(a);
			},
			get contentClass() {
				return B(o);
			},
			footerVariant: "close-button",
			initialFocus: "content",
			get open() {
				return d();
			},
			set open(e) {
				d(e);
			},
			footer: n,
			children: (e, n) => {
				var r = Bn(), a = O(r), o = E(a), u = L(o, !0);
				p(a);
				var d = F(a, 2), h = (e) => {
					var t = l(), n = O(t);
					m(n, () => et, (e, t) => {
						t(e, {
							get value() {
								return B(C);
							},
							onValueChange: (e) => void J(e),
							class: "raw-json-tabs-root",
							children: (e, t) => {
								var n = zn(), r = O(n);
								m(r, () => tt, (e, t) => {
									t(e, {
										class: "raw-json-tabs",
										children: (e, t) => {
											var n = Ln(), r = O(n);
											m(r, () => rt, (e, t) => {
												t(e, {
													value: "structure",
													children: (e, t) => {
														f();
														var n = y("Structure");
														s(e, n);
													},
													$$slots: { default: !0 }
												});
											});
											var i = F(r, 2);
											m(i, () => rt, (e, t) => {
												t(e, {
													value: "payload",
													children: (e, t) => {
														f();
														var n = y("Payload");
														s(e, n);
													},
													$$slots: { default: !0 }
												});
											}), s(e, n);
										},
										$$slots: { default: !0 }
									});
								});
								var i = F(r, 2);
								m(i, () => nt, (e, t) => {
									t(e, {
										value: "structure",
										class: "raw-json-panel",
										children: (e, t) => {
											var n = Rn(), r = E(n), i = L(r, !0);
											p(n), T(() => c(i, B(G))), s(e, n);
										},
										$$slots: { default: !0 }
									});
								});
								var a = F(i, 2);
								m(a, () => nt, (e, t) => {
									t(e, {
										value: "payload",
										class: "raw-json-panel",
										children: (e, t) => {
											var n = Rn(), r = E(n), i = L(r, !0);
											p(n), T(() => c(i, B(K))), s(e, n);
										},
										$$slots: { default: !0 }
									});
								}), s(e, n);
							},
							$$slots: { default: !0 }
						});
					}), s(e, t);
				}, g = (e) => {
					var t = Rn(), n = E(t), r = L(n, !0);
					p(t), T(() => c(r, B(G))), s(e, t);
				};
				t(d, (e) => {
					B(U) ? e(h) : e(g, -1);
				}), T((e) => c(u, e), [() => i()("postHistory.rawJsonTitle")]), s(e, r);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	a(), u();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostPreviewToggleButton.svelte
var Un = R("<div><!></div>"), Wn = {
	hash: "svelte-1yd56n0",
	code: ".post-preview-toggle-row.svelte-1yd56n0 {display:flex;&.post-preview-toggle-hidden {visibility:hidden;pointer-events:none;}&.post-preview-toggle-overlay {position:absolute;inset-inline-end:0;inset-block-end:0;z-index:1;padding-inline-start:12px;background:linear-gradient(90deg, transparent, var(--dialog-bg) 18%);}&.post-preview-toggle-flow {position:static;align-self:flex-end;padding:0;background:none;}.ehagaki-app-root & button.post-preview-toggle-button,\n        .ehagaki-app-root & button.post-preview-toggle-button:hover {color:var(--text-muted);font-size:0.875rem;font-weight:normal;min-height:24px;padding:0;background:transparent;}\n\n        @media (hover: hover) and (pointer: fine) {.ehagaki-app-root & button.post-preview-toggle-button:hover {text-decoration:underline;}\n        }}"
};
function Gn(e, t) {
	r(t, !0), N(e, Wn);
	let n = () => V(Z, "$_", o), [o, l] = I(), u = z(t, "visible", 3, !0), d = z(t, "placement", 3, "inline");
	var m = Un();
	let h;
	var g = E(m);
	{
		let e = _(() => !u());
		Pe(g, {
			type: "button",
			class: "post-preview-action-button post-preview-toggle-button",
			get "aria-expanded"() {
				return t.expanded;
			},
			get "aria-controls"() {
				return t.controls;
			},
			get disabled() {
				return B(e);
			},
			get onClick() {
				return t.onToggle;
			},
			children: (e, r) => {
				f();
				var i = y();
				T((e) => c(i, e), [() => t.expanded ? n()("postHistory.collapse") : n()("postHistory.expand")]), s(e, i);
			},
			$$slots: { default: !0 }
		});
	}
	p(m), T(() => h = i(m, 1, "post-preview-toggle-row svelte-1yd56n0", null, h, {
		"post-preview-toggle-overlay": d() === "overlay" && (!t.expanded || !u()),
		"post-preview-toggle-flow": d() === "overlay" && t.expanded && u(),
		"post-preview-toggle-hidden": !u()
	})), s(e, m), a(), l();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryPreviewCollapse.svelte.ts
function Kn({ getShow: e, getSessionOpen: t = e, getPosts: n, getContainer: r, maxLines: i = 5 }) {
	let a = W(A({})), o = W(A({})), s = {}, c = null, l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set(), d = !1, f = null, p = 0;
	function m(e) {
		let t = getComputedStyle(e), n = parseFloat(t.lineHeight);
		if (!n || Number.isNaN(n)) {
			let e = parseFloat(t.fontSize);
			return e && !Number.isNaN(e) ? e * 1.5 : 24;
		}
		return n;
	}
	function h(e, t) {
		return s[t] = e, y(t), { destroy() {
			s[t] === e && delete s[t];
		} };
	}
	function g(e) {
		let t = Object.keys(B(a)), n = Object.keys(e);
		t.length === n.length && t.every((t) => B(a)[t] === e[t]) || x(a, e, !0);
	}
	function _() {
		if (!e()) {
			u.clear(), d = !1, g({});
			return;
		}
		let t = n(), r = u, o = d;
		u = /* @__PURE__ */ new Set(), d = !1;
		let c = {}, l;
		for (let e of t) {
			if (e.forceCollapsible) continue;
			if (!o && !r.has(e.eventId)) {
				let t = B(a)[e.eventId];
				t !== void 0 && (c[e.eventId] = t);
				continue;
			}
			let t = s[e.eventId];
			if (!t) continue;
			l ??= m(t);
			let n = l * i, u = t.scrollHeight;
			c[e.eventId] = u > 0 ? u > n + .5 : e.content.split("\n").length > i;
		}
		g(c);
	}
	function v() {
		if (f) return f;
		let e = ++p, t = M().then(() => {
			e === p && (f = null, _());
		});
		return f = t, t;
	}
	function y(e) {
		return e ? u.add(e) : d = !0, v();
	}
	function b() {
		let e = r();
		typeof ResizeObserver < "u" && e && (c || (c = new ResizeObserver(() => {
			y();
		}), c.observe(e)));
	}
	function S() {
		c?.disconnect(), c = null;
	}
	function w() {
		p++, f = null, S(), s = {};
	}
	function T() {
		w(), g({}), x(o, {}, !0), s = {}, l.clear(), u.clear(), d = !1, S();
	}
	function E(e) {
		return B(o)[e.eventId] ?? !1;
	}
	function D(e) {
		x(o, {
			...B(o),
			[e]: !B(o)[e]
		}, !0);
	}
	function O(e) {
		return e.forceCollapsible === !0 || (B(a)[e.eventId] ?? !1);
	}
	return P(() => {
		t() || C(T);
	}), P(() => {
		if (!e()) return;
		let t = n(), r = /* @__PURE__ */ new Map();
		for (let e of t) {
			let t = {
				content: e.content,
				forceCollapsible: e.forceCollapsible
			}, n = l.get(e.eventId);
			(n?.content !== t.content || n.forceCollapsible !== t.forceCollapsible) && u.add(e.eventId), r.set(e.eventId, t);
		}
		l = r, v();
	}), P(() => {
		if (e() && r()) return b(), () => {
			S();
		};
	}), H(() => {
		S();
	}), {
		suspend: w,
		previewRef: h,
		isPostExpanded: E,
		remeasure: () => y(),
		togglePostExpanded: D,
		shouldCollapsePost: O
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postDeletionService.ts
var qn = [
	1,
	6,
	7,
	16,
	42,
	1111
];
function Jn() {
	return {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	};
}
function Yn(e, t) {
	return !t || e.pubkeyHex !== t || typeof e.deletedAt == "number" ? !1 : qn.includes(e.kind) && typeof e.eventId == "string" && e.eventId.length > 0;
}
function Xn(e, t = Math.floor(Date.now() / 1e3), n) {
	let r = [["e", e.eventId], ["k", String(e.kind)]];
	return n && r.push(["e", n], ["k", "36"]), {
		kind: 5,
		pubkey: e.pubkeyHex,
		content: "",
		tags: r,
		created_at: t
	};
}
function Zn(e, t, n) {
	return K.sanitizeExternalRelayUrls([
		...e.acceptedRelays ?? [],
		...e.fetchedRelays ?? [],
		...e.relayHints ?? [],
		...e.kind === 42 ? e.channelRelayHints ?? [] : [],
		...n?.acceptedRelays ?? [],
		...n?.fetchedRelays ?? [],
		...t
	]);
}
var Qn = new class {
	deps;
	constructor(e = {}) {
		this.deps = {
			authStateStore: e.authStateStore ?? pe,
			keyManager: e.keyManager ?? Te,
			window: e.window ?? (typeof window < "u" ? window : {}),
			console: e.console ?? (globalThis.console === void 0 ? Jn() : globalThis.console),
			seckeySignerFn: e.seckeySignerFn ?? te,
			getNip46SignerForSessionFn: e.getNip46SignerForSessionFn ?? ((e) => we.getSignerForSession(e)),
			getParentClientSignerFn: e.getParentClientSignerFn ?? (() => ye.getSigner()),
			writeRelaysStore: e.writeRelaysStore ?? ge,
			postHistoryDeletionRequestsRepository: e.postHistoryDeletionRequestsRepository ?? Oe,
			eventSenderFactory: e.eventSenderFactory,
			sensitivePayloadRepository: e.sensitivePayloadRepository ?? je,
			fetchPayloadFn: e.fetchPayloadFn ?? ke.fetchEventById.bind(ke),
			saveSensitivePayloadFn: e.saveSensitivePayloadFn ?? je.putCandidate.bind(je),
			now: e.now ?? Date.now,
			storeSignedEventsFn: e.storeSignedEventsFn ?? (() => void 0)
		};
	}
	async requestDeletion(e) {
		let t = this.deps.authStateStore.value, n = t.pubkey || null;
		if (!e.rxNostr) return {
			success: !1,
			error: "nostr_not_ready"
		};
		if (!t.isAuthenticated || !n) return {
			success: !1,
			error: "pubkey_not_found"
		};
		if (me() && K.sanitizeExternalRelayUrls(this.deps.writeRelaysStore.value).length === 0) return {
			success: !1,
			error: "no_write_relays"
		};
		let r = () => _e(this.deps.authStateStore, n);
		if (!Yn(e.post, n)) return {
			success: !1,
			error: "deletion_request_not_allowed"
		};
		let i;
		if (t.type === "nip46") try {
			r(), i = await this.deps.getNip46SignerForSessionFn(n);
			let e = this.deps.authStateStore.value;
			if (!i || !e.isAuthenticated || e.type !== "nip46" || e.pubkey !== n) return {
				success: !1,
				error: "nip46_signer_not_available"
			};
		} catch {
			return this.deps.console.error("post_deletion_nip46_signer_failed", {
				stage: "resolve-signer",
				reason: "unexpected"
			}), {
				success: !1,
				error: "post_error"
			};
		}
		let a = dt({
			authType: t.type,
			pubkey: n,
			window: this.deps.window,
			nip46Signer: i,
			getParentClientSigner: () => this.deps.getParentClientSignerFn(),
			getStoredSecretKey: (e) => this.deps.keyManager.getFromStore() || this.deps.keyManager.loadFromStorage(e),
			createSecretKeySigner: (e) => this.deps.seckeySignerFn(e)
		});
		if (!a.ok) return {
			success: !1,
			error: a.error
		};
		try {
			r();
		} catch {
			return {
				success: !1,
				error: "post_error"
			};
		}
		let o = await this.resolveAssociatedPayload(e.post, e.rxNostr), s = oe(e.post.rawEvent) && !!ie(e.post.rawEvent) && !o, c = Xn(e.post, Math.floor(this.deps.now() / 1e3), o?.id), l;
		try {
			r();
			let e = be(c), t = await a.signEvent(e.signerTemplate);
			r(), l = ve(e.expectedTemplate, t, n), r();
		} catch {
			return this.deps.console.error("post_deletion_sign_failed", {
				stage: "sign-event",
				reason: "unexpected"
			}), {
				success: !1,
				error: "post_error"
			};
		}
		let u = le(l);
		if (!u) return {
			success: !1,
			error: "post_error"
		};
		let d = Zn(e.post, this.deps.writeRelaysStore.value, o), f;
		try {
			r(), f = await this.createEventSender(e.rxNostr).sendEvent(u.event, {
				targetRelays: d,
				includeDefaultWriteRelays: !0
			});
		} catch {
			return this.deps.console.error("post_deletion_send_failed", {
				stage: "publish",
				reason: "unexpected"
			}), {
				success: !1,
				error: "post_error"
			};
		}
		if (!f.success) return f;
		try {
			Promise.resolve(this.deps.storeSignedEventsFn([u], () => this.deps.authStateStore.value === t && t.isAuthenticated)).catch(() => void 0);
		} catch {}
		let p = u.event.id ?? f.eventId;
		if (!p) return {
			success: !1,
			error: "post_error"
		};
		let m = this.deps.now();
		try {
			await this.deps.postHistoryDeletionRequestsRepository.saveLocalDeletion({
				targetEvent: oe(e.post.rawEvent) ? e.post.rawEvent : void 0,
				targetEventIds: c.tags.filter((e) => e[0] === "e").map((e) => e[1]),
				deletionEvent: u.event,
				attestation: u.attestation,
				deletedAt: m,
				relayUrls: d
			});
		} catch {
			this.deps.console.warn("post_history_local_deletion_save_failed", {
				stage: "post-history",
				reason: "unexpected"
			});
		}
		return {
			...f,
			eventId: p,
			deletionEventId: p,
			deletionEvent: u.event,
			deletionEventAttestation: u.attestation,
			deletedAt: m,
			...s ? { sensitivePayloadOmitted: !0 } : {}
		};
	}
	createEventSender(e) {
		return this.deps.eventSenderFactory ? this.deps.eventSenderFactory(e, this.deps.console) : new Ee(e, this.deps.console);
	}
	async resolveAssociatedPayload(e, t) {
		let n = e.rawEvent;
		if (!oe(n)) return;
		let r = ie(n);
		if (!r || n.id !== e.eventId || n.pubkey !== e.pubkeyHex) return;
		let i;
		try {
			[i] = await this.deps.sensitivePayloadRepository.getByIds([r.eventId]);
		} catch {
			return;
		}
		if (i?.deletedAt !== void 0) return;
		if (!i) {
			let a = await re(ne, e.pubkeyHex), o = this.deps.fetchPayloadFn(t, {
				eventId: r.eventId,
				relayHints: K.sanitizeExternalRelayUrls([
					...r.relayHint ? [r.relayHint] : [],
					...e.acceptedRelays ?? [],
					...e.fetchedRelays ?? [],
					...e.relayHints ?? []
				]),
				relayConfig: he.value
			});
			try {
				let t = await o.promise;
				if (!t.event || !fe(n, t.event, r.eventId)) return;
				let s = K.sanitizeExternalRelayUrls(t.relayUrl ? [t.relayUrl] : []);
				try {
					await this.deps.saveSensitivePayloadFn({
						event: t.event,
						fetchedRelays: s,
						localWriteScope: {
							ownerPubkeyHex: e.pubkeyHex,
							expectedRevision: a,
							isActive: () => !0
						}
					});
				} catch {
					this.deps.console.warn("sensitive_payload_cache_save_failed", {
						stage: "deletion",
						reason: "storage"
					});
				}
				if ([i] = await this.deps.sensitivePayloadRepository.getByIds([r.eventId]), i?.deletedAt !== void 0) return;
				if (!i) return {
					id: t.event.id,
					fetchedRelays: s
				};
			} catch {
				return;
			} finally {
				o.cancel();
			}
		}
		let a = i.rawEvent;
		if (fe(n, a, r.eventId)) return {
			id: r.eventId,
			acceptedRelays: i.acceptedRelays,
			fetchedRelays: i.fetchedRelays
		};
	}
}({ storeSignedEventsFn: (e, t) => De.storeSignedEventsBestEffort(e, t) });
// D:/ドキュメント/GitHub/ehagaki/src/lib/postBroadcastService.ts
function $n() {
	return {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	};
}
function er(e) {
	let t = e.rawEvent;
	if (!t || typeof t != "object") return null;
	let n = t;
	return typeof n.id != "string" || typeof n.pubkey != "string" || typeof n.created_at != "number" || typeof n.kind != "number" || !Array.isArray(n.tags) || typeof n.content != "string" || typeof n.sig != "string" ? null : n;
}
var tr = new class {
	deps;
	constructor(e = {}) {
		this.deps = {
			writeRelaysStore: e.writeRelaysStore ?? ge,
			console: e.console ?? (globalThis.console === void 0 ? $n() : globalThis.console)
		};
	}
	async broadcast(e) {
		if (!e.rxNostr || pe.value.type === "npub") return {
			success: !1,
			error: "nostr_not_ready"
		};
		let t = e.rxNostr, n = er(e.post);
		if (!n) return {
			success: !1,
			error: "invalid_event"
		};
		let r = K.sanitizeExternalRelayUrls(this.deps.writeRelaysStore.value);
		return r.length === 0 ? {
			success: !1,
			error: "no_write_relays"
		} : new Ee(t, this.deps.console).sendEvent(n, {
			targetRelays: r,
			includeDefaultWriteRelays: !1
		});
	}
}();
export { Vt as C, _t as D, St as E, mt as O, Gt as S, Nt as T, Lt as _, Kn as a, Wt as b, Fn as c, Sn as d, hn as f, Kt as g, Qt as h, Qn as i, gn as l, tn as m, er as n, Gn as o, sn as p, Yn as r, Hn as s, tr as t, Cn as u, Bt as v, Ht as w, zt as x, Ut as y };
