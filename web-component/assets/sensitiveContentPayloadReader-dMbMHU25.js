import { B as e, C as t, F as n, G as r, I as i, Mt as a, N as o, O as s, Q as c, R as l, T as u, Tt as d, U as f, W as p, X as m, Y as h, _t as g, a as _, bt as v, dt as y, ft as b, g as x, ht as S, i as C, jt as w, k as T, lt as E, o as D, ot as O, pt as k, q as A, r as j, rt as M, s as ee, st as N, t as P, tt as F, ut as I, v as L, w as R, wt as te } from "./index-client-57Odq85c.js";
import { i as ne, n as re } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { c as ie, i as z, n as B, r as ae } from "./relayConfigUtils-DD5f1UAM.js";
import { a as V, i as oe, l as se, s as H } from "./postHistoryEventUtils-CUIBkIiy.js";
import { n as ce } from "./profilePictureUrlUtils-B7zGYkzO.js";
import { n as le } from "./esm-CrCI9Pgc.js";
import { B as ue, F as de, Q as U, V as fe, X as W, d as G, dt as pe, et as K, j as me, o as he, p as ge, pt as _e, q as ve, s as q, st as J, t as ye, z as be } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { c as Y, g as xe, i as Se } from "./legacyImportMarkers-CZ4J2IrE.js";
import { A as Ce, F as we, H as X, I as Te, J as Ee, K as De, L as Oe, M as ke, P as Ae, Q as je, R as Me, W as Ne, X as Pe, Y as Fe, at as Ie, c as Le, d as Re, dt as ze, f as Be, g as Ve, h as He, it as Ue, j as We, lt as Ge, m as Ke, n as qe, pt as Je, s as Ye, st as Xe, t as Ze, tt as Qe, z as $e } from "./nip65RelayDirectory-TQ_KxYYY.js";
import { c as et, o as tt, s as nt, y as rt } from "./signedEventResultValidator-DEUEqBPK.js";
import { h as it, m as at, p as ot } from "./relayStore.svelte-B2f9GSlJ.js";
import { Tt as st, c as ct, nt as lt, tt as ut, yt as dt } from "./appUtils-CwuZyofa.js";
import { g as ft, h as pt, i as mt, n as ht, p as gt, r as _t } from "./query-BRdCuyDl.js";
import { s as vt } from "./postEventBuilder-BOs8Hhj8.js";
import { d as yt, i as bt } from "./clipboardUtils-LENkGqCk.js";
import { y as xt } from "./useDialogHistory.svelte-BddVYV4P.js";
import { a as St, n as Ct, o as wt, r as Tt, t as Et } from "./safe-polygon.svelte-BCj9ZrLf.js";
import { c as Dt, d as Ot, l as kt, p as At, t as jt } from "./customEmoji-BFRq6RB7.js";
import { t as Mt } from "./graphemeUtils-D37rBdTG.js";
import { n as Nt } from "./channelPictureUrlUtils-qITdrbK6.js";
import { t as Pt } from "./inViewportAction.svelte-DGA5HLKe.js";
import { t as Z } from "./postMediaCacheService-TNvVICyg.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelayResolver.ts
function Ft(e) {
	if (at()) return ot();
	let t = B.sanitizeExternalRelayUrls(e ? [...B.extractWriteRelays(e), ...B.extractReadRelays(e)] : []);
	return t.length ? t : B.sanitizeExternalRelayUrls(z);
}
function It(e) {
	return JSON.stringify([
		at(),
		Ft(e),
		e ?? null
	]);
}
function Lt(e, t) {
	if (at()) return ot();
	let n = e ? [...B.extractReadRelays(e), ...B.extractWriteRelays(e)] : [], r = B.sanitizeExternalRelayUrls(n, { limit: t });
	return r.length > 0 ? r : B.sanitizeExternalRelayUrls(z, { limit: t });
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
		let r = this.now(), i = t.kinds ?? [...Ee], a = Gt(t.reason, t.limit), o = Math.min(t.reason === "repair-visible-range" || n ? Infinity : 6e3, Kt(t.reason, t.timeoutMs)), s = n === void 0 ? Ft(t.relayConfig) : B.sanitizeExternalRelayUrls([n]), c = [
			"dialog-open-refresh",
			"visibility-resume",
			"foreground-periodic"
		].includes(t.reason ?? ""), l = !n && c && !at() ? s.slice(0, 4) : s, u = t.until ?? Math.max(0, Math.floor(r / 1e3)), d = /* @__PURE__ */ new Map(), f = l.map((e) => {
			let t = Wt();
			return {
				relayUrl: e,
				subId: `${t}:0`,
				request: gt(t),
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
		}), p = new Map(f.map((e) => [e.relayUrl, e])), m = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set(), y = [], b = !1, x, S, C = () => {}, w = () => {}, T = !1, E = !1, D = !1, O = () => void 0, k = () => {
			f.forEach((e) => e.subscription?.unsubscribe?.()), y.forEach((e) => e.unsubscribe?.());
		}, A = (e) => {
			let r = qt(d, n !== void 0), i = r.map(({ event: e }) => e.created_at), o = i.length ? Math.min(...i) : null, c = i.length ? Math.max(...i) : null, p = f.map((t) => ({
				relayUrl: t.relayUrl,
				eoseReceived: t.eoseReceived,
				verificationDrained: t.verificationDrained,
				termination: e === "cancelled" ? "cancelled" : t.eoseReceived && t.verificationDrained ? "eose" : t.failed ? "error" : S === "quorum" ? "early-stop" : "timeout",
				rawCount: t.rawCount,
				oldestCreatedAt: t.oldestCreatedAt,
				saturated: t.rawCount >= a
			})), y = Ie({
				since: t.since,
				until: u,
				oldestCreatedAt: o,
				outcomes: p,
				cancelled: e === "cancelled"
			}), b = f.filter((e) => e.eoseReceived).map((e) => e.relayUrl), x = p.filter((e) => e.termination === "eose"), C = s.length > 0 && x.length >= Math.ceil(s.length / 2), w = t.since !== void 0 && Xe(y, s).some((e) => e.since <= t.since && e.until >= u), O = f.filter((e) => e.rawCount || e.eventIds.size).map((e) => ({
				relayUrl: e.relayUrl,
				rawCount: e.rawCount,
				uniqueCount: e.eventIds.size
			})).sort((e, t) => e.relayUrl.localeCompare(t.relayUrl)), k = f.flatMap((e) => e.oldestCreatedAt === null ? [] : [e.oldestCreatedAt]), A = f.reduce((e, t) => e + t.rawCount, 0), j = p.some((e) => e.saturated), M = m.size > 0 || b.length > 0 || g.size > 0, ee = f.length > 0 && !M && f.every((e) => e.failed);
			return {
				status: e,
				completionReason: S,
				events: r,
				fetchedAt: this.now(),
				nextUntil: k.length ? Math.max(...k) : null,
				hasMore: j,
				relayUrls: l,
				observedRelayUrls: O.map((e) => e.relayUrl),
				rawCount: A,
				uniqueCount: r.length,
				duplicateCount: Math.max(0, A - r.length),
				perRelayCounts: O,
				oldestCreatedAt: o,
				newestCreatedAt: c,
				requestedRelayUrls: l,
				eventRelayUrls: Ut(m),
				eoseRelayUrls: b,
				closedRelayUrls: Ut(h),
				errorRelayUrls: Ut(_),
				downRelayUrls: Ut(v),
				completedByRxNostr: T,
				completedByLocalTimeout: E,
				hasAnyRelayResponse: M,
				allRelaysFailed: ee,
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
					bufferLimited: D,
					requestCount: f[0].requestCount,
					eoseReceivedAt: f[0].eoseReceivedAt
				} } : {},
				...t.reason === "repair-visible-range" ? {
					coverageRelayUrls: s,
					coverageEoseRelayUrls: x.map((e) => e.relayUrl),
					bestEffortRelayUrls: [],
					coverageComplete: C && w,
					coverageSaturated: j && !w,
					allCoverageRelaysFailed: ee
				} : {}
			};
		}, j = (e) => {
			let t = B.sanitizeExternalRelayUrls(e ? [e] : [])[0];
			return t ? p.get(t) : void 0;
		};
		return {
			promise: new Promise((r) => {
				O = (e) => {
					b || (b = !0, S ??= e === "success" ? "complete" : e, k(), C(), t.operation || x?.finish(S), r(A(e)));
				};
				let s = (e) => {
					S = e, E = e === "timeout", T = e === "complete", O(e === "cancelled" ? "cancelled" : e === "timeout" ? "timeout" : f.length && f.every((e) => e.failed) ? "error" : "success");
				};
				if (x = t.operation ?? new _t(o, s, {
					now: this.now,
					setTimeoutFn: this.setTimeoutFn,
					clearTimeoutFn: this.clearTimeoutFn
				}), C = x.add(() => s(x.reason ?? "cancelled")), w = mt(x, f, !n && t.reason !== "repair-visible-range", s), !b) {
					if (!f.length) O("error");
					else try {
						let r = (e, t) => {
							e && y.push(e.subscribe({ next: t }));
						};
						r(e.createAllMessageObservable?.(), (e) => {
							let t = j(e.from);
							if (t && !b) {
								if (e.type === "NOTICE") g.add(t.relayUrl);
								else if (e.subId === t.subId) {
									if (e.type === "EVENT") t.finished || (t.rawCount += 1), n && t.rawCount > a * 4 && (D = !0, O("error"));
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
							let t = e.message, n = j(e.to);
							n && Array.isArray(t) && t[0] === "REQ" && t[1] === n.subId && (n.requestCount++, n.authRequired && (n.authAutoResent = !0));
						} })), r(e.createAllErrorObservable?.(), (e) => {
							let t = j(e.from);
							t && !t.finished && (t.failed = !0, _.add(t.relayUrl));
						}), r(e.createConnectionStateObservable?.(), (e) => {
							let t = j(e.from);
							t && !t.finished && [
								"error",
								"rejected",
								"terminated"
							].includes(e.state) && (t.failed = !0, v.add(t.relayUrl));
						});
						for (let r of f) {
							if (r.subscription = Ue(e, r.request, { on: { relays: [r.relayUrl] } }).subscribe({
								next: (o) => {
									if (b) return;
									let s = o.event;
									if (s.pubkey !== t.pubkeyHex || !i.includes(s.kind) || t.since !== void 0 && s.created_at < t.since || t.until !== void 0 && s.created_at > t.until) return;
									m.add(r.relayUrl), r.eventIds.add(s.id), r.oldestCreatedAt = Math.min(r.oldestCreatedAt ?? s.created_at, s.created_at), r.newestCreatedAt = Math.max(r.newestCreatedAt ?? s.created_at, s.created_at), e.createAllMessageObservable || (r.rawCount += 1);
									let c = d.get(s.id);
									if (c) V(c.event, s) && c.relayUrls.add(r.relayUrl);
									else {
										if (n && d.size >= a) {
											D = !0, O("error");
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
						O("error");
					}
				}
			}),
			cancel: () => O("cancelled")
		};
	}
}(), Yt = class {
	createClient;
	constructor(e = pt) {
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
						verifier: rt,
						signer: ft(),
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
			let a = gt(), o = /* @__PURE__ */ new Map();
			return new Promise((s) => {
				let c, l = () => {
					c?.unsubscribe(), i.removeEventListener("abort", l), s([...o.values()]);
				};
				i.addEventListener("abort", l, { once: !0 }), c = ht(n, a, { on: { relays: [e] } }, {
					operation: r,
					quorum: !1,
					timeoutMs: zt,
					source: (e, t) => Ue(n, e, t)
				}).subscribe({
					next: ({ event: e, attestation: n }) => {
						!i.aborted && ie(t, e) && o.size < (t.limit ?? 150) && o.set(e.id, {
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
			let i = new _t(zt, () => void 0);
			i.bind(n);
			try {
				let n = await Promise.all(r.map((n) => vt(t, n, {
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
}, Xt = /^[0-9a-f]{64}$/, Zt = /^(0|[1-9]\d{0,4})$/, Qt = {
	status: "valid",
	ruleVersion: 1
};
function $t(e) {
	return e?.status === "valid" && e.ruleVersion === 1;
}
function en(e, t) {
	return Qe(e, t) ? {
		event: e,
		attestation: t
	} : je(e);
}
function tn(e) {
	if (typeof e != "string" || !Zt.test(e)) return null;
	let t = Number(e);
	return Number.isInteger(t) && t >= 0 && t <= 65535 ? t : null;
}
function nn(e) {
	let t = e.tags.filter((e) => e[0] === "k");
	if (t.length === 0) return !0;
	let n = t.map((e) => tn(e[1]));
	return n.some((e) => e === null) ? !0 : n.some((e) => e !== null && we(e));
}
function rn(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) n?.id && n.pubkey && t.set(n.id, n);
	return t;
}
function an(e, t) {
	let n = e.get(t.targetAuthorPubkey) ?? /* @__PURE__ */ new Set();
	n.add(t.targetEventId), e.set(t.targetAuthorPubkey, n);
}
function on(e, t) {
	return e.targetAuthorPubkey !== t.targetAuthorPubkey || e.targetEventId !== t.targetEventId || e.schemaVersion !== t.schemaVersion || e.deletionEventId !== t.deletionEventId || e.deletionEventPubkey !== t.deletionEventPubkey || Ae(e) !== Ae(t) || e.deletedAt !== t.deletedAt || e.reason !== t.reason || !V(e.rawEvent, t.rawEvent) || e.rawEventVerification?.status !== t.rawEventVerification?.status || e.rawEventVerification?.ruleVersion !== t.rawEventVerification?.ruleVersion || !Ke(e.relayUrls, t.relayUrls);
}
function sn(e, t, n) {
	let r = $t(e.rawEventVerification) && !V(e.rawEvent, t.rawEvent);
	return {
		...t,
		...r ? {
			rawEvent: e.rawEvent,
			rawEventVerification: e.rawEventVerification
		} : {},
		targetVerified: Ae(e) || Ae(t),
		relayUrls: B.sanitizeExternalRelayUrls([...e.relayUrls, ...t.relayUrls]),
		fetchedAt: Math.max(e.fetchedAt, t.fetchedAt),
		updatedAt: n(),
		schemaVersion: 2
	};
}
var cn = new class {
	db;
	now;
	constructor(e = Y, t = Date.now) {
		this.db = e, this.now = t;
	}
	async getDeletedTargets(e) {
		let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
		for (let t of e) t.targetAuthorPubkey && t.targetEventId && n.set(`${t.targetAuthorPubkey}:${t.targetEventId}`, t);
		for (let e of n.values()) {
			let n = await this.db.postHistoryDeletionRequests.where("[targetAuthorPubkey+targetEventId]").equals([e.targetAuthorPubkey, e.targetEventId]).toArray();
			for (let e of n) Ae(e) && an(t, e);
		}
		return t;
	}
	async getAllForTargetAuthorPubkey(e) {
		return e ? this.db.postHistoryDeletionRequests.where("targetAuthorPubkey").equals(e).toArray() : [];
	}
	async saveLocalDeletion(e) {
		let t = en(e.deletionEvent, e.attestation);
		if (!t) throw Error("invalid_local_deletion_event");
		let n = t.event, r = Array.from(/* @__PURE__ */ new Set([...e.targetEventId ? [e.targetEventId] : [], ...e.targetEventIds ?? []]));
		if (r.length === 0 || n.kind !== 5 || !Xt.test(n.id)) throw Error("invalid_local_deletion_event");
		let i = e.fetchedAt ?? this.now(), a = null;
		await this.db.transaction("rw", this.db.postHistoryDeletionRequests, this.db.postHistory, this.db.sensitivePayloads, async () => {
			let t = e.targetEvent ? je(e.targetEvent)?.event : null, o = await this.db.postHistory.get(r[0]), s = o ?? (t && t.id === r[0] ? {
				eventId: t.id,
				pubkeyHex: t.pubkey,
				kind: t.kind,
				rawEvent: t
			} : void 0);
			if (!s || !we(s.kind) || !Te(n, {
				id: s.eventId,
				pubkey: s.pubkeyHex
			})) throw Error("local_deletion_target_not_found");
			let c = s.rawEvent, l = (De(c) ? X(c) : null)?.eventId;
			for (let t of r) {
				let r = !1;
				if (t === s.eventId) r = Te(n, {
					id: s.eventId,
					pubkey: s.pubkeyHex
				});
				else if (t === l) {
					let e = await this.db.sensitivePayloads.get(t);
					r = !!e && e.deletedAt === void 0 && e.pubkeyHex === s.pubkeyHex && Ne(c, e.rawEvent, t) && Te(n, {
						id: t,
						pubkey: s.pubkeyHex
					});
				}
				if (!r) continue;
				let a = Me({
					deletionEvent: n,
					targetEventId: t,
					targetVerified: !0,
					relayUrls: e.relayUrls,
					fetchedAt: i
				}, this.now);
				a.rawEventVerification = { ...Qt };
				let o = await this.db.postHistoryDeletionRequests.get(a.id), u = o ? sn(o, a, this.now) : a;
				if (await this.db.postHistoryDeletionRequests.put(u), t === l) {
					let r = await this.db.sensitivePayloads.get(t);
					r && await this.db.sensitivePayloads.put({
						...r,
						deletedAt: e.deletedAt,
						deletionEventId: n.id,
						updatedAt: this.now()
					});
				}
			}
			o && (o.deletedAt !== e.deletedAt || o.deletionEventId !== n.id) && (await this.db.postHistory.put({
				...o,
				deletedAt: e.deletedAt,
				deletionEventId: n.id,
				updatedAt: this.now()
			}), a = s.pubkeyHex);
		}), a && Ve(a);
	}
	async upsertValidDeletionRequests(e) {
		if (e.targetEvents.length === 0 || e.deletionEvents.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: e.deletionEvents.length
		};
		let t = e.deletionEvents.flatMap((e) => {
			let t = en(e.event, e.attestation);
			return t ? [{
				...e,
				event: t.event,
				attestation: t.attestation
			}] : [];
		}), n = rn(e.targetEvents), r = e.fetchedAt ?? this.now(), i = /* @__PURE__ */ new Map(), a = e.deletionEvents.length - t.length;
		for (let e of t) {
			let t = e.event.tags.filter((e) => e[0] === "e" && typeof e[1] == "string").map((e) => e[1]), o = !1;
			for (let a of t) {
				let t = n.get(a);
				if (!t) continue;
				let s = i.get(We(t.pubkey, t.id, e.event.id)), c = Oe({
					deletionEvent: e.event,
					targetEvent: t,
					relayUrls: B.sanitizeExternalRelayUrls([...s?.relayUrls ?? [], ...e.relayUrls ?? []]),
					fetchedAt: r
				}, this.now);
				c && (c.rawEventVerification = { ...Qt }, i.set(c.id, c), o = !0);
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
		return await this.db.transaction("rw", this.db.postHistoryDeletionRequests, async () => {
			let e = await this.db.postHistoryDeletionRequests.bulkGet(o.map((e) => e.id)), t = /* @__PURE__ */ new Map();
			e.forEach((e) => {
				e && t.set(e.id, e);
			});
			let n = o.map((e) => {
				let n = t.get(e.id);
				if (!n) return s += 1, e;
				let r = sn(n, e, this.now);
				return on(n, r) ? c += 1 : l += 1, r;
			});
			await this.db.postHistoryDeletionRequests.bulkPut(n);
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
			let o = en(a.event, a.attestation);
			if (!o) {
				i += 1;
				continue;
			}
			let s = o.event;
			if (s.kind !== 5 || s.pubkey !== e.ownerPubkeyHex || !Xt.test(s.id)) {
				i += 1;
				continue;
			}
			let c = s.tags.filter((e) => e[0] === "e" && typeof e[1] == "string" && Xt.test(e[1])).map((e) => e[1]), l = Array.from(new Set(c));
			if (l.length === 0) {
				i += 1;
				continue;
			}
			let u = nn(s);
			r.add(s.id);
			for (let e of l) {
				let r = Me({
					deletionEvent: s,
					targetEventId: e,
					targetVerified: !1,
					relayUrls: [],
					fetchedAt: t
				}, this.now);
				r.rawEventVerification = { ...Qt }, n.set(r.id, {
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
			this.db.postHistoryDeletionRequests,
			this.db.postHistory,
			...e.localWriteScope ? [this.db.postHistoryWriteGeneration] : []
		], async () => {
			await ze(this.db, e.localWriteScope);
			let t = await this.db.postHistoryDeletionRequests.bulkGet(a.map((e) => e.record.id)), n = Array.from(new Set(a.map((e) => e.record.targetEventId))), p = await this.db.postHistory.bulkGet(n), m = new Map(p.filter((e) => !!e).map((e) => [e.eventId, e])), h = [], g = /* @__PURE__ */ new Set();
			a.forEach((e, n) => {
				let { record: r } = e, i = m.get(r.targetEventId);
				if (i && !we(i.kind) || !i && !e.shouldStoreWithoutTarget) return;
				i && i.deletedAt !== void 0 && i.rawEventVerification?.status === "valid" && i.rawEventVerification.ruleVersion === 1 && oe(i.rawEvent, i) && !X(i.rawEvent) && f.add(r.targetEventId);
				let a = !!i && we(i.kind) && i.pubkeyHex === r.targetAuthorPubkey && i.pubkeyHex === r.deletionEventPubkey, l = {
					...r,
					targetVerified: a
				};
				u.add(r.targetEventId), g.add(r.deletionEventId);
				let p = t[n];
				if (!p) {
					o += 1, d.add(r.targetEventId), h.push(l);
					return;
				}
				let _ = sn(p, l, this.now);
				on(p, _) ? (s += 1, d.add(r.targetEventId), h.push(_)) : c += 1;
			});
			for (let e of r) g.has(e) || (i += 1);
			h.length > 0 && await this.db.postHistoryDeletionRequests.bulkPut(h);
			for (let e of n) {
				let t = m.get(e);
				if (!t || !we(t.kind) || t.deletedAt !== void 0) continue;
				let n = (await this.db.postHistoryDeletionRequests.where("targetEventId").equals(e).toArray()).filter((e) => Ae(e) && e.targetAuthorPubkey === t.pubkeyHex && e.deletionEventPubkey === t.pubkeyHex).sort(ke)[0];
				if (!n) continue;
				let r = $e(n);
				await this.db.postHistory.update(e, {
					...r,
					updatedAt: this.now()
				}), l += 1;
			}
			await ze(this.db, e.localWriteScope);
		});
		let p = Array.from(new Set(a.map((e) => e.record.targetEventId)));
		for (let e of p) u.has(e) && !d.has(e) && f.has(e) || (await Re(e, this.db, this.now), await Be(e, this.db, this.now));
		return {
			insertedCount: o,
			updatedCount: s,
			unchangedCount: c,
			ignoredCount: i,
			appliedDeletionCount: l
		};
	}
}(), ln = new class {
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
		this.transport = e.transport, this.repository = e.repository ?? Le, this.payloads = e.payloads ?? Ye, this.deletions = e.deletions ?? cn, this.getLocalRevision = e.getLocalRevision ?? ((e) => Je(Y, e)), this.runtimeKind = e.runtimeKind ?? (() => re().runtimeKind);
	}
	getTransport() {
		return this.transport ??= new Yt();
	}
	configureSession(e) {
		this.cancelSession();
		let t = e.url && st(e.url);
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
		let r = [...new Map(t.filter(({ event: t, attestation: n }) => t.pubkey === e.ownerPubkeyHex && (Pe(t.kind) || t.kind === 5 || t.kind === 36) && Qe(t, n) && !this.stores.has(`${e.url}:${t.id}`)).map((e) => [e.event.id, e])).values()];
		if (!r.length) return;
		let i = r.map(({ event: t }) => `${e.url}:${t.id}`), a = Promise.resolve().then(async () => {
			if (!this.isCurrent(e) || !n()) return;
			let t = r.filter(({ event: e, attestation: t }) => Qe(e, t)).map(({ event: e }) => e);
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
		let a = new _t(zt, () => n.abort());
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
						kindsKey: Fe,
						localRelayUrl: t.url,
						browsingRanges: c.browsingRanges,
						...e.reason !== "repair-visible-range" && l != null ? {
							resumeHint: { nextUntil: l },
							initializeResumeHintOnly: e.reason !== "older-backfill"
						} : {}
					}
				});
				if (u.applied === !1 || !o()) return null;
				let d = u.insertedCount + u.updatedCount + u.appliedDeletionCount > 0, f = [...new Map([...c.events.map(({ event: e }) => e), ...e.targets ?? []].filter((e) => e.pubkey === t.ownerPubkeyHex && Pe(e.kind)).map((e) => [e.id, e])).values()], p = f.flatMap((e) => {
					let t = X(e);
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
						f.some((e) => Ne(e, t.event)) && (await this.payloads.putCandidate({
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
				if (a.has(n.event.id) || n.event.pubkey !== t.ownerPubkeyHex || !Pe(n.event.kind)) continue;
				let e = await this.repository.getByEventId(n.event.id);
				if (!i() || await this.getLocalRevision(t.ownerPubkeyHex) !== r) return;
				if (!e || e.pubkeyHex !== t.ownerPubkeyHex || !V(e.rawEvent, n.event)) continue;
				let c = Qe(n.event, n.attestation) ? {
					event: n.event,
					attestation: n.attestation
				} : je(e.rawEvent);
				if (!c) continue;
				a.set(c.event.id, c.event), e.deletedAt === void 0 && o.set(c.event.id, c);
				let l = X(c.event);
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
				let t = s.get(e.id)?.filter(({ event: t }) => Ne(t, e.rawEvent)) ?? [], n = t.length ? je(e.rawEvent) : null;
				n && (a.set(n.event.id, n.event), e.deletedAt === void 0 && t.some(({ deleted: e }) => !e) && o.set(n.event.id, n));
			}
			let l = await this.deletions.getAllForTargetAuthorPubkey(t.ownerPubkeyHex);
			if (i() && await this.getLocalRevision(t.ownerPubkeyHex) === r) {
				for (let e of l) {
					if (![...a.values()].some((t) => Te(e.rawEvent, t))) continue;
					let t = je(e.rawEvent);
					t && o.set(t.event.id, t);
				}
				this.storeBatch(n, [...o.values()], i);
			}
		})().catch(() => void 0);
	}
}();
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/on-mount-effect.svelte.js
function un(e) {
	N(() => M(() => e()));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/timeout-fn.js
var dn = class {
	#e;
	#t;
	#n = null;
	constructor(e, t) {
		this.#t = e, this.#e = t, this.stop = this.stop.bind(this), this.start = this.start.bind(this), ve(this.stop);
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
}, fn = de({
	component: "tooltip",
	parts: ["content", "trigger"]
}), pn = new U("Tooltip.Provider"), mn = new U("Tooltip.Root"), hn = class {
	#e = g(k(/* @__PURE__ */ new Map()));
	get triggers() {
		return F(this.#e);
	}
	set triggers(e) {
		S(this.#e, e, !0);
	}
	#t = g(null);
	get activeTriggerId() {
		return F(this.#t);
	}
	set activeTriggerId(e) {
		S(this.#t, e, !0);
	}
	#n = v(() => {
		let e = this.activeTriggerId;
		return e === null ? null : this.triggers.get(e)?.node ?? null;
	});
	get activeTriggerNode() {
		return F(this.#n);
	}
	set activeTriggerNode(e) {
		S(this.#n, e);
	}
	#r = v(() => {
		let e = this.activeTriggerId;
		return e === null ? null : this.triggers.get(e)?.payload ?? null;
	});
	get activePayload() {
		return F(this.#r);
	}
	set activePayload(e) {
		S(this.#r, e);
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
}, gn = class e {
	static create(t) {
		return pn.set(new e(t));
	}
	opts;
	#e = g(!0);
	get isOpenDelayed() {
		return F(this.#e);
	}
	set isOpenDelayed(e) {
		S(this.#e, e, !0);
	}
	isPointerInTransit = pe(!1);
	#t;
	#n = g(null);
	constructor(e) {
		this.opts = e, this.#t = new dn(() => {
			this.isOpenDelayed = !0;
		}, this.opts.skipDelayDuration.current), un(() => c(window, "scroll", (e) => {
			let t = F(this.#n);
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
		F(this.#n) && F(this.#n) !== e && F(this.#n).handleClose(), this.#i(), this.isOpenDelayed = !1, S(this.#n, e, !0);
	};
	onClose = (e) => {
		F(this.#n) === e && (S(this.#n, null), this.#r());
	};
	isTooltipOpen = (e) => F(this.#n) === e;
}, _n = class e {
	static create(t) {
		return mn.set(new e(t, pn.get()));
	}
	opts;
	provider;
	#e = v(() => this.opts.delayDuration.current ?? this.provider.opts.delayDuration.current);
	get delayDuration() {
		return F(this.#e);
	}
	set delayDuration(e) {
		S(this.#e, e);
	}
	#t = v(() => this.opts.disableHoverableContent.current ?? this.provider.opts.disableHoverableContent.current);
	get disableHoverableContent() {
		return F(this.#t);
	}
	set disableHoverableContent(e) {
		S(this.#t, e);
	}
	#n = v(() => this.opts.disableCloseOnTriggerClick.current ?? this.provider.opts.disableCloseOnTriggerClick.current);
	get disableCloseOnTriggerClick() {
		return F(this.#n);
	}
	set disableCloseOnTriggerClick(e) {
		S(this.#n, e);
	}
	#r = v(() => this.opts.disabled.current ?? this.provider.opts.disabled.current);
	get disabled() {
		return F(this.#r);
	}
	set disabled(e) {
		S(this.#r, e);
	}
	#i = v(() => this.opts.ignoreNonKeyboardFocus.current ?? this.provider.opts.ignoreNonKeyboardFocus.current);
	get ignoreNonKeyboardFocus() {
		return F(this.#i);
	}
	set ignoreNonKeyboardFocus(e) {
		S(this.#i, e);
	}
	registry;
	tether;
	#a = g(null);
	get contentNode() {
		return F(this.#a);
	}
	set contentNode(e) {
		S(this.#a, e, !0);
	}
	contentPresence;
	#o = g(!1);
	#s;
	#c = v(() => this.opts.open.current ? F(this.#o) ? "delayed-open" : "instant-open" : "closed");
	get stateAttr() {
		return F(this.#c);
	}
	set stateAttr(e) {
		S(this.#c, e);
	}
	constructor(e, t) {
		this.opts = e, this.provider = t, this.tether = e.tether.current?.state ?? null, this.registry = this.tether?.registry ?? new hn(), this.#s = new dn(() => {
			S(this.#o, !0), this.opts.open.current = !0;
		}, this.delayDuration ?? 0), this.tether && (this.tether.root = this, un(() => () => {
			this.tether?.root === this && (this.tether.root = null);
		})), this.contentPresence = new xt({
			open: this.opts.open,
			ref: J(() => this.contentNode),
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), W(() => this.delayDuration, () => {
			this.delayDuration !== void 0 && (this.#s = new dn(() => {
				S(this.#o, !0), this.opts.open.current = !0;
			}, this.delayDuration));
		}), W(() => this.opts.open.current, (e) => {
			e ? (this.ensureActiveTrigger(), this.provider.onOpen(this)) : this.provider.onClose(this);
		}, { lazy: !0 }), W(() => this.opts.triggerId.current, (e) => {
			e !== this.registry.activeTriggerId && this.registry.setActiveTrigger(e);
		}), W(() => this.registry.activeTriggerId, (e) => {
			this.opts.triggerId.current !== e && (this.opts.triggerId.current = e);
		});
	}
	handleOpen = () => {
		this.#s.stop(), S(this.#o, !1), this.ensureActiveTrigger(), this.opts.open.current = !0;
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
		e || t === 0 ? (S(this.#o, !1), this.opts.open.current = !0) : this.#s.start();
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
}, vn = class e {
	static create(t) {
		return t.tether.current ? new e(t, null, t.tether.current.state) : new e(t, mn.get(), null);
	}
	opts;
	root;
	tether;
	attachment;
	#e = pe(!1);
	#t = g(!1);
	domContext;
	#n = null;
	#r = !1;
	#i = null;
	constructor(e, t, n) {
		this.opts = e, this.root = t, this.tether = n, this.domContext = new fe(e.ref), this.attachment = ue(this.opts.ref, (e) => this.#s(e)), W(() => this.opts.id.current, () => {
			this.#s(this.opts.ref.current);
		}), W(() => this.opts.payload.current, () => {
			this.#s(this.opts.ref.current);
		}), W(() => this.opts.disabled.current, () => {
			this.#s(this.opts.ref.current);
		}), un(() => (this.#r = !0, this.#s(this.opts.ref.current), () => {
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
			t.provider.isPointerInTransit.current && (t.provider.isPointerInTransit.current = !1, t.onTriggerEnter(this.opts.id.current), S(this.#t, !0));
		}, 250)) : (t.onTriggerEnter(this.opts.id.current), S(this.#t, !0))));
	};
	#f = (e) => {
		let t = this.#a();
		t && (this.#o() ? t.opts.open.current && t.handleClose() : e.pointerType !== "touch" && (F(this.#t) || (this.#c(), t.provider.isPointerInTransit.current = !1, t.onTriggerEnter(this.opts.id.current), S(this.#t, !0))));
	};
	#p = (e) => {
		let t = this.#a();
		if (!t || this.#o()) return;
		if (this.#c(), !t.isActiveTrigger(this.opts.id.current)) {
			S(this.#t, !1);
			return;
		}
		let n = e.relatedTarget;
		if (G(n)) {
			for (let e of t.registry.triggers.values()) if (e.node === n) {
				if (t.provider.opts.skipDelayDuration.current > 0) {
					S(this.#t, !1);
					return;
				}
				t.handleClose(), S(this.#t, !1);
				return;
			}
		}
		t.onTriggerLeave(), S(this.#t, !1);
	};
	#m = (e) => {
		let t = this.#a();
		t && (this.#e.current || (this.#o() ? t.opts.open.current && t.handleClose() : (!t.ignoreNonKeyboardFocus || ge(e.currentTarget)) && (t.setActiveTrigger(this.opts.id.current), t.handleOpen())));
	};
	#h = () => {
		let e = this.#a();
		e && !this.#o() && e.handleClose();
	};
	#g = () => {
		let e = this.#a();
		!e || e.disableCloseOnTriggerClick || this.#o() || e.handleClose();
	};
	#_ = v(() => {
		let e = this.#a(), t = !!(e?.opts.open.current && e.isActiveTrigger(this.opts.id.current)), n = this.#o();
		return {
			id: this.opts.id.current,
			"aria-describedby": t ? e?.contentNode?.id : void 0,
			"data-state": t ? e?.stateAttr : "closed",
			"data-disabled": me(n),
			"data-delay-duration": `${e?.delayDuration ?? 0}`,
			[fn.trigger]: "",
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
		return F(this.#_);
	}
	set props(e) {
		S(this.#_, e);
	}
}, yn = class e {
	static create(t) {
		return new e(t, mn.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ue(this.opts.ref, (e) => this.root.contentNode = e), new Et({
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
		G(e.target) && this.root.triggerNode?.contains(e.target) && this.root.disableCloseOnTriggerClick ? e.preventDefault() : (this.opts.onInteractOutside.current(e), !e.defaultPrevented && this.root.handleClose());
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
	#e = v(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return F(this.#e);
	}
	set snippetProps(e) {
		S(this.#e, e);
	}
	#t = v(() => ({
		id: this.opts.id.current,
		"data-state": this.root.stateAttr,
		"data-disabled": me(this.root.disabled),
		...be(this.root.contentPresence.transitionStatus),
		style: { outline: "none" },
		[fn.content]: "",
		...this.attachment
	}));
	get props() {
		return F(this.#t);
	}
	set props(e) {
		S(this.#t, e);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus
	};
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip.svelte
function bn(e, t) {
	d(t, !0);
	let n = j(t, "open", 15, !1), r = j(t, "triggerId", 15, null), i = j(t, "onOpenChange", 3, q), s = j(t, "onOpenChangeComplete", 3, q), c = _n.create({
		open: J(() => n(), (e) => {
			n(e), i()(e);
		}),
		triggerId: J(() => r(), (e) => {
			r(e);
		}),
		delayDuration: J(() => t.delayDuration),
		disableCloseOnTriggerClick: J(() => t.disableCloseOnTriggerClick),
		disableHoverableContent: J(() => t.disableHoverableContent),
		ignoreNonKeyboardFocus: J(() => t.ignoreNonKeyboardFocus),
		disabled: J(() => t.disabled),
		onOpenChangeComplete: J(() => s()),
		tether: J(() => t.tether)
	});
	wt(e, {
		tooltip: !0,
		children: (e, n) => {
			var r = p(), i = I(r);
			o(i, () => t.children ?? a, () => ({
				open: c.opts.open.current,
				triggerId: c.activeTriggerId,
				payload: c.activePayload
			})), f(e, r);
		},
		$$slots: { default: !0 }
	}), te();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-content.svelte
var xn = /* @__PURE__ */ new Set([
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
]), Sn = r("<div><div><!></div></div>");
function Cn(e, t) {
	let n = A();
	d(t, !0);
	let r = j(t, "id", 19, () => he(n)), i = j(t, "ref", 15, null), s = j(t, "side", 3, "top"), c = j(t, "sideOffset", 3, 0), u = j(t, "align", 3, "center"), m = j(t, "avoidCollisions", 3, !0), h = j(t, "arrowPadding", 3, 0), g = j(t, "sticky", 3, "partial"), y = j(t, "hideWhenDetached", 3, !1), b = j(t, "collisionPadding", 3, 0), S = j(t, "onInteractOutside", 3, q), T = j(t, "onEscapeKeydown", 3, q), D = j(t, "forceMount", 3, !1), O = C(t, xn), k = yn.create({
		id: J(() => r()),
		ref: J(() => i(), (e) => i(e)),
		onInteractOutside: J(() => S()),
		onEscapeKeydown: J(() => T())
	}), M = v(() => ({
		side: s(),
		sideOffset: c(),
		align: u(),
		avoidCollisions: m(),
		arrowPadding: h(),
		sticky: g(),
		hideWhenDetached: y(),
		collisionPadding: b(),
		strategy: t.strategy,
		customAnchor: t.customAnchor ?? k.root.triggerNode
	})), ee = v(() => K(O, F(M), k.props));
	var N = p(), P = I(N), L = (e) => {
		{
			let n = (e, n) => {
				let r = () => (n?.()).props, i = () => (n?.()).wrapperProps, s = v(() => K(i(), { style: { pointerEvents: k.root.disableHoverableContent ? "none" : void 0 } })), c = v(() => K(r(), { style: St("tooltip") }, { style: t.style }));
				var u = p(), d = I(u), m = (e) => {
					var n = p(), r = I(n);
					{
						let e = v(() => ({
							props: F(c),
							wrapperProps: F(s),
							...k.snippetProps
						}));
						o(r, () => t.child, () => F(e));
					}
					f(e, n);
				}, h = (e) => {
					var n = Sn();
					x(n, () => ({ ...F(s) }));
					var r = E(n);
					x(r, () => ({ ...F(c) }));
					var i = E(r);
					o(i, () => t.children ?? a), w(r), w(n), f(e, n);
				};
				l(d, (e) => {
					t.child ? e(m) : e(h, -1);
				}), f(e, u);
			}, i = v(() => k.root.disableHoverableContent ? "none" : "auto");
			Ct(e, _(() => F(ee), () => k.popperProps, {
				get enabled() {
					return k.root.opts.open.current;
				},
				get id() {
					return r();
				},
				trapFocus: !1,
				loop: !1,
				preventScroll: !1,
				forceMount: !0,
				get ref() {
					return k.opts.ref;
				},
				tooltip: !0,
				get shouldRender() {
					return k.shouldRender;
				},
				get contentPointerEvents() {
					return F(i);
				},
				popper: n,
				$$slots: { popper: !0 }
			}));
		}
	}, R = (e) => {
		{
			let n = (e, n) => {
				let r = () => (n?.()).props, i = () => (n?.()).wrapperProps, s = v(() => K(i(), { style: { pointerEvents: k.root.disableHoverableContent ? "none" : void 0 } })), c = v(() => K(r(), { style: St("tooltip") }, { style: t.style }));
				var u = p(), d = I(u), m = (e) => {
					var n = p(), r = I(n);
					{
						let e = v(() => ({
							props: F(c),
							wrapperProps: F(s),
							...k.snippetProps
						}));
						o(r, () => t.child, () => F(e));
					}
					f(e, n);
				}, h = (e) => {
					var n = Sn();
					x(n, () => ({ ...F(s) }));
					var r = E(n);
					x(r, () => ({ ...F(c) }));
					var i = E(r);
					o(i, () => t.children ?? a), w(r), w(n), f(e, n);
				};
				l(d, (e) => {
					t.child ? e(m) : e(h, -1);
				}), f(e, u);
			}, i = v(() => k.root.disableHoverableContent ? "none" : "auto");
			Tt(e, _(() => F(ee), () => k.popperProps, {
				get open() {
					return k.root.opts.open.current;
				},
				get id() {
					return r();
				},
				trapFocus: !1,
				loop: !1,
				preventScroll: !1,
				forceMount: !1,
				get ref() {
					return k.opts.ref;
				},
				tooltip: !0,
				get shouldRender() {
					return k.shouldRender;
				},
				get contentPointerEvents() {
					return F(i);
				},
				popper: n,
				$$slots: { popper: !0 }
			}));
		}
	};
	l(P, (e) => {
		D() ? e(L) : D() || e(R, 1);
	}), f(e, N), te();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-trigger.svelte
var wn = /* @__PURE__ */ new Set([
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
]), Tn = r("<button><!></button>");
function En(e, t) {
	let n = A();
	d(t, !0);
	let r = j(t, "id", 19, () => he(n)), i = j(t, "disabled", 3, !1), s = j(t, "type", 3, "button"), c = j(t, "tabindex", 3, 0), u = j(t, "ref", 15, null), m = C(t, wn), h = vn.create({
		id: J(() => r()),
		disabled: J(() => i() ?? !1),
		tabindex: J(() => c() ?? 0),
		payload: J(() => t.payload),
		tether: J(() => t.tether),
		ref: J(() => u(), (e) => u(e))
	}), g = v(() => K(m, h.props, { type: s() }));
	var _ = p(), y = I(_), b = (e) => {
		var n = p(), r = I(n);
		o(r, () => t.child, () => ({ props: F(g) })), f(e, n);
	}, S = (e) => {
		var n = Tn();
		x(n, () => ({ ...F(g) }));
		var r = E(n);
		o(r, () => t.children ?? a), w(n), f(e, n);
	};
	l(y, (e) => {
		t.child ? e(b) : e(S, -1);
	}), f(e, _), te();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-provider.svelte
function Dn(e, t) {
	d(t, !0);
	let n = j(t, "delayDuration", 3, 700), r = j(t, "disableCloseOnTriggerClick", 3, !1), i = j(t, "disableHoverableContent", 3, !1), s = j(t, "disabled", 3, !1), c = j(t, "ignoreNonKeyboardFocus", 3, !1), l = j(t, "skipDelayDuration", 3, 300);
	gn.create({
		delayDuration: J(() => n()),
		disableCloseOnTriggerClick: J(() => r()),
		disableHoverableContent: J(() => i()),
		disabled: J(() => s()),
		ignoreNonKeyboardFocus: J(() => c()),
		skipDelayDuration: J(() => l())
	});
	var u = p(), m = I(u);
	o(m, () => t.children ?? a), f(e, u), te();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileEventComparison.ts
var On = /^[0-9a-f]{64}$/;
function kn(e) {
	return On.test(e.sourceEventId) && Number.isSafeInteger(e.updatedAtFromEvent) && e.updatedAtFromEvent >= 0;
}
function An(e, t) {
	return t.sourceEventId === e.sourceEventId ? "same-event" : t.updatedAtFromEvent > e.updatedAtFromEvent ? "candidate-newer" : t.updatedAtFromEvent < e.updatedAtFromEvent ? "candidate-older" : t.sourceEventId < e.sourceEventId ? "candidate-wins-tie-break" : "candidate-loses-tie-break";
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/profilesRepository.ts
var jn = 2;
function Mn(e) {
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
function Nn(e, t, n) {
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
		schemaVersion: jn
	};
}
function Pn(...e) {
	let t = B.sanitizeExternalRelayUrls(e.flatMap((e) => e ?? []));
	return t.length > 0 ? t : void 0;
}
function Fn(e) {
	return e.sourceEventId !== void 0 && e.updatedAtFromEvent !== void 0 && kn({
		sourceEventId: e.sourceEventId,
		updatedAtFromEvent: e.updatedAtFromEvent
	});
}
function In(e, t) {
	return e.length > 0 && t.pubkeyHex === e && kn(t) && Number.isFinite(t.fetchedAt) && t.fetchedAt >= 0;
}
function Ln(e, t, n) {
	let r = Pn(t.profile.profileRelays, t.observedRelays);
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
		schemaVersion: jn
	};
}
function Rn(e, t) {
	return {
		decision: e,
		acceptedRecord: t,
		acceptedProfile: t ? Mn(t) : null,
		currentEventConfirmed: e === "inserted" || e === "replaced" || e === "kept-existing" || e === "merged-same-event"
	};
}
function zn(e, t) {
	let n = t.getItem(dt.NOSTR_PROFILE + e);
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
var Bn = new class {
	db;
	now;
	getStorage;
	constructor(e = Y, t = Date.now, n = () => ne()) {
		this.db = e, this.now = t, this.getStorage = n;
	}
	async get(e) {
		if (!e) return null;
		let t = Se(e);
		try {
			let n = await this.db.profiles.get(e);
			if (n) return await this.markLegacyProfileImported(t), Mn(n);
		} catch {
			return zn(e, this.getStorage());
		}
		if ((await this.db.legacyImportState.get(t))?.done === !0) return null;
		let n = this.getStorage();
		if (n.getItem(dt.NOSTR_PROFILE + e) === null) return await this.markLegacyProfileImported(t), null;
		let r = zn(e, n);
		if (!r) return null;
		try {
			await this.db.transaction("rw", this.db.profiles, this.db.legacyImportState, async () => {
				(await this.db.legacyImportState.get(t))?.done !== !0 && (await this.db.profiles.get(e) || await this.db.profiles.put(Nn(e, r, this.now)), await this.db.legacyImportState.put({
					id: t,
					done: !0,
					updatedAt: this.now()
				}));
			});
			try {
				n.removeItem(dt.NOSTR_PROFILE + e);
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
		e && await this.db.profiles.put(Nn(e, t, this.now));
	}
	async upsertCandidate(e, t) {
		return this.db.transaction("rw", this.db.profiles, async () => {
			let n = await this.db.profiles.get(e) ?? null;
			if (!In(e, t)) return Rn("rejected-invalid", n);
			if (!n || !Fn(n)) {
				let r = Ln(e, t, this.now());
				return await this.db.profiles.put(r), Rn(n ? "replaced" : "inserted", r);
			}
			let r = An(n, t);
			if (r === "candidate-older") return Rn("rejected-older", n);
			if (r === "candidate-loses-tie-break") return Rn("rejected-tie-break", n);
			if (r === "candidate-newer" || r === "candidate-wins-tie-break") {
				let n = Ln(e, t, this.now());
				return await this.db.profiles.put(n), Rn("replaced", n);
			}
			let i = Pn(n.profileRelays, t.profile.profileRelays, t.observedRelays), a = Math.max(n.fetchedAt, t.fetchedAt);
			if (a === n.fetchedAt && Ke(n.profileRelays, i)) return Rn("kept-existing", n);
			let o = {
				...n,
				profileRelays: i,
				fetchedAt: a,
				updatedAt: this.now(),
				schemaVersion: jn
			};
			return await this.db.profiles.put(o), Rn("merged-same-event", o);
		});
	}
	async delete(e) {
		if (e) {
			await this.db.profiles.delete(e);
			try {
				this.getStorage().removeItem(dt.NOSTR_PROFILE + e);
			} catch {}
		}
	}
}(), Vn = r("<div aria-hidden=\"true\"></div>"), Hn = {
	hash: "svelte-ohoxs0",
	code: ".blurhash-placeholder.svelte-ohoxs0 {position:absolute;inset:0;z-index:0;border-radius:inherit;overflow:hidden;background:radial-gradient(\n                circle at top left,\n                rgba(255, 255, 255, 0.2),\n                transparent 48%\n            ),\n            linear-gradient(\n                135deg,\n                color-mix(in srgb, var(--background-color, #fff) 24%, #000 76%),\n                color-mix(in srgb, var(--background-color, #fff) 8%, #000 92%)\n            );background-position:center;background-repeat:no-repeat;background-size:cover;}.blurhash-placeholder-ready.svelte-ohoxs0 {background-image:var(--blurhash-placeholder-image);}.blurhash-placeholder.svelte-ohoxs0::after {content:\"\";position:absolute;inset:0;background:linear-gradient(\n            180deg,\n            rgba(0, 0, 0, 0.08),\n            rgba(0, 0, 0, 0.28)\n        );}:root.dark .ehagaki-app-root .blurhash-placeholder.svelte-ohoxs0::after,\n    :host(.dark) .ehagaki-app-root .blurhash-placeholder.svelte-ohoxs0::after {background:linear-gradient(\n            180deg,\n            rgba(0, 0, 0, 0.14),\n            rgba(0, 0, 0, 0.38)\n        );}"
};
function Un(e, n) {
	d(n, !0), T(e, Hn);
	let r = /* @__PURE__ */ new Map(), i = j(n, "blurhash", 3, void 0), a = j(n, "className", 3, ""), o = g(null), s = v(() => F(o) ? `--blurhash-placeholder-image: url("${F(o)}");` : "");
	async function c(e) {
		let t = e.trim();
		if (!t || typeof document > "u") return null;
		let n = r.get(t);
		if (n instanceof Promise || typeof n == "string" || n === null) return n;
		let i = Promise.resolve().then(() => {
			let e = document.createElement("canvas");
			e.width = 32, e.height = 32;
			let n = e.getContext("2d");
			if (!n) return null;
			let r = n.createImageData(32, 32);
			return r.data.set(le(t, 32, 32)), n.putImageData(r, 0, 0), e.toDataURL("image/png");
		}).catch(() => null).then((e) => (r.set(t, e), e));
		return r.set(t, i), i;
	}
	N(() => {
		let e = !0, t = i()?.trim();
		if (S(o, null), t) return c(t).then((t) => {
			e && S(o, t, !0);
		}), () => {
			e = !1;
		};
	});
	var l = Vn();
	let p;
	O((e, n) => {
		p = R(l, 1, e, "svelte-ohoxs0", p, { "blurhash-placeholder-ready": n }), t(l, F(s));
	}, [() => u(`blurhash-placeholder ${a()}`.trim()), () => !!F(o)]), f(e, l), te();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryMediaCache.svelte.ts
function Wn(e) {
	return {
		url: e.url,
		alt: e.alt,
		mimeType: e.mimeType,
		blurhash: e.blurhash,
		dim: e.dim,
		kind: tt({
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
function Gn(e, t) {
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
function Kn(e) {
	let t = k({ items: [] }), n = /* @__PURE__ */ new Map(), r = 0, i = "", a = !1;
	function o(e) {
		let t = Wn(e), r = Z.getCachedMediaDescriptorSnapshot(e.url);
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
		let t = Wn(e);
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
	return P(() => {
		a = !0, r += 1, l();
	}), N(() => {
		let f = e.getMedia(), p = Gn(f, Z.canUsePersistentCache());
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
var qn = /:([^\s:]+):/g, Jn = {
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
function Yn(e) {
	return e.nextUntil === null ? !1 : e.status === "success" ? e.hasMore : e.events.length > 0;
}
function Xn(e, t) {
	return e ? {
		status: e.name ? "resolved" : "failed",
		name: e.name
	} : {
		status: t ? "loading" : "failed",
		name: null
	};
}
function Zn(e, t) {
	return B.sanitizeExternalRelayUrls([
		...e?.channelRelayHints ?? [],
		...e?.fetchedRelays ?? [],
		...e?.relayHints ?? [],
		...e?.acceptedRelays ?? [],
		...t?.relayHints ?? [],
		...t?.relays ?? []
	], { limit: 8 });
}
function Qn(e, t, n) {
	let r = Math.max(1, Math.ceil(t / n));
	return t === 0 ? 1 : Math.min(e, r);
}
function $n(e, t = Date.now()) {
	let n = new Date(e), r = new Date(t), i = {
		hour: "numeric",
		minute: "2-digit"
	};
	if (nr(n, r)) return new Intl.DateTimeFormat(void 0, i).format(n);
	let a = {
		month: "numeric",
		day: "numeric",
		...i
	};
	return n.getFullYear() === r.getFullYear() ? new Intl.DateTimeFormat(void 0, a).format(n) : new Intl.DateTimeFormat(void 0, {
		year: "numeric",
		month: "numeric",
		day: "numeric"
	}).format(n);
}
function er(e, t) {
	return new Intl.DateTimeFormat(t ?? void 0, {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	}).format(new Date(e));
}
function tr(e, t, n = Date.now()) {
	let r = new Date(e), i = new Date(n);
	return nr(r, i) ? ir(0, t) : rr(r, i) ? ir(-1, t) : r.getFullYear() === i.getFullYear() ? new Intl.DateTimeFormat(t ?? void 0, {
		month: "numeric",
		day: "numeric",
		weekday: "short"
	}).format(r) : new Intl.DateTimeFormat(t ?? void 0, {
		year: "numeric",
		month: "numeric"
	}).format(r);
}
function nr(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
function rr(e, t) {
	let n = new Date(t);
	return n.setHours(0, 0, 0, 0), n.setDate(n.getDate() - 1), nr(e, n);
}
function ir(e, t) {
	return new Intl.RelativeTimeFormat(t ?? void 0, { numeric: "auto" }).format(e, "day");
}
function ar(e) {
	return e.trim() || " ";
}
function or(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) {
		let e = et(r.url);
		if (!e || n.has(e)) continue;
		n.add(e);
		let i = tt({
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
function sr(e) {
	let t = gr(e.length), n = [], r = 0;
	for (let i = 0; i < t.length; i += 1) {
		let a = t[i], o = e.slice(r, r + a);
		r += a, n.push({
			items: o,
			slotCount: _r({
				totalCount: e.length,
				rowLength: o.length,
				isFinalRow: i === t.length - 1
			})
		});
	}
	return n;
}
function cr(e) {
	return e.map((e) => ({
		id: e.id,
		src: e.url,
		alt: e.alt,
		type: "image",
		dim: e.dim
	}));
}
function lr(e) {
	return ur(e).aspectRatio;
}
function ur(e) {
	let t = e.fallback ?? (e.kind === "video" ? "16 / 9" : "1 / 1"), n = mr(e.dim);
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
function dr(e) {
	return e.hasFetchFailed ? "error" : e.previewObjectUrl ? "ready" : e.cached || e.isLoadingPreview ? "cache-materializing" : e.isCaching ? "loading" : (e.hasResolvedCache, e.hasMetadataHint ? "placeholder" : "unknown");
}
function fr(e) {
	let t = or(e), n = t.filter((e) => e.kind === "image");
	return {
		items: t,
		images: n,
		videos: t.filter((e) => e.kind === "video"),
		others: t.filter((e) => e.kind === "other"),
		imageRows: sr(n),
		fullscreenMediaItems: cr(n)
	};
}
function pr(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) for (let e of r.media) {
		let r = nt(e.url);
		r && !n.has(r) && (n.add(r), t.push(e.url));
	}
	return t;
}
function mr(e) {
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
function hr(e) {
	let t = ar(e.content), n = jt(e.tags), r = vr(e.media ?? []), i = [], a = /* @__PURE__ */ new Set(), o = 0;
	for (let e of t.matchAll(qn)) {
		let s = e.index ?? -1, c = e[1] ?? "", l = e[0] ?? "";
		if (s < 0 || !l) continue;
		let u = Ot(c), d = u ? n.get(u) : void 0;
		d && (s > o && yr(i, t.slice(o, s), r), i.push({
			type: "emoji",
			shortcode: d.shortcode,
			shortcodeLower: u,
			rawShortcodeText: l,
			url: d.url
		}), a.add(d.url), o = s + l.length);
	}
	return o < t.length && yr(i, t.slice(o), r), i.length === 0 && i.push({
		type: "text",
		text: t
	}), {
		segments: i,
		emojiUrls: [...a]
	};
}
function gr(e) {
	let t = Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
	if (t === 0) return [];
	let n = Jn[t];
	if (n) return [...n];
	let r = Array.from({ length: Math.floor(t / 3) }, () => 3), i = t % 3;
	return i > 0 && r.push(i), r;
}
function _r(e) {
	let { totalCount: t, rowLength: n, isFinalRow: r } = e;
	return r && t >= 7 && n < 3 || n >= 3 ? 3 : n === 2 ? 2 : 1;
}
function vr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = nt(n.url);
		e && !t.has(e) && t.set(e, n);
	}
	return t;
}
function yr(e, t, n) {
	if (!t) return;
	let r = 0;
	for (let i of yt(t)) {
		if (!i.isValidHttpUrl || !i.href) continue;
		let a = nt(i.displayText), o = n.get(a);
		br(e, t.slice(r, i.candidateStart)), o ? e.push({
			type: "media",
			url: i.displayText,
			normalizedUrl: a,
			media: o
		}) : e.push({
			type: "link",
			text: i.displayText,
			href: i.href
		}), br(e, i.trailingText), r = i.candidateEnd;
	}
	r < t.length && br(e, t.slice(r));
}
function br(e, t) {
	if (!t) return;
	let n = e[e.length - 1];
	n?.type === "text" ? n.text += t : e.push({
		type: "text",
		text: t
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryMediaList.svelte
var xr = r("<div class=\"copy-icon svg-icon svelte-8yjcw8\"></div>"), Sr = r("<div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><button type=\"button\" class=\"post-history-media-retry-button svelte-8yjcw8\"> </button></div>"), Cr = r("<div class=\"post-history-media-placeholder-loader svelte-8yjcw8\"><!></div>"), wr = r("<div><!> <!> <!></div>"), Tr = r("<img class=\"post-history-media-image post-history-media-image-single-stage svelte-8yjcw8\" loading=\"lazy\" decoding=\"async\"/>"), Er = r("<div class=\"post-history-media-layout-frame post-history-single-image-layout-frame svelte-8yjcw8\"><!></div>"), Dr = r("<img class=\"post-history-media-image svelte-8yjcw8\" loading=\"lazy\" decoding=\"async\"/>"), Or = r("<button type=\"button\"><!></button>"), kr = r("<div class=\"post-history-media-placeholder-loader post-history-media-placeholder-loader-single svelte-8yjcw8\"><!></div>"), Ar = r("<div class=\"post-history-image-cell svelte-8yjcw8\"><div><!> <!> <!></div></div>"), jr = r("<div class=\"post-history-image-row svelte-8yjcw8\"></div>"), Mr = r("<div></div>"), Nr = r("<video class=\"post-history-media-video svelte-8yjcw8\" controls=\"\" playsinline=\"\" preload=\"metadata\"><track kind=\"captions\" class=\"svelte-8yjcw8\"/></video>", 2), Pr = r("<button type=\"button\" class=\"post-history-media-retry-button svelte-8yjcw8\"> </button>"), Fr = r("<div><!> <div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><!></div></div>"), Ir = r("<article class=\"post-history-video-card svelte-8yjcw8\"><div class=\"post-history-video-card-header svelte-8yjcw8\"><span class=\"post-history-video-card-label svelte-8yjcw8\"> </span> <!></div> <div class=\"post-history-video-media-frame svelte-8yjcw8\"><!></div></article>"), Lr = r("<div class=\"post-history-video-list svelte-8yjcw8\"></div>"), Rr = r("<div class=\"post-history-other-media-card svelte-8yjcw8\"><div class=\"post-history-other-media-header svelte-8yjcw8\"><span class=\"post-history-other-media-label svelte-8yjcw8\"> </span> <!></div> <div><div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><!></div> <!></div></div>"), zr = r("<div class=\"post-history-other-media-list svelte-8yjcw8\"></div>"), Br = r("<div class=\"post-history-media-section svelte-8yjcw8\"><!> <!> <!></div>"), Vr = {
	hash: "svelte-8yjcw8",
	code: ".post-history-media-section.svelte-8yjcw8 {display:flex;flex-direction:column;gap:10px;}.post-history-image-grid.svelte-8yjcw8 {display:flex;flex-direction:column;justify-content:center;align-items:center;border-radius:12px;overflow:hidden;gap:2px;}.post-history-image-row.svelte-8yjcw8 {display:grid;grid-template-columns:repeat(\n            var(--post-history-image-columns),\n            minmax(0, 1fr)\n        );width:100%;gap:2px;}.post-history-image-cell.svelte-8yjcw8 {position:relative;min-width:0;}.post-history-image-surface-frame.svelte-8yjcw8 {position:relative;width:100%;.post-history-media-surface:where(.svelte-8yjcw8) {font-size:0;display:block;width:100%;padding:0;border:0;background-color:transparent;text-align:start;cursor:pointer;margin-inline:auto;&:active:not(:disabled) {scale:1;}}}\n\n    /* 単体画像のときグリッド側のボーダーを無効化 */.post-history-image-grid-single.svelte-8yjcw8 {border:none;border-radius:0;overflow:visible;}.post-history-image-surface-frame-single.svelte-8yjcw8 {max-width:100%;margin-inline:0;border-radius:12px;overflow:hidden;}.post-history-image-surface.svelte-8yjcw8 {overflow:hidden;}.post-history-image-surface-single.svelte-8yjcw8 {display:block;min-height:100px;}.post-history-media-layout-frame.svelte-8yjcw8 {position:relative;width:100%;max-width:100%;overflow:hidden;background:transparent;}.post-history-single-image-layout-frame.svelte-8yjcw8 {position:relative;padding:0;display:grid;place-items:center;justify-self:stretch;align-self:stretch;overflow:hidden;background:transparent;}.post-history-image-placeholder-single.svelte-8yjcw8 {position:absolute;inset:0;display:grid;place-items:center;width:100%;height:100%;min-height:0;}.post-history-media-image.svelte-8yjcw8,\n    .post-history-media-placeholder.svelte-8yjcw8,\n    .post-history-media-layout-frame.svelte-8yjcw8 {width:100%;max-width:100%;}.post-history-media-image.svelte-8yjcw8 {display:block;height:100%;object-fit:cover;}.post-history-media-image-single.svelte-8yjcw8 {height:auto;margin-inline:auto;}.post-history-media-image-single-stage.svelte-8yjcw8 {position:relative;z-index:1;}.post-history-media-video.svelte-8yjcw8 {display:block;width:100%;max-height:300px;height:100%;object-fit:contain;border-radius:10px;background:color-mix(\n            in srgb,\n            var(--background-color, #fff) 92%,\n            #000 8%\n        );}.post-history-video-media-frame.svelte-8yjcw8 {width:100%;max-height:300px;overflow:hidden;border-radius:10px;}.post-history-media-placeholder.svelte-8yjcw8 {display:flex;flex-direction:column;gap:8px;align-items:flex-start;justify-content:center;padding:12px;text-align:start;position:relative;isolation:isolate;height:auto;aspect-ratio:var(--post-history-media-aspect-ratio, 1 / 1);overflow-wrap:anywhere;margin-inline:auto;}.post-history-media-placeholder-content.svelte-8yjcw8 {position:relative;z-index:1;display:flex;flex-direction:column;gap:8px;width:100%;}.post-history-media-placeholder-loader.svelte-8yjcw8 {position:absolute;inset:auto 8px 8px auto;z-index:2;pointer-events:none;}.post-history-media-placeholder-loader-single.svelte-8yjcw8 {z-index:3;}.post-history-media-placeholder-uncached.svelte-8yjcw8 {--post-history-placeholder-stripe-soft: light-dark(\n            color-mix(in srgb, var(--background-color, #fff) 94%, #000 6%),\n            color-mix(in srgb, var(--background-color, #111) 94%, #fff 6%)\n        );--post-history-placeholder-stripe-strong: light-dark(\n            color-mix(in srgb, var(--background-color, #fff) 88%, #000 12%),\n            color-mix(in srgb, var(--background-color, #111) 88%, #fff 12%)\n        );background:repeating-linear-gradient(\n            -45deg,\n            var(--post-history-placeholder-stripe-soft),\n            var(--post-history-placeholder-stripe-soft) 10px,\n            var(--post-history-placeholder-stripe-strong) 10px,\n            var(--post-history-placeholder-stripe-strong) 20px\n        );}.post-history-image-placeholder-single.post-history-media-placeholder.svelte-8yjcw8 {height:100%;margin-inline:0;aspect-ratio:auto;}.post-history-media-placeholder-blurhash.svelte-8yjcw8 {background:color-mix(\n            in srgb,\n            var(--background-color, #fff) 18%,\n            #000 82%\n        );}.post-history-media-retry-button.svelte-8yjcw8 {width:100%;height:100%;padding:6px 12px;border:1px solid var(--border, #ccc);border-radius:10px;color:var(--text, #111);font:inherit;cursor:pointer;}.post-history-video-list.svelte-8yjcw8,\n    .post-history-other-media-list.svelte-8yjcw8 {display:flex;flex-direction:column;gap:10px;}.post-history-video-card.svelte-8yjcw8,\n    .post-history-other-media-card.svelte-8yjcw8 {display:flex;flex-direction:column;width:100%;border-radius:12px;border:1px solid var(--border-hr);background:var(--bg-input);overflow:hidden;}.post-history-video-card-header.svelte-8yjcw8,\n    .post-history-other-media-header.svelte-8yjcw8 {display:flex;align-items:center;justify-content:space-between;}.post-history-video-card-label.svelte-8yjcw8,\n    .post-history-other-media-label.svelte-8yjcw8 {min-width:0;padding:4px 8px;overflow-wrap:anywhere;color:var(--text-muted);font-size:0.875rem;line-height:1.2;}.post-history-video-placeholder.svelte-8yjcw8 {width:100%;height:100%;aspect-ratio:auto;padding:0 12px;}button.post-history-media-copy-button.circle.copy {min-width:36px;width:36px;height:36px;min-height:36px;z-index:2;}button.post-history-media-copy-button-image.circle.copy {position:absolute;inset:8px 8px auto auto;}button.post-history-video-copy-button.circle.copy {position:relative;top:auto;right:auto;flex-shrink:0;}\n\n    @keyframes svelte-8yjcw8-post-history-media-loading {\n        0% {\n            background-position: 100% 50%;\n        }\n        100% {\n            background-position: -100% 50%;\n        }\n    }.post-history-media-video {background-color:light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));}"
};
function Hr(r, o) {
	d(o, !0), T(r, Vr);
	let c = () => ee(_e, "$_", u), [u, h] = D(), _ = (e, t = a, n = a) => {
		{
			let r = v(() => `post-history-media-copy-button ${n()}`), i = v(() => ue(t().kind, t().url)), a = v(() => ue(t().kind, t().url)), o = v(() => de(t().kind));
			ct(e, {
				variant: "copy",
				shape: "circle",
				get className() {
					return F(r);
				},
				get ariaLabel() {
					return F(i);
				},
				get title() {
					return F(a);
				},
				onClick: (e) => Te(t(), e),
				get floatingMessage() {
					return F(o);
				},
				children: (e, t) => {
					var n = xr();
					f(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	}, x = (n, r = a, i = a, o = a, s = a, u = a) => {
		var d = wr();
		let p;
		var h = E(d), g = (e) => {
			Un(e, { get blurhash() {
				return r().blurhash;
			} });
		};
		l(h, (e) => {
			s() && e(g);
		});
		var _ = b(h, 2), x = (t) => {
			var n = Sr(), i = E(n), a = y(i, !0);
			w(n), O((t) => e(a, t), [() => c()("postHistory.mediaFetchAndCache")]), m("click", i, () => Ee(r())), f(t, n);
		};
		l(_, (e) => {
			u() && e(x);
		});
		var S = b(_, 2), C = (e) => {
			var t = Cr(), n = E(t);
			ye(n, {
				showLoader: !0,
				text: !1,
				loaderSize: 34
			}), w(t), f(e, t);
		}, T = v(() => Ce(r(), i(), be(r())));
		l(S, (e) => {
			F(T) && e(C);
		}), w(d), O((e, n) => {
			p = R(d, 1, `post-history-media-placeholder ${o()}`, "svelte-8yjcw8", p, {
				"post-history-media-placeholder-blurhash": s(),
				"post-history-image-placeholder-single": i().isSingleImage
			}), t(d, i().isSingleImage ? void 0 : i().surfaceStyle), L(d, "aria-label", e), L(d, "title", n);
		}, [() => Ne(r()), () => H(r())]), f(n, d);
	}, C = "160px 0px", A = j(o, "scrollRoot", 3, null), M = j(o, "onImageOpen", 3, void 0), N = j(o, "mediaLayout", 3, void 0), P = g(k({})), ne = /* @__PURE__ */ new Set(), re = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), z = v(() => N() ?? fr(o.media)), B = Kn({ getMedia: () => F(z).items }), ae = v(() => new Map(B.state.items.map((e) => [e.url, e]))), V = v(() => F(z).imageRows.map((e) => ({
		...e,
		items: e.items.map((e) => ce(e))
	}))), oe = v(() => F(z).videos.map((e) => ce(e))), se = v(() => F(z).others.map((e) => ce(e)));
	function H(e) {
		let t = e.alt?.trim();
		if (t) return t;
		try {
			return new URL(e.url).pathname.split("/").filter(Boolean).at(-1) || e.url;
		} catch {
			return e.url;
		}
	}
	function ce(e) {
		let t = F(ae).get(e.url);
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
	function le(e) {
		return e === "video" ? "videoContextMenu" : "imageContextMenu";
	}
	function ue(e, t) {
		let n = le(e), r = F(P)[t];
		return r === "copied" ? c()(`${n}.copySuccess`) : r === "failed" ? c()(`${n}.copyFailed`) : c()(`${n}.copyUrl`);
	}
	function de(e) {
		return c()(`${le(e)}.copySuccess`);
	}
	function U(e) {
		return `${c()("postHistory.mediaOpen")} ${H(e)}`;
	}
	function fe(e) {
		let [t, n] = e.split("/"), r = Number(t?.trim()), i = Number(n?.trim());
		return !Number.isFinite(r) || !Number.isFinite(i) || i <= 0 ? 1 : r / i;
	}
	function W(e) {
		return Number.isInteger(e) ? `${e}` : e.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
	}
	function G(e) {
		return `min(100%, ${W(300 * fe(e))}px)`;
	}
	function pe(e) {
		return `min(100%, ${W(Math.max(100, 100 * fe(e)))}px)`;
	}
	function K(e) {
		return `width: max(${G(e)}, ${pe(e)});`;
	}
	function me() {
		return "width: 100%; min-height: 100px;";
	}
	function he(e) {
		return fe(e) < .3333333333333333 ? "100 / 300" : e;
	}
	function ge(e) {
		return [
			`aspect-ratio: ${he(e)};`,
			"width: 100%;",
			"max-height: 300px;",
			"min-height: 100px;",
			"padding: 0;"
		].join(" ");
	}
	function ve(e) {
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
	function q(e) {
		return [`aspect-ratio: ${e};`, "width: 100%;"].join(" ");
	}
	function J(e) {
		return !!(e.blurhash?.trim() || e.dim?.trim());
	}
	function be(e) {
		return dr({
			hasResolvedCache: e.hasResolvedCache,
			cached: e.cached,
			previewObjectUrl: e.previewObjectUrl,
			isLoadingPreview: e.isLoadingPreview,
			isCaching: e.isCaching,
			hasFetchFailed: e.hasFetchFailed,
			hasMetadataHint: J(e)
		});
	}
	function Y(e) {
		let t = xe(e.item, e.slotCount), n = Se(e.item) ? "cover" : "contain", r = ur({
			dim: e.item.dim,
			kind: e.item.kind
		});
		return e.isSingleImage ? {
			aspectRatio: t,
			dimensionHints: r,
			isSingleImage: !0,
			frameStyle: K(t),
			surfaceStyle: me(),
			layoutFrameStyle: ge(t),
			imageStyle: ve(n)
		} : {
			aspectRatio: t,
			dimensionHints: r,
			isSingleImage: !1,
			surfaceStyle: q(t),
			imageStyle: `object-fit: ${n};`
		};
	}
	function xe(e, t) {
		let n = re.get(e.id);
		if (n) return n;
		let r = F(z).images.length === 4 ? "4 / 3" : t === 1 ? lr({
			dim: e.dim,
			kind: e.kind
		}) : "1 / 1";
		return re.set(e.id, r), r;
	}
	function Se(e) {
		let t = ie.get(e.id);
		if (t !== void 0) return t;
		let n = !!e.dim?.trim();
		return ie.set(e.id, n), n;
	}
	function Ce(e, t, n) {
		return !t.isSingleImage && ke(e, n);
	}
	function we(e, t, n) {
		return t.isSingleImage && ke(e, n);
	}
	function X(e) {
		ne.has(e) || (ne.add(e), B.fetchAndCacheMedia(e));
	}
	async function Te(e, t) {
		t.stopPropagation(), t.preventDefault();
		let n = await bt(e.url, "URL", navigator, window);
		return S(P, {
			...F(P),
			[e.url]: n ? "copied" : "failed"
		}, !0), setTimeout(() => {
			S(P, {
				...F(P),
				[e.url]: void 0
			}, !0);
		}, 1800), n;
	}
	function Ee(e) {
		B.fetchAndCacheMedia(e.url);
	}
	function De(e, t) {
		if (!e.cached) return;
		let n = F(z).fullscreenMediaItems.findIndex((t) => t.id === e.id);
		n < 0 || M()?.({
			index: n,
			mediaList: F(z).fullscreenMediaItems,
			focusOrigin: t
		});
	}
	function Oe(e) {
		return e.hasResolvedCache && !e.cached && !e.isCaching && !e.hasFetchFailed;
	}
	function ke(e, t) {
		return t !== "ready" && t !== "cache-materializing" && (!e.hasResolvedCache || t === "loading");
	}
	function Ae(e, t) {
		return !!e.blurhash && t !== "ready" && t !== "cache-materializing" && (e.kind === "image" || e.kind === "video");
	}
	function je(e) {
		return e === "ready" || e === "cache-materializing";
	}
	function Me(e) {
		return e === "error" ? "post-history-media-placeholder-failed" : "post-history-media-placeholder-uncached";
	}
	function Ne(e) {
		return `${Fe(e)} ${H(e)}`;
	}
	function Pe(e) {
		let t = re.get(e.id);
		if (t) return t;
		let n = lr({
			dim: e.dim,
			kind: e.kind
		});
		return re.set(e.id, n), ie.set(e.id, !!e.dim?.trim()), n;
	}
	function Fe(e) {
		return !e.hasResolvedCache || e.isLoadingPreview ? c()("postHistory.mediaLoading") : e.cached ? c()("postHistory.mediaCached") : e.hasFetchFailed ? c()("postHistory.mediaLoadFailed") : e.isCaching ? c()("postHistory.mediaLoading") : c()("postHistory.mediaNotCached");
	}
	var Ie = p(), Le = I(Ie), Re = (r) => {
		var a = Br(), o = E(a), u = (e) => {
			var r = Mr();
			let a;
			n(r, 21, () => F(V), i, (e, r) => {
				var i = jr();
				n(i, 21, () => F(r).items, (e) => e.id, (e, n) => {
					let i = v(() => F(z).images.length === 1), a = v(() => Y({
						item: F(n),
						slotCount: F(r).slotCount,
						isSingleImage: F(i)
					})), o = v(() => be(F(n))), c = v(() => Ae(F(n), F(o)));
					var u = Ar(), d = E(u);
					let p;
					var h = E(d), g = (e) => {
						var r = Or();
						let o;
						var s = E(r), c = (e) => {
							var r = Er(), i = E(r), o = (e) => {
								var r = Tr();
								O((e) => {
									L(r, "src", F(n).previewObjectUrl), L(r, "alt", e), t(r, F(a).imageStyle), L(r, "width", F(a).dimensionHints.width), L(r, "height", F(a).dimensionHints.height);
								}, [() => F(n).alt || H(F(n))]), f(e, r);
							};
							l(i, (e) => {
								F(n).previewObjectUrl && e(o);
							}), w(r), O(() => t(r, F(a).layoutFrameStyle)), f(e, r);
						}, u = (e) => {
							var r = Dr();
							O((e) => {
								L(r, "src", F(n).previewObjectUrl), L(r, "alt", e), t(r, F(a).imageStyle), L(r, "width", F(a).dimensionHints.width), L(r, "height", F(a).dimensionHints.height);
							}, [() => F(n).alt || H(F(n))]), f(e, r);
						};
						l(s, (e) => {
							F(i) ? e(c) : F(n).previewObjectUrl && e(u, 1);
						}), w(r), O((e, n) => {
							o = R(r, 1, "post-history-media-surface post-history-image-surface svelte-8yjcw8", null, o, { "post-history-image-surface-single": F(i) }), t(r, F(a).surfaceStyle), L(r, "aria-label", e), L(r, "title", n);
						}, [() => U(F(n)), () => H(F(n))]), m("click", r, (e) => De(F(n), e.currentTarget instanceof HTMLElement ? e.currentTarget : null)), f(e, r);
					}, y = v(() => je(F(o))), S = (e) => {
						var r = Er(), i = E(r);
						{
							let e = v(() => Me(F(o)));
							x(i, () => F(n), () => F(a), () => F(e), () => F(c), () => F(o) === "error");
						}
						w(r), O(() => t(r, F(a).layoutFrameStyle)), f(e, r);
					}, T = (e) => {
						{
							let t = v(() => Me(F(o)));
							x(e, () => F(n), () => F(a), () => F(t), () => F(c), () => F(o) === "error");
						}
					};
					l(h, (e) => {
						F(y) ? e(g) : F(i) ? e(S, 1) : e(T, -1);
					});
					var D = b(h, 2), k = (e) => {
						var t = kr(), n = E(t);
						ye(n, {
							showLoader: !0,
							text: !1,
							loaderSize: 34
						}), w(t), f(e, t);
					}, j = v(() => we(F(n), F(a), F(o)));
					l(D, (e) => {
						F(j) && e(k);
					});
					var M = b(D, 2);
					_(M, () => F(n), () => "post-history-media-copy-button-image"), w(d), w(u), s(u, (e, t) => Pt?.(e, t), () => ({
						enabled: Oe(F(n)),
						once: !0,
						root: A(),
						rootMargin: C,
						onEnterView: () => X(F(n).url)
					})), O(() => {
						p = R(d, 1, "post-history-image-surface-frame svelte-8yjcw8", null, p, { "post-history-image-surface-frame-single": F(i) }), t(d, F(i) ? F(a).frameStyle : void 0);
					}), f(e, u);
				}), w(i), O(() => t(i, `--post-history-image-columns: ${F(r).slotCount};`)), f(e, i);
			}), w(r), O(() => a = R(r, 1, "post-history-image-grid svelte-8yjcw8", null, a, { "post-history-image-grid-single": F(z).images.length === 1 })), f(e, r);
		};
		l(o, (e) => {
			F(V).length > 0 && e(u);
		});
		var d = b(o, 2), p = (r) => {
			var i = Lr();
			n(i, 21, () => F(oe), (e) => e.id, (n, r) => {
				let i = v(() => Pe(F(r))), a = v(() => be(F(r))), o = v(() => Ae(F(r), F(a)));
				var u = Ir(), d = E(u), p = E(d), h = y(p, !0), g = b(p, 2);
				_(g, () => F(r), () => "post-history-video-copy-button"), w(d);
				var x = b(d, 2), S = E(x), T = (e) => {
					var t = Nr();
					O(() => L(t, "src", F(r).previewObjectUrl)), f(e, t);
				}, D = (t) => {
					var n = Fr();
					let i;
					var a = E(n), s = (e) => {
						Un(e, { get blurhash() {
							return F(r).blurhash;
						} });
					};
					l(a, (e) => {
						F(o) && e(s);
					});
					var u = b(a, 2), d = E(u), p = (t) => {
						var n = Pr(), i = y(n, !0);
						O((t) => e(i, t), [() => c()("postHistory.mediaFetchAndCache")]), m("click", n, () => Ee(F(r))), f(t, n);
					};
					l(d, (e) => {
						F(r).hasFetchFailed && e(p);
					}), w(u), w(n), O((e, t) => {
						i = R(n, 1, "post-history-media-placeholder post-history-video-placeholder svelte-8yjcw8", null, i, {
							"post-history-media-placeholder-cached": F(r).cached,
							"post-history-media-placeholder-uncached": !F(r).cached && !F(r).hasFetchFailed,
							"post-history-media-placeholder-failed": F(r).hasFetchFailed,
							"post-history-media-placeholder-blurhash": F(o)
						}), L(n, "aria-label", e), L(n, "title", t);
					}, [() => Ne(F(r)), () => H(F(r))]), f(t, n);
				};
				l(S, (e) => {
					F(r).cached && F(r).previewObjectUrl ? e(T) : e(D, -1);
				}), w(x), w(u), s(u, (e, t) => Pt?.(e, t), () => ({
					enabled: Oe(F(r)),
					once: !0,
					root: A(),
					rootMargin: C,
					onEnterView: () => X(F(r).url)
				})), O((n, r) => {
					e(h, n), t(x, r);
				}, [() => H(F(r)), () => `${q(F(i))} max-height: 300px;`]), f(n, u);
			}), w(i), f(r, i);
		};
		l(d, (e) => {
			F(oe).length > 0 && e(p);
		});
		var h = b(d, 2), g = (t) => {
			var r = zr();
			n(r, 21, () => F(se), (e) => e.id, (t, n) => {
				let r = v(() => be(F(n)));
				var i = Rr(), a = E(i), o = E(a), u = y(o, !0), d = b(o, 2);
				_(d, () => F(n), () => "post-history-video-copy-button"), w(a);
				var p = b(a, 2);
				let h;
				var g = E(p), x = E(g), S = (t) => {
					var r = Pr(), i = y(r, !0);
					O((t) => e(i, t), [() => c()("postHistory.mediaFetchAndCache")]), m("click", r, () => Ee(F(n))), f(t, r);
				};
				l(x, (e) => {
					F(n).hasFetchFailed && e(S);
				}), w(g);
				var T = b(g, 2), D = (e) => {
					var t = Cr(), n = E(t);
					ye(n, {
						showLoader: !0,
						text: !1,
						loaderSize: 34
					}), w(t), f(e, t);
				}, k = v(() => ke(F(n), F(r)));
				l(T, (e) => {
					F(k) && e(D);
				}), w(p), w(i), s(i, (e, t) => Pt?.(e, t), () => ({
					enabled: Oe(F(n)),
					once: !0,
					root: A(),
					rootMargin: C,
					onEnterView: () => X(F(n).url)
				})), O((t, r, i) => {
					e(u, t), h = R(p, 1, "post-history-media-placeholder svelte-8yjcw8", null, h, {
						"post-history-media-placeholder-cached": F(n).cached,
						"post-history-media-placeholder-uncached": !F(n).cached && !F(n).hasFetchFailed,
						"post-history-media-placeholder-failed": F(n).hasFetchFailed
					}), L(p, "aria-label", r), L(p, "title", i);
				}, [
					() => H(F(n)),
					() => Ne(F(n)),
					() => H(F(n))
				]), f(t, i);
			}), w(r), f(t, r);
		};
		l(h, (e) => {
			F(se).length > 0 && e(g);
		}), w(a), f(r, a);
	};
	l(Le, (e) => {
		F(z).items.length > 0 && e(Re);
	}), f(r, Ie), te(), h();
}
h(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/components/TextLinkSegments.svelte
var Ur = r("<a class=\"reference-content-link svelte-1dq7r7\" target=\"_blank\" rel=\"noopener noreferrer\"> </a>"), Wr = r("<span> </span>"), Gr = {
	hash: "svelte-1dq7r7",
	code: ".reference-content-link.svelte-1dq7r7 {overflow-wrap:anywhere;word-break:break-word;}.reference-content-link.svelte-1dq7r7:visited {color:var(--link-visited);}"
};
function Kr(t, r) {
	T(t, Gr);
	var a = p(), o = I(a);
	n(o, 17, () => r.segments, i, (t, n) => {
		var r = p(), i = I(r), a = (t) => {
			var r = Ur(), i = y(r, !0);
			O(() => {
				L(r, "href", F(n).href), e(i, F(n).text);
			}), f(t, r);
		}, o = (t) => {
			var r = Wr(), i = y(r, !0);
			O(() => e(i, F(n).text)), f(t, r);
		};
		l(i, (e) => {
			F(n).type === "link" ? e(a) : e(o, -1);
		}), f(t, r);
	}), f(t, a);
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPreviewContent.svelte
var qr = r("<span class=\"post-history-custom-emoji-slot post-history-custom-emoji-failed svelte-yrehuj\" role=\"img\" tabindex=\"0\"> </span>"), Jr = r("<img class=\"post-history-custom-emoji svelte-yrehuj\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), Yr = r("<span class=\"post-history-custom-emoji-placeholder svelte-yrehuj\" aria-hidden=\"true\"></span>"), Xr = r("<span class=\"post-history-custom-emoji-slot svelte-yrehuj\"><!></span>"), Zr = r("<div></div> <!>", 1), Qr = r("<div class=\"post-history-preview-content svelte-yrehuj\"><!></div>"), $r = {
	hash: "svelte-yrehuj",
	code: ".post-history-preview-content.svelte-yrehuj {position:relative;display:flex;flex-direction:column;gap:6px;}.post-history-preview-text.svelte-yrehuj {overflow-wrap:anywhere;white-space:pre-wrap;font-size:var(--post-content-font-size, 1rem);line-height:var(--post-content-line-height, 1.5);}.post-history-preview-text-collapsed.svelte-yrehuj {max-height:calc(5 * var(--post-content-line-height, 1.5) * 1em);overflow:hidden;}.post-history-custom-emoji-slot.svelte-yrehuj {display:inline-grid;margin:0;padding:0;}.post-history-custom-emoji.svelte-yrehuj,\n    .post-history-custom-emoji-placeholder.svelte-yrehuj {width:100%;height:100%;}.post-history-custom-emoji.svelte-yrehuj {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-history-custom-emoji-failed.svelte-yrehuj {display:inline-grid;place-items:center;overflow:hidden;border-radius:4px;background:rgba(127, 127, 127, 0.18);font-size:0.45em;line-height:1;vertical-align:bottom;white-space:nowrap;cursor:help;}.post-history-custom-emoji-placeholder.svelte-yrehuj {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}"
};
function ei(r, c) {
	d(c, !0), T(r, $r);
	let m = j(c, "textOverlay", 3, void 0), h = j(c, "emojiLoadStateByUrl", 19, () => ({})), g = j(c, "emojiImageMetaByUrl", 19, () => ({})), _ = j(c, "previewCollapseAction", 3, () => ({})), x = j(c, "previewCollapseEventId", 3, ""), S = j(c, "previewContentId", 3, void 0), C = j(c, "isCollapsed", 3, !1), D = j(c, "emojiSize", 3, 30), k = j(c, "fontSize", 3, "1rem"), A = j(c, "lineHeight", 3, 1.5), M = j(c, "contentClass", 3, ""), ee = j(c, "collapsedContentClass", 3, ""), N = /* @__PURE__ */ new Map();
	function P(e) {
		return e.type !== "media";
	}
	let ne = v(() => c.previewContent.segments.filter(P)), re = v(() => F(ne).some((e) => e.type === "emoji" || e.type === "link" || e.type === "text" && e.text.trim().length > 0));
	function ie(e) {
		return h()[e] === "ready";
	}
	function z(e) {
		return h()[e] === "failed";
	}
	function B(e) {
		return Number.isInteger(e) ? `${e}` : e.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
	}
	function ae(e) {
		let t = N.get(e);
		if (t === void 0) {
			let n = g()[e]?.aspectRatio;
			t = typeof n == "number" && Number.isFinite(n) && n > 0 ? D() * n : D(), N.set(e, t);
		}
		return [
			`width: ${B(t)}px;`,
			`height: ${D()}px;`,
			"vertical-align: bottom;"
		].join(" ");
	}
	var V = Qr(), oe = E(V), se = (r) => {
		var c = Zr(), d = I(c);
		n(d, 21, () => F(ne), i, (n, r) => {
			var i = p(), a = I(i), o = (e) => {
				{
					let t = v(() => [F(r)]);
					Kr(e, { get segments() {
						return F(t);
					} });
				}
			}, s = (n) => {
				var i = qr(), a = y(i, !0);
				O((n) => {
					t(i, n), L(i, "aria-label", F(r).rawShortcodeText), L(i, "title", F(r).rawShortcodeText), e(a, F(r).rawShortcodeText);
				}, [() => ae(F(r).url)]), f(n, i);
			}, c = v(() => z(F(r).url)), u = (e) => {
				var n = Xr(), i = E(n), a = (e) => {
					var t = Jr();
					O(() => {
						L(t, "src", F(r).url), L(t, "alt", F(r).rawShortcodeText), L(t, "title", F(r).rawShortcodeText);
					}), f(e, t);
				}, o = v(() => ie(F(r).url)), s = (e) => {
					var t = Yr();
					f(e, t);
				};
				l(i, (e) => {
					F(o) ? e(a) : e(s, -1);
				}), w(n), O((e) => t(n, e), [() => ae(F(r).url)]), f(e, n);
			};
			l(a, (e) => {
				F(r).type === "text" || F(r).type === "link" ? e(o) : F(c) ? e(s, 1) : e(u, -1);
			}), f(n, i);
		}), w(d), s(d, (e, t) => _()?.(e, t), x);
		var h = b(d, 2);
		o(h, () => m() ?? a), O((e) => {
			L(d, "id", S()), R(d, 1, e, "svelte-yrehuj");
		}, [() => u([
			"post-history-preview-text",
			M(),
			C() ? "post-history-preview-text-collapsed" : "",
			C() ? ee() : ""
		].filter(Boolean).join(" "))]), f(r, c);
	};
	l(oe, (e) => {
		F(re) && e(se);
	}), w(V), O(() => t(V, `--post-content-font-size: ${k()}; --post-content-line-height: ${A()};`)), f(r, V), te();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postContentPreview.ts
function ti(e, t) {
	let n = t.find((e) => e[0] === "content-warning");
	return n && n.length > 2 ? n[2] : e;
}
function ni(e) {
	let t = e.tags.find((e) => e[0] === "content-warning"), n = t !== void 0 && t.length > 2, r = e.resolvedBody ? e.sourceContent : ti(e.sourceContent, e.tags), i = e.displayContent ?? r, a = Ce({
		content: r,
		tags: e.tags
	}), o = e.media === void 0 ? a : n ? [...e.media, ...a.filter((t) => !e.media.some((e) => e.url === t.url))] : e.media, s = hr({
		content: i,
		tags: e.tags,
		media: o
	}), c = fr(o);
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
function ri(e, t, n = t) {
	return ni({
		kind: e.kind,
		sourceContent: t,
		displayContent: n,
		tags: e.sourceTags,
		resolvedBody: !0
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostContentPreview.svelte
var ii = r("<span class=\"svelte-13idcaf\"> </span>"), ai = r("<span role=\"status\" class=\"svelte-13idcaf\"> </span>"), oi = r("<div class=\"content-warning-prompt svelte-13idcaf\" role=\"group\"><div class=\"content-warning-copy svelte-13idcaf\"><strong> </strong> <!></div> <!> <button type=\"button\" class=\"content-warning-reveal-button svelte-13idcaf\"> </button></div>"), si = r("<div class=\"post-preview-content\"><!></div>"), ci = r("<div class=\"post-preview-media\"><!></div>"), li = r("<!> <!> <!> <!>", 1), ui = r("<div><!></div>"), di = {
	hash: "svelte-13idcaf",
	code: ".post-content-preview.svelte-13idcaf {display:flex;flex-direction:column;gap:var(--post-content-block-gap, 6px);width:100%;max-width:100%;min-width:0;}.content-warning-prompt.svelte-13idcaf {display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;width:100%;max-width:100%;min-width:0;box-sizing:border-box;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 16%);color:var(--text);}.content-warning-copy.svelte-13idcaf {display:flex;flex:1 1 0;flex-direction:column;gap:3px;min-width:0;overflow-wrap:anywhere;}.content-warning-copy.svelte-13idcaf span:where(.svelte-13idcaf) {color:var(--text-muted);font-size:0.9em;}.content-warning-reveal-button.svelte-13idcaf {flex:0 1 auto;height:auto;max-width:100%;min-width:0;min-height:40px;box-sizing:border-box;padding:6px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;cursor:pointer;white-space:normal;overflow-wrap:anywhere;}.content-warning-reveal-button.svelte-13idcaf:hover {border-color:var(--theme);}"
};
function fi(n, r) {
	d(r, !0), T(n, di);
	let i = () => ee(_e, "$_", s), [s, c] = D(), u = j(r, "loadSensitiveBody", 3, void 0), h = j(r, "resolveSensitiveDisplayContent", 3, void 0), _ = j(r, "contentWarningEventId", 3, void 0), x = j(r, "density", 3, "standard"), C = j(r, "emojiLoadStateByUrl", 19, () => ({})), A = j(r, "emojiImageMetaByUrl", 19, () => ({})), ne = j(r, "scrollRoot", 3, null), re = j(r, "previewContentId", 3, void 0), ie = j(r, "isTextCollapsed", 3, !1), z = j(r, "previewCollapseAction", 3, () => ({})), B = j(r, "previewCollapseEventId", 3, ""), ae = j(r, "contentClass", 3, ""), V = j(r, "collapsedContentClass", 3, ""), oe = j(r, "renderWhenEmpty", 3, !1), se = j(r, "onImageOpen", 3, void 0), H = j(r, "betweenContentAndMedia", 3, void 0), ce = j(r, "afterContentAndMedia", 3, void 0), le = j(r, "textOverlay", 3, void 0), ue = g(null), de = g(!1), U = g(void 0), fe = g(!1), W = g(!1), G = 0, pe, K = g(k({})), me = g(k({})), he = v(() => _() === void 0 ? F(de) : F(ue) === _());
	function ge() {
		pe?.abort(), pe = void 0, G += 1, S(ue, null), S(de, !1), S(U, void 0), S(fe, !1), S(W, !1), S(K, {}, !0), S(me, {}, !0);
	}
	let ve, q;
	N(() => {
		let e = _(), t = u(), n = t === q || !!t?.scope && !!q?.scope && t.scope.runtime === q.scope.runtime && t.scope.ownerPubkey === q.scope.ownerPubkey;
		e === ve && n || M(ge), ve = e, q = t;
		let r = !0, i = t?.observe?.((e) => {
			r && (e === "deleted" || e === "invalid" || e === "missing" && F(U) !== void 0) && (ge(), S(W, !0));
		});
		return () => {
			r = !1, i?.();
		};
	}), P(ge);
	let J = v(() => F(U) === void 0 ? r.model : ri(r.model, F(U), h()?.(F(U)) ?? F(U)));
	N(() => {
		if (!F(he) || F(U) === void 0 || !u()?.loadEmoji) return;
		let e = F(J).previewContent.emojiUrls, t = u().loadEmoji, n = G;
		for (let r of e) M(() => F(K)[r]) || C()[r] === "ready" || (S(K, {
			...M(() => F(K)),
			[r]: "loading"
		}, !0), t(r).then((e) => {
			n === G && (S(K, {
				...F(K),
				[r]: e.ready ? "ready" : "failed"
			}, !0), e.ready && e.aspectRatio && S(me, {
				...F(me),
				[r]: { aspectRatio: e.aspectRatio }
			}, !0));
		}).catch(() => {
			n === G && S(K, {
				...F(K),
				[r]: "failed"
			}, !0);
		}));
	});
	async function ye() {
		if (u()) {
			let e = G;
			pe?.abort(), pe = new AbortController(), S(fe, !0), S(W, !1);
			try {
				let t = await u()(pe.signal);
				if (e !== G) return;
				if (t === null) {
					S(W, !0);
					return;
				}
				S(U, t, !0);
			} catch {
				if (e !== G) return;
				S(W, !0);
				return;
			} finally {
				e === G && S(fe, !1);
			}
		}
		_() === void 0 ? S(de, !0) : S(ue, _());
	}
	let be = v(() => {
		switch (x()) {
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
	var Y = p(), xe = I(Y), Se = (n) => {
		var r = ui(), s = E(r), c = (t) => {
			var n = oi(), r = E(n), a = E(r), o = y(a, !0), s = b(a, 2), c = (t) => {
				var n = ii(), r = y(n, !0);
				O(() => e(r, F(J).contentWarning.reason)), f(t, n);
			};
			l(s, (e) => {
				F(J).contentWarning.reason && e(c);
			}), w(r);
			var u = b(r, 2), d = (t) => {
				var n = ai(), r = y(n, !0);
				O((t) => e(r, t), [() => i()("postContent.sensitivePayloadLoading")]), f(t, n);
			}, p = (t) => {
				var n = ai(), r = y(n, !0);
				O((t) => e(r, t), [() => i()("postContent.sensitivePayloadUnavailable")]), f(t, n);
			};
			l(u, (e) => {
				F(fe) ? e(d) : F(W) && e(p, 1);
			});
			var h = b(u, 2), g = y(h, !0);
			w(n), O((t, r, i) => {
				L(n, "aria-label", t), e(o, r), h.disabled = F(fe), e(g, i);
			}, [
				() => i()("postContent.contentWarningTitle"),
				() => i()("postContent.contentWarningTitle"),
				() => i()(F(W) ? "postContent.retrySensitivePayload" : "postContent.showContentWarningBody")
			]), m("click", h, () => void ye()), f(t, n);
		}, u = (e) => {
			var t = li(), n = I(t), r = (e) => {
				var t = si(), n = E(t);
				{
					let e = v(() => ({
						...C(),
						...F(K)
					})), t = v(() => ({
						...A(),
						...F(me)
					}));
					ei(n, {
						get previewContent() {
							return F(J).previewContent;
						},
						get emojiLoadStateByUrl() {
							return F(e);
						},
						get emojiImageMetaByUrl() {
							return F(t);
						},
						get previewCollapseAction() {
							return z();
						},
						get previewCollapseEventId() {
							return B();
						},
						get previewContentId() {
							return re();
						},
						get textOverlay() {
							return le();
						},
						get contentClass() {
							return ae();
						},
						get collapsedContentClass() {
							return V();
						},
						get isCollapsed() {
							return ie();
						},
						get emojiSize() {
							return F(be).emojiSize;
						},
						get fontSize() {
							return F(be).fontSize;
						},
						get lineHeight() {
							return F(be).lineHeight;
						}
					});
				}
				w(t), f(e, t);
			};
			l(n, (e) => {
				F(J).hasRenderableText && e(r);
			});
			var i = b(n, 2);
			o(i, () => H() ?? a);
			var s = b(i, 2), c = (e) => {
				var t = ci();
				Hr(E(t), {
					get media() {
						return F(J).media;
					},
					get mediaLayout() {
						return F(J).mediaLayout;
					},
					get scrollRoot() {
						return ne();
					},
					get onImageOpen() {
						return se();
					}
				}), w(t), f(e, t);
			};
			l(s, (e) => {
				F(J).hasRenderableMedia && e(c);
			});
			var u = b(s, 2);
			o(u, () => ce() ?? a), f(e, t);
		};
		l(s, (e) => {
			F(J).contentWarning && !F(he) ? e(c) : e(u, -1);
		}), w(r), O(() => {
			R(r, 1, `post-content-preview post-content-preview-${x()}`, "svelte-13idcaf"), t(r, `--post-content-block-gap: ${F(be).gap}px;`);
		}), f(n, r);
	};
	l(xe, (e) => {
		(F(J).hasRenderableText || F(J).hasRenderableMedia || F(J).contentWarning || oe() || ce()) && e(Se);
	}), f(n, Y), te(), c();
}
h(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogPresentation.ts
function pi(e) {
	return e.isSearchMode ? e.totalCountKnown === !1 ? { key: e.totalCountStatus === "failed" ? "postHistory.countUnavailable" : "postHistory.countLoading" } : e.totalCount <= 0 ? null : {
		key: "postHistory.searchCountSummary",
		values: { total: e.totalCount }
	} : e.totalCountKnown ? {
		key: "postHistory.visibleCountSummary",
		values: { total: e.totalCount }
	} : e.totalCountStatus === "failed" ? { key: "postHistory.countUnavailable" } : { key: "postHistory.countLoading" };
}
function mi(e) {
	return e.direction === "older" ? e.isSearchMode ? "postHistory.loadOlderSearchResults" : "postHistory.loadOlder" : e.isSearchMode ? "postHistory.loadNewerSearchResults" : "postHistory.loadNewer";
}
function hi(e) {
	return e.status === "loading" ? { key: "postHistory.checkingReplies" } : e.status === "failed" ? { key: "postHistory.recheckReplies" } : e.status === "loaded" ? e.replyCount === 0 ? { key: "postHistory.recheckReplies" } : e.visible ? { key: "postHistory.hideReplies" } : {
		key: "postHistory.showRepliesWithCount",
		values: { count: e.replyCount }
	} : { key: "postHistory.checkReplies" };
}
function gi(e) {
	return e.visible ? { key: "postHistory.hideReactions" } : {
		key: "postHistory.showReactionsWithCount",
		values: { count: e.reactionCount }
	};
}
function _i(e) {
	return e === "+";
}
function vi(e) {
	let t = e.trim();
	return t ? Dt(t) ? t : Mt(t) : "+";
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryContextFetchService.ts
var yi = 5e3, bi = 8, xi = new class {
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
				a = p, i = new _t(Math.min(6e3, t.timeoutMs ?? yi), () => {
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
					let d = gt(), f = !1, h = () => {
						f || (f = !0, a === "base" ? s = !0 : l = !0, m());
					};
					try {
						let i = Ue(e, d, { on: { relays: c } }).subscribe({
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
				h(this.resolveRelayUrls(t.relayHints, t.relayConfig), "base"), t.authorHint && (this.lookupAuthorWriteRelaysFn ? this.lookupAuthorWriteRelaysFn(t.authorHint) : Ze(e).lookup(t.authorHint).then((e) => e.writeRelays)).then((e) => {
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
		let n = it(e, bi);
		if (n) return n;
		let r = t ? [...B.extractReadRelays(t), ...B.extractWriteRelays(t)] : [], i = B.sanitizeExternalRelayUrls([...e ?? [], ...r], { limit: bi });
		return i.length > 0 ? i : B.sanitizeExternalRelayUrls(z, { limit: bi });
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileRelayTiers.ts
function Si(e) {
	let t = at(), n = t ? [] : B.sanitizeExternalRelayUrls(ae), r = new Set(n), i = B.sanitizeExternalRelayUrls(e.contextualRelays).filter((e) => !r.has(e)).slice(0, t ? void 0 : e.contextualRelayLimit), a = new Set(i);
	return {
		bootstrap: n,
		contextual: i,
		fallback: t ? [] : B.sanitizeExternalRelayUrls([...z, ...e.fallbackRelays ?? []]).filter((e) => !r.has(e) && !a.has(e))
	};
}
function Ci(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = B.sanitizeExternalRelayUrls(t[r]);
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
var wi = 3e5, Ti = 18e5, Ei = 6e4, Di = 30, Oi = 4e3, ki = 12, Ai = 50, ji = 2, Mi = 600, Q = g({}), Ni = /* @__PURE__ */ new Map(), Pi = /* @__PURE__ */ new Map(), Fi = /* @__PURE__ */ new Map(), Ii = /* @__PURE__ */ new Map(), Li = [], Ri = null, zi = /* @__PURE__ */ new Map();
function Bi(e) {
	return !e.signal?.aborted;
}
async function Vi(e, t, n) {
	if (t.signal?.aborted) return null;
	let r = zi.get(e);
	(!r || r.abort.signal.aborted) && (r = {
		abort: new AbortController(),
		consumers: /* @__PURE__ */ new Set()
	}, zi.set(e, r));
	let i = {}, a = r;
	r.consumers.add(i);
	let o = () => {
		a.consumers.delete(i), a.consumers.size || a.abort.abort();
	};
	t.signal?.addEventListener("abort", o, { once: !0 });
	try {
		let i = ma(e, {
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
			t.signal?.removeEventListener("abort", o), o(), !a.consumers.size && zi.get(e) === a && zi.delete(e);
		};
		a.followup ? a.followup.then(n, n) : n();
	}
}
function $() {
	return Date.now();
}
function Hi() {
	return Math.floor($() / 1e3);
}
function Ui(e) {
	return e ? {
		name: e.name,
		displayName: e.displayName,
		picture: e.picture
	} : null;
}
function Wi(e = []) {
	return B.sanitizeExternalRelayUrls(e);
}
function Gi(e = []) {
	return Wi(e).slice(0, ki);
}
function Ki(e) {
	return e.flatMap((e) => {
		let t = [];
		for (let n = 0; n < e.pubkeys.length; n += Ai) t.push({
			relays: e.relays,
			pubkeys: e.pubkeys.slice(n, n + Ai)
		});
		return t;
	});
}
async function qi(e, t, n) {
	let r = Array(e.length), i = 0, a = Array.from({ length: Math.min(t, e.length) }, async () => {
		for (; i < e.length;) {
			let t = i;
			i += 1, r[t] = await n(e[t]);
		}
	});
	return await Promise.all(a), r;
}
function Ji(e, t) {
	return e.expireAtMs <= t;
}
function Yi(e, t) {
	return e.staleAtMs <= t;
}
function Xi(e, t) {
	return e.status === "negative" && !!e.negativeUntilMs && e.negativeUntilMs > t;
}
function Zi(e, t) {
	return typeof e.fetchedAt == "number" && Number.isFinite(e.fetchedAt) ? e.fetchedAt : t;
}
function Qi(e, t, n = !0) {
	if (S(Q, {
		...F(Q),
		[e]: t
	}), !n) return;
	let r = Ii.get(e);
	if (r && r.size !== 0) for (let e of r) e(t.profile);
}
function $i(e) {
	let t = $();
	Qi(e, {
		pubkey: e,
		status: "negative",
		profile: null,
		profileSummary: null,
		metadataRaw: null,
		fetchedAtMs: t,
		sourceEventCreatedAtSec: null,
		sourceEventId: null,
		staleAtMs: t + Ei,
		expireAtMs: t + Ei,
		negativeUntilMs: t + Ei,
		sourceRelay: null,
		lastValidatedAtMs: t,
		persistence: "persisted"
	});
}
function ea(e) {
	let t = $(), n = e.fetchedAtMs ?? t, r = {
		...e.profile,
		fetchedAt: e.profile.fetchedAt ?? n,
		updatedAtFromEvent: e.sourceEventCreatedAtSec ?? e.profile.updatedAtFromEvent
	};
	Qi(e.pubkey, {
		pubkey: e.pubkey,
		status: "hit",
		profile: r,
		profileSummary: Ui(r),
		metadataRaw: e.metadataRaw,
		fetchedAtMs: n,
		sourceEventCreatedAtSec: e.sourceEventCreatedAtSec,
		sourceEventId: e.sourceEventId ?? null,
		staleAtMs: e.persistence === "temporary" ? t : n + wi,
		expireAtMs: n + Ti,
		negativeUntilMs: null,
		sourceRelay: e.sourceRelay,
		lastValidatedAtMs: n,
		persistence: e.persistence ?? "persisted"
	}, e.notifySubscribers ?? !0);
}
function ta(e, t) {
	if (!e) return !1;
	let n = e.profileRelays ?? [], r = t.profileRelays ?? [];
	return e.name === t.name && e.displayName === t.displayName && e.picture === t.picture && e.npub === t.npub && e.nprofile === t.nprofile && n.length === r.length && n.every((e, t) => e === r[t]);
}
function na(e, t) {
	return F(Q)[e]?.profile ?? t.find((e) => e.existingSnapshot)?.existingSnapshot ?? null;
}
function ra(e, t) {
	let n = F(Q)[e];
	if (n?.profile) return n.profile;
	let r = Zi(t, $());
	return ea({
		pubkey: e,
		profile: t,
		metadataRaw: null,
		sourceEventCreatedAtSec: t.updatedAtFromEvent ?? null,
		sourceEventId: null,
		sourceRelay: null,
		fetchedAtMs: r
	}), F(Q)[e]?.profile ?? t;
}
function ia(e, t, n) {
	let r = t.acceptedProfile;
	if (!r) return null;
	let i = F(Q)[e], a = t.acceptedRecord, o = !!n.sourceEventId && n.sourceEventId === a?.sourceEventId, s = t.currentEventConfirmed || o, c = a?.fetchedAt ?? Zi(r, $()), l = {
		...r,
		fetchedAt: r.fetchedAt ?? c,
		updatedAtFromEvent: a?.updatedAtFromEvent ?? r.updatedAtFromEvent
	};
	return ea({
		pubkey: e,
		profile: l,
		metadataRaw: s ? n.metadataRaw : null,
		sourceEventCreatedAtSec: a?.updatedAtFromEvent ?? r.updatedAtFromEvent ?? null,
		sourceEventId: a?.sourceEventId ?? (s ? n.sourceEventId : null),
		sourceRelay: s ? n.sourceRelay : null,
		fetchedAtMs: c,
		persistence: "persisted",
		notifySubscribers: !ta(i?.profile ?? null, l)
	}), F(Q)[e]?.profile ?? r;
}
async function aa(e) {
	let t = F(Q)[e];
	if (t?.persistence !== "temporary" || !t.profile || !t.sourceEventId || t.sourceEventCreatedAtSec === null) return {
		profile: t?.profile ?? null,
		acceptedRecord: null,
		persistence: t?.persistence ?? null,
		dbError: !1
	};
	try {
		let n = Gi([...t.profile.profileRelays ?? [], ...t.sourceRelay ? [t.sourceRelay] : []]), r = await Bn.upsertCandidate(e, {
			pubkeyHex: e,
			profile: t.profile,
			sourceEventId: t.sourceEventId,
			updatedAtFromEvent: t.sourceEventCreatedAtSec,
			observedRelays: n,
			fetchedAt: t.fetchedAtMs
		});
		return r.acceptedProfile && r.acceptedRecord ? {
			profile: ia(e, r, t),
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
function oa(e, t) {
	let n = B.sanitizeExternalRelayUrls([...t.profile?.profileRelays ?? [], ...t.observedRelays]), r = {
		...t.profile,
		profileRelays: n.length > 0 ? n : void 0
	};
	return ea({
		pubkey: e,
		profile: r,
		metadataRaw: t.metadataRaw,
		sourceEventCreatedAtSec: t.sourceEventCreatedAtSec,
		sourceEventId: t.sourceEventId,
		sourceRelay: t.sourceRelay,
		persistence: "temporary"
	}), F(Q)[e]?.profile ?? r;
}
function sa(e, t, n = !0) {
	let r = F(Q)[e];
	if (!r) return;
	let i = $();
	Qi(e, {
		...r,
		status: t,
		lastValidatedAtMs: i
	}, n);
}
function ca() {
	let e = $(), t = Object.entries(F(Q)).filter(([, t]) => !Ji(t, e));
	t.length !== Object.keys(F(Q)).length && S(Q, Object.fromEntries(t));
}
function la(e) {
	try {
		let t = JSON.parse(e.content), n = e.relay ? [e.relay.endsWith("/") ? e.relay : `${e.relay}/`] : [], r = typeof t.picture == "string" ? t.picture : "", i = r ? ce(r, {
			forceRemote: !1,
			navigatorOnline: !0
		}) : "", a = {
			name: typeof t.name == "string" ? t.name : "",
			displayName: typeof t.display_name == "string" ? t.display_name : "",
			picture: i,
			npub: lt(e.pubkey),
			nprofile: ut(e.pubkey, n, e.writeRelays),
			profileRelays: n.length > 0 ? n : void 0
		};
		return a.fetchedAt = $(), a.updatedAtFromEvent = e.createdAtSec, a;
	} catch {
		return null;
	}
}
async function ua(e, t, n, r, i, a, o = [], s) {
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
		let u = gt(), d = !1, f = null, p = null, m = () => {
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
			let n = t <= Hi() + Mi;
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
			let t = ht(e, u, { on: { relays: n } }, {
				timeoutMs: i,
				deadlineAt: s,
				onEnd: (e) => {
					if (!e.complete) for (let e of c) l[e] = {
						...l[e],
						timedOut: !0
					};
				}
			});
			f = (typeof t.pipe == "function" ? t.pipe(Ge(y)) : t).subscribe({
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
					let a = la({
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
				until: Hi() + Mi,
				limit: Math.max(24, c.length * 4)
			}), u.over(), a?.(c);
		} catch {
			g(), m();
		}
	}), l;
}
async function da(e, t, n) {
	if (t.profile && t.sourceEventId !== null && t.sourceEventCreatedAtSec !== null) try {
		let r = await Bn.upsertCandidate(e, {
			pubkeyHex: e,
			profile: t.profile,
			sourceEventId: t.sourceEventId,
			updatedAtFromEvent: t.sourceEventCreatedAtSec,
			observedRelays: t.observedRelays,
			fetchedAt: Zi(t.profile, $())
		});
		if (!n.some(Bi)) return {
			profile: null,
			stopReason: "persistence-unavailable",
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: !0
		};
		let i = ia(e, r, t);
		return {
			profile: i,
			stopReason: r.currentEventConfirmed && i !== null ? "current-event-confirmed" : null,
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: t.networkError || t.timedOut
		};
	} catch {
		let r = na(e, n);
		return {
			profile: r ? ra(e, r) : oa(e, t),
			stopReason: "persistence-unavailable",
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: t.networkError || t.timedOut
		};
	}
	return {
		profile: na(e, n),
		stopReason: null,
		parseError: t.parseError,
		rejectedFutureTimestamp: t.rejectedFutureTimestamp,
		networkError: t.networkError,
		transientFailure: t.networkError || t.timedOut
	};
}
async function fa() {
	let e = Li.filter((e) => Bi(e) ? !0 : (e.resolve(null), !1));
	if (Li = [], Ri = null, e.length === 0) return;
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.rxNostr) ?? [];
		e.push(n), t.set(n.rxNostr, e);
	}
	for (let e of t.values()) {
		let t = /* @__PURE__ */ new Map(), n = {}, r = {}, i = {};
		for (let a of e) {
			let e = t.get(a.pubkey) ?? [];
			e.push(a), t.set(a.pubkey, e), r[a.pubkey] = Wi([...r[a.pubkey] ?? [], ...a.relays]), i[a.pubkey] = Gi([...i[a.pubkey] ?? [], ...a.fallbackRelays]);
			let o = /* @__PURE__ */ new Set([...n[a.pubkey] ?? [], ...a.writeRelays]);
			n[a.pubkey] = Array.from(o);
		}
		let a = (e) => (t.get(e) ?? []).some(Bi), o = Array.from(t.keys()), s = Object.fromEntries(o.map((e) => {
			let t = Si({
				contextualRelays: r[e] ?? [],
				fallbackRelays: i[e] ?? [],
				contextualRelayLimit: ki
			}), a = /* @__PURE__ */ new Set([...t.bootstrap, ...n[e] ?? []]);
			return t.contextual = t.contextual.filter((e) => !a.has(e)), t.fallback = t.fallback.filter((e) => !a.has(e)), [e, t];
		})), c = Si({
			contextualRelays: [],
			contextualRelayLimit: ki
		}), l = new Set(o), u = {}, d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = [
			"bootstrap",
			"contextual",
			"fallback"
		], g = $() + 6e3, _ = (e, t) => e === "bootstrap" ? Ci(t, Object.fromEntries(t.map((e) => [e, B.sanitizeExternalRelayUrls([...c.bootstrap, ...n[e] ?? []])]))) : Ci(t, Object.fromEntries(t.map((t) => [t, s[t][e]])));
		try {
			for (let r of h) {
				if ($() >= g) {
					for (let e of l) p.add(e);
					break;
				}
				let i = await qi(Ki(_(r, Array.from(l).filter(a))), ji, async (r) => {
					let i = r.pubkeys.filter((e) => a(e) && l.has(e));
					return i.length === 0 ? null : {
						activeTargets: i,
						results: await ua(e[0].rxNostr, i, r.relays, n, Oi, (e) => {
							for (let t of e) m.add(t);
						}, i.flatMap((e) => (t.get(e) ?? []).flatMap((e) => e.signal ? [e.signal] : [])), g)
					};
				});
				for (let e of i) if (e) for (let n of e.activeTargets) {
					if (!a(n)) {
						l.delete(n);
						continue;
					}
					let r = t.get(n) ?? [], i = await da(n, e.results[n], r);
					u[n] = i.profile, i.parseError && d.add(n), i.rejectedFutureTimestamp && f.add(n), i.transientFailure && p.add(n), i.stopReason !== null && l.delete(n);
				}
			}
			for (let e of l) {
				if (!a(e)) continue;
				let n = na(e, t.get(e) ?? []);
				d.has(e) ? sa(e, "parse-error") : f.has(e) ? sa(e, "invalid-future-ts") : !n && m.has(e) && !p.has(e) && $i(e), u[e] = n ? ra(e, n) : null;
			}
			for (let [e, n] of t.entries()) for (let t of n) t.resolve(Bi(t) ? u[e] ?? null : null);
		} catch {
			for (let [e, n] of t.entries()) {
				let t = na(e, n);
				for (let r of n) r.resolve(Bi(r) && t ? ra(e, t) : null);
			}
		}
	}
}
function pa(e, t, n, r, i, a, o) {
	return o?.aborted ? Promise.resolve(null) : new Promise((s, c) => {
		let l = () => {
			Li = Li.filter((e) => e.signal !== o), !Li.length && Ri && (clearTimeout(Ri), Ri = null), s(null);
		};
		o?.addEventListener("abort", l, { once: !0 }), Li.push({
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
		}), !Ri && (Ri = setTimeout(() => {
			fa();
		}, Di));
	});
}
async function ma(e, t, n = void 0) {
	if (t.signal?.aborted || !e || !t.rxNostr) return null;
	let r = Pi.get(e)?.signal?.aborted;
	r && Fi.delete(e);
	let i = r ? void 0 : Ni.get(e);
	if (i) {
		let n = Pi.get(e);
		if (n && t.rxNostr === n.rxNostr) {
			let r = new Set(Gi(n.writeRelays ?? []));
			if (Gi(t.writeRelays ?? []).filter((e) => !r.has(e)).length > 0) {
				let n = Fi.get(e) ?? {};
				Fi.set(e, {
					rxNostr: t.rxNostr,
					forceRefresh: !0,
					allowBackgroundRefresh: t.allowBackgroundRefresh,
					writeRelays: Wi([...n.writeRelays ?? [], ...t.writeRelays ?? []]),
					additionalRelays: Wi([...n.additionalRelays ?? [], ...t.additionalRelays ?? []]),
					fallbackRelays: Wi([...n.fallbackRelays ?? [], ...t.fallbackRelays ?? []])
				});
			}
		}
		return i;
	}
	let a = (async () => {
		let r = n;
		if (r === void 0) try {
			r = await Bn.get(e);
		} catch {
			r = null;
		}
		if (t.signal?.aborted) return null;
		let i = await aa(e);
		if (t.signal?.aborted) return null;
		let a = i.profile ?? F(Q)[e]?.profile ?? r, o = Wi([...t.additionalRelays ?? [], ...a?.profileRelays ?? []]);
		return pa(e, t.rxNostr, o, Gi(t.fallbackRelays ?? []), Gi(t.writeRelays ?? []), a, t.signal);
	})().finally(() => {
		if (Ni.get(e) !== a) return;
		Ni.delete(e), Pi.delete(e);
		let n = Fi.get(e);
		if (Fi.delete(e), ca(), !t.signal?.aborted && n?.rxNostr && (n.writeRelays?.length ?? 0) > 0) {
			let r = ma(e, {
				...n,
				signal: t.signal
			}), i = zi.get(e);
			i && i.abort.signal === t.signal && (i.followup = r);
		}
	});
	return Pi.set(e, t), Ni.set(e, a), a;
}
async function ha(e, t, n) {
	if (t.signal?.aborted) return null;
	let r = $(), i = F(Q)[e];
	if (!t.forceRefresh && i && !Ji(i, r)) {
		if (Xi(i, r)) return null;
		if (i.profile && i.persistence === "temporary") return t.allowBackgroundRefresh !== !1 && t.rxNostr && (Vi(e, t, n ? i.profile : void 0), sa(e, "stale", !1)), i.profile;
		if (i.profile && !Yi(i, r)) return i.profile;
		if (i.profile) return t.allowBackgroundRefresh !== !1 && t.rxNostr && (Vi(e, t, n ? i.profile : void 0), sa(e, "stale")), i.profile;
	}
	if (!t.forceRefresh && !n) {
		let n = await Bn.get(e);
		if (t.signal?.aborted) return null;
		if (n) {
			let i = Zi(n, r);
			ea({
				pubkey: e,
				profile: n,
				metadataRaw: null,
				sourceEventCreatedAtSec: n.updatedAtFromEvent ?? null,
				sourceRelay: null,
				fetchedAtMs: i
			});
			let a = F(Q)[e];
			return a && Yi(a, r) && t.allowBackgroundRefresh !== !1 && t.rxNostr && (Vi(e, t, n), sa(e, "stale")), n;
		}
	}
	return t.rxNostr ? await Vi(e, t, n ? F(Q)[e]?.profile ?? null : void 0) : null;
}
async function ga(e, t = {}) {
	return ha(e, t, !1);
}
async function _a(e) {
	return e ? ha(e, { allowBackgroundRefresh: !1 }, !1) : null;
}
async function va(e, t = {}) {
	if (t.signal?.aborted) return {};
	let n = Array.from(new Set(e.filter((e) => !!e)));
	if (n.length === 0) return {};
	if (!t.forceRefresh) {
		let e = $(), r = n.filter((t) => {
			let n = F(Q)[t];
			return !n || Ji(n, e);
		});
		if (r.length > 0) try {
			let n = await Bn.bulkGetRecords(r);
			if (t.signal?.aborted) return {};
			n.forEach((t, n) => {
				if (!t) return;
				let i = Mn(t);
				ea({
					pubkey: r[n],
					profile: i,
					metadataRaw: null,
					sourceEventCreatedAtSec: i.updatedAtFromEvent ?? null,
					sourceEventId: t.sourceEventId ?? null,
					sourceRelay: null,
					fetchedAtMs: Zi(i, e)
				});
			});
		} catch {}
	}
	let r = await Promise.all(n.map(async (e) => {
		let n = t.relayOptionsByPubkey?.[e];
		return [e, await ha(e, {
			rxNostr: t.rxNostr,
			additionalRelays: Wi([...n?.additionalRelays ?? [], ...t.additionalRelays ?? []]),
			fallbackRelays: Wi([...n?.fallbackRelays ?? [], ...t.fallbackRelays ?? []]),
			writeRelays: Wi([...n?.writeRelays ?? [], ...t.writeRelays ?? []]),
			forceRefresh: t.forceRefresh,
			allowBackgroundRefresh: t.allowBackgroundRefresh
		}, !t.forceRefresh)];
	}));
	return Object.fromEntries(r);
}
async function ya(e) {
	return va(e, { allowBackgroundRefresh: !1 });
}
function ba(e, t) {
	let n = Ii.get(e) ?? /* @__PURE__ */ new Set();
	n.add(t), Ii.set(e, n);
	let r = F(Q)[e];
	return r && t(r.profile), () => {
		let n = Ii.get(e);
		n && (n.delete(t), n.size === 0 && Ii.delete(e));
	};
}
function xa(e) {
	return F(Q)[e] ?? null;
}
function Sa(e, t) {
	let n = Array.from(new Set(e.filter((e) => !!e))).map((e) => ba(e, (n) => t(e, n)));
	return () => {
		for (let e of n) e();
	};
}
var Ca = {
	getProfile: ga,
	getProfiles: va,
	getCachedProfile: _a,
	getCachedProfiles: ya,
	getReactiveEntry: xa,
	subscribe: ba,
	subscribeProfiles: Sa
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/channelMetadataEventOrder.ts
function wa(e, t) {
	return e.createdAt === t.createdAt ? e.eventId === t.eventId ? 0 : e.eventId < t.eventId ? 1 : -1 : e.createdAt > t.createdAt ? 1 : -1;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/channelContextService.ts
function Ta(e, t) {
	let n = !!t && B.extractReadRelays(t).length > 0, r = B.sanitizeExternalRelayUrls(B.mergeRelayConfigs(e, ...n || at() ? [] : [z]), { limit: 8 });
	return {
		defaultReadRelays: n,
		...r.length > 0 ? { relays: r } : {}
	};
}
function Ea(e) {
	if (e == null || typeof e != "string") return;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function Da(e, t) {
	return e === void 0 ? t === void 0 ? null : t : e;
}
function Oa(e) {
	return {
		eventId: e.channelEventId,
		relayHints: [...e.relayHints],
		...e.channelRelays?.length ? { channelRelays: [...e.channelRelays] } : {},
		name: e.name,
		about: e.about,
		picture: e.picture
	};
}
function ka(e, t) {
	return !t || wa({
		createdAt: e.created_at,
		eventId: e.id
	}, {
		createdAt: t.created_at,
		eventId: t.id
	}) > 0;
}
var Aa = class {
	console;
	setTimeoutFn;
	clearTimeoutFn;
	createRxBackwardReqFn;
	constructor(e = {}) {
		this.console = e.console || (typeof console < "u" ? console : {
			log: () => {},
			warn: () => {},
			error: () => {}
		}), this.setTimeoutFn = e.setTimeoutFn || ((e, t) => setTimeout(e, t)), this.clearTimeoutFn = e.clearTimeoutFn || ((e) => clearTimeout(e)), this.createRxBackwardReqFn = e.createRxBackwardReqFn || gt;
	}
	async resolveChannelContext(e, t, n) {
		let r = B.sanitizeExternalRelayUrls(e.relayHints, { limit: B.EXTERNAL_INPUT_RELAY_LIMIT }), i = {
			...e,
			relayHints: r
		}, a = await this.resolveChannelMetadata(i, t, n);
		if (a.status === "resolved") return Oa(a.metadata);
		let o = a.status === "root-only" ? a.verifiedSourceRelays : [];
		return {
			eventId: e.eventId,
			relayHints: B.sanitizeExternalRelayUrls(B.mergeRelayConfigs(o, r), { limit: 8 }),
			name: null,
			about: null,
			picture: null
		};
	}
	resolveChannelMetadata(e, t, n, r = {}) {
		return this.resolveChannelMetadataWithRelayHintLimit(e, t, n, B.EXTERNAL_INPUT_RELAY_LIMIT, r);
	}
	resolveChannelMetadataWithInternalHints(e, t, n, r = {}) {
		return this.resolveChannelMetadataWithRelayHintLimit(e, t, n, 8, r);
	}
	resolveChannelMetadataWithRelayHintLimit(e, t, n, r, i) {
		let a = B.sanitizeExternalRelayUrls(e.relayHints, { limit: r });
		return this.resolveChannelMetadataInternal(e.eventId, a, t, n, i);
	}
	async resolveChannelMetadataInternal(e, t, n, r, i = {}) {
		let a = Date.now() + 6e3, o = await this.fetchEventById(e, t, n, r, Math.max(1, Math.min(5e3, a - Date.now())), i.signal);
		if (o.status === "aborted") return { status: "aborted" };
		if (o.status === "not-found") return {
			status: "failed",
			reason: "root-not-found"
		};
		if (o.status === "timeout") return {
			status: "failed",
			reason: "timeout"
		};
		if (o.status === "request-error") return {
			status: "failed",
			reason: "request-error",
			...o.cause === void 0 ? {} : { cause: o.cause }
		};
		if (o.event.kind !== 40) return {
			status: "failed",
			reason: "wrong-kind"
		};
		let s = o.event, c = this.parseChannelMetadataContent(s.content), l = c.metadata, u = B.sanitizeExternalRelayUrls(B.mergeRelayConfigs(o.relayUrl ? [o.relayUrl] : [], t, l.relays), { limit: 8 }), d = await this.fetchLatestMetadataEvent(e, s.pubkey, u, n, r, Math.max(1, Math.min(5e3, a - Date.now())), i.signal);
		if (d.status === "aborted") return { status: "aborted" };
		let f = d.status === "complete" ? "complete" : "incomplete", p = B.sanitizeExternalRelayUrls([...o.relayUrl ? [o.relayUrl] : [], ...d.relayUrls], { limit: 8 });
		if (!c.isValid && !d.event) return {
			status: "root-only",
			quality: "verified-root-only",
			reason: "invalid-root-content",
			metadataLookup: f,
			channelEventId: e,
			creatorPubkey: s.pubkey,
			createEventCreatedAt: s.created_at,
			verifiedSourceRelays: p
		};
		let m = d.metadata, h = B.sanitizeExternalRelayUrls(B.mergeRelayConfigs(m.relays, l.relays), { limit: 8 });
		return {
			status: "resolved",
			quality: "verified-metadata",
			metadataLookup: f,
			metadata: {
				channelEventId: e,
				relayHints: B.sanitizeExternalRelayUrls(B.mergeRelayConfigs(t, p), { limit: 8 }),
				...h.length > 0 ? { channelRelays: h } : {},
				name: Da(m.name, l.name),
				about: Da(m.about, l.about),
				picture: Da(m.picture, l.picture),
				creatorPubkey: s.pubkey,
				createEventCreatedAt: s.created_at,
				metadataEventId: d.event?.id ?? null,
				metadataCreatedAt: d.event?.created_at ?? null,
				verifiedSourceRelays: p
			}
		};
	}
	parseChannelMetadataContent(e) {
		try {
			let t = JSON.parse(e);
			if (!t || typeof t != "object" || Array.isArray(t)) return {
				metadata: { relays: [] },
				isValid: !1
			};
			let n = t;
			return {
				metadata: {
					name: Ea(n.name),
					about: Ea(n.about),
					picture: typeof n.picture == "string" ? Nt(n.picture) ?? void 0 : void 0,
					relays: B.sanitizeExternalRelayUrls(Array.isArray(n.relays) ? n.relays.filter((e) => typeof e == "string") : [], { limit: 8 })
				},
				isValid: !0
			};
		} catch {
			return {
				metadata: { relays: [] },
				isValid: !1
			};
		}
	}
	fetchEventById(e, t, n, r, i = 5e3, a) {
		return new Promise((o) => {
			let s = !1, c, l, u = () => {
				a?.removeEventListener("abort", f), c?.unsubscribe?.(), c = void 0;
			}, d = (e) => {
				s || (s = !0, u(), o(e));
			}, f = () => d({ status: "aborted" });
			if (a?.aborted) d({ status: "aborted" });
			else {
				a?.addEventListener("abort", f, { once: !0 });
				try {
					let o = this.createRxBackwardReqFn();
					if (c = ht(n, o, { on: Ta(t, r) }, {
						timeoutMs: i,
						quorum: !1,
						signal: a,
						setTimeoutFn: this.setTimeoutFn,
						clearTimeoutFn: this.clearTimeoutFn,
						onEnd: (e) => {
							l = e;
						}
					}).subscribe({
						next: (t) => {
							t.event?.id === e && d({
								status: "found",
								event: t.event,
								relayUrl: typeof t.from == "string" ? t.from : null
							});
						},
						complete: () => d({ status: l && !l.complete ? "timeout" : "not-found" }),
						error: (e) => {
							this.console.error("チャンネルイベント取得エラー:", e), d({
								status: "request-error",
								cause: e
							});
						}
					}), s) {
						c?.unsubscribe?.(), c = void 0;
						return;
					}
					o.emit({ ids: [e] }), o.over();
				} catch (e) {
					this.console.error("チャンネルイベントリクエスト作成エラー:", e), d({
						status: "request-error",
						cause: e
					});
				}
			}
		});
	}
	fetchLatestMetadataEvent(e, t, n, r, i, a = 5e3, o) {
		return new Promise((s) => {
			let c = !1, l, u, d = null, f = { relays: [] }, p = /* @__PURE__ */ new Set(), m = () => {
				o?.removeEventListener("abort", g), l?.unsubscribe?.(), l = void 0;
			}, h = (e, t) => {
				c || (c = !0, m(), s(e === "aborted" ? { status: "aborted" } : {
					status: e,
					event: d,
					relayUrls: Array.from(p),
					metadata: f,
					...t === void 0 ? {} : { cause: t }
				}));
			}, g = () => h("aborted");
			if (o?.aborted) h("aborted");
			else {
				o?.addEventListener("abort", g, { once: !0 });
				try {
					let s = this.createRxBackwardReqFn();
					if (l = ht(r, s, { on: Ta(n, i) }, {
						timeoutMs: a,
						quorum: !0,
						signal: o,
						setTimeoutFn: this.setTimeoutFn,
						clearTimeoutFn: this.clearTimeoutFn,
						onEnd: (e) => {
							u = e;
						}
					}).subscribe({
						next: (n) => {
							let r = n.event;
							if (!r || r.kind !== 41 || r.pubkey !== t || !r.tags.some((t) => t[0] === "e" && t[1] === e)) return;
							let i = this.parseChannelMetadataContent(r.content);
							i.isValid && (typeof n.from == "string" && p.add(n.from), ka(r, d) && (d = r, f = i.metadata));
						},
						complete: () => h(u && !u.complete ? "timeout" : "complete"),
						error: (e) => {
							this.console.error("チャンネル metadata 取得エラー:", e), h("request-error", e);
						}
					}), c) {
						l?.unsubscribe?.(), l = void 0;
						return;
					}
					let m = {
						kinds: [41],
						authors: [t],
						"#e": [e]
					};
					s.emit(m), s.over();
				} catch (e) {
					this.console.error("チャンネル metadata リクエスト作成エラー:", e), h("request-error", e);
				}
			}
		});
	}
};
function ja(e) {
	return typeof e == "number" && Number.isInteger(e) && e >= 2;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/channelMetadataRepository.ts
var Ma = 864e5;
function Na(e) {
	return ja(e.schemaVersion) ? e.resolutionQuality : "legacy-seed";
}
function Pa(e) {
	let t = e.lastResolutionAttemptAt === void 0 ? e.lastFetchFailedAt : void 0;
	return {
		channelEventId: e.channelEventId,
		name: e.name,
		about: e.about,
		picture: e.picture ? Nt(e.picture) : null,
		relays: [...e.relays],
		relayHints: [...e.relayHints],
		creatorPubkey: e.creatorPubkey,
		createEventCreatedAt: e.createEventCreatedAt,
		metadataEventId: e.metadataEventId,
		metadataCreatedAt: e.metadataCreatedAt,
		resolutionQuality: Na(e),
		verifiedRootAt: e.verifiedRootAt,
		verifiedMetadataAt: e.verifiedMetadataAt,
		lastResolutionAttemptAt: e.lastResolutionAttemptAt ?? t,
		lastResolutionAttemptStatus: e.lastResolutionAttemptStatus ?? (t === void 0 ? void 0 : "failed"),
		fetchedAt: e.fetchedAt,
		lastFetchFailedAt: e.lastFetchFailedAt
	};
}
function Fa(e, t) {
	return B.sanitizeExternalRelayUrls(e, { limit: t });
}
function Ia(e, ...t) {
	return Fa(B.mergeRelayConfigs(...t), e);
}
function La(e, t) {
	if (!e || Na(e) !== "verified-metadata") return !0;
	let n = e.metadataCreatedAt, r = t.metadataCreatedAt;
	return typeof r == "number" ? typeof n == "number" ? r === n ? t.metadataEventId ? !e.metadataEventId || wa({
		createdAt: r,
		eventId: t.metadataEventId
	}, {
		createdAt: n,
		eventId: e.metadataEventId
	}) >= 0 : !e.metadataEventId : r > n : !0 : typeof n != "number";
}
function Ra(e, t) {
	return !e || Na(e) !== "verified-metadata" ? !1 : t.metadataEventId || e.metadataEventId ? t.metadataEventId === e.metadataEventId && t.metadataCreatedAt === e.metadataCreatedAt : !0;
}
function za(e, t, n) {
	let r = t ? Na(t) : void 0, i = e.quality === "verified-metadata", a = i ? La(t, e) : !1, o = i ? Ra(t, e) : !1, s = r === "verified-metadata" && (!i || !a && !o), c = s || i ? "verified-metadata" : r === "legacy-seed" ? "legacy-seed" : "verified-root-only", l = r === "verified-root-only" || r === "verified-metadata", u = Fa(e.verifiedSourceRelays, 8), d = c === "legacy-seed" ? Ia(8, t?.relayHints ?? [], u) : Ia(8, l ? t?.relayHints ?? [] : [], u), f = i && (a || o), p = e.metadataLookup === "incomplete" || s;
	return {
		channelEventId: e.channelEventId,
		name: a && i ? e.name : t?.name ?? null,
		about: a && i ? e.about : t?.about ?? null,
		picture: a && i ? e.picture : t?.picture ?? null,
		relays: a && i ? Fa(e.relays, 8) : t?.relays ?? [],
		relayHints: d,
		creatorPubkey: e.creatorPubkey,
		createEventCreatedAt: e.createEventCreatedAt,
		...a && i && e.metadataEventId ? { metadataEventId: e.metadataEventId } : t?.metadataEventId ? { metadataEventId: t.metadataEventId } : {},
		...a && i && typeof e.metadataCreatedAt == "number" ? { metadataCreatedAt: e.metadataCreatedAt } : typeof t?.metadataCreatedAt == "number" ? { metadataCreatedAt: t.metadataCreatedAt } : {},
		resolutionQuality: c,
		verifiedRootAt: n,
		...f ? { verifiedMetadataAt: n } : typeof t?.verifiedMetadataAt == "number" ? { verifiedMetadataAt: t.verifiedMetadataAt } : {},
		lastResolutionAttemptAt: n,
		lastResolutionAttemptStatus: p ? "incomplete" : "complete",
		...typeof t?.fetchedAt == "number" ? { fetchedAt: t.fetchedAt } : {},
		updatedAt: n,
		schemaVersion: 2
	};
}
var Ba = new class {
	db;
	now;
	constructor(e = Y, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e) {
		if (!e) return null;
		let t = await this.db.channelMetadata.get(e);
		return t ? Pa(t) : null;
	}
	async getMany(e) {
		let t = Array.from(new Set(e.filter(Boolean)));
		return t.length === 0 ? [] : (await this.db.channelMetadata.bulkGet(t)).filter((e) => !!e).map(Pa);
	}
	async upsertResolvedChannel(e) {
		let t = !1, n = await this.db.transaction("rw", this.db.channelMetadata, async () => {
			let n = this.now(), r = await this.db.channelMetadata.get(e.channelEventId), i = za(e, r ?? void 0, n);
			return t = r?.name !== i.name || r?.about !== i.about, await this.db.channelMetadata.put(i), Pa(i);
		});
		return t && He(), n;
	}
	shouldRefresh(e, t = this.now()) {
		if (!e) return !0;
		let n = e.lastResolutionAttemptAt, r = e.lastResolutionAttemptStatus, i = typeof n == "number" && t - n < 9e5;
		return r === "failed" || r === "incomplete" || e.resolutionQuality !== "verified-metadata" ? !i : typeof e.verifiedMetadataAt != "number" || t - e.verifiedMetadataAt >= Ma;
	}
	async markFetchFailed(e, t = this.now()) {
		e && await this.db.transaction("rw", this.db.channelMetadata, async () => {
			let n = await this.db.channelMetadata.get(e);
			await this.db.channelMetadata.put({
				channelEventId: e,
				name: n?.name ?? null,
				about: n?.about ?? null,
				picture: n?.picture ?? null,
				relays: n?.relays ?? [],
				relayHints: n?.relayHints ?? [],
				...n?.creatorPubkey ? { creatorPubkey: n.creatorPubkey } : {},
				...typeof n?.createEventCreatedAt == "number" ? { createEventCreatedAt: n.createEventCreatedAt } : {},
				...n?.metadataEventId ? { metadataEventId: n.metadataEventId } : {},
				...typeof n?.metadataCreatedAt == "number" ? { metadataCreatedAt: n.metadataCreatedAt } : {},
				...n && Na(n) ? { resolutionQuality: Na(n) } : {},
				...typeof n?.verifiedRootAt == "number" ? { verifiedRootAt: n.verifiedRootAt } : {},
				...typeof n?.verifiedMetadataAt == "number" ? { verifiedMetadataAt: n.verifiedMetadataAt } : {},
				...typeof n?.fetchedAt == "number" ? { fetchedAt: n.fetchedAt } : {},
				lastResolutionAttemptAt: t,
				lastResolutionAttemptStatus: "failed",
				updatedAt: t,
				schemaVersion: 2
			});
		});
	}
}(), Va = console;
function Ha(e) {
	return B.sanitizeExternalRelayUrls(e, { limit: 8 });
}
function Ua(e) {
	return B.sanitizeExternalRelayUrls(e, { limit: 8 });
}
function Wa(...e) {
	return Ha(B.mergeRelayConfigs(...e));
}
function Ga(...e) {
	return Ua(B.mergeRelayConfigs(...e));
}
function Ka(e) {
	let t = Ua(e.channelRelays);
	return {
		eventId: e.eventId,
		relayHints: Ha(e.relayHints),
		...t.length > 0 ? { channelRelays: t } : {},
		name: e.name ?? null,
		about: e.about ?? null,
		picture: e.picture ?? null
	};
}
function qa(e, t) {
	if (!t) return e;
	let n = t.resolutionQuality === "verified-root-only" || t.resolutionQuality === "verified-metadata", r = t.resolutionQuality === "verified-metadata", i = r ? Ga(t.relays, e.channelRelays ?? []) : Ga(e.channelRelays ?? []);
	return {
		eventId: e.eventId,
		relayHints: Wa(e.relayHints, ...n ? [t.relayHints] : [], ...r ? [t.relays] : []),
		...i.length > 0 ? { channelRelays: i } : {},
		name: r ? t.name : e.name ?? t.name,
		about: r ? t.about : e.about ?? t.about,
		picture: r ? t.picture : e.picture ?? t.picture
	};
}
function Ja(e) {
	return e.status === "root-only" ? {
		channelEventId: e.channelEventId,
		quality: "verified-root-only",
		metadataLookup: e.metadataLookup,
		verifiedSourceRelays: e.verifiedSourceRelays,
		creatorPubkey: e.creatorPubkey,
		createEventCreatedAt: e.createEventCreatedAt
	} : {
		channelEventId: e.metadata.channelEventId,
		quality: "verified-metadata",
		metadataLookup: e.metadataLookup,
		name: e.metadata.name,
		about: e.metadata.about,
		picture: e.metadata.picture,
		relays: e.metadata.channelRelays,
		verifiedSourceRelays: e.metadata.verifiedSourceRelays,
		creatorPubkey: e.metadata.creatorPubkey,
		createEventCreatedAt: e.metadata.createEventCreatedAt,
		...e.metadata.metadataEventId ? { metadataEventId: e.metadata.metadataEventId } : {},
		...typeof e.metadata.metadataCreatedAt == "number" ? { metadataCreatedAt: e.metadata.metadataCreatedAt } : {}
	};
}
function Ya(e, t) {
	let n = new Set(t);
	return e.some((e) => !n.has(e));
}
function Xa(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
function Za(e, t, n) {
	return !!e && (e.lastResolutionAttemptStatus === "failed" || e.lastResolutionAttemptStatus === "incomplete") && Ya(t, n);
}
var Qa = new class {
	service;
	repository;
	logger;
	inFlightByRxNostr = /* @__PURE__ */ new WeakMap();
	lastAttemptHintsByRxNostr = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.service = e.service ?? new Aa(), this.repository = e.repository ?? Ba, this.logger = e.logger ?? Va;
	}
	resolveInternal(e, t, n) {
		let r = {
			...e,
			relayHints: Ha(e.relayHints),
			...e.channelRelays ? { channelRelays: Ua(e.channelRelays) } : {}
		}, i = Ka(r), a = {
			context: i,
			cache: null,
			source: "seed"
		}, o = !1, s = null, c = this.repository.get(r.eventId).then((e) => ({
			context: qa(i, e),
			cache: e,
			source: e ? "cache" : "seed"
		})).catch((e) => (this.logger.error("チャンネルキャッシュの読み込みに失敗しました:", e), a));
		return {
			initial: a,
			cacheReady: c,
			refresh: c.then(async (e) => {
				if (o || !t) return {
					status: "skipped",
					snapshot: e
				};
				let a = this.getLastAttemptHints(t, r.eventId);
				if (!(this.repository.shouldRefresh(e.cache) || Za(e.cache, r.relayHints, a))) return {
					status: "skipped",
					snapshot: e
				};
				let c = {
					...r,
					relayHints: e.context.relayHints
				}, l = this.acquireSharedResolution(c, t, n);
				s = l.release;
				try {
					let t = await l.promise;
					if (o || t.status === "aborted") return {
						status: "aborted",
						snapshot: e
					};
					let n = {
						context: qa(i, t.cache),
						cache: t.cache,
						source: t.status === "updated" || t.didPersistVerifiedResult ? "network" : e.source
					};
					return t.status === "updated" ? {
						status: "updated",
						snapshot: n
					} : {
						status: "failed",
						snapshot: n
					};
				} finally {
					s?.(), s = null;
				}
			}).catch((e) => (this.logger.error("チャンネルのバックグラウンド解決に失敗しました:", e), {
				status: "failed",
				snapshot: a
			})),
			release: () => {
				o || (o = !0, s?.(), s = null);
			}
		};
	}
	acquireSharedResolution(e, t, n) {
		let r = this.inFlightByRxNostr.get(t);
		r || (r = /* @__PURE__ */ new Map(), this.inFlightByRxNostr.set(t, r));
		let i = r.get(e.eventId);
		if (i?.abortController.signal.aborted && (r.get(e.eventId) === i && r.delete(e.eventId), i = void 0), i) {
			let t = Wa(i.relayHints, e.relayHints);
			Xa(i.relayHints, t) || (i.relayHints = t, i.hintRevision += 1);
		} else {
			let a = {
				eventId: e.eventId,
				rxNostr: t,
				relayConfig: n,
				relayHints: [...e.relayHints],
				hintRevision: 0,
				consumers: /* @__PURE__ */ new Set(),
				abortController: new AbortController(),
				promise: Promise.resolve({
					status: "aborted",
					cache: null
				})
			};
			a.promise = Promise.resolve().then(() => this.executeSharedResolution(a)).finally(() => {
				r?.get(a.eventId) === a && r.delete(a.eventId);
			}), i = a, r.set(e.eventId, i);
		}
		let a = Symbol(e.eventId);
		i.consumers.add(a);
		let o = !1;
		return {
			promise: i.promise,
			release: () => {
				o || (o = !0, i?.consumers.delete(a), i && i.consumers.size === 0 && i.abortController.abort());
			}
		};
	}
	async executeSharedResolution(e) {
		let t = !1, n = null;
		for (; !e.abortController.signal.aborted;) {
			let r = [...e.relayHints], i = e.hintRevision;
			this.setLastAttemptHints(e.rxNostr, e.eventId, r);
			let a;
			try {
				a = await this.service.resolveChannelMetadataWithInternalHints({
					eventId: e.eventId,
					relayHints: r
				}, e.rxNostr, e.relayConfig, { signal: e.abortController.signal });
			} catch (a) {
				if (e.abortController.signal.aborted) return {
					status: "aborted",
					cache: null
				};
				this.logger.error("共有チャンネル解決に失敗しました:", a), await this.markFetchFailedSafely(e.eventId);
				let o = await this.getCacheSafely(e.eventId) ?? n;
				if (!e.abortController.signal.aborted && this.hasNewHintsSinceAttempt(e, i, r)) continue;
				return {
					status: "failed",
					cache: o,
					...t ? { didPersistVerifiedResult: !0 } : {}
				};
			}
			if (a.status === "aborted" || e.abortController.signal.aborted) return {
				status: "aborted",
				cache: null
			};
			if (a.status === "failed") {
				await this.markFetchFailedSafely(e.eventId);
				let a = await this.getCacheSafely(e.eventId) ?? n;
				if (!e.abortController.signal.aborted && this.hasNewHintsSinceAttempt(e, i, r)) continue;
				return {
					status: "failed",
					cache: a,
					...t ? { didPersistVerifiedResult: !0 } : {}
				};
			}
			let o;
			try {
				o = await this.repository.upsertResolvedChannel(Ja(a));
			} catch (r) {
				return e.abortController.signal.aborted ? {
					status: "aborted",
					cache: null
				} : (this.logger.error("共有チャンネル解決に失敗しました:", r), await this.markFetchFailedSafely(e.eventId), {
					status: "failed",
					cache: await this.getCacheSafely(e.eventId) ?? n,
					...t ? { didPersistVerifiedResult: !0 } : {}
				});
			}
			if (t = !0, n = o, e.abortController.signal.aborted) return {
				status: "aborted",
				cache: null
			};
			if (!(a.metadataLookup === "incomplete" && this.hasNewHintsSinceAttempt(e, i, r))) return {
				status: "updated",
				cache: o
			};
		}
		return {
			status: "aborted",
			cache: null
		};
	}
	hasNewHintsSinceAttempt(e, t, n) {
		return e.hintRevision > t && Ya(e.relayHints, n);
	}
	getLastAttemptHints(e, t) {
		return this.lastAttemptHintsByRxNostr.get(e)?.get(t) ?? [];
	}
	setLastAttemptHints(e, t, n) {
		let r = this.lastAttemptHintsByRxNostr.get(e);
		r || (r = /* @__PURE__ */ new Map(), this.lastAttemptHintsByRxNostr.set(e, r)), r.set(t, [...n]);
	}
	async markFetchFailedSafely(e) {
		try {
			await this.repository.markFetchFailed(e);
		} catch (e) {
			this.logger.error("チャンネル取得失敗の記録に失敗しました:", e);
		}
	}
	async getCacheSafely(e) {
		try {
			return await this.repository.get(e);
		} catch (e) {
			return this.logger.error("チャンネルキャッシュの再読み込みに失敗しました:", e), null;
		}
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDirectReplyRelationUtils.ts
function $a(e) {
	return e === 1 || e === 42 || e === 1111;
}
function eo(e) {
	if (!$a(e.event.kind) || !e.event.id) return null;
	let t = se(e.event);
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
function to(e) {
	if (!$a(e.child.kind)) return {
		valid: !1,
		reason: "unsupported-child-kind"
	};
	if (e.child.id === e.parent.eventId) return {
		valid: !1,
		reason: "self-reference"
	};
	let t = se(e.child);
	if (!H(t)) return {
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
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDeletionFetchService.ts
var no = 4e3, ro = 8;
function io(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (!n.event?.id || !n.event.pubkey) continue;
		let e = t.get(n.event.pubkey) ?? /* @__PURE__ */ new Set();
		e.add(n.event.id), t.set(n.event.pubkey, e);
	}
	return new Map(Array.from(t.entries()).map(([e, t]) => [e, Array.from(t)]));
}
function ao(e) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls).sort((e, t) => e.localeCompare(t))
	})).sort((e, t) => e.event.created_at === t.event.created_at ? e.event.id.localeCompare(t.event.id) : e.event.created_at - t.event.created_at);
}
var oo = new class {
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
		let n = io(t.targets), r = this.resolveRelayUrls(t), i = /* @__PURE__ */ new Map(), a = t.requireRelayEose ? `related-deletion-${Date.now()}-${Math.random().toString(36).slice(2)}` : void 0, o, s = !1, c, l, u = () => {
			c?.unsubscribe?.(), c = void 0;
		}, d = (e) => ({
			status: e,
			events: ao(i),
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
					let l = gt(a);
					if (c = ht(e, l, { on: r.length > 0 ? { relays: r } : { defaultReadRelays: !0 } }, {
						operation: t.operation,
						deadlineAt: t.deadlineAt,
						quorum: !1,
						timeoutMs: t.timeoutMs ?? no,
						source: (t, n) => Ue(e, t, n),
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
		let r = B.sanitizeExternalRelayUrls(typeof t.from == "string" ? [t.from] : [], { limit: 1 })[0], i = e.get(n.id);
		i ? V(i.event, n) ? r && i.relayUrls.add(r) : this.console.warn("post_history_deletion_fetch_packet_conflict", n.id) : e.set(n.id, {
			event: n,
			relayUrls: new Set(r ? [r] : [])
		});
	}
	resolveRelayUrls(e) {
		let t = e.targets.flatMap((e) => e.relayUrls ?? []), n = it([...t, ...e.relayHints ?? []], ro);
		if (n) return n;
		let r = e.relayConfig ? [...B.extractReadRelays(e.relayConfig), ...B.extractWriteRelays(e.relayConfig)] : [], i = B.sanitizeExternalRelayUrls([
			...t,
			...e.relayHints ?? [],
			...r
		], { limit: ro });
		return i.length > 0 ? i : B.sanitizeExternalRelayUrls(z, { limit: ro });
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryChildInteractionsAdapter.ts
function so(e) {
	return e.sort((e, t) => e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) : e.createdAt - t.createdAt);
}
function co(e, t, n) {
	let r = Array.from(new Set(t.filter((e) => !!e))), i = new Map(r.map((e) => [e, []]));
	for (let t of e) n(t) && i.get(t.parentEventId)?.push(t);
	return r.flatMap((e) => so(i.get(e) ?? []));
}
var lo = class {
	repository;
	constructor(e = qe) {
		this.repository = e;
	}
	async getReactionRecords(e, t) {
		return (await (t ? this.repository.getChildInteractions(e, t) : this.repository.getChildInteractions(e))).filter((e) => e.kind === 7);
	}
	async getReactionRecordsForParents(e, t) {
		let n = Array.from(new Set(e.filter((e) => !!e)));
		return co(this.repository.getChildInteractionsForParents ? await (t ? this.repository.getChildInteractionsForParents(n, t) : this.repository.getChildInteractionsForParents(n)) : (await Promise.all(n.map((e) => this.getReactionRecords(e, t?.find((t) => t.eventId === e))))).flat(), n, (e) => e.kind === 7);
	}
}, uo = class {
	repository;
	constructor(e = qe) {
		this.repository = e;
	}
	async getDirectReplyRecords(e) {
		return this.repository.getDirectReplyInteractions(e);
	}
	async getDirectReplyRecordsForParents(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return co(this.repository.getChildInteractionsForParents ? await this.repository.getChildInteractionsForParents(t) : (await Promise.all(t.map((e) => this.getDirectReplyRecords(e)))).flat(), t, (e) => e.kind === 1 || e.kind === 42 || e.kind === 1111);
	}
}, fo = class {
	repository;
	constructor(e = qe) {
		this.repository = e;
	}
	async getRelatedEventRecords(e) {
		return this.repository.getChildInteractions(e);
	}
	async getDirectReplyRecords(e) {
		return this.repository.getDirectReplyInteractions(e);
	}
}, po = new lo(), mo = new uo();
new fo();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryReactionDeletionCleanupService.ts
var ho = {
	status: "completed",
	checkedParentEventIds: [],
	deletedReactionEventIds: [],
	deletionConfirmationIncomplete: !1
};
function go(e) {
	return Array.from(new Set(e.filter((e) => !!e)));
}
function _o(e) {
	return {
		id: e.eventId,
		pubkey: e.authorPubkey,
		created_at: e.createdAt,
		kind: e.kind,
		tags: e.tags.map((e) => [...e]),
		content: e.content,
		sig: ""
	};
}
function vo(e, t) {
	return go(e.filter((e) => t.get(e.targetEvent.pubkey)?.has(e.targetEvent.id)).map((e) => e.record.eventId));
}
var yo = new class {
	reactionRecordsAdapter;
	deletionFetchService;
	deletionRequestsRepository;
	childInteractionsRepository;
	constructor(e = {}) {
		this.reactionRecordsAdapter = e.reactionRecordsAdapter ?? po, this.deletionFetchService = e.deletionFetchService ?? oo, this.deletionRequestsRepository = e.deletionRequestsRepository ?? cn, this.childInteractionsRepository = e.childInteractionsRepository ?? qe;
	}
	async cleanupReactionDeletions(e, t) {
		let n = () => t.isActive?.() !== !1, r = go(t.parentEventIds), i = go(t.reactionEventIds ?? []);
		if (r.length === 0) return ho;
		let a = await this.loadReactionItems(r, i);
		if (!n()) return {
			...ho,
			status: "cancelled",
			checkedParentEventIds: r
		};
		let o = await this.filterKnownDeletedReactions(a);
		if (!n()) return {
			status: "cancelled",
			checkedParentEventIds: r,
			deletedReactionEventIds: o.deletedReactionEventIds,
			deletionConfirmationIncomplete: !1
		};
		if (o.visibleItems.length === 0) return {
			status: "completed",
			checkedParentEventIds: r,
			deletedReactionEventIds: o.deletedReactionEventIds,
			deletionConfirmationIncomplete: !1
		};
		let s = await this.deletionFetchService.fetchDeletionRequests(e, {
			targets: o.visibleItems.map((e) => ({
				event: e.targetEvent,
				relayUrls: e.record.relayUrls
			})),
			relayConfig: t.relayConfig
		}).promise;
		if (!n() || s.status === "cancelled" || (s.events.length > 0 && await this.deletionRequestsRepository.upsertValidDeletionRequests({
			targetEvents: o.visibleItems.map((e) => e.targetEvent),
			deletionEvents: s.events,
			fetchedAt: s.fetchedAt
		}), !n())) return {
			status: "cancelled",
			checkedParentEventIds: r,
			deletedReactionEventIds: o.deletedReactionEventIds,
			deletionConfirmationIncomplete: s.status !== "success"
		};
		let c = await this.filterKnownDeletedReactions(o.visibleItems), l = go([...o.deletedReactionEventIds, ...c.deletedReactionEventIds]), u = s.status !== "success";
		return {
			status: u ? "partial" : "completed",
			checkedParentEventIds: r,
			deletedReactionEventIds: l,
			deletionConfirmationIncomplete: u
		};
	}
	async loadReactionItems(e, t) {
		let n = [], r = t.length > 0 ? new Set(t) : null;
		for (let t of e) {
			let e = await this.reactionRecordsAdapter.getReactionRecords(t);
			for (let i of e) (!r || r.has(i.eventId)) && n.push({
				parentEventId: t,
				record: i,
				targetEvent: _o(i)
			});
		}
		return n;
	}
	async filterKnownDeletedReactions(e) {
		if (e.length === 0) return {
			visibleItems: [],
			deletedReactionEventIds: []
		};
		let t = vo(e, await this.deletionRequestsRepository.getDeletedTargets(e.map((e) => ({
			targetAuthorPubkey: e.targetEvent.pubkey,
			targetEventId: e.targetEvent.id
		}))));
		await this.purgeDeletedReactionCache(t);
		let n = new Set(t);
		return {
			visibleItems: e.filter((e) => !n.has(e.record.eventId)),
			deletedReactionEventIds: t
		};
	}
	async purgeDeletedReactionCache(e) {
		for (let t of go(e)) await this.childInteractionsRepository.deleteChildInteractionByEventId(t);
	}
}(), bo = /* @__PURE__ */ new Set();
function xo(e) {
	return bo.has(e);
}
function So(e) {
	for (let t of e) t && bo.add(t);
}
function Co(e) {
	for (let t of e) bo.delete(t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryReactionDeletionConsistencyService.ts
function wo(e) {
	return Array.from(new Set(e.filter((e) => !!e)));
}
function To(e) {
	return Array.from(new Set(e.filter((e) => !!e)));
}
function Eo(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) n.set(r, new Map((t.get(r) ?? []).map((e) => [e.eventId, e])));
	return n;
}
function Do(e, t) {
	return {
		requestKey: e.requestKey,
		parentEventId: e.parentEventId,
		reactionEventId: e.reactionEventId,
		reactionAuthorPubkey: e.reactionAuthorPubkey,
		source: t.source,
		status: "failed",
		attemptCount: t.attemptCount
	};
}
var Oo = new class {
	reactionRecordsAdapter;
	deletionRequestsRepository;
	childInteractionsRepository;
	constructor(e = {}) {
		this.reactionRecordsAdapter = e.reactionRecordsAdapter ?? po, this.deletionRequestsRepository = e.deletionRequestsRepository ?? cn, this.childInteractionsRepository = e.childInteractionsRepository ?? qe;
	}
	async verifyConsistency(e) {
		let t = () => e.isActive?.() !== !1, n = Array.from(new Map(e.candidates.map((e) => [e.requestKey, e])).values());
		if (n.length === 0) return {
			deletedReactionEventIds: [],
			correctedRequestKeys: [],
			resolvedRequestKeys: [],
			statePatches: []
		};
		let r = wo(n.map((e) => e.parentEventId)), i = /* @__PURE__ */ new Map();
		for (let e of r) i.set(e, await this.reactionRecordsAdapter.getReactionRecords(e));
		if (!t()) return {
			deletedReactionEventIds: [],
			correctedRequestKeys: [],
			resolvedRequestKeys: [],
			statePatches: []
		};
		let a = Eo(r, i), o = await this.deletionRequestsRepository.getDeletedTargets(n.map((e) => ({
			targetAuthorPubkey: e.reactionAuthorPubkey,
			targetEventId: e.reactionEventId
		}))), s = [], c = [], l = [], u = [];
		for (let t of n) {
			let n = e.statesByRequestKey.get(t.requestKey);
			if (!n) continue;
			let r = (a.get(t.parentEventId) ?? /* @__PURE__ */ new Map()).has(t.reactionEventId), i = o.get(t.reactionAuthorPubkey)?.has(t.reactionEventId) ?? !1, d = r;
			if (i && r && (await this.childInteractionsRepository.deleteChildInteractionByEventId(t.reactionEventId), d = !1, c.push(t.requestKey), s.push(t.reactionEventId)), i || !d || n.status === "success") {
				l.push(t.requestKey);
				continue;
			}
			let f = xo(t.requestKey);
			e.deletionConfirmationIncomplete !== !0 && (n.status !== "pending" && n.status !== "processing" || f) ? l.push(t.requestKey) : n.status !== "failed" && u.push(Do(t, n));
		}
		return {
			deletedReactionEventIds: wo(s),
			correctedRequestKeys: To(c),
			resolvedRequestKeys: To(l),
			statePatches: u
		};
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelationLifecycleTypes.ts
function ko(e, t, n) {
	return `${e}:${t}:${n}`;
}
function Ao(e, t, n) {
	let [r, i, a] = e.split(":"), o = Number.parseInt(a ?? "", 10);
	return !r || !i || o !== t ? null : {
		requestKey: e,
		parentEventId: r,
		targetEventId: i,
		kind: o,
		relationKind: n
	};
}
var jo = "reaction";
function Mo(e, t, n = 7) {
	return ko(e, t, n);
}
function No(e) {
	let t = Ao(e, 7, jo);
	return t ? {
		requestKey: t.requestKey,
		parentEventId: t.parentEventId,
		reactionEventId: t.targetEventId,
		kind: 7
	} : null;
}
function Po(e, t = Date.now()) {
	return e.status === "failed" && e.attemptCount < 3 && t - e.updatedAt >= 5e3;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelationLifecycleHelpers.ts
function Fo(e) {
	return Array.from(new Set(e.filter((e) => !!e)));
}
function Io(e) {
	return Array.from(new Set(e.map((e) => e.requestKey)));
}
function Lo(e) {
	return new Map(e.map((e) => [e.requestKey, e]));
}
function Ro({ candidates: e, existingStateByRequestKey: t, hasInFlightRequest: n, isFailedState: r, canRetryFailedState: i }) {
	let a = [], o = [];
	for (let s of e) {
		let e = t.get(s.requestKey), c = !!e && r(e) && !i(e);
		n(s.requestKey) || c ? o.push(s) : a.push(s);
	}
	return {
		admittedCandidates: a,
		skippedCandidates: o
	};
}
async function zo({ records: e, toCandidate: t, verifyConsistency: n, saveMany: r, deleteMany: i }) {
	if (e.length === 0) return e;
	let a = await n({
		candidates: e.map((e) => t(e)),
		statesByRequestKey: Lo(e)
	}), o = a.resolvedRequestKeys ?? [];
	if (a.statePatches.length === 0) {
		if (o.length === 0) return e;
		await i(o);
		let t = new Set(o);
		return e.filter((e) => !t.has(e.requestKey));
	}
	let s = await r(a.statePatches);
	o.length > 0 && await i(o);
	let c = Lo(s), l = new Set(o);
	return e.flatMap((e) => l.has(e.requestKey) ? [] : [c.get(e.requestKey) ?? e]);
}
function Bo(e) {
	return e === "dialog-inbound-save" || e === "dialog-inbound-sync" || e === "inbound-realtime" || e === "listing-current-view" || e === "listing-older-reveal" || e === "related-card-display" || e === "composer-target-display";
}
function Vo(e) {
	return e === "pending" || e === "processing" || e === "success" || e === "failed";
}
function Ho(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.requestKey == "string" && typeof t.parentEventId == "string" && typeof t.reactionEventId == "string" && typeof t.reactionAuthorPubkey == "string" && t.kind === 7 && Bo(t.source) && Vo(t.status) && typeof t.attemptCount == "number" && typeof t.schemaVersion == "number";
}
function Uo(e) {
	return {
		requestKey: e.requestKey,
		parentEventId: e.parentEventId,
		reactionEventId: e.reactionEventId,
		reactionAuthorPubkey: "",
		kind: 7,
		source: "listing-current-view",
		status: "pending",
		attemptCount: 0,
		schemaVersion: 1
	};
}
function Wo(e) {
	return !e || !Ho(e.value) ? null : {
		...e.value,
		updatedAt: e.updatedAt
	};
}
function Go(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.requestKey);
		(!e || e.updatedAt < n.updatedAt) && t.set(n.requestKey, n);
	}
	return Array.from(t.values()).sort((e, t) => e.updatedAt === t.updatedAt ? e.requestKey.localeCompare(t.requestKey) : e.updatedAt - t.updatedAt);
}
var Ko = new class {
	db;
	now;
	constructor(e = Y, t = Date.now) {
		this.db = e, this.now = t;
	}
	async getMany(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return t.length === 0 ? [] : Go((await this.db.postHistoryReactionDeletionAttempts.bulkGet(t)).map((e) => Wo(e)).filter((e) => !!e));
	}
	async getForParentEventIds(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return t.length === 0 ? [] : Go((await this.db.postHistoryReactionDeletionAttempts.where("parentEventId").anyOf(t).toArray()).map((e) => Wo(e)).filter((e) => !!e));
	}
	async deleteMany(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		t.length !== 0 && await this.db.postHistoryReactionDeletionAttempts.bulkDelete(t);
	}
	async saveMany(e) {
		let t = Array.from(new Map(e.filter((e) => e.requestKey && e.parentEventId && e.reactionEventId).map((e) => [e.requestKey, e])).values());
		if (t.length === 0) return [];
		let n = this.now(), r = await this.db.postHistoryReactionDeletionAttempts.bulkGet(t.map((e) => e.requestKey)), i = /* @__PURE__ */ new Map();
		r.forEach((e) => {
			let t = Wo(e);
			t && i.set(t.requestKey, t);
		});
		let a = t.map((e) => {
			let t = i.get(e.requestKey), r = {
				...t ? {
					requestKey: t.requestKey,
					parentEventId: t.parentEventId,
					reactionEventId: t.reactionEventId,
					reactionAuthorPubkey: t.reactionAuthorPubkey,
					kind: t.kind,
					source: t.source,
					status: t.status,
					attemptCount: t.attemptCount,
					schemaVersion: t.schemaVersion
				} : Uo(e),
				requestKey: e.requestKey,
				parentEventId: e.parentEventId,
				reactionEventId: e.reactionEventId,
				...e.reactionAuthorPubkey === void 0 ? {} : { reactionAuthorPubkey: e.reactionAuthorPubkey },
				...e.source === void 0 ? {} : { source: e.source },
				...e.status === void 0 ? {} : { status: e.status },
				...e.attemptCount === void 0 ? {} : { attemptCount: e.attemptCount },
				schemaVersion: 1
			};
			return {
				id: e.requestKey,
				parentEventId: e.parentEventId,
				value: r,
				updatedAt: n
			};
		});
		return await this.db.transaction("rw", this.db.postHistoryReactionDeletionAttempts, async () => {
			await this.db.postHistoryReactionDeletionAttempts.bulkPut(a);
		}), a.map((e) => ({
			...e.value,
			updatedAt: n
		}));
	}
}(), qo = k({});
function Jo(e) {
	for (let [t, n] of Object.entries(e)) t && (n === void 0 ? delete qo[t] : qo[t] = n);
}
function Yo() {
	for (let e of Object.keys(qo)) delete qo[e];
}
function Xo(e) {
	Yo(), Jo(e);
}
var Zo = "reply";
function Qo(e, t, n = 1) {
	return ko(e, t, n);
}
function $o(e) {
	let t = [
		1,
		42,
		1111
	].map((t) => Ao(e, t, Zo)).find((e) => e !== null) ?? null;
	return t ? {
		requestKey: t.requestKey,
		parentEventId: t.parentEventId,
		replyEventId: t.targetEventId,
		kind: t.kind
	} : null;
}
function es(e, t = Date.now()) {
	return e.status === "failed" && e.attemptCount < 3 && t - e.updatedAt >= 5e3;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDirectReplyLifecycleState.ts
var ts = /* @__PURE__ */ new Set();
function ns(e) {
	return ts.has(e);
}
function rs(e) {
	for (let t of e) t && ts.add(t);
}
function is(e) {
	for (let t of e) ts.delete(t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDirectReplyDeletionConsistencyService.ts
function as(e) {
	return Array.from(new Set(e.filter((e) => !!e)));
}
function os(e) {
	return Array.from(new Set(e.filter((e) => !!e)));
}
function ss(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) n.set(r, new Map((t.get(r) ?? []).map((e) => [e.eventId, e])));
	return n;
}
function cs(e, t) {
	return {
		requestKey: e.requestKey,
		parentEventId: e.parentEventId,
		replyEventId: e.replyEventId,
		replyAuthorPubkey: e.replyAuthorPubkey,
		source: t.source,
		status: "failed",
		attemptCount: t.attemptCount
	};
}
var ls = new class {
	directReplyRecordsAdapter;
	deletionRequestsRepository;
	childInteractionsRepository;
	constructor(e = {}) {
		this.directReplyRecordsAdapter = e.directReplyRecordsAdapter ?? mo, this.deletionRequestsRepository = e.deletionRequestsRepository ?? cn, this.childInteractionsRepository = e.childInteractionsRepository ?? qe;
	}
	async verifyConsistency(e) {
		let t = () => e.isActive?.() !== !1, n = Array.from(new Map(e.candidates.map((e) => [e.requestKey, e])).values());
		if (n.length === 0) return {
			deletedReplyEventIds: [],
			correctedRequestKeys: [],
			resolvedRequestKeys: [],
			statePatches: []
		};
		let r = as(n.map((e) => e.parentEventId)), i = /* @__PURE__ */ new Map();
		for (let e of r) i.set(e, await this.directReplyRecordsAdapter.getDirectReplyRecords(e));
		if (!t()) return {
			deletedReplyEventIds: [],
			correctedRequestKeys: [],
			resolvedRequestKeys: [],
			statePatches: []
		};
		let a = ss(r, i), o = await this.deletionRequestsRepository.getDeletedTargets(n.map((e) => ({
			targetAuthorPubkey: e.replyAuthorPubkey,
			targetEventId: e.replyEventId
		}))), s = [], c = [], l = [], u = [];
		for (let t of n) {
			let n = e.statesByRequestKey.get(t.requestKey);
			if (!n) continue;
			let r = (a.get(t.parentEventId) ?? /* @__PURE__ */ new Map()).has(t.replyEventId), i = o.get(t.replyAuthorPubkey)?.has(t.replyEventId) ?? !1, d = r;
			if (i && r && (await this.childInteractionsRepository.deleteChildInteractionByEventId(t.replyEventId), d = !1, c.push(t.requestKey), s.push(t.replyEventId)), i || !d || n.status === "success") {
				l.push(t.requestKey);
				continue;
			}
			let f = ns(t.requestKey);
			e.deletionConfirmationIncomplete !== !0 && (n.status !== "pending" && n.status !== "processing" || f) ? l.push(t.requestKey) : n.status !== "failed" && u.push(cs(t, n));
		}
		return {
			deletedReplyEventIds: as(s),
			correctedRequestKeys: os(c),
			resolvedRequestKeys: os(l),
			statePatches: u
		};
	}
}();
function us(e) {
	return e === "dialog-inbound-save" || e === "dialog-inbound-sync" || e === "inbound-realtime" || e === "listing-current-view" || e === "listing-older-reveal";
}
function ds(e) {
	return e === "pending" || e === "processing" || e === "success" || e === "failed";
}
function fs(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.requestKey == "string" && typeof t.parentEventId == "string" && typeof t.replyEventId == "string" && typeof t.replyAuthorPubkey == "string" && (t.kind === 1 || t.kind === 42 || t.kind === 1111) && us(t.source) && ds(t.status) && typeof t.attemptCount == "number" && typeof t.schemaVersion == "number";
}
function ps(e) {
	return {
		requestKey: e.requestKey,
		parentEventId: e.parentEventId,
		replyEventId: e.replyEventId,
		replyAuthorPubkey: "",
		kind: e.kind ?? 1,
		source: "listing-current-view",
		status: "pending",
		attemptCount: 0,
		schemaVersion: 1
	};
}
function ms(e) {
	return !e || !fs(e.value) ? null : {
		...e.value,
		updatedAt: e.updatedAt
	};
}
function hs(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.requestKey);
		(!e || e.updatedAt < n.updatedAt) && t.set(n.requestKey, n);
	}
	return Array.from(t.values()).sort((e, t) => e.updatedAt === t.updatedAt ? e.requestKey.localeCompare(t.requestKey) : e.updatedAt - t.updatedAt);
}
var gs = new class {
	db;
	now;
	constructor(e = Y, t = Date.now) {
		this.db = e, this.now = t;
	}
	async getMany(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return t.length === 0 ? [] : hs((await this.db.postHistoryReplyDeletionAttempts.bulkGet(t)).map((e) => ms(e)).filter((e) => !!e));
	}
	async getForParentEventIds(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return t.length === 0 ? [] : hs((await this.db.postHistoryReplyDeletionAttempts.where("parentEventId").anyOf(t).toArray()).map((e) => ms(e)).filter((e) => !!e));
	}
	async deleteMany(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		t.length !== 0 && await this.db.postHistoryReplyDeletionAttempts.bulkDelete(t);
	}
	async saveMany(e) {
		let t = Array.from(new Map(e.flatMap((e) => {
			let t = $o(e.requestKey);
			return !t || t.parentEventId !== e.parentEventId || t.replyEventId !== e.replyEventId || e.kind !== void 0 && e.kind !== t.kind ? [] : [[e.requestKey, {
				...e,
				kind: t.kind
			}]];
		})).values());
		if (t.length === 0) return [];
		let n = await this.getMany(t.map((e) => e.requestKey)), r = new Map(n.map((e) => [e.requestKey, e])), i = this.now(), a = t.map((e) => {
			let t = r.get(e.requestKey);
			return t && t.kind !== e.kind ? null : {
				...t ?? ps(e),
				...e.replyAuthorPubkey === void 0 ? {} : { replyAuthorPubkey: e.replyAuthorPubkey },
				...e.source === void 0 ? {} : { source: e.source },
				...e.status === void 0 ? {} : { status: e.status },
				...e.attemptCount === void 0 ? {} : { attemptCount: e.attemptCount },
				...e.kind === void 0 ? {} : { kind: e.kind },
				schemaVersion: 1
			};
		}).filter((e) => e !== null);
		return a.length === 0 ? [] : (await this.db.postHistoryReplyDeletionAttempts.bulkPut(a.map((e) => ({
			id: e.requestKey,
			parentEventId: e.parentEventId,
			value: e,
			updatedAt: i
		}))), hs(a.map((e) => ({
			...e,
			updatedAt: i
		}))));
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryPendingDeletionRequestsReconcile.ts
function _s(e) {
	return Object.fromEntries(e.map((e) => [e.reactionEventId, e.status === "success" ? void 0 : e.status]));
}
function vs(e) {
	let t = {};
	for (let n of e) {
		let e = No(n);
		e && (t[e.reactionEventId] = void 0);
	}
	return t;
}
function ys(e) {
	return Object.fromEntries(e.map((e) => [e.replyEventId, e.status === "success" ? void 0 : e.status]));
}
function bs(e) {
	let t = {};
	for (let n of e) {
		let e = $o(n);
		e && (t[e.replyEventId] = void 0);
	}
	return t;
}
async function xs(e, t, n) {
	return zo({
		records: n,
		toCandidate: (e) => ({
			requestKey: e.requestKey,
			parentEventId: e.parentEventId,
			reactionEventId: e.reactionEventId,
			reactionAuthorPubkey: e.reactionAuthorPubkey,
			kind: e.kind
		}),
		verifyConsistency: (e) => t.verifyConsistency(e),
		saveMany: (t) => e.saveMany(t),
		deleteMany: (t) => e.deleteMany(t)
	});
}
async function Ss(e, t, n) {
	return zo({
		records: n,
		toCandidate: (e) => ({
			requestKey: e.requestKey,
			parentEventId: e.parentEventId,
			replyEventId: e.replyEventId,
			replyAuthorPubkey: e.replyAuthorPubkey,
			kind: e.kind
		}),
		verifyConsistency: (e) => t.verifyConsistency(e),
		saveMany: (t) => e.saveMany(t),
		deleteMany: (t) => e.deleteMany(t)
	});
}
async function Cs(e, t = {}) {
	let n = t.reactionDeletionStateRepository ?? Ko, r = await xs(n, t.reactionDeletionConsistencyService ?? Oo, await n.getForParentEventIds(e)), i = t.directReplyDeletionStateRepository ?? gs, a = await Ss(i, t.directReplyDeletionConsistencyService ?? ls, await i.getForParentEventIds(e));
	Xo({
		..._s(r),
		...ys(a)
	});
}
async function ws(e, t = {}) {
	let n = t.reactionDeletionStateRepository ?? Ko, r = await xs(n, t.reactionDeletionConsistencyService ?? Oo, await n.getMany(e)), i = t.directReplyDeletionStateRepository ?? gs, a = await Ss(i, t.directReplyDeletionConsistencyService ?? ls, await i.getMany(e));
	Jo({
		...vs(e),
		..._s(r),
		...bs(e),
		...ys(a)
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryReactionLifecycleTrigger.ts
function Ts(e) {
	return Fo(e);
}
async function Es(e, t) {
	let n = [], r = /* @__PURE__ */ new Map();
	if (t.getReactionRecordsForParents) {
		let n = await t.getReactionRecordsForParents(e);
		for (let e of n) {
			let t = r.get(e.parentEventId) ?? [];
			t.push(e), r.set(e.parentEventId, t);
		}
	}
	for (let i of e) {
		let e = t.getReactionRecordsForParents ? r.get(i) ?? [] : await t.getReactionRecords(i);
		for (let t of e) n.push({
			requestKey: Mo(i, t.eventId),
			parentEventId: i,
			reactionEventId: t.eventId,
			reactionAuthorPubkey: t.authorPubkey,
			kind: 7
		});
	}
	return Array.from(new Map(n.map((e) => [e.requestKey, e])).values());
}
async function Ds(e, t, n, r) {
	return n.length === 0 ? [] : e.saveMany(n.map((e) => ({
		...r(e),
		requestKey: e.requestKey,
		parentEventId: e.parentEventId,
		reactionEventId: e.reactionEventId,
		reactionAuthorPubkey: e.reactionAuthorPubkey,
		source: t
	})));
}
async function Os(e) {
	let t = po, n = Ko, r = Ts(e.parentEventIds);
	if (r.length === 0) return {
		source: e.source,
		status: "completed",
		checkedParentEventIds: r,
		deletedReactionEventIds: [],
		deletionConfirmationIncomplete: !1
	};
	let i = await Es(r, t), a = Lo(await n.getMany(Io(i))), { skippedCandidates: o, admittedCandidates: s } = Ro({
		candidates: i,
		existingStateByRequestKey: a,
		hasInFlightRequest: xo,
		isFailedState: (e) => e.status === "failed",
		canRetryFailedState: Po
	});
	if (!e.rxNostr || s.length === 0) return await ws(Io(i)).catch(() => void 0), {
		source: e.source,
		status: "completed",
		checkedParentEventIds: r,
		deletedReactionEventIds: [],
		deletionConfirmationIncomplete: !1
	};
	let c = Io(s);
	So(c);
	try {
		let t = await Ds(n, e.source, s, (e) => ({
			status: "pending",
			attemptCount: (a.get(e.requestKey)?.attemptCount ?? 0) + 1
		}));
		await ws(c).catch(() => void 0);
		let r = new Map(t.map((e) => [e.requestKey, e])), i = await Ds(n, e.source, s, () => ({ status: "processing" }));
		await ws(c).catch(() => void 0);
		let o = new Map([...r.values(), ...i].map((e) => [e.requestKey, e])), l = await yo.cleanupReactionDeletions(e.rxNostr, {
			parentEventIds: Array.from(new Set(s.map((e) => e.parentEventId))),
			reactionEventIds: s.map((e) => e.reactionEventId),
			relayConfig: e.relayConfig,
			isActive: e.isActive
		});
		if (l.status === "cancelled") return await Ds(n, e.source, s, () => ({ status: "failed" })), {
			source: e.source,
			...l
		};
		let u = await Oo.verifyConsistency({
			candidates: s,
			statesByRequestKey: o,
			deletionConfirmationIncomplete: l.status !== "completed" || l.deletionConfirmationIncomplete,
			isActive: e.isActive
		}), d = u.resolvedRequestKeys ?? [], f = u.statePatches.length > 0 ? await n.saveMany(u.statePatches) : [];
		d.length > 0 && await n.deleteMany(d);
		let p = Array.from(/* @__PURE__ */ new Set([...l.deletedReactionEventIds, ...u.deletedReactionEventIds])), m = f.some((e) => e.status === "failed");
		return {
			source: e.source,
			status: l.deletionConfirmationIncomplete || m ? "partial" : "completed",
			checkedParentEventIds: Array.from(new Set(s.map((e) => e.parentEventId))),
			deletedReactionEventIds: p,
			deletionConfirmationIncomplete: l.deletionConfirmationIncomplete || m
		};
	} catch {
		return await Ds(n, e.source, s, () => ({ status: "failed" })).catch(() => void 0), {
			source: e.source,
			status: "partial",
			checkedParentEventIds: Array.from(new Set(s.map((e) => e.parentEventId))),
			deletedReactionEventIds: [],
			deletionConfirmationIncomplete: !0
		};
	} finally {
		Co(c), await ws([...c, ...Io(o)]).catch(() => void 0);
	}
}
var ks = 1e3, As = 7776e6;
function js(e) {
	return Number.isSafeInteger(e) && e > 0;
}
function Ms(e) {
	return { ...e };
}
function Ns(e) {
	return Array.from(new Set(e.filter(kt)));
}
var Ps = new class {
	db;
	now;
	maxRecords;
	ttlMs;
	constructor(e = Y, t = Date.now, n = ks, r = As) {
		this.db = e, this.now = t, this.maxRecords = n, this.ttlMs = r;
	}
	async get(e) {
		if (!kt(e)) return null;
		let t = await this.db.customEmojiImageMeta.get(e);
		return t ? Ms(t) : null;
	}
	async getMany(e) {
		let t = Ns(e);
		if (t.length === 0) return {};
		let n = await this.db.customEmojiImageMeta.bulkGet(t), r = {};
		return n.forEach((e) => {
			e && (r[e.url] = Ms(e));
		}), r;
	}
	async upsert(e) {
		if (!kt(e.url) || !js(e.width) || !js(e.height)) return null;
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
		}), Ms(r);
	}
	async touchMany(e, t = this.now()) {
		let n = Ns(e);
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
function Fs({ getShow: e, getSessionOpen: t = e, getEmojiUrls: n, onStateChanged: r = () => void 0 }) {
	let i = g(k({})), a = g(k({})), o = 0, s = new AbortController(), c = /* @__PURE__ */ new Set();
	function l(e) {
		let t = {};
		for (let n of e) {
			if (c.has(n)) {
				t[n] = "loading";
				continue;
			}
			let e = F(i)[n];
			(e === "ready" || e === "failed") && (t[n] = e);
		}
		let n = e.filter((e) => !t[e]);
		for (let e of n) c.add(e), t[e] = "loading";
		return _(F(i), t) || S(i, t, !0), n;
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
		let t = !1, n = { ...F(a) };
		for (let [r, i] of Object.entries(e)) {
			let e = n[r];
			(e?.width !== i.width || e?.height !== i.height || e?.aspectRatio !== i.aspectRatio) && (n[r] = i, t = !0);
		}
		t && S(a, n, !0);
	}
	async function p(t) {
		if (t.length === 0) return;
		let n = o;
		try {
			let r = await Ps.getMany(t);
			if (!e() || n !== o) return;
			let i = Object.keys(r);
			if (i.length === 0) return;
			f(Object.fromEntries(i.map((e) => [e, u(r[e])]))), Ps.touchMany(i);
		} catch {}
	}
	async function m(e) {
		try {
			await Ps.upsert(e);
		} catch {}
	}
	async function h(t) {
		let r = o, a = await At(t, { signal: s.signal });
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
		F(i)[t] !== l && S(i, {
			...F(i),
			[t]: l
		}, !0);
	}
	function _(e, t) {
		let n = Object.keys(e), r = Object.keys(t);
		return n.length === r.length && n.every((n) => e[n] === t[n]);
	}
	function v() {
		o++, s.abort(), s = new AbortController(), c.clear(), S(i, Object.fromEntries(Object.entries(F(i)).filter(([, e]) => e !== "loading")), !0);
	}
	function y() {
		o++, s.abort(), s = new AbortController(), S(i, {}, !0), c.clear();
	}
	return N(() => {
		e() && p(n());
	}), N(() => {
		if (!e()) return;
		let t = l(n());
		for (let e of t) h(e);
	}), N(() => {
		e() && (F(i), F(a), r());
	}), N(() => {
		t() || M(y);
	}), P(() => s.abort()), {
		suspend: v,
		get emojiLoadStateByUrl() {
			return F(i);
		},
		get emojiImageMetaByUrl() {
			return F(a);
		},
		resetState: y
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/sensitiveContentPayloadReader.ts
async function Is(e, t) {
	return (await Y.postHistory.get(e.id))?.deletedAt !== void 0 || (await Y.postHistoryDeletionRequests.where("targetEventId").anyOf([e.id, t]).toArray()).some((t) => {
		let n = t.rawEvent;
		return De(n) && n.pubkey === e.pubkey && Te(n, {
			id: t.targetEventId,
			pubkey: e.pubkey
		});
	});
}
async function Ls(e) {
	let { structure: t } = e;
	if (e.signal?.aborted || !De(t)) return null;
	let n = X(t);
	if (!n) return null;
	let r = (await Ye.getByIds([n.eventId]))[0];
	if (r?.deletedAt !== void 0 || await Is(t, n.eventId)) return null;
	if (r) {
		let i = r.rawEvent;
		if (Ne(t, i, n.eventId)) return e.signal?.aborted ? null : i;
	}
	if (!e.rxNostr || e.signal?.aborted) return null;
	let i = await Je(Y, t.pubkey), a = {
		ownerPubkeyHex: t.pubkey,
		expectedRevision: i,
		isActive: () => !e.signal?.aborted
	}, o = B.sanitizeExternalRelayUrls([
		...n.relayHint ? [n.relayHint] : [],
		...e.relayHints ?? [],
		...r?.acceptedRelays ?? [],
		...r?.fetchedRelays ?? []
	]), s = xi.fetchEventById(e.rxNostr, {
		eventId: n.eventId,
		relayHints: o,
		relayConfig: e.relayConfig
	}), c = () => s.cancel();
	e.signal?.addEventListener("abort", c, { once: !0 });
	let l = await s.promise.finally(() => e.signal?.removeEventListener("abort", c));
	if (e.signal?.aborted || !l.event || !Ne(t, l.event, n.eventId)) return null;
	let u = B.sanitizeExternalRelayUrls(l.relayUrl ? [l.relayUrl] : [], { limit: 1 });
	try {
		await Ye.putCandidate({
			event: l.event,
			fetchedRelays: u,
			relayHints: u,
			localWriteScope: a
		}), ln.archiveAdoptedAuthored([{ event: t }], a);
	} catch {}
	let [d] = await Ye.getByIds([n.eventId]);
	return e.signal?.aborted || d?.deletedAt !== void 0 || await Is(t, n.eventId) ? null : l.event;
}
async function Rs(e) {
	return (await Ls(e))?.content ?? null;
}
function zs(e) {
	if (!e.structure || !X(e.structure)) return;
	let t = e.structure, n = X(t), r = (t) => Rs({
		structure: e.structure,
		relayHints: e.relayHints,
		rxNostr: e.rxNostr,
		relayConfig: e.relayConfig,
		signal: t
	});
	return r.scope = {
		runtime: e.rxNostr,
		ownerPubkey: e.ownerPubkey
	}, r.loadEmoji = At, r.observe = (e) => {
		let r = xe(async () => {
			let e = await Y.sensitivePayloads.get(n.eventId);
			return e?.deletedAt !== void 0 || await Is(t, n.eventId) ? "deleted" : e ? Ne(t, e.rawEvent, n.eventId) ? "available" : "invalid" : "missing";
		}).subscribe({
			next: e,
			error: () => e("invalid")
		});
		return () => r.unsubscribe();
	}, r;
}
export { Rt as $, pi as A, pr as B, eo as C, Ca as D, Ba as E, fi as F, Xn as G, $n as H, ni as I, En as J, Bn as K, ti as L, vi as M, gi as N, xi as O, hi as P, cn as Q, Zn as R, oo as S, Qa as T, er as U, tr as V, Qn as W, bn as X, Cn as Y, ln as Z, Fo as _, Cs as a, It as at, mo as b, ls as c, is as d, zt as et, Qo as f, Lo as g, Yo as h, Os as i, Jt as it, mi as j, _i as k, rs as l, qo as m, Ls as n, Bt as nt, ws as o, Ft as ot, es as p, Dn as q, Fs as r, Vt as rt, gs as s, Lt as st, zs as t, Ht as tt, ns as u, Ro as v, to as w, po as x, Io as y, Yn as z };
