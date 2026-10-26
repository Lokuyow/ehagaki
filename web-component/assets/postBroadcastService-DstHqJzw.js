import { At as e, B as t, C as n, Ct as r, F as i, G as a, J as o, M as s, N as c, R as l, T as u, U as d, W as f, Y as p, a as m, at as h, ct as g, dt as _, et as v, ft as y, g as b, gt as x, i as S, jt as C, k as w, kt as T, lt as E, mt as D, nt as O, o as k, ot as A, q as j, r as M, s as N, t as P, tt as F, ut as I, v as L, w as R, wt as z, yt as B } from "./index-client-Bdka-Daw.js";
import { n as V } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { i as H, l as U, n as W } from "./relayConfigUtils-DD5f1UAM.js";
import { a as G, i as K, l as q, o as J, t as ee } from "./postHistoryEventUtils-CUIBkIiy.js";
import { pt as Y } from "./LoadingPlaceholder-j1_vRYno.js";
import { i as te, n as ne, t as re, u as ie, v as ae } from "./signedEventResultValidator-vNb8KnFy.js";
import { r as oe } from "./authStore.svelte-CoGdd5_Z.js";
import { f as se, h as ce, m as le, p as ue, s as de } from "./relayStore.svelte-BIc4bQdy.js";
import { c as X, l as fe, nt as pe, u as me } from "./appUtils-C7IXsQBk.js";
import { c as he, n as ge } from "./nip46Service-DpHqlqsg.js";
import { t as _e } from "./rx-nostr-BHeS362x.js";
import { n as ve } from "./postEventBuilder-Bzn07ZW2.js";
import { A as ye, D as be, E as xe, J as Se, K as Ce, M as we, N as Te, T as Ee, X as De, _ as Oe, a as ke, c as Ae, ct as je, g as Me, i as Ne, j as Z, k as Pe, n as Fe, nt as Ie, o as Le, q as Re, s as ze, v as Be } from "./nip65RelayDirectory-BTlaIUmx.js";
import { C as Ve, D as He, F as Ue, G as We, H as Ge, I as Ke, J as qe, O as Je, Q as Ye, R as Xe, S as Ze, T as Qe, X as $e, Y as et, Z as tt, i as nt, k as rt, q as it, w as at, x as Q } from "./sensitiveContentPayloadReader-C2SL7kJU.js";
import { c as $ } from "./legacyImportMarkers-CZ4J2IrE.js";
import { a as ot, i as st, n as ct, r as lt, t as ut } from "./menu-trigger-DMUMT31S.js";
import { t as dt } from "./DialogWrapper-B6dIEHnd.js";
import { t as ft } from "./dialog-close-BqMvQbkH.js";
import { i as pt, n as mt, r as ht, t as gt } from "./tabs-trigger-CTsCGK_5.js";
import { c as _t, d as vt, t as yt } from "./customEmoji-Bvbh2sQz.js";
import { J as bt, nt as xt } from "./App-CPn8s-cx.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPreviewFooter.svelte
var St = a("<div><div class=\"post-preview-footer-left svelte-r1d5vb\"><span class=\"post-preview-date svelte-r1d5vb\"> </span> <!></div> <div class=\"post-preview-footer-actions svelte-r1d5vb\"><!></div> <div class=\"post-preview-footer-right svelte-r1d5vb\"><!></div></div>"), Ct = {
	hash: "svelte-r1d5vb",
	code: ".post-preview-footer.svelte-r1d5vb {display:grid;grid-template-columns:minmax(0, 120px) minmax(144px, 1fr) 36px;align-items:stretch;height:36px;--post-history-preview-action-icon-size: 20px;color:var(--btn-post-preview-action);--post-history-preview-footer-surface: var(--dialog-bg);}.post-preview-footer-regular.svelte-r1d5vb {padding-inline-start:1rem;}\n\n    /* React and the count share one cell. Reserve their intrinsic width before shrinking the date. */.post-preview-footer:has(.reaction-compose-button) {grid-template-columns:minmax(0, 120px) minmax(min-content, 1fr) 36px;}.post-preview-action-buttons-group:has(.reaction-compose-button) {grid-template-columns:minmax(72px, 1fr) minmax(36px, 1fr) minmax(72px, 1fr);}.post-preview-footer-compact.svelte-r1d5vb {padding-inline-start:1rem;--post-history-preview-footer-surface: var(\n            --post-history-related-card-bg,\n            var(--dialog-bg)\n        );}.post-preview-footer.is-dimmed.svelte-r1d5vb {opacity:0.65;}.post-preview-footer-left.svelte-r1d5vb,\n    .post-preview-footer-actions.svelte-r1d5vb,\n    .post-preview-footer-right.svelte-r1d5vb {display:flex;align-items:stretch;}.post-preview-footer-left.svelte-r1d5vb {align-items:center;justify-content:flex-start;min-width:0;}.post-preview-footer-actions.svelte-r1d5vb {justify-content:stretch;min-width:0;}.post-preview-footer-right.svelte-r1d5vb {align-items:center;justify-content:flex-end;min-width:0;}.post-preview-date.svelte-r1d5vb {overflow:hidden;color:var(--text-muted);font-size:0.875rem;text-overflow:ellipsis;white-space:nowrap;}.post-preview-footer-regular.svelte-r1d5vb .post-preview-date:where(.svelte-r1d5vb) {font-size:0.9375rem;}.post-preview-footer-replies-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-reply-button-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-footer-reaction-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;max-width:100%;}.post-history-action-button,\n    .post-preview-reactions-button {min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface);background-color:var(--post-history-preview-footer-surface);}.post-preview-action-buttons-group {display:grid;grid-template-columns:minmax(72px, 1fr) repeat(2, minmax(36px, 1fr));align-items:stretch;width:100%;min-width:0;}.post-preview-action-cell {display:flex;align-items:stretch;justify-content:center;min-width:0;}.post-preview-reply-action-cell {display:grid;grid-template-columns:36px 36px;justify-content:center;}.post-preview-reaction-action-cell:has(.reaction-compose-button) {display:grid;grid-template-columns:36px 36px;justify-content:center;}.post-preview-quote-action-cell,\n    .post-preview-reaction-action-cell {justify-content:center;}.post-preview-reaction-action-cell .post-preview-footer-reaction-slot {max-width:100%;}.post-preview-action-button {position:relative;}.post-history-action-button {width:36px;min-width:36px;color:var(--btn-post-preview-action);}.post-history-action-button .svg-icon {--svg: currentColor;}.post-preview-footer :is(.reply-icon, .quote-icon, .reaction-compose-icon).svg-icon {width:var(--post-history-preview-action-icon-size);height:var(--post-history-preview-action-icon-size);}.post-preview-footer .reply-icon.svg-icon {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-preview-footer .quote-icon.svg-icon {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function wt(n, i) {
	z(i, !0), w(n, Ct);
	let a = M(i, "density", 3, "regular"), o = M(i, "dimmed", 3, !1), s = M(i, "leftExtras", 3, void 0), l = M(i, "actions", 3, void 0), f = M(i, "trailing", 3, void 0);
	var p = St(), m = g(p), v = g(m), y = I(v, !0), b = _(v, 2);
	c(b, () => s() ?? C), e(m);
	var x = _(m, 2), S = g(x);
	c(S, () => l() ?? C), e(x);
	var T = _(x, 2), E = g(T);
	c(E, () => f() ?? C), e(T), e(p), h((e) => {
		R(p, 1, e, "svelte-r1d5vb"), t(y, i.formattedDate);
	}, [() => u(`post-preview-footer post-preview-footer-${a()} ${o() ? "is-dimmed" : ""}`.trim())]), d(n, p), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRelatedEventCard.svelte
var Tt = a("<img class=\"post-history-related-avatar svelte-1g9bqtt\"/>"), Et = a("<span class=\"post-history-related-avatar-placeholder svelte-1g9bqtt\" aria-hidden=\"true\"></span>"), Dt = a("<article class=\"post-history-related-card svelte-1g9bqtt\"><!> <div class=\"post-history-related-card-body svelte-1g9bqtt\"><div class=\"post-history-related-author svelte-1g9bqtt\"><!> <span class=\"post-history-related-author-name svelte-1g9bqtt\"> </span></div> <!> <!> <!></div></article>"), Ot = {
	hash: "svelte-1g9bqtt",
	code: ".post-history-related-card.svelte-1g9bqtt {display:grid;margin-inline-start:-2px;--post-history-related-card-bg: color-mix(\n            in srgb,\n            var(--dialog-bg),\n            var(--border-hr) 24%\n        );border-inline-start:2px solid\n            color-mix(in srgb, var(--theme), transparent 45%);background:var(--post-history-related-card-bg);color:var(--text);font-size:0.9rem;}.post-history-related-card-body.svelte-1g9bqtt {display:grid;grid-template-columns:minmax(0, 1fr);min-width:0;gap:2px;padding:2px 10px 0 8px;}.post-history-related-card .post-preview-footer {margin-inline:-8px -10px;}.post-history-related-author.svelte-1g9bqtt {display:flex;align-items:center;min-width:0;gap:8px;}.post-history-related-avatar.svelte-1g9bqtt,\n    .post-history-related-avatar-placeholder.svelte-1g9bqtt {width:24px;height:24px;flex:0 0 auto;border-radius:50%;background:var(--border-hr);object-fit:cover;}.post-history-related-avatar-placeholder.svelte-1g9bqtt {display:inline-block;mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:var(--text-muted);}.post-history-related-author-name.svelte-1g9bqtt {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.post-history-related-card .post-history-related-content {margin:0;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}"
};
function kt(n, i) {
	z(i, !0), w(n, Ot);
	let a = M(i, "profile", 3, null), o = M(i, "media", 3, void 0), s = M(i, "model", 3, void 0), u = M(i, "loadSensitiveBody", 3, void 0), f = M(i, "emojiLoadStateByUrl", 19, () => ({})), p = M(i, "emojiImageMetaByUrl", 19, () => ({})), m = M(i, "scrollRoot", 3, null), y = M(i, "onImageOpen", 3, void 0), b = M(i, "topActions", 3, void 0), x = M(i, "footerLeftExtras", 3, void 0), S = M(i, "footerActions", 3, void 0), T = M(i, "footerDetails", 3, void 0), E = M(i, "footerMenu", 3, void 0), D = B(() => a()?.displayName?.trim() || a()?.name?.trim() || bt(U.npubEncode(i.event.pubkey), 12, 4)), O = B(() => s() ?? Ke({
		kind: i.event.kind,
		sourceContent: i.event.content,
		tags: i.event.tags,
		media: o()
	})), k = B(() => Ge(i.event.created_at * 1e3));
	var A = Dt(), j = g(A);
	c(j, () => b() ?? C);
	var N = _(j, 2), P = g(N), F = g(P), R = (e) => {
		var t = Tt();
		h(() => {
			L(t, "src", a().picture), L(t, "alt", v(D));
		}), d(e, t);
	}, V = (e) => {
		var t = Et();
		d(e, t);
	};
	l(F, (e) => {
		a()?.picture ? e(R) : e(V, -1);
	});
	var H = _(F, 2), W = I(H, !0);
	e(P);
	var G = _(P, 2);
	Ue(G, {
		get model() {
			return v(O);
		},
		get loadSensitiveBody() {
			return u();
		},
		get contentWarningEventId() {
			return i.event.id;
		},
		density: "compact",
		contentClass: "post-history-related-content",
		get emojiLoadStateByUrl() {
			return f();
		},
		get emojiImageMetaByUrl() {
			return p();
		},
		get scrollRoot() {
			return m();
		},
		get onImageOpen() {
			return y();
		}
	});
	var K = _(G, 2);
	wt(K, {
		get formattedDate() {
			return v(k);
		},
		density: "compact",
		get leftExtras() {
			return x();
		},
		get actions() {
			return S();
		},
		get trailing() {
			return E();
		}
	});
	var q = _(K, 2);
	c(q, () => T() ?? C), e(N), e(A), h(() => t(W, v(D))), d(n, A), r();
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
]), jt = a("<!> <!>", 1);
function Mt(e, n) {
	z(n, !0);
	let i = M(n, "onClick", 3, void 0), a = M(n, "ariaLabel", 3, ""), o = S(n, At), l = V().overlayTarget;
	var u = f(), p = E(u);
	s(p, () => it, (e, r) => {
		r(e, {
			children: (e, r) => {
				var u = f(), p = E(u);
				s(p, () => $e, (e, r) => {
					r(e, {
						delayDuration: 500,
						children: (e, r) => {
							var u = jt(), p = E(u);
							{
								let e = (e, t) => {
									let r = () => (t?.()).props, s = B(() => {
										let { onclick: e, ...t } = r();
										return {
											tooltipOnclick: e,
											restProps: t
										};
									});
									X(e, m(() => o, () => v(s).restProps, {
										get ariaLabel() {
											return a();
										},
										onClick: (e) => {
											let t = i()?.(e);
											return typeof v(s).tooltipOnclick == "function" && v(s).tooltipOnclick(e), t;
										},
										children: (e, t) => {
											var r = f(), i = E(r);
											c(i, () => n.children ?? C), d(e, r);
										},
										$$slots: { default: !0 }
									}));
								};
								s(p, () => qe, (t, n) => {
									n(t, {
										child: e,
										$$slots: { child: !0 }
									});
								});
							}
							var g = _(p, 2);
							s(g, () => me, (e, r) => {
								r(e, {
									get to() {
										return l;
									},
									children: (e, r) => {
										var i = f(), a = E(i);
										s(a, () => et, (e, r) => {
											r(e, {
												sideOffset: 8,
												class: "tooltip-content post-preview-tooltip-content",
												children: (e, r) => {
													T();
													var i = j();
													h(() => t(i, n.tooltipContent)), d(e, i);
												},
												$$slots: { default: !0 }
											});
										}), d(e, i);
									},
									$$slots: { default: !0 }
								});
							}), d(e, u);
						},
						$$slots: { default: !0 }
					});
				}), d(e, u);
			},
			$$slots: { default: !0 }
		});
	}), d(e, u), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostReactionActionButton.svelte
var Nt = a("<div aria-hidden=\"true\"></div>"), Pt = a("<span class=\"reaction-action-error svelte-kvh7jt\" role=\"alert\"> </span>"), Ft = a("<!> <!>", 1), It = {
	hash: "svelte-kvh7jt",
	code: ".reaction-compose-icon.svelte-kvh7jt {--svg: currentColor;mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.failed.svelte-kvh7jt {color:var(--danger);}.reaction-action-error.svelte-kvh7jt {position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);}"
};
function Lt(e, n) {
	z(n, !0), w(e, It);
	let i = () => N(Y, "$_", a), [a, o] = k(), s = x(!1), c = x(!1);
	async function u() {
		if (!v(s)) {
			D(s, !0), D(c, !1);
			try {
				D(c, await n.onReact() === !1);
			} catch {
				D(c, !0);
			} finally {
				D(s, !1);
			}
		}
	}
	var f = Ft(), p = E(f);
	{
		let e = B(() => i()("reaction.action")), t = B(() => i()(v(c) ? "reaction.targetFailed" : "reaction.action"));
		Mt(p, {
			type: "button",
			className: "post-history-action-button post-preview-action-button reaction-compose-button",
			get ariaLabel() {
				return v(e);
			},
			get tooltipContent() {
				return v(t);
			},
			shape: "circle",
			contentLayout: "icon",
			get disabled() {
				return v(s);
			},
			onClick: u,
			children: (e, t) => {
				var n = Nt();
				let r;
				h(() => r = R(n, 1, "reaction-compose-icon svg-icon svelte-kvh7jt", null, r, { failed: v(c) })), d(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	var m = _(p, 2), g = (e) => {
		var n = Pt(), r = I(n, !0);
		h((e) => t(r, e), [() => i()("reaction.targetFailed")]), d(e, n);
	};
	l(m, (e) => {
		v(c) && e(g);
	}), d(e, f), r(), o();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPostActions.svelte
var Rt = a("<div class=\"reply-icon svg-icon\" aria-hidden=\"true\"></div>"), zt = a("<div class=\"quote-icon svg-icon\" aria-hidden=\"true\"></div>"), Bt = a("<div class=\"post-preview-action-buttons-group\"><div class=\"post-preview-action-cell post-preview-reply-action-cell\"><div class=\"post-preview-reply-button-slot\"><!></div> <div class=\"post-preview-footer-replies-slot\"><!></div></div> <div class=\"post-preview-action-cell post-preview-quote-action-cell\"><!></div> <div class=\"post-preview-action-cell post-preview-reaction-action-cell\"><!> <div class=\"post-preview-footer-reaction-slot\"><!></div></div></div>");
function Vt(t, n) {
	z(n, !0);
	let i = () => N(Y, "$_", a), [a, o] = k(), s = M(n, "onReactionPost", 3, void 0), u = M(n, "onReplyPost", 3, void 0), f = M(n, "onQuotePost", 3, void 0), p = M(n, "replyExtras", 3, void 0), m = M(n, "reactionExtras", 3, void 0);
	var h = Bt(), y = g(h), b = g(y), x = g(b), S = (e) => {
		{
			let t = B(() => i()("replyQuote.reply_label")), r = B(() => i()("replyQuote.reply_label"));
			Mt(e, {
				type: "button",
				className: "post-preview-action-button post-history-action-button",
				get ariaLabel() {
					return v(t);
				},
				contentLayout: "icon",
				shape: "circle",
				onClick: () => u()?.(n.post),
				get tooltipContent() {
					return v(r);
				},
				children: (e, t) => {
					var n = Rt();
					d(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	};
	l(x, (e) => {
		u() && e(S);
	}), e(b);
	var w = _(b, 2), T = g(w);
	c(T, () => p() ?? C), e(w), e(y);
	var E = _(y, 2), D = g(E), O = (e) => {
		{
			let t = B(() => i()("replyQuote.quote_label")), r = B(() => i()("replyQuote.quote_label"));
			Mt(e, {
				type: "button",
				className: "post-preview-action-button post-history-action-button",
				get ariaLabel() {
					return v(t);
				},
				contentLayout: "icon",
				shape: "circle",
				onClick: () => f()?.(n.post),
				get tooltipContent() {
					return v(r);
				},
				children: (e, t) => {
					var n = zt();
					d(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	};
	l(D, (e) => {
		f() && e(O);
	}), e(E);
	var A = _(E, 2), j = g(A), P = (e) => {
		Lt(e, { onReact: () => s()(n.post) });
	}, F = B(() => s() && n.post.deletedAt === void 0 && Ne(n.post.kind));
	l(j, (e) => {
		v(F) && e(P);
	});
	var I = _(j, 2), L = g(I);
	c(L, () => m() ?? C), e(I), e(A), e(h), d(t, h), r(), o();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRepostPreview.svelte
var Ht = a("<p> </p>"), Ut = a("<div class=\"repost-target-label svelte-1l68xot\"> </div>"), Wt = a("<div class=\"repost-channel-row svelte-1l68xot\"><span> </span> <strong> </strong></div>"), Gt = a("<!> <!>", 1), Kt = a("<p role=\"status\"> </p> <!>", 1), qt = a("<div class=\"post-history-repost svelte-1l68xot\"><div class=\"post-history-repost-label svelte-1l68xot\"><span class=\"post-history-repost-title svelte-1l68xot\"><!> <span class=\"post-history-repost-icon svg-icon svelte-1l68xot\" aria-hidden=\"true\"></span> <span> </span></span> <!></div> <!> <!></div>"), Jt = {
	hash: "svelte-1l68xot",
	code: ".post-history-repost.svelte-1l68xot {min-width:0;}.repost-target-label.svelte-1l68xot {padding:4px 6px;color:var(--text-muted);}.repost-channel-row.svelte-1l68xot {display:flex;flex-wrap:wrap;gap:6px;padding:4px 6px;overflow-wrap:anywhere;}.post-history-repost-label.svelte-1l68xot {display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--btn-post-preview-action);}.post-history-repost-title.svelte-1l68xot {display:flex;align-items:center;gap:6px;min-width:0;padding-left:6px;}.post-history-repost-icon.svelte-1l68xot {--icon-size: 22px;--svg: currentColor;mask-image:var(--ehagaki-icon-7265706f73742e737667);}.post-history-repost-label .post-history-menu-trigger {inline-size:28px;block-size:28px;min-inline-size:28px;min-block-size:28px;flex:0 0 28px;padding:0;}"
};
function Yt(n, i) {
	z(i, !0), w(n, Jt);
	let a = () => N(Y, "$_", o), [o, s] = k(), u = M(i, "channelText", 3, null), p = M(i, "targetLabel", 3, null), m = M(i, "scrollRoot", 3, null), y = M(i, "emojiLoadStateByUrl", 19, () => ({})), b = M(i, "emojiImageMetaByUrl", 19, () => ({})), x = B(() => i.preview.event ? Pe(i.preview.event, i.preview.relayHints) : null), S = B(() => i.preview.status === "deleted" ? "repost.targetDeleted" : i.preview.status === "unsupported-target-kind" ? "repost.targetUnsupported" : i.preview.status === "unsupported-reference" ? "repost.referenceUnsupported" : i.preview.status === "invalid-reference" || i.preview.status === "invalid-target" || i.preview.status === "outer-target-kind-mismatch" ? "repost.targetInvalid" : i.preview.status === "loading" ? "repost.targetLoading" : "repost.targetMissing");
	var D = qt(), O = g(D), A = g(O), P = g(A);
	c(P, () => i.author ?? C);
	var F = _(P, 4), R = I(F, !0);
	e(A);
	var V = _(A, 2);
	c(V, () => i.menu ?? C, () => i.post, () => `repost-outer:${i.post.eventId}`), e(O);
	var H = _(O, 2), U = (e) => {
		var n = Ht(), r = I(n, !0);
		h((e) => t(r, e), [() => a()("postHistory.deleted")]), d(e, n);
	}, W = (n) => {
		var r = Gt(), o = E(r);
		kt(o, {
			get event() {
				return i.preview.event;
			},
			get profile() {
				return i.preview.profile;
			},
			get model() {
				return i.model;
			},
			get loadSensitiveBody() {
				return i.loadSensitiveBody;
			},
			get scrollRoot() {
				return m();
			},
			get onImageOpen() {
				return i.onImageOpen;
			},
			get emojiLoadStateByUrl() {
				return y();
			},
			get emojiImageMetaByUrl() {
				return b();
			},
			topActions: (n) => {
				var r = Gt(), i = E(r), o = (e) => {
					var n = Ut(), r = I(n, !0);
					h(() => t(r, p())), d(e, n);
				};
				l(i, (e) => {
					p() && e(o);
				});
				var s = _(i, 2), c = (n) => {
					var r = Wt(), i = g(r), o = I(i, !0), s = _(i, 2), c = I(s, !0);
					e(r), h((e) => {
						t(o, e), t(c, u());
					}, [() => a()("postHistory.channel")]), d(n, r);
				};
				l(s, (e) => {
					u() && e(c);
				}), d(n, r);
			},
			footerActions: (e) => {
				Vt(e, {
					get post() {
						return v(x);
					},
					get onReplyPost() {
						return i.onReplyPost;
					},
					get onQuotePost() {
						return i.onQuotePost;
					},
					get onReactionPost() {
						return i.onReactionPost;
					},
					reactionExtras: (e) => {
						var t = f(), n = E(t);
						c(n, () => i.reactionExtras ?? C, () => v(x)), d(e, t);
					},
					$$slots: { reactionExtras: !0 }
				});
			},
			footerDetails: (e) => {
				var t = f(), n = E(t);
				c(n, () => i.reactionDetails ?? C, () => v(x)), d(e, t);
			},
			footerMenu: (e) => {
				var t = f(), n = E(t);
				c(n, () => i.menu ?? C, () => v(x), () => `repost-target:${i.post.eventId}:${v(x).eventId}`), d(e, t);
			},
			$$slots: {
				topActions: !0,
				footerActions: !0,
				footerDetails: !0,
				footerMenu: !0
			}
		});
		var s = _(o, 2), S = (e) => {
			var n = Kt(), r = E(n), o = I(r, !0), s = _(r, 2);
			X(s, {
				get onClick() {
					return i.onRetry;
				},
				children: (e, n) => {
					T();
					var r = j();
					h((e) => t(r, e), [() => a()("repost.retrySave")]), d(e, r);
				},
				$$slots: { default: !0 }
			}), h((e) => t(o, e), [() => a()("repost.targetSaveFailed")]), d(e, n);
		};
		l(s, (e) => {
			"saveFailed" in i.preview && i.preview.saveFailed && e(S);
		}), d(n, r);
	}, G = (e) => {
		var n = Kt(), r = E(n), o = I(r, !0), s = _(r, 2), c = (e) => {
			X(e, {
				get onClick() {
					return i.onRetry;
				},
				children: (e, n) => {
					T();
					var r = j();
					h((e) => t(r, e), [() => a()("postHistory.contextRetry")]), d(e, r);
				},
				$$slots: { default: !0 }
			});
		};
		l(s, (e) => {
			(i.preview.status === "not-found" || i.preview.status === "error" || i.preview.status === "invalid-target") && e(c);
		}), h((e) => t(o, e), [() => a()(v(S))]), d(e, n);
	};
	l(H, (e) => {
		i.post.deletedAt === void 0 ? i.preview.status === "resolved" && i.preview.event && v(x) ? e(W, 1) : e(G, -1) : e(U);
	});
	var K = _(H, 2), q = (e) => {
		var t = Gt(), n = E(t);
		{
			let e = (e) => {
				Vt(e, {
					get post() {
						return i.post;
					},
					get onReactionPost() {
						return i.onReactionPost;
					},
					reactionExtras: (e) => {
						var t = f(), n = E(t);
						c(n, () => i.reactionExtras ?? C, () => i.post), d(e, t);
					},
					$$slots: { reactionExtras: !0 }
				});
			}, t = B(() => Ge(i.post.postedAt));
			wt(n, {
				get formattedDate() {
					return v(t);
				},
				actions: e,
				$$slots: { actions: !0 }
			});
		}
		var r = _(n, 2);
		c(r, () => i.reactionDetails ?? C, () => i.post), d(e, t);
	};
	l(K, (e) => {
		i.post.deletedAt === void 0 && i.onReactionPost && e(q);
	}), e(D), h((e) => {
		L(D, "data-repost-event-id", i.post.eventId), t(R, e);
	}, [() => a()("repost.entry")]), d(n, D), r(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryChannelDisplay.svelte.ts
function Xt({ getShow: e, getSessionOpen: t = e, getPosts: n, getRxNostr: r, getRelayConfig: i, getIsSearchMode: a }) {
	let o = x(y({})), s = 0, c = [];
	function l() {
		c = [];
	}
	function u() {
		s++, c.forEach((e) => e.release()), l();
	}
	function d() {
		u(), D(o, {}, !0);
	}
	function f(e, t) {
		if (e.kind !== 42) return null;
		if (!e.channelEventId) return t("postHistory.channelUnknown");
		let n = v(o)[e.channelEventId];
		return !n || n.status === "loading" ? t("postHistory.channelLoading") : n.status === "resolved" && n.name ? n.name : t("postHistory.channelUnknown");
	}
	return A(() => {
		t() || O(d);
	}), A(() => {
		if (e()) return () => {
			u();
		};
	}), A(() => {
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
			let n = W.sanitizeExternalRelayUrls(t.filter((t) => t.channelEventId === e).flatMap((e) => Xe(e, null)), { limit: 8 });
			return Qe.resolveInternal({
				eventId: e,
				relayHints: n
			}, p, i());
		});
		c = m, D(o, {
			...O(() => v(o)),
			...Object.fromEntries(d.map((e) => [e, {
				status: "loading",
				name: null
			}]))
		}, !0), Promise.all(m.map((e) => e.cacheReady)).then((t) => {
			e() && f === s && D(o, {
				...v(o),
				...Object.fromEntries(t.map((e) => [e.context.eventId, We(e.cache, !!p)]))
			}, !0);
		}).catch((e) => {
			console.error("チャンネル表示のキャッシュ解決に失敗しました:", e);
		}), Promise.all(m.map((e) => e.refresh)).then((t) => {
			e() && f === s && (l(), D(o, {
				...v(o),
				...Object.fromEntries(t.map((e) => [e.snapshot.context.eventId, {
					status: e.snapshot.context.name ? "resolved" : "failed",
					name: e.snapshot.context.name
				}]))
			}, !0));
		}).catch((e) => {
			f === s && l(), console.error("チャンネル表示のバックグラウンド解決に失敗しました:", e);
		});
	}), P(() => {
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
function dn({ getShow: e, getRxNostr: t, profileCache: n = He, logger: r = console }) {
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
function gn({ getShow: e, getRxNostr: t, getRelayConfig: n, postHistoryRepositoryImpl: r = Ae, contextFetchService: i = Je, deletionRequestsRepositoryImpl: a = Ye, deletionFetchService: o = Ze, profileSyncCoordinator: s = void 0, loadRepostTarget: c = void 0, requireFullVerification: l = !1 }) {
	let u = s ?? dn({
		getShow: e,
		getRxNostr: t
	}), d = !s, f = x({}), p = x(y({})), m = x(y({})), h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), T = 0;
	function E(e) {
		D(p, {
			...v(p),
			[e]: (v(p)[e] ?? 0) + 1
		}, !0);
	}
	function O(e) {
		let t = g.get(e);
		if (t) for (let e of t) E(e);
	}
	function k(e, t) {
		let n = v(f)[e], r = t(n);
		return n && n.status === r.status && n.event === r.event && n.profile === r.profile && n.authorPubkey === r.authorPubkey && n.errorCode === r.errorCode && n.updatedAt === r.updatedAt && Be(n.relayHints, r.relayHints) ? n : (D(f, {
			...v(f),
			[e]: r
		}), O(e), r);
	}
	function A(e, t) {
		return k(e, (n) => {
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
	function j(e) {
		let t = v(f)[e.targetEventId], n = pn([...t?.relayHints ?? [], ...e.relayHints ?? []]), r = t?.authorPubkey ?? e.authorHint ?? null, i = !t || t.authorPubkey !== r || !Be(t.relayHints, n);
		return A(e.targetEventId, {
			authorPubkey: r,
			relayHints: n
		}), i;
	}
	function M(e) {
		let t = h.get(e.scopeKey) ?? /* @__PURE__ */ new Set();
		t.add(e.targetEventId), h.set(e.scopeKey, t);
		let n = g.get(e.targetEventId) ?? /* @__PURE__ */ new Set();
		n.add(e.scopeKey), g.set(e.targetEventId, n), e.scopeKey in v(m) || D(m, {
			...v(m),
			[e.scopeKey]: 0
		}, !0), e.scopeKey in v(p) || D(p, {
			...v(p),
			[e.scopeKey]: 0
		}, !0);
	}
	async function N(e, t) {
		return (await a.getDeletedTargets([{
			targetAuthorPubkey: e,
			targetEventId: t
		}])).get(e)?.has(t) ?? !1;
	}
	function P(e, t) {
		if (e && t) for (let [n, r] of Object.entries(v(f))) r.authorPubkey === e && A(n, { profile: t });
	}
	function F(e, t) {
		P(e, u.ensureProfile(e, t));
	}
	u.subscribe((t, n) => {
		e() && P(t, n);
	});
	async function I(r, i, s = {}) {
		if (!r.pubkey || !r.id) return !1;
		let c = g.get(r.id), l = t(), u = () => e() && t() === l && c === g.get(r.id) && !!c?.size, d = await N(r.pubkey, r.id);
		if (!u()) return !1;
		if (d) return A(r.id, {
			status: "deleted",
			event: null,
			authorPubkey: r.pubkey,
			relayHints: i,
			errorCode: null,
			updatedAt: Date.now()
		}), !0;
		let f = t();
		if (!f) return !1;
		let p = `${r.pubkey}:${r.id}`, m = S.get(p) ?? Promise.resolve().then(async () => {
			try {
				if (!u()) return !1;
				let e = Oe($, r.pubkey), t = o.fetchDeletionRequests(f, {
					targets: [{
						event: r,
						relayUrls: i
					}],
					relayHints: i,
					relayConfig: n()
				});
				C.set(p, t);
				let s = await t.promise;
				if (!u()) return !1;
				if (s.events.length > 0) {
					if (await a.upsertValidDeletionRequests({
						targetEvents: [r],
						deletionEvents: s.events,
						fetchedAt: s.fetchedAt
					}), !u()) return !1;
					tt.archiveAdoptedAuthored([{ event: r }], {
						ownerPubkeyHex: r.pubkey,
						expectedRevision: await e,
						isActive: u
					});
				}
				let c = await N(r.pubkey, r.id);
				return u() ? (c && A(r.id, {
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
				S.get(p) === m && (C.delete(p), S.delete(p));
			}
		});
		return S.set(p, m), !s.background && await m;
	}
	function L(e, t) {
		return w.get(e) === t;
	}
	async function R(a, o = {}, s) {
		M(a);
		let u = v(f)[a.targetEventId], d = j(a), p = v(f)[a.targetEventId] ?? hn(a), h = !!o.background && u?.status === "resolved";
		if (l && u?.status === "resolved" && !Te(u.event, {
			eventId: a.targetEventId,
			authorHint: null,
			relayHints: []
		}) && (o = {
			...o,
			force: !0
		}), (a.relationKind === "repost" || l) && u?.status === "resolved") {
			let t = Ie(u.event)?.event;
			if (t?.id === a.targetEventId) {
				let n = v(m)[a.scopeKey], r = await N(t.pubkey, t.id);
				if (!e() || n !== v(m)[a.scopeKey] || !g.get(t.id)?.has(a.scopeKey)) return null;
				if (r) return A(t.id, {
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
			}, s) : (u.status === "resolved" && u.authorPubkey && F(u.authorPubkey, v(f)[a.targetEventId]?.relayHints ?? u.relayHints), v(f)[a.targetEventId] ?? u);
			if (u.status === "loading" && !s && _.has(a.targetEventId)) return await _.get(a.targetEventId) ?? v(f)[a.targetEventId] ?? u;
			if (!d && !s && (u.status === "not-found" || u.status === "error")) return v(f)[a.targetEventId] ?? u;
		}
		if (!o.force && !s && _.has(a.targetEventId)) return await _.get(a.targetEventId) ?? v(f)[a.targetEventId] ?? p;
		o.force && (b.get(a.targetEventId)?.cancel(), b.delete(a.targetEventId), _.delete(a.targetEventId));
		let y = ++T;
		w.set(a.targetEventId, y);
		let x = (async () => {
			try {
				h || A(a.targetEventId, {
					status: "loading",
					errorCode: null
				});
				let u = s ? {
					event: s.target,
					relayHints: p.relayHints
				} : a.relationKind === "repost" ? await c?.(a) : null;
				if (!L(a.targetEventId, y)) return null;
				let d = u && Z(u.event, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: a.relayHints ?? []
				});
				if (d && (!o.requireRelayHint || u.relayHints.length > 0)) {
					let e = pn([...u.relayHints, ...p.relayHints]), t = A(a.targetEventId, {
						status: "resolved",
						event: d.event,
						authorPubkey: d.event.pubkey,
						relayHints: e,
						errorCode: null,
						updatedAt: Date.now()
					});
					return F(d.event.pubkey, e), s || I(d.event, e, { background: !0 }), t;
				}
				let m = await r.getByEventId(a.targetEventId);
				if (!L(a.targetEventId, y)) return v(f)[a.targetEventId] ?? null;
				let g = l && m ? Te(m.rawEvent, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				}) : null;
				if (m && (!l || g) && (!o.requireRelayHint || [
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
					if (typeof m.deletedAt == "number") return A(a.targetEventId, {
						status: "deleted",
						event: null,
						authorPubkey: g?.event.pubkey ?? m.pubkeyHex,
						relayHints: e,
						errorCode: null,
						updatedAt: Date.now()
					});
					let t = g?.event ?? (a.relationKind === "repost" ? Z(m.rawEvent).event : an(m)), n = e, r = A(a.targetEventId, {
						status: "resolved",
						event: t,
						authorPubkey: t.pubkey,
						relayHints: n,
						errorCode: null,
						updatedAt: Date.now()
					});
					return F(t.pubkey, n), s || I(t, n, { background: !0 }), v(f)[a.targetEventId] ?? r;
				}
				if (!l && a.authorHint && a.relationKind !== "repost") {
					let e = await I(mn(a.targetEventId, a.authorHint), p.relayHints);
					if (!L(a.targetEventId, y) || e) return v(f)[a.targetEventId] ?? null;
				}
				let _ = t();
				if (!_ || !e()) return h ? v(f)[a.targetEventId] ?? p : A(a.targetEventId, {
					status: "error",
					event: null,
					authorPubkey: p.authorPubkey,
					relayHints: p.relayHints,
					errorCode: "nostr_not_ready",
					updatedAt: Date.now()
				});
				let x = (s ? b.get(a.targetEventId) : void 0) ?? i.fetchEventById(_, {
					eventId: a.targetEventId,
					authorHint: a.authorHint,
					relayHints: p.relayHints,
					relayConfig: n()
				});
				b.set(a.targetEventId, x);
				let S = await x.promise;
				if (!L(a.targetEventId, y)) return v(f)[a.targetEventId] ?? null;
				if (b.delete(a.targetEventId), !S.event) {
					if (!l && a.authorHint && a.relationKind !== "repost") {
						let e = await I(mn(a.targetEventId, a.authorHint), p.relayHints);
						if (!L(a.targetEventId, y) || e) return v(f)[a.targetEventId] ?? null;
					}
					return h ? v(f)[a.targetEventId] ?? p : A(a.targetEventId, {
						status: "not-found",
						event: null,
						authorPubkey: p.authorPubkey,
						relayHints: p.relayHints,
						errorCode: null,
						updatedAt: Date.now()
					});
				}
				let C = pn([...S.relayUrl ? [S.relayUrl] : [], ...p.relayHints]), w = l ? Te(S.event, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				}) : null;
				if (l && !w) return A(a.targetEventId, {
					status: "error",
					event: null,
					errorCode: "invalid_event",
					updatedAt: Date.now()
				});
				let T = w?.event ?? S.event;
				if (a.relationKind === "repost" && !Z(T, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				})) throw Error("invalid_repost_target");
				let E = C, D = !s && await I(T, E);
				if (!L(a.targetEventId, y)) return v(f)[a.targetEventId] ?? null;
				if (D) return T.id !== a.targetEventId && A(a.targetEventId, {
					status: "deleted",
					event: null,
					authorPubkey: T.pubkey,
					relayHints: E,
					errorCode: null,
					updatedAt: Date.now()
				}), v(f)[a.targetEventId] ?? null;
				let O = A(a.targetEventId, {
					status: "resolved",
					event: T,
					authorPubkey: T.pubkey,
					relayHints: E,
					errorCode: null,
					updatedAt: Date.now()
				});
				return F(T.pubkey, E), v(f)[a.targetEventId] ?? O;
			} catch {
				return L(a.targetEventId, y) ? h ? v(f)[a.targetEventId] ?? p : A(a.targetEventId, {
					status: "error",
					event: null,
					authorPubkey: p.authorPubkey,
					relayHints: p.relayHints,
					errorCode: "fetch_failed",
					updatedAt: Date.now()
				}) : v(f)[a.targetEventId] ?? null;
			} finally {
				L(a.targetEventId, y) && (b.delete(a.targetEventId), _.delete(a.targetEventId));
			}
		})();
		return _.set(a.targetEventId, x), await x;
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
		if (n.relationKind !== "repost" || !i || !be(i.event.kind) || !e() || !t()) return null;
		M(n);
		let a = g.get(n.targetEventId), o = v(m)[n.scopeKey], s = t(), c = () => e() && t() === s && a === g.get(n.targetEventId) && a?.has(n.scopeKey) && o === v(m)[n.scopeKey], l = await R(n, { requireRelayHint: !0 }, { target: i.event });
		if (!c() || l?.status !== "resolved" || !Z(l.event, {
			eventId: i.event.id,
			authorHint: i.event.pubkey,
			relayHints: []
		})) return null;
		let u = await N(i.event.pubkey, i.event.id);
		return c() ? u ? A(i.event.id, {
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
		return v(f)[e] ?? null;
	}
	function W(e) {
		return v(p)[e] ?? 0;
	}
	function G(e) {
		let t = h.get(e);
		if (t) for (let n of t) {
			let t = g.get(n);
			if (t && (t.delete(e), !(t.size > 0))) {
				g.delete(n), w.delete(n), b.get(n)?.cancel(), b.delete(n);
				for (let [e, t] of C) e.endsWith(`:${n}`) && (t.cancel(), C.delete(e), S.delete(e));
				_.delete(n);
			}
		}
		h.delete(e), D(m, {
			...v(m),
			[e]: (v(m)[e] ?? 0) + 1
		}, !0), E(e);
	}
	function K() {
		b.forEach((e) => e.cancel()), C.forEach((e) => e.cancel()), b.clear(), C.clear(), _.clear(), S.clear(), h.clear(), g.clear(), d && u.reset(), w.clear(), D(f, {}), D(p, {}, !0), D(m, {}, !0);
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
	let t = await Ae.getByEventId(e.sourceEventId), n = t && Ee(t), r = t?.repostTarget ?? (t && n ? (await $.postHistory.where("pubkeyHex").equals(t.pubkeyHex).filter((e) => xe(e.kind) && e.repostTarget?.rawEvent.id === n.eventId).first())?.repostTarget : void 0), i = n && n.eventId === e.targetEventId && r ? Z(r.rawEvent, {
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
	let t = `post-history-repost:${++_n}`, n = 0, r = x(y({}));
	function i(e) {
		let n = Ee(e);
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
		let i = Ee(n);
		return {
			...ye(n, i ? e.resolver.getTargetSnapshot(i.eventId) : null),
			saveFailed: v(r)[n.eventId] ?? !1
		};
	}
	async function o(t, a = !1) {
		let o = i(t), s = e.getPubkey(), c = n;
		if (!e.getShow() || !o || !s) return;
		let l = await Oe($, s), u = () => n === c && e.getShow() && e.getPubkey() === s && e.getPosts().some((e) => e.eventId === t.eventId && e.deletedAt === void 0);
		if (!u()) return;
		let d = e.resolver.getTargetSnapshot(o.targetEventId), f = a ? await e.resolver.retryTarget(o) : await e.resolver.ensureTarget(o, { force: !!t.repostTarget && d?.status !== "resolved" });
		if (!u() || !f?.event) return;
		let p = Ee(t), m = p && we(f.event, p);
		if (m) try {
			await Ae.attachRepostTarget({
				outerEventId: t.eventId,
				target: m.event,
				relayHints: f.relayHints,
				localWriteScope: {
					ownerPubkeyHex: s,
					expectedRevision: l,
					isActive: u
				}
			}), u() && v(r)[t.eventId] && D(r, {
				...v(r),
				[t.eventId]: !1
			}, !0);
		} catch {
			u() && D(r, {
				...v(r),
				[t.eventId]: !0
			}, !0);
		}
	}
	return A(() => {
		let r = e.getPosts(), i = e.getPubkey();
		if (e.getShow() && i) {
			for (let e of r) xe(e.kind) && e.deletedAt === void 0 && o(e).catch(() => void 0);
			return () => {
				n++, e.resolver.invalidateScope(t);
			};
		}
	}), P(() => {
		n++, e.resolver.invalidateScope(t);
	}), {
		suspend: () => {
			n++, e.resolver.invalidateScope(t);
		},
		getPreview: a,
		retry: (e) => {
			o(e, !v(r)[e.eventId]).catch(() => void 0);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostRepostMenuItem.svelte
var bn = a("<div class=\"repost-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), xn = {
	hash: "svelte-1s9x7c7",
	code: ".repost-icon {mask-image:var(--ehagaki-icon-7265706f73742e737667);}"
};
function Sn(e, n) {
	z(n, !0), w(e, xn);
	let i = () => N(Y, "$_", a), [a, o] = k(), c = M(n, "pending", 3, !1);
	var l = f(), u = E(l);
	s(u, () => ot, (e, r) => {
		r(e, {
			class: "menu-action-button",
			get disabled() {
				return c();
			},
			get onSelect() {
				return n.onSelect;
			},
			children: (e, n) => {
				var r = bn(), a = _(E(r), 2), o = I(a, !0);
				h((e) => t(o, e), [() => i()(c() ? "repost.sending" : "repost.action")]), d(e, r);
			},
			$$slots: { default: !0 }
		});
	}), d(e, l), r(), o();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostRepostFeedback.svelte
var Cn = a("<div class=\"repost-save-feedback svelte-rif0a0\" role=\"status\"><span> </span> <!></div>"), wn = a("<div class=\"repost-message svelte-rif0a0\"> </div>"), Tn = a("<!> <!>", 1), En = {
	hash: "svelte-rif0a0",
	code: ".repost-message.svelte-rif0a0 {white-space:normal;overflow-wrap:anywhere;}.repost-save-feedback.svelte-rif0a0 {display:flex;flex:0 0 auto;flex-wrap:wrap;align-items:center;gap:8px;min-width:0;width:100%;padding:8px 12px;box-sizing:border-box;}.repost-save-feedback.svelte-rif0a0 .repost-retry-save {height:auto;min-height:44px;padding:8px 12px;}"
};
function Dn(n, i) {
	z(i, !0), w(n, En);
	let a = () => N(Y, "$_", o), [o, s] = k(), c = M(i, "saveFailure", 3, null), u = M(i, "pending", 3, !1), f = M(i, "anchor", 3, null), p = M(i, "anchorRightOffset", 3, 0), m = x(!1), y = x(!1), b = x(null), S = B(() => c() ?? (i.result?.retryInput ? i.result : null));
	A(() => {
		if (D(m, u() || !!i.result && i.result !== v(b) && i.result.error !== "repost_stale", !0), u() || !i.result || i.result.retryInput) return;
		let e = setTimeout(() => {
			D(m, !1);
		}, 4e3);
		return () => clearTimeout(e);
	});
	let C = B(() => u() ? "repost.sending" : i.result?.success ? i.result.historySaved === !1 ? "repost.saveFailed" : "repost.sent" : i.result?.error === "repost_relay_missing" ? "repost.relayMissing" : "repost.failed");
	async function O() {
		if (!v(S) || !i.onRetrySave || v(y)) return;
		let e = v(S);
		D(y, !0);
		try {
			await i.onRetrySave(e) && (D(b, e), i.result === e && D(m, !1));
		} finally {
			D(y, !1);
		}
	}
	var P = Tn(), F = E(P), L = (n) => {
		var r = Cn(), i = g(r), o = I(i, !0), s = _(i, 2);
		{
			let e = B(() => u() || v(y));
			X(s, {
				className: "repost-retry-save",
				variant: "default",
				shape: "rounded",
				get disabled() {
					return v(e);
				},
				onClick: () => void O(),
				children: (e, n) => {
					T();
					var r = j();
					h((e) => t(r, e), [() => a()("repost.retrySave")]), d(e, r);
				},
				$$slots: { default: !0 }
			});
		}
		e(r), h((e) => t(o, e), [() => a()("repost.saveFailed")]), d(n, r);
	};
	l(F, (e) => {
		v(S) && v(S) !== v(b) && i.onRetrySave && e(L);
	});
	var R = _(F, 2);
	{
		let e = B(() => v(m) && (u() || !i.result?.retryInput)), n = B(() => f() ? "anchor-bottom-right" : "top-right");
		fe(R, {
			get show() {
				return v(e);
			},
			get variant() {
				return v(n);
			},
			get anchor() {
				return f();
			},
			get anchorRightOffset() {
				return p();
			},
			children: (e, n) => {
				var r = wn(), i = I(r, !0);
				h((e) => t(i, e), [() => a()(v(C))]), d(e, r);
			},
			$$slots: { default: !0 }
		});
	}
	d(n, P), r(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryActionMenu.svelte
var On = a("<div class=\"more-icon svg-icon\"></div>"), kn = a("<!> <!>", 1), An = a("<div class=\"post-history-menu-timestamp\"> </div> <!>", 1), jn = a("<div class=\"post-history-menu-body\"><!> <!></div>"), Mn = a("<button><div class=\"more-icon svg-icon\"></div></button>"), Nn = a("<button type=\"button\" aria-haspopup=\"menu\"><div class=\"more-icon svg-icon\"></div></button>"), Pn = {
	hash: "svelte-ea4c9b",
	code: ".post-history-menu-trigger {aspect-ratio:1;border-radius:50%;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));background-color:var(\n            --post-history-preview-footer-surface,\n            var(--dialog-bg)\n        );}.post-history-menu-trigger .more-icon {width:22px;height:22px;mask-image:var(--ehagaki-icon-6d6f72655f766572745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);--svg: currentColor;}.post-history-menu-trigger.post-history-heading-menu-trigger {min-height:50px;padding:0;border-radius:0;--btn-bg: var(--dialog-bg);background-color:var(--dialog-bg);color:var(--text-muted);}\n            .post-history-menu-trigger.post-history-heading-menu-trigger\n                .more-icon\n         {width:28px;height:28px;}.post-history-menu-content {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:10px;box-shadow:0 8px 24px rgba(0, 0, 0, 0.16);padding:8px;min-width:180px;z-index:102;outline:none;--post-history-menu-action-hover-bg: light-dark(\n            color-mix(in srgb, var(--dialog-bg), black 6%),\n            color-mix(in srgb, var(--dialog-bg), white 10%)\n        );--post-history-menu-action-hover-color: light-dark(\n            color-mix(in srgb, var(--text), black 6%),\n            color-mix(in srgb, var(--text), white 10%)\n        );--post-history-menu-action-danger-hover-bg: color-mix(\n            in srgb,\n            var(--dialog-bg),\n            var(--danger) 12%\n        );}.post-history-menu-body {display:flex;flex-direction:column;align-items:stretch;gap:2px;}.post-history-menu-timestamp {width:fit-content;margin-inline:auto;color:var(--text-muted);font-size:0.875rem;line-height:1.35;user-select:text;white-space:nowrap;}.post-history-menu-content[data-state=\"open\"] {\n        animation: svelte-ea4c9b-post-history-menu-popover-in 150ms ease-out;}.post-history-menu-content[data-state=\"closed\"] {\n        animation: svelte-ea4c9b-post-history-menu-popover-out 100ms ease-in;}\n\n    @media (prefers-reduced-motion: reduce) {.post-history-menu-content[data-state=\"open\"],\n        .post-history-menu-content[data-state=\"closed\"] {\n            animation: none;}\n    }.post-history-menu-content .post-history-menu-separator {height:1px;margin:4px 0;background:var(--border-hr);}.post-history-menu-content .menu-action-button {display:flex;align-items:center;justify-content:flex-start;gap:10px;width:100%;min-height:44px;padding:10px 12px;border:none;border-radius:6px;background-color:transparent;color:inherit;font:inherit;text-align:start;cursor:pointer;}.post-history-menu-content .menu-action-button-danger {color:var(--danger);--svg: currentColor;}\n            .post-history-menu-content\n                .menu-action-button[data-highlighted]:not([data-disabled])\n         {background-color:var(--post-history-menu-action-hover-bg);color:var(--post-history-menu-action-hover-color);--svg: currentColor;}\n            .post-history-menu-content\n                .menu-action-button-danger[data-highlighted]:not(\n                    [data-disabled]\n                )\n         {background-color:var(--post-history-menu-action-danger-hover-bg);color:var(--danger);--svg: currentColor;}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-history-menu-content\n                    .menu-action-button:hover:not([data-disabled])\n             {background-color:var(--post-history-menu-action-hover-bg);color:var(--post-history-menu-action-hover-color);--svg: currentColor;}\n                .post-history-menu-content\n                    .menu-action-button-danger:hover:not([data-disabled])\n             {background-color:var(--post-history-menu-action-danger-hover-bg);color:var(--danger);--svg: currentColor;}\n    }.post-history-menu-content .menu-action-button[data-disabled] {opacity:0.55;cursor:not-allowed;}.post-history-menu-content .menu-action-button .svg-icon {display:inline-flex;align-items:center;justify-content:center;--icon-size: 20px;}\n\n    @keyframes svelte-ea4c9b-post-history-menu-popover-in {\n        from {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n        to {\n            opacity: 1;\n            translate: 0 0;\n        }\n    }\n\n    @keyframes svelte-ea4c9b-post-history-menu-popover-out {\n        from {\n            opacity: 1;\n            translate: 0 0;\n        }\n        to {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n    }"
};
function Fn(n, i) {
	z(i, !0), w(n, Pn);
	let a = M(i, "open", 3, !1), o = M(i, "onOpenChange", 3, void 0), y = M(i, "triggerClassName", 3, ""), S = M(i, "align", 3, "start"), O = M(i, "timestamp", 3, void 0), k = M(i, "items", 3, void 0), N = M(i, "tooltipContent", 3, void 0), P = M(i, "enableTooltip", 3, !1), H = M(i, "lazy", 3, !1), U = M(i, "restoreFocusOnClose", 3, !1), W = V().overlayTarget, G = x(!1), K = x(!1), q = x(!1), J = x(null), ee = B(() => !H() || v(G) || a()), Y = !1;
	A(() => {
		a() !== Y && (Y = a(), D(K, a()), a() && D(q, !1));
	});
	function te(e) {
		D(K, e, !0), e && D(q, !1), o()?.(e);
	}
	function ne() {
		return v(q) && !v(K);
	}
	function re(e) {
		D(q, e && !v(K), !0);
	}
	async function ie(e, t) {
		typeof t == "function" && t(e);
		let n = typeof o() == "function";
		D(q, !1), D(G, !0), await F(), n && (D(K, !0), D(q, !1), o()(!0)), v(J) && (v(J).focus({ preventScroll: !0 }), n || v(J).click());
	}
	function ae(e) {
		e.key === "ArrowDown" && (e.preventDefault(), ie(e));
	}
	var oe = f(), se = E(oe), ce = (n) => {
		var r = f(), a = E(r);
		s(a, () => lt, (n, r) => {
			r(n, {
				get open() {
					return v(K);
				},
				onOpenChange: te,
				children: (n, r) => {
					var a = kn(), o = E(a), u = (e) => {
						var n = f(), r = E(n);
						s(r, () => it, (e, n) => {
							n(e, {
								children: (e, n) => {
									var r = f(), a = E(r), o = ne, c = re;
									s(a, () => $e, (e, n) => {
										n(e, {
											get open() {
												return o();
											},
											set open(e) {
												c(e);
											},
											delayDuration: 500,
											get disabled() {
												return v(K);
											},
											children: (e, n) => {
												var r = kn(), a = E(r);
												{
													let e = (e, t) => {
														let n = () => (t?.()).props, r = B(() => {
															let { onclick: e, ...t } = n();
															return {
																tooltipOnclick: e,
																restProps: t
															};
														});
														var a = f(), o = E(a);
														{
															let e = B(() => `menu-trigger post-history-menu-trigger ${y()} ${v(K) ? "is-open" : ""}`.trim());
															s(o, () => ut, (t, n) => {
																n(t, m({
																	get class() {
																		return v(e);
																	},
																	get "aria-label"() {
																		return i.triggerAriaLabel;
																	}
																}, () => v(r).restProps, {
																	onclick: (e) => {
																		typeof v(r).tooltipOnclick == "function" && v(r).tooltipOnclick(e);
																	},
																	get ref() {
																		return v(J);
																	},
																	set ref(e) {
																		D(J, e, !0);
																	},
																	children: (e, t) => {
																		var n = On();
																		d(e, n);
																	},
																	$$slots: { default: !0 }
																}));
															});
														}
														d(e, a);
													};
													s(a, () => qe, (t, n) => {
														n(t, {
															child: e,
															$$slots: { child: !0 }
														});
													});
												}
												var o = _(a, 2);
												s(o, () => me, (e, n) => {
													n(e, {
														get to() {
															return W;
														},
														children: (e, n) => {
															var r = f(), i = E(r);
															s(i, () => et, (e, n) => {
																n(e, {
																	sideOffset: 8,
																	class: "tooltip-content post-preview-tooltip-content",
																	children: (e, n) => {
																		T();
																		var r = j();
																		h(() => t(r, N())), d(e, r);
																	},
																	$$slots: { default: !0 }
																});
															}), d(e, r);
														},
														$$slots: { default: !0 }
													});
												}), d(e, r);
											},
											$$slots: { default: !0 }
										});
									}), d(e, r);
								},
								$$slots: { default: !0 }
							});
						}), d(e, n);
					}, p = (e) => {
						var t = f(), n = E(t);
						{
							let e = B(() => `menu-trigger post-history-menu-trigger ${y()} ${v(K) ? "is-open" : ""}`.trim());
							s(n, () => ut, (t, n) => {
								n(t, {
									get class() {
										return v(e);
									},
									get "aria-label"() {
										return i.triggerAriaLabel;
									},
									get ref() {
										return v(J);
									},
									set ref(e) {
										D(J, e, !0);
									},
									children: (e, t) => {
										var n = On();
										d(e, n);
									},
									$$slots: { default: !0 }
								});
							});
						}
						d(e, t);
					};
					l(o, (e) => {
						P() && N() ? e(u) : e(p, -1);
					});
					var b = _(o, 2);
					s(b, () => me, (n, r) => {
						r(n, {
							get to() {
								return W;
							},
							children: (n, r) => {
								var i = f(), a = E(i);
								s(a, () => ct, (n, r) => {
									r(n, {
										side: "bottom",
										get align() {
											return S();
										},
										sideOffset: 8,
										class: "post-history-menu-content",
										trapFocus: !1,
										preventScroll: !1,
										onCloseAutoFocus: (e) => {
											e.preventDefault(), U() && v(J)?.focus({ preventScroll: !0 });
										},
										children: (n, r) => {
											var i = jn(), a = g(i), o = (e) => {
												var n = An(), r = E(n), i = I(r, !0), a = _(r, 2);
												s(a, () => st, (e, t) => {
													t(e, { class: "post-history-menu-separator" });
												}), h(() => t(i, O())), d(e, n);
											};
											l(a, (e) => {
												O() && e(o);
											});
											var u = _(a, 2);
											c(u, () => k() ?? C), e(i), d(n, i);
										},
										$$slots: { default: !0 }
									});
								}), d(n, i);
							},
							$$slots: { default: !0 }
						});
					}), d(n, a);
				},
				$$slots: { default: !0 }
			});
		}), d(n, r);
	}, le = (e) => {
		var n = f(), r = E(n);
		s(r, () => it, (e, n) => {
			n(e, {
				children: (e, n) => {
					var r = f(), a = E(r), o = ne, c = re;
					s(a, () => $e, (e, n) => {
						n(e, {
							get open() {
								return o();
							},
							set open(e) {
								c(e);
							},
							delayDuration: 500,
							get disabled() {
								return v(K);
							},
							children: (e, n) => {
								var r = kn(), a = E(r);
								{
									let e = (e, t) => {
										let n = () => (t?.()).props, r = B(() => {
											let { onclick: e, ...t } = n();
											return {
												tooltipOnclick: e,
												restProps: t
											};
										});
										var a = Mn(), o = (e) => void ie(e, v(r).tooltipOnclick);
										b(a, (e) => ({
											type: "button",
											class: e,
											"aria-label": i.triggerAriaLabel,
											"aria-haspopup": "menu",
											"aria-expanded": v(K),
											...v(r).restProps,
											onclick: o,
											onkeydown: ae
										}), [() => `menu-trigger post-history-menu-trigger ${y()}`.trim()]), d(e, a);
									};
									s(a, () => qe, (t, n) => {
										n(t, {
											child: e,
											$$slots: { child: !0 }
										});
									});
								}
								var o = _(a, 2);
								s(o, () => me, (e, n) => {
									n(e, {
										get to() {
											return W;
										},
										children: (e, n) => {
											var r = f(), i = E(r);
											s(i, () => et, (e, n) => {
												n(e, {
													sideOffset: 8,
													class: "tooltip-content post-preview-tooltip-content",
													children: (e, n) => {
														T();
														var r = j();
														h(() => t(r, N())), d(e, r);
													},
													$$slots: { default: !0 }
												});
											}), d(e, r);
										},
										$$slots: { default: !0 }
									});
								}), d(e, r);
							},
							$$slots: { default: !0 }
						});
					}), d(e, r);
				},
				$$slots: { default: !0 }
			});
		}), d(e, n);
	}, ue = (e) => {
		var t = Nn();
		h((e) => {
			R(t, 1, e), L(t, "aria-label", i.triggerAriaLabel), L(t, "aria-expanded", v(K));
		}, [() => u(`menu-trigger post-history-menu-trigger ${y()}`.trim())]), p("click", t, (e) => void ie(e)), p("keydown", t, ae), d(e, t);
	};
	l(se, (e) => {
		v(ee) ? e(ce) : P() && N() ? e(le, 1) : e(ue, -1);
	}), d(n, oe), r();
}
o(["click", "keydown"]);
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRepliesBadgeButton.svelte
var In = a("<span class=\"post-preview-replies-badge svelte-11vk23d\" aria-hidden=\"true\"> </span>"), Ln = a("<!> <!>", 1), Rn = {
	hash: "svelte-11vk23d",
	code: ".post-preview-replies-badge-button {width:36px;min-width:36px;min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));background-color:var(\n            --post-history-preview-footer-surface,\n            var(--dialog-bg)\n        );}.post-preview-replies-badge.svelte-11vk23d {display:inline-flex;align-items:center;justify-content:center;aspect-ratio:1;width:20px;height:20px;border-radius:999px;background:var(--btn-post-preview-action);color:var(--post-history-preview-footer-surface, var(--dialog-bg));font-size:0.6875rem;font-weight:700;line-height:20px;text-align:center;}\n            .post-preview-replies-badge-button.selected\n                .post-preview-replies-badge\n         {background-color:var(--text-light);}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-preview-replies-badge-button:hover:not(:disabled)\n                    .post-preview-replies-badge\n             {background-color:var(--text);}\n    }"
};
function zn(e, n) {
	z(n, !0), w(e, Rn);
	let i = M(n, "tooltipContent", 19, () => n.ariaLabel), a = M(n, "className", 3, ""), o = V().overlayTarget;
	var c = f(), l = E(c);
	s(l, () => it, (e, r) => {
		r(e, {
			children: (e, r) => {
				var c = f(), l = E(c);
				s(l, () => $e, (e, r) => {
					r(e, {
						delayDuration: 500,
						children: (e, r) => {
							var c = Ln(), l = E(c);
							{
								let e = (e, r) => {
									let i = () => (r?.()).props, o = B(() => {
										let { onclick: e, ...t } = i();
										return {
											tooltipOnclick: e,
											restProps: t
										};
									});
									{
										let r = B(() => `post-preview-replies-badge-button ${a()}`);
										X(e, m({
											type: "button",
											get class() {
												return v(r);
											},
											get ariaLabel() {
												return n.ariaLabel;
											},
											contentLayout: "icon",
											shape: "circle",
											get selected() {
												return n.selected;
											},
											onClick: (e) => {
												n.onClick(), typeof v(o).tooltipOnclick == "function" && v(o).tooltipOnclick(e);
											}
										}, () => v(o).restProps, {
											children: (e, r) => {
												var i = In(), a = I(i, !0);
												h(() => t(a, n.count)), d(e, i);
											},
											$$slots: { default: !0 }
										}));
									}
								};
								s(l, () => qe, (t, n) => {
									n(t, {
										child: e,
										$$slots: { child: !0 }
									});
								});
							}
							var u = _(l, 2);
							s(u, () => me, (e, n) => {
								n(e, {
									get to() {
										return o;
									},
									children: (e, n) => {
										var r = f(), a = E(r);
										s(a, () => et, (e, n) => {
											n(e, {
												sideOffset: 8,
												class: "tooltip-content post-preview-tooltip-content",
												children: (e, n) => {
													T();
													var r = j();
													h(() => t(r, i())), d(e, r);
												},
												$$slots: { default: !0 }
											});
										}), d(e, r);
									},
									$$slots: { default: !0 }
								});
							}), d(e, c);
						},
						$$slots: { default: !0 }
					});
				}), d(e, c);
			},
			$$slots: { default: !0 }
		});
	}), d(e, c), r();
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
}, Hn = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function Un(e) {
	if (!_t(e.content)) return;
	let t = vt(e.content);
	if (t) return yt(e.tags ?? []).get(t)?.url;
}
function Wn(e) {
	let t = e.trim();
	if (!t) return "+";
	if (_t(t)) return t;
	let n = Hn.segment(t)[Symbol.iterator]().next();
	return n.done ? "" : n.value.segment;
}
function Gn(e, t) {
	return e ? e instanceof Map ? e.get(t) ?? null : e[t] ?? null : null;
}
function Kn(e) {
	try {
		return bt(pe(e), 9, 4);
	} catch {
		return e.slice(0, 12);
	}
}
function qn(e) {
	return e.profile?.displayName?.trim() || e.profile?.name?.trim() || Kn(e.pubkey);
}
async function Jn(e, t = Q) {
	return e ? t.getReactionRecords(e) : [];
}
function Yn(e, t) {
	if (e.length === 0) return Vn;
	let n = [], r = /* @__PURE__ */ new Map(), i = 0;
	for (let a of e) {
		if (a.kind !== 7) continue;
		i += 1;
		let e = Wn(a.content);
		if (!e) continue;
		let o = {
			eventId: a.eventId,
			pubkey: a.authorPubkey,
			profile: Gn(t, a.authorPubkey),
			createdAt: a.createdAt
		}, s = r.get(e), c = Un(a);
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
var Xn = a("<div class=\"favorite-icon svg-icon post-preview-reaction-symbol\" aria-hidden=\"true\"></div>"), Zn = a("<span class=\"post-preview-reaction-emoji-slot post-preview-reaction-emoji-failed\" role=\"img\" tabindex=\"0\"> </span>"), Qn = a("<img class=\"post-preview-reaction-emoji\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), $n = a("<span class=\"post-preview-reaction-emoji-placeholder\" aria-hidden=\"true\"></span>"), er = a("<span class=\"post-preview-reaction-emoji-slot\"><!></span>"), tr = a("<span class=\"post-preview-reaction-content\"> </span>"), nr = a("<span class=\"post-preview-reaction-actor\"><!></span>"), rr = a("<div class=\"post-preview-reaction-chip\"><div class=\"post-preview-reaction-summary\"><!> <span class=\"post-preview-reaction-count\"> </span></div> <div class=\"post-preview-reaction-actors\"></div></div>"), ir = a("<div class=\"post-preview-reactions-panel\"></div>"), ar = {
	hash: "svelte-j0ansb",
	code: ".post-preview-reactions-panel {display:flex;flex-wrap:wrap;gap:4px;padding:0 16px;}.post-preview-reaction-chip {display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:4px 8px;border-radius:18px;background:color-mix(in srgb, var(--btn-bg), transparent 40%);color:var(--text);}.post-preview-reaction-summary {display:inline-flex;align-items:center;justify-content:center;gap:2px;row-gap:4px;flex-wrap:wrap;}.post-preview-reaction-content {font-size:20px;line-height:1;}.post-preview-reaction-count {font-size:1rem;line-height:1;color:var(--text-muted);}.post-preview-reaction-emoji-slot {display:inline-grid;margin:0;padding:0;}.post-preview-reaction-emoji,\n    .post-preview-reaction-emoji-placeholder {width:100%;height:100%;}.post-preview-reaction-emoji {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-preview-reaction-emoji-placeholder {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}.post-preview-reaction-emoji-failed {display:inline-grid;place-items:center;overflow:hidden;border-radius:4px;background:rgba(127, 127, 127, 0.18);font-size:0.45em;line-height:1;white-space:nowrap;cursor:help;}.post-preview-reaction-actors {display:inline-flex;flex-wrap:wrap;gap:2px;align-items:center;}.post-preview-reaction-actor {display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:999px;overflow:hidden;flex:0 0 auto;}.post-preview-reaction-avatar,\n    .post-preview-reaction-avatar-image,\n    .post-preview-reaction-avatar-fallback {width:100%;height:100%;}.post-preview-reaction-avatar-image {object-fit:cover;}.post-preview-reaction-symbol {width:18px;height:18px;background-color:rgb(249, 24, 128);mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}"
};
function or(a, o) {
	z(o, !0), w(a, ar);
	let s = M(o, "emojiLoadStateByUrl", 19, () => ({})), c = M(o, "emojiImageMetaByUrl", 19, () => ({}));
	function u(e) {
		let t = c()[e]?.aspectRatio;
		return `width:${typeof t == "number" && Number.isFinite(t) && t > 0 ? 18 * t : 18}px;height:18px;vertical-align:bottom;`;
	}
	var p = f(), m = E(p), y = (r) => {
		var a = ir();
		i(a, 21, () => o.readModel.groups, (e) => e.content, (r, a) => {
			var o = rr(), c = g(o), p = g(c), m = (e) => {
				var t = Xn();
				d(e, t);
			}, y = B(() => rt(v(a).content)), b = (r) => {
				var i = f(), o = E(i), c = (e) => {
					var r = Zn(), i = I(r, !0);
					h((e) => {
						n(r, e), L(r, "aria-label", v(a).content), L(r, "title", v(a).content), t(i, v(a).content);
					}, [() => u(v(a).emojiUrl)]), d(e, r);
				}, p = (t) => {
					var r = er(), i = g(r), o = (e) => {
						var t = Qn();
						h(() => {
							L(t, "src", v(a).emojiUrl), L(t, "alt", v(a).content), L(t, "title", v(a).content);
						}), d(e, t);
					}, c = (e) => {
						var t = $n();
						d(e, t);
					};
					l(i, (e) => {
						s()[v(a).emojiUrl] === "ready" ? e(o) : e(c, -1);
					}), e(r), h((e) => n(r, e), [() => u(v(a).emojiUrl)]), d(t, r);
				};
				l(o, (e) => {
					s()[v(a).emojiUrl] === "failed" ? e(c) : e(p, -1);
				}), d(r, i);
			}, x = (e) => {
				var n = tr(), r = I(n, !0);
				h(() => t(r, v(a).content)), d(e, n);
			};
			l(p, (e) => {
				v(y) ? e(m) : v(a).emojiUrl ? e(b, 1) : e(x, -1);
			});
			var S = _(p, 2), C = I(S, !0);
			e(c);
			var w = _(c, 2);
			i(w, 21, () => v(a).reactors, (e) => e.eventId, (t, n) => {
				let r = B(() => qn(v(n)));
				var i = nr(), a = g(i);
				{
					let e = B(() => v(n).profile?.picture || "");
					xt(a, {
						get src() {
							return v(e);
						},
						get alt() {
							return v(r);
						},
						rootClassName: "post-preview-reaction-avatar",
						imageClassName: "post-preview-reaction-avatar-image",
						fallbackClassName: "post-preview-reaction-avatar-fallback",
						get fallbackAriaLabel() {
							return v(r);
						},
						fallbackDelayMs: 0
					});
				}
				e(i), h(() => {
					L(i, "title", v(r)), L(i, "aria-label", v(r));
				}), d(t, i);
			}), e(w), e(o), h(() => t(C, v(a).count)), d(r, o);
		}), e(a), d(r, a);
	};
	l(m, (e) => {
		o.readModel.totalCount > 0 && e(y);
	}), d(a, p), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRawJsonDialog.svelte
var sr = a("<div class=\"xmark-icon svg-icon svelte-10wau4w\"></div>"), cr = a("<!> <!>", 1), lr = a("<pre class=\"raw-json-content svelte-10wau4w\"><code> </code></pre>"), ur = a("<!> <!> <!>", 1), dr = a("<div class=\"raw-json-heading svelte-10wau4w\"><h2 class=\"svelte-10wau4w\"> </h2></div> <!>", 1), fr = {
	hash: "svelte-10wau4w",
	code: ".xmark-icon.svelte-10wau4w {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-raw-json-dialog .dialog-content {padding:8px;}.post-history-raw-json-dialog--tabs {height:min(80svh, 720px);max-height:calc(100svh - 24px);}.post-history-raw-json-dialog--tabs .dialog-content {flex:1 1 0;min-height:0;max-height:none;overflow:hidden;box-sizing:border-box;align-items:stretch;}.raw-json-heading.svelte-10wau4w {width:100%;flex:0 0 auto;}.raw-json-heading.svelte-10wau4w h2:where(.svelte-10wau4w) {margin:0;font-size:1.1rem;}.raw-json-tabs {display:flex;width:100%;box-sizing:border-box;gap:4px;margin-top:8px;border-bottom:1px solid var(--border-hr);}.raw-json-tabs-root,\n    .raw-json-panel {width:100%;min-width:0;}.raw-json-tabs-root {display:flex;flex:1 1 0;flex-direction:column;min-height:0;overflow:hidden;}.raw-json-panel[data-state=\"active\"] {display:flex;flex:1 1 0;min-height:0;overflow:hidden;}.post-history-raw-json-dialog--tabs .raw-json-content {flex:1 1 0;min-height:0;height:auto;}.raw-json-tabs button {border:0;border-bottom:2px solid transparent;padding:6px 10px;background:transparent;color:var(--text);font:inherit;cursor:pointer;}.raw-json-tabs button[data-state=\"active\"] {border-bottom-color:var(--accent-color);}.raw-json-content.svelte-10wau4w {width:100%;min-width:0;box-sizing:border-box;height:100%;margin:10px 0 0;padding:8px;overflow:auto;border:1px solid var(--border-hr);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--text) 4%);color:var(--text);font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,\n            \"Liberation Mono\", monospace;font-size:0.82rem;line-height:1.45;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere;}.post-history-raw-json-dialog {max-width:min(760px, calc(100% - 10px));}"
};
function pr(n, i) {
	z(i, !0), w(n, fr);
	let a = () => N(Y, "$_", o), [o, c] = k(), u = M(i, "open", 15, !1), p = M(i, "resetKey", 3, 0), y = M(i, "loadPayloadEvent", 3, void 0), b = M(i, "observePayloadStatus", 3, void 0), S = M(i, "onOpenChange", 3, void 0), C = x("structure"), O = x(void 0), F, R, V = 0, H = -1, U = B(() => De(i.rawEvent) && Re(i.rawEvent) ? i.rawEvent : null), W = B(() => y() !== void 0 && v(U) !== null), G = B(() => JSON.stringify(i.rawEvent, null, 2) ?? ""), K = B(() => v(O) ? JSON.stringify(v(O), null, 2) ?? "" : "");
	function q() {
		V += 1, F?.abort(), F = void 0, R?.(), R = void 0, D(C, "structure"), D(O, void 0);
	}
	P(q), A(() => {
		let e = p();
		e !== H && q(), H = e;
	});
	async function J(e) {
		if (D(C, e, !0), e !== "payload" || v(O) !== void 0 || !v(U) || !y()) return;
		let t = new AbortController();
		F?.abort(), F = t;
		let n = ++V, r = v(U).id;
		R?.(), R = b()?.(v(U), (e) => {
			(e === "deleted" || e === "invalid") && u() && v(U)?.id === r && D(O, null);
		});
		try {
			let e = await y()(v(U), t.signal);
			!t.signal.aborted && n === V && D(O, e, !0);
		} catch {
			!t.signal.aborted && n === V && D(O, null);
		} finally {
			n === V && (F = void 0);
		}
	}
	function ee(e) {
		e || (q(), S()?.(!1));
	}
	{
		let r = (e) => {
			var t = f(), n = E(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = B(() => a()("global.close"));
						X(e, m(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return v(t);
							},
							children: (e, t) => {
								var n = sr();
								h((e) => L(n, "aria-label", e), [() => a()("global.close")]), d(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				s(n, () => ft, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			d(e, t);
		}, i = B(() => a()("postHistory.rawJsonTitle")), o = B(() => a()("postHistory.rawJsonDescription")), c = B(() => v(W) ? "post-history-raw-json-dialog post-history-raw-json-dialog--tabs" : "post-history-raw-json-dialog");
		dt(n, {
			onOpenChange: ee,
			get title() {
				return v(i);
			},
			get description() {
				return v(o);
			},
			get contentClass() {
				return v(c);
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
				var i = dr(), o = E(i), c = g(o), u = I(c, !0);
				e(o);
				var p = _(o, 2), m = (n) => {
					var r = f(), i = E(r);
					s(i, () => pt, (n, r) => {
						r(n, {
							get value() {
								return v(C);
							},
							onValueChange: (e) => void J(e),
							class: "raw-json-tabs-root",
							children: (n, r) => {
								var i = ur(), a = E(i);
								s(a, () => mt, (e, t) => {
									t(e, {
										class: "raw-json-tabs",
										children: (e, t) => {
											var n = cr(), r = E(n);
											s(r, () => gt, (e, t) => {
												t(e, {
													value: "structure",
													children: (e, t) => {
														T();
														var n = j("Structure");
														d(e, n);
													},
													$$slots: { default: !0 }
												});
											});
											var i = _(r, 2);
											s(i, () => gt, (e, t) => {
												t(e, {
													value: "payload",
													children: (e, t) => {
														T();
														var n = j("Payload");
														d(e, n);
													},
													$$slots: { default: !0 }
												});
											}), d(e, n);
										},
										$$slots: { default: !0 }
									});
								});
								var o = _(a, 2);
								s(o, () => ht, (n, r) => {
									r(n, {
										value: "structure",
										class: "raw-json-panel",
										children: (n, r) => {
											var i = lr(), a = g(i), o = I(a, !0);
											e(i), h(() => t(o, v(G))), d(n, i);
										},
										$$slots: { default: !0 }
									});
								});
								var c = _(o, 2);
								s(c, () => ht, (n, r) => {
									r(n, {
										value: "payload",
										class: "raw-json-panel",
										children: (n, r) => {
											var i = lr(), a = g(i), o = I(a, !0);
											e(i), h(() => t(o, v(K))), d(n, i);
										},
										$$slots: { default: !0 }
									});
								}), d(n, i);
							},
							$$slots: { default: !0 }
						});
					}), d(n, r);
				}, y = (n) => {
					var r = lr(), i = g(r), a = I(i, !0);
					e(r), h(() => t(a, v(G))), d(n, r);
				};
				l(p, (e) => {
					v(W) ? e(m) : e(y, -1);
				}), h((e) => t(u, e), [() => a()("postHistory.rawJsonTitle")]), d(n, i);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	r(), c();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostPreviewToggleButton.svelte
var mr = a("<div><!></div>"), hr = {
	hash: "svelte-1yd56n0",
	code: ".post-preview-toggle-row.svelte-1yd56n0 {display:flex;&.post-preview-toggle-hidden {visibility:hidden;pointer-events:none;}&.post-preview-toggle-overlay {position:absolute;inset-inline-end:0;inset-block-end:0;z-index:1;padding-inline-start:12px;background:linear-gradient(90deg, transparent, var(--dialog-bg) 18%);}&.post-preview-toggle-flow {position:static;align-self:flex-end;padding:0;background:none;}.ehagaki-app-root & button.post-preview-toggle-button,\n        .ehagaki-app-root & button.post-preview-toggle-button:hover {color:var(--text-muted);font-size:0.875rem;font-weight:normal;min-height:24px;padding:0;background:transparent;}\n\n        @media (hover: hover) and (pointer: fine) {.ehagaki-app-root & button.post-preview-toggle-button:hover {text-decoration:underline;}\n        }}"
};
function gr(n, i) {
	z(i, !0), w(n, hr);
	let a = () => N(Y, "$_", o), [o, s] = k(), c = M(i, "visible", 3, !0), l = M(i, "placement", 3, "inline");
	var u = mr();
	let f;
	var p = g(u);
	{
		let e = B(() => !c());
		X(p, {
			type: "button",
			class: "post-preview-action-button post-preview-toggle-button",
			get "aria-expanded"() {
				return i.expanded;
			},
			get "aria-controls"() {
				return i.controls;
			},
			get disabled() {
				return v(e);
			},
			get onClick() {
				return i.onToggle;
			},
			children: (e, n) => {
				T();
				var r = j();
				h((e) => t(r, e), [() => i.expanded ? a()("postHistory.collapse") : a()("postHistory.expand")]), d(e, r);
			},
			$$slots: { default: !0 }
		});
	}
	e(u), h(() => f = R(u, 1, "post-preview-toggle-row svelte-1yd56n0", null, f, {
		"post-preview-toggle-overlay": l() === "overlay" && (!i.expanded || !c()),
		"post-preview-toggle-flow": l() === "overlay" && i.expanded && c(),
		"post-preview-toggle-hidden": !c()
	})), d(n, u), r(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryPreviewCollapse.svelte.ts
function _r({ getShow: e, getSessionOpen: t = e, getPosts: n, getContainer: r, maxLines: i = 5 }) {
	let a = x(y({})), o = x(y({})), s = {}, c = null, l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set(), d = !1, f = null, p = 0;
	function m(e) {
		let t = getComputedStyle(e), n = parseFloat(t.lineHeight);
		if (!n || Number.isNaN(n)) {
			let e = parseFloat(t.fontSize);
			return e && !Number.isNaN(e) ? e * 1.5 : 24;
		}
		return n;
	}
	function h(e, t) {
		return s[t] = e, S(t), { destroy() {
			s[t] === e && delete s[t];
		} };
	}
	function g(e) {
		let t = Object.keys(v(a)), n = Object.keys(e);
		t.length === n.length && t.every((t) => v(a)[t] === e[t]) || D(a, e, !0);
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
				let t = v(a)[e.eventId];
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
	function b() {
		if (f) return f;
		let e = ++p, t = F().then(() => {
			e === p && (f = null, _());
		});
		return f = t, t;
	}
	function S(e) {
		return e ? u.add(e) : d = !0, b();
	}
	function C() {
		let e = r();
		typeof ResizeObserver < "u" && e && (c || (c = new ResizeObserver(() => {
			S();
		}), c.observe(e)));
	}
	function w() {
		c?.disconnect(), c = null;
	}
	function T() {
		p++, f = null, w(), s = {};
	}
	function E() {
		T(), g({}), D(o, {}, !0), s = {}, l.clear(), u.clear(), d = !1, w();
	}
	function k(e) {
		return v(o)[e.eventId] ?? !1;
	}
	function j(e) {
		D(o, {
			...v(o),
			[e]: !v(o)[e]
		}, !0);
	}
	function M(e) {
		return e.forceCollapsible === !0 || (v(a)[e.eventId] ?? !1);
	}
	return A(() => {
		t() || O(E);
	}), A(() => {
		if (!e()) return;
		let t = n(), r = /* @__PURE__ */ new Map();
		for (let e of t) {
			let t = {
				content: e.content,
				forceCollapsible: e.forceCollapsible
			}, n = l.get(e.eventId);
			(n?.content !== t.content || n.forceCollapsible !== t.forceCollapsible) && u.add(e.eventId), r.set(e.eventId, t);
		}
		l = r, b();
	}), A(() => {
		if (e() && r()) return C(), () => {
			w();
		};
	}), P(() => {
		w();
	}), {
		suspend: T,
		previewRef: h,
		isPostExpanded: k,
		remeasure: () => S(),
		togglePostExpanded: j,
		shouldCollapsePost: M
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDirectReplyRepairSaveService.ts
var vr = {
	status: "saved",
	savedParentEventIds: [],
	savedDirectReplyCount: 0,
	deletedEventIds: [],
	deletionConfirmationIncomplete: !1
};
function yr(e) {
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
function br(e, t) {
	return e.filter((e) => t.get(e.event.pubkey)?.has(e.event.id)).map((e) => e.event.id);
}
function xr(e) {
	return {
		...e,
		status: "cancelled",
		savedParentEventIds: [],
		savedDirectReplyCount: 0
	};
}
var Sr = new class {
	deletionFetchService;
	deletionRequestsRepository;
	childInteractionsRepository;
	now;
	constructor(e = {}) {
		this.deletionFetchService = e.deletionFetchService ?? Ze, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Ye, this.childInteractionsRepository = e.childInteractionsRepository ?? Fe, this.now = e.now ?? Date.now;
	}
	saveRepairDirectReplies(e, t) {
		let n = !0, r = null, i = () => n && t.isActive?.() !== !1;
		return {
			promise: (async () => {
				let n = yr(t.items);
				if (n.length === 0) return vr;
				let a = await this.filterKnownDeletedDirectReplies(n), o = a.deletedEventIds;
				if (!i()) return xr({
					...vr,
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
					if (r = null, !i() || n.status === "cancelled") return xr({
						...vr,
						deletedEventIds: o,
						deletionConfirmationIncomplete: c || n.status !== "success"
					});
					if (c = n.status !== "success", n.events.length > 0 && await this.deletionRequestsRepository.upsertValidDeletionRequests({
						targetEvents: s.map((e) => e.event),
						deletionEvents: n.events,
						fetchedAt: n.fetchedAt
					}), !i()) return xr({
						...vr,
						deletedEventIds: o,
						deletionConfirmationIncomplete: c
					});
					let a = await this.filterKnownDeletedDirectReplies(s);
					s = a.visibleItems, o = Array.from(/* @__PURE__ */ new Set([...o, ...a.deletedEventIds]));
				}
				if (!i()) return xr({
					...vr,
					deletedEventIds: o,
					deletionConfirmationIncomplete: c
				});
				let l = await this.saveVisibleDirectReplies(s, t.fetchedAt ?? this.now(), i, t.expectedChildGeneration);
				return i() ? {
					...l,
					status: "saved",
					deletedEventIds: o,
					deletionConfirmationIncomplete: c
				} : xr({
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
		let t = br(e, await this.deletionRequestsRepository.getDeletedTargets(e.map((e) => ({
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
}(), Cr = [
	"reply",
	"reaction",
	"quote"
];
function wr(e) {
	let t = e ?? Cr;
	return Array.from(new Set(t.filter((e) => e === "reply" || e === "reaction" || e === "quote")));
}
function Tr(e, t) {
	let n = wr(t.relationKinds);
	return {
		source: e,
		relationKinds: n,
		parentEventIds: Array.from(new Set(t.savedParentEventIds)),
		shouldRefreshQuotePreviews: n.includes("quote") && t.quoteRepairApplied
	};
}
var Er = 6e3, Dr = 8, Or = 6e4, kr = Cr, Ar = {
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
function jr() {
	let e = Math.random().toString(36).slice(2, 10);
	return `post-history-visible-relation-repair-${Date.now().toString(36)}-${e}`;
}
function Mr(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of t) if ([
		1,
		42,
		1111
	].includes(r.kind) && r.pubkeyHex === e && r.eventId && !n.has(r.eventId) && (n.set(r.eventId, r), n.size >= 150)) break;
	return Array.from(n.values());
}
function Nr(e, t) {
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
function Pr(e, t) {
	return t.includeDirectReplies ? [
		1,
		42,
		1111
	].flatMap((t) => Nr(e.filter((e) => e.kind === t), 30).map((e) => ({
		posts: e,
		depth: 0
	}))) : Nr(e, 30).map((e) => ({
		posts: e,
		depth: 0
	}));
}
function Fr(e) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls).sort((e, t) => e.localeCompare(t))
	})).sort((e, t) => e.event.created_at === t.event.created_at ? e.event.id.localeCompare(t.event.id) : t.event.created_at - e.event.created_at);
}
var Ir = new class {
	directReplySaveService;
	childInteractionsRepository;
	quoteVisibleRangeRepairExecutor;
	console;
	setTimeoutFn;
	clearTimeoutFn;
	now;
	lastFetchTimeoutWarnAt = 0;
	constructor(e = {}) {
		this.directReplySaveService = e.directReplySaveService ?? Sr, this.childInteractionsRepository = e.childInteractionsRepository ?? Fe, this.quoteVisibleRangeRepairExecutor = e.quoteVisibleRangeRepairExecutor, this.console = e.console ?? (globalThis.console === void 0 ? {
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
		let o = Array.from(a.values()).slice(0, 150), s = o.map((e) => e.eventId), c = Me($);
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
		let n = wr(t.relationKinds ?? kr), r = this.repairVisibleRangeChildInteractionsInternal(e, t, {
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
		let r = !0, i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = () => r && t.isActive?.() !== !1, s = Mr(t.ownerPubkeyHex, t.visiblePosts), c = s.map((e) => e.eventId), l = Me($);
		return {
			promise: (async () => {
				if (s.length === 0) return {
					...Ar,
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
							y.status !== "success" && !b && (h = !0), y.requiresFallback && (p += 1, _.depth === 0 ? c.push(...Nr(_.posts, 10).map((e) => ({
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
				}, _ = await g(Pr(s, n));
				if (o() && _.length > 0 && await g(_), !o()) return {
					...Ar,
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
			let t = Ve({
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
			return !t || !r || !at({
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
			let t = Le(e.event).reference, r = t ? n.get(t.eventId) : void 0;
			return !t || !r || !ke(t, r) || e.event.id === t.eventId ? [] : [{
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
		let { destinationRelayUrls: i, coverageRelayUrls: a } = this.resolveRelayPlan(t, n), o = t.map((e) => e.eventId), s = jr(), c = `${s}:0`, l = _e(s), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), g = 0, _ = !1, v, y, b, x, S, C, w = () => {
			S !== void 0 && (this.clearTimeoutFn(S), S = void 0), v?.unsubscribe?.(), v = void 0, y?.unsubscribe?.(), y = void 0, b?.unsubscribe?.(), b = void 0, x?.unsubscribe?.(), x = void 0;
		}, T = (e) => {
			let t = Fr(u), n = new Set(Array.from(d.entries()).filter(([, e]) => e >= 250).map(([e]) => e)), r = a.some((e) => n.has(e)), o = a.length > 0 && a.every((e) => f.has(e));
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
				let s = (e) => {
					_ || (_ = !0, w(), n(T(e)));
				};
				C = s;
				try {
					if (o.length === 0) {
						s("complete");
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
					} }), v = je(e, l, { on: i.length > 0 ? { relays: i } : { defaultReadRelays: !0 } }).subscribe({
						next: (e) => {
							g += 1;
							let t = this.sanitizeCandidateRelayUrl(e.from, i);
							this.handleCandidatePacket(u, e, t);
						},
						complete: () => s("complete"),
						error: (e) => {
							this.console.error("post_history_visible_child_interaction_repair_fetch_error", e), s("error");
						}
					});
					let n = r.includeDirectReplies ? t.flatMap((e) => e.kind === 1 ? [1, 1111] : e.kind === 42 ? [42] : e.kind === 1111 ? [1111] : []) : [], _ = Array.from(/* @__PURE__ */ new Set([...n, ...r.includeReactions ? [7] : []])).sort((e, t) => e - t);
					l.emit({
						kinds: _,
						"#e": o,
						limit: 250
					}), l.over(), S = this.setTimeoutFn(() => {
						a.length > 0 && a.every((e) => f.has(e)) || this.warnCandidateFetchTimeout(), s("timeout");
					}, Er);
				} catch (e) {
					this.console.error("post_history_visible_child_interaction_repair_request_error", e), s("error");
				}
			}),
			cancel: () => C?.("cancelled")
		};
	}
	warnCandidateFetchTimeout() {
		let e = this.now();
		e - this.lastFetchTimeoutWarnAt < Or || (this.lastFetchTimeoutWarnAt = e, this.console.warn("post_history_visible_child_interaction_repair_fetch_timeout"));
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
		let n = this.collectParentRelayHints(e), r = ce(n, Dr);
		if (r !== null) return {
			destinationRelayUrls: r,
			coverageRelayUrls: ue()
		};
		let i = t ? W.sanitizeExternalRelayUrls(W.extractReadRelays(t)) : [], a = t ? W.sanitizeExternalRelayUrls(W.extractWriteRelays(t)) : [], o = W.sanitizeExternalRelayUrls(H), s = i.length > 0 ? i : a.length > 0 ? a : o, c = i.length > 0 ? a.filter((e) => !s.includes(e)) : [], l = W.sanitizeExternalRelayUrls(n, { limit: Dr });
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
function Lr(e) {
	let t = x({}), n = x({}), r = x({}), i = x(0), a = 0, o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map(), l = null, u = e.source ?? "related-card-display", d = e.profileSync.subscribe((t, r) => {
		e.getShow() && D(n, {
			...v(n),
			[t]: r
		});
	}), f = () => {
		D(i, v(i) + 1);
	}, p = () => {
		document.visibilityState === "visible" && D(i, v(i) + 1);
	};
	A(() => {
		if (e.getShow() && typeof window < "u") return window.addEventListener("online", f), document.addEventListener("visibilitychange", p), () => {
			window.removeEventListener("online", f), document.removeEventListener("visibilitychange", p);
		};
	}), P(() => {
		a += 1, l?.cancel(), typeof window < "u" && (window.removeEventListener("online", f), document.removeEventListener("visibilitychange", p)), d();
	});
	function m(e) {
		return v(r)[e] ? Yn(v(t)[e] ?? [], v(n)) : null;
	}
	function h(e) {
		return !!v(r)[e];
	}
	A(() => {
		let d = e.getShow(), f = e.getPubkeyHex() ?? "", p = e.getRxNostr(), m = e.getRelayConfig(), h = e.getTargets(), g = v(i);
		if (!d) {
			a += 1, l?.cancel(), l = null, s.clear(), (e.getSessionOpen ?? e.getShow)() || (o.clear(), c.clear(), D(t, {}), D(r, {}));
			return;
		}
		let _ = ++a, y = !0, b = null, x = () => y && _ === a && e.getShow() && (e.getPubkeyHex() ?? "") === f && e.getRxNostr() === p, S = /* @__PURE__ */ new Map();
		for (let e of h) {
			if (!e.eventId) continue;
			let t = S.get(e.eventId);
			S.set(e.eventId, {
				eventId: e.eventId,
				targetAuthorPubkey: e.targetAuthorPubkey ?? t?.targetAuthorPubkey,
				targetKind: e.targetKind ?? t?.targetKind,
				relayHints: Array.from(/* @__PURE__ */ new Set([...t?.relayHints ?? [], ...e.relayHints])).sort()
			});
		}
		let C = Array.from(S.values()), w = C.map((e) => e.eventId), T = JSON.stringify(Object.entries(m ?? {}).sort(([e], [t]) => e.localeCompare(t))), E = (e) => JSON.stringify([
			e.eventId,
			e.targetAuthorPubkey,
			e.targetKind,
			e.relayHints,
			T
		]), O = (e) => JSON.stringify([E(e), g]), k = new Set(C.map((e) => e.eventId));
		for (let e of c.keys()) k.has(e) || c.delete(e);
		return C.forEach((e) => c.set(e.eventId, O(e))), (async () => {
			let a = await Q.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => Q.getReactionRecords(e, S.get(e))))).flat();
			if (!x()) return;
			let d = {};
			for (let e of w) d[e] = a.filter((t) => t.parentEventId === e);
			D(t, {
				...v(t),
				...d
			}), D(r, {
				...v(r),
				...Object.fromEntries(w.map((e) => [e, !0]))
			});
			for (let t of a) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && D(n, {
					...v(n),
					[t.authorPubkey]: r
				});
			}
			if (!p || w.length === 0 || (await nt({
				source: u,
				parentEventIds: w,
				rxNostr: p,
				relayConfig: m,
				isActive: x
			}), !x())) return;
			let h = await Q.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => Q.getReactionRecords(e, S.get(e))))).flat();
			if (!x()) return;
			for (let e of w) d[e] = h.filter((t) => t.parentEventId === e);
			D(t, {
				...v(t),
				...d
			});
			let g = C.filter((e) => !o.has(E(e)) && !s.has(e.eventId));
			if (!g.length) return;
			g.forEach((e) => s.add(e.eventId));
			let _ = new Map(g.map((e) => [e.eventId, O(e)]));
			b = Ir.repairRelatedCardReactions(p, {
				targets: g,
				relayConfig: m,
				isActive: x
			}), l = b;
			let y = await b.promise.catch(() => ({
				status: "partial",
				targetEventIds: g.map((e) => e.eventId)
			}));
			l === b && (l = null), b = null, g.forEach((e) => s.delete(e.eventId));
			let T = e.getShow() && (e.getPubkeyHex() ?? "") === f && e.getRxNostr() === p, k = g.some((e) => {
				let t = c.get(e.eventId);
				return t !== void 0 && (y.status === "cancelled" || t !== _.get(e.eventId));
			});
			if (T && k && D(i, v(i) + 1), !x() || y.status === "cancelled") return;
			if (y.status === "success") {
				let e = new Set(y.targetEventIds);
				g.filter((t) => e.has(t.eventId)).forEach((e) => o.add(E(e)));
			}
			let A = await Q.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => Q.getReactionRecords(e, S.get(e))))).flat();
			if (!x()) return;
			for (let e of w) d[e] = A.filter((t) => t.parentEventId === e);
			D(t, {
				...v(t),
				...d
			});
			for (let t of A) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && D(n, {
					...v(n),
					[t.authorPubkey]: r
				});
			}
			let j = await nt({
				source: u,
				parentEventIds: w,
				rxNostr: p,
				relayConfig: m,
				isActive: x
			});
			if (x() && j.deletedReactionEventIds.length > 0) {
				let e = await Q.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => Q.getReactionRecords(e, S.get(e))))).flat();
				if (!x()) return;
				for (let t of w) d[t] = e.filter((e) => e.parentEventId === t);
				D(t, {
					...v(t),
					...d
				});
			}
		})().catch(() => void 0), () => {
			y = !1, b?.cancel(), l === b && (l = null);
		};
	});
	async function g(i) {
		let o = a, s = e.getPubkeyHex(), c = e.getRxNostr(), l = e.getTargets().filter((e) => i.includes(e.eventId)), u = await Promise.all(l.map((e) => Q.getReactionRecords(e.eventId, e)));
		o === a && e.getShow() && e.getPubkeyHex() === s && e.getRxNostr() === c && l.forEach((i, a) => {
			D(t, {
				...v(t),
				[i.eventId]: u[a]
			}), D(r, {
				...v(r),
				[i.eventId]: !0
			});
			for (let t of u[a]) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && D(n, {
					...v(n),
					[t.authorPubkey]: r
				});
			}
		});
	}
	function _() {
		a++, l?.cancel(), l = null, s.clear();
	}
	return {
		getReadModel: m,
		isLoaded: h,
		refreshCachedReactions: g,
		suspend: _
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryPostActionUiController.svelte.ts
function Rr() {
	let e = x(y({})), t = x(!1), n = x(null);
	function r(t) {
		return v(e)[t] ?? !1;
	}
	function i(t, n) {
		D(e, {
			...v(e),
			[t]: n
		}, !0);
	}
	function a() {
		Object.keys(v(e)).length > 0 && D(e, {}, !0);
	}
	function o(e) {
		D(t, e, !0), e || D(n, null);
	}
	function s(e) {
		a(), D(n, e, !0), D(t, !0);
	}
	function c() {
		o(!1);
	}
	function l() {
		D(n, null);
	}
	function u() {
		D(t, !1), D(n, null);
	}
	function d() {
		D(e, {}, !0), u();
	}
	return {
		get deleteConfirmOpen() {
			return v(t);
		},
		get deleteTargetPost() {
			return v(n);
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
var zr = [
	1,
	6,
	16,
	42,
	1111
];
function Br() {
	return {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	};
}
function Vr(e, t) {
	return !t || e.pubkeyHex !== t || typeof e.deletedAt == "number" ? !1 : zr.includes(e.kind) && typeof e.eventId == "string" && e.eventId.length > 0;
}
function Hr(e, t = Math.floor(Date.now() / 1e3), n) {
	let r = [["e", e.eventId], ["k", String(e.kind)]];
	return n && r.push(["e", n], ["k", "36"]), {
		kind: 5,
		pubkey: e.pubkeyHex,
		content: "",
		tags: r,
		created_at: t
	};
}
function Ur(e, t, n) {
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
var Wr = new class {
	deps;
	constructor(e = {}) {
		this.deps = {
			authStateStore: e.authStateStore ?? oe,
			keyManager: e.keyManager ?? he,
			window: e.window ?? (typeof window < "u" ? window : {}),
			console: e.console ?? (globalThis.console === void 0 ? Br() : globalThis.console),
			seckeySignerFn: e.seckeySignerFn ?? ae,
			getNip46SignerForSessionFn: e.getNip46SignerForSessionFn ?? ((e) => ge.getSignerForSession(e)),
			getParentClientSignerFn: e.getParentClientSignerFn ?? (() => ie.getSigner()),
			writeRelaysStore: e.writeRelaysStore ?? se,
			postHistoryDeletionRequestsRepository: e.postHistoryDeletionRequestsRepository ?? Ye,
			eventSenderFactory: e.eventSenderFactory,
			sensitivePayloadRepository: e.sensitivePayloadRepository ?? ze,
			fetchPayloadFn: e.fetchPayloadFn ?? Je.fetchEventById.bind(Je),
			saveSensitivePayloadFn: e.saveSensitivePayloadFn ?? ze.putCandidate.bind(ze),
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
		if (le() && W.sanitizeExternalRelayUrls(this.deps.writeRelaysStore.value).length === 0) return {
			success: !1,
			error: "no_write_relays"
		};
		let r = () => te(this.deps.authStateStore, n);
		if (!Vr(e.post, n)) return {
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
		let o = await this.resolveAssociatedPayload(e.post, e.rxNostr), s = De(e.post.rawEvent) && !!Ce(e.post.rawEvent) && !o, c = Hr(e.post, Math.floor(this.deps.now() / 1e3), o?.id), l;
		try {
			r();
			let e = re(c), t = await a.signEvent(e.signerTemplate);
			r(), l = ne(e.expectedTemplate, t, n), r();
		} catch {
			return this.deps.console.error("post_deletion_sign_failed", {
				stage: "sign-event",
				reason: "unexpected"
			}), {
				success: !1,
				error: "post_error"
			};
		}
		let u = Ie(l);
		if (!u) return {
			success: !1,
			error: "post_error"
		};
		let d = Ur(e.post, this.deps.writeRelaysStore.value, o), f;
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
				targetEvent: De(e.post.rawEvent) ? e.post.rawEvent : void 0,
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
		return this.deps.eventSenderFactory ? this.deps.eventSenderFactory(e, this.deps.console) : new ve(e, this.deps.console);
	}
	async resolveAssociatedPayload(e, t) {
		let n = e.rawEvent;
		if (!De(n)) return;
		let r = Ce(n);
		if (!r || n.id !== e.eventId || n.pubkey !== e.pubkeyHex) return;
		let i;
		try {
			[i] = await this.deps.sensitivePayloadRepository.getByIds([r.eventId]);
		} catch {
			return;
		}
		if (i?.deletedAt !== void 0) return;
		if (!i) {
			let a = await Oe($, e.pubkeyHex), o = this.deps.fetchPayloadFn(t, {
				eventId: r.eventId,
				relayHints: W.sanitizeExternalRelayUrls([
					...r.relayHint ? [r.relayHint] : [],
					...e.acceptedRelays ?? [],
					...e.fetchedRelays ?? [],
					...e.relayHints ?? []
				]),
				relayConfig: de.value
			});
			try {
				let t = await o.promise;
				if (!t.event || !Se(n, t.event, r.eventId)) return;
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
		if (Se(n, a, r.eventId)) return {
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
}({ storeSignedEventsFn: (e, t) => tt.storeSignedEventsBestEffort(e, t) });
// D:/ドキュメント/GitHub/ehagaki/src/lib/postBroadcastService.ts
function Gr() {
	return {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	};
}
function Kr(e) {
	let t = e.rawEvent;
	if (!t || typeof t != "object") return null;
	let n = t;
	return typeof n.id != "string" || typeof n.pubkey != "string" || typeof n.created_at != "number" || typeof n.kind != "number" || !Array.isArray(n.tags) || typeof n.content != "string" || typeof n.sig != "string" ? null : n;
}
var qr = new class {
	deps;
	constructor(e = {}) {
		this.deps = {
			writeRelaysStore: e.writeRelaysStore ?? se,
			console: e.console ?? (globalThis.console === void 0 ? Gr() : globalThis.console)
		};
	}
	async broadcast(e) {
		if (!e.rxNostr) return {
			success: !1,
			error: "nostr_not_ready"
		};
		let t = e.rxNostr, n = Kr(e.post);
		if (!n) return {
			success: !1,
			error: "invalid_event"
		};
		let r = W.sanitizeExternalRelayUrls(this.deps.writeRelaysStore.value);
		return r.length === 0 ? {
			success: !1,
			error: "no_write_relays"
		} : new ve(t, this.deps.console).sendEvent(n, {
			targetRelays: r,
			includeDefaultWriteRelays: !1
		});
	}
}();
export { nn as A, yn as C, rn as D, en as E, Yt as F, Vt as I, Mt as L, an as M, on as N, sn as O, Xt as P, kt as R, vn as S, dn as T, Bn as _, Rr as a, Dn as b, Cr as c, gr as d, pr as f, Jn as g, Yn as h, Wr as i, ln as j, cn as k, Tr as l, Vn as m, Kr as n, Lr as o, or as p, Vr as r, Ir as s, qr as t, _r as u, zn as v, gn as w, Sn as x, Fn as y, wt as z };
