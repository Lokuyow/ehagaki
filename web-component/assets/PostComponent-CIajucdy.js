import { $ as e, A as t, B as n, D as r, Dt as i, E as a, Et as o, G as s, H as c, Nt as l, Pt as u, Q as d, St as f, T as p, Z as m, _t as h, at as g, b as _, ct as v, dt as y, f as b, ft as x, ht as S, it as C, j as ee, lt as w, mt as T, n as te, o as ne, pt as E, q as D, r as O, rt as k, s as re, t as A, yt as j } from "./index-client-DEFG3Gqk.js";
import { a as M, n as ie } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { p as ae } from "./esm-N9TTQGcl.js";
import { n as N } from "./relayConfigUtils-56ujWwKF.js";
import { Z as oe, t as se } from "./LoadingPlaceholder-YrD8D_td.js";
import { l as ce, n as P } from "./ehagakiDb-DuXS0XPm.js";
import { n as le } from "./operation-BO0VLD7w.js";
import { $ as F, B as ue, C as de, F as I, H as L, I as R, rt as z, t as fe } from "./postHistoryRepository-Bu2z041i.js";
import { r as B } from "./authStore.svelte-DkMZvUSe.js";
import { i as pe } from "./hostRelayRuntime-SryW0auD.js";
import { n as V, v as me } from "./settingsStore.svelte-CAa8Vn5a.js";
import { r as he } from "./appUtils-B3-zUpkb.js";
import { a as H, i as U, n as ge, s as _e, t as ve } from "./signedEventResultValidator-7WV1YEyT.js";
import { C as W, S as ye, _ as be, a as xe, b as Se, p as Ce, v as we, x as Te, y as Ee } from "./uploadStore.svelte-DWirN09w.js";
import { n as De, p as Oe, u as G } from "./clipboardUtils-CSGkJuUA.js";
import { i as ke, n as Ae, u as K } from "./nip46Service-ChjpWe9u.js";
import { i as je, n as Me } from "./publish-DOKLxtGg.js";
import { i as Ne, n as Pe, r as Fe, t as Ie } from "./postEventBuilder-CW5VH1nr.js";
import { n as Le, t as Re } from "./nip65RelayDirectory-B7gmBLn_.js";
import { n as ze, t as Be } from "./Button-Cqrg0_jX.js";
import { t as Ve } from "./ProfileAvatar-eo19xgt6.js";
import { u as He } from "./profileMention-C2raJMGE.js";
import { A as Ue, B as We, C as Ge, D as Ke, G as qe, I as Je, J as Ye, K as Xe, M as Ze, N as Qe, O as $e, R as et, T as tt, U as nt, V as rt, W as q, a as it, b as at, d as ot, f as st, i as ct, j as lt, k as ut, l as dt, n as J, o as ft, q as pt, r as Y, s as mt, t as ht, u as gt, w as _t, x as vt, z as yt } from "./editorStore.svelte-Q7oo5cQe.js";
import { _ as bt, c as xt, g as St, p as Ct, t as wt } from "./mediaNodeUtils-CzHZhHXE.js";
import { t as Tt } from "./keyboardFocusUtils-BhXq7KwV.js";
import { n as Et, r as Dt } from "./reactionValue-pGAZaGcf.js";
import { a as Ot, i as kt, r as At } from "./postReactionUtils-C8gCaYhG.js";
import { n as jt, t as Mt } from "./fileUtils-nRfpyUX-.js";
import { i as Nt, r as Pt, t as Ft } from "./imageCompressionService-DpIpfk5p.js";
import { t as It } from "./postMediaCacheRepository-DfRCsy9f.js";
import { n as Lt, t as Rt } from "./uploadHelper-CNEesjQe.js";
import { A as zt, F as Bt, G as Vt, I as Ht, J as Ut, L as X, M as Wt, O as Gt, Q as Kt, X as qt, Y as Jt, Z as Yt, a as Xt, b as Zt, k as Qt, mt as $t, o as en, rt as tn, st as nn } from "./App-CW2Ynbk9.js";
import { t as rn } from "./postSignerResolver-yBV52Cz4.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/submittedComposition.ts
var an = class {
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
}, on = 3e3, sn = 3e4;
function cn(e) {
	return JSON.stringify({
		reply: e.reply?.eventId ?? null,
		quotes: e.quotes.map((e) => e.eventId)
	});
}
function ln() {
	return {
		authorWrite: !1,
		additional: !1,
		recipients: /* @__PURE__ */ new Set()
	};
}
function un(e, t, n = !1, r = !1) {
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
var dn = class {
	deps;
	rxNostr = null;
	eventSender = null;
	activeNip65Operations = /* @__PURE__ */ new Set();
	operationGeneration = 0;
	constructor(e, t = {}) {
		this.deps = t, e && this.setRxNostr(e), this.deps.console = t.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = t.authStateStore || B, this.deps.hashtagStore = t.hashtagStore || Se, this.deps.mediaFreePlacementStore = t.mediaFreePlacementStore || xe, this.deps.mediaGalleryStore = t.mediaGalleryStore || W, this.deps.contentWarningStore = t.contentWarningStore || we, this.deps.contentWarningReasonStore = t.contentWarningReasonStore || be, this.deps.keyManager = t.keyManager || K, this.deps.createImetaTagFn = t.createImetaTagFn || vt, this.deps.settingsStore = t.settingsStore || V, this.deps.writeRelaysStore = t.writeRelaysStore || me, this.deps.replyQuoteState = t.replyQuoteState || zt, this.deps.getClientTagFn = t.getClientTagFn || (() => ke(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = t.seckeySignerFn || ce, this.deps.extractContentWithImagesFn = t.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = t.extractContentWithEmojiTagsFn || (t.extractContentWithImagesFn ? (e) => ({
			content: t.extractContentWithImagesFn(e),
			emojiTags: []
		}) : qe), this.deps.extractImageBlurhashMapFn = t.extractImageBlurhashMapFn || Ge, this.deps.resetEditorStateFn = t.resetEditorStateFn || it, this.deps.resetPostStatusFn = t.resetPostStatusFn || ft, this.deps.notificationPort = t.iframeMessageService || t.notificationPort || tn, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = t.hashtagPinStore || Te, this.deps.saveHashtagsToHistoryFn = t.saveHashtagsToHistoryFn || Qe, this.deps.clearReplyQuoteFn = t.clearReplyQuoteFn || Qt, this.deps.saveSensitivePayloadFn = t.saveSensitivePayloadFn || ((e) => Le.putCandidate(e));
	}
	setRxNostr(e) {
		this.eventSender && this.cancelActiveNip65Operations(!0), this.rxNostr = e, this.eventSender = new Pe(e, this.deps.console || console);
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
		return cn(this.deps.replyQuoteState.value);
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
			...await Ie.buildEvent(e.processedContent, e.hashtags, e.tags, e.pubkey, e.imageImetaMap, this.deps.createImetaTagFn, this.deps.getClientTagFn, e.contentWarningEnabled, e.contentWarningReason, e.replyQuoteTags, e.channelContext, e.emojiTags, e.failClosedContentWarning, e.publicationKind),
			pubkey: e.pubkey
		};
	}
	async buildNip22ReplyTags(e, t) {
		return ue(e, t);
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
		let t = N.sanitizeExternalRelayUrls(e.result.acceptedRelays), n = N.sanitizeExternalRelayUrls([
			...t,
			...e.additionalWriteRelays ?? [],
			...e.writeRelayHintSnapshot
		], { limit: 3 });
		try {
			let r = await F(P, e.event.pubkey);
			await this.deps.savePostHistoryFn({
				event: e.event,
				attestation: e.attestation,
				acceptedRelays: t,
				relayHints: n
			}), $t(e.event.id, e.event.pubkey, e.result, r).catch(() => void 0);
		} catch {
			this.deps.console?.warn?.("post_history_save_failed", {
				stage: "post-history",
				reason: "unexpected"
			});
		}
	}
	captureAuthorWriteRelays() {
		return Object.freeze(N.sanitizeExternalRelayUrls([...Object.values(this.rxNostr?.getDefaultRelays() ?? {}).filter((e) => e.write).map((e) => e.url), ...this.deps.writeRelaysStore?.value ?? []]));
	}
	async publishSignedEvent(e) {
		let t = z(e.event);
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
			let s = this.deps.authStateStore, c = s.value, l = this.operationGeneration, u = Date.now(), d = u + on, f = u + sn, p = e.authorWriteRelaySnapshot;
			if (pe() && p.length === 0) return {
				success: !1,
				fullyDelivered: !1,
				error: "no_write_relays",
				acceptedRelays: [],
				delivery: {
					authorWrite: un([], /* @__PURE__ */ new Map(), !0),
					taggedUserRead: {},
					additional: []
				}
			};
			let m = N.sanitizeExternalRelayUrls([...e.additionalWriteRelays ?? []]), h = Array.from(new Set((e.sensitive?.structureTemplate.tags ?? e.event.tags ?? []).flatMap((e) => {
				if (!Array.isArray(e) || e[0] !== "p") return [];
				let t = e[1];
				return ae(t) ? [t] : [];
			}))), g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set(), S = /* @__PURE__ */ new Set(), C = Promise.resolve(), ee;
			e.event?.pubkey && F(P, e.event.pubkey).then((e) => {
				ee = e;
			});
			let w, T, te, ne = !1, E = /* @__PURE__ */ new Set(), D = [], O = !0, k = !0, re = !1, A, j = !1, M = je(a, [...p, ...m], h.length > 0), ie = () => M.update([
				...p,
				...m,
				...E
			], [...y].filter(([, e]) => e.accepted).map(([e]) => e), O && h.length > 0, p.length === 0 || !O && h.some((e) => v.get(e) !== "found")), oe = new AbortController(), se, ce = new Promise((e) => {
				se = e;
			}), ue, de = new Promise((e) => {
				ue = e;
			}), I = () => {
				k = !1, O = !1, oe.abort();
				for (let e of E) {
					let t = y.get(e);
					!t?.accepted && !t?.rejected && y.set(e, {
						...t,
						unconfirmed: !0,
						...re ? {} : { timedOut: !0 }
					});
				}
				j = !0, ie(), M.finish(re), ue();
			}, L = new le(12e3, (e) => {
				e === "cancelled" && (re = !0), I();
			});
			Me(a, L);
			let R = {
				acknowledged: () => t,
				cancel: () => {
					k && (k = !1, re = !0, O = !1, se(), L.finish("cancelled"));
				}
			};
			this.activeNip65Operations.add(R);
			let z = () => {
				if (!k || j || ne || Date.now() >= f) return !1;
				let n = s.value;
				return l !== this.operationGeneration || this.rxNostr !== a || this.eventSender !== i || n !== c || !n.isAuthenticated || n.pubkey !== e.sessionPubkey || !t && e.isCurrent?.() === !1 ? (R.cancel(), !1) : !0;
			}, fe = (e) => {
				let t = g.get(e);
				return t || (t = ln(), g.set(e, t)), t;
			};
			p.forEach((e) => {
				fe(e).authorWrite = !0;
			}), m.forEach((e) => {
				fe(e).additional = !0;
			});
			let B = (i, a, s = !0, c = y) => {
				if (j) return;
				s && i.error && (A = i.error);
				let l = new Set(N.sanitizeExternalRelayUrls(i.acceptedRelays)), u = new Map((i.rejectedRelays ?? []).map((e) => [N.normalizeExternalRelayUrl(e.relay) ?? e.relay, e])), d = new Set(N.sanitizeExternalRelayUrls(i.timedOutRelays)), f = new Set(N.sanitizeExternalRelayUrls(i.authRequiredRelays));
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
				if (c === b) for (let e of a) {
					let t = b.get(e);
					x.has(e) || y.set(e, t?.accepted ? { unconfirmed: !0 } : { ...t }), t?.accepted && V(e);
				}
				c === y && !t && [...y.values()].some((e) => e.accepted) && (t = !0, n = {
					success: !0,
					eventId: te?.id ?? e.event.id,
					acceptedRelays: [...y].filter(([, e]) => e.accepted).map(([e]) => e),
					deliveryPending: !0,
					deliverySettled: o
				}, r(n)), ie();
			}, V = (t) => {
				let n = e.sensitive;
				if (!n || S.has(t)) return;
				S.add(t), T ??= t;
				let r = [...b].filter(([, e]) => e.accepted).map(([e]) => e), a = C.then(async () => {
					try {
						await this.deps.saveSensitivePayloadFn?.({
							event: e.event,
							attestation: n.payloadAttestation,
							acceptedRelays: r,
							relayHints: [...g.keys()],
							...typeof ee == "number" ? { localWriteScope: {
								ownerPubkeyHex: e.event.pubkey,
								expectedRevision: ee,
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
				C = a, w ??= a.then(async () => {
					if (!z()) return null;
					try {
						let e = await n.signStructure(T);
						return z() ? (te = e, e) : null;
					} catch {
						return ne = !0, A = "post_error", null;
					}
				});
				let o = (async () => {
					if (await a, !z()) return;
					let e = await w;
					if (!e || !z() || x.has(t)) return;
					x.add(t), y.set(t, { unconfirmed: !0 });
					let n = await i.sendEvent(e, {
						targetRelays: [t],
						includeDefaultWriteRelays: !1,
						waitForAllRelays: !0,
						authDeadlineAt: f,
						settleSignal: oe.signal,
						operation: L,
						onProgress: (e) => B(e, [t], !1)
					});
					B(n, [t]);
				})().catch(() => {
					A = "post_network_error";
				});
				D.push(o);
			}, me = (t) => {
				for (let n of N.sanitizeExternalRelayUrls(t)) {
					if (!z() || E.has(n)) continue;
					E.add(n), ie();
					let t = i.sendEvent(e.event, {
						targetRelays: [n],
						includeDefaultWriteRelays: !1,
						waitForAllRelays: !0,
						authDeadlineAt: f,
						settleSignal: oe.signal,
						operation: L,
						onProgress: (e) => B(e, [n], !1, b)
					}).then((e) => B(e, [n], !0, b)).catch(() => B({
						success: !1,
						error: "post_network_error"
					}, [n], !0, b));
					D.push(t);
				}
			}, he = (t) => {
				if (!z() || !O) return;
				if (e.sensitive) {
					me(t);
					return;
				}
				let n = N.sanitizeExternalRelayUrls(t).filter((e) => !E.has(e));
				if (n.length === 0) return;
				n.forEach((e) => E.add(e)), ie();
				let r = i.sendEvent(e.event, {
					targetRelays: n,
					includeDefaultWriteRelays: !1,
					waitForAllRelays: !0,
					authDeadlineAt: f,
					settleSignal: oe.signal,
					operation: L,
					onProgress: (e) => B(e, n, !1)
				}).then((e) => B(e, n)).catch(() => {
					A = "post_network_error";
					for (let e of n) y.has(e) || y.set(e, { unconfirmed: !0 });
				});
				D.push(r);
			};
			try {
				let t = N.sanitizeExternalRelayUrls([...p, ...m]);
				if (e.sensitive) t.length === 0 && (A = "no_write_relays"), me(t);
				else {
					t.forEach((e) => E.add(e));
					let n = i.sendEvent(e.event, {
						targetRelays: t,
						includeDefaultWriteRelays: !1,
						waitForAllRelays: !0,
						authDeadlineAt: f,
						settleSignal: oe.signal,
						operation: L,
						onProgress: (e) => B(e, t, !1)
					}).then((e) => B(e, t)).catch(() => {
						A = "post_network_error";
						for (let e of t) y.has(e) || y.set(e, { unconfirmed: !0 });
					});
					D.push(n);
				}
				let n = h.map(async (t) => {
					try {
						let n = this.deps.nip65ReadRelayLookupFn ? await this.deps.nip65ReadRelayLookupFn(t, {
							discoveryRelays: e.discoveryRelaysByRecipient?.[t],
							deadlineAt: d,
							operation: L,
							resolveOnReadRoute: !0
						}) : await Re(a).lookup(t, {
							discoveryRelays: e.discoveryRelaysByRecipient?.[t],
							deadlineAt: d,
							operation: L,
							resolveOnReadRoute: !0
						});
						if (!O || !z()) return;
						let r = N.sanitizeExternalRelayUrls(n.readRelays);
						_.set(t, new Set(r)), v.set(t, r.length > 0 ? "found" : "unavailable"), r.forEach((e) => fe(e).recipients.add(t)), he(r);
					} catch {
						O && z() && (_.set(t, /* @__PURE__ */ new Set()), v.set(t, "unavailable"));
					}
				}), r = {};
				n.length > 0 && await Promise.race([
					Promise.all(n),
					ce,
					de,
					new Promise((e) => {
						L.schedule(r, d, e);
					})
				]), L.unschedule(r), O = !1;
				for (let e of h) v.has(e) || (_.set(e, /* @__PURE__ */ new Set()), v.set(e, re ? "cancelled" : "unavailable"));
				ie(), await Promise.race([(async () => {
					let e = 0;
					for (; e < D.length;) {
						let t = D.slice(e);
						e = D.length, await Promise.all(t);
					}
				})(), de]), I(), await C;
				let o = (t, n = !1, r = !1) => un(t, y, n, r || e.sensitive !== void 0 && re), s = o(p, p.length === 0), c = Object.fromEntries(h.map((e) => {
					let t = [..._.get(e) ?? []], n = v.get(e);
					return [e, o(t, n === "unavailable", n === "cancelled")];
				})), l = m.length > 0 ? [o(m)] : [], u = {
					authorWrite: s,
					taggedUserRead: c,
					additional: l
				}, g = N.sanitizeExternalRelayUrls([...y.entries()].filter(([, e]) => e.accepted).map(([e]) => e)), x = [...y.values()].flatMap((e) => e.rejected ? [e.rejected] : []), S = [...y.entries()].filter(([, e]) => e.timedOut).map(([e]) => e), ee = [...y.entries()].filter(([, e]) => e.authRequired).map(([e]) => e), w = g.length > 0, T = s.acceptedRelays.length > 0 && Object.values(c).every((e) => e.acceptedRelays.length > 0) && l.every((e) => e.acceptedRelays.length > 0), ne = S.length > 0 || [...y.values()].some((e) => e.unconfirmed), k = w ? void 0 : e.sensitive && [...b.values()].some((e) => e.accepted) ? "postComponent.error.sensitive_partial_publish" : A ?? (ne ? "post_timeout" : "post_rejected");
				return {
					success: w,
					fullyDelivered: T,
					...k ? { error: k } : {},
					...w ? { eventId: te?.id ?? e.event.id } : {},
					acceptedRelays: g,
					...x.length ? { rejectedRelays: x } : {},
					...S.length ? { timedOutRelays: S } : {},
					...ee.length ? { authRequiredRelays: ee } : {},
					delivery: u
				};
			} finally {
				j = !0, L.finish("complete"), R.cancel(), this.activeNip65Operations.delete(R);
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
			if (U(this.deps.authStateStore, e.sessionPubkey), !o()) throw Error("post_event_runtime_changed");
			if (e.signer && !a) throw Error("nostr_sign_event_not_supported");
			let n = ve(t), r = a ? await a(n.signerTemplate) : t;
			if (!o()) throw Error("post_event_session_changed");
			let i = ge(n.expectedTemplate, r, e.sessionPubkey), s = z(i);
			if (!s) throw Error("post_error");
			return s;
		}, c = e.splitSensitiveContent && e.event.tags.some((e) => e[0] === "content-warning"), l = null, u;
		try {
			u = await s(c ? I(e.event.kind, e.event.content, e.sessionPubkey, e.event.created_at) : e.event);
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
		return Fe.validatePost(e, t.value.isAuthenticated, !!this.rxNostr);
	}
	async resolveSubmissionSigner(e) {
		let { auth: t, sessionPubkey: n, keyManager: r, windowObj: i } = e, a = (e) => rn({
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
		let r = Ne(e), i = this.deps.settingsStore.quoteNotificationEnabled, a = this.deps.replyQuoteService?.extractInlineQuoteTags?.(r, i) ?? new Zt().extractInlineQuoteTags(r, i), o = this.deps.replyQuoteState.value;
		if (o.quotes.length > 0) {
			let e = this.deps.replyQuoteService || new Zt(), t = new Set(a.filter((e) => e[0] === "q").map((e) => e[1])), n = o.quotes.filter((e) => !t.has(e.eventId)).map((t) => e.generateNostrUri(t.eventId, t.relayHints, t.authorPubkey));
			n.length > 0 && (r = `${r.trimEnd()}\n${n.join("\n")}`.trim());
		}
		let s = this.validatePost(r);
		if (!s.valid) return this.notifyPostFailure(s.error);
		if (!this.eventSender) return this.notifyPostFailure("nostr_not_ready");
		try {
			let e = this.deps.authStateStore, i = H(e), o = this.deps.hashtagStore, { hashtags: s, tags: c } = this.getHashtagArrays(o), l = this.deps.keyManager, u = this.deps.window || (typeof window < "u" ? window : void 0), d = this.deps.contentWarningStore.value, f = this.deps.contentWarningReasonStore.value, p = this.deps.settingsStore.failClosedContentWarning === !0, m = this.deps.channelContextState?.value ?? null, h = Object.freeze(N.sanitizeExternalRelayUrls(m?.channelRelays)), g = this.captureAuthorWriteRelays();
			if (pe() && g.length === 0) return this.notifyPostFailure("no_write_relays");
			let _ = N.sanitizeExternalRelayUrls(this.deps.writeRelaysStore?.value ?? []), v = this.deps.replyQuoteState.value, y, b = this.getReplyQuoteNotifyOptions(), x = v.reply?.referencedEvent ?? null;
			if (v.reply && !m && (!x || x.id !== v.reply.eventId || v.reply.authorPubkey && x.pubkey !== v.reply.authorPubkey)) return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
			let S = L({
				channel: !!m,
				hasReply: !!v.reply,
				...x ? { replyKind: x.kind } : {}
			});
			if (S === null) return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
			if (v.reply || v.quotes.length > 0) {
				let e = this.deps.replyQuoteService || new Zt();
				if (y = [], v.reply) {
					if (m) y.push([
						"e",
						v.reply.eventId,
						v.reply.relayHints[0] || "",
						"reply",
						...v.reply.authorPubkey ? [v.reply.authorPubkey] : []
					]), e.buildReplyTags(v.reply).filter((e) => e[0] === "p").forEach((e) => {
						y.push(e);
					});
					else if (S === 1111) {
						let t = x ? await this.buildNip22ReplyTags(x, v.reply.relayHints[0] ?? "") : null;
						if (!t) return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
						if (y.push(...t), S === 1111) {
							let t = new Set(y.filter((e) => e[0] === "p").map((e) => e[1]));
							e.buildReplyTags(v.reply).filter((e) => e[0] === "p").forEach((e) => {
								t.has(e[1]) || (t.add(e[1]), y.push(e));
							});
						}
					} else y.push(...e.buildReplyTags(v.reply));
				}
				let t = /* @__PURE__ */ new Set(), n = new Set(y.filter((e) => e[0] === "p").map((e) => e[1]));
				v.quotes.forEach((r) => {
					e.buildQuoteTags(r, r.quoteNotificationEnabled).forEach((e) => {
						if (e[0] === "q") {
							if (t.has(e[1])) return;
							t.add(e[1]);
						}
						if (e[0] === "p") {
							if (n.has(e[1])) return;
							n.add(e[1]);
						}
						y.push(e);
					});
				});
			}
			let C = {}, ee = (e, t, n) => {
				e && n.some((t) => t[0] === "p" && t[1] === e) && (C[e] = N.sanitizeExternalRelayUrls([...C[e] ?? [], ...t]));
			}, w = this.deps.replyQuoteService || new Zt();
			v.reply && ee(v.reply.authorPubkey, v.reply.relayHints, w.buildReplyTags(v.reply));
			for (let e of v.quotes) e.quoteNotificationEnabled && ee(e.authorPubkey, e.relayHints, w.buildQuoteTags(e, !0));
			if (a.length > 0) {
				y ||= [];
				let e = new Set(y.filter((e) => e[0] === "q").map((e) => e[1])), t = new Set(y.filter((e) => e[0] === "p").map((e) => e[1]));
				for (let n of a) n[0] === "q" && !e.has(n[1]) ? (y.push(n), e.add(n[1])) : n[0] === "p" && !t.has(n[1]) && (y.push(n), t.add(n[1]));
			}
			let T = He(r);
			if (T.length) {
				y ??= [];
				let e = new Set([...y, ...c].filter((e) => e[0] === "p").map((e) => e[1]));
				for (let { pubkey: t, relayHints: n } of T) e.has(t) || (y.push(["p", t]), e.add(t)), ee(t, n, [["p", t]]);
			}
			let te = await this.resolveSubmissionSigner({
				auth: e.value,
				sessionPubkey: i,
				keyManager: l,
				windowObj: u
			});
			if ("failure" in te) return te.failure;
			try {
				let e = await this.buildSubmissionEvent({
					processedContent: r,
					hashtags: s,
					tags: c,
					pubkey: te.pubkey,
					imageImetaMap: t,
					contentWarningEnabled: d,
					contentWarningReason: f,
					failClosedContentWarning: p,
					publicationKind: S,
					replyQuoteTags: y,
					channelContext: m,
					emojiTags: n
				});
				return await this.sendPreparedEvent({
					event: e,
					sessionPubkey: i,
					hashtags: s,
					rqNotifyOptions: b,
					...te.credentials,
					additionalWriteRelays: h,
					discoveryRelaysByRecipient: C,
					splitSensitiveContent: p,
					authorWriteRelaySnapshot: g,
					writeRelayHintSnapshot: _,
					replyQuoteIdentity: cn(v)
				});
			} catch {
				return this.handleSubmissionError(te.errorLabel);
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
		if (t === Se) try {
			let e = Ee();
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
				m: typeof e.attrs.m == "string" && e.attrs.m.startsWith("image/") ? e.attrs.m : void 0,
				dim: e.attrs.dim ?? void 0,
				alt: e.attrs.alt ?? void 0,
				size: Number.isFinite(t) && t > 0 ? t : void 0,
				uploadProtocol: e.attrs.uploadProtocol ?? void 0
			};
		});
		let i = this.deps.extractImageBlurhashMapFn(e), a = {}, o = new Set(Object.keys(i));
		for (let [e, t] of Object.entries(r)) t.m && o.add(e);
		for (let e of o) a[e] = {
			m: r[e]?.m ?? tt(e),
			blurhash: i[e],
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
function fn(e) {
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
			Bt("ownership"), a("ownership");
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
	}, s = Ht((e, t) => o(e, t));
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
			return Et(this.getContext());
		},
		addImageUrls(r) {
			o();
			let a = t, s = r.map((e) => G(e) ? e : null);
			if (!a || n || !i(a) || !s.length || s.some((e) => e === null)) return !1;
			for (let t of s) {
				let n = he();
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
			t && X.value?.sessionToken === t.token && Bt("ownership"), a("ownership"), s();
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postUploadUtils.ts
function pn(e) {
	return !!e && e.length > 0;
}
function mn(e, t, n) {
	e.isUploading = t, n !== void 0 && (e.uploadErrorMessage = n);
}
function hn(e) {
	let t = e.target;
	return t?.files?.length ? t.files : void 0;
}
function gn({ getCurrentEditor: e, getFileInput: t, getImageOxMap: n, getImageXMap: r, getUploadFailedText: i, updateUploadState: a, setUploadErrorMessage: o, uploadFiles: s }) {
	let c = async (c) => pn(c) ? await s({
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
			let t = hn(e);
			t && c(t);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/postUIStore.svelte.ts
var Z = S({
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
}), _n;
function vn() {
	_n !== void 0 && (clearTimeout(_n), _n = void 0);
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
		vn(), Z.floatingMessageX = e, Z.floatingMessageY = t, Z.floatingMessageText = n, Z.showFloatingMessage = !0, _n = setTimeout(() => {
			Z.showFloatingMessage = !1, _n = void 0;
		}, r);
	},
	hideFloatingMessage: () => {
		vn(), Z.showFloatingMessage = !1;
	}
}, yn = D("<div class=\"video-wrapper svelte-aw59wn\"><video controls=\"\" playsinline=\"\" autoplay=\"\" loop=\"\" preload=\"metadata\" class=\"gallery-video svelte-aw59wn\" draggable=\"false\"><track kind=\"captions\"/></video>  <div class=\"video-drag-overlay svelte-aw59wn\" aria-hidden=\"true\"></div></div>", 2), bn = D("<div role=\"group\"><div><!> <!> <!></div> <!></div>"), xn = {
	hash: "svelte-aw59wn",
	code: ".gallery-item.svelte-aw59wn,\n    .gallery-item-media.svelte-aw59wn,\n    .video-wrapper.svelte-aw59wn {position:relative;}.gallery-item.svelte-aw59wn,\n    .gallery-item-media.svelte-aw59wn,\n    .gallery-item-media.svelte-aw59wn .gallery-image,\n    .gallery-video.svelte-aw59wn {-webkit-touch-callout:none;}.gallery-item.svelte-aw59wn,\n    .gallery-item-media.svelte-aw59wn .gallery-image,\n    .gallery-video.svelte-aw59wn {-webkit-user-select:none;user-select:none;}.gallery-item.svelte-aw59wn,\n    .video-drag-overlay.svelte-aw59wn {cursor:grab;}.gallery-item.svelte-aw59wn:active,\n    .video-drag-overlay.svelte-aw59wn:active {cursor:grabbing;}.gallery-item.is-disabled.svelte-aw59wn,\n    .gallery-item.is-disabled.svelte-aw59wn .gallery-item-media:where(.svelte-aw59wn),\n    .gallery-item.is-disabled.svelte-aw59wn .video-drag-overlay:where(.svelte-aw59wn) {cursor:not-allowed;}.gallery-item.is-disabled.svelte-aw59wn {opacity:0.72;}.gallery-item.svelte-aw59wn {display:inline-flex;flex-shrink:0;height:var(--media-gallery-item-height, 180px);overflow:visible;transition:transform 0.15s ease,\n            opacity 0.15s ease;.circle {width:40px;height:40px;}}.gallery-item-media.svelte-aw59wn {height:100%;border-radius:6px;overflow:hidden;display:flex;align-items:center;justify-content:center;}.gallery-item-media[role=\"button\"].svelte-aw59wn {cursor:pointer;background-color:transparent;}.gallery-video.svelte-aw59wn {object-fit:cover;display:block;height:100%;}.gallery-item-media.svelte-aw59wn .gallery-image,\n    .is-placeholder.svelte-aw59wn .gallery-item-media:where(.svelte-aw59wn) {min-width:100px;max-width:var(--media-gallery-max-width, 180px);}.is-placeholder.svelte-aw59wn .gallery-item-media:where(.svelte-aw59wn) {aspect-ratio:var(--gallery-placeholder-aspect-ratio, auto);}.is-placeholder.svelte-aw59wn .gallery-item-media:where(.svelte-aw59wn):not(.has-placeholder-dimensions) {width:var(--media-gallery-max-width, 180px);}.gallery-item-media.svelte-aw59wn .gallery-image {-webkit-drag:none;}.gallery-item-media.svelte-aw59wn .gallery-image.image-loading {opacity:0;}.video-wrapper.svelte-aw59wn {width:var(--media-gallery-max-width, 180px);height:100%;}.gallery-video.svelte-aw59wn {width:100%;}.video-drag-overlay.svelte-aw59wn {position:absolute;inset:0 0 50px;z-index:1;}\n\n    @media (hover: none) and (pointer: coarse) {.video-drag-overlay.svelte-aw59wn {display:none;}\n    }"
};
function Sn(t, c) {
	i(c, !0), ee(t, xn);
	let u = () => re(oe, "$_", m), [m, g] = ne(), x = O(c, "disabled", 3, !1), S = j(void 0), C = j(void 0), w = yt();
	et(() => k(S), { onLongPress: (e, t) => {
		x() || c.onTouchDragStart?.(c.index, e, t);
	} });
	let te = f(() => !c.item.isPlaceholder && c.item.type === "image" && !!c.item.src), E = f(() => !c.item.isPlaceholder && c.item.type === "video" && !!c.item.src), D = f(() => {
		let e = c.item.dimensions;
		if (c.item.isPlaceholder && e && e.width > 0 && e.height > 0) return e.width / e.height;
	});
	function A() {
		c.item.isPlaceholder || c.item.type !== "image" || Q.showImageFullscreen(c.item.src, c.item.alt || "", c.item.id);
	}
	function M(e) {
		if (x()) e.preventDefault();
		else {
			if (k(S) && e.dataTransfer) {
				let t = k(S).getBoundingClientRect(), n = e.clientX - t.left, r = e.clientY - t.top;
				e.dataTransfer.setDragImage(k(S), n, r);
			}
			c.onDragStart(c.index, e);
		}
	}
	function ie(e) {
		e.stopPropagation(), k(C) && (k(C).paused ? k(C).play() : k(C).pause());
	}
	function ae(e) {
		e.preventDefault(), !x() && c.onDragOver(c.index, e);
	}
	function N(e) {
		e.preventDefault(), !x() && c.onDrop(c.index);
	}
	function ce(e) {
		c.item.type !== "image" || c.item.isPlaceholder || (e.key === "Enter" || e.key === " " || e.key === "Spacebar") && (e.preventDefault(), A());
	}
	var P = bn();
	let le;
	var F = y(P);
	let ue;
	var de = y(F), I = (e) => {
		{
			let t = f(() => c.item.type === "video" ? u()("videoNode.uploading") : u()("imageNode.uploading"));
			se(e, {
				get text() {
					return k(t);
				},
				showLoader: !0
			});
		}
	};
	n(de, (e) => {
		c.item.isPlaceholder && e(I);
	});
	var L = T(de, 2), R = (e) => {
		{
			let t = f(() => c.item.alt || ""), n = f(() => ["gallery-image", { "image-loading": !w.isLoaded }]);
			At(e, {
				get src() {
					return c.item.src;
				},
				get alt() {
					return k(t);
				},
				get class() {
					return k(n);
				},
				get onload() {
					return w.handleLoad;
				},
				get onerror() {
					return w.handleError;
				},
				oncontextmenu: (e) => e.preventDefault()
			});
		}
	};
	n(L, (e) => {
		k(te) && e(R);
	});
	var z = T(L, 2), fe = (t) => {
		var n = yn(), r = y(n);
		r.muted = !0, b(r, (e) => h(C, e), () => k(C));
		var i = T(r, 2);
		l(n), v(() => {
			_(r, "src", c.item.src), _(i, "draggable", !x());
		}), d("contextmenu", r, (e) => e.preventDefault()), e("dragstart", i, M), d("click", i, ie), s(t, n);
	};
	n(z, (e) => {
		k(E) && e(fe);
	}), l(F);
	var B = T(F, 2), pe = (e) => {
		{
			let t = f(() => u()("imageContextMenu.delete")), n = f(() => u()("imageContextMenu.copyUrl")), r = f(() => u()("imageContextMenu.copySuccess"));
			We(e, {
				get src() {
					return c.item.src;
				},
				onDelete: () => c.onDelete(c.item.id),
				get deleteAriaLabel() {
					return k(t);
				},
				get copyAriaLabel() {
					return k(n);
				},
				get copySuccessMessage() {
					return k(r);
				},
				layout: "gallery",
				get deleteDisabled() {
					return x();
				}
			});
		}
	};
	n(B, (e) => {
		c.item.isPlaceholder || e(pe);
	}), l(P), b(P, (e) => h(S, e), () => k(S)), v(() => {
		le = a(P, 1, "gallery-item svelte-aw59wn", null, le, {
			"is-placeholder": c.item.isPlaceholder,
			"is-disabled": x()
		}), _(P, "draggable", !x() && (c.item.type !== "video" || c.item.isPlaceholder)), a(F, 1, r(["gallery-item-media", { "has-placeholder-dimensions": k(D) !== void 0 }]), "svelte-aw59wn"), _(F, "role", c.item.type === "image" && !c.item.isPlaceholder ? "button" : void 0), _(F, "tabindex", c.item.type === "image" && !c.item.isPlaceholder ? 0 : void 0), _(F, "aria-label", c.item.alt || c.item.src), ue = p(F, "", ue, { "--gallery-placeholder-aspect-ratio": k(D) });
	}), e("dragstart", P, M), e("dragover", P, ae), e("drop", P, N), e("dragend", P, () => c.onDragEnd()), d("click", F, function(...e) {
		(c.item.type === "image" && !c.item.isPlaceholder ? A : void 0)?.apply(this, e);
	}), d("keydown", F, ce), s(t, P), o(), g();
}
m([
	"click",
	"keydown",
	"contextmenu"
]);
// D:/ドキュメント/GitHub/ehagaki/src/components/ComposerMediaGallery.svelte
var Cn = D("<div><!></div>"), wn = {
	hash: "svelte-1d262pa",
	code: ".media-gallery.sending {background-color:color-mix(\n            in srgb,\n            var(--window) 82%,\n            var(--surface-button) 18%\n        );cursor:not-allowed;}.media-gallery.sending .gallery-item {cursor:not-allowed;}.gallery-item-wrapper.svelte-1d262pa {height:100%;position:relative;display:inline-flex;align-items:center;}\n\n    /* 挿入位置インジケーターバー */.gallery-item-wrapper.insert-bar-left.svelte-1d262pa::before,\n    .gallery-item-wrapper.insert-bar-right.svelte-1d262pa::after {content:\"\";position:absolute;top:0;bottom:0;width:8px;background:var(--theme, #2196f3);border-radius:4px;z-index:10;pointer-events:none;}.gallery-item-wrapper.insert-bar-left.svelte-1d262pa::before {left:-5px;}.gallery-item-wrapper.insert-bar-right.svelte-1d262pa::after {right:-5px;}"
};
function Tn(e, t) {
	i(t, !0), ee(e, wn);
	let n = j(-1), c = j(-1), d = j(-1), p = j(-1), m = null, g = 60, _ = 60, b = j(void 0), x = null, S = f(() => W.items), C = f(() => Y.postStatus.sending), T = f(() => {
		let e = k(n) === -1 ? k(d) : k(n), t = k(n) === -1 ? k(p) : k(c);
		return e === -1 || t === -1 || t === e || t === e + 1 ? -1 : t;
	});
	function te(e, t) {
		k(C) ? t.preventDefault() : (h(n, e, !0), t.dataTransfer?.setData("text/plain", String(e)), t.dataTransfer && (t.dataTransfer.effectAllowed = "move"));
	}
	function ne(e, t) {
		if (t.preventDefault(), k(C)) return;
		let n = k(b)?.querySelectorAll(".gallery-item-wrapper")?.[e];
		if (n) {
			let r = n.getBoundingClientRect();
			h(c, t.clientX < r.left + r.width / 2 ? e : e + 1, !0);
		} else h(c, e, !0);
	}
	function E() {
		ae(), h(n, -1), h(c, -1);
	}
	function D(e) {}
	function O(e) {
		if (k(n) === -1) return;
		if (e.preventDefault(), k(C)) {
			ae(), h(c, -1);
			return;
		}
		let t = k(b)?.querySelectorAll(".gallery-item-wrapper");
		if (t && t.length > 0) {
			let n = t[0].getBoundingClientRect(), r = t[t.length - 1].getBoundingClientRect();
			e.clientX < n.left ? h(c, 0) : e.clientX > r.right && h(c, k(S).length, !0);
		}
		if (k(b)) {
			let t = k(b).getBoundingClientRect();
			e.clientX - t.left < 100 ? M("left", e.clientX) : t.right - e.clientX < 100 ? M("right", e.clientX) : ae();
		}
	}
	function re(e) {
		if (e.preventDefault(), ae(), k(C)) {
			h(n, -1), h(c, -1);
			return;
		}
		let t = k(c);
		if (k(n) !== -1 && t !== -1 && t !== k(n) && t !== k(n) + 1) {
			let e = k(n) < t ? t - 1 : t;
			W.reorderItems(k(n), e);
		}
		h(n, -1), h(c, -1);
	}
	function A(e) {
		k(C) || W.removeItem(e);
	}
	function M(e, t) {
		if (!k(b)) return;
		x !== null && (cancelAnimationFrame(x), x = null);
		let n = k(b).getBoundingClientRect(), r = e === "left" ? t - n.left : n.right - t, i = 1 + 9 * (1 - Math.max(0, Math.min(1, r / 100))), a = () => {
			if (!k(b)) return;
			let t = k(b).scrollWidth - k(b).clientWidth;
			e === "left" && k(b).scrollLeft > 0 ? (k(b).scrollLeft = Math.max(0, k(b).scrollLeft - i), x = requestAnimationFrame(a)) : e === "right" && k(b).scrollLeft < t ? (k(b).scrollLeft = Math.min(t, k(b).scrollLeft + i), x = requestAnimationFrame(a)) : x = null;
		};
		x = requestAnimationFrame(a);
	}
	function ae() {
		x !== null && (cancelAnimationFrame(x), x = null);
	}
	function N(e, t, n) {
		if (k(C)) return;
		h(d, e, !0), ce();
		let r = k(b)?.querySelectorAll(".gallery-item-wrapper")[e];
		if (r) {
			let e = r.getBoundingClientRect(), i = Math.min(120 / e.width, 120 / e.height);
			g = e.width * i / 2, _ = e.height * i / 2, m = r.cloneNode(!0), m.style.cssText = `
                position: fixed;
                left: ${t - g}px;
                top: ${n - _}px;
                width: ${e.width}px;
                height: ${e.height}px;
                transform-origin: top left;
                transform: scale(${i});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, ie().overlayTarget.appendChild(m);
		}
		document.addEventListener("touchmove", oe, { passive: !1 }), document.addEventListener("touchend", se, { passive: !1 });
	}
	function oe(e) {
		if (k(d) === -1 || e.touches.length !== 1) return;
		if (e.preventDefault(), k(C)) {
			ae(), h(p, -1);
			return;
		}
		let t = e.touches[0];
		m && (m.style.left = `${t.clientX - g}px`, m.style.top = `${t.clientY - _}px`), m && (m.style.display = "none");
		let n = document.elementFromPoint(t.clientX, t.clientY);
		m && (m.style.display = "");
		let r = n?.closest(".gallery-item-wrapper");
		if (r && k(b)) {
			let e = k(b).querySelectorAll(".gallery-item-wrapper"), n = Array.from(e).indexOf(r);
			if (n !== -1) {
				let e = r.getBoundingClientRect();
				h(p, t.clientX < e.left + e.width / 2 ? n : n + 1, !0);
			}
		} else if (k(b)) {
			let e = k(b).querySelectorAll(".gallery-item-wrapper");
			if (e.length > 0) {
				let n = e[0].getBoundingClientRect(), r = e[e.length - 1].getBoundingClientRect();
				t.clientX <= n.left ? h(p, 0) : t.clientX >= r.right && h(p, k(S).length, !0);
			}
		}
		if (k(b)) {
			let e = k(b).getBoundingClientRect();
			t.clientX - e.left < 100 ? M("left", t.clientX) : e.right - t.clientX < 100 ? M("right", t.clientX) : ae();
		}
	}
	function se() {
		if (document.removeEventListener("touchmove", oe), document.removeEventListener("touchend", se), ae(), k(C)) {
			ce(), h(d, -1), h(p, -1);
			return;
		}
		let e = k(p);
		if (k(d) !== -1 && e !== -1 && e !== k(d) && e !== k(d) + 1) {
			let t = k(d) < e ? e - 1 : e;
			W.reorderItems(k(d), t);
		}
		ce(), h(d, -1), h(p, -1);
	}
	function ce() {
		m &&= (m.remove(), null);
	}
	function P(e) {
		if (!k(b)) return;
		let t = k(b).closest(".composer-scroll-region");
		Ot(k(b), e, t instanceof HTMLElement ? t : null) && e.preventDefault();
	}
	w(() => {
		let e = k(b);
		if (e) return e.addEventListener("wheel", P, { passive: !1 }), () => e.removeEventListener("wheel", P);
	});
	{
		let t = (e, t = u, n = u) => {
			var i = Cn();
			Sn(y(i), {
				get item() {
					return t();
				},
				get index() {
					return n();
				},
				onDelete: A,
				onDragStart: te,
				onDragOver: ne,
				onDragEnd: E,
				onDrop: D,
				onTouchDragStart: N,
				get disabled() {
					return k(C);
				}
			}), l(i), v(() => a(i, 1, r(["gallery-item-wrapper", {
				"insert-bar-left": k(T) === n(),
				"insert-bar-right": k(T) === k(S).length && n() === k(S).length - 1
			}]), "svelte-1d262pa")), s(e, i);
		}, i = f(() => k(C) ? "sending" : void 0), o = f(() => k(n) !== -1);
		kt(e, {
			get items() {
				return k(S);
			},
			get class() {
				return k(i);
			},
			get dragging() {
				return k(o);
			},
			ondragover: O,
			ondrop: re,
			get element() {
				return k(b);
			},
			set element(e) {
				h(b, e, !0);
			},
			renderItem: t,
			$$slots: { renderItem: !0 }
		});
	}
	o();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/editorDomActions.svelte.ts
function En(e) {
	if (!e || !e.types) return !1;
	try {
		return Array.from(e.types).some((e) => e === "application/x-tiptap-node");
	} catch {
		return !1;
	}
}
function Dn(e) {
	if (!e) return !1;
	try {
		return Array.from(e.types).includes("Files") || e.files && e.files.length > 0;
	} catch {
		return !!(e.files && e.files.length > 0);
	}
}
function On(e) {
	let t = e.__postStatus;
	return (typeof t == "function" ? t() : t)?.sending === !0;
}
function kn(e) {
	return typeof e.__uploadFiles == "function";
}
function An(e) {
	let t = j(!1);
	function n(n) {
		if (On(e) || !kn(e)) {
			n.preventDefault(), h(t, !1), e.classList.remove("drag-over");
			return;
		}
		let r = n.dataTransfer, i = En(r);
		Dn(r) && !i ? (n.preventDefault(), k(t) || (h(t, !0), e.classList.add("drag-over"))) : k(t) && (h(t, !1), e.classList.remove("drag-over"));
	}
	function r(n) {
		k(t) && (h(t, !1), e.classList.remove("drag-over"));
	}
	async function i(n) {
		if (h(t, !1), e.classList.remove("drag-over"), On(e) || !kn(e)) {
			n.preventDefault();
			return;
		}
		let r = n.dataTransfer;
		if (!En(r) && r?.files && r.files.length > 0) {
			let t = e;
			typeof t.__uploadFiles == "function" && (n.preventDefault(), t.__uploadFiles(r.files));
		}
	}
	return e.addEventListener("dragover", n), e.addEventListener("dragleave", r), e.addEventListener("drop", i), { destroy() {
		e.removeEventListener("dragover", n), e.removeEventListener("dragleave", r), e.removeEventListener("drop", i);
	} };
}
function jn(e, t) {
	let n = An(e);
	function r(n) {
		if (On(e) || !kn(e)) {
			n.preventDefault(), t.dragOver(!1);
			return;
		}
		let r = n.dataTransfer, i = En(r);
		Dn(r) && !i ? t.dragOver(!0) : t.dragOver(!1);
	}
	function i(e) {
		t.dragOver(!1);
	}
	function a(n) {
		t.dragOver(!1), (On(e) || !kn(e)) && n.preventDefault();
	}
	return e.addEventListener("dragover", r), e.addEventListener("dragleave", i), e.addEventListener("drop", a), { destroy() {
		n?.destroy?.(), e.removeEventListener("dragover", r), e.removeEventListener("dragleave", i), e.removeEventListener("drop", a);
	} };
}
function Mn(e) {
	function t(t) {
		if (On(e)) {
			t.preventDefault();
			return;
		}
		if (!t.clipboardData) return;
		let n = De(t.clipboardData);
		n.length !== 0 && (t.preventDefault(), kn(e) && e.__uploadFiles?.(n));
	}
	return e.addEventListener("paste", t), { destroy() {
		e.removeEventListener("paste", t);
	} };
}
function Nn(e) {
	function t(e) {
		let t = e.target;
		if (t && (t.closest(".editor-image-button[data-dragging=\"true\"]") || t.closest(".custom-emoji-drag-target[data-dragging=\"true\"]"))) {
			let t = e.touches[0], n = Ct.querySelector(".tiptap-editor");
			if (n) {
				let r = n.getBoundingClientRect(), i = t.clientY < r.top + 120, a = t.clientY > r.bottom - 120;
				if (!i && !a) return e.preventDefault(), !1;
			}
		}
	}
	function n(e) {
		let t = Ct.querySelectorAll(".drop-zone-indicator");
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
function Pn(e, t = !0) {
	function n(n) {
		if (t && !n.defaultPrevented && (n.ctrlKey || n.metaKey) && (n.key === "Enter" || n.key === "NumpadEnter")) {
			let t = e, r = t.__currentEditor, i = typeof r == "function" ? r() : r;
			if (Ue(n, i?.view)) return;
			n.preventDefault();
			let a = t.__hasPostingCapability, o = typeof a == "function" ? a() : a, s = t.__hasStoredKey, c = typeof s == "function" ? s() : s, l = t.__postStatus, u = typeof l == "function" ? l() : l, d = i ? q(i) : "";
			!u?.sending && d.trim() && (o ?? c) && t.__submitPost?.();
		}
	}
	return e.addEventListener("keydown", n), { destroy() {
		e.removeEventListener("keydown", n);
	} };
}
function Fn(e) {
	let t = !1;
	return e?.descendants((e) => {
		if (t) return !1;
		let n = e.type.name;
		(n === "image" || n === "video") && (t = !0);
	}), t;
}
function In(e) {
	let { currentEditor: t, editorContainerEl: n, callbacks: r } = e, i = (e) => {
		let n = e.detail.plainText, i = t ? Fn(t.state?.doc) : !1;
		r.onContentUpdate?.(n, i);
	}, a = (e) => {
		let t = e;
		r.onImageFullscreenRequest?.(t.detail.src, t.detail.alt || "", t.detail.mediaId);
	}, o = (e) => {
		let n = e?.detail?.pos;
		if (n != null && t && t.view) {
			try {
				"ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
				let e = pt.create(t.state.doc, n);
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
function Ln(e, t) {
	window.removeEventListener("editor-content-changed", e.handleContentUpdate), window.removeEventListener("image-fullscreen-request", e.handleImageFullscreenRequest), window.removeEventListener("select-image-node", e.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", e.handleImageFullscreenRequest), t.removeEventListener("select-image-node", e.handleSelectImageNode));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postComponentUtils.ts
function Rn() {
	return {
		sending: !0,
		success: !1,
		error: !1,
		message: "",
		completed: !1
	};
}
function zn() {
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
			e(Rn());
		},
		markSuccess: (r) => {
			e(zn()), r?.preserveComposerContent || (t(), n?.(r));
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
	} : xt(e.dim) || {};
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
	let { input: t, postHistoryRepositoryImpl: n = fe, postMediaCacheRepositoryImpl: r = It } = e;
	await n.putPostedEvent(t);
	let i = de(t.event).map((e) => e.url).filter(Boolean);
	i.length !== 0 && await r.linkEventIdByUrls({
		eventId: t.event.id,
		urls: i
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/editorLifecycle.ts
function Zn(e) {
	let { placeholderText: t, editorContainerEl: n, hasStoredKey: r, hasPostingCapability: i, submitPost: a, onCustomEmojiSelect: o, getCustomEmojiItems: s, getProfileMentionItems: c, profileMentionSource: l, enterKeyBehavior: u, hostOwnedLite: d, submitShortcuts: f, uploadFiles: p, eventCallbacks: m } = e;
	ct.value = t;
	let h = Ke({
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
		getProfileMentionItems: c,
		profileMentionSource: l,
		enterKeyBehavior: u,
		hostOwnedLite: d,
		submitShortcuts: f,
		onCreate: (e) => {
			J.set(e);
		}
	}), g = null, _ = h.subscribe((e) => {
		g = e;
	}), v = In({
		currentEditor: g,
		editorContainerEl: n,
		callbacks: m
	});
	return mt(a), n && Object.assign(n, {
		__uploadFiles: p,
		__currentEditor: () => g,
		__hasStoredKey: () => r,
		__hasPostingCapability: () => i ?? r,
		__postStatus: () => Y.postStatus,
		__submitPost: a
	}), {
		editor: h,
		unsubscribe: _,
		handlers: v
	};
}
function Qn(e) {
	let { unsubscribe: t, componentUnsubscribe: n, handlers: r, currentEditor: i, editorContainerEl: a, submitPost: o } = e;
	if (Ln(r, a), J.value === i && J.set(null), ht(o), n(), t(), i && !i.isDestroyed && i.destroy(), a) {
		let e = a;
		delete e.__uploadFiles, delete e.__currentEditor, delete e.__hasStoredKey, delete e.__hasPostingCapability, delete e.__postStatus, delete e.__submitPost;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/customEmojiInsertion.ts
function $n(e, t) {
	let n = e.view.dom;
	bt() && document.activeElement !== n ? e.commands.insertCustomEmoji(t) : e.chain().focus().insertCustomEmoji(t).run();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hostOwnedUpload.ts
var $ = /* @__PURE__ */ new Set([
	"alt",
	"blurhash",
	"dim",
	"m",
	"ox",
	"size",
	"x"
]);
function er(e) {
	if (typeof e != "string") return !1;
	try {
		let t = new URL(e);
		return t.protocol === "http:" || t.protocol === "https:";
	} catch {
		return !1;
	}
}
function tr(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return {};
	let t = {};
	for (let [n, r] of Object.entries(e)) $.has(n) && typeof r == "string" && (t[n] = r);
	return t;
}
function nr(e) {
	return {
		localStorage: M(),
		crypto: window.crypto.subtle,
		tick: C,
		FileUploadManager: e,
		getImageDimensions: jt,
		extractImageBlurhashMap: Ge,
		calculateImageHash: at,
		getMimeTypeFromUrl: tt,
		createImetaTag: vt,
		imageSizeMapStore: ye
	};
}
var rr = class {
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
		return await _t(e);
	}
	async uploadFileWithCallbacks() {
		throw Error("Host-owned media never uses eHagaki upload transport.");
	}
	async uploadMultipleFilesWithCallbacks() {
		throw Error("Host-owned media never uses eHagaki upload transport.");
	}
};
function ir(e) {
	let t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
	return {
		fileUploadManager: rr,
		async prepareFiles(r, i) {
			let a = new Pt(typeof document > "u" ? void 0 : document), o = () => e.signal.aborted || !!i.isUploadAborted?.(), s = new Ft(a, i.localStorage, o), c = new Nt(i.localStorage, o), l = [];
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
				let d = await Mt(u, i.crypto, o).catch(() => void 0), f = await (u.type.startsWith("video/") ? c : s).compress(u);
				if (f.aborted || e.signal.aborted) throw new DOMException("The host media operation was aborted.", "AbortError");
				let p = f.file.type.startsWith("image/") ? await jt(f.file) : null;
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
					if (!er(t?.url)) {
						o.push({
							...s,
							success: !1,
							error: "host_media_invalid_result"
						});
						continue;
					}
					let r = tr(t.imeta);
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
						...n.get(i) ? { dimensions: n.get(i) } : c.width && c.height ? { dimensions: wt(c.width, c.height) } : {},
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
var ar = D("<div class=\"editor-account-placeholder svelte-15ticnd\" aria-hidden=\"true\"><!></div>"), or = D("<div class=\"plane-icon svg-icon svelte-15ticnd\"></div>"), sr = D("<div class=\"editor-submit-button-container svelte-15ticnd\"><!></div>"), cr = D("<input type=\"file\" style=\"display: none;\" class=\"svelte-15ticnd\"/>"), lr = D("<div class=\"upload-error svelte-15ticnd\"> </div>"), ur = D("<div class=\"svelte-15ticnd\"> </div>"), dr = D("<div data-post-editor-root=\"\"><div role=\"textbox\" tabindex=\"-1\"><!> <!> <!></div> <!> <!> <!></div> <!> <!> <!>", 1), fr = {
	hash: "svelte-15ticnd",
	code: ".editor-profile-mention {color:var(--accent-color, currentColor);font-weight:600;overflow-wrap:anywhere;}.post-container.svelte-15ticnd,\n  .editor-container.svelte-15ticnd,\n  .editor-content,\n  .tiptap-editor {width:100%;flex:1 1 auto;}.post-container.svelte-15ticnd,\n  .editor-container.svelte-15ticnd,\n  .editor-content {display:flex;flex-direction:column;}.post-container.svelte-15ticnd,\n  .editor-content,\n  .tiptap-editor {min-height:0;}.editor-content,\n  .tiptap-editor {height:100%;}.post-container.svelte-15ticnd {max-width:800px;align-items:stretch;overflow:visible;--post-editor-block-padding: 10px;--post-editor-line-height: 30px;--post-editor-submit-button-size: 40px;--post-editor-submit-button-inline-inset: 14px;}.upload-error.svelte-15ticnd {color:#c62828;font-size:0.9rem;margin-bottom:10px;width:100%;text-align:left;}.editor-container.svelte-15ticnd {min-height:var(--post-editor-min-height, 92px);height:var(--post-editor-target-height, auto);max-height:var(--post-editor-target-height, auto);position:relative;cursor:text;outline:none;background:var(--surface-editor);-webkit-tap-highlight-color:transparent;overflow:hidden;}.post-container.editor-auto-grow.svelte-15ticnd,\n  .post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd),\n  .post-container.editor-auto-grow.svelte-15ticnd .editor-content,\n  .post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {flex:0 0 auto;}.post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd),\n  .post-container.editor-auto-grow.svelte-15ticnd .editor-content,\n  .post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {height:auto;}.post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd) {min-height:0;max-height:none;}.post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {min-height:calc(\n      var(--post-editor-auto-grow-min-lines) + var(--post-editor-block-padding) +\n        var(--post-editor-block-padding)\n    );max-height:calc(\n      var(--post-editor-auto-grow-max-lines) + var(--post-editor-block-padding) +\n        var(--post-editor-block-padding)\n    );}.editor-account-placeholder {position:absolute;top:11px;left:14px;z-index:3;width:28px;height:28px;pointer-events:none;user-select:none;-webkit-user-select:none;}.editor-account-placeholder-avatar {display:block;width:100%;height:100%;overflow:hidden;border-radius:50%;}.editor-account-placeholder-image,\n  .editor-account-placeholder-fallback {display:block;width:100%;height:100%;border-radius:50%;}.editor-account-placeholder-image {opacity:0.5;object-fit:cover;}.editor-account-placeholder-fallback[data-loading=\"true\"] {visibility:hidden;\n    animation: none;}.editor-container.account-avatar-placeholder.svelte-15ticnd\n    p.is-editor-empty:first-child::before {padding-left:38px;}.editor-container.sending.svelte-15ticnd {background:color-mix(\n      in srgb,\n      var(--surface-editor) 82%,\n      var(--surface-button) 18%\n    );cursor:not-allowed;}.editor-container.sending.svelte-15ticnd .tiptap-editor {cursor:not-allowed;opacity:0.72;}.editor-container.editor-submit-enabled.sending.svelte-15ticnd .tiptap-editor {pointer-events:none;}.editor-container.sending.svelte-15ticnd .editor-image-button,\n  .editor-container.sending.svelte-15ticnd .custom-emoji-drag-target,\n  .editor-container.sending.svelte-15ticnd .media-delete-btn {pointer-events:none;}.editor-container.editor-submit-enabled.svelte-15ticnd .tiptap-editor {padding-inline-end:calc(var(--post-editor-submit-button-inline-inset) + var(--post-editor-submit-button-size));}.editor-submit-button-container.svelte-15ticnd {position:absolute;inset-inline-end:var(--post-editor-submit-button-inline-inset);bottom:var(--post-editor-block-padding);z-index:4;}.post-container.editor-auto-grow.svelte-15ticnd .editor-submit-button-container:where(.svelte-15ticnd) {bottom:calc(\n      var(--post-editor-block-padding) +\n        (var(--post-editor-line-height) - var(--post-editor-submit-button-size)) /\n        2\n    );}.editor-submit-button {width:var(--post-editor-submit-button-size);height:var(--post-editor-submit-button-size);flex:0 0 var(--post-editor-submit-button-size);}button.editor-submit-button .plane-icon.svg-icon {width:22px;height:22px;mask-image:var(--ehagaki-icon-70617065722d706c616e652d736f6c69642d66756c6c2e737667);margin-inline-end:1px;margin-top:1px;}.editor-container.drag-over.svelte-15ticnd {border:3px dashed var(--theme);}\n\n  /* ギャラリーモード時はドロップカーソル（差し込み位置バー）を常に非表示 */.editor-container.gallery-mode.svelte-15ticnd .tiptap-dropcursor {display:none !important;}\n\n  /* Tiptapエディターのスタイル */.tiptap-editor {display:block;padding:var(--post-editor-block-padding);font-family:inherit;font-size:1.25rem;line-height:var(--post-editor-line-height);outline:none;overflow-y:auto;overflow-x:hidden;scroll-padding-bottom:16px;scroll-behavior:auto;will-change:scroll-position;transform:translateZ(0);-webkit-tap-highlight-color:transparent;.editor-paragraph {margin:0;padding:0;color:var(--text);position:relative;z-index:2;word-break:normal;overflow-wrap:anywhere;line-break:loose;white-space:break-spaces;}.hashtag {color:var(--hashtag-text);font-weight:600;background:var(--hashtag-bg);padding:2px 4px;border-radius:4px;word-break:break-all;}.preview-link {color:var(--link);word-break:break-all;}.preview-link:visited {color:var(--link-visited);}p.is-editor-empty:first-child::before {color:var(--text);content:attr(data-placeholder);float:left;height:0;pointer-events:none;opacity:0.6;}.toolbar-caret {display:inline-block;width:0;height:1.5em;margin-left:-1px;border-left:2px solid var(--text);vertical-align:-0.25em;pointer-events:none;\n      animation: svelte-15ticnd-toolbar-caret-blink 1s steps(1) infinite;}}\n\n  @keyframes svelte-15ticnd-toolbar-caret-blink {\n    0%,\n    49% {\n      opacity: 1;\n    }\n    50%,\n    100% {\n      opacity: 0;\n    }\n  }\n\n  /* ドロップゾーンのフェードアウトアニメーション（改善版） */.drop-zone-fade-out {\n    animation: svelte-15ticnd-dropZoneFadeOut 0.3s ease-out forwards;}\n\n  @keyframes svelte-15ticnd-dropZoneFadeOut {\n    from {\n      opacity: 0.9;\n      transform: scale(1);\n    }\n    to {\n      opacity: 0;\n      transform: scale(0.8);\n    }\n  }\n\n  /* タッチデバイス用の追加スタイル */\n  @media (hover: none) and (pointer: coarse) {.editor-container.svelte-15ticnd {-webkit-tap-highlight-color:transparent;will-change:scroll-position;}\n\n    /* ドラッグ中の視覚フィードバック強化 */.editor-image-button[data-dragging=\"true\"] {z-index:1;}.tiptap-editor {-webkit-user-select:text;user-select:text;-webkit-transform:translateZ(0);transform:translateZ(0);backface-visibility:hidden;}\n  }\n\n  /* ProseMirror のギャップカーソルの色を上書き（Light / Dark 対応） */.tiptap-editor .ProseMirror-gapcursor:after,\n  .tiptap-editor .ProseMirror-gapcursor:before {border-top-color:light-dark(black, white);}"
};
function pr(r, u) {
	i(u, !0), ee(r, fr);
	let m = () => re(oe, "$_", C), [C, D] = ne(), M = O(u, "hasPostingCapability", 19, () => u.hasStoredKey), ae = O(u, "isSwitchingAccount", 3, !1), N = O(u, "profilePending", 3, !1), se = O(u, "availableComposerHeight", 3, 152), ce = O(u, "minEditorHeight", 3, 152);
	O(u, "hostCustomEmojiItems", 19, () => []);
	let P = f(() => !0), le = f(() => Y.isUploading), F = f(() => Y.canPost), ue = f(() => !1), de = j(null), I = j(null), L = j(null), R = j(!1), z = j(!1), pe = j(void 0), V = j(void 0), me = !1, H = j(S({})), U = j(S({})), ge = f(() => xe.value), ve = f(() => !k(ge) || !!X.value), Se = j(0), De = f(() => (k(Se), G?.getInputMode() ?? "singleValue")), G = fn({
		getEditor: () => J.value,
		getAuth: () => B.value,
		getRuntime: () => u.rxNostr,
		getEnvironment: ie,
		isFreePlacement: () => xe.value,
		getItems: () => W.getItems(),
		addItem: (e) => W.addItem(e),
		removeItem: (e) => W.removeItem(e),
		removePlaceholderSize: (e) => ye.update((t) => {
			let n = { ...t };
			return delete n[e], n;
		}),
		restoreItems: (e, t) => {
			k(tt)?.editor === e && !k(tt).isCurrent() && (h(tt, null), k(V)?.cancelActiveNip65Operations(), Y.isSubmitPending = !1, Y.postStatus.sending && ft());
			let n = Yn({
				currentEditor: e,
				items: t
			});
			return Object.assign(k(H), n.imageOxMap), Object.assign(k(U), n.imageXMap), n.movedItemIds;
		},
		onChange: () => {
			h(Se, k(Se) + 1);
		},
		onUploadEnd: () => mn(Y, !1, "")
	});
	function ke(e) {
		return k(Se), Dt(e.state.doc, G?.getContext() ?? !1);
	}
	w(() => {
		B.value, u.rxNostr, J.value, X.value, g(() => G?.sync());
	}), w(() => {
		Ce.value && g(() => G?.abortUpload());
	});
	let K = f(() => Y.postStatus), je = f(() => Y.uploadErrorMessage), Me = f(() => Yt.value), Ne = f(() => Kt.value), Pe = f(() => qt.value), Fe = j(!0), Ie = !1, Le = f(() => u.hasStoredKey && !ae() && k(Ne) && !k(Pe) && k(Fe)), Re = null, He = null, Ue = null, We = null, Ge = j(S(152)), Ke = f(() => !1), qe = f(() => k(Ke) ? `--post-editor-auto-grow-min-lines: ${u.hostOwnedConfig.editorMinLines}lh; --post-editor-auto-grow-max-lines: ${u.hostOwnedConfig.editorMaxLines}lh;` : `--post-editor-min-height: ${ce()}px; --post-editor-target-height: ${k(Ge)}px;`), Qe = f(() => X.value && k(De) === "uploadedShortcode" ? m()("reaction.shortcode_hint") : m()("postComponent.enter_your_text") || "テキストを入力してください");
	w(() => {
		let e = k(I), t = W.hasNonPlaceholderItems();
		e && et(e, t);
	});
	function et(e, t) {
		let n = X.value && e ? ke(e).value : null;
		gt(e, t, X.value ? !!n && !(!e || ut(e)) : void 0, n?.type === "text" && n.text === "+" ? "favorite" : "plane");
	}
	let tt = j(null);
	w(() => {
		let e = k(tt);
		e && !e.isCurrent() && (h(tt, null), g(() => {
			k(V)?.cancelActiveNip65Operations(), J.value === e.editor && (Y.isSubmitPending = !1, Y.postStatus.sending && ft());
		}));
	});
	function q() {
		return k(K).sending || k(R);
	}
	w(() => {
		k(I), ot(k(Qe));
	}), w(() => {});
	function it() {
		if (k(Ke)) return;
		let e = ce();
		if (!Re || !He) {
			h(Ge, e, !0);
			return;
		}
		let t = Array.from(Re.children).reduce((e, t) => t === He ? e : e + Xt(t), 0), n = en({
			availableComposerHeight: se(),
			nonEditorHeight: t,
			minHeight: e
		});
		k(Ge) !== n && h(Ge, n, !0);
	}
	function at(e) {
		q() ? e.preventDefault() : e.target instanceof HTMLElement && k(I) && (St(e.target) || k(I).commands.focus("end"));
	}
	function ct(e) {
		!k(I) || e.currentTarget !== e.target || e.key !== "Enter" && e.key !== " " || (e.preventDefault(), k(I).commands.focus("end"));
	}
	function pt(e) {
		q() && (!k(L)?.isCompositionInputAllowed() || !e.isComposing && e.keyCode !== 229) && (e.preventDefault(), e.stopPropagation());
	}
	function mt(e) {
		let t = k(L)?.isCompositionInputAllowed() && e instanceof InputEvent && (e.isComposing || e.inputType === "insertCompositionText" || e.inputType === "insertFromComposition");
		q() && !t && (e.preventDefault(), e.stopPropagation());
	}
	function ht(e) {
		e.preventDefault();
	}
	function _t(e) {
		let t = k(I)?.view.dom;
		k(ue) && t && e.relatedTarget === t && t.focus({ preventScroll: !0 });
	}
	let vt = f(() => Q.value), yt = f(() => k(vt).showSecretKeyDialog), bt = f(() => k(vt).showImageFullscreen), xt = f(() => k(vt).fullscreenMediaId), Ct = f(() => k(vt).fullscreenImageSrc), wt = f(() => k(vt).fullscreenImageAlt), Et = f(() => k(vt).showFloatingMessage), Ot = f(() => k(vt).floatingMessageX), kt = f(() => k(vt).floatingMessageY), At = f(() => k(vt).floatingMessageText);
	w(() => {
		u.rxNostr && (k(V) ? k(V).setRxNostr(u.rxNostr) : h(V, new dn(u.rxNostr, {
			getNip46SignerForSessionFn: (e) => Ae.getSignerForSession(e),
			getParentClientSignerFn: () => _e.getSigner(),
			channelContextState: Gt,
			replyQuoteState: zt,
			replyQuoteService: new Zt(),
			clearReplyQuoteFn: Qt,
			savePostHistoryFn: (e) => Xn({
				input: e,
				postHistoryRepositoryImpl: fe
			}),
			notificationPort: u.notificationPort,
			storeSignedEventsFn: (e, t) => u.storeSignedEventsFn?.(e, t)
		}), !0));
	});
	let jt = gn({
		getCurrentEditor: () => k(I),
		getFileInput: () => k(pe),
		getImageOxMap: () => k(H),
		getImageXMap: () => k(U),
		getUploadFailedText: (e) => m()(e),
		updateUploadState: (e, t) => {
			mn(Y, e, t);
		},
		setUploadErrorMessage: (e) => {
			Y.uploadErrorMessage = e;
		},
		uploadFiles: async (e) => {
			if (q() || Y.isSubmitPending || Y.isUploading) return null;
			{
				let t = X.value;
				if (t && (e.files.length !== 1 || !e.files[0].type.startsWith("image/") && !Je(e.files[0]))) return Y.uploadErrorMessage = m()("postComponent.reactionUnsupportedImage"), null;
				let n = t ? G?.beginUpload() : void 0;
				if (t && !n) return null;
				n && Ce.reset(), mn(Y, !0, "");
				try {
					let t = u.normalUploadFiles ?? (await import("./normalUploadHelper-DEpabIg-.js")).uploadFiles;
					return n && (!n.isCurrent() || n.signal.aborted) ? null : await t({
						...e,
						...n ? { reactionUpload: n } : {}
					});
				} finally {
					n ? (n.isCurrent() && mn(Y, !1), G?.endUpload(n)) : mn(Y, !1);
				}
			}
			if (!u.hostOwnedConfig?.uploadMedia) return mn(Y, !1, m()("postComponent.media_not_supported")), null;
			mn(Y, !0, "");
			let t = ir({
				uploadMedia: u.hostOwnedConfig.uploadMedia,
				signal: u.hostOwnedConfig.signal
			});
			try {
				return await Lt({
					...e,
					showUploadError: (e, t) => Rt(e, t, {
						updateUploadState: (e, t) => {
							mn(Y, e, t);
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
					dependencies: nr(t.fileUploadManager),
					prepareFiles: t.prepareFiles,
					uploadPreparedFiles: t.uploadPreparedFiles,
					fileUploadManager: t.fileUploadManager,
					fileUploadManagerInstance: new t.fileUploadManager(),
					deferUploadStateClear: !0,
					isUploadAborted: () => !!u.hostOwnedConfig.signal.aborted
				});
			} finally {
				mn(Y, !1);
			}
		}
	});
	function Mt() {
		let e = !!(k(I)?.view.composing && Jt());
		e && k(I)?.view.dom.blur(), wn(), e ? k(L)?.retire() : k(L)?.markStale();
	}
	let Nt = Vn({
		updatePostStatus: st,
		clearContentAfterSuccess: Mt,
		onPostSuccess: (e) => {
			e?.event?.kind === 7 ? u.onReactionResult?.(e) : u.onPostSuccess?.(e);
		}
	});
	A(() => {
		G?.dispose(), me = !0, Bt("ownership"), k(V)?.cancelActiveNip65Operations();
	});
	function Pt(e) {
		k(L)?.markFailure(), Nt.markFailure(e);
	}
	w(() => {
		k(Ke) || (se(), ce(), k(ve), k(je), k(I), k(ve) && W.items.length, typeof window > "u" ? h(Ge, 152, !0) : g(() => it()));
	}), w(() => {
		if (k(Ke) || (se(), ce(), k(I), k(ve), k(je), !Re || typeof ResizeObserver > "u")) return;
		let e = null, t = () => {
			e === null && (e = window.requestAnimationFrame(() => {
				e = null, it();
			}));
		}, n = new ResizeObserver(t);
		t(), n.observe(Re);
		for (let e of Array.from(Re.children)) e !== He && n.observe(e);
		return () => {
			n.disconnect(), e !== null && window.cancelAnimationFrame(e);
		};
	}), te(() => {
		h(R, !1), h(L, new an((e) => {
			h(R, e === "stale");
		}), !0), Ue = Zn({
			isReactionMode: () => X.value !== null,
			onReactionImageUrls: (e) => {
				q() || Y.isSubmitPending || Y.isUploading || G?.addImageUrls(e);
			},
			getReactionInputMode: () => G?.getInputMode() ?? "singleValue",
			isInputBlocked: q,
			isCompositionInputAllowed: () => !!k(L)?.isCompositionInputAllowed(),
			compositionController: k(L) ?? void 0,
			placeholderText: k(Qe),
			editorContainerEl: He,
			currentEditor: k(I),
			hasStoredKey: u.hasStoredKey,
			hasPostingCapability: M(),
			submitPost: Sn,
			onCustomEmojiSelect: u.onCustomEmojiSelect,
			getCustomEmojiItems: void 0,
			getProfileMentionItems: u.getProfileMentionItems,
			profileMentionSource: u.profileMentionSource,
			enterKeyBehavior: void 0,
			hostOwnedLite: !1,
			submitShortcuts: void 0,
			uploadFiles: k(P) ? (e) => {
				q() || jt.performUpload(e);
			} : void 0,
			eventCallbacks: {
				onContentUpdate: (e, t) => {
					dt(e, t), u.onEditorContentUpdate?.();
				},
				onImageFullscreenRequest: (e, t, n) => {
					Q.showImageFullscreen(e, t, n || "");
				},
				onSelectImageNode: (e) => {}
			}
		}), h(de, Ue.editor, !0);
		let e = null, t = (e) => {
			let t = e.isEmpty, n = !Ie || k(Fe) !== t;
			h(Fe, t, !0), Ie = !0, n && u.onEditorEmptyChange?.(t);
		}, n = (e) => {
			et(e, W.hasNonPlaceholderItems());
		}, r = ({ editor: e }) => {
			t(e), n(e);
		};
		We = k(de).subscribe((i) => {
			i !== null && i === e ? h(I, i, !0) : (e && e.off("transaction", r), e = i, h(I, i, !0), i ? (k(L)?.attach(i), t(i), n(i)) : (k(L)?.detach(), gt(null, !1)), i?.on("transaction", r), J.set(i));
		});
		let i = (e) => {
			let { src: t, alt: n, mediaId: r } = e.detail;
			Q.showImageFullscreen(t, n, r || "");
		};
		return window.addEventListener("image-fullscreen-request", i), () => {
			G?.dispose(), k(L)?.destroy(), h(L, null), h(R, !1), gt(null, !1), J.value === k(I) && (Y.isSubmitPending = !1, Q.hideSecretKeyDialog()), window.removeEventListener("image-fullscreen-request", i), Ue && (e && e.off("transaction", r), Qn({
				unsubscribe: Ue.unsubscribe,
				componentUnsubscribe: We ?? (() => {}),
				handlers: Ue.handlers,
				currentEditor: k(I),
				editorContainerEl: He,
				submitPost: Sn
			}), We = null);
		};
	});
	let Ft = jt.handleFileSelect;
	async function It(e) {
		return q() ? null : await jt.performUpload(e);
	}
	function Ht() {
		k(I)?.commands.focus();
	}
	function $t() {
		k(I)?.commands.blur();
	}
	function tn(e) {
		if (!k(I) || !e || q()) return;
		let t = k(I), n = e.split("\n").map((e) => ({
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
	function rn(e) {
		if (!k(I) || !e || q()) return !1;
		let t = e.split("\n").map((e) => ({
			type: "paragraph",
			content: e ? [{
				type: "text",
				text: e
			}] : void 0
		}));
		return k(I).isEmpty ? k(I).commands.setContent({
			type: "doc",
			content: t
		}) : k(I).chain().focus("end").insertContent([{ type: "paragraph" }, ...t]).run(), k(I).commands.focus("end"), !0;
	}
	function on(e) {
		if (!k(I) || !e || q()) return;
		let t = Vt(e);
		k(I).commands.setContent(t || "<p></p>"), k(I).commands.focus("end");
	}
	function sn() {
		return k(I) ? k(I).getHTML() : "";
	}
	function cn(e) {
		if (!k(I) || e.length === 0 || q()) return;
		let { schema: t } = k(I).state, n = k(I).state.tr, r = k(I).state.doc.content.size;
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
				n = n.insert(r, a), r += a.nodeSize, e.ox && h(H, {
					...k(H),
					[i]: e.ox
				}, !0), e.x && h(U, {
					...k(U),
					[i]: e.x
				}, !0);
			} else if (e.type === "video" && t.nodes.video) {
				let e = t.nodes.video.create({ src: i });
				n = n.insert(r, e), r += e.nodeSize;
			}
		}), k(I).view.dispatch(n), k(I).commands.focus("end");
	}
	function ln(e) {
		if (!k(I) || q()) return !1;
		let t = k(I).state.doc;
		return $n(k(I), e), !t.eq(k(I).state.doc);
	}
	function un(e) {
		return !(!k(I) || X.value || q() || !$e(k(I), e));
	}
	function pn() {
		k(I) && (Tt(k(I).view.dom) || Ze(k(I)));
	}
	function hn(e) {
		if (!k(I) || q()) return;
		pn();
		let { state: t, view: n } = k(I), r = e < 0 ? t.selection.from : t.selection.to, i = Math.max(0, Math.min(t.doc.content.size, r + e));
		if (i === r) return;
		let a = Ye.near(t.doc.resolve(i), e);
		n.dispatch(t.tr.setSelection(a).scrollIntoView().setMeta("addToHistory", !1));
	}
	function Z() {
		hn(-1);
	}
	function _n() {
		hn(1);
	}
	function vn() {
		if (!k(I) || q()) return;
		pn();
		let { state: e, view: t } = k(I), { selection: n } = e;
		if (!n.empty) {
			k(I).commands.deleteSelection();
			return;
		}
		let r = n.$from.nodeBefore;
		if (r) {
			let i = r.isText ? Array.from(r.text ?? "").at(-1)?.length ?? 0 : r.nodeSize;
			i > 0 && t.dispatch(e.tr.delete(n.from - i, n.from).scrollIntoView());
		} else k(I).commands.first(({ commands: e }) => [() => e.joinBackward(), () => e.selectNodeBackward()]);
	}
	function yn() {
		k(I) && !q() && (pn(), k(I).commands.keyboardShortcut("Enter"));
	}
	function bn() {
		return xn() && (X.value && k(I) ? !!ke(k(I)).value && !ut(k(I)) && !k(I).view.composing : Xe(k(I), W.hasNonPlaceholderItems())) && !Y.isSubmitPending && !k(yt);
	}
	function xn() {
		return !!k(I) && !!k(V) && !ae() && !k(K).sending && !Y.isUploading && !k(K).completed && M();
	}
	async function Sn(e) {
		if (!k(I) || !bn() || !k(V)) return;
		let t = k(I), n = X.value;
		if (n) {
			let e = ke(t).value;
			if (!e) return;
			let r = u.rxNostr, i = B.value, a = () => !me && J.value === t && u.rxNostr === r && B.value === i && X.value === n, o = {
				editor: t,
				isCurrent: a
			};
			h(tt, o);
			let s = !1;
			Y.isSubmitPending = !0, Nt.markSending();
			try {
				let t = await Wt.react({
					target: n.event,
					relayHints: n.relayHints,
					value: e,
					publisher: k(V),
					isCurrent: a
				});
				if (!a()) return;
				s = !0, t.success ? (Bt("success"), Nt.markSuccess(t)) : Pt("reaction.failed");
			} finally {
				k(tt) === o && (s || a()) && (h(tt, null), !me && J.value === t && (Y.isSubmitPending = !1));
			}
		} else {
			Y.isSubmitPending = !0;
			try {
				if (t.isDestroyed || J.value !== t || !xn()) return;
				let e = k(V).preparePostPayload(t);
				if (nt(t.state.doc), Oe(e.content)) {
					Q.showSecretKeyDialog(e.content, e.emojiTags), Y.isSubmitPending = !1;
					return;
				}
				t.view.composing && k(L)?.startSession(lt.getState(t.state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await k(V).performPostSubmission(t, e, k(H), k(U), () => {
					me || (Nt.markSending(), Y.isSubmitPending = !1);
				}, (e) => {
					me || Nt.markSuccess(e);
				}, (e) => {
					me || Pt(e);
				});
			} finally {
				!me && J.value === t && (Y.isSubmitPending = !1);
			}
		}
	}
	function Cn() {
		Bt("reset"), k(I) && (k(V) ? k(V).resetPostContent(k(I)) : k(I).chain().clearContent().run());
	}
	function wn() {
		if (Bt("success"), k(V) && k(I)) k(V).clearContentAfterSuccess(k(I));
		else if (k(I)) {
			let e = u.hostOwnedConfig?.hashtagPinEnabled === !0 && Te.value ? [...Ee().hashtags] : [];
			k(I).chain().clearContent().run(), we.reset(), be.reset(), W.clearAll(), h(H, {}, !0), h(U, {}, !0), Qt(), e.length > 0 && k(I).commands.insertContent(` ${e.map((e) => `#${e}`).join(" ")}`), k(I).commands.focus("start");
		}
	}
	async function En() {
		if (!k(yt) || !xn()) return;
		let e = Q.getPendingPost(), t = Q.getPendingEmojiTags();
		e.trim() && k(V) && k(I) && (k(I).view.composing && k(L)?.startSession(lt.getState(k(I).state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await Hn({
			postManager: k(V),
			currentEditor: k(I),
			imageOxMap: k(H),
			imageXMap: k(U),
			pendingPost: e,
			pendingEmojiTags: t,
			onStart: () => {
				Nt.markSending(), Q.hideSecretKeyDialog();
			},
			onSuccess: Nt.markSuccess,
			onFailure: Pt
		}));
	}
	let Dn = Q.hideSecretKeyDialog, On = Q.hideImageFullscreen, kn = f(() => Wn({
		mediaFreePlacement: k(ge),
		includeTemporaryGallery: k(ge) && !!X.value,
		galleryItems: W.items,
		currentEditor: k(I)
	})), An = f(() => Gn(k(kn), k(xt), k(Ct)));
	function Fn(e) {
		let t = Kn(k(kn), e);
		t && Q.showImageFullscreen(t.src, t.alt ?? "", t.id ?? "");
	}
	w(() => {
		k(K).error && k(I) && k(V) && k(V).preparePostContent(k(I)) !== Y.content && st({
			...k(K),
			error: !1,
			message: ""
		});
	});
	function In() {
		!k(P) || q() || Y.isSubmitPending || Y.isUploading || k(pe)?.click();
	}
	w(() => {
		let e = W.items.some((e) => !e.isPlaceholder);
		et(k(I), e);
	});
	let Ln = !0, Rn = !xe.value;
	w(() => {
		let e = !xe.value;
		if (X.value) return;
		if (Ln) {
			Ln = !1, Rn = e;
			return;
		}
		if (!k(I) || Rn === e) return;
		Rn = e;
		let t = k(I);
		if (e) g(() => Jn({
			currentEditor: t,
			imageOxMap: k(H),
			imageXMap: k(U),
			addGalleryItem: (e) => W.addItem(e),
			createMediaItemId: he
		})) && g(() => {
			h(H, {}, !0), h(U, {}, !0);
		});
		else {
			let e = Yn({
				currentEditor: t,
				items: g(() => W.getItems())
			});
			e.hadItems && g(() => {
				h(H, e.imageOxMap, !0), h(U, e.imageXMap, !0);
			}), g(() => W.clearAll());
		}
	});
	var zn = {
		uploadFiles: It,
		focusEditor: Ht,
		blurEditor: $t,
		insertTextContent: tn,
		appendSharedTextContent: rn,
		loadDraftContent: on,
		getEditorHtml: sn,
		appendMediaToEditor: cn,
		insertCustomEmoji: ln,
		insertProfileMention: un,
		moveCaretLeft: Z,
		moveCaretRight: _n,
		deleteBackward: vn,
		insertLineBreak: yn,
		submitPost: Sn,
		resetPostContent: Cn,
		clearContentAfterSuccess: wn,
		openFileDialog: In
	}, Bn = dr(), Un = x(Bn);
	let qn;
	var $ = y(Un);
	let er;
	var tr = y($), rr = (e) => {
		var t = ar(), n = y(t);
		{
			let e = f(() => k(Me)?.displayName), t = f(() => k(Me)?.name), r = f(() => k(Me)?.picture || "");
			Ve(n, {
				get pubkeyHex() {
					return B.value.pubkey;
				},
				get displayName() {
					return k(e);
				},
				get name() {
					return k(t);
				},
				showLoadingIndicator: !0,
				get pending() {
					return N();
				},
				get src() {
					return k(r);
				},
				alt: "",
				fallbackAriaLabel: "",
				rootClassName: "editor-account-placeholder-avatar",
				imageClassName: "editor-account-placeholder-image",
				fallbackClassName: "editor-account-placeholder-fallback"
			});
		}
		l(t), s(e, t);
	};
	n(tr, (e) => {
		k(Le) && e(rr);
	});
	var pr = T(tr, 2), mr = (e) => {
		rt(e, {
			get editor() {
				return k(I);
			},
			class: "editor-content"
		});
	};
	n(pr, (e) => {
		k(de) && k(I) && e(mr);
	});
	var hr = T(pr, 2), gr = (t) => {
		var n = sr(), r = y(n);
		{
			let e = f(() => !k(F) || k(K).sending || k(le) || !M() || k(K).completed), t = f(() => m()("postComponent.post"));
			Be(r, {
				variant: "primary",
				shape: "circle",
				contentLayout: "icon",
				className: "editor-submit-button",
				get disabled() {
					return k(e);
				},
				onClick: () => {
					!k(F) || k(K).sending || k(le) || !M() || k(K).completed || Sn();
				},
				onfocus: _t,
				get ariaLabel() {
					return k(t);
				},
				children: (e, t) => {
					var n = or();
					s(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		l(n), e("pointerdown", n, ht, !0), s(t, n);
	};
	n(hr, (e) => {
		k(ue) && e(gr);
	}), l($), t($, (e, t) => jn?.(e, t), () => ({ dragOver: (e) => h(z, e, !0) })), t($, (e) => Mn?.(e)), t($, (e) => Nn?.(e)), t($, (e, t) => Pn?.(e, t), () => !0), b($, (e) => He = e, () => He);
	var _r = T($, 2), vr = (e) => {
		Tn(e, {});
	};
	n(_r, (e) => {
		k(ve) && e(vr);
	});
	var yr = T(_r, 2), br = (e) => {
		var t = cr();
		b(t, (e) => h(pe, e), () => k(pe)), v(() => {
			_(t, "accept", X.value ? "image/png,image/jpeg,image/webp,image/gif,image/avif,.avif" : "image/*,video/*,.avif"), t.multiple = !X.value;
		}), d("change", t, Ft), s(e, t);
	};
	n(yr, (e) => {
		k(P) && e(br);
	});
	var xr = T(yr, 2), Sr = (e) => {
		var t = lr(), n = E(t, !0);
		v(() => c(n, k(je))), s(e, t);
	};
	n(xr, (e) => {
		k(je) && e(Sr);
	}), l(Un), b(Un, (e) => Re = e, () => Re);
	var Cr = T(Un, 2), wr = (e) => {
		{
			let t = f(() => m()("postComponent.warning")), n = f(() => m()("postComponent.secret_key_detected")), r = f(() => m()("postComponent.post")), i = f(() => m()("postComponent.cancel"));
			nn(e, {
				get open() {
					return k(yt);
				},
				get title() {
					return k(t);
				},
				get description() {
					return k(n);
				},
				get confirmLabel() {
					return k(r);
				},
				get cancelLabel() {
					return k(i);
				},
				confirmVariant: "danger",
				onConfirm: En,
				get onCancel() {
					return Dn;
				},
				contentClass: "secretkey-warning-dialog"
			});
		}
	};
	n(Cr, (e) => {
		e(wr);
	});
	var Tr = T(Cr, 2);
	Ut(Tr, {
		get src() {
			return k(Ct);
		},
		get alt() {
			return k(wt);
		},
		get onClose() {
			return On;
		},
		get mediaList() {
			return k(kn);
		},
		get currentIndex() {
			return k(An);
		},
		onNavigate: Fn,
		get show() {
			return k(bt);
		},
		set show(e) {
			h(bt, e);
		}
	});
	var Er = T(Tr, 2), Dr = (e) => {
		ze(e, {
			get show() {
				return k(Et);
			},
			get x() {
				return k(Ot);
			},
			get y() {
				return k(kt);
			},
			children: (e, t) => {
				var n = ur(), r = E(n, !0);
				v(() => c(r, k(At))), s(e, n);
			},
			$$slots: { default: !0 }
		});
	};
	n(Er, (e) => {
		k(Et) && e(Dr);
	}), v((e) => {
		qn = a(Un, 1, "post-container svelte-15ticnd", null, qn, { "editor-auto-grow": k(Ke) }), p(Un, k(qe)), er = a($, 1, "editor-container svelte-15ticnd", null, er, {
			"drag-over": k(z),
			"gallery-mode": k(ve),
			sending: k(K).sending || k(R),
			"editor-submit-enabled": k(ue),
			"account-avatar-placeholder": k(Le)
		}), _($, "aria-label", e), _($, "aria-readonly", k(K).sending || k(R) ? "true" : void 0), _($, "aria-disabled", void 0);
	}, [() => m()("postComponent.editor_label")]), d("click", $, at), e("keydown", $, pt, !0), d("keydown", $, ct), e("beforeinput", $, mt, !0), e("paste", $, mt, !0), e("cut", $, mt, !0), e("drop", $, mt, !0), s(r, Bn);
	var Or = o(zn);
	return D(), Or;
}
m([
	"click",
	"keydown",
	"change"
]);
export { pr as default };
