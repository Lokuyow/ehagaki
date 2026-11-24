import { c as e, p as t, s as n } from "./esm-N9TTQGcl.js";
import { n as r } from "./relayConfigUtils-56ujWwKF.js";
import { a as i, d as a, i as o, n as s, o as c, s as l, t as u } from "./postHistoryEventUtils-iuP8QpIA.js";
import { a as d, c as f, d as p, f as m, i as h, n as g, p as _, s as v } from "./ehagakiDb-DuXS0XPm.js";
import { o as ee } from "./tslib.es6-BgJxuhU8.js";
import { _ as y, l as b } from "./operation-BO0VLD7w.js";
import { d as te, f as x } from "./ehagakiDbUpgradeState-tA-618gW.js";
import { t as ne } from "./localRelayUrl-t7UxBsyT.js";
import { r as S } from "./postMediaCacheUtils-DIeR2W7v.js";
import { n as re } from "./httpUrlCandidates-BckQw1dk.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/lift.js
function ie(e) {
	return y(e?.lift);
}
function ae(e) {
	return function(t) {
		if (ie(t)) return t.lift(function(t) {
			try {
				return e(t, this);
			} catch (e) {
				this.error(e);
			}
		});
		throw TypeError("Unable to lift unknown Observable type");
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js
function oe(e, t, n, r, i) {
	return new se(e, t, n, r, i);
}
var se = function(e) {
	ee(t, e);
	function t(t, n, r, i, a, o) {
		var s = e.call(this, t) || this;
		return s.onFinalize = a, s.shouldUnsubscribe = o, s._next = n ? function(e) {
			try {
				n(e);
			} catch (e) {
				t.error(e);
			}
		} : e.prototype._next, s._error = i ? function(e) {
			try {
				i(e);
			} catch (e) {
				t.error(e);
			} finally {
				this.unsubscribe();
			}
		} : e.prototype._error, s._complete = r ? function() {
			try {
				r();
			} catch (e) {
				t.error(e);
			} finally {
				this.unsubscribe();
			}
		} : e.prototype._complete, s;
	}
	return t.prototype.unsubscribe = function() {
		var t;
		if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
			var n = this.closed;
			e.prototype.unsubscribe.call(this), n || (t = this.onFinalize) == null || t.call(this);
		}
	}, t;
}(b);
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/map.js
function ce(e, t) {
	return ae(function(n, r) {
		var i = 0;
		n.subscribe(oe(r, function(n) {
			r.next(e.call(t, n, i++));
		}));
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/filter.js
function le(e, t) {
	return ae(function(n, r) {
		var i = 0;
		n.subscribe(oe(r, function(n) {
			return e.call(t, n, i++) && r.next(n);
		}));
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryJsonlWorkerVerification.ts
var ue = 1e4;
function de(e) {
	let t, n, r = /* @__PURE__ */ new Set(), i = null, a = !1, o, s, c = new Promise((e, t) => {
		o = e, s = t;
	});
	c.catch(() => void 0);
	let l;
	function u(o, c) {
		if (!i) {
			i = o, a = !1, clearTimeout(l), s(o);
			for (let e of r) e(o);
			r.clear(), t?.removeEventListener("message", f), t?.removeEventListener("message", p), t?.removeEventListener("error", m), t?.removeEventListener("messageerror", m), n ? n.dispose() : t?.terminate(), c && e.onFatal?.(o);
		}
	}
	function d() {
		if (i) throw i;
		if (!a || n?.status !== "active") throw Error("post_history_import_worker_unavailable");
	}
	function f(e) {
		i || e.data !== "pong" && typeof e.data?.error == "string" && u(/* @__PURE__ */ Error("post_history_import_worker_host_failed"), !0);
	}
	function p(e) {
		e.data === "pong" && queueMicrotask(() => {
			i || (n?.status === "active" ? (a = !0, clearTimeout(l), o()) : u(/* @__PURE__ */ Error("post_history_import_worker_unavailable"), !0));
		});
	}
	function m() {
		u(/* @__PURE__ */ Error("post_history_import_worker_failed"), !0);
	}
	try {
		t = e.workerFactory?.() ?? new Worker(new URL(
			/* @vite-ignore */
			new URL("postHistoryJsonlVerificationWorker-DtPOQndm.js", import.meta.url).href,
			"" + import.meta.url
		), { type: "module" }), n = v({
			worker: t,
			timeout: ue,
			fallback: async () => {
				throw Error("post_history_import_worker_unavailable");
			}
		}), t.addEventListener("message", f), i || t.addEventListener("error", m), i || t.addEventListener("messageerror", m);
	} catch {
		let e = /* @__PURE__ */ Error("post_history_import_worker_failed");
		throw u(e, !1), e;
	}
	return {
		ready: c,
		assertActive: d,
		start() {
			if (!i) {
				l = setTimeout(() => u(/* @__PURE__ */ Error("post_history_import_worker_readiness_timeout"), !0), ue);
				try {
					n.start(), i || t.addEventListener("message", p);
				} catch {
					m();
				}
			}
		},
		async verify(e) {
			await c, d();
			let t = await new Promise((t, a) => {
				let o = (e, n) => {
					clearTimeout(c), r.delete(s), e ? a(e) : t(n);
				}, s = (e) => o(e), c = setTimeout(() => u(/* @__PURE__ */ Error("post_history_import_worker_verification_timeout"), !0), ue);
				r.add(s);
				try {
					Promise.resolve(n.verifier(e)).then((e) => o(i ?? void 0, e), () => u(/* @__PURE__ */ Error("post_history_import_worker_verification_failed"), !0));
				} catch {
					u(/* @__PURE__ */ Error("post_history_import_worker_verification_failed"), !0);
				}
			});
			return d(), t;
		},
		dispose() {
			u(/* @__PURE__ */ Error("post_history_import_worker_disposed"), !1);
		}
	};
}
function fe(e = {}) {
	let t = [], n = /* @__PURE__ */ new Set(), r = null, i = !1, a = 0, o, s, c = new Promise((e, t) => {
		o = e, s = t;
	});
	c.catch(() => void 0);
	function l(a, o) {
		if (!r) {
			r = a, i = !1, s(a);
			for (let e of n) e(a);
			n.clear(), e.signal?.removeEventListener("abort", d);
			for (let e of t) e.dispose();
			o && e.onFatal?.(a);
		}
	}
	function u() {
		if (r) throw r;
		if (!i) throw Error("post_history_import_worker_unavailable");
		for (let e of t) e.assertActive();
	}
	function d() {
		l(new DOMException("Import aborted", "AbortError"), !1);
	}
	let f = (e) => l(e, !0);
	e.signal?.addEventListener("abort", d, { once: !0 }), e.signal?.aborted && d();
	try {
		for (let n = 0; n < (e.workerCount ?? 4) && !r; n++) {
			let n = de({
				workerFactory: e.workerFactory,
				onFatal: f
			});
			t.push(n), r ? n.dispose() : n.start();
		}
	} catch {
		f(/* @__PURE__ */ Error("post_history_import_worker_failed"));
	}
	return Promise.all(t.map((e) => e.ready)).then(() => {
		r || (i = !0, o());
	}, f), {
		ready: c,
		assertActive: u,
		async verify(e) {
			await c, u();
			let i = t[a];
			a = (a + 1) % t.length;
			let o = await new Promise((t, a) => {
				let o = (e) => {
					n.delete(o), a(e);
				};
				n.add(o), i.verify(e).then((e) => {
					n.delete(o), r ? a(r) : t(e);
				}, (e) => {
					n.delete(o), r || f(/* @__PURE__ */ Error("post_history_import_worker_verification_failed")), a(r ?? e);
				});
			});
			return u(), o;
		},
		dispose() {
			l(/* @__PURE__ */ Error("post_history_import_worker_disposed"), !1);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRawEventVerification.ts
function pe(e = {}) {
	let t = fe(e);
	return {
		ready: t.ready,
		async verify(e) {
			let n = null;
			try {
				l(e) && (n = s(e));
			} catch {}
			if (await t.ready, t.assertActive(), !n) return null;
			let r = await t.verify(n);
			return t.assertActive(), r ? be(n, "full") : null;
		},
		dispose: t.dispose
	};
}
var C = /* @__PURE__ */ new WeakMap(), w = /* @__PURE__ */ new WeakMap(), me = /* @__PURE__ */ new WeakMap(), he = /* @__PURE__ */ new WeakMap(), ge = /* @__PURE__ */ new WeakMap();
function _e(e, t = 1024, n = 64) {
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = null, o = 0;
	return {
		verify: async (c) => {
			if (!a || c.pubkey !== a.owner || !a.kinds.includes(c.kind)) return e(c);
			if (!l(c)) return !1;
			let u = s(c), d = T(u);
			if (!d) return !1;
			let f = `1:${d}`, p = o, m;
			if (r.has(f)) r.delete(f), r.set(f, !0), m = !0;
			else {
				let s = i.get(f);
				s || (s = Promise.resolve().then(() => e(u)), i.size < n && i.set(f, s));
				try {
					m = await s;
				} finally {
					i.get(f) === s && i.delete(f);
				}
				if (m && o === p && a) for (r.delete(f), r.set(f, !0); r.size > t;) r.delete(r.keys().next().value);
			}
			return m && T(c) === d;
		},
		acquire(e, t) {
			if (a) throw Error("A post-history scan is already using this verifier");
			return a = {
				owner: e,
				kinds: [...t]
			}, o += 1, () => {
				a = null, o += 1, r.clear(), i.clear();
			};
		}
	};
}
function ve(e, t) {
	ge.set(e, t);
}
function ye(e, t, n) {
	return ge.get(e)?.acquire(t, n) ?? (() => void 0);
}
function T(e) {
	if (!n(e)) return null;
	try {
		let t = f(e);
		return t === e.id ? `${t}\u0000${e.id}\u0000${e.sig}` : null;
	} catch {
		return null;
	}
}
function be(e, t) {
	let n = s(e), r = T(n);
	if (!r) return null;
	let i = {};
	return C.set(i, {
		fingerprint: r,
		ruleVersion: 1,
		evidence: t
	}), w.set(n, i), {
		event: n,
		attestation: i
	};
}
function E(t) {
	try {
		if (!l(t)) return null;
		let n = s(t), r = T(n);
		if (!r) return null;
		let i = w.get(t), a = i && C.get(i);
		if ((a?.evidence !== "full" || a.ruleVersion !== 1 || a.fingerprint !== r) && me.get(t) !== r) {
			if (!e(n)) return null;
			me.set(t, r);
		}
		let o = {};
		return C.set(o, {
			fingerprint: r,
			ruleVersion: 1,
			evidence: "full"
		}), w.set(n, o), {
			event: n,
			attestation: o
		};
	} catch {
		return null;
	}
}
function xe(e, t) {
	let n = t ?? (typeof e == "object" && e ? w.get(e) : void 0);
	if (!n || typeof n != "object") return !1;
	let r = C.get(n);
	return !r || r.ruleVersion !== 1 ? !1 : T(e) === r.fingerprint;
}
function Se(e) {
	return { use(t, n) {
		return e.use(t, n).pipe(ce((e) => {
			let t = e.event;
			if (!t) return null;
			let n = be(t, "rx-nostr-signature");
			return n ? {
				...e,
				...n
			} : null;
		}), le((e) => e !== null));
	} };
}
function Ce(e) {
	let t = Se(e);
	return he.set(e, t), t;
}
function we(e, t, n) {
	return (he.get(e) ?? Se(e)).use(t, n);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/eventRepository.ts
var Te = (e) => r.sanitizeExternalRelayUrls(e);
async function D(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = n.get(e.event.id);
		n.set(e.event.id, {
			...t,
			...e,
			relayUrls: [...t?.relayUrls ?? [], ...e.relayUrls ?? []]
		});
	}
	let r = await e.events.bulkGet([...n.keys()]), i = [...n.values()].map((e, t) => {
		let n = r[t], i = n && c(n.rawEvent, e.event) ? n.rawEvent : e.event, a = e.receivedAt ?? Date.now();
		return {
			id: i.id,
			rawEvent: i,
			verification: e.verification ?? {
				status: "valid",
				ruleVersion: 1
			},
			relayUrls: Te([...n?.relayUrls ?? [], ...e.relayUrls ?? []]),
			receivedAt: Math.min(n?.receivedAt ?? a, a),
			lastSeenAt: Math.max(n?.lastSeenAt ?? a, a),
			relatedEventIds: [.../* @__PURE__ */ new Set([
				...n?.relatedEventIds ?? [],
				...e.relatedEventIds ?? [],
				...i.tags.flatMap((e) => [
					"e",
					"q",
					"c"
				].includes(e[0]) && /^[0-9a-f]{64}$/.test(e[1] ?? "") ? [e[1]] : [])
			])],
			deletedAt: n?.deletedAt ?? e.deletedAt,
			deletionEventId: n?.deletionEventId ?? e.deletionEventId
		};
	});
	i.length && await e.events.bulkPut(i);
}
async function Ee(e, t, n) {
	let r = t, i = r.flatMap((e) => [m(e, n), e.repostTarget?.eventId].filter(Boolean)), a = new Map((await e.events.bulkGet([...new Set(i)])).flatMap((e) => e ? [[e.id, e]] : []));
	return r.map((e) => {
		let t = a.get(m(e, n));
		if (!t) return e;
		let r = t.rawEvent, i = a.get(e.repostTarget?.eventId);
		return {
			...e,
			...n === "notifications" ? {
				event: r,
				relayUrls: t.relayUrls
			} : {
				rawEvent: r,
				...n === "postHistoryChildInteractions" ? {} : { rawEventVerification: t.verification },
				...n === "postHistory" || n === "postHistoryChildInteractions" ? {
					content: r.content,
					tags: r.tags
				} : {},
				...n === "postHistory" || n === "sensitivePayloads" ? { fetchedRelays: t.relayUrls } : { relayUrls: t.relayUrls }
			},
			...i ? { repostTarget: {
				rawEvent: i.rawEvent,
				rawEventVerification: i.verification,
				relayHints: e.repostTarget.relayHints
			} } : e.repostTarget?.eventId ? { repostTarget: void 0 } : {},
			...t.deletedAt === void 0 ? {} : {
				deletedAt: t.deletedAt,
				deletionEventId: t.deletionEventId
			}
		};
	});
}
function O(e, t) {
	let n = e[t], r = (n) => Ee(e, n, t), i = async (r) => {
		let i = r.map((e) => _(e, t));
		return e.transaction("rw", e.events, n, async () => (await D(e, i.flatMap((e) => e.items)), n.bulkPut(i.map((e) => e.metadata))));
	}, a = async (e) => {
		let t = await n.get(e);
		return t ? (await r([t]))[0] : void 0;
	};
	return {
		hydrate: r,
		get: a,
		bulkGet: async (e) => {
			let t = await n.bulkGet(e), i = await r(t.filter((e) => !!e)), a = 0;
			return t.map((e) => e ? i[a++] : void 0);
		},
		put: async (r) => {
			let i = _(r, t);
			return e.transaction("rw", e.events, n, async () => (await D(e, i.items), n.put(i.metadata)));
		},
		bulkPut: i,
		update: async (t, r) => e.transaction("rw", e.events, n, async () => {
			let e = await a(t);
			return e ? (await i([{
				...e,
				...r
			}]), 1) : 0;
		})
	};
}
var De = class {
	db;
	constructor(e) {
		this.db = e;
	}
	async get(e) {
		return this.verifyStored(await this.db.events.get(e));
	}
	async getMany(e) {
		return (await this.db.events.bulkGet(e)).flatMap((e) => {
			let t = this.verifyStored(e);
			return t ? [t] : [];
		});
	}
	verifyStored(e) {
		if (!e || e.deletedAt !== void 0) return e;
		let t = E(e.rawEvent);
		return t ? {
			...e,
			rawEvent: t.event
		} : void 0;
	}
	async save(e, t, n, r) {
		let i = E(e);
		i && n() && await this.db.transaction("rw", this.db.events, async (a) => {
			n() && (await D(this.db, [{
				event: i.event,
				relayUrls: t
			}]), r && await this.link(r, e.id, n), n() || a.abort());
		});
	}
	async link(e, t, n) {
		await this.db.transaction("rw", this.db.events, async (r) => {
			if (!n()) return;
			let i = await this.db.events.get(e);
			i && !i.relatedEventIds.includes(t) && await this.db.events.update(e, { relatedEventIds: [...i.relatedEventIds, t] }), n() || r.abort();
		});
	}
};
async function Oe(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of p) {
		let r = await e[n].toArray();
		for (let e of r) t.add(m(e, n)), e.repostTarget?.eventId && t.add(e.repostTarget.eventId);
	}
	let n = await e.events.toArray(), r = new Map(n.map((e) => [e.id, e])), i = [...t];
	for (; i.length;) {
		let e = r.get(i.pop());
		for (let n of [...e?.relatedEventIds ?? [], ...e?.deletionEventId ? [e.deletionEventId] : []]) t.has(n) || (t.add(n), i.push(n));
	}
	await e.events.bulkDelete(n.filter((e) => !t.has(e.id) && e.deletedAt === void 0).map((e) => e.id));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryLocalWriteScope.ts
var k = "global";
async function A(e, t) {
	if (!e.isOpen()) return 0;
	let n = (await e.postHistoryWriteGeneration.get(t))?.value;
	return typeof n == "number" && Number.isSafeInteger(n) ? n : 0;
}
async function ke(e, t) {
	return t.isActive() && await A(e, t.ownerPubkeyHex) === t.expectedRevision && t.isActive();
}
async function j(e, t) {
	if (t && !await ke(e, t)) throw new M();
}
async function Ae(e, t, n) {
	let r = await A(e, t);
	await e.postHistoryWriteGeneration.put({
		id: t,
		value: r + 1,
		updatedAt: n
	});
}
function je(e) {
	return typeof e == "number" && Number.isSafeInteger(e) && e >= 0 ? e : 0;
}
async function Me(e) {
	if (!e.isOpen()) return 0;
	let t = h.currentTransaction;
	if (!t || t.db !== e || !t.storeNames.includes("postHistoryChildWriteGeneration")) return Ne(e);
	let n = (await e.postHistoryChildWriteGeneration.get(k))?.value;
	return je(n);
}
function Ne(e) {
	let t = e.backendDB();
	return t.objectStoreNames.contains("postHistoryChildWriteGeneration") ? new Promise((e, n) => {
		let r = t.transaction("postHistoryChildWriteGeneration", "readonly").objectStore("postHistoryChildWriteGeneration").get(k);
		r.onsuccess = () => e(je(r.result?.value)), r.onerror = () => n(r.error ?? /* @__PURE__ */ Error("child write generation read failed"));
	}) : Promise.resolve(0);
}
async function Pe(e, t) {
	let n = h.currentTransaction;
	n?.db === e && n.storeNames.includes("postHistoryChildWriteGeneration") ? await Fe(e, t) : await e.transaction("rw", e.postHistoryChildWriteGeneration, async () => {
		await Fe(e, t);
	});
}
async function Fe(e, t) {
	let n = await Me(e);
	await e.postHistoryChildWriteGeneration.put({
		id: k,
		value: n + 1,
		updatedAt: t
	});
}
var M = class extends Error {
	constructor() {
		super("Post history operation is no longer active");
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelayCoverage.ts
function N(e) {
	let t = e.filter((e) => e && Number.isSafeInteger(e.since) && Number.isSafeInteger(e.until) && e.since >= 0 && e.until >= e.since && e.until < 2 ** 53 - 1).map((e) => ({ ...e })).sort((e, t) => e.since - t.since || e.until - t.until), n = [];
	for (let e of t) {
		let t = n.at(-1);
		t && e.since <= t.until + 1 ? t.until = Math.max(t.until, e.until) : n.push(e);
	}
	return n;
}
function Ie(e, t) {
	let n = new Set(t);
	if (!n.size) return [];
	let r = /* @__PURE__ */ new Map();
	for (let t of n) {
		let n = N(e.filter((e) => e.relayUrl === t).flatMap((e) => e.ranges));
		for (let { since: e, until: t } of n) r.set(e, (r.get(e) ?? 0) + 1), r.set(t + 1, (r.get(t + 1) ?? 0) - 1);
	}
	let i = Math.ceil(n.size / 2), a = [], o = 0, s = null;
	for (let [e, t] of [...r].sort(([e], [t]) => e - t)) o += t, o >= i && s === null && (s = e), o < i && s !== null && (a.push({
		since: s,
		until: e - 1
	}), s = null);
	return N(a);
}
function Le(e, t) {
	return N(e).find((e) => e.since <= t && e.until >= t)?.since ?? t;
}
function Re(e) {
	if (e.cancelled) return [];
	let t = e.since ?? e.oldestCreatedAt;
	return t == null ? [] : e.outcomes.flatMap((n) => {
		if (!n.eoseReceived || !n.verificationDrained || n.termination !== "eose" || n.saturated && n.oldestCreatedAt === null) return [];
		let r = N([{
			since: n.saturated ? Math.max(t, n.oldestCreatedAt + 1) : t,
			until: e.until
		}]);
		return r.length ? [{
			relayUrl: n.relayUrl,
			ranges: r
		}] : [];
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryKinds.ts
var P = [
	1,
	6,
	16,
	42,
	1111
], ze = P.join(",");
function Be(e) {
	return P.includes(e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/sensitiveEventUtils.ts
var Ve = 1111;
function He(e) {
	return e === 6 || e === 7 || e === 16;
}
function Ue(e) {
	return e.channel ? 42 : e.hasReply ? e.replyKind === 1 ? 1 : He(e.replyKind) || e.replyKind === 1111 ? Ve : null : 1;
}
function We(e, t = "") {
	let n = r.sanitizeExternalRelayUrls(t ? [t] : [], { limit: 1 })[0] ?? "";
	if (He(e.kind)) {
		let t = String(e.kind);
		return [
			[
				"E",
				e.id,
				n,
				e.pubkey
			],
			["K", t],
			["P", e.pubkey],
			[
				"e",
				e.id,
				n,
				e.pubkey
			],
			["k", t],
			["p", e.pubkey]
		];
	}
	if (e.kind !== 1111) return null;
	let i = a(e);
	return !i.valid || !i.rootKind || !i.parentKind ? null : [
		...i.rootTags.map((e) => [...e]),
		["K", i.rootKind],
		...i.rootPubkey ? [["P", i.rootPubkey]] : [],
		[
			"e",
			e.id,
			n,
			e.pubkey
		],
		["k", String(e.kind)],
		["p", e.pubkey]
	];
}
function F(t) {
	try {
		if (!l(t)) return !1;
		let r = s(t);
		return n(r) && e(r);
	} catch {
		return !1;
	}
}
var Ge = [
	1,
	42,
	1111
];
function I(e) {
	if (!Ge.includes(e.kind) || e.content !== "" || !e.tags.some((e) => e[0] === "content-warning")) return null;
	let n = e.tags.filter((e) => e[0] === "c");
	if (n.length !== 1) return null;
	let r = n[0];
	return !t(r[1]) || r.length > 3 ? null : {
		eventId: r[1],
		relayHint: r[2] || null
	};
}
function Ke(e) {
	return I(e) !== null && F(e);
}
function qe(e, t, n, r) {
	return {
		kind: 36,
		pubkey: n,
		created_at: r,
		content: t,
		tags: [["k", String(e)]]
	};
}
function Je(e, t, n) {
	return {
		...e,
		content: "",
		tags: [...e.tags.map((e) => [...e]), [
			"c",
			t,
			...n ? [n] : []
		]]
	};
}
function Ye(e, t, n = I(e)?.eventId) {
	if (!n || !Ke(e) || !t || t.id !== n || t.kind !== 36 || t.pubkey !== e.pubkey || !F(t)) return !1;
	let r = t.tags.filter((e) => e[0] === "k");
	return r.length === 1 && r[0].length >= 2 && r[0][1] === String(e.kind);
}
var Xe = /* @__PURE__ */ new Set([
	1,
	6,
	7,
	16,
	20,
	21,
	22,
	36,
	42,
	1111
]);
function Ze(e) {
	return Xe.has(e);
}
function Qe(e) {
	if (!e || e.kind !== 5) return [];
	let t = e.tags.filter((e) => e[0] === "e" && typeof e[1] == "string" && e[1].length > 0).map((e) => e[1]);
	return Array.from(new Set(t));
}
function $e(e, t) {
	return !e || !t || e.kind !== 5 || e.pubkey !== t.pubkey ? !1 : Qe(e).includes(t.id);
}
function et(e, t, n) {
	return `${e}:${t}:${n}`;
}
function tt(e) {
	return e.targetVerified !== !1;
}
function nt(e, t) {
	return e.deletedAt - t.deletedAt || e.deletionEventId.localeCompare(t.deletionEventId);
}
function L(e) {
	return {
		deletedAt: e.deletedAt * 1e3,
		deletionEventId: e.deletionEventId
	};
}
function rt(e, t = Date.now) {
	let { deletionEvent: n } = e;
	return {
		id: et(n.pubkey, e.targetEventId, n.id),
		targetAuthorPubkey: n.pubkey,
		targetEventId: e.targetEventId,
		deletionEventId: n.id,
		deletionEventPubkey: n.pubkey,
		targetVerified: e.targetVerified,
		deletedAt: n.created_at,
		reason: n.content.trim() || null,
		rawEvent: u(n),
		relayUrls: r.sanitizeExternalRelayUrls(e.relayUrls ?? []),
		fetchedAt: e.fetchedAt,
		updatedAt: t(),
		schemaVersion: 2
	};
}
function it(e, t = Date.now) {
	let { deletionEvent: n, targetEvent: r } = e;
	return !n.id || !$e(n, r) ? null : rt({
		deletionEvent: n,
		targetEventId: r.id,
		targetVerified: !0,
		relayUrls: e.relayUrls,
		fetchedAt: e.fetchedAt
	}, t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryMediaUtils.ts
function at(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.slice(1)) {
		let e = n.indexOf(" ");
		e <= 0 || t.set(n.slice(0, e), n.slice(e + 1));
	}
	let n = t.get("url"), r = n ? S(n) : "";
	if (!r) return null;
	let i = t.get("size"), a = i ? Number(i) : void 0, o = typeof a == "number" && Number.isFinite(a) && a > 0 ? a : void 0;
	return {
		url: r,
		mimeType: t.get("m") || void 0,
		alt: t.get("alt") || void 0,
		blurhash: t.get("blurhash") || void 0,
		dim: t.get("dim") || void 0,
		size: o,
		uploadProtocol: ot(t.get("uploadProtocol"))
	};
}
function ot(e) {
	return e === "blossom" || e === "nip96" || e === "custom-http" ? e : void 0;
}
function st(e) {
	let t = (() => {
		try {
			return new URL(e).pathname.toLowerCase();
		} catch {
			return e.toLowerCase();
		}
	})();
	if (t.endsWith(".jpg") || t.endsWith(".jpeg")) return "image/jpeg";
	if (t.endsWith(".png")) return "image/png";
	if (t.endsWith(".webp")) return "image/webp";
	if (t.endsWith(".avif")) return "image/avif";
	if (t.endsWith(".gif")) return "image/gif";
	if (t.endsWith(".mp4")) return "video/mp4";
	if (t.endsWith(".webm")) return "video/webm";
	if (t.endsWith(".mov")) return "video/quicktime";
}
function ct(e, t) {
	return re(e).filter((e) => e.isValidHttpUrl).map((e) => e.displayText).map((e) => S(e)).filter((e) => e.length > 0).filter((e) => !t.has(e) && /\.(jpe?g|png|webp|gif|avif|mp4|webm|mov)(?:$|[?#])/i.test(e)).map((e) => ({
		url: e,
		mimeType: st(e)
	}));
}
function lt(e, t) {
	if (!e.toLowerCase().includes(".avif")) return t;
	let n = new Set(t.map((e) => S(e.url))), r = ct(e, n).filter((e) => e.mimeType !== "image/avif" || n.has(e.url) ? !1 : (n.add(e.url), !0));
	return r.length ? [...t, ...r] : t;
}
function R(e) {
	let t = e.tags.filter((e) => e[0] === "imeta").map(at).filter((e) => e !== null), n = new Set(t.map((e) => e.url));
	return t.push(...ct(e.content, n)), t;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relatedEventVerification.ts
function ut(e, t) {
	let n = E(e);
	return !n || t && (n.event.id !== t.eventId || t.authorHint && n.event.pubkey !== t.authorHint || t.authorHints?.length && !t.authorHints.includes(n.event.pubkey) || t.targetKindHint != null && n.event.kind !== t.targetKindHint) ? null : n;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postRepostUtils.ts
function z(e) {
	return e === 6 || e === 16;
}
function dt(e) {
	return e === 1 || e === 7 || e === 42 || e === 1111;
}
function ft(e, t, n = [
	1,
	7,
	42,
	1111
]) {
	return e === 6 ? t === 1 ? "supported" : "outer-target-kind-mismatch" : t === 1 ? "outer-target-kind-mismatch" : n.includes(t) ? "supported" : "unsupported-target-kind";
}
function pt(e) {
	let n = {
		status: "invalid-reference",
		reference: null
	};
	if (!z(e.kind)) return n;
	let i = e.tags.filter((e) => e[0] === "e");
	if (i.some((e) => !t(e[1]))) return n;
	let a = new Set(i.map((e) => e[1])), o = e.tags.filter((e) => e[0] === "p");
	if (a.size > 1 || o.some((e) => !t(e[1]))) return n;
	let s = e.kind === 16 ? e.tags.filter((e) => e[0] === "k") : [], c = /* @__PURE__ */ new Set();
	for (let e of s) {
		let t = e[1], r = Number(t);
		if (t === void 0 || !Number.isInteger(r) || r < 0 || r > 65535 || t !== String(r)) return n;
		c.add(r);
	}
	if (c.size > 1) return n;
	if (!i.length) return e.kind === 16 && e.tags.some((e) => e[0] === "a") ? {
		status: "unsupported-reference",
		reference: null
	} : n;
	let l = new Set(o.map((e) => e[1]));
	return {
		status: "valid",
		reference: {
			outerKind: e.kind,
			targetKindHint: [...c][0] ?? null,
			eventId: i[0][1],
			authorHint: l.size === 1 ? o[0][1] : null,
			...l.size > 1 ? { authorHints: [...l] } : {},
			relayHints: r.sanitizeExternalRelayUrls(i.map((e) => e[2] ?? ""))
		}
	};
}
function B(e) {
	return pt(e).reference;
}
function V(e, t) {
	return ut(e, t);
}
function mt(e, t, n) {
	let r = pt(e), i = r.reference, a = {
		event: null,
		profile: null,
		relayHints: t?.relayHints ?? []
	};
	if (!i) return {
		...a,
		status: r.status
	};
	if (t?.event && !V(t.event, i)) return {
		...a,
		status: "invalid-target"
	};
	if (t?.event) {
		let e = ft(i.outerKind, t.event.kind, n);
		if (e !== "supported") return {
			...a,
			status: e
		};
	}
	return {
		status: t?.status ?? "loading",
		event: t?.event ?? null,
		profile: t?.profile ?? null,
		relayHints: t?.relayHints ?? i.relayHints
	};
}
function ht(e, t) {
	let n = V(e, t);
	return n && ft(t.outerKind, n.event.kind) === "supported" ? n : null;
}
function H(e, t = [], n) {
	let i = n ? ht(e, n) : V(e);
	return !i || !dt(i.event.kind) ? null : {
		rawEvent: s(i.event),
		rawEventVerification: {
			status: "valid",
			ruleVersion: 1
		},
		relayHints: r.sanitizeExternalRelayUrls(t)
	};
}
function gt(e, t, n, i, a) {
	let o = V(e), s = r.sanitizeExternalRelayUrls([n])[0];
	if (!o || !dt(o.event.kind) || !s) throw Error("invalid_repost_target");
	let c = o.event.kind === 1 ? 6 : 16;
	return {
		kind: c,
		pubkey: t,
		created_at: i,
		content: "",
		tags: [
			[
				"e",
				o.event.id,
				s
			],
			["p", o.event.pubkey],
			...c === 16 ? [["k", String(o.event.kind)]] : [],
			...a ? [a] : []
		]
	};
}
function _t(e, t = []) {
	return {
		id: e.id,
		eventId: e.id,
		pubkeyHex: e.pubkey,
		kind: e.kind,
		content: e.content,
		tags: e.tags,
		createdAt: e.created_at,
		postedAt: e.created_at * 1e3,
		relayHints: t,
		acceptedRelays: [],
		media: R(e),
		...o(e),
		rawEvent: e,
		updatedAt: 0,
		schemaVersion: 2
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryLatestRequest.ts
var vt = /* @__PURE__ */ new Map();
function yt(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function bt(e) {
	let t = yt(e.pubkeyHex);
	t && e.eventId && vt.set(t, {
		pubkeyHex: t,
		eventId: e.eventId,
		requestedAt: e.requestedAt ?? Date.now()
	});
}
function xt(e) {
	let t = yt(e);
	if (!t) return null;
	let n = vt.get(t) ?? null;
	return vt.delete(t), n;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryLocalSearchRevision.ts
var St = /* @__PURE__ */ new Map(), Ct = 0;
function wt(e) {
	return St.get(e) ?? 0;
}
function U(e) {
	St.set(e, wt(e) + 1);
}
function Tt() {
	return Ct;
}
function Et() {
	Ct += 1;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/arrayEqualityUtils.ts
function W(e, t) {
	let n = e ?? [], r = t ?? [];
	return n.length === r.length && n.every((e, t) => e === r[t]);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryRelayCoverageRepository.ts
var Dt = "postHistoryRelayCoverage:", G = class {
	db;
	now;
	constructor(e = g, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e, t) {
		let n = (await this.db.postHistoryExternalCoverage.get(Ot(e, t)))?.value;
		return {
			schemaVersion: 1,
			ownerPubkeyHex: e,
			kindsKey: t,
			relays: (n?.schemaVersion === 1 && n.ownerPubkeyHex === e && n.kindsKey === t && Array.isArray(n.relays) ? n.relays : []).flatMap((e) => {
				let t = r.sanitizeExternalRelayUrls([e?.relayUrl])[0];
				return t && Array.isArray(e.ranges) ? [{
					relayUrl: t,
					ranges: N(e.ranges)
				}] : [];
			})
		};
	}
	async getLocalRevision(e) {
		return A(this.db, e);
	}
	async isCurrent(e) {
		return ke(this.db, e);
	}
	async record(e) {
		if (!await this.isCurrent(e)) throw new K();
		let t = await this.get(e.ownerPubkeyHex, e.kindsKey), n = /* @__PURE__ */ new Map();
		for (let i of [...t.relays, ...e.relays]) {
			let e = r.sanitizeExternalRelayUrls([i.relayUrl])[0];
			e && n.set(e, [...n.get(e) ?? [], ...i.ranges]);
		}
		let i = {
			...t,
			relays: [...n].map(([e, t]) => ({
				relayUrl: e,
				ranges: N(t)
			})).sort((e, t) => e.relayUrl.localeCompare(t.relayUrl))
		};
		if (!e.isActive()) throw new K();
		JSON.stringify(t) !== JSON.stringify(i) && await this.db.postHistoryExternalCoverage.put({
			id: Ot(e.ownerPubkeyHex, e.kindsKey),
			ownerPubkeyHex: e.ownerPubkeyHex,
			value: i,
			updatedAt: this.now()
		});
	}
	async clearForPubkey(e) {
		await this.db.postHistoryExternalCoverage.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryCitrineRanges.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryLocalBrowsingRanges.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryLocalResumeCursor.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryJumpAnchors.delete(e), await Ae(this.db, e, this.now());
	}
};
function Ot(e, t) {
	return `${Dt}${e}:${t}`;
}
var K = class extends M {}, kt = new G();
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/sensitivePayloadDeletionReconciler.ts
async function At(e, t = g, n = Date.now) {
	let r = await O(t, "postHistory").get(e);
	if (!r || !i(r.rawEvent, r)) return !1;
	let a = r.rawEvent, o = I(a);
	if (!o || !F(a)) return !1;
	let s = await O(t, "sensitivePayloads").get(o.eventId);
	if (!s || s.deletedAt !== void 0 || s.pubkeyHex !== a.pubkey || !Ye(a, s.rawEvent, o.eventId)) return !1;
	let c = !1;
	return await t.transaction("rw", t.events, t.postHistory, t.sensitivePayloads, t.postHistoryDeletionRequests, async () => {
		let r = await O(t, "postHistory").get(e), a = await O(t, "sensitivePayloads").get(o.eventId);
		if (!r || !i(r.rawEvent, r) || !F(r.rawEvent) || !a || a.deletedAt !== void 0 || a.pubkeyHex !== r.pubkeyHex || !Ye(r.rawEvent, a.rawEvent, o.eventId)) return;
		let s = (await t.postHistoryDeletionRequests.where("targetEventId").equals(o.eventId).toArray().then((e) => O(t, "postHistoryDeletionRequests").hydrate(e))).filter((e) => {
			if (e.targetAuthorPubkey !== r.pubkeyHex || e.deletionEventPubkey !== r.pubkeyHex || e.rawEventVerification?.status !== "valid" || e.rawEventVerification.ruleVersion !== 1) return !1;
			let t = e.rawEvent;
			return F(t) && $e(t, {
				id: a.id,
				pubkey: a.pubkeyHex
			});
		}).sort(nt);
		if (s.length === 0) return;
		let l = s[0];
		for (let e of s) e.targetVerified !== !0 && await O(t, "postHistoryDeletionRequests").put({
			...e,
			targetVerified: !0,
			updatedAt: n(),
			schemaVersion: 2
		});
		await O(t, "sensitivePayloads").put({
			...a,
			...L(l),
			updatedAt: n()
		}), c = !0;
	}), c && U(a.pubkey), c;
}
async function jt(e, t = g, n = Date.now) {
	let r = await O(t, "sensitivePayloads").get(e);
	if (!r || r.deletedAt !== void 0) return;
	let a = await t.postHistoryDeletionRequests.where("targetEventId").equals(e).toArray().then((e) => O(t, "postHistoryDeletionRequests").hydrate(e)), o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set();
	for (let t of a) {
		if (t.rawEventVerification?.status !== "valid" || t.rawEventVerification.ruleVersion !== 1) continue;
		let n = t.rawEvent;
		if (F(n) && n.kind === 5) {
			s.add(n.pubkey);
			for (let t of n.tags) t[0] === "e" && t[1] && t[1] !== e && o.add(t[1]);
		}
	}
	for (let n of s) {
		let r = await t.postHistory.where("pubkeyHex").equals(n).toArray().then((e) => O(t, "postHistory").hydrate(e));
		for (let t of r) i(t.rawEvent, t) && I(t.rawEvent)?.eventId === e && o.add(t.eventId);
	}
	for (let e of o) await At(e, t, n);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryPersistenceCoordinator.ts
function Mt(e) {
	return [
		e.postHistoryExternalCoverage,
		e.postHistoryCitrineRanges,
		e.postHistoryLocalBrowsingRanges,
		e.postHistoryLocalResumeCursor,
		e.postHistoryJumpAnchors,
		e.postHistoryWriteGeneration,
		e.postHistoryChildWriteGeneration
	];
}
function Nt(e) {
	return [
		e.postHistoryExternalCoverage,
		e.postHistoryCitrineRanges,
		e.postHistoryLocalBrowsingRanges,
		e.postHistoryLocalResumeCursor,
		e.postHistoryWriteGeneration
	];
}
async function Pt(e, t, n) {
	let r = 0, i = 0;
	return await e.transaction("rw", [
		e.postHistory,
		e.events,
		e.notifications,
		e.postHistoryDeletionRequests,
		e.postHistoryChildInteractions,
		e.sensitivePayloads,
		...Mt(e)
	], async () => {
		await new G(e, n).clearForPubkey(t), await Pe(e, n()), i = await e.sensitivePayloads.where("pubkeyHex").equals(t).delete();
		let a = (await e.postHistory.where("pubkeyHex").equals(t).primaryKeys()).map(String);
		a.length > 0 && await e.postHistoryChildInteractions.where("parentEventId").anyOf(a).delete(), r = await e.postHistory.where("pubkeyHex").equals(t).delete(), await Oe(e);
	}), {
		deletedPostHistoryCount: r,
		deletedPayloadCount: i
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryLocalBrowsingRangesRepository.ts
var Ft = "postHistoryLocalBrowsingRanges:", It = class {
	db;
	now;
	constructor(e = g, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e, t, n) {
		let r = ne(n) ?? "", i = await A(this.db, e), a = {
			schemaVersion: 1,
			source: "local-relay",
			ownerPubkeyHex: e,
			kindsKey: t,
			localRelayUrl: r,
			localRevision: i,
			browsingRanges: [],
			resumeHint: null
		};
		if (!r) return a;
		let o = this.key(e, t, r), s = (await this.db.postHistoryLocalBrowsingRanges.get(o))?.value, c = (await this.db.postHistoryLocalResumeCursor.get(o))?.value, l = {
			...s,
			resumeHint: c
		};
		if (l?.schemaVersion !== 1 || l.source !== "local-relay" || l.ownerPubkeyHex !== e || l.kindsKey !== t || l.localRelayUrl !== r || l.localRevision !== i) return a;
		let u = l.resumeHint?.nextUntil;
		return {
			...a,
			browsingRanges: N(Array.isArray(l.browsingRanges) ? l.browsingRanges : []),
			resumeHint: typeof u == "number" && Number.isSafeInteger(u) && u >= 0 ? { nextUntil: u } : null
		};
	}
	async record(e) {
		await j(this.db, e);
		let t = ne(e.localRelayUrl);
		if (!t) throw Error("Invalid local browsing URL");
		let n = await this.get(e.ownerPubkeyHex, e.kindsKey, t), r = e.resumeHint?.nextUntil, i = n.resumeHint;
		typeof r == "number" && Number.isSafeInteger(r) && r >= 0 && (!e.initializeResumeHintOnly || !i) && (i = { nextUntil: i ? Math.min(i.nextUntil, r) : r });
		let a = {
			...n,
			browsingRanges: N([...n.browsingRanges, ...e.browsingRanges]),
			resumeHint: i
		};
		if (JSON.stringify(a) !== JSON.stringify(n)) {
			let n = this.key(e.ownerPubkeyHex, e.kindsKey, t), { resumeHint: r, ...i } = a;
			await this.db.postHistoryLocalBrowsingRanges.put({
				id: n,
				ownerPubkeyHex: e.ownerPubkeyHex,
				value: i,
				updatedAt: this.now()
			}), r ? await this.db.postHistoryLocalResumeCursor.put({
				id: n,
				ownerPubkeyHex: e.ownerPubkeyHex,
				value: r,
				updatedAt: this.now()
			}) : await this.db.postHistoryLocalResumeCursor.delete(n);
		}
		await j(this.db, e);
	}
	key(e, t, n) {
		return `${Ft}${e}:${t}:${encodeURIComponent(n)}`;
	}
}, Lt = new It(), Rt = {
	status: "valid",
	ruleVersion: 1
};
function zt(e) {
	return e?.status === "valid" && e.ruleVersion === 1;
}
function Bt(e, t) {
	return xe(e, t) ? {
		event: e,
		attestation: t
	} : E(e);
}
function Vt(e) {
	return e.map((e) => ({ ...e }));
}
function Ht(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 1;
}
function Ut(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 50;
}
function q(e) {
	return Number.isFinite(e) ? Math.trunc(e ?? 0) : null;
}
function J(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 50;
}
function Wt(e) {
	return Number.isFinite(e) ? Math.trunc(e) : 0;
}
function Gt(e) {
	return { contiguous: e?.contiguous !== !1 };
}
function Y(e, t) {
	return e.postedAt === t.postedAt ? e.createdAt === t.createdAt ? d(t.eventId, e.eventId) : t.createdAt - e.createdAt : t.postedAt - e.postedAt;
}
function Kt(e, t) {
	return Y(e, t) > 0;
}
function qt(e, t) {
	return Y(e, t) < 0;
}
function Jt(e) {
	return e.sort(Y);
}
function X(e, t) {
	return [
		e,
		t.postedAt,
		t.createdAt,
		t.eventId
	];
}
function Z(e) {
	return {
		lower: [e],
		upper: [e, h.maxKey]
	};
}
function Q(e) {
	return Be(e.kind);
}
function $(e, t) {
	return Q(e) && (t === null || e.createdAt >= t);
}
function Yt(e) {
	return Math.max(0, e * 1e3);
}
function Xt(e, t) {
	let n = t(), i = e.event, a = r.sanitizeExternalRelayUrls(e.acceptedRelays), s = r.sanitizeExternalRelayUrls([...e.relayHints ?? [], ...a], { limit: 3 }), c = o(i);
	return {
		id: i.id,
		eventId: i.id,
		pubkeyHex: i.pubkey,
		kind: i.kind,
		content: i.content,
		tags: i.tags.map((e) => [...e]),
		createdAt: i.created_at,
		postedAt: e.postedAt ?? n,
		relayHints: s,
		acceptedRelays: a,
		media: z(i.kind) ? [] : R(i),
		rawEvent: u(i),
		rawEventVerification: { ...Rt },
		...c.channelEventId ? { channelEventId: c.channelEventId } : {},
		...c.channelRelayHints ? { channelRelayHints: c.channelRelayHints } : {},
		updatedAt: n,
		schemaVersion: 2
	};
}
function Zt(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let i of e) {
		if (!i?.event?.id || !i.event.pubkey) continue;
		let e = r.sanitizeExternalRelayUrls(i.relayUrls), a = n.get(i.event.id);
		a ? c(a.event, i.event) ? (a.relayUrls = r.sanitizeExternalRelayUrls([...a.relayUrls, ...e]), !a.attestation && i.attestation && (a.attestation = i.attestation)) : t.warn("post_history_fetched_event_conflict", i.event.id) : n.set(i.event.id, {
			event: i.event,
			...i.attestation ? { attestation: i.attestation } : {},
			relayUrls: e
		});
	}
	return Array.from(n.values());
}
async function Qt(e, t) {
	if (t.length === 0) return /* @__PURE__ */ new Map();
	let n = await e.postHistoryDeletionRequests.where("targetEventId").anyOf(t).toArray().then((t) => O(e, "postHistoryDeletionRequests").hydrate(t)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = r.get(e.targetEventId);
		t ? t.push(e) : r.set(e.targetEventId, [e]);
	}
	return r;
}
function $t(e, t) {
	return e.length === t.length && e.every((e, n) => {
		let r = t[n];
		return e.url === r.url && e.mimeType === r.mimeType && e.alt === r.alt && e.blurhash === r.blurhash && e.dim === r.dim && e.size === r.size && e.uploadProtocol === r.uploadProtocol;
	});
}
function en(e, t) {
	return e.kind !== t.kind || e.content !== t.content || e.createdAt !== t.createdAt || e.postedAt !== t.postedAt || e.deletedAt !== t.deletedAt || e.deletionEventId !== t.deletionEventId || e.channelEventId !== t.channelEventId || !c(e.rawEvent, t.rawEvent) || e.rawEventVerification?.status !== t.rawEventVerification?.status || e.rawEventVerification?.ruleVersion !== t.rawEventVerification?.ruleVersion || !W(e.relayHints, t.relayHints) || !W(e.acceptedRelays, t.acceptedRelays) || !W(e.fetchedRelays, t.fetchedRelays) || !W(e.channelRelayHints, t.channelRelayHints) || !$t(e.media, t.media) || e.tags.length !== t.tags.length || e.tags.some((e, n) => !W(e, t.tags[n]));
}
var tn = new class {
	db;
	now;
	console;
	constructor(e = g, t = Date.now, n = globalThis.console === void 0 ? {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	} : globalThis.console) {
		this.db = e, this.now = t, this.console = n;
	}
	async getByEventId(e) {
		if (!e) return null;
		let t = await O(this.db, "postHistory").get(e);
		return t && Q(t) ? t : null;
	}
	async findRepostTargetSnapshot(e, t) {
		if (!e || !t) return null;
		let { events: n, eventStoreMigration: r, postHistory: i } = this.db, [a, o] = await this.db.transaction("r", [n, r], () => Promise.all([r.get(te), n.get(t)]));
		if (a?.done === !0 && !o) return null;
		let s = await i.where("pubkeyHex").equals(e).filter((e) => {
			let n = e.repostTarget;
			return z(e.kind) && (n?.eventId ?? n?.rawEvent?.id) === t;
		}).first();
		if (!s) return null;
		let [c] = await O(this.db, "postHistory").hydrate([s]);
		return c.repostTarget ?? null;
	}
	async getExistingEventIdsForPubkey(e) {
		if (!e.pubkeyHex || e.eventIds.length === 0) return [];
		let t = Array.from(new Set(e.eventIds.filter((e) => !!e)));
		return (await O(this.db, "postHistory").bulkGet(t)).filter((t) => !!t && Q(t) && t.pubkeyHex === e.pubkeyHex).map((e) => e.eventId);
	}
	async getAll(e) {
		return e.pubkeyHex ? Jt((await this.db.postHistory.where("[pubkeyHex+postedAt]").between([e.pubkeyHex, h.minKey], [e.pubkeyHex, h.maxKey]).reverse().toArray().then((e) => O(this.db, "postHistory").hydrate(e))).filter(Q)) : [];
	}
	async getSearchScanChunk(e) {
		if (!e.pubkeyHex) return {
			items: [],
			nextCursor: null,
			hasMore: !1
		};
		let t = J(e.limit), n = Z(e.pubkeyHex), r = e.cursor ? X(e.pubkeyHex, e.cursor) : n.upper, i = await this.db.postHistory.where(x).between(n.lower, r, !0, !e.cursor).reverse().limit(t).toArray().then((e) => O(this.db, "postHistory").hydrate(e)), a = i.at(-1);
		return {
			items: i.filter(Q),
			nextCursor: a ? {
				postedAt: a.postedAt,
				createdAt: a.createdAt,
				eventId: a.eventId
			} : null,
			hasMore: i.length === t
		};
	}
	async getPage(e) {
		if (!e.pubkeyHex) return [];
		let t = Ht(e.page), n = Ut(e.pageSize), r = Z(e.pubkeyHex);
		return this.db.postHistory.where(x).between(r.lower, r.upper).reverse().filter(Q).offset((t - 1) * n).limit(n).toArray().then((e) => O(this.db, "postHistory").hydrate(e));
	}
	async getLatestVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = J(e.limit), n = q(e.visibleUntil), r = Z(e.pubkeyHex);
		return this.db.postHistory.where(x).between(r.lower, r.upper).reverse().filter((e) => $(e, n)).limit(t).toArray().then((e) => O(this.db, "postHistory").hydrate(e));
	}
	async getOlderVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = J(e.limit), n = q(e.visibleUntil), r = Z(e.pubkeyHex), i = X(e.pubkeyHex, e.cursor);
		return this.db.postHistory.where(x).between(r.lower, i, !0, !1).reverse().filter((e) => $(e, n)).limit(t).toArray().then((e) => O(this.db, "postHistory").hydrate(e));
	}
	async hasOlderVisiblePosts(e) {
		if (!e.pubkeyHex) return !1;
		let t = q(e.visibleUntil), n = this.db.postHistory.where(x).between(Z(e.pubkeyHex).lower, X(e.pubkeyHex, e.cursor), !0, !1), r = n;
		if (t !== null) {
			let i = this.db.postHistory.where("[pubkeyHex+createdAt]").between([e.pubkeyHex, t], [e.pubkeyHex, h.maxKey]), [a, o] = await Promise.all([n.count(), i.count()]);
			if (a === 0 || o === 0) return !1;
			r = o <= a ? i : n;
		}
		return await r.filter((n) => $(n, t) && Kt(n, e.cursor)).first() !== void 0;
	}
	async getNewerVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = J(e.limit), n = q(e.visibleUntil), r = Z(e.pubkeyHex), i = X(e.pubkeyHex, e.cursor);
		return (await this.db.postHistory.where(x).between(i, r.upper, !1, !0).filter((e) => $(e, n)).limit(t).toArray().then((e) => O(this.db, "postHistory").hydrate(e))).reverse();
	}
	async getOldestVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = J(e.limit), n = Gt(e.query).contiguous ? q(e.visibleUntil) : null, r = Z(e.pubkeyHex);
		return n === null ? (await this.db.postHistory.where(x).between(r.lower, r.upper).filter(Q).limit(t).toArray().then((e) => O(this.db, "postHistory").hydrate(e))).reverse() : (await this.db.postHistory.where("[pubkeyHex+createdAt]").between([e.pubkeyHex, n], [e.pubkeyHex, h.maxKey]).toArray().then((e) => O(this.db, "postHistory").hydrate(e))).filter(Q).sort(Y).slice(-t);
	}
	async getVisibleChunkFromCreatedAt(e) {
		if (!e.pubkeyHex) return [];
		let t = J(e.limit), n = Wt(e.createdAt), r = Gt(e.query).contiguous ? q(e.visibleUntil) : null, i = Z(e.pubkeyHex);
		return this.db.transaction("r", this.db.events, this.db.postHistory, async () => {
			let a = await this.db.postHistory.where(x).between(i.lower, i.upper).reverse().filter((e) => $(e, r) && e.createdAt <= n).first().then(async (e) => e ? (await O(this.db, "postHistory").hydrate([e]))[0] : void 0);
			return a ? t === 1 ? [a] : [a, ...await this.db.postHistory.where(x).between(i.lower, X(e.pubkeyHex, a), !0, !1).reverse().filter((e) => $(e, r)).limit(t - 1).toArray().then((e) => O(this.db, "postHistory").hydrate(e))] : (await this.db.postHistory.where(x).between(i.lower, i.upper).filter((e) => $(e, r)).limit(t).toArray().then((e) => O(this.db, "postHistory").hydrate(e))).reverse();
		});
	}
	async getVisibleChunkAroundEventId(e) {
		if (!e.pubkeyHex) return [];
		let t = J(e.limit), n = Number.isFinite(e.keepAbove) ? Math.min(t - 1, Math.max(0, Math.trunc(e.keepAbove ?? 0))) : 0, r = q(e.visibleUntil), i = Z(e.pubkeyHex);
		return this.db.transaction("r", this.db.events, this.db.postHistory, async () => {
			let a = await O(this.db, "postHistory").get(e.eventId);
			if (!a || a.pubkeyHex !== e.pubkeyHex || !$(a, r)) return [];
			let o = X(e.pubkeyHex, a), s = n === 0 ? [] : await this.db.postHistory.where(x).between(o, i.upper, !1, !0).filter((e) => $(e, r)).limit(n).toArray().then((e) => O(this.db, "postHistory").hydrate(e)), c = t - 1 - s.length, l = c === 0 ? [] : await this.db.postHistory.where(x).between(i.lower, o, !0, !1).reverse().filter((e) => $(e, r)).limit(c).toArray().then((e) => O(this.db, "postHistory").hydrate(e)), u = t - 1 - s.length - l.length;
			if (u > 0) {
				let t = s[s.length - 1] ?? a, n = await this.db.postHistory.where(x).between(X(e.pubkeyHex, t), i.upper, !1, !0).filter((e) => $(e, r)).limit(u).toArray().then((e) => O(this.db, "postHistory").hydrate(e));
				s.push(...n);
			}
			return [
				...s.reverse(),
				a,
				...l
			];
		});
	}
	async hasPostsBeforeCreatedAt(e, t) {
		return !e || !Number.isFinite(t) ? !1 : await this.db.postHistory.where("[pubkeyHex+createdAt]").between([e, h.minKey], [e, Math.trunc(t)], !0, !1).filter(Q).limit(1).count() > 0;
	}
	async getSparseChunk(e) {
		if (!e.pubkeyHex || !Number.isFinite(e.visibleUntil)) return [];
		let t = J(e.limit), n = Math.trunc(e.visibleUntil);
		if (e.direction !== "latest" && !e.cursor) return [];
		let r = e.cursor, i = (t) => Q(t) && t.createdAt < n && (e.direction === "latest" || e.direction === "older" && !!r && Kt(t, r) || e.direction === "newer" && !!r && qt(t, r)), a = Z(e.pubkeyHex), o = r ? X(e.pubkeyHex, r) : null, s = e.direction === "latest" ? this.db.postHistory.where(x).between(a.lower, a.upper) : e.direction === "older" ? this.db.postHistory.where(x).between(a.lower, o, !0, !1) : this.db.postHistory.where(x).between(o, a.upper, !1, !0), c = await (e.direction === "newer" ? s : s.reverse()).filter(i).limit(t).toArray().then((e) => O(this.db, "postHistory").hydrate(e));
		return e.direction === "newer" ? c.reverse() : c;
	}
	async countForPubkey(e) {
		return e ? this.countAuthoredPosts(e, null) : 0;
	}
	async countVisibleForPubkey(e, t) {
		return e ? this.countAuthoredPosts(e, q(t)) : 0;
	}
	async countAuthoredPosts(e, t) {
		let n = this.db.postHistory;
		return this.db.transaction("r", n, async () => {
			let [r, ...i] = await Promise.all([n.count(), ...P.map((e) => n.where("kind").equals(e).count())]), a = t === null ? n.where("pubkeyHex").equals(e) : n.where("[pubkeyHex+createdAt]").between([e, t], [e, h.maxKey]);
			return i.reduce((e, t) => e + t, 0) === r ? a.count() : a.filter(Q).count();
		});
	}
	async putPostedEvent(e) {
		let t = Bt(e.event, e.attestation);
		if (!t) throw Error("invalid_post_history_raw_event");
		let n = B(t.event), r = e.repostTarget ? n && H(e.repostTarget.event, e.repostTarget.relayHints, n) : null;
		if (e.repostTarget && !r) throw Error("invalid_repost_target");
		if (e.localWriteScope && e.localWriteScope.ownerPubkeyHex !== t.event.pubkey) throw Error("invalid_post_history_owner");
		await this.db.transaction("rw", this.db.events, this.db.postHistory, this.db.postHistoryWriteGeneration, async () => {
			await j(this.db, e.localWriteScope);
			let i = await O(this.db, "postHistory").get(t.event.id);
			await O(this.db, "postHistory").put({
				...Xt({
					...e,
					event: t.event
				}, this.now),
				...z(t.event.kind) && i ? {
					postedAt: i.postedAt,
					fetchedRelays: i.fetchedRelays,
					deletedAt: i.deletedAt,
					deletionEventId: i.deletionEventId
				} : {},
				...r ? { repostTarget: r } : i?.repostTarget && n && H(i.repostTarget.rawEvent, i.repostTarget.relayHints, n) ? { repostTarget: i.repostTarget } : {}
			}), await j(this.db, e.localWriteScope);
		}), U(t.event.pubkey), bt({
			pubkeyHex: t.event.pubkey,
			eventId: t.event.id
		});
	}
	async attachRepostTarget(e) {
		let t = !1;
		return await this.db.transaction("rw", this.db.events, this.db.postHistory, this.db.postHistoryWriteGeneration, async () => {
			await j(this.db, e.localWriteScope);
			let n = await O(this.db, "postHistory").get(e.outerEventId);
			if (!n || n.pubkeyHex !== e.localWriteScope.ownerPubkeyHex || n.deletedAt !== void 0 || !i(n.rawEvent, n) || !E(n.rawEvent)) return;
			let r = B(n);
			if (!r) return;
			let a = H(e.target, e.relayHints, r);
			if (!a) throw Error("invalid_repost_target");
			n.repostTarget && c(n.repostTarget.rawEvent, a.rawEvent) && W(n.repostTarget.relayHints, a.relayHints) || (await O(this.db, "postHistory").update(n.id, {
				repostTarget: a,
				updatedAt: this.now()
			}), await j(this.db, e.localWriteScope), t = !0);
		}), t && U(e.localWriteScope.ownerPubkeyHex), t;
	}
	async upsertFetchedEvents(e) {
		let t = Zt(e.events, this.console).flatMap((e) => {
			let t = Bt(e.event, e.attestation);
			return t ? [{
				...e,
				event: t.event,
				attestation: t.attestation
			}] : (this.console.warn("post_history_invalid_fetched_event", e.event.id), []);
		});
		if (t.length === 0 && !e.relayFetchCoverage && !e.localWriteScope && !e.localBrowsingWrite) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			appliedDeletionCount: 0
		};
		let n = e.fetchedAt ?? this.now(), i = t.map((e) => e.event.id), a = 0, s = 0, l = 0, d = 0, f = /* @__PURE__ */ new Set(), p = new G(this.db, this.now);
		try {
			await this.db.transaction("rw", [
				this.db.events,
				this.db.postHistory,
				this.db.postHistoryDeletionRequests,
				this.db.sensitivePayloads,
				...e.relayFetchCoverage || e.localWriteScope || e.localBrowsingWrite ? Mt(this.db) : []
			], async () => {
				if (await j(this.db, e.localWriteScope), await j(this.db, e.localBrowsingWrite), e.relayFetchCoverage && !await p.isCurrent(e.relayFetchCoverage)) throw new K();
				let m = await O(this.db, "postHistory").bulkGet(i), h = /* @__PURE__ */ new Map(), g = await Qt(this.db, i);
				m.forEach((e) => {
					e && h.set(e.eventId, e);
				});
				let _ = [], v = t.map((e) => {
					let t = h.get(e.event.id), i = r.sanitizeExternalRelayUrls([...t?.fetchedRelays ?? [], ...e.relayUrls]), p = !!t && !c(t.rawEvent, e.event), m = !t || !p || !zt(t.rawEventVerification);
					p && this.console.warn("post_history_raw_event_conflict", e.event.id);
					let v = !m && t ? {
						channelEventId: t.channelEventId,
						channelRelayHints: t.channelRelayHints
					} : o(e.event), ee = r.sanitizeExternalRelayUrls([
						...t?.relayHints ?? [],
						...e.relayUrls,
						...t?.acceptedRelays ?? []
					], { limit: r.EXTERNAL_INPUT_RELAY_LIMIT }), y = {
						id: e.event.id,
						eventId: e.event.id,
						pubkeyHex: t?.pubkeyHex ?? e.event.pubkey,
						kind: !m && t ? t.kind : e.event.kind,
						content: !m && t ? t.content : e.event.content,
						tags: !m && t ? t.tags.map((e) => [...e]) : e.event.tags.map((e) => [...e]),
						createdAt: !m && t ? t.createdAt : e.event.created_at,
						postedAt: t?.postedAt ?? Yt(e.event.created_at),
						relayHints: ee,
						acceptedRelays: t?.acceptedRelays ?? [],
						...i.length > 0 ? { fetchedRelays: i } : {},
						media: z(e.event.kind) ? [] : !m && t ? Vt(t.media) : R(e.event),
						rawEvent: !m && t ? t.rawEvent : u(e.event),
						rawEventVerification: !m && t ? t.rawEventVerification : { ...Rt },
						fetchedAt: n,
						lastSeenAt: n,
						...v.channelEventId ? { channelEventId: v.channelEventId } : t?.channelEventId ? { channelEventId: t.channelEventId } : {},
						...v.channelRelayHints ? { channelRelayHints: v.channelRelayHints } : t?.channelRelayHints ? { channelRelayHints: [...t.channelRelayHints] } : {},
						...t?.deletedAt === void 0 ? {} : { deletedAt: t.deletedAt },
						...t?.deletionEventId ? { deletionEventId: t.deletionEventId } : {},
						updatedAt: this.now(),
						...t?.repostTarget && B(e.event) && H(t.repostTarget.rawEvent, t.repostTarget.relayHints, B(e.event)) ? { repostTarget: t.repostTarget } : {},
						schemaVersion: 2
					}, b = !1;
					t ? en(t, y) ? (s += 1, b = !0) : l += 1 : (a += 1, b = !0);
					let te = (g.get(e.event.id) ?? []).flatMap((e) => {
						if (!(Ze(y.kind) && y.pubkeyHex === e.targetAuthorPubkey && y.pubkeyHex === e.deletionEventPubkey)) return [];
						if (!tt(e)) {
							let t = {
								...e,
								targetVerified: !0,
								updatedAt: this.now(),
								schemaVersion: 2
							};
							return _.push(t), [t];
						}
						return [e];
					}).sort(nt);
					return y.deletedAt !== void 0 || te.length === 0 ? (b && f.add(y.pubkeyHex), y) : (d += 1, f.add(y.pubkeyHex), {
						...y,
						...L(te[0]),
						updatedAt: this.now()
					});
				});
				if (_.length > 0 && await O(this.db, "postHistoryDeletionRequests").bulkPut(_), await O(this.db, "postHistory").bulkPut(v), e.relayFetchCoverage && (await p.record(e.relayFetchCoverage), !await p.isCurrent(e.relayFetchCoverage))) throw new K();
				e.localBrowsingWrite && await new It(this.db, this.now).record(e.localBrowsingWrite), await j(this.db, e.localWriteScope);
			});
		} catch (e) {
			if (e instanceof M) return {
				insertedCount: 0,
				updatedCount: 0,
				unchangedCount: 0,
				appliedDeletionCount: 0,
				applied: !1
			};
			throw e;
		}
		f.forEach(U);
		for (let e of t) I(e.event) && At(e.event.id, this.db, this.now).catch(() => {
			this.console.warn("post_history_sensitive_payload_deletion_reconcile_failed", e.event.id);
		});
		return {
			insertedCount: a,
			updatedCount: s,
			unchangedCount: l,
			appliedDeletionCount: d
		};
	}
	async getOldestCreatedAt(e) {
		return e ? (await this.db.postHistory.where("[pubkeyHex+createdAt]").between([e, h.minKey], [e, h.maxKey]).filter(Q).first())?.createdAt ?? null : null;
	}
	async markDeleted(e, t, n = this.now()) {
		let r = null;
		await this.db.transaction("rw", this.db.events, this.db.postHistory, async () => {
			let i = await O(this.db, "postHistory").get(e);
			!i || i.deletedAt === n && i.deletionEventId === t || (await O(this.db, "postHistory").put({
				...i,
				deletedAt: n,
				deletionEventId: t,
				updatedAt: this.now()
			}), r = i.pubkeyHex);
		}), r && U(r);
	}
	async deleteForPubkey(e) {
		e && await this.db.transaction("rw", [
			this.db.events,
			this.db.postHistory,
			...Mt(this.db)
		], async () => (await new G(this.db, this.now).clearForPubkey(e), this.db.postHistory.where("pubkeyHex").equals(e).delete())) > 0 && U(e);
	}
	async deleteLocalHistoryForPubkey(e) {
		if (!e) return;
		let { deletedPostHistoryCount: t, deletedPayloadCount: n } = await Pt(this.db, e, this.now);
		(t > 0 || n > 0) && U(e);
	}
}();
export { A as $, $e as A, We as B, R as C, Qe as D, nt as E, qe as F, Be as G, Ue as H, Je as I, Ie as J, Re as K, I as L, rt as M, L as N, tt as O, Ge as P, Me as Q, Ke as R, ut as S, et as T, P as U, F as V, ze as W, M as X, N as Y, j as Z, pt as _, At as a, _e as at, V as b, Et as c, ve as ct, wt as d, ce as dt, De as et, xt as f, oe as ft, dt as g, z as h, jt as i, pe as it, it as j, Ze as k, U as l, we as lt, B as m, Lt as n, ye as nt, kt as o, xe as ot, gt as p, ae as pt, Le as q, Nt as r, E as rt, W as s, Ce as st, tn as t, O as tt, Tt as u, le as ut, _t as v, lt as w, ht as x, mt as y, Ye as z };
