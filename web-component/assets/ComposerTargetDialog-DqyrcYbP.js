import { At as e, B as t, Ct as n, G as r, M as i, R as a, U as o, W as s, _ as c, a as l, at as u, ct as d, dt as f, et as p, f as m, ft as h, gt as g, h as _, jt as v, k as y, kt as b, lt as x, mt as S, nt as C, o as w, ot as T, q as ee, r as E, s as te, t as ne, ut as D, v as O, w as re, wt as ie, yt as k } from "./index-client-Bdka-Daw.js";
import { d as A, f as j, l as ae, n as M } from "./relayConfigUtils-DD5f1UAM.js";
import { c as oe } from "./postHistoryEventUtils-CUIBkIiy.js";
import { ht as se, pt as ce, t as le } from "./LoadingPlaceholder-j1_vRYno.js";
import { c as ue, l as de, t as fe } from "./appUtils-C7IXsQBk.js";
import { A as pe, D as me, E as he, N as ge, O as _e, i as ve, k as ye, o as be, t as xe } from "./nip65RelayDirectory-BTlaIUmx.js";
import { F as Se, H as Ce, I as we, L as Te, T as N, U as Ee, r as De, t as Oe } from "./sensitiveContentPayloadReader-C2SL7kJU.js";
import { a as ke, i as Ae } from "./menu-trigger-DMUMT31S.js";
import { t as je } from "./DialogWrapper-B6dIEHnd.js";
import { t as Me } from "./dialog-close-BqMvQbkH.js";
import { i as Ne } from "./keyboardFocusUtils-Cil9djR5.js";
import { F as Pe, J as Fe, M as Ie, P, S as Le, X as Re, Y as ze, nt as Be, ut as Ve } from "./App-CxNETzG6.js";
import { F as He, I as Ue, L as We, P as Ge, R as Ke, S as qe, T as Je, _ as Ye, a as Xe, b as Ze, d as Qe, f as $e, i as et, n as tt, o as nt, p as rt, r as it, t as at, u as ot, w as st, x as ct, y as lt, z as ut } from "./postBroadcastService-BSRLV_qg.js";
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
	}), r = 0, i = g(!1), a = () => C(() => {
		r++, S(i, !1), n.invalidateScope(t), e.resolver || n.reset();
	});
	function o(e, t = !1) {
		let a = r;
		S(i, !1), (t ? n.retryTarget(e) : n.ensureTarget(e)).catch(() => {
			r === a && S(i, !0);
		});
	}
	function s(e) {
		return he(e.event.kind) ? _e(e.event) : be(e.event);
	}
	function c(e) {
		let n = s(e).reference;
		return n ? {
			targetEventId: n.eventId,
			authorHint: n.authorHint,
			relayHints: M.sanitizeExternalRelayUrls([...n.relayHints, ...e.relayHints]),
			sourceEventId: e.event.id,
			relationKind: he(e.event.kind) ? "repost" : "reaction",
			scopeKey: t
		} : null;
	}
	T(() => {
		let t = e.getShow(), n = e.getTarget();
		return e.getRxNostr(), e.getRelayConfig(), e.getPubkey(), C(() => {
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
		if (p(i)) return {
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
		} : he(r.event.kind) ? pe(r.event, c, P) : c?.event && !ge(c.event, a.reference) ? {
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
	let t = e.replyQuoteService ?? new Le(), n = e.channelCoordinator ?? N, r = e.verifyEventFn ?? ((e) => A(e) && j(e)), i = e.lookupAuthorWriteRelaysFn ? (t, n) => e.lookupAuthorWriteRelaysFn(t) : (e, t) => xe(t).lookup(e).then((e) => e.writeRelays);
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
	return e === 1 || e === 1111 ? [
		"reply",
		"quote",
		"reaction"
	] : e === 40 ? t ? ["channel"] : [] : e === 42 ? t ? [
		"reply",
		"quote",
		"reaction"
	] : ["reaction"] : [
		6,
		7,
		16
	].includes(e) ? ["reaction"] : [];
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
var Ct = r("<div class=\"raw-json-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span>", 1), wt = r("<div class=\"broadcast-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span>", 1), Tt = r("<div class=\"trash-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span>", 1), Et = r("<!> <!>", 1), Dt = r("<!> <!> <!> <!>", 1), Ot = r("<div class=\"xmark-icon svg-icon svelte-19ui8fd\"></div>"), kt = r("<p class=\"svelte-19ui8fd\"> </p>"), At = r("<span class=\"channel-creator svelte-19ui8fd\"> </span>"), jt = r("<span class=\"channel-relays svelte-19ui8fd\"> </span>"), Mt = r("<div class=\"channel-preview svelte-19ui8fd\"><!> <div class=\"channel-text svelte-19ui8fd\"><strong class=\"channel-name svelte-19ui8fd\"> </strong> <!> <!> <!></div></div>"), Nt = r("<span class=\"interaction-author svelte-19ui8fd\"><!> <span class=\"interaction-author-name svelte-19ui8fd\"> </span></span>"), Pt = r("<div class=\"clear-input-icon svg-icon svelte-19ui8fd\" aria-hidden=\"true\"></div>"), Ft = r("<div aria-live=\"polite\"><!> <!></div>"), It = r("<p class=\"delete-failed svelte-19ui8fd\"> </p>"), Lt = r("<section class=\"composer-target-repost-preview svelte-19ui8fd\"><!> <!></section>"), Rt = r("<div class=\"related-channel-row svelte-19ui8fd\"><span> </span> <strong> </strong></div>"), zt = r("<p class=\"related-interaction-label svelte-19ui8fd\"> </p>"), Bt = r("<p role=\"status\" class=\"svelte-19ui8fd\"> </p> <!>", 1), Vt = r("<section class=\"composer-target-reaction-preview svelte-19ui8fd\"><div class=\"composer-target-reaction-label svelte-19ui8fd\"><div class=\"composer-target-reaction-title svelte-19ui8fd\"><!> <div class=\"composer-target-reaction-symbol favorite-icon svg-icon svelte-19ui8fd\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span></div> <!></div> <!> <!></section> <!>", 1), Ht = r("<p class=\"interaction-label svelte-19ui8fd\"> </p>"), Ut = r("<span hidden=\"\" aria-hidden=\"true\" class=\"svelte-19ui8fd\"></span>"), Wt = r("<div class=\"post-icon svg-icon\" aria-hidden=\"true\"></div>"), Gt = r("<div class=\"composer-target-channel-action svelte-19ui8fd\"><!></div>"), Kt = r("<section class=\"target-preview svelte-19ui8fd\"><div><!> <div class=\"event-author svelte-19ui8fd\"><!> <span class=\"svelte-19ui8fd\"> </span> <span class=\"event-kind svelte-19ui8fd\"> </span></div> <!> <!> <!> <!></div> <!> <!></section>"), qt = r("<p class=\"unsupported-kind svelte-19ui8fd\"> </p>"), Jt = r("<div class=\"composer-target-content svelte-19ui8fd\"><h2 class=\"svelte-19ui8fd\"> </h2> <label class=\"target-input-label svelte-19ui8fd\" for=\"composer-target-input\"> </label> <div class=\"composer-target-input-shell svelte-19ui8fd\"><input id=\"composer-target-input\" type=\"text\" inputmode=\"text\" autocomplete=\"off\" spellcheck=\"false\" class=\"svelte-19ui8fd\"/> <!></div> <!>  <!> <!></div>"), Yt = r("<div class=\"delete-confirm-body svelte-19ui8fd\"><p class=\"delete-confirm-description svelte-19ui8fd\"> </p> <p class=\"delete-confirm-warning svelte-19ui8fd\"> </p></div>"), Xt = r("<div> </div>"), Zt = r("<!> <!> <!> <!> <!>", 1), Qt = {
	hash: "svelte-19ui8fd",
	code: ".xmark-icon.svelte-19ui8fd {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.composer-target-dialog {max-width:560px;}\n\n    @media (max-width: 600px) {.composer-target-dialog {top:0;translate:-50%\n                max(\n                    calc(\n                        var(--mobile-dialog-viewport-top) +\n                            env(safe-area-inset-top, 0px) + 12px\n                    ),\n                    calc(var(--mobile-dialog-center-y) - 50%)\n                );width:calc(100% - 24px);max-height:calc(\n                var(--mobile-dialog-viewport-height) -\n                    env(safe-area-inset-top, 0px) -\n                    env(safe-area-inset-bottom, 0px) -\n                    24px\n            );}.composer-target-dialog .dialog-content {min-height:0;max-height:none;flex:1 1 auto;overflow-y:auto;}.composer-target-dialog .dialog-footer {flex:0 0 auto;}\n    }.composer-target-content.svelte-19ui8fd {display:grid;gap:10px;width:100%;}h2.svelte-19ui8fd {margin:0;font-size:1.25rem;}.target-input-label.svelte-19ui8fd {font-weight:600;}.composer-target-input-shell.svelte-19ui8fd {position:relative;}input.svelte-19ui8fd {width:100%;min-height:50px;padding:8px 49px 8px 10px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text);font:inherit;outline:none;}input.svelte-19ui8fd:focus-visible {outline:2px solid var(--theme);outline-offset:-1px;}.ehagaki-app-root button.composer-target-clear-button {position:absolute;inset-block:50%;inset-inline-end:2px;transform:translateY(-50%);width:46px;height:46px;display:flex;align-items:center;justify-content:center;padding:0;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);z-index:1;}.ehagaki-app-root button.composer-target-clear-button:hover:not(:disabled),\n    .ehagaki-app-root button.composer-target-clear-button:active:not(:disabled),\n    .ehagaki-app-root button.composer-target-clear-button:focus-visible,\n    .ehagaki-app-root button.composer-target-clear-button:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.composer-target-clear-button:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.ehagaki-app-root button.composer-target-related-retry-button {height:auto;min-height:44px;padding:8px 12px;}.composer-target-clear-button .svg-icon {--svg: currentColor;width:24px;height:24px;}.clear-input-icon.svelte-19ui8fd {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.target-status.svelte-19ui8fd p:where(.svelte-19ui8fd),\n    .channel-preview.svelte-19ui8fd p:where(.svelte-19ui8fd),\n    .unsupported-kind.svelte-19ui8fd {margin:0;}.event-kind.svelte-19ui8fd,\n    .channel-creator.svelte-19ui8fd,\n    .channel-relays.svelte-19ui8fd {color:var(--text-muted);font-size:0.85rem;}.target-status.svelte-19ui8fd {display:grid;gap:8px;color:var(--text-muted);}.target-status.error.svelte-19ui8fd {color:var(--danger);}.composer-target-loading {justify-content:flex-start;padding:0;}.target-preview.svelte-19ui8fd {display:grid;min-width:0;border:1px solid var(--border-hr);background:var(--bg-input);}.composer-target-channel-action.svelte-19ui8fd {display:flex;width:100%;justify-content:center;}.target-preview .post-preview-footer {--post-history-preview-footer-surface: var(--bg-input);}.target-preview-body.svelte-19ui8fd {display:grid;min-width:0;gap:10px;padding:12px;}.composer-target-repost-preview.svelte-19ui8fd {min-width:0;}.interaction-label.svelte-19ui8fd {margin:0;font-weight:600;}.interaction-author.svelte-19ui8fd {display:inline-flex;align-items:center;gap:6px;min-width:0;color:var(--text);}.interaction-author-name.svelte-19ui8fd {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.interaction-author .composer-target-avatar {width:24px;height:24px;}.composer-target-repost-preview .post-history-repost-title > span {flex-shrink:0;white-space:nowrap;}.composer-target-repost-preview .post-history-repost-title > .interaction-author {flex-shrink:1;}.composer-target-reaction-preview.svelte-19ui8fd {min-width:0;}.composer-target-reaction-preview.svelte-19ui8fd p:where(.svelte-19ui8fd) {margin:0;}.composer-target-reaction-label.svelte-19ui8fd {display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--btn-post-preview-action);}.composer-target-reaction-title.svelte-19ui8fd {display:flex;align-items:center;gap:6px;min-width:0;padding-left:6px;}.composer-target-reaction-title.svelte-19ui8fd > span:where(.svelte-19ui8fd) {flex-shrink:0;white-space:nowrap;}.composer-target-reaction-title.svelte-19ui8fd > .interaction-author:where(.svelte-19ui8fd) {flex-shrink:1;}.composer-target-reaction-symbol.svelte-19ui8fd {flex-shrink:0;width:22px;height:22px;flex:0 0 22px;--svg: currentColor;mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.composer-target-reaction-label .post-history-menu-trigger {inline-size:28px;block-size:28px;min-inline-size:28px;min-block-size:28px;flex:0 0 28px;padding:0;}.related-channel-row.svelte-19ui8fd {display:flex;flex-wrap:wrap;gap:6px;padding:4px 6px;overflow-wrap:anywhere;}.related-interaction-label.svelte-19ui8fd {padding:4px 6px;color:var(--text-muted);}.event-author.svelte-19ui8fd {display:flex;align-items:center;gap:8px;min-width:0;}.event-author.svelte-19ui8fd > span:where(.svelte-19ui8fd):first-of-type {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.event-kind.svelte-19ui8fd {margin-inline-start:auto;white-space:nowrap;}.composer-target-avatar {width:36px;height:36px;flex:0 0 auto;}.composer-target-avatar-image,\n    .composer-target-avatar-fallback {width:100%;height:100%;border-radius:50%;}.target-preview .event-content,\n    .channel-preview.svelte-19ui8fd p:where(.svelte-19ui8fd) {white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}.target-preview .event-content-collapsed {max-height:calc(5 * 1.45em);overflow:hidden;}.channel-preview.svelte-19ui8fd {display:flex;gap:10px;padding-top:10px;border-top:1px solid var(--border-hr);}.target-preview-body.channel-first.svelte-19ui8fd .channel-preview:where(.svelte-19ui8fd) {padding-top:0;border-top:0;}.target-preview-body.channel-first.svelte-19ui8fd .event-author:where(.svelte-19ui8fd) {padding-top:10px;border-top:1px solid var(--border-hr);}.channel-preview .channel-picture {width:48px;height:48px;flex:0 0 auto;object-fit:cover;}.channel-text.svelte-19ui8fd {display:grid;gap:4px;min-width:0;}.channel-name.svelte-19ui8fd {min-width:0;overflow-wrap:anywhere;}.channel-relays.svelte-19ui8fd {white-space:pre-wrap;overflow-wrap:anywhere;}.delete-failed.svelte-19ui8fd {margin:0;color:var(--danger);}.delete-confirm-body.svelte-19ui8fd {display:flex;flex-direction:column;justify-content:center;gap:0.5rem;margin:10px 0 30px;margin-inline:auto;text-align:start;}.delete-confirm-description.svelte-19ui8fd,\n    .delete-confirm-warning.svelte-19ui8fd {margin:0;line-height:1.5;}.delete-confirm-warning.svelte-19ui8fd {color:var(--text-light);font-size:0.875rem;}.target-preview .post-icon {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.post-history-menu-content .menu-action-button .raw-json-icon {mask-image:var(--ehagaki-icon-646174615f6f626a6563745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .broadcast-icon {mask-image:var(--ehagaki-icon-63656c6c5f746f7765725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .trash-icon {mask-image:var(--ehagaki-icon-64656c6574655f666f72657665725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}"
};
function $t(r, A) {
	ie(A, !0), y(r, Qt);
	let j = () => te(ce, "$_", oe), M = () => te(se, "$locale", oe), [oe, pe] = w(), he = (e, n = v) => {
		var r = s(), c = x(r), l = (e) => {
			let r = k(() => j()("common.showActions"));
			{
				let c = (e) => {
					var r = Dt(), c = x(r), l = (e) => {
						ct(e, {
							get pending() {
								return ht();
							},
							onSelect: () => void rn(n())
						});
					}, d = k(() => mt() && me(n().kind));
					a(c, (e) => {
						p(d) && e(l);
					});
					var m = f(c, 2);
					i(m, () => ke, (e, r) => {
						r(e, {
							class: "menu-action-button",
							onSelect: () => vr(n().rawEvent),
							children: (e, n) => {
								var r = Ct(), i = f(x(r), 2), a = D(i, !0);
								u((e) => t(a, e), [() => j()("postHistory.rawJson")]), o(e, r);
							},
							$$slots: { default: !0 }
						});
					});
					var h = f(m, 2), g = (e) => {
						var r = s(), a = x(r);
						{
							let e = k(() => p(gn) === "sending");
							i(a, () => ke, (r, i) => {
								i(r, {
									class: "menu-action-button",
									get disabled() {
										return p(e);
									},
									onpointerdown: (e) => yr(n(), e),
									onSelect: (e) => void Sr(n(), e),
									children: (e, n) => {
										var r = wt(), i = f(x(r), 2), a = D(i, !0);
										u((e) => t(a, e), [() => j()("postHistory.broadcast")]), o(e, r);
									},
									$$slots: { default: !0 }
								});
							});
						}
						o(e, r);
					};
					a(h, (e) => {
						p(jn) && e(g);
					});
					var _ = f(h, 2), v = (e) => {
						var r = Et(), a = x(r);
						i(a, () => Ae, (e, t) => {
							t(e, { class: "post-history-menu-separator" });
						});
						var s = f(a, 2);
						{
							let e = k(() => p(W) === "sending");
							i(s, () => ke, (r, i) => {
								i(r, {
									class: "menu-action-button menu-action-button-danger",
									get disabled() {
										return p(e);
									},
									onSelect: () => Cr(n()),
									children: (e, n) => {
										var r = Tt(), i = f(x(r), 2), a = D(i, !0);
										u((e) => t(a, e), [() => p(W) === "sending" ? j()("postHistory.deleteSending") : j()("postHistory.delete")]), o(e, r);
									},
									$$slots: { default: !0 }
								});
							});
						}
						o(e, r);
					};
					a(_, (e) => {
						p(Mn) && e(v);
					}), o(e, r);
				}, l = k(() => U.isPostMenuOpen(n().eventId)), d = k(() => Ee(n().postedAt, M()));
				lt(e, {
					get open() {
						return p(l);
					},
					onOpenChange: (e) => _r(n().eventId, e),
					get triggerAriaLabel() {
						return p(r);
					},
					get tooltipContent() {
						return p(r);
					},
					enableTooltip: !0,
					get timestamp() {
						return p(d);
					},
					items: c,
					$$slots: { items: !0 }
				});
			}
		};
		a(c, (e) => {
			n().eventId === p(X)?.eventId && e(l);
		}), o(e, r);
	}, ge = (e, t = v) => {
		let n = k(() => Vn.getReadModel(t().eventId));
		var r = s(), i = x(r), c = (e) => {
			{
				let r = k(() => p(G) === t().eventId), i = k(() => p(G) === t().eventId ? j()("postHistory.hideReactions") : j()("postHistory.showReactionsWithCount", { values: { count: p(n).totalCount } }));
				Ye(e, {
					get count() {
						return p(n).totalCount;
					},
					get expanded() {
						return p(r);
					},
					get ariaLabel() {
						return p(i);
					},
					onToggle: () => S(G, p(G) === t().eventId ? null : t().eventId, !0)
				});
			}
		};
		a(i, (e) => {
			p(n) && p(n).totalCount > 0 && e(c);
		}), o(e, r);
	}, _e = (e, t = v) => {
		let n = k(() => Vn.getReadModel(t().eventId));
		var r = s(), i = x(r), c = (e) => {
			rt(e, {
				get readModel() {
					return p(n);
				},
				get emojiLoadStateByUrl() {
					return Q.emojiLoadStateByUrl;
				},
				get emojiImageMetaByUrl() {
					return Q.emojiImageMetaByUrl;
				}
			});
		};
		a(i, (e) => {
			p(n) && p(n).totalCount > 0 && p(G) === t().eventId && e(c);
		}), o(e, r);
	}, be = (e) => {
		var t = s(), n = x(t), r = (e) => {
			var t = Et(), n = x(t);
			{
				let e = (e) => {
					Ue(e, {
						get post() {
							return p(X);
						},
						onReactionPost: () => $("reaction"),
						reactionExtras: (e) => {
							ge(e, () => p(X));
						},
						$$slots: { reactionExtras: !0 }
					});
				}, t = k(() => Ce(p(X).postedAt));
				ut(n, {
					get formattedDate() {
						return p(t);
					},
					actions: e,
					$$slots: { actions: !0 }
				});
			}
			var r = f(n, 2);
			_e(r, () => p(X)), o(e, t);
		};
		a(n, (e) => {
			p(X) && e(r);
		}), o(e, t);
	}, xe = E(A, "inboundInteractionSave", 3, null), N = E(A, "rxNostr", 3, void 0), P = E(A, "relayConfig", 3, null), Le = E(A, "profileService", 3, void 0), qe = E(A, "resolver", 19, _t), ft = E(A, "relatedResolver", 3, void 0), F = E(A, "pubkeyHex", 3, null), mt = E(A, "onRepostPost", 3, void 0), ht = E(A, "repostPending", 3, !1), gt = E(A, "onRetryRepostSave", 3, void 0), vt = E(A, "repostSaveFailure", 3, null), $t;
	function en() {
		return $t ??= st({
			getShow: () => A.show,
			getRxNostr: () => N(),
			getRelayConfig: () => P()
		});
	}
	let tn = g(null), nn = 0;
	T(() => (A.show, F(), nn++, S(tn, null), () => $t?.invalidateScope("composer-repost"))), ne(() => $t?.reset());
	async function rn(e) {
		if (!mt() || ht()) return;
		S(tn, null);
		let t = nn, n = e.eventId, r = await mt()(e, (e, t) => en().prepareRepostTarget({
			relationKind: "repost",
			scopeKey: "composer-repost",
			targetEventId: e.id,
			authorHint: e.pubkey,
			relayHints: t
		}, e));
		A.show && t === nn && p(z)?.event.id === n && S(tn, r, !0);
	}
	let I = g(""), an = g(null), on = g(null), L = g("empty"), R = g(null), z = g(null), sn = g(null), cn = g(null), ln = g(0), B = 0, V, un = null, dn = g(h([])), H = g(-1), fn = g(!1), pn = g(null), U = Xe(), mn = g(!1), hn = g(null), gn = g(void 0), W = g(void 0), _n = g(!1), vn = g(0), yn = g(0), bn = g("postHistory.broadcastSent"), xn, Sn = g(void 0), G = g(null), K = k(() => p(z) ? bt(p(z).event.kind, [1, 1111].includes(p(z).event.kind) || !!p(z).channelQuery) : []), q = k(() => p(z)?.event ?? p(sn)), Cn = pt({
		getShow: () => A.show,
		getTarget: () => p(z),
		getRxNostr: () => N(),
		getRelayConfig: () => P(),
		getPubkey: () => F(),
		resolver: C(() => ft())
	}), J = k(() => Cn.getPreview()), Y = k(() => p(z) && [6, 16].includes(p(z).event.kind) ? p(J) : null), wn = k(() => p(J)?.status === "resolved" && p(J).event?.kind === 42 ? [ye(p(J).event, p(J).relayHints)] : []), Tn = Ge({
		getShow: () => A.show,
		getPosts: () => p(wn),
		getRxNostr: () => N(),
		getRelayConfig: () => P(),
		getIsSearchMode: () => !1
	}), En = k(() => p(wn)[0] ? Tn.getChannelText(p(wn)[0], j()) : null), Dn = k(() => p(J)?.event ? [
		6,
		7,
		16
	].includes(p(J).event.kind) ? Pe(p(J).event) : we({
		kind: p(J).event.kind,
		sourceContent: p(J).event.content,
		tags: p(J).event.tags
	}) : null);
	function On(e) {
		return e === 6 ? "repost.entry" : e === 16 ? "composerTarget.genericRepost" : "composerTarget.reaction";
	}
	let kn = k(() => p(J)?.status === "loading" ? "composerTarget.relatedLoading" : p(J)?.status === "deleted" ? "composerTarget.relatedDeleted" : p(J)?.status === "unsupported-reference" || p(J)?.status === "unsupported-target-kind" ? "composerTarget.relatedUnsupported" : p(J)?.status === "invalid-reference" || p(J)?.status === "invalid-target" || p(J)?.status === "outer-target-kind-mismatch" ? "composerTarget.relatedInvalid" : "composerTarget.relatedMissing"), An = k(() => p(q) ? p(q).created_at * 1e3 : 0), X = k(() => p(z) ? gr(p(z)) : null), jn = k(() => p(X) ? tt(p(X)) !== null : !1), Mn = k(() => p(X) ? it(p(X), F()) : !1), Nn = k(() => p(z)?.authorProfile ?? p(cn)), Pn = k(() => {
		let e = p(q)?.pubkey;
		return e ? p(Nn)?.displayName?.trim() || p(Nn)?.name?.trim() || Fe(ae.npubEncode(e), 12, 4) : "";
	}), Fn = k(() => !p(q) || [
		6,
		7,
		16,
		40
	].includes(p(q).kind) ? "" : Te(p(q).content, p(q).tags)), In = k(() => St(p(Fn))), Ln = k(() => p(q) && p(Fn) ? [{
		eventId: p(q).id,
		content: p(In).content,
		forceCollapsible: p(In).exceedsRenderLimit
	}] : []), Rn = ot({
		getShow: () => A.show,
		getPosts: () => p(Ln),
		getContainer: () => p(on)
	}), zn = Je({
		getShow: () => A.show,
		getRxNostr: () => N()
	}), Bn = k(() => {
		let e = p(z) && ve(p(z).event.kind) ? [{
			eventId: p(z).event.id,
			relayHints: [...p(z).relayHints],
			targetAuthorPubkey: p(z).event.pubkey,
			targetKind: p(z).event.kind
		}] : [];
		return p(J)?.status === "resolved" && p(J).event && ve(p(J).event.kind) && e.push({
			eventId: p(J).event.id,
			relayHints: [...p(J).relayHints],
			targetAuthorPubkey: p(J).event.pubkey,
			targetKind: p(J).event.kind
		}), e;
	}), Vn = nt({
		getShow: () => A.show,
		getPubkeyHex: () => F(),
		getRxNostr: () => N(),
		getRelayConfig: () => P(),
		getTargets: () => p(Bn),
		profileSync: zn,
		source: "composer-target-display"
	}), Z = k(() => p(z) && ve(p(z).event.kind) ? Vn.getReadModel(p(z).event.id) : null), Hn = k(() => !!p(z) && p(G) === p(z).event.id), Un = null;
	T(() => {
		let e = A.show && p(z) && ve(p(z).event.kind) ? p(z).event.id : null;
		e !== Un && (Un = e, S(G, null), zn.reset());
	});
	function Wn() {
		p(z) && p(Z)?.totalCount && S(G, p(Hn) ? null : p(z).event.id, !0);
	}
	function Gn(e) {
		return p(Hn) ? j()("postHistory.hideReactions") : j()("postHistory.showReactionsWithCount", { values: { count: e } });
	}
	let Kn = Rn.previewRef, qn = k(() => p(Ln)[0]), Jn = k(() => p(qn) ? Rn.isPostExpanded(p(qn)) : !1), Yn = k(() => p(Jn) ? p(Fn) : p(In).content), Xn = k(() => p(q) && [
		6,
		7,
		16
	].includes(p(q).kind) ? Pe(p(q)) : p(q)?.kind === 40 ? we({
		sourceContent: "",
		displayContent: "",
		tags: [],
		kind: p(q)?.kind,
		media: []
	}) : we({
		sourceContent: p(Fn),
		kind: p(q)?.kind,
		tags: p(q)?.tags ?? []
	})), Zn = k(() => p(Yn) === p(Fn) ? p(Xn) : we({
		sourceContent: p(Fn),
		kind: p(q)?.kind,
		displayContent: p(Xn).hasRenderableText ? p(Yn) : "",
		tags: p(q)?.tags ?? [],
		media: p(Xn).media
	})), Qn = k(() => {
		let e = new Set(p(Zn).previewContent.emojiUrls);
		for (let t of p(Dn)?.previewContent.emojiUrls ?? []) e.add(t);
		if (p(G)) for (let t of Vn.getReadModel(p(G))?.groups ?? []) t.emojiUrl && e.add(t.emojiUrl);
		return [...e];
	}), $n = k(() => p(Xn).hasRenderableText), er = k(() => !!p(qn) && p($n) && Rn.shouldCollapsePost(p(qn))), tr = k(() => p(q) ? `composer-target-preview-content-${p(q).id}` : ""), nr = k(() => {
		let e = p(z)?.channelContext?.about;
		return e ? xt(dt(e), 200) : "";
	}), rr = k(() => {
		let e = p(z)?.channelContext;
		return e ? e.name?.trim() || `ID: ${Fe(e.eventId, 12, 8)}` : "";
	}), ir = k(() => {
		let e = p(z)?.channelCreatorPubkey;
		return e ? p(z)?.channelCreatorProfile?.displayName?.trim() || p(z)?.channelCreatorProfile?.name?.trim() || Fe(ae.npubEncode(e), 12, 4) : "";
	}), ar = k(fr), or = k(() => p(R) === "not-found" || p(R) === "timeout" || p(R) === "network" || p(R) === "channel-unavailable" || p(R) === "nostr-not-ready"), sr = k(() => p(L) === "debouncing" || p(L) === "event-loading" || p(L) === "channel-loading" || p(L) === "profile-loading"), Q = De({
		getShow: () => A.show && p(Qn).length > 0,
		getEmojiUrls: () => p(Qn),
		onStateChanged: () => Rn.remeasure()
	});
	function cr() {
		V !== void 0 && (clearTimeout(V), V = void 0), un?.cancel(), un = null;
	}
	function lr() {
		xn !== void 0 && (clearTimeout(xn), xn = void 0), S(_n, !1), S(Sn, void 0);
	}
	function ur() {
		$t?.reset(), $t = void 0, nn++, S(tn, null), U.reset(), S(mn, !1), S(hn, null), S(gn, void 0), S(W, void 0), lr();
	}
	function dr() {
		B += 1, cr(), S(I, ""), S(L, "empty"), S(R, null), S(z, null), S(sn, null), S(cn, null), S(ln, 0), S(G, null), zn.reset(), ur(), Q.resetState(), S(dn, [], !0), S(H, -1), S(fn, !1), S(pn, null);
	}
	function fr() {
		return p(L) === "parsing" ? j()("composerTarget.parsing") : p(L) === "debouncing" || p(L) === "event-loading" ? j()("composerTarget.checking") : p(L) === "channel-loading" ? j()("composerTarget.channelLoading") : p(L) === "profile-loading" ? j()("composerTarget.profileLoading") : p(R) ? p(R) === "unsupported" ? j()("composerTarget.unsupportedFormat") : p(R) === "secret-key" ? j()("composerTarget.secretKey") : p(R) === "invalid" ? j()("composerTarget.invalidFormat") : p(R) === "not-found" ? j()("composerTarget.notFound") : p(R) === "timeout" ? j()("composerTarget.timeout") : p(R) === "mismatch" ? j()("composerTarget.mismatch") : p(R) === "channel-unavailable" ? j()("composerTarget.channelUnavailable") : j()("composerTarget.fetchFailed") : "";
	}
	async function pr(e, t) {
		if (!N()) {
			B === t && (S(L, "error"), S(R, "nostr-not-ready"));
			return;
		}
		un = qe().resolve({
			pointer: e,
			rxNostr: N(),
			relayConfig: P(),
			profileService: Le(),
			onPhase: (e) => {
				B === t && S(L, e, !0);
			}
		});
		let n = await un.promise;
		B === t && n.status !== "cancelled" && (un = null, n.status === "resolved" ? (S(z, n.target, !0), S(sn, null), S(cn, null), S(L, "ready"), S(R, null)) : (S(sn, n.event ?? null, !0), S(cn, n.authorProfile ?? null, !0), S(L, "error"), S(R, n.reason, !0)));
	}
	function mr() {
		S(ln, p(ln) + 1);
	}
	async function $(e) {
		if (!p(z)) return !1;
		let t = p(z), n = B, r = await A.onApply(e, {
			source: "manual",
			kind: p(z).event.kind,
			eventId: p(z).event.id,
			relayHints: [...p(z).fetchedRelayUrl ? [p(z).fetchedRelayUrl] : [], ...p(z).relayHints],
			authorPubkey: p(z).event.pubkey,
			event: p(z).event,
			channelQuery: p(z).channelQuery,
			isCurrent: () => A.show && B === n && p(z) === t
		});
		return r && A.show && p(z) === t && B === n && Er(), r;
	}
	async function hr(e) {
		let t = B, n = p(z), r = await A.onApply("reaction", {
			...Ie(e),
			source: "manual",
			relayHints: [
				...e.fetchedRelays ?? [],
				...e.acceptedRelays,
				...e.relayHints
			],
			isCurrent: () => A.show && B === t && p(z) === n
		});
		return r && A.show && B === t && p(z) === n && Er(), r;
	}
	T(() => {
		let e = xe();
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
		t && U.closeAllPostItemMenus(), U.setPostMenuOpen(e, t);
	}
	function vr(e) {
		U.closeAllPostItemMenus(), S(hn, e, !0), S(mn, !0);
	}
	function yr(e, t) {
		S(Sn, {
			eventId: e.eventId,
			...fe(t.clientX, t.clientY)
		}, !0);
	}
	function br(e, t) {
		if (p(Sn)?.eventId === e.eventId) return {
			x: p(Sn).x,
			y: p(Sn).y
		};
		let n = t.currentTarget, r = n instanceof HTMLElement ? n.getBoundingClientRect() : null;
		return fe(r ? r.left + r.width / 2 : 0, r ? r.bottom + 8 : 0);
	}
	function xr(e, t) {
		lr(), S(vn, e.x, !0), S(yn, e.y, !0), S(bn, t.success ? (t.rejectedRelays?.length ?? 0) > 0 || (t.timedOutRelays?.length ?? 0) > 0 ? "postHistory.broadcastPartial" : "postHistory.broadcastSent" : "postHistory.broadcastFailed", !0), S(_n, !0), xn = setTimeout(() => {
			S(_n, !1), xn = void 0;
		}, 1800);
	}
	async function Sr(e, t) {
		if (p(gn) === "sending") return;
		let n = B, r = e.eventId, i = br(e, t);
		S(gn, "sending");
		let a = await at.broadcast({
			post: e,
			rxNostr: N()
		});
		B === n && p(z)?.event.id === r && (S(gn, void 0), xr(i, a));
	}
	function Cr(e) {
		it(e, F()) && U.openDeleteConfirm(e);
	}
	function wr() {
		U.cancelDeleteConfirm();
	}
	async function Tr() {
		let e = U.deleteTargetPost;
		if (!e || p(W) === "sending") return;
		let t = B, n = e.eventId;
		S(W, "sending");
		let r = await et.requestDeletion({
			post: e,
			rxNostr: N()
		});
		B === t && p(z)?.event.id === n && (U.setDeleteConfirmOpen(!1), r.success ? (S(W, void 0), Er()) : S(W, "failed"));
	}
	function Er() {
		dr(), A.onClose();
	}
	function Dr() {
		p(I).trim().length !== 0 && (S(I, ""), p(an)?.focus({ preventScroll: !0 }));
	}
	function Or(e) {
		e.preventDefault(), p(an)?.focus({ preventScroll: !0 });
	}
	function kr(e) {
		return e instanceof Element && e.closest(".ehagaki-pswp") !== null;
	}
	function Ar(e) {
		kr(e.target) && e.preventDefault();
	}
	function jr(e) {
		p(fn) && e.preventDefault();
	}
	function Mr(e) {
		S(dn, e.mediaList, !0), S(H, e.index, !0), S(pn, e.focusOrigin, !0), S(fn, !0);
	}
	function Nr() {
		S(fn, !1), S(dn, [], !0), S(H, -1), S(pn, null);
	}
	function Pr(e) {
		S(H, e, !0);
	}
	T(() => {
		A.show || dr();
	}), T(() => {
		if (!A.show) return;
		let e = p(I);
		p(ln);
		let t = ++B;
		cr(), ur(), S(z, null), S(sn, null), S(cn, null), S(R, null), S(L, "parsing");
		let n = yt(e);
		if (n.status === "empty") {
			S(L, "empty");
			return;
		}
		if (n.status === "unsupported") {
			S(L, "error"), S(R, "unsupported");
			return;
		}
		if (n.status === "secret-key") {
			S(L, "error"), S(R, "secret-key");
			return;
		}
		if (n.status === "invalid") {
			S(L, "error"), S(R, "invalid");
			return;
		}
		let r = n.pointer;
		return S(L, "debouncing"), V = setTimeout(() => {
			V = void 0, pr(r, t);
		}, 250), () => {
			V !== void 0 && (clearTimeout(V), V = void 0);
		};
	}), ne(() => {
		B += 1, cr(), lr(), zn.dispose();
	});
	var Fr = Zt(), Ir = x(Fr);
	{
		let n = (e) => {
			var t = Et(), n = x(t);
			Ze(n, {
				get result() {
					return p(tn);
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
			var r = f(n, 2);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = k(() => j()("global.close"));
						ue(e, l(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return p(t);
							},
							children: (e, t) => {
								var n = Ot();
								u((e) => O(n, "aria-label", e), [() => j()("global.close")]), o(e, n);
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
			o(e, t);
		}, r = k(() => j()("composerTarget.title")), h = k(() => j()("composerTarget.description"));
		je(Ir, {
			get open() {
				return A.show;
			},
			onOpenChange: (e) => !e && Er(),
			get title() {
				return p(r);
			},
			get description() {
				return p(h);
			},
			contentClass: "composer-target-dialog",
			footerVariant: "close-button",
			onOpenAutoFocus: Or,
			onInteractOutside: Ar,
			onEscapeKeydown: jr,
			footer: n,
			children: (n, r) => {
				var i = Jt();
				{
					let n = (n) => {
						var r = Mt(), i = d(r), s = (e) => {
							Re(e, {
								get eventId() {
									return p(z).channelContext.eventId;
								},
								get pictureUrl() {
									return p(z).channelContext.picture;
								},
								get cacheEligible() {
									return p(z).channelPictureCacheEligible;
								},
								alt: "",
								className: "channel-picture"
							});
						};
						a(i, (e) => {
							p(z)?.channelContext?.picture && e(s);
						});
						var c = f(i, 2), l = d(c), m = D(l, !0), h = f(l, 2), g = (e) => {
							var n = kt(), r = D(n, !0);
							u(() => t(r, p(nr))), o(e, n);
						};
						a(h, (e) => {
							p(nr) && e(g);
						});
						var _ = f(h, 2), v = (e) => {
							var n = At(), r = D(n);
							u((e) => t(r, `${e ?? ""}: ${p(ir) ?? ""}`), [() => j()("composerTarget.creator")]), o(e, n);
						};
						a(_, (e) => {
							p(ir) && e(v);
						});
						var y = f(_, 2), b = (e) => {
							var n = jt(), r = D(n, !0);
							u((e) => t(r, e), [() => p(z).channelContext.channelRelays.join("\n")]), o(e, n);
						};
						a(y, (e) => {
							p(z)?.channelContext?.channelRelays?.length && e(b);
						}), e(c), e(r), u(() => t(m, p(rr))), o(n, r);
					}, r = (n) => {
						var r = Nt(), i = d(r);
						{
							let e = k(() => p(Nn)?.picture ?? "");
							Be(i, {
								get src() {
									return p(e);
								},
								alt: "",
								rootClassName: "composer-target-avatar",
								imageClassName: "composer-target-avatar-image",
								fallbackClassName: "composer-target-avatar-fallback",
								fallbackAriaLabel: ""
							});
						}
						var a = f(i, 2), s = D(a, !0);
						e(r), u(() => t(s, p(Pn))), o(n, r);
					};
					var l = d(i), h = D(l, !0), g = f(l, 2), v = D(g, !0), y = f(g, 2), C = d(y);
					c(C), m(C, (e) => S(an, e), () => p(an));
					var w = f(C, 2), T = (e) => {
						{
							let t = k(() => j()("composerTarget.clearInput"));
							ue(e, {
								type: "button",
								className: "composer-target-clear-button",
								variant: "default",
								shape: "square",
								contentLayout: "icon",
								get ariaLabel() {
									return p(t);
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
									o(e, n);
								},
								$$slots: { default: !0 }
							});
						}
					}, E = k(() => p(I).trim().length > 0);
					a(w, (e) => {
						p(E) && e(T);
					}), e(y);
					var te = f(y, 2), ne = (n) => {
						var r = Ft();
						let i;
						var s = d(r), c = (e) => {
							le(e, {
								showLoader: !0,
								get text() {
									return p(ar);
								},
								customClass: "composer-target-loading"
							});
						}, l = (e) => {
							var n = kt(), r = D(n, !0);
							u(() => t(r, p(ar))), o(e, n);
						};
						a(s, (e) => {
							p(sr) ? e(c) : e(l, -1);
						});
						var m = f(s, 2), h = (e) => {
							ue(e, {
								onClick: mr,
								children: (e, n) => {
									b();
									var r = ee();
									u((e) => t(r, e), [() => j()("postHistory.contextRetry")]), o(e, r);
								},
								$$slots: { default: !0 }
							});
						};
						a(m, (e) => {
							p(or) && e(h);
						}), e(r), u(() => i = re(r, 1, "target-status svelte-19ui8fd", null, i, { error: p(L) === "error" })), o(n, r);
					};
					a(te, (e) => {
						p(ar) && e(ne);
					});
					var ie = f(te, 2), A = (n) => {
						var i = Lt(), s = d(i);
						{
							let e = k(() => p(Dn) ?? void 0), t = k(() => p(Y).event && [
								6,
								7,
								16
							].includes(p(Y).event.kind) ? j()(On(p(Y).event.kind)) : null), n = k(() => p(Y).event ? Oe({
								ownerPubkey: F(),
								structure: p(Y).event,
								relayHints: p(Y).relayHints,
								rxNostr: N(),
								relayConfig: P()
							}) : void 0);
							He(s, {
								get post() {
									return p(X);
								},
								onReactionPost: (e) => e.eventId === p(X)?.eventId ? $("reaction") : hr(e),
								get reactionExtras() {
									return ge;
								},
								get reactionDetails() {
									return _e;
								},
								get preview() {
									return p(Y);
								},
								get author() {
									return r;
								},
								get menu() {
									return he;
								},
								get channelText() {
									return p(En);
								},
								get model() {
									return p(e);
								},
								get targetLabel() {
									return p(t);
								},
								get onRetry() {
									return Cn.retry;
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
									return p(n);
								}
							});
						}
						var c = f(s, 2), l = (e) => {
							var n = It(), r = D(n, !0);
							u((e) => t(r, e), [() => j()("postHistory.deleteFailed")]), o(e, n);
						};
						a(c, (e) => {
							p(W) === "failed" && e(l);
						}), e(i), u((e) => O(i, "aria-label", e), [() => j()("composerTarget.preview")]), o(n, i);
					}, ae = (n) => {
						var i = Vt(), c = x(i), l = d(c), m = d(l), h = d(m);
						r(h);
						var g = f(h, 4), _ = D(g, !0);
						e(m);
						var v = f(m, 2);
						he(v, () => p(X)), e(l);
						var y = f(l, 2), S = (n) => {
							let r = k(() => p(J).event);
							{
								let i = (n) => {
									var i = s(), c = x(i), l = (n) => {
										var r = Rt(), i = d(r), a = D(i, !0), s = f(i, 2), c = D(s, !0);
										e(r), u((e) => {
											t(a, e), t(c, p(En));
										}, [() => j()("postHistory.channel")]), o(n, r);
									}, m = (e) => {
										var n = zt(), i = D(n, !0);
										u((e) => t(i, e), [() => j()(On(p(r).kind))]), o(e, n);
									}, h = k(() => [
										6,
										7,
										16
									].includes(p(r).kind));
									a(c, (e) => {
										p(En) ? e(l) : p(h) && e(m, 1);
									}), o(n, i);
								}, c = (e) => {
									{
										let t = (e) => {
											{
												let t = k(() => ye(p(r), p(J).relayHints));
												ge(e, () => p(t));
											}
										}, n = k(() => ye(p(r), p(J).relayHints));
										Ue(e, {
											get post() {
												return p(n);
											},
											onReactionPost: hr,
											reactionExtras: t,
											$$slots: { reactionExtras: !0 }
										});
									}
								}, l = (e) => {
									{
										let t = k(() => ye(p(r), p(J).relayHints));
										_e(e, () => p(t));
									}
								}, m = k(() => Oe({
									ownerPubkey: F(),
									structure: p(r),
									relayHints: p(J).relayHints,
									rxNostr: N(),
									relayConfig: P()
								}));
								Ke(n, {
									get event() {
										return p(r);
									},
									get profile() {
										return p(J).profile;
									},
									get model() {
										return p(Dn);
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
										return p(m);
									},
									topActions: i,
									footerActions: c,
									footerDetails: l,
									$$slots: {
										topActions: !0,
										footerActions: !0,
										footerDetails: !0
									}
								});
							}
						}, C = (e) => {
							var n = Bt(), r = x(n), i = D(r, !0), s = f(r, 2), c = (e) => {
								ue(e, {
									className: "composer-target-related-retry-button",
									get onClick() {
										return Cn.retry;
									},
									children: (e, n) => {
										b();
										var r = ee();
										u((e) => t(r, e), [() => j()("postHistory.contextRetry")]), o(e, r);
									},
									$$slots: { default: !0 }
								});
							}, l = k(() => [
								"not-found",
								"error",
								"invalid-target"
							].includes(p(J).status));
							a(s, (e) => {
								p(l) && e(c);
							}), u((e) => t(i, e), [() => j()(p(kn))]), o(e, n);
						};
						a(y, (e) => {
							p(J).status === "resolved" && p(J).event && p(Dn) ? e(S) : e(C, -1);
						});
						var w = f(y, 2), T = (e) => {
							var n = It(), r = D(n, !0);
							u((e) => t(r, e), [() => j()("postHistory.deleteFailed")]), o(e, n);
						};
						a(w, (e) => {
							p(W) === "failed" && e(T);
						}), e(c);
						var E = f(c, 2);
						be(E), u((e, n) => {
							O(c, "aria-label", e), O(c, "data-reaction-event-id", p(z).event.id), t(_, n);
						}, [() => j()("composerTarget.preview"), () => j()("composerTarget.reaction")]), o(n, i);
					}, M = (r) => {
						var i = Kt(), c = d(i);
						let l;
						var h = d(c), g = (e) => {
							n(e);
						};
						a(h, (e) => {
							p(q).kind === 42 && p(z)?.channelContext && e(g);
						});
						var _ = f(h, 2), v = d(_);
						{
							let e = k(() => p(Nn)?.picture ?? "");
							Be(v, {
								get src() {
									return p(e);
								},
								alt: "",
								rootClassName: "composer-target-avatar",
								imageClassName: "composer-target-avatar-image",
								fallbackClassName: "composer-target-avatar-fallback",
								fallbackAriaLabel: ""
							});
						}
						var y = f(v, 2), b = D(y, !0), C = f(y, 2), w = D(C);
						e(_);
						var T = f(_, 2), ee = (e) => {
							var n = Ht(), r = D(n, !0);
							u((e) => t(r, e), [() => j()(On(p(q).kind))]), o(e, n);
						}, E = k(() => [
							6,
							7,
							16
						].includes(p(q).kind));
						a(T, (e) => {
							p(E) && e(ee);
						});
						var te = f(T, 2);
						{
							let e = (e) => {
								var t = s(), n = x(t), r = (e) => {
									var t = Et(), n = x(t), r = (e) => {
										var t = Ut();
										u(() => O(t, "id", p(tr))), o(e, t);
									};
									a(n, (e) => {
										p(Zn).hasRenderableText || e(r);
									});
									var i = f(n, 2);
									Qe(i, {
										get expanded() {
											return p(Jn);
										},
										get controls() {
											return p(tr);
										},
										onToggle: () => Rn.togglePostExpanded(p(qn).eventId)
									}), o(e, t);
								};
								a(n, (e) => {
									p(qn) && p(er) && e(r);
								}), o(e, t);
							}, t = k(() => Oe({
								ownerPubkey: F(),
								structure: p(q),
								relayHints: p(z)?.relayHints,
								rxNostr: N(),
								relayConfig: P()
							})), n = k(() => p(Zn).hasRenderableText && !p(Jn) && p(er));
							Se(te, {
								get model() {
									return p(Zn);
								},
								get loadSensitiveBody() {
									return p(t);
								},
								get contentWarningEventId() {
									return p(q).id;
								},
								density: "dialog",
								get emojiLoadStateByUrl() {
									return Q.emojiLoadStateByUrl;
								},
								get emojiImageMetaByUrl() {
									return Q.emojiImageMetaByUrl;
								},
								get previewContentId() {
									return p(tr);
								},
								contentClass: "event-content",
								collapsedContentClass: "event-content-collapsed",
								get renderWhenEmpty() {
									return p(er);
								},
								get isTextCollapsed() {
									return p(n);
								},
								get previewCollapseAction() {
									return Kn;
								},
								get previewCollapseEventId() {
									return p(q).id;
								},
								onImageOpen: Mr,
								betweenContentAndMedia: e,
								$$slots: { betweenContentAndMedia: !0 }
							});
						}
						var ne = f(te, 2), ie = (e) => {
							n(e);
						};
						a(ne, (e) => {
							p(q).kind !== 42 && p(z)?.channelContext && e(ie);
						});
						var A = f(ne, 2), ae = (e) => {
							var n = It(), r = D(n, !0);
							u((e) => t(r, e), [() => j()("postHistory.deleteFailed")]), o(e, n);
						};
						a(A, (e) => {
							p(W) === "failed" && p(z) && e(ae);
						}), e(c);
						var M = f(c, 2);
						{
							let t = (t) => {
								var n = s(), r = x(n), i = (t) => {
									var n = s(), r = x(n), i = (e) => {
										var t = s(), n = x(t), r = (e) => {
											{
												let t = (e) => {
													var t = s(), n = x(t), r = (e) => {
														{
															let t = k(() => Gn(p(Z).totalCount));
															Ye(e, {
																get count() {
																	return p(Z).totalCount;
																},
																get expanded() {
																	return p(Hn);
																},
																get ariaLabel() {
																	return p(t);
																},
																onToggle: Wn
															});
														}
													};
													a(n, (e) => {
														p(Z) && p(Z).totalCount > 0 && e(r);
													}), o(e, t);
												}, n = k(() => p(K).includes("reply") ? () => $("reply") : void 0), r = k(() => p(K).includes("quote") ? () => $("quote") : void 0);
												Ue(e, {
													onReactionPost: () => $("reaction"),
													get post() {
														return p(X);
													},
													get onReplyPost() {
														return p(n);
													},
													get onQuotePost() {
														return p(r);
													},
													reactionExtras: t,
													$$slots: { reactionExtras: !0 }
												});
											}
										};
										a(n, (e) => {
											p(X) && e(r);
										}), o(e, t);
									}, c = k(() => p(K).includes("reply") || p(K).includes("quote")), l = (e) => {
										Ue(e, {
											get post() {
												return p(X);
											},
											onReactionPost: () => $("reaction"),
											reactionExtras: (e) => {
												ge(e, () => p(X));
											},
											$$slots: { reactionExtras: !0 }
										});
									}, u = k(() => p(K).includes("reaction") && p(X)), f = (t) => {
										var n = Gt(), r = d(n);
										{
											let e = k(() => j()("composerTarget.post")), t = k(() => j()("composerTarget.post"));
											We(r, {
												type: "button",
												className: "post-preview-action-button post-history-action-button",
												get ariaLabel() {
													return p(e);
												},
												contentLayout: "icon",
												shape: "circle",
												onClick: () => $("channel"),
												get tooltipContent() {
													return p(t);
												},
												children: (e, t) => {
													var n = Wt();
													o(e, n);
												},
												$$slots: { default: !0 }
											});
										}
										e(n), o(t, n);
									}, m = k(() => p(K).includes("channel"));
									a(r, (e) => {
										p(c) ? e(i) : p(u) ? e(l, 1) : p(m) && e(f, 2);
									}), o(t, n);
								};
								a(r, (e) => {
									p(z) && e(i);
								}), o(t, n);
							}, n = (e) => {
								var t = s(), n = x(t), r = (e) => {
									he(e, () => p(X));
								};
								a(n, (e) => {
									p(X) && e(r);
								}), o(e, t);
							}, r = k(() => Ce(p(An)));
							ut(M, {
								get formattedDate() {
									return p(r);
								},
								actions: t,
								trailing: n,
								$$slots: {
									actions: !0,
									trailing: !0
								}
							});
						}
						var oe = f(M, 2), se = (e) => {
							rt(e, {
								get readModel() {
									return p(Z);
								},
								get emojiLoadStateByUrl() {
									return Q.emojiLoadStateByUrl;
								},
								get emojiImageMetaByUrl() {
									return Q.emojiImageMetaByUrl;
								}
							});
						};
						a(oe, (e) => {
							p(Z) && p(Z).totalCount > 0 && p(Hn) && e(se);
						}), e(i), m(i, (e) => S(on, e), () => p(on)), u((e) => {
							O(i, "aria-label", e), l = re(c, 1, "target-preview-body svelte-19ui8fd", null, l, { "channel-first": p(q).kind === 42 && !!p(z)?.channelContext }), t(b, p(Pn)), t(w, `kind ${p(q).kind ?? ""}`);
						}, [() => j()("composerTarget.preview")]), o(r, i);
					};
					a(ie, (e) => {
						p(Y) && p(X) ? e(A) : p(J) && p(z)?.event.kind === 7 && p(X) ? e(ae, 1) : p(q) && e(M, 2);
					});
					var oe = f(ie, 2), se = (e) => {
						var n = qt(), r = D(n, !0);
						u((e) => t(r, e), [() => j()("composerTarget.unsupportedKind")]), o(e, n);
					};
					a(oe, (e) => {
						p(z) && p(K).length === 0 && !p(J) && e(se);
					}), e(i), u((e, n, r) => {
						t(h, e), t(v, n), O(C, "placeholder", r);
					}, [
						() => j()("composerTarget.title"),
						() => j()("composerTarget.inputLabel"),
						() => j()("composerTarget.placeholder")
					]), _(C, () => p(I), (e) => S(I, e));
				}
				o(n, i);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var Lr = f(Ir, 2);
	$e(Lr, {
		get open() {
			return p(mn);
		},
		get rawEvent() {
			return p(hn);
		},
		onOpenChange: (e) => S(mn, e, !0)
	});
	var Rr = f(Lr, 2);
	{
		let n = (n) => {
			var r = Yt(), i = d(r), a = D(i, !0), s = f(i, 2), c = D(s, !0);
			e(r), u((e, n) => {
				t(a, e), t(c, n);
			}, [() => j()("postHistory.deleteRequestDescription"), () => j()("postHistory.deleteRequestWarning")]), o(n, r);
		}, r = k(() => j()("postHistory.deleteRequestTitle")), i = k(() => j()("postHistory.deleteRequestDescription")), a = k(() => p(W) === "sending" ? j()("postHistory.deleteSending") : j()("postHistory.deleteConfirm")), s = k(() => j()("postHistory.deleteCancel")), c = k(() => p(W) === "sending");
		Ve(Rr, {
			get open() {
				return U.deleteConfirmOpen;
			},
			get onOpenChange() {
				return U.setDeleteConfirmOpen;
			},
			get title() {
				return p(r);
			},
			get description() {
				return p(i);
			},
			get confirmLabel() {
				return p(a);
			},
			get cancelLabel() {
				return p(s);
			},
			confirmVariant: "danger",
			get confirmDisabled() {
				return p(c);
			},
			onConfirm: Tr,
			onCancel: wr,
			contentClass: "post-history-delete-confirm",
			children: n,
			$$slots: { default: !0 }
		});
	}
	var zr = f(Rr, 2);
	{
		let e = k(() => p(dn)[p(H)]?.src ?? ""), t = k(() => p(dn)[p(H)]?.alt ?? "");
		ze(zr, {
			get src() {
				return p(e);
			},
			get alt() {
				return p(t);
			},
			onClose: Nr,
			get mediaList() {
				return p(dn);
			},
			get currentIndex() {
				return p(H);
			},
			onNavigate: Pr,
			get openingFocusOrigin() {
				return p(pn);
			},
			get show() {
				return p(fn);
			},
			set show(e) {
				S(fn, e, !0);
			}
		});
	}
	var Br = f(zr, 2);
	de(Br, {
		get show() {
			return p(_n);
		},
		get x() {
			return p(vn);
		},
		get y() {
			return p(yn);
		},
		children: (e, n) => {
			var r = Xt(), i = D(r, !0);
			u((e) => t(i, e), [() => j()(p(bn))]), o(e, r);
		},
		$$slots: { default: !0 }
	}), o(r, Fr), n(), pe();
}
export { $t as default };
