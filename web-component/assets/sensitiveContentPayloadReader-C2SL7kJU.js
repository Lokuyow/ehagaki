import { At as e, B as t, C as n, Ct as r, F as i, G as a, I as o, J as s, K as c, N as l, O as u, R as d, T as f, U as p, W as m, Y as h, Z as g, a as _, at as v, ct as y, dt as b, et as x, ft as S, g as C, gt as w, i as T, jt as E, k as D, lt as O, mt as k, nt as A, o as j, ot as M, r as N, s as ee, t as P, ut as F, v as I, w as L, wt as te, yt as R } from "./index-client-Bdka-Daw.js";
import { i as ne, n as re } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { c as ie, i as z, n as B, r as ae } from "./relayConfigUtils-DD5f1UAM.js";
import { a as V, i as oe, l as se, s as H } from "./postHistoryEventUtils-CUIBkIiy.js";
import { n as ce } from "./profilePictureUrlUtils-B7zGYkzO.js";
import { n as le } from "./esm-CrCI9Pgc.js";
import { B as ue, F as de, Q as U, V as fe, X as W, d as G, dt as pe, et as K, j as me, o as he, p as ge, pt as _e, q as ve, s as q, st as J, t as ye, z as Y } from "./LoadingPlaceholder-j1_vRYno.js";
import { c as be, o as xe, s as Se, y as Ce } from "./signedEventResultValidator-vNb8KnFy.js";
import { h as we, m as Te, p as Ee } from "./relayStore.svelte-BIc4bQdy.js";
import { Tt as De, c as Oe, nt as ke, tt as Ae, yt as je } from "./appUtils-C7IXsQBk.js";
import { i as Me, r as Ne, t as Pe } from "./rx-nostr-BHeS362x.js";
import { $ as Fe, B as Ie, F as Le, H as Re, I as ze, J as Be, K as Ve, P as He, Q as Ue, R as We, U as Ge, V as Ke, X as qe, _ as Je, at as Ye, b as Xe, c as Ze, ct as Qe, d as $e, dt as et, et as tt, f as nt, h as rt, lt as it, mt as at, n as ot, nt as st, pt as ct, s as lt, t as ut, v as dt, y as ft, z as pt } from "./nip65RelayDirectory-BTlaIUmx.js";
import { c as X, g as mt, i as ht } from "./legacyImportMarkers-CZ4J2IrE.js";
import { d as gt, i as _t } from "./clipboardUtils-CZAthnT_.js";
import { y as vt } from "./useDialogHistory.svelte-Bf7sbISs.js";
import { a as yt, n as bt, o as xt, r as St, t as Ct } from "./safe-polygon.svelte-0GusN-Ja.js";
import { c as wt, d as Tt, l as Et, p as Dt, t as Ot } from "./customEmoji-Bvbh2sQz.js";
import { n as kt } from "./channelPictureUrlUtils-qITdrbK6.js";
import { t as At } from "./inViewportAction.svelte-C2PkqWTH.js";
import { t as Z } from "./postMediaCacheService-Wfqsb0Vm.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelayResolver.ts
function jt(e) {
	if (Te()) return Ee();
	let t = B.sanitizeExternalRelayUrls(e ? [...B.extractWriteRelays(e), ...B.extractReadRelays(e)] : []);
	return t.length ? t : B.sanitizeExternalRelayUrls(z);
}
function Mt(e) {
	return JSON.stringify([
		Te(),
		jt(e),
		e ?? null
	]);
}
function Nt(e, t) {
	if (Te()) return Ee();
	let n = e ? [...B.extractReadRelays(e), ...B.extractWriteRelays(e)] : [], r = B.sanitizeExternalRelayUrls(n, { limit: t });
	return r.length > 0 ? r : B.sanitizeExternalRelayUrls(z, { limit: t });
}
var Pt = 2e4, Ft = 6e3, It = 25e3, Lt = 35e3, Rt = 6e4;
function zt(e) {
	return Array.from(e).sort((e, t) => e.localeCompare(t));
}
function Bt() {
	let e = Math.random().toString(36).slice(2, 10);
	return `post-history-repair-${Date.now().toString(36)}-${e}`;
}
function Vt(e, t) {
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
function Ht(e, t) {
	if (Number.isFinite(t)) return Math.max(1, Math.trunc(t ?? 1));
	switch (e) {
		case "dialog-open-refresh":
		case "dialog-open-catchup":
		case "visibility-resume":
		case "foreground-periodic": return Ft;
		case "older-backfill": return It;
		case "repair-visible-range": return Lt;
		default: return Pt;
	}
}
function Ut(e, t = !1) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls),
		...t ? { attestation: e.attestation } : {}
	})).sort((e, t) => t.event.created_at - e.event.created_at);
}
var Wt = new class {
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
		let r = this.now(), i = t.kinds ?? [...Ue], a = Vt(t.reason, t.limit), o = Ht(t.reason, t.timeoutMs), s = n === void 0 ? jt(t.relayConfig) : B.sanitizeExternalRelayUrls([n]), c = [
			"dialog-open-refresh",
			"visibility-resume",
			"foreground-periodic"
		].includes(t.reason ?? ""), l = !n && c && !Te() ? s.slice(0, 4) : s, u = t.until ?? Math.max(0, Math.floor(r / 1e3)), d = /* @__PURE__ */ new Map(), f = l.map((e) => {
			let t = Bt();
			return {
				relayUrl: e,
				subId: `${t}:0`,
				request: Pe(t),
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
		}), p = new Map(f.map((e) => [e.relayUrl, e])), m = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set(), y = [], b = !1, x = !0, S = !1, C = !1, w = !1, T = !1, E, D = () => void 0, O = () => {
			E !== void 0 && this.clearTimeoutFn(E), E = void 0, f.forEach((e) => e.subscription?.unsubscribe?.()), y.forEach((e) => e.unsubscribe?.());
		}, k = (e) => {
			let r = Ut(d, n !== void 0), i = r.map(({ event: e }) => e.created_at), o = i.length ? Math.min(...i) : null, c = i.length ? Math.max(...i) : null, p = f.map((t) => ({
				relayUrl: t.relayUrl,
				eoseReceived: t.eoseReceived,
				verificationDrained: t.verificationDrained,
				termination: e === "cancelled" ? "cancelled" : t.eoseReceived && t.verificationDrained ? "eose" : t.failed ? "error" : "timeout",
				rawCount: t.rawCount,
				oldestCreatedAt: t.oldestCreatedAt,
				saturated: t.rawCount >= a
			})), y = it({
				since: t.since,
				until: u,
				oldestCreatedAt: o,
				outcomes: p,
				cancelled: e === "cancelled"
			}), b = f.filter((e) => e.eoseReceived).map((e) => e.relayUrl), x = p.filter((e) => e.termination === "eose"), S = s.length > 0 && x.length >= Math.ceil(s.length / 2), E = t.since !== void 0 && et(y, s).some((e) => e.since <= t.since && e.until >= u), D = f.filter((e) => e.rawCount || e.eventIds.size).map((e) => ({
				relayUrl: e.relayUrl,
				rawCount: e.rawCount,
				uniqueCount: e.eventIds.size
			})).sort((e, t) => e.relayUrl.localeCompare(t.relayUrl)), O = f.flatMap((e) => e.oldestCreatedAt === null ? [] : [e.oldestCreatedAt]), k = f.reduce((e, t) => e + t.rawCount, 0), A = p.some((e) => e.saturated), j = m.size > 0 || b.length > 0 || g.size > 0, M = f.length > 0 && !j && f.every((e) => e.failed);
			return {
				status: e,
				events: r,
				fetchedAt: this.now(),
				nextUntil: O.length ? Math.max(...O) : null,
				hasMore: A,
				relayUrls: l,
				observedRelayUrls: D.map((e) => e.relayUrl),
				rawCount: k,
				uniqueCount: r.length,
				duplicateCount: Math.max(0, k - r.length),
				perRelayCounts: D,
				oldestCreatedAt: o,
				newestCreatedAt: c,
				requestedRelayUrls: l,
				eventRelayUrls: zt(m),
				eoseRelayUrls: b,
				closedRelayUrls: zt(h),
				errorRelayUrls: zt(_),
				downRelayUrls: zt(v),
				completedByRxNostr: C,
				completedByLocalTimeout: w,
				hasAnyRelayResponse: j,
				allRelaysFailed: M,
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
					bufferLimited: T,
					requestCount: f[0].requestCount,
					eoseReceivedAt: f[0].eoseReceivedAt
				} } : {},
				...t.reason === "repair-visible-range" ? {
					coverageRelayUrls: s,
					coverageEoseRelayUrls: x.map((e) => e.relayUrl),
					bestEffortRelayUrls: [],
					coverageComplete: S && E,
					coverageSaturated: A && !E,
					allCoverageRelaysFailed: M
				} : {}
			};
		}, A = () => {
			b || S || (S = !0, queueMicrotask(() => {
				S = !1, !(b || x || !f.every((e) => e.finished)) && (C = !0, D(f.length && f.every((e) => e.failed) ? "error" : "success"));
			}));
		}, j = (e) => {
			let t = B.sanitizeExternalRelayUrls(e ? [e] : [])[0];
			return t ? p.get(t) : void 0;
		};
		return {
			promise: new Promise((r) => {
				if (D = (e) => {
					b || (b = !0, O(), r(k(e)));
				}, !f.length) x = !1, D("error");
				else try {
					let r = (e, t) => {
						e && y.push(e.subscribe({ next: t }));
					};
					r(e.createAllMessageObservable?.(), (e) => {
						let t = j(e.from);
						if (t && !b) {
							if (e.type === "NOTICE") g.add(t.relayUrl);
							else if (e.subId === t.subId) {
								if (e.type === "EVENT") t.finished || (t.rawCount += 1), n && t.rawCount > a * 4 && (T = !0, D("error"));
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
					}), E = this.setTimeoutFn(() => {
						w = !0, D("timeout");
					}, o);
					for (let r of f) {
						if (r.subscription = Qe(e, r.request, { on: { relays: [r.relayUrl] } }).subscribe({
							next: (o) => {
								if (b) return;
								let s = o.event;
								if (s.pubkey !== t.pubkeyHex || !i.includes(s.kind) || t.since !== void 0 && s.created_at < t.since || t.until !== void 0 && s.created_at > t.until) return;
								m.add(r.relayUrl), r.eventIds.add(s.id), r.oldestCreatedAt = Math.min(r.oldestCreatedAt ?? s.created_at, s.created_at), r.newestCreatedAt = Math.max(r.newestCreatedAt ?? s.created_at, s.created_at), e.createAllMessageObservable || (r.rawCount += 1);
								let c = d.get(s.id);
								if (c) V(c.event, s) && c.relayUrls.add(r.relayUrl);
								else {
									if (n && d.size >= a) {
										T = !0, D("error");
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
								r.verificationDrained = !0, r.finished = !0, A();
							},
							error: () => {
								r.finished = !0, r.failed = !0, _.add(r.relayUrl), A();
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
					x = !1, A();
				} catch {
					D("error");
				}
			}),
			cancel: () => D("cancelled")
		};
	}
}(), Gt = class {
	createClient;
	constructor(e = Ne) {
		this.createClient = e;
	}
	run(e, t, n) {
		let r = new AbortController(), i = () => r.abort(), a, o, s, c = () => void 0, l = new Promise((e) => {
			c = e;
		});
		return r.signal.addEventListener("abort", () => c(null), { once: !0 }), t.addEventListener("abort", i, { once: !0 }), t.aborted && i(), {
			promise: (async () => {
				if (r.signal.aborted) return null;
				try {
					return a = this.createClient({
						verifier: Ce,
						signer: Me(),
						skipVerify: !1,
						skipFetchNip11: !0,
						retry: { strategy: "off" }
					}), o = a.createAllMessageObservable().subscribe(({ message: e }) => {
						Array.isArray(e) && e[0] === "CLOSED" && typeof e[2] == "string" && e[2].startsWith("auth-required:") && i();
					}), s = setTimeout(i, Ft), await Promise.race([n(a, r.signal), l]);
				} catch {
					return null;
				} finally {
					i(), s !== void 0 && clearTimeout(s), t.removeEventListener("abort", i), o?.unsubscribe(), a?.dispose();
				}
			})(),
			cancel: i
		};
	}
	fetchAuthored(e, t, n) {
		return this.run(e, n, async (n, r) => {
			let i = Wt.fetchRelayPage(n, {
				...t,
				relayUrl: e,
				timeoutMs: Ft
			}), a = () => i.cancel();
			r.addEventListener("abort", a, { once: !0 }), r.aborted && a();
			let o = await i.promise.finally(() => r.removeEventListener("abort", a));
			if (o.status !== "success") throw Error("local_relay_fetch_failed");
			return {
				events: o.events.flatMap(({ event: e, attestation: t }) => t ? [{
					event: e,
					attestation: t
				}] : []),
				fetchedAt: o.fetchedAt,
				nextUntil: o.nextUntil,
				hasMore: o.hasMore,
				browsingRanges: o.relayFetchCoverage?.flatMap(({ ranges: e }) => e) ?? []
			};
		});
	}
	fetchRelated(e, t, n) {
		return this.run(e, n, async (n, r) => {
			let i = Pe(), a = /* @__PURE__ */ new Map();
			return new Promise((o) => {
				let s, c = () => {
					s?.unsubscribe(), r.removeEventListener("abort", c), o([...a.values()]);
				};
				r.addEventListener("abort", c, { once: !0 }), s = Qe(n, i, { on: { relays: [e] } }).subscribe({
					next: ({ event: e, attestation: n }) => {
						!r.aborted && ie(t, e) && a.size < (t.limit ?? 150) && a.set(e.id, {
							event: e,
							attestation: n
						});
					},
					complete: c,
					error: c
				}), r.aborted ? c() : (i.emit(t), i.over());
			});
		});
	}
	storeSignedEvent(e, t, n) {
		return this.storeSignedEvents(e, [t], n);
	}
	storeSignedEvents(e, t, n) {
		let r = [...new Map(t.map((e) => [e.id, e])).values()];
		return r.length ? this.run(e, n, async (t, n) => (await Promise.all(r.map((r) => this.sendSignedEvent(t, e, r, n)))).every((e) => e)) : {
			promise: Promise.resolve(!n.aborted || null),
			cancel() {}
		};
	}
	sendSignedEvent(e, t, n, r) {
		return new Promise((i) => {
			let a = new at(), o = (e = !1) => {
				a.unsubscribe(), r.removeEventListener("abort", s), i(e);
			}, s = () => o();
			r.addEventListener("abort", s, { once: !0 }), r.aborted ? s() : a.add(e.send(n, {
				signer: Me(),
				on: { relays: [t] },
				completeOn: "all-ok"
			}).subscribe({
				next: (e) => {
					e.eventId === n.id && o(e.ok);
				},
				error: s,
				complete: s
			}));
		});
	}
}, Kt = /^[0-9a-f]{64}$/, qt = /^(0|[1-9]\d{0,4})$/, Jt = {
	status: "valid",
	ruleVersion: 1
};
function Yt(e) {
	return e?.status === "valid" && e.ruleVersion === 1;
}
function Xt(e, t) {
	return Ye(e, t) ? {
		event: e,
		attestation: t
	} : st(e);
}
function Zt(e) {
	if (typeof e != "string" || !qt.test(e)) return null;
	let t = Number(e);
	return Number.isInteger(t) && t >= 0 && t <= 65535 ? t : null;
}
function Qt(e) {
	let t = e.tags.filter((e) => e[0] === "k");
	if (t.length === 0) return !0;
	let n = t.map((e) => Zt(e[1]));
	return n.some((e) => e === null) ? !0 : n.some((e) => e !== null && pt(e));
}
function $t(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) n?.id && n.pubkey && t.set(n.id, n);
	return t;
}
function en(e, t) {
	let n = e.get(t.targetAuthorPubkey) ?? /* @__PURE__ */ new Set();
	n.add(t.targetEventId), e.set(t.targetAuthorPubkey, n);
}
function tn(e, t) {
	return e.targetAuthorPubkey !== t.targetAuthorPubkey || e.targetEventId !== t.targetEventId || e.schemaVersion !== t.schemaVersion || e.deletionEventId !== t.deletionEventId || e.deletionEventPubkey !== t.deletionEventPubkey || We(e) !== We(t) || e.deletedAt !== t.deletedAt || e.reason !== t.reason || !V(e.rawEvent, t.rawEvent) || e.rawEventVerification?.status !== t.rawEventVerification?.status || e.rawEventVerification?.ruleVersion !== t.rawEventVerification?.ruleVersion || !dt(e.relayUrls, t.relayUrls);
}
function nn(e, t, n) {
	let r = Yt(e.rawEventVerification) && !V(e.rawEvent, t.rawEvent);
	return {
		...t,
		...r ? {
			rawEvent: e.rawEvent,
			rawEventVerification: e.rawEventVerification
		} : {},
		targetVerified: We(e) || We(t),
		relayUrls: B.sanitizeExternalRelayUrls([...e.relayUrls, ...t.relayUrls]),
		fetchedAt: Math.max(e.fetchedAt, t.fetchedAt),
		updatedAt: n(),
		schemaVersion: 2
	};
}
var rn = new class {
	db;
	now;
	constructor(e = X, t = Date.now) {
		this.db = e, this.now = t;
	}
	async getDeletedTargets(e) {
		let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
		for (let t of e) t.targetAuthorPubkey && t.targetEventId && n.set(`${t.targetAuthorPubkey}:${t.targetEventId}`, t);
		for (let e of n.values()) {
			let n = await this.db.postHistoryDeletionRequests.where("[targetAuthorPubkey+targetEventId]").equals([e.targetAuthorPubkey, e.targetEventId]).toArray();
			for (let e of n) We(e) && en(t, e);
		}
		return t;
	}
	async getAllForTargetAuthorPubkey(e) {
		return e ? this.db.postHistoryDeletionRequests.where("targetAuthorPubkey").equals(e).toArray() : [];
	}
	async saveLocalDeletion(e) {
		let t = Xt(e.deletionEvent, e.attestation);
		if (!t) throw Error("invalid_local_deletion_event");
		let n = t.event, r = Array.from(/* @__PURE__ */ new Set([...e.targetEventId ? [e.targetEventId] : [], ...e.targetEventIds ?? []]));
		if (r.length === 0 || n.kind !== 5 || !Kt.test(n.id)) throw Error("invalid_local_deletion_event");
		let i = e.fetchedAt ?? this.now(), a = null;
		await this.db.transaction("rw", this.db.postHistoryDeletionRequests, this.db.postHistory, this.db.sensitivePayloads, async () => {
			let t = e.targetEvent ? st(e.targetEvent)?.event : null, o = await this.db.postHistory.get(r[0]), s = o ?? (t && t.id === r[0] ? {
				eventId: t.id,
				pubkeyHex: t.pubkey,
				kind: t.kind,
				rawEvent: t
			} : void 0);
			if (!s || !pt(s.kind) || !Ie(n, {
				id: s.eventId,
				pubkey: s.pubkeyHex
			})) throw Error("local_deletion_target_not_found");
			let c = s.rawEvent, l = (qe(c) ? Ve(c) : null)?.eventId;
			for (let t of r) {
				let r = !1;
				if (t === s.eventId) r = Ie(n, {
					id: s.eventId,
					pubkey: s.pubkeyHex
				});
				else if (t === l) {
					let e = await this.db.sensitivePayloads.get(t);
					r = !!e && e.deletedAt === void 0 && e.pubkeyHex === s.pubkeyHex && Be(c, e.rawEvent, t) && Ie(n, {
						id: t,
						pubkey: s.pubkeyHex
					});
				}
				if (!r) continue;
				let a = Re({
					deletionEvent: n,
					targetEventId: t,
					targetVerified: !0,
					relayUrls: e.relayUrls,
					fetchedAt: i
				}, this.now);
				a.rawEventVerification = { ...Jt };
				let o = await this.db.postHistoryDeletionRequests.get(a.id), u = o ? nn(o, a, this.now) : a;
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
		}), a && Xe(a);
	}
	async upsertValidDeletionRequests(e) {
		if (e.targetEvents.length === 0 || e.deletionEvents.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: e.deletionEvents.length
		};
		let t = e.deletionEvents.flatMap((e) => {
			let t = Xt(e.event, e.attestation);
			return t ? [{
				...e,
				event: t.event,
				attestation: t.attestation
			}] : [];
		}), n = $t(e.targetEvents), r = e.fetchedAt ?? this.now(), i = /* @__PURE__ */ new Map(), a = e.deletionEvents.length - t.length;
		for (let e of t) {
			let t = e.event.tags.filter((e) => e[0] === "e" && typeof e[1] == "string").map((e) => e[1]), o = !1;
			for (let a of t) {
				let t = n.get(a);
				if (!t) continue;
				let s = i.get(Le(t.pubkey, t.id, e.event.id)), c = Ke({
					deletionEvent: e.event,
					targetEvent: t,
					relayUrls: B.sanitizeExternalRelayUrls([...s?.relayUrls ?? [], ...e.relayUrls ?? []]),
					fetchedAt: r
				}, this.now);
				c && (c.rawEventVerification = { ...Jt }, i.set(c.id, c), o = !0);
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
				let r = nn(n, e, this.now);
				return tn(n, r) ? c += 1 : l += 1, r;
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
			let o = Xt(a.event, a.attestation);
			if (!o) {
				i += 1;
				continue;
			}
			let s = o.event;
			if (s.kind !== 5 || s.pubkey !== e.ownerPubkeyHex || !Kt.test(s.id)) {
				i += 1;
				continue;
			}
			let c = s.tags.filter((e) => e[0] === "e" && typeof e[1] == "string" && Kt.test(e[1])).map((e) => e[1]), l = Array.from(new Set(c));
			if (l.length === 0) {
				i += 1;
				continue;
			}
			let u = Qt(s);
			r.add(s.id);
			for (let e of l) {
				let r = Re({
					deletionEvent: s,
					targetEventId: e,
					targetVerified: !1,
					relayUrls: [],
					fetchedAt: t
				}, this.now);
				r.rawEventVerification = { ...Jt }, n.set(r.id, {
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
			await rt(this.db, e.localWriteScope);
			let t = await this.db.postHistoryDeletionRequests.bulkGet(a.map((e) => e.record.id)), n = Array.from(new Set(a.map((e) => e.record.targetEventId))), p = await this.db.postHistory.bulkGet(n), m = new Map(p.filter((e) => !!e).map((e) => [e.eventId, e])), h = [], g = /* @__PURE__ */ new Set();
			a.forEach((e, n) => {
				let { record: r } = e, i = m.get(r.targetEventId);
				if (i && !pt(i.kind) || !i && !e.shouldStoreWithoutTarget) return;
				i && i.deletedAt !== void 0 && i.rawEventVerification?.status === "valid" && i.rawEventVerification.ruleVersion === 1 && oe(i.rawEvent, i) && !Ve(i.rawEvent) && f.add(r.targetEventId);
				let a = !!i && pt(i.kind) && i.pubkeyHex === r.targetAuthorPubkey && i.pubkeyHex === r.deletionEventPubkey, l = {
					...r,
					targetVerified: a
				};
				u.add(r.targetEventId), g.add(r.deletionEventId);
				let p = t[n];
				if (!p) {
					o += 1, d.add(r.targetEventId), h.push(l);
					return;
				}
				let _ = nn(p, l, this.now);
				tn(p, _) ? (s += 1, d.add(r.targetEventId), h.push(_)) : c += 1;
			});
			for (let e of r) g.has(e) || (i += 1);
			h.length > 0 && await this.db.postHistoryDeletionRequests.bulkPut(h);
			for (let e of n) {
				let t = m.get(e);
				if (!t || !pt(t.kind) || t.deletedAt !== void 0) continue;
				let n = (await this.db.postHistoryDeletionRequests.where("targetEventId").equals(e).toArray()).filter((e) => We(e) && e.targetAuthorPubkey === t.pubkeyHex && e.deletionEventPubkey === t.pubkeyHex).sort(ze)[0];
				if (!n) continue;
				let r = Ge(n);
				await this.db.postHistory.update(e, {
					...r,
					updatedAt: this.now()
				}), l += 1;
			}
			await rt(this.db, e.localWriteScope);
		});
		let p = Array.from(new Set(a.map((e) => e.record.targetEventId)));
		for (let e of p) u.has(e) && !d.has(e) && f.has(e) || (await $e(e, this.db, this.now), await nt(e, this.db, this.now));
		return {
			insertedCount: o,
			updatedCount: s,
			unchangedCount: c,
			ignoredCount: i,
			appliedDeletionCount: l
		};
	}
}(), an = new class {
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
		this.transport = e.transport, this.repository = e.repository ?? Ze, this.payloads = e.payloads ?? lt, this.deletions = e.deletions ?? rn, this.getLocalRevision = e.getLocalRevision ?? ((e) => Je(X, e)), this.runtimeKind = e.runtimeKind ?? (() => re().runtimeKind);
	}
	getTransport() {
		return this.transport ??= new Gt();
	}
	configureSession(e) {
		this.cancelSession();
		let t = e.url && De(e.url);
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
		let r = [...new Map(t.filter(({ event: t, attestation: n }) => t.pubkey === e.ownerPubkeyHex && (tt(t.kind) || t.kind === 5 || t.kind === 36) && Ye(t, n) && !this.stores.has(`${e.url}:${t.id}`)).map((e) => [e.event.id, e])).values()];
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
		let a = setTimeout(() => n.abort(), Ft), o = () => !n.signal.aborted && this.isCurrent(t) && e.isActive();
		return {
			promise: (async () => {
				let i = await this.getLocalRevision(t.ownerPubkeyHex);
				if (!o()) return null;
				let a = {
					ownerPubkeyHex: t.ownerPubkeyHex,
					expectedRevision: i,
					isActive: o
				}, s = await this.getTransport().fetchAuthored(t.url, e, n.signal).promise;
				if (!s || !o()) return null;
				let c = s.nextUntil ?? e.until, l = await this.repository.upsertFetchedEvents({
					events: s.events.map((e) => ({
						...e,
						relayUrls: []
					})),
					fetchedAt: s.fetchedAt,
					localWriteScope: a,
					localBrowsingWrite: {
						...a,
						kindsKey: Fe,
						localRelayUrl: t.url,
						browsingRanges: s.browsingRanges,
						...e.reason !== "repair-visible-range" && c != null ? {
							resumeHint: { nextUntil: c },
							initializeResumeHintOnly: e.reason !== "older-backfill"
						} : {}
					}
				});
				if (l.applied === !1 || !o()) return null;
				let u = l.insertedCount + l.updatedCount + l.appliedDeletionCount > 0, d = [...new Map([...s.events.map(({ event: e }) => e), ...e.targets ?? []].filter((e) => e.pubkey === t.ownerPubkeyHex && tt(e.kind)).map((e) => [e.id, e])).values()], f = d.flatMap((e) => {
					let t = Ve(e);
					return t ? [t.eventId] : [];
				}), p = [...d.map((e) => e.id), ...f], m = await Promise.allSettled([f.length ? this.getTransport().fetchRelated(t.url, {
					ids: [...new Set(f)],
					authors: [t.ownerPubkeyHex],
					kinds: [36],
					limit: f.length
				}, n.signal).promise : Promise.resolve([]), p.length ? this.getTransport().fetchRelated(t.url, {
					authors: [t.ownerPubkeyHex],
					kinds: [5],
					"#e": [...new Set(p)],
					limit: e.limit ?? 150
				}, n.signal).promise : Promise.resolve([])]);
				if (o()) {
					let e = m[0].status === "fulfilled" ? m[0].value ?? [] : [];
					for (let t of e) {
						if (!o()) break;
						d.some((e) => Be(e, t.event)) && (await this.payloads.putCandidate({
							...t,
							localWriteScope: a
						}), u = !0);
					}
					let n = m[1].status === "fulfilled" ? m[1].value ?? [] : [];
					if (o() && n.length) {
						let e = await this.deletions.upsertImportedDeletionEvents({
							ownerPubkeyHex: t.ownerPubkeyHex,
							deletionEvents: n,
							fetchedAt: s.fetchedAt,
							localWriteScope: a
						});
						u ||= e.appliedDeletionCount > 0;
					}
				}
				return r || !this.isCurrent(t) || !e.isActive() || await this.getLocalRevision(t.ownerPubkeyHex) !== i ? null : {
					ownerPubkeyHex: t.ownerPubkeyHex,
					sessionGeneration: t.generation,
					localRevision: i,
					changed: u,
					browsingRanges: s.browsingRanges,
					eventIds: s.events.map(({ event: e }) => e.id),
					nextUntil: s.nextUntil,
					hasMore: s.hasMore
				};
			})().catch(() => null).finally(() => {
				i(), clearTimeout(a), t.abort.signal.removeEventListener("abort", i);
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
				if (a.has(n.event.id) || n.event.pubkey !== t.ownerPubkeyHex || !tt(n.event.kind)) continue;
				let e = await this.repository.getByEventId(n.event.id);
				if (!i() || await this.getLocalRevision(t.ownerPubkeyHex) !== r) return;
				if (!e || e.pubkeyHex !== t.ownerPubkeyHex || !V(e.rawEvent, n.event)) continue;
				let c = Ye(n.event, n.attestation) ? {
					event: n.event,
					attestation: n.attestation
				} : st(e.rawEvent);
				if (!c) continue;
				a.set(c.event.id, c.event), e.deletedAt === void 0 && o.set(c.event.id, c);
				let l = Ve(c.event);
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
				let t = s.get(e.id)?.filter(({ event: t }) => Be(t, e.rawEvent)) ?? [], n = t.length ? st(e.rawEvent) : null;
				n && (a.set(n.event.id, n.event), e.deletedAt === void 0 && t.some(({ deleted: e }) => !e) && o.set(n.event.id, n));
			}
			let l = await this.deletions.getAllForTargetAuthorPubkey(t.ownerPubkeyHex);
			if (i() && await this.getLocalRevision(t.ownerPubkeyHex) === r) {
				for (let e of l) {
					if (![...a.values()].some((t) => Ie(e.rawEvent, t))) continue;
					let t = st(e.rawEvent);
					t && o.set(t.event.id, t);
				}
				this.storeBatch(n, [...o.values()], i);
			}
		})().catch(() => void 0);
	}
}();
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/on-mount-effect.svelte.js
function on(e) {
	M(() => A(() => e()));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/timeout-fn.js
var sn = class {
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
}, cn = de({
	component: "tooltip",
	parts: ["content", "trigger"]
}), ln = new U("Tooltip.Provider"), un = new U("Tooltip.Root"), dn = class {
	#e = w(S(/* @__PURE__ */ new Map()));
	get triggers() {
		return x(this.#e);
	}
	set triggers(e) {
		k(this.#e, e, !0);
	}
	#t = w(null);
	get activeTriggerId() {
		return x(this.#t);
	}
	set activeTriggerId(e) {
		k(this.#t, e, !0);
	}
	#n = R(() => {
		let e = this.activeTriggerId;
		return e === null ? null : this.triggers.get(e)?.node ?? null;
	});
	get activeTriggerNode() {
		return x(this.#n);
	}
	set activeTriggerNode(e) {
		k(this.#n, e);
	}
	#r = R(() => {
		let e = this.activeTriggerId;
		return e === null ? null : this.triggers.get(e)?.payload ?? null;
	});
	get activePayload() {
		return x(this.#r);
	}
	set activePayload(e) {
		k(this.#r, e);
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
}, fn = class e {
	static create(t) {
		return ln.set(new e(t));
	}
	opts;
	#e = w(!0);
	get isOpenDelayed() {
		return x(this.#e);
	}
	set isOpenDelayed(e) {
		k(this.#e, e, !0);
	}
	isPointerInTransit = pe(!1);
	#t;
	#n = w(null);
	constructor(e) {
		this.opts = e, this.#t = new sn(() => {
			this.isOpenDelayed = !0;
		}, this.opts.skipDelayDuration.current), on(() => g(window, "scroll", (e) => {
			let t = x(this.#n);
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
		x(this.#n) && x(this.#n) !== e && x(this.#n).handleClose(), this.#i(), this.isOpenDelayed = !1, k(this.#n, e, !0);
	};
	onClose = (e) => {
		x(this.#n) === e && (k(this.#n, null), this.#r());
	};
	isTooltipOpen = (e) => x(this.#n) === e;
}, pn = class e {
	static create(t) {
		return un.set(new e(t, ln.get()));
	}
	opts;
	provider;
	#e = R(() => this.opts.delayDuration.current ?? this.provider.opts.delayDuration.current);
	get delayDuration() {
		return x(this.#e);
	}
	set delayDuration(e) {
		k(this.#e, e);
	}
	#t = R(() => this.opts.disableHoverableContent.current ?? this.provider.opts.disableHoverableContent.current);
	get disableHoverableContent() {
		return x(this.#t);
	}
	set disableHoverableContent(e) {
		k(this.#t, e);
	}
	#n = R(() => this.opts.disableCloseOnTriggerClick.current ?? this.provider.opts.disableCloseOnTriggerClick.current);
	get disableCloseOnTriggerClick() {
		return x(this.#n);
	}
	set disableCloseOnTriggerClick(e) {
		k(this.#n, e);
	}
	#r = R(() => this.opts.disabled.current ?? this.provider.opts.disabled.current);
	get disabled() {
		return x(this.#r);
	}
	set disabled(e) {
		k(this.#r, e);
	}
	#i = R(() => this.opts.ignoreNonKeyboardFocus.current ?? this.provider.opts.ignoreNonKeyboardFocus.current);
	get ignoreNonKeyboardFocus() {
		return x(this.#i);
	}
	set ignoreNonKeyboardFocus(e) {
		k(this.#i, e);
	}
	registry;
	tether;
	#a = w(null);
	get contentNode() {
		return x(this.#a);
	}
	set contentNode(e) {
		k(this.#a, e, !0);
	}
	contentPresence;
	#o = w(!1);
	#s;
	#c = R(() => this.opts.open.current ? x(this.#o) ? "delayed-open" : "instant-open" : "closed");
	get stateAttr() {
		return x(this.#c);
	}
	set stateAttr(e) {
		k(this.#c, e);
	}
	constructor(e, t) {
		this.opts = e, this.provider = t, this.tether = e.tether.current?.state ?? null, this.registry = this.tether?.registry ?? new dn(), this.#s = new sn(() => {
			k(this.#o, !0), this.opts.open.current = !0;
		}, this.delayDuration ?? 0), this.tether && (this.tether.root = this, on(() => () => {
			this.tether?.root === this && (this.tether.root = null);
		})), this.contentPresence = new vt({
			open: this.opts.open,
			ref: J(() => this.contentNode),
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), W(() => this.delayDuration, () => {
			this.delayDuration !== void 0 && (this.#s = new sn(() => {
				k(this.#o, !0), this.opts.open.current = !0;
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
		this.#s.stop(), k(this.#o, !1), this.ensureActiveTrigger(), this.opts.open.current = !0;
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
		e || t === 0 ? (k(this.#o, !1), this.opts.open.current = !0) : this.#s.start();
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
}, mn = class e {
	static create(t) {
		return t.tether.current ? new e(t, null, t.tether.current.state) : new e(t, un.get(), null);
	}
	opts;
	root;
	tether;
	attachment;
	#e = pe(!1);
	#t = w(!1);
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
		}), on(() => (this.#r = !0, this.#s(this.opts.ref.current), () => {
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
			t.provider.isPointerInTransit.current && (t.provider.isPointerInTransit.current = !1, t.onTriggerEnter(this.opts.id.current), k(this.#t, !0));
		}, 250)) : (t.onTriggerEnter(this.opts.id.current), k(this.#t, !0))));
	};
	#f = (e) => {
		let t = this.#a();
		t && (this.#o() ? t.opts.open.current && t.handleClose() : e.pointerType !== "touch" && (x(this.#t) || (this.#c(), t.provider.isPointerInTransit.current = !1, t.onTriggerEnter(this.opts.id.current), k(this.#t, !0))));
	};
	#p = (e) => {
		let t = this.#a();
		if (!t || this.#o()) return;
		if (this.#c(), !t.isActiveTrigger(this.opts.id.current)) {
			k(this.#t, !1);
			return;
		}
		let n = e.relatedTarget;
		if (G(n)) {
			for (let e of t.registry.triggers.values()) if (e.node === n) {
				if (t.provider.opts.skipDelayDuration.current > 0) {
					k(this.#t, !1);
					return;
				}
				t.handleClose(), k(this.#t, !1);
				return;
			}
		}
		t.onTriggerLeave(), k(this.#t, !1);
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
	#_ = R(() => {
		let e = this.#a(), t = !!(e?.opts.open.current && e.isActiveTrigger(this.opts.id.current)), n = this.#o();
		return {
			id: this.opts.id.current,
			"aria-describedby": t ? e?.contentNode?.id : void 0,
			"data-state": t ? e?.stateAttr : "closed",
			"data-disabled": me(n),
			"data-delay-duration": `${e?.delayDuration ?? 0}`,
			[cn.trigger]: "",
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
		return x(this.#_);
	}
	set props(e) {
		k(this.#_, e);
	}
}, hn = class e {
	static create(t) {
		return new e(t, un.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ue(this.opts.ref, (e) => this.root.contentNode = e), new Ct({
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
	#e = R(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return x(this.#e);
	}
	set snippetProps(e) {
		k(this.#e, e);
	}
	#t = R(() => ({
		id: this.opts.id.current,
		"data-state": this.root.stateAttr,
		"data-disabled": me(this.root.disabled),
		...Y(this.root.contentPresence.transitionStatus),
		style: { outline: "none" },
		[cn.content]: "",
		...this.attachment
	}));
	get props() {
		return x(this.#t);
	}
	set props(e) {
		k(this.#t, e);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus
	};
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip.svelte
function gn(e, t) {
	te(t, !0);
	let n = N(t, "open", 15, !1), i = N(t, "triggerId", 15, null), a = N(t, "onOpenChange", 3, q), o = N(t, "onOpenChangeComplete", 3, q), s = pn.create({
		open: J(() => n(), (e) => {
			n(e), a()(e);
		}),
		triggerId: J(() => i(), (e) => {
			i(e);
		}),
		delayDuration: J(() => t.delayDuration),
		disableCloseOnTriggerClick: J(() => t.disableCloseOnTriggerClick),
		disableHoverableContent: J(() => t.disableHoverableContent),
		ignoreNonKeyboardFocus: J(() => t.ignoreNonKeyboardFocus),
		disabled: J(() => t.disabled),
		onOpenChangeComplete: J(() => o()),
		tether: J(() => t.tether)
	});
	xt(e, {
		tooltip: !0,
		children: (e, n) => {
			var r = m(), i = O(r);
			l(i, () => t.children ?? E, () => ({
				open: s.opts.open.current,
				triggerId: s.activeTriggerId,
				payload: s.activePayload
			})), p(e, r);
		},
		$$slots: { default: !0 }
	}), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-content.svelte
var _n = /* @__PURE__ */ new Set([
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
]), vn = a("<div><div><!></div></div>");
function yn(t, n) {
	let i = c();
	te(n, !0);
	let a = N(n, "id", 19, () => he(i)), o = N(n, "ref", 15, null), s = N(n, "side", 3, "top"), u = N(n, "sideOffset", 3, 0), f = N(n, "align", 3, "center"), h = N(n, "avoidCollisions", 3, !0), g = N(n, "arrowPadding", 3, 0), v = N(n, "sticky", 3, "partial"), b = N(n, "hideWhenDetached", 3, !1), S = N(n, "collisionPadding", 3, 0), w = N(n, "onInteractOutside", 3, q), D = N(n, "onEscapeKeydown", 3, q), k = N(n, "forceMount", 3, !1), A = T(n, _n), j = hn.create({
		id: J(() => a()),
		ref: J(() => o(), (e) => o(e)),
		onInteractOutside: J(() => w()),
		onEscapeKeydown: J(() => D())
	}), M = R(() => ({
		side: s(),
		sideOffset: u(),
		align: f(),
		avoidCollisions: h(),
		arrowPadding: g(),
		sticky: v(),
		hideWhenDetached: b(),
		collisionPadding: S(),
		strategy: n.strategy,
		customAnchor: n.customAnchor ?? j.root.triggerNode
	})), ee = R(() => K(A, x(M), j.props));
	var P = m(), F = O(P), I = (t) => {
		{
			let r = (t, r) => {
				let i = () => (r?.()).props, a = () => (r?.()).wrapperProps, o = R(() => K(a(), { style: { pointerEvents: j.root.disableHoverableContent ? "none" : void 0 } })), s = R(() => K(i(), { style: yt("tooltip") }, { style: n.style }));
				var c = m(), u = O(c), f = (e) => {
					var t = m(), r = O(t);
					{
						let e = R(() => ({
							props: x(s),
							wrapperProps: x(o),
							...j.snippetProps
						}));
						l(r, () => n.child, () => x(e));
					}
					p(e, t);
				}, h = (t) => {
					var r = vn();
					C(r, () => ({ ...x(o) }));
					var i = y(r);
					C(i, () => ({ ...x(s) }));
					var a = y(i);
					l(a, () => n.children ?? E), e(i), e(r), p(t, r);
				};
				d(u, (e) => {
					n.child ? e(f) : e(h, -1);
				}), p(t, c);
			}, i = R(() => j.root.disableHoverableContent ? "none" : "auto");
			bt(t, _(() => x(ee), () => j.popperProps, {
				get enabled() {
					return j.root.opts.open.current;
				},
				get id() {
					return a();
				},
				trapFocus: !1,
				loop: !1,
				preventScroll: !1,
				forceMount: !0,
				get ref() {
					return j.opts.ref;
				},
				tooltip: !0,
				get shouldRender() {
					return j.shouldRender;
				},
				get contentPointerEvents() {
					return x(i);
				},
				popper: r,
				$$slots: { popper: !0 }
			}));
		}
	}, L = (t) => {
		{
			let r = (t, r) => {
				let i = () => (r?.()).props, a = () => (r?.()).wrapperProps, o = R(() => K(a(), { style: { pointerEvents: j.root.disableHoverableContent ? "none" : void 0 } })), s = R(() => K(i(), { style: yt("tooltip") }, { style: n.style }));
				var c = m(), u = O(c), f = (e) => {
					var t = m(), r = O(t);
					{
						let e = R(() => ({
							props: x(s),
							wrapperProps: x(o),
							...j.snippetProps
						}));
						l(r, () => n.child, () => x(e));
					}
					p(e, t);
				}, h = (t) => {
					var r = vn();
					C(r, () => ({ ...x(o) }));
					var i = y(r);
					C(i, () => ({ ...x(s) }));
					var a = y(i);
					l(a, () => n.children ?? E), e(i), e(r), p(t, r);
				};
				d(u, (e) => {
					n.child ? e(f) : e(h, -1);
				}), p(t, c);
			}, i = R(() => j.root.disableHoverableContent ? "none" : "auto");
			St(t, _(() => x(ee), () => j.popperProps, {
				get open() {
					return j.root.opts.open.current;
				},
				get id() {
					return a();
				},
				trapFocus: !1,
				loop: !1,
				preventScroll: !1,
				forceMount: !1,
				get ref() {
					return j.opts.ref;
				},
				tooltip: !0,
				get shouldRender() {
					return j.shouldRender;
				},
				get contentPointerEvents() {
					return x(i);
				},
				popper: r,
				$$slots: { popper: !0 }
			}));
		}
	};
	d(F, (e) => {
		k() ? e(I) : k() || e(L, 1);
	}), p(t, P), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-trigger.svelte
var bn = /* @__PURE__ */ new Set([
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
]), xn = a("<button><!></button>");
function Sn(t, n) {
	let i = c();
	te(n, !0);
	let a = N(n, "id", 19, () => he(i)), o = N(n, "disabled", 3, !1), s = N(n, "type", 3, "button"), u = N(n, "tabindex", 3, 0), f = N(n, "ref", 15, null), h = T(n, bn), g = mn.create({
		id: J(() => a()),
		disabled: J(() => o() ?? !1),
		tabindex: J(() => u() ?? 0),
		payload: J(() => n.payload),
		tether: J(() => n.tether),
		ref: J(() => f(), (e) => f(e))
	}), _ = R(() => K(h, g.props, { type: s() }));
	var v = m(), b = O(v), S = (e) => {
		var t = m(), r = O(t);
		l(r, () => n.child, () => ({ props: x(_) })), p(e, t);
	}, w = (t) => {
		var r = xn();
		C(r, () => ({ ...x(_) }));
		var i = y(r);
		l(i, () => n.children ?? E), e(r), p(t, r);
	};
	d(b, (e) => {
		n.child ? e(S) : e(w, -1);
	}), p(t, v), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-provider.svelte
function Cn(e, t) {
	te(t, !0);
	let n = N(t, "delayDuration", 3, 700), i = N(t, "disableCloseOnTriggerClick", 3, !1), a = N(t, "disableHoverableContent", 3, !1), o = N(t, "disabled", 3, !1), s = N(t, "ignoreNonKeyboardFocus", 3, !1), c = N(t, "skipDelayDuration", 3, 300);
	fn.create({
		delayDuration: J(() => n()),
		disableCloseOnTriggerClick: J(() => i()),
		disableHoverableContent: J(() => a()),
		disabled: J(() => o()),
		ignoreNonKeyboardFocus: J(() => s()),
		skipDelayDuration: J(() => c())
	});
	var u = m(), d = O(u);
	l(d, () => t.children ?? E), p(e, u), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileEventComparison.ts
var wn = /^[0-9a-f]{64}$/;
function Tn(e) {
	return wn.test(e.sourceEventId) && Number.isSafeInteger(e.updatedAtFromEvent) && e.updatedAtFromEvent >= 0;
}
function En(e, t) {
	return t.sourceEventId === e.sourceEventId ? "same-event" : t.updatedAtFromEvent > e.updatedAtFromEvent ? "candidate-newer" : t.updatedAtFromEvent < e.updatedAtFromEvent ? "candidate-older" : t.sourceEventId < e.sourceEventId ? "candidate-wins-tie-break" : "candidate-loses-tie-break";
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/profilesRepository.ts
var Dn = 2;
function On(e) {
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
function kn(e, t, n) {
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
		schemaVersion: Dn
	};
}
function An(...e) {
	let t = B.sanitizeExternalRelayUrls(e.flatMap((e) => e ?? []));
	return t.length > 0 ? t : void 0;
}
function jn(e) {
	return e.sourceEventId !== void 0 && e.updatedAtFromEvent !== void 0 && Tn({
		sourceEventId: e.sourceEventId,
		updatedAtFromEvent: e.updatedAtFromEvent
	});
}
function Mn(e, t) {
	return e.length > 0 && t.pubkeyHex === e && Tn(t) && Number.isFinite(t.fetchedAt) && t.fetchedAt >= 0;
}
function Nn(e, t, n) {
	let r = An(t.profile.profileRelays, t.observedRelays);
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
		schemaVersion: Dn
	};
}
function Pn(e, t) {
	return {
		decision: e,
		acceptedRecord: t,
		acceptedProfile: t ? On(t) : null,
		currentEventConfirmed: e === "inserted" || e === "replaced" || e === "kept-existing" || e === "merged-same-event"
	};
}
function Fn(e, t) {
	let n = t.getItem(je.NOSTR_PROFILE + e);
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
var In = new class {
	db;
	now;
	getStorage;
	constructor(e = X, t = Date.now, n = () => ne()) {
		this.db = e, this.now = t, this.getStorage = n;
	}
	async get(e) {
		if (!e) return null;
		let t = ht(e);
		try {
			let n = await this.db.profiles.get(e);
			if (n) return await this.markLegacyProfileImported(t), On(n);
		} catch {
			return Fn(e, this.getStorage());
		}
		if ((await this.db.legacyImportState.get(t))?.done === !0) return null;
		let n = this.getStorage();
		if (n.getItem(je.NOSTR_PROFILE + e) === null) return await this.markLegacyProfileImported(t), null;
		let r = Fn(e, n);
		if (!r) return null;
		try {
			await this.db.transaction("rw", this.db.profiles, this.db.legacyImportState, async () => {
				(await this.db.legacyImportState.get(t))?.done !== !0 && (await this.db.profiles.get(e) || await this.db.profiles.put(kn(e, r, this.now)), await this.db.legacyImportState.put({
					id: t,
					done: !0,
					updatedAt: this.now()
				}));
			});
			try {
				n.removeItem(je.NOSTR_PROFILE + e);
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
		e && await this.db.profiles.put(kn(e, t, this.now));
	}
	async upsertCandidate(e, t) {
		return this.db.transaction("rw", this.db.profiles, async () => {
			let n = await this.db.profiles.get(e) ?? null;
			if (!Mn(e, t)) return Pn("rejected-invalid", n);
			if (!n || !jn(n)) {
				let r = Nn(e, t, this.now());
				return await this.db.profiles.put(r), Pn(n ? "replaced" : "inserted", r);
			}
			let r = En(n, t);
			if (r === "candidate-older") return Pn("rejected-older", n);
			if (r === "candidate-loses-tie-break") return Pn("rejected-tie-break", n);
			if (r === "candidate-newer" || r === "candidate-wins-tie-break") {
				let n = Nn(e, t, this.now());
				return await this.db.profiles.put(n), Pn("replaced", n);
			}
			let i = An(n.profileRelays, t.profile.profileRelays, t.observedRelays), a = Math.max(n.fetchedAt, t.fetchedAt);
			if (a === n.fetchedAt && dt(n.profileRelays, i)) return Pn("kept-existing", n);
			let o = {
				...n,
				profileRelays: i,
				fetchedAt: a,
				updatedAt: this.now(),
				schemaVersion: Dn
			};
			return await this.db.profiles.put(o), Pn("merged-same-event", o);
		});
	}
	async delete(e) {
		if (e) {
			await this.db.profiles.delete(e);
			try {
				this.getStorage().removeItem(je.NOSTR_PROFILE + e);
			} catch {}
		}
	}
}(), Ln = a("<div aria-hidden=\"true\"></div>"), Rn = {
	hash: "svelte-ohoxs0",
	code: ".blurhash-placeholder.svelte-ohoxs0 {position:absolute;inset:0;z-index:0;border-radius:inherit;overflow:hidden;background:radial-gradient(\n                circle at top left,\n                rgba(255, 255, 255, 0.2),\n                transparent 48%\n            ),\n            linear-gradient(\n                135deg,\n                color-mix(in srgb, var(--background-color, #fff) 24%, #000 76%),\n                color-mix(in srgb, var(--background-color, #fff) 8%, #000 92%)\n            );background-position:center;background-repeat:no-repeat;background-size:cover;}.blurhash-placeholder-ready.svelte-ohoxs0 {background-image:var(--blurhash-placeholder-image);}.blurhash-placeholder.svelte-ohoxs0::after {content:\"\";position:absolute;inset:0;background:linear-gradient(\n            180deg,\n            rgba(0, 0, 0, 0.08),\n            rgba(0, 0, 0, 0.28)\n        );}:root.dark .ehagaki-app-root .blurhash-placeholder.svelte-ohoxs0::after,\n    :host(.dark) .ehagaki-app-root .blurhash-placeholder.svelte-ohoxs0::after {background:linear-gradient(\n            180deg,\n            rgba(0, 0, 0, 0.14),\n            rgba(0, 0, 0, 0.38)\n        );}"
};
function zn(e, t) {
	te(t, !0), D(e, Rn);
	let i = /* @__PURE__ */ new Map(), a = N(t, "blurhash", 3, void 0), o = N(t, "className", 3, ""), s = w(null), c = R(() => x(s) ? `--blurhash-placeholder-image: url("${x(s)}");` : "");
	async function l(e) {
		let t = e.trim();
		if (!t || typeof document > "u") return null;
		let n = i.get(t);
		if (n instanceof Promise || typeof n == "string" || n === null) return n;
		let r = Promise.resolve().then(() => {
			let e = document.createElement("canvas");
			e.width = 32, e.height = 32;
			let n = e.getContext("2d");
			if (!n) return null;
			let r = n.createImageData(32, 32);
			return r.data.set(le(t, 32, 32)), n.putImageData(r, 0, 0), e.toDataURL("image/png");
		}).catch(() => null).then((e) => (i.set(t, e), e));
		return i.set(t, r), r;
	}
	M(() => {
		let e = !0, t = a()?.trim();
		if (k(s, null), t) return l(t).then((t) => {
			e && k(s, t, !0);
		}), () => {
			e = !1;
		};
	});
	var u = Ln();
	let d;
	v((e, t) => {
		d = L(u, 1, e, "svelte-ohoxs0", d, { "blurhash-placeholder-ready": t }), n(u, x(c));
	}, [() => f(`blurhash-placeholder ${o()}`.trim()), () => !!x(s)]), p(e, u), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryMediaCache.svelte.ts
function Bn(e) {
	return {
		url: e.url,
		alt: e.alt,
		mimeType: e.mimeType,
		blurhash: e.blurhash,
		dim: e.dim,
		kind: xe({
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
function Vn(e, t) {
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
function Hn(e) {
	let t = S({ items: [] }), n = /* @__PURE__ */ new Map(), r = 0, i = "", a = !1;
	function o(e) {
		let t = Bn(e), r = Z.getCachedMediaDescriptorSnapshot(e.url);
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
		let t = Bn(e);
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
	}), M(() => {
		let f = e.getMedia(), p = Vn(f, Z.canUsePersistentCache());
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
var Un = /:([^\s:]+):/g, Wn = {
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
function Gn(e) {
	return e.nextUntil === null ? !1 : e.status === "success" ? e.hasMore : e.events.length > 0;
}
function Kn(e, t) {
	return e ? {
		status: e.name ? "resolved" : "failed",
		name: e.name
	} : {
		status: t ? "loading" : "failed",
		name: null
	};
}
function qn(e, t) {
	return B.sanitizeExternalRelayUrls([
		...e?.channelRelayHints ?? [],
		...e?.fetchedRelays ?? [],
		...e?.relayHints ?? [],
		...e?.acceptedRelays ?? [],
		...t?.relayHints ?? [],
		...t?.relays ?? []
	], { limit: 8 });
}
function Jn(e, t, n) {
	let r = Math.max(1, Math.ceil(t / n));
	return t === 0 ? 1 : Math.min(e, r);
}
function Yn(e, t = Date.now()) {
	let n = new Date(e), r = new Date(t), i = {
		hour: "numeric",
		minute: "2-digit"
	};
	if (Qn(n, r)) return new Intl.DateTimeFormat(void 0, i).format(n);
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
function Xn(e, t) {
	return new Intl.DateTimeFormat(t ?? void 0, {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	}).format(new Date(e));
}
function Zn(e, t, n = Date.now()) {
	let r = new Date(e), i = new Date(n);
	return Qn(r, i) ? er(0, t) : $n(r, i) ? er(-1, t) : r.getFullYear() === i.getFullYear() ? new Intl.DateTimeFormat(t ?? void 0, {
		month: "numeric",
		day: "numeric",
		weekday: "short"
	}).format(r) : new Intl.DateTimeFormat(t ?? void 0, {
		year: "numeric",
		month: "numeric"
	}).format(r);
}
function Qn(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
function $n(e, t) {
	let n = new Date(t);
	return n.setHours(0, 0, 0, 0), n.setDate(n.getDate() - 1), Qn(e, n);
}
function er(e, t) {
	return new Intl.RelativeTimeFormat(t ?? void 0, { numeric: "auto" }).format(e, "day");
}
function tr(e) {
	return e.trim() || " ";
}
function nr(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) {
		let e = be(r.url);
		if (!e || n.has(e)) continue;
		n.add(e);
		let i = xe({
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
function rr(e) {
	let t = fr(e.length), n = [], r = 0;
	for (let i = 0; i < t.length; i += 1) {
		let a = t[i], o = e.slice(r, r + a);
		r += a, n.push({
			items: o,
			slotCount: pr({
				totalCount: e.length,
				rowLength: o.length,
				isFinalRow: i === t.length - 1
			})
		});
	}
	return n;
}
function ir(e) {
	return e.map((e) => ({
		id: e.id,
		src: e.url,
		alt: e.alt,
		type: "image",
		dim: e.dim
	}));
}
function ar(e) {
	return or(e).aspectRatio;
}
function or(e) {
	let t = e.fallback ?? (e.kind === "video" ? "16 / 9" : "1 / 1"), n = ur(e.dim);
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
function sr(e) {
	return e.hasFetchFailed ? "error" : e.previewObjectUrl ? "ready" : e.cached || e.isLoadingPreview ? "cache-materializing" : e.isCaching ? "loading" : (e.hasResolvedCache, e.hasMetadataHint ? "placeholder" : "unknown");
}
function cr(e) {
	let t = nr(e), n = t.filter((e) => e.kind === "image");
	return {
		items: t,
		images: n,
		videos: t.filter((e) => e.kind === "video"),
		others: t.filter((e) => e.kind === "other"),
		imageRows: rr(n),
		fullscreenMediaItems: ir(n)
	};
}
function lr(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) for (let e of r.media) {
		let r = Se(e.url);
		r && !n.has(r) && (n.add(r), t.push(e.url));
	}
	return t;
}
function ur(e) {
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
function dr(e) {
	let t = tr(e.content), n = Ot(e.tags), r = mr(e.media ?? []), i = [], a = /* @__PURE__ */ new Set(), o = 0;
	for (let e of t.matchAll(Un)) {
		let s = e.index ?? -1, c = e[1] ?? "", l = e[0] ?? "";
		if (s < 0 || !l) continue;
		let u = Tt(c), d = u ? n.get(u) : void 0;
		d && (s > o && hr(i, t.slice(o, s), r), i.push({
			type: "emoji",
			shortcode: d.shortcode,
			shortcodeLower: u,
			rawShortcodeText: l,
			url: d.url
		}), a.add(d.url), o = s + l.length);
	}
	return o < t.length && hr(i, t.slice(o), r), i.length === 0 && i.push({
		type: "text",
		text: t
	}), {
		segments: i,
		emojiUrls: [...a]
	};
}
function fr(e) {
	let t = Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
	if (t === 0) return [];
	let n = Wn[t];
	if (n) return [...n];
	let r = Array.from({ length: Math.floor(t / 3) }, () => 3), i = t % 3;
	return i > 0 && r.push(i), r;
}
function pr(e) {
	let { totalCount: t, rowLength: n, isFinalRow: r } = e;
	return r && t >= 7 && n < 3 || n >= 3 ? 3 : n === 2 ? 2 : 1;
}
function mr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Se(n.url);
		e && !t.has(e) && t.set(e, n);
	}
	return t;
}
function hr(e, t, n) {
	if (!t) return;
	let r = 0;
	for (let i of gt(t)) {
		if (!i.isValidHttpUrl || !i.href) continue;
		let a = Se(i.displayText), o = n.get(a);
		gr(e, t.slice(r, i.candidateStart)), o ? e.push({
			type: "media",
			url: i.displayText,
			normalizedUrl: a,
			media: o
		}) : e.push({
			type: "link",
			text: i.displayText,
			href: i.href
		}), gr(e, i.trailingText), r = i.candidateEnd;
	}
	r < t.length && gr(e, t.slice(r));
}
function gr(e, t) {
	if (!t) return;
	let n = e[e.length - 1];
	n?.type === "text" ? n.text += t : e.push({
		type: "text",
		text: t
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryMediaList.svelte
var _r = a("<div class=\"copy-icon svg-icon svelte-8yjcw8\"></div>"), vr = a("<div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><button type=\"button\" class=\"post-history-media-retry-button svelte-8yjcw8\"> </button></div>"), yr = a("<div class=\"post-history-media-placeholder-loader svelte-8yjcw8\"><!></div>"), br = a("<div><!> <!> <!></div>"), xr = a("<img class=\"post-history-media-image post-history-media-image-single-stage svelte-8yjcw8\" loading=\"lazy\" decoding=\"async\"/>"), Sr = a("<div class=\"post-history-media-layout-frame post-history-single-image-layout-frame svelte-8yjcw8\"><!></div>"), Cr = a("<img class=\"post-history-media-image svelte-8yjcw8\" loading=\"lazy\" decoding=\"async\"/>"), wr = a("<button type=\"button\"><!></button>"), Tr = a("<div class=\"post-history-media-placeholder-loader post-history-media-placeholder-loader-single svelte-8yjcw8\"><!></div>"), Er = a("<div class=\"post-history-image-cell svelte-8yjcw8\"><div><!> <!> <!></div></div>"), Dr = a("<div class=\"post-history-image-row svelte-8yjcw8\"></div>"), Or = a("<div></div>"), kr = a("<video class=\"post-history-media-video svelte-8yjcw8\" controls=\"\" playsinline=\"\" preload=\"metadata\"><track kind=\"captions\" class=\"svelte-8yjcw8\"/></video>", 2), Ar = a("<button type=\"button\" class=\"post-history-media-retry-button svelte-8yjcw8\"> </button>"), jr = a("<div><!> <div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><!></div></div>"), Mr = a("<article class=\"post-history-video-card svelte-8yjcw8\"><div class=\"post-history-video-card-header svelte-8yjcw8\"><span class=\"post-history-video-card-label svelte-8yjcw8\"> </span> <!></div> <div class=\"post-history-video-media-frame svelte-8yjcw8\"><!></div></article>"), Nr = a("<div class=\"post-history-video-list svelte-8yjcw8\"></div>"), Pr = a("<div class=\"post-history-other-media-card svelte-8yjcw8\"><div class=\"post-history-other-media-header svelte-8yjcw8\"><span class=\"post-history-other-media-label svelte-8yjcw8\"> </span> <!></div> <div><div class=\"post-history-media-placeholder-content svelte-8yjcw8\"><!></div> <!></div></div>"), Fr = a("<div class=\"post-history-other-media-list svelte-8yjcw8\"></div>"), Ir = a("<div class=\"post-history-media-section svelte-8yjcw8\"><!> <!> <!></div>"), Lr = {
	hash: "svelte-8yjcw8",
	code: ".post-history-media-section.svelte-8yjcw8 {display:flex;flex-direction:column;gap:10px;}.post-history-image-grid.svelte-8yjcw8 {display:flex;flex-direction:column;justify-content:center;align-items:center;border-radius:12px;overflow:hidden;gap:2px;}.post-history-image-row.svelte-8yjcw8 {display:grid;grid-template-columns:repeat(\n            var(--post-history-image-columns),\n            minmax(0, 1fr)\n        );width:100%;gap:2px;}.post-history-image-cell.svelte-8yjcw8 {position:relative;min-width:0;}.post-history-image-surface-frame.svelte-8yjcw8 {position:relative;width:100%;.post-history-media-surface:where(.svelte-8yjcw8) {font-size:0;display:block;width:100%;padding:0;border:0;background-color:transparent;text-align:start;cursor:pointer;margin-inline:auto;&:active:not(:disabled) {scale:1;}}}\n\n    /* 単体画像のときグリッド側のボーダーを無効化 */.post-history-image-grid-single.svelte-8yjcw8 {border:none;border-radius:0;overflow:visible;}.post-history-image-surface-frame-single.svelte-8yjcw8 {max-width:100%;margin-inline:0;border-radius:12px;overflow:hidden;}.post-history-image-surface.svelte-8yjcw8 {overflow:hidden;}.post-history-image-surface-single.svelte-8yjcw8 {display:block;min-height:100px;}.post-history-media-layout-frame.svelte-8yjcw8 {position:relative;width:100%;max-width:100%;overflow:hidden;background:transparent;}.post-history-single-image-layout-frame.svelte-8yjcw8 {position:relative;padding:0;display:grid;place-items:center;justify-self:stretch;align-self:stretch;overflow:hidden;background:transparent;}.post-history-image-placeholder-single.svelte-8yjcw8 {position:absolute;inset:0;display:grid;place-items:center;width:100%;height:100%;min-height:0;}.post-history-media-image.svelte-8yjcw8,\n    .post-history-media-placeholder.svelte-8yjcw8,\n    .post-history-media-layout-frame.svelte-8yjcw8 {width:100%;max-width:100%;}.post-history-media-image.svelte-8yjcw8 {display:block;height:100%;object-fit:cover;}.post-history-media-image-single.svelte-8yjcw8 {height:auto;margin-inline:auto;}.post-history-media-image-single-stage.svelte-8yjcw8 {position:relative;z-index:1;}.post-history-media-video.svelte-8yjcw8 {display:block;width:100%;max-height:300px;height:100%;object-fit:contain;border-radius:10px;background:color-mix(\n            in srgb,\n            var(--background-color, #fff) 92%,\n            #000 8%\n        );}.post-history-video-media-frame.svelte-8yjcw8 {width:100%;max-height:300px;overflow:hidden;border-radius:10px;}.post-history-media-placeholder.svelte-8yjcw8 {display:flex;flex-direction:column;gap:8px;align-items:flex-start;justify-content:center;padding:12px;text-align:start;position:relative;isolation:isolate;height:auto;aspect-ratio:var(--post-history-media-aspect-ratio, 1 / 1);overflow-wrap:anywhere;margin-inline:auto;}.post-history-media-placeholder-content.svelte-8yjcw8 {position:relative;z-index:1;display:flex;flex-direction:column;gap:8px;width:100%;}.post-history-media-placeholder-loader.svelte-8yjcw8 {position:absolute;inset:auto 8px 8px auto;z-index:2;pointer-events:none;}.post-history-media-placeholder-loader-single.svelte-8yjcw8 {z-index:3;}.post-history-media-placeholder-uncached.svelte-8yjcw8 {--post-history-placeholder-stripe-soft: light-dark(\n            color-mix(in srgb, var(--background-color, #fff) 94%, #000 6%),\n            color-mix(in srgb, var(--background-color, #111) 94%, #fff 6%)\n        );--post-history-placeholder-stripe-strong: light-dark(\n            color-mix(in srgb, var(--background-color, #fff) 88%, #000 12%),\n            color-mix(in srgb, var(--background-color, #111) 88%, #fff 12%)\n        );background:repeating-linear-gradient(\n            -45deg,\n            var(--post-history-placeholder-stripe-soft),\n            var(--post-history-placeholder-stripe-soft) 10px,\n            var(--post-history-placeholder-stripe-strong) 10px,\n            var(--post-history-placeholder-stripe-strong) 20px\n        );}.post-history-image-placeholder-single.post-history-media-placeholder.svelte-8yjcw8 {height:100%;margin-inline:0;aspect-ratio:auto;}.post-history-media-placeholder-blurhash.svelte-8yjcw8 {background:color-mix(\n            in srgb,\n            var(--background-color, #fff) 18%,\n            #000 82%\n        );}.post-history-media-retry-button.svelte-8yjcw8 {width:100%;height:100%;padding:6px 12px;border:1px solid var(--border, #ccc);border-radius:10px;color:var(--text, #111);font:inherit;cursor:pointer;}.post-history-video-list.svelte-8yjcw8,\n    .post-history-other-media-list.svelte-8yjcw8 {display:flex;flex-direction:column;gap:10px;}.post-history-video-card.svelte-8yjcw8,\n    .post-history-other-media-card.svelte-8yjcw8 {display:flex;flex-direction:column;width:100%;border-radius:12px;border:1px solid var(--border-hr);background:var(--bg-input);overflow:hidden;}.post-history-video-card-header.svelte-8yjcw8,\n    .post-history-other-media-header.svelte-8yjcw8 {display:flex;align-items:center;justify-content:space-between;}.post-history-video-card-label.svelte-8yjcw8,\n    .post-history-other-media-label.svelte-8yjcw8 {min-width:0;padding:4px 8px;overflow-wrap:anywhere;color:var(--text-muted);font-size:0.875rem;line-height:1.2;}.post-history-video-placeholder.svelte-8yjcw8 {width:100%;height:100%;aspect-ratio:auto;padding:0 12px;}button.post-history-media-copy-button.circle.copy {min-width:36px;width:36px;height:36px;min-height:36px;z-index:2;}button.post-history-media-copy-button-image.circle.copy {position:absolute;inset:8px 8px auto auto;}button.post-history-video-copy-button.circle.copy {position:relative;top:auto;right:auto;flex-shrink:0;}\n\n    @keyframes svelte-8yjcw8-post-history-media-loading {\n        0% {\n            background-position: 100% 50%;\n        }\n        100% {\n            background-position: -100% 50%;\n        }\n    }.post-history-media-video {background-color:light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));}"
};
function Rr(a, s) {
	te(s, !0), D(a, Lr);
	let c = () => ee(_e, "$_", l), [l, f] = j(), g = (e, t = E, n = E) => {
		{
			let r = R(() => `post-history-media-copy-button ${n()}`), i = R(() => ue(t().kind, t().url)), a = R(() => ue(t().kind, t().url)), o = R(() => de(t().kind));
			Oe(e, {
				variant: "copy",
				shape: "circle",
				get className() {
					return x(r);
				},
				get ariaLabel() {
					return x(i);
				},
				get title() {
					return x(a);
				},
				onClick: (e) => Ee(t(), e),
				get floatingMessage() {
					return x(o);
				},
				children: (e, t) => {
					var n = _r();
					p(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	}, _ = (r, i = E, a = E, o = E, s = E, l = E) => {
		var u = br();
		let f;
		var m = y(u), g = (e) => {
			zn(e, { get blurhash() {
				return i().blurhash;
			} });
		};
		d(m, (e) => {
			s() && e(g);
		});
		var _ = b(m, 2), S = (n) => {
			var r = vr(), a = y(r), o = F(a, !0);
			e(r), v((e) => t(o, e), [() => c()("postHistory.mediaFetchAndCache")]), h("click", a, () => De(i())), p(n, r);
		};
		d(_, (e) => {
			l() && e(S);
		});
		var C = b(_, 2), w = (t) => {
			var n = yr(), r = y(n);
			ye(r, {
				showLoader: !0,
				text: !1,
				loaderSize: 34
			}), e(n), p(t, n);
		}, T = R(() => Ce(i(), a(), Y(i())));
		d(C, (e) => {
			x(T) && e(w);
		}), e(u), v((e, t) => {
			f = L(u, 1, `post-history-media-placeholder ${o()}`, "svelte-8yjcw8", f, {
				"post-history-media-placeholder-blurhash": s(),
				"post-history-image-placeholder-single": a().isSingleImage
			}), n(u, a().isSingleImage ? void 0 : a().surfaceStyle), I(u, "aria-label", e), I(u, "title", t);
		}, [() => Fe(i()), () => H(i())]), p(r, u);
	}, C = "160px 0px", T = N(s, "scrollRoot", 3, null), A = N(s, "onImageOpen", 3, void 0), M = N(s, "mediaLayout", 3, void 0), P = w(S({})), ne = /* @__PURE__ */ new Set(), re = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), z = R(() => M() ?? cr(s.media)), B = Hn({ getMedia: () => x(z).items }), ae = R(() => new Map(B.state.items.map((e) => [e.url, e]))), V = R(() => x(z).imageRows.map((e) => ({
		...e,
		items: e.items.map((e) => ce(e))
	}))), oe = R(() => x(z).videos.map((e) => ce(e))), se = R(() => x(z).others.map((e) => ce(e)));
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
		let t = x(ae).get(e.url);
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
		let n = le(e), r = x(P)[t];
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
	function Y(e) {
		return sr({
			hasResolvedCache: e.hasResolvedCache,
			cached: e.cached,
			previewObjectUrl: e.previewObjectUrl,
			isLoadingPreview: e.isLoadingPreview,
			isCaching: e.isCaching,
			hasFetchFailed: e.hasFetchFailed,
			hasMetadataHint: J(e)
		});
	}
	function be(e) {
		let t = xe(e.item, e.slotCount), n = Se(e.item) ? "cover" : "contain", r = or({
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
		let r = x(z).images.length === 4 ? "4 / 3" : t === 1 ? ar({
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
		return !t.isSingleImage && je(e, n);
	}
	function we(e, t, n) {
		return t.isSingleImage && je(e, n);
	}
	function Te(e) {
		ne.has(e) || (ne.add(e), B.fetchAndCacheMedia(e));
	}
	async function Ee(e, t) {
		t.stopPropagation(), t.preventDefault();
		let n = await _t(e.url, "URL", navigator, window);
		return k(P, {
			...x(P),
			[e.url]: n ? "copied" : "failed"
		}, !0), setTimeout(() => {
			k(P, {
				...x(P),
				[e.url]: void 0
			}, !0);
		}, 1800), n;
	}
	function De(e) {
		B.fetchAndCacheMedia(e.url);
	}
	function ke(e, t) {
		if (!e.cached) return;
		let n = x(z).fullscreenMediaItems.findIndex((t) => t.id === e.id);
		n < 0 || A()?.({
			index: n,
			mediaList: x(z).fullscreenMediaItems,
			focusOrigin: t
		});
	}
	function Ae(e) {
		return e.hasResolvedCache && !e.cached && !e.isCaching && !e.hasFetchFailed;
	}
	function je(e, t) {
		return t !== "ready" && t !== "cache-materializing" && (!e.hasResolvedCache || t === "loading");
	}
	function Me(e, t) {
		return !!e.blurhash && t !== "ready" && t !== "cache-materializing" && (e.kind === "image" || e.kind === "video");
	}
	function Ne(e) {
		return e === "ready" || e === "cache-materializing";
	}
	function Pe(e) {
		return e === "error" ? "post-history-media-placeholder-failed" : "post-history-media-placeholder-uncached";
	}
	function Fe(e) {
		return `${Le(e)} ${H(e)}`;
	}
	function Ie(e) {
		let t = re.get(e.id);
		if (t) return t;
		let n = ar({
			dim: e.dim,
			kind: e.kind
		});
		return re.set(e.id, n), ie.set(e.id, !!e.dim?.trim()), n;
	}
	function Le(e) {
		return !e.hasResolvedCache || e.isLoadingPreview ? c()("postHistory.mediaLoading") : e.cached ? c()("postHistory.mediaCached") : e.hasFetchFailed ? c()("postHistory.mediaLoadFailed") : e.isCaching ? c()("postHistory.mediaLoading") : c()("postHistory.mediaNotCached");
	}
	var Re = m(), ze = O(Re), Be = (r) => {
		var a = Ir(), s = y(a), l = (t) => {
			var r = Or();
			let a;
			i(r, 21, () => x(V), o, (t, r) => {
				var a = Dr();
				i(a, 21, () => x(r).items, (e) => e.id, (t, i) => {
					let a = R(() => x(z).images.length === 1), o = R(() => be({
						item: x(i),
						slotCount: x(r).slotCount,
						isSingleImage: x(a)
					})), s = R(() => Y(x(i))), c = R(() => Me(x(i), x(s)));
					var l = Er(), f = y(l);
					let m;
					var S = y(f), w = (t) => {
						var r = wr();
						let s;
						var c = y(r), l = (t) => {
							var r = Sr(), a = y(r), s = (e) => {
								var t = xr();
								v((e) => {
									I(t, "src", x(i).previewObjectUrl), I(t, "alt", e), n(t, x(o).imageStyle), I(t, "width", x(o).dimensionHints.width), I(t, "height", x(o).dimensionHints.height);
								}, [() => x(i).alt || H(x(i))]), p(e, t);
							};
							d(a, (e) => {
								x(i).previewObjectUrl && e(s);
							}), e(r), v(() => n(r, x(o).layoutFrameStyle)), p(t, r);
						}, u = (e) => {
							var t = Cr();
							v((e) => {
								I(t, "src", x(i).previewObjectUrl), I(t, "alt", e), n(t, x(o).imageStyle), I(t, "width", x(o).dimensionHints.width), I(t, "height", x(o).dimensionHints.height);
							}, [() => x(i).alt || H(x(i))]), p(e, t);
						};
						d(c, (e) => {
							x(a) ? e(l) : x(i).previewObjectUrl && e(u, 1);
						}), e(r), v((e, t) => {
							s = L(r, 1, "post-history-media-surface post-history-image-surface svelte-8yjcw8", null, s, { "post-history-image-surface-single": x(a) }), n(r, x(o).surfaceStyle), I(r, "aria-label", e), I(r, "title", t);
						}, [() => U(x(i)), () => H(x(i))]), h("click", r, (e) => ke(x(i), e.currentTarget instanceof HTMLElement ? e.currentTarget : null)), p(t, r);
					}, E = R(() => Ne(x(s))), D = (t) => {
						var r = Sr(), a = y(r);
						{
							let e = R(() => Pe(x(s)));
							_(a, () => x(i), () => x(o), () => x(e), () => x(c), () => x(s) === "error");
						}
						e(r), v(() => n(r, x(o).layoutFrameStyle)), p(t, r);
					}, O = (e) => {
						{
							let t = R(() => Pe(x(s)));
							_(e, () => x(i), () => x(o), () => x(t), () => x(c), () => x(s) === "error");
						}
					};
					d(S, (e) => {
						x(E) ? e(w) : x(a) ? e(D, 1) : e(O, -1);
					});
					var k = b(S, 2), A = (t) => {
						var n = Tr(), r = y(n);
						ye(r, {
							showLoader: !0,
							text: !1,
							loaderSize: 34
						}), e(n), p(t, n);
					}, j = R(() => we(x(i), x(o), x(s)));
					d(k, (e) => {
						x(j) && e(A);
					});
					var M = b(k, 2);
					g(M, () => x(i), () => "post-history-media-copy-button-image"), e(f), e(l), u(l, (e, t) => At?.(e, t), () => ({
						enabled: Ae(x(i)),
						once: !0,
						root: T(),
						rootMargin: C,
						onEnterView: () => Te(x(i).url)
					})), v(() => {
						m = L(f, 1, "post-history-image-surface-frame svelte-8yjcw8", null, m, { "post-history-image-surface-frame-single": x(a) }), n(f, x(a) ? x(o).frameStyle : void 0);
					}), p(t, l);
				}), e(a), v(() => n(a, `--post-history-image-columns: ${x(r).slotCount};`)), p(t, a);
			}), e(r), v(() => a = L(r, 1, "post-history-image-grid svelte-8yjcw8", null, a, { "post-history-image-grid-single": x(z).images.length === 1 })), p(t, r);
		};
		d(s, (e) => {
			x(V).length > 0 && e(l);
		});
		var f = b(s, 2), m = (r) => {
			var a = Nr();
			i(a, 21, () => x(oe), (e) => e.id, (r, i) => {
				let a = R(() => Ie(x(i))), o = R(() => Y(x(i))), s = R(() => Me(x(i), x(o)));
				var l = Mr(), f = y(l), m = y(f), _ = F(m, !0), S = b(m, 2);
				g(S, () => x(i), () => "post-history-video-copy-button"), e(f);
				var w = b(f, 2), E = y(w), D = (e) => {
					var t = kr();
					v(() => I(t, "src", x(i).previewObjectUrl)), p(e, t);
				}, O = (n) => {
					var r = jr();
					let a;
					var o = y(r), l = (e) => {
						zn(e, { get blurhash() {
							return x(i).blurhash;
						} });
					};
					d(o, (e) => {
						x(s) && e(l);
					});
					var u = b(o, 2), f = y(u), m = (e) => {
						var n = Ar(), r = F(n, !0);
						v((e) => t(r, e), [() => c()("postHistory.mediaFetchAndCache")]), h("click", n, () => De(x(i))), p(e, n);
					};
					d(f, (e) => {
						x(i).hasFetchFailed && e(m);
					}), e(u), e(r), v((e, t) => {
						a = L(r, 1, "post-history-media-placeholder post-history-video-placeholder svelte-8yjcw8", null, a, {
							"post-history-media-placeholder-cached": x(i).cached,
							"post-history-media-placeholder-uncached": !x(i).cached && !x(i).hasFetchFailed,
							"post-history-media-placeholder-failed": x(i).hasFetchFailed,
							"post-history-media-placeholder-blurhash": x(s)
						}), I(r, "aria-label", e), I(r, "title", t);
					}, [() => Fe(x(i)), () => H(x(i))]), p(n, r);
				};
				d(E, (e) => {
					x(i).cached && x(i).previewObjectUrl ? e(D) : e(O, -1);
				}), e(w), e(l), u(l, (e, t) => At?.(e, t), () => ({
					enabled: Ae(x(i)),
					once: !0,
					root: T(),
					rootMargin: C,
					onEnterView: () => Te(x(i).url)
				})), v((e, r) => {
					t(_, e), n(w, r);
				}, [() => H(x(i)), () => `${q(x(a))} max-height: 300px;`]), p(r, l);
			}), e(a), p(r, a);
		};
		d(f, (e) => {
			x(oe).length > 0 && e(m);
		});
		var S = b(f, 2), w = (n) => {
			var r = Fr();
			i(r, 21, () => x(se), (e) => e.id, (n, r) => {
				let i = R(() => Y(x(r)));
				var a = Pr(), o = y(a), s = y(o), l = F(s, !0), f = b(s, 2);
				g(f, () => x(r), () => "post-history-video-copy-button"), e(o);
				var m = b(o, 2);
				let _;
				var S = y(m), w = y(S), E = (e) => {
					var n = Ar(), i = F(n, !0);
					v((e) => t(i, e), [() => c()("postHistory.mediaFetchAndCache")]), h("click", n, () => De(x(r))), p(e, n);
				};
				d(w, (e) => {
					x(r).hasFetchFailed && e(E);
				}), e(S);
				var D = b(S, 2), O = (t) => {
					var n = yr(), r = y(n);
					ye(r, {
						showLoader: !0,
						text: !1,
						loaderSize: 34
					}), e(n), p(t, n);
				}, k = R(() => je(x(r), x(i)));
				d(D, (e) => {
					x(k) && e(O);
				}), e(m), e(a), u(a, (e, t) => At?.(e, t), () => ({
					enabled: Ae(x(r)),
					once: !0,
					root: T(),
					rootMargin: C,
					onEnterView: () => Te(x(r).url)
				})), v((e, n, i) => {
					t(l, e), _ = L(m, 1, "post-history-media-placeholder svelte-8yjcw8", null, _, {
						"post-history-media-placeholder-cached": x(r).cached,
						"post-history-media-placeholder-uncached": !x(r).cached && !x(r).hasFetchFailed,
						"post-history-media-placeholder-failed": x(r).hasFetchFailed
					}), I(m, "aria-label", n), I(m, "title", i);
				}, [
					() => H(x(r)),
					() => Fe(x(r)),
					() => H(x(r))
				]), p(n, a);
			}), e(r), p(n, r);
		};
		d(S, (e) => {
			x(se).length > 0 && e(w);
		}), e(a), p(r, a);
	};
	d(ze, (e) => {
		x(z).items.length > 0 && e(Be);
	}), p(a, Re), r(), f();
}
s(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/components/TextLinkSegments.svelte
var zr = a("<a class=\"reference-content-link svelte-1dq7r7\" target=\"_blank\" rel=\"noopener noreferrer\"> </a>"), Br = a("<span> </span>"), Vr = {
	hash: "svelte-1dq7r7",
	code: ".reference-content-link.svelte-1dq7r7 {overflow-wrap:anywhere;word-break:break-word;}.reference-content-link.svelte-1dq7r7:visited {color:var(--link-visited);}"
};
function Hr(e, n) {
	D(e, Vr);
	var r = m(), a = O(r);
	i(a, 17, () => n.segments, o, (e, n) => {
		var r = m(), i = O(r), a = (e) => {
			var r = zr(), i = F(r, !0);
			v(() => {
				I(r, "href", x(n).href), t(i, x(n).text);
			}), p(e, r);
		}, o = (e) => {
			var r = Br(), i = F(r, !0);
			v(() => t(i, x(n).text)), p(e, r);
		};
		d(i, (e) => {
			x(n).type === "link" ? e(a) : e(o, -1);
		}), p(e, r);
	}), p(e, r);
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPreviewContent.svelte
var Ur = a("<span class=\"post-history-custom-emoji-slot post-history-custom-emoji-failed svelte-yrehuj\" role=\"img\" tabindex=\"0\"> </span>"), Wr = a("<img class=\"post-history-custom-emoji svelte-yrehuj\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), Gr = a("<span class=\"post-history-custom-emoji-placeholder svelte-yrehuj\" aria-hidden=\"true\"></span>"), Kr = a("<span class=\"post-history-custom-emoji-slot svelte-yrehuj\"><!></span>"), qr = a("<div></div> <!>", 1), Jr = a("<div class=\"post-history-preview-content svelte-yrehuj\"><!></div>"), Yr = {
	hash: "svelte-yrehuj",
	code: ".post-history-preview-content.svelte-yrehuj {position:relative;display:flex;flex-direction:column;gap:6px;}.post-history-preview-text.svelte-yrehuj {overflow-wrap:anywhere;white-space:pre-wrap;font-size:var(--post-content-font-size, 1rem);line-height:var(--post-content-line-height, 1.5);}.post-history-preview-text-collapsed.svelte-yrehuj {max-height:calc(5 * var(--post-content-line-height, 1.5) * 1em);overflow:hidden;}.post-history-custom-emoji-slot.svelte-yrehuj {display:inline-grid;margin:0;padding:0;}.post-history-custom-emoji.svelte-yrehuj,\n    .post-history-custom-emoji-placeholder.svelte-yrehuj {width:100%;height:100%;}.post-history-custom-emoji.svelte-yrehuj {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-history-custom-emoji-failed.svelte-yrehuj {display:inline-grid;place-items:center;overflow:hidden;border-radius:4px;background:rgba(127, 127, 127, 0.18);font-size:0.45em;line-height:1;vertical-align:bottom;white-space:nowrap;cursor:help;}.post-history-custom-emoji-placeholder.svelte-yrehuj {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}"
};
function Xr(a, s) {
	te(s, !0), D(a, Yr);
	let c = N(s, "textOverlay", 3, void 0), h = N(s, "emojiLoadStateByUrl", 19, () => ({})), g = N(s, "emojiImageMetaByUrl", 19, () => ({})), _ = N(s, "previewCollapseAction", 3, () => ({})), S = N(s, "previewCollapseEventId", 3, ""), C = N(s, "previewContentId", 3, void 0), w = N(s, "isCollapsed", 3, !1), T = N(s, "emojiSize", 3, 30), k = N(s, "fontSize", 3, "1rem"), A = N(s, "lineHeight", 3, 1.5), j = N(s, "contentClass", 3, ""), M = N(s, "collapsedContentClass", 3, ""), ee = /* @__PURE__ */ new Map();
	function P(e) {
		return e.type !== "media";
	}
	let ne = R(() => s.previewContent.segments.filter(P)), re = R(() => x(ne).some((e) => e.type === "emoji" || e.type === "link" || e.type === "text" && e.text.trim().length > 0));
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
		let t = ee.get(e);
		if (t === void 0) {
			let n = g()[e]?.aspectRatio;
			t = typeof n == "number" && Number.isFinite(n) && n > 0 ? T() * n : T(), ee.set(e, t);
		}
		return [
			`width: ${B(t)}px;`,
			`height: ${T()}px;`,
			"vertical-align: bottom;"
		].join(" ");
	}
	var V = Jr(), oe = y(V), se = (r) => {
		var a = qr(), s = O(a);
		i(s, 21, () => x(ne), o, (r, i) => {
			var a = m(), o = O(a), s = (e) => {
				{
					let t = R(() => [x(i)]);
					Hr(e, { get segments() {
						return x(t);
					} });
				}
			}, c = (e) => {
				var r = Ur(), a = F(r, !0);
				v((e) => {
					n(r, e), I(r, "aria-label", x(i).rawShortcodeText), I(r, "title", x(i).rawShortcodeText), t(a, x(i).rawShortcodeText);
				}, [() => ae(x(i).url)]), p(e, r);
			}, l = R(() => z(x(i).url)), u = (t) => {
				var r = Kr(), a = y(r), o = (e) => {
					var t = Wr();
					v(() => {
						I(t, "src", x(i).url), I(t, "alt", x(i).rawShortcodeText), I(t, "title", x(i).rawShortcodeText);
					}), p(e, t);
				}, s = R(() => ie(x(i).url)), c = (e) => {
					var t = Gr();
					p(e, t);
				};
				d(a, (e) => {
					x(s) ? e(o) : e(c, -1);
				}), e(r), v((e) => n(r, e), [() => ae(x(i).url)]), p(t, r);
			};
			d(o, (e) => {
				x(i).type === "text" || x(i).type === "link" ? e(s) : x(l) ? e(c, 1) : e(u, -1);
			}), p(r, a);
		}), e(s), u(s, (e, t) => _()?.(e, t), S);
		var h = b(s, 2);
		l(h, () => c() ?? E), v((e) => {
			I(s, "id", C()), L(s, 1, e, "svelte-yrehuj");
		}, [() => f([
			"post-history-preview-text",
			j(),
			w() ? "post-history-preview-text-collapsed" : "",
			w() ? M() : ""
		].filter(Boolean).join(" "))]), p(r, a);
	};
	d(oe, (e) => {
		x(re) && e(se);
	}), e(V), v(() => n(V, `--post-content-font-size: ${k()}; --post-content-line-height: ${A()};`)), p(a, V), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postContentPreview.ts
function Zr(e, t) {
	let n = t.find((e) => e[0] === "content-warning");
	return n && n.length > 2 ? n[2] : e;
}
function Qr(e) {
	let t = e.tags.find((e) => e[0] === "content-warning"), n = t !== void 0 && t.length > 2, r = e.resolvedBody ? e.sourceContent : Zr(e.sourceContent, e.tags), i = e.displayContent ?? r, a = He({
		content: r,
		tags: e.tags
	}), o = e.media === void 0 ? a : n ? [...e.media, ...a.filter((t) => !e.media.some((e) => e.url === t.url))] : e.media, s = dr({
		content: i,
		tags: e.tags,
		media: o
	}), c = cr(o);
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
function $r(e, t, n = t) {
	return Qr({
		kind: e.kind,
		sourceContent: t,
		displayContent: n,
		tags: e.sourceTags,
		resolvedBody: !0
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostContentPreview.svelte
var ei = a("<span class=\"svelte-13idcaf\"> </span>"), ti = a("<span role=\"status\" class=\"svelte-13idcaf\"> </span>"), ni = a("<div class=\"content-warning-prompt svelte-13idcaf\" role=\"group\"><div class=\"content-warning-copy svelte-13idcaf\"><strong> </strong> <!></div> <!> <button type=\"button\" class=\"content-warning-reveal-button svelte-13idcaf\"> </button></div>"), ri = a("<div class=\"post-preview-content\"><!></div>"), ii = a("<div class=\"post-preview-media\"><!></div>"), ai = a("<!> <!> <!> <!>", 1), oi = a("<div><!></div>"), si = {
	hash: "svelte-13idcaf",
	code: ".post-content-preview.svelte-13idcaf {display:flex;flex-direction:column;gap:var(--post-content-block-gap, 6px);width:100%;max-width:100%;min-width:0;}.content-warning-prompt.svelte-13idcaf {display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;width:100%;max-width:100%;min-width:0;box-sizing:border-box;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 16%);color:var(--text);}.content-warning-copy.svelte-13idcaf {display:flex;flex:1 1 0;flex-direction:column;gap:3px;min-width:0;overflow-wrap:anywhere;}.content-warning-copy.svelte-13idcaf span:where(.svelte-13idcaf) {color:var(--text-muted);font-size:0.9em;}.content-warning-reveal-button.svelte-13idcaf {flex:0 1 auto;height:auto;max-width:100%;min-width:0;min-height:40px;box-sizing:border-box;padding:6px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;cursor:pointer;white-space:normal;overflow-wrap:anywhere;}.content-warning-reveal-button.svelte-13idcaf:hover {border-color:var(--theme);}"
};
function ci(i, a) {
	te(a, !0), D(i, si);
	let o = () => ee(_e, "$_", s), [s, c] = j(), u = N(a, "loadSensitiveBody", 3, void 0), f = N(a, "resolveSensitiveDisplayContent", 3, void 0), g = N(a, "contentWarningEventId", 3, void 0), _ = N(a, "density", 3, "standard"), C = N(a, "emojiLoadStateByUrl", 19, () => ({})), T = N(a, "emojiImageMetaByUrl", 19, () => ({})), ne = N(a, "scrollRoot", 3, null), re = N(a, "previewContentId", 3, void 0), ie = N(a, "isTextCollapsed", 3, !1), z = N(a, "previewCollapseAction", 3, () => ({})), B = N(a, "previewCollapseEventId", 3, ""), ae = N(a, "contentClass", 3, ""), V = N(a, "collapsedContentClass", 3, ""), oe = N(a, "renderWhenEmpty", 3, !1), se = N(a, "onImageOpen", 3, void 0), H = N(a, "betweenContentAndMedia", 3, void 0), ce = N(a, "afterContentAndMedia", 3, void 0), le = N(a, "textOverlay", 3, void 0), ue = w(null), de = w(!1), U = w(void 0), fe = w(!1), W = w(!1), G = 0, pe, K = w(S({})), me = w(S({})), he = R(() => g() === void 0 ? x(de) : x(ue) === g());
	function ge() {
		pe?.abort(), pe = void 0, G += 1, k(ue, null), k(de, !1), k(U, void 0), k(fe, !1), k(W, !1), k(K, {}, !0), k(me, {}, !0);
	}
	let ve, q;
	M(() => {
		let e = g(), t = u(), n = t === q || !!t?.scope && !!q?.scope && t.scope.runtime === q.scope.runtime && t.scope.ownerPubkey === q.scope.ownerPubkey;
		e === ve && n || A(ge), ve = e, q = t;
		let r = !0, i = t?.observe?.((e) => {
			r && (e === "deleted" || e === "invalid" || e === "missing" && x(U) !== void 0) && (ge(), k(W, !0));
		});
		return () => {
			r = !1, i?.();
		};
	}), P(ge);
	let J = R(() => x(U) === void 0 ? a.model : $r(a.model, x(U), f()?.(x(U)) ?? x(U)));
	M(() => {
		if (!x(he) || x(U) === void 0 || !u()?.loadEmoji) return;
		let e = x(J).previewContent.emojiUrls, t = u().loadEmoji, n = G;
		for (let r of e) A(() => x(K)[r]) || C()[r] === "ready" || (k(K, {
			...A(() => x(K)),
			[r]: "loading"
		}, !0), t(r).then((e) => {
			n === G && (k(K, {
				...x(K),
				[r]: e.ready ? "ready" : "failed"
			}, !0), e.ready && e.aspectRatio && k(me, {
				...x(me),
				[r]: { aspectRatio: e.aspectRatio }
			}, !0));
		}).catch(() => {
			n === G && k(K, {
				...x(K),
				[r]: "failed"
			}, !0);
		}));
	});
	async function ye() {
		if (u()) {
			let e = G;
			pe?.abort(), pe = new AbortController(), k(fe, !0), k(W, !1);
			try {
				let t = await u()(pe.signal);
				if (e !== G) return;
				if (t === null) {
					k(W, !0);
					return;
				}
				k(U, t, !0);
			} catch {
				if (e !== G) return;
				k(W, !0);
				return;
			} finally {
				e === G && k(fe, !1);
			}
		}
		g() === void 0 ? k(de, !0) : k(ue, g());
	}
	let Y = R(() => {
		switch (_()) {
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
	var be = m(), xe = O(be), Se = (r) => {
		var i = oi(), a = y(i), s = (n) => {
			var r = ni(), i = y(r), a = y(i), s = F(a, !0), c = b(a, 2), l = (e) => {
				var n = ei(), r = F(n, !0);
				v(() => t(r, x(J).contentWarning.reason)), p(e, n);
			};
			d(c, (e) => {
				x(J).contentWarning.reason && e(l);
			}), e(i);
			var u = b(i, 2), f = (e) => {
				var n = ti(), r = F(n, !0);
				v((e) => t(r, e), [() => o()("postContent.sensitivePayloadLoading")]), p(e, n);
			}, m = (e) => {
				var n = ti(), r = F(n, !0);
				v((e) => t(r, e), [() => o()("postContent.sensitivePayloadUnavailable")]), p(e, n);
			};
			d(u, (e) => {
				x(fe) ? e(f) : x(W) && e(m, 1);
			});
			var g = b(u, 2), _ = F(g, !0);
			e(r), v((e, n, i) => {
				I(r, "aria-label", e), t(s, n), g.disabled = x(fe), t(_, i);
			}, [
				() => o()("postContent.contentWarningTitle"),
				() => o()("postContent.contentWarningTitle"),
				() => o()(x(W) ? "postContent.retrySensitivePayload" : "postContent.showContentWarningBody")
			]), h("click", g, () => void ye()), p(n, r);
		}, c = (t) => {
			var n = ai(), r = O(n), i = (t) => {
				var n = ri(), r = y(n);
				{
					let e = R(() => ({
						...C(),
						...x(K)
					})), t = R(() => ({
						...T(),
						...x(me)
					}));
					Xr(r, {
						get previewContent() {
							return x(J).previewContent;
						},
						get emojiLoadStateByUrl() {
							return x(e);
						},
						get emojiImageMetaByUrl() {
							return x(t);
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
							return x(Y).emojiSize;
						},
						get fontSize() {
							return x(Y).fontSize;
						},
						get lineHeight() {
							return x(Y).lineHeight;
						}
					});
				}
				e(n), p(t, n);
			};
			d(r, (e) => {
				x(J).hasRenderableText && e(i);
			});
			var a = b(r, 2);
			l(a, () => H() ?? E);
			var o = b(a, 2), s = (t) => {
				var n = ii();
				Rr(y(n), {
					get media() {
						return x(J).media;
					},
					get mediaLayout() {
						return x(J).mediaLayout;
					},
					get scrollRoot() {
						return ne();
					},
					get onImageOpen() {
						return se();
					}
				}), e(n), p(t, n);
			};
			d(o, (e) => {
				x(J).hasRenderableMedia && e(s);
			});
			var c = b(o, 2);
			l(c, () => ce() ?? E), p(t, n);
		};
		d(a, (e) => {
			x(J).contentWarning && !x(he) ? e(s) : e(c, -1);
		}), e(i), v(() => {
			L(i, 1, `post-content-preview post-content-preview-${_()}`, "svelte-13idcaf"), n(i, `--post-content-block-gap: ${x(Y).gap}px;`);
		}), p(r, i);
	};
	d(xe, (e) => {
		(x(J).hasRenderableText || x(J).hasRenderableMedia || x(J).contentWarning || oe() || ce()) && e(Se);
	}), p(i, be), r(), c();
}
s(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogPresentation.ts
var li = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function ui(e) {
	return e.isSearchMode ? e.totalCountKnown === !1 ? { key: e.totalCountStatus === "failed" ? "postHistory.countUnavailable" : "postHistory.countLoading" } : e.totalCount <= 0 ? null : {
		key: "postHistory.searchCountSummary",
		values: { total: e.totalCount }
	} : e.totalCountKnown ? {
		key: "postHistory.visibleCountSummary",
		values: { total: e.totalCount }
	} : e.totalCountStatus === "failed" ? { key: "postHistory.countUnavailable" } : { key: "postHistory.countLoading" };
}
function di(e) {
	return e.direction === "older" ? e.isSearchMode ? "postHistory.loadOlderSearchResults" : "postHistory.loadOlder" : e.isSearchMode ? "postHistory.loadNewerSearchResults" : "postHistory.loadNewer";
}
function fi(e) {
	return e.status === "loading" ? { key: "postHistory.checkingReplies" } : e.status === "failed" ? { key: "postHistory.recheckReplies" } : e.status === "loaded" ? e.replyCount === 0 ? { key: "postHistory.recheckReplies" } : e.visible ? { key: "postHistory.hideReplies" } : {
		key: "postHistory.showRepliesWithCount",
		values: { count: e.replyCount }
	} : { key: "postHistory.checkReplies" };
}
function pi(e) {
	return e.visible ? { key: "postHistory.hideReactions" } : {
		key: "postHistory.showReactionsWithCount",
		values: { count: e.reactionCount }
	};
}
function mi(e) {
	return e === "+";
}
function hi(e) {
	let t = e.trim();
	if (!t) return "+";
	if (wt(t)) return t;
	let n = li.segment(t)[Symbol.iterator]().next();
	return n.done ? "" : n.value.segment;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryContextFetchService.ts
var gi = 5e3, _i = 8, vi = new class {
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
			i !== void 0 && (this.clearTimeoutFn(i), i = void 0);
			for (let e of r) e.unsubscribe?.();
			r.clear();
		}, d = (e) => (t) => {
			n || (n = !0, u(), e(t));
		};
		return {
			promise: new Promise((f) => {
				let p = d(f);
				a = p, i = this.setTimeoutFn(() => {
					this.console.warn("post_history_context_fetch_timeout", t.eventId), p({
						event: null,
						relayUrl: null
					});
				}, t.timeoutMs ?? gi);
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
					let d = Pe(), f = !1, h = () => {
						f || (f = !0, a === "base" ? s = !0 : l = !0, m());
					};
					try {
						let i = Qe(e, d, { on: { relays: c } }).subscribe({
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
				h(this.resolveRelayUrls(t.relayHints, t.relayConfig), "base"), t.authorHint && (this.lookupAuthorWriteRelaysFn ? this.lookupAuthorWriteRelaysFn(t.authorHint) : ut(e).lookup(t.authorHint).then((e) => e.writeRelays)).then((e) => {
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
		let n = we(e, _i);
		if (n) return n;
		let r = t ? [...B.extractReadRelays(t), ...B.extractWriteRelays(t)] : [], i = B.sanitizeExternalRelayUrls([...e ?? [], ...r], { limit: _i });
		return i.length > 0 ? i : B.sanitizeExternalRelayUrls(z, { limit: _i });
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileRelayTiers.ts
function yi(e) {
	let t = Te(), n = t ? [] : B.sanitizeExternalRelayUrls(ae), r = new Set(n), i = B.sanitizeExternalRelayUrls(e.contextualRelays).filter((e) => !r.has(e)).slice(0, t ? void 0 : e.contextualRelayLimit), a = new Set(i);
	return {
		bootstrap: n,
		contextual: i,
		fallback: t ? [] : B.sanitizeExternalRelayUrls([...z, ...e.fallbackRelays ?? []]).filter((e) => !r.has(e) && !a.has(e))
	};
}
function bi(e, t) {
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
var xi = 3e5, Si = 18e5, Ci = 6e4, wi = 30, Ti = 4e3, Ei = 12, Di = 50, Oi = 2, ki = 600, Q = w({}), Ai = /* @__PURE__ */ new Map(), ji = /* @__PURE__ */ new Map(), Mi = /* @__PURE__ */ new Map(), Ni = /* @__PURE__ */ new Map(), Pi = [], Fi = null, Ii = /* @__PURE__ */ new Map();
function Li(e) {
	return !e.signal?.aborted;
}
async function Ri(e, t, n) {
	if (t.signal?.aborted) return null;
	let r = Ii.get(e);
	(!r || r.abort.signal.aborted) && (r = {
		abort: new AbortController(),
		consumers: /* @__PURE__ */ new Set()
	}, Ii.set(e, r));
	let i = {}, a = r;
	r.consumers.add(i);
	let o = () => {
		a.consumers.delete(i), a.consumers.size || a.abort.abort();
	};
	t.signal?.addEventListener("abort", o, { once: !0 });
	try {
		let i = da(e, {
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
			t.signal?.removeEventListener("abort", o), o(), !a.consumers.size && Ii.get(e) === a && Ii.delete(e);
		};
		a.followup ? a.followup.then(n, n) : n();
	}
}
function $() {
	return Date.now();
}
function zi() {
	return Math.floor($() / 1e3);
}
function Bi(e) {
	return e ? {
		name: e.name,
		displayName: e.displayName,
		picture: e.picture
	} : null;
}
function Vi(e = []) {
	return B.sanitizeExternalRelayUrls(e);
}
function Hi(e = []) {
	return Vi(e).slice(0, Ei);
}
function Ui(e) {
	return e.flatMap((e) => {
		let t = [];
		for (let n = 0; n < e.pubkeys.length; n += Di) t.push({
			relays: e.relays,
			pubkeys: e.pubkeys.slice(n, n + Di)
		});
		return t;
	});
}
async function Wi(e, t, n) {
	let r = Array(e.length), i = 0, a = Array.from({ length: Math.min(t, e.length) }, async () => {
		for (; i < e.length;) {
			let t = i;
			i += 1, r[t] = await n(e[t]);
		}
	});
	return await Promise.all(a), r;
}
function Gi(e, t) {
	return e.expireAtMs <= t;
}
function Ki(e, t) {
	return e.staleAtMs <= t;
}
function qi(e, t) {
	return e.status === "negative" && !!e.negativeUntilMs && e.negativeUntilMs > t;
}
function Ji(e, t) {
	return typeof e.fetchedAt == "number" && Number.isFinite(e.fetchedAt) ? e.fetchedAt : t;
}
function Yi(e, t, n = !0) {
	if (k(Q, {
		...x(Q),
		[e]: t
	}), !n) return;
	let r = Ni.get(e);
	if (r && r.size !== 0) for (let e of r) e(t.profile);
}
function Xi(e) {
	let t = $();
	Yi(e, {
		pubkey: e,
		status: "negative",
		profile: null,
		profileSummary: null,
		metadataRaw: null,
		fetchedAtMs: t,
		sourceEventCreatedAtSec: null,
		sourceEventId: null,
		staleAtMs: t + Ci,
		expireAtMs: t + Ci,
		negativeUntilMs: t + Ci,
		sourceRelay: null,
		lastValidatedAtMs: t,
		persistence: "persisted"
	});
}
function Zi(e) {
	let t = $(), n = e.fetchedAtMs ?? t, r = {
		...e.profile,
		fetchedAt: e.profile.fetchedAt ?? n,
		updatedAtFromEvent: e.sourceEventCreatedAtSec ?? e.profile.updatedAtFromEvent
	};
	Yi(e.pubkey, {
		pubkey: e.pubkey,
		status: "hit",
		profile: r,
		profileSummary: Bi(r),
		metadataRaw: e.metadataRaw,
		fetchedAtMs: n,
		sourceEventCreatedAtSec: e.sourceEventCreatedAtSec,
		sourceEventId: e.sourceEventId ?? null,
		staleAtMs: e.persistence === "temporary" ? t : n + xi,
		expireAtMs: n + Si,
		negativeUntilMs: null,
		sourceRelay: e.sourceRelay,
		lastValidatedAtMs: n,
		persistence: e.persistence ?? "persisted"
	}, e.notifySubscribers ?? !0);
}
function Qi(e, t) {
	if (!e) return !1;
	let n = e.profileRelays ?? [], r = t.profileRelays ?? [];
	return e.name === t.name && e.displayName === t.displayName && e.picture === t.picture && e.npub === t.npub && e.nprofile === t.nprofile && n.length === r.length && n.every((e, t) => e === r[t]);
}
function $i(e, t) {
	return x(Q)[e]?.profile ?? t.find((e) => e.existingSnapshot)?.existingSnapshot ?? null;
}
function ea(e, t) {
	let n = x(Q)[e];
	if (n?.profile) return n.profile;
	let r = Ji(t, $());
	return Zi({
		pubkey: e,
		profile: t,
		metadataRaw: null,
		sourceEventCreatedAtSec: t.updatedAtFromEvent ?? null,
		sourceEventId: null,
		sourceRelay: null,
		fetchedAtMs: r
	}), x(Q)[e]?.profile ?? t;
}
function ta(e, t, n) {
	let r = t.acceptedProfile;
	if (!r) return null;
	let i = x(Q)[e], a = t.acceptedRecord, o = !!n.sourceEventId && n.sourceEventId === a?.sourceEventId, s = t.currentEventConfirmed || o, c = a?.fetchedAt ?? Ji(r, $()), l = {
		...r,
		fetchedAt: r.fetchedAt ?? c,
		updatedAtFromEvent: a?.updatedAtFromEvent ?? r.updatedAtFromEvent
	};
	return Zi({
		pubkey: e,
		profile: l,
		metadataRaw: s ? n.metadataRaw : null,
		sourceEventCreatedAtSec: a?.updatedAtFromEvent ?? r.updatedAtFromEvent ?? null,
		sourceEventId: a?.sourceEventId ?? (s ? n.sourceEventId : null),
		sourceRelay: s ? n.sourceRelay : null,
		fetchedAtMs: c,
		persistence: "persisted",
		notifySubscribers: !Qi(i?.profile ?? null, l)
	}), x(Q)[e]?.profile ?? r;
}
async function na(e) {
	let t = x(Q)[e];
	if (t?.persistence !== "temporary" || !t.profile || !t.sourceEventId || t.sourceEventCreatedAtSec === null) return {
		profile: t?.profile ?? null,
		acceptedRecord: null,
		persistence: t?.persistence ?? null,
		dbError: !1
	};
	try {
		let n = Hi([...t.profile.profileRelays ?? [], ...t.sourceRelay ? [t.sourceRelay] : []]), r = await In.upsertCandidate(e, {
			pubkeyHex: e,
			profile: t.profile,
			sourceEventId: t.sourceEventId,
			updatedAtFromEvent: t.sourceEventCreatedAtSec,
			observedRelays: n,
			fetchedAt: t.fetchedAtMs
		});
		return r.acceptedProfile && r.acceptedRecord ? {
			profile: ta(e, r, t),
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
function ra(e, t) {
	let n = B.sanitizeExternalRelayUrls([...t.profile?.profileRelays ?? [], ...t.observedRelays]), r = {
		...t.profile,
		profileRelays: n.length > 0 ? n : void 0
	};
	return Zi({
		pubkey: e,
		profile: r,
		metadataRaw: t.metadataRaw,
		sourceEventCreatedAtSec: t.sourceEventCreatedAtSec,
		sourceEventId: t.sourceEventId,
		sourceRelay: t.sourceRelay,
		persistence: "temporary"
	}), x(Q)[e]?.profile ?? r;
}
function ia(e, t, n = !0) {
	let r = x(Q)[e];
	if (!r) return;
	let i = $();
	Yi(e, {
		...r,
		status: t,
		lastValidatedAtMs: i
	}, n);
}
function aa() {
	let e = $(), t = Object.entries(x(Q)).filter(([, t]) => !Gi(t, e));
	t.length !== Object.keys(x(Q)).length && k(Q, Object.fromEntries(t));
}
function oa(e) {
	try {
		let t = JSON.parse(e.content), n = e.relay ? [e.relay.endsWith("/") ? e.relay : `${e.relay}/`] : [], r = typeof t.picture == "string" ? t.picture : "", i = r ? ce(r, {
			forceRemote: !1,
			navigatorOnline: !0
		}) : "", a = {
			name: typeof t.name == "string" ? t.name : "",
			displayName: typeof t.display_name == "string" ? t.display_name : "",
			picture: i,
			npub: ke(e.pubkey),
			nprofile: Ae(e.pubkey, n, e.writeRelays),
			profileRelays: n.length > 0 ? n : void 0
		};
		return a.fetchedAt = $(), a.updatedAtFromEvent = e.createdAtSec, a;
	} catch {
		return null;
	}
}
async function sa(e, t, n, r, i, a, o = []) {
	let s = Array.from(new Set(t.filter((e) => !!e))), c = {};
	for (let e of s) c[e] = {
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
	return s.length === 0 || o.length > 0 && o.every((e) => e.aborted) || await new Promise((t) => {
		let l = Pe(), u = !1, d = null, f = null, p = () => {
			u || (u = !0, clearTimeout(m), o.forEach((e) => e.removeEventListener("abort", h)), d?.unsubscribe(), f?.unsubscribe(), t());
		}, m = setTimeout(() => {
			for (let e of s) c[e] = {
				...c[e],
				timedOut: !0
			};
			p();
		}, Math.max(1, i)), h = () => {
			o.every((e) => e.aborted) && p();
		};
		o.forEach((e) => e.addEventListener("abort", h));
		let g = () => {
			for (let e of s) c[e] = {
				...c[e],
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
			let n = t <= zi() + ki;
			if (!n) {
				let t = e.event?.pubkey;
				t && c[t] && (c[t] = {
					...c[t],
					rejectedFutureTimestamp: !0
				});
			}
			return n;
		};
		try {
			f = e.createConnectionStateObservable?.().subscribe({ next: v }) ?? null;
			let t = e.use(l, { on: { relays: n } });
			d = (typeof t.pipe == "function" ? t.pipe(ct(y)) : t).subscribe({
				next: (e) => {
					if (!y(e)) return;
					let t = e.event;
					if (!t || t.kind !== 0 || !t.pubkey || !s.includes(t.pubkey)) return;
					let n = c[t.pubkey];
					if (typeof t.created_at != "number" || typeof t.id != "string") return;
					let i = typeof e.from == "string" ? e.from : null;
					if (n.sourceEventCreatedAtSec === t.created_at && n.sourceEventId === t.id) {
						c[t.pubkey] = {
							...n,
							observedRelays: i ? [...n.observedRelays, i] : n.observedRelays
						};
						return;
					}
					if (n.sourceEventCreatedAtSec !== null && (t.created_at < n.sourceEventCreatedAtSec || t.created_at === n.sourceEventCreatedAtSec && n.sourceEventId !== null && t.id > n.sourceEventId)) return;
					let a = oa({
						pubkey: t.pubkey,
						content: t.content ?? "",
						createdAtSec: t.created_at,
						relay: i,
						writeRelays: r[t.pubkey] ?? []
					});
					a ? c[t.pubkey] = {
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
					} : c[t.pubkey] = {
						...n,
						parseError: !0
					};
				},
				complete: () => {
					clearTimeout(m), p();
				},
				error: () => {
					g(), clearTimeout(m), p();
				}
			}), l.emit({
				kinds: [0],
				authors: s,
				until: zi() + ki,
				limit: Math.max(24, s.length * 4)
			}), l.over(), a?.(s);
		} catch {
			g(), clearTimeout(m), p();
		}
	}), c;
}
async function ca(e, t, n) {
	if (t.profile && t.sourceEventId !== null && t.sourceEventCreatedAtSec !== null) try {
		let r = await In.upsertCandidate(e, {
			pubkeyHex: e,
			profile: t.profile,
			sourceEventId: t.sourceEventId,
			updatedAtFromEvent: t.sourceEventCreatedAtSec,
			observedRelays: t.observedRelays,
			fetchedAt: Ji(t.profile, $())
		});
		if (!n.some(Li)) return {
			profile: null,
			stopReason: "persistence-unavailable",
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: !0
		};
		let i = ta(e, r, t);
		return {
			profile: i,
			stopReason: r.currentEventConfirmed && i !== null ? "current-event-confirmed" : null,
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: t.networkError || t.timedOut
		};
	} catch {
		let r = $i(e, n);
		return {
			profile: r ? ea(e, r) : ra(e, t),
			stopReason: "persistence-unavailable",
			parseError: !1,
			rejectedFutureTimestamp: !1,
			networkError: !1,
			transientFailure: t.networkError || t.timedOut
		};
	}
	return {
		profile: $i(e, n),
		stopReason: null,
		parseError: t.parseError,
		rejectedFutureTimestamp: t.rejectedFutureTimestamp,
		networkError: t.networkError,
		transientFailure: t.networkError || t.timedOut
	};
}
async function la() {
	let e = Pi.filter((e) => Li(e) ? !0 : (e.resolve(null), !1));
	if (Pi = [], Fi = null, e.length === 0) return;
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.rxNostr) ?? [];
		e.push(n), t.set(n.rxNostr, e);
	}
	for (let e of t.values()) {
		let t = /* @__PURE__ */ new Map(), n = {}, r = {}, i = {};
		for (let a of e) {
			let e = t.get(a.pubkey) ?? [];
			e.push(a), t.set(a.pubkey, e), r[a.pubkey] = Vi([...r[a.pubkey] ?? [], ...a.relays]), i[a.pubkey] = Hi([...i[a.pubkey] ?? [], ...a.fallbackRelays]);
			let o = /* @__PURE__ */ new Set([...n[a.pubkey] ?? [], ...a.writeRelays]);
			n[a.pubkey] = Array.from(o);
		}
		let a = (e) => (t.get(e) ?? []).some(Li), o = Array.from(t.keys()), s = Object.fromEntries(o.map((e) => {
			let t = yi({
				contextualRelays: r[e] ?? [],
				fallbackRelays: i[e] ?? [],
				contextualRelayLimit: Ei
			}), a = /* @__PURE__ */ new Set([...t.bootstrap, ...n[e] ?? []]);
			return t.contextual = t.contextual.filter((e) => !a.has(e)), t.fallback = t.fallback.filter((e) => !a.has(e)), [e, t];
		})), c = yi({
			contextualRelays: [],
			contextualRelayLimit: Ei
		}), l = new Set(o), u = {}, d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = [
			"bootstrap",
			"contextual",
			"fallback"
		], g = (e, t) => e === "bootstrap" ? bi(t, Object.fromEntries(t.map((e) => [e, B.sanitizeExternalRelayUrls([...c.bootstrap, ...n[e] ?? []])]))) : bi(t, Object.fromEntries(t.map((t) => [t, s[t][e]])));
		try {
			for (let r of h) {
				let i = await Wi(Ui(g(r, Array.from(l).filter(a))), Oi, async (r) => {
					let i = r.pubkeys.filter((e) => a(e) && l.has(e));
					return i.length === 0 ? null : {
						activeTargets: i,
						results: await sa(e[0].rxNostr, i, r.relays, n, Ti, (e) => {
							for (let t of e) m.add(t);
						}, i.flatMap((e) => (t.get(e) ?? []).flatMap((e) => e.signal ? [e.signal] : [])))
					};
				});
				for (let e of i) if (e) for (let n of e.activeTargets) {
					if (!a(n)) {
						l.delete(n);
						continue;
					}
					let r = t.get(n) ?? [], i = await ca(n, e.results[n], r);
					u[n] = i.profile, i.parseError && d.add(n), i.rejectedFutureTimestamp && f.add(n), i.transientFailure && p.add(n), i.stopReason !== null && l.delete(n);
				}
			}
			for (let e of l) {
				if (!a(e)) continue;
				let n = $i(e, t.get(e) ?? []);
				d.has(e) ? ia(e, "parse-error") : f.has(e) ? ia(e, "invalid-future-ts") : !n && m.has(e) && !p.has(e) && Xi(e), u[e] = n ? ea(e, n) : null;
			}
			for (let [e, n] of t.entries()) for (let t of n) t.resolve(Li(t) ? u[e] ?? null : null);
		} catch {
			for (let [e, n] of t.entries()) {
				let t = $i(e, n);
				for (let r of n) r.resolve(Li(r) && t ? ea(e, t) : null);
			}
		}
	}
}
function ua(e, t, n, r, i, a, o) {
	return o?.aborted ? Promise.resolve(null) : new Promise((s, c) => {
		let l = () => {
			Pi = Pi.filter((e) => e.signal !== o), !Pi.length && Fi && (clearTimeout(Fi), Fi = null), s(null);
		};
		o?.addEventListener("abort", l, { once: !0 }), Pi.push({
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
		}), !Fi && (Fi = setTimeout(() => {
			la();
		}, wi));
	});
}
async function da(e, t, n = void 0) {
	if (t.signal?.aborted || !e || !t.rxNostr) return null;
	let r = ji.get(e)?.signal?.aborted;
	r && Mi.delete(e);
	let i = r ? void 0 : Ai.get(e);
	if (i) {
		let n = ji.get(e);
		if (n && t.rxNostr === n.rxNostr) {
			let r = new Set(Hi(n.writeRelays ?? []));
			if (Hi(t.writeRelays ?? []).filter((e) => !r.has(e)).length > 0) {
				let n = Mi.get(e) ?? {};
				Mi.set(e, {
					rxNostr: t.rxNostr,
					forceRefresh: !0,
					allowBackgroundRefresh: t.allowBackgroundRefresh,
					writeRelays: Vi([...n.writeRelays ?? [], ...t.writeRelays ?? []]),
					additionalRelays: Vi([...n.additionalRelays ?? [], ...t.additionalRelays ?? []]),
					fallbackRelays: Vi([...n.fallbackRelays ?? [], ...t.fallbackRelays ?? []])
				});
			}
		}
		return i;
	}
	let a = (async () => {
		let r = n;
		if (r === void 0) try {
			r = await In.get(e);
		} catch {
			r = null;
		}
		if (t.signal?.aborted) return null;
		let i = await na(e);
		if (t.signal?.aborted) return null;
		let a = i.profile ?? x(Q)[e]?.profile ?? r, o = Vi([...t.additionalRelays ?? [], ...a?.profileRelays ?? []]);
		return ua(e, t.rxNostr, o, Hi(t.fallbackRelays ?? []), Hi(t.writeRelays ?? []), a, t.signal);
	})().finally(() => {
		if (Ai.get(e) !== a) return;
		Ai.delete(e), ji.delete(e);
		let n = Mi.get(e);
		if (Mi.delete(e), aa(), !t.signal?.aborted && n?.rxNostr && (n.writeRelays?.length ?? 0) > 0) {
			let r = da(e, {
				...n,
				signal: t.signal
			}), i = Ii.get(e);
			i && i.abort.signal === t.signal && (i.followup = r);
		}
	});
	return ji.set(e, t), Ai.set(e, a), a;
}
async function fa(e, t, n) {
	if (t.signal?.aborted) return null;
	let r = $(), i = x(Q)[e];
	if (!t.forceRefresh && i && !Gi(i, r)) {
		if (qi(i, r)) return null;
		if (i.profile && i.persistence === "temporary") return t.allowBackgroundRefresh !== !1 && t.rxNostr && (Ri(e, t, n ? i.profile : void 0), ia(e, "stale", !1)), i.profile;
		if (i.profile && !Ki(i, r)) return i.profile;
		if (i.profile) return t.allowBackgroundRefresh !== !1 && t.rxNostr && (Ri(e, t, n ? i.profile : void 0), ia(e, "stale")), i.profile;
	}
	if (!t.forceRefresh && !n) {
		let n = await In.get(e);
		if (t.signal?.aborted) return null;
		if (n) {
			let i = Ji(n, r);
			Zi({
				pubkey: e,
				profile: n,
				metadataRaw: null,
				sourceEventCreatedAtSec: n.updatedAtFromEvent ?? null,
				sourceRelay: null,
				fetchedAtMs: i
			});
			let a = x(Q)[e];
			return a && Ki(a, r) && t.allowBackgroundRefresh !== !1 && t.rxNostr && (Ri(e, t, n), ia(e, "stale")), n;
		}
	}
	return t.rxNostr ? await Ri(e, t, n ? x(Q)[e]?.profile ?? null : void 0) : null;
}
async function pa(e, t = {}) {
	return fa(e, t, !1);
}
async function ma(e) {
	return e ? fa(e, { allowBackgroundRefresh: !1 }, !1) : null;
}
async function ha(e, t = {}) {
	if (t.signal?.aborted) return {};
	let n = Array.from(new Set(e.filter((e) => !!e)));
	if (n.length === 0) return {};
	if (!t.forceRefresh) {
		let e = $(), r = n.filter((t) => {
			let n = x(Q)[t];
			return !n || Gi(n, e);
		});
		if (r.length > 0) try {
			let n = await In.bulkGetRecords(r);
			if (t.signal?.aborted) return {};
			n.forEach((t, n) => {
				if (!t) return;
				let i = On(t);
				Zi({
					pubkey: r[n],
					profile: i,
					metadataRaw: null,
					sourceEventCreatedAtSec: i.updatedAtFromEvent ?? null,
					sourceEventId: t.sourceEventId ?? null,
					sourceRelay: null,
					fetchedAtMs: Ji(i, e)
				});
			});
		} catch {}
	}
	let r = await Promise.all(n.map(async (e) => {
		let n = t.relayOptionsByPubkey?.[e];
		return [e, await fa(e, {
			rxNostr: t.rxNostr,
			additionalRelays: Vi([...n?.additionalRelays ?? [], ...t.additionalRelays ?? []]),
			fallbackRelays: Vi([...n?.fallbackRelays ?? [], ...t.fallbackRelays ?? []]),
			writeRelays: Vi([...n?.writeRelays ?? [], ...t.writeRelays ?? []]),
			forceRefresh: t.forceRefresh,
			allowBackgroundRefresh: t.allowBackgroundRefresh
		}, !t.forceRefresh)];
	}));
	return Object.fromEntries(r);
}
async function ga(e) {
	return ha(e, { allowBackgroundRefresh: !1 });
}
function _a(e, t) {
	let n = Ni.get(e) ?? /* @__PURE__ */ new Set();
	n.add(t), Ni.set(e, n);
	let r = x(Q)[e];
	return r && t(r.profile), () => {
		let n = Ni.get(e);
		n && (n.delete(t), n.size === 0 && Ni.delete(e));
	};
}
function va(e) {
	return x(Q)[e] ?? null;
}
function ya(e, t) {
	let n = Array.from(new Set(e.filter((e) => !!e))).map((e) => _a(e, (n) => t(e, n)));
	return () => {
		for (let e of n) e();
	};
}
var ba = {
	getProfile: pa,
	getProfiles: ha,
	getCachedProfile: ma,
	getCachedProfiles: ga,
	getReactiveEntry: va,
	subscribe: _a,
	subscribeProfiles: ya
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/channelMetadataEventOrder.ts
function xa(e, t) {
	return e.createdAt === t.createdAt ? e.eventId === t.eventId ? 0 : e.eventId < t.eventId ? 1 : -1 : e.createdAt > t.createdAt ? 1 : -1;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/channelContextService.ts
function Sa(e, t) {
	let n = !!t && B.extractReadRelays(t).length > 0, r = B.sanitizeExternalRelayUrls(B.mergeRelayConfigs(e, ...n || Te() ? [] : [z]), { limit: 8 });
	return {
		defaultReadRelays: n,
		...r.length > 0 ? { relays: r } : {}
	};
}
function Ca(e) {
	if (e == null || typeof e != "string") return;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function wa(e, t) {
	return e === void 0 ? t === void 0 ? null : t : e;
}
function Ta(e) {
	return {
		eventId: e.channelEventId,
		relayHints: [...e.relayHints],
		...e.channelRelays?.length ? { channelRelays: [...e.channelRelays] } : {},
		name: e.name,
		about: e.about,
		picture: e.picture
	};
}
function Ea(e, t) {
	return !t || xa({
		createdAt: e.created_at,
		eventId: e.id
	}, {
		createdAt: t.created_at,
		eventId: t.id
	}) > 0;
}
var Da = class {
	console;
	setTimeoutFn;
	clearTimeoutFn;
	createRxBackwardReqFn;
	constructor(e = {}) {
		this.console = e.console || (typeof console < "u" ? console : {
			log: () => {},
			warn: () => {},
			error: () => {}
		}), this.setTimeoutFn = e.setTimeoutFn || ((e, t) => setTimeout(e, t)), this.clearTimeoutFn = e.clearTimeoutFn || ((e) => clearTimeout(e)), this.createRxBackwardReqFn = e.createRxBackwardReqFn || Pe;
	}
	async resolveChannelContext(e, t, n) {
		let r = B.sanitizeExternalRelayUrls(e.relayHints, { limit: B.EXTERNAL_INPUT_RELAY_LIMIT }), i = {
			...e,
			relayHints: r
		}, a = await this.resolveChannelMetadata(i, t, n);
		if (a.status === "resolved") return Ta(a.metadata);
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
		let a = await this.fetchEventById(e, t, n, r, 5e3, i.signal);
		if (a.status === "aborted") return { status: "aborted" };
		if (a.status === "not-found") return {
			status: "failed",
			reason: "root-not-found"
		};
		if (a.status === "timeout") return {
			status: "failed",
			reason: "timeout"
		};
		if (a.status === "request-error") return {
			status: "failed",
			reason: "request-error",
			...a.cause === void 0 ? {} : { cause: a.cause }
		};
		if (a.event.kind !== 40) return {
			status: "failed",
			reason: "wrong-kind"
		};
		let o = a.event, s = this.parseChannelMetadataContent(o.content), c = s.metadata, l = B.sanitizeExternalRelayUrls(B.mergeRelayConfigs(a.relayUrl ? [a.relayUrl] : [], t, c.relays), { limit: 8 }), u = await this.fetchLatestMetadataEvent(e, o.pubkey, l, n, r, 5e3, i.signal);
		if (u.status === "aborted") return { status: "aborted" };
		let d = u.status === "complete" ? "complete" : "incomplete", f = B.sanitizeExternalRelayUrls([...a.relayUrl ? [a.relayUrl] : [], ...u.relayUrls], { limit: 8 });
		if (!s.isValid && !u.event) return {
			status: "root-only",
			quality: "verified-root-only",
			reason: "invalid-root-content",
			metadataLookup: d,
			channelEventId: e,
			creatorPubkey: o.pubkey,
			createEventCreatedAt: o.created_at,
			verifiedSourceRelays: f
		};
		let p = u.metadata, m = B.sanitizeExternalRelayUrls(B.mergeRelayConfigs(p.relays, c.relays), { limit: 8 });
		return {
			status: "resolved",
			quality: "verified-metadata",
			metadataLookup: d,
			metadata: {
				channelEventId: e,
				relayHints: B.sanitizeExternalRelayUrls(B.mergeRelayConfigs(t, f), { limit: 8 }),
				...m.length > 0 ? { channelRelays: m } : {},
				name: wa(p.name, c.name),
				about: wa(p.about, c.about),
				picture: wa(p.picture, c.picture),
				creatorPubkey: o.pubkey,
				createEventCreatedAt: o.created_at,
				metadataEventId: u.event?.id ?? null,
				metadataCreatedAt: u.event?.created_at ?? null,
				verifiedSourceRelays: f
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
					name: Ca(n.name),
					about: Ca(n.about),
					picture: typeof n.picture == "string" ? kt(n.picture) ?? void 0 : void 0,
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
				l !== void 0 && (this.clearTimeoutFn(l), l = void 0), a?.removeEventListener("abort", f), c?.unsubscribe?.(), c = void 0;
			}, d = (e) => {
				s || (s = !0, u(), o(e));
			}, f = () => d({ status: "aborted" });
			if (a?.aborted) d({ status: "aborted" });
			else {
				a?.addEventListener("abort", f, { once: !0 }), l = this.setTimeoutFn(() => {
					this.console.warn("チャンネルイベント取得タイムアウト"), d({ status: "timeout" });
				}, i);
				try {
					let i = this.createRxBackwardReqFn();
					if (c = n.use(i, { on: Sa(t, r) }).subscribe({
						next: (t) => {
							t.event?.id === e && d({
								status: "found",
								event: t.event,
								relayUrl: typeof t.from == "string" ? t.from : null
							});
						},
						complete: () => d({ status: "not-found" }),
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
					i.emit({ ids: [e] }), i.over();
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
				u !== void 0 && (this.clearTimeoutFn(u), u = void 0), o?.removeEventListener("abort", g), l?.unsubscribe?.(), l = void 0;
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
				o?.addEventListener("abort", g, { once: !0 }), u = this.setTimeoutFn(() => {
					this.console.warn("チャンネル metadata 取得タイムアウト"), h("timeout");
				}, a);
				try {
					let a = this.createRxBackwardReqFn();
					if (l = r.use(a, { on: Sa(n, i) }).subscribe({
						next: (n) => {
							let r = n.event;
							if (!r || r.kind !== 41 || r.pubkey !== t || !r.tags.some((t) => t[0] === "e" && t[1] === e)) return;
							let i = this.parseChannelMetadataContent(r.content);
							i.isValid && (typeof n.from == "string" && p.add(n.from), Ea(r, d) && (d = r, f = i.metadata));
						},
						complete: () => h("complete"),
						error: (e) => {
							this.console.error("チャンネル metadata 取得エラー:", e), h("request-error", e);
						}
					}), c) {
						l?.unsubscribe?.(), l = void 0;
						return;
					}
					let o = {
						kinds: [41],
						authors: [t],
						"#e": [e]
					};
					a.emit(o), a.over();
				} catch (e) {
					this.console.error("チャンネル metadata リクエスト作成エラー:", e), h("request-error", e);
				}
			}
		});
	}
};
function Oa(e) {
	return typeof e == "number" && Number.isInteger(e) && e >= 2;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/channelMetadataRepository.ts
var ka = 864e5;
function Aa(e) {
	return Oa(e.schemaVersion) ? e.resolutionQuality : "legacy-seed";
}
function ja(e) {
	let t = e.lastResolutionAttemptAt === void 0 ? e.lastFetchFailedAt : void 0;
	return {
		channelEventId: e.channelEventId,
		name: e.name,
		about: e.about,
		picture: e.picture ? kt(e.picture) : null,
		relays: [...e.relays],
		relayHints: [...e.relayHints],
		creatorPubkey: e.creatorPubkey,
		createEventCreatedAt: e.createEventCreatedAt,
		metadataEventId: e.metadataEventId,
		metadataCreatedAt: e.metadataCreatedAt,
		resolutionQuality: Aa(e),
		verifiedRootAt: e.verifiedRootAt,
		verifiedMetadataAt: e.verifiedMetadataAt,
		lastResolutionAttemptAt: e.lastResolutionAttemptAt ?? t,
		lastResolutionAttemptStatus: e.lastResolutionAttemptStatus ?? (t === void 0 ? void 0 : "failed"),
		fetchedAt: e.fetchedAt,
		lastFetchFailedAt: e.lastFetchFailedAt
	};
}
function Ma(e, t) {
	return B.sanitizeExternalRelayUrls(e, { limit: t });
}
function Na(e, ...t) {
	return Ma(B.mergeRelayConfigs(...t), e);
}
function Pa(e, t) {
	if (!e || Aa(e) !== "verified-metadata") return !0;
	let n = e.metadataCreatedAt, r = t.metadataCreatedAt;
	return typeof r == "number" ? typeof n == "number" ? r === n ? t.metadataEventId ? !e.metadataEventId || xa({
		createdAt: r,
		eventId: t.metadataEventId
	}, {
		createdAt: n,
		eventId: e.metadataEventId
	}) >= 0 : !e.metadataEventId : r > n : !0 : typeof n != "number";
}
function Fa(e, t) {
	return !e || Aa(e) !== "verified-metadata" ? !1 : t.metadataEventId || e.metadataEventId ? t.metadataEventId === e.metadataEventId && t.metadataCreatedAt === e.metadataCreatedAt : !0;
}
function Ia(e, t, n) {
	let r = t ? Aa(t) : void 0, i = e.quality === "verified-metadata", a = i ? Pa(t, e) : !1, o = i ? Fa(t, e) : !1, s = r === "verified-metadata" && (!i || !a && !o), c = s || i ? "verified-metadata" : r === "legacy-seed" ? "legacy-seed" : "verified-root-only", l = r === "verified-root-only" || r === "verified-metadata", u = Ma(e.verifiedSourceRelays, 8), d = c === "legacy-seed" ? Na(8, t?.relayHints ?? [], u) : Na(8, l ? t?.relayHints ?? [] : [], u), f = i && (a || o), p = e.metadataLookup === "incomplete" || s;
	return {
		channelEventId: e.channelEventId,
		name: a && i ? e.name : t?.name ?? null,
		about: a && i ? e.about : t?.about ?? null,
		picture: a && i ? e.picture : t?.picture ?? null,
		relays: a && i ? Ma(e.relays, 8) : t?.relays ?? [],
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
var La = new class {
	db;
	now;
	constructor(e = X, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e) {
		if (!e) return null;
		let t = await this.db.channelMetadata.get(e);
		return t ? ja(t) : null;
	}
	async getMany(e) {
		let t = Array.from(new Set(e.filter(Boolean)));
		return t.length === 0 ? [] : (await this.db.channelMetadata.bulkGet(t)).filter((e) => !!e).map(ja);
	}
	async upsertResolvedChannel(e) {
		let t = !1, n = await this.db.transaction("rw", this.db.channelMetadata, async () => {
			let n = this.now(), r = await this.db.channelMetadata.get(e.channelEventId), i = Ia(e, r ?? void 0, n);
			return t = r?.name !== i.name || r?.about !== i.about, await this.db.channelMetadata.put(i), ja(i);
		});
		return t && ft(), n;
	}
	shouldRefresh(e, t = this.now()) {
		if (!e) return !0;
		let n = e.lastResolutionAttemptAt, r = e.lastResolutionAttemptStatus, i = typeof n == "number" && t - n < 9e5;
		return r === "failed" || r === "incomplete" || e.resolutionQuality !== "verified-metadata" ? !i : typeof e.verifiedMetadataAt != "number" || t - e.verifiedMetadataAt >= ka;
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
				...n && Aa(n) ? { resolutionQuality: Aa(n) } : {},
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
}(), Ra = console;
function za(e) {
	return B.sanitizeExternalRelayUrls(e, { limit: 8 });
}
function Ba(e) {
	return B.sanitizeExternalRelayUrls(e, { limit: 8 });
}
function Va(...e) {
	return za(B.mergeRelayConfigs(...e));
}
function Ha(...e) {
	return Ba(B.mergeRelayConfigs(...e));
}
function Ua(e) {
	let t = Ba(e.channelRelays);
	return {
		eventId: e.eventId,
		relayHints: za(e.relayHints),
		...t.length > 0 ? { channelRelays: t } : {},
		name: e.name ?? null,
		about: e.about ?? null,
		picture: e.picture ?? null
	};
}
function Wa(e, t) {
	if (!t) return e;
	let n = t.resolutionQuality === "verified-root-only" || t.resolutionQuality === "verified-metadata", r = t.resolutionQuality === "verified-metadata", i = r ? Ha(t.relays, e.channelRelays ?? []) : Ha(e.channelRelays ?? []);
	return {
		eventId: e.eventId,
		relayHints: Va(e.relayHints, ...n ? [t.relayHints] : [], ...r ? [t.relays] : []),
		...i.length > 0 ? { channelRelays: i } : {},
		name: r ? t.name : e.name ?? t.name,
		about: r ? t.about : e.about ?? t.about,
		picture: r ? t.picture : e.picture ?? t.picture
	};
}
function Ga(e) {
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
function Ka(e, t) {
	let n = new Set(t);
	return e.some((e) => !n.has(e));
}
function qa(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
function Ja(e, t, n) {
	return !!e && (e.lastResolutionAttemptStatus === "failed" || e.lastResolutionAttemptStatus === "incomplete") && Ka(t, n);
}
var Ya = new class {
	service;
	repository;
	logger;
	inFlightByRxNostr = /* @__PURE__ */ new WeakMap();
	lastAttemptHintsByRxNostr = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.service = e.service ?? new Da(), this.repository = e.repository ?? La, this.logger = e.logger ?? Ra;
	}
	resolveInternal(e, t, n) {
		let r = {
			...e,
			relayHints: za(e.relayHints),
			...e.channelRelays ? { channelRelays: Ba(e.channelRelays) } : {}
		}, i = Ua(r), a = {
			context: i,
			cache: null,
			source: "seed"
		}, o = !1, s = null, c = this.repository.get(r.eventId).then((e) => ({
			context: Wa(i, e),
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
				if (!(this.repository.shouldRefresh(e.cache) || Ja(e.cache, r.relayHints, a))) return {
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
						context: Wa(i, t.cache),
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
			let t = Va(i.relayHints, e.relayHints);
			qa(i.relayHints, t) || (i.relayHints = t, i.hintRevision += 1);
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
				o = await this.repository.upsertResolvedChannel(Ga(a));
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
		return e.hintRevision > t && Ka(e.relayHints, n);
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
function Xa(e) {
	return e === 1 || e === 42 || e === 1111;
}
function Za(e) {
	if (!Xa(e.event.kind) || !e.event.id) return null;
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
function Qa(e) {
	if (!Xa(e.child.kind)) return {
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
var $a = 4e3, eo = 8, to = 6e4;
function no(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (!n.event?.id || !n.event.pubkey) continue;
		let e = t.get(n.event.pubkey) ?? /* @__PURE__ */ new Set();
		e.add(n.event.id), t.set(n.event.pubkey, e);
	}
	return new Map(Array.from(t.entries()).map(([e, t]) => [e, Array.from(t)]));
}
function ro(e) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls).sort((e, t) => e.localeCompare(t))
	})).sort((e, t) => e.event.created_at === t.event.created_at ? e.event.id.localeCompare(t.event.id) : e.event.created_at - t.event.created_at);
}
var io = new class {
	console;
	setTimeoutFn;
	clearTimeoutFn;
	now;
	lastTimeoutWarnAt = 0;
	constructor(e = {}) {
		this.console = e.console ?? (typeof console < "u" ? console : {
			log: () => void 0,
			warn: () => void 0,
			error: () => void 0
		}), this.setTimeoutFn = e.setTimeoutFn ?? ((e, t) => setTimeout(e, t)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((e) => clearTimeout(e)), this.now = e.now ?? Date.now;
	}
	fetchDeletionRequests(e, t) {
		let n = no(t.targets), r = this.resolveRelayUrls(t), i = /* @__PURE__ */ new Map(), a = !1, o, s, c, l = () => {
			s !== void 0 && (this.clearTimeoutFn(s), s = void 0), o?.unsubscribe?.(), o = void 0;
		}, u = (e) => ({
			status: e,
			events: ro(i),
			fetchedAt: this.now(),
			relayUrls: r
		}), d = (e) => (t) => {
			a || (a = !0, l(), e(u(t)));
		};
		return {
			promise: new Promise((a) => {
				let l = d(a);
				if (c = l, n.size === 0) l("success");
				else try {
					let a = Pe();
					o = Qe(e, a, { on: r.length > 0 ? { relays: r } : { defaultReadRelays: !0 } }).subscribe({
						next: (e) => {
							this.handlePacket(i, e);
						},
						complete: () => l("success"),
						error: (e) => {
							this.console.error("post_history_deletion_fetch_error", e), l("error");
						}
					});
					for (let [e, t] of n.entries()) a.emit({
						kinds: [5],
						authors: [e],
						"#e": t
					});
					a.over(), s = this.setTimeoutFn(() => {
						this.warnDeletionFetchTimeout(), l("timeout");
					}, t.timeoutMs ?? $a);
				} catch (e) {
					this.console.error("post_history_deletion_fetch_request_error", e), l("error");
				}
			}),
			cancel: () => {
				c?.("cancelled");
			}
		};
	}
	warnDeletionFetchTimeout() {
		let e = this.now();
		e - this.lastTimeoutWarnAt < to || (this.lastTimeoutWarnAt = e, this.console.warn("post_history_deletion_fetch_timeout"));
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
		let t = e.targets.flatMap((e) => e.relayUrls ?? []), n = we([...t, ...e.relayHints ?? []], eo);
		if (n) return n;
		let r = e.relayConfig ? [...B.extractReadRelays(e.relayConfig), ...B.extractWriteRelays(e.relayConfig)] : [], i = B.sanitizeExternalRelayUrls([
			...t,
			...e.relayHints ?? [],
			...r
		], { limit: eo });
		return i.length > 0 ? i : B.sanitizeExternalRelayUrls(z, { limit: eo });
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryChildInteractionsAdapter.ts
function ao(e) {
	return e.sort((e, t) => e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) : e.createdAt - t.createdAt);
}
function oo(e, t, n) {
	let r = Array.from(new Set(t.filter((e) => !!e))), i = new Map(r.map((e) => [e, []]));
	for (let t of e) n(t) && i.get(t.parentEventId)?.push(t);
	return r.flatMap((e) => ao(i.get(e) ?? []));
}
var so = class {
	repository;
	constructor(e = ot) {
		this.repository = e;
	}
	async getReactionRecords(e, t) {
		return (await (t ? this.repository.getChildInteractions(e, t) : this.repository.getChildInteractions(e))).filter((e) => e.kind === 7);
	}
	async getReactionRecordsForParents(e, t) {
		let n = Array.from(new Set(e.filter((e) => !!e)));
		return oo(this.repository.getChildInteractionsForParents ? await (t ? this.repository.getChildInteractionsForParents(n, t) : this.repository.getChildInteractionsForParents(n)) : (await Promise.all(n.map((e) => this.getReactionRecords(e, t?.find((t) => t.eventId === e))))).flat(), n, (e) => e.kind === 7);
	}
}, co = class {
	repository;
	constructor(e = ot) {
		this.repository = e;
	}
	async getDirectReplyRecords(e) {
		return this.repository.getDirectReplyInteractions(e);
	}
	async getDirectReplyRecordsForParents(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return oo(this.repository.getChildInteractionsForParents ? await this.repository.getChildInteractionsForParents(t) : (await Promise.all(t.map((e) => this.getDirectReplyRecords(e)))).flat(), t, (e) => e.kind === 1 || e.kind === 42 || e.kind === 1111);
	}
}, lo = class {
	repository;
	constructor(e = ot) {
		this.repository = e;
	}
	async getRelatedEventRecords(e) {
		return this.repository.getChildInteractions(e);
	}
	async getDirectReplyRecords(e) {
		return this.repository.getDirectReplyInteractions(e);
	}
}, uo = new so(), fo = new co();
new lo();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryReactionDeletionCleanupService.ts
var po = {
	status: "completed",
	checkedParentEventIds: [],
	deletedReactionEventIds: [],
	deletionConfirmationIncomplete: !1
};
function mo(e) {
	return Array.from(new Set(e.filter((e) => !!e)));
}
function ho(e) {
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
function go(e, t) {
	return mo(e.filter((e) => t.get(e.targetEvent.pubkey)?.has(e.targetEvent.id)).map((e) => e.record.eventId));
}
var _o = new class {
	reactionRecordsAdapter;
	deletionFetchService;
	deletionRequestsRepository;
	childInteractionsRepository;
	constructor(e = {}) {
		this.reactionRecordsAdapter = e.reactionRecordsAdapter ?? uo, this.deletionFetchService = e.deletionFetchService ?? io, this.deletionRequestsRepository = e.deletionRequestsRepository ?? rn, this.childInteractionsRepository = e.childInteractionsRepository ?? ot;
	}
	async cleanupReactionDeletions(e, t) {
		let n = () => t.isActive?.() !== !1, r = mo(t.parentEventIds), i = mo(t.reactionEventIds ?? []);
		if (r.length === 0) return po;
		let a = await this.loadReactionItems(r, i);
		if (!n()) return {
			...po,
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
		let c = await this.filterKnownDeletedReactions(o.visibleItems), l = mo([...o.deletedReactionEventIds, ...c.deletedReactionEventIds]), u = s.status !== "success";
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
				targetEvent: ho(i)
			});
		}
		return n;
	}
	async filterKnownDeletedReactions(e) {
		if (e.length === 0) return {
			visibleItems: [],
			deletedReactionEventIds: []
		};
		let t = go(e, await this.deletionRequestsRepository.getDeletedTargets(e.map((e) => ({
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
		for (let t of mo(e)) await this.childInteractionsRepository.deleteChildInteractionByEventId(t);
	}
}(), vo = /* @__PURE__ */ new Set();
function yo(e) {
	return vo.has(e);
}
function bo(e) {
	for (let t of e) t && vo.add(t);
}
function xo(e) {
	for (let t of e) vo.delete(t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryReactionDeletionConsistencyService.ts
function So(e) {
	return Array.from(new Set(e.filter((e) => !!e)));
}
function Co(e) {
	return Array.from(new Set(e.filter((e) => !!e)));
}
function wo(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) n.set(r, new Map((t.get(r) ?? []).map((e) => [e.eventId, e])));
	return n;
}
function To(e, t) {
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
var Eo = new class {
	reactionRecordsAdapter;
	deletionRequestsRepository;
	childInteractionsRepository;
	constructor(e = {}) {
		this.reactionRecordsAdapter = e.reactionRecordsAdapter ?? uo, this.deletionRequestsRepository = e.deletionRequestsRepository ?? rn, this.childInteractionsRepository = e.childInteractionsRepository ?? ot;
	}
	async verifyConsistency(e) {
		let t = () => e.isActive?.() !== !1, n = Array.from(new Map(e.candidates.map((e) => [e.requestKey, e])).values());
		if (n.length === 0) return {
			deletedReactionEventIds: [],
			correctedRequestKeys: [],
			resolvedRequestKeys: [],
			statePatches: []
		};
		let r = So(n.map((e) => e.parentEventId)), i = /* @__PURE__ */ new Map();
		for (let e of r) i.set(e, await this.reactionRecordsAdapter.getReactionRecords(e));
		if (!t()) return {
			deletedReactionEventIds: [],
			correctedRequestKeys: [],
			resolvedRequestKeys: [],
			statePatches: []
		};
		let a = wo(r, i), o = await this.deletionRequestsRepository.getDeletedTargets(n.map((e) => ({
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
			let f = yo(t.requestKey);
			e.deletionConfirmationIncomplete !== !0 && (n.status !== "pending" && n.status !== "processing" || f) ? l.push(t.requestKey) : n.status !== "failed" && u.push(To(t, n));
		}
		return {
			deletedReactionEventIds: So(s),
			correctedRequestKeys: Co(c),
			resolvedRequestKeys: Co(l),
			statePatches: u
		};
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelationLifecycleTypes.ts
function Do(e, t, n) {
	return `${e}:${t}:${n}`;
}
function Oo(e, t, n) {
	let [r, i, a] = e.split(":"), o = Number.parseInt(a ?? "", 10);
	return !r || !i || o !== t ? null : {
		requestKey: e,
		parentEventId: r,
		targetEventId: i,
		kind: o,
		relationKind: n
	};
}
var ko = "reaction";
function Ao(e, t, n = 7) {
	return Do(e, t, n);
}
function jo(e) {
	let t = Oo(e, 7, ko);
	return t ? {
		requestKey: t.requestKey,
		parentEventId: t.parentEventId,
		reactionEventId: t.targetEventId,
		kind: 7
	} : null;
}
function Mo(e, t = Date.now()) {
	return e.status === "failed" && e.attemptCount < 3 && t - e.updatedAt >= 5e3;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelationLifecycleHelpers.ts
function No(e) {
	return Array.from(new Set(e.filter((e) => !!e)));
}
function Po(e) {
	return Array.from(new Set(e.map((e) => e.requestKey)));
}
function Fo(e) {
	return new Map(e.map((e) => [e.requestKey, e]));
}
function Io({ candidates: e, existingStateByRequestKey: t, hasInFlightRequest: n, isFailedState: r, canRetryFailedState: i }) {
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
async function Lo({ records: e, toCandidate: t, verifyConsistency: n, saveMany: r, deleteMany: i }) {
	if (e.length === 0) return e;
	let a = await n({
		candidates: e.map((e) => t(e)),
		statesByRequestKey: Fo(e)
	}), o = a.resolvedRequestKeys ?? [];
	if (a.statePatches.length === 0) {
		if (o.length === 0) return e;
		await i(o);
		let t = new Set(o);
		return e.filter((e) => !t.has(e.requestKey));
	}
	let s = await r(a.statePatches);
	o.length > 0 && await i(o);
	let c = Fo(s), l = new Set(o);
	return e.flatMap((e) => l.has(e.requestKey) ? [] : [c.get(e.requestKey) ?? e]);
}
function Ro(e) {
	return e === "dialog-inbound-save" || e === "dialog-inbound-sync" || e === "inbound-realtime" || e === "listing-current-view" || e === "listing-older-reveal" || e === "related-card-display" || e === "composer-target-display";
}
function zo(e) {
	return e === "pending" || e === "processing" || e === "success" || e === "failed";
}
function Bo(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.requestKey == "string" && typeof t.parentEventId == "string" && typeof t.reactionEventId == "string" && typeof t.reactionAuthorPubkey == "string" && t.kind === 7 && Ro(t.source) && zo(t.status) && typeof t.attemptCount == "number" && typeof t.schemaVersion == "number";
}
function Vo(e) {
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
function Ho(e) {
	return !e || !Bo(e.value) ? null : {
		...e.value,
		updatedAt: e.updatedAt
	};
}
function Uo(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.requestKey);
		(!e || e.updatedAt < n.updatedAt) && t.set(n.requestKey, n);
	}
	return Array.from(t.values()).sort((e, t) => e.updatedAt === t.updatedAt ? e.requestKey.localeCompare(t.requestKey) : e.updatedAt - t.updatedAt);
}
var Wo = new class {
	db;
	now;
	constructor(e = X, t = Date.now) {
		this.db = e, this.now = t;
	}
	async getMany(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return t.length === 0 ? [] : Uo((await this.db.postHistoryReactionDeletionAttempts.bulkGet(t)).map((e) => Ho(e)).filter((e) => !!e));
	}
	async getForParentEventIds(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return t.length === 0 ? [] : Uo((await this.db.postHistoryReactionDeletionAttempts.where("parentEventId").anyOf(t).toArray()).map((e) => Ho(e)).filter((e) => !!e));
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
			let t = Ho(e);
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
				} : Vo(e),
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
}(), Go = S({});
function Ko(e) {
	for (let [t, n] of Object.entries(e)) t && (n === void 0 ? delete Go[t] : Go[t] = n);
}
function qo() {
	for (let e of Object.keys(Go)) delete Go[e];
}
function Jo(e) {
	qo(), Ko(e);
}
var Yo = "reply";
function Xo(e, t, n = 1) {
	return Do(e, t, n);
}
function Zo(e) {
	let t = [
		1,
		42,
		1111
	].map((t) => Oo(e, t, Yo)).find((e) => e !== null) ?? null;
	return t ? {
		requestKey: t.requestKey,
		parentEventId: t.parentEventId,
		replyEventId: t.targetEventId,
		kind: t.kind
	} : null;
}
function Qo(e, t = Date.now()) {
	return e.status === "failed" && e.attemptCount < 3 && t - e.updatedAt >= 5e3;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDirectReplyLifecycleState.ts
var $o = /* @__PURE__ */ new Set();
function es(e) {
	return $o.has(e);
}
function ts(e) {
	for (let t of e) t && $o.add(t);
}
function ns(e) {
	for (let t of e) $o.delete(t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDirectReplyDeletionConsistencyService.ts
function rs(e) {
	return Array.from(new Set(e.filter((e) => !!e)));
}
function is(e) {
	return Array.from(new Set(e.filter((e) => !!e)));
}
function as(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) n.set(r, new Map((t.get(r) ?? []).map((e) => [e.eventId, e])));
	return n;
}
function os(e, t) {
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
var ss = new class {
	directReplyRecordsAdapter;
	deletionRequestsRepository;
	childInteractionsRepository;
	constructor(e = {}) {
		this.directReplyRecordsAdapter = e.directReplyRecordsAdapter ?? fo, this.deletionRequestsRepository = e.deletionRequestsRepository ?? rn, this.childInteractionsRepository = e.childInteractionsRepository ?? ot;
	}
	async verifyConsistency(e) {
		let t = () => e.isActive?.() !== !1, n = Array.from(new Map(e.candidates.map((e) => [e.requestKey, e])).values());
		if (n.length === 0) return {
			deletedReplyEventIds: [],
			correctedRequestKeys: [],
			resolvedRequestKeys: [],
			statePatches: []
		};
		let r = rs(n.map((e) => e.parentEventId)), i = /* @__PURE__ */ new Map();
		for (let e of r) i.set(e, await this.directReplyRecordsAdapter.getDirectReplyRecords(e));
		if (!t()) return {
			deletedReplyEventIds: [],
			correctedRequestKeys: [],
			resolvedRequestKeys: [],
			statePatches: []
		};
		let a = as(r, i), o = await this.deletionRequestsRepository.getDeletedTargets(n.map((e) => ({
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
			let f = es(t.requestKey);
			e.deletionConfirmationIncomplete !== !0 && (n.status !== "pending" && n.status !== "processing" || f) ? l.push(t.requestKey) : n.status !== "failed" && u.push(os(t, n));
		}
		return {
			deletedReplyEventIds: rs(s),
			correctedRequestKeys: is(c),
			resolvedRequestKeys: is(l),
			statePatches: u
		};
	}
}();
function cs(e) {
	return e === "dialog-inbound-save" || e === "dialog-inbound-sync" || e === "inbound-realtime" || e === "listing-current-view" || e === "listing-older-reveal";
}
function ls(e) {
	return e === "pending" || e === "processing" || e === "success" || e === "failed";
}
function us(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.requestKey == "string" && typeof t.parentEventId == "string" && typeof t.replyEventId == "string" && typeof t.replyAuthorPubkey == "string" && (t.kind === 1 || t.kind === 42 || t.kind === 1111) && cs(t.source) && ls(t.status) && typeof t.attemptCount == "number" && typeof t.schemaVersion == "number";
}
function ds(e) {
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
function fs(e) {
	return !e || !us(e.value) ? null : {
		...e.value,
		updatedAt: e.updatedAt
	};
}
function ps(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.requestKey);
		(!e || e.updatedAt < n.updatedAt) && t.set(n.requestKey, n);
	}
	return Array.from(t.values()).sort((e, t) => e.updatedAt === t.updatedAt ? e.requestKey.localeCompare(t.requestKey) : e.updatedAt - t.updatedAt);
}
var ms = new class {
	db;
	now;
	constructor(e = X, t = Date.now) {
		this.db = e, this.now = t;
	}
	async getMany(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return t.length === 0 ? [] : ps((await this.db.postHistoryReplyDeletionAttempts.bulkGet(t)).map((e) => fs(e)).filter((e) => !!e));
	}
	async getForParentEventIds(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return t.length === 0 ? [] : ps((await this.db.postHistoryReplyDeletionAttempts.where("parentEventId").anyOf(t).toArray()).map((e) => fs(e)).filter((e) => !!e));
	}
	async deleteMany(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		t.length !== 0 && await this.db.postHistoryReplyDeletionAttempts.bulkDelete(t);
	}
	async saveMany(e) {
		let t = Array.from(new Map(e.flatMap((e) => {
			let t = Zo(e.requestKey);
			return !t || t.parentEventId !== e.parentEventId || t.replyEventId !== e.replyEventId || e.kind !== void 0 && e.kind !== t.kind ? [] : [[e.requestKey, {
				...e,
				kind: t.kind
			}]];
		})).values());
		if (t.length === 0) return [];
		let n = await this.getMany(t.map((e) => e.requestKey)), r = new Map(n.map((e) => [e.requestKey, e])), i = this.now(), a = t.map((e) => {
			let t = r.get(e.requestKey);
			return t && t.kind !== e.kind ? null : {
				...t ?? ds(e),
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
		}))), ps(a.map((e) => ({
			...e,
			updatedAt: i
		}))));
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryPendingDeletionRequestsReconcile.ts
function hs(e) {
	return Object.fromEntries(e.map((e) => [e.reactionEventId, e.status === "success" ? void 0 : e.status]));
}
function gs(e) {
	let t = {};
	for (let n of e) {
		let e = jo(n);
		e && (t[e.reactionEventId] = void 0);
	}
	return t;
}
function _s(e) {
	return Object.fromEntries(e.map((e) => [e.replyEventId, e.status === "success" ? void 0 : e.status]));
}
function vs(e) {
	let t = {};
	for (let n of e) {
		let e = Zo(n);
		e && (t[e.replyEventId] = void 0);
	}
	return t;
}
async function ys(e, t, n) {
	return Lo({
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
async function bs(e, t, n) {
	return Lo({
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
async function xs(e, t = {}) {
	let n = t.reactionDeletionStateRepository ?? Wo, r = await ys(n, t.reactionDeletionConsistencyService ?? Eo, await n.getForParentEventIds(e)), i = t.directReplyDeletionStateRepository ?? ms, a = await bs(i, t.directReplyDeletionConsistencyService ?? ss, await i.getForParentEventIds(e));
	Jo({
		...hs(r),
		..._s(a)
	});
}
async function Ss(e, t = {}) {
	let n = t.reactionDeletionStateRepository ?? Wo, r = await ys(n, t.reactionDeletionConsistencyService ?? Eo, await n.getMany(e)), i = t.directReplyDeletionStateRepository ?? ms, a = await bs(i, t.directReplyDeletionConsistencyService ?? ss, await i.getMany(e));
	Ko({
		...gs(e),
		...hs(r),
		...vs(e),
		..._s(a)
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryReactionLifecycleTrigger.ts
function Cs(e) {
	return No(e);
}
async function ws(e, t) {
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
			requestKey: Ao(i, t.eventId),
			parentEventId: i,
			reactionEventId: t.eventId,
			reactionAuthorPubkey: t.authorPubkey,
			kind: 7
		});
	}
	return Array.from(new Map(n.map((e) => [e.requestKey, e])).values());
}
async function Ts(e, t, n, r) {
	return n.length === 0 ? [] : e.saveMany(n.map((e) => ({
		...r(e),
		requestKey: e.requestKey,
		parentEventId: e.parentEventId,
		reactionEventId: e.reactionEventId,
		reactionAuthorPubkey: e.reactionAuthorPubkey,
		source: t
	})));
}
async function Es(e) {
	let t = uo, n = Wo, r = Cs(e.parentEventIds);
	if (r.length === 0) return {
		source: e.source,
		status: "completed",
		checkedParentEventIds: r,
		deletedReactionEventIds: [],
		deletionConfirmationIncomplete: !1
	};
	let i = await ws(r, t), a = Fo(await n.getMany(Po(i))), { skippedCandidates: o, admittedCandidates: s } = Io({
		candidates: i,
		existingStateByRequestKey: a,
		hasInFlightRequest: yo,
		isFailedState: (e) => e.status === "failed",
		canRetryFailedState: Mo
	});
	if (!e.rxNostr || s.length === 0) return await Ss(Po(i)).catch(() => void 0), {
		source: e.source,
		status: "completed",
		checkedParentEventIds: r,
		deletedReactionEventIds: [],
		deletionConfirmationIncomplete: !1
	};
	let c = Po(s);
	bo(c);
	try {
		let t = await Ts(n, e.source, s, (e) => ({
			status: "pending",
			attemptCount: (a.get(e.requestKey)?.attemptCount ?? 0) + 1
		}));
		await Ss(c).catch(() => void 0);
		let r = new Map(t.map((e) => [e.requestKey, e])), i = await Ts(n, e.source, s, () => ({ status: "processing" }));
		await Ss(c).catch(() => void 0);
		let o = new Map([...r.values(), ...i].map((e) => [e.requestKey, e])), l = await _o.cleanupReactionDeletions(e.rxNostr, {
			parentEventIds: Array.from(new Set(s.map((e) => e.parentEventId))),
			reactionEventIds: s.map((e) => e.reactionEventId),
			relayConfig: e.relayConfig,
			isActive: e.isActive
		});
		if (l.status === "cancelled") return await Ts(n, e.source, s, () => ({ status: "failed" })), {
			source: e.source,
			...l
		};
		let u = await Eo.verifyConsistency({
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
		return await Ts(n, e.source, s, () => ({ status: "failed" })).catch(() => void 0), {
			source: e.source,
			status: "partial",
			checkedParentEventIds: Array.from(new Set(s.map((e) => e.parentEventId))),
			deletedReactionEventIds: [],
			deletionConfirmationIncomplete: !0
		};
	} finally {
		xo(c), await Ss([...c, ...Po(o)]).catch(() => void 0);
	}
}
var Ds = 1e3, Os = 7776e6;
function ks(e) {
	return Number.isSafeInteger(e) && e > 0;
}
function As(e) {
	return { ...e };
}
function js(e) {
	return Array.from(new Set(e.filter(Et)));
}
var Ms = new class {
	db;
	now;
	maxRecords;
	ttlMs;
	constructor(e = X, t = Date.now, n = Ds, r = Os) {
		this.db = e, this.now = t, this.maxRecords = n, this.ttlMs = r;
	}
	async get(e) {
		if (!Et(e)) return null;
		let t = await this.db.customEmojiImageMeta.get(e);
		return t ? As(t) : null;
	}
	async getMany(e) {
		let t = js(e);
		if (t.length === 0) return {};
		let n = await this.db.customEmojiImageMeta.bulkGet(t), r = {};
		return n.forEach((e) => {
			e && (r[e.url] = As(e));
		}), r;
	}
	async upsert(e) {
		if (!Et(e.url) || !ks(e.width) || !ks(e.height)) return null;
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
		}), As(r);
	}
	async touchMany(e, t = this.now()) {
		let n = js(e);
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
function Ns({ getShow: e, getSessionOpen: t = e, getEmojiUrls: n, onStateChanged: r = () => void 0 }) {
	let i = w(S({})), a = w(S({})), o = 0, s = new AbortController(), c = /* @__PURE__ */ new Set();
	function l(e) {
		let t = {};
		for (let n of e) {
			if (c.has(n)) {
				t[n] = "loading";
				continue;
			}
			let e = x(i)[n];
			(e === "ready" || e === "failed") && (t[n] = e);
		}
		let n = e.filter((e) => !t[e]);
		for (let e of n) c.add(e), t[e] = "loading";
		return g(x(i), t) || k(i, t, !0), n;
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
		let t = !1, n = { ...x(a) };
		for (let [r, i] of Object.entries(e)) {
			let e = n[r];
			(e?.width !== i.width || e?.height !== i.height || e?.aspectRatio !== i.aspectRatio) && (n[r] = i, t = !0);
		}
		t && k(a, n, !0);
	}
	async function p(t) {
		if (t.length === 0) return;
		let n = o;
		try {
			let r = await Ms.getMany(t);
			if (!e() || n !== o) return;
			let i = Object.keys(r);
			if (i.length === 0) return;
			f(Object.fromEntries(i.map((e) => [e, u(r[e])]))), Ms.touchMany(i);
		} catch {}
	}
	async function m(e) {
		try {
			await Ms.upsert(e);
		} catch {}
	}
	async function h(t) {
		let r = o, a = await Dt(t, { signal: s.signal });
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
		x(i)[t] !== l && k(i, {
			...x(i),
			[t]: l
		}, !0);
	}
	function g(e, t) {
		let n = Object.keys(e), r = Object.keys(t);
		return n.length === r.length && n.every((n) => e[n] === t[n]);
	}
	function _() {
		o++, s.abort(), s = new AbortController(), c.clear(), k(i, Object.fromEntries(Object.entries(x(i)).filter(([, e]) => e !== "loading")), !0);
	}
	function v() {
		o++, s.abort(), s = new AbortController(), k(i, {}, !0), c.clear();
	}
	return M(() => {
		e() && p(n());
	}), M(() => {
		if (!e()) return;
		let t = l(n());
		for (let e of t) h(e);
	}), M(() => {
		e() && (x(i), x(a), r());
	}), M(() => {
		t() || A(v);
	}), P(() => s.abort()), {
		suspend: _,
		get emojiLoadStateByUrl() {
			return x(i);
		},
		get emojiImageMetaByUrl() {
			return x(a);
		},
		resetState: v
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/sensitiveContentPayloadReader.ts
async function Ps(e, t) {
	return (await X.postHistory.get(e.id))?.deletedAt !== void 0 || (await X.postHistoryDeletionRequests.where("targetEventId").anyOf([e.id, t]).toArray()).some((t) => {
		let n = t.rawEvent;
		return qe(n) && n.pubkey === e.pubkey && Ie(n, {
			id: t.targetEventId,
			pubkey: e.pubkey
		});
	});
}
async function Fs(e) {
	let { structure: t } = e;
	if (e.signal?.aborted || !qe(t)) return null;
	let n = Ve(t);
	if (!n) return null;
	let r = (await lt.getByIds([n.eventId]))[0];
	if (r?.deletedAt !== void 0 || await Ps(t, n.eventId)) return null;
	if (r) {
		let i = r.rawEvent;
		if (Be(t, i, n.eventId)) return e.signal?.aborted ? null : i;
	}
	if (!e.rxNostr || e.signal?.aborted) return null;
	let i = await Je(X, t.pubkey), a = {
		ownerPubkeyHex: t.pubkey,
		expectedRevision: i,
		isActive: () => !e.signal?.aborted
	}, o = B.sanitizeExternalRelayUrls([
		...n.relayHint ? [n.relayHint] : [],
		...e.relayHints ?? [],
		...r?.acceptedRelays ?? [],
		...r?.fetchedRelays ?? []
	]), s = vi.fetchEventById(e.rxNostr, {
		eventId: n.eventId,
		relayHints: o,
		relayConfig: e.relayConfig
	}), c = () => s.cancel();
	e.signal?.addEventListener("abort", c, { once: !0 });
	let l = await s.promise.finally(() => e.signal?.removeEventListener("abort", c));
	if (e.signal?.aborted || !l.event || !Be(t, l.event, n.eventId)) return null;
	let u = B.sanitizeExternalRelayUrls(l.relayUrl ? [l.relayUrl] : [], { limit: 1 });
	try {
		await lt.putCandidate({
			event: l.event,
			fetchedRelays: u,
			relayHints: u,
			localWriteScope: a
		}), an.archiveAdoptedAuthored([{ event: t }], a);
	} catch {}
	let [d] = await lt.getByIds([n.eventId]);
	return e.signal?.aborted || d?.deletedAt !== void 0 || await Ps(t, n.eventId) ? null : l.event;
}
async function Is(e) {
	return (await Fs(e))?.content ?? null;
}
function Ls(e) {
	if (!e.structure || !Ve(e.structure)) return;
	let t = e.structure, n = Ve(t), r = (t) => Is({
		structure: e.structure,
		relayHints: e.relayHints,
		rxNostr: e.rxNostr,
		relayConfig: e.relayConfig,
		signal: t
	});
	return r.scope = {
		runtime: e.rxNostr,
		ownerPubkey: e.ownerPubkey
	}, r.loadEmoji = Dt, r.observe = (e) => {
		let r = mt(async () => {
			let e = await X.sensitivePayloads.get(n.eventId);
			return e?.deletedAt !== void 0 || await Ps(t, n.eventId) ? "deleted" : e ? Be(t, e.rawEvent, n.eventId) ? "available" : "invalid" : "missing";
		}).subscribe({
			next: e,
			error: () => e("invalid")
		});
		return () => r.unsubscribe();
	}, r;
}
export { Pt as $, ui as A, lr as B, Za as C, ba as D, La as E, ci as F, Kn as G, Yn as H, Qr as I, Sn as J, In as K, Zr as L, hi as M, pi as N, vi as O, fi as P, rn as Q, qn as R, io as S, Ya as T, Xn as U, Zn as V, Jn as W, gn as X, yn as Y, an as Z, No as _, xs as a, Mt as at, fo as b, ss as c, ns as d, Ft as et, Xo as f, Fo as g, qo as h, Es as i, Wt as it, di as j, mi as k, ts as l, Go as m, Fs as n, It as nt, Ss as o, jt as ot, Qo as p, Cn as q, Ns as r, Lt as rt, ms as s, Nt as st, Ls as t, Rt as tt, es as u, Io as v, Qa as w, uo as x, Po as y, Gn as z };
