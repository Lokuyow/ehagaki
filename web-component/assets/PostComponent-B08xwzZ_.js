import { At as e, B as t, C as n, Ct as r, F as i, G as a, J as o, O as s, Q as c, R as l, U as u, W as d, X as f, Y as p, at as m, ct as h, dt as g, et as _, f as v, ft as y, gt as b, k as x, lt as S, mt as C, n as w, nt as T, o as E, ot as D, r as O, s as ee, t as k, tt as A, ut as j, v as M, w as N, wt as te, yt as P } from "./index-client-Bdka-Daw.js";
import { i as F, n as ne } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { n as I } from "./relayConfigUtils-DD5f1UAM.js";
import { pt as re, t as ie } from "./LoadingPlaceholder-j1_vRYno.js";
import { a as ae, i as L, n as oe, t as R, u as z, v as se } from "./signedEventResultValidator-BsR3Zf_8.js";
import { r as B } from "./authStore.svelte-CoGdd5_Z.js";
import { f as V, m as H } from "./relayStore.svelte-BIc4bQdy.js";
import { Q as ce, c as le, i as ue, l as de } from "./appUtils-Bsk0mFqn.js";
import { n as fe } from "./settingsStore.svelte-D0Ne0wjT.js";
import { C as U, S as pe, _ as me, a as he, b as ge, p as _e, v as ve, x as ye, y as be } from "./uploadStore.svelte-CqQfA1h_.js";
import { c as xe, i as W, n as Se } from "./nip46Service-Dm-_k9SF.js";
import { i as Ce, n as G, r as we, t as Te } from "./postEventBuilder-D_jeb3kI.js";
import { G as Ee, P as De, W as Oe, Y as ke, Z as Ae, _ as K, c as je, nt as Me, s as Ne, t as Pe } from "./nip65RelayDirectory-BZVsYwqc.js";
import { c as Fe } from "./legacyImportMarkers-CZ4J2IrE.js";
import { A as Ie, C as Le, D as Re, E as ze, F as Be, M as Ve, N as He, O as Ue, P as We, S as Ge, T as Ke, a as qe, b as Je, d as Ye, f as Xe, i as Ze, j as Qe, l as $e, n as q, o as et, r as J, s as tt, t as nt, u as rt, w as it, x as at } from "./editorStore.svelte-3FSqdFUX.js";
import { _ as Y, c as ot, g as st, p as ct, t as lt } from "./mediaNodeUtils-DGA0nA_H.js";
import { t as ut } from "./keyboardFocusUtils-Cil9djR5.js";
import { n as dt, r as ft } from "./reactionValue-CpLSKf5v.js";
import { a as pt, c as mt, d as ht, i as gt, l as _t, n as vt, o as yt, r as bt, t as xt, u as St } from "./uploadHelper-D2BVl2B4.js";
import { t as Ct } from "./postMediaCacheRepository-Dch6eFJ-.js";
import { n as wt, t as Tt } from "./fileUtils-D6N6n-4t.js";
import { $ as Et, A as Dt, F as Ot, G as kt, I as At, J as jt, L as X, M as Mt, O as Nt, Q as Pt, X as Ft, a as It, at as Lt, et as Rt, k as zt, lt as Bt, o as Vt, tt as Ht, x as Ut } from "./App-BVcniO1E.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/submittedComposition.ts
var Wt = class {
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
}, Gt = 3e3, Kt = 3e4;
function qt() {
	return {
		authorWrite: !1,
		additional: !1,
		recipients: /* @__PURE__ */ new Set()
	};
}
function Jt(e, t, n = !1, r = !1) {
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
var Yt = class {
	deps;
	rxNostr = null;
	eventSender = null;
	activeNip65Operations = /* @__PURE__ */ new Set();
	operationGeneration = 0;
	constructor(e, t = {}) {
		this.deps = t, e && this.setRxNostr(e), this.deps.console = t.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = t.authStateStore || B, this.deps.hashtagStore = t.hashtagStore || ge, this.deps.mediaFreePlacementStore = t.mediaFreePlacementStore || he, this.deps.mediaGalleryStore = t.mediaGalleryStore || U, this.deps.contentWarningStore = t.contentWarningStore || ve, this.deps.contentWarningReasonStore = t.contentWarningReasonStore || me, this.deps.keyManager = t.keyManager || xe, this.deps.createImetaTagFn = t.createImetaTagFn || yt, this.deps.settingsStore = t.settingsStore || fe, this.deps.writeRelaysStore = t.writeRelaysStore || V, this.deps.replyQuoteState = t.replyQuoteState || Dt, this.deps.getClientTagFn = t.getClientTagFn || (() => W(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = t.seckeySignerFn || se, this.deps.extractContentWithImagesFn = t.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = t.extractContentWithEmojiTagsFn || (t.extractContentWithImagesFn ? (e) => ({
			content: t.extractContentWithImagesFn(e),
			emojiTags: []
		}) : Ve), this.deps.extractImageBlurhashMapFn = t.extractImageBlurhashMapFn || mt, this.deps.resetEditorStateFn = t.resetEditorStateFn || qe, this.deps.resetPostStatusFn = t.resetPostStatusFn || et, this.deps.notificationPort = t.iframeMessageService || t.notificationPort || Lt, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = t.hashtagPinStore || ye, this.deps.saveHashtagsToHistoryFn = t.saveHashtagsToHistoryFn || it, this.deps.clearReplyQuoteFn = t.clearReplyQuoteFn || zt, this.deps.saveSensitivePayloadFn = t.saveSensitivePayloadFn || ((e) => Ne.putCandidate(e));
	}
	setRxNostr(e) {
		this.eventSender && this.cancelActiveNip65Operations(), this.rxNostr = e, this.eventSender = new G(e, this.deps.console || console);
	}
	cancelActiveNip65Operations() {
		this.operationGeneration += 1;
		for (let e of this.activeNip65Operations) e.cancel();
		this.activeNip65Operations.clear();
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
			...await Te.buildEvent(e.processedContent, e.hashtags, e.tags, e.pubkey, e.imageImetaMap, this.deps.createImetaTagFn, this.deps.getClientTagFn, e.contentWarningEnabled, e.contentWarningReason, e.replyQuoteTags, e.channelContext, e.emojiTags, e.failClosedContentWarning, e.publicationKind),
			pubkey: e.pubkey
		};
	}
	async buildNip22ReplyTags(e, t) {
		return ke(e, t);
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
		let t = I.sanitizeExternalRelayUrls(e.result.acceptedRelays), n = I.sanitizeExternalRelayUrls([
			...t,
			...e.additionalWriteRelays ?? [],
			...e.writeRelayHintSnapshot
		], { limit: 3 });
		try {
			await this.deps.savePostHistoryFn({
				event: e.event,
				attestation: e.attestation,
				acceptedRelays: t,
				relayHints: n
			});
		} catch {
			this.deps.console?.warn?.("post_history_save_failed", {
				stage: "post-history",
				reason: "unexpected"
			});
		}
	}
	captureAuthorWriteRelays() {
		return Object.freeze(I.sanitizeExternalRelayUrls([...Object.values(this.rxNostr?.getDefaultRelays() ?? {}).filter((e) => e.write).map((e) => e.url), ...this.deps.writeRelaysStore?.value ?? []]));
	}
	async publishSignedEvent(e) {
		let t = Me(e.event);
		return e.isCurrent?.() === !1 || !t || t.event.pubkey !== e.sessionPubkey ? {
			success: !1,
			error: "post_error"
		} : this.publishNip65Event({
			...e,
			event: t.event
		});
	}
	async publishNip65Event(e) {
		let t = this.eventSender, n = this.rxNostr;
		if (!t || !n) return {
			success: !1,
			error: "nostr_not_ready"
		};
		let r = this.deps.authStateStore, i = r.value, a = this.operationGeneration, o = Date.now(), s = o + Gt, c = o + 12e3, l = o + Kt, u = e.authorWriteRelaySnapshot;
		if (H() && u.length === 0) return {
			success: !1,
			fullyDelivered: !1,
			error: "no_write_relays",
			acceptedRelays: [],
			delivery: {
				authorWrite: Jt([], /* @__PURE__ */ new Map(), !0),
				taggedUserRead: {},
				additional: []
			}
		};
		let d = I.sanitizeExternalRelayUrls([...e.additionalWriteRelays ?? []]), f = Array.from(new Set((e.sensitive?.structureTemplate.tags ?? e.event.tags ?? []).flatMap((e) => {
			if (!Array.isArray(e) || e[0] !== "p") return [];
			let t = e[1];
			return typeof t == "string" && /^[0-9a-f]{64}$/i.test(t) ? [t] : [];
		}))), p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set(), b = Promise.resolve(), x;
		e.event?.pubkey && K(Fe, e.event.pubkey).then((e) => {
			x = e;
		});
		let S, C, w, T = !1, E = /* @__PURE__ */ new Set(), D = [], O = !0, ee = !0, k = !1, A, j = !1, M, N = new AbortController(), te, P = new Promise((e) => {
			te = e;
		}), F, ne = new Promise((e) => {
			F = e;
		}), re = () => {
			ee = !1, O = !1, N.abort();
			for (let e of E) {
				let t = g.get(e);
				!t?.accepted && !t?.rejected && g.set(e, {
					...t,
					unconfirmed: !0,
					...k ? {} : { timedOut: !0 }
				});
			}
			j = !0, F();
		}, ie = setTimeout(re, Math.max(1, l - Date.now())), ae = { cancel: () => {
			ee && (ee = !1, k = !0, O = !1, te());
		} };
		this.activeNip65Operations.add(ae);
		let L = () => {
			if (!ee || j || T || Date.now() >= l) return !1;
			let o = r.value;
			return a !== this.operationGeneration || this.rxNostr !== n || this.eventSender !== t || o !== i || !o.isAuthenticated || o.pubkey !== e.sessionPubkey || e.isCurrent?.() === !1 ? (ae.cancel(), !1) : !0;
		}, oe = (e) => {
			let t = p.get(e);
			return t || (t = qt(), p.set(e, t)), t;
		};
		u.forEach((e) => {
			oe(e).authorWrite = !0;
		}), d.forEach((e) => {
			oe(e).additional = !0;
		});
		let R = () => {
			let t = (e) => [...e].some((e) => g.get(e)?.accepted);
			!((e.sensitive !== void 0 || f.length > 0) && t(u) && f.every((e) => t(m.get(e) ?? [])) && (d.length === 0 || t(d))) || !L() ? (M !== void 0 && clearTimeout(M), M = void 0) : M !== void 0 || N.signal.aborted || (M = setTimeout(() => {
				M = void 0, L() && re();
			}, Math.min(G.DEFAULT_SETTLE_TIMEOUTS.successMs, l - Date.now())));
		}, z = (e, t, n = !0, r = g) => {
			if (j) return;
			n && e.error && (A = e.error);
			let i = new Set(I.sanitizeExternalRelayUrls(e.acceptedRelays)), a = new Map((e.rejectedRelays ?? []).map((e) => [I.normalizeExternalRelayUrl(e.relay) ?? e.relay, e])), o = new Set(I.sanitizeExternalRelayUrls(e.timedOutRelays)), s = new Set(I.sanitizeExternalRelayUrls(e.authRequiredRelays));
			for (let e of t) r.get(e)?.accepted || (i.has(e) ? r.set(e, { accepted: !0 }) : a.has(e) ? r.set(e, {
				rejected: {
					...a.get(e),
					relay: e
				},
				...s.has(e) ? { authRequired: !0 } : {}
			}) : o.has(e) ? r.set(e, {
				timedOut: !0,
				unconfirmed: !0,
				...s.has(e) ? { authRequired: !0 } : {}
			}) : r.set(e, {
				unconfirmed: !0,
				...s.has(e) ? { authRequired: !0 } : {}
			}));
			if (r === _) for (let e of t) {
				let t = _.get(e);
				v.has(e) || g.set(e, t?.accepted ? { unconfirmed: !0 } : { ...t }), t?.accepted && se(e);
			}
			R();
		}, se = (n) => {
			let r = e.sensitive;
			if (!r || y.has(n)) return;
			y.add(n), C ??= n;
			let i = [..._].filter(([, e]) => e.accepted).map(([e]) => e), a = b.then(async () => {
				try {
					await this.deps.saveSensitivePayloadFn?.({
						event: e.event,
						attestation: r.payloadAttestation,
						acceptedRelays: i,
						relayHints: [...p.keys()],
						...typeof x == "number" ? { localWriteScope: {
							ownerPubkeyHex: e.event.pubkey,
							expectedRevision: x,
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
			b = a, S ??= a.then(async () => {
				if (!L()) return null;
				try {
					let e = await r.signStructure(C);
					return L() ? (w = e, e) : null;
				} catch {
					return T = !0, A = "post_error", null;
				}
			});
			let o = (async () => {
				if (await a, !L()) return;
				let e = await S;
				if (!e || !L() || v.has(n)) return;
				v.add(n), g.set(n, { unconfirmed: !0 });
				let r = await t.sendEvent(e, {
					targetRelays: [n],
					includeDefaultWriteRelays: !1,
					waitForAllRelays: !0,
					deadlineAt: Math.min(Date.now() + 12e3, l),
					authDeadlineAt: l,
					settleSignal: N.signal,
					onProgress: (e) => z(e, [n], !1)
				});
				z(r, [n]);
			})().catch(() => {
				A = "post_network_error";
			});
			D.push(o);
		}, B = (n) => {
			for (let r of I.sanitizeExternalRelayUrls(n)) {
				if (!L() || E.has(r)) continue;
				E.add(r);
				let n = t.sendEvent(e.event, {
					targetRelays: [r],
					includeDefaultWriteRelays: !1,
					waitForAllRelays: !0,
					deadlineAt: Math.min(Date.now() + 12e3, l),
					authDeadlineAt: l,
					settleSignal: N.signal,
					onProgress: (e) => z(e, [r], !1, _)
				}).then((e) => z(e, [r], !0, _)).catch(() => z({
					success: !1,
					error: "post_network_error"
				}, [r], !0, _));
				D.push(n);
			}
		}, V = (n) => {
			if (!L() || !O) return;
			if (e.sensitive) {
				B(n);
				return;
			}
			let r = I.sanitizeExternalRelayUrls(n).filter((e) => !E.has(e));
			if (r.length === 0) return;
			r.forEach((e) => E.add(e));
			let i = t.sendEvent(e.event, {
				targetRelays: r,
				includeDefaultWriteRelays: !1,
				waitForAllRelays: !0,
				deadlineAt: c,
				authDeadlineAt: l,
				settleSignal: N.signal,
				onProgress: (e) => z(e, r, !1)
			}).then((e) => z(e, r)).catch(() => {
				A = "post_network_error";
				for (let e of r) g.has(e) || g.set(e, { unconfirmed: !0 });
			});
			D.push(i);
		};
		try {
			let r = I.sanitizeExternalRelayUrls([...u, ...d]);
			if (e.sensitive) r.length === 0 && (A = "no_write_relays"), B(r);
			else {
				r.forEach((e) => E.add(e));
				let n = t.sendEvent(e.event, {
					targetRelays: r,
					includeDefaultWriteRelays: !1,
					waitForAllRelays: f.length > 0,
					deadlineAt: c,
					authDeadlineAt: l,
					settleSignal: N.signal,
					onProgress: (e) => z(e, r, !1)
				}).then((e) => z(e, r)).catch(() => {
					A = "post_network_error";
					for (let e of r) g.has(e) || g.set(e, { unconfirmed: !0 });
				});
				D.push(n);
			}
			let i = f.map(async (t) => {
				try {
					let r = this.deps.nip65ReadRelayLookupFn ? await this.deps.nip65ReadRelayLookupFn(t, {
						discoveryRelays: e.discoveryRelaysByRecipient?.[t],
						deadlineAt: s,
						resolveOnReadRoute: !0
					}) : await Pe(n).lookup(t, {
						discoveryRelays: e.discoveryRelaysByRecipient?.[t],
						deadlineAt: s,
						resolveOnReadRoute: !0
					});
					if (!O || !L()) return;
					let i = I.sanitizeExternalRelayUrls(r.readRelays);
					m.set(t, new Set(i)), h.set(t, i.length > 0 ? "found" : "unavailable"), i.forEach((e) => oe(e).recipients.add(t)), V(i), R();
				} catch {
					O && L() && (m.set(t, /* @__PURE__ */ new Set()), h.set(t, "unavailable"));
				}
			}), a;
			i.length > 0 && await Promise.race([
				Promise.all(i),
				P,
				ne,
				new Promise((e) => {
					a = setTimeout(e, Math.max(1, s - Date.now()));
				})
			]), a !== void 0 && clearTimeout(a), O = !1;
			for (let e of f) h.has(e) || (m.set(e, /* @__PURE__ */ new Set()), h.set(e, k ? "cancelled" : "unavailable"));
			await Promise.race([(async () => {
				let e = 0;
				for (; e < D.length;) {
					let t = D.slice(e);
					e = D.length, await Promise.all(t);
				}
			})(), ne]), re(), await b;
			let o = (t, n = !1, r = !1) => Jt(t, g, n, r || e.sensitive !== void 0 && k), p = o(u, u.length === 0), v = Object.fromEntries(f.map((e) => {
				let t = [...m.get(e) ?? []], n = h.get(e);
				return [e, o(t, n === "unavailable", n === "cancelled")];
			})), y = d.length > 0 ? [o(d)] : [], x = {
				authorWrite: p,
				taggedUserRead: v,
				additional: y
			}, S = I.sanitizeExternalRelayUrls([...g.entries()].filter(([, e]) => e.accepted).map(([e]) => e)), C = [...g.values()].flatMap((e) => e.rejected ? [e.rejected] : []), T = [...g.entries()].filter(([, e]) => e.timedOut).map(([e]) => e), ee = [...g.entries()].filter(([, e]) => e.authRequired).map(([e]) => e), j = S.length > 0, M = p.acceptedRelays.length > 0 && Object.values(v).every((e) => e.acceptedRelays.length > 0) && y.every((e) => e.acceptedRelays.length > 0), te = T.length > 0 || [...g.values()].some((e) => e.unconfirmed), F = j ? void 0 : e.sensitive && [..._.values()].some((e) => e.accepted) ? "postComponent.error.sensitive_partial_publish" : A ?? (te ? "post_timeout" : "post_rejected");
			return {
				success: j,
				fullyDelivered: M,
				...F ? { error: F } : {},
				...j ? { eventId: w?.id ?? e.event.id } : {},
				acceptedRelays: S,
				...C.length ? { rejectedRelays: C } : {},
				...T.length ? { timedOutRelays: T } : {},
				...ee.length ? { authRequiredRelays: ee } : {},
				delivery: x
			};
		} finally {
			j = !0, clearTimeout(ie), M !== void 0 && clearTimeout(M), ae.cancel(), this.activeNip65Operations.delete(ae);
		}
	}
	async sendPreparedEvent(e) {
		this.deps.console?.debug?.("[PostManager] sendPreparedEvent start", { eventKind: e.event?.kind });
		let t = this.eventSender, n = this.rxNostr, r = this.deps.authStateStore.value, i = this.operationGeneration, a = e.signEvent ?? (typeof e.signer?.signEvent == "function" ? e.signer.signEvent.bind(e.signer) : void 0);
		if (e.signer && !a) return this.notifyPostFailure("nostr_sign_event_not_supported");
		let o = () => {
			let a = this.deps.authStateStore.value;
			return a === r && a.isAuthenticated && a.pubkey === e.sessionPubkey && this.rxNostr === n && this.eventSender === t && this.operationGeneration === i;
		}, s = async (t) => {
			if (L(this.deps.authStateStore, e.sessionPubkey), !o()) throw Error("post_event_runtime_changed");
			if (e.signer && !a) throw Error("nostr_sign_event_not_supported");
			let n = R(t), r = a ? await a(n.signerTemplate) : t;
			if (!o()) throw Error("post_event_session_changed");
			let i = oe(n.expectedTemplate, r, e.sessionPubkey), s = Me(i);
			if (!s) throw Error("post_error");
			return s;
		}, c = e.splitSensitiveContent && e.event.tags.some((e) => e[0] === "content-warning"), l = null, u;
		try {
			u = await s(c ? Oe(e.event.kind, e.event.content, e.sessionPubkey, e.event.created_at) : e.event);
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
					let n = await s(Ee(e.event, u.event.id, t));
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
		return we.validatePost(e, t.value.isAuthenticated, !!this.rxNostr);
	}
	async submitPost(e, t, n = []) {
		let r = Ce(e), i = this.deps.settingsStore.quoteNotificationEnabled, a = this.deps.replyQuoteService?.extractInlineQuoteTags?.(r, i) ?? new Ut().extractInlineQuoteTags(r, i), o = this.deps.replyQuoteState.value;
		if (o.quotes.length > 0) {
			let e = this.deps.replyQuoteService || new Ut(), t = new Set(a.filter((e) => e[0] === "q").map((e) => e[1])), n = o.quotes.filter((e) => !t.has(e.eventId)).map((t) => e.generateNostrUri(t.eventId, t.relayHints, t.authorPubkey));
			n.length > 0 && (r = `${r.trimEnd()}\n${n.join("\n")}`.trim());
		}
		let s = this.validatePost(r);
		if (!s.valid) return this.notifyPostFailure(s.error);
		if (!this.eventSender) return this.notifyPostFailure("nostr_not_ready");
		try {
			let e = this.deps.authStateStore, i = ae(e), o = this.deps.hashtagStore, { hashtags: s, tags: c } = this.getHashtagArrays(o), l = this.deps.keyManager, u = this.deps.window || (typeof window < "u" ? window : void 0), d = this.deps.contentWarningStore.value, f = this.deps.contentWarningReasonStore.value, p = this.deps.settingsStore.failClosedContentWarning === !0, m = this.deps.channelContextState?.value ?? null, h = Object.freeze(I.sanitizeExternalRelayUrls(m?.channelRelays)), g = this.captureAuthorWriteRelays();
			if (H() && g.length === 0) return this.notifyPostFailure("no_write_relays");
			let _ = I.sanitizeExternalRelayUrls(this.deps.writeRelaysStore?.value ?? []), v = this.deps.replyQuoteState.value, y, b = this.getReplyQuoteNotifyOptions(), x = v.reply?.referencedEvent ?? null;
			if (v.reply && !m && (!x || x.id !== v.reply.eventId || ![1, 1111].includes(x.kind) || v.reply.authorPubkey && x.pubkey !== v.reply.authorPubkey)) return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
			let S = Ae({
				channel: !!m,
				hasReply: !!v.reply,
				...x ? { replyKind: x.kind } : {}
			});
			if (S === null) return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
			if (v.reply || v.quotes.length > 0) {
				let e = this.deps.replyQuoteService || new Ut();
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
			let C = {}, w = (e, t, n) => {
				e && n.some((t) => t[0] === "p" && t[1] === e) && (C[e] = I.sanitizeExternalRelayUrls([...C[e] ?? [], ...t]));
			}, T = this.deps.replyQuoteService || new Ut();
			v.reply && w(v.reply.authorPubkey, v.reply.relayHints, T.buildReplyTags(v.reply));
			for (let e of v.quotes) e.quoteNotificationEnabled && w(e.authorPubkey, e.relayHints, T.buildQuoteTags(e, !0));
			if (a.length > 0) {
				y ||= [];
				let e = new Set(y.filter((e) => e[0] === "q").map((e) => e[1])), t = new Set(y.filter((e) => e[0] === "p").map((e) => e[1]));
				for (let n of a) n[0] === "q" && !e.has(n[1]) ? (y.push(n), e.add(n[1])) : n[0] === "p" && !t.has(n[1]) && (y.push(n), t.add(n[1]));
			}
			let E = e.value;
			if (E.type === "nip07" && l.isWindowNostrAvailable() && u?.nostr) try {
				let e = E.pubkey;
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
			if (E.type === "nip46") try {
				let e = E.pubkey;
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
			if (E.type === "parentClient") {
				let e = this.deps.getParentClientSignerFn?.();
				if (!e) return this.notifyPostFailure("parent_client_signer_not_available");
				let a = E.pubkey;
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
			let D = l.getFromStore() || l.loadFromStorage(E.pubkey);
			if (!D) return this.notifyPostFailure("key_not_found");
			let O = await this.buildSubmissionEvent({
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
			}), ee = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(D) : se(D);
			return await this.sendPreparedEvent({
				event: O,
				sessionPubkey: i,
				hashtags: s,
				rqNotifyOptions: b,
				signer: ee,
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
		if (t === ge) try {
			let e = be();
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
			m: St(e),
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
function Xt(e) {
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
			Ot("ownership"), a("ownership");
			return;
		}
		let o = e.getEditor();
		!t && n && o && !o.isDestroyed && (t = {
			token: n.sessionToken,
			editor: o,
			auth: e.getAuth(),
			runtime: e.getRuntime(),
			environment: e.getEnvironment?.(),
			ownedIds: /* @__PURE__ */ new Set()
		}, e.onChange());
	}, s = At((e, t) => o(e, t));
	return {
		sync: o,
		getContext() {
			return {
				items: e.getItems(),
				ownedItemIds: t?.ownedIds ?? /* @__PURE__ */ new Set()
			};
		},
		getInputMode() {
			return dt(this.getContext());
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
					s.isCurrent() && (t.forEach((e) => r.ownedIds.add(e.placeholderId)), e.onChange());
				}
			};
			return n = s, s;
		},
		endUpload(t) {
			n === t && (n = null, e.onChange());
		},
		dispose() {
			t && X.value?.sessionToken === t.token && Ot("ownership"), a("ownership"), s();
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postUploadUtils.ts
function Zt(e) {
	return !!e && e.length > 0;
}
function Qt(e, t, n) {
	e.isUploading = t, n !== void 0 && (e.uploadErrorMessage = n);
}
function $t(e) {
	let t = e.target;
	return t?.files?.length ? t.files : void 0;
}
function en({ getCurrentEditor: e, getFileInput: t, getImageOxMap: n, getImageXMap: r, getUploadFailedText: i, updateUploadState: a, setUploadErrorMessage: o, uploadFiles: s }) {
	let c = async (c) => Zt(c) ? await s({
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
			let t = $t(e);
			t && c(t);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/postUIStore.svelte.ts
var Z = y({
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
}), tn;
function nn() {
	tn !== void 0 && (clearTimeout(tn), tn = void 0);
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
		nn(), Z.floatingMessageX = e, Z.floatingMessageY = t, Z.floatingMessageText = n, Z.showFloatingMessage = !0, tn = setTimeout(() => {
			Z.showFloatingMessage = !1, tn = void 0;
		}, r);
	},
	hideFloatingMessage: () => {
		nn(), Z.showFloatingMessage = !1;
	}
}, rn = a("<img draggable=\"false\"/>"), an = a("<div class=\"video-wrapper svelte-aw59wn\"><video controls=\"\" playsinline=\"\" autoplay=\"\" loop=\"\" preload=\"metadata\" class=\"gallery-video svelte-aw59wn\" draggable=\"false\"><track kind=\"captions\"/></video>  <div class=\"video-drag-overlay svelte-aw59wn\" aria-hidden=\"true\"></div></div>", 2), on = a("<div role=\"listitem\"><div class=\"gallery-item-media svelte-aw59wn\"><!> <!> <!></div> <!></div>"), sn = {
	hash: "svelte-aw59wn",
	code: ".gallery-item.svelte-aw59wn,\n    .gallery-item-media.svelte-aw59wn,\n    .video-wrapper.svelte-aw59wn {position:relative;}.gallery-item.svelte-aw59wn,\n    .gallery-item-media.svelte-aw59wn,\n    .gallery-image.svelte-aw59wn,\n    .gallery-video.svelte-aw59wn {-webkit-touch-callout:none;}.gallery-item.svelte-aw59wn,\n    .gallery-image.svelte-aw59wn,\n    .gallery-video.svelte-aw59wn {-webkit-user-select:none;user-select:none;}.gallery-item.svelte-aw59wn,\n    .video-drag-overlay.svelte-aw59wn {cursor:grab;}.gallery-item.svelte-aw59wn:active,\n    .video-drag-overlay.svelte-aw59wn:active {cursor:grabbing;}.gallery-item.is-disabled.svelte-aw59wn,\n    .gallery-item.is-disabled.svelte-aw59wn .gallery-item-media:where(.svelte-aw59wn),\n    .gallery-item.is-disabled.svelte-aw59wn .video-drag-overlay:where(.svelte-aw59wn) {cursor:not-allowed;}.gallery-item.is-disabled.svelte-aw59wn {opacity:0.72;}.gallery-item.svelte-aw59wn {display:inline-flex;flex-shrink:0;overflow:visible;transition:transform 0.15s ease,\n            opacity 0.15s ease;.circle {width:40px;height:40px;}}.gallery-item-media.svelte-aw59wn {border-radius:6px;overflow:hidden;display:flex;align-items:center;justify-content:center;}.gallery-item-media[role=\"button\"].svelte-aw59wn {cursor:pointer;background-color:transparent;}.gallery-image.svelte-aw59wn,\n    .gallery-video.svelte-aw59wn {object-fit:cover;display:block;}.gallery-image.svelte-aw59wn {min-width:100px;max-width:180px;height:180px;-webkit-drag:none;&.image-loading {opacity:0;}}.video-wrapper.svelte-aw59wn,\n    .gallery-video.svelte-aw59wn {width:180px;height:180px;}.video-drag-overlay.svelte-aw59wn {position:absolute;inset:0 0 50px;z-index:1;}\n\n    @media (hover: none) and (pointer: coarse) {.video-drag-overlay.svelte-aw59wn {display:none;}\n    }"
};
function cn(t, i) {
	te(i, !0), x(t, sn);
	let a = () => ee(re, "$_", o), [o, s] = E(), d = O(i, "disabled", 3, !1), y = b(void 0), S = b(void 0), w = ze();
	Ke(() => _(y), { onLongPress: (e, t) => {
		d() || i.onTouchDragStart?.(i.index, e, t);
	} });
	let T = P(() => !i.item.isPlaceholder && i.item.type === "image" && !!i.item.src), D = P(() => !i.item.isPlaceholder && i.item.type === "video" && !!i.item.src), k = P(() => {
		if (!i.item.isPlaceholder) return;
		let e = i.item.dimensions;
		if (e && e.width > 0 && e.height > 0) {
			let t = e.width / e.height, n = Math.round(180 * t);
			return `width: ${Math.max(100, Math.min(180, n))}px; height: 180px;`;
		}
		return "width: 180px; height: 180px;";
	});
	function A() {
		i.item.isPlaceholder || i.item.type !== "image" || Q.showImageFullscreen(i.item.src, i.item.alt || "", i.item.id);
	}
	function j(e) {
		if (d()) e.preventDefault();
		else {
			if (_(y) && e.dataTransfer) {
				let t = _(y).getBoundingClientRect(), n = e.clientX - t.left, r = e.clientY - t.top;
				e.dataTransfer.setDragImage(_(y), n, r);
			}
			i.onDragStart(i.index, e);
		}
	}
	function F(e) {
		e.stopPropagation(), _(S) && (_(S).paused ? _(S).play() : _(S).pause());
	}
	function ne(e) {
		e.preventDefault(), !d() && i.onDragOver(i.index, e);
	}
	function I(e) {
		e.preventDefault(), !d() && i.onDrop(i.index);
	}
	function ae(e) {
		i.item.type !== "image" || i.item.isPlaceholder || (e.key === "Enter" || e.key === " " || e.key === "Spacebar") && (e.preventDefault(), A());
	}
	var L = on();
	let oe;
	var R = h(L), z = h(R), se = (e) => {
		{
			let t = P(() => i.item.type === "video" ? a()("videoNode.uploading") : a()("imageNode.uploading"));
			ie(e, {
				get text() {
					return _(t);
				},
				showLoader: !0
			});
		}
	};
	l(z, (e) => {
		i.item.isPlaceholder && e(se);
	});
	var B = g(z, 2), V = (e) => {
		var t = rn();
		let n;
		m(() => {
			M(t, "src", i.item.src), M(t, "alt", i.item.alt || ""), n = N(t, 1, "gallery-image svelte-aw59wn", null, n, { "image-loading": !w.isLoaded });
		}), f("load", t, function(...e) {
			w.handleLoad?.apply(this, e);
		}), f("error", t, function(...e) {
			w.handleError?.apply(this, e);
		}), p("contextmenu", t, (e) => e.preventDefault()), c(t), u(e, t);
	};
	l(B, (e) => {
		_(T) && e(V);
	});
	var H = g(B, 2), ce = (t) => {
		var n = an(), r = h(n);
		r.muted = !0, v(r, (e) => C(S, e), () => _(S));
		var a = g(r, 2);
		e(n), m(() => {
			M(r, "src", i.item.src), M(a, "draggable", !d());
		}), p("contextmenu", r, (e) => e.preventDefault()), f("dragstart", a, j), p("click", a, F), u(t, n);
	};
	l(H, (e) => {
		_(D) && e(ce);
	}), e(R);
	var le = g(R, 2), ue = (e) => {
		{
			let t = P(() => a()("imageContextMenu.delete")), n = P(() => a()("imageContextMenu.copyUrl")), r = P(() => a()("imageContextMenu.copySuccess"));
			Re(e, {
				get src() {
					return i.item.src;
				},
				onDelete: () => i.onDelete(i.item.id),
				get deleteAriaLabel() {
					return _(t);
				},
				get copyAriaLabel() {
					return _(n);
				},
				get copySuccessMessage() {
					return _(r);
				},
				layout: "gallery",
				get deleteDisabled() {
					return d();
				}
			});
		}
	};
	l(le, (e) => {
		i.item.isPlaceholder || e(ue);
	}), e(L), v(L, (e) => C(y, e), () => _(y)), m(() => {
		oe = N(L, 1, "gallery-item svelte-aw59wn", null, oe, {
			"is-placeholder": i.item.isPlaceholder,
			"is-disabled": d()
		}), M(L, "draggable", !d() && (i.item.type !== "video" || i.item.isPlaceholder)), n(R, _(k)), M(R, "role", i.item.type === "image" && !i.item.isPlaceholder ? "button" : void 0), M(R, "tabindex", i.item.type === "image" && !i.item.isPlaceholder ? 0 : void 0), M(R, "aria-label", i.item.alt || i.item.src);
	}), f("dragstart", L, j), f("dragover", L, ne), f("drop", L, I), f("dragend", L, () => i.onDragEnd()), p("click", R, function(...e) {
		(i.item.type === "image" && !i.item.isPlaceholder ? A : void 0)?.apply(this, e);
	}), p("keydown", R, ae), u(t, L), r(), s();
}
o([
	"click",
	"keydown",
	"contextmenu"
]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/mediaGalleryWheelUtils.ts
function ln(e) {
	return Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
}
function un(e, t) {
	let n = e.scrollHeight - e.clientHeight;
	if (n <= 1) return !1;
	let r = e.scrollTop <= 0, i = e.scrollTop >= n - 1;
	return t > 0 ? !i : t < 0 && !r;
}
function dn(e, t) {
	let n = e.scrollWidth - e.clientWidth;
	if (n <= 1) return !1;
	let r = e.scrollLeft <= 0, i = e.scrollLeft >= n - 1;
	return t > 0 ? !i : t < 0 && !r;
}
function fn(e, t, n = null) {
	if (n && un(n, t.deltaY)) return !1;
	let r = ln(t);
	if (!dn(e, r)) return !1;
	let i = Math.max(0, e.scrollWidth - e.clientWidth);
	return e.scrollLeft = Math.min(i, Math.max(0, e.scrollLeft + r)), !0;
}
// D:/ドキュメント/GitHub/ehagaki/src/components/MediaGallery.svelte
var pn = a("<div><!></div>"), mn = a("<div role=\"list\"></div>"), hn = {
	hash: "svelte-w2vv8k",
	code: ".media-gallery.svelte-w2vv8k {display:flex;align-items:center;width:100%;min-height:180px;overflow-x:auto;overflow-y:visible;scrollbar-width:thin;gap:4px;background-color:var(--window);}.media-gallery.sending.svelte-w2vv8k {background-color:color-mix(\n            in srgb,\n            var(--window) 82%,\n            var(--surface-button) 18%\n        );cursor:not-allowed;}.media-gallery.sending.svelte-w2vv8k .gallery-item {cursor:not-allowed;}.gallery-item-wrapper.svelte-w2vv8k {position:relative;display:inline-flex;align-items:center;width:fit-content;height:fit-content;}\n\n    /* 挿入位置インジケーターバー */.gallery-item-wrapper.insert-bar-left.svelte-w2vv8k::before,\n    .gallery-item-wrapper.insert-bar-right.svelte-w2vv8k::after {content:\"\";position:absolute;top:0;bottom:0;width:8px;background:var(--theme, #2196f3);border-radius:4px;z-index:10;pointer-events:none;}.gallery-item-wrapper.insert-bar-left.svelte-w2vv8k::before {left:-5px;}.gallery-item-wrapper.insert-bar-right.svelte-w2vv8k::after {right:-5px;}\n\n    @media (hover: none) and (pointer: coarse) {.media-gallery.svelte-w2vv8k {scrollbar-width:none;}.media-gallery.svelte-w2vv8k::-webkit-scrollbar {display:none;}\n    }"
};
function gn(t, n) {
	te(n, !0), x(t, hn);
	let a = () => ee(re, "$_", o), [o, s] = E(), c = b(-1), p = b(-1), g = b(-1), y = b(-1), w = null, T = 60, O = 60, k = b(void 0), A = null, j = P(() => U.items), F = P(() => J.postStatus.sending), I = P(() => {
		let e = _(c) === -1 ? _(g) : _(c), t = _(c) === -1 ? _(y) : _(p);
		return e === -1 || t === -1 || t === e || t === e + 1 ? -1 : t;
	});
	function ie(e, t) {
		_(F) ? t.preventDefault() : (C(c, e, !0), t.dataTransfer?.setData("text/plain", String(e)), t.dataTransfer && (t.dataTransfer.effectAllowed = "move"));
	}
	function ae(e, t) {
		if (t.preventDefault(), _(F)) return;
		let n = _(k)?.querySelectorAll(".gallery-item-wrapper")?.[e];
		if (n) {
			let r = n.getBoundingClientRect();
			C(p, t.clientX < r.left + r.width / 2 ? e : e + 1, !0);
		} else C(p, e, !0);
	}
	function L() {
		V(), C(c, -1), C(p, -1);
	}
	function oe(e) {}
	function R(e) {
		if (_(c) === -1) return;
		if (e.preventDefault(), _(F)) {
			V(), C(p, -1);
			return;
		}
		let t = _(k)?.querySelectorAll(".gallery-item-wrapper");
		if (t && t.length > 0) {
			let n = t[0].getBoundingClientRect(), r = t[t.length - 1].getBoundingClientRect();
			e.clientX < n.left ? C(p, 0) : e.clientX > r.right && C(p, _(j).length, !0);
		}
		if (_(k)) {
			let t = _(k).getBoundingClientRect();
			e.clientX - t.left < 100 ? B("left", e.clientX) : t.right - e.clientX < 100 ? B("right", e.clientX) : V();
		}
	}
	function z(e) {
		if (e.preventDefault(), V(), _(F)) {
			C(c, -1), C(p, -1);
			return;
		}
		let t = _(p);
		if (_(c) !== -1 && t !== -1 && t !== _(c) && t !== _(c) + 1) {
			let e = _(c) < t ? t - 1 : t;
			U.reorderItems(_(c), e);
		}
		C(c, -1), C(p, -1);
	}
	function se(e) {
		_(F) || U.removeItem(e);
	}
	function B(e, t) {
		if (!_(k)) return;
		A !== null && (cancelAnimationFrame(A), A = null);
		let n = _(k).getBoundingClientRect(), r = e === "left" ? t - n.left : n.right - t, i = 1 + 9 * (1 - Math.max(0, Math.min(1, r / 100))), a = () => {
			if (!_(k)) return;
			let t = _(k).scrollWidth - _(k).clientWidth;
			e === "left" && _(k).scrollLeft > 0 ? (_(k).scrollLeft = Math.max(0, _(k).scrollLeft - i), A = requestAnimationFrame(a)) : e === "right" && _(k).scrollLeft < t ? (_(k).scrollLeft = Math.min(t, _(k).scrollLeft + i), A = requestAnimationFrame(a)) : A = null;
		};
		A = requestAnimationFrame(a);
	}
	function V() {
		A !== null && (cancelAnimationFrame(A), A = null);
	}
	function H(e, t, n) {
		if (_(F)) return;
		C(g, e, !0), ue();
		let r = _(k)?.querySelectorAll(".gallery-item-wrapper")[e];
		if (r) {
			let e = r.getBoundingClientRect(), i = Math.min(120 / e.width, 120 / e.height);
			T = e.width * i / 2, O = e.height * i / 2, w = r.cloneNode(!0), w.style.cssText = `
                position: fixed;
                left: ${t - T}px;
                top: ${n - O}px;
                width: ${e.width}px;
                height: ${e.height}px;
                transform-origin: top left;
                transform: scale(${i});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, ne().overlayTarget.appendChild(w);
		}
		document.addEventListener("touchmove", ce, { passive: !1 }), document.addEventListener("touchend", le, { passive: !1 });
	}
	function ce(e) {
		if (_(g) === -1 || e.touches.length !== 1) return;
		if (e.preventDefault(), _(F)) {
			V(), C(y, -1);
			return;
		}
		let t = e.touches[0];
		w && (w.style.left = `${t.clientX - T}px`, w.style.top = `${t.clientY - O}px`), w && (w.style.display = "none");
		let n = document.elementFromPoint(t.clientX, t.clientY);
		w && (w.style.display = "");
		let r = n?.closest(".gallery-item-wrapper");
		if (r && _(k)) {
			let e = _(k).querySelectorAll(".gallery-item-wrapper"), n = Array.from(e).indexOf(r);
			if (n !== -1) {
				let e = r.getBoundingClientRect();
				C(y, t.clientX < e.left + e.width / 2 ? n : n + 1, !0);
			}
		} else if (_(k)) {
			let e = _(k).querySelectorAll(".gallery-item-wrapper");
			if (e.length > 0) {
				let n = e[0].getBoundingClientRect(), r = e[e.length - 1].getBoundingClientRect();
				t.clientX <= n.left ? C(y, 0) : t.clientX >= r.right && C(y, _(j).length, !0);
			}
		}
		if (_(k)) {
			let e = _(k).getBoundingClientRect();
			t.clientX - e.left < 100 ? B("left", t.clientX) : e.right - t.clientX < 100 ? B("right", t.clientX) : V();
		}
	}
	function le() {
		if (document.removeEventListener("touchmove", ce), document.removeEventListener("touchend", le), V(), _(F)) {
			ue(), C(g, -1), C(y, -1);
			return;
		}
		let e = _(y);
		if (_(g) !== -1 && e !== -1 && e !== _(g) && e !== _(g) + 1) {
			let t = _(g) < e ? e - 1 : e;
			U.reorderItems(_(g), t);
		}
		ue(), C(g, -1), C(y, -1);
	}
	function ue() {
		w &&= (w.remove(), null);
	}
	function de(e) {
		if (!_(k)) return;
		let t = _(k).closest(".composer-scroll-region");
		fn(_(k), e, t instanceof HTMLElement ? t : null) && e.preventDefault();
	}
	D(() => {
		if (_(k)) return _(k).addEventListener("wheel", de, { passive: !1 }), () => {
			_(k)?.removeEventListener("wheel", de);
		};
	});
	var fe = d(), pe = S(fe), me = (t) => {
		var n = mn();
		let r;
		i(n, 23, () => _(j), (e) => e.id, (t, n, r) => {
			var i = pn();
			let a;
			cn(h(i), {
				get item() {
					return _(n);
				},
				get index() {
					return _(r);
				},
				onDelete: se,
				onDragStart: ie,
				onDragOver: ae,
				onDragEnd: L,
				onDrop: oe,
				onTouchDragStart: H,
				get disabled() {
					return _(F);
				}
			}), e(i), m(() => a = N(i, 1, "gallery-item-wrapper svelte-w2vv8k", null, a, {
				"insert-bar-left": _(I) === _(r),
				"insert-bar-right": _(I) === _(j).length && _(r) === _(j).length - 1
			})), u(t, i);
		}), e(n), v(n, (e) => C(k, e), () => _(k)), m((e) => {
			r = N(n, 1, "media-gallery svelte-w2vv8k", null, r, { sending: _(F) }), M(n, "aria-label", e);
		}, [() => a()("mediaGallery.aria_label") || "メディアギャラリー"]), f("dragover", n, R), f("drop", n, z), u(t, n);
	};
	l(pe, (e) => {
		_(j).length > 0 && e(me);
	}), u(t, fe), r(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/editorDomActions.svelte.ts
function _n(e) {
	if (!e || !e.types) return !1;
	try {
		return Array.from(e.types).some((e) => e === "application/x-tiptap-node");
	} catch {
		return !1;
	}
}
function vn(e) {
	if (!e) return !1;
	try {
		return Array.from(e.types).includes("Files") || e.files && e.files.length > 0;
	} catch {
		return !!(e.files && e.files.length > 0);
	}
}
function yn(e) {
	let t = e.__postStatus;
	return (typeof t == "function" ? t() : t)?.sending === !0;
}
function bn(e) {
	return typeof e.__uploadFiles == "function";
}
function xn(e) {
	let t = b(!1);
	function n(n) {
		if (yn(e) || !bn(e)) {
			n.preventDefault(), C(t, !1), e.classList.remove("drag-over");
			return;
		}
		let r = n.dataTransfer, i = _n(r);
		vn(r) && !i ? (n.preventDefault(), _(t) || (C(t, !0), e.classList.add("drag-over"))) : _(t) && (C(t, !1), e.classList.remove("drag-over"));
	}
	function r(n) {
		_(t) && (C(t, !1), e.classList.remove("drag-over"));
	}
	async function i(n) {
		if (C(t, !1), e.classList.remove("drag-over"), yn(e) || !bn(e)) {
			n.preventDefault();
			return;
		}
		let r = n.dataTransfer;
		if (!_n(r) && r?.files && r.files.length > 0) {
			let t = e;
			typeof t.__uploadFiles == "function" && (n.preventDefault(), t.__uploadFiles(r.files));
		}
	}
	return e.addEventListener("dragover", n), e.addEventListener("dragleave", r), e.addEventListener("drop", i), { destroy() {
		e.removeEventListener("dragover", n), e.removeEventListener("dragleave", r), e.removeEventListener("drop", i);
	} };
}
function Sn(e, t) {
	let n = xn(e);
	function r(n) {
		if (yn(e) || !bn(e)) {
			n.preventDefault(), t.dragOver(!1);
			return;
		}
		let r = n.dataTransfer, i = _n(r);
		vn(r) && !i ? t.dragOver(!0) : t.dragOver(!1);
	}
	function i(e) {
		t.dragOver(!1);
	}
	function a(n) {
		t.dragOver(!1), (yn(e) || !bn(e)) && n.preventDefault();
	}
	return e.addEventListener("dragover", r), e.addEventListener("dragleave", i), e.addEventListener("drop", a), { destroy() {
		n?.destroy?.(), e.removeEventListener("dragover", r), e.removeEventListener("dragleave", i), e.removeEventListener("drop", a);
	} };
}
function Cn(e) {
	function t(t) {
		if (yn(e)) {
			t.preventDefault();
			return;
		}
		if (!t.clipboardData) return;
		if (!bn(e)) {
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
function wn(e) {
	function t(e) {
		let t = e.target;
		if (t && (t.closest(".editor-image-button[data-dragging=\"true\"]") || t.closest(".custom-emoji-drag-target[data-dragging=\"true\"]"))) {
			let t = e.touches[0], n = ct.querySelector(".tiptap-editor");
			if (n) {
				let r = n.getBoundingClientRect(), i = t.clientY < r.top + 120, a = t.clientY > r.bottom - 120;
				if (!i && !a) return e.preventDefault(), !1;
			}
		}
	}
	function n(e) {
		let t = ct.querySelectorAll(".drop-zone-indicator");
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
function Tn(e, t = !0) {
	function n(n) {
		if (t && (n.ctrlKey || n.metaKey) && (n.key === "Enter" || n.key === "NumpadEnter")) {
			n.preventDefault();
			let t = e, r = t.__currentEditor, i = typeof r == "function" ? r() : r, a = t.__hasPostingCapability, o = typeof a == "function" ? a() : a, s = t.__hasStoredKey, c = typeof s == "function" ? s() : s, l = t.__postStatus, u = typeof l == "function" ? l() : l, d = i ? Qe(i) : "";
			!u?.sending && d.trim() && (o ?? c) && t.__submitPost?.();
		}
	}
	return e.addEventListener("keydown", n), { destroy() {
		e.removeEventListener("keydown", n);
	} };
}
function En(e) {
	let t = !1;
	return e?.descendants((e) => {
		if (t) return !1;
		let n = e.type.name;
		(n === "image" || n === "video") && (t = !0);
	}), t;
}
function Dn(e) {
	let { currentEditor: t, editorContainerEl: n, callbacks: r } = e, i = (e) => {
		let n = e.detail.plainText, i = t ? En(t.state?.doc) : !1;
		r.onContentUpdate?.(n, i);
	}, a = (e) => {
		let t = e;
		r.onImageFullscreenRequest?.(t.detail.src, t.detail.alt || "", t.detail.mediaId);
	}, o = (e) => {
		let n = e?.detail?.pos;
		if (n != null && t && t.view) {
			try {
				"ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
				let e = We.create(t.state.doc, n);
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
function On(e, t) {
	window.removeEventListener("editor-content-changed", e.handleContentUpdate), window.removeEventListener("image-fullscreen-request", e.handleImageFullscreenRequest), window.removeEventListener("select-image-node", e.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", e.handleImageFullscreenRequest), t.removeEventListener("select-image-node", e.handleSelectImageNode));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postComponentUtils.ts
function kn() {
	return {
		sending: !0,
		success: !1,
		error: !1,
		message: "",
		completed: !1
	};
}
function An(e) {
	return {
		sending: !1,
		success: !0,
		error: !1,
		message: e?.fullyDelivered === !1 || (e?.rejectedRelays?.length ?? 0) > 0 || (e?.timedOutRelays?.length ?? 0) > 0 || (e?.authRequiredRelays?.length ?? 0) > 0 || e?.delivery?.authorWrite?.status !== void 0 && e.delivery.authorWrite.status !== "delivered" || Object.values(e?.delivery?.taggedUserRead ?? {}).some((e) => e.status !== "delivered") || (e?.delivery?.additional ?? []).some((e) => e.status !== "delivered") ? "postComponent.post_partial_success" : "postComponent.post_success",
		completed: !0
	};
}
function jn(e) {
	return {
		sending: !1,
		success: !1,
		error: !0,
		message: e || "postComponent.post_error",
		completed: !1
	};
}
function Mn({ updatePostStatus: e, clearContentAfterSuccess: t, onPostSuccess: n }) {
	return {
		markSending: () => {
			e(kn());
		},
		markSuccess: (r) => {
			e(An(r)), r?.preserveComposerContent || (t(), n?.(r));
		},
		markFailure: (t) => {
			e(jn(t));
		}
	};
}
async function Nn(e) {
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
function Pn(e) {
	return e.dimensions && e.dimensions.width > 0 && e.dimensions.height > 0 ? {
		width: e.dimensions.width,
		height: e.dimensions.height
	} : ot(e.dim) || {};
}
function Fn(e) {
	if (!e.mediaFreePlacement) return e.galleryItems.filter((e) => !e.isPlaceholder).map((e) => {
		let t = Pn({
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
			let n = Pn({ dim: e.attrs.dim });
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
	}), e.includeTemporaryGallery ? [...t, ...Fn({
		...e,
		mediaFreePlacement: !1
	})] : t;
}
function In(e, t, n) {
	if (t) {
		let n = e.findIndex((e) => e.id === t);
		if (n >= 0) return n;
	}
	return n ? e.findIndex((e) => e.src === n) : -1;
}
function Ln(e, t) {
	return e[t];
}
function Rn(e) {
	let t = [];
	return e.state.doc.descendants((e, n) => {
		e.type.name !== "image" && e.type.name !== "video" || e.attrs.isPlaceholder || t.push({
			node: e,
			pos: n
		});
	}), t;
}
function zn(e) {
	let t = Rn(e.currentEditor);
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
function Bn(e) {
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
async function Vn(e) {
	let { input: t, postHistoryRepositoryImpl: n = je, postMediaCacheRepositoryImpl: r = Ct } = e;
	await n.putPostedEvent(t);
	let i = De(t.event).map((e) => e.url).filter(Boolean);
	i.length !== 0 && await r.linkEventIdByUrls({
		eventId: t.event.id,
		urls: i
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/editorLifecycle.ts
function Hn(e) {
	let { placeholderText: t, editorContainerEl: n, hasStoredKey: r, hasPostingCapability: i, submitPost: a, onCustomEmojiSelect: o, getCustomEmojiItems: s, enterKeyBehavior: c, hostOwnedLite: l, submitShortcuts: u, uploadFiles: d, eventCallbacks: f } = e;
	Ze.value = t;
	let p = Je({
		isReactionMode: e.isReactionMode,
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
	}), g = Dn({
		currentEditor: m,
		editorContainerEl: n,
		callbacks: f
	});
	return tt(a), n && Object.assign(n, {
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
function Un(e) {
	let { unsubscribe: t, componentUnsubscribe: n, handlers: r, currentEditor: i, editorContainerEl: a, submitPost: o } = e;
	if (On(r, a), q.value === i && q.set(null), nt(o), n(), t(), i && !i.isDestroyed && i.destroy(), a) {
		let e = a;
		delete e.__uploadFiles, delete e.__currentEditor, delete e.__hasStoredKey, delete e.__hasPostingCapability, delete e.__postStatus, delete e.__submitPost;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/customEmojiInsertion.ts
function Wn(e, t) {
	let n = e.view.dom;
	Y() && document.activeElement !== n ? e.commands.insertCustomEmoji(t) : e.chain().focus().insertCustomEmoji(t).run();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hostOwnedUpload.ts
var Gn = /* @__PURE__ */ new Set([
	"alt",
	"blurhash",
	"dim",
	"m",
	"ox",
	"size",
	"x"
]);
function Kn(e) {
	if (typeof e != "string") return !1;
	try {
		let t = new URL(e);
		return t.protocol === "http:" || t.protocol === "https:";
	} catch {
		return !1;
	}
}
function qn(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return {};
	let t = {};
	for (let [n, r] of Object.entries(e)) Gn.has(n) && typeof r == "string" && (t[n] = r);
	return t;
}
function Jn(e) {
	return {
		localStorage: F(),
		crypto: window.crypto.subtle,
		tick: A,
		FileUploadManager: e,
		getImageDimensions: wt,
		extractImageBlurhashMap: mt,
		calculateImageHash: pt,
		getMimeTypeFromUrl: St,
		createImetaTag: yt,
		imageSizeMapStore: pe
	};
}
var Yn = class {
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
function Xn(e) {
	let t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
	return {
		fileUploadManager: Yn,
		async prepareFiles(r, i) {
			let a = new gt(typeof document > "u" ? void 0 : document), o = () => e.signal.aborted || !!i.isUploadAborted?.(), s = new bt(a, i.localStorage, o), c = new ht(i.localStorage, o), l = [];
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
				let d = await Tt(u, i.crypto, o).catch(() => void 0), f = await (u.type.startsWith("video/") ? c : s).compress(u);
				if (f.aborted || e.signal.aborted) throw new DOMException("The host media operation was aborted.", "AbortError");
				let p = f.file.type.startsWith("image/") ? await wt(f.file) : null;
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
					if (!Kn(t?.url)) {
						o.push({
							success: !1,
							error: "host_media_invalid_result"
						});
						continue;
					}
					let r = qn(t.imeta);
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
						...n.get(i) ? { dimensions: n.get(i) } : s.width && s.height ? { dimensions: lt(s.width, s.height) } : {},
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
var Zn = a("<div class=\"editor-account-placeholder svelte-15ticnd\" aria-hidden=\"true\"><!></div>"), Qn = a("<div class=\"plane-icon svg-icon svelte-15ticnd\"></div>"), $n = a("<div class=\"editor-submit-button-container svelte-15ticnd\"><!></div>"), er = a("<input type=\"file\" style=\"display: none;\" class=\"svelte-15ticnd\"/>"), tr = a("<div class=\"upload-error svelte-15ticnd\"> </div>"), nr = a("<div class=\"svelte-15ticnd\"> </div>"), rr = a("<div data-post-editor-root=\"\"><div role=\"textbox\" tabindex=\"-1\"><!> <!> <!></div> <!> <!> <!></div> <!> <!> <!>", 1), ir = {
	hash: "svelte-15ticnd",
	code: ".post-container.svelte-15ticnd,\n  .editor-container.svelte-15ticnd,\n  .editor-content,\n  .tiptap-editor {width:100%;flex:1 1 auto;}.post-container.svelte-15ticnd,\n  .editor-container.svelte-15ticnd,\n  .editor-content {display:flex;flex-direction:column;}.post-container.svelte-15ticnd,\n  .editor-content,\n  .tiptap-editor {min-height:0;}.editor-content,\n  .tiptap-editor {height:100%;}.post-container.svelte-15ticnd {max-width:800px;align-items:stretch;overflow:visible;--post-editor-block-padding: 10px;--post-editor-line-height: 30px;--post-editor-submit-button-size: 40px;--post-editor-submit-button-inline-inset: 14px;}.upload-error.svelte-15ticnd {color:#c62828;font-size:0.9rem;margin-bottom:10px;width:100%;text-align:left;}.editor-container.svelte-15ticnd {min-height:var(--post-editor-min-height, 92px);height:var(--post-editor-target-height, auto);max-height:var(--post-editor-target-height, auto);position:relative;cursor:text;outline:none;background:var(--surface-editor);-webkit-tap-highlight-color:transparent;overflow:hidden;}.post-container.editor-auto-grow.svelte-15ticnd,\n  .post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd),\n  .post-container.editor-auto-grow.svelte-15ticnd .editor-content,\n  .post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {flex:0 0 auto;}.post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd),\n  .post-container.editor-auto-grow.svelte-15ticnd .editor-content,\n  .post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {height:auto;}.post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd) {min-height:0;max-height:none;}.post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {min-height:calc(\n      var(--post-editor-auto-grow-min-lines) + var(--post-editor-block-padding) +\n        var(--post-editor-block-padding)\n    );max-height:calc(\n      var(--post-editor-auto-grow-max-lines) + var(--post-editor-block-padding) +\n        var(--post-editor-block-padding)\n    );}.editor-account-placeholder {position:absolute;top:11px;left:14px;z-index:3;width:28px;height:28px;opacity:0.5;pointer-events:none;user-select:none;-webkit-user-select:none;}.editor-account-placeholder-avatar {display:block;width:100%;height:100%;overflow:hidden;border-radius:50%;}.editor-account-placeholder-image,\n  .editor-account-placeholder-fallback {display:block;width:100%;height:100%;border-radius:50%;}.editor-account-placeholder-image {object-fit:cover;}.editor-container.account-avatar-placeholder.svelte-15ticnd\n    p.is-editor-empty:first-child::before {padding-left:38px;}.editor-container.sending.svelte-15ticnd {background:color-mix(\n      in srgb,\n      var(--surface-editor) 82%,\n      var(--surface-button) 18%\n    );cursor:not-allowed;}.editor-container.sending.svelte-15ticnd .tiptap-editor {cursor:not-allowed;opacity:0.72;}.editor-container.editor-submit-enabled.sending.svelte-15ticnd .tiptap-editor {pointer-events:none;}.editor-container.sending.svelte-15ticnd .editor-image-button,\n  .editor-container.sending.svelte-15ticnd .custom-emoji-drag-target,\n  .editor-container.sending.svelte-15ticnd .media-delete-btn {pointer-events:none;}.editor-container.editor-submit-enabled.svelte-15ticnd .tiptap-editor {padding-inline-end:calc(var(--post-editor-submit-button-inline-inset) + var(--post-editor-submit-button-size));}.editor-submit-button-container.svelte-15ticnd {position:absolute;inset-inline-end:var(--post-editor-submit-button-inline-inset);bottom:var(--post-editor-block-padding);z-index:4;}.post-container.editor-auto-grow.svelte-15ticnd .editor-submit-button-container:where(.svelte-15ticnd) {bottom:calc(\n      var(--post-editor-block-padding) +\n        (var(--post-editor-line-height) - var(--post-editor-submit-button-size)) /\n        2\n    );}.editor-submit-button {width:var(--post-editor-submit-button-size);height:var(--post-editor-submit-button-size);flex:0 0 var(--post-editor-submit-button-size);}button.editor-submit-button .plane-icon.svg-icon {width:22px;height:22px;mask-image:var(--ehagaki-icon-70617065722d706c616e652d736f6c69642d66756c6c2e737667);margin-inline-end:1px;margin-top:1px;}.editor-container.drag-over.svelte-15ticnd {border:3px dashed var(--theme);}\n\n  /* ギャラリーモード時はドロップカーソル（差し込み位置バー）を常に非表示 */.editor-container.gallery-mode.svelte-15ticnd .tiptap-dropcursor {display:none !important;}\n\n  /* Tiptapエディターのスタイル */.tiptap-editor {display:block;padding:var(--post-editor-block-padding);font-family:inherit;font-size:1.25rem;line-height:var(--post-editor-line-height);outline:none;overflow-y:auto;overflow-x:hidden;scroll-padding-bottom:16px;scroll-behavior:auto;will-change:scroll-position;transform:translateZ(0);-webkit-tap-highlight-color:transparent;.editor-paragraph {margin:0;padding:0;color:var(--text);position:relative;z-index:2;word-break:normal;overflow-wrap:anywhere;line-break:loose;white-space:break-spaces;}.hashtag {color:var(--hashtag-text);font-weight:600;background:var(--hashtag-bg);padding:2px 4px;border-radius:4px;word-break:break-all;}.preview-link {color:var(--link);word-break:break-all;}.preview-link:visited {color:var(--link-visited);}p.is-editor-empty:first-child::before {color:var(--text);content:attr(data-placeholder);float:left;height:0;pointer-events:none;opacity:0.6;}.toolbar-caret {display:inline-block;width:0;height:1.5em;margin-left:-1px;border-left:2px solid var(--text);vertical-align:-0.25em;pointer-events:none;\n      animation: svelte-15ticnd-toolbar-caret-blink 1s steps(1) infinite;}}\n\n  @keyframes svelte-15ticnd-toolbar-caret-blink {\n    0%,\n    49% {\n      opacity: 1;\n    }\n    50%,\n    100% {\n      opacity: 0;\n    }\n  }\n\n  /* ドロップゾーンのフェードアウトアニメーション（改善版） */.drop-zone-fade-out {\n    animation: svelte-15ticnd-dropZoneFadeOut 0.3s ease-out forwards;}\n\n  @keyframes svelte-15ticnd-dropZoneFadeOut {\n    from {\n      opacity: 0.9;\n      transform: scale(1);\n    }\n    to {\n      opacity: 0;\n      transform: scale(0.8);\n    }\n  }\n\n  /* タッチデバイス用の追加スタイル */\n  @media (hover: none) and (pointer: coarse) {.editor-container.svelte-15ticnd {-webkit-tap-highlight-color:transparent;will-change:scroll-position;}\n\n    /* ドラッグ中の視覚フィードバック強化 */.editor-image-button[data-dragging=\"true\"] {z-index:1;}.tiptap-editor {-webkit-user-select:text;user-select:text;-webkit-transform:translateZ(0);transform:translateZ(0);backface-visibility:hidden;}\n  }\n\n  /* ProseMirror のギャップカーソルの色を上書き（Light / Dark 対応） */.tiptap-editor .ProseMirror-gapcursor:after,\n  .tiptap-editor .ProseMirror-gapcursor:before {border-top-color:light-dark(black, white);}"
};
function $(i, a) {
	te(a, !0), x(i, ir);
	let o = () => ee(re, "$_", c), [c, d] = E(), A = O(a, "hasPostingCapability", 19, () => a.hasStoredKey), F = O(a, "isSwitchingAccount", 3, !1), I = O(a, "availableComposerHeight", 3, 152), ie = O(a, "minEditorHeight", 3, 152);
	O(a, "hostCustomEmojiItems", 19, () => []);
	let ae = P(() => !0), L = P(() => J.isUploading), oe = P(() => J.canPost), R = P(() => !1), se = b(null), V = b(null), H = b(null), fe = b(!1), ge = b(!1), xe = b(void 0), W = b(void 0), Ce = !1, G = b(y({})), we = b(y({})), Te = P(() => he.value), Ee = P(() => !_(Te) || !!X.value), De = b(0), Oe = P(() => (_(De), ke?.getInputMode() ?? "singleValue")), ke = Xt({
		getEditor: () => q.value,
		getAuth: () => B.value,
		getRuntime: () => a.rxNostr,
		getEnvironment: ne,
		isFreePlacement: () => he.value,
		getItems: () => U.getItems(),
		removeItem: (e) => U.removeItem(e),
		removePlaceholderSize: (e) => pe.update((t) => {
			let n = { ...t };
			return delete n[e], n;
		}),
		restoreItems: (e, t) => {
			_(it)?.editor === e && !_(it).isCurrent() && (C(it, null), _(W)?.cancelActiveNip65Operations(), J.isSubmitPending = !1, J.postStatus.sending && et());
			let n = Bn({
				currentEditor: e,
				items: t
			});
			return Object.assign(_(G), n.imageOxMap), Object.assign(_(we), n.imageXMap), n.movedItemIds;
		},
		onChange: () => {
			C(De, _(De) + 1);
		},
		onUploadEnd: () => Qt(J, !1, "")
	});
	function Ae(e) {
		return _(De), ft(e.state.doc, ke?.getContext() ?? !1);
	}
	D(() => {
		B.value, a.rxNostr, q.value, X.value, T(() => ke?.sync());
	}), D(() => {
		_e.value && T(() => ke?.abortUpload());
	});
	let K = P(() => J.postStatus), Me = P(() => J.uploadErrorMessage), Ne = P(() => Et.value), Pe = P(() => Rt.value), Fe = P(() => Pt.value), Re = b(!0), ze = !1, Ve = P(() => a.hasStoredKey && !F() && _(Pe) && !_(Fe) && _(Re)), We = null, Ke = null, qe = null, Je = null, Ze = b(y(152)), Qe = P(() => !1), tt = P(() => _(Qe) ? `--post-editor-auto-grow-min-lines: ${a.hostOwnedConfig.editorMinLines}lh; --post-editor-auto-grow-max-lines: ${a.hostOwnedConfig.editorMaxLines}lh;` : `--post-editor-min-height: ${ie()}px; --post-editor-target-height: ${_(Ze)}px;`), nt = P(() => X.value && _(Oe) === "uploadedShortcode" ? o()("reaction.shortcode_hint") : o()("postComponent.enter_your_text") || "テキストを入力してください");
	D(() => {
		let e = X.value, t = _(V), n = U.hasNonPlaceholderItems();
		t && rt(t, n, e ? !!Ae(t).value && !at(t) : void 0);
	});
	let it = b(null);
	D(() => {
		let e = _(it);
		e && !e.isCurrent() && (C(it, null), T(() => {
			_(W)?.cancelActiveNip65Operations(), q.value === e.editor && (J.isSubmitPending = !1, J.postStatus.sending && et());
		}));
	});
	function Y() {
		return _(K).sending || _(fe);
	}
	D(() => {
		_(V), Ye(_(nt));
	}), D(() => {});
	function ot() {
		if (_(Qe)) return;
		let e = ie();
		if (!We || !Ke) {
			C(Ze, e, !0);
			return;
		}
		let t = Array.from(We.children).reduce((e, t) => t === Ke ? e : e + It(t), 0), n = Vt({
			availableComposerHeight: I(),
			nonEditorHeight: t,
			minHeight: e
		});
		_(Ze) !== n && C(Ze, n, !0);
	}
	function ct(e) {
		Y() ? e.preventDefault() : e.target instanceof HTMLElement && _(V) && (st(e.target) || _(V).commands.focus("end"));
	}
	function lt(e) {
		!_(V) || e.currentTarget !== e.target || e.key !== "Enter" && e.key !== " " || (e.preventDefault(), _(V).commands.focus("end"));
	}
	function dt(e) {
		Y() && (!_(H)?.isCompositionInputAllowed() || !e.isComposing && e.keyCode !== 229) && (e.preventDefault(), e.stopPropagation());
	}
	function pt(e) {
		let t = _(H)?.isCompositionInputAllowed() && e instanceof InputEvent && (e.isComposing || e.inputType === "insertCompositionText" || e.inputType === "insertFromComposition");
		Y() && !t && (e.preventDefault(), e.stopPropagation());
	}
	function mt(e) {
		e.preventDefault();
	}
	function ht(e) {
		let t = _(V)?.view.dom;
		_(R) && t && e.relatedTarget === t && t.focus({ preventScroll: !0 });
	}
	let gt = P(() => Q.value), _t = P(() => _(gt).showSecretKeyDialog), yt = P(() => _(gt).showImageFullscreen), bt = P(() => _(gt).fullscreenMediaId), St = P(() => _(gt).fullscreenImageSrc), Ct = P(() => _(gt).fullscreenImageAlt), wt = P(() => _(gt).showFloatingMessage), Tt = P(() => _(gt).floatingMessageX), At = P(() => _(gt).floatingMessageY), Lt = P(() => _(gt).floatingMessageText);
	D(() => {
		a.rxNostr && (_(W) ? _(W).setRxNostr(a.rxNostr) : C(W, new Yt(a.rxNostr, {
			getNip46SignerForSessionFn: (e) => Se.getSignerForSession(e),
			getParentClientSignerFn: () => z.getSigner(),
			channelContextState: Nt,
			replyQuoteState: Dt,
			replyQuoteService: new Ut(),
			clearReplyQuoteFn: zt,
			savePostHistoryFn: (e) => Vn({
				input: e,
				postHistoryRepositoryImpl: je
			}),
			notificationPort: a.notificationPort,
			storeSignedEventsFn: (e, t) => a.storeSignedEventsFn?.(e, t)
		}), !0));
	});
	let Gt = en({
		getCurrentEditor: () => _(V),
		getFileInput: () => _(xe),
		getImageOxMap: () => _(G),
		getImageXMap: () => _(we),
		getUploadFailedText: (e) => o()(e),
		updateUploadState: (e, t) => {
			Qt(J, e, t);
		},
		setUploadErrorMessage: (e) => {
			J.uploadErrorMessage = e;
		},
		uploadFiles: async (e) => {
			if (Y() || J.isSubmitPending || J.isUploading) return null;
			{
				let t = X.value;
				if (t && (e.files.length !== 1 || !e.files[0].type.startsWith("image/"))) return J.uploadErrorMessage = o()("postComponent.reactionUnsupportedImage"), null;
				let n = t ? ke?.beginUpload() : void 0;
				if (t && !n) return null;
				n && _e.reset(), Qt(J, !0, "");
				try {
					let t = a.normalUploadFiles ?? (await import("./normalUploadHelper-C3WJNjsh.js")).uploadFiles;
					return n && (!n.isCurrent() || n.signal.aborted) ? null : await t({
						...e,
						...n ? { reactionUpload: n } : {}
					});
				} finally {
					n ? (n.isCurrent() && Qt(J, !1), ke?.endUpload(n)) : Qt(J, !1);
				}
			}
			if (!a.hostOwnedConfig?.uploadMedia) return Qt(J, !1, o()("postComponent.media_not_supported")), null;
			Qt(J, !0, "");
			let t = Xn({
				uploadMedia: a.hostOwnedConfig.uploadMedia,
				signal: a.hostOwnedConfig.signal
			});
			try {
				return await vt({
					...e,
					showUploadError: (e, t) => xt(e, t, {
						updateUploadState: (e, t) => {
							Qt(J, e, t);
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
					dependencies: Jn(t.fileUploadManager),
					prepareFiles: t.prepareFiles,
					uploadPreparedFiles: t.uploadPreparedFiles,
					fileUploadManager: t.fileUploadManager,
					fileUploadManagerInstance: new t.fileUploadManager(),
					deferUploadStateClear: !0,
					isUploadAborted: () => !!a.hostOwnedConfig.signal.aborted
				});
			} finally {
				Qt(J, !1);
			}
		}
	});
	function Kt() {
		let e = !!(_(V)?.view.composing && Ft());
		e && _(V)?.view.dom.blur(), bn(), e ? _(H)?.retire() : _(H)?.markStale();
	}
	let qt = Mn({
		updatePostStatus: Xe,
		clearContentAfterSuccess: Kt,
		onPostSuccess: (e) => {
			e?.event?.kind === 7 ? a.onReactionResult?.(e) : a.onPostSuccess?.(e);
		}
	});
	k(() => {
		ke?.dispose(), Ce = !0, Ot("ownership"), _(W)?.cancelActiveNip65Operations();
	});
	function Jt(e) {
		_(H)?.markFailure(), qt.markFailure(e);
	}
	D(() => {
		if (_(Qe)) return;
		if (I(), ie(), _(Ee), _(Me), _(V), _(Ee) && U.items.length, typeof window > "u") {
			C(Ze, 152, !0);
			return;
		}
		let e = window.requestAnimationFrame(() => {
			ot();
		});
		return () => {
			window.cancelAnimationFrame(e);
		};
	}), D(() => {
		if (_(Qe) || (I(), ie(), _(V), _(Ee), _(Me), !We || typeof ResizeObserver > "u")) return;
		let e = null, t = () => {
			e === null && (e = window.requestAnimationFrame(() => {
				e = null, ot();
			}));
		}, n = new ResizeObserver(t);
		t(), n.observe(We);
		for (let e of Array.from(We.children)) e !== Ke && n.observe(e);
		return () => {
			n.disconnect(), e !== null && window.cancelAnimationFrame(e);
		};
	}), w(() => {
		C(fe, !1), C(H, new Wt((e) => {
			C(fe, e === "stale");
		}), !0), qe = Hn({
			isReactionMode: () => X.value !== null,
			getReactionInputMode: () => ke?.getInputMode() ?? "singleValue",
			isInputBlocked: Y,
			isCompositionInputAllowed: () => !!_(H)?.isCompositionInputAllowed(),
			compositionController: _(H) ?? void 0,
			placeholderText: _(nt),
			editorContainerEl: Ke,
			currentEditor: _(V),
			hasStoredKey: a.hasStoredKey,
			hasPostingCapability: A(),
			submitPost: vn,
			onCustomEmojiSelect: a.onCustomEmojiSelect,
			getCustomEmojiItems: void 0,
			enterKeyBehavior: void 0,
			hostOwnedLite: !1,
			submitShortcuts: void 0,
			uploadFiles: _(ae) ? (e) => {
				Y() || Gt.performUpload(e);
			} : void 0,
			eventCallbacks: {
				onContentUpdate: (e, t) => {
					$e(e, t), a.onEditorContentUpdate?.();
				},
				onImageFullscreenRequest: (e, t, n) => {
					Q.showImageFullscreen(e, t, n || "");
				},
				onSelectImageNode: (e) => {}
			}
		}), C(se, qe.editor, !0);
		let e = null, t = (e) => {
			let t = e.isEmpty, n = !ze || _(Re) !== t;
			C(Re, t, !0), ze = !0, n && a.onEditorEmptyChange?.(t);
		}, n = (e) => {
			rt(e, U.hasNonPlaceholderItems(), X.value ? !!Ae(e).value && !at(e) : void 0);
		}, r = ({ editor: e }) => {
			t(e), n(e);
		};
		Je = _(se).subscribe((i) => {
			i !== null && i === e ? (C(V, i, !0), i && (t(i), n(i))) : (e && e.off("transaction", r), e = i, C(V, i, !0), i ? (_(H)?.attach(i), t(i), n(i)) : (_(H)?.detach(), rt(null, !1)), i?.on("transaction", r), q.set(i));
		});
		let i = (e) => {
			let { src: t, alt: n, mediaId: r } = e.detail;
			Q.showImageFullscreen(t, n, r || "");
		};
		return window.addEventListener("image-fullscreen-request", i), () => {
			ke?.dispose(), _(H)?.destroy(), C(H, null), C(fe, !1), rt(null, !1), q.value === _(V) && (J.isSubmitPending = !1, Q.hideSecretKeyDialog()), window.removeEventListener("image-fullscreen-request", i), qe && (e && e.off("transaction", r), Un({
				unsubscribe: qe.unsubscribe,
				componentUnsubscribe: Je ?? (() => {}),
				handlers: qe.handlers,
				currentEditor: _(V),
				editorContainerEl: Ke,
				submitPost: vn
			}), Je = null);
		};
	});
	let Zt = Gt.handleFileSelect;
	async function $t(e) {
		return Y() ? null : await Gt.performUpload(e);
	}
	function Z() {
		_(V)?.commands.focus();
	}
	function tn() {
		_(V)?.commands.blur();
	}
	function nn(e) {
		if (!_(V) || !e || Y()) return;
		let t = _(V), n = e.split("\n").map((e) => ({
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
		if (!_(V) || !e || Y()) return !1;
		let t = e.split("\n").map((e) => ({
			type: "paragraph",
			content: e ? [{
				type: "text",
				text: e
			}] : void 0
		}));
		return _(V).isEmpty ? _(V).commands.setContent({
			type: "doc",
			content: t
		}) : _(V).chain().focus("end").insertContent([{ type: "paragraph" }, ...t]).run(), _(V).commands.focus("end"), !0;
	}
	function an(e) {
		if (!_(V) || !e || Y()) return;
		let t = kt(e);
		_(V).commands.setContent(t || "<p></p>"), _(V).commands.focus("end");
	}
	function on() {
		return _(V) ? _(V).getHTML() : "";
	}
	function sn(e) {
		if (!_(V) || e.length === 0 || Y()) return;
		let { schema: t } = _(V).state, n = _(V).state.tr, r = _(V).state.doc.content.size;
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
				n = n.insert(r, a), r += a.nodeSize, e.ox && C(G, {
					..._(G),
					[i]: e.ox
				}, !0), e.x && C(we, {
					..._(we),
					[i]: e.x
				}, !0);
			} else if (e.type === "video" && t.nodes.video) {
				let e = t.nodes.video.create({ src: i });
				n = n.insert(r, e), r += e.nodeSize;
			}
		}), _(V).view.dispatch(n), _(V).commands.focus("end");
	}
	function cn(e) {
		if (!_(V) || Y()) return !1;
		let t = _(V).state.doc;
		return Wn(_(V), e), !t.eq(_(V).state.doc);
	}
	function ln() {
		_(V) && (ut(_(V).view.dom) || Le(_(V)));
	}
	function un(e) {
		if (!_(V) || Y()) return;
		ln();
		let { state: t, view: n } = _(V), r = e < 0 ? t.selection.from : t.selection.to, i = Math.max(0, Math.min(t.doc.content.size, r + e));
		if (i === r) return;
		let a = Be.near(t.doc.resolve(i), e);
		n.dispatch(t.tr.setSelection(a).scrollIntoView().setMeta("addToHistory", !1));
	}
	function dn() {
		un(-1);
	}
	function fn() {
		un(1);
	}
	function pn() {
		if (!_(V) || Y()) return;
		ln();
		let { state: e, view: t } = _(V), { selection: n } = e;
		if (!n.empty) {
			_(V).commands.deleteSelection();
			return;
		}
		let r = n.$from.nodeBefore;
		if (r) {
			let i = r.isText ? Array.from(r.text ?? "").at(-1)?.length ?? 0 : r.nodeSize;
			i > 0 && t.dispatch(e.tr.delete(n.from - i, n.from).scrollIntoView());
		} else _(V).commands.first(({ commands: e }) => [() => e.joinBackward(), () => e.selectNodeBackward()]);
	}
	function mn() {
		_(V) && !Y() && (ln(), _(V).commands.keyboardShortcut("Enter"));
	}
	function hn() {
		return _n() && (X.value && _(V) ? !!Ae(_(V)).value && !at(_(V)) && !_(V).view.composing : He(_(V), U.hasNonPlaceholderItems())) && !J.isSubmitPending && !_(_t);
	}
	function _n() {
		return !!_(V) && !!_(W) && !F() && !_(K).sending && !J.isUploading && !_(K).completed && A();
	}
	async function vn(e) {
		if (!_(V) || !hn() || !_(W)) return;
		let t = _(V), n = X.value;
		if (n) {
			let e = Ae(t).value;
			if (!e) return;
			let r = a.rxNostr, i = B.value, o = () => !Ce && q.value === t && a.rxNostr === r && B.value === i && X.value === n, s = {
				editor: t,
				isCurrent: o
			};
			C(it, s);
			let c = !1;
			J.isSubmitPending = !0, qt.markSending();
			try {
				let t = await Mt.react({
					target: n.event,
					relayHints: n.relayHints,
					value: e,
					publisher: _(W),
					isCurrent: o
				});
				if (!o()) return;
				c = !0, t.success ? (Ot("success"), qt.markSuccess(t)) : Jt("reaction.failed");
			} finally {
				_(it) === s && (c || o()) && (C(it, null), !Ce && q.value === t && (J.isSubmitPending = !1));
			}
		} else {
			J.isSubmitPending = !0;
			try {
				if (t.isDestroyed || q.value !== t || !_n()) return;
				let e = _(W).preparePostPayload(t);
				if (Ie(t.state.doc), ce(e.content)) {
					Q.showSecretKeyDialog(e.content, e.emojiTags), J.isSubmitPending = !1;
					return;
				}
				t.view.composing && _(H)?.startSession(Ge.getState(t.state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await _(W).performPostSubmission(t, e, _(G), _(we), () => {
					Ce || (qt.markSending(), J.isSubmitPending = !1);
				}, (e) => {
					Ce || qt.markSuccess(e);
				}, (e) => {
					Ce || Jt(e);
				});
			} finally {
				!Ce && q.value === t && (J.isSubmitPending = !1);
			}
		}
	}
	function yn() {
		Ot("reset"), _(V) && (_(W) ? _(W).resetPostContent(_(V)) : _(V).chain().clearContent().run());
	}
	function bn() {
		if (Ot("success"), _(W) && _(V)) _(W).clearContentAfterSuccess(_(V));
		else if (_(V)) {
			let e = a.hostOwnedConfig?.hashtagPinEnabled === !0 && ye.value ? [...be().hashtags] : [];
			_(V).chain().clearContent().run(), ve.reset(), me.reset(), U.clearAll(), C(G, {}, !0), C(we, {}, !0), zt(), e.length > 0 && _(V).commands.insertContent(` ${e.map((e) => `#${e}`).join(" ")}`), _(V).commands.focus("start");
		}
	}
	async function xn() {
		if (!_(_t) || !_n()) return;
		let e = Q.getPendingPost(), t = Q.getPendingEmojiTags();
		e.trim() && _(W) && _(V) && (_(V).view.composing && _(H)?.startSession(Ge.getState(_(V).state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await Nn({
			postManager: _(W),
			currentEditor: _(V),
			imageOxMap: _(G),
			imageXMap: _(we),
			pendingPost: e,
			pendingEmojiTags: t,
			onStart: () => {
				qt.markSending(), Q.hideSecretKeyDialog();
			},
			onSuccess: qt.markSuccess,
			onFailure: Jt
		}));
	}
	let En = Q.hideSecretKeyDialog, Dn = Q.hideImageFullscreen, On = P(() => Fn({
		mediaFreePlacement: _(Te),
		includeTemporaryGallery: _(Te) && !!X.value,
		galleryItems: U.items,
		currentEditor: _(V)
	})), kn = P(() => In(_(On), _(bt), _(St)));
	function An(e) {
		let t = Ln(_(On), e);
		t && Q.showImageFullscreen(t.src, t.alt ?? "", t.id ?? "");
	}
	D(() => {
		_(V) && _(W) && _(W).preparePostContent(_(V)) !== J.content && _(K).error && Xe({
			..._(K),
			error: !1,
			message: ""
		});
	});
	function jn() {
		!_(ae) || Y() || J.isSubmitPending || J.isUploading || _(xe)?.click();
	}
	D(() => {
		let e = U.items.some((e) => !e.isPlaceholder);
		rt(_(V), e, X.value ? !!(_(V) && Ae(_(V)).value) && !(!_(V) || at(_(V))) : void 0);
	});
	let Pn = !0, Rn = !he.value;
	D(() => {
		let e = !he.value;
		if (X.value) return;
		if (Pn) {
			Pn = !1, Rn = e;
			return;
		}
		if (!_(V) || Rn === e) return;
		Rn = e;
		let t = _(V);
		if (e) T(() => zn({
			currentEditor: t,
			imageOxMap: _(G),
			imageXMap: _(we),
			addGalleryItem: (e) => U.addItem(e),
			createMediaItemId: ue
		})) && T(() => {
			C(G, {}, !0), C(we, {}, !0);
		});
		else {
			let e = Bn({
				currentEditor: t,
				items: T(() => U.getItems())
			});
			e.hadItems && T(() => {
				C(G, e.imageOxMap, !0), C(we, e.imageXMap, !0);
			}), T(() => U.clearAll());
		}
	});
	var Gn = {
		uploadFiles: $t,
		focusEditor: Z,
		blurEditor: tn,
		insertTextContent: nn,
		appendSharedTextContent: rn,
		loadDraftContent: an,
		getEditorHtml: on,
		appendMediaToEditor: sn,
		insertCustomEmoji: cn,
		moveCaretLeft: dn,
		moveCaretRight: fn,
		deleteBackward: pn,
		insertLineBreak: mn,
		submitPost: vn,
		resetPostContent: yn,
		clearContentAfterSuccess: bn,
		openFileDialog: jn
	}, Kn = rr(), qn = S(Kn);
	let Yn;
	var $ = h(qn);
	let ar;
	var or = h($), sr = (t) => {
		var n = Zn(), r = h(n);
		{
			let e = P(() => _(Ne)?.picture || "");
			Ht(r, {
				get src() {
					return _(e);
				},
				alt: "",
				fallbackAriaLabel: "",
				rootClassName: "editor-account-placeholder-avatar",
				imageClassName: "editor-account-placeholder-image",
				fallbackClassName: "editor-account-placeholder-fallback"
			});
		}
		e(n), u(t, n);
	};
	l(or, (e) => {
		_(Ve) && e(sr);
	});
	var cr = g(or, 2), lr = (e) => {
		Ue(e, {
			get editor() {
				return _(V);
			},
			class: "editor-content"
		});
	};
	l(cr, (e) => {
		_(se) && _(V) && e(lr);
	});
	var ur = g(cr, 2), dr = (t) => {
		var n = $n(), r = h(n);
		{
			let e = P(() => !_(oe) || _(K).sending || _(L) || !A() || _(K).completed), t = P(() => o()("postComponent.post"));
			le(r, {
				variant: "primary",
				shape: "circle",
				contentLayout: "icon",
				className: "editor-submit-button",
				get disabled() {
					return _(e);
				},
				onClick: () => {
					!_(oe) || _(K).sending || _(L) || !A() || _(K).completed || vn();
				},
				onfocus: ht,
				get ariaLabel() {
					return _(t);
				},
				children: (e, t) => {
					var n = Qn();
					u(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		e(n), f("pointerdown", n, mt, !0), u(t, n);
	};
	l(ur, (e) => {
		_(R) && e(dr);
	}), e($), s($, (e, t) => Sn?.(e, t), () => ({ dragOver: (e) => C(ge, e, !0) })), s($, (e) => Cn?.(e)), s($, (e) => wn?.(e)), s($, (e, t) => Tn?.(e, t), () => !0), v($, (e) => Ke = e, () => Ke);
	var fr = g($, 2), pr = (e) => {
		gn(e, {});
	};
	l(fr, (e) => {
		_(Ee) && e(pr);
	});
	var mr = g(fr, 2), hr = (e) => {
		var t = er();
		v(t, (e) => C(xe, e), () => _(xe)), m(() => {
			M(t, "accept", X.value ? "image/png,image/jpeg,image/webp" : "image/*,video/*"), t.multiple = !X.value;
		}), p("change", t, Zt), u(e, t);
	};
	l(mr, (e) => {
		_(ae) && e(hr);
	});
	var gr = g(mr, 2), _r = (e) => {
		var n = tr(), r = j(n, !0);
		m(() => t(r, _(Me))), u(e, n);
	};
	l(gr, (e) => {
		_(Me) && e(_r);
	}), e(qn), v(qn, (e) => We = e, () => We);
	var vr = g(qn, 2), yr = (e) => {
		{
			let t = P(() => o()("postComponent.warning")), n = P(() => o()("postComponent.secret_key_detected")), r = P(() => o()("postComponent.post")), i = P(() => o()("postComponent.cancel"));
			Bt(e, {
				get open() {
					return _(_t);
				},
				get title() {
					return _(t);
				},
				get description() {
					return _(n);
				},
				get confirmLabel() {
					return _(r);
				},
				get cancelLabel() {
					return _(i);
				},
				confirmVariant: "danger",
				onConfirm: xn,
				get onCancel() {
					return En;
				},
				contentClass: "secretkey-warning-dialog"
			});
		}
	};
	l(vr, (e) => {
		e(yr);
	});
	var br = g(vr, 2);
	jt(br, {
		get src() {
			return _(St);
		},
		get alt() {
			return _(Ct);
		},
		get onClose() {
			return Dn;
		},
		get mediaList() {
			return _(On);
		},
		get currentIndex() {
			return _(kn);
		},
		onNavigate: An,
		get show() {
			return _(yt);
		},
		set show(e) {
			C(yt, e);
		}
	});
	var xr = g(br, 2), Sr = (e) => {
		de(e, {
			get show() {
				return _(wt);
			},
			get x() {
				return _(Tt);
			},
			get y() {
				return _(At);
			},
			children: (e, n) => {
				var r = nr(), i = j(r, !0);
				m(() => t(i, _(Lt))), u(e, r);
			},
			$$slots: { default: !0 }
		});
	};
	l(xr, (e) => {
		_(wt) && e(Sr);
	}), m((e) => {
		Yn = N(qn, 1, "post-container svelte-15ticnd", null, Yn, { "editor-auto-grow": _(Qe) }), n(qn, _(tt)), ar = N($, 1, "editor-container svelte-15ticnd", null, ar, {
			"drag-over": _(ge),
			"gallery-mode": _(Ee),
			sending: _(K).sending || _(fe),
			"editor-submit-enabled": _(R),
			"account-avatar-placeholder": _(Ve)
		}), M($, "aria-label", e), M($, "aria-readonly", _(K).sending || _(fe) ? "true" : void 0), M($, "aria-disabled", void 0);
	}, [() => o()("postComponent.editor_label")]), p("click", $, ct), f("keydown", $, dt, !0), p("keydown", $, lt), f("beforeinput", $, pt, !0), f("paste", $, pt, !0), f("cut", $, pt, !0), f("drop", $, pt, !0), u(i, Kn);
	var Cr = r(Gn);
	return d(), Cr;
}
o([
	"click",
	"keydown",
	"change"
]);
export { $ as default };
