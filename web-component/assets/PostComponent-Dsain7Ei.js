import { $ as e, B as t, C as n, F as r, G as i, O as a, R as o, Tt as s, U as c, W as l, X as u, Y as d, Z as f, _t as p, bt as m, dt as h, f as g, ft as _, ht as v, jt as y, k as b, lt as x, n as S, nt as C, o as ee, ot as w, pt as T, r as E, rt as D, s as te, st as O, t as k, tt as A, ut as ne, v as j, w as re, wt as ie } from "./index-client-57Odq85c.js";
import { i as M, n as ae } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { n as N } from "./relayConfigUtils-DD5f1UAM.js";
import { pt as oe, t as se } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { c as ce } from "./legacyImportMarkers-CZ4J2IrE.js";
import { A as P, B as le, G as F, Q as I, V as ue, c as L, pt as R, q as z, s as B, t as de } from "./nip65RelayDirectory-TQ_KxYYY.js";
import { a as fe, i as V, n as H, t as U, u as pe, v as W } from "./signedEventResultValidator-DEUEqBPK.js";
import { r as me } from "./authStore.svelte-BlvJ-J7q.js";
import { f as he, m as ge } from "./relayStore.svelte-B2f9GSlJ.js";
import { Q as _e, c as ve, i as ye, l as be } from "./appUtils-CwuZyofa.js";
import { n as xe } from "./settingsStore.svelte-B2FAMvyx.js";
import { C as G, S as Se, _ as Ce, a as we, b as Te, p as Ee, v as De, x as Oe, y as ke } from "./uploadStore.svelte-Cb-DvowP.js";
import { c as Ae, i as je, n as Me } from "./nip46Service-DWYw1Qh-.js";
import { r as K } from "./query-BRdCuyDl.js";
import { c as Ne, i as Pe, n as Fe, o as Ie, r as Le, t as Re } from "./postEventBuilder-BOs8Hhj8.js";
import { c as ze } from "./clipboardUtils-LENkGqCk.js";
import { A as Be, C as Ve, D as He, E as Ue, F as We, M as Ge, N as Ke, O as qe, P as Je, S as Ye, T as Xe, a as Ze, b as Qe, d as $e, f as et, i as tt, j as nt, l as rt, n as q, o as it, r as J, s as Y, t as at, u as ot, w as st, x as ct } from "./editorStore.svelte-BWDbxWYk.js";
import { _ as lt, c as ut, g as dt, p as ft, t as pt } from "./mediaNodeUtils-BqPa-8_Y.js";
import { t as mt } from "./keyboardFocusUtils-Cil9djR5.js";
import { n as ht, r as gt } from "./reactionValue-D-cbOxKy.js";
import { a as _t, d as vt, f as yt, l as bt, n as xt, o as St, r as Ct, s as wt, t as Tt, u as Et } from "./uploadHelper-Db4BXigq.js";
import { t as Dt } from "./postMediaCacheRepository-D9yC8e4L.js";
import { n as Ot, t as kt } from "./fileUtils-DFi7i2Ee.js";
import { $ as At, A as jt, I as Mt, K as Nt, L as Pt, N as Ft, R as X, S as It, Y as Lt, Z as Rt, _t as zt, et as Bt, j as Vt, k as Ht, nt as Ut, o as Wt, ot as Gt, s as Kt, tt as qt, ut as Jt } from "./App-BWEIk7fu.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/submittedComposition.ts
var Yt = class {
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
}, Xt = 3e3, Zt = 3e4;
function Qt() {
	return {
		authorWrite: !1,
		additional: !1,
		recipients: /* @__PURE__ */ new Set()
	};
}
function $t(e, t, n = !1, r = !1) {
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
var en = class {
	deps;
	rxNostr = null;
	eventSender = null;
	activeNip65Operations = /* @__PURE__ */ new Set();
	operationGeneration = 0;
	constructor(e, t = {}) {
		this.deps = t, e && this.setRxNostr(e), this.deps.console = t.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = t.authStateStore || me, this.deps.hashtagStore = t.hashtagStore || Te, this.deps.mediaFreePlacementStore = t.mediaFreePlacementStore || we, this.deps.mediaGalleryStore = t.mediaGalleryStore || G, this.deps.contentWarningStore = t.contentWarningStore || De, this.deps.contentWarningReasonStore = t.contentWarningReasonStore || Ce, this.deps.keyManager = t.keyManager || Ae, this.deps.createImetaTagFn = t.createImetaTagFn || wt, this.deps.settingsStore = t.settingsStore || xe, this.deps.writeRelaysStore = t.writeRelaysStore || he, this.deps.replyQuoteState = t.replyQuoteState || Vt, this.deps.getClientTagFn = t.getClientTagFn || (() => je(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = t.seckeySignerFn || W, this.deps.extractContentWithImagesFn = t.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = t.extractContentWithEmojiTagsFn || (t.extractContentWithImagesFn ? (e) => ({
			content: t.extractContentWithImagesFn(e),
			emojiTags: []
		}) : Ge), this.deps.extractImageBlurhashMapFn = t.extractImageBlurhashMapFn || bt, this.deps.resetEditorStateFn = t.resetEditorStateFn || Ze, this.deps.resetPostStatusFn = t.resetPostStatusFn || it, this.deps.notificationPort = t.iframeMessageService || t.notificationPort || Gt, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = t.hashtagPinStore || Oe, this.deps.saveHashtagsToHistoryFn = t.saveHashtagsToHistoryFn || st, this.deps.clearReplyQuoteFn = t.clearReplyQuoteFn || jt, this.deps.saveSensitivePayloadFn = t.saveSensitivePayloadFn || ((e) => B.putCandidate(e));
	}
	setRxNostr(e) {
		this.eventSender && this.cancelActiveNip65Operations(!0), this.rxNostr = e, this.eventSender = new Fe(e, this.deps.console || console);
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
		let e = this.deps.replyQuoteState.value;
		return JSON.stringify({
			reply: e.reply?.eventId ?? null,
			quotes: e.quotes.map((e) => e.eventId)
		});
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
			...await Re.buildEvent(e.processedContent, e.hashtags, e.tags, e.pubkey, e.imageImetaMap, this.deps.createImetaTagFn, this.deps.getClientTagFn, e.contentWarningEnabled, e.contentWarningReason, e.replyQuoteTags, e.channelContext, e.emojiTags, e.failClosedContentWarning, e.publicationKind),
			pubkey: e.pubkey
		};
	}
	async buildNip22ReplyTags(e, t) {
		return F(e, t);
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
			let r = await R(ce, e.event.pubkey);
			await this.deps.savePostHistoryFn({
				event: e.event,
				attestation: e.attestation,
				acceptedRelays: t,
				relayHints: n
			}), zt(e.event.id, e.event.pubkey, e.result, r).catch(() => void 0);
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
		let t = I(e.event);
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
			let s = this.deps.authStateStore, c = s.value, l = this.operationGeneration, u = Date.now(), d = u + Xt, f = u + Zt, p = e.authorWriteRelaySnapshot;
			if (ge() && p.length === 0) return {
				success: !1,
				fullyDelivered: !1,
				error: "no_write_relays",
				acceptedRelays: [],
				delivery: {
					authorWrite: $t([], /* @__PURE__ */ new Map(), !0),
					taggedUserRead: {},
					additional: []
				}
			};
			let m = N.sanitizeExternalRelayUrls([...e.additionalWriteRelays ?? []]), h = Array.from(new Set((e.sensitive?.structureTemplate.tags ?? e.event.tags ?? []).flatMap((e) => {
				if (!Array.isArray(e) || e[0] !== "p") return [];
				let t = e[1];
				return typeof t == "string" && /^[0-9a-f]{64}$/i.test(t) ? [t] : [];
			}))), g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set(), S = /* @__PURE__ */ new Set(), C = Promise.resolve(), ee;
			e.event?.pubkey && R(ce, e.event.pubkey).then((e) => {
				ee = e;
			});
			let w, T, E, D = !1, te = /* @__PURE__ */ new Set(), O = [], k = !0, A = !0, ne = !1, j, re = !1, ie = Ne(a, [...p, ...m], h.length > 0), M = () => ie.update([
				...p,
				...m,
				...te
			], [...y].filter(([, e]) => e.accepted).map(([e]) => e), k && h.length > 0, p.length === 0 || !k && h.some((e) => v.get(e) !== "found")), ae = new AbortController(), oe, se = new Promise((e) => {
				oe = e;
			}), P, le = new Promise((e) => {
				P = e;
			}), F = () => {
				A = !1, k = !1, ae.abort();
				for (let e of te) {
					let t = y.get(e);
					!t?.accepted && !t?.rejected && y.set(e, {
						...t,
						unconfirmed: !0,
						...ne ? {} : { timedOut: !0 }
					});
				}
				re = !0, M(), ie.finish(ne), P();
			}, I = new K(12e3, (e) => {
				e === "cancelled" && (ne = !0), F();
			});
			Ie(a, I);
			let ue = {
				acknowledged: () => t,
				cancel: () => {
					A && (A = !1, ne = !0, k = !1, oe(), I.finish("cancelled"));
				}
			};
			this.activeNip65Operations.add(ue);
			let L = () => {
				if (!A || re || D || Date.now() >= f) return !1;
				let n = s.value;
				return l !== this.operationGeneration || this.rxNostr !== a || this.eventSender !== i || n !== c || !n.isAuthenticated || n.pubkey !== e.sessionPubkey || !t && e.isCurrent?.() === !1 ? (ue.cancel(), !1) : !0;
			}, z = (e) => {
				let t = g.get(e);
				return t || (t = Qt(), g.set(e, t)), t;
			};
			p.forEach((e) => {
				z(e).authorWrite = !0;
			}), m.forEach((e) => {
				z(e).additional = !0;
			});
			let B = (i, a, s = !0, c = y) => {
				if (re) return;
				s && i.error && (j = i.error);
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
					x.has(e) || y.set(e, t?.accepted ? { unconfirmed: !0 } : { ...t }), t?.accepted && fe(e);
				}
				c === y && !t && [...y.values()].some((e) => e.accepted) && (t = !0, n = {
					success: !0,
					eventId: E?.id ?? e.event.id,
					acceptedRelays: [...y].filter(([, e]) => e.accepted).map(([e]) => e),
					deliveryPending: !0,
					deliverySettled: o
				}, r(n)), M();
			}, fe = (t) => {
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
								isActive: () => L()
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
					if (!L()) return null;
					try {
						let e = await n.signStructure(T);
						return L() ? (E = e, e) : null;
					} catch {
						return D = !0, j = "post_error", null;
					}
				});
				let o = (async () => {
					if (await a, !L()) return;
					let e = await w;
					if (!e || !L() || x.has(t)) return;
					x.add(t), y.set(t, { unconfirmed: !0 });
					let n = await i.sendEvent(e, {
						targetRelays: [t],
						includeDefaultWriteRelays: !1,
						waitForAllRelays: !0,
						authDeadlineAt: f,
						settleSignal: ae.signal,
						operation: I,
						onProgress: (e) => B(e, [t], !1)
					});
					B(n, [t]);
				})().catch(() => {
					j = "post_network_error";
				});
				O.push(o);
			}, V = (t) => {
				for (let n of N.sanitizeExternalRelayUrls(t)) {
					if (!L() || te.has(n)) continue;
					te.add(n), M();
					let t = i.sendEvent(e.event, {
						targetRelays: [n],
						includeDefaultWriteRelays: !1,
						waitForAllRelays: !0,
						authDeadlineAt: f,
						settleSignal: ae.signal,
						operation: I,
						onProgress: (e) => B(e, [n], !1, b)
					}).then((e) => B(e, [n], !0, b)).catch(() => B({
						success: !1,
						error: "post_network_error"
					}, [n], !0, b));
					O.push(t);
				}
			}, H = (t) => {
				if (!L() || !k) return;
				if (e.sensitive) {
					V(t);
					return;
				}
				let n = N.sanitizeExternalRelayUrls(t).filter((e) => !te.has(e));
				if (n.length === 0) return;
				n.forEach((e) => te.add(e)), M();
				let r = i.sendEvent(e.event, {
					targetRelays: n,
					includeDefaultWriteRelays: !1,
					waitForAllRelays: !0,
					authDeadlineAt: f,
					settleSignal: ae.signal,
					operation: I,
					onProgress: (e) => B(e, n, !1)
				}).then((e) => B(e, n)).catch(() => {
					j = "post_network_error";
					for (let e of n) y.has(e) || y.set(e, { unconfirmed: !0 });
				});
				O.push(r);
			};
			try {
				let t = N.sanitizeExternalRelayUrls([...p, ...m]);
				if (e.sensitive) t.length === 0 && (j = "no_write_relays"), V(t);
				else {
					t.forEach((e) => te.add(e));
					let n = i.sendEvent(e.event, {
						targetRelays: t,
						includeDefaultWriteRelays: !1,
						waitForAllRelays: !0,
						authDeadlineAt: f,
						settleSignal: ae.signal,
						operation: I,
						onProgress: (e) => B(e, t, !1)
					}).then((e) => B(e, t)).catch(() => {
						j = "post_network_error";
						for (let e of t) y.has(e) || y.set(e, { unconfirmed: !0 });
					});
					O.push(n);
				}
				let n = h.map(async (t) => {
					try {
						let n = this.deps.nip65ReadRelayLookupFn ? await this.deps.nip65ReadRelayLookupFn(t, {
							discoveryRelays: e.discoveryRelaysByRecipient?.[t],
							deadlineAt: d,
							operation: I,
							resolveOnReadRoute: !0
						}) : await de(a).lookup(t, {
							discoveryRelays: e.discoveryRelaysByRecipient?.[t],
							deadlineAt: d,
							operation: I,
							resolveOnReadRoute: !0
						});
						if (!k || !L()) return;
						let r = N.sanitizeExternalRelayUrls(n.readRelays);
						_.set(t, new Set(r)), v.set(t, r.length > 0 ? "found" : "unavailable"), r.forEach((e) => z(e).recipients.add(t)), H(r);
					} catch {
						k && L() && (_.set(t, /* @__PURE__ */ new Set()), v.set(t, "unavailable"));
					}
				}), r = {};
				n.length > 0 && await Promise.race([
					Promise.all(n),
					se,
					le,
					new Promise((e) => {
						I.schedule(r, d, e);
					})
				]), I.unschedule(r), k = !1;
				for (let e of h) v.has(e) || (_.set(e, /* @__PURE__ */ new Set()), v.set(e, ne ? "cancelled" : "unavailable"));
				M(), await Promise.race([(async () => {
					let e = 0;
					for (; e < O.length;) {
						let t = O.slice(e);
						e = O.length, await Promise.all(t);
					}
				})(), le]), F(), await C;
				let o = (t, n = !1, r = !1) => $t(t, y, n, r || e.sensitive !== void 0 && ne), s = o(p, p.length === 0), c = Object.fromEntries(h.map((e) => {
					let t = [..._.get(e) ?? []], n = v.get(e);
					return [e, o(t, n === "unavailable", n === "cancelled")];
				})), l = m.length > 0 ? [o(m)] : [], u = {
					authorWrite: s,
					taggedUserRead: c,
					additional: l
				}, g = N.sanitizeExternalRelayUrls([...y.entries()].filter(([, e]) => e.accepted).map(([e]) => e)), x = [...y.values()].flatMap((e) => e.rejected ? [e.rejected] : []), S = [...y.entries()].filter(([, e]) => e.timedOut).map(([e]) => e), ee = [...y.entries()].filter(([, e]) => e.authRequired).map(([e]) => e), w = g.length > 0, T = s.acceptedRelays.length > 0 && Object.values(c).every((e) => e.acceptedRelays.length > 0) && l.every((e) => e.acceptedRelays.length > 0), D = S.length > 0 || [...y.values()].some((e) => e.unconfirmed), A = w ? void 0 : e.sensitive && [...b.values()].some((e) => e.accepted) ? "postComponent.error.sensitive_partial_publish" : j ?? (D ? "post_timeout" : "post_rejected");
				return {
					success: w,
					fullyDelivered: T,
					...A ? { error: A } : {},
					...w ? { eventId: E?.id ?? e.event.id } : {},
					acceptedRelays: g,
					...x.length ? { rejectedRelays: x } : {},
					...S.length ? { timedOutRelays: S } : {},
					...ee.length ? { authRequiredRelays: ee } : {},
					delivery: u
				};
			} finally {
				re = !0, I.finish("complete"), ue.cancel(), this.activeNip65Operations.delete(ue);
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
			if (V(this.deps.authStateStore, e.sessionPubkey), !o()) throw Error("post_event_runtime_changed");
			if (e.signer && !a) throw Error("nostr_sign_event_not_supported");
			let n = U(t), r = a ? await a(n.signerTemplate) : t;
			if (!o()) throw Error("post_event_session_changed");
			let i = H(n.expectedTemplate, r, e.sessionPubkey), s = I(i);
			if (!s) throw Error("post_error");
			return s;
		}, c = e.splitSensitiveContent && e.event.tags.some((e) => e[0] === "content-warning"), l = null, u;
		try {
			u = await s(c ? le(e.event.kind, e.event.content, e.sessionPubkey, e.event.created_at) : e.event);
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
					let n = await s(ue(e.event, u.event.id, t));
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
		return Le.validatePost(e, t.value.isAuthenticated, !!this.rxNostr);
	}
	async submitPost(e, t, n = []) {
		let r = Pe(e), i = this.deps.settingsStore.quoteNotificationEnabled, a = this.deps.replyQuoteService?.extractInlineQuoteTags?.(r, i) ?? new It().extractInlineQuoteTags(r, i), o = this.deps.replyQuoteState.value;
		if (o.quotes.length > 0) {
			let e = this.deps.replyQuoteService || new It(), t = new Set(a.filter((e) => e[0] === "q").map((e) => e[1])), n = o.quotes.filter((e) => !t.has(e.eventId)).map((t) => e.generateNostrUri(t.eventId, t.relayHints, t.authorPubkey));
			n.length > 0 && (r = `${r.trimEnd()}\n${n.join("\n")}`.trim());
		}
		let s = this.validatePost(r);
		if (!s.valid) return this.notifyPostFailure(s.error);
		if (!this.eventSender) return this.notifyPostFailure("nostr_not_ready");
		try {
			let e = this.deps.authStateStore, i = fe(e), o = this.deps.hashtagStore, { hashtags: s, tags: c } = this.getHashtagArrays(o), l = this.deps.keyManager, u = this.deps.window || (typeof window < "u" ? window : void 0), d = this.deps.contentWarningStore.value, f = this.deps.contentWarningReasonStore.value, p = this.deps.settingsStore.failClosedContentWarning === !0, m = this.deps.channelContextState?.value ?? null, h = Object.freeze(N.sanitizeExternalRelayUrls(m?.channelRelays)), g = this.captureAuthorWriteRelays();
			if (ge() && g.length === 0) return this.notifyPostFailure("no_write_relays");
			let _ = N.sanitizeExternalRelayUrls(this.deps.writeRelaysStore?.value ?? []), v = this.deps.replyQuoteState.value, y, b = this.getReplyQuoteNotifyOptions(), x = v.reply?.referencedEvent ?? null;
			if (v.reply && !m && (!x || x.id !== v.reply.eventId || ![
				1,
				7,
				1111
			].includes(x.kind) || v.reply.authorPubkey && x.pubkey !== v.reply.authorPubkey)) return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
			let S = z({
				channel: !!m,
				hasReply: !!v.reply,
				...x ? { replyKind: x.kind } : {}
			});
			if (S === null) return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
			if (v.reply || v.quotes.length > 0) {
				let e = this.deps.replyQuoteService || new It();
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
			}, w = this.deps.replyQuoteService || new It();
			v.reply && ee(v.reply.authorPubkey, v.reply.relayHints, w.buildReplyTags(v.reply));
			for (let e of v.quotes) e.quoteNotificationEnabled && ee(e.authorPubkey, e.relayHints, w.buildQuoteTags(e, !0));
			if (a.length > 0) {
				y ||= [];
				let e = new Set(y.filter((e) => e[0] === "q").map((e) => e[1])), t = new Set(y.filter((e) => e[0] === "p").map((e) => e[1]));
				for (let n of a) n[0] === "q" && !e.has(n[1]) ? (y.push(n), e.add(n[1])) : n[0] === "p" && !t.has(n[1]) && (y.push(n), t.add(n[1]));
			}
			let T = e.value;
			if (T.type === "nip07" && l.isWindowNostrAvailable() && u?.nostr) try {
				let e = T.pubkey;
				if (!e) return this.notifyPostFailure("pubkey_not_found");
				let a = typeof u.nostr.signEvent == "function" ? u.nostr.signEvent.bind(u.nostr) : void 0;
				if (!a) return this.notifyPostFailure("nostr_sign_event_not_supported");
				let o = await this.buildSubmissionEvent({
					processedContent: r,
					hashtags: s,
					tags: c,
					pubkey: e,
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
					event: o,
					sessionPubkey: i,
					hashtags: s,
					rqNotifyOptions: b,
					signEvent: a,
					logSignedEvent: !0,
					additionalWriteRelays: h,
					discoveryRelaysByRecipient: C,
					splitSensitiveContent: p,
					authorWriteRelaySnapshot: g,
					writeRelayHintSnapshot: _,
					replyQuoteIdentity: JSON.stringify({
						reply: v.reply?.eventId ?? null,
						quotes: v.quotes.map((e) => e.eventId)
					})
				});
			} catch {
				return this.handleSubmissionError("window.nostrでの投稿エラー:");
			}
			if (T.type === "nip46") try {
				let e = T.pubkey;
				if (!e) return this.notifyPostFailure("pubkey_not_found");
				let a = await this.deps.getNip46SignerForSessionFn?.(e), o = this.deps.authStateStore.value;
				if (!a || !o.isAuthenticated || o.type !== "nip46" || o.pubkey !== e) return this.notifyPostFailure("nip46_signer_not_available");
				let l = await this.buildSubmissionEvent({
					processedContent: r,
					hashtags: s,
					tags: c,
					pubkey: e,
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
					event: l,
					sessionPubkey: i,
					hashtags: s,
					rqNotifyOptions: b,
					signer: a,
					additionalWriteRelays: h,
					discoveryRelaysByRecipient: C,
					splitSensitiveContent: p,
					authorWriteRelaySnapshot: g,
					writeRelayHintSnapshot: _,
					replyQuoteIdentity: JSON.stringify({
						reply: v.reply?.eventId ?? null,
						quotes: v.quotes.map((e) => e.eventId)
					})
				});
			} catch {
				return this.handleSubmissionError("NIP-46での投稿エラー:");
			}
			if (T.type === "parentClient") {
				let e = this.deps.getParentClientSignerFn?.();
				if (!e) return this.notifyPostFailure("parent_client_signer_not_available");
				let a = T.pubkey;
				if (!a) return this.notifyPostFailure("pubkey_not_found");
				try {
					let o = await this.buildSubmissionEvent({
						processedContent: r,
						hashtags: s,
						tags: c,
						pubkey: a,
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
						event: o,
						sessionPubkey: i,
						hashtags: s,
						rqNotifyOptions: b,
						signer: e,
						additionalWriteRelays: h,
						discoveryRelaysByRecipient: C,
						splitSensitiveContent: p,
						authorWriteRelaySnapshot: g,
						writeRelayHintSnapshot: _,
						replyQuoteIdentity: JSON.stringify({
							reply: v.reply?.eventId ?? null,
							quotes: v.quotes.map((e) => e.eventId)
						})
					});
				} catch {
					return this.handleSubmissionError("親クライアント連携での投稿エラー:");
				}
			}
			let E = l.getFromStore() || l.loadFromStorage(T.pubkey);
			if (!E) return this.notifyPostFailure("key_not_found");
			let D = await this.buildSubmissionEvent({
				processedContent: r,
				hashtags: s,
				tags: c,
				pubkey: i,
				imageImetaMap: t,
				contentWarningEnabled: d,
				contentWarningReason: f,
				failClosedContentWarning: p,
				publicationKind: S,
				replyQuoteTags: y,
				channelContext: m,
				emojiTags: n
			}), te = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(E) : W(E);
			return await this.sendPreparedEvent({
				event: D,
				sessionPubkey: i,
				hashtags: s,
				rqNotifyOptions: b,
				signer: te,
				additionalWriteRelays: h,
				discoveryRelaysByRecipient: C,
				splitSensitiveContent: p,
				authorWriteRelaySnapshot: g,
				writeRelayHintSnapshot: _,
				replyQuoteIdentity: JSON.stringify({
					reply: v.reply?.eventId ?? null,
					quotes: v.quotes.map((e) => e.eventId)
				})
			});
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
		if (t === Te) try {
			let e = ke();
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
			m: vt(e),
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
function tn(e) {
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
			Mt("ownership"), a("ownership");
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
	}, s = Pt((e, t) => o(e, t));
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
			return ht(this.getContext());
		},
		addImageUrls(r) {
			o();
			let a = t, s = r.map((e) => ze(e) ? e : null);
			if (!a || n || !i(a) || !s.length || s.some((e) => e === null)) return !1;
			for (let t of s) {
				let n = ye();
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
			t && X.value?.sessionToken === t.token && Mt("ownership"), a("ownership"), s();
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postUploadUtils.ts
function nn(e) {
	return !!e && e.length > 0;
}
function rn(e, t, n) {
	e.isUploading = t, n !== void 0 && (e.uploadErrorMessage = n);
}
function an(e) {
	let t = e.target;
	return t?.files?.length ? t.files : void 0;
}
function on({ getCurrentEditor: e, getFileInput: t, getImageOxMap: n, getImageXMap: r, getUploadFailedText: i, updateUploadState: a, setUploadErrorMessage: o, uploadFiles: s }) {
	let c = async (c) => nn(c) ? await s({
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
			let t = an(e);
			t && c(t);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/postUIStore.svelte.ts
var Z = T({
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
}), sn;
function cn() {
	sn !== void 0 && (clearTimeout(sn), sn = void 0);
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
		cn(), Z.floatingMessageX = e, Z.floatingMessageY = t, Z.floatingMessageText = n, Z.showFloatingMessage = !0, sn = setTimeout(() => {
			Z.showFloatingMessage = !1, sn = void 0;
		}, r);
	},
	hideFloatingMessage: () => {
		cn(), Z.showFloatingMessage = !1;
	}
}, ln = i("<img draggable=\"false\"/>"), un = i("<div class=\"video-wrapper svelte-aw59wn\"><video controls=\"\" playsinline=\"\" autoplay=\"\" loop=\"\" preload=\"metadata\" class=\"gallery-video svelte-aw59wn\" draggable=\"false\"><track kind=\"captions\"/></video>  <div class=\"video-drag-overlay svelte-aw59wn\" aria-hidden=\"true\"></div></div>", 2), dn = i("<div role=\"listitem\"><div class=\"gallery-item-media svelte-aw59wn\"><!> <!> <!></div> <!></div>"), fn = {
	hash: "svelte-aw59wn",
	code: ".gallery-item.svelte-aw59wn,\n    .gallery-item-media.svelte-aw59wn,\n    .video-wrapper.svelte-aw59wn {position:relative;}.gallery-item.svelte-aw59wn,\n    .gallery-item-media.svelte-aw59wn,\n    .gallery-image.svelte-aw59wn,\n    .gallery-video.svelte-aw59wn {-webkit-touch-callout:none;}.gallery-item.svelte-aw59wn,\n    .gallery-image.svelte-aw59wn,\n    .gallery-video.svelte-aw59wn {-webkit-user-select:none;user-select:none;}.gallery-item.svelte-aw59wn,\n    .video-drag-overlay.svelte-aw59wn {cursor:grab;}.gallery-item.svelte-aw59wn:active,\n    .video-drag-overlay.svelte-aw59wn:active {cursor:grabbing;}.gallery-item.is-disabled.svelte-aw59wn,\n    .gallery-item.is-disabled.svelte-aw59wn .gallery-item-media:where(.svelte-aw59wn),\n    .gallery-item.is-disabled.svelte-aw59wn .video-drag-overlay:where(.svelte-aw59wn) {cursor:not-allowed;}.gallery-item.is-disabled.svelte-aw59wn {opacity:0.72;}.gallery-item.svelte-aw59wn {display:inline-flex;flex-shrink:0;overflow:visible;transition:transform 0.15s ease,\n            opacity 0.15s ease;.circle {width:40px;height:40px;}}.gallery-item-media.svelte-aw59wn {border-radius:6px;overflow:hidden;display:flex;align-items:center;justify-content:center;}.gallery-item-media[role=\"button\"].svelte-aw59wn {cursor:pointer;background-color:transparent;}.gallery-image.svelte-aw59wn,\n    .gallery-video.svelte-aw59wn {object-fit:cover;display:block;}.gallery-image.svelte-aw59wn {min-width:100px;max-width:180px;height:180px;-webkit-drag:none;&.image-loading {opacity:0;}}.video-wrapper.svelte-aw59wn,\n    .gallery-video.svelte-aw59wn {width:180px;height:180px;}.video-drag-overlay.svelte-aw59wn {position:absolute;inset:0 0 50px;z-index:1;}\n\n    @media (hover: none) and (pointer: coarse) {.video-drag-overlay.svelte-aw59wn {display:none;}\n    }"
};
function pn(t, r) {
	s(r, !0), b(t, fn);
	let i = () => te(oe, "$_", a), [a, l] = ee(), d = E(r, "disabled", 3, !1), h = p(void 0), S = p(void 0), C = Ue();
	Xe(() => A(h), { onLongPress: (e, t) => {
		d() || r.onTouchDragStart?.(r.index, e, t);
	} });
	let T = m(() => !r.item.isPlaceholder && r.item.type === "image" && !!r.item.src), D = m(() => !r.item.isPlaceholder && r.item.type === "video" && !!r.item.src), O = m(() => {
		if (!r.item.isPlaceholder) return;
		let e = r.item.dimensions;
		if (e && e.width > 0 && e.height > 0) {
			let t = e.width / e.height, n = Math.round(180 * t);
			return `width: ${Math.max(100, Math.min(180, n))}px; height: 180px;`;
		}
		return "width: 180px; height: 180px;";
	});
	function k() {
		r.item.isPlaceholder || r.item.type !== "image" || Q.showImageFullscreen(r.item.src, r.item.alt || "", r.item.id);
	}
	function ne(e) {
		if (d()) e.preventDefault();
		else {
			if (A(h) && e.dataTransfer) {
				let t = A(h).getBoundingClientRect(), n = e.clientX - t.left, r = e.clientY - t.top;
				e.dataTransfer.setDragImage(A(h), n, r);
			}
			r.onDragStart(r.index, e);
		}
	}
	function M(e) {
		e.stopPropagation(), A(S) && (A(S).paused ? A(S).play() : A(S).pause());
	}
	function ae(e) {
		e.preventDefault(), !d() && r.onDragOver(r.index, e);
	}
	function N(e) {
		e.preventDefault(), !d() && r.onDrop(r.index);
	}
	function ce(e) {
		r.item.type !== "image" || r.item.isPlaceholder || (e.key === "Enter" || e.key === " " || e.key === "Spacebar") && (e.preventDefault(), k());
	}
	var P = dn();
	let le;
	var F = x(P), I = x(F), ue = (e) => {
		{
			let t = m(() => r.item.type === "video" ? i()("videoNode.uploading") : i()("imageNode.uploading"));
			se(e, {
				get text() {
					return A(t);
				},
				showLoader: !0
			});
		}
	};
	o(I, (e) => {
		r.item.isPlaceholder && e(ue);
	});
	var L = _(I, 2), R = (t) => {
		var n = ln();
		let i;
		w(() => {
			j(n, "src", r.item.src), j(n, "alt", r.item.alt || ""), i = re(n, 1, "gallery-image svelte-aw59wn", null, i, { "image-loading": !C.isLoaded });
		}), f("load", n, function(...e) {
			C.handleLoad?.apply(this, e);
		}), f("error", n, function(...e) {
			C.handleError?.apply(this, e);
		}), u("contextmenu", n, (e) => e.preventDefault()), e(n), c(t, n);
	};
	o(L, (e) => {
		A(T) && e(R);
	});
	var z = _(L, 2), B = (e) => {
		var t = un(), n = x(t);
		n.muted = !0, g(n, (e) => v(S, e), () => A(S));
		var i = _(n, 2);
		y(t), w(() => {
			j(n, "src", r.item.src), j(i, "draggable", !d());
		}), u("contextmenu", n, (e) => e.preventDefault()), f("dragstart", i, ne), u("click", i, M), c(e, t);
	};
	o(z, (e) => {
		A(D) && e(B);
	}), y(F);
	var de = _(F, 2), fe = (e) => {
		{
			let t = m(() => i()("imageContextMenu.delete")), n = m(() => i()("imageContextMenu.copyUrl")), a = m(() => i()("imageContextMenu.copySuccess"));
			He(e, {
				get src() {
					return r.item.src;
				},
				onDelete: () => r.onDelete(r.item.id),
				get deleteAriaLabel() {
					return A(t);
				},
				get copyAriaLabel() {
					return A(n);
				},
				get copySuccessMessage() {
					return A(a);
				},
				layout: "gallery",
				get deleteDisabled() {
					return d();
				}
			});
		}
	};
	o(de, (e) => {
		r.item.isPlaceholder || e(fe);
	}), y(P), g(P, (e) => v(h, e), () => A(h)), w(() => {
		le = re(P, 1, "gallery-item svelte-aw59wn", null, le, {
			"is-placeholder": r.item.isPlaceholder,
			"is-disabled": d()
		}), j(P, "draggable", !d() && (r.item.type !== "video" || r.item.isPlaceholder)), n(F, A(O)), j(F, "role", r.item.type === "image" && !r.item.isPlaceholder ? "button" : void 0), j(F, "tabindex", r.item.type === "image" && !r.item.isPlaceholder ? 0 : void 0), j(F, "aria-label", r.item.alt || r.item.src);
	}), f("dragstart", P, ne), f("dragover", P, ae), f("drop", P, N), f("dragend", P, () => r.onDragEnd()), u("click", F, function(...e) {
		(r.item.type === "image" && !r.item.isPlaceholder ? k : void 0)?.apply(this, e);
	}), u("keydown", F, ce), c(t, P), ie(), l();
}
d([
	"click",
	"keydown",
	"contextmenu"
]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/mediaGalleryWheelUtils.ts
function mn(e) {
	return Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
}
function hn(e, t) {
	let n = e.scrollHeight - e.clientHeight;
	if (n <= 1) return !1;
	let r = e.scrollTop <= 0, i = e.scrollTop >= n - 1;
	return t > 0 ? !i : t < 0 && !r;
}
function gn(e, t) {
	let n = e.scrollWidth - e.clientWidth;
	if (n <= 1) return !1;
	let r = e.scrollLeft <= 0, i = e.scrollLeft >= n - 1;
	return t > 0 ? !i : t < 0 && !r;
}
function _n(e, t, n = null) {
	if (n && hn(n, t.deltaY)) return !1;
	let r = mn(t);
	if (!gn(e, r)) return !1;
	let i = Math.max(0, e.scrollWidth - e.clientWidth);
	return e.scrollLeft = Math.min(i, Math.max(0, e.scrollLeft + r)), !0;
}
// D:/ドキュメント/GitHub/ehagaki/src/components/MediaGallery.svelte
var vn = i("<div><!></div>"), yn = i("<div role=\"list\"></div>"), bn = {
	hash: "svelte-w2vv8k",
	code: ".media-gallery.svelte-w2vv8k {display:flex;align-items:center;width:100%;min-height:180px;overflow-x:auto;overflow-y:visible;scrollbar-width:thin;gap:4px;background-color:var(--window);}.media-gallery.sending.svelte-w2vv8k {background-color:color-mix(\n            in srgb,\n            var(--window) 82%,\n            var(--surface-button) 18%\n        );cursor:not-allowed;}.media-gallery.sending.svelte-w2vv8k .gallery-item {cursor:not-allowed;}.gallery-item-wrapper.svelte-w2vv8k {position:relative;display:inline-flex;align-items:center;width:fit-content;height:fit-content;}\n\n    /* 挿入位置インジケーターバー */.gallery-item-wrapper.insert-bar-left.svelte-w2vv8k::before,\n    .gallery-item-wrapper.insert-bar-right.svelte-w2vv8k::after {content:\"\";position:absolute;top:0;bottom:0;width:8px;background:var(--theme, #2196f3);border-radius:4px;z-index:10;pointer-events:none;}.gallery-item-wrapper.insert-bar-left.svelte-w2vv8k::before {left:-5px;}.gallery-item-wrapper.insert-bar-right.svelte-w2vv8k::after {right:-5px;}\n\n    @media (hover: none) and (pointer: coarse) {.media-gallery.svelte-w2vv8k {scrollbar-width:none;}.media-gallery.svelte-w2vv8k::-webkit-scrollbar {display:none;}\n    }"
};
function xn(e, t) {
	s(t, !0), b(e, bn);
	let n = () => te(oe, "$_", i), [i, a] = ee(), u = p(-1), d = p(-1), h = p(-1), _ = p(-1), S = null, C = 60, T = 60, E = p(void 0), D = null, k = m(() => G.items), M = m(() => J.postStatus.sending), N = m(() => {
		let e = A(u) === -1 ? A(h) : A(u), t = A(u) === -1 ? A(_) : A(d);
		return e === -1 || t === -1 || t === e || t === e + 1 ? -1 : t;
	});
	function se(e, t) {
		A(M) ? t.preventDefault() : (v(u, e, !0), t.dataTransfer?.setData("text/plain", String(e)), t.dataTransfer && (t.dataTransfer.effectAllowed = "move"));
	}
	function ce(e, t) {
		if (t.preventDefault(), A(M)) return;
		let n = A(E)?.querySelectorAll(".gallery-item-wrapper")?.[e];
		if (n) {
			let r = n.getBoundingClientRect();
			v(d, t.clientX < r.left + r.width / 2 ? e : e + 1, !0);
		} else v(d, e, !0);
	}
	function P() {
		R(), v(u, -1), v(d, -1);
	}
	function le(e) {}
	function F(e) {
		if (A(u) === -1) return;
		if (e.preventDefault(), A(M)) {
			R(), v(d, -1);
			return;
		}
		let t = A(E)?.querySelectorAll(".gallery-item-wrapper");
		if (t && t.length > 0) {
			let n = t[0].getBoundingClientRect(), r = t[t.length - 1].getBoundingClientRect();
			e.clientX < n.left ? v(d, 0) : e.clientX > r.right && v(d, A(k).length, !0);
		}
		if (A(E)) {
			let t = A(E).getBoundingClientRect();
			e.clientX - t.left < 100 ? L("left", e.clientX) : t.right - e.clientX < 100 ? L("right", e.clientX) : R();
		}
	}
	function I(e) {
		if (e.preventDefault(), R(), A(M)) {
			v(u, -1), v(d, -1);
			return;
		}
		let t = A(d);
		if (A(u) !== -1 && t !== -1 && t !== A(u) && t !== A(u) + 1) {
			let e = A(u) < t ? t - 1 : t;
			G.reorderItems(A(u), e);
		}
		v(u, -1), v(d, -1);
	}
	function ue(e) {
		A(M) || G.removeItem(e);
	}
	function L(e, t) {
		if (!A(E)) return;
		D !== null && (cancelAnimationFrame(D), D = null);
		let n = A(E).getBoundingClientRect(), r = e === "left" ? t - n.left : n.right - t, i = 1 + 9 * (1 - Math.max(0, Math.min(1, r / 100))), a = () => {
			if (!A(E)) return;
			let t = A(E).scrollWidth - A(E).clientWidth;
			e === "left" && A(E).scrollLeft > 0 ? (A(E).scrollLeft = Math.max(0, A(E).scrollLeft - i), D = requestAnimationFrame(a)) : e === "right" && A(E).scrollLeft < t ? (A(E).scrollLeft = Math.min(t, A(E).scrollLeft + i), D = requestAnimationFrame(a)) : D = null;
		};
		D = requestAnimationFrame(a);
	}
	function R() {
		D !== null && (cancelAnimationFrame(D), D = null);
	}
	function z(e, t, n) {
		if (A(M)) return;
		v(h, e, !0), fe();
		let r = A(E)?.querySelectorAll(".gallery-item-wrapper")[e];
		if (r) {
			let e = r.getBoundingClientRect(), i = Math.min(120 / e.width, 120 / e.height);
			C = e.width * i / 2, T = e.height * i / 2, S = r.cloneNode(!0), S.style.cssText = `
                position: fixed;
                left: ${t - C}px;
                top: ${n - T}px;
                width: ${e.width}px;
                height: ${e.height}px;
                transform-origin: top left;
                transform: scale(${i});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, ae().overlayTarget.appendChild(S);
		}
		document.addEventListener("touchmove", B, { passive: !1 }), document.addEventListener("touchend", de, { passive: !1 });
	}
	function B(e) {
		if (A(h) === -1 || e.touches.length !== 1) return;
		if (e.preventDefault(), A(M)) {
			R(), v(_, -1);
			return;
		}
		let t = e.touches[0];
		S && (S.style.left = `${t.clientX - C}px`, S.style.top = `${t.clientY - T}px`), S && (S.style.display = "none");
		let n = document.elementFromPoint(t.clientX, t.clientY);
		S && (S.style.display = "");
		let r = n?.closest(".gallery-item-wrapper");
		if (r && A(E)) {
			let e = A(E).querySelectorAll(".gallery-item-wrapper"), n = Array.from(e).indexOf(r);
			if (n !== -1) {
				let e = r.getBoundingClientRect();
				v(_, t.clientX < e.left + e.width / 2 ? n : n + 1, !0);
			}
		} else if (A(E)) {
			let e = A(E).querySelectorAll(".gallery-item-wrapper");
			if (e.length > 0) {
				let n = e[0].getBoundingClientRect(), r = e[e.length - 1].getBoundingClientRect();
				t.clientX <= n.left ? v(_, 0) : t.clientX >= r.right && v(_, A(k).length, !0);
			}
		}
		if (A(E)) {
			let e = A(E).getBoundingClientRect();
			t.clientX - e.left < 100 ? L("left", t.clientX) : e.right - t.clientX < 100 ? L("right", t.clientX) : R();
		}
	}
	function de() {
		if (document.removeEventListener("touchmove", B), document.removeEventListener("touchend", de), R(), A(M)) {
			fe(), v(h, -1), v(_, -1);
			return;
		}
		let e = A(_);
		if (A(h) !== -1 && e !== -1 && e !== A(h) && e !== A(h) + 1) {
			let t = A(h) < e ? e - 1 : e;
			G.reorderItems(A(h), t);
		}
		fe(), v(h, -1), v(_, -1);
	}
	function fe() {
		S &&= (S.remove(), null);
	}
	function V(e) {
		if (!A(E)) return;
		let t = A(E).closest(".composer-scroll-region");
		_n(A(E), e, t instanceof HTMLElement ? t : null) && e.preventDefault();
	}
	O(() => {
		if (A(E)) return A(E).addEventListener("wheel", V, { passive: !1 }), () => {
			A(E)?.removeEventListener("wheel", V);
		};
	});
	var H = l(), U = ne(H), pe = (e) => {
		var t = yn();
		let i;
		r(t, 23, () => A(k), (e) => e.id, (e, t, n) => {
			var r = vn();
			let i;
			pn(x(r), {
				get item() {
					return A(t);
				},
				get index() {
					return A(n);
				},
				onDelete: ue,
				onDragStart: se,
				onDragOver: ce,
				onDragEnd: P,
				onDrop: le,
				onTouchDragStart: z,
				get disabled() {
					return A(M);
				}
			}), y(r), w(() => i = re(r, 1, "gallery-item-wrapper svelte-w2vv8k", null, i, {
				"insert-bar-left": A(N) === A(n),
				"insert-bar-right": A(N) === A(k).length && A(n) === A(k).length - 1
			})), c(e, r);
		}), y(t), g(t, (e) => v(E, e), () => A(E)), w((e) => {
			i = re(t, 1, "media-gallery svelte-w2vv8k", null, i, { sending: A(M) }), j(t, "aria-label", e);
		}, [() => n()("mediaGallery.aria_label") || "メディアギャラリー"]), f("dragover", t, F), f("drop", t, I), c(e, t);
	};
	o(U, (e) => {
		A(k).length > 0 && e(pe);
	}), c(e, H), ie(), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/editorDomActions.svelte.ts
function Sn(e) {
	if (!e || !e.types) return !1;
	try {
		return Array.from(e.types).some((e) => e === "application/x-tiptap-node");
	} catch {
		return !1;
	}
}
function Cn(e) {
	if (!e) return !1;
	try {
		return Array.from(e.types).includes("Files") || e.files && e.files.length > 0;
	} catch {
		return !!(e.files && e.files.length > 0);
	}
}
function wn(e) {
	let t = e.__postStatus;
	return (typeof t == "function" ? t() : t)?.sending === !0;
}
function Tn(e) {
	return typeof e.__uploadFiles == "function";
}
function En(e) {
	let t = p(!1);
	function n(n) {
		if (wn(e) || !Tn(e)) {
			n.preventDefault(), v(t, !1), e.classList.remove("drag-over");
			return;
		}
		let r = n.dataTransfer, i = Sn(r);
		Cn(r) && !i ? (n.preventDefault(), A(t) || (v(t, !0), e.classList.add("drag-over"))) : A(t) && (v(t, !1), e.classList.remove("drag-over"));
	}
	function r(n) {
		A(t) && (v(t, !1), e.classList.remove("drag-over"));
	}
	async function i(n) {
		if (v(t, !1), e.classList.remove("drag-over"), wn(e) || !Tn(e)) {
			n.preventDefault();
			return;
		}
		let r = n.dataTransfer;
		if (!Sn(r) && r?.files && r.files.length > 0) {
			let t = e;
			typeof t.__uploadFiles == "function" && (n.preventDefault(), t.__uploadFiles(r.files));
		}
	}
	return e.addEventListener("dragover", n), e.addEventListener("dragleave", r), e.addEventListener("drop", i), { destroy() {
		e.removeEventListener("dragover", n), e.removeEventListener("dragleave", r), e.removeEventListener("drop", i);
	} };
}
function Dn(e, t) {
	let n = En(e);
	function r(n) {
		if (wn(e) || !Tn(e)) {
			n.preventDefault(), t.dragOver(!1);
			return;
		}
		let r = n.dataTransfer, i = Sn(r);
		Cn(r) && !i ? t.dragOver(!0) : t.dragOver(!1);
	}
	function i(e) {
		t.dragOver(!1);
	}
	function a(n) {
		t.dragOver(!1), (wn(e) || !Tn(e)) && n.preventDefault();
	}
	return e.addEventListener("dragover", r), e.addEventListener("dragleave", i), e.addEventListener("drop", a), { destroy() {
		n?.destroy?.(), e.removeEventListener("dragover", r), e.removeEventListener("dragleave", i), e.removeEventListener("drop", a);
	} };
}
function On(e) {
	function t(t) {
		if (wn(e)) {
			t.preventDefault();
			return;
		}
		if (!t.clipboardData) return;
		if (!Tn(e)) {
			Array.from(t.clipboardData.items).some((e) => e.kind === "file" && e.type.startsWith("image/")) && t.preventDefault();
			return;
		}
		let n = [];
		for (let e of t.clipboardData.items) if (e.kind === "file" && e.type.startsWith("image/")) {
			let t = e.getAsFile();
			t && n.push(t);
		}
		n.length > 0 && (t.preventDefault(), e.__uploadFiles?.(n));
	}
	return e.addEventListener("paste", t), { destroy() {
		e.removeEventListener("paste", t);
	} };
}
function kn(e) {
	function t(e) {
		let t = e.target;
		if (t && (t.closest(".editor-image-button[data-dragging=\"true\"]") || t.closest(".custom-emoji-drag-target[data-dragging=\"true\"]"))) {
			let t = e.touches[0], n = ft.querySelector(".tiptap-editor");
			if (n) {
				let r = n.getBoundingClientRect(), i = t.clientY < r.top + 120, a = t.clientY > r.bottom - 120;
				if (!i && !a) return e.preventDefault(), !1;
			}
		}
	}
	function n(e) {
		let t = ft.querySelectorAll(".drop-zone-indicator");
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
function An(e, t = !0) {
	function n(n) {
		if (t && (n.ctrlKey || n.metaKey) && (n.key === "Enter" || n.key === "NumpadEnter")) {
			n.preventDefault();
			let t = e, r = t.__currentEditor, i = typeof r == "function" ? r() : r, a = t.__hasPostingCapability, o = typeof a == "function" ? a() : a, s = t.__hasStoredKey, c = typeof s == "function" ? s() : s, l = t.__postStatus, u = typeof l == "function" ? l() : l, d = i ? nt(i) : "";
			!u?.sending && d.trim() && (o ?? c) && t.__submitPost?.();
		}
	}
	return e.addEventListener("keydown", n), { destroy() {
		e.removeEventListener("keydown", n);
	} };
}
function jn(e) {
	let t = !1;
	return e?.descendants((e) => {
		if (t) return !1;
		let n = e.type.name;
		(n === "image" || n === "video") && (t = !0);
	}), t;
}
function Mn(e) {
	let { currentEditor: t, editorContainerEl: n, callbacks: r } = e, i = (e) => {
		let n = e.detail.plainText, i = t ? jn(t.state?.doc) : !1;
		r.onContentUpdate?.(n, i);
	}, a = (e) => {
		let t = e;
		r.onImageFullscreenRequest?.(t.detail.src, t.detail.alt || "", t.detail.mediaId);
	}, o = (e) => {
		let n = e?.detail?.pos;
		if (n != null && t && t.view) {
			try {
				"ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
				let e = Je.create(t.state.doc, n);
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
function Nn(e, t) {
	window.removeEventListener("editor-content-changed", e.handleContentUpdate), window.removeEventListener("image-fullscreen-request", e.handleImageFullscreenRequest), window.removeEventListener("select-image-node", e.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", e.handleImageFullscreenRequest), t.removeEventListener("select-image-node", e.handleSelectImageNode));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postComponentUtils.ts
function Pn() {
	return {
		sending: !0,
		success: !1,
		error: !1,
		message: "",
		completed: !1
	};
}
function Fn() {
	return {
		sending: !1,
		success: !0,
		error: !1,
		message: "postComponent.post_success",
		completed: !0
	};
}
function In(e) {
	return {
		sending: !1,
		success: !1,
		error: !0,
		message: e || "postComponent.post_error",
		completed: !1
	};
}
function Ln({ updatePostStatus: e, clearContentAfterSuccess: t, onPostSuccess: n }) {
	return {
		markSending: () => {
			e(Pn());
		},
		markSuccess: (r) => {
			e(Fn()), r?.preserveComposerContent || (t(), n?.(r));
		},
		markFailure: (t) => {
			e(In(t));
		}
	};
}
async function Rn(e) {
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
function zn(e) {
	return e.dimensions && e.dimensions.width > 0 && e.dimensions.height > 0 ? {
		width: e.dimensions.width,
		height: e.dimensions.height
	} : ut(e.dim) || {};
}
function Bn(e) {
	if (!e.mediaFreePlacement) return e.galleryItems.filter((e) => !e.isPlaceholder).map((e) => {
		let t = zn({
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
			let n = zn({ dim: e.attrs.dim });
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
	}), e.includeTemporaryGallery ? [...t, ...Bn({
		...e,
		mediaFreePlacement: !1
	})] : t;
}
function Vn(e, t, n) {
	if (t) {
		let n = e.findIndex((e) => e.id === t);
		if (n >= 0) return n;
	}
	return n ? e.findIndex((e) => e.src === n) : -1;
}
function Hn(e, t) {
	return e[t];
}
function Un(e) {
	let t = [];
	return e.state.doc.descendants((e, n) => {
		e.type.name !== "image" && e.type.name !== "video" || e.attrs.isPlaceholder || t.push({
			node: e,
			pos: n
		});
	}), t;
}
function Wn(e) {
	let t = Un(e.currentEditor);
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
function Gn(e) {
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
async function Kn(e) {
	let { input: t, postHistoryRepositoryImpl: n = L, postMediaCacheRepositoryImpl: r = Dt } = e;
	await n.putPostedEvent(t);
	let i = P(t.event).map((e) => e.url).filter(Boolean);
	i.length !== 0 && await r.linkEventIdByUrls({
		eventId: t.event.id,
		urls: i
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/editorLifecycle.ts
function qn(e) {
	let { placeholderText: t, editorContainerEl: n, hasStoredKey: r, hasPostingCapability: i, submitPost: a, onCustomEmojiSelect: o, getCustomEmojiItems: s, enterKeyBehavior: c, hostOwnedLite: l, submitShortcuts: u, uploadFiles: d, eventCallbacks: f } = e;
	tt.value = t;
	let p = Qe({
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
			q.set(e);
		}
	}), m = null, h = p.subscribe((e) => {
		m = e;
	}), g = Mn({
		currentEditor: m,
		editorContainerEl: n,
		callbacks: f
	});
	return Y(a), n && Object.assign(n, {
		__uploadFiles: d,
		__currentEditor: () => m,
		__hasStoredKey: () => r,
		__hasPostingCapability: () => i ?? r,
		__postStatus: () => J.postStatus,
		__submitPost: a
	}), {
		editor: p,
		unsubscribe: h,
		handlers: g
	};
}
function Jn(e) {
	let { unsubscribe: t, componentUnsubscribe: n, handlers: r, currentEditor: i, editorContainerEl: a, submitPost: o } = e;
	if (Nn(r, a), q.value === i && q.set(null), at(o), n(), t(), i && !i.isDestroyed && i.destroy(), a) {
		let e = a;
		delete e.__uploadFiles, delete e.__currentEditor, delete e.__hasStoredKey, delete e.__hasPostingCapability, delete e.__postStatus, delete e.__submitPost;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/customEmojiInsertion.ts
function Yn(e, t) {
	let n = e.view.dom;
	lt() && document.activeElement !== n ? e.commands.insertCustomEmoji(t) : e.chain().focus().insertCustomEmoji(t).run();
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
function Xn(e) {
	if (typeof e != "string") return !1;
	try {
		let t = new URL(e);
		return t.protocol === "http:" || t.protocol === "https:";
	} catch {
		return !1;
	}
}
function Zn(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return {};
	let t = {};
	for (let [n, r] of Object.entries(e)) $.has(n) && typeof r == "string" && (t[n] = r);
	return t;
}
function Qn(e) {
	return {
		localStorage: M(),
		crypto: window.crypto.subtle,
		tick: C,
		FileUploadManager: e,
		getImageDimensions: Ot,
		extractImageBlurhashMap: bt,
		calculateImageHash: St,
		getMimeTypeFromUrl: vt,
		createImetaTag: wt,
		imageSizeMapStore: Se
	};
}
var $n = class {
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
		return await Et(e);
	}
	async uploadFileWithCallbacks() {
		throw Error("Host-owned media never uses eHagaki upload transport.");
	}
	async uploadMultipleFilesWithCallbacks() {
		throw Error("Host-owned media never uses eHagaki upload transport.");
	}
};
function er(e) {
	let t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
	return {
		fileUploadManager: $n,
		async prepareFiles(r, i) {
			let a = new _t(typeof document > "u" ? void 0 : document), o = () => e.signal.aborted || !!i.isUploadAborted?.(), s = new Ct(a, i.localStorage, o), c = new yt(i.localStorage, o), l = [];
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
				let d = await kt(u, i.crypto, o).catch(() => void 0), f = await (u.type.startsWith("video/") ? c : s).compress(u);
				if (f.aborted || e.signal.aborted) throw new DOMException("The host media operation was aborted.", "AbortError");
				let p = f.file.type.startsWith("image/") ? await Ot(f.file) : null;
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
				if (e.signal.aborted) {
					o.push({
						success: !1,
						aborted: !0
					});
					continue;
				}
				let r = a.get(i), s = {
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
					let t = await e.uploadMedia(i, s, { signal: e.signal });
					if (e.signal.aborted) {
						o.push({
							success: !1,
							aborted: !0
						});
						continue;
					}
					if (!Xn(t?.url)) {
						o.push({
							success: !1,
							error: "host_media_invalid_result"
						});
						continue;
					}
					let r = Zn(t.imeta);
					o.push({
						success: !0,
						hostOwnedMedia: !0,
						url: t.url,
						nip94: {
							...r,
							m: r.m ?? s.processedType ?? i.type,
							...s.ox && !r.ox ? { ox: s.ox } : {},
							...s.blurhash && !r.blurhash ? { blurhash: s.blurhash } : {},
							size: r.size ?? String(i.size),
							...s.width && s.height ? { dim: r.dim ?? `${s.width}x${s.height}` } : {}
						},
						...n.get(i) ? { dimensions: n.get(i) } : s.width && s.height ? { dimensions: pt(s.width, s.height) } : {},
						uploadProtocol: "custom-http",
						sizeInfo: {
							originalSize: s.originalSize,
							compressedSize: i.size,
							wasCompressed: s.originalSize !== i.size,
							compressionRatio: s.originalSize ? i.size / s.originalSize : 1,
							sizeReduction: "",
							originalFilename: s.originalName,
							compressedFilename: i.name
						}
					});
				} catch (t) {
					o.push({
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
var tr = i("<div class=\"editor-account-placeholder svelte-15ticnd\" aria-hidden=\"true\"><!></div>"), nr = i("<div class=\"plane-icon svg-icon svelte-15ticnd\"></div>"), rr = i("<div class=\"editor-submit-button-container svelte-15ticnd\"><!></div>"), ir = i("<input type=\"file\" style=\"display: none;\" class=\"svelte-15ticnd\"/>"), ar = i("<div class=\"upload-error svelte-15ticnd\"> </div>"), or = i("<div class=\"svelte-15ticnd\"> </div>"), sr = i("<div data-post-editor-root=\"\"><div role=\"textbox\" tabindex=\"-1\"><!> <!> <!></div> <!> <!> <!></div> <!> <!> <!>", 1), cr = {
	hash: "svelte-15ticnd",
	code: ".post-container.svelte-15ticnd,\n  .editor-container.svelte-15ticnd,\n  .editor-content,\n  .tiptap-editor {width:100%;flex:1 1 auto;}.post-container.svelte-15ticnd,\n  .editor-container.svelte-15ticnd,\n  .editor-content {display:flex;flex-direction:column;}.post-container.svelte-15ticnd,\n  .editor-content,\n  .tiptap-editor {min-height:0;}.editor-content,\n  .tiptap-editor {height:100%;}.post-container.svelte-15ticnd {max-width:800px;align-items:stretch;overflow:visible;--post-editor-block-padding: 10px;--post-editor-line-height: 30px;--post-editor-submit-button-size: 40px;--post-editor-submit-button-inline-inset: 14px;}.upload-error.svelte-15ticnd {color:#c62828;font-size:0.9rem;margin-bottom:10px;width:100%;text-align:left;}.editor-container.svelte-15ticnd {min-height:var(--post-editor-min-height, 92px);height:var(--post-editor-target-height, auto);max-height:var(--post-editor-target-height, auto);position:relative;cursor:text;outline:none;background:var(--surface-editor);-webkit-tap-highlight-color:transparent;overflow:hidden;}.post-container.editor-auto-grow.svelte-15ticnd,\n  .post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd),\n  .post-container.editor-auto-grow.svelte-15ticnd .editor-content,\n  .post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {flex:0 0 auto;}.post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd),\n  .post-container.editor-auto-grow.svelte-15ticnd .editor-content,\n  .post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {height:auto;}.post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd) {min-height:0;max-height:none;}.post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {min-height:calc(\n      var(--post-editor-auto-grow-min-lines) + var(--post-editor-block-padding) +\n        var(--post-editor-block-padding)\n    );max-height:calc(\n      var(--post-editor-auto-grow-max-lines) + var(--post-editor-block-padding) +\n        var(--post-editor-block-padding)\n    );}.editor-account-placeholder {position:absolute;top:11px;left:14px;z-index:3;width:28px;height:28px;pointer-events:none;user-select:none;-webkit-user-select:none;}.editor-account-placeholder-avatar {display:block;width:100%;height:100%;overflow:hidden;border-radius:50%;}.editor-account-placeholder-image,\n  .editor-account-placeholder-fallback {display:block;width:100%;height:100%;border-radius:50%;}.editor-account-placeholder-image {opacity:0.5;object-fit:cover;}.editor-container.account-avatar-placeholder.svelte-15ticnd\n    p.is-editor-empty:first-child::before {padding-left:38px;}.editor-container.sending.svelte-15ticnd {background:color-mix(\n      in srgb,\n      var(--surface-editor) 82%,\n      var(--surface-button) 18%\n    );cursor:not-allowed;}.editor-container.sending.svelte-15ticnd .tiptap-editor {cursor:not-allowed;opacity:0.72;}.editor-container.editor-submit-enabled.sending.svelte-15ticnd .tiptap-editor {pointer-events:none;}.editor-container.sending.svelte-15ticnd .editor-image-button,\n  .editor-container.sending.svelte-15ticnd .custom-emoji-drag-target,\n  .editor-container.sending.svelte-15ticnd .media-delete-btn {pointer-events:none;}.editor-container.editor-submit-enabled.svelte-15ticnd .tiptap-editor {padding-inline-end:calc(var(--post-editor-submit-button-inline-inset) + var(--post-editor-submit-button-size));}.editor-submit-button-container.svelte-15ticnd {position:absolute;inset-inline-end:var(--post-editor-submit-button-inline-inset);bottom:var(--post-editor-block-padding);z-index:4;}.post-container.editor-auto-grow.svelte-15ticnd .editor-submit-button-container:where(.svelte-15ticnd) {bottom:calc(\n      var(--post-editor-block-padding) +\n        (var(--post-editor-line-height) - var(--post-editor-submit-button-size)) /\n        2\n    );}.editor-submit-button {width:var(--post-editor-submit-button-size);height:var(--post-editor-submit-button-size);flex:0 0 var(--post-editor-submit-button-size);}button.editor-submit-button .plane-icon.svg-icon {width:22px;height:22px;mask-image:var(--ehagaki-icon-70617065722d706c616e652d736f6c69642d66756c6c2e737667);margin-inline-end:1px;margin-top:1px;}.editor-container.drag-over.svelte-15ticnd {border:3px dashed var(--theme);}\n\n  /* ギャラリーモード時はドロップカーソル（差し込み位置バー）を常に非表示 */.editor-container.gallery-mode.svelte-15ticnd .tiptap-dropcursor {display:none !important;}\n\n  /* Tiptapエディターのスタイル */.tiptap-editor {display:block;padding:var(--post-editor-block-padding);font-family:inherit;font-size:1.25rem;line-height:var(--post-editor-line-height);outline:none;overflow-y:auto;overflow-x:hidden;scroll-padding-bottom:16px;scroll-behavior:auto;will-change:scroll-position;transform:translateZ(0);-webkit-tap-highlight-color:transparent;.editor-paragraph {margin:0;padding:0;color:var(--text);position:relative;z-index:2;word-break:normal;overflow-wrap:anywhere;line-break:loose;white-space:break-spaces;}.hashtag {color:var(--hashtag-text);font-weight:600;background:var(--hashtag-bg);padding:2px 4px;border-radius:4px;word-break:break-all;}.preview-link {color:var(--link);word-break:break-all;}.preview-link:visited {color:var(--link-visited);}p.is-editor-empty:first-child::before {color:var(--text);content:attr(data-placeholder);float:left;height:0;pointer-events:none;opacity:0.6;}.toolbar-caret {display:inline-block;width:0;height:1.5em;margin-left:-1px;border-left:2px solid var(--text);vertical-align:-0.25em;pointer-events:none;\n      animation: svelte-15ticnd-toolbar-caret-blink 1s steps(1) infinite;}}\n\n  @keyframes svelte-15ticnd-toolbar-caret-blink {\n    0%,\n    49% {\n      opacity: 1;\n    }\n    50%,\n    100% {\n      opacity: 0;\n    }\n  }\n\n  /* ドロップゾーンのフェードアウトアニメーション（改善版） */.drop-zone-fade-out {\n    animation: svelte-15ticnd-dropZoneFadeOut 0.3s ease-out forwards;}\n\n  @keyframes svelte-15ticnd-dropZoneFadeOut {\n    from {\n      opacity: 0.9;\n      transform: scale(1);\n    }\n    to {\n      opacity: 0;\n      transform: scale(0.8);\n    }\n  }\n\n  /* タッチデバイス用の追加スタイル */\n  @media (hover: none) and (pointer: coarse) {.editor-container.svelte-15ticnd {-webkit-tap-highlight-color:transparent;will-change:scroll-position;}\n\n    /* ドラッグ中の視覚フィードバック強化 */.editor-image-button[data-dragging=\"true\"] {z-index:1;}.tiptap-editor {-webkit-user-select:text;user-select:text;-webkit-transform:translateZ(0);transform:translateZ(0);backface-visibility:hidden;}\n  }\n\n  /* ProseMirror のギャップカーソルの色を上書き（Light / Dark 対応） */.tiptap-editor .ProseMirror-gapcursor:after,\n  .tiptap-editor .ProseMirror-gapcursor:before {border-top-color:light-dark(black, white);}"
};
function lr(e, r) {
	s(r, !0), b(e, cr);
	let i = () => te(oe, "$_", l), [l, d] = ee(), C = E(r, "hasPostingCapability", 19, () => r.hasStoredKey), M = E(r, "isSwitchingAccount", 3, !1), N = E(r, "profilePending", 3, !1), se = E(r, "availableComposerHeight", 3, 152), ce = E(r, "minEditorHeight", 3, 152);
	E(r, "hostCustomEmojiItems", 19, () => []);
	let P = m(() => !0), le = m(() => J.isUploading), F = m(() => J.canPost), I = m(() => !1), ue = p(null), R = p(null), z = p(null), B = p(!1), de = p(!1), fe = p(void 0), V = p(void 0), H = !1, U = p(T({})), W = p(T({})), he = m(() => we.value), ge = m(() => !A(he) || !!X.value), xe = p(0), Te = m(() => (A(xe), Ae?.getInputMode() ?? "singleValue")), Ae = tn({
		getEditor: () => q.value,
		getAuth: () => me.value,
		getRuntime: () => r.rxNostr,
		getEnvironment: ae,
		isFreePlacement: () => we.value,
		getItems: () => G.getItems(),
		addItem: (e) => G.addItem(e),
		removeItem: (e) => G.removeItem(e),
		removePlaceholderSize: (e) => Se.update((t) => {
			let n = { ...t };
			return delete n[e], n;
		}),
		restoreItems: (e, t) => {
			A(nt)?.editor === e && !A(nt).isCurrent() && (v(nt, null), A(V)?.cancelActiveNip65Operations(), J.isSubmitPending = !1, J.postStatus.sending && it());
			let n = Gn({
				currentEditor: e,
				items: t
			});
			return Object.assign(A(U), n.imageOxMap), Object.assign(A(W), n.imageXMap), n.movedItemIds;
		},
		onChange: () => {
			v(xe, A(xe) + 1);
		},
		onUploadEnd: () => rn(J, !1, "")
	});
	function je(e) {
		return A(xe), gt(e.state.doc, Ae?.getContext() ?? !1);
	}
	O(() => {
		me.value, r.rxNostr, q.value, X.value, D(() => Ae?.sync());
	}), O(() => {
		Ee.value && D(() => Ae?.abortUpload());
	});
	let K = m(() => J.postStatus), Ne = m(() => J.uploadErrorMessage), Pe = m(() => Bt.value), Fe = m(() => qt.value), Ie = m(() => At.value), Le = p(!0), Re = !1, ze = m(() => r.hasStoredKey && !M() && A(Fe) && !A(Ie) && A(Le)), He = null, Ue = null, Ge = null, Je = null, Xe = p(T(152)), Ze = m(() => !1), Qe = m(() => A(Ze) ? `--post-editor-auto-grow-min-lines: ${r.hostOwnedConfig.editorMinLines}lh; --post-editor-auto-grow-max-lines: ${r.hostOwnedConfig.editorMaxLines}lh;` : `--post-editor-min-height: ${ce()}px; --post-editor-target-height: ${A(Xe)}px;`), tt = m(() => X.value && A(Te) === "uploadedShortcode" ? i()("reaction.shortcode_hint") : i()("postComponent.enter_your_text") || "テキストを入力してください");
	O(() => {
		let e = X.value, t = A(R), n = G.hasNonPlaceholderItems();
		t && ot(t, n, e ? !!je(t).value && !ct(t) : void 0);
	});
	let nt = p(null);
	O(() => {
		let e = A(nt);
		e && !e.isCurrent() && (v(nt, null), D(() => {
			A(V)?.cancelActiveNip65Operations(), q.value === e.editor && (J.isSubmitPending = !1, J.postStatus.sending && it());
		}));
	});
	function Y() {
		return A(K).sending || A(B);
	}
	O(() => {
		A(R), $e(A(tt));
	}), O(() => {});
	function at() {
		if (A(Ze)) return;
		let e = ce();
		if (!He || !Ue) {
			v(Xe, e, !0);
			return;
		}
		let t = Array.from(He.children).reduce((e, t) => t === Ue ? e : e + Wt(t), 0), n = Kt({
			availableComposerHeight: se(),
			nonEditorHeight: t,
			minHeight: e
		});
		A(Xe) !== n && v(Xe, n, !0);
	}
	function st(e) {
		Y() ? e.preventDefault() : e.target instanceof HTMLElement && A(R) && (dt(e.target) || A(R).commands.focus("end"));
	}
	function lt(e) {
		!A(R) || e.currentTarget !== e.target || e.key !== "Enter" && e.key !== " " || (e.preventDefault(), A(R).commands.focus("end"));
	}
	function ut(e) {
		Y() && (!A(z)?.isCompositionInputAllowed() || !e.isComposing && e.keyCode !== 229) && (e.preventDefault(), e.stopPropagation());
	}
	function ft(e) {
		let t = A(z)?.isCompositionInputAllowed() && e instanceof InputEvent && (e.isComposing || e.inputType === "insertCompositionText" || e.inputType === "insertFromComposition");
		Y() && !t && (e.preventDefault(), e.stopPropagation());
	}
	function pt(e) {
		e.preventDefault();
	}
	function ht(e) {
		let t = A(R)?.view.dom;
		A(I) && t && e.relatedTarget === t && t.focus({ preventScroll: !0 });
	}
	let _t = m(() => Q.value), vt = m(() => A(_t).showSecretKeyDialog), yt = m(() => A(_t).showImageFullscreen), bt = m(() => A(_t).fullscreenMediaId), St = m(() => A(_t).fullscreenImageSrc), Ct = m(() => A(_t).fullscreenImageAlt), wt = m(() => A(_t).showFloatingMessage), Et = m(() => A(_t).floatingMessageX), Dt = m(() => A(_t).floatingMessageY), Ot = m(() => A(_t).floatingMessageText);
	O(() => {
		r.rxNostr && (A(V) ? A(V).setRxNostr(r.rxNostr) : v(V, new en(r.rxNostr, {
			getNip46SignerForSessionFn: (e) => Me.getSignerForSession(e),
			getParentClientSignerFn: () => pe.getSigner(),
			channelContextState: Ht,
			replyQuoteState: Vt,
			replyQuoteService: new It(),
			clearReplyQuoteFn: jt,
			savePostHistoryFn: (e) => Kn({
				input: e,
				postHistoryRepositoryImpl: L
			}),
			notificationPort: r.notificationPort,
			storeSignedEventsFn: (e, t) => r.storeSignedEventsFn?.(e, t)
		}), !0));
	});
	let kt = on({
		getCurrentEditor: () => A(R),
		getFileInput: () => A(fe),
		getImageOxMap: () => A(U),
		getImageXMap: () => A(W),
		getUploadFailedText: (e) => i()(e),
		updateUploadState: (e, t) => {
			rn(J, e, t);
		},
		setUploadErrorMessage: (e) => {
			J.uploadErrorMessage = e;
		},
		uploadFiles: async (e) => {
			if (Y() || J.isSubmitPending || J.isUploading) return null;
			{
				let t = X.value;
				if (t && (e.files.length !== 1 || !e.files[0].type.startsWith("image/"))) return J.uploadErrorMessage = i()("postComponent.reactionUnsupportedImage"), null;
				let n = t ? Ae?.beginUpload() : void 0;
				if (t && !n) return null;
				n && Ee.reset(), rn(J, !0, "");
				try {
					let t = r.normalUploadFiles ?? (await import("./normalUploadHelper-BqAbnXGg.js")).uploadFiles;
					return n && (!n.isCurrent() || n.signal.aborted) ? null : await t({
						...e,
						...n ? { reactionUpload: n } : {}
					});
				} finally {
					n ? (n.isCurrent() && rn(J, !1), Ae?.endUpload(n)) : rn(J, !1);
				}
			}
			if (!r.hostOwnedConfig?.uploadMedia) return rn(J, !1, i()("postComponent.media_not_supported")), null;
			rn(J, !0, "");
			let t = er({
				uploadMedia: r.hostOwnedConfig.uploadMedia,
				signal: r.hostOwnedConfig.signal
			});
			try {
				return await xt({
					...e,
					showUploadError: (e, t) => Tt(e, t, {
						updateUploadState: (e, t) => {
							rn(J, e, t);
						},
						setUploadErrorMessage: (e) => {
							J.uploadErrorMessage = e;
						},
						keepUploading: !0
					}),
					setUploadErrorMessage: (e) => {
						J.uploadErrorMessage = e;
					},
					devMode: !1,
					dependencies: Qn(t.fileUploadManager),
					prepareFiles: t.prepareFiles,
					uploadPreparedFiles: t.uploadPreparedFiles,
					fileUploadManager: t.fileUploadManager,
					fileUploadManagerInstance: new t.fileUploadManager(),
					deferUploadStateClear: !0,
					isUploadAborted: () => !!r.hostOwnedConfig.signal.aborted
				});
			} finally {
				rn(J, !1);
			}
		}
	});
	function Pt() {
		let e = !!(A(R)?.view.composing && Rt());
		e && A(R)?.view.dom.blur(), bn(), e ? A(z)?.retire() : A(z)?.markStale();
	}
	let zt = Ln({
		updatePostStatus: et,
		clearContentAfterSuccess: Pt,
		onPostSuccess: (e) => {
			e?.event?.kind === 7 ? r.onReactionResult?.(e) : r.onPostSuccess?.(e);
		}
	});
	k(() => {
		Ae?.dispose(), H = !0, Mt("ownership"), A(V)?.cancelActiveNip65Operations();
	});
	function Gt(e) {
		A(z)?.markFailure(), zt.markFailure(e);
	}
	O(() => {
		if (A(Ze)) return;
		if (se(), ce(), A(ge), A(Ne), A(R), A(ge) && G.items.length, typeof window > "u") {
			v(Xe, 152, !0);
			return;
		}
		let e = window.requestAnimationFrame(() => {
			at();
		});
		return () => {
			window.cancelAnimationFrame(e);
		};
	}), O(() => {
		if (A(Ze) || (se(), ce(), A(R), A(ge), A(Ne), !He || typeof ResizeObserver > "u")) return;
		let e = null, t = () => {
			e === null && (e = window.requestAnimationFrame(() => {
				e = null, at();
			}));
		}, n = new ResizeObserver(t);
		t(), n.observe(He);
		for (let e of Array.from(He.children)) e !== Ue && n.observe(e);
		return () => {
			n.disconnect(), e !== null && window.cancelAnimationFrame(e);
		};
	}), S(() => {
		v(B, !1), v(z, new Yt((e) => {
			v(B, e === "stale");
		}), !0), Ge = qn({
			isReactionMode: () => X.value !== null,
			onReactionImageUrls: (e) => {
				Y() || J.isSubmitPending || J.isUploading || Ae?.addImageUrls(e);
			},
			getReactionInputMode: () => Ae?.getInputMode() ?? "singleValue",
			isInputBlocked: Y,
			isCompositionInputAllowed: () => !!A(z)?.isCompositionInputAllowed(),
			compositionController: A(z) ?? void 0,
			placeholderText: A(tt),
			editorContainerEl: Ue,
			currentEditor: A(R),
			hasStoredKey: r.hasStoredKey,
			hasPostingCapability: C(),
			submitPost: vn,
			onCustomEmojiSelect: r.onCustomEmojiSelect,
			getCustomEmojiItems: void 0,
			enterKeyBehavior: void 0,
			hostOwnedLite: !1,
			submitShortcuts: void 0,
			uploadFiles: A(P) ? (e) => {
				Y() || kt.performUpload(e);
			} : void 0,
			eventCallbacks: {
				onContentUpdate: (e, t) => {
					rt(e, t), r.onEditorContentUpdate?.();
				},
				onImageFullscreenRequest: (e, t, n) => {
					Q.showImageFullscreen(e, t, n || "");
				},
				onSelectImageNode: (e) => {}
			}
		}), v(ue, Ge.editor, !0);
		let e = null, t = (e) => {
			let t = e.isEmpty, n = !Re || A(Le) !== t;
			v(Le, t, !0), Re = !0, n && r.onEditorEmptyChange?.(t);
		}, n = (e) => {
			ot(e, G.hasNonPlaceholderItems(), X.value ? !!je(e).value && !ct(e) : void 0);
		}, i = ({ editor: e }) => {
			t(e), n(e);
		};
		Je = A(ue).subscribe((r) => {
			r !== null && r === e ? (v(R, r, !0), r && (t(r), n(r))) : (e && e.off("transaction", i), e = r, v(R, r, !0), r ? (A(z)?.attach(r), t(r), n(r)) : (A(z)?.detach(), ot(null, !1)), r?.on("transaction", i), q.set(r));
		});
		let a = (e) => {
			let { src: t, alt: n, mediaId: r } = e.detail;
			Q.showImageFullscreen(t, n, r || "");
		};
		return window.addEventListener("image-fullscreen-request", a), () => {
			Ae?.dispose(), A(z)?.destroy(), v(z, null), v(B, !1), ot(null, !1), q.value === A(R) && (J.isSubmitPending = !1, Q.hideSecretKeyDialog()), window.removeEventListener("image-fullscreen-request", a), Ge && (e && e.off("transaction", i), Jn({
				unsubscribe: Ge.unsubscribe,
				componentUnsubscribe: Je ?? (() => {}),
				handlers: Ge.handlers,
				currentEditor: A(R),
				editorContainerEl: Ue,
				submitPost: vn
			}), Je = null);
		};
	});
	let Xt = kt.handleFileSelect;
	async function Zt(e) {
		return Y() ? null : await kt.performUpload(e);
	}
	function Qt() {
		A(R)?.commands.focus();
	}
	function $t() {
		A(R)?.commands.blur();
	}
	function nn(e) {
		if (!A(R) || !e || Y()) return;
		let t = A(R), n = e.split("\n").map((e) => ({
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
	function an(e) {
		if (!A(R) || !e || Y()) return !1;
		let t = e.split("\n").map((e) => ({
			type: "paragraph",
			content: e ? [{
				type: "text",
				text: e
			}] : void 0
		}));
		return A(R).isEmpty ? A(R).commands.setContent({
			type: "doc",
			content: t
		}) : A(R).chain().focus("end").insertContent([{ type: "paragraph" }, ...t]).run(), A(R).commands.focus("end"), !0;
	}
	function Z(e) {
		if (!A(R) || !e || Y()) return;
		let t = Nt(e);
		A(R).commands.setContent(t || "<p></p>"), A(R).commands.focus("end");
	}
	function sn() {
		return A(R) ? A(R).getHTML() : "";
	}
	function cn(e) {
		if (!A(R) || e.length === 0 || Y()) return;
		let { schema: t } = A(R).state, n = A(R).state.tr, r = A(R).state.doc.content.size;
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
				n = n.insert(r, a), r += a.nodeSize, e.ox && v(U, {
					...A(U),
					[i]: e.ox
				}, !0), e.x && v(W, {
					...A(W),
					[i]: e.x
				}, !0);
			} else if (e.type === "video" && t.nodes.video) {
				let e = t.nodes.video.create({ src: i });
				n = n.insert(r, e), r += e.nodeSize;
			}
		}), A(R).view.dispatch(n), A(R).commands.focus("end");
	}
	function ln(e) {
		if (!A(R) || Y()) return !1;
		let t = A(R).state.doc;
		return Yn(A(R), e), !t.eq(A(R).state.doc);
	}
	function un() {
		A(R) && (mt(A(R).view.dom) || Ve(A(R)));
	}
	function dn(e) {
		if (!A(R) || Y()) return;
		un();
		let { state: t, view: n } = A(R), r = e < 0 ? t.selection.from : t.selection.to, i = Math.max(0, Math.min(t.doc.content.size, r + e));
		if (i === r) return;
		let a = We.near(t.doc.resolve(i), e);
		n.dispatch(t.tr.setSelection(a).scrollIntoView().setMeta("addToHistory", !1));
	}
	function fn() {
		dn(-1);
	}
	function pn() {
		dn(1);
	}
	function mn() {
		if (!A(R) || Y()) return;
		un();
		let { state: e, view: t } = A(R), { selection: n } = e;
		if (!n.empty) {
			A(R).commands.deleteSelection();
			return;
		}
		let r = n.$from.nodeBefore;
		if (r) {
			let i = r.isText ? Array.from(r.text ?? "").at(-1)?.length ?? 0 : r.nodeSize;
			i > 0 && t.dispatch(e.tr.delete(n.from - i, n.from).scrollIntoView());
		} else A(R).commands.first(({ commands: e }) => [() => e.joinBackward(), () => e.selectNodeBackward()]);
	}
	function hn() {
		A(R) && !Y() && (un(), A(R).commands.keyboardShortcut("Enter"));
	}
	function gn() {
		return _n() && (X.value && A(R) ? !!je(A(R)).value && !ct(A(R)) && !A(R).view.composing : Ke(A(R), G.hasNonPlaceholderItems())) && !J.isSubmitPending && !A(vt);
	}
	function _n() {
		return !!A(R) && !!A(V) && !M() && !A(K).sending && !J.isUploading && !A(K).completed && C();
	}
	async function vn(e) {
		if (!A(R) || !gn() || !A(V)) return;
		let t = A(R), n = X.value;
		if (n) {
			let e = je(t).value;
			if (!e) return;
			let i = r.rxNostr, a = me.value, o = () => !H && q.value === t && r.rxNostr === i && me.value === a && X.value === n, s = {
				editor: t,
				isCurrent: o
			};
			v(nt, s);
			let c = !1;
			J.isSubmitPending = !0, zt.markSending();
			try {
				let t = await Ft.react({
					target: n.event,
					relayHints: n.relayHints,
					value: e,
					publisher: A(V),
					isCurrent: o
				});
				if (!o()) return;
				c = !0, t.success ? (Mt("success"), zt.markSuccess(t)) : Gt("reaction.failed");
			} finally {
				A(nt) === s && (c || o()) && (v(nt, null), !H && q.value === t && (J.isSubmitPending = !1));
			}
		} else {
			J.isSubmitPending = !0;
			try {
				if (t.isDestroyed || q.value !== t || !_n()) return;
				let e = A(V).preparePostPayload(t);
				if (Be(t.state.doc), _e(e.content)) {
					Q.showSecretKeyDialog(e.content, e.emojiTags), J.isSubmitPending = !1;
					return;
				}
				t.view.composing && A(z)?.startSession(Ye.getState(t.state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await A(V).performPostSubmission(t, e, A(U), A(W), () => {
					H || (zt.markSending(), J.isSubmitPending = !1);
				}, (e) => {
					H || zt.markSuccess(e);
				}, (e) => {
					H || Gt(e);
				});
			} finally {
				!H && q.value === t && (J.isSubmitPending = !1);
			}
		}
	}
	function yn() {
		Mt("reset"), A(R) && (A(V) ? A(V).resetPostContent(A(R)) : A(R).chain().clearContent().run());
	}
	function bn() {
		if (Mt("success"), A(V) && A(R)) A(V).clearContentAfterSuccess(A(R));
		else if (A(R)) {
			let e = r.hostOwnedConfig?.hashtagPinEnabled === !0 && Oe.value ? [...ke().hashtags] : [];
			A(R).chain().clearContent().run(), De.reset(), Ce.reset(), G.clearAll(), v(U, {}, !0), v(W, {}, !0), jt(), e.length > 0 && A(R).commands.insertContent(` ${e.map((e) => `#${e}`).join(" ")}`), A(R).commands.focus("start");
		}
	}
	async function Sn() {
		if (!A(vt) || !_n()) return;
		let e = Q.getPendingPost(), t = Q.getPendingEmojiTags();
		e.trim() && A(V) && A(R) && (A(R).view.composing && A(z)?.startSession(Ye.getState(A(R).state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await Rn({
			postManager: A(V),
			currentEditor: A(R),
			imageOxMap: A(U),
			imageXMap: A(W),
			pendingPost: e,
			pendingEmojiTags: t,
			onStart: () => {
				zt.markSending(), Q.hideSecretKeyDialog();
			},
			onSuccess: zt.markSuccess,
			onFailure: Gt
		}));
	}
	let Cn = Q.hideSecretKeyDialog, wn = Q.hideImageFullscreen, Tn = m(() => Bn({
		mediaFreePlacement: A(he),
		includeTemporaryGallery: A(he) && !!X.value,
		galleryItems: G.items,
		currentEditor: A(R)
	})), En = m(() => Vn(A(Tn), A(bt), A(St)));
	function jn(e) {
		let t = Hn(A(Tn), e);
		t && Q.showImageFullscreen(t.src, t.alt ?? "", t.id ?? "");
	}
	O(() => {
		A(R) && A(V) && A(V).preparePostContent(A(R)) !== J.content && A(K).error && et({
			...A(K),
			error: !1,
			message: ""
		});
	});
	function Mn() {
		!A(P) || Y() || J.isSubmitPending || J.isUploading || A(fe)?.click();
	}
	O(() => {
		let e = G.items.some((e) => !e.isPlaceholder);
		ot(A(R), e, X.value ? !!(A(R) && je(A(R)).value) && !(!A(R) || ct(A(R))) : void 0);
	});
	let Nn = !0, Pn = !we.value;
	O(() => {
		let e = !we.value;
		if (X.value) return;
		if (Nn) {
			Nn = !1, Pn = e;
			return;
		}
		if (!A(R) || Pn === e) return;
		Pn = e;
		let t = A(R);
		if (e) D(() => Wn({
			currentEditor: t,
			imageOxMap: A(U),
			imageXMap: A(W),
			addGalleryItem: (e) => G.addItem(e),
			createMediaItemId: ye
		})) && D(() => {
			v(U, {}, !0), v(W, {}, !0);
		});
		else {
			let e = Gn({
				currentEditor: t,
				items: D(() => G.getItems())
			});
			e.hadItems && D(() => {
				v(U, e.imageOxMap, !0), v(W, e.imageXMap, !0);
			}), D(() => G.clearAll());
		}
	});
	var Fn = {
		uploadFiles: Zt,
		focusEditor: Qt,
		blurEditor: $t,
		insertTextContent: nn,
		appendSharedTextContent: an,
		loadDraftContent: Z,
		getEditorHtml: sn,
		appendMediaToEditor: cn,
		insertCustomEmoji: ln,
		moveCaretLeft: fn,
		moveCaretRight: pn,
		deleteBackward: mn,
		insertLineBreak: hn,
		submitPost: vn,
		resetPostContent: yn,
		clearContentAfterSuccess: bn,
		openFileDialog: Mn
	}, In = sr(), zn = ne(In);
	let Un;
	var $ = x(zn);
	let Xn;
	var Zn = x($), $n = (e) => {
		var t = tr(), n = x(t);
		{
			let e = m(() => A(Pe)?.displayName), t = m(() => A(Pe)?.name), r = m(() => A(Pe)?.picture || "");
			Ut(n, {
				get pubkeyHex() {
					return me.value.pubkey;
				},
				get displayName() {
					return A(e);
				},
				get name() {
					return A(t);
				},
				showLoadingIndicator: !0,
				get pending() {
					return N();
				},
				get src() {
					return A(r);
				},
				alt: "",
				fallbackAriaLabel: "",
				rootClassName: "editor-account-placeholder-avatar",
				imageClassName: "editor-account-placeholder-image",
				fallbackClassName: "editor-account-placeholder-fallback"
			});
		}
		y(t), c(e, t);
	};
	o(Zn, (e) => {
		A(ze) && e($n);
	});
	var lr = _(Zn, 2), ur = (e) => {
		qe(e, {
			get editor() {
				return A(R);
			},
			class: "editor-content"
		});
	};
	o(lr, (e) => {
		A(ue) && A(R) && e(ur);
	});
	var dr = _(lr, 2), fr = (e) => {
		var t = rr(), n = x(t);
		{
			let e = m(() => !A(F) || A(K).sending || A(le) || !C() || A(K).completed), t = m(() => i()("postComponent.post"));
			ve(n, {
				variant: "primary",
				shape: "circle",
				contentLayout: "icon",
				className: "editor-submit-button",
				get disabled() {
					return A(e);
				},
				onClick: () => {
					!A(F) || A(K).sending || A(le) || !C() || A(K).completed || vn();
				},
				onfocus: ht,
				get ariaLabel() {
					return A(t);
				},
				children: (e, t) => {
					var n = nr();
					c(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		y(t), f("pointerdown", t, pt, !0), c(e, t);
	};
	o(dr, (e) => {
		A(I) && e(fr);
	}), y($), a($, (e, t) => Dn?.(e, t), () => ({ dragOver: (e) => v(de, e, !0) })), a($, (e) => On?.(e)), a($, (e) => kn?.(e)), a($, (e, t) => An?.(e, t), () => !0), g($, (e) => Ue = e, () => Ue);
	var pr = _($, 2), mr = (e) => {
		xn(e, {});
	};
	o(pr, (e) => {
		A(ge) && e(mr);
	});
	var hr = _(pr, 2), gr = (e) => {
		var t = ir();
		g(t, (e) => v(fe, e), () => A(fe)), w(() => {
			j(t, "accept", X.value ? "image/png,image/jpeg,image/webp,image/gif" : "image/*,video/*"), t.multiple = !X.value;
		}), u("change", t, Xt), c(e, t);
	};
	o(hr, (e) => {
		A(P) && e(gr);
	});
	var _r = _(hr, 2), vr = (e) => {
		var n = ar(), r = h(n, !0);
		w(() => t(r, A(Ne))), c(e, n);
	};
	o(_r, (e) => {
		A(Ne) && e(vr);
	}), y(zn), g(zn, (e) => He = e, () => He);
	var yr = _(zn, 2), br = (e) => {
		{
			let t = m(() => i()("postComponent.warning")), n = m(() => i()("postComponent.secret_key_detected")), r = m(() => i()("postComponent.post")), a = m(() => i()("postComponent.cancel"));
			Jt(e, {
				get open() {
					return A(vt);
				},
				get title() {
					return A(t);
				},
				get description() {
					return A(n);
				},
				get confirmLabel() {
					return A(r);
				},
				get cancelLabel() {
					return A(a);
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
	o(yr, (e) => {
		e(br);
	});
	var xr = _(yr, 2);
	Lt(xr, {
		get src() {
			return A(St);
		},
		get alt() {
			return A(Ct);
		},
		get onClose() {
			return wn;
		},
		get mediaList() {
			return A(Tn);
		},
		get currentIndex() {
			return A(En);
		},
		onNavigate: jn,
		get show() {
			return A(yt);
		},
		set show(e) {
			v(yt, e);
		}
	});
	var Sr = _(xr, 2), Cr = (e) => {
		be(e, {
			get show() {
				return A(wt);
			},
			get x() {
				return A(Et);
			},
			get y() {
				return A(Dt);
			},
			children: (e, n) => {
				var r = or(), i = h(r, !0);
				w(() => t(i, A(Ot))), c(e, r);
			},
			$$slots: { default: !0 }
		});
	};
	o(Sr, (e) => {
		A(wt) && e(Cr);
	}), w((e) => {
		Un = re(zn, 1, "post-container svelte-15ticnd", null, Un, { "editor-auto-grow": A(Ze) }), n(zn, A(Qe)), Xn = re($, 1, "editor-container svelte-15ticnd", null, Xn, {
			"drag-over": A(de),
			"gallery-mode": A(ge),
			sending: A(K).sending || A(B),
			"editor-submit-enabled": A(I),
			"account-avatar-placeholder": A(ze)
		}), j($, "aria-label", e), j($, "aria-readonly", A(K).sending || A(B) ? "true" : void 0), j($, "aria-disabled", void 0);
	}, [() => i()("postComponent.editor_label")]), u("click", $, st), f("keydown", $, ut, !0), u("keydown", $, lt), f("beforeinput", $, ft, !0), f("paste", $, ft, !0), f("cut", $, ft, !0), f("drop", $, ft, !0), c(e, In);
	var wr = ie(Fn);
	return d(), wr;
}
d([
	"click",
	"keydown",
	"change"
]);
export { lr as default };
