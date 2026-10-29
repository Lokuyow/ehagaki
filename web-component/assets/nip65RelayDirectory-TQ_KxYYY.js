import { d as e, f as t, n, r, t as i } from "./relayConfigUtils-DD5f1UAM.js";
import { a, d as o, i as s, l as c, n as l, o as u, r as d, t as f, u as p } from "./postHistoryEventUtils-CUIBkIiy.js";
import { c as m, f as h, h as ee, m as g } from "./legacyImportMarkers-CZ4J2IrE.js";
import { _, c as te, g as v } from "./signedEventResultValidator-DEUEqBPK.js";
import { m as y, p as b } from "./relayStore.svelte-B2f9GSlJ.js";
import { n as ne } from "./tslib.es6-j0rGxSfD.js";
import { Tt as re } from "./appUtils-CwuZyofa.js";
import { f as ie, n as ae, o as oe, p as se, r as ce } from "./query-BRdCuyDl.js";
import { d as le } from "./clipboardUtils-LENkGqCk.js";
import { i as ue } from "./reactionValue-D-cbOxKy.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryLocalWriteScope.ts
var x = "global";
async function S(e, t) {
	if (!e.isOpen()) return 0;
	let n = (await e.postHistoryWriteGeneration.get(t))?.value;
	return typeof n == "number" && Number.isSafeInteger(n) ? n : 0;
}
async function de(e, t) {
	return t.isActive() && await S(e, t.ownerPubkeyHex) === t.expectedRevision && t.isActive();
}
async function C(e, t) {
	if (t && !await de(e, t)) throw new w();
}
async function fe(e, t, n) {
	let r = await S(e, t);
	await e.postHistoryWriteGeneration.put({
		id: t,
		value: r + 1,
		updatedAt: n
	});
}
function pe(e) {
	return typeof e == "number" && Number.isSafeInteger(e) && e >= 0 ? e : 0;
}
async function me(e) {
	if (!e.isOpen()) return 0;
	let t = g.currentTransaction;
	if (!t || t.db !== e || !t.storeNames.includes("postHistoryChildWriteGeneration")) return he(e);
	let n = (await e.postHistoryChildWriteGeneration.get(x))?.value;
	return pe(n);
}
function he(e) {
	let t = e.backendDB();
	return t.objectStoreNames.contains("postHistoryChildWriteGeneration") ? new Promise((e, n) => {
		let r = t.transaction("postHistoryChildWriteGeneration", "readonly").objectStore("postHistoryChildWriteGeneration").get(x);
		r.onsuccess = () => e(pe(r.result?.value)), r.onerror = () => n(r.error ?? /* @__PURE__ */ Error("child write generation read failed"));
	}) : Promise.resolve(0);
}
async function ge(e, t) {
	let n = g.currentTransaction;
	n?.db === e && n.storeNames.includes("postHistoryChildWriteGeneration") ? await _e(e, t) : await e.transaction("rw", e.postHistoryChildWriteGeneration, async () => {
		await _e(e, t);
	});
}
async function _e(e, t) {
	let n = await me(e);
	await e.postHistoryChildWriteGeneration.put({
		id: x,
		value: n + 1,
		updatedAt: t
	});
}
var w = class extends Error {
	constructor() {
		super("Post history operation is no longer active");
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/lift.js
function ve(e) {
	return ie(e?.lift);
}
function ye(e) {
	return function(t) {
		if (ve(t)) return t.lift(function(t) {
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
function be(e, t, n, r, i) {
	return new xe(e, t, n, r, i);
}
var xe = function(e) {
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
}(oe);
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/map.js
function Se(e, t) {
	return ye(function(n, r) {
		var i = 0;
		n.subscribe(be(r, function(n) {
			r.next(e.call(t, n, i++));
		}));
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/filter.js
function Ce(e, t) {
	return ye(function(n, r) {
		var i = 0;
		n.subscribe(be(r, function(n) {
			return e.call(t, n, i++) && r.next(n);
		}));
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelayCoverage.ts
function T(e) {
	let t = e.filter((e) => e && Number.isSafeInteger(e.since) && Number.isSafeInteger(e.until) && e.since >= 0 && e.until >= e.since && e.until < 2 ** 53 - 1).map((e) => ({ ...e })).sort((e, t) => e.since - t.since || e.until - t.until), n = [];
	for (let e of t) {
		let t = n.at(-1);
		t && e.since <= t.until + 1 ? t.until = Math.max(t.until, e.until) : n.push(e);
	}
	return n;
}
function we(e, t) {
	let n = new Set(t);
	if (!n.size) return [];
	let r = /* @__PURE__ */ new Map();
	for (let t of n) {
		let n = T(e.filter((e) => e.relayUrl === t).flatMap((e) => e.ranges));
		for (let { since: e, until: t } of n) r.set(e, (r.get(e) ?? 0) + 1), r.set(t + 1, (r.get(t + 1) ?? 0) - 1);
	}
	let i = Math.ceil(n.size / 2), a = [], o = 0, s = null;
	for (let [e, t] of [...r].sort(([e], [t]) => e - t)) o += t, o >= i && s === null && (s = e), o < i && s !== null && (a.push({
		since: s,
		until: e - 1
	}), s = null);
	return T(a);
}
function Te(e, t) {
	return T(e).find((e) => e.since <= t && e.until >= t)?.since ?? t;
}
function Ee(e) {
	if (e.cancelled) return [];
	let t = e.since ?? e.oldestCreatedAt;
	return t == null ? [] : e.outcomes.flatMap((n) => {
		if (!n.eoseReceived || !n.verificationDrained || n.termination !== "eose" || n.saturated && n.oldestCreatedAt === null) return [];
		let r = T([{
			since: n.saturated ? Math.max(t, n.oldestCreatedAt + 1) : t,
			until: e.until
		}]);
		return r.length ? [{
			relayUrl: n.relayUrl,
			ranges: r
		}] : [];
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryJsonlWorkerVerification.ts
var E = 1e4;
function De(e) {
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
			new URL("postHistoryJsonlVerificationWorker-azu293ri.js", import.meta.url).href,
			"" + import.meta.url
		), { type: "module" }), n = v({
			worker: t,
			timeout: E,
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
				l = setTimeout(() => u(/* @__PURE__ */ Error("post_history_import_worker_readiness_timeout"), !0), E);
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
				}, s = (e) => o(e), c = setTimeout(() => u(/* @__PURE__ */ Error("post_history_import_worker_verification_timeout"), !0), E);
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
function Oe(e = {}) {
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
			let n = De({
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
function ke(e = {}) {
	let t = Oe(e);
	return {
		ready: t.ready,
		async verify(e) {
			let n = null;
			try {
				u(e) && (n = l(e));
			} catch {}
			if (await t.ready, t.assertActive(), !n) return null;
			let r = await t.verify(n);
			return t.assertActive(), r ? Le(n, "full") : null;
		},
		dispose: t.dispose
	};
}
var Ae = /* @__PURE__ */ new WeakMap(), je = /* @__PURE__ */ new WeakMap(), Me = /* @__PURE__ */ new WeakMap(), Ne = /* @__PURE__ */ new WeakMap();
function Pe(e, t = 1024, n = 64) {
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = null, o = 0;
	return {
		verify: async (s) => {
			if (!a || s.pubkey !== a.owner || !a.kinds.includes(s.kind)) return e(s);
			if (!u(s)) return !1;
			let c = l(s), d = D(c);
			if (!d) return !1;
			let f = `1:${d}`, p = o, m;
			if (r.has(f)) r.delete(f), r.set(f, !0), m = !0;
			else {
				let s = i.get(f);
				s || (s = Promise.resolve().then(() => e(c)), i.size < n && i.set(f, s));
				try {
					m = await s;
				} finally {
					i.get(f) === s && i.delete(f);
				}
				if (m && o === p && a) for (r.delete(f), r.set(f, !0); r.size > t;) r.delete(r.keys().next().value);
			}
			return m && D(s) === d;
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
function Fe(e, t) {
	Ne.set(e, t);
}
function Ie(e, t, n) {
	return Ne.get(e)?.acquire(t, n) ?? (() => void 0);
}
function D(t) {
	if (!e(t)) return null;
	try {
		let e = _(t);
		return e === t.id ? `${e}\u0000${t.id}\u0000${t.sig}` : null;
	} catch {
		return null;
	}
}
function Le(e, t) {
	let n = l(e), r = D(n);
	if (!r) return null;
	let i = {};
	return Ae.set(i, {
		fingerprint: r,
		ruleVersion: 1,
		evidence: t
	}), je.set(n, i), {
		event: n,
		attestation: i
	};
}
function O(e) {
	try {
		if (!u(e)) return null;
		let n = l(e), r = D(n);
		if (!r || !t(n)) return null;
		let i = {};
		return Ae.set(i, {
			fingerprint: r,
			ruleVersion: 1,
			evidence: "full"
		}), je.set(n, i), {
			event: n,
			attestation: i
		};
	} catch {
		return null;
	}
}
function Re(e, t) {
	let n = t ?? (typeof e == "object" && e ? je.get(e) : void 0);
	if (!n || typeof n != "object") return !1;
	let r = Ae.get(n);
	return !r || r.ruleVersion !== 1 ? !1 : D(e) === r.fingerprint;
}
function ze(e) {
	return { use(t, n) {
		return e.use(t, n).pipe(Se((e) => {
			let t = e.event;
			if (!t) return null;
			let n = Le(t, "rx-nostr-signature");
			return n ? {
				...e,
				...n
			} : null;
		}), Ce((e) => e !== null));
	} };
}
function Be(e) {
	let t = ze(e);
	return Me.set(e, t), t;
}
function Ve(e, t, n) {
	return (Me.get(e) ?? ze(e)).use(t, n);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryKinds.ts
var He = [
	1,
	6,
	16,
	42,
	1111
], Ue = He.join(",");
function We(e) {
	return He.includes(e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/sensitiveEventUtils.ts
var Ge = 1111;
function Ke(e) {
	return e.channel ? 42 : e.hasReply ? e.replyKind === 1 ? 1 : e.replyKind === 7 || e.replyKind === 1111 ? Ge : null : 1;
}
function qe(e, t = "") {
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
	let i = p(e);
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
function k(n) {
	try {
		if (!u(n)) return !1;
		let r = l(n);
		return e(r) && t(r);
	} catch {
		return !1;
	}
}
var Je = [
	1,
	42,
	1111
];
function A(e) {
	if (!Je.includes(e.kind) || e.content !== "" || !e.tags.some((e) => e[0] === "content-warning")) return null;
	let t = e.tags.filter((e) => e[0] === "c");
	if (t.length !== 1) return null;
	let n = t[0];
	return !o(n[1]) || n.length > 3 ? null : {
		eventId: n[1],
		relayHint: n[2] || null
	};
}
function Ye(e) {
	return A(e) !== null && k(e);
}
function Xe(e, t, n, r) {
	return {
		kind: 36,
		pubkey: n,
		created_at: r,
		content: t,
		tags: [["k", String(e)]]
	};
}
function Ze(e, t, n) {
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
function Qe(e, t, n = A(e)?.eventId) {
	if (!n || !Ye(e) || !t || t.id !== n || t.kind !== 36 || t.pubkey !== e.pubkey || !k(t)) return !1;
	let r = t.tags.filter((e) => e[0] === "k");
	return r.length === 1 && r[0].length >= 2 && r[0][1] === String(e.kind);
}
var $e = /* @__PURE__ */ new Set([
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
function et(e) {
	return $e.has(e);
}
function tt(e) {
	if (!e || e.kind !== 5) return [];
	let t = e.tags.filter((e) => e[0] === "e" && typeof e[1] == "string" && e[1].length > 0).map((e) => e[1]);
	return Array.from(new Set(t));
}
function j(e, t) {
	return !e || !t || e.kind !== 5 || e.pubkey !== t.pubkey ? !1 : tt(e).includes(t.id);
}
function nt(e, t, n) {
	return `${e}:${t}:${n}`;
}
function rt(e) {
	return e.targetVerified !== !1;
}
function it(e, t) {
	return e.deletedAt - t.deletedAt || e.deletionEventId.localeCompare(t.deletionEventId);
}
function at(e) {
	return {
		deletedAt: e.deletedAt * 1e3,
		deletionEventId: e.deletionEventId
	};
}
function ot(e, t = Date.now) {
	let { deletionEvent: r } = e;
	return {
		id: nt(r.pubkey, e.targetEventId, r.id),
		targetAuthorPubkey: r.pubkey,
		targetEventId: e.targetEventId,
		deletionEventId: r.id,
		deletionEventPubkey: r.pubkey,
		targetVerified: e.targetVerified,
		deletedAt: r.created_at,
		reason: r.content.trim() || null,
		rawEvent: f(r),
		relayUrls: n.sanitizeExternalRelayUrls(e.relayUrls ?? []),
		fetchedAt: e.fetchedAt,
		updatedAt: t(),
		schemaVersion: 2
	};
}
function st(e, t = Date.now) {
	let { deletionEvent: n, targetEvent: r } = e;
	return !n.id || !j(n, r) ? null : ot({
		deletionEvent: n,
		targetEventId: r.id,
		targetVerified: !0,
		relayUrls: e.relayUrls,
		fetchedAt: e.fetchedAt
	}, t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryMediaUtils.ts
function ct(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.slice(1)) {
		let e = n.indexOf(" ");
		e <= 0 || t.set(n.slice(0, e), n.slice(e + 1));
	}
	let n = t.get("url"), r = n ? te(n) : "";
	if (!r) return null;
	let i = t.get("size"), a = i ? Number(i) : void 0, o = typeof a == "number" && Number.isFinite(a) && a > 0 ? a : void 0;
	return {
		url: r,
		mimeType: t.get("m") || void 0,
		alt: t.get("alt") || void 0,
		blurhash: t.get("blurhash") || void 0,
		dim: t.get("dim") || void 0,
		size: o,
		uploadProtocol: lt(t.get("uploadProtocol"))
	};
}
function lt(e) {
	return e === "blossom" || e === "nip96" || e === "custom-http" ? e : void 0;
}
function ut(e) {
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
function dt(e, t) {
	return le(e).filter((e) => e.isValidHttpUrl).map((e) => e.displayText).map((e) => te(e)).filter((e) => e.length > 0).filter((e) => !t.has(e) && /\.(jpe?g|png|webp|gif|mp4|webm|mov)(?:$|[?#])/i.test(e)).map((e) => ({
		url: e,
		mimeType: ut(e)
	}));
}
function M(e) {
	let t = e.tags.filter((e) => e[0] === "imeta").map(ct).filter((e) => e !== null), n = new Set(t.map((e) => e.url));
	return t.push(...dt(e.content, n)), t;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relatedEventVerification.ts
function N(e, t) {
	let n = O(e);
	return !n || t && (n.event.id !== t.eventId || t.authorHint && n.event.pubkey !== t.authorHint || t.authorHints?.length && !t.authorHints.includes(n.event.pubkey) || t.targetKindHint != null && n.event.kind !== t.targetKindHint) ? null : n;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postRepostUtils.ts
function P(e) {
	return e === 6 || e === 16;
}
function ft(e) {
	return e === 1 || e === 7 || e === 42 || e === 1111;
}
function pt(e, t, n = [
	1,
	7,
	42,
	1111
]) {
	return e === 6 ? t === 1 ? "supported" : "outer-target-kind-mismatch" : t === 1 ? "outer-target-kind-mismatch" : n.includes(t) ? "supported" : "unsupported-target-kind";
}
function mt(e) {
	let t = {
		status: "invalid-reference",
		reference: null
	};
	if (!P(e.kind)) return t;
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
function F(e) {
	return mt(e).reference;
}
function I(e, t) {
	return N(e, t);
}
function ht(e, t, n) {
	let r = mt(e), i = r.reference, a = {
		event: null,
		profile: null,
		relayHints: t?.relayHints ?? []
	};
	if (!i) return {
		...a,
		status: r.status
	};
	if (t?.event && !I(t.event, i)) return {
		...a,
		status: "invalid-target"
	};
	if (t?.event) {
		let e = pt(i.outerKind, t.event.kind, n);
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
function gt(e, t) {
	let n = I(e, t);
	return n && pt(t.outerKind, n.event.kind) === "supported" ? n : null;
}
function L(e, t = [], r) {
	let i = r ? gt(e, r) : I(e);
	return !i || !ft(i.event.kind) ? null : {
		rawEvent: l(i.event),
		rawEventVerification: {
			status: "valid",
			ruleVersion: 1
		},
		relayHints: n.sanitizeExternalRelayUrls(t)
	};
}
function _t(e, t, r, i, a) {
	let o = I(e), s = n.sanitizeExternalRelayUrls([r])[0];
	if (!o || !ft(o.event.kind) || !s) throw Error("invalid_repost_target");
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
function vt(e, t = []) {
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
		media: M(e),
		...d(e),
		rawEvent: e,
		updatedAt: 0,
		schemaVersion: 2
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryLatestRequest.ts
var R = /* @__PURE__ */ new Map();
function yt(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function bt(e) {
	let t = yt(e.pubkeyHex);
	t && e.eventId && R.set(t, {
		pubkeyHex: t,
		eventId: e.eventId,
		requestedAt: e.requestedAt ?? Date.now()
	});
}
function xt(e) {
	let t = yt(e);
	if (!t) return null;
	let n = R.get(t) ?? null;
	return R.delete(t), n;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryLocalSearchRevision.ts
var St = /* @__PURE__ */ new Map(), Ct = 0;
function wt(e) {
	return St.get(e) ?? 0;
}
function z(e) {
	St.set(e, wt(e) + 1);
}
function Tt() {
	return Ct;
}
function Et() {
	Ct += 1;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/arrayEqualityUtils.ts
function B(e, t) {
	let n = e ?? [], r = t ?? [];
	return n.length === r.length && n.every((e, t) => e === r[t]);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryRelayCoverageRepository.ts
var Dt = "postHistoryRelayCoverage:", V = class {
	db;
	now;
	constructor(e = m, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e, t) {
		let r = (await this.db.postHistoryExternalCoverage.get(Ot(e, t)))?.value;
		return {
			schemaVersion: 1,
			ownerPubkeyHex: e,
			kindsKey: t,
			relays: (r?.schemaVersion === 1 && r.ownerPubkeyHex === e && r.kindsKey === t && Array.isArray(r.relays) ? r.relays : []).flatMap((e) => {
				let t = n.sanitizeExternalRelayUrls([e?.relayUrl])[0];
				return t && Array.isArray(e.ranges) ? [{
					relayUrl: t,
					ranges: T(e.ranges)
				}] : [];
			})
		};
	}
	async getLocalRevision(e) {
		return S(this.db, e);
	}
	async isCurrent(e) {
		return de(this.db, e);
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
				ranges: T(t)
			})).sort((e, t) => e.relayUrl.localeCompare(t.relayUrl))
		};
		if (!e.isActive()) throw new H();
		JSON.stringify(t) !== JSON.stringify(i) && await this.db.postHistoryExternalCoverage.put({
			id: Ot(e.ownerPubkeyHex, e.kindsKey),
			ownerPubkeyHex: e.ownerPubkeyHex,
			value: i,
			updatedAt: this.now()
		});
	}
	async clearForPubkey(e) {
		await this.db.postHistoryExternalCoverage.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryCitrineRanges.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryLocalBrowsingRanges.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryLocalResumeCursor.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryJumpAnchors.delete(e), await fe(this.db, e, this.now());
	}
};
function Ot(e, t) {
	return `${Dt}${e}:${t}`;
}
var H = class extends w {}, kt = new V();
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/sensitivePayloadDeletionReconciler.ts
async function At(e, t = m, n = Date.now) {
	let r = await t.postHistory.get(e);
	if (!r || !s(r.rawEvent, r)) return !1;
	let i = r.rawEvent, a = A(i);
	if (!a || !k(i)) return !1;
	let o = await t.sensitivePayloads.get(a.eventId);
	if (!o || o.deletedAt !== void 0 || o.pubkeyHex !== i.pubkey || !Qe(i, o.rawEvent, a.eventId)) return !1;
	let c = !1;
	return await t.transaction("rw", t.postHistory, t.sensitivePayloads, t.postHistoryDeletionRequests, async () => {
		let r = await t.postHistory.get(e), i = await t.sensitivePayloads.get(a.eventId);
		if (!r || !s(r.rawEvent, r) || !k(r.rawEvent) || !i || i.deletedAt !== void 0 || i.pubkeyHex !== r.pubkeyHex || !Qe(r.rawEvent, i.rawEvent, a.eventId)) return;
		let o = (await t.postHistoryDeletionRequests.where("targetEventId").equals(a.eventId).toArray()).filter((e) => {
			if (e.targetAuthorPubkey !== r.pubkeyHex || e.deletionEventPubkey !== r.pubkeyHex || e.rawEventVerification?.status !== "valid" || e.rawEventVerification.ruleVersion !== 1) return !1;
			let t = e.rawEvent;
			return k(t) && j(t, {
				id: i.id,
				pubkey: i.pubkeyHex
			});
		}).sort(it);
		if (o.length === 0) return;
		let l = o[0];
		for (let e of o) e.targetVerified !== !0 && await t.postHistoryDeletionRequests.put({
			...e,
			targetVerified: !0,
			updatedAt: n(),
			schemaVersion: 2
		});
		await t.sensitivePayloads.put({
			...i,
			...at(l),
			updatedAt: n()
		}), c = !0;
	}), c && z(i.pubkey), c;
}
async function jt(e, t = m, n = Date.now) {
	let r = await t.sensitivePayloads.get(e);
	if (!r || r.deletedAt !== void 0) return;
	let i = await t.postHistoryDeletionRequests.where("targetEventId").equals(e).toArray(), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
	for (let t of i) {
		if (t.rawEventVerification?.status !== "valid" || t.rawEventVerification.ruleVersion !== 1) continue;
		let n = t.rawEvent;
		if (k(n) && n.kind === 5) {
			o.add(n.pubkey);
			for (let t of n.tags) t[0] === "e" && t[1] && t[1] !== e && a.add(t[1]);
		}
	}
	for (let n of o) {
		let r = await t.postHistory.where("pubkeyHex").equals(n).toArray();
		for (let t of r) s(t.rawEvent, t) && A(t.rawEvent)?.eventId === e && a.add(t.eventId);
	}
	for (let e of a) await At(e, t, n);
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
		e.postHistoryChildInteractions,
		e.sensitivePayloads,
		...Mt(e)
	], async () => {
		await new V(e, n).clearForPubkey(t), await ge(e, n()), i = await e.sensitivePayloads.where("pubkeyHex").equals(t).delete();
		let a = (await e.postHistory.where("pubkeyHex").equals(t).primaryKeys()).map(String);
		a.length > 0 && await e.postHistoryChildInteractions.where("parentEventId").anyOf(a).delete(), r = await e.postHistory.where("pubkeyHex").equals(t).delete();
	}), {
		deletedPostHistoryCount: r,
		deletedPayloadCount: i
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryLocalBrowsingRangesRepository.ts
var Ft = "postHistoryLocalBrowsingRanges:", It = class {
	db;
	now;
	constructor(e = m, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e, t, n) {
		let r = re(n) ?? "", i = await S(this.db, e), a = {
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
			browsingRanges: T(Array.isArray(l.browsingRanges) ? l.browsingRanges : []),
			resumeHint: typeof u == "number" && Number.isSafeInteger(u) && u >= 0 ? { nextUntil: u } : null
		};
	}
	async record(e) {
		await C(this.db, e);
		let t = re(e.localRelayUrl);
		if (!t) throw Error("Invalid local browsing URL");
		let n = await this.get(e.ownerPubkeyHex, e.kindsKey, t), r = e.resumeHint?.nextUntil, i = n.resumeHint;
		typeof r == "number" && Number.isSafeInteger(r) && r >= 0 && (!e.initializeResumeHintOnly || !i) && (i = { nextUntil: i ? Math.min(i.nextUntil, r) : r });
		let a = {
			...n,
			browsingRanges: T([...n.browsingRanges, ...e.browsingRanges]),
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
		await C(this.db, e);
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
	return Re(e, t) ? {
		event: e,
		attestation: t
	} : O(e);
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
function U(e) {
	return Number.isFinite(e) ? Math.trunc(e ?? 0) : null;
}
function W(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 50;
}
function Wt(e) {
	return Number.isFinite(e) ? Math.trunc(e) : 0;
}
function Gt(e) {
	return { contiguous: e?.contiguous !== !1 };
}
function G(e, t) {
	return e.postedAt === t.postedAt ? e.createdAt === t.createdAt ? ee(t.eventId, e.eventId) : t.createdAt - e.createdAt : t.postedAt - e.postedAt;
}
function Kt(e, t) {
	return G(e, t) > 0;
}
function qt(e, t) {
	return G(e, t) < 0;
}
function Jt(e) {
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
		upper: [e, g.maxKey]
	};
}
function J(e) {
	return We(e.kind);
}
function Y(e, t) {
	return J(e) && (t === null || e.createdAt >= t);
}
function Yt(e) {
	return Math.max(0, e * 1e3);
}
function Xt(e, t) {
	let r = t(), i = e.event, a = n.sanitizeExternalRelayUrls(e.acceptedRelays), o = n.sanitizeExternalRelayUrls([...e.relayHints ?? [], ...a], { limit: 3 }), s = d(i);
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
		media: P(i.kind) ? [] : M(i),
		rawEvent: f(i),
		rawEventVerification: { ...Rt },
		...s.channelEventId ? { channelEventId: s.channelEventId } : {},
		...s.channelRelayHints ? { channelRelayHints: s.channelRelayHints } : {},
		updatedAt: r,
		schemaVersion: 2
	};
}
function Zt(e, t) {
	let r = /* @__PURE__ */ new Map();
	for (let i of e) {
		if (!i?.event?.id || !i.event.pubkey) continue;
		let e = n.sanitizeExternalRelayUrls(i.relayUrls), o = r.get(i.event.id);
		o ? a(o.event, i.event) ? (o.relayUrls = n.sanitizeExternalRelayUrls([...o.relayUrls, ...e]), !o.attestation && i.attestation && (o.attestation = i.attestation)) : t.warn("post_history_fetched_event_conflict", i.event.id) : r.set(i.event.id, {
			event: i.event,
			...i.attestation ? { attestation: i.attestation } : {},
			relayUrls: e
		});
	}
	return Array.from(r.values());
}
async function Qt(e, t) {
	if (t.length === 0) return /* @__PURE__ */ new Map();
	let n = await e.postHistoryDeletionRequests.where("targetEventId").anyOf(t).toArray(), r = /* @__PURE__ */ new Map();
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
	return e.kind !== t.kind || e.content !== t.content || e.createdAt !== t.createdAt || e.postedAt !== t.postedAt || e.deletedAt !== t.deletedAt || e.deletionEventId !== t.deletionEventId || e.channelEventId !== t.channelEventId || !a(e.rawEvent, t.rawEvent) || e.rawEventVerification?.status !== t.rawEventVerification?.status || e.rawEventVerification?.ruleVersion !== t.rawEventVerification?.ruleVersion || !B(e.relayHints, t.relayHints) || !B(e.acceptedRelays, t.acceptedRelays) || !B(e.fetchedRelays, t.fetchedRelays) || !B(e.channelRelayHints, t.channelRelayHints) || !$t(e.media, t.media) || e.tags.length !== t.tags.length || e.tags.some((e, n) => !B(e, t.tags[n]));
}
var tn = new class {
	db;
	now;
	console;
	constructor(e = m, t = Date.now, n = globalThis.console === void 0 ? {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	} : globalThis.console) {
		this.db = e, this.now = t, this.console = n;
	}
	async getByEventId(e) {
		if (!e) return null;
		let t = await this.db.postHistory.get(e);
		return t && J(t) ? t : null;
	}
	async getExistingEventIdsForPubkey(e) {
		if (!e.pubkeyHex || e.eventIds.length === 0) return [];
		let t = Array.from(new Set(e.eventIds.filter((e) => !!e)));
		return (await this.db.postHistory.bulkGet(t)).filter((t) => !!t && J(t) && t.pubkeyHex === e.pubkeyHex).map((e) => e.eventId);
	}
	async getAll(e) {
		return e.pubkeyHex ? Jt((await this.db.postHistory.where("[pubkeyHex+postedAt]").between([e.pubkeyHex, g.minKey], [e.pubkeyHex, g.maxKey]).reverse().toArray()).filter(J)) : [];
	}
	async getSearchScanChunk(e) {
		if (!e.pubkeyHex) return {
			items: [],
			nextCursor: null,
			hasMore: !1
		};
		let t = W(e.limit), n = q(e.pubkeyHex), r = e.cursor ? K(e.pubkeyHex, e.cursor) : n.upper, i = await this.db.postHistory.where(h).between(n.lower, r, !0, !e.cursor).reverse().limit(t).toArray(), a = i.at(-1);
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
		let t = Ht(e.page), n = Ut(e.pageSize), r = q(e.pubkeyHex);
		return this.db.postHistory.where(h).between(r.lower, r.upper).reverse().filter(J).offset((t - 1) * n).limit(n).toArray();
	}
	async getLatestVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = W(e.limit), n = U(e.visibleUntil), r = q(e.pubkeyHex);
		return this.db.postHistory.where(h).between(r.lower, r.upper).reverse().filter((e) => Y(e, n)).limit(t).toArray();
	}
	async getOlderVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = W(e.limit), n = U(e.visibleUntil), r = q(e.pubkeyHex), i = K(e.pubkeyHex, e.cursor);
		return this.db.postHistory.where(h).between(r.lower, i, !0, !1).reverse().filter((e) => Y(e, n)).limit(t).toArray();
	}
	async hasOlderVisiblePosts(e) {
		if (!e.pubkeyHex) return !1;
		let t = U(e.visibleUntil), n = this.db.postHistory.where(h).between(q(e.pubkeyHex).lower, K(e.pubkeyHex, e.cursor), !0, !1), r = n;
		if (t !== null) {
			let i = this.db.postHistory.where("[pubkeyHex+createdAt]").between([e.pubkeyHex, t], [e.pubkeyHex, g.maxKey]), [a, o] = await Promise.all([n.count(), i.count()]);
			if (a === 0 || o === 0) return !1;
			r = o <= a ? i : n;
		}
		return await r.filter((n) => Y(n, t) && Kt(n, e.cursor)).first() !== void 0;
	}
	async getNewerVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = W(e.limit), n = U(e.visibleUntil), r = q(e.pubkeyHex), i = K(e.pubkeyHex, e.cursor);
		return (await this.db.postHistory.where(h).between(i, r.upper, !1, !0).filter((e) => Y(e, n)).limit(t).toArray()).reverse();
	}
	async getOldestVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = W(e.limit), n = Gt(e.query).contiguous ? U(e.visibleUntil) : null, r = q(e.pubkeyHex);
		return n === null ? (await this.db.postHistory.where(h).between(r.lower, r.upper).filter(J).limit(t).toArray()).reverse() : (await this.db.postHistory.where("[pubkeyHex+createdAt]").between([e.pubkeyHex, n], [e.pubkeyHex, g.maxKey]).toArray()).filter(J).sort(G).slice(-t);
	}
	async getVisibleChunkFromCreatedAt(e) {
		if (!e.pubkeyHex) return [];
		let t = W(e.limit), n = Wt(e.createdAt), r = Gt(e.query).contiguous ? U(e.visibleUntil) : null, i = q(e.pubkeyHex);
		return this.db.transaction("r", this.db.postHistory, async () => {
			let a = await this.db.postHistory.where(h).between(i.lower, i.upper).reverse().filter((e) => Y(e, r) && e.createdAt <= n).first();
			return a ? t === 1 ? [a] : [a, ...await this.db.postHistory.where(h).between(i.lower, K(e.pubkeyHex, a), !0, !1).reverse().filter((e) => Y(e, r)).limit(t - 1).toArray()] : (await this.db.postHistory.where(h).between(i.lower, i.upper).filter((e) => Y(e, r)).limit(t).toArray()).reverse();
		});
	}
	async getVisibleChunkAroundEventId(e) {
		if (!e.pubkeyHex) return [];
		let t = W(e.limit), n = Number.isFinite(e.keepAbove) ? Math.min(t - 1, Math.max(0, Math.trunc(e.keepAbove ?? 0))) : 0, r = U(e.visibleUntil), i = q(e.pubkeyHex);
		return this.db.transaction("r", this.db.postHistory, async () => {
			let a = await this.db.postHistory.get(e.eventId);
			if (!a || a.pubkeyHex !== e.pubkeyHex || !Y(a, r)) return [];
			let o = K(e.pubkeyHex, a), s = n === 0 ? [] : await this.db.postHistory.where(h).between(o, i.upper, !1, !0).filter((e) => Y(e, r)).limit(n).toArray(), c = t - 1 - s.length, l = c === 0 ? [] : await this.db.postHistory.where(h).between(i.lower, o, !0, !1).reverse().filter((e) => Y(e, r)).limit(c).toArray(), u = t - 1 - s.length - l.length;
			if (u > 0) {
				let t = s[s.length - 1] ?? a, n = await this.db.postHistory.where(h).between(K(e.pubkeyHex, t), i.upper, !1, !0).filter((e) => Y(e, r)).limit(u).toArray();
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
		return !e || !Number.isFinite(t) ? !1 : await this.db.postHistory.where("[pubkeyHex+createdAt]").between([e, g.minKey], [e, Math.trunc(t)], !0, !1).filter(J).limit(1).count() > 0;
	}
	async getSparseChunk(e) {
		if (!e.pubkeyHex || !Number.isFinite(e.visibleUntil)) return [];
		let t = W(e.limit), n = Math.trunc(e.visibleUntil);
		if (e.direction !== "latest" && !e.cursor) return [];
		let r = e.cursor, i = (t) => J(t) && t.createdAt < n && (e.direction === "latest" || e.direction === "older" && !!r && Kt(t, r) || e.direction === "newer" && !!r && qt(t, r)), a = q(e.pubkeyHex), o = r ? K(e.pubkeyHex, r) : null, s = e.direction === "latest" ? this.db.postHistory.where(h).between(a.lower, a.upper) : e.direction === "older" ? this.db.postHistory.where(h).between(a.lower, o, !0, !1) : this.db.postHistory.where(h).between(o, a.upper, !1, !0), c = await (e.direction === "newer" ? s : s.reverse()).filter(i).limit(t).toArray();
		return e.direction === "newer" ? c.reverse() : c;
	}
	async countForPubkey(e) {
		return e ? this.db.postHistory.where("pubkeyHex").equals(e).filter(J).count() : 0;
	}
	async countVisibleForPubkey(e, t) {
		if (!e) return 0;
		let n = U(t);
		return n === null ? this.countForPubkey(e) : this.db.postHistory.where("[pubkeyHex+createdAt]").between([e, n], [e, g.maxKey]).filter(J).count();
	}
	async putPostedEvent(e) {
		let t = Bt(e.event, e.attestation);
		if (!t) throw Error("invalid_post_history_raw_event");
		let n = F(t.event), r = e.repostTarget ? n && L(e.repostTarget.event, e.repostTarget.relayHints, n) : null;
		if (e.repostTarget && !r) throw Error("invalid_repost_target");
		if (e.localWriteScope && e.localWriteScope.ownerPubkeyHex !== t.event.pubkey) throw Error("invalid_post_history_owner");
		await this.db.transaction("rw", this.db.postHistory, this.db.postHistoryWriteGeneration, async () => {
			await C(this.db, e.localWriteScope);
			let i = await this.db.postHistory.get(t.event.id);
			await this.db.postHistory.put({
				...Xt({
					...e,
					event: t.event
				}, this.now),
				...P(t.event.kind) && i ? {
					postedAt: i.postedAt,
					fetchedRelays: i.fetchedRelays,
					deletedAt: i.deletedAt,
					deletionEventId: i.deletionEventId
				} : {},
				...r ? { repostTarget: r } : i?.repostTarget && n && L(i.repostTarget.rawEvent, i.repostTarget.relayHints, n) ? { repostTarget: i.repostTarget } : {}
			}), await C(this.db, e.localWriteScope);
		}), z(t.event.pubkey), bt({
			pubkeyHex: t.event.pubkey,
			eventId: t.event.id
		});
	}
	async attachRepostTarget(e) {
		let t = !1;
		return await this.db.transaction("rw", this.db.postHistory, this.db.postHistoryWriteGeneration, async () => {
			await C(this.db, e.localWriteScope);
			let n = await this.db.postHistory.get(e.outerEventId);
			if (!n || n.pubkeyHex !== e.localWriteScope.ownerPubkeyHex || n.deletedAt !== void 0 || !s(n.rawEvent, n) || !O(n.rawEvent)) return;
			let r = F(n);
			if (!r) return;
			let i = L(e.target, e.relayHints, r);
			if (!i) throw Error("invalid_repost_target");
			n.repostTarget && a(n.repostTarget.rawEvent, i.rawEvent) && B(n.repostTarget.relayHints, i.relayHints) || (await this.db.postHistory.update(n.id, {
				repostTarget: i,
				updatedAt: this.now()
			}), await C(this.db, e.localWriteScope), t = !0);
		}), t && z(e.localWriteScope.ownerPubkeyHex), t;
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
		let r = e.fetchedAt ?? this.now(), i = t.map((e) => e.event.id), o = 0, s = 0, c = 0, l = 0, u = /* @__PURE__ */ new Set(), p = new V(this.db, this.now);
		try {
			await this.db.transaction("rw", [
				this.db.postHistory,
				this.db.postHistoryDeletionRequests,
				this.db.sensitivePayloads,
				...e.relayFetchCoverage || e.localWriteScope || e.localBrowsingWrite ? Mt(this.db) : []
			], async () => {
				if (await C(this.db, e.localWriteScope), await C(this.db, e.localBrowsingWrite), e.relayFetchCoverage && !await p.isCurrent(e.relayFetchCoverage)) throw new H();
				let m = await this.db.postHistory.bulkGet(i), h = /* @__PURE__ */ new Map(), ee = await Qt(this.db, i);
				m.forEach((e) => {
					e && h.set(e.eventId, e);
				});
				let g = [], _ = t.map((e) => {
					let t = h.get(e.event.id), i = n.sanitizeExternalRelayUrls([...t?.fetchedRelays ?? [], ...e.relayUrls]), p = !!t && !a(t.rawEvent, e.event), m = !t || !p || !zt(t.rawEventVerification);
					p && this.console.warn("post_history_raw_event_conflict", e.event.id);
					let _ = !m && t ? {
						channelEventId: t.channelEventId,
						channelRelayHints: t.channelRelayHints
					} : d(e.event), te = n.sanitizeExternalRelayUrls([
						...t?.relayHints ?? [],
						...e.relayUrls,
						...t?.acceptedRelays ?? []
					], { limit: n.EXTERNAL_INPUT_RELAY_LIMIT }), v = {
						id: e.event.id,
						eventId: e.event.id,
						pubkeyHex: t?.pubkeyHex ?? e.event.pubkey,
						kind: !m && t ? t.kind : e.event.kind,
						content: !m && t ? t.content : e.event.content,
						tags: !m && t ? t.tags.map((e) => [...e]) : e.event.tags.map((e) => [...e]),
						createdAt: !m && t ? t.createdAt : e.event.created_at,
						postedAt: t?.postedAt ?? Yt(e.event.created_at),
						relayHints: te,
						acceptedRelays: t?.acceptedRelays ?? [],
						...i.length > 0 ? { fetchedRelays: i } : {},
						media: P(e.event.kind) ? [] : !m && t ? Vt(t.media) : M(e.event),
						rawEvent: !m && t ? t.rawEvent : f(e.event),
						rawEventVerification: !m && t ? t.rawEventVerification : { ...Rt },
						fetchedAt: r,
						lastSeenAt: r,
						..._.channelEventId ? { channelEventId: _.channelEventId } : t?.channelEventId ? { channelEventId: t.channelEventId } : {},
						..._.channelRelayHints ? { channelRelayHints: _.channelRelayHints } : t?.channelRelayHints ? { channelRelayHints: [...t.channelRelayHints] } : {},
						...t?.deletedAt === void 0 ? {} : { deletedAt: t.deletedAt },
						...t?.deletionEventId ? { deletionEventId: t.deletionEventId } : {},
						updatedAt: this.now(),
						...t?.repostTarget && F(e.event) && L(t.repostTarget.rawEvent, t.repostTarget.relayHints, F(e.event)) ? { repostTarget: t.repostTarget } : {},
						schemaVersion: 2
					}, y = !1;
					t ? en(t, v) ? (s += 1, y = !0) : c += 1 : (o += 1, y = !0);
					let b = (ee.get(e.event.id) ?? []).flatMap((e) => {
						if (!(et(v.kind) && v.pubkeyHex === e.targetAuthorPubkey && v.pubkeyHex === e.deletionEventPubkey)) return [];
						if (!rt(e)) {
							let t = {
								...e,
								targetVerified: !0,
								updatedAt: this.now(),
								schemaVersion: 2
							};
							return g.push(t), [t];
						}
						return [e];
					}).sort(it);
					return v.deletedAt !== void 0 || b.length === 0 ? (y && u.add(v.pubkeyHex), v) : (l += 1, u.add(v.pubkeyHex), {
						...v,
						...at(b[0]),
						updatedAt: this.now()
					});
				});
				if (g.length > 0 && await this.db.postHistoryDeletionRequests.bulkPut(g), await this.db.postHistory.bulkPut(_), e.relayFetchCoverage && (await p.record(e.relayFetchCoverage), !await p.isCurrent(e.relayFetchCoverage))) throw new H();
				e.localBrowsingWrite && await new It(this.db, this.now).record(e.localBrowsingWrite), await C(this.db, e.localWriteScope);
			});
		} catch (e) {
			if (e instanceof w) return {
				insertedCount: 0,
				updatedCount: 0,
				unchangedCount: 0,
				appliedDeletionCount: 0,
				applied: !1
			};
			throw e;
		}
		u.forEach(z);
		for (let e of t) A(e.event) && At(e.event.id, this.db, this.now).catch(() => {
			this.console.warn("post_history_sensitive_payload_deletion_reconcile_failed", e.event.id);
		});
		return {
			insertedCount: o,
			updatedCount: s,
			unchangedCount: c,
			appliedDeletionCount: l
		};
	}
	async getOldestCreatedAt(e) {
		return e ? (await this.db.postHistory.where("[pubkeyHex+createdAt]").between([e, g.minKey], [e, g.maxKey]).filter(J).first())?.createdAt ?? null : null;
	}
	async markDeleted(e, t, n = this.now()) {
		let r = null;
		await this.db.transaction("rw", this.db.postHistory, async () => {
			let i = await this.db.postHistory.get(e);
			!i || i.deletedAt === n && i.deletionEventId === t || (await this.db.postHistory.put({
				...i,
				deletedAt: n,
				deletionEventId: t,
				updatedAt: this.now()
			}), r = i.pubkeyHex);
		}), r && z(r);
	}
	async deleteForPubkey(e) {
		e && await this.db.transaction("rw", [this.db.postHistory, ...Mt(this.db)], async () => (await new V(this.db, this.now).clearForPubkey(e), this.db.postHistory.where("pubkeyHex").equals(e).delete())) > 0 && z(e);
	}
	async deleteLocalHistoryForPubkey(e) {
		if (!e) return;
		let { deletedPostHistoryCount: t, deletedPayloadCount: n } = await Pt(this.db, e, this.now);
		(t > 0 || n > 0) && z(e);
	}
}();
function nn(e) {
	if (e.kind !== 36) return !1;
	let t = e.tags.filter((e) => e[0] === "k");
	return t.length === 1 && t[0].length >= 2 && Je.some((e) => t[0][1] === String(e));
}
var rn = new class {
	db;
	now;
	constructor(e = m, t = Date.now) {
		this.db = e, this.now = t;
	}
	async putCandidate(e) {
		let t = Re(e.event, e.attestation) ? l(e.event) : O(e.event)?.event;
		if (!t || !nn(t)) throw Error("invalid_sensitive_payload_candidate");
		await this.db.transaction("rw", [this.db.sensitivePayloads, ...e.localWriteScope ? [this.db.postHistoryWriteGeneration] : []], async () => {
			await C(this.db, e.localWriteScope);
			let r = await this.db.sensitivePayloads.get(t.id);
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
			return await this.db.sensitivePayloads.put(i), await C(this.db, e.localWriteScope), !0;
		}) && (z(t.pubkey), await jt(t.id, this.db, this.now));
	}
	async getByIds(e) {
		let t = [...new Set(e.filter((e) => /^[0-9a-f]{64}$/.test(e)))];
		return t.length === 0 ? [] : this.db.sensitivePayloads.where("id").anyOf(t).toArray();
	}
	async getAllForPubkey(e) {
		return this.db.sensitivePayloads.where("pubkeyHex").equals(e).toArray();
	}
	async markDeleted(e) {
		let t = await this.db.sensitivePayloads.get(e.id);
		t && t.pubkeyHex === e.pubkeyHex && (await this.db.sensitivePayloads.put({
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
// D:/ドキュメント/GitHub/ehagaki/src/lib/postReactionUtils.ts
var an = [
	1,
	6,
	7,
	16,
	42,
	1111
];
function on(e) {
	return an.includes(e);
}
function sn(e, t, r, i, a, o) {
	let s = N(e);
	if (!s || !on(s.event.kind)) throw Error("invalid_reaction_target");
	let c = s.event, l = n.sanitizeExternalRelayUrls([...i])[0], u = ue(r), d = [
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
function cn(e) {
	return n.sanitizeExternalRelayUrls(e ?? [], { limit: n.EXTERNAL_INPUT_RELAY_LIMIT });
}
function ln(e) {
	return e.sort((e, t) => e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) : e.createdAt - t.createdAt);
}
function un(e, t) {
	return e.length === t.length && e.every((e, n) => B(e, t[n]));
}
function dn(e) {
	return e === 1 || e === 7 || e === 42 || e === 1111;
}
function fn(e) {
	return e.kind === 1 || e.kind === 42 || e.kind === 1111 ? c(e).parentId : e.kind === 7 ? X(e).reference?.eventId ?? null : null;
}
function pn(e) {
	if (e.kind === 1 || e.kind === 42 || e.kind === 1111) return c(e).rootId ?? void 0;
}
function mn(e) {
	return e.kind === 7 ? ["reaction"] : ["direct-reply"];
}
function hn(e) {
	return e.filter((e) => e.kind === 1 || e.kind === 42 || e.kind === 1111);
}
function gn(e) {
	return e.filter((e) => e.kind === 7);
}
function _n(e, t) {
	return e.parentEventId !== t.parentEventId || e.rootEventId !== t.rootEventId || e.authorPubkey !== t.authorPubkey || e.kind !== t.kind || e.content !== t.content || e.createdAt !== t.createdAt || !B(e.relayUrls, t.relayUrls) || !B(e.discoveredAs, t.discoveredAs) || !un(e.tags, t.tags) || !a(e.rawEvent, t.rawEvent);
}
var vn = new class {
	db;
	now;
	console;
	reactionRepairPromise;
	constructor(e = m, t = Date.now, n = globalThis.console === void 0 ? {
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
		await this.db.transaction("rw", this.db.postHistoryChildInteractions, this.db.postHistory, async () => {
			let e = await this.db.postHistoryChildInteractions.where("kind").equals(7).toArray(), t = [], n = [];
			for (let r of e) {
				if (r.id !== r.eventId || !s(r.rawEvent, {
					...r,
					pubkeyHex: r.authorPubkey
				})) {
					n.push(r.id);
					continue;
				}
				let e = O(r.rawEvent), i = e ? X(e.event).reference : null;
				!i || i.eventId === r.eventId ? n.push(r.id) : t.push({
					record: r,
					reference: i
				});
			}
			let r = Array.from(new Set(t.map(({ reference: e }) => e.eventId))), i = await this.db.postHistory.bulkGet(r), a = new Map(i.flatMap((e) => e ? [[e.eventId, e]] : [])), o = [];
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
			n.length && await this.db.postHistoryChildInteractions.bulkDelete(n), o.length && await this.db.postHistoryChildInteractions.bulkPut(o);
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
		let n = await this.db.postHistoryChildInteractions.where("[parentEventId+createdAt]").between([e, g.minKey], [e, g.maxKey]).toArray();
		return ln(t ? await this.filterKnownReactionTargets(n, [t]) : n);
	}
	async getChildInteractionsForParents(e, t) {
		let n = Array.from(new Set(e.filter((e) => !!e)));
		if (n.length === 0) return [];
		await this.ensureSavedReactionsRepaired();
		let r = await this.db.postHistoryChildInteractions.where("parentEventId").anyOf(n).toArray();
		return t ? this.filterKnownReactionTargets(r, t) : r;
	}
	async getDirectReplyInteractions(e) {
		return hn(await this.getChildInteractions(e));
	}
	async getReactionInteractions(e) {
		return gn(await this.getChildInteractions(e));
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
			if (!t?.event?.id || !dn(t.event.kind) || fn(t.event) !== e.parentEventId || t.event.id === e.parentEventId) {
				n += 1;
				continue;
			}
			let i = r.get(t.event.id);
			i && !a(i.event, t.event) ? (this.console.warn("post_history_child_interaction_conflict", t.event.id), n += 1) : r.set(t.event.id, {
				event: t.event,
				relayUrls: cn([...i?.relayUrls ?? [], ...t.relayUrls ?? []])
			});
		}
		let i = Array.from(r.values());
		if (i.length === 0) return {
			insertedCount: 0,
			updatedCount: 0,
			unchangedCount: 0,
			ignoredCount: n
		};
		let o = 0, s = 0, c = 0;
		return await this.db.transaction("rw", this.db.postHistoryChildInteractions, this.db.postHistory, this.db.postHistoryChildWriteGeneration, async () => {
			if (typeof e.expectedChildGeneration == "number" && await me(this.db) !== e.expectedChildGeneration) return;
			let r = i.some((e) => e.event.kind === 7) ? await this.db.postHistory.get(e.parentEventId) : void 0, a = [...e.reactionTarget ? [e.reactionTarget] : [], ...r ? [{
				eventId: r.eventId,
				targetAuthorPubkey: r.pubkeyHex,
				targetKind: r.kind
			}] : []], l = i.filter((e) => {
				if (e.event.kind !== 7) return !0;
				let t = X(e.event).reference;
				return !t || a.some((e) => !Z(t, e)) ? (n += 1, !1) : !0;
			});
			if (l.length === 0) return;
			let u = l.map((e) => e.event.id), d = await this.db.postHistoryChildInteractions.bulkGet(u), p = /* @__PURE__ */ new Map();
			d.forEach((e) => {
				e && p.set(e.eventId, e);
			});
			let m = l.map((n) => {
				let r = p.get(n.event.id), i = cn([...r?.relayUrls ?? [], ...n.relayUrls ?? []]), a = pn(n.event), l = Array.from(/* @__PURE__ */ new Set([...r?.discoveredAs ?? [], ...mn(n.event)])), u = {
					id: n.event.id,
					eventId: n.event.id,
					parentEventId: e.parentEventId,
					...a ? { rootEventId: a } : {},
					authorPubkey: n.event.pubkey,
					kind: n.event.kind,
					content: n.event.content,
					tags: n.event.tags.map((e) => [...e]),
					createdAt: n.event.created_at,
					relayUrls: i,
					discoveredAs: l,
					rawEvent: f(n.event),
					fetchedAt: t ?? r?.fetchedAt ?? 0,
					updatedAt: this.now(),
					schemaVersion: 1
				};
				return r ? _n(r, u) ? s += 1 : c += 1 : o += 1, u;
			});
			await this.db.postHistoryChildInteractions.bulkPut(m);
		}), {
			insertedCount: o,
			updatedCount: s,
			unchangedCount: c,
			ignoredCount: n
		};
	}
	async deleteChildInteractionsForParent(e) {
		e && await this.db.postHistoryChildInteractions.where("parentEventId").equals(e).delete();
	}
	async deleteChildInteractionsForParents(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		t.length !== 0 && await this.db.transaction("rw", this.db.postHistoryChildInteractions, async () => {
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
}(), yn = 3e3, bn = 3e5, xn = 15e3, Sn = 4;
function Cn(e, t) {
	if (!e || typeof e != "object") return !1;
	let n = e;
	return n.kind === 10002 && n.pubkey === t && typeof n.id == "string" && /^[0-9a-f]{64}$/i.test(n.id) && typeof n.created_at == "number" && Number.isSafeInteger(n.created_at) && n.created_at >= 0 && Array.isArray(n.tags);
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
function wn(e) {
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
var Tn = class {
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
		let i = n.sanitizeExternalRelayUrls(y() ? b() : r), a = n.sanitizeExternalRelayUrls([...i, ...t.discoveryRelays ?? []]), o = this.cache.get(e), s = !!o && o.expiresAt > this.now(), c = this.inFlight.get(e);
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
					expiresAt: this.now() + (t.status === "found" ? bn : xn),
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
			n.resolveOnReadRoute && (t.candidateListeners.add(u), u()), !a && Number.isFinite(r) && (o = n.operation ?? new ce(r - this.now(), l, {
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
		this.activeLookups >= Sn ? await new Promise((e) => this.queue.push(e)) : this.activeLookups += 1;
		try {
			return await e();
		} finally {
			let e = this.queue.shift();
			e ? e() : --this.activeLookups;
		}
	}
	fetchLatest(e, t, n) {
		return t.length === 0 ? Promise.resolve(Q(e, "network-error")) : new Promise((r) => {
			let i = se(), a, o, s = !1, c, l = () => {
				o?.unsubscribe?.(), o = void 0;
			}, u = (t = !1) => {
				s || (s = !0, l(), r(a || Q(e, t ? "network-error" : "not-found")));
			};
			try {
				let r = ae(this.rxNostr, i, { on: { relays: t } }, {
					timeoutMs: yn,
					now: this.now,
					setTimeoutFn: this.setTimeoutFn,
					clearTimeoutFn: this.clearTimeoutFn,
					onEnd: (e) => {
						c = e;
					}
				}).subscribe({
					next: (t) => {
						if (s || !Cn(t.event, e)) return;
						let r = this.now(), i = wn(t.event);
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
}, En = /* @__PURE__ */ new WeakMap();
function Dn(e) {
	let t = En.get(e);
	return t || (t = new Tn(e), En.set(e, t)), t;
}
export { ke as $, M as A, Xe as B, ft as C, I as D, ht as E, et as F, qe as G, A as H, j as I, He as J, k as K, st as L, it as M, tt as N, gt as O, rt as P, O as Q, ot as R, P as S, vt as T, Ye as U, Ze as V, Qe as W, We as X, Ue as Y, Ie as Z, Tt as _, Z as a, Ee as at, _t as b, tn as c, T as ct, jt as d, C as dt, Pe as et, At as f, me as ft, z as g, Et as h, on as i, Ve as it, nt as j, N as k, Lt as l, Ce as lt, B as m, vn as n, Be as nt, X as o, Te as ot, kt as p, S as pt, Ke as q, sn as r, Fe as rt, rn as s, we as st, Dn as t, Re as tt, Nt as u, w as ut, wt as v, mt as w, F as x, xt as y, at as z };
