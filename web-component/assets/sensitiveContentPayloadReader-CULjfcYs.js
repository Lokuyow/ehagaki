import { $ as e, A as t, E as n, Et as r, G as i, I as a, J as o, K as s, L as c, Mt as l, Nt as u, P as d, T as f, Tt as p, V as m, W as h, X as g, Z as _, _ as v, a as y, ct as b, dt as x, ft as S, gt as C, i as w, it as T, k as ee, mt as E, nt as D, o as te, pt as O, r as k, s as ne, st as A, t as j, ut as M, vt as N, w as P, xt as F, y as I, z as L } from "./index-client-XkLzkVYC.js";
import { c as re, i as ie, n as R, r as ae, v as oe, x as z } from "./relayConfigUtils-B4Q_AO1M.js";
import { n as B } from "./nostrHexUtils-C4ICTS7z.js";
import { a as se, c as ce, o as le, u as ue } from "./postHistoryEventUtils-CP25bUau.js";
import { n as de } from "./profilePictureUrlUtils-B7zGYkzO.js";
import { n as V } from "./esm-CrCI9Pgc.js";
import { B as fe, F as pe, Q as H, V as me, X as U, d as W, dt as he, et as G, j as ge, o as _e, p as ve, pt as ye, q as be, s as K, st as q, t as xe, z as J } from "./LoadingPlaceholder-lit91akO.js";
import { d as Se, n as Y, s as Ce, y as we } from "./ehagakiDb-DZENFSwt.js";
import { a as Te, c as Ee, i as De, n as Oe, r as ke, s as Ae } from "./query-Bp8561W2.js";
import { $ as je, A as Me, F as Ne, H as Pe, I as Fe, J as Ie, K as Le, L as Re, M as ze, P as Be, R as Ve, W as He, X as Ue, Y as We, Z as Ge, c as Ke, ct as qe, d as Je, dt as Ye, f as Xe, g as Ze, ht as Qe, i as $e, it as et, j as tt, m as nt, mt as rt, nt as it, ot as X, s as at, t as ot, z as st } from "./nip65RelayDirectory-DWSms_SU.js";
import { s as ct } from "./postEventBuilder-BlIBIiSK.js";
import { h as lt, m as ut, p as dt } from "./relayStore.svelte-Df3SPXmc.js";
import { Ot as ft, St as pt, nt as mt, s as ht, tt as gt } from "./appUtils-BRia-Jm6.js";
import { c as _t, o as vt, s as yt } from "./signedEventResultValidator-CnvxVz7l.js";
import { a as bt, p as xt } from "./clipboardUtils-DL4u_EPs.js";
import { S as St } from "./useDialogHistory.svelte-BgJftJRE.js";
import { a as Ct, n as wt, o as Tt, r as Et, t as Dt } from "./safe-polygon.svelte-NujogFy-.js";
import { c as Ot, d as kt, l as At, p as jt, t as Mt } from "./customEmoji-Nqrea9dO.js";
import { t as Nt } from "./graphemeUtils-D37rBdTG.js";
import { t as Pt } from "./inViewportAction.svelte-DbEFrrvA.js";
import { t as Z } from "./postMediaCacheService-D760zAOV.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelayResolver.ts
function Ft(e) {
	if (ut()) return dt();
	let t = R.sanitizeExternalRelayUrls(e ? [...R.extractWriteRelays(e), ...R.extractReadRelays(e)] : []);
	return t.length ? t : R.sanitizeExternalRelayUrls(ie);
}
function It(e) {
	return JSON.stringify([
		ut(),
		Ft(e),
		e ?? null
	]);
}
function Lt(e, t) {
	if (ut()) return dt();
	let n = e ? [...R.extractReadRelays(e), ...R.extractWriteRelays(e)] : [], r = R.sanitizeExternalRelayUrls(n, { limit: t });
	return r.length > 0 ? r : R.sanitizeExternalRelayUrls(ie, { limit: t });
}
var Rt = 6e3, zt = 6e3, Bt = 6e3, Vt = 35e3, Ht = 6e4;
function Ut(e) {
	return Array.from(e).sort((e, t) => e.localeCompare(t));
}
function Wt() {
	let e = Math.random().toString(36).slice(2, 10);
	return `post-history-repair-${Date.now().toString(36)}-${e}`;
}
function Gt(e, t) {
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
function Kt(e, t) {
	if (Number.isFinite(t)) return Math.max(1, Math.trunc(t ?? 1));
	switch (e) {
		case "dialog-open-refresh":
		case "dialog-open-catchup":
		case "visibility-resume":
		case "foreground-periodic": return zt;
		case "older-backfill": return Bt;
		case "repair-visible-range": return Vt;
		default: return Rt;
	}
}
function qt(e, t = !1) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls),
		...t ? { attestation: e.attestation } : {}
	})).sort((e, t) => t.event.created_at - e.event.created_at);
}
var Jt = new class {
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
		return this.fetch(e, t, t.relayUrl);
	}
	fetch(e, t, n) {
		let r = this.now(), i = t.kinds ?? [...Ie], a = Gt(t.reason, t.limit), o = Math.min(t.reason === "repair-visible-range" || n ? Infinity : 6e3, Kt(t.reason, t.timeoutMs)), s = n === void 0 ? Ft(t.relayConfig) : R.sanitizeExternalRelayUrls([n]), c = [
			"dialog-open-refresh",
			"visibility-resume",
			"foreground-periodic"
		].includes(t.reason ?? ""), l = !n && c && !ut() ? s.slice(0, 4) : s, u = t.until ?? Math.max(0, Math.floor(r / 1e3)), d = /* @__PURE__ */ new Map(), f = l.map((e) => {
			let t = Wt();
			return {
				relayUrl: e,
				subId: `${t}:0`,
				request: Te(t),
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
		}), p = new Map(f.map((e) => [e.relayUrl, e])), m = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set(), y = [], b = !1, x, S, C = () => {}, w = () => {}, T = !1, ee = !1, E = !1, D = () => void 0, te = () => {
			f.forEach((e) => e.subscription?.unsubscribe?.()), y.forEach((e) => e.unsubscribe?.());
		}, O = (e) => {
			let r = qt(d, n !== void 0), i = r.map(({ event: e }) => e.created_at), o = i.length ? Math.min(...i) : null, c = i.length ? Math.max(...i) : null, p = f.map((t) => ({
				relayUrl: t.relayUrl,
				eoseReceived: t.eoseReceived,
				verificationDrained: t.verificationDrained,
				termination: e === "cancelled" ? "cancelled" : t.eoseReceived && t.verificationDrained ? "eose" : t.failed ? "error" : S === "quorum" ? "early-stop" : "timeout",
				rawCount: t.rawCount,
				oldestCreatedAt: t.oldestCreatedAt,
				saturated: t.rawCount >= a
			})), y = Ge({
				since: t.since,
				until: u,
				oldestCreatedAt: o,
				outcomes: p,
				cancelled: e === "cancelled"
			}), b = f.filter((e) => e.eoseReceived).map((e) => e.relayUrl), x = p.filter((e) => e.termination === "eose"), C = s.length > 0 && x.length >= Math.ceil(s.length / 2), w = t.since !== void 0 && je(y, s).some((e) => e.since <= t.since && e.until >= u), D = f.filter((e) => e.rawCount || e.eventIds.size).map((e) => ({
				relayUrl: e.relayUrl,
				rawCount: e.rawCount,
				uniqueCount: e.eventIds.size
			})).sort((e, t) => e.relayUrl.localeCompare(t.relayUrl)), te = f.flatMap((e) => e.oldestCreatedAt === null ? [] : [e.oldestCreatedAt]), O = f.reduce((e, t) => e + t.rawCount, 0), k = p.some((e) => e.saturated), ne = m.size > 0 || b.length > 0 || g.size > 0, A = f.length > 0 && !ne && f.every((e) => e.failed);
			return {
				status: e,
				completionReason: S,
				events: r,
				fetchedAt: this.now(),
				nextUntil: te.length ? Math.max(...te) : null,
				hasMore: k,
				relayUrls: l,
				observedRelayUrls: D.map((e) => e.relayUrl),
				rawCount: O,
				uniqueCount: r.length,
				duplicateCount: Math.max(0, O - r.length),
				perRelayCounts: D,
				oldestCreatedAt: o,
				newestCreatedAt: c,
				requestedRelayUrls: l,
				eventRelayUrls: Ut(m),
				eoseRelayUrls: b,
				closedRelayUrls: Ut(h),
				errorRelayUrls: Ut(_),
				downRelayUrls: Ut(v),
				completedByRxNostr: T,
				completedByLocalTimeout: ee,
				hasAnyRelayResponse: ne,
				allRelaysFailed: A,
				canonicalRelayUrls: s,
				relayOutcomes: p,
				relayFetchCoverage: y,
				coverageRequestRange: {
					since: t.since ?? null,
					until: u
				},
				...n && f[0] ? { page: {
					subscriptionId: f[0].subId,
					hints: f[0].hints,
					authRequired: f[0].authRequired,
					authAutoResent: f[0].authAutoResent,
					bufferLimited: E,
					requestCount: f[0].requestCount,
					eoseReceivedAt: f[0].eoseReceivedAt
				} } : {},
				...t.reason === "repair-visible-range" ? {
					coverageRelayUrls: s,
					coverageEoseRelayUrls: x.map((e) => e.relayUrl),
					bestEffortRelayUrls: [],
					coverageComplete: C && w,
					coverageSaturated: k && !w,
					allCoverageRelaysFailed: A
				} : {}
			};
		}, k = (e) => {
			let t = R.sanitizeExternalRelayUrls(e ? [e] : [])[0];
			return t ? p.get(t) : void 0;
		};
		return {
			promise: new Promise((r) => {
				D = (e) => {
					b || (b = !0, S ??= e === "success" ? "complete" : e, te(), C(), t.operation || x?.finish(S), r(O(e)));
				};
				let s = (e) => {
					S = e, ee = e === "timeout", T = e === "complete", D(e === "cancelled" ? "cancelled" : e === "timeout" ? "timeout" : f.length && f.every((e) => e.failed) ? "error" : "success");
				};
				if (x = t.operation ?? new ke(o, s, {
					now: this.now,
					setTimeoutFn: this.setTimeoutFn,
					clearTimeoutFn: this.clearTimeoutFn
				}), C = x.add(() => s(x.reason ?? "cancelled")), w = De(x, f, !n && t.reason !== "repair-visible-range", s), !b) {
					if (!f.length) D("error");
					else try {
						let r = (e, t) => {
							e && y.push(e.subscribe({ next: t }));
						};
						r(e.createAllMessageObservable?.(), (e) => {
							let t = k(e.from);
							if (t && !b) {
								if (e.type === "NOTICE") g.add(t.relayUrl);
								else if (e.subId === t.subId) {
									if (e.type === "EVENT") t.finished || (t.rawCount += 1), n && t.rawCount > a * 4 && (E = !0, D("error"));
									else if (e.type === "EOSE") {
										t.eoseReceived = !0, t.eoseReceivedAt = this.now();
										let n = e.message;
										t.hints = Array.isArray(n) && Array.isArray(n[2]) ? n[2].filter((e) => typeof e == "string" && [
											"finish",
											"more",
											"auth"
										].includes(e)) : [];
									} else e.type === "CLOSED" && (h.add(t.relayUrl), e.notice?.startsWith("auth-required:") ? t.authRequired = !0 : t.failed = !0);
								}
							}
						}), n && e.createOutgoingMessageObservable && y.push(e.createOutgoingMessageObservable().subscribe({ next: (e) => {
							let t = e.message, n = k(e.to);
							n && Array.isArray(t) && t[0] === "REQ" && t[1] === n.subId && (n.requestCount++, n.authRequired && (n.authAutoResent = !0));
						} })), r(e.createAllErrorObservable?.(), (e) => {
							let t = k(e.from);
							t && !t.finished && (t.failed = !0, _.add(t.relayUrl));
						}), r(e.createConnectionStateObservable?.(), (e) => {
							let t = k(e.from);
							t && !t.finished && [
								"error",
								"rejected",
								"terminated"
							].includes(e.state) && (t.failed = !0, v.add(t.relayUrl));
						});
						for (let r of f) {
							if (r.subscription = rt(e, r.request, { on: { relays: [r.relayUrl] } }).subscribe({
								next: (o) => {
									if (b) return;
									let s = o.event;
									if (s.pubkey !== t.pubkeyHex || !i.includes(s.kind) || t.since !== void 0 && s.created_at < t.since || t.until !== void 0 && s.created_at > t.until) return;
									m.add(r.relayUrl), r.eventIds.add(s.id), r.oldestCreatedAt = Math.min(r.oldestCreatedAt ?? s.created_at, s.created_at), r.newestCreatedAt = Math.max(r.newestCreatedAt ?? s.created_at, s.created_at), e.createAllMessageObservable || (r.rawCount += 1);
									let c = d.get(s.id);
									if (c) le(c.event, s) && c.relayUrls.add(r.relayUrl);
									else {
										if (n && d.size >= a) {
											E = !0, D("error");
											return;
										}
										d.set(s.id, {
											event: s,
											relayUrls: /* @__PURE__ */ new Set([r.relayUrl]),
											attestation: o.attestation
										});
									}
								},
								complete: () => {
									r.verificationDrained = !0, r.finished = !0, w();
								},
								error: () => {
									r.finished = !0, r.failed = !0, _.add(r.relayUrl), w();
								}
							}), b) {
								r.subscription?.unsubscribe?.();
								break;
							}
							r.finished || (r.request.emit({
								authors: [t.pubkeyHex],
								kinds: i,
								limit: a,
								...t.since === void 0 ? {} : { since: t.since },
								...t.until === void 0 ? {} : { until: t.until }
							}), r.request.over());
						}
						w();
					} catch {
						D("error");
					}
				}
			}),
			cancel: () => D("cancelled")
		};
	}
}(), Yt = class {
	createClient;
	constructor(e = Ae) {
		this.createClient = e;
	}
	run(e, t, n) {
		let r = new AbortController(), i = () => r.abort(), a, o, s = () => void 0, c = new Promise((e) => {
			s = e;
		});
		return r.signal.addEventListener("abort", () => s(null), { once: !0 }), t.addEventListener("abort", i, { once: !0 }), t.aborted && i(), {
			promise: (async () => {
				if (r.signal.aborted) return null;
				try {
					return a = this.createClient({
						verifier: we,
						signer: Ee(),
						skipVerify: !1,
						skipFetchNip11: !0,
						retry: { strategy: "off" }
					}), o = a.createAllMessageObservable().subscribe(({ message: e }) => {
						Array.isArray(e) && e[0] === "CLOSED" && typeof e[2] == "string" && e[2].startsWith("auth-required:") && i();
					}), await Promise.race([n(a, r.signal), c]);
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
			let a = Jt.fetchRelayPage(n, {
				...t,
				relayUrl: e,
				timeoutMs: zt,
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
	fetchRelated(e, t, n, r) {
		return this.run(e, n, async (n, i) => {
			let a = Te(), o = /* @__PURE__ */ new Map();
			return new Promise((s) => {
				let c, l = () => {
					c?.unsubscribe(), i.removeEventListener("abort", l), s([...o.values()]);
				};
				i.addEventListener("abort", l, { once: !0 }), c = Oe(n, a, { on: { relays: [e] } }, {
					operation: r,
					quorum: !1,
					timeoutMs: zt,
					source: (e, t) => rt(n, e, t)
				}).subscribe({
					next: ({ event: e, attestation: n }) => {
						!i.aborted && re(t, e) && o.size < (t.limit ?? 150) && o.set(e.id, {
							event: e,
							attestation: n
						});
					},
					complete: l,
					error: l
				}), i.aborted ? l() : (a.emit(t), a.over());
			});
		});
	}
	storeSignedEvent(e, t, n) {
		return this.storeSignedEvents(e, [t], n);
	}
	storeSignedEvents(e, t, n) {
		let r = [...new Map(t.map((e) => [e.id, e])).values()];
		return r.length ? this.run(e, n, async (t, n) => {
			let i = new ke(zt, () => void 0);
			i.bind(n);
			try {
				let n = await Promise.all(r.map((n) => ct(t, n, {
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
}, Xt = /^(0|[1-9]\d{0,4})$/, Zt = {
	status: "valid",
	ruleVersion: 1
};
function Qt(e) {
	return e?.status === "valid" && e.ruleVersion === 1;
}
function $t(e, t) {
	return Ye(e, t) ? {
		event: e,
		attestation: t
	} : qe(e);
}
function en(e) {
	if (typeof e != "string" || !Xt.test(e)) return null;
	let t = Number(e);
	return Number.isInteger(t) && t >= 0 && t <= 65535 ? t : null;
}
function tn(e) {
	let t = e.tags.filter((e) => e[0] === "k");
	if (t.length === 0) return !0;
	let n = t.map((e) => en(e[1]));
	return n.some((e) => e === null) ? !0 : n.some((e) => e !== null && Ne(e));
}
function nn(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) n?.id && n.pubkey && t.set(n.id, n);
	return t;
}
function rn(e, t) {
	let n = e.get(t.targetAuthorPubkey) ?? /* @__PURE__ */ new Set();
	n.add(t.targetEventId), e.set(t.targetAuthorPubkey, n);
}
function an(e, t) {
	return e.targetAuthorPubkey !== t.targetAuthorPubkey || e.targetEventId !== t.targetEventId || e.schemaVersion !== t.schemaVersion || e.deletionEventId !== t.deletionEventId || e.deletionEventPubkey !== t.deletionEventPubkey || Be(e) !== Be(t) || e.deletedAt !== t.deletedAt || e.reason !== t.reason || !le(e.rawEvent, t.rawEvent) || e.rawEventVerification?.status !== t.rawEventVerification?.status || e.rawEventVerification?.ruleVersion !== t.rawEventVerification?.ruleVersion || !nt(e.relayUrls, t.relayUrls);
}
function on(e, t, n) {
	let r = Qt(e.rawEventVerification) && !le(e.rawEvent, t.rawEvent);
	return {
		...t,
		...r ? {
			rawEvent: e.rawEvent,
			rawEventVerification: e.rawEventVerification
		} : {},
		targetVerified: Be(e) || Be(t),
		relayUrls: R.sanitizeExternalRelayUrls([...e.relayUrls, ...t.relayUrls]),
		fetchedAt: Math.max(e.fetchedAt, t.fetchedAt),
		updatedAt: n(),
		schemaVersion: 2
	};
}
var sn = new class {
	db;
	now;
	constructor(e = Y, t = Date.now) {
		this.db = e, this.now = t;
	}
	async getDeletedTargets(e) {
		let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
		for (let t of e) t.targetAuthorPubkey && t.targetEventId && n.set(`${t.targetAuthorPubkey}:${t.targetEventId}`, t);
		for (let e of n.values()) {
			let n = await this.db.postHistoryDeletionRequests.where("[targetAuthorPubkey+targetEventId]").equals([e.targetAuthorPubkey, e.targetEventId]).toArray().then((e) => X(this.db, "postHistoryDeletionRequests").hydrate(e));
			for (let e of n) Be(e) && rn(t, e);
		}
		return t;
	}
	async getAllForTargetAuthorPubkey(e) {
		return e ? this.db.postHistoryDeletionRequests.where("targetAuthorPubkey").equals(e).toArray().then((e) => X(this.db, "postHistoryDeletionRequests").hydrate(e)) : [];
	}
	async saveLocalDeletion(e) {
		let t = $t(e.deletionEvent, e.attestation);
		if (!t) throw Error("invalid_local_deletion_event");
		let n = t.event, r = Array.from(/* @__PURE__ */ new Set([...e.targetEventId ? [e.targetEventId] : [], ...e.targetEventIds ?? []]));
		if (r.length === 0 || n.kind !== 5 || !B(n.id)) throw Error("invalid_local_deletion_event");
		let i = e.fetchedAt ?? this.now(), a = null;
		await this.db.transaction("rw", this.db.events, this.db.postHistoryDeletionRequests, this.db.postHistory, this.db.sensitivePayloads, async () => {
			let t = e.targetEvent ? qe(e.targetEvent)?.event : null, o = await X(this.db, "postHistory").get(r[0]), s = o ?? (t && t.id === r[0] ? {
				eventId: t.id,
				pubkeyHex: t.pubkey,
				kind: t.kind,
				rawEvent: t
			} : void 0);
			if (!s || !Ne(s.kind) || !Fe(n, {
				id: s.eventId,
				pubkey: s.pubkeyHex
			})) throw Error("local_deletion_target_not_found");
			let c = s.rawEvent, l = (Le(c) ? Pe(c) : null)?.eventId;
			for (let t of r) {
				let r = !1;
				if (t === s.eventId) r = Fe(n, {
					id: s.eventId,
					pubkey: s.pubkeyHex
				});
				else if (t === l) {
					let e = await X(this.db, "sensitivePayloads").get(t);
					r = !!e && e.deletedAt === void 0 && e.pubkeyHex === s.pubkeyHex && He(c, e.rawEvent, t) && Fe(n, {
						id: t,
						pubkey: s.pubkeyHex
					});
				}
				if (!r) continue;
				let a = Ve({
					deletionEvent: n,
					targetEventId: t,
					targetVerified: !0,
					relayUrls: e.relayUrls,
					fetchedAt: i
				}, this.now);
				a.rawEventVerification = { ...Zt };
				let o = await X(this.db, "postHistoryDeletionRequests").get(a.id), u = o ? on(o, a, this.now) : a;
				if (await X(this.db, "postHistoryDeletionRequests").put(u), t === l) {
					let r = await X(this.db, "sensitivePayloads").get(t);
					r && await X(this.db, "sensitivePayloads").put({
						...r,
						deletedAt: e.deletedAt,
						deletionEventId: n.id,
						updatedAt: this.now()
					});
				}
			}
			o && (o.deletedAt !== e.deletedAt || o.deletionEventId !== n.id) && (await X(this.db, "postHistory").put({
				...o,
				deletedAt: e.deletedAt,
				deletionEventId: n.id,
				updatedAt: this.now()
			}), a = s.pubkeyHex);
		}), a && Ze(a);
	}
	async upsertValidDeletionRequests(e) {
		if (e.targetEvents.length === 0 || e.deletionEvents.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: e.deletionEvents.length
		};
		let t = e.deletionEvents.flatMap((e) => {
			let t = $t(e.event, e.attestation);
			return t ? [{
				...e,
				event: t.event,
				attestation: t.attestation
			}] : [];
		}), n = nn(e.targetEvents), r = e.fetchedAt ?? this.now(), i = /* @__PURE__ */ new Map(), a = e.deletionEvents.length - t.length;
		for (let e of t) {
			let t = e.event.tags.filter((e) => e[0] === "e" && typeof e[1] == "string").map((e) => e[1]), o = !1;
			for (let a of t) {
				let t = n.get(a);
				if (!t) continue;
				let s = i.get(tt(t.pubkey, t.id, e.event.id)), c = Re({
					deletionEvent: e.event,
					targetEvent: t,
					relayUrls: R.sanitizeExternalRelayUrls([...s?.relayUrls ?? [], ...e.relayUrls ?? []]),
					fetchedAt: r
				}, this.now);
				c && (c.rawEventVerification = { ...Zt }, i.set(c.id, c), o = !0);
			}
			o || (a += 1);
		}
		let o = Array.from(i.values());
		if (o.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: a
		};
		let s = 0, c = 0, l = 0;
		return await this.db.transaction("rw", this.db.events, this.db.postHistoryDeletionRequests, async () => {
			let e = await X(this.db, "postHistoryDeletionRequests").bulkGet(o.map((e) => e.id)), t = /* @__PURE__ */ new Map();
			e.forEach((e) => {
				e && t.set(e.id, e);
			});
			let n = o.map((e) => {
				let n = t.get(e.id);
				if (!n) return s += 1, e;
				let r = on(n, e, this.now);
				return an(n, r) ? c += 1 : l += 1, r;
			});
			await X(this.db, "postHistoryDeletionRequests").bulkPut(n);
		}), {
			insertedCount: s,
			updatedCount: c,
			unchangedCount: l,
			ignoredCount: a
		};
	}
	async upsertImportedDeletionEvents(e) {
		let t = e.fetchedAt ?? this.now(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = 0;
		for (let a of e.deletionEvents) {
			let o = $t(a.event, a.attestation);
			if (!o) {
				i += 1;
				continue;
			}
			let s = o.event;
			if (s.kind !== 5 || s.pubkey !== e.ownerPubkeyHex || !B(s.id)) {
				i += 1;
				continue;
			}
			let c = s.tags.filter((e) => e[0] === "e" && typeof e[1] == "string" && B(e[1])).map((e) => e[1]), l = Array.from(new Set(c));
			if (l.length === 0) {
				i += 1;
				continue;
			}
			let u = tn(s);
			r.add(s.id);
			for (let e of l) {
				let r = Ve({
					deletionEvent: s,
					targetEventId: e,
					targetVerified: !1,
					relayUrls: [],
					fetchedAt: t
				}, this.now);
				r.rawEventVerification = { ...Zt }, n.set(r.id, {
					record: r,
					shouldStoreWithoutTarget: u
				});
			}
		}
		let a = Array.from(n.values());
		if (a.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: i,
			appliedDeletionCount: 0
		};
		let o = 0, s = 0, c = 0, l = 0, u = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set();
		await this.db.transaction("rw", [
			this.db.events,
			this.db.postHistoryDeletionRequests,
			this.db.postHistory,
			...e.localWriteScope ? [this.db.postHistoryWriteGeneration] : []
		], async () => {
			await it(this.db, e.localWriteScope);
			let t = await X(this.db, "postHistoryDeletionRequests").bulkGet(a.map((e) => e.record.id)), n = Array.from(new Set(a.map((e) => e.record.targetEventId))), p = await X(this.db, "postHistory").bulkGet(n), m = new Map(p.filter((e) => !!e).map((e) => [e.eventId, e])), h = [], g = /* @__PURE__ */ new Set();
			a.forEach((e, n) => {
				let { record: r } = e, i = m.get(r.targetEventId);
				if (i && !Ne(i.kind) || !i && !e.shouldStoreWithoutTarget) return;
				i && i.deletedAt !== void 0 && i.rawEventVerification?.status === "valid" && i.rawEventVerification.ruleVersion === 1 && se(i.rawEvent, i) && !Pe(i.rawEvent) && f.add(r.targetEventId);
				let a = !!i && Ne(i.kind) && i.pubkeyHex === r.targetAuthorPubkey && i.pubkeyHex === r.deletionEventPubkey, l = {
					...r,
					targetVerified: a
				};
				u.add(r.targetEventId), g.add(r.deletionEventId);
				let p = t[n];
				if (!p) {
					o += 1, d.add(r.targetEventId), h.push(l);
					return;
				}
				let _ = on(p, l, this.now);
				an(p, _) ? (s += 1, d.add(r.targetEventId), h.push(_)) : c += 1;
			});
			for (let e of r) g.has(e) || (i += 1);
			h.length > 0 && await X(this.db, "postHistoryDeletionRequests").bulkPut(h);
			for (let e of n) {
				let t = m.get(e);
				if (!t || !Ne(t.kind) || t.deletedAt !== void 0) continue;
				let n = (await this.db.postHistoryDeletionRequests.where("targetEventId").equals(e).toArray().then((e) => X(this.db, "postHistoryDeletionRequests").hydrate(e))).filter((e) => Be(e) && e.targetAuthorPubkey === t.pubkeyHex && e.deletionEventPubkey === t.pubkeyHex).sort(ze)[0];
				if (!n) continue;
				let r = st(n);
				await X(this.db, "postHistory").update(e, {
					...r,
					updatedAt: this.now()
				}), l += 1;
			}
			await it(this.db, e.localWriteScope);
		});
		let p = Array.from(new Set(a.map((e) => e.record.targetEventId)));
		for (let e of p) u.has(e) && !d.has(e) && f.has(e) || (await Je(e, this.db, this.now), await Xe(e, this.db, this.now));
		return {
			insertedCount: o,
			updatedCount: s,
			unchangedCount: c,
			ignoredCount: i,
			appliedDeletionCount: l
		};
	}
}(), cn = new class {
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
	constructor(e = {}) {
		this.transport = e.transport, this.repository = e.repository ?? Ke, this.payloads = e.payloads ?? at, this.deletions = e.deletions ?? sn, this.getLocalRevision = e.getLocalRevision ?? ((e) => et(Y, e)), this.runtimeKind = e.runtimeKind ?? (() => oe().runtimeKind);
	}
	getTransport() {
		return this.transport ??= new Yt();
	}
	configureSession(e) {
		this.cancelSession();
		let t = e.url && ft(e.url);
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
		let r = [...new Map(t.filter(({ event: t, attestation: n }) => t.pubkey === e.ownerPubkeyHex && (Ue(t.kind) || t.kind === 5 || t.kind === 36) && Ye(t, n) && !this.stores.has(`${e.url}:${t.id}`)).map((e) => [e.event.id, e])).values()];
		if (!r.length) return;
		let i = r.map(({ event: t }) => `${e.url}:${t.id}`), a = Promise.resolve().then(async () => {
			if (!this.isCurrent(e) || !n()) return;
			let t = r.filter(({ event: e, attestation: t }) => Ye(e, t)).map(({ event: e }) => e);
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
		let a = new ke(zt, () => n.abort());
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
						kindsKey: We,
						localRelayUrl: t.url,
						browsingRanges: c.browsingRanges,
						...e.reason !== "repair-visible-range" && l != null ? {
							resumeHint: { nextUntil: l },
							initializeResumeHintOnly: e.reason !== "older-backfill"
						} : {}
					}
				});
				if (u.applied === !1 || !o()) return null;
				let d = u.insertedCount + u.updatedCount + u.appliedDeletionCount > 0, f = [...new Map([...c.events.map(({ event: e }) => e), ...e.targets ?? []].filter((e) => e.pubkey === t.ownerPubkeyHex && Ue(e.kind)).map((e) => [e.id, e])).values()], p = f.flatMap((e) => {
					let t = Pe(e);
					return t ? [t.eventId] : [];
				}), m = [...f.map((e) => e.id), ...p], h = await Promise.allSettled([p.length ? this.getTransport().fetchRelated(t.url, {
					ids: [...new Set(p)],
					authors: [t.ownerPubkeyHex],
					kinds: [36],
					limit: p.length
				}, n.signal, a).promise : Promise.resolve([]), m.length ? this.getTransport().fetchRelated(t.url, {
					authors: [t.ownerPubkeyHex],
					kinds: [5],
					"#e": [...new Set(m)],
					limit: e.limit ?? 150
				}, n.signal, a).promise : Promise.resolve([])]);
				if (o()) {
					let e = h[0].status === "fulfilled" ? h[0].value ?? [] : [];
					for (let t of e) {
						if (!o()) break;
						f.some((e) => He(e, t.event)) && (await this.payloads.putCandidate({
							...t,
							localWriteScope: s
						}), d = !0);
					}
					let n = h[1].status === "fulfilled" ? h[1].value ?? [] : [];
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
			let r = t.expectedRevision, i = () => this.isCurrent(n) && t.isActive(), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
			for (let n of e) {
				if (!i()) return;
				if (a.has(n.event.id) || n.event.pubkey !== t.ownerPubkeyHex || !Ue(n.event.kind)) continue;
				let e = await this.repository.getByEventId(n.event.id);
				if (!i() || await this.getLocalRevision(t.ownerPubkeyHex) !== r) return;
				if (!e || e.pubkeyHex !== t.ownerPubkeyHex || !le(e.rawEvent, n.event)) continue;
				let c = Ye(n.event, n.attestation) ? {
					event: n.event,
					attestation: n.attestation
				} : qe(e.rawEvent);
				if (!c) continue;
				a.set(c.event.id, c.event), e.deletedAt === void 0 && o.set(c.event.id, c);
				let l = Pe(c.event);
				if (l) {
					let t = s.get(l.eventId) ?? [];
					t.push({
						event: c.event,
						deleted: e.deletedAt !== void 0
					}), s.set(l.eventId, t);
				}
			}
			if (!a.size || !i()) return;
			let c = await this.payloads.getByIds([...s.keys()]);
			if (!i() || await this.getLocalRevision(t.ownerPubkeyHex) !== r) return;
			for (let e of c) {
				let t = s.get(e.id)?.filter(({ event: t }) => He(t, e.rawEvent)) ?? [], n = t.length ? qe(e.rawEvent) : null;
				n && (a.set(n.event.id, n.event), e.deletedAt === void 0 && t.some(({ deleted: e }) => !e) && o.set(n.event.id, n));
			}
			let l = await this.deletions.getAllForTargetAuthorPubkey(t.ownerPubkeyHex);
			if (i() && await this.getLocalRevision(t.ownerPubkeyHex) === r) {
				for (let e of l) {
					if (![...a.values()].some((t) => Fe(e.rawEvent, t))) continue;
					let t = qe(e.rawEvent);
					t && o.set(t.event.id, t);
				}
				this.storeBatch(n, [...o.values()], i);
			}
		})().catch(() => void 0);
	}
}();
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/on-mount-effect.svelte.js
function ln(e) {
	b(() => T(() => e()));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/timeout-fn.js
var un = class {
	#e;
	#t;
	#n = null;
	constructor(e, t) {
		this.#t = e, this.#e = t, this.stop = this.stop.bind(this), this.start = this.start.bind(this), be(this.stop);
	}
	#r() {
		this.#n !== null && (window.clearTimeout(this.#n), this.#n = null);
	}
	stop() {
		this.#r();
	}
	start(...e) {
		this.#r(), this.#n = window.setTimeout(() => {
			this.#n = null, this.#t(...e);
		}, this.#e);
	}
}, dn = pe({
	component: "tooltip",
	parts: ["content", "trigger"]
}), fn = new H("Tooltip.Provider"), pn = new H("Tooltip.Root"), mn = class {
	#e = N(E(/* @__PURE__ */ new Map()));
	get triggers() {
		return D(this.#e);
	}
	set triggers(e) {
		C(this.#e, e, !0);
	}
	#t = N(null);
	get activeTriggerId() {
		return D(this.#t);
	}
	set activeTriggerId(e) {
		C(this.#t, e, !0);
	}
	#n = F(() => {
		let e = this.activeTriggerId;
		return e === null ? null : this.triggers.get(e)?.node ?? null;
	});
	get activeTriggerNode() {
		return D(this.#n);
	}
	set activeTriggerNode(e) {
		C(this.#n, e);
	}
	#r = F(() => {
		let e = this.activeTriggerId;
		return e === null ? null : this.triggers.get(e)?.payload ?? null;
	});
	get activePayload() {
		return D(this.#r);
	}
	set activePayload(e) {
		C(this.#r, e);
	}
	register = (e) => {
		let t = new Map(this.triggers);
		t.set(e.id, e), this.triggers = t, this.#i();
	};
	update = (e) => {
		let t = new Map(this.triggers);
		t.set(e.id, e), this.triggers = t, this.#i();
	};
	unregister = (e) => {
		if (!this.triggers.has(e)) return;
		let t = new Map(this.triggers);
		t.delete(e), this.triggers = t, this.activeTriggerId === e && (this.activeTriggerId = null);
	};
	setActiveTrigger = (e) => {
		this.activeTriggerId = e === null ? null : this.triggers.has(e) ? e : null;
	};
	get = (e) => this.triggers.get(e);
	has = (e) => this.triggers.has(e);
	getFirstTriggerId = () => {
		let e = this.triggers.entries().next();
		return e.done ? null : e.value[0];
	};
	#i = () => {
		let e = this.activeTriggerId;
		e !== null && (this.triggers.has(e) || (this.activeTriggerId = null));
	};
}, hn = class t {
	static create(e) {
		return fn.set(new t(e));
	}
	opts;
	#e = N(!0);
	get isOpenDelayed() {
		return D(this.#e);
	}
	set isOpenDelayed(e) {
		C(this.#e, e, !0);
	}
	isPointerInTransit = he(!1);
	#t;
	#n = N(null);
	constructor(t) {
		this.opts = t, this.#t = new un(() => {
			this.isOpenDelayed = !0;
		}, this.opts.skipDelayDuration.current), ln(() => e(window, "scroll", (e) => {
			let t = D(this.#n);
			if (!t) return;
			let n = t.triggerNode;
			if (!n) return;
			let r = e.target;
			(r instanceof Element || r instanceof Document) && r.contains(n) && t.handleClose();
		}, {
			capture: !0,
			passive: !0
		}));
	}
	#r = () => {
		this.opts.skipDelayDuration.current === 0 ? this.isOpenDelayed = !0 : this.#t.start();
	};
	#i = () => {
		this.#t.stop();
	};
	onOpen = (e) => {
		D(this.#n) && D(this.#n) !== e && D(this.#n).handleClose(), this.#i(), this.isOpenDelayed = !1, C(this.#n, e, !0);
	};
	onClose = (e) => {
		D(this.#n) === e && (C(this.#n, null), this.#r());
	};
	isTooltipOpen = (e) => D(this.#n) === e;
}, gn = class e {
	static create(t) {
		return pn.set(new e(t, fn.get()));
	}
	opts;
	provider;
	#e = F(() => this.opts.delayDuration.current ?? this.provider.opts.delayDuration.current);
	get delayDuration() {
		return D(this.#e);
	}
	set delayDuration(e) {
		C(this.#e, e);
	}
	#t = F(() => this.opts.disableHoverableContent.current ?? this.provider.opts.disableHoverableContent.current);
	get disableHoverableContent() {
		return D(this.#t);
	}
	set disableHoverableContent(e) {
		C(this.#t, e);
	}
	#n = F(() => this.opts.disableCloseOnTriggerClick.current ?? this.provider.opts.disableCloseOnTriggerClick.current);
	get disableCloseOnTriggerClick() {
		return D(this.#n);
	}
	set disableCloseOnTriggerClick(e) {
		C(this.#n, e);
	}
	#r = F(() => this.opts.disabled.current ?? this.provider.opts.disabled.current);
	get disabled() {
		return D(this.#r);
	}
	set disabled(e) {
		C(this.#r, e);
	}
	#i = F(() => this.opts.ignoreNonKeyboardFocus.current ?? this.provider.opts.ignoreNonKeyboardFocus.current);
	get ignoreNonKeyboardFocus() {
		return D(this.#i);
	}
	set ignoreNonKeyboardFocus(e) {
		C(this.#i, e);
	}
	registry;
	tether;
	#a = N(null);
	get contentNode() {
		return D(this.#a);
	}
	set contentNode(e) {
		C(this.#a, e, !0);
	}
	contentPresence;
	#o = N(!1);
	#s;
	#c = F(() => this.opts.open.current ? D(this.#o) ? "delayed-open" : "instant-open" : "closed");
	get stateAttr() {
		return D(this.#c);
	}
	set stateAttr(e) {
		C(this.#c, e);
	}
	constructor(e, t) {
		this.opts = e, this.provider = t, this.tether = e.tether.current?.state ?? null, this.registry = this.tether?.registry ?? new mn(), this.#s = new un(() => {
			C(this.#o, !0), this.opts.open.current = !0;
		}, this.delayDuration ?? 0), this.tether && (this.tether.root = this, ln(() => () => {
			this.tether?.root === this && (this.tether.root = null);
		})), this.contentPresence = new St({
			open: this.opts.open,
			ref: q(() => this.contentNode),
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), U(() => this.delayDuration, () => {
			this.delayDuration !== void 0 && (this.#s = new un(() => {
				C(this.#o, !0), this.opts.open.current = !0;
			}, this.delayDuration));
		}), U(() => this.opts.open.current, (e) => {
			e ? (this.ensureActiveTrigger(), this.provider.onOpen(this)) : this.provider.onClose(this);
		}, { lazy: !0 }), U(() => this.opts.triggerId.current, (e) => {
			e !== this.registry.activeTriggerId && this.registry.setActiveTrigger(e);
		}), U(() => this.registry.activeTriggerId, (e) => {
			this.opts.triggerId.current !== e && (this.opts.triggerId.current = e);
		});
	}
	handleOpen = () => {
		this.#s.stop(), C(this.#o, !1), this.ensureActiveTrigger(), this.opts.open.current = !0;
	};
	handleClose = () => {
		this.#s.stop(), this.opts.open.current = !1;
	};
	cancelPendingOpen = () => {
		this.#s.stop();
	};
	#l = () => {
		this.#s.stop();
		let e = !this.provider.isOpenDelayed, t = this.delayDuration ?? 0;
		e || t === 0 ? (C(this.#o, !1), this.opts.open.current = !0) : this.#s.start();
	};
	onTriggerEnter = (e) => {
		this.setActiveTrigger(e), this.#l();
	};
	onTriggerLeave = () => {
		this.disableHoverableContent ? this.handleClose() : this.#s.stop();
	};
	ensureActiveTrigger = () => {
		if (this.registry.activeTriggerId !== null && this.registry.has(this.registry.activeTriggerId)) return;
		if (this.opts.triggerId.current !== null && this.registry.has(this.opts.triggerId.current)) {
			this.registry.setActiveTrigger(this.opts.triggerId.current);
			return;
		}
		let e = this.registry.getFirstTriggerId();
		this.registry.setActiveTrigger(e);
	};
	setActiveTrigger = (e) => {
		this.registry.setActiveTrigger(e);
	};
	registerTrigger = (e) => {
		this.registry.register(e), e.disabled && this.registry.activeTriggerId === e.id && this.opts.open.current && this.handleClose();
	};
	updateTrigger = (e) => {
		this.registry.update(e), e.disabled && this.registry.activeTriggerId === e.id && this.opts.open.current && this.handleClose();
	};
	unregisterTrigger = (e) => {
		let t = this.registry.activeTriggerId === e;
		this.registry.unregister(e), t && this.opts.open.current && this.handleClose();
	};
	isActiveTrigger = (e) => this.registry.activeTriggerId === e;
	get triggerNode() {
		return this.registry.activeTriggerNode;
	}
	get activePayload() {
		return this.registry.activePayload;
	}
	get activeTriggerId() {
		return this.registry.activeTriggerId;
	}
}, _n = class e {
	static create(t) {
		return t.tether.current ? new e(t, null, t.tether.current.state) : new e(t, pn.get(), null);
	}
	opts;
	root;
	tether;
	attachment;
	#e = he(!1);
	#t = N(!1);
	domContext;
	#n = null;
	#r = !1;
	#i = null;
	constructor(e, t, n) {
		this.opts = e, this.root = t, this.tether = n, this.domContext = new me(e.ref), this.attachment = fe(this.opts.ref, (e) => this.#s(e)), U(() => this.opts.id.current, () => {
			this.#s(this.opts.ref.current);
		}), U(() => this.opts.payload.current, () => {
			this.#s(this.opts.ref.current);
		}), U(() => this.opts.disabled.current, () => {
			this.#s(this.opts.ref.current);
		}), ln(() => (this.#r = !0, this.#s(this.opts.ref.current), () => {
			let e = this.#a(), t = this.#i;
			t && (this.tether ? this.tether.registry.unregister(t) : e?.unregisterTrigger(t)), this.#i = null, this.#r = !1;
		}));
	}
	#a = () => this.tether?.root ?? this.root;
	#o = () => {
		let e = this.#a();
		return this.opts.disabled.current || !!e?.disabled;
	};
	#s = (e) => {
		if (!this.#r) return;
		let t = this.opts.id.current, n = this.opts.payload.current, r = this.opts.disabled.current;
		if (this.#i && this.#i !== t) {
			let e = this.#a();
			this.tether ? this.tether.registry.unregister(this.#i) : e?.unregisterTrigger(this.#i);
		}
		let i = {
			id: t,
			node: e,
			payload: n,
			disabled: r
		}, a = this.#a();
		this.tether ? (this.tether.registry.has(t) ? this.tether.registry.update(i) : this.tether.registry.register(i), r && this.tether.registry.activeTriggerId === t && a?.opts.open.current && a.handleClose()) : a?.registry.has(t) ? a.updateTrigger(i) : a?.registerTrigger(i), this.#i = t;
	};
	#c = () => {
		this.#n !== null && (clearTimeout(this.#n), this.#n = null);
	};
	handlePointerUp = () => {
		this.#e.current = !1;
	};
	#l = () => {
		this.#o() || (this.#e.current = !1);
	};
	#u = () => {
		if (this.#o()) return;
		let e = this.#a();
		e && !e.disableCloseOnTriggerClick && (e.opts.open.current ? e.handleClose() : e.cancelPendingOpen()), this.#e.current = !0, this.domContext.getDocument().addEventListener("pointerup", () => {
			this.handlePointerUp();
		}, { once: !0 });
	};
	#d = (e) => {
		let t = this.#a();
		t && (this.#o() ? t.opts.open.current && t.handleClose() : e.pointerType !== "touch" && (t.provider.isPointerInTransit.current ? (this.#c(), this.#n = window.setTimeout(() => {
			t.provider.isPointerInTransit.current && (t.provider.isPointerInTransit.current = !1, t.onTriggerEnter(this.opts.id.current), C(this.#t, !0));
		}, 250)) : (t.onTriggerEnter(this.opts.id.current), C(this.#t, !0))));
	};
	#f = (e) => {
		let t = this.#a();
		t && (this.#o() ? t.opts.open.current && t.handleClose() : e.pointerType !== "touch" && (D(this.#t) || (this.#c(), t.provider.isPointerInTransit.current = !1, t.onTriggerEnter(this.opts.id.current), C(this.#t, !0))));
	};
	#p = (e) => {
		let t = this.#a();
		if (!t || this.#o()) return;
		if (this.#c(), !t.isActiveTrigger(this.opts.id.current)) {
			C(this.#t, !1);
			return;
		}
		let n = e.relatedTarget;
		if (W(n)) {
			for (let e of t.registry.triggers.values()) if (e.node === n) {
				if (t.provider.opts.skipDelayDuration.current > 0) {
					C(this.#t, !1);
					return;
				}
				t.handleClose(), C(this.#t, !1);
				return;
			}
		}
		t.onTriggerLeave(), C(this.#t, !1);
	};
	#m = (e) => {
		let t = this.#a();
		t && (this.#e.current || (this.#o() ? t.opts.open.current && t.handleClose() : (!t.ignoreNonKeyboardFocus || ve(e.currentTarget)) && (t.setActiveTrigger(this.opts.id.current), t.handleOpen())));
	};
	#h = () => {
		let e = this.#a();
		e && !this.#o() && e.handleClose();
	};
	#g = () => {
		let e = this.#a();
		!e || e.disableCloseOnTriggerClick || this.#o() || e.handleClose();
	};
	#_ = F(() => {
		let e = this.#a(), t = !!(e?.opts.open.current && e.isActiveTrigger(this.opts.id.current)), n = this.#o();
		return {
			id: this.opts.id.current,
			"aria-describedby": t ? e?.contentNode?.id : void 0,
			"data-state": t ? e?.stateAttr : "closed",
			"data-disabled": ge(n),
			"data-delay-duration": `${e?.delayDuration ?? 0}`,
			[dn.trigger]: "",
			tabindex: n ? void 0 : this.opts.tabindex.current,
			disabled: this.opts.disabled.current,
			onpointerup: this.#l,
			onpointerdown: this.#u,
			onpointerenter: this.#d,
			onpointermove: this.#f,
			onpointerleave: this.#p,
			onfocus: this.#m,
			onblur: this.#h,
			onclick: this.#g,
			...this.attachment
		};
	});
	get props() {
		return D(this.#_);
	}
	set props(e) {
		C(this.#_, e);
	}
}, vn = class e {
	static create(t) {
		return new e(t, pn.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = fe(this.opts.ref, (e) => this.root.contentNode = e), new Dt({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open.current && !this.root.disableHoverableContent,
			transitIntentTimeout: 180,
			ignoredTargets: () => {
				if (this.root.provider.opts.skipDelayDuration.current === 0) return [];
				let e = [], t = this.root.triggerNode;
				for (let n of this.root.registry.triggers.values()) n.node && n.node !== t && e.push(n.node);
				return e;
			},
			onPointerExit: () => {
				this.root.provider.isTooltipOpen(this.root) && this.root.handleClose();
			}
		});
	}
	onInteractOutside = (e) => {
		W(e.target) && this.root.triggerNode?.contains(e.target) && this.root.disableCloseOnTriggerClick ? e.preventDefault() : (this.opts.onInteractOutside.current(e), !e.defaultPrevented && this.root.handleClose());
	};
	onEscapeKeydown = (e) => {
		this.opts.onEscapeKeydown.current?.(e), !e.defaultPrevented && this.root.handleClose();
	};
	onOpenAutoFocus = (e) => {
		e.preventDefault();
	};
	onCloseAutoFocus = (e) => {
		e.preventDefault();
	};
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
	#e = F(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return D(this.#e);
	}
	set snippetProps(e) {
		C(this.#e, e);
	}
	#t = F(() => ({
		id: this.opts.id.current,
		"data-state": this.root.stateAttr,
		"data-disabled": ge(this.root.disabled),
		...J(this.root.contentPresence.transitionStatus),
		style: { outline: "none" },
		[dn.content]: "",
		...this.attachment
	}));
	get props() {
		return D(this.#t);
	}
	set props(e) {
		C(this.#t, e);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus
	};
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip.svelte
function yn(e, t) {
	r(t, !0);
	let n = k(t, "open", 15, !1), a = k(t, "triggerId", 15, null), o = k(t, "onOpenChange", 3, K), s = k(t, "onOpenChangeComplete", 3, K), c = gn.create({
		open: q(() => n(), (e) => {
			n(e), o()(e);
		}),
		triggerId: q(() => a(), (e) => {
			a(e);
		}),
		delayDuration: q(() => t.delayDuration),
		disableCloseOnTriggerClick: q(() => t.disableCloseOnTriggerClick),
		disableHoverableContent: q(() => t.disableHoverableContent),
		ignoreNonKeyboardFocus: q(() => t.ignoreNonKeyboardFocus),
		disabled: q(() => t.disabled),
		onOpenChangeComplete: q(() => s()),
		tether: q(() => t.tether)
	});
	Tt(e, {
		tooltip: !0,
		children: (e, n) => {
			var r = i(), a = x(r);
			d(a, () => t.children ?? u, () => ({
				open: c.opts.open.current,
				triggerId: c.activeTriggerId,
				payload: c.activePayload
			})), h(e, r);
		},
		$$slots: { default: !0 }
	}), p();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-content.svelte
var bn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"side",
	"sideOffset",
	"align",
	"avoidCollisions",
	"arrowPadding",
	"sticky",
	"strategy",
	"hideWhenDetached",
	"customAnchor",
	"collisionPadding",
	"onInteractOutside",
	"onEscapeKeydown",
	"forceMount",
	"style"
]), xn = s("<div><div><!></div></div>");
function Sn(e, t) {
	let n = o();
	r(t, !0);
	let a = k(t, "id", 19, () => _e(n)), s = k(t, "ref", 15, null), c = k(t, "side", 3, "top"), f = k(t, "sideOffset", 3, 0), m = k(t, "align", 3, "center"), g = k(t, "avoidCollisions", 3, !0), _ = k(t, "arrowPadding", 3, 0), b = k(t, "sticky", 3, "partial"), S = k(t, "hideWhenDetached", 3, !1), C = k(t, "collisionPadding", 3, 0), T = k(t, "onInteractOutside", 3, K), ee = k(t, "onEscapeKeydown", 3, K), E = k(t, "forceMount", 3, !1), te = w(t, bn), O = vn.create({
		id: q(() => a()),
		ref: q(() => s(), (e) => s(e)),
		onInteractOutside: q(() => T()),
		onEscapeKeydown: q(() => ee())
	}), ne = F(() => ({
		side: c(),
		sideOffset: f(),
		align: m(),
		avoidCollisions: g(),
		arrowPadding: _(),
		sticky: b(),
		hideWhenDetached: S(),
		collisionPadding: C(),
		strategy: t.strategy,
		customAnchor: t.customAnchor ?? O.root.triggerNode
	})), A = F(() => G(te, D(ne), O.props));
	var j = i(), N = x(j), P = (e) => {
		{
			let n = (e, n) => {
				let r = () => (n?.()).props, a = () => (n?.()).wrapperProps, o = F(() => G(a(), { style: { pointerEvents: O.root.disableHoverableContent ? "none" : void 0 } })), s = F(() => G(r(), { style: Ct("tooltip") }, { style: t.style }));
				var c = i(), f = x(c), p = (e) => {
					var n = i(), r = x(n);
					{
						let e = F(() => ({
							props: D(s),
							wrapperProps: D(o),
							...O.snippetProps
						}));
						d(r, () => t.child, () => D(e));
					}
					h(e, n);
				}, m = (e) => {
					var n = xn();
					v(n, () => ({ ...D(o) }));
					var r = M(n);
					v(r, () => ({ ...D(s) }));
					var i = M(r);
					d(i, () => t.children ?? u), l(r), l(n), h(e, n);
				};
				L(f, (e) => {
					t.child ? e(p) : e(m, -1);
				}), h(e, c);
			}, r = F(() => O.root.disableHoverableContent ? "none" : "auto");
			wt(e, y(() => D(A), () => O.popperProps, {
				get enabled() {
					return O.root.opts.open.current;
				},
				get id() {
					return a();
				},
				trapFocus: !1,
				loop: !1,
				preventScroll: !1,
				forceMount: !0,
				get ref() {
					return O.opts.ref;
				},
				tooltip: !0,
				get shouldRender() {
					return O.shouldRender;
				},
				get contentPointerEvents() {
					return D(r);
				},
				popper: n,
				$$slots: { popper: !0 }
			}));
		}
	}, I = (e) => {
		{
			let n = (e, n) => {
				let r = () => (n?.()).props, a = () => (n?.()).wrapperProps, o = F(() => G(a(), { style: { pointerEvents: O.root.disableHoverableContent ? "none" : void 0 } })), s = F(() => G(r(), { style: Ct("tooltip") }, { style: t.style }));
				var c = i(), f = x(c), p = (e) => {
					var n = i(), r = x(n);
					{
						let e = F(() => ({
							props: D(s),
							wrapperProps: D(o),
							...O.snippetProps
						}));
						d(r, () => t.child, () => D(e));
					}
					h(e, n);
				}, m = (e) => {
					var n = xn();
					v(n, () => ({ ...D(o) }));
					var r = M(n);
					v(r, () => ({ ...D(s) }));
					var i = M(r);
					d(i, () => t.children ?? u), l(r), l(n), h(e, n);
				};
				L(f, (e) => {
					t.child ? e(p) : e(m, -1);
				}), h(e, c);
			}, r = F(() => O.root.disableHoverableContent ? "none" : "auto");
			Et(e, y(() => D(A), () => O.popperProps, {
				get open() {
					return O.root.opts.open.current;
				},
				get id() {
					return a();
				},
				trapFocus: !1,
				loop: !1,
				preventScroll: !1,
				forceMount: !1,
				get ref() {
					return O.opts.ref;
				},
				tooltip: !0,
				get shouldRender() {
					return O.shouldRender;
				},
				get contentPointerEvents() {
					return D(r);
				},
				popper: n,
				$$slots: { popper: !0 }
			}));
		}
	};
	L(N, (e) => {
		E() ? e(P) : E() || e(I, 1);
	}), h(e, j), p();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-trigger.svelte
var Cn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"disabled",
	"payload",
	"tether",
	"type",
	"tabindex",
	"ref"
]), wn = s("<button><!></button>");
function Tn(e, t) {
	let n = o();
	r(t, !0);
	let a = k(t, "id", 19, () => _e(n)), s = k(t, "disabled", 3, !1), c = k(t, "type", 3, "button"), f = k(t, "tabindex", 3, 0), m = k(t, "ref", 15, null), g = w(t, Cn), _ = _n.create({
		id: q(() => a()),
		disabled: q(() => s() ?? !1),
		tabindex: q(() => f() ?? 0),
		payload: q(() => t.payload),
		tether: q(() => t.tether),
		ref: q(() => m(), (e) => m(e))
	}), y = F(() => G(g, _.props, { type: c() }));
	var b = i(), S = x(b), C = (e) => {
		var n = i(), r = x(n);
		d(r, () => t.child, () => ({ props: D(y) })), h(e, n);
	}, T = (e) => {
		var n = wn();
		v(n, () => ({ ...D(y) }));
		var r = M(n);
		d(r, () => t.children ?? u), l(n), h(e, n);
	};
	L(S, (e) => {
		t.child ? e(C) : e(T, -1);
	}), h(e, b), p();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-provider.svelte
function En(e, t) {
	r(t, !0);
	let n = k(t, "delayDuration", 3, 700), a = k(t, "disableCloseOnTriggerClick", 3, !1), o = k(t, "disableHoverableContent", 3, !1), s = k(t, "disabled", 3, !1), c = k(t, "ignoreNonKeyboardFocus", 3, !1), l = k(t, "skipDelayDuration", 3, 300);
	hn.create({
		delayDuration: q(() => n()),
		disableCloseOnTriggerClick: q(() => a()),
		disableHoverableContent: q(() => o()),
		disabled: q(() => s()),
		ignoreNonKeyboardFocus: q(() => c()),
		skipDelayDuration: q(() => l())
	});
	var f = i(), m = x(f);
	d(m, () => t.children ?? u), h(e, f), p();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileEventComparison.ts
function Dn(e) {
	return B(e.sourceEventId) && Number.isSafeInteger(e.updatedAtFromEvent) && e.updatedAtFromEvent >= 0;
}
function On(e, t) {
	return t.sourceEventId === e.sourceEventId ? "same-event" : t.updatedAtFromEvent > e.updatedAtFromEvent ? "candidate-newer" : t.updatedAtFromEvent < e.updatedAtFromEvent ? "candidate-older" : t.sourceEventId < e.sourceEventId ? "candidate-wins-tie-break" : "candidate-loses-tie-break";
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/profilesRepository.ts
var kn = 2;
function An(e) {
	return {
		name: e.name,
		displayName: e.displayName,
		picture: e.pictureUrl,
		npub: e.npub,
		nprofile: e.nprofile,
		profileRelays: e.profileRelays?.length ? e.profileRelays : void 0,
		fetchedAt: e.fetchedAt,
		updatedAtFromEvent: e.updatedAtFromEvent
	};
}
function jn(e, t, n) {
	let r = n();
	return {
		pubkeyHex: e,
		name: t.name || "",
		displayName: t.displayName || "",
		pictureUrl: t.picture || "",
		npub: t.npub || "",
		nprofile: t.nprofile || "",
		profileRelays: t.profileRelays?.length ? t.profileRelays : void 0,
		fetchedAt: t.fetchedAt || r,
		updatedAtFromEvent: t.updatedAtFromEvent,
		updatedAt: r,
		schemaVersion: kn
	};
}
function Mn(...e) {
	let t = R.sanitizeExternalRelayUrls(e.flatMap((e) => e ?? []));
	return t.length > 0 ? t : void 0;
}
function Nn(e) {
	return e.sourceEventId !== void 0 && e.updatedAtFromEvent !== void 0 && Dn({
		sourceEventId: e.sourceEventId,
		updatedAtFromEvent: e.updatedAtFromEvent
	});
}
function Pn(e, t) {
	return e.length > 0 && t.pubkeyHex === e && Dn(t) && Number.isFinite(t.fetchedAt) && t.fetchedAt >= 0;
}
function Fn(e, t, n) {
	let r = Mn(t.profile.profileRelays, t.observedRelays);
	return {
		pubkeyHex: e,
		name: t.profile.name || "",
		displayName: t.profile.displayName || "",
		pictureUrl: t.profile.picture || "",
		npub: t.profile.npub || "",
		nprofile: t.profile.nprofile || "",
		profileRelays: r,
		fetchedAt: t.fetchedAt,
		updatedAtFromEvent: t.updatedAtFromEvent,
		sourceEventId: t.sourceEventId,
		updatedAt: n,
		schemaVersion: kn
	};
}
function In(e, t) {
	return {
		decision: e,
		acceptedRecord: t,
		acceptedProfile: t ? An(t) : null,
		currentEventConfirmed: e === "inserted" || e === "replaced" || e === "kept-existing" || e === "merged-same-event"
	};
}
function Ln(e, t) {
	let n = t.getItem(pt.NOSTR_PROFILE + e);
	if (!n) return null;
	try {
		let e = JSON.parse(n);
		return !e || typeof e != "object" ? null : {
			name: typeof e.name == "string" ? e.name : "",
			displayName: typeof e.displayName == "string" ? e.displayName : "",
			picture: typeof e.picture == "string" ? e.picture : "",
			npub: typeof e.npub == "string" ? e.npub : "",
			nprofile: typeof e.nprofile == "string" ? e.nprofile : "",
			profileRelays: Array.isArray(e.profileRelays) ? e.profileRelays.filter((e) => typeof e == "string") : void 0,
			fetchedAt: typeof e.fetchedAt == "number" ? e.fetchedAt : void 0,
			updatedAtFromEvent: typeof e.updatedAtFromEvent == "number" ? e.updatedAtFromEvent : void 0
		};
	} catch {
		return null;
	}
}
var Rn = new class {
	db;
	now;
	getStorage;
	constructor(e = Y, t = Date.now, n = () => z()) {
		this.db = e, this.now = t, this.getStorage = n;
	}
	async get(e) {
		if (!e) return null;
		let t = Se(e);
		try {
			let n = await this.db.profiles.get(e);
			if (n) return await this.markLegacyProfileImported(t), An(n);
		} catch {
			return Ln(e, this.getStorage());
		}
		if ((await this.db.legacyImportState.get(t))?.done === !0) return null;
		let n = this.getStorage();
		if (n.getItem(pt.NOSTR_PROFILE + e) === null) return await this.markLegacyProfileImported(t), null;
		let r = Ln(e, n);
		if (!r) return null;
		try {
			await this.db.transaction("rw", this.db.profiles, this.db.legacyImportState, async () => {
				(await this.db.legacyImportState.get(t))?.done !== !0 && (await this.db.profiles.get(e) || await this.db.profiles.put(jn(e, r, this.now)), await this.db.legacyImportState.put({
					id: t,
					done: !0,
					updatedAt: this.now()
				}));
			});
			try {
				n.removeItem(pt.NOSTR_PROFILE + e);
			} catch {}
		} catch {
			return r;
		}
		return r;
	}
	async markLegacyProfileImported(e) {
		(await this.db.legacyImportState.get(e))?.done !== !0 && await this.db.legacyImportState.put({
			id: e,
			done: !0,
			updatedAt: this.now()
		});
	}
	async getRecord(e) {
		return await this.db.profiles.get(e) ?? null;
	}
	async bulkGetRecords(e) {
		return e.length === 0 ? [] : (await this.db.profiles.bulkGet(e)).map((e) => e ?? null);
	}
	async put(e, t) {
		e && await this.db.profiles.put(jn(e, t, this.now));
	}
	async upsertCandidate(e, t) {
		return this.db.transaction("rw", this.db.profiles, async () => {
			let n = await this.db.profiles.get(e) ?? null;
			if (!Pn(e, t)) return In("rejected-invalid", n);
			if (!n || !Nn(n)) {
				let r = Fn(e, t, this.now());
				return await this.db.profiles.put(r), In(n ? "replaced" : "inserted", r);
			}
			let r = On(n, t);
			if (r === "candidate-older") return In("rejected-older", n);
			if (r === "candidate-loses-tie-break") return In("rejected-tie-break", n);
			if (r === "candidate-newer" || r === "candidate-wins-tie-break") {
				let n = Fn(e, t, this.now());
				return await this.db.profiles.put(n), In("replaced", n);
			}
			let i = Mn(n.profileRelays, t.profile.profileRelays, t.observedRelays), a = Math.max(n.fetchedAt, t.fetchedAt);
			if (a === n.fetchedAt && nt(n.profileRelays, i)) return In("kept-existing", n);
			let o = {
				...n,
				profileRelays: i,
				fetchedAt: a,
				updatedAt: this.now(),
				schemaVersion: kn
			};
			return await this.db.profiles.put(o), In("merged-same-event", o);
		});
	}
	async delete(e) {
		if (e) {
			await this.db.profiles.delete(e);
			try {
				this.getStorage().removeItem(pt.NOSTR_PROFILE + e);
			} catch {}
		}
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDirectReplyRelationUtils.ts
function zn(e) {
	return e === 1 || e === 42 || e === 1111;
}
function Bn(e) {
	if (!zn(e.event.kind) || !e.event.id) return null;
	let t = ue(e.event);
	if (e.event.kind === 42 && !t.channelEventId || e.event.kind === 1111 && (!t.rootReferenceTags?.length || t.rootKind == null || !t.rootPubkey && t.rootReferenceTags[0]?.[0] !== "I" || !t.parentId && t.parentReferenceTags?.[0]?.[0] !== "i" || t.parentKind == null || !t.parentPubkey && t.parentReferenceTags?.[0]?.[0] !== "i" || t.issues.length > 0)) return null;
	let n = e.event.kind === 1111, r = n || e.event.kind === 1 ? t.rootId ?? e.event.id : e.event.id, i = n ? t.rootKind : e.event.kind === 1 ? 1 : e.event.kind, a = n ? t.rootPubkey : e.event.kind === 1 && r !== e.event.id ? t.rootAuthorHint : e.event.pubkey ?? null, o = n ? t.rootReferenceTags ?? [] : e.event.kind === 1 && r !== e.event.id ? [[
		"E",
		r,
		t.rootRelayHint ?? "",
		a ?? ""
	]] : [[
		"E",
		r,
		"",
		a ?? ""
	]];
	return {
		eventId: e.event.id,
		eventKind: e.event.kind,
		channelEventId: e.event.kind === 42 ? t.channelEventId : null,
		rootEventId: r,
		rootKind: i,
		rootPubkey: a,
		eventPubkey: e.event.pubkey ?? null,
		rootReferenceTags: o,
		createdAt: e.event.created_at,
		relayHints: [...e.relayHints ?? []]
	};
}
function Vn(e) {
	if (!zn(e.child.kind)) return {
		valid: !1,
		reason: "unsupported-child-kind"
	};
	if (e.child.id === e.parent.eventId) return {
		valid: !1,
		reason: "self-reference"
	};
	let t = ue(e.child);
	if (!ce(t)) return {
		valid: !1,
		reason: "parent-reference-missing-or-ambiguous"
	};
	if (t.parentId !== e.parent.eventId) return {
		valid: !1,
		reason: "parent-id-mismatch"
	};
	let n = e.child.kind === 1111;
	if (!n && e.child.kind !== e.parent.eventKind || n && (e.parent.eventKind === 42 || t.parentKind !== String(e.parent.eventKind) || t.rootKind !== String(e.parent.rootKind ?? e.parent.eventKind) || !((e, t) => {
		let n = e[0], r = t[0];
		return !!n && !!r && n[0] === r[0] && n[1] === r[1];
	})(t.rootReferenceTags ?? [], e.parent.rootReferenceTags ?? [["E", e.parent.rootEventId ?? e.parent.eventId]]) || e.parent.eventPubkey && t.parentPubkey !== e.parent.eventPubkey || e.parent.rootPubkey && t.rootPubkey !== e.parent.rootPubkey)) return {
		valid: !1,
		reason: "kind-mismatch"
	};
	if (e.child.kind === 42) {
		if (!t.channelEventId || !e.parent.channelEventId) return {
			valid: !1,
			reason: "channel-missing"
		};
		if (t.channelEventId !== e.parent.channelEventId) return {
			valid: !1,
			reason: "channel-mismatch"
		};
	}
	return {
		valid: !0,
		parentEventId: e.parent.eventId
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/BlurhashPlaceholder.svelte
var Hn = s("<div aria-hidden=\"true\"></div>"), Un = {
	hash: "svelte-ohoxs0",
	code: ".blurhash-placeholder.svelte-ohoxs0 {position:absolute;inset:0;z-index:0;border-radius:inherit;overflow:hidden;background:radial-gradient(\n                circle at top left,\n                rgba(255, 255, 255, 0.2),\n                transparent 48%\n            ),\n            linear-gradient(\n                135deg,\n                color-mix(in srgb, var(--background-color, #fff) 24%, #000 76%),\n                color-mix(in srgb, var(--background-color, #fff) 8%, #000 92%)\n            );background-position:center;background-repeat:no-repeat;background-size:cover;}.blurhash-placeholder-ready.svelte-ohoxs0 {background-image:var(--blurhash-placeholder-image);}.blurhash-placeholder.svelte-ohoxs0::after {content:\"\";position:absolute;inset:0;background:linear-gradient(\n            180deg,\n            rgba(0, 0, 0, 0.08),\n            rgba(0, 0, 0, 0.28)\n        );}:root.dark .ehagaki-app-root .blurhash-placeholder.svelte-ohoxs0::after,\n    :host(.dark) .ehagaki-app-root .blurhash-placeholder.svelte-ohoxs0::after {background:linear-gradient(\n            180deg,\n            rgba(0, 0, 0, 0.14),\n            rgba(0, 0, 0, 0.38)\n        );}"
};
function Wn(e, i) {
	r(i, !0), t(e, Un);
	let a = /* @__PURE__ */ new Map(), o = k(i, "blurhash", 3, void 0), s = k(i, "className", 3, ""), c = N(null), l = F(() => D(c) ? `--blurhash-placeholder-image: url("${D(c)}");` : "");
	async function u(e) {
		let t = e.trim();
		if (!t || typeof document > "u") return null;
		let n = a.get(t);
		if (n instanceof Promise || typeof n == "string" || n === null) return n;
		let r = Promise.resolve().then(() => {
			let e = document.createElement("canvas");
			e.width = 32, e.height = 32;
			let n = e.getContext("2d");
			if (!n) return null;
			let r = n.createImageData(32, 32);
			return r.data.set(V(t, 32, 32)), n.putImageData(r, 0, 0), e.toDataURL("image/png");
		}).catch(() => null).then((e) => (a.set(t, e), e));
		return a.set(t, r), r;
	}
	b(() => {
		let e = !0, t = o()?.trim();
		if (C(c, null), t) return u(t).then((t) => {
			e && C(c, t, !0);
		}), () => {
			e = !1;
		};
	});
	var d = Hn();
	let m;
	A((e, t) => {
		m = f(d, 1, e, "svelte-ohoxs0", m, { "blurhash-placeholder-ready": t }), P(d, D(l));
	}, [() => n(`blurhash-placeholder ${s()}`.trim()), () => !!D(c)]), h(e, d), p();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryMediaCache.svelte.ts
function Gn(e) {
	return {
		url: e.url,
		alt: e.alt,
		mimeType: e.mimeType,
		blurhash: e.blurhash,
		dim: e.dim,
		kind: vt({
			url: e.url,
			mimeType: e.mimeType
		}),
		hasResolvedCache: !1,
		cached: !1,
		previewObjectUrl: void 0,
		size: e.size,
		uploadProtocol: e.uploadProtocol,
		source: void 0,
		isLoadingPreview: !1,
		isCaching: !1,
		hasFetchFailed: !1
	};
}
function Kn(e, t) {
	return [t ? "1" : "0", ...e.map((e) => [
		e.url,
		e.mimeType ?? "",
		e.alt ?? "",
		e.blurhash ?? "",
		e.dim ?? "",
		e.size ?? "",
		e.uploadProtocol ?? ""
	].join(""))].join("");
}
function qn(e) {
	let t = E({ items: [] }), n = /* @__PURE__ */ new Map(), r = 0, i = "", a = !1;
	function o(e) {
		let t = Gn(e), r = Z.getCachedMediaDescriptorSnapshot(e.url);
		if (r === void 0) return t;
		if (r === null) return {
			...t,
			hasResolvedCache: !0
		};
		if (r.kind !== "image" && r.kind !== "video") return {
			...t,
			hasResolvedCache: !0,
			cached: !0,
			mimeType: r.mimeType,
			kind: r.kind,
			size: r.size,
			source: r.source
		};
		let i = Z.getCachedMediaObjectUrlSnapshot(e.url);
		return i ? (n.set(e.url, i.objectUrl), {
			...t,
			hasResolvedCache: !0,
			cached: !0,
			previewObjectUrl: i.objectUrl,
			mimeType: i.mimeType,
			kind: i.kind,
			size: i.size,
			source: i.source
		}) : {
			...t,
			hasResolvedCache: !0,
			cached: !0,
			previewObjectUrl: void 0,
			mimeType: r.mimeType,
			kind: r.kind,
			size: r.size,
			source: r.source,
			isLoadingPreview: !0
		};
	}
	function s(e) {
		let t = Gn(e);
		return t.kind !== "image" && t.kind !== "video" ? {
			...t,
			hasResolvedCache: !0
		} : {
			...t,
			hasResolvedCache: !0,
			cached: !0,
			previewObjectUrl: e.url
		};
	}
	function c(e) {
		let t = n.get(e);
		t && (Z.revokeObjectUrl(t), n.delete(e));
	}
	function l() {
		for (let e of n.values()) Z.revokeObjectUrl(e);
		n.clear();
	}
	function u(e, n) {
		t.items = t.items.map((t) => t.url === e ? n(t) : t);
	}
	async function d(e) {
		let { url: t, descriptor: i, loadPreview: o, expectedResolutionVersion: s } = e;
		if (o && (i.kind === "image" || i.kind === "video")) {
			u(t, (e) => ({
				...e,
				hasResolvedCache: !0,
				cached: !0,
				previewObjectUrl: void 0,
				mimeType: i.mimeType,
				kind: i.kind,
				size: i.size,
				source: i.source,
				isLoadingPreview: !0,
				isCaching: !1,
				hasFetchFailed: !1
			}));
			let e = await Z.createCachedMediaObjectUrl(t);
			if (a || s !== void 0 && s !== r) {
				e && Z.revokeObjectUrl(e.objectUrl);
				return;
			}
			if (e) {
				c(t), n.set(t, e.objectUrl), u(t, (t) => ({
					...t,
					hasResolvedCache: !0,
					cached: !0,
					previewObjectUrl: e.objectUrl,
					mimeType: e.mimeType,
					kind: e.kind,
					size: e.size,
					source: e.source,
					isLoadingPreview: !1,
					isCaching: !1,
					hasFetchFailed: !1
				}));
				return;
			}
		}
		a || (c(t), u(t, (e) => ({
			...e,
			hasResolvedCache: !0,
			cached: !0,
			previewObjectUrl: void 0,
			mimeType: i.mimeType,
			kind: i.kind,
			size: i.size,
			source: i.source,
			isLoadingPreview: !1,
			isCaching: !1,
			hasFetchFailed: !1
		})));
	}
	async function f(e) {
		let n = t.items.find((t) => t.url === e);
		if (!n || n.cached || n.isCaching) return;
		let i = r;
		u(e, (e) => ({
			...e,
			isCaching: !0,
			hasFetchFailed: !1
		}));
		try {
			let t = await Z.fetchAndCacheMedia({
				url: e,
				mimeType: n.mimeType
			});
			if (!t) {
				u(e, (e) => ({
					...e,
					isCaching: !1,
					hasFetchFailed: !0
				}));
				return;
			}
			await d({
				url: e,
				descriptor: t,
				loadPreview: t.kind === "image" || t.kind === "video",
				expectedResolutionVersion: i
			});
		} catch {
			if (n.kind === "image" || n.kind === "video") {
				c(e), u(e, () => s(n));
				return;
			}
			u(e, (e) => ({
				...e,
				isCaching: !1,
				hasFetchFailed: !0
			}));
		}
	}
	return j(() => {
		a = !0, r += 1, l();
	}), b(() => {
		let f = e.getMedia(), p = Kn(f, Z.canUsePersistentCache());
		if (p === i) return;
		i = p;
		let m = ++r;
		if (!Z.canUsePersistentCache()) {
			t.items = f.map(s);
			return;
		}
		l(), t.items = f.map(o);
		let h = new Map(t.items.map((e) => [e.url, e]));
		(async () => {
			await Promise.all(f.map(async (e) => {
				let t = h.get(e.url);
				if (!t) return;
				if (t.hasResolvedCache) {
					if (!t.cached || t.previewObjectUrl || !t.isLoadingPreview) return;
					let n = await Z.getCachedMediaDescriptor(e.url);
					if (a || m !== r) return;
					if (!n) {
						c(e.url), u(e.url, (e) => ({
							...e,
							cached: !1,
							previewObjectUrl: void 0,
							isLoadingPreview: !1
						}));
						return;
					}
					await d({
						url: e.url,
						descriptor: n,
						loadPreview: n.kind === "image" || n.kind === "video",
						expectedResolutionVersion: m
					});
					return;
				}
				let i = await Z.getCachedMediaDescriptor(e.url);
				if (a || m !== r) return;
				if (!i) {
					u(e.url, (e) => ({
						...e,
						hasResolvedCache: !0
					}));
					return;
				}
				if (i.kind !== "image" && i.kind !== "video") {
					u(e.url, (e) => ({
						...e,
						hasResolvedCache: !0,
						cached: !0,
						kind: i.kind,
						mimeType: i.mimeType,
						size: i.size,
						source: i.source
					}));
					return;
				}
				u(e.url, (e) => ({
					...e,
					hasResolvedCache: !0,
					cached: !0,
					previewObjectUrl: void 0,
					kind: i.kind,
					mimeType: i.mimeType,
					size: i.size,
					source: i.source,
					isLoadingPreview: !0,
					isCaching: !1,
					hasFetchFailed: !1
				}));
				let o = await Z.createCachedMediaObjectUrl(e.url);
				a || m !== r ? o && Z.revokeObjectUrl(o.objectUrl) : o ? (c(e.url), n.set(e.url, o.objectUrl), u(e.url, (e) => ({
					...e,
					hasResolvedCache: !0,
					cached: !0,
					previewObjectUrl: o.objectUrl,
					kind: o.kind,
					mimeType: o.mimeType,
					size: o.size,
					source: o.source,
					isLoadingPreview: !1,
					isCaching: !1,
					hasFetchFailed: !1
				}))) : (c(e.url), u(e.url, (e) => ({
					...e,
					hasResolvedCache: !0,
					cached: !0,
					kind: i.kind,
					mimeType: i.mimeType,
					size: i.size,
					source: i.source,
					previewObjectUrl: void 0,
					isLoadingPreview: !1
				})));
			}));
		})();
	}), {
		state: t,
		fetchAndCacheMedia: f
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogUtils.ts
var Jn = /:([^\s:]+):/g, Yn = {
	1: [1],
	2: [2],
	3: [3],
	4: [2, 2],
	5: [3, 2],
	6: [3, 3],
	7: [
		3,
		3,
		1
	],
	8: [
		3,
		3,
		2
	],
	9: [
		3,
		3,
		3
	]
};
function Xn(e) {
	return e.nextUntil === null ? !1 : e.status === "success" ? e.hasMore : e.events.length > 0;
}
function Zn(e, t) {
	return e ? {
		status: e.name ? "resolved" : "failed",
		name: e.name
	} : {
		status: t ? "loading" : "failed",
		name: null
	};
}
function Qn(e, t) {
	return R.sanitizeExternalRelayUrls([
		...e?.channelRelayHints ?? [],
		...e?.fetchedRelays ?? [],
		...e?.relayHints ?? [],
		...e?.acceptedRelays ?? [],
		...t?.relayHints ?? [],
		...t?.relays ?? []
	], { limit: 8 });
}
function $n(e, t, n) {
	let r = Math.max(1, Math.ceil(t / n));
	return t === 0 ? 1 : Math.min(e, r);
}
var er = {
	hour: "numeric",
	minute: "2-digit"
}, tr = {
	month: "numeric",
	day: "numeric",
	...er
}, nr = {
	year: "numeric",
	month: "numeric",
	day: "numeric"
}, rr = {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit"
}, ir = /* @__PURE__ */ new Map();
function ar(e, t) {
	let n = ir.get(t);
	n || (n = /* @__PURE__ */ new Map(), ir.set(t, n));
	let r = e ?? "", i = n.get(r);
	return i || (i = new Intl.DateTimeFormat(e ?? void 0, t), n.set(r, i)), i;
}
function or(e, t = Date.now()) {
	let n = new Date(e), r = new Date(t);
	return lr(n, r) ? ar(void 0, er).format(n) : n.getFullYear() === r.getFullYear() ? ar(void 0, tr).format(n) : ar(void 0, nr).format(n);
}
function sr(e, t) {
	return ar(t, rr).format(new Date(e));
}
function cr(e, t, n = Date.now()) {
	let r = new Date(e), i = new Date(n);
	return lr(r, i) ? dr(0, t) : ur(r, i) ? dr(-1, t) : r.getFullYear() === i.getFullYear() ? new Intl.DateTimeFormat(t ?? void 0, {
		month: "numeric",
		day: "numeric",
		weekday: "short"
	}).format(r) : new Intl.DateTimeFormat(t ?? void 0, {
		year: "numeric",
		month: "numeric"
	}).format(r);
}
function lr(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
function ur(e, t) {
	let n = new Date(t);
	return n.setHours(0, 0, 0, 0), n.setDate(n.getDate() - 1), lr(e, n);
}
function dr(e, t) {
	return new Intl.RelativeTimeFormat(t ?? void 0, { numeric: "auto" }).format(e, "day");
}
function fr(e) {
	return e.trim() || " ";
}
function pr(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) {
		let e = _t(r.url);
		if (!e || n.has(e)) continue;
		n.add(e);
		let i = vt({
			url: r.url,
			mimeType: r.mimeType
		});
		t.push({
			...r,
			url: e,
			id: e,
			normalizedUrl: e,
			kind: i === "image" || i === "video" ? i : "other"
		});
	}
	return t;
}
function mr(e) {
	let t = Cr(e.length), n = [], r = 0;
	for (let i = 0; i < t.length; i += 1) {
		let a = t[i], o = e.slice(r, r + a);
		r += a, n.push({
			items: o,
			slotCount: wr({
				totalCount: e.length,
				rowLength: o.length,
				isFinalRow: i === t.length - 1
			})
		});
	}
	return n;
}
function hr(e) {
	return e.map((e) => ({
		id: e.id,
		src: e.url,
		alt: e.alt,
		type: "image",
		dim: e.dim
	}));
}
function gr(e) {
	return _r(e).aspectRatio;
}
function _r(e) {
	let t = e.fallback ?? (e.kind === "video" ? "16 / 9" : "1 / 1"), n = xr(e.dim);
	return n ? {
		width: n.width,
		height: n.height,
		aspectRatio: `${n.width} / ${n.height}`,
		hasExactDimensions: !0
	} : {
		aspectRatio: t,
		hasExactDimensions: !1
	};
}
function vr(e) {
	return e.hasFetchFailed ? "error" : e.previewObjectUrl ? "ready" : e.cached || e.isLoadingPreview ? "cache-materializing" : e.isCaching ? "loading" : (e.hasResolvedCache, e.hasMetadataHint ? "placeholder" : "unknown");
}
function yr(e) {
	let t = pr(e), n = t.filter((e) => e.kind === "image");
	return {
		items: t,
		images: n,
		videos: t.filter((e) => e.kind === "video"),
		others: t.filter((e) => e.kind === "other"),
		imageRows: mr(n),
		fullscreenMediaItems: hr(n)
	};
}
function br(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) for (let e of r.media) {
		let r = yt(e.url);
		r && !n.has(r) && (n.add(r), t.push(e.url));
	}
	return t;
}
function xr(e) {
	let t = e?.trim();
	if (!t) return null;
	let n = t.match(/^(\d+)\s*x\s*(\d+)$/i);
	if (!n) return null;
	let r = Number(n[1]), i = Number(n[2]);
	return !Number.isSafeInteger(r) || !Number.isSafeInteger(i) || r <= 0 || i <= 0 ? null : {
		width: r,
		height: i
	};
}
function Sr(e) {
	let t = fr(e.content), n = Mt(e.tags), r = Tr(e.media ?? []), i = [], a = /* @__PURE__ */ new Set(), o = 0;
	for (let e of t.matchAll(Jn)) {
		let s = e.index ?? -1, c = e[1] ?? "", l = e[0] ?? "";
		if (s < 0 || !l) continue;
		let u = kt(c), d = u ? n.get(u) : void 0;
		d && (s > o && Er(i, t.slice(o, s), r), i.push({
			type: "emoji",
			shortcode: d.shortcode,
			shortcodeLower: u,
			rawShortcodeText: l,
			url: d.url
		}), a.add(d.url), o = s + l.length);
	}
	return o < t.length && Er(i, t.slice(o), r), i.length === 0 && i.push({
		type: "text",
		text: t
	}), {
		segments: i,
		emojiUrls: [...a]
	};
}
function Cr(e) {
	let t = Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
	if (t === 0) return [];
	let n = Yn[t];
	if (n) return [...n];
	let r = Array.from({ length: Math.floor(t / 3) }, () => 3), i = t % 3;
	return i > 0 && r.push(i), r;
}
function wr(e) {
	let { totalCount: t, rowLength: n, isFinalRow: r } = e;
	return r && t >= 7 && n < 3 || n >= 3 ? 3 : n === 2 ? 2 : 1;
}
function Tr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = yt(n.url);
		e && !t.has(e) && t.set(e, n);
	}
	return t;
}
function Er(e, t, n) {
	if (!t) return;
	let r = 0;
	for (let i of xt(t)) {
		if (!i.isValidHttpUrl || !i.href) continue;
		let a = yt(i.displayText), o = n.get(a);
		Dr(e, t.slice(r, i.candidateStart)), o ? e.push({
			type: "media",
			url: i.displayText,
			normalizedUrl: a,
			media: o
		}) : e.push({
			type: "link",
			text: i.displayText,
			href: i.href
		}), Dr(e, i.trailingText), r = i.candidateEnd;
	}
	r < t.length && Dr(e, t.slice(r));
}
function Dr(e, t) {
	if (!t) return;
	let n = e[e.length - 1];
	n?.type === "text" ? n.text += t : e.push({
		type: "text",
		text: t
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryMediaList.svelte
var Or = s("<div class=\"copy-icon svg-icon svelte-8yjcw8\"></div>"), kr = s("<div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><button type=\"button\" class=\"post-history-media-retry-button svelte-8yjcw8\"> </button></div>"), Ar = s("<div class=\"post-history-media-placeholder-loader svelte-8yjcw8\"><!></div>"), jr = s("<div><!> <!> <!></div>"), Mr = s("<img class=\"post-history-media-image post-history-media-image-single-stage svelte-8yjcw8\" loading=\"lazy\" decoding=\"async\"/>"), Nr = s("<div class=\"post-history-media-layout-frame post-history-single-image-layout-frame svelte-8yjcw8\"><!></div>"), Pr = s("<img class=\"post-history-media-image svelte-8yjcw8\" loading=\"lazy\" decoding=\"async\"/>"), Fr = s("<button type=\"button\"><!></button>"), Ir = s("<div class=\"post-history-media-placeholder-loader post-history-media-placeholder-loader-single svelte-8yjcw8\"><!></div>"), Lr = s("<div class=\"post-history-image-cell svelte-8yjcw8\"><div><!> <!> <!></div></div>"), Rr = s("<div class=\"post-history-image-row svelte-8yjcw8\"></div>"), zr = s("<div></div>"), Br = s("<button type=\"button\" class=\"post-history-image-toggle svelte-8yjcw8\"> </button>"), Vr = s("<video class=\"post-history-media-video svelte-8yjcw8\" controls=\"\" playsinline=\"\" preload=\"metadata\"><track kind=\"captions\" class=\"svelte-8yjcw8\"/></video>", 2), Hr = s("<button type=\"button\" class=\"post-history-media-retry-button svelte-8yjcw8\"> </button>"), Ur = s("<div><!> <div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><!></div></div>"), Wr = s("<article class=\"post-history-video-card svelte-8yjcw8\"><div class=\"post-history-video-card-header svelte-8yjcw8\"><span class=\"post-history-video-card-label svelte-8yjcw8\"> </span> <!></div> <div class=\"post-history-video-media-frame svelte-8yjcw8\"><!></div></article>"), Gr = s("<div class=\"post-history-video-list svelte-8yjcw8\"></div>"), Kr = s("<div class=\"post-history-other-media-card svelte-8yjcw8\"><div class=\"post-history-other-media-header svelte-8yjcw8\"><span class=\"post-history-other-media-label svelte-8yjcw8\"> </span> <!></div> <div><div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><!></div> <!></div></div>"), qr = s("<div class=\"post-history-other-media-list svelte-8yjcw8\"></div>"), Jr = s("<div class=\"post-history-media-section svelte-8yjcw8\"><!> <!> <!> <!></div>"), Yr = {
	hash: "svelte-8yjcw8",
	code: ".post-history-media-section.svelte-8yjcw8 {display:flex;flex-direction:column;gap:10px;}.post-history-image-toggle.svelte-8yjcw8 {align-self:flex-start;padding:4px 10px;border:1px solid var(--border-hr);border-radius:999px;background:var(--bg-input);color:var(--text);font:inherit;cursor:pointer;}.post-history-image-grid.svelte-8yjcw8 {display:flex;flex-direction:column;justify-content:center;align-items:center;border-radius:12px;overflow:hidden;gap:2px;}.post-history-image-row.svelte-8yjcw8 {display:grid;grid-template-columns:repeat(\n            var(--post-history-image-columns),\n            minmax(0, 1fr)\n        );width:100%;gap:2px;}.post-history-image-cell.svelte-8yjcw8 {position:relative;min-width:0;}.post-history-image-surface-frame.svelte-8yjcw8 {position:relative;width:100%;.post-history-media-surface:where(.svelte-8yjcw8) {font-size:0;display:block;width:100%;padding:0;border:0;background-color:transparent;text-align:start;cursor:pointer;margin-inline:auto;&:active:not(:disabled) {scale:1;}}}\n\n    /* 単体画像のときグリッド側のボーダーを無効化 */.post-history-image-grid-single.svelte-8yjcw8 {border:none;border-radius:0;overflow:visible;}.post-history-image-surface-frame-single.svelte-8yjcw8 {max-width:100%;margin-inline:0;border-radius:12px;overflow:hidden;}.post-history-image-surface.svelte-8yjcw8 {overflow:hidden;}.post-history-image-surface-single.svelte-8yjcw8 {display:block;min-height:100px;}.post-history-media-layout-frame.svelte-8yjcw8 {position:relative;width:100%;max-width:100%;overflow:hidden;background:transparent;}.post-history-single-image-layout-frame.svelte-8yjcw8 {position:relative;padding:0;display:grid;place-items:center;justify-self:stretch;align-self:stretch;overflow:hidden;background:transparent;}.post-history-image-placeholder-single.svelte-8yjcw8 {position:absolute;inset:0;display:grid;place-items:center;width:100%;height:100%;min-height:0;}.post-history-media-image.svelte-8yjcw8,\n    .post-history-media-placeholder.svelte-8yjcw8,\n    .post-history-media-layout-frame.svelte-8yjcw8 {width:100%;max-width:100%;}.post-history-media-image.svelte-8yjcw8 {display:block;height:100%;object-fit:cover;}.post-history-media-image-single.svelte-8yjcw8 {height:auto;margin-inline:auto;}.post-history-media-image-single-stage.svelte-8yjcw8 {position:relative;z-index:1;}.post-history-media-video.svelte-8yjcw8 {display:block;width:100%;max-height:300px;height:100%;object-fit:contain;border-radius:10px;background:color-mix(\n            in srgb,\n            var(--background-color, #fff) 92%,\n            #000 8%\n        );}.post-history-video-media-frame.svelte-8yjcw8 {width:100%;max-height:300px;overflow:hidden;border-radius:10px;}.post-history-media-placeholder.svelte-8yjcw8 {display:flex;flex-direction:column;gap:8px;align-items:flex-start;justify-content:center;padding:12px;text-align:start;position:relative;isolation:isolate;height:auto;aspect-ratio:var(--post-history-media-aspect-ratio, 1 / 1);overflow-wrap:anywhere;margin-inline:auto;}.post-history-media-placeholder-content.svelte-8yjcw8 {position:relative;z-index:1;display:flex;flex-direction:column;gap:8px;width:100%;}.post-history-media-placeholder-loader.svelte-8yjcw8 {position:absolute;inset:auto 8px 8px auto;z-index:2;pointer-events:none;}.post-history-media-placeholder-loader-single.svelte-8yjcw8 {z-index:3;}.post-history-media-placeholder-uncached.svelte-8yjcw8 {--post-history-placeholder-stripe-soft: light-dark(\n            color-mix(in srgb, var(--background-color, #fff) 94%, #000 6%),\n            color-mix(in srgb, var(--background-color, #111) 94%, #fff 6%)\n        );--post-history-placeholder-stripe-strong: light-dark(\n            color-mix(in srgb, var(--background-color, #fff) 88%, #000 12%),\n            color-mix(in srgb, var(--background-color, #111) 88%, #fff 12%)\n        );background:repeating-linear-gradient(\n            -45deg,\n            var(--post-history-placeholder-stripe-soft),\n            var(--post-history-placeholder-stripe-soft) 10px,\n            var(--post-history-placeholder-stripe-strong) 10px,\n            var(--post-history-placeholder-stripe-strong) 20px\n        );}.post-history-image-placeholder-single.post-history-media-placeholder.svelte-8yjcw8 {height:100%;margin-inline:0;aspect-ratio:auto;}.post-history-media-placeholder-blurhash.svelte-8yjcw8 {background:color-mix(\n            in srgb,\n            var(--background-color, #fff) 18%,\n            #000 82%\n        );}.post-history-media-retry-button.svelte-8yjcw8 {width:100%;height:100%;padding:6px 12px;border:1px solid var(--border, #ccc);border-radius:10px;color:var(--text, #111);font:inherit;cursor:pointer;}.post-history-video-list.svelte-8yjcw8,\n    .post-history-other-media-list.svelte-8yjcw8 {display:flex;flex-direction:column;gap:10px;}.post-history-video-card.svelte-8yjcw8,\n    .post-history-other-media-card.svelte-8yjcw8 {display:flex;flex-direction:column;width:100%;border-radius:12px;border:1px solid var(--border-hr);background:var(--bg-input);overflow:hidden;}.post-history-video-card-header.svelte-8yjcw8,\n    .post-history-other-media-header.svelte-8yjcw8 {display:flex;align-items:center;justify-content:space-between;}.post-history-video-card-label.svelte-8yjcw8,\n    .post-history-other-media-label.svelte-8yjcw8 {min-width:0;padding:4px 8px;overflow-wrap:anywhere;color:var(--text-muted);font-size:0.875rem;line-height:1.2;}.post-history-video-placeholder.svelte-8yjcw8 {width:100%;height:100%;aspect-ratio:auto;padding:0 12px;}button.post-history-media-copy-button.circle.copy {min-width:36px;width:36px;height:36px;min-height:36px;z-index:2;}button.post-history-media-copy-button-image.circle.copy {position:absolute;inset:8px 8px auto auto;}button.post-history-video-copy-button.circle.copy {position:relative;top:auto;right:auto;flex-shrink:0;}\n\n    @keyframes svelte-8yjcw8-post-history-media-loading {\n        0% {\n            background-position: 100% 50%;\n        }\n        100% {\n            background-position: -100% 50%;\n        }\n    }.post-history-media-video {background-color:light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));}"
};
function Xr(e, n) {
	r(n, !0), t(e, Yr);
	let o = () => ne(ye, "$_", s), [s, d] = te(), g = (e, t = u, n = u) => {
		{
			let r = F(() => `post-history-media-copy-button ${n()}`), i = F(() => H(t().kind, t().url)), a = F(() => H(t().kind, t().url)), o = F(() => me(t().kind));
			ht(e, {
				variant: "copy",
				shape: "circle",
				get className() {
					return D(r);
				},
				get ariaLabel() {
					return D(i);
				},
				get title() {
					return D(a);
				},
				onClick: (e) => ke(t(), e),
				get floatingMessage() {
					return D(o);
				},
				children: (e, t) => {
					var n = Or();
					h(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	}, v = (e, t = u, n = u, r = u, i = u, a = u) => {
		var s = jr();
		let c;
		var d = M(s), p = (e) => {
			Wn(e, { get blurhash() {
				return t().blurhash;
			} });
		};
		L(d, (e) => {
			i() && e(p);
		});
		var g = O(d, 2), v = (e) => {
			var n = kr(), r = M(n), i = S(r, !0);
			l(n), A((e) => m(i, e), [() => o()("postHistory.mediaFetchAndCache")]), _("click", r, () => Ae(t())), h(e, n);
		};
		L(g, (e) => {
			a() && e(v);
		});
		var y = O(g, 2), b = (e) => {
			var t = Ar(), n = M(t);
			xe(n, {
				showLoader: !0,
				text: !1,
				loaderSize: 34
			}), l(t), h(e, t);
		}, x = F(() => Ee(t(), n(), Y(t())));
		L(y, (e) => {
			D(x) && e(b);
		}), l(s), A((e, t) => {
			c = f(s, 1, `post-history-media-placeholder ${r()}`, "svelte-8yjcw8", c, {
				"post-history-media-placeholder-blurhash": i(),
				"post-history-image-placeholder-single": n().isSingleImage
			}), P(s, n().isSingleImage ? void 0 : n().surfaceStyle), I(s, "aria-label", e), I(s, "title", t);
		}, [() => Le(t()), () => V(t())]), h(e, s);
	}, y = "160px 0px", b = k(n, "scrollRoot", 3, null), w = k(n, "onImageOpen", 3, void 0), T = k(n, "mediaLayout", 3, void 0), j = k(n, "maxVisibleImages", 3, void 0), re = N(E({})), ie = /* @__PURE__ */ new Set(), R = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), oe = N(!1), z = F(() => T() ?? yr(n.media)), B = qn({ getMedia: () => D(z).items }), se = F(() => new Map(B.state.items.map((e) => [e.url, e]))), ce = F(() => j() !== void 0 && D(z).images.length > j()), le = F(() => {
		let e = D(ce) && !D(oe) ? j() : Infinity;
		return D(z).imageRows.flatMap((t) => {
			let n = t.items.slice(0, e).map((e) => fe(e));
			return e -= n.length, n.length ? [{
				...t,
				items: n
			}] : [];
		});
	}), ue = F(() => D(z).videos.map((e) => fe(e))), de = F(() => D(z).others.map((e) => fe(e)));
	function V(e) {
		let t = e.alt?.trim();
		if (t) return t;
		try {
			return new URL(e.url).pathname.split("/").filter(Boolean).at(-1) || e.url;
		} catch {
			return e.url;
		}
	}
	function fe(e) {
		let t = D(se).get(e.url);
		return {
			...e,
			alt: t?.alt ?? e.alt,
			mimeType: t?.mimeType ?? e.mimeType,
			blurhash: t?.blurhash ?? e.blurhash,
			dim: t?.dim ?? e.dim,
			size: t?.size ?? e.size,
			uploadProtocol: t?.uploadProtocol ?? e.uploadProtocol,
			hasResolvedCache: t?.hasResolvedCache ?? !1,
			cached: t?.cached ?? !1,
			previewObjectUrl: t?.previewObjectUrl,
			isLoadingPreview: t?.isLoadingPreview ?? !1,
			isCaching: t?.isCaching ?? !1,
			hasFetchFailed: t?.hasFetchFailed ?? !1
		};
	}
	function pe(e) {
		return e === "video" ? "videoContextMenu" : "imageContextMenu";
	}
	function H(e, t) {
		let n = pe(e), r = D(re)[t];
		return r === "copied" ? o()(`${n}.copySuccess`) : r === "failed" ? o()(`${n}.copyFailed`) : o()(`${n}.copyUrl`);
	}
	function me(e) {
		return o()(`${pe(e)}.copySuccess`);
	}
	function U(e) {
		return `${o()("postHistory.mediaOpen")} ${V(e)}`;
	}
	function W(e) {
		let [t, n] = e.split("/"), r = Number(t?.trim()), i = Number(n?.trim());
		return !Number.isFinite(r) || !Number.isFinite(i) || i <= 0 ? 1 : r / i;
	}
	function he(e) {
		return Number.isInteger(e) ? `${e}` : e.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
	}
	function G(e) {
		return `min(100%, ${he(300 * W(e))}px)`;
	}
	function ge(e) {
		return `min(100%, ${he(Math.max(100, 100 * W(e)))}px)`;
	}
	function _e(e) {
		return `width: max(${G(e)}, ${ge(e)});`;
	}
	function ve() {
		return "width: 100%; min-height: 100px;";
	}
	function be(e) {
		return W(e) < .3333333333333333 ? "100 / 300" : e;
	}
	function K(e) {
		return [
			`aspect-ratio: ${be(e)};`,
			"width: 100%;",
			"max-height: 300px;",
			"min-height: 100px;",
			"padding: 0;"
		].join(" ");
	}
	function q(e) {
		return [
			"position: absolute;",
			"inset: 0;",
			"width: 100%;",
			"height: 100%;",
			"max-width: 100%;",
			`object-fit: ${e};`,
			"object-position: center;"
		].join(" ");
	}
	function J(e) {
		return [`aspect-ratio: ${e};`, "width: 100%;"].join(" ");
	}
	function Se(e) {
		return !!(e.blurhash?.trim() || e.dim?.trim());
	}
	function Y(e) {
		return vr({
			hasResolvedCache: e.hasResolvedCache,
			cached: e.cached,
			previewObjectUrl: e.previewObjectUrl,
			isLoadingPreview: e.isLoadingPreview,
			isCaching: e.isCaching,
			hasFetchFailed: e.hasFetchFailed,
			hasMetadataHint: Se(e)
		});
	}
	function Ce(e) {
		let t = we(e.item, e.slotCount), n = Te(e.item) ? "cover" : "contain", r = _r({
			dim: e.item.dim,
			kind: e.item.kind
		});
		return e.isSingleImage ? {
			aspectRatio: t,
			dimensionHints: r,
			isSingleImage: !0,
			frameStyle: _e(t),
			surfaceStyle: ve(),
			layoutFrameStyle: K(t),
			imageStyle: q(n)
		} : {
			aspectRatio: t,
			dimensionHints: r,
			isSingleImage: !1,
			surfaceStyle: J(t),
			imageStyle: `object-fit: ${n};`
		};
	}
	function we(e, t) {
		let n = R.get(e.id);
		if (n) return n;
		let r = D(z).images.length === 4 ? "4 / 3" : t === 1 ? gr({
			dim: e.dim,
			kind: e.kind
		}) : "1 / 1";
		return R.set(e.id, r), r;
	}
	function Te(e) {
		let t = ae.get(e.id);
		if (t !== void 0) return t;
		let n = !!e.dim?.trim();
		return ae.set(e.id, n), n;
	}
	function Ee(e, t, n) {
		return !t.isSingleImage && Ne(e, n);
	}
	function De(e, t, n) {
		return t.isSingleImage && Ne(e, n);
	}
	function Oe(e) {
		ie.has(e) || (ie.add(e), B.fetchAndCacheMedia(e));
	}
	async function ke(e, t) {
		t.stopPropagation(), t.preventDefault();
		let n = await bt(e.url, "URL", navigator, window);
		return C(re, {
			...D(re),
			[e.url]: n ? "copied" : "failed"
		}, !0), setTimeout(() => {
			C(re, {
				...D(re),
				[e.url]: void 0
			}, !0);
		}, 1800), n;
	}
	function Ae(e) {
		B.fetchAndCacheMedia(e.url);
	}
	function je(e, t) {
		if (!e.cached) return;
		let n = D(z).fullscreenMediaItems.findIndex((t) => t.id === e.id);
		n < 0 || w()?.({
			index: n,
			mediaList: D(z).fullscreenMediaItems,
			focusOrigin: t
		});
	}
	function Me(e) {
		return e.hasResolvedCache && !e.cached && !e.isCaching && !e.hasFetchFailed;
	}
	function Ne(e, t) {
		return t !== "ready" && t !== "cache-materializing" && (!e.hasResolvedCache || t === "loading");
	}
	function Pe(e, t) {
		return !!e.blurhash && t !== "ready" && t !== "cache-materializing" && (e.kind === "image" || e.kind === "video");
	}
	function Fe(e) {
		return e === "ready" || e === "cache-materializing";
	}
	function Ie(e) {
		return e === "error" ? "post-history-media-placeholder-failed" : "post-history-media-placeholder-uncached";
	}
	function Le(e) {
		return `${ze(e)} ${V(e)}`;
	}
	function Re(e) {
		let t = R.get(e.id);
		if (t) return t;
		let n = gr({
			dim: e.dim,
			kind: e.kind
		});
		return R.set(e.id, n), ae.set(e.id, !!e.dim?.trim()), n;
	}
	function ze(e) {
		return !e.hasResolvedCache || e.isLoadingPreview ? o()("postHistory.mediaLoading") : e.cached ? o()("postHistory.mediaCached") : e.hasFetchFailed ? o()("postHistory.mediaLoadFailed") : e.isCaching ? o()("postHistory.mediaLoading") : o()("postHistory.mediaNotCached");
	}
	var Be = i(), Ve = x(Be), He = (e) => {
		var t = Jr(), n = M(t), r = (e) => {
			var t = zr();
			let n;
			a(t, 21, () => D(le), c, (e, t) => {
				var n = Rr();
				a(n, 21, () => D(t).items, (e) => e.id, (e, n) => {
					let r = F(() => D(z).images.length === 1), i = F(() => Ce({
						item: D(n),
						slotCount: D(t).slotCount,
						isSingleImage: D(r)
					})), a = F(() => Y(D(n))), o = F(() => Pe(D(n), D(a)));
					var s = Lr(), c = M(s);
					let u;
					var d = M(c), p = (e) => {
						var t = Fr();
						let a;
						var o = M(t), s = (e) => {
							var t = Nr(), r = M(t), a = (e) => {
								var t = Mr();
								A((e) => {
									I(t, "src", D(n).previewObjectUrl), I(t, "alt", e), P(t, D(i).imageStyle), I(t, "width", D(i).dimensionHints.width), I(t, "height", D(i).dimensionHints.height);
								}, [() => D(n).alt || V(D(n))]), h(e, t);
							};
							L(r, (e) => {
								D(n).previewObjectUrl && e(a);
							}), l(t), A(() => P(t, D(i).layoutFrameStyle)), h(e, t);
						}, c = (e) => {
							var t = Pr();
							A((e) => {
								I(t, "src", D(n).previewObjectUrl), I(t, "alt", e), P(t, D(i).imageStyle), I(t, "width", D(i).dimensionHints.width), I(t, "height", D(i).dimensionHints.height);
							}, [() => D(n).alt || V(D(n))]), h(e, t);
						};
						L(o, (e) => {
							D(r) ? e(s) : D(n).previewObjectUrl && e(c, 1);
						}), l(t), A((e, n) => {
							a = f(t, 1, "post-history-media-surface post-history-image-surface svelte-8yjcw8", null, a, { "post-history-image-surface-single": D(r) }), P(t, D(i).surfaceStyle), I(t, "aria-label", e), I(t, "title", n);
						}, [() => U(D(n)), () => V(D(n))]), _("click", t, (e) => je(D(n), e.currentTarget instanceof HTMLElement ? e.currentTarget : null)), h(e, t);
					}, m = F(() => Fe(D(a))), x = (e) => {
						var t = Nr(), r = M(t);
						{
							let e = F(() => Ie(D(a)));
							v(r, () => D(n), () => D(i), () => D(e), () => D(o), () => D(a) === "error");
						}
						l(t), A(() => P(t, D(i).layoutFrameStyle)), h(e, t);
					}, S = (e) => {
						{
							let t = F(() => Ie(D(a)));
							v(e, () => D(n), () => D(i), () => D(t), () => D(o), () => D(a) === "error");
						}
					};
					L(d, (e) => {
						D(m) ? e(p) : D(r) ? e(x, 1) : e(S, -1);
					});
					var C = O(d, 2), w = (e) => {
						var t = Ir(), n = M(t);
						xe(n, {
							showLoader: !0,
							text: !1,
							loaderSize: 34
						}), l(t), h(e, t);
					}, T = F(() => De(D(n), D(i), D(a)));
					L(C, (e) => {
						D(T) && e(w);
					});
					var E = O(C, 2);
					g(E, () => D(n), () => "post-history-media-copy-button-image"), l(c), l(s), ee(s, (e, t) => Pt?.(e, t), () => ({
						enabled: Me(D(n)),
						once: !0,
						root: b(),
						rootMargin: y,
						onEnterView: () => Oe(D(n).url)
					})), A(() => {
						u = f(c, 1, "post-history-image-surface-frame svelte-8yjcw8", null, u, { "post-history-image-surface-frame-single": D(r) }), P(c, D(r) ? D(i).frameStyle : void 0);
					}), h(e, s);
				}), l(n), A(() => P(n, `--post-history-image-columns: ${D(t).slotCount};`)), h(e, n);
			}), l(t), A(() => n = f(t, 1, "post-history-image-grid svelte-8yjcw8", null, n, { "post-history-image-grid-single": D(z).images.length === 1 })), h(e, t);
		};
		L(n, (e) => {
			D(le).length > 0 && e(r);
		});
		var i = O(n, 2), s = (e) => {
			var t = Br(), n = S(t, !0);
			A((e) => {
				I(t, "aria-expanded", D(oe)), m(n, e);
			}, [() => D(oe) ? o()("postHistory.hideExtraImages") : o()("postHistory.showAllImages", { values: { count: D(z).images.length } })]), _("click", t, () => C(oe, !D(oe))), h(e, t);
		};
		L(i, (e) => {
			D(ce) && e(s);
		});
		var u = O(i, 2), d = (e) => {
			var t = Gr();
			a(t, 21, () => D(ue), (e) => e.id, (e, t) => {
				let n = F(() => Re(D(t))), r = F(() => Y(D(t))), i = F(() => Pe(D(t), D(r)));
				var a = Wr(), s = M(a), c = M(s), u = S(c, !0), d = O(c, 2);
				g(d, () => D(t), () => "post-history-video-copy-button"), l(s);
				var p = O(s, 2), v = M(p), x = (e) => {
					var n = Vr();
					A(() => I(n, "src", D(t).previewObjectUrl)), h(e, n);
				}, C = (e) => {
					var n = Ur();
					let r;
					var a = M(n), s = (e) => {
						Wn(e, { get blurhash() {
							return D(t).blurhash;
						} });
					};
					L(a, (e) => {
						D(i) && e(s);
					});
					var c = O(a, 2), u = M(c), d = (e) => {
						var n = Hr(), r = S(n, !0);
						A((e) => m(r, e), [() => o()("postHistory.mediaFetchAndCache")]), _("click", n, () => Ae(D(t))), h(e, n);
					};
					L(u, (e) => {
						D(t).hasFetchFailed && e(d);
					}), l(c), l(n), A((e, a) => {
						r = f(n, 1, "post-history-media-placeholder post-history-video-placeholder svelte-8yjcw8", null, r, {
							"post-history-media-placeholder-cached": D(t).cached,
							"post-history-media-placeholder-uncached": !D(t).cached && !D(t).hasFetchFailed,
							"post-history-media-placeholder-failed": D(t).hasFetchFailed,
							"post-history-media-placeholder-blurhash": D(i)
						}), I(n, "aria-label", e), I(n, "title", a);
					}, [() => Le(D(t)), () => V(D(t))]), h(e, n);
				};
				L(v, (e) => {
					D(t).cached && D(t).previewObjectUrl ? e(x) : e(C, -1);
				}), l(p), l(a), ee(a, (e, t) => Pt?.(e, t), () => ({
					enabled: Me(D(t)),
					once: !0,
					root: b(),
					rootMargin: y,
					onEnterView: () => Oe(D(t).url)
				})), A((e, t) => {
					m(u, e), P(p, t);
				}, [() => V(D(t)), () => `${J(D(n))} max-height: 300px;`]), h(e, a);
			}), l(t), h(e, t);
		};
		L(u, (e) => {
			D(ue).length > 0 && e(d);
		});
		var p = O(u, 2), x = (e) => {
			var t = qr();
			a(t, 21, () => D(de), (e) => e.id, (e, t) => {
				let n = F(() => Y(D(t)));
				var r = Kr(), i = M(r), a = M(i), s = S(a, !0), c = O(a, 2);
				g(c, () => D(t), () => "post-history-video-copy-button"), l(i);
				var u = O(i, 2);
				let d;
				var p = M(u), v = M(p), x = (e) => {
					var n = Hr(), r = S(n, !0);
					A((e) => m(r, e), [() => o()("postHistory.mediaFetchAndCache")]), _("click", n, () => Ae(D(t))), h(e, n);
				};
				L(v, (e) => {
					D(t).hasFetchFailed && e(x);
				}), l(p);
				var C = O(p, 2), w = (e) => {
					var t = Ar(), n = M(t);
					xe(n, {
						showLoader: !0,
						text: !1,
						loaderSize: 34
					}), l(t), h(e, t);
				}, T = F(() => Ne(D(t), D(n)));
				L(C, (e) => {
					D(T) && e(w);
				}), l(u), l(r), ee(r, (e, t) => Pt?.(e, t), () => ({
					enabled: Me(D(t)),
					once: !0,
					root: b(),
					rootMargin: y,
					onEnterView: () => Oe(D(t).url)
				})), A((e, n, r) => {
					m(s, e), d = f(u, 1, "post-history-media-placeholder svelte-8yjcw8", null, d, {
						"post-history-media-placeholder-cached": D(t).cached,
						"post-history-media-placeholder-uncached": !D(t).cached && !D(t).hasFetchFailed,
						"post-history-media-placeholder-failed": D(t).hasFetchFailed
					}), I(u, "aria-label", n), I(u, "title", r);
				}, [
					() => V(D(t)),
					() => Le(D(t)),
					() => V(D(t))
				]), h(e, r);
			}), l(t), h(e, t);
		};
		L(p, (e) => {
			D(de).length > 0 && e(x);
		}), l(t), h(e, t);
	};
	L(Ve, (e) => {
		D(z).items.length > 0 && e(He);
	}), h(e, Be), p(), d();
}
g(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/components/TextLinkSegments.svelte
var Zr = s("<a class=\"reference-content-link svelte-1dq7r7\" target=\"_blank\" rel=\"noopener noreferrer\"> </a>"), Qr = s("<span> </span>"), $r = {
	hash: "svelte-1dq7r7",
	code: ".reference-content-link.svelte-1dq7r7 {overflow-wrap:anywhere;word-break:break-word;}.reference-content-link.svelte-1dq7r7:visited {color:var(--link-visited);}"
};
function ei(e, n) {
	t(e, $r);
	var r = i(), o = x(r);
	a(o, 17, () => n.segments, c, (e, t) => {
		var n = i(), r = x(n), a = (e) => {
			var n = Zr(), r = S(n, !0);
			A(() => {
				I(n, "href", D(t).href), m(r, D(t).text);
			}), h(e, n);
		}, o = (e) => {
			var n = Qr(), r = S(n, !0);
			A(() => m(r, D(t).text)), h(e, n);
		};
		L(r, (e) => {
			D(t).type === "link" ? e(a) : e(o, -1);
		}), h(e, n);
	}), h(e, r);
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPreviewContent.svelte
var ti = s("<span class=\"post-history-custom-emoji-slot post-history-custom-emoji-failed svelte-yrehuj\" role=\"img\" tabindex=\"0\"> </span>"), ni = s("<img class=\"post-history-custom-emoji svelte-yrehuj\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), ri = s("<span class=\"post-history-custom-emoji-placeholder svelte-yrehuj\" aria-hidden=\"true\"></span>"), ii = s("<span class=\"post-history-custom-emoji-slot svelte-yrehuj\"><!></span>"), ai = s("<div></div> <!>", 1), oi = s("<div class=\"post-history-preview-content svelte-yrehuj\"><!></div>"), si = {
	hash: "svelte-yrehuj",
	code: ".post-history-preview-content.svelte-yrehuj {position:relative;display:flex;flex-direction:column;gap:6px;}.post-history-preview-text.svelte-yrehuj {overflow-wrap:anywhere;white-space:pre-wrap;font-size:var(--post-content-font-size, 1rem);line-height:var(--post-content-line-height, 1.5);}.post-history-preview-text-collapsed.svelte-yrehuj {max-height:calc(5 * var(--post-content-line-height, 1.5) * 1em);overflow:hidden;}.post-history-custom-emoji-slot.svelte-yrehuj {display:inline-grid;margin:0;padding:0;}.post-history-custom-emoji.svelte-yrehuj,\n    .post-history-custom-emoji-placeholder.svelte-yrehuj {width:100%;height:100%;}.post-history-custom-emoji.svelte-yrehuj {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-history-custom-emoji-failed.svelte-yrehuj {display:inline-grid;place-items:center;overflow:hidden;border-radius:4px;background:rgba(127, 127, 127, 0.18);font-size:0.45em;line-height:1;vertical-align:bottom;white-space:nowrap;cursor:help;}.post-history-custom-emoji-placeholder.svelte-yrehuj {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}"
};
function ci(e, o) {
	r(o, !0), t(e, si);
	let s = k(o, "textOverlay", 3, void 0), g = k(o, "emojiLoadStateByUrl", 19, () => ({})), _ = k(o, "emojiImageMetaByUrl", 19, () => ({})), v = k(o, "previewCollapseAction", 3, () => ({})), y = k(o, "previewCollapseEventId", 3, ""), b = k(o, "previewContentId", 3, void 0), C = k(o, "isCollapsed", 3, !1), w = k(o, "emojiSize", 3, 30), T = k(o, "fontSize", 3, "1rem"), E = k(o, "lineHeight", 3, 1.5), te = k(o, "contentClass", 3, ""), ne = k(o, "collapsedContentClass", 3, ""), j = /* @__PURE__ */ new Map();
	function N(e) {
		return e.type !== "media";
	}
	let re = F(() => o.previewContent.segments.filter(N)), ie = F(() => D(re).some((e) => e.type === "emoji" || e.type === "link" || e.type === "text" && e.text.trim().length > 0));
	function R(e) {
		return g()[e] === "ready";
	}
	function ae(e) {
		return g()[e] === "failed";
	}
	function oe(e) {
		return Number.isInteger(e) ? `${e}` : e.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
	}
	function z(e) {
		let t = j.get(e);
		if (t === void 0) {
			let n = _()[e]?.aspectRatio;
			t = typeof n == "number" && Number.isFinite(n) && n > 0 ? w() * n : w(), j.set(e, t);
		}
		return [
			`width: ${oe(t)}px;`,
			`height: ${w()}px;`,
			"vertical-align: bottom;"
		].join(" ");
	}
	var B = oi(), se = M(B), ce = (e) => {
		var t = ai(), r = x(t);
		a(r, 21, () => D(re), c, (e, t) => {
			var n = i(), r = x(n), a = (e) => {
				{
					let n = F(() => [D(t)]);
					ei(e, { get segments() {
						return D(n);
					} });
				}
			}, o = (e) => {
				var n = ti(), r = S(n, !0);
				A((e) => {
					P(n, e), I(n, "aria-label", D(t).rawShortcodeText), I(n, "title", D(t).rawShortcodeText), m(r, D(t).rawShortcodeText);
				}, [() => z(D(t).url)]), h(e, n);
			}, s = F(() => ae(D(t).url)), c = (e) => {
				var n = ii(), r = M(n), i = (e) => {
					var n = ni();
					A(() => {
						I(n, "src", D(t).url), I(n, "alt", D(t).rawShortcodeText), I(n, "title", D(t).rawShortcodeText);
					}), h(e, n);
				}, a = F(() => R(D(t).url)), o = (e) => {
					var t = ri();
					h(e, t);
				};
				L(r, (e) => {
					D(a) ? e(i) : e(o, -1);
				}), l(n), A((e) => P(n, e), [() => z(D(t).url)]), h(e, n);
			};
			L(r, (e) => {
				D(t).type === "text" || D(t).type === "link" ? e(a) : D(s) ? e(o, 1) : e(c, -1);
			}), h(e, n);
		}), l(r), ee(r, (e, t) => v()?.(e, t), y);
		var o = O(r, 2);
		d(o, () => s() ?? u), A((e) => {
			I(r, "id", b()), f(r, 1, e, "svelte-yrehuj");
		}, [() => n([
			"post-history-preview-text",
			te(),
			C() ? "post-history-preview-text-collapsed" : "",
			C() ? ne() : ""
		].filter(Boolean).join(" "))]), h(e, t);
	};
	L(se, (e) => {
		D(ie) && e(ce);
	}), l(B), A(() => P(B, `--post-content-font-size: ${T()}; --post-content-line-height: ${E()};`)), h(e, B), p();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postContentPreview.ts
function li(e, t) {
	let n = t.find((e) => e[0] === "content-warning");
	return n && n.length > 2 ? n[2] : e;
}
function ui(e) {
	let t = e.tags.find((e) => e[0] === "content-warning"), n = t !== void 0 && t.length > 2, r = e.resolvedBody ? e.sourceContent : li(e.sourceContent, e.tags), i = e.displayContent ?? r, a = Me({
		content: r,
		tags: e.tags
	}), o = e.media === void 0 ? a : n ? [...e.media, ...a.filter((t) => !e.media.some((e) => e.url === t.url))] : e.media, s = Sr({
		content: i,
		tags: e.tags,
		media: o
	}), c = yr(o);
	return {
		previewContent: s,
		media: o,
		mediaLayout: c,
		hasRenderableText: s.segments.some((e) => e.type === "emoji" || e.type === "link" || e.type === "text" && e.text.trim().length > 0),
		hasRenderableMedia: c.items.length > 0,
		contentWarning: t ? { reason: t?.[1] ?? "" } : null,
		sourceTags: e.tags.map((e) => [...e]),
		kind: e.kind
	};
}
function di(e, t, n = t) {
	return ui({
		kind: e.kind,
		sourceContent: t,
		displayContent: n,
		tags: e.sourceTags,
		resolvedBody: !0
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostContentPreview.svelte
var fi = s("<span class=\"svelte-13idcaf\"> </span>"), pi = s("<span role=\"status\" class=\"svelte-13idcaf\"> </span>"), mi = s("<div class=\"content-warning-prompt svelte-13idcaf\" role=\"group\"><div class=\"content-warning-copy svelte-13idcaf\"><strong> </strong> <!></div> <!> <button type=\"button\" class=\"content-warning-reveal-button svelte-13idcaf\"> </button></div>"), hi = s("<div class=\"post-preview-content\"><!></div>"), gi = s("<div class=\"post-preview-media\"><!></div>"), _i = s("<!> <!> <!> <!>", 1), vi = s("<div><!></div>"), yi = {
	hash: "svelte-13idcaf",
	code: ".post-content-preview.svelte-13idcaf {display:flex;flex-direction:column;gap:var(--post-content-block-gap, 6px);width:100%;max-width:100%;min-width:0;}.content-warning-prompt.svelte-13idcaf {display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;width:100%;max-width:100%;min-width:0;box-sizing:border-box;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 16%);color:var(--text);}.content-warning-copy.svelte-13idcaf {display:flex;flex:1 1 0;flex-direction:column;gap:3px;min-width:0;overflow-wrap:anywhere;}.content-warning-copy.svelte-13idcaf span:where(.svelte-13idcaf) {color:var(--text-muted);font-size:0.9em;}.content-warning-reveal-button.svelte-13idcaf {flex:0 1 auto;height:auto;max-width:100%;min-width:0;min-height:40px;box-sizing:border-box;padding:6px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;cursor:pointer;white-space:normal;overflow-wrap:anywhere;}.content-warning-reveal-button.svelte-13idcaf:hover {border-color:var(--theme);}"
};
function bi(e, n) {
	r(n, !0), t(e, yi);
	let a = () => ne(ye, "$_", o), [o, s] = te(), c = k(n, "loadSensitiveBody", 3, void 0), g = k(n, "resolveSensitiveDisplayContent", 3, void 0), v = k(n, "contentWarningEventId", 3, void 0), y = k(n, "density", 3, "standard"), w = k(n, "emojiLoadStateByUrl", 19, () => ({})), ee = k(n, "emojiImageMetaByUrl", 19, () => ({})), re = k(n, "scrollRoot", 3, null), ie = k(n, "maxVisibleImages", 3, void 0), R = k(n, "previewContentId", 3, void 0), ae = k(n, "isTextCollapsed", 3, !1), oe = k(n, "previewCollapseAction", 3, () => ({})), z = k(n, "previewCollapseEventId", 3, ""), B = k(n, "contentClass", 3, ""), se = k(n, "collapsedContentClass", 3, ""), ce = k(n, "renderWhenEmpty", 3, !1), le = k(n, "onImageOpen", 3, void 0), ue = k(n, "betweenContentAndMedia", 3, void 0), de = k(n, "afterContentAndMedia", 3, void 0), V = k(n, "textOverlay", 3, void 0), fe = N(null), pe = N(!1), H = N(void 0), me = N(!1), U = N(!1), W = 0, he, G = N(E({})), ge = N(E({})), _e = F(() => v() === void 0 ? D(pe) : D(fe) === v());
	function ve() {
		he?.abort(), he = void 0, W += 1, C(fe, null), C(pe, !1), C(H, void 0), C(me, !1), C(U, !1), C(G, {}, !0), C(ge, {}, !0);
	}
	let be, K, q = F(v), xe = F(c);
	b(() => {
		let e = D(q), t = D(xe), n = t === K || !!t?.scope && !!K?.scope && t.scope.runtime === K.scope.runtime && t.scope.ownerPubkey === K.scope.ownerPubkey;
		e === be && n || T(ve), be = e, K = t;
		let r = !0, i = t?.observe?.((e) => {
			r && (e === "deleted" || e === "invalid" || e === "missing" && D(H) !== void 0) && (ve(), C(U, !0));
		});
		return () => {
			r = !1, i?.();
		};
	}), j(ve);
	let J = F(() => D(H) === void 0 ? n.model : di(n.model, D(H), g()?.(D(H)) ?? D(H)));
	b(() => {
		if (!D(_e) || D(H) === void 0 || !c()?.loadEmoji) return;
		let e = D(J).previewContent.emojiUrls, t = c().loadEmoji, n = W;
		for (let r of e) T(() => D(G)[r]) || w()[r] === "ready" || (C(G, {
			...T(() => D(G)),
			[r]: "loading"
		}, !0), t(r).then((e) => {
			n === W && (C(G, {
				...D(G),
				[r]: e.ready ? "ready" : "failed"
			}, !0), e.ready && e.aspectRatio && C(ge, {
				...D(ge),
				[r]: { aspectRatio: e.aspectRatio }
			}, !0));
		}).catch(() => {
			n === W && C(G, {
				...D(G),
				[r]: "failed"
			}, !0);
		}));
	});
	async function Se() {
		if (c()) {
			let e = W;
			he?.abort(), he = new AbortController(), C(me, !0), C(U, !1);
			try {
				let t = await c()(he.signal);
				if (e !== W) return;
				if (t === null) {
					C(U, !0);
					return;
				}
				C(H, t, !0);
			} catch {
				if (e !== W) return;
				C(U, !0);
				return;
			} finally {
				e === W && C(me, !1);
			}
		}
		v() === void 0 ? C(pe, !0) : C(fe, v());
	}
	let Y = F(() => {
		switch (y()) {
			case "compact": return {
				emojiSize: 24,
				fontSize: "inherit",
				lineHeight: 1.45,
				gap: 4
			};
			case "reply": return {
				emojiSize: 30,
				fontSize: "inherit",
				lineHeight: 1.4,
				gap: 6
			};
			case "dialog": return {
				emojiSize: 30,
				fontSize: "inherit",
				lineHeight: 1.45,
				gap: 6
			};
			default: return {
				emojiSize: 30,
				fontSize: "1rem",
				lineHeight: 1.5,
				gap: 6
			};
		}
	});
	var Ce = i(), we = x(Ce), Te = (e) => {
		var t = vi(), n = M(t), r = (e) => {
			var t = mi(), n = M(t), r = M(n), i = S(r, !0), o = O(r, 2), s = (e) => {
				var t = fi(), n = S(t, !0);
				A(() => m(n, D(J).contentWarning.reason)), h(e, t);
			};
			L(o, (e) => {
				D(J).contentWarning.reason && e(s);
			}), l(n);
			var c = O(n, 2), u = (e) => {
				var t = pi(), n = S(t, !0);
				A((e) => m(n, e), [() => a()("postContent.sensitivePayloadLoading")]), h(e, t);
			}, d = (e) => {
				var t = pi(), n = S(t, !0);
				A((e) => m(n, e), [() => a()("postContent.sensitivePayloadUnavailable")]), h(e, t);
			};
			L(c, (e) => {
				D(me) ? e(u) : D(U) && e(d, 1);
			});
			var f = O(c, 2), p = S(f, !0);
			l(t), A((e, n, r) => {
				I(t, "aria-label", e), m(i, n), f.disabled = D(me), m(p, r);
			}, [
				() => a()("postContent.contentWarningTitle"),
				() => a()("postContent.contentWarningTitle"),
				() => a()(D(U) ? "postContent.retrySensitivePayload" : "postContent.showContentWarningBody")
			]), _("click", f, () => void Se()), h(e, t);
		}, i = (e) => {
			var t = _i(), n = x(t), r = (e) => {
				var t = hi(), n = M(t);
				{
					let e = F(() => ({
						...w(),
						...D(G)
					})), t = F(() => ({
						...ee(),
						...D(ge)
					}));
					ci(n, {
						get previewContent() {
							return D(J).previewContent;
						},
						get emojiLoadStateByUrl() {
							return D(e);
						},
						get emojiImageMetaByUrl() {
							return D(t);
						},
						get previewCollapseAction() {
							return oe();
						},
						get previewCollapseEventId() {
							return z();
						},
						get previewContentId() {
							return R();
						},
						get textOverlay() {
							return V();
						},
						get contentClass() {
							return B();
						},
						get collapsedContentClass() {
							return se();
						},
						get isCollapsed() {
							return ae();
						},
						get emojiSize() {
							return D(Y).emojiSize;
						},
						get fontSize() {
							return D(Y).fontSize;
						},
						get lineHeight() {
							return D(Y).lineHeight;
						}
					});
				}
				l(t), h(e, t);
			};
			L(n, (e) => {
				D(J).hasRenderableText && e(r);
			});
			var i = O(n, 2);
			d(i, () => ue() ?? u);
			var a = O(i, 2), o = (e) => {
				var t = gi();
				Xr(M(t), {
					get media() {
						return D(J).media;
					},
					get mediaLayout() {
						return D(J).mediaLayout;
					},
					get scrollRoot() {
						return re();
					},
					get maxVisibleImages() {
						return ie();
					},
					get onImageOpen() {
						return le();
					}
				}), l(t), h(e, t);
			};
			L(a, (e) => {
				D(J).hasRenderableMedia && e(o);
			});
			var s = O(a, 2);
			d(s, () => de() ?? u), h(e, t);
		};
		L(n, (e) => {
			D(J).contentWarning && !D(_e) ? e(r) : e(i, -1);
		}), l(t), A(() => {
			f(t, 1, `post-content-preview post-content-preview-${y()}`, "svelte-13idcaf"), P(t, `--post-content-block-gap: ${D(Y).gap}px;`);
		}), h(e, t);
	};
	L(we, (e) => {
		(D(J).hasRenderableText || D(J).hasRenderableMedia || D(J).contentWarning || ce() || de()) && e(Te);
	}), h(e, Ce), p(), s();
}
g(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogPresentation.ts
function xi(e) {
	return e.isSearchMode ? e.totalCountKnown === !1 ? { key: e.totalCountStatus === "failed" ? "postHistory.countUnavailable" : "postHistory.countLoading" } : e.totalCount <= 0 ? null : {
		key: "postHistory.searchCountSummary",
		values: { total: e.totalCount }
	} : e.totalCountKnown ? {
		key: "postHistory.visibleCountSummary",
		values: { total: e.totalCount }
	} : e.totalCountStatus === "failed" ? { key: "postHistory.countUnavailable" } : { key: "postHistory.countLoading" };
}
function Si(e) {
	return e.direction === "older" ? e.isSearchMode ? "postHistory.loadOlderSearchResults" : "postHistory.loadOlder" : e.isSearchMode ? "postHistory.loadNewerSearchResults" : "postHistory.loadNewer";
}
function Ci(e) {
	return e.status === "loading" ? { key: "postHistory.checkingReplies" } : e.status === "failed" ? { key: "postHistory.recheckReplies" } : e.status === "loaded" ? e.replyCount === 0 ? { key: "postHistory.recheckReplies" } : e.visible ? { key: "postHistory.hideReplies" } : {
		key: "postHistory.showRepliesWithCount",
		values: { count: e.replyCount }
	} : { key: "postHistory.checkReplies" };
}
function wi(e) {
	return e.visible ? { key: "postHistory.hideReactions" } : {
		key: "postHistory.showReactionsWithCount",
		values: { count: e.reactionCount }
	};
}
function Ti(e) {
	return e === "+";
}
function Ei(e) {
	let t = e.trim();
	return t ? Ot(t) ? t : Nt(t) : "+";
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryContextFetchService.ts
var Di = 5e3, Oi = 8, ki = new class {
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
		let n = !1, r = /* @__PURE__ */ new Set(), i, a, o = /* @__PURE__ */ new Set(), s = !1, c = !t.authorHint, l = !0, u = () => {
			for (let e of r) e.unsubscribe?.();
			r.clear();
		}, d = (e) => (t) => {
			n || (n = !0, i?.finish(), e(t));
		};
		return {
			promise: new Promise((f) => {
				let p = d(f);
				a = p, i = new ke(Math.min(6e3, t.timeoutMs ?? Di), () => {
					p({
						event: null,
						relayUrl: null
					});
				}, {
					setTimeoutFn: this.setTimeoutFn,
					clearTimeoutFn: this.clearTimeoutFn
				}), i.add(u);
				let m = () => {
					s && c && l && p({
						event: null,
						relayUrl: null
					});
				}, h = (i, a) => {
					if (n) return;
					let c = i.filter((e) => !o.has(e));
					if (c.forEach((e) => o.add(e)), c.length === 0) {
						a === "base" ? s = !0 : l = !0, m();
						return;
					}
					let d = Te(), f = !1, h = () => {
						f || (f = !0, a === "base" ? s = !0 : l = !0, m());
					};
					try {
						let i = rt(e, d, { on: { relays: c } }).subscribe({
							next: (e) => {
								e.event?.id === t.eventId && p({
									event: e.event,
									relayUrl: typeof e.from == "string" ? e.from : null
								});
							},
							complete: h,
							error: (e) => {
								this.console.error("post_history_context_fetch_error", e), h();
							}
						});
						if (r.add(i), n) {
							u();
							return;
						}
						d.emit({ ids: [t.eventId] }), d.over();
					} catch (e) {
						this.console.error("post_history_context_fetch_request_error", e), h();
					}
				};
				h(this.resolveRelayUrls(t.relayHints, t.relayConfig), "base"), t.authorHint && (this.lookupAuthorWriteRelaysFn ? this.lookupAuthorWriteRelaysFn(t.authorHint) : ot(e).lookup(t.authorHint).then((e) => e.writeRelays)).then((e) => {
					if (c = !0, n) return;
					let r = this.resolveRelayUrls(e, t.relayConfig);
					l = !1, h(r, "author");
				}).catch(() => {
					c = !0, m();
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
		let n = lt(e, Oi);
		if (n) return n;
		let r = t ? [...R.extractReadRelays(t), ...R.extractWriteRelays(t)] : [], i = R.sanitizeExternalRelayUrls([...e ?? [], ...r], { limit: Oi });
		return i.length > 0 ? i : R.sanitizeExternalRelayUrls(ie, { limit: Oi });
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileRelayTiers.ts
function Ai(e) {
	let t = ut(), n = t ? [] : R.sanitizeExternalRelayUrls(ae), r = new Set(n), i = R.sanitizeExternalRelayUrls(e.contextualRelays).filter((e) => !r.has(e)).slice(0, t ? void 0 : e.contextualRelayLimit), a = new Set(i);
	return {
		bootstrap: n,
		contextual: i,
		fallback: t ? [] : R.sanitizeExternalRelayUrls([...ie, ...e.fallbackRelays ?? []]).filter((e) => !r.has(e) && !a.has(e))
	};
}
function ji(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = R.sanitizeExternalRelayUrls(t[r]);
		if (e.length === 0) continue;
		let i = JSON.stringify([...e].sort((e, t) => e.localeCompare(t))), a = n.get(i);
		a ? a.pubkeys.push(r) : n.set(i, {
			relays: e,
			pubkeys: [r]
		});
	}
	return Array.from(n.values());
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileMetadataCache.svelte.ts
var Mi = 3e5, Ni = 18e5, Pi = 6e4, Fi = 30, Ii = 4e3, Li = 12, Ri = 50, zi = 2, Bi = 600, Q = N({}), Vi = /* @__PURE__ */ new Map(), Hi = /* @__PURE__ */ new Map(), Ui = /* @__PURE__ */ new Map(), Wi = /* @__PURE__ */ new Map(), Gi = [], Ki = null, qi = /* @__PURE__ */ new Map();
function Ji(e) {
	return !e.signal?.aborted;
}
async function Yi(e, t, n) {
	if (t.signal?.aborted) return null;
	let r = qi.get(e);
	(!r || r.abort.signal.aborted) && (r = {
		abort: new AbortController(),
		consumers: /* @__PURE__ */ new Set()
	}, qi.set(e, r));
	let i = {}, a = r;
	r.consumers.add(i);
	let o = () => {
		a.consumers.delete(i), a.consumers.size || a.abort.abort();
	};
	t.signal?.addEventListener("abort", o, { once: !0 });
	try {
		let i = Sa(e, {
			...t,
			signal: r.abort.signal
		}, n);
		return t.signal ? await new Promise((e, n) => {
			let r = () => e(null);
			t.signal.addEventListener("abort", r, { once: !0 }), i.then((n) => {
				t.signal.removeEventListener("abort", r), e(t.signal?.aborted ? null : n);
			}, (e) => {
				t.signal.removeEventListener("abort", r), n(e);
			});
		}) : await i;
	} finally {
		let n = () => {
			t.signal?.removeEventListener("abort", o), o(), !a.consumers.size && qi.get(e) === a && qi.delete(e);
		};
		a.followup ? a.followup.then(n, n) : n();
	}
}
function $() {
	return Date.now();
}
function Xi() {
	return Math.floor($() / 1e3);
}
function Zi(e) {
	return e ? {
		name: e.name,
		displayName: e.displayName,
		picture: e.picture
	} : null;
}
function Qi(e = []) {
	return R.sanitizeExternalRelayUrls(e);
}
function $i(e = []) {
	return Qi(e).slice(0, Li);
}
function ea(e) {
	return e.flatMap((e) => {
		let t = [];
		for (let n = 0; n < e.pubkeys.length; n += Ri) t.push({
			relays: e.relays,
			pubkeys: e.pubkeys.slice(n, n + Ri)
		});
		return t;
	});
}
async function ta(e, t, n) {
	let r = Array(e.length), i = 0, a = Array.from({ length: Math.min(t, e.length) }, async () => {
		for (; i < e.length;) {
			let t = i;
			i += 1, r[t] = await n(e[t]);
		}
	});
	return await Promise.all(a), r;
}
function na(e, t) {
	return e.expireAtMs <= t;
}
function ra(e, t) {
	return e.staleAtMs <= t;
}
function ia(e, t) {
	return e.status === "negative" && !!e.negativeUntilMs && e.negativeUntilMs > t;
}
function aa(e, t) {
	return typeof e.fetchedAt == "number" && Number.isFinite(e.fetchedAt) ? e.fetchedAt : t;
}
function oa(e, t, n = !0) {
	if (C(Q, {
		...D(Q),
		[e]: t
	}), !n) return;
	let r = Wi.get(e);
	if (r && r.size !== 0) for (let e of r) e(t.profile);
}
function sa(e) {
	let t = $();
	oa(e, {
		pubkey: e,
		status: "negative",
		profile: null,
		profileSummary: null,
		metadataRaw: null,
		fetchedAtMs: t,
		sourceEventCreatedAtSec: null,
		sourceEventId: null,
		staleAtMs: t + Pi,
		expireAtMs: t + Pi,
		negativeUntilMs: t + Pi,
		sourceRelay: null,
		lastValidatedAtMs: t,
		persistence: "persisted"
	});
}
function ca(e) {
	let t = $(), n = e.fetchedAtMs ?? t, r = {
		...e.profile,
		fetchedAt: e.profile.fetchedAt ?? n,
		updatedAtFromEvent: e.sourceEventCreatedAtSec ?? e.profile.updatedAtFromEvent
	};
	oa(e.pubkey, {
		pubkey: e.pubkey,
		status: "hit",
		profile: r,
		profileSummary: Zi(r),
		metadataRaw: e.metadataRaw,
		fetchedAtMs: n,
		sourceEventCreatedAtSec: e.sourceEventCreatedAtSec,
		sourceEventId: e.sourceEventId ?? null,
		staleAtMs: e.persistence === "temporary" ? t : n + Mi,
		expireAtMs: n + Ni,
		negativeUntilMs: null,
		sourceRelay: e.sourceRelay,
		lastValidatedAtMs: n,
		persistence: e.persistence ?? "persisted"
	}, e.notifySubscribers ?? !0);
}
function la(e, t) {
	if (!e) return !1;
	let n = e.profileRelays ?? [], r = t.profileRelays ?? [];
	return e.name === t.name && e.displayName === t.displayName && e.picture === t.picture && e.npub === t.npub && e.nprofile === t.nprofile && n.length === r.length && n.every((e, t) => e === r[t]);
}
function ua(e, t) {
	return D(Q)[e]?.profile ?? t.find((e) => e.existingSnapshot)?.existingSnapshot ?? null;
}
function da(e, t) {
	let n = D(Q)[e];
	if (n?.profile) return n.profile;
	let r = aa(t, $());
	return ca({
		pubkey: e,
		profile: t,
		metadataRaw: null,
		sourceEventCreatedAtSec: t.updatedAtFromEvent ?? null,
		sourceEventId: null,
		sourceRelay: null,
		fetchedAtMs: r
	}), D(Q)[e]?.profile ?? t;
}
function fa(e, t, n) {
	let r = t.acceptedProfile;
	if (!r) return null;
	let i = D(Q)[e], a = t.acceptedRecord, o = !!n.sourceEventId && n.sourceEventId === a?.sourceEventId, s = t.currentEventConfirmed || o, c = a?.fetchedAt ?? aa(r, $()), l = {
		...r,
		fetchedAt: r.fetchedAt ?? c,
		updatedAtFromEvent: a?.updatedAtFromEvent ?? r.updatedAtFromEvent
	};
	return ca({
		pubkey: e,
		profile: l,
		metadataRaw: s ? n.metadataRaw : null,
		sourceEventCreatedAtSec: a?.updatedAtFromEvent ?? r.updatedAtFromEvent ?? null,
		sourceEventId: a?.sourceEventId ?? (s ? n.sourceEventId : null),
		sourceRelay: s ? n.sourceRelay : null,
		fetchedAtMs: c,
		persistence: "persisted",
		notifySubscribers: !la(i?.profile ?? null, l)
	}), D(Q)[e]?.profile ?? r;
}
async function pa(e) {
	let t = D(Q)[e];
	if (t?.persistence !== "temporary" || !t.profile || !t.sourceEventId || t.sourceEventCreatedAtSec === null) return {
		profile: t?.profile ?? null,
		acceptedRecord: null,
		persistence: t?.persistence ?? null,
		dbError: !1
	};
	try {
		let n = $i([...t.profile.profileRelays ?? [], ...t.sourceRelay ? [t.sourceRelay] : []]), r = await Rn.upsertCandidate(e, {
			pubkeyHex: e,
			profile: t.profile,
			sourceEventId: t.sourceEventId,
			updatedAtFromEvent: t.sourceEventCreatedAtSec,
			observedRelays: n,
			fetchedAt: t.fetchedAtMs
		});
		return r.acceptedProfile && r.acceptedRecord ? {
			profile: fa(e, r, t),
			acceptedRecord: r.acceptedRecord,
			persistence: "persisted",
			dbError: !1
		} : {
			profile: t.profile,
			acceptedRecord: null,
			persistence: "temporary",
			dbError: !1
		};
	} catch {
		return {
			profile: t.profile,
			acceptedRecord: null,
			persistence: "temporary",
			dbError: !0
		};
	}
}
function ma(e, t) {
	let n = R.sanitizeExternalRelayUrls([...t.profile?.profileRelays ?? [], ...t.observedRelays]), r = {
		...t.profile,
		profileRelays: n.length > 0 ? n : void 0
	};
	return ca({
		pubkey: e,
		profile: r,
		metadataRaw: t.metadataRaw,
		sourceEventCreatedAtSec: t.sourceEventCreatedAtSec,
		sourceEventId: t.sourceEventId,
		sourceRelay: t.sourceRelay,
		persistence: "temporary"
	}), D(Q)[e]?.profile ?? r;
}
function ha(e, t, n = !0) {
	let r = D(Q)[e];
	if (!r) return;
	let i = $();
	oa(e, {
		...r,
		status: t,
		lastValidatedAtMs: i
	}, n);
}
function ga() {
	let e = $(), t = Object.entries(D(Q)).filter(([, t]) => !na(t, e));
	t.length !== Object.keys(D(Q)).length && C(Q, Object.fromEntries(t));
}
function _a(e) {
	try {
		let t = JSON.parse(e.content), n = e.relay ? [e.relay.endsWith("/") ? e.relay : `${e.relay}/`] : [], r = typeof t.picture == "string" ? t.picture : "", i = r ? de(r, {
			forceRemote: !1,
			navigatorOnline: !0
		}) : "", a = {
			name: typeof t.name == "string" ? t.name : "",
			displayName: typeof t.display_name == "string" ? t.display_name : "",
			picture: i,
			npub: mt(e.pubkey),
			nprofile: gt(e.pubkey, n, e.writeRelays),
			profileRelays: n.length > 0 ? n : void 0
		};
		return a.fetchedAt = $(), a.updatedAtFromEvent = e.createdAtSec, a;
	} catch {
		return null;
	}
}
async function va(e, t, n, r, i, a, o = [], s) {
	let c = Array.from(new Set(t.filter((e) => !!e))), l = {};
	for (let e of c) l[e] = {
		profile: null,
		metadataRaw: null,
		sourceEventCreatedAtSec: null,
		sourceEventId: null,
		sourceRelay: null,
		observedRelays: [],
		rejectedFutureTimestamp: !1,
		parseError: !1,
		networkError: !1,
		timedOut: !1
	};
	return c.length === 0 || o.length > 0 && o.every((e) => e.aborted) || await new Promise((t) => {
		let u = Te(), d = !1, f = null, p = null, m = () => {
			d || (d = !0, o.forEach((e) => e.removeEventListener("abort", h)), f?.unsubscribe(), p?.unsubscribe(), t());
		}, h = () => {
			o.every((e) => e.aborted) && m();
		};
		o.forEach((e) => e.addEventListener("abort", h));
		let g = () => {
			for (let e of c) l[e] = {
				...l[e],
				networkError: !0
			};
		}, _ = new Set(n), v = (e) => {
			_.has(e.from) && (e.state === "error" || e.state === "rejected" || e.state === "terminated") && g();
		};
		for (let t of _) {
			let n = e.getRelayStatus?.(t);
			(n?.connection === "error" || n?.connection === "rejected" || n?.connection === "terminated") && g();
		}
		let y = (e) => {
			let t = e.event?.created_at;
			if (typeof t != "number") return !1;
			let n = t <= Xi() + Bi;
			if (!n) {
				let t = e.event?.pubkey;
				t && l[t] && (l[t] = {
					...l[t],
					rejectedFutureTimestamp: !0
				});
			}
			return n;
		};
		try {
			p = e.createConnectionStateObservable?.().subscribe({ next: v }) ?? null;
			let t = Oe(e, u, { on: { relays: n } }, {
				timeoutMs: i,
				deadlineAt: s,
				onEnd: (e) => {
					if (!e.complete) for (let e of c) l[e] = {
						...l[e],
						timedOut: !0
					};
				}
			});
			f = (typeof t.pipe == "function" ? t.pipe(Qe(y)) : t).subscribe({
				next: (e) => {
					if (!y(e)) return;
					let t = e.event;
					if (!t || t.kind !== 0 || !t.pubkey || !c.includes(t.pubkey)) return;
					let n = l[t.pubkey];
					if (typeof t.created_at != "number" || typeof t.id != "string") return;
					let i = typeof e.from == "string" ? e.from : null;
					if (n.sourceEventCreatedAtSec === t.created_at && n.sourceEventId === t.id) {
						l[t.pubkey] = {
							...n,
							observedRelays: i ? [...n.observedRelays, i] : n.observedRelays
						};
						return;
					}
					if (n.sourceEventCreatedAtSec !== null && (t.created_at < n.sourceEventCreatedAtSec || t.created_at === n.sourceEventCreatedAtSec && n.sourceEventId !== null && t.id > n.sourceEventId)) return;
					let a = _a({
						pubkey: t.pubkey,
						content: t.content ?? "",
						createdAtSec: t.created_at,
						relay: i,
						writeRelays: r[t.pubkey] ?? []
					});
					a ? l[t.pubkey] = {
						profile: a,
						metadataRaw: t.content ?? null,
						sourceEventCreatedAtSec: t.created_at,
						sourceEventId: t.id,
						sourceRelay: i,
						observedRelays: i ? [i] : [],
						rejectedFutureTimestamp: !1,
						parseError: !1,
						networkError: !1,
						timedOut: n.timedOut
					} : l[t.pubkey] = {
						...n,
						parseError: !0
					};
				},
				complete: () => {
					m();
				},
				error: () => {
					g(), m();
				}
			}), u.emit({
				kinds: [0],
				authors: c,
				until: Xi() + Bi,
				limit: Math.max(24, c.length * 4)
			}), u.over(), a?.(c);
		} catch {
			g(), m();
		}
	}), l;
}
async function ya(e, t, n) {
	if (t.profile && t.sourceEventId !== null && t.sourceEventCreatedAtSec !== null) try {
		let r = await Rn.upsertCandidate(e, {
			pubkeyHex: e,
			profile: t.profile,
			sourceEventId: t.sourceEventId,
			updatedAtFromEvent: t.sourceEventCreatedAtSec,
			observedRelays: t.observedRelays,
			fetchedAt: aa(t.profile, $())
		});
		if (!n.some(Ji)) return {
			profile: null,
			stopReason: "persistence-unavailable",
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: !0
		};
		let i = fa(e, r, t);
		return {
			profile: i,
			stopReason: r.currentEventConfirmed && i !== null ? "current-event-confirmed" : null,
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: t.networkError || t.timedOut
		};
	} catch {
		let r = ua(e, n);
		return {
			profile: r ? da(e, r) : ma(e, t),
			stopReason: "persistence-unavailable",
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: t.networkError || t.timedOut
		};
	}
	return {
		profile: ua(e, n),
		stopReason: null,
		parseError: t.parseError,
		rejectedFutureTimestamp: t.rejectedFutureTimestamp,
		networkError: t.networkError,
		transientFailure: t.networkError || t.timedOut
	};
}
async function ba() {
	let e = Gi.filter((e) => Ji(e) ? !0 : (e.resolve(null), !1));
	if (Gi = [], Ki = null, e.length === 0) return;
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.rxNostr) ?? [];
		e.push(n), t.set(n.rxNostr, e);
	}
	for (let e of t.values()) {
		let t = /* @__PURE__ */ new Map(), n = {}, r = {}, i = {};
		for (let a of e) {
			let e = t.get(a.pubkey) ?? [];
			e.push(a), t.set(a.pubkey, e), r[a.pubkey] = Qi([...r[a.pubkey] ?? [], ...a.relays]), i[a.pubkey] = $i([...i[a.pubkey] ?? [], ...a.fallbackRelays]);
			let o = /* @__PURE__ */ new Set([...n[a.pubkey] ?? [], ...a.writeRelays]);
			n[a.pubkey] = Array.from(o);
		}
		let a = (e) => (t.get(e) ?? []).some(Ji), o = Array.from(t.keys()), s = Object.fromEntries(o.map((e) => {
			let t = Ai({
				contextualRelays: r[e] ?? [],
				fallbackRelays: i[e] ?? [],
				contextualRelayLimit: Li
			}), a = /* @__PURE__ */ new Set([...t.bootstrap, ...n[e] ?? []]);
			return t.contextual = t.contextual.filter((e) => !a.has(e)), t.fallback = t.fallback.filter((e) => !a.has(e)), [e, t];
		})), c = Ai({
			contextualRelays: [],
			contextualRelayLimit: Li
		}), l = new Set(o), u = {}, d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = [
			"bootstrap",
			"contextual",
			"fallback"
		], g = $() + 6e3, _ = (e, t) => e === "bootstrap" ? ji(t, Object.fromEntries(t.map((e) => [e, R.sanitizeExternalRelayUrls([...c.bootstrap, ...n[e] ?? []])]))) : ji(t, Object.fromEntries(t.map((t) => [t, s[t][e]])));
		try {
			for (let r of h) {
				if ($() >= g) {
					for (let e of l) p.add(e);
					break;
				}
				let i = await ta(ea(_(r, Array.from(l).filter(a))), zi, async (r) => {
					let i = r.pubkeys.filter((e) => a(e) && l.has(e));
					return i.length === 0 ? null : {
						activeTargets: i,
						results: await va(e[0].rxNostr, i, r.relays, n, Ii, (e) => {
							for (let t of e) m.add(t);
						}, i.flatMap((e) => (t.get(e) ?? []).flatMap((e) => e.signal ? [e.signal] : [])), g)
					};
				});
				for (let e of i) if (e) for (let n of e.activeTargets) {
					if (!a(n)) {
						l.delete(n);
						continue;
					}
					let r = t.get(n) ?? [], i = await ya(n, e.results[n], r);
					u[n] = i.profile, i.parseError && d.add(n), i.rejectedFutureTimestamp && f.add(n), i.transientFailure && p.add(n), i.stopReason !== null && l.delete(n);
				}
			}
			for (let e of l) {
				if (!a(e)) continue;
				let n = ua(e, t.get(e) ?? []);
				d.has(e) ? ha(e, "parse-error") : f.has(e) ? ha(e, "invalid-future-ts") : !n && m.has(e) && !p.has(e) && sa(e), u[e] = n ? da(e, n) : null;
			}
			for (let [e, n] of t.entries()) for (let t of n) t.resolve(Ji(t) ? u[e] ?? null : null);
		} catch {
			for (let [e, n] of t.entries()) {
				let t = ua(e, n);
				for (let r of n) r.resolve(Ji(r) && t ? da(e, t) : null);
			}
		}
	}
}
function xa(e, t, n, r, i, a, o) {
	return o?.aborted ? Promise.resolve(null) : new Promise((s, c) => {
		let l = () => {
			Gi = Gi.filter((e) => e.signal !== o), !Gi.length && Ki && (clearTimeout(Ki), Ki = null), s(null);
		};
		o?.addEventListener("abort", l, { once: !0 }), Gi.push({
			signal: o,
			rxNostr: t,
			pubkey: e,
			relays: [...n],
			fallbackRelays: [...r],
			writeRelays: [...i],
			existingSnapshot: a,
			resolve: (e) => {
				o?.removeEventListener("abort", l), s(e);
			},
			reject: c
		}), !Ki && (Ki = setTimeout(() => {
			ba();
		}, Fi));
	});
}
async function Sa(e, t, n = void 0) {
	if (t.signal?.aborted || !e || !t.rxNostr) return null;
	let r = Hi.get(e)?.signal?.aborted;
	r && Ui.delete(e);
	let i = r ? void 0 : Vi.get(e);
	if (i) {
		let n = Hi.get(e);
		if (n && t.rxNostr === n.rxNostr) {
			let r = new Set($i(n.writeRelays ?? []));
			if ($i(t.writeRelays ?? []).filter((e) => !r.has(e)).length > 0) {
				let n = Ui.get(e) ?? {};
				Ui.set(e, {
					rxNostr: t.rxNostr,
					forceRefresh: !0,
					allowBackgroundRefresh: t.allowBackgroundRefresh,
					writeRelays: Qi([...n.writeRelays ?? [], ...t.writeRelays ?? []]),
					additionalRelays: Qi([...n.additionalRelays ?? [], ...t.additionalRelays ?? []]),
					fallbackRelays: Qi([...n.fallbackRelays ?? [], ...t.fallbackRelays ?? []])
				});
			}
		}
		return i;
	}
	let a = (async () => {
		let r = n;
		if (r === void 0) try {
			r = await Rn.get(e);
		} catch {
			r = null;
		}
		if (t.signal?.aborted) return null;
		let i = await pa(e);
		if (t.signal?.aborted) return null;
		let a = i.profile ?? D(Q)[e]?.profile ?? r, o = Qi([...t.additionalRelays ?? [], ...a?.profileRelays ?? []]);
		return xa(e, t.rxNostr, o, $i(t.fallbackRelays ?? []), $i(t.writeRelays ?? []), a, t.signal);
	})().finally(() => {
		if (Vi.get(e) !== a) return;
		Vi.delete(e), Hi.delete(e);
		let n = Ui.get(e);
		if (Ui.delete(e), ga(), !t.signal?.aborted && n?.rxNostr && (n.writeRelays?.length ?? 0) > 0) {
			let r = Sa(e, {
				...n,
				signal: t.signal
			}), i = qi.get(e);
			i && i.abort.signal === t.signal && (i.followup = r);
		}
	});
	return Hi.set(e, t), Vi.set(e, a), a;
}
async function Ca(e, t, n) {
	if (t.signal?.aborted) return null;
	let r = $(), i = D(Q)[e];
	if (!t.forceRefresh && i && !na(i, r)) {
		if (ia(i, r)) return null;
		if (i.profile && i.persistence === "temporary") return t.allowBackgroundRefresh !== !1 && t.rxNostr && (Yi(e, t, n ? i.profile : void 0), ha(e, "stale", !1)), i.profile;
		if (i.profile && !ra(i, r)) return i.profile;
		if (i.profile) return t.allowBackgroundRefresh !== !1 && t.rxNostr && (Yi(e, t, n ? i.profile : void 0), ha(e, "stale")), i.profile;
	}
	if (!t.forceRefresh && !n) {
		let n = await Rn.get(e);
		if (t.signal?.aborted) return null;
		if (n) {
			let i = aa(n, r);
			ca({
				pubkey: e,
				profile: n,
				metadataRaw: null,
				sourceEventCreatedAtSec: n.updatedAtFromEvent ?? null,
				sourceRelay: null,
				fetchedAtMs: i
			});
			let a = D(Q)[e];
			return a && ra(a, r) && t.allowBackgroundRefresh !== !1 && t.rxNostr && (Yi(e, t, n), ha(e, "stale")), n;
		}
	}
	return t.rxNostr ? await Yi(e, t, n ? D(Q)[e]?.profile ?? null : void 0) : null;
}
async function wa(e, t = {}) {
	return Ca(e, t, !1);
}
async function Ta(e) {
	return e ? Ca(e, { allowBackgroundRefresh: !1 }, !1) : null;
}
async function Ea(e, t = {}) {
	if (t.signal?.aborted) return {};
	let n = Array.from(new Set(e.filter((e) => !!e)));
	if (n.length === 0) return {};
	if (!t.forceRefresh) {
		let e = $(), r = n.filter((t) => {
			let n = D(Q)[t];
			return !n || na(n, e);
		});
		if (r.length > 0) try {
			let n = await Rn.bulkGetRecords(r);
			if (t.signal?.aborted) return {};
			n.forEach((t, n) => {
				if (!t) return;
				let i = An(t);
				ca({
					pubkey: r[n],
					profile: i,
					metadataRaw: null,
					sourceEventCreatedAtSec: i.updatedAtFromEvent ?? null,
					sourceEventId: t.sourceEventId ?? null,
					sourceRelay: null,
					fetchedAtMs: aa(i, e)
				});
			});
		} catch {}
	}
	let r = await Promise.all(n.map(async (e) => {
		let n = t.relayOptionsByPubkey?.[e];
		return [e, await Ca(e, {
			rxNostr: t.rxNostr,
			additionalRelays: Qi([...n?.additionalRelays ?? [], ...t.additionalRelays ?? []]),
			fallbackRelays: Qi([...n?.fallbackRelays ?? [], ...t.fallbackRelays ?? []]),
			writeRelays: Qi([...n?.writeRelays ?? [], ...t.writeRelays ?? []]),
			forceRefresh: t.forceRefresh,
			allowBackgroundRefresh: t.allowBackgroundRefresh
		}, !t.forceRefresh)];
	}));
	return Object.fromEntries(r);
}
async function Da(e) {
	return Ea(e, { allowBackgroundRefresh: !1 });
}
function Oa(e, t) {
	let n = Wi.get(e) ?? /* @__PURE__ */ new Set();
	n.add(t), Wi.set(e, n);
	let r = D(Q)[e];
	return r && t(r.profile), () => {
		let n = Wi.get(e);
		n && (n.delete(t), n.size === 0 && Wi.delete(e));
	};
}
function ka(e) {
	return D(Q)[e] ?? null;
}
function Aa(e, t) {
	let n = Array.from(new Set(e.filter((e) => !!e))).map((e) => Oa(e, (n) => t(e, n)));
	return () => {
		for (let e of n) e();
	};
}
var ja = {
	getProfile: wa,
	getProfiles: Ea,
	getCachedProfile: Ta,
	getCachedProfiles: Da,
	getReactiveEntry: ka,
	subscribe: Oa,
	subscribeProfiles: Aa
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryChildInteractionsAdapter.ts
function Ma(e) {
	return e.sort((e, t) => e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) : e.createdAt - t.createdAt);
}
function Na(e, t, n) {
	let r = Array.from(new Set(t.filter((e) => !!e))), i = new Map(r.map((e) => [e, []]));
	for (let t of e) n(t) && i.get(t.parentEventId)?.push(t);
	return r.flatMap((e) => Ma(i.get(e) ?? []));
}
var Pa = class {
	repository;
	constructor(e = $e) {
		this.repository = e;
	}
	async getReactionRecords(e, t) {
		return (await (t ? this.repository.getChildInteractions(e, t) : this.repository.getChildInteractions(e))).filter((e) => e.kind === 7);
	}
	async getReactionRecordsForParents(e, t) {
		let n = Array.from(new Set(e.filter((e) => !!e)));
		return Na(this.repository.getChildInteractionsForParents ? await (t ? this.repository.getChildInteractionsForParents(n, t) : this.repository.getChildInteractionsForParents(n)) : (await Promise.all(n.map((e) => this.getReactionRecords(e, t?.find((t) => t.eventId === e))))).flat(), n, (e) => e.kind === 7);
	}
}, Fa = class {
	repository;
	constructor(e = $e) {
		this.repository = e;
	}
	async getDirectReplyRecords(e) {
		return this.repository.getDirectReplyInteractions(e);
	}
	async getDirectReplyRecordsForParents(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return Na(this.repository.getChildInteractionsForParents ? await this.repository.getChildInteractionsForParents(t) : (await Promise.all(t.map((e) => this.getDirectReplyRecords(e)))).flat(), t, (e) => e.kind === 1 || e.kind === 42 || e.kind === 1111);
	}
}, Ia = class {
	repository;
	constructor(e = $e) {
		this.repository = e;
	}
	async getRelatedEventRecords(e) {
		return this.repository.getChildInteractions(e);
	}
	async getDirectReplyRecords(e) {
		return this.repository.getDirectReplyInteractions(e);
	}
}, La = new Pa(), Ra = new Fa();
new Ia();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDeletionFetchService.ts
var za = 4e3, Ba = 8;
function Va(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (!n.event?.id || !n.event.pubkey) continue;
		let e = t.get(n.event.pubkey) ?? /* @__PURE__ */ new Set();
		e.add(n.event.id), t.set(n.event.pubkey, e);
	}
	return new Map(Array.from(t.entries()).map(([e, t]) => [e, Array.from(t)]));
}
function Ha(e) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls).sort((e, t) => e.localeCompare(t))
	})).sort((e, t) => e.event.created_at === t.event.created_at ? e.event.id.localeCompare(t.event.id) : e.event.created_at - t.event.created_at);
}
var Ua = new class {
	console;
	setTimeoutFn;
	clearTimeoutFn;
	now;
	constructor(e = {}) {
		this.console = e.console ?? (typeof console < "u" ? console : {
			log: () => void 0,
			warn: () => void 0,
			error: () => void 0
		}), this.setTimeoutFn = e.setTimeoutFn ?? ((e, t) => setTimeout(e, t)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((e) => clearTimeout(e)), this.now = e.now ?? Date.now;
	}
	fetchDeletionRequests(e, t) {
		let n = Va(t.targets), r = this.resolveRelayUrls(t), i = /* @__PURE__ */ new Map(), a = t.requireRelayEose ? `related-deletion-${Date.now()}-${Math.random().toString(36).slice(2)}` : void 0, o, s = !1, c, l, u = () => {
			c?.unsubscribe?.(), c = void 0;
		}, d = (e) => ({
			status: e,
			events: Ha(i),
			fetchedAt: this.now(),
			relayUrls: r
		}), f = (e) => (t) => {
			s || (s = !0, u(), e(d(t)));
		};
		return {
			promise: new Promise((u) => {
				let d = f(u);
				if (l = d, n.size === 0) d("success");
				else try {
					let l = Te(a);
					if (c = Oe(e, l, { on: r.length > 0 ? { relays: r } : { defaultReadRelays: !0 } }, {
						operation: t.operation,
						deadlineAt: t.deadlineAt,
						quorum: !1,
						timeoutMs: t.timeoutMs ?? za,
						source: (t, n) => rt(e, t, n),
						setTimeoutFn: this.setTimeoutFn,
						clearTimeoutFn: this.clearTimeoutFn,
						onEnd: (e) => {
							o = e;
						}
					}).subscribe({
						next: (e) => {
							this.handlePacket(i, e);
						},
						complete: () => d(o?.complete ? "success" : "timeout"),
						error: (e) => {
							this.console.error("post_history_deletion_fetch_error", e), d("error");
						}
					}), s) {
						c?.unsubscribe?.();
						return;
					}
					for (let [e, t] of n.entries()) l.emit({
						kinds: [5],
						authors: [e],
						"#e": t
					});
					if (l.over(), s) return;
				} catch (e) {
					this.console.error("post_history_deletion_fetch_request_error", e), d("error");
				}
			}),
			cancel: () => {
				l?.("cancelled");
			}
		};
	}
	handlePacket(e, t) {
		let n = t.event;
		if (!n?.id || n.kind !== 5) return;
		let r = R.sanitizeExternalRelayUrls(typeof t.from == "string" ? [t.from] : [], { limit: 1 })[0], i = e.get(n.id);
		i ? le(i.event, n) ? r && i.relayUrls.add(r) : this.console.warn("post_history_deletion_fetch_packet_conflict", n.id) : e.set(n.id, {
			event: n,
			relayUrls: new Set(r ? [r] : [])
		});
	}
	resolveRelayUrls(e) {
		let t = e.targets.flatMap((e) => e.relayUrls ?? []), n = lt([...t, ...e.relayHints ?? []], Ba);
		if (n) return n;
		let r = e.relayConfig ? [...R.extractReadRelays(e.relayConfig), ...R.extractWriteRelays(e.relayConfig)] : [], i = R.sanitizeExternalRelayUrls([
			...t,
			...e.relayHints ?? [],
			...r
		], { limit: Ba });
		return i.length > 0 ? i : R.sanitizeExternalRelayUrls(ie, { limit: Ba });
	}
}(), Wa = 1e3, Ga = 7776e6;
function Ka(e) {
	return Number.isSafeInteger(e) && e > 0;
}
function qa(e) {
	return { ...e };
}
function Ja(e) {
	return Array.from(new Set(e.filter(At)));
}
var Ya = new class {
	db;
	now;
	maxRecords;
	ttlMs;
	constructor(e = Y, t = Date.now, n = Wa, r = Ga) {
		this.db = e, this.now = t, this.maxRecords = n, this.ttlMs = r;
	}
	async get(e) {
		if (!At(e)) return null;
		let t = await this.db.customEmojiImageMeta.get(e);
		return t ? qa(t) : null;
	}
	async getMany(e) {
		let t = Ja(e);
		if (t.length === 0) return {};
		let n = await this.db.customEmojiImageMeta.bulkGet(t), r = {};
		return n.forEach((e) => {
			e && (r[e.url] = qa(e));
		}), r;
	}
	async upsert(e) {
		if (!At(e.url) || !Ka(e.width) || !Ka(e.height)) return null;
		let t = this.now(), n = await this.db.customEmojiImageMeta.get(e.url), r = {
			url: e.url,
			width: e.width,
			height: e.height,
			aspectRatio: e.width / e.height,
			fetchedAt: e.fetchedAt ?? n?.fetchedAt ?? t,
			lastAccessedAt: e.lastAccessedAt ?? t,
			updatedAt: t,
			schemaVersion: 1
		};
		return await this.db.transaction("rw", this.db.customEmojiImageMeta, async () => {
			await this.db.customEmojiImageMeta.put(r), await this.pruneInTransaction(t);
		}), qa(r);
	}
	async touchMany(e, t = this.now()) {
		let n = Ja(e);
		n.length !== 0 && await this.db.transaction("rw", this.db.customEmojiImageMeta, async () => {
			let e = await this.db.customEmojiImageMeta.bulkGet(n);
			await Promise.all(e.map(async (e) => {
				e && await this.db.customEmojiImageMeta.put({
					...e,
					lastAccessedAt: t,
					updatedAt: t
				});
			})), await this.pruneInTransaction(t);
		});
	}
	async prune(e = this.now()) {
		await this.db.transaction("rw", this.db.customEmojiImageMeta, async () => {
			await this.pruneInTransaction(e);
		});
	}
	async pruneInTransaction(e) {
		let t = e - this.ttlMs;
		if (this.ttlMs > 0) {
			let e = await this.db.customEmojiImageMeta.where("lastAccessedAt").below(t).primaryKeys();
			e.length > 0 && await this.db.customEmojiImageMeta.bulkDelete(e);
		}
		if (this.maxRecords <= 0) {
			await this.db.customEmojiImageMeta.clear();
			return;
		}
		let n = await this.db.customEmojiImageMeta.orderBy("lastAccessedAt").toArray(), r = n.length - this.maxRecords;
		r <= 0 || await this.db.customEmojiImageMeta.bulkDelete(n.slice(0, r).map((e) => e.url));
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryEmojiState.svelte.ts
function Xa({ getShow: e, getSessionOpen: t = e, getEmojiUrls: n, onStateChanged: r = () => void 0 }) {
	let i = N(E({})), a = N(E({})), o = 0, s = new AbortController(), c = /* @__PURE__ */ new Set();
	function l(e) {
		let t = {};
		for (let n of e) {
			if (c.has(n)) {
				t[n] = "loading";
				continue;
			}
			let e = D(i)[n];
			(e === "ready" || e === "failed") && (t[n] = e);
		}
		let n = e.filter((e) => !t[e]);
		for (let e of n) c.add(e), t[e] = "loading";
		return g(D(i), t) || C(i, t, !0), n;
	}
	function u(e) {
		return {
			url: e.url,
			width: e.width,
			height: e.height,
			aspectRatio: e.aspectRatio
		};
	}
	function d(e) {
		return Number.isSafeInteger(e.width) && Number.isSafeInteger(e.height) && (e.width ?? 0) > 0 && (e.height ?? 0) > 0 && Number.isFinite(e.aspectRatio) && (e.aspectRatio ?? 0) > 0;
	}
	function f(e) {
		let t = !1, n = { ...D(a) };
		for (let [r, i] of Object.entries(e)) {
			let e = n[r];
			(e?.width !== i.width || e?.height !== i.height || e?.aspectRatio !== i.aspectRatio) && (n[r] = i, t = !0);
		}
		t && C(a, n, !0);
	}
	async function p(t) {
		if (t.length === 0) return;
		let n = o;
		try {
			let r = await Ya.getMany(t);
			if (!e() || n !== o) return;
			let i = Object.keys(r);
			if (i.length === 0) return;
			f(Object.fromEntries(i.map((e) => [e, u(r[e])]))), Ya.touchMany(i);
		} catch {}
	}
	async function m(e) {
		try {
			await Ya.upsert(e);
		} catch {}
	}
	async function h(t) {
		let r = o, a = await jt(t, { signal: s.signal });
		if (!e() || r !== o || (c.delete(t), !n().includes(t))) return;
		a.ready && d(a) && (f({ [t]: u({
			url: t,
			width: a.width,
			height: a.height,
			aspectRatio: a.aspectRatio
		}) }), m({
			url: t,
			width: a.width,
			height: a.height
		}));
		let l = a.ready ? "ready" : "failed";
		D(i)[t] !== l && C(i, {
			...D(i),
			[t]: l
		}, !0);
	}
	function g(e, t) {
		let n = Object.keys(e), r = Object.keys(t);
		return n.length === r.length && n.every((n) => e[n] === t[n]);
	}
	function _() {
		o++, s.abort(), s = new AbortController(), c.clear(), C(i, Object.fromEntries(Object.entries(D(i)).filter(([, e]) => e !== "loading")), !0);
	}
	function v() {
		o++, s.abort(), s = new AbortController(), C(i, {}, !0), c.clear();
	}
	return b(() => {
		e() && p(n());
	}), b(() => {
		if (!e()) return;
		let t = l(n());
		for (let e of t) h(e);
	}), b(() => {
		e() && (D(i), D(a), r());
	}), b(() => {
		t() || T(v);
	}), j(() => s.abort()), {
		suspend: _,
		get emojiLoadStateByUrl() {
			return D(i);
		},
		get emojiImageMetaByUrl() {
			return D(a);
		},
		resetState: v
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/sensitiveContentPayloadReader.ts
async function Za(e, t) {
	return (await X(Y, "postHistory").get(e.id))?.deletedAt !== void 0 || (await Y.postHistoryDeletionRequests.where("targetEventId").anyOf([e.id, t]).toArray().then((e) => X(Y, "postHistoryDeletionRequests").hydrate(e))).some((t) => {
		let n = t.rawEvent;
		return Le(n) && n.pubkey === e.pubkey && Fe(n, {
			id: t.targetEventId,
			pubkey: e.pubkey
		});
	});
}
async function Qa(e) {
	let { structure: t } = e;
	if (e.signal?.aborted || !Le(t)) return null;
	let n = Pe(t);
	if (!n) return null;
	let r = (await at.getByIds([n.eventId]))[0];
	if (r?.deletedAt !== void 0 || await Za(t, n.eventId)) return null;
	if (r) {
		let i = r.rawEvent;
		if (He(t, i, n.eventId)) return e.signal?.aborted ? null : i;
	}
	if (!e.rxNostr || e.signal?.aborted) return null;
	let i = await et(Y, t.pubkey), a = {
		ownerPubkeyHex: t.pubkey,
		expectedRevision: i,
		isActive: () => !e.signal?.aborted
	}, o = R.sanitizeExternalRelayUrls([
		...n.relayHint ? [n.relayHint] : [],
		...e.relayHints ?? [],
		...r?.acceptedRelays ?? [],
		...r?.fetchedRelays ?? []
	]), s = ki.fetchEventById(e.rxNostr, {
		eventId: n.eventId,
		relayHints: o,
		relayConfig: e.relayConfig
	}), c = () => s.cancel();
	e.signal?.addEventListener("abort", c, { once: !0 });
	let l = await s.promise.finally(() => e.signal?.removeEventListener("abort", c));
	if (e.signal?.aborted || !l.event || !He(t, l.event, n.eventId)) return null;
	let u = R.sanitizeExternalRelayUrls(l.relayUrl ? [l.relayUrl] : [], { limit: 1 });
	try {
		await at.putCandidate({
			event: l.event,
			fetchedRelays: u,
			relayHints: u,
			localWriteScope: a
		}), cn.archiveAdoptedAuthored([{ event: t }], a);
	} catch {}
	let [d] = await at.getByIds([n.eventId]);
	return e.signal?.aborted || d?.deletedAt !== void 0 || await Za(t, n.eventId) ? null : l.event;
}
async function $a(e) {
	return (await Qa(e))?.content ?? null;
}
function eo(e) {
	if (!e.structure || !Pe(e.structure)) return;
	let t = e.structure, n = Pe(t), r = (t) => $a({
		structure: e.structure,
		relayHints: e.relayHints,
		rxNostr: e.rxNostr,
		relayConfig: e.relayConfig,
		signal: t
	});
	return r.scope = {
		runtime: e.rxNostr,
		ownerPubkey: e.ownerPubkey
	}, r.loadEmoji = jt, r.observe = (e) => {
		let r = Ce(async () => {
			let [e] = await at.getByIds([n.eventId]);
			return e?.deletedAt !== void 0 || await Za(t, n.eventId) ? "deleted" : e ? He(t, e.rawEvent, n.eventId) ? "available" : "invalid" : "missing";
		}).subscribe({
			next: e,
			error: () => e("invalid")
		});
		return () => r.unsubscribe();
	}, r;
}
export { Tn as A, Jt as B, sr as C, Vn as D, Bn as E, Rt as F, Ft as H, zt as I, Ht as L, yn as M, cn as N, Rn as O, sn as P, Bt as R, or as S, Zn as T, Lt as U, It as V, li as _, Ra as a, br as b, ki as c, Si as d, Ei as f, ui as g, bi as h, Ua as i, Sn as j, En as k, Ti as l, Ci as m, Qa as n, La as o, wi as p, Xa as r, ja as s, eo as t, xi as u, Qn as v, $n as w, cr as x, Xn as y, Vt as z };
