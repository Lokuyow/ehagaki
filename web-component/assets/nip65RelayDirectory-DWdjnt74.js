import { d as e, f as t, n, r, t as i } from "./relayConfigUtils-B4Q_AO1M.js";
import { n as a, t as o } from "./nostrHexUtils-C4ICTS7z.js";
import { a as s, d as c, i as l, n as u, o as d, s as f, t as p, u as m } from "./postHistoryEventUtils-CP25bUau.js";
import { C as h, S as g, _, g as v, n as y, o as b, s as x, v as ee, x as te } from "./ehagakiDb-CqVey46a.js";
import { n as ne } from "./tslib.es6-j0rGxSfD.js";
import { a as re, g as ie, n as ae, r as oe, u as se } from "./query-Bp8561W2.js";
import { m as ce, p as le } from "./relayStore.svelte-Df3SPXmc.js";
import { Ot as ue } from "./appUtils-BRia-Jm6.js";
import { c as de } from "./signedEventResultValidator-CnvxVz7l.js";
import { p as fe } from "./clipboardUtils-DL4u_EPs.js";
import { i as pe } from "./reactionValue-28243Fu1.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/lift.js
function me(e) {
	return ie(e?.lift);
}
function he(e) {
	return function(t) {
		if (me(t)) return t.lift(function(t) {
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
function ge(e, t, n, r, i) {
	return new _e(e, t, n, r, i);
}
var _e = function(e) {
	ne(t, e);
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
}(se);
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/map.js
function ve(e, t) {
	return he(function(n, r) {
		var i = 0;
		n.subscribe(ge(r, function(n) {
			r.next(e.call(t, n, i++));
		}));
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/filter.js
function ye(e, t) {
	return he(function(n, r) {
		var i = 0;
		n.subscribe(ge(r, function(n) {
			return e.call(t, n, i++) && r.next(n);
		}));
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryJsonlWorkerVerification.ts
var be = 1e4;
function xe(e) {
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
		), { type: "module" }), n = _({
			worker: t,
			timeout: be,
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
				l = setTimeout(() => u(/* @__PURE__ */ Error("post_history_import_worker_readiness_timeout"), !0), be);
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
				}, s = (e) => o(e), c = setTimeout(() => u(/* @__PURE__ */ Error("post_history_import_worker_verification_timeout"), !0), be);
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
function Se(e = {}) {
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
			let n = xe({
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
function Ce(e = {}) {
	let t = Se(e);
	return {
		ready: t.ready,
		async verify(e) {
			let n = null;
			try {
				f(e) && (n = u(e));
			} catch {}
			if (await t.ready, t.assertActive(), !n) return null;
			let r = await t.verify(n);
			return t.assertActive(), r ? ke(n, "full") : null;
		},
		dispose: t.dispose
	};
}
var S = /* @__PURE__ */ new WeakMap(), C = /* @__PURE__ */ new WeakMap(), we = /* @__PURE__ */ new WeakMap(), Te = /* @__PURE__ */ new WeakMap();
function Ee(e, t = 1024, n = 64) {
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = null, o = 0;
	return {
		verify: async (s) => {
			if (!a || s.pubkey !== a.owner || !a.kinds.includes(s.kind)) return e(s);
			if (!f(s)) return !1;
			let c = u(s), l = w(c);
			if (!l) return !1;
			let d = `1:${l}`, p = o, m;
			if (r.has(d)) r.delete(d), r.set(d, !0), m = !0;
			else {
				let s = i.get(d);
				s || (s = Promise.resolve().then(() => e(c)), i.size < n && i.set(d, s));
				try {
					m = await s;
				} finally {
					i.get(d) === s && i.delete(d);
				}
				if (m && o === p && a) for (r.delete(d), r.set(d, !0); r.size > t;) r.delete(r.keys().next().value);
			}
			return m && w(s) === l;
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
function De(e, t) {
	Te.set(e, t);
}
function Oe(e, t, n) {
	return Te.get(e)?.acquire(t, n) ?? (() => void 0);
}
function w(t) {
	if (!e(t)) return null;
	try {
		let e = ee(t);
		return e === t.id ? `${e}\u0000${t.id}\u0000${t.sig}` : null;
	} catch {
		return null;
	}
}
function ke(e, t) {
	let n = u(e), r = w(n);
	if (!r) return null;
	let i = {};
	return S.set(i, {
		fingerprint: r,
		ruleVersion: 1,
		evidence: t
	}), C.set(n, i), {
		event: n,
		attestation: i
	};
}
function T(e) {
	try {
		if (!f(e)) return null;
		let n = u(e), r = w(n);
		if (!r) return null;
		let i = C.get(e), a = i && S.get(i);
		if ((a?.evidence !== "full" || a.ruleVersion !== 1 || a.fingerprint !== r) && !t(n)) return null;
		let o = {};
		return S.set(o, {
			fingerprint: r,
			ruleVersion: 1,
			evidence: "full"
		}), C.set(n, o), {
			event: n,
			attestation: o
		};
	} catch {
		return null;
	}
}
function E(e, t) {
	let n = t ?? (typeof e == "object" && e ? C.get(e) : void 0);
	if (!n || typeof n != "object") return !1;
	let r = S.get(n);
	return !r || r.ruleVersion !== 1 ? !1 : w(e) === r.fingerprint;
}
function Ae(e) {
	return { use(t, n) {
		return e.use(t, n).pipe(ve((e) => {
			let t = e.event;
			if (!t) return null;
			let n = ke(t, "rx-nostr-signature");
			return n ? {
				...e,
				...n
			} : null;
		}), ye((e) => e !== null));
	} };
}
function je(e) {
	let t = Ae(e);
	return we.set(e, t), t;
}
function Me(e, t, n) {
	return (we.get(e) ?? Ae(e)).use(t, n);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/eventRepository.ts
var Ne = (e) => n.sanitizeExternalRelayUrls(e);
async function Pe(e, t) {
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
		let n = r[t], i = n && d(n.rawEvent, e.event) ? n.rawEvent : e.event, a = e.receivedAt ?? Date.now();
		return {
			id: i.id,
			rawEvent: i,
			verification: e.verification ?? {
				status: "valid",
				ruleVersion: 1
			},
			relayUrls: Ne([...n?.relayUrls ?? [], ...e.relayUrls ?? []]),
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
async function Fe(e, t, n) {
	let r = t, i = r.flatMap((e) => [g(e, n), e.repostTarget?.eventId].filter(Boolean)), a = new Map((await e.events.bulkGet([...new Set(i)])).flatMap((e) => e ? [[e.id, e]] : []));
	return r.map((e) => {
		let t = a.get(g(e, n));
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
function D(e, t) {
	let n = e[t], r = (n) => Fe(e, n, t), i = async (r) => {
		let i = r.map((e) => h(e, t));
		return e.transaction("rw", e.events, n, async () => (await Pe(e, i.flatMap((e) => e.items)), n.bulkPut(i.map((e) => e.metadata))));
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
			let i = h(r, t);
			return e.transaction("rw", e.events, n, async () => (await Pe(e, i.items), n.put(i.metadata)));
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
var Ie = class {
	db;
	constructor(e) {
		this.db = e;
	}
	async get(e) {
		let t = await this.db.events.get(e);
		if (!t || t.deletedAt !== void 0) return t;
		let n = T(t.rawEvent);
		return n ? {
			...t,
			rawEvent: n.event
		} : void 0;
	}
	async save(e, t, n, r) {
		let i = T(e);
		i && n() && await this.db.transaction("rw", this.db.events, async (a) => {
			n() && (await Pe(this.db, [{
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
async function Le(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of te) {
		let r = await e[n].toArray();
		for (let e of r) t.add(g(e, n)), e.repostTarget?.eventId && t.add(e.repostTarget.eventId);
	}
	let n = await e.events.toArray(), r = new Map(n.map((e) => [e.id, e])), i = [...t];
	for (; i.length;) {
		let e = r.get(i.pop());
		for (let n of [...e?.relatedEventIds ?? [], ...e?.deletionEventId ? [e.deletionEventId] : []]) t.has(n) || (t.add(n), i.push(n));
	}
	await e.events.bulkDelete(n.filter((e) => !t.has(e.id) && e.deletedAt === void 0).map((e) => e.id));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryLocalWriteScope.ts
var Re = "global";
async function O(e, t) {
	if (!e.isOpen()) return 0;
	let n = (await e.postHistoryWriteGeneration.get(t))?.value;
	return typeof n == "number" && Number.isSafeInteger(n) ? n : 0;
}
async function ze(e, t) {
	return t.isActive() && await O(e, t.ownerPubkeyHex) === t.expectedRevision && t.isActive();
}
async function k(e, t) {
	if (t && !await ze(e, t)) throw new A();
}
async function Be(e, t, n) {
	let r = await O(e, t);
	await e.postHistoryWriteGeneration.put({
		id: t,
		value: r + 1,
		updatedAt: n
	});
}
function Ve(e) {
	return typeof e == "number" && Number.isSafeInteger(e) && e >= 0 ? e : 0;
}
async function He(e) {
	if (!e.isOpen()) return 0;
	let t = b.currentTransaction;
	if (!t || t.db !== e || !t.storeNames.includes("postHistoryChildWriteGeneration")) return Ue(e);
	let n = (await e.postHistoryChildWriteGeneration.get(Re))?.value;
	return Ve(n);
}
function Ue(e) {
	let t = e.backendDB();
	return t.objectStoreNames.contains("postHistoryChildWriteGeneration") ? new Promise((e, n) => {
		let r = t.transaction("postHistoryChildWriteGeneration", "readonly").objectStore("postHistoryChildWriteGeneration").get(Re);
		r.onsuccess = () => e(Ve(r.result?.value)), r.onerror = () => n(r.error ?? /* @__PURE__ */ Error("child write generation read failed"));
	}) : Promise.resolve(0);
}
async function We(e, t) {
	let n = b.currentTransaction;
	n?.db === e && n.storeNames.includes("postHistoryChildWriteGeneration") ? await Ge(e, t) : await e.transaction("rw", e.postHistoryChildWriteGeneration, async () => {
		await Ge(e, t);
	});
}
async function Ge(e, t) {
	let n = await He(e);
	await e.postHistoryChildWriteGeneration.put({
		id: Re,
		value: n + 1,
		updatedAt: t
	});
}
var A = class extends Error {
	constructor() {
		super("Post history operation is no longer active");
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelayCoverage.ts
function j(e) {
	let t = e.filter((e) => e && Number.isSafeInteger(e.since) && Number.isSafeInteger(e.until) && e.since >= 0 && e.until >= e.since && e.until < 2 ** 53 - 1).map((e) => ({ ...e })).sort((e, t) => e.since - t.since || e.until - t.until), n = [];
	for (let e of t) {
		let t = n.at(-1);
		t && e.since <= t.until + 1 ? t.until = Math.max(t.until, e.until) : n.push(e);
	}
	return n;
}
function Ke(e, t) {
	let n = new Set(t);
	if (!n.size) return [];
	let r = /* @__PURE__ */ new Map();
	for (let t of n) {
		let n = j(e.filter((e) => e.relayUrl === t).flatMap((e) => e.ranges));
		for (let { since: e, until: t } of n) r.set(e, (r.get(e) ?? 0) + 1), r.set(t + 1, (r.get(t + 1) ?? 0) - 1);
	}
	let i = Math.ceil(n.size / 2), a = [], o = 0, s = null;
	for (let [e, t] of [...r].sort(([e], [t]) => e - t)) o += t, o >= i && s === null && (s = e), o < i && s !== null && (a.push({
		since: s,
		until: e - 1
	}), s = null);
	return j(a);
}
function qe(e, t) {
	return j(e).find((e) => e.since <= t && e.until >= t)?.since ?? t;
}
function Je(e) {
	if (e.cancelled) return [];
	let t = e.since ?? e.oldestCreatedAt;
	return t == null ? [] : e.outcomes.flatMap((n) => {
		if (!n.eoseReceived || !n.verificationDrained || n.termination !== "eose" || n.saturated && n.oldestCreatedAt === null) return [];
		let r = j([{
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
var Ye = [
	1,
	6,
	16,
	42,
	1111
], Xe = Ye.join(",");
function Ze(e) {
	return Ye.includes(e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/sensitiveEventUtils.ts
var Qe = 1111;
function $e(e) {
	return e.channel ? 42 : e.hasReply ? e.replyKind === 1 ? 1 : e.replyKind === 7 || e.replyKind === 1111 ? Qe : null : 1;
}
function et(e, t = "") {
	let r = n.sanitizeExternalRelayUrls(t ? [t] : [], { limit: 1 })[0] ?? "";
	if (e.kind === 7) return [
		[
			"E",
			e.id,
			r,
			e.pubkey
		],
		["K", "7"],
		["P", e.pubkey],
		[
			"e",
			e.id,
			r,
			e.pubkey
		],
		["k", "7"],
		["p", e.pubkey]
	];
	if (e.kind !== 1111) return null;
	let i = c(e);
	return !i.valid || !i.rootKind || !i.parentKind ? null : [
		...i.rootTags.map((e) => [...e]),
		["K", i.rootKind],
		...i.rootPubkey ? [["P", i.rootPubkey]] : [],
		[
			"e",
			e.id,
			r,
			e.pubkey
		],
		["k", String(e.kind)],
		["p", e.pubkey]
	];
}
function M(n) {
	try {
		if (!f(n)) return !1;
		let r = u(n);
		return e(r) && t(r);
	} catch {
		return !1;
	}
}
var tt = [
	1,
	42,
	1111
];
function N(e) {
	if (!tt.includes(e.kind) || e.content !== "" || !e.tags.some((e) => e[0] === "content-warning")) return null;
	let t = e.tags.filter((e) => e[0] === "c");
	if (t.length !== 1) return null;
	let n = t[0];
	return !o(n[1]) || n.length > 3 ? null : {
		eventId: n[1],
		relayHint: n[2] || null
	};
}
function nt(e) {
	return N(e) !== null && M(e);
}
function rt(e, t, n, r) {
	return {
		kind: 36,
		pubkey: n,
		created_at: r,
		content: t,
		tags: [["k", String(e)]]
	};
}
function it(e, t, n) {
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
function at(e, t, n = N(e)?.eventId) {
	if (!n || !nt(e) || !t || t.id !== n || t.kind !== 36 || t.pubkey !== e.pubkey || !M(t)) return !1;
	let r = t.tags.filter((e) => e[0] === "k");
	return r.length === 1 && r[0].length >= 2 && r[0][1] === String(e.kind);
}
var ot = /* @__PURE__ */ new Set([
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
function st(e) {
	return ot.has(e);
}
function ct(e) {
	if (!e || e.kind !== 5) return [];
	let t = e.tags.filter((e) => e[0] === "e" && typeof e[1] == "string" && e[1].length > 0).map((e) => e[1]);
	return Array.from(new Set(t));
}
function lt(e, t) {
	return !e || !t || e.kind !== 5 || e.pubkey !== t.pubkey ? !1 : ct(e).includes(t.id);
}
function ut(e, t, n) {
	return `${e}:${t}:${n}`;
}
function dt(e) {
	return e.targetVerified !== !1;
}
function ft(e, t) {
	return e.deletedAt - t.deletedAt || e.deletionEventId.localeCompare(t.deletionEventId);
}
function pt(e) {
	return {
		deletedAt: e.deletedAt * 1e3,
		deletionEventId: e.deletionEventId
	};
}
function mt(e, t = Date.now) {
	let { deletionEvent: r } = e;
	return {
		id: ut(r.pubkey, e.targetEventId, r.id),
		targetAuthorPubkey: r.pubkey,
		targetEventId: e.targetEventId,
		deletionEventId: r.id,
		deletionEventPubkey: r.pubkey,
		targetVerified: e.targetVerified,
		deletedAt: r.created_at,
		reason: r.content.trim() || null,
		rawEvent: p(r),
		relayUrls: n.sanitizeExternalRelayUrls(e.relayUrls ?? []),
		fetchedAt: e.fetchedAt,
		updatedAt: t(),
		schemaVersion: 2
	};
}
function ht(e, t = Date.now) {
	let { deletionEvent: n, targetEvent: r } = e;
	return !n.id || !lt(n, r) ? null : mt({
		deletionEvent: n,
		targetEventId: r.id,
		targetVerified: !0,
		relayUrls: e.relayUrls,
		fetchedAt: e.fetchedAt
	}, t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryMediaUtils.ts
function gt(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.slice(1)) {
		let e = n.indexOf(" ");
		e <= 0 || t.set(n.slice(0, e), n.slice(e + 1));
	}
	let n = t.get("url"), r = n ? de(n) : "";
	if (!r) return null;
	let i = t.get("size"), a = i ? Number(i) : void 0, o = typeof a == "number" && Number.isFinite(a) && a > 0 ? a : void 0;
	return {
		url: r,
		mimeType: t.get("m") || void 0,
		alt: t.get("alt") || void 0,
		blurhash: t.get("blurhash") || void 0,
		dim: t.get("dim") || void 0,
		size: o,
		uploadProtocol: _t(t.get("uploadProtocol"))
	};
}
function _t(e) {
	return e === "blossom" || e === "nip96" || e === "custom-http" ? e : void 0;
}
function vt(e) {
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
	if (t.endsWith(".gif")) return "image/gif";
	if (t.endsWith(".mp4")) return "video/mp4";
	if (t.endsWith(".webm")) return "video/webm";
	if (t.endsWith(".mov")) return "video/quicktime";
}
function yt(e, t) {
	return fe(e).filter((e) => e.isValidHttpUrl).map((e) => e.displayText).map((e) => de(e)).filter((e) => e.length > 0).filter((e) => !t.has(e) && /\.(jpe?g|png|webp|gif|mp4|webm|mov)(?:$|[?#])/i.test(e)).map((e) => ({
		url: e,
		mimeType: vt(e)
	}));
}
function P(e) {
	let t = e.tags.filter((e) => e[0] === "imeta").map(gt).filter((e) => e !== null), n = new Set(t.map((e) => e.url));
	return t.push(...yt(e.content, n)), t;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relatedEventVerification.ts
function bt(e, t) {
	let n = T(e);
	return !n || t && (n.event.id !== t.eventId || t.authorHint && n.event.pubkey !== t.authorHint || t.authorHints?.length && !t.authorHints.includes(n.event.pubkey) || t.targetKindHint != null && n.event.kind !== t.targetKindHint) ? null : n;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postRepostUtils.ts
function F(e) {
	return e === 6 || e === 16;
}
function xt(e) {
	return e === 1 || e === 7 || e === 42 || e === 1111;
}
function St(e, t, n = [
	1,
	7,
	42,
	1111
]) {
	return e === 6 ? t === 1 ? "supported" : "outer-target-kind-mismatch" : t === 1 ? "outer-target-kind-mismatch" : n.includes(t) ? "supported" : "unsupported-target-kind";
}
function Ct(e) {
	let t = {
		status: "invalid-reference",
		reference: null
	};
	if (!F(e.kind)) return t;
	let r = e.tags.filter((e) => e[0] === "e");
	if (r.some((e) => !o(e[1]))) return t;
	let i = new Set(r.map((e) => e[1])), a = e.tags.filter((e) => e[0] === "p");
	if (i.size > 1 || a.some((e) => !o(e[1]))) return t;
	let s = e.kind === 16 ? e.tags.filter((e) => e[0] === "k") : [], c = /* @__PURE__ */ new Set();
	for (let e of s) {
		let n = e[1], r = Number(n);
		if (n === void 0 || !Number.isInteger(r) || r < 0 || r > 65535 || n !== String(r)) return t;
		c.add(r);
	}
	if (c.size > 1) return t;
	if (!r.length) return e.kind === 16 && e.tags.some((e) => e[0] === "a") ? {
		status: "unsupported-reference",
		reference: null
	} : t;
	let l = new Set(a.map((e) => e[1]));
	return {
		status: "valid",
		reference: {
			outerKind: e.kind,
			targetKindHint: [...c][0] ?? null,
			eventId: r[0][1],
			authorHint: l.size === 1 ? a[0][1] : null,
			...l.size > 1 ? { authorHints: [...l] } : {},
			relayHints: n.sanitizeExternalRelayUrls(r.map((e) => e[2] ?? ""))
		}
	};
}
function I(e) {
	return Ct(e).reference;
}
function L(e, t) {
	return bt(e, t);
}
function wt(e, t, n) {
	let r = Ct(e), i = r.reference, a = {
		event: null,
		profile: null,
		relayHints: t?.relayHints ?? []
	};
	if (!i) return {
		...a,
		status: r.status
	};
	if (t?.event && !L(t.event, i)) return {
		...a,
		status: "invalid-target"
	};
	if (t?.event) {
		let e = St(i.outerKind, t.event.kind, n);
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
function Tt(e, t) {
	let n = L(e, t);
	return n && St(t.outerKind, n.event.kind) === "supported" ? n : null;
}
function R(e, t = [], r) {
	let i = r ? Tt(e, r) : L(e);
	return !i || !xt(i.event.kind) ? null : {
		rawEvent: u(i.event),
		rawEventVerification: {
			status: "valid",
			ruleVersion: 1
		},
		relayHints: n.sanitizeExternalRelayUrls(t)
	};
}
function Et(e, t, r, i, a) {
	let o = L(e), s = n.sanitizeExternalRelayUrls([r])[0];
	if (!o || !xt(o.event.kind) || !s) throw Error("invalid_repost_target");
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
function Dt(e, t = []) {
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
		media: P(e),
		...l(e),
		rawEvent: e,
		updatedAt: 0,
		schemaVersion: 2
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryLatestRequest.ts
var Ot = /* @__PURE__ */ new Map();
function kt(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function At(e) {
	let t = kt(e.pubkeyHex);
	t && e.eventId && Ot.set(t, {
		pubkeyHex: t,
		eventId: e.eventId,
		requestedAt: e.requestedAt ?? Date.now()
	});
}
function jt(e) {
	let t = kt(e);
	if (!t) return null;
	let n = Ot.get(t) ?? null;
	return Ot.delete(t), n;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryLocalSearchRevision.ts
var Mt = /* @__PURE__ */ new Map(), Nt = 0;
function Pt(e) {
	return Mt.get(e) ?? 0;
}
function z(e) {
	Mt.set(e, Pt(e) + 1);
}
function Ft() {
	return Nt;
}
function It() {
	Nt += 1;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/arrayEqualityUtils.ts
function B(e, t) {
	let n = e ?? [], r = t ?? [];
	return n.length === r.length && n.every((e, t) => e === r[t]);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryRelayCoverageRepository.ts
var Lt = "postHistoryRelayCoverage:", V = class {
	db;
	now;
	constructor(e = y, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e, t) {
		let r = (await this.db.postHistoryExternalCoverage.get(Rt(e, t)))?.value;
		return {
			schemaVersion: 1,
			ownerPubkeyHex: e,
			kindsKey: t,
			relays: (r?.schemaVersion === 1 && r.ownerPubkeyHex === e && r.kindsKey === t && Array.isArray(r.relays) ? r.relays : []).flatMap((e) => {
				let t = n.sanitizeExternalRelayUrls([e?.relayUrl])[0];
				return t && Array.isArray(e.ranges) ? [{
					relayUrl: t,
					ranges: j(e.ranges)
				}] : [];
			})
		};
	}
	async getLocalRevision(e) {
		return O(this.db, e);
	}
	async isCurrent(e) {
		return ze(this.db, e);
	}
	async record(e) {
		if (!await this.isCurrent(e)) throw new H();
		let t = await this.get(e.ownerPubkeyHex, e.kindsKey), r = /* @__PURE__ */ new Map();
		for (let i of [...t.relays, ...e.relays]) {
			let e = n.sanitizeExternalRelayUrls([i.relayUrl])[0];
			e && r.set(e, [...r.get(e) ?? [], ...i.ranges]);
		}
		let i = {
			...t,
			relays: [...r].map(([e, t]) => ({
				relayUrl: e,
				ranges: j(t)
			})).sort((e, t) => e.relayUrl.localeCompare(t.relayUrl))
		};
		if (!e.isActive()) throw new H();
		JSON.stringify(t) !== JSON.stringify(i) && await this.db.postHistoryExternalCoverage.put({
			id: Rt(e.ownerPubkeyHex, e.kindsKey),
			ownerPubkeyHex: e.ownerPubkeyHex,
			value: i,
			updatedAt: this.now()
		});
	}
	async clearForPubkey(e) {
		await this.db.postHistoryExternalCoverage.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryCitrineRanges.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryLocalBrowsingRanges.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryLocalResumeCursor.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryJumpAnchors.delete(e), await Be(this.db, e, this.now());
	}
};
function Rt(e, t) {
	return `${Lt}${e}:${t}`;
}
var H = class extends A {}, zt = new V();
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/sensitivePayloadDeletionReconciler.ts
async function Bt(e, t = y, n = Date.now) {
	let r = await D(t, "postHistory").get(e);
	if (!r || !s(r.rawEvent, r)) return !1;
	let i = r.rawEvent, a = N(i);
	if (!a || !M(i)) return !1;
	let o = await D(t, "sensitivePayloads").get(a.eventId);
	if (!o || o.deletedAt !== void 0 || o.pubkeyHex !== i.pubkey || !at(i, o.rawEvent, a.eventId)) return !1;
	let c = !1;
	return await t.transaction("rw", t.events, t.postHistory, t.sensitivePayloads, t.postHistoryDeletionRequests, async () => {
		let r = await D(t, "postHistory").get(e), i = await D(t, "sensitivePayloads").get(a.eventId);
		if (!r || !s(r.rawEvent, r) || !M(r.rawEvent) || !i || i.deletedAt !== void 0 || i.pubkeyHex !== r.pubkeyHex || !at(r.rawEvent, i.rawEvent, a.eventId)) return;
		let o = (await t.postHistoryDeletionRequests.where("targetEventId").equals(a.eventId).toArray().then((e) => D(t, "postHistoryDeletionRequests").hydrate(e))).filter((e) => {
			if (e.targetAuthorPubkey !== r.pubkeyHex || e.deletionEventPubkey !== r.pubkeyHex || e.rawEventVerification?.status !== "valid" || e.rawEventVerification.ruleVersion !== 1) return !1;
			let t = e.rawEvent;
			return M(t) && lt(t, {
				id: i.id,
				pubkey: i.pubkeyHex
			});
		}).sort(ft);
		if (o.length === 0) return;
		let l = o[0];
		for (let e of o) e.targetVerified !== !0 && await D(t, "postHistoryDeletionRequests").put({
			...e,
			targetVerified: !0,
			updatedAt: n(),
			schemaVersion: 2
		});
		await D(t, "sensitivePayloads").put({
			...i,
			...pt(l),
			updatedAt: n()
		}), c = !0;
	}), c && z(i.pubkey), c;
}
async function Vt(e, t = y, n = Date.now) {
	let r = await D(t, "sensitivePayloads").get(e);
	if (!r || r.deletedAt !== void 0) return;
	let i = await t.postHistoryDeletionRequests.where("targetEventId").equals(e).toArray().then((e) => D(t, "postHistoryDeletionRequests").hydrate(e)), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
	for (let t of i) {
		if (t.rawEventVerification?.status !== "valid" || t.rawEventVerification.ruleVersion !== 1) continue;
		let n = t.rawEvent;
		if (M(n) && n.kind === 5) {
			o.add(n.pubkey);
			for (let t of n.tags) t[0] === "e" && t[1] && t[1] !== e && a.add(t[1]);
		}
	}
	for (let n of o) {
		let r = await t.postHistory.where("pubkeyHex").equals(n).toArray().then((e) => D(t, "postHistory").hydrate(e));
		for (let t of r) s(t.rawEvent, t) && N(t.rawEvent)?.eventId === e && a.add(t.eventId);
	}
	for (let e of a) await Bt(e, t, n);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryPersistenceCoordinator.ts
function Ht(e) {
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
function Ut(e) {
	return [
		e.postHistoryExternalCoverage,
		e.postHistoryCitrineRanges,
		e.postHistoryLocalBrowsingRanges,
		e.postHistoryLocalResumeCursor,
		e.postHistoryWriteGeneration
	];
}
async function Wt(e, t, n) {
	let r = 0, i = 0;
	return await e.transaction("rw", [
		e.postHistory,
		e.events,
		e.notifications,
		e.postHistoryDeletionRequests,
		e.postHistoryChildInteractions,
		e.sensitivePayloads,
		...Ht(e)
	], async () => {
		await new V(e, n).clearForPubkey(t), await We(e, n()), i = await e.sensitivePayloads.where("pubkeyHex").equals(t).delete();
		let a = (await e.postHistory.where("pubkeyHex").equals(t).primaryKeys()).map(String);
		a.length > 0 && await e.postHistoryChildInteractions.where("parentEventId").anyOf(a).delete(), r = await e.postHistory.where("pubkeyHex").equals(t).delete(), await Le(e);
	}), {
		deletedPostHistoryCount: r,
		deletedPayloadCount: i
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryLocalBrowsingRangesRepository.ts
var Gt = "postHistoryLocalBrowsingRanges:", Kt = class {
	db;
	now;
	constructor(e = y, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e, t, n) {
		let r = ue(n) ?? "", i = await O(this.db, e), a = {
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
			browsingRanges: j(Array.isArray(l.browsingRanges) ? l.browsingRanges : []),
			resumeHint: typeof u == "number" && Number.isSafeInteger(u) && u >= 0 ? { nextUntil: u } : null
		};
	}
	async record(e) {
		await k(this.db, e);
		let t = ue(e.localRelayUrl);
		if (!t) throw Error("Invalid local browsing URL");
		let n = await this.get(e.ownerPubkeyHex, e.kindsKey, t), r = e.resumeHint?.nextUntil, i = n.resumeHint;
		typeof r == "number" && Number.isSafeInteger(r) && r >= 0 && (!e.initializeResumeHintOnly || !i) && (i = { nextUntil: i ? Math.min(i.nextUntil, r) : r });
		let a = {
			...n,
			browsingRanges: j([...n.browsingRanges, ...e.browsingRanges]),
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
		await k(this.db, e);
	}
	key(e, t, n) {
		return `${Gt}${e}:${t}:${encodeURIComponent(n)}`;
	}
}, qt = new Kt(), Jt = {
	status: "valid",
	ruleVersion: 1
};
function Yt(e) {
	return e?.status === "valid" && e.ruleVersion === 1;
}
function Xt(e, t) {
	return E(e, t) ? {
		event: e,
		attestation: t
	} : T(e);
}
function Zt(e) {
	return e.map((e) => ({ ...e }));
}
function Qt(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 1;
}
function $t(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 50;
}
function U(e) {
	return Number.isFinite(e) ? Math.trunc(e ?? 0) : null;
}
function W(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 50;
}
function en(e) {
	return Number.isFinite(e) ? Math.trunc(e) : 0;
}
function tn(e) {
	return { contiguous: e?.contiguous !== !1 };
}
function G(e, t) {
	return e.postedAt === t.postedAt ? e.createdAt === t.createdAt ? x(t.eventId, e.eventId) : t.createdAt - e.createdAt : t.postedAt - e.postedAt;
}
function nn(e, t) {
	return G(e, t) > 0;
}
function rn(e, t) {
	return G(e, t) < 0;
}
function an(e) {
	return e.sort(G);
}
function K(e, t) {
	return [
		e,
		t.postedAt,
		t.createdAt,
		t.eventId
	];
}
function q(e) {
	return {
		lower: [e],
		upper: [e, b.maxKey]
	};
}
function J(e) {
	return Ze(e.kind);
}
function Y(e, t) {
	return J(e) && (t === null || e.createdAt >= t);
}
function on(e) {
	return Math.max(0, e * 1e3);
}
function sn(e, t) {
	let r = t(), i = e.event, a = n.sanitizeExternalRelayUrls(e.acceptedRelays), o = n.sanitizeExternalRelayUrls([...e.relayHints ?? [], ...a], { limit: 3 }), s = l(i);
	return {
		id: i.id,
		eventId: i.id,
		pubkeyHex: i.pubkey,
		kind: i.kind,
		content: i.content,
		tags: i.tags.map((e) => [...e]),
		createdAt: i.created_at,
		postedAt: e.postedAt ?? r,
		relayHints: o,
		acceptedRelays: a,
		media: F(i.kind) ? [] : P(i),
		rawEvent: p(i),
		rawEventVerification: { ...Jt },
		...s.channelEventId ? { channelEventId: s.channelEventId } : {},
		...s.channelRelayHints ? { channelRelayHints: s.channelRelayHints } : {},
		updatedAt: r,
		schemaVersion: 2
	};
}
function cn(e, t) {
	let r = /* @__PURE__ */ new Map();
	for (let i of e) {
		if (!i?.event?.id || !i.event.pubkey) continue;
		let e = n.sanitizeExternalRelayUrls(i.relayUrls), a = r.get(i.event.id);
		a ? d(a.event, i.event) ? (a.relayUrls = n.sanitizeExternalRelayUrls([...a.relayUrls, ...e]), !a.attestation && i.attestation && (a.attestation = i.attestation)) : t.warn("post_history_fetched_event_conflict", i.event.id) : r.set(i.event.id, {
			event: i.event,
			...i.attestation ? { attestation: i.attestation } : {},
			relayUrls: e
		});
	}
	return Array.from(r.values());
}
async function ln(e, t) {
	if (t.length === 0) return /* @__PURE__ */ new Map();
	let n = await e.postHistoryDeletionRequests.where("targetEventId").anyOf(t).toArray().then((t) => D(e, "postHistoryDeletionRequests").hydrate(t)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = r.get(e.targetEventId);
		t ? t.push(e) : r.set(e.targetEventId, [e]);
	}
	return r;
}
function un(e, t) {
	return e.length === t.length && e.every((e, n) => {
		let r = t[n];
		return e.url === r.url && e.mimeType === r.mimeType && e.alt === r.alt && e.blurhash === r.blurhash && e.dim === r.dim && e.size === r.size && e.uploadProtocol === r.uploadProtocol;
	});
}
function dn(e, t) {
	return e.kind !== t.kind || e.content !== t.content || e.createdAt !== t.createdAt || e.postedAt !== t.postedAt || e.deletedAt !== t.deletedAt || e.deletionEventId !== t.deletionEventId || e.channelEventId !== t.channelEventId || !d(e.rawEvent, t.rawEvent) || e.rawEventVerification?.status !== t.rawEventVerification?.status || e.rawEventVerification?.ruleVersion !== t.rawEventVerification?.ruleVersion || !B(e.relayHints, t.relayHints) || !B(e.acceptedRelays, t.acceptedRelays) || !B(e.fetchedRelays, t.fetchedRelays) || !B(e.channelRelayHints, t.channelRelayHints) || !un(e.media, t.media) || e.tags.length !== t.tags.length || e.tags.some((e, n) => !B(e, t.tags[n]));
}
var fn = new class {
	db;
	now;
	console;
	constructor(e = y, t = Date.now, n = globalThis.console === void 0 ? {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	} : globalThis.console) {
		this.db = e, this.now = t, this.console = n;
	}
	async getByEventId(e) {
		if (!e) return null;
		let t = await D(this.db, "postHistory").get(e);
		return t && J(t) ? t : null;
	}
	async findRepostTargetSnapshot(e, t) {
		if (!e || !t) return null;
		let n = await this.db.postHistory.where("pubkeyHex").equals(e).filter((e) => {
			let n = e.repostTarget;
			return F(e.kind) && (n?.eventId ?? n?.rawEvent?.id) === t;
		}).first();
		if (!n) return null;
		let [r] = await D(this.db, "postHistory").hydrate([n]);
		return r.repostTarget ?? null;
	}
	async getExistingEventIdsForPubkey(e) {
		if (!e.pubkeyHex || e.eventIds.length === 0) return [];
		let t = Array.from(new Set(e.eventIds.filter((e) => !!e)));
		return (await D(this.db, "postHistory").bulkGet(t)).filter((t) => !!t && J(t) && t.pubkeyHex === e.pubkeyHex).map((e) => e.eventId);
	}
	async getAll(e) {
		return e.pubkeyHex ? an((await this.db.postHistory.where("[pubkeyHex+postedAt]").between([e.pubkeyHex, b.minKey], [e.pubkeyHex, b.maxKey]).reverse().toArray().then((e) => D(this.db, "postHistory").hydrate(e))).filter(J)) : [];
	}
	async getSearchScanChunk(e) {
		if (!e.pubkeyHex) return {
			items: [],
			nextCursor: null,
			hasMore: !1
		};
		let t = W(e.limit), n = q(e.pubkeyHex), r = e.cursor ? K(e.pubkeyHex, e.cursor) : n.upper, i = await this.db.postHistory.where(v).between(n.lower, r, !0, !e.cursor).reverse().limit(t).toArray().then((e) => D(this.db, "postHistory").hydrate(e)), a = i.at(-1);
		return {
			items: i.filter(J),
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
		let t = Qt(e.page), n = $t(e.pageSize), r = q(e.pubkeyHex);
		return this.db.postHistory.where(v).between(r.lower, r.upper).reverse().filter(J).offset((t - 1) * n).limit(n).toArray().then((e) => D(this.db, "postHistory").hydrate(e));
	}
	async getLatestVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = W(e.limit), n = U(e.visibleUntil), r = q(e.pubkeyHex);
		return this.db.postHistory.where(v).between(r.lower, r.upper).reverse().filter((e) => Y(e, n)).limit(t).toArray().then((e) => D(this.db, "postHistory").hydrate(e));
	}
	async getOlderVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = W(e.limit), n = U(e.visibleUntil), r = q(e.pubkeyHex), i = K(e.pubkeyHex, e.cursor);
		return this.db.postHistory.where(v).between(r.lower, i, !0, !1).reverse().filter((e) => Y(e, n)).limit(t).toArray().then((e) => D(this.db, "postHistory").hydrate(e));
	}
	async hasOlderVisiblePosts(e) {
		if (!e.pubkeyHex) return !1;
		let t = U(e.visibleUntil), n = this.db.postHistory.where(v).between(q(e.pubkeyHex).lower, K(e.pubkeyHex, e.cursor), !0, !1), r = n;
		if (t !== null) {
			let i = this.db.postHistory.where("[pubkeyHex+createdAt]").between([e.pubkeyHex, t], [e.pubkeyHex, b.maxKey]), [a, o] = await Promise.all([n.count(), i.count()]);
			if (a === 0 || o === 0) return !1;
			r = o <= a ? i : n;
		}
		return await r.filter((n) => Y(n, t) && nn(n, e.cursor)).first() !== void 0;
	}
	async getNewerVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = W(e.limit), n = U(e.visibleUntil), r = q(e.pubkeyHex), i = K(e.pubkeyHex, e.cursor);
		return (await this.db.postHistory.where(v).between(i, r.upper, !1, !0).filter((e) => Y(e, n)).limit(t).toArray().then((e) => D(this.db, "postHistory").hydrate(e))).reverse();
	}
	async getOldestVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = W(e.limit), n = tn(e.query).contiguous ? U(e.visibleUntil) : null, r = q(e.pubkeyHex);
		return n === null ? (await this.db.postHistory.where(v).between(r.lower, r.upper).filter(J).limit(t).toArray().then((e) => D(this.db, "postHistory").hydrate(e))).reverse() : (await this.db.postHistory.where("[pubkeyHex+createdAt]").between([e.pubkeyHex, n], [e.pubkeyHex, b.maxKey]).toArray().then((e) => D(this.db, "postHistory").hydrate(e))).filter(J).sort(G).slice(-t);
	}
	async getVisibleChunkFromCreatedAt(e) {
		if (!e.pubkeyHex) return [];
		let t = W(e.limit), n = en(e.createdAt), r = tn(e.query).contiguous ? U(e.visibleUntil) : null, i = q(e.pubkeyHex);
		return this.db.transaction("r", this.db.events, this.db.postHistory, async () => {
			let a = await this.db.postHistory.where(v).between(i.lower, i.upper).reverse().filter((e) => Y(e, r) && e.createdAt <= n).first().then(async (e) => e ? (await D(this.db, "postHistory").hydrate([e]))[0] : void 0);
			return a ? t === 1 ? [a] : [a, ...await this.db.postHistory.where(v).between(i.lower, K(e.pubkeyHex, a), !0, !1).reverse().filter((e) => Y(e, r)).limit(t - 1).toArray().then((e) => D(this.db, "postHistory").hydrate(e))] : (await this.db.postHistory.where(v).between(i.lower, i.upper).filter((e) => Y(e, r)).limit(t).toArray().then((e) => D(this.db, "postHistory").hydrate(e))).reverse();
		});
	}
	async getVisibleChunkAroundEventId(e) {
		if (!e.pubkeyHex) return [];
		let t = W(e.limit), n = Number.isFinite(e.keepAbove) ? Math.min(t - 1, Math.max(0, Math.trunc(e.keepAbove ?? 0))) : 0, r = U(e.visibleUntil), i = q(e.pubkeyHex);
		return this.db.transaction("r", this.db.events, this.db.postHistory, async () => {
			let a = await D(this.db, "postHistory").get(e.eventId);
			if (!a || a.pubkeyHex !== e.pubkeyHex || !Y(a, r)) return [];
			let o = K(e.pubkeyHex, a), s = n === 0 ? [] : await this.db.postHistory.where(v).between(o, i.upper, !1, !0).filter((e) => Y(e, r)).limit(n).toArray().then((e) => D(this.db, "postHistory").hydrate(e)), c = t - 1 - s.length, l = c === 0 ? [] : await this.db.postHistory.where(v).between(i.lower, o, !0, !1).reverse().filter((e) => Y(e, r)).limit(c).toArray().then((e) => D(this.db, "postHistory").hydrate(e)), u = t - 1 - s.length - l.length;
			if (u > 0) {
				let t = s[s.length - 1] ?? a, n = await this.db.postHistory.where(v).between(K(e.pubkeyHex, t), i.upper, !1, !0).filter((e) => Y(e, r)).limit(u).toArray().then((e) => D(this.db, "postHistory").hydrate(e));
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
		return !e || !Number.isFinite(t) ? !1 : await this.db.postHistory.where("[pubkeyHex+createdAt]").between([e, b.minKey], [e, Math.trunc(t)], !0, !1).filter(J).limit(1).count() > 0;
	}
	async getSparseChunk(e) {
		if (!e.pubkeyHex || !Number.isFinite(e.visibleUntil)) return [];
		let t = W(e.limit), n = Math.trunc(e.visibleUntil);
		if (e.direction !== "latest" && !e.cursor) return [];
		let r = e.cursor, i = (t) => J(t) && t.createdAt < n && (e.direction === "latest" || e.direction === "older" && !!r && nn(t, r) || e.direction === "newer" && !!r && rn(t, r)), a = q(e.pubkeyHex), o = r ? K(e.pubkeyHex, r) : null, s = e.direction === "latest" ? this.db.postHistory.where(v).between(a.lower, a.upper) : e.direction === "older" ? this.db.postHistory.where(v).between(a.lower, o, !0, !1) : this.db.postHistory.where(v).between(o, a.upper, !1, !0), c = await (e.direction === "newer" ? s : s.reverse()).filter(i).limit(t).toArray().then((e) => D(this.db, "postHistory").hydrate(e));
		return e.direction === "newer" ? c.reverse() : c;
	}
	async countForPubkey(e) {
		return e ? this.db.postHistory.where("pubkeyHex").equals(e).filter(J).count() : 0;
	}
	async countVisibleForPubkey(e, t) {
		if (!e) return 0;
		let n = U(t);
		return n === null ? this.countForPubkey(e) : this.db.postHistory.where("[pubkeyHex+createdAt]").between([e, n], [e, b.maxKey]).filter(J).count();
	}
	async putPostedEvent(e) {
		let t = Xt(e.event, e.attestation);
		if (!t) throw Error("invalid_post_history_raw_event");
		let n = I(t.event), r = e.repostTarget ? n && R(e.repostTarget.event, e.repostTarget.relayHints, n) : null;
		if (e.repostTarget && !r) throw Error("invalid_repost_target");
		if (e.localWriteScope && e.localWriteScope.ownerPubkeyHex !== t.event.pubkey) throw Error("invalid_post_history_owner");
		await this.db.transaction("rw", this.db.events, this.db.postHistory, this.db.postHistoryWriteGeneration, async () => {
			await k(this.db, e.localWriteScope);
			let i = await D(this.db, "postHistory").get(t.event.id);
			await D(this.db, "postHistory").put({
				...sn({
					...e,
					event: t.event
				}, this.now),
				...F(t.event.kind) && i ? {
					postedAt: i.postedAt,
					fetchedRelays: i.fetchedRelays,
					deletedAt: i.deletedAt,
					deletionEventId: i.deletionEventId
				} : {},
				...r ? { repostTarget: r } : i?.repostTarget && n && R(i.repostTarget.rawEvent, i.repostTarget.relayHints, n) ? { repostTarget: i.repostTarget } : {}
			}), await k(this.db, e.localWriteScope);
		}), z(t.event.pubkey), At({
			pubkeyHex: t.event.pubkey,
			eventId: t.event.id
		});
	}
	async attachRepostTarget(e) {
		let t = !1;
		return await this.db.transaction("rw", this.db.events, this.db.postHistory, this.db.postHistoryWriteGeneration, async () => {
			await k(this.db, e.localWriteScope);
			let n = await D(this.db, "postHistory").get(e.outerEventId);
			if (!n || n.pubkeyHex !== e.localWriteScope.ownerPubkeyHex || n.deletedAt !== void 0 || !s(n.rawEvent, n) || !T(n.rawEvent)) return;
			let r = I(n);
			if (!r) return;
			let i = R(e.target, e.relayHints, r);
			if (!i) throw Error("invalid_repost_target");
			n.repostTarget && d(n.repostTarget.rawEvent, i.rawEvent) && B(n.repostTarget.relayHints, i.relayHints) || (await D(this.db, "postHistory").update(n.id, {
				repostTarget: i,
				updatedAt: this.now()
			}), await k(this.db, e.localWriteScope), t = !0);
		}), t && z(e.localWriteScope.ownerPubkeyHex), t;
	}
	async upsertFetchedEvents(e) {
		let t = cn(e.events, this.console).flatMap((e) => {
			let t = Xt(e.event, e.attestation);
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
		let r = e.fetchedAt ?? this.now(), i = t.map((e) => e.event.id), a = 0, o = 0, s = 0, c = 0, u = /* @__PURE__ */ new Set(), f = new V(this.db, this.now);
		try {
			await this.db.transaction("rw", [
				this.db.events,
				this.db.postHistory,
				this.db.postHistoryDeletionRequests,
				this.db.sensitivePayloads,
				...e.relayFetchCoverage || e.localWriteScope || e.localBrowsingWrite ? Ht(this.db) : []
			], async () => {
				if (await k(this.db, e.localWriteScope), await k(this.db, e.localBrowsingWrite), e.relayFetchCoverage && !await f.isCurrent(e.relayFetchCoverage)) throw new H();
				let m = await D(this.db, "postHistory").bulkGet(i), h = /* @__PURE__ */ new Map(), g = await ln(this.db, i);
				m.forEach((e) => {
					e && h.set(e.eventId, e);
				});
				let _ = [], v = t.map((e) => {
					let t = h.get(e.event.id), i = n.sanitizeExternalRelayUrls([...t?.fetchedRelays ?? [], ...e.relayUrls]), f = !!t && !d(t.rawEvent, e.event), m = !t || !f || !Yt(t.rawEventVerification);
					f && this.console.warn("post_history_raw_event_conflict", e.event.id);
					let v = !m && t ? {
						channelEventId: t.channelEventId,
						channelRelayHints: t.channelRelayHints
					} : l(e.event), y = n.sanitizeExternalRelayUrls([
						...t?.relayHints ?? [],
						...e.relayUrls,
						...t?.acceptedRelays ?? []
					], { limit: n.EXTERNAL_INPUT_RELAY_LIMIT }), b = {
						id: e.event.id,
						eventId: e.event.id,
						pubkeyHex: t?.pubkeyHex ?? e.event.pubkey,
						kind: !m && t ? t.kind : e.event.kind,
						content: !m && t ? t.content : e.event.content,
						tags: !m && t ? t.tags.map((e) => [...e]) : e.event.tags.map((e) => [...e]),
						createdAt: !m && t ? t.createdAt : e.event.created_at,
						postedAt: t?.postedAt ?? on(e.event.created_at),
						relayHints: y,
						acceptedRelays: t?.acceptedRelays ?? [],
						...i.length > 0 ? { fetchedRelays: i } : {},
						media: F(e.event.kind) ? [] : !m && t ? Zt(t.media) : P(e.event),
						rawEvent: !m && t ? t.rawEvent : p(e.event),
						rawEventVerification: !m && t ? t.rawEventVerification : { ...Jt },
						fetchedAt: r,
						lastSeenAt: r,
						...v.channelEventId ? { channelEventId: v.channelEventId } : t?.channelEventId ? { channelEventId: t.channelEventId } : {},
						...v.channelRelayHints ? { channelRelayHints: v.channelRelayHints } : t?.channelRelayHints ? { channelRelayHints: [...t.channelRelayHints] } : {},
						...t?.deletedAt === void 0 ? {} : { deletedAt: t.deletedAt },
						...t?.deletionEventId ? { deletionEventId: t.deletionEventId } : {},
						updatedAt: this.now(),
						...t?.repostTarget && I(e.event) && R(t.repostTarget.rawEvent, t.repostTarget.relayHints, I(e.event)) ? { repostTarget: t.repostTarget } : {},
						schemaVersion: 2
					}, x = !1;
					t ? dn(t, b) ? (o += 1, x = !0) : s += 1 : (a += 1, x = !0);
					let ee = (g.get(e.event.id) ?? []).flatMap((e) => {
						if (!(st(b.kind) && b.pubkeyHex === e.targetAuthorPubkey && b.pubkeyHex === e.deletionEventPubkey)) return [];
						if (!dt(e)) {
							let t = {
								...e,
								targetVerified: !0,
								updatedAt: this.now(),
								schemaVersion: 2
							};
							return _.push(t), [t];
						}
						return [e];
					}).sort(ft);
					return b.deletedAt !== void 0 || ee.length === 0 ? (x && u.add(b.pubkeyHex), b) : (c += 1, u.add(b.pubkeyHex), {
						...b,
						...pt(ee[0]),
						updatedAt: this.now()
					});
				});
				if (_.length > 0 && await D(this.db, "postHistoryDeletionRequests").bulkPut(_), await D(this.db, "postHistory").bulkPut(v), e.relayFetchCoverage && (await f.record(e.relayFetchCoverage), !await f.isCurrent(e.relayFetchCoverage))) throw new H();
				e.localBrowsingWrite && await new Kt(this.db, this.now).record(e.localBrowsingWrite), await k(this.db, e.localWriteScope);
			});
		} catch (e) {
			if (e instanceof A) return {
				insertedCount: 0,
				updatedCount: 0,
				unchangedCount: 0,
				appliedDeletionCount: 0,
				applied: !1
			};
			throw e;
		}
		u.forEach(z);
		for (let e of t) N(e.event) && Bt(e.event.id, this.db, this.now).catch(() => {
			this.console.warn("post_history_sensitive_payload_deletion_reconcile_failed", e.event.id);
		});
		return {
			insertedCount: a,
			updatedCount: o,
			unchangedCount: s,
			appliedDeletionCount: c
		};
	}
	async getOldestCreatedAt(e) {
		return e ? (await this.db.postHistory.where("[pubkeyHex+createdAt]").between([e, b.minKey], [e, b.maxKey]).filter(J).first())?.createdAt ?? null : null;
	}
	async markDeleted(e, t, n = this.now()) {
		let r = null;
		await this.db.transaction("rw", this.db.events, this.db.postHistory, async () => {
			let i = await D(this.db, "postHistory").get(e);
			!i || i.deletedAt === n && i.deletionEventId === t || (await D(this.db, "postHistory").put({
				...i,
				deletedAt: n,
				deletionEventId: t,
				updatedAt: this.now()
			}), r = i.pubkeyHex);
		}), r && z(r);
	}
	async deleteForPubkey(e) {
		e && await this.db.transaction("rw", [
			this.db.events,
			this.db.postHistory,
			...Ht(this.db)
		], async () => (await new V(this.db, this.now).clearForPubkey(e), this.db.postHistory.where("pubkeyHex").equals(e).delete())) > 0 && z(e);
	}
	async deleteLocalHistoryForPubkey(e) {
		if (!e) return;
		let { deletedPostHistoryCount: t, deletedPayloadCount: n } = await Wt(this.db, e, this.now);
		(t > 0 || n > 0) && z(e);
	}
}();
function pn(e) {
	if (e.kind !== 36) return !1;
	let t = e.tags.filter((e) => e[0] === "k");
	return t.length === 1 && t[0].length >= 2 && tt.some((e) => t[0][1] === String(e));
}
var mn = new class {
	db;
	now;
	constructor(e = y, t = Date.now) {
		this.db = e, this.now = t;
	}
	async putCandidate(e) {
		let t = E(e.event, e.attestation) ? u(e.event) : T(e.event)?.event;
		if (!t || !pn(t)) throw Error("invalid_sensitive_payload_candidate");
		await this.db.transaction("rw", [
			this.db.events,
			this.db.sensitivePayloads,
			...e.localWriteScope ? [this.db.postHistoryWriteGeneration] : []
		], async () => {
			await k(this.db, e.localWriteScope);
			let r = await D(this.db, "sensitivePayloads").get(t.id);
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
			return await D(this.db, "sensitivePayloads").put(i), await k(this.db, e.localWriteScope), !0;
		}) && (z(t.pubkey), await Vt(t.id, this.db, this.now));
	}
	async getByIds(e) {
		let t = [...new Set(e.filter((e) => a(e)))];
		if (t.length === 0) return [];
		let n = await this.db.sensitivePayloads.where("id").anyOf(t).toArray().then((e) => D(this.db, "sensitivePayloads").hydrate(e)), r = new Set(n.map((e) => e.id)), i = t.filter((e) => !r.has(e)), o = i.length ? await this.db.events.bulkGet(i) : [];
		for (let e of o) e && pn(e.rawEvent) && n.push({
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
		return n;
	}
	async getAllForPubkey(e) {
		return this.db.sensitivePayloads.where("pubkeyHex").equals(e).toArray().then((e) => D(this.db, "sensitivePayloads").hydrate(e));
	}
	async markDeleted(e) {
		let t = await D(this.db, "sensitivePayloads").get(e.id);
		t && t.pubkeyHex === e.pubkeyHex && (await D(this.db, "sensitivePayloads").put({
			...t,
			deletedAt: e.deletedAt,
			deletionEventId: e.deletionEventId,
			updatedAt: this.now()
		}), z(t.pubkeyHex));
	}
	async deleteCandidatesForPubkey(e) {
		await this.db.sensitivePayloads.where("pubkeyHex").equals(e).delete() > 0 && z(e);
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/reactionReference.ts
function X(e) {
	let t = {
		status: "invalid-reference",
		reference: null
	};
	if (e.kind !== 7) return t;
	let r = e.tags.filter((e) => e[0] === "e").at(-1);
	if (!r) return e.tags.some((e) => e[0] === "a") ? {
		status: "unsupported-reference",
		reference: null
	} : t;
	if (!o(r[1])) return t;
	let i = r[3], a = i?.trim().toLowerCase(), s = o(i) ? i : (a === "root" || a === "reply" || a === "mention") && r[4] || null;
	if (i && !o(i) && ![
		"root",
		"reply",
		"mention"
	].includes(a ?? "") || s && !o(s)) return t;
	let c = e.tags.filter((e) => e[0] === "p").at(-1);
	if (c && !o(c[1])) return t;
	let l = c?.[1] ?? null;
	if (s && l && s !== l) return t;
	let u = /* @__PURE__ */ new Set();
	for (let n of e.tags.filter((e) => e[0] === "k")) {
		let e = Number(n[1]);
		if (n[1] === void 0 || !Number.isInteger(e) || e < 0 || e > 65535 || n[1] !== String(e)) return t;
		u.add(e);
	}
	return u.size > 1 ? t : {
		status: "valid",
		reference: {
			eventId: r[1],
			authorHint: l ?? s,
			targetKindHint: [...u][0] ?? null,
			relayHints: n.sanitizeExternalRelayUrls([r[2] ?? "", c?.[2] ?? ""])
		}
	};
}
function Z(e, t) {
	return e.eventId === t.eventId && (!e.authorHint || t.targetAuthorPubkey == null || e.authorHint === t.targetAuthorPubkey) && (e.targetKindHint == null || t.targetKind == null || e.targetKindHint === t.targetKind);
}
function hn(e) {
	return n.sanitizeExternalRelayUrls(e ?? [], { limit: n.EXTERNAL_INPUT_RELAY_LIMIT });
}
function gn(e) {
	return e.sort((e, t) => e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) : e.createdAt - t.createdAt);
}
function _n(e, t) {
	return e.length === t.length && e.every((e, n) => B(e, t[n]));
}
function vn(e) {
	return e === 1 || e === 7 || e === 42 || e === 1111;
}
function yn(e) {
	return e.kind === 1 || e.kind === 42 || e.kind === 1111 ? m(e).parentId : e.kind === 7 ? X(e).reference?.eventId ?? null : null;
}
function bn(e) {
	if (e.kind === 1 || e.kind === 42 || e.kind === 1111) return m(e).rootId ?? void 0;
}
function xn(e) {
	return e.kind === 7 ? ["reaction"] : ["direct-reply"];
}
function Sn(e) {
	return e.filter((e) => e.kind === 1 || e.kind === 42 || e.kind === 1111);
}
function Cn(e) {
	return e.filter((e) => e.kind === 7);
}
function wn(e, t) {
	return e.parentEventId !== t.parentEventId || e.rootEventId !== t.rootEventId || e.authorPubkey !== t.authorPubkey || e.kind !== t.kind || e.content !== t.content || e.createdAt !== t.createdAt || !B(e.relayUrls, t.relayUrls) || !B(e.discoveredAs, t.discoveredAs) || !_n(e.tags, t.tags) || !d(e.rawEvent, t.rawEvent);
}
var Tn = new class {
	db;
	now;
	console;
	reactionRepairPromise;
	constructor(e = y, t = Date.now, n = globalThis.console === void 0 ? {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	} : globalThis.console) {
		this.db = e, this.now = t, this.console = n;
	}
	ensureSavedReactionsRepaired() {
		return this.reactionRepairPromise ||= this.repairSavedReactions().catch((e) => {
			throw this.reactionRepairPromise = void 0, e;
		}), this.reactionRepairPromise;
	}
	async repairSavedReactions() {
		await this.db.transaction("rw", this.db.events, this.db.postHistoryChildInteractions, this.db.postHistory, async () => {
			let e = await this.db.postHistoryChildInteractions.where("kind").equals(7).toArray().then((e) => D(this.db, "postHistoryChildInteractions").hydrate(e)), t = [], n = [];
			for (let r of e) {
				if (r.id !== r.eventId || !s(r.rawEvent, {
					...r,
					pubkeyHex: r.authorPubkey
				})) {
					n.push(r.id);
					continue;
				}
				let e = T(r.rawEvent), i = e ? X(e.event).reference : null;
				!i || i.eventId === r.eventId ? n.push(r.id) : t.push({
					record: r,
					reference: i
				});
			}
			let r = Array.from(new Set(t.map(({ reference: e }) => e.eventId))), i = await D(this.db, "postHistory").bulkGet(r), a = new Map(i.flatMap((e) => e ? [[e.eventId, e]] : [])), o = [];
			for (let { record: e, reference: r } of t) {
				let t = a.get(r.eventId);
				t && !Z(r, {
					eventId: t.eventId,
					targetAuthorPubkey: t.pubkeyHex,
					targetKind: t.kind
				}) ? n.push(e.id) : e.parentEventId !== r.eventId && o.push({
					...e,
					parentEventId: r.eventId,
					updatedAt: this.now()
				});
			}
			n.length && await this.db.postHistoryChildInteractions.bulkDelete(n), o.length && await D(this.db, "postHistoryChildInteractions").bulkPut(o);
		});
	}
	async filterKnownReactionTargets(e, t) {
		let n = new Map(t.map((e) => [e.eventId, e])), r = [], i = e.filter((e) => {
			let t = n.get(e.parentEventId);
			if (e.kind !== 7 || !t) return !0;
			let i = X(e).reference;
			return i && Z(i, t) ? !0 : (r.push(e.id), !1);
		});
		return r.length && await this.db.postHistoryChildInteractions.bulkDelete(r), i;
	}
	async getChildInteractions(e, t) {
		if (!e) return [];
		await this.ensureSavedReactionsRepaired();
		let n = await this.db.postHistoryChildInteractions.where("[parentEventId+createdAt]").between([e, b.minKey], [e, b.maxKey]).toArray().then((e) => D(this.db, "postHistoryChildInteractions").hydrate(e));
		return gn(t ? await this.filterKnownReactionTargets(n, [t]) : n);
	}
	async getChildInteractionsForParents(e, t) {
		let n = Array.from(new Set(e.filter((e) => !!e)));
		if (n.length === 0) return [];
		await this.ensureSavedReactionsRepaired();
		let r = await this.db.postHistoryChildInteractions.where("parentEventId").anyOf(n).toArray().then((e) => D(this.db, "postHistoryChildInteractions").hydrate(e));
		return t ? this.filterKnownReactionTargets(r, t) : r;
	}
	async getDirectReplyInteractions(e) {
		return Sn(await this.getChildInteractions(e));
	}
	async getReactionInteractions(e) {
		return Cn(await this.getChildInteractions(e));
	}
	async upsertChildInteractions(e) {
		if (!e.parentEventId || e.events.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: e.events.length
		};
		await this.ensureSavedReactionsRepaired();
		let t = e.fetchedAt === void 0 ? this.now() : e.fetchedAt, n = 0, r = /* @__PURE__ */ new Map();
		for (let t of e.events) {
			if (!t?.event?.id || !vn(t.event.kind) || yn(t.event) !== e.parentEventId || t.event.id === e.parentEventId) {
				n += 1;
				continue;
			}
			let i = r.get(t.event.id);
			i && !d(i.event, t.event) ? (this.console.warn("post_history_child_interaction_conflict", t.event.id), n += 1) : r.set(t.event.id, {
				event: t.event,
				relayUrls: hn([...i?.relayUrls ?? [], ...t.relayUrls ?? []])
			});
		}
		let i = Array.from(r.values());
		if (i.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: n
		};
		let a = 0, o = 0, s = 0;
		return await this.db.transaction("rw", this.db.events, this.db.postHistoryChildInteractions, this.db.postHistory, this.db.postHistoryChildWriteGeneration, async () => {
			if (typeof e.expectedChildGeneration == "number" && await He(this.db) !== e.expectedChildGeneration) return;
			let r = i.some((e) => e.event.kind === 7) ? await D(this.db, "postHistory").get(e.parentEventId) : void 0, c = [...e.reactionTarget ? [e.reactionTarget] : [], ...r ? [{
				eventId: r.eventId,
				targetAuthorPubkey: r.pubkeyHex,
				targetKind: r.kind
			}] : []], l = i.filter((e) => {
				if (e.event.kind !== 7) return !0;
				let t = X(e.event).reference;
				return !t || c.some((e) => !Z(t, e)) ? (n += 1, !1) : !0;
			});
			if (l.length === 0) return;
			let u = l.map((e) => e.event.id), d = await D(this.db, "postHistoryChildInteractions").bulkGet(u), f = /* @__PURE__ */ new Map();
			d.forEach((e) => {
				e && f.set(e.eventId, e);
			});
			let m = l.map((n) => {
				let r = f.get(n.event.id), i = hn([...r?.relayUrls ?? [], ...n.relayUrls ?? []]), c = bn(n.event), l = Array.from(/* @__PURE__ */ new Set([...r?.discoveredAs ?? [], ...xn(n.event)])), u = {
					id: n.event.id,
					eventId: n.event.id,
					parentEventId: e.parentEventId,
					...c ? { rootEventId: c } : {},
					authorPubkey: n.event.pubkey,
					kind: n.event.kind,
					content: n.event.content,
					tags: n.event.tags.map((e) => [...e]),
					createdAt: n.event.created_at,
					relayUrls: i,
					discoveredAs: l,
					rawEvent: p(n.event),
					fetchedAt: t ?? r?.fetchedAt ?? 0,
					updatedAt: this.now(),
					schemaVersion: 1
				};
				return r ? wn(r, u) ? o += 1 : s += 1 : a += 1, u;
			});
			await D(this.db, "postHistoryChildInteractions").bulkPut(m);
		}), {
			insertedCount: a,
			updatedCount: o,
			unchangedCount: s,
			ignoredCount: n
		};
	}
	async deleteChildInteractionsForParent(e) {
		e && await this.db.postHistoryChildInteractions.where("parentEventId").equals(e).delete();
	}
	async deleteChildInteractionsForParents(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		t.length !== 0 && await this.db.transaction("rw", this.db.events, this.db.postHistoryChildInteractions, async () => {
			for (let e of t) await this.db.postHistoryChildInteractions.where("parentEventId").equals(e).delete();
		});
	}
	async deleteChildInteractionsForPostHistoryPubkey(e) {
		if (!e) return;
		let t = await this.db.postHistory.where("pubkeyHex").equals(e).primaryKeys();
		await this.deleteChildInteractionsForParents(t.map(String));
	}
	async deleteChildInteractionByEventId(e) {
		e && await this.db.postHistoryChildInteractions.delete(e);
	}
}(), En = [
	1,
	6,
	7,
	16,
	42,
	1111
];
function Dn(e) {
	return En.includes(e);
}
function On(e, t, r, i, a, o) {
	let s = bt(e);
	if (!s || !Dn(s.event.kind)) throw Error("invalid_reaction_target");
	let c = s.event, l = n.sanitizeExternalRelayUrls([...i])[0], u = pe(r), d = [
		[
			"e",
			c.id,
			l ?? "",
			c.pubkey
		],
		l ? [
			"p",
			c.pubkey,
			l
		] : ["p", c.pubkey],
		["k", String(c.kind)]
	];
	u.emojiTag && d.push(u.emojiTag), o && d.push([...o]);
	let f = {
		kind: 7,
		pubkey: t,
		content: u.content,
		tags: d,
		created_at: a
	}, p = X(f).reference;
	if (!p || !Z(p, {
		eventId: c.id,
		targetAuthorPubkey: c.pubkey,
		targetKind: c.kind
	})) throw Error("invalid_reaction_target");
	return f;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/nip65RelayDirectory.ts
var kn = 3e3, An = 3e5, jn = 15e3, Mn = 4;
function Nn(e, t) {
	if (!e || typeof e != "object") return !1;
	let n = e;
	return n.kind === 10002 && n.pubkey === t && o(n.id) && typeof n.created_at == "number" && Number.isSafeInteger(n.created_at) && n.created_at >= 0 && Array.isArray(n.tags);
}
function Q(e, t) {
	return {
		pubkey: e,
		status: t,
		readRelays: [],
		writeRelays: [],
		createdAt: null,
		eventId: null
	};
}
function $(e) {
	return {
		...e,
		readRelays: [...e.readRelays],
		writeRelays: [...e.writeRelays]
	};
}
function Pn(e) {
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
var Fn = class {
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
		let i = n.sanitizeExternalRelayUrls(ce() ? le() : r), a = n.sanitizeExternalRelayUrls([...i, ...t.discoveryRelays ?? []]), o = this.cache.get(e), s = !!o && o.expiresAt > this.now(), c = this.inFlight.get(e);
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
			if (n.length === 0) return Promise.resolve(t.deadlineAt !== void 0 && o.receivedAt >= t.deadlineAt ? Q(e, "network-error") : $(o.entry));
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
				entry: $(n.entry),
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
					entry: $(t),
					receivedAt: t.eventId === a.previous?.entry.eventId ? a.previous.receivedAt : a.candidates.get(t.eventId)?.receivedAt ?? this.now(),
					expiresAt: this.now() + (t.status === "found" ? An : jn),
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
		if (r) return $(r);
		let i = t.completedAt !== void 0 && t.completedAt < n;
		return Q(e, t.hadNetworkError || !i ? "network-error" : "not-found");
	}
	forConsumer(e, t, n) {
		let r = n.deadlineAt ?? Infinity;
		return n.deadlineAt === void 0 && !n.resolveOnReadRoute ? t.promise : r <= this.now() ? Promise.resolve(this.snapshot(e, t, r)) : new Promise((i) => {
			let a = !1, o, s = {}, c, l = () => {
				a || (a = !0, c?.(), n.operation ? o?.unschedule(s) : o?.finish(), t.candidateListeners.delete(u), i(this.snapshot(e, t, r)));
			}, u = () => {
				let n = this.snapshot(e, t, r);
				if (n.readRelays.length === 0) return;
				let i = this.cache.get(e), a = i !== void 0 && i.expiresAt > this.now() && i.entry.eventId === n.eventId, o = n.eventId === null ? void 0 : t.candidates.get(n.eventId), s = o !== void 0 && o.receivedAt < r;
				(a || s) && l();
			};
			n.resolveOnReadRoute && (t.candidateListeners.add(u), u()), !a && Number.isFinite(r) && (o = n.operation ?? new oe(r - this.now(), l, {
				now: this.now,
				setTimeoutFn: this.setTimeoutFn,
				clearTimeoutFn: this.clearTimeoutFn
			}), n.operation && (o.schedule(s, r, l), c = o.add(l))), t.promise.then(l);
		});
	}
	isNewer(e, t) {
		return !t || t.createdAt === null || t.eventId === null ? !0 : e.createdAt === null || e.eventId === null ? !1 : e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) < 0 : e.createdAt > t.createdAt;
	}
	async withConcurrencySlot(e) {
		this.activeLookups >= Mn ? await new Promise((e) => this.queue.push(e)) : this.activeLookups += 1;
		try {
			return await e();
		} finally {
			let e = this.queue.shift();
			e ? e() : --this.activeLookups;
		}
	}
	fetchLatest(e, t, n) {
		return t.length === 0 ? Promise.resolve(Q(e, "network-error")) : new Promise((r) => {
			let i = re(), a, o, s = !1, c, l = () => {
				o?.unsubscribe?.(), o = void 0;
			}, u = (t = !1) => {
				s || (s = !0, l(), r(a || Q(e, t ? "network-error" : "not-found")));
			};
			try {
				let r = ae(this.rxNostr, i, { on: { relays: t } }, {
					timeoutMs: kn,
					now: this.now,
					setTimeoutFn: this.setTimeoutFn,
					clearTimeoutFn: this.clearTimeoutFn,
					onEnd: (e) => {
						c = e;
					}
				}).subscribe({
					next: (t) => {
						if (s || !Nn(t.event, e)) return;
						let r = this.now(), i = Pn(t.event);
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
}, In = /* @__PURE__ */ new WeakMap();
function Ln(e) {
	let t = In.get(e);
	return t || (t = new Fn(e), In.set(e, t)), t;
}
export { Ke as $, P as A, rt as B, xt as C, L as D, wt as E, st as F, et as G, N as H, lt as I, Ye as J, M as K, ht as L, ft as M, ct as N, Tt as O, dt as P, qe as Q, mt as R, F as S, Dt as T, nt as U, it as V, at as W, Ze as X, Xe as Y, Je as Z, Ft as _, Z as a, Ie as at, Et as b, fn as c, T as ct, Vt as d, E as dt, j as et, Bt as f, je as ft, z as g, It as h, ye as ht, Tn as i, O as it, ut as j, bt as k, qt as l, Ce as lt, B as m, Me as mt, On as n, k as nt, X as o, D as ot, zt as p, De as pt, $e as q, Dn as r, He as rt, mn as s, Oe as st, Ln as t, A as tt, Ut as u, Ee as ut, Pt as v, Ct as w, I as x, jt as y, pt as z };
