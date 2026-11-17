import { A as e, Et as t, G as n, K as r, Mt as i, N as a, Nt as o, T as s, Tt as c, V as l, W as u, Y as d, a as f, ct as p, dt as m, f as h, ft as g, gt as _, h as v, it as y, jt as ee, mt as b, nt as x, o as te, pt as S, r as C, s as ne, st as w, t as re, ut as T, v as ie, vt as E, xt as D, y as ae, z as O } from "./index-client-XkLzkVYC.js";
import { d as k, f as A, l as oe, n as j } from "./relayConfigUtils-B4Q_AO1M.js";
import { l as se } from "./postHistoryEventUtils-CP25bUau.js";
import { ht as ce, pt as le, t as ue } from "./LoadingPlaceholder-lit91akO.js";
import { C as de, E as fe, S as M, T as pe, k as me, o as he, r as ge, t as _e, w as ve } from "./nip65RelayDirectory-DWdjnt74.js";
import { $ as ye, c as be, rt as xe, s as Se, t as Ce } from "./appUtils-BRia-Jm6.js";
import { C as we, S as Te, _ as Ee, g as De, h as Oe, r as ke, t as Ae } from "./sensitiveContentPayloadReader-CuX74jfk.js";
import { a as je, i as Me } from "./menu-trigger-TbDvuZD-.js";
import { t as Ne } from "./DialogWrapper-DOH4rn3S.js";
import { t as Pe } from "./dialog-close-erjPpz45.js";
import { i as Fe } from "./keyboardFocusUtils-EFYjXEKy.js";
import { F as Ie, J as Le, M as Re, P as N, Y as ze, et as Be, ut as Ve, x as P, y as He } from "./App-D7-eoDXE.js";
import { D as Ue, E as We, O as Ge, T as Ke, a as qe, c as Je, f as Ye, g as Xe, h as Ze, i as Qe, m as $e, n as et, o as tt, p as nt, r as rt, s as it, t as at } from "./postBroadcastService-DgDo3AL_.js";
import { c as ot, d as st, n as ct, o as lt, t as ut, u as dt } from "./usePostHistoryPostActionUiController.svelte-CyEfesdx.js";
import { t as ft } from "./domSanitizer-B8U0JrXL.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useComposerTargetRelatedPreview.svelte.ts
var pt = 0;
function mt(e) {
	let t = `composer-target-related:${++pt}`, n = e.resolver ?? Ze({
		getShow: e.getShow,
		getRxNostr: e.getRxNostr,
		getRelayConfig: e.getRelayConfig,
		requireFullVerification: !0,
		loadRepostTarget: ot
	}), r = 0, i = E(!1), a = () => y(() => {
		r++, _(i, !1), n.invalidateScope(t), e.resolver || n.reset();
	});
	function o(e, t = !1) {
		let a = r;
		_(i, !1), (t ? n.retryTarget(e) : n.ensureTarget(e)).catch(() => {
			r === a && _(i, !0);
		});
	}
	function s(e) {
		return M(e.event.kind) ? ve(e.event) : he(e.event);
	}
	function c(e) {
		let n = s(e).reference;
		return n ? {
			targetEventId: n.eventId,
			authorHint: n.authorHint,
			relayHints: j.sanitizeExternalRelayUrls([...n.relayHints, ...e.relayHints]),
			sourceEventId: e.event.id,
			relationKind: M(e.event.kind) ? "repost" : "reaction",
			scopeKey: t
		} : null;
	}
	p(() => {
		let t = e.getShow(), n = e.getTarget();
		return e.getRxNostr(), e.getRelayConfig(), e.getPubkey(), y(() => {
			if (a(), t && n && [
				6,
				7,
				16
			].includes(n.event.kind)) {
				let e = c(n);
				e && o(e);
			}
		}), a;
	}), re(a);
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
		if (x(i)) return {
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
		} : M(r.event.kind) ? fe(r.event, c, N) : c?.event && !me(c.event, a.reference) ? {
			...o,
			status: "invalid-target"
		} : c?.event && !N.includes(c.event.kind) ? {
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
var ht = /* @__PURE__ */ new Set([
	"missing-channel-root",
	"invalid-channel-root",
	"conflicting-channel-roots"
]);
function gt(e) {
	return e.some((e) => ht.has(e));
}
function _t(e, t) {
	return F(t.snapshot) ? t.snapshot : e;
}
function vt(e = {}) {
	let t = e.replyQuoteService ?? new P(), n = e.channelCoordinator ?? He, r = e.verifyEventFn ?? ((e) => k(e) && A(e)), i = e.lookupAuthorWriteRelaysFn ? (t, n) => e.lookupAuthorWriteRelaysFn(t) : (e, t) => _e(t).lookup(e).then((e) => e.writeRelays);
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
					let r = new Set(j.sanitizeExternalRelayUrls(e.pointer.relayHints)), i = j.sanitizeExternalRelayUrls(n).filter((e) => !r.has(e));
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
				let _ = j.sanitizeExternalRelayUrls([...g ? [g] : [], ...e.pointer.relayHints], { limit: j.EXTERNAL_INPUT_RELAY_LIMIT }), v = e.profileService ? e.profileService.fetchProfileRealtime(h.pubkey, { additionalRelays: _ }).catch(() => null) : Promise.resolve(null), y = null, ee = null, b = null, x = !1;
				if (h.kind === 40 || h.kind === 42) {
					let t = h.kind === 42 ? se(h) : null, r = h.kind === 40 ? h.id : t?.channelEventId ?? null;
					if (!r || h.kind === 42 && t && gt(t.issues)) return {
						status: "error",
						reason: "channel-unavailable",
						event: h,
						relayHints: _,
						authorProfile: await v
					};
					e.onPhase?.("channel-loading"), s = n.resolveInternal({
						eventId: r,
						relayHints: j.sanitizeExternalRelayUrls([...t?.channelRelayHints ?? [], ..._])
					}, e.rxNostr, e.relayConfig);
					let i = await s.cacheReady, o = await s.refresh;
					if (a) return { status: "cancelled" };
					let c = _t(i, o);
					if (!F(c)) return {
						status: "error",
						reason: "channel-unavailable",
						event: h,
						relayHints: _,
						authorProfile: await v
					};
					y = c.context, x = c.cache?.resolutionQuality === "verified-metadata", b = c.cache?.creatorPubkey ?? null, ee = {
						eventId: r,
						relayHints: [...c.cache?.relayHints ?? []]
					};
				}
				let te = null, S = null;
				if (e.profileService) {
					if (e.onPhase?.("profile-loading"), [te, S] = await Promise.all([v, b && b !== h.pubkey ? e.profileService.fetchProfileRealtime(b, { additionalRelays: ee?.relayHints ?? [] }).catch(() => null) : Promise.resolve(null)]), a) return { status: "cancelled" };
					b === h.pubkey && (S = te);
				}
				return {
					status: "resolved",
					target: {
						event: h,
						relayHints: _,
						fetchedRelayUrl: g,
						authorProfile: te,
						channelContext: y,
						channelCreatorPubkey: b,
						channelCreatorProfile: S,
						channelQuery: ee,
						channelPictureCacheEligible: x
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
var yt = 2e3;
function bt(e) {
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
		let e = oe.decode(n);
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
					relayHints: j.sanitizeExternalRelayUrls(t.relays, { limit: j.EXTERNAL_INPUT_RELAY_LIMIT }),
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
function xt(e, t) {
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
function St(e, t) {
	let n = Array.from(e);
	return n.length <= t ? e : `${n.slice(0, t).join("")}…`;
}
function Ct(e, t = yt) {
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
var wt = r("<div class=\"raw-json-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span>", 1), Tt = r("<div class=\"broadcast-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span>", 1), Et = r("<div class=\"trash-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span>", 1), Dt = r("<!> <!>", 1), Ot = r("<!> <!> <!> <!>", 1), kt = r("<div class=\"xmark-icon svg-icon svelte-19ui8fd\"></div>"), At = r("<p class=\"svelte-19ui8fd\"> </p>"), jt = r("<span class=\"channel-creator svelte-19ui8fd\"> </span>"), Mt = r("<span class=\"channel-relays svelte-19ui8fd\"> </span>"), Nt = r("<div class=\"channel-preview svelte-19ui8fd\"><!> <div class=\"channel-text svelte-19ui8fd\"><strong class=\"channel-name svelte-19ui8fd\"> </strong> <!> <!> <!></div></div>"), Pt = r("<span class=\"interaction-author svelte-19ui8fd\"><!> <span class=\"interaction-author-name svelte-19ui8fd\"> </span></span>"), Ft = r("<div class=\"clear-input-icon svg-icon svelte-19ui8fd\" aria-hidden=\"true\"></div>"), It = r("<div aria-live=\"polite\"><!> <!></div>"), Lt = r("<p class=\"delete-failed svelte-19ui8fd\"> </p>"), Rt = r("<section class=\"composer-target-repost-preview svelte-19ui8fd\"><!> <!></section>"), zt = r("<div class=\"related-channel-row svelte-19ui8fd\"><span> </span> <strong> </strong></div>"), Bt = r("<p class=\"related-interaction-label svelte-19ui8fd\"> </p>"), Vt = r("<p role=\"status\" class=\"svelte-19ui8fd\"> </p> <!>", 1), Ht = r("<section class=\"composer-target-reaction-preview svelte-19ui8fd\"><div class=\"composer-target-reaction-label svelte-19ui8fd\"><div class=\"composer-target-reaction-title svelte-19ui8fd\"><!> <div class=\"composer-target-reaction-symbol favorite-icon svg-icon svelte-19ui8fd\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span></div></div> <!> <!> <!></section>"), Ut = r("<p class=\"interaction-label svelte-19ui8fd\"> </p>"), Wt = r("<span hidden=\"\" aria-hidden=\"true\" class=\"svelte-19ui8fd\"></span>"), Gt = r("<div class=\"post-icon svg-icon\" aria-hidden=\"true\"></div>"), Kt = r("<div class=\"composer-target-channel-action svelte-19ui8fd\"><!></div>"), qt = r("<section class=\"target-preview svelte-19ui8fd\"><div><!> <div class=\"event-author svelte-19ui8fd\"><!> <span class=\"svelte-19ui8fd\"> </span> <span class=\"event-kind svelte-19ui8fd\"> </span></div> <!> <!> <!> <!></div> <!> <!></section>"), Jt = r("<p class=\"unsupported-kind svelte-19ui8fd\"> </p>"), Yt = r("<div class=\"composer-target-content svelte-19ui8fd\"><h2 class=\"svelte-19ui8fd\"> </h2> <label class=\"target-input-label svelte-19ui8fd\" for=\"composer-target-input\"> </label> <div class=\"composer-target-input-shell svelte-19ui8fd\"><input id=\"composer-target-input\" type=\"text\" inputmode=\"text\" autocomplete=\"off\" spellcheck=\"false\" class=\"svelte-19ui8fd\"/> <!></div> <!>  <!> <!></div>"), Xt = r("<div class=\"delete-confirm-body svelte-19ui8fd\"><p class=\"delete-confirm-description svelte-19ui8fd\"> </p> <p class=\"delete-confirm-warning svelte-19ui8fd\"> </p></div>"), Zt = r("<div> </div>"), Qt = r("<!> <!> <!> <!> <!>", 1), $t = {
	hash: "svelte-19ui8fd",
	code: ".xmark-icon.svelte-19ui8fd {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.composer-target-dialog {max-width:560px;}\n\n    @media (max-width: 600px) {.composer-target-dialog {top:0;translate:-50%\n                max(\n                    calc(\n                        var(--mobile-dialog-viewport-top) +\n                            env(safe-area-inset-top, 0px) + 12px\n                    ),\n                    calc(var(--mobile-dialog-center-y) - 50%)\n                );width:calc(100% - 24px);max-height:calc(\n                var(--mobile-dialog-viewport-height) -\n                    env(safe-area-inset-top, 0px) -\n                    env(safe-area-inset-bottom, 0px) -\n                    24px\n            );}.composer-target-dialog .dialog-content {min-height:0;max-height:none;flex:1 1 auto;overflow-y:auto;}.composer-target-dialog .dialog-footer {flex:0 0 auto;}\n    }.composer-target-content.svelte-19ui8fd {display:grid;gap:10px;width:100%;}h2.svelte-19ui8fd {margin:0;font-size:1.25rem;}.target-input-label.svelte-19ui8fd {font-weight:600;}.composer-target-input-shell.svelte-19ui8fd {position:relative;}input.svelte-19ui8fd {width:100%;min-height:50px;padding:8px 49px 8px 10px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text);font:inherit;outline:none;}input.svelte-19ui8fd:focus-visible {outline:2px solid var(--theme);outline-offset:-1px;}.ehagaki-app-root button.composer-target-clear-button {position:absolute;inset-block:50%;inset-inline-end:2px;transform:translateY(-50%);width:46px;height:46px;display:flex;align-items:center;justify-content:center;padding:0;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);z-index:1;}.ehagaki-app-root button.composer-target-clear-button:hover:not(:disabled),\n    .ehagaki-app-root button.composer-target-clear-button:active:not(:disabled),\n    .ehagaki-app-root button.composer-target-clear-button:focus-visible,\n    .ehagaki-app-root button.composer-target-clear-button:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.composer-target-clear-button:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.ehagaki-app-root button.composer-target-related-retry-button {height:auto;min-height:44px;padding:8px 12px;}.composer-target-clear-button .svg-icon {--svg: currentColor;width:24px;height:24px;}.clear-input-icon.svelte-19ui8fd {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.target-status.svelte-19ui8fd p:where(.svelte-19ui8fd),\n    .channel-preview.svelte-19ui8fd p:where(.svelte-19ui8fd),\n    .unsupported-kind.svelte-19ui8fd {margin:0;}.event-kind.svelte-19ui8fd,\n    .channel-creator.svelte-19ui8fd,\n    .channel-relays.svelte-19ui8fd {color:var(--text-muted);font-size:0.85rem;}.target-status.svelte-19ui8fd {display:grid;gap:8px;color:var(--text-muted);}.target-status.error.svelte-19ui8fd {color:var(--danger);}.composer-target-loading {justify-content:flex-start;padding:0;}.target-preview.svelte-19ui8fd {display:grid;min-width:0;border:1px solid var(--border-hr);background:var(--bg-input);}.composer-target-channel-action.svelte-19ui8fd {display:flex;width:100%;justify-content:center;}.target-preview .post-preview-footer {--post-history-preview-footer-surface: var(--bg-input);}.target-preview-body.svelte-19ui8fd {display:grid;min-width:0;gap:10px;padding:12px;}.composer-target-repost-preview.svelte-19ui8fd {min-width:0;}.interaction-label.svelte-19ui8fd {margin:0;font-weight:600;}.interaction-author.svelte-19ui8fd {display:inline-flex;align-items:center;gap:6px;min-width:0;color:var(--text);}.interaction-author-name.svelte-19ui8fd {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.interaction-author .composer-target-avatar {width:24px;height:24px;}.composer-target-repost-preview .post-history-repost-title > span {flex-shrink:0;white-space:nowrap;}.composer-target-repost-preview .post-history-repost-title > .interaction-author {flex-shrink:1;}.composer-target-reaction-preview.svelte-19ui8fd {min-width:0;}.composer-target-reaction-preview.svelte-19ui8fd p:where(.svelte-19ui8fd) {margin:0;}.composer-target-reaction-label.svelte-19ui8fd {display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--btn-post-preview-action);}.composer-target-reaction-title.svelte-19ui8fd {display:flex;align-items:center;gap:6px;min-width:0;padding-left:6px;}.composer-target-reaction-title.svelte-19ui8fd > span:where(.svelte-19ui8fd) {flex-shrink:0;white-space:nowrap;}.composer-target-reaction-title.svelte-19ui8fd > .interaction-author:where(.svelte-19ui8fd) {flex-shrink:1;}.composer-target-reaction-symbol.svelte-19ui8fd {flex-shrink:0;width:22px;height:22px;flex:0 0 22px;--svg: currentColor;mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.related-channel-row.svelte-19ui8fd {display:flex;flex-wrap:wrap;gap:6px;padding:4px 6px;overflow-wrap:anywhere;}.related-interaction-label.svelte-19ui8fd {padding:4px 6px;color:var(--text-muted);}.event-author.svelte-19ui8fd {display:flex;align-items:center;gap:8px;min-width:0;}.event-author.svelte-19ui8fd > span:where(.svelte-19ui8fd):first-of-type {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.event-kind.svelte-19ui8fd {margin-inline-start:auto;white-space:nowrap;}.composer-target-avatar {width:36px;height:36px;flex:0 0 auto;}.composer-target-avatar-image,\n    .composer-target-avatar-fallback {width:100%;height:100%;border-radius:50%;}.target-preview .event-content,\n    .channel-preview.svelte-19ui8fd p:where(.svelte-19ui8fd) {white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}.target-preview .event-content-collapsed {max-height:calc(5 * 1.45em);overflow:hidden;}.channel-preview.svelte-19ui8fd {display:flex;gap:10px;padding-top:10px;border-top:1px solid var(--border-hr);}.target-preview-body.channel-first.svelte-19ui8fd .channel-preview:where(.svelte-19ui8fd) {padding-top:0;border-top:0;}.target-preview-body.channel-first.svelte-19ui8fd .event-author:where(.svelte-19ui8fd) {padding-top:10px;border-top:1px solid var(--border-hr);}.channel-preview .channel-picture {width:48px;height:48px;flex:0 0 auto;object-fit:cover;}.channel-text.svelte-19ui8fd {display:grid;gap:4px;min-width:0;}.channel-name.svelte-19ui8fd {min-width:0;overflow-wrap:anywhere;}.channel-relays.svelte-19ui8fd {white-space:pre-wrap;overflow-wrap:anywhere;}.delete-failed.svelte-19ui8fd {margin:0;color:var(--danger);}.delete-confirm-body.svelte-19ui8fd {display:flex;flex-direction:column;justify-content:center;gap:0.5rem;margin:10px 0 30px;margin-inline:auto;text-align:start;}.delete-confirm-description.svelte-19ui8fd,\n    .delete-confirm-warning.svelte-19ui8fd {margin:0;line-height:1.5;}.delete-confirm-warning.svelte-19ui8fd {color:var(--text-light);font-size:0.875rem;}.target-preview .post-icon {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.post-history-menu-content .menu-action-button .raw-json-icon {mask-image:var(--ehagaki-icon-646174615f6f626a6563745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .broadcast-icon {mask-image:var(--ehagaki-icon-63656c6c5f746f7765725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .trash-icon {mask-image:var(--ehagaki-icon-64656c6574655f666f72657665725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}"
};
function en(r, k) {
	t(k, !0), e(r, $t);
	let A = () => ne(le, "$_", j), oe = () => ne(ce, "$locale", j), [j, se] = te(), fe = (e, t = o) => {
		var r = n(), i = m(r), s = (e) => {
			let r = D(() => A()("common.showActions"));
			{
				let i = (e) => {
					var r = Ot(), i = m(r), o = (e) => {
						$e(e, {
							get pending() {
								return gt();
							},
							onSelect: () => void an(t())
						});
					}, s = D(() => ht() && de(t().kind));
					O(i, (e) => {
						x(s) && e(o);
					});
					var c = S(i, 2);
					a(c, () => je, (e, n) => {
						n(e, {
							class: "menu-action-button",
							onSelect: () => yr(t().rawEvent),
							children: (e, t) => {
								var n = wt(), r = S(m(n), 2), i = g(r, !0);
								w((e) => l(i, e), [() => A()("postHistory.rawJson")]), u(e, n);
							},
							$$slots: { default: !0 }
						});
					});
					var d = S(c, 2), f = (e) => {
						var r = n(), i = m(r);
						{
							let e = D(() => x(vn) === "sending");
							a(i, () => je, (n, r) => {
								r(n, {
									class: "menu-action-button",
									get disabled() {
										return x(e);
									},
									onpointerdown: (e) => br(t(), e),
									onSelect: (e) => void Cr(t(), e),
									children: (e, t) => {
										var n = Tt(), r = S(m(n), 2), i = g(r, !0);
										w((e) => l(i, e), [() => A()("postHistory.broadcast")]), u(e, n);
									},
									$$slots: { default: !0 }
								});
							});
						}
						u(e, r);
					};
					O(d, (e) => {
						x(Nn) && e(f);
					});
					var p = S(d, 2), h = (e) => {
						var n = Dt(), r = m(n);
						a(r, () => Me, (e, t) => {
							t(e, { class: "post-history-menu-separator" });
						});
						var i = S(r, 2);
						{
							let e = D(() => x(U) === "sending");
							a(i, () => je, (n, r) => {
								r(n, {
									class: "menu-action-button menu-action-button-danger",
									get disabled() {
										return x(e);
									},
									onSelect: () => wr(t()),
									children: (e, t) => {
										var n = Et(), r = S(m(n), 2), i = g(r, !0);
										w((e) => l(i, e), [() => x(U) === "sending" ? A()("postHistory.deleteSending") : A()("postHistory.delete")]), u(e, n);
									},
									$$slots: { default: !0 }
								});
							});
						}
						u(e, n);
					};
					O(p, (e) => {
						x(Pn) && e(h);
					}), u(e, r);
				}, o = D(() => H.isPostMenuOpen(t().eventId)), s = D(() => we(t().postedAt, oe()));
				Ye(e, {
					get open() {
						return x(o);
					},
					onOpenChange: (e) => vr(t().eventId, e),
					get triggerAriaLabel() {
						return x(r);
					},
					get tooltipContent() {
						return x(r);
					},
					enableTooltip: !0,
					get timestamp() {
						return x(s);
					},
					items: i,
					$$slots: { items: !0 }
				});
			}
		};
		O(i, (e) => {
			t().eventId === x(Y)?.eventId && e(s);
		}), u(e, r);
	}, M = (e, t = o) => {
		let r = D(() => Hn.getReadModel(t().eventId));
		var i = n(), a = m(i), s = (e) => {
			{
				let n = D(() => x(W) === t().eventId), i = D(() => x(W) === t().eventId ? A()("postHistory.hideReactions") : A()("postHistory.showReactionsWithCount", { values: { count: x(r).totalCount } }));
				lt(e, {
					get count() {
						return x(r).totalCount;
					},
					get expanded() {
						return x(n);
					},
					get ariaLabel() {
						return x(i);
					},
					onToggle: () => _(W, x(W) === t().eventId ? null : t().eventId, !0)
				});
			}
		};
		O(a, (e) => {
			x(r) && x(r).totalCount > 0 && e(s);
		}), u(e, i);
	}, me = (e, t = o) => {
		let r = D(() => Hn.getReadModel(t().eventId));
		var i = n(), a = m(i), s = (e) => {
			Je(e, {
				get readModel() {
					return x(r);
				},
				get emojiLoadStateByUrl() {
					return Q.emojiLoadStateByUrl;
				},
				get emojiImageMetaByUrl() {
					return Q.emojiImageMetaByUrl;
				}
			});
		};
		O(a, (e) => {
			x(r) && x(r).totalCount > 0 && x(W) === t().eventId && e(s);
		}), u(e, i);
	}, he = (e) => {
		var t = n(), r = m(t), i = (e) => {
			var t = Dt(), n = m(t);
			{
				let e = (e) => {
					{
						let t = (e) => {
							M(e, () => x(Y));
						}, n = D(() => x(G).includes("reply") ? () => $("reply") : void 0), r = D(() => x(G).includes("quote") ? () => {
							$("quote");
						} : void 0);
						Ke(e, {
							get post() {
								return x(Y);
							},
							onReactionPost: () => $("reaction"),
							get onReplyPost() {
								return x(n);
							},
							get onQuotePost() {
								return x(r);
							},
							reactionExtras: t,
							$$slots: { reactionExtras: !0 }
						});
					}
				}, t = (e) => {
					fe(e, () => x(Y));
				}, r = D(() => Te(x(Y).postedAt));
				Ge(n, {
					get formattedDate() {
						return x(r);
					},
					actions: e,
					trailing: t,
					$$slots: {
						actions: !0,
						trailing: !0
					}
				});
			}
			var r = S(n, 2);
			me(r, () => x(Y)), u(e, t);
		};
		O(r, (e) => {
			x(Y) && e(i);
		}), u(e, t);
	}, _e = C(k, "initialInput", 3, ""), ve = C(k, "inboundInteractionSave", 3, null), N = C(k, "rxNostr", 3, void 0), P = C(k, "relayConfig", 3, null), He = C(k, "profileService", 3, void 0), ot = C(k, "resolver", 19, vt), pt = C(k, "relatedResolver", 3, void 0), F = C(k, "pubkeyHex", 3, null), ht = C(k, "onRepostPost", 3, void 0), gt = C(k, "repostPending", 3, !1), _t = C(k, "onRetryRepostSave", 3, void 0), yt = C(k, "repostSaveFailure", 3, null), en;
	function tn() {
		return en ??= Ze({
			getShow: () => k.show,
			getRxNostr: () => N(),
			getRelayConfig: () => P()
		});
	}
	let nn = E(null), rn = 0;
	p(() => (k.show, F(), rn++, _(nn, null), () => en?.invalidateScope("composer-repost"))), re(() => en?.reset());
	async function an(e) {
		if (!ht() || gt()) return;
		_(nn, null);
		let t = rn, n = e.eventId, r = await ht()(e, (e, t) => tn().prepareRepostTarget({
			relationKind: "repost",
			scopeKey: "composer-repost",
			targetEventId: e.id,
			authorHint: e.pubkey,
			relayHints: t
		}, e));
		k.show && t === rn && x(z)?.event.id === n && _(nn, r, !0);
	}
	let I = E(""), on = E(null), sn = E(null), L = E("empty"), R = E(null), z = E(null), cn = E(null), ln = E(null), un = E(0), B = 0, V, dn = null, fn = E(b([])), pn = E(-1), mn = E(!1), hn = E(null), H = ut(), gn = E(!1), _n = E(null), vn = E(void 0), U = E(void 0), yn = E(!1), bn = E(0), xn = E(0), Sn = E("postHistory.broadcastSent"), Cn, wn = E(void 0), W = E(null), G = D(() => x(z) ? xt(x(z).event.kind, [1, 1111].includes(x(z).event.kind) || !!x(z).channelQuery) : []), K = D(() => x(z)?.event ?? x(cn)), Tn = mt({
		getShow: () => k.show,
		getTarget: () => x(z),
		getRxNostr: () => N(),
		getRelayConfig: () => P(),
		getPubkey: () => F(),
		resolver: y(() => pt())
	}), q = D(() => Tn.getPreview()), J = D(() => x(z) && [6, 16].includes(x(z).event.kind) ? x(q) : null), En = D(() => x(q)?.status === "resolved" && x(q).event?.kind === 42 ? [pe(x(q).event, x(q).relayHints)] : []), Dn = dt({
		getShow: () => k.show,
		getPosts: () => x(En),
		getRxNostr: () => N(),
		getRelayConfig: () => P(),
		getIsSearchMode: () => !1
	}), On = D(() => x(En)[0] ? Dn.getChannelText(x(En)[0], A()) : null), kn = D(() => x(q)?.event ? [
		6,
		7,
		16
	].includes(x(q).event.kind) ? Ie(x(q).event) : De({
		kind: x(q).event.kind,
		sourceContent: x(q).event.content,
		tags: x(q).event.tags
	}) : null);
	function An(e) {
		return e === 6 ? "repost.entry" : e === 16 ? "composerTarget.genericRepost" : "composerTarget.reaction";
	}
	let jn = D(() => x(q)?.status === "loading" ? "composerTarget.relatedLoading" : x(q)?.status === "deleted" ? "composerTarget.relatedDeleted" : x(q)?.status === "unsupported-reference" || x(q)?.status === "unsupported-target-kind" ? "composerTarget.relatedUnsupported" : x(q)?.status === "invalid-reference" || x(q)?.status === "invalid-target" || x(q)?.status === "outer-target-kind-mismatch" ? "composerTarget.relatedInvalid" : "composerTarget.relatedMissing"), Mn = D(() => x(K) ? x(K).created_at * 1e3 : 0), Y = D(() => x(z) ? _r(x(z)) : null), Nn = D(() => x(Y) ? et(x(Y)) !== null : !1), Pn = D(() => x(Y) ? rt(x(Y), F()) : !1), X = D(() => x(z)?.authorProfile ?? x(ln)), Fn = D(() => {
		let e = x(K)?.pubkey;
		return e ? x(X)?.displayName?.trim() || x(X)?.name?.trim() || ye(e) : "";
	}), In = D(() => !x(K) || [
		6,
		7,
		16,
		40
	].includes(x(K).kind) ? "" : Ee(x(K).content, x(K).tags)), Ln = D(() => Ct(x(In))), Rn = D(() => x(K) && x(In) ? [{
		eventId: x(K).id,
		content: x(Ln).content,
		forceCollapsible: x(Ln).exceedsRenderLimit
	}] : []), zn = qe({
		getShow: () => k.show,
		getPosts: () => x(Rn),
		getContainer: () => x(sn)
	}), Bn = Xe({
		getShow: () => k.show,
		getRxNostr: () => N()
	}), Vn = D(() => {
		let e = x(z) && ge(x(z).event.kind) ? [{
			eventId: x(z).event.id,
			relayHints: [...x(z).relayHints],
			targetAuthorPubkey: x(z).event.pubkey,
			targetKind: x(z).event.kind
		}] : [];
		return x(q)?.status === "resolved" && x(q).event && ge(x(q).event.kind) && e.push({
			eventId: x(q).event.id,
			relayHints: [...x(q).relayHints],
			targetAuthorPubkey: x(q).event.pubkey,
			targetKind: x(q).event.kind
		}), e;
	}), Hn = ct({
		getShow: () => k.show,
		getPubkeyHex: () => F(),
		getRxNostr: () => N(),
		getRelayConfig: () => P(),
		getTargets: () => x(Vn),
		profileSync: Bn,
		source: "composer-target-display"
	}), Z = D(() => x(z) && ge(x(z).event.kind) ? Hn.getReadModel(x(z).event.id) : null), Un = D(() => !!x(z) && x(W) === x(z).event.id), Wn = null;
	p(() => {
		let e = k.show && x(z) && ge(x(z).event.kind) ? x(z).event.id : null;
		e !== Wn && (Wn = e, _(W, null), Bn.reset());
	});
	function Gn() {
		x(z) && x(Z)?.totalCount && _(W, x(Un) ? null : x(z).event.id, !0);
	}
	function Kn(e) {
		return x(Un) ? A()("postHistory.hideReactions") : A()("postHistory.showReactionsWithCount", { values: { count: e } });
	}
	let qn = zn.previewRef, Jn = D(() => x(Rn)[0]), Yn = D(() => x(Jn) ? zn.isPostExpanded(x(Jn)) : !1), Xn = D(() => x(Yn) ? x(In) : x(Ln).content), Zn = D(() => x(K) && [
		6,
		7,
		16
	].includes(x(K).kind) ? Ie(x(K)) : x(K)?.kind === 40 ? De({
		sourceContent: "",
		displayContent: "",
		tags: [],
		kind: x(K)?.kind,
		media: []
	}) : De({
		sourceContent: x(In),
		kind: x(K)?.kind,
		tags: x(K)?.tags ?? []
	})), Qn = D(() => x(Xn) === x(In) ? x(Zn) : De({
		sourceContent: x(In),
		kind: x(K)?.kind,
		displayContent: x(Zn).hasRenderableText ? x(Xn) : "",
		tags: x(K)?.tags ?? [],
		media: x(Zn).media
	})), $n = D(() => {
		let e = new Set(x(Qn).previewContent.emojiUrls);
		for (let t of x(kn)?.previewContent.emojiUrls ?? []) e.add(t);
		if (x(W)) for (let t of Hn.getReadModel(x(W))?.groups ?? []) t.emojiUrl && e.add(t.emojiUrl);
		return [...e];
	}), er = D(() => x(Zn).hasRenderableText), tr = D(() => !!x(Jn) && x(er) && zn.shouldCollapsePost(x(Jn))), nr = D(() => x(K) ? `composer-target-preview-content-${x(K).id}` : ""), rr = D(() => {
		let e = x(z)?.channelContext?.about;
		return e ? St(ft(e), 200) : "";
	}), ir = D(() => {
		let e = x(z)?.channelContext;
		return e ? e.name?.trim() || `ID: ${xe(e.eventId, 12, 8)}` : "";
	}), ar = D(() => {
		let e = x(z)?.channelCreatorPubkey;
		return e ? x(z)?.channelCreatorProfile?.displayName?.trim() || x(z)?.channelCreatorProfile?.name?.trim() || ye(e) : "";
	}), or = D(pr), sr = D(() => x(R) === "not-found" || x(R) === "timeout" || x(R) === "network" || x(R) === "channel-unavailable" || x(R) === "nostr-not-ready"), cr = D(() => x(L) === "debouncing" || x(L) === "event-loading" || x(L) === "channel-loading" || x(L) === "profile-loading"), Q = ke({
		getShow: () => k.show && x($n).length > 0,
		getEmojiUrls: () => x($n),
		onStateChanged: () => zn.remeasure()
	});
	function lr() {
		V !== void 0 && (clearTimeout(V), V = void 0), dn?.cancel(), dn = null;
	}
	function ur() {
		Cn !== void 0 && (clearTimeout(Cn), Cn = void 0), _(yn, !1), _(wn, void 0);
	}
	function dr() {
		en?.reset(), en = void 0, rn++, _(nn, null), H.reset(), _(gn, !1), _(_n, null), _(vn, void 0), _(U, void 0), ur();
	}
	function fr() {
		B += 1, lr(), _(I, ""), _(L, "empty"), _(R, null), _(z, null), _(cn, null), _(ln, null), _(un, 0), _(W, null), Bn.reset(), dr(), Q.resetState(), _(fn, [], !0), _(pn, -1), _(mn, !1), _(hn, null);
	}
	function pr() {
		return x(L) === "parsing" ? A()("composerTarget.parsing") : x(L) === "debouncing" || x(L) === "event-loading" ? A()("composerTarget.checking") : x(L) === "channel-loading" ? A()("composerTarget.channelLoading") : x(L) === "profile-loading" ? A()("composerTarget.profileLoading") : x(R) ? x(R) === "unsupported" ? A()("composerTarget.unsupportedFormat") : x(R) === "secret-key" ? A()("composerTarget.secretKey") : x(R) === "invalid" ? A()("composerTarget.invalidFormat") : x(R) === "not-found" ? A()("composerTarget.notFound") : x(R) === "timeout" ? A()("composerTarget.timeout") : x(R) === "mismatch" ? A()("composerTarget.mismatch") : x(R) === "channel-unavailable" ? A()("composerTarget.channelUnavailable") : A()("composerTarget.fetchFailed") : "";
	}
	async function mr(e, t) {
		if (!N()) {
			B === t && (_(L, "error"), _(R, "nostr-not-ready"));
			return;
		}
		dn = ot().resolve({
			pointer: e,
			rxNostr: N(),
			relayConfig: P(),
			profileService: He(),
			onPhase: (e) => {
				B === t && _(L, e, !0);
			}
		});
		let n = await dn.promise;
		B === t && n.status !== "cancelled" && (dn = null, n.status === "resolved" ? (_(z, n.target, !0), _(cn, null), _(ln, null), _(L, "ready"), _(R, null)) : (_(cn, n.event ?? null, !0), _(ln, n.authorProfile ?? null, !0), _(L, "error"), _(R, n.reason, !0)));
	}
	function hr() {
		_(un, x(un) + 1);
	}
	async function $(e) {
		if (!x(z)) return !1;
		let t = x(z), n = B, r = await k.onApply(e, {
			source: "manual",
			kind: x(z).event.kind,
			eventId: x(z).event.id,
			relayHints: [...x(z).fetchedRelayUrl ? [x(z).fetchedRelayUrl] : [], ...x(z).relayHints],
			authorPubkey: x(z).event.pubkey,
			event: x(z).event,
			channelQuery: x(z).channelQuery,
			isCurrent: () => k.show && B === n && x(z) === t
		});
		return r && k.show && x(z) === t && B === n && Dr(), r;
	}
	async function gr(e) {
		let t = B, n = x(z), r = await k.onApply("reaction", {
			...Re(e),
			source: "manual",
			relayHints: [
				...e.fetchedRelays ?? [],
				...e.acceptedRelays,
				...e.relayHints
			],
			isCurrent: () => k.show && B === t && x(z) === n
		});
		return r && k.show && B === t && x(z) === n && Dr(), r;
	}
	p(() => {
		let e = ve();
		k.show && e?.revision && Hn.refreshCachedReactions(e.parentEventIds).catch(() => void 0);
	});
	function _r(e) {
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
	function vr(e, t) {
		t && H.closeAllPostItemMenus(), H.setPostMenuOpen(e, t);
	}
	function yr(e) {
		H.closeAllPostItemMenus(), _(_n, e, !0), _(gn, !0);
	}
	function br(e, t) {
		_(wn, {
			eventId: e.eventId,
			...Ce(t.clientX, t.clientY)
		}, !0);
	}
	function xr(e, t) {
		if (x(wn)?.eventId === e.eventId) return {
			x: x(wn).x,
			y: x(wn).y
		};
		let n = t.currentTarget, r = n instanceof HTMLElement ? n.getBoundingClientRect() : null;
		return Ce(r ? r.left + r.width / 2 : 0, r ? r.bottom + 8 : 0);
	}
	function Sr(e, t) {
		ur(), _(bn, e.x, !0), _(xn, e.y, !0), _(Sn, t.success ? "postHistory.broadcastSent" : "postHistory.broadcastFailed", !0), _(yn, !0), Cn = setTimeout(() => {
			_(yn, !1), Cn = void 0;
		}, 1800);
	}
	async function Cr(e, t) {
		if (x(vn) === "sending") return;
		let n = B, r = e.eventId, i = xr(e, t);
		_(vn, "sending");
		let a = await at.broadcast({
			post: e,
			rxNostr: N()
		});
		B === n && x(z)?.event.id === r && (_(vn, void 0), Sr(i, a));
	}
	function wr(e) {
		rt(e, F()) && H.openDeleteConfirm(e);
	}
	function Tr() {
		H.cancelDeleteConfirm();
	}
	async function Er() {
		let e = H.deleteTargetPost;
		if (!e || x(U) === "sending") return;
		let t = B, n = e.eventId;
		_(U, "sending");
		let r = await Qe.requestDeletion({
			post: e,
			rxNostr: N()
		});
		B === t && x(z)?.event.id === n && (H.setDeleteConfirmOpen(!1), r.success ? (_(U, void 0), Dr()) : _(U, "failed"));
	}
	function Dr() {
		fr(), k.onClose();
	}
	function Or() {
		x(I).trim().length !== 0 && (_(I, ""), x(on)?.focus({ preventScroll: !0 }));
	}
	function kr(e) {
		e.preventDefault(), x(on)?.focus({ preventScroll: !0 });
	}
	function Ar(e) {
		return e instanceof Element && e.closest(".ehagaki-pswp") !== null;
	}
	function jr(e) {
		Ar(e.target) && e.preventDefault();
	}
	function Mr(e) {
		x(mn) && e.preventDefault();
	}
	function Nr(e) {
		_(fn, e.mediaList, !0), _(pn, e.index, !0), _(hn, e.focusOrigin, !0), _(mn, !0);
	}
	function Pr() {
		_(mn, !1), _(fn, [], !0), _(pn, -1), _(hn, null);
	}
	function Fr(e) {
		_(pn, e, !0);
	}
	p(() => {
		let e = _e();
		k.show && y(() => _(I, e, !0));
	}), p(() => {
		k.show || fr();
	}), p(() => {
		if (!k.show) return;
		let e = x(I);
		x(un);
		let t = ++B;
		lr(), dr(), _(z, null), _(cn, null), _(ln, null), _(R, null), _(L, "parsing");
		let n = bt(e);
		if (n.status === "empty") {
			_(L, "empty");
			return;
		}
		if (n.status === "unsupported") {
			_(L, "error"), _(R, "unsupported");
			return;
		}
		if (n.status === "secret-key") {
			_(L, "error"), _(R, "secret-key");
			return;
		}
		if (n.status === "invalid") {
			_(L, "error"), _(R, "invalid");
			return;
		}
		let r = n.pointer;
		return _(L, "debouncing"), V = setTimeout(() => {
			V = void 0, mr(r, t);
		}, 250), () => {
			V !== void 0 && (clearTimeout(V), V = void 0);
		};
	}), re(() => {
		B += 1, lr(), ur(), Bn.dispose();
	});
	var Ir = Qt(), Lr = m(Ir);
	{
		let e = (e) => {
			var t = Dt(), n = m(t);
			nt(n, {
				get result() {
					return x(nn);
				},
				get saveFailure() {
					return yt();
				},
				get pending() {
					return gt();
				},
				get onRetrySave() {
					return _t();
				}
			});
			var r = S(n, 2);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = D(() => A()("global.close"));
						Se(e, f(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return x(t);
							},
							children: (e, t) => {
								var n = kt();
								w((e) => ae(n, "aria-label", e), [() => A()("global.close")]), u(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				a(r, () => Pe, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			u(e, t);
		}, t = D(() => A()("composerTarget.title")), r = D(() => A()("composerTarget.description"));
		Ne(Lr, {
			get open() {
				return k.show;
			},
			onOpenChange: (e) => !e && Dr(),
			get title() {
				return x(t);
			},
			get description() {
				return x(r);
			},
			contentClass: "composer-target-dialog",
			footerVariant: "close-button",
			onOpenAutoFocus: kr,
			onInteractOutside: jr,
			onEscapeKeydown: Mr,
			footer: e,
			children: (e, t) => {
				var r = Yt();
				{
					let e = (e) => {
						var t = Nt(), n = T(t), r = (e) => {
							ze(e, {
								get eventId() {
									return x(z).channelContext.eventId;
								},
								get pictureUrl() {
									return x(z).channelContext.picture;
								},
								get cacheEligible() {
									return x(z).channelPictureCacheEligible;
								},
								alt: "",
								className: "channel-picture"
							});
						};
						O(n, (e) => {
							x(z)?.channelContext?.picture && e(r);
						});
						var a = S(n, 2), o = T(a), s = g(o, !0), c = S(o, 2), d = (e) => {
							var t = At(), n = g(t, !0);
							w(() => l(n, x(rr))), u(e, t);
						};
						O(c, (e) => {
							x(rr) && e(d);
						});
						var f = S(c, 2), p = (e) => {
							var t = jt(), n = g(t);
							w((e) => l(n, `${e ?? ""}: ${x(ar) ?? ""}`), [() => A()("composerTarget.creator")]), u(e, t);
						};
						O(f, (e) => {
							x(ar) && e(p);
						});
						var m = S(f, 2), h = (e) => {
							var t = Mt(), n = g(t, !0);
							w((e) => l(n, e), [() => x(z).channelContext.channelRelays.join("\n")]), u(e, t);
						};
						O(m, (e) => {
							x(z)?.channelContext?.channelRelays?.length && e(h);
						}), i(a), i(t), w(() => l(s, x(ir))), u(e, t);
					}, t = (e) => {
						var t = Pt(), n = T(t);
						{
							let e = D(() => x(K)?.pubkey ?? ""), t = D(() => x(X)?.displayName), r = D(() => x(X)?.name), i = D(() => x(X)?.picture ?? "");
							Be(n, {
								get pubkeyHex() {
									return x(e);
								},
								get displayName() {
									return x(t);
								},
								get name() {
									return x(r);
								},
								get src() {
									return x(i);
								},
								alt: "",
								rootClassName: "composer-target-avatar",
								imageClassName: "composer-target-avatar-image",
								fallbackClassName: "composer-target-avatar-fallback",
								fallbackAriaLabel: ""
							});
						}
						var r = S(n, 2), a = g(r, !0);
						i(t), w(() => l(a, x(Fn))), u(e, t);
					};
					var a = T(r), o = g(a, !0), c = S(a, 2), f = g(c, !0), p = S(c, 2), y = T(p);
					ie(y), h(y, (e) => _(on, e), () => x(on));
					var b = S(y, 2), te = (e) => {
						{
							let t = D(() => A()("composerTarget.clearInput"));
							Se(e, {
								type: "button",
								className: "composer-target-clear-button",
								variant: "default",
								shape: "square",
								contentLayout: "icon",
								get ariaLabel() {
									return x(t);
								},
								onClick: Or,
								get onmousedown() {
									return Fe;
								},
								get ontouchstart() {
									return Fe;
								},
								children: (e, t) => {
									var n = Ft();
									u(e, n);
								},
								$$slots: { default: !0 }
							});
						}
					}, C = D(() => x(I).trim().length > 0);
					O(b, (e) => {
						x(C) && e(te);
					}), i(p);
					var ne = S(p, 2), re = (e) => {
						var t = It();
						let n;
						var r = T(t), a = (e) => {
							ue(e, {
								showLoader: !0,
								get text() {
									return x(or);
								},
								customClass: "composer-target-loading"
							});
						}, o = (e) => {
							var t = At(), n = g(t, !0);
							w(() => l(n, x(or))), u(e, t);
						};
						O(r, (e) => {
							x(cr) ? e(a) : e(o, -1);
						});
						var c = S(r, 2), f = (e) => {
							Se(e, {
								onClick: hr,
								children: (e, t) => {
									ee();
									var n = d();
									w((e) => l(n, e), [() => A()("postHistory.contextRetry")]), u(e, n);
								},
								$$slots: { default: !0 }
							});
						};
						O(c, (e) => {
							x(sr) && e(f);
						}), i(t), w(() => n = s(t, 1, "target-status svelte-19ui8fd", null, n, { error: x(L) === "error" })), u(e, t);
					};
					O(ne, (e) => {
						x(or) && e(re);
					});
					var E = S(ne, 2), k = (e) => {
						var n = Rt(), r = T(n);
						{
							let e = D(() => x(kn) ?? void 0), n = D(() => x(J).event && [
								6,
								7,
								16
							].includes(x(J).event.kind) ? A()(An(x(J).event.kind)) : null), i = D(() => x(J).event ? Ae({
								ownerPubkey: F(),
								structure: x(J).event,
								relayHints: x(J).relayHints,
								rxNostr: N(),
								relayConfig: P()
							}) : void 0);
							st(r, {
								get post() {
									return x(Y);
								},
								onReactionPost: (e) => e.eventId === x(Y)?.eventId ? $("reaction") : gr(e),
								get reactionExtras() {
									return M;
								},
								get reactionDetails() {
									return me;
								},
								get preview() {
									return x(J);
								},
								get author() {
									return t;
								},
								get footerMenu() {
									return fe;
								},
								get channelText() {
									return x(On);
								},
								get model() {
									return x(e);
								},
								get targetLabel() {
									return x(n);
								},
								get onRetry() {
									return Tn.retry;
								},
								onImageOpen: (e) => Nr({
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
									return x(i);
								}
							});
						}
						var a = S(r, 2), o = (e) => {
							var t = Lt(), n = g(t, !0);
							w((e) => l(n, e), [() => A()("postHistory.deleteFailed")]), u(e, t);
						};
						O(a, (e) => {
							x(U) === "failed" && e(o);
						}), i(n), w((e) => ae(n, "aria-label", e), [() => A()("composerTarget.preview")]), u(e, n);
					}, oe = (e) => {
						var r = Ht(), a = T(r), o = T(a), s = T(o);
						t(s);
						var c = S(s, 4), f = g(c, !0);
						i(o), i(a);
						var p = S(a, 2), h = (e) => {
							let t = D(() => x(q).event);
							{
								let r = (e) => {
									var r = n(), a = m(r), o = (e) => {
										var t = zt(), n = T(t), r = g(n, !0), a = S(n, 2), o = g(a, !0);
										i(t), w((e) => {
											l(r, e), l(o, x(On));
										}, [() => A()("postHistory.channel")]), u(e, t);
									}, s = (e) => {
										var n = Bt(), r = g(n, !0);
										w((e) => l(r, e), [() => A()(An(x(t).kind))]), u(e, n);
									}, c = D(() => [
										6,
										7,
										16
									].includes(x(t).kind));
									O(a, (e) => {
										x(On) ? e(o) : x(c) && e(s, 1);
									}), u(e, r);
								}, a = (e) => {
									{
										let n = (e) => {
											{
												let n = D(() => pe(x(t), x(q).relayHints));
												M(e, () => x(n));
											}
										}, r = D(() => pe(x(t), x(q).relayHints));
										Ke(e, {
											get post() {
												return x(r);
											},
											onReactionPost: gr,
											reactionExtras: n,
											$$slots: { reactionExtras: !0 }
										});
									}
								}, o = (e) => {
									{
										let n = D(() => pe(x(t), x(q).relayHints));
										me(e, () => x(n));
									}
								}, s = D(() => Ae({
									ownerPubkey: F(),
									structure: x(t),
									relayHints: x(q).relayHints,
									rxNostr: N(),
									relayConfig: P()
								}));
								Ue(e, {
									get event() {
										return x(t);
									},
									get profile() {
										return x(q).profile;
									},
									get model() {
										return x(kn);
									},
									onImageOpen: (e) => Nr({
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
										return x(s);
									},
									topActions: r,
									footerActions: a,
									footerDetails: o,
									$$slots: {
										topActions: !0,
										footerActions: !0,
										footerDetails: !0
									}
								});
							}
						}, _ = (e) => {
							var t = Vt(), n = m(t), r = g(n, !0), i = S(n, 2), a = (e) => {
								Se(e, {
									className: "composer-target-related-retry-button",
									get onClick() {
										return Tn.retry;
									},
									children: (e, t) => {
										ee();
										var n = d();
										w((e) => l(n, e), [() => A()("postHistory.contextRetry")]), u(e, n);
									},
									$$slots: { default: !0 }
								});
							}, o = D(() => [
								"not-found",
								"error",
								"invalid-target"
							].includes(x(q).status));
							O(i, (e) => {
								x(o) && e(a);
							}), w((e) => l(r, e), [() => A()(x(jn))]), u(e, t);
						};
						O(p, (e) => {
							x(q).status === "resolved" && x(q).event && x(kn) ? e(h) : e(_, -1);
						});
						var v = S(p, 2), y = (e) => {
							var t = Lt(), n = g(t, !0);
							w((e) => l(n, e), [() => A()("postHistory.deleteFailed")]), u(e, t);
						};
						O(v, (e) => {
							x(U) === "failed" && e(y);
						});
						var b = S(v, 2);
						he(b), i(r), w((e, t) => {
							ae(r, "aria-label", e), ae(r, "data-reaction-event-id", x(z).event.id), l(f, t);
						}, [() => A()("composerTarget.preview"), () => A()("composerTarget.reaction")]), u(e, r);
					}, j = (t) => {
						var r = qt(), a = T(r);
						let o;
						var c = T(a), d = (t) => {
							e(t);
						};
						O(c, (e) => {
							x(K).kind === 42 && x(z)?.channelContext && e(d);
						});
						var f = S(c, 2), p = T(f);
						{
							let e = D(() => x(K)?.pubkey ?? ""), t = D(() => x(X)?.displayName), n = D(() => x(X)?.name), r = D(() => x(X)?.picture ?? "");
							Be(p, {
								get pubkeyHex() {
									return x(e);
								},
								get displayName() {
									return x(t);
								},
								get name() {
									return x(n);
								},
								get src() {
									return x(r);
								},
								alt: "",
								rootClassName: "composer-target-avatar",
								imageClassName: "composer-target-avatar-image",
								fallbackClassName: "composer-target-avatar-fallback",
								fallbackAriaLabel: ""
							});
						}
						var v = S(p, 2), y = g(v, !0), ee = S(v, 2), b = g(ee);
						i(f);
						var te = S(f, 2), C = (e) => {
							var t = Ut(), n = g(t, !0);
							w((e) => l(n, e), [() => A()(An(x(K).kind))]), u(e, t);
						}, ne = D(() => [
							6,
							7,
							16
						].includes(x(K).kind));
						O(te, (e) => {
							x(ne) && e(C);
						});
						var re = S(te, 2);
						{
							let e = (e) => {
								var t = n(), r = m(t), i = (e) => {
									var t = Dt(), n = m(t), r = (e) => {
										var t = Wt();
										w(() => ae(t, "id", x(nr))), u(e, t);
									};
									O(n, (e) => {
										x(Qn).hasRenderableText || e(r);
									});
									var i = S(n, 2);
									tt(i, {
										get expanded() {
											return x(Yn);
										},
										get controls() {
											return x(nr);
										},
										onToggle: () => zn.togglePostExpanded(x(Jn).eventId)
									}), u(e, t);
								};
								O(r, (e) => {
									x(Jn) && x(tr) && e(i);
								}), u(e, t);
							}, t = D(() => Ae({
								ownerPubkey: F(),
								structure: x(K),
								relayHints: x(z)?.relayHints,
								rxNostr: N(),
								relayConfig: P()
							})), r = D(() => x(Qn).hasRenderableText && !x(Yn) && x(tr));
							Oe(re, {
								get model() {
									return x(Qn);
								},
								get loadSensitiveBody() {
									return x(t);
								},
								get contentWarningEventId() {
									return x(K).id;
								},
								density: "dialog",
								get emojiLoadStateByUrl() {
									return Q.emojiLoadStateByUrl;
								},
								get emojiImageMetaByUrl() {
									return Q.emojiImageMetaByUrl;
								},
								get previewContentId() {
									return x(nr);
								},
								contentClass: "event-content",
								collapsedContentClass: "event-content-collapsed",
								get renderWhenEmpty() {
									return x(tr);
								},
								get isTextCollapsed() {
									return x(r);
								},
								get previewCollapseAction() {
									return qn;
								},
								get previewCollapseEventId() {
									return x(K).id;
								},
								onImageOpen: Nr,
								betweenContentAndMedia: e,
								$$slots: { betweenContentAndMedia: !0 }
							});
						}
						var ie = S(re, 2), E = (t) => {
							e(t);
						};
						O(ie, (e) => {
							x(K).kind !== 42 && x(z)?.channelContext && e(E);
						});
						var k = S(ie, 2), oe = (e) => {
							var t = Lt(), n = g(t, !0);
							w((e) => l(n, e), [() => A()("postHistory.deleteFailed")]), u(e, t);
						};
						O(k, (e) => {
							x(U) === "failed" && x(z) && e(oe);
						}), i(a);
						var j = S(a, 2);
						{
							let e = (e) => {
								var t = n(), r = m(t), a = (e) => {
									var t = n(), r = m(t), a = (e) => {
										var t = n(), r = m(t), i = (e) => {
											{
												let t = (e) => {
													var t = n(), r = m(t), i = (e) => {
														{
															let t = D(() => Kn(x(Z).totalCount));
															lt(e, {
																get count() {
																	return x(Z).totalCount;
																},
																get expanded() {
																	return x(Un);
																},
																get ariaLabel() {
																	return x(t);
																},
																onToggle: Gn
															});
														}
													};
													O(r, (e) => {
														x(Z) && x(Z).totalCount > 0 && e(i);
													}), u(e, t);
												}, r = D(() => x(G).includes("reply") ? () => $("reply") : void 0), i = D(() => x(G).includes("quote") ? () => $("quote") : void 0);
												Ke(e, {
													onReactionPost: () => $("reaction"),
													get post() {
														return x(Y);
													},
													get onReplyPost() {
														return x(r);
													},
													get onQuotePost() {
														return x(i);
													},
													reactionExtras: t,
													$$slots: { reactionExtras: !0 }
												});
											}
										};
										O(r, (e) => {
											x(Y) && e(i);
										}), u(e, t);
									}, o = D(() => x(G).includes("reply") || x(G).includes("quote")), s = (e) => {
										Ke(e, {
											get post() {
												return x(Y);
											},
											onReactionPost: () => $("reaction"),
											reactionExtras: (e) => {
												M(e, () => x(Y));
											},
											$$slots: { reactionExtras: !0 }
										});
									}, c = D(() => x(G).includes("reaction") && x(Y)), l = (e) => {
										var t = Kt(), n = T(t);
										{
											let e = D(() => A()("composerTarget.post")), t = D(() => A()("composerTarget.post"));
											We(n, {
												type: "button",
												className: "post-preview-action-button post-history-action-button",
												get ariaLabel() {
													return x(e);
												},
												contentLayout: "icon",
												shape: "circle",
												onClick: () => $("channel"),
												get tooltipContent() {
													return x(t);
												},
												children: (e, t) => {
													var n = Gt();
													u(e, n);
												},
												$$slots: { default: !0 }
											});
										}
										i(t), u(e, t);
									}, d = D(() => x(G).includes("channel"));
									O(r, (e) => {
										x(o) ? e(a) : x(c) ? e(s, 1) : x(d) && e(l, 2);
									}), u(e, t);
								};
								O(r, (e) => {
									x(z) && e(a);
								}), u(e, t);
							}, t = (e) => {
								var t = n(), r = m(t), i = (e) => {
									fe(e, () => x(Y));
								};
								O(r, (e) => {
									x(Y) && e(i);
								}), u(e, t);
							}, r = D(() => Te(x(Mn)));
							Ge(j, {
								get formattedDate() {
									return x(r);
								},
								actions: e,
								trailing: t,
								$$slots: {
									actions: !0,
									trailing: !0
								}
							});
						}
						var se = S(j, 2), ce = (e) => {
							Je(e, {
								get readModel() {
									return x(Z);
								},
								get emojiLoadStateByUrl() {
									return Q.emojiLoadStateByUrl;
								},
								get emojiImageMetaByUrl() {
									return Q.emojiImageMetaByUrl;
								}
							});
						};
						O(se, (e) => {
							x(Z) && x(Z).totalCount > 0 && x(Un) && e(ce);
						}), i(r), h(r, (e) => _(sn, e), () => x(sn)), w((e) => {
							ae(r, "aria-label", e), o = s(a, 1, "target-preview-body svelte-19ui8fd", null, o, { "channel-first": x(K).kind === 42 && !!x(z)?.channelContext }), l(y, x(Fn)), l(b, `kind ${x(K).kind ?? ""}`);
						}, [() => A()("composerTarget.preview")]), u(t, r);
					};
					O(E, (e) => {
						x(J) && x(Y) ? e(k) : x(q) && x(z)?.event.kind === 7 && x(Y) ? e(oe, 1) : x(K) && e(j, 2);
					});
					var se = S(E, 2), ce = (e) => {
						var t = Jt(), n = g(t, !0);
						w((e) => l(n, e), [() => A()("composerTarget.unsupportedKind")]), u(e, t);
					};
					O(se, (e) => {
						x(z) && x(G).length === 0 && !x(q) && e(ce);
					}), i(r), w((e, t, n) => {
						l(o, e), l(f, t), ae(y, "placeholder", n);
					}, [
						() => A()("composerTarget.title"),
						() => A()("composerTarget.inputLabel"),
						() => A()("composerTarget.placeholder")
					]), v(y, () => x(I), (e) => _(I, e));
				}
				u(e, r);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var Rr = S(Lr, 2);
	it(Rr, {
		get open() {
			return x(gn);
		},
		get rawEvent() {
			return x(_n);
		},
		onOpenChange: (e) => _(gn, e, !0)
	});
	var zr = S(Rr, 2);
	{
		let e = (e) => {
			var t = Xt(), n = T(t), r = g(n, !0), a = S(n, 2), o = g(a, !0);
			i(t), w((e, t) => {
				l(r, e), l(o, t);
			}, [() => A()("postHistory.deleteRequestDescription"), () => A()("postHistory.deleteRequestWarning")]), u(e, t);
		}, t = D(() => A()("postHistory.deleteRequestTitle")), n = D(() => A()("postHistory.deleteRequestDescription")), r = D(() => x(U) === "sending" ? A()("postHistory.deleteSending") : A()("postHistory.deleteConfirm")), a = D(() => A()("postHistory.deleteCancel")), o = D(() => x(U) === "sending");
		Ve(zr, {
			get open() {
				return H.deleteConfirmOpen;
			},
			get onOpenChange() {
				return H.setDeleteConfirmOpen;
			},
			get title() {
				return x(t);
			},
			get description() {
				return x(n);
			},
			get confirmLabel() {
				return x(r);
			},
			get cancelLabel() {
				return x(a);
			},
			confirmVariant: "danger",
			get confirmDisabled() {
				return x(o);
			},
			onConfirm: Er,
			onCancel: Tr,
			contentClass: "post-history-delete-confirm",
			children: e,
			$$slots: { default: !0 }
		});
	}
	var Br = S(zr, 2);
	{
		let e = D(() => x(fn)[x(pn)]?.src ?? ""), t = D(() => x(fn)[x(pn)]?.alt ?? "");
		Le(Br, {
			get src() {
				return x(e);
			},
			get alt() {
				return x(t);
			},
			onClose: Pr,
			get mediaList() {
				return x(fn);
			},
			get currentIndex() {
				return x(pn);
			},
			onNavigate: Fr,
			get openingFocusOrigin() {
				return x(hn);
			},
			get show() {
				return x(mn);
			},
			set show(e) {
				_(mn, e, !0);
			}
		});
	}
	var Vr = S(Br, 2);
	be(Vr, {
		get show() {
			return x(yn);
		},
		get x() {
			return x(bn);
		},
		get y() {
			return x(xn);
		},
		children: (e, t) => {
			var n = Zt(), r = g(n, !0);
			w((e) => l(r, e), [() => A()(x(Sn))]), u(e, n);
		},
		$$slots: { default: !0 }
	}), u(r, Ir), c(), se();
}
export { en as default };
