import { At as e, B as t, C as n, F as r, G as i, J as a, M as o, Mt as s, N as c, R as l, T as u, Tt as d, U as f, W as p, X as m, Y as h, _t as g, a as _, bt as v, dt as y, ft as b, g as x, ht as S, i as C, jt as w, k as T, lt as E, nt as D, o as O, ot as k, pt as A, r as j, rt as M, s as N, st as P, t as F, tt as I, ut as L, v as R, w as z, wt as B } from "./index-client-57Odq85c.js";
import { n as V } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { i as H, l as U, n as W } from "./relayConfigUtils-DD5f1UAM.js";
import { a as G, i as K, l as q, o as J, t as ee } from "./postHistoryEventUtils-CUIBkIiy.js";
import { pt as Y } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { c as X } from "./legacyImportMarkers-CZ4J2IrE.js";
import { C as te, D as Z, E as ne, H as re, K as ie, O as ae, Q as oe, S as se, T as ce, U as le, W as ue, a as de, c as fe, ft as pe, i as me, it as he, k as ge, m as _e, n as ve, o as ye, pt as be, s as xe, x as Se } from "./nip65RelayDirectory-TQ_KxYYY.js";
import { i as Ce, n as we, t as Te, u as Ee, v as De } from "./signedEventResultValidator-DEUEqBPK.js";
import { r as Oe } from "./authStore.svelte-BlvJ-J7q.js";
import { f as ke, h as Ae, m as je, p as Me, s as Ne } from "./relayStore.svelte-B2f9GSlJ.js";
import { c as Q, l as Pe, nt as Fe, u as Ie } from "./appUtils-CwuZyofa.js";
import { c as Le, n as Re } from "./nip46Service-DWYw1Qh-.js";
import { p as ze, r as Be } from "./query-BRdCuyDl.js";
import { n as Ve } from "./postEventBuilder-BOs8Hhj8.js";
import { C as He, D as Ue, F as We, G as Ge, H as Ke, I as qe, J as Je, O as Ye, Q as Xe, R as Ze, S as Qe, T as $e, X as et, Y as tt, Z as nt, i as rt, k as it, q as at, w as ot, x as $ } from "./sensitiveContentPayloadReader-dMbMHU25.js";
import { a as st, i as ct, n as lt, r as ut, t as dt } from "./menu-trigger-gY51qJX1.js";
import { t as ft } from "./DialogWrapper-CvCDxqOJ.js";
import { t as pt } from "./dialog-close-BfZcAfRJ.js";
import { i as mt, n as ht, r as gt, t as _t } from "./tabs-trigger-DvPMFgBr.js";
import { c as vt, d as yt, t as bt } from "./customEmoji-BFRq6RB7.js";
import { t as xt } from "./graphemeUtils-D37rBdTG.js";
import { J as St, nt as Ct } from "./App-BWEIk7fu.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPreviewFooter.svelte
var wt = i("<div><div class=\"post-preview-footer-left svelte-r1d5vb\"><span class=\"post-preview-date svelte-r1d5vb\"> </span> <!></div> <div class=\"post-preview-footer-actions svelte-r1d5vb\"><!></div> <div class=\"post-preview-footer-right svelte-r1d5vb\"><!></div></div>"), Tt = {
	hash: "svelte-r1d5vb",
	code: ".post-preview-footer.svelte-r1d5vb {display:grid;grid-template-columns:minmax(0, 120px) minmax(144px, 1fr) 36px;align-items:stretch;height:36px;--post-history-preview-action-icon-size: 20px;color:var(--btn-post-preview-action);--post-history-preview-footer-surface: var(--dialog-bg);}.post-preview-footer-regular.svelte-r1d5vb {padding-inline-start:1rem;}\n\n    /* React and the count share one cell. Reserve their intrinsic width before shrinking the date. */.post-preview-footer:has(.reaction-compose-button) {grid-template-columns:minmax(0, 120px) minmax(min-content, 1fr) 36px;}.post-preview-action-buttons-group:has(.reaction-compose-button) {grid-template-columns:minmax(72px, 1fr) minmax(36px, 1fr) minmax(72px, 1fr);}.post-preview-footer-compact.svelte-r1d5vb {padding-inline-start:1rem;--post-history-preview-footer-surface: var(\n            --post-history-related-card-bg,\n            var(--dialog-bg)\n        );}.post-preview-footer.is-dimmed.svelte-r1d5vb {opacity:0.65;}.post-preview-footer-left.svelte-r1d5vb,\n    .post-preview-footer-actions.svelte-r1d5vb,\n    .post-preview-footer-right.svelte-r1d5vb {display:flex;align-items:stretch;}.post-preview-footer-left.svelte-r1d5vb {align-items:center;justify-content:flex-start;min-width:0;}.post-preview-footer-actions.svelte-r1d5vb {justify-content:stretch;min-width:0;}.post-preview-footer-right.svelte-r1d5vb {align-items:center;justify-content:flex-end;min-width:0;}.post-preview-date.svelte-r1d5vb {overflow:hidden;color:var(--text-muted);font-size:0.875rem;text-overflow:ellipsis;white-space:nowrap;}.post-preview-footer-regular.svelte-r1d5vb .post-preview-date:where(.svelte-r1d5vb) {font-size:0.9375rem;}.post-preview-footer-replies-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-reply-button-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-footer-reaction-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;max-width:100%;}.post-history-action-button,\n    .post-preview-reactions-button {min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface);background-color:var(--post-history-preview-footer-surface);}.post-preview-action-buttons-group {display:grid;grid-template-columns:minmax(72px, 1fr) repeat(2, minmax(36px, 1fr));align-items:stretch;width:100%;min-width:0;}.post-preview-action-cell {display:flex;align-items:stretch;justify-content:center;min-width:0;}.post-preview-reply-action-cell {display:grid;grid-template-columns:36px 36px;justify-content:center;}.post-preview-reaction-action-cell:has(.reaction-compose-button) {display:grid;grid-template-columns:36px 36px;justify-content:center;}.post-preview-quote-action-cell,\n    .post-preview-reaction-action-cell {justify-content:center;}.post-preview-reaction-action-cell .post-preview-footer-reaction-slot {max-width:100%;}.post-preview-action-button {position:relative;}.post-history-action-button {width:36px;min-width:36px;color:var(--btn-post-preview-action);}.post-history-action-button .svg-icon {--svg: currentColor;}.post-preview-footer :is(.reply-icon, .quote-icon, .reaction-compose-icon).svg-icon {width:var(--post-history-preview-action-icon-size);height:var(--post-history-preview-action-icon-size);}.post-preview-footer .reply-icon.svg-icon {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-preview-footer .quote-icon.svg-icon {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function Et(e, n) {
	d(n, !0), T(e, Tt);
	let r = j(n, "density", 3, "regular"), i = j(n, "dimmed", 3, !1), a = j(n, "leftExtras", 3, void 0), o = j(n, "actions", 3, void 0), l = j(n, "trailing", 3, void 0);
	var p = wt(), m = E(p), h = E(m), g = y(h, !0), _ = b(h, 2);
	c(_, () => a() ?? s), w(m);
	var v = b(m, 2), x = E(v);
	c(x, () => o() ?? s), w(v);
	var S = b(v, 2), C = E(S);
	c(C, () => l() ?? s), w(S), w(p), k((e) => {
		z(p, 1, e, "svelte-r1d5vb"), t(g, n.formattedDate);
	}, [() => u(`post-preview-footer post-preview-footer-${r()} ${i() ? "is-dimmed" : ""}`.trim())]), f(e, p), B();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRelatedEventCard.svelte
var Dt = i("<article class=\"post-history-related-card svelte-1g9bqtt\"><!> <div class=\"post-history-related-card-body svelte-1g9bqtt\"><div class=\"post-history-related-author svelte-1g9bqtt\"><!> <span class=\"post-history-related-author-name svelte-1g9bqtt\"> </span></div> <!> <!> <!></div></article>"), Ot = {
	hash: "svelte-1g9bqtt",
	code: ".post-history-related-card.svelte-1g9bqtt {display:grid;margin-inline-start:-2px;--post-history-related-card-bg: color-mix(\n            in srgb,\n            var(--dialog-bg),\n            var(--border-hr) 24%\n        );border-inline-start:2px solid\n            color-mix(in srgb, var(--theme), transparent 45%);background:var(--post-history-related-card-bg);color:var(--text);font-size:0.9rem;}.post-history-related-card-body.svelte-1g9bqtt {display:grid;grid-template-columns:minmax(0, 1fr);min-width:0;gap:2px;padding:2px 10px 0 8px;}.post-history-related-card .post-preview-footer {margin-inline:-8px -10px;}.post-history-related-author.svelte-1g9bqtt {display:flex;align-items:center;min-width:0;gap:8px;}.post-history-related-avatar {display:block;width:24px;height:24px;flex:0 0 auto;border-radius:50%;overflow:hidden;}.post-history-related-avatar-image {width:100%;height:100%;object-fit:cover;}.post-history-related-author-name.svelte-1g9bqtt {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.post-history-related-card .post-history-related-content {margin:0;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}"
};
function kt(e, n) {
	d(n, !0), T(e, Ot);
	let r = j(n, "profile", 3, null), i = j(n, "media", 3, void 0), a = j(n, "model", 3, void 0), o = j(n, "loadSensitiveBody", 3, void 0), l = j(n, "emojiLoadStateByUrl", 19, () => ({})), u = j(n, "emojiImageMetaByUrl", 19, () => ({})), p = j(n, "scrollRoot", 3, null), m = j(n, "onImageOpen", 3, void 0), h = j(n, "topActions", 3, void 0), g = j(n, "footerLeftExtras", 3, void 0), _ = j(n, "footerActions", 3, void 0), x = j(n, "footerDetails", 3, void 0), S = j(n, "footerMenu", 3, void 0), C = v(() => r()?.displayName?.trim() || r()?.name?.trim() || St(U.npubEncode(n.event.pubkey), 12, 4)), D = v(() => a() ?? qe({
		kind: n.event.kind,
		sourceContent: n.event.content,
		tags: n.event.tags,
		media: i()
	})), O = v(() => Ke(n.event.created_at * 1e3));
	var A = Dt(), M = E(A);
	c(M, () => h() ?? s);
	var N = b(M, 2), P = E(N), F = E(P);
	{
		let e = v(() => r()?.displayName), t = v(() => r()?.name), i = v(() => r()?.picture);
		Ct(F, {
			get pubkeyHex() {
				return n.event.pubkey;
			},
			get displayName() {
				return I(e);
			},
			get name() {
				return I(t);
			},
			get src() {
				return I(i);
			},
			get alt() {
				return I(C);
			},
			get fallbackAriaLabel() {
				return I(C);
			},
			rootClassName: "post-history-related-avatar",
			imageClassName: "post-history-related-avatar-image"
		});
	}
	var L = b(F, 2), R = y(L, !0);
	w(P);
	var z = b(P, 2);
	We(z, {
		get model() {
			return I(D);
		},
		get loadSensitiveBody() {
			return o();
		},
		get contentWarningEventId() {
			return n.event.id;
		},
		density: "compact",
		contentClass: "post-history-related-content",
		get emojiLoadStateByUrl() {
			return l();
		},
		get emojiImageMetaByUrl() {
			return u();
		},
		get scrollRoot() {
			return p();
		},
		get onImageOpen() {
			return m();
		}
	});
	var V = b(z, 2);
	Et(V, {
		get formattedDate() {
			return I(O);
		},
		density: "compact",
		get leftExtras() {
			return g();
		},
		get actions() {
			return _();
		},
		get trailing() {
			return S();
		}
	});
	var H = b(V, 2);
	c(H, () => x() ?? s), w(N), w(A), k(() => t(R, I(C))), f(e, A), B();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostPreviewFooterActionButton.svelte
var At = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"tooltipContent",
	"children",
	"onClick",
	"ariaLabel"
]), jt = i("<!> <!>", 1);
function Mt(n, r) {
	d(r, !0);
	let i = j(r, "onClick", 3, void 0), l = j(r, "ariaLabel", 3, ""), u = C(r, At), m = V().overlayTarget;
	var h = p(), g = L(h);
	o(g, () => at, (n, d) => {
		d(n, {
			children: (n, d) => {
				var h = p(), g = L(h);
				o(g, () => et, (n, d) => {
					d(n, {
						delayDuration: 500,
						children: (n, d) => {
							var h = jt(), g = L(h);
							{
								let e = (e, t) => {
									let n = () => (t?.()).props, a = v(() => {
										let { onclick: e, ...t } = n();
										return {
											tooltipOnclick: e,
											restProps: t
										};
									});
									Q(e, _(() => u, () => I(a).restProps, {
										get ariaLabel() {
											return l();
										},
										onClick: (e) => {
											let t = i()?.(e);
											return typeof I(a).tooltipOnclick == "function" && I(a).tooltipOnclick(e), t;
										},
										children: (e, t) => {
											var n = p(), i = L(n);
											c(i, () => r.children ?? s), f(e, n);
										},
										$$slots: { default: !0 }
									}));
								};
								o(g, () => Je, (t, n) => {
									n(t, {
										child: e,
										$$slots: { child: !0 }
									});
								});
							}
							var y = b(g, 2);
							o(y, () => Ie, (n, i) => {
								i(n, {
									get to() {
										return m;
									},
									children: (n, i) => {
										var s = p(), c = L(s);
										o(c, () => tt, (n, i) => {
											i(n, {
												sideOffset: 8,
												class: "tooltip-content post-preview-tooltip-content",
												children: (n, i) => {
													e();
													var o = a();
													k(() => t(o, r.tooltipContent)), f(n, o);
												},
												$$slots: { default: !0 }
											});
										}), f(n, s);
									},
									$$slots: { default: !0 }
								});
							}), f(n, h);
						},
						$$slots: { default: !0 }
					});
				}), f(n, h);
			},
			$$slots: { default: !0 }
		});
	}), f(n, h), B();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostReactionActionButton.svelte
var Nt = i("<div aria-hidden=\"true\"></div>"), Pt = i("<span class=\"reaction-action-error svelte-kvh7jt\" role=\"alert\"> </span>"), Ft = i("<!> <!>", 1), It = {
	hash: "svelte-kvh7jt",
	code: ".reaction-compose-icon.svelte-kvh7jt {--svg: currentColor;mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.failed.svelte-kvh7jt {color:var(--danger);}.reaction-action-error.svelte-kvh7jt {position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);}"
};
function Lt(e, n) {
	d(n, !0), T(e, It);
	let r = () => N(Y, "$_", i), [i, a] = O(), o = g(!1), s = g(!1);
	async function c() {
		if (!I(o)) {
			S(o, !0), S(s, !1);
			try {
				S(s, await n.onReact() === !1);
			} catch {
				S(s, !0);
			} finally {
				S(o, !1);
			}
		}
	}
	var u = Ft(), p = L(u);
	{
		let e = v(() => r()("reaction.action")), t = v(() => r()(I(s) ? "reaction.targetFailed" : "reaction.action"));
		Mt(p, {
			type: "button",
			className: "post-history-action-button post-preview-action-button reaction-compose-button",
			get ariaLabel() {
				return I(e);
			},
			get tooltipContent() {
				return I(t);
			},
			shape: "circle",
			contentLayout: "icon",
			get disabled() {
				return I(o);
			},
			onClick: c,
			children: (e, t) => {
				var n = Nt();
				let r;
				k(() => r = z(n, 1, "reaction-compose-icon svg-icon svelte-kvh7jt", null, r, { failed: I(s) })), f(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	var m = b(p, 2), h = (e) => {
		var n = Pt(), i = y(n, !0);
		k((e) => t(i, e), [() => r()("reaction.targetFailed")]), f(e, n);
	};
	l(m, (e) => {
		I(s) && e(h);
	}), f(e, u), B(), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPostActions.svelte
var Rt = i("<div class=\"reply-icon svg-icon\" aria-hidden=\"true\"></div>"), zt = i("<div class=\"quote-icon svg-icon\" aria-hidden=\"true\"></div>"), Bt = i("<div class=\"post-preview-action-buttons-group\"><div class=\"post-preview-action-cell post-preview-reply-action-cell\"><div class=\"post-preview-reply-button-slot\"><!></div> <div class=\"post-preview-footer-replies-slot\"><!></div></div> <div class=\"post-preview-action-cell post-preview-quote-action-cell\"><!></div> <div class=\"post-preview-action-cell post-preview-reaction-action-cell\"><!> <div class=\"post-preview-footer-reaction-slot\"><!></div></div></div>");
function Vt(e, t) {
	d(t, !0);
	let n = () => N(Y, "$_", r), [r, i] = O(), a = j(t, "onReactionPost", 3, void 0), o = j(t, "onReplyPost", 3, void 0), u = j(t, "onQuotePost", 3, void 0), p = j(t, "replyExtras", 3, void 0), m = j(t, "reactionExtras", 3, void 0);
	var h = Bt(), g = E(h), _ = E(g), y = E(_), x = (e) => {
		{
			let r = v(() => n()("replyQuote.reply_label")), i = v(() => n()("replyQuote.reply_label"));
			Mt(e, {
				type: "button",
				className: "post-preview-action-button post-history-action-button",
				get ariaLabel() {
					return I(r);
				},
				contentLayout: "icon",
				shape: "circle",
				onClick: () => o()?.(t.post),
				get tooltipContent() {
					return I(i);
				},
				children: (e, t) => {
					var n = Rt();
					f(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	};
	l(y, (e) => {
		o() && e(x);
	}), w(_);
	var S = b(_, 2), C = E(S);
	c(C, () => p() ?? s), w(S), w(g);
	var T = b(g, 2), D = E(T), k = (e) => {
		{
			let r = v(() => n()("replyQuote.quote_label")), i = v(() => n()("replyQuote.quote_label"));
			Mt(e, {
				type: "button",
				className: "post-preview-action-button post-history-action-button",
				get ariaLabel() {
					return I(r);
				},
				contentLayout: "icon",
				shape: "circle",
				onClick: () => u()?.(t.post),
				get tooltipContent() {
					return I(i);
				},
				children: (e, t) => {
					var n = zt();
					f(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	};
	l(D, (e) => {
		u() && e(k);
	}), w(T);
	var A = b(T, 2), M = E(A), P = (e) => {
		Lt(e, { onReact: () => a()(t.post) });
	}, F = v(() => a() && t.post.deletedAt === void 0 && me(t.post.kind));
	l(M, (e) => {
		I(F) && e(P);
	});
	var L = b(M, 2), R = E(L);
	c(R, () => m() ?? s), w(L), w(A), w(h), f(e, h), B(), i();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRepostPreview.svelte
var Ht = i("<p> </p>"), Ut = i("<div class=\"repost-target-label svelte-1l68xot\"> </div>"), Wt = i("<div class=\"repost-channel-row svelte-1l68xot\"><span> </span> <strong> </strong></div>"), Gt = i("<!> <!>", 1), Kt = i("<p role=\"status\"> </p> <!>", 1), qt = i("<div class=\"post-history-repost svelte-1l68xot\"><div class=\"post-history-repost-label svelte-1l68xot\"><span class=\"post-history-repost-title svelte-1l68xot\"><!> <span class=\"post-history-repost-icon svg-icon svelte-1l68xot\" aria-hidden=\"true\"></span> <span> </span></span> <!></div> <!> <!></div>"), Jt = {
	hash: "svelte-1l68xot",
	code: ".post-history-repost.svelte-1l68xot {min-width:0;}.repost-target-label.svelte-1l68xot {padding:4px 6px;color:var(--text-muted);}.repost-channel-row.svelte-1l68xot {display:flex;flex-wrap:wrap;gap:6px;padding:4px 6px;overflow-wrap:anywhere;}.post-history-repost-label.svelte-1l68xot {display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--btn-post-preview-action);}.post-history-repost-title.svelte-1l68xot {display:flex;align-items:center;gap:6px;min-width:0;padding-left:6px;}.post-history-repost-icon.svelte-1l68xot {--icon-size: 22px;--svg: currentColor;mask-image:var(--ehagaki-icon-7265706f73742e737667);}.post-history-repost-label .post-history-menu-trigger {inline-size:28px;block-size:28px;min-inline-size:28px;min-block-size:28px;flex:0 0 28px;padding:0;}"
};
function Yt(n, r) {
	d(r, !0), T(n, Jt);
	let i = () => N(Y, "$_", o), [o, u] = O(), m = j(r, "channelText", 3, null), h = j(r, "targetLabel", 3, null), g = j(r, "scrollRoot", 3, null), _ = j(r, "emojiLoadStateByUrl", 19, () => ({})), x = j(r, "emojiImageMetaByUrl", 19, () => ({})), S = v(() => r.preview.event ? ce(r.preview.event, r.preview.relayHints) : null), C = v(() => r.preview.status === "deleted" ? "repost.targetDeleted" : r.preview.status === "unsupported-target-kind" ? "repost.targetUnsupported" : r.preview.status === "unsupported-reference" ? "repost.referenceUnsupported" : r.preview.status === "invalid-reference" || r.preview.status === "invalid-target" || r.preview.status === "outer-target-kind-mismatch" ? "repost.targetInvalid" : r.preview.status === "loading" ? "repost.targetLoading" : "repost.targetMissing");
	var D = qt(), A = E(D), M = E(A), P = E(M);
	c(P, () => r.author ?? s);
	var F = b(P, 4), z = y(F, !0);
	w(M);
	var V = b(M, 2);
	c(V, () => r.menu ?? s, () => r.post, () => `repost-outer:${r.post.eventId}`), w(A);
	var H = b(A, 2), U = (e) => {
		var n = Ht(), r = y(n, !0);
		k((e) => t(r, e), [() => i()("postHistory.deleted")]), f(e, n);
	}, W = (n) => {
		var o = Gt(), u = L(o);
		kt(u, {
			get event() {
				return r.preview.event;
			},
			get profile() {
				return r.preview.profile;
			},
			get model() {
				return r.model;
			},
			get loadSensitiveBody() {
				return r.loadSensitiveBody;
			},
			get scrollRoot() {
				return g();
			},
			get onImageOpen() {
				return r.onImageOpen;
			},
			get emojiLoadStateByUrl() {
				return _();
			},
			get emojiImageMetaByUrl() {
				return x();
			},
			topActions: (e) => {
				var n = Gt(), r = L(n), a = (e) => {
					var n = Ut(), r = y(n, !0);
					k(() => t(r, h())), f(e, n);
				};
				l(r, (e) => {
					h() && e(a);
				});
				var o = b(r, 2), s = (e) => {
					var n = Wt(), r = E(n), a = y(r, !0), o = b(r, 2), s = y(o, !0);
					w(n), k((e) => {
						t(a, e), t(s, m());
					}, [() => i()("postHistory.channel")]), f(e, n);
				};
				l(o, (e) => {
					m() && e(s);
				}), f(e, n);
			},
			footerActions: (e) => {
				Vt(e, {
					get post() {
						return I(S);
					},
					get onReplyPost() {
						return r.onReplyPost;
					},
					get onQuotePost() {
						return r.onQuotePost;
					},
					get onReactionPost() {
						return r.onReactionPost;
					},
					reactionExtras: (e) => {
						var t = p(), n = L(t);
						c(n, () => r.reactionExtras ?? s, () => I(S)), f(e, t);
					},
					$$slots: { reactionExtras: !0 }
				});
			},
			footerDetails: (e) => {
				var t = p(), n = L(t);
				c(n, () => r.reactionDetails ?? s, () => I(S)), f(e, t);
			},
			footerMenu: (e) => {
				var t = p(), n = L(t);
				c(n, () => r.menu ?? s, () => I(S), () => `repost-target:${r.post.eventId}:${I(S).eventId}`), f(e, t);
			},
			$$slots: {
				topActions: !0,
				footerActions: !0,
				footerDetails: !0,
				footerMenu: !0
			}
		});
		var d = b(u, 2), v = (n) => {
			var o = Kt(), s = L(o), c = y(s, !0), l = b(s, 2);
			Q(l, {
				get onClick() {
					return r.onRetry;
				},
				children: (n, r) => {
					e();
					var o = a();
					k((e) => t(o, e), [() => i()("repost.retrySave")]), f(n, o);
				},
				$$slots: { default: !0 }
			}), k((e) => t(c, e), [() => i()("repost.targetSaveFailed")]), f(n, o);
		};
		l(d, (e) => {
			"saveFailed" in r.preview && r.preview.saveFailed && e(v);
		}), f(n, o);
	}, G = (n) => {
		var o = Kt(), s = L(o), c = y(s, !0), u = b(s, 2), d = (n) => {
			Q(n, {
				get onClick() {
					return r.onRetry;
				},
				children: (n, r) => {
					e();
					var o = a();
					k((e) => t(o, e), [() => i()("postHistory.contextRetry")]), f(n, o);
				},
				$$slots: { default: !0 }
			});
		};
		l(u, (e) => {
			(r.preview.status === "not-found" || r.preview.status === "error" || r.preview.status === "invalid-target") && e(d);
		}), k((e) => t(c, e), [() => i()(I(C))]), f(n, o);
	};
	l(H, (e) => {
		r.post.deletedAt === void 0 ? r.preview.status === "resolved" && r.preview.event && I(S) ? e(W, 1) : e(G, -1) : e(U);
	});
	var K = b(H, 2), q = (e) => {
		var t = Gt(), n = L(t);
		{
			let e = (e) => {
				Vt(e, {
					get post() {
						return r.post;
					},
					get onReactionPost() {
						return r.onReactionPost;
					},
					reactionExtras: (e) => {
						var t = p(), n = L(t);
						c(n, () => r.reactionExtras ?? s, () => r.post), f(e, t);
					},
					$$slots: { reactionExtras: !0 }
				});
			}, t = (e) => {
				var t = p(), n = L(t);
				c(n, () => r.footerMenu ?? s, () => r.post), f(e, t);
			}, i = v(() => Ke(r.post.postedAt));
			Et(n, {
				get formattedDate() {
					return I(i);
				},
				actions: e,
				trailing: t,
				$$slots: {
					actions: !0,
					trailing: !0
				}
			});
		}
		var i = b(n, 2);
		c(i, () => r.reactionDetails ?? s, () => r.post), f(e, t);
	};
	l(K, (e) => {
		r.post.deletedAt === void 0 && (r.onReactionPost || r.footerMenu) && e(q);
	}), w(D), k((e) => {
		R(D, "data-repost-event-id", r.post.eventId), t(z, e);
	}, [() => i()("repost.entry")]), f(n, D), B(), u();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryChannelDisplay.svelte.ts
function Xt({ getShow: e, getSessionOpen: t = e, getPosts: n, getRxNostr: r, getRelayConfig: i, getIsSearchMode: a }) {
	let o = g(A({})), s = 0, c = [];
	function l() {
		c = [];
	}
	function u() {
		s++, c.forEach((e) => e.release()), l();
	}
	function d() {
		u(), S(o, {}, !0);
	}
	function f(e, t) {
		if (e.kind !== 42) return null;
		if (!e.channelEventId) return t("postHistory.channelUnknown");
		let n = I(o)[e.channelEventId];
		return !n || n.status === "loading" ? t("postHistory.channelLoading") : n.status === "resolved" && n.name ? n.name : t("postHistory.channelUnknown");
	}
	return P(() => {
		t() || M(d);
	}), P(() => {
		if (e()) return () => {
			u();
		};
	}), P(() => {
		if (!e()) {
			u();
			return;
		}
		u();
		let t = n().filter((e) => e.kind === 42);
		if (t.length === 0) return;
		let d = Array.from(new Set(t.map((e) => e.channelEventId).filter((e) => typeof e == "string")));
		if (d.length === 0) return;
		let f = ++s, p = a() ? void 0 : r(), m = d.map((e) => {
			let n = W.sanitizeExternalRelayUrls(t.filter((t) => t.channelEventId === e).flatMap((e) => Ze(e, null)), { limit: 8 });
			return $e.resolveInternal({
				eventId: e,
				relayHints: n
			}, p, i());
		});
		c = m, S(o, {
			...M(() => I(o)),
			...Object.fromEntries(d.map((e) => [e, {
				status: "loading",
				name: null
			}]))
		}, !0), Promise.all(m.map((e) => e.cacheReady)).then((t) => {
			e() && f === s && S(o, {
				...I(o),
				...Object.fromEntries(t.map((e) => [e.context.eventId, Ge(e.cache, !!p)]))
			}, !0);
		}).catch((e) => {
			console.error("チャンネル表示のキャッシュ解決に失敗しました:", e);
		}), Promise.all(m.map((e) => e.refresh)).then((t) => {
			e() && f === s && (l(), S(o, {
				...I(o),
				...Object.fromEntries(t.map((e) => [e.snapshot.context.eventId, {
					status: e.snapshot.context.name ? "resolved" : "failed",
					name: e.snapshot.context.name
				}]))
			}, !0));
		}).catch((e) => {
			f === s && l(), console.error("チャンネル表示のバックグラウンド解決に失敗しました:", e);
		});
	}), F(() => {
		u();
	}), {
		getChannelText: f,
		cancelCurrentChannelResolution: u
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphUtils.ts
var Zt = 5, Qt = .5, $t = 2.5;
function en(e, t) {
	return `${e}:${t}`;
}
function tn(e) {
	return e < 0 ? Math.max(0, Zt + e) : e;
}
function nn(e) {
	return Math.min(tn(e) * Qt, $t);
}
function rn() {
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
function an(e) {
	return K(e.rawEvent, e) ? ee(e.rawEvent) : {
		id: e.eventId,
		pubkey: e.pubkeyHex,
		kind: e.kind,
		content: e.content,
		tags: e.tags.map((e) => [...e]),
		created_at: e.createdAt,
		sig: ""
	};
}
function on(e) {
	let t = {
		id: e.eventId,
		pubkey: e.authorPubkey,
		kind: e.kind,
		content: e.content,
		tags: e.tags.map((e) => [...e]),
		created_at: e.createdAt,
		sig: ""
	};
	return J(e.rawEvent) && e.rawEvent.id === t.id && e.rawEvent.pubkey === t.pubkey && e.rawEvent.kind === t.kind && e.rawEvent.content === t.content && e.rawEvent.created_at === t.created_at && JSON.stringify(e.rawEvent.tags) === JSON.stringify(t.tags) ? ee(e.rawEvent) : t;
}
function sn(e) {
	let t = q(e.event);
	return {
		eventId: e.event.id,
		event: ee(e.event),
		authorPubkey: e.event.pubkey,
		rootEventId: t.rootId,
		parentEventId: t.parentId,
		profile: e.profile ?? null,
		relayUrls: [...e.relayUrls ?? []],
		sources: [...e.sources]
	};
}
function cn(e, t) {
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
function ln(e, t) {
	return [...e].sort((e, n) => {
		let r = t[e]?.event, i = t[n]?.event;
		return !r || !i ? e.localeCompare(n) : r.created_at === i.created_at ? r.id.localeCompare(i.id) : r.created_at - i.created_at;
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryProfileSync.ts
function un(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
function dn({ getShow: e, getRxNostr: t, profileCache: n = Ue, logger: r = console }) {
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
			return un(l.relayHints, e) || (l.relayHints = e, l.pending ? l.refreshQueued = !0 : c(l, !0)), l.lastProfile;
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
var fn = 8;
function pn(e) {
	return W.sanitizeExternalRelayUrls(e, { limit: fn });
}
function mn(e, t) {
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
function hn(e) {
	return {
		targetEventId: e.targetEventId,
		status: "loading",
		event: null,
		profile: null,
		authorPubkey: e.authorHint ?? null,
		relayHints: pn(e.relayHints ?? []),
		errorCode: null,
		updatedAt: null
	};
}
function gn({ getShow: e, getRxNostr: t, getRelayConfig: n, postHistoryRepositoryImpl: r = fe, contextFetchService: i = Ye, deletionRequestsRepositoryImpl: a = Xe, deletionFetchService: o = Qe, profileSyncCoordinator: s = void 0, loadRepostTarget: c = void 0, requireFullVerification: l = !1 }) {
	let u = s ?? dn({
		getShow: e,
		getRxNostr: t
	}), d = !s, f = g({}), p = g(A({})), m = g(A({})), h = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), w = 0;
	function T(e) {
		S(p, {
			...I(p),
			[e]: (I(p)[e] ?? 0) + 1
		}, !0);
	}
	function E(e) {
		let t = _.get(e);
		if (t) for (let e of t) T(e);
	}
	function D(e, t) {
		let n = I(f)[e], r = t(n);
		return n && n.status === r.status && n.event === r.event && n.profile === r.profile && n.authorPubkey === r.authorPubkey && n.errorCode === r.errorCode && n.updatedAt === r.updatedAt && _e(n.relayHints, r.relayHints) ? n : (S(f, {
			...I(f),
			[e]: r
		}), E(e), r);
	}
	function O(e, t) {
		return D(e, (n) => {
			let r = n ?? hn({
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
				relayHints: t.relayHints ? pn(t.relayHints) : r.relayHints,
				errorCode: t.errorCode === void 0 ? r.errorCode : t.errorCode,
				updatedAt: t.updatedAt === void 0 ? r.updatedAt : t.updatedAt
			};
		});
	}
	function k(e) {
		let t = I(f)[e.targetEventId], n = pn([...t?.relayHints ?? [], ...e.relayHints ?? []]), r = t?.authorPubkey ?? e.authorHint ?? null, i = !t || t.authorPubkey !== r || !_e(t.relayHints, n);
		return O(e.targetEventId, {
			authorPubkey: r,
			relayHints: n
		}), i;
	}
	function j(e) {
		let t = h.get(e.scopeKey) ?? /* @__PURE__ */ new Set();
		t.add(e.targetEventId), h.set(e.scopeKey, t);
		let n = _.get(e.targetEventId) ?? /* @__PURE__ */ new Set();
		n.add(e.scopeKey), _.set(e.targetEventId, n), e.scopeKey in I(m) || S(m, {
			...I(m),
			[e.scopeKey]: 0
		}, !0), e.scopeKey in I(p) || S(p, {
			...I(p),
			[e.scopeKey]: 0
		}, !0);
	}
	async function M(e, t) {
		return (await a.getDeletedTargets([{
			targetAuthorPubkey: e,
			targetEventId: t
		}])).get(e)?.has(t) ?? !1;
	}
	function N(e, t) {
		if (e && t) for (let [n, r] of Object.entries(I(f))) r.authorPubkey === e && O(n, { profile: t });
	}
	function P(e, t) {
		N(e, u.ensureProfile(e, t));
	}
	u.subscribe((t, n) => {
		e() && N(t, n);
	});
	async function F(r, i, s = {}) {
		if (!r.pubkey || !r.id) return !1;
		let c = _.get(r.id), l = t(), u = () => e() && t() === l && c === _.get(r.id) && !!c?.size, d = await M(r.pubkey, r.id);
		if (!u()) return !1;
		if (d) return O(r.id, {
			status: "deleted",
			event: null,
			authorPubkey: r.pubkey,
			relayHints: i,
			errorCode: null,
			updatedAt: Date.now()
		}), !0;
		let f = t();
		if (!f) return !1;
		let p = `${r.pubkey}:${r.id}`, m = b.get(p) ?? Promise.resolve().then(async () => {
			try {
				if (!u()) return !1;
				let e = be(X, r.pubkey), t = o.fetchDeletionRequests(f, {
					targets: [{
						event: r,
						relayUrls: i
					}],
					relayHints: i,
					relayConfig: n()
				});
				x.set(p, t);
				let s = await t.promise;
				if (!u()) return !1;
				if (s.events.length > 0) {
					if (await a.upsertValidDeletionRequests({
						targetEvents: [r],
						deletionEvents: s.events,
						fetchedAt: s.fetchedAt
					}), !u()) return !1;
					nt.archiveAdoptedAuthored([{ event: r }], {
						ownerPubkeyHex: r.pubkey,
						expectedRevision: await e,
						isActive: u
					});
				}
				let c = await M(r.pubkey, r.id);
				return u() ? (c && O(r.id, {
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
				b.get(p) === m && (x.delete(p), b.delete(p));
			}
		});
		return b.set(p, m), !s.background && await m;
	}
	function L(e, t) {
		return C.get(e) === t;
	}
	async function R(a, o = {}, s) {
		j(a);
		let u = I(f)[a.targetEventId], d = k(a), p = I(f)[a.targetEventId] ?? hn(a), h = !!o.background && u?.status === "resolved";
		if (l && u?.status === "resolved" && !ge(u.event, {
			eventId: a.targetEventId,
			authorHint: null,
			relayHints: []
		}) && (o = {
			...o,
			force: !0
		}), (a.relationKind === "repost" || l) && u?.status === "resolved") {
			let t = oe(u.event)?.event;
			if (t?.id === a.targetEventId) {
				let n = I(m)[a.scopeKey], r = await M(t.pubkey, t.id);
				if (!e() || n !== I(m)[a.scopeKey] || !_.get(t.id)?.has(a.scopeKey)) return null;
				if (r) return O(t.id, {
					status: "deleted",
					event: null,
					authorPubkey: t.pubkey,
					errorCode: null,
					updatedAt: Date.now()
				});
			}
		}
		if (!o.force && u && (!o.requireRelayHint || u.relayHints.length > 0)) {
			if (u.status === "resolved" || u.status === "deleted") return a.relationKind === "repost" && u.status === "resolved" && !Z(u.event, {
				eventId: a.targetEventId,
				authorHint: null,
				relayHints: []
			}) ? await R(a, {
				...o,
				force: !0
			}, s) : (u.status === "resolved" && u.authorPubkey && (P(u.authorPubkey, I(f)[a.targetEventId]?.relayHints ?? u.relayHints), a.relationKind === "repost" && !s && u.event && F(u.event, I(f)[a.targetEventId]?.relayHints ?? u.relayHints, { background: !0 })), I(f)[a.targetEventId] ?? u);
			if (u.status === "loading" && !s && v.has(a.targetEventId)) return await v.get(a.targetEventId) ?? I(f)[a.targetEventId] ?? u;
			if (!d && !s && (u.status === "not-found" || u.status === "error")) return I(f)[a.targetEventId] ?? u;
		}
		if (!o.force && !s && v.has(a.targetEventId)) return await v.get(a.targetEventId) ?? I(f)[a.targetEventId] ?? p;
		o.force && (y.get(a.targetEventId)?.cancel(), y.delete(a.targetEventId), v.delete(a.targetEventId));
		let g = ++w;
		C.set(a.targetEventId, g);
		let b = (async () => {
			try {
				h || O(a.targetEventId, {
					status: "loading",
					errorCode: null
				});
				let u = s ? {
					event: s.target,
					relayHints: p.relayHints
				} : a.relationKind === "repost" ? await c?.(a) : null;
				if (!L(a.targetEventId, g)) return null;
				let d = u && Z(u.event, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: a.relayHints ?? []
				});
				if (d && (!o.requireRelayHint || u.relayHints.length > 0)) {
					let e = pn([...u.relayHints, ...p.relayHints]), t = O(a.targetEventId, {
						status: "resolved",
						event: d.event,
						authorPubkey: d.event.pubkey,
						relayHints: e,
						errorCode: null,
						updatedAt: Date.now()
					});
					return P(d.event.pubkey, e), s || F(d.event, e, { background: !0 }), t;
				}
				let m = await r.getByEventId(a.targetEventId);
				if (!L(a.targetEventId, g)) return I(f)[a.targetEventId] ?? null;
				let _ = l && m ? ge(m.rawEvent, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				}) : null;
				if (m && (!l || _) && (!o.requireRelayHint || [
					...m.relayHints,
					...m.acceptedRelays,
					...m.fetchedRelays ?? []
				].length > 0) && (a.relationKind !== "repost" || Z(m.rawEvent, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				}))) {
					let e = pn([
						...p.relayHints,
						...m.relayHints,
						...m.acceptedRelays,
						...m.fetchedRelays ?? []
					]);
					if (typeof m.deletedAt == "number") return O(a.targetEventId, {
						status: "deleted",
						event: null,
						authorPubkey: _?.event.pubkey ?? m.pubkeyHex,
						relayHints: e,
						errorCode: null,
						updatedAt: Date.now()
					});
					let t = _?.event ?? (a.relationKind === "repost" ? Z(m.rawEvent).event : an(m)), n = e, r = O(a.targetEventId, {
						status: "resolved",
						event: t,
						authorPubkey: t.pubkey,
						relayHints: n,
						errorCode: null,
						updatedAt: Date.now()
					});
					return P(t.pubkey, n), s || F(t, n, { background: !0 }), I(f)[a.targetEventId] ?? r;
				}
				if (!l && a.authorHint && a.relationKind !== "repost") {
					let e = await F(mn(a.targetEventId, a.authorHint), p.relayHints);
					if (!L(a.targetEventId, g) || e) return I(f)[a.targetEventId] ?? null;
				}
				let v = t();
				if (!v || !e()) return h ? I(f)[a.targetEventId] ?? p : O(a.targetEventId, {
					status: "error",
					event: null,
					authorPubkey: p.authorPubkey,
					relayHints: p.relayHints,
					errorCode: "nostr_not_ready",
					updatedAt: Date.now()
				});
				let b = (s ? y.get(a.targetEventId) : void 0) ?? i.fetchEventById(v, {
					eventId: a.targetEventId,
					authorHint: a.authorHint,
					relayHints: p.relayHints,
					relayConfig: n()
				});
				y.set(a.targetEventId, b);
				let x = await b.promise;
				if (!L(a.targetEventId, g)) return I(f)[a.targetEventId] ?? null;
				if (y.delete(a.targetEventId), !x.event) {
					if (!l && a.authorHint && a.relationKind !== "repost") {
						let e = await F(mn(a.targetEventId, a.authorHint), p.relayHints);
						if (!L(a.targetEventId, g) || e) return I(f)[a.targetEventId] ?? null;
					}
					return h ? I(f)[a.targetEventId] ?? p : O(a.targetEventId, {
						status: "not-found",
						event: null,
						authorPubkey: p.authorPubkey,
						relayHints: p.relayHints,
						errorCode: null,
						updatedAt: Date.now()
					});
				}
				let S = pn([...x.relayUrl ? [x.relayUrl] : [], ...p.relayHints]), C = l ? ge(x.event, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				}) : null;
				if (l && !C) return O(a.targetEventId, {
					status: "error",
					event: null,
					errorCode: "invalid_event",
					updatedAt: Date.now()
				});
				let w = C?.event ?? x.event;
				if (a.relationKind === "repost" && !Z(w, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				})) throw Error("invalid_repost_target");
				let T = S, E = !s && await F(w, T, { background: a.relationKind === "repost" });
				if (!L(a.targetEventId, g)) return I(f)[a.targetEventId] ?? null;
				if (E) return w.id !== a.targetEventId && O(a.targetEventId, {
					status: "deleted",
					event: null,
					authorPubkey: w.pubkey,
					relayHints: T,
					errorCode: null,
					updatedAt: Date.now()
				}), I(f)[a.targetEventId] ?? null;
				let D = O(a.targetEventId, {
					status: "resolved",
					event: w,
					authorPubkey: w.pubkey,
					relayHints: T,
					errorCode: null,
					updatedAt: Date.now()
				});
				return P(w.pubkey, T), I(f)[a.targetEventId] ?? D;
			} catch {
				return L(a.targetEventId, g) ? h ? I(f)[a.targetEventId] ?? p : O(a.targetEventId, {
					status: "error",
					event: null,
					authorPubkey: p.authorPubkey,
					relayHints: p.relayHints,
					errorCode: "fetch_failed",
					updatedAt: Date.now()
				}) : I(f)[a.targetEventId] ?? null;
			} finally {
				L(a.targetEventId, g) && (y.delete(a.targetEventId), v.delete(a.targetEventId));
			}
		})();
		return v.set(a.targetEventId, b), await b;
	}
	async function z(e, t = {}) {
		return R(e, t);
	}
	async function B(n, r) {
		let i = Z(r, {
			eventId: n.targetEventId,
			authorHint: n.authorHint ?? null,
			relayHints: n.relayHints ?? []
		});
		if (n.relationKind !== "repost" || !i || !te(i.event.kind) || !e() || !t()) return null;
		j(n);
		let a = _.get(n.targetEventId), o = I(m)[n.scopeKey], s = t(), c = () => e() && t() === s && a === _.get(n.targetEventId) && a?.has(n.scopeKey) && o === I(m)[n.scopeKey], l = await R(n, { requireRelayHint: !0 }, { target: i.event });
		if (!c() || l?.status !== "resolved" || !Z(l.event, {
			eventId: i.event.id,
			authorHint: i.event.pubkey,
			relayHints: []
		})) return null;
		let u = await M(i.event.pubkey, i.event.id);
		return c() ? u ? O(i.event.id, {
			status: "deleted",
			event: null,
			authorPubkey: i.event.pubkey,
			errorCode: null,
			updatedAt: Date.now()
		}) : l : null;
	}
	async function V(e, t = {}) {
		return await Promise.all(e.map((e) => z(e, t)));
	}
	async function H(e, t = {}) {
		return await z(e, {
			...t,
			force: !0
		});
	}
	function U(e) {
		return I(f)[e] ?? null;
	}
	function W(e) {
		return I(p)[e] ?? 0;
	}
	function G(e) {
		let t = h.get(e);
		if (t) for (let n of t) {
			let t = _.get(n);
			if (t && (t.delete(e), !(t.size > 0))) {
				_.delete(n), C.delete(n), y.get(n)?.cancel(), y.delete(n);
				for (let [e, t] of x) e.endsWith(`:${n}`) && (t.cancel(), x.delete(e), b.delete(e));
				v.delete(n);
			}
		}
		h.delete(e), S(m, {
			...I(m),
			[e]: (I(m)[e] ?? 0) + 1
		}, !0), T(e);
	}
	function K() {
		y.forEach((e) => e.cancel()), x.forEach((e) => e.cancel()), y.clear(), x.clear(), v.clear(), b.clear(), h.clear(), _.clear(), d && u.reset(), C.clear(), S(f, {}), S(p, {}, !0), S(m, {}, !0);
	}
	return {
		ensureTarget: z,
		prepareRepostTarget: B,
		ensureTargets: V,
		retryTarget: H,
		getTargetSnapshot: U,
		getScopeRevision: W,
		invalidateScope: G,
		reset: K
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryRepostPreviews.svelte.ts
var _n = 0;
async function vn(e) {
	if (!e.sourceEventId) return null;
	let t = await fe.getByEventId(e.sourceEventId), n = t && Se(t), r = t?.repostTarget ?? (t && n ? (await X.postHistory.where("pubkeyHex").equals(t.pubkeyHex).filter((e) => se(e.kind) && e.repostTarget?.rawEvent.id === n.eventId).first())?.repostTarget : void 0), i = n && n.eventId === e.targetEventId && r ? Z(r.rawEvent, {
		eventId: e.targetEventId,
		authorHint: null,
		relayHints: []
	}) : null;
	return i ? {
		event: i.event,
		relayHints: r.relayHints
	} : null;
}
function yn(e) {
	let t = `post-history-repost:${++_n}`, n = 0, r = g(A({}));
	function i(e) {
		let n = Se(e);
		return n ? {
			targetEventId: n.eventId,
			authorHint: n.authorHint,
			relayHints: n.relayHints,
			relationKind: "repost",
			sourceEventId: e.eventId,
			scopeKey: t
		} : null;
	}
	function a(n) {
		e.resolver.getScopeRevision(t);
		let i = Se(n);
		return {
			...ne(n, i ? e.resolver.getTargetSnapshot(i.eventId) : null),
			saveFailed: I(r)[n.eventId] ?? !1
		};
	}
	async function o(t, a = !1) {
		let o = i(t), s = e.getPubkey(), c = n;
		if (!e.getShow() || !o || !s) return;
		let l = await be(X, s), u = () => n === c && e.getShow() && e.getPubkey() === s && e.getPosts().some((e) => e.eventId === t.eventId && e.deletedAt === void 0);
		if (!u()) return;
		let d = e.resolver.getTargetSnapshot(o.targetEventId), f = a ? await e.resolver.retryTarget(o) : await e.resolver.ensureTarget(o, { force: !!t.repostTarget && d?.status !== "resolved" });
		if (!u() || !f?.event) return;
		let p = Se(t), m = p && ae(f.event, p);
		if (m) try {
			await fe.attachRepostTarget({
				outerEventId: t.eventId,
				target: m.event,
				relayHints: f.relayHints,
				localWriteScope: {
					ownerPubkeyHex: s,
					expectedRevision: l,
					isActive: u
				}
			}), u() && I(r)[t.eventId] && S(r, {
				...I(r),
				[t.eventId]: !1
			}, !0);
		} catch {
			u() && S(r, {
				...I(r),
				[t.eventId]: !0
			}, !0);
		}
	}
	return P(() => {
		let r = e.getPosts(), i = e.getPubkey();
		if (e.getShow() && i) {
			for (let e of r) se(e.kind) && e.deletedAt === void 0 && o(e).catch(() => void 0);
			return () => {
				n++, e.resolver.invalidateScope(t);
			};
		}
	}), F(() => {
		n++, e.resolver.invalidateScope(t);
	}), {
		suspend: () => {
			n++, e.resolver.invalidateScope(t);
		},
		getPreview: a,
		retry: (e) => {
			o(e, !I(r)[e.eventId]).catch(() => void 0);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostRepostMenuItem.svelte
var bn = i("<div class=\"repost-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), xn = {
	hash: "svelte-1s9x7c7",
	code: ".repost-icon {mask-image:var(--ehagaki-icon-7265706f73742e737667);}"
};
function Sn(e, n) {
	d(n, !0), T(e, xn);
	let r = () => N(Y, "$_", i), [i, a] = O(), s = j(n, "pending", 3, !1);
	var c = p(), l = L(c);
	o(l, () => st, (e, i) => {
		i(e, {
			class: "menu-action-button",
			get disabled() {
				return s();
			},
			get onSelect() {
				return n.onSelect;
			},
			children: (e, n) => {
				var i = bn(), a = b(L(i), 2), o = y(a, !0);
				k((e) => t(o, e), [() => r()(s() ? "repost.sending" : "repost.action")]), f(e, i);
			},
			$$slots: { default: !0 }
		});
	}), f(e, c), B(), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostRepostFeedback.svelte
var Cn = i("<div class=\"repost-save-feedback svelte-rif0a0\" role=\"status\"><span> </span> <!></div>"), wn = i("<div class=\"repost-message svelte-rif0a0\"> </div>"), Tn = i("<!> <!>", 1), En = {
	hash: "svelte-rif0a0",
	code: ".repost-message.svelte-rif0a0 {white-space:normal;overflow-wrap:anywhere;}.repost-save-feedback.svelte-rif0a0 {display:flex;flex:0 0 auto;flex-wrap:wrap;align-items:center;gap:8px;min-width:0;width:100%;padding:8px 12px;box-sizing:border-box;}.repost-save-feedback.svelte-rif0a0 .repost-retry-save {height:auto;min-height:44px;padding:8px 12px;}"
};
function Dn(n, r) {
	d(r, !0), T(n, En);
	let i = () => N(Y, "$_", o), [o, s] = O(), c = j(r, "saveFailure", 3, null), u = j(r, "pending", 3, !1), p = j(r, "anchor", 3, null), m = j(r, "anchorRightOffset", 3, 0), h = g(!1), _ = g(!1), x = g(null), C = v(() => c() ?? (r.result?.retryInput ? r.result : null));
	P(() => {
		if (S(h, u() || !!r.result && r.result !== I(x) && r.result.error !== "repost_stale", !0), u() || !r.result || r.result.retryInput) return;
		let e = setTimeout(() => {
			S(h, !1);
		}, 4e3);
		return () => clearTimeout(e);
	});
	let D = v(() => u() ? "repost.sending" : r.result?.success ? r.result.historySaved === !1 ? "repost.saveFailed" : "repost.sent" : r.result?.error === "repost_relay_missing" ? "repost.relayMissing" : "repost.failed");
	async function A() {
		if (!I(C) || !r.onRetrySave || I(_)) return;
		let e = I(C);
		S(_, !0);
		try {
			await r.onRetrySave(e) && (S(x, e), r.result === e && S(h, !1));
		} finally {
			S(_, !1);
		}
	}
	var M = Tn(), F = L(M), R = (n) => {
		var r = Cn(), o = E(r), s = y(o, !0), c = b(o, 2);
		{
			let n = v(() => u() || I(_));
			Q(c, {
				className: "repost-retry-save",
				variant: "default",
				shape: "rounded",
				get disabled() {
					return I(n);
				},
				onClick: () => void A(),
				children: (n, r) => {
					e();
					var o = a();
					k((e) => t(o, e), [() => i()("repost.retrySave")]), f(n, o);
				},
				$$slots: { default: !0 }
			});
		}
		w(r), k((e) => t(s, e), [() => i()("repost.saveFailed")]), f(n, r);
	};
	l(F, (e) => {
		I(C) && I(C) !== I(x) && r.onRetrySave && e(R);
	});
	var z = b(F, 2);
	{
		let e = v(() => I(h) && (u() || !r.result?.retryInput)), n = v(() => p() ? "anchor-bottom-right" : "top-right");
		Pe(z, {
			get show() {
				return I(e);
			},
			get variant() {
				return I(n);
			},
			get anchor() {
				return p();
			},
			get anchorRightOffset() {
				return m();
			},
			children: (e, n) => {
				var r = wn(), a = y(r, !0);
				k((e) => t(a, e), [() => i()(I(D))]), f(e, r);
			},
			$$slots: { default: !0 }
		});
	}
	f(n, M), B(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryActionMenu.svelte
var On = i("<div class=\"more-icon svg-icon\"></div>"), kn = i("<!> <!>", 1), An = i("<div class=\"post-history-menu-timestamp\"> </div> <!>", 1), jn = i("<div class=\"post-history-menu-body\"><!> <!></div>"), Mn = i("<button><div class=\"more-icon svg-icon\"></div></button>"), Nn = i("<button type=\"button\" aria-haspopup=\"menu\"><div class=\"more-icon svg-icon\"></div></button>"), Pn = {
	hash: "svelte-ea4c9b",
	code: ".post-history-menu-trigger {aspect-ratio:1;border-radius:50%;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));background-color:var(\n            --post-history-preview-footer-surface,\n            var(--dialog-bg)\n        );}.post-history-menu-trigger .more-icon {width:22px;height:22px;mask-image:var(--ehagaki-icon-6d6f72655f766572745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);--svg: currentColor;}.post-history-menu-trigger.post-history-heading-menu-trigger {min-height:50px;padding:0;border-radius:0;--btn-bg: var(--dialog-bg);background-color:var(--dialog-bg);color:var(--text-muted);}\n            .post-history-menu-trigger.post-history-heading-menu-trigger\n                .more-icon\n         {width:28px;height:28px;}.post-history-menu-content {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:10px;box-shadow:0 8px 24px rgba(0, 0, 0, 0.16);padding:8px;min-width:180px;z-index:102;outline:none;--post-history-menu-action-hover-bg: light-dark(\n            color-mix(in srgb, var(--dialog-bg), black 6%),\n            color-mix(in srgb, var(--dialog-bg), white 10%)\n        );--post-history-menu-action-hover-color: light-dark(\n            color-mix(in srgb, var(--text), black 6%),\n            color-mix(in srgb, var(--text), white 10%)\n        );--post-history-menu-action-danger-hover-bg: color-mix(\n            in srgb,\n            var(--dialog-bg),\n            var(--danger) 12%\n        );}.post-history-menu-body {display:flex;flex-direction:column;align-items:stretch;gap:2px;}.post-history-menu-timestamp {width:fit-content;margin-inline:auto;color:var(--text-muted);font-size:0.875rem;line-height:1.35;user-select:text;white-space:nowrap;}.post-history-menu-content[data-state=\"open\"] {\n        animation: svelte-ea4c9b-post-history-menu-popover-in 150ms ease-out;}.post-history-menu-content[data-state=\"closed\"] {\n        animation: svelte-ea4c9b-post-history-menu-popover-out 100ms ease-in;}\n\n    @media (prefers-reduced-motion: reduce) {.post-history-menu-content[data-state=\"open\"],\n        .post-history-menu-content[data-state=\"closed\"] {\n            animation: none;}\n    }.post-history-menu-content .post-history-menu-separator {height:1px;margin:4px 0;background:var(--border-hr);}.post-history-menu-content .menu-action-button {display:flex;align-items:center;justify-content:flex-start;gap:10px;width:100%;min-height:44px;padding:10px 12px;border:none;border-radius:6px;background-color:transparent;color:inherit;font:inherit;text-align:start;cursor:pointer;}.post-history-menu-content .menu-action-button-danger {color:var(--danger);--svg: currentColor;}\n            .post-history-menu-content\n                .menu-action-button[data-highlighted]:not([data-disabled])\n         {background-color:var(--post-history-menu-action-hover-bg);color:var(--post-history-menu-action-hover-color);--svg: currentColor;}\n            .post-history-menu-content\n                .menu-action-button-danger[data-highlighted]:not(\n                    [data-disabled]\n                )\n         {background-color:var(--post-history-menu-action-danger-hover-bg);color:var(--danger);--svg: currentColor;}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-history-menu-content\n                    .menu-action-button:hover:not([data-disabled])\n             {background-color:var(--post-history-menu-action-hover-bg);color:var(--post-history-menu-action-hover-color);--svg: currentColor;}\n                .post-history-menu-content\n                    .menu-action-button-danger:hover:not([data-disabled])\n             {background-color:var(--post-history-menu-action-danger-hover-bg);color:var(--danger);--svg: currentColor;}\n    }.post-history-menu-content .menu-action-button[data-disabled] {opacity:0.55;cursor:not-allowed;}.post-history-menu-content .menu-action-button .svg-icon {display:inline-flex;align-items:center;justify-content:center;--icon-size: 20px;}\n\n    @keyframes svelte-ea4c9b-post-history-menu-popover-in {\n        from {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n        to {\n            opacity: 1;\n            translate: 0 0;\n        }\n    }\n\n    @keyframes svelte-ea4c9b-post-history-menu-popover-out {\n        from {\n            opacity: 1;\n            translate: 0 0;\n        }\n        to {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n    }"
};
function Fn(n, r) {
	d(r, !0), T(n, Pn);
	let i = j(r, "open", 3, !1), h = j(r, "onOpenChange", 3, void 0), C = j(r, "triggerClassName", 3, ""), O = j(r, "align", 3, "start"), A = j(r, "timestamp", 3, void 0), M = j(r, "items", 3, void 0), N = j(r, "tooltipContent", 3, void 0), F = j(r, "enableTooltip", 3, !1), H = j(r, "lazy", 3, !1), U = j(r, "restoreFocusOnClose", 3, !1), W = V().overlayTarget, G = g(!1), K = g(!1), q = g(!1), J = g(null), ee = v(() => !H() || I(G) || i()), Y = !1;
	P(() => {
		i() !== Y && (Y = i(), S(K, i()), i() && S(q, !1));
	});
	function X(e) {
		S(K, e, !0), e && S(q, !1), h()?.(e);
	}
	function te() {
		return I(q) && !I(K);
	}
	function Z(e) {
		S(q, e && !I(K), !0);
	}
	async function ne(e, t) {
		typeof t == "function" && t(e);
		let n = typeof h() == "function";
		S(q, !1), S(G, !0), await D(), n && (S(K, !0), S(q, !1), h()(!0)), I(J) && (I(J).focus({ preventScroll: !0 }), n || I(J).click());
	}
	function re(e) {
		e.key === "ArrowDown" && (e.preventDefault(), ne(e));
	}
	var ie = p(), ae = L(ie), oe = (n) => {
		var i = p(), u = L(i);
		o(u, () => ut, (n, i) => {
			i(n, {
				get open() {
					return I(K);
				},
				onOpenChange: X,
				children: (n, i) => {
					var u = kn(), d = L(u), m = (n) => {
						var i = p(), s = L(i);
						o(s, () => at, (n, i) => {
							i(n, {
								children: (n, i) => {
									var s = p(), c = L(s), l = te, u = Z;
									o(c, () => et, (n, i) => {
										i(n, {
											get open() {
												return l();
											},
											set open(e) {
												u(e);
											},
											delayDuration: 500,
											get disabled() {
												return I(K);
											},
											children: (n, i) => {
												var s = kn(), c = L(s);
												{
													let e = (e, t) => {
														let n = () => (t?.()).props, i = v(() => {
															let { onclick: e, ...t } = n();
															return {
																tooltipOnclick: e,
																restProps: t
															};
														});
														var a = p(), s = L(a);
														{
															let e = v(() => `menu-trigger post-history-menu-trigger ${C()} ${I(K) ? "is-open" : ""}`.trim());
															o(s, () => dt, (t, n) => {
																n(t, _({
																	get class() {
																		return I(e);
																	},
																	get "aria-label"() {
																		return r.triggerAriaLabel;
																	}
																}, () => I(i).restProps, {
																	onclick: (e) => {
																		typeof I(i).tooltipOnclick == "function" && I(i).tooltipOnclick(e);
																	},
																	get ref() {
																		return I(J);
																	},
																	set ref(e) {
																		S(J, e, !0);
																	},
																	children: (e, t) => {
																		var n = On();
																		f(e, n);
																	},
																	$$slots: { default: !0 }
																}));
															});
														}
														f(e, a);
													};
													o(c, () => Je, (t, n) => {
														n(t, {
															child: e,
															$$slots: { child: !0 }
														});
													});
												}
												var l = b(c, 2);
												o(l, () => Ie, (n, r) => {
													r(n, {
														get to() {
															return W;
														},
														children: (n, r) => {
															var i = p(), s = L(i);
															o(s, () => tt, (n, r) => {
																r(n, {
																	sideOffset: 8,
																	class: "tooltip-content post-preview-tooltip-content",
																	children: (n, r) => {
																		e();
																		var i = a();
																		k(() => t(i, N())), f(n, i);
																	},
																	$$slots: { default: !0 }
																});
															}), f(n, i);
														},
														$$slots: { default: !0 }
													});
												}), f(n, s);
											},
											$$slots: { default: !0 }
										});
									}), f(n, s);
								},
								$$slots: { default: !0 }
							});
						}), f(n, i);
					}, h = (e) => {
						var t = p(), n = L(t);
						{
							let e = v(() => `menu-trigger post-history-menu-trigger ${C()} ${I(K) ? "is-open" : ""}`.trim());
							o(n, () => dt, (t, n) => {
								n(t, {
									get class() {
										return I(e);
									},
									get "aria-label"() {
										return r.triggerAriaLabel;
									},
									get ref() {
										return I(J);
									},
									set ref(e) {
										S(J, e, !0);
									},
									children: (e, t) => {
										var n = On();
										f(e, n);
									},
									$$slots: { default: !0 }
								});
							});
						}
						f(e, t);
					};
					l(d, (e) => {
						F() && N() ? e(m) : e(h, -1);
					});
					var g = b(d, 2);
					o(g, () => Ie, (e, n) => {
						n(e, {
							get to() {
								return W;
							},
							children: (e, n) => {
								var r = p(), i = L(r);
								o(i, () => lt, (e, n) => {
									n(e, {
										side: "bottom",
										get align() {
											return O();
										},
										sideOffset: 8,
										class: "post-history-menu-content",
										trapFocus: !1,
										preventScroll: !1,
										onCloseAutoFocus: (e) => {
											e.preventDefault(), U() && I(J)?.focus({ preventScroll: !0 });
										},
										children: (e, n) => {
											var r = jn(), i = E(r), a = (e) => {
												var n = An(), r = L(n), i = y(r, !0), a = b(r, 2);
												o(a, () => ct, (e, t) => {
													t(e, { class: "post-history-menu-separator" });
												}), k(() => t(i, A())), f(e, n);
											};
											l(i, (e) => {
												A() && e(a);
											});
											var u = b(i, 2);
											c(u, () => M() ?? s), w(r), f(e, r);
										},
										$$slots: { default: !0 }
									});
								}), f(e, r);
							},
							$$slots: { default: !0 }
						});
					}), f(n, u);
				},
				$$slots: { default: !0 }
			});
		}), f(n, i);
	}, se = (n) => {
		var i = p(), s = L(i);
		o(s, () => at, (n, i) => {
			i(n, {
				children: (n, i) => {
					var s = p(), c = L(s), l = te, u = Z;
					o(c, () => et, (n, i) => {
						i(n, {
							get open() {
								return l();
							},
							set open(e) {
								u(e);
							},
							delayDuration: 500,
							get disabled() {
								return I(K);
							},
							children: (n, i) => {
								var s = kn(), c = L(s);
								{
									let e = (e, t) => {
										let n = () => (t?.()).props, i = v(() => {
											let { onclick: e, ...t } = n();
											return {
												tooltipOnclick: e,
												restProps: t
											};
										});
										var a = Mn(), o = (e) => void ne(e, I(i).tooltipOnclick);
										x(a, (e) => ({
											type: "button",
											class: e,
											"aria-label": r.triggerAriaLabel,
											"aria-haspopup": "menu",
											"aria-expanded": I(K),
											...I(i).restProps,
											onclick: o,
											onkeydown: re
										}), [() => `menu-trigger post-history-menu-trigger ${C()}`.trim()]), f(e, a);
									};
									o(c, () => Je, (t, n) => {
										n(t, {
											child: e,
											$$slots: { child: !0 }
										});
									});
								}
								var l = b(c, 2);
								o(l, () => Ie, (n, r) => {
									r(n, {
										get to() {
											return W;
										},
										children: (n, r) => {
											var i = p(), s = L(i);
											o(s, () => tt, (n, r) => {
												r(n, {
													sideOffset: 8,
													class: "tooltip-content post-preview-tooltip-content",
													children: (n, r) => {
														e();
														var i = a();
														k(() => t(i, N())), f(n, i);
													},
													$$slots: { default: !0 }
												});
											}), f(n, i);
										},
										$$slots: { default: !0 }
									});
								}), f(n, s);
							},
							$$slots: { default: !0 }
						});
					}), f(n, s);
				},
				$$slots: { default: !0 }
			});
		}), f(n, i);
	}, ce = (e) => {
		var t = Nn();
		k((e) => {
			z(t, 1, e), R(t, "aria-label", r.triggerAriaLabel), R(t, "aria-expanded", I(K));
		}, [() => u(`menu-trigger post-history-menu-trigger ${C()}`.trim())]), m("click", t, (e) => void ne(e)), m("keydown", t, re), f(e, t);
	};
	l(ae, (e) => {
		I(ee) ? e(oe) : F() && N() ? e(se, 1) : e(ce, -1);
	}), f(n, ie), B();
}
h(["click", "keydown"]);
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRepliesBadgeButton.svelte
var In = i("<span class=\"post-preview-replies-badge svelte-11vk23d\" aria-hidden=\"true\"> </span>"), Ln = i("<!> <!>", 1), Rn = {
	hash: "svelte-11vk23d",
	code: ".post-preview-replies-badge-button {width:36px;min-width:36px;min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));background-color:var(\n            --post-history-preview-footer-surface,\n            var(--dialog-bg)\n        );}.post-preview-replies-badge.svelte-11vk23d {display:inline-flex;align-items:center;justify-content:center;aspect-ratio:1;width:20px;height:20px;border-radius:999px;background:var(--btn-post-preview-action);color:var(--post-history-preview-footer-surface, var(--dialog-bg));font-size:0.6875rem;font-weight:700;line-height:20px;text-align:center;}\n            .post-preview-replies-badge-button.selected\n                .post-preview-replies-badge\n         {background-color:var(--text-light);}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-preview-replies-badge-button:hover:not(:disabled)\n                    .post-preview-replies-badge\n             {background-color:var(--text);}\n    }"
};
function zn(n, r) {
	d(r, !0), T(n, Rn);
	let i = j(r, "tooltipContent", 19, () => r.ariaLabel), s = j(r, "className", 3, ""), c = V().overlayTarget;
	var l = p(), u = L(l);
	o(u, () => at, (n, l) => {
		l(n, {
			children: (n, l) => {
				var u = p(), d = L(u);
				o(d, () => et, (n, l) => {
					l(n, {
						delayDuration: 500,
						children: (n, l) => {
							var u = Ln(), d = L(u);
							{
								let e = (e, n) => {
									let i = () => (n?.()).props, a = v(() => {
										let { onclick: e, ...t } = i();
										return {
											tooltipOnclick: e,
											restProps: t
										};
									});
									{
										let n = v(() => `post-preview-replies-badge-button ${s()}`);
										Q(e, _({
											type: "button",
											get class() {
												return I(n);
											},
											get ariaLabel() {
												return r.ariaLabel;
											},
											contentLayout: "icon",
											shape: "circle",
											get selected() {
												return r.selected;
											},
											onClick: (e) => {
												r.onClick(), typeof I(a).tooltipOnclick == "function" && I(a).tooltipOnclick(e);
											}
										}, () => I(a).restProps, {
											children: (e, n) => {
												var i = In(), a = y(i, !0);
												k(() => t(a, r.count)), f(e, i);
											},
											$$slots: { default: !0 }
										}));
									}
								};
								o(d, () => Je, (t, n) => {
									n(t, {
										child: e,
										$$slots: { child: !0 }
									});
								});
							}
							var m = b(d, 2);
							o(m, () => Ie, (n, r) => {
								r(n, {
									get to() {
										return c;
									},
									children: (n, r) => {
										var s = p(), c = L(s);
										o(c, () => tt, (n, r) => {
											r(n, {
												sideOffset: 8,
												class: "tooltip-content post-preview-tooltip-content",
												children: (n, r) => {
													e();
													var o = a();
													k(() => t(o, i())), f(n, o);
												},
												$$slots: { default: !0 }
											});
										}), f(n, s);
									},
									$$slots: { default: !0 }
								});
							}), f(n, u);
						},
						$$slots: { default: !0 }
					});
				}), f(n, u);
			},
			$$slots: { default: !0 }
		});
	}), f(n, l), B();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryReactionActionButton.svelte
function Bn(e, t) {
	zn(e, {
		className: "post-preview-reactions-button",
		get count() {
			return t.count;
		},
		get ariaLabel() {
			return t.ariaLabel;
		},
		get selected() {
			return t.expanded;
		},
		get onClick() {
			return t.onToggle;
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryReactionReadModel.ts
var Vn = {
	totalCount: 0,
	groups: []
};
function Hn(e) {
	if (!vt(e.content)) return;
	let t = yt(e.content);
	if (t) return bt(e.tags ?? []).get(t)?.url;
}
function Un(e) {
	let t = e.trim();
	return t ? vt(t) ? t : xt(t) : "+";
}
function Wn(e, t) {
	return e ? e instanceof Map ? e.get(t) ?? null : e[t] ?? null : null;
}
function Gn(e) {
	try {
		return St(Fe(e), 9, 4);
	} catch {
		return e.slice(0, 12);
	}
}
function Kn(e) {
	return e.profile?.displayName?.trim() || e.profile?.name?.trim() || Gn(e.pubkey);
}
async function qn(e, t = $) {
	return e ? t.getReactionRecords(e) : [];
}
function Jn(e, t) {
	if (e.length === 0) return Vn;
	let n = [], r = /* @__PURE__ */ new Map(), i = 0;
	for (let a of e) {
		if (a.kind !== 7) continue;
		i += 1;
		let e = Un(a.content);
		if (!e) continue;
		let o = {
			eventId: a.eventId,
			pubkey: a.authorPubkey,
			profile: Wn(t, a.authorPubkey),
			createdAt: a.createdAt
		}, s = r.get(e), c = Hn(a);
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
	return i === 0 ? Vn : {
		totalCount: i,
		groups: n
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryReactionDetails.svelte
var Yn = i("<div class=\"favorite-icon svg-icon post-preview-reaction-symbol\" aria-hidden=\"true\"></div>"), Xn = i("<span class=\"post-preview-reaction-emoji-slot post-preview-reaction-emoji-failed\" role=\"img\" tabindex=\"0\"> </span>"), Zn = i("<img class=\"post-preview-reaction-emoji\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), Qn = i("<span class=\"post-preview-reaction-emoji-placeholder\" aria-hidden=\"true\"></span>"), $n = i("<span class=\"post-preview-reaction-emoji-slot\"><!></span>"), er = i("<span class=\"post-preview-reaction-content\"> </span>"), tr = i("<span class=\"post-preview-reaction-actor\"><!></span>"), nr = i("<div class=\"post-preview-reaction-chip\"><div class=\"post-preview-reaction-summary\"><!> <span class=\"post-preview-reaction-count\"> </span></div> <div class=\"post-preview-reaction-actors\"></div></div>"), rr = i("<div class=\"post-preview-reactions-panel\"></div>"), ir = {
	hash: "svelte-j0ansb",
	code: ".post-preview-reactions-panel {display:flex;flex-wrap:wrap;gap:4px;padding:0 16px;}.post-preview-reaction-chip {display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:4px 8px;border-radius:18px;background:color-mix(in srgb, var(--btn-bg), transparent 40%);color:var(--text);}.post-preview-reaction-summary {display:inline-flex;align-items:center;justify-content:center;gap:2px;row-gap:4px;flex-wrap:wrap;}.post-preview-reaction-content {font-size:20px;line-height:1;}.post-preview-reaction-count {font-size:1rem;line-height:1;color:var(--text-muted);}.post-preview-reaction-emoji-slot {display:inline-grid;margin:0;padding:0;}.post-preview-reaction-emoji,\n    .post-preview-reaction-emoji-placeholder {width:100%;height:100%;}.post-preview-reaction-emoji {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-preview-reaction-emoji-placeholder {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}.post-preview-reaction-emoji-failed {display:inline-grid;place-items:center;overflow:hidden;border-radius:4px;background:rgba(127, 127, 127, 0.18);font-size:0.45em;line-height:1;white-space:nowrap;cursor:help;}.post-preview-reaction-actors {display:inline-flex;flex-wrap:wrap;gap:2px;align-items:center;}.post-preview-reaction-actor {display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:999px;overflow:hidden;flex:0 0 auto;}.post-preview-reaction-avatar,\n    .post-preview-reaction-avatar-image,\n    .post-preview-reaction-avatar-fallback {width:100%;height:100%;}.post-preview-reaction-avatar-image {object-fit:cover;}.post-preview-reaction-symbol {width:18px;height:18px;background-color:rgb(249, 24, 128);mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}"
};
function ar(e, i) {
	d(i, !0), T(e, ir);
	let a = j(i, "emojiLoadStateByUrl", 19, () => ({})), o = j(i, "emojiImageMetaByUrl", 19, () => ({}));
	function s(e) {
		let t = o()[e]?.aspectRatio;
		return `width:${typeof t == "number" && Number.isFinite(t) && t > 0 ? 18 * t : 18}px;height:18px;vertical-align:bottom;`;
	}
	var c = p(), u = L(c), m = (e) => {
		var o = rr();
		r(o, 21, () => i.readModel.groups, (e) => e.content, (e, i) => {
			var o = nr(), c = E(o), u = E(c), d = (e) => {
				var t = Yn();
				f(e, t);
			}, m = v(() => it(I(i).content)), h = (e) => {
				var r = p(), o = L(r), c = (e) => {
					var r = Xn(), a = y(r, !0);
					k((e) => {
						n(r, e), R(r, "aria-label", I(i).content), R(r, "title", I(i).content), t(a, I(i).content);
					}, [() => s(I(i).emojiUrl)]), f(e, r);
				}, u = (e) => {
					var t = $n(), r = E(t), o = (e) => {
						var t = Zn();
						k(() => {
							R(t, "src", I(i).emojiUrl), R(t, "alt", I(i).content), R(t, "title", I(i).content);
						}), f(e, t);
					}, c = (e) => {
						var t = Qn();
						f(e, t);
					};
					l(r, (e) => {
						a()[I(i).emojiUrl] === "ready" ? e(o) : e(c, -1);
					}), w(t), k((e) => n(t, e), [() => s(I(i).emojiUrl)]), f(e, t);
				};
				l(o, (e) => {
					a()[I(i).emojiUrl] === "failed" ? e(c) : e(u, -1);
				}), f(e, r);
			}, g = (e) => {
				var n = er(), r = y(n, !0);
				k(() => t(r, I(i).content)), f(e, n);
			};
			l(u, (e) => {
				I(m) ? e(d) : I(i).emojiUrl ? e(h, 1) : e(g, -1);
			});
			var _ = b(u, 2), x = y(_, !0);
			w(c);
			var S = b(c, 2);
			r(S, 21, () => I(i).reactors, (e) => e.eventId, (e, t) => {
				let n = v(() => Kn(I(t)));
				var r = tr(), i = E(r);
				{
					let e = v(() => I(t).profile?.displayName), r = v(() => I(t).profile?.name), a = v(() => I(t).profile?.picture || "");
					Ct(i, {
						get pubkeyHex() {
							return I(t).pubkey;
						},
						get displayName() {
							return I(e);
						},
						get name() {
							return I(r);
						},
						get src() {
							return I(a);
						},
						get alt() {
							return I(n);
						},
						rootClassName: "post-preview-reaction-avatar",
						imageClassName: "post-preview-reaction-avatar-image",
						fallbackClassName: "post-preview-reaction-avatar-fallback",
						get fallbackAriaLabel() {
							return I(n);
						},
						fallbackDelayMs: 0
					});
				}
				w(r), k(() => {
					R(r, "title", I(n)), R(r, "aria-label", I(n));
				}), f(e, r);
			}), w(S), w(o), k(() => t(x, I(i).count)), f(e, o);
		}), w(o), f(e, o);
	};
	l(u, (e) => {
		i.readModel.totalCount > 0 && e(m);
	}), f(e, c), B();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRawJsonDialog.svelte
var or = i("<div class=\"xmark-icon svg-icon svelte-10wau4w\"></div>"), sr = i("<!> <!>", 1), cr = i("<pre class=\"raw-json-content svelte-10wau4w\"><code> </code></pre>"), lr = i("<!> <!> <!>", 1), ur = i("<div class=\"raw-json-heading svelte-10wau4w\"><h2 class=\"svelte-10wau4w\"> </h2></div> <!>", 1), dr = {
	hash: "svelte-10wau4w",
	code: ".xmark-icon.svelte-10wau4w {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-raw-json-dialog .dialog-content {padding:8px;}.post-history-raw-json-dialog--tabs {height:min(80svh, 720px);max-height:calc(100svh - 24px);}.post-history-raw-json-dialog--tabs .dialog-content {flex:1 1 0;min-height:0;max-height:none;overflow:hidden;box-sizing:border-box;align-items:stretch;}.raw-json-heading.svelte-10wau4w {width:100%;flex:0 0 auto;}.raw-json-heading.svelte-10wau4w h2:where(.svelte-10wau4w) {margin:0;font-size:1.1rem;}.raw-json-tabs {display:flex;width:100%;box-sizing:border-box;gap:4px;margin-top:8px;border-bottom:1px solid var(--border-hr);}.raw-json-tabs-root,\n    .raw-json-panel {width:100%;min-width:0;}.raw-json-tabs-root {display:flex;flex:1 1 0;flex-direction:column;min-height:0;overflow:hidden;}.raw-json-panel[data-state=\"active\"] {display:flex;flex:1 1 0;min-height:0;overflow:hidden;}.post-history-raw-json-dialog--tabs .raw-json-content {flex:1 1 0;min-height:0;height:auto;}.raw-json-tabs button {border:0;border-bottom:2px solid transparent;padding:6px 10px;background:transparent;color:var(--text);font:inherit;cursor:pointer;}.raw-json-tabs button[data-state=\"active\"] {border-bottom-color:var(--accent-color);}.raw-json-content.svelte-10wau4w {width:100%;min-width:0;box-sizing:border-box;height:100%;margin:10px 0 0;padding:8px;overflow:auto;border:1px solid var(--border-hr);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--text) 4%);color:var(--text);font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,\n            \"Liberation Mono\", monospace;font-size:0.82rem;line-height:1.45;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere;}.post-history-raw-json-dialog {max-width:min(760px, calc(100% - 10px));}"
};
function fr(n, r) {
	d(r, !0), T(n, dr);
	let i = () => N(Y, "$_", s), [s, c] = O(), u = j(r, "open", 15, !1), m = j(r, "resetKey", 3, 0), h = j(r, "loadPayloadEvent", 3, void 0), x = j(r, "observePayloadStatus", 3, void 0), C = j(r, "onOpenChange", 3, void 0), D = g("structure"), A = g(void 0), M, z, V = 0, H = -1, U = v(() => ie(r.rawEvent) && le(r.rawEvent) ? r.rawEvent : null), W = v(() => h() !== void 0 && I(U) !== null), G = v(() => JSON.stringify(r.rawEvent, null, 2) ?? ""), K = v(() => I(A) ? JSON.stringify(I(A), null, 2) ?? "" : "");
	function q() {
		V += 1, M?.abort(), M = void 0, z?.(), z = void 0, S(D, "structure"), S(A, void 0);
	}
	F(q), P(() => {
		let e = m();
		e !== H && q(), H = e;
	});
	async function J(e) {
		if (S(D, e, !0), e !== "payload" || I(A) !== void 0 || !I(U) || !h()) return;
		let t = new AbortController();
		M?.abort(), M = t;
		let n = ++V, r = I(U).id;
		z?.(), z = x()?.(I(U), (e) => {
			(e === "deleted" || e === "invalid") && u() && I(U)?.id === r && S(A, null);
		});
		try {
			let e = await h()(I(U), t.signal);
			!t.signal.aborted && n === V && S(A, e, !0);
		} catch {
			!t.signal.aborted && n === V && S(A, null);
		} finally {
			n === V && (M = void 0);
		}
	}
	function ee(e) {
		e || (q(), C()?.(!1));
	}
	{
		let r = (e) => {
			var t = p(), n = L(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = v(() => i()("global.close"));
						Q(e, _(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return I(t);
							},
							children: (e, t) => {
								var n = or();
								k((e) => R(n, "aria-label", e), [() => i()("global.close")]), f(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				o(n, () => pt, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			f(e, t);
		}, s = v(() => i()("postHistory.rawJsonTitle")), c = v(() => i()("postHistory.rawJsonDescription")), d = v(() => I(W) ? "post-history-raw-json-dialog post-history-raw-json-dialog--tabs" : "post-history-raw-json-dialog");
		ft(n, {
			onOpenChange: ee,
			get title() {
				return I(s);
			},
			get description() {
				return I(c);
			},
			get contentClass() {
				return I(d);
			},
			footerVariant: "close-button",
			initialFocus: "content",
			get open() {
				return u();
			},
			set open(e) {
				u(e);
			},
			footer: r,
			children: (n, r) => {
				var s = ur(), c = L(s), u = E(c), d = y(u, !0);
				w(c);
				var m = b(c, 2), h = (n) => {
					var r = p(), i = L(r);
					o(i, () => mt, (n, r) => {
						r(n, {
							get value() {
								return I(D);
							},
							onValueChange: (e) => void J(e),
							class: "raw-json-tabs-root",
							children: (n, r) => {
								var i = lr(), s = L(i);
								o(s, () => ht, (t, n) => {
									n(t, {
										class: "raw-json-tabs",
										children: (t, n) => {
											var r = sr(), i = L(r);
											o(i, () => _t, (t, n) => {
												n(t, {
													value: "structure",
													children: (t, n) => {
														e();
														var r = a("Structure");
														f(t, r);
													},
													$$slots: { default: !0 }
												});
											});
											var s = b(i, 2);
											o(s, () => _t, (t, n) => {
												n(t, {
													value: "payload",
													children: (t, n) => {
														e();
														var r = a("Payload");
														f(t, r);
													},
													$$slots: { default: !0 }
												});
											}), f(t, r);
										},
										$$slots: { default: !0 }
									});
								});
								var c = b(s, 2);
								o(c, () => gt, (e, n) => {
									n(e, {
										value: "structure",
										class: "raw-json-panel",
										children: (e, n) => {
											var r = cr(), i = E(r), a = y(i, !0);
											w(r), k(() => t(a, I(G))), f(e, r);
										},
										$$slots: { default: !0 }
									});
								});
								var l = b(c, 2);
								o(l, () => gt, (e, n) => {
									n(e, {
										value: "payload",
										class: "raw-json-panel",
										children: (e, n) => {
											var r = cr(), i = E(r), a = y(i, !0);
											w(r), k(() => t(a, I(K))), f(e, r);
										},
										$$slots: { default: !0 }
									});
								}), f(n, i);
							},
							$$slots: { default: !0 }
						});
					}), f(n, r);
				}, g = (e) => {
					var n = cr(), r = E(n), i = y(r, !0);
					w(n), k(() => t(i, I(G))), f(e, n);
				};
				l(m, (e) => {
					I(W) ? e(h) : e(g, -1);
				}), k((e) => t(d, e), [() => i()("postHistory.rawJsonTitle")]), f(n, s);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	B(), c();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostPreviewToggleButton.svelte
var pr = i("<div><!></div>"), mr = {
	hash: "svelte-1yd56n0",
	code: ".post-preview-toggle-row.svelte-1yd56n0 {display:flex;&.post-preview-toggle-hidden {visibility:hidden;pointer-events:none;}&.post-preview-toggle-overlay {position:absolute;inset-inline-end:0;inset-block-end:0;z-index:1;padding-inline-start:12px;background:linear-gradient(90deg, transparent, var(--dialog-bg) 18%);}&.post-preview-toggle-flow {position:static;align-self:flex-end;padding:0;background:none;}.ehagaki-app-root & button.post-preview-toggle-button,\n        .ehagaki-app-root & button.post-preview-toggle-button:hover {color:var(--text-muted);font-size:0.875rem;font-weight:normal;min-height:24px;padding:0;background:transparent;}\n\n        @media (hover: hover) and (pointer: fine) {.ehagaki-app-root & button.post-preview-toggle-button:hover {text-decoration:underline;}\n        }}"
};
function hr(n, r) {
	d(r, !0), T(n, mr);
	let i = () => N(Y, "$_", o), [o, s] = O(), c = j(r, "visible", 3, !0), l = j(r, "placement", 3, "inline");
	var u = pr();
	let p;
	var m = E(u);
	{
		let n = v(() => !c());
		Q(m, {
			type: "button",
			class: "post-preview-action-button post-preview-toggle-button",
			get "aria-expanded"() {
				return r.expanded;
			},
			get "aria-controls"() {
				return r.controls;
			},
			get disabled() {
				return I(n);
			},
			get onClick() {
				return r.onToggle;
			},
			children: (n, o) => {
				e();
				var s = a();
				k((e) => t(s, e), [() => r.expanded ? i()("postHistory.collapse") : i()("postHistory.expand")]), f(n, s);
			},
			$$slots: { default: !0 }
		});
	}
	w(u), k(() => p = z(u, 1, "post-preview-toggle-row svelte-1yd56n0", null, p, {
		"post-preview-toggle-overlay": l() === "overlay" && (!r.expanded || !c()),
		"post-preview-toggle-flow": l() === "overlay" && r.expanded && c(),
		"post-preview-toggle-hidden": !c()
	})), f(n, u), B(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryPreviewCollapse.svelte.ts
function gr({ getShow: e, getSessionOpen: t = e, getPosts: n, getContainer: r, maxLines: i = 5 }) {
	let a = g(A({})), o = g(A({})), s = {}, c = null, l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set(), d = !1, f = null, p = 0;
	function m(e) {
		let t = getComputedStyle(e), n = parseFloat(t.lineHeight);
		if (!n || Number.isNaN(n)) {
			let e = parseFloat(t.fontSize);
			return e && !Number.isNaN(e) ? e * 1.5 : 24;
		}
		return n;
	}
	function h(e, t) {
		return s[t] = e, b(t), { destroy() {
			s[t] === e && delete s[t];
		} };
	}
	function _(e) {
		let t = Object.keys(I(a)), n = Object.keys(e);
		t.length === n.length && t.every((t) => I(a)[t] === e[t]) || S(a, e, !0);
	}
	function v() {
		if (!e()) {
			u.clear(), d = !1, _({});
			return;
		}
		let t = n(), r = u, o = d;
		u = /* @__PURE__ */ new Set(), d = !1;
		let c = {}, l;
		for (let e of t) {
			if (e.forceCollapsible) continue;
			if (!o && !r.has(e.eventId)) {
				let t = I(a)[e.eventId];
				t !== void 0 && (c[e.eventId] = t);
				continue;
			}
			let t = s[e.eventId];
			if (!t) continue;
			l ??= m(t);
			let n = l * i, u = t.scrollHeight > 0;
			c[e.eventId] = u ? t.scrollHeight > n + .5 : e.content.split("\n").length > i;
		}
		_(c);
	}
	function y() {
		if (f) return f;
		let e = ++p, t = D().then(() => {
			e === p && (f = null, v());
		});
		return f = t, t;
	}
	function b(e) {
		return e ? u.add(e) : d = !0, y();
	}
	function x() {
		let e = r();
		typeof ResizeObserver < "u" && e && (c || (c = new ResizeObserver(() => {
			b();
		}), c.observe(e)));
	}
	function C() {
		c?.disconnect(), c = null;
	}
	function w() {
		p++, f = null, C(), s = {};
	}
	function T() {
		w(), _({}), S(o, {}, !0), s = {}, l.clear(), u.clear(), d = !1, C();
	}
	function E(e) {
		return I(o)[e.eventId] ?? !1;
	}
	function O(e) {
		S(o, {
			...I(o),
			[e]: !I(o)[e]
		}, !0);
	}
	function k(e) {
		return e.forceCollapsible === !0 || (I(a)[e.eventId] ?? !1);
	}
	return P(() => {
		t() || M(T);
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
		l = r, y();
	}), P(() => {
		if (e() && r()) return x(), () => {
			C();
		};
	}), F(() => {
		C();
	}), {
		suspend: w,
		previewRef: h,
		isPostExpanded: E,
		remeasure: () => b(),
		togglePostExpanded: O,
		shouldCollapsePost: k
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDirectReplyRepairSaveService.ts
var _r = {
	status: "saved",
	savedParentEventIds: [],
	savedDirectReplyCount: 0,
	deletedEventIds: [],
	deletionConfirmationIncomplete: !1
};
function vr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (!n.parentEventId || !n.event?.id || !n.event.pubkey || ![
			1,
			42,
			1111
		].includes(n.event.kind)) continue;
		let e = t.get(n.event.id);
		t.set(n.event.id, {
			parentEventId: n.parentEventId,
			event: n.event,
			relayUrls: Array.from(/* @__PURE__ */ new Set([...e?.relayUrls ?? [], ...n.relayUrls ?? []]))
		});
	}
	return Array.from(t.values());
}
function yr(e, t) {
	return e.filter((e) => t.get(e.event.pubkey)?.has(e.event.id)).map((e) => e.event.id);
}
function br(e) {
	return {
		...e,
		status: "cancelled",
		savedParentEventIds: [],
		savedDirectReplyCount: 0
	};
}
var xr = new class {
	deletionFetchService;
	deletionRequestsRepository;
	childInteractionsRepository;
	now;
	constructor(e = {}) {
		this.deletionFetchService = e.deletionFetchService ?? Qe, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Xe, this.childInteractionsRepository = e.childInteractionsRepository ?? ve, this.now = e.now ?? Date.now;
	}
	saveRepairDirectReplies(e, t) {
		let n = !0, r = null, i = () => n && t.isActive?.() !== !1;
		return {
			promise: (async () => {
				let n = vr(t.items);
				if (n.length === 0) return _r;
				let a = await this.filterKnownDeletedDirectReplies(n), o = a.deletedEventIds;
				if (!i()) return br({
					..._r,
					deletedEventIds: o
				});
				let s = a.visibleItems, c = !1;
				if (s.length > 0) {
					r = this.deletionFetchService.fetchDeletionRequests(e, {
						targets: s.map((e) => ({
							event: e.event,
							relayUrls: e.relayUrls
						})),
						relayHints: t.relayHints,
						relayConfig: t.relayConfig
					});
					let n = await r.promise;
					if (r = null, !i() || n.status === "cancelled") return br({
						..._r,
						deletedEventIds: o,
						deletionConfirmationIncomplete: c || n.status !== "success"
					});
					if (c = n.status !== "success", n.events.length > 0 && await this.deletionRequestsRepository.upsertValidDeletionRequests({
						targetEvents: s.map((e) => e.event),
						deletionEvents: n.events,
						fetchedAt: n.fetchedAt
					}), !i()) return br({
						..._r,
						deletedEventIds: o,
						deletionConfirmationIncomplete: c
					});
					let a = await this.filterKnownDeletedDirectReplies(s);
					s = a.visibleItems, o = Array.from(/* @__PURE__ */ new Set([...o, ...a.deletedEventIds]));
				}
				if (!i()) return br({
					..._r,
					deletedEventIds: o,
					deletionConfirmationIncomplete: c
				});
				let l = await this.saveVisibleDirectReplies(s, t.fetchedAt ?? this.now(), i, t.expectedChildGeneration);
				return i() ? {
					...l,
					status: "saved",
					deletedEventIds: o,
					deletionConfirmationIncomplete: c
				} : br({
					...l,
					deletedEventIds: o,
					deletionConfirmationIncomplete: c
				});
			})(),
			cancel: () => {
				n = !1, r?.cancel();
			}
		};
	}
	async filterKnownDeletedDirectReplies(e) {
		let t = yr(e, await this.deletionRequestsRepository.getDeletedTargets(e.map((e) => ({
			targetAuthorPubkey: e.event.pubkey,
			targetEventId: e.event.id
		}))));
		await this.purgeDeletedReplyCache(t);
		let n = new Set(t);
		return {
			visibleItems: e.filter((e) => !n.has(e.event.id)),
			deletedEventIds: t
		};
	}
	async purgeDeletedReplyCache(e) {
		for (let t of new Set(e)) await this.childInteractionsRepository.deleteChildInteractionByEventId(t);
	}
	async saveVisibleDirectReplies(e, t, n, r) {
		let i = /* @__PURE__ */ new Map();
		for (let t of e) {
			let e = i.get(t.parentEventId) ?? [];
			e.push({
				event: t.event,
				...t.relayUrls ? { relayUrls: t.relayUrls } : {}
			}), i.set(t.parentEventId, e);
		}
		let a = [], o = 0;
		for (let [e, s] of i.entries()) {
			if (!n()) break;
			let i = await this.childInteractionsRepository.upsertChildInteractions({
				parentEventId: e,
				events: s,
				fetchedAt: t,
				expectedChildGeneration: r
			}), c = i.insertedCount + i.updatedCount;
			c > 0 && (a.push(e), o += c);
		}
		return {
			status: "saved",
			savedParentEventIds: a,
			savedDirectReplyCount: o
		};
	}
}(), Sr = [
	"reply",
	"reaction",
	"quote"
];
function Cr(e) {
	let t = e ?? Sr;
	return Array.from(new Set(t.filter((e) => e === "reply" || e === "reaction" || e === "quote")));
}
function wr(e, t) {
	let n = Cr(t.relationKinds);
	return {
		source: e,
		relationKinds: n,
		parentEventIds: Array.from(new Set(t.savedParentEventIds)),
		shouldRefreshQuotePreviews: n.includes("quote") && t.quoteRepairApplied
	};
}
var Tr = 6e3, Er = 8, Dr = Sr, Or = {
	status: "success",
	targetParentEventIds: [],
	checkedParentEventIds: [],
	savedParentEventIds: [],
	savedDirectReplyCount: 0,
	attemptedChunkCount: 0,
	saturatedChunkCount: 0,
	incompleteParentEventIds: [],
	deletionConfirmationIncomplete: !1
};
function kr() {
	let e = Math.random().toString(36).slice(2, 10);
	return `post-history-visible-relation-repair-${Date.now().toString(36)}-${e}`;
}
function Ar(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of t) if ([
		1,
		42,
		1111
	].includes(r.kind) && r.pubkeyHex === e && r.eventId && !n.has(r.eventId) && (n.set(r.eventId, r), n.size >= 150)) break;
	return Array.from(n.values());
}
function jr(e, t) {
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
function Mr(e, t) {
	return t.includeDirectReplies ? [
		1,
		42,
		1111
	].flatMap((t) => jr(e.filter((e) => e.kind === t), 30).map((e) => ({
		posts: e,
		depth: 0
	}))) : jr(e, 30).map((e) => ({
		posts: e,
		depth: 0
	}));
}
function Nr(e) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls).sort((e, t) => e.localeCompare(t))
	})).sort((e, t) => e.event.created_at === t.event.created_at ? e.event.id.localeCompare(t.event.id) : t.event.created_at - e.event.created_at);
}
var Pr = new class {
	directReplySaveService;
	childInteractionsRepository;
	quoteVisibleRangeRepairExecutor;
	console;
	setTimeoutFn;
	clearTimeoutFn;
	now;
	constructor(e = {}) {
		this.directReplySaveService = e.directReplySaveService ?? xr, this.childInteractionsRepository = e.childInteractionsRepository ?? ve, this.quoteVisibleRangeRepairExecutor = e.quoteVisibleRangeRepairExecutor, this.console = e.console ?? (globalThis.console === void 0 ? {
			warn: () => void 0,
			error: () => void 0
		} : globalThis.console), this.setTimeoutFn = e.setTimeoutFn ?? ((e, t) => setTimeout(e, t)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((e) => clearTimeout(e)), this.now = e.now ?? Date.now;
	}
	repairVisibleRangeChildInteractions(e, t) {
		return this.repairVisibleRangeChildInteractionsInternal(e, t, {
			includeDirectReplies: !0,
			includeReactions: !0
		});
	}
	repairRelatedCardReactions(e, t) {
		let n = !0, r = /* @__PURE__ */ new Set(), i = () => n && t.isActive?.() !== !1, a = /* @__PURE__ */ new Map();
		for (let e of t.targets) {
			if (!e.eventId) continue;
			let t = a.get(e.eventId);
			a.set(e.eventId, {
				eventId: e.eventId,
				targetAuthorPubkey: e.targetAuthorPubkey ?? t?.targetAuthorPubkey,
				targetKind: e.targetKind ?? t?.targetKind,
				relayHints: W.sanitizeExternalRelayUrls([...t?.relayHints ?? [], ...e.relayHints])
			});
		}
		let o = Array.from(a.values()).slice(0, 150), s = o.map((e) => e.eventId), c = pe(X);
		return {
			promise: (async () => {
				if (o.length === 0) return {
					status: "success",
					targetEventIds: s
				};
				let n = !1, a = [];
				for (let e = 0; e < o.length; e += 30) a.push(o.slice(e, e + 30).map((e) => ({
					eventId: e.eventId,
					kind: 1,
					relayHints: e.relayHints,
					reactionTarget: {
						eventId: e.eventId,
						targetAuthorPubkey: e.targetAuthorPubkey,
						targetKind: e.targetKind
					}
				})));
				let l = 0, u = async (a, o) => {
					if (!i()) return;
					let s = this.fetchCandidates(e, a, t.relayConfig, {
						includeDirectReplies: !1,
						includeReactions: !0
					});
					r.add(s);
					let l = await s.promise;
					if (r.delete(s), !i() || l.status === "cancelled") return;
					let d = o === 0 && l.requiresFallback;
					l.status !== "success" && !d && (n = !0);
					let f = this.toReactionItems(a.map((e) => e.reactionTarget ?? { eventId: e.eventId }), l.items);
					if (f.length > 0 && await this.saveReactionInteractions(f, l.fetchedAt, i, await c), l.requiresFallback) {
						if (o === 0) for (let e = 0; e < a.length; e += 10) await u(a.slice(e, e + 10), 1);
						else l.coverageSaturated && (n = !0);
					}
				}, d = async () => {
					for (; i();) {
						let e = a[l++];
						if (!e) return;
						await u(e, 0);
					}
				};
				return await Promise.all(Array.from({ length: Math.min(2, a.length) }, () => d())), {
					status: i() ? n ? "partial" : "success" : "cancelled",
					targetEventIds: s
				};
			})(),
			cancel: () => {
				n = !1, r.forEach((e) => e.cancel());
			}
		};
	}
	repairVisibleRangeRelations(e, t) {
		let n = Cr(t.relationKinds ?? Dr), r = this.repairVisibleRangeChildInteractionsInternal(e, t, {
			includeDirectReplies: n.includes("reply"),
			includeReactions: n.includes("reaction")
		});
		return {
			promise: (async () => {
				let i = await r.promise, a = !1, o = t.quoteVisibleRangeRepairExecutor ?? this.quoteVisibleRangeRepairExecutor;
				return n.includes("quote") && i.status !== "cancelled" && t.isActive?.() !== !1 && o && (await o(e, t), a = !0), {
					...i,
					relationKinds: n,
					quoteRepairApplied: a
				};
			})(),
			cancel: () => r.cancel()
		};
	}
	repairVisibleRangeChildInteractionsInternal(e, t, n) {
		let r = !0, i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = () => r && t.isActive?.() !== !1, s = Ar(t.ownerPubkeyHex, t.visiblePosts), c = s.map((e) => e.eventId), l = pe(X);
		return {
			promise: (async () => {
				if (s.length === 0) return {
					...Or,
					targetParentEventIds: c
				};
				let r = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), d = 0, f = 0, p = 0, m = !1, h = !1, g = async (s) => {
					let c = [], g = 0, _ = Math.min(2, s.length), v = async () => {
						for (; o();) {
							let _ = s[g++];
							if (!_) return;
							f += 1;
							let v = this.fetchCandidates(e, _.posts, t.relayConfig, n);
							i.add(v);
							let y = await v.promise;
							if (i.delete(v), !o() || y.status === "cancelled") return;
							let b = _.depth === 0 && y.requiresFallback;
							y.status !== "success" && !b && (h = !0), y.requiresFallback && (p += 1, _.depth === 0 ? c.push(...jr(_.posts, 10).map((e) => ({
								posts: e,
								depth: 1
							}))) : y.coverageSaturated && (h = !0));
							let x = n.includeDirectReplies ? this.toDirectReplyItems(_.posts, y.items) : [], S = n.includeReactions ? this.toReactionItems(_.posts.map((e) => ({
								eventId: e.eventId,
								targetAuthorPubkey: e.pubkeyHex,
								targetKind: e.kind
							})), y.items) : [], C = y.status === "success" && !y.coverageSaturated && !(_.depth === 0 && y.requiresFallback);
							if (x.length === 0 && S.length === 0) C && _.posts.forEach((e) => u.add(e.eventId));
							else {
								if (x.length > 0) {
									let n = this.directReplySaveService.saveRepairDirectReplies(e, {
										items: x,
										expectedChildGeneration: await l,
										relayHints: [...this.collectParentRelayHints(_.posts), ...y.relayUrls],
										relayConfig: t.relayConfig,
										fetchedAt: y.fetchedAt,
										isActive: o
									});
									a.add(n);
									let i = await n.promise;
									if (a.delete(n), !o() || i.status === "cancelled") return;
									i.savedParentEventIds.forEach((e) => r.add(e)), d += i.savedDirectReplyCount, m ||= i.deletionConfirmationIncomplete;
								}
								if (S.length > 0) {
									let e = await this.saveReactionInteractions(S, y.fetchedAt, o, await l);
									if (!o()) return;
									e.savedParentEventIds.forEach((e) => r.add(e));
								}
								C && _.posts.forEach((e) => u.add(e.eventId));
							}
						}
					};
					return await Promise.all(Array.from({ length: _ }, () => v())), c;
				}, _ = await g(Mr(s, n));
				if (o() && _.length > 0 && await g(_), !o()) return {
					...Or,
					status: "cancelled",
					targetParentEventIds: c,
					attemptedChunkCount: f,
					saturatedChunkCount: p,
					deletionConfirmationIncomplete: m
				};
				let v = c.filter((e) => !u.has(e));
				return {
					status: h || v.length > 0 ? "partial" : "success",
					targetParentEventIds: c,
					checkedParentEventIds: Array.from(u),
					savedParentEventIds: Array.from(r),
					savedDirectReplyCount: d,
					attemptedChunkCount: f,
					saturatedChunkCount: p,
					incompleteParentEventIds: v,
					deletionConfirmationIncomplete: m
				};
			})(),
			cancel: () => {
				r = !1, i.forEach((e) => e.cancel()), a.forEach((e) => e.cancel());
			}
		};
	}
	toDirectReplyItems(e, t) {
		let n = new Map(e.flatMap((e) => {
			let t = He({
				event: {
					id: e.eventId,
					kind: e.kind,
					tags: e.tags,
					created_at: e.createdAt
				},
				relayHints: [
					...e.relayHints,
					...e.acceptedRelays,
					...e.fetchedRelays ?? []
				]
			});
			return t ? [[e.eventId, t]] : [];
		}));
		return t.flatMap((e) => {
			let t = q(e.event).parentId, r = t ? n.get(t) : null;
			return !t || !r || !ot({
				child: e.event,
				parent: r
			}).valid ? [] : [{
				parentEventId: t,
				event: e.event,
				relayUrls: e.relayUrls
			}];
		});
	}
	toReactionItems(e, t) {
		let n = new Map(e.map((e) => [e.eventId, e]));
		return t.flatMap((e) => {
			if (e.event.kind !== 7) return [];
			let t = ye(e.event).reference, r = t ? n.get(t.eventId) : void 0;
			return !t || !r || !de(t, r) || e.event.id === t.eventId ? [] : [{
				parentEventId: t.eventId,
				event: e.event,
				relayUrls: e.relayUrls,
				reactionTarget: r
			}];
		});
	}
	async saveReactionInteractions(e, t, n, r) {
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
		for (let t of e) {
			let e = i.get(t.parentEventId) ?? [];
			e.push({
				event: t.event,
				relayUrls: t.relayUrls
			}), i.set(t.parentEventId, e), t.reactionTarget && a.set(t.parentEventId, t.reactionTarget);
		}
		let o = [];
		for (let [e, s] of i.entries()) {
			if (!n()) break;
			let i = a.get(e), c = await this.childInteractionsRepository.upsertChildInteractions({
				parentEventId: e,
				expectedChildGeneration: r,
				events: s,
				fetchedAt: t,
				...i && (i.targetKind != null || i.targetAuthorPubkey != null) ? { reactionTarget: i } : {}
			});
			c.insertedCount + c.updatedCount > 0 && o.push(e);
		}
		return { savedParentEventIds: o };
	}
	fetchCandidates(e, t, n, r) {
		let { destinationRelayUrls: i, coverageRelayUrls: a } = this.resolveRelayPlan(t, n), o = t.map((e) => e.eventId), s = kr(), c = `${s}:0`, l = ze(s), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), g = 0, _ = !1, v, y, b, x, S, C, w = () => {
			v?.unsubscribe?.(), v = void 0, y?.unsubscribe?.(), y = void 0, b?.unsubscribe?.(), b = void 0, x?.unsubscribe?.(), x = void 0;
		}, T = (e) => {
			let t = Nr(u), n = new Set(Array.from(d.entries()).filter(([, e]) => e >= 250).map(([e]) => e)), r = a.some((e) => n.has(e)), o = a.length > 0 && a.every((e) => f.has(e));
			return {
				status: e === "cancelled" ? "cancelled" : e === "error" ? "error" : o ? "success" : "partial",
				items: t,
				rawCount: g,
				requiresFallback: n.size > 0,
				coverageSaturated: r,
				fetchedAt: this.now(),
				relayUrls: i,
				eoseRelayUrls: Array.from(f).sort(),
				closedRelayUrls: Array.from(p).sort(),
				errorRelayUrls: Array.from(m).sort(),
				downRelayUrls: Array.from(h).sort(),
				perRelayRawCounts: Array.from(d.entries()).map(([e, t]) => ({
					relayUrl: e,
					rawCount: t
				})).sort((e, t) => e.relayUrl.localeCompare(t.relayUrl))
			};
		};
		return {
			promise: new Promise((n) => {
				let a = (e) => {
					_ || (_ = !0, S?.finish(e === "complete" ? "complete" : e), n(T(e)));
				};
				C = a, S = new Be(Tr, (e) => a(e === "cancelled" ? "cancelled" : e === "timeout" ? "timeout" : "complete"), {
					now: this.now,
					setTimeoutFn: this.setTimeoutFn,
					clearTimeoutFn: this.clearTimeoutFn
				}), S.add(w);
				try {
					if (o.length === 0) {
						a("complete");
						return;
					}
					y = e.createAllMessageObservable?.().subscribe({ next: (e) => {
						this.handleCandidateMessagePacket({
							packet: e,
							targetSubId: c,
							destinationRelayUrls: i,
							eoseRelayUrls: f,
							closedRelayUrls: p,
							perRelayRawCounts: d
						});
					} }), b = e.createAllErrorObservable?.().subscribe({ next: (e) => {
						let t = this.sanitizeCandidateRelayUrl(e.from, i);
						t && m.add(t);
					} }), x = e.createConnectionStateObservable?.().subscribe({ next: (e) => {
						let t = this.sanitizeCandidateRelayUrl(e.from, i);
						t && (e.state === "error" || e.state === "rejected" || e.state === "terminated") && h.add(t);
					} }), v = he(e, l, { on: i.length > 0 ? { relays: i } : { defaultReadRelays: !0 } }).subscribe({
						next: (e) => {
							g += 1;
							let t = this.sanitizeCandidateRelayUrl(e.from, i);
							this.handleCandidatePacket(u, e, t);
						},
						complete: () => a("complete"),
						error: (e) => {
							this.console.error("post_history_visible_child_interaction_repair_fetch_error", e), a("error");
						}
					});
					let n = r.includeDirectReplies ? t.flatMap((e) => e.kind === 1 ? [1, 1111] : e.kind === 42 ? [42] : e.kind === 1111 ? [1111] : []) : [], s = Array.from(/* @__PURE__ */ new Set([...n, ...r.includeReactions ? [7] : []])).sort((e, t) => e - t);
					l.emit({
						kinds: s,
						"#e": o,
						limit: 250
					}), l.over();
				} catch (e) {
					this.console.error("post_history_visible_child_interaction_repair_request_error", e), a("error");
				}
			}),
			cancel: () => C?.("cancelled")
		};
	}
	handleCandidatePacket(e, t, n) {
		let r = t.event;
		if (!r?.id || ![
			1,
			7,
			42,
			1111
		].includes(r.kind)) return;
		let i = e.get(r.id);
		i ? G(i.event, r) ? n && i.relayUrls.add(n) : this.console.warn("post_history_visible_child_interaction_repair_packet_conflict") : e.set(r.id, {
			event: r,
			relayUrls: new Set(n ? [n] : [])
		});
	}
	collectParentRelayHints(e) {
		return e.flatMap((e) => [
			...e.relayHints ?? [],
			...e.acceptedRelays ?? [],
			...e.fetchedRelays ?? []
		]);
	}
	handleCandidateMessagePacket(e) {
		let t = this.sanitizeCandidateRelayUrl(e.packet.from, e.destinationRelayUrls);
		t && (e.packet.type === "EVENT" && e.packet.subId === e.targetSubId ? e.perRelayRawCounts.set(t, (e.perRelayRawCounts.get(t) ?? 0) + 1) : e.packet.type === "EOSE" && e.packet.subId === e.targetSubId ? e.eoseRelayUrls.add(t) : e.packet.type === "CLOSED" && e.packet.subId === e.targetSubId && e.closedRelayUrls.add(t));
	}
	sanitizeCandidateRelayUrl(e, t) {
		let n = W.sanitizeExternalRelayUrls(typeof e == "string" ? [e] : [], { limit: 1 })[0] ?? null;
		return n && t.includes(n) ? n : null;
	}
	resolveRelayPlan(e, t) {
		let n = this.collectParentRelayHints(e), r = Ae(n, Er);
		if (r !== null) return {
			destinationRelayUrls: r,
			coverageRelayUrls: Me()
		};
		let i = t ? W.sanitizeExternalRelayUrls(W.extractReadRelays(t)) : [], a = t ? W.sanitizeExternalRelayUrls(W.extractWriteRelays(t)) : [], o = W.sanitizeExternalRelayUrls(H), s = i.length > 0 ? i : a.length > 0 ? a : o, c = i.length > 0 ? a.filter((e) => !s.includes(e)) : [], l = W.sanitizeExternalRelayUrls(n, { limit: Er });
		return {
			coverageRelayUrls: s,
			destinationRelayUrls: W.sanitizeExternalRelayUrls([
				...s,
				...c,
				...l
			])
		};
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryRelatedReactions.svelte.ts
function Fr(e) {
	let t = g({}), n = g({}), r = g({}), i = g(0), a = 0, o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map(), l = null, u = e.source ?? "related-card-display", d = e.profileSync.subscribe((t, r) => {
		e.getShow() && S(n, {
			...I(n),
			[t]: r
		});
	}), f = () => {
		S(i, I(i) + 1);
	}, p = () => {
		document.visibilityState === "visible" && S(i, I(i) + 1);
	};
	P(() => {
		if (e.getShow() && typeof window < "u") return window.addEventListener("online", f), document.addEventListener("visibilitychange", p), () => {
			window.removeEventListener("online", f), document.removeEventListener("visibilitychange", p);
		};
	}), F(() => {
		a += 1, l?.cancel(), typeof window < "u" && (window.removeEventListener("online", f), document.removeEventListener("visibilitychange", p)), d();
	});
	function m(e) {
		return I(r)[e] ? Jn(I(t)[e] ?? [], I(n)) : null;
	}
	function h(e) {
		return !!I(r)[e];
	}
	P(() => {
		let d = e.getShow(), f = e.getPubkeyHex() ?? "", p = e.getRxNostr(), m = e.getRelayConfig(), h = e.getTargets(), g = I(i);
		if (!d) {
			a += 1, l?.cancel(), l = null, s.clear(), (e.getSessionOpen ?? e.getShow)() || (o.clear(), c.clear(), S(t, {}), S(r, {}));
			return;
		}
		let _ = ++a, v = !0, y = null, b = () => v && _ === a && e.getShow() && (e.getPubkeyHex() ?? "") === f && e.getRxNostr() === p, x = /* @__PURE__ */ new Map();
		for (let e of h) {
			if (!e.eventId) continue;
			let t = x.get(e.eventId);
			x.set(e.eventId, {
				eventId: e.eventId,
				targetAuthorPubkey: e.targetAuthorPubkey ?? t?.targetAuthorPubkey,
				targetKind: e.targetKind ?? t?.targetKind,
				relayHints: Array.from(/* @__PURE__ */ new Set([...t?.relayHints ?? [], ...e.relayHints])).sort()
			});
		}
		let C = Array.from(x.values()), w = C.map((e) => e.eventId), T = JSON.stringify(Object.entries(m ?? {}).sort(([e], [t]) => e.localeCompare(t))), E = (e) => JSON.stringify([
			e.eventId,
			e.targetAuthorPubkey,
			e.targetKind,
			e.relayHints,
			T
		]), D = (e) => JSON.stringify([E(e), g]), O = new Set(C.map((e) => e.eventId));
		for (let e of c.keys()) O.has(e) || c.delete(e);
		return C.forEach((e) => c.set(e.eventId, D(e))), (async () => {
			let a = await $.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => $.getReactionRecords(e, x.get(e))))).flat();
			if (!b()) return;
			let d = {};
			for (let e of w) d[e] = a.filter((t) => t.parentEventId === e);
			S(t, {
				...I(t),
				...d
			}), S(r, {
				...I(r),
				...Object.fromEntries(w.map((e) => [e, !0]))
			});
			for (let t of a) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && S(n, {
					...I(n),
					[t.authorPubkey]: r
				});
			}
			if (!p || w.length === 0 || (await rt({
				source: u,
				parentEventIds: w,
				rxNostr: p,
				relayConfig: m,
				isActive: b
			}), !b())) return;
			let h = await $.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => $.getReactionRecords(e, x.get(e))))).flat();
			if (!b()) return;
			for (let e of w) d[e] = h.filter((t) => t.parentEventId === e);
			S(t, {
				...I(t),
				...d
			});
			let g = C.filter((e) => !o.has(E(e)) && !s.has(e.eventId));
			if (!g.length) return;
			g.forEach((e) => s.add(e.eventId));
			let _ = new Map(g.map((e) => [e.eventId, D(e)]));
			y = Pr.repairRelatedCardReactions(p, {
				targets: g,
				relayConfig: m,
				isActive: b
			}), l = y;
			let v = await y.promise.catch(() => ({
				status: "partial",
				targetEventIds: g.map((e) => e.eventId)
			}));
			l === y && (l = null), y = null, g.forEach((e) => s.delete(e.eventId));
			let T = e.getShow() && (e.getPubkeyHex() ?? "") === f && e.getRxNostr() === p, O = g.some((e) => {
				let t = c.get(e.eventId);
				return t !== void 0 && (v.status === "cancelled" || t !== _.get(e.eventId));
			});
			if (T && O && S(i, I(i) + 1), !b() || v.status === "cancelled") return;
			if (v.status === "success") {
				let e = new Set(v.targetEventIds);
				g.filter((t) => e.has(t.eventId)).forEach((e) => o.add(E(e)));
			}
			let k = await $.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => $.getReactionRecords(e, x.get(e))))).flat();
			if (!b()) return;
			for (let e of w) d[e] = k.filter((t) => t.parentEventId === e);
			S(t, {
				...I(t),
				...d
			});
			for (let t of k) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && S(n, {
					...I(n),
					[t.authorPubkey]: r
				});
			}
			let A = await rt({
				source: u,
				parentEventIds: w,
				rxNostr: p,
				relayConfig: m,
				isActive: b
			});
			if (b() && A.deletedReactionEventIds.length > 0) {
				let e = await $.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => $.getReactionRecords(e, x.get(e))))).flat();
				if (!b()) return;
				for (let t of w) d[t] = e.filter((e) => e.parentEventId === t);
				S(t, {
					...I(t),
					...d
				});
			}
		})().catch(() => void 0), () => {
			v = !1, y?.cancel(), l === y && (l = null);
		};
	});
	async function _(i) {
		let o = a, s = e.getPubkeyHex(), c = e.getRxNostr(), l = e.getTargets().filter((e) => i.includes(e.eventId)), u = await Promise.all(l.map((e) => $.getReactionRecords(e.eventId, e)));
		o === a && e.getShow() && e.getPubkeyHex() === s && e.getRxNostr() === c && l.forEach((i, a) => {
			S(t, {
				...I(t),
				[i.eventId]: u[a]
			}), S(r, {
				...I(r),
				[i.eventId]: !0
			});
			for (let t of u[a]) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && S(n, {
					...I(n),
					[t.authorPubkey]: r
				});
			}
		});
	}
	function v() {
		a++, l?.cancel(), l = null, s.clear();
	}
	return {
		getReadModel: m,
		isLoaded: h,
		refreshCachedReactions: _,
		suspend: v
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryPostActionUiController.svelte.ts
function Ir() {
	let e = g(A({})), t = g(!1), n = g(null);
	function r(t) {
		return I(e)[t] ?? !1;
	}
	function i(t, n) {
		S(e, {
			...I(e),
			[t]: n
		}, !0);
	}
	function a() {
		Object.keys(I(e)).length > 0 && S(e, {}, !0);
	}
	function o(e) {
		S(t, e, !0), e || S(n, null);
	}
	function s(e) {
		a(), S(n, e, !0), S(t, !0);
	}
	function c() {
		o(!1);
	}
	function l() {
		S(n, null);
	}
	function u() {
		S(t, !1), S(n, null);
	}
	function d() {
		S(e, {}, !0), u();
	}
	return {
		get deleteConfirmOpen() {
			return I(t);
		},
		get deleteTargetPost() {
			return I(n);
		},
		isPostMenuOpen: r,
		setPostMenuOpen: i,
		closeAllPostItemMenus: a,
		setDeleteConfirmOpen: o,
		openDeleteConfirm: s,
		cancelDeleteConfirm: c,
		clearDeleteTarget: l,
		resetDeleteConfirmation: u,
		reset: d
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postDeletionService.ts
var Lr = [
	1,
	6,
	7,
	16,
	42,
	1111
];
function Rr() {
	return {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	};
}
function zr(e, t) {
	return !t || e.pubkeyHex !== t || typeof e.deletedAt == "number" ? !1 : Lr.includes(e.kind) && typeof e.eventId == "string" && e.eventId.length > 0;
}
function Br(e, t = Math.floor(Date.now() / 1e3), n) {
	let r = [["e", e.eventId], ["k", String(e.kind)]];
	return n && r.push(["e", n], ["k", "36"]), {
		kind: 5,
		pubkey: e.pubkeyHex,
		content: "",
		tags: r,
		created_at: t
	};
}
function Vr(e, t, n) {
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
var Hr = new class {
	deps;
	constructor(e = {}) {
		this.deps = {
			authStateStore: e.authStateStore ?? Oe,
			keyManager: e.keyManager ?? Le,
			window: e.window ?? (typeof window < "u" ? window : {}),
			console: e.console ?? (globalThis.console === void 0 ? Rr() : globalThis.console),
			seckeySignerFn: e.seckeySignerFn ?? De,
			getNip46SignerForSessionFn: e.getNip46SignerForSessionFn ?? ((e) => Re.getSignerForSession(e)),
			getParentClientSignerFn: e.getParentClientSignerFn ?? (() => Ee.getSigner()),
			writeRelaysStore: e.writeRelaysStore ?? ke,
			postHistoryDeletionRequestsRepository: e.postHistoryDeletionRequestsRepository ?? Xe,
			eventSenderFactory: e.eventSenderFactory,
			sensitivePayloadRepository: e.sensitivePayloadRepository ?? xe,
			fetchPayloadFn: e.fetchPayloadFn ?? Ye.fetchEventById.bind(Ye),
			saveSensitivePayloadFn: e.saveSensitivePayloadFn ?? xe.putCandidate.bind(xe),
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
		if (je() && W.sanitizeExternalRelayUrls(this.deps.writeRelaysStore.value).length === 0) return {
			success: !1,
			error: "no_write_relays"
		};
		let r = () => Ce(this.deps.authStateStore, n);
		if (!zr(e.post, n)) return {
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
		let a = this.resolveSigner(t, i);
		if (a.error) return {
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
		let o = await this.resolveAssociatedPayload(e.post, e.rxNostr), s = ie(e.post.rawEvent) && !!re(e.post.rawEvent) && !o, c = Br(e.post, Math.floor(this.deps.now() / 1e3), o?.id), l;
		try {
			r();
			let e = Te(c), t = await a.signEvent(e.signerTemplate);
			r(), l = we(e.expectedTemplate, t, n), r();
		} catch {
			return this.deps.console.error("post_deletion_sign_failed", {
				stage: "sign-event",
				reason: "unexpected"
			}), {
				success: !1,
				error: "post_error"
			};
		}
		let u = oe(l);
		if (!u) return {
			success: !1,
			error: "post_error"
		};
		let d = Vr(e.post, this.deps.writeRelaysStore.value, o), f;
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
				targetEvent: ie(e.post.rawEvent) ? e.post.rawEvent : void 0,
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
		return this.deps.eventSenderFactory ? this.deps.eventSenderFactory(e, this.deps.console) : new Ve(e, this.deps.console);
	}
	async resolveAssociatedPayload(e, t) {
		let n = e.rawEvent;
		if (!ie(n)) return;
		let r = re(n);
		if (!r || n.id !== e.eventId || n.pubkey !== e.pubkeyHex) return;
		let i;
		try {
			[i] = await this.deps.sensitivePayloadRepository.getByIds([r.eventId]);
		} catch {
			return;
		}
		if (i?.deletedAt !== void 0) return;
		if (!i) {
			let a = await be(X, e.pubkeyHex), o = this.deps.fetchPayloadFn(t, {
				eventId: r.eventId,
				relayHints: W.sanitizeExternalRelayUrls([
					...r.relayHint ? [r.relayHint] : [],
					...e.acceptedRelays ?? [],
					...e.fetchedRelays ?? [],
					...e.relayHints ?? []
				]),
				relayConfig: Ne.value
			});
			try {
				let t = await o.promise;
				if (!t.event || !ue(n, t.event, r.eventId)) return;
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
		if (ue(n, a, r.eventId)) return {
			id: r.eventId,
			acceptedRelays: i.acceptedRelays,
			fetchedRelays: i.fetchedRelays
		};
	}
	resolveSigner(e, t) {
		if (e.type === "nip07") {
			let e = this.deps.window.nostr?.signEvent;
			return typeof e == "function" ? { signEvent: e.bind(this.deps.window.nostr) } : { error: "nostr_sign_event_not_supported" };
		}
		if (e.type === "nip46") return this.resolveExternalSigner(t, "nip46_signer_not_available");
		if (e.type === "parentClient") return this.resolveExternalSigner(this.deps.getParentClientSignerFn(), "parent_client_signer_not_available");
		let n = this.deps.keyManager.getFromStore() || this.deps.keyManager.loadFromStorage(e.pubkey);
		return n ? this.resolveExternalSigner(this.deps.seckeySignerFn(n), "nostr_sign_event_not_supported") : { error: "key_not_found" };
	}
	resolveExternalSigner(e, t) {
		return e ? typeof e.signEvent == "function" ? { signEvent: e.signEvent.bind(e) } : { error: "nostr_sign_event_not_supported" } : { error: t };
	}
}({ storeSignedEventsFn: (e, t) => nt.storeSignedEventsBestEffort(e, t) });
// D:/ドキュメント/GitHub/ehagaki/src/lib/postBroadcastService.ts
function Ur() {
	return {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	};
}
function Wr(e) {
	let t = e.rawEvent;
	if (!t || typeof t != "object") return null;
	let n = t;
	return typeof n.id != "string" || typeof n.pubkey != "string" || typeof n.created_at != "number" || typeof n.kind != "number" || !Array.isArray(n.tags) || typeof n.content != "string" || typeof n.sig != "string" ? null : n;
}
var Gr = new class {
	deps;
	constructor(e = {}) {
		this.deps = {
			writeRelaysStore: e.writeRelaysStore ?? ke,
			console: e.console ?? (globalThis.console === void 0 ? Ur() : globalThis.console)
		};
	}
	async broadcast(e) {
		if (!e.rxNostr) return {
			success: !1,
			error: "nostr_not_ready"
		};
		let t = e.rxNostr, n = Wr(e.post);
		if (!n) return {
			success: !1,
			error: "invalid_event"
		};
		let r = W.sanitizeExternalRelayUrls(this.deps.writeRelaysStore.value);
		return r.length === 0 ? {
			success: !1,
			error: "no_write_relays"
		} : new Ve(t, this.deps.console).sendEvent(n, {
			targetRelays: r,
			includeDefaultWriteRelays: !1
		});
	}
}();
export { nn as A, yn as C, rn as D, en as E, Yt as F, Vt as I, Mt as L, an as M, on as N, sn as O, Xt as P, kt as R, vn as S, dn as T, Bn as _, Ir as a, Dn as b, Sr as c, hr as d, fr as f, qn as g, Jn as h, Hr as i, ln as j, cn as k, wr as l, Vn as m, Wr as n, Fr as o, ar as p, zr as r, Pr as s, Gr as t, gr as u, zn as v, gn as w, Sn as x, Fn as y, Et as z };
