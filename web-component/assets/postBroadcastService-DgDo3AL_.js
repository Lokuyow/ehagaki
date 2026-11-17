import { A as e, E as t, Et as n, G as r, I as i, K as a, Mt as o, N as s, Nt as c, P as l, Q as u, T as d, Tt as f, V as p, W as m, X as h, Y as g, Z as _, _ as v, a as y, ct as b, dt as x, f as S, ft as C, g as w, gt as T, i as E, it as D, j as O, jt as k, mt as A, nt as j, o as M, pt as N, r as P, rt as F, s as I, st as L, t as ee, ut as R, vt as z, w as B, xt as V, y as H, z as U } from "./index-client-XkLzkVYC.js";
import { n as W, v as te } from "./relayConfigUtils-B4Q_AO1M.js";
import { a as G, s as K, t as q, u as J } from "./postHistoryEventUtils-CP25bUau.js";
import { pt as Y } from "./LoadingPlaceholder-lit91akO.js";
import { n as X, y as ne } from "./ehagakiDb-CqVey46a.js";
import { C as re, D as Z, H as ie, K as ae, U as oe, W as se, at as ce, c as le, ct as ue, it as de, k as Q, m as fe, r as pe, s as me } from "./nip65RelayDirectory-DWdjnt74.js";
import { n as he } from "./postEventBuilder-BlIBIiSK.js";
import { r as ge } from "./authStore.svelte-DWJhnXxr.js";
import { f as _e, m as ve, s as ye } from "./relayStore.svelte-Df3SPXmc.js";
import { $ as be, c as xe, l as Se, nt as Ce, rt as we, s as Te } from "./appUtils-BRia-Jm6.js";
import { i as Ee, n as De, t as Oe, u as ke } from "./signedEventResultValidator-CnvxVz7l.js";
import { n as Ae, u as je } from "./nip46Service-CClbdsGu.js";
import { A as Me, M as Ne, N as Pe, P as Fe, S as Ie, V as Le, c as Re, g as ze, h as Be, i as Ve, j as He, k as Ue, l as We, o as Ge, s as Ke } from "./sensitiveContentPayloadReader-CuX74jfk.js";
import { a as qe, i as Je, n as Ye, r as Xe, t as Ze } from "./menu-trigger-TbDvuZD-.js";
import { t as Qe } from "./DialogWrapper-DOH4rn3S.js";
import { t as $e } from "./dialog-close-erjPpz45.js";
import { i as et, n as tt, r as nt, t as rt } from "./tabs-trigger-E7T0aLuc.js";
import { c as it, d as at, t as ot } from "./customEmoji-DDC4uHz2.js";
import { h as st } from "./mediaNodeUtils-DBvcDde_.js";
import { t as ct } from "./graphemeUtils-D37rBdTG.js";
import { et as lt } from "./App-D7-eoDXE.js";
import { t as ut } from "./postSignerResolver-Caq8jRoo.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPreviewFooter.svelte
var dt = a("<div class=\"post-preview-footer-container svelte-r1d5vb\"><div><div class=\"post-preview-footer-left svelte-r1d5vb\"><span class=\"post-preview-date svelte-r1d5vb\"> </span> <!></div> <div class=\"post-preview-footer-actions svelte-r1d5vb\"><!></div> <div class=\"post-preview-footer-right svelte-r1d5vb\"><!></div></div></div>"), ft = {
	hash: "svelte-r1d5vb",
	code: ".post-preview-footer.svelte-r1d5vb {display:grid;grid-template-columns:minmax(0, 120px) minmax(144px, 1fr) 36px;align-items:stretch;height:36px;--post-history-preview-action-icon-size: 20px;color:var(--btn-post-preview-action);--post-history-preview-footer-surface: var(--dialog-bg);}.post-preview-footer-container.svelte-r1d5vb {container:post-footer / inline-size;width:100%;min-width:0;}\n    @container post-footer (width < 320px) {.post-preview-footer.svelte-r1d5vb:is(.post-preview-footer-compact:where(.svelte-r1d5vb), .post-preview-footer-regular:where(.svelte-r1d5vb)) {height:72px;padding-inline-start:0;grid-template-columns:minmax(0, 1fr) 36px;grid-template-rows:36px 36px;}.post-preview-footer.svelte-r1d5vb .post-preview-footer-left:where(.svelte-r1d5vb) {grid-column:1 / -1;}.post-preview-footer.svelte-r1d5vb .post-preview-footer-actions:where(.svelte-r1d5vb) {grid-column:1;min-width:0;}.post-preview-footer.svelte-r1d5vb .post-preview-footer-right:where(.svelte-r1d5vb) {grid-column:2;}.post-preview-footer.svelte-r1d5vb .post-preview-action-buttons-group {grid-template-columns:minmax(0, 1fr) 36px minmax(0, 1fr);}.post-preview-footer.svelte-r1d5vb .post-preview-reply-action-cell, .post-preview-footer.svelte-r1d5vb .post-preview-reaction-action-cell:has(.reaction-compose-button) {grid-template-columns:36px minmax(0, 36px);}\n    }.post-preview-footer-regular.svelte-r1d5vb {padding-inline-start:1rem;}\n\n    /* React and the count share one cell. Reserve their intrinsic width before shrinking the date. */.post-preview-footer:has(.reaction-compose-button) {grid-template-columns:minmax(0, 120px) minmax(min-content, 1fr) 36px;}.post-preview-action-buttons-group:has(.reaction-compose-button) {grid-template-columns:minmax(72px, 1fr) minmax(36px, 1fr) minmax(72px, 1fr);}.post-preview-footer-compact.svelte-r1d5vb {padding-inline-start:1rem;--post-history-preview-footer-surface: var(\n            --post-history-related-card-bg,\n            var(--dialog-bg)\n        );}.post-preview-footer.is-dimmed.svelte-r1d5vb {opacity:0.65;}.post-preview-footer-left.svelte-r1d5vb,\n    .post-preview-footer-actions.svelte-r1d5vb,\n    .post-preview-footer-right.svelte-r1d5vb {display:flex;align-items:stretch;}.post-preview-footer-left.svelte-r1d5vb {align-items:center;justify-content:flex-start;min-width:0;}.post-preview-footer-actions.svelte-r1d5vb {justify-content:stretch;min-width:0;}.post-preview-footer-right.svelte-r1d5vb {align-items:center;justify-content:flex-end;min-width:0;}.post-preview-date.svelte-r1d5vb {overflow:hidden;color:var(--text-muted);font-size:0.875rem;text-overflow:ellipsis;white-space:nowrap;}.post-preview-footer-regular.svelte-r1d5vb .post-preview-date:where(.svelte-r1d5vb) {font-size:0.9375rem;}.post-preview-footer-replies-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-reply-button-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-footer-reaction-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;max-width:100%;}.post-history-action-button,\n    .post-preview-reactions-button {min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface);background-color:var(--post-history-preview-footer-surface);}.post-preview-action-buttons-group {display:grid;grid-template-columns:minmax(72px, 1fr) repeat(2, minmax(36px, 1fr));align-items:stretch;width:100%;min-width:0;}.post-preview-action-cell {display:flex;align-items:stretch;justify-content:center;min-width:0;}.post-preview-reply-action-cell {display:grid;grid-template-columns:36px 36px;justify-content:center;}.post-preview-reaction-action-cell:has(.reaction-compose-button) {display:grid;grid-template-columns:36px 36px;justify-content:center;}.post-preview-quote-action-cell,\n    .post-preview-reaction-action-cell {justify-content:center;}.post-preview-reaction-action-cell .post-preview-footer-reaction-slot {max-width:100%;}.post-preview-action-button {position:relative;}.post-history-action-button {width:36px;min-width:36px;color:var(--btn-post-preview-action);}.post-history-action-button .svg-icon {--svg: currentColor;}.post-preview-footer :is(.reply-icon, .quote-icon, .reaction-compose-icon).svg-icon {width:var(--post-history-preview-action-icon-size);height:var(--post-history-preview-action-icon-size);}.post-preview-footer .reply-icon.svg-icon {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-preview-footer .quote-icon.svg-icon {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function pt(r, i) {
	n(i, !0), e(r, ft);
	let a = P(i, "density", 3, "regular"), s = P(i, "dimmed", 3, !1), u = P(i, "leftExtras", 3, void 0), h = P(i, "actions", 3, void 0), g = P(i, "trailing", 3, void 0);
	var _ = dt(), v = R(_), y = R(v), b = R(y), x = C(b, !0), S = N(b, 2);
	l(S, () => u() ?? c), o(y);
	var w = N(y, 2), T = R(w);
	l(T, () => h() ?? c), o(w);
	var E = N(w, 2), D = R(E);
	l(D, () => g() ?? c), o(E), o(v), o(_), L((e) => {
		d(v, 1, e, "svelte-r1d5vb"), p(x, i.formattedDate);
	}, [() => t(`post-preview-footer post-preview-footer-${a()} ${s() ? "is-dimmed" : ""}`.trim())]), m(r, _), f();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRelatedEventCard.svelte
var mt = a("<article class=\"post-history-related-card svelte-1g9bqtt\"><!> <div class=\"post-history-related-card-body svelte-1g9bqtt\"><div class=\"post-history-related-author svelte-1g9bqtt\"><!> <span class=\"post-history-related-author-name svelte-1g9bqtt\"> </span></div> <!> <!> <!></div></article>"), ht = {
	hash: "svelte-1g9bqtt",
	code: ".post-history-related-card.svelte-1g9bqtt {display:grid;margin-inline-start:-2px;--post-history-related-card-bg: color-mix(\n            in srgb,\n            var(--dialog-bg),\n            var(--border-hr) 24%\n        );border-inline-start:2px solid\n            color-mix(in srgb, var(--theme), transparent 45%);background:var(--post-history-related-card-bg);color:var(--text);font-size:0.9rem;}.post-history-related-card-body.svelte-1g9bqtt {display:grid;grid-template-columns:minmax(0, 1fr);min-width:0;gap:2px;padding:2px 10px 0 8px;}.post-history-related-card .post-preview-footer {margin-inline:-8px -10px;}.post-history-related-author.svelte-1g9bqtt {display:flex;align-items:center;min-width:0;gap:8px;}.post-history-related-avatar {display:block;width:24px;height:24px;flex:0 0 auto;border-radius:50%;overflow:hidden;}.post-history-related-avatar-image {width:100%;height:100%;object-fit:cover;}.post-history-related-author-name.svelte-1g9bqtt {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.post-history-related-card .post-history-related-content {margin:0;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}"
};
function gt(t, r) {
	n(r, !0), e(t, ht);
	let i = P(r, "profile", 3, null), a = P(r, "media", 3, void 0), s = P(r, "model", 3, void 0), u = P(r, "loadSensitiveBody", 3, void 0), d = P(r, "emojiLoadStateByUrl", 19, () => ({})), h = P(r, "emojiImageMetaByUrl", 19, () => ({})), g = P(r, "scrollRoot", 3, null), _ = P(r, "maxVisibleImages", 3, void 0), v = P(r, "isTextCollapsed", 3, !1), y = P(r, "previewCollapseAction", 3, void 0), b = P(r, "previewCollapseEventId", 3, void 0), x = P(r, "previewContentId", 3, void 0), S = P(r, "textOverlay", 3, void 0), w = P(r, "onImageOpen", 3, void 0), T = P(r, "topActions", 3, void 0), E = P(r, "footerLeftExtras", 3, void 0), D = P(r, "footerActions", 3, void 0), O = P(r, "footerDetails", 3, void 0), k = P(r, "footerMenu", 3, void 0), A = V(() => i()?.displayName?.trim() || i()?.name?.trim() || be(r.event.pubkey)), M = V(() => s() ?? ze({
		kind: r.event.kind,
		sourceContent: r.event.content,
		tags: r.event.tags,
		media: a()
	})), F = V(() => Ie(r.event.created_at * 1e3));
	var I = mt(), ee = R(I);
	l(ee, () => T() ?? c);
	var z = N(ee, 2), B = R(z), H = R(B);
	{
		let e = V(() => i()?.displayName), t = V(() => i()?.name), n = V(() => i()?.picture);
		lt(H, {
			get pubkeyHex() {
				return r.event.pubkey;
			},
			get displayName() {
				return j(e);
			},
			get name() {
				return j(t);
			},
			get src() {
				return j(n);
			},
			get alt() {
				return j(A);
			},
			get fallbackAriaLabel() {
				return j(A);
			},
			rootClassName: "post-history-related-avatar",
			imageClassName: "post-history-related-avatar-image"
		});
	}
	var U = N(H, 2), W = C(U, !0);
	o(B);
	var te = N(B, 2);
	Be(te, {
		get model() {
			return j(M);
		},
		get loadSensitiveBody() {
			return u();
		},
		get contentWarningEventId() {
			return r.event.id;
		},
		density: "compact",
		contentClass: "post-history-related-content",
		get emojiLoadStateByUrl() {
			return d();
		},
		get emojiImageMetaByUrl() {
			return h();
		},
		get scrollRoot() {
			return g();
		},
		get maxVisibleImages() {
			return _();
		},
		get onImageOpen() {
			return w();
		},
		get isTextCollapsed() {
			return v();
		},
		get previewCollapseAction() {
			return y();
		},
		get previewCollapseEventId() {
			return b();
		},
		get previewContentId() {
			return x();
		},
		get textOverlay() {
			return S();
		}
	});
	var G = N(te, 2);
	pt(G, {
		get formattedDate() {
			return j(F);
		},
		density: "compact",
		get leftExtras() {
			return E();
		},
		get actions() {
			return D();
		},
		get trailing() {
			return k();
		}
	});
	var K = N(G, 2);
	l(K, () => O() ?? c), o(z), o(I), L(() => p(W, j(A))), m(t, I), f();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useLazyTooltipActivation.svelte.ts
var _t = 1e3;
function vt(e) {
	let t = z(!1), n = !1;
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
		let i = n !== null && st() === n;
		T(t, !0), await F();
		let a = e();
		a && a !== n && (r(a), i && st() !== a && a.focus({ preventScroll: !0 }));
	}
	function a(e) {
		j(t) || e.pointerType === "touch" || i(e.currentTarget, (t) => {
			t.dispatchEvent(r(e));
		});
	}
	function o(e) {
		if (j(t)) return;
		n = !0;
		let r = e.currentTarget, i = (r instanceof Node ? r.ownerDocument : null) ?? document, a = () => {
			n = !1, clearTimeout(o), i.removeEventListener("click", a, !0), i.removeEventListener("pointercancel", a, !0);
		}, o = setTimeout(a, _t);
		i.addEventListener("click", a, !0), i.addEventListener("pointercancel", a, !0);
	}
	function s(e) {
		j(t) || n || i(e.currentTarget, (e) => {
			e.focus({ preventScroll: !0 });
		});
	}
	return {
		get active() {
			return j(t);
		},
		onpointerenter: a,
		onpointerdown: o,
		onfocus: s
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostPreviewFooterActionButton.svelte
var yt = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"tooltipContent",
	"children",
	"onClick",
	"ariaLabel"
]), bt = a("<!> <!>", 1);
function xt(e, t) {
	n(t, !0);
	let i = P(t, "onClick", 3, void 0), a = P(t, "ariaLabel", 3, ""), o = E(t, yt), u = te().overlayTarget, d = z(null), h = vt(() => j(d));
	var _ = r(), v = x(_), b = (e) => {
		var n = r(), f = x(n);
		s(f, () => Ue, (e, n) => {
			n(e, {
				children: (e, n) => {
					var f = r(), h = x(f);
					s(h, () => Ne, (e, n) => {
						n(e, {
							delayDuration: 500,
							children: (e, n) => {
								var f = bt(), h = x(f);
								{
									let e = (e, n) => {
										let s = () => (n?.()).props, u = V(() => {
											let { onclick: e, ...t } = s();
											return {
												tooltipOnclick: e,
												restProps: t
											};
										});
										Te(e, y(() => o, () => j(u).restProps, {
											get ariaLabel() {
												return a();
											},
											onClick: (e) => {
												let t = i()?.(e);
												return typeof j(u).tooltipOnclick == "function" && j(u).tooltipOnclick(e), t;
											},
											get ref() {
												return j(d);
											},
											set ref(e) {
												T(d, e, !0);
											},
											children: (e, n) => {
												var i = r(), a = x(i);
												l(a, () => t.children ?? c), m(e, i);
											},
											$$slots: { default: !0 }
										}));
									};
									s(h, () => Me, (t, n) => {
										n(t, {
											child: e,
											$$slots: { child: !0 }
										});
									});
								}
								var _ = N(h, 2);
								s(_, () => Se, (e, n) => {
									n(e, {
										get to() {
											return u;
										},
										children: (e, n) => {
											var i = r(), a = x(i);
											s(a, () => He, (e, n) => {
												n(e, {
													sideOffset: 8,
													class: "tooltip-content post-preview-tooltip-content",
													children: (e, n) => {
														k();
														var r = g();
														L(() => p(r, t.tooltipContent)), m(e, r);
													},
													$$slots: { default: !0 }
												});
											}), m(e, i);
										},
										$$slots: { default: !0 }
									});
								}), m(e, f);
							},
							$$slots: { default: !0 }
						});
					}), m(e, f);
				},
				$$slots: { default: !0 }
			});
		}), m(e, n);
	}, S = (e) => {
		Te(e, y(() => o, {
			get ariaLabel() {
				return a();
			},
			get onClick() {
				return i();
			},
			get onpointerenter() {
				return h.onpointerenter;
			},
			get onpointerdown() {
				return h.onpointerdown;
			},
			get onfocus() {
				return h.onfocus;
			},
			get ref() {
				return j(d);
			},
			set ref(e) {
				T(d, e, !0);
			},
			children: (e, n) => {
				var i = r(), a = x(i);
				l(a, () => t.children ?? c), m(e, i);
			},
			$$slots: { default: !0 }
		}));
	};
	U(v, (e) => {
		h.active ? e(b) : e(S, -1);
	}), m(e, _), f();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostReactionActionButton.svelte
var St = a("<div aria-hidden=\"true\"></div>"), Ct = a("<span class=\"reaction-action-error svelte-kvh7jt\" role=\"alert\"> </span>"), wt = a("<!> <!>", 1), Tt = {
	hash: "svelte-kvh7jt",
	code: ".reaction-compose-icon.svelte-kvh7jt {--svg: currentColor;mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.failed.svelte-kvh7jt {color:var(--danger);}.reaction-action-error.svelte-kvh7jt {position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);}"
};
function Et(t, r) {
	n(r, !0), e(t, Tt);
	let i = () => I(Y, "$_", a), [a, o] = M(), s = z(!1), c = z(!1);
	async function l() {
		if (!j(s)) {
			T(s, !0), T(c, !1);
			try {
				T(c, await r.onReact() === !1);
			} catch {
				T(c, !0);
			} finally {
				T(s, !1);
			}
		}
	}
	var u = wt(), h = x(u);
	{
		let e = V(() => i()("reaction.action")), t = V(() => i()(j(c) ? "reaction.targetFailed" : "reaction.action"));
		xt(h, {
			type: "button",
			className: "post-history-action-button post-preview-action-button reaction-compose-button",
			get ariaLabel() {
				return j(e);
			},
			get tooltipContent() {
				return j(t);
			},
			shape: "circle",
			contentLayout: "icon",
			get disabled() {
				return j(s);
			},
			onClick: l,
			children: (e, t) => {
				var n = St();
				let r;
				L(() => r = d(n, 1, "reaction-compose-icon svg-icon svelte-kvh7jt", null, r, { failed: j(c) })), m(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	var g = N(h, 2), _ = (e) => {
		var t = Ct(), n = C(t, !0);
		L((e) => p(n, e), [() => i()("reaction.targetFailed")]), m(e, t);
	};
	U(g, (e) => {
		j(c) && e(_);
	}), m(t, u), f(), o();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPostActions.svelte
var Dt = a("<div class=\"reply-icon svg-icon\" aria-hidden=\"true\"></div>"), Ot = a("<div class=\"quote-icon svg-icon\" aria-hidden=\"true\"></div>"), kt = a("<div class=\"post-preview-action-buttons-group\"><div class=\"post-preview-action-cell post-preview-reply-action-cell\"><div class=\"post-preview-reply-button-slot\"><!></div> <div class=\"post-preview-footer-replies-slot\"><!></div></div> <div class=\"post-preview-action-cell post-preview-quote-action-cell\"><!></div> <div class=\"post-preview-action-cell post-preview-reaction-action-cell\"><!> <div class=\"post-preview-footer-reaction-slot\"><!></div></div></div>");
function At(e, t) {
	n(t, !0);
	let r = () => I(Y, "$_", i), [i, a] = M(), s = P(t, "onReactionPost", 3, void 0), u = P(t, "onReplyPost", 3, void 0), d = P(t, "onQuotePost", 3, void 0), p = P(t, "replyExtras", 3, void 0), h = P(t, "reactionExtras", 3, void 0);
	var g = kt(), _ = R(g), v = R(_), y = R(v), b = (e) => {
		{
			let n = V(() => r()("replyQuote.reply_label")), i = V(() => r()("replyQuote.reply_label"));
			xt(e, {
				type: "button",
				className: "post-preview-action-button post-history-action-button",
				get ariaLabel() {
					return j(n);
				},
				contentLayout: "icon",
				shape: "circle",
				onClick: () => u()?.(t.post),
				get tooltipContent() {
					return j(i);
				},
				children: (e, t) => {
					var n = Dt();
					m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	};
	U(y, (e) => {
		u() && e(b);
	}), o(v);
	var x = N(v, 2), S = R(x);
	l(S, () => p() ?? c), o(x), o(_);
	var C = N(_, 2), w = R(C), T = (e) => {
		{
			let n = V(() => r()("replyQuote.quote_label")), i = V(() => r()("replyQuote.quote_label"));
			xt(e, {
				type: "button",
				className: "post-preview-action-button post-history-action-button",
				get ariaLabel() {
					return j(n);
				},
				contentLayout: "icon",
				shape: "circle",
				onClick: () => d()?.(t.post),
				get tooltipContent() {
					return j(i);
				},
				children: (e, t) => {
					var n = Ot();
					m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	};
	U(w, (e) => {
		d() && e(T);
	}), o(C);
	var E = N(C, 2), D = R(E), O = (e) => {
		Et(e, { onReact: () => s()(t.post) });
	}, k = V(() => s() && t.post.deletedAt === void 0 && pe(t.post.kind));
	U(D, (e) => {
		j(k) && e(O);
	});
	var A = N(D, 2), F = R(A);
	l(F, () => h() ?? c), o(A), o(E), o(g), m(e, g), f(), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphUtils.ts
var jt = 5, Mt = .5, Nt = 2.5;
function Pt(e, t) {
	return `${e}:${t}`;
}
function Ft(e) {
	return e < 0 ? Math.max(0, jt + e) : e;
}
function It(e) {
	return Math.min(Ft(e) * Mt, Nt);
}
function Lt() {
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
function Rt(e) {
	return G(e.rawEvent, e) ? q(e.rawEvent) : {
		id: e.eventId,
		pubkey: e.pubkeyHex,
		kind: e.kind,
		content: e.content,
		tags: e.tags.map((e) => [...e]),
		created_at: e.createdAt,
		sig: ""
	};
}
function zt(e) {
	let t = {
		id: e.eventId,
		pubkey: e.authorPubkey,
		kind: e.kind,
		content: e.content,
		tags: e.tags.map((e) => [...e]),
		created_at: e.createdAt,
		sig: ""
	};
	return K(e.rawEvent) && e.rawEvent.id === t.id && e.rawEvent.pubkey === t.pubkey && e.rawEvent.kind === t.kind && e.rawEvent.content === t.content && e.rawEvent.created_at === t.created_at && JSON.stringify(e.rawEvent.tags) === JSON.stringify(t.tags) ? q(e.rawEvent) : t;
}
function Bt(e) {
	let t = J(e.event);
	return {
		eventId: e.event.id,
		event: q(e.event),
		authorPubkey: e.event.pubkey,
		rootEventId: t.rootId,
		parentEventId: t.parentId,
		profile: e.profile ?? null,
		relayUrls: [...e.relayUrls ?? []],
		sources: [...e.sources]
	};
}
function Vt(e, t) {
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
function Ht(e, t) {
	return [...e].sort((e, n) => {
		let r = t[e]?.event, i = t[n]?.event;
		return !r || !i ? e.localeCompare(n) : r.created_at === i.created_at ? r.id.localeCompare(i.id) : r.created_at - i.created_at;
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryProfileSync.ts
function Ut(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
function Wt({ getShow: e, getRxNostr: t, profileCache: n = Ke, logger: r = console }) {
	let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = !1, s = (t, n) => {
		if (!o && !t.disposed && i.get(t.pubkey) === t && e() && n && t.lastProfile !== n) {
			t.lastProfile = n;
			for (let e of a) e(t.pubkey, n);
		}
	}, c = (a, l) => {
		if (!e() || a.pending || a.disposed || o) return;
		let u = a.relayHints;
		a.pending = n.getProfile(a.pubkey, {
			rxNostr: t(),
			additionalRelays: u,
			forceRefresh: l,
			allowBackgroundRefresh: !0,
			signal: a.abort.signal
		}).then((e) => {
			s(a, e);
		}).catch((e) => {
			a.abort.signal.aborted || r.error("投稿履歴プロフィールの取得に失敗:", e);
		}).finally(() => {
			i.get(a.pubkey) === a && (a.pending = null, a.refreshQueued && (a.refreshQueued = !1, c(a, !0)));
		});
	}, l = (t, r = []) => {
		if (!e() || !t || o) return null;
		let a = W.sanitizeExternalRelayUrls(r), l = i.get(t);
		if (l) {
			let e = W.mergeRelayConfigs(l.relayHints, a);
			return Ut(l.relayHints, e) || (l.relayHints = e, l.pending ? l.refreshQueued = !0 : c(l, !0)), l.lastProfile;
		}
		let u = {
			pubkey: t,
			relayHints: a,
			lastProfile: null,
			unsubscribe: () => void 0,
			pending: null,
			refreshQueued: !1,
			disposed: !1,
			abort: new AbortController()
		};
		return i.set(t, u), u.unsubscribe = n.subscribe(t, (e) => {
			s(u, e);
		}), c(u, !1), null;
	}, u = (e) => {
		if (o) return () => void 0;
		a.add(e);
		for (let t of i.values()) t.lastProfile && e(t.pubkey, t.lastProfile);
		return () => a.delete(e);
	}, d = () => {
		for (let e of i.values()) e.disposed = !0, e.abort.abort(), e.unsubscribe();
		i.clear();
	};
	return {
		ensureProfile: l,
		subscribe: u,
		reset: d,
		dispose: () => {
			o ||= (d(), a.clear(), !0);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelatedTargetResolver.svelte.ts
var Gt = 8;
function $(e) {
	return W.sanitizeExternalRelayUrls(e, { limit: Gt });
}
function Kt(e, t) {
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
function qt(e) {
	return {
		targetEventId: e.targetEventId,
		status: "loading",
		event: null,
		profile: null,
		authorPubkey: e.authorHint ?? null,
		relayHints: $(e.relayHints ?? []),
		errorCode: null,
		updatedAt: null
	};
}
function Jt({ getShow: e, getRxNostr: t, getRelayConfig: n, postHistoryRepositoryImpl: r = le, contextFetchService: i = Re, deletionRequestsRepositoryImpl: a = Fe, deletionFetchService: o = Ve, profileSyncCoordinator: s = void 0, loadRepostTarget: c = void 0, requireFullVerification: l = !1, getOwner: u = () => void 0, eventRepositoryImpl: d = r === le ? new ce(X) : void 0 }) {
	let f = s ?? Wt({
		getShow: e,
		getRxNostr: t
	}), p = !s, m = z({}), h = z(A({})), g = z(A({})), _ = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), w = 0;
	function E(e) {
		T(h, {
			...j(h),
			[e]: (j(h)[e] ?? 0) + 1
		}, !0);
	}
	function D(e) {
		let t = v.get(e);
		if (t) for (let e of t) E(e);
	}
	function O(e, t) {
		let n = j(m)[e], r = t(n);
		return n && n.status === r.status && n.event === r.event && n.profile === r.profile && n.authorPubkey === r.authorPubkey && n.errorCode === r.errorCode && n.updatedAt === r.updatedAt && fe(n.relayHints, r.relayHints) ? n : (T(m, {
			...j(m),
			[e]: r
		}), D(e), r);
	}
	function k(e, t) {
		return O(e, (n) => {
			let r = n ?? qt({
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
				relayHints: t.relayHints ? $(t.relayHints) : r.relayHints,
				errorCode: t.errorCode === void 0 ? r.errorCode : t.errorCode,
				updatedAt: t.updatedAt === void 0 ? r.updatedAt : t.updatedAt
			};
		});
	}
	function M(e) {
		let t = j(m)[e.targetEventId], n = $([...t?.relayHints ?? [], ...e.relayHints ?? []]), r = t?.authorPubkey ?? e.authorHint ?? null, i = !t || t.authorPubkey !== r || !fe(t.relayHints, n);
		return k(e.targetEventId, {
			authorPubkey: r,
			relayHints: n
		}), i;
	}
	function N(e) {
		let t = _.get(e.scopeKey) ?? /* @__PURE__ */ new Set();
		t.add(e.targetEventId), _.set(e.scopeKey, t);
		let n = v.get(e.targetEventId) ?? /* @__PURE__ */ new Set();
		n.add(e.scopeKey), v.set(e.targetEventId, n), e.scopeKey in j(g) || T(g, {
			...j(g),
			[e.scopeKey]: 0
		}, !0), e.scopeKey in j(h) || T(h, {
			...j(h),
			[e.scopeKey]: 0
		}, !0);
	}
	async function P(e, t) {
		return (await a.getDeletedTargets([{
			targetAuthorPubkey: e,
			targetEventId: t
		}])).get(e)?.has(t) ?? !1;
	}
	function F(e, t) {
		if (e && t) for (let [n, r] of Object.entries(j(m))) r.authorPubkey === e && k(n, { profile: t });
	}
	function I(e, t) {
		F(e, f.ensureProfile(e, t));
	}
	f.subscribe((t, n) => {
		e() && F(t, n);
	});
	async function L(r, i, s = {}) {
		if (!r.pubkey || !r.id) return !1;
		let c = v.get(r.id), l = t(), u = () => e() && t() === l && c === v.get(r.id) && !!c?.size, d = await P(r.pubkey, r.id);
		if (!u()) return !1;
		if (d) return k(r.id, {
			status: "deleted",
			event: null,
			authorPubkey: r.pubkey,
			relayHints: i,
			errorCode: null,
			updatedAt: Date.now()
		}), !0;
		let f = t();
		if (!f) return !1;
		let p = `${r.pubkey}:${r.id}`, m = x.get(p) ?? Promise.resolve().then(async () => {
			try {
				if (!u()) return !1;
				let e = de(X, r.pubkey), t = o.fetchDeletionRequests(f, {
					targets: [{
						event: r,
						relayUrls: i
					}],
					relayHints: i,
					relayConfig: n()
				});
				S.set(p, t);
				let s = await t.promise;
				if (!u()) return !1;
				if (s.events.length > 0) {
					if (await a.upsertValidDeletionRequests({
						targetEvents: [r],
						deletionEvents: s.events,
						fetchedAt: s.fetchedAt
					}), !u()) return !1;
					Pe.archiveAdoptedAuthored([{ event: r }], {
						ownerPubkeyHex: r.pubkey,
						expectedRevision: await e,
						isActive: u
					});
				}
				let c = await P(r.pubkey, r.id);
				return u() ? (c && k(r.id, {
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
				x.get(p) === m && (S.delete(p), x.delete(p));
			}
		});
		return x.set(p, m), !s.background && await m;
	}
	function ee(e, t) {
		return C.get(e) === t;
	}
	async function R(a, o = {}, s) {
		N(a);
		let f = j(m)[a.targetEventId], p = M(a), h = j(m)[a.targetEventId] ?? qt(a), _ = !!o.background && f?.status === "resolved";
		if (l && f?.status === "resolved") {
			if (!Q(f.event, {
				eventId: a.targetEventId,
				authorHint: null,
				relayHints: []
			})) o = {
				...o,
				force: !0
			};
			else if (W(f, a)?.status === "error") return f;
		}
		if ((a.relationKind === "repost" || l) && f?.status === "resolved") {
			let t = ue(f.event)?.event;
			if (t?.id === a.targetEventId && (l || !a.excludedKinds?.includes(t.kind))) {
				let n = j(g)[a.scopeKey], r = await P(t.pubkey, t.id);
				if (!e() || n !== j(g)[a.scopeKey] || !v.get(t.id)?.has(a.scopeKey)) return null;
				if (r) return k(t.id, {
					status: "deleted",
					event: null,
					authorPubkey: t.pubkey,
					errorCode: null,
					updatedAt: Date.now()
				});
			}
		}
		if (!o.force && f && (!o.requireRelayHint || f.relayHints.length > 0)) {
			if (f.status === "resolved" || f.status === "deleted") return a.relationKind === "repost" && f.status === "resolved" && !Z(f.event, {
				eventId: a.targetEventId,
				authorHint: null,
				relayHints: []
			}) ? await R(a, {
				...o,
				force: !0
			}, s) : (f.status === "resolved" && f.authorPubkey && (I(f.authorPubkey, j(m)[a.targetEventId]?.relayHints ?? f.relayHints), a.relationKind === "repost" && !s && f.event && L(f.event, j(m)[a.targetEventId]?.relayHints ?? f.relayHints, { background: !0 })), j(m)[a.targetEventId] ?? f);
			if (f.status === "loading" && !s && y.has(a.targetEventId)) return await y.get(a.targetEventId) ?? j(m)[a.targetEventId] ?? f;
			if (!p && !s && (f.status === "not-found" || f.status === "error")) return j(m)[a.targetEventId] ?? f;
		}
		if (!o.force && !s && y.has(a.targetEventId)) return await y.get(a.targetEventId) ?? j(m)[a.targetEventId] ?? h;
		o.force && (b.get(a.targetEventId)?.cancel(), b.delete(a.targetEventId), y.delete(a.targetEventId));
		let x = ++w;
		C.set(a.targetEventId, x);
		let S = u(), T = t(), E = Le(n()), D = () => e() && ee(a.targetEventId, x) && u() === S && t() === T && Le(n()) === E, O = (async () => {
			try {
				_ || k(a.targetEventId, {
					status: "loading",
					errorCode: null
				});
				let u = await d?.get(a.targetEventId);
				if (!D()) return null;
				if (u && (!o.requireRelayHint || u.relayUrls.length) && Q(u.rawEvent, {
					eventId: a.targetEventId,
					authorHint: l ? null : a.authorHint ?? null,
					authorHints: l ? void 0 : a.authorHints,
					targetKindHint: l ? void 0 : a.targetKindHint,
					relayHints: []
				}) && (l || !a.excludedKinds?.includes(u.rawEvent.kind))) {
					let e = $([...u.relayUrls, ...h.relayHints]);
					if (u.deletedAt !== void 0) return k(a.targetEventId, {
						status: "deleted",
						event: null,
						relayHints: e,
						updatedAt: Date.now()
					});
					if (a.sourceEventId && await d.link(a.sourceEventId, u.id, D), !D()) return null;
					let t = k(a.targetEventId, {
						status: "resolved",
						event: u.rawEvent,
						authorPubkey: u.rawEvent.pubkey,
						relayHints: e,
						errorCode: null,
						updatedAt: Date.now()
					});
					return I(u.rawEvent.pubkey, e), s || L(u.rawEvent, e, { background: !0 }), t;
				}
				let f = s ? {
					event: s.target,
					relayHints: h.relayHints
				} : a.relationKind === "repost" ? await c?.(a) : null;
				if (!D()) return null;
				let p = f && Z(f.event, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: a.relayHints ?? []
				});
				if (p && (!o.requireRelayHint || f.relayHints.length > 0)) {
					let e = $([...f.relayHints, ...h.relayHints]), t = k(a.targetEventId, {
						status: "resolved",
						event: p.event,
						authorPubkey: p.event.pubkey,
						relayHints: e,
						errorCode: null,
						updatedAt: Date.now()
					});
					return I(p.event.pubkey, e), s || L(p.event, e, { background: !0 }), t;
				}
				let g = await r.getByEventId(a.targetEventId);
				if (!D()) return j(m)[a.targetEventId] ?? null;
				let v = l && g ? Q(g.rawEvent, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				}) : null;
				if (g && (!l || v) && (!o.requireRelayHint || [
					...g.relayHints,
					...g.acceptedRelays,
					...g.fetchedRelays ?? []
				].length > 0) && (a.relationKind !== "repost" || Z(g.rawEvent, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				}))) {
					let e = $([
						...h.relayHints,
						...g.relayHints,
						...g.acceptedRelays,
						...g.fetchedRelays ?? []
					]);
					if (typeof g.deletedAt == "number") return k(a.targetEventId, {
						status: "deleted",
						event: null,
						authorPubkey: v?.event.pubkey ?? g.pubkeyHex,
						relayHints: e,
						errorCode: null,
						updatedAt: Date.now()
					});
					let t = v?.event ?? (a.relationKind === "repost" ? Z(g.rawEvent).event : Rt(g)), n = e, r = k(a.targetEventId, {
						status: "resolved",
						event: t,
						authorPubkey: t.pubkey,
						relayHints: n,
						errorCode: null,
						updatedAt: Date.now()
					});
					return I(t.pubkey, n), s || L(t, n, { background: !0 }), j(m)[a.targetEventId] ?? r;
				}
				if (!l && a.authorHint && a.relationKind !== "repost") {
					let e = await L(Kt(a.targetEventId, a.authorHint), h.relayHints);
					if (!D() || e) return j(m)[a.targetEventId] ?? null;
				}
				let y = t();
				if (!y || !e()) return _ ? j(m)[a.targetEventId] ?? h : k(a.targetEventId, {
					status: "error",
					event: null,
					authorPubkey: h.authorPubkey,
					relayHints: h.relayHints,
					errorCode: "nostr_not_ready",
					updatedAt: Date.now()
				});
				let x = (s ? b.get(a.targetEventId) : void 0) ?? i.fetchEventById(y, {
					eventId: a.targetEventId,
					authorHint: a.authorHint,
					relayHints: h.relayHints,
					relayConfig: n()
				});
				b.set(a.targetEventId, x);
				let S = await x.promise;
				if (!D()) return j(m)[a.targetEventId] ?? null;
				if (b.delete(a.targetEventId), !S.event) {
					if (!l && a.authorHint && a.relationKind !== "repost") {
						let e = await L(Kt(a.targetEventId, a.authorHint), h.relayHints);
						if (!D() || e) return j(m)[a.targetEventId] ?? null;
					}
					return _ ? j(m)[a.targetEventId] ?? h : k(a.targetEventId, {
						status: "not-found",
						event: null,
						authorPubkey: h.authorPubkey,
						relayHints: h.relayHints,
						errorCode: null,
						updatedAt: Date.now()
					});
				}
				let C = $([...S.relayUrl ? [S.relayUrl] : [], ...h.relayHints]), w = l ? Q(S.event, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				}) : null;
				if (l && !w) return k(a.targetEventId, {
					status: "error",
					event: null,
					errorCode: "invalid_event",
					updatedAt: Date.now()
				});
				let T = w?.event ?? S.event;
				if (!l && a.excludedKinds?.includes(T.kind)) return k(a.targetEventId, {
					status: "error",
					event: null,
					errorCode: "invalid_event",
					updatedAt: Date.now()
				});
				if (a.relationKind === "repost" && !Z(T, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				})) throw Error("invalid_repost_target");
				let E = C, O = !s && await L(T, E, { background: a.relationKind === "repost" });
				if (!D()) return j(m)[a.targetEventId] ?? null;
				if (O) return T.id !== a.targetEventId && k(a.targetEventId, {
					status: "deleted",
					event: null,
					authorPubkey: T.pubkey,
					relayHints: E,
					errorCode: null,
					updatedAt: Date.now()
				}), j(m)[a.targetEventId] ?? null;
				if (d) {
					let e = Q(T, {
						eventId: a.targetEventId,
						authorHint: l ? null : a.authorHint ?? null,
						authorHints: l ? void 0 : a.authorHints,
						targetKindHint: l ? void 0 : a.targetKindHint,
						relayHints: []
					});
					if (!e && l) throw Error("invalid_related_event");
					if (e && await d.save(e.event, E, D, a.sourceEventId), !D()) return null;
				}
				let A = k(a.targetEventId, {
					status: "resolved",
					event: T,
					authorPubkey: T.pubkey,
					relayHints: E,
					errorCode: null,
					updatedAt: Date.now()
				});
				return I(T.pubkey, E), j(m)[a.targetEventId] ?? A;
			} catch {
				return D() ? _ ? j(m)[a.targetEventId] ?? h : k(a.targetEventId, {
					status: "error",
					event: null,
					authorPubkey: h.authorPubkey,
					relayHints: h.relayHints,
					errorCode: "fetch_failed",
					updatedAt: Date.now()
				}) : j(m)[a.targetEventId] ?? null;
			} finally {
				ee(a.targetEventId, x) && (b.delete(a.targetEventId), y.delete(a.targetEventId));
			}
		})();
		return y.set(a.targetEventId, O), await O;
	}
	async function B(e, t = {}) {
		return W(await R(e, t), e);
	}
	async function V(n, r) {
		let i = Z(r, {
			eventId: n.targetEventId,
			authorHint: n.authorHint ?? null,
			relayHints: n.relayHints ?? []
		});
		if (n.relationKind !== "repost" || !i || !re(i.event.kind) || !e() || !t()) return null;
		N(n);
		let a = v.get(n.targetEventId), o = j(g)[n.scopeKey], s = t(), c = () => e() && t() === s && a === v.get(n.targetEventId) && a?.has(n.scopeKey) && o === j(g)[n.scopeKey], l = await R(n, { requireRelayHint: !0 }, { target: i.event });
		if (!c() || l?.status !== "resolved" || !Z(l.event, {
			eventId: i.event.id,
			authorHint: i.event.pubkey,
			relayHints: []
		})) return null;
		let u = await P(i.event.pubkey, i.event.id);
		return c() ? u ? k(i.event.id, {
			status: "deleted",
			event: null,
			authorPubkey: i.event.pubkey,
			errorCode: null,
			updatedAt: Date.now()
		}) : l : null;
	}
	async function H(e, t = {}) {
		return await Promise.all(e.map((e) => B(e, t)));
	}
	async function U(e, t = {}) {
		return await B(e, {
			...t,
			force: !0
		});
	}
	function W(e, t) {
		return !l || !t || !e?.event ? e : !Q(e.event, {
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
	function te(e, t) {
		return W(j(m)[e] ?? null, t);
	}
	function G(e) {
		return j(h)[e] ?? 0;
	}
	function K(e) {
		let t = _.get(e);
		if (t) for (let n of t) {
			let t = v.get(n);
			if (t && (t.delete(e), !(t.size > 0))) {
				v.delete(n), C.delete(n), b.get(n)?.cancel(), b.delete(n);
				for (let [e, t] of S) e.endsWith(`:${n}`) && (t.cancel(), S.delete(e), x.delete(e));
				y.delete(n);
			}
		}
		_.delete(e), T(g, {
			...j(g),
			[e]: (j(g)[e] ?? 0) + 1
		}, !0), E(e);
	}
	function q() {
		b.forEach((e) => e.cancel()), S.forEach((e) => e.cancel()), b.clear(), S.clear(), y.clear(), x.clear(), _.clear(), v.clear(), p && f.reset(), C.clear(), T(m, {}), T(h, {}, !0), T(g, {}, !0);
	}
	return {
		ensureTarget: B,
		prepareRepostTarget: V,
		ensureTargets: H,
		retryTarget: U,
		getTargetSnapshot: te,
		getScopeRevision: G,
		invalidateScope: K,
		reset: q
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostRepostMenuItem.svelte
var Yt = a("<div class=\"repost-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Xt = {
	hash: "svelte-1s9x7c7",
	code: ".repost-icon {mask-image:var(--ehagaki-icon-7265706f73742e737667);}"
};
function Zt(t, i) {
	n(i, !0), e(t, Xt);
	let a = () => I(Y, "$_", o), [o, c] = M(), l = P(i, "pending", 3, !1);
	var u = r(), d = x(u);
	s(d, () => qe, (e, t) => {
		t(e, {
			class: "menu-action-button",
			get disabled() {
				return l();
			},
			get onSelect() {
				return i.onSelect;
			},
			children: (e, t) => {
				var n = Yt(), r = N(x(n), 2), i = C(r, !0);
				L((e) => p(i, e), [() => a()(l() ? "repost.sending" : "repost.action")]), m(e, n);
			},
			$$slots: { default: !0 }
		});
	}), m(t, u), f(), c();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostRepostFeedback.svelte
var Qt = a("<div class=\"repost-save-feedback svelte-rif0a0\" role=\"status\"><span> </span> <!></div>"), $t = a("<div class=\"repost-message svelte-rif0a0\"> </div>"), en = a("<!> <!>", 1), tn = {
	hash: "svelte-rif0a0",
	code: ".repost-message.svelte-rif0a0 {white-space:normal;overflow-wrap:anywhere;}.repost-save-feedback.svelte-rif0a0 {display:flex;flex:0 0 auto;flex-wrap:wrap;align-items:center;gap:8px;min-width:0;width:100%;padding:8px 12px;box-sizing:border-box;}.repost-save-feedback.svelte-rif0a0 .repost-retry-save {height:auto;min-height:44px;padding:8px 12px;}"
};
function nn(t, r) {
	n(r, !0), e(t, tn);
	let i = () => I(Y, "$_", a), [a, s] = M(), c = P(r, "saveFailure", 3, null), l = P(r, "pending", 3, !1), u = P(r, "anchor", 3, null), d = P(r, "anchorRightOffset", 3, 0), h = z(!1), _ = z(!1), v = z(null), y = V(() => c() ?? (r.result?.retryInput ? r.result : null));
	b(() => {
		if (T(h, l() || !!r.result && r.result !== j(v) && r.result.error !== "repost_stale", !0), l() || !r.result || r.result.retryInput) return;
		let e = setTimeout(() => {
			T(h, !1);
		}, 4e3);
		return () => clearTimeout(e);
	});
	let S = V(() => l() ? "repost.sending" : r.result?.success ? r.result.historySaved === !1 ? "repost.saveFailed" : "repost.sent" : r.result?.error === "repost_relay_missing" ? "repost.relayMissing" : "repost.failed");
	async function w() {
		if (!j(y) || !r.onRetrySave || j(_)) return;
		let e = j(y);
		T(_, !0);
		try {
			await r.onRetrySave(e) && (T(v, e), r.result === e && T(h, !1));
		} finally {
			T(_, !1);
		}
	}
	var E = en(), D = x(E), O = (e) => {
		var t = Qt(), n = R(t), r = C(n, !0), a = N(n, 2);
		{
			let e = V(() => l() || j(_));
			Te(a, {
				className: "repost-retry-save",
				variant: "default",
				shape: "rounded",
				get disabled() {
					return j(e);
				},
				onClick: () => void w(),
				children: (e, t) => {
					k();
					var n = g();
					L((e) => p(n, e), [() => i()("repost.retrySave")]), m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		o(t), L((e) => p(r, e), [() => i()("repost.saveFailed")]), m(e, t);
	};
	U(D, (e) => {
		j(y) && j(y) !== j(v) && r.onRetrySave && e(O);
	});
	var A = N(D, 2);
	{
		let e = V(() => j(h) && (l() || !r.result?.retryInput)), t = V(() => u() ? "anchor-bottom-right" : "top-right");
		xe(A, {
			get show() {
				return j(e);
			},
			get variant() {
				return j(t);
			},
			get anchor() {
				return u();
			},
			get anchorRightOffset() {
				return d();
			},
			children: (e, t) => {
				var n = $t(), r = C(n, !0);
				L((e) => p(r, e), [() => i()(j(S))]), m(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	m(t, E), f(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryActionMenu.svelte
var rn = a("<div class=\"more-icon svg-icon\"></div>"), an = a("<!> <!>", 1), on = a("<div class=\"post-history-menu-timestamp\"> </div> <!>", 1), sn = a("<div class=\"post-history-menu-body\"><!> <!></div>"), cn = a("<button><div class=\"more-icon svg-icon\"></div></button>"), ln = a("<button type=\"button\" aria-haspopup=\"menu\"><div class=\"more-icon svg-icon\"></div></button>"), un = {
	hash: "svelte-ea4c9b",
	code: ".post-history-menu-trigger {aspect-ratio:1;border-radius:50%;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));background-color:var(\n            --post-history-preview-footer-surface,\n            var(--dialog-bg)\n        );}.post-history-menu-trigger .more-icon {width:22px;height:22px;mask-image:var(--ehagaki-icon-6d6f72655f766572745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);--svg: currentColor;}.post-history-menu-trigger.post-history-heading-menu-trigger {min-height:50px;padding:0;border-radius:0;--btn-bg: var(--dialog-bg);background-color:var(--dialog-bg);color:var(--text-muted);}\n            .post-history-menu-trigger.post-history-heading-menu-trigger\n                .more-icon\n         {width:28px;height:28px;}.post-history-menu-content {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:10px;box-shadow:0 8px 24px rgba(0, 0, 0, 0.16);padding:8px;min-width:180px;z-index:102;outline:none;--post-history-menu-action-hover-bg: light-dark(\n            color-mix(in srgb, var(--dialog-bg), black 6%),\n            color-mix(in srgb, var(--dialog-bg), white 10%)\n        );--post-history-menu-action-hover-color: light-dark(\n            color-mix(in srgb, var(--text), black 6%),\n            color-mix(in srgb, var(--text), white 10%)\n        );--post-history-menu-action-danger-hover-bg: color-mix(\n            in srgb,\n            var(--dialog-bg),\n            var(--danger) 12%\n        );}.post-history-menu-body {display:flex;flex-direction:column;align-items:stretch;gap:2px;}.post-history-menu-timestamp {width:fit-content;margin-inline:auto;color:var(--text-muted);font-size:0.875rem;line-height:1.35;user-select:text;white-space:nowrap;}.post-history-menu-content[data-state=\"open\"] {\n        animation: svelte-ea4c9b-post-history-menu-popover-in 150ms ease-out;}.post-history-menu-content[data-state=\"closed\"] {\n        animation: svelte-ea4c9b-post-history-menu-popover-out 100ms ease-in;}\n\n    @media (prefers-reduced-motion: reduce) {.post-history-menu-content[data-state=\"open\"],\n        .post-history-menu-content[data-state=\"closed\"] {\n            animation: none;}\n    }.post-history-menu-content .post-history-menu-separator {height:1px;margin:4px 0;background:var(--border-hr);}.post-history-menu-content .menu-action-button {display:flex;align-items:center;justify-content:flex-start;gap:10px;width:100%;min-height:44px;padding:10px 12px;border:none;border-radius:6px;background-color:transparent;color:inherit;font:inherit;text-align:start;cursor:pointer;}.post-history-menu-content .menu-action-button-danger {color:var(--danger);--svg: currentColor;}\n            .post-history-menu-content\n                .menu-action-button[data-highlighted]:not([data-disabled])\n         {background-color:var(--post-history-menu-action-hover-bg);color:var(--post-history-menu-action-hover-color);--svg: currentColor;}\n            .post-history-menu-content\n                .menu-action-button-danger[data-highlighted]:not(\n                    [data-disabled]\n                )\n         {background-color:var(--post-history-menu-action-danger-hover-bg);color:var(--danger);--svg: currentColor;}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-history-menu-content\n                    .menu-action-button:hover:not([data-disabled])\n             {background-color:var(--post-history-menu-action-hover-bg);color:var(--post-history-menu-action-hover-color);--svg: currentColor;}\n                .post-history-menu-content\n                    .menu-action-button-danger:hover:not([data-disabled])\n             {background-color:var(--post-history-menu-action-danger-hover-bg);color:var(--danger);--svg: currentColor;}\n    }.post-history-menu-content .menu-action-button[data-disabled] {opacity:0.55;cursor:not-allowed;}.post-history-menu-content .menu-action-button .svg-icon {display:inline-flex;align-items:center;justify-content:center;--icon-size: 20px;}\n\n    @keyframes svelte-ea4c9b-post-history-menu-popover-in {\n        from {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n        to {\n            opacity: 1;\n            translate: 0 0;\n        }\n    }\n\n    @keyframes svelte-ea4c9b-post-history-menu-popover-out {\n        from {\n            opacity: 1;\n            translate: 0 0;\n        }\n        to {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n    }"
};
function dn(i, a) {
	n(a, !0), e(i, un);
	let h = P(a, "open", 3, !1), w = P(a, "onOpenChange", 3, void 0), E = P(a, "triggerClassName", 3, ""), D = P(a, "align", 3, "start"), O = P(a, "timestamp", 3, void 0), A = P(a, "items", 3, void 0), M = P(a, "tooltipContent", 3, void 0), I = P(a, "enableTooltip", 3, !1), ee = P(a, "lazy", 3, !1), B = P(a, "restoreFocusOnClose", 3, !1), W = te().overlayTarget, G = z(!1), K = z(!1), q = z(!1), J = z(null), Y = V(() => !ee() || j(G) || h()), X = z(null), ne = vt(() => j(X)), re = V(() => I() && !!M()), Z = !1;
	b(() => {
		h() !== Z && (Z = h(), T(K, h()), h() && T(q, !1));
	});
	function ie(e) {
		T(K, e, !0), e && T(q, !1), w()?.(e);
	}
	function ae() {
		return j(q) && !j(K);
	}
	function oe(e) {
		T(q, e && !j(K), !0);
	}
	async function se(e, t) {
		typeof t == "function" && t(e);
		let n = typeof w() == "function";
		T(q, !1), T(G, !0), await F(), n && (T(K, !0), T(q, !1), w()(!0)), j(J) && (j(J).focus({ preventScroll: !0 }), n || j(J).click());
	}
	function ce(e) {
		e.key === "ArrowDown" && (e.preventDefault(), se(e));
	}
	var le = r(), ue = x(le), de = (e) => {
		var t = r(), n = x(t);
		s(n, () => Xe, (e, t) => {
			t(e, {
				get open() {
					return j(K);
				},
				onOpenChange: ie,
				children: (e, t) => {
					var n = an(), i = x(n), u = (e) => {
						var t = r(), n = x(t);
						s(n, () => Ue, (e, t) => {
							t(e, {
								children: (e, t) => {
									var n = r(), i = x(n), o = ae, c = oe;
									s(i, () => Ne, (e, t) => {
										t(e, {
											get open() {
												return o();
											},
											set open(e) {
												c(e);
											},
											delayDuration: 500,
											get disabled() {
												return j(K);
											},
											children: (e, t) => {
												var n = an(), i = x(n);
												{
													let e = (e, t) => {
														let n = () => (t?.()).props, i = V(() => {
															let { onclick: e, ...t } = n();
															return {
																tooltipOnclick: e,
																restProps: t
															};
														});
														var o = r(), c = x(o);
														{
															let e = V(() => `menu-trigger post-history-menu-trigger ${E()} ${j(K) ? "is-open" : ""}`.trim());
															s(c, () => Ze, (t, n) => {
																n(t, y({
																	get class() {
																		return j(e);
																	},
																	get "aria-label"() {
																		return a.triggerAriaLabel;
																	}
																}, () => j(i).restProps, {
																	onclick: (e) => {
																		typeof j(i).tooltipOnclick == "function" && j(i).tooltipOnclick(e);
																	},
																	get ref() {
																		return j(J);
																	},
																	set ref(e) {
																		T(J, e, !0);
																	},
																	children: (e, t) => {
																		var n = rn();
																		m(e, n);
																	},
																	$$slots: { default: !0 }
																}));
															});
														}
														m(e, o);
													};
													s(i, () => Me, (t, n) => {
														n(t, {
															child: e,
															$$slots: { child: !0 }
														});
													});
												}
												var o = N(i, 2);
												s(o, () => Se, (e, t) => {
													t(e, {
														get to() {
															return W;
														},
														children: (e, t) => {
															var n = r(), i = x(n);
															s(i, () => He, (e, t) => {
																t(e, {
																	sideOffset: 8,
																	class: "tooltip-content post-preview-tooltip-content",
																	children: (e, t) => {
																		k();
																		var n = g();
																		L(() => p(n, M())), m(e, n);
																	},
																	$$slots: { default: !0 }
																});
															}), m(e, n);
														},
														$$slots: { default: !0 }
													});
												}), m(e, n);
											},
											$$slots: { default: !0 }
										});
									}), m(e, n);
								},
								$$slots: { default: !0 }
							});
						}), m(e, t);
					}, d = (e) => {
						var t = r(), n = x(t);
						{
							let e = V(() => `menu-trigger post-history-menu-trigger ${E()} ${j(K) ? "is-open" : ""}`.trim());
							s(n, () => Ze, (t, n) => {
								n(t, {
									get class() {
										return j(e);
									},
									get "aria-label"() {
										return a.triggerAriaLabel;
									},
									get ref() {
										return j(J);
									},
									set ref(e) {
										T(J, e, !0);
									},
									children: (e, t) => {
										var n = rn();
										m(e, n);
									},
									$$slots: { default: !0 }
								});
							});
						}
						m(e, t);
					};
					U(i, (e) => {
						I() && M() ? e(u) : e(d, -1);
					});
					var f = N(i, 2);
					s(f, () => Se, (e, t) => {
						t(e, {
							get to() {
								return W;
							},
							children: (e, t) => {
								var n = r(), i = x(n);
								s(i, () => Ye, (e, t) => {
									t(e, {
										side: "bottom",
										get align() {
											return D();
										},
										sideOffset: 8,
										class: "post-history-menu-content",
										trapFocus: !1,
										preventScroll: !1,
										onCloseAutoFocus: (e) => {
											e.preventDefault(), B() && j(J)?.focus({ preventScroll: !0 });
										},
										children: (e, t) => {
											var n = sn(), r = R(n), i = (e) => {
												var t = on(), n = x(t), r = C(n, !0), i = N(n, 2);
												s(i, () => Je, (e, t) => {
													t(e, { class: "post-history-menu-separator" });
												}), L(() => p(r, O())), m(e, t);
											};
											U(r, (e) => {
												O() && e(i);
											});
											var a = N(r, 2);
											l(a, () => A() ?? c), o(n), m(e, n);
										},
										$$slots: { default: !0 }
									});
								}), m(e, n);
							},
							$$slots: { default: !0 }
						});
					}), m(e, n);
				},
				$$slots: { default: !0 }
			});
		}), m(e, t);
	}, Q = (e) => {
		var t = r(), n = x(t);
		s(n, () => Ue, (e, t) => {
			t(e, {
				children: (e, t) => {
					var n = r(), i = x(n), o = ae, c = oe;
					s(i, () => Ne, (e, t) => {
						t(e, {
							get open() {
								return o();
							},
							set open(e) {
								c(e);
							},
							delayDuration: 500,
							get disabled() {
								return j(K);
							},
							children: (e, t) => {
								var n = an(), i = x(n);
								{
									let e = (e, t) => {
										let n = () => (t?.()).props, r = V(() => {
											let { onclick: e, ...t } = n();
											return {
												tooltipOnclick: e,
												restProps: t
											};
										});
										var i = cn(), o = (e) => void se(e, j(r).tooltipOnclick);
										v(i, (e) => ({
											type: "button",
											class: e,
											"aria-label": a.triggerAriaLabel,
											"aria-haspopup": "menu",
											"aria-expanded": j(K),
											...j(r).restProps,
											onclick: o,
											onkeydown: ce
										}), [() => `menu-trigger post-history-menu-trigger ${E()}`.trim()]), S(i, (e) => T(X, e), () => j(X)), m(e, i);
									};
									s(i, () => Me, (t, n) => {
										n(t, {
											child: e,
											$$slots: { child: !0 }
										});
									});
								}
								var o = N(i, 2);
								s(o, () => Se, (e, t) => {
									t(e, {
										get to() {
											return W;
										},
										children: (e, t) => {
											var n = r(), i = x(n);
											s(i, () => He, (e, t) => {
												t(e, {
													sideOffset: 8,
													class: "tooltip-content post-preview-tooltip-content",
													children: (e, t) => {
														k();
														var n = g();
														L(() => p(n, M())), m(e, n);
													},
													$$slots: { default: !0 }
												});
											}), m(e, n);
										},
										$$slots: { default: !0 }
									});
								}), m(e, n);
							},
							$$slots: { default: !0 }
						});
					}), m(e, n);
				},
				$$slots: { default: !0 }
			});
		}), m(e, t);
	}, fe = (e) => {
		var n = ln();
		S(n, (e) => T(X, e), () => j(X)), L((e) => {
			d(n, 1, e), H(n, "aria-label", a.triggerAriaLabel), H(n, "aria-expanded", j(K));
		}, [() => t(`menu-trigger post-history-menu-trigger ${E()}`.trim())]), _("click", n, (e) => void se(e)), _("keydown", n, ce), u("pointerenter", n, function(...e) {
			(j(re) ? ne.onpointerenter : void 0)?.apply(this, e);
		}), _("pointerdown", n, function(...e) {
			(j(re) ? ne.onpointerdown : void 0)?.apply(this, e);
		}), u("focus", n, function(...e) {
			(j(re) ? ne.onfocus : void 0)?.apply(this, e);
		}), m(e, n);
	};
	U(ue, (e) => {
		j(Y) ? e(de) : j(re) && ne.active ? e(Q, 1) : e(fe, -1);
	}), m(i, le), f();
}
h([
	"click",
	"keydown",
	"pointerdown"
]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryReactionReadModel.ts
var fn = {
	totalCount: 0,
	groups: []
};
function pn(e) {
	if (!it(e.content)) return;
	let t = at(e.content);
	if (t) return ot(e.tags ?? []).get(t)?.url;
}
function mn(e) {
	let t = e.trim();
	return t ? it(t) ? t : ct(t) : "+";
}
function hn(e, t) {
	return e ? e instanceof Map ? e.get(t) ?? null : e[t] ?? null : null;
}
function gn(e) {
	try {
		return we(Ce(e), 9, 4);
	} catch {
		return e.slice(0, 12);
	}
}
function _n(e) {
	return e.profile?.displayName?.trim() || e.profile?.name?.trim() || gn(e.pubkey);
}
async function vn(e, t = Ge) {
	return e ? t.getReactionRecords(e) : [];
}
function yn(e, t) {
	if (e.length === 0) return fn;
	let n = [], r = /* @__PURE__ */ new Map(), i = 0;
	for (let a of e) {
		if (a.kind !== 7) continue;
		i += 1;
		let e = mn(a.content);
		if (!e) continue;
		let o = {
			eventId: a.eventId,
			pubkey: a.authorPubkey,
			profile: hn(t, a.authorPubkey),
			createdAt: a.createdAt
		}, s = r.get(e), c = pn(a);
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
	return i === 0 ? fn : {
		totalCount: i,
		groups: n
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryReactionDetails.svelte
var bn = a("<div class=\"favorite-icon svg-icon post-preview-reaction-symbol\" aria-hidden=\"true\"></div>"), xn = a("<span class=\"post-preview-reaction-emoji-slot post-preview-reaction-emoji-failed\" role=\"img\" tabindex=\"0\"> </span>"), Sn = a("<img class=\"post-preview-reaction-emoji\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), Cn = a("<span class=\"post-preview-reaction-emoji-placeholder\" aria-hidden=\"true\"></span>"), wn = a("<span class=\"post-preview-reaction-emoji-slot\"><!></span>"), Tn = a("<span class=\"post-preview-reaction-content\"> </span>"), En = a("<span class=\"post-preview-reaction-count\"> </span>"), Dn = a("<span class=\"single-actor-name svelte-j0ansb\"> </span>"), On = a("<div class=\"post-preview-reaction-summary svelte-j0ansb\"><!> <!></div> <div class=\"post-preview-reaction-actors svelte-j0ansb\"></div> <!>", 1), kn = a("<div></div>"), An = {
	hash: "svelte-j0ansb",
	code: ".selectable.svelte-j0ansb {font:inherit;text-align:start;max-width:100%;min-width:0;}.has-named-actor.svelte-j0ansb {min-width:0;max-width:100%;}.selectable.svelte-j0ansb .post-preview-reaction-summary:where(.svelte-j0ansb),\n    .selectable.svelte-j0ansb .post-preview-reaction-actors:where(.svelte-j0ansb) {flex-shrink:0;}.single-actor-name.svelte-j0ansb {min-width:0;max-inline-size:16ch;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.actor-selectable.svelte-j0ansb {padding:0;min-height:0;border:0;background:transparent;color:inherit;}.post-preview-reactions-panel {display:flex;flex-wrap:wrap;gap:4px;padding:0 16px;}.post-preview-reaction-chip {display:inline-flex;align-items:center;gap:8px;min-height:32px;padding:4px 8px;border-radius:18px;background:color-mix(in srgb, var(--btn-bg), transparent 40%);color:var(--text);}.post-preview-reaction-summary {display:inline-flex;align-items:center;justify-content:center;gap:4px;row-gap:4px;flex-wrap:wrap;}.post-preview-reaction-content {font-size:20px;line-height:1;}.post-preview-reaction-count {font-size:1rem;line-height:1;color:var(--text-muted);}.post-preview-reaction-emoji-slot {display:inline-grid;margin:0;padding:0;}.post-preview-reaction-emoji,\n    .post-preview-reaction-emoji-placeholder {width:100%;height:100%;}.post-preview-reaction-emoji {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-preview-reaction-emoji-placeholder {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}.post-preview-reaction-emoji-failed {display:inline-grid;place-items:center;overflow:hidden;border-radius:4px;background:rgba(127, 127, 127, 0.18);font-size:0.45em;line-height:1;white-space:nowrap;cursor:help;}.post-preview-reaction-actors {display:inline-flex;flex-wrap:wrap;gap:2px;align-items:center;}.post-preview-reaction-actor {display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:999px;overflow:hidden;flex:0 0 auto;}.post-preview-reaction-avatar,\n    .post-preview-reaction-avatar-image,\n    .post-preview-reaction-avatar-fallback {width:100%;height:100%;}.post-preview-reaction-avatar-image {object-fit:cover;}.post-preview-reaction-symbol {width:18px;height:18px;background-color:rgb(249, 24, 128);mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}"
};
function jn(t, a) {
	n(a, !0), e(t, An);
	let s = P(a, "emojiLoadStateByUrl", 19, () => ({})), c = P(a, "emojiImageMetaByUrl", 19, () => ({})), l = P(a, "showCount", 3, !0), u = P(a, "showSingleActorName", 3, !1);
	function h(e) {
		let t = c()[e]?.aspectRatio;
		return `width:${typeof t == "number" && Number.isFinite(t) && t > 0 ? 18 * t : 18}px;height:18px;vertical-align:bottom;`;
	}
	var g = r(), _ = x(g), y = (e) => {
		var t = kn();
		let n;
		i(t, 21, () => a.readModel.groups, (e) => e.content, (e, t) => {
			let n = V(() => j(t).reactors.length === 1 ? j(t).reactors[0] : null);
			var c = r(), d = x(c);
			O(d, () => a.onSelectActor && j(n) ? "button" : "div", !1, (e, c) => {
				v(e, (e, t) => ({
					type: a.onSelectActor && j(n) ? "button" : void 0,
					role: a.onSelectActor && j(n) ? "button" : void 0,
					"data-notification-event": j(n)?.eventId,
					class: "post-preview-reaction-chip",
					title: e,
					"aria-label": t,
					onclick: a.onSelectActor && j(n) ? () => a.onSelectActor?.(j(n).eventId) : void 0,
					[w]: { selectable: !!a.onSelectActor && !!j(n) }
				}), [() => j(n) ? _n(j(n)) : void 0, () => a.onSelectActor && j(n) ? _n(j(n)) : void 0], void 0, void 0, "svelte-j0ansb");
				var d = On(), f = x(d), g = R(f), _ = (e) => {
					var t = bn();
					m(e, t);
				}, y = V(() => We(j(t).content)), b = (e) => {
					var n = r(), i = x(n), a = (e) => {
						var n = xn(), r = C(n, !0);
						L((e) => {
							B(n, e), H(n, "aria-label", j(t).content), H(n, "title", j(t).content), p(r, j(t).content);
						}, [() => h(j(t).emojiUrl)]), m(e, n);
					}, c = (e) => {
						var n = wn(), r = R(n), i = (e) => {
							var n = Sn();
							L(() => {
								H(n, "src", j(t).emojiUrl), H(n, "alt", j(t).content), H(n, "title", j(t).content);
							}), m(e, n);
						}, a = (e) => {
							var t = Cn();
							m(e, t);
						};
						U(r, (e) => {
							s()[j(t).emojiUrl] === "ready" ? e(i) : e(a, -1);
						}), o(n), L((e) => B(n, e), [() => h(j(t).emojiUrl)]), m(e, n);
					};
					U(i, (e) => {
						s()[j(t).emojiUrl] === "failed" ? e(a) : e(c, -1);
					}), m(e, n);
				}, S = (e) => {
					var n = Tn(), r = C(n, !0);
					L(() => p(r, j(t).content)), m(e, n);
				};
				U(g, (e) => {
					j(y) ? e(_) : j(t).emojiUrl ? e(b, 1) : e(S, -1);
				});
				var T = N(g, 2), E = (e) => {
					var n = En(), r = C(n, !0);
					L(() => p(r, j(t).count)), m(e, n);
				};
				U(T, (e) => {
					l() && e(E);
				}), o(f);
				var D = N(f, 2);
				i(D, 21, () => j(t).reactors, (e) => e.eventId, (e, t) => {
					let i = V(() => _n(j(t)));
					var o = r(), s = x(o);
					O(s, () => a.onSelectActor && !j(n) ? "button" : "span", !1, (e, r) => {
						v(e, () => ({
							type: a.onSelectActor && !j(n) ? "button" : void 0,
							role: a.onSelectActor && !j(n) ? "button" : void 0,
							"data-notification-event": j(t).eventId,
							class: "post-preview-reaction-actor",
							title: j(i),
							"aria-label": j(i),
							onclick: a.onSelectActor && !j(n) ? () => a.onSelectActor?.(j(t).eventId) : void 0,
							[w]: { "actor-selectable": !!a.onSelectActor && !j(n) }
						}), void 0, void 0, void 0, "svelte-j0ansb");
						{
							let e = V(() => j(t).profile?.displayName), n = V(() => j(t).profile?.name), a = V(() => j(t).profile?.picture || "");
							lt(r, {
								get pubkeyHex() {
									return j(t).pubkey;
								},
								get displayName() {
									return j(e);
								},
								get name() {
									return j(n);
								},
								get src() {
									return j(a);
								},
								get alt() {
									return j(i);
								},
								rootClassName: "post-preview-reaction-avatar",
								imageClassName: "post-preview-reaction-avatar-image",
								fallbackClassName: "post-preview-reaction-avatar-fallback",
								get fallbackAriaLabel() {
									return j(i);
								},
								fallbackDelayMs: 0
							});
						}
					}), m(e, o);
				}), o(D);
				var k = N(D, 2), A = (e) => {
					var t = Dn(), r = C(t, !0);
					L((e, n) => {
						H(t, "title", e), p(r, n);
					}, [() => _n(j(n)), () => _n(j(n))]), m(e, t);
				};
				U(k, (e) => {
					j(n) && u() && e(A);
				}), m(c, d);
			}), m(e, c);
		}), o(t), L(() => n = d(t, 1, "post-preview-reactions-panel svelte-j0ansb", null, n, { "has-named-actor": u() })), m(e, t);
	};
	U(_, (e) => {
		a.readModel.totalCount > 0 && e(y);
	}), m(t, g), f();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRawJsonDialog.svelte
var Mn = a("<div class=\"xmark-icon svg-icon svelte-10wau4w\"></div>"), Nn = a("<!> <!>", 1), Pn = a("<pre class=\"raw-json-content svelte-10wau4w\"><code> </code></pre>"), Fn = a("<!> <!> <!>", 1), In = a("<div class=\"raw-json-heading svelte-10wau4w\"><h2 class=\"svelte-10wau4w\"> </h2></div> <!>", 1), Ln = {
	hash: "svelte-10wau4w",
	code: ".xmark-icon.svelte-10wau4w {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-raw-json-dialog .dialog-content {padding:8px;}.post-history-raw-json-dialog--tabs {height:min(80svh, 720px);max-height:calc(100svh - 24px);}.post-history-raw-json-dialog--tabs .dialog-content {flex:1 1 0;min-height:0;max-height:none;overflow:hidden;box-sizing:border-box;align-items:stretch;}.raw-json-heading.svelte-10wau4w {width:100%;flex:0 0 auto;}.raw-json-heading.svelte-10wau4w h2:where(.svelte-10wau4w) {margin:0;font-size:1.1rem;}.raw-json-tabs {display:flex;width:100%;box-sizing:border-box;gap:4px;margin-top:8px;border-bottom:1px solid var(--border-hr);}.raw-json-tabs-root,\n    .raw-json-panel {width:100%;min-width:0;}.raw-json-tabs-root {display:flex;flex:1 1 0;flex-direction:column;min-height:0;overflow:hidden;}.raw-json-panel[data-state=\"active\"] {display:flex;flex:1 1 0;min-height:0;overflow:hidden;}.post-history-raw-json-dialog--tabs .raw-json-content {flex:1 1 0;min-height:0;height:auto;}.raw-json-tabs button {border:0;border-bottom:2px solid transparent;padding:6px 10px;background:transparent;color:var(--text);font:inherit;cursor:pointer;}.raw-json-tabs button[data-state=\"active\"] {border-bottom-color:var(--accent-color);}.raw-json-content.svelte-10wau4w {width:100%;min-width:0;box-sizing:border-box;height:100%;margin:10px 0 0;padding:8px;overflow:auto;border:1px solid var(--border-hr);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--text) 4%);color:var(--text);font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,\n            \"Liberation Mono\", monospace;font-size:0.82rem;line-height:1.45;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere;}.post-history-raw-json-dialog {max-width:min(760px, calc(100% - 10px));}"
};
function Rn(t, i) {
	n(i, !0), e(t, Ln);
	let a = () => I(Y, "$_", c), [c, l] = M(), u = P(i, "open", 15, !1), d = P(i, "resetKey", 3, 0), h = P(i, "loadPayloadEvent", 3, void 0), _ = P(i, "observePayloadStatus", 3, void 0), v = P(i, "onOpenChange", 3, void 0), S = z("structure"), w = z(void 0), E, D, O = 0, A = -1, F = V(() => ae(i.rawEvent) && oe(i.rawEvent) ? i.rawEvent : null), B = V(() => h() !== void 0 && j(F) !== null), W = V(() => JSON.stringify(i.rawEvent, null, 2) ?? ""), te = V(() => j(w) ? JSON.stringify(j(w), null, 2) ?? "" : "");
	function G() {
		O += 1, E?.abort(), E = void 0, D?.(), D = void 0, T(S, "structure"), T(w, void 0);
	}
	ee(G), b(() => {
		let e = d();
		e !== A && G(), A = e;
	});
	async function K(e) {
		if (T(S, e, !0), e !== "payload" || j(w) !== void 0 || !j(F) || !h()) return;
		let t = new AbortController();
		E?.abort(), E = t;
		let n = ++O, r = j(F).id;
		D?.(), D = _()?.(j(F), (e) => {
			(e === "deleted" || e === "invalid") && u() && j(F)?.id === r && T(w, null);
		});
		try {
			let e = await h()(j(F), t.signal);
			!t.signal.aborted && n === O && T(w, e, !0);
		} catch {
			!t.signal.aborted && n === O && T(w, null);
		} finally {
			n === O && (E = void 0);
		}
	}
	function q(e) {
		e || (G(), v()?.(!1));
	}
	{
		let e = (e) => {
			var t = r(), n = x(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = V(() => a()("global.close"));
						Te(e, y(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return j(t);
							},
							children: (e, t) => {
								var n = Mn();
								L((e) => H(n, "aria-label", e), [() => a()("global.close")]), m(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				s(n, () => $e, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			m(e, t);
		}, n = V(() => a()("postHistory.rawJsonTitle")), i = V(() => a()("postHistory.rawJsonDescription")), c = V(() => j(B) ? "post-history-raw-json-dialog post-history-raw-json-dialog--tabs" : "post-history-raw-json-dialog");
		Qe(t, {
			onOpenChange: q,
			get title() {
				return j(n);
			},
			get description() {
				return j(i);
			},
			get contentClass() {
				return j(c);
			},
			footerVariant: "close-button",
			initialFocus: "content",
			get open() {
				return u();
			},
			set open(e) {
				u(e);
			},
			footer: e,
			children: (e, t) => {
				var n = In(), i = x(n), c = R(i), l = C(c, !0);
				o(i);
				var u = N(i, 2), d = (e) => {
					var t = r(), n = x(t);
					s(n, () => et, (e, t) => {
						t(e, {
							get value() {
								return j(S);
							},
							onValueChange: (e) => void K(e),
							class: "raw-json-tabs-root",
							children: (e, t) => {
								var n = Fn(), r = x(n);
								s(r, () => tt, (e, t) => {
									t(e, {
										class: "raw-json-tabs",
										children: (e, t) => {
											var n = Nn(), r = x(n);
											s(r, () => rt, (e, t) => {
												t(e, {
													value: "structure",
													children: (e, t) => {
														k();
														var n = g("Structure");
														m(e, n);
													},
													$$slots: { default: !0 }
												});
											});
											var i = N(r, 2);
											s(i, () => rt, (e, t) => {
												t(e, {
													value: "payload",
													children: (e, t) => {
														k();
														var n = g("Payload");
														m(e, n);
													},
													$$slots: { default: !0 }
												});
											}), m(e, n);
										},
										$$slots: { default: !0 }
									});
								});
								var i = N(r, 2);
								s(i, () => nt, (e, t) => {
									t(e, {
										value: "structure",
										class: "raw-json-panel",
										children: (e, t) => {
											var n = Pn(), r = R(n), i = C(r, !0);
											o(n), L(() => p(i, j(W))), m(e, n);
										},
										$$slots: { default: !0 }
									});
								});
								var a = N(i, 2);
								s(a, () => nt, (e, t) => {
									t(e, {
										value: "payload",
										class: "raw-json-panel",
										children: (e, t) => {
											var n = Pn(), r = R(n), i = C(r, !0);
											o(n), L(() => p(i, j(te))), m(e, n);
										},
										$$slots: { default: !0 }
									});
								}), m(e, n);
							},
							$$slots: { default: !0 }
						});
					}), m(e, t);
				}, f = (e) => {
					var t = Pn(), n = R(t), r = C(n, !0);
					o(t), L(() => p(r, j(W))), m(e, t);
				};
				U(u, (e) => {
					j(B) ? e(d) : e(f, -1);
				}), L((e) => p(l, e), [() => a()("postHistory.rawJsonTitle")]), m(e, n);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	f(), l();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostPreviewToggleButton.svelte
var zn = a("<div><!></div>"), Bn = {
	hash: "svelte-1yd56n0",
	code: ".post-preview-toggle-row.svelte-1yd56n0 {display:flex;&.post-preview-toggle-hidden {visibility:hidden;pointer-events:none;}&.post-preview-toggle-overlay {position:absolute;inset-inline-end:0;inset-block-end:0;z-index:1;padding-inline-start:12px;background:linear-gradient(90deg, transparent, var(--dialog-bg) 18%);}&.post-preview-toggle-flow {position:static;align-self:flex-end;padding:0;background:none;}.ehagaki-app-root & button.post-preview-toggle-button,\n        .ehagaki-app-root & button.post-preview-toggle-button:hover {color:var(--text-muted);font-size:0.875rem;font-weight:normal;min-height:24px;padding:0;background:transparent;}\n\n        @media (hover: hover) and (pointer: fine) {.ehagaki-app-root & button.post-preview-toggle-button:hover {text-decoration:underline;}\n        }}"
};
function Vn(t, r) {
	n(r, !0), e(t, Bn);
	let i = () => I(Y, "$_", a), [a, s] = M(), c = P(r, "visible", 3, !0), l = P(r, "placement", 3, "inline");
	var u = zn();
	let h;
	var _ = R(u);
	{
		let e = V(() => !c());
		Te(_, {
			type: "button",
			class: "post-preview-action-button post-preview-toggle-button",
			get "aria-expanded"() {
				return r.expanded;
			},
			get "aria-controls"() {
				return r.controls;
			},
			get disabled() {
				return j(e);
			},
			get onClick() {
				return r.onToggle;
			},
			children: (e, t) => {
				k();
				var n = g();
				L((e) => p(n, e), [() => r.expanded ? i()("postHistory.collapse") : i()("postHistory.expand")]), m(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	o(u), L(() => h = d(u, 1, "post-preview-toggle-row svelte-1yd56n0", null, h, {
		"post-preview-toggle-overlay": l() === "overlay" && (!r.expanded || !c()),
		"post-preview-toggle-flow": l() === "overlay" && r.expanded && c(),
		"post-preview-toggle-hidden": !c()
	})), m(t, u), f(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryPreviewCollapse.svelte.ts
function Hn({ getShow: e, getSessionOpen: t = e, getPosts: n, getContainer: r, maxLines: i = 5 }) {
	let a = z(A({})), o = z(A({})), s = {}, c = null, l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set(), d = !1, f = null, p = 0;
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
		let t = Object.keys(j(a)), n = Object.keys(e);
		t.length === n.length && t.every((t) => j(a)[t] === e[t]) || T(a, e, !0);
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
				let t = j(a)[e.eventId];
				t !== void 0 && (c[e.eventId] = t);
				continue;
			}
			let t = s[e.eventId];
			if (!t) continue;
			l ??= m(t);
			let n = l * i, u = t.scrollHeight > 0;
			c[e.eventId] = u ? t.scrollHeight > n + .5 : e.content.split("\n").length > i;
		}
		g(c);
	}
	function v() {
		if (f) return f;
		let e = ++p, t = F().then(() => {
			e === p && (f = null, _());
		});
		return f = t, t;
	}
	function y(e) {
		return e ? u.add(e) : d = !0, v();
	}
	function x() {
		let e = r();
		typeof ResizeObserver < "u" && e && (c || (c = new ResizeObserver(() => {
			y();
		}), c.observe(e)));
	}
	function S() {
		c?.disconnect(), c = null;
	}
	function C() {
		p++, f = null, S(), s = {};
	}
	function w() {
		C(), g({}), T(o, {}, !0), s = {}, l.clear(), u.clear(), d = !1, S();
	}
	function E(e) {
		return j(o)[e.eventId] ?? !1;
	}
	function O(e) {
		T(o, {
			...j(o),
			[e]: !j(o)[e]
		}, !0);
	}
	function k(e) {
		return e.forceCollapsible === !0 || (j(a)[e.eventId] ?? !1);
	}
	return b(() => {
		t() || D(w);
	}), b(() => {
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
	}), b(() => {
		if (e() && r()) return x(), () => {
			S();
		};
	}), ee(() => {
		S();
	}), {
		suspend: C,
		previewRef: h,
		isPostExpanded: E,
		remeasure: () => y(),
		togglePostExpanded: O,
		shouldCollapsePost: k
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postDeletionService.ts
var Un = [
	1,
	6,
	7,
	16,
	42,
	1111
];
function Wn() {
	return {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	};
}
function Gn(e, t) {
	return !t || e.pubkeyHex !== t || typeof e.deletedAt == "number" ? !1 : Un.includes(e.kind) && typeof e.eventId == "string" && e.eventId.length > 0;
}
function Kn(e, t = Math.floor(Date.now() / 1e3), n) {
	let r = [["e", e.eventId], ["k", String(e.kind)]];
	return n && r.push(["e", n], ["k", "36"]), {
		kind: 5,
		pubkey: e.pubkeyHex,
		content: "",
		tags: r,
		created_at: t
	};
}
function qn(e, t, n) {
	return W.sanitizeExternalRelayUrls([
		...e.acceptedRelays ?? [],
		...e.fetchedRelays ?? [],
		...e.relayHints ?? [],
		...e.kind === 42 ? e.channelRelayHints ?? [] : [],
		...n?.acceptedRelays ?? [],
		...n?.fetchedRelays ?? [],
		...t
	]);
}
var Jn = new class {
	deps;
	constructor(e = {}) {
		this.deps = {
			authStateStore: e.authStateStore ?? ge,
			keyManager: e.keyManager ?? je,
			window: e.window ?? (typeof window < "u" ? window : {}),
			console: e.console ?? (globalThis.console === void 0 ? Wn() : globalThis.console),
			seckeySignerFn: e.seckeySignerFn ?? ne,
			getNip46SignerForSessionFn: e.getNip46SignerForSessionFn ?? ((e) => Ae.getSignerForSession(e)),
			getParentClientSignerFn: e.getParentClientSignerFn ?? (() => ke.getSigner()),
			writeRelaysStore: e.writeRelaysStore ?? _e,
			postHistoryDeletionRequestsRepository: e.postHistoryDeletionRequestsRepository ?? Fe,
			eventSenderFactory: e.eventSenderFactory,
			sensitivePayloadRepository: e.sensitivePayloadRepository ?? me,
			fetchPayloadFn: e.fetchPayloadFn ?? Re.fetchEventById.bind(Re),
			saveSensitivePayloadFn: e.saveSensitivePayloadFn ?? me.putCandidate.bind(me),
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
		if (ve() && W.sanitizeExternalRelayUrls(this.deps.writeRelaysStore.value).length === 0) return {
			success: !1,
			error: "no_write_relays"
		};
		let r = () => Ee(this.deps.authStateStore, n);
		if (!Gn(e.post, n)) return {
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
		let a = ut({
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
		let o = await this.resolveAssociatedPayload(e.post, e.rxNostr), s = ae(e.post.rawEvent) && !!ie(e.post.rawEvent) && !o, c = Kn(e.post, Math.floor(this.deps.now() / 1e3), o?.id), l;
		try {
			r();
			let e = Oe(c), t = await a.signEvent(e.signerTemplate);
			r(), l = De(e.expectedTemplate, t, n), r();
		} catch {
			return this.deps.console.error("post_deletion_sign_failed", {
				stage: "sign-event",
				reason: "unexpected"
			}), {
				success: !1,
				error: "post_error"
			};
		}
		let u = ue(l);
		if (!u) return {
			success: !1,
			error: "post_error"
		};
		let d = qn(e.post, this.deps.writeRelaysStore.value, o), f;
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
				targetEvent: ae(e.post.rawEvent) ? e.post.rawEvent : void 0,
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
		return this.deps.eventSenderFactory ? this.deps.eventSenderFactory(e, this.deps.console) : new he(e, this.deps.console);
	}
	async resolveAssociatedPayload(e, t) {
		let n = e.rawEvent;
		if (!ae(n)) return;
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
			let a = await de(X, e.pubkeyHex), o = this.deps.fetchPayloadFn(t, {
				eventId: r.eventId,
				relayHints: W.sanitizeExternalRelayUrls([
					...r.relayHint ? [r.relayHint] : [],
					...e.acceptedRelays ?? [],
					...e.fetchedRelays ?? [],
					...e.relayHints ?? []
				]),
				relayConfig: ye.value
			});
			try {
				let t = await o.promise;
				if (!t.event || !se(n, t.event, r.eventId)) return;
				let s = W.sanitizeExternalRelayUrls(t.relayUrl ? [t.relayUrl] : []);
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
		if (se(n, a, r.eventId)) return {
			id: r.eventId,
			acceptedRelays: i.acceptedRelays,
			fetchedRelays: i.fetchedRelays
		};
	}
}({ storeSignedEventsFn: (e, t) => Pe.storeSignedEventsBestEffort(e, t) });
// D:/ドキュメント/GitHub/ehagaki/src/lib/postBroadcastService.ts
function Yn() {
	return {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	};
}
function Xn(e) {
	let t = e.rawEvent;
	if (!t || typeof t != "object") return null;
	let n = t;
	return typeof n.id != "string" || typeof n.pubkey != "string" || typeof n.created_at != "number" || typeof n.kind != "number" || !Array.isArray(n.tags) || typeof n.content != "string" || typeof n.sig != "string" ? null : n;
}
var Zn = new class {
	deps;
	constructor(e = {}) {
		this.deps = {
			writeRelaysStore: e.writeRelaysStore ?? _e,
			console: e.console ?? (globalThis.console === void 0 ? Yn() : globalThis.console)
		};
	}
	async broadcast(e) {
		if (!e.rxNostr) return {
			success: !1,
			error: "nostr_not_ready"
		};
		let t = e.rxNostr, n = Xn(e.post);
		if (!n) return {
			success: !1,
			error: "invalid_event"
		};
		let r = W.sanitizeExternalRelayUrls(this.deps.writeRelaysStore.value);
		return r.length === 0 ? {
			success: !1,
			error: "no_write_relays"
		} : new he(t, this.deps.console).sendEvent(n, {
			targetRelays: r,
			includeDefaultWriteRelays: !1
		});
	}
}();
export { Rt as C, gt as D, xt as E, pt as O, Ht as S, At as T, Pt as _, Hn as a, Vt as b, jn as c, vn as d, dn as f, Wt as g, Jt as h, Jn as i, fn as l, Zt as m, Xn as n, Vn as o, nn as p, Gn as r, Rn as s, Zn as t, yn as u, Lt as v, zt as w, It as x, Bt as y };
