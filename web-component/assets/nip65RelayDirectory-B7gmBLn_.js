import { m as e, p as t } from "./esm-N9TTQGcl.js";
import { n, r, t as i } from "./relayConfigUtils-56ujWwKF.js";
import { n as a } from "./postHistoryEventUtils-iuP8QpIA.js";
import { n as o } from "./ehagakiDb-DuXS0XPm.js";
import { n as s } from "./operation-BO0VLD7w.js";
import { P as c, Z as l, i as u, l as d, ot as f, rt as p, tt as m } from "./postHistoryRepository-Bu2z041i.js";
import { i as h, r as g } from "./hostRelayRuntime-SryW0auD.js";
import { i as _, n as v } from "./query-CUABraKG.js";
function y(e) {
	if (e.kind !== 36) return !1;
	let t = e.tags.filter((e) => e[0] === "k");
	return t.length === 1 && t[0].length >= 2 && c.some((e) => t[0][1] === String(e));
}
var b = new class {
	db;
	now;
	constructor(e = o, t = Date.now) {
		this.db = e, this.now = t;
	}
	async putCandidate(e) {
		let t = f(e.event, e.attestation) ? a(e.event) : p(e.event)?.event;
		if (!t || !y(t)) throw Error("invalid_sensitive_payload_candidate");
		await this.db.transaction("rw", [
			this.db.events,
			this.db.sensitivePayloads,
			...e.localWriteScope ? [this.db.postHistoryWriteGeneration] : []
		], async () => {
			await l(this.db, e.localWriteScope);
			let r = await m(this.db, "sensitivePayloads").get(t.id);
			if (r?.deletedAt !== void 0) return !1;
			let i = {
				id: t.id,
				pubkeyHex: t.pubkey,
				structureKind: Number(t.tags.find((e) => e[0] === "k")[1]),
				rawEvent: t,
				rawEventVerification: {
					status: "valid",
					ruleVersion: 1
				},
				acceptedRelays: n.sanitizeExternalRelayUrls([...r?.acceptedRelays ?? [], ...e.acceptedRelays ?? []]),
				fetchedRelays: n.sanitizeExternalRelayUrls([...r?.fetchedRelays ?? [], ...e.fetchedRelays ?? []]),
				relayHints: n.sanitizeExternalRelayUrls([
					...r?.relayHints ?? [],
					...e.relayHints ?? [],
					...e.acceptedRelays ?? [],
					...e.fetchedRelays ?? []
				]),
				createdAt: r?.createdAt ?? this.now(),
				updatedAt: this.now(),
				schemaVersion: 1
			};
			return await m(this.db, "sensitivePayloads").put(i), await l(this.db, e.localWriteScope), !0;
		}) && (d(t.pubkey), await u(t.id, this.db, this.now));
	}
	async getByIds(t) {
		let n = [...new Set(t.filter((t) => e(t)))];
		if (n.length === 0) return [];
		let r = await this.db.sensitivePayloads.where("id").anyOf(n).toArray().then((e) => m(this.db, "sensitivePayloads").hydrate(e)), i = new Set(r.map((e) => e.id)), a = n.filter((e) => !i.has(e)), o = a.length ? await this.db.events.bulkGet(a) : [];
		for (let e of o) e && y(e.rawEvent) && r.push({
			id: e.id,
			pubkeyHex: e.rawEvent.pubkey,
			structureKind: Number(e.rawEvent.tags.find((e) => e[0] === "k")[1]),
			rawEvent: e.rawEvent,
			rawEventVerification: e.verification,
			acceptedRelays: [],
			fetchedRelays: e.relayUrls,
			relayHints: e.relayUrls,
			createdAt: e.receivedAt,
			updatedAt: e.lastSeenAt,
			schemaVersion: 1,
			deletedAt: e.deletedAt,
			deletionEventId: e.deletionEventId
		});
		return r;
	}
	async getAllForPubkey(e) {
		return this.db.sensitivePayloads.where("pubkeyHex").equals(e).toArray().then((e) => m(this.db, "sensitivePayloads").hydrate(e));
	}
	async markDeleted(e) {
		let t = await m(this.db, "sensitivePayloads").get(e.id);
		t && t.pubkeyHex === e.pubkeyHex && (await m(this.db, "sensitivePayloads").put({
			...t,
			deletedAt: e.deletedAt,
			deletionEventId: e.deletionEventId,
			updatedAt: this.now()
		}), d(t.pubkeyHex));
	}
	async deleteCandidatesForPubkey(e) {
		await this.db.sensitivePayloads.where("pubkeyHex").equals(e).delete() > 0 && d(e);
	}
}(), x = 3e3, S = 3e5, C = 15e3, w = 4;
function T(e, n) {
	if (!e || typeof e != "object") return !1;
	let r = e;
	return r.kind === 10002 && r.pubkey === n && t(r.id) && typeof r.created_at == "number" && Number.isSafeInteger(r.created_at) && r.created_at >= 0 && Array.isArray(r.tags);
}
function E(e, t) {
	return {
		pubkey: e,
		status: t,
		readRelays: [],
		writeRelays: [],
		createdAt: null,
		eventId: null
	};
}
function D(e) {
	return {
		...e,
		readRelays: [...e.readRelays],
		writeRelays: [...e.writeRelays]
	};
}
function O(e) {
	let t = i.parseKind10002Tags(e.tags), r = n.sanitizeExternalRelayUrls(n.extractReadRelays(t)), a = n.sanitizeExternalRelayUrls(n.extractWriteRelays(t));
	return {
		pubkey: e.pubkey,
		status: r.length || a.length ? "found" : "empty",
		readRelays: r,
		writeRelays: a,
		createdAt: e.created_at,
		eventId: e.id
	};
}
var k = class {
	rxNostr;
	now;
	setTimeoutFn;
	clearTimeoutFn;
	cache = /* @__PURE__ */ new Map();
	inFlight = /* @__PURE__ */ new Map();
	queue = [];
	activeLookups = 0;
	constructor(e, t = Date.now, n = (e, t) => setTimeout(e, t), r = (e) => clearTimeout(e)) {
		this.rxNostr = e, this.now = t, this.setTimeoutFn = n, this.clearTimeoutFn = r;
	}
	lookup(e, t = {}) {
		let i = n.sanitizeExternalRelayUrls(h() ? g() : r), a = n.sanitizeExternalRelayUrls([...i, ...t.discoveryRelays ?? []]), o = this.cache.get(e), s = !!o && o.expiresAt > this.now(), c = this.inFlight.get(e);
		if (c && !c.done) {
			let n = /* @__PURE__ */ new Set([
				...s ? o.searchedSources : [],
				...c.coveredSources,
				...c.pendingSources
			]);
			return a.filter((e) => !n.has(e)).forEach((e) => c.pendingSources.add(e)), this.launchPendingSources(e, c), this.forConsumer(e, c, t);
		}
		if (s) {
			let n = a.filter((e) => !o.searchedSources.has(e));
			if (n.length === 0) return Promise.resolve(t.deadlineAt !== void 0 && o.receivedAt >= t.deadlineAt ? E(e, "network-error") : D(o.entry));
			let r = this.startLookup(e, n, o);
			return this.forConsumer(e, r, t);
		}
		let l = n.sanitizeExternalRelayUrls([...a, ...o ? [...o.searchedSources] : []]), u = this.startLookup(e, l, o);
		return this.forConsumer(e, u, t);
	}
	startLookup(e, t, n) {
		let r, i = new Promise((e) => {
			r = e;
		}), a = {
			promise: i,
			pendingSources: new Set(t),
			coveredSources: /* @__PURE__ */ new Set(),
			searchedSources: new Set(n?.searchedSources ?? []),
			candidates: /* @__PURE__ */ new Map(),
			candidateListeners: /* @__PURE__ */ new Set(),
			previous: n?.entry.createdAt == null ? void 0 : {
				entry: D(n.entry),
				receivedAt: n.receivedAt
			},
			started: !1,
			activeBatches: 0,
			hadNetworkError: t.length === 0,
			completedAt: void 0,
			finish: () => {
				if (a.done) return;
				a.done = !0, a.completedAt = this.now();
				let t = this.snapshot(e, a);
				this.cache.set(e, {
					entry: D(t),
					receivedAt: t.eventId === a.previous?.entry.eventId ? a.previous.receivedAt : a.candidates.get(t.eventId)?.receivedAt ?? this.now(),
					expiresAt: this.now() + (t.status === "found" ? S : C),
					searchedSources: new Set(a.searchedSources)
				}), r(t);
			},
			done: !1
		};
		return this.inFlight.set(e, a), a.promise = this.withConcurrencySlot(async () => (a.started = !0, this.launchPendingSources(e, a), i)).finally(() => {
			this.inFlight.get(e) === a && this.inFlight.delete(e);
		}), a;
	}
	launchPendingSources(e, t) {
		if (!t.started || t.done) return;
		let n = [...t.pendingSources];
		t.pendingSources.clear(), n.length === 0 ? t.activeBatches === 0 && t.finish() : (n.forEach((e) => {
			t.coveredSources.add(e), t.searchedSources.add(e);
		}), t.activeBatches += 1, this.fetchLatest(e, n, (e, n) => {
			t.candidates.has(e.eventId) || (t.candidates.set(e.eventId, {
				entry: e,
				receivedAt: n
			}), t.candidateListeners.forEach((e) => e()));
		}).then((n) => {
			t.hadNetworkError ||= n.status === "network-error", --t.activeBatches, this.launchPendingSources(e, t);
		}));
	}
	snapshot(e, t, n = Infinity) {
		let r = t.previous && t.previous.receivedAt < n ? t.previous.entry : void 0;
		for (let { entry: e, receivedAt: i } of t.candidates.values()) i < n && this.isNewer(e, r) && (r = e);
		if (r) return D(r);
		let i = t.completedAt !== void 0 && t.completedAt < n;
		return E(e, t.hadNetworkError || !i ? "network-error" : "not-found");
	}
	forConsumer(e, t, n) {
		let r = n.deadlineAt ?? Infinity;
		return n.deadlineAt === void 0 && !n.resolveOnReadRoute ? t.promise : r <= this.now() ? Promise.resolve(this.snapshot(e, t, r)) : new Promise((i) => {
			let a = !1, o, c = {}, l, u = () => {
				a || (a = !0, l?.(), n.operation ? o?.unschedule(c) : o?.finish(), t.candidateListeners.delete(d), i(this.snapshot(e, t, r)));
			}, d = () => {
				let n = this.snapshot(e, t, r);
				if (n.readRelays.length === 0) return;
				let i = this.cache.get(e), a = i !== void 0 && i.expiresAt > this.now() && i.entry.eventId === n.eventId, o = n.eventId === null ? void 0 : t.candidates.get(n.eventId), s = o !== void 0 && o.receivedAt < r;
				(a || s) && u();
			};
			n.resolveOnReadRoute && (t.candidateListeners.add(d), d()), !a && Number.isFinite(r) && (o = n.operation ?? new s(r - this.now(), u, {
				now: this.now,
				setTimeoutFn: this.setTimeoutFn,
				clearTimeoutFn: this.clearTimeoutFn
			}), n.operation && (o.schedule(c, r, u), l = o.add(u))), t.promise.then(u);
		});
	}
	isNewer(e, t) {
		return !t || t.createdAt === null || t.eventId === null ? !0 : e.createdAt === null || e.eventId === null ? !1 : e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) < 0 : e.createdAt > t.createdAt;
	}
	async withConcurrencySlot(e) {
		this.activeLookups >= w ? await new Promise((e) => this.queue.push(e)) : this.activeLookups += 1;
		try {
			return await e();
		} finally {
			let e = this.queue.shift();
			e ? e() : --this.activeLookups;
		}
	}
	fetchLatest(e, t, n) {
		return t.length === 0 ? Promise.resolve(E(e, "network-error")) : new Promise((r) => {
			let i = _(), a, o, s = !1, c, l = () => {
				o?.unsubscribe?.(), o = void 0;
			}, u = (t = !1) => {
				s || (s = !0, l(), r(a || E(e, t ? "network-error" : "not-found")));
			};
			try {
				let r = v(this.rxNostr, i, { on: { relays: t } }, {
					timeoutMs: x,
					now: this.now,
					setTimeoutFn: this.setTimeoutFn,
					clearTimeoutFn: this.clearTimeoutFn,
					onEnd: (e) => {
						c = e;
					}
				}).subscribe({
					next: (t) => {
						if (s || !T(t.event, e)) return;
						let r = this.now(), i = O(t.event);
						n(i, r), this.isNewer(i, a) && (a = i);
					},
					complete: () => u(c !== void 0 && !c.complete && !a),
					error: () => u(!0)
				});
				if (s) {
					r.unsubscribe?.();
					return;
				}
				o = r, i.emit({
					authors: [e],
					kinds: [10002],
					until: Math.floor(this.now() / 1e3),
					limit: 1
				}), i.over();
			} catch {
				u(!0);
			}
		});
	}
}, A = /* @__PURE__ */ new WeakMap();
function j(e) {
	let t = A.get(e);
	return t || (t = new k(e), A.set(e, t)), t;
}
export { b as n, j as t };
