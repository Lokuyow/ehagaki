import { At as e, B as t, G as n, J as r, M as i, Mt as a, R as o, Tt as s, U as c, W as l, _ as u, _t as d, a as f, bt as p, dt as m, f as h, ft as g, h as _, ht as v, jt as y, k as b, lt as x, o as S, ot as C, pt as w, r as T, rt as ee, s as te, st as E, t as ne, tt as D, ut as O, v as k, w as re, wt as ie } from "./index-client-57Odq85c.js";
import { d as A, f as j, l as ae, n as M } from "./relayConfigUtils-DD5f1UAM.js";
import { c as oe } from "./postHistoryEventUtils-CUIBkIiy.js";
import { ht as se, pt as ce, t as le } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { C as ue, E as de, S as fe, T as pe, i as me, k as he, o as ge, t as _e, w as ve } from "./nip65RelayDirectory-TQ_KxYYY.js";
import { c as ye, l as be, t as xe } from "./appUtils-CwuZyofa.js";
import { F as Se, H as Ce, I as we, L as Te, T as N, U as Ee, r as De, t as Oe } from "./sensitiveContentPayloadReader-dMbMHU25.js";
import { a as ke, i as Ae } from "./menu-trigger-gY51qJX1.js";
import { t as je } from "./DialogWrapper-CvCDxqOJ.js";
import { t as Me } from "./dialog-close-BfZcAfRJ.js";
import { i as Ne } from "./keyboardFocusUtils-Cil9djR5.js";
import { F as Pe, J as Fe, M as Ie, P, S as Le, X as Re, Y as ze, nt as Be, ut as Ve } from "./App-BWEIk7fu.js";
import { F as He, I as Ue, L as We, P as Ge, R as Ke, S as qe, T as Je, _ as Ye, a as Xe, b as Ze, d as Qe, f as $e, i as et, n as tt, o as nt, p as rt, r as it, t as at, u as ot, w as st, x as ct, y as lt, z as ut } from "./postBroadcastService-t1CJD5y7.js";
import { t as dt } from "./domSanitizer-B8U0JrXL.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useComposerTargetRelatedPreview.svelte.ts
var ft = 0;
function pt(e) {
	let t = `composer-target-related:${++ft}`, n = e.resolver ?? st({
		getShow: e.getShow,
		getRxNostr: e.getRxNostr,
		getRelayConfig: e.getRelayConfig,
		requireFullVerification: !0,
		loadRepostTarget: qe
	}), r = 0, i = d(!1), a = () => ee(() => {
		r++, v(i, !1), n.invalidateScope(t), e.resolver || n.reset();
	});
	function o(e, t = !1) {
		let a = r;
		v(i, !1), (t ? n.retryTarget(e) : n.ensureTarget(e)).catch(() => {
			r === a && v(i, !0);
		});
	}
	function s(e) {
		return fe(e.event.kind) ? ve(e.event) : ge(e.event);
	}
	function c(e) {
		let n = s(e).reference;
		return n ? {
			targetEventId: n.eventId,
			authorHint: n.authorHint,
			relayHints: M.sanitizeExternalRelayUrls([...n.relayHints, ...e.relayHints]),
			sourceEventId: e.event.id,
			relationKind: fe(e.event.kind) ? "repost" : "reaction",
			scopeKey: t
		} : null;
	}
	E(() => {
		let t = e.getShow(), n = e.getTarget();
		return e.getRxNostr(), e.getRelayConfig(), e.getPubkey(), ee(() => {
			if (a(), t && n && [
				6,
				7,
				16
			].includes(n.event.kind)) {
				let e = c(n);
				e && o(e);
			}
		}), a;
	}), ne(a);
	function l() {
		let r = e.getTarget();
		if (!e.getShow() || !r || ![
			6,
			7,
			16
		].includes(r.event.kind)) return null;
		n.getScopeRevision(t);
		let a = s(r), o = {
			event: null,
			profile: null,
			relayHints: []
		};
		if (D(i)) return {
			...o,
			status: "error"
		};
		if (!a.reference) return {
			...o,
			status: a.status
		};
		let c = n.getTargetSnapshot(a.reference.eventId);
		return c?.errorCode === "invalid_event" ? {
			...o,
			status: "invalid-target"
		} : fe(r.event.kind) ? de(r.event, c, P) : c?.event && !he(c.event, a.reference) ? {
			...o,
			status: "invalid-target"
		} : c?.event && !P.includes(c.event.kind) ? {
			...o,
			status: "unsupported-target-kind"
		} : {
			status: c?.status ?? "loading",
			event: c?.event ?? null,
			profile: c?.profile ?? null,
			relayHints: c?.relayHints ?? a.reference.relayHints
		};
	}
	function u() {
		let t = e.getTarget();
		if (!e.getShow() || !t || ![
			6,
			7,
			16
		].includes(t.event.kind)) return;
		let n = c(t);
		n && o(n, !0);
	}
	return {
		getPreview: l,
		retry: u
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/composerTargetResolver.ts
function F(e) {
	return e.cache?.resolutionQuality === "verified-root-only" || e.cache?.resolutionQuality === "verified-metadata";
}
var mt = /* @__PURE__ */ new Set([
	"missing-channel-root",
	"invalid-channel-root",
	"conflicting-channel-roots"
]);
function ht(e) {
	return e.some((e) => mt.has(e));
}
function gt(e, t) {
	return F(t.snapshot) ? t.snapshot : e;
}
function _t(e = {}) {
	let t = e.replyQuoteService ?? new Le(), n = e.channelCoordinator ?? N, r = e.verifyEventFn ?? ((e) => A(e) && j(e)), i = e.lookupAuthorWriteRelaysFn ? (t, n) => e.lookupAuthorWriteRelaysFn(t) : (e, t) => _e(t).lookup(e).then((e) => e.writeRelays);
	function a(e) {
		let a = !1, o = /* @__PURE__ */ new Set(), s = null, c, l = new Promise((e) => {
			c = e;
		});
		return {
			promise: (async () => {
				e.onPhase?.("event-loading");
				let c = t.fetchReferencedEventTask(e.pointer.eventId, e.pointer.relayHints, e.rxNostr, e.relayConfig);
				o.add(c);
				let u = null, d = !1, f = e.pointer.authorHint ? i(e.pointer.authorHint, e.rxNostr).then((n) => {
					if (a || d || n.length === 0) return null;
					let r = new Set(M.sanitizeExternalRelayUrls(e.pointer.relayHints)), i = M.sanitizeExternalRelayUrls(n).filter((e) => !r.has(e));
					return i.length === 0 ? null : (u = t.fetchReferencedEventTask(e.pointer.eventId, [], e.rxNostr, e.relayConfig, 5e3, i), o.add(u), u);
				}).catch(() => null) : Promise.resolve(null), p = await Promise.race([new Promise((t) => {
					let n = null, r = null, i = !e.pointer.authorHint, s = !1, l = (e, n) => {
						if (!s) {
							s = !0, d = !0;
							for (let e of o) e !== n && e.cancel();
							t({
								state: "result",
								result: e
							});
						}
					}, p = () => {
						if (!n || !i) return;
						if (r?.status === "found") {
							u && l(r, u);
							return;
						}
						if (n.status === "found") {
							l(n, c);
							return;
						}
						let e = n.status === "not-found" ? r ?? n : n;
						l(e, u && e === r ? u : c);
					};
					c.promise.then((e) => {
						a || (n = e, e.status === "found" ? l(e, c) : p());
					}).catch(() => {
						a || (n = { status: "error" }, p());
					}), f.then((e) => {
						a || s || (e ? e.promise.then((e) => {
							a || (r = e, i = !0, e.status === "found" && u ? l(e, u) : p());
						}).catch(() => {
							a || (r = { status: "error" }, i = !0, p());
						}) : (i = !0, p()));
					});
				}), l.then(() => ({ state: "cancelled" }))]);
				if (p.state === "cancelled") return { status: "cancelled" };
				let m = p.result;
				if (a || m.status === "cancelled") return { status: "cancelled" };
				if (m.status === "not-found") return {
					status: "error",
					reason: "not-found"
				};
				if (m.status === "timeout") return {
					status: "error",
					reason: "timeout"
				};
				if (m.status === "error") return {
					status: "error",
					reason: "network"
				};
				let h = m.event, g = m.relayUrl;
				if (!r(h)) return {
					status: "error",
					reason: "invalid-event"
				};
				if (h.id !== e.pointer.eventId || e.pointer.authorHint && h.pubkey !== e.pointer.authorHint || e.pointer.kindHint !== null && h.kind !== e.pointer.kindHint) return {
					status: "error",
					reason: "mismatch"
				};
				let _ = M.sanitizeExternalRelayUrls([...g ? [g] : [], ...e.pointer.relayHints], { limit: M.EXTERNAL_INPUT_RELAY_LIMIT }), v = e.profileService ? e.profileService.fetchProfileRealtime(h.pubkey, { additionalRelays: _ }).catch(() => null) : Promise.resolve(null), y = null, b = null, x = null, S = !1;
				if (h.kind === 40 || h.kind === 42) {
					let t = h.kind === 42 ? oe(h) : null, r = h.kind === 40 ? h.id : t?.channelEventId ?? null;
					if (!r || h.kind === 42 && t && ht(t.issues)) return {
						status: "error",
						reason: "channel-unavailable",
						event: h,
						relayHints: _,
						authorProfile: await v
					};
					e.onPhase?.("channel-loading"), s = n.resolveInternal({
						eventId: r,
						relayHints: M.sanitizeExternalRelayUrls([...t?.channelRelayHints ?? [], ..._])
					}, e.rxNostr, e.relayConfig);
					let i = await s.cacheReady, o = await s.refresh;
					if (a) return { status: "cancelled" };
					let c = gt(i, o);
					if (!F(c)) return {
						status: "error",
						reason: "channel-unavailable",
						event: h,
						relayHints: _,
						authorProfile: await v
					};
					y = c.context, S = c.cache?.resolutionQuality === "verified-metadata", x = c.cache?.creatorPubkey ?? null, b = {
						eventId: r,
						relayHints: [...c.cache?.relayHints ?? []]
					};
				}
				let C = null, w = null;
				if (e.profileService) {
					if (e.onPhase?.("profile-loading"), [C, w] = await Promise.all([v, x && x !== h.pubkey ? e.profileService.fetchProfileRealtime(x, { additionalRelays: b?.relayHints ?? [] }).catch(() => null) : Promise.resolve(null)]), a) return { status: "cancelled" };
					x === h.pubkey && (w = C);
				}
				return {
					status: "resolved",
					target: {
						event: h,
						relayHints: _,
						fetchedRelayUrl: g,
						authorProfile: C,
						channelContext: y,
						channelCreatorPubkey: x,
						channelCreatorProfile: w,
						channelQuery: b,
						channelPictureCacheEligible: S
					}
				};
			})().catch(() => a ? { status: "cancelled" } : {
				status: "error",
				reason: "network"
			}).finally(() => {
				s?.release(), s = null;
			}),
			cancel() {
				a = !0, c();
				for (let e of o) e.cancel();
				s?.release(), s = null;
			}
		};
	}
	return { resolve: a };
}
var vt = 2e3;
function yt(e) {
	if (e.length > 5e3) return {
		status: "invalid",
		reason: "too-long"
	};
	let t = e.trim();
	if (!t) return { status: "empty" };
	let n = t.startsWith("nostr:") ? t.slice(6) : t;
	if (!n) return {
		status: "invalid",
		reason: "invalid-format"
	};
	try {
		let e = ae.decode(n);
		if (e.type === "note") return {
			status: "supported",
			pointer: {
				format: "note",
				eventId: e.data,
				relayHints: [],
				authorHint: null,
				kindHint: null
			}
		};
		if (e.type === "nevent") {
			let t = e.data;
			return {
				status: "supported",
				pointer: {
					format: "nevent",
					eventId: t.id,
					relayHints: M.sanitizeExternalRelayUrls(t.relays, { limit: M.EXTERNAL_INPUT_RELAY_LIMIT }),
					authorHint: t.author ?? null,
					kindHint: typeof t.kind == "number" ? t.kind : null
				}
			};
		}
		return e.type === "npub" || e.type === "nprofile" || e.type === "naddr" ? {
			status: "unsupported",
			format: e.type
		} : e.type === "nsec" ? { status: "secret-key" } : {
			status: "invalid",
			reason: "invalid-format"
		};
	} catch {
		return {
			status: "invalid",
			reason: "invalid-format"
		};
	}
}
function bt(e, t) {
	return e === 1 || e === 7 || e === 1111 ? [
		"reply",
		"quote",
		"reaction"
	] : e === 40 ? t ? ["channel"] : [] : e === 42 ? t ? [
		"reply",
		"quote",
		"reaction"
	] : ["reaction"] : [6, 16].includes(e) ? ["reaction"] : [];
}
function xt(e, t) {
	let n = Array.from(e);
	return n.length <= t ? e : `${n.slice(0, t).join("")}…`;
}
function St(e, t = vt) {
	if (e.length <= t) return {
		content: e,
		exceedsRenderLimit: !1
	};
	let n = t, r = e.charCodeAt(n - 1);
	return r >= 55296 && r <= 56319 && --n, {
		content: e.slice(0, n),
		exceedsRenderLimit: !0
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/ComposerTargetDialog.svelte
var Ct = n("<div class=\"raw-json-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span>", 1), wt = n("<div class=\"broadcast-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span>", 1), Tt = n("<div class=\"trash-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span>", 1), Et = n("<!> <!>", 1), Dt = n("<!> <!> <!> <!>", 1), Ot = n("<div class=\"xmark-icon svg-icon svelte-19ui8fd\"></div>"), kt = n("<p class=\"svelte-19ui8fd\"> </p>"), At = n("<span class=\"channel-creator svelte-19ui8fd\"> </span>"), jt = n("<span class=\"channel-relays svelte-19ui8fd\"> </span>"), Mt = n("<div class=\"channel-preview svelte-19ui8fd\"><!> <div class=\"channel-text svelte-19ui8fd\"><strong class=\"channel-name svelte-19ui8fd\"> </strong> <!> <!> <!></div></div>"), Nt = n("<span class=\"interaction-author svelte-19ui8fd\"><!> <span class=\"interaction-author-name svelte-19ui8fd\"> </span></span>"), Pt = n("<div class=\"clear-input-icon svg-icon svelte-19ui8fd\" aria-hidden=\"true\"></div>"), Ft = n("<div aria-live=\"polite\"><!> <!></div>"), It = n("<p class=\"delete-failed svelte-19ui8fd\"> </p>"), Lt = n("<section class=\"composer-target-repost-preview svelte-19ui8fd\"><!> <!></section>"), Rt = n("<div class=\"related-channel-row svelte-19ui8fd\"><span> </span> <strong> </strong></div>"), zt = n("<p class=\"related-interaction-label svelte-19ui8fd\"> </p>"), Bt = n("<p role=\"status\" class=\"svelte-19ui8fd\"> </p> <!>", 1), Vt = n("<section class=\"composer-target-reaction-preview svelte-19ui8fd\"><div class=\"composer-target-reaction-label svelte-19ui8fd\"><div class=\"composer-target-reaction-title svelte-19ui8fd\"><!> <div class=\"composer-target-reaction-symbol favorite-icon svg-icon svelte-19ui8fd\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span></div></div> <!> <!> <!></section>"), Ht = n("<p class=\"interaction-label svelte-19ui8fd\"> </p>"), Ut = n("<span hidden=\"\" aria-hidden=\"true\" class=\"svelte-19ui8fd\"></span>"), Wt = n("<div class=\"post-icon svg-icon\" aria-hidden=\"true\"></div>"), Gt = n("<div class=\"composer-target-channel-action svelte-19ui8fd\"><!></div>"), Kt = n("<section class=\"target-preview svelte-19ui8fd\"><div><!> <div class=\"event-author svelte-19ui8fd\"><!> <span class=\"svelte-19ui8fd\"> </span> <span class=\"event-kind svelte-19ui8fd\"> </span></div> <!> <!> <!> <!></div> <!> <!></section>"), qt = n("<p class=\"unsupported-kind svelte-19ui8fd\"> </p>"), Jt = n("<div class=\"composer-target-content svelte-19ui8fd\"><h2 class=\"svelte-19ui8fd\"> </h2> <label class=\"target-input-label svelte-19ui8fd\" for=\"composer-target-input\"> </label> <div class=\"composer-target-input-shell svelte-19ui8fd\"><input id=\"composer-target-input\" type=\"text\" inputmode=\"text\" autocomplete=\"off\" spellcheck=\"false\" class=\"svelte-19ui8fd\"/> <!></div> <!>  <!> <!></div>"), Yt = n("<div class=\"delete-confirm-body svelte-19ui8fd\"><p class=\"delete-confirm-description svelte-19ui8fd\"> </p> <p class=\"delete-confirm-warning svelte-19ui8fd\"> </p></div>"), Xt = n("<div> </div>"), Zt = n("<!> <!> <!> <!> <!>", 1), Qt = {
	hash: "svelte-19ui8fd",
	code: ".xmark-icon.svelte-19ui8fd {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.composer-target-dialog {max-width:560px;}\n\n    @media (max-width: 600px) {.composer-target-dialog {top:0;translate:-50%\n                max(\n                    calc(\n                        var(--mobile-dialog-viewport-top) +\n                            env(safe-area-inset-top, 0px) + 12px\n                    ),\n                    calc(var(--mobile-dialog-center-y) - 50%)\n                );width:calc(100% - 24px);max-height:calc(\n                var(--mobile-dialog-viewport-height) -\n                    env(safe-area-inset-top, 0px) -\n                    env(safe-area-inset-bottom, 0px) -\n                    24px\n            );}.composer-target-dialog .dialog-content {min-height:0;max-height:none;flex:1 1 auto;overflow-y:auto;}.composer-target-dialog .dialog-footer {flex:0 0 auto;}\n    }.composer-target-content.svelte-19ui8fd {display:grid;gap:10px;width:100%;}h2.svelte-19ui8fd {margin:0;font-size:1.25rem;}.target-input-label.svelte-19ui8fd {font-weight:600;}.composer-target-input-shell.svelte-19ui8fd {position:relative;}input.svelte-19ui8fd {width:100%;min-height:50px;padding:8px 49px 8px 10px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text);font:inherit;outline:none;}input.svelte-19ui8fd:focus-visible {outline:2px solid var(--theme);outline-offset:-1px;}.ehagaki-app-root button.composer-target-clear-button {position:absolute;inset-block:50%;inset-inline-end:2px;transform:translateY(-50%);width:46px;height:46px;display:flex;align-items:center;justify-content:center;padding:0;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);z-index:1;}.ehagaki-app-root button.composer-target-clear-button:hover:not(:disabled),\n    .ehagaki-app-root button.composer-target-clear-button:active:not(:disabled),\n    .ehagaki-app-root button.composer-target-clear-button:focus-visible,\n    .ehagaki-app-root button.composer-target-clear-button:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.composer-target-clear-button:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.ehagaki-app-root button.composer-target-related-retry-button {height:auto;min-height:44px;padding:8px 12px;}.composer-target-clear-button .svg-icon {--svg: currentColor;width:24px;height:24px;}.clear-input-icon.svelte-19ui8fd {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.target-status.svelte-19ui8fd p:where(.svelte-19ui8fd),\n    .channel-preview.svelte-19ui8fd p:where(.svelte-19ui8fd),\n    .unsupported-kind.svelte-19ui8fd {margin:0;}.event-kind.svelte-19ui8fd,\n    .channel-creator.svelte-19ui8fd,\n    .channel-relays.svelte-19ui8fd {color:var(--text-muted);font-size:0.85rem;}.target-status.svelte-19ui8fd {display:grid;gap:8px;color:var(--text-muted);}.target-status.error.svelte-19ui8fd {color:var(--danger);}.composer-target-loading {justify-content:flex-start;padding:0;}.target-preview.svelte-19ui8fd {display:grid;min-width:0;border:1px solid var(--border-hr);background:var(--bg-input);}.composer-target-channel-action.svelte-19ui8fd {display:flex;width:100%;justify-content:center;}.target-preview .post-preview-footer {--post-history-preview-footer-surface: var(--bg-input);}.target-preview-body.svelte-19ui8fd {display:grid;min-width:0;gap:10px;padding:12px;}.composer-target-repost-preview.svelte-19ui8fd {min-width:0;}.interaction-label.svelte-19ui8fd {margin:0;font-weight:600;}.interaction-author.svelte-19ui8fd {display:inline-flex;align-items:center;gap:6px;min-width:0;color:var(--text);}.interaction-author-name.svelte-19ui8fd {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.interaction-author .composer-target-avatar {width:24px;height:24px;}.composer-target-repost-preview .post-history-repost-title > span {flex-shrink:0;white-space:nowrap;}.composer-target-repost-preview .post-history-repost-title > .interaction-author {flex-shrink:1;}.composer-target-reaction-preview.svelte-19ui8fd {min-width:0;}.composer-target-reaction-preview.svelte-19ui8fd p:where(.svelte-19ui8fd) {margin:0;}.composer-target-reaction-label.svelte-19ui8fd {display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--btn-post-preview-action);}.composer-target-reaction-title.svelte-19ui8fd {display:flex;align-items:center;gap:6px;min-width:0;padding-left:6px;}.composer-target-reaction-title.svelte-19ui8fd > span:where(.svelte-19ui8fd) {flex-shrink:0;white-space:nowrap;}.composer-target-reaction-title.svelte-19ui8fd > .interaction-author:where(.svelte-19ui8fd) {flex-shrink:1;}.composer-target-reaction-symbol.svelte-19ui8fd {flex-shrink:0;width:22px;height:22px;flex:0 0 22px;--svg: currentColor;mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.related-channel-row.svelte-19ui8fd {display:flex;flex-wrap:wrap;gap:6px;padding:4px 6px;overflow-wrap:anywhere;}.related-interaction-label.svelte-19ui8fd {padding:4px 6px;color:var(--text-muted);}.event-author.svelte-19ui8fd {display:flex;align-items:center;gap:8px;min-width:0;}.event-author.svelte-19ui8fd > span:where(.svelte-19ui8fd):first-of-type {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.event-kind.svelte-19ui8fd {margin-inline-start:auto;white-space:nowrap;}.composer-target-avatar {width:36px;height:36px;flex:0 0 auto;}.composer-target-avatar-image,\n    .composer-target-avatar-fallback {width:100%;height:100%;border-radius:50%;}.target-preview .event-content,\n    .channel-preview.svelte-19ui8fd p:where(.svelte-19ui8fd) {white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}.target-preview .event-content-collapsed {max-height:calc(5 * 1.45em);overflow:hidden;}.channel-preview.svelte-19ui8fd {display:flex;gap:10px;padding-top:10px;border-top:1px solid var(--border-hr);}.target-preview-body.channel-first.svelte-19ui8fd .channel-preview:where(.svelte-19ui8fd) {padding-top:0;border-top:0;}.target-preview-body.channel-first.svelte-19ui8fd .event-author:where(.svelte-19ui8fd) {padding-top:10px;border-top:1px solid var(--border-hr);}.channel-preview .channel-picture {width:48px;height:48px;flex:0 0 auto;object-fit:cover;}.channel-text.svelte-19ui8fd {display:grid;gap:4px;min-width:0;}.channel-name.svelte-19ui8fd {min-width:0;overflow-wrap:anywhere;}.channel-relays.svelte-19ui8fd {white-space:pre-wrap;overflow-wrap:anywhere;}.delete-failed.svelte-19ui8fd {margin:0;color:var(--danger);}.delete-confirm-body.svelte-19ui8fd {display:flex;flex-direction:column;justify-content:center;gap:0.5rem;margin:10px 0 30px;margin-inline:auto;text-align:start;}.delete-confirm-description.svelte-19ui8fd,\n    .delete-confirm-warning.svelte-19ui8fd {margin:0;line-height:1.5;}.delete-confirm-warning.svelte-19ui8fd {color:var(--text-light);font-size:0.875rem;}.target-preview .post-icon {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.post-history-menu-content .menu-action-button .raw-json-icon {mask-image:var(--ehagaki-icon-646174615f6f626a6563745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .broadcast-icon {mask-image:var(--ehagaki-icon-63656c6c5f746f7765725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .trash-icon {mask-image:var(--ehagaki-icon-64656c6574655f666f72657665725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}"
};
function $t(n, A) {
	s(A, !0), b(n, Qt);
	let j = () => te(ce, "$_", oe), M = () => te(se, "$locale", oe), [oe, de] = S(), fe = (e, n = a) => {
		var r = l(), s = O(r), u = (e) => {
			let r = p(() => j()("common.showActions"));
			{
				let a = (e) => {
					var r = Dt(), a = O(r), s = (e) => {
						ct(e, {
							get pending() {
								return ht();
							},
							onSelect: () => void rn(n())
						});
					}, u = p(() => mt() && ue(n().kind));
					o(a, (e) => {
						D(u) && e(s);
					});
					var d = g(a, 2);
					i(d, () => ke, (e, r) => {
						r(e, {
							class: "menu-action-button",
							onSelect: () => vr(n().rawEvent),
							children: (e, n) => {
								var r = Ct(), i = g(O(r), 2), a = m(i, !0);
								C((e) => t(a, e), [() => j()("postHistory.rawJson")]), c(e, r);
							},
							$$slots: { default: !0 }
						});
					});
					var f = g(d, 2), h = (e) => {
						var r = l(), a = O(r);
						{
							let e = p(() => D(_n) === "sending");
							i(a, () => ke, (r, i) => {
								i(r, {
									class: "menu-action-button",
									get disabled() {
										return D(e);
									},
									onpointerdown: (e) => yr(n(), e),
									onSelect: (e) => void Sr(n(), e),
									children: (e, n) => {
										var r = wt(), i = g(O(r), 2), a = m(i, !0);
										C((e) => t(a, e), [() => j()("postHistory.broadcast")]), c(e, r);
									},
									$$slots: { default: !0 }
								});
							});
						}
						c(e, r);
					};
					o(f, (e) => {
						D(Mn) && e(h);
					});
					var _ = g(f, 2), v = (e) => {
						var r = Et(), a = O(r);
						i(a, () => Ae, (e, t) => {
							t(e, { class: "post-history-menu-separator" });
						});
						var o = g(a, 2);
						{
							let e = p(() => D(U) === "sending");
							i(o, () => ke, (r, i) => {
								i(r, {
									class: "menu-action-button menu-action-button-danger",
									get disabled() {
										return D(e);
									},
									onSelect: () => Cr(n()),
									children: (e, n) => {
										var r = Tt(), i = g(O(r), 2), a = m(i, !0);
										C((e) => t(a, e), [() => D(U) === "sending" ? j()("postHistory.deleteSending") : j()("postHistory.delete")]), c(e, r);
									},
									$$slots: { default: !0 }
								});
							});
						}
						c(e, r);
					};
					o(_, (e) => {
						D(Nn) && e(v);
					}), c(e, r);
				}, s = p(() => H.isPostMenuOpen(n().eventId)), u = p(() => Ee(n().postedAt, M()));
				lt(e, {
					get open() {
						return D(s);
					},
					onOpenChange: (e) => _r(n().eventId, e),
					get triggerAriaLabel() {
						return D(r);
					},
					get tooltipContent() {
						return D(r);
					},
					enableTooltip: !0,
					get timestamp() {
						return D(u);
					},
					items: a,
					$$slots: { items: !0 }
				});
			}
		};
		o(s, (e) => {
			n().eventId === D(Y)?.eventId && e(u);
		}), c(e, r);
	}, he = (e, t = a) => {
		let n = p(() => Vn.getReadModel(t().eventId));
		var r = l(), i = O(r), s = (e) => {
			{
				let r = p(() => D(W) === t().eventId), i = p(() => D(W) === t().eventId ? j()("postHistory.hideReactions") : j()("postHistory.showReactionsWithCount", { values: { count: D(n).totalCount } }));
				Ye(e, {
					get count() {
						return D(n).totalCount;
					},
					get expanded() {
						return D(r);
					},
					get ariaLabel() {
						return D(i);
					},
					onToggle: () => v(W, D(W) === t().eventId ? null : t().eventId, !0)
				});
			}
		};
		o(i, (e) => {
			D(n) && D(n).totalCount > 0 && e(s);
		}), c(e, r);
	}, ge = (e, t = a) => {
		let n = p(() => Vn.getReadModel(t().eventId));
		var r = l(), i = O(r), s = (e) => {
			rt(e, {
				get readModel() {
					return D(n);
				},
				get emojiLoadStateByUrl() {
					return Q.emojiLoadStateByUrl;
				},
				get emojiImageMetaByUrl() {
					return Q.emojiImageMetaByUrl;
				}
			});
		};
		o(i, (e) => {
			D(n) && D(n).totalCount > 0 && D(W) === t().eventId && e(s);
		}), c(e, r);
	}, _e = (e) => {
		var t = l(), n = O(t), r = (e) => {
			var t = Et(), n = O(t);
			{
				let e = (e) => {
					{
						let t = (e) => {
							he(e, () => D(Y));
						}, n = p(() => D(G).includes("reply") ? () => $("reply") : void 0), r = p(() => D(G).includes("quote") ? () => {
							$("quote");
						} : void 0);
						Ue(e, {
							get post() {
								return D(Y);
							},
							onReactionPost: () => $("reaction"),
							get onReplyPost() {
								return D(n);
							},
							get onQuotePost() {
								return D(r);
							},
							reactionExtras: t,
							$$slots: { reactionExtras: !0 }
						});
					}
				}, t = (e) => {
					fe(e, () => D(Y));
				}, r = p(() => Ce(D(Y).postedAt));
				ut(n, {
					get formattedDate() {
						return D(r);
					},
					actions: e,
					trailing: t,
					$$slots: {
						actions: !0,
						trailing: !0
					}
				});
			}
			var r = g(n, 2);
			ge(r, () => D(Y)), c(e, t);
		};
		o(n, (e) => {
			D(Y) && e(r);
		}), c(e, t);
	}, ve = T(A, "inboundInteractionSave", 3, null), N = T(A, "rxNostr", 3, void 0), P = T(A, "relayConfig", 3, null), Le = T(A, "profileService", 3, void 0), qe = T(A, "resolver", 19, _t), ft = T(A, "relatedResolver", 3, void 0), F = T(A, "pubkeyHex", 3, null), mt = T(A, "onRepostPost", 3, void 0), ht = T(A, "repostPending", 3, !1), gt = T(A, "onRetryRepostSave", 3, void 0), vt = T(A, "repostSaveFailure", 3, null), $t;
	function en() {
		return $t ??= st({
			getShow: () => A.show,
			getRxNostr: () => N(),
			getRelayConfig: () => P()
		});
	}
	let tn = d(null), nn = 0;
	E(() => (A.show, F(), nn++, v(tn, null), () => $t?.invalidateScope("composer-repost"))), ne(() => $t?.reset());
	async function rn(e) {
		if (!mt() || ht()) return;
		v(tn, null);
		let t = nn, n = e.eventId, r = await mt()(e, (e, t) => en().prepareRepostTarget({
			relationKind: "repost",
			scopeKey: "composer-repost",
			targetEventId: e.id,
			authorHint: e.pubkey,
			relayHints: t
		}, e));
		A.show && t === nn && D(z)?.event.id === n && v(tn, r, !0);
	}
	let I = d(""), an = d(null), on = d(null), L = d("empty"), R = d(null), z = d(null), sn = d(null), cn = d(null), ln = d(0), B = 0, V, un = null, dn = d(w([])), fn = d(-1), pn = d(!1), mn = d(null), H = Xe(), hn = d(!1), gn = d(null), _n = d(void 0), U = d(void 0), vn = d(!1), yn = d(0), bn = d(0), xn = d("postHistory.broadcastSent"), Sn, Cn = d(void 0), W = d(null), G = p(() => D(z) ? bt(D(z).event.kind, [1, 1111].includes(D(z).event.kind) || !!D(z).channelQuery) : []), K = p(() => D(z)?.event ?? D(sn)), wn = pt({
		getShow: () => A.show,
		getTarget: () => D(z),
		getRxNostr: () => N(),
		getRelayConfig: () => P(),
		getPubkey: () => F(),
		resolver: ee(() => ft())
	}), q = p(() => wn.getPreview()), J = p(() => D(z) && [6, 16].includes(D(z).event.kind) ? D(q) : null), Tn = p(() => D(q)?.status === "resolved" && D(q).event?.kind === 42 ? [pe(D(q).event, D(q).relayHints)] : []), En = Ge({
		getShow: () => A.show,
		getPosts: () => D(Tn),
		getRxNostr: () => N(),
		getRelayConfig: () => P(),
		getIsSearchMode: () => !1
	}), Dn = p(() => D(Tn)[0] ? En.getChannelText(D(Tn)[0], j()) : null), On = p(() => D(q)?.event ? [
		6,
		7,
		16
	].includes(D(q).event.kind) ? Pe(D(q).event) : we({
		kind: D(q).event.kind,
		sourceContent: D(q).event.content,
		tags: D(q).event.tags
	}) : null);
	function kn(e) {
		return e === 6 ? "repost.entry" : e === 16 ? "composerTarget.genericRepost" : "composerTarget.reaction";
	}
	let An = p(() => D(q)?.status === "loading" ? "composerTarget.relatedLoading" : D(q)?.status === "deleted" ? "composerTarget.relatedDeleted" : D(q)?.status === "unsupported-reference" || D(q)?.status === "unsupported-target-kind" ? "composerTarget.relatedUnsupported" : D(q)?.status === "invalid-reference" || D(q)?.status === "invalid-target" || D(q)?.status === "outer-target-kind-mismatch" ? "composerTarget.relatedInvalid" : "composerTarget.relatedMissing"), jn = p(() => D(K) ? D(K).created_at * 1e3 : 0), Y = p(() => D(z) ? gr(D(z)) : null), Mn = p(() => D(Y) ? tt(D(Y)) !== null : !1), Nn = p(() => D(Y) ? it(D(Y), F()) : !1), X = p(() => D(z)?.authorProfile ?? D(cn)), Pn = p(() => {
		let e = D(K)?.pubkey;
		return e ? D(X)?.displayName?.trim() || D(X)?.name?.trim() || Fe(ae.npubEncode(e), 12, 4) : "";
	}), Fn = p(() => !D(K) || [
		6,
		7,
		16,
		40
	].includes(D(K).kind) ? "" : Te(D(K).content, D(K).tags)), In = p(() => St(D(Fn))), Ln = p(() => D(K) && D(Fn) ? [{
		eventId: D(K).id,
		content: D(In).content,
		forceCollapsible: D(In).exceedsRenderLimit
	}] : []), Rn = ot({
		getShow: () => A.show,
		getPosts: () => D(Ln),
		getContainer: () => D(on)
	}), zn = Je({
		getShow: () => A.show,
		getRxNostr: () => N()
	}), Bn = p(() => {
		let e = D(z) && me(D(z).event.kind) ? [{
			eventId: D(z).event.id,
			relayHints: [...D(z).relayHints],
			targetAuthorPubkey: D(z).event.pubkey,
			targetKind: D(z).event.kind
		}] : [];
		return D(q)?.status === "resolved" && D(q).event && me(D(q).event.kind) && e.push({
			eventId: D(q).event.id,
			relayHints: [...D(q).relayHints],
			targetAuthorPubkey: D(q).event.pubkey,
			targetKind: D(q).event.kind
		}), e;
	}), Vn = nt({
		getShow: () => A.show,
		getPubkeyHex: () => F(),
		getRxNostr: () => N(),
		getRelayConfig: () => P(),
		getTargets: () => D(Bn),
		profileSync: zn,
		source: "composer-target-display"
	}), Z = p(() => D(z) && me(D(z).event.kind) ? Vn.getReadModel(D(z).event.id) : null), Hn = p(() => !!D(z) && D(W) === D(z).event.id), Un = null;
	E(() => {
		let e = A.show && D(z) && me(D(z).event.kind) ? D(z).event.id : null;
		e !== Un && (Un = e, v(W, null), zn.reset());
	});
	function Wn() {
		D(z) && D(Z)?.totalCount && v(W, D(Hn) ? null : D(z).event.id, !0);
	}
	function Gn(e) {
		return D(Hn) ? j()("postHistory.hideReactions") : j()("postHistory.showReactionsWithCount", { values: { count: e } });
	}
	let Kn = Rn.previewRef, qn = p(() => D(Ln)[0]), Jn = p(() => D(qn) ? Rn.isPostExpanded(D(qn)) : !1), Yn = p(() => D(Jn) ? D(Fn) : D(In).content), Xn = p(() => D(K) && [
		6,
		7,
		16
	].includes(D(K).kind) ? Pe(D(K)) : D(K)?.kind === 40 ? we({
		sourceContent: "",
		displayContent: "",
		tags: [],
		kind: D(K)?.kind,
		media: []
	}) : we({
		sourceContent: D(Fn),
		kind: D(K)?.kind,
		tags: D(K)?.tags ?? []
	})), Zn = p(() => D(Yn) === D(Fn) ? D(Xn) : we({
		sourceContent: D(Fn),
		kind: D(K)?.kind,
		displayContent: D(Xn).hasRenderableText ? D(Yn) : "",
		tags: D(K)?.tags ?? [],
		media: D(Xn).media
	})), Qn = p(() => {
		let e = new Set(D(Zn).previewContent.emojiUrls);
		for (let t of D(On)?.previewContent.emojiUrls ?? []) e.add(t);
		if (D(W)) for (let t of Vn.getReadModel(D(W))?.groups ?? []) t.emojiUrl && e.add(t.emojiUrl);
		return [...e];
	}), $n = p(() => D(Xn).hasRenderableText), er = p(() => !!D(qn) && D($n) && Rn.shouldCollapsePost(D(qn))), tr = p(() => D(K) ? `composer-target-preview-content-${D(K).id}` : ""), nr = p(() => {
		let e = D(z)?.channelContext?.about;
		return e ? xt(dt(e), 200) : "";
	}), rr = p(() => {
		let e = D(z)?.channelContext;
		return e ? e.name?.trim() || `ID: ${Fe(e.eventId, 12, 8)}` : "";
	}), ir = p(() => {
		let e = D(z)?.channelCreatorPubkey;
		return e ? D(z)?.channelCreatorProfile?.displayName?.trim() || D(z)?.channelCreatorProfile?.name?.trim() || Fe(ae.npubEncode(e), 12, 4) : "";
	}), ar = p(fr), or = p(() => D(R) === "not-found" || D(R) === "timeout" || D(R) === "network" || D(R) === "channel-unavailable" || D(R) === "nostr-not-ready"), sr = p(() => D(L) === "debouncing" || D(L) === "event-loading" || D(L) === "channel-loading" || D(L) === "profile-loading"), Q = De({
		getShow: () => A.show && D(Qn).length > 0,
		getEmojiUrls: () => D(Qn),
		onStateChanged: () => Rn.remeasure()
	});
	function cr() {
		V !== void 0 && (clearTimeout(V), V = void 0), un?.cancel(), un = null;
	}
	function lr() {
		Sn !== void 0 && (clearTimeout(Sn), Sn = void 0), v(vn, !1), v(Cn, void 0);
	}
	function ur() {
		$t?.reset(), $t = void 0, nn++, v(tn, null), H.reset(), v(hn, !1), v(gn, null), v(_n, void 0), v(U, void 0), lr();
	}
	function dr() {
		B += 1, cr(), v(I, ""), v(L, "empty"), v(R, null), v(z, null), v(sn, null), v(cn, null), v(ln, 0), v(W, null), zn.reset(), ur(), Q.resetState(), v(dn, [], !0), v(fn, -1), v(pn, !1), v(mn, null);
	}
	function fr() {
		return D(L) === "parsing" ? j()("composerTarget.parsing") : D(L) === "debouncing" || D(L) === "event-loading" ? j()("composerTarget.checking") : D(L) === "channel-loading" ? j()("composerTarget.channelLoading") : D(L) === "profile-loading" ? j()("composerTarget.profileLoading") : D(R) ? D(R) === "unsupported" ? j()("composerTarget.unsupportedFormat") : D(R) === "secret-key" ? j()("composerTarget.secretKey") : D(R) === "invalid" ? j()("composerTarget.invalidFormat") : D(R) === "not-found" ? j()("composerTarget.notFound") : D(R) === "timeout" ? j()("composerTarget.timeout") : D(R) === "mismatch" ? j()("composerTarget.mismatch") : D(R) === "channel-unavailable" ? j()("composerTarget.channelUnavailable") : j()("composerTarget.fetchFailed") : "";
	}
	async function pr(e, t) {
		if (!N()) {
			B === t && (v(L, "error"), v(R, "nostr-not-ready"));
			return;
		}
		un = qe().resolve({
			pointer: e,
			rxNostr: N(),
			relayConfig: P(),
			profileService: Le(),
			onPhase: (e) => {
				B === t && v(L, e, !0);
			}
		});
		let n = await un.promise;
		B === t && n.status !== "cancelled" && (un = null, n.status === "resolved" ? (v(z, n.target, !0), v(sn, null), v(cn, null), v(L, "ready"), v(R, null)) : (v(sn, n.event ?? null, !0), v(cn, n.authorProfile ?? null, !0), v(L, "error"), v(R, n.reason, !0)));
	}
	function mr() {
		v(ln, D(ln) + 1);
	}
	async function $(e) {
		if (!D(z)) return !1;
		let t = D(z), n = B, r = await A.onApply(e, {
			source: "manual",
			kind: D(z).event.kind,
			eventId: D(z).event.id,
			relayHints: [...D(z).fetchedRelayUrl ? [D(z).fetchedRelayUrl] : [], ...D(z).relayHints],
			authorPubkey: D(z).event.pubkey,
			event: D(z).event,
			channelQuery: D(z).channelQuery,
			isCurrent: () => A.show && B === n && D(z) === t
		});
		return r && A.show && D(z) === t && B === n && Er(), r;
	}
	async function hr(e) {
		let t = B, n = D(z), r = await A.onApply("reaction", {
			...Ie(e),
			source: "manual",
			relayHints: [
				...e.fetchedRelays ?? [],
				...e.acceptedRelays,
				...e.relayHints
			],
			isCurrent: () => A.show && B === t && D(z) === n
		});
		return r && A.show && B === t && D(z) === n && Er(), r;
	}
	E(() => {
		let e = ve();
		A.show && e?.revision && Vn.refreshCachedReactions(e.parentEventIds).catch(() => void 0);
	});
	function gr(e) {
		let t = e.event, n = Date.now(), r = t.kind === 42 && e.channelContext?.channelRelays?.length ? [...e.channelContext.channelRelays] : void 0;
		return {
			id: t.id,
			eventId: t.id,
			pubkeyHex: t.pubkey,
			kind: t.kind,
			content: t.content,
			tags: t.tags.map((e) => [...e]),
			createdAt: t.created_at,
			postedAt: t.created_at * 1e3,
			relayHints: [...e.relayHints],
			acceptedRelays: [],
			...e.fetchedRelayUrl ? { fetchedRelays: [e.fetchedRelayUrl] } : {},
			media: [],
			rawEvent: t,
			...r ? { channelRelayHints: r } : {},
			updatedAt: n,
			schemaVersion: 1
		};
	}
	function _r(e, t) {
		t && H.closeAllPostItemMenus(), H.setPostMenuOpen(e, t);
	}
	function vr(e) {
		H.closeAllPostItemMenus(), v(gn, e, !0), v(hn, !0);
	}
	function yr(e, t) {
		v(Cn, {
			eventId: e.eventId,
			...xe(t.clientX, t.clientY)
		}, !0);
	}
	function br(e, t) {
		if (D(Cn)?.eventId === e.eventId) return {
			x: D(Cn).x,
			y: D(Cn).y
		};
		let n = t.currentTarget, r = n instanceof HTMLElement ? n.getBoundingClientRect() : null;
		return xe(r ? r.left + r.width / 2 : 0, r ? r.bottom + 8 : 0);
	}
	function xr(e, t) {
		lr(), v(yn, e.x, !0), v(bn, e.y, !0), v(xn, t.success ? "postHistory.broadcastSent" : "postHistory.broadcastFailed", !0), v(vn, !0), Sn = setTimeout(() => {
			v(vn, !1), Sn = void 0;
		}, 1800);
	}
	async function Sr(e, t) {
		if (D(_n) === "sending") return;
		let n = B, r = e.eventId, i = br(e, t);
		v(_n, "sending");
		let a = await at.broadcast({
			post: e,
			rxNostr: N()
		});
		B === n && D(z)?.event.id === r && (v(_n, void 0), xr(i, a));
	}
	function Cr(e) {
		it(e, F()) && H.openDeleteConfirm(e);
	}
	function wr() {
		H.cancelDeleteConfirm();
	}
	async function Tr() {
		let e = H.deleteTargetPost;
		if (!e || D(U) === "sending") return;
		let t = B, n = e.eventId;
		v(U, "sending");
		let r = await et.requestDeletion({
			post: e,
			rxNostr: N()
		});
		B === t && D(z)?.event.id === n && (H.setDeleteConfirmOpen(!1), r.success ? (v(U, void 0), Er()) : v(U, "failed"));
	}
	function Er() {
		dr(), A.onClose();
	}
	function Dr() {
		D(I).trim().length !== 0 && (v(I, ""), D(an)?.focus({ preventScroll: !0 }));
	}
	function Or(e) {
		e.preventDefault(), D(an)?.focus({ preventScroll: !0 });
	}
	function kr(e) {
		return e instanceof Element && e.closest(".ehagaki-pswp") !== null;
	}
	function Ar(e) {
		kr(e.target) && e.preventDefault();
	}
	function jr(e) {
		D(pn) && e.preventDefault();
	}
	function Mr(e) {
		v(dn, e.mediaList, !0), v(fn, e.index, !0), v(mn, e.focusOrigin, !0), v(pn, !0);
	}
	function Nr() {
		v(pn, !1), v(dn, [], !0), v(fn, -1), v(mn, null);
	}
	function Pr(e) {
		v(fn, e, !0);
	}
	E(() => {
		A.show || dr();
	}), E(() => {
		if (!A.show) return;
		let e = D(I);
		D(ln);
		let t = ++B;
		cr(), ur(), v(z, null), v(sn, null), v(cn, null), v(R, null), v(L, "parsing");
		let n = yt(e);
		if (n.status === "empty") {
			v(L, "empty");
			return;
		}
		if (n.status === "unsupported") {
			v(L, "error"), v(R, "unsupported");
			return;
		}
		if (n.status === "secret-key") {
			v(L, "error"), v(R, "secret-key");
			return;
		}
		if (n.status === "invalid") {
			v(L, "error"), v(R, "invalid");
			return;
		}
		let r = n.pointer;
		return v(L, "debouncing"), V = setTimeout(() => {
			V = void 0, pr(r, t);
		}, 250), () => {
			V !== void 0 && (clearTimeout(V), V = void 0);
		};
	}), ne(() => {
		B += 1, cr(), lr(), zn.dispose();
	});
	var Fr = Zt(), Ir = O(Fr);
	{
		let n = (e) => {
			var t = Et(), n = O(t);
			Ze(n, {
				get result() {
					return D(tn);
				},
				get saveFailure() {
					return vt();
				},
				get pending() {
					return ht();
				},
				get onRetrySave() {
					return gt();
				}
			});
			var r = g(n, 2);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = p(() => j()("global.close"));
						ye(e, f(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return D(t);
							},
							children: (e, t) => {
								var n = Ot();
								C((e) => k(n, "aria-label", e), [() => j()("global.close")]), c(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				i(r, () => Me, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			c(e, t);
		}, a = p(() => j()("composerTarget.title")), s = p(() => j()("composerTarget.description"));
		je(Ir, {
			get open() {
				return A.show;
			},
			onOpenChange: (e) => !e && Er(),
			get title() {
				return D(a);
			},
			get description() {
				return D(s);
			},
			contentClass: "composer-target-dialog",
			footerVariant: "close-button",
			onOpenAutoFocus: Or,
			onInteractOutside: Ar,
			onEscapeKeydown: jr,
			footer: n,
			children: (n, i) => {
				var a = Jt();
				{
					let n = (e) => {
						var n = Mt(), r = x(n), i = (e) => {
							Re(e, {
								get eventId() {
									return D(z).channelContext.eventId;
								},
								get pictureUrl() {
									return D(z).channelContext.picture;
								},
								get cacheEligible() {
									return D(z).channelPictureCacheEligible;
								},
								alt: "",
								className: "channel-picture"
							});
						};
						o(r, (e) => {
							D(z)?.channelContext?.picture && e(i);
						});
						var a = g(r, 2), s = x(a), l = m(s, !0), u = g(s, 2), d = (e) => {
							var n = kt(), r = m(n, !0);
							C(() => t(r, D(nr))), c(e, n);
						};
						o(u, (e) => {
							D(nr) && e(d);
						});
						var f = g(u, 2), p = (e) => {
							var n = At(), r = m(n);
							C((e) => t(r, `${e ?? ""}: ${D(ir) ?? ""}`), [() => j()("composerTarget.creator")]), c(e, n);
						};
						o(f, (e) => {
							D(ir) && e(p);
						});
						var h = g(f, 2), _ = (e) => {
							var n = jt(), r = m(n, !0);
							C((e) => t(r, e), [() => D(z).channelContext.channelRelays.join("\n")]), c(e, n);
						};
						o(h, (e) => {
							D(z)?.channelContext?.channelRelays?.length && e(_);
						}), y(a), y(n), C(() => t(l, D(rr))), c(e, n);
					}, i = (e) => {
						var n = Nt(), r = x(n);
						{
							let e = p(() => D(K)?.pubkey ?? ""), t = p(() => D(X)?.displayName), n = p(() => D(X)?.name), i = p(() => D(X)?.picture ?? "");
							Be(r, {
								get pubkeyHex() {
									return D(e);
								},
								get displayName() {
									return D(t);
								},
								get name() {
									return D(n);
								},
								get src() {
									return D(i);
								},
								alt: "",
								rootClassName: "composer-target-avatar",
								imageClassName: "composer-target-avatar-image",
								fallbackClassName: "composer-target-avatar-fallback",
								fallbackAriaLabel: ""
							});
						}
						var i = g(r, 2), a = m(i, !0);
						y(n), C(() => t(a, D(Pn))), c(e, n);
					};
					var s = x(a), d = m(s, !0), f = g(s, 2), b = m(f, !0), S = g(f, 2), w = x(S);
					u(w), h(w, (e) => v(an, e), () => D(an));
					var T = g(w, 2), ee = (e) => {
						{
							let t = p(() => j()("composerTarget.clearInput"));
							ye(e, {
								type: "button",
								className: "composer-target-clear-button",
								variant: "default",
								shape: "square",
								contentLayout: "icon",
								get ariaLabel() {
									return D(t);
								},
								onClick: Dr,
								get onmousedown() {
									return Ne;
								},
								get ontouchstart() {
									return Ne;
								},
								children: (e, t) => {
									var n = Pt();
									c(e, n);
								},
								$$slots: { default: !0 }
							});
						}
					}, te = p(() => D(I).trim().length > 0);
					o(T, (e) => {
						D(te) && e(ee);
					}), y(S);
					var E = g(S, 2), ne = (n) => {
						var i = Ft();
						let a;
						var s = x(i), l = (e) => {
							le(e, {
								showLoader: !0,
								get text() {
									return D(ar);
								},
								customClass: "composer-target-loading"
							});
						}, u = (e) => {
							var n = kt(), r = m(n, !0);
							C(() => t(r, D(ar))), c(e, n);
						};
						o(s, (e) => {
							D(sr) ? e(l) : e(u, -1);
						});
						var d = g(s, 2), f = (n) => {
							ye(n, {
								onClick: mr,
								children: (n, i) => {
									e();
									var a = r();
									C((e) => t(a, e), [() => j()("postHistory.contextRetry")]), c(n, a);
								},
								$$slots: { default: !0 }
							});
						};
						o(d, (e) => {
							D(or) && e(f);
						}), y(i), C(() => a = re(i, 1, "target-status svelte-19ui8fd", null, a, { error: D(L) === "error" })), c(n, i);
					};
					o(E, (e) => {
						D(ar) && e(ne);
					});
					var ie = g(E, 2), A = (e) => {
						var n = Lt(), r = x(n);
						{
							let e = p(() => D(On) ?? void 0), t = p(() => D(J).event && [
								6,
								7,
								16
							].includes(D(J).event.kind) ? j()(kn(D(J).event.kind)) : null), n = p(() => D(J).event ? Oe({
								ownerPubkey: F(),
								structure: D(J).event,
								relayHints: D(J).relayHints,
								rxNostr: N(),
								relayConfig: P()
							}) : void 0);
							He(r, {
								get post() {
									return D(Y);
								},
								onReactionPost: (e) => e.eventId === D(Y)?.eventId ? $("reaction") : hr(e),
								get reactionExtras() {
									return he;
								},
								get reactionDetails() {
									return ge;
								},
								get preview() {
									return D(J);
								},
								get author() {
									return i;
								},
								get footerMenu() {
									return fe;
								},
								get channelText() {
									return D(Dn);
								},
								get model() {
									return D(e);
								},
								get targetLabel() {
									return D(t);
								},
								get onRetry() {
									return wn.retry;
								},
								onImageOpen: (e) => Mr({
									...e,
									focusOrigin: document.activeElement instanceof HTMLElement ? document.activeElement : null
								}),
								get emojiLoadStateByUrl() {
									return Q.emojiLoadStateByUrl;
								},
								get emojiImageMetaByUrl() {
									return Q.emojiImageMetaByUrl;
								},
								get loadSensitiveBody() {
									return D(n);
								}
							});
						}
						var a = g(r, 2), s = (e) => {
							var n = It(), r = m(n, !0);
							C((e) => t(r, e), [() => j()("postHistory.deleteFailed")]), c(e, n);
						};
						o(a, (e) => {
							D(U) === "failed" && e(s);
						}), y(n), C((e) => k(n, "aria-label", e), [() => j()("composerTarget.preview")]), c(e, n);
					}, ae = (n) => {
						var a = Vt(), s = x(a), u = x(s), d = x(u);
						i(d);
						var f = g(d, 4), h = m(f, !0);
						y(u), y(s);
						var _ = g(s, 2), v = (e) => {
							let n = p(() => D(q).event);
							{
								let r = (e) => {
									var r = l(), i = O(r), a = (e) => {
										var n = Rt(), r = x(n), i = m(r, !0), a = g(r, 2), o = m(a, !0);
										y(n), C((e) => {
											t(i, e), t(o, D(Dn));
										}, [() => j()("postHistory.channel")]), c(e, n);
									}, s = (e) => {
										var r = zt(), i = m(r, !0);
										C((e) => t(i, e), [() => j()(kn(D(n).kind))]), c(e, r);
									}, u = p(() => [
										6,
										7,
										16
									].includes(D(n).kind));
									o(i, (e) => {
										D(Dn) ? e(a) : D(u) && e(s, 1);
									}), c(e, r);
								}, i = (e) => {
									{
										let t = (e) => {
											{
												let t = p(() => pe(D(n), D(q).relayHints));
												he(e, () => D(t));
											}
										}, r = p(() => pe(D(n), D(q).relayHints));
										Ue(e, {
											get post() {
												return D(r);
											},
											onReactionPost: hr,
											reactionExtras: t,
											$$slots: { reactionExtras: !0 }
										});
									}
								}, a = (e) => {
									{
										let t = p(() => pe(D(n), D(q).relayHints));
										ge(e, () => D(t));
									}
								}, s = p(() => Oe({
									ownerPubkey: F(),
									structure: D(n),
									relayHints: D(q).relayHints,
									rxNostr: N(),
									relayConfig: P()
								}));
								Ke(e, {
									get event() {
										return D(n);
									},
									get profile() {
										return D(q).profile;
									},
									get model() {
										return D(On);
									},
									onImageOpen: (e) => Mr({
										...e,
										focusOrigin: document.activeElement instanceof HTMLElement ? document.activeElement : null
									}),
									get emojiLoadStateByUrl() {
										return Q.emojiLoadStateByUrl;
									},
									get emojiImageMetaByUrl() {
										return Q.emojiImageMetaByUrl;
									},
									get loadSensitiveBody() {
										return D(s);
									},
									topActions: r,
									footerActions: i,
									footerDetails: a,
									$$slots: {
										topActions: !0,
										footerActions: !0,
										footerDetails: !0
									}
								});
							}
						}, b = (n) => {
							var i = Bt(), a = O(i), s = m(a, !0), l = g(a, 2), u = (n) => {
								ye(n, {
									className: "composer-target-related-retry-button",
									get onClick() {
										return wn.retry;
									},
									children: (n, i) => {
										e();
										var a = r();
										C((e) => t(a, e), [() => j()("postHistory.contextRetry")]), c(n, a);
									},
									$$slots: { default: !0 }
								});
							}, d = p(() => [
								"not-found",
								"error",
								"invalid-target"
							].includes(D(q).status));
							o(l, (e) => {
								D(d) && e(u);
							}), C((e) => t(s, e), [() => j()(D(An))]), c(n, i);
						};
						o(_, (e) => {
							D(q).status === "resolved" && D(q).event && D(On) ? e(v) : e(b, -1);
						});
						var S = g(_, 2), w = (e) => {
							var n = It(), r = m(n, !0);
							C((e) => t(r, e), [() => j()("postHistory.deleteFailed")]), c(e, n);
						};
						o(S, (e) => {
							D(U) === "failed" && e(w);
						});
						var T = g(S, 2);
						_e(T), y(a), C((e, n) => {
							k(a, "aria-label", e), k(a, "data-reaction-event-id", D(z).event.id), t(h, n);
						}, [() => j()("composerTarget.preview"), () => j()("composerTarget.reaction")]), c(n, a);
					}, M = (e) => {
						var r = Kt(), i = x(r);
						let a;
						var s = x(i), u = (e) => {
							n(e);
						};
						o(s, (e) => {
							D(K).kind === 42 && D(z)?.channelContext && e(u);
						});
						var d = g(s, 2), f = x(d);
						{
							let e = p(() => D(K)?.pubkey ?? ""), t = p(() => D(X)?.displayName), n = p(() => D(X)?.name), r = p(() => D(X)?.picture ?? "");
							Be(f, {
								get pubkeyHex() {
									return D(e);
								},
								get displayName() {
									return D(t);
								},
								get name() {
									return D(n);
								},
								get src() {
									return D(r);
								},
								alt: "",
								rootClassName: "composer-target-avatar",
								imageClassName: "composer-target-avatar-image",
								fallbackClassName: "composer-target-avatar-fallback",
								fallbackAriaLabel: ""
							});
						}
						var _ = g(f, 2), b = m(_, !0), S = g(_, 2), w = m(S);
						y(d);
						var T = g(d, 2), ee = (e) => {
							var n = Ht(), r = m(n, !0);
							C((e) => t(r, e), [() => j()(kn(D(K).kind))]), c(e, n);
						}, te = p(() => [
							6,
							7,
							16
						].includes(D(K).kind));
						o(T, (e) => {
							D(te) && e(ee);
						});
						var E = g(T, 2);
						{
							let e = (e) => {
								var t = l(), n = O(t), r = (e) => {
									var t = Et(), n = O(t), r = (e) => {
										var t = Ut();
										C(() => k(t, "id", D(tr))), c(e, t);
									};
									o(n, (e) => {
										D(Zn).hasRenderableText || e(r);
									});
									var i = g(n, 2);
									Qe(i, {
										get expanded() {
											return D(Jn);
										},
										get controls() {
											return D(tr);
										},
										onToggle: () => Rn.togglePostExpanded(D(qn).eventId)
									}), c(e, t);
								};
								o(n, (e) => {
									D(qn) && D(er) && e(r);
								}), c(e, t);
							}, t = p(() => Oe({
								ownerPubkey: F(),
								structure: D(K),
								relayHints: D(z)?.relayHints,
								rxNostr: N(),
								relayConfig: P()
							})), n = p(() => D(Zn).hasRenderableText && !D(Jn) && D(er));
							Se(E, {
								get model() {
									return D(Zn);
								},
								get loadSensitiveBody() {
									return D(t);
								},
								get contentWarningEventId() {
									return D(K).id;
								},
								density: "dialog",
								get emojiLoadStateByUrl() {
									return Q.emojiLoadStateByUrl;
								},
								get emojiImageMetaByUrl() {
									return Q.emojiImageMetaByUrl;
								},
								get previewContentId() {
									return D(tr);
								},
								contentClass: "event-content",
								collapsedContentClass: "event-content-collapsed",
								get renderWhenEmpty() {
									return D(er);
								},
								get isTextCollapsed() {
									return D(n);
								},
								get previewCollapseAction() {
									return Kn;
								},
								get previewCollapseEventId() {
									return D(K).id;
								},
								onImageOpen: Mr,
								betweenContentAndMedia: e,
								$$slots: { betweenContentAndMedia: !0 }
							});
						}
						var ne = g(E, 2), ie = (e) => {
							n(e);
						};
						o(ne, (e) => {
							D(K).kind !== 42 && D(z)?.channelContext && e(ie);
						});
						var A = g(ne, 2), ae = (e) => {
							var n = It(), r = m(n, !0);
							C((e) => t(r, e), [() => j()("postHistory.deleteFailed")]), c(e, n);
						};
						o(A, (e) => {
							D(U) === "failed" && D(z) && e(ae);
						}), y(i);
						var M = g(i, 2);
						{
							let e = (e) => {
								var t = l(), n = O(t), r = (e) => {
									var t = l(), n = O(t), r = (e) => {
										var t = l(), n = O(t), r = (e) => {
											{
												let t = (e) => {
													var t = l(), n = O(t), r = (e) => {
														{
															let t = p(() => Gn(D(Z).totalCount));
															Ye(e, {
																get count() {
																	return D(Z).totalCount;
																},
																get expanded() {
																	return D(Hn);
																},
																get ariaLabel() {
																	return D(t);
																},
																onToggle: Wn
															});
														}
													};
													o(n, (e) => {
														D(Z) && D(Z).totalCount > 0 && e(r);
													}), c(e, t);
												}, n = p(() => D(G).includes("reply") ? () => $("reply") : void 0), r = p(() => D(G).includes("quote") ? () => $("quote") : void 0);
												Ue(e, {
													onReactionPost: () => $("reaction"),
													get post() {
														return D(Y);
													},
													get onReplyPost() {
														return D(n);
													},
													get onQuotePost() {
														return D(r);
													},
													reactionExtras: t,
													$$slots: { reactionExtras: !0 }
												});
											}
										};
										o(n, (e) => {
											D(Y) && e(r);
										}), c(e, t);
									}, i = p(() => D(G).includes("reply") || D(G).includes("quote")), a = (e) => {
										Ue(e, {
											get post() {
												return D(Y);
											},
											onReactionPost: () => $("reaction"),
											reactionExtras: (e) => {
												he(e, () => D(Y));
											},
											$$slots: { reactionExtras: !0 }
										});
									}, s = p(() => D(G).includes("reaction") && D(Y)), u = (e) => {
										var t = Gt(), n = x(t);
										{
											let e = p(() => j()("composerTarget.post")), t = p(() => j()("composerTarget.post"));
											We(n, {
												type: "button",
												className: "post-preview-action-button post-history-action-button",
												get ariaLabel() {
													return D(e);
												},
												contentLayout: "icon",
												shape: "circle",
												onClick: () => $("channel"),
												get tooltipContent() {
													return D(t);
												},
												children: (e, t) => {
													var n = Wt();
													c(e, n);
												},
												$$slots: { default: !0 }
											});
										}
										y(t), c(e, t);
									}, d = p(() => D(G).includes("channel"));
									o(n, (e) => {
										D(i) ? e(r) : D(s) ? e(a, 1) : D(d) && e(u, 2);
									}), c(e, t);
								};
								o(n, (e) => {
									D(z) && e(r);
								}), c(e, t);
							}, t = (e) => {
								var t = l(), n = O(t), r = (e) => {
									fe(e, () => D(Y));
								};
								o(n, (e) => {
									D(Y) && e(r);
								}), c(e, t);
							}, n = p(() => Ce(D(jn)));
							ut(M, {
								get formattedDate() {
									return D(n);
								},
								actions: e,
								trailing: t,
								$$slots: {
									actions: !0,
									trailing: !0
								}
							});
						}
						var oe = g(M, 2), se = (e) => {
							rt(e, {
								get readModel() {
									return D(Z);
								},
								get emojiLoadStateByUrl() {
									return Q.emojiLoadStateByUrl;
								},
								get emojiImageMetaByUrl() {
									return Q.emojiImageMetaByUrl;
								}
							});
						};
						o(oe, (e) => {
							D(Z) && D(Z).totalCount > 0 && D(Hn) && e(se);
						}), y(r), h(r, (e) => v(on, e), () => D(on)), C((e) => {
							k(r, "aria-label", e), a = re(i, 1, "target-preview-body svelte-19ui8fd", null, a, { "channel-first": D(K).kind === 42 && !!D(z)?.channelContext }), t(b, D(Pn)), t(w, `kind ${D(K).kind ?? ""}`);
						}, [() => j()("composerTarget.preview")]), c(e, r);
					};
					o(ie, (e) => {
						D(J) && D(Y) ? e(A) : D(q) && D(z)?.event.kind === 7 && D(Y) ? e(ae, 1) : D(K) && e(M, 2);
					});
					var oe = g(ie, 2), se = (e) => {
						var n = qt(), r = m(n, !0);
						C((e) => t(r, e), [() => j()("composerTarget.unsupportedKind")]), c(e, n);
					};
					o(oe, (e) => {
						D(z) && D(G).length === 0 && !D(q) && e(se);
					}), y(a), C((e, n, r) => {
						t(d, e), t(b, n), k(w, "placeholder", r);
					}, [
						() => j()("composerTarget.title"),
						() => j()("composerTarget.inputLabel"),
						() => j()("composerTarget.placeholder")
					]), _(w, () => D(I), (e) => v(I, e));
				}
				c(n, a);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var Lr = g(Ir, 2);
	$e(Lr, {
		get open() {
			return D(hn);
		},
		get rawEvent() {
			return D(gn);
		},
		onOpenChange: (e) => v(hn, e, !0)
	});
	var Rr = g(Lr, 2);
	{
		let e = (e) => {
			var n = Yt(), r = x(n), i = m(r, !0), a = g(r, 2), o = m(a, !0);
			y(n), C((e, n) => {
				t(i, e), t(o, n);
			}, [() => j()("postHistory.deleteRequestDescription"), () => j()("postHistory.deleteRequestWarning")]), c(e, n);
		}, n = p(() => j()("postHistory.deleteRequestTitle")), r = p(() => j()("postHistory.deleteRequestDescription")), i = p(() => D(U) === "sending" ? j()("postHistory.deleteSending") : j()("postHistory.deleteConfirm")), a = p(() => j()("postHistory.deleteCancel")), o = p(() => D(U) === "sending");
		Ve(Rr, {
			get open() {
				return H.deleteConfirmOpen;
			},
			get onOpenChange() {
				return H.setDeleteConfirmOpen;
			},
			get title() {
				return D(n);
			},
			get description() {
				return D(r);
			},
			get confirmLabel() {
				return D(i);
			},
			get cancelLabel() {
				return D(a);
			},
			confirmVariant: "danger",
			get confirmDisabled() {
				return D(o);
			},
			onConfirm: Tr,
			onCancel: wr,
			contentClass: "post-history-delete-confirm",
			children: e,
			$$slots: { default: !0 }
		});
	}
	var zr = g(Rr, 2);
	{
		let e = p(() => D(dn)[D(fn)]?.src ?? ""), t = p(() => D(dn)[D(fn)]?.alt ?? "");
		ze(zr, {
			get src() {
				return D(e);
			},
			get alt() {
				return D(t);
			},
			onClose: Nr,
			get mediaList() {
				return D(dn);
			},
			get currentIndex() {
				return D(fn);
			},
			onNavigate: Pr,
			get openingFocusOrigin() {
				return D(mn);
			},
			get show() {
				return D(pn);
			},
			set show(e) {
				v(pn, e, !0);
			}
		});
	}
	var Br = g(zr, 2);
	be(Br, {
		get show() {
			return D(vn);
		},
		get x() {
			return D(yn);
		},
		get y() {
			return D(bn);
		},
		children: (e, n) => {
			var r = Xt(), i = m(r, !0);
			C((e) => t(i, e), [() => j()(D(xn))]), c(e, r);
		},
		$$slots: { default: !0 }
	}), c(n, Fr), ie(), de();
}
export { $t as default };
