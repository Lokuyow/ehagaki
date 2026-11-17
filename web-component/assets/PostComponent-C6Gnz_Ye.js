import { A as e, Et as t, G as n, I as r, K as i, Mt as a, Q as o, T as s, Tt as c, V as l, W as u, X as d, Z as f, ct as p, dt as m, et as ee, f as h, ft as g, gt as _, it as v, k as y, mt as b, n as x, nt as S, o as te, pt as C, r as w, rt as T, s as ne, st as E, t as D, ut as O, vt as k, w as A, xt as j, y as M, z as N } from "./index-client-XkLzkVYC.js";
import { n as P, v as re, x as ie } from "./relayConfigUtils-B4Q_AO1M.js";
import { t as ae } from "./nostrHexUtils-C4ICTS7z.js";
import { pt as oe, t as se } from "./LoadingPlaceholder-lit91akO.js";
import { n as F, v as ce } from "./ehagakiDb-DZENFSwt.js";
import { r as I } from "./query-Bp8561W2.js";
import { A as le, B as ue, G as L, V as R, c as z, ct as B, it as de, q as V, s as H, t as fe } from "./nip65RelayDirectory-DWSms_SU.js";
import { c as U, i as W, n as pe, o as me, r as he, t as ge } from "./postEventBuilder-BlIBIiSK.js";
import { r as _e } from "./authStore.svelte-DWJhnXxr.js";
import { f as ve, m as ye } from "./relayStore.svelte-Df3SPXmc.js";
import { Z as be, c as xe, r as Se, s as Ce } from "./appUtils-BRia-Jm6.js";
import { a as G, i as we, n as Te, t as Ee, u as De } from "./signedEventResultValidator-CnvxVz7l.js";
import { n as Oe } from "./settingsStore.svelte-Cja5YPJC.js";
import { C as K, S as ke, _ as Ae, a as je, b as Me, p as Ne, v as Pe, x as Fe, y as Ie } from "./uploadStore.svelte-D-WzsUY_.js";
import { i as Le, n as Re, u as ze } from "./nip46Service-CClbdsGu.js";
import { n as Be, u as Ve } from "./clipboardUtils-DL4u_EPs.js";
import { C as He, D as Ue, E as We, F as Ge, I as Ke, M as qe, N as Je, O as Ye, P as Xe, S as Ze, T as Qe, a as q, b as $e, d as et, f as tt, i as nt, j as rt, k as it, l as at, n as J, o as ot, r as Y, s as st, t as ct, u as lt, w as ut, x as dt } from "./editorStore.svelte-eXm0Kg6r.js";
import { _ as ft, c as pt, g as mt, p as ht, t as gt } from "./mediaNodeUtils-DBvcDde_.js";
import { t as _t } from "./keyboardFocusUtils-EFYjXEKy.js";
import { n as vt, r as yt } from "./reactionValue-B-C8DjXA.js";
import { n as bt, t as xt } from "./fileUtils-Bgnlkhhb.js";
import { a as St, d as Ct, f as wt, l as Tt, n as Et, o as Dt, r as Ot, s as kt, t as At, u as jt } from "./uploadHelper-0E6CEqpV.js";
import { t as Mt } from "./postMediaCacheRepository-CW1GBAud.js";
import { $ as Nt, A as Pt, I as Ft, J as It, K as Lt, L as Rt, N as zt, Q as Bt, R as X, X as Vt, Z as Ht, _t as Ut, et as Wt, j as Gt, k as Kt, o as qt, ot as Jt, s as Yt, ut as Xt, x as Zt } from "./App-B2GhfviI.js";
import { t as Qt } from "./postSignerResolver-Caq8jRoo.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/submittedComposition.ts
var $t = class {
	onPhaseChange;
	editor = null;
	cleanupListeners;
	frame;
	generation = 0;
	domCompositionActive = !1;
	phase = null;
	capturedGeneration;
	capturedId;
	constructor(e) {
		this.onPhaseChange = e;
	}
	setPhase(e) {
		this.phase = e, this.onPhaseChange?.(e);
	}
	scheduleRetire() {
		let e = this.editor?.view?.dom?.ownerDocument.defaultView;
		e ? (this.frame !== void 0 && e.cancelAnimationFrame(this.frame), this.frame = e.requestAnimationFrame(() => {
			this.frame = void 0, this.phase === "stale" && !this.domCompositionActive && this.retire();
		})) : this.retire();
	}
	attach(e) {
		this.editor && this.editor !== e && this.retire(), this.cleanupListeners?.(), this.editor = e;
		let t = e.view?.dom;
		if (!t) return;
		let n = t.ownerDocument.defaultView;
		if (!n) return;
		let r = () => {
			this.domCompositionActive = !0, this.generation += 1, this.phase === "stale" && this.retire();
		}, i = () => {
			this.domCompositionActive = !1, this.phase === "stale" && this.scheduleRetire();
		};
		t.addEventListener("compositionstart", r, !0), t.addEventListener("compositionend", i, !0), this.cleanupListeners = () => {
			t.removeEventListener("compositionstart", r, !0), t.removeEventListener("compositionend", i, !0), this.frame !== void 0 && n.cancelAnimationFrame(this.frame), this.frame = void 0, this.cleanupListeners = void 0;
		};
	}
	detach() {
		this.retire(), this.cleanupListeners?.(), this.cleanupListeners = void 0, this.editor = null;
	}
	getCurrentGeneration() {
		return this.generation;
	}
	startSession(e) {
		this.setPhase("continuing"), this.capturedGeneration = this.generation, this.capturedId = e.idsByGeneration.get(this.generation);
	}
	decideTransaction({ transaction: e, observerState: t }) {
		if (!this.phase) return "default";
		let n = e.getMeta("composition");
		if (this.phase === "stale" || n === void 0 || this.capturedGeneration !== this.generation) return "reject";
		if (this.capturedId === void 0) {
			let e = t.idsByGeneration.get(this.capturedGeneration);
			if (e !== void 0) this.capturedId = e;
			else return "allow";
		}
		return Object.is(this.capturedId, n) ? "allow" : "reject";
	}
	isCompositionInputAllowed() {
		return this.phase === "continuing" && this.capturedGeneration === this.generation;
	}
	isReadOnly() {
		return this.phase === "stale";
	}
	markStale() {
		this.phase === "continuing" && (this.setPhase("stale"), this.domCompositionActive || this.scheduleRetire());
	}
	markFailure() {
		this.retire();
	}
	retire() {
		this.setPhase(null), this.capturedGeneration = void 0, this.capturedId = void 0, this.frame !== void 0 && ((this.editor?.view.dom.ownerDocument.defaultView)?.cancelAnimationFrame(this.frame), this.frame = void 0);
	}
	destroy() {
		this.retire(), this.setPhase("disposed"), this.cleanupListeners?.(), this.cleanupListeners = void 0, this.editor = null;
	}
}, en = 3e3, tn = 3e4;
function nn(e) {
	return JSON.stringify({
		reply: e.reply?.eventId ?? null,
		quotes: e.quotes.map((e) => e.eventId)
	});
}
function rn() {
	return {
		authorWrite: !1,
		additional: !1,
		recipients: /* @__PURE__ */ new Set()
	};
}
function an(e, t, n = !1, r = !1) {
	let i = [], a = [], o = [], s = [], c = [];
	for (let n of e) {
		let e = t.get(n);
		e?.accepted && i.push(n), e?.rejected && a.push(e.rejected), e?.timedOut && o.push(n), e?.unconfirmed && c.push(n), e?.authRequired && !e.accepted && !e.rejected && s.push(n);
	}
	let l = i.length > 0, u = o.length > 0 || c.length > 0, d = a.length > 0 || u;
	return {
		status: l ? d ? "partial" : "delivered" : r ? "cancelled" : n || e.length === 0 ? "unavailable" : "not-delivered",
		requestedRelays: [...e],
		acceptedRelays: i,
		rejectedRelays: a,
		timedOutRelays: o,
		authRequiredRelays: s,
		unconfirmedRelays: c
	};
}
var on = class {
	deps;
	rxNostr = null;
	eventSender = null;
	activeNip65Operations = /* @__PURE__ */ new Set();
	operationGeneration = 0;
	constructor(e, t = {}) {
		this.deps = t, e && this.setRxNostr(e), this.deps.console = t.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = t.authStateStore || _e, this.deps.hashtagStore = t.hashtagStore || Me, this.deps.mediaFreePlacementStore = t.mediaFreePlacementStore || je, this.deps.mediaGalleryStore = t.mediaGalleryStore || K, this.deps.contentWarningStore = t.contentWarningStore || Pe, this.deps.contentWarningReasonStore = t.contentWarningReasonStore || Ae, this.deps.keyManager = t.keyManager || ze, this.deps.createImetaTagFn = t.createImetaTagFn || kt, this.deps.settingsStore = t.settingsStore || Oe, this.deps.writeRelaysStore = t.writeRelaysStore || ve, this.deps.replyQuoteState = t.replyQuoteState || Gt, this.deps.getClientTagFn = t.getClientTagFn || (() => Le(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = t.seckeySignerFn || ce, this.deps.extractContentWithImagesFn = t.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = t.extractContentWithEmojiTagsFn || (t.extractContentWithImagesFn ? (e) => ({
			content: t.extractContentWithImagesFn(e),
			emojiTags: []
		}) : Je), this.deps.extractImageBlurhashMapFn = t.extractImageBlurhashMapFn || Tt, this.deps.resetEditorStateFn = t.resetEditorStateFn || q, this.deps.resetPostStatusFn = t.resetPostStatusFn || ot, this.deps.notificationPort = t.iframeMessageService || t.notificationPort || Jt, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = t.hashtagPinStore || Fe, this.deps.saveHashtagsToHistoryFn = t.saveHashtagsToHistoryFn || Qe, this.deps.clearReplyQuoteFn = t.clearReplyQuoteFn || Pt, this.deps.saveSensitivePayloadFn = t.saveSensitivePayloadFn || ((e) => H.putCandidate(e));
	}
	setRxNostr(e) {
		this.eventSender && this.cancelActiveNip65Operations(!0), this.rxNostr = e, this.eventSender = new pe(e, this.deps.console || console);
	}
	cancelActiveNip65Operations(e = !1) {
		e && (this.operationGeneration += 1);
		for (let t of this.activeNip65Operations) (e || !t.acknowledged()) && (t.cancel(), this.activeNip65Operations.delete(t));
	}
	clearReplyQuoteAfterSuccess() {
		this.deps.clearReplyQuoteFn?.();
	}
	getReplyQuoteNotifyOptions() {
		let e = this.deps.replyQuoteState.value, t = Array.from(new Set(e.quotes.map((e) => e.eventId)));
		if (e.reply || t.length !== 0) return {
			...e.reply ? { replyToEventId: e.reply.eventId } : {},
			...t.length > 0 ? { quotedEventIds: t } : {}
		};
	}
	getReplyQuoteIdentity() {
		return nn(this.deps.replyQuoteState.value);
	}
	notifyPostFailure(e) {
		return this.deps.notificationPort?.notifyPostError(e), {
			success: !1,
			error: e
		};
	}
	handleSubmissionError(e) {
		return this.deps.console?.error(e, {
			stage: "submission",
			reason: "unexpected"
		}), this.notifyPostFailure("post_error");
	}
	async buildSubmissionEvent(e) {
		return {
			...await ge.buildEvent(e.processedContent, e.hashtags, e.tags, e.pubkey, e.imageImetaMap, this.deps.createImetaTagFn, this.deps.getClientTagFn, e.contentWarningEnabled, e.contentWarningReason, e.replyQuoteTags, e.channelContext, e.emojiTags, e.failClosedContentWarning, e.publicationKind),
			pubkey: e.pubkey
		};
	}
	async buildNip22ReplyTags(e, t) {
		return L(e, t);
	}
	finalizeSubmittedPost(e, t, n, r = !0) {
		return e.success ? (Promise.resolve(this.deps.saveHashtagsToHistoryFn?.(t)).catch(() => {
			this.deps.console?.warn?.("hashtag_history_save_failed", {
				stage: "post-success",
				reason: "unexpected"
			});
		}), r && this.clearReplyQuoteAfterSuccess(), this.deps.notificationPort?.notifyPostSuccess({
			...n,
			...e.eventId ? { eventId: e.eventId } : {}
		}), e) : (this.deps.notificationPort?.notifyPostError(e.error), e);
	}
	async saveSubmittedPostHistory(e) {
		if (!e.result.success || !this.deps.savePostHistoryFn) return;
		let t = P.sanitizeExternalRelayUrls(e.result.acceptedRelays), n = P.sanitizeExternalRelayUrls([
			...t,
			...e.additionalWriteRelays ?? [],
			...e.writeRelayHintSnapshot
		], { limit: 3 });
		try {
			let r = await de(F, e.event.pubkey);
			await this.deps.savePostHistoryFn({
				event: e.event,
				attestation: e.attestation,
				acceptedRelays: t,
				relayHints: n
			}), Ut(e.event.id, e.event.pubkey, e.result, r).catch(() => void 0);
		} catch {
			this.deps.console?.warn?.("post_history_save_failed", {
				stage: "post-history",
				reason: "unexpected"
			});
		}
	}
	captureAuthorWriteRelays() {
		return Object.freeze(P.sanitizeExternalRelayUrls([...Object.values(this.rxNostr?.getDefaultRelays() ?? {}).filter((e) => e.write).map((e) => e.url), ...this.deps.writeRelaysStore?.value ?? []]));
	}
	async publishSignedEvent(e) {
		let t = B(e.event);
		return e.isCurrent?.() === !1 || !t || t.event.pubkey !== e.sessionPubkey ? {
			success: !1,
			error: "post_error"
		} : this.publishNip65Event({
			...e,
			event: t.event
		});
	}
	async publishNip65Event(e) {
		let t = !1, n, r, i, a = new Promise((e) => {
			r = e;
		}), o = new Promise((e) => {
			i = e;
		});
		return (async () => {
			let i = this.eventSender, a = this.rxNostr;
			if (!i || !a) return {
				success: !1,
				error: "nostr_not_ready"
			};
			let s = this.deps.authStateStore, c = s.value, l = this.operationGeneration, u = Date.now(), d = u + en, f = u + tn, p = e.authorWriteRelaySnapshot;
			if (ye() && p.length === 0) return {
				success: !1,
				fullyDelivered: !1,
				error: "no_write_relays",
				acceptedRelays: [],
				delivery: {
					authorWrite: an([], /* @__PURE__ */ new Map(), !0),
					taggedUserRead: {},
					additional: []
				}
			};
			let m = P.sanitizeExternalRelayUrls([...e.additionalWriteRelays ?? []]), ee = Array.from(new Set((e.sensitive?.structureTemplate.tags ?? e.event.tags ?? []).flatMap((e) => {
				if (!Array.isArray(e) || e[0] !== "p") return [];
				let t = e[1];
				return ae(t) ? [t] : [];
			}))), h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Set(), S = Promise.resolve(), te;
			e.event?.pubkey && de(F, e.event.pubkey).then((e) => {
				te = e;
			});
			let C, w, T, ne = !1, E = /* @__PURE__ */ new Set(), D = [], O = !0, k = !0, A = !1, j, M = !1, N = U(a, [...p, ...m], ee.length > 0), re = () => N.update([
				...p,
				...m,
				...E
			], [...v].filter(([, e]) => e.accepted).map(([e]) => e), O && ee.length > 0, p.length === 0 || !O && ee.some((e) => _.get(e) !== "found")), ie = new AbortController(), oe, se = new Promise((e) => {
				oe = e;
			}), ce, le = new Promise((e) => {
				ce = e;
			}), ue = () => {
				k = !1, O = !1, ie.abort();
				for (let e of E) {
					let t = v.get(e);
					!t?.accepted && !t?.rejected && v.set(e, {
						...t,
						unconfirmed: !0,
						...A ? {} : { timedOut: !0 }
					});
				}
				M = !0, re(), N.finish(A), ce();
			}, L = new I(12e3, (e) => {
				e === "cancelled" && (A = !0), ue();
			});
			me(a, L);
			let R = {
				acknowledged: () => t,
				cancel: () => {
					k && (k = !1, A = !0, O = !1, oe(), L.finish("cancelled"));
				}
			};
			this.activeNip65Operations.add(R);
			let z = () => {
				if (!k || M || ne || Date.now() >= f) return !1;
				let n = s.value;
				return l !== this.operationGeneration || this.rxNostr !== a || this.eventSender !== i || n !== c || !n.isAuthenticated || n.pubkey !== e.sessionPubkey || !t && e.isCurrent?.() === !1 ? (R.cancel(), !1) : !0;
			}, B = (e) => {
				let t = h.get(e);
				return t || (t = rn(), h.set(e, t)), t;
			};
			p.forEach((e) => {
				B(e).authorWrite = !0;
			}), m.forEach((e) => {
				B(e).additional = !0;
			});
			let V = (i, a, s = !0, c = v) => {
				if (M) return;
				s && i.error && (j = i.error);
				let l = new Set(P.sanitizeExternalRelayUrls(i.acceptedRelays)), u = new Map((i.rejectedRelays ?? []).map((e) => [P.normalizeExternalRelayUrl(e.relay) ?? e.relay, e])), d = new Set(P.sanitizeExternalRelayUrls(i.timedOutRelays)), f = new Set(P.sanitizeExternalRelayUrls(i.authRequiredRelays));
				for (let e of a) c.get(e)?.accepted || (l.has(e) ? c.set(e, { accepted: !0 }) : u.has(e) ? c.set(e, {
					rejected: {
						...u.get(e),
						relay: e
					},
					...f.has(e) ? { authRequired: !0 } : {}
				}) : d.has(e) ? c.set(e, {
					timedOut: !0,
					unconfirmed: !0,
					...f.has(e) ? { authRequired: !0 } : {}
				}) : c.set(e, {
					unconfirmed: !0,
					...f.has(e) ? { authRequired: !0 } : {}
				}));
				if (c === y) for (let e of a) {
					let t = y.get(e);
					b.has(e) || v.set(e, t?.accepted ? { unconfirmed: !0 } : { ...t }), t?.accepted && H(e);
				}
				c === v && !t && [...v.values()].some((e) => e.accepted) && (t = !0, n = {
					success: !0,
					eventId: T?.id ?? e.event.id,
					acceptedRelays: [...v].filter(([, e]) => e.accepted).map(([e]) => e),
					deliveryPending: !0,
					deliverySettled: o
				}, r(n)), re();
			}, H = (t) => {
				let n = e.sensitive;
				if (!n || x.has(t)) return;
				x.add(t), w ??= t;
				let r = [...y].filter(([, e]) => e.accepted).map(([e]) => e), a = S.then(async () => {
					try {
						await this.deps.saveSensitivePayloadFn?.({
							event: e.event,
							attestation: n.payloadAttestation,
							acceptedRelays: r,
							relayHints: [...h.keys()],
							...typeof te == "number" ? { localWriteScope: {
								ownerPubkeyHex: e.event.pubkey,
								expectedRevision: te,
								isActive: () => z()
							} } : {}
						});
					} catch {
						this.deps.console?.warn?.("sensitive_payload_cache_save_failed", {
							stage: "payload-publish",
							reason: "storage"
						});
					}
				});
				S = a, C ??= a.then(async () => {
					if (!z()) return null;
					try {
						let e = await n.signStructure(w);
						return z() ? (T = e, e) : null;
					} catch {
						return ne = !0, j = "post_error", null;
					}
				});
				let o = (async () => {
					if (await a, !z()) return;
					let e = await C;
					if (!e || !z() || b.has(t)) return;
					b.add(t), v.set(t, { unconfirmed: !0 });
					let n = await i.sendEvent(e, {
						targetRelays: [t],
						includeDefaultWriteRelays: !1,
						waitForAllRelays: !0,
						authDeadlineAt: f,
						settleSignal: ie.signal,
						operation: L,
						onProgress: (e) => V(e, [t], !1)
					});
					V(n, [t]);
				})().catch(() => {
					j = "post_network_error";
				});
				D.push(o);
			}, W = (t) => {
				for (let n of P.sanitizeExternalRelayUrls(t)) {
					if (!z() || E.has(n)) continue;
					E.add(n), re();
					let t = i.sendEvent(e.event, {
						targetRelays: [n],
						includeDefaultWriteRelays: !1,
						waitForAllRelays: !0,
						authDeadlineAt: f,
						settleSignal: ie.signal,
						operation: L,
						onProgress: (e) => V(e, [n], !1, y)
					}).then((e) => V(e, [n], !0, y)).catch(() => V({
						success: !1,
						error: "post_network_error"
					}, [n], !0, y));
					D.push(t);
				}
			}, pe = (t) => {
				if (!z() || !O) return;
				if (e.sensitive) {
					W(t);
					return;
				}
				let n = P.sanitizeExternalRelayUrls(t).filter((e) => !E.has(e));
				if (n.length === 0) return;
				n.forEach((e) => E.add(e)), re();
				let r = i.sendEvent(e.event, {
					targetRelays: n,
					includeDefaultWriteRelays: !1,
					waitForAllRelays: !0,
					authDeadlineAt: f,
					settleSignal: ie.signal,
					operation: L,
					onProgress: (e) => V(e, n, !1)
				}).then((e) => V(e, n)).catch(() => {
					j = "post_network_error";
					for (let e of n) v.has(e) || v.set(e, { unconfirmed: !0 });
				});
				D.push(r);
			};
			try {
				let t = P.sanitizeExternalRelayUrls([...p, ...m]);
				if (e.sensitive) t.length === 0 && (j = "no_write_relays"), W(t);
				else {
					t.forEach((e) => E.add(e));
					let n = i.sendEvent(e.event, {
						targetRelays: t,
						includeDefaultWriteRelays: !1,
						waitForAllRelays: !0,
						authDeadlineAt: f,
						settleSignal: ie.signal,
						operation: L,
						onProgress: (e) => V(e, t, !1)
					}).then((e) => V(e, t)).catch(() => {
						j = "post_network_error";
						for (let e of t) v.has(e) || v.set(e, { unconfirmed: !0 });
					});
					D.push(n);
				}
				let n = ee.map(async (t) => {
					try {
						let n = this.deps.nip65ReadRelayLookupFn ? await this.deps.nip65ReadRelayLookupFn(t, {
							discoveryRelays: e.discoveryRelaysByRecipient?.[t],
							deadlineAt: d,
							operation: L,
							resolveOnReadRoute: !0
						}) : await fe(a).lookup(t, {
							discoveryRelays: e.discoveryRelaysByRecipient?.[t],
							deadlineAt: d,
							operation: L,
							resolveOnReadRoute: !0
						});
						if (!O || !z()) return;
						let r = P.sanitizeExternalRelayUrls(n.readRelays);
						g.set(t, new Set(r)), _.set(t, r.length > 0 ? "found" : "unavailable"), r.forEach((e) => B(e).recipients.add(t)), pe(r);
					} catch {
						O && z() && (g.set(t, /* @__PURE__ */ new Set()), _.set(t, "unavailable"));
					}
				}), r = {};
				n.length > 0 && await Promise.race([
					Promise.all(n),
					se,
					le,
					new Promise((e) => {
						L.schedule(r, d, e);
					})
				]), L.unschedule(r), O = !1;
				for (let e of ee) _.has(e) || (g.set(e, /* @__PURE__ */ new Set()), _.set(e, A ? "cancelled" : "unavailable"));
				re(), await Promise.race([(async () => {
					let e = 0;
					for (; e < D.length;) {
						let t = D.slice(e);
						e = D.length, await Promise.all(t);
					}
				})(), le]), ue(), await S;
				let o = (t, n = !1, r = !1) => an(t, v, n, r || e.sensitive !== void 0 && A), s = o(p, p.length === 0), c = Object.fromEntries(ee.map((e) => {
					let t = [...g.get(e) ?? []], n = _.get(e);
					return [e, o(t, n === "unavailable", n === "cancelled")];
				})), l = m.length > 0 ? [o(m)] : [], u = {
					authorWrite: s,
					taggedUserRead: c,
					additional: l
				}, h = P.sanitizeExternalRelayUrls([...v.entries()].filter(([, e]) => e.accepted).map(([e]) => e)), b = [...v.values()].flatMap((e) => e.rejected ? [e.rejected] : []), x = [...v.entries()].filter(([, e]) => e.timedOut).map(([e]) => e), te = [...v.entries()].filter(([, e]) => e.authRequired).map(([e]) => e), C = h.length > 0, w = s.acceptedRelays.length > 0 && Object.values(c).every((e) => e.acceptedRelays.length > 0) && l.every((e) => e.acceptedRelays.length > 0), ne = x.length > 0 || [...v.values()].some((e) => e.unconfirmed), k = C ? void 0 : e.sensitive && [...y.values()].some((e) => e.accepted) ? "postComponent.error.sensitive_partial_publish" : j ?? (ne ? "post_timeout" : "post_rejected");
				return {
					success: C,
					fullyDelivered: w,
					...k ? { error: k } : {},
					...C ? { eventId: T?.id ?? e.event.id } : {},
					acceptedRelays: h,
					...b.length ? { rejectedRelays: b } : {},
					...x.length ? { timedOutRelays: x } : {},
					...te.length ? { authRequiredRelays: te } : {},
					delivery: u
				};
			} finally {
				M = !0, L.finish("complete"), R.cancel(), this.activeNip65Operations.delete(R);
			}
		})().then(i, () => i(n ? {
			...n,
			deliveryPending: !1,
			deliverySettled: void 0,
			fullyDelivered: !1
		} : {
			success: !1,
			error: "post_network_error"
		})), Promise.race([a, o]);
	}
	async sendPreparedEvent(e) {
		this.deps.console?.debug?.("[PostManager] sendPreparedEvent start", { eventKind: e.event?.kind });
		let t = this.eventSender, n = this.rxNostr, r = this.deps.authStateStore.value, i = this.operationGeneration, a = e.signEvent ?? (typeof e.signer?.signEvent == "function" ? e.signer.signEvent.bind(e.signer) : void 0);
		if (e.signer && !a) return this.notifyPostFailure("nostr_sign_event_not_supported");
		let o = () => {
			let a = this.deps.authStateStore.value;
			return a === r && a.isAuthenticated && a.pubkey === e.sessionPubkey && this.rxNostr === n && this.eventSender === t && this.operationGeneration === i;
		}, s = async (t) => {
			if (we(this.deps.authStateStore, e.sessionPubkey), !o()) throw Error("post_event_runtime_changed");
			if (e.signer && !a) throw Error("nostr_sign_event_not_supported");
			let n = Ee(t), r = a ? await a(n.signerTemplate) : t;
			if (!o()) throw Error("post_event_session_changed");
			let i = Te(n.expectedTemplate, r, e.sessionPubkey), s = B(i);
			if (!s) throw Error("post_error");
			return s;
		}, c = e.splitSensitiveContent && e.event.tags.some((e) => e[0] === "content-warning"), l = null, u;
		try {
			u = await s(c ? ue(e.event.kind, e.event.content, e.sessionPubkey, e.event.created_at) : e.event);
		} catch {
			return this.notifyPostFailure("post_error");
		}
		c || (l = u);
		let d = await this.publishNip65Event({
			event: u.event,
			authorWriteRelaySnapshot: e.authorWriteRelaySnapshot,
			sessionPubkey: e.sessionPubkey,
			additionalWriteRelays: e.additionalWriteRelays,
			discoveryRelaysByRecipient: e.discoveryRelaysByRecipient,
			...c ? { sensitive: {
				structureTemplate: e.event,
				payloadAttestation: u.attestation,
				signStructure: async (t) => {
					let n = await s(R(e.event, u.event.id, t));
					return l = n, n.event;
				}
			} } : {}
		});
		if (d.error === "postComponent.error.sensitive_partial_publish") return this.deps.notificationPort?.notifyPostError({ code: "sensitive_partial_publish" }), d;
		let f = l, p = d.success && f ? {
			...d,
			eventId: f.event.id,
			event: f.event
		} : d;
		if (d.success && f) try {
			Promise.resolve(this.deps.storeSignedEventsFn?.(c ? [u, f] : [u], o)).catch(() => void 0);
		} catch {}
		f && await this.saveSubmittedPostHistory({
			event: f.event,
			attestation: f.attestation,
			result: p,
			additionalWriteRelays: e.additionalWriteRelays,
			writeRelayHintSnapshot: e.writeRelayHintSnapshot
		});
		let m = !o();
		return this.finalizeSubmittedPost(m ? {
			...p,
			preserveComposerContent: !0
		} : p, e.hashtags, e.rqNotifyOptions, !m && this.getReplyQuoteIdentity() === e.replyQuoteIdentity);
	}
	validatePost(e) {
		let t = this.deps.authStateStore;
		return he.validatePost(e, t.value.isAuthenticated, !!this.rxNostr);
	}
	async resolveSubmissionSigner(e) {
		let { auth: t, sessionPubkey: n, keyManager: r, windowObj: i } = e, a = (e) => Qt({
			authType: t.type,
			pubkey: t.pubkey,
			window: i,
			nip46Signer: e,
			getParentClientSigner: () => this.deps.getParentClientSignerFn?.(),
			getStoredSecretKey: (e) => r.getFromStore() || r.loadFromStorage(e),
			createSecretKeySigner: (e) => this.deps.seckeySignerFn ? this.deps.seckeySignerFn(e) : ce(e)
		}), o = (e, t, n) => e.ok ? {
			pubkey: t,
			errorLabel: n,
			credentials: e.source === "nip07" ? {
				signEvent: e.signEvent,
				logSignedEvent: !0
			} : { signEvent: e.signEvent }
		} : { failure: this.notifyPostFailure(e.error) };
		if (t.type === "nip07") {
			let e = "window.nostrでの投稿エラー:";
			try {
				return t.pubkey ? o(a(), t.pubkey, e) : { failure: this.notifyPostFailure("pubkey_not_found") };
			} catch {
				return { failure: this.handleSubmissionError(e) };
			}
		}
		if (t.type === "nip46") {
			let e = "NIP-46での投稿エラー:";
			try {
				let n = t.pubkey;
				if (!n) return { failure: this.notifyPostFailure("pubkey_not_found") };
				let r = await this.deps.getNip46SignerForSessionFn?.(n), i = this.deps.authStateStore.value;
				return !r || !i.isAuthenticated || i.type !== "nip46" || i.pubkey !== n ? { failure: this.notifyPostFailure("nip46_signer_not_available") } : o(a(r), n, e);
			} catch {
				return { failure: this.handleSubmissionError(e) };
			}
		}
		if (t.type === "parentClient") {
			let e = a();
			return e.ok ? t.pubkey ? o(e, t.pubkey, "親クライアント連携での投稿エラー:") : { failure: this.notifyPostFailure("pubkey_not_found") } : { failure: this.notifyPostFailure(e.error) };
		}
		return o(a(), n, "投稿エラー:");
	}
	async submitPost(e, t, n = []) {
		let r = W(e), i = this.deps.settingsStore.quoteNotificationEnabled, a = this.deps.replyQuoteService?.extractInlineQuoteTags?.(r, i) ?? new Zt().extractInlineQuoteTags(r, i), o = this.deps.replyQuoteState.value;
		if (o.quotes.length > 0) {
			let e = this.deps.replyQuoteService || new Zt(), t = new Set(a.filter((e) => e[0] === "q").map((e) => e[1])), n = o.quotes.filter((e) => !t.has(e.eventId)).map((t) => e.generateNostrUri(t.eventId, t.relayHints, t.authorPubkey));
			n.length > 0 && (r = `${r.trimEnd()}\n${n.join("\n")}`.trim());
		}
		let s = this.validatePost(r);
		if (!s.valid) return this.notifyPostFailure(s.error);
		if (!this.eventSender) return this.notifyPostFailure("nostr_not_ready");
		try {
			let e = this.deps.authStateStore, i = G(e), o = this.deps.hashtagStore, { hashtags: s, tags: c } = this.getHashtagArrays(o), l = this.deps.keyManager, u = this.deps.window || (typeof window < "u" ? window : void 0), d = this.deps.contentWarningStore.value, f = this.deps.contentWarningReasonStore.value, p = this.deps.settingsStore.failClosedContentWarning === !0, m = this.deps.channelContextState?.value ?? null, ee = Object.freeze(P.sanitizeExternalRelayUrls(m?.channelRelays)), h = this.captureAuthorWriteRelays();
			if (ye() && h.length === 0) return this.notifyPostFailure("no_write_relays");
			let g = P.sanitizeExternalRelayUrls(this.deps.writeRelaysStore?.value ?? []), _ = this.deps.replyQuoteState.value, v, y = this.getReplyQuoteNotifyOptions(), b = _.reply?.referencedEvent ?? null;
			if (_.reply && !m && (!b || b.id !== _.reply.eventId || ![
				1,
				7,
				1111
			].includes(b.kind) || _.reply.authorPubkey && b.pubkey !== _.reply.authorPubkey)) return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
			let x = V({
				channel: !!m,
				hasReply: !!_.reply,
				...b ? { replyKind: b.kind } : {}
			});
			if (x === null) return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
			if (_.reply || _.quotes.length > 0) {
				let e = this.deps.replyQuoteService || new Zt();
				if (v = [], _.reply) {
					if (m) v.push([
						"e",
						_.reply.eventId,
						_.reply.relayHints[0] || "",
						"reply",
						..._.reply.authorPubkey ? [_.reply.authorPubkey] : []
					]), e.buildReplyTags(_.reply).filter((e) => e[0] === "p").forEach((e) => {
						v.push(e);
					});
					else if (x === 1111) {
						let t = b ? await this.buildNip22ReplyTags(b, _.reply.relayHints[0] ?? "") : null;
						if (!t) return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
						if (v.push(...t), x === 1111) {
							let t = new Set(v.filter((e) => e[0] === "p").map((e) => e[1]));
							e.buildReplyTags(_.reply).filter((e) => e[0] === "p").forEach((e) => {
								t.has(e[1]) || (t.add(e[1]), v.push(e));
							});
						}
					} else v.push(...e.buildReplyTags(_.reply));
				}
				let t = /* @__PURE__ */ new Set(), n = new Set(v.filter((e) => e[0] === "p").map((e) => e[1]));
				_.quotes.forEach((r) => {
					e.buildQuoteTags(r, r.quoteNotificationEnabled).forEach((e) => {
						if (e[0] === "q") {
							if (t.has(e[1])) return;
							t.add(e[1]);
						}
						if (e[0] === "p") {
							if (n.has(e[1])) return;
							n.add(e[1]);
						}
						v.push(e);
					});
				});
			}
			let S = {}, te = (e, t, n) => {
				e && n.some((t) => t[0] === "p" && t[1] === e) && (S[e] = P.sanitizeExternalRelayUrls([...S[e] ?? [], ...t]));
			}, C = this.deps.replyQuoteService || new Zt();
			_.reply && te(_.reply.authorPubkey, _.reply.relayHints, C.buildReplyTags(_.reply));
			for (let e of _.quotes) e.quoteNotificationEnabled && te(e.authorPubkey, e.relayHints, C.buildQuoteTags(e, !0));
			if (a.length > 0) {
				v ||= [];
				let e = new Set(v.filter((e) => e[0] === "q").map((e) => e[1])), t = new Set(v.filter((e) => e[0] === "p").map((e) => e[1]));
				for (let n of a) n[0] === "q" && !e.has(n[1]) ? (v.push(n), e.add(n[1])) : n[0] === "p" && !t.has(n[1]) && (v.push(n), t.add(n[1]));
			}
			let w = await this.resolveSubmissionSigner({
				auth: e.value,
				sessionPubkey: i,
				keyManager: l,
				windowObj: u
			});
			if ("failure" in w) return w.failure;
			try {
				let e = await this.buildSubmissionEvent({
					processedContent: r,
					hashtags: s,
					tags: c,
					pubkey: w.pubkey,
					imageImetaMap: t,
					contentWarningEnabled: d,
					contentWarningReason: f,
					failClosedContentWarning: p,
					publicationKind: x,
					replyQuoteTags: v,
					channelContext: m,
					emojiTags: n
				});
				return await this.sendPreparedEvent({
					event: e,
					sessionPubkey: i,
					hashtags: s,
					rqNotifyOptions: y,
					...w.credentials,
					additionalWriteRelays: ee,
					discoveryRelaysByRecipient: S,
					splitSensitiveContent: p,
					authorWriteRelaySnapshot: h,
					writeRelayHintSnapshot: g,
					replyQuoteIdentity: nn(_)
				});
			} catch {
				return this.handleSubmissionError(w.errorLabel);
			}
		} catch {
			return this.handleSubmissionError("投稿エラー:");
		}
	}
	getEventSender() {
		return this.eventSender;
	}
	getHashtagArrays(e) {
		let t = e || this.deps.hashtagStore, n = this.deps.hashtagSnapshotFn;
		if (n) {
			let e = n(t);
			return {
				hashtags: Array.isArray(e?.hashtags) ? [...e.hashtags] : [],
				tags: Array.isArray(e?.tags) ? e.tags.map((e) => [...e]) : []
			};
		}
		if (t === Me) try {
			let e = Ie();
			return {
				hashtags: Array.isArray(e?.hashtags) ? [...e.hashtags] : [],
				tags: Array.isArray(e?.tags) ? e.tags.map((e) => [...e]) : []
			};
		} catch (e) {
			this.deps.console?.warn("hashtag_snapshot_failed", e);
		}
		return {
			hashtags: Array.isArray(t?.hashtags) ? [...t.hashtags] : [],
			tags: Array.isArray(t?.tags) ? t.tags.map((e) => [...e]) : []
		};
	}
	preparePostPayload(e) {
		let t = this.deps.extractContentWithEmojiTagsFn(e);
		if (!this.deps.mediaFreePlacementStore.value) {
			let e = this.deps.mediaGalleryStore.getContentUrls();
			if (e.length > 0) {
				let n = t.content.trim();
				return {
					content: n ? n + "\n" + e.join("\n") : e.join("\n"),
					emojiTags: t.emojiTags
				};
			}
		}
		return t;
	}
	preparePostContent(e) {
		return this.preparePostPayload(e).content;
	}
	prepareImageBlurhashMap(e, t, n) {
		if (!this.deps.mediaFreePlacementStore.value) return this.deps.mediaGalleryStore.getImageBlurhashMap();
		let r = {};
		e?.state?.doc?.descendants?.((e) => {
			if (e.type?.name !== "image" || !e.attrs?.src || e.attrs?.isPlaceholder) return;
			let t = typeof e.attrs.size == "number" ? e.attrs.size : Number(e.attrs.size);
			r[e.attrs.src] = {
				dim: e.attrs.dim ?? void 0,
				alt: e.attrs.alt ?? void 0,
				size: Number.isFinite(t) && t > 0 ? t : void 0,
				uploadProtocol: e.attrs.uploadProtocol ?? void 0
			};
		});
		let i = this.deps.extractImageBlurhashMapFn(e), a = {};
		for (let [e, o] of Object.entries(i)) a[e] = {
			m: Ct(e),
			blurhash: o,
			dim: r[e]?.dim,
			alt: r[e]?.alt,
			size: r[e]?.size,
			uploadProtocol: r[e]?.uploadProtocol,
			ox: t[e],
			x: n[e]
		};
		return a;
	}
	async performPostSubmission(e, t, n, r, i, a, o) {
		let s = this.prepareImageBlurhashMap(e, n, r);
		i?.();
		try {
			let e = await this.submitPost(t.content, s, t.emojiTags);
			e.success ? a?.(e) : o?.(e.error || "post_error");
		} catch {
			o?.("post_error");
		}
	}
	applyEmptyStateToEditor(e) {
		e.chain().clearContent().run();
	}
	resetPostContent(e) {
		this.applyEmptyStateToEditor(e), this.deps.resetEditorStateFn?.(), this.deps.resetPostStatusFn?.(), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), this.deps.clearReplyQuoteFn?.();
	}
	clearContentAfterSuccess(e) {
		let t = this.deps.hashtagPinStore.value, n = t ? this.getHashtagArrays(this.deps.hashtagStore).hashtags : [];
		if (this.applyEmptyStateToEditor(e), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), t && n.length > 0) {
			let t = " " + n.map((e) => "#" + e).join(" ");
			e.commands.insertContent(t);
		}
		e.commands.setTextSelection(1);
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/reactionMediaController.ts
function sn(e) {
	let t = null, n = null, r = (t) => e.getEditor() === t.editor && !t.editor.isDestroyed, i = (t) => r(t) && e.getAuth() === t.auth && e.getRuntime() === t.runtime && e.getEnvironment?.() === t.environment && X.value?.sessionToken === t.token, a = (i) => {
		let a = t;
		if (!a) return;
		t = null;
		let o = n;
		n = null, o?.abort(), o && e.onUploadEnd();
		let s = e.getItems().filter((e) => a.ownedIds.has(e.id)), c = (i === "cancel" || i === "ownership") && r(a), l = s.filter((e) => !e.isPlaceholder), u = new Set(c && e.isFreePlacement() && l.length ? e.restoreItems(a.editor, l) : []);
		for (let t of s) (!c || u.has(t.id) || t.isPlaceholder) && (e.removeItem(t.id), e.removePlaceholderSize(t.id));
		e.onChange();
	}, o = (n = X.value, r = "cancel") => {
		if (t && (!n || n.sessionToken !== t.token) && a(r), t && !i(t)) {
			Ft("ownership"), a("ownership");
			return;
		}
		let o = e.getEditor();
		!t && n && o && !o.isDestroyed && (t = {
			token: n.sessionToken,
			editor: o,
			auth: e.getAuth(),
			runtime: e.getRuntime(),
			environment: e.getEnvironment?.(),
			ownedIds: /* @__PURE__ */ new Set(),
			originalFileNames: /* @__PURE__ */ new Map()
		}, e.onChange());
	}, s = Rt((e, t) => o(e, t));
	return {
		sync: o,
		getContext() {
			return {
				items: e.getItems(),
				ownedItemIds: t?.ownedIds ?? /* @__PURE__ */ new Set(),
				originalFileNames: t?.originalFileNames ?? /* @__PURE__ */ new Map()
			};
		},
		getInputMode() {
			return vt(this.getContext());
		},
		addImageUrls(r) {
			o();
			let a = t, s = r.map((e) => Ve(e) ? e : null);
			if (!a || n || !i(a) || !s.length || s.some((e) => e === null)) return !1;
			for (let t of s) {
				let n = Se();
				a.ownedIds.add(n), e.addItem({
					id: n,
					src: t,
					type: "image",
					isPlaceholder: !1
				});
			}
			return e.onChange(), !0;
		},
		abortUpload() {
			n?.abort();
		},
		beginUpload() {
			o();
			let r = t;
			if (!r || n) return null;
			let a = new AbortController(), s = {
				signal: a.signal,
				abort: () => a.abort(),
				isCurrent: () => t === r && n === s && i(r),
				onPlaceholdersCreated: (t) => {
					s.isCurrent() && (t.forEach((e) => {
						r.ownedIds.add(e.placeholderId), r.originalFileNames.set(e.placeholderId, e.file.name);
					}), e.onChange());
				}
			};
			return n = s, s;
		},
		endUpload(t) {
			n === t && (n = null, e.onChange());
		},
		dispose() {
			t && X.value?.sessionToken === t.token && Ft("ownership"), a("ownership"), s();
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postUploadUtils.ts
function cn(e) {
	return !!e && e.length > 0;
}
function ln(e, t, n) {
	e.isUploading = t, n !== void 0 && (e.uploadErrorMessage = n);
}
function un(e) {
	let t = e.target;
	return t?.files?.length ? t.files : void 0;
}
function dn({ getCurrentEditor: e, getFileInput: t, getImageOxMap: n, getImageXMap: r, getUploadFailedText: i, updateUploadState: a, setUploadErrorMessage: o, uploadFiles: s }) {
	let c = async (c) => cn(c) ? await s({
		files: c,
		currentEditor: e(),
		fileInput: t(),
		updateUploadState: a,
		setUploadErrorMessage: o,
		imageOxMap: n(),
		imageXMap: r(),
		getUploadFailedText: i
	}) ?? null : null;
	return {
		performUpload: c,
		handleFileSelect: (e) => {
			let t = un(e);
			t && c(t);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/postUIStore.svelte.ts
var Z = b({
	showSecretKeyDialog: !1,
	pendingPost: "",
	pendingEmojiTags: [],
	showImageFullscreen: !1,
	fullscreenMediaId: "",
	fullscreenImageSrc: "",
	fullscreenImageAlt: "",
	showFloatingMessage: !1,
	floatingMessageX: 0,
	floatingMessageY: 0,
	floatingMessageText: ""
}), fn;
function pn() {
	fn !== void 0 && (clearTimeout(fn), fn = void 0);
}
var Q = {
	get value() {
		return Z;
	},
	showSecretKeyDialog: (e, t = []) => {
		Z.pendingPost = e, Z.pendingEmojiTags = t.map((e) => [...e]), Z.showSecretKeyDialog = !0;
	},
	hideSecretKeyDialog: () => {
		Z.showSecretKeyDialog = !1, Z.pendingPost = "", Z.pendingEmojiTags = [];
	},
	getPendingPost: () => Z.pendingPost,
	getPendingEmojiTags: () => Z.pendingEmojiTags.map((e) => [...e]),
	showImageFullscreen: (e, t = "", n = "") => {
		Z.fullscreenMediaId = n, Z.fullscreenImageSrc = e, Z.fullscreenImageAlt = t, Z.showImageFullscreen = !0;
	},
	hideImageFullscreen: () => {
		Z.showImageFullscreen = !1, Z.fullscreenMediaId = "", Z.fullscreenImageSrc = "", Z.fullscreenImageAlt = "";
	},
	showFloatingMessage: (e, t, n, r = 1800) => {
		pn(), Z.floatingMessageX = e, Z.floatingMessageY = t, Z.floatingMessageText = n, Z.showFloatingMessage = !0, fn = setTimeout(() => {
			Z.showFloatingMessage = !1, fn = void 0;
		}, r);
	},
	hideFloatingMessage: () => {
		pn(), Z.showFloatingMessage = !1;
	}
}, mn = i("<img draggable=\"false\"/>"), hn = i("<div class=\"video-wrapper svelte-aw59wn\"><video controls=\"\" playsinline=\"\" autoplay=\"\" loop=\"\" preload=\"metadata\" class=\"gallery-video svelte-aw59wn\" draggable=\"false\"><track kind=\"captions\"/></video>  <div class=\"video-drag-overlay svelte-aw59wn\" aria-hidden=\"true\"></div></div>", 2), gn = i("<div role=\"listitem\"><div class=\"gallery-item-media svelte-aw59wn\"><!> <!> <!></div> <!></div>"), _n = {
	hash: "svelte-aw59wn",
	code: ".gallery-item.svelte-aw59wn,\n    .gallery-item-media.svelte-aw59wn,\n    .video-wrapper.svelte-aw59wn {position:relative;}.gallery-item.svelte-aw59wn,\n    .gallery-item-media.svelte-aw59wn,\n    .gallery-image.svelte-aw59wn,\n    .gallery-video.svelte-aw59wn {-webkit-touch-callout:none;}.gallery-item.svelte-aw59wn,\n    .gallery-image.svelte-aw59wn,\n    .gallery-video.svelte-aw59wn {-webkit-user-select:none;user-select:none;}.gallery-item.svelte-aw59wn,\n    .video-drag-overlay.svelte-aw59wn {cursor:grab;}.gallery-item.svelte-aw59wn:active,\n    .video-drag-overlay.svelte-aw59wn:active {cursor:grabbing;}.gallery-item.is-disabled.svelte-aw59wn,\n    .gallery-item.is-disabled.svelte-aw59wn .gallery-item-media:where(.svelte-aw59wn),\n    .gallery-item.is-disabled.svelte-aw59wn .video-drag-overlay:where(.svelte-aw59wn) {cursor:not-allowed;}.gallery-item.is-disabled.svelte-aw59wn {opacity:0.72;}.gallery-item.svelte-aw59wn {display:inline-flex;flex-shrink:0;overflow:visible;transition:transform 0.15s ease,\n            opacity 0.15s ease;.circle {width:40px;height:40px;}}.gallery-item-media.svelte-aw59wn {border-radius:6px;overflow:hidden;display:flex;align-items:center;justify-content:center;}.gallery-item-media[role=\"button\"].svelte-aw59wn {cursor:pointer;background-color:transparent;}.gallery-image.svelte-aw59wn,\n    .gallery-video.svelte-aw59wn {object-fit:cover;display:block;}.gallery-image.svelte-aw59wn {min-width:100px;max-width:180px;height:180px;-webkit-drag:none;&.image-loading {opacity:0;}}.video-wrapper.svelte-aw59wn,\n    .gallery-video.svelte-aw59wn {width:180px;height:180px;}.video-drag-overlay.svelte-aw59wn {position:absolute;inset:0 0 50px;z-index:1;}\n\n    @media (hover: none) and (pointer: coarse) {.video-drag-overlay.svelte-aw59wn {display:none;}\n    }"
};
function vn(n, r) {
	t(r, !0), e(n, _n);
	let i = () => ne(oe, "$_", l), [l, d] = te(), p = w(r, "disabled", 3, !1), m = k(void 0), g = k(void 0), v = Ue();
	We(() => S(m), { onLongPress: (e, t) => {
		p() || r.onTouchDragStart?.(r.index, e, t);
	} });
	let y = j(() => !r.item.isPlaceholder && r.item.type === "image" && !!r.item.src), b = j(() => !r.item.isPlaceholder && r.item.type === "video" && !!r.item.src), x = j(() => {
		if (!r.item.isPlaceholder) return;
		let e = r.item.dimensions;
		if (e && e.width > 0 && e.height > 0) {
			let t = e.width / e.height, n = Math.round(180 * t);
			return `width: ${Math.max(100, Math.min(180, n))}px; height: 180px;`;
		}
		return "width: 180px; height: 180px;";
	});
	function T() {
		r.item.isPlaceholder || r.item.type !== "image" || Q.showImageFullscreen(r.item.src, r.item.alt || "", r.item.id);
	}
	function D(e) {
		if (p()) e.preventDefault();
		else {
			if (S(m) && e.dataTransfer) {
				let t = S(m).getBoundingClientRect(), n = e.clientX - t.left, r = e.clientY - t.top;
				e.dataTransfer.setDragImage(S(m), n, r);
			}
			r.onDragStart(r.index, e);
		}
	}
	function P(e) {
		e.stopPropagation(), S(g) && (S(g).paused ? S(g).play() : S(g).pause());
	}
	function re(e) {
		e.preventDefault(), !p() && r.onDragOver(r.index, e);
	}
	function ie(e) {
		e.preventDefault(), !p() && r.onDrop(r.index);
	}
	function ae(e) {
		r.item.type !== "image" || r.item.isPlaceholder || (e.key === "Enter" || e.key === " " || e.key === "Spacebar") && (e.preventDefault(), T());
	}
	var F = gn();
	let ce;
	var I = O(F), le = O(I), ue = (e) => {
		{
			let t = j(() => r.item.type === "video" ? i()("videoNode.uploading") : i()("imageNode.uploading"));
			se(e, {
				get text() {
					return S(t);
				},
				showLoader: !0
			});
		}
	};
	N(le, (e) => {
		r.item.isPlaceholder && e(ue);
	});
	var L = C(le, 2), R = (e) => {
		var t = mn();
		let n;
		E(() => {
			M(t, "src", r.item.src), M(t, "alt", r.item.alt || ""), n = s(t, 1, "gallery-image svelte-aw59wn", null, n, { "image-loading": !v.isLoaded });
		}), o("load", t, function(...e) {
			v.handleLoad?.apply(this, e);
		}), o("error", t, function(...e) {
			v.handleError?.apply(this, e);
		}), f("contextmenu", t, (e) => e.preventDefault()), ee(t), u(e, t);
	};
	N(L, (e) => {
		S(y) && e(R);
	});
	var z = C(L, 2), B = (e) => {
		var t = hn(), n = O(t);
		n.muted = !0, h(n, (e) => _(g, e), () => S(g));
		var i = C(n, 2);
		a(t), E(() => {
			M(n, "src", r.item.src), M(i, "draggable", !p());
		}), f("contextmenu", n, (e) => e.preventDefault()), o("dragstart", i, D), f("click", i, P), u(e, t);
	};
	N(z, (e) => {
		S(b) && e(B);
	}), a(I);
	var de = C(I, 2), V = (e) => {
		{
			let t = j(() => i()("imageContextMenu.delete")), n = j(() => i()("imageContextMenu.copyUrl")), a = j(() => i()("imageContextMenu.copySuccess"));
			Ye(e, {
				get src() {
					return r.item.src;
				},
				onDelete: () => r.onDelete(r.item.id),
				get deleteAriaLabel() {
					return S(t);
				},
				get copyAriaLabel() {
					return S(n);
				},
				get copySuccessMessage() {
					return S(a);
				},
				layout: "gallery",
				get deleteDisabled() {
					return p();
				}
			});
		}
	};
	N(de, (e) => {
		r.item.isPlaceholder || e(V);
	}), a(F), h(F, (e) => _(m, e), () => S(m)), E(() => {
		ce = s(F, 1, "gallery-item svelte-aw59wn", null, ce, {
			"is-placeholder": r.item.isPlaceholder,
			"is-disabled": p()
		}), M(F, "draggable", !p() && (r.item.type !== "video" || r.item.isPlaceholder)), A(I, S(x)), M(I, "role", r.item.type === "image" && !r.item.isPlaceholder ? "button" : void 0), M(I, "tabindex", r.item.type === "image" && !r.item.isPlaceholder ? 0 : void 0), M(I, "aria-label", r.item.alt || r.item.src);
	}), o("dragstart", F, D), o("dragover", F, re), o("drop", F, ie), o("dragend", F, () => r.onDragEnd()), f("click", I, function(...e) {
		(r.item.type === "image" && !r.item.isPlaceholder ? T : void 0)?.apply(this, e);
	}), f("keydown", I, ae), u(n, F), c(), d();
}
d([
	"click",
	"keydown",
	"contextmenu"
]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/mediaGalleryWheelUtils.ts
function yn(e) {
	return Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
}
function bn(e, t) {
	let n = e.scrollHeight - e.clientHeight;
	if (n <= 1) return !1;
	let r = e.scrollTop <= 0, i = e.scrollTop >= n - 1;
	return t > 0 ? !i : t < 0 && !r;
}
function xn(e, t) {
	let n = e.scrollWidth - e.clientWidth;
	if (n <= 1) return !1;
	let r = e.scrollLeft <= 0, i = e.scrollLeft >= n - 1;
	return t > 0 ? !i : t < 0 && !r;
}
function Sn(e, t, n = null) {
	if (n && bn(n, t.deltaY)) return !1;
	let r = yn(t);
	if (!xn(e, r)) return !1;
	let i = Math.max(0, e.scrollWidth - e.clientWidth);
	return e.scrollLeft = Math.min(i, Math.max(0, e.scrollLeft + r)), !0;
}
// D:/ドキュメント/GitHub/ehagaki/src/components/MediaGallery.svelte
var Cn = i("<div><!></div>"), wn = i("<div role=\"list\"></div>"), Tn = {
	hash: "svelte-w2vv8k",
	code: ".media-gallery.svelte-w2vv8k {display:flex;align-items:center;width:100%;min-height:180px;overflow-x:auto;overflow-y:visible;scrollbar-width:thin;gap:4px;background-color:var(--window);}.media-gallery.sending.svelte-w2vv8k {background-color:color-mix(\n            in srgb,\n            var(--window) 82%,\n            var(--surface-button) 18%\n        );cursor:not-allowed;}.media-gallery.sending.svelte-w2vv8k .gallery-item {cursor:not-allowed;}.gallery-item-wrapper.svelte-w2vv8k {position:relative;display:inline-flex;align-items:center;width:fit-content;height:fit-content;}\n\n    /* 挿入位置インジケーターバー */.gallery-item-wrapper.insert-bar-left.svelte-w2vv8k::before,\n    .gallery-item-wrapper.insert-bar-right.svelte-w2vv8k::after {content:\"\";position:absolute;top:0;bottom:0;width:8px;background:var(--theme, #2196f3);border-radius:4px;z-index:10;pointer-events:none;}.gallery-item-wrapper.insert-bar-left.svelte-w2vv8k::before {left:-5px;}.gallery-item-wrapper.insert-bar-right.svelte-w2vv8k::after {right:-5px;}\n\n    @media (hover: none) and (pointer: coarse) {.media-gallery.svelte-w2vv8k {scrollbar-width:none;}.media-gallery.svelte-w2vv8k::-webkit-scrollbar {display:none;}\n    }"
};
function En(i, l) {
	t(l, !0), e(i, Tn);
	let d = () => ne(oe, "$_", f), [f, ee] = te(), g = k(-1), v = k(-1), y = k(-1), b = k(-1), x = null, C = 60, w = 60, T = k(void 0), D = null, A = j(() => K.items), P = j(() => Y.postStatus.sending), ie = j(() => {
		let e = S(g) === -1 ? S(y) : S(g), t = S(g) === -1 ? S(b) : S(v);
		return e === -1 || t === -1 || t === e || t === e + 1 ? -1 : t;
	});
	function ae(e, t) {
		S(P) ? t.preventDefault() : (_(g, e, !0), t.dataTransfer?.setData("text/plain", String(e)), t.dataTransfer && (t.dataTransfer.effectAllowed = "move"));
	}
	function se(e, t) {
		if (t.preventDefault(), S(P)) return;
		let n = S(T)?.querySelectorAll(".gallery-item-wrapper")?.[e];
		if (n) {
			let r = n.getBoundingClientRect();
			_(v, t.clientX < r.left + r.width / 2 ? e : e + 1, !0);
		} else _(v, e, !0);
	}
	function F() {
		R(), _(g, -1), _(v, -1);
	}
	function ce(e) {}
	function I(e) {
		if (S(g) === -1) return;
		if (e.preventDefault(), S(P)) {
			R(), _(v, -1);
			return;
		}
		let t = S(T)?.querySelectorAll(".gallery-item-wrapper");
		if (t && t.length > 0) {
			let n = t[0].getBoundingClientRect(), r = t[t.length - 1].getBoundingClientRect();
			e.clientX < n.left ? _(v, 0) : e.clientX > r.right && _(v, S(A).length, !0);
		}
		if (S(T)) {
			let t = S(T).getBoundingClientRect();
			e.clientX - t.left < 100 ? L("left", e.clientX) : t.right - e.clientX < 100 ? L("right", e.clientX) : R();
		}
	}
	function le(e) {
		if (e.preventDefault(), R(), S(P)) {
			_(g, -1), _(v, -1);
			return;
		}
		let t = S(v);
		if (S(g) !== -1 && t !== -1 && t !== S(g) && t !== S(g) + 1) {
			let e = S(g) < t ? t - 1 : t;
			K.reorderItems(S(g), e);
		}
		_(g, -1), _(v, -1);
	}
	function ue(e) {
		S(P) || K.removeItem(e);
	}
	function L(e, t) {
		if (!S(T)) return;
		D !== null && (cancelAnimationFrame(D), D = null);
		let n = S(T).getBoundingClientRect(), r = e === "left" ? t - n.left : n.right - t, i = 1 + 9 * (1 - Math.max(0, Math.min(1, r / 100))), a = () => {
			if (!S(T)) return;
			let t = S(T).scrollWidth - S(T).clientWidth;
			e === "left" && S(T).scrollLeft > 0 ? (S(T).scrollLeft = Math.max(0, S(T).scrollLeft - i), D = requestAnimationFrame(a)) : e === "right" && S(T).scrollLeft < t ? (S(T).scrollLeft = Math.min(t, S(T).scrollLeft + i), D = requestAnimationFrame(a)) : D = null;
		};
		D = requestAnimationFrame(a);
	}
	function R() {
		D !== null && (cancelAnimationFrame(D), D = null);
	}
	function z(e, t, n) {
		if (S(P)) return;
		_(y, e, !0), V();
		let r = S(T)?.querySelectorAll(".gallery-item-wrapper")[e];
		if (r) {
			let e = r.getBoundingClientRect(), i = Math.min(120 / e.width, 120 / e.height);
			C = e.width * i / 2, w = e.height * i / 2, x = r.cloneNode(!0), x.style.cssText = `
                position: fixed;
                left: ${t - C}px;
                top: ${n - w}px;
                width: ${e.width}px;
                height: ${e.height}px;
                transform-origin: top left;
                transform: scale(${i});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, re().overlayTarget.appendChild(x);
		}
		document.addEventListener("touchmove", B, { passive: !1 }), document.addEventListener("touchend", de, { passive: !1 });
	}
	function B(e) {
		if (S(y) === -1 || e.touches.length !== 1) return;
		if (e.preventDefault(), S(P)) {
			R(), _(b, -1);
			return;
		}
		let t = e.touches[0];
		x && (x.style.left = `${t.clientX - C}px`, x.style.top = `${t.clientY - w}px`), x && (x.style.display = "none");
		let n = document.elementFromPoint(t.clientX, t.clientY);
		x && (x.style.display = "");
		let r = n?.closest(".gallery-item-wrapper");
		if (r && S(T)) {
			let e = S(T).querySelectorAll(".gallery-item-wrapper"), n = Array.from(e).indexOf(r);
			if (n !== -1) {
				let e = r.getBoundingClientRect();
				_(b, t.clientX < e.left + e.width / 2 ? n : n + 1, !0);
			}
		} else if (S(T)) {
			let e = S(T).querySelectorAll(".gallery-item-wrapper");
			if (e.length > 0) {
				let n = e[0].getBoundingClientRect(), r = e[e.length - 1].getBoundingClientRect();
				t.clientX <= n.left ? _(b, 0) : t.clientX >= r.right && _(b, S(A).length, !0);
			}
		}
		if (S(T)) {
			let e = S(T).getBoundingClientRect();
			t.clientX - e.left < 100 ? L("left", t.clientX) : e.right - t.clientX < 100 ? L("right", t.clientX) : R();
		}
	}
	function de() {
		if (document.removeEventListener("touchmove", B), document.removeEventListener("touchend", de), R(), S(P)) {
			V(), _(y, -1), _(b, -1);
			return;
		}
		let e = S(b);
		if (S(y) !== -1 && e !== -1 && e !== S(y) && e !== S(y) + 1) {
			let t = S(y) < e ? e - 1 : e;
			K.reorderItems(S(y), t);
		}
		V(), _(y, -1), _(b, -1);
	}
	function V() {
		x &&= (x.remove(), null);
	}
	function H(e) {
		if (!S(T)) return;
		let t = S(T).closest(".composer-scroll-region");
		Sn(S(T), e, t instanceof HTMLElement ? t : null) && e.preventDefault();
	}
	p(() => {
		if (S(T)) return S(T).addEventListener("wheel", H, { passive: !1 }), () => {
			S(T)?.removeEventListener("wheel", H);
		};
	});
	var fe = n(), U = m(fe), W = (e) => {
		var t = wn();
		let n;
		r(t, 23, () => S(A), (e) => e.id, (e, t, n) => {
			var r = Cn();
			let i;
			vn(O(r), {
				get item() {
					return S(t);
				},
				get index() {
					return S(n);
				},
				onDelete: ue,
				onDragStart: ae,
				onDragOver: se,
				onDragEnd: F,
				onDrop: ce,
				onTouchDragStart: z,
				get disabled() {
					return S(P);
				}
			}), a(r), E(() => i = s(r, 1, "gallery-item-wrapper svelte-w2vv8k", null, i, {
				"insert-bar-left": S(ie) === S(n),
				"insert-bar-right": S(ie) === S(A).length && S(n) === S(A).length - 1
			})), u(e, r);
		}), a(t), h(t, (e) => _(T, e), () => S(T)), E((e) => {
			n = s(t, 1, "media-gallery svelte-w2vv8k", null, n, { sending: S(P) }), M(t, "aria-label", e);
		}, [() => d()("mediaGallery.aria_label") || "メディアギャラリー"]), o("dragover", t, I), o("drop", t, le), u(e, t);
	};
	N(U, (e) => {
		S(A).length > 0 && e(W);
	}), u(i, fe), c(), ee();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/editorDomActions.svelte.ts
function Dn(e) {
	if (!e || !e.types) return !1;
	try {
		return Array.from(e.types).some((e) => e === "application/x-tiptap-node");
	} catch {
		return !1;
	}
}
function On(e) {
	if (!e) return !1;
	try {
		return Array.from(e.types).includes("Files") || e.files && e.files.length > 0;
	} catch {
		return !!(e.files && e.files.length > 0);
	}
}
function kn(e) {
	let t = e.__postStatus;
	return (typeof t == "function" ? t() : t)?.sending === !0;
}
function An(e) {
	return typeof e.__uploadFiles == "function";
}
function jn(e) {
	let t = k(!1);
	function n(n) {
		if (kn(e) || !An(e)) {
			n.preventDefault(), _(t, !1), e.classList.remove("drag-over");
			return;
		}
		let r = n.dataTransfer, i = Dn(r);
		On(r) && !i ? (n.preventDefault(), S(t) || (_(t, !0), e.classList.add("drag-over"))) : S(t) && (_(t, !1), e.classList.remove("drag-over"));
	}
	function r(n) {
		S(t) && (_(t, !1), e.classList.remove("drag-over"));
	}
	async function i(n) {
		if (_(t, !1), e.classList.remove("drag-over"), kn(e) || !An(e)) {
			n.preventDefault();
			return;
		}
		let r = n.dataTransfer;
		if (!Dn(r) && r?.files && r.files.length > 0) {
			let t = e;
			typeof t.__uploadFiles == "function" && (n.preventDefault(), t.__uploadFiles(r.files));
		}
	}
	return e.addEventListener("dragover", n), e.addEventListener("dragleave", r), e.addEventListener("drop", i), { destroy() {
		e.removeEventListener("dragover", n), e.removeEventListener("dragleave", r), e.removeEventListener("drop", i);
	} };
}
function Mn(e, t) {
	let n = jn(e);
	function r(n) {
		if (kn(e) || !An(e)) {
			n.preventDefault(), t.dragOver(!1);
			return;
		}
		let r = n.dataTransfer, i = Dn(r);
		On(r) && !i ? t.dragOver(!0) : t.dragOver(!1);
	}
	function i(e) {
		t.dragOver(!1);
	}
	function a(n) {
		t.dragOver(!1), (kn(e) || !An(e)) && n.preventDefault();
	}
	return e.addEventListener("dragover", r), e.addEventListener("dragleave", i), e.addEventListener("drop", a), { destroy() {
		n?.destroy?.(), e.removeEventListener("dragover", r), e.removeEventListener("dragleave", i), e.removeEventListener("drop", a);
	} };
}
function Nn(e) {
	function t(t) {
		if (kn(e)) {
			t.preventDefault();
			return;
		}
		if (!t.clipboardData) return;
		let n = Be(t.clipboardData);
		n.length !== 0 && (t.preventDefault(), An(e) && e.__uploadFiles?.(n));
	}
	return e.addEventListener("paste", t), { destroy() {
		e.removeEventListener("paste", t);
	} };
}
function Pn(e) {
	function t(e) {
		let t = e.target;
		if (t && (t.closest(".editor-image-button[data-dragging=\"true\"]") || t.closest(".custom-emoji-drag-target[data-dragging=\"true\"]"))) {
			let t = e.touches[0], n = ht.querySelector(".tiptap-editor");
			if (n) {
				let r = n.getBoundingClientRect(), i = t.clientY < r.top + 120, a = t.clientY > r.bottom - 120;
				if (!i && !a) return e.preventDefault(), !1;
			}
		}
	}
	function n(e) {
		let t = ht.querySelectorAll(".drop-zone-indicator");
		t.forEach((e) => {
			e.classList.remove("drop-zone-hover"), e.classList.add("drop-zone-fade-out");
		}), setTimeout(() => {
			t.forEach((e) => {
				e.parentNode && e.parentNode.removeChild(e);
			});
		}, 300);
	}
	return e.addEventListener("touchmove", t), e.addEventListener("touchend", n), { destroy() {
		e.removeEventListener("touchmove", t), e.removeEventListener("touchend", n);
	} };
}
function Fn(e, t = !0) {
	function n(n) {
		if (t && !n.defaultPrevented && (n.ctrlKey || n.metaKey) && (n.key === "Enter" || n.key === "NumpadEnter")) {
			let t = e, r = t.__currentEditor, i = typeof r == "function" ? r() : r;
			if (Ze(n, i?.view)) return;
			n.preventDefault();
			let a = t.__hasPostingCapability, o = typeof a == "function" ? a() : a, s = t.__hasStoredKey, c = typeof s == "function" ? s() : s, l = t.__postStatus, u = typeof l == "function" ? l() : l, d = i ? qe(i) : "";
			!u?.sending && d.trim() && (o ?? c) && t.__submitPost?.();
		}
	}
	return e.addEventListener("keydown", n), { destroy() {
		e.removeEventListener("keydown", n);
	} };
}
function In(e) {
	let t = !1;
	return e?.descendants((e) => {
		if (t) return !1;
		let n = e.type.name;
		(n === "image" || n === "video") && (t = !0);
	}), t;
}
function Ln(e) {
	let { currentEditor: t, editorContainerEl: n, callbacks: r } = e, i = (e) => {
		let n = e.detail.plainText, i = t ? In(t.state?.doc) : !1;
		r.onContentUpdate?.(n, i);
	}, a = (e) => {
		let t = e;
		r.onImageFullscreenRequest?.(t.detail.src, t.detail.alt || "", t.detail.mediaId);
	}, o = (e) => {
		let n = e?.detail?.pos;
		if (n != null && t && t.view) {
			try {
				"ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
				let e = Ge.create(t.state.doc, n);
				t.view.dispatch(t.state.tr.setSelection(e).scrollIntoView());
			} catch (e) {
				console.warn("select-image-node handler failed:", e);
			}
			r.onSelectImageNode?.(n);
		}
	};
	return window.addEventListener("editor-content-changed", i), window.addEventListener("image-fullscreen-request", a), window.addEventListener("select-image-node", o), n && (n.addEventListener("image-fullscreen-request", a), n.addEventListener("select-image-node", o)), {
		handleContentUpdate: i,
		handleImageFullscreenRequest: a,
		handleSelectImageNode: o
	};
}
function Rn(e, t) {
	window.removeEventListener("editor-content-changed", e.handleContentUpdate), window.removeEventListener("image-fullscreen-request", e.handleImageFullscreenRequest), window.removeEventListener("select-image-node", e.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", e.handleImageFullscreenRequest), t.removeEventListener("select-image-node", e.handleSelectImageNode));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postComponentUtils.ts
function zn() {
	return {
		sending: !0,
		success: !1,
		error: !1,
		message: "",
		completed: !1
	};
}
function $() {
	return {
		sending: !1,
		success: !0,
		error: !1,
		message: "postComponent.post_success",
		completed: !0
	};
}
function Bn(e) {
	return {
		sending: !1,
		success: !1,
		error: !0,
		message: e || "postComponent.post_error",
		completed: !1
	};
}
function Vn({ updatePostStatus: e, clearContentAfterSuccess: t, onPostSuccess: n }) {
	return {
		markSending: () => {
			e(zn());
		},
		markSuccess: (r) => {
			e($()), r?.preserveComposerContent || (t(), n?.(r));
		},
		markFailure: (t) => {
			e(Bn(t));
		}
	};
}
async function Hn(e) {
	let t = e.postManager.prepareImageBlurhashMap(e.currentEditor, e.imageOxMap, e.imageXMap);
	e.onStart();
	try {
		let n = e.pendingEmojiTags?.length ? await e.postManager.submitPost(e.pendingPost, t, e.pendingEmojiTags) : await e.postManager.submitPost(e.pendingPost, t);
		if (n.success) {
			e.onSuccess(n);
			return;
		}
		e.onFailure(n.error);
	} catch {
		e.onFailure();
	}
}
function Un(e) {
	return e.dimensions && e.dimensions.width > 0 && e.dimensions.height > 0 ? {
		width: e.dimensions.width,
		height: e.dimensions.height
	} : pt(e.dim) || {};
}
function Wn(e) {
	if (!e.mediaFreePlacement) return e.galleryItems.filter((e) => !e.isPlaceholder).map((e) => {
		let t = Un({
			dim: e.dim,
			dimensions: e.dimensions
		});
		return {
			id: e.id,
			src: e.src,
			alt: e.alt,
			type: e.type,
			dim: e.dim,
			width: t.width,
			height: t.height
		};
	});
	let t = [];
	return e.currentEditor?.state.doc.descendants((e) => {
		if ((e.type.name === "image" || e.type.name === "video") && !e.attrs.isPlaceholder) {
			let n = Un({ dim: e.attrs.dim });
			t.push({
				id: e.attrs.id,
				src: e.attrs.src,
				alt: e.attrs.alt,
				type: e.type.name,
				dim: e.attrs.dim,
				width: n.width,
				height: n.height
			});
		}
	}), e.includeTemporaryGallery ? [...t, ...Wn({
		...e,
		mediaFreePlacement: !1
	})] : t;
}
function Gn(e, t, n) {
	if (t) {
		let n = e.findIndex((e) => e.id === t);
		if (n >= 0) return n;
	}
	return n ? e.findIndex((e) => e.src === n) : -1;
}
function Kn(e, t) {
	return e[t];
}
function qn(e) {
	let t = [];
	return e.state.doc.descendants((e, n) => {
		e.type.name !== "image" && e.type.name !== "video" || e.attrs.isPlaceholder || t.push({
			node: e,
			pos: n
		});
	}), t;
}
function Jn(e) {
	let t = qn(e.currentEditor);
	if (t.length === 0) return !1;
	t.forEach(({ node: t }) => {
		let n = t.attrs.src;
		n && e.addGalleryItem({
			id: e.createMediaItemId(),
			type: t.type.name,
			src: n,
			isPlaceholder: !1,
			blurhash: t.attrs.blurhash ?? void 0,
			ox: e.imageOxMap[n] ?? void 0,
			x: e.imageXMap[n] ?? void 0,
			dim: t.attrs.dim ?? void 0,
			size: typeof t.attrs.size == "number" ? t.attrs.size : void 0,
			alt: t.attrs.alt ?? void 0,
			uploadProtocol: t.attrs.uploadProtocol ?? void 0
		});
	});
	let n = e.currentEditor.state.tr;
	return [...t].reverse().forEach(({ node: e, pos: t }) => {
		n = n.delete(t, t + e.nodeSize);
	}), e.currentEditor.view.dispatch(n), !0;
}
function Yn(e) {
	if (e.items.length === 0) return {
		imageOxMap: {},
		imageXMap: {},
		hadItems: !1,
		movedItemIds: []
	};
	let { schema: t } = e.currentEditor.state, n = e.currentEditor.state.tr, r = e.currentEditor.state.doc.content.size, i = {}, a = {}, o = [];
	e.items.forEach((e) => {
		if (e.isPlaceholder) return;
		let s = e.src;
		if (e.type === "image" && t.nodes.image) {
			let i = t.nodes.image.create({
				src: s,
				alt: e.alt ?? "Image",
				blurhash: e.blurhash ?? null,
				dim: e.dim ?? null,
				size: e.size ?? null,
				uploadProtocol: e.uploadProtocol ?? null,
				m: e.mimeType ?? null,
				ox: e.ox ?? null,
				x: e.x ?? null
			});
			n = n.insert(r, i), r += i.nodeSize, o.push(e.id);
		} else if (e.type === "video" && t.nodes.video) {
			let i = t.nodes.video.create({ src: s });
			n = n.insert(r, i), r += i.nodeSize, o.push(e.id);
		} else return;
		e.ox && (i[s] = e.ox), e.x && (a[s] = e.x);
	}), e.currentEditor.view.dispatch(n);
	let s = !e.currentEditor.state.doc.eq(n.before);
	return {
		imageOxMap: s ? i : {},
		imageXMap: s ? a : {},
		hadItems: !0,
		movedItemIds: s ? o : []
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryMediaPersistence.ts
async function Xn(e) {
	let { input: t, postHistoryRepositoryImpl: n = z, postMediaCacheRepositoryImpl: r = Mt } = e;
	await n.putPostedEvent(t);
	let i = le(t.event).map((e) => e.url).filter(Boolean);
	i.length !== 0 && await r.linkEventIdByUrls({
		eventId: t.event.id,
		urls: i
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/editorLifecycle.ts
function Zn(e) {
	let { placeholderText: t, editorContainerEl: n, hasStoredKey: r, hasPostingCapability: i, submitPost: a, onCustomEmojiSelect: o, getCustomEmojiItems: s, enterKeyBehavior: c, hostOwnedLite: l, submitShortcuts: u, uploadFiles: d, eventCallbacks: f } = e;
	nt.value = t;
	let p = $e({
		isReactionMode: e.isReactionMode,
		onReactionImageUrls: e.onReactionImageUrls,
		getReactionInputMode: e.getReactionInputMode,
		isInputBlocked: e.isInputBlocked,
		isCompositionInputAllowed: e.isCompositionInputAllowed,
		compositionController: e.compositionController,
		placeholderText: t,
		onSubmitPost: a,
		onCustomEmojiSelect: o,
		getCustomEmojiItems: s,
		enterKeyBehavior: c,
		hostOwnedLite: l,
		submitShortcuts: u,
		onCreate: (e) => {
			J.set(e);
		}
	}), m = null, ee = p.subscribe((e) => {
		m = e;
	}), h = Ln({
		currentEditor: m,
		editorContainerEl: n,
		callbacks: f
	});
	return st(a), n && Object.assign(n, {
		__uploadFiles: d,
		__currentEditor: () => m,
		__hasStoredKey: () => r,
		__hasPostingCapability: () => i ?? r,
		__postStatus: () => Y.postStatus,
		__submitPost: a
	}), {
		editor: p,
		unsubscribe: ee,
		handlers: h
	};
}
function Qn(e) {
	let { unsubscribe: t, componentUnsubscribe: n, handlers: r, currentEditor: i, editorContainerEl: a, submitPost: o } = e;
	if (Rn(r, a), J.value === i && J.set(null), ct(o), n(), t(), i && !i.isDestroyed && i.destroy(), a) {
		let e = a;
		delete e.__uploadFiles, delete e.__currentEditor, delete e.__hasStoredKey, delete e.__hasPostingCapability, delete e.__postStatus, delete e.__submitPost;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/customEmojiInsertion.ts
function $n(e, t) {
	let n = e.view.dom;
	ft() && document.activeElement !== n ? e.commands.insertCustomEmoji(t) : e.chain().focus().insertCustomEmoji(t).run();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hostOwnedUpload.ts
var er = /* @__PURE__ */ new Set([
	"alt",
	"blurhash",
	"dim",
	"m",
	"ox",
	"size",
	"x"
]);
function tr(e) {
	if (typeof e != "string") return !1;
	try {
		let t = new URL(e);
		return t.protocol === "http:" || t.protocol === "https:";
	} catch {
		return !1;
	}
}
function nr(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return {};
	let t = {};
	for (let [n, r] of Object.entries(e)) er.has(n) && typeof r == "string" && (t[n] = r);
	return t;
}
function rr(e) {
	return {
		localStorage: ie(),
		crypto: window.crypto.subtle,
		tick: T,
		FileUploadManager: e,
		getImageDimensions: bt,
		extractImageBlurhashMap: Tt,
		calculateImageHash: Dt,
		getMimeTypeFromUrl: Ct,
		createImetaTag: kt,
		imageSizeMapStore: ke
	};
}
var ir = class {
	validateImageFile(e) {
		return e.type.startsWith("image/") ? e.size > 1073741824 ? {
			isValid: !1,
			errorMessage: "file_too_large"
		} : { isValid: !0 } : {
			isValid: !1,
			errorMessage: "only_images_allowed"
		};
	}
	validateMediaFile(e) {
		return !e.type.startsWith("image/") && !e.type.startsWith("video/") ? {
			isValid: !1,
			errorMessage: "only_images_or_videos_allowed"
		} : e.size > 1073741824 ? {
			isValid: !1,
			errorMessage: "file_too_large"
		} : { isValid: !0 };
	}
	async generateBlurhashForFile(e) {
		return await jt(e);
	}
	async uploadFileWithCallbacks() {
		throw Error("Host-owned media never uses eHagaki upload transport.");
	}
	async uploadMultipleFilesWithCallbacks() {
		throw Error("Host-owned media never uses eHagaki upload transport.");
	}
};
function ar(e) {
	let t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
	return {
		fileUploadManager: ir,
		async prepareFiles(r, i) {
			let a = new St(typeof document > "u" ? void 0 : document), o = () => e.signal.aborted || !!i.isUploadAborted?.(), s = new Ot(a, i.localStorage, o), c = new wt(i.localStorage, o), l = [];
			for (let a = 0; a < r.length; a += 1) {
				let u = r[a];
				if (e.signal.aborted) throw new DOMException("The host media operation was aborted.", "AbortError");
				if (u.size > 1073741824 || !u.type.startsWith("image/") && !u.type.startsWith("video/")) {
					l.push({
						file: u,
						index: a
					});
					continue;
				}
				let d = await xt(u, i.crypto, o).catch(() => void 0), f = await (u.type.startsWith("video/") ? c : s).compress(u);
				if (f.aborted || e.signal.aborted) throw new DOMException("The host media operation was aborted.", "AbortError");
				let p = f.file.type.startsWith("image/") ? await bt(f.file) : null;
				t.set(f.file, {
					originalName: u.name,
					originalSize: u.size,
					originalType: u.type,
					processedName: f.file.name,
					processedSize: f.file.size,
					processedType: f.file.type,
					...d ? { ox: d } : {},
					...p ? {
						width: p.width,
						height: p.height
					} : {}
				}), p && n.set(f.file, p), l.push({
					file: f.file,
					index: a,
					...d ? { ox: d } : {},
					...p ? { dimensions: p } : {}
				});
			}
			return l;
		},
		async uploadPreparedFiles(r, i) {
			let a = new Map(i.map((e) => [e.file, e])), o = [];
			for (let i of r) {
				let r = a.get(i), s = r ? { placeholderId: r.placeholderId } : {};
				if (e.signal.aborted) {
					o.push({
						...s,
						success: !1,
						aborted: !0
					});
					continue;
				}
				let c = {
					...t.get(i) ?? {
						originalName: i.name,
						originalSize: i.size,
						originalType: i.type,
						processedName: i.name,
						processedSize: i.size,
						processedType: i.type
					},
					...r?.blurhash ? { blurhash: r.blurhash } : {}
				};
				try {
					let t = await e.uploadMedia(i, c, { signal: e.signal });
					if (e.signal.aborted) {
						o.push({
							...s,
							success: !1,
							aborted: !0
						});
						continue;
					}
					if (!tr(t?.url)) {
						o.push({
							...s,
							success: !1,
							error: "host_media_invalid_result"
						});
						continue;
					}
					let r = nr(t.imeta);
					o.push({
						...s,
						success: !0,
						hostOwnedMedia: !0,
						url: t.url,
						nip94: {
							...r,
							m: r.m ?? c.processedType ?? i.type,
							...c.ox && !r.ox ? { ox: c.ox } : {},
							...c.blurhash && !r.blurhash ? { blurhash: c.blurhash } : {},
							size: r.size ?? String(i.size),
							...c.width && c.height ? { dim: r.dim ?? `${c.width}x${c.height}` } : {}
						},
						...n.get(i) ? { dimensions: n.get(i) } : c.width && c.height ? { dimensions: gt(c.width, c.height) } : {},
						uploadProtocol: "custom-http",
						sizeInfo: {
							originalSize: c.originalSize,
							compressedSize: i.size,
							wasCompressed: c.originalSize !== i.size,
							compressionRatio: c.originalSize ? i.size / c.originalSize : 1,
							sizeReduction: "",
							originalFilename: c.originalName,
							compressedFilename: i.name
						}
					});
				} catch (t) {
					o.push({
						...s,
						success: !1,
						...e.signal.aborted ? { aborted: !0 } : {},
						error: t instanceof Error ? t.message : "host_media_upload_failed"
					});
				}
			}
			return o;
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostComponent.svelte
var or = i("<div class=\"editor-account-placeholder svelte-15ticnd\" aria-hidden=\"true\"><!></div>"), sr = i("<div class=\"plane-icon svg-icon svelte-15ticnd\"></div>"), cr = i("<div class=\"editor-submit-button-container svelte-15ticnd\"><!></div>"), lr = i("<input type=\"file\" style=\"display: none;\" class=\"svelte-15ticnd\"/>"), ur = i("<div class=\"upload-error svelte-15ticnd\"> </div>"), dr = i("<div class=\"svelte-15ticnd\"> </div>"), fr = i("<div data-post-editor-root=\"\"><div role=\"textbox\" tabindex=\"-1\"><!> <!> <!></div> <!> <!> <!></div> <!> <!> <!>", 1), pr = {
	hash: "svelte-15ticnd",
	code: ".post-container.svelte-15ticnd,\n  .editor-container.svelte-15ticnd,\n  .editor-content,\n  .tiptap-editor {width:100%;flex:1 1 auto;}.post-container.svelte-15ticnd,\n  .editor-container.svelte-15ticnd,\n  .editor-content {display:flex;flex-direction:column;}.post-container.svelte-15ticnd,\n  .editor-content,\n  .tiptap-editor {min-height:0;}.editor-content,\n  .tiptap-editor {height:100%;}.post-container.svelte-15ticnd {max-width:800px;align-items:stretch;overflow:visible;--post-editor-block-padding: 10px;--post-editor-line-height: 30px;--post-editor-submit-button-size: 40px;--post-editor-submit-button-inline-inset: 14px;}.upload-error.svelte-15ticnd {color:#c62828;font-size:0.9rem;margin-bottom:10px;width:100%;text-align:left;}.editor-container.svelte-15ticnd {min-height:var(--post-editor-min-height, 92px);height:var(--post-editor-target-height, auto);max-height:var(--post-editor-target-height, auto);position:relative;cursor:text;outline:none;background:var(--surface-editor);-webkit-tap-highlight-color:transparent;overflow:hidden;}.post-container.editor-auto-grow.svelte-15ticnd,\n  .post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd),\n  .post-container.editor-auto-grow.svelte-15ticnd .editor-content,\n  .post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {flex:0 0 auto;}.post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd),\n  .post-container.editor-auto-grow.svelte-15ticnd .editor-content,\n  .post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {height:auto;}.post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd) {min-height:0;max-height:none;}.post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {min-height:calc(\n      var(--post-editor-auto-grow-min-lines) + var(--post-editor-block-padding) +\n        var(--post-editor-block-padding)\n    );max-height:calc(\n      var(--post-editor-auto-grow-max-lines) + var(--post-editor-block-padding) +\n        var(--post-editor-block-padding)\n    );}.editor-account-placeholder {position:absolute;top:11px;left:14px;z-index:3;width:28px;height:28px;pointer-events:none;user-select:none;-webkit-user-select:none;}.editor-account-placeholder-avatar {display:block;width:100%;height:100%;overflow:hidden;border-radius:50%;}.editor-account-placeholder-image,\n  .editor-account-placeholder-fallback {display:block;width:100%;height:100%;border-radius:50%;}.editor-account-placeholder-image {opacity:0.5;object-fit:cover;}.editor-account-placeholder-fallback[data-loading=\"true\"] {visibility:hidden;\n    animation: none;}.editor-container.account-avatar-placeholder.svelte-15ticnd\n    p.is-editor-empty:first-child::before {padding-left:38px;}.editor-container.sending.svelte-15ticnd {background:color-mix(\n      in srgb,\n      var(--surface-editor) 82%,\n      var(--surface-button) 18%\n    );cursor:not-allowed;}.editor-container.sending.svelte-15ticnd .tiptap-editor {cursor:not-allowed;opacity:0.72;}.editor-container.editor-submit-enabled.sending.svelte-15ticnd .tiptap-editor {pointer-events:none;}.editor-container.sending.svelte-15ticnd .editor-image-button,\n  .editor-container.sending.svelte-15ticnd .custom-emoji-drag-target,\n  .editor-container.sending.svelte-15ticnd .media-delete-btn {pointer-events:none;}.editor-container.editor-submit-enabled.svelte-15ticnd .tiptap-editor {padding-inline-end:calc(var(--post-editor-submit-button-inline-inset) + var(--post-editor-submit-button-size));}.editor-submit-button-container.svelte-15ticnd {position:absolute;inset-inline-end:var(--post-editor-submit-button-inline-inset);bottom:var(--post-editor-block-padding);z-index:4;}.post-container.editor-auto-grow.svelte-15ticnd .editor-submit-button-container:where(.svelte-15ticnd) {bottom:calc(\n      var(--post-editor-block-padding) +\n        (var(--post-editor-line-height) - var(--post-editor-submit-button-size)) /\n        2\n    );}.editor-submit-button {width:var(--post-editor-submit-button-size);height:var(--post-editor-submit-button-size);flex:0 0 var(--post-editor-submit-button-size);}button.editor-submit-button .plane-icon.svg-icon {width:22px;height:22px;mask-image:var(--ehagaki-icon-70617065722d706c616e652d736f6c69642d66756c6c2e737667);margin-inline-end:1px;margin-top:1px;}.editor-container.drag-over.svelte-15ticnd {border:3px dashed var(--theme);}\n\n  /* ギャラリーモード時はドロップカーソル（差し込み位置バー）を常に非表示 */.editor-container.gallery-mode.svelte-15ticnd .tiptap-dropcursor {display:none !important;}\n\n  /* Tiptapエディターのスタイル */.tiptap-editor {display:block;padding:var(--post-editor-block-padding);font-family:inherit;font-size:1.25rem;line-height:var(--post-editor-line-height);outline:none;overflow-y:auto;overflow-x:hidden;scroll-padding-bottom:16px;scroll-behavior:auto;will-change:scroll-position;transform:translateZ(0);-webkit-tap-highlight-color:transparent;.editor-paragraph {margin:0;padding:0;color:var(--text);position:relative;z-index:2;word-break:normal;overflow-wrap:anywhere;line-break:loose;white-space:break-spaces;}.hashtag {color:var(--hashtag-text);font-weight:600;background:var(--hashtag-bg);padding:2px 4px;border-radius:4px;word-break:break-all;}.preview-link {color:var(--link);word-break:break-all;}.preview-link:visited {color:var(--link-visited);}p.is-editor-empty:first-child::before {color:var(--text);content:attr(data-placeholder);float:left;height:0;pointer-events:none;opacity:0.6;}.toolbar-caret {display:inline-block;width:0;height:1.5em;margin-left:-1px;border-left:2px solid var(--text);vertical-align:-0.25em;pointer-events:none;\n      animation: svelte-15ticnd-toolbar-caret-blink 1s steps(1) infinite;}}\n\n  @keyframes svelte-15ticnd-toolbar-caret-blink {\n    0%,\n    49% {\n      opacity: 1;\n    }\n    50%,\n    100% {\n      opacity: 0;\n    }\n  }\n\n  /* ドロップゾーンのフェードアウトアニメーション（改善版） */.drop-zone-fade-out {\n    animation: svelte-15ticnd-dropZoneFadeOut 0.3s ease-out forwards;}\n\n  @keyframes svelte-15ticnd-dropZoneFadeOut {\n    from {\n      opacity: 0.9;\n      transform: scale(1);\n    }\n    to {\n      opacity: 0;\n      transform: scale(0.8);\n    }\n  }\n\n  /* タッチデバイス用の追加スタイル */\n  @media (hover: none) and (pointer: coarse) {.editor-container.svelte-15ticnd {-webkit-tap-highlight-color:transparent;will-change:scroll-position;}\n\n    /* ドラッグ中の視覚フィードバック強化 */.editor-image-button[data-dragging=\"true\"] {z-index:1;}.tiptap-editor {-webkit-user-select:text;user-select:text;-webkit-transform:translateZ(0);transform:translateZ(0);backface-visibility:hidden;}\n  }\n\n  /* ProseMirror のギャップカーソルの色を上書き（Light / Dark 対応） */.tiptap-editor .ProseMirror-gapcursor:after,\n  .tiptap-editor .ProseMirror-gapcursor:before {border-top-color:light-dark(black, white);}"
};
function mr(n, r) {
	t(r, !0), e(n, pr);
	let i = () => ne(oe, "$_", d), [d, ee] = te(), T = w(r, "hasPostingCapability", 19, () => r.hasStoredKey), P = w(r, "isSwitchingAccount", 3, !1), ie = w(r, "profilePending", 3, !1), ae = w(r, "availableComposerHeight", 3, 152), se = w(r, "minEditorHeight", 3, 152);
	w(r, "hostCustomEmojiItems", 19, () => []);
	let F = j(() => !0), ce = j(() => Y.isUploading), I = j(() => Y.canPost), le = j(() => !1), ue = k(null), L = k(null), R = k(null), B = k(!1), de = k(!1), V = k(void 0), H = k(void 0), fe = !1, U = k(b({})), W = k(b({})), pe = j(() => je.value), me = j(() => !S(pe) || !!X.value), he = k(0), ge = j(() => (S(he), ve?.getInputMode() ?? "singleValue")), ve = sn({
		getEditor: () => J.value,
		getAuth: () => _e.value,
		getRuntime: () => r.rxNostr,
		getEnvironment: re,
		isFreePlacement: () => je.value,
		getItems: () => K.getItems(),
		addItem: (e) => K.addItem(e),
		removeItem: (e) => K.removeItem(e),
		removePlaceholderSize: (e) => ke.update((t) => {
			let n = { ...t };
			return delete n[e], n;
		}),
		restoreItems: (e, t) => {
			S(Qe)?.editor === e && !S(Qe).isCurrent() && (_(Qe, null), S(H)?.cancelActiveNip65Operations(), Y.isSubmitPending = !1, Y.postStatus.sending && ot());
			let n = Yn({
				currentEditor: e,
				items: t
			});
			return Object.assign(S(U), n.imageOxMap), Object.assign(S(W), n.imageXMap), n.movedItemIds;
		},
		onChange: () => {
			_(he, S(he) + 1);
		},
		onUploadEnd: () => ln(Y, !1, "")
	});
	function ye(e) {
		return S(he), yt(e.state.doc, ve?.getContext() ?? !1);
	}
	p(() => {
		_e.value, r.rxNostr, J.value, X.value, v(() => ve?.sync());
	}), p(() => {
		Ne.value && v(() => ve?.abortUpload());
	});
	let G = j(() => Y.postStatus), we = j(() => Y.uploadErrorMessage), Te = j(() => Bt.value), Ee = j(() => Nt.value), Oe = j(() => Ht.value), Me = k(!0), Le = !1, ze = j(() => r.hasStoredKey && !P() && S(Ee) && !S(Oe) && S(Me)), Be = null, Ve = null, Ue = null, We = null, Ge = k(b(152)), qe = j(() => !1), Je = j(() => S(qe) ? `--post-editor-auto-grow-min-lines: ${r.hostOwnedConfig.editorMinLines}lh; --post-editor-auto-grow-max-lines: ${r.hostOwnedConfig.editorMaxLines}lh;` : `--post-editor-min-height: ${se()}px; --post-editor-target-height: ${S(Ge)}px;`), Ye = j(() => X.value && S(ge) === "uploadedShortcode" ? i()("reaction.shortcode_hint") : i()("postComponent.enter_your_text") || "テキストを入力してください");
	p(() => {
		let e = S(L), t = K.hasNonPlaceholderItems();
		e && Ze(e, t);
	});
	function Ze(e, t) {
		let n = X.value && e ? ye(e).value : null;
		lt(e, t, X.value ? !!n && !(!e || dt(e)) : void 0, n?.type === "text" && n.text === "+" ? "favorite" : "plane");
	}
	let Qe = k(null);
	p(() => {
		let e = S(Qe);
		e && !e.isCurrent() && (_(Qe, null), v(() => {
			S(H)?.cancelActiveNip65Operations(), J.value === e.editor && (Y.isSubmitPending = !1, Y.postStatus.sending && ot());
		}));
	});
	function q() {
		return S(G).sending || S(B);
	}
	p(() => {
		S(L), et(S(Ye));
	}), p(() => {});
	function $e() {
		if (S(qe)) return;
		let e = se();
		if (!Be || !Ve) {
			_(Ge, e, !0);
			return;
		}
		let t = Array.from(Be.children).reduce((e, t) => t === Ve ? e : e + qt(t), 0), n = Yt({
			availableComposerHeight: ae(),
			nonEditorHeight: t,
			minHeight: e
		});
		S(Ge) !== n && _(Ge, n, !0);
	}
	function nt(e) {
		q() ? e.preventDefault() : e.target instanceof HTMLElement && S(L) && (mt(e.target) || S(L).commands.focus("end"));
	}
	function st(e) {
		!S(L) || e.currentTarget !== e.target || e.key !== "Enter" && e.key !== " " || (e.preventDefault(), S(L).commands.focus("end"));
	}
	function ct(e) {
		q() && (!S(R)?.isCompositionInputAllowed() || !e.isComposing && e.keyCode !== 229) && (e.preventDefault(), e.stopPropagation());
	}
	function ft(e) {
		let t = S(R)?.isCompositionInputAllowed() && e instanceof InputEvent && (e.isComposing || e.inputType === "insertCompositionText" || e.inputType === "insertFromComposition");
		q() && !t && (e.preventDefault(), e.stopPropagation());
	}
	function pt(e) {
		e.preventDefault();
	}
	function ht(e) {
		let t = S(L)?.view.dom;
		S(le) && t && e.relatedTarget === t && t.focus({ preventScroll: !0 });
	}
	let gt = j(() => Q.value), vt = j(() => S(gt).showSecretKeyDialog), bt = j(() => S(gt).showImageFullscreen), xt = j(() => S(gt).fullscreenMediaId), St = j(() => S(gt).fullscreenImageSrc), Ct = j(() => S(gt).fullscreenImageAlt), wt = j(() => S(gt).showFloatingMessage), Tt = j(() => S(gt).floatingMessageX), Dt = j(() => S(gt).floatingMessageY), Ot = j(() => S(gt).floatingMessageText);
	p(() => {
		r.rxNostr && (S(H) ? S(H).setRxNostr(r.rxNostr) : _(H, new on(r.rxNostr, {
			getNip46SignerForSessionFn: (e) => Re.getSignerForSession(e),
			getParentClientSignerFn: () => De.getSigner(),
			channelContextState: Kt,
			replyQuoteState: Gt,
			replyQuoteService: new Zt(),
			clearReplyQuoteFn: Pt,
			savePostHistoryFn: (e) => Xn({
				input: e,
				postHistoryRepositoryImpl: z
			}),
			notificationPort: r.notificationPort,
			storeSignedEventsFn: (e, t) => r.storeSignedEventsFn?.(e, t)
		}), !0));
	});
	let kt = dn({
		getCurrentEditor: () => S(L),
		getFileInput: () => S(V),
		getImageOxMap: () => S(U),
		getImageXMap: () => S(W),
		getUploadFailedText: (e) => i()(e),
		updateUploadState: (e, t) => {
			ln(Y, e, t);
		},
		setUploadErrorMessage: (e) => {
			Y.uploadErrorMessage = e;
		},
		uploadFiles: async (e) => {
			if (q() || Y.isSubmitPending || Y.isUploading) return null;
			{
				let t = X.value;
				if (t && (e.files.length !== 1 || !e.files[0].type.startsWith("image/"))) return Y.uploadErrorMessage = i()("postComponent.reactionUnsupportedImage"), null;
				let n = t ? ve?.beginUpload() : void 0;
				if (t && !n) return null;
				n && Ne.reset(), ln(Y, !0, "");
				try {
					let t = r.normalUploadFiles ?? (await import("./normalUploadHelper-B6YlPOEk.js")).uploadFiles;
					return n && (!n.isCurrent() || n.signal.aborted) ? null : await t({
						...e,
						...n ? { reactionUpload: n } : {}
					});
				} finally {
					n ? (n.isCurrent() && ln(Y, !1), ve?.endUpload(n)) : ln(Y, !1);
				}
			}
			if (!r.hostOwnedConfig?.uploadMedia) return ln(Y, !1, i()("postComponent.media_not_supported")), null;
			ln(Y, !0, "");
			let t = ar({
				uploadMedia: r.hostOwnedConfig.uploadMedia,
				signal: r.hostOwnedConfig.signal
			});
			try {
				return await Et({
					...e,
					showUploadError: (e, t) => At(e, t, {
						updateUploadState: (e, t) => {
							ln(Y, e, t);
						},
						setUploadErrorMessage: (e) => {
							Y.uploadErrorMessage = e;
						},
						keepUploading: !0
					}),
					setUploadErrorMessage: (e) => {
						Y.uploadErrorMessage = e;
					},
					devMode: !1,
					dependencies: rr(t.fileUploadManager),
					prepareFiles: t.prepareFiles,
					uploadPreparedFiles: t.uploadPreparedFiles,
					fileUploadManager: t.fileUploadManager,
					fileUploadManagerInstance: new t.fileUploadManager(),
					deferUploadStateClear: !0,
					isUploadAborted: () => !!r.hostOwnedConfig.signal.aborted
				});
			} finally {
				ln(Y, !1);
			}
		}
	});
	function jt() {
		let e = !!(S(L)?.view.composing && Vt());
		e && S(L)?.view.dom.blur(), xn(), e ? S(R)?.retire() : S(R)?.markStale();
	}
	let Mt = Vn({
		updatePostStatus: tt,
		clearContentAfterSuccess: jt,
		onPostSuccess: (e) => {
			e?.event?.kind === 7 ? r.onReactionResult?.(e) : r.onPostSuccess?.(e);
		}
	});
	D(() => {
		ve?.dispose(), fe = !0, Ft("ownership"), S(H)?.cancelActiveNip65Operations();
	});
	function Rt(e) {
		S(R)?.markFailure(), Mt.markFailure(e);
	}
	p(() => {
		if (S(qe)) return;
		if (ae(), se(), S(me), S(we), S(L), S(me) && K.items.length, typeof window > "u") {
			_(Ge, 152, !0);
			return;
		}
		let e = window.requestAnimationFrame(() => {
			$e();
		});
		return () => {
			window.cancelAnimationFrame(e);
		};
	}), p(() => {
		if (S(qe) || (ae(), se(), S(L), S(me), S(we), !Be || typeof ResizeObserver > "u")) return;
		let e = null, t = () => {
			e === null && (e = window.requestAnimationFrame(() => {
				e = null, $e();
			}));
		}, n = new ResizeObserver(t);
		t(), n.observe(Be);
		for (let e of Array.from(Be.children)) e !== Ve && n.observe(e);
		return () => {
			n.disconnect(), e !== null && window.cancelAnimationFrame(e);
		};
	}), x(() => {
		_(B, !1), _(R, new $t((e) => {
			_(B, e === "stale");
		}), !0), Ue = Zn({
			isReactionMode: () => X.value !== null,
			onReactionImageUrls: (e) => {
				q() || Y.isSubmitPending || Y.isUploading || ve?.addImageUrls(e);
			},
			getReactionInputMode: () => ve?.getInputMode() ?? "singleValue",
			isInputBlocked: q,
			isCompositionInputAllowed: () => !!S(R)?.isCompositionInputAllowed(),
			compositionController: S(R) ?? void 0,
			placeholderText: S(Ye),
			editorContainerEl: Ve,
			currentEditor: S(L),
			hasStoredKey: r.hasStoredKey,
			hasPostingCapability: T(),
			submitPost: yn,
			onCustomEmojiSelect: r.onCustomEmojiSelect,
			getCustomEmojiItems: void 0,
			enterKeyBehavior: void 0,
			hostOwnedLite: !1,
			submitShortcuts: void 0,
			uploadFiles: S(F) ? (e) => {
				q() || kt.performUpload(e);
			} : void 0,
			eventCallbacks: {
				onContentUpdate: (e, t) => {
					at(e, t), r.onEditorContentUpdate?.();
				},
				onImageFullscreenRequest: (e, t, n) => {
					Q.showImageFullscreen(e, t, n || "");
				},
				onSelectImageNode: (e) => {}
			}
		}), _(ue, Ue.editor, !0);
		let e = null, t = (e) => {
			let t = e.isEmpty, n = !Le || S(Me) !== t;
			_(Me, t, !0), Le = !0, n && r.onEditorEmptyChange?.(t);
		}, n = (e) => {
			Ze(e, K.hasNonPlaceholderItems());
		}, i = ({ editor: e }) => {
			t(e), n(e);
		};
		We = S(ue).subscribe((r) => {
			r !== null && r === e ? (_(L, r, !0), r && (t(r), n(r))) : (e && e.off("transaction", i), e = r, _(L, r, !0), r ? (S(R)?.attach(r), t(r), n(r)) : (S(R)?.detach(), lt(null, !1)), r?.on("transaction", i), J.set(r));
		});
		let a = (e) => {
			let { src: t, alt: n, mediaId: r } = e.detail;
			Q.showImageFullscreen(t, n, r || "");
		};
		return window.addEventListener("image-fullscreen-request", a), () => {
			ve?.dispose(), S(R)?.destroy(), _(R, null), _(B, !1), lt(null, !1), J.value === S(L) && (Y.isSubmitPending = !1, Q.hideSecretKeyDialog()), window.removeEventListener("image-fullscreen-request", a), Ue && (e && e.off("transaction", i), Qn({
				unsubscribe: Ue.unsubscribe,
				componentUnsubscribe: We ?? (() => {}),
				handlers: Ue.handlers,
				currentEditor: S(L),
				editorContainerEl: Ve,
				submitPost: yn
			}), We = null);
		};
	});
	let Ut = kt.handleFileSelect;
	async function Jt(e) {
		return q() ? null : await kt.performUpload(e);
	}
	function Qt() {
		S(L)?.commands.focus();
	}
	function en() {
		S(L)?.commands.blur();
	}
	function tn(e) {
		if (!S(L) || !e || q()) return;
		let t = S(L), n = e.split("\n").map((e) => ({
			type: "paragraph",
			content: e ? [{
				type: "text",
				text: e
			}] : void 0
		}));
		t.commands.setContent({
			type: "doc",
			content: n
		}), t.commands.focus("end");
	}
	function nn(e) {
		if (!S(L) || !e || q()) return !1;
		let t = e.split("\n").map((e) => ({
			type: "paragraph",
			content: e ? [{
				type: "text",
				text: e
			}] : void 0
		}));
		return S(L).isEmpty ? S(L).commands.setContent({
			type: "doc",
			content: t
		}) : S(L).chain().focus("end").insertContent([{ type: "paragraph" }, ...t]).run(), S(L).commands.focus("end"), !0;
	}
	function rn(e) {
		if (!S(L) || !e || q()) return;
		let t = Lt(e);
		S(L).commands.setContent(t || "<p></p>"), S(L).commands.focus("end");
	}
	function an() {
		return S(L) ? S(L).getHTML() : "";
	}
	function cn(e) {
		if (!S(L) || e.length === 0 || q()) return;
		let { schema: t } = S(L).state, n = S(L).state.tr, r = S(L).state.doc.content.size;
		e.forEach((e) => {
			if (e.isPlaceholder) return;
			let i = e.src;
			if (e.type === "image" && t.nodes.image) {
				let a = t.nodes.image.create({
					src: i,
					alt: e.alt ?? "Image",
					blurhash: e.blurhash ?? null,
					dim: e.dim ?? null,
					size: e.size ?? null,
					uploadProtocol: e.uploadProtocol ?? null
				});
				n = n.insert(r, a), r += a.nodeSize, e.ox && _(U, {
					...S(U),
					[i]: e.ox
				}, !0), e.x && _(W, {
					...S(W),
					[i]: e.x
				}, !0);
			} else if (e.type === "video" && t.nodes.video) {
				let e = t.nodes.video.create({ src: i });
				n = n.insert(r, e), r += e.nodeSize;
			}
		}), S(L).view.dispatch(n), S(L).commands.focus("end");
	}
	function un(e) {
		if (!S(L) || q()) return !1;
		let t = S(L).state.doc;
		return $n(S(L), e), !t.eq(S(L).state.doc);
	}
	function Z() {
		S(L) && (_t(S(L).view.dom) || ut(S(L)));
	}
	function fn(e) {
		if (!S(L) || q()) return;
		Z();
		let { state: t, view: n } = S(L), r = e < 0 ? t.selection.from : t.selection.to, i = Math.max(0, Math.min(t.doc.content.size, r + e));
		if (i === r) return;
		let a = Ke.near(t.doc.resolve(i), e);
		n.dispatch(t.tr.setSelection(a).scrollIntoView().setMeta("addToHistory", !1));
	}
	function pn() {
		fn(-1);
	}
	function mn() {
		fn(1);
	}
	function hn() {
		if (!S(L) || q()) return;
		Z();
		let { state: e, view: t } = S(L), { selection: n } = e;
		if (!n.empty) {
			S(L).commands.deleteSelection();
			return;
		}
		let r = n.$from.nodeBefore;
		if (r) {
			let i = r.isText ? Array.from(r.text ?? "").at(-1)?.length ?? 0 : r.nodeSize;
			i > 0 && t.dispatch(e.tr.delete(n.from - i, n.from).scrollIntoView());
		} else S(L).commands.first(({ commands: e }) => [() => e.joinBackward(), () => e.selectNodeBackward()]);
	}
	function gn() {
		S(L) && !q() && (Z(), S(L).commands.keyboardShortcut("Enter"));
	}
	function _n() {
		return vn() && (X.value && S(L) ? !!ye(S(L)).value && !dt(S(L)) && !S(L).view.composing : Xe(S(L), K.hasNonPlaceholderItems())) && !Y.isSubmitPending && !S(vt);
	}
	function vn() {
		return !!S(L) && !!S(H) && !P() && !S(G).sending && !Y.isUploading && !S(G).completed && T();
	}
	async function yn(e) {
		if (!S(L) || !_n() || !S(H)) return;
		let t = S(L), n = X.value;
		if (n) {
			let e = ye(t).value;
			if (!e) return;
			let i = r.rxNostr, a = _e.value, o = () => !fe && J.value === t && r.rxNostr === i && _e.value === a && X.value === n, s = {
				editor: t,
				isCurrent: o
			};
			_(Qe, s);
			let c = !1;
			Y.isSubmitPending = !0, Mt.markSending();
			try {
				let t = await zt.react({
					target: n.event,
					relayHints: n.relayHints,
					value: e,
					publisher: S(H),
					isCurrent: o
				});
				if (!o()) return;
				c = !0, t.success ? (Ft("success"), Mt.markSuccess(t)) : Rt("reaction.failed");
			} finally {
				S(Qe) === s && (c || o()) && (_(Qe, null), !fe && J.value === t && (Y.isSubmitPending = !1));
			}
		} else {
			Y.isSubmitPending = !0;
			try {
				if (t.isDestroyed || J.value !== t || !vn()) return;
				let e = S(H).preparePostPayload(t);
				if (rt(t.state.doc), be(e.content)) {
					Q.showSecretKeyDialog(e.content, e.emojiTags), Y.isSubmitPending = !1;
					return;
				}
				t.view.composing && S(R)?.startSession(He.getState(t.state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await S(H).performPostSubmission(t, e, S(U), S(W), () => {
					fe || (Mt.markSending(), Y.isSubmitPending = !1);
				}, (e) => {
					fe || Mt.markSuccess(e);
				}, (e) => {
					fe || Rt(e);
				});
			} finally {
				!fe && J.value === t && (Y.isSubmitPending = !1);
			}
		}
	}
	function bn() {
		Ft("reset"), S(L) && (S(H) ? S(H).resetPostContent(S(L)) : S(L).chain().clearContent().run());
	}
	function xn() {
		if (Ft("success"), S(H) && S(L)) S(H).clearContentAfterSuccess(S(L));
		else if (S(L)) {
			let e = r.hostOwnedConfig?.hashtagPinEnabled === !0 && Fe.value ? [...Ie().hashtags] : [];
			S(L).chain().clearContent().run(), Pe.reset(), Ae.reset(), K.clearAll(), _(U, {}, !0), _(W, {}, !0), Pt(), e.length > 0 && S(L).commands.insertContent(` ${e.map((e) => `#${e}`).join(" ")}`), S(L).commands.focus("start");
		}
	}
	async function Sn() {
		if (!S(vt) || !vn()) return;
		let e = Q.getPendingPost(), t = Q.getPendingEmojiTags();
		e.trim() && S(H) && S(L) && (S(L).view.composing && S(R)?.startSession(He.getState(S(L).state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await Hn({
			postManager: S(H),
			currentEditor: S(L),
			imageOxMap: S(U),
			imageXMap: S(W),
			pendingPost: e,
			pendingEmojiTags: t,
			onStart: () => {
				Mt.markSending(), Q.hideSecretKeyDialog();
			},
			onSuccess: Mt.markSuccess,
			onFailure: Rt
		}));
	}
	let Cn = Q.hideSecretKeyDialog, wn = Q.hideImageFullscreen, Tn = j(() => Wn({
		mediaFreePlacement: S(pe),
		includeTemporaryGallery: S(pe) && !!X.value,
		galleryItems: K.items,
		currentEditor: S(L)
	})), Dn = j(() => Gn(S(Tn), S(xt), S(St)));
	function On(e) {
		let t = Kn(S(Tn), e);
		t && Q.showImageFullscreen(t.src, t.alt ?? "", t.id ?? "");
	}
	p(() => {
		S(L) && S(H) && S(H).preparePostContent(S(L)) !== Y.content && S(G).error && tt({
			...S(G),
			error: !1,
			message: ""
		});
	});
	function kn() {
		!S(F) || q() || Y.isSubmitPending || Y.isUploading || S(V)?.click();
	}
	p(() => {
		let e = K.items.some((e) => !e.isPlaceholder);
		Ze(S(L), e);
	});
	let An = !0, jn = !je.value;
	p(() => {
		let e = !je.value;
		if (X.value) return;
		if (An) {
			An = !1, jn = e;
			return;
		}
		if (!S(L) || jn === e) return;
		jn = e;
		let t = S(L);
		if (e) v(() => Jn({
			currentEditor: t,
			imageOxMap: S(U),
			imageXMap: S(W),
			addGalleryItem: (e) => K.addItem(e),
			createMediaItemId: Se
		})) && v(() => {
			_(U, {}, !0), _(W, {}, !0);
		});
		else {
			let e = Yn({
				currentEditor: t,
				items: v(() => K.getItems())
			});
			e.hadItems && v(() => {
				_(U, e.imageOxMap, !0), _(W, e.imageXMap, !0);
			}), v(() => K.clearAll());
		}
	});
	var In = {
		uploadFiles: Jt,
		focusEditor: Qt,
		blurEditor: en,
		insertTextContent: tn,
		appendSharedTextContent: nn,
		loadDraftContent: rn,
		getEditorHtml: an,
		appendMediaToEditor: cn,
		insertCustomEmoji: un,
		moveCaretLeft: pn,
		moveCaretRight: mn,
		deleteBackward: hn,
		insertLineBreak: gn,
		submitPost: yn,
		resetPostContent: bn,
		clearContentAfterSuccess: xn,
		openFileDialog: kn
	}, Ln = fr(), Rn = m(Ln);
	let zn;
	var $ = O(Rn);
	let Bn;
	var Un = O($), qn = (e) => {
		var t = or(), n = O(t);
		{
			let e = j(() => S(Te)?.displayName), t = j(() => S(Te)?.name), r = j(() => S(Te)?.picture || "");
			Wt(n, {
				get pubkeyHex() {
					return _e.value.pubkey;
				},
				get displayName() {
					return S(e);
				},
				get name() {
					return S(t);
				},
				showLoadingIndicator: !0,
				get pending() {
					return ie();
				},
				get src() {
					return S(r);
				},
				alt: "",
				fallbackAriaLabel: "",
				rootClassName: "editor-account-placeholder-avatar",
				imageClassName: "editor-account-placeholder-image",
				fallbackClassName: "editor-account-placeholder-fallback"
			});
		}
		a(t), u(e, t);
	};
	N(Un, (e) => {
		S(ze) && e(qn);
	});
	var er = C(Un, 2), tr = (e) => {
		it(e, {
			get editor() {
				return S(L);
			},
			class: "editor-content"
		});
	};
	N(er, (e) => {
		S(ue) && S(L) && e(tr);
	});
	var nr = C(er, 2), ir = (e) => {
		var t = cr(), n = O(t);
		{
			let e = j(() => !S(I) || S(G).sending || S(ce) || !T() || S(G).completed), t = j(() => i()("postComponent.post"));
			Ce(n, {
				variant: "primary",
				shape: "circle",
				contentLayout: "icon",
				className: "editor-submit-button",
				get disabled() {
					return S(e);
				},
				onClick: () => {
					!S(I) || S(G).sending || S(ce) || !T() || S(G).completed || yn();
				},
				onfocus: ht,
				get ariaLabel() {
					return S(t);
				},
				children: (e, t) => {
					var n = sr();
					u(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		a(t), o("pointerdown", t, pt, !0), u(e, t);
	};
	N(nr, (e) => {
		S(le) && e(ir);
	}), a($), y($, (e, t) => Mn?.(e, t), () => ({ dragOver: (e) => _(de, e, !0) })), y($, (e) => Nn?.(e)), y($, (e) => Pn?.(e)), y($, (e, t) => Fn?.(e, t), () => !0), h($, (e) => Ve = e, () => Ve);
	var mr = C($, 2), hr = (e) => {
		En(e, {});
	};
	N(mr, (e) => {
		S(me) && e(hr);
	});
	var gr = C(mr, 2), _r = (e) => {
		var t = lr();
		h(t, (e) => _(V, e), () => S(V)), E(() => {
			M(t, "accept", X.value ? "image/png,image/jpeg,image/webp,image/gif" : "image/*,video/*"), t.multiple = !X.value;
		}), f("change", t, Ut), u(e, t);
	};
	N(gr, (e) => {
		S(F) && e(_r);
	});
	var vr = C(gr, 2), yr = (e) => {
		var t = ur(), n = g(t, !0);
		E(() => l(n, S(we))), u(e, t);
	};
	N(vr, (e) => {
		S(we) && e(yr);
	}), a(Rn), h(Rn, (e) => Be = e, () => Be);
	var br = C(Rn, 2), xr = (e) => {
		{
			let t = j(() => i()("postComponent.warning")), n = j(() => i()("postComponent.secret_key_detected")), r = j(() => i()("postComponent.post")), a = j(() => i()("postComponent.cancel"));
			Xt(e, {
				get open() {
					return S(vt);
				},
				get title() {
					return S(t);
				},
				get description() {
					return S(n);
				},
				get confirmLabel() {
					return S(r);
				},
				get cancelLabel() {
					return S(a);
				},
				confirmVariant: "danger",
				onConfirm: Sn,
				get onCancel() {
					return Cn;
				},
				contentClass: "secretkey-warning-dialog"
			});
		}
	};
	N(br, (e) => {
		e(xr);
	});
	var Sr = C(br, 2);
	It(Sr, {
		get src() {
			return S(St);
		},
		get alt() {
			return S(Ct);
		},
		get onClose() {
			return wn;
		},
		get mediaList() {
			return S(Tn);
		},
		get currentIndex() {
			return S(Dn);
		},
		onNavigate: On,
		get show() {
			return S(bt);
		},
		set show(e) {
			_(bt, e);
		}
	});
	var Cr = C(Sr, 2), wr = (e) => {
		xe(e, {
			get show() {
				return S(wt);
			},
			get x() {
				return S(Tt);
			},
			get y() {
				return S(Dt);
			},
			children: (e, t) => {
				var n = dr(), r = g(n, !0);
				E(() => l(r, S(Ot))), u(e, n);
			},
			$$slots: { default: !0 }
		});
	};
	N(Cr, (e) => {
		S(wt) && e(wr);
	}), E((e) => {
		zn = s(Rn, 1, "post-container svelte-15ticnd", null, zn, { "editor-auto-grow": S(qe) }), A(Rn, S(Je)), Bn = s($, 1, "editor-container svelte-15ticnd", null, Bn, {
			"drag-over": S(de),
			"gallery-mode": S(me),
			sending: S(G).sending || S(B),
			"editor-submit-enabled": S(le),
			"account-avatar-placeholder": S(ze)
		}), M($, "aria-label", e), M($, "aria-readonly", S(G).sending || S(B) ? "true" : void 0), M($, "aria-disabled", void 0);
	}, [() => i()("postComponent.editor_label")]), f("click", $, nt), o("keydown", $, ct, !0), f("keydown", $, st), o("beforeinput", $, ft, !0), o("paste", $, ft, !0), o("cut", $, ft, !0), o("drop", $, ft, !0), u(n, Ln);
	var Tr = c(In);
	return ee(), Tr;
}
d([
	"click",
	"keydown",
	"change"
]);
export { mr as default };
