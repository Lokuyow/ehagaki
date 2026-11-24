import { n as e } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { i as t, m as n } from "./esm-N9TTQGcl.js";
import { i as r, n as i } from "./relayConfigUtils-56ujWwKF.js";
import { a, o } from "./postHistoryEventUtils-iuP8QpIA.js";
import { n as s, u as c } from "./ehagakiDb-DuXS0XPm.js";
import { n as l, r as u } from "./operation-BO0VLD7w.js";
import { $ as d, A as f, E as p, G as m, J as h, K as g, L as _, M as v, N as y, O as b, T as x, U as S, V as C, W as w, Z as T, a as E, i as D, j as O, k, l as A, lt as j, ot as M, rt as N, s as P, t as F, tt as I, z as L } from "./postHistoryRepository-Bu2z041i.js";
import { a as R, i as z, r as B } from "./hostRelayRuntime-SryW0auD.js";
import { t as V } from "./localRelayUrl-t7UxBsyT.js";
import { i as H, n as U, o as ee, s as te } from "./query-CUABraKG.js";
import { r as ne } from "./publish-DOKLxtGg.js";
import { n as re, t as ie } from "./nip65RelayDirectory-B7gmBLn_.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelayResolver.ts
function W(e) {
	if (z()) return B();
	let t = i.sanitizeExternalRelayUrls(e ? [...i.extractWriteRelays(e), ...i.extractReadRelays(e)] : []);
	return t.length ? t : i.sanitizeExternalRelayUrls(r);
}
function ae(e) {
	return JSON.stringify([
		z(),
		W(e),
		e ?? null
	]);
}
function oe(e, t) {
	if (z()) return B();
	let n = e ? [...i.extractReadRelays(e), ...i.extractWriteRelays(e)] : [], a = i.sanitizeExternalRelayUrls(n, { limit: t });
	return a.length > 0 ? a : i.sanitizeExternalRelayUrls(r, { limit: t });
}
var G = 6e3, K = 6e3, q = 6e3, J = 35e3, se = 6e4;
function Y(e) {
	return Array.from(e).sort((e, t) => e.localeCompare(t));
}
function ce() {
	let e = Math.random().toString(36).slice(2, 10);
	return `post-history-repair-${Date.now().toString(36)}-${e}`;
}
function le(e, t) {
	let n = (() => {
		switch (e) {
			case "dialog-open-refresh":
			case "visibility-resume":
			case "foreground-periodic": return 30;
			case "dialog-open-catchup":
			case "older-backfill": return 150;
			case "repair-visible-range": return 250;
			default: return 150;
		}
	})();
	return Number.isFinite(t) ? Math.max(1, Math.trunc(t ?? n)) : n;
}
function ue(e, t) {
	if (Number.isFinite(t)) return Math.max(1, Math.trunc(t ?? 1));
	switch (e) {
		case "dialog-open-refresh":
		case "dialog-open-catchup":
		case "visibility-resume":
		case "foreground-periodic": return K;
		case "older-backfill": return q;
		case "repair-visible-range": return J;
		default: return G;
	}
}
function de(e, t = !1) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls),
		...t ? { attestation: e.attestation } : {}
	})).sort((e, t) => t.event.created_at - e.event.created_at);
}
var fe = new class {
	setTimeoutFn;
	clearTimeoutFn;
	now;
	constructor(e = {}) {
		this.setTimeoutFn = e.setTimeoutFn ?? ((e, t) => setTimeout(e, t)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((e) => clearTimeout(e)), this.now = e.now ?? Date.now;
	}
	fetchLatest(e, t) {
		return this.fetch(e, t);
	}
	fetchRelayPage(e, t) {
		return this.fetch(e, t, t.relayUrl, t.ids);
	}
	fetch(e, t, n, r) {
		let a = r && new Set(r), s = this.now(), c = t.kinds ?? [...S], d = le(t.reason, t.limit), f = Math.min(t.reason === "repair-visible-range" || n ? Infinity : 6e3, ue(t.reason, t.timeoutMs)), p = n === void 0 ? W(t.relayConfig) : i.sanitizeExternalRelayUrls([n]), m = [
			"dialog-open-refresh",
			"visibility-resume",
			"foreground-periodic"
		].includes(t.reason ?? ""), _ = !n && m && !z() ? p.slice(0, 4) : p, v = t.until ?? Math.max(0, Math.floor(s / 1e3)), y = /* @__PURE__ */ new Map(), b = _.map((e) => {
			let t = ce();
			return {
				relayUrl: e,
				subId: `${t}:0`,
				request: H(t),
				rawCount: 0,
				eventIds: /* @__PURE__ */ new Set(),
				oldestCreatedAt: null,
				newestCreatedAt: null,
				eoseReceived: !1,
				verificationDrained: !1,
				finished: !1,
				failed: !1,
				hints: [],
				authRequired: !1,
				authAutoResent: !1,
				requestCount: 0
			};
		}), x = new Map(b.map((e) => [e.relayUrl, e])), C = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Set(), E = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new Set(), O = [], k = !1, A, M, N = () => {}, P = () => {}, F = !1, I = !1, L = !1, R = () => void 0, B = () => {
			b.forEach((e) => e.subscription?.unsubscribe?.()), O.forEach((e) => e.unsubscribe?.());
		}, V = (e) => {
			let r = de(y, n !== void 0), i = r.map(({ event: e }) => e.created_at), o = i.length ? Math.min(...i) : null, s = i.length ? Math.max(...i) : null, c = b.map((t) => ({
				relayUrl: t.relayUrl,
				eoseReceived: t.eoseReceived,
				verificationDrained: t.verificationDrained,
				termination: e === "cancelled" ? "cancelled" : t.eoseReceived && t.verificationDrained ? "eose" : t.failed ? "error" : M === "quorum" ? "early-stop" : "timeout",
				rawCount: t.rawCount,
				oldestCreatedAt: t.oldestCreatedAt,
				saturated: t.rawCount >= d
			})), l = a ? [] : g({
				since: t.since,
				until: v,
				oldestCreatedAt: o,
				outcomes: c,
				cancelled: e === "cancelled"
			}), u = b.filter((e) => e.eoseReceived).map((e) => e.relayUrl), f = c.filter((e) => e.termination === "eose"), m = p.length > 0 && f.length >= Math.ceil(p.length / 2), x = t.since !== void 0 && h(l, p).some((e) => e.since <= t.since && e.until >= v), S = b.filter((e) => e.rawCount || e.eventIds.size).map((e) => ({
				relayUrl: e.relayUrl,
				rawCount: e.rawCount,
				uniqueCount: e.eventIds.size
			})).sort((e, t) => e.relayUrl.localeCompare(t.relayUrl)), O = b.flatMap((e) => e.oldestCreatedAt === null ? [] : [e.oldestCreatedAt]), k = b.reduce((e, t) => e + t.rawCount, 0), A = c.some((e) => e.saturated), j = C.size > 0 || u.length > 0 || T.size > 0, N = b.length > 0 && !j && b.every((e) => e.failed);
			return {
				status: e,
				completionReason: M,
				events: r,
				fetchedAt: this.now(),
				nextUntil: O.length ? Math.max(...O) : null,
				hasMore: A,
				relayUrls: _,
				observedRelayUrls: S.map((e) => e.relayUrl),
				rawCount: k,
				uniqueCount: r.length,
				duplicateCount: Math.max(0, k - r.length),
				perRelayCounts: S,
				oldestCreatedAt: o,
				newestCreatedAt: s,
				requestedRelayUrls: _,
				eventRelayUrls: Y(C),
				eoseRelayUrls: u,
				closedRelayUrls: Y(w),
				errorRelayUrls: Y(E),
				downRelayUrls: Y(D),
				completedByRxNostr: F,
				completedByLocalTimeout: I,
				hasAnyRelayResponse: j,
				allRelaysFailed: N,
				canonicalRelayUrls: p,
				relayOutcomes: c,
				relayFetchCoverage: l,
				coverageRequestRange: {
					since: t.since ?? null,
					until: v
				},
				...n && b[0] ? { page: {
					subscriptionId: b[0].subId,
					hints: b[0].hints,
					authRequired: b[0].authRequired,
					authAutoResent: b[0].authAutoResent,
					bufferLimited: L,
					requestCount: b[0].requestCount,
					eoseReceivedAt: b[0].eoseReceivedAt
				} } : {},
				...t.reason === "repair-visible-range" ? {
					coverageRelayUrls: p,
					coverageEoseRelayUrls: f.map((e) => e.relayUrl),
					bestEffortRelayUrls: [],
					coverageComplete: m && x,
					coverageSaturated: A && !x,
					allCoverageRelaysFailed: N
				} : {}
			};
		}, U = (e) => {
			let t = i.sanitizeExternalRelayUrls(e ? [e] : [])[0];
			return t ? x.get(t) : void 0;
		};
		return {
			promise: new Promise((i) => {
				R = (e) => {
					k || (k = !0, M ??= e === "success" ? "complete" : e, B(), N(), t.operation || A?.finish(M), i(V(e)));
				};
				let s = (e) => {
					M = e, I = e === "timeout", F = e === "complete", R(e === "cancelled" ? "cancelled" : e === "timeout" ? "timeout" : b.length && b.every((e) => e.failed) ? "error" : "success");
				};
				if (A = t.operation ?? new l(f, s, {
					now: this.now,
					setTimeoutFn: this.setTimeoutFn,
					clearTimeoutFn: this.clearTimeoutFn
				}), N = A.add(() => s(A.reason ?? "cancelled")), P = u(A, b, !n && t.reason !== "repair-visible-range", s), !k) {
					if (!b.length || a && !a.size) R("error");
					else try {
						let i = (e, t) => {
							e && O.push(e.subscribe({ next: t }));
						};
						i(e.createAllMessageObservable?.(), (e) => {
							let t = U(e.from);
							if (t && !k) {
								if (e.type === "NOTICE") T.add(t.relayUrl);
								else if (e.subId === t.subId) {
									if (e.type === "EVENT") t.finished || (t.rawCount += 1), n && t.rawCount > d * 4 && (L = !0, R("error"));
									else if (e.type === "EOSE") {
										t.eoseReceived = !0, t.eoseReceivedAt = this.now();
										let n = e.message;
										t.hints = Array.isArray(n) && Array.isArray(n[2]) ? n[2].filter((e) => typeof e == "string" && [
											"finish",
											"more",
											"auth"
										].includes(e)) : [];
									} else e.type === "CLOSED" && (w.add(t.relayUrl), e.notice?.startsWith("auth-required:") ? t.authRequired = !0 : t.failed = !0);
								}
							}
						}), n && e.createOutgoingMessageObservable && O.push(e.createOutgoingMessageObservable().subscribe({ next: (e) => {
							let t = e.message, n = U(e.to);
							n && Array.isArray(t) && t[0] === "REQ" && t[1] === n.subId && (n.requestCount++, n.authRequired && (n.authAutoResent = !0));
						} })), i(e.createAllErrorObservable?.(), (e) => {
							let t = U(e.from);
							t && !t.finished && (t.failed = !0, E.add(t.relayUrl));
						}), i(e.createConnectionStateObservable?.(), (e) => {
							let t = U(e.from);
							t && !t.finished && [
								"error",
								"rejected",
								"terminated"
							].includes(e.state) && (t.failed = !0, D.add(t.relayUrl));
						});
						for (let i of b) {
							if (i.subscription = j(e, i.request, { on: { relays: [i.relayUrl] } }).subscribe({
								next: (r) => {
									if (k) return;
									let s = r.event;
									if (s.pubkey !== t.pubkeyHex || !c.includes(s.kind) || t.since !== void 0 && s.created_at < t.since || t.until !== void 0 && s.created_at > t.until || a && (!a.has(s.id) || U(r.from) !== i)) return;
									C.add(i.relayUrl), i.eventIds.add(s.id), i.oldestCreatedAt = Math.min(i.oldestCreatedAt ?? s.created_at, s.created_at), i.newestCreatedAt = Math.max(i.newestCreatedAt ?? s.created_at, s.created_at), e.createAllMessageObservable || (i.rawCount += 1);
									let l = y.get(s.id);
									if (l) o(l.event, s) && l.relayUrls.add(i.relayUrl);
									else {
										if (n && y.size >= d) {
											L = !0, R("error");
											return;
										}
										y.set(s.id, {
											event: s,
											relayUrls: /* @__PURE__ */ new Set([i.relayUrl]),
											attestation: r.attestation
										});
									}
								},
								complete: () => {
									i.verificationDrained = !0, i.finished = !0, P();
								},
								error: () => {
									i.finished = !0, i.failed = !0, E.add(i.relayUrl), P();
								}
							}), k) {
								i.subscription?.unsubscribe?.();
								break;
							}
							i.finished || (i.request.emit({
								authors: [t.pubkeyHex],
								kinds: c,
								limit: d,
								...r ? { ids: r } : {},
								...t.since === void 0 ? {} : { since: t.since },
								...t.until === void 0 ? {} : { until: t.until }
							}), i.request.over());
						}
						P();
					} catch {
						R("error");
					}
				}
			}),
			cancel: () => R("cancelled")
		};
	}
}(), pe = class {
	createClient;
	constructor(e = ee) {
		this.createClient = e;
	}
	run(e, t, n) {
		let r = new AbortController(), i = () => r.abort(), a, o, s = () => void 0, l = new Promise((e) => {
			s = e;
		});
		return r.signal.addEventListener("abort", () => s(null), { once: !0 }), t.addEventListener("abort", i, { once: !0 }), t.aborted && i(), {
			promise: (async () => {
				if (r.signal.aborted) return null;
				try {
					return a = this.createClient({
						verifier: c,
						signer: te(),
						skipVerify: !1,
						skipFetchNip11: !0,
						retry: { strategy: "off" }
					}), o = a.createAllMessageObservable().subscribe(({ message: e }) => {
						Array.isArray(e) && e[0] === "CLOSED" && typeof e[2] == "string" && e[2].startsWith("auth-required:") && i();
					}), await Promise.race([n(a, r.signal), l]);
				} catch {
					return null;
				} finally {
					i(), t.removeEventListener("abort", i), o?.unsubscribe(), a?.dispose();
				}
			})(),
			cancel: i
		};
	}
	fetchAuthored(e, t, n, r) {
		return this.run(e, n, async (n, i) => {
			let a = fe.fetchRelayPage(n, {
				...t,
				relayUrl: e,
				timeoutMs: K,
				operation: r
			}), o = () => a.cancel();
			i.addEventListener("abort", o, { once: !0 }), i.aborted && o();
			let s = await a.promise.finally(() => i.removeEventListener("abort", o));
			if (s.status !== "success") throw Error("local_relay_fetch_failed");
			return {
				events: s.events.flatMap(({ event: e, attestation: t }) => t ? [{
					event: e,
					attestation: t
				}] : []),
				fetchedAt: s.fetchedAt,
				nextUntil: s.nextUntil,
				hasMore: s.hasMore,
				browsingRanges: s.relayFetchCoverage?.flatMap(({ ranges: e }) => e) ?? []
			};
		});
	}
	fetchRelated(e, n, r, i) {
		return this.run(e, r, async (r, a) => {
			let o = H(), s = /* @__PURE__ */ new Map();
			return new Promise((c) => {
				let l, u = () => {
					l?.unsubscribe(), a.removeEventListener("abort", u), c([...s.values()]);
				};
				a.addEventListener("abort", u, { once: !0 }), l = U(r, o, { on: { relays: [e] } }, {
					operation: i,
					quorum: !1,
					timeoutMs: K,
					source: (e, t) => j(r, e, t)
				}).subscribe({
					next: ({ event: e, attestation: r }) => {
						!a.aborted && t(n, e) && s.size < (n.limit ?? 150) && s.set(e.id, {
							event: e,
							attestation: r
						});
					},
					complete: u,
					error: u
				}), a.aborted ? u() : (o.emit(n), o.over());
			});
		});
	}
	storeSignedEvent(e, t, n) {
		return this.storeSignedEvents(e, [t], n);
	}
	storeSignedEvents(e, t, n) {
		let r = [...new Map(t.map((e) => [e.id, e])).values()];
		return r.length ? this.run(e, n, async (t, n) => {
			let i = new l(K, () => void 0);
			i.bind(n);
			try {
				let n = await Promise.all(r.map((n) => ne(t, n, {
					targetRelays: [e],
					on: { relays: [e] },
					operation: i
				}).settled));
				if (n.some((e) => e.error === "post_timeout")) throw Error("local_relay_publish_timeout");
				return n.every((e) => e.success);
			} finally {
				i.finish();
			}
		}) : {
			promise: Promise.resolve(!n.aborted || null),
			cancel() {}
		};
	}
}, me = /^(0|[1-9]\d{0,4})$/, X = {
	status: "valid",
	ruleVersion: 1
};
function he(e) {
	return e?.status === "valid" && e.ruleVersion === 1;
}
function Z(e, t) {
	return M(e, t) ? {
		event: e,
		attestation: t
	} : N(e);
}
function ge(e) {
	if (typeof e != "string" || !me.test(e)) return null;
	let t = Number(e);
	return Number.isInteger(t) && t >= 0 && t <= 65535 ? t : null;
}
function _e(e) {
	let t = e.tags.filter((e) => e[0] === "k");
	if (t.length === 0) return !0;
	let n = t.map((e) => ge(e[1]));
	return n.some((e) => e === null) ? !0 : n.some((e) => e !== null && k(e));
}
function ve(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) n?.id && n.pubkey && t.set(n.id, n);
	return t;
}
function ye(e, t) {
	let n = e.get(t.targetAuthorPubkey) ?? /* @__PURE__ */ new Set();
	n.add(t.targetEventId), e.set(t.targetAuthorPubkey, n);
}
function be(e, t) {
	return e.targetAuthorPubkey !== t.targetAuthorPubkey || e.targetEventId !== t.targetEventId || e.schemaVersion !== t.schemaVersion || e.deletionEventId !== t.deletionEventId || e.deletionEventPubkey !== t.deletionEventPubkey || b(e) !== b(t) || e.deletedAt !== t.deletedAt || e.reason !== t.reason || !o(e.rawEvent, t.rawEvent) || e.rawEventVerification?.status !== t.rawEventVerification?.status || e.rawEventVerification?.ruleVersion !== t.rawEventVerification?.ruleVersion || !P(e.relayUrls, t.relayUrls);
}
function Q(e, t, n) {
	let r = he(e.rawEventVerification) && !o(e.rawEvent, t.rawEvent);
	return {
		...t,
		...r ? {
			rawEvent: e.rawEvent,
			rawEventVerification: e.rawEventVerification
		} : {},
		targetVerified: b(e) || b(t),
		relayUrls: i.sanitizeExternalRelayUrls([...e.relayUrls, ...t.relayUrls]),
		fetchedAt: Math.max(e.fetchedAt, t.fetchedAt),
		updatedAt: n(),
		schemaVersion: 2
	};
}
var xe = new class {
	db;
	now;
	constructor(e = s, t = Date.now) {
		this.db = e, this.now = t;
	}
	async getDeletedTargets(e) {
		let t = /* @__PURE__ */ new Map(), n = e.filter((e) => e.targetAuthorPubkey && e.targetEventId).map((e) => [e.targetAuthorPubkey, e.targetEventId]);
		if (n.length === 0) return t;
		let r = await this.db.postHistoryDeletionRequests.where("[targetAuthorPubkey+targetEventId]").anyOf(n).toArray(), i = await I(this.db, "postHistoryDeletionRequests").hydrate(r);
		for (let e of i) b(e) && ye(t, e);
		return t;
	}
	async getAllForTargetAuthorPubkey(e) {
		return e ? this.db.postHistoryDeletionRequests.where("targetAuthorPubkey").equals(e).toArray().then((e) => I(this.db, "postHistoryDeletionRequests").hydrate(e)) : [];
	}
	async saveLocalDeletion(e) {
		let t = Z(e.deletionEvent, e.attestation);
		if (!t) throw Error("invalid_local_deletion_event");
		let r = t.event, i = Array.from(/* @__PURE__ */ new Set([...e.targetEventId ? [e.targetEventId] : [], ...e.targetEventIds ?? []]));
		if (i.length === 0 || r.kind !== 5 || !n(r.id)) throw Error("invalid_local_deletion_event");
		let a = e.fetchedAt ?? this.now(), o = null;
		await this.db.transaction("rw", this.db.events, this.db.postHistoryDeletionRequests, this.db.postHistory, this.db.sensitivePayloads, async () => {
			let t = e.targetEvent ? N(e.targetEvent)?.event : null, n = await I(this.db, "postHistory").get(i[0]), s = n ?? (t && t.id === i[0] ? {
				eventId: t.id,
				pubkeyHex: t.pubkey,
				kind: t.kind,
				rawEvent: t
			} : void 0);
			if (!s || !k(s.kind) || !f(r, {
				id: s.eventId,
				pubkey: s.pubkeyHex
			})) throw Error("local_deletion_target_not_found");
			let c = s.rawEvent, l = (C(c) ? _(c) : null)?.eventId;
			for (let t of i) {
				let n = !1;
				if (t === s.eventId) n = f(r, {
					id: s.eventId,
					pubkey: s.pubkeyHex
				});
				else if (t === l) {
					let e = await I(this.db, "sensitivePayloads").get(t);
					n = !!e && e.deletedAt === void 0 && e.pubkeyHex === s.pubkeyHex && L(c, e.rawEvent, t) && f(r, {
						id: t,
						pubkey: s.pubkeyHex
					});
				}
				if (!n) continue;
				let i = v({
					deletionEvent: r,
					targetEventId: t,
					targetVerified: !0,
					relayUrls: e.relayUrls,
					fetchedAt: a
				}, this.now);
				i.rawEventVerification = { ...X };
				let o = await I(this.db, "postHistoryDeletionRequests").get(i.id), u = o ? Q(o, i, this.now) : i;
				if (await I(this.db, "postHistoryDeletionRequests").put(u), t === l) {
					let n = await I(this.db, "sensitivePayloads").get(t);
					n && await I(this.db, "sensitivePayloads").put({
						...n,
						deletedAt: e.deletedAt,
						deletionEventId: r.id,
						updatedAt: this.now()
					});
				}
			}
			n && (n.deletedAt !== e.deletedAt || n.deletionEventId !== r.id) && (await I(this.db, "postHistory").put({
				...n,
				deletedAt: e.deletedAt,
				deletionEventId: r.id,
				updatedAt: this.now()
			}), o = s.pubkeyHex);
		}), o && A(o);
	}
	async upsertValidDeletionRequests(e) {
		if (e.targetEvents.length === 0 || e.deletionEvents.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: e.deletionEvents.length
		};
		let t = e.deletionEvents.flatMap((e) => {
			let t = Z(e.event, e.attestation);
			return t ? [{
				...e,
				event: t.event,
				attestation: t.attestation
			}] : [];
		}), n = ve(e.targetEvents), r = e.fetchedAt ?? this.now(), a = /* @__PURE__ */ new Map(), o = e.deletionEvents.length - t.length;
		for (let e of t) {
			let t = e.event.tags.filter((e) => e[0] === "e" && typeof e[1] == "string").map((e) => e[1]), s = !1;
			for (let o of t) {
				let t = n.get(o);
				if (!t) continue;
				let c = a.get(x(t.pubkey, t.id, e.event.id)), l = O({
					deletionEvent: e.event,
					targetEvent: t,
					relayUrls: i.sanitizeExternalRelayUrls([...c?.relayUrls ?? [], ...e.relayUrls ?? []]),
					fetchedAt: r
				}, this.now);
				l && (l.rawEventVerification = { ...X }, a.set(l.id, l), s = !0);
			}
			s || (o += 1);
		}
		let s = Array.from(a.values());
		if (s.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: o
		};
		let c = 0, l = 0, u = 0;
		return await this.db.transaction("rw", this.db.events, this.db.postHistoryDeletionRequests, async () => {
			let e = await I(this.db, "postHistoryDeletionRequests").bulkGet(s.map((e) => e.id)), t = /* @__PURE__ */ new Map();
			e.forEach((e) => {
				e && t.set(e.id, e);
			});
			let n = s.map((e) => {
				let n = t.get(e.id);
				if (!n) return c += 1, e;
				let r = Q(n, e, this.now);
				return be(n, r) ? l += 1 : u += 1, r;
			});
			await I(this.db, "postHistoryDeletionRequests").bulkPut(n);
		}), {
			insertedCount: c,
			updatedCount: l,
			unchangedCount: u,
			ignoredCount: o
		};
	}
	async upsertImportedDeletionEvents(e) {
		let t = e.fetchedAt ?? this.now(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set(), o = 0;
		for (let a of e.deletionEvents) {
			let s = Z(a.event, a.attestation);
			if (!s) {
				o += 1;
				continue;
			}
			let c = s.event;
			if (c.kind !== 5 || c.pubkey !== e.ownerPubkeyHex || !n(c.id)) {
				o += 1;
				continue;
			}
			let l = c.tags.filter((e) => e[0] === "e" && typeof e[1] == "string" && n(e[1])).map((e) => e[1]), u = Array.from(new Set(l));
			if (u.length === 0) {
				o += 1;
				continue;
			}
			let d = _e(c);
			i.add(c.id);
			for (let e of u) {
				let n = v({
					deletionEvent: c,
					targetEventId: e,
					targetVerified: !1,
					relayUrls: [],
					fetchedAt: t
				}, this.now);
				n.rawEventVerification = { ...X }, r.set(n.id, {
					record: n,
					shouldStoreWithoutTarget: d
				});
			}
		}
		let s = Array.from(r.values());
		if (s.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: o,
			appliedDeletionCount: 0
		};
		let c = 0, l = 0, u = 0, d = 0, f = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set();
		await this.db.transaction("rw", [
			this.db.events,
			this.db.postHistoryDeletionRequests,
			this.db.postHistory,
			...e.localWriteScope ? [this.db.postHistoryWriteGeneration] : []
		], async () => {
			await T(this.db, e.localWriteScope);
			let t = await I(this.db, "postHistoryDeletionRequests").bulkGet(s.map((e) => e.record.id)), n = Array.from(new Set(s.map((e) => e.record.targetEventId))), r = await I(this.db, "postHistory").bulkGet(n), g = new Map(r.filter((e) => !!e).map((e) => [e.eventId, e])), v = [], x = /* @__PURE__ */ new Set();
			s.forEach((e, n) => {
				let { record: r } = e, i = g.get(r.targetEventId);
				if (i && !k(i.kind) || !i && !e.shouldStoreWithoutTarget) return;
				i && i.deletedAt !== void 0 && i.rawEventVerification?.status === "valid" && i.rawEventVerification.ruleVersion === 1 && a(i.rawEvent, i) && !_(i.rawEvent) && h.add(r.targetEventId);
				let o = !!i && k(i.kind) && i.pubkeyHex === r.targetAuthorPubkey && i.pubkeyHex === r.deletionEventPubkey, s = {
					...r,
					targetVerified: o
				};
				f.add(r.targetEventId), x.add(r.deletionEventId);
				let d = t[n];
				if (!d) {
					c += 1, m.add(r.targetEventId), v.push(s);
					return;
				}
				let p = Q(d, s, this.now);
				be(d, p) ? (l += 1, m.add(r.targetEventId), v.push(p)) : u += 1;
			});
			for (let e of i) x.has(e) || (o += 1);
			v.length > 0 && await I(this.db, "postHistoryDeletionRequests").bulkPut(v);
			for (let e of n) {
				let t = g.get(e);
				if (!t || !k(t.kind) || t.deletedAt !== void 0) continue;
				let n = (await this.db.postHistoryDeletionRequests.where("targetEventId").equals(e).toArray().then((e) => I(this.db, "postHistoryDeletionRequests").hydrate(e))).filter((e) => b(e) && e.targetAuthorPubkey === t.pubkeyHex && e.deletionEventPubkey === t.pubkeyHex).sort(p)[0];
				if (!n) continue;
				let r = y(n);
				await I(this.db, "postHistory").update(e, {
					...r,
					updatedAt: this.now()
				}), d += 1;
			}
			await T(this.db, e.localWriteScope);
		});
		let g = Array.from(new Set(s.map((e) => e.record.targetEventId)));
		for (let e of g) f.has(e) && !m.has(e) && h.has(e) || (await D(e, this.db, this.now), await E(e, this.db, this.now));
		return {
			insertedCount: c,
			updatedCount: l,
			unchangedCount: u,
			ignoredCount: o,
			appliedDeletionCount: d
		};
	}
}(), Se = new class {
	session = null;
	sessionGeneration = 0;
	sessionListeners = /* @__PURE__ */ new Set();
	stores = /* @__PURE__ */ new Map();
	transport;
	repository;
	payloads;
	deletions;
	getLocalRevision;
	runtimeKind;
	constructor(t = {}) {
		this.transport = t.transport, this.repository = t.repository ?? F, this.payloads = t.payloads ?? re, this.deletions = t.deletions ?? xe, this.getLocalRevision = t.getLocalRevision ?? ((e) => d(s, e)), this.runtimeKind = t.runtimeKind ?? (() => e().runtimeKind);
	}
	getTransport() {
		return this.transport ??= new pe();
	}
	configureSession(e) {
		this.cancelSession();
		let t = e.url && V(e.url);
		if (this.runtimeKind() !== "standalone" || !e.ownerPubkeyHex || !t) return () => void 0;
		let n = {
			generation: this.sessionGeneration,
			ownerPubkeyHex: e.ownerPubkeyHex,
			url: t,
			isActive: e.isActive,
			abort: new AbortController()
		};
		return this.session = n, () => {
			this.session === n && this.cancelSession();
		};
	}
	cancelSession() {
		this.session?.abort.abort(), this.session = null, this.stores.clear(), this.sessionGeneration += 1;
		for (let e of this.sessionListeners) e();
	}
	getSessionGeneration() {
		return this.sessionGeneration;
	}
	onSessionInvalidated(e) {
		return this.sessionListeners.add(e), () => {
			this.sessionListeners.delete(e);
		};
	}
	isConfigured(e) {
		return !!this.currentSession(e);
	}
	currentSession(e) {
		let t = this.session;
		return t && this.runtimeKind() === "standalone" && t.ownerPubkeyHex === e && !t.abort.signal.aborted && t.isActive() ? t : null;
	}
	isCurrent(e) {
		return this.currentSession(e.ownerPubkeyHex) === e;
	}
	storeSignedEventBestEffort(e, t = () => !0) {
		this.storeSignedEventsBestEffort([e], t);
	}
	storeSignedEventsBestEffort(e, t = () => !0) {
		let n = e.length ? this.currentSession(e[0].event.pubkey) : null;
		n && this.storeBatch(n, e, t);
	}
	storeBatch(e, t, n) {
		if (!this.isCurrent(e) || !n()) return;
		let r = [...new Map(t.filter(({ event: t, attestation: n }) => t.pubkey === e.ownerPubkeyHex && (m(t.kind) || t.kind === 5 || t.kind === 36) && M(t, n) && !this.stores.has(`${e.url}:${t.id}`)).map((e) => [e.event.id, e])).values()];
		if (!r.length) return;
		let i = r.map(({ event: t }) => `${e.url}:${t.id}`), a = Promise.resolve().then(async () => {
			if (!this.isCurrent(e) || !n()) return;
			let t = r.filter(({ event: e, attestation: t }) => M(e, t)).map(({ event: e }) => e);
			t.length && await this.getTransport().storeSignedEvents(e.url, t, e.abort.signal).promise;
		}).catch(() => void 0).finally(() => {
			for (let e of i) this.stores.get(e) === a && this.stores.delete(e);
		});
		for (let e of i) this.stores.set(e, a);
	}
	read(e) {
		let t = this.currentSession(e.pubkeyHex);
		if (!t) return {
			promise: Promise.resolve(null),
			cancel: () => void 0
		};
		let n = new AbortController(), r = !1, i = () => {
			r = !0, n.abort();
		};
		t.abort.signal.addEventListener("abort", i, { once: !0 });
		let a = new l(K, () => n.abort());
		a.bind(n.signal);
		let o = () => !n.signal.aborted && this.isCurrent(t) && e.isActive();
		return {
			promise: (async () => {
				let i = await this.getLocalRevision(t.ownerPubkeyHex);
				if (!o()) return null;
				let s = {
					ownerPubkeyHex: t.ownerPubkeyHex,
					expectedRevision: i,
					isActive: o
				}, c = await this.getTransport().fetchAuthored(t.url, e, n.signal, a).promise;
				if (!c || !o()) return null;
				let l = c.nextUntil ?? e.until, u = await this.repository.upsertFetchedEvents({
					events: c.events.map((e) => ({
						...e,
						relayUrls: []
					})),
					fetchedAt: c.fetchedAt,
					localWriteScope: s,
					localBrowsingWrite: {
						...s,
						kindsKey: w,
						localRelayUrl: t.url,
						browsingRanges: c.browsingRanges,
						...e.reason !== "repair-visible-range" && l != null ? {
							resumeHint: { nextUntil: l },
							initializeResumeHintOnly: e.reason !== "older-backfill"
						} : {}
					}
				});
				if (u.applied === !1 || !o()) return null;
				let d = u.insertedCount + u.updatedCount + u.appliedDeletionCount > 0, f = [...new Map([...c.events.map(({ event: e }) => e), ...e.targets ?? []].filter((e) => e.pubkey === t.ownerPubkeyHex && m(e.kind)).map((e) => [e.id, e])).values()], p = f.flatMap((e) => {
					let t = _(e);
					return t ? [t.eventId] : [];
				}), h = [...f.map((e) => e.id), ...p], g = await Promise.allSettled([p.length ? this.getTransport().fetchRelated(t.url, {
					ids: [...new Set(p)],
					authors: [t.ownerPubkeyHex],
					kinds: [36],
					limit: p.length
				}, n.signal, a).promise : Promise.resolve([]), h.length ? this.getTransport().fetchRelated(t.url, {
					authors: [t.ownerPubkeyHex],
					kinds: [5],
					"#e": [...new Set(h)],
					limit: e.limit ?? 150
				}, n.signal, a).promise : Promise.resolve([])]);
				if (o()) {
					let e = g[0].status === "fulfilled" ? g[0].value ?? [] : [];
					for (let t of e) {
						if (!o()) break;
						f.some((e) => L(e, t.event)) && (await this.payloads.putCandidate({
							...t,
							localWriteScope: s
						}), d = !0);
					}
					let n = g[1].status === "fulfilled" ? g[1].value ?? [] : [];
					if (o() && n.length) {
						let e = await this.deletions.upsertImportedDeletionEvents({
							ownerPubkeyHex: t.ownerPubkeyHex,
							deletionEvents: n,
							fetchedAt: c.fetchedAt,
							localWriteScope: s
						});
						d ||= e.appliedDeletionCount > 0;
					}
				}
				return r || !this.isCurrent(t) || !e.isActive() || await this.getLocalRevision(t.ownerPubkeyHex) !== i ? null : {
					ownerPubkeyHex: t.ownerPubkeyHex,
					sessionGeneration: t.generation,
					localRevision: i,
					changed: d,
					browsingRanges: c.browsingRanges,
					eventIds: c.events.map(({ event: e }) => e.id),
					nextUntil: c.nextUntil,
					hasMore: c.hasMore
				};
			})().catch(() => null).finally(() => {
				a.finish(), i(), t.abort.signal.removeEventListener("abort", i);
			}),
			cancel: i
		};
	}
	archiveAdoptedAuthored(e, t) {
		let n = this.currentSession(t.ownerPubkeyHex);
		return !n || !t.isActive() || t.expectedRevision === void 0 ? Promise.resolve() : (async () => {
			let r = t.expectedRevision, i = () => this.isCurrent(n) && t.isActive(), a = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
			for (let n of e) {
				if (!i()) return;
				if (a.has(n.event.id) || n.event.pubkey !== t.ownerPubkeyHex || !m(n.event.kind)) continue;
				let e = await this.repository.getByEventId(n.event.id);
				if (!i() || await this.getLocalRevision(t.ownerPubkeyHex) !== r) return;
				if (!e || e.pubkeyHex !== t.ownerPubkeyHex || !o(e.rawEvent, n.event)) continue;
				let l = M(n.event, n.attestation) ? {
					event: n.event,
					attestation: n.attestation
				} : N(e.rawEvent);
				if (!l) continue;
				a.set(l.event.id, l.event), e.deletedAt === void 0 && s.set(l.event.id, l);
				let u = _(l.event);
				if (u) {
					let t = c.get(u.eventId) ?? [];
					t.push({
						event: l.event,
						deleted: e.deletedAt !== void 0
					}), c.set(u.eventId, t);
				}
			}
			if (!a.size || !i()) return;
			let l = await this.payloads.getByIds([...c.keys()]);
			if (!i() || await this.getLocalRevision(t.ownerPubkeyHex) !== r) return;
			for (let e of l) {
				let t = c.get(e.id)?.filter(({ event: t }) => L(t, e.rawEvent)) ?? [], n = t.length ? N(e.rawEvent) : null;
				n && (a.set(n.event.id, n.event), e.deletedAt === void 0 && t.some(({ deleted: e }) => !e) && s.set(n.event.id, n));
			}
			let u = await this.deletions.getAllForTargetAuthorPubkey(t.ownerPubkeyHex);
			if (i() && await this.getLocalRevision(t.ownerPubkeyHex) === r) {
				for (let e of u) {
					if (![...a.values()].some((t) => f(e.rawEvent, t))) continue;
					let t = N(e.rawEvent);
					t && s.set(t.event.id, t);
				}
				this.storeBatch(n, [...s.values()], i);
			}
		})().catch(() => void 0);
	}
}(), Ce = 5e3, $ = 8, we = new class {
	console;
	setTimeoutFn;
	clearTimeoutFn;
	lookupAuthorWriteRelaysFn;
	constructor(e = {}) {
		this.console = e.console ?? (typeof console < "u" ? console : {
			log: () => void 0,
			warn: () => void 0,
			error: () => void 0
		}), this.setTimeoutFn = e.setTimeoutFn ?? ((e, t) => setTimeout(e, t)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((e) => clearTimeout(e)), this.lookupAuthorWriteRelaysFn = e.lookupAuthorWriteRelaysFn;
	}
	fetchEventById(e, t) {
		let n = !1, r = /* @__PURE__ */ new Set(), i, a, o = /* @__PURE__ */ new Set(), s = !1, c = !t.authorHint, u = !0, d = () => {
			for (let e of r) e.unsubscribe?.();
			r.clear();
		}, f = (e) => (t) => {
			n || (n = !0, i?.finish(), e(t));
		};
		return {
			promise: new Promise((p) => {
				let m = f(p);
				a = m, i = new l(Math.min(6e3, t.timeoutMs ?? Ce), () => {
					m({
						event: null,
						relayUrl: null
					});
				}, {
					setTimeoutFn: this.setTimeoutFn,
					clearTimeoutFn: this.clearTimeoutFn
				}), i.add(d);
				let h = () => {
					s && c && u && m({
						event: null,
						relayUrl: null
					});
				}, g = (i, a) => {
					if (n) return;
					let c = i.filter((e) => !o.has(e));
					if (c.forEach((e) => o.add(e)), c.length === 0) {
						a === "base" ? s = !0 : u = !0, h();
						return;
					}
					let l = H(), f = !1, p = () => {
						f || (f = !0, a === "base" ? s = !0 : u = !0, h());
					};
					try {
						let i = j(e, l, { on: { relays: c } }).subscribe({
							next: (e) => {
								e.event?.id === t.eventId && m({
									event: e.event,
									relayUrl: typeof e.from == "string" ? e.from : null
								});
							},
							complete: p,
							error: (e) => {
								this.console.error("post_history_context_fetch_error", e), p();
							}
						});
						if (r.add(i), n) {
							d();
							return;
						}
						l.emit({ ids: [t.eventId] }), l.over();
					} catch (e) {
						this.console.error("post_history_context_fetch_request_error", e), p();
					}
				};
				g(this.resolveRelayUrls(t.relayHints, t.relayConfig), "base"), t.authorHint && (this.lookupAuthorWriteRelaysFn ? this.lookupAuthorWriteRelaysFn(t.authorHint) : ie(e).lookup(t.authorHint).then((e) => e.writeRelays)).then((e) => {
					if (c = !0, n) return;
					let r = this.resolveRelayUrls(e, t.relayConfig);
					u = !1, g(r, "author");
				}).catch(() => {
					c = !0, h();
				});
			}),
			cancel: () => {
				a?.({
					event: null,
					relayUrl: null
				});
			}
		};
	}
	resolveRelayUrls(e, t) {
		let n = R(e, $);
		if (n) return n;
		let a = t ? [...i.extractReadRelays(t), ...i.extractWriteRelays(t)] : [], o = i.sanitizeExternalRelayUrls([...e ?? [], ...a], { limit: $ });
		return o.length > 0 ? o : i.sanitizeExternalRelayUrls(r, { limit: $ });
	}
}();
export { K as a, J as c, W as d, oe as f, G as i, fe as l, Se as n, se as o, xe as r, q as s, we as t, ae as u };
