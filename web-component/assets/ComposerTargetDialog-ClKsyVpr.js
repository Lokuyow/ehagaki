import { B as e, Dt as t, E as n, Et as r, G as i, H as a, K as o, Mt as s, Nt as c, P as l, Pt as u, St as d, X as f, _t as p, a as m, at as h, b as g, ct as _, dt as v, f as ee, ft as y, h as b, ht as te, j as x, lt as S, mt as C, o as ne, pt as w, q as T, r as E, rt as D, s as re, t as ie, y as ae, yt as O } from "./index-client-DEFG3Gqk.js";
import { a as k, c as A, s as oe } from "./esm-N9TTQGcl.js";
import { n as j } from "./relayConfigUtils-56ujWwKF.js";
import { l as se } from "./postHistoryEventUtils-iuP8QpIA.js";
import { $ as ce, Z as le, t as ue } from "./LoadingPlaceholder-YrD8D_td.js";
import { S as de, _ as fe, g as pe, h as me, v as he, y as ge } from "./postHistoryRepository-Bu2z041i.js";
import { t as _e } from "./appUtils-B3-zUpkb.js";
import { C as ve, g as ye } from "./clipboardUtils-CSGkJuUA.js";
import { t as be } from "./nip65RelayDirectory-B7gmBLn_.js";
import { n as xe, t as Se } from "./Button-Cqrg0_jX.js";
import { E as Ce, d as we, f as Te, p as Ee, t as De, v as Oe, w as ke, y as Ae } from "./usePostHistoryEmojiState.svelte-_Y95EyLM.js";
import { a as je, i as Me } from "./menu-trigger-DqitoevE.js";
import { t as Ne } from "./ProfileAvatar-eo19xgt6.js";
import { t as Pe } from "./DialogWrapper-DlNV_DwH.js";
import { t as Fe } from "./dialog-close-DFGIFxm7.js";
import { f as Ie, o as Le, s as Re } from "./profileMention-C2raJMGE.js";
import { i as ze } from "./keyboardFocusUtils-BhXq7KwV.js";
import { c as Be, n as Ve } from "./postReactionUtils-C8gCaYhG.js";
import { J as He, N as M, P as Ue, b as N, j as We, st as Ge, v as Ke } from "./App-CW2Ynbk9.js";
import { t as qe } from "./ChannelPicture-QKSp9ZxQ.js";
import { D as Je, E as Ye, O as Xe, T as Ze, a as Qe, c as $e, f as et, h as tt, i as nt, m as rt, n as it, o as at, p as ot, r as st, s as ct, t as lt } from "./postBroadcastService-DaUJZYg6.js";
import { c as ut, d as dt, n as ft, o as pt, t as mt, u as ht } from "./usePostHistoryPostActionUiController.svelte-GhYqo652.js";
import { t as gt } from "./domSanitizer-B8U0JrXL.js";
import { t as _t } from "./sensitiveContentPayloadReader-DtRJE3_E.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useComposerTargetRelatedPreview.svelte.ts
var vt = 0;
function yt(e) {
	let t = `composer-target-related:${++vt}`, n = e.resolver ?? tt({
		getShow: e.getShow,
		getRxNostr: e.getRxNostr,
		getRelayConfig: e.getRelayConfig,
		requireFullVerification: !0,
		loadRepostTarget: ut
	}), r = 0, i = O(!1), a = () => h(() => {
		r++, p(i, !1), n.invalidateScope(t), e.resolver || n.reset();
	});
	function o(e, t = !1) {
		let a = r;
		p(i, !1), (t ? n.retryTarget(e) : n.ensureTarget(e)).catch(() => {
			r === a && p(i, !0);
		});
	}
	function s(e) {
		return me(e.event.kind) ? fe(e.event) : Be(e.event);
	}
	function c(e) {
		let n = s(e).reference;
		return n ? {
			targetEventId: n.eventId,
			authorHint: n.authorHint,
			relayHints: j.sanitizeExternalRelayUrls([...n.relayHints, ...e.relayHints]),
			sourceEventId: e.event.id,
			relationKind: me(e.event.kind) ? "repost" : "reaction",
			scopeKey: t
		} : null;
	}
	S(() => {
		let t = e.getShow(), n = e.getTarget();
		return e.getRxNostr(), e.getRelayConfig(), e.getPubkey(), h(() => {
			if (a(), t && n && [
				6,
				7,
				16
			].includes(n.event.kind)) {
				let e = c(n);
				e && o(e);
			}
		}), a;
	}), ie(a);
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
		} : me(r.event.kind) ? ge(r.event, c, M) : c?.event && !de(c.event, a.reference) ? {
			...o,
			status: "invalid-target"
		} : c?.event && !M.includes(c.event.kind) ? {
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
function P(e) {
	return e.cache?.resolutionQuality === "verified-root-only" || e.cache?.resolutionQuality === "verified-metadata";
}
var F = /* @__PURE__ */ new Set([
	"missing-channel-root",
	"invalid-channel-root",
	"conflicting-channel-roots"
]);
function bt(e) {
	return e.some((e) => F.has(e));
}
function xt(e, t) {
	return P(t.snapshot) ? t.snapshot : e;
}
function St(e = {}) {
	let t = e.replyQuoteService ?? new N(), n = e.channelCoordinator ?? Ke, r = e.verifyEventFn ?? ((e) => oe(e) && A(e)), i = e.lookupAuthorWriteRelaysFn ? (t, n) => e.lookupAuthorWriteRelaysFn(t) : (e, t) => be(t).lookup(e).then((e) => e.writeRelays);
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
				let _ = j.sanitizeExternalRelayUrls([...g ? [g] : [], ...e.pointer.relayHints], { limit: j.EXTERNAL_INPUT_RELAY_LIMIT }), v = e.profileService ? e.profileService.fetchProfileRealtime(h.pubkey, { additionalRelays: _ }).catch(() => null) : Promise.resolve(null), ee = null, y = null, b = null, te = !1;
				if (h.kind === 40 || h.kind === 42) {
					let t = h.kind === 42 ? se(h) : null, r = h.kind === 40 ? h.id : t?.channelEventId ?? null;
					if (!r || h.kind === 42 && t && bt(t.issues)) return {
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
					let c = xt(i, o);
					if (!P(c)) return {
						status: "error",
						reason: "channel-unavailable",
						event: h,
						relayHints: _,
						authorProfile: await v
					};
					ee = c.context, te = c.cache?.resolutionQuality === "verified-metadata", b = c.cache?.creatorPubkey ?? null, y = {
						eventId: r,
						relayHints: [...c.cache?.relayHints ?? []]
					};
				}
				let x = null, S = null;
				if (e.profileService) {
					if (e.onPhase?.("profile-loading"), [x, S] = await Promise.all([v, b && b !== h.pubkey ? e.profileService.fetchProfileRealtime(b, { additionalRelays: y?.relayHints ?? [] }).catch(() => null) : Promise.resolve(null)]), a) return { status: "cancelled" };
					b === h.pubkey && (S = x);
				}
				return {
					status: "resolved",
					target: {
						event: h,
						relayHints: _,
						fetchedRelayUrl: g,
						authorProfile: x,
						channelContext: ee,
						channelCreatorPubkey: b,
						channelCreatorProfile: S,
						channelQuery: y,
						channelPictureCacheEligible: te
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
var Ct = 2e3;
function wt(e) {
	if (e.length > 5e3) return {
		status: "invalid",
		reason: "too-long"
	};
	let t = e.trim();
	if (!t) return { status: "empty" };
	let n = /^nostr:/i.test(t) ? t.slice(6) : t;
	if (!n) return {
		status: "invalid",
		reason: "invalid-format"
	};
	let r = Le(n);
	if (r) return {
		status: "profile",
		profile: r
	};
	try {
		let e = k.decode(n);
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
		return e.type === "naddr" ? {
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
function Tt(e, t) {
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
function Et(e, t) {
	let n = Array.from(e);
	return n.length <= t ? e : `${n.slice(0, t).join("")}…`;
}
function Dt(e, t = Ct) {
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
var Ot = T("<div class=\"raw-json-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span>", 1), kt = T("<div class=\"broadcast-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span>", 1), At = T("<div class=\"trash-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span>", 1), jt = T("<!> <!>", 1), Mt = T("<!> <!> <!> <!>", 1), Nt = T("<div class=\"xmark-icon svg-icon svelte-19ui8fd\"></div>"), Pt = T("<p class=\"svelte-19ui8fd\"> </p>"), Ft = T("<span class=\"channel-creator svelte-19ui8fd\"> </span>"), It = T("<span class=\"channel-relays svelte-19ui8fd\"> </span>"), Lt = T("<div class=\"channel-preview svelte-19ui8fd\"><!> <div class=\"channel-text svelte-19ui8fd\"><strong class=\"channel-name svelte-19ui8fd\"> </strong> <!> <!> <!></div></div>"), Rt = T("<span class=\"interaction-author svelte-19ui8fd\"><!> <span class=\"interaction-author-name svelte-19ui8fd\"> </span></span>"), zt = T("<div class=\"clear-input-icon svg-icon svelte-19ui8fd\" aria-hidden=\"true\"></div>"), Bt = T("<span class=\"composer-target-mention-icon svg-icon svelte-19ui8fd\" aria-hidden=\"true\"></span> ", 1), Vt = T("<div class=\"composer-target-profile svelte-19ui8fd\"><span class=\"svelte-19ui8fd\"> </span> <!></div>"), Ht = T("<div aria-live=\"polite\"><!> <!></div>"), Ut = T("<p class=\"delete-failed svelte-19ui8fd\"> </p>"), Wt = T("<section class=\"composer-target-repost-preview svelte-19ui8fd\"><!> <!></section>"), Gt = T("<div class=\"related-channel-row svelte-19ui8fd\"><span> </span> <strong> </strong></div>"), Kt = T("<p class=\"related-interaction-label svelte-19ui8fd\"> </p>"), qt = T("<p role=\"status\" class=\"svelte-19ui8fd\"> </p> <!>", 1), Jt = T("<section class=\"composer-target-reaction-preview svelte-19ui8fd\"><div class=\"composer-target-reaction-label svelte-19ui8fd\"><div class=\"composer-target-reaction-title svelte-19ui8fd\"><!> <div class=\"composer-target-reaction-symbol favorite-icon svg-icon svelte-19ui8fd\" aria-hidden=\"true\"></div> <span class=\"svelte-19ui8fd\"> </span></div></div> <!> <!> <!></section>"), Yt = T("<p class=\"interaction-label svelte-19ui8fd\"> </p>"), Xt = T("<span hidden=\"\" aria-hidden=\"true\" class=\"svelte-19ui8fd\"></span>"), Zt = T("<div class=\"post-icon svg-icon\" aria-hidden=\"true\"></div>"), Qt = T("<div class=\"composer-target-channel-action svelte-19ui8fd\"><!></div>"), $t = T("<section class=\"target-preview svelte-19ui8fd\"><div><!> <div class=\"event-author svelte-19ui8fd\"><!> <span class=\"svelte-19ui8fd\"> </span> <span class=\"event-kind svelte-19ui8fd\"> </span></div> <!> <!> <!> <!></div> <!> <!></section>"), en = T("<p class=\"unsupported-kind svelte-19ui8fd\"> </p>"), tn = T("<div class=\"composer-target-content svelte-19ui8fd\"><h2 class=\"svelte-19ui8fd\"> </h2> <label class=\"target-input-label svelte-19ui8fd\" for=\"composer-target-input\"> </label> <div class=\"composer-target-input-shell svelte-19ui8fd\"><input id=\"composer-target-input\" type=\"text\" inputmode=\"text\" autocomplete=\"off\" spellcheck=\"false\" class=\"svelte-19ui8fd\"/> <!></div> <!> <!>  <!> <!></div>"), nn = T("<div class=\"delete-confirm-body svelte-19ui8fd\"><p class=\"delete-confirm-description svelte-19ui8fd\"> </p> <p class=\"delete-confirm-warning svelte-19ui8fd\"> </p></div>"), rn = T("<div> </div>"), an = T("<!> <!> <!> <!> <!>", 1), on = {
	hash: "svelte-19ui8fd",
	code: ".composer-target-profile.svelte-19ui8fd {display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin-block:0.75rem;}.composer-target-profile.svelte-19ui8fd > span:where(.svelte-19ui8fd) {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.composer-target-profile.svelte-19ui8fd .composer-target-mention-button {--btn-bg: var(--theme);color:white;gap:0.375rem;padding:0.5rem 0.75rem;flex-shrink:0;white-space:nowrap;}.composer-target-mention-icon.svelte-19ui8fd {--svg: currentColor;width:20px;height:20px;mask-image:var(--ehagaki-icon-616c7465726e6174655f656d61696c5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-19ui8fd {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.composer-target-dialog {max-width:560px;}\n\n    @media (max-width: 600px) {.composer-target-dialog {top:0;translate:-50%\n                max(\n                    calc(\n                        var(--mobile-dialog-viewport-top) +\n                            env(safe-area-inset-top, 0px) + 12px\n                    ),\n                    calc(var(--mobile-dialog-center-y) - 50%)\n                );width:calc(100% - 24px);max-height:calc(\n                var(--mobile-dialog-viewport-height) -\n                    env(safe-area-inset-top, 0px) -\n                    env(safe-area-inset-bottom, 0px) -\n                    24px\n            );}.composer-target-dialog .dialog-content {min-height:0;max-height:none;flex:1 1 auto;overflow-y:auto;}.composer-target-dialog .dialog-footer {flex:0 0 auto;}\n    }.composer-target-content.svelte-19ui8fd {display:grid;gap:10px;width:100%;}h2.svelte-19ui8fd {margin:0;font-size:1.25rem;}.target-input-label.svelte-19ui8fd {font-weight:600;}.composer-target-input-shell.svelte-19ui8fd {position:relative;}input.svelte-19ui8fd {width:100%;min-height:50px;padding:8px 49px 8px 10px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text);font:inherit;outline:none;}input.svelte-19ui8fd:focus-visible {outline:2px solid var(--theme);outline-offset:-1px;}.ehagaki-app-root button.composer-target-clear-button {position:absolute;inset-block:50%;inset-inline-end:2px;transform:translateY(-50%);width:46px;height:46px;display:flex;align-items:center;justify-content:center;padding:0;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);z-index:1;}.ehagaki-app-root button.composer-target-clear-button:hover:not(:disabled),\n    .ehagaki-app-root button.composer-target-clear-button:active:not(:disabled),\n    .ehagaki-app-root button.composer-target-clear-button:focus-visible,\n    .ehagaki-app-root button.composer-target-clear-button:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.composer-target-clear-button:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.ehagaki-app-root button.composer-target-related-retry-button {height:auto;min-height:44px;padding:8px 12px;}.composer-target-clear-button .svg-icon {--svg: currentColor;width:24px;height:24px;}.clear-input-icon.svelte-19ui8fd {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.target-status.svelte-19ui8fd p:where(.svelte-19ui8fd),\n    .channel-preview.svelte-19ui8fd p:where(.svelte-19ui8fd),\n    .unsupported-kind.svelte-19ui8fd {margin:0;}.event-kind.svelte-19ui8fd,\n    .channel-creator.svelte-19ui8fd,\n    .channel-relays.svelte-19ui8fd {color:var(--text-muted);font-size:0.85rem;}.target-status.svelte-19ui8fd {display:grid;gap:8px;color:var(--text-muted);}.target-status.error.svelte-19ui8fd {color:var(--danger);}.composer-target-loading {justify-content:flex-start;padding:0;}.target-preview.svelte-19ui8fd {display:grid;min-width:0;border:1px solid var(--border-hr);background:var(--bg-input);}.composer-target-channel-action.svelte-19ui8fd {display:flex;width:100%;justify-content:center;}.target-preview .post-preview-footer {--post-history-preview-footer-surface: var(--bg-input);}.target-preview-body.svelte-19ui8fd {display:grid;min-width:0;gap:10px;padding:12px;}.composer-target-repost-preview.svelte-19ui8fd {min-width:0;}.interaction-label.svelte-19ui8fd {margin:0;font-weight:600;}.interaction-author.svelte-19ui8fd {display:inline-flex;align-items:center;gap:6px;min-width:0;color:var(--text);}.interaction-author-name.svelte-19ui8fd {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.interaction-author .composer-target-avatar {width:24px;height:24px;}.composer-target-repost-preview .post-history-repost-title > span {flex-shrink:0;white-space:nowrap;}.composer-target-repost-preview .post-history-repost-title > .interaction-author {flex-shrink:1;}.composer-target-reaction-preview.svelte-19ui8fd {min-width:0;}.composer-target-reaction-preview.svelte-19ui8fd p:where(.svelte-19ui8fd) {margin:0;}.composer-target-reaction-label.svelte-19ui8fd {display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--btn-post-preview-action);}.composer-target-reaction-title.svelte-19ui8fd {display:flex;align-items:center;gap:6px;min-width:0;padding-left:6px;}.composer-target-reaction-title.svelte-19ui8fd > span:where(.svelte-19ui8fd) {flex-shrink:0;white-space:nowrap;}.composer-target-reaction-title.svelte-19ui8fd > .interaction-author:where(.svelte-19ui8fd) {flex-shrink:1;}.composer-target-reaction-symbol.svelte-19ui8fd {flex-shrink:0;width:22px;height:22px;flex:0 0 22px;--svg: currentColor;mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.related-channel-row.svelte-19ui8fd {display:flex;flex-wrap:wrap;gap:6px;padding:4px 6px;overflow-wrap:anywhere;}.related-interaction-label.svelte-19ui8fd {padding:4px 6px;color:var(--text-muted);}.event-author.svelte-19ui8fd {display:flex;align-items:center;gap:8px;min-width:0;}.event-author.svelte-19ui8fd > span:where(.svelte-19ui8fd):first-of-type {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.event-kind.svelte-19ui8fd {margin-inline-start:auto;white-space:nowrap;}.composer-target-avatar {width:36px;height:36px;flex:0 0 auto;}.composer-target-avatar-image,\n    .composer-target-avatar-fallback {width:100%;height:100%;border-radius:50%;}.target-preview .event-content,\n    .channel-preview.svelte-19ui8fd p:where(.svelte-19ui8fd) {white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}.target-preview .event-content-collapsed {max-height:calc(5 * 1.45em);overflow:hidden;}.channel-preview.svelte-19ui8fd {display:flex;gap:10px;padding-top:10px;border-top:1px solid var(--border-hr);}.target-preview-body.channel-first.svelte-19ui8fd .channel-preview:where(.svelte-19ui8fd) {padding-top:0;border-top:0;}.target-preview-body.channel-first.svelte-19ui8fd .event-author:where(.svelte-19ui8fd) {padding-top:10px;border-top:1px solid var(--border-hr);}.channel-preview .channel-picture {width:48px;height:48px;flex:0 0 auto;object-fit:cover;}.channel-text.svelte-19ui8fd {display:grid;gap:4px;min-width:0;}.channel-name.svelte-19ui8fd {min-width:0;overflow-wrap:anywhere;}.channel-relays.svelte-19ui8fd {white-space:pre-wrap;overflow-wrap:anywhere;}.delete-failed.svelte-19ui8fd {margin:0;color:var(--danger);}.delete-confirm-body.svelte-19ui8fd {display:flex;flex-direction:column;justify-content:center;gap:0.5rem;margin:10px 0 30px;margin-inline:auto;text-align:start;}.delete-confirm-description.svelte-19ui8fd,\n    .delete-confirm-warning.svelte-19ui8fd {margin:0;line-height:1.5;}.delete-confirm-warning.svelte-19ui8fd {color:var(--text-light);font-size:0.875rem;}.target-preview .post-icon {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.post-history-menu-content .menu-action-button .raw-json-icon {mask-image:var(--ehagaki-icon-646174615f6f626a6563745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .broadcast-icon {mask-image:var(--ehagaki-icon-63656c6c5f746f7765725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .trash-icon {mask-image:var(--ehagaki-icon-64656c6574655f666f72657665725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}"
};
function sn(T, k) {
	t(k, !0), x(T, on);
	let A = () => re(le, "$_", j), oe = () => re(ce, "$locale", j), [j, se] = ne(), de = (t, n = u) => {
		var r = o(), s = y(r), c = (t) => {
			let r = d(() => A()("common.showActions"));
			{
				let s = (t) => {
					var r = Mt(), s = y(r), c = (e) => {
						rt(e, {
							get pending() {
								return xt();
							},
							onSelect: () => void pn(n())
						});
					}, u = d(() => !F() && bt() && pe(n().kind));
					e(s, (e) => {
						D(u) && e(c);
					});
					var f = C(s, 2);
					l(f, () => je, (e, t) => {
						t(e, {
							class: "menu-action-button",
							onSelect: () => kr(n().rawEvent),
							children: (e, t) => {
								var n = Ot(), r = C(y(n), 2), o = w(r, !0);
								_((e) => a(o, e), [() => A()("postHistory.rawJson")]), i(e, n);
							},
							$$slots: { default: !0 }
						});
					});
					var p = C(f, 2), m = (e) => {
						var t = o(), r = y(t);
						{
							let e = d(() => D(Dn) === "sending");
							l(r, () => je, (t, r) => {
								r(t, {
									class: "menu-action-button",
									get disabled() {
										return D(e);
									},
									onpointerdown: (e) => Ar(n(), e),
									onSelect: (e) => void Nr(n(), e),
									children: (e, t) => {
										var n = kt(), r = C(y(n), 2), o = w(r, !0);
										_((e) => a(o, e), [() => A()("postHistory.broadcast")]), i(e, n);
									},
									$$slots: { default: !0 }
								});
							});
						}
						i(e, t);
					};
					e(p, (e) => {
						D(Hn) && e(m);
					});
					var h = C(p, 2), g = (e) => {
						var t = jt(), r = y(t);
						l(r, () => Me, (e, t) => {
							t(e, { class: "post-history-menu-separator" });
						});
						var o = C(r, 2);
						{
							let e = d(() => D(U) === "sending");
							l(o, () => je, (t, r) => {
								r(t, {
									class: "menu-action-button menu-action-button-danger",
									get disabled() {
										return D(e);
									},
									onSelect: () => Pr(n()),
									children: (e, t) => {
										var n = At(), r = C(y(n), 2), o = w(r, !0);
										_((e) => a(o, e), [() => D(U) === "sending" ? A()("postHistory.deleteSending") : A()("postHistory.delete")]), i(e, n);
									},
									$$slots: { default: !0 }
								});
							});
						}
						i(e, t);
					};
					e(h, (e) => {
						D(Un) && e(g);
					}), i(t, r);
				}, c = d(() => H.isPostMenuOpen(n().eventId)), u = d(() => Ae(n().postedAt, oe()));
				et(t, {
					get open() {
						return D(c);
					},
					onOpenChange: (e) => Or(n().eventId, e),
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
					items: s,
					$$slots: { items: !0 }
				});
			}
		};
		e(s, (e) => {
			n().eventId === D(Y)?.eventId && e(c);
		}), i(t, r);
	}, fe = (t, n = u) => {
		let r = d(() => Zn.getReadModel(n().eventId));
		var a = o(), s = y(a), c = (e) => {
			{
				let t = d(() => D(W) === n().eventId), i = d(() => D(W) === n().eventId ? A()("postHistory.hideReactions") : A()("postHistory.showReactionsWithCount", { values: { count: D(r).totalCount } }));
				pt(e, {
					get count() {
						return D(r).totalCount;
					},
					get expanded() {
						return D(t);
					},
					get ariaLabel() {
						return D(i);
					},
					onToggle: () => p(W, D(W) === n().eventId ? null : n().eventId, !0)
				});
			}
		};
		e(s, (e) => {
			D(r) && D(r).totalCount > 0 && e(c);
		}), i(t, a);
	}, me = (t, n = u) => {
		let r = d(() => Zn.getReadModel(n().eventId));
		var a = o(), s = y(a), c = (e) => {
			$e(e, {
				get readModel() {
					return D(r);
				},
				get emojiLoadStateByUrl() {
					return Q.emojiLoadStateByUrl;
				},
				get emojiImageMetaByUrl() {
					return Q.emojiImageMetaByUrl;
				},
				showSingleCount: !0
			});
		};
		e(s, (e) => {
			D(r) && D(r).totalCount > 0 && D(W) === n().eventId && e(c);
		}), i(t, a);
	}, ge = (t) => {
		var n = o(), r = y(n), a = (e) => {
			var t = jt(), n = y(t);
			{
				let e = (e) => {
					{
						let t = (e) => {
							fe(e, () => D(Y));
						}, n = d(() => F() ? void 0 : () => $("reaction")), r = d(() => !F() && D(G).includes("reply") ? () => $("reply") : void 0), i = d(() => !F() && D(G).includes("quote") ? () => {
							$("quote");
						} : void 0);
						Ze(e, {
							get post() {
								return D(Y);
							},
							get onReactionPost() {
								return D(n);
							},
							get onReplyPost() {
								return D(r);
							},
							get onQuotePost() {
								return D(i);
							},
							reactionExtras: t,
							$$slots: { reactionExtras: !0 }
						});
					}
				}, t = (e) => {
					de(e, () => D(Y));
				}, r = d(() => Oe(D(Y).postedAt));
				Xe(n, {
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
			var r = C(n, 2);
			me(r, () => D(Y)), i(e, t);
		};
		e(r, (e) => {
			D(Y) && e(a);
		}), i(t, n);
	}, be = E(k, "initialInput", 3, ""), Le = E(k, "canApplyMention", 3, !0), Be = E(k, "inboundInteractionSave", 3, null), M = E(k, "rxNostr", 3, void 0), N = E(k, "relayConfig", 3, null), Ke = E(k, "profileService", 3, void 0), ut = E(k, "resolver", 19, St), vt = E(k, "relatedResolver", 3, void 0), P = E(k, "pubkeyHex", 3, null), F = E(k, "readOnly", 3, !1), bt = E(k, "onRepostPost", 3, void 0), xt = E(k, "repostPending", 3, !1), Ct = E(k, "onRetryRepostSave", 3, void 0), sn = E(k, "repostSaveFailure", 3, null), I = O(null), cn = d(() => D(I) ? Re(D(I).pubkey, Ce.getReactiveEntry(D(I).pubkey)?.profile) : ""), ln;
	function un() {
		return ln ??= tt({
			getShow: () => k.show,
			getRxNostr: () => M(),
			getRelayConfig: () => N()
		});
	}
	let dn = O(null), fn = 0;
	S(() => (k.show, P(), fn++, p(dn, null), () => ln?.invalidateScope("composer-repost"))), ie(() => ln?.reset());
	async function pn(e) {
		if (!bt() || xt()) return;
		p(dn, null);
		let t = fn, n = e.eventId, r = await bt()(e, (e, t) => un().prepareRepostTarget({
			relationKind: "repost",
			scopeKey: "composer-repost",
			targetEventId: e.id,
			authorHint: e.pubkey,
			relayHints: t
		}, e));
		k.show && t === fn && D(z)?.event.id === n && p(dn, r, !0);
	}
	let mn = O(""), hn = O(null), gn = O(null), L = O("empty"), R = O(null), z = O(null), _n = O(null), vn = O(null), yn = O(0), B = 0, V, bn = null, xn = O(te([])), Sn = O(-1), Cn = O(!1), wn = O(null), H = mt(), Tn = O(!1), En = O(null), Dn = O(void 0), U = O(void 0), On = O(!1), kn = O(0), An = O(0), jn = O("postHistory.broadcastSent"), Mn, Nn = O(void 0), W = O(null), G = d(() => D(z) ? Tt(D(z).event.kind, [1, 1111].includes(D(z).event.kind) || !!D(z).channelQuery) : []), K = d(() => D(z)?.event ?? D(_n)), Pn = yt({
		getShow: () => k.show,
		getTarget: () => D(z),
		getRxNostr: () => M(),
		getRelayConfig: () => N(),
		getPubkey: () => P(),
		resolver: h(() => vt())
	}), q = d(() => Pn.getPreview()), J = d(() => D(z) && [6, 16].includes(D(z).event.kind) ? D(q) : null), Fn = d(() => D(q)?.status === "resolved" && D(q).event?.kind === 42 ? [he(D(q).event, D(q).relayHints)] : []), In = ht({
		getShow: () => k.show,
		getPosts: () => D(Fn),
		getRxNostr: () => M(),
		getRelayConfig: () => N(),
		getIsSearchMode: () => !1
	}), Ln = d(() => D(Fn)[0] ? In.getChannelText(D(Fn)[0], A()) : null), Rn = d(() => D(q)?.event ? [
		6,
		7,
		16
	].includes(D(q).event.kind) ? Ue(D(q).event) : Te({
		kind: D(q).event.kind,
		sourceContent: D(q).event.content,
		tags: D(q).event.tags
	}) : null);
	function zn(e) {
		return e === 6 ? "repost.entry" : e === 16 ? "composerTarget.genericRepost" : "composerTarget.reaction";
	}
	let Bn = d(() => D(q)?.status === "loading" ? "composerTarget.relatedLoading" : D(q)?.status === "deleted" ? "composerTarget.relatedDeleted" : D(q)?.status === "unsupported-reference" || D(q)?.status === "unsupported-target-kind" ? "composerTarget.relatedUnsupported" : D(q)?.status === "invalid-reference" || D(q)?.status === "invalid-target" || D(q)?.status === "outer-target-kind-mismatch" ? "composerTarget.relatedInvalid" : "composerTarget.relatedMissing"), Vn = d(() => D(K) ? D(K).created_at * 1e3 : 0), Y = d(() => D(z) ? Dr(D(z)) : null), Hn = d(() => !F() && D(Y) !== null && it(D(Y)) !== null), Un = d(() => !F() && D(Y) !== null && st(D(Y), P())), X = d(() => D(z)?.authorProfile ?? D(vn)), Wn = d(() => {
		let e = D(K)?.pubkey;
		return e ? D(X)?.displayName?.trim() || D(X)?.name?.trim() || ye(e) : "";
	}), Gn = d(() => !D(K) || [
		6,
		7,
		16,
		40
	].includes(D(K).kind) ? "" : Ee(D(K).content, D(K).tags)), Kn = d(() => Dt(D(Gn))), qn = d(() => D(K) && D(Gn) ? [{
		eventId: D(K).id,
		content: D(Kn).content,
		forceCollapsible: D(Kn).exceedsRenderLimit
	}] : []), Jn = Qe({
		getShow: () => k.show,
		getPosts: () => D(qn),
		getContainer: () => D(gn)
	}), Yn = ke({
		getShow: () => k.show,
		getRxNostr: () => M()
	}), Xn = d(() => {
		let e = D(z) && Ve(D(z).event.kind) ? [{
			eventId: D(z).event.id,
			relayHints: [...D(z).relayHints],
			targetAuthorPubkey: D(z).event.pubkey,
			targetKind: D(z).event.kind
		}] : [];
		return D(q)?.status === "resolved" && D(q).event && Ve(D(q).event.kind) && e.push({
			eventId: D(q).event.id,
			relayHints: [...D(q).relayHints],
			targetAuthorPubkey: D(q).event.pubkey,
			targetKind: D(q).event.kind
		}), e;
	}), Zn = ft({
		getShow: () => k.show,
		getPubkeyHex: () => P(),
		getRxNostr: () => M(),
		getRelayConfig: () => N(),
		getTargets: () => D(Xn),
		profileSync: Yn,
		source: "composer-target-display"
	}), Z = d(() => D(z) && Ve(D(z).event.kind) ? Zn.getReadModel(D(z).event.id) : null), Qn = d(() => !!D(z) && D(W) === D(z).event.id), $n = null;
	S(() => {
		let e = k.show && D(z) && Ve(D(z).event.kind) ? D(z).event.id : null;
		e !== $n && ($n = e, p(W, null), Yn.reset());
	});
	function er() {
		D(z) && D(Z)?.totalCount && p(W, D(Qn) ? null : D(z).event.id, !0);
	}
	function tr(e) {
		return D(Qn) ? A()("postHistory.hideReactions") : A()("postHistory.showReactionsWithCount", { values: { count: e } });
	}
	let nr = Jn.previewRef, rr = d(() => D(qn)[0]), ir = d(() => D(rr) ? Jn.isPostExpanded(D(rr)) : !1), ar = d(() => D(ir) ? D(Gn) : D(Kn).content), or = d(() => D(K) && [
		6,
		7,
		16
	].includes(D(K).kind) ? Ue(D(K)) : D(K)?.kind === 40 ? Te({
		sourceContent: "",
		displayContent: "",
		tags: [],
		kind: D(K)?.kind,
		media: []
	}) : Te({
		sourceContent: D(Gn),
		kind: D(K)?.kind,
		tags: D(K)?.tags ?? []
	})), sr = d(() => D(ar) === D(Gn) ? D(or) : Te({
		sourceContent: D(Gn),
		kind: D(K)?.kind,
		displayContent: D(or).hasRenderableText ? D(ar) : "",
		tags: D(K)?.tags ?? [],
		media: D(or).media
	})), cr = d(() => {
		let e = new Set(D(sr).previewContent.emojiUrls);
		for (let t of D(Rn)?.previewContent.emojiUrls ?? []) e.add(t);
		if (D(W)) for (let t of Zn.getReadModel(D(W))?.groups ?? []) t.emojiUrl && e.add(t.emojiUrl);
		return [...e];
	}), lr = d(() => D(or).hasRenderableText), ur = d(() => !!D(rr) && D(lr) && Jn.shouldCollapsePost(D(rr))), dr = d(() => D(K) ? `composer-target-preview-content-${D(K).id}` : ""), fr = d(() => {
		let e = D(z)?.channelContext?.about;
		return e ? Et(gt(e), 200) : "";
	}), pr = d(() => {
		let e = D(z)?.channelContext;
		return e ? e.name?.trim() || `ID: ${ve(e.eventId, 12, 8)}` : "";
	}), mr = d(() => {
		let e = D(z)?.channelCreatorPubkey;
		return e ? D(z)?.channelCreatorProfile?.displayName?.trim() || D(z)?.channelCreatorProfile?.name?.trim() || ye(e) : "";
	}), hr = d(Sr), gr = d(() => D(R) === "not-found" || D(R) === "timeout" || D(R) === "network" || D(R) === "channel-unavailable" || D(R) === "nostr-not-ready"), _r = d(() => D(L) === "debouncing" || D(L) === "event-loading" || D(L) === "channel-loading" || D(L) === "profile-loading"), Q = De({
		getShow: () => k.show && D(cr).length > 0,
		getEmojiUrls: () => D(cr),
		onStateChanged: () => Jn.remeasure()
	});
	function vr() {
		V !== void 0 && (clearTimeout(V), V = void 0), bn?.cancel(), bn = null;
	}
	function yr() {
		Mn !== void 0 && (clearTimeout(Mn), Mn = void 0), p(On, !1), p(Nn, void 0);
	}
	function br() {
		ln?.reset(), ln = void 0, fn++, p(dn, null), H.reset(), p(Tn, !1), p(En, null), p(Dn, void 0), p(U, void 0), yr();
	}
	function xr() {
		B += 1, vr(), p(mn, ""), p(L, "empty"), p(R, null), p(z, null), p(I, null), p(_n, null), p(vn, null), p(yn, 0), p(W, null), Yn.reset(), br(), Q.resetState(), p(xn, [], !0), p(Sn, -1), p(Cn, !1), p(wn, null);
	}
	function Sr() {
		return D(L) === "parsing" ? A()("composerTarget.parsing") : D(L) === "debouncing" || D(L) === "event-loading" ? A()("composerTarget.checking") : D(L) === "channel-loading" ? A()("composerTarget.channelLoading") : D(L) === "profile-loading" ? A()("composerTarget.profileLoading") : D(R) ? D(R) === "unsupported" ? A()("composerTarget.unsupportedFormat") : D(R) === "secret-key" ? A()("composerTarget.secretKey") : D(R) === "invalid" ? A()("composerTarget.invalidFormat") : D(R) === "not-found" ? A()("composerTarget.notFound") : D(R) === "timeout" ? A()("composerTarget.timeout") : D(R) === "mismatch" ? A()("composerTarget.mismatch") : D(R) === "channel-unavailable" ? A()("composerTarget.channelUnavailable") : A()("composerTarget.fetchFailed") : "";
	}
	async function Cr(e, t) {
		if (!M()) {
			B === t && (p(L, "error"), p(R, "nostr-not-ready"));
			return;
		}
		bn = ut().resolve({
			pointer: e,
			rxNostr: M(),
			relayConfig: N(),
			profileService: Ke(),
			onPhase: (e) => {
				B === t && p(L, e, !0);
			}
		});
		let n = await bn.promise;
		B === t && n.status !== "cancelled" && (bn = null, n.status === "resolved" ? (p(z, n.target, !0), p(_n, null), p(vn, null), p(L, "ready"), p(R, null)) : (p(_n, n.event ?? null, !0), p(vn, n.authorProfile ?? null, !0), p(L, "error"), p(R, n.reason, !0)));
	}
	function wr() {
		p(yn, D(yn) + 1);
	}
	function Tr() {
		D(I) && Le() && k.onApplyMention?.({
			...D(I),
			label: D(cn)
		}) && Lr();
	}
	async function $(e) {
		if (F() || !D(z)) return !1;
		let t = D(z), n = B, r = await k.onApply(e, {
			source: "manual",
			kind: D(z).event.kind,
			eventId: D(z).event.id,
			relayHints: [...D(z).fetchedRelayUrl ? [D(z).fetchedRelayUrl] : [], ...D(z).relayHints],
			authorPubkey: D(z).event.pubkey,
			event: D(z).event,
			channelQuery: D(z).channelQuery,
			isCurrent: () => k.show && B === n && D(z) === t
		});
		return r && k.show && D(z) === t && B === n && Lr(), r;
	}
	async function Er(e) {
		if (F()) return !1;
		let t = B, n = D(z), r = await k.onApply("reaction", {
			...We(e),
			source: "manual",
			relayHints: [
				...e.fetchedRelays ?? [],
				...e.acceptedRelays,
				...e.relayHints
			],
			isCurrent: () => k.show && B === t && D(z) === n
		});
		return r && k.show && B === t && D(z) === n && Lr(), r;
	}
	S(() => {
		let e = Be();
		k.show && e?.revision && Zn.refreshCachedReactions(e.parentEventIds).catch(() => void 0);
	});
	function Dr(e) {
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
	function Or(e, t) {
		t && H.closeAllPostItemMenus(), H.setPostMenuOpen(e, t);
	}
	function kr(e) {
		H.closeAllPostItemMenus(), p(En, e, !0), p(Tn, !0);
	}
	function Ar(e, t) {
		p(Nn, {
			eventId: e.eventId,
			..._e(t.clientX, t.clientY)
		}, !0);
	}
	function jr(e, t) {
		if (D(Nn)?.eventId === e.eventId) return {
			x: D(Nn).x,
			y: D(Nn).y
		};
		let n = t.currentTarget, r = n instanceof HTMLElement ? n.getBoundingClientRect() : null;
		return _e(r ? r.left + r.width / 2 : 0, r ? r.bottom + 8 : 0);
	}
	function Mr(e, t) {
		yr(), p(kn, e.x, !0), p(An, e.y, !0), p(jn, t.success ? "postHistory.broadcastSent" : "postHistory.broadcastFailed", !0), p(On, !0), Mn = setTimeout(() => {
			p(On, !1), Mn = void 0;
		}, 1800);
	}
	async function Nr(e, t) {
		if (D(Dn) === "sending") return;
		let n = B, r = e.eventId, i = jr(e, t);
		p(Dn, "sending");
		let a = await lt.broadcast({
			post: e,
			rxNostr: M()
		});
		B === n && D(z)?.event.id === r && (p(Dn, void 0), Mr(i, a));
	}
	function Pr(e) {
		st(e, P()) && H.openDeleteConfirm(e);
	}
	function Fr() {
		H.cancelDeleteConfirm();
	}
	async function Ir() {
		let e = H.deleteTargetPost;
		if (!e || D(U) === "sending") return;
		let t = B, n = e.eventId;
		p(U, "sending");
		let r = await nt.requestDeletion({
			post: e,
			rxNostr: M()
		});
		B === t && D(z)?.event.id === n && (H.setDeleteConfirmOpen(!1), r.success ? (p(U, void 0), Lr()) : p(U, "failed"));
	}
	function Lr() {
		xr(), k.onClose();
	}
	function Rr() {
		D(mn).trim().length !== 0 && (p(mn, ""), D(hn)?.focus({ preventScroll: !0 }));
	}
	function zr(e) {
		e.preventDefault(), D(hn)?.focus({ preventScroll: !0 });
	}
	function Br(e) {
		return e instanceof Element && e.closest(".ehagaki-pswp") !== null;
	}
	function Vr(e) {
		Br(e.target) && e.preventDefault();
	}
	function Hr(e) {
		D(Cn) && e.preventDefault();
	}
	function Ur(e) {
		p(xn, e.mediaList, !0), p(Sn, e.index, !0), p(wn, e.focusOrigin, !0), p(Cn, !0);
	}
	function Wr() {
		p(Cn, !1), p(xn, [], !0), p(Sn, -1), p(wn, null);
	}
	function Gr(e) {
		p(Sn, e, !0);
	}
	S(() => {
		let e = be();
		k.show && h(() => p(mn, e, !0));
	}), S(() => {
		k.show || xr();
	}), S(() => {
		if (!k.show) return;
		let e = D(mn);
		D(yn);
		let t = ++B;
		vr(), br(), p(z, null), p(I, null), p(_n, null), p(vn, null), p(R, null), p(L, "parsing");
		let n = wt(e);
		if (n.status === "empty") {
			p(L, "empty");
			return;
		}
		if (n.status === "unsupported") {
			p(L, "error"), p(R, "unsupported");
			return;
		}
		if (n.status === "profile") {
			if (!k.onApplyMention) {
				p(L, "error"), p(R, "unsupported");
				return;
			}
			p(I, n.profile), p(L, "ready"), h(() => {
				Ce.getCachedProfile(n.profile.pubkey).catch(() => void 0);
			});
			return;
		}
		if (n.status === "secret-key") {
			p(L, "error"), p(R, "secret-key");
			return;
		}
		if (n.status === "invalid") {
			p(L, "error"), p(R, "invalid");
			return;
		}
		let r = n.pointer;
		return p(L, "debouncing"), V = setTimeout(() => {
			V = void 0, Cr(r, t);
		}, 250), () => {
			V !== void 0 && (clearTimeout(V), V = void 0);
		};
	}), ie(() => {
		B += 1, vr(), yr(), Yn.dispose();
	});
	var Kr = an(), qr = y(Kr);
	{
		let t = (e) => {
			var t = jt(), n = y(t);
			ot(n, {
				get result() {
					return D(dn);
				},
				get saveFailure() {
					return sn();
				},
				get pending() {
					return xt();
				},
				get onRetrySave() {
					return Ct();
				}
			});
			var r = C(n, 2);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = d(() => A()("global.close"));
						Se(e, m(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return D(t);
							},
							children: (e, t) => {
								var n = Nt();
								_((e) => g(n, "aria-label", e), [() => A()("global.close")]), i(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				l(r, () => Fe, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			i(e, t);
		}, r = d(() => A()("composerTarget.title")), u = d(() => A()("composerTarget.description"));
		Pe(qr, {
			get open() {
				return k.show;
			},
			onOpenChange: (e) => !e && Lr(),
			get title() {
				return D(r);
			},
			get description() {
				return D(u);
			},
			contentClass: "composer-target-dialog",
			footerVariant: "close-button",
			onOpenAutoFocus: zr,
			onInteractOutside: Vr,
			onEscapeKeydown: Hr,
			footer: t,
			children: (t, r) => {
				var l = tn();
				{
					let t = (t) => {
						var n = Lt(), r = v(n), o = (e) => {
							qe(e, {
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
						e(r, (e) => {
							D(z)?.channelContext?.picture && e(o);
						});
						var s = C(r, 2), l = v(s), u = w(l, !0), d = C(l, 2), f = (e) => {
							var t = Pt(), n = w(t, !0);
							_(() => a(n, D(fr))), i(e, t);
						};
						e(d, (e) => {
							D(fr) && e(f);
						});
						var p = C(d, 2), m = (e) => {
							var t = Ft(), n = w(t);
							_((e) => a(n, `${e ?? ""}: ${D(mr) ?? ""}`), [() => A()("composerTarget.creator")]), i(e, t);
						};
						e(p, (e) => {
							D(mr) && e(m);
						});
						var h = C(p, 2), g = (e) => {
							var t = It(), n = w(t, !0);
							_((e) => a(n, e), [() => D(z).channelContext.channelRelays.join("\n")]), i(e, t);
						};
						e(h, (e) => {
							D(z)?.channelContext?.channelRelays?.length && e(g);
						}), c(s), c(n), _(() => a(u, D(pr))), i(t, n);
					}, r = (e) => {
						var t = Rt(), n = v(t);
						{
							let e = d(() => D(K)?.pubkey ?? ""), t = d(() => D(X)?.displayName), r = d(() => D(X)?.name), i = d(() => D(X)?.picture ?? "");
							Ne(n, {
								get pubkeyHex() {
									return D(e);
								},
								get displayName() {
									return D(t);
								},
								get name() {
									return D(r);
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
						var r = C(n, 2), o = w(r, !0);
						c(t), _(() => a(o, D(Wn))), i(e, t);
					};
					var u = v(l), m = w(u, !0), h = C(u, 2), te = w(h, !0), x = C(h, 2), S = v(x);
					ae(S), ee(S, (e) => p(hn, e), () => D(hn));
					var ne = C(S, 2), T = (e) => {
						{
							let t = d(() => A()("composerTarget.clearInput"));
							Se(e, {
								type: "button",
								className: "composer-target-clear-button",
								variant: "default",
								shape: "square",
								contentLayout: "icon",
								get ariaLabel() {
									return D(t);
								},
								onClick: Rr,
								get onmousedown() {
									return ze;
								},
								get ontouchstart() {
									return ze;
								},
								children: (e, t) => {
									var n = zt();
									i(e, n);
								},
								$$slots: { default: !0 }
							});
						}
					}, E = d(() => D(mn).trim().length > 0);
					e(ne, (e) => {
						D(E) && e(T);
					}), c(x);
					var re = C(x, 2), ie = (e) => {
						let t = d(() => Ie(D(cn)));
						var n = Vt(), r = v(n), o = w(r), s = C(r, 2);
						{
							let e = d(() => !Le());
							Se(s, {
								class: "composer-target-mention-button",
								variant: "primary",
								contentLayout: "iconText",
								onClick: Tr,
								get disabled() {
									return D(e);
								},
								children: (e, t) => {
									var n = Bt(), r = C(y(n));
									_((e) => a(r, ` ${e ?? ""}`), [() => A()("composerTarget.mention")]), i(e, n);
								},
								$$slots: { default: !0 }
							});
						}
						c(n), _(() => {
							g(r, "title", D(t) === D(cn) ? void 0 : `@${D(cn)}`), a(o, `@${D(t) ?? ""}`);
						}), i(e, n);
					};
					e(re, (e) => {
						D(I) && e(ie);
					});
					var O = C(re, 2), k = (t) => {
						var r = Ht();
						let o;
						var l = v(r), u = (e) => {
							ue(e, {
								showLoader: !0,
								get text() {
									return D(hr);
								},
								customClass: "composer-target-loading"
							});
						}, d = (e) => {
							var t = Pt(), n = w(t, !0);
							_(() => a(n, D(hr))), i(e, t);
						};
						e(l, (e) => {
							D(_r) ? e(u) : e(d, -1);
						});
						var p = C(l, 2), m = (e) => {
							Se(e, {
								onClick: wr,
								children: (e, t) => {
									s();
									var n = f();
									_((e) => a(n, e), [() => A()("postHistory.contextRetry")]), i(e, n);
								},
								$$slots: { default: !0 }
							});
						};
						e(p, (e) => {
							D(gr) && e(m);
						}), c(r), _(() => o = n(r, 1, "target-status svelte-19ui8fd", null, o, { error: D(L) === "error" })), i(t, r);
					};
					e(O, (e) => {
						D(hr) && e(k);
					});
					var oe = C(O, 2), j = (t) => {
						var n = Wt(), o = v(n);
						{
							let e = d(() => F() ? void 0 : (e) => e.eventId === D(Y)?.eventId ? $("reaction") : Er(e)), t = d(() => D(Rn) ?? void 0), n = d(() => D(J).event && [
								6,
								7,
								16
							].includes(D(J).event.kind) ? A()(zn(D(J).event.kind)) : null), i = d(() => D(J).event ? _t({
								ownerPubkey: P(),
								structure: D(J).event,
								relayHints: D(J).relayHints,
								rxNostr: M(),
								relayConfig: N()
							}) : void 0);
							dt(o, {
								get post() {
									return D(Y);
								},
								get onReactionPost() {
									return D(e);
								},
								get reactionExtras() {
									return fe;
								},
								get reactionDetails() {
									return me;
								},
								get preview() {
									return D(J);
								},
								get author() {
									return r;
								},
								get footerMenu() {
									return de;
								},
								get channelText() {
									return D(Ln);
								},
								get model() {
									return D(t);
								},
								get targetLabel() {
									return D(n);
								},
								get onRetry() {
									return Pn.retry;
								},
								onImageOpen: (e) => Ur({
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
									return D(i);
								}
							});
						}
						var s = C(o, 2), l = (e) => {
							var t = Ut(), n = w(t, !0);
							_((e) => a(n, e), [() => A()("postHistory.deleteFailed")]), i(e, t);
						};
						e(s, (e) => {
							D(U) === "failed" && e(l);
						}), c(n), _((e) => g(n, "aria-label", e), [() => A()("composerTarget.preview")]), i(t, n);
					}, se = (t) => {
						var n = Jt(), l = v(n), u = v(l), p = v(u);
						r(p);
						var m = C(p, 4), h = w(m, !0);
						c(u), c(l);
						var ee = C(l, 2), b = (t) => {
							let n = d(() => D(q).event);
							{
								let r = (t) => {
									var r = o(), s = y(r), l = (e) => {
										var t = Gt(), n = v(t), r = w(n, !0), o = C(n, 2), s = w(o, !0);
										c(t), _((e) => {
											a(r, e), a(s, D(Ln));
										}, [() => A()("postHistory.channel")]), i(e, t);
									}, u = (e) => {
										var t = Kt(), r = w(t, !0);
										_((e) => a(r, e), [() => A()(zn(D(n).kind))]), i(e, t);
									}, f = d(() => [
										6,
										7,
										16
									].includes(D(n).kind));
									e(s, (e) => {
										D(Ln) ? e(l) : D(f) && e(u, 1);
									}), i(t, r);
								}, s = (e) => {
									{
										let t = (e) => {
											{
												let t = d(() => he(D(n), D(q).relayHints));
												fe(e, () => D(t));
											}
										}, r = d(() => he(D(n), D(q).relayHints)), i = d(() => F() ? void 0 : Er);
										Ze(e, {
											get post() {
												return D(r);
											},
											get onReactionPost() {
												return D(i);
											},
											reactionExtras: t,
											$$slots: { reactionExtras: !0 }
										});
									}
								}, l = (e) => {
									{
										let t = d(() => he(D(n), D(q).relayHints));
										me(e, () => D(t));
									}
								}, u = d(() => _t({
									ownerPubkey: P(),
									structure: D(n),
									relayHints: D(q).relayHints,
									rxNostr: M(),
									relayConfig: N()
								}));
								Je(t, {
									get event() {
										return D(n);
									},
									get profile() {
										return D(q).profile;
									},
									get model() {
										return D(Rn);
									},
									onImageOpen: (e) => Ur({
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
										return D(u);
									},
									topActions: r,
									footerActions: s,
									footerDetails: l,
									$$slots: {
										topActions: !0,
										footerActions: !0,
										footerDetails: !0
									}
								});
							}
						}, te = (t) => {
							var n = qt(), r = y(n), o = w(r, !0), c = C(r, 2), l = (e) => {
								Se(e, {
									className: "composer-target-related-retry-button",
									get onClick() {
										return Pn.retry;
									},
									children: (e, t) => {
										s();
										var n = f();
										_((e) => a(n, e), [() => A()("postHistory.contextRetry")]), i(e, n);
									},
									$$slots: { default: !0 }
								});
							}, u = d(() => [
								"not-found",
								"error",
								"invalid-target"
							].includes(D(q).status));
							e(c, (e) => {
								D(u) && e(l);
							}), _((e) => a(o, e), [() => A()(D(Bn))]), i(t, n);
						};
						e(ee, (e) => {
							D(q).status === "resolved" && D(q).event && D(Rn) ? e(b) : e(te, -1);
						});
						var x = C(ee, 2), S = (e) => {
							var t = Ut(), n = w(t, !0);
							_((e) => a(n, e), [() => A()("postHistory.deleteFailed")]), i(e, t);
						};
						e(x, (e) => {
							D(U) === "failed" && e(S);
						});
						var ne = C(x, 2);
						ge(ne), c(n), _((e, t) => {
							g(n, "aria-label", e), g(n, "data-reaction-event-id", D(z).event.id), a(h, t);
						}, [() => A()("composerTarget.preview"), () => A()("composerTarget.reaction")]), i(t, n);
					}, ce = (r) => {
						var s = $t(), l = v(s);
						let u;
						var f = v(l), m = (e) => {
							t(e);
						};
						e(f, (e) => {
							D(K).kind === 42 && D(z)?.channelContext && e(m);
						});
						var h = C(f, 2), b = v(h);
						{
							let e = d(() => D(K)?.pubkey ?? ""), t = d(() => D(X)?.displayName), n = d(() => D(X)?.name), r = d(() => D(X)?.picture ?? "");
							Ne(b, {
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
						var te = C(b, 2), x = w(te, !0), S = C(te, 2), ne = w(S);
						c(h);
						var T = C(h, 2), E = (e) => {
							var t = Yt(), n = w(t, !0);
							_((e) => a(n, e), [() => A()(zn(D(K).kind))]), i(e, t);
						}, re = d(() => [
							6,
							7,
							16
						].includes(D(K).kind));
						e(T, (e) => {
							D(re) && e(E);
						});
						var ie = C(T, 2);
						{
							let t = (t) => {
								var n = o(), r = y(n), a = (t) => {
									var n = jt(), r = y(n), a = (e) => {
										var t = Xt();
										_(() => g(t, "id", D(dr))), i(e, t);
									};
									e(r, (e) => {
										D(sr).hasRenderableText || e(a);
									});
									var o = C(r, 2);
									at(o, {
										get expanded() {
											return D(ir);
										},
										get controls() {
											return D(dr);
										},
										onToggle: () => Jn.togglePostExpanded(D(rr).eventId)
									}), i(t, n);
								};
								e(r, (e) => {
									D(rr) && D(ur) && e(a);
								}), i(t, n);
							}, n = d(() => _t({
								ownerPubkey: P(),
								structure: D(K),
								relayHints: D(z)?.relayHints,
								rxNostr: M(),
								relayConfig: N()
							})), r = d(() => D(sr).hasRenderableText && !D(ir) && D(ur));
							we(ie, {
								get model() {
									return D(sr);
								},
								get loadSensitiveBody() {
									return D(n);
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
									return D(dr);
								},
								contentClass: "event-content",
								collapsedContentClass: "event-content-collapsed",
								get renderWhenEmpty() {
									return D(ur);
								},
								get isTextCollapsed() {
									return D(r);
								},
								get previewCollapseAction() {
									return nr;
								},
								get previewCollapseEventId() {
									return D(K).id;
								},
								onImageOpen: Ur,
								betweenContentAndMedia: t,
								$$slots: { betweenContentAndMedia: !0 }
							});
						}
						var ae = C(ie, 2), O = (e) => {
							t(e);
						};
						e(ae, (e) => {
							D(K).kind !== 42 && D(z)?.channelContext && e(O);
						});
						var k = C(ae, 2), oe = (e) => {
							var t = Ut(), n = w(t, !0);
							_((e) => a(n, e), [() => A()("postHistory.deleteFailed")]), i(e, t);
						};
						e(k, (e) => {
							D(U) === "failed" && D(z) && e(oe);
						}), c(l);
						var j = C(l, 2);
						{
							let t = (t) => {
								var n = o(), r = y(n), a = (t) => {
									var n = o(), r = y(n), a = (t) => {
										var n = o(), r = y(n), a = (t) => {
											{
												let n = (t) => {
													var n = o(), r = y(n), a = (e) => {
														{
															let t = d(() => tr(D(Z).totalCount));
															pt(e, {
																get count() {
																	return D(Z).totalCount;
																},
																get expanded() {
																	return D(Qn);
																},
																get ariaLabel() {
																	return D(t);
																},
																onToggle: er
															});
														}
													};
													e(r, (e) => {
														D(Z) && D(Z).totalCount > 0 && e(a);
													}), i(t, n);
												}, r = d(() => D(z).channelContext?.eventId), a = d(() => D(G).includes("reply") ? () => $("reply") : void 0), s = d(() => D(G).includes("quote") ? () => $("quote") : void 0);
												Ze(t, {
													onReactionPost: () => $("reaction"),
													get post() {
														return D(Y);
													},
													get resolvedChannelEventId() {
														return D(r);
													},
													get onReplyPost() {
														return D(a);
													},
													get onQuotePost() {
														return D(s);
													},
													reactionExtras: n,
													$$slots: { reactionExtras: !0 }
												});
											}
										};
										e(r, (e) => {
											D(Y) && e(a);
										}), i(t, n);
									}, s = d(() => !F() && (D(G).includes("reply") || D(G).includes("quote"))), l = (e) => {
										Ze(e, {
											get post() {
												return D(Y);
											},
											onReactionPost: () => $("reaction"),
											reactionExtras: (e) => {
												fe(e, () => D(Y));
											},
											$$slots: { reactionExtras: !0 }
										});
									}, u = d(() => !F() && D(G).includes("reaction") && D(Y)), f = (e) => {
										var t = Qt(), n = v(t);
										{
											let e = d(() => A()("composerTarget.post")), t = d(() => A()("composerTarget.post"));
											Ye(n, {
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
													var n = Zt();
													i(e, n);
												},
												$$slots: { default: !0 }
											});
										}
										c(t), i(e, t);
									}, p = d(() => !F() && D(G).includes("channel"));
									e(r, (e) => {
										D(s) ? e(a) : D(u) ? e(l, 1) : D(p) && e(f, 2);
									}), i(t, n);
								};
								e(r, (e) => {
									D(z) && e(a);
								}), i(t, n);
							}, n = (t) => {
								var n = o(), r = y(n), a = (e) => {
									de(e, () => D(Y));
								};
								e(r, (e) => {
									D(Y) && e(a);
								}), i(t, n);
							}, r = d(() => Oe(D(Vn)));
							Xe(j, {
								get formattedDate() {
									return D(r);
								},
								actions: t,
								trailing: n,
								$$slots: {
									actions: !0,
									trailing: !0
								}
							});
						}
						var se = C(j, 2), ce = (e) => {
							$e(e, {
								get readModel() {
									return D(Z);
								},
								get emojiLoadStateByUrl() {
									return Q.emojiLoadStateByUrl;
								},
								get emojiImageMetaByUrl() {
									return Q.emojiImageMetaByUrl;
								},
								showSingleCount: !0
							});
						};
						e(se, (e) => {
							D(Z) && D(Z).totalCount > 0 && D(Qn) && e(ce);
						}), c(s), ee(s, (e) => p(gn, e), () => D(gn)), _((e) => {
							g(s, "aria-label", e), u = n(l, 1, "target-preview-body svelte-19ui8fd", null, u, { "channel-first": D(K).kind === 42 && !!D(z)?.channelContext }), a(x, D(Wn)), a(ne, `kind ${D(K).kind ?? ""}`);
						}, [() => A()("composerTarget.preview")]), i(r, s);
					};
					e(oe, (e) => {
						D(J) && D(Y) ? e(j) : D(q) && D(z)?.event.kind === 7 && D(Y) ? e(se, 1) : D(K) && e(ce, 2);
					});
					var le = C(oe, 2), pe = (e) => {
						var t = en(), n = w(t, !0);
						_((e) => a(n, e), [() => A()("composerTarget.unsupportedKind")]), i(e, t);
					};
					e(le, (e) => {
						D(z) && D(G).length === 0 && !D(q) && e(pe);
					}), c(l), _((e, t, n) => {
						a(m, e), a(te, t), g(S, "placeholder", n);
					}, [
						() => A()("composerTarget.title"),
						() => A()("composerTarget.inputLabel"),
						() => A()("composerTarget.placeholder")
					]), b(S, () => D(mn), (e) => p(mn, e));
				}
				i(t, l);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var Jr = C(qr, 2);
	ct(Jr, {
		get open() {
			return D(Tn);
		},
		get rawEvent() {
			return D(En);
		},
		onOpenChange: (e) => p(Tn, e, !0)
	});
	var Yr = C(Jr, 2);
	{
		let e = (e) => {
			var t = nn(), n = v(t), r = w(n, !0), o = C(n, 2), s = w(o, !0);
			c(t), _((e, t) => {
				a(r, e), a(s, t);
			}, [() => A()("postHistory.deleteRequestDescription"), () => A()("postHistory.deleteRequestWarning")]), i(e, t);
		}, t = d(() => A()("postHistory.deleteRequestTitle")), n = d(() => A()("postHistory.deleteRequestDescription")), r = d(() => D(U) === "sending" ? A()("postHistory.deleteSending") : A()("postHistory.deleteConfirm")), o = d(() => A()("postHistory.deleteCancel")), s = d(() => D(U) === "sending");
		Ge(Yr, {
			get open() {
				return H.deleteConfirmOpen;
			},
			get onOpenChange() {
				return H.setDeleteConfirmOpen;
			},
			get title() {
				return D(t);
			},
			get description() {
				return D(n);
			},
			get confirmLabel() {
				return D(r);
			},
			get cancelLabel() {
				return D(o);
			},
			confirmVariant: "danger",
			get confirmDisabled() {
				return D(s);
			},
			onConfirm: Ir,
			onCancel: Fr,
			contentClass: "post-history-delete-confirm",
			children: e,
			$$slots: { default: !0 }
		});
	}
	var Xr = C(Yr, 2);
	{
		let e = d(() => D(xn)[D(Sn)]?.src ?? ""), t = d(() => D(xn)[D(Sn)]?.alt ?? "");
		He(Xr, {
			get src() {
				return D(e);
			},
			get alt() {
				return D(t);
			},
			onClose: Wr,
			get mediaList() {
				return D(xn);
			},
			get currentIndex() {
				return D(Sn);
			},
			onNavigate: Gr,
			get openingFocusOrigin() {
				return D(wn);
			},
			get show() {
				return D(Cn);
			},
			set show(e) {
				p(Cn, e, !0);
			}
		});
	}
	var Zr = C(Xr, 2);
	xe(Zr, {
		get show() {
			return D(On);
		},
		get x() {
			return D(kn);
		},
		get y() {
			return D(An);
		},
		children: (e, t) => {
			var n = rn(), r = w(n, !0);
			_((e) => a(r, e), [() => A()(D(jn))]), i(e, n);
		},
		$$slots: { default: !0 }
	}), i(T, Kr), r(), se();
}
export { sn as default };
