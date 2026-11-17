import { $ as e, A as t, E as n, Et as r, G as i, I as a, J as o, K as s, L as c, Mt as l, Nt as u, P as d, T as f, Tt as p, V as m, W as h, X as g, Z as _, _ as v, a as y, ct as b, dt as x, ft as S, gt as C, i as w, it as T, k as ee, mt as E, nt as D, o as te, pt as O, r as k, s as ne, st as A, t as j, ut as M, vt as N, w as P, xt as F, y as I, z as L } from "./index-client-XkLzkVYC.js";
import { c as re, i as R, n as z, r as ie, v as ae, x as B } from "./relayConfigUtils-B4Q_AO1M.js";
import { n as V } from "./nostrHexUtils-C4ICTS7z.js";
import { a as oe, c as se, o as ce, u as le } from "./postHistoryEventUtils-CP25bUau.js";
import { n as ue } from "./profilePictureUrlUtils-B7zGYkzO.js";
import { n as H } from "./esm-CrCI9Pgc.js";
import { B as de, F as fe, Q as U, V as pe, X as W, d as G, dt as me, et as K, j as he, o as ge, p as _e, pt as ve, q as ye, s as q, st as J, t as be, z as Y } from "./LoadingPlaceholder-lit91akO.js";
import { b as xe, c as Se, f as Ce, n as we, r as Te } from "./ehagakiDb-CqVey46a.js";
import { a as Ee, c as De, i as Oe, n as ke, r as Ae, s as je } from "./query-Bp8561W2.js";
import { $ as Me, A as Ne, F as Pe, H as Fe, I as Ie, J as Le, K as Re, L as ze, M as Be, P as Ve, R as He, W as Ue, X as We, Y as Ge, Z as Ke, c as qe, ct as Je, d as Ye, dt as Xe, f as Ze, g as Qe, ht as $e, i as et, it as tt, j as nt, m as rt, mt as it, nt as at, ot as X, s as ot, t as st, z as ct } from "./nip65RelayDirectory-DWdjnt74.js";
import { s as lt } from "./postEventBuilder-BlIBIiSK.js";
import { h as ut, m as dt, p as ft } from "./relayStore.svelte-Df3SPXmc.js";
import { Ot as pt, St as mt, nt as ht, s as gt, tt as _t } from "./appUtils-BRia-Jm6.js";
import { c as vt, o as yt, s as bt } from "./signedEventResultValidator-CnvxVz7l.js";
import { a as xt, p as St } from "./clipboardUtils-DL4u_EPs.js";
import { S as Ct } from "./useDialogHistory.svelte-BgJftJRE.js";
import { a as wt, n as Tt, o as Et, r as Dt, t as Ot } from "./safe-polygon.svelte-NujogFy-.js";
import { c as kt, d as At, l as jt, p as Mt, t as Nt } from "./customEmoji-DDC4uHz2.js";
import { t as Pt } from "./graphemeUtils-D37rBdTG.js";
import { t as Ft } from "./inViewportAction.svelte-DbEFrrvA.js";
import { t as Z } from "./postMediaCacheService-CCnN2yS6.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelayResolver.ts
function It(e) {
	if (dt()) return ft();
	let t = z.sanitizeExternalRelayUrls(e ? [...z.extractWriteRelays(e), ...z.extractReadRelays(e)] : []);
	return t.length ? t : z.sanitizeExternalRelayUrls(R);
}
function Lt(e) {
	return JSON.stringify([
		dt(),
		It(e),
		e ?? null
	]);
}
function Rt(e, t) {
	if (dt()) return ft();
	let n = e ? [...z.extractReadRelays(e), ...z.extractWriteRelays(e)] : [], r = z.sanitizeExternalRelayUrls(n, { limit: t });
	return r.length > 0 ? r : z.sanitizeExternalRelayUrls(R, { limit: t });
}
var zt = 6e3, Bt = 6e3, Vt = 6e3, Ht = 35e3, Ut = 6e4;
function Wt(e) {
	return Array.from(e).sort((e, t) => e.localeCompare(t));
}
function Gt() {
	let e = Math.random().toString(36).slice(2, 10);
	return `post-history-repair-${Date.now().toString(36)}-${e}`;
}
function Kt(e, t) {
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
function qt(e, t) {
	if (Number.isFinite(t)) return Math.max(1, Math.trunc(t ?? 1));
	switch (e) {
		case "dialog-open-refresh":
		case "dialog-open-catchup":
		case "visibility-resume":
		case "foreground-periodic": return Bt;
		case "older-backfill": return Vt;
		case "repair-visible-range": return Ht;
		default: return zt;
	}
}
function Jt(e, t = !1) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls),
		...t ? { attestation: e.attestation } : {}
	})).sort((e, t) => t.event.created_at - e.event.created_at);
}
var Yt = new class {
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
		let r = this.now(), i = t.kinds ?? [...Le], a = Kt(t.reason, t.limit), o = Math.min(t.reason === "repair-visible-range" || n ? Infinity : 6e3, qt(t.reason, t.timeoutMs)), s = n === void 0 ? It(t.relayConfig) : z.sanitizeExternalRelayUrls([n]), c = [
			"dialog-open-refresh",
			"visibility-resume",
			"foreground-periodic"
		].includes(t.reason ?? ""), l = !n && c && !dt() ? s.slice(0, 4) : s, u = t.until ?? Math.max(0, Math.floor(r / 1e3)), d = /* @__PURE__ */ new Map(), f = l.map((e) => {
			let t = Gt();
			return {
				relayUrl: e,
				subId: `${t}:0`,
				request: Ee(t),
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
			let r = Jt(d, n !== void 0), i = r.map(({ event: e }) => e.created_at), o = i.length ? Math.min(...i) : null, c = i.length ? Math.max(...i) : null, p = f.map((t) => ({
				relayUrl: t.relayUrl,
				eoseReceived: t.eoseReceived,
				verificationDrained: t.verificationDrained,
				termination: e === "cancelled" ? "cancelled" : t.eoseReceived && t.verificationDrained ? "eose" : t.failed ? "error" : S === "quorum" ? "early-stop" : "timeout",
				rawCount: t.rawCount,
				oldestCreatedAt: t.oldestCreatedAt,
				saturated: t.rawCount >= a
			})), y = Ke({
				since: t.since,
				until: u,
				oldestCreatedAt: o,
				outcomes: p,
				cancelled: e === "cancelled"
			}), b = f.filter((e) => e.eoseReceived).map((e) => e.relayUrl), x = p.filter((e) => e.termination === "eose"), C = s.length > 0 && x.length >= Math.ceil(s.length / 2), w = t.since !== void 0 && Me(y, s).some((e) => e.since <= t.since && e.until >= u), D = f.filter((e) => e.rawCount || e.eventIds.size).map((e) => ({
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
				eventRelayUrls: Wt(m),
				eoseRelayUrls: b,
				closedRelayUrls: Wt(h),
				errorRelayUrls: Wt(_),
				downRelayUrls: Wt(v),
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
			let t = z.sanitizeExternalRelayUrls(e ? [e] : [])[0];
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
				if (x = t.operation ?? new Ae(o, s, {
					now: this.now,
					setTimeoutFn: this.setTimeoutFn,
					clearTimeoutFn: this.clearTimeoutFn
				}), C = x.add(() => s(x.reason ?? "cancelled")), w = Oe(x, f, !n && t.reason !== "repair-visible-range", s), !b) {
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
							if (r.subscription = it(e, r.request, { on: { relays: [r.relayUrl] } }).subscribe({
								next: (o) => {
									if (b) return;
									let s = o.event;
									if (s.pubkey !== t.pubkeyHex || !i.includes(s.kind) || t.since !== void 0 && s.created_at < t.since || t.until !== void 0 && s.created_at > t.until) return;
									m.add(r.relayUrl), r.eventIds.add(s.id), r.oldestCreatedAt = Math.min(r.oldestCreatedAt ?? s.created_at, s.created_at), r.newestCreatedAt = Math.max(r.newestCreatedAt ?? s.created_at, s.created_at), e.createAllMessageObservable || (r.rawCount += 1);
									let c = d.get(s.id);
									if (c) ce(c.event, s) && c.relayUrls.add(r.relayUrl);
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
}(), Xt = class {
	createClient;
	constructor(e = je) {
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
						verifier: xe,
						signer: De(),
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
			let a = Yt.fetchRelayPage(n, {
				...t,
				relayUrl: e,
				timeoutMs: Bt,
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
			let a = Ee(), o = /* @__PURE__ */ new Map();
			return new Promise((s) => {
				let c, l = () => {
					c?.unsubscribe(), i.removeEventListener("abort", l), s([...o.values()]);
				};
				i.addEventListener("abort", l, { once: !0 }), c = ke(n, a, { on: { relays: [e] } }, {
					operation: r,
					quorum: !1,
					timeoutMs: Bt,
					source: (e, t) => it(n, e, t)
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
			let i = new Ae(Bt, () => void 0);
			i.bind(n);
			try {
				let n = await Promise.all(r.map((n) => lt(t, n, {
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
}, Zt = /^(0|[1-9]\d{0,4})$/, Qt = {
	status: "valid",
	ruleVersion: 1
};
function $t(e) {
	return e?.status === "valid" && e.ruleVersion === 1;
}
function en(e, t) {
	return Xe(e, t) ? {
		event: e,
		attestation: t
	} : Je(e);
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
	return n.some((e) => e === null) ? !0 : n.some((e) => e !== null && Pe(e));
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
	return e.targetAuthorPubkey !== t.targetAuthorPubkey || e.targetEventId !== t.targetEventId || e.schemaVersion !== t.schemaVersion || e.deletionEventId !== t.deletionEventId || e.deletionEventPubkey !== t.deletionEventPubkey || Ve(e) !== Ve(t) || e.deletedAt !== t.deletedAt || e.reason !== t.reason || !ce(e.rawEvent, t.rawEvent) || e.rawEventVerification?.status !== t.rawEventVerification?.status || e.rawEventVerification?.ruleVersion !== t.rawEventVerification?.ruleVersion || !rt(e.relayUrls, t.relayUrls);
}
function sn(e, t, n) {
	let r = $t(e.rawEventVerification) && !ce(e.rawEvent, t.rawEvent);
	return {
		...t,
		...r ? {
			rawEvent: e.rawEvent,
			rawEventVerification: e.rawEventVerification
		} : {},
		targetVerified: Ve(e) || Ve(t),
		relayUrls: z.sanitizeExternalRelayUrls([...e.relayUrls, ...t.relayUrls]),
		fetchedAt: Math.max(e.fetchedAt, t.fetchedAt),
		updatedAt: n(),
		schemaVersion: 2
	};
}
var cn = new class {
	db;
	now;
	constructor(e = we, t = Date.now) {
		this.db = e, this.now = t;
	}
	async getDeletedTargets(e) {
		let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
		for (let t of e) t.targetAuthorPubkey && t.targetEventId && n.set(`${t.targetAuthorPubkey}:${t.targetEventId}`, t);
		for (let e of n.values()) {
			let n = await this.db.postHistoryDeletionRequests.where("[targetAuthorPubkey+targetEventId]").equals([e.targetAuthorPubkey, e.targetEventId]).toArray().then((e) => X(this.db, "postHistoryDeletionRequests").hydrate(e));
			for (let e of n) Ve(e) && an(t, e);
		}
		return t;
	}
	async getAllForTargetAuthorPubkey(e) {
		return e ? this.db.postHistoryDeletionRequests.where("targetAuthorPubkey").equals(e).toArray().then((e) => X(this.db, "postHistoryDeletionRequests").hydrate(e)) : [];
	}
	async saveLocalDeletion(e) {
		let t = en(e.deletionEvent, e.attestation);
		if (!t) throw Error("invalid_local_deletion_event");
		let n = t.event, r = Array.from(/* @__PURE__ */ new Set([...e.targetEventId ? [e.targetEventId] : [], ...e.targetEventIds ?? []]));
		if (r.length === 0 || n.kind !== 5 || !V(n.id)) throw Error("invalid_local_deletion_event");
		let i = e.fetchedAt ?? this.now(), a = null;
		await this.db.transaction("rw", this.db.events, this.db.postHistoryDeletionRequests, this.db.postHistory, this.db.sensitivePayloads, async () => {
			let t = e.targetEvent ? Je(e.targetEvent)?.event : null, o = await X(this.db, "postHistory").get(r[0]), s = o ?? (t && t.id === r[0] ? {
				eventId: t.id,
				pubkeyHex: t.pubkey,
				kind: t.kind,
				rawEvent: t
			} : void 0);
			if (!s || !Pe(s.kind) || !Ie(n, {
				id: s.eventId,
				pubkey: s.pubkeyHex
			})) throw Error("local_deletion_target_not_found");
			let c = s.rawEvent, l = (Re(c) ? Fe(c) : null)?.eventId;
			for (let t of r) {
				let r = !1;
				if (t === s.eventId) r = Ie(n, {
					id: s.eventId,
					pubkey: s.pubkeyHex
				});
				else if (t === l) {
					let e = await X(this.db, "sensitivePayloads").get(t);
					r = !!e && e.deletedAt === void 0 && e.pubkeyHex === s.pubkeyHex && Ue(c, e.rawEvent, t) && Ie(n, {
						id: t,
						pubkey: s.pubkeyHex
					});
				}
				if (!r) continue;
				let a = He({
					deletionEvent: n,
					targetEventId: t,
					targetVerified: !0,
					relayUrls: e.relayUrls,
					fetchedAt: i
				}, this.now);
				a.rawEventVerification = { ...Qt };
				let o = await X(this.db, "postHistoryDeletionRequests").get(a.id), u = o ? sn(o, a, this.now) : a;
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
		}), a && Qe(a);
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
				let s = i.get(nt(t.pubkey, t.id, e.event.id)), c = ze({
					deletionEvent: e.event,
					targetEvent: t,
					relayUrls: z.sanitizeExternalRelayUrls([...s?.relayUrls ?? [], ...e.relayUrls ?? []]),
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
		return await this.db.transaction("rw", this.db.events, this.db.postHistoryDeletionRequests, async () => {
			let e = await X(this.db, "postHistoryDeletionRequests").bulkGet(o.map((e) => e.id)), t = /* @__PURE__ */ new Map();
			e.forEach((e) => {
				e && t.set(e.id, e);
			});
			let n = o.map((e) => {
				let n = t.get(e.id);
				if (!n) return s += 1, e;
				let r = sn(n, e, this.now);
				return on(n, r) ? c += 1 : l += 1, r;
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
			let o = en(a.event, a.attestation);
			if (!o) {
				i += 1;
				continue;
			}
			let s = o.event;
			if (s.kind !== 5 || s.pubkey !== e.ownerPubkeyHex || !V(s.id)) {
				i += 1;
				continue;
			}
			let c = s.tags.filter((e) => e[0] === "e" && typeof e[1] == "string" && V(e[1])).map((e) => e[1]), l = Array.from(new Set(c));
			if (l.length === 0) {
				i += 1;
				continue;
			}
			let u = nn(s);
			r.add(s.id);
			for (let e of l) {
				let r = He({
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
			this.db.events,
			this.db.postHistoryDeletionRequests,
			this.db.postHistory,
			...e.localWriteScope ? [this.db.postHistoryWriteGeneration] : []
		], async () => {
			await at(this.db, e.localWriteScope);
			let t = await X(this.db, "postHistoryDeletionRequests").bulkGet(a.map((e) => e.record.id)), n = Array.from(new Set(a.map((e) => e.record.targetEventId))), p = await X(this.db, "postHistory").bulkGet(n), m = new Map(p.filter((e) => !!e).map((e) => [e.eventId, e])), h = [], g = /* @__PURE__ */ new Set();
			a.forEach((e, n) => {
				let { record: r } = e, i = m.get(r.targetEventId);
				if (i && !Pe(i.kind) || !i && !e.shouldStoreWithoutTarget) return;
				i && i.deletedAt !== void 0 && i.rawEventVerification?.status === "valid" && i.rawEventVerification.ruleVersion === 1 && oe(i.rawEvent, i) && !Fe(i.rawEvent) && f.add(r.targetEventId);
				let a = !!i && Pe(i.kind) && i.pubkeyHex === r.targetAuthorPubkey && i.pubkeyHex === r.deletionEventPubkey, l = {
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
			h.length > 0 && await X(this.db, "postHistoryDeletionRequests").bulkPut(h);
			for (let e of n) {
				let t = m.get(e);
				if (!t || !Pe(t.kind) || t.deletedAt !== void 0) continue;
				let n = (await this.db.postHistoryDeletionRequests.where("targetEventId").equals(e).toArray().then((e) => X(this.db, "postHistoryDeletionRequests").hydrate(e))).filter((e) => Ve(e) && e.targetAuthorPubkey === t.pubkeyHex && e.deletionEventPubkey === t.pubkeyHex).sort(Be)[0];
				if (!n) continue;
				let r = ct(n);
				await X(this.db, "postHistory").update(e, {
					...r,
					updatedAt: this.now()
				}), l += 1;
			}
			await at(this.db, e.localWriteScope);
		});
		let p = Array.from(new Set(a.map((e) => e.record.targetEventId)));
		for (let e of p) u.has(e) && !d.has(e) && f.has(e) || (await Ye(e, this.db, this.now), await Ze(e, this.db, this.now));
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
		this.transport = e.transport, this.repository = e.repository ?? qe, this.payloads = e.payloads ?? ot, this.deletions = e.deletions ?? cn, this.getLocalRevision = e.getLocalRevision ?? ((e) => tt(we, e)), this.runtimeKind = e.runtimeKind ?? (() => ae().runtimeKind);
	}
	getTransport() {
		return this.transport ??= new Xt();
	}
	configureSession(e) {
		this.cancelSession();
		let t = e.url && pt(e.url);
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
		let r = [...new Map(t.filter(({ event: t, attestation: n }) => t.pubkey === e.ownerPubkeyHex && (We(t.kind) || t.kind === 5 || t.kind === 36) && Xe(t, n) && !this.stores.has(`${e.url}:${t.id}`)).map((e) => [e.event.id, e])).values()];
		if (!r.length) return;
		let i = r.map(({ event: t }) => `${e.url}:${t.id}`), a = Promise.resolve().then(async () => {
			if (!this.isCurrent(e) || !n()) return;
			let t = r.filter(({ event: e, attestation: t }) => Xe(e, t)).map(({ event: e }) => e);
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
		let a = new Ae(Bt, () => n.abort());
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
						kindsKey: Ge,
						localRelayUrl: t.url,
						browsingRanges: c.browsingRanges,
						...e.reason !== "repair-visible-range" && l != null ? {
							resumeHint: { nextUntil: l },
							initializeResumeHintOnly: e.reason !== "older-backfill"
						} : {}
					}
				});
				if (u.applied === !1 || !o()) return null;
				let d = u.insertedCount + u.updatedCount + u.appliedDeletionCount > 0, f = [...new Map([...c.events.map(({ event: e }) => e), ...e.targets ?? []].filter((e) => e.pubkey === t.ownerPubkeyHex && We(e.kind)).map((e) => [e.id, e])).values()], p = f.flatMap((e) => {
					let t = Fe(e);
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
						f.some((e) => Ue(e, t.event)) && (await this.payloads.putCandidate({
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
				if (a.has(n.event.id) || n.event.pubkey !== t.ownerPubkeyHex || !We(n.event.kind)) continue;
				let e = await this.repository.getByEventId(n.event.id);
				if (!i() || await this.getLocalRevision(t.ownerPubkeyHex) !== r) return;
				if (!e || e.pubkeyHex !== t.ownerPubkeyHex || !ce(e.rawEvent, n.event)) continue;
				let c = Xe(n.event, n.attestation) ? {
					event: n.event,
					attestation: n.attestation
				} : Je(e.rawEvent);
				if (!c) continue;
				a.set(c.event.id, c.event), e.deletedAt === void 0 && o.set(c.event.id, c);
				let l = Fe(c.event);
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
				let t = s.get(e.id)?.filter(({ event: t }) => Ue(t, e.rawEvent)) ?? [], n = t.length ? Je(e.rawEvent) : null;
				n && (a.set(n.event.id, n.event), e.deletedAt === void 0 && t.some(({ deleted: e }) => !e) && o.set(n.event.id, n));
			}
			let l = await this.deletions.getAllForTargetAuthorPubkey(t.ownerPubkeyHex);
			if (i() && await this.getLocalRevision(t.ownerPubkeyHex) === r) {
				for (let e of l) {
					if (![...a.values()].some((t) => Ie(e.rawEvent, t))) continue;
					let t = Je(e.rawEvent);
					t && o.set(t.event.id, t);
				}
				this.storeBatch(n, [...o.values()], i);
			}
		})().catch(() => void 0);
	}
}();
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/on-mount-effect.svelte.js
function un(e) {
	b(() => T(() => e()));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/timeout-fn.js
var dn = class {
	#e;
	#t;
	#n = null;
	constructor(e, t) {
		this.#t = e, this.#e = t, this.stop = this.stop.bind(this), this.start = this.start.bind(this), ye(this.stop);
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
}, fn = fe({
	component: "tooltip",
	parts: ["content", "trigger"]
}), pn = new U("Tooltip.Provider"), mn = new U("Tooltip.Root"), hn = class {
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
}, gn = class t {
	static create(e) {
		return pn.set(new t(e));
	}
	opts;
	#e = N(!0);
	get isOpenDelayed() {
		return D(this.#e);
	}
	set isOpenDelayed(e) {
		C(this.#e, e, !0);
	}
	isPointerInTransit = me(!1);
	#t;
	#n = N(null);
	constructor(t) {
		this.opts = t, this.#t = new dn(() => {
			this.isOpenDelayed = !0;
		}, this.opts.skipDelayDuration.current), un(() => e(window, "scroll", (e) => {
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
}, _n = class e {
	static create(t) {
		return mn.set(new e(t, pn.get()));
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
		this.opts = e, this.provider = t, this.tether = e.tether.current?.state ?? null, this.registry = this.tether?.registry ?? new hn(), this.#s = new dn(() => {
			C(this.#o, !0), this.opts.open.current = !0;
		}, this.delayDuration ?? 0), this.tether && (this.tether.root = this, un(() => () => {
			this.tether?.root === this && (this.tether.root = null);
		})), this.contentPresence = new Ct({
			open: this.opts.open,
			ref: J(() => this.contentNode),
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), W(() => this.delayDuration, () => {
			this.delayDuration !== void 0 && (this.#s = new dn(() => {
				C(this.#o, !0), this.opts.open.current = !0;
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
}, vn = class e {
	static create(t) {
		return t.tether.current ? new e(t, null, t.tether.current.state) : new e(t, mn.get(), null);
	}
	opts;
	root;
	tether;
	attachment;
	#e = me(!1);
	#t = N(!1);
	domContext;
	#n = null;
	#r = !1;
	#i = null;
	constructor(e, t, n) {
		this.opts = e, this.root = t, this.tether = n, this.domContext = new pe(e.ref), this.attachment = de(this.opts.ref, (e) => this.#s(e)), W(() => this.opts.id.current, () => {
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
		if (G(n)) {
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
		t && (this.#e.current || (this.#o() ? t.opts.open.current && t.handleClose() : (!t.ignoreNonKeyboardFocus || _e(e.currentTarget)) && (t.setActiveTrigger(this.opts.id.current), t.handleOpen())));
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
			"data-disabled": he(n),
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
		return D(this.#_);
	}
	set props(e) {
		C(this.#_, e);
	}
}, yn = class e {
	static create(t) {
		return new e(t, mn.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = de(this.opts.ref, (e) => this.root.contentNode = e), new Ot({
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
		"data-disabled": he(this.root.disabled),
		...Y(this.root.contentPresence.transitionStatus),
		style: { outline: "none" },
		[fn.content]: "",
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
function bn(e, t) {
	r(t, !0);
	let n = k(t, "open", 15, !1), a = k(t, "triggerId", 15, null), o = k(t, "onOpenChange", 3, q), s = k(t, "onOpenChangeComplete", 3, q), c = _n.create({
		open: J(() => n(), (e) => {
			n(e), o()(e);
		}),
		triggerId: J(() => a(), (e) => {
			a(e);
		}),
		delayDuration: J(() => t.delayDuration),
		disableCloseOnTriggerClick: J(() => t.disableCloseOnTriggerClick),
		disableHoverableContent: J(() => t.disableHoverableContent),
		ignoreNonKeyboardFocus: J(() => t.ignoreNonKeyboardFocus),
		disabled: J(() => t.disabled),
		onOpenChangeComplete: J(() => s()),
		tether: J(() => t.tether)
	});
	Et(e, {
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
]), Sn = s("<div><div><!></div></div>");
function Cn(e, t) {
	let n = o();
	r(t, !0);
	let a = k(t, "id", 19, () => ge(n)), s = k(t, "ref", 15, null), c = k(t, "side", 3, "top"), f = k(t, "sideOffset", 3, 0), m = k(t, "align", 3, "center"), g = k(t, "avoidCollisions", 3, !0), _ = k(t, "arrowPadding", 3, 0), b = k(t, "sticky", 3, "partial"), S = k(t, "hideWhenDetached", 3, !1), C = k(t, "collisionPadding", 3, 0), T = k(t, "onInteractOutside", 3, q), ee = k(t, "onEscapeKeydown", 3, q), E = k(t, "forceMount", 3, !1), te = w(t, xn), O = yn.create({
		id: J(() => a()),
		ref: J(() => s(), (e) => s(e)),
		onInteractOutside: J(() => T()),
		onEscapeKeydown: J(() => ee())
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
	})), A = F(() => K(te, D(ne), O.props));
	var j = i(), N = x(j), P = (e) => {
		{
			let n = (e, n) => {
				let r = () => (n?.()).props, a = () => (n?.()).wrapperProps, o = F(() => K(a(), { style: { pointerEvents: O.root.disableHoverableContent ? "none" : void 0 } })), s = F(() => K(r(), { style: wt("tooltip") }, { style: t.style }));
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
					var n = Sn();
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
			Tt(e, y(() => D(A), () => O.popperProps, {
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
				let r = () => (n?.()).props, a = () => (n?.()).wrapperProps, o = F(() => K(a(), { style: { pointerEvents: O.root.disableHoverableContent ? "none" : void 0 } })), s = F(() => K(r(), { style: wt("tooltip") }, { style: t.style }));
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
					var n = Sn();
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
			Dt(e, y(() => D(A), () => O.popperProps, {
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
]), Tn = s("<button><!></button>");
function En(e, t) {
	let n = o();
	r(t, !0);
	let a = k(t, "id", 19, () => ge(n)), s = k(t, "disabled", 3, !1), c = k(t, "type", 3, "button"), f = k(t, "tabindex", 3, 0), m = k(t, "ref", 15, null), g = w(t, wn), _ = vn.create({
		id: J(() => a()),
		disabled: J(() => s() ?? !1),
		tabindex: J(() => f() ?? 0),
		payload: J(() => t.payload),
		tether: J(() => t.tether),
		ref: J(() => m(), (e) => m(e))
	}), y = F(() => K(g, _.props, { type: c() }));
	var b = i(), S = x(b), C = (e) => {
		var n = i(), r = x(n);
		d(r, () => t.child, () => ({ props: D(y) })), h(e, n);
	}, T = (e) => {
		var n = Tn();
		v(n, () => ({ ...D(y) }));
		var r = M(n);
		d(r, () => t.children ?? u), l(n), h(e, n);
	};
	L(S, (e) => {
		t.child ? e(C) : e(T, -1);
	}), h(e, b), p();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-provider.svelte
function Dn(e, t) {
	r(t, !0);
	let n = k(t, "delayDuration", 3, 700), a = k(t, "disableCloseOnTriggerClick", 3, !1), o = k(t, "disableHoverableContent", 3, !1), s = k(t, "disabled", 3, !1), c = k(t, "ignoreNonKeyboardFocus", 3, !1), l = k(t, "skipDelayDuration", 3, 300);
	gn.create({
		delayDuration: J(() => n()),
		disableCloseOnTriggerClick: J(() => a()),
		disableHoverableContent: J(() => o()),
		disabled: J(() => s()),
		ignoreNonKeyboardFocus: J(() => c()),
		skipDelayDuration: J(() => l())
	});
	var f = i(), m = x(f);
	d(m, () => t.children ?? u), h(e, f), p();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileEventComparison.ts
function On(e) {
	return V(e.sourceEventId) && Number.isSafeInteger(e.updatedAtFromEvent) && e.updatedAtFromEvent >= 0;
}
function kn(e, t) {
	return t.sourceEventId === e.sourceEventId ? "same-event" : t.updatedAtFromEvent > e.updatedAtFromEvent ? "candidate-newer" : t.updatedAtFromEvent < e.updatedAtFromEvent ? "candidate-older" : t.sourceEventId < e.sourceEventId ? "candidate-wins-tie-break" : "candidate-loses-tie-break";
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/profilesRepository.ts
var An = 2;
function jn(e) {
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
function Mn(e, t, n) {
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
		schemaVersion: An
	};
}
function Nn(...e) {
	let t = z.sanitizeExternalRelayUrls(e.flatMap((e) => e ?? []));
	return t.length > 0 ? t : void 0;
}
function Pn(e) {
	return e.sourceEventId !== void 0 && e.updatedAtFromEvent !== void 0 && On({
		sourceEventId: e.sourceEventId,
		updatedAtFromEvent: e.updatedAtFromEvent
	});
}
function Fn(e, t) {
	return e.length > 0 && t.pubkeyHex === e && On(t) && Number.isFinite(t.fetchedAt) && t.fetchedAt >= 0;
}
function In(e, t, n) {
	let r = Nn(t.profile.profileRelays, t.observedRelays);
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
		schemaVersion: An
	};
}
function Ln(e, t) {
	return {
		decision: e,
		acceptedRecord: t,
		acceptedProfile: t ? jn(t) : null,
		currentEventConfirmed: e === "inserted" || e === "replaced" || e === "kept-existing" || e === "merged-same-event"
	};
}
function Rn(e, t) {
	let n = t.getItem(mt.NOSTR_PROFILE + e);
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
var zn = new class {
	db;
	now;
	getStorage;
	constructor(e = Te, t = Date.now, n = () => B()) {
		this.db = e, this.now = t, this.getStorage = n;
	}
	async get(e) {
		if (!e) return null;
		let t = Ce(e);
		try {
			let n = await this.db.profiles.get(e);
			if (n) return await this.markLegacyProfileImported(t), jn(n);
		} catch {
			return Rn(e, this.getStorage());
		}
		if ((await this.db.legacyImportState.get(t))?.done === !0) return null;
		let n = this.getStorage();
		if (n.getItem(mt.NOSTR_PROFILE + e) === null) return await this.markLegacyProfileImported(t), null;
		let r = Rn(e, n);
		if (!r) return null;
		try {
			await this.db.transaction("rw", this.db.profiles, this.db.legacyImportState, async () => {
				(await this.db.legacyImportState.get(t))?.done !== !0 && (await this.db.profiles.get(e) || await this.db.profiles.put(Mn(e, r, this.now)), await this.db.legacyImportState.put({
					id: t,
					done: !0,
					updatedAt: this.now()
				}));
			});
			try {
				n.removeItem(mt.NOSTR_PROFILE + e);
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
		e && await this.db.profiles.put(Mn(e, t, this.now));
	}
	async upsertCandidate(e, t) {
		return this.db.transaction("rw", this.db.profiles, async () => {
			let n = await this.db.profiles.get(e) ?? null;
			if (!Fn(e, t)) return Ln("rejected-invalid", n);
			if (!n || !Pn(n)) {
				let r = In(e, t, this.now());
				return await this.db.profiles.put(r), Ln(n ? "replaced" : "inserted", r);
			}
			let r = kn(n, t);
			if (r === "candidate-older") return Ln("rejected-older", n);
			if (r === "candidate-loses-tie-break") return Ln("rejected-tie-break", n);
			if (r === "candidate-newer" || r === "candidate-wins-tie-break") {
				let n = In(e, t, this.now());
				return await this.db.profiles.put(n), Ln("replaced", n);
			}
			let i = Nn(n.profileRelays, t.profile.profileRelays, t.observedRelays), a = Math.max(n.fetchedAt, t.fetchedAt);
			if (a === n.fetchedAt && rt(n.profileRelays, i)) return Ln("kept-existing", n);
			let o = {
				...n,
				profileRelays: i,
				fetchedAt: a,
				updatedAt: this.now(),
				schemaVersion: An
			};
			return await this.db.profiles.put(o), Ln("merged-same-event", o);
		});
	}
	async delete(e) {
		if (e) {
			await this.db.profiles.delete(e);
			try {
				this.getStorage().removeItem(mt.NOSTR_PROFILE + e);
			} catch {}
		}
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDirectReplyRelationUtils.ts
function Bn(e) {
	return e === 1 || e === 42 || e === 1111;
}
function Vn(e) {
	if (!Bn(e.event.kind) || !e.event.id) return null;
	let t = le(e.event);
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
function Hn(e) {
	if (!Bn(e.child.kind)) return {
		valid: !1,
		reason: "unsupported-child-kind"
	};
	if (e.child.id === e.parent.eventId) return {
		valid: !1,
		reason: "self-reference"
	};
	let t = le(e.child);
	if (!se(t)) return {
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
var Un = s("<div aria-hidden=\"true\"></div>"), Wn = {
	hash: "svelte-ohoxs0",
	code: ".blurhash-placeholder.svelte-ohoxs0 {position:absolute;inset:0;z-index:0;border-radius:inherit;overflow:hidden;background:radial-gradient(\n                circle at top left,\n                rgba(255, 255, 255, 0.2),\n                transparent 48%\n            ),\n            linear-gradient(\n                135deg,\n                color-mix(in srgb, var(--background-color, #fff) 24%, #000 76%),\n                color-mix(in srgb, var(--background-color, #fff) 8%, #000 92%)\n            );background-position:center;background-repeat:no-repeat;background-size:cover;}.blurhash-placeholder-ready.svelte-ohoxs0 {background-image:var(--blurhash-placeholder-image);}.blurhash-placeholder.svelte-ohoxs0::after {content:\"\";position:absolute;inset:0;background:linear-gradient(\n            180deg,\n            rgba(0, 0, 0, 0.08),\n            rgba(0, 0, 0, 0.28)\n        );}:root.dark .ehagaki-app-root .blurhash-placeholder.svelte-ohoxs0::after,\n    :host(.dark) .ehagaki-app-root .blurhash-placeholder.svelte-ohoxs0::after {background:linear-gradient(\n            180deg,\n            rgba(0, 0, 0, 0.14),\n            rgba(0, 0, 0, 0.38)\n        );}"
};
function Gn(e, i) {
	r(i, !0), t(e, Wn);
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
			return r.data.set(H(t, 32, 32)), n.putImageData(r, 0, 0), e.toDataURL("image/png");
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
	var d = Un();
	let m;
	A((e, t) => {
		m = f(d, 1, e, "svelte-ohoxs0", m, { "blurhash-placeholder-ready": t }), P(d, D(l));
	}, [() => n(`blurhash-placeholder ${s()}`.trim()), () => !!D(c)]), h(e, d), p();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryMediaCache.svelte.ts
function Kn(e) {
	return {
		url: e.url,
		alt: e.alt,
		mimeType: e.mimeType,
		blurhash: e.blurhash,
		dim: e.dim,
		kind: yt({
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
function qn(e, t) {
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
function Jn(e) {
	let t = E({ items: [] }), n = /* @__PURE__ */ new Map(), r = 0, i = "", a = !1;
	function o(e) {
		let t = Kn(e), r = Z.getCachedMediaDescriptorSnapshot(e.url);
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
		let t = Kn(e);
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
		let f = e.getMedia(), p = qn(f, Z.canUsePersistentCache());
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
var Yn = /:([^\s:]+):/g, Xn = {
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
function Zn(e) {
	return e.nextUntil === null ? !1 : e.status === "success" ? e.hasMore : e.events.length > 0;
}
function Qn(e, t) {
	return e ? {
		status: e.name ? "resolved" : "failed",
		name: e.name
	} : {
		status: t ? "loading" : "failed",
		name: null
	};
}
function $n(e, t) {
	return z.sanitizeExternalRelayUrls([
		...e?.channelRelayHints ?? [],
		...e?.fetchedRelays ?? [],
		...e?.relayHints ?? [],
		...e?.acceptedRelays ?? [],
		...t?.relayHints ?? [],
		...t?.relays ?? []
	], { limit: 8 });
}
function er(e, t, n) {
	let r = Math.max(1, Math.ceil(t / n));
	return t === 0 ? 1 : Math.min(e, r);
}
var tr = {
	hour: "numeric",
	minute: "2-digit"
}, nr = {
	month: "numeric",
	day: "numeric",
	...tr
}, rr = {
	year: "numeric",
	month: "numeric",
	day: "numeric"
}, ir = {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit"
}, ar = /* @__PURE__ */ new Map();
function or(e, t) {
	let n = ar.get(t);
	n || (n = /* @__PURE__ */ new Map(), ar.set(t, n));
	let r = e ?? "", i = n.get(r);
	return i || (i = new Intl.DateTimeFormat(e ?? void 0, t), n.set(r, i)), i;
}
function sr(e, t = Date.now()) {
	let n = new Date(e), r = new Date(t);
	return ur(n, r) ? or(void 0, tr).format(n) : n.getFullYear() === r.getFullYear() ? or(void 0, nr).format(n) : or(void 0, rr).format(n);
}
function cr(e, t) {
	return or(t, ir).format(new Date(e));
}
function lr(e, t, n = Date.now()) {
	let r = new Date(e), i = new Date(n);
	return ur(r, i) ? fr(0, t) : dr(r, i) ? fr(-1, t) : r.getFullYear() === i.getFullYear() ? new Intl.DateTimeFormat(t ?? void 0, {
		month: "numeric",
		day: "numeric",
		weekday: "short"
	}).format(r) : new Intl.DateTimeFormat(t ?? void 0, {
		year: "numeric",
		month: "numeric"
	}).format(r);
}
function ur(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
function dr(e, t) {
	let n = new Date(t);
	return n.setHours(0, 0, 0, 0), n.setDate(n.getDate() - 1), ur(e, n);
}
function fr(e, t) {
	return new Intl.RelativeTimeFormat(t ?? void 0, { numeric: "auto" }).format(e, "day");
}
function pr(e) {
	return e.trim() || " ";
}
function mr(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) {
		let e = vt(r.url);
		if (!e || n.has(e)) continue;
		n.add(e);
		let i = yt({
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
function hr(e) {
	let t = wr(e.length), n = [], r = 0;
	for (let i = 0; i < t.length; i += 1) {
		let a = t[i], o = e.slice(r, r + a);
		r += a, n.push({
			items: o,
			slotCount: Tr({
				totalCount: e.length,
				rowLength: o.length,
				isFinalRow: i === t.length - 1
			})
		});
	}
	return n;
}
function gr(e) {
	return e.map((e) => ({
		id: e.id,
		src: e.url,
		alt: e.alt,
		type: "image",
		dim: e.dim
	}));
}
function _r(e) {
	return vr(e).aspectRatio;
}
function vr(e) {
	let t = e.fallback ?? (e.kind === "video" ? "16 / 9" : "1 / 1"), n = Sr(e.dim);
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
function yr(e) {
	return e.hasFetchFailed ? "error" : e.previewObjectUrl ? "ready" : e.cached || e.isLoadingPreview ? "cache-materializing" : e.isCaching ? "loading" : (e.hasResolvedCache, e.hasMetadataHint ? "placeholder" : "unknown");
}
function br(e) {
	let t = mr(e), n = t.filter((e) => e.kind === "image");
	return {
		items: t,
		images: n,
		videos: t.filter((e) => e.kind === "video"),
		others: t.filter((e) => e.kind === "other"),
		imageRows: hr(n),
		fullscreenMediaItems: gr(n)
	};
}
function xr(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) for (let e of r.media) {
		let r = bt(e.url);
		r && !n.has(r) && (n.add(r), t.push(e.url));
	}
	return t;
}
function Sr(e) {
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
function Cr(e) {
	let t = pr(e.content), n = Nt(e.tags), r = Er(e.media ?? []), i = [], a = /* @__PURE__ */ new Set(), o = 0;
	for (let e of t.matchAll(Yn)) {
		let s = e.index ?? -1, c = e[1] ?? "", l = e[0] ?? "";
		if (s < 0 || !l) continue;
		let u = At(c), d = u ? n.get(u) : void 0;
		d && (s > o && Dr(i, t.slice(o, s), r), i.push({
			type: "emoji",
			shortcode: d.shortcode,
			shortcodeLower: u,
			rawShortcodeText: l,
			url: d.url
		}), a.add(d.url), o = s + l.length);
	}
	return o < t.length && Dr(i, t.slice(o), r), i.length === 0 && i.push({
		type: "text",
		text: t
	}), {
		segments: i,
		emojiUrls: [...a]
	};
}
function wr(e) {
	let t = Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
	if (t === 0) return [];
	let n = Xn[t];
	if (n) return [...n];
	let r = Array.from({ length: Math.floor(t / 3) }, () => 3), i = t % 3;
	return i > 0 && r.push(i), r;
}
function Tr(e) {
	let { totalCount: t, rowLength: n, isFinalRow: r } = e;
	return r && t >= 7 && n < 3 || n >= 3 ? 3 : n === 2 ? 2 : 1;
}
function Er(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = bt(n.url);
		e && !t.has(e) && t.set(e, n);
	}
	return t;
}
function Dr(e, t, n) {
	if (!t) return;
	let r = 0;
	for (let i of St(t)) {
		if (!i.isValidHttpUrl || !i.href) continue;
		let a = bt(i.displayText), o = n.get(a);
		Or(e, t.slice(r, i.candidateStart)), o ? e.push({
			type: "media",
			url: i.displayText,
			normalizedUrl: a,
			media: o
		}) : e.push({
			type: "link",
			text: i.displayText,
			href: i.href
		}), Or(e, i.trailingText), r = i.candidateEnd;
	}
	r < t.length && Or(e, t.slice(r));
}
function Or(e, t) {
	if (!t) return;
	let n = e[e.length - 1];
	n?.type === "text" ? n.text += t : e.push({
		type: "text",
		text: t
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryMediaList.svelte
var kr = s("<div class=\"copy-icon svg-icon svelte-8yjcw8\"></div>"), Ar = s("<div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><button type=\"button\" class=\"post-history-media-retry-button svelte-8yjcw8\"> </button></div>"), jr = s("<div class=\"post-history-media-placeholder-loader svelte-8yjcw8\"><!></div>"), Mr = s("<div><!> <!> <!></div>"), Nr = s("<img class=\"post-history-media-image post-history-media-image-single-stage svelte-8yjcw8\" loading=\"lazy\" decoding=\"async\"/>"), Pr = s("<div class=\"post-history-media-layout-frame post-history-single-image-layout-frame svelte-8yjcw8\"><!></div>"), Fr = s("<img class=\"post-history-media-image svelte-8yjcw8\" loading=\"lazy\" decoding=\"async\"/>"), Ir = s("<button type=\"button\"><!></button>"), Lr = s("<div class=\"post-history-media-placeholder-loader post-history-media-placeholder-loader-single svelte-8yjcw8\"><!></div>"), Rr = s("<div class=\"post-history-image-cell svelte-8yjcw8\"><div><!> <!> <!></div></div>"), zr = s("<div class=\"post-history-image-row svelte-8yjcw8\"></div>"), Br = s("<div></div>"), Vr = s("<button type=\"button\" class=\"post-history-image-toggle svelte-8yjcw8\"> </button>"), Hr = s("<video class=\"post-history-media-video svelte-8yjcw8\" controls=\"\" playsinline=\"\" preload=\"metadata\"><track kind=\"captions\" class=\"svelte-8yjcw8\"/></video>", 2), Ur = s("<button type=\"button\" class=\"post-history-media-retry-button svelte-8yjcw8\"> </button>"), Wr = s("<div><!> <div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><!></div></div>"), Gr = s("<article class=\"post-history-video-card svelte-8yjcw8\"><div class=\"post-history-video-card-header svelte-8yjcw8\"><span class=\"post-history-video-card-label svelte-8yjcw8\"> </span> <!></div> <div class=\"post-history-video-media-frame svelte-8yjcw8\"><!></div></article>"), Kr = s("<div class=\"post-history-video-list svelte-8yjcw8\"></div>"), qr = s("<div class=\"post-history-other-media-card svelte-8yjcw8\"><div class=\"post-history-other-media-header svelte-8yjcw8\"><span class=\"post-history-other-media-label svelte-8yjcw8\"> </span> <!></div> <div><div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><!></div> <!></div></div>"), Jr = s("<div class=\"post-history-other-media-list svelte-8yjcw8\"></div>"), Yr = s("<div class=\"post-history-media-section svelte-8yjcw8\"><!> <!> <!> <!></div>"), Xr = {
	hash: "svelte-8yjcw8",
	code: ".post-history-media-section.svelte-8yjcw8 {display:flex;flex-direction:column;gap:10px;}.post-history-image-toggle.svelte-8yjcw8 {align-self:flex-start;padding:4px 10px;border:1px solid var(--border-hr);border-radius:999px;background:var(--bg-input);color:var(--text);font:inherit;cursor:pointer;}.post-history-image-grid.svelte-8yjcw8 {display:flex;flex-direction:column;justify-content:center;align-items:center;border-radius:12px;overflow:hidden;gap:2px;}.post-history-image-row.svelte-8yjcw8 {display:grid;grid-template-columns:repeat(\n            var(--post-history-image-columns),\n            minmax(0, 1fr)\n        );width:100%;gap:2px;}.post-history-image-cell.svelte-8yjcw8 {position:relative;min-width:0;}.post-history-image-surface-frame.svelte-8yjcw8 {position:relative;width:100%;.post-history-media-surface:where(.svelte-8yjcw8) {font-size:0;display:block;width:100%;padding:0;border:0;background-color:transparent;text-align:start;cursor:pointer;margin-inline:auto;&:active:not(:disabled) {scale:1;}}}\n\n    /* 単体画像のときグリッド側のボーダーを無効化 */.post-history-image-grid-single.svelte-8yjcw8 {border:none;border-radius:0;overflow:visible;}.post-history-image-surface-frame-single.svelte-8yjcw8 {max-width:100%;margin-inline:0;border-radius:12px;overflow:hidden;}.post-history-image-surface.svelte-8yjcw8 {overflow:hidden;}.post-history-image-surface-single.svelte-8yjcw8 {display:block;min-height:100px;}.post-history-media-layout-frame.svelte-8yjcw8 {position:relative;width:100%;max-width:100%;overflow:hidden;background:transparent;}.post-history-single-image-layout-frame.svelte-8yjcw8 {position:relative;padding:0;display:grid;place-items:center;justify-self:stretch;align-self:stretch;overflow:hidden;background:transparent;}.post-history-image-placeholder-single.svelte-8yjcw8 {position:absolute;inset:0;display:grid;place-items:center;width:100%;height:100%;min-height:0;}.post-history-media-image.svelte-8yjcw8,\n    .post-history-media-placeholder.svelte-8yjcw8,\n    .post-history-media-layout-frame.svelte-8yjcw8 {width:100%;max-width:100%;}.post-history-media-image.svelte-8yjcw8 {display:block;height:100%;object-fit:cover;}.post-history-media-image-single.svelte-8yjcw8 {height:auto;margin-inline:auto;}.post-history-media-image-single-stage.svelte-8yjcw8 {position:relative;z-index:1;}.post-history-media-video.svelte-8yjcw8 {display:block;width:100%;max-height:300px;height:100%;object-fit:contain;border-radius:10px;background:color-mix(\n            in srgb,\n            var(--background-color, #fff) 92%,\n            #000 8%\n        );}.post-history-video-media-frame.svelte-8yjcw8 {width:100%;max-height:300px;overflow:hidden;border-radius:10px;}.post-history-media-placeholder.svelte-8yjcw8 {display:flex;flex-direction:column;gap:8px;align-items:flex-start;justify-content:center;padding:12px;text-align:start;position:relative;isolation:isolate;height:auto;aspect-ratio:var(--post-history-media-aspect-ratio, 1 / 1);overflow-wrap:anywhere;margin-inline:auto;}.post-history-media-placeholder-content.svelte-8yjcw8 {position:relative;z-index:1;display:flex;flex-direction:column;gap:8px;width:100%;}.post-history-media-placeholder-loader.svelte-8yjcw8 {position:absolute;inset:auto 8px 8px auto;z-index:2;pointer-events:none;}.post-history-media-placeholder-loader-single.svelte-8yjcw8 {z-index:3;}.post-history-media-placeholder-uncached.svelte-8yjcw8 {--post-history-placeholder-stripe-soft: light-dark(\n            color-mix(in srgb, var(--background-color, #fff) 94%, #000 6%),\n            color-mix(in srgb, var(--background-color, #111) 94%, #fff 6%)\n        );--post-history-placeholder-stripe-strong: light-dark(\n            color-mix(in srgb, var(--background-color, #fff) 88%, #000 12%),\n            color-mix(in srgb, var(--background-color, #111) 88%, #fff 12%)\n        );background:repeating-linear-gradient(\n            -45deg,\n            var(--post-history-placeholder-stripe-soft),\n            var(--post-history-placeholder-stripe-soft) 10px,\n            var(--post-history-placeholder-stripe-strong) 10px,\n            var(--post-history-placeholder-stripe-strong) 20px\n        );}.post-history-image-placeholder-single.post-history-media-placeholder.svelte-8yjcw8 {height:100%;margin-inline:0;aspect-ratio:auto;}.post-history-media-placeholder-blurhash.svelte-8yjcw8 {background:color-mix(\n            in srgb,\n            var(--background-color, #fff) 18%,\n            #000 82%\n        );}.post-history-media-retry-button.svelte-8yjcw8 {width:100%;height:100%;padding:6px 12px;border:1px solid var(--border, #ccc);border-radius:10px;color:var(--text, #111);font:inherit;cursor:pointer;}.post-history-video-list.svelte-8yjcw8,\n    .post-history-other-media-list.svelte-8yjcw8 {display:flex;flex-direction:column;gap:10px;}.post-history-video-card.svelte-8yjcw8,\n    .post-history-other-media-card.svelte-8yjcw8 {display:flex;flex-direction:column;width:100%;border-radius:12px;border:1px solid var(--border-hr);background:var(--bg-input);overflow:hidden;}.post-history-video-card-header.svelte-8yjcw8,\n    .post-history-other-media-header.svelte-8yjcw8 {display:flex;align-items:center;justify-content:space-between;}.post-history-video-card-label.svelte-8yjcw8,\n    .post-history-other-media-label.svelte-8yjcw8 {min-width:0;padding:4px 8px;overflow-wrap:anywhere;color:var(--text-muted);font-size:0.875rem;line-height:1.2;}.post-history-video-placeholder.svelte-8yjcw8 {width:100%;height:100%;aspect-ratio:auto;padding:0 12px;}button.post-history-media-copy-button.circle.copy {min-width:36px;width:36px;height:36px;min-height:36px;z-index:2;}button.post-history-media-copy-button-image.circle.copy {position:absolute;inset:8px 8px auto auto;}button.post-history-video-copy-button.circle.copy {position:relative;top:auto;right:auto;flex-shrink:0;}\n\n    @keyframes svelte-8yjcw8-post-history-media-loading {\n        0% {\n            background-position: 100% 50%;\n        }\n        100% {\n            background-position: -100% 50%;\n        }\n    }.post-history-media-video {background-color:light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));}"
};
function Zr(e, n) {
	r(n, !0), t(e, Xr);
	let o = () => ne(ve, "$_", s), [s, d] = te(), g = (e, t = u, n = u) => {
		{
			let r = F(() => `post-history-media-copy-button ${n()}`), i = F(() => U(t().kind, t().url)), a = F(() => U(t().kind, t().url)), o = F(() => pe(t().kind));
			gt(e, {
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
					var n = kr();
					h(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	}, v = (e, t = u, n = u, r = u, i = u, a = u) => {
		var s = Mr();
		let c;
		var d = M(s), p = (e) => {
			Gn(e, { get blurhash() {
				return t().blurhash;
			} });
		};
		L(d, (e) => {
			i() && e(p);
		});
		var g = O(d, 2), v = (e) => {
			var n = Ar(), r = M(n), i = S(r, !0);
			l(n), A((e) => m(i, e), [() => o()("postHistory.mediaFetchAndCache")]), _("click", r, () => Ae(t())), h(e, n);
		};
		L(g, (e) => {
			a() && e(v);
		});
		var y = O(g, 2), b = (e) => {
			var t = jr(), n = M(t);
			be(n, {
				showLoader: !0,
				text: !1,
				loaderSize: 34
			}), l(t), h(e, t);
		}, x = F(() => Ee(t(), n(), Se(t())));
		L(y, (e) => {
			D(x) && e(b);
		}), l(s), A((e, t) => {
			c = f(s, 1, `post-history-media-placeholder ${r()}`, "svelte-8yjcw8", c, {
				"post-history-media-placeholder-blurhash": i(),
				"post-history-image-placeholder-single": n().isSingleImage
			}), P(s, n().isSingleImage ? void 0 : n().surfaceStyle), I(s, "aria-label", e), I(s, "title", t);
		}, [() => Le(t()), () => H(t())]), h(e, s);
	}, y = "160px 0px", b = k(n, "scrollRoot", 3, null), w = k(n, "onImageOpen", 3, void 0), T = k(n, "mediaLayout", 3, void 0), j = k(n, "maxVisibleImages", 3, void 0), re = N(E({})), R = /* @__PURE__ */ new Set(), z = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ae = N(!1), B = F(() => T() ?? br(n.media)), V = Jn({ getMedia: () => D(B).items }), oe = F(() => new Map(V.state.items.map((e) => [e.url, e]))), se = F(() => j() !== void 0 && D(B).images.length > j()), ce = F(() => {
		let e = D(se) && !D(ae) ? j() : Infinity;
		return D(B).imageRows.flatMap((t) => {
			let n = t.items.slice(0, e).map((e) => de(e));
			return e -= n.length, n.length ? [{
				...t,
				items: n
			}] : [];
		});
	}), le = F(() => D(B).videos.map((e) => de(e))), ue = F(() => D(B).others.map((e) => de(e)));
	function H(e) {
		let t = e.alt?.trim();
		if (t) return t;
		try {
			return new URL(e.url).pathname.split("/").filter(Boolean).at(-1) || e.url;
		} catch {
			return e.url;
		}
	}
	function de(e) {
		let t = D(oe).get(e.url);
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
	function fe(e) {
		return e === "video" ? "videoContextMenu" : "imageContextMenu";
	}
	function U(e, t) {
		let n = fe(e), r = D(re)[t];
		return r === "copied" ? o()(`${n}.copySuccess`) : r === "failed" ? o()(`${n}.copyFailed`) : o()(`${n}.copyUrl`);
	}
	function pe(e) {
		return o()(`${fe(e)}.copySuccess`);
	}
	function W(e) {
		return `${o()("postHistory.mediaOpen")} ${H(e)}`;
	}
	function G(e) {
		let [t, n] = e.split("/"), r = Number(t?.trim()), i = Number(n?.trim());
		return !Number.isFinite(r) || !Number.isFinite(i) || i <= 0 ? 1 : r / i;
	}
	function me(e) {
		return Number.isInteger(e) ? `${e}` : e.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
	}
	function K(e) {
		return `min(100%, ${me(300 * G(e))}px)`;
	}
	function he(e) {
		return `min(100%, ${me(Math.max(100, 100 * G(e)))}px)`;
	}
	function ge(e) {
		return `width: max(${K(e)}, ${he(e)});`;
	}
	function _e() {
		return "width: 100%; min-height: 100px;";
	}
	function ye(e) {
		return G(e) < .3333333333333333 ? "100 / 300" : e;
	}
	function q(e) {
		return [
			`aspect-ratio: ${ye(e)};`,
			"width: 100%;",
			"max-height: 300px;",
			"min-height: 100px;",
			"padding: 0;"
		].join(" ");
	}
	function J(e) {
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
	function Y(e) {
		return [`aspect-ratio: ${e};`, "width: 100%;"].join(" ");
	}
	function xe(e) {
		return !!(e.blurhash?.trim() || e.dim?.trim());
	}
	function Se(e) {
		return yr({
			hasResolvedCache: e.hasResolvedCache,
			cached: e.cached,
			previewObjectUrl: e.previewObjectUrl,
			isLoadingPreview: e.isLoadingPreview,
			isCaching: e.isCaching,
			hasFetchFailed: e.hasFetchFailed,
			hasMetadataHint: xe(e)
		});
	}
	function Ce(e) {
		let t = we(e.item, e.slotCount), n = Te(e.item) ? "cover" : "contain", r = vr({
			dim: e.item.dim,
			kind: e.item.kind
		});
		return e.isSingleImage ? {
			aspectRatio: t,
			dimensionHints: r,
			isSingleImage: !0,
			frameStyle: ge(t),
			surfaceStyle: _e(),
			layoutFrameStyle: q(t),
			imageStyle: J(n)
		} : {
			aspectRatio: t,
			dimensionHints: r,
			isSingleImage: !1,
			surfaceStyle: Y(t),
			imageStyle: `object-fit: ${n};`
		};
	}
	function we(e, t) {
		let n = z.get(e.id);
		if (n) return n;
		let r = D(B).images.length === 4 ? "4 / 3" : t === 1 ? _r({
			dim: e.dim,
			kind: e.kind
		}) : "1 / 1";
		return z.set(e.id, r), r;
	}
	function Te(e) {
		let t = ie.get(e.id);
		if (t !== void 0) return t;
		let n = !!e.dim?.trim();
		return ie.set(e.id, n), n;
	}
	function Ee(e, t, n) {
		return !t.isSingleImage && Ne(e, n);
	}
	function De(e, t, n) {
		return t.isSingleImage && Ne(e, n);
	}
	function Oe(e) {
		R.has(e) || (R.add(e), V.fetchAndCacheMedia(e));
	}
	async function ke(e, t) {
		t.stopPropagation(), t.preventDefault();
		let n = await xt(e.url, "URL", navigator, window);
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
		V.fetchAndCacheMedia(e.url);
	}
	function je(e, t) {
		if (!e.cached) return;
		let n = D(B).fullscreenMediaItems.findIndex((t) => t.id === e.id);
		n < 0 || w()?.({
			index: n,
			mediaList: D(B).fullscreenMediaItems,
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
		return `${ze(e)} ${H(e)}`;
	}
	function Re(e) {
		let t = z.get(e.id);
		if (t) return t;
		let n = _r({
			dim: e.dim,
			kind: e.kind
		});
		return z.set(e.id, n), ie.set(e.id, !!e.dim?.trim()), n;
	}
	function ze(e) {
		return !e.hasResolvedCache || e.isLoadingPreview ? o()("postHistory.mediaLoading") : e.cached ? o()("postHistory.mediaCached") : e.hasFetchFailed ? o()("postHistory.mediaLoadFailed") : e.isCaching ? o()("postHistory.mediaLoading") : o()("postHistory.mediaNotCached");
	}
	var Be = i(), Ve = x(Be), He = (e) => {
		var t = Yr(), n = M(t), r = (e) => {
			var t = Br();
			let n;
			a(t, 21, () => D(ce), c, (e, t) => {
				var n = zr();
				a(n, 21, () => D(t).items, (e) => e.id, (e, n) => {
					let r = F(() => D(B).images.length === 1), i = F(() => Ce({
						item: D(n),
						slotCount: D(t).slotCount,
						isSingleImage: D(r)
					})), a = F(() => Se(D(n))), o = F(() => Pe(D(n), D(a)));
					var s = Rr(), c = M(s);
					let u;
					var d = M(c), p = (e) => {
						var t = Ir();
						let a;
						var o = M(t), s = (e) => {
							var t = Pr(), r = M(t), a = (e) => {
								var t = Nr();
								A((e) => {
									I(t, "src", D(n).previewObjectUrl), I(t, "alt", e), P(t, D(i).imageStyle), I(t, "width", D(i).dimensionHints.width), I(t, "height", D(i).dimensionHints.height);
								}, [() => D(n).alt || H(D(n))]), h(e, t);
							};
							L(r, (e) => {
								D(n).previewObjectUrl && e(a);
							}), l(t), A(() => P(t, D(i).layoutFrameStyle)), h(e, t);
						}, c = (e) => {
							var t = Fr();
							A((e) => {
								I(t, "src", D(n).previewObjectUrl), I(t, "alt", e), P(t, D(i).imageStyle), I(t, "width", D(i).dimensionHints.width), I(t, "height", D(i).dimensionHints.height);
							}, [() => D(n).alt || H(D(n))]), h(e, t);
						};
						L(o, (e) => {
							D(r) ? e(s) : D(n).previewObjectUrl && e(c, 1);
						}), l(t), A((e, n) => {
							a = f(t, 1, "post-history-media-surface post-history-image-surface svelte-8yjcw8", null, a, { "post-history-image-surface-single": D(r) }), P(t, D(i).surfaceStyle), I(t, "aria-label", e), I(t, "title", n);
						}, [() => W(D(n)), () => H(D(n))]), _("click", t, (e) => je(D(n), e.currentTarget instanceof HTMLElement ? e.currentTarget : null)), h(e, t);
					}, m = F(() => Fe(D(a))), x = (e) => {
						var t = Pr(), r = M(t);
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
						var t = Lr(), n = M(t);
						be(n, {
							showLoader: !0,
							text: !1,
							loaderSize: 34
						}), l(t), h(e, t);
					}, T = F(() => De(D(n), D(i), D(a)));
					L(C, (e) => {
						D(T) && e(w);
					});
					var E = O(C, 2);
					g(E, () => D(n), () => "post-history-media-copy-button-image"), l(c), l(s), ee(s, (e, t) => Ft?.(e, t), () => ({
						enabled: Me(D(n)),
						once: !0,
						root: b(),
						rootMargin: y,
						onEnterView: () => Oe(D(n).url)
					})), A(() => {
						u = f(c, 1, "post-history-image-surface-frame svelte-8yjcw8", null, u, { "post-history-image-surface-frame-single": D(r) }), P(c, D(r) ? D(i).frameStyle : void 0);
					}), h(e, s);
				}), l(n), A(() => P(n, `--post-history-image-columns: ${D(t).slotCount};`)), h(e, n);
			}), l(t), A(() => n = f(t, 1, "post-history-image-grid svelte-8yjcw8", null, n, { "post-history-image-grid-single": D(B).images.length === 1 })), h(e, t);
		};
		L(n, (e) => {
			D(ce).length > 0 && e(r);
		});
		var i = O(n, 2), s = (e) => {
			var t = Vr(), n = S(t, !0);
			A((e) => {
				I(t, "aria-expanded", D(ae)), m(n, e);
			}, [() => D(ae) ? o()("postHistory.hideExtraImages") : o()("postHistory.showAllImages", { values: { count: D(B).images.length } })]), _("click", t, () => C(ae, !D(ae))), h(e, t);
		};
		L(i, (e) => {
			D(se) && e(s);
		});
		var u = O(i, 2), d = (e) => {
			var t = Kr();
			a(t, 21, () => D(le), (e) => e.id, (e, t) => {
				let n = F(() => Re(D(t))), r = F(() => Se(D(t))), i = F(() => Pe(D(t), D(r)));
				var a = Gr(), s = M(a), c = M(s), u = S(c, !0), d = O(c, 2);
				g(d, () => D(t), () => "post-history-video-copy-button"), l(s);
				var p = O(s, 2), v = M(p), x = (e) => {
					var n = Hr();
					A(() => I(n, "src", D(t).previewObjectUrl)), h(e, n);
				}, C = (e) => {
					var n = Wr();
					let r;
					var a = M(n), s = (e) => {
						Gn(e, { get blurhash() {
							return D(t).blurhash;
						} });
					};
					L(a, (e) => {
						D(i) && e(s);
					});
					var c = O(a, 2), u = M(c), d = (e) => {
						var n = Ur(), r = S(n, !0);
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
					}, [() => Le(D(t)), () => H(D(t))]), h(e, n);
				};
				L(v, (e) => {
					D(t).cached && D(t).previewObjectUrl ? e(x) : e(C, -1);
				}), l(p), l(a), ee(a, (e, t) => Ft?.(e, t), () => ({
					enabled: Me(D(t)),
					once: !0,
					root: b(),
					rootMargin: y,
					onEnterView: () => Oe(D(t).url)
				})), A((e, t) => {
					m(u, e), P(p, t);
				}, [() => H(D(t)), () => `${Y(D(n))} max-height: 300px;`]), h(e, a);
			}), l(t), h(e, t);
		};
		L(u, (e) => {
			D(le).length > 0 && e(d);
		});
		var p = O(u, 2), x = (e) => {
			var t = Jr();
			a(t, 21, () => D(ue), (e) => e.id, (e, t) => {
				let n = F(() => Se(D(t)));
				var r = qr(), i = M(r), a = M(i), s = S(a, !0), c = O(a, 2);
				g(c, () => D(t), () => "post-history-video-copy-button"), l(i);
				var u = O(i, 2);
				let d;
				var p = M(u), v = M(p), x = (e) => {
					var n = Ur(), r = S(n, !0);
					A((e) => m(r, e), [() => o()("postHistory.mediaFetchAndCache")]), _("click", n, () => Ae(D(t))), h(e, n);
				};
				L(v, (e) => {
					D(t).hasFetchFailed && e(x);
				}), l(p);
				var C = O(p, 2), w = (e) => {
					var t = jr(), n = M(t);
					be(n, {
						showLoader: !0,
						text: !1,
						loaderSize: 34
					}), l(t), h(e, t);
				}, T = F(() => Ne(D(t), D(n)));
				L(C, (e) => {
					D(T) && e(w);
				}), l(u), l(r), ee(r, (e, t) => Ft?.(e, t), () => ({
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
					() => H(D(t)),
					() => Le(D(t)),
					() => H(D(t))
				]), h(e, r);
			}), l(t), h(e, t);
		};
		L(p, (e) => {
			D(ue).length > 0 && e(x);
		}), l(t), h(e, t);
	};
	L(Ve, (e) => {
		D(B).items.length > 0 && e(He);
	}), h(e, Be), p(), d();
}
g(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/components/TextLinkSegments.svelte
var Qr = s("<a class=\"reference-content-link svelte-1dq7r7\" target=\"_blank\" rel=\"noopener noreferrer\"> </a>"), $r = s("<span> </span>"), ei = {
	hash: "svelte-1dq7r7",
	code: ".reference-content-link.svelte-1dq7r7 {overflow-wrap:anywhere;word-break:break-word;}.reference-content-link.svelte-1dq7r7:visited {color:var(--link-visited);}"
};
function ti(e, n) {
	t(e, ei);
	var r = i(), o = x(r);
	a(o, 17, () => n.segments, c, (e, t) => {
		var n = i(), r = x(n), a = (e) => {
			var n = Qr(), r = S(n, !0);
			A(() => {
				I(n, "href", D(t).href), m(r, D(t).text);
			}), h(e, n);
		}, o = (e) => {
			var n = $r(), r = S(n, !0);
			A(() => m(r, D(t).text)), h(e, n);
		};
		L(r, (e) => {
			D(t).type === "link" ? e(a) : e(o, -1);
		}), h(e, n);
	}), h(e, r);
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPreviewContent.svelte
var ni = s("<span class=\"post-history-custom-emoji-slot post-history-custom-emoji-failed svelte-yrehuj\" role=\"img\" tabindex=\"0\"> </span>"), ri = s("<img class=\"post-history-custom-emoji svelte-yrehuj\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), ii = s("<span class=\"post-history-custom-emoji-placeholder svelte-yrehuj\" aria-hidden=\"true\"></span>"), ai = s("<span class=\"post-history-custom-emoji-slot svelte-yrehuj\"><!></span>"), oi = s("<div></div> <!>", 1), si = s("<div class=\"post-history-preview-content svelte-yrehuj\"><!></div>"), ci = {
	hash: "svelte-yrehuj",
	code: ".post-history-preview-content.svelte-yrehuj {position:relative;display:flex;flex-direction:column;gap:6px;}.post-history-preview-text.svelte-yrehuj {overflow-wrap:anywhere;white-space:pre-wrap;font-size:var(--post-content-font-size, 1rem);line-height:var(--post-content-line-height, 1.5);}.post-history-preview-text-collapsed.svelte-yrehuj {max-height:calc(5 * var(--post-content-line-height, 1.5) * 1em);overflow:hidden;}.post-history-custom-emoji-slot.svelte-yrehuj {display:inline-grid;margin:0;padding:0;}.post-history-custom-emoji.svelte-yrehuj,\n    .post-history-custom-emoji-placeholder.svelte-yrehuj {width:100%;height:100%;}.post-history-custom-emoji.svelte-yrehuj {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-history-custom-emoji-failed.svelte-yrehuj {display:inline-grid;place-items:center;overflow:hidden;border-radius:4px;background:rgba(127, 127, 127, 0.18);font-size:0.45em;line-height:1;vertical-align:bottom;white-space:nowrap;cursor:help;}.post-history-custom-emoji-placeholder.svelte-yrehuj {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}"
};
function li(e, o) {
	r(o, !0), t(e, ci);
	let s = k(o, "textOverlay", 3, void 0), g = k(o, "emojiLoadStateByUrl", 19, () => ({})), _ = k(o, "emojiImageMetaByUrl", 19, () => ({})), v = k(o, "previewCollapseAction", 3, () => ({})), y = k(o, "previewCollapseEventId", 3, ""), b = k(o, "previewContentId", 3, void 0), C = k(o, "isCollapsed", 3, !1), w = k(o, "emojiSize", 3, 30), T = k(o, "fontSize", 3, "1rem"), E = k(o, "lineHeight", 3, 1.5), te = k(o, "contentClass", 3, ""), ne = k(o, "collapsedContentClass", 3, ""), j = /* @__PURE__ */ new Map();
	function N(e) {
		return e.type !== "media";
	}
	let re = F(() => o.previewContent.segments.filter(N)), R = F(() => D(re).some((e) => e.type === "emoji" || e.type === "link" || e.type === "text" && e.text.trim().length > 0));
	function z(e) {
		return g()[e] === "ready";
	}
	function ie(e) {
		return g()[e] === "failed";
	}
	function ae(e) {
		return Number.isInteger(e) ? `${e}` : e.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
	}
	function B(e) {
		let t = j.get(e);
		if (t === void 0) {
			let n = _()[e]?.aspectRatio;
			t = typeof n == "number" && Number.isFinite(n) && n > 0 ? w() * n : w(), j.set(e, t);
		}
		return [
			`width: ${ae(t)}px;`,
			`height: ${w()}px;`,
			"vertical-align: bottom;"
		].join(" ");
	}
	var V = si(), oe = M(V), se = (e) => {
		var t = oi(), r = x(t);
		a(r, 21, () => D(re), c, (e, t) => {
			var n = i(), r = x(n), a = (e) => {
				{
					let n = F(() => [D(t)]);
					ti(e, { get segments() {
						return D(n);
					} });
				}
			}, o = (e) => {
				var n = ni(), r = S(n, !0);
				A((e) => {
					P(n, e), I(n, "aria-label", D(t).rawShortcodeText), I(n, "title", D(t).rawShortcodeText), m(r, D(t).rawShortcodeText);
				}, [() => B(D(t).url)]), h(e, n);
			}, s = F(() => ie(D(t).url)), c = (e) => {
				var n = ai(), r = M(n), i = (e) => {
					var n = ri();
					A(() => {
						I(n, "src", D(t).url), I(n, "alt", D(t).rawShortcodeText), I(n, "title", D(t).rawShortcodeText);
					}), h(e, n);
				}, a = F(() => z(D(t).url)), o = (e) => {
					var t = ii();
					h(e, t);
				};
				L(r, (e) => {
					D(a) ? e(i) : e(o, -1);
				}), l(n), A((e) => P(n, e), [() => B(D(t).url)]), h(e, n);
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
	L(oe, (e) => {
		D(R) && e(se);
	}), l(V), A(() => P(V, `--post-content-font-size: ${T()}; --post-content-line-height: ${E()};`)), h(e, V), p();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postContentPreview.ts
function ui(e, t) {
	let n = t.find((e) => e[0] === "content-warning");
	return n && n.length > 2 ? n[2] : e;
}
function di(e) {
	let t = e.tags.find((e) => e[0] === "content-warning"), n = t !== void 0 && t.length > 2, r = e.resolvedBody ? e.sourceContent : ui(e.sourceContent, e.tags), i = e.displayContent ?? r, a = Ne({
		content: r,
		tags: e.tags
	}), o = e.media === void 0 ? a : n ? [...e.media, ...a.filter((t) => !e.media.some((e) => e.url === t.url))] : e.media, s = Cr({
		content: i,
		tags: e.tags,
		media: o
	}), c = br(o);
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
function fi(e, t, n = t) {
	return di({
		kind: e.kind,
		sourceContent: t,
		displayContent: n,
		tags: e.sourceTags,
		resolvedBody: !0
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostContentPreview.svelte
var pi = s("<span class=\"svelte-13idcaf\"> </span>"), mi = s("<span role=\"status\" class=\"svelte-13idcaf\"> </span>"), hi = s("<div class=\"content-warning-prompt svelte-13idcaf\" role=\"group\"><div class=\"content-warning-copy svelte-13idcaf\"><strong> </strong> <!></div> <!> <button type=\"button\" class=\"content-warning-reveal-button svelte-13idcaf\"> </button></div>"), gi = s("<div class=\"post-preview-content\"><!></div>"), _i = s("<div class=\"post-preview-media\"><!></div>"), vi = s("<!> <!> <!> <!>", 1), yi = s("<div><!></div>"), bi = {
	hash: "svelte-13idcaf",
	code: ".post-content-preview.svelte-13idcaf {display:flex;flex-direction:column;gap:var(--post-content-block-gap, 6px);width:100%;max-width:100%;min-width:0;}.content-warning-prompt.svelte-13idcaf {display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;width:100%;max-width:100%;min-width:0;box-sizing:border-box;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 16%);color:var(--text);}.content-warning-copy.svelte-13idcaf {display:flex;flex:1 1 0;flex-direction:column;gap:3px;min-width:0;overflow-wrap:anywhere;}.content-warning-copy.svelte-13idcaf span:where(.svelte-13idcaf) {color:var(--text-muted);font-size:0.9em;}.content-warning-reveal-button.svelte-13idcaf {flex:0 1 auto;height:auto;max-width:100%;min-width:0;min-height:40px;box-sizing:border-box;padding:6px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;cursor:pointer;white-space:normal;overflow-wrap:anywhere;}.content-warning-reveal-button.svelte-13idcaf:hover {border-color:var(--theme);}"
};
function xi(e, n) {
	r(n, !0), t(e, bi);
	let a = () => ne(ve, "$_", o), [o, s] = te(), c = k(n, "loadSensitiveBody", 3, void 0), g = k(n, "resolveSensitiveDisplayContent", 3, void 0), v = k(n, "contentWarningEventId", 3, void 0), y = k(n, "density", 3, "standard"), w = k(n, "emojiLoadStateByUrl", 19, () => ({})), ee = k(n, "emojiImageMetaByUrl", 19, () => ({})), re = k(n, "scrollRoot", 3, null), R = k(n, "maxVisibleImages", 3, void 0), z = k(n, "previewContentId", 3, void 0), ie = k(n, "isTextCollapsed", 3, !1), ae = k(n, "previewCollapseAction", 3, () => ({})), B = k(n, "previewCollapseEventId", 3, ""), V = k(n, "contentClass", 3, ""), oe = k(n, "collapsedContentClass", 3, ""), se = k(n, "renderWhenEmpty", 3, !1), ce = k(n, "onImageOpen", 3, void 0), le = k(n, "betweenContentAndMedia", 3, void 0), ue = k(n, "afterContentAndMedia", 3, void 0), H = k(n, "textOverlay", 3, void 0), de = N(null), fe = N(!1), U = N(void 0), pe = N(!1), W = N(!1), G = 0, me, K = N(E({})), he = N(E({})), ge = F(() => v() === void 0 ? D(fe) : D(de) === v());
	function _e() {
		me?.abort(), me = void 0, G += 1, C(de, null), C(fe, !1), C(U, void 0), C(pe, !1), C(W, !1), C(K, {}, !0), C(he, {}, !0);
	}
	let ye, q, J = F(v), be = F(c);
	b(() => {
		let e = D(J), t = D(be), n = t === q || !!t?.scope && !!q?.scope && t.scope.runtime === q.scope.runtime && t.scope.ownerPubkey === q.scope.ownerPubkey;
		e === ye && n || T(_e), ye = e, q = t;
		let r = !0, i = t?.observe?.((e) => {
			r && (e === "deleted" || e === "invalid" || e === "missing" && D(U) !== void 0) && (_e(), C(W, !0));
		});
		return () => {
			r = !1, i?.();
		};
	}), j(_e);
	let Y = F(() => D(U) === void 0 ? n.model : fi(n.model, D(U), g()?.(D(U)) ?? D(U)));
	b(() => {
		if (!D(ge) || D(U) === void 0 || !c()?.loadEmoji) return;
		let e = D(Y).previewContent.emojiUrls, t = c().loadEmoji, n = G;
		for (let r of e) T(() => D(K)[r]) || w()[r] === "ready" || (C(K, {
			...T(() => D(K)),
			[r]: "loading"
		}, !0), t(r).then((e) => {
			n === G && (C(K, {
				...D(K),
				[r]: e.ready ? "ready" : "failed"
			}, !0), e.ready && e.aspectRatio && C(he, {
				...D(he),
				[r]: { aspectRatio: e.aspectRatio }
			}, !0));
		}).catch(() => {
			n === G && C(K, {
				...D(K),
				[r]: "failed"
			}, !0);
		}));
	});
	async function xe() {
		if (c()) {
			let e = G;
			me?.abort(), me = new AbortController(), C(pe, !0), C(W, !1);
			try {
				let t = await c()(me.signal);
				if (e !== G) return;
				if (t === null) {
					C(W, !0);
					return;
				}
				C(U, t, !0);
			} catch {
				if (e !== G) return;
				C(W, !0);
				return;
			} finally {
				e === G && C(pe, !1);
			}
		}
		v() === void 0 ? C(fe, !0) : C(de, v());
	}
	let Se = F(() => {
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
		var t = yi(), n = M(t), r = (e) => {
			var t = hi(), n = M(t), r = M(n), i = S(r, !0), o = O(r, 2), s = (e) => {
				var t = pi(), n = S(t, !0);
				A(() => m(n, D(Y).contentWarning.reason)), h(e, t);
			};
			L(o, (e) => {
				D(Y).contentWarning.reason && e(s);
			}), l(n);
			var c = O(n, 2), u = (e) => {
				var t = mi(), n = S(t, !0);
				A((e) => m(n, e), [() => a()("postContent.sensitivePayloadLoading")]), h(e, t);
			}, d = (e) => {
				var t = mi(), n = S(t, !0);
				A((e) => m(n, e), [() => a()("postContent.sensitivePayloadUnavailable")]), h(e, t);
			};
			L(c, (e) => {
				D(pe) ? e(u) : D(W) && e(d, 1);
			});
			var f = O(c, 2), p = S(f, !0);
			l(t), A((e, n, r) => {
				I(t, "aria-label", e), m(i, n), f.disabled = D(pe), m(p, r);
			}, [
				() => a()("postContent.contentWarningTitle"),
				() => a()("postContent.contentWarningTitle"),
				() => a()(D(W) ? "postContent.retrySensitivePayload" : "postContent.showContentWarningBody")
			]), _("click", f, () => void xe()), h(e, t);
		}, i = (e) => {
			var t = vi(), n = x(t), r = (e) => {
				var t = gi(), n = M(t);
				{
					let e = F(() => ({
						...w(),
						...D(K)
					})), t = F(() => ({
						...ee(),
						...D(he)
					}));
					li(n, {
						get previewContent() {
							return D(Y).previewContent;
						},
						get emojiLoadStateByUrl() {
							return D(e);
						},
						get emojiImageMetaByUrl() {
							return D(t);
						},
						get previewCollapseAction() {
							return ae();
						},
						get previewCollapseEventId() {
							return B();
						},
						get previewContentId() {
							return z();
						},
						get textOverlay() {
							return H();
						},
						get contentClass() {
							return V();
						},
						get collapsedContentClass() {
							return oe();
						},
						get isCollapsed() {
							return ie();
						},
						get emojiSize() {
							return D(Se).emojiSize;
						},
						get fontSize() {
							return D(Se).fontSize;
						},
						get lineHeight() {
							return D(Se).lineHeight;
						}
					});
				}
				l(t), h(e, t);
			};
			L(n, (e) => {
				D(Y).hasRenderableText && e(r);
			});
			var i = O(n, 2);
			d(i, () => le() ?? u);
			var a = O(i, 2), o = (e) => {
				var t = _i();
				Zr(M(t), {
					get media() {
						return D(Y).media;
					},
					get mediaLayout() {
						return D(Y).mediaLayout;
					},
					get scrollRoot() {
						return re();
					},
					get maxVisibleImages() {
						return R();
					},
					get onImageOpen() {
						return ce();
					}
				}), l(t), h(e, t);
			};
			L(a, (e) => {
				D(Y).hasRenderableMedia && e(o);
			});
			var s = O(a, 2);
			d(s, () => ue() ?? u), h(e, t);
		};
		L(n, (e) => {
			D(Y).contentWarning && !D(ge) ? e(r) : e(i, -1);
		}), l(t), A(() => {
			f(t, 1, `post-content-preview post-content-preview-${y()}`, "svelte-13idcaf"), P(t, `--post-content-block-gap: ${D(Se).gap}px;`);
		}), h(e, t);
	};
	L(we, (e) => {
		(D(Y).hasRenderableText || D(Y).hasRenderableMedia || D(Y).contentWarning || se() || ue()) && e(Te);
	}), h(e, Ce), p(), s();
}
g(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogPresentation.ts
function Si(e) {
	return e.isSearchMode ? e.totalCountKnown === !1 ? { key: e.totalCountStatus === "failed" ? "postHistory.countUnavailable" : "postHistory.countLoading" } : e.totalCount <= 0 ? null : {
		key: "postHistory.searchCountSummary",
		values: { total: e.totalCount }
	} : e.totalCountKnown ? {
		key: "postHistory.visibleCountSummary",
		values: { total: e.totalCount }
	} : e.totalCountStatus === "failed" ? { key: "postHistory.countUnavailable" } : { key: "postHistory.countLoading" };
}
function Ci(e) {
	return e.direction === "older" ? e.isSearchMode ? "postHistory.loadOlderSearchResults" : "postHistory.loadOlder" : e.isSearchMode ? "postHistory.loadNewerSearchResults" : "postHistory.loadNewer";
}
function wi(e) {
	return e.status === "loading" ? { key: "postHistory.checkingReplies" } : e.status === "failed" ? { key: "postHistory.recheckReplies" } : e.status === "loaded" ? e.replyCount === 0 ? { key: "postHistory.recheckReplies" } : e.visible ? { key: "postHistory.hideReplies" } : {
		key: "postHistory.showRepliesWithCount",
		values: { count: e.replyCount }
	} : { key: "postHistory.checkReplies" };
}
function Ti(e) {
	return e.visible ? { key: "postHistory.hideReactions" } : {
		key: "postHistory.showReactionsWithCount",
		values: { count: e.reactionCount }
	};
}
function Ei(e) {
	return e === "+";
}
function Di(e) {
	let t = e.trim();
	return t ? kt(t) ? t : Pt(t) : "+";
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryContextFetchService.ts
var Oi = 5e3, ki = 8, Ai = new class {
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
				a = p, i = new Ae(Math.min(6e3, t.timeoutMs ?? Oi), () => {
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
					let d = Ee(), f = !1, h = () => {
						f || (f = !0, a === "base" ? s = !0 : l = !0, m());
					};
					try {
						let i = it(e, d, { on: { relays: c } }).subscribe({
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
				h(this.resolveRelayUrls(t.relayHints, t.relayConfig), "base"), t.authorHint && (this.lookupAuthorWriteRelaysFn ? this.lookupAuthorWriteRelaysFn(t.authorHint) : st(e).lookup(t.authorHint).then((e) => e.writeRelays)).then((e) => {
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
		let n = ut(e, ki);
		if (n) return n;
		let r = t ? [...z.extractReadRelays(t), ...z.extractWriteRelays(t)] : [], i = z.sanitizeExternalRelayUrls([...e ?? [], ...r], { limit: ki });
		return i.length > 0 ? i : z.sanitizeExternalRelayUrls(R, { limit: ki });
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileRelayTiers.ts
function ji(e) {
	let t = dt(), n = t ? [] : z.sanitizeExternalRelayUrls(ie), r = new Set(n), i = z.sanitizeExternalRelayUrls(e.contextualRelays).filter((e) => !r.has(e)).slice(0, t ? void 0 : e.contextualRelayLimit), a = new Set(i);
	return {
		bootstrap: n,
		contextual: i,
		fallback: t ? [] : z.sanitizeExternalRelayUrls([...R, ...e.fallbackRelays ?? []]).filter((e) => !r.has(e) && !a.has(e))
	};
}
function Mi(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = z.sanitizeExternalRelayUrls(t[r]);
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
var Ni = 3e5, Pi = 18e5, Fi = 6e4, Ii = 30, Li = 4e3, Ri = 12, zi = 50, Bi = 2, Vi = 600, Q = N({}), Hi = /* @__PURE__ */ new Map(), Ui = /* @__PURE__ */ new Map(), Wi = /* @__PURE__ */ new Map(), Gi = /* @__PURE__ */ new Map(), Ki = [], qi = null, Ji = /* @__PURE__ */ new Map();
function Yi(e) {
	return !e.signal?.aborted;
}
async function Xi(e, t, n) {
	if (t.signal?.aborted) return null;
	let r = Ji.get(e);
	(!r || r.abort.signal.aborted) && (r = {
		abort: new AbortController(),
		consumers: /* @__PURE__ */ new Set()
	}, Ji.set(e, r));
	let i = {}, a = r;
	r.consumers.add(i);
	let o = () => {
		a.consumers.delete(i), a.consumers.size || a.abort.abort();
	};
	t.signal?.addEventListener("abort", o, { once: !0 });
	try {
		let i = Ca(e, {
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
			t.signal?.removeEventListener("abort", o), o(), !a.consumers.size && Ji.get(e) === a && Ji.delete(e);
		};
		a.followup ? a.followup.then(n, n) : n();
	}
}
function $() {
	return Date.now();
}
function Zi() {
	return Math.floor($() / 1e3);
}
function Qi(e) {
	return e ? {
		name: e.name,
		displayName: e.displayName,
		picture: e.picture
	} : null;
}
function $i(e = []) {
	return z.sanitizeExternalRelayUrls(e);
}
function ea(e = []) {
	return $i(e).slice(0, Ri);
}
function ta(e) {
	return e.flatMap((e) => {
		let t = [];
		for (let n = 0; n < e.pubkeys.length; n += zi) t.push({
			relays: e.relays,
			pubkeys: e.pubkeys.slice(n, n + zi)
		});
		return t;
	});
}
async function na(e, t, n) {
	let r = Array(e.length), i = 0, a = Array.from({ length: Math.min(t, e.length) }, async () => {
		for (; i < e.length;) {
			let t = i;
			i += 1, r[t] = await n(e[t]);
		}
	});
	return await Promise.all(a), r;
}
function ra(e, t) {
	return e.expireAtMs <= t;
}
function ia(e, t) {
	return e.staleAtMs <= t;
}
function aa(e, t) {
	return e.status === "negative" && !!e.negativeUntilMs && e.negativeUntilMs > t;
}
function oa(e, t) {
	return typeof e.fetchedAt == "number" && Number.isFinite(e.fetchedAt) ? e.fetchedAt : t;
}
function sa(e, t, n = !0) {
	if (C(Q, {
		...D(Q),
		[e]: t
	}), !n) return;
	let r = Gi.get(e);
	if (r && r.size !== 0) for (let e of r) e(t.profile);
}
function ca(e) {
	let t = $();
	sa(e, {
		pubkey: e,
		status: "negative",
		profile: null,
		profileSummary: null,
		metadataRaw: null,
		fetchedAtMs: t,
		sourceEventCreatedAtSec: null,
		sourceEventId: null,
		staleAtMs: t + Fi,
		expireAtMs: t + Fi,
		negativeUntilMs: t + Fi,
		sourceRelay: null,
		lastValidatedAtMs: t,
		persistence: "persisted"
	});
}
function la(e) {
	let t = $(), n = e.fetchedAtMs ?? t, r = {
		...e.profile,
		fetchedAt: e.profile.fetchedAt ?? n,
		updatedAtFromEvent: e.sourceEventCreatedAtSec ?? e.profile.updatedAtFromEvent
	};
	sa(e.pubkey, {
		pubkey: e.pubkey,
		status: "hit",
		profile: r,
		profileSummary: Qi(r),
		metadataRaw: e.metadataRaw,
		fetchedAtMs: n,
		sourceEventCreatedAtSec: e.sourceEventCreatedAtSec,
		sourceEventId: e.sourceEventId ?? null,
		staleAtMs: e.persistence === "temporary" ? t : n + Ni,
		expireAtMs: n + Pi,
		negativeUntilMs: null,
		sourceRelay: e.sourceRelay,
		lastValidatedAtMs: n,
		persistence: e.persistence ?? "persisted"
	}, e.notifySubscribers ?? !0);
}
function ua(e, t) {
	if (!e) return !1;
	let n = e.profileRelays ?? [], r = t.profileRelays ?? [];
	return e.name === t.name && e.displayName === t.displayName && e.picture === t.picture && e.npub === t.npub && e.nprofile === t.nprofile && n.length === r.length && n.every((e, t) => e === r[t]);
}
function da(e, t) {
	return D(Q)[e]?.profile ?? t.find((e) => e.existingSnapshot)?.existingSnapshot ?? null;
}
function fa(e, t) {
	let n = D(Q)[e];
	if (n?.profile) return n.profile;
	let r = oa(t, $());
	return la({
		pubkey: e,
		profile: t,
		metadataRaw: null,
		sourceEventCreatedAtSec: t.updatedAtFromEvent ?? null,
		sourceEventId: null,
		sourceRelay: null,
		fetchedAtMs: r
	}), D(Q)[e]?.profile ?? t;
}
function pa(e, t, n) {
	let r = t.acceptedProfile;
	if (!r) return null;
	let i = D(Q)[e], a = t.acceptedRecord, o = !!n.sourceEventId && n.sourceEventId === a?.sourceEventId, s = t.currentEventConfirmed || o, c = a?.fetchedAt ?? oa(r, $()), l = {
		...r,
		fetchedAt: r.fetchedAt ?? c,
		updatedAtFromEvent: a?.updatedAtFromEvent ?? r.updatedAtFromEvent
	};
	return la({
		pubkey: e,
		profile: l,
		metadataRaw: s ? n.metadataRaw : null,
		sourceEventCreatedAtSec: a?.updatedAtFromEvent ?? r.updatedAtFromEvent ?? null,
		sourceEventId: a?.sourceEventId ?? (s ? n.sourceEventId : null),
		sourceRelay: s ? n.sourceRelay : null,
		fetchedAtMs: c,
		persistence: "persisted",
		notifySubscribers: !ua(i?.profile ?? null, l)
	}), D(Q)[e]?.profile ?? r;
}
async function ma(e) {
	let t = D(Q)[e];
	if (t?.persistence !== "temporary" || !t.profile || !t.sourceEventId || t.sourceEventCreatedAtSec === null) return {
		profile: t?.profile ?? null,
		acceptedRecord: null,
		persistence: t?.persistence ?? null,
		dbError: !1
	};
	try {
		let n = ea([...t.profile.profileRelays ?? [], ...t.sourceRelay ? [t.sourceRelay] : []]), r = await zn.upsertCandidate(e, {
			pubkeyHex: e,
			profile: t.profile,
			sourceEventId: t.sourceEventId,
			updatedAtFromEvent: t.sourceEventCreatedAtSec,
			observedRelays: n,
			fetchedAt: t.fetchedAtMs
		});
		return r.acceptedProfile && r.acceptedRecord ? {
			profile: pa(e, r, t),
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
function ha(e, t) {
	let n = z.sanitizeExternalRelayUrls([...t.profile?.profileRelays ?? [], ...t.observedRelays]), r = {
		...t.profile,
		profileRelays: n.length > 0 ? n : void 0
	};
	return la({
		pubkey: e,
		profile: r,
		metadataRaw: t.metadataRaw,
		sourceEventCreatedAtSec: t.sourceEventCreatedAtSec,
		sourceEventId: t.sourceEventId,
		sourceRelay: t.sourceRelay,
		persistence: "temporary"
	}), D(Q)[e]?.profile ?? r;
}
function ga(e, t, n = !0) {
	let r = D(Q)[e];
	if (!r) return;
	let i = $();
	sa(e, {
		...r,
		status: t,
		lastValidatedAtMs: i
	}, n);
}
function _a() {
	let e = $(), t = Object.entries(D(Q)).filter(([, t]) => !ra(t, e));
	t.length !== Object.keys(D(Q)).length && C(Q, Object.fromEntries(t));
}
function va(e) {
	try {
		let t = JSON.parse(e.content), n = e.relay ? [e.relay.endsWith("/") ? e.relay : `${e.relay}/`] : [], r = typeof t.picture == "string" ? t.picture : "", i = r ? ue(r, {
			forceRemote: !1,
			navigatorOnline: !0
		}) : "", a = {
			name: typeof t.name == "string" ? t.name : "",
			displayName: typeof t.display_name == "string" ? t.display_name : "",
			picture: i,
			npub: ht(e.pubkey),
			nprofile: _t(e.pubkey, n, e.writeRelays),
			profileRelays: n.length > 0 ? n : void 0
		};
		return a.fetchedAt = $(), a.updatedAtFromEvent = e.createdAtSec, a;
	} catch {
		return null;
	}
}
async function ya(e, t, n, r, i, a, o = [], s) {
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
		let u = Ee(), d = !1, f = null, p = null, m = () => {
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
			let n = t <= Zi() + Vi;
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
			let t = ke(e, u, { on: { relays: n } }, {
				timeoutMs: i,
				deadlineAt: s,
				onEnd: (e) => {
					if (!e.complete) for (let e of c) l[e] = {
						...l[e],
						timedOut: !0
					};
				}
			});
			f = (typeof t.pipe == "function" ? t.pipe($e(y)) : t).subscribe({
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
					let a = va({
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
				until: Zi() + Vi,
				limit: Math.max(24, c.length * 4)
			}), u.over(), a?.(c);
		} catch {
			g(), m();
		}
	}), l;
}
async function ba(e, t, n) {
	if (t.profile && t.sourceEventId !== null && t.sourceEventCreatedAtSec !== null) try {
		let r = await zn.upsertCandidate(e, {
			pubkeyHex: e,
			profile: t.profile,
			sourceEventId: t.sourceEventId,
			updatedAtFromEvent: t.sourceEventCreatedAtSec,
			observedRelays: t.observedRelays,
			fetchedAt: oa(t.profile, $())
		});
		if (!n.some(Yi)) return {
			profile: null,
			stopReason: "persistence-unavailable",
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: !0
		};
		let i = pa(e, r, t);
		return {
			profile: i,
			stopReason: r.currentEventConfirmed && i !== null ? "current-event-confirmed" : null,
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: t.networkError || t.timedOut
		};
	} catch {
		let r = da(e, n);
		return {
			profile: r ? fa(e, r) : ha(e, t),
			stopReason: "persistence-unavailable",
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: t.networkError || t.timedOut
		};
	}
	return {
		profile: da(e, n),
		stopReason: null,
		parseError: t.parseError,
		rejectedFutureTimestamp: t.rejectedFutureTimestamp,
		networkError: t.networkError,
		transientFailure: t.networkError || t.timedOut
	};
}
async function xa() {
	let e = Ki.filter((e) => Yi(e) ? !0 : (e.resolve(null), !1));
	if (Ki = [], qi = null, e.length === 0) return;
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.rxNostr) ?? [];
		e.push(n), t.set(n.rxNostr, e);
	}
	for (let e of t.values()) {
		let t = /* @__PURE__ */ new Map(), n = {}, r = {}, i = {};
		for (let a of e) {
			let e = t.get(a.pubkey) ?? [];
			e.push(a), t.set(a.pubkey, e), r[a.pubkey] = $i([...r[a.pubkey] ?? [], ...a.relays]), i[a.pubkey] = ea([...i[a.pubkey] ?? [], ...a.fallbackRelays]);
			let o = /* @__PURE__ */ new Set([...n[a.pubkey] ?? [], ...a.writeRelays]);
			n[a.pubkey] = Array.from(o);
		}
		let a = (e) => (t.get(e) ?? []).some(Yi), o = Array.from(t.keys()), s = Object.fromEntries(o.map((e) => {
			let t = ji({
				contextualRelays: r[e] ?? [],
				fallbackRelays: i[e] ?? [],
				contextualRelayLimit: Ri
			}), a = /* @__PURE__ */ new Set([...t.bootstrap, ...n[e] ?? []]);
			return t.contextual = t.contextual.filter((e) => !a.has(e)), t.fallback = t.fallback.filter((e) => !a.has(e)), [e, t];
		})), c = ji({
			contextualRelays: [],
			contextualRelayLimit: Ri
		}), l = new Set(o), u = {}, d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = [
			"bootstrap",
			"contextual",
			"fallback"
		], g = $() + 6e3, _ = (e, t) => e === "bootstrap" ? Mi(t, Object.fromEntries(t.map((e) => [e, z.sanitizeExternalRelayUrls([...c.bootstrap, ...n[e] ?? []])]))) : Mi(t, Object.fromEntries(t.map((t) => [t, s[t][e]])));
		try {
			for (let r of h) {
				if ($() >= g) {
					for (let e of l) p.add(e);
					break;
				}
				let i = await na(ta(_(r, Array.from(l).filter(a))), Bi, async (r) => {
					let i = r.pubkeys.filter((e) => a(e) && l.has(e));
					return i.length === 0 ? null : {
						activeTargets: i,
						results: await ya(e[0].rxNostr, i, r.relays, n, Li, (e) => {
							for (let t of e) m.add(t);
						}, i.flatMap((e) => (t.get(e) ?? []).flatMap((e) => e.signal ? [e.signal] : [])), g)
					};
				});
				for (let e of i) if (e) for (let n of e.activeTargets) {
					if (!a(n)) {
						l.delete(n);
						continue;
					}
					let r = t.get(n) ?? [], i = await ba(n, e.results[n], r);
					u[n] = i.profile, i.parseError && d.add(n), i.rejectedFutureTimestamp && f.add(n), i.transientFailure && p.add(n), i.stopReason !== null && l.delete(n);
				}
			}
			for (let e of l) {
				if (!a(e)) continue;
				let n = da(e, t.get(e) ?? []);
				d.has(e) ? ga(e, "parse-error") : f.has(e) ? ga(e, "invalid-future-ts") : !n && m.has(e) && !p.has(e) && ca(e), u[e] = n ? fa(e, n) : null;
			}
			for (let [e, n] of t.entries()) for (let t of n) t.resolve(Yi(t) ? u[e] ?? null : null);
		} catch {
			for (let [e, n] of t.entries()) {
				let t = da(e, n);
				for (let r of n) r.resolve(Yi(r) && t ? fa(e, t) : null);
			}
		}
	}
}
function Sa(e, t, n, r, i, a, o) {
	return o?.aborted ? Promise.resolve(null) : new Promise((s, c) => {
		let l = () => {
			Ki = Ki.filter((e) => e.signal !== o), !Ki.length && qi && (clearTimeout(qi), qi = null), s(null);
		};
		o?.addEventListener("abort", l, { once: !0 }), Ki.push({
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
		}), !qi && (qi = setTimeout(() => {
			xa();
		}, Ii));
	});
}
async function Ca(e, t, n = void 0) {
	if (t.signal?.aborted || !e || !t.rxNostr) return null;
	let r = Ui.get(e)?.signal?.aborted;
	r && Wi.delete(e);
	let i = r ? void 0 : Hi.get(e);
	if (i) {
		let n = Ui.get(e);
		if (n && t.rxNostr === n.rxNostr) {
			let r = new Set(ea(n.writeRelays ?? []));
			if (ea(t.writeRelays ?? []).filter((e) => !r.has(e)).length > 0) {
				let n = Wi.get(e) ?? {};
				Wi.set(e, {
					rxNostr: t.rxNostr,
					forceRefresh: !0,
					allowBackgroundRefresh: t.allowBackgroundRefresh,
					writeRelays: $i([...n.writeRelays ?? [], ...t.writeRelays ?? []]),
					additionalRelays: $i([...n.additionalRelays ?? [], ...t.additionalRelays ?? []]),
					fallbackRelays: $i([...n.fallbackRelays ?? [], ...t.fallbackRelays ?? []])
				});
			}
		}
		return i;
	}
	let a = (async () => {
		let r = n;
		if (r === void 0) try {
			r = await zn.get(e);
		} catch {
			r = null;
		}
		if (t.signal?.aborted) return null;
		let i = await ma(e);
		if (t.signal?.aborted) return null;
		let a = i.profile ?? D(Q)[e]?.profile ?? r, o = $i([...t.additionalRelays ?? [], ...a?.profileRelays ?? []]);
		return Sa(e, t.rxNostr, o, ea(t.fallbackRelays ?? []), ea(t.writeRelays ?? []), a, t.signal);
	})().finally(() => {
		if (Hi.get(e) !== a) return;
		Hi.delete(e), Ui.delete(e);
		let n = Wi.get(e);
		if (Wi.delete(e), _a(), !t.signal?.aborted && n?.rxNostr && (n.writeRelays?.length ?? 0) > 0) {
			let r = Ca(e, {
				...n,
				signal: t.signal
			}), i = Ji.get(e);
			i && i.abort.signal === t.signal && (i.followup = r);
		}
	});
	return Ui.set(e, t), Hi.set(e, a), a;
}
async function wa(e, t, n) {
	if (t.signal?.aborted) return null;
	let r = $(), i = D(Q)[e];
	if (!t.forceRefresh && i && !ra(i, r)) {
		if (aa(i, r)) return null;
		if (i.profile && i.persistence === "temporary") return t.allowBackgroundRefresh !== !1 && t.rxNostr && (Xi(e, t, n ? i.profile : void 0), ga(e, "stale", !1)), i.profile;
		if (i.profile && !ia(i, r)) return i.profile;
		if (i.profile) return t.allowBackgroundRefresh !== !1 && t.rxNostr && (Xi(e, t, n ? i.profile : void 0), ga(e, "stale")), i.profile;
	}
	if (!t.forceRefresh && !n) {
		let n = await zn.get(e);
		if (t.signal?.aborted) return null;
		if (n) {
			let i = oa(n, r);
			la({
				pubkey: e,
				profile: n,
				metadataRaw: null,
				sourceEventCreatedAtSec: n.updatedAtFromEvent ?? null,
				sourceRelay: null,
				fetchedAtMs: i
			});
			let a = D(Q)[e];
			return a && ia(a, r) && t.allowBackgroundRefresh !== !1 && t.rxNostr && (Xi(e, t, n), ga(e, "stale")), n;
		}
	}
	return t.rxNostr ? await Xi(e, t, n ? D(Q)[e]?.profile ?? null : void 0) : null;
}
async function Ta(e, t = {}) {
	return wa(e, t, !1);
}
async function Ea(e) {
	return e ? wa(e, { allowBackgroundRefresh: !1 }, !1) : null;
}
async function Da(e, t = {}) {
	if (t.signal?.aborted) return {};
	let n = Array.from(new Set(e.filter((e) => !!e)));
	if (n.length === 0) return {};
	if (!t.forceRefresh) {
		let e = $(), r = n.filter((t) => {
			let n = D(Q)[t];
			return !n || ra(n, e);
		});
		if (r.length > 0) try {
			let n = await zn.bulkGetRecords(r);
			if (t.signal?.aborted) return {};
			n.forEach((t, n) => {
				if (!t) return;
				let i = jn(t);
				la({
					pubkey: r[n],
					profile: i,
					metadataRaw: null,
					sourceEventCreatedAtSec: i.updatedAtFromEvent ?? null,
					sourceEventId: t.sourceEventId ?? null,
					sourceRelay: null,
					fetchedAtMs: oa(i, e)
				});
			});
		} catch {}
	}
	let r = await Promise.all(n.map(async (e) => {
		let n = t.relayOptionsByPubkey?.[e];
		return [e, await wa(e, {
			rxNostr: t.rxNostr,
			additionalRelays: $i([...n?.additionalRelays ?? [], ...t.additionalRelays ?? []]),
			fallbackRelays: $i([...n?.fallbackRelays ?? [], ...t.fallbackRelays ?? []]),
			writeRelays: $i([...n?.writeRelays ?? [], ...t.writeRelays ?? []]),
			forceRefresh: t.forceRefresh,
			allowBackgroundRefresh: t.allowBackgroundRefresh
		}, !t.forceRefresh)];
	}));
	return Object.fromEntries(r);
}
async function Oa(e) {
	return Da(e, { allowBackgroundRefresh: !1 });
}
function ka(e, t) {
	let n = Gi.get(e) ?? /* @__PURE__ */ new Set();
	n.add(t), Gi.set(e, n);
	let r = D(Q)[e];
	return r && t(r.profile), () => {
		let n = Gi.get(e);
		n && (n.delete(t), n.size === 0 && Gi.delete(e));
	};
}
function Aa(e) {
	return D(Q)[e] ?? null;
}
function ja(e, t) {
	let n = Array.from(new Set(e.filter((e) => !!e))).map((e) => ka(e, (n) => t(e, n)));
	return () => {
		for (let e of n) e();
	};
}
var Ma = {
	getProfile: Ta,
	getProfiles: Da,
	getCachedProfile: Ea,
	getCachedProfiles: Oa,
	getReactiveEntry: Aa,
	subscribe: ka,
	subscribeProfiles: ja
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryChildInteractionsAdapter.ts
function Na(e) {
	return e.sort((e, t) => e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) : e.createdAt - t.createdAt);
}
function Pa(e, t, n) {
	let r = Array.from(new Set(t.filter((e) => !!e))), i = new Map(r.map((e) => [e, []]));
	for (let t of e) n(t) && i.get(t.parentEventId)?.push(t);
	return r.flatMap((e) => Na(i.get(e) ?? []));
}
var Fa = class {
	repository;
	constructor(e = et) {
		this.repository = e;
	}
	async getReactionRecords(e, t) {
		return (await (t ? this.repository.getChildInteractions(e, t) : this.repository.getChildInteractions(e))).filter((e) => e.kind === 7);
	}
	async getReactionRecordsForParents(e, t) {
		let n = Array.from(new Set(e.filter((e) => !!e)));
		return Pa(this.repository.getChildInteractionsForParents ? await (t ? this.repository.getChildInteractionsForParents(n, t) : this.repository.getChildInteractionsForParents(n)) : (await Promise.all(n.map((e) => this.getReactionRecords(e, t?.find((t) => t.eventId === e))))).flat(), n, (e) => e.kind === 7);
	}
}, Ia = class {
	repository;
	constructor(e = et) {
		this.repository = e;
	}
	async getDirectReplyRecords(e) {
		return this.repository.getDirectReplyInteractions(e);
	}
	async getDirectReplyRecordsForParents(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return Pa(this.repository.getChildInteractionsForParents ? await this.repository.getChildInteractionsForParents(t) : (await Promise.all(t.map((e) => this.getDirectReplyRecords(e)))).flat(), t, (e) => e.kind === 1 || e.kind === 42 || e.kind === 1111);
	}
}, La = class {
	repository;
	constructor(e = et) {
		this.repository = e;
	}
	async getRelatedEventRecords(e) {
		return this.repository.getChildInteractions(e);
	}
	async getDirectReplyRecords(e) {
		return this.repository.getDirectReplyInteractions(e);
	}
}, Ra = new Fa(), za = new Ia();
new La();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDeletionFetchService.ts
var Ba = 4e3, Va = 8;
function Ha(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (!n.event?.id || !n.event.pubkey) continue;
		let e = t.get(n.event.pubkey) ?? /* @__PURE__ */ new Set();
		e.add(n.event.id), t.set(n.event.pubkey, e);
	}
	return new Map(Array.from(t.entries()).map(([e, t]) => [e, Array.from(t)]));
}
function Ua(e) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls).sort((e, t) => e.localeCompare(t))
	})).sort((e, t) => e.event.created_at === t.event.created_at ? e.event.id.localeCompare(t.event.id) : e.event.created_at - t.event.created_at);
}
var Wa = new class {
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
		let n = Ha(t.targets), r = this.resolveRelayUrls(t), i = /* @__PURE__ */ new Map(), a = t.requireRelayEose ? `related-deletion-${Date.now()}-${Math.random().toString(36).slice(2)}` : void 0, o, s = !1, c, l, u = () => {
			c?.unsubscribe?.(), c = void 0;
		}, d = (e) => ({
			status: e,
			events: Ua(i),
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
					let l = Ee(a);
					if (c = ke(e, l, { on: r.length > 0 ? { relays: r } : { defaultReadRelays: !0 } }, {
						operation: t.operation,
						deadlineAt: t.deadlineAt,
						quorum: !1,
						timeoutMs: t.timeoutMs ?? Ba,
						source: (t, n) => it(e, t, n),
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
		let r = z.sanitizeExternalRelayUrls(typeof t.from == "string" ? [t.from] : [], { limit: 1 })[0], i = e.get(n.id);
		i ? ce(i.event, n) ? r && i.relayUrls.add(r) : this.console.warn("post_history_deletion_fetch_packet_conflict", n.id) : e.set(n.id, {
			event: n,
			relayUrls: new Set(r ? [r] : [])
		});
	}
	resolveRelayUrls(e) {
		let t = e.targets.flatMap((e) => e.relayUrls ?? []), n = ut([...t, ...e.relayHints ?? []], Va);
		if (n) return n;
		let r = e.relayConfig ? [...z.extractReadRelays(e.relayConfig), ...z.extractWriteRelays(e.relayConfig)] : [], i = z.sanitizeExternalRelayUrls([
			...t,
			...e.relayHints ?? [],
			...r
		], { limit: Va });
		return i.length > 0 ? i : z.sanitizeExternalRelayUrls(R, { limit: Va });
	}
}(), Ga = 1e3, Ka = 7776e6;
function qa(e) {
	return Number.isSafeInteger(e) && e > 0;
}
function Ja(e) {
	return { ...e };
}
function Ya(e) {
	return Array.from(new Set(e.filter(jt)));
}
var Xa = new class {
	db;
	now;
	maxRecords;
	ttlMs;
	constructor(e = we, t = Date.now, n = Ga, r = Ka) {
		this.db = e, this.now = t, this.maxRecords = n, this.ttlMs = r;
	}
	async get(e) {
		if (!jt(e)) return null;
		let t = await this.db.customEmojiImageMeta.get(e);
		return t ? Ja(t) : null;
	}
	async getMany(e) {
		let t = Ya(e);
		if (t.length === 0) return {};
		let n = await this.db.customEmojiImageMeta.bulkGet(t), r = {};
		return n.forEach((e) => {
			e && (r[e.url] = Ja(e));
		}), r;
	}
	async upsert(e) {
		if (!jt(e.url) || !qa(e.width) || !qa(e.height)) return null;
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
		}), Ja(r);
	}
	async touchMany(e, t = this.now()) {
		let n = Ya(e);
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
function Za({ getShow: e, getSessionOpen: t = e, getEmojiUrls: n, onStateChanged: r = () => void 0 }) {
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
			let r = await Xa.getMany(t);
			if (!e() || n !== o) return;
			let i = Object.keys(r);
			if (i.length === 0) return;
			f(Object.fromEntries(i.map((e) => [e, u(r[e])]))), Xa.touchMany(i);
		} catch {}
	}
	async function m(e) {
		try {
			await Xa.upsert(e);
		} catch {}
	}
	async function h(t) {
		let r = o, a = await Mt(t, { signal: s.signal });
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
async function Qa(e, t) {
	return (await X(we, "postHistory").get(e.id))?.deletedAt !== void 0 || (await we.postHistoryDeletionRequests.where("targetEventId").anyOf([e.id, t]).toArray().then((e) => X(we, "postHistoryDeletionRequests").hydrate(e))).some((t) => {
		let n = t.rawEvent;
		return Re(n) && n.pubkey === e.pubkey && Ie(n, {
			id: t.targetEventId,
			pubkey: e.pubkey
		});
	});
}
async function $a(e) {
	let { structure: t } = e;
	if (e.signal?.aborted || !Re(t)) return null;
	let n = Fe(t);
	if (!n) return null;
	let r = (await ot.getByIds([n.eventId]))[0];
	if (r?.deletedAt !== void 0 || await Qa(t, n.eventId)) return null;
	if (r) {
		let i = r.rawEvent;
		if (Ue(t, i, n.eventId)) return e.signal?.aborted ? null : i;
	}
	if (!e.rxNostr || e.signal?.aborted) return null;
	let i = await tt(we, t.pubkey), a = {
		ownerPubkeyHex: t.pubkey,
		expectedRevision: i,
		isActive: () => !e.signal?.aborted
	}, o = z.sanitizeExternalRelayUrls([
		...n.relayHint ? [n.relayHint] : [],
		...e.relayHints ?? [],
		...r?.acceptedRelays ?? [],
		...r?.fetchedRelays ?? []
	]), s = Ai.fetchEventById(e.rxNostr, {
		eventId: n.eventId,
		relayHints: o,
		relayConfig: e.relayConfig
	}), c = () => s.cancel();
	e.signal?.addEventListener("abort", c, { once: !0 });
	let l = await s.promise.finally(() => e.signal?.removeEventListener("abort", c));
	if (e.signal?.aborted || !l.event || !Ue(t, l.event, n.eventId)) return null;
	let u = z.sanitizeExternalRelayUrls(l.relayUrl ? [l.relayUrl] : [], { limit: 1 });
	try {
		await ot.putCandidate({
			event: l.event,
			fetchedRelays: u,
			relayHints: u,
			localWriteScope: a
		}), ln.archiveAdoptedAuthored([{ event: t }], a);
	} catch {}
	let [d] = await ot.getByIds([n.eventId]);
	return e.signal?.aborted || d?.deletedAt !== void 0 || await Qa(t, n.eventId) ? null : l.event;
}
async function eo(e) {
	return (await $a(e))?.content ?? null;
}
function to(e) {
	if (!e.structure || !Fe(e.structure)) return;
	let t = e.structure, n = Fe(t), r = (t) => eo({
		structure: e.structure,
		relayHints: e.relayHints,
		rxNostr: e.rxNostr,
		relayConfig: e.relayConfig,
		signal: t
	});
	return r.scope = {
		runtime: e.rxNostr,
		ownerPubkey: e.ownerPubkey
	}, r.loadEmoji = Mt, r.observe = (e) => {
		let r = Se(async () => {
			let [e] = await ot.getByIds([n.eventId]);
			return e?.deletedAt !== void 0 || await Qa(t, n.eventId) ? "deleted" : e ? Ue(t, e.rawEvent, n.eventId) ? "available" : "invalid" : "missing";
		}).subscribe({
			next: e,
			error: () => e("invalid")
		});
		return () => r.unsubscribe();
	}, r;
}
export { En as A, Yt as B, cr as C, Hn as D, Vn as E, zt as F, It as H, Bt as I, Ut as L, bn as M, ln as N, zn as O, cn as P, Vt as R, sr as S, Qn as T, Rt as U, Lt as V, ui as _, za as a, xr as b, Ai as c, Ci as d, Di as f, di as g, xi as h, Wa as i, Cn as j, Dn as k, Ei as l, wi as m, $a as n, Ra as o, Ti as p, Za as r, Ma as s, to as t, Si as u, $n as v, er as w, lr as x, Zn as y, Ht as z };
