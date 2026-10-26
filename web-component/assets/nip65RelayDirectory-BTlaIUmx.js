import { d as e, f as t, n, r, t as i } from "./relayConfigUtils-DD5f1UAM.js";
import { a, d as o, i as s, l as c, n as l, o as u, r as d, t as f, u as p } from "./postHistoryEventUtils-CUIBkIiy.js";
import { Ct as m, St as h, bt as g, xt as _ } from "./LoadingPlaceholder-j1_vRYno.js";
import { _ as v, c as ee, g as y } from "./signedEventResultValidator-vNb8KnFy.js";
import { m as b, p as te } from "./relayStore.svelte-BIc4bQdy.js";
import { Tt as ne } from "./appUtils-C7IXsQBk.js";
import { t as re } from "./rx-nostr-BHeS362x.js";
import { c as x, f as S, h as ie, m as C } from "./legacyImportMarkers-CZ4J2IrE.js";
import { d as ae } from "./clipboardUtils-CZAthnT_.js";
import { i as oe } from "./reactionValue-CpLSKf5v.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/isFunction.js
function w(e) {
	return typeof e == "function";
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
function se(e) {
	var t = e(function(e) {
		Error.call(e), e.stack = (/* @__PURE__ */ Error()).stack;
	});
	return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
var ce = se(function(e) {
	return function(t) {
		e(this), this.message = t ? t.length + " errors occurred during unsubscription:\n" + t.map(function(e, t) {
			return t + 1 + ") " + e.toString();
		}).join("\n  ") : "", this.name = "UnsubscriptionError", this.errors = t;
	};
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
function le(e, t) {
	if (e) {
		var n = e.indexOf(t);
		0 <= n && e.splice(n, 1);
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/Subscription.js
var ue = function() {
	function e(e) {
		this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null;
	}
	return e.prototype.unsubscribe = function() {
		var e, t, n, r, i;
		if (!this.closed) {
			this.closed = !0;
			var a = this._parentage;
			if (a) {
				if (this._parentage = null, Array.isArray(a)) try {
					for (var o = m(a), s = o.next(); !s.done; s = o.next()) s.value.remove(this);
				} catch (t) {
					e = { error: t };
				} finally {
					try {
						s && !s.done && (t = o.return) && t.call(o);
					} finally {
						if (e) throw e.error;
					}
				}
				else a.remove(this);
			}
			var c = this.initialTeardown;
			if (w(c)) try {
				c();
			} catch (e) {
				i = e instanceof ce ? e.errors : [e];
			}
			var l = this._finalizers;
			if (l) {
				this._finalizers = null;
				try {
					for (var u = m(l), d = u.next(); !d.done; d = u.next()) {
						var f = d.value;
						try {
							fe(f);
						} catch (e) {
							i ??= [], e instanceof ce ? i = h(h([], _(i)), _(e.errors)) : i.push(e);
						}
					}
				} catch (e) {
					n = { error: e };
				} finally {
					try {
						d && !d.done && (r = u.return) && r.call(u);
					} finally {
						if (n) throw n.error;
					}
				}
			}
			if (i) throw new ce(i);
		}
	}, e.prototype.add = function(t) {
		if (t && t !== this) {
			if (this.closed) fe(t);
			else {
				if (t instanceof e) {
					if (t.closed || t._hasParent(this)) return;
					t._addParent(this);
				}
				(this._finalizers = this._finalizers ?? []).push(t);
			}
		}
	}, e.prototype._hasParent = function(e) {
		var t = this._parentage;
		return t === e || Array.isArray(t) && t.includes(e);
	}, e.prototype._addParent = function(e) {
		var t = this._parentage;
		this._parentage = Array.isArray(t) ? (t.push(e), t) : t ? [t, e] : e;
	}, e.prototype._removeParent = function(e) {
		var t = this._parentage;
		t === e ? this._parentage = null : Array.isArray(t) && le(t, e);
	}, e.prototype.remove = function(t) {
		var n = this._finalizers;
		n && le(n, t), t instanceof e && t._removeParent(this);
	}, e.EMPTY = (function() {
		var t = new e();
		return t.closed = !0, t;
	})(), e;
}();
ue.EMPTY;
function de(e) {
	return e instanceof ue || e && "closed" in e && w(e.remove) && w(e.add) && w(e.unsubscribe);
}
function fe(e) {
	w(e) ? e() : e.unsubscribe();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/config.js
var T = {
	onUnhandledError: null,
	onStoppedNotification: null,
	Promise: void 0,
	useDeprecatedSynchronousErrorHandling: !1,
	useDeprecatedNextContext: !1
}, E = {
	setTimeout: function(e, t) {
		var n = [...arguments].slice(2), r = E.delegate;
		return r?.setTimeout ? r.setTimeout.apply(r, h([e, t], _(n))) : setTimeout.apply(void 0, h([e, t], _(n)));
	},
	clearTimeout: function(e) {
		return (E.delegate?.clearTimeout || clearTimeout)(e);
	},
	delegate: void 0
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
function pe(e) {
	E.setTimeout(function() {
		var t = T.onUnhandledError;
		if (t) t(e);
		else throw e;
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/noop.js
function me() {}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
var he = (function() {
	return ve("C", void 0, void 0);
})();
function ge(e) {
	return ve("E", void 0, e);
}
function _e(e) {
	return ve("N", e, void 0);
}
function ve(e, t, n) {
	return {
		kind: e,
		value: t,
		error: n
	};
}
function ye(e) {
	T.useDeprecatedSynchronousErrorHandling;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/Subscriber.js
var be = function(e) {
	g(t, e);
	function t(t) {
		var n = e.call(this) || this;
		return n.isStopped = !1, t ? (n.destination = t, de(t) && t.add(n)) : n.destination = De, n;
	}
	return t.create = function(e, t, n) {
		return new we(e, t, n);
	}, t.prototype.next = function(e) {
		this.isStopped ? Ee(_e(e), this) : this._next(e);
	}, t.prototype.error = function(e) {
		this.isStopped ? Ee(ge(e), this) : (this.isStopped = !0, this._error(e));
	}, t.prototype.complete = function() {
		this.isStopped ? Ee(he, this) : (this.isStopped = !0, this._complete());
	}, t.prototype.unsubscribe = function() {
		this.closed || (this.isStopped = !0, e.prototype.unsubscribe.call(this), this.destination = null);
	}, t.prototype._next = function(e) {
		this.destination.next(e);
	}, t.prototype._error = function(e) {
		try {
			this.destination.error(e);
		} finally {
			this.unsubscribe();
		}
	}, t.prototype._complete = function() {
		try {
			this.destination.complete();
		} finally {
			this.unsubscribe();
		}
	}, t;
}(ue), xe = Function.prototype.bind;
function Se(e, t) {
	return xe.call(e, t);
}
var Ce = function() {
	function e(e) {
		this.partialObserver = e;
	}
	return e.prototype.next = function(e) {
		var t = this.partialObserver;
		if (t.next) try {
			t.next(e);
		} catch (e) {
			D(e);
		}
	}, e.prototype.error = function(e) {
		var t = this.partialObserver;
		if (t.error) try {
			t.error(e);
		} catch (e) {
			D(e);
		}
		else D(e);
	}, e.prototype.complete = function() {
		var e = this.partialObserver;
		if (e.complete) try {
			e.complete();
		} catch (e) {
			D(e);
		}
	}, e;
}(), we = function(e) {
	g(t, e);
	function t(t, n, r) {
		var i = e.call(this) || this, a;
		if (w(t) || !t) a = {
			next: t ?? void 0,
			error: n ?? void 0,
			complete: r ?? void 0
		};
		else {
			var o;
			i && T.useDeprecatedNextContext ? (o = Object.create(t), o.unsubscribe = function() {
				return i.unsubscribe();
			}, a = {
				next: t.next && Se(t.next, o),
				error: t.error && Se(t.error, o),
				complete: t.complete && Se(t.complete, o)
			}) : a = t;
		}
		return i.destination = new Ce(a), i;
	}
	return t;
}(be);
function D(e) {
	T.useDeprecatedSynchronousErrorHandling ? ye(e) : pe(e);
}
function Te(e) {
	throw e;
}
function Ee(e, t) {
	var n = T.onStoppedNotification;
	n && E.setTimeout(function() {
		return n(e, t);
	});
}
var De = {
	closed: !0,
	next: me,
	error: Te,
	complete: me
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/lift.js
function Oe(e) {
	return w(e?.lift);
}
function ke(e) {
	return function(t) {
		if (Oe(t)) return t.lift(function(t) {
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
function Ae(e, t, n, r, i) {
	return new je(e, t, n, r, i);
}
var je = function(e) {
	g(t, e);
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
}(be);
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/map.js
function Me(e, t) {
	return ke(function(n, r) {
		var i = 0;
		n.subscribe(Ae(r, function(n) {
			r.next(e.call(t, n, i++));
		}));
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/operators/filter.js
function Ne(e, t) {
	return ke(function(n, r) {
		var i = 0;
		n.subscribe(Ae(r, function(n) {
			return e.call(t, n, i++) && r.next(n);
		}));
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelayCoverage.ts
function O(e) {
	let t = e.filter((e) => e && Number.isSafeInteger(e.since) && Number.isSafeInteger(e.until) && e.since >= 0 && e.until >= e.since && e.until < 2 ** 53 - 1).map((e) => ({ ...e })).sort((e, t) => e.since - t.since || e.until - t.until), n = [];
	for (let e of t) {
		let t = n.at(-1);
		t && e.since <= t.until + 1 ? t.until = Math.max(t.until, e.until) : n.push(e);
	}
	return n;
}
function Pe(e, t) {
	let n = new Set(t);
	if (!n.size) return [];
	let r = /* @__PURE__ */ new Map();
	for (let t of n) {
		let n = O(e.filter((e) => e.relayUrl === t).flatMap((e) => e.ranges));
		for (let { since: e, until: t } of n) r.set(e, (r.get(e) ?? 0) + 1), r.set(t + 1, (r.get(t + 1) ?? 0) - 1);
	}
	let i = Math.ceil(n.size / 2), a = [], o = 0, s = null;
	for (let [e, t] of [...r].sort(([e], [t]) => e - t)) o += t, o >= i && s === null && (s = e), o < i && s !== null && (a.push({
		since: s,
		until: e - 1
	}), s = null);
	return O(a);
}
function Fe(e, t) {
	return O(e).find((e) => e.since <= t && e.until >= t)?.since ?? t;
}
function Ie(e) {
	if (e.cancelled) return [];
	let t = e.since ?? e.oldestCreatedAt;
	return t == null ? [] : e.outcomes.flatMap((n) => {
		if (!n.eoseReceived || !n.verificationDrained || n.termination !== "eose" || n.saturated && n.oldestCreatedAt === null) return [];
		let r = O([{
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
var Le = 1e4;
function Re(e) {
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
		), { type: "module" }), n = y({
			worker: t,
			timeout: Le,
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
				l = setTimeout(() => u(/* @__PURE__ */ Error("post_history_import_worker_readiness_timeout"), !0), Le);
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
				}, s = (e) => o(e), c = setTimeout(() => u(/* @__PURE__ */ Error("post_history_import_worker_verification_timeout"), !0), Le);
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
function ze(e = {}) {
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
			let n = Re({
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
function Be(e = {}) {
	let t = ze(e);
	return {
		ready: t.ready,
		async verify(e) {
			let n = null;
			try {
				u(e) && (n = l(e));
			} catch {}
			if (await t.ready, t.assertActive(), !n) return null;
			let r = await t.verify(n);
			return t.assertActive(), r ? Je(n, "full") : null;
		},
		dispose: t.dispose
	};
}
var Ve = /* @__PURE__ */ new WeakMap(), He = /* @__PURE__ */ new WeakMap(), Ue = /* @__PURE__ */ new WeakMap(), We = /* @__PURE__ */ new WeakMap();
function Ge(e, t = 1024, n = 64) {
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = null, o = 0;
	return {
		verify: async (s) => {
			if (!a || s.pubkey !== a.owner || !a.kinds.includes(s.kind)) return e(s);
			if (!u(s)) return !1;
			let c = l(s), d = k(c);
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
			return m && k(s) === d;
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
function Ke(e, t) {
	We.set(e, t);
}
function qe(e, t, n) {
	return We.get(e)?.acquire(t, n) ?? (() => void 0);
}
function k(t) {
	if (!e(t)) return null;
	try {
		let e = v(t);
		return e === t.id ? `${e}\u0000${t.id}\u0000${t.sig}` : null;
	} catch {
		return null;
	}
}
function Je(e, t) {
	let n = l(e), r = k(n);
	if (!r) return null;
	let i = {};
	return Ve.set(i, {
		fingerprint: r,
		ruleVersion: 1,
		evidence: t
	}), He.set(n, i), {
		event: n,
		attestation: i
	};
}
function A(e) {
	try {
		if (!u(e)) return null;
		let n = l(e), r = k(n);
		if (!r || !t(n)) return null;
		let i = {};
		return Ve.set(i, {
			fingerprint: r,
			ruleVersion: 1,
			evidence: "full"
		}), He.set(n, i), {
			event: n,
			attestation: i
		};
	} catch {
		return null;
	}
}
function Ye(e, t) {
	let n = t ?? (typeof e == "object" && e ? He.get(e) : void 0);
	if (!n || typeof n != "object") return !1;
	let r = Ve.get(n);
	return !r || r.ruleVersion !== 1 ? !1 : k(e) === r.fingerprint;
}
function Xe(e) {
	return { use(t, n) {
		return e.use(t, n).pipe(Me((e) => {
			let t = e.event;
			if (!t) return null;
			let n = Je(t, "rx-nostr-signature");
			return n ? {
				...e,
				...n
			} : null;
		}), Ne((e) => e !== null));
	} };
}
function Ze(e) {
	let t = Xe(e);
	return Ue.set(e, t), t;
}
function Qe(e, t, n) {
	return (Ue.get(e) ?? Xe(e)).use(t, n);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryKinds.ts
var $e = [
	1,
	6,
	16,
	42,
	1111
], et = $e.join(",");
function tt(e) {
	return $e.includes(e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/sensitiveEventUtils.ts
var nt = 1111;
function rt(e) {
	return e.channel ? 42 : e.hasReply ? e.replyKind === 1 ? 1 : e.replyKind === 1111 ? nt : null : 1;
}
function it(e, t = "") {
	let r = n.sanitizeExternalRelayUrls(t ? [t] : [], { limit: 1 })[0] ?? "";
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
function j(n) {
	try {
		if (!u(n)) return !1;
		let r = l(n);
		return e(r) && t(r);
	} catch {
		return !1;
	}
}
var at = [
	1,
	42,
	1111
];
function M(e) {
	if (!at.includes(e.kind) || e.content !== "" || !e.tags.some((e) => e[0] === "content-warning")) return null;
	let t = e.tags.filter((e) => e[0] === "c");
	if (t.length !== 1) return null;
	let n = t[0];
	return !o(n[1]) || n.length > 3 ? null : {
		eventId: n[1],
		relayHint: n[2] || null
	};
}
function ot(e) {
	return M(e) !== null && j(e);
}
function st(e, t, n, r) {
	return {
		kind: 36,
		pubkey: n,
		created_at: r,
		content: t,
		tags: [["k", String(e)]]
	};
}
function ct(e, t, n) {
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
function lt(e, t, n = M(e)?.eventId) {
	if (!n || !ot(e) || !t || t.id !== n || t.kind !== 36 || t.pubkey !== e.pubkey || !j(t)) return !1;
	let r = t.tags.filter((e) => e[0] === "k");
	return r.length === 1 && r[0].length >= 2 && r[0][1] === String(e.kind);
}
var ut = /* @__PURE__ */ new Set([
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
function dt(e) {
	return ut.has(e);
}
function ft(e) {
	if (!e || e.kind !== 5) return [];
	let t = e.tags.filter((e) => e[0] === "e" && typeof e[1] == "string" && e[1].length > 0).map((e) => e[1]);
	return Array.from(new Set(t));
}
function pt(e, t) {
	return !e || !t || e.kind !== 5 || e.pubkey !== t.pubkey ? !1 : ft(e).includes(t.id);
}
function mt(e, t, n) {
	return `${e}:${t}:${n}`;
}
function ht(e) {
	return e.targetVerified !== !1;
}
function gt(e, t) {
	return e.deletedAt - t.deletedAt || e.deletionEventId.localeCompare(t.deletionEventId);
}
function _t(e) {
	return {
		deletedAt: e.deletedAt * 1e3,
		deletionEventId: e.deletionEventId
	};
}
function vt(e, t = Date.now) {
	let { deletionEvent: r } = e;
	return {
		id: mt(r.pubkey, e.targetEventId, r.id),
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
function yt(e, t = Date.now) {
	let { deletionEvent: n, targetEvent: r } = e;
	return !n.id || !pt(n, r) ? null : vt({
		deletionEvent: n,
		targetEventId: r.id,
		targetVerified: !0,
		relayUrls: e.relayUrls,
		fetchedAt: e.fetchedAt
	}, t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryMediaUtils.ts
function bt(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.slice(1)) {
		let e = n.indexOf(" ");
		e <= 0 || t.set(n.slice(0, e), n.slice(e + 1));
	}
	let n = t.get("url"), r = n ? ee(n) : "";
	if (!r) return null;
	let i = t.get("size"), a = i ? Number(i) : void 0, o = typeof a == "number" && Number.isFinite(a) && a > 0 ? a : void 0;
	return {
		url: r,
		mimeType: t.get("m") || void 0,
		alt: t.get("alt") || void 0,
		blurhash: t.get("blurhash") || void 0,
		dim: t.get("dim") || void 0,
		size: o,
		uploadProtocol: xt(t.get("uploadProtocol"))
	};
}
function xt(e) {
	return e === "blossom" || e === "nip96" || e === "custom-http" ? e : void 0;
}
function St(e) {
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
function Ct(e, t) {
	return ae(e).filter((e) => e.isValidHttpUrl).map((e) => e.displayText).map((e) => ee(e)).filter((e) => e.length > 0).filter((e) => !t.has(e) && /\.(jpe?g|png|webp|gif|mp4|webm|mov)(?:$|[?#])/i.test(e)).map((e) => ({
		url: e,
		mimeType: St(e)
	}));
}
function N(e) {
	let t = e.tags.filter((e) => e[0] === "imeta").map(bt).filter((e) => e !== null), n = new Set(t.map((e) => e.url));
	return t.push(...Ct(e.content, n)), t;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relatedEventVerification.ts
function wt(e, t) {
	let n = A(e);
	return !n || t && (n.event.id !== t.eventId || t.authorHint && n.event.pubkey !== t.authorHint || t.authorHints?.length && !t.authorHints.includes(n.event.pubkey) || t.targetKindHint != null && n.event.kind !== t.targetKindHint) ? null : n;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postRepostUtils.ts
function P(e) {
	return e === 6 || e === 16;
}
function Tt(e) {
	return e === 1 || e === 42 || e === 1111;
}
function Et(e, t, n = [
	1,
	42,
	1111
]) {
	return e === 6 ? t === 1 ? "supported" : "outer-target-kind-mismatch" : t === 1 ? "outer-target-kind-mismatch" : n.includes(t) ? "supported" : "unsupported-target-kind";
}
function Dt(e) {
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
	return Dt(e).reference;
}
function I(e, t) {
	return wt(e, t);
}
function Ot(e, t, n) {
	let r = Dt(e), i = r.reference, a = {
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
		let e = Et(i.outerKind, t.event.kind, n);
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
function kt(e, t) {
	let n = I(e, t);
	return n && Et(t.outerKind, n.event.kind) === "supported" ? n : null;
}
function L(e, t = [], r) {
	let i = r ? kt(e, r) : I(e);
	return !i || !Tt(i.event.kind) ? null : {
		rawEvent: l(i.event),
		rawEventVerification: {
			status: "valid",
			ruleVersion: 1
		},
		relayHints: n.sanitizeExternalRelayUrls(t)
	};
}
function At(e, t, r, i, a) {
	let o = I(e), s = n.sanitizeExternalRelayUrls([r])[0];
	if (!o || !Tt(o.event.kind) || !s) throw Error("invalid_repost_target");
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
function jt(e, t = []) {
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
		media: N(e),
		...d(e),
		rawEvent: e,
		updatedAt: 0,
		schemaVersion: 2
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryLatestRequest.ts
var Mt = /* @__PURE__ */ new Map();
function Nt(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function Pt(e) {
	let t = Nt(e.pubkeyHex);
	t && e.eventId && Mt.set(t, {
		pubkeyHex: t,
		eventId: e.eventId,
		requestedAt: e.requestedAt ?? Date.now()
	});
}
function Ft(e) {
	let t = Nt(e);
	if (!t) return null;
	let n = Mt.get(t) ?? null;
	return Mt.delete(t), n;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryLocalSearchRevision.ts
var It = /* @__PURE__ */ new Map(), Lt = 0;
function Rt(e) {
	return It.get(e) ?? 0;
}
function R(e) {
	It.set(e, Rt(e) + 1);
}
function zt() {
	return Lt;
}
function Bt() {
	Lt += 1;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/arrayEqualityUtils.ts
function z(e, t) {
	let n = e ?? [], r = t ?? [];
	return n.length === r.length && n.every((e, t) => e === r[t]);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryLocalWriteScope.ts
var Vt = "global";
async function B(e, t) {
	if (!e.isOpen()) return 0;
	let n = (await e.postHistoryWriteGeneration.get(t))?.value;
	return typeof n == "number" && Number.isSafeInteger(n) ? n : 0;
}
async function Ht(e, t) {
	return t.isActive() && await B(e, t.ownerPubkeyHex) === t.expectedRevision && t.isActive();
}
async function V(e, t) {
	if (t && !await Ht(e, t)) throw new H();
}
async function Ut(e, t, n) {
	let r = await B(e, t);
	await e.postHistoryWriteGeneration.put({
		id: t,
		value: r + 1,
		updatedAt: n
	});
}
function Wt(e) {
	return typeof e == "number" && Number.isSafeInteger(e) && e >= 0 ? e : 0;
}
async function Gt(e) {
	if (!e.isOpen()) return 0;
	let t = C.currentTransaction;
	if (!t || t.db !== e || !t.storeNames.includes("postHistoryChildWriteGeneration")) return Kt(e);
	let n = (await e.postHistoryChildWriteGeneration.get(Vt))?.value;
	return Wt(n);
}
function Kt(e) {
	let t = e.backendDB();
	return t.objectStoreNames.contains("postHistoryChildWriteGeneration") ? new Promise((e, n) => {
		let r = t.transaction("postHistoryChildWriteGeneration", "readonly").objectStore("postHistoryChildWriteGeneration").get(Vt);
		r.onsuccess = () => e(Wt(r.result?.value)), r.onerror = () => n(r.error ?? /* @__PURE__ */ Error("child write generation read failed"));
	}) : Promise.resolve(0);
}
async function qt(e, t) {
	let n = C.currentTransaction;
	n?.db === e && n.storeNames.includes("postHistoryChildWriteGeneration") ? await Jt(e, t) : await e.transaction("rw", e.postHistoryChildWriteGeneration, async () => {
		await Jt(e, t);
	});
}
async function Jt(e, t) {
	let n = await Gt(e);
	await e.postHistoryChildWriteGeneration.put({
		id: Vt,
		value: n + 1,
		updatedAt: t
	});
}
var H = class extends Error {
	constructor() {
		super("Post history operation is no longer active");
	}
}, Yt = "postHistoryRelayCoverage:", U = class {
	db;
	now;
	constructor(e = x, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e, t) {
		let r = (await this.db.postHistoryExternalCoverage.get(Xt(e, t)))?.value;
		return {
			schemaVersion: 1,
			ownerPubkeyHex: e,
			kindsKey: t,
			relays: (r?.schemaVersion === 1 && r.ownerPubkeyHex === e && r.kindsKey === t && Array.isArray(r.relays) ? r.relays : []).flatMap((e) => {
				let t = n.sanitizeExternalRelayUrls([e?.relayUrl])[0];
				return t && Array.isArray(e.ranges) ? [{
					relayUrl: t,
					ranges: O(e.ranges)
				}] : [];
			})
		};
	}
	async getLocalRevision(e) {
		return B(this.db, e);
	}
	async isCurrent(e) {
		return Ht(this.db, e);
	}
	async record(e) {
		if (!await this.isCurrent(e)) throw new W();
		let t = await this.get(e.ownerPubkeyHex, e.kindsKey), r = /* @__PURE__ */ new Map();
		for (let i of [...t.relays, ...e.relays]) {
			let e = n.sanitizeExternalRelayUrls([i.relayUrl])[0];
			e && r.set(e, [...r.get(e) ?? [], ...i.ranges]);
		}
		let i = {
			...t,
			relays: [...r].map(([e, t]) => ({
				relayUrl: e,
				ranges: O(t)
			})).sort((e, t) => e.relayUrl.localeCompare(t.relayUrl))
		};
		if (!e.isActive()) throw new W();
		JSON.stringify(t) !== JSON.stringify(i) && await this.db.postHistoryExternalCoverage.put({
			id: Xt(e.ownerPubkeyHex, e.kindsKey),
			ownerPubkeyHex: e.ownerPubkeyHex,
			value: i,
			updatedAt: this.now()
		});
	}
	async clearForPubkey(e) {
		await this.db.postHistoryExternalCoverage.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryCitrineRanges.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryLocalBrowsingRanges.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryLocalResumeCursor.where("ownerPubkeyHex").equals(e).delete(), await this.db.postHistoryJumpAnchors.delete(e), await Ut(this.db, e, this.now());
	}
};
function Xt(e, t) {
	return `${Yt}${e}:${t}`;
}
var W = class extends H {}, Zt = new U();
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/sensitivePayloadDeletionReconciler.ts
async function Qt(e, t = x, n = Date.now) {
	let r = await t.postHistory.get(e);
	if (!r || !s(r.rawEvent, r)) return !1;
	let i = r.rawEvent, a = M(i);
	if (!a || !j(i)) return !1;
	let o = await t.sensitivePayloads.get(a.eventId);
	if (!o || o.deletedAt !== void 0 || o.pubkeyHex !== i.pubkey || !lt(i, o.rawEvent, a.eventId)) return !1;
	let c = !1;
	return await t.transaction("rw", t.postHistory, t.sensitivePayloads, t.postHistoryDeletionRequests, async () => {
		let r = await t.postHistory.get(e), i = await t.sensitivePayloads.get(a.eventId);
		if (!r || !s(r.rawEvent, r) || !j(r.rawEvent) || !i || i.deletedAt !== void 0 || i.pubkeyHex !== r.pubkeyHex || !lt(r.rawEvent, i.rawEvent, a.eventId)) return;
		let o = (await t.postHistoryDeletionRequests.where("targetEventId").equals(a.eventId).toArray()).filter((e) => {
			if (e.targetAuthorPubkey !== r.pubkeyHex || e.deletionEventPubkey !== r.pubkeyHex || e.rawEventVerification?.status !== "valid" || e.rawEventVerification.ruleVersion !== 1) return !1;
			let t = e.rawEvent;
			return j(t) && pt(t, {
				id: i.id,
				pubkey: i.pubkeyHex
			});
		}).sort(gt);
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
			..._t(l),
			updatedAt: n()
		}), c = !0;
	}), c && R(i.pubkey), c;
}
async function $t(e, t = x, n = Date.now) {
	let r = await t.sensitivePayloads.get(e);
	if (!r || r.deletedAt !== void 0) return;
	let i = await t.postHistoryDeletionRequests.where("targetEventId").equals(e).toArray(), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
	for (let t of i) {
		if (t.rawEventVerification?.status !== "valid" || t.rawEventVerification.ruleVersion !== 1) continue;
		let n = t.rawEvent;
		if (j(n) && n.kind === 5) {
			o.add(n.pubkey);
			for (let t of n.tags) t[0] === "e" && t[1] && t[1] !== e && a.add(t[1]);
		}
	}
	for (let n of o) {
		let r = await t.postHistory.where("pubkeyHex").equals(n).toArray();
		for (let t of r) s(t.rawEvent, t) && M(t.rawEvent)?.eventId === e && a.add(t.eventId);
	}
	for (let e of a) await Qt(e, t, n);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryPersistenceCoordinator.ts
function en(e) {
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
function tn(e) {
	return [
		e.postHistoryExternalCoverage,
		e.postHistoryCitrineRanges,
		e.postHistoryLocalBrowsingRanges,
		e.postHistoryLocalResumeCursor,
		e.postHistoryWriteGeneration
	];
}
async function nn(e, t, n) {
	let r = 0, i = 0;
	return await e.transaction("rw", [
		e.postHistory,
		e.postHistoryChildInteractions,
		e.sensitivePayloads,
		...en(e)
	], async () => {
		await new U(e, n).clearForPubkey(t), await qt(e, n()), i = await e.sensitivePayloads.where("pubkeyHex").equals(t).delete();
		let a = (await e.postHistory.where("pubkeyHex").equals(t).primaryKeys()).map(String);
		a.length > 0 && await e.postHistoryChildInteractions.where("parentEventId").anyOf(a).delete(), r = await e.postHistory.where("pubkeyHex").equals(t).delete();
	}), {
		deletedPostHistoryCount: r,
		deletedPayloadCount: i
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryLocalBrowsingRangesRepository.ts
var rn = "postHistoryLocalBrowsingRanges:", an = class {
	db;
	now;
	constructor(e = x, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e, t, n) {
		let r = ne(n) ?? "", i = await B(this.db, e), a = {
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
			browsingRanges: O(Array.isArray(l.browsingRanges) ? l.browsingRanges : []),
			resumeHint: typeof u == "number" && Number.isSafeInteger(u) && u >= 0 ? { nextUntil: u } : null
		};
	}
	async record(e) {
		await V(this.db, e);
		let t = ne(e.localRelayUrl);
		if (!t) throw Error("Invalid local browsing URL");
		let n = await this.get(e.ownerPubkeyHex, e.kindsKey, t), r = e.resumeHint?.nextUntil, i = n.resumeHint;
		typeof r == "number" && Number.isSafeInteger(r) && r >= 0 && (!e.initializeResumeHintOnly || !i) && (i = { nextUntil: i ? Math.min(i.nextUntil, r) : r });
		let a = {
			...n,
			browsingRanges: O([...n.browsingRanges, ...e.browsingRanges]),
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
		await V(this.db, e);
	}
	key(e, t, n) {
		return `${rn}${e}:${t}:${encodeURIComponent(n)}`;
	}
}, on = new an(), sn = {
	status: "valid",
	ruleVersion: 1
};
function cn(e) {
	return e?.status === "valid" && e.ruleVersion === 1;
}
function ln(e, t) {
	return Ye(e, t) ? {
		event: e,
		attestation: t
	} : A(e);
}
function un(e) {
	return e.map((e) => ({ ...e }));
}
function dn(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 1;
}
function fn(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 50;
}
function G(e) {
	return Number.isFinite(e) ? Math.trunc(e ?? 0) : null;
}
function K(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 50;
}
function pn(e) {
	return Number.isFinite(e) ? Math.trunc(e) : 0;
}
function mn(e) {
	return { contiguous: e?.contiguous !== !1 };
}
function q(e, t) {
	return e.postedAt === t.postedAt ? e.createdAt === t.createdAt ? ie(t.eventId, e.eventId) : t.createdAt - e.createdAt : t.postedAt - e.postedAt;
}
function hn(e, t) {
	return q(e, t) > 0;
}
function gn(e, t) {
	return q(e, t) < 0;
}
function _n(e) {
	return e.sort(q);
}
function J(e, t) {
	return [
		e,
		t.postedAt,
		t.createdAt,
		t.eventId
	];
}
function Y(e) {
	return {
		lower: [e],
		upper: [e, C.maxKey]
	};
}
function X(e) {
	return tt(e.kind);
}
function Z(e, t) {
	return X(e) && (t === null || e.createdAt >= t);
}
function vn(e) {
	return Math.max(0, e * 1e3);
}
function yn(e, t) {
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
		media: P(i.kind) ? [] : N(i),
		rawEvent: f(i),
		rawEventVerification: { ...sn },
		...s.channelEventId ? { channelEventId: s.channelEventId } : {},
		...s.channelRelayHints ? { channelRelayHints: s.channelRelayHints } : {},
		updatedAt: r,
		schemaVersion: 2
	};
}
function bn(e, t) {
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
async function xn(e, t) {
	if (t.length === 0) return /* @__PURE__ */ new Map();
	let n = await e.postHistoryDeletionRequests.where("targetEventId").anyOf(t).toArray(), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = r.get(e.targetEventId);
		t ? t.push(e) : r.set(e.targetEventId, [e]);
	}
	return r;
}
function Sn(e, t) {
	return e.length === t.length && e.every((e, n) => {
		let r = t[n];
		return e.url === r.url && e.mimeType === r.mimeType && e.alt === r.alt && e.blurhash === r.blurhash && e.dim === r.dim && e.size === r.size && e.uploadProtocol === r.uploadProtocol;
	});
}
function Cn(e, t) {
	return e.kind !== t.kind || e.content !== t.content || e.createdAt !== t.createdAt || e.postedAt !== t.postedAt || e.deletedAt !== t.deletedAt || e.deletionEventId !== t.deletionEventId || e.channelEventId !== t.channelEventId || !a(e.rawEvent, t.rawEvent) || e.rawEventVerification?.status !== t.rawEventVerification?.status || e.rawEventVerification?.ruleVersion !== t.rawEventVerification?.ruleVersion || !z(e.relayHints, t.relayHints) || !z(e.acceptedRelays, t.acceptedRelays) || !z(e.fetchedRelays, t.fetchedRelays) || !z(e.channelRelayHints, t.channelRelayHints) || !Sn(e.media, t.media) || e.tags.length !== t.tags.length || e.tags.some((e, n) => !z(e, t.tags[n]));
}
var wn = new class {
	db;
	now;
	console;
	constructor(e = x, t = Date.now, n = globalThis.console === void 0 ? {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	} : globalThis.console) {
		this.db = e, this.now = t, this.console = n;
	}
	async getByEventId(e) {
		if (!e) return null;
		let t = await this.db.postHistory.get(e);
		return t && X(t) ? t : null;
	}
	async getExistingEventIdsForPubkey(e) {
		if (!e.pubkeyHex || e.eventIds.length === 0) return [];
		let t = Array.from(new Set(e.eventIds.filter((e) => !!e)));
		return (await this.db.postHistory.bulkGet(t)).filter((t) => !!t && X(t) && t.pubkeyHex === e.pubkeyHex).map((e) => e.eventId);
	}
	async getAll(e) {
		return e.pubkeyHex ? _n((await this.db.postHistory.where("[pubkeyHex+postedAt]").between([e.pubkeyHex, C.minKey], [e.pubkeyHex, C.maxKey]).reverse().toArray()).filter(X)) : [];
	}
	async getSearchScanChunk(e) {
		if (!e.pubkeyHex) return {
			items: [],
			nextCursor: null,
			hasMore: !1
		};
		let t = K(e.limit), n = Y(e.pubkeyHex), r = e.cursor ? J(e.pubkeyHex, e.cursor) : n.upper, i = await this.db.postHistory.where(S).between(n.lower, r, !0, !e.cursor).reverse().limit(t).toArray(), a = i.at(-1);
		return {
			items: i.filter(X),
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
		let t = dn(e.page), n = fn(e.pageSize), r = Y(e.pubkeyHex);
		return this.db.postHistory.where(S).between(r.lower, r.upper).reverse().filter(X).offset((t - 1) * n).limit(n).toArray();
	}
	async getLatestVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = K(e.limit), n = G(e.visibleUntil), r = Y(e.pubkeyHex);
		return this.db.postHistory.where(S).between(r.lower, r.upper).reverse().filter((e) => Z(e, n)).limit(t).toArray();
	}
	async getOlderVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = K(e.limit), n = G(e.visibleUntil), r = Y(e.pubkeyHex), i = J(e.pubkeyHex, e.cursor);
		return this.db.postHistory.where(S).between(r.lower, i, !0, !1).reverse().filter((e) => Z(e, n)).limit(t).toArray();
	}
	async hasOlderVisiblePosts(e) {
		if (!e.pubkeyHex) return !1;
		let t = G(e.visibleUntil), n = this.db.postHistory.where(S).between(Y(e.pubkeyHex).lower, J(e.pubkeyHex, e.cursor), !0, !1), r = n;
		if (t !== null) {
			let i = this.db.postHistory.where("[pubkeyHex+createdAt]").between([e.pubkeyHex, t], [e.pubkeyHex, C.maxKey]), [a, o] = await Promise.all([n.count(), i.count()]);
			if (a === 0 || o === 0) return !1;
			r = o <= a ? i : n;
		}
		return await r.filter((n) => Z(n, t) && hn(n, e.cursor)).first() !== void 0;
	}
	async getNewerVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = K(e.limit), n = G(e.visibleUntil), r = Y(e.pubkeyHex), i = J(e.pubkeyHex, e.cursor);
		return (await this.db.postHistory.where(S).between(i, r.upper, !1, !0).filter((e) => Z(e, n)).limit(t).toArray()).reverse();
	}
	async getOldestVisibleChunk(e) {
		if (!e.pubkeyHex) return [];
		let t = K(e.limit), n = mn(e.query).contiguous ? G(e.visibleUntil) : null, r = Y(e.pubkeyHex);
		return n === null ? (await this.db.postHistory.where(S).between(r.lower, r.upper).filter(X).limit(t).toArray()).reverse() : (await this.db.postHistory.where("[pubkeyHex+createdAt]").between([e.pubkeyHex, n], [e.pubkeyHex, C.maxKey]).toArray()).filter(X).sort(q).slice(-t);
	}
	async getVisibleChunkFromCreatedAt(e) {
		if (!e.pubkeyHex) return [];
		let t = K(e.limit), n = pn(e.createdAt), r = mn(e.query).contiguous ? G(e.visibleUntil) : null, i = Y(e.pubkeyHex);
		return this.db.transaction("r", this.db.postHistory, async () => {
			let a = await this.db.postHistory.where(S).between(i.lower, i.upper).reverse().filter((e) => Z(e, r) && e.createdAt <= n).first();
			return a ? t === 1 ? [a] : [a, ...await this.db.postHistory.where(S).between(i.lower, J(e.pubkeyHex, a), !0, !1).reverse().filter((e) => Z(e, r)).limit(t - 1).toArray()] : (await this.db.postHistory.where(S).between(i.lower, i.upper).filter((e) => Z(e, r)).limit(t).toArray()).reverse();
		});
	}
	async getVisibleChunkAroundEventId(e) {
		if (!e.pubkeyHex) return [];
		let t = K(e.limit), n = Number.isFinite(e.keepAbove) ? Math.min(t - 1, Math.max(0, Math.trunc(e.keepAbove ?? 0))) : 0, r = G(e.visibleUntil), i = Y(e.pubkeyHex);
		return this.db.transaction("r", this.db.postHistory, async () => {
			let a = await this.db.postHistory.get(e.eventId);
			if (!a || a.pubkeyHex !== e.pubkeyHex || !Z(a, r)) return [];
			let o = J(e.pubkeyHex, a), s = n === 0 ? [] : await this.db.postHistory.where(S).between(o, i.upper, !1, !0).filter((e) => Z(e, r)).limit(n).toArray(), c = t - 1 - s.length, l = c === 0 ? [] : await this.db.postHistory.where(S).between(i.lower, o, !0, !1).reverse().filter((e) => Z(e, r)).limit(c).toArray(), u = t - 1 - s.length - l.length;
			if (u > 0) {
				let t = s[s.length - 1] ?? a, n = await this.db.postHistory.where(S).between(J(e.pubkeyHex, t), i.upper, !1, !0).filter((e) => Z(e, r)).limit(u).toArray();
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
		return !e || !Number.isFinite(t) ? !1 : await this.db.postHistory.where("[pubkeyHex+createdAt]").between([e, C.minKey], [e, Math.trunc(t)], !0, !1).filter(X).limit(1).count() > 0;
	}
	async getSparseChunk(e) {
		if (!e.pubkeyHex || !Number.isFinite(e.visibleUntil)) return [];
		let t = K(e.limit), n = Math.trunc(e.visibleUntil);
		if (e.direction !== "latest" && !e.cursor) return [];
		let r = e.cursor, i = (t) => X(t) && t.createdAt < n && (e.direction === "latest" || e.direction === "older" && !!r && hn(t, r) || e.direction === "newer" && !!r && gn(t, r)), a = Y(e.pubkeyHex), o = r ? J(e.pubkeyHex, r) : null, s = e.direction === "latest" ? this.db.postHistory.where(S).between(a.lower, a.upper) : e.direction === "older" ? this.db.postHistory.where(S).between(a.lower, o, !0, !1) : this.db.postHistory.where(S).between(o, a.upper, !1, !0), c = await (e.direction === "newer" ? s : s.reverse()).filter(i).limit(t).toArray();
		return e.direction === "newer" ? c.reverse() : c;
	}
	async countForPubkey(e) {
		return e ? this.db.postHistory.where("pubkeyHex").equals(e).filter(X).count() : 0;
	}
	async countVisibleForPubkey(e, t) {
		if (!e) return 0;
		let n = G(t);
		return n === null ? this.countForPubkey(e) : this.db.postHistory.where("[pubkeyHex+createdAt]").between([e, n], [e, C.maxKey]).filter(X).count();
	}
	async putPostedEvent(e) {
		let t = ln(e.event, e.attestation);
		if (!t) throw Error("invalid_post_history_raw_event");
		let n = F(t.event), r = e.repostTarget ? n && L(e.repostTarget.event, e.repostTarget.relayHints, n) : null;
		if (e.repostTarget && !r) throw Error("invalid_repost_target");
		if (e.localWriteScope && e.localWriteScope.ownerPubkeyHex !== t.event.pubkey) throw Error("invalid_post_history_owner");
		await this.db.transaction("rw", this.db.postHistory, this.db.postHistoryWriteGeneration, async () => {
			await V(this.db, e.localWriteScope);
			let i = await this.db.postHistory.get(t.event.id);
			await this.db.postHistory.put({
				...yn({
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
			}), await V(this.db, e.localWriteScope);
		}), R(t.event.pubkey), Pt({
			pubkeyHex: t.event.pubkey,
			eventId: t.event.id
		});
	}
	async attachRepostTarget(e) {
		let t = !1;
		return await this.db.transaction("rw", this.db.postHistory, this.db.postHistoryWriteGeneration, async () => {
			await V(this.db, e.localWriteScope);
			let n = await this.db.postHistory.get(e.outerEventId);
			if (!n || n.pubkeyHex !== e.localWriteScope.ownerPubkeyHex || n.deletedAt !== void 0 || !s(n.rawEvent, n) || !A(n.rawEvent)) return;
			let r = F(n);
			if (!r) return;
			let i = L(e.target, e.relayHints, r);
			if (!i) throw Error("invalid_repost_target");
			n.repostTarget && a(n.repostTarget.rawEvent, i.rawEvent) && z(n.repostTarget.relayHints, i.relayHints) || (await this.db.postHistory.update(n.id, {
				repostTarget: i,
				updatedAt: this.now()
			}), await V(this.db, e.localWriteScope), t = !0);
		}), t && R(e.localWriteScope.ownerPubkeyHex), t;
	}
	async upsertFetchedEvents(e) {
		let t = bn(e.events, this.console).flatMap((e) => {
			let t = ln(e.event, e.attestation);
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
		let r = e.fetchedAt ?? this.now(), i = t.map((e) => e.event.id), o = 0, s = 0, c = 0, l = 0, u = /* @__PURE__ */ new Set(), p = new U(this.db, this.now);
		try {
			await this.db.transaction("rw", [
				this.db.postHistory,
				this.db.postHistoryDeletionRequests,
				this.db.sensitivePayloads,
				...e.relayFetchCoverage || e.localWriteScope || e.localBrowsingWrite ? en(this.db) : []
			], async () => {
				if (await V(this.db, e.localWriteScope), await V(this.db, e.localBrowsingWrite), e.relayFetchCoverage && !await p.isCurrent(e.relayFetchCoverage)) throw new W();
				let m = await this.db.postHistory.bulkGet(i), h = /* @__PURE__ */ new Map(), g = await xn(this.db, i);
				m.forEach((e) => {
					e && h.set(e.eventId, e);
				});
				let _ = [], v = t.map((e) => {
					let t = h.get(e.event.id), i = n.sanitizeExternalRelayUrls([...t?.fetchedRelays ?? [], ...e.relayUrls]), p = !!t && !a(t.rawEvent, e.event), m = !t || !p || !cn(t.rawEventVerification);
					p && this.console.warn("post_history_raw_event_conflict", e.event.id);
					let v = !m && t ? {
						channelEventId: t.channelEventId,
						channelRelayHints: t.channelRelayHints
					} : d(e.event), ee = n.sanitizeExternalRelayUrls([
						...t?.relayHints ?? [],
						...e.relayUrls,
						...t?.acceptedRelays ?? []
					], { limit: n.EXTERNAL_INPUT_RELAY_LIMIT }), y = {
						id: e.event.id,
						eventId: e.event.id,
						pubkeyHex: t?.pubkeyHex ?? e.event.pubkey,
						kind: !m && t ? t.kind : e.event.kind,
						content: !m && t ? t.content : e.event.content,
						tags: !m && t ? t.tags.map((e) => [...e]) : e.event.tags.map((e) => [...e]),
						createdAt: !m && t ? t.createdAt : e.event.created_at,
						postedAt: t?.postedAt ?? vn(e.event.created_at),
						relayHints: ee,
						acceptedRelays: t?.acceptedRelays ?? [],
						...i.length > 0 ? { fetchedRelays: i } : {},
						media: P(e.event.kind) ? [] : !m && t ? un(t.media) : N(e.event),
						rawEvent: !m && t ? t.rawEvent : f(e.event),
						rawEventVerification: !m && t ? t.rawEventVerification : { ...sn },
						fetchedAt: r,
						lastSeenAt: r,
						...v.channelEventId ? { channelEventId: v.channelEventId } : t?.channelEventId ? { channelEventId: t.channelEventId } : {},
						...v.channelRelayHints ? { channelRelayHints: v.channelRelayHints } : t?.channelRelayHints ? { channelRelayHints: [...t.channelRelayHints] } : {},
						...t?.deletedAt === void 0 ? {} : { deletedAt: t.deletedAt },
						...t?.deletionEventId ? { deletionEventId: t.deletionEventId } : {},
						updatedAt: this.now(),
						...t?.repostTarget && F(e.event) && L(t.repostTarget.rawEvent, t.repostTarget.relayHints, F(e.event)) ? { repostTarget: t.repostTarget } : {},
						schemaVersion: 2
					}, b = !1;
					t ? Cn(t, y) ? (s += 1, b = !0) : c += 1 : (o += 1, b = !0);
					let te = (g.get(e.event.id) ?? []).flatMap((e) => {
						if (!(dt(y.kind) && y.pubkeyHex === e.targetAuthorPubkey && y.pubkeyHex === e.deletionEventPubkey)) return [];
						if (!ht(e)) {
							let t = {
								...e,
								targetVerified: !0,
								updatedAt: this.now(),
								schemaVersion: 2
							};
							return _.push(t), [t];
						}
						return [e];
					}).sort(gt);
					return y.deletedAt !== void 0 || te.length === 0 ? (b && u.add(y.pubkeyHex), y) : (l += 1, u.add(y.pubkeyHex), {
						...y,
						..._t(te[0]),
						updatedAt: this.now()
					});
				});
				if (_.length > 0 && await this.db.postHistoryDeletionRequests.bulkPut(_), await this.db.postHistory.bulkPut(v), e.relayFetchCoverage && (await p.record(e.relayFetchCoverage), !await p.isCurrent(e.relayFetchCoverage))) throw new W();
				e.localBrowsingWrite && await new an(this.db, this.now).record(e.localBrowsingWrite), await V(this.db, e.localWriteScope);
			});
		} catch (e) {
			if (e instanceof H) return {
				insertedCount: 0,
				updatedCount: 0,
				unchangedCount: 0,
				appliedDeletionCount: 0,
				applied: !1
			};
			throw e;
		}
		u.forEach(R);
		for (let e of t) M(e.event) && Qt(e.event.id, this.db, this.now).catch(() => {
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
		return e ? (await this.db.postHistory.where("[pubkeyHex+createdAt]").between([e, C.minKey], [e, C.maxKey]).filter(X).first())?.createdAt ?? null : null;
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
		}), r && R(r);
	}
	async deleteForPubkey(e) {
		e && await this.db.transaction("rw", [this.db.postHistory, ...en(this.db)], async () => (await new U(this.db, this.now).clearForPubkey(e), this.db.postHistory.where("pubkeyHex").equals(e).delete())) > 0 && R(e);
	}
	async deleteLocalHistoryForPubkey(e) {
		if (!e) return;
		let { deletedPostHistoryCount: t, deletedPayloadCount: n } = await nn(this.db, e, this.now);
		(t > 0 || n > 0) && R(e);
	}
}();
function Tn(e) {
	if (e.kind !== 36) return !1;
	let t = e.tags.filter((e) => e[0] === "k");
	return t.length === 1 && t[0].length >= 2 && at.some((e) => t[0][1] === String(e));
}
var En = new class {
	db;
	now;
	constructor(e = x, t = Date.now) {
		this.db = e, this.now = t;
	}
	async putCandidate(e) {
		let t = Ye(e.event, e.attestation) ? l(e.event) : A(e.event)?.event;
		if (!t || !Tn(t)) throw Error("invalid_sensitive_payload_candidate");
		await this.db.transaction("rw", [this.db.sensitivePayloads, ...e.localWriteScope ? [this.db.postHistoryWriteGeneration] : []], async () => {
			await V(this.db, e.localWriteScope);
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
			return await this.db.sensitivePayloads.put(i), await V(this.db, e.localWriteScope), !0;
		}) && (R(t.pubkey), await $t(t.id, this.db, this.now));
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
		}), R(t.pubkeyHex));
	}
	async deleteCandidatesForPubkey(e) {
		await this.db.sensitivePayloads.where("pubkeyHex").equals(e).delete() > 0 && R(e);
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/reactionReference.ts
function Q(e) {
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
function $(e, t) {
	return e.eventId === t.eventId && (!e.authorHint || t.targetAuthorPubkey == null || e.authorHint === t.targetAuthorPubkey) && (e.targetKindHint == null || t.targetKind == null || e.targetKindHint === t.targetKind);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postReactionUtils.ts
var Dn = [
	1,
	6,
	7,
	16,
	42,
	1111
];
function On(e) {
	return Dn.includes(e);
}
function kn(e, t, r, i, a, o) {
	let s = wt(e);
	if (!s || !On(s.event.kind)) throw Error("invalid_reaction_target");
	let c = s.event, l = n.sanitizeExternalRelayUrls([...i])[0], u = oe(r), d = [
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
	}, p = Q(f).reference;
	if (!p || !$(p, {
		eventId: c.id,
		targetAuthorPubkey: c.pubkey,
		targetKind: c.kind
	})) throw Error("invalid_reaction_target");
	return f;
}
function An(e) {
	return n.sanitizeExternalRelayUrls(e ?? [], { limit: n.EXTERNAL_INPUT_RELAY_LIMIT });
}
function jn(e) {
	return e.sort((e, t) => e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) : e.createdAt - t.createdAt);
}
function Mn(e, t) {
	return e.length === t.length && e.every((e, n) => z(e, t[n]));
}
function Nn(e) {
	return e === 1 || e === 7 || e === 42 || e === 1111;
}
function Pn(e) {
	return e.kind === 1 || e.kind === 42 || e.kind === 1111 ? c(e).parentId : e.kind === 7 ? Q(e).reference?.eventId ?? null : null;
}
function Fn(e) {
	if (e.kind === 1 || e.kind === 42 || e.kind === 1111) return c(e).rootId ?? void 0;
}
function In(e) {
	return e.kind === 7 ? ["reaction"] : ["direct-reply"];
}
function Ln(e) {
	return e.filter((e) => e.kind === 1 || e.kind === 42 || e.kind === 1111);
}
function Rn(e) {
	return e.filter((e) => e.kind === 7);
}
function zn(e, t) {
	return e.parentEventId !== t.parentEventId || e.rootEventId !== t.rootEventId || e.authorPubkey !== t.authorPubkey || e.kind !== t.kind || e.content !== t.content || e.createdAt !== t.createdAt || !z(e.relayUrls, t.relayUrls) || !z(e.discoveredAs, t.discoveredAs) || !Mn(e.tags, t.tags) || !a(e.rawEvent, t.rawEvent);
}
var Bn = new class {
	db;
	now;
	console;
	reactionRepairPromise;
	constructor(e = x, t = Date.now, n = globalThis.console === void 0 ? {
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
				let e = A(r.rawEvent), i = e ? Q(e.event).reference : null;
				!i || i.eventId === r.eventId ? n.push(r.id) : t.push({
					record: r,
					reference: i
				});
			}
			let r = Array.from(new Set(t.map(({ reference: e }) => e.eventId))), i = await this.db.postHistory.bulkGet(r), a = new Map(i.flatMap((e) => e ? [[e.eventId, e]] : [])), o = [];
			for (let { record: e, reference: r } of t) {
				let t = a.get(r.eventId);
				t && !$(r, {
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
			let i = Q(e).reference;
			return i && $(i, t) ? !0 : (r.push(e.id), !1);
		});
		return r.length && await this.db.postHistoryChildInteractions.bulkDelete(r), i;
	}
	async getChildInteractions(e, t) {
		if (!e) return [];
		await this.ensureSavedReactionsRepaired();
		let n = await this.db.postHistoryChildInteractions.where("[parentEventId+createdAt]").between([e, C.minKey], [e, C.maxKey]).toArray();
		return jn(t ? await this.filterKnownReactionTargets(n, [t]) : n);
	}
	async getChildInteractionsForParents(e, t) {
		let n = Array.from(new Set(e.filter((e) => !!e)));
		if (n.length === 0) return [];
		await this.ensureSavedReactionsRepaired();
		let r = await this.db.postHistoryChildInteractions.where("parentEventId").anyOf(n).toArray();
		return t ? this.filterKnownReactionTargets(r, t) : r;
	}
	async getDirectReplyInteractions(e) {
		return Ln(await this.getChildInteractions(e));
	}
	async getReactionInteractions(e) {
		return Rn(await this.getChildInteractions(e));
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
			if (!t?.event?.id || !Nn(t.event.kind) || Pn(t.event) !== e.parentEventId || t.event.id === e.parentEventId) {
				n += 1;
				continue;
			}
			let i = r.get(t.event.id);
			i && !a(i.event, t.event) ? (this.console.warn("post_history_child_interaction_conflict", t.event.id), n += 1) : r.set(t.event.id, {
				event: t.event,
				relayUrls: An([...i?.relayUrls ?? [], ...t.relayUrls ?? []])
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
			if (typeof e.expectedChildGeneration == "number" && await Gt(this.db) !== e.expectedChildGeneration) return;
			let r = i.some((e) => e.event.kind === 7) ? await this.db.postHistory.get(e.parentEventId) : void 0, a = [...e.reactionTarget ? [e.reactionTarget] : [], ...r ? [{
				eventId: r.eventId,
				targetAuthorPubkey: r.pubkeyHex,
				targetKind: r.kind
			}] : []], l = i.filter((e) => {
				if (e.event.kind !== 7) return !0;
				let t = Q(e.event).reference;
				return !t || a.some((e) => !$(t, e)) ? (n += 1, !1) : !0;
			});
			if (l.length === 0) return;
			let u = l.map((e) => e.event.id), d = await this.db.postHistoryChildInteractions.bulkGet(u), p = /* @__PURE__ */ new Map();
			d.forEach((e) => {
				e && p.set(e.eventId, e);
			});
			let m = l.map((n) => {
				let r = p.get(n.event.id), i = An([...r?.relayUrls ?? [], ...n.relayUrls ?? []]), a = Fn(n.event), l = Array.from(/* @__PURE__ */ new Set([...r?.discoveredAs ?? [], ...In(n.event)])), u = {
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
				return r ? zn(r, u) ? s += 1 : c += 1 : o += 1, u;
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
}(), Vn = 3e3, Hn = 3e5, Un = 15e3, Wn = 4;
function Gn(e, t) {
	if (!e || typeof e != "object") return !1;
	let n = e;
	return n.kind === 10002 && n.pubkey === t && typeof n.id == "string" && /^[0-9a-f]{64}$/i.test(n.id) && typeof n.created_at == "number" && Number.isSafeInteger(n.created_at) && n.created_at >= 0 && Array.isArray(n.tags);
}
function Kn(e, t) {
	return {
		pubkey: e,
		status: t,
		readRelays: [],
		writeRelays: [],
		createdAt: null,
		eventId: null
	};
}
function qn(e) {
	return {
		...e,
		readRelays: [...e.readRelays],
		writeRelays: [...e.writeRelays]
	};
}
function Jn(e) {
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
var Yn = class {
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
		let i = n.sanitizeExternalRelayUrls(b() ? te() : r), a = n.sanitizeExternalRelayUrls([...i, ...t.discoveryRelays ?? []]), o = this.cache.get(e), s = !!o && o.expiresAt > this.now(), c = this.inFlight.get(e);
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
			if (n.length === 0) return Promise.resolve(t.deadlineAt !== void 0 && o.receivedAt >= t.deadlineAt ? Kn(e, "network-error") : qn(o.entry));
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
				entry: qn(n.entry),
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
					entry: qn(t),
					receivedAt: t.eventId === a.previous?.entry.eventId ? a.previous.receivedAt : a.candidates.get(t.eventId)?.receivedAt ?? this.now(),
					expiresAt: this.now() + (t.status === "found" ? Hn : Un),
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
		if (r) return qn(r);
		let i = t.completedAt !== void 0 && t.completedAt < n;
		return Kn(e, t.hadNetworkError || !i ? "network-error" : "not-found");
	}
	forConsumer(e, t, n) {
		let r = n.deadlineAt ?? Infinity;
		return n.deadlineAt === void 0 && !n.resolveOnReadRoute ? t.promise : r <= this.now() ? Promise.resolve(this.snapshot(e, t, r)) : new Promise((i) => {
			let a = !1, o, s = () => {
				a || (a = !0, o !== void 0 && this.clearTimeoutFn(o), t.candidateListeners.delete(c), i(this.snapshot(e, t, r)));
			}, c = () => {
				let n = this.snapshot(e, t, r);
				if (n.readRelays.length === 0) return;
				let i = this.cache.get(e), a = i !== void 0 && i.expiresAt > this.now() && i.entry.eventId === n.eventId, o = n.eventId === null ? void 0 : t.candidates.get(n.eventId), c = o !== void 0 && o.receivedAt < r;
				(a || c) && s();
			};
			n.resolveOnReadRoute && (t.candidateListeners.add(c), c()), !a && Number.isFinite(r) && (o = this.setTimeoutFn(s, r - this.now())), t.promise.then(s);
		});
	}
	isNewer(e, t) {
		return !t || t.createdAt === null || t.eventId === null ? !0 : e.createdAt === null || e.eventId === null ? !1 : e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) < 0 : e.createdAt > t.createdAt;
	}
	async withConcurrencySlot(e) {
		this.activeLookups >= Wn ? await new Promise((e) => this.queue.push(e)) : this.activeLookups += 1;
		try {
			return await e();
		} finally {
			let e = this.queue.shift();
			e ? e() : --this.activeLookups;
		}
	}
	fetchLatest(e, t, n) {
		return t.length === 0 ? Promise.resolve(Kn(e, "network-error")) : new Promise((r) => {
			let i = re(), a, o, s, c = !1, l = () => {
				s !== void 0 && (this.clearTimeoutFn(s), s = void 0), o?.unsubscribe?.(), o = void 0;
			}, u = (t = !1) => {
				c || (c = !0, l(), r(a || Kn(e, t ? "network-error" : "not-found")));
			};
			try {
				s = this.setTimeoutFn(() => u(!a), Vn);
				let r = this.rxNostr.use(i, { on: { relays: t } }).subscribe({
					next: (t) => {
						if (c || !Gn(t.event, e)) return;
						let r = this.now(), i = Jn(t.event);
						n(i, r), this.isNewer(i, a) && (a = i);
					},
					complete: () => u(),
					error: () => u(!0)
				});
				if (c) {
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
}, Xn = /* @__PURE__ */ new WeakMap();
function Zn(e) {
	let t = Xn.get(e);
	return t || (t = new Yn(e), Xn.set(e, t)), t;
}
export { et as $, Ot as A, pt as B, Ft as C, Tt as D, P as E, mt as F, ct as G, vt as H, gt as I, lt as J, M as K, ft as L, kt as M, wt as N, Dt as O, N as P, $e as Q, ht as R, Rt as S, F as T, _t as U, yt as V, st as W, j as X, it as Y, rt as Z, B as _, $ as a, Ye as at, R as b, wn as c, Qe as ct, $t as d, Pe as dt, tt as et, Qt as f, O as ft, Gt as g, V as h, On as i, Ge as it, I as j, jt as k, on as l, Ie as lt, H as m, ue as mt, Bn as n, A as nt, Q as o, Ze as ot, Zt as p, Ne as pt, ot as q, kn as r, Be as rt, En as s, Ke as st, Zn as t, qe as tt, tn as u, Fe as ut, z as v, At as w, zt as x, Bt as y, dt as z };
